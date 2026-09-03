"""
SmartBid AI backend — Azure Functions (Python v2 programming model).

Two HTTP endpoints (Function App, EasyAuth-protected):
  • POST /scope/generate   → Scope of Supply (RAG grounded on the docs index)
  • POST /quotation/extract → Supplier quotation → structured line items (no RAG)

Auth is Entra ID / Managed Identity end to end — no API keys, no Key Vault.
Callers must carry the "SmartBid.User" app role — no allowlist, no bypass.
SmartBid ALWAYS sends its own system prompt (from app/config/ai.prompts.ts).
Scanned/image PDFs are read with gpt-5-mini vision.
"""
import os
import io
import json
import base64
import logging
import threading
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

import azure.functions as func
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import AzureOpenAI
from azure.search.documents import SearchClient
from azure.search.documents.models import VectorizableTextQuery
import pypdfium2 as pdfium     # PDF text + page rasterization (BSD/Apache)
from docx import Document      # python-docx — Word text

app = func.FunctionApp()

# EasyAuth is the gate for these routes — the SPFx client has no Functions key.
ANONYMOUS = func.AuthLevel.ANONYMOUS

# Auth via Managed Identity (Entra ID)
credential = DefaultAzureCredential()
token_provider = get_bearer_token_provider(
    credential, "https://cognitiveservices.azure.com/.default"
)

# Azure OpenAI client (Entra ID token instead of an API key)
openai_client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    azure_ad_token_provider=token_provider,
    # App setting so IT can move to the version gpt-5-mini requires without a redeploy.
    api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2024-10-21"),
)

# Azure AI Search client (Entra ID / RBAC instead of an API key)
search_client = SearchClient(
    endpoint=os.environ["AZURE_SEARCH_ENDPOINT"],
    index_name=os.environ["AZURE_SEARCH_INDEX"],   # smartbid-docs-index
    credential=credential,
)

CHAT_DEPLOYMENT = os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT"]  # "gpt-5-mini"
TEXT_MIN_CHARS = 20  # below this we treat the document as scanned/image-only
# Guardrails so an oversized upload degrades gracefully instead of blowing the
# model context window or the function timeout.
MAX_DOC_CHARS = int(os.environ.get("MAX_DOC_CHARS", "200000"))
MAX_VISION_PAGES = int(os.environ.get("MAX_VISION_PAGES", "20"))
VISION_DPI = 150
SEARCH_QUERY_CHARS = 8000   # AI Search query budget (context hint + document text)
CONTEXT_HINT_CHARS = 1500

# PDFium is not thread-safe, and the Functions host runs invocations concurrently.
_pdfium_lock = threading.Lock()


def _page_to_png(page) -> bytes:
    bitmap = page.render(scale=VISION_DPI / 72, rev_byteorder=True)
    buffer = io.BytesIO()
    bitmap.to_pil().save(buffer, format="PNG")
    return buffer.getvalue()


def extract_text_or_images(
    file_bytes: bytes, file_name: str
) -> Tuple[str, List[bytes], List[str]]:
    """Prefer extracted text (cheap). For scanned/image PDFs with no text,
    return page images (PNG) so the vision model can read them. No OCR service."""
    name = (file_name or "").lower()
    warnings: List[str] = []
    if name.endswith(".pdf"):
        with _pdfium_lock, pdfium.PdfDocument(file_bytes) as pdf:
            text = "\n".join(
                page.get_textpage().get_text_bounded() for page in pdf
            ).strip()
            if len(text) >= TEXT_MIN_CHARS:
                return text, [], warnings      # text-based PDF → cheap path
            page_count = len(pdf)
            pages = min(page_count, MAX_VISION_PAGES)
            if page_count > pages:
                warnings.append(
                    f"This scanned document has {page_count} pages — only the first "
                    f"{pages} were read. Split the file to analyze the rest."
                )
            images = [_page_to_png(pdf[i]) for i in range(pages)]
        return "", images, warnings            # scanned PDF → vision path
    if name.endswith((".docx", ".doc")):
        d = Document(io.BytesIO(file_bytes))
        return "\n".join(p.text for p in d.paragraphs).strip(), [], warnings
    return file_bytes.decode("utf-8", errors="ignore").strip(), [], warnings


