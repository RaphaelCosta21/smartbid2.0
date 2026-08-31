# SmartBid 2.0 — Azure AI Backend

Provisioning package for the SmartBid AI integration. Hand this folder to the
Azure/IT team. Nothing here ships in the SPFx bundle — it is deployed to Azure.

The SmartBid web part calls the **Azure Function App directly** (protected by
**EasyAuth / App Service Authentication** — there is no APIM). It fronts **Azure
OpenAI** + **Azure AI Search**. Auth is **Entra ID / Managed Identity** end to
end — no API keys, no Key Vault.

```
Browser (SmartBid SPFx)
   │  Entra ID user token (AadHttpClient)  ── App A ──►  Function App EasyAuth
   │                                                        │
   │                                                        ▼
   │                                                   Function App (Python)
   │                                     Managed Identity ├──► Azure OpenAI (gpt-5-mini)
   │                                     Managed Identity └──► Azure AI Search (smartbid-docs-index)
   │
AI Search Indexer ── App B ──►  SharePoint  (reads smartBidDocs: Datasheets + Manuals and Catalogs)
```

---

## Contents

| Path                                       | What it is                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| `ai-search/01-datasource.json`             | SharePoint data source — scoped to the two folders only                        |
| `ai-search/02-index.json`                  | Vector index (`smartbid-docs-index`) + integrated vectorizer + semantic config |
| `ai-search/03-skillset.json`               | Split + Azure OpenAI embedding + index projections                             |
| `ai-search/04-indexer.json`                | Ties it together; daily schedule (`PT24H`)                                     |
| `function-app/function_app.py`             | The two HTTP endpoints (Python v2 model)                                       |
| `function-app/requirements.txt`            | Python dependencies                                                            |
| `function-app/host.json`                   | Functions host config (10-min timeout)                                         |
| `function-app/local.settings.json.example` | App settings template                                                          |

---

## 1. Two Entra ID app registrations (they are different on purpose)

|                 | **App A** — web part → gateway  | **App B** — AI Search → SharePoint                     |
| --------------- | ------------------------------- | ------------------------------------------------------ |
| Guards          | user → APIM/Function            | the indexer reading SharePoint                         |
| Permission type | delegated (signed-in user)      | **application**                                        |
| Permissions     | custom API scope on the gateway | Microsoft Graph `Files.Read.All` + `Sites.Read.All`    |
| Lives in        | the browser (SPFx)              | only inside Azure (data source connection string)      |
| Credential      | none (SSO)                      | client secret **or** federated credential (secretless) |

App B needs **admin consent** for the Graph application permissions.

> There is also a **third** app registration — the Function App's own API app
> (`opgbbes-prd-fa-aadapp`), which EasyAuth uses to validate the caller's token
> (audience `api://opgbbes-prd-fa-aadapp.oceaneering.com`). App A is
> `opgbbes-prd-sharepoint-aadapp` (web-part client), App B is
> `opgbbes-prd-search-aadapp` (indexer). Downstream, the Function reaches Azure
> OpenAI + AI Search via its **system-assigned Managed Identity** (see §4) —
> not on-behalf-of, not API keys.

---

## 2. Azure AI Search — the reference index

**Prerequisites**

- Azure AI Search **Basic tier or higher** (Free does not support the SharePoint indexer).
- The **SharePoint indexer is in preview** — register once at <https://aka.ms/azure-cognitive-search/indexer-preview> and use a **preview REST API** (e.g. `api-version=2026-05-01-preview`).
- An **Azure OpenAI embedding deployment** (e.g. `text-embedding-3-small`, 1536 dims). The index `dimensions` (1536) **must match** the chosen model.

**Fill the placeholders** (`<...>`) in the JSON files:

- `01-datasource.json` → `<APP_B_CLIENT_ID>`, `<APP_B_CLIENT_SECRET>`, `<TENANT_ID>` (App B = `opgbbes-prd-search-aadapp`; or use a federated credential — see below)
- `02-index.json` and `03-skillset.json` → already filled for `cog-opgb-bes-prd-ai-openai` / `text-embedding-3-small` (1536 dims)

**Deploy order** (REST, `Content-Type: application/json`, `api-key: <search-admin-key>`):

1. `POST /datasources` ← `01-datasource.json`
2. `POST /indexes` ← `02-index.json`
3. `POST /skillsets` ← `03-skillset.json`
4. `POST /indexers` ← `04-indexer.json`

**Scope:** only the `Datasheets` and `Manuals and Catalogs` folders of `smartBidDocs`
are indexed (via `includeFolder`). `photos`, `Queries`, `Quotations` are excluded.
Renaming those folders breaks incremental indexing and requires updating the query.
`Manuals and Catalogs` has spaces — if the service rejects the literal path, URL-encode it
(`Manuals%20and%20Catalogs`).

