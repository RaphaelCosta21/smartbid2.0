"""
SmartBid AI backend — Azure Functions (Python v2 programming model).

 Three HTTP endpoints (Function App, EasyAuth-protected):
  • POST /scope/generate   → Scope of Supply (RAG grounded on the docs index)
  • POST /quotation/extract → Supplier quotation → structured line items (no RAG)
  • POST /chat              → Knowledge Q&A (deduplicated RAG over the docs index)

Auth is Entra ID / Managed Identity end to end — no API keys, no Key Vault.
Access is restricted in Entra ID: only the approved group can obtain a token for
the Function App's API scope, and EasyAuth rejects anything else.
SmartBid ALWAYS sends its own system prompt (from app/config/ai.prompts.ts).
Scanned/image PDFs are read with gpt-5-mini vision.
"""
import os
import io
import re
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
    api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2025-04-01-preview"),
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
# Knowledge chat retrieval. `top` counts chunks, so it must be far larger than the
# number of documents we want back once duplicates from the same file are dropped.
SEMANTIC_CONFIG = os.environ.get("AZURE_SEARCH_SEMANTIC_CONFIG", "smartbid-semantic-config")
CHAT_DEFAULT_TOP_K = int(os.environ.get("CHAT_DEFAULT_TOP_K", "20"))
CHAT_MAX_TOP_K = int(os.environ.get("CHAT_MAX_TOP_K", "50"))
CHAT_MAX_DOCUMENTS = int(os.environ.get("CHAT_MAX_DOCUMENTS", "8"))
CHAT_MAX_CONTEXT_CHARS = int(os.environ.get("CHAT_MAX_CONTEXT_CHARS", "40000"))
CHAT_MAX_HISTORY = int(os.environ.get("CHAT_MAX_HISTORY", "6"))
CHAT_SELECT_FIELDS = [
    "title", "chunk", "sourceUrl", "parent_id", "docType", "docCategory",
    "manufacturer", "docModel", "docKeywords", "docDescription", "docRevision",
]
# When true, the 500 payload also carries the upstream error message. Keep it off
# in steady state; turn it on to triage without Application Insights access.
DEBUG_ERRORS = os.environ.get("AI_DEBUG_ERRORS", "").lower() in ("1", "true", "yes")
# Azure AI Search simple-query operators. Raw document text routinely contains
# unbalanced quotes/parentheses, which make the query parser reject the request.
_SEARCH_OPERATORS = re.compile(r'["()|+*?\\]')

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


def _chat_bad_request() -> func.HttpResponse:
    return func.HttpResponse(
        json.dumps({
            "error": "Invalid chat request",
            "details": "Expected JSON with messages and systemPrompt.",
        }),
        status_code=400, mimetype="application/json",
    )


def _server_error(
    message: str, stage: str = "", exc: Optional[BaseException] = None
) -> func.HttpResponse:
    # The stage tells IT where to look; the exception text is only echoed when
    # AI_DEBUG_ERRORS is on — otherwise it stays in Application Insights.
    details = "An internal error occurred. Please contact IT if it persists."
    if stage:
        details = f"Failed during {stage}. {details}"
    if exc is not None:
        details = f"{details} [{type(exc).__name__}]"
        if DEBUG_ERRORS:
            details = f"{details} {str(exc)[:500]}"
    return func.HttpResponse(
        json.dumps({"error": message, "details": details}),
        status_code=500, mimetype="application/json",
    )


def _model_json(completion: Any, stage: str) -> Dict[str, Any]:
    """Parse the model's JSON answer. A reasoning model can return an empty
    message (e.g. the token budget was spent on reasoning) — fail loudly instead
    of letting json.loads(None) surface as an opaque TypeError."""
    choice = (completion.choices or [None])[0]
    content = (getattr(choice.message, "content", None) or "").strip() if choice else ""
    if not content:
        finish = getattr(choice, "finish_reason", "<none>") if choice else "<none>"
        raise ValueError(f"{stage}: model returned no content (finish_reason={finish})")
    return json.loads(content)


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
    query = f"{hint}\n{body_text}".strip() if hint else body_text
    return re.sub(r"\s+", " ", _SEARCH_OPERATORS.sub(" ", query)).strip()


