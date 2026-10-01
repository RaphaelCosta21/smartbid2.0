# SmartBid 2.0 — Azure AI Backend

Provisioning package for the SmartBid AI integration. Hand this folder to the
Azure/IT team. Nothing here ships in the SPFx bundle — it is deployed to Azure.

The SmartBid web part calls the **Azure Function App directly** (protected by
**EasyAuth / App Service Authentication** — there is no APIM). It fronts **Azure
OpenAI** + **Azure AI Search**. Auth is **Entra ID / Managed Identity** end to
end — no API keys, no Key Vault. The browser signs in with **MSAL
(authorization code + PKCE)** against SmartBid's own SPA app registration — the
tenant-wide SharePoint "Client Extensibility" grant is **not** used.

```
Browser (SmartBid SPFx + MSAL PKCE)
   │  Entra ID user token (App A, SPA)  ─────────────►  Function App EasyAuth
   │                                                        │
   │                                                        ▼
   │                                                   Function App (Python)
   │                                     Managed Identity ├──► Azure OpenAI (gpt-5-mini)
   │                                     Managed Identity └──► Azure AI Search (smartbid-docs-index)
   │
AI Search Indexer ── App B ──►  SharePoint  (reads smartBidDocs: Datasheets + Manuals and Catalogs)
        └──── Managed Identity ──►  Function App  (POST /skills/chunk — section-aware chunking)
```

---

## Contents

| Path                                                           | What it is                                                                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `ai-search/01-datasource.json`                                 | SharePoint data source — scoped to the two folders only                              |
| `ai-search/ai-search-updated/smartbid-docs-index.json`         | Vector index + vectorizer + semantic config + `sectionPath` (current)                |
| `ai-search/ai-search-updated/smartbid-docs-skillset.json`      | Custom chunking skill + Azure OpenAI embedding + index projections (current)         |
| `ai-search/ai-search-updated/smartbid-docs-indexer.json`       | Ties it together; `PT6H` schedule (current)                                          |
| `ai-search/02-index.json` `03-skillset.json` `04-indexer.json` | **Superseded** by `ai-search-updated/` — kept only as reference                      |
| `function-app/function_app.py`                                 | The four HTTP routes (Python v2 model)                                               |
| `function-app/document_structure.py`                           | Section-aware Markdown chunking used by `POST /skills/chunk` (standard library only) |
| `function-app/requirements.txt`                                | Python dependencies                                                                  |
| `function-app/host.json`                                       | Functions host config (10-min timeout)                                               |
| `function-app/local.settings.json.example`                     | App settings template                                                                |
| `CHATBOT-BACKEND-PLAN.md`                                      | Original chatbot backlog — `/chat` and the retrieval fixes are now implemented       |

---

## 1. Two Entra ID app registrations (they are different on purpose)

|                 | **App A** — web part → gateway  | **App B** — AI Search → SharePoint                     |
| --------------- | ------------------------------- | ------------------------------------------------------ |
| Guards          | user → Function App             | the indexer reading SharePoint                         |
| Permission type | delegated (signed-in user)      | **application**                                        |
| Permissions     | custom API scope on the gateway | Microsoft Graph `Files.Read.All` + `Sites.Read.All`    |
| Lives in        | the browser (SPFx + MSAL)       | only inside Azure (data source connection string)      |
| Credential      | none (PKCE, public client)      | client secret **or** federated credential (secretless) |

App B needs **admin consent** for the Graph application permissions.

**App A must be configured as a SPA public client:**

- Authentication → **Add a platform → Single-page application** → redirect URI =
  the value set in `AI_CONFIG.auth.redirectUri` (a single fixed SharePoint page,
  e.g. `https://oceaneering.sharepoint.com/sites/G-OPGSSRBrazilEngineering/_layouts/15/blank.aspx`).
  The SPA platform is what enables authorization code + PKCE; **do not** use the
  "Web" platform (it would require a client secret).
- Allow public client flows: not needed. No client secret is ever created.
- API permissions → **My APIs** → `opgbbes-prd-fa-aadapp` → delegated
  `user_impersonation`. Grant admin consent (or pre-authorize App A on the API
  app under **Expose an API → Authorized client applications** so users never
  see a consent prompt).
- The consent is scoped to **this app only** — no tenant-wide SharePoint API
  access approval, unlike the previous `AadHttpClient` design.

