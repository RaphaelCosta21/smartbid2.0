/**
 * ai.config.ts — SmartBid AI (Azure) integration settings.
 *
 * SmartBid talks to ONE secure gateway (Azure API Management → Function App)
 * that fronts Azure OpenAI + Azure AI Search + Key Vault. The browser never
 * holds model keys; each request is authenticated with the signed-in user's
 * Entra ID identity (same SSO as SharePoint) through the SPFx AadHttpClient.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │ Provided by the IT / Azure team — fill in before integration testing: │
 * │   • apimBaseUrl … the APIM gateway base URL                            │
 * │   • aadResource … the Entra ID App ID URI the gateway expects tokens   │
 * │                   for (e.g. "api://<app-id>")                          │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * SECURITY: nothing secret belongs in this file — it ships inside the browser
 * bundle. API/model keys stay in Key Vault on the backend. `subscriptionKey`
 * exists only as a short-lived convenience for very early testing and MUST stay
 * empty in any shared / production deployment (prefer Entra ID via aadResource).
 */

export interface IAiConfig {
  /** Master switch. Keep false until apimBaseUrl is set and the backend is live. */
  enabled: boolean;
  /** APIM gateway base URL, e.g. "https://<apim-name>.azure-api.net/smartbid". */
  apimBaseUrl: string;
  /**
   * Entra ID App ID URI (or client id) the gateway validates tokens against.
   * When set, SmartBid acquires a per-user token for this resource via
   * AadHttpClientFactory. Requires the matching webApiPermissionRequest to be
   * approved in the tenant (package-solution.json → API access).
   */
  aadResource: string;
  /** APIM subscription key — TESTING ONLY, leave empty in shared builds. */
  subscriptionKey: string;
  /** Header used to pass the subscription key when present. */
  subscriptionKeyHeaderName: string;
  /** Abort a request after this many ms. */
  requestTimeoutMs: number;
  /**
   * When true, SmartBid sends its own prompt (from ai.prompts.ts) + promptVersion
   * with each request, so the prompt lives in THIS repo and the team can iterate
   * on it. Set to false if IT prefers to own the prompt inside the Function App.
   */
  sendPromptFromClient: boolean;
  /** Relative paths appended to apimBaseUrl for each use case. */
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
  apimBaseUrl: "", //APIM gateway base URL                                     (e.g. https://<apim>.azure-api.net/smartbid).
  aadResource: "", //Entra ID App ID URI the gateway validates tokens for (e.g. api://<app-id>). Needs the matching API permission approved in the tenant.
  subscriptionKey: "",
  subscriptionKeyHeaderName: "Ocp-Apim-Subscription-Key",
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
  return AI_CONFIG.enabled && AI_CONFIG.apimBaseUrl.trim().length > 0;
}

/** Join the configured base URL with an endpoint path, tolerating slashes. */
export function buildAiUrl(endpointPath: string): string {
  const base = AI_CONFIG.apimBaseUrl.replace(/\/+$/, "");
  const path = endpointPath.replace(/^\/+/, "");
  return base + "/" + path;
}