def _reference_material(query_text: str) -> Tuple[str, List[str]]:
    """Hybrid (keyword + vector) retrieval. Retrieval is an enhancement, not a
    hard dependency: if AI Search is unavailable the analysis still runs, with a
    warning, instead of failing the whole request."""
    try:
        vector_query = VectorizableTextQuery(
            text=query_text, k_nearest_neighbors=5, fields="text_vector"
        )
        results = search_client.search(
            search_text=query_text,
            vector_queries=[vector_query],
            select=["title", "chunk", "sourceUrl", "manufacturer", "docModel"],
            top=5,
        )
        return "\n\n---\n\n".join(
            f"[{r.get('title', 'Untitled')}] ({r.get('sourceUrl', '')})\n{r.get('chunk', '')}"
            for r in results
        ), []
    except Exception:
        logging.exception("scope/generate — AI Search retrieval failed")
        return "", [
            "The reference library could not be searched — the analysis is based "
            "only on the uploaded document. Review the results carefully."
        ]


# ---------------------------------------------------------------------------
# Caller identity — for logging only. Authorization lives in Entra ID: the
# SharePoint client app registration is assignment-restricted to the approved
# group, so only those users can obtain a token for this API's aud/scope, and
# EasyAuth validates it before the request reaches this code. Downstream calls
# to Azure OpenAI / AI Search use the Function App's system-assigned identity,
# not on-behalf-of, so no per-user grant is needed there either.
# ---------------------------------------------------------------------------
_UPN_CLAIM_TYPES = (
    "preferred_username",
    "upn",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn",
)


def _caller_upn(req: func.HttpRequest) -> str:
    """UPN of the authenticated caller, from the EasyAuth X-MS-CLIENT-PRINCIPAL
    header. External requests can't set this header — only App Service
    Authentication sets it, after validating the token."""
    upn = req.headers.get("X-MS-CLIENT-PRINCIPAL-NAME", "")
    if upn:
        return upn.lower()
    raw = req.headers.get("X-MS-CLIENT-PRINCIPAL")
    if not raw:
        return ""
    try:
        principal = json.loads(base64.b64decode(raw).decode("utf-8"))
        claims = principal.get("claims", []) or []
        upn = next(
            (c.get("val", "") for c in claims if c.get("typ") in _UPN_CLAIM_TYPES),
            "",
        )
    except Exception:
        logging.exception("Failed to decode X-MS-CLIENT-PRINCIPAL")
    return upn.lower()


@app.route(route="scope/generate", methods=["POST"], auth_level=ANONYMOUS)
def generate_scope(req: func.HttpRequest) -> func.HttpResponse:
    # Scope of Supply generation, grounded with RAG.
    # SmartBid ALWAYS sends its own system prompt (scope-of-supply-v3).
    try:
        body, file_name, file_bytes, system_prompt, override = _parse_request(req, "document")
    except (ValueError, KeyError, TypeError) as e:
        logging.warning("Malformed scope/generate request: %s", e)
        return _bad_request()

    logging.info(
        "scope/generate — caller=%s bid=%s promptVersion=%s",
        _caller_upn(req) or "<unknown>",
        body.get("bidNumber") or body.get("templateId") or "<none>",
        body.get("promptVersion") or "<none>",
    )

    stage = "document parsing"
    try:
        # 1) Get text (vision-OCR only if the PDF is scanned)
        document_text, warnings = _document_text(file_bytes, file_name, override)
        if len(document_text) < TEXT_MIN_CHARS:
            return _unreadable()

        # 2) RAG retrieval — AI Search vectorizes the query text itself
        stage = "reference retrieval"
        context_lines = _context_lines(body)
        query_text = _retrieval_query(context_lines, document_text)
        reference_material, retrieval_warnings = _reference_material(query_text)
        warnings.extend(retrieval_warnings)

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
        stage = "the model call"
        completion = openai_client.chat.completions.create(
            model=CHAT_DEPLOYMENT,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": grounded_prompt},
                {"role": "user", "content": document_text},
            ],
        )
        model_json = _model_json(completion, "scope/generate")

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

    except Exception as e:
        logging.exception("scope/generate failed during %s", stage)
        return _server_error("Analysis failed", stage, e)