def ensure_text(text: str, images: List[bytes]) -> str:
    """Guarantee plain text. If we only have page images (scanned document),
    use gpt-5-mini's vision as the OCR engine to transcribe them."""
    if text:
        return text
    if not images:
        return ""
    parts = [{
        "type": "text",
        "text": "Transcribe ALL text from these document pages verbatim, "
                "preserving the original language, order and structure.",
    }]
    for img in images:
        b64 = base64.b64encode(img).decode()
        parts.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/png;base64,{b64}", "detail": "high"},
        })
    resp = openai_client.chat.completions.create(
        model=CHAT_DEPLOYMENT,
        messages=[{"role": "user", "content": parts}],
    )
    return (resp.choices[0].message.content or "").strip()


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _unreadable() -> func.HttpResponse:
    # Matches the frontend's HTTP 422 handling
    return func.HttpResponse(
        json.dumps({
            "error": "Document unreadable",
            "details": "No text could be extracted from the file. "
                       "Try another file or enter the data manually.",
        }),
        status_code=422, mimetype="application/json",
    )


def _bad_request() -> func.HttpResponse:
    return func.HttpResponse(
        json.dumps({
            "error": "Invalid request",
            "details": "Expected JSON with fileContent (base64) and systemPrompt.",
        }),
        status_code=400, mimetype="application/json",
    )


def _server_error(message: str) -> func.HttpResponse:
    # Never echo the exception to the caller — details stay in Application Insights.
    return func.HttpResponse(
        json.dumps({
            "error": message,
            "details": "An internal error occurred. Please contact IT if it persists.",
        }),
        status_code=500, mimetype="application/json",
    )


def _document_text(
    file_bytes: bytes, file_name: str, override: Optional[str]
) -> Tuple[str, List[str]]:
    """Return (text, warnings), capping the length so a huge upload degrades
    into a partial analysis instead of a model context error."""
    text, images, warnings = extract_text_or_images(file_bytes, file_name)
    document_text = override or ensure_text(text, images)
    if len(document_text) > MAX_DOC_CHARS:
        document_text = document_text[:MAX_DOC_CHARS]
        warnings.append(
            "The document is very long — only the first part was analyzed. "
            "Review the results and split the file if items are missing."
        )
    return document_text, warnings


def _parse_request(
    req: func.HttpRequest, default_name: str
) -> Tuple[Dict[str, Any], str, bytes, str, Optional[str]]:
    """Return (body, file_name, file_bytes, system_prompt, document_text_override).
    Raises ValueError / KeyError / TypeError on a malformed body."""
    body: Dict[str, Any] = req.get_json()
    return (
        body,
        body.get("fileName", default_name),
        base64.b64decode(body["fileContent"]),
        body["systemPrompt"],
        body.get("documentText"),
    )


def _context_lines(body: Dict[str, Any]) -> List[str]:
    """BID metadata SmartBid sends with every request (see utils/aiContext.ts)."""
    lines: List[str] = []
    division = str(body.get("division") or "").strip()
    service_line = str(body.get("serviceLine") or "").strip()
    resource_types = [
        str(r).strip() for r in (body.get("resourceTypes") or []) if str(r).strip()
    ]
    summary = str(body.get("contextSummary") or "").strip()
    if division:
        lines.append(f"Division: {division}")
    if service_line:
        lines.append(f"Service line: {service_line}")
    if resource_types:
        lines.append("Resource types: " + ", ".join(resource_types))
    if summary:
        lines.append(f"BID context: {summary}")
    return lines


