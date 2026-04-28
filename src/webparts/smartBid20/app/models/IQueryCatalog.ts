/**
 * IQueryCatalog — Interfaces for the Queries.xlsx Excel catalog data.
 * Used by QueryCatalogService to parse and cache equipment/cost data from SharePoint.
 */

/** Active Registered - Brazil tab: PN + Description + Business Unit + Manufacturer */
export interface IActiveRegisteredItem {
  /** Part Number (column "Item") */
  item: string;
  /** Equipment description (column "Long Descr") */
  longDescr: string;
  /** Business unit code (column "Business Unit") */
  businessUnit?: string;
  /** Manufacturer ID (column 14 "Mfg ID") */
  mfgId?: string;
  /** Manufacturer Item ID (column 15 "Mfg Itm ID") */
  mfgItmId?: string;
}

/** Peoplesoft Financials tab: full pricing data */
export interface IPeopleSoftFinancialsItem {
  /** Business unit code (column 1) */
  businessUnit: string;
  /** Part Number (column "PN") */
  pn: string;
  /** Item description (column "Descripton") */
  description: string;
  /** Last order date ISO string (column "Last Order Date") */
  lastOrderDate: string;
  /** Price in original currency (column "Original Currency Price") */
  originalPrice: number;
  /** Currency code: GBP, NOK, USD, BRL, etc. (column "Currency") */
  currency: string;
  /** Lead time in days (column "Lead Time") */
  leadTimeDays: number;
  /** Price in BRL (column "BRL Currency") */
  brlPrice: number;
}

/** Peoplesoft Brazil - BUMBL / BUMBR tab: BOM cost items */
export interface IBomSheetItem {
  /** Business unit code (column 1 "Unit") */
  businessUnit: string;
  /** Part Number (column 2 "Item") */
  partNumber: string;
  /** Description (column 3 "Descript") */
  description: string;
  /** PO Date ISO string (column 26 "PO Date") → displayed as "Data Reference" */
  dataReference: string;
  /** Last Price Paid (column 28) → displayed as "Cost Per Item" */
  costPerItem: number;
  /** Derived: PO Due (col 27) minus PO Date (col 26) in days */
  leadTimeDays: number;
}

/** Unified search result from any data source */
export interface ISearchResultItem {
  /** Part Number */
  pn: string;
  /** Item description */
  description: string;
  /** Data source identifier */
  source: "AR" | "PS" | "FAV" | "BUMBL" | "BUMBR" | "FIN";
  /** Business unit (when known) */
  businessUnit?: string;
  /** Manufacturer ID (Active Registered only) */
  mfgId?: string;
  /** Manufacturer Item ID (Active Registered only) */
  mfgItmId?: string;
}

/** Multi-source search results grouped by origin */
export interface IMultiSourceResults {
  /** From Active Registered + PeopleSoft Financials */
  query: ISearchResultItem[];
  /** From Favorites equipment catalog */
  favorites: ISearchResultItem[];
  /** From BUMBL/BUMBR/Financials (PN + description only, no costs) */
  bomCosts: ISearchResultItem[];
}

/** Raw tab data — headers + rows as key-value objects for full-column display */
export interface IRawTabData {
  /** Column header names extracted from Excel row 1 */
  headers: string[];
  /** All data rows as objects keyed by header name */
  rows: Record<string, any>[];
}

/** Container for all parsed catalog data */
export interface IQueryCatalogData {
  /** Active Registered - Brazil tab items */
  activeRegistered: IActiveRegisteredItem[];
  /** Peoplesoft Financials tab items */
  peopleSoftFinancials: IPeopleSoftFinancialsItem[];
  /** Peoplesoft Brazil - BUMBL tab items */
  bumbl: IBomSheetItem[];
  /** Peoplesoft Brazil - BUMBR tab items */
  bumbr: IBomSheetItem[];
  /** ISO timestamp when catalog was last parsed */
  lastLoaded: string;

  /** Raw Peoplesoft Financials tab (all columns) */
  rawFinancials: IRawTabData;
  /** Raw Peoplesoft Brazil - BUMBL tab (all columns) */
  rawBrazilBumbl: IRawTabData;
  /** Raw Peoplesoft Brazil - BUMBR tab (all columns) */
  rawBrazilBumbr: IRawTabData;
  /** Raw Active Registered - Brazil tab (all columns) */
  rawActiveRegistered: IRawTabData;
  /** Raw Currency tab */
  rawCurrency: IRawTabData;
}

/** BOM cost search result with cascade source */
export interface IBomCostResult {
  partNumber: string;
  description: string;
  businessUnit: string;
  costPerItem: number;
  currency: string;
  costPerItemUSD: number;
  dataReference: string;
  leadTimeDays: number;
  sourceTab: "BUMBL" | "BUMBR" | "Financials";
  found: boolean;
}
