import * as React from "react";
import {
  IScopeItem,
  IAssetBreakdownItem,
  IAssetSubCost,
  IScopeSubItem,
  ISubItemCost,
} from "../../models";
import { useConfigStore } from "../../stores/useConfigStore";
import { makeId } from "../../utils/idGenerator";
import styles from "./AssetsBreakdownTab.module.scss";

interface AssetsBreakdownTabProps {
  scopeItems: IScopeItem[];
  assetBreakdown: IAssetBreakdownItem[];
  onSave: (items: IAssetBreakdownItem[]) => void;
  readOnly?: boolean;
}

const blankAsset = (scopeItemId: string): IAssetBreakdownItem => ({
  id: makeId("asset"),
  scopeItemId,
  availabilityStatus: "",
  acquisitionType: "",
  unitCostUSD: 0,
  totalCostUSD: 0,
  costReference: "",
  costCalcMethod: "manual",
  originalCost: 0,
  originalCurrency: "USD",
  costDate: "",
  leadTimeDays: 0,
  dailyRate: null,
  rentalDays: null,
  transitCost: 0,
  costCategory: "",
  supplier: "",
  quoteReference: null,
  statusIndicator: null,
  notes: "",
  subCosts: [],
  subItemCosts: [],
});

const blankSubCost = (): IAssetSubCost => ({
  id: makeId("sc"),
  description: "",
  costUSD: 0,
  costReference: "",
  leadTimeDays: 0,
  notes: "",
});

const blankTransitSubCost = (): IAssetSubCost => ({
  id: makeId("sc-transit"),
  description: "Transit Rate",
  costUSD: 0,
  costReference: "",
  leadTimeDays: 0,
  notes: "",
  isTransitRate: true,
  importDays: 0,
  exportDays: 0,
  transitDiscount: 50,
});

const blankSubItemCost = (subItemId: string): ISubItemCost => ({
  id: makeId("sic"),
  subItemId,
  availabilityStatus: "",
  acquisitionType: "",
  unitCostUSD: 0,
  totalCostUSD: 0,
  costReference: "",
  costCategory: "",
  supplier: "",
  leadTimeDays: 0,
  notes: "",
});

