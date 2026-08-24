"""
SmartBid AI backend — Azure Functions (Python v2 programming model).

Two HTTP endpoints behind the APIM gateway:
  • POST /scope/generate   → Scope of Supply (RAG grounded on the docs index)
  • POST /quotation/extract → Supplier quotation → structured line items (no RAG)

Auth is Entra ID / Managed Identity end to end — no API keys, no Key Vault.
SmartBid ALWAYS sends its own system prompt (from app/config/ai.prompts.ts).
Scanned/image PDFs are read with gpt-5.1-mini vision .
"""
import os
import io
import json
import base64
import logging
from datetime import datetime, timezone
from typing import List, Tuple

import azure.functions as func
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import AzureOpenAI
from azure.search.documents import SearchClient
from azure.search.documents.models import VectorizableTextQuery
import fitz                       # PyMuPDF — PDF text + page rasterization
from docx import Document         # python-docx — Word text

app = func.FunctionApp()

# Auth via Managed Identity (Entra ID) — no API keys, no Key Vault
credential = DefaultAzureCredential()
token_provider = get_bearer_token_provider(
    credential, "https://cognitiveservices.azure.com/.default"
)

# Azure OpenAI client (Entra ID token instead of an API key)
openai_client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    azure_ad_token_provider=token_provider,
    api_version="2024-10-21",  # adjust to the version your gpt-5.1-mini deployment requires
)

# Azure AI Search client (Entra ID / RBAC instead of an API key)
search_client = SearchClient(
    endpoint=os.environ["AZURE_SEARCH_ENDPOINT"],
    index_name=os.environ["AZURE_SEARCH_INDEX"],   # smartbid-docs-index
    credential=credential,
)

CHAT_DEPLOYMENT = os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT"]  # "gpt-5.1-mini"
TEXT_MIN_CHARS = 20  # below this we treat the document as scanned/image-only


def extract_text_or_images(file_bytes: bytes, file_name: str) -> Tuple[str, List[bytes]]:
    """Prefer extracted text (cheap). For scanned/image PDFs with no text,
    return page images (PNG) so the vision model can read them. No OCR service."""
    name = (file_name or "").lower()
    if name.endswith(".pdf"):
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = "\n".join(page.get_text() for page in doc).strip()
        if len(text) >= TEXT_MIN_CHARS:
            return text, []                       # text-based PDF → cheap path
        images = [page.get_pixmap(dpi=150).tobytes("png") for page in doc]
        return "", images                          # scanned PDF → vision path
    if name.endswith((".docx", ".doc")):
        d = Document(io.BytesIO(file_bytes))
        return "\n".join(p.text for p in d.paragraphs).strip(), []
    return file_bytes.decode("utf-8", errors="ignore").strip(), []


def ensure_text(text: str, images: List[bytes]) -> str:
    """Guarantee plain text. If we only have page images (scanned document),
    use gpt-5.1-mini's vision as the OCR engine to transcribe them."""
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


@app.route(route="scope/generate", methods=["POST"])
def generate_scope(req: func.HttpRequest) -> func.HttpResponse:
    # Scope of Supply generation, grounded with RAG.
    # SmartBid ALWAYS sends its own system prompt (scope-of-supply-v2).
    try:
        body = req.get_json()

        # 1) Decode + get text (vision-OCR only if the PDF is scanned)
        file_name = body.get("fileName", "document")
        file_bytes = base64.b64decode(body["fileContent"])
        text, images = extract_text_or_images(file_bytes, file_name)
        document_text = body.get("documentText") or ensure_text(text, images)
        if len(document_text) < TEXT_MIN_CHARS:
            return _unreadable()

        # The system prompt is ALWAYS provided by SmartBid (never optional)
        system_prompt = body["systemPrompt"]

        # 2) RAG retrieval — AI Search vectorizes the query text itself
        vector_query = VectorizableTextQuery(
            text=document_text[:8000], k_nearest_neighbors=5, fields="text_vector"
        )
        results = search_client.search(
            search_text=document_text[:8000],   # hybrid: keyword + vector
            vector_queries=[vector_query],
            select=["title", "chunk", "sourceUrl", "manufacturer", "docModel"],
            top=5,
        )
        reference_material = "\n\n---\n\n".join(
            f"[{r['title']}] ({r.get('sourceUrl', '')})\n{r['chunk']}" for r in results
        )

        # 3) Append retrieved Reference Material to OUR system prompt
        grounded_prompt = (
            f"{system_prompt}\n\n"
            "=== REFERENCE MATERIAL (retrieved by backend — do not invent beyond this) ===\n"
            f"{reference_material}\n"
            "=== END REFERENCE MATERIAL ==="
        )

        # 4) Call the chat model (gpt-5.1-mini) with JSON output
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
            "isComplete": model_json.get("isComplete", True),
            "warnings": [],
            "chunksProcessed": 1,
            "sourceDocument": file_name,
            "analyzedAt": _now_iso(),
        }
        return func.HttpResponse(json.dumps(response), mimetype="application/json", status_code=200)

    except Exception as e:
        logging.exception("scope/generate failed")
        return func.HttpResponse(
            json.dumps({"error": "Analysis failed", "details": str(e)}),
            status_code=500, mimetype="application/json",
        )


@app.route(route="quotation/extract", methods=["POST"])
def extract_quotation(req: func.HttpRequest) -> func.HttpResponse:
    # Supplier quotation extraction (no RAG).
    # SmartBid ALWAYS sends its own system prompt (quotation-extraction-v1).
    try:
        body = req.get_json()

        # Decode + get text (vision-OCR only if the quotation is scanned)
        file_name = body.get("fileName", "quotation")
        file_bytes = base64.b64decode(body["fileContent"])
        text, images = extract_text_or_images(file_bytes, file_name)
        document_text = body.get("documentText") or ensure_text(text, images)
        if len(document_text) < TEXT_MIN_CHARS:
            return _unreadable()

        # The system prompt is ALWAYS provided by SmartBid
        system_prompt = body["systemPrompt"]

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
            "warnings": [],
            "sourceDocument": file_name,
            "extractedAt": _now_iso(),
        }
        return func.HttpResponse(json.dumps(response), mimetype="application/json", status_code=200)

    except Exception as e:
        logging.exception("quotation/extract failed")
        return func.HttpResponse(
            json.dumps({"error": "Extraction failed", "details": str(e)}),
            status_code=500, mimetype="application/json",
        )
