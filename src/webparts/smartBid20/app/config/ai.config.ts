/**
 * ai.config.ts — SmartBid AI (Azure) integration settings.
 *
 * SmartBid calls ONE Azure Function App (EasyAuth-protected, no APIM) that
 * fronts Azure OpenAI + Azure AI Search. The browser never holds model keys;
 * each request carries the signed-in user's Entra ID token acquired with MSAL
 * (authorization code + PKCE) against SmartBid's own SPA app registration —
 * not the tenant-wide SharePoint "Client Extensibility" principal.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │ Provided by the IT / Azure team — fill in before integration testing: │
 * │   • apiBaseUrl … the Function App base URL                            │
 * │   • auth.clientId … the SPA app registration client id                │
 * │   • auth.scopes … the Function App API scope(s)                       │
 * │   • auth.redirectUri … a redirect URI registered as "SPA" on that app │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * SECURITY: nothing secret belongs in this file — it ships inside the browser
 * bundle. A public client id and a scope are not secrets (PKCE replaces the
 * client secret). Model keys never reach the browser; the backend uses
 * Managed Identity.
 */

/** Entra ID sign-in settings for the MSAL public client (auth code + PKCE). */
export interface IAiAuthConfig {
  /**
   * Client id of the SmartBid SPA app registration (`opgbbes-prd-sharepoint-aadapp`).
   * It must have a redirect URI of type **SPA** and delegated permission to the
   * Function App API. No tenant-wide SharePoint API access grant is used.
   */
  clientId: string;
  /**
   * Tenant id override. Leave empty to use the SharePoint tenant reported by
   * the SPFx page context (recommended — keeps the authority single-tenant).
   */
  tenantId: string;
  /**
   * Delegated scope(s) requested for the Function App, e.g.
   * "api://<app-id-uri>/user_impersonation". The resulting token's audience is
   * what EasyAuth validates.
   */
  scopes: string[];
  /**
   * Redirect URI registered on the SPA app registration. Leave empty to use the
   * current page URL (then EVERY page hosting the web part must be registered).
   * Prefer one fixed, cheap same-origin page, e.g.
   * "https://<tenant>.sharepoint.com/sites/<site>/_layouts/15/blank.aspx".
   */
  redirectUri: string;
}

export interface IAiConfig {
  /** Master switch. Keep false until apiBaseUrl is set and the backend is live. */
  enabled: boolean;
  /** Function App base URL, e.g. "https://<fa-name>.azurewebsites.net/api". */
  apiBaseUrl: string;
  /** Entra ID (MSAL) settings used to obtain the per-user access token. */
  auth: IAiAuthConfig;
  /** Abort a request after this many ms. */
  requestTimeoutMs: number;
  /**
   * When true, SmartBid sends its own prompt (from ai.prompts.ts) + promptVersion
   * with each request, so the prompt lives in THIS repo and the team can iterate
   * on it. Set to false if IT prefers to own the prompt inside the Function App.
   */
  sendPromptFromClient: boolean;
  /** Relative paths appended to apiBaseUrl for each use case. */
  endpoints: {
    /** Client technical document → structured Scope of Supply. */
    generateScope: string;
    /** Supplier quotation PDF → structured quotation fields. */
    extractQuotation: string;
    // --- Future endpoints (not wired yet — uncomment when the backend adds them) ---
    // /** Current BID requirements → suggested clarifications/qualifications (RAG). */
    // suggestClarifications: string;
    // /** Free-form Q&A over a BID's documents. */
    // chat: string;
  };
}

export const AI_CONFIG: IAiConfig = {
  enabled: false,
  apiBaseUrl: "https://fa-opgb-bes-prd-fa.azurewebsites.net/api", // Azure Function App base URL (EasyAuth-protected; there is no APIM).
  auth: {
    clientId: "d2c88fcf-f519-4656-94b0-19d23182beb0", // opgbbes-prd-sharepoint-aadapp (client only — exposes no API)
    tenantId: "", // Empty = use the SharePoint tenant id from the SPFx page context.
    // The API lives on a separate app registration (opgbbes-prd-fa-aadapp), which
    // exposes no named scope — /.default requests whatever is already consented.
    scopes: ["api://opgbbes-prd-fa-aadapp.oceaneering.com/.default"],
    // Must match a redirect URI registered as "SPA" byte for byte.
    redirectUri:
      "https://oceaneering.sharepoint.com/sites/G-OPGSSRBrazilEngineering",
  },
  requestTimeoutMs: 120000,
  sendPromptFromClient: true,
  endpoints: {
    generateScope: "/scope/generate",
    extractQuotation: "/quotation/extract",
    // --- Future endpoints (uncomment when the backend routes exist) ---
    // suggestClarifications: "/clarifications/suggest",
    // chat: "/chat",
  },
};

/** True when the Azure AI backend is switched on and has an endpoint + sign-in. */
export function isAiConfigured(): boolean {
  return (
    AI_CONFIG.enabled &&
    AI_CONFIG.apiBaseUrl.trim().length > 0 &&
    AI_CONFIG.auth.clientId.trim().length > 0 &&
    AI_CONFIG.auth.scopes.length > 0
  );
}

/** Join the configured base URL with an endpoint path, tolerating slashes. */
export function buildAiUrl(endpointPath: string): string {
  const base = AI_CONFIG.apiBaseUrl.replace(/\/+$/, "");
  const path = endpointPath.replace(/^\/+/, "");
  return base + "/" + path;
}
