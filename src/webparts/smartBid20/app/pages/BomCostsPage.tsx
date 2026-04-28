/**
 * BomCostsPage — BOM Cost Analysis tool.
 * Modes: List (saved analyses) → Import/Edit (hierarchical BOM tree with cost lookup).
 */
import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { useQueryCatalogStore } from "../stores/useQueryCatalogStore";
import { useConfigStore } from "../stores/useConfigStore";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { IBomCostAnalysis, IBomCostItem, BomCostSource } from "../models";
import { BomCostAnalysisService } from "../services/BomCostAnalysisService";
import { convertToUSD } from "../utils/costCalculations";
import { formatCurrency } from "../utils/formatters";
import { parseBomCSV, parseBomExcel, emptyItem } from "../utils/bomParser";
import styles from "./BomCostsPage.module.scss";

/** Month names for DD/Month/YYYY format */
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

/** Format a date string as DD/Month/YYYY */
function formatDateDMY(dateRef: string): string {
  if (!dateRef) return "";
  const d = new Date(dateRef);
  if (isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}/${MONTH_NAMES[d.getMonth()]}/${d.getFullYear()}`;
}

type PageMode = "list" | "edit";

function uid(): string {
  return (
    "ba_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).substring(2, 8)
  );
}

/** Check if an item has children */
function hasChildren(item: IBomCostItem, items: IBomCostItem[]): boolean {
  return items.some((c) => c.parentId === item.id);
}

/** Get direct children of a given item */
function getDirectChildren(
  parentId: string,
  items: IBomCostItem[],
): IBomCostItem[] {
  return items.filter((c) => c.parentId === parentId);
}

/**
 * Reassign sequential findNumbers within each parent group.
 * Each parent's children get numbered 1, 2, 3... in order of appearance.
 */
function reassignFindNumbers(items: IBomCostItem[]): IBomCostItem[] {
  // Group by parentId, preserving order
  const counters = new Map<string, number>();
  return items.map((item) => {
    const key = item.parentId || "__root__";
    const seq = (counters.get(key) || 0) + 1;
    counters.set(key, seq);
    return { ...item, findNumber: String(seq) };
  });
}

/** Get visible items based on expanded state */
function getVisibleItems(
  items: IBomCostItem[],
  expanded: Set<string>,
): IBomCostItem[] {
  const visible: IBomCostItem[] = [];
  const collapsedAncestors = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.parentId && collapsedAncestors.has(item.parentId)) {
      collapsedAncestors.add(item.id);
      continue;
    }
    if (item.parentId) {
      const parent = items.find((p) => p.id === item.parentId);
      if (parent && !expanded.has(parent.id)) {
        collapsedAncestors.add(item.id);
        continue;
      }
    }
    visible.push(item);
    if (!expanded.has(item.id)) {
      collapsedAncestors.add(item.id);
    }
  }
  return visible;
}

/** Calculate contingency % based on years since dateReference */
function calcContingency(
  dateRef: string,
  pctPerYear: number,
  currentYear: number,
): number {
  if (!dateRef || pctPerYear <= 0) return 0;
  const refDate = new Date(dateRef);
  if (isNaN(refDate.getTime())) return 0;
  const years = currentYear - refDate.getFullYear();
  if (years <= 0) return 0;
  return years * pctPerYear;
}

/** Recalculate totalCostInclCont for an item */
function recalcTotal(item: IBomCostItem): number {
  return item.qty * item.costPerItemUSD * (1 + item.contingencyPercent / 100);
}

/** Source badge CSS class */
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
    default:
      return styles.srcNone;
  }
}

/** Source display label */
function srcLabel(src: BomCostSource, costRef: string): string {
  if (src === "BUMBL") return "BUMBL";
  if (src === "BUMBR") return "BUMBR";
  if (src === "Financials") return costRef || "FIN";
  if (src === "manual") return "Manual";
  return "—";
}

/**
 * Check if a rolled-up parent should appear as "partial" (orange).
 * A parent is partial if any direct child is:
 *   1) A leaf without cost (no source, not manual, not rolled up)
 *   2) A rolled-up child that is ITSELF partial (propagates orange upward)
 */
function isRolledUpPartial(parentId: string, items: IBomCostItem[]): boolean {
  const children = getDirectChildren(parentId, items);
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    // Leaf without cost → parent is partial
    if (c.costPerItemUSD <= 0 && !c.isManual && !c.isRolledUp) return true;
    // Rolled-up child that is itself partial → parent is partial
    if (c.isRolledUp && isRolledUpPartial(c.id, items)) return true;
  }
  return false;
}

/**
 * Roll up costs from children to parents that have no direct cost.
 * Always sums children even if some are missing costs (partial rollup).
 * Also propagates max lead time from children to rolled-up parents.
 * If parent already HAS query cost → keep it (children are informational only).
 * Process bottom-up (deepest levels first).
 */
function rollUpParentCosts(items: IBomCostItem[]): IBomCostItem[] {
  const updated = items.map((i) => ({ ...i }));

  // Find max level
  let maxLevel = 0;
  updated.forEach((i) => {
    if (i.level > maxLevel) maxLevel = i.level;
  });

  // Process from deepest level upward
  for (let lvl = maxLevel - 1; lvl >= 1; lvl--) {
    updated.forEach((item) => {
      if (item.level !== lvl) return;
      const children = getDirectChildren(item.id, updated);
      if (children.length === 0) return;

      // Parent has NO direct cost → roll up from children (even partial)
      if (
        (item.costPerItemUSD === 0 || item.isRolledUp) &&
        (item.sourceTab === "" || item.sourceTab === "manual")
      ) {
        const sumChildrenTotal = children.reduce(
          (s, c) => s + c.totalCostInclCont,
          0,
        );
        item.costPerItemUSD = sumChildrenTotal / Math.max(item.qty, 1);
        item.totalCostInclCont = sumChildrenTotal;
        item.isRolledUp = true;
        item.sourceTab = "manual";
        item.costReference = "Rolled Up";
        item.comments = item.comments || "Sum of children";
        // Propagate max lead time from children
        const maxChildLT = Math.max(0, ...children.map((c) => c.leadTimeDays));
        if (maxChildLT > item.leadTimeDays) {
          item.leadTimeDays = maxChildLT;
        }
      }
      // Parent already HAS cost from Query → keep it, do nothing
    });
  }
  return updated;
}

/**
 * Compute total cost avoiding double counting.
 * For rolled-up parents: skip them (children already counted).
 * For parents with direct query cost: include parent, skip children.
 */
function computeSmartTotal(items: IBomCostItem[]): number {
  // Build set of IDs whose cost is already accounted for
  const skip = new Set<string>();

  items.forEach((item) => {
    // If parent has direct query cost (not rolled up), skip its children
    if (
      item.costPerItemUSD > 0 &&
      !item.isRolledUp &&
      hasChildren(item, items)
    ) {
      const children = getDirectChildren(item.id, items);
      children.forEach((c) => skip.add(c.id));
    }
    // If parent is rolled up, skip the parent itself (children are the source)
    if (item.isRolledUp) {
      skip.add(item.id);
    }
  });

  let total = 0;
  items.forEach((item) => {
    if (!skip.has(item.id)) {
      total += item.totalCostInclCont;
    }
  });
  return total;
}

/** Get age class for a date reference */
function dateAgeClass(dateRef: string): string {
  if (!dateRef) return "";
  const d = new Date(dateRef);
  if (isNaN(d.getTime())) return "";
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffYears = diffMs / (365.25 * 24 * 60 * 60 * 1000);
  if (diffYears >= 2) return styles.dateOld;
  if (diffYears >= 1) return styles.dateWarn;
  return styles.dateRecent;
}

/** Classify a date ref into age bucket */
function dateAgeBucket(dateRef: string): "recent" | "warn" | "old" | "" {
  if (!dateRef) return "";
  const d = new Date(dateRef);
  if (isNaN(d.getTime())) return "";
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffYears = diffMs / (365.25 * 24 * 60 * 60 * 1000);
  if (diffYears >= 2) return "old";
  if (diffYears >= 1) return "warn";
  return "recent";
}

export const BomCostsPage: React.FC = () => {
  const currentUser = useCurrentUser();
  const config = useConfigStore((s) => s.config);
  const exchangeRates = config?.currencySettings?.exchangeRates || [];

  const catalogLoaded = useQueryCatalogStore((s) => s.isLoaded);
  const catalogLoading = useQueryCatalogStore((s) => s.isLoading);
  const loadCatalog = useQueryCatalogStore((s) => s.loadCatalog);
  const searchBomCosts = useQueryCatalogStore((s) => s.searchBomCosts);

  // Page mode
  const [mode, setMode] = React.useState<PageMode>("list");

  // List mode state
  const [savedAnalyses, setSavedAnalyses] = React.useState<IBomCostAnalysis[]>(
    [],
  );
  const [listLoading, setListLoading] = React.useState(true);
  const [listSearch, setListSearch] = React.useState("");
  const [listStatusFilter, setListStatusFilter] = React.useState<
    "all" | "complete" | "incomplete"
  >("all");

  // Filtered analyses for list mode
  const filteredAnalyses = React.useMemo(() => {
    let result = savedAnalyses;
    if (listSearch.trim()) {
      const q = listSearch.trim().toLowerCase();
      result = result.filter(
        (a) =>
          a.mainPartNumber.toLowerCase().indexOf(q) !== -1 ||
          a.mainDescription.toLowerCase().indexOf(q) !== -1,
      );
    }
    if (listStatusFilter === "complete") {
      result = result.filter((a) => a.isComplete);
    } else if (listStatusFilter === "incomplete") {
      result = result.filter((a) => !a.isComplete);
    }
    return result;
  }, [savedAnalyses, listSearch, listStatusFilter]);

  // Edit mode state
  const [analysis, setAnalysis] = React.useState<IBomCostAnalysis | null>(null);
  const [items, setItems] = React.useState<IBomCostItem[]>([]);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearchedCosts, setHasSearchedCosts] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [contingencyPerYear, setContingencyPerYear] = React.useState(0);
  const [isContingencyEditing, setIsContingencyEditing] = React.useState(false);
  const [editingRows, setEditingRows] = React.useState<Set<string>>(new Set());
  const [showPasteModal, setShowPasteModal] = React.useState(false);
  const [pasteText, setPasteText] = React.useState("");

  // Load saved analyses on mount
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

  // ─── File Import ───
  const handleFileImport = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    let parsed: IBomCostItem[] = [];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (ext === "csv") {
      parsed = await parseBomCSV(file);
    } else if (ext === "xlsx" || ext === "xls") {
      parsed = await parseBomExcel(file);
    }

    if (parsed.length === 0) return;

    // Reassign find numbers sequentially
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

    setAnalysis(newAnalysis);
    setItems(parsed);
    setHasSearchedCosts(false);
    setContingencyPerYear(0);

    const exp = new Set<string>();
    parsed.forEach((item) => {
      if (item.level <= 2 && hasChildren(item, parsed)) {
        exp.add(item.id);
      }
    });
    setExpanded(exp);
    setMode("edit");
    e.target.value = "";
  };

  // ─── Load existing analysis ───
  const handleLoadAnalysis = (a: IBomCostAnalysis): void => {
    setAnalysis(a);
    const reindexed = reassignFindNumbers(a.items);
    setItems(reindexed);
    setHasSearchedCosts(a.items.some((i) => i.sourceTab !== "" || i.isManual));
    setContingencyPerYear(a.globalContingencyPerYear);

    const exp = new Set<string>();
    a.items.forEach((item) => {
      if (item.level <= 2 && hasChildren(item, a.items)) {
        exp.add(item.id);
      }
    });
    setExpanded(exp);
    setMode("edit");
  };

  // ─── Delete analysis ───
  const handleDeleteAnalysis = async (
    e: React.MouseEvent,
    id: string,
  ): Promise<void> => {
    e.stopPropagation();
    if (!confirm("Delete this BOM Cost Analysis?")) return;
    await BomCostAnalysisService.deleteOne(id);
    await loadSavedAnalyses();
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
        // Reset rolled up items back to zero so they get recalculated
        const wasRolledUp = item.isRolledUp;
        const resetItem = { ...item, isRolledUp: false };
        if (wasRolledUp) {
          resetItem.costPerItemUSD = 0;
          resetItem.totalCostInclCont = 0;
          resetItem.sourceTab = "" as BomCostSource;
          resetItem.costReference = "";
          resetItem.comments = "";
        }

        // Skip items that already have manual costs
        if (resetItem.isManual && resetItem.costPerItemUSD > 0)
          return resetItem;

        // Skip parent items that have children — they get cost via roll-up only
        if (hasChildren(resetItem, items)) return resetItem;

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
        };
        u.totalCostInclCont = recalcTotal(u);
        return u;
      });

      // Roll up parent costs from children
      updated = rollUpParentCosts(updated);

      setItems(updated);
      setHasSearchedCosts(true);

      // Update analysis metadata
      if (analysis) {
        const maxLead = Math.max(0, ...updated.map((i) => i.leadTimeDays));
        const total = computeSmartTotal(updated);
        setAnalysis({
          ...analysis,
          currencyRatesUsed: { ...analysis.currencyRatesUsed, ...ratesUsed },
          maxLeadTimeDays: maxLead,
          totalCostUSD: total,
        });
      }

      setIsSearching(false);
    }, 50);
  };

  // ─── Apply contingency ───
  const handleApplyContingency = (): void => {
    const currentYear = new Date().getFullYear();
    let updated = items.map((item) => {
      if (item.isRolledUp) return item; // Skip rolled up, recalc after
      const pct = calcContingency(
        item.dateReference,
        contingencyPerYear,
        currentYear,
      );
      const u = { ...item, contingencyPercent: pct };
      u.totalCostInclCont = recalcTotal(u);
      return u;
    });
    // Re-roll up after contingency change
    updated = rollUpParentCosts(updated);
    setItems(updated);
    setIsContingencyEditing(false);
    if (analysis) {
      const total = computeSmartTotal(updated);
      setAnalysis({
        ...analysis,
        globalContingencyPerYear: contingencyPerYear,
        totalCostUSD: total,
      });
    }
  };

  // ─── Update single item field (re-rolls parent costs live) ───
  const updateItem = (id: string, patch: Partial<IBomCostItem>): void => {
    let updated = items.map((item) => {
      if (item.id !== id) return item;
      const u = { ...item, ...patch };
      if (
        "costPerItemUSD" in patch ||
        "qty" in patch ||
        "contingencyPercent" in patch
      ) {
        u.totalCostInclCont = recalcTotal(u);
      }
      return u;
    });
    // Re-roll parent costs so rolled-up parents update live
    updated = rollUpParentCosts(updated);
    setItems(updated);

    // Sync header title with root item (level 1)
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

  // ─── Toggle row editing ───
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

    const newLevel = asChild ? refItem.level + 1 : refItem.level;
    const parentId = asChild ? refItem.id : refItem.parentId;

    const newItem = emptyItem({
      level: newLevel,
      parentId: parentId,
      isManual: true,
      sourceTab: "manual",
    });

    // Insert after the reference item (and all its descendants if adding sibling)
    const refIdx = items.indexOf(refItem);
    let insertIdx = refIdx + 1;
    if (!asChild) {
      // Skip past all descendants of refItem
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

    // Auto-expand parent and auto-edit new row
    if (asChild) {
      const exp = new Set(expanded);
      exp.add(refItem.id);
      setExpanded(exp);
    }
    const ed = new Set(editingRows);
    ed.add(newItem.id);
    setEditingRows(ed);
  };

  // ─── Delete row ───
  const handleDeleteRow = (id: string): void => {
    // Delete item and all its descendants
    const idsToDelete = new Set<string>();
    idsToDelete.add(id);
    let changed = true;
    while (changed) {
      changed = false;
      items.forEach((item) => {
        if (
          item.parentId &&
          idsToDelete.has(item.parentId) &&
          !idsToDelete.has(item.id)
        ) {
          idsToDelete.add(item.id);
          changed = true;
        }
      });
    }
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

    // Detect root item (first level-1 item) as parent
    const root = items.find((i) => i.level === 1);
    const parentId = root ? root.id : "";
    const parentLevel = root ? root.level : 0;

    const newItems: IBomCostItem[] = [];
    lines.forEach((line) => {
      // Handle tab-separated data: try to find PN and description
      const cols = line
        .split("\t")
        .map((c) => c.trim())
        .filter(Boolean);
      let partNumber = "";
      let description = "";

      if (cols.length >= 3) {
        // Format: Item# | Description | PN  (like the user's screenshot)
        description = cols[1] || "";
        partNumber = cols[cols.length - 1] || "";
      } else if (cols.length === 2) {
        // Could be Description|PN or PN|Description — assume last column is PN if numeric-like
        if (/^\d/.test(cols[1])) {
          description = cols[0];
          partNumber = cols[1];
        } else {
          partNumber = cols[0];
          description = cols[1];
        }
      } else {
        // Single value — treat as part number
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

    const combined = [...items, ...newItems];
    let updated = reassignFindNumbers(combined);
    updated = rollUpParentCosts(updated);
    setItems(updated);

    // Expand root to see new items
    if (root) {
      const exp = new Set(expanded);
      exp.add(root.id);
      setExpanded(exp);
    }

    setShowPasteModal(false);
    setPasteText("");
  };

  // ─── Toggle expand ───
  const toggleExpand = (id: string): void => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  // ─── Expand / Collapse All ───
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
    const total = computeSmartTotal(items);
    const maxLead = Math.max(0, ...items.map((i) => i.leadTimeDays));

    const toSave: IBomCostAnalysis = {
      ...analysis,
      items,
      totalCostUSD: total,
      maxLeadTimeDays: maxLead,
      isComplete,
      lastModified: new Date().toISOString(),
      globalContingencyPerYear: contingencyPerYear,
    };

    await BomCostAnalysisService.saveOne(toSave);
    setAnalysis(toSave);
    await loadSavedAnalyses();
    setIsSaving(false);
  };

  // ─── Export to Excel ───
  const handleExport = async (): Promise<void> => {
    const XLSX = await import("xlsx");
    const data = items.map((item) => ({
      Level: item.level,
      "Part Number": item.partNumber,
      Description: item.description,
      Qty: item.qty,
      "Cost Per Item (USD)": item.costPerItemUSD || "",
      "Contingency (%)": item.contingencyPercent || "",
      "Total Cost (Incl. Cont)": item.totalCostInclCont || "",
      "Lead Time (days)": item.leadTimeDays || "",
      "Cost Reference": item.costReference || "",
      "Date Reference": item.dateReference
        ? formatDateDMY(item.dateReference)
        : "",
      Comments: item.comments || "",
      Source: item.sourceTab || "",
      "Rolled Up": item.isRolledUp ? "Yes" : "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BOM Costs");
    XLSX.writeFile(
      wb,
      `BOM-Costs-${analysis?.mainPartNumber || "export"}-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  // ─── Back to list ───
  const handleBack = (): void => {
    setMode("list");
    setAnalysis(null);
    setItems([]);
    setHasSearchedCosts(false);
  };

  // ─── Derived data ───
  const visibleItems = React.useMemo(
    () => getVisibleItems(items, expanded),
    [items, expanded],
  );

  const foundCount = items.filter(
    (i) => i.costPerItemUSD > 0 || i.isManual || i.isRolledUp,
  ).length;
  const totalCost = React.useMemo(() => computeSmartTotal(items), [items]);

  // Max lead time item
  const maxLeadTimeItem = React.useMemo(() => {
    let best: IBomCostItem | null = null;
    items.forEach((i) => {
      if (!i.isRolledUp && i.leadTimeDays > 0) {
        if (!best || i.leadTimeDays > best.leadTimeDays) best = i;
      }
    });
    return best as IBomCostItem | null;
  }, [items]);

  // isComplete = root item (level 1) is green (rolled up complete = no partial children)
  const isComplete = React.useMemo(() => {
    if (items.length === 0) return false;
    const root = items[0];
    // If root has direct cost (not rolled up) → complete if it has cost
    if (!root.isRolledUp && root.costPerItemUSD > 0) return true;
    // If root is rolled up → complete only if no child is partial
    if (root.isRolledUp && !isRolledUpPartial(root.id, items)) return true;
    // Otherwise check if ALL items have cost
    return items.every(
      (i) => i.costPerItemUSD > 0 || i.isManual || i.isRolledUp,
    );
  }, [items]);

  // Cost reference breakdown
  const costRefBreakdown = React.useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      if (!item.costReference || item.isRolledUp) return;
      const key = item.costReference;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [items]);

  // Date age summary
  const dateAgeSummary = React.useMemo(() => {
    let recent = 0;
    let warn = 0;
    let old = 0;
    let total = 0;
    items.forEach((item) => {
      if (!item.dateReference || item.isRolledUp) return;
      const bucket = dateAgeBucket(item.dateReference);
      if (bucket === "recent") {
        recent++;
        total++;
      } else if (bucket === "warn") {
        warn++;
        total++;
      } else if (bucket === "old") {
        old++;
        total++;
      }
    });
    const pct = (n: number): string =>
      total > 0 ? Math.round((n / total) * 100) + "%" : "0%";
    return { recent, warn, old, total, pct };
  }, [items]);

  // Currency rates used
  const ratesDisplay = React.useMemo(() => {
    if (!analysis?.currencyRatesUsed) return [];
    const entries: Array<{ currency: string; rate: number }> = [];
    const rates = analysis.currencyRatesUsed;
    Object.keys(rates).forEach((cur) => {
      entries.push({ currency: cur, rate: rates[cur] });
    });
    return entries;
  }, [analysis?.currencyRatesUsed]);

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
    setAnalysis(newAnalysis);
    setItems([rootItem]);
    setHasSearchedCosts(true);
    setContingencyPerYear(0);
    setExpanded(new Set());
    const ed = new Set<string>();
    ed.add(rootItem.id);
    setEditingRows(ed);
    setMode("edit");
  };

  // ─── Render: List Mode ───
  if (mode === "list") {
    return (
      <div className={styles.page}>
        <PageHeader
          title="BOM Costs"
          subtitle="Import and analyze Bill of Materials costs"
          icon={
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
          }
        />

        <div className={styles.listSection}>
          <div className={styles.listHeader}>
            <span className={styles.listTitle}>
              Saved Analyses
              <span className={styles.listCount}>
                ({filteredAnalyses.length})
              </span>
            </span>
            <div className={styles.listActions}>
              <label className={styles.newBtn}>
                + Import File
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  style={{ display: "none" }}
                  onChange={handleFileImport}
                />
              </label>
              <button className={styles.newBtn} onClick={handleNewBlank}>
                + Manual BOM
              </button>
            </div>
          </div>

          <div className={styles.listFilters}>
            <input
              className={styles.listSearchInput}
              type="text"
              placeholder="Search by Part Number or Description..."
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
            />
            <div className={styles.listFilterBtns}>
              <button
                className={`${styles.filterBtn} ${listStatusFilter === "all" ? styles.filterBtnActive : ""}`}
                onClick={() => setListStatusFilter("all")}
              >
                All
              </button>
              <button
                className={`${styles.filterBtn} ${listStatusFilter === "complete" ? styles.filterBtnActive : ""}`}
                onClick={() => setListStatusFilter("complete")}
              >
                Complete
              </button>
              <button
                className={`${styles.filterBtn} ${listStatusFilter === "incomplete" ? styles.filterBtnActive : ""}`}
                onClick={() => setListStatusFilter("incomplete")}
              >
                Incomplete
              </button>
            </div>
          </div>

          {listLoading ? (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner} />
              <span>Loading analyses...</span>
            </div>
          ) : savedAnalyses.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <div className={styles.emptyText}>No BOM analyses yet</div>
              <div className={styles.emptySub}>
                Import a CSV or XLSX Bill of Materials to get started
              </div>
              <label className={styles.emptyUploadBtn}>
                📎 Upload BOM File (CSV / XLSX)
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  style={{ display: "none" }}
                  onChange={handleFileImport}
                />
              </label>
            </div>
          ) : filteredAnalyses.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyText}>No matches found</div>
              <div className={styles.emptySub}>
                Try adjusting your search or filter
              </div>
            </div>
          ) : (
            <div className={styles.cardsGrid}>
              {filteredAnalyses.map((a) => (
                <div
                  key={a.id}
                  className={styles.analysisCard}
                  onClick={() => handleLoadAnalysis(a)}
                >
                  <button
                    className={styles.cardDelete}
                    onClick={(e) => handleDeleteAnalysis(e, a.id)}
                    title="Delete"
                  >
                    ✕
                  </button>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardPN}>{a.mainPartNumber}</span>
                    <span
                      className={`${styles.cardBadge} ${a.isComplete ? styles.badgeComplete : styles.badgeIncomplete}`}
                    >
                      {a.isComplete ? "Complete" : "Incomplete"}
                    </span>
                  </div>
                  <div className={styles.cardDesc}>{a.mainDescription}</div>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardMetaItem}>
                      {a.items.length} items
                    </span>
                    <span className={styles.cardMetaItem}>
                      {formatCurrency(a.totalCostUSD || 0, "USD")}
                    </span>
                    <span className={styles.cardMetaItem}>
                      {formatDateDMY(a.analysisDate)}
                    </span>
                    {a.revision && (
                      <span className={styles.cardMetaItem}>
                        Rev {a.revision}
                      </span>
                    )}
                    {a.maxLeadTimeDays > 0 && (
                      <span className={styles.cardMetaItem}>
                        {a.maxLeadTimeDays}d LT
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Render: Edit Mode ───
  return (
    <div className={styles.page}>
      <PageHeader
        title="BOM Cost Analysis"
        subtitle={analysis?.mainPartNumber || ""}
        icon={
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
        }
      />

      {/* Header Summary Panel */}
      {analysis && (
        <div className={styles.headerPanel}>
          <div className={styles.headerTop}>
            <div className={styles.headerInfo}>
              <span className={styles.headerPN}>
                {analysis.mainPartNumber}
                {analysis.revision ? ` Rev ${analysis.revision}` : ""}
              </span>
              <span className={styles.headerDesc}>
                {analysis.mainDescription}
              </span>
            </div>
            <div className={styles.headerActions}>
              <button
                className={`${styles.actionBtnSecondary} ${styles.backBtn}`}
                onClick={handleBack}
              >
                ← Back
              </button>
              <button
                className={styles.actionBtnSecondary}
                onClick={() => {
                  setPasteText("");
                  setShowPasteModal(true);
                }}
              >
                📋 Paste Items
              </button>
              <button
                className={styles.actionBtn}
                onClick={handleCostLookup}
                disabled={isSearching || catalogLoading || items.length === 0}
              >
                {catalogLoading
                  ? "Loading Catalog..."
                  : isSearching
                    ? "Searching..."
                    : "🔍 Check Costs"}
              </button>
              <button
                className={styles.actionBtn}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "💾 Save"}
              </button>
              <button
                className={styles.actionBtnSecondary}
                onClick={handleExport}
              >
                📥 Export
              </button>
            </div>
          </div>

          <div className={styles.headerStats}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Items</span>
              <span className={styles.statValue}>{items.length}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Costed</span>
              <span
                className={`${styles.statValue} ${foundCount === items.length ? styles.statValueGreen : styles.statValueYellow}`}
              >
                {foundCount}/{items.length}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Cost (USD)</span>
              <span className={styles.statValue}>
                {formatCurrency(totalCost, "USD")}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Max Lead Time</span>
              <span className={styles.statValue}>
                {maxLeadTimeItem ? `${maxLeadTimeItem.leadTimeDays} days` : "—"}
              </span>
              {maxLeadTimeItem && (
                <span className={styles.statSub} style={{ maxWidth: 200 }}>
                  #{maxLeadTimeItem.level}.{maxLeadTimeItem.findNumber} —{" "}
                  {maxLeadTimeItem.partNumber}
                </span>
              )}
              {maxLeadTimeItem && (
                <span
                  className={styles.statSub}
                  style={{ maxWidth: 200, marginTop: 0 }}
                  title={maxLeadTimeItem.description}
                >
                  {maxLeadTimeItem.description}
                </span>
              )}
              {maxLeadTimeItem && (
                <button
                  className={styles.goToBtn}
                  onClick={() => {
                    // Expand parents so item is visible
                    const exp = new Set(expanded);
                    items.forEach((it) => {
                      if (hasChildren(it, items)) exp.add(it.id);
                    });
                    setExpanded(exp);
                    setTimeout(() => {
                      const row = document.getElementById(
                        `bom-row-${maxLeadTimeItem.id}`,
                      );
                      if (row)
                        row.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                    }, 100);
                  }}
                >
                  Go to ↓
                </button>
              )}
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Analysis Date</span>
              <span className={styles.statValue}>
                {formatDateDMY(analysis.analysisDate)}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Status</span>
              <span
                className={`${styles.statValue} ${isComplete ? styles.statValueGreen : styles.statValueYellow}`}
              >
                {isComplete ? "Complete" : "Incomplete"}
              </span>
            </div>
          </div>

          {/* Cost Reference Breakdown + Currency Rates */}
          {hasSearchedCosts && (
            <div className={styles.headerExtra}>
              {/* Search priority explanation */}
              <div className={styles.searchInfoNote}>
                <strong>Search priority:</strong> 1st BUMBL (Brazil) → 2nd BUMBR
                (Brazil) → 3rd Global BUs (Financials). For Global BUs, if the
                same item exists in multiple Business Units (e.g. BUABO, BUMCO,
                BUAUS, BUIEH), the system selects the one with the{" "}
                <strong>most recent Last Order Date</strong>.
              </div>

              {/* Cost breakdown by source */}
              {Object.keys(costRefBreakdown).length > 0 && (
                <div className={styles.refBreakdown}>
                  <span className={styles.refBreakdownLabel}>
                    Cost Sources:
                  </span>
                  {Object.keys(costRefBreakdown).map((ref) => (
                    <span key={ref} className={styles.refBreakdownChip}>
                      <strong>{costRefBreakdown[ref]}</strong> {ref}
                    </span>
                  ))}
                </div>
              )}

              {/* Date age summary */}
              {dateAgeSummary.total > 0 && (
                <div className={styles.refBreakdown}>
                  <span className={styles.refBreakdownLabel}>
                    Date Freshness:
                  </span>
                  <span
                    className={`${styles.dateBadge} ${styles.dateRecent}`}
                    style={{ fontSize: 11 }}
                  >
                    <strong>{dateAgeSummary.recent}</strong> Recent (
                    {dateAgeSummary.pct(dateAgeSummary.recent)})
                  </span>
                  <span
                    className={`${styles.dateBadge} ${styles.dateWarn}`}
                    style={{ fontSize: 11 }}
                  >
                    <strong>{dateAgeSummary.warn}</strong> &gt;1y (
                    {dateAgeSummary.pct(dateAgeSummary.warn)})
                  </span>
                  <span
                    className={`${styles.dateBadge} ${styles.dateOld}`}
                    style={{ fontSize: 11 }}
                  >
                    <strong>{dateAgeSummary.old}</strong> &gt;2y (
                    {dateAgeSummary.pct(dateAgeSummary.old)})
                  </span>
                </div>
              )}

              {/* Exchange rates used */}
              {ratesDisplay.length > 0 && (
                <div className={styles.ratesRow}>
                  <span className={styles.ratesLabel}>Rates Used:</span>
                  {ratesDisplay.map((r) => (
                    <span key={r.currency} className={styles.rateChip}>
                      1 USD = {r.rate} {r.currency}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Contingency Bar */}
      {hasSearchedCosts && (
        <div className={styles.contingencyBar}>
          <span className={styles.contingencyLabel}>Contingency per year:</span>
          {isContingencyEditing ? (
            <>
              <input
                type="number"
                className={styles.contingencyInput}
                value={contingencyPerYear}
                onChange={(e) =>
                  setContingencyPerYear(parseFloat(e.target.value) || 0)
                }
                min={0}
                max={100}
                step={0.5}
                autoFocus
              />
              <span className={styles.contingencySuffix}>
                % / year since Date Ref.
              </span>
              <button
                className={styles.contingencyApplyBtn}
                onClick={handleApplyContingency}
              >
                Apply to All
              </button>
              <button
                className={styles.actionBtnSecondary}
                onClick={() => setIsContingencyEditing(false)}
                style={{ padding: "5px 10px", fontSize: 12 }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span className={styles.contingencyValue}>
                {contingencyPerYear}% / year
              </span>
              <button
                className={styles.contingencyEditBtn}
                onClick={() => setIsContingencyEditing(true)}
              >
                ✏️ Edit
              </button>
            </>
          )}

          {/* Date ref legend */}
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

          <span style={{ marginLeft: "auto" }}>
            <button
              className={styles.actionBtnSecondary}
              onClick={expandAll}
              style={{ marginRight: 6 }}
            >
              Expand All
            </button>
            <button className={styles.actionBtnSecondary} onClick={collapseAll}>
              Collapse All
            </button>
          </span>
        </div>
      )}

      {/* Tree Table */}
      {items.length > 0 && (
        <div className={styles.tableSection}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Part Number</th>
                  <th>Description</th>
                  <th style={{ textAlign: "right" }}>Qty</th>
                  {hasSearchedCosts && (
                    <>
                      <th style={{ textAlign: "right" }}>Cost/Item (USD)</th>
                      <th style={{ textAlign: "right" }}>Contgy. %</th>
                      <th style={{ textAlign: "right" }}>Total (Incl. Cont)</th>
                      <th style={{ textAlign: "right" }}>Lead Time</th>
                      <th>Cost Ref.</th>
                      <th>Date Ref.</th>
                      <th>Comments</th>
                    </>
                  )}
                  <th style={{ width: 80, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => {
                  const indent = (item.level - 1) * 20;
                  const isParent = hasChildren(item, items);
                  const isExp = expanded.has(item.id);
                  const hasCost = item.sourceTab !== "" || item.isManual;
                  const isRolled = item.isRolledUp;

                  // Check if parent has direct cost and this is a child
                  const parentHasDirectCost =
                    item.parentId &&
                    (() => {
                      const p = items.find((x) => x.id === item.parentId);
                      return (
                        p &&
                        p.costPerItemUSD > 0 &&
                        !p.isRolledUp &&
                        (p.sourceTab !== "" || p.isManual)
                      );
                    })();

                  // For rolled-up parents: green if no child is partial, orange if any child is partial
                  const rolledUpComplete =
                    isRolled && !isRolledUpPartial(item.id, items);

                  let rowClass = "";
                  if (isRolled && rolledUpComplete) {
                    rowClass = styles.rowRolledUpComplete;
                  } else if (isRolled) {
                    rowClass = styles.rowRolledUpPartial;
                  } else if (parentHasDirectCost && hasCost) {
                    rowClass = styles.rowChildOfCosted;
                  } else if (!hasCost && hasSearchedCosts) {
                    rowClass = styles.rowNotFound;
                  } else if (item.level === 1) {
                    rowClass = styles.rowLevel1;
                  }

                  const isEditing = editingRows.has(item.id);

                  return (
                    <tr
                      key={item.id}
                      id={`bom-row-${item.id}`}
                      className={rowClass}
                    >
                      {/* # with expand/collapse */}
                      <td className={styles.tdNum}>
                        <span
                          className={styles.rowIndent}
                          style={{ paddingLeft: indent }}
                        >
                          {isParent ? (
                            <button
                              className={styles.expandBtn}
                              onClick={() => toggleExpand(item.id)}
                            >
                              {isExp ? "−" : "+"}
                            </button>
                          ) : (
                            <span className={styles.expandBtnPlaceholder} />
                          )}
                          {item.level}.{item.findNumber || ""}
                        </span>
                      </td>

                      {/* Part Number */}
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
                          item.partNumber || "—"
                        )}
                      </td>

                      {/* Description */}
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
                          item.description || "—"
                        )}
                      </td>

                      {/* Qty */}
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
                          "—"
                        )}
                      </td>

                      {hasSearchedCosts && (
                        <>
                          {/* Cost Per Item (USD) — editable only in edit mode */}
                          <td className={styles.tdCost}>
                            {isRolled ? (
                              <span className={styles.rolledUpValue}>
                                {item.costPerItemUSD.toFixed(2)}
                                <span className={styles.rolledUpTag}>
                                  Σ children
                                </span>
                              </span>
                            ) : isEditing ? (
                              <>
                                <input
                                  className={styles.editInputCost}
                                  type="number"
                                  value={item.costPerItemUSD || ""}
                                  onChange={(e) =>
                                    updateItem(item.id, {
                                      costPerItemUSD:
                                        parseFloat(e.target.value) || 0,
                                      isManual:
                                        item.sourceTab === "" ||
                                        item.sourceTab === "manual",
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
                              "—"
                            )}
                          </td>

                          {/* Contingency % — editable only in edit mode */}
                          <td className={styles.tdRight}>
                            {isRolled ? (
                              <span className={styles.rolledUpMuted}>—</span>
                            ) : isEditing ? (
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
                            ) : item.contingencyPercent > 0 ? (
                              item.contingencyPercent
                            ) : (
                              "—"
                            )}
                          </td>

                          {/* Total Cost (Incl. Cont) — read-only */}
                          <td className={styles.tdCost}>
                            {item.totalCostInclCont > 0 ? (
                              <span
                                className={
                                  isRolled ? styles.rolledUpValue : undefined
                                }
                              >
                                {formatCurrency(item.totalCostInclCont, "USD")}
                              </span>
                            ) : (
                              "—"
                            )}
                            {parentHasDirectCost && hasCost && (
                              <div className={styles.childOfCostedNote}>
                                parent has own cost
                              </div>
                            )}
                          </td>

                          {/* Lead Time — editable only in edit mode */}
                          <td className={styles.tdRight}>
                            {isRolled ? (
                              item.leadTimeDays > 0 ? (
                                <span className={styles.rolledUpMuted}>
                                  {item.leadTimeDays}d
                                </span>
                              ) : (
                                "—"
                              )
                            ) : isEditing ? (
                              <input
                                className={styles.editInputSmall}
                                type="number"
                                value={item.leadTimeDays || ""}
                                placeholder="—"
                                onChange={(e) =>
                                  updateItem(item.id, {
                                    leadTimeDays:
                                      parseInt(e.target.value, 10) || 0,
                                  })
                                }
                              />
                            ) : item.leadTimeDays > 0 ? (
                              `${item.leadTimeDays}d`
                            ) : (
                              "—"
                            )}
                          </td>

                          {/* Cost Reference */}
                          <td>
                            {isRolled ? (
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
                              "—"
                            )}
                          </td>

                          {/* Date Reference — with age badge + editable */}
                          <td>
                            {isRolled ? (
                              "—"
                            ) : isEditing ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
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
                              </div>
                            ) : item.dateReference ? (
                              <span
                                className={`${styles.dateBadge} ${dateAgeClass(item.dateReference)}`}
                                title={
                                  dateAgeBucket(item.dateReference) === "recent"
                                    ? "Recent"
                                    : dateAgeBucket(item.dateReference) ===
                                        "warn"
                                      ? ">1 year"
                                      : ">2 years"
                                }
                              >
                                {formatDateDMY(item.dateReference)}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>

                          {/* Comments — editable only in edit mode */}
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
                              item.comments || "—"
                            )}
                          </td>
                        </>
                      )}

                      {/* Actions column */}
                      <td className={styles.tdActions}>
                        <button
                          className={`${styles.rowActionBtn} ${isEditing ? styles.rowActionBtnActive : ""}`}
                          onClick={() => toggleRowEdit(item.id)}
                          title={isEditing ? "Done editing" : "Edit row"}
                        >
                          {isEditing ? "✓" : "✏️"}
                        </button>
                        <button
                          className={styles.rowActionBtn}
                          onClick={() => handleAddRow(item.id, false)}
                          title="Add sibling row below"
                        >
                          +
                        </button>
                        <button
                          className={styles.rowActionBtn}
                          onClick={() => handleAddRow(item.id, true)}
                          title="Add child row"
                        >
                          ⤵
                        </button>
                        <button
                          className={`${styles.rowActionBtn} ${styles.rowActionBtnDanger}`}
                          onClick={() => {
                            if (
                              confirm("Delete this row and all its children?")
                            ) {
                              handleDeleteRow(item.id);
                            }
                          }}
                          title="Delete row"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No items loaded yet — show import prompt */}
      {items.length === 0 && (
        <div className={styles.importSection}>
          <div className={styles.importIcon}>📄</div>
          <div className={styles.importText}>Import a Bill of Materials</div>
          <div className={styles.importSub}>
            Upload a CSV or XLSX file exported from Windchill, or start from
            scratch with a blank manual BOM
          </div>
          <div className={styles.importActions}>
            <label className={styles.actionBtn}>
              📎 Upload File
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                style={{ display: "none" }}
                onChange={handleFileImport}
              />
            </label>
            <button className={styles.actionBtnSecondary} onClick={handleBack}>
              ← Back to List
            </button>
          </div>
        </div>
      )}

      {/* Paste Items Modal */}
      {showPasteModal && (
        <>
          <div
            className={styles.pasteBackdrop}
            onClick={() => setShowPasteModal(false)}
          />
          <div className={styles.pasteModal}>
            <div className={styles.pasteModalHeader}>
              <h3>Paste Part Numbers</h3>
              <button
                className={styles.actionBtnSecondary}
                onClick={() => setShowPasteModal(false)}
              >
                ✕
              </button>
            </div>
            <p className={styles.pasteModalHint}>
              Copy rows from Excel/spreadsheet and paste below. Supports:
              <br />
              - One part number per line
              <br />- Tab-separated columns (Item# | Description | Part Number)
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
                {pasteText.split(/\r?\n/).filter((l) => l.trim()).length} items
                detected
              </div>
            )}
            <div className={styles.pasteModalFooter}>
              <button
                className={styles.actionBtnSecondary}
                onClick={() => setShowPasteModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.actionBtn}
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
        </>
      )}
    </div>
  );
};
