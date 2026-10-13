/**
 * IQuotationLink — ties a BID cost entry (asset row, sub-item or PCF entry) to a supplier
 * quotation. Lives inside the BID JSON, so unlinking never touches the quotation catalog.
 */

/** requested = sent to the supplier, no price yet; received = priced answer; declined = supplier won't quote */
export type QuotationLinkStatus = "requested" | "received" | "declined";

export interface IQuotationLink {
  id: string;
  /** FK to IQuotationItem.id — null while the supplier hasn't answered yet */
  quotationId: string | null;
  /** Supplier name; kept here because a pending request has no catalog entry */
  supplier: string;
  status: QuotationLinkStatus;
  /** ISO date the request was sent to the supplier */
  requestedDate?: string;
  /** ISO date the answer is expected by (drives the overdue flag) */
  dueDate?: string;
  /** ISO date the supplier answered */
  responseDate?: string;
  notes?: string;
  /** True for the quotation whose price currently drives the item's cost */
  isSelected: boolean;
  createdBy?: string;
  createdDate?: string;
}
