/**
 * CostSearchModal — Searches Query Catalog + Favorites for costs to auto-fill
 * into the Assets Breakdown tab.
 *
 * Opens from "🔍 Search Costs" button on AssetsBreakdownTab.
 * Shows scope items missing costs, auto-searches BOM cascade (BUMBL→BUMBR→Financials),
 * lets user select + override costs, then imports.
 */
import * as React from "react";
import {
  IScopeItem,
  IAssetBreakdownItem,
  IBomCostResult,
  IExchangeRate,
} from "../../models";
import { useQueryCatalogStore } from "../../stores/useQueryCatalogStore";
import { useConfigStore } from "../../stores/useConfigStore";
import { convertToUSD } from "../../utils/costCalculations";
import styles from "./CostSearchModal.module.scss";

export interface CostSearchImportItem {
  assetId: string;
  unitCostUSD: number;
  costReference: string;
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
  result: IBomCostResult | null;
  selected: boolean;
  costOverride: number | null;
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

  const [rows, setRows] = React.useState<SearchRow[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [filterMode, setFilterMode] = React.useState<"missing" | "all">(
    "missing",
  );

  // Load catalog on mount
  React.useEffect(() => {
    if (!catalogLoaded && !catalogLoading) loadCatalog();
  }, []);

  // Build rows from scope items + assets
  const buildRows = React.useCallback((): SearchRow[] => {
    const scopeMap = new Map(scopeItems.map((s) => [s.id, s]));
    return assetBreakdown
      .filter((a) => {
        const si = scopeMap.get(a.scopeItemId);
        if (!si || si.isSection) return false;
        if (filterMode === "missing") {
          // Only items with zero cost and not "onboard"/"call out"
          const avail = (a.availabilityStatus || "").toLowerCase();
          if (avail === "onboard" || avail === "call out") return false;
          return a.unitCostUSD === 0;
        }
        return true;
      })
      .map((a) => ({
        asset: a,
        scopeItem: scopeMap.get(a.scopeItemId)!,
        result: null,
        selected: false,
        costOverride: null,
      }));
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
        const pn = row.scopeItem.partNumber || "";
        if (!pn.trim()) return { ...row, result: null, selected: false };

        const result = searchBomCosts(pn.trim(), exchangeRates);
        if (
          result.found &&
          result.sourceTab === "Financials" &&
          result.currency !== "USD"
        ) {
          result.costPerItemUSD = convertToUSD(
            result.costPerItem,
            result.currency,
            exchangeRates,
          );
        }
        return {
          ...row,
          result,
          selected: result.found,
          costOverride: null,
        };
      });
      setRows(updated);
      setIsSearching(false);
      setHasSearched(true);
    }, 50);
  };

  const toggleRow = (assetId: string): void => {
    setRows((prev) =>
      prev.map((r) =>
        r.asset.id === assetId ? { ...r, selected: !r.selected } : r,
      ),
    );
  };

  const setCostOverride = (assetId: string, val: number | null): void => {
    setRows((prev) =>
      prev.map((r) =>
        r.asset.id === assetId ? { ...r, costOverride: val } : r,
      ),
    );
  };

  const selectableRows = rows.filter((r) => r.result && r.result.found);
  const selectedCount = rows.filter(
    (r) => r.selected && r.result?.found,
  ).length;

  const handleSelectAll = (): void => {
    const allSelected = selectedCount === selectableRows.length;
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        selected: r.result?.found ? !allSelected : false,
      })),
    );
  };

  const handleImport = (): void => {
    const items: CostSearchImportItem[] = rows
      .filter((r) => r.selected && r.result?.found)
      .map((r) => {
        const cost =
          r.costOverride != null ? r.costOverride : r.result!.costPerItemUSD;
        return {
          assetId: r.asset.id,
          unitCostUSD: cost,
          costReference: r.result!.sourceTab,
          leadTimeDays: r.result!.leadTimeDays,
          originalCost: r.result!.costPerItem,
          originalCurrency: r.result!.currency,
          costDate: r.result!.dataReference,
        };
      });
    onImport(items);
    onClose();
  };

  const foundCount = rows.filter((r) => r.result && r.result.found).length;
  const notFoundCount = hasSearched
    ? rows.filter((r) => r.result && !r.result.found).length
    : 0;
  const noPN = rows.filter(
    (r) => !(r.scopeItem.partNumber || "").trim(),
  ).length;

  const sourceClass = (tab: string): string => {
    switch (tab) {
      case "BUMBL":
        return styles.srcBUMBL;
      case "BUMBR":
        return styles.srcBUMBR;
      case "Financials":
        return styles.srcFIN;
      default:
        return "";
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Search Costs from Catalog</h3>
            <p className={styles.subtitle}>
              Auto-search BOM costs (BUMBL → BUMBR → Financials) for your scope
              items
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
              Missing Costs ({buildRows().length})
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
                <th>Lead Time</th>
                <th>Override</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const pn = row.scopeItem.partNumber || "";
                const found = row.result?.found;
                return (
                  <tr
                    key={row.asset.id}
                    className={hasSearched && !found ? styles.rowNotFound : ""}
                  >
                    <td className={styles.tdCheck}>
                      {found && (
                        <input
                          type="checkbox"
                          checked={row.selected}
                          onChange={() => toggleRow(row.asset.id)}
                        />
                      )}
                    </td>
                    <td className={styles.tdEquip}>
                      {row.scopeItem.equipmentOffer || "—"}
                    </td>
                    <td className={styles.tdPN}>{pn || "—"}</td>
                    <td className={styles.tdStatus}>
                      {!hasSearched ? (
                        <span className={styles.pending}>—</span>
                      ) : !pn.trim() ? (
                        <span className={styles.noPN}>No PN</span>
                      ) : found ? (
                        <span className={styles.found}>✅</span>
                      ) : (
                        <span className={styles.notFound}>❌</span>
                      )}
                    </td>
                    <td className={styles.tdCost}>
                      {found
                        ? `$${row.result!.costPerItemUSD.toFixed(2)}`
                        : "—"}
                      {found && row.result!.currency !== "USD" && (
                        <div className={styles.origCost}>
                          {row.result!.currency}{" "}
                          {row.result!.costPerItem.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td>
                      {found && (
                        <span
                          className={`${styles.tabBadge} ${sourceClass(row.result!.sourceTab)}`}
                        >
                          {row.result!.sourceTab}
                        </span>
                      )}
                    </td>
                    <td>
                      {found && row.result!.leadTimeDays > 0
                        ? `${row.result!.leadTimeDays}d`
                        : "—"}
                    </td>
                    <td className={styles.tdOverride}>
                      {found && (
                        <input
                          type="number"
                          className={styles.overrideInput}
                          placeholder="—"
                          value={
                            row.costOverride != null ? row.costOverride : ""
                          }
                          onChange={(e) =>
                            setCostOverride(
                              row.asset.id,
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
                  <td colSpan={8} className={styles.emptyRow}>
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
