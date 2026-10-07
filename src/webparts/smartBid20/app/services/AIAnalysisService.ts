/**
 * AIAnalysisService — Sends a client document to the secure Azure AI gateway
 * (Function App behind EasyAuth) and returns a structured Scope of Supply for
 * human review. Requests are authenticated with the signed-in user's Entra ID
 * token acquired by AiAuthService (MSAL, authorization code + PKCE); model keys
 * never reach the browser.
 *
 * Configure the endpoint in app/config/ai.config.ts. The prompt lives in
 * app/config/ai.prompts.ts and is sent with each request when
 * AI_CONFIG.sendPromptFromClient is true.
 *
 * Supports both BIDs and Templates. Static singleton pattern.
 */
import { AiAuthService } from "./AiAuthService";
import { IConfigOption, IScopeItem, IScopeSubItem } from "../models";
import {
  IAIAnalysisResult,
  IAIAnalysisRequest,
  IAIAnalysisContext,
  IAISuggestedClarification,
  IAISuggestedQualification,
  IExtractedQuotationLine,
  IQuotationExtractionResult,
  IExtractedDocumentMetadata,
  IDocumentMetadataExtractionResult,
  IAIGroupOption,
  IPastBidProfileSuggestion,
  ISupplierProfileSuggestion,
  SupplierProfileBasis,
  AIUseCase,
} from "../models/IAIAnalysis";
import {
  IChatAnswer,
  IChatCitation,
  IChatMessage,
  IChatRetrievedDoc,
  IPastBidChatContext,
} from "../models/IAiChat";
import { makeId } from "../utils/idGenerator";
import { AI_CONFIG, buildAiUrl, isAiConfigured } from "../config/ai.config";
import {
  buildScopeOfSupplyPrompt,
  SCOPE_OF_SUPPLY_PROMPT_VERSION,
  buildQuotationExtractionPrompt,
  QUOTATION_EXTRACTION_PROMPT_VERSION,
  buildDocumentMetadataExtractionPrompt,
  DOCUMENT_METADATA_EXTRACTION_PROMPT_VERSION,
  buildKnowledgeChatPrompt,
  KNOWLEDGE_CHAT_PROMPT_VERSION,
  buildPastBidProfilePrompt,
  PAST_BID_PROFILE_PROMPT_VERSION,
  buildSupplierProfilePrompt,
  SUPPLIER_PROFILE_PROMPT_VERSION,
  buildClarificationSuggestionPrompt,
  CLARIFICATION_SUGGESTION_PROMPT_VERSION,
  buildQualificationSuggestionPrompt,
  QUALIFICATION_SUGGESTION_PROMPT_VERSION,
} from "../config/ai.prompts";

const SUPPLIER_PROFILE_BASES: SupplierProfileBasis[] = [
  "quotations",
  "document",
  "general-knowledge",
  "mixed",
  "none",
];

/** Only same-tenant SharePoint links are rendered as citations. */
const CHAT_CITATION_ORIGIN = "https://oceaneering.sharepoint.com/";
const CHAT_MAX_ANSWER_CHARS = 4000;
const CHAT_MAX_CITATIONS = 5;
const CHAT_MAX_FOLLOW_UPS = 3;

