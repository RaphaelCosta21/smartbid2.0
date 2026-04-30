/**
 * IQuotationItem — Interface for quotation catalog items.
 * Each item represents a single line in a vendor quotation.
 * Multiple items may share the same fileUrl when from the same quotation document.
 */

/** Type of quotation: rental (day rate) or acquisition (purchase) */
export type QuotationType = "rental" | "acquisition";

/** A single quotation line item stored in the catalog */
export interface IQuotationItem {
  id: string;
  /** Group ID from config.favoriteGroups */
  groupId: string;
  /** SubGroup ID from config.favoriteGroups */
  subGroupId: string;
  /** OII / MFG Part Number */
  partNumber: string;
  /** Item description */
  description: string;
  /** Quantity — fixed at 1 */
  quantity: number;
  /** Supplier / vendor name */
  supplier: string;
  /** Lead time in days */
  leadTimeDays: number;
  /** Date the quotation was received (ISO string) */
  quotationDate: string;
  /** Whether this is a rental (day rate) or acquisition (purchase) */
  type: QuotationType;
  /** Unit cost (acquisition) or day rate (rental) in original currency */
  cost: number;
  /** Original currency code (e.g., "BRL", "USD", "EUR") */
  currency: string;
  /** Cost converted to USD at time of save */
  costUSD: number;
  /** Exchange rate snapshot used for conversion */
  exchangeRateUsed: number;
  /** Free-form notes */
  notes: string;
  /** Whether this item has been added to Favorites */
  isFavorite: boolean;
  /** Server-relative URL of the uploaded quotation file (optional) */
  fileUrl?: string;
  /** Original filename of the uploaded quotation file */
  fileName?: string;
  /** User who created this entry */
  createdBy: string;
  /** ISO date of creation */
  createdDate: string;
  /** ISO date of last modification */
  lastModified: string;
}
