/**
 * presentationView — BID-level view model of the BID Presentation page and its exports:
 * how the price is built, the labor effort, the commercial context and the item insights.
 * Money comes from the same Cost Summary view, so the presentation matches the Cost Summary tab.
 */
import {
  ApprovalStatus,
  IBid,
  IBidApproval,
  IClarificationItem,
  IHoursItem,
  IPersonRef,
} from "../models";
import { getSectorColor, getSectorLabel } from "../config/sectors.config";
import { ICostSummaryView } from "./costSummaryView";
import { IBidFx, toUSDWithBidRates } from "./costCalculations";
import { normalizeQualificationTables } from "./qualificationHelpers";
import { getApprovalSector } from "./approvalHelpers";
import {
  getCurrentCycleRounds,
  getCurrentTrackApprovals,
  getSplitApprovalStatus,
  isSplitApproval,
} from "./approvalTracks";
import {
  getItemHistory,
  IHistoryIndex,
  IHistoryRecord,
  IPresentationItem,
  median,
} from "./bidPresentation";
import { formatDate } from "./formatters";

export interface IDisplayCurrency {
  currency: "USD" | "BRL";
  /** Display-currency units per 1 USD */
  rate: number;
}

// ─── Price build-up (waterfall) ───

export type PriceStepKey =
  | "assets"
  | "engineering"
  | "onshore"
  | "offshore"
  | "logistics"
  | "certifications"
  | "prepMob";

export interface IPriceStep {
  key: PriceStepKey;
  label: string;
  usd: number;
  /** Share of the BID total, 0–100 */
  pct: number;
}

export const PRICE_STEP_LABELS: Record<PriceStepKey, string> = {
  assets: "Assets",
  engineering: "Engineering",
  onshore: "Onshore",
  offshore: "Offshore",
  logistics: "Logistics",
  certifications: "Certifications",
  prepMob: "Prep & Mob",
};

/** Cost categories in the order the price is built; empty categories are left out. */
export function buildPriceSteps(view: ICostSummaryView): IPriceStep[] {
  const s = view.summary;
  const ptax = s.ptaxUsed;
  const brlToUSD = (brl: number): number => (ptax > 0 ? brl / ptax : 0);
  const values: Record<PriceStepKey, number> = {
    assets: s.assetsCostUSD,
    engineering: brlToUSD(s.engineeringHoursCostBRL),
    onshore: brlToUSD(s.onshoreHoursCostBRL),
    offshore: brlToUSD(s.offshoreHoursCostBRL),
    logistics: s.logisticsCostUSD,
    certifications: s.certificationsCostUSD,
    prepMob: s.rtsCostUSD + s.mobilizationCostUSD + s.consumablesCostUSD,
  };
  const total = s.totalCostUSD;
  return (Object.keys(PRICE_STEP_LABELS) as PriceStepKey[])
    .filter((key) => Math.abs(values[key]) > 0.005)
    .map((key) => ({
      key,
      label: PRICE_STEP_LABELS[key],
      usd: values[key],
      pct: total > 0 ? (values[key] / total) * 100 : 0,
    }));
}

/** One line behind a cost category or a labor role */
export interface IDetailLine {
  key: string;
  label: string;
  sub: string;
  /** Null when the line carries hours only (deliverable-based engineering) */
  usd: number | null;
  hours?: number;
}

const byValueDesc = (a: IDetailLine, b: IDetailLine): number =>
  (b.usd === null ? -1 : b.usd) - (a.usd === null ? -1 : a.usd) ||
  (b.hours || 0) - (a.hours || 0);

function isHoursRow(i: IHoursItem): boolean {
  return !i.isSeparator && (i.totalHours > 0 || i.costBRL > 0);
}

function hoursLine(i: IHoursItem, ptax: number): IDetailLine {
  return {
    key: i.id,
    label: i.requirementName || i.function || "(no description)",
    sub: [i.function, i.phase].filter(Boolean).join(" · "),
    usd: ptax > 0 ? (i.costBRL || 0) / ptax : null,
    hours: i.totalHours || 0,
  };
}

function hoursLines(items: IHoursItem[], ptax: number): IDetailLine[] {
  return items.filter(isHoursRow).map((i) => hoursLine(i, ptax));
}

function costLines(
  rows: {
    id: string;
    label: string;
    sub: string;
    totalCost: number;
    originalCurrency: string;
  }[],
  fx: IBidFx,
): IDetailLine[] {
  return rows
    .filter((r) => (r.totalCost || 0) !== 0)
    .map((r) => ({
      key: r.id,
      label: r.label || "(no description)",
      sub: r.sub,
      usd: toUSDWithBidRates(r.totalCost, r.originalCurrency, fx),
    }));
}

