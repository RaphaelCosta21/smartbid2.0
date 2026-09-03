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

## 3. Function App — the two endpoints

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

- `POST /scope/generate` — client document → Scope of Supply (RAG grounded on `smartbid-docs-index`).
- `POST /quotation/extract` — supplier quotation → structured line items (no RAG).

SmartBid **always sends its own system prompt** (`systemPrompt` + `promptVersion`) from
`src/webparts/smartBid20/app/config/ai.prompts.ts`. The backend appends the retrieved
**Reference Material** to it for the scope flow, plus a **BID CONTEXT** block built from the
`division` / `serviceLine` / `resourceTypes` / `contextSummary` fields — which are also prepended
to the AI Search query so retrieval favours the BID's business area. The full request/response
contract is
`src/webparts/smartBid20/app/models/IAIAnalysis.ts` (the source of truth) and
`SmartBid-AI-Backend-API-Contract.md`.

### Per-user authorization

EasyAuth authenticates the caller and injects the identity into request headers; the Function then
**authorizes per user** — it returns **403** unless the caller carries the `SmartBid.User` app role,
and logs the caller UPN on every call (see §6 for the Entra setup that makes this effective).
The Entra app role assignment is the **single source of truth**: there is no UPN allowlist and no
bypass, and a missing/misconfigured role name fails **closed**.

### Scanned documents

Text-based PDFs/DOCX are parsed with **pypdfium2** / **python-docx**. Scanned/image PDFs
are read with **gpt-5-mini vision** (the model transcribes page images) — **no Azure AI
Document Intelligence required**.

### App settings (Configuration → Application settings)

```
FUNCTIONS_WORKER_RUNTIME       = python
AZURE_OPENAI_ENDPOINT          = https://cog-opgb-bes-prd-ai-openai.openai.azure.com
AZURE_OPENAI_CHAT_DEPLOYMENT   = gpt-5-mini
AZURE_OPENAI_API_VERSION       = 2024-10-21             # confirm the version gpt-5-mini requires
AZURE_SEARCH_ENDPOINT          = https://srch-opgbbes-prd.search.windows.net
AZURE_SEARCH_INDEX             = smartbid-docs-index
REQUIRED_APP_ROLE              = SmartBid.User          # app role a caller's token must carry (see §6)
MAX_DOC_CHARS                  = 200000                 # optional — cap on analyzed text
MAX_VISION_PAGES               = 20                     # optional — cap on pages sent to vision OCR
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

**Layer 2 — Function App code (defense-in-depth):** `function_app.py` reads the EasyAuth
`X-MS-CLIENT-PRINCIPAL` header and returns **403** unless the caller has the `SmartBid.User` role.
It logs the caller UPN on every call. Configure the role name via the `REQUIRED_APP_ROLE` app
setting (§3). **Default-deny:** no role claim, no header, or an unset role name → every call is
rejected. There is deliberately **no UPN allowlist** — access is granted only in Entra ID, so it
stays auditable and follows the user's lifecycle.

> This is what limits AI usage to the approved users, and gives per-user visibility (who
> called, when, errors) — without any extra integration layer.
