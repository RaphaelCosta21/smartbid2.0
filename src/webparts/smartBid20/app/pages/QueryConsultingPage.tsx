/**
 * QueryConsultingPage — Full query consultation tool.
 * Two main tabs (Peoplesoft Financials / Peoplesoft Brazil),
 * two sub-tabs each (Price Consulting / Active Registered with Manuf.),
 * Business Unit filters, column-specific search, sortable columns,
 * photo column, and pagination.
 *
 * Reuses useQueryCatalogStore — data is loaded once and cached in memory.
 * If BOM Costs or Favorites already triggered loadCatalog(), data is instant.
 */
import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { PhotoLightbox } from "../components/common/PhotoLightbox";
import { useQueryCatalogStore } from "../stores/useQueryCatalogStore";
import { useConfigStore } from "../stores/useConfigStore";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { convertToUSD } from "../utils/costCalculations";
import { formatCurrency } from "../utils/formatters";
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
  filteredRows: Record<string, any>[];
  searchText: string;
  searchColumn: string;
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
    filteredRows: [],
    searchText: "",
    searchColumn: "",
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
    // Try as Excel serial number first
    const n = parseFloat(str);
    if (!isNaN(n) && n > 10000 && n < 100000) {
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

/** Token-based filter: every space-separated token must appear in cell */
function matchTokens(cell: string, searchText: string): boolean {
  const lower = cell.toLowerCase();
  const tokens = searchText
    .toLowerCase()
    .split(" ")
    .filter((t) => t.trim().length > 0);
  for (let i = 0; i < tokens.length; i++) {
    if (lower.indexOf(tokens[i]) < 0) return false;
  }
  return true;
}

/** Apply BU filter + single search filter */
function applyAllFilters(
  rows: Record<string, any>[],
  buFilters: IBusinessUnitFilter[],
  buColumn: string,
  searchColumn: string,
  searchText: string,
): Record<string, any>[] {
  const selectedBUs = buFilters.filter((f) => f.selected).map((f) => f.name);
  if (selectedBUs.length === 0) return [];

  const result: Record<string, any>[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const buVal = String(row[buColumn] || "");
    if (selectedBUs.indexOf(buVal) < 0) continue;
    if (searchText) {
      const cell = String(row[searchColumn] || "");
      if (!matchTokens(cell, searchText)) continue;
    }
    result.push(row);
  }
  return result;
}

/** Apply BU filter + multiple search filters (AND logic) */
function applyMultipleFilters(
  rows: Record<string, any>[],
  buFilters: IBusinessUnitFilter[],
  buColumn: string,
  searchFilters: ISearchFilter[],
): Record<string, any>[] {
  const selectedBUs = buFilters.filter((f) => f.selected).map((f) => f.name);
  if (selectedBUs.length === 0) return [];

  const activeFilters = searchFilters.filter((f) => f.value.trim() !== "");

  const result: Record<string, any>[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const buVal = String(row[buColumn] || "");
    if (selectedBUs.indexOf(buVal) < 0) continue;

    let allMatch = true;
    for (let j = 0; j < activeFilters.length; j++) {
      const cell = String(row[activeFilters[j].column] || "");
      if (!matchTokens(cell, activeFilters[j].value)) {
        allMatch = false;
        break;
      }
    }
    if (allMatch) result.push(row);
  }
  return result;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const PAGE_SIZE = 100;

// ── Component ──────────────────────────────────────────────────────────────────
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

    // Brazil Price Consulting = BUMBL + BUMBR rows that have "Last Price Paid"
    const brazilPCHeaders = rawBumbl.headers;
    const allBrazilRows = rawBumbl.rows.concat(rawBumbr.rows);
    const brazilPCRows = allBrazilRows.filter((row) => {
      const v = row["Last Price Paid"];
      return v !== undefined && v !== null && v !== "";
    });

    // Financials: all rows for Price Consulting
    const finPCRows = rawFin.rows;
    // Financials Active Registered: rows with Last Price Paid
    const finARRows = rawFin.rows.filter((row) => {
      const v = row["Last Price Paid"];
      return v !== undefined && v !== null && v !== "";
    });

    // Extract BU filters
    const finBUs = extractBUs(finPCRows, rawFin.headers[0]);
    const brazilBUs = extractBUs(allBrazilRows, brazilPCHeaders[0]);
    const arBUs = extractBUs(rawAR.rows, rawAR.headers[0]);

    const newTabs: Record<TabKey, ISubTabData> = {
      financials: {
        priceConsulting: {
          headers: rawFin.headers,
          rows: finPCRows,
          filteredRows: finPCRows,
          searchText: "",
          searchColumn: rawFin.headers[1] || "",
          searchFilters: [],
          sortColumn: "",
          sortDescending: false,
        },
        activeRegistered: {
          headers: rawFin.headers,
          rows: finARRows,
          filteredRows: finARRows,
          searchText: "",
          searchColumn: rawFin.headers[1] || "",
          searchFilters: [],
          sortColumn: "",
          sortDescending: false,
        },
      },
      brazil: {
        priceConsulting: {
          headers: brazilPCHeaders,
          rows: brazilPCRows,
          filteredRows: brazilPCRows,
          searchText: "",
          searchColumn: brazilPCHeaders[1] || "",
          searchFilters: [],
          sortColumn: "",
          sortDescending: false,
        },
        activeRegistered: {
          headers: rawAR.headers,
          rows: rawAR.rows,
          filteredRows: rawAR.rows,
          searchText: "",
          searchColumn: rawAR.headers[1] || "",
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
        activeRegistered: finBUs.map((f) => ({ ...f })),
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
  const filteredCount = currentTab.filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const pageRows = currentTab.filteredRows.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );
  const isMultiFilter =
    activeTab === "brazil" && activeSubTab === "activeRegistered";

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
  const updateCurrentTab = (
    patch: Partial<ITabData>,
    tabKey?: TabKey,
    subKey?: SubTabKey,
  ): void => {
    const tk = tabKey || activeTab;
    const sk = subKey || activeSubTab;
    setTabs((prev) => ({
      ...prev,
      [tk]: {
        ...prev[tk],
        [sk]: { ...prev[tk][sk], ...patch },
      },
    }));
  };

  // ── Refilter helper (single search) ────────────────────────────────────────
  const refilterSingle = (
    tabData: ITabData,
    buF: IBusinessUnitFilter[],
    overrides?: { searchText?: string; searchColumn?: string },
  ): Record<string, any>[] => {
    const sText =
      overrides?.searchText !== undefined
        ? overrides.searchText
        : tabData.searchText;
    const sCol = overrides?.searchColumn || tabData.searchColumn;
    return applyAllFilters(tabData.rows, buF, tabData.headers[0], sCol, sText);
  };

  // ── Refilter helper (multi-filter) ─────────────────────────────────────────
  const refilterMulti = (
    tabData: ITabData,
    buF: IBusinessUnitFilter[],
    overrideFilters?: ISearchFilter[],
  ): Record<string, any>[] => {
    const filters = overrideFilters || tabData.searchFilters;
    return applyMultipleFilters(tabData.rows, buF, tabData.headers[0], filters);
  };

  // ── Search handlers ────────────────────────────────────────────────────────
  const handleSearch = (newValue: string): void => {
    if (isMultiFilter) return; // multi-filter uses its own handler
    const filtered = refilterSingle(currentTab, currentBuFilters, {
      searchText: newValue,
    });
    updateCurrentTab({ searchText: newValue, filteredRows: filtered });
    setPage(0);
  };

  const handleSearchColumnChange = (col: string): void => {
    const filtered = refilterSingle(currentTab, currentBuFilters, {
      searchColumn: col,
    });
    updateCurrentTab({ searchColumn: col, filteredRows: filtered });
    setPage(0);
  };

  // ── Multi-filter handlers (Active Registered Brazil) ───────────────────────
  const handleAddFilter = (): void => {
    if (currentTab.searchFilters.length >= 3) return;
    const newFilter: ISearchFilter = {
      id: "filter_" + Date.now(),
      column: currentTab.headers[0] || "",
      value: "",
    };
    const newFilters = currentTab.searchFilters.concat([newFilter]);
    const filtered = refilterMulti(currentTab, currentBuFilters, newFilters);
    updateCurrentTab({ searchFilters: newFilters, filteredRows: filtered });
    setPage(0);
  };

  const handleRemoveFilter = (filterId: string): void => {
    const newFilters = currentTab.searchFilters.filter(
      (f) => f.id !== filterId,
    );
    const filtered = refilterMulti(currentTab, currentBuFilters, newFilters);
    updateCurrentTab({ searchFilters: newFilters, filteredRows: filtered });
    setPage(0);
  };

  const handleUpdateFilter = (
    filterId: string,
    column?: string,
    value?: string,
  ): void => {
    const newFilters = currentTab.searchFilters.map((f) =>
      f.id === filterId
        ? {
            ...f,
            ...(column !== undefined && { column }),
            ...(value !== undefined && { value }),
          }
        : f,
    );
    const filtered = refilterMulti(currentTab, currentBuFilters, newFilters);
    updateCurrentTab({ searchFilters: newFilters, filteredRows: filtered });
    setPage(0);
  };

  // ── BU filter handlers ─────────────────────────────────────────────────────
  const toggleBuFilter = (buName: string): void => {
    const newBuF = currentBuFilters.map((f) =>
      f.name === buName ? { ...f, selected: !f.selected } : f,
    );
    setBuFilters((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [activeSubTab]: newBuF },
    }));
    const tabData = currentTab;
    const filtered = isMultiFilter
      ? applyMultipleFilters(
          tabData.rows,
          newBuF,
          tabData.headers[0],
          tabData.searchFilters,
        )
      : applyAllFilters(
          tabData.rows,
          newBuF,
          tabData.headers[0],
          tabData.searchColumn,
          tabData.searchText,
        );
    updateCurrentTab({ filteredRows: filtered });
    setPage(0);
  };

  const selectAllBuFilters = (): void => {
    const newBuF = currentBuFilters.map((f) => ({ ...f, selected: true }));
    setBuFilters((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [activeSubTab]: newBuF },
    }));
    const tabData = currentTab;
    const filtered = isMultiFilter
      ? applyMultipleFilters(
          tabData.rows,
          newBuF,
          tabData.headers[0],
          tabData.searchFilters,
        )
      : applyAllFilters(
          tabData.rows,
          newBuF,
          tabData.headers[0],
          tabData.searchColumn,
          tabData.searchText,
        );
    updateCurrentTab({ filteredRows: filtered });
    setPage(0);
  };

  const clearAllBuFilters = (): void => {
    const newBuF = currentBuFilters.map((f) => ({ ...f, selected: false }));
    setBuFilters((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [activeSubTab]: newBuF },
    }));
    updateCurrentTab({ filteredRows: [] });
    setPage(0);
  };

  // ── Sort handler ───────────────────────────────────────────────────────────
  const handleSort = (colName: string): void => {
    const isSame = colName === currentTab.sortColumn;
    const desc = isSame ? !currentTab.sortDescending : false;

    const sorted = [...currentTab.filteredRows].sort((a, b) => {
      const va = a[colName];
      const vb = b[colName];
      if (va === vb) return 0;
      if (typeof va === "string" && typeof vb === "string") {
        return desc ? vb.localeCompare(va) : va.localeCompare(vb);
      }
      const cmp = va < vb ? -1 : 1;
      return desc ? -cmp : cmp;
    });

    updateCurrentTab({
      sortColumn: colName,
      sortDescending: desc,
      filteredRows: sorted,
    });
    setPage(0);
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

    if (activeTab === "financials") {
      // ── Financials — Price Consulting & Active Registered ──────────────────
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

  // ── Search column dropdown options per tab/subtab ──────────────────────────
  const getSearchColumnOptions = (): { key: string; label: string }[] => {
    const hdrs = currentTab.headers;
    if (activeTab === "financials") {
      // PN (col 1) and Description (col 2)
      return [
        { key: hdrs[1], label: "PART NUMBER" },
        { key: hdrs[2], label: "DESCRIPTION" },
      ].filter((o) => o.key);
    } else if (activeTab === "brazil") {
      if (activeSubTab === "priceConsulting") {
        // Item (col 1), Descript (col 2), Vendor (col 17)
        return [
          { key: hdrs[1], label: "PART NUMBER" },
          { key: hdrs[2], label: "DESCRIPTION" },
          { key: hdrs[17], label: "VENDOR" },
        ].filter((o) => o.key);
      }
    }
    return [];
  };

  // ── Multi-filter column options (Active Registered Brazil) ─────────────────
  const getMultiFilterColumnOptions = (): { key: string; label: string }[] => {
    const hdrs = currentTab.headers;
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
          <span key={r.currency} className={styles.rateBadge}>
            <strong>{r.currency}</strong>: {r.rate.toFixed(2)}
            {r.lastUpdate && (
              <span className={styles.rateDate}> ({r.lastUpdate})</span>
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

  const searchColOptions = getSearchColumnOptions();
  const multiColOptions = getMultiFilterColumnOptions();

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

      {/* ── Main Tabs ───────────────────────────────────────────────────── */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === "financials" ? styles.tabActive : ""}`}
          onClick={() => handleTabChange("financials")}
        >
          Peoplesoft Financials
        </button>
        <button
          className={`${styles.tab} ${activeTab === "brazil" ? styles.tabActive : ""}`}
          onClick={() => handleTabChange("brazil")}
        >
          Peoplesoft Brazil
        </button>
      </div>

      {/* ── Sub-Tabs ────────────────────────────────────────────────────── */}
      <div className={styles.subTabBar}>
        <button
          className={`${styles.subTab} ${activeSubTab === "priceConsulting" ? styles.subTabActive : ""}`}
          onClick={() => handleSubTabChange("priceConsulting")}
        >
          Price Consulting
        </button>
        <button
          className={`${styles.subTab} ${activeSubTab === "activeRegistered" ? styles.subTabActive : ""}`}
          onClick={() => handleSubTabChange("activeRegistered")}
        >
          Active Registered with Manuf.
        </button>
      </div>

      {/* ── Filter Toolbar ──────────────────────────────────────────────── */}
      <div className={styles.filterToolbar}>
        <div className={styles.searchArea}>
          {isMultiFilter ? (
            /* Multiple search filters for Active Registered Brazil */
            <div className={styles.multiFilterWrap}>
              <span className={styles.filterLabel}>
                Search Filters (Multiple)
              </span>
              {currentTab.searchFilters.map((filter) => (
                <div key={filter.id} className={styles.multiFilterRow}>
                  <select
                    className={styles.colSelect}
                    value={filter.column}
                    onChange={(e) =>
                      handleUpdateFilter(filter.id, e.target.value)
                    }
                  >
                    {multiColOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder={`Search by ${filter.column}...`}
                    value={filter.value}
                    onChange={(e) =>
                      handleUpdateFilter(filter.id, undefined, e.target.value)
                    }
                  />
                  <button
                    className={styles.removeFilterBtn}
                    onClick={() => handleRemoveFilter(filter.id)}
                    disabled={currentTab.searchFilters.length <= 1}
                    title="Remove filter"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {currentTab.searchFilters.length < 3 && (
                <button
                  className={styles.addFilterBtn}
                  onClick={handleAddFilter}
                >
                  + Add Filter
                </button>
              )}
            </div>
          ) : (
            /* Single search for other tabs */
            <div className={styles.singleFilterRow}>
              <span className={styles.filterLabel}>Search By</span>
              <select
                className={styles.colSelect}
                value={currentTab.searchColumn}
                onChange={(e) => handleSearchColumnChange(e.target.value)}
              >
                {searchColOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={`Search by ${currentTab.searchColumn}...`}
                value={currentTab.searchText}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          )}
        </div>

        <button
          className={`${styles.buFilterToggle} ${buFilterOpen ? styles.buFilterToggleOpen : ""}`}
          onClick={() => setBuFilterOpen(!buFilterOpen)}
        >
          Business Unit Filters
          <span className={styles.chevron}>{buFilterOpen ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* ── BU Filter Panel ─────────────────────────────────────────────── */}
      {buFilterOpen && (
        <div className={styles.buFilterPanel}>
          <div className={styles.buFilterHeader}>
            <span className={styles.buFilterTitle}>
              Filter by Business Unit
            </span>
            <div className={styles.buFilterActions}>
              <button
                className={styles.buFilterActionBtn}
                onClick={selectAllBuFilters}
              >
                Select All
              </button>
              <button
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
                <label key={f.name} className={styles.buCheckbox}>
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

      {/* ── Column Visibility Toggle ─────────────────────────────────── */}
      <div className={styles.columnToggleWrap}>
        <button
          className={`${styles.columnToggleBtn} ${colMenuOpen ? styles.columnToggleBtnOpen : ""}`}
          onClick={() => setColMenuOpen(!colMenuOpen)}
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
          <span className={styles.chevron}>{colMenuOpen ? "▲" : "▼"}</span>
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
                  <tr key={page * PAGE_SIZE + idx}>
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
          Showing {Math.min(page * PAGE_SIZE + 1, filteredCount)}–
          {Math.min((page + 1) * PAGE_SIZE, filteredCount)} of{" "}
          {filteredCount.toLocaleString()} items
        </span>
        <div className={styles.paginationControls}>
          <button
            className={styles.pageBtn}
            disabled={page === 0}
            onClick={() => setPage(0)}
            title="First page"
          >
            ««
          </button>
          <button
            className={styles.pageBtn}
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            title="Previous page"
          >
            «
          </button>
          <span className={styles.pageInfo}>
            Page {page + 1} of {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            title="Next page"
          >
            »
          </button>
          <button
            className={styles.pageBtn}
            disabled={page >= totalPages - 1}
            onClick={() => setPage(totalPages - 1)}
            title="Last page"
          >
            »»
          </button>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className={styles.footer}>
        Update Date: 03/MAR/2026, Updated every 4 months.
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