> If EasyAuth is configured with an **allowed client applications** list on the
> Function App, add App A's client id to it (and remove the SharePoint Online
> Client Extensibility principal `08e18876-6177-487e-b8b5-cf950c1e598c` once the
> switch is validated).

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
- `ai-search-updated/*.json` → already filled for `cog-opgbbes-openai-prd` / `text-embedding-3-small` (1536 dims), for the search service `srch-opgbbes-prd` and for the Function App `fa-opgb-bes-prd-fa`

**Chunking is done by our own custom skill**, not by the built-in `SplitSkill`. The
SharePoint indexer never exposes `/document/file_data`, so the built-in **Document Layout**
skill cannot run against this data source. `smartbid-docs-skillset.json` therefore calls
`POST /skills/chunk` on the Function App, which rebuilds each document's outline as Markdown,
drops the header/footer that repeats on every page, and emits one chunk per section plus a
per-document outline chunk. Before deploying the skillset:

1. Enable the **system-assigned managed identity** on `srch-opgbbes-prd` and note its client id.
2. If the Function App's API app registration (`opgbbes-prd-fa-aadapp`) has
   **Assignment required = Yes**, assign that managed identity to the enterprise application.
3. If EasyAuth uses an **allowed client applications** list, add the same client id.

The skill's `authResourceId` is already set to `api://opgbbes-prd-fa-aadapp.oceaneering.com`.

**Deploy order** (REST, `api-version=2026-05-01-preview`, `Content-Type: application/json`, `api-key: <search-admin-key>`):

1. `POST /datasources` ← `01-datasource.json`
2. `POST /indexes` ← `ai-search-updated/smartbid-docs-index.json`
3. `POST /skillsets` ← `ai-search-updated/smartbid-docs-skillset.json`
4. `POST /indexers` ← `ai-search-updated/smartbid-docs-indexer.json`
5. `POST /indexers/smartbid-docs-indexer/reset` then `POST /indexers/smartbid-docs-indexer/run`

> **Updating an existing index:** Azure AI Search lets you add fields but not change
> `searchable` on an existing one, and this definition flips `docRevision` to searchable and
> adds `sectionPath`. So a `PUT` over the previous index fails — delete and recreate it. The
> index holds only data derived from SharePoint, so nothing is lost; the library is fully
> rebuilt by the indexer run. The `reset` is mandatory whenever the chunking strategy changes,
> otherwise only modified files are reprocessed.

**Scope:** the `Datasheets`, `Manuals and Catalogs` and `Past Bids` folders of `smartBidDocs`
are indexed (via `includeFolder`). `photos`, `Queries`, `Quotations` are excluded.
Renaming those folders breaks incremental indexing and requires updating the query.
`Manuals and Catalogs` has spaces — if the service rejects the literal path, URL-encode it
(`Manuals%20and%20Catalogs`).

> **Past Bids:** SmartBid writes one Markdown file per completed BID to `smartBidDocs/Past Bids`
> (`DocType = Past Bid`, `Manufacturer` = client, `DocModel` = BID number). The indexer must
> accept `.md` and the `/skills/chunk` deployment must include the Markdown mode of
> `document_structure.build_chunks` (ATX headings, no boilerplate stripping) — deploy both
> before SmartBid starts publishing, or reset the Past Bids documents afterwards.
> The same deployment adds `POST /clarifications/suggest`, a separate Past Bids pass in
> `/scope/generate`, and the optional `pastBidsLedger` / `pastBidRefs` fields of `/chat`
> (see `SmartBid-AI-Backend-API-Contract.md` §5, §7, §7a). All limits are app settings
> (`SCOPE_PAST_BID_*`, `CHAT_PAST_BID_*`, `CHAT_MAX_LEDGER_CHARS`, `CLARIFICATION_*`).

> **Secretless option for App B (recommended):** instead of `ApplicationSecret`, use a
> federated credential with a managed identity:
> `...;ApplicationId=<APP_B_CLIENT_ID>;TenantId=<TENANT_ID>;FederatedCredentialApplicationId=<managed-identity-client-id>`.
> See the SharePoint indexer docs, Step 3 (Configuring the registered application with a managed identity).

> **SharePoint Lists ARE supported** since the `2026-05-01-preview` REST API — the version this
> package already targets. `Assets Catalog_` and `Clarifications Database` can be indexed by a
> second data source with `"container": { "name": "allSiteLists" }` (or `allSiteContent` to cover
> libraries + lists + pages in one indexer). No push mechanism or Blob export needed. Two
> caveats: the index key must map from `metadata_spo_site_asset_item_id` with `base64Encode`, and
> there is **no auto-mapping** for it — declare the `fieldMappings` entry explicitly. Each list
> column becomes a source field you map individually; item content also lands in `content` as
> JSON. Permissions are the same `Files.Read.All` + `Sites.Read.All` App B already holds.
> See "Index SharePoint lists" in the indexer docs. Not wired yet — planned for the
> `/clarifications/suggest` flow.

