import * as React from "react";
import { Search, Check, TriangleAlert } from "lucide-react";
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
import { QuotationService } from "../../services/QuotationService";
import { ROUTES } from "../../config/routes.config";
import { ConfirmDialog } from "../common/ConfirmDialog";
import {
  getAssetCostBreakdown,
  getAssetsCostCompleteness,
  getSubItemNode,
  getSubCostAmount,
  isRentalAcq,
  isWorkshopAcq,
  TRANSIT_DEFAULT_DISCOUNT,
  getSplitNode,
  IAssetCostBreakdown,
  IContingencyOpts,
  ICostNode,
} from "../../utils/costCalculations";
import styles from "./AssetsBreakdownTab.module.scss";

interface AssetsBreakdownTabProps {
  scopeItems: IScopeItem[];
  assetBreakdown: IAssetBreakdownItem[];
  onSave: (items: IAssetBreakdownItem[]) => void;
  readOnly?: boolean;
  /** Called when user wants to create a BOM from Search Costs modal (triggers navigation to BOM Costs) */
  onCreateBom?: (partNumber: string, description: string) => void;
  /** Persisted contingency rate (% per year) */
  contingencyPerYearSaved?: number;
  /** Persisted contingency active state */
  contingencyAppliedSaved?: boolean;
  /** Called when contingency settings change, so parent can persist to bid */
  onContingencyChange?: (perYear: number, applied: boolean) => void;
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
  transitDiscount: TRANSIT_DEFAULT_DISCOUNT,
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

/** Everything a price / quotation import writes — reset together by "Clear pricing". */
const CLEARED_PRICING = {
  unitCostUSD: 0,
  totalCostUSD: 0,
  costReference: "",
  supplier: "",
  dateReference: "",
  leadTimeDays: 0,
  originalCost: 0,
  originalCurrency: "USD",
  costDate: "",
  quotationReference: null,
  quotationFileUrl: null,
};

const hasPricing = (c: {
  unitCostUSD?: number;
  costReference?: string;
  supplier?: string;
  dateReference?: string;
  leadTimeDays?: number;
  quotationReference?: string | null;
}): boolean =>
  !!(
    c.unitCostUSD ||
    c.costReference ||
    c.supplier ||
    c.dateReference ||
    c.leadTimeDays ||
    c.quotationReference
  );

/** Keeps a transit rate's persisted amount in sync with the live formula the UI shows. */
const syncTransitFees = (
  subCosts: IAssetSubCost[] | undefined,
  parentDailyRate: number,
): IAssetSubCost[] =>
  (subCosts || []).map((sc) => {
    if (!sc.isTransitRate) return sc;
    return {
      ...sc,
      costUSD: getSubCostAmount(sc, parentDailyRate),
      leadTimeDays: (sc.importDays || 0) + (sc.exportDays || 0),
    };
  });

/** A transit rate the user has already filled in — dropping it needs confirmation. */
const isTransitFilled = (sc: IAssetSubCost): boolean =>
  !!sc.isTransitRate &&
  ((sc.importDays || 0) > 0 ||
    (sc.exportDays || 0) > 0 ||
    !!(sc.notes || "").trim() ||
    (sc.transitDiscount !== undefined &&
      sc.transitDiscount !== null &&
      sc.transitDiscount !== TRANSIT_DEFAULT_DISCOUNT));

const withoutTransit = (
  subCosts: IAssetSubCost[] | undefined,
): IAssetSubCost[] => (subCosts || []).filter((sc) => !sc.isTransitRate);

/** Availability always resets the Acq. Type, so either edit can take a row out of Rental. */
const leavesRental = (field: string, value: unknown): boolean =>
  field === "availabilityStatus" ||
  (field === "acquisitionType" && !isRentalAcq(String(value || "")));

/** The three sections of an asset's detail drawer */
type DrawerTab = "splits" | "items" | "fees";

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

/** Duration of the drawer/section collapse exit animation — keep in sync with the CSS keyframes */
const DRAWER_ANIM_MS = 180;

/** Calculate contingency % based on years since dateReference */
const calcContingencyPct = (
  dateRef: string | undefined,
  pctPerYear: number,
): number => {
  if (!dateRef || pctPerYear <= 0) return 0;
  const refDate = new Date(dateRef);
  if (isNaN(refDate.getTime())) return 0;
  const currentYear = new Date().getFullYear();
  const years = currentYear - refDate.getFullYear();
  if (years <= 0) return 0;
  return years * pctPerYear;
};

/** Apply contingency to a unit cost */
const applyContingency = (
  unitCost: number,
  dateRef: string | undefined,
  pctPerYear: number,
): number => {
  const pct = calcContingencyPct(dateRef, pctPerYear);
  if (pct <= 0) return unitCost;
  return unitCost * (1 + pct / 100);
};
const isQuerySource = (ref: string): boolean => {
  if (!ref) return false;
  const upper = ref.toUpperCase();
  return QUERY_SOURCES.some(
    (s) => upper === s || upper.startsWith(s.slice(0, 3)),
  );
};

/** Resolves the URL a "quote link" chip should open — the quote's file if uploaded, else the Quotations page */
const getQuoteLinkHref = (fileUrl?: string | null): string =>
  fileUrl
    ? QuotationService.getFileOpenUrl(fileUrl)
    : `${window.location.pathname}${window.location.search}#${ROUTES.quotations}`;

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
  contingencyPerYearSaved,
  contingencyAppliedSaved,
  onContingencyChange,
}) => {
  // Helper: append fieldEmpty class when value is empty/falsy
  const emptyIf = (base: string, value: unknown): string =>
    value ? base : `${base} ${styles.fieldEmpty}`;
  // Red border on an editable cost input that is still zero
  const missingIf = (base: string, value: number | null | undefined): string =>
    value ? base : `${base} ${styles.fieldMissing}`;

  // ─── Cost-kind abstraction: sub-items vs PCF share the same logic ───
  // "sub" → asset.subItemCosts + scope.subItems
  // "pcf" → asset.pcfCosts + scope.pcfItems
  type CostKind = "sub" | "pcf";
  const costsOf = (a: IAssetBreakdownItem, kind: CostKind): ISubItemCost[] =>
    (kind === "pcf" ? a.pcfCosts : a.subItemCosts) || [];
  const withCosts = (
    a: IAssetBreakdownItem,
    kind: CostKind,
    costs: ISubItemCost[],
  ): IAssetBreakdownItem =>
    kind === "pcf" ? { ...a, pcfCosts: costs } : { ...a, subItemCosts: costs };
  const childrenOf = (
    si: IScopeItem | undefined,
    kind: CostKind,
  ): IScopeSubItem[] =>
    ((kind === "pcf" ? si?.pcfItems : si?.subItems) || []) as IScopeSubItem[];

  const config = useConfigStore((s) => s.config);
  const availabilityStatuses = (config?.availabilityStatuses || []).filter(
    (a) => a.isActive !== false,
  );
  const acquisitionTypes = (config?.acquisitionTypes || []).filter(
    (a) => a.isActive !== false,
  );

  const [collapsedSubItems, setCollapsedSubItems] = React.useState<Set<string>>(
    new Set(),
  );
  /** Which tab the asset's detail drawer is showing */
  const [drawerTab, setDrawerTab] = React.useState<Record<string, DrawerTab>>(
    {},
  );
  /** Anchor for the cost-breakdown popover (viewport coords — the table wrapper clips absolutes) */
  const [breakdownAnchor, setBreakdownAnchor] = React.useState<{
    assetId: string;
    x: number;
    y: number;
    anchorTop: number;
  } | null>(null);
  const breakdownPopoverRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    const popover = breakdownPopoverRef.current;
    if (!breakdownAnchor || !popover) return;

    const viewportMargin = 8;
    const rect = popover.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    let x = breakdownAnchor.x;
    let y = breakdownAnchor.y;

    if (rect.right > viewportWidth - viewportMargin) {
      x -= rect.right - (viewportWidth - viewportMargin);
    }
    if (rect.left < viewportMargin) x += viewportMargin - rect.left;
    if (rect.bottom > viewportHeight - viewportMargin) {
      y = Math.max(viewportMargin, breakdownAnchor.anchorTop - rect.height - 4);
    }

    if (x !== breakdownAnchor.x || y !== breakdownAnchor.y) {
      setBreakdownAnchor({ ...breakdownAnchor, x, y });
    }
  }, [breakdownAnchor]);

  React.useEffect(() => {
    if (!breakdownAnchor) return undefined;
    const close = (): void => setBreakdownAnchor(null);
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [breakdownAnchor]);
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(
    new Set(),
  );
  // Ids mid-way through the collapse animation — kept rendered with a "closing" class
  const [closingSubItems, setClosingSubItems] = React.useState<Set<string>>(
    new Set(),
  );
  const [closingSectionIds, setClosingSectionIds] = React.useState<Set<string>>(
    new Set(),
  );
  const [showCostSearch, setShowCostSearch] = React.useState(false);

  // ─── Notes (balloon toggle + inline panel, matches Hours & Personnel) ───
  const [expandedNotesIds, setExpandedNotesIds] = React.useState<Set<string>>(
    new Set(),
  );
  const toggleNotesExpand = (key: string): void => {
    setExpandedNotesIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const noteBtnClass = (key: string, notes?: string): string => {
    if (expandedNotesIds.has(key))
      return `${styles.noteBtn} ${styles.noteBtnActive}`;
    if (notes) return `${styles.noteBtn} ${styles.noteBtnFilled}`;
    return styles.noteBtn;
  };

  // ─── Contingency state ───
  const [contingencyPerYear, setContingencyPerYear] = React.useState(
    contingencyPerYearSaved ?? 10,
  );
  const [isContingencyEditing, setIsContingencyEditing] = React.useState(false);
  // Contingency is always active — what matters is the % (0% = no adjustment)
  const contingencyApplied = contingencyPerYear > 0;

  // Persist contingency changes to parent (bid)
  const contingencyTimerRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const contingencyMountedRef = React.useRef(false);
  React.useEffect(() => {
    // Skip initial mount — only persist user-driven changes
    if (!contingencyMountedRef.current) {
      contingencyMountedRef.current = true;
      return;
    }
    if (contingencyTimerRef.current) clearTimeout(contingencyTimerRef.current);
    contingencyTimerRef.current = setTimeout(() => {
      if (onContingencyChange) {
        onContingencyChange(contingencyPerYear, contingencyApplied);
      }
    }, 500);
    return () => {
      if (contingencyTimerRef.current)
        clearTimeout(contingencyTimerRef.current);
    };
  }, [contingencyPerYear]);

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

      // Sync PCF costs with scope PCF items (same pattern)
      const scopePCF = (si.pcfItems || []) as IScopeSubItem[];
      const existingPCFC = new Map(
        (asset.pcfCosts || []).map((pc) => [pc.subItemId, pc]),
      );
      const syncedPCFC: ISubItemCost[] = [];
      scopePCF.forEach((pcf) => {
        const existing3 = existingPCFC.get(pcf.id);
        if (existing3) {
          syncedPCFC.push(existing3);
        } else {
          syncedPCFC.push({
            ...blankSubItemCost(pcf.id),
            costCategory: "CAPEX",
          });
        }
      });

      result.push({
        ...asset,
        subItemCosts: syncedSIC,
        pcfCosts: syncedPCFC,
        // Auto-disable costFromPCF if no PCF items remain
        costFromPCF: syncedPCFC.length > 0 ? asset.costFromPCF : false,
      });
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

  // ─── Transit Rate removal confirmation ───
  const [pendingTransitDrop, setPendingTransitDrop] = React.useState<{
    count: number;
    apply: () => void;
  } | null>(null);

  // ─── Clear pricing (undo a mistaken price / quotation import) ───
  const [pendingPriceClear, setPendingPriceClear] = React.useState<{
    assetId: string;
    costId?: string;
    kind: CostKind;
  } | null>(null);

  const clearPricing = (
    assetId: string,
    costId: string | undefined,
    kind: CostKind,
  ): void => {
    persist(
      localAssets.map((a) => {
        if (a.id !== assetId) return a;
        if (!costId) {
          return { ...a, ...CLEARED_PRICING, costCalcMethod: "manual" };
        }
        return withCosts(
          a,
          kind,
          costsOf(a, kind).map((sic) =>
            sic.id === costId ? { ...sic, ...CLEARED_PRICING } : sic,
          ),
        );
      }),
    );
  };

  /** Holds back an edit that would discard filled-in transit rates until the user confirms it. */
  const deferTransitDrop = (
    fees: IAssetSubCost[],
    apply: () => void,
  ): boolean => {
    const count = fees.filter(isTransitFilled).length;
    if (count === 0) return false;
    setPendingTransitDrop({ count, apply });
    return true;
  };

  const updateField = (
    id: string,
    field: keyof IAssetBreakdownItem,
    value: unknown,
    confirmed = false,
  ): void => {
    const drop = leavesRental(field, value);
    if (
      drop &&
      !confirmed &&
      deferTransitDrop(
        localAssets.find((a) => a.id === id)?.subCosts || [],
        () => updateField(id, field, value, true),
      )
    ) {
      return;
    }
    const updated = localAssets.map((a) => {
      if (a.id !== id) return a;
      const patched = { ...a, [field]: value };
      if (drop) patched.subCosts = withoutTransit(patched.subCosts);

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
          patched.subCosts = syncTransitFees(patched.subCosts, rate);
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

    // Reveal the auto-created Transit Rate as soon as Rental is picked
    if (
      field === "acquisitionType" &&
      String(value).toLowerCase() === "rental"
    ) {
      openDrawer(id, "fees");
    }
  };

  /** Bulk-update a field for all assets in a given section */
  const bulkUpdateSectionField = (
    sectionId: string,
    field: keyof IAssetBreakdownItem,
    value: unknown,
    confirmed = false,
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

    const drop = leavesRental(field, value);
    if (drop && !confirmed) {
      const sectionFees: IAssetSubCost[] = [];
      localAssets.forEach((a) => {
        if (sectionAssetIds.has(a.id))
          (a.subCosts || []).forEach((sc) => sectionFees.push(sc));
      });
      if (
        deferTransitDrop(sectionFees, () =>
          bulkUpdateSectionField(sectionId, field, value, true),
        )
      ) {
        return;
      }
    }

    // Apply updateField logic to each matching asset
    const updated = localAssets.map((a) => {
      if (!sectionAssetIds.has(a.id)) return a;
      const patched = { ...a, [field]: value };
      if (drop) patched.subCosts = withoutTransit(patched.subCosts);
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
            return syncTransitFees([patched], a.dailyRate || 0)[0];
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

  const mapSplit = (
    assetId: string,
    splitId: string,
    fn: (sp: IAvailabilitySplit) => IAvailabilitySplit,
  ): void => {
    persist(
      localAssets.map((a) =>
        a.id !== assetId
          ? a
          : {
              ...a,
              availabilitySplits: (a.availabilitySplits || []).map((sp) =>
                sp.id === splitId ? fn(sp) : sp,
              ),
            },
      ),
    );
  };

  const addSplitSubCost = (assetId: string, splitId: string): void =>
    mapSplit(assetId, splitId, (sp) => ({
      ...sp,
      subCosts: [...(sp.subCosts || []), blankSubCost()],
    }));

  const deleteSplitSubCost = (
    assetId: string,
    splitId: string,
    subCostId: string,
  ): void =>
    mapSplit(assetId, splitId, (sp) => ({
      ...sp,
      subCosts: (sp.subCosts || []).filter((sc) => sc.id !== subCostId),
    }));

  /** Rescue asset-level fees that splits made invisible — moves them into the first split */
  const moveFeesToFirstSplit = (assetId: string): void => {
    persist(
      localAssets.map((a) => {
        if (a.id !== assetId) return a;
        const splits = a.availabilitySplits || [];
        if (splits.length === 0 || (a.subCosts || []).length === 0) return a;
        return {
          ...a,
          subCosts: [],
          availabilitySplits: splits.map((sp, i) =>
            i === 0
              ? {
                  ...sp,
                  subCosts: [...(sp.subCosts || []), ...(a.subCosts || [])],
                }
              : sp,
          ),
        };
      }),
    );
    openDrawer(assetId, "splits");
  };

  /** Default tab when the drawer is opened without an explicit choice */
  const defaultDrawerTab = (a: IAssetBreakdownItem): DrawerTab => {
    const si = getScopeItem(a.scopeItemId);
    if (((si?.subItems || []) as IScopeSubItem[]).length > 0) return "items";
    if ((a.availabilitySplits || []).length > 0) return "splits";
    return "fees";
  };

  /** Open an asset's drawer on a given tab (cancels any in-flight close animation) */
  const openDrawer = (assetId: string, tab: DrawerTab): void => {
    setClosingSubItems((prev) => {
      if (!prev.has(assetId)) return prev;
      const next = new Set(prev);
      next.delete(assetId);
      return next;
    });
    setCollapsedSubItems((prev) => {
      if (!prev.has(assetId)) return prev;
      const next = new Set(prev);
      next.delete(assetId);
      return next;
    });
    setDrawerTab((prev) => ({ ...prev, [assetId]: tab }));
  };

  const closeDrawer = (assetId: string): void => {
    setClosingSubItems((prev) => new Set(prev).add(assetId));
    setTimeout(() => {
      setCollapsedSubItems((prev) => new Set(prev).add(assetId));
      setClosingSubItems((prev) => {
        const next = new Set(prev);
        next.delete(assetId);
        return next;
      });
    }, DRAWER_ANIM_MS);
  };

  /** Chevron in the first column — toggles the whole drawer */
  const toggleSubItems = (assetId: string): void => {
    if (collapsedSubItems.has(assetId)) {
      const asset = localAssets.find((a) => a.id === assetId);
      openDrawer(assetId, asset ? defaultDrawerTab(asset) : "items");
    } else {
      closeDrawer(assetId);
    }
  };

  /** Jump straight to a tab — closes the drawer if that tab is already showing */
  const toggleDrawerTab = (assetId: string, tab: DrawerTab): void => {
    const isOpen = !collapsedSubItems.has(assetId);
    if (isOpen && drawerTab[assetId] === tab) closeDrawer(assetId);
    else openDrawer(assetId, tab);
  };

  // ─── Sub-item cost handlers ───
  const updateSubItemCost = (
    assetId: string,
    subItemCostId: string,
    field: keyof ISubItemCost,
    value: unknown,
    kind: CostKind = "sub",
    confirmed = false,
  ): void => {
    const drop = leavesRental(field, value);
    if (drop && !confirmed) {
      const owner = localAssets.find((a) => a.id === assetId);
      const target = owner
        ? costsOf(owner, kind).find((sic) => sic.id === subItemCostId)
        : undefined;
      if (
        deferTransitDrop(target?.subCosts || [], () =>
          updateSubItemCost(assetId, subItemCostId, field, value, kind, true),
        )
      ) {
        return;
      }
    }
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return withCosts(
        a,
        kind,
        costsOf(a, kind).map((sic) => {
          if (sic.id !== subItemCostId) return sic;
          const patched = { ...sic, [field]: value };
          if (drop) patched.subCosts = withoutTransit(patched.subCosts);

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
            } else if (isWorkshopAcq(acqVal)) {
              patched.costCategory = "OPEX";
              patched.unitCostUSD = 0;
              patched.totalCostUSD = 0;
              patched.dailyRate = null;
              patched.rentalDays = null;
            } else {
              patched.dailyRate = null;
              patched.rentalDays = null;
              if (acqVal === "purchase") {
                // Check sub-item subType for Consumable → OPEX
                const si = (scopeItems || []).find(
                  (s) => s.id === a.scopeItemId,
                );
                const scopeSub = childrenOf(si, kind).find(
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
            const sub = getSubItemForCost(a.scopeItemId, sic.subItemId, kind);
            const qty = sub?.qty || 1;
            patched.totalCostUSD = rate * days * qty;
            patched.unitCostUSD = rate;
            // Recalculate transit sub-cost
            if (field === "dailyRate") {
              patched.subCosts = syncTransitFees(patched.subCosts, rate);
            }
          }

          // Auto-calc totalCostUSD = unitCostUSD × qty (for non-rental)
          if (
            field === "unitCostUSD" &&
            (patched.acquisitionType || "").toLowerCase() !== "rental"
          ) {
            const sub = getSubItemForCost(a.scopeItemId, sic.subItemId, kind);
            const qty = sub?.qty || 1;
            patched.totalCostUSD = (Number(value) || 0) * qty;
          }
          return patched;
        }),
      );
    });
    persist(updated);
  };

  /** Bulk-update a field for all sub-item / PCF costs of a given asset */
  const bulkUpdateSubItems = (
    assetId: string,
    field: keyof ISubItemCost,
    value: unknown,
    kind: CostKind = "sub",
    confirmed = false,
  ): void => {
    const drop = leavesRental(field, value);
    if (drop && !confirmed) {
      const owner = localAssets.find((a) => a.id === assetId);
      const fees: IAssetSubCost[] = [];
      if (owner)
        costsOf(owner, kind).forEach((sic) =>
          (sic.subCosts || []).forEach((sc) => fees.push(sc)),
        );
      if (
        deferTransitDrop(fees, () =>
          bulkUpdateSubItems(assetId, field, value, kind, true),
        )
      ) {
        return;
      }
    }
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return withCosts(
        a,
        kind,
        costsOf(a, kind).map((sic) => {
          const patched = { ...sic, [field]: value };
          if (drop) patched.subCosts = withoutTransit(patched.subCosts);

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
            } else if (isWorkshopAcq(acqVal)) {
              patched.costCategory = "OPEX";
              patched.unitCostUSD = 0;
              patched.totalCostUSD = 0;
              patched.dailyRate = null;
              patched.rentalDays = null;
            } else {
              patched.dailyRate = null;
              patched.rentalDays = null;
              if (acqVal === "purchase") {
                const si = (scopeItems || []).find(
                  (s) => s.id === a.scopeItemId,
                );
                const scopeSub = childrenOf(si, kind).find(
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
      );
    });
    persist(updated);
  };

  // ─── Sub-item Availability Splits handlers ───
  /** Enable splits for a sub-item cost */
  const handleEnableSubItemSplits = (
    assetId: string,
    subItemCostId: string,
    kind: CostKind = "sub",
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return withCosts(
        a,
        kind,
        costsOf(a, kind).map((sic) => {
          if (sic.id !== subItemCostId) return sic;
          const sub = getSubItemForCost(a.scopeItemId, sic.subItemId, kind);
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
      );
    });
    persist(updated);
  };

  /** Disable splits for a sub-item cost */
  const handleDisableSubItemSplits = (
    assetId: string,
    subItemCostId: string,
    kind: CostKind = "sub",
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return withCosts(
        a,
        kind,
        costsOf(a, kind).map((sic) => {
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
      );
    });
    persist(updated);
  };

  /** Add a split to a sub-item cost */
  const handleAddSubItemSplit = (
    assetId: string,
    subItemCostId: string,
    kind: CostKind = "sub",
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return withCosts(
        a,
        kind,
        costsOf(a, kind).map((sic) => {
          if (sic.id !== subItemCostId) return sic;
          const sub = getSubItemForCost(a.scopeItemId, sic.subItemId, kind);
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
      );
    });
    persist(updated);
  };

  /** Remove a split from a sub-item cost */
  const handleRemoveSubItemSplit = (
    assetId: string,
    subItemCostId: string,
    splitId: string,
    kind: CostKind = "sub",
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return withCosts(
        a,
        kind,
        costsOf(a, kind).map((sic) => {
          if (sic.id !== subItemCostId) return sic;
          const filtered = (sic.availabilitySplits || []).filter(
            (sp) => sp.id !== splitId,
          );
          if (filtered.length === 0)
            return { ...sic, availabilitySplits: undefined };
          return { ...sic, availabilitySplits: filtered };
        }),
      );
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
    kind: CostKind = "sub",
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return withCosts(
        a,
        kind,
        costsOf(a, kind).map((sic) => {
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
      );
    });
    persist(updated);
  };

  /** Look up a scope sub-item (or PCF item) by parent scope ID and child ID */
  const getSubItemForCost = (
    scopeItemId: string,
    subItemId: string,
    kind: CostKind = "sub",
  ): IScopeSubItem | undefined => {
    const si = (scopeItems || []).find((s) => s.id === scopeItemId);
    return si
      ? childrenOf(si, kind).find((sub) => sub.id === subItemId)
      : undefined;
  };

  /** Canonical cost node for a sub-item / PCF cost entry */
  const subItemNodeOf = (
    sic: ISubItemCost,
    scopeItemId: string,
    kind: CostKind = "sub",
  ): ICostNode =>
    getSubItemNode(
      sic,
      (scopeItems || []).find((s) => s.id === scopeItemId),
      { perYear: contingencyPerYear, applied: contingencyApplied },
    );

  /** Get the effective total for a sub-item / PCF cost entry */
  const getSubItemCostTotal = (
    sic: ISubItemCost,
    scopeItemId: string,
    kind: CostKind = "sub",
  ): number => subItemNodeOf(sic, scopeItemId, kind).total;

  const toggleSection = (sectionId: string): void => {
    const isExpanded = !collapsedSections.has(sectionId);
    if (isExpanded) {
      // Collapsing — keep the section's rows rendered while they fade out
      setClosingSectionIds((prev) => new Set(prev).add(sectionId));
      setTimeout(() => {
        setCollapsedSections((prev) => new Set(prev).add(sectionId));
        setClosingSectionIds((prev) => {
          const next = new Set(prev);
          next.delete(sectionId);
          return next;
        });
      }, DRAWER_ANIM_MS);
    } else {
      setCollapsedSections((prev) => {
        const next = new Set(prev);
        next.delete(sectionId);
        return next;
      });
    }
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
    openDrawer(assetId, "splits");
  };

  /** Disable all splits for an asset — reverts to normal mode */
  const handleDisableSplits = (assetId: string): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      // Take values from first split if exists
      const splits = a.availabilitySplits || [];
      const first = splits[0];
      if (first) {
        // Keep the fees of every split, not just the first one, or their money is destroyed
        const mergedFees: IAssetSubCost[] = [];
        splits.forEach((sp) =>
          (sp.subCosts || []).forEach((sc) => mergedFees.push(sc)),
        );
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
          subCosts: mergedFees,
        };
      }
      return { ...a, availabilitySplits: undefined };
    });
    persist(updated);
    // The Splits tab no longer exists for this asset
    setDrawerTab((prev) =>
      prev[assetId] === "splits" ? { ...prev, [assetId]: "fees" } : prev,
    );
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
    let splitsLeft = 0;
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      const filtered = (a.availabilitySplits || []).filter(
        (sp) => sp.id !== splitId,
      );
      splitsLeft = filtered.length;
      // If no splits left, revert to normal mode
      if (filtered.length === 0) {
        return { ...a, availabilitySplits: undefined };
      }
      return { ...a, availabilitySplits: filtered };
    });
    persist(updated);
    // Removing the last split kills the Splits tab — move the drawer somewhere valid
    if (splitsLeft === 0) {
      setDrawerTab((prev) =>
        prev[assetId] === "splits" ? { ...prev, [assetId]: "fees" } : prev,
      );
    }
  };

  /** Update a field on a specific split */
  const handleUpdateSplit = (
    assetId: string,
    splitId: string,
    field: keyof IAvailabilitySplit,
    value: unknown,
    confirmed = false,
  ): void => {
    const drop = leavesRental(field, value);
    if (drop && !confirmed) {
      const split = (
        localAssets.find((a) => a.id === assetId)?.availabilitySplits || []
      ).find((sp) => sp.id === splitId);
      if (
        deferTransitDrop(split?.subCosts || [], () =>
          handleUpdateSplit(assetId, splitId, field, value, true),
        )
      ) {
        return;
      }
    }
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      const splits = (a.availabilitySplits || []).map((sp) => {
        if (sp.id !== splitId) return sp;
        const patched = { ...sp, [field]: value };
        if (drop) patched.subCosts = withoutTransit(patched.subCosts);

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
              patched.subCosts = [blankTransitSubCost(), ...subs];
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
          // Recalculate transit sub-cost
          if (field === "dailyRate") {
            patched.subCosts = syncTransitFees(patched.subCosts, rate);
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
            return syncTransitFees([patched], sp.dailyRate || 0)[0];
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
    kind: CostKind = "sub",
  ): void => {
    const updated = localAssets.map((a) => {
      if (a.id !== assetId) return a;
      return withCosts(
        a,
        kind,
        costsOf(a, kind).map((sic) => {
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
              return syncTransitFees([patched], sic.dailyRate || 0)[0];
            }
            return patched;
          });
          return { ...sic, subCosts: updatedSubs };
        }),
      );
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

  const contingencyOpts: IContingencyOpts = {
    perYear: contingencyPerYear,
    applied: contingencyApplied,
  };

  /** Canonical cost breakdown for an asset — every total on this tab goes through it */
  const breakdownOf = (a: IAssetBreakdownItem): IAssetCostBreakdown =>
    getAssetCostBreakdown(a, getScopeItem(a.scopeItemId), contingencyOpts);

  /** Compute the effective displayed total for an asset (matches what Total Cost USD column shows) */
  const getEffectiveTotal = (a: IAssetBreakdownItem): number => {
    const bd = breakdownOf(a);
    // Rolled-up items have no own cost — their value lives in the sub-items,
    // which are already counted separately. Return 0 to avoid double counting.
    if (a.costFromSubItems) return 0;
    if (a.costFromPCF) return bd.pcfTotal;
    if (bd.splits.length > 0) return bd.splitsTotal;
    return bd.main.total;
  };

  /** Get the total of all sub-item costs for an asset */
  const getSubItemCostsTotal = (a: IAssetBreakdownItem): number =>
    breakdownOf(a).subItemsTotal;

  /** Get the total of all PCF costs for an asset (reuses sub-item cost logic) */
  const getPCFTotal = (a: IAssetBreakdownItem): number =>
    breakdownOf(a).pcfTotal;

  /**
   * Shared renderer for a sub-item / PCF cost row (incl. splits, contingency,
   * badges, date colors, transit rate). Used by both the Sub-Items and the
   * Preliminary Concept Form drawers so the logic lives in one place.
   */
  const renderCostRow = (
    asset: IAssetBreakdownItem,
    sic: ISubItemCost,
    idx: number,
    kind: CostKind,
  ): React.ReactNode => {
    const sub = getSubItemForCost(asset.scopeItemId, sic.subItemId, kind);
    if (!sub) return null;
    const sicQty = sub.qty || 1;
    const sicAvail = (sic.availabilityStatus || "").toLowerCase();
    const sicAcq = (sic.acquisitionType || "").toLowerCase();
    const sicIsNoCost =
      sicAvail === "onboard" ||
      sicAvail === "call out" ||
      sicAvail === "not offered";
    const sicIsRental = sicAcq === "rental";
    const sicIsNotOffered = sicAvail === "not offered";
    const sicIsWorkshopOrInHouse =
      sicAcq === "workshop" || sicAcq === "in house";
    const sicShowDashCost = sicIsNoCost || sicIsWorkshopOrInHouse;
    const sicShowDashMeta = sicIsNoCost || sicIsWorkshopOrInHouse;
    const sicNode = subItemNodeOf(sic, asset.scopeItemId, kind);
    const sicFees = sicNode.fees;
    const sicHasSplits = (sic.availabilitySplits || []).length > 0;
    const sicSplitsTotal = sicHasSplits ? sicNode.total : 0;
    const splitKey = `${kind === "pcf" ? "pcf" : "sic"}-${sic.id}`;
    const noteKey = `${kind === "pcf" ? "pcf" : "sic"}-note-${sic.id}`;
    return (
      <React.Fragment key={sic.id}>
        <div
          className={`${styles.subRow}${sicIsNotOffered ? ` ${styles.notOfferedRow}` : ""}`}
        >
          <div className={`${styles.subCell} ${styles.subNum}`}>{idx + 1}</div>
          <div className={`${styles.subCell} ${styles.subCellOffer}`}>
            {/* Fixed-width slot keeps the icon (and thus text start) aligned across rows */}
            <span className={styles.specsIconSlot}>
              {!!sub.description && (
                <span
                  className={styles.specsIndicator}
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={handleSpecsHover}
                  title=""
                >
                  <span className={styles.specsIndicatorIcon}>ℹ️</span>
                  <div className={styles.specsTooltip}>
                    <div className={styles.specsTooltipTitle}>Description</div>
                    {sub.description}
                  </div>
                </span>
              )}
            </span>
            <span className={styles.subCellText}>
              {sub.equipmentOffer || sub.description || "—"}
            </span>
          </div>
          {kind === "sub" ? (
            <>
              <div className={`${styles.subCell} ${styles.subCellMono}`}>
                {sub.partNumber || "—"}
              </div>
              <div className={styles.subCell}>{sub.subType || "—"}</div>
            </>
          ) : (
            <>
              <div className={styles.subCell}>{sub.subType || "—"}</div>
              <div className={`${styles.subCell} ${styles.subCellMono}`}>
                {sub.partNumber || "—"}
              </div>
            </>
          )}
          <div className={`${styles.subCell} ${styles.subCellCenter}`}>
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
                      className={styles.splitSummaryBadge}
                      onClick={() => toggleSplitsExpanded(splitKey)}
                      style={{ fontSize: 10, padding: "2px 5px" }}
                      title="View/edit splits"
                    >
                      {(sic.availabilitySplits || []).length} split
                      {(sic.availabilitySplits || []).length > 1 ? "s" : ""}
                    </button>
                    {!readOnly && (
                      <button
                        className={styles.splitDisableBtn}
                        onClick={() =>
                          handleDisableSubItemSplits(asset.id, sic.id, kind)
                        }
                        title="Remove splits"
                        style={{ padding: "2px 4px", fontSize: 10 }}
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
                    <span>{sic.availabilityStatus || "—"}</span>
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
                          kind,
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
                  {!readOnly && sicQty > 1 && (
                    <button
                      className={styles.splitEnableBtn}
                      onClick={() =>
                        handleEnableSubItemSplits(asset.id, sic.id, kind)
                      }
                      title="Split availability by quantity"
                      style={{ padding: "3px 4px", lineHeight: 1 }}
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
                {sicIsNotOffered ? "Not Offered" : "N/A"}
              </span>
            ) : (
              <select
                className={emptyIf(styles.selectCell, sic.acquisitionType)}
                value={sic.acquisitionType}
                onChange={(e) =>
                  updateSubItemCost(
                    asset.id,
                    sic.id,
                    "acquisitionType",
                    e.target.value,
                    kind,
                  )
                }
              >
                <option value="" disabled hidden>
                  Select...
                </option>
                {(() => {
                  const filtered = sic.availabilityStatus
                    ? acquisitionTypes.filter((at) => {
                        const parentVal = (at.category || "").split("|")[0];
                        return parentVal === sic.availabilityStatus;
                      })
                    : [];
                  const options =
                    filtered.length > 0 ? filtered : acquisitionTypes;
                  return options.map((at) => (
                    <option key={at.id} value={at.value}>
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
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <span style={{ fontSize: 11 }}>
                    $ {fmtCost(sic.dailyRate || 0)}{" "}
                    <span style={{ color: "var(--text-muted)", fontSize: 10 }}>
                      /day
                    </span>
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    {sic.rentalDays || 0} day
                    {(sic.rentalDays || 0) !== 1 ? "s" : ""}
                  </span>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
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
                      className={missingIf(styles.numInput, sic.dailyRate)}
                      type="number"
                      min={0}
                      step={0.01}
                      value={sic.dailyRate || 0}
                      placeholder="0.00"
                      onChange={(e) =>
                        updateSubItemCost(
                          asset.id,
                          sic.id,
                          "dailyRate" as keyof ISubItemCost,
                          Number(e.target.value) || 0,
                          kind,
                        )
                      }
                      style={{ width: 70 }}
                    />
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
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
                      className={missingIf(styles.numInput, sic.rentalDays)}
                      type="number"
                      min={0}
                      value={sic.rentalDays || 0}
                      placeholder="0"
                      onChange={(e) =>
                        updateSubItemCost(
                          asset.id,
                          sic.id,
                          "rentalDays" as keyof ISubItemCost,
                          Number(e.target.value) || 0,
                          kind,
                        )
                      }
                      style={{ width: 55 }}
                    />
                  </div>
                </div>
              )
            ) : readOnly ? (
              `$ ${fmtCost(
                contingencyApplied
                  ? applyContingency(
                      sic.unitCostUSD,
                      sic.dateReference,
                      contingencyPerYear,
                    )
                  : sic.unitCostUSD,
              )}`
            ) : (
              (() => {
                const sicContPct = contingencyApplied
                  ? calcContingencyPct(sic.dateReference, contingencyPerYear)
                  : 0;
                const sicAdjusted =
                  sicContPct > 0
                    ? applyContingency(
                        sic.unitCostUSD,
                        sic.dateReference,
                        contingencyPerYear,
                      )
                    : sic.unitCostUSD;
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <input
                      className={missingIf(styles.numInput, sic.unitCostUSD)}
                      type="number"
                      min={0}
                      step={0.01}
                      value={Math.round(sic.unitCostUSD * 100) / 100}
                      onChange={(e) =>
                        updateSubItemCost(
                          asset.id,
                          sic.id,
                          "unitCostUSD",
                          Number(e.target.value) || 0,
                          kind,
                        )
                      }
                    />
                    {sicContPct > 0 && (
                      <span className={styles.contingencyBadge}>
                        +{sicContPct}% → $ {fmtCost(sicAdjusted)}
                      </span>
                    )}
                  </div>
                );
              })()
            )}
          </div>
          <div className={`${styles.subCell} ${styles.subCellBold}`}>
            {sicHasSplits ? (
              <>
                <span style={{ fontWeight: 600 }}>
                  $ {fmtCost(sicSplitsTotal)}
                </span>
                {sicFees > 0 && (
                  <div className={styles.subCellCalc}>
                    incl. $ {fmtCost(sicFees)} fees
                  </div>
                )}
              </>
            ) : sicShowDashCost && sicFees <= 0 ? (
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
              (() => {
                return (
                  <>
                    $ {fmtCost(sicNode.total)}
                    {sicIsRental && (sic.dailyRate || 0) > 0 && (
                      <div className={styles.subCellCalc}>
                        {fmtCost(sic.dailyRate || 0)}/d × {sic.rentalDays || 0}d
                        {sicQty > 1 ? ` × ${sicQty}` : ""}
                      </div>
                    )}
                    {!sicIsRental && sicQty > 1 && (
                      <div className={styles.subCellCalc}>
                        {fmtCost(sicQty > 0 ? sicNode.base / sicQty : 0)} ×{" "}
                        {sicQty}
                      </div>
                    )}
                    {sicFees > 0 && (
                      <div className={styles.subCellCalc}>
                        incl. $ {fmtCost(sicFees)} fees
                      </div>
                    )}
                  </>
                );
              })()
            )}
          </div>
          <div className={styles.subCell}>
            {sicShowDashMeta ? (
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                —
              </span>
            ) : readOnly ? (
              (() => {
                if (isQuerySource(sic.costReference)) {
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
                          style={{ fontSize: 10, color: "var(--text-muted)" }}
                        >
                          {sic.supplier}
                        </span>
                      )}
                    </div>
                  );
                }
                const d = [sic.costReference, sic.supplier]
                  .filter(Boolean)
                  .join(" | ");
                return d ? (
                  <span style={{ fontSize: 11 }}>{d}</span>
                ) : (
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                );
              })()
            ) : (
              <input
                className={styles.editInput}
                value={[sic.costReference, sic.supplier]
                  .filter(Boolean)
                  .join(" | ")}
                placeholder="Cost Ref / Supplier..."
                onChange={(e) => {
                  const val = e.target.value;
                  const parts = val.split("|").map((p) => p.trim());
                  const updated = localAssets.map((a) => {
                    if (a.id !== asset.id) return a;
                    return withCosts(
                      a,
                      kind,
                      costsOf(a, kind).map((s) =>
                        s.id === sic.id
                          ? {
                              ...s,
                              costReference: parts[0] || "",
                              supplier: parts[1] || "",
                            }
                          : s,
                      ),
                    );
                  });
                  persist(updated);
                }}
                style={{ width: "100%", fontSize: 11 }}
              />
            )}
          </div>
          {/* Date Ref */}
          <div className={styles.subCell} style={{ fontSize: 11 }}>
            {sicShowDashMeta ? (
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                —
              </span>
            ) : readOnly ? (
              sic.dateReference ? (
                <span
                  className={`${styles.dateBadge} ${dateAgeClass(sic.dateReference)}`}
                >
                  {formatDateRef(sic.dateReference)}
                </span>
              ) : (
                "—"
              )
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                {sic.dateReference && (
                  <span style={{ fontSize: 10, whiteSpace: "nowrap" }}>
                    {formatDateRef(sic.dateReference)}
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
                    const inp = (ev.currentTarget as HTMLElement).querySelector(
                      "input",
                    ) as HTMLInputElement | null;
                    if (inp) {
                      try {
                        (
                          inp as unknown as { showPicker: () => void }
                        ).showPicker();
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
                    value={(sic.dateReference || "").slice(0, 10)}
                    onChange={(e) =>
                      updateSubItemCost(
                        asset.id,
                        sic.id,
                        "dateReference" as keyof ISubItemCost,
                        e.target.value,
                        kind,
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
          <div className={`${styles.subCell} ${styles.subCellCenter}`}>
            {sicShowDashMeta ? (
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
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
                    kind,
                  )
                }
                style={{ width: 50 }}
              />
            )}
          </div>
          <div className={styles.subCell}>
            {sicIsNoCost ? (
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                —
              </span>
            ) : sicIsRental || isWorkshopAcq(sic.acquisitionType) ? (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--primary-accent, #6366f1)",
                }}
              >
                OPEX
              </span>
            ) : readOnly ? (
              sic.costCategory || "—"
            ) : (
              <select
                className={emptyIf(styles.selectCell, sic.costCategory)}
                value={sic.costCategory}
                onChange={(e) =>
                  updateSubItemCost(
                    asset.id,
                    sic.id,
                    "costCategory",
                    e.target.value,
                    kind,
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
          </div>
          <div className={`${styles.subCell} ${styles.subCellNotes}`}>
            {(!readOnly || !!sic.notes) && (
              <button
                className={noteBtnClass(noteKey, sic.notes)}
                onClick={() => toggleNotesExpand(noteKey)}
                title={sic.notes ? "View/edit notes" : "Add notes"}
              >
                💬
              </button>
            )}
            {!readOnly && (
              <button
                className={styles.noteBtn}
                onClick={() =>
                  handleAddQuotation(
                    asset.id,
                    sub.partNumber || "",
                    sub.equipmentOffer || sub.description || "",
                    sic.id,
                  )
                }
                title="Add Quotation"
              >
                📝
              </button>
            )}
            {!readOnly && hasPricing(sic) && (
              <button
                className={`${styles.noteBtn} ${styles.clearPriceBtn}`}
                onClick={() =>
                  setPendingPriceClear({
                    assetId: asset.id,
                    costId: sic.id,
                    kind,
                  })
                }
                title="Clear pricing & quotation"
              >
                🧹
              </button>
            )}
            {sic.quotationReference && (
              <a
                className={styles.quoteLink}
                href={getQuoteLinkHref(sic.quotationFileUrl)}
                target="_blank"
                rel="noopener noreferrer"
                title={
                  sic.quotationFileUrl
                    ? `Open quotation: ${sic.quotationReference}`
                    : `From quotation "${sic.quotationReference}" — open Quotations to view`
                }
              >
                🔗 {sic.quotationReference}
              </a>
            )}
          </div>
        </div>
        {/* Inline notes panel */}
        {expandedNotesIds.has(noteKey) && (
          <div className={styles.subNoteRow}>
            <span className={styles.noteLabel}>💬 Notes</span>
            {readOnly ? (
              <span className={styles.noteText}>{sic.notes || "—"}</span>
            ) : (
              <textarea
                className={styles.noteInput}
                value={sic.notes || ""}
                placeholder="Add notes for this sub-item..."
                rows={2}
                autoFocus
                onChange={(e) =>
                  updateSubItemCost(
                    asset.id,
                    sic.id,
                    "notes",
                    e.target.value,
                    kind,
                  )
                }
              />
            )}
          </div>
        )}
        {/* Splits section */}
        {sicHasSplits && expandedSplits.has(splitKey) && (
          <div
            className={styles.subSplitRow}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: "6px 8px 6px 24px",
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
              <span>Splits (Qty: {sicQty})</span>
              {(() => {
                const assigned = (sic.availabilitySplits || []).reduce(
                  (s, sp) => s + (sp.qty || 0),
                  0,
                );
                const rem = sicQty - assigned;
                if (rem === 0)
                  return <span className={styles.splitQtyOk}>✓</span>;
                if (rem > 0)
                  return (
                    <span className={styles.splitQtyWarn}>
                      {rem} unassigned
                    </span>
                  );
                return (
                  <span className={styles.splitQtyError}>
                    {Math.abs(rem)} over
                  </span>
                );
              })()}
            </div>
            {(sic.availabilitySplits || []).map((sp, spIdx) => {
              const spAvail = (sp.availabilityStatus || "").toLowerCase();
              const spAcq = (sp.acquisitionType || "").toLowerCase();
              const spNoCost =
                spAvail === "onboard" ||
                spAvail === "call out" ||
                spAvail === "not offered";
              const spRental = spAcq === "rental";
              // Includes the split's own fees, so the lines add up to the "Total:" below
              const spTotal = getSplitNode(sp, contingencyOpts).total;
              return (
                <div
                  key={sp.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexWrap: "wrap",
                    padding: "3px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span
                    className={styles.splitIndex}
                    style={{ width: 16, height: 16, fontSize: 9 }}
                  >
                    {spIdx + 1}
                  </span>
                  {readOnly ? (
                    <span style={{ fontSize: 11 }}>×{sp.qty}</span>
                  ) : (
                    <input
                      className={styles.numInput}
                      type="number"
                      min={0}
                      value={sp.qty}
                      onChange={(e) =>
                        handleUpdateSubItemSplit(
                          asset.id,
                          sic.id,
                          sp.id,
                          "qty",
                          Number(e.target.value) || 0,
                          kind,
                        )
                      }
                      style={{ width: 40 }}
                    />
                  )}
                  {readOnly ? (
                    <span style={{ fontSize: 11 }}>
                      {sp.availabilityStatus || "—"}
                    </span>
                  ) : (
                    <select
                      className={emptyIf(
                        styles.selectCell,
                        sp.availabilityStatus,
                      )}
                      value={sp.availabilityStatus}
                      onChange={(e) =>
                        handleUpdateSubItemSplit(
                          asset.id,
                          sic.id,
                          sp.id,
                          "availabilityStatus",
                          e.target.value,
                          kind,
                        )
                      }
                      style={{ fontSize: 11 }}
                    >
                      <option value="" disabled hidden>
                        Avail...
                      </option>
                      {availabilityStatuses.map((o) => (
                        <option key={o.id} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {!spNoCost &&
                    (readOnly ? (
                      <span style={{ fontSize: 11 }}>
                        {sp.acquisitionType || "—"}
                      </span>
                    ) : (
                      <select
                        className={emptyIf(
                          styles.selectCell,
                          sp.acquisitionType,
                        )}
                        value={sp.acquisitionType}
                        onChange={(e) =>
                          handleUpdateSubItemSplit(
                            asset.id,
                            sic.id,
                            sp.id,
                            "acquisitionType",
                            e.target.value,
                            kind,
                          )
                        }
                        style={{ fontSize: 11 }}
                      >
                        <option value="" disabled hidden>
                          Acq...
                        </option>
                        {(() => {
                          const f = sp.availabilityStatus
                            ? acquisitionTypes.filter(
                                (at) =>
                                  (at.category || "").split("|")[0] ===
                                  sp.availabilityStatus,
                              )
                            : [];
                          return (f.length > 0 ? f : acquisitionTypes).map(
                            (at) => (
                              <option key={at.id} value={at.value}>
                                {at.label}
                              </option>
                            ),
                          );
                        })()}
                      </select>
                    ))}
                  {!spNoCost &&
                    !spRental &&
                    (readOnly ? (
                      <span style={{ fontSize: 11 }}>
                        $ {fmtCost(sp.unitCostUSD)}
                      </span>
                    ) : (
                      <input
                        className={missingIf(styles.numInput, sp.unitCostUSD)}
                        type="number"
                        min={0}
                        step={0.01}
                        value={Math.round(sp.unitCostUSD * 100) / 100}
                        onChange={(e) =>
                          handleUpdateSubItemSplit(
                            asset.id,
                            sic.id,
                            sp.id,
                            "unitCostUSD",
                            Number(e.target.value) || 0,
                            kind,
                          )
                        }
                        style={{ width: 70 }}
                      />
                    ))}
                  {spRental && !readOnly && (
                    <div
                      style={{ display: "flex", gap: 3, alignItems: "center" }}
                    >
                      <input
                        className={missingIf(styles.numInput, sp.dailyRate)}
                        type="number"
                        min={0}
                        step={0.01}
                        value={sp.dailyRate || 0}
                        onChange={(e) =>
                          handleUpdateSubItemSplit(
                            asset.id,
                            sic.id,
                            sp.id,
                            "dailyRate",
                            Number(e.target.value) || 0,
                            kind,
                          )
                        }
                        style={{ width: 60 }}
                        placeholder="Rate"
                      />
                      <span style={{ fontSize: 9, color: "var(--text-muted)" }}>
                        ×
                      </span>
                      <input
                        className={missingIf(styles.numInput, sp.rentalDays)}
                        type="number"
                        min={0}
                        value={sp.rentalDays || 0}
                        onChange={(e) =>
                          handleUpdateSubItemSplit(
                            asset.id,
                            sic.id,
                            sp.id,
                            "rentalDays",
                            Number(e.target.value) || 0,
                            kind,
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
                      className={styles.deleteSubCost}
                      onClick={() =>
                        handleRemoveSubItemSplit(asset.id, sic.id, sp.id, kind)
                      }
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
            {!readOnly && (
              <button
                className={styles.addSubCostBtn}
                onClick={() => handleAddSubItemSplit(asset.id, sic.id, kind)}
                style={{ marginTop: 2, fontSize: 10 }}
              >
                + Add Split
              </button>
            )}
            <div style={{ fontSize: 11, fontWeight: 600, textAlign: "right" }}>
              Total: $ {fmtCost(sicSplitsTotal)}
            </div>
          </div>
        )}
        {/* Transit Rate sub-cost for Rental items */}
        {sicIsRental &&
          !sicHasSplits &&
          (sic.subCosts || [])
            .filter((sc) => sc.isTransitRate)
            .map((tc) => {
              const tcImpDays = tc.importDays || 0;
              const tcExpDays = tc.exportDays || 0;
              const tcTotalDays = tcImpDays + tcExpDays;
              const tcDiscount = tc.transitDiscount ?? TRANSIT_DEFAULT_DISCOUNT;
              const tcDailyRate = sic.dailyRate || 0;
              const tcCost = getSubCostAmount(tc, tcDailyRate);
              return (
                <div
                  key={tc.id}
                  className={`${styles.subRow} ${styles.feeRowAuto}`}
                >
                  <div className={styles.subCell} />
                  <div className={styles.subCell} />
                  <div
                    className={styles.subCell}
                    style={{ gridColumn: "3 / 6" }}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      ↳ <span className={styles.feeTag}>Transit Rate</span>
                    </span>
                  </div>
                  <div
                    className={styles.subCell}
                    style={{ gridColumn: "6 / 9" }}
                  >
                    {readOnly ? (
                      <span style={{ fontSize: 12 }}>
                        Import: {tcImpDays}d · Export: {tcExpDays}d · Discount:{" "}
                        {tcDiscount}%
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
                              color: "var(--text-muted)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Import
                          </span>
                          <input
                            className={styles.numInput}
                            type="number"
                            min={0}
                            value={tcImpDays}
                            onChange={(e) =>
                              updateSubItemSubCost(
                                asset.id,
                                sic.id,
                                tc.id,
                                "importDays",
                                Number(e.target.value) || 0,
                                kind,
                              )
                            }
                            style={{ width: 48 }}
                          />
                          <span
                            style={{ fontSize: 10, color: "var(--text-muted)" }}
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
                              whiteSpace: "nowrap",
                            }}
                          >
                            Export
                          </span>
                          <input
                            className={styles.numInput}
                            type="number"
                            min={0}
                            value={tcExpDays}
                            onChange={(e) =>
                              updateSubItemSubCost(
                                asset.id,
                                sic.id,
                                tc.id,
                                "exportDays",
                                Number(e.target.value) || 0,
                                kind,
                              )
                            }
                            style={{ width: 48 }}
                          />
                          <span
                            style={{ fontSize: 10, color: "var(--text-muted)" }}
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
                              whiteSpace: "nowrap",
                            }}
                          >
                            Disc.
                          </span>
                          <input
                            className={styles.numInput}
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
                                Number(e.target.value) || 0,
                                kind,
                              )
                            }
                            style={{ width: 55 }}
                          />
                          <span
                            style={{ fontSize: 10, color: "var(--text-muted)" }}
                          >
                            %
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className={styles.subCell}
                    style={{ fontWeight: 600, fontSize: 11 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 1,
                      }}
                    >
                      <span>$ {fmtCost(tcCost)}</span>
                      {tcDailyRate > 0 && tcTotalDays > 0 && (
                        <span
                          style={{
                            fontSize: 9,
                            color: "var(--text-muted)",
                            fontWeight: 400,
                          }}
                        >
                          {fmtCost(tcDailyRate)} × (100-{tcDiscount})% ×{" "}
                          {tcTotalDays}d
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.subCell} />
                  <div className={styles.subCell} />
                  <div className={styles.subCell} />
                  <div className={styles.subCell} />
                  <div className={styles.subCell} />
                </div>
              );
            })}
      </React.Fragment>
    );
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
      if (!collapsedSections.has(sec.id) || closingSectionIds.has(sec.id)) {
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
  }, [localAssets, sections, collapsedSections, closingSectionIds, scopeItems]);

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
    let pcfCostsTotal = 0;
    const byResourceType: Record<string, number> = {};
    localAssets.forEach((a) => {
      const si = getScopeItem(a.scopeItemId);
      const resType = si?.resourceType || "";
      const bd = breakdownOf(a);

      capex += bd.capex;
      opex += bd.opex;
      uncategorized += bd.uncategorized;

      subCostsTotal += bd.main.fees + bd.orphanFees;
      subItemCostsTotal += bd.subItemsTotal;
      pcfCostsTotal += bd.pcfTotal;

      if (resType) {
        byResourceType[resType] = (byResourceType[resType] || 0) + bd.total;
      }
    });
    return {
      capex,
      opex,
      uncategorized,
      total: capex + opex + uncategorized,
      subCostsTotal,
      subItemCostsTotal,
      pcfCostsTotal,
      byResourceType,
    };
  }, [localAssets, contingencyApplied, contingencyPerYear]);

  // ─── Cost completeness tracker (same rule gates the Close Out phase) ───
  const costCompleteness = React.useMemo(
    () =>
      getAssetsCostCompleteness(scopeItems, localAssets, {
        perYear: contingencyPerYear,
        applied: contingencyApplied,
      }),
    [localAssets, scopeItems, contingencyApplied, contingencyPerYear],
  );

  const { totalMissing, totalItems } = costCompleteness;
  const allCostsFilled = totalMissing === 0 && totalItems > 0;

  // ─── Missing items detail list ───
  const [showMissingItems, setShowMissingItems] = React.useState(false);

  const missingItemsList = React.useMemo(() => {
    const items: Array<{
      type: "main" | "sub" | "pcf";
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

      if (!isNoCost && !isNoCostAcq && !a.costFromSubItems && !a.costFromPCF) {
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

      // PCF costs missing
      (a.pcfCosts || []).forEach((pc) => {
        const pcAvail = (pc.availabilityStatus || "").toLowerCase();
        const pcAcq = (pc.acquisitionType || "").toLowerCase();
        const pcIsNoCost =
          pcAvail === "onboard" ||
          pcAvail === "call out" ||
          pcAvail === "not offered";
        const pcIsNoCostAcq = pcAcq === "workshop" || pcAcq === "in house";
        if (pcIsNoCost || pcIsNoCostAcq) return;
        const pcTotal = getSubItemCostTotal(pc, a.scopeItemId, "pcf");
        if (pcTotal === 0 && si) {
          const pcfSub = (si.pcfItems || []).find((p) => p.id === pc.subItemId);
          items.push({
            type: "pcf",
            assetId: a.id,
            sectionId: si.sectionId || null,
            lineNumber: si.lineNumber,
            equipmentOffer: pcfSub
              ? pcfSub.equipmentOffer || pcfSub.description || "PCF item"
              : "PCF item",
            partNumber: pcfSub ? pcfSub.partNumber || "—" : "—",
            resourceType: si.resourceType || "—",
            resourceSubType: pcfSub ? pcfSub.subType || "—" : "—",
          });
        }
      });
    });

    return items;
  }, [localAssets, scopeItems, contingencyApplied, contingencyPerYear]);

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
          quotationReference: mainMatch.quotationReference || null,
          quotationFileUrl: mainMatch.quotationFileUrl || null,
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
            quotationReference: sm.quotationReference || null,
            quotationFileUrl: sm.quotationFileUrl || null,
            ...(sm.supplier ? { supplier: sm.supplier } : {}),
          };
        });
        patched = { ...patched, subItemCosts: updatedSubCosts };

        // Also apply to PCF costs
        const updatedPCFCosts = (patched.pcfCosts || []).map((pc) => {
          const sm = subMatches.find((i) => i.subItemCostId === pc.id);
          if (!sm) return pc;
          const scopeItem = getScopeItem(a.scopeItemId);
          const scopePcf = (scopeItem?.pcfItems || []).find(
            (p) => p.id === pc.subItemId,
          );
          const qty = scopePcf?.qty || 1;
          return {
            ...pc,
            unitCostUSD: sm.unitCostUSD,
            totalCostUSD: sm.unitCostUSD * qty,
            costReference: sm.costReference,
            dateReference: sm.dateReference || sm.costDate,
            leadTimeDays: sm.leadTimeDays,
            originalCost: sm.originalCost,
            originalCurrency: sm.originalCurrency,
            costDate: sm.costDate,
            quotationReference: sm.quotationReference || null,
            quotationFileUrl: sm.quotationFileUrl || null,
            ...(sm.supplier ? { supplier: sm.supplier } : {}),
          };
        });
        patched = { ...patched, pcfCosts: updatedPCFCosts };
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
        costReference: item.reference || "Quote",
        dateReference: item.quotationDate || "",
        leadTimeDays: item.leadTimeDays || 0,
        originalCost: item.cost,
        originalCurrency: item.currency || "USD",
        costDate: item.quotationDate || "",
        supplier: item.supplier || "",
        quotationReference: item.reference || "Quote",
        quotationFileUrl: item.fileUrl,
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

  /**
   * Rows for a list of services & fees. Cells always align to the columns of the card that
   * hosts them — the 7-track fees grid, or the 12-track splits grid when nested under a split.
   */
  const renderFeeRows = (
    fees: IAssetSubCost[],
    parentDailyRate: number,
    parentIsRental: boolean,
    variant: "fees" | "split",
    onUpdate: (
      subCostId: string,
      field: keyof IAssetSubCost,
      value: unknown,
    ) => void,
    onDelete: (subCostId: string) => void,
  ): React.ReactNode[] => {
    const inSplit = variant === "split";
    return fees.map((sc, idx) => {
      const isTransit = !!sc.isTransitRate;
      const impDays = sc.importDays || 0;
      const expDays = sc.exportDays || 0;
      const totalDays = impDays + expDays;
      const disc =
        sc.transitDiscount === undefined || sc.transitDiscount === null
          ? TRANSIT_DEFAULT_DISCOUNT
          : sc.transitDiscount;
      const amount = getSubCostAmount(sc, parentDailyRate);
      const numCls = `${styles.subCell} ${styles.subNum}`;
      return (
        <div
          key={sc.id}
          className={`${inSplit ? styles.splitRowGrid : styles.feeRow}${
            isTransit ? ` ${styles.feeRowAuto}` : ""
          }`}
        >
          <div className={numCls}>{isTransit ? "↳" : `💲${idx + 1}`}</div>
          <div
            className={`${styles.subCell} ${styles.feeDescCell}`}
            style={inSplit ? { gridColumn: "2 / 6" } : undefined}
          >
            {isTransit ? (
              readOnly ? (
                <span style={{ fontSize: 11 }}>
                  Transit Rate — Import {impDays}d · Export {expDays}d · Disc.{" "}
                  {disc}%
                </span>
              ) : (
                <div className={styles.transitInputs}>
                  <span className={styles.feeTag}>Transit Rate</span>
                  <label className={styles.transitField}>
                    Import
                    <input
                      className={styles.numInput}
                      type="number"
                      min={0}
                      value={impDays}
                      onChange={(e) =>
                        onUpdate(
                          sc.id,
                          "importDays",
                          Number(e.target.value) || 0,
                        )
                      }
                    />
                    d
                  </label>
                  <label className={styles.transitField}>
                    Export
                    <input
                      className={styles.numInput}
                      type="number"
                      min={0}
                      value={expDays}
                      onChange={(e) =>
                        onUpdate(
                          sc.id,
                          "exportDays",
                          Number(e.target.value) || 0,
                        )
                      }
                    />
                    d
                  </label>
                  <label className={styles.transitField}>
                    Disc.
                    <input
                      className={styles.numInput}
                      type="number"
                      min={0}
                      max={100}
                      value={disc}
                      onChange={(e) =>
                        onUpdate(
                          sc.id,
                          "transitDiscount",
                          Number(e.target.value) || 0,
                        )
                      }
                    />
                    %
                  </label>
                </div>
              )
            ) : readOnly ? (
              <span>{sc.description || "—"}</span>
            ) : (
              <input
                className={styles.editInput}
                placeholder="e.g. Pre-job, Post-job, Maintenance..."
                value={sc.description}
                onChange={(e) => onUpdate(sc.id, "description", e.target.value)}
              />
            )}
          </div>
          <div className={`${styles.subCell} ${styles.subCostTotal}`}>
            {isTransit || readOnly ? (
              <>
                $ {fmtCost(amount)}
                {isTransit && (
                  <div className={styles.subCellCalc}>
                    {fmtCost(parentDailyRate)} × (100−{disc})% × {totalDays}d
                  </div>
                )}
              </>
            ) : (
              <input
                className={styles.numInput}
                type="number"
                min={0}
                step={0.01}
                value={sc.costUSD}
                onChange={(e) =>
                  onUpdate(sc.id, "costUSD", Number(e.target.value) || 0)
                }
              />
            )}
          </div>
          <div className={styles.subCell}>
            {readOnly || isTransit ? (
              <span>{sc.costReference || "—"}</span>
            ) : (
              <input
                className={styles.editInput}
                placeholder="Cost Ref..."
                value={sc.costReference || ""}
                onChange={(e) =>
                  onUpdate(sc.id, "costReference", e.target.value)
                }
              />
            )}
          </div>
          {inSplit && <div className={styles.subCell} />}
          <div className={`${styles.subCell} ${styles.subCellCenter}`}>
            {isTransit ? (
              <span>{totalDays || "—"}</span>
            ) : readOnly ? (
              <span>{sc.leadTimeDays || "—"}</span>
            ) : (
              <input
                className={styles.numInput}
                type="number"
                min={0}
                value={sc.leadTimeDays || 0}
                onChange={(e) =>
                  onUpdate(sc.id, "leadTimeDays", Number(e.target.value) || 0)
                }
              />
            )}
          </div>
          {inSplit && <div className={styles.subCell} />}
          <div className={styles.subCell}>
            {readOnly ? (
              <span>{sc.notes || "—"}</span>
            ) : (
              <input
                className={styles.editInput}
                placeholder="Notes..."
                value={sc.notes}
                onChange={(e) => onUpdate(sc.id, "notes", e.target.value)}
              />
            )}
          </div>
          <div className={`${styles.subCell} ${styles.subCellCenter}`}>
            {/* Transit rates are owned by Rental — only leftovers from older data can be removed by hand */}
            {!readOnly && (!isTransit || !parentIsRental) && (
              <button
                className={styles.deleteSubCost}
                onClick={() => onDelete(sc.id)}
                title="Remove"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  /** Splits tab — one card whose columns mirror the main table's */
  const renderSplitsTab = (asset: IAssetBreakdownItem): React.ReactNode => {
    const splits = asset.availabilitySplits || [];
    const remaining = getSplitsRemainingQty(asset);
    const bd = breakdownOf(asset);
    return (
      <div className={styles.subTblWrap}>
        <div className={styles.splitTblHead}>
          <div className={styles.subTh}>#</div>
          <div className={styles.subTh}>Qty</div>
          <div className={styles.subTh}>Availability</div>
          <div className={styles.subTh}>Acq. Type</div>
          <div className={styles.subTh}>Unit Cost USD</div>
          <div className={styles.subTh}>Total Cost USD</div>
          <div className={styles.subTh}>Cost Ref / Supplier</div>
          <div className={styles.subTh}>Date Ref</div>
          <div className={styles.subTh}>Lead Time</div>
          <div className={styles.subTh}>CAPEX/OPEX</div>
          <div className={styles.subTh}>Notes</div>
          <div className={styles.subTh} />
        </div>
        <div className={styles.subRows}>
          {splits.map((split, splitIdx) => {
            const splitAvail = (split.availabilityStatus || "").toLowerCase();
            const splitAcq = (split.acquisitionType || "").toLowerCase();
            const isNoCostSplit =
              splitAvail === "onboard" ||
              splitAvail === "call out" ||
              splitAvail === "not offered";
            const isRentalSplit = splitAcq === "rental";
            const isWorkshopSplit = splitAcq === "workshop";
            const splitNode = getSplitNode(split, contingencyOpts);
            const acqOptions = (() => {
              const filtered = split.availabilityStatus
                ? acquisitionTypes.filter(
                    (at) =>
                      (at.category || "").split("|")[0] ===
                      split.availabilityStatus,
                  )
                : [];
              return filtered.length > 0 ? filtered : acquisitionTypes;
            })();
            return (
              <React.Fragment key={split.id}>
                <div className={styles.splitRowGrid}>
                  <div className={`${styles.subCell} ${styles.subCellCenter}`}>
                    <span className={styles.splitIndex}>{splitIdx + 1}</span>
                  </div>
                  <div className={`${styles.subCell} ${styles.subCellCenter}`}>
                    {readOnly ? (
                      <span style={{ fontWeight: 600 }}>×{split.qty}</span>
                    ) : (
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
                      />
                    )}
                  </div>
                  <div className={styles.subCell}>
                    {readOnly ? (
                      <span>{split.availabilityStatus || "—"}</span>
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
                  </div>
                  <div className={styles.subCell}>
                    {readOnly ? (
                      <span>{split.acquisitionType || "—"}</span>
                    ) : isNoCostSplit ? (
                      <span className={styles.cellMuted}>N/A</span>
                    ) : (
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
                        {acqOptions.map((at) => (
                          <option key={at.id} value={at.value}>
                            {at.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className={styles.subCell}>
                    {isNoCostSplit || isWorkshopSplit ? (
                      <span className={styles.cellMuted}>—</span>
                    ) : isRentalSplit ? (
                      readOnly ? (
                        <div className={styles.rateStack}>
                          <span>$ {fmtCost(split.dailyRate || 0)} /day</span>
                          <span className={styles.subCellCalc}>
                            {split.rentalDays || 0} days
                          </span>
                        </div>
                      ) : (
                        <div className={styles.rateStack}>
                          <label className={styles.rateField}>
                            Rate
                            <input
                              className={missingIf(
                                styles.numInput,
                                split.dailyRate,
                              )}
                              type="number"
                              min={0}
                              step={0.01}
                              value={split.dailyRate || 0}
                              onChange={(e) =>
                                handleUpdateSplit(
                                  asset.id,
                                  split.id,
                                  "dailyRate",
                                  Number(e.target.value) || 0,
                                )
                              }
                            />
                          </label>
                          <label className={styles.rateField}>
                            Days
                            <input
                              className={missingIf(
                                styles.numInput,
                                split.rentalDays,
                              )}
                              type="number"
                              min={0}
                              value={split.rentalDays || 0}
                              onChange={(e) =>
                                handleUpdateSplit(
                                  asset.id,
                                  split.id,
                                  "rentalDays",
                                  Number(e.target.value) || 0,
                                )
                              }
                            />
                          </label>
                        </div>
                      )
                    ) : readOnly ? (
                      <span>$ {fmtCost(split.unitCostUSD)}</span>
                    ) : (
                      <input
                        className={missingIf(
                          styles.numInput,
                          split.unitCostUSD,
                        )}
                        type="number"
                        min={0}
                        step={0.01}
                        value={Math.round(split.unitCostUSD * 100) / 100}
                        onChange={(e) =>
                          handleUpdateSplit(
                            asset.id,
                            split.id,
                            "unitCostUSD",
                            Number(e.target.value) || 0,
                          )
                        }
                      />
                    )}
                  </div>
                  <div className={`${styles.subCell} ${styles.subCellBold}`}>
                    {isWorkshopSplit && splitNode.total === 0 ? (
                      <span className={styles.cellMuted}>—</span>
                    ) : (
                      <>
                        $ {fmtCost(splitNode.total)}
                        {splitNode.fees > 0 && (
                          <div className={styles.subCellCalc}>
                            incl. $ {fmtCost(splitNode.fees)} fees
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className={styles.subCell}>
                    {isNoCostSplit || isWorkshopSplit ? (
                      <span className={styles.cellMuted}>—</span>
                    ) : readOnly ? (
                      <span>
                        {[split.costReference, split.supplier]
                          .filter(Boolean)
                          .join(" | ") || "—"}
                      </span>
                    ) : (
                      <input
                        className={styles.editInput}
                        value={[split.costReference, split.supplier]
                          .filter(Boolean)
                          .join(" | ")}
                        placeholder="Ref / Supplier..."
                        onChange={(e) => {
                          const parts = e.target.value
                            .split("|")
                            .map((p) => p.trim());
                          persist(
                            localAssets.map((a) =>
                              a.id !== asset.id
                                ? a
                                : {
                                    ...a,
                                    availabilitySplits: (
                                      a.availabilitySplits || []
                                    ).map((sp) =>
                                      sp.id === split.id
                                        ? {
                                            ...sp,
                                            costReference: parts[0] || "",
                                            supplier: parts[1] || "",
                                          }
                                        : sp,
                                    ),
                                  },
                            ),
                          );
                        }}
                      />
                    )}
                  </div>
                  <div className={`${styles.subCell} ${styles.splitCellDate}`}>
                    {isNoCostSplit || isWorkshopSplit ? (
                      <span className={styles.cellMuted}>—</span>
                    ) : readOnly ? (
                      <span>
                        {split.dateReference
                          ? formatDateRef(split.dateReference)
                          : "—"}
                      </span>
                    ) : (
                      <div className={styles.dateCellInner}>
                        {split.dateReference && (
                          <span className={styles.dateCellText}>
                            {formatDateRef(split.dateReference)}
                          </span>
                        )}
                        <span
                          className={styles.datePickBtn}
                          title="Set date"
                          onClick={(ev) => {
                            const inp = (
                              ev.currentTarget as HTMLElement
                            ).querySelector("input") as HTMLInputElement | null;
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
                            value={(split.dateReference || "").slice(0, 10)}
                            onChange={(e) =>
                              handleUpdateSplit(
                                asset.id,
                                split.id,
                                "dateReference",
                                e.target.value,
                              )
                            }
                          />
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`${styles.subCell} ${styles.subCellCenter}`}>
                    {isNoCostSplit || isWorkshopSplit ? (
                      <span className={styles.cellMuted}>—</span>
                    ) : readOnly ? (
                      <span>{split.leadTimeDays || "—"}</span>
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
                      />
                    )}
                  </div>
                  <div className={`${styles.subCell} ${styles.subCellCenter}`}>
                    <span
                      className={
                        split.costCategory === "CAPEX"
                          ? styles.catCapex
                          : split.costCategory === "OPEX"
                            ? styles.catOpex
                            : styles.cellMuted
                      }
                    >
                      {split.costCategory || "—"}
                    </span>
                  </div>
                  <div className={styles.subCell}>
                    {readOnly ? (
                      <span>{split.notes || "—"}</span>
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
                      />
                    )}
                  </div>
                  <div className={`${styles.subCell} ${styles.subCellCenter}`}>
                    {!readOnly && (
                      <button
                        className={styles.deleteSubCost}
                        onClick={() => handleRemoveSplit(asset.id, split.id)}
                        title="Remove split"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                {renderFeeRows(
                  split.subCosts || [],
                  split.dailyRate || 0,
                  isRentalAcq(split.acquisitionType),
                  "split",
                  (subCostId, field, value) =>
                    updateSplitSubCost(
                      asset.id,
                      split.id,
                      subCostId,
                      field,
                      value,
                    ),
                  (subCostId) =>
                    deleteSplitSubCost(asset.id, split.id, subCostId),
                )}
                {!readOnly && (
                  <div className={styles.splitRowGrid}>
                    <div className={styles.subCell} />
                    <div
                      className={styles.subCell}
                      style={{ gridColumn: "2 / 13" }}
                    >
                      <button
                        className={styles.addSubCostBtn}
                        onClick={() => addSplitSubCost(asset.id, split.id)}
                      >
                        + Add Service / Fee to this split
                      </button>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className={styles.subFooter}>
          <span className={styles.splitQtyBadge}>
            {remaining === 0 ? (
              <span className={styles.splitQtyOk}>✓ Qty balanced</span>
            ) : remaining > 0 ? (
              <span className={styles.splitQtyWarn}>
                {remaining} unassigned
              </span>
            ) : (
              <span className={styles.splitQtyError}>
                {Math.abs(remaining)} over-assigned
              </span>
            )}
          </span>
          <span className={styles.subFooterLabel}>Splits subtotal:</span>
          <span className={styles.subFooterValue}>
            $ {fmtCost(bd.splitsTotal)}
          </span>
        </div>
      </div>
    );
  };

  /** Services & Fees tab — pre-job, post-job, maintenance and transit costs */
  const renderFeesTab = (asset: IAssetBreakdownItem): React.ReactNode => {
    const fees = asset.subCosts || [];
    const hasSplits = (asset.availabilitySplits || []).length > 0;
    const bd = breakdownOf(asset);
    if (hasSplits) {
      return (
        <div className={styles.feeNotice}>
          <p>
            This item uses <strong>Availability Splits</strong>, so its services
            &amp; fees belong to a specific split.
          </p>
          {fees.length > 0 && (
            <p className={styles.feeNoticeWarn}>
              ⚠ {fees.length} entr{fees.length > 1 ? "ies" : "y"} worth ${" "}
              {fmtCost(bd.orphanFees)} are stored here and are{" "}
              <strong>not counted</strong> in any total.
            </p>
          )}
          <div className={styles.feeNoticeActions}>
            <button
              className={styles.addSubCostBtn}
              onClick={() => openDrawer(asset.id, "splits")}
            >
              Go to Splits
            </button>
            {!readOnly && fees.length > 0 && (
              <button
                className={styles.addSubCostBtn}
                onClick={() => moveFeesToFirstSplit(asset.id)}
              >
                Move to Split 1
              </button>
            )}
          </div>
        </div>
      );
    }
    if (fees.length === 0) {
      return (
        <div className={styles.feeNotice}>
          <p>No services or fees yet.</p>
          {!readOnly && (
            <div className={styles.feeNoticeActions}>
              <button
                className={styles.addSubCostBtn}
                onClick={() => addSubCost(asset.id)}
              >
                + Add Service / Fee
              </button>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className={styles.subTblWrap}>
        <div className={styles.feeTblHead}>
          <div className={styles.subTh}>#</div>
          <div className={styles.subTh}>Description</div>
          <div className={styles.subTh}>Total Cost USD</div>
          <div className={styles.subTh}>Cost Ref / Supplier</div>
          <div className={styles.subTh}>Lead Time</div>
          <div className={styles.subTh}>Notes</div>
          <div className={styles.subTh} />
        </div>
        <div className={styles.subRows}>
          {renderFeeRows(
            fees,
            asset.dailyRate || 0,
            isRentalAcq(asset.acquisitionType),
            "fees",
            (subCostId, field, value) =>
              updateSubCost(asset.id, subCostId, field, value),
            (subCostId) => deleteSubCost(asset.id, subCostId),
          )}
        </div>
        <div className={styles.subFooter}>
          <span className={styles.subFooterLabel}>
            Services &amp; fees subtotal:
          </span>
          <span className={styles.subFooterValue}>
            $ {fmtCost(bd.main.fees)}
          </span>
        </div>
      </div>
    );
  };

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
        <div className={`${styles.summaryCard} ${styles.summaryCardSecondary}`}>
          <span className={styles.summaryLabel}>CAPEX</span>
          <span className={styles.summaryValue}>$ {fmtCost(totals.capex)}</span>
        </div>
        <div className={`${styles.summaryCard} ${styles.summaryCardSecondary}`}>
          <span className={styles.summaryLabel}>OPEX</span>
          <span className={styles.summaryValue}>$ {fmtCost(totals.opex)}</span>
        </div>
      </div>
      <div className={styles.summaryRow}>
        <div className={`${styles.summaryCard} ${styles.summaryCardTertiary}`}>
          <span className={styles.summaryLabel}>Sub-Costs</span>
          <span className={styles.summaryValue}>
            $ {fmtCost(totals.subCostsTotal)}
          </span>
        </div>
        <div className={`${styles.summaryCard} ${styles.summaryCardTertiary}`}>
          <span className={styles.summaryLabel}>Sub-Items</span>
          <span className={styles.summaryValue}>
            $ {fmtCost(totals.subItemCostsTotal)}
          </span>
        </div>
        <div className={`${styles.summaryCard} ${styles.summaryCardTertiary}`}>
          <span className={styles.summaryLabel}>PCF</span>
          <span className={styles.summaryValue}>
            $ {fmtCost(totals.pcfCostsTotal)}
          </span>
        </div>
        <div className={`${styles.summaryCard} ${styles.summaryCardTertiary}`}>
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
              {allCostsFilled ? (
                <Check size={16} />
              ) : (
                <TriangleAlert size={16} />
              )}
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
              {costCompleteness.pcfItemsMissing > 0 && (
                <span className={styles.costBannerSub}>
                  {" "}
                  · {costCompleteness.pcfItemsMissing} PCF item
                  {costCompleteness.pcfItemsMissing !== 1 ? "s" : ""}
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
                            {item.type === "main"
                              ? "Main"
                              : item.type === "pcf"
                                ? "PCF"
                                : "Sub-item"}
                          </span>
                        </td>
                        <td>
                          {(item.type === "sub" || item.type === "pcf") && (
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
            <Search size={14} style={{ verticalAlign: "-2px" }} /> Search Costs
          </button>
        )}
      </div>

      {/* Contingency Bar */}
      <div className={styles.contingencyBar}>
        <span className={styles.contingencyLabel}>Contingency per year:</span>
        {!readOnly && isContingencyEditing ? (
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
              onClick={() => setIsContingencyEditing(false)}
            >
              OK
            </button>
          </>
        ) : (
          <>
            <span className={styles.contingencyValue}>
              {contingencyPerYear}% / year
            </span>
            {contingencyApplied && (
              <span className={styles.contingencyActiveBadge}>Active</span>
            )}
            {!readOnly && (
              <button
                className={styles.contingencyEditBtn}
                onClick={() => setIsContingencyEditing(true)}
              >
                ✏️ Edit
              </button>
            )}
          </>
        )}

        {/* Date ref legend */}
        <span className={styles.dateLegend}>
          <span className={`${styles.dateBadge} ${styles.dateRecent}`}>
            &lt;1y (no adj.)
          </span>
          <span className={`${styles.dateBadge} ${styles.dateWarn}`}>1-2y</span>
          <span className={`${styles.dateBadge} ${styles.dateOld}`}>
            &gt;2y
          </span>
        </span>
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
                    const bd = breakdownOf(a);
                    secCapex += bd.capex;
                    secOpex += bd.opex;
                    secOther += bd.uncategorized;
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
                const siSubItems = (si?.subItems || []) as IScopeSubItem[];
                const siHasSubItems = siSubItems.length > 0;
                const assetSplits = asset.availabilitySplits || [];
                const isSubItemsClosing = closingSubItems.has(asset.id);
                const isDrawerOpen = !collapsedSubItems.has(asset.id);
                const activeTab: DrawerTab =
                  drawerTab[asset.id] || defaultDrawerTab(asset);
                // The drawer is worth opening if any of its three tabs has something to offer
                const hasDrawerContent =
                  siHasSubItems ||
                  assetSplits.length > 0 ||
                  hasSubCosts ||
                  !readOnly;
                const isSubItemsExpanded = hasDrawerContent && isDrawerOpen;
                const isSectionClosing = si?.sectionId
                  ? closingSectionIds.has(si.sectionId)
                  : false;
                const siPCFItems = (si?.pcfItems || []) as IScopeSubItem[];
                const siHasPCF = siPCFItems.length > 0;
                const assetBd = breakdownOf(asset);
                const subCostsSum = assetBd.main.fees + assetBd.orphanFees;
                // Rollup only makes sense while the main item has no own cost yet
                const rollupLocked =
                  !asset.costFromSubItems &&
                  (assetSplits.length > 0
                    ? assetBd.splits.some((n) => n.base > 0)
                    : assetBd.main.base > 0);

                return (
                  <React.Fragment key={asset.id}>
                    <tr
                      id={`asset-row-${asset.id}`}
                      className={`${styles.mainItemRow}${isSubItemsExpanded ? ` ${styles.drawerOpenRow}` : ""}${(asset.availabilityStatus || "").toLowerCase() === "not offered" ? ` ${styles.notOfferedRow}` : ""}${isSectionClosing ? ` ${styles.rowClosing}` : ""}`}
                    >
                      {/* Expand/collapse detail drawer arrow */}
                      <td
                        className={styles.cellCenter}
                        style={{ width: 28, padding: "0 2px" }}
                      >
                        {hasDrawerContent && (
                          <div
                            className={`${styles.cellExpand}${isSubItemsExpanded ? ` ${styles.cellExpandOpen}` : ""}`}
                            onClick={() => toggleSubItems(asset.id)}
                            title={
                              isSubItemsExpanded
                                ? "Collapse details"
                                : "Splits, sub-items, services & fees"
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
                            alignItems: "flex-start",
                          }}
                        >
                          {/* Fixed-width slot keeps icons (and thus text start) aligned across rows */}
                          <span className={styles.specsIconSlot}>
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
                            {si && (si.attachments || []).length > 0 && (
                              <span
                                className={styles.specsIndicator}
                                onMouseEnter={handleSpecsHover}
                              >
                                <span className={styles.specsIndicatorIcon}>
                                  📎
                                </span>
                                <div className={styles.specsTooltip}>
                                  <div className={styles.specsTooltipTitle}>
                                    Attachments ({si.attachments!.length})
                                  </div>
                                  <ul className={styles.specsTooltipList}>
                                    {si.attachments!.map((att) => (
                                      <li key={att.id}>
                                        <a
                                          href={att.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {att.fileName}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </span>
                            )}
                          </span>
                          <span className={styles.subCellText}>
                            {si?.equipmentOffer || "—"}
                          </span>
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
                            const isSplitExpanded =
                              isDrawerOpen && activeTab === "splits";
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
                                  onClick={() =>
                                    toggleDrawerTab(asset.id, "splits")
                                  }
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
                        // Rolled-up item: cost is derived from its sub-items (read-only)
                        if (asset.costFromSubItems) {
                          const rollup = getSubItemCostsTotal(asset);
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
                                  Σ sub-items
                                </span>
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
                                  <span>$ {fmtCost(rollup)}</span>
                                  <span
                                    style={{
                                      fontSize: 10,
                                      color: "var(--text-muted)",
                                      fontWeight: 400,
                                    }}
                                  >
                                    from sub-items
                                  </span>
                                </div>
                              </td>
                            </>
                          );
                        }

                        // PCF-driven item: cost is derived from Preliminary Concept Form
                        if (asset.costFromPCF) {
                          const rollup = getPCFTotal(asset);
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
                                  Σ PCF
                                </span>
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
                                  <span>$ {fmtCost(rollup)}</span>
                                  <span
                                    style={{
                                      fontSize: 10,
                                      color: "var(--text-muted)",
                                      fontWeight: 400,
                                    }}
                                  >
                                    from PCF
                                  </span>
                                </div>
                              </td>
                            </>
                          );
                        }

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
                                    : "—"}
                                </span>
                              </td>
                            </>
                          );
                        }

                        if (isRental) {
                          const days = asset.rentalDays || 0;
                          const rate = asset.dailyRate || 0;
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
                                        className={missingIf(
                                          styles.numInput,
                                          rate,
                                        )}
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
                                        className={missingIf(
                                          styles.numInput,
                                          days,
                                        )}
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
                                  <span>$ {fmtCost(assetBd.main.total)}</span>
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
                        const contingencyPct = contingencyApplied
                          ? calcContingencyPct(
                              asset.dateReference,
                              contingencyPerYear,
                            )
                          : 0;
                        const adjustedUnitCost =
                          contingencyPct > 0
                            ? applyContingency(
                                asset.unitCostUSD,
                                asset.dateReference,
                                contingencyPerYear,
                              )
                            : asset.unitCostUSD;
                        return (
                          <>
                            <td>
                              {readOnly ? (
                                `$ ${fmtCost(adjustedUnitCost)}`
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                  }}
                                >
                                  <input
                                    className={missingIf(
                                      styles.numInput,
                                      asset.unitCostUSD,
                                    )}
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    value={
                                      Math.round(asset.unitCostUSD * 100) / 100
                                    }
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
                                  {contingencyPct > 0 && (
                                    <span className={styles.contingencyBadge}>
                                      +{contingencyPct}% → ${" "}
                                      {fmtCost(adjustedUnitCost)}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className={styles.mainTotalCost}>
                              $ {fmtCost(assetBd.main.total)}
                            </td>
                          </>
                        );
                      })()}
                      {/* Cost Ref / Supplier */}
                      <td>
                        {(() => {
                          if (asset.costFromSubItems || asset.costFromPCF) {
                            return (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "var(--text-muted)",
                                  fontStyle: "italic",
                                }}
                              >
                                {asset.costFromPCF
                                  ? "from PCF"
                                  : "from sub-items"}
                              </span>
                            );
                          }
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
                          if (asset.costFromSubItems) {
                            return (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "var(--text-muted)",
                                  fontStyle: "italic",
                                }}
                              >
                                —
                              </span>
                            );
                          }
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
                          if (asset.costFromSubItems) {
                            return (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "var(--text-muted)",
                                  fontStyle: "italic",
                                }}
                              >
                                —
                              </span>
                            );
                          }
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
                        <div className={styles.notesCell}>
                          <div className={styles.notesRow}>
                            {(!readOnly || !!asset.notes) && (
                              <button
                                className={noteBtnClass(asset.id, asset.notes)}
                                onClick={() => toggleNotesExpand(asset.id)}
                                title={
                                  asset.notes ? "View/edit notes" : "Add notes"
                                }
                              >
                                💬
                              </button>
                            )}
                            {!readOnly && (
                              <button
                                className={`${styles.subCostToggle} ${hasSubCosts ? styles.hasSubCosts : ""}`}
                                onClick={() =>
                                  toggleDrawerTab(asset.id, "fees")
                                }
                                title={
                                  isDrawerOpen && activeTab === "fees"
                                    ? "Hide services & fees"
                                    : "Show/add services & fees"
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
                            <button
                              className={styles.subCostToggle}
                              onClick={(e) => {
                                const r =
                                  e.currentTarget.getBoundingClientRect();
                                setBreakdownAnchor(
                                  breakdownAnchor &&
                                    breakdownAnchor.assetId === asset.id
                                    ? null
                                    : {
                                        assetId: asset.id,
                                        x: r.left,
                                        y: r.bottom + 4,
                                        anchorTop: r.top,
                                      },
                                );
                              }}
                              title="Cost breakdown — where this item's total comes from"
                            >
                              Σ
                            </button>
                            {!readOnly && hasPricing(asset) && (
                              <button
                                className={`${styles.subCostToggle} ${styles.clearPriceBtn}`}
                                onClick={() =>
                                  setPendingPriceClear({
                                    assetId: asset.id,
                                    kind: "sub",
                                  })
                                }
                                title="Clear pricing & quotation"
                              >
                                🧹
                              </button>
                            )}
                            {readOnly && hasSubCosts && (
                              <button
                                className={`${styles.subCostToggle} ${styles.hasSubCosts}`}
                                onClick={() =>
                                  toggleDrawerTab(asset.id, "fees")
                                }
                                title="View services & fees"
                              >
                                💲{(asset.subCosts || []).length}
                              </button>
                            )}
                          </div>
                          {asset.quotationReference && (
                            <a
                              className={styles.quoteLink}
                              href={getQuoteLinkHref(asset.quotationFileUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={
                                asset.quotationFileUrl
                                  ? `Open quotation: ${asset.quotationReference}`
                                  : `From quotation "${asset.quotationReference}" — open Quotations to view`
                              }
                            >
                              🔗 {asset.quotationReference}
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                    {/* Inline notes panel */}
                    {expandedNotesIds.has(asset.id) && (
                      <tr className={styles.noteRow}>
                        <td colSpan={COLS} className={styles.noteCell}>
                          <span className={styles.noteLabel}>💬 Notes</span>
                          {readOnly ? (
                            <span className={styles.noteText}>
                              {asset.notes || "—"}
                            </span>
                          ) : (
                            <textarea
                              className={styles.noteInput}
                              value={asset.notes || ""}
                              placeholder="Add notes for this item..."
                              rows={2}
                              autoFocus
                              onChange={(e) =>
                                updateField(asset.id, "notes", e.target.value)
                              }
                            />
                          )}
                        </td>
                      </tr>
                    )}
                    {/* Detail drawer — Splits / Sub-Items / Services & Fees */}
                    {(isSubItemsExpanded || isSubItemsClosing) &&
                      hasDrawerContent && (
                        <tr className={styles.drawerRow}>
                          <td colSpan={COLS}>
                            <div
                              className={`${styles.drawerInner}${isSubItemsClosing ? ` ${styles.drawerClosing}` : ""}`}
                            >
                              <div className={styles.drawerTabs}>
                                {assetSplits.length > 0 && (
                                  <button
                                    className={`${styles.drawerTab}${activeTab === "splits" ? ` ${styles.drawerTabActive}` : ""}`}
                                    onClick={() =>
                                      openDrawer(asset.id, "splits")
                                    }
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
                                    Splits
                                    <span className={styles.drawerTabCount}>
                                      {assetSplits.length}
                                    </span>
                                  </button>
                                )}
                                {(siHasSubItems || !readOnly) && (
                                  <button
                                    className={`${styles.drawerTab}${activeTab === "items" ? ` ${styles.drawerTabActive}` : ""}`}
                                    onClick={() =>
                                      openDrawer(asset.id, "items")
                                    }
                                  >
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
                                    Sub-Items
                                    <span className={styles.drawerTabCount}>
                                      {siSubItems.length}
                                    </span>
                                  </button>
                                )}
                                {(hasSubCosts || !readOnly) && (
                                  <button
                                    className={`${styles.drawerTab}${activeTab === "fees" ? ` ${styles.drawerTabActive}` : ""}`}
                                    onClick={() => openDrawer(asset.id, "fees")}
                                  >
                                    💲 Services &amp; Fees
                                    <span className={styles.drawerTabCount}>
                                      {(asset.subCosts || []).length}
                                    </span>
                                  </button>
                                )}
                                <span className={styles.drawerHint}>
                                  {activeTab === "splits"
                                    ? `Partial quantities with different status or cost — total qty ${qty}`
                                    : activeTab === "items"
                                      ? "Consumables, spare parts & accessories"
                                      : "Pre-job, post-job, maintenance & transit"}
                                </span>
                                {activeTab === "splits" && !readOnly && (
                                  <button
                                    className={styles.addSubCostBtn}
                                    onClick={() => handleAddSplit(asset.id)}
                                  >
                                    + Add Split
                                  </button>
                                )}
                                {activeTab === "items" && !readOnly && (
                                  <>
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
                                      <option value="">
                                        Set All Acq. Type
                                      </option>
                                      {acquisitionTypes.map((at) => (
                                        <option key={at.id} value={at.value}>
                                          {at.label}
                                        </option>
                                      ))}
                                    </select>
                                    <label
                                      className={`${styles.rollupToggle}${rollupLocked ? ` ${styles.rollupToggleDisabled}` : ""}`}
                                      title={
                                        rollupLocked
                                          ? "Unavailable — the main item already has its own cost. Clear it first to roll up the sub-items."
                                          : "When enabled, the main item has no own cost — its cost is the sum (rollup) of these sub-items. Use this for Eng. Solutions / developed items."
                                      }
                                    >
                                      <input
                                        type="checkbox"
                                        checked={!!asset.costFromSubItems}
                                        disabled={rollupLocked}
                                        onChange={(e) =>
                                          updateField(
                                            asset.id,
                                            "costFromSubItems",
                                            e.target.checked,
                                          )
                                        }
                                      />
                                      Σ Main cost = sum of sub-items
                                    </label>
                                  </>
                                )}
                                {activeTab === "fees" &&
                                  !readOnly &&
                                  assetSplits.length === 0 &&
                                  (asset.subCosts || []).length > 0 && (
                                    <button
                                      className={styles.addSubCostBtn}
                                      onClick={() => addSubCost(asset.id)}
                                    >
                                      + Add Service / Fee
                                    </button>
                                  )}
                              </div>
                              {activeTab === "splits" && renderSplitsTab(asset)}
                              {activeTab === "fees" && renderFeesTab(asset)}
                              {activeTab === "items" &&
                                (siHasSubItems ? (
                                  <div className={styles.subTblWrap}>
                                    <div className={styles.subTblHead}>
                                      <div className={styles.subTh}>#</div>
                                      <div className={styles.subTh}>
                                        Equipment Offer
                                      </div>
                                      <div className={styles.subTh}>
                                        OII / MFG PN
                                      </div>
                                      <div className={styles.subTh}>
                                        Sub-Type
                                      </div>
                                      <div className={styles.subTh}>Qty</div>
                                      <div className={styles.subTh}>
                                        Availability
                                      </div>
                                      <div className={styles.subTh}>
                                        Acq. Type
                                      </div>
                                      <div className={styles.subTh}>
                                        Unit Cost
                                      </div>
                                      <div className={styles.subTh}>
                                        Total Cost
                                      </div>
                                      <div className={styles.subTh}>
                                        Cost Ref / Supplier
                                      </div>
                                      <div className={styles.subTh}>
                                        Date Ref
                                      </div>
                                      <div className={styles.subTh}>
                                        Lead Time
                                      </div>
                                      <div className={styles.subTh}>
                                        CAPEX/OPEX
                                      </div>
                                      <div className={styles.subTh}>Notes</div>
                                    </div>
                                    <div className={styles.subRows}>
                                      {(asset.subItemCosts || []).map(
                                        (sic, idx) =>
                                          renderCostRow(asset, sic, idx, "sub"),
                                      )}
                                    </div>
                                    {assetBd.subItemsTotal > 0 && (
                                      <div className={styles.subFooter}>
                                        <span className={styles.subFooterLabel}>
                                          Sub-items subtotal:
                                        </span>
                                        <span className={styles.subFooterValue}>
                                          $ {fmtCost(assetBd.subItemsTotal)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className={styles.feeNotice}>
                                    <p>
                                      No sub-items. Add them in the Scope of
                                      Supply tab.
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    {/* PCF drawer (Preliminary Concept Form — for Eng. Solutions / Development) */}
                    {siHasPCF && (
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
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                              </svg>
                              <span className={styles.drawerTitle}>
                                Preliminary Concept Form ({siPCFItems.length})
                              </span>
                              <span className={styles.drawerHint}>
                                Eng. Solutions / Development BOM concept
                              </span>
                              <label
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  marginLeft: "auto",
                                  fontSize: 11,
                                  fontWeight: 500,
                                  color: "var(--text-secondary)",
                                  cursor: readOnly ? "default" : "pointer",
                                  whiteSpace: "nowrap",
                                }}
                                title="When enabled, the main item cost is the sum of these PCF items."
                              >
                                <input
                                  type="checkbox"
                                  checked={!!asset.costFromPCF}
                                  disabled={readOnly}
                                  onChange={(e) =>
                                    updateField(
                                      asset.id,
                                      "costFromPCF",
                                      e.target.checked,
                                    )
                                  }
                                />
                                Σ Main cost = sum of PCF
                              </label>
                            </div>
                            <div className={styles.subTblWrap}>
                              <div className={styles.subTblHead}>
                                <div className={styles.subTh}>#</div>
                                <div className={styles.subTh}>
                                  Equipment Offer
                                </div>
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
                                {(asset.pcfCosts || []).map((pc, idx) =>
                                  renderCostRow(asset, pc, idx, "pcf"),
                                )}
                              </div>
                              {/* PCF subtotal */}
                              {getPCFTotal(asset) > 0 && (
                                <div className={styles.subFooter}>
                                  <span className={styles.subFooterLabel}>
                                    PCF subtotal:
                                  </span>
                                  <span className={styles.subFooterValue}>
                                    $ {getPCFTotal(asset).toLocaleString()}
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

      <ConfirmDialog
        isOpen={!!pendingTransitDrop}
        title="Remove Transit Rate?"
        message={
          pendingTransitDrop && pendingTransitDrop.count > 1
            ? `${pendingTransitDrop.count} Transit Rate entries already have values (import/export days, discount or notes). Moving these items out of Rental will delete them.`
            : "This Transit Rate already has values (import/export days, discount or notes). Moving the item out of Rental will delete it."
        }
        confirmLabel="Change & delete"
        cancelLabel="Keep Rental"
        variant="warning"
        onConfirm={() => {
          if (pendingTransitDrop) pendingTransitDrop.apply();
          setPendingTransitDrop(null);
        }}
        onCancel={() => setPendingTransitDrop(null)}
      />

      <ConfirmDialog
        isOpen={!!pendingPriceClear}
        title="Clear pricing?"
        message="This will clear the unit cost, cost ref / supplier, date ref, lead time and quotation link of this item."
        confirmLabel="Clear"
        variant="danger"
        onConfirm={() => {
          if (pendingPriceClear) {
            clearPricing(
              pendingPriceClear.assetId,
              pendingPriceClear.costId,
              pendingPriceClear.kind,
            );
          }
          setPendingPriceClear(null);
        }}
        onCancel={() => setPendingPriceClear(null)}
      />

      {/* Cost breakdown popover — fixed-position because .tableWrapper clips absolutes */}
      {breakdownAnchor &&
        (() => {
          const a = localAssets.find((x) => x.id === breakdownAnchor.assetId);
          if (!a) return null;
          const bd = breakdownOf(a);
          const layers: { label: string; value: number }[] = [];
          if (bd.splits.length > 0) {
            layers.push({ label: "Splits", value: bd.splitsTotal });
          } else if (a.costFromSubItems) {
            layers.push({ label: "Own cost (rolled up)", value: 0 });
          } else {
            layers.push({ label: "Own cost", value: bd.main.base });
          }
          if (bd.main.fees > 0) {
            layers.push({ label: "Services & fees", value: bd.main.fees });
          }
          if (bd.subItems.length > 0) {
            layers.push({ label: "Sub-items", value: bd.subItemsTotal });
          }
          if (a.costFromPCF && bd.pcf.length > 0) {
            layers.push({ label: "PCF items", value: bd.pcfTotal });
          }
          return (
            <>
              <div
                className={styles.breakdownBackdrop}
                onClick={() => setBreakdownAnchor(null)}
              />
              <div
                ref={breakdownPopoverRef}
                className={styles.breakdownPopover}
                style={{ left: breakdownAnchor.x, top: breakdownAnchor.y }}
              >
                <div className={styles.breakdownTitle}>Cost breakdown</div>
                {layers.map((l) => (
                  <div key={l.label} className={styles.breakdownRow}>
                    <span>{l.label}</span>
                    <span>$ {fmtCost(l.value)}</span>
                  </div>
                ))}
                <div className={styles.breakdownTotal}>
                  <span>Total</span>
                  <span>$ {fmtCost(bd.total)}</span>
                </div>
                <div className={styles.breakdownRow}>
                  <span>CAPEX / OPEX</span>
                  <span>
                    $ {fmtCost(bd.capex)} / $ {fmtCost(bd.opex)}
                  </span>
                </div>
                {bd.uncategorized > 0 && (
                  <div className={styles.breakdownRow}>
                    <span>Uncategorized</span>
                    <span>$ {fmtCost(bd.uncategorized)}</span>
                  </div>
                )}
                {bd.orphanFees > 0 && (
                  <div className={styles.breakdownWarn}>
                    ⚠ $ {fmtCost(bd.orphanFees)} of services &amp; fees sit at
                    item level while splits are active — not counted.
                  </div>
                )}
              </div>
            </>
          );
        })()}

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