export class AIAnalysisService {
  /** Normalize the sub-items (consumables, spares, accessories) of one scope item. */
  private static normalizeSubItems(raw: unknown): IScopeSubItem[] | undefined {
    if (!Array.isArray(raw) || raw.length === 0) return undefined;
    const subs: IScopeSubItem[] = [];
    raw.forEach((entry) => {
      const sub = entry as Record<string, unknown>;
      const description = String(sub.description || "");
      const partNumber = String(sub.partNumber || "");
      if (!description && !partNumber) return;
      subs.push({
        id: makeId("ai"),
        description,
        subType: String(sub.subType || ""),
        equipmentOffer: String(sub.equipmentOffer || ""),
        partNumber,
        qty: typeof sub.qty === "number" ? sub.qty : 1,
        comments: String(sub.comments || ""),
      });
    });
    return subs.length > 0 ? subs : undefined;
  }

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
          equipmentOffer: String(item.equipmentOffer || ""),
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
          subItems: AIAnalysisService.normalizeSubItems(item.subItems),
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
        "AI is not available yet - IT is still finishing the Azure setup (Function App + app registration). Please try again later or contact IT.",
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
    const resourceTypeOptions =
      context.resourceTypeOptions ||
      resourceTypes.map((label) => ({ label, subTypes: [] }));

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
        request.systemPrompt = buildScopeOfSupplyPrompt(
          resourceTypeOptions,
          context.assetCatalogOptions || [],
          context.userInstructions,
        );
        request.promptVersion = SCOPE_OF_SUPPLY_PROMPT_VERSION;
      } else if (useCase === "quotation") {
        request.systemPrompt = buildQuotationExtractionPrompt(
          context.groupOptions || [],
          context.supplierOptions || [],
        );
        request.promptVersion = QUOTATION_EXTRACTION_PROMPT_VERSION;
      } else if (useCase === "document-metadata") {
        request.systemPrompt = buildDocumentMetadataExtractionPrompt(
          context.docTypeOptions || [],
          context.groupOptions || [],
        );
        request.promptVersion = DOCUMENT_METADATA_EXTRACTION_PROMPT_VERSION;
      } else if (useCase === "past-bid-profile") {
        request.systemPrompt = buildPastBidProfilePrompt(
          context.scopeCategoryOptions || [],
        );
        request.promptVersion = PAST_BID_PROFILE_PROMPT_VERSION;
      } else if (useCase === "supplier-profile") {
        request.systemPrompt = buildSupplierProfilePrompt(
          context.serviceTypeOptions || [],
        );
        request.promptVersion = SUPPLIER_PROFILE_PROMPT_VERSION;
      }
    }

    return request;
  }

  /**
   * POST a JSON payload to an AI endpoint with the signed-in user's Entra ID
   * access token (MSAL, authorization code + PKCE) in the Authorization header.
   */
  private static async postJson(
    endpointPath: string,
    body: unknown,
    signal?: AbortSignal,
  ): Promise<unknown> {
    const url = buildAiUrl(endpointPath);
    const accessToken = await AiAuthService.getAccessToken();

    const requestPromise = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(body),
      // The token is the only credential — never send SharePoint cookies cross-origin.
      credentials: "omit",
      signal,
    });

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

  // ───────────────────────────────────────────────────────────────────
  // Knowledge chat
  // ───────────────────────────────────────────────────────────────────

  /**
   * Keep only citations that point at a document in our own SharePoint tenant —
   * the model must never be able to render a javascript:/data: link.
   */
  private static parseChatCitations(raw: unknown): IChatCitation[] {
    if (!Array.isArray(raw)) return [];
    const out: IChatCitation[] = [];
    const seen: Record<string, boolean> = {};
    raw.forEach((entry) => {
      const c = (entry || {}) as Record<string, unknown>;
      const title = String(c.title || "").trim();
      const url = String(c.url || "").trim();
      if (!title || url.toLowerCase().indexOf(CHAT_CITATION_ORIGIN) !== 0) {
        return;
      }
      if (seen[url]) return;
      seen[url] = true;
      const detail = String(c.detail || "").trim();
      out.push({ title, url, detail: detail || undefined });
    });
    return out.slice(0, CHAT_MAX_CITATIONS);
  }

  private static parseChatFollowUps(raw: unknown): string[] {
    if (!Array.isArray(raw)) return [];
    const out: string[] = [];
    raw.forEach((entry) => {
      const text = String(entry || "").trim();
      if (text) out.push(text.substring(0, 120));
    });
    return out.slice(0, CHAT_MAX_FOLLOW_UPS);
  }

  /** Excerpts the search returned, reported by the backend so retrieval can be inspected. */
  private static parseChatRetrieved(raw: unknown): IChatRetrievedDoc[] {
    if (!Array.isArray(raw)) return [];
    const out: IChatRetrievedDoc[] = [];
    raw.forEach((entry) => {
      const r = (entry || {}) as Record<string, unknown>;
      const title = String(r.title || "").trim();
      if (!title) return;
      out.push({
        title,
        url: String(r.url || "").trim(),
        section: String(r.section || "").trim(),
        snippet: String(r.snippet || "")
          .trim()
          .substring(0, 200),
      });
    });
    return out.slice(0, 20);
  }

  /** Parse the flat response returned by the dedicated /chat route. */
  private static parseChatAnswer(data: unknown): IChatAnswer {
    const raw = (data || {}) as Record<string, unknown>;
    if (raw.error) {
      throw new Error(
        raw.details ? `${raw.error}: ${raw.details}` : String(raw.error),
      );
    }
    const answer = String(raw.answer || "").trim();
    if (!answer) {
      throw new Error(
        "The assistant could not produce an answer. Please rephrase your question and try again.",
      );
    }
    const refused = raw.refused === true;
    return {
      answer: answer.substring(0, CHAT_MAX_ANSWER_CHARS),
      refused,
      citations: refused
        ? []
        : AIAnalysisService.parseChatCitations(raw.citations),
      followUps: AIAnalysisService.parseChatFollowUps(raw.followUps),
      retrieved: AIAnalysisService.parseChatRetrieved(raw.retrieved),
    };
  }

  /**
   * Ask the knowledge assistant a question, grounded on the AI Search library.
   *
   * @param question - The user's question
   * @param history - Earlier turns of the conversation, oldest first
   * @param abortSignal - Optional AbortSignal for cancellation
   * @param pastBids - Completed BIDs SmartBid matched to the question (ledger + refs)
   * @param clarificationLibrary - Also search the Clarif. & Qualif. library
   */
  public static async chat(
    question: string,
    history: IChatMessage[] = [],
    abortSignal?: AbortSignal,
    pastBids?: IPastBidChatContext | null,
    clarificationLibrary = false,
  ): Promise<IChatAnswer> {
    AIAnalysisService.ensureConfigured();

    const text = String(question || "")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, AI_CONFIG.chat.maxQuestionChars);

    const messages = history
      .filter((m) => m.text)
      .map((m) => ({ role: m.role, content: m.text }));
    messages.push({ role: "user", content: text });

    const data = await AIAnalysisService.postJson(
      AI_CONFIG.endpoints.chat,
      {
        messages,
        systemPrompt: buildKnowledgeChatPrompt(),
        promptVersion: KNOWLEDGE_CHAT_PROMPT_VERSION,
        topK: AI_CONFIG.chat.topK,
        ...(pastBids
          ? { pastBidsLedger: pastBids.ledger, pastBidRefs: pastBids.refs }
          : {}),
        ...(clarificationLibrary ? { clarificationLibrary: true } : {}),
      },
      abortSignal,
    );
    return AIAnalysisService.parseChatAnswer(data);
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
    let foldedCount = 0;
    const notQuoted: string[] = [];
    let supplierAbout = "";
    list.forEach((entry: Record<string, unknown>) => {
      const it = entry || {};
      if (!supplierAbout)
        supplierAbout = String(it.supplierAbout || "")
          .trim()
          .substring(0, 600);
      const description = String(it.description || "").trim();
      const cost = typeof it.cost === "number" ? it.cost : Number(it.cost) || 0;
      if (!description && cost <= 0) return;
      const partNumber = String(it.partNumber || it.oiiPartNumber || "");
      const included = String(it.includedComponents || "").trim();
      // The supplier did not price it, so it is neither part of the row above nor savable here.
      if (it.notQuoted === true && cost <= 0) {
        const reason = String(it.notes || "").trim();
        notQuoted.push(reason ? `${description} (${reason})` : description);
        return;
      }
      // Quotation tables bundle accessories/spec rows priced 0 under the
      // position above them. When the model still returns them as standalone
      // entries, fold them back into the parent instead of registering extra
      // catalog items.
      const parent = items[items.length - 1];
      if (cost <= 0 && parent && parent.cost > 0) {
        const label = [partNumber, description].filter(Boolean).join(" - ");
        if (label) {
          parent.includedComponents = parent.includedComponents
            ? `${parent.includedComponents}; ${label}`
            : label;
          foldedCount += 1;
        }
        return;
      }
      items.push({
        partNumber,
        description,
        supplier: String(it.supplier || ""),
        supplierNameAsWritten: String(it.supplierNameAsWritten || "").trim(),
        supplierMatched: it.supplierMatched === true,
        reference: String(it.reference || it.quotationRef || "").trim(),
        cost,
        currency: String(it.currency || "USD").toUpperCase(),
        leadTimeDays:
          typeof it.leadTimeDays === "number"
            ? it.leadTimeDays
            : Number(it.leadTimeDays) || 0,
        quotationDate: String(it.quotationDate || ""),
        type: it.type === "rental" ? "rental" : "acquisition",
        includedComponents: included || undefined,
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
    // The model may put it on a row that was folded or left out above.
    if (items.length > 0 && supplierAbout)
      items[0].supplierAbout = supplierAbout;
    const warnings = Array.isArray(raw.warnings)
      ? raw.warnings.map(String)
      : [];
    if (foldedCount > 0) {
      warnings.push(
        `${foldedCount} zero-priced row${foldedCount > 1 ? "s were" : " was"} merged into the item above as included components.`,
      );
    }
    if (notQuoted.length > 0) {
      warnings.push(
        `Not quoted by the supplier (left out): ${notQuoted.join("; ")}`,
      );
    }
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

  /** Flatten every sheet of an Excel workbook into CSV text. */
  private static async spreadsheetToText(file: File): Promise<string> {
    const XLSX = await import("xlsx");
    const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
    return wb.SheetNames.map((name) => {
      const csv = XLSX.utils
        .sheet_to_csv(wb.Sheets[name], { blankrows: false, strip: true })
        .trim();
      return csv ? `Sheet: ${name}\n${csv}` : "";
    })
      .filter(Boolean)
      .join("\n\n");
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
    // The backend cannot parse Excel workbooks, so they are sent as text.
    if (/\.xlsx?$/i.test(file.name)) {
      request.documentText = await AIAnalysisService.spreadsheetToText(file);
    }
    const data = await AIAnalysisService.postJson(
      AI_CONFIG.endpoints.extractQuotation,
      request,
      abortSignal,
    );
    return AIAnalysisService.validateQuotationResult(data, file.name);
  }

  /**
   * Validate and normalize the document metadata extraction response.
   */
  private static validateDocumentMetadataResult(
    data: unknown,
    fileName: string,
  ): IDocumentMetadataExtractionResult {
    const raw = data as Record<string, unknown>;
    if (raw.error) {
      const errMsg = raw.details
        ? `${raw.error}: ${raw.details}`
        : String(raw.error);
      throw new Error(errMsg);
    }
    const rawItems = raw.items;
    const list = Array.isArray(rawItems) ? rawItems : [];
    const items: IExtractedDocumentMetadata[] = [];
    list.forEach((entry: Record<string, unknown>) => {
      const it = entry || {};
      items.push({
        title: String(it.title || ""),
        docType: String(it.docType || ""),
        groupName: String(it.groupName || "Other"),
        subGroupName: String(it.subGroupName || "Other"),
        suggestedNewGroupName: it.suggestedNewGroupName
          ? String(it.suggestedNewGroupName)
          : undefined,
        suggestedNewSubGroupName: it.suggestedNewSubGroupName
          ? String(it.suggestedNewSubGroupName)
          : undefined,
        manufacturer: String(it.manufacturer || ""),
        model: String(it.model || ""),
        keywords: String(it.keywords || ""),
        description: String(it.description || ""),
        revision: String(it.revision || ""),
      });
    });
    const warnings = Array.isArray(raw.warnings)
      ? raw.warnings.map(String)
      : [];
    if (items.length === 0) {
      warnings.push(
        "No metadata could be extracted. Try a clearer file or fill the fields manually.",
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
   * Extract catalog metadata (title, type, group/sub-group, manufacturer, model,
   * keywords, description, revision) from a datasheet/manual/catalog/proposal
   * document. Reuses the `/quotation/extract` endpoint — a generic file → items[]
   * passthrough — with a dedicated prompt, so no backend change is required.
   *
   * @param file - Document file (PDF/Word/image)
   * @param docTypeOptions - Allowed "docType" values for the current catalog
   * @param groupOptions - Configured Group/SubGroup taxonomy (system config favoriteGroups)
   * @param abortSignal - Optional AbortSignal for cancellation
   */
  public static async extractDocumentMetadata(
    file: File,
    docTypeOptions: string[] = [],
    groupOptions: IAIGroupOption[] = [],
    abortSignal?: AbortSignal,
  ): Promise<IDocumentMetadataExtractionResult> {
    AIAnalysisService.ensureConfigured();
    const request = await AIAnalysisService.buildRequest(
      file,
      "document-metadata",
      { docTypeOptions, groupOptions },
      {},
    );
    const data = await AIAnalysisService.postJson(
      AI_CONFIG.endpoints.extractQuotation,
      request,
      abortSignal,
    );
    return AIAnalysisService.validateDocumentMetadataResult(data, file.name);
  }

  /**
   * Suggest scope categories, tags and a summary for a completed BID from its
   * knowledge document. Reuses the `/quotation/extract` passthrough endpoint.
   *
   * @param documentText - Past Bid knowledge text (no pricing needed)
   * @param bidNumber - BID number, for traceability
   * @param scopeCategories - Allowed scope categories (System Config)
   * @param abortSignal - Optional AbortSignal for cancellation
   */
  public static async suggestPastBidProfile(
    documentText: string,
    bidNumber: string,
    scopeCategories: string[],
    abortSignal?: AbortSignal,
  ): Promise<IPastBidProfileSuggestion> {
    AIAnalysisService.ensureConfigured();
    const file = new File([documentText], `${bidNumber || "bid"}-profile.txt`, {
      type: "text/plain",
    });
    const request = await AIAnalysisService.buildRequest(
      file,
      "past-bid-profile",
      { scopeCategoryOptions: scopeCategories },
      { bidNumber },
    );
    const data = (await AIAnalysisService.postJson(
      AI_CONFIG.endpoints.extractQuotation,
      request,
      abortSignal,
    )) as Record<string, unknown>;
    if (data && data.error) {
      throw new Error(
        data.details ? `${data.error}: ${data.details}` : String(data.error),
      );
    }
    const items = data ? data.items : null;
    const it = ((Array.isArray(items) ? items[0] : null) || {}) as Record<
      string,
      unknown
    >;
    const allowed: Record<string, string> = {};
    scopeCategories.forEach((c) => (allowed[c.trim().toLowerCase()] = c));
    const asList = (raw: unknown): string[] =>
      Array.isArray(raw)
        ? raw.map((v) =>
            String(v || "")
              .replace(/\s+/g, " ")
              .trim(),
          )
        : [];
    const categories: string[] = [];
    asList(it.scopeCategories).forEach((c) => {
      const match = allowed[c.toLowerCase()];
      if (match && categories.indexOf(match) < 0) categories.push(match);
    });
    const tags: string[] = [];
    const seen: Record<string, boolean> = {};
    asList(it.tags).forEach((t) => {
      const key = t.toLowerCase();
      if (!t || t.length > 40 || seen[key]) return;
      seen[key] = true;
      tags.push(t);
    });
    return {
      scopeCategories: categories.slice(0, 3),
      tags: tags.slice(0, 15),
      summary: String(it.summary || "")
        .trim()
        .substring(0, 600),
    };
  }

  /**
   * Suggest a supplier description, keywords and service types from a dossier
   * of SmartBid data. Reuses the `/quotation/extract` passthrough endpoint.
   *
   * @param dossier - Text built by `buildSupplierProfileText`
   * @param supplierName - Used only to name the uploaded text file
   * @param serviceTypes - Active service type options; returned ids come from here
   * @param abortSignal - Optional AbortSignal for cancellation
   */
  public static async suggestSupplierProfile(
    dossier: string,
    supplierName: string,
    serviceTypes: IConfigOption[],
    abortSignal?: AbortSignal,
  ): Promise<ISupplierProfileSuggestion> {
    AIAnalysisService.ensureConfigured();
    const safeName =
      (supplierName || "supplier")
        .replace(/[^A-Za-z0-9]+/g, "-")
        .slice(0, 40) || "supplier";
    const file = new File([dossier], `${safeName}-profile.txt`, {
      type: "text/plain",
    });
    const request = await AIAnalysisService.buildRequest(
      file,
      "supplier-profile",
      {
        serviceTypeOptions: serviceTypes.map((t) => ({
          label: t.label,
          category: t.category || "",
        })),
      },
      {},
    );
    const data = (await AIAnalysisService.postJson(
      AI_CONFIG.endpoints.extractQuotation,
      request,
      abortSignal,
    )) as Record<string, unknown>;
    if (data && data.error) {
      throw new Error(
        data.details ? `${data.error}: ${data.details}` : String(data.error),
      );
    }
    const items = data ? data.items : null;
    const it = ((Array.isArray(items) ? items[0] : null) || {}) as Record<
      string,
      unknown
    >;
    const loose = (v: string): string =>
      v.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const typeIds: Record<string, string> = {};
    serviceTypes.forEach((t) => (typeIds[loose(t.label)] = t.id));
    const asList = (raw: unknown): string[] =>
      Array.isArray(raw)
        ? raw.map((v) =>
            String(v || "")
              .replace(/\s+/g, " ")
              .trim(),
          )
        : [];
    const serviceTypeIds: string[] = [];
    asList(it.serviceTypes).forEach((label) => {
      const id = typeIds[loose(label)];
      if (id && serviceTypeIds.indexOf(id) < 0) serviceTypeIds.push(id);
    });
    const keywords: string[] = [];
    const seen: Record<string, boolean> = {};
    asList(it.keywords).forEach((k) => {
      const keyword = k.replace(/,/g, " ").trim();
      const key = keyword.toLowerCase();
      if (!keyword || keyword.length > 40 || seen[key]) return;
      seen[key] = true;
      keywords.push(keyword);
    });
    const basis = String(it.basis || "") as SupplierProfileBasis;
    const description = String(it.description || "")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 400);
    return {
      description,
      keywords: keywords.slice(0, 15),
      serviceTypes: serviceTypeIds,
      basis:
        SUPPLIER_PROFILE_BASES.indexOf(basis) >= 0
          ? basis
          : description || keywords.length
            ? "mixed"
            : "none",
    };
  }

  /**
   * Suggest clarifications/qualifications for the current BID, grounded in the
   * ones raised in similar Past Bids (retrieved by the backend).
   *
   * @param requirementsText - Serialized current BID requirements / scope
   * @param context - Division / service line / resource types for retrieval
   * @param ids - Current BID number (kept out of its own precedents) and the
   *   clarifications/qualifications it already has (not to be repeated)
   * @param abortSignal - Optional AbortSignal for cancellation
   */
  public static async suggestClarifications(
    requirementsText: string,
    context: IAIAnalysisContext = {},
    ids: { bidNumber?: string; existingText?: string } = {},
    abortSignal?: AbortSignal,
  ): Promise<IAISuggestedClarification[]> {
    AIAnalysisService.ensureConfigured();
    const data = (await AIAnalysisService.postJson(
      AI_CONFIG.endpoints.suggestClarifications,
      {
        requirementsText,
        existingText: ids.existingText || "",
        bidNumber: ids.bidNumber || "",
        division: context.division || "",
        serviceLine: context.serviceLine || "",
        resourceTypes: context.resourceTypes || [],
        contextSummary: context.contextSummary || "",
        useCase: "clarification",
        systemPrompt: buildClarificationSuggestionPrompt(),
        promptVersion: CLARIFICATION_SUGGESTION_PROMPT_VERSION,
      },
      abortSignal,
    )) as Record<string, unknown>;
    if (data && data.error) {
      throw new Error(
        data.details ? `${data.error}: ${data.details}` : String(data.error),
      );
    }
    return AIAnalysisService.parseClarifications(
      data ? data.suggestedClarifications : [],
    );
  }

  /**
   * Suggest qualification tables for the current BID, grounded in the library
   * and Past Bids (retrieved by the backend) and in the current scope.
   * Same endpoint as clarifications: only the prompt and the row shape differ.
   *
   * @param ids.existingText - Qualification tables and clarifications already on the BID
   * @param ids.categories - Active Qualification Categories labels
   */
  public static async suggestQualifications(
    requirementsText: string,
    context: IAIAnalysisContext = {},
    ids: {
      bidNumber?: string;
      existingText?: string;
      categories?: string[];
    } = {},
    abortSignal?: AbortSignal,
  ): Promise<IAISuggestedQualification[]> {
    AIAnalysisService.ensureConfigured();
    const data = (await AIAnalysisService.postJson(
      AI_CONFIG.endpoints.suggestClarifications,
      {
        requirementsText,
        existingText: ids.existingText || "",
        bidNumber: ids.bidNumber || "",
        division: context.division || "",
        serviceLine: context.serviceLine || "",
        resourceTypes: context.resourceTypes || [],
        contextSummary: context.contextSummary || "",
        useCase: "qualification",
        systemPrompt: buildQualificationSuggestionPrompt(ids.categories || []),
        promptVersion: QUALIFICATION_SUGGESTION_PROMPT_VERSION,
      },
      abortSignal,
    )) as Record<string, unknown>;
    if (data && data.error) {
      throw new Error(
        data.details ? `${data.error}: ${data.details}` : String(data.error),
      );
    }
    return AIAnalysisService.parseQualifications(
      data ? data.suggestedClarifications : [],
    );
  }

  private static parseQualifications(
    raw: unknown,
  ): IAISuggestedQualification[] {
    if (!Array.isArray(raw)) return [];
    const out: IAISuggestedQualification[] = [];
    raw.forEach((entry: Record<string, unknown>) => {
      const q = entry || {};
      const text = String(q.qualification || q.clarification || "").trim();
      if (!text) return;
      out.push({
        tableTitle: String(q.tableTitle || "").trim() || "Qualifications",
        category: String(q.category || q.description || "").trim(),
        qualification: text,
        rationale: q.rationale ? String(q.rationale) : undefined,
        confidence: typeof q.confidence === "number" ? q.confidence : undefined,
      });
    });
    return out;
  }
}
