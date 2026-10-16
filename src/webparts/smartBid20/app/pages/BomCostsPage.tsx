/**
 * BomCostsPage - BOM Cost Analysis tool.
 * Modes: List (saved analyses) -> Edit (hierarchical BOM tree with cost lookup).
 */
import * as React from "react";
import {
  ArrowDownAZ,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  ClipboardPaste,
  Clock,
  CornerDownRight,
  Download,
  DollarSign,
  ExternalLink,
  Eye,
  FileText,
  LayoutGrid,
  LayoutList,
  Paperclip,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { EmptyState } from "../components/common/EmptyState";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import {
  MultiSelectDropdown,
  MultiSelectOption,
} from "../components/insights/MultiSelectDropdown";
import { SegmentedControl } from "../components/insights/SegmentedControl";
import { AddQuotationModal } from "../components/bid/AddQuotationModal";
import { BomAnalysisCard } from "../components/bom/BomAnalysisCard";
import { BomQuotationPicker } from "../components/bom/BomQuotationPicker";
import { useQueryCatalogStore } from "../stores/useQueryCatalogStore";
import { useConfigStore } from "../stores/useConfigStore";
import { useQuotationStore } from "../stores/useQuotationStore";
import { useUIStore } from "../stores/useUIStore";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { usePageAccess } from "../hooks/usePageAccess";
import { useAccessLevel } from "../hooks/useAccessLevel";
import {
  IBomCostAnalysis,
  IBomCostItem,
  BomCostSource,
  IQuotationItem,
} from "../models";
import { BomCostAnalysisService } from "../services/BomCostAnalysisService";
import { QuotationService } from "../services/QuotationService";
import { SPService } from "../services/SPService";
import { ROUTES } from "../config/routes.config";
import { convertToUSD } from "../utils/costCalculations";
import { formatCurrency, formatDate } from "../utils/formatters";
import { parseBomCSV, parseBomExcel, emptyItem } from "../utils/bomParser";
import { searchablePartNumber } from "../utils/scopeHelpers";
import { exportBomCostsToExcel } from "../utils/bomExcelExport";
import {
  calcContingency,
  computeSmartTotal,
  dateAgeBucket,
  formatDateDMY,
  getAncestorIds,
  getBomCoverage,
  getDescendantIds,
  getMaxLeadTimeItem,
  getVisibleItems,
  hasChildren,
  recalcTotal,
  reassignFindNumbers,
  rollUpParentCosts,
} from "../utils/bomCostHelpers";
import styles from "./BomCostsPage.module.scss";

type PageMode = "list" | "edit";
type ListSort = "recent" | "az" | "cost";
type ListView = "grid" | "list";
type ListFacet = "status" | "creator";

interface IListRow {
  a: IBomCostAnalysis;
  costed: number;
  eligible: number;
  complete: boolean;
}

const STATUS_OPTIONS = [
  { value: "complete", label: "Complete", color: "var(--success)" },
  { value: "incomplete", label: "Incomplete", color: "var(--warning)" },
];

/** Time the Go to highlight stays on the row */
const FOCUS_MS = 2800;

function uid(): string {
  return (
    "ba_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).substring(2, 8)
  );
}

function srcClass(src: BomCostSource): string {
  switch (src) {
    case "BUMBL":
      return styles.srcBUMBL;
    case "BUMBR":
      return styles.srcBUMBR;
    case "Financials":
      return styles.srcFIN;
    case "manual":
      return styles.srcManual;
    case "QUOTATION":
      return styles.srcQuotation;
    default:
      return styles.srcNone;
  }
}

function srcLabel(src: BomCostSource, costRef: string): string {
  if (src === "BUMBL") return "BUMBL";
  if (src === "BUMBR") return "BUMBR";
  if (src === "Financials") return costRef || "FIN";
  if (src === "manual") return "Manual";
  if (src === "QUOTATION") return "Quotation";
  return "-";
}

function dateAgeClass(dateRef: string): string {
  const bucket = dateAgeBucket(dateRef);
  if (bucket === "old") return styles.dateOld;
  if (bucket === "warn") return styles.dateWarn;
  if (bucket === "recent") return styles.dateRecent;
  return "";
}

const HeaderIcon: React.FC = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="12" y2="14" />
  </svg>
);

const ViewerRow: React.FC<{
  label: string;
  value?: string;
  mono?: boolean;
}> = ({ label, value, mono }) => (
  <div className={styles.viewerRow}>
    <span className={styles.viewerLabel}>{label}</span>
    <span className={mono ? styles.viewerMono : styles.viewerValue}>
      {value || "-"}
    </span>
  </div>
);

