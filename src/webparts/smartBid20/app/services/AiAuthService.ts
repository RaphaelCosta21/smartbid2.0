/**
 * AiAuthService — Acquires the signed-in user's Entra ID access token for the
 * SmartBid Function App using MSAL (authorization code flow + PKCE).
 *
 * Replaces the SPFx AadHttpClient: instead of the tenant-wide "SharePoint Online
 * Client Extensibility Web Application Principal", SmartBid uses its OWN SPA app
 * registration (AI_CONFIG.auth.clientId), so the API permission is scoped to this
 * app only and no tenant-wide API access approval is required.
 *
 * Token acquisition order (no UI in the normal case):
 *   1. acquireTokenSilent — MSAL cache / refresh token
 *   2. ssoSilent          — hidden iframe using the existing Entra session
 *   3. acquireTokenPopup  — last resort, requires a user gesture
 *
 * Static singleton pattern. Tokens live in sessionStorage (cleared when the tab
 * closes) and never in localStorage.
 */
import {
  PublicClientApplication,
  AccountInfo,
  AuthenticationResult,
  InteractionRequiredAuthError,
  BrowserAuthError,
  LogLevel,
} from "@azure/msal-browser";
import { SPService } from "./SPService";
import { AI_CONFIG } from "../config/ai.config";

/** One recorded step of a token acquisition attempt. */
export interface IAiAuthTraceEntry {
  at: number;
  step: string;
  outcome: "info" | "ok" | "warn" | "fail";
  detail?: string;
}

/**
 * Outcome of asking Entra ID about a candidate scope.
 *   works       — a token came back silently; this scope is ready to use
 *   exists      — the scope resolves but needs consent or interaction
 *   missing     — the resource exists, this scope name does not (AADSTS65005)
 *   no-resource — the Application ID URI itself is unknown to the tenant
 */
export type ScopeProbeVerdict =
  | "works"
  | "exists"
  | "missing"
  | "no-resource"
  | "unknown";

export interface IScopeProbeResult {
  scope: string;
  verdict: ScopeProbeVerdict;
  detail: string;
}

export class AiAuthService {
  private static _app: PublicClientApplication | null = null;
  private static _initPromise: Promise<PublicClientApplication> | null = null;

  /** Rolling log of the last token attempts — read by the API Diagnostics tab. */
  public static trace: IAiAuthTraceEntry[] = [];

  public static resetTrace(): void {
    AiAuthService.trace = [];
  }

  private static log(
    step: string,
    outcome: IAiAuthTraceEntry["outcome"],
    detail?: unknown,
  ): void {
    let text: string | undefined;
    if (detail instanceof Error) {
      const code = (detail as { errorCode?: string }).errorCode;
      text = (code ? code + " — " : "") + detail.message;
    } else if (typeof detail === "string") {
      text = detail;
    } else if (detail !== undefined) {
      try {
        text = JSON.stringify(detail);
      } catch {
        text = String(detail);
      }
    }
    AiAuthService.trace.push({ at: Date.now(), step, outcome, detail: text });
    if (AiAuthService.trace.length > 60) AiAuthService.trace.shift();
    const line = "[SmartBid AI][auth] " + step + (text ? " — " + text : "");
    if (outcome === "fail") console.error(line);
    else if (outcome === "warn") console.warn(line);
    else console.log(line);
  }

  /** True when the SPA app registration and scopes have been configured. */
  public static isConfigured(): boolean {
    return (
      AI_CONFIG.auth.clientId.trim().length > 0 &&
      AI_CONFIG.auth.scopes.length > 0
    );
  }

  /** UPN used as login hint so Entra resolves the SharePoint user silently. */
  private static getLoginHint(): string {
    try {
      const user = SPService.context.pageContext.user;
      return String(user.email || user.loginName || "");
    } catch {
      return "";
    }
  }

  private static getAuthority(): string {
    let tenantId = AI_CONFIG.auth.tenantId.trim();
    if (!tenantId) {
      try {
        tenantId = String(
          SPService.context.pageContext.aadInfo?.tenantId || "",
        ).replace(/[{}]/g, "");
      } catch {
        tenantId = "";
      }
    }
    return "https://login.microsoftonline.com/" + (tenantId || "organizations");
  }

