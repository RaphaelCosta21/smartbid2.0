/**
 * AIAnalysisService — Sends a client document to the secure Azure AI gateway
 * (APIM → Function App) and returns a structured Scope of Supply for human
 * review. Requests are authenticated with the signed-in user's Entra ID token
 * via the SPFx AadHttpClient; model keys never reach the browser.
 *
 * Configure the endpoint in app/config/ai.config.ts. The prompt lives in
 * app/config/ai.prompts.ts and is sent with each request when
 * AI_CONFIG.sendPromptFromClient is true.
 *
 * Supports both BIDs and Templates. Static singleton pattern.
 */
import { SPService } from "./SPService";
import { IScopeItem } from "../models";
import {
  IAIAnalysisResult,
  IAIAnalysisRequest,
  IAIAnalysisContext,
  IAISuggestedClarification,
  IExtractedQuotationLine,
  IQuotationExtractionResult,
  AIUseCase,
} from "../models/IAIAnalysis";
import { makeId } from "../utils/idGenerator";
import { AI_CONFIG, buildAiUrl, isAiConfigured } from "../config/ai.config";
import {
  buildScopeOfSupplyPrompt,
  SCOPE_OF_SUPPLY_PROMPT_VERSION,
  buildQuotationExtractionPrompt,
  QUOTATION_EXTRACTION_PROMPT_VERSION,
  buildClarificationSuggestionPrompt,
  CLARIFICATION_SUGGESTION_PROMPT_VERSION,
} from "../config/ai.prompts";
import {
  AadHttpClient,
  HttpClient,
  IHttpClientOptions,
  HttpClientResponse,
} from "@microsoft/sp-http";

export class AIAnalysisService {
  /**
   * Validate and normalize the structured JSON returned by the AI backend.
   */
  private static validateResponse(
    data: unknown,
    fileName: string,
  ): IAIAnalysisResult {
    const raw = data as Record<string, unknown>;

    // Check if it's an error response
    if (raw.error) {
      const errMsg = raw.details
        ? `${raw.error}: ${raw.details}`
        : String(raw.error);
      throw new Error(errMsg);
    }

    // Validate scopeItems is an array (accept both "scopeItems" and "items" keys)
    const rawItems = raw.scopeItems || raw.items;
    const scopeItems = Array.isArray(rawItems) ? rawItems : [];
    const warnings = Array.isArray(raw.warnings) ? raw.warnings : [];
    const chunksProcessed =
      typeof raw.chunksProcessed === "number" ? raw.chunksProcessed : 1;
    // Accept both "isComplete" and "complete" keys
    const rawComplete =
      raw.isComplete !== undefined ? raw.isComplete : raw.complete;
    const isComplete = typeof rawComplete === "boolean" ? rawComplete : true;

    // Normalize each scope item — assign IDs and lineNumbers
    let lineNum = 1;
    let currentSectionId: string | null = null;
    const normalized: IScopeItem[] = [];

    scopeItems.forEach((item: Record<string, unknown>) => {
      const id = makeId("ai");
      const isSection = !!item.isSection;

      if (isSection) {
        currentSectionId = id;
        normalized.push({
          id,
          lineNumber: lineNum++,
          isSection: true,
          sectionId: null,
          sectionTitle: String(item.sectionTitle || "Untitled Section"),
          clientDocRef: "",
          description: "",
          compliance: null,
          resourceType: "",
          resourceSubType: "",
          equipmentOffer: "",
          partNumber: "",
          qtyOperational: 0,
          qtySpare: 0,
          needsCertification: false,
          comments: "",
          importedFromTemplate: "ai-analysis",
          integratedDivision: "",
          clientRequirement: "",
          clientSpecs: [],
          source: "ai",
          aiPendingReview: true,
          sectionColor: item.sectionColor
            ? String(item.sectionColor)
            : undefined,
        });
      } else {
        normalized.push({
          id,
          lineNumber: lineNum++,
          isSection: false,
          sectionId: currentSectionId,
          sectionTitle: "",
          clientDocRef: String(item.clientDocRef || ""),
          description: String(item.description || ""),
          compliance:
            item.compliance === "yes" || item.compliance === "no"
              ? (item.compliance as "yes" | "no")
              : null,
          resourceType: String(item.resourceType || ""),
          resourceSubType: String(item.resourceSubType || ""),
          equipmentOffer: "",
          partNumber: String(item.oiiPartNumber || item.partNumber || ""),
          qtyOperational:
            typeof item.qtyOperational === "number" ? item.qtyOperational : 1,
          qtySpare: typeof item.qtySpare === "number" ? item.qtySpare : 0,
          needsCertification: false,
          comments: "",
          importedFromTemplate: "ai-analysis",
          integratedDivision: "",
          clientRequirement: String(item.clientRequirement || ""),
          clientSpecs: Array.isArray(item.clientSpecs)
            ? (item.clientSpecs as string[])
            : [],
          source: "ai",
          aiPendingReview: true,
        });
      }
    });

    // Add incompleteness warning
    if (!isComplete) {
      warnings.push(
        "Analysis may be incomplete. The document may be too large for a single analysis pass.",
      );
    }
    if (chunksProcessed > 1) {
      warnings.push(
        "Document was analyzed in " +
          chunksProcessed +
          " parts. Some items may be duplicated across section boundaries.",
      );
    }

    return {
      scopeItems: normalized,
      warnings: warnings.map(String),
      chunksProcessed,
      isComplete,
      sourceDocument: raw.sourceDocument
        ? String(raw.sourceDocument)
        : fileName,
      analyzedAt: raw.analyzedAt
        ? String(raw.analyzedAt)
        : new Date().toISOString(),
      suggestedClarifications: AIAnalysisService.parseClarifications(
        raw.suggestedClarifications,
      ),
    };
  }

