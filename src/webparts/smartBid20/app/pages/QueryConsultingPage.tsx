/**
 * QueryConsultingPage — Full query consultation tool.
 * A general search (PN or description) covers every view; two source tabs
 * (Peoplesoft Financials / Peoplesoft Brazil) each hold two views
 * (Price Consulting / Active Registered with Manuf.) with their own column filters,
 * Business Unit filters, sortable columns, photo column, and pagination.
 * Financials › Active Registered with Manuf. comes from the CSV export;
 * every other tab comes from Queries.xlsx.
 *
 * Reuses useQueryCatalogStore — data is loaded once and cached in memory.
 * If BOM Costs or Favorites already triggered loadCatalog(), data is instant.
 */
import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { PhotoLightbox } from "../components/common/PhotoLightbox";
import { useQueryCatalogStore } from "../stores/useQueryCatalogStore";
import { useConfigStore } from "../stores/useConfigStore";
import { useDebounce } from "../hooks/useDebounce";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { convertToUSD } from "../utils/costCalculations";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from "../utils/formatters";
import { IExchangeRate } from "../models";
import styles from "./QueryConsultingPage.module.scss";

// ── Types ──────────────────────────────────────────────────────────────────────
type TabKey = "financials" | "brazil";
type SubTabKey = "priceConsulting" | "activeRegistered";

interface IBusinessUnitFilter {
  name: string;
  selected: boolean;
}

interface ISearchFilter {
  id: string;
  column: string;
  value: string;
}

interface ITabData {
  headers: string[];
  rows: Record<string, any>[];
  /** Column filters: one for Price Consulting, up to 3 for Active Registered */
  searchFilters: ISearchFilter[];
  sortColumn: string;
  sortDescending: boolean;
}