  private static getRedirectUri(): string {
    const configured = AI_CONFIG.auth.redirectUri.trim();
    if (configured) return configured;
    // Current page without query/hash — the SPFx app uses a HashRouter.
    return window.location.origin + window.location.pathname;
  }

  /** Create (once) and initialize the MSAL public client application. */
  private static async getApp(): Promise<PublicClientApplication> {
    if (AiAuthService._app) return AiAuthService._app;
    if (AiAuthService._initPromise) return AiAuthService._initPromise;

    if (!AiAuthService.isConfigured()) {
      throw new Error(
        "AI sign-in is not configured: set auth.clientId and auth.scopes in app/config/ai.config.ts (values come from the SmartBid SPA app registration).",
      );
    }

    const authority = AiAuthService.getAuthority();
    const redirectUri = AiAuthService.getRedirectUri();
    AiAuthService.log(
      "init: creating MSAL client",
      "info",
      "clientId=" +
        AI_CONFIG.auth.clientId +
        " authority=" +
        authority +
        " redirectUri=" +
        redirectUri,
    );

    AiAuthService._initPromise = (async () => {
      const app = new PublicClientApplication({
        auth: {
          clientId: AI_CONFIG.auth.clientId,
          authority,
          redirectUri,
          navigateToLoginRequestUrl: false,
        },
        cache: {
          cacheLocation: "sessionStorage",
          storeAuthStateInCookie: false,
        },
        system: {
          loggerOptions: {
            logLevel: LogLevel.Error,
            piiLoggingEnabled: false,
            loggerCallback: (_level, message, containsPii) => {
              if (!containsPii) console.warn("[SmartBid MSAL]", message);
            },
          },
        },
      });
      await app.initialize();
      // Completes a redirect-based sign-in if one is in flight (popup is the default).
      await app.handleRedirectPromise();
      AiAuthService._app = app;
      AiAuthService.log("init: MSAL client ready", "ok");
      return app;
    })();

    try {
      return await AiAuthService._initPromise;
    } catch (e) {
      AiAuthService._initPromise = null;
      AiAuthService.log("init: MSAL client FAILED", "fail", e);
      throw e;
    }
  }

  /** Cached account matching the SharePoint user, if MSAL already knows it. */
  private static pickAccount(
    app: PublicClientApplication,
  ): AccountInfo | undefined {
    const active = app.getActiveAccount();
    if (active) return active;
    const accounts = app.getAllAccounts();
    if (accounts.length === 0) return undefined;
    const hint = AiAuthService.getLoginHint().toLowerCase();
    const match = accounts.filter(
      (a) => (a.username || "").toLowerCase() === hint,
    );
    return match.length > 0 ? match[0] : accounts[0];
  }

  /**
   * Get an access token for the Function App. Interactive only when the silent
   * paths fail — call it from a user-initiated action so the popup is allowed.
   */
  public static async getAccessToken(): Promise<string> {
    const app = await AiAuthService.getApp();
    const scopes = AI_CONFIG.auth.scopes;
    const loginHint = AiAuthService.getLoginHint();
    const account = AiAuthService.pickAccount(app);
    AiAuthService.log(
      "token: requesting",
      "info",
      "scopes=" +
        scopes.join(" ") +
        " loginHint=" +
        (loginHint || "(none)") +
        " cachedAccount=" +
        (account ? account.username : "(none)"),
    );

    let result: AuthenticationResult | undefined;

    if (account) {
      try {
        result = await app.acquireTokenSilent({ scopes, account });
        AiAuthService.log("token: acquireTokenSilent succeeded", "ok");
      } catch (e) {
        if (!(e instanceof InteractionRequiredAuthError)) {
          AiAuthService.log("token: acquireTokenSilent FAILED", "fail", e);
          throw e;
        }
        AiAuthService.log(
          "token: acquireTokenSilent needs interaction",
          "warn",
          e,
        );
      }
    }

    if (!result) {
      try {
        result = await app.ssoSilent({ scopes, loginHint });
        AiAuthService.log("token: ssoSilent succeeded", "ok");
      } catch (e) {
        // Third-party cookies blocked, no session, or consent needed — go interactive.
        AiAuthService.log(
          "token: ssoSilent failed, going interactive",
          "warn",
          e,
        );
        result = await AiAuthService.acquireInteractive(app, loginHint);
      }
    }

    app.setActiveAccount(result.account);
    AiAuthService.log(
      "token: issued",
      "ok",
      "account=" +
        (result.account ? result.account.username : "(unknown)") +
        " expiresOn=" +
        String(result.expiresOn || "—"),
    );
    return result.accessToken;
  }

