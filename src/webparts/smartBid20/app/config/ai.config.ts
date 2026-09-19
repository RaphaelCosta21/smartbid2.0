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

/** Tunables for the floating knowledge chat assistant. */
export interface IAiChatConfig {
  /** Earlier turns sent as context inside the system prompt. */
  maxHistoryTurns: number;
  /** Reset the conversation after this much inactivity. */
  idleResetMs: number;
  /** Hard cap on questions per conversation, to bound token spend. */
  maxMessagesPerSession: number;
  /** Abort a chat request after this many ms (the global timeout targets file analysis). */
  requestTimeoutMs: number;
  /** Reject questions shorter than this before spending a token. */
  minQuestionChars: number;
  /** Truncate questions longer than this. */
  maxQuestionChars: number;
  /** Chunks the backend retrieves before deduplicating per document. */
  topK: number;
  /** Show which excerpts the search returned, to diagnose retrieval quality. */
  showRetrievalDebug: boolean;
}

export interface IAiConfig {
  /** Master switch. Keep false until apiBaseUrl is set and the backend is live. */
  enabled: boolean;
  /** Function App base URL, e.g. "https://<fa-name>.azurewebsites.net/api". */
  apiBaseUrl: string;
  /** Entra ID (MSAL) settings used to obtain the per-user access token. */
  auth: IAiAuthConfig;
  /**
   * Abort a request after this many ms. Must stay under 230 s: that is the Azure
   * Load Balancer idle timeout, and an HTTP-triggered Function cannot respond
   * after it regardless of `functionTimeout`.
   */
  requestTimeoutMs: number;
  /** Settings for the floating knowledge chat assistant. */
  chat: IAiChatConfig;
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
    /** Free-form Q&A over the indexed document library. */
    chat: string;
    // --- Future endpoints (not wired yet — uncomment when the backend adds them) ---
    // /** Current BID requirements → suggested clarifications/qualifications (RAG). */
    // suggestClarifications: string;
    // /** Free-form Q&A over a BID's documents. */
    // chat: string;
  };
}

export const AI_CONFIG: IAiConfig = {
  enabled: true,
  apiBaseUrl: "https://fa-opgb-bes-prd-fa.azurewebsites.net/api", // Azure Function App base URL (EasyAuth-protected; there is no APIM).
  auth: {
    clientId: "d2c88fcf-f519-4656-94b0-19d23182beb0", // opgbbes-prd-sharepoint-aadapp (client only — exposes no API)
    tenantId: "", // Empty = use the SharePoint tenant id from the SPFx page context.
    scopes: ["api://opgbbes-prd-fa-aadapp.oceaneering.com/user_impersonation"],
    redirectUri:
      "https://oceaneering.sharepoint.com/sites/G-OPGSSRBrazilEngineering",
  },
  requestTimeoutMs: 230000,
  chat: {
    maxHistoryTurns: 3,
    idleResetMs: 600000,
    maxMessagesPerSession: 20,
    requestTimeoutMs: 60000,
    minQuestionChars: 5,
    maxQuestionChars: 500,
    topK: 25,
    showRetrievalDebug: true,
  },
  sendPromptFromClient: true,
  endpoints: {
    generateScope: "/scope/generate",
    extractQuotation: "/quotation/extract",
    chat: "/chat",
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