interface ISubTabData {
  priceConsulting: ITabData;
  activeRegistered: ITabData;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Build empty tab data shell */
function emptyTabData(): ITabData {
  return {
    headers: [],
    rows: [],
    searchFilters: [],
    sortColumn: "",
    sortDescending: false,
  };
}

/** Month names for date formatting */
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Convert Excel serial date number to DD/Month/YYYY string */
function convertExcelDate(cell: any): string {
  if (cell === null || cell === undefined || cell === "") return "";
  let d: Date | undefined;
  // Already a Date object
  if (cell instanceof Date) {
    d = cell;
  } else if (typeof cell === "number") {
    // Excel serial
    d = new Date((cell - 25569) * 86400 * 1000);
  } else {
    const str = String(cell).trim();
    if (!str) return "";
    const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
    const n = parseFloat(str);
    if (ymd) {
      // Date-only "YYYY-MM-DD" (CSV export) — local time avoids a UTC day shift
      d = new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
    } else if (!isNaN(n) && n > 10000 && n < 100000) {
      // Excel serial number stored as text
      d = new Date((n - 25569) * 86400 * 1000);
    } else {
      // Try parsing as date string (e.g. "Sun Nov 22 2020 00:00:28 GMT-0300...")
      const parsed = new Date(str);
      if (!isNaN(parsed.getTime())) {
        d = parsed;
      } else {
        return str;
      }
    }
  }
  if (!d || isNaN(d.getTime())) return String(cell);
  const day = String(d.getDate()).padStart(2, "0");
  const month = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  return day + "/" + month + "/" + year;
}

/** Format a value as USD, optionally converting from another currency */
function formatAsUSD(
  cell: any,
  exchangeRates: IExchangeRate[],
  fromCurrency?: string,
): string {
  const n = parseFloat(cell);
  if (isNaN(n) || n === 0) return String(cell ?? "");
  const cur = fromCurrency ? fromCurrency.toUpperCase().trim() : "USD";
  const usd = convertToUSD(n, cur, exchangeRates);
  return formatCurrency(usd, "USD");
}

/** Calculate lead time in days between two Excel date values */
function calcLeadTimeDays(poDateCell: any, poDueCell: any): string {
  const toMs = (v: any): number => {
    if (!v) return 0;
    if (v instanceof Date) return v.getTime();
    const n = typeof v === "number" ? v : parseFloat(v);
    if (!isNaN(n) && n > 10000) return (n - 25569) * 86400000; // Excel serial
    const d = new Date(v);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };
  const startMs = toMs(poDateCell);
  const endMs = toMs(poDueCell);
  if (!startMs || !endMs) return "";
  const days = Math.max(0, Math.round((endMs - startMs) / 86400000));
  return days > 0 ? String(days) + " days" : "0";
}

/** Build photo URL for a part number */
function getPhotoUrl(pn: string): string {
  if (!pn) return "";
  return `${SHAREPOINT_CONFIG.siteUrl}${SHAREPOINT_CONFIG.photosBaseUrl}/${encodeURIComponent(pn.trim())}.jpg`;
}

/** Extract unique business unit values from rows by column name */
function extractBUs(
  rows: Record<string, any>[],
  colName: string,
): IBusinessUnitFilter[] {
  const set = new Set<string>();
  rows.forEach((row) => {
    const v = String(row[colName] || "").trim();
    if (v) set.add(v);
  });
  const arr: IBusinessUnitFilter[] = [];
  const sorted = Array.from(set).sort();
  sorted.forEach((name) => arr.push({ name, selected: true }));
  return arr;
}

/** Split a search string into lower-case tokens */
function toTokens(searchText: string): string[] {
  return searchText
    .toLowerCase()
    .split(" ")
    .filter((t) => t.trim().length > 0);
}

/** Token-based filter: every token must appear in cell */
function matchTokens(cell: string, tokens: string[]): boolean {
  const lower = cell.toLowerCase();
  for (let i = 0; i < tokens.length; i++) {
    if (lower.indexOf(tokens[i]) < 0) return false;
  }
  return true;
}

/**
 * Rows of one view that pass its BU filter, its column filters (AND) and the
 * general search, which matches part number (col 1) or description (col 2).
 */
function filterViewRows(
  tab: ITabData,
  buFilters: IBusinessUnitFilter[],
  searchTokens: string[],
): Record<string, any>[] {
  const buCol = tab.headers[0] || "";
  const pnCol = tab.headers[1] || "";
  const descCol = tab.headers[2] || "";
  const selectedBUs = new Set<string>();
  let allBUs = true;
  buFilters.forEach((f) => {
    if (f.selected) selectedBUs.add(f.name);
    else allBUs = false;
  });
  if (buFilters.length > 0 && selectedBUs.size === 0) return [];

  const columnFilters = tab.searchFilters
    .filter((f) => f.column && f.value.trim() !== "")
    .map((f) => ({ column: f.column, tokens: toTokens(f.value) }));
  if (allBUs && columnFilters.length === 0 && searchTokens.length === 0)
    return tab.rows;

  const result: Record<string, any>[] = [];
  for (let i = 0; i < tab.rows.length; i++) {
    const row = tab.rows[i];
    if (!allBUs && !selectedBUs.has(String(row[buCol] || ""))) continue;
    if (
      searchTokens.length > 0 &&
      !matchTokens(`${row[pnCol] ?? ""} ${row[descCol] ?? ""}`, searchTokens)
    )
      continue;
    let allMatch = true;
    for (let j = 0; j < columnFilters.length; j++) {
      const cell = String(row[columnFilters[j].column] || "");
      if (!matchTokens(cell, columnFilters[j].tokens)) {
        allMatch = false;
        break;
      }
    }
    if (allMatch) result.push(row);
  }
  return result;
}

function sortRows(
  rows: Record<string, any>[],
  colName: string,
  desc: boolean,
): Record<string, any>[] {
  if (!colName) return rows;
  return rows.slice().sort((a, b) => {
    const va = a[colName];
    const vb = b[colName];
    if (va === vb) return 0;
    if (typeof va === "string" && typeof vb === "string") {
      return desc ? vb.localeCompare(va) : va.localeCompare(vb);
    }
    const cmp = va < vb ? -1 : 1;
    return desc ? -cmp : cmp;
  });
}

const PAGE_SIZE = 100;
const MIN_SEARCH_CHARS = 2;
const MAX_COLUMN_FILTERS = 3;

const SOURCES: [TabKey, string][] = [
  ["financials", "Peoplesoft Financials"],
  ["brazil", "Peoplesoft Brazil"],
];
const VIEWS: [SubTabKey, string][] = [
  ["priceConsulting", "Price Consulting"],
  ["activeRegistered", "Active Registered with Manuf."],
];

const SearchIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const CloseIcon = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const DatabaseIcon = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);
const CornerDownRightIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="15 10 20 15 15 20" />
    <path d="M4 4v7a4 4 0 004 4h12" />
  </svg>
);
const ChevronDownIcon = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export function QueryConsultingPage(): React.ReactElement {
  const loadCatalog = useQueryCatalogStore((s) => s.loadCatalog);
  const storeData = useQueryCatalogStore((s) => s.data);
  const storeLoading = useQueryCatalogStore((s) => s.isLoading);
  const storeError = useQueryCatalogStore((s) => s.error);
  const systemConfig = useConfigStore((s) => s.config);
  const exchangeRates: IExchangeRate[] =
    (systemConfig &&
      systemConfig.currencySettings &&
      systemConfig.currencySettings.exchangeRates) ||
    [];

  // ── Page state ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = React.useState<TabKey>("financials");
  const [activeSubTab, setActiveSubTab] =
    React.useState<SubTabKey>("priceConsulting");
  const [buFilterOpen, setBuFilterOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [previewPhotoUrl, setPreviewPhotoUrl] = React.useState<string | null>(
    null,
  );

  // General search: part number or description across every source and view
  const [generalSearch, setGeneralSearch] = React.useState("");
  const debouncedSearch = useDebounce(generalSearch, 250);
  const searchTokens = React.useMemo(
    () =>
      debouncedSearch.trim().length >= MIN_SEARCH_CHARS
        ? toTokens(debouncedSearch)
        : [],
    [debouncedSearch],
  );
  const searchActive = searchTokens.length > 0;
  const isSearching = generalSearch.trim() !== debouncedSearch.trim();
  React.useEffect(() => setPage(0), [searchTokens]);

  // Tab data state
  const [tabs, setTabs] = React.useState<Record<TabKey, ISubTabData>>({
    financials: {
      priceConsulting: emptyTabData(),
      activeRegistered: emptyTabData(),
    },
    brazil: {
      priceConsulting: emptyTabData(),
      activeRegistered: emptyTabData(),
    },
  });
  const [buFilters, setBuFilters] = React.useState<
    Record<TabKey, Record<SubTabKey, IBusinessUnitFilter[]>>
  >({
    financials: { priceConsulting: [], activeRegistered: [] },
    brazil: { priceConsulting: [], activeRegistered: [] },
  });

  // Column visibility: set of hidden column keys per tab/subtab
  const [hiddenCols, setHiddenCols] = React.useState<
    Record<string, Set<string>>
  >({});
  const [colMenuOpen, setColMenuOpen] = React.useState(false);
  React.useEffect(() => {
    if (!colMenuOpen) return;
    const onDown = (e: MouseEvent): void => {
      if (!(e.target as HTMLElement).closest("[data-qc-colmenu]"))
        setColMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [colMenuOpen]);
  // Column width overrides (px) per column key
  const [colWidths, setColWidths] = React.useState<Record<string, number>>({});
  // Resize drag ref
  const resizeRef = React.useRef<{
    colKey: string;
    startX: number;
    startW: number;
  } | null>(null);

  const hiddenKey = activeTab + "_" + activeSubTab;
  const currentHidden = hiddenCols[hiddenKey] || new Set<string>();

  const toggleColumnVisibility = (colKey: string): void => {
    setHiddenCols((prev) => {
      const key = hiddenKey;
      const oldSet = prev[key] || new Set<string>();
      const newSet = new Set<string>(oldSet);
      if (newSet.has(colKey)) {
        newSet.delete(colKey);
      } else {
        newSet.add(colKey);
      }
      const next: Record<string, Set<string>> = {};
      Object.keys(prev).forEach((k) => {
        next[k] = prev[k];
      });
      next[key] = newSet;
      return next;
    });
  };

  // Resize handlers
  const handleResizeStart = (colKey: string, e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    const th = (e.target as HTMLElement).parentElement;
    if (!th) return;
    const startW = th.offsetWidth;
    resizeRef.current = { colKey, startX: e.clientX, startW };

    const onMouseMove = (ev: MouseEvent): void => {
      if (!resizeRef.current) return;
      const diff = ev.clientX - resizeRef.current.startX;
      const newW = Math.max(40, resizeRef.current.startW + diff);
      setColWidths((prev) => ({ ...prev, [resizeRef.current!.colKey]: newW }));
    };
    const onMouseUp = (): void => {
      resizeRef.current = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // ── Load catalog on mount ──────────────────────────────────────────────────
  React.useEffect(() => {
    loadCatalog();
  }, []);

  // ── Build tab data when store data arrives ─────────────────────────────────
  const dataInitialized = React.useRef(false);
  React.useEffect(() => {
    if (!storeData || dataInitialized.current) return;
    dataInitialized.current = true;

    const rawFin = storeData.rawFinancials;
    const rawBumbl = storeData.rawBrazilBumbl;
    const rawBumbr = storeData.rawBrazilBumbr;
    const rawAR = storeData.rawActiveRegistered;
    const rawFinAR = storeData.rawFinancialsActiveRegistered;

    // Brazil Price Consulting = BUMBL + BUMBR rows that have "Last Price Paid"
    const brazilPCHeaders = rawBumbl.headers;
    const allBrazilRows = rawBumbl.rows.concat(rawBumbr.rows);
    const brazilPCRows = allBrazilRows.filter((row) => {
      const v = row["Last Price Paid"];
      return v !== undefined && v !== null && v !== "";
    });

    // Financials: all rows for Price Consulting
    const finPCRows = rawFin.rows;

    // Extract BU filters
    const finBUs = extractBUs(finPCRows, rawFin.headers[0]);
    const finArBUs = extractBUs(rawFinAR.rows, rawFinAR.headers[0]);
    const brazilBUs = extractBUs(allBrazilRows, brazilPCHeaders[0]);
    const arBUs = extractBUs(rawAR.rows, rawAR.headers[0]);

    const newTabs: Record<TabKey, ISubTabData> = {
      financials: {
        priceConsulting: {
          headers: rawFin.headers,
          rows: finPCRows,
          searchFilters: [
            {
              id: "filter_1",
              column: rawFin.headers[1] || "",
              value: "",
            },
          ],
          sortColumn: "",
          sortDescending: false,
        },
        activeRegistered: {
          headers: rawFinAR.headers,
          rows: rawFinAR.rows,
          searchFilters: [
            {
              id: "filter_1",
              column: rawFinAR.headers[0] || "",
              value: "",
            },
          ],
          sortColumn: "",
          sortDescending: false,
        },
      },
      brazil: {
        priceConsulting: {
          headers: brazilPCHeaders,
          rows: brazilPCRows,
          searchFilters: [
            {
              id: "filter_1",
              column: brazilPCHeaders[1] || "",
              value: "",
            },
          ],
          sortColumn: "",
          sortDescending: false,
        },
        activeRegistered: {
          headers: rawAR.headers,
          rows: rawAR.rows,
          searchFilters: [
            {
              id: "filter_1",
              column: rawAR.headers[0] || "",
              value: "",
            },
          ],
          sortColumn: "",
          sortDescending: false,
        },
      },
    };

    setTabs(newTabs);
    setBuFilters({
      financials: {
        priceConsulting: finBUs,
        activeRegistered: finArBUs,
      },
      brazil: {
        priceConsulting: brazilBUs,
        activeRegistered: arBUs,
      },
    });
  }, [storeData]);

  // ── Derived current tab data ───────────────────────────────────────────────
  const currentTab = tabs[activeTab][activeSubTab];
  const currentBuFilters = buFilters[activeTab][activeSubTab];
  const totalRows = currentTab.rows.length;
  const isMultiFilter = activeSubTab === "activeRegistered";

  const filteredRows = React.useMemo(
    () => filterViewRows(currentTab, currentBuFilters, searchTokens),
    [currentTab, currentBuFilters, searchTokens],
  );
  const sortedRows = React.useMemo(
    () =>
      sortRows(filteredRows, currentTab.sortColumn, currentTab.sortDescending),
    [filteredRows, currentTab.sortColumn, currentTab.sortDescending],
  );
  const filteredCount = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageRows = sortedRows.slice(
    safePage * PAGE_SIZE,
    (safePage + 1) * PAGE_SIZE,
  );

  // Hit counts per view for the source / view tabs; other views are cached until their inputs change
  const countCacheRef = React.useRef<
    Record<
      string,
      {
        tab: ITabData;
        bu: IBusinessUnitFilter[];
        tokens: string[];
        count: number;
      }
    >
  >({});
  const getViewCount = (t: TabKey, s: SubTabKey): number => {
    if (t === activeTab && s === activeSubTab) return filteredCount;
    const tab = tabs[t][s];
    const bu = buFilters[t][s];
    const key = t + "_" + s;
    const cached = countCacheRef.current[key];
    if (
      cached &&
      cached.tab === tab &&
      cached.bu === bu &&
      cached.tokens === searchTokens
    )
      return cached.count;
    const count = filterViewRows(tab, bu, searchTokens).length;
    countCacheRef.current[key] = { tab, bu, tokens: searchTokens, count };
    return count;
  };

  // ── Tab switching ──────────────────────────────────────────────────────────
  const handleTabChange = (tab: TabKey): void => {
    setActiveTab(tab);
    setActiveSubTab("priceConsulting");
    setBuFilterOpen(false);
    setPage(0);
  };

  const handleSubTabChange = (sub: SubTabKey): void => {
    setActiveSubTab(sub);
    setBuFilterOpen(false);
    setPage(0);
  };

  // ── Helper to update tabs state ────────────────────────────────────────────
  const updateCurrentTab = (patch: Partial<ITabData>): void => {
    setTabs((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [activeSubTab]: { ...prev[activeTab][activeSubTab], ...patch },
      },
    }));
    setPage(0);
  };

  // ── Column filter handlers (Add / Remove only on Active Registered) ───────
  const handleAddFilter = (): void => {
    if (currentTab.searchFilters.length >= MAX_COLUMN_FILTERS) return;
    const newFilter: ISearchFilter = {
      id: "filter_" + Date.now(),
      column: currentTab.headers[0] || "",
      value: "",
    };
    updateCurrentTab({
      searchFilters: currentTab.searchFilters.concat([newFilter]),
    });
  };

  const handleRemoveFilter = (filterId: string): void => {
    updateCurrentTab({
      searchFilters: currentTab.searchFilters.filter((f) => f.id !== filterId),
    });
  };

  const handleUpdateFilter = (
    filterId: string,
    column?: string,
    value?: string,
  ): void => {
    updateCurrentTab({
      searchFilters: currentTab.searchFilters.map((f) =>
        f.id === filterId
          ? {
              ...f,
              ...(column !== undefined && { column }),
              ...(value !== undefined && { value }),
            }
          : f,
      ),
    });
  };

  // ── BU filter handlers ─────────────────────────────────────────────────────
  const setCurrentBuFilters = (next: IBusinessUnitFilter[]): void => {
    setBuFilters((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [activeSubTab]: next },
    }));
    setPage(0);
  };

  const toggleBuFilter = (buName: string): void =>
    setCurrentBuFilters(
      currentBuFilters.map((f) =>
        f.name === buName ? { ...f, selected: !f.selected } : f,
      ),
    );

  const selectAllBuFilters = (): void =>
    setCurrentBuFilters(
      currentBuFilters.map((f) => ({ ...f, selected: true })),
    );

  const clearAllBuFilters = (): void =>
    setCurrentBuFilters(
      currentBuFilters.map((f) => ({ ...f, selected: false })),
    );

  // ── Sort handler ───────────────────────────────────────────────────────────
  const handleSort = (colName: string): void => {
    const isSame = colName === currentTab.sortColumn;
    updateCurrentTab({
      sortColumn: colName,
      sortDescending: isSame ? !currentTab.sortDescending : false,
    });
  };

  // ── Column definitions per tab/subtab ────────────────────────────────────────
  const getVisibleColumns = (): {
    key: string;
    header: string;
    width: string;
    render: (row: Record<string, any>) => React.ReactNode;
  }[] => {
    const hdrs = currentTab.headers;
    const cols: {
      key: string;
      header: string;
      width: string;
      render: (row: Record<string, any>) => React.ReactNode;
    }[] = [];

    const col = (idx: number): string => hdrs[idx] || "";

    if (activeTab === "financials" && activeSubTab === "activeRegistered") {
      // ── Financials — Active Registered with Manufacturer (CSV export) ──────
      // Col 0: BUSINESS UNIT, Col 1: PART NUMBER, Col 2: DESCRIPTION,
      // Col 3: MFG NAME, Col 4: MFG REF, Col 5: LAST ORDER DATE
      const defs: { idx: number; header: string; width: string }[] = [
        { idx: 0, header: "BUSINESS UNIT", width: "10%" },
        { idx: 1, header: "PART NUMBER", width: "14%" },
        { idx: 2, header: "DESCRIPTION", width: "34%" },
        { idx: 3, header: "MFG NAME", width: "14%" },
        { idx: 4, header: "MFG REF", width: "14%" },
        { idx: 5, header: "LAST ORDER DATE", width: "14%" },
      ];
      defs.forEach((d) => {
        const h = col(d.idx);
        if (!h) return;
        const render =
          d.idx === 5
            ? (row: Record<string, any>) => convertExcelDate(row[h])
            : (row: Record<string, any>) => String(row[h] ?? "");
        cols.push({ key: h, header: d.header, width: d.width, render });
      });
    } else if (activeTab === "financials") {
      // ── Financials — Price Consulting ─────────────────────────────────────────────────
      // Col 0: Business Unit, Col 1: PN, Col 2: Descripton, Col 3: LAST ORDER DATE,
      // Col 4: ORIGINAL CURRENCY PRICE, Col 5: Currency, Col 6: Lead Time
      const defs: { idx: number; header: string; width: string }[] = [
        { idx: 0, header: "BUSINESS UNIT", width: "10%" },
        { idx: 1, header: "PART NUMBER", width: "14%" },
        { idx: 2, header: "DESCRIPTION", width: "36%" },
        { idx: 3, header: "LAST ORDER DATE", width: "16%" },
        { idx: 4, header: "COST (USD)", width: "12%" },
        { idx: 6, header: "LEAD TIME", width: "8%" },
      ];
      defs.forEach((d) => {
        const h = col(d.idx);
        if (!h) return;
        let render: (row: Record<string, any>) => React.ReactNode;
        if (d.idx === 3) {
          render = (row) => convertExcelDate(row[h]);
        } else if (d.idx === 4) {
          // Convert from currency in col 5 to USD
          const currCol = col(5);
          render = (row) => {
            const cur = currCol ? String(row[currCol] || "USD") : "USD";
            return formatAsUSD(row[h], exchangeRates, cur);
          };
        } else {
          render = (row) => String(row[h] ?? "");
        }
        cols.push({ key: h, header: d.header, width: d.width, render });
      });
    } else if (activeTab === "brazil") {
      if (activeSubTab === "priceConsulting") {
        // ── Brazil — Price Consulting (BUMBL + BUMBR) ─────────────────────────
        // Col 0: Unit, Col 1: Item, Col 2: Descript, Col 17: Repl Cost - Vendor Name,
        // Col 25: PO Date, Col 26: PO Due (lead time = col26-col25), Col 27: Last Price Paid (BRL→USD)
        const defs: { idx: number; header: string; width: string }[] = [
          { idx: 0, header: "BUSINESS UNIT", width: "9%" },
          { idx: 1, header: "PART NUMBER", width: "12%" },
          { idx: 2, header: "DESCRIPTION", width: "28%" },
          { idx: 17, header: "VENDOR", width: "18%" },
          { idx: 25, header: "LAST ORDER DATE", width: "14%" },
          { idx: -1, header: "LEAD TIME", width: "8%" }, // computed
          { idx: 27, header: "COST (USD)", width: "8%" },
        ];
        defs.forEach((d) => {
          if (d.idx === -1) {
            // Lead time = PO Due (col 26) - PO Date (col 25) in days
            const poDateCol = col(25);
            const poDueCol = col(26);
            cols.push({
              key: "__leadTime__",
              header: d.header,
              width: d.width,
              render: (row) => calcLeadTimeDays(row[poDateCol], row[poDueCol]),
            });
            return;
          }
          const h = col(d.idx);
          if (!h) return;
          let render: (row: Record<string, any>) => React.ReactNode;
          if (d.idx === 25) {
            render = (row) => convertExcelDate(row[h]);
          } else if (d.idx === 27) {
            // Convert BRL → USD
            render = (row) => formatAsUSD(row[h], exchangeRates, "BRL");
          } else {
            render = (row) => String(row[h] ?? "");
          }
          cols.push({ key: h, header: d.header, width: d.width, render });
        });
      } else {
        // ── Brazil — Active Registered with Manufacturer ──────────────────────
        // Col 0: Unit, Col 1: Item, Col 2: Long Descr, Col 3: Qty Avail, Col 4: Qty On Hand,
        // Col 7: Last Date, Col 13: Mfg ID, Col 14: Mfg Itm ID, Col 17: Name (Vendor)
        const defs: { idx: number; header: string; width: string }[] = [
          { idx: 0, header: "BUSINESS UNIT", width: "8%" },
          { idx: 1, header: "PART NUMBER", width: "11%" },
          { idx: 2, header: "DESCRIPTION", width: "22%" },
          { idx: 3, header: "QTY AVAIL", width: "7%" },
          { idx: 4, header: "QTY ON HAND", width: "7%" },
          { idx: 7, header: "LAST ORDER DATE", width: "13%" },
          { idx: 13, header: "MFG NAME", width: "10%" },
          { idx: 14, header: "MFG REF.", width: "10%" },
          { idx: 17, header: "VENDOR", width: "9%" },
        ];
        defs.forEach((d) => {
          const h = col(d.idx);
          if (!h) return;
          let render: (row: Record<string, any>) => React.ReactNode;
          if (d.idx === 7) {
            render = (row) => convertExcelDate(row[h]);
          } else {
            render = (row) => String(row[h] ?? "");
          }
          cols.push({ key: h, header: d.header, width: d.width, render });
        });
      }
    }

    return cols;
  };

  // ── Column filter options per tab/subtab ───────────────────────────────────
  const getFilterColumnOptions = (): { key: string; label: string }[] => {
    const hdrs = currentTab.headers;
    if (!isMultiFilter) {
      // Price Consulting: PN (col 1), Description (col 2), Vendor (col 17, Brazil only)
      const opts = [
        { key: hdrs[1], label: "PART NUMBER" },
        { key: hdrs[2], label: "DESCRIPTION" },
      ];
      if (activeTab === "brazil") opts.push({ key: hdrs[17], label: "VENDOR" });
      return opts.filter((o) => o.key);
    }
    if (activeTab === "financials") {
      return [
        { key: hdrs[0], label: "BUSINESS UNIT" },
        { key: hdrs[1], label: "PART NUMBER" },
        { key: hdrs[2], label: "DESCRIPTION" },
        { key: hdrs[3], label: "MFG NAME" },
        { key: hdrs[4], label: "MFG REF" },
      ].filter((o) => o.key);
    }
    return [
      { key: hdrs[0], label: "BUSINESS UNIT" },
      { key: hdrs[1], label: "PART NUMBER" },
      { key: hdrs[2], label: "DESCRIPTION" },
      { key: hdrs[13], label: "MFG NAME" },
      { key: hdrs[14], label: "MFG REF." },
      { key: hdrs[17], label: "VENDOR" },
    ].filter((o) => o.key);
  };

  // ── Computed column defs (memoized) ────────────────────────────────────────
  const allColumns = React.useMemo(
    () => getVisibleColumns(),
    [activeTab, activeSubTab, currentTab.headers, exchangeRates],
  );
  const columns = React.useMemo(
    () => allColumns.filter((c) => !currentHidden.has(c.key)),
    [allColumns, currentHidden],
  );

  // ── Photo column PN key (second visible column header, index 1 from headers)
  const pnColumnKey = currentTab.headers[1] || "";

  // ── Build exchange rate badges for header ──────────────────────────────────
  const ratesBadges = React.useMemo(() => {
    if (!exchangeRates || exchangeRates.length === 0) return null;
    return (
      <div className={styles.ratesBadges}>
        {exchangeRates.map((r) => (
          <span
            key={r.currency}
            className={styles.rateBadge}
            title={
              r.lastUpdate ? "Updated " + formatDateTime(r.lastUpdate) : ""
            }
          >
            <strong>{r.currency}</strong>: {r.rate.toFixed(2)}
            {r.lastUpdate && (
              <span className={styles.rateDate}>
                {" "}
                ({formatDate(r.lastUpdate, "dd/MMM/yyyy")})
              </span>
            )}
          </span>
        ))}
      </div>
    );
  }, [exchangeRates]);

  // ── Open in external fullscreen tab ────────────────────────────────────────
  const handleOpenExternal = (): void => {
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split("#")[0];
    const externalUrl = baseUrl + "#/tools/query-consulting-external";
    window.open(externalUrl, "_blank");
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  // Loading state
  if (storeLoading && !storeData) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Query Consulting"
          subtitle="Loading catalog data..."
          icon={
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          }
        />
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
          <span>Loading query data from SharePoint...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (storeError) {
    return (
      <div className={styles.page}>
        <PageHeader title="Query Consulting" subtitle="Error loading data" />
        <div className={styles.errorBanner}>{storeError}</div>
      </div>
    );
  }

  const filterColOptions = getFilterColumnOptions();
  const sourceLabel =
    SOURCES.filter(([key]) => key === activeTab)[0]?.[1] || "";
  const selectedBuCount = currentBuFilters.filter((f) => f.selected).length;
  const buPartial =
    currentBuFilters.length > 0 && selectedBuCount < currentBuFilters.length;
  const hiddenCount = allColumns.filter((c) => currentHidden.has(c.key)).length;

  /** Live hit counter next to a source / view tab (only while the general search is active) */
  const renderCount = (
    tab: TabKey,
    views: SubTabKey[],
  ): React.ReactElement | null => {
    if (!searchActive) return null;
    let count = 0;
    views.forEach((v) => (count += getViewCount(tab, v)));
    return (
      <span
        className={`${styles.countBadge}${count === 0 ? ` ${styles.countBadgeEmpty}` : ""}`}
        title="Matches for the general search and the filters of each view"
      >
        {count.toLocaleString()}
      </span>
    );
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Query Consulting"
        subtitle={`${filteredCount.toLocaleString()} of ${totalRows.toLocaleString()} items`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        }
        actions={
          <div className={styles.headerActions}>
            {ratesBadges}
            <button
              type="button"
              className={styles.externalBtn}
              onClick={handleOpenExternal}
              title="Open in fullscreen external view"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
                <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
              </svg>
              External View
            </button>
          </div>
        }
      />

      {/* ── General search: every source and view ───────────────────────── */}
      <div className={styles.searchBar}>
        <span className={styles.searchIcon}>{SearchIcon}</span>
        <input
          type="text"
          className={styles.searchBarInput}
          placeholder="Search Peoplesoft Financials and Peoplesoft Brazil by part number or description..."
          value={generalSearch}
          onChange={(e) => setGeneralSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setGeneralSearch("");
          }}
          aria-label="Search every Query Consulting view by part number or description"
        />
        {isSearching && (
          <span className={styles.searchingTag}>Searching...</span>
        )}
        {generalSearch && (
          <button
            type="button"
            className={styles.searchClear}
            onClick={() => setGeneralSearch("")}
            title="Clear search (Esc)"
            aria-label="Clear search"
          >
            {CloseIcon}
          </button>
        )}
        <span
          className={styles.searchScope}
          title="Applies to every source and view below"
        >
          All views
        </span>
      </div>

      {/* ── Level 1: data source ────────────────────────────────────────── */}
      <div
        className={styles.sourceTabs}
        role="tablist"
        aria-label="Data source"
      >
        {SOURCES.map(([key, label]) => (
          <button
            type="button"
            role="tab"
            key={key}
            aria-selected={activeTab === key}
            className={`${styles.sourceTab}${activeTab === key ? ` ${styles.sourceTabActive}` : ""}`}
            onClick={() => handleTabChange(key)}
          >
            <span className={styles.sourceTabIcon}>{DatabaseIcon}</span>
            {label}
            {renderCount(key, ["priceConsulting", "activeRegistered"])}
          </button>
        ))}
      </div>

      {/* ── Level 2: views of the selected source, inside its panel ─────── */}
      <div className={styles.sourcePanel} role="tabpanel">
        <div className={styles.viewRow}>
          <span className={styles.viewLabel}>
            {CornerDownRightIcon}
            {sourceLabel} views
          </span>
          <div
            className={styles.viewTabs}
            role="tablist"
            aria-label={`${sourceLabel} views`}
          >
            {VIEWS.map(([key, label]) => (
              <button
                type="button"
                role="tab"
                key={key}
                aria-selected={activeSubTab === key}
                className={`${styles.viewTab}${activeSubTab === key ? ` ${styles.viewTabActive}` : ""}`}
                onClick={() => handleSubTabChange(key)}
              >
                {label}
                {renderCount(activeTab, [key])}
              </button>
            ))}
          </div>
        </div>

        {/* ── Toolbar: this view's column filters + BU / column options ── */}
        <div className={styles.filterToolbar}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Filter this view</span>
            {currentTab.searchFilters.map((filter) => {
              const colLabel = (
                filterColOptions.filter((o) => o.key === filter.column)[0] || {
                  label: "",
                }
              ).label;
              return (
                <div key={filter.id} className={styles.filterRow}>
                  <select
                    className={styles.colSelect}
                    value={filter.column}
                    onChange={(e) =>
                      handleUpdateFilter(filter.id, e.target.value)
                    }
                    aria-label="Filter column"
                  >
                    {filterColOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className={styles.filterInput}
                    placeholder={
                      colLabel
                        ? `Filter by ${colLabel.toLowerCase()}...`
                        : "Filter value..."
                    }
                    value={filter.value}
                    onChange={(e) =>
                      handleUpdateFilter(filter.id, undefined, e.target.value)
                    }
                    aria-label="Filter value"
                  />
                  {isMultiFilter && (
                    <button
                      type="button"
                      className={styles.removeFilterBtn}
                      onClick={() => handleRemoveFilter(filter.id)}
                      disabled={currentTab.searchFilters.length <= 1}
                      title="Remove filter"
                      aria-label="Remove filter"
                    >
                      {CloseIcon}
                    </button>
                  )}
                </div>
              );
            })}
            {isMultiFilter &&
              currentTab.searchFilters.length < MAX_COLUMN_FILTERS && (
                <button
                  type="button"
                  className={styles.addFilterBtn}
                  onClick={handleAddFilter}
                >
                  + Add Filter
                </button>
              )}
          </div>

          <div className={styles.toolbarActions}>
            <button
              type="button"
              className={`${styles.toolbarBtn}${buFilterOpen ? ` ${styles.toolbarBtnOpen}` : ""}`}
              onClick={() => setBuFilterOpen(!buFilterOpen)}
              aria-expanded={buFilterOpen}
            >
              Business Units
              {buPartial && (
                <span className={styles.countBadge}>
                  {selectedBuCount}/{currentBuFilters.length}
                </span>
              )}
              <span
                className={`${styles.chevron}${buFilterOpen ? ` ${styles.chevronOpen}` : ""}`}
              >
                {ChevronDownIcon}
              </span>
            </button>
            <div className={styles.columnToggleWrap} data-qc-colmenu="">
              <button
                type="button"
                className={`${styles.toolbarBtn}${colMenuOpen ? ` ${styles.toolbarBtnOpen}` : ""}`}
                onClick={() => setColMenuOpen(!colMenuOpen)}
                aria-expanded={colMenuOpen}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Columns
                {hiddenCount > 0 && (
                  <span className={styles.countBadge}>
                    {allColumns.length - hiddenCount}/{allColumns.length}
                  </span>
                )}
                <span
                  className={`${styles.chevron}${colMenuOpen ? ` ${styles.chevronOpen}` : ""}`}
                >
                  {ChevronDownIcon}
                </span>
              </button>
              {colMenuOpen && (
                <div className={styles.columnMenu}>
                  {allColumns.map((col) => (
                    <label key={col.key} className={styles.columnMenuItem}>
                      <input
                        type="checkbox"
                        checked={!currentHidden.has(col.key)}
                        onChange={() => toggleColumnVisibility(col.key)}
                      />
                      <span>{col.header}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── BU Filter Panel ───────────────────────────────────────────── */}
        {buFilterOpen && (
          <div className={styles.buFilterPanel}>
            <div className={styles.buFilterHeader}>
              <span className={styles.buFilterTitle}>
                Filter by Business Unit
                <span className={styles.buFilterCount}>
                  {selectedBuCount} of {currentBuFilters.length} selected
                </span>
              </span>
              <div className={styles.buFilterActions}>
                <button
                  type="button"
                  className={styles.buFilterActionBtn}
                  onClick={selectAllBuFilters}
                >
                  Select All
                </button>
                <button
                  type="button"
                  className={styles.buFilterActionBtn}
                  onClick={clearAllBuFilters}
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className={styles.buFilterList}>
              {currentBuFilters.length === 0 ? (
                <span className={styles.noFilters}>
                  No Business Units available
                </span>
              ) : (
                currentBuFilters.map((f) => (
                  <label
                    key={f.name}
                    className={`${styles.buCheckbox}${f.selected ? ` ${styles.buCheckboxOn}` : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={f.selected}
                      onChange={() => toggleBuFilter(f.name)}
                    />
                    <span>{f.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Data Table ──────────────────────────────────────────────────── */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.photoColHeader} style={{ width: 50 }}>
                  Photo
                </th>
                {columns.map((col) => {
                  const wOverride = colWidths[col.key];
                  const thStyle: React.CSSProperties = wOverride
                    ? { width: wOverride + "px" }
                    : { width: col.width };
                  return (
                    <th
                      key={col.key}
                      className={styles.sortableHeader}
                      style={thStyle}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.header}
                      {currentTab.sortColumn === col.key && (
                        <span className={styles.sortArrow}>
                          {currentTab.sortDescending ? " ▼" : " ▲"}
                        </span>
                      )}
                      <span
                        className={styles.resizeHandle}
                        onMouseDown={(e) => handleResizeStart(col.key, e)}
                      />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className={styles.emptyMessage}
                  >
                    No results found. Try different search criteria or adjust
                    filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((row, idx) => {
                  const pn = String(row[pnColumnKey] || "").trim();
                  const photoUrl = pn ? getPhotoUrl(pn) : "";
                  return (
                    <tr key={safePage * PAGE_SIZE + idx}>
                      <td className={styles.photoCell}>
                        {photoUrl && (
                          <PhotoThumbnail
                            url={photoUrl}
                            pn={pn}
                            onClick={() => setPreviewPhotoUrl(photoUrl)}
                          />
                        )}
                      </td>
                      {columns.map((col) => (
                        <td key={col.key}>{col.render(row)}</td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ──────────────────────────────────────────────────── */}
        <div className={styles.paginationBar}>
          <span className={styles.resultCount}>
            Showing {Math.min(safePage * PAGE_SIZE + 1, filteredCount)}-
            {Math.min((safePage + 1) * PAGE_SIZE, filteredCount)} of{" "}
            {filteredCount.toLocaleString()} items
          </span>
          <div className={styles.paginationControls}>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={safePage === 0}
              onClick={() => setPage(0)}
              title="First page"
            >
              ««
            </button>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
              title="Previous page"
            >
              «
            </button>
            <span className={styles.pageInfo}>
              Page {safePage + 1} of {totalPages}
            </span>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage(safePage + 1)}
              title="Next page"
            >
              »
            </button>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage(totalPages - 1)}
              title="Last page"
            >
              »»
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className={styles.footer}>
        Update Date: Automatic update every morning.
        <br />
        Created By: Raphael Costa
      </div>

      {/* ── Photo Lightbox ──────────────────────────────────────────────── */}
      {previewPhotoUrl && (
        <PhotoLightbox
          url={previewPhotoUrl}
          onClose={() => setPreviewPhotoUrl(null)}
          alt="Equipment photo"
        />
      )}
    </div>
  );
}

// ── Photo Thumbnail Sub-Component ────────────────────────────────────────────
/**
 * Tries to load the image; if it fails (404), renders nothing.
 * Uses a ref-based approach to avoid broken image icons.
 */
function PhotoThumbnail({
  url,
  pn,
  onClick,
}: {
  url: string;
  pn: string;
  onClick: () => void;
}): React.ReactElement | null {
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    setLoaded(false);
    setFailed(false);
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setFailed(true);
    img.src = url;
  }, [url]);

  if (failed || !loaded) {
    return <div style={{ width: 36, height: 36 }} />;
  }

  return (
    <img src={url} alt={pn} className={styles.thumbnail} onClick={onClick} />
  );
}
