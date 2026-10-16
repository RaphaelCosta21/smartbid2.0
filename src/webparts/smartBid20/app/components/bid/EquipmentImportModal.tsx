/**
 * EquipmentImportModal — Multi-source equipment browser for importing PN + Description
 * into Scope of Supply rows. Tabs: All Sources (global search), Favorites, Assets Catalog,
 * BOM Costs, Quotations, Query Consulting.
 */
import * as React from "react";
import styles from "./EquipmentImportModal.module.scss";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import { useConfigStore } from "../../stores/useConfigStore";
import { useQueryCatalogStore } from "../../stores/useQueryCatalogStore";
import { useQuotationStore } from "../../stores/useQuotationStore";
import { AssetCatalogService } from "../../services/AssetCatalogService";
import { BomCostAnalysisService } from "../../services/BomCostAnalysisService";
import { IAssetCatalogItem } from "../../models/IAssetCatalog";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import { PhotoLightbox } from "../common/PhotoLightbox";
import { EmptyState } from "../common/EmptyState";
import { SkeletonLoader } from "../common/SkeletonLoader";
import { useDebounce } from "../../hooks/useDebounce";
import { formatDate } from "../../utils/formatters";
import {
  IBomCostAnalysis,
  IFavoriteEquipment,
  IFavoriteGroup,
  IQueryCatalogData,
  IQuotationItem,
} from "../../models";

/* ────────── props ────────── */

/** Sub-item payload for equipment that has children (spares/accessories) */
export interface IImportSubItem {
  partNumber: string;
  description: string;
}

/** One catalog record picked in multi-select mode */
export interface IImportPick {
  partNumber: string;
  description: string;
  subItems?: IImportSubItem[];
}

export interface EquipmentImportModalProps {
  /** Called when user picks an item — fills equipmentOffer (desc) + partNumber (pn), optionally with sub-items. Unused in multiSelect mode. */
  onSelect?: (
    partNumber: string,
    description: string,
    subItems?: IImportSubItem[],
  ) => void;
  /** Close the modal without selection */
  onClose: () => void;
  /** Pick several records at once; Confirm then fires onSelectMany instead of onSelect */
  multiSelect?: boolean;
  onSelectMany?: (picks: IImportPick[]) => void;
  /** Visible tabs (default: all); the tab bar is hidden when only one is left */
  tabs?: EquipmentImportTabId[];
  title?: string;
  subtitle?: string;
  /** Returns why a row can't be picked (shown as tooltip); such rows are locked */
  getPickBlockReason?: (
    partNumber: string,
    description: string,
  ) => string | undefined;
}

/* ────────── tab definition ────────── */

export type EquipmentImportTabId =
  | "all"
  | "favorites"
  | "bom"
  | "quotations"
  | "query"
  | "assets";
type TabId = EquipmentImportTabId;
type SourceTabId = Exclude<TabId, "all">;
type QueryTabKey = "financials" | "brazil";
type QuerySubTabKey = "priceConsulting" | "activeRegistered";

interface TabDef {
  id: TabId;
  label: string;
  icon: JSX.Element;
}

/* ────────── SVG icons ────────── */

