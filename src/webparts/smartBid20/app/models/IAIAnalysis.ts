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
  | "document-metadata"
  | "chat"
  | "clarification";

/** A resource type with its configured sub-type values, for AI mapping. */
export interface IAIResourceTypeOption {
  /** Parent resource-type label (matches the grid's resourceType option). */
  label: string;
  /** Active sub-type values under this parent (match the grid's subType options). */
  subTypes: string[];
}

/** A configured Favorites group with its sub-group names, for AI mapping. */
export interface IAIGroupOption {
  /** Group name exactly as configured in System Configuration. */
  name: string;
  /** Sub-group names configured under this group. */
  subGroups: string[];
}

/**
 * An Assets Catalog record, sent so the model can fill equipmentOffer/partNumber
 * from real Oceaneering equipment. The SharePoint list is not in the AI Search
 * index, so the catalog travels with the request instead of via RAG.
 */
export interface IAIAssetCatalogOption {
  /** Equipment name (Assets Catalog "Title"). */
  name: string;
  /** Oceaneering part number — copied verbatim into partNumber. */
  partNumber: string;
  /** Keywords and commonly used names, to help the model match client wording. */
  keywords: string;
  /** Short description/specs, trimmed to keep the prompt small. */
  description: string;
  /** Consumables/spares/accessories registered under this equipment. */
  subItems?: IAIAssetSubItemOption[];
}

/** A consumable/spare/accessory registered under a catalog equipment. */
export interface IAIAssetSubItemOption {
  name: string;
  partNumber: string;
}

/** BID/template context passed from the UI into an analysis request. */
export interface IAIAnalysisContext {
  /** BID division (e.g. "SSR-ROV") — guides categorization. */
  division?: string;
  /** BID service line (e.g. "ROV"). */
  serviceLine?: string;
  /** Active resource-type labels from system config (guides mapping). */
  resourceTypes?: string[];
  /** Active resource types WITH sub-types (guides resourceType + resourceSubType). */
  resourceTypeOptions?: IAIResourceTypeOption[];
  /** Configured Group/SubGroup taxonomy (guides quotation categorization). */
  groupOptions?: IAIGroupOption[];
  /** Assets Catalog records (guides equipmentOffer + partNumber). */
  assetCatalogOptions?: IAIAssetCatalogOption[];
  /** Allowed "docType" values for the current document catalog. */
  docTypeOptions?: string[];
  /** Pins document classification to a single group (e.g. "Operation KIT"). */
  lockedGroupName?: string;
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
  /** Supplier's quotation number/reference (same for every line of a document). */
  reference?: string;
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
  /** Accessories/spares bundled in this position ("partNumber - description", "; " separated). */
  includedComponents?: string;
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

/** Catalog metadata fields extracted from a datasheet/manual/catalog/proposal file. */
export interface IExtractedDocumentMetadata {
  /** Document title (short, human-readable). */
  title: string;
  /** Document type — must match one of the catalog's configured doc types, or "". */
  docType: string;
  /** Matched Group name from the configured Group/SubGroup taxonomy, or "Other". */
  groupName: string;
  /** Matched Sub-Group name under groupName, or "Other". */
  subGroupName: string;
  /** Set only when no existing group fits well — a new Group name the AI proposes instead of "Other". */
  suggestedNewGroupName?: string;
  /** Set alongside suggestedNewGroupName — the proposed new Sub-Group name. */
  suggestedNewSubGroupName?: string;
  /** Manufacturer / brand (or client name, for proposals). */
  manufacturer: string;
  /** Model / equipment (or proposal/BID number, for proposals). */
  model: string;
  /** Comma-separated search keywords. */
  keywords: string;
  /** Short 1-2 sentence summary. */
  description: string;
  /** Revision or document date, as written in the file. */
  revision: string;
}

/** Result of extracting catalog metadata from a document. */
export interface IDocumentMetadataExtractionResult {
  /** Extracted metadata (one entry per document sent). */
  items: IExtractedDocumentMetadata[];
  /** Warnings from the extraction (low confidence, unreadable, …). */
  warnings: string[];
  /** Original file name that was analyzed. */
  sourceDocument: string;
  /** ISO timestamp of when the extraction was performed. */
  extractedAt: string;
}
