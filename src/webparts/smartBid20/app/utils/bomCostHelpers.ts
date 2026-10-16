/**
 * bomCostHelpers - Pure tree/cost rules of the BOM Costs page, shared by the page,
 * the list cards and the Excel export so every counter agrees.
 */
import { IBomCostItem } from "../models/IBomCostAnalysis";

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
export function formatDateDMY(dateRef: string): string {
  if (!dateRef) return "";
  const d = new Date(dateRef);
  if (isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}/${MONTH_NAMES[d.getMonth()]}/${d.getFullYear()}`;
}

export function hasChildren(
  item: IBomCostItem,
  items: IBomCostItem[],
): boolean {
  return items.some((c) => c.parentId === item.id);
}

export function getDirectChildren(
  parentId: string,
  items: IBomCostItem[],
): IBomCostItem[] {
  return items.filter((c) => c.parentId === parentId);
}

/** Reassign sequential findNumbers within each parent group. */
export function reassignFindNumbers(items: IBomCostItem[]): IBomCostItem[] {
  const counters = new Map<string, number>();
  return items.map((item) => {
    const key = item.parentId || "__root__";
    const seq = (counters.get(key) || 0) + 1;
    counters.set(key, seq);
    return { ...item, findNumber: String(seq) };
  });
}

export function getVisibleItems(
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

/** Contingency % based on years since the date reference */
export function calcContingency(
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

export function recalcTotal(item: IBomCostItem): number {
  return item.qty * item.costPerItemUSD * (1 + item.contingencyPercent / 100);
}

/** True when the item carries its own price (not a sum of its children). */
export function hasOwnCost(item: IBomCostItem): boolean {
  return item.costPerItemUSD > 0 && !item.isRolledUp;
}

/**
 * A rolled-up parent is "partial" when any direct child has no cost, or is a
 * rolled-up child that is itself partial.
 */
export function isRolledUpPartial(
  parentId: string,
  items: IBomCostItem[],
): boolean {
  const children = getDirectChildren(parentId, items);
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (c.costPerItemUSD <= 0 && !c.isRolledUp) return true;
    if (c.isRolledUp && isRolledUpPartial(c.id, items)) return true;
  }
  return false;
}

/**
 * Roll up costs from children to parents that have no direct cost (bottom-up),
 * propagating the max lead time. A parent that already has its own cost is kept.
 */
export function rollUpParentCosts(items: IBomCostItem[]): IBomCostItem[] {
  const updated = items.map((i) => ({ ...i }));

  let maxLevel = 0;
  updated.forEach((i) => {
    if (i.level > maxLevel) maxLevel = i.level;
  });

  for (let lvl = maxLevel - 1; lvl >= 1; lvl--) {
    updated.forEach((item) => {
      if (item.level !== lvl) return;
      const children = getDirectChildren(item.id, updated);
      if (children.length === 0) return;

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
        const maxChildLT = Math.max(0, ...children.map((c) => c.leadTimeDays));
        if (maxChildLT > item.leadTimeDays) {
          item.leadTimeDays = maxChildLT;
        }
      }
    });
  }
  return updated;
}

/** Ids of every descendant of the given item. */
export function getDescendantIds(
  parentId: string,
  items: IBomCostItem[],
): string[] {
  const out: string[] = [];
  const walk = (pid: string): void => {
    items.forEach((c) => {
      if (c.parentId === pid) {
        out.push(c.id);
        walk(c.id);
      }
    });
  };
  walk(parentId);
  return out;
}

/** Ids from the root down to (excluding) the item, used to expand a collapsed path. */
export function getAncestorIds(id: string, items: IBomCostItem[]): string[] {
  const byId = new Map<string, IBomCostItem>();
  items.forEach((i) => byId.set(i.id, i));
  const out: string[] = [];
  let cur = byId.get(id);
  while (cur && cur.parentId) {
    out.unshift(cur.parentId);
    cur = byId.get(cur.parentId);
  }
  return out;
}

/** Items whose cost is already included in an ancestor that has its own cost. */
export function getCoveredIds(items: IBomCostItem[]): Set<string> {
  const covered = new Set<string>();
  items.forEach((item) => {
    if (hasOwnCost(item) && hasChildren(item, items)) {
      getDescendantIds(item.id, items).forEach((id) => covered.add(id));
    }
  });
  return covered;
}

/** Total without double counting: covered items and rolled-up parents are skipped. */
export function computeSmartTotal(items: IBomCostItem[]): number {
  const skip = getCoveredIds(items);
  items.forEach((item) => {
    if (item.isRolledUp) skip.add(item.id);
  });
  let total = 0;
  items.forEach((item) => {
    if (!skip.has(item.id)) total += item.totalCostInclCont;
  });
  return total;
}

export type BomItemStatus =
  | "costed"
  | "rolled"
  | "partial"
  | "missing"
  | "covered";

export interface IBomCoverage {
  total: number;
  /** Items already included in a parent that has its own cost */
  covered: number;
  /** Items that count toward Costed (total - covered) */
  eligible: number;
  costed: number;
  missingIds: string[];
  isComplete: boolean;
  statuses: Map<string, BomItemStatus>;
}

/**
 * Costed counter and per-item status. Children covered by a parent's own cost
 * are left out of both sides of the ratio, whether or not they have a cost.
 */
export function getBomCoverage(items: IBomCostItem[]): IBomCoverage {
  const covered = getCoveredIds(items);
  const statuses = new Map<string, BomItemStatus>();
  const missingIds: string[] = [];
  let eligible = 0;

  items.forEach((item) => {
    if (covered.has(item.id)) {
      statuses.set(item.id, "covered");
      return;
    }
    eligible++;
    if (item.isRolledUp) {
      statuses.set(
        item.id,
        isRolledUpPartial(item.id, items) ? "partial" : "rolled",
      );
    } else if (item.costPerItemUSD > 0) {
      statuses.set(item.id, "costed");
    } else {
      statuses.set(item.id, "missing");
      missingIds.push(item.id);
    }
  });

  return {
    total: items.length,
    covered: covered.size,
    eligible,
    costed: eligible - missingIds.length,
    missingIds,
    isComplete: items.length > 0 && missingIds.length === 0,
    statuses,
  };
}

/** Item with the longest lead time among items that carry their own value. */
export function getMaxLeadTimeItem(items: IBomCostItem[]): IBomCostItem | null {
  let best: IBomCostItem | null = null;
  items.forEach((i) => {
    if (!i.isRolledUp && i.leadTimeDays > 0) {
      if (!best || i.leadTimeDays > best.leadTimeDays) best = i;
    }
  });
  return best as IBomCostItem | null;
}

export type BomDateAge = "recent" | "warn" | "old" | "";

export function dateAgeBucket(dateRef: string): BomDateAge {
  if (!dateRef) return "";
  const d = new Date(dateRef);
  if (isNaN(d.getTime())) return "";
  const diffYears =
    (new Date().getTime() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  if (diffYears >= 2) return "old";
  if (diffYears >= 1) return "warn";
  return "recent";
}