def _retrieval_query(context_lines: List[str], document_text: str) -> str:
    """Bias retrieval towards the BID's division/service line, so a datasheet from
    an unrelated business area doesn't outrank a relevant one."""
    hint = " ".join(context_lines)[:CONTEXT_HINT_CHARS]
    body_text = document_text[: max(0, SEARCH_QUERY_CHARS - len(hint) - 1)]
    return f"{hint}\n{body_text}".strip() if hint else body_text


# ---------------------------------------------------------------------------
# Authorization — EasyAuth authenticates the caller (App Service injects the
# identity into request headers); we re-check the app role here. The Entra app
# role assignment is the SINGLE source of truth: no UPN allowlist, no bypass,
# default-deny. Pair it with "Assignment required" on the enterprise app so
# Entra refuses to issue a token to unassigned users in the first place.
# ---------------------------------------------------------------------------
REQUIRED_APP_ROLE = os.environ.get("REQUIRED_APP_ROLE", "SmartBid.User").strip()
_UPN_CLAIM_TYPES = (
    "preferred_username",
    "upn",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn",
)
# v2 tokens use "roles"; v1 tokens use the long WS-Fed URI. EasyAuth also reports
# the actual type it mapped roles to in the principal's "role_typ".
_ROLE_CLAIM_TYPES = (
    "roles",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
)


def _caller_identity(req: func.HttpRequest) -> Tuple[str, List[str]]:
    """Return (upn, roles) for the authenticated caller from the EasyAuth
    X-MS-CLIENT-PRINCIPAL header. External requests can't set this header —
    only App Service Authentication sets it, after validating the token."""
    upn = req.headers.get("X-MS-CLIENT-PRINCIPAL-NAME", "")
    roles: List[str] = []
    raw = req.headers.get("X-MS-CLIENT-PRINCIPAL")
    if raw:
        try:
            principal = json.loads(base64.b64decode(raw).decode("utf-8"))
            claims = principal.get("claims", []) or []
            role_types = set(_ROLE_CLAIM_TYPES)
            if principal.get("role_typ"):
                role_types.add(principal["role_typ"])
            roles = [
                c.get("val", "").strip()
                for c in claims
                if c.get("typ") in role_types and c.get("val", "").strip()
            ]
            if not upn:
                upn = next(
                    (c.get("val", "") for c in claims if c.get("typ") in _UPN_CLAIM_TYPES),
                    "",
                )
        except Exception:
            logging.exception("Failed to decode X-MS-CLIENT-PRINCIPAL")
    return upn.lower(), roles


def _forbidden() -> func.HttpResponse:
    return func.HttpResponse(
        json.dumps({
            "error": "Not authorized",
            "details": "Your account is not permitted to use the SmartBid AI service.",
        }),
        status_code=403, mimetype="application/json",
    )


def _authorize(req: func.HttpRequest) -> Optional[func.HttpResponse]:
    """Return a 403 response unless the caller carries the required app role."""
    if not REQUIRED_APP_ROLE:
        # Misconfiguration must fail closed, never open.
        logging.error("REQUIRED_APP_ROLE is not set — denying every AI call.")
        return _forbidden()
    upn, roles = _caller_identity(req)
    if REQUIRED_APP_ROLE not in roles:
        logging.warning("Unauthorized AI call — caller=%s roles=%s", upn or "<unknown>", roles)
        return _forbidden()
    logging.info("Authorized AI call — caller=%s", upn or "<unknown>")
    return None


