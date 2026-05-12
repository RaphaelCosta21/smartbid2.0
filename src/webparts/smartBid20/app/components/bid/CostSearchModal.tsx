/**
 * CostSearchModal — Searches Query Catalog + BOM Costs + Quotations for costs
 * to auto-fill into the Assets Breakdown tab.
 *
 * Opens from "🔍 Search Costs" button on AssetsBreakdownTab.
 * Shows scope items missing costs, auto-searches BOM cascade (BUMBL→BUMBR→Financials),
 * also checks BOM Cost Analyses and Quotations by Part Number.
 * Lets user select + override costs, then imports.
 */
import * as React from "react";
import {
  IScopeItem,
  IScopeSubItem,
  IAssetBreakdownItem,
  ISubItemCost,
  IBomCostResult,
  IExchangeRate,
  IBomCostAnalysis,
} from "../../models";
import { useQueryCatalogStore } from "../../stores/useQueryCatalogStore";
import { useConfigStore } from "../../stores/useConfigStore";
import { useQuotationStore } from "../../stores/useQuotationStore";
import { BomCostAnalysisService } from "../../services/BomCostAnalysisService";
import styles from "./CostSearchModal.module.scss";

export interface CostSearchImportItem {
  assetId: string;
  /** If set, this is a sub-item cost import */
  subItemCostId?: string;
  unitCostUSD: number;
  costReference: string;
  dateReference: string;
  leadTimeDays: number;
  originalCost: number;
  originalCurrency: string;
  costDate: string;
}

interface CostSearchModalProps {
  scopeItems: IScopeItem[];
  assetBreakdown: IAssetBreakdownItem[];
  onImport: (items: CostSearchImportItem[]) => void;
  onClose: () => void;
}

interface SearchRow {
  asset: IAssetBreakdownItem;
  scopeItem: IScopeItem;
  /** Sub-item cost row (null for main items) */
  subItemCost: ISubItemCost | null;
  /** Sub-item scope data */
  subItemScope: IScopeSubItem | null;
  result: IBomCostResult | null;
  /** BOM Cost Analysis match */
  bomResult: {
    totalCostUSD: number;
    mainPartNumber: string;
    dateReference: string;
    leadTimeDays?: number;
  } | null;
  /** Quotation match */
  quoteResult: {
    costUSD: number;
    type: "rental" | "acquisition";
    supplier: string;
    quotationDate: string;
  } | null;
  selected: boolean;
  costOverride: number | null;
  /** Which source to use for import */
  selectedSource: "catalog" | "bom" | "quote" | null;
  /** True if this row is a parent context row (not selectable, visual only) */
  isParentContext?: boolean;
}

