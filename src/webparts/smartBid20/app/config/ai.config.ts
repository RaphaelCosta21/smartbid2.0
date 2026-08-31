/**
 * ai.config.ts — SmartBid AI (Azure) integration settings.
 *
 * SmartBid calls ONE Azure Function App (EasyAuth-protected, no APIM) that
 * fronts Azure OpenAI + Azure AI Search. The browser never
 * holds model keys; each request is authenticated with the signed-in user's
 * Entra ID identity (same SSO as SharePoint) through the SPFx AadHttpClient.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │ Provided by the IT / Azure team — fill in before integration testing: │
 * │   • apiBaseUrl … the Function App base URL                            │
 * │   • aadResource … the Entra ID App ID URI EasyAuth expects tokens   │
 * │                   for (e.g. "api://<app-id>")                          │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * SECURITY: nothing secret belongs in this file — it ships inside the browser
 * bundle. Model keys never reach the browser; the backend uses Managed Identity.
 */

export interface IAiConfig {
  /** Master switch. Keep false until apiBaseUrl is set and the backend is live. */
  enabled: boolean;
  /** Function App base URL, e.g. "https://<fa-name>.azurewebsites.net/api". */
  apiBaseUrl: string;
  /**
   * Entra ID App ID URI (or client id) EasyAuth validates tokens against.
   * When set, SmartBid acquires a per-user token for this resource via
   * AadHttpClientFactory. Requires the matching webApiPermissionRequest to be
   * approved in the tenant (package-solution.json → API access).
   */
  aadResource: string;
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
  aadResource: "api://opgbbes-prd-fa-aadapp.oceaneering.com", // Function App App ID URI that EasyAuth validates. Needs webApiPermissionRequests approved.
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

/** True when the Azure AI backend is switched on and has an endpoint. */
export function isAiConfigured(): boolean {
  return AI_CONFIG.enabled && AI_CONFIG.apiBaseUrl.trim().length > 0;
}

/** Join the configured base URL with an endpoint path, tolerating slashes. */
export function buildAiUrl(endpointPath: string): string {
  const base = AI_CONFIG.apiBaseUrl.replace(/\/+$/, "");
  const path = endpointPath.replace(/^\/+/, "");
  return base + "/" + path;
}