@app.route(route="scope/generate", methods=["POST"], auth_level=ANONYMOUS)
def generate_scope(req: func.HttpRequest) -> func.HttpResponse:
    # Scope of Supply generation, grounded with RAG.
    # SmartBid ALWAYS sends its own system prompt (scope-of-supply-v3).
    denied = _authorize(req)
    if denied is not None:
        return denied

    try:
        body, file_name, file_bytes, system_prompt, override = _parse_request(req, "document")
    except (ValueError, KeyError, TypeError) as e:
        logging.warning("Malformed scope/generate request: %s", e)
        return _bad_request()

    logging.info(
        "scope/generate — bid=%s promptVersion=%s",
        body.get("bidNumber") or body.get("templateId") or "<none>",
        body.get("promptVersion") or "<none>",
    )

    try:
        # 1) Get text (vision-OCR only if the PDF is scanned)
        document_text, warnings = _document_text(file_bytes, file_name, override)
        if len(document_text) < TEXT_MIN_CHARS:
            return _unreadable()

        # 2) RAG retrieval — AI Search vectorizes the query text itself
        context_lines = _context_lines(body)
        query_text = _retrieval_query(context_lines, document_text)
        vector_query = VectorizableTextQuery(
            text=query_text, k_nearest_neighbors=5, fields="text_vector"
        )
        results = search_client.search(
            search_text=query_text,   # hybrid: keyword + vector
            vector_queries=[vector_query],
            select=["title", "chunk", "sourceUrl", "manufacturer", "docModel"],
            top=5,
        )
        reference_material = "\n\n---\n\n".join(
            f"[{r.get('title', 'Untitled')}] ({r.get('sourceUrl', '')})\n{r.get('chunk', '')}"
            for r in results
        )

        # 3) Append the BID context and retrieved Reference Material to OUR system prompt
        bid_context = (
            "=== BID CONTEXT (from SmartBid) ===\n"
            + "\n".join(context_lines)
            + "\n=== END BID CONTEXT ===\n\n"
        ) if context_lines else ""
        grounded_prompt = (
            f"{system_prompt}\n\n"
            f"{bid_context}"
            "=== REFERENCE MATERIAL (retrieved by backend — do not invent beyond this) ===\n"
            f"{reference_material}\n"
            "=== END REFERENCE MATERIAL ==="
        )

        # 4) Call the chat model (gpt-5-mini) with JSON output
        completion = openai_client.chat.completions.create(
            model=CHAT_DEPLOYMENT,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": grounded_prompt},
                {"role": "user", "content": document_text},
            ],
        )
        model_json = json.loads(completion.choices[0].message.content)

        # 5) Shape to IAIAnalysisResult (frontend assigns id/lineNumber)
        response = {
            "scopeItems": model_json.get("scopeItems", []),
            "suggestedClarifications": model_json.get("suggestedClarifications", []),
            "isComplete": bool(model_json.get("isComplete", True)) and not warnings,
            "warnings": warnings,
            "chunksProcessed": 1,
            "sourceDocument": file_name,
            "analyzedAt": _now_iso(),
        }
        return func.HttpResponse(json.dumps(response), mimetype="application/json", status_code=200)

    except Exception:
        logging.exception("scope/generate failed")
        return _server_error("Analysis failed")


@app.route(route="quotation/extract", methods=["POST"], auth_level=ANONYMOUS)
def extract_quotation(req: func.HttpRequest) -> func.HttpResponse:
    # Supplier quotation extraction (no RAG).
    # SmartBid ALWAYS sends its own system prompt (quotation-extraction-v1).
    denied = _authorize(req)
    if denied is not None:
        return denied

    try:
        body, file_name, file_bytes, system_prompt, override = _parse_request(req, "quotation")
    except (ValueError, KeyError, TypeError) as e:
        logging.warning("Malformed quotation/extract request: %s", e)
        return _bad_request()

    logging.info(
        "quotation/extract — promptVersion=%s", body.get("promptVersion") or "<none>"
    )

    try:
        document_text, warnings = _document_text(file_bytes, file_name, override)
        if len(document_text) < TEXT_MIN_CHARS:
            return _unreadable()

        completion = openai_client.chat.completions.create(
            model=CHAT_DEPLOYMENT,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": document_text},
            ],
        )
        model_json = json.loads(completion.choices[0].message.content)

        # Shape to IQuotationExtractionResult
        response = {
            "items": model_json.get("items", []),
            "warnings": warnings,
            "sourceDocument": file_name,
            "extractedAt": _now_iso(),
        }
        return func.HttpResponse(json.dumps(response), mimetype="application/json", status_code=200)

    except Exception:
        logging.exception("quotation/extract failed")
        return _server_error("Extraction failed")