/** Lines behind a non-asset cost category, most expensive first. Assets use the item list. */
export function buildStepLines(
  bid: IBid,
  step: PriceStepKey,
  fx: IBidFx,
): IDetailLine[] {
  const hs = bid.hoursSummary;
  const ptax = fx.brlRate;
  let lines: IDetailLine[] = [];
  switch (step) {
    case "engineering":
      lines = buildEffortView(bid, ptax)
        .groups.filter((g) => g.kind === "engineering")
        .reduce<IDetailLine[]>((all, g) => {
          g.roles.forEach((r) => r.lines.forEach((l) => all.push(l)));
          return all;
        }, []);
      break;
    case "onshore":
      lines = hoursLines((hs && hs.onshoreHours && hs.onshoreHours.items) || [], ptax);
      break;
    case "offshore":
      lines = hoursLines((hs && hs.offshoreHours && hs.offshoreHours.items) || [], ptax);
      break;
    case "logistics":
      lines = costLines(
        (bid.logisticsBreakdown || []).map((l) => ({
          id: l.id,
          label: l.item || l.description,
          sub: [l.item ? l.description : "", l.qty ? `Qty ${l.qty}` : ""]
            .filter(Boolean)
            .join(" · "),
          totalCost: l.totalCost,
          originalCurrency: l.originalCurrency,
        })),
        fx,
      );
      break;
    case "certifications":
      lines = costLines(
        (bid.certificationsBreakdown || [])
          .filter((c) => !c.isSection)
          .map((c) => ({
            id: c.id,
            label: c.itemRef,
            sub: [c.qty ? `Qty ${c.qty}` : "", c.expiryPeriod]
              .filter(Boolean)
              .join(" · "),
            totalCost: c.totalCost,
            originalCurrency: c.originalCurrency,
          })),
        fx,
      );
      break;
    case "prepMob":
      lines = costLines(
        (bid.rtsItems || [])
          .map((r) => ({
            id: r.id,
            label: r.description,
            sub: ["RTS", r.costType].filter(Boolean).join(" · "),
            totalCost: r.totalCost,
            originalCurrency: r.originalCurrency,
          }))
          .concat(
            (bid.mobilizationItems || []).map((m) => ({
              id: m.id,
              label: m.description,
              sub: ["Mobilization", m.costType].filter(Boolean).join(" · "),
              totalCost: m.totalCost,
              originalCurrency: m.originalCurrency,
            })),
          )
          .concat(
            (bid.consumableItems || []).map((c) => ({
              id: c.id,
              label: c.item || c.description,
              sub: "Consumables",
              totalCost: c.totalCost,
              originalCurrency: c.originalCurrency,
            })),
          ),
        fx,
      );
      break;
    default:
      lines = [];
  }
  return lines.sort(byValueDesc);
}

// ─── Effort ───

export type EffortKind = "engineering" | "onshore" | "offshore";

export const EFFORT_LABELS: Record<EffortKind, string> = {
  engineering: "Engineering",
  onshore: "Onshore",
  offshore: "Offshore",
};

export interface IEffortRole {
  kind: EffortKind;
  role: string;
  hours: number;
  lines: IDetailLine[];
}

export interface IEffortGroup {
  kind: EffortKind;
  label: string;
  hours: number;
  roles: IEffortRole[];
}

export interface IEffortView {
  groups: IEffortGroup[];
  totalHours: number;
  roleCount: number;
}

function addRoleHours(
  map: Record<string, IEffortRole>,
  kind: EffortKind,
  role: string,
  line: IDetailLine,
): void {
  const name = (role || "").trim() || EFFORT_LABELS[kind];
  const entry = map[name] || (map[name] = { kind, role: name, hours: 0, lines: [] });
  entry.hours += line.hours || 0;
  entry.lines.push(line);
}

