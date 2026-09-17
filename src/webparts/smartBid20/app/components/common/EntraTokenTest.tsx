/**
 * EntraTokenTest — end-to-end diagnostic for the SmartBid AI backend.
 *
 * Runs the SAME code path the app uses in production, one step at a time, so a
 * failure points at exactly one cause:
 *
 *   1) Configuration     — ai.config.ts values are well formed
 *   2) Session identity  — who SharePoint thinks the user is
 *   3) Token             — MSAL (auth code + PKCE) mints a per-user token
 *   4) Token claims      — the audience matches the configured API scope
 *   5) Reachability/CORS — an UNAUTHENTICATED call, to separate a CORS problem
 *                          (fetch throws) from an auth problem (HTTP 401)
 *   6) AI round trip     — a real POST to /quotation/extract with a sample
 *                          quotation. That route is a straight Azure OpenAI
 *                          call (no AI Search), so the result isolates auth and
 *                          the model without the retrieval pipeline.
 *   7) Scope + RAG       — POST to /scope/generate with pre-extracted text
 *                          (documentText), so the only thing it adds over step 6
 *                          is AI Search retrieval.
 *   8) Scope + real file — optional POST to /scope/generate with a document the
 *                          user picks. Adds backend PDF/DOCX parsing on top of 7.
 *
 * Steps 6 → 7 → 8 add exactly one moving part each, so the first one that fails
 * names the broken stage without reading Application Insights.
 *
 * Every step is mirrored to the browser console as [SmartBid AI]. Rendered by
 * the "API Diagnostics" tab in System Configuration, its only mount point.
 */
import * as React from "react";
import { SPService } from "../../services/SPService";
import { AiAuthService } from "../../services/AiAuthService";
import { AI_CONFIG, buildAiUrl } from "../../config/ai.config";
import {
  buildQuotationExtractionPrompt,
  QUOTATION_EXTRACTION_PROMPT_VERSION,
  buildScopeOfSupplyPrompt,
  SCOPE_OF_SUPPLY_PROMPT_VERSION,
} from "../../config/ai.prompts";
import { useConfigStore } from "../../stores/useConfigStore";
import { IAIAnalysisRequest } from "../../models/IAIAnalysis";

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

function claimText(
  claims: Record<string, unknown> | undefined,
  key: string,
): string {
  if (!claims || claims[key] === undefined || claims[key] === null) return "—";
  const value = claims[key];
  if (Array.isArray(value))
    return value.length > 0 ? value.join(", ") : "(empty array)";
  return String(value);
}

/** First claim that carries the UPN — the name differs between v1 and v2 tokens. */
function upnClaim(claims: Record<string, unknown> | undefined): string {
  const keys = ["upn", "preferred_username", "unique_name", "email"];
  for (let i = 0; i < keys.length; i++) {
    const v = claimText(claims, keys[i]);
    if (v !== "—") return v + "  (claim: " + keys[i] + ")";
  }
  return "— NO UPN CLAIM IN TOKEN";
}

/** "api://x/user_impersonation" -> "api://x" (the audience Entra will stamp). */
function resourceFromScope(scope: string): string {
  const slash = scope.lastIndexOf("/");
  return slash > "api://".length ? scope.substring(0, slash) : scope;
}

const GUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function errorText(e: unknown): string {
  if (e instanceof Error) {
    const code = (e as { errorCode?: string }).errorCode;
    return (code ? code + " — " : "") + e.message;
  }
  return String(e);
}

/** fetch() with a hard timeout so a hung backend cannot freeze the diagnostic. */
async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function prettyJson(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text), null, 2) as string;
  } catch {
    return text;
  }
}

/** Same encoding AIAnalysisService uses before POSTing a document. */
async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 8192; // chunked to stay under the argument limit of String.fromCharCode
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(
      null,
      Array.prototype.slice.call(bytes.subarray(i, i + chunk)) as number[],
    );
  }
  return btoa(binary);
}

/** Short, human-readable file size. */
function fileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

type StepStatus = "running" | "ok" | "warn" | "fail" | "skipped";

interface IStep {
  id: string;
  label: string;
  status: StepStatus;
  /** One-line verdict shown next to the label. */
  summary?: string;
  /** Key/value evidence rendered as rows. */
  rows?: Array<[string, string]>;
  /** Raw payload rendered in a monospace block. */
  raw?: string;
  /** Actionable next step when the verdict is warn/fail. */
  hint?: string;
  durationMs?: number;
}

const STEP_ORDER = [
  "config",
  "identity",
  "token",
  "scopeProbe",
  "claims",
  "cors",
  "ai",
  "scopeRag",
  "scopeFile",
];

