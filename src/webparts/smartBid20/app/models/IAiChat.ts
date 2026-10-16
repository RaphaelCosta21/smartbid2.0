/**
 * IAiChat — Types for the floating knowledge chat assistant.
 * Conversations are in-memory only and are never persisted to SharePoint.
 */

export type ChatRole = "user" | "assistant";

/** A document excerpt an answer was grounded on. */
export interface IChatCitation {
  /** File name as indexed by AI Search. */
  title: string;
  /** SharePoint URL of the source document. */
  url: string;
  /** Datasheet, Manual, Catalog or Technical Proposal. */
  docType?: string;
  /** Client the document was issued to. */
  client?: string;
  /** Proposal / BID number. */
  reference?: string;
  /** Revision tag. */
  revision?: string;
  /** Free-form detail when the structured fields are absent. */
  detail?: string;
}

/** One excerpt the backend retrieved, cited or not. Diagnostic only. */
export interface IChatRetrievedDoc {
  title: string;
  url: string;
  snippet: string;
  /** Heading breadcrumb of the chunk, e.g. "2 Scope > 2.2 ROV Systems". */
  section?: string;
}

/** One message rendered in the chat panel. */
export interface IChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  citations?: IChatCitation[];
  /** Every excerpt the search returned for this turn, for the debug panel. */
  retrieved?: IChatRetrievedDoc[];
  /** True when the assistant declined an off-topic question. */
  refused?: boolean;
  /** Suggested next questions offered by the assistant. */
  followUps?: string[];
  createdAt: string;
}

/** Parsed answer returned by the backend for a single question. */
export interface IChatAnswer {
  answer: string;
  refused: boolean;
  citations: IChatCitation[];
  followUps: string[];
  retrieved: IChatRetrievedDoc[];
}

/** Completed BIDs SmartBid matched to a chat question (exact, from its own data). */
export interface IPastBidChatContext {
  /** Plain-text table of the matching completed BIDs, with totals. */
  ledger: string;
  /** Most recent matching BIDs whose Past Bid documents the backend reads in depth. */
  refs: string[];
}