@app.route(route="quotation/extract", methods=["POST"], auth_level=ANONYMOUS)
def extract_quotation(req: func.HttpRequest) -> func.HttpResponse:
    # Supplier quotation extraction (no RAG).
    # SmartBid ALWAYS sends its own system prompt (see promptVersion in the body),
    # including the configured Group/SubGroup taxonomy used to classify each line.
    try:
        body, file_name, file_bytes, system_prompt, override = _parse_request(req, "quotation")
    except (ValueError, KeyError, TypeError) as e:
        logging.warning("Malformed quotation/extract request: %s", e)
        return _bad_request()

    logging.info(
        "quotation/extract — caller=%s promptVersion=%s",
        _caller_upn(req) or "<unknown>",
        body.get("promptVersion") or "<none>",
    )

    stage = "document parsing"
    try:
        document_text, warnings = _document_text(file_bytes, file_name, override)
        if len(document_text) < TEXT_MIN_CHARS:
            return _unreadable()

        stage = "the model call"
        completion = openai_client.chat.completions.create(
            model=CHAT_DEPLOYMENT,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": document_text},
            ],
        )
        model_json = _model_json(completion, "quotation/extract")

        # Shape to IQuotationExtractionResult
        response = {
            "items": model_json.get("items", []),
            "warnings": warnings,
            "sourceDocument": file_name,
            "extractedAt": _now_iso(),
        }
        return func.HttpResponse(json.dumps(response), mimetype="application/json", status_code=200)

    except Exception as e:
        logging.exception("quotation/extract failed during %s", stage)
        return _server_error("Extraction failed", stage, e)


# ---------------------------------------------------------------------------
# Knowledge chat
#
# Retrieval here is tuned the opposite way from scope generation: the query is
# one short question instead of a long client document, and the goal is "which
# documents mention X" instead of "categorise these items". So it gets its own
# helper — do NOT refactor the two into one.
# ---------------------------------------------------------------------------


def _chat_document_block(r: Dict[str, Any]) -> str:
    """Render one retrieved document with the catalogued metadata. Without this
    header the model only sees a file name and can only guess the client,
    proposal number or revision."""
    meta_line = " | ".join(
        f"{label}: {r.get(field)}"
        for label, field in (
            ("Type", "docType"),
            ("Client", "manufacturer"),
            ("Ref", "docModel"),
            ("Rev", "docRevision"),
        )
        if r.get(field)
    )
    extra_line = " | ".join(
        f"{label}: {r.get(field)}"
        for label, field in (
            ("Discipline", "docCategory"),
            ("Keywords", "docKeywords"),
        )
        if r.get(field)
    )
    parts = [f"[{r.get('title', 'Untitled')}] ({r.get('sourceUrl', '')})"]
    if meta_line:
        parts.append(meta_line)
    if extra_line:
        parts.append(extra_line)
    if r.get("docDescription"):
        parts.append(f"Scope: {r.get('docDescription')}")
    parts.append("--- excerpt ---")
    parts.append(r.get("chunk", ""))
    return "\n".join(parts)


def _chat_search(query_text: str, top_k: int, doc_type: Optional[str], semantic: bool):
    """One hybrid search pass. Semantic ranking is billed per tier, so the caller
    retries without it rather than losing grounding entirely."""
    search_args: Dict[str, Any] = {
        "search_text": query_text,
        "vector_queries": [
            VectorizableTextQuery(
                text=query_text, k_nearest_neighbors=top_k, fields="text_vector"
            )
        ],
        "select": CHAT_SELECT_FIELDS,
        "top": top_k,
    }
    if semantic:
        search_args["query_type"] = "semantic"
        search_args["semantic_configuration_name"] = SEMANTIC_CONFIG
    if doc_type:
        search_args["filter"] = "docType eq '{}'".format(doc_type.replace("'", "''"))
    return search_client.search(**search_args)


