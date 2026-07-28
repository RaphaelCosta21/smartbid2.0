/**
 * approvalHelpers — Robust per-sector approval-duration computation.
 *
 * Uses the timestamps already stored on the BID (IBidApproval.requestedDate /
 * respondedDate) grouped by sector. Only CLOSED sectors/rounds count (every
 * approval in the sector has responded); pending approvals are excluded.
 * Prefers the persisted snapshot (round.sectorDurations) when present.
 */
import {
  IBid,
  IBidApproval,
  IApprovalRound,
  ISectorApprovalDuration,
} from "../models";
import { Sector } from "../models/IUser";
import {
  getSectorLabel,
  sectorFromLabel,
  SECTORS,
} from "../config/sectors.config";

const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;

export function getApprovalSector(a: IBidApproval): Sector | undefined {
  return a.sector || sectorFromLabel(a.stakeholderRole);
}

function toTime(s?: string | null): number | null {
  if (!s) return null;
  const t = new Date(s).getTime();
  return isNaN(t) ? null : t;
}

/** True when every approval in the sector has responded. */
export function sectorClosed(approvals: IBidApproval[]): boolean {
  return approvals.length > 0 && approvals.every((a) => !!a.respondedDate);
}

/** Compute per-sector durations for one round (only sectors fully responded). */
export function computeRoundSectorDurations(
  round: IApprovalRound,
): ISectorApprovalDuration[] {
  const bySector: { [sector: string]: IBidApproval[] } = {};
  (round.approvals || []).forEach((a) => {
    const sector = getApprovalSector(a);
    if (!sector) return;
    (bySector[sector] = bySector[sector] || []).push(a);
  });

  const out: ISectorApprovalDuration[] = [];
  Object.keys(bySector).forEach((sector) => {
    const list = bySector[sector];
    if (!sectorClosed(list)) return; // skip open sectors
    let minReq = Infinity;
    let maxResp = -Infinity;
    list.forEach((a) => {
      const req = toTime(a.requestedDate);
      const resp = toTime(a.respondedDate);
      if (req != null && req < minReq) minReq = req;
      if (resp != null && resp > maxResp) maxResp = resp;
    });
    if (!isFinite(minReq) || !isFinite(maxResp) || maxResp < minReq) return;
    out.push({
      sector: sector as Sector,
      sectorLabel: getSectorLabel(sector),
      requestedDate: new Date(minReq).toISOString(),
      completedDate: new Date(maxResp).toISOString(),
      durationHours: Math.round(((maxResp - minReq) / MS_PER_HOUR) * 10) / 10,
      approverCount: list.length,
    });
  });
  return out;
}

function roundIsClosed(r: IApprovalRound): boolean {
  return (
    !!r.completedDate || r.status === "approved" || r.status === "rejected"
  );
}

/** All closed-round sector durations for a bid (prefers persisted snapshot). */
export function computeBidSectorDurations(
  bid: IBid,
): ISectorApprovalDuration[] {
  const rounds = bid.approvalRounds || [];
  const result: ISectorApprovalDuration[] = [];

  rounds.forEach((r) => {
    if (!roundIsClosed(r)) return;
    const durations =
      r.sectorDurations && r.sectorDurations.length > 0
        ? r.sectorDurations
        : computeRoundSectorDurations(r);
    durations.forEach((d) => result.push(d));
  });

  // Fallback: flat bid.approvals grouped by round (no approvalRounds structure)
  if (result.length === 0 && bid.approvals && bid.approvals.length > 0) {
    const byRound: { [round: number]: IBidApproval[] } = {};
    bid.approvals.forEach((a) => {
      (byRound[a.round] = byRound[a.round] || []).push(a);
    });
    Object.keys(byRound).forEach((rk) => {
      const approvals = byRound[Number(rk)];
      const pseudo: IApprovalRound = {
        round: Number(rk),
        startedDate: "",
        startedBy: { name: "", email: "" },
        status: "approved",
        completedDate: null,
        approvals,
      };
      computeRoundSectorDurations(pseudo).forEach((d) => result.push(d));
    });
  }

  return result;
}

export interface SectorApprovalStat {
  sector: Sector;
  label: string;
  color: string;
  avgDays: number;
  count: number;
}

export interface ApprovalFilter {
  bidTypes?: string[];
  divisions?: string[];
  from?: string;
  to?: string;
}

/** Average approval days per sector across bids (closed rounds only). */
export function avgApprovalDaysBySector(
  bids: IBid[],
  filter?: ApprovalFilter,
): SectorApprovalStat[] {
  const buckets: { [sector: string]: number[] } = {};
  bids.forEach((b) => {
    if (
      filter &&
      filter.bidTypes &&
      filter.bidTypes.length > 0 &&
      filter.bidTypes.indexOf(b.bidType) < 0
    ) {
      return;
    }
    if (
      filter &&
      filter.divisions &&
      filter.divisions.length > 0 &&
      filter.divisions.indexOf(b.division) < 0
    ) {
      return;
    }
    const created = (b.createdDate || "").slice(0, 10);
    if (filter && filter.from && created && created < filter.from) return;
    if (filter && filter.to && created && created > filter.to) return;

    computeBidSectorDurations(b).forEach((d) => {
      (buckets[d.sector] = buckets[d.sector] || []).push(d.durationHours / 24);
    });
  });

  return SECTORS.map((s) => {
    const vals = buckets[s.value] || [];
    const avg = vals.length ? vals.reduce((a, v) => a + v, 0) / vals.length : 0;
    return {
      sector: s.value,
      label: s.label,
      color: s.color,
      avgDays: Math.round(avg * 10) / 10,
      count: vals.length,
    };
  })
    .filter((r) => r.count > 0)
    .sort((a, b) => b.avgDays - a.avgDays);
}

/** Overall approval cycle time (days) for a bid — earliest request to latest completion. */
export function computeApprovalCycleTime(bid: IBid): number | null {
  const durations = computeBidSectorDurations(bid);
  if (durations.length === 0) return null;
  let minReq = Infinity;
  let maxComp = -Infinity;
  durations.forEach((d) => {
    const req = new Date(d.requestedDate).getTime();
    const comp = new Date(d.completedDate).getTime();
    if (req < minReq) minReq = req;
    if (comp > maxComp) maxComp = comp;
  });
  if (!isFinite(minReq) || !isFinite(maxComp)) return null;
  return Math.round(((maxComp - minReq) / MS_PER_DAY) * 10) / 10;
}
