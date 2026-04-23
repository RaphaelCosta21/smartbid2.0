/**
 * IAIAnalysis — Types for the AI document analysis feature.
 * Used by AIAnalysisService and AIDocumentAnalyzer component.
 */
import { IScopeItem } from "./IBid";

/** Request payload sent to the Power Automate flow */
export interface IAIAnalysisRequest {
  /** Base64-encoded file content */
  fileContent: string;
  /** Original file name (e.g. "client-scope.pdf") */
  fileName: string;
  /** BID division context */
  division: string;
  /** BID service line context */
  serviceLine: string;
  /** Valid resource types from system config */
  resourceTypes: string[];
  /** Optional additional context (KB summaries, past bid info) */
  contextSummary: string;
}

/** Response from the Power Automate flow */
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
}

/** Error response from the Power Automate flow */
export interface IAIAnalysisError {
  error: string;
  details?: string;
}