export const CostSearchModal: React.FC<CostSearchModalProps> = ({
  scopeItems,
  assetBreakdown,
  onImport,
  onClose,
}) => {
  const catalogLoaded = useQueryCatalogStore((s) => s.isLoaded);
  const catalogLoading = useQueryCatalogStore((s) => s.isLoading);
  const loadCatalog = useQueryCatalogStore((s) => s.loadCatalog);
  const searchBomCosts = useQueryCatalogStore((s) => s.searchBomCosts);

  const config = useConfigStore((s) => s.config);
  const exchangeRates: IExchangeRate[] =
    config?.currencySettings?.exchangeRates || [];

  // BOM Cost Analyses and Quotations
  const quotationItems = useQuotationStore((s) => s.items);
  const quotationsLoaded = useQuotationStore((s) => s.isLoaded);
  const loadQuotations = useQuotationStore((s) => s.loadQuotations);
  const [bomAnalyses, setBomAnalyses] = React.useState<IBomCostAnalysis[]>([]);

  const [rows, setRows] = React.useState<SearchRow[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [filterMode, setFilterMode] = React.useState<"missing" | "all">(
    "missing",
  );

  // Load catalog, quotations and BOM analyses on mount
  React.useEffect(() => {
    if (!catalogLoaded && !catalogLoading) loadCatalog();
    if (!quotationsLoaded) loadQuotations();
    BomCostAnalysisService.getAll()
      .then((a) => setBomAnalyses(a))
      .catch(() => {});
  }, []);

  // Build rows from scope items + assets (including sub-items)
  const buildRows = React.useCallback((): SearchRow[] => {
    const scopeMap = new Map(scopeItems.map((s) => [s.id, s]));
    const result: SearchRow[] = [];

    assetBreakdown.forEach((a) => {
      const si = scopeMap.get(a.scopeItemId);
      if (!si || si.isSection) return;

      // Main item row
      const avail = (a.availabilityStatus || "").toLowerCase();
      const skipMain =
        avail === "onboard" || avail === "call out" || avail === "not offered";
      const mainIncluded =
        filterMode === "all" || (!skipMain && a.unitCostUSD === 0);

      if (mainIncluded) {
        result.push({
          asset: a,
          scopeItem: si,
          subItemCost: null,
          subItemScope: null,
          result: null,
          bomResult: null,
          quoteResult: null,
          selected: false,
          costOverride: null,
          selectedSource: null,
        });
      }

      // Sub-item rows
      const subItems = si.subItems || [];
      const subCosts = a.subItemCosts || [];
      let parentContextAdded = false;
      subItems.forEach((sub) => {
        const sic = subCosts.find((sc) => sc.subItemId === sub.id);
        if (!sic) return;
        const sicAvail = (sic.availabilityStatus || "").toLowerCase();
        const skipSub =
          sicAvail === "onboard" ||
          sicAvail === "call out" ||
          sicAvail === "not offered";
        if (filterMode === "all" || (!skipSub && sic.unitCostUSD === 0)) {
          // Insert parent context row if parent was not included (has cost)
          if (!mainIncluded && !parentContextAdded) {
            parentContextAdded = true;
            result.push({
              asset: a,
              scopeItem: si,
              subItemCost: null,
              subItemScope: null,
              result: null,
              bomResult: null,
              quoteResult: null,
              selected: false,
              costOverride: null,
              selectedSource: null,
              isParentContext: true,
            });
          }
          result.push({
            asset: a,
            scopeItem: si,
            subItemCost: sic,
            subItemScope: sub,
            result: null,
            bomResult: null,
            quoteResult: null,
            selected: false,
            costOverride: null,
            selectedSource: null,
          });
        }
      });
    });

    return result;
  }, [scopeItems, assetBreakdown, filterMode]);

  // Rebuild rows when filter changes
  React.useEffect(() => {
    setRows(buildRows());
    setHasSearched(false);
  }, [filterMode]);

  // Initial row build
  React.useEffect(() => {
    setRows(buildRows());
  }, []);

  const handleSearch = (): void => {
    if (!catalogLoaded) return;
    setIsSearching(true);

    setTimeout(() => {
      const updated = rows.map((row) => {
        // Skip parent context rows (they're visual only)
        if (row.isParentContext) return row;

        const pn = row.subItemScope
          ? row.subItemScope.partNumber || ""
          : row.scopeItem.partNumber || "";
        const pnUpper = pn.trim().toUpperCase();
        if (!pn.trim() || pnUpper === "TBD" || pnUpper === "TBC")
          return {
            ...row,
            result: null,
            bomResult: null,
            quoteResult: null,
            selected: false,
            selectedSource: null,
          };

        // 1. Query Catalog (BUMBL → BUMBR → Financials)
        const result = searchBomCosts(pn.trim(), exchangeRates);

        // 2. BOM Cost Analyses
        let bomResult: SearchRow["bomResult"] = null;
        for (let i = 0; i < bomAnalyses.length; i++) {
          const analysis = bomAnalyses[i];
          const items = analysis.items || [];
          for (let j = 0; j < items.length; j++) {
            const item = items[j];
            if (
              (item.partNumber || "").trim().toUpperCase() ===
              pn.trim().toUpperCase()
            ) {
              bomResult = {
                totalCostUSD:
                  item.totalCostInclCont || item.costPerItemUSD || 0,
                mainPartNumber: item.partNumber,
                dateReference:
                  analysis.lastModified ||
                  analysis.analysisDate ||
                  item.dateReference ||
                  "",
                leadTimeDays: item.leadTimeDays || 0,
              };
              break;
            }
          }
          if (bomResult) break;
        }

        // 3. Quotations
        let quoteResult: SearchRow["quoteResult"] = null;
        for (let k = 0; k < quotationItems.length; k++) {
          const qi = quotationItems[k];
          if (
            (qi.partNumber || "").trim().toUpperCase() ===
            pn.trim().toUpperCase()
          ) {
            quoteResult = {
              costUSD: qi.costUSD || 0,
              type: qi.type === "rental" ? "rental" : "acquisition",
              supplier: qi.supplier || "",
              quotationDate: qi.quotationDate || "",
            };
            break;
          }
        }

        // Determine best source
        let selectedSource: SearchRow["selectedSource"] = null;
        if (result.found) selectedSource = "catalog";
        else if (bomResult) selectedSource = "bom";
        else if (quoteResult) selectedSource = "quote";

        return {
          ...row,
          result,
          bomResult,
          quoteResult,
          selected: !!(result.found || bomResult || quoteResult),
          costOverride:
            (row.subItemCost
              ? row.subItemCost.unitCostUSD
              : row.asset.unitCostUSD) > 0
              ? row.subItemCost
                ? row.subItemCost.unitCostUSD
                : row.asset.unitCostUSD
              : null,
          selectedSource,
        };
      });
      setRows(updated);
      setIsSearching(false);
      setHasSearched(true);
    }, 50);
  };

  const getRowKey = (r: SearchRow): string =>
    r.subItemCost ? `${r.asset.id}_${r.subItemCost.id}` : r.asset.id;

  const toggleRow = (rowKey: string): void => {
    setRows((prev) =>
      prev.map((r) =>
        getRowKey(r) === rowKey ? { ...r, selected: !r.selected } : r,
      ),
    );
  };

  const setCostOverride = (rowKey: string, val: number | null): void => {
    setRows((prev) =>
      prev.map((r) =>
        getRowKey(r) === rowKey ? { ...r, costOverride: val } : r,
      ),
    );
  };

  const selectableRows = rows.filter(
    (r) =>
      !r.isParentContext && (r.result?.found || r.bomResult || r.quoteResult),
  );
  const selectedCount = rows.filter(
    (r) =>
      !r.isParentContext &&
      r.selected &&
      (r.result?.found || r.bomResult || r.quoteResult),
  ).length;

  const handleSelectAll = (): void => {
    const allSelected = selectedCount === selectableRows.length;
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        selected:
          r.result?.found || r.bomResult || r.quoteResult
            ? !allSelected
            : false,
      })),
    );
  };

  const handleImport = (): void => {
    const items: CostSearchImportItem[] = rows
      .filter(
        (r) =>
          !r.isParentContext &&
          r.selected &&
          (r.result?.found || r.bomResult || r.quoteResult),
      )
      .map((r) => {
        const src = r.selectedSource;
        if (src === "bom" && r.bomResult) {
          const cost =
            r.costOverride != null ? r.costOverride : r.bomResult.totalCostUSD;
          return {
            assetId: r.asset.id,
            subItemCostId: r.subItemCost ? r.subItemCost.id : undefined,
            unitCostUSD: cost,
            costReference: "BOM COST",
            dateReference: r.bomResult.dateReference,
            leadTimeDays: r.bomResult.leadTimeDays || 0,
            originalCost: r.bomResult.totalCostUSD,
            originalCurrency: "USD",
            costDate: r.bomResult.dateReference,
          };
        }
        if (src === "quote" && r.quoteResult) {
          const cost =
            r.costOverride != null ? r.costOverride : r.quoteResult.costUSD;
          return {
            assetId: r.asset.id,
            subItemCostId: r.subItemCost ? r.subItemCost.id : undefined,
            unitCostUSD: cost,
            costReference: "QUOTE",
            dateReference: r.quoteResult.quotationDate,
            leadTimeDays: 0,
            originalCost: r.quoteResult.costUSD,
            originalCurrency: "USD",
            costDate: r.quoteResult.quotationDate,
          };
        }
        // Default: catalog
        const cost =
          r.costOverride != null ? r.costOverride : r.result!.costPerItemUSD;
        return {
          assetId: r.asset.id,
          subItemCostId: r.subItemCost ? r.subItemCost.id : undefined,
          unitCostUSD: cost,
          costReference: r.result!.sourceTab,
          dateReference: r.result!.dataReference || "",
          leadTimeDays: r.result!.leadTimeDays,
          originalCost: r.result!.costPerItem,
          originalCurrency: r.result!.currency,
          costDate: r.result!.dataReference,
        };
      });
    onImport(items);
    onClose();
  };

  const foundCount = rows.filter(
    (r) =>
      !r.isParentContext && (r.result?.found || r.bomResult || r.quoteResult),
  ).length;
  const notFoundCount = hasSearched
    ? rows.filter((r) => {
        if (r.isParentContext) return false;
        const pn = (
          r.subItemScope
            ? r.subItemScope.partNumber || ""
            : r.scopeItem.partNumber || ""
        )
          .trim()
          .toUpperCase();
        return (
          !r.result?.found &&
          !r.bomResult &&
          !r.quoteResult &&
          pn &&
          pn !== "TBD" &&
          pn !== "TBC"
        );
      }).length
    : 0;
  const noPN = rows.filter((r) => {
    if (r.isParentContext) return false;
    const pn = (
      r.subItemScope
        ? r.subItemScope.partNumber || ""
        : r.scopeItem.partNumber || ""
    )
      .trim()
      .toUpperCase();
    return !pn || pn === "TBD" || pn === "TBC";
  }).length;

  /** Source badge CSS class */
  const srcClass = (
    source: SearchRow["selectedSource"],
    row: SearchRow,
  ): string => {
    if (source === "bom") return styles.srcBOM;
    if (source === "quote") return styles.srcQuote;
    if (source === "catalog" && row.result) {
      switch (row.result.sourceTab) {
        case "BUMBL":
          return styles.srcBUMBL;
        case "BUMBR":
          return styles.srcBUMBR;
        case "Financials":
          return styles.srcFIN;
        default:
          return styles.srcManual;
      }
    }
    return styles.srcManual;
  };

  /** Source display label */
  const srcLabel = (
    source: SearchRow["selectedSource"],
    row: SearchRow,
  ): string => {
    if (source === "bom") return "BOM COST";
    if (source === "quote") return `QUOTE`;
    if (source === "catalog" && row.result) return row.result.sourceTab;
    return "—";
  };

  /** Date age class */
  const dateAgeClass = (dateRef: string): string => {
    if (!dateRef) return "";
    const d = new Date(dateRef);
    if (isNaN(d.getTime())) return "";
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffYears = diffMs / (365.25 * 24 * 60 * 60 * 1000);
    if (diffYears >= 2) return styles.dateOld;
    if (diffYears >= 1) return styles.dateWarn;
    return styles.dateRecent;
  };

  /** Format date DD/Mon/YYYY */
  const fmtDate = (dateRef: string): string => {
    if (!dateRef) return "—";
    const d = new Date(dateRef);
    if (isNaN(d.getTime())) return dateRef;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${d.getDate().toString().padStart(2, "0")}/${months[d.getMonth()]}/${d.getFullYear()}`;
  };

  /** Get the active date ref for a row based on selected source */
  const getRowDateRef = (row: SearchRow): string => {
    if (row.selectedSource === "bom" && row.bomResult)
      return row.bomResult.dateReference;
    if (row.selectedSource === "quote" && row.quoteResult)
      return row.quoteResult.quotationDate;
    if (row.selectedSource === "catalog" && row.result?.found)
      return row.result.dataReference || "";
    return "";
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Search Costs</h3>
            <p className={styles.subtitle}>
              Auto-search costs from Query Catalog, BOM Cost Analyses, and
              Quotations
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.filterToggle}>
            <button
              className={`${styles.filterBtn} ${filterMode === "missing" ? styles.filterActive : ""}`}
              onClick={() => setFilterMode("missing")}
            >
              Missing Costs (
              {buildRows().filter((r) => !r.isParentContext).length})
            </button>
            <button
              className={`${styles.filterBtn} ${filterMode === "all" ? styles.filterActive : ""}`}
              onClick={() => setFilterMode("all")}
            >
              All Items
            </button>
          </div>
          <button
            className={styles.searchBtn}
            onClick={handleSearch}
            disabled={rows.length === 0 || isSearching || catalogLoading}
          >
            {catalogLoading
              ? "Loading Catalog..."
              : isSearching
                ? "Searching..."
                : "🔍 Search All"}
          </button>
        </div>

        {/* Summary */}
        {hasSearched && (
          <div className={styles.summary}>
            <span className={styles.summaryFound}>✅ {foundCount} found</span>
            <span className={styles.summaryNotFound}>
              ❌ {notFoundCount} not found
            </span>
            {noPN > 0 && (
              <span className={styles.summaryNoPN}>⚠ {noPN} without PN</span>
            )}
          </div>
        )}

        {/* Table */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thCheck}>
                  <input
                    type="checkbox"
                    checked={
                      selectableRows.length > 0 &&
                      selectedCount === selectableRows.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Equipment</th>
                <th>Part Number</th>
                <th>Status</th>
                <th>Cost (USD)</th>
                <th>Source</th>
                <th>Date Ref</th>
                <th>Lead Time</th>
                <th>Override</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                // Parent context row — visual hierarchy only
                if (row.isParentContext) {
                  return (
                    <tr
                      key={`ctx_${row.asset.id}`}
                      className={styles.parentContextRow}
                    >
                      <td className={styles.tdCheck} />
                      <td className={styles.tdEquip} colSpan={2}>
                        <span className={styles.parentContextLabel}>
                          {row.scopeItem.equipmentOffer || "—"}
                        </span>
                        {row.scopeItem.partNumber && (
                          <span className={styles.parentContextPN}>
                            {row.scopeItem.partNumber}
                          </span>
                        )}
                      </td>
                      <td colSpan={6} className={styles.parentContextHint}>
                        ✅ has cost — sub-items below
                      </td>
                    </tr>
                  );
                }

                const pn = row.subItemScope
                  ? row.subItemScope.partNumber || ""
                  : row.scopeItem.partNumber || "";
                const found = row.result?.found;
                const hasAny = found || row.bomResult || row.quoteResult;
                const rowKey = row.subItemCost
                  ? `${row.asset.id}_${row.subItemCost.id}`
                  : row.asset.id;
                return (
                  <tr
                    key={rowKey}
                    className={hasSearched && !hasAny ? styles.rowNotFound : ""}
                  >
                    <td className={styles.tdCheck}>
                      {hasAny && (
                        <input
                          type="checkbox"
                          checked={row.selected}
                          onChange={() => toggleRow(rowKey)}
                        />
                      )}
                    </td>
                    <td className={styles.tdEquip}>
                      {row.subItemScope ? (
                        <span
                          style={{
                            paddingLeft: 12,
                            fontStyle: "italic",
                            fontSize: 11,
                          }}
                        >
                          ↳{" "}
                          {row.subItemScope.equipmentOffer ||
                            row.subItemScope.description ||
                            "Sub-item"}
                        </span>
                      ) : (
                        row.scopeItem.equipmentOffer || "—"
                      )}
                    </td>
                    <td className={styles.tdPN}>{pn || "—"}</td>
                    <td className={styles.tdStatus}>
                      {!hasSearched ? (
                        <span className={styles.pending}>—</span>
                      ) : !pn.trim() ? (
                        <span className={styles.noPN}>No PN</span>
                      ) : hasAny ? (
                        <span className={styles.found}>✅</span>
                      ) : (
                        <span className={styles.notFound}>❌</span>
                      )}
                    </td>
                    <td className={styles.tdCost}>
                      {row.selectedSource === "bom" && row.bomResult
                        ? `$${row.bomResult.totalCostUSD.toFixed(2)}`
                        : row.selectedSource === "quote" && row.quoteResult
                          ? `$${row.quoteResult.costUSD.toFixed(2)}`
                          : found
                            ? `$${row.result!.costPerItemUSD.toFixed(2)}`
                            : "—"}
                      {found &&
                        row.selectedSource === "catalog" &&
                        row.result!.currency !== "USD" && (
                          <div className={styles.origCost}>
                            {row.result!.currency}{" "}
                            {row.result!.costPerItem.toFixed(2)}
                          </div>
                        )}
                    </td>
                    <td>
                      {hasAny && (
                        <span
                          className={`${styles.tabBadge} ${srcClass(row.selectedSource, row)}`}
                          title={
                            row.bomResult && row.result?.found
                              ? "Multiple sources available"
                              : ""
                          }
                        >
                          {srcLabel(row.selectedSource, row)}
                        </span>
                      )}
                      {hasAny &&
                        (row.result?.found ? 1 : 0) +
                          (row.bomResult ? 1 : 0) +
                          (row.quoteResult ? 1 : 0) >
                          1 && (
                          <select
                            style={{
                              fontSize: 10,
                              padding: "1px 3px",
                              marginLeft: 4,
                              verticalAlign: "middle",
                            }}
                            value={row.selectedSource || ""}
                            onChange={(e) => {
                              const val = e.target
                                .value as SearchRow["selectedSource"];
                              setRows((prev) =>
                                prev.map((r) =>
                                  getRowKey(r) === rowKey
                                    ? { ...r, selectedSource: val }
                                    : r,
                                ),
                              );
                            }}
                          >
                            {found && (
                              <option value="catalog">
                                {row.result!.sourceTab}
                              </option>
                            )}
                            {row.bomResult && (
                              <option value="bom">BOM COST</option>
                            )}
                            {row.quoteResult && (
                              <option value="quote">QUOTE</option>
                            )}
                          </select>
                        )}
                    </td>
                    <td>
                      {(() => {
                        const dr = getRowDateRef(row);
                        if (!dr) return "—";
                        return (
                          <span
                            className={`${styles.dateBadge} ${dateAgeClass(dr)}`}
                          >
                            {fmtDate(dr)}
                          </span>
                        );
                      })()}
                    </td>
                    <td>
                      {(() => {
                        if (
                          found &&
                          row.selectedSource === "catalog" &&
                          row.result!.leadTimeDays > 0
                        )
                          return `${row.result!.leadTimeDays}d`;
                        if (
                          row.selectedSource === "bom" &&
                          row.bomResult &&
                          row.bomResult.leadTimeDays &&
                          row.bomResult.leadTimeDays > 0
                        )
                          return `${row.bomResult.leadTimeDays}d`;
                        return "—";
                      })()}
                    </td>
                    <td className={styles.tdOverride}>
                      {hasAny && (
                        <input
                          type="number"
                          className={styles.overrideInput}
                          placeholder="—"
                          value={
                            row.costOverride != null ? row.costOverride : ""
                          }
                          onChange={(e) =>
                            setCostOverride(
                              rowKey,
                              e.target.value ? Number(e.target.value) : null,
                            )
                          }
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className={styles.emptyRow}>
                    {filterMode === "missing"
                      ? "All items already have costs assigned!"
                      : "No scope items found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.importBtn}
            onClick={handleImport}
            disabled={selectedCount === 0}
          >
            Import Selected ({selectedCount})
          </button>
        </div>
      </div>
    </div>
  );
};
