/**
 * IAIAnalysis — Types for the AI document analysis feature.
 * Used by AIAnalysisService and the AIDocumentAnalyzer component.
 * The request is sent to the secure Azure gateway (APIM → Function App).
 */
import { IScopeItem } from "./IBid";

/** Which AI use case a request targets. */
export type AIUseCase =
  | "scope-of-supply"
  | "quotation"
  | "chat"
  | "clarification";

/** BID/template context passed from the UI into an analysis request. */
export interface IAIAnalysisContext {
  /** BID division (e.g. "SSR-ROV") — guides categorization. */
  division?: string;
  /** BID service line (e.g. "ROV"). */
  serviceLine?: string;
  /** Active resource-type labels from system config (guides mapping). */
  resourceTypes?: string[];
  /** Optional extra context (KB summaries, past-bid hints). */
  contextSummary?: string;
}

/** Request payload POSTed to the Azure AI backend. */
export interface IAIAnalysisRequest {
  /** Original file name (e.g. "client-scope.pdf"). */
  fileName: string;
  /** Base64-encoded file content (backend extracts text + runs RAG). */
  fileContent: string;
  /** Optional pre-extracted plain text (used instead of fileContent when set). */
  documentText?: string;
  /** BID division context. */
  division: string;
  /** BID service line context. */
  serviceLine: string;
  /** Valid resource types from system config. */
  resourceTypes: string[];
  /** Optional additional context (KB summaries, past bid info). */
  contextSummary: string;
  /** BID number for traceability/logging (when analyzing for a BID). */
  bidNumber?: string;
  /** Template id for traceability/logging (when analyzing for a template). */
  templateId?: string;
  /** Which use case this request is for. */
  useCase: AIUseCase;
  /** System prompt (sent when AI_CONFIG.sendPromptFromClient is true). */
  systemPrompt?: string;
  /** Version tag of the prompt above (for traceability). */
  promptVersion?: string;
}

/** Response from the Azure AI backend. */
export interface IAIAnalysisResult {
  /** Structured scope items extracted by AI */
  scopeItems: IScopeItem[];
  /** Warnings from the analysis (truncation, low confidence, etc.) */
  warnings: string[];
  /** Number of text chunks processed (>1 for large documents) */
  chunksProcessed: number;
  /** Whether the analysis covered the full document */
  isComplete: boolean;
  /** Original file name that was analyzed */
  sourceDocument: string;
  /** ISO timestamp of when the analysis was performed */
  analyzedAt: string;
  /** Clarifications/qualifications the AI suggests from retrieved past ones. */
  suggestedClarifications?: IAISuggestedClarification[];
  /** Version of the client prompt used (set only when sent from the client). */
  promptVersion?: string;
}

/** Error response from the Azure AI backend. */
export interface IAIAnalysisError {
  error: string;
  details?: string;
}

/**
 * Metadata describing an AI-assisted scope import, captured at import time so
 * the BID activity log records what the AI produced and how the user changed
 * it before accepting.
 */
export interface IAIImportMeta {
  /** Name of the analyzed source document. */
  sourceDocument: string;
  /** Version of the client prompt used, when available. */
  promptVersion?: string;
  /** Number of non-section items the AI originally produced. */
  aiItemCount: number;
  /** Number of non-section items actually imported (after user edits). */
  finalItemCount: number;
  /** Items the user edited before importing. */
  editedCount: number;
  /** Items the user added during review. */
  addedCount: number;
  /** AI items the user removed before importing. */
  removedCount: number;
  /** Warnings surfaced by the analysis. */
  warnings: string[];
  /** Clarifications/qualifications the AI suggested alongside the scope. */
  suggestedClarifications?: IAISuggestedClarification[];
}

/** A clarification/qualification the AI proposes from retrieved past ones. */
export interface IAISuggestedClarification {
  /** Whether this is a Clarification (question) or a Qualification (exception). */
  baseType: "Clarification" | "Qualification";
  /** Short topic / description. */
  description: string;
  /** The clarification/qualification text to send to the client. */
  clarification: string;
  /** Why the AI suggests it (e.g. matched an accepted past clarification). */
  rationale?: string;
  /** Client doc reference or scope description this relates to (for linking). */
  relatedRef?: string;
  /** Backend confidence 0..1, when provided. */
  confidence?: number;
}

/** One supplier line item extracted from a quotation document. */
export interface IExtractedQuotationLine {
  /** OII / manufacturer part number. */
  partNumber: string;
  /** Item description. */
  description: string;
  /** Supplier / vendor name. */
  supplier: string;
  /** Unit cost or day rate in the original currency. */
  cost: number;
  /** ISO currency code (USD, BRL, EUR, …). */
  currency: string;
  /** Lead time in days (0 when unspecified). */
  leadTimeDays: number;
  /** Quotation date as ISO string, or "" when unspecified. */
  quotationDate: string;
  /** "acquisition" (buy) or "rental" (day rate). */
  type: "acquisition" | "rental";
  /** Free-form notes. */
  notes: string;
  /** AI-suggested group NAME (mapped to a config id in the UI). */
  suggestedGroupName?: string;
  /** AI-suggested sub-group NAME (mapped to a config id in the UI). */
  suggestedSubGroupName?: string;
  /** Backend confidence 0..1, when provided. */
  confidence?: number;
}

/** Result of extracting quotation line items from a supplier document. */
export interface IQuotationExtractionResult {
  /** Extracted line items (may be more than one per document). */
  items: IExtractedQuotationLine[];
  /** Warnings from the extraction (low confidence, unreadable, …). */
  warnings: string[];
  /** Original file name that was analyzed. */
  sourceDocument: string;
  /** ISO timestamp of when the extraction was performed. */
  extractedAt: string;
}