---

## 3. Function App — the HTTP routes

### Recommended stack

| Setting           | Value                                                                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language          | **Python 3.11 or 3.12** (3.13 is the newest Azure Functions supports — **3.14 is not supported yet**; also confirm pypdfium2/Azure SDK wheels exist for the chosen version) |
| Functions runtime | **v4**, Python **programming model v2** (decorators)                                                                                                                        |
| OS                | **Linux** (required for Python)                                                                                                                                             |
| Hosting plan      | **Flex Consumption** or **Elastic Premium (EP1)** — avoid plain Consumption (short timeout + cold starts for document + LLM calls)                                          |
| Identity          | **system-assigned Managed Identity** enabled                                                                                                                                |
| Timeout           | `functionTimeout` 5–10 min (`host.json` set to 10)                                                                                                                          |

**Why Python (not TypeScript, even though the web part is TS):** the Function App is a
**standalone HTTP microservice** — it shares only a JSON contract with the frontend, no
code. Python has the most mature, best-documented SDKs and samples for Azure OpenAI +
Azure AI Search + PDF/vision processing, which lowers implementation effort and risk.
Node.js/TypeScript and C#/.NET are equally supported if the team prefers one language.

### Endpoints

Called by the web part:

- `POST /scope/generate` — client document → Scope of Supply (RAG grounded on `smartbid-docs-index`).
- `POST /quotation/extract` — supplier quotation → structured line items (no RAG).
- `POST /chat` — knowledge Q&A over the indexed library. Retrieval runs on the **last question
  only**, uses the semantic ranker with a hybrid fallback, groups hits per document and returns
  the excerpts it used so retrieval can be inspected from the UI.

Called by the AI Search indexer (managed identity, never by the browser):