def _chat_reference_material(
    query_text: str, top_k: int, doc_type: Optional[str]
) -> Tuple[str, List[Dict[str, str]], List[str]]:
    """Hybrid retrieval for chat, deduplicated per document.

    `top` counts CHUNKS, not documents, so a single long PDF can otherwise fill
    every slot with near-identical cover pages. Keeping the best chunk per
    parent_id is what makes "which proposals mention X" answerable.
    Returns (reference_block, retrieved_for_diagnostics, warnings).
    """
    warnings: List[str] = []
    try:
        try:
            results = _chat_search(query_text, top_k, doc_type, semantic=True)
            results = list(results)
        except Exception:
            logging.warning(
                "chat — semantic ranking unavailable, falling back to hybrid",
                exc_info=True,
            )
            results = list(_chat_search(query_text, top_k, doc_type, semantic=False))

        seen: set = set()
        blocks: List[str] = []
        retrieved: List[Dict[str, str]] = []
        budget = 0
        for r in results:
            parent = r.get("parent_id") or r.get("sourceUrl") or r.get("title")
            if parent in seen:
                continue
            chunk = r.get("chunk") or ""
            if budget + len(chunk) > CHAT_MAX_CONTEXT_CHARS and blocks:
                break
            seen.add(parent)
            budget += len(chunk)
            blocks.append(_chat_document_block(r))
            retrieved.append(
                {
                    "title": str(r.get("title") or "Untitled"),
                    "url": str(r.get("sourceUrl") or ""),
                    "snippet": chunk[:200],
                }
            )
            if len(blocks) >= CHAT_MAX_DOCUMENTS:
                break
        return "\n\n---\n\n".join(blocks), retrieved, warnings
    except Exception:
        logging.exception("chat — AI Search retrieval failed")
        return "", [], [
            "The reference library could not be searched — the answer is not "
            "grounded in any document."
        ]


def _chat_messages(body: Dict[str, Any]) -> List[Dict[str, str]]:
    """Normalize the conversation, keeping only the most recent turns."""
    raw = body.get("messages")
    if not isinstance(raw, list):
        return []
    messages: List[Dict[str, str]] = []
    for entry in raw:
        if not isinstance(entry, dict):
            continue
        role = "assistant" if entry.get("role") == "assistant" else "user"
        content = str(entry.get("content") or "").strip()
        if content:
            messages.append({"role": role, "content": content})
    return messages[-CHAT_MAX_HISTORY:]


@app.route(route="chat", methods=["POST"], auth_level=ANONYMOUS)
def chat(req: func.HttpRequest) -> func.HttpResponse:
    # Free-form Q&A over the indexed document library.
    # SmartBid ALWAYS sends its own system prompt (see promptVersion in the body).
    try:
        body: Dict[str, Any] = req.get_json()
        system_prompt = body["systemPrompt"]
    except (ValueError, KeyError, TypeError) as e:
        logging.warning("Malformed chat request: %s", e)
        return _chat_bad_request()

    messages = _chat_messages(body)
    last_user = next(
        (m["content"] for m in reversed(messages) if m["role"] == "user"), ""
    )
    if not last_user:
        return _chat_bad_request()

    try:
        top_k = int(body.get("topK") or CHAT_DEFAULT_TOP_K)
    except (TypeError, ValueError):
        top_k = CHAT_DEFAULT_TOP_K
    top_k = max(5, min(top_k, CHAT_MAX_TOP_K))
    doc_type = str(body.get("docTypeFilter") or "").strip() or None

    logging.info(
        "chat — caller=%s promptVersion=%s topK=%s docType=%s turns=%s",
        _caller_upn(req) or "<unknown>",
        body.get("promptVersion") or "<none>",
        top_k,
        doc_type or "<any>",
        len(messages),
    )

    stage = "reference retrieval"
    try:
        # Retrieval follows the LAST question only; older turns drag it off topic.
        query_text = re.sub(r"\s+", " ", _SEARCH_OPERATORS.sub(" ", last_user)).strip()
        reference_material, retrieved, warnings = _chat_reference_material(
            query_text, top_k, doc_type
        )

        grounded_prompt = (
            f"{system_prompt}\n\n"
            "=== REFERENCE MATERIAL (retrieved by backend — do not invent beyond this) ===\n"
            f"{reference_material}\n"
            "=== END REFERENCE MATERIAL ==="
        )

        stage = "the model call"
        completion = openai_client.chat.completions.create(
            model=CHAT_DEPLOYMENT,
            response_format={"type": "json_object"},
            messages=[{"role": "system", "content": grounded_prompt}] + messages,
        )
        model_json = _model_json(completion, "chat")

        answer = str(model_json.get("answer") or "").strip()
        refused = bool(model_json.get("refused"))
        response = {
            "answer": answer,
            "refused": refused,
            "citations": [] if refused else model_json.get("citations", []),
            "followUps": model_json.get("followUps", []),
            # Produced here rather than asked of the model: exact, and free.
            "retrieved": retrieved,
            "warnings": warnings,
            "answeredAt": _now_iso(),
        }
        return func.HttpResponse(
            json.dumps(response), mimetype="application/json", status_code=200
        )

    except Exception as e:
        logging.exception("chat failed during %s", stage)
        return _server_error("Chat failed", stage, e)