const STEP_LABEL: Record<string, string> = {
  config: "1) Configuration (ai.config.ts)",
  identity: "2) SharePoint session identity",
  token: "3) Entra ID token (MSAL, auth code + PKCE)",
  scopeProbe: "3b) Scope discovery — which scope does Entra accept?",
  claims: "4) Token claims & audience match",
  cors: "5) Endpoint reachability / CORS",
  ai: "6) AI round trip (Azure OpenAI — quotation extract)",
  scopeRag: "7) Scope of Supply + RAG (AI Search) — pre-extracted text",
  scopeFile: "8) Scope of Supply with your own document (backend parsing)",
};

/**
 * Scope names to try when the configured one is rejected. Entra answers each
 * without a pop-up, so one run tells us the real name instead of an email
 * round trip with IT. Kept short — every probe costs a hidden-iframe round trip.
 */
function candidateScopes(): string[] {
  const resource =
    resourceFromScope(AI_CONFIG.auth.scopes[0] || "") ||
    "api://opgbbes-prd-sharepoint-aadapp.oceaneering.com";
  const out = [
    resource + "/.default",
    resource + "/access_as_user",
    resource + "/user_impersonation",
    "api://opgbbes-prd-fa-aadapp.oceaneering.com/.default",
  ];
  return out.filter((s, i) => out.indexOf(s) === i);
}

/**
 * Tiny supplier quotation. The /quotation/extract route is a straight OpenAI
 * call — no AI Search — so a failure here is the model or the plumbing, never
 * the retrieval index.
 */
const SAMPLE_DOCUMENT = [
  "SUPPLIER QUOTATION - SMARTBID DIAGNOSTIC SAMPLE",
  "",
  "Supplier: Subsea Components Ltda",
  "Quotation No: SC-2026-0142",
  "Date: 2026-03-11",
  "Currency: USD",
  "",
  "Item  Description                              Qty   Unit Price   Total",
  "1     ROV tether, 300 m, with termination kit    2      12,500.00   25,000.00",
  "2     Hydraulic manipulator spare parts kit      1       8,750.00    8,750.00",
  "3     USBL transponder, rated 3000 msw           4       3,200.00   12,800.00",
  "",
  "Subtotal: 46,550.00",
  "Delivery: 8 weeks ex-works",
  "Validity: 30 days",
  "",
].join("\n");

/**
 * Tiny client technical specification. Sent to /scope/generate as PRE-EXTRACTED
 * text (documentText), so that route differs from step 6 only by the AI Search
 * retrieval block — a failure here points straight at RAG.
 */
const SAMPLE_SCOPE_DOCUMENT = [
  "CLIENT TECHNICAL SPECIFICATION - SMARTBID DIAGNOSTIC SAMPLE",
  "",
  "Project: Subsea inspection campaign",
  "Scope of supply requested from the contractor:",
  "",
  "1. One (1) work class ROV system rated to 3000 msw, including launch and",
  "   recovery system, umbilical winch and control cabin.",
  "2. One (1) hydraulic manipulator, 7-function, with spare jaws.",
  "3. Survey sensor package: multibeam echo sounder, USBL transponder and",
  "   cathodic protection probe.",
  "4. Offshore crew: 2 ROV supervisors, 4 ROV pilots/technicians, 1 data",
  "   coordinator, on a 12-hour rotation.",
  "5. Mobilization and demobilization of all equipment at Macae base.",
  "",
  "All equipment shall be certified and delivered with valid class documents.",
  "",
].join("\n");

/** Trace rows from the MSAL service, shown inline with the token step. */
function traceRows(): Array<[string, string]> {
  return AiAuthService.trace.map(
    (t) =>
      [t.outcome.toUpperCase() + " " + t.step, t.detail || "—"] as [
        string,
        string,
      ],
  );
}