- `POST /skills/chunk` — [custom Web API skill](https://learn.microsoft.com/azure/search/cognitive-search-custom-skill-web-api).
  Receives `/document/content` plus the catalogue columns and returns one chunk per section.
  Each chunk carries `text` (stored and shown to the model) and `content` (the same text
  prefixed with the document metadata, which is what gets embedded). A failing record is
  reported on its own and never fails the batch.

Retrieval is deliberately tuned differently per route: `/scope/generate` keeps 5 focused
excerpts and skips the outline chunks, while `/chat` pulls many chunks and deduplicates them
per document. Do not merge the two helpers.

SmartBid **always sends its own system prompt** (`systemPrompt` + `promptVersion`) from
`src/webparts/smartBid20/app/config/ai.prompts.ts`. The backend appends the retrieved
**Reference Material** to it for the scope flow, plus a **BID CONTEXT** block built from the
`division` / `serviceLine` / `resourceTypes` / `contextSummary` fields — which are also prepended
to the AI Search query so retrieval favours the BID's business area. The full request/response
contract is
`src/webparts/smartBid20/app/models/IAIAnalysis.ts` (the source of truth) and
`SmartBid-AI-Backend-API-Contract.md`.

### Per-user authorization

EasyAuth is the gate: Entra ID only issues a token for this API to users assigned to the
Function App's app registration (see §6), and EasyAuth rejects anything else before the request
reaches the code. The Function itself **logs the caller UPN on every call** from the
`X-MS-CLIENT-PRINCIPAL` header, for per-user visibility — it does not re-check an app role
today. There is deliberately no UPN allowlist: access is granted only in Entra ID, so it stays
auditable and follows the user's lifecycle.

### Scanned documents

Text-based PDFs/DOCX are parsed with **pypdfium2** / **python-docx**. Scanned/image PDFs
are read with **gpt-5-mini vision** (the model transcribes page images) — **no Azure AI
Document Intelligence required**.

### App settings (Configuration → Application settings)

```
FUNCTIONS_WORKER_RUNTIME       = python
AZURE_OPENAI_ENDPOINT          = https://cog-opgbbes-openai-prd.openai.azure.com
AZURE_OPENAI_CHAT_DEPLOYMENT   = gpt-5-mini
AZURE_OPENAI_API_VERSION       = 2025-04-01-preview     # gpt-5-mini needs a 2025 preview version; GA versions (e.g. 2024-10-21) reject the model
AZURE_SEARCH_ENDPOINT          = https://srch-opgbbes-prd.search.windows.net
AZURE_SEARCH_INDEX             = smartbid-docs-index
AZURE_SEARCH_SEMANTIC_CONFIG   = smartbid-semantic-config   # optional — semantic ranker used by /chat
MAX_DOC_CHARS                  = 200000                 # optional — cap on analyzed text
MAX_VISION_PAGES               = 20                     # optional — cap on pages sent to vision OCR
AI_DEBUG_ERRORS                = false                  # optional — when true, HTTP 500 responses echo the upstream error message (triage only)
```

Optional tuning for `/chat` and for the indexer skill — all have working defaults, so set them
only to change behaviour without a redeploy:

```
CHAT_DEFAULT_TOP_K             = 20      # chunks requested per question
CHAT_MAX_TOP_K                 = 50
CHAT_MAX_DOCUMENTS             = 8       # distinct documents kept after grouping
CHAT_MAX_CHUNKS_PER_DOC        = 2       # sections kept per document
CHAT_MAX_CONTEXT_CHARS         = 40000
CHAT_MAX_HISTORY               = 6       # conversation turns forwarded to the model
SKILL_CHUNK_MAX_CHARS          = 4000    # ceiling; a section is only split above this
SKILL_CHUNK_MIN_CHARS          = 1200    # floor; small consecutive sections are merged
SKILL_CHUNK_OVERLAP_CHARS      = 400     # applies only when a section has to be split
SKILL_MAX_DOC_CHARS            = 400000  # oversized documents are truncated, not failed
```

> Chunk size is **adaptive**: the section is the unit, and these three values are only
> guardrails. On a 14-page technical proposal the resulting chunks measured 900–2,100
> characters and the 4,000 ceiling was never reached.

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

The indexer also calls the Function App's custom skill. That one is **not** an Azure RBAC role:
it is an Entra ID assignment on the `opgbbes-prd-fa-aadapp` app registration — see §2.

---

## 5. Frontend wiring (after the backend is live)

In `src/webparts/smartBid20/app/config/ai.config.ts`:

- `apiBaseUrl` = the Function App base URL (`https://fa-opgb-bes-prd-fa.azurewebsites.net/api`) — no APIM
- `auth.clientId` = App A client id (`opgbbes-prd-sharepoint-aadapp`)
- `auth.scopes` = `["api://opgbbes-prd-fa-aadapp.oceaneering.com/user_impersonation"]` (the EasyAuth audience)
- `auth.redirectUri` = the SPA redirect URI registered on App A
- `auth.tenantId` = leave empty (taken from the SharePoint page context)
- `enabled` = `true`

Also required on the Function App: **CORS** must allow the SharePoint origin
(`https://oceaneering.sharepoint.com`) with the `Authorization` header, since the
browser now calls it with a plain `fetch` + bearer token.

No SharePoint Admin → API access approval is needed — `webApiPermissionRequests`
was removed from `config/package-solution.json`.

---

## 6. Restrict access to the approved users (App Role + assignment required)

MSAL/PKCE already narrows the caller to SmartBid's own SPA app registration, but any user of
that app could still _request_ a token. Authentication alone is therefore not enough; we also
**restrict who Entra will issue a token to**, and re-check in code. Two layers:

**Layer 1 — Entra ID (blocks token issuance to everyone except the approved users):**

1. **Create the App Role** — Entra ID → App registrations → `opgbbes-prd-fa-aadapp` → **App roles**
   → **Create app role**:
   - Display name: `SmartBid User`
   - Allowed member types: **Users/Groups**
   - Value: `SmartBid.User` ← becomes the `roles` claim the Function checks
   - Enable, then **Apply**.
2. **Require assignment** — Entra ID → **Enterprise applications** → `opgbbes-prd-fa-aadapp` →
   **Properties** → **Assignment required? = Yes** → **Save**. Entra then issues tokens for the
   Function App **only** to assigned users — non-assigned users can't get a token at all.
3. **Assign the approved users** — same Enterprise application → **Users and groups** → **Add
   user/group** → select the approved users (or an Entra security group) → role **SmartBid User**
   → **Assign**.

**Layer 2 — Function App code:** `function_app.py` reads the EasyAuth `X-MS-CLIENT-PRINCIPAL`
header and **logs the caller UPN on every call**. A second in-code check of the `SmartBid.User`
role (`REQUIRED_APP_ROLE`) is **not implemented today** — Layer 1 is what restricts access. Add
it if defence-in-depth is required; until then, do not rely on the app setting.

> This is what limits AI usage to the approved users, and gives per-user visibility (who
> called, when, errors) — without any extra integration layer.