export const AssetsBreakdownTab: React.FC<AssetsBreakdownTabProps> = ({
  scopeItems,
  assetBreakdown,
  onSave,
  readOnly = false,
}) => {
  // Helper: append fieldEmpty class when value is empty/falsy
  const emptyIf = (base: string, value: unknown): string =>
    value ? base : `${base} ${styles.fieldEmpty}`;

  const config = useConfigStore((s) => s.config);
  const availabilityStatuses = (config?.availabilityStatuses || []).filter(
    (a) => a.isActive !== false,
  );
  const acquisitionTypes = (config?.acquisitionTypes || []).filter(
    (a) => a.isActive !== false,
  );
  const costReferences = (config?.costReferences || []).filter(
    (c) => c.isActive !== false,
  );

  const [expandedSubCosts, setExpandedSubCosts] = React.useState<Set<string>>(
    new Set(),
  );
  const [collapsedSubItems, setCollapsedSubItems] = React.useState<Set<string>>(
    new Set(),
  );
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(
    new Set(),
  );

  // ─── Auto-sync: ensure every non-section scope item has an asset entry ───
  const syncedAssets = React.useMemo(() => {
    const scopeDataItems = (scopeItems || []).filter((s) => !s.isSection);
    const existing = new Map(
      (assetBreakdown || []).map((a) => [a.scopeItemId, a]),
    );
    const result: IAssetBreakdownItem[] = [];

    scopeDataItems.forEach((si) => {
      let asset = existing.get(si.id);
      if (asset) {
        existing.delete(si.id);
      } else {
        asset = blankAsset(si.id);
      }
      // Sync sub-item costs with scope sub-items
      const scopeSubs = (si.subItems || []) as IScopeSubItem[];
      const existingSIC = new Map(
        (asset.subItemCosts || []).map((sic) => [sic.subItemId, sic]),
      );
      const syncedSIC: ISubItemCost[] = [];
      scopeSubs.forEach((sub) => {
        const existing2 = existingSIC.get(sub.id);
        if (existing2) {
          syncedSIC.push(existing2);
        } else {
          syncedSIC.push(blankSubItemCost(sub.id));
        }
      });
      result.push({ ...asset, subItemCosts: syncedSIC });
    });

    return { synced: result, orphans: Array.from(existing.values()) };
  }, [scopeItems, assetBreakdown]);

  const [localAssets, setLocalAssets] = React.useState<IAssetBreakdownItem[]>(
    syncedAssets.synced,
  );

  React.useEffect(() => {
    setLocalAssets(syncedAssets.synced);
  }, [syncedAssets.synced]);

  const persist = React.useCallback(
    (updated: IAssetBreakdownItem[]) => {
      setLocalAssets(updated);
      onSave([...updated, ...syncedAssets.orphans]);
    },
    [onSave, syncedAssets.orphans],
  );

  const updateField = (
    id: string,
    field: keyof IAssetBreakdownItem,
    value: unknown,
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== id) return a;
      const patched = { ...a, [field]: value };

      const NO_COST_STATUSES = ["onboard", "call out"];

      // Auto-set fields when availability changes
      if (field === "availabilityStatus") {
        const val = String(value).toLowerCase();
        const isNoCost = NO_COST_STATUSES.indexOf(val) >= 0;

        if (isNoCost) {
          patched.acquisitionType = "N/A";
          patched.costCategory = "";
          patched.unitCostUSD = 0;
          patched.totalCostUSD = 0;
          patched.dailyRate = null;
          patched.rentalDays = null;
        } else {
          // Reset acq type when availability changes
          patched.acquisitionType = "";
          patched.dailyRate = null;
          patched.rentalDays = null;
        }
      }
      // When acquisition type changes, handle Rental/Workshop auto-setup
      if (field === "acquisitionType") {
        const acqVal = String(value).toLowerCase();
        const isRental = acqVal === "rental";
        const isWorkshop = acqVal === "workshop";
        if (isRental) {
          patched.costCategory = "OPEX";
          patched.unitCostUSD = 0;
          patched.totalCostUSD = 0;
          patched.dailyRate = 0;
          patched.rentalDays = 0;
          // Auto-add Transit Rate sub-cost if not present
          const subs = patched.subCosts || [];
          const hasTransit = subs.some((sc) => sc.isTransitRate);
          if (!hasTransit) {
            patched.subCosts = [blankTransitSubCost(), ...subs];
          }
        } else if (isWorkshop) {
          patched.unitCostUSD = 0;
          patched.totalCostUSD = 0;
          patched.costCategory = "OPEX";
          patched.costReference = "";
          patched.leadTimeDays = 0;
          patched.supplier = "";
          patched.dailyRate = null;
          patched.rentalDays = null;
        } else {
          patched.dailyRate = null;
          patched.rentalDays = null;
        }
      }
      // Recalculate total for rental items (rate × days × qty)
      if (field === "dailyRate" || field === "rentalDays") {
        const days =
          field === "rentalDays" ? Number(value) || 0 : patched.rentalDays || 0;
        const rate =
          field === "dailyRate" ? Number(value) || 0 : patched.dailyRate || 0;
        const scopeItem = (scopeItems || []).find(
          (s) => s.id === patched.scopeItemId,
        );
        const rQty =
          (scopeItem?.qtyOperational || 0) + (scopeItem?.qtySpare || 0);
        patched.totalCostUSD = rate * days * (rQty || 1);
        patched.unitCostUSD = rate;
        // Recalculate transit sub-cost when daily rate changes
        if (field === "dailyRate") {
          patched.subCosts = (patched.subCosts || []).map((sc) => {
            if (!sc.isTransitRate) return sc;
            const totalTransitDays =
              (sc.importDays || 0) + (sc.exportDays || 0);
            const disc = (sc.transitDiscount || 0) / 100;
            return {
              ...sc,
              costUSD: rate * disc * totalTransitDays,
              leadTimeDays: totalTransitDays,
            };
          });
        }
      }
      if (field === "unitCostUSD" || field === "scopeItemId") {
        const isRental =
          (patched.acquisitionType || "").toLowerCase() === "rental";
        if (!isRental) {
          const scopeItem = (scopeItems || []).find(
            (s) => s.id === patched.scopeItemId,
          );
          const qty =
            (scopeItem?.qtyOperational || 0) + (scopeItem?.qtySpare || 0);
          patched.totalCostUSD = (patched.unitCostUSD || 0) * qty;
        }
      }
      return patched;
    });
    persist(updated);
  };

  // ─── Sub-cost handlers ───
  const addSubCost = (assetId: string): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return { ...a, subCosts: [...(a.subCosts || []), blankSubCost()] };
    });
    persist(updated);
  };

  const updateSubCost = (
    assetId: string,
    subCostId: string,
    field: keyof IAssetSubCost,
    value: unknown,
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return {
        ...a,
        subCosts: (a.subCosts || []).map((sc) => {
          if (sc.id !== subCostId) return sc;
          const patched = { ...sc, [field]: value };
          // Auto-recalculate transit cost when its fields change
          if (
            patched.isTransitRate &&
            (field === "importDays" ||
              field === "exportDays" ||
              field === "transitDiscount")
          ) {
            const totalTransitDays =
              (patched.importDays || 0) + (patched.exportDays || 0);
            const disc = (patched.transitDiscount || 0) / 100;
            const dailyRate = a.dailyRate || 0;
            patched.costUSD = dailyRate * disc * totalTransitDays;
            patched.leadTimeDays = totalTransitDays;
          }
          return patched;
        }),
      };
    });
    persist(updated);
  };

  const deleteSubCost = (assetId: string, subCostId: string): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return {
        ...a,
        subCosts: (a.subCosts || []).filter((sc) => sc.id !== subCostId),
      };
    });
    persist(updated);
  };

  const toggleSubCosts = (assetId: string): void => {
    setExpandedSubCosts((prev) => {
      const next = new Set(prev);
      if (next.has(assetId)) next.delete(assetId);
      else next.add(assetId);
      return next;
    });
  };

  const toggleSubItems = (assetId: string): void => {
    setCollapsedSubItems((prev) => {
      const next = new Set(prev);
      if (next.has(assetId)) next.delete(assetId);
      else next.add(assetId);
      return next;
    });
  };

  // ─── Sub-item cost handlers ───
  const updateSubItemCost = (
    assetId: string,
    subItemCostId: string,
    field: keyof ISubItemCost,
    value: unknown,
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return {
        ...a,
        subItemCosts: (a.subItemCosts || []).map((sic) => {
          if (sic.id !== subItemCostId) return sic;
          const patched = { ...sic, [field]: value };
          // Auto-calc totalCostUSD = unitCostUSD × qty
          if (field === "unitCostUSD") {
            const sub = getSubItemForCost(a.scopeItemId, sic.subItemId);
            const qty = sub?.qty || 1;
            patched.totalCostUSD = (Number(value) || 0) * qty;
          }
          return patched;
        }),
      };
    });
    persist(updated);
  };

  /** Look up a scope sub-item by parent scope ID and sub-item ID */
  const getSubItemForCost = (
    scopeItemId: string,
    subItemId: string,
  ): IScopeSubItem | undefined => {
    const si = (scopeItems || []).find((s) => s.id === scopeItemId);
    return si
      ? (si.subItems || []).find((sub) => sub.id === subItemId)
      : undefined;
  };

  /** Get the effective total for a sub-item cost entry */
  const getSubItemCostTotal = (
    sic: ISubItemCost,
    scopeItemId: string,
  ): number => {
    const sub = getSubItemForCost(scopeItemId, sic.subItemId);
    const qty = sub?.qty || 1;
    return (sic.unitCostUSD || 0) * qty;
  };

  const toggleSection = (sectionId: string): void => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  // Scope item lookup
  const getScopeItem = (scopeItemId: string): IScopeItem | undefined =>
    (scopeItems || []).find((s) => s.id === scopeItemId);

  /** Compute the effective displayed total for an asset (matches what Total Cost USD column shows) */
  const getEffectiveTotal = (a: IAssetBreakdownItem): number => {
    const avail = (a.availabilityStatus || "").toLowerCase();
    const acqType = (a.acquisitionType || "").toLowerCase();
    const scSum = (a.subCosts || []).reduce(
      (s, sc) => s + (sc.costUSD || 0),
      0,
    );
    const si = getScopeItem(a.scopeItemId);
    const qty = (si?.qtyOperational || 0) + (si?.qtySpare || 0) || 1;

    if (avail === "onboard" || avail === "call out") {
      return scSum;
    }
    if (acqType === "workshop") {
      return scSum;
    }
    if (acqType === "rental") {
      const rentalTotal = (a.dailyRate || 0) * (a.rentalDays || 0) * qty;
      return rentalTotal + scSum;
    }
    // Normal
    return (a.unitCostUSD || 0) * qty + scSum;
  };

  /** Get the total of all sub-item costs for an asset */
  const getSubItemCostsTotal = (a: IAssetBreakdownItem): number => {
    return (a.subItemCosts || []).reduce((sum, sic) => {
      const sub = getSubItemForCost(a.scopeItemId, sic.subItemId);
      const qty = sub?.qty || 1;
      return sum + (sic.unitCostUSD || 0) * qty;
    }, 0);
  };

  // ─── Build sectioned view ───
  const sections = (scopeItems || []).filter((s) => s.isSection);

  const allSectionsCollapsed =
    sections.length > 0 && sections.every((s) => collapsedSections.has(s.id));

  const toggleAllSections = (): void => {
    if (allSectionsCollapsed) {
      setCollapsedSections(new Set());
    } else {
      setCollapsedSections(new Set(sections.map((s) => s.id)));
    }
  };

  // Resource type sub-tab filter
  const [resourceTypeFilter, setResourceTypeFilter] =
    React.useState<string>("all");
  const scopeDataItems = React.useMemo(
    () => (scopeItems || []).filter((s) => !s.isSection),
    [scopeItems],
  );
  // Map scopeItemId → 1-based index matching Scope of Supply ordering
  const scopeItemIndex = React.useMemo(() => {
    const map: Record<string, number> = {};
    scopeDataItems.forEach((si, idx) => {
      map[si.id] = idx + 1;
    });
    return map;
  }, [scopeDataItems]);
  const distinctResourceTypes = React.useMemo(() => {
    const types: string[] = [];
    scopeDataItems.forEach((i) => {
      if (i.resourceType && types.indexOf(i.resourceType) === -1) {
        types.push(i.resourceType);
      }
    });
    return types;
  }, [scopeDataItems]);
  const resourceTypeCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    localAssets.forEach((a) => {
      const si = getScopeItem(a.scopeItemId);
      if (si && si.resourceType) {
        counts[si.resourceType] = (counts[si.resourceType] || 0) + 1;
      }
    });
    return counts;
  }, [localAssets, scopeItems]);
  const showResourceTypeFilter = distinctResourceTypes.length > 1;

  const orderedItems = React.useMemo(() => {
    const items: (
      | { type: "section"; section: IScopeItem }
      | { type: "asset"; asset: IAssetBreakdownItem; scopeItem?: IScopeItem }
    )[] = [];

    // Unsectioned items first
    const unsectioned = localAssets.filter((a) => {
      const si = getScopeItem(a.scopeItemId);
      return si && !si.sectionId;
    });
    unsectioned.forEach((a) =>
      items.push({
        type: "asset",
        asset: a,
        scopeItem: getScopeItem(a.scopeItemId),
      }),
    );

    // Then each section + its children
    sections.forEach((sec) => {
      items.push({ type: "section", section: sec });
      if (!collapsedSections.has(sec.id)) {
        const sectionAssets = localAssets.filter((a) => {
          const si = getScopeItem(a.scopeItemId);
          return si && si.sectionId === sec.id;
        });
        sectionAssets.forEach((a) =>
          items.push({
            type: "asset",
            asset: a,
            scopeItem: getScopeItem(a.scopeItemId),
          }),
        );
      }
    });

    return items;
  }, [localAssets, sections, collapsedSections, scopeItems]);

  // Filtered view respecting resource type sub-tab
  const filteredOrderedItems = React.useMemo(() => {
    if (resourceTypeFilter === "all") return orderedItems;
    // Build set of section IDs that have at least one matching asset
    const sectionIdsWithMatch = new Set<string>();
    localAssets.forEach((a) => {
      const si = getScopeItem(a.scopeItemId);
      if (si && si.sectionId && si.resourceType === resourceTypeFilter) {
        sectionIdsWithMatch.add(si.sectionId);
      }
    });
    return orderedItems.filter((entry) => {
      if (entry.type === "section") {
        return sectionIdsWithMatch.has(entry.section.id);
      }
      const si = entry.scopeItem;
      return si ? si.resourceType === resourceTypeFilter : true;
    });
  }, [orderedItems, resourceTypeFilter, localAssets, scopeItems]);

  // ─── Summary ───
  const totals = React.useMemo(() => {
    let capex = 0;
    let opex = 0;
    let uncategorized = 0;
    let subCostsTotal = 0;
    let subItemCostsTotal = 0;
    localAssets.forEach((a) => {
      const effectiveTotal = getEffectiveTotal(a);
      const assetSubCosts = (a.subCosts || []).reduce(
        (s, sc) => s + (sc.costUSD || 0),
        0,
      );
      const sicTotal = getSubItemCostsTotal(a);
      // Rental and Workshop are always OPEX regardless of stored costCategory
      const acqType = (a.acquisitionType || "").toLowerCase();
      const effectiveCategory =
        acqType === "rental" || acqType === "workshop"
          ? "OPEX"
          : a.costCategory;
      if (effectiveCategory === "CAPEX") capex += effectiveTotal + sicTotal;
      else if (effectiveCategory === "OPEX") opex += effectiveTotal + sicTotal;
      else uncategorized += effectiveTotal + sicTotal;
      subCostsTotal += assetSubCosts;
      subItemCostsTotal += sicTotal;
    });
    return {
      capex,
      opex,
      total: capex + opex + uncategorized,
      subCostsTotal,
      subItemCostsTotal,
    };
  }, [localAssets]);

  // ─── Cost completeness tracker ───
  const costCompleteness = React.useMemo(() => {
    let itemsMissing = 0;
    let itemsTotal = 0;
    let subItemsMissing = 0;
    let subItemsTotal = 0;

    localAssets.forEach((a) => {
      const avail = (a.availabilityStatus || "").toLowerCase();
      const isNoCost = avail === "onboard" || avail === "call out";

      // Count main items (skip no-cost statuses)
      if (!isNoCost) {
        itemsTotal++;
        const effectiveTotal = getEffectiveTotal(a);
        if (effectiveTotal === 0) {
          itemsMissing++;
        }
      }

      // Count sub-item costs
      (a.subItemCosts || []).forEach((sic) => {
        subItemsTotal++;
        const sicTotal = getSubItemCostTotal(sic, a.scopeItemId);
        if (sicTotal === 0) {
          subItemsMissing++;
        }
      });
    });

    return { itemsMissing, itemsTotal, subItemsMissing, subItemsTotal };
  }, [localAssets, scopeItems]);

  const totalMissing =
    costCompleteness.itemsMissing + costCompleteness.subItemsMissing;
  const totalItems =
    costCompleteness.itemsTotal + costCompleteness.subItemsTotal;
  const allCostsFilled = totalMissing === 0 && totalItems > 0;

  const COLS = 16;

  return (
    <div className={styles.container}>
      {/* Summary */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total Assets Cost</span>
          <span className={styles.summaryValue}>
            $ {totals.total.toLocaleString()}
          </span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>CAPEX</span>
          <span className={styles.summaryValue}>
            $ {totals.capex.toLocaleString()}
          </span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>OPEX</span>
          <span className={styles.summaryValue}>
            $ {totals.opex.toLocaleString()}
          </span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Sub-Costs</span>
          <span className={styles.summaryValue}>
            $ {totals.subCostsTotal.toLocaleString()}
          </span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Items</span>
          <span className={styles.summaryValue}>{localAssets.length}</span>
        </div>
      </div>

      {/* Cost Completeness Banner */}
      {totalItems > 0 && (
        <div
          className={
            allCostsFilled
              ? styles.costBannerComplete
              : styles.costBannerPending
          }
        >
          <span className={styles.costBannerIcon}>
            {allCostsFilled ? "✅" : "⚠️"}
          </span>
          <span className={styles.costBannerText}>
            {allCostsFilled
              ? `All ${totalItems} items have costs mapped`
              : `${totalMissing} of ${totalItems} item${totalItems !== 1 ? "s" : ""} still missing cost`}
            {costCompleteness.itemsMissing > 0 && (
              <span className={styles.costBannerSub}>
                {" "}
                · {costCompleteness.itemsMissing} main item
                {costCompleteness.itemsMissing !== 1 ? "s" : ""}
              </span>
            )}
            {costCompleteness.subItemsMissing > 0 && (
              <span className={styles.costBannerSub}>
                {" "}
                · {costCompleteness.subItemsMissing} sub-item
                {costCompleteness.subItemsMissing !== 1 ? "s" : ""}
              </span>
            )}
          </span>
        </div>
      )}

      {/* Orphan warning */}
      {syncedAssets.orphans.length > 0 && (
        <div className={styles.orphanBanner}>
          ⚠ {syncedAssets.orphans.length} asset(s) no longer linked to a Scope
          item.
        </div>
      )}

      {sections.length > 0 && (
        <div className={styles.toolbar}>
          <button className={styles.toolbarBtn} onClick={toggleAllSections}>
            {allSectionsCollapsed ? "▶ Expand All" : "▼ Collapse All"}
          </button>
        </div>
      )}

      {/* Resource Type Sub-Tabs */}
      {showResourceTypeFilter && (
        <div className={styles.subTabBar}>
          <button
            className={`${styles.subTab} ${resourceTypeFilter === "all" ? styles.subTabActive : ""}`}
            onClick={() => setResourceTypeFilter("all")}
          >
            All ({localAssets.length})
          </button>
          {distinctResourceTypes.map((rt) => (
            <button
              key={rt}
              className={`${styles.subTab} ${resourceTypeFilter === rt ? styles.subTabActive : ""}`}
              onClick={() => setResourceTypeFilter(rt)}
            >
              {rt} ({resourceTypeCounts[rt] || 0})
            </button>
          ))}
        </div>
      )}

      {localAssets.length === 0 ? (
        <div className={styles.empty}>
          No scope items to cost. Add items in the Scope of Supply tab first.
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: 36 }}>#</th>
                <th>Equipment Offer</th>
                <th>OII/MFG PN</th>
                <th>Res. Type</th>
                <th>Sub-Type</th>
                <th>Qty Op</th>
                <th>Qty Sp</th>
                <th>Availability</th>
                <th>Acq. Type</th>
                <th>Unit Cost USD</th>
                <th>Total Cost USD</th>
                <th>Cost Ref</th>
                <th>Lead Time</th>
                <th>CAPEX/OPEX</th>
                <th>Supplier</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrderedItems.map((entry) => {
                if (entry.type === "section") {
                  const sec = entry.section;
                  const isCollapsed = collapsedSections.has(sec.id);
                  // In filtered view, count only matching assets
                  const sectionAssets = localAssets.filter((a) => {
                    const si = getScopeItem(a.scopeItemId);
                    if (!si || si.sectionId !== sec.id) return false;
                    if (
                      resourceTypeFilter !== "all" &&
                      si.resourceType !== resourceTypeFilter
                    )
                      return false;
                    return true;
                  });
                  const count = sectionAssets.length;
                  let secCapex = 0;
                  let secOpex = 0;
                  let secOther = 0;
                  sectionAssets.forEach((a) => {
                    const eff = getEffectiveTotal(a);
                    const sicTotal = getSubItemCostsTotal(a);
                    const acqType = (a.acquisitionType || "").toLowerCase();
                    const effectiveCategory =
                      acqType === "rental" || acqType === "workshop"
                        ? "OPEX"
                        : a.costCategory;
                    if (effectiveCategory === "CAPEX")
                      secCapex += eff + sicTotal;
                    else if (effectiveCategory === "OPEX")
                      secOpex += eff + sicTotal;
                    else secOther += eff + sicTotal;
                  });
                  const sectionTotal = secCapex + secOpex + secOther;
                  const sColor = sec.sectionColor || "";
                  const sectionStyle: React.CSSProperties = sColor
                    ? {
                        background: `${sColor}15`,
                        borderBottomColor: sColor,
                        borderBottomWidth: 2,
                        borderBottomStyle: "solid",
                      }
                    : {};
                  const titleColor: React.CSSProperties = sColor
                    ? { color: sColor }
                    : {};
                  const chevronColor: React.CSSProperties = sColor
                    ? { color: sColor }
                    : {};
                  return (
                    <tr key={`sec-${sec.id}`} className={styles.sectionRow}>
                      <td colSpan={COLS} style={sectionStyle}>
                        <div
                          className={styles.sectionHeader}
                          onClick={() => toggleSection(sec.id)}
                        >
                          <span
                            className={`${styles.chevron} ${isCollapsed ? styles.chevronCollapsed : ""}`}
                            style={chevronColor}
                          >
                            ▼
                          </span>
                          <span
                            className={styles.sectionTitle}
                            style={titleColor}
                          >
                            {sec.sectionTitle || "Untitled Section"}
                          </span>
                          <span className={styles.sectionBadge}>
                            ({count} items)
                          </span>
                          <span
                            style={{
                              marginLeft: "auto",
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              fontSize: 12,
                            }}
                          >
                            {secCapex > 0 && (
                              <span
                                style={{
                                  color: "var(--text-secondary)",
                                  fontWeight: 400,
                                }}
                              >
                                CAPEX{" "}
                                <span
                                  style={{
                                    fontWeight: 600,
                                    color: "var(--text-primary)",
                                  }}
                                >
                                  $ {secCapex.toLocaleString()}
                                </span>
                              </span>
                            )}
                            {secOpex > 0 && (
                              <span
                                style={{
                                  color: "var(--text-secondary)",
                                  fontWeight: 400,
                                }}
                              >
                                OPEX{" "}
                                <span
                                  style={{
                                    fontWeight: 600,
                                    color: "var(--text-primary)",
                                  }}
                                >
                                  $ {secOpex.toLocaleString()}
                                </span>
                              </span>
                            )}
                            <span
                              style={{
                                fontWeight: 700,
                                fontSize: 13,
                                color: "var(--text-primary)",
                              }}
                            >
                              $ {sectionTotal.toLocaleString()}
                            </span>
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                }

                const asset = entry.asset;
                const si = entry.scopeItem;
                const qty = (si?.qtyOperational || 0) + (si?.qtySpare || 0);
                const hasSubCosts = (asset.subCosts || []).length > 0;
                const isSubCostExpanded = expandedSubCosts.has(asset.id);
                const siSubItems = (si?.subItems || []) as IScopeSubItem[];
                const siHasSubItems = siSubItems.length > 0;
                const isSubItemsExpanded =
                  siHasSubItems && !collapsedSubItems.has(asset.id);
                const subCostsSum = (asset.subCosts || []).reduce(
                  (s, sc) => s + (sc.costUSD || 0),
                  0,
                );

                return (
                  <React.Fragment key={asset.id}>
                    <tr className={styles.mainItemRow}>
                      {/* Row number from Scope of Supply */}
                      <td
                        className={`${styles.readOnlyCell} ${styles.cellCenter}`}
                        style={{
                          fontWeight: 700,
                          color: "var(--text-secondary)",
                          fontSize: 11,
                        }}
                      >
                        {scopeItemIndex[asset.scopeItemId] || "—"}
                      </td>
                      {/* Read-only from Scope */}
                      <td className={styles.readOnlyCell}>
                        {si?.equipmentOffer || "—"}
                      </td>
                      <td className={styles.readOnlyCell}>
                        {si?.partNumber || "—"}
                      </td>
                      <td className={styles.readOnlyCell}>
                        {si?.resourceType || "—"}
                      </td>
                      <td className={styles.readOnlyCell}>
                        {si?.resourceSubType || "—"}
                      </td>
                      <td
                        className={`${styles.readOnlyCell} ${styles.cellCenter}`}
                      >
                        {si?.qtyOperational ?? 0}
                      </td>
                      <td
                        className={`${styles.readOnlyCell} ${styles.cellCenter}`}
                      >
                        {si?.qtySpare ?? 0}
                      </td>
                      {/* Editable */}
                      <td>
                        {readOnly ? (
                          asset.availabilityStatus || "—"
                        ) : (
                          <select
                            className={emptyIf(
                              styles.selectCell,
                              asset.availabilityStatus,
                            )}
                            value={asset.availabilityStatus}
                            onChange={(e) =>
                              updateField(
                                asset.id,
                                "availabilityStatus",
                                e.target.value,
                              )
                            }
                          >
                            <option value="" disabled hidden>
                              Select...
                            </option>
                            {availabilityStatuses.map((o) => (
                              <option key={o.id} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td>
                        {readOnly
                          ? asset.acquisitionType || "—"
                          : (() => {
                              const avail = (
                                asset.availabilityStatus || ""
                              ).toLowerCase();
                              const isNoCost =
                                avail === "onboard" || avail === "call out";
                              if (isNoCost) {
                                return (
                                  <span
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 600,
                                      color: "var(--text-muted)",
                                    }}
                                  >
                                    N/A
                                  </span>
                                );
                              }
                              return (
                                <select
                                  className={emptyIf(
                                    styles.selectCell,
                                    asset.acquisitionType,
                                  )}
                                  value={asset.acquisitionType}
                                  onChange={(e) =>
                                    updateField(
                                      asset.id,
                                      "acquisitionType",
                                      e.target.value,
                                    )
                                  }
                                >
                                  <option value="" disabled hidden>
                                    Select...
                                  </option>
                                  {(() => {
                                    // Filter acq types by availability status parent
                                    const filtered = asset.availabilityStatus
                                      ? acquisitionTypes.filter((at) => {
                                          const parentVal = (
                                            at.category || ""
                                          ).split("|")[0];
                                          return (
                                            parentVal ===
                                            asset.availabilityStatus
                                          );
                                        })
                                      : [];
                                    // If no filtered results, show all as fallback
                                    const options =
                                      filtered.length > 0
                                        ? filtered
                                        : acquisitionTypes;
                                    return options.map((at) => (
                                      <option key={at.id} value={at.value}>
                                        {at.label}
                                      </option>
                                    ));
                                  })()}
                                </select>
                              );
                            })()}
                      </td>
                      {/* Rental-specific, no-cost, workshop, or normal cost fields */}
                      {(() => {
                        const avail = (
                          asset.availabilityStatus || ""
                        ).toLowerCase();
                        const acqType = (
                          asset.acquisitionType || ""
                        ).toLowerCase();
                        const isRental = acqType === "rental";
                        const isNoCost =
                          avail === "onboard" || avail === "call out";
                        const isWorkshop = acqType === "workshop";
                        const hasAnySubs = (asset.subCosts || []).length > 0;

                        if (isNoCost) {
                          return (
                            <>
                              <td className={`${styles.cellRight}`}>
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: "var(--text-muted)",
                                  }}
                                >
                                  —
                                </span>
                              </td>
                              <td className={`${styles.cellRight}`}>
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: hasAnySubs
                                      ? "var(--text-primary)"
                                      : "var(--text-muted)",
                                    fontWeight: hasAnySubs ? 600 : 400,
                                  }}
                                >
                                  {hasAnySubs
                                    ? `$ ${subCostsSum.toLocaleString()}`
                                    : "$ 0"}
                                </span>
                              </td>
                            </>
                          );
                        }

                        if (isWorkshop) {
                          return (
                            <>
                              <td className={`${styles.cellRight}`}>
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: "var(--text-muted)",
                                  }}
                                >
                                  {hasAnySubs
                                    ? `$ ${subCostsSum.toLocaleString()}`
                                    : "—"}
                                </span>
                              </td>
                              <td className={`${styles.cellRight}`}>
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: hasAnySubs
                                      ? "var(--text-primary)"
                                      : "var(--text-muted)",
                                    fontWeight: hasAnySubs ? 600 : 400,
                                  }}
                                >
                                  {hasAnySubs
                                    ? `$ ${subCostsSum.toLocaleString()}`
                                    : "—"}
                                </span>
                              </td>
                            </>
                          );
                        }

                        if (isRental) {
                          const days = asset.rentalDays || 0;
                          const rate = asset.dailyRate || 0;
                          const rentalTotal = rate * days * (qty || 1);
                          return (
                            <>
                              <td>
                                {readOnly ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 2,
                                    }}
                                  >
                                    <span style={{ fontSize: 12 }}>
                                      $ {rate.toLocaleString()}{" "}
                                      <span
                                        style={{
                                          color: "var(--text-muted)",
                                          fontSize: 10,
                                        }}
                                      >
                                        /day
                                      </span>
                                    </span>
                                    <span
                                      style={{
                                        fontSize: 11,
                                        color: "var(--text-muted)",
                                      }}
                                    >
                                      {days} day{days !== 1 ? "s" : ""}
                                    </span>
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 4,
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: 10,
                                          color: "var(--text-muted)",
                                          minWidth: 52,
                                        }}
                                      >
                                        Daily Rate
                                      </span>
                                      <input
                                        className={styles.numInput}
                                        type="number"
                                        min={0}
                                        step={0.01}
                                        value={rate}
                                        placeholder="0.00"
                                        onChange={(e) =>
                                          updateField(
                                            asset.id,
                                            "dailyRate",
                                            Number(e.target.value) || 0,
                                          )
                                        }
                                        style={{ width: 80 }}
                                      />
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: 10,
                                          color: "var(--text-muted)",
                                          minWidth: 52,
                                        }}
                                      >
                                        Days
                                      </span>
                                      <input
                                        className={styles.numInput}
                                        type="number"
                                        min={0}
                                        value={days}
                                        placeholder="0"
                                        onChange={(e) =>
                                          updateField(
                                            asset.id,
                                            "rentalDays",
                                            Number(e.target.value) || 0,
                                          )
                                        }
                                        style={{ width: 55 }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className={styles.mainTotalCost}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    gap: 2,
                                  }}
                                >
                                  <span>
                                    ${" "}
                                    {(
                                      rentalTotal + subCostsSum
                                    ).toLocaleString()}
                                  </span>
                                  {rate > 0 && days > 0 && (
                                    <span
                                      style={{
                                        fontSize: 10,
                                        color: "var(--text-muted)",
                                        fontWeight: 400,
                                      }}
                                    >
                                      {rate.toLocaleString()} × {days}d × {qty}
                                    </span>
                                  )}
                                </div>
                              </td>
                            </>
                          );
                        }
                        // Normal (non-rental) cost fields
                        return (
                          <>
                            <td>
                              {readOnly ? (
                                `$ ${asset.unitCostUSD.toLocaleString()}`
                              ) : (
                                <input
                                  className={styles.numInput}
                                  type="number"
                                  min={0}
                                  step={0.01}
                                  value={asset.unitCostUSD}
                                  onChange={(e) => {
                                    const cost = Number(e.target.value) || 0;
                                    const updated = localAssets.map((a) =>
                                      a.id === asset.id
                                        ? {
                                            ...a,
                                            unitCostUSD: cost,
                                            totalCostUSD: cost * qty,
                                          }
                                        : a,
                                    );
                                    persist(updated);
                                  }}
                                />
                              )}
                            </td>
                            <td className={styles.mainTotalCost}>
                              ${" "}
                              {(
                                asset.unitCostUSD * qty +
                                subCostsSum
                              ).toLocaleString()}
                            </td>
                          </>
                        );
                      })()}
                      {/* Cost Ref */}
                      <td>
                        {(() => {
                          const av = (
                            asset.availabilityStatus || ""
                          ).toLowerCase();
                          const aq = (
                            asset.acquisitionType || ""
                          ).toLowerCase();
                          const closed =
                            av === "onboard" ||
                            av === "call out" ||
                            aq === "workshop";
                          if (closed) {
                            return (
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "var(--text-muted)",
                                }}
                              >
                                {aq === "workshop" &&
                                (asset.subCosts || []).length > 0
                                  ? (asset.subCosts || [])
                                      .map((sc) => sc.costReference)
                                      .filter(Boolean)
                                      .join(", ") || "—"
                                  : "—"}
                              </span>
                            );
                          }
                          if (readOnly) return asset.costReference || "—";
                          return (
                            <select
                              className={emptyIf(
                                styles.selectCell,
                                asset.costReference,
                              )}
                              value={asset.costReference}
                              onChange={(e) =>
                                updateField(
                                  asset.id,
                                  "costReference",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="" disabled hidden>
                                Select...
                              </option>
                              {costReferences.map((cr) => (
                                <option key={cr.id} value={cr.value}>
                                  {cr.label}
                                </option>
                              ))}
                            </select>
                          );
                        })()}
                      </td>
                      {/* Lead Time */}
                      <td className={styles.cellCenter}>
                        {(() => {
                          const av = (
                            asset.availabilityStatus || ""
                          ).toLowerCase();
                          const aq = (
                            asset.acquisitionType || ""
                          ).toLowerCase();
                          const closed =
                            av === "onboard" ||
                            av === "call out" ||
                            aq === "workshop";
                          if (closed) {
                            if (
                              aq === "workshop" &&
                              (asset.subCosts || []).length > 0
                            ) {
                              const maxLead = (asset.subCosts || []).reduce(
                                (m, sc) => Math.max(m, sc.leadTimeDays || 0),
                                0,
                              );
                              return (
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: "var(--text-muted)",
                                  }}
                                >
                                  {maxLead > 0 ? `${maxLead}d` : "—"}
                                </span>
                              );
                            }
                            return (
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "var(--text-muted)",
                                }}
                              >
                                —
                              </span>
                            );
                          }
                          if (readOnly) return asset.leadTimeDays || "—";
                          return (
                            <input
                              className={styles.numInput}
                              type="number"
                              min={0}
                              value={asset.leadTimeDays}
                              onChange={(e) =>
                                updateField(
                                  asset.id,
                                  "leadTimeDays",
                                  Number(e.target.value) || 0,
                                )
                              }
                              style={{ width: 60 }}
                            />
                          );
                        })()}
                      </td>
                      {/* CAPEX/OPEX */}
                      <td>
                        {(() => {
                          const av = (
                            asset.availabilityStatus || ""
                          ).toLowerCase();
                          const aq = (
                            asset.acquisitionType || ""
                          ).toLowerCase();
                          const closed = av === "onboard" || av === "call out";
                          if (closed)
                            return (
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "var(--text-muted)",
                                }}
                              >
                                —
                              </span>
                            );
                          if (aq === "rental" || aq === "workshop") {
                            return (
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: "var(--primary-accent, #6366f1)",
                                }}
                              >
                                OPEX
                              </span>
                            );
                          }
                          if (readOnly) return asset.costCategory || "—";
                          return (
                            <select
                              className={emptyIf(
                                styles.selectCell,
                                asset.costCategory,
                              )}
                              value={asset.costCategory}
                              onChange={(e) =>
                                updateField(
                                  asset.id,
                                  "costCategory",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="" disabled hidden>
                                Select...
                              </option>
                              <option value="CAPEX">CAPEX</option>
                              <option value="OPEX">OPEX</option>
                            </select>
                          );
                        })()}
                      </td>
                      {/* Supplier */}
                      <td>
                        {(() => {
                          const av = (
                            asset.availabilityStatus || ""
                          ).toLowerCase();
                          const aq = (
                            asset.acquisitionType || ""
                          ).toLowerCase();
                          const closed =
                            av === "onboard" ||
                            av === "call out" ||
                            aq === "workshop";
                          if (closed)
                            return (
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "var(--text-muted)",
                                }}
                              >
                                —
                              </span>
                            );
                          if (readOnly) return asset.supplier || "—";
                          return (
                            <input
                              className={styles.editInput}
                              value={asset.supplier}
                              onChange={(e) =>
                                updateField(
                                  asset.id,
                                  "supplier",
                                  e.target.value,
                                )
                              }
                            />
                          );
                        })()}
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          {readOnly ? (
                            asset.notes || "—"
                          ) : (
                            <input
                              className={styles.editInput}
                              value={asset.notes}
                              onChange={(e) =>
                                updateField(asset.id, "notes", e.target.value)
                              }
                              style={{ flex: 1 }}
                            />
                          )}
                          {!readOnly && (
                            <button
                              className={`${styles.subCostToggle} ${hasSubCosts ? styles.hasSubCosts : ""}`}
                              onClick={() => toggleSubCosts(asset.id)}
                              title={
                                isSubCostExpanded
                                  ? "Hide sub-costs"
                                  : "Show/add sub-costs"
                              }
                            >
                              {hasSubCosts
                                ? `💲${(asset.subCosts || []).length}`
                                : "+💲"}
                            </button>
                          )}
                          {readOnly && hasSubCosts && (
                            <button
                              className={`${styles.subCostToggle} ${styles.hasSubCosts}`}
                              onClick={() => toggleSubCosts(asset.id)}
                              title="View sub-costs"
                            >
                              💲{(asset.subCosts || []).length}
                            </button>
                          )}
                          {siHasSubItems && (
                            <button
                              className={`${styles.subCostToggle} ${styles.hasSubCosts}`}
                              onClick={() => toggleSubItems(asset.id)}
                              title={
                                isSubItemsExpanded
                                  ? "Hide sub-items"
                                  : "View sub-items"
                              }
                            >
                              📦{siSubItems.length}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {/* Sub-costs expandable rows */}
                    {isSubCostExpanded && (
                      <>
                        {(asset.subCosts || []).map((sc) => {
                          // ── Transit Rate sub-cost: special layout ──
                          if (sc.isTransitRate) {
                            const impDays = sc.importDays || 0;
                            const expDays = sc.exportDays || 0;
                            const totalDays = impDays + expDays;
                            const disc = sc.transitDiscount ?? 50;
                            const dailyRate = asset.dailyRate || 0;
                            const transitCost =
                              dailyRate * (disc / 100) * totalDays;
                            return (
                              <tr
                                key={sc.id}
                                className={styles.subCostRow}
                                style={{ background: "rgba(99,102,241,0.04)" }}
                              >
                                <td colSpan={3} />
                                <td colSpan={2} className={styles.subCostLabel}>
                                  <span
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 6,
                                    }}
                                  >
                                    ↳{" "}
                                    <span
                                      style={{
                                        fontWeight: 600,
                                        color: "var(--primary-accent)",
                                      }}
                                    >
                                      Transit Rate
                                    </span>
                                  </span>
                                </td>
                                <td colSpan={4}>
                                  {readOnly ? (
                                    <span style={{ fontSize: 12 }}>
                                      Import: {impDays}d · Export: {expDays}d ·
                                      Discount: {disc}%
                                    </span>
                                  ) : (
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: 6,
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 3,
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: 10,
                                            color: "var(--text-muted)",
                                          }}
                                        >
                                          Import
                                        </span>
                                        <input
                                          className={styles.numInput}
                                          type="number"
                                          min={0}
                                          value={impDays}
                                          onChange={(e) =>
                                            updateSubCost(
                                              asset.id,
                                              sc.id,
                                              "importDays",
                                              Number(e.target.value) || 0,
                                            )
                                          }
                                          style={{ width: 45 }}
                                        />
                                        <span
                                          style={{
                                            fontSize: 10,
                                            color: "var(--text-muted)",
                                          }}
                                        >
                                          d
                                        </span>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 3,
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: 10,
                                            color: "var(--text-muted)",
                                          }}
                                        >
                                          Export
                                        </span>
                                        <input
                                          className={styles.numInput}
                                          type="number"
                                          min={0}
                                          value={expDays}
                                          onChange={(e) =>
                                            updateSubCost(
                                              asset.id,
                                              sc.id,
                                              "exportDays",
                                              Number(e.target.value) || 0,
                                            )
                                          }
                                          style={{ width: 45 }}
                                        />
                                        <span
                                          style={{
                                            fontSize: 10,
                                            color: "var(--text-muted)",
                                          }}
                                        >
                                          d
                                        </span>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 3,
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: 10,
                                            color: "var(--text-muted)",
                                          }}
                                        >
                                          Disc.
                                        </span>
                                        <input
                                          className={styles.numInput}
                                          type="number"
                                          min={0}
                                          max={100}
                                          value={disc}
                                          onChange={(e) =>
                                            updateSubCost(
                                              asset.id,
                                              sc.id,
                                              "transitDiscount",
                                              Number(e.target.value) || 0,
                                            )
                                          }
                                          style={{ width: 45 }}
                                        />
                                        <span
                                          style={{
                                            fontSize: 10,
                                            color: "var(--text-muted)",
                                          }}
                                        >
                                          %
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </td>
                                <td />
                                <td
                                  className={`${styles.cellRight} ${styles.cellBold}`}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "flex-end",
                                      gap: 1,
                                    }}
                                  >
                                    <span>
                                      $ {transitCost.toLocaleString()}
                                    </span>
                                    {dailyRate > 0 && totalDays > 0 && (
                                      <span
                                        style={{
                                          fontSize: 9,
                                          color: "var(--text-muted)",
                                          fontWeight: 400,
                                        }}
                                      >
                                        {dailyRate.toLocaleString()} × {disc}% ×{" "}
                                        {totalDays}d
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  {readOnly ? (
                                    sc.costReference || "—"
                                  ) : (
                                    <select
                                      className={emptyIf(
                                        styles.selectCell,
                                        sc.costReference,
                                      )}
                                      value={sc.costReference || ""}
                                      onChange={(e) =>
                                        updateSubCost(
                                          asset.id,
                                          sc.id,
                                          "costReference",
                                          e.target.value,
                                        )
                                      }
                                    >
                                      <option value="">—</option>
                                      {costReferences.map((cr) => (
                                        <option key={cr.id} value={cr.value}>
                                          {cr.label}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                </td>
                                <td className={styles.cellCenter}>
                                  <span
                                    style={{
                                      fontSize: 12,
                                      color: "var(--text-muted)",
                                    }}
                                  >
                                    {totalDays}d
                                  </span>
                                </td>
                                <td />
                                <td />
                                <td>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 4,
                                    }}
                                  >
                                    {readOnly ? (
                                      sc.notes || "—"
                                    ) : (
                                      <input
                                        className={styles.editInput}
                                        placeholder="Notes..."
                                        value={sc.notes}
                                        onChange={(e) =>
                                          updateSubCost(
                                            asset.id,
                                            sc.id,
                                            "notes",
                                            e.target.value,
                                          )
                                        }
                                        style={{ flex: 1 }}
                                      />
                                    )}
                                    {!readOnly && (
                                      <button
                                        className={styles.deleteSubCost}
                                        onClick={() =>
                                          deleteSubCost(asset.id, sc.id)
                                        }
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                          // ── Normal sub-cost ──
                          return (
                            <tr key={sc.id} className={styles.subCostRow}>
                              <td colSpan={3} />
                              <td colSpan={2} className={styles.subCostLabel}>
                                💲&nbsp;Sub-Cost
                              </td>
                              <td colSpan={4}>
                                {readOnly ? (
                                  sc.description || "—"
                                ) : (
                                  <input
                                    className={styles.editInput}
                                    placeholder="e.g. Pre-job, Post-job, Maintenance..."
                                    value={sc.description}
                                    onChange={(e) =>
                                      updateSubCost(
                                        asset.id,
                                        sc.id,
                                        "description",
                                        e.target.value,
                                      )
                                    }
                                  />
                                )}
                              </td>
                              <td />
                              <td>
                                {readOnly ? (
                                  `$ ${(sc.costUSD || 0).toLocaleString()}`
                                ) : (
                                  <input
                                    className={styles.numInput}
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    value={sc.costUSD}
                                    onChange={(e) =>
                                      updateSubCost(
                                        asset.id,
                                        sc.id,
                                        "costUSD",
                                        Number(e.target.value) || 0,
                                      )
                                    }
                                  />
                                )}
                              </td>
                              <td>
                                {readOnly ? (
                                  sc.costReference || "—"
                                ) : (
                                  <select
                                    className={emptyIf(
                                      styles.selectCell,
                                      sc.costReference,
                                    )}
                                    value={sc.costReference || ""}
                                    onChange={(e) =>
                                      updateSubCost(
                                        asset.id,
                                        sc.id,
                                        "costReference",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="">—</option>
                                    {costReferences.map((cr) => (
                                      <option key={cr.id} value={cr.value}>
                                        {cr.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </td>
                              <td className={styles.cellCenter}>
                                {readOnly ? (
                                  sc.leadTimeDays || "—"
                                ) : (
                                  <input
                                    className={styles.numInput}
                                    type="number"
                                    min={0}
                                    value={sc.leadTimeDays || 0}
                                    onChange={(e) =>
                                      updateSubCost(
                                        asset.id,
                                        sc.id,
                                        "leadTimeDays",
                                        Number(e.target.value) || 0,
                                      )
                                    }
                                    style={{ width: 50 }}
                                  />
                                )}
                              </td>
                              <td />
                              <td />
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  {readOnly ? (
                                    sc.notes || "—"
                                  ) : (
                                    <input
                                      className={styles.editInput}
                                      placeholder="Notes..."
                                      value={sc.notes}
                                      onChange={(e) =>
                                        updateSubCost(
                                          asset.id,
                                          sc.id,
                                          "notes",
                                          e.target.value,
                                        )
                                      }
                                      style={{ flex: 1 }}
                                    />
                                  )}
                                  {!readOnly && (
                                    <button
                                      className={styles.deleteSubCost}
                                      onClick={() =>
                                        deleteSubCost(asset.id, sc.id)
                                      }
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {(asset.subCosts || []).length > 0 && (
                          <tr className={styles.subtotalRow}>
                            <td colSpan={3} />
                            <td colSpan={7} className={styles.subtotalLabel}>
                              Sub-costs subtotal:
                            </td>
                            <td className={styles.subtotalValue}>
                              $ {subCostsSum.toLocaleString()}
                            </td>
                            <td colSpan={COLS - 11} />
                          </tr>
                        )}
                        {!readOnly && (
                          <tr className={styles.subCostRow}>
                            <td colSpan={3} />
                            <td colSpan={COLS - 3}>
                              <button
                                className={styles.addSubCostBtn}
                                onClick={() => addSubCost(asset.id)}
                              >
                                + Add Sub-Cost
                              </button>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                    {/* Sub-items with editable cost fields */}
                    {isSubItemsExpanded && siHasSubItems && (
                      <>
                        {/* Sub-items section header */}
                        <tr className={styles.subItemHeaderRow}>
                          <td colSpan={COLS}>
                            <div className={styles.subItemSectionBar}>
                              <span>📦</span>
                              <span className={styles.subItemSectionTitle}>
                                Sub-Items ({siSubItems.length})
                              </span>
                              <span className={styles.subItemSectionHint}>
                                Consumables, spare parts &amp; accessories
                              </span>
                              {getSubItemCostsTotal(asset) > 0 && (
                                <span className={styles.subItemSectionTotal}>
                                  ${" "}
                                  {getSubItemCostsTotal(asset).toLocaleString()}
                                </span>
                              )}
                              <button
                                className={styles.subItemsPanelClose}
                                onClick={() => toggleSubItems(asset.id)}
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                        {(asset.subItemCosts || []).map((sic) => {
                          const sub = getSubItemForCost(
                            asset.scopeItemId,
                            sic.subItemId,
                          );
                          if (!sub) return null;
                          const sicQty = sub.qty || 1;
                          const sicTotal = (sic.unitCostUSD || 0) * sicQty;
                          return (
                            <tr key={sic.id} className={styles.subItemRow}>
                              {/* Scope info (read-only) */}
                              <td className={styles.subItemReadOnly} />
                              <td className={styles.subItemReadOnly}>
                                <div className={styles.subItemInfo}>
                                  <div>
                                    <div className={styles.subItemName}>
                                      {sub.description ||
                                        sub.equipmentOffer ||
                                        "Sub-item"}
                                    </div>
                                    {sub.partNumber && (
                                      <div className={styles.subItemMeta}>
                                        <span className={styles.subItemPN}>
                                          {sub.partNumber}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td
                                className={`${styles.subItemReadOnly} ${styles.cellMono}`}
                              >
                                {sub.partNumber || "—"}
                              </td>
                              <td className={styles.subItemReadOnly}>
                                {sub.subType || "—"}
                              </td>
                              <td className={styles.subItemReadOnly}>—</td>
                              <td
                                className={`${styles.subItemReadOnly} ${styles.cellCenter}`}
                              >
                                {sicQty}
                              </td>
                              <td
                                className={`${styles.subItemReadOnly} ${styles.cellCenter}`}
                              >
                                —
                              </td>
                              {/* Editable cost fields */}
                              <td>
                                {readOnly ? (
                                  sic.availabilityStatus || "—"
                                ) : (
                                  <select
                                    className={emptyIf(
                                      styles.selectCell,
                                      sic.availabilityStatus,
                                    )}
                                    value={sic.availabilityStatus}
                                    onChange={(e) =>
                                      updateSubItemCost(
                                        asset.id,
                                        sic.id,
                                        "availabilityStatus",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="" disabled hidden>
                                      Select...
                                    </option>
                                    {availabilityStatuses.map((o) => (
                                      <option key={o.id} value={o.value}>
                                        {o.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </td>
                              <td>
                                {readOnly ? (
                                  sic.acquisitionType || "—"
                                ) : (
                                  <select
                                    className={emptyIf(
                                      styles.selectCell,
                                      sic.acquisitionType,
                                    )}
                                    value={sic.acquisitionType}
                                    onChange={(e) =>
                                      updateSubItemCost(
                                        asset.id,
                                        sic.id,
                                        "acquisitionType",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="" disabled hidden>
                                      Select...
                                    </option>
                                    {(() => {
                                      const filtered = sic.availabilityStatus
                                        ? acquisitionTypes.filter((at) => {
                                            const parentVal = (
                                              at.category || ""
                                            ).split("|")[0];
                                            return (
                                              parentVal ===
                                              sic.availabilityStatus
                                            );
                                          })
                                        : [];
                                      const options =
                                        filtered.length > 0
                                          ? filtered
                                          : acquisitionTypes;
                                      return options.map((at) => (
                                        <option key={at.id} value={at.value}>
                                          {at.label}
                                        </option>
                                      ));
                                    })()}
                                  </select>
                                )}
                              </td>
                              <td>
                                {readOnly ? (
                                  `$ ${sic.unitCostUSD.toLocaleString()}`
                                ) : (
                                  <input
                                    className={styles.numInput}
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    value={sic.unitCostUSD}
                                    onChange={(e) =>
                                      updateSubItemCost(
                                        asset.id,
                                        sic.id,
                                        "unitCostUSD",
                                        Number(e.target.value) || 0,
                                      )
                                    }
                                  />
                                )}
                              </td>
                              <td
                                className={`${styles.cellRight} ${styles.cellBold}`}
                              >
                                $ {sicTotal.toLocaleString()}
                                {sicQty > 1 && (
                                  <div
                                    style={{
                                      fontSize: 9,
                                      color: "var(--text-muted)",
                                      fontWeight: 400,
                                    }}
                                  >
                                    {sic.unitCostUSD.toLocaleString()} ×{" "}
                                    {sicQty}
                                  </div>
                                )}
                              </td>
                              <td>
                                {readOnly ? (
                                  sic.costReference || "—"
                                ) : (
                                  <select
                                    className={emptyIf(
                                      styles.selectCell,
                                      sic.costReference,
                                    )}
                                    value={sic.costReference}
                                    onChange={(e) =>
                                      updateSubItemCost(
                                        asset.id,
                                        sic.id,
                                        "costReference",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="">—</option>
                                    {costReferences.map((cr) => (
                                      <option key={cr.id} value={cr.value}>
                                        {cr.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </td>
                              <td className={styles.cellCenter}>
                                {readOnly ? (
                                  sic.leadTimeDays || "—"
                                ) : (
                                  <input
                                    className={styles.numInput}
                                    type="number"
                                    min={0}
                                    value={sic.leadTimeDays}
                                    onChange={(e) =>
                                      updateSubItemCost(
                                        asset.id,
                                        sic.id,
                                        "leadTimeDays",
                                        Number(e.target.value) || 0,
                                      )
                                    }
                                    style={{ width: 50 }}
                                  />
                                )}
                              </td>
                              <td>
                                {readOnly ? (
                                  sic.costCategory || "—"
                                ) : (
                                  <select
                                    className={emptyIf(
                                      styles.selectCell,
                                      sic.costCategory,
                                    )}
                                    value={sic.costCategory}
                                    onChange={(e) =>
                                      updateSubItemCost(
                                        asset.id,
                                        sic.id,
                                        "costCategory",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="" disabled hidden>
                                      Select...
                                    </option>
                                    <option value="CAPEX">CAPEX</option>
                                    <option value="OPEX">OPEX</option>
                                  </select>
                                )}
                              </td>
                              <td>
                                {readOnly ? (
                                  sic.supplier || "—"
                                ) : (
                                  <input
                                    className={styles.editInput}
                                    value={sic.supplier}
                                    onChange={(e) =>
                                      updateSubItemCost(
                                        asset.id,
                                        sic.id,
                                        "supplier",
                                        e.target.value,
                                      )
                                    }
                                  />
                                )}
                              </td>
                              <td>
                                {readOnly ? (
                                  sic.notes || "—"
                                ) : (
                                  <input
                                    className={styles.editInput}
                                    value={sic.notes}
                                    placeholder="Notes..."
                                    onChange={(e) =>
                                      updateSubItemCost(
                                        asset.id,
                                        sic.id,
                                        "notes",
                                        e.target.value,
                                      )
                                    }
                                    style={{ flex: 1 }}
                                  />
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {/* Sub-items subtotal */}
                        {getSubItemCostsTotal(asset) > 0 && (
                          <tr className={styles.subtotalRow}>
                            <td colSpan={3} />
                            <td colSpan={7} className={styles.subtotalLabel}>
                              Sub-items subtotal:
                            </td>
                            <td className={styles.subtotalValue}>
                              $ {getSubItemCostsTotal(asset).toLocaleString()}
                            </td>
                            <td colSpan={COLS - 11} />
                          </tr>
                        )}
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