/** Labor hours per discipline and role, from the line items (section totals can be stale). */
export function buildEffortView(bid: IBid, ptax: number): IEffortView {
  const hs = bid.hoursSummary;
  const roleMaps: Record<EffortKind, Record<string, IEffortRole>> = {
    engineering: {},
    onshore: {},
    offshore: {},
  };

  const eng = hs && hs.engineeringHours;
  ((eng && eng.engineeringItems) || []).forEach((item) => {
    if (!(item.totalHours > 0)) return;
    // Deliverable hours per resource, scaled to the item total (includes manufacturing support)
    const design: Record<string, number> = {};
    (item.deliverables || []).forEach((d) => {
      const byRes = d.hoursByResource
        ? d.hoursByResource
        : { [d.resourceType || ""]: d.hours };
      Object.keys(byRes).forEach((res) => {
        design[res] = (design[res] || 0) + (byRes[res] || 0);
      });
    });
    const designTotal = Object.keys(design).reduce((s, k) => s + design[k], 0);
    const label = item.description || item.equipmentOffer || "(no description)";
    if (designTotal <= 0) {
      addRoleHours(roleMaps.engineering, "engineering", "", {
        key: item.id,
        label,
        sub: item.sectionName || "",
        usd: null,
        hours: item.totalHours,
      });
      return;
    }
    Object.keys(design).forEach((res) => {
      const hours = (design[res] / designTotal) * item.totalHours;
      if (hours <= 0) return;
      addRoleHours(roleMaps.engineering, "engineering", res, {
        key: `${item.id}-${res}`,
        label,
        sub: item.sectionName || "",
        usd: null,
        hours,
      });
    });
  });
  ((eng && eng.items) || []).filter(isHoursRow).forEach((it) =>
    addRoleHours(
      roleMaps.engineering,
      "engineering",
      it.function,
      hoursLine(it, ptax),
    ),
  );

  (["onshore", "offshore"] as EffortKind[]).forEach((kind) => {
    const section =
      hs && (kind === "onshore" ? hs.onshoreHours : hs.offshoreHours);
    ((section && section.items) || []).filter(isHoursRow).forEach((it) =>
      addRoleHours(roleMaps[kind], kind, it.function, hoursLine(it, ptax)),
    );
  });

  const roleNames: Record<string, boolean> = {};
  const groups: IEffortGroup[] = (Object.keys(roleMaps) as EffortKind[])
    .map((kind) => {
      const roles = Object.keys(roleMaps[kind])
        .map((k) => roleMaps[kind][k])
        .filter((r) => r.hours > 0)
        .sort((a, b) => b.hours - a.hours);
      roles.forEach((r) => {
        roleNames[r.role.toLowerCase()] = true;
        r.lines.sort(byValueDesc);
      });
      return {
        kind,
        label: EFFORT_LABELS[kind],
        hours: roles.reduce((s, r) => s + r.hours, 0),
        roles,
      };
    })
    .filter((g) => g.hours > 0);

  return {
    groups,
    totalHours: groups.reduce((s, g) => s + g.hours, 0),
    roleCount: Object.keys(roleNames).length,
  };
}

// ─── Opportunity facts ───

export interface IPresentationFact {
  key: string;
  label: string;
  value: string;
}

export function buildFacts(bid: IBid): IPresentationFact[] {
  const o = bid.opportunityInfo || ({} as IBid["opportunityInfo"]);
  const facts: IPresentationFact[] = [
    { key: "client", label: "Client", value: o.client || "" },
    { key: "field", label: "Field", value: o.field || "" },
    { key: "vessel", label: "Vessel", value: o.vessel || "" },
    {
      key: "depth",
      label: "Water depth",
      value:
        o.waterDepth > 0
          ? `${o.waterDepth.toLocaleString("en-US")} ${o.waterDepthUnit || "m"}`
          : "",
    },
    {
      key: "start",
      label: "Operation start",
      value: o.operationStartDate ? formatDate(o.operationStartDate) : "",
    },
    {
      key: "duration",
      label: "Duration",
      value:
        o.totalDuration > 0
          ? `${o.totalDuration} ${o.totalDurationUnit || "days"}`
          : "",
    },
    { key: "region", label: "Region", value: o.region || "" },
  ];
  return facts.filter((f) => f.value && f.value !== "-");
}

// ─── Commercial context ───

export interface ITeamRole {
  role: string;
  people: IPersonRef[];
}

export interface IApprovalSectorState {
  sector: string;
  label: string;
  color: string;
  status: ApprovalStatus;
  approvals: IBidApproval[];
}

export interface IQualificationRow {
  id: string;
  category: string;
  text: string;
}

export interface ICommercialView {
  team: ITeamRole[];
  clarifications: IClarificationItem[];
  answeredClarifications: number;
  qualifications: IQualificationRow[];
  qualificationCategories: { label: string; count: number }[];
  approval: {
    status: ApprovalStatus;
    round: number | null;
    sectors: IApprovalSectorState[];
  };
}

function sectorStatus(approvals: IBidApproval[]): ApprovalStatus {
  if (approvals.some((a) => a.status === "rejected")) return "rejected";
  if (approvals.some((a) => a.status === "revision-requested")) {
    return "revision-requested";
  }
  if (approvals.length > 0 && approvals.every((a) => a.status === "approved")) {
    return "approved";
  }
  return "pending";
}