  private static async acquireInteractive(
    app: PublicClientApplication,
    loginHint: string,
  ): Promise<AuthenticationResult> {
    AiAuthService.log("token: opening sign-in popup", "info");
    try {
      const result = await app.acquireTokenPopup({
        scopes: AI_CONFIG.auth.scopes,
        loginHint,
      });
      AiAuthService.log("token: acquireTokenPopup succeeded", "ok");
      return result;
    } catch (e) {
      AiAuthService.log("token: acquireTokenPopup FAILED", "fail", e);
      if (
        e instanceof BrowserAuthError &&
        (e.errorCode === "popup_window_error" ||
          e.errorCode === "empty_window_error")
      ) {
        throw new Error(
          "Sign-in window was blocked by the browser. Allow pop-ups for this site and try again.",
        );
      }
      throw e;
    }
  }

  /**
   * Best-effort silent warm-up so the token is cached before the first AI call
   * (keeps the pop-up fallback out of the way). Never prompts, never throws.
   */
  public static async warmUp(): Promise<void> {
    if (!AiAuthService.isConfigured()) return;
    try {
      const app = await AiAuthService.getApp();
      const scopes = AI_CONFIG.auth.scopes;
      const account = AiAuthService.pickAccount(app);
      const result = account
        ? await app.acquireTokenSilent({ scopes, account })
        : await app.ssoSilent({
            scopes,
            loginHint: AiAuthService.getLoginHint(),
          });
      app.setActiveAccount(result.account);
    } catch {
      /* Interactive sign-in will happen on the first real AI request. */
    }
  }

  /**
   * Drop every cached token so the next call re-reads the claims from Entra.
   * Needed after an app role assignment: a token minted before it stays valid
   * for ~1 h and still carries no `roles` claim.
   */
  public static async clearTokenCache(): Promise<void> {
    try {
      const app = await AiAuthService.getApp();
      await app.clearCache();
      AiAuthService.log("cache: cleared", "ok");
    } catch (e) {
      AiAuthService.log("cache: clear failed", "warn", e);
    }
  }

  /**
   * Ask Entra ID about ONE candidate scope without ever showing a pop-up.
   *
   * ssoSilent still resolves the resource server-side, so the error code tells
   * us whether the scope exists — which is how we discover the real scope name
   * without waiting on IT to read it out of the portal.
   */
  public static async probeScope(scope: string): Promise<IScopeProbeResult> {
    let detail = "";
    try {
      const app = await AiAuthService.getApp();
      await app.ssoSilent({
        scopes: [scope],
        loginHint: AiAuthService.getLoginHint(),
      });
      return { scope, verdict: "works", detail: "Token issued silently." };
    } catch (e) {
      detail = e instanceof Error ? e.message : String(e);
    }

    let verdict: ScopeProbeVerdict = "unknown";
    if (/AADSTS65005/.test(detail)) verdict = "missing";
    else if (/AADSTS500011|AADSTS650057/.test(detail)) verdict = "no-resource";
    else if (
      /AADSTS65001|consent_required|interaction_required|login_required|AADSTS50058|AADSTS50076/.test(
        detail,
      )
    )
      verdict = "exists";

    AiAuthService.log("scope probe: " + scope, "info", verdict);
    return { scope, verdict, detail };
  }
}