export const EntraTokenTest: React.FC = () => {
  const [steps, setSteps] = React.useState<IStep[]>([]);
  const [running, setRunning] = React.useState(false);
  const [scopeFile, setScopeFile] = React.useState<File | undefined>(undefined);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const config = useConfigStore((s) => s.config);
  // Same taxonomy AIDocumentAnalyzer sends, so the prompt is byte-identical to production.
  const resourceTypeOptions = React.useMemo(
    () =>
      (config?.resourceTypes || [])
        .filter((r) => r.isActive)
        .map((r) => ({
          label: r.label,
          subTypes: (r.subTypes || [])
            .filter((s) => s.isActive !== false)
            .map((s) => s.value),
        })),
    [config],
  );
  // Same taxonomy AddQuotationModal sends with a quotation extraction.
  const groupOptions = React.useMemo(
    () =>
      (config?.favoriteGroups || []).map((g) => ({
        name: g.name,
        subGroups: (g.subGroups || []).map((sg) => sg.name),
      })),
    [config],
  );

  const scope = AI_CONFIG.auth.scopes.join(" ");
  // Quotation extraction is a plain OpenAI call, so it isolates auth + model
  // without dragging AI Search retrieval into the result.
  const apiUrl = buildAiUrl(AI_CONFIG.endpoints.extractQuotation);
  const scopeUrl = buildAiUrl(AI_CONFIG.endpoints.generateScope);

  /** Add or replace a step, keeping the declared order. */
  const push = (step: IStep): void => {
    console.log(
      "[SmartBid AI] " + step.label + " -> " + step.status.toUpperCase(),
      step.summary || "",
    );
    setSteps((prev) => {
      const next = prev.filter((s) => s.id !== step.id).concat(step);
      next.sort((a, b) => STEP_ORDER.indexOf(a.id) - STEP_ORDER.indexOf(b.id));
      return next;
    });
  };

  const run = async (): Promise<void> => {
    setRunning(true);
    setSteps([]);
    AiAuthService.resetTrace();
    console.log(
      "%c[SmartBid AI] Diagnostic started",
      "font-weight:bold",
      new Date().toISOString(),
    );

    // ── 1) Configuration ────────────────────────────────────────────────────
    const configProblems: string[] = [];
    if (!GUID_RE.test(AI_CONFIG.auth.clientId.trim()))
      configProblems.push("auth.clientId is not a bare GUID.");
    if (!/^api:\/\/.+\/.+$/.test(scope))
      configProblems.push(
        'auth.scopes should look like "api://<app-id-uri>/<scopeName>" (or end in /.default).',
      );
    if (!/^https:\/\//i.test(AI_CONFIG.apiBaseUrl))
      configProblems.push("apiBaseUrl must be an https URL.");
    if (!AI_CONFIG.enabled)
      configProblems.push(
        "AI_CONFIG.enabled is false, so AI features stay hidden in the app. This diagnostic bypasses the flag — flip it to true once every step below passes.",
      );

    push({
      id: "config",
      label: STEP_LABEL.config,
      status: configProblems.length === 0 ? "ok" : "warn",
      summary:
        configProblems.length === 0
          ? "All values well formed"
          : configProblems.length + " item(s) to review",
      rows: [
        ["enabled", String(AI_CONFIG.enabled)],
        ["apiBaseUrl", AI_CONFIG.apiBaseUrl || "(not set)"],
        ["endpoint under test", apiUrl],
        ["auth.clientId", AI_CONFIG.auth.clientId || "(not set)"],
        [
          "auth.tenantId",
          AI_CONFIG.auth.tenantId || "(from SharePoint context)",
        ],
        ["auth.scopes", scope || "(not set)"],
        [
          "auth.redirectUri",
          AI_CONFIG.auth.redirectUri || "(current page URL)",
        ],
        ["sendPromptFromClient", String(AI_CONFIG.sendPromptFromClient)],
        ["promptVersion", QUOTATION_EXTRACTION_PROMPT_VERSION],
      ],
      hint: configProblems.length > 0 ? configProblems.join("\n") : undefined,
    });

    // ── 2) Session identity ─────────────────────────────────────────────────
    const pc = SPService.context.pageContext;
    push({
      id: "identity",
      label: STEP_LABEL.identity,
      status: "ok",
      summary: "Read from the SPFx page context — no approval needed",
      rows: [
        ["displayName", String(pc.user.displayName || "—")],
        ["loginName (upn)", String(pc.user.loginName || "—")],
        ["email", String(pc.user.email || "—")],
        ["Entra object id (oid)", String(pc.aadInfo?.userId || "—")],
        ["Entra tenant id (tid)", String(pc.aadInfo?.tenantId || "—")],
      ],
    });

    // ── 3) Token ────────────────────────────────────────────────────────────
    let accessToken: string | undefined;
    const tokenStart = Date.now();
    try {
      accessToken = await AiAuthService.getAccessToken();
      push({
        id: "token",
        label: STEP_LABEL.token,
        status: "ok",
        summary: "Token issued",
        durationMs: Date.now() - tokenStart,
        rows: traceRows(),
      });
    } catch (e) {
      const msg = errorText(e);
      let hint =
        "Send this exact message to IT together with the client id and scope shown in step 1.";
      if (/AADSTS65001|consent/i.test(msg))
        hint =
          "Admin consent is missing. Ask IT to grant admin consent for the API permission on the SmartBid SPA app registration.";
      else if (
        /AADSTS500011|AADSTS650057|invalid_resource|invalid_scope/i.test(msg)
      )
        hint =
          "The scope does not resolve. Ask IT for the exact scope name under Expose an API, or try api://<app-id-uri>/.default.";
      else if (/AADSTS50011|redirect_uri/i.test(msg))
        hint =
          "The redirect URI does not match. It must be registered under the SPA platform, byte for byte: " +
          (AI_CONFIG.auth.redirectUri || window.location.href);
      else if (/popup|blocked/i.test(msg))
        hint = "Allow pop-ups for this site and run the diagnostic again.";

      push({
        id: "token",
        label: STEP_LABEL.token,
        status: "fail",
        summary: "Token REFUSED",
        durationMs: Date.now() - tokenStart,
        rows: traceRows(),
        raw: msg,
        hint,
      });
    }

    // ── 3b) Scope discovery — only worth running when the token was refused ──
    if (accessToken) {
      push({
        id: "scopeProbe",
        label: STEP_LABEL.scopeProbe,
        status: "skipped",
        summary: "Not needed — the configured scope already works",
      });
    } else {
      const probeStart = Date.now();
      const candidates = candidateScopes();
      push({
        id: "scopeProbe",
        label: STEP_LABEL.scopeProbe,
        status: "running",
        summary: "Asking Entra ID about " + candidates.length + " candidates…",
      });

      const rows: Array<[string, string]> = [];
      const accepted: string[] = [];
      let resourceFound = false;
      for (let i = 0; i < candidates.length; i++) {
        const r = await AiAuthService.probeScope(candidates[i]);
        if (r.verdict !== "no-resource") resourceFound = true;
        if (r.verdict === "works" || r.verdict === "exists")
          accepted.push(r.scope);
        const verdictText =
          r.verdict === "works"
            ? "ACCEPTED — token issued"
            : r.verdict === "exists"
              ? "ACCEPTED — exists, needs consent"
              : r.verdict === "missing"
                ? "scope name does not exist"
                : r.verdict === "no-resource"
                  ? "resource/App ID URI unknown to the tenant"
                  : "inconclusive: " + r.detail.substring(0, 120);
        rows.push([r.scope, verdictText]);
      }

      let hint: string;
      if (accepted.length > 0)
        hint =
          "Set auth.scopes in ai.config.ts to:\n  " +
          accepted[0] +
          "\nthen run the diagnostic again.";
      else if (!resourceFound)
        hint =
          "None of the Application ID URIs exist in this tenant. Ask IT for the exact Application ID URI shown under Expose an API on the app registration that the Function App EasyAuth uses.";
      else
        hint =
          "The app registration exists but exposes no scope under any common name. Ask IT to open Expose an API on opgbbes-prd-sharepoint-aadapp, add a delegated scope (user_impersonation is the convention), grant admin consent, and send the full scope string.";

      push({
        id: "scopeProbe",
        label: STEP_LABEL.scopeProbe,
        status: accepted.length > 0 ? "ok" : "fail",
        summary:
          accepted.length > 0
            ? accepted.length + " scope(s) accepted by Entra ID"
            : "No candidate scope was accepted",
        durationMs: Date.now() - probeStart,
        rows,
        hint,
      });
    }

    // ── 4) Token claims ─────────────────────────────────────────────────────
    if (!accessToken) {
      push({
        id: "claims",
        label: STEP_LABEL.claims,
        status: "skipped",
        summary: "No token to inspect",
      });
    } else {
      const claims = decodeJwtPayload(accessToken);
      const aud = claimText(claims, "aud");
      const expectedAud = resourceFromScope(AI_CONFIG.auth.scopes[0] || "");
      const audMatches =
        aud === expectedAud ||
        aud === expectedAud.replace(/^api:\/\//, "") ||
        aud === AI_CONFIG.auth.clientId;
      const oidMatches =
        claimText(claims, "oid").toLowerCase() ===
        String(pc.aadInfo?.userId || "")
          .replace(/[{}]/g, "")
          .toLowerCase();

      push({
        id: "claims",
        label: STEP_LABEL.claims,
        status: audMatches ? "ok" : "warn",
        summary: audMatches
          ? "Audience matches the configured scope"
          : "Audience does NOT match the configured scope",
        rows: [
          ["token version (ver)", claimText(claims, "ver")],
          ["name", claimText(claims, "name")],
          ["upn / email", upnClaim(claims)],
          ["object id (oid)", claimText(claims, "oid")],
          ["oid matches SharePoint user", oidMatches ? "yes" : "no"],
          ["tenant (tid)", claimText(claims, "tid")],
          ["audience (aud)", aud],
          ["expected audience", expectedAud],
          ["scope (scp)", claimText(claims, "scp")],
          ["app roles (roles)", claimText(claims, "roles")],
          ["groups", claimText(claims, "groups")],
          ["app id (appid)", claimText(claims, "appid")],
        ],
        hint: audMatches
          ? undefined
          : "EasyAuth validates the aud claim. Ask IT to confirm the allowedAudiences on fa-opgb-bes-prd-fa includes: " +
            aud,
      });
    }

    // ── 5) Reachability / CORS (deliberately unauthenticated) ───────────────
    const corsStart = Date.now();
    console.log(
      "%c[SmartBid AI] The next POST is sent WITHOUT a token on purpose — a 401 in the console is the expected, correct result.",
      "color:#f59e0b",
    );
    try {
      const res = await fetchWithTimeout(
        apiUrl,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "omit",
          body: JSON.stringify({ probe: "cors" }),
        },
        20000,
      );
      push({
        id: "cors",
        label: STEP_LABEL.cors,
        status: "ok",
        summary: "Reachable — the CORS preflight passed",
        durationMs: Date.now() - corsStart,
        rows: [
          ["HTTP status (no token)", String(res.status)],
          [
            "interpretation",
            res.status === 401 || res.status === 403
              ? "EasyAuth is active and rejects anonymous calls — correct. The red 401 in the browser console belongs to THIS probe, not to a real failure."
              : "Endpoint answered anonymously — confirm with IT that auth is enforced",
          ],
        ],
      });
    } catch (e) {
      push({
        id: "cors",
        label: STEP_LABEL.cors,
        status: "fail",
        summary: "The browser blocked the call before it reached the backend",
        durationMs: Date.now() - corsStart,
        raw: errorText(e),
        hint: "This is almost always CORS. Ask IT to add https://oceaneering.sharepoint.com to the Function App allowed origins (Settings → CORS) and to allow the Authorization and Content-Type headers.",
      });
    }

    // ── 6) Real AI round trip ───────────────────────────────────────────────
    let quotationOk = false;
    if (!accessToken) {
      push({
        id: "ai",
        label: STEP_LABEL.ai,
        status: "skipped",
        summary: "No token — cannot call the AI endpoint",
      });
    } else {
      const aiStart = Date.now();
      const request: IAIAnalysisRequest = {
        fileName: "smartbid-diagnostic-quotation.txt",
        fileContent: btoa(SAMPLE_DOCUMENT),
        documentText: SAMPLE_DOCUMENT,
        division: "SSR-ROV",
        serviceLine: "ROV",
        resourceTypes: [],
        contextSummary:
          "SmartBid connectivity diagnostic — synthetic quotation, not a real BID.",
        bidNumber: "DIAGNOSTIC",
        useCase: "quotation",
      };
      if (AI_CONFIG.sendPromptFromClient) {
        request.systemPrompt = buildQuotationExtractionPrompt(groupOptions);
        request.promptVersion = QUOTATION_EXTRACTION_PROMPT_VERSION;
      }
      console.log("[SmartBid AI] POST " + apiUrl, {
        ...request,
        fileContent: "(" + request.fileContent.length + " base64 chars)",
        systemPrompt: request.systemPrompt
          ? "(" + request.systemPrompt.length + " chars)"
          : undefined,
      });

      try {
        const res = await fetchWithTimeout(
          apiUrl,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + accessToken,
            },
            credentials: "omit",
            body: JSON.stringify(request),
          },
          AI_CONFIG.requestTimeoutMs,
        );
        const body = await res.text();
        console.log("[SmartBid AI] HTTP " + res.status, body);

        let itemCount = "—";
        try {
          const parsed = JSON.parse(body) as Record<string, unknown>;
          const items = parsed.items || parsed.quotations || parsed.scopeItems;
          if (Array.isArray(items)) itemCount = String(items.length);
        } catch {
          /* not JSON — the raw body is shown below */
        }

        let hint: string | undefined;
        if (res.status === 401)
          hint =
            "EasyAuth rejected the token itself. The aud claim from step 4 must be listed in the Function App allowedAudiences.";
        else if (res.status === 403)
          hint =
            "EasyAuth accepted the token but the Function App refused the call. Check the Application Insights log for this timestamp — the request never reached the model.";
        else if (res.status === 404)
          hint =
            "The route does not exist. Confirm the exact path with IT — ai.config.ts currently uses " +
            AI_CONFIG.endpoints.extractQuotation +
            ".";
        else if (res.status >= 500)
          hint =
            "The Function App failed internally. Ask IT for the Application Insights trace at " +
            new Date().toISOString() +
            ".";
        else if (res.status === 429)
          hint = "Azure OpenAI throttled the request. Retry in a moment.";

        push({
          id: "ai",
          label: STEP_LABEL.ai,
          status: res.ok ? "ok" : "fail",
          summary: res.ok
            ? "HTTP " +
              res.status +
              " — AI responded with " +
              itemCount +
              " quotation line(s)"
            : "HTTP " + res.status + " — request rejected",
          durationMs: Date.now() - aiStart,
          rows: [
            ["HTTP status", String(res.status)],
            ["response size", body.length + " chars"],
            ["quotation lines returned", itemCount],
          ],
          raw: prettyJson(body) || "(empty body)",
          hint,
        });
        quotationOk = res.ok;
      } catch (e) {
        push({
          id: "ai",
          label: STEP_LABEL.ai,
          status: "fail",
          summary: "The request never completed",
          durationMs: Date.now() - aiStart,
          raw: errorText(e),
          hint:
            "If step 5 passed, this is a timeout or a dropped connection. Current timeout: " +
            AI_CONFIG.requestTimeoutMs +
            " ms.",
        });
      }
    }

    // ── 7 & 8) Scope of Supply ──────────────────────────────────────────────
    // Same endpoint the BID "Generate with AI" button uses. Step 7 sends
    // pre-extracted text (documentText), so the backend skips PDF parsing and
    // the ONLY thing it adds over step 6 is AI Search retrieval. Step 8 then
    // adds parsing back by sending a real file.
    const buildScopeRequest = (
      fileName: string,
      fileContent: string,
      documentText?: string,
    ): IAIAnalysisRequest => {
      const request: IAIAnalysisRequest = {
        fileName,
        fileContent,
        documentText,
        division: "SSR-ROV",
        serviceLine: "ROV",
        resourceTypes: resourceTypeOptions.map((r) => r.label),
        contextSummary:
          "SmartBid connectivity diagnostic — synthetic scope request, not a real BID.",
        bidNumber: "DIAGNOSTIC",
        useCase: "scope-of-supply",
      };
      if (AI_CONFIG.sendPromptFromClient) {
        request.systemPrompt = buildScopeOfSupplyPrompt(resourceTypeOptions);
        request.promptVersion = SCOPE_OF_SUPPLY_PROMPT_VERSION;
      }
      return request;
    };

    /** POST to /scope/generate and render the verdict. Returns res.ok. */
    const runScopeProbe = async (
      id: string,
      request: IAIAnalysisRequest,
      extraRows: Array<[string, string]>,
      interpret: (
        status: number,
        body: string,
        elapsedMs: number,
      ) => string | undefined,
    ): Promise<boolean> => {
      const start = Date.now();
      console.log("[SmartBid AI] POST " + scopeUrl, {
        ...request,
        fileContent: "(" + request.fileContent.length + " base64 chars)",
        documentText: request.documentText
          ? "(" + request.documentText.length + " chars)"
          : undefined,
        systemPrompt: request.systemPrompt
          ? "(" + request.systemPrompt.length + " chars)"
          : undefined,
      });
      try {
        const res = await fetchWithTimeout(
          scopeUrl,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + accessToken,
            },
            credentials: "omit",
            body: JSON.stringify(request),
          },
          AI_CONFIG.requestTimeoutMs,
        );
        const body = await res.text();
        console.log("[SmartBid AI] HTTP " + res.status, body);
        const elapsedMs = Date.now() - start;

        let itemCount = "—";
        let warningText = "—";
        try {
          const parsed = JSON.parse(body) as Record<string, unknown>;
          if (Array.isArray(parsed.scopeItems))
            itemCount = String((parsed.scopeItems as unknown[]).length);
          if (Array.isArray(parsed.warnings) && parsed.warnings.length > 0)
            warningText = (parsed.warnings as string[]).join(" | ");
        } catch {
          /* not JSON — the raw body is shown below */
        }

        push({
          id,
          label: STEP_LABEL[id],
          status: res.ok ? "ok" : "fail",
          summary: res.ok
            ? "HTTP " +
              res.status +
              " — " +
              itemCount +
              " scope item(s) returned"
            : "HTTP " + res.status + " — request rejected",
          durationMs: elapsedMs,
          rows: (
            [
              ["endpoint", scopeUrl],
              ["HTTP status", String(res.status)],
              ["request size", JSON.stringify(request).length + " chars"],
              ["scope items returned", itemCount],
              ["backend warnings", warningText],
            ] as Array<[string, string]>
          ).concat(extraRows),
          raw: prettyJson(body) || "(empty body)",
          hint: interpret(res.status, body, elapsedMs),
        });
        return res.ok;
      } catch (e) {
        push({
          id,
          label: STEP_LABEL[id],
          status: "fail",
          summary: "The request never completed",
          durationMs: Date.now() - start,
          rows: extraRows,
          raw: errorText(e),
          hint:
            "No HTTP status came back — the call timed out or was dropped. Scope generation is the slowest route (parsing + retrieval + model). Current timeout: " +
            AI_CONFIG.requestTimeoutMs +
            " ms.",
        });
        return false;
      }
    };

    let scopeRagOk = false;
    if (!accessToken) {
      push({
        id: "scopeRag",
        label: STEP_LABEL.scopeRag,
        status: "skipped",
        summary: "No token — cannot call the AI endpoint",
      });
    } else {
      scopeRagOk = await runScopeProbe(
        "scopeRag",
        buildScopeRequest(
          "smartbid-diagnostic-scope.txt",
          btoa(SAMPLE_SCOPE_DOCUMENT),
          SAMPLE_SCOPE_DOCUMENT,
        ),
        [
          ["document", "synthetic text, sent as documentText"],
          ["resource types in prompt", String(resourceTypeOptions.length)],
        ],
        (status, body, elapsedMs) => {
          if (status < 400) {
            return /could not be searched/i.test(body)
              ? "The call succeeded but AI Search did NOT answer, so the result is not grounded on the reference library. Check the index name, the vectorizer and the Function App's Search Index Data Reader role."
              : undefined;
          }
          if (status === 422)
            return "The backend could not read the sample text — it is ignoring documentText. Ask IT to confirm the deployed function_app.py matches this repo.";
          if (status === 404)
            return (
              "The route does not exist. ai.config.ts uses " +
              AI_CONFIG.endpoints.generateScope +
              "."
            );
          if (status >= 500) {
            if (!quotationOk)
              return "Step 6 failed too, so this is NOT specific to scope generation — the shared part (Azure OpenAI deployment, API version or the Function App itself) is broken. Start from step 6.";
            const timing =
              elapsedMs < 3000
                ? "It failed in " +
                  elapsedMs +
                  " ms — far too fast for a model call (step 6 took seconds), so it broke BEFORE Azure OpenAI was reached. "
                : "";
            return (
              "DIAGNOSIS: step 6 passed with the same auth, model and document text. The only extra component in this route is AI SEARCH RETRIEVAL. " +
              timing +
              "Checklist for IT on srch-opgbbes-prd, in order of likelihood:\n" +
              "  (1) Keys → API access control must be 'Both' or 'Role-based access control'. It is KEY-ONLY by default, and in that mode a managed-identity token is rejected even with the role assigned — this is the most common cause.\n" +
              "  (2) Role assignment: the Function App's system-assigned identity (fa-opgb-bes-prd-fa) needs 'Search Index Data Reader' on the search service. The indexer running fine proves nothing here — it uses a different identity.\n" +
              "  (3) App settings AZURE_SEARCH_ENDPOINT and AZURE_SEARCH_INDEX must match the real service and the index name 'smartbid-docs-index'.\n" +
              "  (4) The index needs the azureOpenAI vectorizer on field text_vector, and the embedding deployment it points to must exist — the vectorizer is only used at QUERY time, so a broken one does not show up in the indexer history.\n" +
              "  (5) Networking: if the search service has public network access disabled or an IP firewall, the Function App must be allowed through (VNet integration or a firewall rule)."
            );
          }
          return undefined;
        },
      );
    }

    if (!accessToken || !scopeFile) {
      push({
        id: "scopeFile",
        label: STEP_LABEL.scopeFile,
        status: "skipped",
        summary: !accessToken
          ? "No token — cannot call the AI endpoint"
          : "No document selected",
        hint: accessToken
          ? "Select the exact document that failed in the BID and run again — this step reproduces the production call, including backend PDF/DOCX parsing."
          : undefined,
      });
    } else {
      const base64 = await fileToBase64(scopeFile);
      await runScopeProbe(
        "scopeFile",
        buildScopeRequest(scopeFile.name, base64),
        [
          ["file name", scopeFile.name],
          ["file size", fileSize(scopeFile.size)],
          ["file type", scopeFile.type || "(unknown)"],
        ],
        (status) => {
          if (status < 400) return undefined;
          if (status === 422)
            return "The backend extracted no text. If this is a scanned PDF, vision OCR also failed — check the gpt-5-mini deployment quota and MAX_VISION_PAGES.";
          if (status >= 500) {
            return scopeRagOk
              ? "DIAGNOSIS: step 7 passed with the same endpoint and prompt, so retrieval and the model are fine. The extra component here is BACKEND DOCUMENT PARSING of this file — a corrupt/encrypted PDF, an unsupported extension, or a file large enough to blow the model context. Try a small text-based PDF to confirm."
              : "Step 7 failed too — fix that one first; it is the simpler case.";
          }
          return undefined;
        },
      );
    }

    console.log("%c[SmartBid AI] Diagnostic finished", "font-weight:bold");
    setRunning(false);
  };

  const copyReport = (): void => {
    const lines: string[] = [
      "SmartBid AI diagnostic — " + new Date().toISOString(),
      "",
    ];
    steps.forEach((s) => {
      lines.push(
        "[" +
          s.status.toUpperCase() +
          "] " +
          s.label +
          (s.summary ? " — " + s.summary : ""),
      );
      (s.rows || []).forEach(([k, v]) => lines.push("    " + k + ": " + v));
      if (s.hint) lines.push("    HINT: " + s.hint);
      if (s.raw) lines.push("    ---", s.raw);
      lines.push("");
    });
    const full = lines.join("\n");
    console.log(full);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(full).catch(() => {
        /* clipboard blocked — the report is in the console above */
      });
    }
  };

  const statusColor = (s: StepStatus): string => {
    if (s === "ok") return "var(--success)";
    if (s === "fail") return "var(--danger)";
    if (s === "warn") return "var(--warning, #f59e0b)";
    return "var(--text-muted)";
  };

  const statusLabel = (s: StepStatus): string => {
    if (s === "ok") return "PASS ✓";
    if (s === "fail") return "FAIL ✗";
    if (s === "warn") return "REVIEW ⚠";
    if (s === "skipped") return "SKIPPED";
    return "…";
  };

  const runFresh = async (): Promise<void> => {
    await AiAuthService.clearTokenCache();
    await run();
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
  const ghostBtn: React.CSSProperties = {
    ...btn,
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid var(--border)",
  };
  const stepHead: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 12,
    margin: "20px 0 6px",
    fontWeight: 600,
  };
  const hintBox: React.CSSProperties = {
    marginTop: 8,
    padding: 12,
    background: "var(--main-bg)",
    borderLeft: "3px solid var(--primary-accent)",
    borderRadius: 6,
    color: "var(--text-primary)",
    whiteSpace: "pre-wrap",
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
    maxHeight: 260,
    overflow: "auto",
  };

  return (
    <div style={wrap}>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button style={btn} onClick={run} disabled={running}>
          {running ? "Running…" : "▶ Run full diagnostic"}
        </button>
        <button style={ghostBtn} onClick={runFresh} disabled={running}>
          ↻ Clear token cache & run
        </button>
        {steps.length > 0 && !running && (
          <button style={ghostBtn} onClick={copyReport}>
            Copy report for IT
          </button>
        )}
        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
          Use “Clear token cache” after any Entra ID change — a cached token
          keeps the old claims for about an hour.
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: 12,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: "none" }}
          onChange={(e) =>
            setScopeFile(
              e.target.files && e.target.files.length > 0
                ? e.target.files[0]
                : undefined,
            )
          }
        />
        <button
          style={ghostBtn}
          onClick={() => fileInputRef.current?.click()}
          disabled={running}
        >
          📄 Attach the document that failed (step 8)
        </button>
        {scopeFile && (
          <>
            <span style={{ fontFamily: "Consolas, monospace", fontSize: 12 }}>
              {scopeFile.name} · {fileSize(scopeFile.size)}
            </span>
            <button
              style={ghostBtn}
              onClick={() => setScopeFile(undefined)}
              disabled={running}
            >
              ✕ Remove
            </button>
          </>
        )}
        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
          Optional. Step 8 replays the exact production call for that file,
          including backend PDF/Word parsing.
        </span>
      </div>

      {steps.length > 0 && (
        <div style={panel}>
          {steps.map((s) => (
            <div key={s.id}>
              <div style={stepHead}>
                <span>{s.label}</span>
                <span
                  style={{
                    color: statusColor(s.status),
                    whiteSpace: "nowrap",
                  }}
                >
                  {statusLabel(s.status)}
                  {typeof s.durationMs === "number"
                    ? " · " + s.durationMs + " ms"
                    : ""}
                </span>
              </div>
              {s.summary && (
                <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                  {s.summary}
                </div>
              )}
              {(s.rows || []).map(([k, v]) => (
                <div style={row} key={k}>
                  <span style={label}>{k}</span>
                  <span style={val}>{v}</span>
                </div>
              ))}
              {s.raw && <div style={codeBox}>{s.raw}</div>}
              {s.hint && <div style={hintBox}>{s.hint}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
