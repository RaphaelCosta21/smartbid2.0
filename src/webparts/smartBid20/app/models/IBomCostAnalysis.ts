/**
 * IBomCostAnalysis — Interfaces for the BOM Cost Analysis feature.
 * Each analysis represents a full Bill of Materials import with hierarchical
 * structure, cost lookups, contingency calculations, and persistence.
 */

/** Source tab where the cost was found */
export type BomCostSource =
  | "BUMBL"
  | "BUMBR"
  | "Financials"
  | "manual"
  | "QUOTATION"
  | "";

/** "on" / "off" force the import tax on a row; unset follows the source rule */
export type BomImportTaxMode = "on" | "off";

/** Workshop assembly & test of the main item (per unit of the Level 1 item) */
export interface IBomWorkshop {
  /** Workshop hours to assemble and test one unit */
  hours: number;
  /** Workshop cost per unit, in `currency` */
  cost: number;
  currency: "BRL" | "USD";
  /** `cost` converted to USD with the system rate */
  costUSD: number;
  /** BRL per 1 USD used for the conversion (BRL only) */
  rateUsed?: number;
  /** Job function used for the hours line in the BID (System Config) */
  jobFunction?: string;
  /** Hours phase used for the hours line in the BID (System Config) */
  phase?: string;
  notes?: string;
}

/** A single line item in the BOM hierarchy */
export interface IBomCostItem {
  /** Unique identifier */
  id: string;
  /** Hierarchy level (1 = top, 2 = child of 1, etc.) */
  level: number;
  /** ID of parent item (null for root level) */
  parentId: string | null;
  /** Find Number / sequence within parent */
  findNumber: string;
  /** Part Number (from "Name" column in BOM export) */
  partNumber: string;
  /** Part description */
  description: string;
  /** Revision letter */
  revision: string;
  /** Quantity from BOM */
  qty: number;
  /** Cost per item in USD (after conversion) */
  costPerItemUSD: number;
  /** Contingency percentage applied (0-100+) */
  contingencyPercent: number;
  /** Import tax percentage applied to this row (snapshot of the analysis rate, 0 when not taxed) */
  importTaxPercent?: number;
  /** Per-row override of the import tax rule; unset = automatic (Global BUs only) */
  importTaxMode?: BomImportTaxMode;
  /** Calculated: qty × costPerItemUSD × (1 + contingency%) × (1 + importTax%) */
  totalCostInclCont: number;
  /** Lead time in days */
  leadTimeDays: number;
  /** Cost reference: "BUMBL", "BUMBR", or businessUnit from Financials */
  costReference: string;
  /** Date reference (PO Date or Last Order Date) ISO string */
  dateReference: string;
  /** User comments */
  comments: string;
  /** Which Query tab the cost was found in */
  sourceTab: BomCostSource;
  /** Original currency code before conversion */
  originalCurrency: string;
  /** Original cost amount before conversion */
  originalCost: number;
  /** Whether the user manually entered the cost */
  isManual: boolean;
  /** Whether the cost was rolled up (summed) from children */
  isRolledUp: boolean;
  /** Quotation item ID reference (when source is QUOTATION) */
  quotationItemId?: string;
}

/** A complete BOM Cost Analysis (saved entity) */
export interface IBomCostAnalysis {
  /** Unique identifier */
  id: string;
  /** Top-level part number (Level 1 item) */
  mainPartNumber: string;
  /** Top-level description */
  mainDescription: string;
  /** Drawing revision */
  revision: string;
  /** Date the analysis was created */
  analysisDate: string;
  /** User who created the analysis */
  createdBy: string;
  /** Last modification timestamp */
  lastModified: string;
  /** Whether all items have costs assigned */
  isComplete: boolean;
  /** Maximum lead time across all items (days) */
  maxLeadTimeDays: number;
  /** Exchange rates used during conversion { "BRL": 5.65, "GBP": 0.79, ... } */
  currencyRatesUsed: Record<string, number>;
  /** Default contingency % per year to apply */
  globalContingencyPerYear: number;
  /** Import tax % (0-100) applied to items priced in Global BUs (Financials) */
  importTaxPercent?: number;
  /** Workshop assembly & test of the main item */
  workshop?: IBomWorkshop;
  /** All BOM line items (flat list, hierarchy via level + parentId) */
  items: IBomCostItem[];
  /** Total cost: materials (incl. contingency) + import tax + workshop */
  totalCostUSD: number;
}

/** Tag on BID rows created from a BOM workshop, so a re-import replaces them */
export interface IBomWorkshopRef {
  bomAnalysisId: string;
  scopeItemId: string;
  partNumber: string;
}
