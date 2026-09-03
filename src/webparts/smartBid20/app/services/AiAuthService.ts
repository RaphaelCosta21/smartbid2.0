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

export class AiAuthService {
  private static _app: PublicClientApplication | null = null;
  private static _initPromise: Promise<PublicClientApplication> | null = null;

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

    AiAuthService._initPromise = (async () => {
      const app = new PublicClientApplication({
        auth: {
          clientId: AI_CONFIG.auth.clientId,
          authority: AiAuthService.getAuthority(),
          redirectUri: AiAuthService.getRedirectUri(),
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
      return app;
    })();

    try {
      return await AiAuthService._initPromise;
    } catch (e) {
      AiAuthService._initPromise = null;
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

    let result: AuthenticationResult | undefined;

    if (account) {
      try {
        result = await app.acquireTokenSilent({ scopes, account });
      } catch (e) {
        if (!(e instanceof InteractionRequiredAuthError)) throw e;
      }
    }

    if (!result) {
      try {
        result = await app.ssoSilent({ scopes, loginHint });
      } catch {
        // Third-party cookies blocked, no session, or consent needed — go interactive.
        result = await AiAuthService.acquireInteractive(app, loginHint);
      }
    }

    app.setActiveAccount(result.account);
    return result.accessToken;
  }

  private static async acquireInteractive(
    app: PublicClientApplication,
    loginHint: string,
  ): Promise<AuthenticationResult> {
    try {
      return await app.acquireTokenPopup({
        scopes: AI_CONFIG.auth.scopes,
        loginHint,
      });
    } catch (e) {
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
}
