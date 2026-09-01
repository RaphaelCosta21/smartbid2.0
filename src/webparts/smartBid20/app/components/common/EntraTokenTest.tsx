/**
 * EntraTokenTest — TEMPORARY, DEV-ONLY proof module. REMOVE after validating.
 *
 * Proves the REAL scenario against SmartBid's own Azure API (the Function App
 * behind `api://…oceaneering.com`), NOT Microsoft Graph. It shows both sides:
 *
 *   A) AadHttpClient / AadTokenProvider trying to acquire a PER-USER Entra ID
 *      token for OUR API resource (AI_CONFIG.aadResource). If the tenant has
 *      already approved the webApiPermissionRequest, you see the token + the
 *      user identity claims inside it. If NOT approved yet, you see the exact
 *      refusal returned by Entra ID.
 *
 *   B) A real POST through AadHttpClient to the configured endpoint, showing
 *      the HTTP status/body the Function App (EasyAuth) sends back — or the
 *      refusal if a token could not be minted.
 *
 * Either way the evidence is authentic: the SAME code path the app uses in
 * production. Rendered by the "API Diagnostics" tab in System Configuration
 * (System group), which is its only mount point.
 */
import * as React from "react";
import { AadHttpClient } from "@microsoft/sp-http";
import { SPService } from "../../services/SPService";
import { AI_CONFIG, buildAiUrl } from "../../config/ai.config";

/** Decode a JWT payload (base64url + UTF-8) without any dependency. */
function decodeJwtPayload(token: string): Record<string, unknown> | undefined {
  try {
    const part = token.split(".")[1];
    if (!part) return undefined;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return undefined;
  }
}

function claim(
  claims: Record<string, unknown> | undefined,
  key: string,
): string {
  if (!claims || claims[key] === undefined || claims[key] === null) return "—";
  return String(claims[key]);
}

/** URLs the SPFx token machinery hits while acquiring a token. */
const AUTH_URL_RE =
  /login\.microsoftonline\.com|oauth2|SP\.OAuth\.Token|\/_api\/.*[Tt]oken|adal|msal/i;

/**
 * Auth-related network calls made after `since`, read from the Resource Timing
 * API. Works even when the token is refused — the attempt is still recorded.
 */
function authCallsSince(since: number): string[] {
  const out: string[] = [];
  try {
    const entries = performance.getEntriesByType(
      "resource",
    ) as PerformanceResourceTiming[];
    entries.forEach((e) => {
      if (e.startTime >= since && AUTH_URL_RE.test(e.name)) out.push(e.name);
    });
  } catch {
    /* Resource Timing unavailable — fall back to the DevTools Network tab */
  }
  return out;
}

interface IProbe {
  ok: boolean;
  token?: string;
  claims?: Record<string, unknown>;
  httpStatus?: number;
  httpBody?: string;
  error?: string;
}

interface IState {
  loading: boolean;
  tokenProbe?: IProbe;
  apiProbe?: IProbe;
  authCalls: string[];
}

const EMPTY: IState = {
  loading: false,
  tokenProbe: undefined,
  apiProbe: undefined,
  authCalls: [],
};