const StarIcon = (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="currentColor"
    stroke="none"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
  </svg>
);
const CubeIcon = (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const FileTextIcon = (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const SearchIcon = (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const CheckIcon = (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const CloseIcon = (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const LockIcon = (
  <svg
    viewBox="0 0 24 24"
    width="13"
    height="13"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const FolderIcon = (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const PackageIcon = (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const LayersIcon = (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);
const ChevronRightIcon = (
  <svg
    viewBox="0 0 24 24"
    width="12"
    height="12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const DatabaseIcon = (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
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
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="15 10 20 15 15 20" />
    <path d="M4 4v7a4 4 0 004 4h12" />
  </svg>
);

const QUERY_SOURCES: [QueryTabKey, string][] = [
  ["financials", "Peoplesoft Financials"],
  ["brazil", "Peoplesoft Brazil"],
];
const QUERY_VIEWS: [QuerySubTabKey, string][] = [
  ["priceConsulting", "Price Consulting"],
  ["activeRegistered", "Active Registered with Manuf."],
];
const QUERY_COUNT_TITLE = "Matches by part number or description";

const TABS: TabDef[] = [
  { id: "all", label: "All Sources", icon: LayersIcon },
  { id: "favorites", label: "Favorites", icon: StarIcon },
  { id: "assets", label: "Assets Catalog", icon: PackageIcon },
  { id: "bom", label: "BOM Costs", icon: CubeIcon },
  { id: "quotations", label: "Quotations", icon: FileTextIcon },
  { id: "query", label: "Query Consulting", icon: SearchIcon },
];

const TAB_BY_ID: Record<string, TabDef> = {};
TABS.forEach((t) => (TAB_BY_ID[t.id] = t));

/* ────────── search helpers ────────── */

const MIN_GLOBAL_CHARS = 2;
const GLOBAL_ROWS_PER_SECTION = 5;
const GLOBAL_COUNT_CAP = 1000;
const QUOTATIONS_LIMIT = 50;
const ASSETS_LIMIT = 80;

const EMPTY_SEARCHES: Record<TabId, string> = {
  all: "",
  favorites: "",
  assets: "",
  bom: "",
  quotations: "",
  query: "",
};

const SEARCH_PLACEHOLDERS: Record<TabId, string> = {
  all: "Search all sources by part number or description...",
  favorites: "Filter Favorites by part number or description...",
  assets: "Filter Assets Catalog by part number or description...",
  bom: "Filter BOM Costs by part number or description...",
  quotations:
    "Filter Quotations by part number, description, supplier or date...",
  query: "Search Peoplesoft Financials and Peoplesoft Brazil...",
};

function toWords(term: string): string[] {
  return term.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

/** Every word must appear somewhere in the joined fields (PN, description, ...) */
function matchesWords(words: string[], fields: string[]): boolean {
  if (words.length === 0) return true;
  const hay = fields.join(" ").toLowerCase();
  for (let i = 0; i < words.length; i++) {
    if (hay.indexOf(words[i]) < 0) return false;
  }
  return true;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text: string, words: string[]): React.ReactNode {
  if (!text || words.length === 0) return text;
  const re = new RegExp(`(${words.map(escapeRegExp).join("|")})`, "ig");
  // split() with a capture group puts the matches at odd indexes
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className={styles.hl}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function quoteTime(q: IQuotationItem): number {
  return Date.parse(q.quotationDate || q.createdDate || "") || 0;
}

function formatCount(count: number, capped: boolean, max: number): string {
  return capped || count > max ? `${max}+` : String(count);
}

/* ────────── global search ────────── */

interface IGlobalHit {
  pn: string;
  desc: string;
  meta?: string;
}

interface IGlobalSection {
  id: string;
  tab: SourceTabId;
  queryTab?: QueryTabKey;
  querySubTab?: QuerySubTabKey;
  label: string;
  path?: string;
  count: number;
  capped: boolean;
  loading: boolean;
  rows: IGlobalHit[];
}

interface IGlobalSearchInput {
  words: string[];
  favorites: IFavoriteEquipment[];
  favGroupNames: Record<string, string>;
  assets: IAssetCatalogItem[];
  bom: IBomCostAnalysis[];
  quotations: IQuotationItem[];
  catalog: IQueryCatalogData | null;
  loading: Record<SourceTabId, boolean>;
}

type SectionBase = Pick<
  IGlobalSection,
  "id" | "tab" | "queryTab" | "querySubTab" | "label" | "path"
>;

/** Counts matches (stops at GLOBAL_COUNT_CAP) and keeps the first few rows */
function scanSource<T>(
  base: SectionBase,
  items: T[],
  words: string[],
  getPn: (item: T) => string,
  getDesc: (item: T) => string,
  loading: boolean,
  getMeta?: (item: T) => string,
): IGlobalSection {
  const rows: IGlobalHit[] = [];
  let count = 0;
  let capped = false;
  for (let i = 0; i < items.length; i++) {
    const pn = (getPn(items[i]) || "").trim();
    const desc = (getDesc(items[i]) || "").trim();
    if (!matchesWords(words, [pn, desc])) continue;
    if (count >= GLOBAL_COUNT_CAP) {
      capped = true;
      break;
    }
    count++;
    if (rows.length < GLOBAL_ROWS_PER_SECTION) {
      rows.push({ pn, desc, meta: getMeta ? getMeta(items[i]) : undefined });
    }
  }
  return { ...base, count, capped, loading, rows };
}

function searchAllSources(input: IGlobalSearchInput): IGlobalSection[] {
  const { words, catalog, loading } = input;
  const sections: IGlobalSection[] = [];

  sections.push(
    scanSource(
      { id: "favorites", tab: "favorites", label: "Favorites" },
      input.favorites.filter((e) => !e.parentId),
      words,
      (e) => e.partNumber,
      (e) => e.description,
      loading.favorites,
      (e) => input.favGroupNames[e.groupId] || "",
    ),
  );
  sections.push(
    scanSource(
      { id: "assets", tab: "assets", label: "Assets Catalog" },
      input.assets,
      words,
      (a) => a.pn || "",
      (a) => a.title || a.description || "",
      loading.assets,
      (a) => a.keyword || "",
    ),
  );
  sections.push(
    scanSource(
      { id: "bom", tab: "bom", label: "BOM Costs" },
      input.bom,
      words,
      (a) => a.mainPartNumber,
      (a) => a.mainDescription,
      loading.bom,
    ),
  );
  sections.push(
    scanSource(
      { id: "quotations", tab: "quotations", label: "Quotations" },
      input.quotations,
      words,
      (q) => q.partNumber,
      (q) => q.description,
      loading.quotations,
      (q) =>
        [q.supplier, q.quotationDate ? formatDate(q.quotationDate) : ""]
          .filter(Boolean)
          .join(" · "),
    ),
  );

  return sections.concat(searchQueryViews(words, catalog, loading.query));
}

/** Query Consulting: one section per view (source > sub-tab) */
function searchQueryViews(
  words: string[],
  catalog: IQueryCatalogData | null,
  loading: boolean,
): IGlobalSection[] {
  const sections: IGlobalSection[] = [];
  const queryViews: {
    id: string;
    queryTab: QueryTabKey;
    querySubTab: QuerySubTabKey;
    path: string;
    headers: string[];
    rows: Record<string, any>[];
  }[] = [
    {
      id: "query-fin-price",
      queryTab: "financials",
      querySubTab: "priceConsulting",
      path: "Peoplesoft Financials > Price Consulting",
      headers: catalog?.rawFinancials?.headers || [],
      rows: catalog?.rawFinancials?.rows || [],
    },
    {
      id: "query-fin-ar",
      queryTab: "financials",
      querySubTab: "activeRegistered",
      path: "Peoplesoft Financials > Active Registered",
      headers: catalog?.rawFinancialsActiveRegistered?.headers || [],
      rows: catalog?.rawFinancialsActiveRegistered?.rows || [],
    },
    {
      id: "query-br-price",
      queryTab: "brazil",
      querySubTab: "priceConsulting",
      path: "Peoplesoft Brazil > Price Consulting",
      headers: catalog?.rawBrazilBumbl?.headers || [],
      rows: (catalog?.rawBrazilBumbl?.rows || []).concat(
        catalog?.rawBrazilBumbr?.rows || [],
      ),
    },
    {
      id: "query-br-ar",
      queryTab: "brazil",
      querySubTab: "activeRegistered",
      path: "Peoplesoft Brazil > Active Registered",
      headers: catalog?.rawActiveRegistered?.headers || [],
      rows: catalog?.rawActiveRegistered?.rows || [],
    },
  ];
  queryViews.forEach((v) => {
    const buKey = v.headers[0] || "";
    const pnKey = v.headers[1] || "";
    const descKey = v.headers[2] || "";
    sections.push(
      scanSource(
        {
          id: v.id,
          tab: "query",
          queryTab: v.queryTab,
          querySubTab: v.querySubTab,
          label: "Query Consulting",
          path: v.path,
        },
        pnKey ? v.rows : [],
        words,
        (r) => String(r[pnKey] ?? ""),
        (r) => String(r[descKey] ?? ""),
        loading,
        (r) => (buKey ? String(r[buKey] ?? "") : ""),
      ),
    );
  });

  return sections;
}

/* ────────── main component ────────── */

export const EquipmentImportModal: React.FC<EquipmentImportModalProps> = ({
  onSelect,
  onClose,
  multiSelect = false,
  onSelectMany,
  tabs,
  title,
  subtitle,
  getPickBlockReason,
}) => {
  const visibleTabs =
    tabs && tabs.length > 0
      ? TABS.filter((t) => tabs.indexOf(t.id) >= 0)
      : TABS;
  const needsSource = (id: SourceTabId): boolean =>
    visibleTabs.some((t) => t.id === "all" || t.id === id);
  const [activeTab, setActiveTab] = React.useState<TabId>(visibleTabs[0].id);
  // Each tab keeps its own filter text; only All Sources searches everything
  const [searches, setSearches] =
    React.useState<Record<TabId, string>>(EMPTY_SEARCHES);
  const search = searches[activeTab];
  const setSearchFor = (tab: TabId, value: string): void =>
    setSearches((prev) => ({ ...prev, [tab]: value }));
  const setSearch = (value: string): void => setSearchFor(activeTab, value);
  const debouncedGlobal = useDebounce(searches.all, 250);
  const debouncedQuery = useDebounce(searches.query, 250);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const overlayPressRef = React.useRef(false);
  const [selectedItem, setSelectedItem] = React.useState<{
    pn: string;
    desc: string;
    subs?: IImportSubItem[];
  } | null>(null);
  // Multi-select picks survive tab changes so sources can be mixed in one import
  const [selectedMany, setSelectedMany] = React.useState<IImportPick[]>([]);

  // ── Favorites store ──
  const favData = useFavoritesStore((s) => s.data);
  const favIsLoaded = useFavoritesStore((s) => s.isLoaded);
  const favIsLoading = useFavoritesStore((s) => s.isLoading);
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
  const getEquipmentByGroup = useFavoritesStore((s) => s.getEquipmentByGroup);
  const getGroupItemCount = useFavoritesStore((s) => s.getGroupItemCount);
  const getSubGroupItemCount = useFavoritesStore((s) => s.getSubGroupItemCount);
  const favAllEquipment: IFavoriteEquipment[] = favData?.equipment || [];
  const configFavGroups = useConfigStore((s) => s.config?.favoriteGroups);

  // ── Query Catalog store ──
  const catalogData = useQueryCatalogStore((s) => s.data);
  const catalogLoaded = useQueryCatalogStore((s) => s.isLoaded);
  const catalogLoading = useQueryCatalogStore((s) => s.isLoading);
  const loadCatalog = useQueryCatalogStore((s) => s.loadCatalog);

  // ── Quotation store ──
  const quotations = useQuotationStore((s) => s.items);
  const quotationsLoaded = useQuotationStore((s) => s.isLoaded);
  const quotationsLoading = useQuotationStore((s) => s.isLoading);
  const loadQuotations = useQuotationStore((s) => s.loadQuotations);

  // ── Assets Catalog state ──
  const [assetItems, setAssetItems] = React.useState<IAssetCatalogItem[]>([]);
  const [assetsLoading, setAssetsLoading] = React.useState(false);
  const [assetsLoaded, setAssetsLoaded] = React.useState(false);
  const [assetCategory, setAssetCategory] = React.useState<string | null>(null);

  // ── BOM Costs state (saved analyses) ──
  const [bomAnalyses, setBomAnalyses] = React.useState<IBomCostAnalysis[]>([]);
  const [bomLoading, setBomLoading] = React.useState(false);
  const [bomLoaded, setBomLoaded] = React.useState(false);

  // ── Lazy-load the sources of the visible tabs on mount ──
  React.useEffect(() => {
    if (needsSource("favorites") && !favIsLoaded && !favIsLoading)
      loadFavorites();
    if (needsSource("query") && !catalogLoaded && !catalogLoading)
      loadCatalog();
    if (needsSource("quotations") && !quotationsLoaded && !quotationsLoading)
      loadQuotations();
    if (needsSource("assets") && !assetsLoaded && !assetsLoading) {
      setAssetsLoading(true);
      AssetCatalogService.getAll()
        .then((data) => {
          setAssetItems(data);
          setAssetsLoaded(true);
          setAssetsLoading(false);
        })
        .catch(() => setAssetsLoading(false));
    }
    if (needsSource("bom") && !bomLoaded && !bomLoading) {
      setBomLoading(true);
      BomCostAnalysisService.getAll()
        .then((data) => {
          setBomAnalyses(data);
          setBomLoaded(true);
          setBomLoading(false);
        })
        .catch(() => setBomLoading(false));
    }
  }, []);

  /** Build photo URL for a favorite equipment item */
  const getFavPhotoUrl = (eq: IFavoriteEquipment): string | null => {
    if (eq.pictureUrl) return eq.pictureUrl;
    if (eq.partNumber) {
      return (
        SHAREPOINT_CONFIG.siteUrl +
        SHAREPOINT_CONFIG.photosBaseUrl +
        "/" +
        eq.partNumber +
        ".jpg"
      );
    }
    return null;
  };

  // ── Favorites state ──
  const [favActiveGroup, setFavActiveGroup] = React.useState<string | null>(
    null,
  );
  const [favActiveSubGroup, setFavActiveSubGroup] = React.useState<
    string | null
  >(null);
  const [expandedFavItems, setExpandedFavItems] = React.useState<Set<string>>(
    new Set(),
  );
  const [includeSubItems, setIncludeSubItems] = React.useState<Set<string>>(
    new Set(),
  );

  const [previewPhotoUrl, setPreviewPhotoUrl] = React.useState<string | null>(
    null,
  );

  // Groups come from System Configuration; fall back to legacy favorites data groups
  const groups: IFavoriteGroup[] = React.useMemo(() => {
    const raw =
      configFavGroups && configFavGroups.length > 0
        ? configFavGroups
        : favData?.groups || [];
    return raw
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((g) => ({
        ...g,
        subGroups: (g.subGroups || [])
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [configFavGroups, favData]);

  /** Unique asset categories sorted alphabetically */
  const assetCategories: string[] = React.useMemo(() => {
    const set = new Set<string>();
    assetItems.forEach((item) => {
      if (item.keyword) set.add(item.keyword);
    });
    const arr: string[] = [];
    set.forEach((k) => arr.push(k));
    return arr.sort((a, b) => a.localeCompare(b));
  }, [assetItems]);

  // ── Query Consulting tab state ──
  const [queryTab, setQueryTab] = React.useState<QueryTabKey>("financials");
  const [querySubTab, setQuerySubTab] =
    React.useState<QuerySubTabKey>("priceConsulting");
  const [queryPage, setQueryPage] = React.useState(0);
  const [queryFilters, setQueryFilters] = React.useState<
    { id: string; column: string; value: string }[]
  >([{ id: "f1", column: "", value: "" }]);
  const QUERY_PAGE_SIZE = 50;

  // Reset sub-group when group changes
  React.useEffect(() => {
    setFavActiveSubGroup(null);
  }, [favActiveGroup]);

  /** Picks survive tab changes; per-tab browsing state resets */
  const switchTab = (
    tab: TabId,
    query?: { queryTab?: QueryTabKey; querySubTab?: QuerySubTabKey },
  ): void => {
    setActiveTab(tab);
    setFavActiveGroup(null);
    setFavActiveSubGroup(null);
    setExpandedFavItems(new Set());
    setIncludeSubItems(new Set());
    setAssetCategory(null);
    setQueryTab(query?.queryTab || "financials");
    setQuerySubTab(query?.querySubTab || "priceConsulting");
    setQueryPage(0);
    setQueryFilters([{ id: "f1", column: "", value: "" }]);
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  // ── Keyboard: Escape clears the active tab's search first, then closes ──
  const searchRef = React.useRef(search);
  searchRef.current = search;
  const activeTabRef = React.useRef(activeTab);
  activeTabRef.current = activeTab;
  // PhotoLightbox handles its own Escape
  const lightboxOpenRef = React.useRef(false);
  lightboxOpenRef.current = !!previewPhotoUrl;
  React.useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key !== "Escape" || lightboxOpenRef.current) return;
      if (searchRef.current) {
        setSearchFor(activeTabRef.current, "");
        if (searchInputRef.current) searchInputRef.current.focus();
        return;
      }
      onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  /* ──────── Helpers ──────── */

  const lowerSearch = search.toLowerCase().trim();
  const searchWords = toWords(search);

  const matchesSearch = (...fields: string[]): boolean =>
    matchesWords(searchWords, fields);

  /* ──────── All Sources search (only runs on that tab) ──────── */

  const globalWords = React.useMemo(
    () => toWords(debouncedGlobal),
    [debouncedGlobal],
  );
  const globalActive =
    activeTab === "all" && debouncedGlobal.trim().length >= MIN_GLOBAL_CHARS;
  const isDebouncing = searches.all.trim() !== debouncedGlobal.trim();

  const sortedQuotations = React.useMemo(
    () =>
      (quotations || []).slice().sort((a, b) => quoteTime(b) - quoteTime(a)),
    [quotations],
  );

  const favGroupNames = React.useMemo(() => {
    const map: Record<string, string> = {};
    groups.forEach((g) => (map[g.id] = g.name));
    return map;
  }, [groups]);

  const globalSections = React.useMemo<IGlobalSection[] | null>(() => {
    if (!globalActive) return null;
    return searchAllSources({
      words: globalWords,
      favorites: favAllEquipment,
      favGroupNames,
      assets: assetItems,
      bom: bomAnalyses,
      quotations: sortedQuotations,
      catalog: catalogData,
      loading: {
        favorites: favIsLoading,
        assets: assetsLoading,
        bom: bomLoading,
        quotations: quotationsLoading,
        query: catalogLoading,
      },
    });
  }, [
    globalActive,
    globalWords,
    favData,
    favGroupNames,
    assetItems,
    bomAnalyses,
    sortedQuotations,
    catalogData,
    favIsLoading,
    assetsLoading,
    bomLoading,
    quotationsLoading,
    catalogLoading,
  ]);

  // Query Consulting's own search drives the counters on its source / view tabs
  const queryWords = React.useMemo(
    () => toWords(debouncedQuery),
    [debouncedQuery],
  );
  const querySections = React.useMemo<IGlobalSection[] | null>(() => {
    if (
      activeTab !== "query" ||
      debouncedQuery.trim().length < MIN_GLOBAL_CHARS
    )
      return null;
    return searchQueryViews(queryWords, catalogData, catalogLoading);
  }, [activeTab, debouncedQuery, queryWords, catalogData, catalogLoading]);

  /** Aggregated hit count of the matching sections (undefined when there is no search) */
  const countIn = (
    sections: IGlobalSection[] | null,
    match: (s: IGlobalSection) => boolean,
  ): { count: number; capped: boolean; loading: boolean } | undefined => {
    if (!sections) return undefined;
    let count = 0;
    let capped = false;
    let loading = false;
    sections.forEach((s) => {
      if (!match(s)) return;
      count += s.count;
      capped = capped || s.capped;
      loading = loading || s.loading;
    });
    return { count, capped, loading };
  };

  const renderCountBadge = (
    c: { count: number; capped: boolean; loading: boolean } | undefined,
    max: number = 99,
    title?: string,
  ): JSX.Element | null => {
    if (!c || (c.loading && c.count === 0)) return null;
    return (
      <span
        className={`${styles.countBadge}${c.count === 0 ? ` ${styles.countBadgeEmpty}` : ""}`}
        title={title}
      >
        {formatCount(c.count, c.capped, max)}
      </span>
    );
  };

  const pickKey = (pn: string, desc: string): string => `${pn}||${desc}`;

  const isRowSelected = (pn: string, desc: string): boolean => {
    if (multiSelect) {
      const key = pickKey(pn, desc);
      return selectedMany.some(
        (p) => pickKey(p.partNumber, p.description) === key,
      );
    }
    return selectedItem?.pn === pn && selectedItem?.desc === desc;
  };

  const blockReason = (pn: string, desc: string): string | undefined =>
    getPickBlockReason ? getPickBlockReason(pn, desc) : undefined;

  /** Selected / blocked modifier appended to a result row's class */
  const rowStateClass = (pn: string, desc: string): string => {
    if (isRowSelected(pn, desc)) return ` ${styles.resultRowSelected}`;
    return blockReason(pn, desc) ? ` ${styles.resultRowBlocked}` : "";
  };

  const togglePick = (
    pn: string,
    desc: string,
    subs?: IImportSubItem[],
  ): void => {
    if (blockReason(pn, desc)) return;
    const key = pickKey(pn, desc);
    setSelectedMany((prev) =>
      prev.some((p) => pickKey(p.partNumber, p.description) === key)
        ? prev.filter((p) => pickKey(p.partNumber, p.description) !== key)
        : [...prev, { partNumber: pn, description: desc, subItems: subs }],
    );
  };

  const handleConfirm = (): void => {
    if (multiSelect) {
      if (selectedMany.length > 0 && onSelectMany) onSelectMany(selectedMany);
      return;
    }
    if (selectedItem && onSelect) {
      onSelect(selectedItem.pn, selectedItem.desc, selectedItem.subs);
    }
  };

  const handleItemClick = (
    pn: string,
    desc: string,
    subs?: IImportSubItem[],
  ): void => {
    if (multiSelect) {
      togglePick(pn, desc, subs);
      return;
    }
    if (blockReason(pn, desc)) return;
    setSelectedItem({ pn, desc, subs });
  };

  const handleItemDoubleClick = (
    pn: string,
    desc: string,
    subs?: IImportSubItem[],
  ): void => {
    // In multi mode the two click events already toggled the row back and forth
    if (multiSelect || blockReason(pn, desc)) return;
    if (onSelect) onSelect(pn, desc, subs);
  };

  /** Trailing cell of every result row: a checkbox in multi mode, instant-select button otherwise */
  const renderSelectCell = (
    pn: string,
    desc: string,
    subs?: IImportSubItem[],
  ): JSX.Element => {
    const blocked = blockReason(pn, desc);
    if (blocked) {
      return (
        <div className={styles.colAction}>
          <span
            className={styles.blockedMark}
            title={blocked}
            aria-label={blocked}
          >
            {LockIcon}
          </span>
        </div>
      );
    }
    return (
      <div className={styles.colAction}>
        {multiSelect ? (
          <input
            type="checkbox"
            className={styles.rowCheckbox}
            checked={isRowSelected(pn, desc)}
            onClick={(e) => e.stopPropagation()}
            onChange={() => togglePick(pn, desc, subs)}
            title="Select"
            aria-label={`Select ${pn || desc}`}
          />
        ) : (
          <button
            type="button"
            className={styles.selectBtn}
            onClick={(e) => {
              e.stopPropagation();
              if (onSelect) onSelect(pn, desc, subs);
            }}
            title="Import this item"
            aria-label={`Import ${pn || desc}`}
          >
            {CheckIcon}
          </button>
        )}
      </div>
    );
  };

  const renderLoading = (label: string): JSX.Element => (
    <div className={styles.loadingState} aria-busy="true">
      <span className={styles.loadingLabel}>{label}</span>
      <SkeletonLoader count={6} height={34} borderRadius={8} />
    </div>
  );

  const renderEmpty = (
    title: string,
    description?: string,
    icon: JSX.Element = SearchIcon,
  ): JSX.Element => (
    <EmptyState
      title={title}
      description={description}
      icon={<span className={styles.emptyIcon}>{icon}</span>}
      className={styles.emptyState}
    />
  );

  const renderListHint = (shown: number, total: number): JSX.Element | null =>
    total > shown ? (
      <div className={styles.listHint}>
        Showing {shown} of {total.toLocaleString()} items - refine your search
        to narrow the list.
      </div>
    ) : null;

  /** Get child equipment items for a parent favorite */
  const getChildEquipment = (parentId: string): IFavoriteEquipment[] => {
    return favAllEquipment.filter((e) => e.parentId === parentId);
  };

  /** Build sub-item payloads for a parent favorite */
  const buildSubItems = (parentId: string): IImportSubItem[] => {
    return getChildEquipment(parentId).map((c) => ({
      partNumber: c.partNumber,
      description: c.description,
    }));
  };

  /** Toggle expand/collapse for a favorite item's sub-items */
  const toggleExpandFavItem = (id: string): void => {
    setExpandedFavItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /** Toggle whether sub-items should be included in the import */
  const toggleIncludeSubItems = (id: string): void => {
    setIncludeSubItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /* ──────── Tab: Favorites ──────── */

  const renderFavorites = (): JSX.Element => {
    if (favIsLoading) return renderLoading("Loading favorites...");
    if (!favData || groups.length === 0)
      return renderEmpty(
        "No favorite groups found",
        "Favorite groups are managed in System Configuration.",
        StarIcon,
      );

    const activeGroupObj = groups.find((g) => g.id === favActiveGroup);
    const subGroups = activeGroupObj?.subGroups || [];
    // Typing without a group selected searches every group
    const searchingAllGroups = !favActiveGroup && !!lowerSearch;

    // Get parent-only equipment (no parentId)
    let equipment: IFavoriteEquipment[] = [];
    if (favActiveGroup) {
      equipment = getEquipmentByGroup(
        favActiveGroup,
        favActiveSubGroup || undefined,
      ).filter((e) => !e.parentId);
    } else if (searchingAllGroups) {
      equipment = favAllEquipment.filter((e) => !e.parentId);
    }

    // Filter by search
    if (lowerSearch) {
      equipment = equipment.filter((e) =>
        matchesSearch(e.partNumber, e.description),
      );
    }

    return (
      <div className={styles.favLayout}>
        {/* Group sidebar */}
        <div className={styles.favSidebar}>
          <div className={styles.favSidebarTitle}>Groups</div>
          <div className={styles.favGroupList}>
            {groups.map((g) => {
              const count = getGroupItemCount(g.id);
              const isActive = favActiveGroup === g.id;
              return (
                <button
                  type="button"
                  key={g.id}
                  className={`${styles.favGroupItem}${isActive ? ` ${styles.favGroupActive}` : ""}`}
                  onClick={() => setFavActiveGroup(isActive ? null : g.id)}
                  aria-pressed={isActive}
                >
                  <span className={styles.favGroupIcon}>{FolderIcon}</span>
                  <span className={styles.favGroupName}>{g.name}</span>
                  <span className={styles.favCount}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className={styles.favContent}>
          {!favActiveGroup && !searchingAllGroups ? (
            renderEmpty(
              "Select a group",
              "Pick a group on the left to browse its equipment, or type above to search all groups.",
              FolderIcon,
            )
          ) : (
            <>
              {searchingAllGroups && (
                <div className={styles.listHint}>
                  Searching all groups. Select a group to narrow the results.
                </div>
              )}
              {/* Sub-group chips */}
              {subGroups.length > 0 && (
                <div className={styles.subGroupChips}>
                  <button
                    type="button"
                    className={`${styles.chip}${!favActiveSubGroup ? ` ${styles.chipActive}` : ""}`}
                    onClick={() => setFavActiveSubGroup(null)}
                  >
                    All
                  </button>
                  {subGroups.map((sg) => {
                    const sgCount = getSubGroupItemCount(sg.id);
                    return (
                      <button
                        type="button"
                        key={sg.id}
                        className={`${styles.chip}${favActiveSubGroup === sg.id ? ` ${styles.chipActive}` : ""}`}
                        onClick={() => setFavActiveSubGroup(sg.id)}
                      >
                        {sg.name}
                        <span className={styles.chipCount}>{sgCount}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Equipment list */}
              {equipment.length === 0 ? (
                lowerSearch ? (
                  renderEmpty(
                    "No matches found",
                    "Try another part number or description.",
                  )
                ) : (
                  renderEmpty("No equipment in this group", undefined, StarIcon)
                )
              ) : (
                <div className={styles.resultTable}>
                  <div className={styles.resultHeader}>
                    <div className={styles.colExpand}></div>
                    <div className={styles.colPhoto}></div>
                    <div className={styles.colPn}>Part Number</div>
                    <div className={styles.colDesc}>Description</div>
                    <div className={styles.colAction}></div>
                  </div>
                  {equipment.map((eq) => {
                    const children = getChildEquipment(eq.id);
                    const hasChildren = children.length > 0;
                    const isExpanded = expandedFavItems.has(eq.id);
                    const subsIncluded = includeSubItems.has(eq.id);
                    const isSelected = isRowSelected(
                      eq.partNumber,
                      eq.description,
                    );

                    const subsPayload = subsIncluded
                      ? buildSubItems(eq.id)
                      : undefined;

                    return (
                      <React.Fragment key={eq.id}>
                        <div
                          className={`${styles.resultRow}${rowStateClass(eq.partNumber, eq.description)}${hasChildren ? ` ${styles.resultRowHasChildren}` : ""}`}
                          onClick={() =>
                            handleItemClick(
                              eq.partNumber,
                              eq.description,
                              subsPayload,
                            )
                          }
                          onDoubleClick={() =>
                            handleItemDoubleClick(
                              eq.partNumber,
                              eq.description,
                              subsPayload,
                            )
                          }
                        >
                          <div className={styles.colExpand}>
                            {hasChildren && (
                              <button
                                type="button"
                                className={`${styles.expandBtn}${isExpanded ? ` ${styles.expandBtnOpen}` : ""}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpandFavItem(eq.id);
                                }}
                                title={
                                  isExpanded
                                    ? "Collapse sub-items"
                                    : "Show sub-items"
                                }
                                aria-expanded={isExpanded}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  width="12"
                                  height="12"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className={styles.colPhoto}>
                            {(() => {
                              const photoUrl = getFavPhotoUrl(eq);
                              return photoUrl ? (
                                <img
                                  className={styles.favThumb}
                                  src={photoUrl}
                                  alt=""
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewPhotoUrl(photoUrl);
                                  }}
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                  }}
                                />
                              ) : null;
                            })()}
                          </div>
                          <div className={`${styles.colPn} ${styles.mono}`}>
                            {eq.partNumber || "-"}
                          </div>
                          <div className={styles.colDesc}>
                            {eq.description || "-"}
                            {searchingAllGroups &&
                              favGroupNames[eq.groupId] && (
                                <span className={styles.metaChip}>
                                  {favGroupNames[eq.groupId]}
                                </span>
                              )}
                            {hasChildren && (
                              <span className={styles.childBadge}>
                                {children.length} sub-item
                                {children.length > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                          {renderSelectCell(
                            eq.partNumber,
                            eq.description,
                            subsPayload,
                          )}
                        </div>

                        {/* Sub-items expansion */}
                        {hasChildren && isExpanded && (
                          <div className={styles.subItemsBlock}>
                            <div className={styles.subItemsHeader}>
                              <label className={styles.subItemsCheck}>
                                <input
                                  type="checkbox"
                                  checked={subsIncluded}
                                  onChange={() => {
                                    toggleIncludeSubItems(eq.id);
                                    const nextSubs = !subsIncluded
                                      ? buildSubItems(eq.id)
                                      : undefined;
                                    // Keep an already-made selection in sync with the new payload
                                    if (multiSelect) {
                                      const key = pickKey(
                                        eq.partNumber,
                                        eq.description,
                                      );
                                      setSelectedMany((prev) =>
                                        prev.map((p) =>
                                          pickKey(
                                            p.partNumber,
                                            p.description,
                                          ) === key
                                            ? { ...p, subItems: nextSubs }
                                            : p,
                                        ),
                                      );
                                    } else if (isSelected) {
                                      setSelectedItem({
                                        pn: eq.partNumber,
                                        desc: eq.description,
                                        subs: nextSubs,
                                      });
                                    }
                                  }}
                                />
                                <span>Include sub-items in import</span>
                              </label>
                            </div>
                            {children.map((child) => (
                              <div key={child.id} className={styles.subItemRow}>
                                <div className={styles.subItemIndent}>↳</div>
                                <div
                                  className={`${styles.colPn} ${styles.mono}`}
                                >
                                  {child.partNumber || "-"}
                                </div>
                                <div className={styles.colDesc}>
                                  {child.description || "-"}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  /* ──────── Tab: BOM Costs ──────── */

  const renderBomCosts = (): JSX.Element => {
    if (bomLoading) return renderLoading("Loading BOM analyses...");

    if (bomAnalyses.length === 0)
      return renderEmpty(
        "No saved BOM analyses",
        "Analyses saved from BOM Costs will show up here.",
        CubeIcon,
      );

    // Filter by search
    let filtered = bomAnalyses;
    if (lowerSearch) {
      filtered = bomAnalyses.filter((a) =>
        matchesSearch(a.mainPartNumber, a.mainDescription),
      );
    }

    if (filtered.length === 0)
      return renderEmpty(
        "No BOM analyses match your search",
        "Try another part number or description.",
      );

    return (
      <div className={styles.tabBody}>
        <div className={styles.resultTable}>
          <div className={styles.resultHeader}>
            <div className={styles.colPn}>Part Number</div>
            <div className={styles.colDesc}>Description</div>
            <div className={styles.colAction}></div>
          </div>
          {filtered.map((a) => {
            return (
              <div
                key={a.id}
                className={`${styles.resultRow}${rowStateClass(a.mainPartNumber, a.mainDescription)}`}
                onClick={() =>
                  handleItemClick(a.mainPartNumber, a.mainDescription)
                }
                onDoubleClick={() =>
                  handleItemDoubleClick(a.mainPartNumber, a.mainDescription)
                }
              >
                <div className={`${styles.colPn} ${styles.mono}`}>
                  {a.mainPartNumber || "-"}
                </div>
                <div className={styles.colDesc}>{a.mainDescription || "-"}</div>
                {renderSelectCell(a.mainPartNumber, a.mainDescription)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ──────── Tab: Quotations ──────── */

  const renderQuotations = (): JSX.Element => {
    if (quotationsLoading) return renderLoading("Loading quotations...");

    let filtered: IQuotationItem[] = sortedQuotations;
    if (lowerSearch) {
      filtered = filtered.filter((q) =>
        matchesSearch(
          q.partNumber,
          q.description,
          q.supplier || "",
          q.quotationDate ? formatDate(q.quotationDate) : "",
        ),
      );
    }

    if (filtered.length === 0)
      return lowerSearch
        ? renderEmpty(
            "No quotations match your search",
            "Search by part number, description, supplier or date.",
          )
        : renderEmpty("No quotations available", undefined, FileTextIcon);

    return (
      <div className={styles.tabBody}>
        <div className={styles.resultTable}>
          <div className={styles.resultHeader}>
            <div className={styles.colPn}>Part Number</div>
            <div className={styles.colDesc}>Description</div>
            <div className={styles.colSupplier}>Supplier</div>
            <div className={styles.colDate} title="Quotation date">
              Date
            </div>
            <div className={styles.colAction}></div>
          </div>
          {filtered.slice(0, QUOTATIONS_LIMIT).map((q) => {
            return (
              <div
                key={q.id}
                className={`${styles.resultRow}${rowStateClass(q.partNumber, q.description)}`}
                onClick={() => handleItemClick(q.partNumber, q.description)}
                onDoubleClick={() =>
                  handleItemDoubleClick(q.partNumber, q.description)
                }
              >
                <div className={`${styles.colPn} ${styles.mono}`}>
                  {q.partNumber || "-"}
                </div>
                <div className={styles.colDesc}>{q.description || "-"}</div>
                <div className={styles.colSupplier} title={q.supplier || ""}>
                  {q.supplier || "-"}
                </div>
                <div className={styles.colDate}>
                  {formatDate(q.quotationDate)}
                </div>
                {renderSelectCell(q.partNumber, q.description)}
              </div>
            );
          })}
        </div>
        {renderListHint(QUOTATIONS_LIMIT, filtered.length)}
      </div>
    );
  };

  /* ──────── Tab: Query Consulting ──────── */

  /** Build photo URL for a part number */
  const getPhotoUrl = (pn: string): string => {
    if (!pn) return "";
    return `${SHAREPOINT_CONFIG.siteUrl}${SHAREPOINT_CONFIG.photosBaseUrl}/${encodeURIComponent(pn.trim())}.jpg`;
  };

  const renderQueryConsulting = (): JSX.Element => {
    if (catalogLoading) return renderLoading("Loading Query catalog...");

    // Raw data sources
    const rawFin = catalogData?.rawFinancials;
    const rawBumbl = catalogData?.rawBrazilBumbl;
    const rawBumbr = catalogData?.rawBrazilBumbr;
    const rawAR = catalogData?.rawActiveRegistered;
    const rawFinAR = catalogData?.rawFinancialsActiveRegistered;

    // Determine active dataset based on tab + subtab
    let activeHeaders: string[] = [];
    let activeRows: Record<string, any>[] = [];
    const isMultiFilter = querySubTab === "activeRegistered";
    const isFinancialsAR = queryTab === "financials" && isMultiFilter;

    if (isFinancialsAR) {
      activeHeaders = rawFinAR?.headers || [];
      activeRows = rawFinAR?.rows || [];
    } else if (queryTab === "financials") {
      activeHeaders = rawFin?.headers || [];
      activeRows = rawFin?.rows || [];
    } else {
      if (querySubTab === "priceConsulting") {
        activeHeaders = rawBumbl?.headers || [];
        const bumblRows = rawBumbl?.rows || [];
        const bumbrRows = rawBumbr?.rows || [];
        activeRows = bumblRows.concat(bumbrRows);
      } else {
        // Active Registered
        activeHeaders = rawAR?.headers || [];
        activeRows = rawAR?.rows || [];
      }
    }

    // Column keys
    const buColKey = activeHeaders[0] || "";
    const pnColKey = activeHeaders[1] || "";
    const descColKey = activeHeaders[2] || "";

    // Column filter options: Price Consulting has one filter, Active Registered up to 3
    const filterColOptions: { key: string; label: string }[] = [];
    if (isFinancialsAR) {
      // BUSINESS UNIT, PART NUMBER, DESCRIPTION, MFG NAME, MFG REF
      activeHeaders.slice(0, 5).forEach((h) => {
        if (h) filterColOptions.push({ key: h, label: h });
      });
    } else if (isMultiFilter) {
      if (activeHeaders[0])
        filterColOptions.push({
          key: activeHeaders[0],
          label: "BUSINESS UNIT",
        });
      if (activeHeaders[1])
        filterColOptions.push({ key: activeHeaders[1], label: "PART NUMBER" });
      if (activeHeaders[2])
        filterColOptions.push({ key: activeHeaders[2], label: "DESCRIPTION" });
      if (activeHeaders[13])
        filterColOptions.push({ key: activeHeaders[13], label: "MFG NAME" });
      if (activeHeaders[14])
        filterColOptions.push({ key: activeHeaders[14], label: "MFG REF." });
      if (activeHeaders[17])
        filterColOptions.push({ key: activeHeaders[17], label: "VENDOR" });
    } else {
      if (activeHeaders[1])
        filterColOptions.push({ key: activeHeaders[1], label: "PART NUMBER" });
      if (activeHeaders[2])
        filterColOptions.push({ key: activeHeaders[2], label: "DESCRIPTION" });
      if (queryTab === "brazil" && activeHeaders[17])
        filterColOptions.push({ key: activeHeaders[17], label: "VENDOR" });
    }

    // Filters reset on tab switch before the new headers exist — empty column = first option
    const defaultFilterCol = filterColOptions[0]?.key || "";

    // Filter rows: main search (PN or description) AND the column filters
    const activeFilters = queryFilters.filter((f) => f.value.trim() !== "");
    const useMainSearch = lowerSearch.length >= MIN_GLOBAL_CHARS;
    let filtered = activeRows;
    if (activeFilters.length > 0 || useMainSearch) {
      filtered = activeRows.filter((row) => {
        if (
          useMainSearch &&
          !matchesWords(searchWords, [
            `${row[pnColKey] ?? ""} ${row[descColKey] ?? ""}`,
          ])
        )
          return false;
        for (let j = 0; j < activeFilters.length; j++) {
          const cell = String(
            row[activeFilters[j].column || defaultFilterCol] || "",
          ).toLowerCase();
          const tokens = activeFilters[j].value
            .toLowerCase()
            .split(" ")
            .filter((t) => t.trim());
          for (let t = 0; t < tokens.length; t++) {
            if (cell.indexOf(tokens[t]) < 0) return false;
          }
        }
        return true;
      });
    }

    const totalFiltered = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / QUERY_PAGE_SIZE));
    const safePage = Math.min(queryPage, totalPages - 1);
    const pageStart = safePage * QUERY_PAGE_SIZE;
    const pageEnd = Math.min(pageStart + QUERY_PAGE_SIZE, totalFiltered);
    const pageRows = filtered.slice(pageStart, pageEnd);

    // Column definitions matching QueryConsultingPage
    type ColDef = { key: string; header: string; idx: number };
    let columnDefs: ColDef[] = [];
    if (isFinancialsAR) {
      columnDefs = [
        { key: buColKey, header: "BU", idx: 0 },
        { key: pnColKey, header: "PART NUMBER", idx: 1 },
        { key: descColKey, header: "DESCRIPTION", idx: 2 },
        { key: activeHeaders[3] || "", header: "MFG NAME", idx: 3 },
        { key: activeHeaders[4] || "", header: "MFG REF", idx: 4 },
        { key: activeHeaders[5] || "", header: "LAST ORDER DATE", idx: 5 },
      ].filter((c) => c.key);
    } else if (queryTab === "financials") {
      columnDefs = [
        { key: buColKey, header: "BU", idx: 0 },
        { key: pnColKey, header: "PART NUMBER", idx: 1 },
        { key: descColKey, header: "DESCRIPTION", idx: 2 },
        { key: activeHeaders[3] || "", header: "LAST ORDER DATE", idx: 3 },
        { key: activeHeaders[4] || "", header: "COST", idx: 4 },
        { key: activeHeaders[6] || "", header: "LEAD TIME", idx: 6 },
      ].filter((c) => c.key);
    } else if (querySubTab === "priceConsulting") {
      columnDefs = [
        { key: buColKey, header: "BU", idx: 0 },
        { key: pnColKey, header: "PART NUMBER", idx: 1 },
        { key: descColKey, header: "DESCRIPTION", idx: 2 },
        { key: activeHeaders[17] || "", header: "VENDOR", idx: 17 },
        { key: activeHeaders[25] || "", header: "LAST ORDER DATE", idx: 25 },
        { key: activeHeaders[27] || "", header: "LAST PRICE", idx: 27 },
      ].filter((c) => c.key);
    } else {
      // Active Registered Brazil
      columnDefs = [
        { key: buColKey, header: "BU", idx: 0 },
        { key: pnColKey, header: "PART NUMBER", idx: 1 },
        { key: descColKey, header: "DESCRIPTION", idx: 2 },
        { key: activeHeaders[3] || "", header: "QTY AVAIL", idx: 3 },
        { key: activeHeaders[4] || "", header: "QTY ON HAND", idx: 4 },
        { key: activeHeaders[7] || "", header: "LAST ORDER DATE", idx: 7 },
        { key: activeHeaders[13] || "", header: "MFG NAME", idx: 13 },
        { key: activeHeaders[14] || "", header: "MFG REF.", idx: 14 },
        { key: activeHeaders[17] || "", header: "VENDOR", idx: 17 },
      ].filter((c) => c.key);
    }

    // Multi-filter handlers
    const handleAddFilter = (): void => {
      if (queryFilters.length >= 3) return;
      const newF = {
        id: "f" + Date.now(),
        column: defaultFilterCol,
        value: "",
      };
      setQueryFilters([...queryFilters, newF]);
    };
    const handleRemoveFilter = (id: string): void => {
      const next = queryFilters.filter((f) => f.id !== id);
      setQueryFilters(next);
      setQueryPage(0);
    };
    const handleUpdateFilter = (
      id: string,
      col?: string,
      val?: string,
    ): void => {
      setQueryFilters(
        queryFilters.map((f) =>
          f.id === id
            ? {
                ...f,
                ...(col !== undefined && { column: col }),
                ...(val !== undefined && { value: val }),
              }
            : f,
        ),
      );
      setQueryPage(0);
    };

    const selectQueryTab = (tab: QueryTabKey): void => {
      setQueryTab(tab);
      setQuerySubTab("priceConsulting");
      setQueryPage(0);
      setQueryFilters([{ id: "f1", column: "", value: "" }]);
    };
    const selectQuerySubTab = (sub: QuerySubTabKey): void => {
      setQuerySubTab(sub);
      setQueryPage(0);
      setQueryFilters([{ id: "f1", column: "", value: "" }]);
    };
    const sourceLabel =
      QUERY_SOURCES.filter(([key]) => key === queryTab)[0]?.[1] || "";

    return (
      <div className={styles.queryLayout}>
        {/* Level 1: data source */}
        <div
          className={styles.querySourceTabs}
          role="tablist"
          aria-label="Data source"
        >
          {QUERY_SOURCES.map(([key, label]) => (
            <button
              type="button"
              role="tab"
              key={key}
              className={`${styles.querySourceTab}${queryTab === key ? ` ${styles.querySourceTabActive}` : ""}`}
              onClick={() => selectQueryTab(key)}
              aria-selected={queryTab === key}
            >
              <span className={styles.tabIcon}>{DatabaseIcon}</span>
              {label}
              {renderCountBadge(
                countIn(querySections, (s) => s.queryTab === key),
                99,
                QUERY_COUNT_TITLE,
              )}
            </button>
          ))}
        </div>

        {/* Level 2: views of the selected source, inside its panel */}
        <div className={styles.queryPanel} role="tabpanel">
          <div className={styles.queryViewRow}>
            <span className={styles.queryViewLabel}>
              {CornerDownRightIcon}
              {sourceLabel} views
            </span>
            <div
              className={styles.querySubTabs}
              role="tablist"
              aria-label={`${sourceLabel} views`}
            >
              {QUERY_VIEWS.map(([key, label]) => (
                <button
                  type="button"
                  role="tab"
                  key={key}
                  className={`${styles.querySubTab}${querySubTab === key ? ` ${styles.querySubTabActive}` : ""}`}
                  onClick={() => selectQuerySubTab(key)}
                  aria-selected={querySubTab === key}
                >
                  {label}
                  {renderCountBadge(
                    countIn(
                      querySections,
                      (s) => s.queryTab === queryTab && s.querySubTab === key,
                    ),
                    99,
                    QUERY_COUNT_TITLE,
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Column filters: one for Price Consulting, up to 3 for Active Registered */}
          <div className={styles.queryFilterBar}>
            <div className={styles.queryMultiFilterWrap}>
              {queryFilters.map((filter) => (
                <div key={filter.id} className={styles.queryMultiFilterRow}>
                  <select
                    className={styles.querySelect}
                    value={filter.column || defaultFilterCol}
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
                    className={styles.queryInput}
                    placeholder="Filter value..."
                    value={filter.value}
                    onChange={(e) =>
                      handleUpdateFilter(filter.id, undefined, e.target.value)
                    }
                    aria-label="Filter value"
                  />
                  {isMultiFilter && (
                    <button
                      type="button"
                      className={styles.queryRemoveBtn}
                      onClick={() => handleRemoveFilter(filter.id)}
                      disabled={queryFilters.length <= 1}
                      title="Remove filter"
                      aria-label="Remove filter"
                    >
                      {CloseIcon}
                    </button>
                  )}
                </div>
              ))}
              {isMultiFilter && queryFilters.length < 3 && (
                <button
                  type="button"
                  className={styles.queryAddFilterBtn}
                  onClick={handleAddFilter}
                >
                  + Add Filter
                </button>
              )}
            </div>
            <span className={styles.queryResultCount}>
              {totalFiltered.toLocaleString()} result
              {totalFiltered !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Data table */}
          {totalFiltered === 0 ? (
            renderEmpty(
              "No results found",
              "Try another term, or switch the data source or view above.",
            )
          ) : (
            <div className={styles.queryTableWrap}>
              <div className={styles.queryTable}>
                <div className={styles.queryTableHeader}>
                  <div className={styles.queryColPhoto}></div>
                  {columnDefs.map((col) => (
                    <div
                      key={col.key}
                      className={
                        col.idx === 2
                          ? styles.queryColDesc
                          : styles.queryColCell
                      }
                    >
                      {col.header}
                    </div>
                  ))}
                  <div className={styles.colAction}></div>
                </div>
                {pageRows.map((row, i) => {
                  const pn = String(row[pnColKey] || "").trim();
                  const desc = String(row[descColKey] || "").trim();
                  const photoUrl = pn ? getPhotoUrl(pn) : "";
                  return (
                    <div
                      key={`q-${pageStart + i}`}
                      className={`${styles.queryTableRow}${rowStateClass(pn, desc)}`}
                      onClick={() => handleItemClick(pn, desc)}
                      onDoubleClick={() => handleItemDoubleClick(pn, desc)}
                    >
                      <div className={styles.queryColPhoto}>
                        {photoUrl && (
                          <img
                            className={styles.queryThumb}
                            src={photoUrl}
                            alt=""
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewPhotoUrl(photoUrl);
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}
                      </div>
                      {columnDefs.map((col) => (
                        <div
                          key={col.key}
                          className={
                            col.idx === 2
                              ? styles.queryColDesc
                              : col.idx === 1
                                ? `${styles.queryColCell} ${styles.mono}`
                                : styles.queryColCell
                          }
                        >
                          {String(row[col.key] ?? "")}
                        </div>
                      ))}
                      {renderSelectCell(pn, desc)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalFiltered > QUERY_PAGE_SIZE && (
            <div className={styles.queryPagination}>
              <button
                type="button"
                className={styles.queryPageBtn}
                disabled={safePage === 0}
                onClick={() => setQueryPage(0)}
                aria-label="First page"
              >
                ««
              </button>
              <button
                type="button"
                className={styles.queryPageBtn}
                disabled={safePage === 0}
                onClick={() => setQueryPage(safePage - 1)}
                aria-label="Previous page"
              >
                «
              </button>
              <span className={styles.queryPageInfo}>
                Page {safePage + 1} of {totalPages}
              </span>
              <button
                type="button"
                className={styles.queryPageBtn}
                disabled={safePage >= totalPages - 1}
                onClick={() => setQueryPage(safePage + 1)}
                aria-label="Next page"
              >
                »
              </button>
              <button
                type="button"
                className={styles.queryPageBtn}
                disabled={safePage >= totalPages - 1}
                onClick={() => setQueryPage(totalPages - 1)}
                aria-label="Last page"
              >
                »»
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ──────── Tab: Assets Catalog ──────── */

  const renderAssetsCatalog = (): JSX.Element => {
    if (assetsLoading) return renderLoading("Loading assets catalog...");
    if (assetItems.length === 0)
      return renderEmpty("No assets found", undefined, PackageIcon);

    // Filter items by selected category and search
    let filtered = assetItems;
    if (assetCategory) {
      filtered = filtered.filter((item) => item.keyword === assetCategory);
    }
    if (lowerSearch) {
      filtered = filtered.filter((item) =>
        matchesSearch(item.pn || "", item.title || item.description || ""),
      );
    }

    return (
      <div className={styles.favLayout}>
        {/* Category sidebar */}
        <div className={styles.favSidebar}>
          <div className={styles.favSidebarTitle}>Categories</div>
          <div className={styles.favGroupList}>
            <button
              type="button"
              className={`${styles.favGroupItem}${!assetCategory ? ` ${styles.favGroupActive}` : ""}`}
              onClick={() => setAssetCategory(null)}
              aria-pressed={!assetCategory}
            >
              <span className={styles.favGroupIcon}>{FolderIcon}</span>
              <span className={styles.favGroupName}>All</span>
              <span className={styles.favCount}>{assetItems.length}</span>
            </button>
            {assetCategories.map((cat) => {
              const count = assetItems.filter((i) => i.keyword === cat).length;
              return (
                <button
                  type="button"
                  key={cat}
                  className={`${styles.favGroupItem}${assetCategory === cat ? ` ${styles.favGroupActive}` : ""}`}
                  onClick={() => setAssetCategory(cat)}
                  aria-pressed={assetCategory === cat}
                >
                  <span className={styles.favGroupIcon}>{FolderIcon}</span>
                  <span className={styles.favGroupName}>{cat}</span>
                  <span className={styles.favCount}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className={styles.favContent}>
          {filtered.length === 0 ? (
            lowerSearch ? (
              renderEmpty(
                "No matches found",
                "Try another part number or description.",
              )
            ) : (
              renderEmpty("No assets in this category", undefined, PackageIcon)
            )
          ) : (
            <div className={styles.resultTable}>
              <div className={styles.resultHeader}>
                <div className={styles.colPhoto}></div>
                <div className={styles.colPn}>Part Number</div>
                <div className={styles.colDesc}>Description</div>
                <div className={styles.colDatasheet}>Datasheet</div>
                <div className={styles.colAction}></div>
              </div>
              {filtered.slice(0, ASSETS_LIMIT).map((item) => {
                return (
                  <div
                    key={item.id}
                    className={`${styles.resultRow}${rowStateClass(item.pn || "", item.title || item.description || "")}`}
                    onClick={() =>
                      handleItemClick(
                        item.pn || "",
                        item.title || item.description || "",
                      )
                    }
                    onDoubleClick={() =>
                      handleItemDoubleClick(
                        item.pn || "",
                        item.title || item.description || "",
                      )
                    }
                  >
                    <div className={styles.colPhoto}>
                      {item.imageUrl && (
                        <img
                          className={styles.favThumb}
                          src={item.imageUrl}
                          alt=""
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewPhotoUrl(item.imageUrl);
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                    </div>
                    <div className={`${styles.colPn} ${styles.mono}`}>
                      {item.pn || "-"}
                    </div>
                    <div className={styles.colDesc}>
                      {item.title || item.description || "-"}
                      {item.keyword && (
                        <span className={styles.metaChip}>{item.keyword}</span>
                      )}
                    </div>
                    <div className={styles.colDatasheet}>
                      {item.attachmentUrl && (
                        <a
                          className={styles.datasheetLink}
                          href={item.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title={item.attachmentFileName || "View datasheet"}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                          <span>PDF</span>
                        </a>
                      )}
                    </div>
                    {renderSelectCell(
                      item.pn || "",
                      item.title || item.description || "",
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {renderListHint(ASSETS_LIMIT, filtered.length)}
        </div>
      </div>
    );
  };

  /* ──────── Tab: All Sources ──────── */

  const renderAllSources = (): JSX.Element => {
    if (!globalSections) {
      return search.trim().length > 0 && search.trim().length < MIN_GLOBAL_CHARS
        ? renderEmpty("Keep typing", "Type at least 2 characters.")
        : renderEmpty(
            "Search every source at once",
            "Type a part number or description. Results update as you type and show which tab each match comes from.",
            LayersIcon,
          );
    }

    const withHits = globalSections.filter((s) => s.count > 0);
    const stillLoading = globalSections.filter(
      (s) => s.loading && s.count === 0,
    );
    // Query views share one label, so list them by path
    const sectionName = (s: IGlobalSection): string => s.path || s.label;
    const noHitNames: string[] = [];
    globalSections.forEach((s) => {
      if (!s.loading && s.count === 0) noHitNames.push(sectionName(s));
    });
    const total = countIn(globalSections, () => true);

    return (
      <div className={styles.allLayout} aria-live="polite">
        <div className={styles.allSummary}>
          <span>
            {total && total.count > 0 ? (
              <>
                <strong>
                  {formatCount(total.count, total.capped, GLOBAL_COUNT_CAP)}
                </strong>{" "}
                match{total.count !== 1 ? "es" : ""} in{" "}
                <strong>{withHits.length}</strong> source
                {withHits.length !== 1 ? "s" : ""}
              </>
            ) : (
              "No matches yet"
            )}
          </span>
          {isDebouncing && (
            <span className={styles.searchingTag}>Searching...</span>
          )}
        </div>

        {withHits.length === 0 &&
          stillLoading.length === 0 &&
          renderEmpty(
            "No matches found",
            "Try another part number or description.",
          )}

        {withHits.map((sec) => (
          <section key={sec.id} className={styles.allSection}>
            <header className={styles.allSectionHeader}>
              <span className={styles.allSectionIcon}>
                {TAB_BY_ID[sec.tab].icon}
              </span>
              <span className={styles.allSectionTitle}>{sec.label}</span>
              {sec.path && (
                <span className={styles.allSectionPath}>{sec.path}</span>
              )}
              {renderCountBadge(sec, GLOBAL_COUNT_CAP)}
              <button
                type="button"
                className={styles.viewAllBtn}
                onClick={() => {
                  switchTab(sec.tab, {
                    queryTab: sec.queryTab,
                    querySubTab: sec.querySubTab,
                  });
                  setSearchFor(sec.tab, searches.all);
                }}
                title={`Open ${sectionName(sec)} filtered by this search`}
              >
                {sec.count > sec.rows.length ? "View all" : "Open tab"}
                {ChevronRightIcon}
              </button>
            </header>
            <div className={styles.resultTable}>
              {sec.rows.map((r, i) => (
                <div
                  key={`${sec.id}-${i}`}
                  className={`${styles.resultRow}${rowStateClass(r.pn, r.desc)}`}
                  onClick={() => handleItemClick(r.pn, r.desc)}
                  onDoubleClick={() => handleItemDoubleClick(r.pn, r.desc)}
                >
                  <div className={`${styles.colPn} ${styles.mono}`}>
                    {r.pn ? highlight(r.pn, globalWords) : "-"}
                  </div>
                  <div className={styles.colDesc}>
                    {r.desc ? highlight(r.desc, globalWords) : "-"}
                    {r.meta && (
                      <span className={styles.metaChip}>{r.meta}</span>
                    )}
                  </div>
                  {renderSelectCell(r.pn, r.desc)}
                </div>
              ))}
            </div>
          </section>
        ))}

        {stillLoading.length > 0 && (
          <div className={styles.allFootnote}>
            Still loading: {stillLoading.map(sectionName).join(", ")}
          </div>
        )}
        {withHits.length > 0 && noHitNames.length > 0 && (
          <div className={styles.allFootnote}>
            No matches in: {noHitNames.join(", ")}
          </div>
        )}
      </div>
    );
  };

  /* ──────── Tab content renderer ──────── */

  const renderTabContent = (): JSX.Element => {
    switch (activeTab) {
      case "all":
        return renderAllSources();
      case "favorites":
        return renderFavorites();
      case "assets":
        return renderAssetsCatalog();
      case "bom":
        return renderBomCosts();
      case "quotations":
        return renderQuotations();
      case "query":
        return renderQueryConsulting();
      default:
        return <div />;
    }
  };

  /* ──────── Render ──────── */

  return (
    <>
      <div
        className={styles.overlay}
        onMouseDown={(e) => {
          overlayPressRef.current = e.target === e.currentTarget;
        }}
        onClick={(e) => {
          // Only a press that starts and ends on the backdrop closes (not a drag out of an input)
          if (overlayPressRef.current && e.target === e.currentTarget)
            onClose();
        }}
      >
        <div
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="equipment-import-title"
        >
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerMain}>
              <span className={styles.headerIcon}>{CubeIcon}</span>
              <div className={styles.headerText}>
                <div className={styles.titleRow}>
                  <h2 id="equipment-import-title" className={styles.title}>
                    {title ||
                      (multiSelect
                        ? "Add Items from Catalog"
                        : "Import Equipment")}
                  </h2>
                  {multiSelect && (
                    <span className={styles.headerBadge}>Multi-select</span>
                  )}
                </div>
                <p className={styles.subtitle}>
                  {subtitle ||
                    "Find equipment by part number or description across Favorites, Assets Catalog, BOM Costs, Quotations and Query Consulting."}
                </p>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              title="Close"
              aria-label="Close"
            >
              {CloseIcon}
            </button>
          </div>

          {/* Tab bar */}
          {visibleTabs.length > 1 && (
            <div className={styles.tabBar} role="tablist">
              {visibleTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    key={tab.id}
                    className={`${styles.tab}${isActive ? ` ${styles.tabActive}` : ""}`}
                    onClick={() => switchTab(tab.id)}
                  >
                    <span className={styles.tabIcon}>{tab.icon}</span>
                    <span>{tab.label}</span>
                    {renderCountBadge(
                      countIn(
                        globalSections,
                        (s) => tab.id === "all" || s.tab === tab.id,
                      ),
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Search bar */}
          <div className={styles.searchRow}>
            <div className={styles.searchBar}>
              <span className={styles.searchIcon}>{SearchIcon}</span>
              <input
                ref={searchInputRef}
                className={styles.searchInput}
                type="text"
                placeholder={SEARCH_PLACEHOLDERS[activeTab]}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={SEARCH_PLACEHOLDERS[activeTab].replace("...", "")}
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  className={styles.searchClear}
                  onClick={() => {
                    setSearch("");
                    if (searchInputRef.current) searchInputRef.current.focus();
                  }}
                  title="Clear search (Esc)"
                  aria-label="Clear search"
                >
                  {CloseIcon}
                </button>
              )}
              <span
                className={`${styles.searchScope}${activeTab === "all" ? ` ${styles.searchScopeAll}` : ""}`}
                title={
                  activeTab === "all"
                    ? "Searches every tab at once"
                    : "Filters only this tab"
                }
              >
                {activeTab === "all"
                  ? "All sources"
                  : `${TAB_BY_ID[activeTab].label} only`}
              </span>
            </div>
          </div>

          {/* Tab content */}
          <div className={styles.body}>{renderTabContent()}</div>

          {/* Footer */}
          <div className={styles.footer}>
            {multiSelect && selectedMany.length > 0 && (
              <div className={styles.selectedPreview}>
                <span className={styles.selectedLabel}>Selected:</span>
                <span className={styles.selectedCount}>
                  {selectedMany.length} item
                  {selectedMany.length > 1 ? "s" : ""}
                </span>
                <button
                  type="button"
                  className={styles.clearSelectionBtn}
                  onClick={() => setSelectedMany([])}
                >
                  Clear
                </button>
              </div>
            )}
            {!multiSelect && selectedItem && (
              <div className={styles.selectedPreview}>
                <span className={styles.selectedLabel}>Selected:</span>
                <span className={`${styles.selectedPn} ${styles.mono}`}>
                  {selectedItem.pn || "-"}
                </span>
                <span className={styles.selectedDesc}>
                  {selectedItem.desc || "-"}
                </span>
                {selectedItem.subs && selectedItem.subs.length > 0 && (
                  <span className={styles.selectedSubsBadge}>
                    +{selectedItem.subs.length} sub-item
                    {selectedItem.subs.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}
            {(multiSelect ? selectedMany.length === 0 : !selectedItem) && (
              <div className={styles.footerHint}>
                {multiSelect
                  ? visibleTabs.length > 1
                    ? "Tick items in any tab, then confirm to add them all at once."
                    : "Tick items, then confirm to add them all at once."
                  : "Click a row to select it, or double-click to import right away."}
              </div>
            )}
            <div className={styles.footerBtns}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmBtn}
                disabled={
                  multiSelect ? selectedMany.length === 0 : !selectedItem
                }
                onClick={handleConfirm}
              >
                {CheckIcon}
                <span>
                  {multiSelect && selectedMany.length > 0
                    ? `Confirm (${selectedMany.length})`
                    : "Confirm"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {previewPhotoUrl && (
        <PhotoLightbox
          url={previewPhotoUrl}
          onClose={() => setPreviewPhotoUrl(null)}
        />
      )}
    </>
  );
};