export const BomCostsPage: React.FC = () => {
  const currentUser = useCurrentUser();
  const { canEdit } = usePageAccess();
  const { canEditPage, canViewPage } = useAccessLevel();
  const addToast = useUIStore((s) => s.addToast);
  const config = useConfigStore((s) => s.config);
  const exchangeRates = config?.currencySettings?.exchangeRates || [];

  const catalogLoaded = useQueryCatalogStore((s) => s.isLoaded);
  const catalogLoading = useQueryCatalogStore((s) => s.isLoading);
  const loadCatalog = useQueryCatalogStore((s) => s.loadCatalog);
  const searchBomCosts = useQueryCatalogStore((s) => s.searchBomCosts);

  const [mode, setMode] = React.useState<PageMode>("list");

  // ─── List mode state ───
  const [savedAnalyses, setSavedAnalyses] = React.useState<IBomCostAnalysis[]>(
    [],
  );
  const [listLoading, setListLoading] = React.useState(true);
  const [listSearch, setListSearch] = React.useState("");
  const [listStatuses, setListStatuses] = React.useState<string[]>([]);
  const [listCreators, setListCreators] = React.useState<string[]>([]);
  const [listSort, setListSort] = React.useState<ListSort>("recent");
  const [listView, setListView] = React.useState<ListView>("grid");
  const [deleteTarget, setDeleteTarget] =
    React.useState<IBomCostAnalysis | null>(null);

  const listRows = React.useMemo<IListRow[]>(
    () =>
      savedAnalyses.map((a) => {
        const c = getBomCoverage(a.items);
        return {
          a,
          costed: c.costed,
          eligible: c.eligible,
          complete: c.isComplete,
        };
      }),
    [savedAnalyses],
  );

  const creatorOf = (r: IListRow): string => r.a.createdBy || "-";
  const statusOf = (r: IListRow): string =>
    r.complete ? "complete" : "incomplete";

  /** Search + every filter except `skip`, so each dropdown counts against the others */
  const passesList = (r: IListRow, skip?: ListFacet): boolean => {
    if (listSearch.trim()) {
      const q = listSearch.trim().toLowerCase();
      const hay =
        `${r.a.mainPartNumber} ${r.a.mainDescription} ${r.a.revision} ${r.a.createdBy}`.toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    if (
      skip !== "status" &&
      listStatuses.length &&
      listStatuses.indexOf(statusOf(r)) < 0
    )
      return false;
    if (
      skip !== "creator" &&
      listCreators.length &&
      listCreators.indexOf(creatorOf(r)) < 0
    )
      return false;
    return true;
  };

  const listFacetCounts = React.useMemo(() => {
    const counts: Record<ListFacet, Record<string, number>> = {
      status: {},
      creator: {},
    };
    const bump = (k: ListFacet, v: string): void => {
      counts[k][v] = (counts[k][v] || 0) + 1;
    };
    listRows.forEach((r) => {
      if (passesList(r, "status")) bump("status", statusOf(r));
      if (passesList(r, "creator")) bump("creator", creatorOf(r));
    });
    return counts;
  }, [listRows, listSearch, listStatuses, listCreators]);

  const statusFacetOptions: MultiSelectOption[] = STATUS_OPTIONS.map((o) => ({
    ...o,
    count: listFacetCounts.status[o.value] || 0,
  }));

  const creatorFacetOptions = React.useMemo<MultiSelectOption[]>(() => {
    const seen: Record<string, true> = {};
    listRows.forEach((r) => {
      seen[creatorOf(r)] = true;
    });
    return Object.keys(seen)
      .sort((a, b) => a.localeCompare(b))
      .map((c) => ({
        value: c,
        label: c,
        count: listFacetCounts.creator[c] || 0,
      }));
  }, [listRows, listFacetCounts]);

  const filteredRows = React.useMemo(() => {
    const rows = listRows.filter((r) => passesList(r));
    rows.sort((x, y) => {
      if (listSort === "az") {
        return x.a.mainPartNumber.localeCompare(y.a.mainPartNumber, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      }
      if (listSort === "cost") {
        return (y.a.totalCostUSD || 0) - (x.a.totalCostUSD || 0);
      }
      return (y.a.lastModified || "").localeCompare(x.a.lastModified || "");
    });
    return rows;
  }, [listRows, listSearch, listStatuses, listCreators, listSort]);

  const hasListFilters =
    listSearch !== "" || listStatuses.length > 0 || listCreators.length > 0;
  const completeCount = listRows.filter((r) => r.complete).length;

  const clearListFilters = (): void => {
    setListSearch("");
    setListStatuses([]);
    setListCreators([]);
  };

  // ─── Edit mode state ───
  const [analysis, setAnalysis] = React.useState<IBomCostAnalysis | null>(null);
  const [items, setItems] = React.useState<IBomCostItem[]>([]);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearchedCosts, setHasSearchedCosts] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [contingencyPerYear, setContingencyPerYear] = React.useState(0);
  const [isContingencyEditing, setIsContingencyEditing] = React.useState(false);
  const [editingRows, setEditingRows] = React.useState<Set<string>>(new Set());
  const [showPasteModal, setShowPasteModal] = React.useState(false);
  const [pasteText, setPasteText] = React.useState("");
  const [deleteRowId, setDeleteRowId] = React.useState<string | null>(null);

  // Go to
  const [focus, setFocus] = React.useState<{
    id: string;
    nonce: number;
  } | null>(null);
  const [missingCursor, setMissingCursor] = React.useState(0);

  // Quotations
  const quotationItems = useQuotationStore((s) => s.items);
  const quotationsLoaded = useQuotationStore((s) => s.isLoaded);
  const loadQuotations = useQuotationStore((s) => s.loadQuotations);
  const [quotationTargetId, setQuotationTargetId] = React.useState<
    string | null
  >(null);
  const [recentQuotationIds, setRecentQuotationIds] = React.useState<string[]>(
    [],
  );
  const [viewingQuotation, setViewingQuotation] =
    React.useState<IQuotationItem | null>(null);
  const canCreateQuotation = canEdit && canEditPage("quotations");
  const canOpenQuotations = canViewPage("quotations");

  React.useEffect(() => {
    loadSavedAnalyses();
  }, []);

  const loadSavedAnalyses = async (): Promise<void> => {
    setListLoading(true);
    try {
      const data = await BomCostAnalysisService.getAll();
      setSavedAnalyses(data);
    } catch {
      setSavedAnalyses([]);
    }
    setListLoading(false);
  };

  // ─── Derived data ───
  const visibleItems = React.useMemo(
    () => getVisibleItems(items, expanded),
    [items, expanded],
  );
  const coverage = React.useMemo(() => getBomCoverage(items), [items]);
  const totalCost = React.useMemo(() => computeSmartTotal(items), [items]);
  const maxLeadTimeItem = React.useMemo(
    () => getMaxLeadTimeItem(items),
    [items],
  );
  const isComplete = coverage.isComplete;
  const missingIds = coverage.missingIds;

  const costRefBreakdown = React.useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      if (coverage.statuses.get(item.id) !== "costed" || !item.costReference)
        return;
      counts[item.costReference] = (counts[item.costReference] || 0) + 1;
    });
    return counts;
  }, [items, coverage]);

  const dateAgeSummary = React.useMemo(() => {
    let recent = 0;
    let warn = 0;
    let old = 0;
    items.forEach((item) => {
      if (!item.dateReference || coverage.statuses.get(item.id) !== "costed")
        return;
      const bucket = dateAgeBucket(item.dateReference);
      if (bucket === "recent") recent++;
      else if (bucket === "warn") warn++;
      else if (bucket === "old") old++;
    });
    const total = recent + warn + old;
    const pct = (n: number): number =>
      total > 0 ? Math.round((n / total) * 100) : 0;
    return { recent, warn, old, total, pct };
  }, [items, coverage]);

  const ratesDisplay = React.useMemo(() => {
    const rates = analysis?.currencyRatesUsed || {};
    return Object.keys(rates).map((currency) => ({
      currency,
      rate: rates[currency],
    }));
  }, [analysis?.currencyRatesUsed]);

  // ─── Go to ───
  const goToItem = (id: string): void => {
    const ancestors = getAncestorIds(id, items);
    setExpanded((prev) => {
      const next = new Set(prev);
      ancestors.forEach((a) => next.add(a));
      return next;
    });
    setFocus({ id, nonce: Date.now() });
  };

  React.useEffect(() => {
    if (!focus) return undefined;
    const scrollTimer = window.setTimeout(() => {
      const row = document.getElementById(`bom-row-${focus.id}`);
      if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    const clearTimer = window.setTimeout(() => setFocus(null), FOCUS_MS);
    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(clearTimer);
    };
  }, [focus]);

  const cursor = Math.min(missingCursor, Math.max(0, missingIds.length - 1));
  const stepMissing = (delta: number): void => {
    if (missingIds.length === 0) return;
    const next = (cursor + delta + missingIds.length) % missingIds.length;
    setMissingCursor(next);
    goToItem(missingIds[next]);
  };

  const openAnalysis = (
    a: IBomCostAnalysis,
    list: IBomCostItem[],
    searched: boolean,
  ): void => {
    setAnalysis(a);
    setItems(list);
    setHasSearchedCosts(searched);
    setContingencyPerYear(a.globalContingencyPerYear);
    setMissingCursor(0);
    setFocus(null);
    setEditingRows(new Set());
    const exp = new Set<string>();
    list.forEach((item) => {
      if (item.level <= 2 && hasChildren(item, list)) exp.add(item.id);
    });
    setExpanded(exp);
    setMode("edit");
  };

  // ─── File Import ───
  const handleFileImport = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    let parsed: IBomCostItem[] = [];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    try {
      if (ext === "csv") {
        parsed = await parseBomCSV(file);
      } else if (ext === "xlsx" || ext === "xls") {
        parsed = await parseBomExcel(file);
      }
    } catch (err) {
      addToast({
        type: "error",
        title: "Could not read the BOM file",
        message: err instanceof Error ? err.message : undefined,
      });
    }
    input.value = "";

    if (parsed.length === 0) return;
    parsed = reassignFindNumbers(parsed);

    const root = parsed[0];
    const newAnalysis: IBomCostAnalysis = {
      id: uid(),
      mainPartNumber: root.partNumber,
      mainDescription: root.description,
      revision: root.revision || "",
      analysisDate: new Date().toISOString(),
      createdBy: currentUser?.displayName || "",
      lastModified: new Date().toISOString(),
      isComplete: false,
      maxLeadTimeDays: 0,
      currencyRatesUsed: {},
      globalContingencyPerYear: 0,
      items: parsed,
      totalCostUSD: 0,
    };
    openAnalysis(newAnalysis, parsed, false);
  };

  const handleLoadAnalysis = (a: IBomCostAnalysis): void => {
    openAnalysis(
      a,
      reassignFindNumbers(a.items),
      a.items.some((i) => i.sourceTab !== "" || i.isManual),
    );
  };

  const handleConfirmDeleteAnalysis = async (): Promise<void> => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await BomCostAnalysisService.deleteOne(target.id);
      await loadSavedAnalyses();
      addToast({ type: "success", title: "Analysis deleted" });
    } catch (err) {
      addToast({
        type: "error",
        title: "Failed to delete analysis",
        message: SPService.errorMessage(err),
      });
    }
  };

  // ─── Cost Lookup ───
  const handleCostLookup = (): void => {
    if (!catalogLoaded && !catalogLoading) {
      loadCatalog();
      return;
    }
    if (!catalogLoaded) return;
    setIsSearching(true);

    setTimeout(() => {
      const ratesUsed: Record<string, number> = {};
      let updated = items.map((item) => {
        // Rolled-up parents are recalculated from their children
        const wasRolledUp = item.isRolledUp;
        const resetItem = { ...item, isRolledUp: false };
        if (wasRolledUp) {
          resetItem.costPerItemUSD = 0;
          resetItem.totalCostInclCont = 0;
          resetItem.sourceTab = "" as BomCostSource;
          resetItem.costReference = "";
          resetItem.comments = "";
        }

        // Manual and quotation prices are user decisions: the query never overwrites them
        if (
          (resetItem.isManual || resetItem.sourceTab === "QUOTATION") &&
          resetItem.costPerItemUSD > 0
        )
          return resetItem;

        const result = searchBomCosts(resetItem.partNumber, exchangeRates);
        if (!result.found) return resetItem;

        let costUSD = result.costPerItemUSD;
        if (
          (result.sourceTab === "BUMBL" || result.sourceTab === "BUMBR") &&
          result.currency === "BRL"
        ) {
          costUSD = convertToUSD(result.costPerItem, "BRL", exchangeRates);
          const brlRate = exchangeRates.find(
            (r) => r.currency.toUpperCase() === "BRL",
          );
          if (brlRate) ratesUsed["BRL"] = brlRate.rate;
        } else if (
          result.sourceTab === "Financials" &&
          result.currency !== "USD"
        ) {
          costUSD = convertToUSD(
            result.costPerItem,
            result.currency,
            exchangeRates,
          );
          const rate = exchangeRates.find(
            (r) => r.currency.toUpperCase() === result.currency.toUpperCase(),
          );
          if (rate) ratesUsed[result.currency] = rate.rate;
        }

        let costReference = result.sourceTab as string;
        if (result.sourceTab === "Financials") {
          costReference = result.businessUnit || "Financials";
        }

        const u: IBomCostItem = {
          ...resetItem,
          costPerItemUSD: costUSD,
          description: result.description || resetItem.description,
          leadTimeDays: result.leadTimeDays,
          costReference,
          dateReference: result.dataReference,
          sourceTab: result.sourceTab as BomCostSource,
          originalCurrency: result.currency,
          originalCost: result.costPerItem,
          isManual: false,
          isRolledUp: false,
          quotationItemId: undefined,
        };
        u.totalCostInclCont = recalcTotal(u);
        return u;
      });

      updated = rollUpParentCosts(updated);
      setItems(updated);
      setHasSearchedCosts(true);
      setMissingCursor(0);

      if (analysis) {
        setAnalysis({
          ...analysis,
          currencyRatesUsed: { ...analysis.currencyRatesUsed, ...ratesUsed },
          maxLeadTimeDays: Math.max(0, ...updated.map((i) => i.leadTimeDays)),
          totalCostUSD: computeSmartTotal(updated),
        });
      }

      setIsSearching(false);
    }, 50);
  };

  // ─── Apply contingency ───
  const handleApplyContingency = (): void => {
    const currentYear = new Date().getFullYear();
    let updated = items.map((item) => {
      if (item.isRolledUp) return item;
      const pct = calcContingency(
        item.dateReference,
        contingencyPerYear,
        currentYear,
      );
      const u = { ...item, contingencyPercent: pct };
      u.totalCostInclCont = recalcTotal(u);
      return u;
    });
    updated = rollUpParentCosts(updated);
    setItems(updated);
    setIsContingencyEditing(false);
    if (analysis) {
      setAnalysis({
        ...analysis,
        globalContingencyPerYear: contingencyPerYear,
        totalCostUSD: computeSmartTotal(updated),
      });
    }
  };

  // ─── Update single item field (re-rolls parent costs live) ───
  const updateItem = (id: string, patch: Partial<IBomCostItem>): void => {
    let updated = items.map((item) => {
      if (item.id !== id) return item;
      const u = { ...item, ...patch };
      // Editing the cost of a quotation row turns it into a manual price
      if (
        "costPerItemUSD" in patch &&
        !("sourceTab" in patch) &&
        item.sourceTab === "QUOTATION"
      ) {
        u.sourceTab = "manual";
        u.costReference = "Manual";
        u.isManual = true;
        u.quotationItemId = undefined;
      }
      if (
        "costPerItemUSD" in patch ||
        "qty" in patch ||
        "contingencyPercent" in patch
      ) {
        u.totalCostInclCont = recalcTotal(u);
      }
      return u;
    });
    updated = rollUpParentCosts(updated);
    setItems(updated);

    const target = updated.find((i) => i.id === id);
    if (target && target.level === 1 && analysis) {
      if ("partNumber" in patch || "description" in patch) {
        setAnalysis({
          ...analysis,
          mainPartNumber: target.partNumber,
          mainDescription: target.description,
        });
      }
    }
  };

  const toggleRowEdit = (id: string): void => {
    const next = new Set(editingRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setEditingRows(next);
  };

  // ─── Add new row ───
  const handleAddRow = (afterId: string, asChild: boolean): void => {
    const refItem = items.find((i) => i.id === afterId);
    if (!refItem) return;

    const newItem = emptyItem({
      level: asChild ? refItem.level + 1 : refItem.level,
      parentId: asChild ? refItem.id : refItem.parentId,
      isManual: true,
      sourceTab: "manual",
    });

    const refIdx = items.indexOf(refItem);
    let insertIdx = refIdx + 1;
    if (!asChild) {
      while (
        insertIdx < items.length &&
        items[insertIdx].level > refItem.level
      ) {
        insertIdx++;
      }
    }

    const newItems = [...items];
    newItems.splice(insertIdx, 0, newItem);
    let updated = reassignFindNumbers(newItems);
    updated = rollUpParentCosts(updated);
    setItems(updated);

    if (asChild) {
      const exp = new Set(expanded);
      exp.add(refItem.id);
      setExpanded(exp);
    }
    const ed = new Set(editingRows);
    ed.add(newItem.id);
    setEditingRows(ed);
  };

  // ─── Delete row (and descendants) ───
  const handleDeleteRow = (id: string): void => {
    const idsToDelete = new Set<string>(getDescendantIds(id, items));
    idsToDelete.add(id);
    const remaining = items.filter((i) => !idsToDelete.has(i.id));
    let updated = reassignFindNumbers(remaining);
    updated = rollUpParentCosts(updated);
    setItems(updated);
  };

  // ─── Paste multiple part numbers ───
  const handlePasteConfirm = (): void => {
    if (!pasteText.trim()) return;

    const lines = pasteText.split(/\r?\n/).filter((l) => l.trim() !== "");
    if (lines.length === 0) return;

    const root = items.find((i) => i.level === 1);
    const parentId = root ? root.id : "";
    const parentLevel = root ? root.level : 0;

    const newItems: IBomCostItem[] = [];
    lines.forEach((line) => {
      const cols = line
        .split("\t")
        .map((c) => c.trim())
        .filter(Boolean);
      let partNumber = "";
      let description = "";

      if (cols.length >= 3) {
        // Item# | Description | PN
        description = cols[1] || "";
        partNumber = cols[cols.length - 1] || "";
      } else if (cols.length === 2) {
        if (/^\d/.test(cols[1])) {
          description = cols[0];
          partNumber = cols[1];
        } else {
          partNumber = cols[0];
          description = cols[1];
        }
      } else {
        partNumber = cols[0] || line.trim();
      }

      if (!partNumber) return;

      newItems.push(
        emptyItem({
          level: parentLevel + 1,
          parentId: parentId,
          partNumber: partNumber,
          description: description,
          qty: 1,
          isManual: true,
          sourceTab: "manual",
        }),
      );
    });

    if (newItems.length === 0) return;

    let updated = reassignFindNumbers([...items, ...newItems]);
    updated = rollUpParentCosts(updated);
    setItems(updated);

    if (root) {
      const exp = new Set(expanded);
      exp.add(root.id);
      setExpanded(exp);
    }

    setShowPasteModal(false);
    setPasteText("");
  };

  // ─── Quotations ───
  const quotationTarget = quotationTargetId
    ? items.find((i) => i.id === quotationTargetId) || null
    : null;

  const handleOpenQuotations = (bomItemId: string): void => {
    if (!quotationsLoaded) loadQuotations();
    setQuotationTargetId(bomItemId);
  };

  const handleSelectQuotation = (q: IQuotationItem): void => {
    if (!quotationTarget) return;
    const targetId = quotationTarget.id;
    const costUSD =
      q.costUSD > 0
        ? q.costUSD
        : convertToUSD(q.cost, q.currency, exchangeRates);
    updateItem(targetId, {
      costPerItemUSD: costUSD,
      originalCost: q.cost,
      originalCurrency: q.currency,
      leadTimeDays: q.leadTimeDays,
      costReference: "QUOTATION",
      dateReference: q.quotationDate
        ? new Date(q.quotationDate).toISOString()
        : "",
      sourceTab: "QUOTATION" as BomCostSource,
      isManual: false,
      isRolledUp: false,
      quotationItemId: q.id,
      comments: `Quotation: ${q.supplier}${q.partNumber ? " - " + q.partNumber : ""}`,
    });
    setQuotationTargetId(null);
    addToast({
      type: "success",
      title: "Quotation applied",
      message: `${q.supplier} price set on ${quotationTarget.partNumber || "the item"}`,
    });
    goToItem(targetId);
  };

  const handleViewQuotation = (quotationItemId: string): void => {
    const q = quotationItems.find((qi) => qi.id === quotationItemId);
    if (q) setViewingQuotation(q);
  };

  const handleRemoveQuotation = (bomItemId: string): void => {
    updateItem(bomItemId, {
      costPerItemUSD: 0,
      totalCostInclCont: 0,
      originalCost: 0,
      originalCurrency: "",
      leadTimeDays: 0,
      costReference: "",
      dateReference: "",
      sourceTab: "" as BomCostSource,
      isManual: false,
      isRolledUp: false,
      quotationItemId: undefined,
      comments: "",
    });
  };

  // Opens in a new tab (AppLayout) so unsaved BOM edits are not lost
  const getQuotationHref = (q: IQuotationItem): string =>
    `${window.location.pathname}${window.location.search}#${ROUTES.quotations}?search=${encodeURIComponent(q.reference || q.partNumber)}`;

  // ─── Expand / Collapse ───
  const toggleExpand = (id: string): void => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  const expandAll = (): void => {
    const all = new Set<string>();
    items.forEach((item) => {
      if (hasChildren(item, items)) all.add(item.id);
    });
    setExpanded(all);
  };

  const collapseAll = (): void => {
    setExpanded(new Set());
  };

  // ─── Save ───
  const handleSave = async (): Promise<void> => {
    if (!analysis) return;
    setIsSaving(true);
    try {
      const toSave: IBomCostAnalysis = {
        ...analysis,
        items,
        totalCostUSD: totalCost,
        maxLeadTimeDays: Math.max(0, ...items.map((i) => i.leadTimeDays)),
        isComplete,
        lastModified: new Date().toISOString(),
        globalContingencyPerYear: contingencyPerYear,
      };
      await BomCostAnalysisService.saveOne(toSave);
      setAnalysis(toSave);
      await loadSavedAnalyses();
      addToast({ type: "success", title: "Analysis saved" });
    } catch (err) {
      console.error("Failed to save BOM analysis", err);
      addToast({
        type: "error",
        title: "Failed to save analysis",
        message: SPService.errorMessage(err),
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Export to Excel ───
  const handleExport = async (): Promise<void> => {
    if (!analysis || isExporting) return;
    setIsExporting(true);
    try {
      const name = await exportBomCostsToExcel({
        analysis,
        items,
        contingencyPerYear,
        exportedBy: currentUser?.displayName,
      });
      addToast({ type: "success", title: "Excel exported", message: name });
    } catch (err) {
      console.error("BOM export failed", err);
      addToast({
        type: "error",
        title: "Export failed",
        message: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleBack = (): void => {
    setMode("list");
    setAnalysis(null);
    setItems([]);
    setHasSearchedCosts(false);
    setFocus(null);
  };

  // ─── Create blank manual analysis ───
  const handleNewBlank = (): void => {
    const rootItem = emptyItem({
      level: 1,
      partNumber: "NEW-ASSEMBLY",
      description: "New assembly",
      qty: 1,
      isManual: true,
      sourceTab: "manual",
    });
    const newAnalysis: IBomCostAnalysis = {
      id: uid(),
      mainPartNumber: rootItem.partNumber,
      mainDescription: rootItem.description,
      revision: "",
      analysisDate: new Date().toISOString(),
      createdBy: currentUser?.displayName || "",
      lastModified: new Date().toISOString(),
      isComplete: false,
      maxLeadTimeDays: 0,
      currencyRatesUsed: {},
      globalContingencyPerYear: 0,
      items: [rootItem],
      totalCostUSD: 0,
    };
    openAnalysis(newAnalysis, [rootItem], true);
    setEditingRows(new Set([rootItem.id]));
  };

  // ═══════════════ Render: List Mode ═══════════════
  if (mode === "list") {
    return (
      <div className={styles.page}>
        <PageHeader
          title="BOM Costs"
          subtitle={`${listRows.length} analyses - ${completeCount} complete - ${listRows.length - completeCount} incomplete`}
          icon={<HeaderIcon />}
          actions={
            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.headerBtn}
                onClick={() => loadSavedAnalyses()}
                title="Reload analyses from SharePoint"
              >
                <RefreshCw size={15} /> Refresh
              </button>
              {canEdit && (
                <>
                  <label className={styles.headerBtn}>
                    <Upload size={15} /> Import BOM
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className={styles.hiddenInput}
                      onChange={handleFileImport}
                    />
                  </label>
                  <button
                    type="button"
                    className={styles.createBtn}
                    onClick={handleNewBlank}
                  >
                    + Manual BOM
                  </button>
                </>
              )}
            </div>
          }
        />

        <div className={styles.filterBar}>
          <div className={styles.filterSearch}>
            <Search size={15} className={styles.filterSearchIcon} />
            <input
              type="text"
              className={styles.filterSearchInput}
              placeholder="Search by part number, description, revision, author..."
              value={listSearch}
              onChange={(e) => setListSearch(e.currentTarget.value)}
              aria-label="Search analyses"
            />
            {listSearch && (
              <button
                type="button"
                className={styles.searchClearBtn}
                onClick={() => setListSearch("")}
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <MultiSelectDropdown
            label="Status"
            options={statusFacetOptions}
            selected={listStatuses}
            onChange={setListStatuses}
          />
          <MultiSelectDropdown
            label="Created by"
            options={creatorFacetOptions}
            selected={listCreators}
            onChange={setListCreators}
            searchable
          />
          {hasListFilters && (
            <button
              type="button"
              className={styles.clearFiltersBtn}
              onClick={clearListFilters}
            >
              <X size={14} /> Clear
            </button>
          )}
          <span className={styles.resultCount}>
            <strong>{filteredRows.length}</strong>
            {hasListFilters ? ` of ${listRows.length} ` : " "}
            {listRows.length === 1 ? "analysis" : "analyses"}
          </span>
          <SegmentedControl<ListSort>
            value={listSort}
            segments={[
              {
                value: "recent",
                label: "Recent",
                icon: <Clock size={14} />,
                title: "Most recently modified first",
              },
              {
                value: "az",
                label: "A-Z",
                icon: <ArrowDownAZ size={14} />,
                title: "Sort by part number",
              },
              {
                value: "cost",
                label: "Cost",
                icon: <DollarSign size={14} />,
                title: "Highest total cost first",
              },
            ]}
            onChange={setListSort}
            ariaLabel="Sort order"
          />
          <SegmentedControl<ListView>
            value={listView}
            segments={[
              { value: "grid", label: "Cards", icon: <LayoutGrid size={14} /> },
              { value: "list", label: "List", icon: <LayoutList size={14} /> },
            ]}
            onChange={setListView}
            ariaLabel="View"
          />
        </div>

        {listLoading ? (
          <div className={styles.cardsGrid}>
            {[0, 1, 2].map((i) => (
              <SkeletonLoader key={i} height={210} borderRadius={16} />
            ))}
          </div>
        ) : listRows.length === 0 ? (
          <EmptyState
            variant="glass"
            title="No BOM analyses yet"
            description="Import a CSV or XLSX Bill of Materials from Windchill, or start from scratch with a manual BOM."
            actionLabel={canEdit ? "+ Manual BOM" : undefined}
            onAction={canEdit ? handleNewBlank : undefined}
          />
        ) : filteredRows.length === 0 ? (
          <EmptyState
            variant="glass"
            title="No analyses match your filters"
            description="Try adjusting your search or filters."
            actionLabel="Clear filters"
            onAction={clearListFilters}
          />
        ) : listView === "grid" ? (
          <div className={styles.cardsGrid}>
            {filteredRows.map((r) => (
              <BomAnalysisCard
                key={r.a.id}
                analysis={r.a}
                costed={r.costed}
                eligible={r.eligible}
                isComplete={r.complete}
                onOpen={() => handleLoadAnalysis(r.a)}
                onDelete={canEdit ? () => setDeleteTarget(r.a) : undefined}
              />
            ))}
          </div>
        ) : (
          <div className={styles.listView}>
            <table className={styles.listTable}>
              <thead>
                <tr>
                  <th>Part Number</th>
                  <th>Description</th>
                  <th>Rev</th>
                  <th className={styles.thRight}>Items</th>
                  <th className={styles.thRight}>Costed</th>
                  <th className={styles.thRight}>Total (USD)</th>
                  <th className={styles.thRight}>Max LT</th>
                  <th>Status</th>
                  <th>Modified</th>
                  <th>By</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r) => (
                  <tr key={r.a.id} onClick={() => handleLoadAnalysis(r.a)}>
                    <td className={styles.listPN}>{r.a.mainPartNumber}</td>
                    <td className={styles.listDesc} title={r.a.mainDescription}>
                      {r.a.mainDescription || "-"}
                    </td>
                    <td>{r.a.revision || "-"}</td>
                    <td className={styles.tdRight}>{r.a.items.length}</td>
                    <td className={styles.tdRight}>
                      {r.costed} / {r.eligible}
                    </td>
                    <td className={styles.tdRight}>
                      {formatCurrency(r.a.totalCostUSD || 0, "USD")}
                    </td>
                    <td className={styles.tdRight}>
                      {r.a.maxLeadTimeDays > 0 ? `${r.a.maxLeadTimeDays}d` : "-"}
                    </td>
                    <td>
                      <span
                        className={`${styles.statusPill} ${r.complete ? styles.statusOk : styles.statusWarn}`}
                      >
                        {r.complete ? "Complete" : "Incomplete"}
                      </span>
                    </td>
                    <td>{formatDateDMY(r.a.lastModified)}</td>
                    <td>{r.a.createdBy || "-"}</td>
                    <td className={styles.tdActions}>
                      {canEdit && (
                        <button
                          type="button"
                          className={`${styles.rowActionBtn} ${styles.rowActionBtnDanger}`}
                          title="Delete analysis"
                          aria-label="Delete analysis"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(r.a);
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmDialog
          isOpen={!!deleteTarget}
          title="Delete BOM Cost Analysis?"
          message={
            deleteTarget
              ? `"${deleteTarget.mainPartNumber}" and all of its costs will be removed. This cannot be undone.`
              : ""
          }
          confirmLabel="Delete"
          variant="danger"
          onConfirm={handleConfirmDeleteAnalysis}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    );
  }

  // ═══════════════ Render: Edit Mode ═══════════════
  const deleteRowItem = deleteRowId
    ? items.find((i) => i.id === deleteRowId) || null
    : null;
  const deleteRowChildren = deleteRowItem
    ? getDescendantIds(deleteRowItem.id, items).length
    : 0;
  const costedPct =
    coverage.eligible > 0
      ? Math.round((coverage.costed / coverage.eligible) * 100)
      : 0;

  return (
    <div className={styles.page}>
      <PageHeader
        title={`${analysis?.mainPartNumber || "BOM"}${analysis?.revision ? ` Rev ${analysis.revision}` : ""}`}
        subtitle={analysis?.mainDescription || ""}
        icon={<HeaderIcon />}
        actions={
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.headerBtn}
              onClick={handleBack}
            >
              <ArrowLeft size={15} /> Back
            </button>
            {canEdit && (
              <button
                type="button"
                className={styles.headerBtn}
                onClick={() => {
                  setPasteText("");
                  setShowPasteModal(true);
                }}
              >
                <ClipboardPaste size={15} /> Paste Items
              </button>
            )}
            <button
              type="button"
              className={styles.headerBtn}
              onClick={handleCostLookup}
              disabled={isSearching || catalogLoading || items.length === 0}
            >
              <Search size={15} />
              {catalogLoading
                ? "Loading Catalog..."
                : isSearching
                  ? "Searching..."
                  : "Check Costs"}
            </button>
            <button
              type="button"
              className={styles.headerBtn}
              onClick={handleExport}
              disabled={isExporting || items.length === 0}
            >
              <Download size={15} /> {isExporting ? "Exporting..." : "Export"}
            </button>
            {canEdit && (
              <button
                type="button"
                className={styles.createBtn}
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save size={15} /> {isSaving ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        }
      />

      {analysis && (
        <div className={styles.kpiGrid}>
          <div className={styles.kpi}>
            <span className={styles.kpiLabel}>Items</span>
            <span className={styles.kpiValue}>{items.length}</span>
            <span className={styles.kpiSub}>
              {formatDateDMY(analysis.analysisDate)}
              {analysis.createdBy ? ` · ${analysis.createdBy}` : ""}
            </span>
          </div>

          <div className={styles.kpi}>
            <span className={styles.kpiLabel}>Costed</span>
            <span
              className={`${styles.kpiValue} ${isComplete ? styles.kpiOk : styles.kpiWarn}`}
            >
              {coverage.costed} / {coverage.eligible}
            </span>
            <div className={styles.kpiBar}>
              <div
                className={`${styles.kpiBarFill} ${isComplete ? styles.kpiBarOk : ""}`}
                style={{ width: `${costedPct}%` }}
              />
            </div>
            <span className={styles.kpiSub}>
              {coverage.covered > 0
                ? `${coverage.covered} covered by a parent cost`
                : "Items priced or rolled up"}
            </span>
            {hasSearchedCosts && missingIds.length > 0 && (
              <div className={styles.goToGroup}>
                <span className={styles.goToText}>
                  {missingIds.length} missing
                </span>
                <button
                  type="button"
                  className={styles.goToBtn}
                  onClick={() => goToItem(missingIds[cursor])}
                >
                  Go to
                </button>
                <button
                  type="button"
                  className={styles.goToStep}
                  onClick={() => stepMissing(-1)}
                  title="Previous item without cost"
                  aria-label="Previous item without cost"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className={styles.goToCount}>
                  {cursor + 1}/{missingIds.length}
                </span>
                <button
                  type="button"
                  className={styles.goToStep}
                  onClick={() => stepMissing(1)}
                  title="Next item without cost"
                  aria-label="Next item without cost"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          <div className={styles.kpi}>
            <span className={styles.kpiLabel}>Total Cost (USD)</span>
            <span className={styles.kpiValue}>
              {formatCurrency(totalCost, "USD")}
            </span>
            <span className={styles.kpiSub}>
              {contingencyPerYear > 0
                ? `Contingency ${contingencyPerYear}% / year`
                : "No contingency applied"}
            </span>
          </div>

          <div className={styles.kpi}>
            <span className={styles.kpiLabel}>Max Lead Time</span>
            <span className={styles.kpiValue}>
              {maxLeadTimeItem ? `${maxLeadTimeItem.leadTimeDays} days` : "-"}
            </span>
            {maxLeadTimeItem && (
              <>
                <span
                  className={styles.kpiSub}
                  title={maxLeadTimeItem.description}
                >
                  #{maxLeadTimeItem.level}.{maxLeadTimeItem.findNumber} -{" "}
                  {maxLeadTimeItem.partNumber}
                </span>
                <div className={styles.goToGroup}>
                  <button
                    type="button"
                    className={styles.goToBtn}
                    onClick={() => goToItem(maxLeadTimeItem.id)}
                  >
                    Go to
                  </button>
                </div>
              </>
            )}
          </div>

          <div className={styles.kpi}>
            <span className={styles.kpiLabel}>Status</span>
            <span
              className={`${styles.kpiValue} ${isComplete ? styles.kpiOk : styles.kpiWarn}`}
            >
              {isComplete ? "Complete" : "Incomplete"}
            </span>
            <span className={styles.kpiSub}>
              {isComplete
                ? "Every item has a cost"
                : hasSearchedCosts
                  ? `${missingIds.length} item${missingIds.length === 1 ? "" : "s"} without cost`
                  : "Run Check Costs to price the BOM"}
            </span>
          </div>
        </div>
      )}

      {hasSearchedCosts && (
        <div className={styles.insights}>
          {Object.keys(costRefBreakdown).length > 0 && (
            <div className={styles.insightRow}>
              <span className={styles.insightLabel}>Cost sources</span>
              <div className={styles.chipList}>
                {Object.keys(costRefBreakdown).map((ref) => (
                  <span key={ref} className={styles.chip}>
                    <strong>{costRefBreakdown[ref]}</strong> {ref}
                  </span>
                ))}
              </div>
            </div>
          )}
          {dateAgeSummary.total > 0 && (
            <div className={styles.insightRow}>
              <span className={styles.insightLabel}>Date freshness</span>
              <div className={styles.freshWrap}>
                <div className={styles.freshBar}>
                  {dateAgeSummary.recent > 0 && (
                    <div
                      className={`${styles.freshSeg} ${styles.freshRecent}`}
                      style={{ flexGrow: dateAgeSummary.recent }}
                    />
                  )}
                  {dateAgeSummary.warn > 0 && (
                    <div
                      className={`${styles.freshSeg} ${styles.freshWarn}`}
                      style={{ flexGrow: dateAgeSummary.warn }}
                    />
                  )}
                  {dateAgeSummary.old > 0 && (
                    <div
                      className={`${styles.freshSeg} ${styles.freshOld}`}
                      style={{ flexGrow: dateAgeSummary.old }}
                    />
                  )}
                </div>
                <div className={styles.freshLegend}>
                  <span className={`${styles.dateBadge} ${styles.dateRecent}`}>
                    {dateAgeSummary.recent} recent (
                    {dateAgeSummary.pct(dateAgeSummary.recent)}%)
                  </span>
                  <span className={`${styles.dateBadge} ${styles.dateWarn}`}>
                    {dateAgeSummary.warn} over 1y (
                    {dateAgeSummary.pct(dateAgeSummary.warn)}%)
                  </span>
                  <span className={`${styles.dateBadge} ${styles.dateOld}`}>
                    {dateAgeSummary.old} over 2y (
                    {dateAgeSummary.pct(dateAgeSummary.old)}%)
                  </span>
                </div>
              </div>
            </div>
          )}
          {ratesDisplay.length > 0 && (
            <div className={styles.insightRow}>
              <span className={styles.insightLabel}>Rates used</span>
              <div className={styles.chipList}>
                {ratesDisplay.map((r) => (
                  <span key={r.currency} className={styles.chipMono}>
                    1 USD = {r.rate} {r.currency}
                  </span>
                ))}
              </div>
            </div>
          )}
          <p className={styles.insightNote}>
            <strong>Search priority:</strong> 1st BUMBL (Brazil), 2nd BUMBR
            (Brazil), 3rd Global BUs (Financials). When the same item exists in
            several Business Units the most recent Last Order Date wins.
          </p>
        </div>
      )}

      {hasSearchedCosts && (
        <div className={styles.toolbar}>
          <span className={styles.toolbarLabel}>Contingency per year</span>
          {isContingencyEditing ? (
            <>
              <input
                type="number"
                className={styles.toolbarInput}
                value={contingencyPerYear}
                onChange={(e) =>
                  setContingencyPerYear(parseFloat(e.target.value) || 0)
                }
                min={0}
                max={100}
                step={0.5}
                autoFocus
              />
              <span className={styles.toolbarHint}>
                % / year since Date Ref.
              </span>
              <button
                type="button"
                className={styles.toolbarPrimary}
                onClick={handleApplyContingency}
              >
                Apply to All
              </button>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={() => setIsContingencyEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span className={styles.toolbarValue}>
                {contingencyPerYear}% / year
              </span>
              {canEdit && (
                <button
                  type="button"
                  className={styles.toolbarBtn}
                  onClick={() => setIsContingencyEditing(true)}
                >
                  <Pencil size={13} /> Edit
                </button>
              )}
            </>
          )}

          <span className={styles.dateLegend}>
            <span className={`${styles.dateBadge} ${styles.dateRecent}`}>
              Recent
            </span>
            <span className={`${styles.dateBadge} ${styles.dateWarn}`}>
              &gt;1y
            </span>
            <span className={`${styles.dateBadge} ${styles.dateOld}`}>
              &gt;2y
            </span>
          </span>

          <span className={styles.toolbarSpacer} />
          <button
            type="button"
            className={styles.toolbarBtn}
            onClick={expandAll}
          >
            <ChevronsUpDown size={14} /> Expand all
          </button>
          <button
            type="button"
            className={styles.toolbarBtn}
            onClick={collapseAll}
          >
            <ChevronsDownUp size={14} /> Collapse all
          </button>
        </div>
      )}

      {items.length > 0 ? (
        <div className={styles.tableSection}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Part Number</th>
                  <th>Description</th>
                  <th className={styles.thRight}>Qty</th>
                  {hasSearchedCosts && (
                    <>
                      <th className={styles.thRight}>Cost/Item (USD)</th>
                      <th className={styles.thRight}>Contgy. %</th>
                      <th className={styles.thRight}>Total (Incl. Cont)</th>
                      <th className={styles.thRight}>Lead Time</th>
                      <th>Cost Ref.</th>
                      <th>Date Ref.</th>
                      <th>Comments</th>
                    </>
                  )}
                  <th className={styles.thActions}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => {
                  const indent = (item.level - 1) * 20;
                  const isParent = hasChildren(item, items);
                  const isExp = expanded.has(item.id);
                  const isRolled = item.isRolledUp;
                  const status = coverage.statuses.get(item.id);
                  const isCovered = status === "covered";
                  const isMissing = status === "missing";

                  let rowClass = "";
                  if (isCovered) {
                    rowClass = styles.rowChildOfCosted;
                  } else if (
                    status === "rolled" ||
                    (isParent && status === "costed")
                  ) {
                    rowClass = styles.rowRolledUpComplete;
                  } else if (status === "partial") {
                    rowClass = styles.rowRolledUpPartial;
                  } else if (isMissing && hasSearchedCosts) {
                    rowClass = styles.rowNotFound;
                  } else if (item.level === 1) {
                    rowClass = styles.rowLevel1;
                  }

                  const isFocused = !!focus && focus.id === item.id;
                  if (isFocused) rowClass += ` ${styles.rowFocus}`;
                  const isEditing = editingRows.has(item.id);

                  return (
                    <tr
                      // A new key restarts the highlight animation on a repeated Go to
                      key={
                        focus && isFocused
                          ? `${item.id}#${focus.nonce}`
                          : item.id
                      }
                      id={`bom-row-${item.id}`}
                      className={rowClass}
                    >
                      <td className={styles.tdNum}>
                        <span
                          className={styles.rowIndent}
                          style={{ paddingLeft: indent }}
                        >
                          {isParent ? (
                            <button
                              type="button"
                              className={styles.expandBtn}
                              onClick={() => toggleExpand(item.id)}
                              aria-label={isExp ? "Collapse" : "Expand"}
                              aria-expanded={isExp}
                            >
                              {isExp ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronRight size={14} />
                              )}
                            </button>
                          ) : (
                            <span className={styles.expandBtnPlaceholder} />
                          )}
                          {item.level}.{item.findNumber || ""}
                        </span>
                      </td>

                      <td className={styles.tdPN}>
                        {isEditing ? (
                          <input
                            className={styles.editInput}
                            type="text"
                            value={item.partNumber}
                            onChange={(e) =>
                              updateItem(item.id, {
                                partNumber: e.target.value,
                              })
                            }
                          />
                        ) : (
                          item.partNumber || "-"
                        )}
                      </td>

                      <td className={styles.tdDesc} title={item.description}>
                        {isEditing ? (
                          <input
                            className={styles.editInput}
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(item.id, {
                                description: e.target.value,
                              })
                            }
                          />
                        ) : (
                          item.description || "-"
                        )}
                      </td>

                      <td className={styles.tdRight}>
                        {isEditing ? (
                          <input
                            className={styles.editInputSmall}
                            type="number"
                            value={item.qty || ""}
                            onChange={(e) =>
                              updateItem(item.id, {
                                qty: parseFloat(e.target.value) || 0,
                              })
                            }
                            step={1}
                          />
                        ) : item.qty > 0 ? (
                          item.qty
                        ) : (
                          "-"
                        )}
                      </td>

                      {hasSearchedCosts && (
                        <>
                          <td className={styles.tdCost}>
                            {isEditing ? (
                              <>
                                <input
                                  className={styles.editInputCost}
                                  type="number"
                                  value={item.costPerItemUSD || ""}
                                  onChange={(e) =>
                                    updateItem(item.id, {
                                      costPerItemUSD:
                                        parseFloat(e.target.value) || 0,
                                      isManual: true,
                                      isRolledUp: false,
                                    })
                                  }
                                  step={0.01}
                                />
                                {item.originalCurrency &&
                                  item.originalCurrency !== "USD" && (
                                    <div className={styles.origCost}>
                                      {item.originalCurrency}{" "}
                                      {item.originalCost.toFixed(2)}
                                    </div>
                                  )}
                              </>
                            ) : isRolled ? (
                              <span className={styles.rolledUpValue}>
                                {item.costPerItemUSD.toFixed(2)}
                                <span className={styles.rolledUpTag}>
                                  Σ children
                                </span>
                              </span>
                            ) : item.costPerItemUSD > 0 ? (
                              <>
                                {item.costPerItemUSD.toFixed(2)}
                                {item.originalCurrency &&
                                  item.originalCurrency !== "USD" && (
                                    <div className={styles.origCost}>
                                      {item.originalCurrency}{" "}
                                      {item.originalCost.toFixed(2)}
                                    </div>
                                  )}
                              </>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td className={styles.tdRight}>
                            {isEditing ? (
                              <input
                                className={styles.editInputSmall}
                                type="number"
                                value={item.contingencyPercent || ""}
                                onChange={(e) =>
                                  updateItem(item.id, {
                                    contingencyPercent:
                                      parseFloat(e.target.value) || 0,
                                  })
                                }
                                step={0.5}
                              />
                            ) : isRolled ? (
                              <span className={styles.rolledUpMuted}>-</span>
                            ) : item.contingencyPercent > 0 ? (
                              item.contingencyPercent
                            ) : (
                              "-"
                            )}
                          </td>

                          <td className={styles.tdCost}>
                            {item.totalCostInclCont > 0 ? (
                              <span
                                className={
                                  isRolled ? styles.rolledUpValue : undefined
                                }
                              >
                                {formatCurrency(item.totalCostInclCont, "USD")}
                              </span>
                            ) : isMissing ? (
                              <span className={styles.noCostPill}>No cost</span>
                            ) : (
                              "-"
                            )}
                            {isCovered && (
                              <div className={styles.childOfCostedNote}>
                                parent has own cost
                              </div>
                            )}
                          </td>

                          <td className={styles.tdRight}>
                            {isEditing ? (
                              <input
                                className={styles.editInputSmall}
                                type="number"
                                value={item.leadTimeDays || ""}
                                placeholder="-"
                                onChange={(e) =>
                                  updateItem(item.id, {
                                    leadTimeDays:
                                      parseInt(e.target.value, 10) || 0,
                                  })
                                }
                              />
                            ) : item.leadTimeDays > 0 ? (
                              isRolled ? (
                                <span className={styles.rolledUpMuted}>
                                  {item.leadTimeDays}d
                                </span>
                              ) : (
                                `${item.leadTimeDays}d`
                              )
                            ) : (
                              "-"
                            )}
                          </td>

                          <td>
                            {isRolled && !isEditing ? (
                              <span
                                className={`${styles.srcBadge} ${styles.srcRolledUp}`}
                              >
                                Rolled Up
                              </span>
                            ) : item.sourceTab ? (
                              <span
                                className={`${styles.srcBadge} ${srcClass(item.sourceTab)}`}
                              >
                                {srcLabel(item.sourceTab, item.costReference)}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td>
                            {isEditing ? (
                              <input
                                className={styles.editInputSmall}
                                type="date"
                                value={
                                  item.dateReference
                                    ? item.dateReference.substring(0, 10)
                                    : ""
                                }
                                onChange={(e) =>
                                  updateItem(item.id, {
                                    dateReference: e.target.value
                                      ? new Date(e.target.value).toISOString()
                                      : "",
                                  })
                                }
                              />
                            ) : isRolled ? (
                              "-"
                            ) : item.dateReference ? (
                              <span
                                className={`${styles.dateBadge} ${dateAgeClass(item.dateReference)}`}
                                title={
                                  dateAgeBucket(item.dateReference) === "recent"
                                    ? "Recent"
                                    : dateAgeBucket(item.dateReference) ===
                                        "warn"
                                      ? "Over 1 year"
                                      : "Over 2 years"
                                }
                              >
                                {formatDateDMY(item.dateReference)}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td>
                            {isEditing ? (
                              <input
                                className={styles.editInput}
                                type="text"
                                value={item.comments}
                                onChange={(e) =>
                                  updateItem(item.id, {
                                    comments: e.target.value,
                                  })
                                }
                                placeholder="..."
                              />
                            ) : (
                              item.comments || "-"
                            )}
                          </td>
                        </>
                      )}

                      <td className={styles.tdActions}>
                        {canEdit && (
                          <button
                            type="button"
                            className={`${styles.rowActionBtn} ${isEditing ? styles.rowActionBtnActive : ""}`}
                            onClick={() => toggleRowEdit(item.id)}
                            title={isEditing ? "Done editing" : "Edit row"}
                            aria-label={isEditing ? "Done editing" : "Edit row"}
                          >
                            {isEditing ? (
                              <Check size={13} />
                            ) : (
                              <Pencil size={13} />
                            )}
                          </button>
                        )}
                        {hasSearchedCosts && !isCovered && (
                          <button
                            type="button"
                            className={`${styles.rowActionBtn} ${styles.rowActionBtnQuotation}`}
                            onClick={() => handleOpenQuotations(item.id)}
                            title="Quotations"
                            aria-label="Quotations"
                          >
                            <FileText size={13} />
                          </button>
                        )}
                        {item.sourceTab === "QUOTATION" &&
                          item.quotationItemId && (
                            <button
                              type="button"
                              className={styles.rowActionBtn}
                              onClick={() =>
                                handleViewQuotation(item.quotationItemId!)
                              }
                              title="View quotation"
                              aria-label="View quotation"
                            >
                              <Eye size={13} />
                            </button>
                          )}
                        {canEdit && (
                          <>
                            {item.sourceTab === "QUOTATION" &&
                              item.quotationItemId && (
                                <button
                                  type="button"
                                  className={`${styles.rowActionBtn} ${styles.rowActionBtnDanger}`}
                                  onClick={() => handleRemoveQuotation(item.id)}
                                  title="Remove quotation price"
                                  aria-label="Remove quotation price"
                                >
                                  <X size={13} />
                                </button>
                              )}
                            <button
                              type="button"
                              className={styles.rowActionBtn}
                              onClick={() => handleAddRow(item.id, false)}
                              title="Add sibling row below"
                              aria-label="Add sibling row below"
                            >
                              <Plus size={13} />
                            </button>
                            <button
                              type="button"
                              className={styles.rowActionBtn}
                              onClick={() => handleAddRow(item.id, true)}
                              title="Add child row"
                              aria-label="Add child row"
                            >
                              <CornerDownRight size={13} />
                            </button>
                            <button
                              type="button"
                              className={`${styles.rowActionBtn} ${styles.rowActionBtnDanger}`}
                              onClick={() => setDeleteRowId(item.id)}
                              title="Delete row"
                              aria-label="Delete row"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          variant="glass"
          title="This BOM has no items"
          description="Go back to the list to import a file or start a new manual BOM."
          actionLabel="Back to list"
          onAction={handleBack}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteRowItem}
        title="Delete row?"
        message={
          deleteRowItem
            ? deleteRowChildren > 0
              ? `"${deleteRowItem.partNumber || "This row"}" and its ${deleteRowChildren} child item${deleteRowChildren === 1 ? "" : "s"} will be removed.`
              : `"${deleteRowItem.partNumber || "This row"}" will be removed.`
            : ""
        }
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => {
          if (deleteRowId) handleDeleteRow(deleteRowId);
          setDeleteRowId(null);
        }}
        onCancel={() => setDeleteRowId(null)}
      />

      {showPasteModal && (
        <div
          className={styles.overlay}
          onClick={() => setShowPasteModal(false)}
        >
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.dialogHeader}>
              <h3>Paste Part Numbers</h3>
              <button
                type="button"
                className={styles.dialogClose}
                onClick={() => setShowPasteModal(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className={styles.dialogBody}>
              <p className={styles.pasteHint}>
                Copy rows from Excel and paste below. One part number per line,
                or tab-separated columns (Item# | Description | Part Number).
              </p>
              <textarea
                className={styles.pasteTextarea}
                rows={12}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={
                  "0506168\n990154038\n0506169\n\nor paste tab-separated rows:\n1\tTORQUE-LIMITER 14-51FTLB\t0506168\n2\tSPACER\t990154142"
                }
                autoFocus
              />
              {pasteText.trim() && (
                <div className={styles.pastePreview}>
                  {pasteText.split(/\r?\n/).filter((l) => l.trim()).length}{" "}
                  items detected
                </div>
              )}
            </div>
            <div className={styles.dialogFooter}>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={() => setShowPasteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.createBtnSolid}
                onClick={handlePasteConfirm}
                disabled={!pasteText.trim()}
              >
                Add{" "}
                {pasteText.trim()
                  ? pasteText.split(/\r?\n/).filter((l) => l.trim()).length
                  : 0}{" "}
                Items
              </button>
            </div>
          </div>
        </div>
      )}

      {quotationTarget && (
        <AddQuotationModal
          key={quotationTarget.id}
          variant="drawer"
          title="Quotations"
          subtitle={[
            `#${quotationTarget.level}.${quotationTarget.findNumber}`,
            quotationTarget.partNumber,
            quotationTarget.description,
          ]
            .filter(Boolean)
            .join(" · ")}
          defaultPartNumber={quotationTarget.partNumber}
          defaultDescription={quotationTarget.description}
          formHidden={!canCreateQuotation}
          itemsHint="Every item saved here is added to the Quotations catalog. Use Select above to price this BOM row with it."
          onClose={() => setQuotationTargetId(null)}
          onSaved={(created) =>
            setRecentQuotationIds((prev) =>
              created.map((q) => q.id).concat(prev),
            )
          }
          topSlot={
            <BomQuotationPicker
              quotes={quotationItems}
              loading={!quotationsLoaded}
              initialQuery={searchablePartNumber(quotationTarget.partNumber)}
              recentIds={recentQuotationIds}
              selectedId={quotationTarget.quotationItemId}
              exchangeRates={exchangeRates}
              readOnly={!canEdit}
              onSelect={handleSelectQuotation}
              onView={setViewingQuotation}
              getOpenHref={canOpenQuotations ? getQuotationHref : undefined}
            />
          }
        />
      )}

      {viewingQuotation && (
        <div
          className={styles.overlay}
          onClick={() => setViewingQuotation(null)}
        >
          <div
            className={`${styles.dialog} ${styles.dialogNarrow}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.dialogHeader}>
              <h3>Quotation Details</h3>
              <button
                type="button"
                className={styles.dialogClose}
                onClick={() => setViewingQuotation(null)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className={styles.dialogBody}>
              <div className={styles.viewerGrid}>
                <ViewerRow
                  label="Part Number"
                  value={viewingQuotation.partNumber}
                  mono
                />
                <ViewerRow
                  label="Description"
                  value={viewingQuotation.description}
                />
                <ViewerRow label="Supplier" value={viewingQuotation.supplier} />
                <ViewerRow
                  label="Reference"
                  value={viewingQuotation.reference}
                />
                <ViewerRow
                  label="Type"
                  value={
                    viewingQuotation.type === "rental"
                      ? "Rental (Day Rate)"
                      : "Acquisition (Purchase)"
                  }
                />
                <ViewerRow
                  label="Cost"
                  value={`${viewingQuotation.currency} ${viewingQuotation.cost.toFixed(2)}${
                    viewingQuotation.currency !== "USD"
                      ? ` ≈ ${formatCurrency(
                          viewingQuotation.costUSD > 0
                            ? viewingQuotation.costUSD
                            : convertToUSD(
                                viewingQuotation.cost,
                                viewingQuotation.currency,
                                exchangeRates,
                              ),
                          "USD",
                        )}`
                      : ""
                  }`}
                />
                <ViewerRow
                  label="Lead Time"
                  value={
                    viewingQuotation.leadTimeDays > 0
                      ? `${viewingQuotation.leadTimeDays} days`
                      : ""
                  }
                />
                <ViewerRow
                  label="Quotation Date"
                  value={
                    viewingQuotation.quotationDate
                      ? formatDate(viewingQuotation.quotationDate)
                      : ""
                  }
                />
                <ViewerRow
                  label="Created By"
                  value={viewingQuotation.createdBy}
                />
                {viewingQuotation.notes && (
                  <ViewerRow label="Notes" value={viewingQuotation.notes} />
                )}
              </div>
              <div className={styles.viewerLinks}>
                {viewingQuotation.fileUrl && (
                  <a
                    className={styles.viewerLink}
                    href={QuotationService.getFileOpenUrl(
                      viewingQuotation.fileUrl,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Paperclip size={14} />{" "}
                    {viewingQuotation.fileName || "Open file"}
                  </a>
                )}
                {canOpenQuotations && (
                  <a
                    className={styles.viewerLink}
                    href={getQuotationHref(viewingQuotation)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={14} /> Open in Quotations
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