export const EntraTokenTest: React.FC = () => {
  const [state, setState] = React.useState<IState>(EMPTY);

  const resource = AI_CONFIG.aadResource;
  const apiUrl = buildAiUrl(AI_CONFIG.endpoints.generateScope);

  // The session identity Entra ID resolves the user by — readable BEFORE any
  // approval, and stamped verbatim into the token as oid / tid / upn.
  const pc = SPService.context.pageContext;
  const sessionIdentity: Array<[string, string]> = [
    ["displayName", String(pc.user.displayName || "—")],
    ["loginName (upn)", String(pc.user.loginName || "—")],
    ["email", String(pc.user.email || "—")],
    ["Entra object id (oid)", String(pc.aadInfo?.userId || "—")],
    ["Entra tenant id (tid)", String(pc.aadInfo?.tenantId || "—")],
  ];

  const run = async (): Promise<void> => {
    setState({
      loading: true,
      tokenProbe: undefined,
      apiProbe: undefined,
      authCalls: [],
    });
    const mark = performance.now();

    console.log(
      "[EntraApiTest] Session identity (pre-token):",
      sessionIdentity,
    );

    // ── Probe A: acquire a PER-USER token for OUR API resource ──────────────
    let tokenProbe: IProbe;
    try {
      const provider =
        await SPService.context.aadTokenProviderFactory.getTokenProvider();
      const token = await provider.getToken(resource);
      const claims = decodeJwtPayload(token);
      console.log("[EntraApiTest] Token for", resource, ":", token);
      console.log("[EntraApiTest] Decoded claims:", claims);
      tokenProbe = { ok: true, token, claims };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[EntraApiTest] Token acquisition REFUSED:", msg);
      tokenProbe = { ok: false, error: msg };
    }

    const authCalls = authCallsSince(mark);
    console.log("[EntraApiTest] Auth network calls attempted:", authCalls);

    // ── Probe B: real POST through AadHttpClient to OUR endpoint ─────────────
    let apiProbe: IProbe;
    try {
      const client =
        await SPService.context.aadHttpClientFactory.getClient(resource);
      const res = await client.post(apiUrl, AadHttpClient.configurations.v1, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ probe: "entra-token-test" }),
      });
      const httpBody = await res.text();
      console.log("[EntraApiTest] API", res.status, "->", httpBody);
      apiProbe = { ok: res.ok, httpStatus: res.status, httpBody };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[EntraApiTest] API call REFUSED:", msg);
      apiProbe = { ok: false, error: msg };
    }

    setState({ loading: false, tokenProbe, apiProbe, authCalls });
  };

  const copyToken = (): void => {
    if (state.tokenProbe?.token && navigator.clipboard) {
      navigator.clipboard.writeText(state.tokenProbe.token).catch(() => {
        /* clipboard blocked — use the console copy instead */
      });
    }
  };

  const wrap: React.CSSProperties = {
    fontSize: 13,
    color: "var(--text-primary)",
  };
  const btn: React.CSSProperties = {
    background: "var(--primary-accent)",
    color: "#04121f",
    border: "none",
    borderRadius: 8,
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
  };
  const panel: React.CSSProperties = {
    marginTop: 16,
    background: "var(--card-bg-elevated)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 16,
  };
  const row: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "6px 0",
    borderBottom: "1px solid var(--border-subtle)",
  };
  const label: React.CSSProperties = {
    color: "var(--text-secondary)",
    whiteSpace: "nowrap",
  };
  const val: React.CSSProperties = {
    textAlign: "right",
    wordBreak: "break-all",
    fontFamily: "Consolas, monospace",
  };
  const blockTitle: React.CSSProperties = {
    margin: "20px 0 8px",
    color: "var(--text-primary)",
    fontWeight: 600,
  };
  const okBadge: React.CSSProperties = {
    color: "var(--success)",
    fontWeight: 700,
  };
  const badBadge: React.CSSProperties = {
    color: "var(--danger)",
    fontWeight: 700,
  };
  const errBox: React.CSSProperties = {
    marginTop: 8,
    padding: 12,
    background: "var(--main-bg)",
    border: "1px solid var(--danger)",
    borderRadius: 8,
    color: "var(--danger)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontFamily: "Consolas, monospace",
    fontSize: 12,
  };
  const codeBox: React.CSSProperties = {
    marginTop: 8,
    padding: 12,
    background: "var(--main-bg)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-secondary)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontFamily: "Consolas, monospace",
    fontSize: 12,
    maxHeight: 200,
    overflow: "auto",
  };

  return (
    <div style={wrap}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button style={btn} onClick={run} disabled={state.loading}>
          {state.loading ? "Running…" : "▶ Run diagnostic"}
        </button>
        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
          Results are also written to the browser console (F12) as
          [EntraApiTest].
        </span>
      </div>

      <div style={panel}>
        <div style={row}>
          <span style={label}>resource</span>
          <span style={val}>{resource || "(not set)"}</span>
        </div>
        <div style={row}>
          <span style={label}>endpoint</span>
          <span style={val}>{apiUrl}</span>
        </div>

        {/* ── Probe 0: readable WITHOUT any approval ────────────────── */}
        <div style={blockTitle}>
          0) Session identity Entra ID resolves the user by{" "}
          <span style={okBadge}>NO APPROVAL NEEDED</span>
        </div>
        {sessionIdentity.map(([display, value]) => (
          <div style={row} key={display}>
            <span style={label}>{display}</span>
            <span style={val}>{value}</span>
          </div>
        ))}
        <div style={codeBox}>
          These exact values are what Entra ID stamps into the token as oid /
          tid / upn. After approval, compare with block A — they match, proving
          the token carries THIS user.
        </div>

        {/* ── Probe A ─────────────────────────────────── */}
        {state.tokenProbe && (
          <>
            <div style={blockTitle}>
              A) AadHttpClient token acquisition{" "}
              {state.tokenProbe.ok ? (
                <span style={okBadge}>ISSUED ✓</span>
              ) : (
                <span style={badBadge}>REFUSED ✗</span>
              )}
            </div>

            {state.tokenProbe.ok && state.tokenProbe.claims && (
              <>
                {[
                  ["name", "name"],
                  ["upn / email", "preferred_username"],
                  ["upn (alt)", "upn"],
                  ["object id (oid)", "oid"],
                  ["tenant (tid)", "tid"],
                  ["audience (aud)", "aud"],
                  ["scope (scp)", "scp"],
                  ["app id (appid)", "appid"],
                ].map(([display, key]) => (
                  <div style={row} key={key}>
                    <span style={label}>{display}</span>
                    <span style={val}>
                      {claim(state.tokenProbe!.claims!, key)}
                    </span>
                  </div>
                ))}
                <button style={{ ...btn, marginTop: 12 }} onClick={copyToken}>
                  Copy raw token (paste into https://jwt.ms)
                </button>
              </>
            )}

            {!state.tokenProbe.ok && (
              <div style={errBox}>{state.tokenProbe.error}</div>
            )}
          </>
        )}

        {/* ── Auth calls actually attempted — visible even when refused ── */}
        {state.authCalls.length > 0 && (
          <>
            <div style={blockTitle}>
              A2) Auth calls the SPFx client attempted
            </div>
            <div style={codeBox}>{state.authCalls.join("\n\n")}</div>
          </>
        )}

        {/* ── Probe B ─────────────────────────────────── */}
        {state.apiProbe && (
          <>
            <div style={blockTitle}>
              B) Real POST to the Function App{" "}
              {state.apiProbe.ok ? (
                <span style={okBadge}>{state.apiProbe.httpStatus} OK ✓</span>
              ) : state.apiProbe.httpStatus ? (
                <span style={badBadge}>
                  {state.apiProbe.httpStatus} REJECTED ✗
                </span>
              ) : (
                <span style={badBadge}>REFUSED ✗</span>
              )}
            </div>

            {typeof state.apiProbe.httpStatus === "number" && (
              <div style={codeBox}>
                {state.apiProbe.httpBody || "(empty body)"}
              </div>
            )}
            {state.apiProbe.error && (
              <div style={errBox}>{state.apiProbe.error}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