function currentApproval(bid: IBid): {
  status: ApprovalStatus;
  round: number | null;
  approvals: IBidApproval[];
} {
  if (isSplitApproval(bid)) {
    return {
      status: getSplitApprovalStatus(bid),
      round: null,
      approvals: getCurrentTrackApprovals(bid),
    };
  }
  const rounds = getCurrentCycleRounds(bid).filter((r) => !r.track);
  const latest = rounds.length > 0 ? rounds[rounds.length - 1] : null;
  if (!latest) {
    return { status: "not-started", round: null, approvals: [] };
  }
  return {
    status: bid.approvalStatus || latest.status,
    round: latest.round,
    approvals: latest.approvals || [],
  };
}

const isPerson = (p: IPersonRef | null | undefined): p is IPersonRef =>
  !!p && !!(p.name || p.email);

/** People fields may hold a single legacy object, nulls or an array */
const peopleOf = (value: unknown): IPersonRef[] =>
  (Array.isArray(value) ? value : value ? [value] : []).filter(isPerson);

/** Approver name with fallbacks for incomplete approval records */
export function approverName(a: IBidApproval): string {
  const s = a.stakeholder;
  return (s && (s.name || s.email)) || a.stakeholderRole || "Approver";
}

export function buildCommercialView(bid: IBid): ICommercialView {
  const team: ITeamRole[] = [
    { role: "Engineering", people: peopleOf(bid.engineerResponsible) },
    { role: "Analyst", people: peopleOf(bid.analyst) },
    { role: "Project Manager", people: peopleOf(bid.projectManager) },
    { role: "Commercial", people: peopleOf(bid.commercialRequester) },
  ].filter((t) => t.people.length > 0);

  const all = bid.clarifications || [];
  const clarifications = all.filter((c) => c.baseType !== "Qualification");
  const qualifications: IQualificationRow[] = [];
  normalizeQualificationTables(bid.qualificationTables).forEach((t) =>
    t.items.forEach((q) => {
      if (!(q.qualification || "").trim()) return;
      qualifications.push({
        id: q.id,
        category: (q.category || "").trim() || t.title || "General",
        text: q.qualification,
      });
    }),
  );
  all
    .filter((c) => c.baseType === "Qualification")
    .forEach((c) =>
      qualifications.push({
        id: c.id,
        category: (c.category || "").trim() || "General",
        text: c.clarification || c.description,
      }),
    );
  const catCount: Record<string, number> = {};
  qualifications.forEach((q) => {
    catCount[q.category] = (catCount[q.category] || 0) + 1;
  });

  const approval = currentApproval(bid);
  const bySector: Record<string, IBidApproval[]> = {};
  const order: string[] = [];
  approval.approvals.forEach((a) => {
    const sector = getApprovalSector(a) || a.stakeholderRole || "other";
    if (!bySector[sector]) {
      bySector[sector] = [];
      order.push(sector);
    }
    bySector[sector].push(a);
  });

  return {
    team,
    clarifications,
    answeredClarifications: clarifications.filter(
      (c) => !!(c.clientResponse || "").trim(),
    ).length,
    qualifications,
    qualificationCategories: Object.keys(catCount)
      .map((label) => ({ label, count: catCount[label] }))
      .sort((a, b) => b.count - a.count),
    approval: {
      status: approval.status,
      round: approval.round,
      sectors: order.map((sector) => ({
        sector,
        label: getSectorLabel(sector),
        color: getSectorColor(sector),
        status: sectorStatus(bySector[sector]),
        approvals: bySector[sector],
      })),
    },
  };
}

// ─── Item insights (price vs. history) ───

export interface IItemInsight {
  records: IHistoryRecord[];
  /** Median price of the same item in other BIDs, USD */
  medianUSD: number | null;
  /** This BID vs. the median, % */
  deltaPct: number | null;
}

export function buildItemInsights(
  items: IPresentationItem[],
  index: IHistoryIndex,
  bidNumber: string,
): Map<string, IItemInsight> {
  const out = new Map<string, IItemInsight>();
  items.forEach((item) => {
    const history = getItemHistory(index, item, bidNumber);
    const med = median(
      history.records.map((r) => r.totalUSD).filter((v) => v > 0),
    );
    out.set(item.key, {
      records: history.records,
      medianUSD: med,
      deltaPct:
        med && med > 0 ? ((item.totalUSD - med) / med) * 100 : null,
    });
  });
  return out;
}

// ─── Asset value tree ───

export interface IAssetGroup {
  category: string;
  usd: number;
  items: IPresentationItem[];
}

/** Priced items grouped by resource type, largest group first */
export function groupAssetsByCategory(
  ranked: IPresentationItem[],
): IAssetGroup[] {
  const map: Record<string, IAssetGroup> = {};
  ranked.forEach((i) => {
    const g =
      map[i.category] ||
      (map[i.category] = { category: i.category, usd: 0, items: [] });
    g.usd += i.totalUSD;
    g.items.push(i);
  });
  return Object.keys(map)
    .map((k) => map[k])
    .sort((a, b) => b.usd - a.usd);
}