> **Secretless option for App B (recommended):** instead of `ApplicationSecret`, use a
> federated credential with a managed identity:
> `...;ApplicationId=<APP_B_CLIENT_ID>;TenantId=<TENANT_ID>;FederatedCredentialApplicationId=<managed-identity-client-id>`.
> See the SharePoint indexer docs, Step 3 (Configuring the registered application with a managed identity).

> **SharePoint Lists are not supported** by this indexer. `Assets Catalog_` and
> `Clarifications Database` (both Lists) need a separate mechanism later (push via the
> Function App, or export to Blob + blob indexer). Out of scope for this package.

---

## 3. Function App — the two endpoints

### Recommended stack

| Setting           | Value                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language          | **Python 3.11 or 3.12** (3.13 is the newest Azure Functions supports — **3.14 is not supported yet**; also confirm PyMuPDF/Azure SDK wheels exist for the chosen version) |
| Functions runtime | **v4**, Python **programming model v2** (decorators)                                                                                                                      |
| OS                | **Linux** (required for Python)                                                                                                                                           |
| Hosting plan      | **Flex Consumption** or **Elastic Premium (EP1)** — avoid plain Consumption (short timeout + cold starts for document + LLM calls)                                        |
| Identity          | **system-assigned Managed Identity** enabled                                                                                                                              |
| Timeout           | `functionTimeout` 5–10 min (`host.json` set to 10)                                                                                                                        |

**Why Python (not TypeScript, even though the web part is TS):** the Function App is a
**standalone HTTP microservice** — it shares only a JSON contract with the frontend, no
code. Python has the most mature, best-documented SDKs and samples for Azure OpenAI +
Azure AI Search + PDF/vision processing, which lowers implementation effort and risk.
Node.js/TypeScript and C#/.NET are equally supported if the team prefers one language.

### Endpoints

- `POST /scope/generate` — client document → Scope of Supply (RAG grounded on `smartbid-docs-index`).
- `POST /quotation/extract` — supplier quotation → structured line items (no RAG).

SmartBid **always sends its own system prompt** (`systemPrompt` + `promptVersion`) from
`src/webparts/smartBid20/app/config/ai.prompts.ts`. The backend appends the retrieved
**Reference Material** to it for the scope flow. The full request/response contract is
`src/webparts/smartBid20/app/models/IAIAnalysis.ts` (the source of truth) and
`SmartBid-AI-Backend-API-Contract.md`.

### Scanned documents

Text-based PDFs/DOCX are parsed with **PyMuPDF** / **python-docx**. Scanned/image PDFs
are read with **gpt-5-mini vision** (the model transcribes page images) — **no Azure AI
Document Intelligence required**.

### App settings (Configuration → Application settings)

```
FUNCTIONS_WORKER_RUNTIME       = python
AZURE_OPENAI_ENDPOINT          = https://cog-opgb-bes-prd-ai-openai.openai.azure.com
AZURE_OPENAI_CHAT_DEPLOYMENT   = gpt-5-mini
AZURE_SEARCH_ENDPOINT          = https://srch-opgbbes-prd.search.windows.net
AZURE_SEARCH_INDEX             = smartbid-docs-index
```

The Function reads these at runtime via `os.environ[...]` — endpoints are **never hardcoded**
in `function_app.py`, so IT can change a resource without editing or redeploying code.

No embedding deployment is set here — the embedding model is referenced only by the
AI Search index vectorizer and skillset, never by the Function App.

---

## 4. RBAC (replaces API keys / Key Vault)

| Identity                      | Role                             | On resource                                                           |
| ----------------------------- | -------------------------------- | --------------------------------------------------------------------- |
| Function App managed identity | `Cognitive Services OpenAI User` | Azure OpenAI                                                          |
| Function App managed identity | `Search Index Data Reader`       | Azure AI Search                                                       |
| AI Search managed identity    | `Cognitive Services OpenAI User` | Azure OpenAI (for the vectorizer/skillset embeddings during indexing) |

---

## 5. Frontend wiring (after the backend is live)

In `src/webparts/smartBid20/app/config/ai.config.ts`:

- `apimBaseUrl` = the Function App base URL (`https://fa-opgb-bes-prd-fa.azurewebsites.net/api`) — no APIM
- `aadResource` = the Function App **App ID URI** (`api://opgbbes-prd-fa-aadapp.oceaneering.com`, the EasyAuth audience)
- `enabled` = `true`

Approve the matching `webApiPermissionRequests` (resource `opgbbes-prd-fa-aadapp`, scope `user_impersonation`) in
SharePoint Admin → Advanced → API access. This uses the standard SPFx `AadHttpClient` (the shared "SharePoint Online
Client Extensibility" principal), so **no custom web-part app registration is required**.
