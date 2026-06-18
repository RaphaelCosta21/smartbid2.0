import * as React from "react";
import {
  IScopeItem,
  IAssetBreakdownItem,
  IAssetSubCost,
  IScopeSubItem,
  ISubItemCost,
  IAvailabilitySplit,
} from "../../models";
import { useConfigStore } from "../../stores/useConfigStore";
import { makeId } from "../../utils/idGenerator";
import { CostSearchModal, CostSearchImportItem } from "./CostSearchModal";
import { AddQuotationModal } from "./AddQuotationModal";
import { IQuotationItem } from "../../models";
import { useQuotationStore } from "../../stores/useQuotationStore";
import styles from "./AssetsBreakdownTab.module.scss";

interface AssetsBreakdownTabProps {
  scopeItems: IScopeItem[];
  assetBreakdown: IAssetBreakdownItem[];
  onSave: (items: IAssetBreakdownItem[]) => void;
  readOnly?: boolean;
  /** Called when user wants to create a BOM from Search Costs modal (triggers navigation to BOM Costs) */
  onCreateBom?: (partNumber: string, description: string) => void;
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
  costCategory: "OPEX",
  supplier: "",
  leadTimeDays: 0,
  notes: "",
});

/** Format cost number with 2 decimal places and thousands separator */
const fmtCost = (n: number): string =>
  n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/** Format date reference as DD/Mon/YYYY */