  /**
   * Read a File as a base64 string (without the data: prefix).
   */
  private static fileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        const comma = result.indexOf(",");
        resolve(comma >= 0 ? result.substring(comma + 1) : result);
      };
      reader.onerror = () => reject(new Error("Failed to read the file."));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Throw a clear error when the Azure AI backend has not been configured yet.
   */
  private static ensureConfigured(): void {
    if (!isAiConfigured()) {
      throw new Error(
        "The AI service is not configured yet. Ask IT for the APIM endpoint, then set apimBaseUrl (and aadResource) in app/config/ai.config.ts and set AI_CONFIG.enabled to true.",
      );
    }
  }

  /**
   * Wrap a backend call with a timeout and optional cancellation. The underlying
   * request cannot be truly aborted, but we stop waiting and surface a clear error.
   */
  private static withAbort<T>(
    promise: Promise<T>,
    signal?: AbortSignal,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let settled = false;
      let timer: ReturnType<typeof setTimeout> | undefined;

      function onAbort(): void {
        fail("Analysis was cancelled.");
      }
      const cleanup = (): void => {
        if (timer) clearTimeout(timer);
        if (signal) signal.removeEventListener("abort", onAbort);
      };
      const fail = (message: string): void => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error(message));
      };
      const succeed = (value: T): void => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(value);
      };

      if (signal && signal.aborted) {
        fail("Analysis was cancelled.");
        return;
      }
      timer = setTimeout(
        () => fail("The AI request timed out. Please try again."),
        AI_CONFIG.requestTimeoutMs,
      );
      if (signal) signal.addEventListener("abort", onAbort, { once: true });

      promise.then(succeed, (e) =>
        fail(e instanceof Error ? e.message : "The AI request failed."),
      );
    });
  }

  /**
   * Build the request payload for a use case, attaching the client-side prompt
   * when AI_CONFIG.sendPromptFromClient is enabled.
   */
  private static async buildRequest(
    file: File,
    useCase: AIUseCase,
    context: IAIAnalysisContext,
    ids: { bidNumber?: string; templateId?: string },
  ): Promise<IAIAnalysisRequest> {
    const fileContent = await AIAnalysisService.fileToBase64(file);
    const resourceTypes = context.resourceTypes || [];

    const request: IAIAnalysisRequest = {
      fileName: file.name,
      fileContent,
      division: context.division || "",
      serviceLine: context.serviceLine || "",
      resourceTypes,
      contextSummary: context.contextSummary || "",
      bidNumber: ids.bidNumber,
      templateId: ids.templateId,
      useCase,
    };

    if (AI_CONFIG.sendPromptFromClient) {
      if (useCase === "scope-of-supply") {
        request.systemPrompt = buildScopeOfSupplyPrompt(resourceTypes);
        request.promptVersion = SCOPE_OF_SUPPLY_PROMPT_VERSION;
      } else if (useCase === "quotation") {
        request.systemPrompt = buildQuotationExtractionPrompt();
        request.promptVersion = QUOTATION_EXTRACTION_PROMPT_VERSION;
      }
    }

    return request;
  }

  /**
   * POST a JSON payload to an AI endpoint. Uses the Entra ID-authenticated
   * AadHttpClient when aadResource is set; otherwise falls back to HttpClient
   * (optionally with an APIM subscription key — testing only).
   */
  private static async postJson(
    endpointPath: string,
    body: unknown,
    signal?: AbortSignal,
  ): Promise<unknown> {
    const url = buildAiUrl(endpointPath);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (AI_CONFIG.subscriptionKey) {
      headers[AI_CONFIG.subscriptionKeyHeaderName] = AI_CONFIG.subscriptionKey;
    }
    const options: IHttpClientOptions = {
      headers,
      body: JSON.stringify(body),
    };

    let requestPromise: Promise<HttpClientResponse>;
    if (AI_CONFIG.aadResource) {
      const client = await SPService.context.aadHttpClientFactory.getClient(
        AI_CONFIG.aadResource,
      );
      requestPromise = client.post(
        url,
        AadHttpClient.configurations.v1,
        options,
      );
    } else {
      requestPromise = SPService.context.httpClient.post(
        url,
        HttpClient.configurations.v1,
        options,
      );
    }

    const response = await AIAnalysisService.withAbort(requestPromise, signal);
    const text = await response.text();

    if (!response.ok) {
      throw new Error(
        AIAnalysisService.describeHttpError(response.status, text),
      );
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("The AI returned an invalid response. Please try again.");
    }
  }

  /**
   * Map an HTTP error to a friendly message (aligns with the API contract).
   */
  private static describeHttpError(status: number, text: string): string {
    try {
      const parsed = JSON.parse(text) as { error?: string; details?: string };
      if (parsed && parsed.error) {
        return parsed.details
          ? `${parsed.error}: ${parsed.details}`
          : String(parsed.error);
      }
    } catch {
      /* not JSON — fall through to status-based messages */
    }
    if (status === 401 || status === 403) {
      return "You are not authorized to use the AI service. Please sign in again or contact IT.";
    }
    if (status === 422) {
      return "The document could not be read (it may be a scanned PDF). Try a text-based file or enter items manually.";
    }
    if (status === 429) {
      return "The AI service is busy right now. Please try again in a moment.";
    }
    return `The AI request failed (HTTP ${status}). Please try again or contact IT.`;
  }

  /**
   * Analyze a client document for a BID and return a structured Scope of Supply.
   *
   * @param file - PDF or Word file (client technical document)
   * @param bidNumber - BID number (e.g. "REQ-2026-0007") for traceability
   * @param context - Division / service line / resource types for categorization
   * @param abortSignal - Optional AbortSignal for cancellation
   */
  public static async analyzeDocument(
    file: File,
    bidNumber: string,
    context: IAIAnalysisContext = {},
    abortSignal?: AbortSignal,
  ): Promise<IAIAnalysisResult> {
    AIAnalysisService.ensureConfigured();
    const request = await AIAnalysisService.buildRequest(
      file,
      "scope-of-supply",
      context,
      { bidNumber },
    );
    const data = await AIAnalysisService.postJson(
      AI_CONFIG.endpoints.generateScope,
      request,
      abortSignal,
    );
    const result = AIAnalysisService.validateResponse(data, file.name);
    result.promptVersion = request.promptVersion;
    return result;
  }

  /**
   * Analyze a client document for a Template and return structured scope items.
   *
   * @param file - PDF or Word file (client technical document)
   * @param templateId - Template id for traceability
   * @param context - Division / service line / resource types for categorization
   * @param abortSignal - Optional AbortSignal for cancellation
   */
  public static async analyzeDocumentForTemplate(
    file: File,
    templateId: string,
    context: IAIAnalysisContext = {},
    abortSignal?: AbortSignal,
  ): Promise<IAIAnalysisResult> {
    AIAnalysisService.ensureConfigured();
    const request = await AIAnalysisService.buildRequest(
      file,
      "scope-of-supply",
      context,
      { templateId },
    );
    const data = await AIAnalysisService.postJson(
      AI_CONFIG.endpoints.generateScope,
      request,
      abortSignal,
    );
    const result = AIAnalysisService.validateResponse(data, file.name);
    result.promptVersion = request.promptVersion;
    return result;
  }

  /**
   * Normalize the AI's suggestedClarifications array into typed objects.
   */
  private static parseClarifications(
    raw: unknown,
  ): IAISuggestedClarification[] {
    if (!Array.isArray(raw)) return [];
    const out: IAISuggestedClarification[] = [];
    raw.forEach((entry: Record<string, unknown>) => {
      const c = entry || {};
      const text = String(c.clarification || c.description || "").trim();
      if (!text) return;
      out.push({
        baseType:
          c.baseType === "Qualification" ? "Qualification" : "Clarification",
        description: String(c.description || "").trim(),
        clarification: text,
        rationale: c.rationale ? String(c.rationale) : undefined,
        relatedRef: c.relatedRef ? String(c.relatedRef) : undefined,
        confidence: typeof c.confidence === "number" ? c.confidence : undefined,
      });
    });
    return out;
  }

  /**
   * Validate and normalize the quotation extraction response.
   */
  private static validateQuotationResult(
    data: unknown,
    fileName: string,
  ): IQuotationExtractionResult {
    const raw = data as Record<string, unknown>;
    if (raw.error) {
      const errMsg = raw.details
        ? `${raw.error}: ${raw.details}`
        : String(raw.error);
      throw new Error(errMsg);
    }
    const rawItems = raw.items || raw.quotations;
    const list = Array.isArray(rawItems) ? rawItems : [];
    const items: IExtractedQuotationLine[] = [];
    list.forEach((entry: Record<string, unknown>) => {
      const it = entry || {};
      const description = String(it.description || "").trim();
      const cost = typeof it.cost === "number" ? it.cost : Number(it.cost) || 0;
      if (!description && cost <= 0) return;
      items.push({
        partNumber: String(it.partNumber || it.oiiPartNumber || ""),
        description,
        supplier: String(it.supplier || ""),
        cost,
        currency: String(it.currency || "USD").toUpperCase(),
        leadTimeDays:
          typeof it.leadTimeDays === "number"
            ? it.leadTimeDays
            : Number(it.leadTimeDays) || 0,
        quotationDate: String(it.quotationDate || ""),
        type: it.type === "rental" ? "rental" : "acquisition",
        notes: String(it.notes || ""),
        suggestedGroupName: it.suggestedGroupName
          ? String(it.suggestedGroupName)
          : undefined,
        suggestedSubGroupName: it.suggestedSubGroupName
          ? String(it.suggestedSubGroupName)
          : undefined,
        confidence:
          typeof it.confidence === "number" ? it.confidence : undefined,
      });
    });
    const warnings = Array.isArray(raw.warnings)
      ? raw.warnings.map(String)
      : [];
    if (items.length === 0) {
      warnings.push(
        "No quotation items could be extracted. Try a clearer file or enter them manually.",
      );
    }
    return {
      items,
      warnings,
      sourceDocument: raw.sourceDocument
        ? String(raw.sourceDocument)
        : fileName,
      extractedAt: raw.extractedAt
        ? String(raw.extractedAt)
        : new Date().toISOString(),
    };
  }

  /**
   * Extract structured line items from a supplier quotation document.
   *
   * @param file - Supplier quotation file (PDF/Word/image)
   * @param context - Optional division / service line context
   * @param abortSignal - Optional AbortSignal for cancellation
   */
  public static async extractQuotation(
    file: File,
    context: IAIAnalysisContext = {},
    abortSignal?: AbortSignal,
  ): Promise<IQuotationExtractionResult> {
    AIAnalysisService.ensureConfigured();
    const request = await AIAnalysisService.buildRequest(
      file,
      "quotation",
      context,
      {},
    );
    const data = await AIAnalysisService.postJson(
      AI_CONFIG.endpoints.extractQuotation,
      request,
      abortSignal,
    );
    return AIAnalysisService.validateQuotationResult(data, file.name);
  }

  /**
   * Suggest clarifications/qualifications for the current BID, grounded in past
   * accepted ones retrieved by the backend (RAG over the Clarifications DB).
   *
   * @param requirementsText - Serialized current BID requirements / scope
   * @param context - Division / service line / resource types for retrieval
   * @param abortSignal - Optional AbortSignal for cancellation
   */
  public static async suggestClarifications(
    requirementsText: string,
    context: IAIAnalysisContext = {},
    abortSignal?: AbortSignal,
  ): Promise<IAISuggestedClarification[]> {
    AIAnalysisService.ensureConfigured();
    const request: IAIAnalysisRequest = {
      fileName: "",
      fileContent: "",
      documentText: requirementsText,
      division: context.division || "",
      serviceLine: context.serviceLine || "",
      resourceTypes: context.resourceTypes || [],
      contextSummary: context.contextSummary || "",
      useCase: "clarification",
    };
    if (AI_CONFIG.sendPromptFromClient) {
      request.systemPrompt = buildClarificationSuggestionPrompt();
      request.promptVersion = CLARIFICATION_SUGGESTION_PROMPT_VERSION;
    }
    const data = await AIAnalysisService.postJson(
      AI_CONFIG.endpoints.suggestClarifications,
      request,
      abortSignal,
    );
    const raw = data as Record<string, unknown>;
    if (raw.error) {
      const errMsg = raw.details
        ? `${raw.error}: ${raw.details}`
        : String(raw.error);
      throw new Error(errMsg);
    }
    return AIAnalysisService.parseClarifications(
      raw.suggestedClarifications || raw.items,
    );
  }
}