const formatDateRef = (isoDate: string): string => {
  if (!isoDate) return "—";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
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

/** Date age class — green (<1y), yellow (1-2y), red (>2y) */
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

/** Known query/catalog source values that get a colored badge */
const QUERY_SOURCES = ["BUMBL", "BUMBR", "BUMCO", "FINANCIALS", "BOM COST"];
const isQuerySource = (ref: string): boolean => {
  if (!ref) return false;
  const upper = ref.toUpperCase();
  return QUERY_SOURCES.some(
    (s) => upper === s || upper.startsWith(s.slice(0, 3)),
  );
};

/** Badge class for query catalog sources */
const costRefBadgeClass = (ref: string): string => {
  if (!ref) return "";
  const upper = ref.toUpperCase();
  if (upper === "BUMBL") return styles.srcBUMBL;
  if (upper === "BUMBR" || upper === "BUMCO") return styles.srcBUMBR;
  if (upper.startsWith("FIN") || upper === "FINANCIALS") return styles.srcFIN;
  if (upper === "BOM COST") return styles.srcBOM;
  return styles.srcOther;
};

export const AssetsBreakdownTab: React.FC<AssetsBreakdownTabProps> = ({
  scopeItems,
  assetBreakdown,
  onSave,
  readOnly = false,
  onCreateBom,
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

  const [expandedSubCosts, setExpandedSubCosts] = React.useState<Set<string>>(
    new Set(),
  );
  const [collapsedSubItems, setCollapsedSubItems] = React.useState<Set<string>>(
    new Set(),
  );
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(
    new Set(),
  );
  const [showCostSearch, setShowCostSearch] = React.useState(false);

  // ─── Add Quotation modal state ───
  const [addQuotationTarget, setAddQuotationTarget] = React.useState<{
    assetId: string;
    subItemCostId?: string;
    partNumber: string;
    description: string;
  } | null>(null);
  // After quotation saved, show picker to import
  const [quotationPickerTarget, setQuotationPickerTarget] = React.useState<{
    assetId: string;
    subItemCostId?: string;
    partNumber: string;
  } | null>(null);
  const quotationItems = useQuotationStore((s) => s.items);

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

  // Debounced save to prevent input lag (same pattern as ScopeOfSupplyTab)
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSave = React.useCallback(
    (updated: IAssetBreakdownItem[]) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveTimerRef.current = null;
        onSave(updated);
      }, 400);
    },
    [onSave],
  );

  // Sync external changes only when no pending save
  React.useEffect(() => {
    if (saveTimerRef.current === null) {
      setLocalAssets(syncedAssets.synced);
    }
  }, [syncedAssets.synced]);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const persist = React.useCallback(
    (updated: IAssetBreakdownItem[]) => {
      setLocalAssets(updated);
      debouncedSave(updated);
    },
    [debouncedSave],
  );

  const updateField = (
    id: string,
    field: keyof IAssetBreakdownItem,
    value: unknown,
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== id) return a;
      const patched = { ...a, [field]: value };

      const NO_COST_STATUSES = ["onboard", "call out", "not offered"];

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
          if (acqVal === "purchase") {
            const si = (scopeItems || []).find(
              (s) => s.id === patched.scopeItemId,
            );
            const subType = (si?.resourceSubType || "").toLowerCase();
            patched.costCategory = subType === "consumable" ? "OPEX" : "CAPEX";
          }
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
              costUSD: rate * (1 - disc) * totalTransitDays,
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

    // Auto-expand sub-costs when Rental is selected (to show Transit Rate)
    if (
      field === "acquisitionType" &&
      String(value).toLowerCase() === "rental"
    ) {
      setExpandedSubCosts((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    }
  };

  /** Bulk-update a field for all assets in a given section */
  const bulkUpdateSectionField = (
    sectionId: string,
    field: keyof IAssetBreakdownItem,
    value: unknown,
  ): void => {
    const sectionAssetIds = new Set(
      localAssets
        .filter((a) => {
          const si = getScopeItem(a.scopeItemId);
          return si && si.sectionId === sectionId;
        })
        .map((a) => a.id),
    );
    if (sectionAssetIds.size === 0) return;

    // Apply updateField logic to each matching asset
    const updated = localAssets.map((a) => {
      if (!sectionAssetIds.has(a.id)) return a;
      const patched = { ...a, [field]: value };
      const NO_COST_STATUSES = ["onboard", "call out", "not offered"];

      if (field === "availabilityStatus") {
        const val = String(value).toLowerCase();
        if (NO_COST_STATUSES.indexOf(val) >= 0) {
          patched.acquisitionType = "N/A";
          patched.costCategory = "";
          patched.unitCostUSD = 0;
          patched.totalCostUSD = 0;
          patched.costReference = "";
          patched.leadTimeDays = 0;
          patched.supplier = "";
          patched.dailyRate = null;
          patched.rentalDays = null;
        } else {
          patched.acquisitionType = "";
          patched.dailyRate = null;
          patched.rentalDays = null;
        }
      }

      if (field === "acquisitionType") {
        const acqVal = String(value).toLowerCase();
        const isRental = acqVal === "rental";
        const isWorkshop = acqVal === "workshop/refurbishment";
        if (isRental) {
          patched.costCategory = "OPEX";
          patched.unitCostUSD = 0;
          patched.totalCostUSD = 0;
          patched.dailyRate = 0;
          patched.rentalDays = 0;
        } else if (isWorkshop) {
          patched.unitCostUSD = 0;
          patched.totalCostUSD = 0;
          patched.costCategory = "OPEX";
          patched.dailyRate = null;
          patched.rentalDays = null;
        } else {
          patched.dailyRate = null;
          patched.rentalDays = null;
          if (acqVal === "purchase") {
            const si = (scopeItems || []).find(
              (s) => s.id === patched.scopeItemId,
            );
            const subType = (si?.resourceSubType || "").toLowerCase();
            patched.costCategory = subType === "consumable" ? "OPEX" : "CAPEX";
          }
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
            patched.costUSD = dailyRate * (1 - disc) * totalTransitDays;
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

          // Handle availability status changes for sub-items
          if (field === "availabilityStatus") {
            const val = String(value).toLowerCase();
            const isNoCost =
              val === "onboard" || val === "call out" || val === "not offered";
            if (isNoCost) {
              patched.acquisitionType = "N/A";
              patched.costCategory = "";
              patched.unitCostUSD = 0;
              patched.totalCostUSD = 0;
              patched.dailyRate = null;
              patched.rentalDays = null;
            } else {
              patched.acquisitionType = "";
              patched.dailyRate = null;
              patched.rentalDays = null;
            }
          }

          // Handle acquisition type changes for sub-items
          if (field === "acquisitionType") {
            const acqVal = String(value).toLowerCase();
            if (acqVal === "rental") {
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
            } else {
              patched.dailyRate = null;
              patched.rentalDays = null;
              patched.subCosts = (patched.subCosts || []).filter(
                (sc) => !sc.isTransitRate,
              );
              if (acqVal === "purchase") {
                // Check sub-item subType for Consumable → OPEX
                const si = (scopeItems || []).find(
                  (s) => s.id === a.scopeItemId,
                );
                const scopeSub = (si?.subItems || []).find(
                  (sub) => sub.id === sic.subItemId,
                );
                const subType = (scopeSub?.subType || "").toLowerCase();
                patched.costCategory =
                  subType === "consumable" ? "OPEX" : "CAPEX";
              }
            }
          }

          // Auto-calc for rental sub-items
          if (field === "dailyRate" || field === "rentalDays") {
            const days =
              field === "rentalDays"
                ? Number(value) || 0
                : patched.rentalDays || 0;
            const rate =
              field === "dailyRate"
                ? Number(value) || 0
                : patched.dailyRate || 0;
            const sub = getSubItemForCost(a.scopeItemId, sic.subItemId);
            const qty = sub?.qty || 1;
            patched.totalCostUSD = rate * days * qty;
            patched.unitCostUSD = rate;
            // Recalculate transit sub-cost
            if (field === "dailyRate") {
              patched.subCosts = (patched.subCosts || []).map((sc) => {
                if (!sc.isTransitRate) return sc;
                const totalTransitDays =
                  (sc.importDays || 0) + (sc.exportDays || 0);
                const disc = (sc.transitDiscount || 0) / 100;
                return {
                  ...sc,
                  costUSD: rate * (1 - disc) * totalTransitDays,
                  leadTimeDays: totalTransitDays,
                };
              });
            }
          }

          // Auto-calc totalCostUSD = unitCostUSD × qty (for non-rental)
          if (
            field === "unitCostUSD" &&
            (patched.acquisitionType || "").toLowerCase() !== "rental"
          ) {
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

  /** Bulk-update a field for all sub-item costs of a given asset */
  const bulkUpdateSubItems = (
    assetId: string,
    field: keyof ISubItemCost,
    value: unknown,
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return {
        ...a,
        subItemCosts: (a.subItemCosts || []).map((sic) => {
          const patched = { ...sic, [field]: value };

          if (field === "availabilityStatus") {
            const val = String(value).toLowerCase();
            const isNoCost =
              val === "onboard" || val === "call out" || val === "not offered";
            if (isNoCost) {
              patched.acquisitionType = "N/A";
              patched.costCategory = "";
              patched.unitCostUSD = 0;
              patched.totalCostUSD = 0;
              patched.dailyRate = null;
              patched.rentalDays = null;
            } else {
              patched.acquisitionType = "";
              patched.dailyRate = null;
              patched.rentalDays = null;
            }
          }

          if (field === "acquisitionType") {
            const acqVal = String(value).toLowerCase();
            if (acqVal === "rental") {
              patched.costCategory = "OPEX";
              patched.unitCostUSD = 0;
              patched.totalCostUSD = 0;
              patched.dailyRate = 0;
              patched.rentalDays = 0;
            } else {
              patched.dailyRate = null;
              patched.rentalDays = null;
              if (acqVal === "purchase") {
                const si = (scopeItems || []).find(
                  (s) => s.id === a.scopeItemId,
                );
                const scopeSub = (si?.subItems || []).find(
                  (sub) => sub.id === sic.subItemId,
                );
                const subType = (scopeSub?.subType || "").toLowerCase();
                patched.costCategory =
                  subType === "consumable" ? "OPEX" : "CAPEX";
              }
            }
          }

          return patched;
        }),
      };
    });
    persist(updated);
  };

  // ─── Sub-item Availability Splits handlers ───
  /** Enable splits for a sub-item cost */
  const handleEnableSubItemSplits = (
    assetId: string,
    subItemCostId: string,
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return {
        ...a,
        subItemCosts: (a.subItemCosts || []).map((sic) => {
          if (sic.id !== subItemCostId) return sic;
          const sub = getSubItemForCost(a.scopeItemId, sic.subItemId);
          const sicQty = sub?.qty || 1;
          const firstSplit: IAvailabilitySplit = {
            id: makeId("split"),
            qty: sicQty,
            availabilityStatus: sic.availabilityStatus || "",
            acquisitionType: sic.acquisitionType || "",
            unitCostUSD: sic.unitCostUSD || 0,
            totalCostUSD: sic.totalCostUSD || 0,
            costReference: sic.costReference || "",
            dateReference: sic.dateReference,
            costCategory: sic.costCategory || "",
            supplier: sic.supplier || "",
            leadTimeDays: sic.leadTimeDays || 0,
            dailyRate: sic.dailyRate || null,
            rentalDays: sic.rentalDays || null,
            notes: "",
            subCosts: [],
          };
          return { ...sic, availabilitySplits: [firstSplit] };
        }),
      };
    });
    persist(updated);
  };

  /** Disable splits for a sub-item cost */
  const handleDisableSubItemSplits = (
    assetId: string,
    subItemCostId: string,
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return {
        ...a,
        subItemCosts: (a.subItemCosts || []).map((sic) => {
          if (sic.id !== subItemCostId) return sic;
          const first = (sic.availabilitySplits || [])[0];
          if (first) {
            return {
              ...sic,
              availabilitySplits: undefined,
              availabilityStatus: first.availabilityStatus || "",
              acquisitionType: first.acquisitionType || "",
              unitCostUSD: first.unitCostUSD || 0,
              costReference: first.costReference || "",
              dateReference: first.dateReference,
              costCategory: (first.costCategory ||
                "") as ISubItemCost["costCategory"],
              supplier: first.supplier || "",
              leadTimeDays: first.leadTimeDays || 0,
              dailyRate: first.dailyRate,
              rentalDays: first.rentalDays,
            };
          }
          return { ...sic, availabilitySplits: undefined };
        }),
      };
    });
    persist(updated);
  };

  /** Add a split to a sub-item cost */
  const handleAddSubItemSplit = (
    assetId: string,
    subItemCostId: string,
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return {
        ...a,
        subItemCosts: (a.subItemCosts || []).map((sic) => {
          if (sic.id !== subItemCostId) return sic;
          const sub = getSubItemForCost(a.scopeItemId, sic.subItemId);
          const sicQty = sub?.qty || 1;
          const assignedQty = (sic.availabilitySplits || []).reduce(
            (s, sp) => s + (sp.qty || 0),
            0,
          );
          const remaining = Math.max(0, sicQty - assignedQty);
          return {
            ...sic,
            availabilitySplits: [
              ...(sic.availabilitySplits || []),
              blankSplit(remaining),
            ],
          };
        }),
      };
    });
    persist(updated);
  };

  /** Remove a split from a sub-item cost */
  const handleRemoveSubItemSplit = (
    assetId: string,
    subItemCostId: string,
    splitId: string,
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return {
        ...a,
        subItemCosts: (a.subItemCosts || []).map((sic) => {
          if (sic.id !== subItemCostId) return sic;
          const filtered = (sic.availabilitySplits || []).filter(
            (sp) => sp.id !== splitId,
          );
          if (filtered.length === 0)
            return { ...sic, availabilitySplits: undefined };
          return { ...sic, availabilitySplits: filtered };
        }),
      };
    });
    persist(updated);
  };

  /** Update a field on a sub-item's split */
  const handleUpdateSubItemSplit = (
    assetId: string,
    subItemCostId: string,
    splitId: string,
    field: keyof IAvailabilitySplit,
    value: unknown,
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return {
        ...a,
        subItemCosts: (a.subItemCosts || []).map((sic) => {
          if (sic.id !== subItemCostId) return sic;
          const splits = (sic.availabilitySplits || []).map((sp) => {
            if (sp.id !== splitId) return sp;
            const patched = { ...sp, [field]: value };
            const NO_COST_STATUSES = ["onboard", "call out", "not offered"];
            if (field === "availabilityStatus") {
              const val = String(value).toLowerCase();
              if (NO_COST_STATUSES.indexOf(val) >= 0) {
                patched.acquisitionType = "N/A";
                patched.costCategory = "";
                patched.unitCostUSD = 0;
                patched.totalCostUSD = 0;
                patched.dailyRate = null;
                patched.rentalDays = null;
              } else {
                patched.acquisitionType = "";
                patched.dailyRate = null;
                patched.rentalDays = null;
              }
            }
            if (field === "acquisitionType") {
              const acqVal = String(value).toLowerCase();
              if (acqVal === "rental") {
                patched.costCategory = "OPEX";
                patched.unitCostUSD = 0;
                patched.dailyRate = 0;
                patched.rentalDays = 0;
              } else if (acqVal === "workshop") {
                patched.unitCostUSD = 0;
                patched.costCategory = "OPEX";
                patched.dailyRate = null;
                patched.rentalDays = null;
              } else {
                patched.dailyRate = null;
                patched.rentalDays = null;
                if (acqVal === "purchase") patched.costCategory = "CAPEX";
              }
            }
            if (field === "dailyRate" || field === "rentalDays") {
              const days =
                field === "rentalDays"
                  ? Number(value) || 0
                  : patched.rentalDays || 0;
              const rate =
                field === "dailyRate"
                  ? Number(value) || 0
                  : patched.dailyRate || 0;
              patched.totalCostUSD = rate * days * (patched.qty || 1);
            }
            if (field === "unitCostUSD") {
              const acq = (patched.acquisitionType || "").toLowerCase();
              if (acq !== "rental")
                patched.totalCostUSD =
                  (Number(value) || 0) * (patched.qty || 1);
            }
            if (field === "qty") {
              const acq = (patched.acquisitionType || "").toLowerCase();
              const newQty = Number(value) || 0;
              if (acq === "rental")
                patched.totalCostUSD =
                  (patched.dailyRate || 0) * (patched.rentalDays || 0) * newQty;
              else patched.totalCostUSD = (patched.unitCostUSD || 0) * newQty;
            }
            return patched;
          });
          return { ...sic, availabilitySplits: splits };
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
    // If availability splits are active, use sum of individual split costs
    if (sic.availabilitySplits && sic.availabilitySplits.length > 0) {
      return sic.availabilitySplits.reduce((sum, split) => {
        const splitAvail = (split.availabilityStatus || "").toLowerCase();
        const splitAcq = (split.acquisitionType || "").toLowerCase();
        const splitSubSum = (split.subCosts || []).reduce(
          (s, sc) => s + (sc.costUSD || 0),
          0,
        );
        const splitQty = split.qty || 0;
        if (
          splitAvail === "onboard" ||
          splitAvail === "call out" ||
          splitAvail === "not offered"
        )
          return sum + splitSubSum;
        if (splitAcq === "workshop") return sum + splitSubSum;
        if (splitAcq === "rental")
          return (
            sum +
            (split.dailyRate || 0) * (split.rentalDays || 0) * splitQty +
            splitSubSum
          );
        return sum + (split.unitCostUSD || 0) * splitQty + splitSubSum;
      }, 0);
    }

    const avail = (sic.availabilityStatus || "").toLowerCase();
    if (avail === "onboard" || avail === "call out" || avail === "not offered")
      return 0;
    const sub = getSubItemForCost(scopeItemId, sic.subItemId);
    const qty = sub?.qty || 1;
    const isRental = (sic.acquisitionType || "").toLowerCase() === "rental";
    if (isRental) return (sic.dailyRate || 0) * (sic.rentalDays || 0) * qty;
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

  // ─── Availability Splits state & handlers ───
  const [expandedSplits, setExpandedSplits] = React.useState<Set<string>>(
    new Set(),
  );

  const toggleSplitsExpanded = (assetId: string): void => {
    setExpandedSplits((prev) => {
      const next = new Set(prev);
      if (next.has(assetId)) next.delete(assetId);
      else next.add(assetId);
      return next;
    });
  };

  const blankSplit = (qty: number): IAvailabilitySplit => ({
    id: makeId("split"),
    qty,
    availabilityStatus: "",
    acquisitionType: "",
    unitCostUSD: 0,
    totalCostUSD: 0,
    costReference: "",
    costCategory: "",
    supplier: "",
    leadTimeDays: 0,
    dailyRate: null,
    rentalDays: null,
    notes: "",
    subCosts: [],
  });

  /** Enable splits for an asset — creates first split covering full qty */
  const handleEnableSplits = (assetId: string): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      const si = getScopeItem(a.scopeItemId);
      const totalQty = (si?.qtyOperational || 0) + (si?.qtySpare || 0) || 1;
      // Create first split from current values, second blank for user to fill
      const firstSplit: IAvailabilitySplit = {
        id: makeId("split"),
        qty: totalQty,
        availabilityStatus: a.availabilityStatus || "",
        acquisitionType: a.acquisitionType || "",
        unitCostUSD: a.unitCostUSD || 0,
        totalCostUSD: a.totalCostUSD || 0,
        costReference: a.costReference || "",
        dateReference: a.dateReference,
        costCategory: a.costCategory || "",
        supplier: a.supplier || "",
        leadTimeDays: a.leadTimeDays || 0,
        dailyRate: a.dailyRate,
        rentalDays: a.rentalDays,
        notes: "",
        subCosts: a.subCosts || [],
      };
      return { ...a, availabilitySplits: [firstSplit], subCosts: [] };
    });
    persist(updated);
    // Auto-expand the splits area
    setExpandedSplits((prev) => new Set(prev).add(assetId));
  };

  /** Disable all splits for an asset — reverts to normal mode */
  const handleDisableSplits = (assetId: string): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      // Take values from first split if exists
      const first = (a.availabilitySplits || [])[0];
      if (first) {
        return {
          ...a,
          availabilitySplits: undefined,
          availabilityStatus: (first.availabilityStatus ||
            "") as IAssetBreakdownItem["availabilityStatus"],
          acquisitionType: first.acquisitionType || "",
          unitCostUSD: first.unitCostUSD || 0,
          costReference: first.costReference || "",
          dateReference: first.dateReference,
          costCategory: (first.costCategory ||
            "") as IAssetBreakdownItem["costCategory"],
          supplier: first.supplier || "",
          leadTimeDays: first.leadTimeDays || 0,
          dailyRate: first.dailyRate,
          rentalDays: first.rentalDays,
          subCosts: first.subCosts || [],
        };
      }
      return { ...a, availabilitySplits: undefined };
    });
    persist(updated);
    setExpandedSplits((prev) => {
      const next = new Set(prev);
      next.delete(assetId);
      return next;
    });
  };

  /** Add a new blank split to an asset */
  const handleAddSplit = (assetId: string): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      const si = getScopeItem(a.scopeItemId);
      const totalQty = (si?.qtyOperational || 0) + (si?.qtySpare || 0) || 1;
      const assignedQty = (a.availabilitySplits || []).reduce(
        (s, sp) => s + (sp.qty || 0),
        0,
      );
      const remaining = Math.max(0, totalQty - assignedQty);
      const splits = [...(a.availabilitySplits || []), blankSplit(remaining)];
      return { ...a, availabilitySplits: splits };
    });
    persist(updated);
  };

  /** Remove a split from an asset */
  const handleRemoveSplit = (assetId: string, splitId: string): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      const filtered = (a.availabilitySplits || []).filter(
        (sp) => sp.id !== splitId,
      );
      // If no splits left, revert to normal mode
      if (filtered.length === 0) {
        return { ...a, availabilitySplits: undefined };
      }
      return { ...a, availabilitySplits: filtered };
    });
    persist(updated);
  };

  /** Update a field on a specific split */
  const handleUpdateSplit = (
    assetId: string,
    splitId: string,
    field: keyof IAvailabilitySplit,
    value: unknown,
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      const splits = (a.availabilitySplits || []).map((sp) => {
        if (sp.id !== splitId) return sp;
        const patched = { ...sp, [field]: value };

        const NO_COST_STATUSES = ["onboard", "call out", "not offered"];

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
            patched.acquisitionType = "";
            patched.dailyRate = null;
            patched.rentalDays = null;
          }
        }

        // When acquisition type changes
        if (field === "acquisitionType") {
          const acqVal = String(value).toLowerCase();
          if (acqVal === "rental") {
            patched.costCategory = "OPEX";
            patched.unitCostUSD = 0;
            patched.totalCostUSD = 0;
            patched.dailyRate = 0;
            patched.rentalDays = 0;
            // Auto-add Transit Rate sub-cost if not present
            const subs = patched.subCosts || [];
            const hasTransit = subs.some((sc) => sc.isTransitRate);
            if (!hasTransit) {
              patched.subCosts = [
                {
                  id: makeId("sc"),
                  description: "Transit Rate",
                  costUSD: 0,
                  notes: "",
                  isTransitRate: true,
                  importDays: 0,
                  exportDays: 0,
                  transitDiscount: 50,
                },
                ...subs,
              ];
            }
          } else if (acqVal === "workshop") {
            patched.unitCostUSD = 0;
            patched.totalCostUSD = 0;
            patched.costCategory = "OPEX";
            patched.dailyRate = null;
            patched.rentalDays = null;
          } else {
            patched.dailyRate = null;
            patched.rentalDays = null;
            if (acqVal === "purchase") {
              patched.costCategory = "CAPEX";
            }
          }
        }

        // Recalculate total for rental splits
        if (field === "dailyRate" || field === "rentalDays") {
          const days =
            field === "rentalDays"
              ? Number(value) || 0
              : patched.rentalDays || 0;
          const rate =
            field === "dailyRate" ? Number(value) || 0 : patched.dailyRate || 0;
          patched.totalCostUSD = rate * days * (patched.qty || 1);
          patched.unitCostUSD = rate;
          // Recalculate transit sub-cost
          if (field === "dailyRate") {
            patched.subCosts = (patched.subCosts || []).map((sc) => {
              if (!sc.isTransitRate) return sc;
              const totalTransitDays =
                (sc.importDays || 0) + (sc.exportDays || 0);
              const disc = (sc.transitDiscount || 0) / 100;
              return {
                ...sc,
                costUSD: rate * (1 - disc) * totalTransitDays,
                leadTimeDays: totalTransitDays,
              };
            });
          }
        }

        // Recalculate total for normal cost
        if (field === "unitCostUSD") {
          const acq = (patched.acquisitionType || "").toLowerCase();
          if (acq !== "rental") {
            patched.totalCostUSD = (Number(value) || 0) * (patched.qty || 1);
          }
        }

        // Recalculate total when qty changes
        if (field === "qty") {
          const acq = (patched.acquisitionType || "").toLowerCase();
          const newQty = Number(value) || 0;
          if (acq === "rental") {
            patched.totalCostUSD =
              (patched.dailyRate || 0) * (patched.rentalDays || 0) * newQty;
          } else {
            patched.totalCostUSD = (patched.unitCostUSD || 0) * newQty;
          }
        }

        return patched;
      });
      return { ...a, availabilitySplits: splits };
    });
    persist(updated);
  };

  /** Update a sub-cost field within a split */
  const updateSplitSubCost = (
    assetId: string,
    splitId: string,
    subCostId: string,
    field: keyof IAssetSubCost,
    value: unknown,
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      const splits = (a.availabilitySplits || []).map((sp) => {
        if (sp.id !== splitId) return sp;
        const updatedSubs = (sp.subCosts || []).map((sc) => {
          if (sc.id !== subCostId) return sc;
          const patched = { ...sc, [field]: value };
          if (
            patched.isTransitRate &&
            (field === "importDays" ||
              field === "exportDays" ||
              field === "transitDiscount")
          ) {
            const totalTransitDays =
              (patched.importDays || 0) + (patched.exportDays || 0);
            const disc = (patched.transitDiscount || 0) / 100;
            const dailyRate = sp.dailyRate || 0;
            patched.costUSD = dailyRate * (1 - disc) * totalTransitDays;
            patched.leadTimeDays = totalTransitDays;
          }
          return patched;
        });
        return { ...sp, subCosts: updatedSubs };
      });
      return { ...a, availabilitySplits: splits };
    });
    persist(updated);
  };

  /** Update a sub-cost field within a sub-item cost */
  const updateSubItemSubCost = (
    assetId: string,
    subItemCostId: string,
    subCostId: string,
    field: keyof IAssetSubCost,
    value: unknown,
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return {
        ...a,
        subItemCosts: (a.subItemCosts || []).map((sic) => {
          if (sic.id !== subItemCostId) return sic;
          const updatedSubs = (sic.subCosts || []).map((sc) => {
            if (sc.id !== subCostId) return sc;
            const patched = { ...sc, [field]: value };
            if (
              patched.isTransitRate &&
              (field === "importDays" ||
                field === "exportDays" ||
                field === "transitDiscount")
            ) {
              const totalTransitDays =
                (patched.importDays || 0) + (patched.exportDays || 0);
              const disc = (patched.transitDiscount || 0) / 100;
              const dailyRate = sic.dailyRate || 0;
              patched.costUSD = dailyRate * (1 - disc) * totalTransitDays;
              patched.leadTimeDays = totalTransitDays;
            }
            return patched;
          });
          return { ...sic, subCosts: updatedSubs };
        }),
      };
    });
    persist(updated);
  };

  /** Get remaining qty for splits validation */
  const getSplitsRemainingQty = (asset: IAssetBreakdownItem): number => {
    const si = getScopeItem(asset.scopeItemId);
    const totalQty = (si?.qtyOperational || 0) + (si?.qtySpare || 0) || 1;
    const assignedQty = (asset.availabilitySplits || []).reduce(
      (s, sp) => s + (sp.qty || 0),
      0,
    );
    return totalQty - assignedQty;
  };

  // Scope item lookup
  const getScopeItem = (scopeItemId: string): IScopeItem | undefined =>
    (scopeItems || []).find((s) => s.id === scopeItemId);

  /** Compute the effective displayed total for an asset (matches what Total Cost USD column shows) */
  const getEffectiveTotal = (a: IAssetBreakdownItem): number => {
    // If availability splits are active, use sum of individual split costs
    if (a.availabilitySplits && a.availabilitySplits.length > 0) {
      return a.availabilitySplits.reduce((sum, split) => {
        const splitAvail = (split.availabilityStatus || "").toLowerCase();
        const splitAcq = (split.acquisitionType || "").toLowerCase();
        const splitSubSum = (split.subCosts || []).reduce(
          (s, sc) => s + (sc.costUSD || 0),
          0,
        );
        const splitQty = split.qty || 0;

        if (
          splitAvail === "onboard" ||
          splitAvail === "call out" ||
          splitAvail === "not offered"
        ) {
          return sum + splitSubSum;
        }
        if (splitAcq === "workshop") {
          return sum + splitSubSum;
        }
        if (splitAcq === "rental") {
          return (
            sum +
            (split.dailyRate || 0) * (split.rentalDays || 0) * splitQty +
            splitSubSum
          );
        }
        return sum + (split.unitCostUSD || 0) * splitQty + splitSubSum;
      }, 0);
    }

    const avail = (a.availabilityStatus || "").toLowerCase();
    const acqType = (a.acquisitionType || "").toLowerCase();
    const scSum = (a.subCosts || []).reduce(
      (s, sc) => s + (sc.costUSD || 0),
      0,
    );
    const si = getScopeItem(a.scopeItemId);
    const qty = (si?.qtyOperational || 0) + (si?.qtySpare || 0) || 1;

    if (
      avail === "onboard" ||
      avail === "call out" ||
      avail === "not offered"
    ) {
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
      return sum + getSubItemCostTotal(sic, a.scopeItemId);
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
    const byResourceType: Record<string, number> = {};
    localAssets.forEach((a) => {
      const si = getScopeItem(a.scopeItemId);
      const resType = si?.resourceType || "";
      const effectiveTotal = getEffectiveTotal(a);
      const assetSubCosts = (a.subCosts || []).reduce(
        (s, sc) => s + (sc.costUSD || 0),
        0,
      );
      const sicTotal = getSubItemCostsTotal(a);

      // When splits exist, categorize each split's cost by its own costCategory
      if (a.availabilitySplits && a.availabilitySplits.length > 0) {
        a.availabilitySplits.forEach((split) => {
          const splitAvail = (split.availabilityStatus || "").toLowerCase();
          const splitAcq = (split.acquisitionType || "").toLowerCase();
          const splitSubSum = (split.subCosts || []).reduce(
            (s, sc) => s + (sc.costUSD || 0),
            0,
          );
          const splitQty = split.qty || 0;
          let splitCost = 0;
          if (
            splitAvail === "onboard" ||
            splitAvail === "call out" ||
            splitAvail === "not offered"
          ) {
            splitCost = splitSubSum;
          } else if (splitAcq === "workshop") {
            splitCost = splitSubSum;
          } else if (splitAcq === "rental") {
            splitCost =
              (split.dailyRate || 0) * (split.rentalDays || 0) * splitQty +
              splitSubSum;
          } else {
            splitCost = (split.unitCostUSD || 0) * splitQty + splitSubSum;
          }
          const splitCategory =
            splitAcq === "rental" || splitAcq === "workshop"
              ? "OPEX"
              : split.costCategory;
          if (splitCategory === "CAPEX") capex += splitCost;
          else if (splitCategory === "OPEX") opex += splitCost;
          else uncategorized += splitCost;
        });
      } else {
        // No splits: categorize by parent's category
        const acqType = (a.acquisitionType || "").toLowerCase();
        const effectiveCategory =
          acqType === "rental" || acqType === "workshop"
            ? "OPEX"
            : a.costCategory;
        if (effectiveCategory === "CAPEX") capex += effectiveTotal;
        else if (effectiveCategory === "OPEX") opex += effectiveTotal;
        else uncategorized += effectiveTotal;
      }

      // Categorize each sub-item cost by its OWN costCategory
      (a.subItemCosts || []).forEach((sic) => {
        const sicCost = getSubItemCostTotal(sic, a.scopeItemId);
        const sicAcqType = (sic.acquisitionType || "").toLowerCase();
        const sicCategory =
          sicAcqType === "rental" || sicAcqType === "workshop"
            ? "OPEX"
            : sic.costCategory;
        if (sicCategory === "CAPEX") capex += sicCost;
        else if (sicCategory === "OPEX") opex += sicCost;
        else uncategorized += sicCost;
      });

      const itemGrand = effectiveTotal + sicTotal;
      subCostsTotal += assetSubCosts;
      subItemCostsTotal += sicTotal;

      if (resType) {
        byResourceType[resType] = (byResourceType[resType] || 0) + itemGrand;
      }
    });
    return {
      capex,
      opex,
      total: capex + opex + uncategorized,
      subCostsTotal,
      subItemCostsTotal,
      byResourceType,
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
      const acqType = (a.acquisitionType || "").toLowerCase();
      const isNoCost =
        avail === "onboard" || avail === "call out" || avail === "not offered";
      const isNoCostAcq = acqType === "workshop" || acqType === "in house";

      // Count main items (skip no-cost statuses and no-cost acquisition types)
      if (!isNoCost && !isNoCostAcq) {
        itemsTotal++;
        const effectiveTotal = getEffectiveTotal(a);
        if (effectiveTotal === 0) {
          itemsMissing++;
        }
      }

      // Count sub-item costs (skip no-cost sub-items)
      (a.subItemCosts || []).forEach((sic) => {
        const sicAvail = (sic.availabilityStatus || "").toLowerCase();
        const sicAcq = (sic.acquisitionType || "").toLowerCase();
        const sicIsNoCost =
          sicAvail === "onboard" ||
          sicAvail === "call out" ||
          sicAvail === "not offered";
        const sicIsNoCostAcq = sicAcq === "workshop" || sicAcq === "in house";
        if (sicIsNoCost || sicIsNoCostAcq) return;
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

  // ─── Missing items detail list ───
  const [showMissingItems, setShowMissingItems] = React.useState(false);

  const missingItemsList = React.useMemo(() => {
    const items: Array<{
      type: "main" | "sub";
      assetId: string;
      sectionId: string | null;
      lineNumber: number;
      equipmentOffer: string;
      partNumber: string;
      resourceType: string;
      resourceSubType: string;
    }> = [];

    localAssets.forEach((a) => {
      const avail = (a.availabilityStatus || "").toLowerCase();
      const acqType = (a.acquisitionType || "").toLowerCase();
      const isNoCost =
        avail === "onboard" || avail === "call out" || avail === "not offered";
      const isNoCostAcq = acqType === "workshop" || acqType === "in house";
      const si = getScopeItem(a.scopeItemId);

      if (!isNoCost && !isNoCostAcq) {
        const effectiveTotal = getEffectiveTotal(a);
        if (effectiveTotal === 0 && si) {
          items.push({
            type: "main",
            assetId: a.id,
            sectionId: si.sectionId || null,
            lineNumber: si.lineNumber,
            equipmentOffer: si.equipmentOffer || si.description || "—",
            partNumber: si.partNumber || "—",
            resourceType: si.resourceType || "—",
            resourceSubType: si.resourceSubType || "—",
          });
        }
      }

      (a.subItemCosts || []).forEach((sic) => {
        const sicAvail = (sic.availabilityStatus || "").toLowerCase();
        const sicAcq = (sic.acquisitionType || "").toLowerCase();
        const sicIsNoCost =
          sicAvail === "onboard" ||
          sicAvail === "call out" ||
          sicAvail === "not offered";
        const sicIsNoCostAcq = sicAcq === "workshop" || sicAcq === "in house";
        if (sicIsNoCost || sicIsNoCostAcq) return;
        const sicTotal = getSubItemCostTotal(sic, a.scopeItemId);
        if (sicTotal === 0 && si) {
          const sub = (si.subItems || []).find((s) => s.id === sic.subItemId);
          items.push({
            type: "sub",
            assetId: a.id,
            sectionId: si.sectionId || null,
            lineNumber: si.lineNumber,
            equipmentOffer: sub
              ? sub.equipmentOffer || sub.description || "Sub-item"
              : "Sub-item",
            partNumber: sub ? sub.partNumber || "—" : "—",
            resourceType: si.resourceType || "—",
            resourceSubType: sub ? sub.subType || "—" : "—",
          });
        }
      });
    });

    return items;
  }, [localAssets, scopeItems]);

  const scrollToAsset = React.useCallback(
    (assetId: string, sectionId: string | null) => {
      // Uncollapse the section if it's collapsed
      if (sectionId && collapsedSections.has(sectionId)) {
        setCollapsedSections((prev) => {
          const next = new Set(prev);
          next.delete(sectionId);
          return next;
        });
      }
      // Wait for DOM update, then scroll
      setTimeout(() => {
        const el = document.getElementById(`asset-row-${assetId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add(styles.highlightRow);
          setTimeout(() => el.classList.remove(styles.highlightRow), 2000);
        }
      }, 100);
    },
    [collapsedSections],
  );

  // ─── Cost Search import handler ───
  const handleCostSearchImport = (items: CostSearchImportItem[]): void => {
    const updated = localAssets.map((a) => {
      // Check for main-item matches
      const mainMatch = items.find(
        (i) => i.assetId === a.id && !i.subItemCostId,
      );
      // Check for sub-item matches
      const subMatches = items.filter(
        (i) => i.assetId === a.id && i.subItemCostId,
      );

      let patched = a;

      if (mainMatch) {
        const scopeItem = getScopeItem(a.scopeItemId);
        const qty =
          (scopeItem?.qtyOperational || 0) + (scopeItem?.qtySpare || 0) || 1;
        patched = {
          ...patched,
          unitCostUSD: mainMatch.unitCostUSD,
          totalCostUSD: mainMatch.unitCostUSD * qty,
          costReference: mainMatch.costReference,
          dateReference: mainMatch.dateReference || mainMatch.costDate,
          leadTimeDays: mainMatch.leadTimeDays,
          originalCost: mainMatch.originalCost,
          originalCurrency: mainMatch.originalCurrency,
          costDate: mainMatch.costDate,
          costCalcMethod: "auto" as const,
          ...(mainMatch.supplier ? { supplier: mainMatch.supplier } : {}),
        };
      }

      if (subMatches.length > 0) {
        const updatedSubCosts = (patched.subItemCosts || []).map((sic) => {
          const sm = subMatches.find((i) => i.subItemCostId === sic.id);
          if (!sm) return sic;
          // Get qty from scope sub-item
          const scopeItem = getScopeItem(a.scopeItemId);
          const scopeSub = (scopeItem?.subItems || []).find(
            (s) => s.id === sic.subItemId,
          );
          const qty = scopeSub?.qty || 1;
          return {
            ...sic,
            unitCostUSD: sm.unitCostUSD,
            totalCostUSD: sm.unitCostUSD * qty,
            costReference: sm.costReference,
            dateReference: sm.dateReference || sm.costDate,
            leadTimeDays: sm.leadTimeDays,
            originalCost: sm.originalCost,
            originalCurrency: sm.originalCurrency,
            costDate: sm.costDate,
            ...(sm.supplier ? { supplier: sm.supplier } : {}),
          };
        });
        patched = { ...patched, subItemCosts: updatedSubCosts };
      }

      if (!mainMatch && subMatches.length === 0) return a;
      return patched;
    });
    persist(updated);
  };

  // ─── Add Quotation handlers ───
  const handleAddQuotation = (
    assetId: string,
    partNumber: string,
    description: string,
    subItemCostId?: string,
  ): void => {
    setAddQuotationTarget({ assetId, subItemCostId, partNumber, description });
  };

  const handleQuotationSaved = (newItems: IQuotationItem[]): void => {
    setAddQuotationTarget(null);
    // Open the picker to let user choose which quotation(s) to import
    if (newItems.length > 0) {
      const first = newItems[0];
      setQuotationPickerTarget({
        assetId: addQuotationTarget?.assetId || "",
        subItemCostId: addQuotationTarget?.subItemCostId,
        partNumber: first.partNumber,
      });
    }
  };

  const handleQuotationPickerImport = (item: IQuotationItem): void => {
    if (!quotationPickerTarget) return;
    const { assetId, subItemCostId } = quotationPickerTarget;

    const importItems: CostSearchImportItem[] = [
      {
        assetId,
        subItemCostId,
        unitCostUSD: item.costUSD || item.cost,
        costReference: item.supplier || "Quote",
        dateReference: item.quotationDate || "",
        leadTimeDays: item.leadTimeDays || 0,
        originalCost: item.cost,
        originalCurrency: item.currency || "USD",
        costDate: item.quotationDate || "",
        supplier: item.supplier || "",
      },
    ];
    handleCostSearchImport(importItems);
    setQuotationPickerTarget(null);
  };

  // ─── Tooltip position helper (above/below viewport detection) ───
  const handleSpecsHover = React.useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      const indicator = e.currentTarget;
      const tooltip = indicator.querySelector(
        `.${styles.specsTooltip}`,
      ) as HTMLElement | null;
      if (!tooltip) return;
      const rect = indicator.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // If the bottom of the indicator is in the lower 35% of the viewport, show above
      if (rect.bottom > viewportHeight * 0.65) {
        tooltip.classList.add(styles.specsTooltipAbove);
      } else {
        tooltip.classList.remove(styles.specsTooltipAbove);
      }
    },
    [],
  );

  const COLS = 17;

  return (
    <div className={styles.container}>
      {/* Summary */}
      <div className={styles.summaryRow}>
        {/* Dynamic resource type cards */}
        {Object.keys(totals.byResourceType).length > 1 && (
          <>
            {Object.keys(totals.byResourceType).map((rt) => (
              <div key={rt} className={styles.summaryCard}>
                <span className={styles.summaryLabel}>{rt}</span>
                <span className={styles.summaryValue}>
                  $ {fmtCost(totals.byResourceType[rt])}
                </span>
              </div>
            ))}
          </>
        )}
        <div className={`${styles.summaryCard} ${styles.summaryCardTotal}`}>
          <span className={styles.summaryLabel}>Total</span>
          <span className={styles.summaryValue}>$ {fmtCost(totals.total)}</span>
        </div>
      </div>
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>CAPEX</span>
          <span className={styles.summaryValue}>$ {fmtCost(totals.capex)}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>OPEX</span>
          <span className={styles.summaryValue}>$ {fmtCost(totals.opex)}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Sub-Costs</span>
          <span className={styles.summaryValue}>
            $ {fmtCost(totals.subCostsTotal)}
          </span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Items</span>
          <span className={styles.summaryValue}>{localAssets.length}</span>
        </div>
      </div>

      {/* Cost Completeness Banner */}
      {totalItems > 0 && (
        <>
          <div
            className={
              allCostsFilled
                ? styles.costBannerComplete
                : styles.costBannerPending
            }
            onClick={
              !allCostsFilled ? () => setShowMissingItems((v) => !v) : undefined
            }
            style={!allCostsFilled ? { cursor: "pointer" } : undefined}
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
            {!allCostsFilled && (
              <span className={styles.costBannerToggle}>
                {showMissingItems ? "▲ Hide" : "▼ Details"}
              </span>
            )}
          </div>
          {showMissingItems &&
            !allCostsFilled &&
            missingItemsList.length > 0 && (
              <div className={styles.missingItemsPanel}>
                <table className={styles.missingItemsTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Type</th>
                      <th>Equipment Offer</th>
                      <th>OII/MFG PN</th>
                      <th>RES. TYPE</th>
                      <th>SUB-TYPE</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {missingItemsList.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.lineNumber}</td>
                        <td>
                          <span
                            className={
                              item.type === "main"
                                ? styles.missingTypeMain
                                : styles.missingTypeSub
                            }
                          >
                            {item.type === "main" ? "Main" : "Sub-item"}
                          </span>
                        </td>
                        <td>
                          {item.type === "sub" && (
                            <span style={{ marginRight: 4, opacity: 0.5 }}>
                              ↳
                            </span>
                          )}
                          {item.equipmentOffer}
                        </td>
                        <td className={styles.missingPN}>{item.partNumber}</td>
                        <td>{item.resourceType}</td>
                        <td>{item.resourceSubType}</td>
                        <td>
                          <button
                            className={styles.goToBtn}
                            onClick={() =>
                              scrollToAsset(item.assetId, item.sectionId)
                            }
                            title="Go to item"
                          >
                            ↗
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </>
      )}

      {/* Orphan warning */}
      {syncedAssets.orphans.length > 0 && (
        <div className={styles.orphanBanner}>
          ⚠ {syncedAssets.orphans.length} asset(s) no longer linked to a Scope
          item.
        </div>
      )}

      <div className={styles.toolbar}>
        {sections.length > 0 && (
          <button className={styles.toolbarBtn} onClick={toggleAllSections}>
            {allSectionsCollapsed ? "▶ Expand All" : "▼ Collapse All"}
          </button>
        )}
        {!readOnly && (
          <button
            className={styles.toolbarBtn}
            onClick={() => setShowCostSearch(true)}
          >
            🔍 Search Costs
          </button>
        )}
      </div>

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
                <th style={{ width: 28, padding: "0 2px" }}></th>
                <th style={{ width: 36 }}>#</th>
                <th>Equipment Offer</th>
                <th>OII/MFG PN</th>
                <th>Res. Type</th>
                <th>Sub-Type</th>
                <th>Qty Op</th>
                <th>Qty Sp</th>
                <th style={{ minWidth: 120 }}>Availability</th>
                <th style={{ minWidth: 120 }}>Acq. Type</th>
                <th>Unit Cost USD</th>
                <th>Total Cost USD</th>
                <th>Cost Ref / Supplier</th>
                <th>Date Ref</th>
                <th>Lead Time</th>
                <th>CAPEX/OPEX</th>
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
                    if (
                      a.availabilitySplits &&
                      a.availabilitySplits.length > 0
                    ) {
                      a.availabilitySplits.forEach((split) => {
                        const splitAvail = (
                          split.availabilityStatus || ""
                        ).toLowerCase();
                        const splitAcq = (
                          split.acquisitionType || ""
                        ).toLowerCase();
                        const splitSubSum = (split.subCosts || []).reduce(
                          (s, sc) => s + (sc.costUSD || 0),
                          0,
                        );
                        const splitQty = split.qty || 0;
                        let splitCost = 0;
                        if (
                          splitAvail === "onboard" ||
                          splitAvail === "call out" ||
                          splitAvail === "not offered"
                        ) {
                          splitCost = splitSubSum;
                        } else if (splitAcq === "workshop") {
                          splitCost = splitSubSum;
                        } else if (splitAcq === "rental") {
                          splitCost =
                            (split.dailyRate || 0) *
                              (split.rentalDays || 0) *
                              splitQty +
                            splitSubSum;
                        } else {
                          splitCost =
                            (split.unitCostUSD || 0) * splitQty + splitSubSum;
                        }
                        const splitCategory =
                          splitAcq === "rental" || splitAcq === "workshop"
                            ? "OPEX"
                            : split.costCategory;
                        if (splitCategory === "CAPEX") secCapex += splitCost;
                        else if (splitCategory === "OPEX") secOpex += splitCost;
                        else secOther += splitCost;
                      });
                    } else {
                      const acqType = (a.acquisitionType || "").toLowerCase();
                      const effectiveCategory =
                        acqType === "rental" || acqType === "workshop"
                          ? "OPEX"
                          : a.costCategory;
                      if (effectiveCategory === "CAPEX") secCapex += eff;
                      else if (effectiveCategory === "OPEX") secOpex += eff;
                      else secOther += eff;
                    }

                    // Categorize each sub-item cost by its own costCategory
                    (a.subItemCosts || []).forEach((sic) => {
                      const sicCost = getSubItemCostTotal(sic, a.scopeItemId);
                      const sicAcqType = (
                        sic.acquisitionType || ""
                      ).toLowerCase();
                      const sicCategory =
                        sicAcqType === "rental" || sicAcqType === "workshop"
                          ? "OPEX"
                          : sic.costCategory;
                      if (sicCategory === "CAPEX") secCapex += sicCost;
                      else if (sicCategory === "OPEX") secOpex += sicCost;
                      else secOther += sicCost;
                    });
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
                          {((sec.clientRequirement &&
                            sec.clientRequirement.trim()) ||
                            (sec.clientSpecs &&
                              sec.clientSpecs.length > 0)) && (
                            <span
                              className={styles.specsIndicator}
                              onClick={(e) => e.stopPropagation()}
                              onMouseEnter={handleSpecsHover}
                            >
                              <span className={styles.specsIndicatorIcon}>
                                📋
                              </span>
                              <div className={styles.specsTooltip}>
                                <div className={styles.specsTooltipTitle}>
                                  Section Technical Specs
                                </div>
                                {sec.clientRequirement &&
                                  sec.clientRequirement.trim() && (
                                    <div className={styles.specsTooltipReq}>
                                      {sec.clientRequirement}
                                    </div>
                                  )}
                                {(sec.clientSpecs || []).length > 0 && (
                                  <ul className={styles.specsTooltipList}>
                                    {(sec.clientSpecs || []).map(
                                      (spec, idx) => (
                                        <li key={idx}>{spec}</li>
                                      ),
                                    )}
                                  </ul>
                                )}
                              </div>
                            </span>
                          )}
                          {!readOnly && (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                marginLeft: 12,
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <select
                                className={styles.setAllSelect}
                                value=""
                                onChange={(e) => {
                                  if (e.target.value)
                                    bulkUpdateSectionField(
                                      sec.id,
                                      "availabilityStatus",
                                      e.target.value,
                                    );
                                  e.target.value = "";
                                }}
                                title="Set Availability for all items in section"
                              >
                                <option value="">Set All Avail.</option>
                                {availabilityStatuses.map((as) => (
                                  <option key={as.id} value={as.value}>
                                    {as.label}
                                  </option>
                                ))}
                              </select>
                              <select
                                className={styles.setAllSelect}
                                value=""
                                onChange={(e) => {
                                  if (e.target.value)
                                    bulkUpdateSectionField(
                                      sec.id,
                                      "acquisitionType",
                                      e.target.value,
                                    );
                                  e.target.value = "";
                                }}
                                title="Set Acq. Type for all items in section"
                              >
                                <option value="">Set All Acq. Type</option>
                                {acquisitionTypes.map((at) => (
                                  <option key={at.id} value={at.value}>
                                    {at.label}
                                  </option>
                                ))}
                              </select>
                            </span>
                          )}
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
                                  $ {fmtCost(secCapex)}
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
                                  $ {fmtCost(secOpex)}
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
                              $ {fmtCost(sectionTotal)}
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
                    <tr
                      id={`asset-row-${asset.id}`}
                      className={`${styles.mainItemRow}${isSubItemsExpanded ? ` ${styles.drawerOpenRow}` : ""}${(asset.availabilityStatus || "").toLowerCase() === "not offered" ? ` ${styles.notOfferedRow}` : ""}`}
                    >
                      {/* Expand/collapse sub-items arrow */}
                      <td
                        className={styles.cellCenter}
                        style={{ width: 28, padding: "0 2px" }}
                      >
                        {siHasSubItems && (
                          <div
                            className={`${styles.cellExpand}${isSubItemsExpanded ? ` ${styles.cellExpandOpen}` : ""}`}
                            onClick={() => toggleSubItems(asset.id)}
                            title={
                              isSubItemsExpanded
                                ? "Collapse sub-items"
                                : `${siSubItems.length} sub-item(s) — click to expand`
                            }
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width="13"
                              height="13"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </div>
                        )}
                      </td>
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
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          {si?.equipmentOffer || "—"}
                          {si &&
                            ((si.clientRequirement &&
                              si.clientRequirement.trim()) ||
                              (si.clientSpecs &&
                                si.clientSpecs.length > 0)) && (
                              <span
                                className={styles.specsIndicator}
                                onMouseEnter={handleSpecsHover}
                              >
                                <span className={styles.specsIndicatorIcon}>
                                  📋
                                </span>
                                <div className={styles.specsTooltip}>
                                  <div className={styles.specsTooltipTitle}>
                                    Technical Specs
                                  </div>
                                  {si.clientRequirement &&
                                    si.clientRequirement.trim() && (
                                      <div className={styles.specsTooltipReq}>
                                        {si.clientRequirement}
                                      </div>
                                    )}
                                  {(si.clientSpecs || []).length > 0 && (
                                    <ul className={styles.specsTooltipList}>
                                      {(si.clientSpecs || []).map(
                                        (spec, idx) => (
                                          <li key={idx}>{spec}</li>
                                        ),
                                      )}
                                    </ul>
                                  )}
                                </div>
                              </span>
                            )}
                          {si && si.comments && si.comments.trim() && (
                            <span
                              className={styles.specsIndicator}
                              onMouseEnter={handleSpecsHover}
                            >
                              <span className={styles.specsIndicatorIcon}>
                                💬
                              </span>
                              <div className={styles.specsTooltip}>
                                <div className={styles.specsTooltipTitle}>
                                  Scope Comments
                                </div>
                                <div className={styles.specsTooltipReq}>
                                  {si.comments}
                                </div>
                              </div>
                            </span>
                          )}
                        </span>
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
                      {/* Editable — Availability (or splits summary) */}
                      <td>
                        {(() => {
                          const hasSplits =
                            (asset.availabilitySplits || []).length > 0;
                          if (hasSplits) {
                            // Show splits summary badge
                            const splits = asset.availabilitySplits || [];
                            const isSplitExpanded = expandedSplits.has(
                              asset.id,
                            );
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: 4,
                                  alignItems: "center",
                                }}
                              >
                                <button
                                  className={styles.splitSummaryBadge}
                                  onClick={() => toggleSplitsExpanded(asset.id)}
                                  title={
                                    isSplitExpanded
                                      ? "Collapse splits"
                                      : "Expand splits"
                                  }
                                >
                                  <svg
                                    viewBox="0 0 16 16"
                                    width="11"
                                    height="11"
                                    fill="currentColor"
                                    style={{ opacity: 0.7 }}
                                  >
                                    <path d="M5 3.5h6V5H5V3.5zm0 3h6V8H5V6.5zm0 3h4V11H5V9.5z" />
                                    <path d="M2 1h12v14H2V1zm1 1v12h10V2H3z" />
                                  </svg>
                                  <span>
                                    {splits.length} split
                                    {splits.length > 1 ? "s" : ""}
                                  </span>
                                </button>
                                {!readOnly && (
                                  <button
                                    className={styles.splitDisableBtn}
                                    onClick={() =>
                                      handleDisableSplits(asset.id)
                                    }
                                    title="Remove splits (revert to single entry)"
                                    style={{ padding: "2px 4px", fontSize: 10 }}
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            );
                          }
                          // Normal availability dropdown + split button
                          return (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 4,
                                alignItems: "center",
                              }}
                            >
                              {readOnly ? (
                                (
                                  asset.availabilityStatus || ""
                                ).toLowerCase() === "not offered" ? (
                                  <span
                                    style={{
                                      color: "var(--status-error, #e74c3c)",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Not Offered
                                  </span>
                                ) : (
                                  <span>{asset.availabilityStatus || "—"}</span>
                                )
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
                                  style={{ flex: 1 }}
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
                              {!readOnly && qty > 1 && (
                                <button
                                  className={styles.splitEnableBtn}
                                  onClick={() => handleEnableSplits(asset.id)}
                                  title="Split availability by quantity — assign different statuses to portions of the total quantity"
                                  style={{ padding: "3px 4px", lineHeight: 1 }}
                                >
                                  <svg
                                    viewBox="0 0 16 16"
                                    width="12"
                                    height="12"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  >
                                    <path d="M8 2v12M4 6l4-4 4 4M4 10l4 4 4-4" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td>
                        {(() => {
                          const hasSplits =
                            (asset.availabilitySplits || []).length > 0;
                          if (hasSplits) {
                            // Show "See splits" when splits are active
                            return (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "var(--text-muted)",
                                  fontStyle: "italic",
                                }}
                              >
                                See splits
                              </span>
                            );
                          }
                          if (readOnly)
                            return <span>{asset.acquisitionType || "—"}</span>;
                          const avail = (
                            asset.availabilityStatus || ""
                          ).toLowerCase();
                          const isNoCost =
                            avail === "onboard" ||
                            avail === "call out" ||
                            avail === "not offered";
                          if (isNoCost) {
                            const isNotOffered = avail === "not offered";
                            return (
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: isNotOffered
                                    ? "var(--danger, #ef4444)"
                                    : "var(--text-muted)",
                                }}
                              >
                                {isNotOffered ? "Not Offered" : "N/A"}
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
                                        parentVal === asset.availabilityStatus
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
                        const hasSplits =
                          (asset.availabilitySplits || []).length > 0;
                        if (hasSplits) {
                          // When splits are active, show aggregated total only
                          const splitsTotal = getEffectiveTotal(asset);
                          return (
                            <>
                              <td className={`${styles.cellRight}`}>
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: "var(--text-muted)",
                                    fontStyle: "italic",
                                  }}
                                >
                                  See splits
                                </span>
                              </td>
                              <td className={styles.mainTotalCost}>
                                <span>$ {fmtCost(splitsTotal)}</span>
                              </td>
                            </>
                          );
                        }

                        const avail = (
                          asset.availabilityStatus || ""
                        ).toLowerCase();
                        const acqType = (
                          asset.acquisitionType || ""
                        ).toLowerCase();
                        const isRental = acqType === "rental";
                        const isNoCost =
                          avail === "onboard" ||
                          avail === "call out" ||
                          avail === "not offered";
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
                                    ? `$ ${fmtCost(subCostsSum)}`
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
                                    ? `$ ${fmtCost(subCostsSum)}`
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
                                    ? `$ ${fmtCost(subCostsSum)}`
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
                                      $ {fmtCost(rate)}{" "}
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
                                    $ {fmtCost(rentalTotal + subCostsSum)}
                                  </span>
                                  {rate > 0 && days > 0 && (
                                    <span
                                      style={{
                                        fontSize: 10,
                                        color: "var(--text-muted)",
                                        fontWeight: 400,
                                      }}
                                    >
                                      {fmtCost(rate)} × {days}d × {qty}
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
                                `$ ${fmtCost(asset.unitCostUSD)}`
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
                              $ {fmtCost(asset.unitCostUSD * qty + subCostsSum)}
                            </td>
                          </>
                        );
                      })()}
                      {/* Cost Ref / Supplier */}
                      <td>
                        {(() => {
                          const hasSplits =
                            (asset.availabilitySplits || []).length > 0;
                          if (hasSplits) {
                            return (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "var(--text-muted)",
                                  fontStyle: "italic",
                                }}
                              >
                                See splits
                              </span>
                            );
                          }
                          const av = (
                            asset.availabilityStatus || ""
                          ).toLowerCase();
                          const aq = (
                            asset.acquisitionType || ""
                          ).toLowerCase();
                          const closed =
                            av === "onboard" ||
                            av === "call out" ||
                            av === "not offered" ||
                            aq === "workshop" ||
                            aq === "in house";
                          if (closed) {
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
                          if (readOnly) {
                            if (isQuerySource(asset.costReference)) {
                              return (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                  }}
                                >
                                  <span
                                    className={`${styles.srcBadge} ${costRefBadgeClass(asset.costReference)}`}
                                  >
                                    {asset.costReference}
                                  </span>
                                  {asset.supplier && (
                                    <span
                                      style={{
                                        fontSize: 10,
                                        color: "var(--text-muted)",
                                      }}
                                    >
                                      {asset.supplier}
                                    </span>
                                  )}
                                </div>
                              );
                            }
                            const display = [
                              asset.costReference,
                              asset.supplier,
                            ]
                              .filter(Boolean)
                              .join(" | ");
                            return display ? (
                              <span style={{ fontSize: 11 }}>{display}</span>
                            ) : (
                              <span style={{ color: "var(--text-muted)" }}>
                                —
                              </span>
                            );
                          }
                          const combined = [asset.costReference, asset.supplier]
                            .filter(Boolean)
                            .join(" | ");
                          return (
                            <input
                              className={styles.editInput}
                              value={combined}
                              placeholder="Cost Ref / Supplier..."
                              onChange={(e) => {
                                const val = e.target.value;
                                const parts = val
                                  .split("|")
                                  .map((p) => p.trim());
                                const updated = localAssets.map((a) =>
                                  a.id === asset.id
                                    ? {
                                        ...a,
                                        costReference: parts[0] || "",
                                        supplier: parts[1] || "",
                                      }
                                    : a,
                                );
                                persist(updated);
                              }}
                              style={{ width: "100%", fontSize: 11 }}
                            />
                          );
                        })()}
                      </td>
                      {/* Date Ref */}
                      <td style={{ fontSize: 11 }}>
                        {(() => {
                          const hasSplits =
                            (asset.availabilitySplits || []).length > 0;
                          if (hasSplits) {
                            return (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "var(--text-muted)",
                                  fontStyle: "italic",
                                }}
                              >
                                See splits
                              </span>
                            );
                          }
                          const av = (
                            asset.availabilityStatus || ""
                          ).toLowerCase();
                          const aq = (
                            asset.acquisitionType || ""
                          ).toLowerCase();
                          const closed =
                            av === "onboard" ||
                            av === "call out" ||
                            av === "not offered" ||
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
                          if (readOnly) {
                            if (!asset.dateReference) return "—";
                            return (
                              <span
                                className={`${styles.dateBadge} ${dateAgeClass(asset.dateReference)}`}
                              >
                                {formatDateRef(asset.dateReference)}
                              </span>
                            );
                          }
                          return (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              {asset.dateReference && (
                                <span
                                  style={{ fontSize: 10, whiteSpace: "nowrap" }}
                                >
                                  {formatDateRef(asset.dateReference)}
                                </span>
                              )}
                              <span
                                style={{
                                  cursor: "pointer",
                                  fontSize: 14,
                                  lineHeight: 1,
                                  position: "relative",
                                }}
                                title="Set date"
                                onClick={(ev) => {
                                  const inp = (
                                    ev.currentTarget as HTMLElement
                                  ).querySelector(
                                    "input",
                                  ) as HTMLInputElement | null;
                                  if (inp) {
                                    try {
                                      (inp as any).showPicker();
                                    } catch {
                                      inp.focus();
                                      inp.click();
                                    }
                                  }
                                }}
                              >
                                📅
                                <input
                                  type="date"
                                  value={(asset.dateReference || "").slice(
                                    0,
                                    10,
                                  )}
                                  onChange={(e) =>
                                    updateField(
                                      asset.id,
                                      "dateReference",
                                      e.target.value,
                                    )
                                  }
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    opacity: 0,
                                    cursor: "pointer",
                                  }}
                                />
                              </span>
                            </div>
                          );
                        })()}
                      </td>
                      {/* Lead Time */}
                      <td className={styles.cellCenter}>
                        {(() => {
                          const hasSplits =
                            (asset.availabilitySplits || []).length > 0;
                          if (hasSplits) {
                            return (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "var(--text-muted)",
                                  fontStyle: "italic",
                                }}
                              >
                                See splits
                              </span>
                            );
                          }
                          const av = (
                            asset.availabilityStatus || ""
                          ).toLowerCase();
                          const aq = (
                            asset.acquisitionType || ""
                          ).toLowerCase();
                          const closed =
                            av === "onboard" ||
                            av === "call out" ||
                            av === "not offered" ||
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
                          const hasSplitsForCat =
                            (asset.availabilitySplits || []).length > 0;
                          if (hasSplitsForCat) {
                            return (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "var(--text-muted)",
                                  fontStyle: "italic",
                                }}
                              >
                                See splits
                              </span>
                            );
                          }
                          const av = (
                            asset.availabilityStatus || ""
                          ).toLowerCase();
                          const aq = (
                            asset.acquisitionType || ""
                          ).toLowerCase();
                          const closed =
                            av === "onboard" ||
                            av === "call out" ||
                            av === "not offered";
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
                          {!readOnly && (
                            <button
                              className={styles.subCostToggle}
                              onClick={() =>
                                handleAddQuotation(
                                  asset.id,
                                  si?.partNumber || "",
                                  si?.equipmentOffer || si?.description || "",
                                )
                              }
                              title="Add Quotation"
                            >
                              📝
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
                        </div>
                      </td>
                    </tr>
                    {/* Availability Splits expandable rows */}
                    {expandedSplits.has(asset.id) &&
                      (asset.availabilitySplits || []).length > 0 && (
                        <>
                          {/* Splits header row */}
                          <tr className={styles.splitHeaderRow}>
                            <td colSpan={2} />
                            <td colSpan={4} className={styles.splitHeaderLabel}>
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                              >
                                <svg
                                  viewBox="0 0 16 16"
                                  width="12"
                                  height="12"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                >
                                  <path d="M8 2v12M4 6l4-4 4 4M4 10l4 4 4-4" />
                                </svg>
                                <span style={{ fontWeight: 600 }}>
                                  Availability Splits
                                </span>
                              </span>
                            </td>
                            <td
                              colSpan={2}
                              style={{
                                textAlign: "center",
                                fontSize: 10,
                                color: "var(--text-muted)",
                              }}
                            >
                              Total: {qty}
                            </td>
                            <td colSpan={3} style={{ textAlign: "center" }}>
                              {(() => {
                                const remaining = getSplitsRemainingQty(asset);
                                if (remaining === 0) {
                                  return (
                                    <span className={styles.splitQtyOk}>
                                      ✓ Qty balanced
                                    </span>
                                  );
                                }
                                if (remaining > 0) {
                                  return (
                                    <span className={styles.splitQtyWarn}>
                                      {remaining} unassigned
                                    </span>
                                  );
                                }
                                return (
                                  <span className={styles.splitQtyError}>
                                    {Math.abs(remaining)} over-assigned
                                  </span>
                                );
                              })()}
                            </td>
                            <td colSpan={6} />
                          </tr>
                          {/* Individual split rows */}
                          {(asset.availabilitySplits || []).map(
                            (split, splitIdx) => {
                              const splitAvail = (
                                split.availabilityStatus || ""
                              ).toLowerCase();
                              const splitAcq = (
                                split.acquisitionType || ""
                              ).toLowerCase();
                              const isNoCostSplit =
                                splitAvail === "onboard" ||
                                splitAvail === "call out" ||
                                splitAvail === "not offered";
                              const isRentalSplit = splitAcq === "rental";
                              const isWorkshopSplit = splitAcq === "workshop";
                              const splitSubSum = (split.subCosts || []).reduce(
                                (s, sc) => s + (sc.costUSD || 0),
                                0,
                              );
                              let splitTotal = 0;
                              if (isNoCostSplit) splitTotal = splitSubSum;
                              else if (isWorkshopSplit)
                                splitTotal = splitSubSum;
                              else if (isRentalSplit)
                                splitTotal =
                                  (split.dailyRate || 0) *
                                    (split.rentalDays || 0) *
                                    (split.qty || 0) +
                                  splitSubSum;
                              else
                                splitTotal =
                                  (split.unitCostUSD || 0) * (split.qty || 0) +
                                  splitSubSum;

                              return (
                                <React.Fragment key={split.id}>
                                  <tr className={styles.splitRow}>
                                    {/* Col 1: empty (expand) */}
                                    <td />
                                    {/* Col 2: Split # badge */}
                                    <td className={styles.cellCenter}>
                                      <span className={styles.splitIndex}>
                                        {splitIdx + 1}
                                      </span>
                                    </td>
                                    {/* Cols 3-6: empty space (Equipment, PN, Res Type, Sub-Type) */}
                                    <td colSpan={4} />
                                    {/* Cols 7-8: Qty input (aligned under Qty Op / Qty Sp) */}
                                    <td
                                      colSpan={2}
                                      className={styles.cellCenter}
                                    >
                                      {readOnly ? (
                                        <span style={{ fontWeight: 600 }}>
                                          ×{split.qty}
                                        </span>
                                      ) : (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 3,
                                            justifyContent: "center",
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: 10,
                                              color: "var(--text-muted)",
                                            }}
                                          >
                                            Qty
                                          </span>
                                          <input
                                            className={styles.numInput}
                                            type="number"
                                            min={0}
                                            value={split.qty}
                                            onChange={(e) =>
                                              handleUpdateSplit(
                                                asset.id,
                                                split.id,
                                                "qty",
                                                Number(e.target.value) || 0,
                                              )
                                            }
                                            style={{ width: 45 }}
                                          />
                                        </div>
                                      )}
                                    </td>
                                    {/* Col 9: Availability */}
                                    <td>
                                      {readOnly ? (
                                        <span>
                                          {split.availabilityStatus || "—"}
                                        </span>
                                      ) : (
                                        <select
                                          className={emptyIf(
                                            styles.selectCell,
                                            split.availabilityStatus,
                                          )}
                                          value={split.availabilityStatus}
                                          onChange={(e) =>
                                            handleUpdateSplit(
                                              asset.id,
                                              split.id,
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
                                    {/* Col 10: Acq. Type */}
                                    <td>
                                      {(() => {
                                        if (readOnly)
                                          return (
                                            <span>
                                              {split.acquisitionType || "—"}
                                            </span>
                                          );
                                        if (isNoCostSplit) {
                                          return (
                                            <span
                                              style={{
                                                fontSize: 11,
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
                                              split.acquisitionType,
                                            )}
                                            value={split.acquisitionType}
                                            onChange={(e) =>
                                              handleUpdateSplit(
                                                asset.id,
                                                split.id,
                                                "acquisitionType",
                                                e.target.value,
                                              )
                                            }
                                          >
                                            <option value="" disabled hidden>
                                              Select...
                                            </option>
                                            {(() => {
                                              const filtered =
                                                split.availabilityStatus
                                                  ? acquisitionTypes.filter(
                                                      (at) => {
                                                        const parentVal = (
                                                          at.category || ""
                                                        ).split("|")[0];
                                                        return (
                                                          parentVal ===
                                                          split.availabilityStatus
                                                        );
                                                      },
                                                    )
                                                  : [];
                                              const options =
                                                filtered.length > 0
                                                  ? filtered
                                                  : acquisitionTypes;
                                              return options.map((at) => (
                                                <option
                                                  key={at.id}
                                                  value={at.value}
                                                >
                                                  {at.label}
                                                </option>
                                              ));
                                            })()}
                                          </select>
                                        );
                                      })()}
                                    </td>
                                    {/* Col 11: Unit Cost USD */}
                                    <td>
                                      {(() => {
                                        if (isNoCostSplit || isWorkshopSplit) {
                                          return (
                                            <span
                                              style={{
                                                fontSize: 11,
                                                color: "var(--text-muted)",
                                              }}
                                            >
                                              —
                                            </span>
                                          );
                                        }
                                        if (isRentalSplit) {
                                          if (readOnly) {
                                            return (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  gap: 1,
                                                }}
                                              >
                                                <span style={{ fontSize: 11 }}>
                                                  ${" "}
                                                  {fmtCost(
                                                    split.dailyRate || 0,
                                                  )}{" "}
                                                  /day
                                                </span>
                                                <span
                                                  style={{
                                                    fontSize: 10,
                                                    color: "var(--text-muted)",
                                                  }}
                                                >
                                                  {split.rentalDays || 0} days
                                                </span>
                                              </div>
                                            );
                                          }
                                          return (
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 3,
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
                                                    fontSize: 9,
                                                    color: "var(--text-muted)",
                                                    minWidth: 30,
                                                  }}
                                                >
                                                  Rate
                                                </span>
                                                <input
                                                  className={styles.numInput}
                                                  type="number"
                                                  min={0}
                                                  step={0.01}
                                                  value={split.dailyRate || 0}
                                                  onChange={(e) =>
                                                    handleUpdateSplit(
                                                      asset.id,
                                                      split.id,
                                                      "dailyRate",
                                                      Number(e.target.value) ||
                                                        0,
                                                    )
                                                  }
                                                  style={{ width: 70 }}
                                                />
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
                                                    fontSize: 9,
                                                    color: "var(--text-muted)",
                                                    minWidth: 30,
                                                  }}
                                                >
                                                  Days
                                                </span>
                                                <input
                                                  className={styles.numInput}
                                                  type="number"
                                                  min={0}
                                                  value={split.rentalDays || 0}
                                                  onChange={(e) =>
                                                    handleUpdateSplit(
                                                      asset.id,
                                                      split.id,
                                                      "rentalDays",
                                                      Number(e.target.value) ||
                                                        0,
                                                    )
                                                  }
                                                  style={{ width: 50 }}
                                                />
                                              </div>
                                            </div>
                                          );
                                        }
                                        // Normal purchase/inventory
                                        if (readOnly)
                                          return (
                                            <span>
                                              $ {fmtCost(split.unitCostUSD)}
                                            </span>
                                          );
                                        return (
                                          <input
                                            className={styles.numInput}
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            value={split.unitCostUSD}
                                            onChange={(e) =>
                                              handleUpdateSplit(
                                                asset.id,
                                                split.id,
                                                "unitCostUSD",
                                                Number(e.target.value) || 0,
                                              )
                                            }
                                            style={{ width: 85 }}
                                          />
                                        );
                                      })()}
                                    </td>
                                    {/* Col 12: Total Cost USD */}
                                    <td className={styles.mainTotalCost}>
                                      {isWorkshopSplit ? (
                                        <span
                                          style={{
                                            fontSize: 11,
                                            color: "var(--text-muted)",
                                          }}
                                        >
                                          —
                                        </span>
                                      ) : (
                                        <>$ {fmtCost(splitTotal)}</>
                                      )}
                                    </td>
                                    {/* Col 13: Cost Ref / Supplier */}
                                    <td>
                                      {(() => {
                                        if (isNoCostSplit || isWorkshopSplit)
                                          return (
                                            <span
                                              style={{
                                                fontSize: 11,
                                                color: "var(--text-muted)",
                                              }}
                                            >
                                              —
                                            </span>
                                          );
                                        if (readOnly) {
                                          const display = [
                                            split.costReference,
                                            split.supplier,
                                          ]
                                            .filter(Boolean)
                                            .join(" | ");
                                          return (
                                            <span style={{ fontSize: 11 }}>
                                              {display || "—"}
                                            </span>
                                          );
                                        }
                                        const combined = [
                                          split.costReference,
                                          split.supplier,
                                        ]
                                          .filter(Boolean)
                                          .join(" | ");
                                        return (
                                          <input
                                            className={styles.editInput}
                                            value={combined}
                                            placeholder="Ref / Supplier..."
                                            onChange={(e) => {
                                              const parts = e.target.value
                                                .split("|")
                                                .map((p) => p.trim());
                                              const updated = localAssets.map(
                                                (a) => {
                                                  if (a.id !== asset.id)
                                                    return a;
                                                  return {
                                                    ...a,
                                                    availabilitySplits: (
                                                      a.availabilitySplits || []
                                                    ).map((sp) =>
                                                      sp.id === split.id
                                                        ? {
                                                            ...sp,
                                                            costReference:
                                                              parts[0] || "",
                                                            supplier:
                                                              parts[1] || "",
                                                          }
                                                        : sp,
                                                    ),
                                                  };
                                                },
                                              );
                                              persist(updated);
                                            }}
                                            style={{
                                              width: "100%",
                                              fontSize: 10,
                                            }}
                                          />
                                        );
                                      })()}
                                    </td>
                                    {/* Col 14: Date Ref */}
                                    <td style={{ fontSize: 11 }}>
                                      {isNoCostSplit || isWorkshopSplit ? (
                                        <span
                                          style={{ color: "var(--text-muted)" }}
                                        >
                                          —
                                        </span>
                                      ) : readOnly ? (
                                        <span>
                                          {split.dateReference
                                            ? formatDateRef(split.dateReference)
                                            : "—"}
                                        </span>
                                      ) : (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                          }}
                                        >
                                          {split.dateReference && (
                                            <span
                                              style={{
                                                fontSize: 10,
                                                whiteSpace: "nowrap",
                                              }}
                                            >
                                              {formatDateRef(
                                                split.dateReference,
                                              )}
                                            </span>
                                          )}
                                          <span
                                            style={{
                                              cursor: "pointer",
                                              fontSize: 14,
                                              lineHeight: 1,
                                              position: "relative",
                                            }}
                                            title="Set date"
                                            onClick={(ev) => {
                                              const inp = (
                                                ev.currentTarget as HTMLElement
                                              ).querySelector(
                                                "input",
                                              ) as HTMLInputElement | null;
                                              if (inp) {
                                                try {
                                                  (inp as any).showPicker();
                                                } catch {
                                                  inp.focus();
                                                  inp.click();
                                                }
                                              }
                                            }}
                                          >
                                            📅
                                            <input
                                              type="date"
                                              value={(
                                                split.dateReference || ""
                                              ).slice(0, 10)}
                                              onChange={(e) =>
                                                handleUpdateSplit(
                                                  asset.id,
                                                  split.id,
                                                  "dateReference",
                                                  e.target.value,
                                                )
                                              }
                                              style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                opacity: 0,
                                                cursor: "pointer",
                                              }}
                                            />
                                          </span>
                                        </div>
                                      )}
                                    </td>
                                    {/* Col 15: Lead Time */}
                                    <td className={styles.cellCenter}>
                                      {isNoCostSplit || isWorkshopSplit ? (
                                        <span
                                          style={{ color: "var(--text-muted)" }}
                                        >
                                          —
                                        </span>
                                      ) : readOnly ? (
                                        <span style={{ fontSize: 11 }}>
                                          {split.leadTimeDays || "—"}
                                        </span>
                                      ) : (
                                        <input
                                          className={styles.numInput}
                                          type="number"
                                          min={0}
                                          value={split.leadTimeDays || 0}
                                          onChange={(e) =>
                                            handleUpdateSplit(
                                              asset.id,
                                              split.id,
                                              "leadTimeDays",
                                              Number(e.target.value) || 0,
                                            )
                                          }
                                          style={{ width: 45 }}
                                        />
                                      )}
                                    </td>
                                    {/* Col 16: CAPEX/OPEX */}
                                    <td className={styles.cellCenter}>
                                      <span
                                        style={{
                                          fontSize: 10,
                                          fontWeight: 600,
                                          color:
                                            split.costCategory === "CAPEX"
                                              ? "var(--success, #22c55e)"
                                              : split.costCategory === "OPEX"
                                                ? "var(--warning, #f59e0b)"
                                                : "var(--text-muted)",
                                        }}
                                      >
                                        {split.costCategory || "—"}
                                      </span>
                                    </td>
                                    {/* Col 17: Notes + Delete */}
                                    <td>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 4,
                                        }}
                                      >
                                        {readOnly ? (
                                          <span style={{ fontSize: 11 }}>
                                            {split.notes || ""}
                                          </span>
                                        ) : (
                                          <input
                                            className={styles.editInput}
                                            placeholder="Notes..."
                                            value={split.notes}
                                            onChange={(e) =>
                                              handleUpdateSplit(
                                                asset.id,
                                                split.id,
                                                "notes",
                                                e.target.value,
                                              )
                                            }
                                            style={{ flex: 1, fontSize: 10 }}
                                          />
                                        )}
                                        {!readOnly && (
                                          <button
                                            className={styles.deleteSubCost}
                                            onClick={() =>
                                              handleRemoveSplit(
                                                asset.id,
                                                split.id,
                                              )
                                            }
                                            title="Remove this split"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                  {/* Transit Rate sub-cost rows for Rental splits */}
                                  {isRentalSplit &&
                                    (split.subCosts || [])
                                      .filter((sc) => sc.isTransitRate)
                                      .map((sc) => {
                                        const impDays = sc.importDays || 0;
                                        const expDays = sc.exportDays || 0;
                                        const totalDays = impDays + expDays;
                                        const disc = sc.transitDiscount ?? 50;
                                        const splitDailyRate =
                                          split.dailyRate || 0;
                                        const transitCost =
                                          splitDailyRate *
                                          (1 - disc / 100) *
                                          totalDays;
                                        return (
                                          <tr
                                            key={sc.id}
                                            className={styles.subCostRow}
                                            style={{
                                              background:
                                                "rgba(99,102,241,0.04)",
                                            }}
                                          >
                                            <td colSpan={4} />
                                            <td
                                              colSpan={2}
                                              className={styles.subCostLabel}
                                            >
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
                                                    color:
                                                      "var(--primary-accent)",
                                                    fontSize: 10,
                                                  }}
                                                >
                                                  Transit Rate
                                                </span>
                                              </span>
                                            </td>
                                            <td colSpan={4}>
                                              {readOnly ? (
                                                <span style={{ fontSize: 11 }}>
                                                  Import: {impDays}d · Export:{" "}
                                                  {expDays}d · Discount: {disc}%
                                                </span>
                                              ) : (
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    gap: 8,
                                                    alignItems: "center",
                                                    flexWrap: "nowrap",
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
                                                        color:
                                                          "var(--text-muted)",
                                                        whiteSpace: "nowrap",
                                                      }}
                                                    >
                                                      Import
                                                    </span>
                                                    <input
                                                      className={
                                                        styles.numInput
                                                      }
                                                      type="number"
                                                      min={0}
                                                      value={impDays}
                                                      onChange={(e) =>
                                                        updateSplitSubCost(
                                                          asset.id,
                                                          split.id,
                                                          sc.id,
                                                          "importDays",
                                                          Number(
                                                            e.target.value,
                                                          ) || 0,
                                                        )
                                                      }
                                                      style={{ width: 48 }}
                                                    />
                                                    <span
                                                      style={{
                                                        fontSize: 10,
                                                        color:
                                                          "var(--text-muted)",
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
                                                        color:
                                                          "var(--text-muted)",
                                                        whiteSpace: "nowrap",
                                                      }}
                                                    >
                                                      Export
                                                    </span>
                                                    <input
                                                      className={
                                                        styles.numInput
                                                      }
                                                      type="number"
                                                      min={0}
                                                      value={expDays}
                                                      onChange={(e) =>
                                                        updateSplitSubCost(
                                                          asset.id,
                                                          split.id,
                                                          sc.id,
                                                          "exportDays",
                                                          Number(
                                                            e.target.value,
                                                          ) || 0,
                                                        )
                                                      }
                                                      style={{ width: 48 }}
                                                    />
                                                    <span
                                                      style={{
                                                        fontSize: 10,
                                                        color:
                                                          "var(--text-muted)",
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
                                                        color:
                                                          "var(--text-muted)",
                                                        whiteSpace: "nowrap",
                                                      }}
                                                    >
                                                      Disc.
                                                    </span>
                                                    <input
                                                      className={
                                                        styles.numInput
                                                      }
                                                      type="number"
                                                      min={0}
                                                      max={100}
                                                      value={disc}
                                                      onChange={(e) =>
                                                        updateSplitSubCost(
                                                          asset.id,
                                                          split.id,
                                                          sc.id,
                                                          "transitDiscount",
                                                          Number(
                                                            e.target.value,
                                                          ) || 0,
                                                        )
                                                      }
                                                      style={{ width: 55 }}
                                                    />
                                                    <span
                                                      style={{
                                                        fontSize: 10,
                                                        color:
                                                          "var(--text-muted)",
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
                                                <span style={{ fontSize: 11 }}>
                                                  $ {fmtCost(transitCost)}
                                                </span>
                                                {splitDailyRate > 0 &&
                                                  totalDays > 0 && (
                                                    <span
                                                      style={{
                                                        fontSize: 9,
                                                        color:
                                                          "var(--text-muted)",
                                                        fontWeight: 400,
                                                      }}
                                                    >
                                                      {fmtCost(splitDailyRate)}{" "}
                                                      × (100-{disc})% ×{" "}
                                                      {totalDays}d
                                                    </span>
                                                  )}
                                              </div>
                                            </td>
                                            <td colSpan={5} />
                                          </tr>
                                        );
                                      })}
                                </React.Fragment>
                              );
                            },
                          )}
                          {/* Add split button row */}
                          {!readOnly && (
                            <tr className={styles.splitRow}>
                              <td colSpan={2} />
                              <td colSpan={15}>
                                <button
                                  className={styles.addSubCostBtn}
                                  onClick={() => handleAddSplit(asset.id)}
                                  style={{ marginTop: 2, marginBottom: 4 }}
                                >
                                  + Add Split
                                </button>
                              </td>
                            </tr>
                          )}
                        </>
                      )}
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
                              dailyRate * (1 - disc / 100) * totalDays;
                            return (
                              <tr
                                key={sc.id}
                                className={styles.subCostRow}
                                style={{ background: "rgba(99,102,241,0.04)" }}
                              >
                                <td colSpan={4} />
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
                                          style={{ width: 55 }}
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
                                    <span>$ {fmtCost(transitCost)}</span>
                                    {dailyRate > 0 && totalDays > 0 && (
                                      <span
                                        style={{
                                          fontSize: 9,
                                          color: "var(--text-muted)",
                                          fontWeight: 400,
                                        }}
                                      >
                                        {fmtCost(dailyRate)} × (100-
                                        {disc})% × {totalDays}d
                                      </span>
                                    )}
                                  </div>
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
                              <td colSpan={4} />
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
                                  `$ ${fmtCost(sc.costUSD || 0)}`
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
                                  <input
                                    className={styles.editInput}
                                    placeholder="Cost Ref..."
                                    value={sc.costReference || ""}
                                    onChange={(e) =>
                                      updateSubCost(
                                        asset.id,
                                        sc.id,
                                        "costReference",
                                        e.target.value,
                                      )
                                    }
                                    style={{ width: "100%", fontSize: 11 }}
                                  />
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
                            <td colSpan={4} />
                            <td colSpan={7} className={styles.subtotalLabel}>
                              Sub-costs subtotal:
                            </td>
                            <td className={styles.subtotalValue}>
                              $ {fmtCost(subCostsSum)}
                            </td>
                            <td colSpan={COLS - 12} />
                          </tr>
                        )}
                        {!readOnly && (
                          <tr className={styles.subCostRow}>
                            <td colSpan={4} />
                            <td colSpan={COLS - 4}>
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
                    {/* Sub-items drawer (Scope of Supply style) */}
                    {isSubItemsExpanded && siHasSubItems && (
                      <tr className={styles.drawerRow}>
                        <td colSpan={COLS}>
                          <div className={styles.drawerInner}>
                            <div className={styles.drawerHeader}>
                              <svg
                                viewBox="0 0 24 24"
                                width="13"
                                height="13"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <polyline points="9 17 4 12 9 7" />
                                <path d="M20 18v-2a4 4 0 00-4-4H4" />
                              </svg>
                              <span className={styles.drawerTitle}>
                                Sub-Items ({siSubItems.length})
                              </span>
                              <span className={styles.drawerHint}>
                                Consumables, spare parts &amp; accessories
                              </span>
                              {!readOnly && (
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    marginLeft: 8,
                                  }}
                                >
                                  <select
                                    className={styles.setAllSelect}
                                    value=""
                                    onChange={(e) => {
                                      if (e.target.value)
                                        bulkUpdateSubItems(
                                          asset.id,
                                          "availabilityStatus",
                                          e.target.value,
                                        );
                                      e.target.value = "";
                                    }}
                                    title="Set Availability for all sub-items"
                                  >
                                    <option value="">Set All Avail.</option>
                                    {availabilityStatuses.map((as) => (
                                      <option key={as.id} value={as.value}>
                                        {as.label}
                                      </option>
                                    ))}
                                  </select>
                                  <select
                                    className={styles.setAllSelect}
                                    value=""
                                    onChange={(e) => {
                                      if (e.target.value)
                                        bulkUpdateSubItems(
                                          asset.id,
                                          "acquisitionType",
                                          e.target.value,
                                        );
                                      e.target.value = "";
                                    }}
                                    title="Set Acq. Type for all sub-items"
                                  >
                                    <option value="">Set All Acq. Type</option>
                                    {acquisitionTypes.map((at) => (
                                      <option key={at.id} value={at.value}>
                                        {at.label}
                                      </option>
                                    ))}
                                  </select>
                                </span>
                              )}
                            </div>
                            <div className={styles.subTblWrap}>
                              <div className={styles.subTblHead}>
                                <div className={styles.subTh}>#</div>
                                <div className={styles.subTh}>Description</div>
                                <div className={styles.subTh}>Sub-Type</div>
                                <div className={styles.subTh}>OII / MFG PN</div>
                                <div className={styles.subTh}>Qty</div>
                                <div className={styles.subTh}>Availability</div>
                                <div className={styles.subTh}>Acq. Type</div>
                                <div className={styles.subTh}>Unit Cost</div>
                                <div className={styles.subTh}>Total Cost</div>
                                <div className={styles.subTh}>
                                  Cost Ref / Supplier
                                </div>
                                <div className={styles.subTh}>Date Ref</div>
                                <div className={styles.subTh}>Lead Time</div>
                                <div className={styles.subTh}>CAPEX/OPEX</div>
                                <div className={styles.subTh}>Notes</div>
                              </div>
                              <div className={styles.subRows}>
                                {(asset.subItemCosts || []).map((sic, idx) => {
                                  const sub = getSubItemForCost(
                                    asset.scopeItemId,
                                    sic.subItemId,
                                  );
                                  if (!sub) return null;
                                  const sicQty = sub.qty || 1;
                                  const sicAvail = (
                                    sic.availabilityStatus || ""
                                  ).toLowerCase();
                                  const sicAcq = (
                                    sic.acquisitionType || ""
                                  ).toLowerCase();
                                  const sicIsNoCost =
                                    sicAvail === "onboard" ||
                                    sicAvail === "call out" ||
                                    sicAvail === "not offered";
                                  const sicIsRental = sicAcq === "rental";
                                  const sicIsNotOffered =
                                    sicAvail === "not offered";
                                  const sicIsWorkshopOrInHouse =
                                    sicAcq === "workshop" ||
                                    sicAcq === "in house";
                                  const sicShowDashCost =
                                    sicIsNoCost || sicIsWorkshopOrInHouse;
                                  const sicShowDashMeta =
                                    sicIsNoCost || sicIsWorkshopOrInHouse;
                                  const sicTotal = sicIsRental
                                    ? (sic.dailyRate || 0) *
                                      (sic.rentalDays || 0) *
                                      sicQty
                                    : (sic.unitCostUSD || 0) * sicQty;
                                  const sicHasSplits =
                                    (sic.availabilitySplits || []).length > 0;
                                  const sicSplitsTotal = sicHasSplits
                                    ? getSubItemCostTotal(
                                        sic,
                                        asset.scopeItemId,
                                      )
                                    : 0;
                                  return (
                                    <React.Fragment key={sic.id}>
                                      <div
                                        className={`${styles.subRow}${sicIsNotOffered ? ` ${styles.notOfferedRow}` : ""}`}
                                      >
                                        <div
                                          className={`${styles.subCell} ${styles.subNum}`}
                                        >
                                          {idx + 1}
                                        </div>
                                        <div className={styles.subCell}>
                                          {sub.description ||
                                            sub.equipmentOffer ||
                                            "—"}
                                        </div>
                                        <div className={styles.subCell}>
                                          {sub.subType || "—"}
                                        </div>
                                        <div
                                          className={`${styles.subCell} ${styles.subCellMono}`}
                                        >
                                          {sub.partNumber || "—"}
                                        </div>
                                        <div
                                          className={`${styles.subCell} ${styles.subCellCenter}`}
                                        >
                                          {sicQty}
                                        </div>
                                        <div className={styles.subCell}>
                                          {(() => {
                                            if (sicHasSplits) {
                                              return (
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 4,
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <button
                                                    className={
                                                      styles.splitSummaryBadge
                                                    }
                                                    onClick={() =>
                                                      toggleSplitsExpanded(
                                                        `sic-${sic.id}`,
                                                      )
                                                    }
                                                    style={{
                                                      fontSize: 10,
                                                      padding: "2px 5px",
                                                    }}
                                                    title="View/edit splits"
                                                  >
                                                    {
                                                      (
                                                        sic.availabilitySplits ||
                                                        []
                                                      ).length
                                                    }{" "}
                                                    split
                                                    {(
                                                      sic.availabilitySplits ||
                                                      []
                                                    ).length > 1
                                                      ? "s"
                                                      : ""}
                                                  </button>
                                                  {!readOnly && (
                                                    <button
                                                      className={
                                                        styles.splitDisableBtn
                                                      }
                                                      onClick={() =>
                                                        handleDisableSubItemSplits(
                                                          asset.id,
                                                          sic.id,
                                                        )
                                                      }
                                                      title="Remove splits"
                                                      style={{
                                                        padding: "2px 4px",
                                                        fontSize: 10,
                                                      }}
                                                    >
                                                      ✕
                                                    </button>
                                                  )}
                                                </div>
                                              );
                                            }
                                            return (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  flexDirection: "row",
                                                  gap: 4,
                                                  alignItems: "center",
                                                }}
                                              >
                                                {readOnly ? (
                                                  <span>
                                                    {sic.availabilityStatus ||
                                                      "—"}
                                                  </span>
                                                ) : (
                                                  <select
                                                    className={emptyIf(
                                                      styles.selectCell,
                                                      sic.availabilityStatus,
                                                    )}
                                                    value={
                                                      sic.availabilityStatus
                                                    }
                                                    onChange={(e) =>
                                                      updateSubItemCost(
                                                        asset.id,
                                                        sic.id,
                                                        "availabilityStatus",
                                                        e.target.value,
                                                      )
                                                    }
                                                    style={{ flex: 1 }}
                                                  >
                                                    <option
                                                      value=""
                                                      disabled
                                                      hidden
                                                    >
                                                      Select...
                                                    </option>
                                                    {availabilityStatuses.map(
                                                      (o) => (
                                                        <option
                                                          key={o.id}
                                                          value={o.value}
                                                        >
                                                          {o.label}
                                                        </option>
                                                      ),
                                                    )}
                                                  </select>
                                                )}
                                                {!readOnly && sicQty > 1 && (
                                                  <button
                                                    className={
                                                      styles.splitEnableBtn
                                                    }
                                                    onClick={() =>
                                                      handleEnableSubItemSplits(
                                                        asset.id,
                                                        sic.id,
                                                      )
                                                    }
                                                    title="Split availability by quantity"
                                                    style={{
                                                      padding: "3px 4px",
                                                      lineHeight: 1,
                                                    }}
                                                  >
                                                    <svg
                                                      viewBox="0 0 16 16"
                                                      width="11"
                                                      height="11"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5"
                                                    >
                                                      <path d="M8 2v12M4 6l4-4 4 4M4 10l4 4 4-4" />
                                                    </svg>
                                                  </button>
                                                )}
                                              </div>
                                            );
                                          })()}
                                        </div>
                                        <div className={styles.subCell}>
                                          {sicHasSplits ? (
                                            <span
                                              style={{
                                                fontSize: 10,
                                                color: "var(--text-muted)",
                                                fontStyle: "italic",
                                              }}
                                            >
                                              See splits
                                            </span>
                                          ) : readOnly ? (
                                            sic.acquisitionType || "—"
                                          ) : sicIsNoCost ? (
                                            <span
                                              style={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: sicIsNotOffered
                                                  ? "var(--danger, #ef4444)"
                                                  : "var(--text-muted)",
                                              }}
                                            >
                                              {sicIsNotOffered
                                                ? "Not Offered"
                                                : "N/A"}
                                            </span>
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
                                                const filtered =
                                                  sic.availabilityStatus
                                                    ? acquisitionTypes.filter(
                                                        (at) => {
                                                          const parentVal = (
                                                            at.category || ""
                                                          ).split("|")[0];
                                                          return (
                                                            parentVal ===
                                                            sic.availabilityStatus
                                                          );
                                                        },
                                                      )
                                                    : [];
                                                const options =
                                                  filtered.length > 0
                                                    ? filtered
                                                    : acquisitionTypes;
                                                return options.map((at) => (
                                                  <option
                                                    key={at.id}
                                                    value={at.value}
                                                  >
                                                    {at.label}
                                                  </option>
                                                ));
                                              })()}
                                            </select>
                                          )}
                                        </div>
                                        <div className={styles.subCell}>
                                          {sicHasSplits ? (
                                            <span
                                              style={{
                                                fontSize: 10,
                                                color: "var(--text-muted)",
                                                fontStyle: "italic",
                                              }}
                                            >
                                              See splits
                                            </span>
                                          ) : sicShowDashCost ? (
                                            <span
                                              style={{
                                                fontSize: 12,
                                                color: sicIsNotOffered
                                                  ? "var(--danger, #ef4444)"
                                                  : "var(--text-muted)",
                                              }}
                                            >
                                              —
                                            </span>
                                          ) : sicIsRental ? (
                                            readOnly ? (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  gap: 2,
                                                }}
                                              >
                                                <span style={{ fontSize: 11 }}>
                                                  ${" "}
                                                  {fmtCost(sic.dailyRate || 0)}{" "}
                                                  <span
                                                    style={{
                                                      color:
                                                        "var(--text-muted)",
                                                      fontSize: 10,
                                                    }}
                                                  >
                                                    /day
                                                  </span>
                                                </span>
                                                <span
                                                  style={{
                                                    fontSize: 10,
                                                    color: "var(--text-muted)",
                                                  }}
                                                >
                                                  {sic.rentalDays || 0} day
                                                  {(sic.rentalDays || 0) !== 1
                                                    ? "s"
                                                    : ""}
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
                                                      color:
                                                        "var(--text-muted)",
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
                                                    value={sic.dailyRate || 0}
                                                    placeholder="0.00"
                                                    onChange={(e) =>
                                                      updateSubItemCost(
                                                        asset.id,
                                                        sic.id,
                                                        "dailyRate" as any,
                                                        Number(
                                                          e.target.value,
                                                        ) || 0,
                                                      )
                                                    }
                                                    style={{ width: 70 }}
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
                                                      color:
                                                        "var(--text-muted)",
                                                      minWidth: 52,
                                                    }}
                                                  >
                                                    Days
                                                  </span>
                                                  <input
                                                    className={styles.numInput}
                                                    type="number"
                                                    min={0}
                                                    value={sic.rentalDays || 0}
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                      updateSubItemCost(
                                                        asset.id,
                                                        sic.id,
                                                        "rentalDays" as any,
                                                        Number(
                                                          e.target.value,
                                                        ) || 0,
                                                      )
                                                    }
                                                    style={{ width: 55 }}
                                                  />
                                                </div>
                                              </div>
                                            )
                                          ) : readOnly ? (
                                            `$ ${fmtCost(sic.unitCostUSD)}`
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
                                        </div>
                                        <div
                                          className={`${styles.subCell} ${styles.subCellBold}`}
                                        >
                                          {sicHasSplits ? (
                                            <span style={{ fontWeight: 600 }}>
                                              $ {fmtCost(sicSplitsTotal)}
                                            </span>
                                          ) : sicShowDashCost ? (
                                            <span
                                              style={{
                                                fontSize: 12,
                                                color: sicIsNotOffered
                                                  ? "var(--danger, #ef4444)"
                                                  : "var(--text-muted)",
                                              }}
                                            >
                                              —
                                            </span>
                                          ) : (
                                            <>
                                              $ {fmtCost(sicTotal)}
                                              {sicIsRental &&
                                                (sic.dailyRate || 0) > 0 && (
                                                  <div
                                                    className={
                                                      styles.subCellCalc
                                                    }
                                                  >
                                                    {fmtCost(
                                                      sic.dailyRate || 0,
                                                    )}
                                                    /d × {sic.rentalDays || 0}d
                                                    {sicQty > 1
                                                      ? ` × ${sicQty}`
                                                      : ""}
                                                  </div>
                                                )}
                                              {!sicIsRental && sicQty > 1 && (
                                                <div
                                                  className={styles.subCellCalc}
                                                >
                                                  {fmtCost(sic.unitCostUSD)} ×{" "}
                                                  {sicQty}
                                                </div>
                                              )}
                                            </>
                                          )}
                                        </div>
                                        <div className={styles.subCell}>
                                          {sicShowDashMeta ? (
                                            <span
                                              style={{
                                                fontSize: 12,
                                                color: "var(--text-muted)",
                                              }}
                                            >
                                              —
                                            </span>
                                          ) : readOnly ? (
                                            (() => {
                                              if (
                                                isQuerySource(sic.costReference)
                                              ) {
                                                return (
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      gap: 2,
                                                    }}
                                                  >
                                                    <span
                                                      className={`${styles.srcBadge} ${costRefBadgeClass(sic.costReference)}`}
                                                    >
                                                      {sic.costReference}
                                                    </span>
                                                    {sic.supplier && (
                                                      <span
                                                        style={{
                                                          fontSize: 10,
                                                          color:
                                                            "var(--text-muted)",
                                                        }}
                                                      >
                                                        {sic.supplier}
                                                      </span>
                                                    )}
                                                  </div>
                                                );
                                              }
                                              const d = [
                                                sic.costReference,
                                                sic.supplier,
                                              ]
                                                .filter(Boolean)
                                                .join(" | ");
                                              return d ? (
                                                <span style={{ fontSize: 11 }}>
                                                  {d}
                                                </span>
                                              ) : (
                                                <span
                                                  style={{
                                                    color: "var(--text-muted)",
                                                  }}
                                                >
                                                  —
                                                </span>
                                              );
                                            })()
                                          ) : (
                                            <input
                                              className={styles.editInput}
                                              value={[
                                                sic.costReference,
                                                sic.supplier,
                                              ]
                                                .filter(Boolean)
                                                .join(" | ")}
                                              placeholder="Cost Ref / Supplier..."
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                const parts = val
                                                  .split("|")
                                                  .map((p) => p.trim());
                                                const updated = localAssets.map(
                                                  (a) => {
                                                    if (a.id !== asset.id)
                                                      return a;
                                                    return {
                                                      ...a,
                                                      subItemCosts: (
                                                        a.subItemCosts || []
                                                      ).map((s) =>
                                                        s.id === sic.id
                                                          ? {
                                                              ...s,
                                                              costReference:
                                                                parts[0] || "",
                                                              supplier:
                                                                parts[1] || "",
                                                            }
                                                          : s,
                                                      ),
                                                    };
                                                  },
                                                );
                                                persist(updated);
                                              }}
                                              style={{
                                                width: "100%",
                                                fontSize: 11,
                                              }}
                                            />
                                          )}
                                        </div>
                                        {/* Date Ref (sub-item) */}
                                        <div
                                          className={styles.subCell}
                                          style={{ fontSize: 11 }}
                                        >
                                          {sicShowDashMeta ? (
                                            <span
                                              style={{
                                                fontSize: 12,
                                                color: "var(--text-muted)",
                                              }}
                                            >
                                              —
                                            </span>
                                          ) : readOnly ? (
                                            sic.dateReference ? (
                                              <span
                                                className={`${styles.dateBadge} ${dateAgeClass(sic.dateReference)}`}
                                              >
                                                {formatDateRef(
                                                  sic.dateReference,
                                                )}
                                              </span>
                                            ) : (
                                              "—"
                                            )
                                          ) : (
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                              }}
                                            >
                                              {sic.dateReference && (
                                                <span
                                                  style={{
                                                    fontSize: 10,
                                                    whiteSpace: "nowrap",
                                                  }}
                                                >
                                                  {formatDateRef(
                                                    sic.dateReference,
                                                  )}
                                                </span>
                                              )}
                                              <span
                                                style={{
                                                  cursor: "pointer",
                                                  fontSize: 14,
                                                  lineHeight: 1,
                                                  position: "relative",
                                                }}
                                                title="Set date"
                                                onClick={(ev) => {
                                                  const inp = (
                                                    ev.currentTarget as HTMLElement
                                                  ).querySelector(
                                                    "input",
                                                  ) as HTMLInputElement | null;
                                                  if (inp) {
                                                    try {
                                                      (inp as any).showPicker();
                                                    } catch {
                                                      inp.focus();
                                                      inp.click();
                                                    }
                                                  }
                                                }}
                                              >
                                                📅
                                                <input
                                                  type="date"
                                                  value={(
                                                    sic.dateReference || ""
                                                  ).slice(0, 10)}
                                                  onChange={(e) =>
                                                    updateSubItemCost(
                                                      asset.id,
                                                      sic.id,
                                                      "dateReference" as any,
                                                      e.target.value,
                                                    )
                                                  }
                                                  style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    width: "100%",
                                                    height: "100%",
                                                    opacity: 0,
                                                    cursor: "pointer",
                                                  }}
                                                />
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        <div
                                          className={`${styles.subCell} ${styles.subCellCenter}`}
                                        >
                                          {sicShowDashMeta ? (
                                            <span
                                              style={{
                                                fontSize: 12,
                                                color: "var(--text-muted)",
                                              }}
                                            >
                                              —
                                            </span>
                                          ) : readOnly ? (
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
                                        </div>
                                        <div className={styles.subCell}>
                                          {sicIsNoCost ? (
                                            <span
                                              style={{
                                                fontSize: 12,
                                                color: "var(--text-muted)",
                                              }}
                                            >
                                              —
                                            </span>
                                          ) : readOnly ? (
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
                                              <option value="CAPEX">
                                                CAPEX
                                              </option>
                                              <option value="OPEX">OPEX</option>
                                            </select>
                                          )}
                                        </div>
                                        <div className={styles.subCell}>
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
                                        </div>
                                      </div>
                                      {/* Sub-item splits section */}
                                      {sicHasSplits &&
                                        expandedSplits.has(`sic-${sic.id}`) && (
                                          <div
                                            className={styles.splitRow}
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              gap: 4,
                                              padding: "6px 8px 6px 24px",
                                              borderLeft:
                                                "3px solid rgba(99,102,241,0.3)",
                                            }}
                                          >
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6,
                                                fontSize: 11,
                                                color: "var(--primary-accent)",
                                                fontWeight: 600,
                                              }}
                                            >
                                              <span>
                                                Splits (Qty: {sicQty})
                                              </span>
                                              {(() => {
                                                const assigned = (
                                                  sic.availabilitySplits || []
                                                ).reduce(
                                                  (s, sp) => s + (sp.qty || 0),
                                                  0,
                                                );
                                                const rem = sicQty - assigned;
                                                if (rem === 0)
                                                  return (
                                                    <span
                                                      className={
                                                        styles.splitQtyOk
                                                      }
                                                    >
                                                      ✓
                                                    </span>
                                                  );
                                                if (rem > 0)
                                                  return (
                                                    <span
                                                      className={
                                                        styles.splitQtyWarn
                                                      }
                                                    >
                                                      {rem} unassigned
                                                    </span>
                                                  );
                                                return (
                                                  <span
                                                    className={
                                                      styles.splitQtyError
                                                    }
                                                  >
                                                    {Math.abs(rem)} over
                                                  </span>
                                                );
                                              })()}
                                            </div>
                                            {(sic.availabilitySplits || []).map(
                                              (sp, spIdx) => {
                                                const spAvail = (
                                                  sp.availabilityStatus || ""
                                                ).toLowerCase();
                                                const spAcq = (
                                                  sp.acquisitionType || ""
                                                ).toLowerCase();
                                                const spNoCost =
                                                  spAvail === "onboard" ||
                                                  spAvail === "call out" ||
                                                  spAvail === "not offered";
                                                const spRental =
                                                  spAcq === "rental";
                                                let spTotal = 0;
                                                if (spNoCost) spTotal = 0;
                                                else if (spRental)
                                                  spTotal =
                                                    (sp.dailyRate || 0) *
                                                    (sp.rentalDays || 0) *
                                                    (sp.qty || 0);
                                                else
                                                  spTotal =
                                                    (sp.unitCostUSD || 0) *
                                                    (sp.qty || 0);
                                                return (
                                                  <div
                                                    key={sp.id}
                                                    style={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      gap: 6,
                                                      flexWrap: "wrap",
                                                      padding: "3px 0",
                                                      borderBottom:
                                                        "1px solid var(--border)",
                                                    }}
                                                  >
                                                    <span
                                                      className={
                                                        styles.splitIndex
                                                      }
                                                      style={{
                                                        width: 16,
                                                        height: 16,
                                                        fontSize: 9,
                                                      }}
                                                    >
                                                      {spIdx + 1}
                                                    </span>
                                                    {readOnly ? (
                                                      <span
                                                        style={{ fontSize: 11 }}
                                                      >
                                                        ×{sp.qty}
                                                      </span>
                                                    ) : (
                                                      <input
                                                        className={
                                                          styles.numInput
                                                        }
                                                        type="number"
                                                        min={0}
                                                        value={sp.qty}
                                                        onChange={(e) =>
                                                          handleUpdateSubItemSplit(
                                                            asset.id,
                                                            sic.id,
                                                            sp.id,
                                                            "qty",
                                                            Number(
                                                              e.target.value,
                                                            ) || 0,
                                                          )
                                                        }
                                                        style={{ width: 40 }}
                                                      />
                                                    )}
                                                    {readOnly ? (
                                                      <span
                                                        style={{ fontSize: 11 }}
                                                      >
                                                        {sp.availabilityStatus ||
                                                          "—"}
                                                      </span>
                                                    ) : (
                                                      <select
                                                        className={emptyIf(
                                                          styles.selectCell,
                                                          sp.availabilityStatus,
                                                        )}
                                                        value={
                                                          sp.availabilityStatus
                                                        }
                                                        onChange={(e) =>
                                                          handleUpdateSubItemSplit(
                                                            asset.id,
                                                            sic.id,
                                                            sp.id,
                                                            "availabilityStatus",
                                                            e.target.value,
                                                          )
                                                        }
                                                        style={{ fontSize: 11 }}
                                                      >
                                                        <option
                                                          value=""
                                                          disabled
                                                          hidden
                                                        >
                                                          Avail...
                                                        </option>
                                                        {availabilityStatuses.map(
                                                          (o) => (
                                                            <option
                                                              key={o.id}
                                                              value={o.value}
                                                            >
                                                              {o.label}
                                                            </option>
                                                          ),
                                                        )}
                                                      </select>
                                                    )}
                                                    {!spNoCost &&
                                                      (readOnly ? (
                                                        <span
                                                          style={{
                                                            fontSize: 11,
                                                          }}
                                                        >
                                                          {sp.acquisitionType ||
                                                            "—"}
                                                        </span>
                                                      ) : (
                                                        <select
                                                          className={emptyIf(
                                                            styles.selectCell,
                                                            sp.acquisitionType,
                                                          )}
                                                          value={
                                                            sp.acquisitionType
                                                          }
                                                          onChange={(e) =>
                                                            handleUpdateSubItemSplit(
                                                              asset.id,
                                                              sic.id,
                                                              sp.id,
                                                              "acquisitionType",
                                                              e.target.value,
                                                            )
                                                          }
                                                          style={{
                                                            fontSize: 11,
                                                          }}
                                                        >
                                                          <option
                                                            value=""
                                                            disabled
                                                            hidden
                                                          >
                                                            Acq...
                                                          </option>
                                                          {(() => {
                                                            const f =
                                                              sp.availabilityStatus
                                                                ? acquisitionTypes.filter(
                                                                    (at) =>
                                                                      (
                                                                        at.category ||
                                                                        ""
                                                                      ).split(
                                                                        "|",
                                                                      )[0] ===
                                                                      sp.availabilityStatus,
                                                                  )
                                                                : [];
                                                            return (
                                                              f.length > 0
                                                                ? f
                                                                : acquisitionTypes
                                                            ).map((at) => (
                                                              <option
                                                                key={at.id}
                                                                value={at.value}
                                                              >
                                                                {at.label}
                                                              </option>
                                                            ));
                                                          })()}
                                                        </select>
                                                      ))}
                                                    {!spNoCost &&
                                                      !spRental &&
                                                      (readOnly ? (
                                                        <span
                                                          style={{
                                                            fontSize: 11,
                                                          }}
                                                        >
                                                          ${" "}
                                                          {fmtCost(
                                                            sp.unitCostUSD,
                                                          )}
                                                        </span>
                                                      ) : (
                                                        <input
                                                          className={
                                                            styles.numInput
                                                          }
                                                          type="number"
                                                          min={0}
                                                          step={0.01}
                                                          value={sp.unitCostUSD}
                                                          onChange={(e) =>
                                                            handleUpdateSubItemSplit(
                                                              asset.id,
                                                              sic.id,
                                                              sp.id,
                                                              "unitCostUSD",
                                                              Number(
                                                                e.target.value,
                                                              ) || 0,
                                                            )
                                                          }
                                                          style={{ width: 70 }}
                                                        />
                                                      ))}
                                                    {spRental && !readOnly && (
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          gap: 3,
                                                          alignItems: "center",
                                                        }}
                                                      >
                                                        <input
                                                          className={
                                                            styles.numInput
                                                          }
                                                          type="number"
                                                          min={0}
                                                          step={0.01}
                                                          value={
                                                            sp.dailyRate || 0
                                                          }
                                                          onChange={(e) =>
                                                            handleUpdateSubItemSplit(
                                                              asset.id,
                                                              sic.id,
                                                              sp.id,
                                                              "dailyRate",
                                                              Number(
                                                                e.target.value,
                                                              ) || 0,
                                                            )
                                                          }
                                                          style={{ width: 60 }}
                                                          placeholder="Rate"
                                                        />
                                                        <span
                                                          style={{
                                                            fontSize: 9,
                                                            color:
                                                              "var(--text-muted)",
                                                          }}
                                                        >
                                                          ×
                                                        </span>
                                                        <input
                                                          className={
                                                            styles.numInput
                                                          }
                                                          type="number"
                                                          min={0}
                                                          value={
                                                            sp.rentalDays || 0
                                                          }
                                                          onChange={(e) =>
                                                            handleUpdateSubItemSplit(
                                                              asset.id,
                                                              sic.id,
                                                              sp.id,
                                                              "rentalDays",
                                                              Number(
                                                                e.target.value,
                                                              ) || 0,
                                                            )
                                                          }
                                                          style={{ width: 40 }}
                                                          placeholder="Days"
                                                        />
                                                      </div>
                                                    )}
                                                    <span
                                                      style={{
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                        marginLeft: "auto",
                                                      }}
                                                    >
                                                      $ {fmtCost(spTotal)}
                                                    </span>
                                                    {!readOnly && (
                                                      <button
                                                        className={
                                                          styles.deleteSubCost
                                                        }
                                                        onClick={() =>
                                                          handleRemoveSubItemSplit(
                                                            asset.id,
                                                            sic.id,
                                                            sp.id,
                                                          )
                                                        }
                                                      >
                                                        ✕
                                                      </button>
                                                    )}
                                                  </div>
                                                );
                                              },
                                            )}
                                            {!readOnly && (
                                              <button
                                                className={styles.addSubCostBtn}
                                                onClick={() =>
                                                  handleAddSubItemSplit(
                                                    asset.id,
                                                    sic.id,
                                                  )
                                                }
                                                style={{
                                                  marginTop: 2,
                                                  fontSize: 10,
                                                }}
                                              >
                                                + Add Split
                                              </button>
                                            )}
                                            <div
                                              style={{
                                                fontSize: 11,
                                                fontWeight: 600,
                                                textAlign: "right",
                                              }}
                                            >
                                              Total: $ {fmtCost(sicSplitsTotal)}
                                            </div>
                                          </div>
                                        )}
                                      {/* Transit Rate sub-cost for Rental sub-items */}
                                      {sicIsRental &&
                                        !sicHasSplits &&
                                        (sic.subCosts || [])
                                          .filter((sc) => sc.isTransitRate)
                                          .map((tc) => {
                                            const tcImpDays =
                                              tc.importDays || 0;
                                            const tcExpDays =
                                              tc.exportDays || 0;
                                            const tcTotalDays =
                                              tcImpDays + tcExpDays;
                                            const tcDiscount =
                                              tc.transitDiscount ?? 50;
                                            const tcDailyRate =
                                              sic.dailyRate || 0;
                                            const tcCost =
                                              tcDailyRate *
                                              (1 - tcDiscount / 100) *
                                              tcTotalDays;
                                            return (
                                              <div
                                                key={tc.id}
                                                className={styles.subRow}
                                                style={{
                                                  background:
                                                    "rgba(99,102,241,0.04)",
                                                }}
                                              >
                                                {/* Empty cells: #, description */}
                                                <div
                                                  className={styles.subCell}
                                                />
                                                <div
                                                  className={styles.subCell}
                                                />
                                                {/* Label spanning subType + partNumber columns */}
                                                <div
                                                  className={styles.subCell}
                                                  style={{
                                                    gridColumn: "3 / 6",
                                                  }}
                                                >
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
                                                        color:
                                                          "var(--primary-accent)",
                                                        fontSize: 11,
                                                      }}
                                                    >
                                                      Transit Rate
                                                    </span>
                                                  </span>
                                                </div>
                                                {/* Inputs spanning availability + acqType + cost details columns */}
                                                <div
                                                  className={styles.subCell}
                                                  style={{
                                                    gridColumn: "6 / 9",
                                                  }}
                                                >
                                                  {readOnly ? (
                                                    <span
                                                      style={{ fontSize: 12 }}
                                                    >
                                                      Import: {tcImpDays}d ·
                                                      Export: {tcExpDays}d ·
                                                      Discount: {tcDiscount}%
                                                    </span>
                                                  ) : (
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        gap: 8,
                                                        alignItems: "center",
                                                        flexWrap: "nowrap",
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
                                                            color:
                                                              "var(--text-muted)",
                                                            whiteSpace:
                                                              "nowrap",
                                                          }}
                                                        >
                                                          Import
                                                        </span>
                                                        <input
                                                          className={
                                                            styles.numInput
                                                          }
                                                          type="number"
                                                          min={0}
                                                          value={tcImpDays}
                                                          onChange={(e) =>
                                                            updateSubItemSubCost(
                                                              asset.id,
                                                              sic.id,
                                                              tc.id,
                                                              "importDays",
                                                              Number(
                                                                e.target.value,
                                                              ) || 0,
                                                            )
                                                          }
                                                          style={{ width: 48 }}
                                                        />
                                                        <span
                                                          style={{
                                                            fontSize: 10,
                                                            color:
                                                              "var(--text-muted)",
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
                                                            color:
                                                              "var(--text-muted)",
                                                            whiteSpace:
                                                              "nowrap",
                                                          }}
                                                        >
                                                          Export
                                                        </span>
                                                        <input
                                                          className={
                                                            styles.numInput
                                                          }
                                                          type="number"
                                                          min={0}
                                                          value={tcExpDays}
                                                          onChange={(e) =>
                                                            updateSubItemSubCost(
                                                              asset.id,
                                                              sic.id,
                                                              tc.id,
                                                              "exportDays",
                                                              Number(
                                                                e.target.value,
                                                              ) || 0,
                                                            )
                                                          }
                                                          style={{ width: 48 }}
                                                        />
                                                        <span
                                                          style={{
                                                            fontSize: 10,
                                                            color:
                                                              "var(--text-muted)",
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
                                                            color:
                                                              "var(--text-muted)",
                                                            whiteSpace:
                                                              "nowrap",
                                                          }}
                                                        >
                                                          Disc.
                                                        </span>
                                                        <input
                                                          className={
                                                            styles.numInput
                                                          }
                                                          type="number"
                                                          min={0}
                                                          max={100}
                                                          value={tcDiscount}
                                                          onChange={(e) =>
                                                            updateSubItemSubCost(
                                                              asset.id,
                                                              sic.id,
                                                              tc.id,
                                                              "transitDiscount",
                                                              Number(
                                                                e.target.value,
                                                              ) || 0,
                                                            )
                                                          }
                                                          style={{ width: 55 }}
                                                        />
                                                        <span
                                                          style={{
                                                            fontSize: 10,
                                                            color:
                                                              "var(--text-muted)",
                                                          }}
                                                        >
                                                          %
                                                        </span>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                                {/* Total cost with breakdown */}
                                                <div
                                                  className={styles.subCell}
                                                  style={{
                                                    fontWeight: 600,
                                                    fontSize: 11,
                                                  }}
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
                                                      $ {fmtCost(tcCost)}
                                                    </span>
                                                    {tcDailyRate > 0 &&
                                                      tcTotalDays > 0 && (
                                                        <span
                                                          style={{
                                                            fontSize: 9,
                                                            color:
                                                              "var(--text-muted)",
                                                            fontWeight: 400,
                                                          }}
                                                        >
                                                          {fmtCost(tcDailyRate)}{" "}
                                                          × (100-{tcDiscount})%
                                                          × {tcTotalDays}d
                                                        </span>
                                                      )}
                                                  </div>
                                                </div>
                                                {/* Remaining empty cells */}
                                                <div
                                                  className={styles.subCell}
                                                />
                                                <div
                                                  className={styles.subCell}
                                                />
                                                <div
                                                  className={styles.subCell}
                                                />
                                                <div
                                                  className={styles.subCell}
                                                />
                                                <div
                                                  className={styles.subCell}
                                                />
                                                <div
                                                  className={styles.subCell}
                                                />
                                              </div>
                                            );
                                          })}
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                              {/* Sub-items subtotal footer */}
                              {getSubItemCostsTotal(asset) > 0 && (
                                <div className={styles.subFooter}>
                                  <span className={styles.subFooterLabel}>
                                    Sub-items subtotal:
                                  </span>
                                  <span className={styles.subFooterValue}>
                                    ${" "}
                                    {getSubItemCostsTotal(
                                      asset,
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showCostSearch && (
        <CostSearchModal
          scopeItems={scopeItems}
          assetBreakdown={localAssets}
          onImport={handleCostSearchImport}
          onClose={() => setShowCostSearch(false)}
          onCreateBom={onCreateBom}
        />
      )}

      {/* Add Quotation Modal */}
      {addQuotationTarget && (
        <AddQuotationModal
          onClose={() => setAddQuotationTarget(null)}
          onSaved={handleQuotationSaved}
          defaultPartNumber={addQuotationTarget.partNumber}
          defaultDescription={addQuotationTarget.description}
        />
      )}

      {/* Quotation Picker — after saving a new quotation, let user pick which to import */}
      {quotationPickerTarget && (
        <div
          className={styles.pickerOverlay}
          onClick={() => setQuotationPickerTarget(null)}
        >
          <div
            className={styles.pickerModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.pickerHeader}>
              <h3>Import from Quotation</h3>
              <button
                className={styles.pickerClose}
                onClick={() => setQuotationPickerTarget(null)}
              >
                ✕
              </button>
            </div>
            <p className={styles.pickerSubtitle}>
              Select a quotation to import cost data for{" "}
              <strong>{quotationPickerTarget.partNumber || "this item"}</strong>
            </p>
            <div className={styles.pickerList}>
              {quotationItems
                .filter((q) => {
                  const pn = quotationPickerTarget.partNumber
                    .trim()
                    .toUpperCase();
                  if (!pn || pn === "TBD" || pn === "TBC") return false;
                  return q.partNumber.trim().toUpperCase().indexOf(pn) >= 0;
                })
                .map((q) => (
                  <div
                    key={q.id}
                    className={styles.pickerItem}
                    onClick={() => handleQuotationPickerImport(q)}
                  >
                    <div className={styles.pickerItemMain}>
                      <span className={styles.pickerItemPN}>
                        {q.partNumber}
                      </span>
                      <span className={styles.pickerItemDesc}>
                        {q.description}
                      </span>
                    </div>
                    <div className={styles.pickerItemMeta}>
                      <span>
                        ${" "}
                        {(q.costUSD || q.cost).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className={styles.pickerItemSupplier}>
                        {q.supplier}
                      </span>
                      <span className={styles.pickerItemDate}>
                        {q.quotationDate
                          ? new Date(q.quotationDate).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              {quotationItems.filter((q) => {
                const pn = quotationPickerTarget.partNumber
                  .trim()
                  .toUpperCase();
                if (!pn) return true;
                return q.partNumber.trim().toUpperCase().indexOf(pn) >= 0;
              }).length === 0 && (
                <div className={styles.pickerEmpty}>
                  No matching quotations found.
                </div>
              )}
            </div>
            <div className={styles.pickerFooter}>
              <button
                className={styles.pickerCancelBtn}
                onClick={() => setQuotationPickerTarget(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
