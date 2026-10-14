/**
 * Primary / secondary approvals for BIDs with two teams (Division INTEGRATED,
 * or SSR service line "Integrated"). Each team (track) runs its own rounds; the
 * BID is approved when the latest round of every track is approved.
 * Without a secondary approval the BID keeps the single approval flow.
 */
import {
  ApprovalStatus,
  BusinessLine,
  IApprovalRound,
  IApprovalTrackState,
  IBid,
  IBidApproval,
  IPersonRef,
  ITeamMember,
} from "../models";
import {
  getBidBusinessLines,
  getLeadDivision,
  getTrackLabel,
  isIntegratedDivision,
  memberMatchesBusinessLines,
  businessLineDivision,
} from "./divisionHelpers";

/** null = single approval for the whole BID. */
export type ApprovalTrack = BusinessLine | null;

/** BID with two teams: the Approval tab offers a secondary approval. */
export function canHaveSecondaryApproval(bid: IBid): boolean {
  return getBidBusinessLines(bid).length > 1;
}

/** Teams the user may pick for the secondary approval. */
export function getSecondaryCandidates(bid: IBid): BusinessLine[] {
  const lines = getBidBusinessLines(bid);
  if (lines.length < 2) return [];
  if (isIntegratedDivision(bid.division)) {
    const lead = getLeadDivision(bid);
    return lines.filter((l) => businessLineDivision(l) !== lead);
  }
  return lines;
}

/** [primary, secondary] when a secondary approval is set, otherwise []. */
export function getApprovalTracks(bid: IBid): BusinessLine[] {
  const secondary = bid.approvalSecondaryLine;
  const lines = getBidBusinessLines(bid);
  if (!secondary || lines.length < 2 || lines.indexOf(secondary) < 0) {
    return [];
  }
  const primary = lines.filter((l) => l !== secondary)[0];
  return primary ? [primary, secondary] : [];
}

export function isSplitApproval(bid: IBid): boolean {
  return getApprovalTracks(bid).length > 0;
}

export function getPrimaryTrack(bid: IBid): BusinessLine | null {
  const tracks = getApprovalTracks(bid);
  return tracks.length > 0 ? tracks[0] : null;
}

export function getApprovalTrackLabel(bid: IBid, track: BusinessLine): string {
  const role = track === getPrimaryTrack(bid) ? "Primary" : "Secondary";
  return `${role} approval - ${getTrackLabel(bid, track)}`;
}

/** Index after which track rounds count: a later single round supersedes earlier tracks. */
function lastSingleRoundIndex(rounds: IApprovalRound[]): number {
  for (let i = rounds.length - 1; i >= 0; i--) {
    if (!rounds[i].track) return i;
  }
  return -1;
}

function toTime(iso: string | null | undefined): number {
  const t = iso ? new Date(iso).getTime() : NaN;
  return isNaN(t) ? NaN : t;
}

/**
 * When the current revision reopened a completed BID, the approvals that
 * completed it no longer count (every team approves again). Returns the
 * moment the BID was last completed before that revision, or -Infinity.
 */
function supersededBefore(bid: IBid): number {
  const revisions = bid.revisions || [];
  const last = revisions.length > 0 ? revisions[revisions.length - 1] : null;
  const revAt = toTime(last ? last.openedDate : null);
  if (isNaN(revAt)) return -Infinity;
  let at = -Infinity;
  (bid.statusHistory || []).forEach((s) => {
    if (s.status !== "Completed") return;
    const t = toTime(s.start);
    if (!isNaN(t) && t <= revAt && t > at) at = t;
  });
  return at;
}

/** Rounds of a track that still count (after the last single round and the last reopened completion). */
export function getTrackRounds(
  bid: IBid,
  track: BusinessLine,
): IApprovalRound[] {
  const rounds = bid.approvalRounds || [];
  const from = lastSingleRoundIndex(rounds) + 1;
  const since = supersededBefore(bid);
  return rounds
    .slice(from)
    .filter(
      (r) =>
        r.track === track &&
        !(toTime(r.startedDate) <= since),
    );
}

export function getLatestTrackRound(
  bid: IBid,
  track: BusinessLine,
): IApprovalRound | undefined {
  const rounds = getTrackRounds(bid, track);
  return rounds.length > 0 ? rounds[rounds.length - 1] : undefined;
}

/** Status of the track's latest round ("not-started" when it never ran). */
export function getTrackStatus(
  bid: IBid,
  track: BusinessLine,
): ApprovalStatus {
  const round = getLatestTrackRound(bid, track);
  if (!round) return "not-started";
  if (round.status === "approved" || round.status === "rejected") {
    return round.status;
  }
  return (round.approvals || []).some((a) => a.status === "rejected")
    ? "rejected"
    : "pending";
}

/** BID-level status from the tracks: rejected > pending > approved; none started = not-started. */
export function aggregateTrackStatus(
  statuses: ApprovalStatus[],
): ApprovalStatus {
  if (statuses.length === 0 || statuses.every((s) => s === "not-started")) {
    return "not-started";
  }
  if (statuses.some((s) => s === "rejected")) return "rejected";
  if (statuses.every((s) => s === "approved")) return "approved";
  return "pending";
}

export function getSplitApprovalStatus(bid: IBid): ApprovalStatus {
  return aggregateTrackStatus(
    getApprovalTracks(bid).map((t) => getTrackStatus(bid, t)),
  );
}

/** Approvals of each track's latest round (what `bid.approvals` holds in split mode). */
export function getCurrentTrackApprovals(
  bid: IBid,
  except?: BusinessLine,
): IBidApproval[] {
  const out: IBidApproval[] = [];
  getApprovalTracks(bid).forEach((t) => {
    if (t === except) return;
    const round = getLatestTrackRound(bid, t);
    if (round) (round.approvals || []).forEach((a) => out.push(a));
  });
  return out;
}

/** Every track's latest round approved (split mode only). */
export function isSplitApprovalComplete(bid: IBid): boolean {
  const tracks = getApprovalTracks(bid);
  return (
    tracks.length > 0 &&
    tracks.every((t) => getTrackStatus(bid, t) === "approved")
  );
}

/** Any round still waiting for answers (keeps the live sync running). */
export function hasPendingApprovalRound(bid: IBid): boolean {
  if (bid.approvalStatus === "pending") return true;
  return getApprovalTracks(bid).some(
    (t) => getTrackStatus(bid, t) === "pending",
  );
}

/** Rounds started in the current cycle (after the last revision was opened). */
export function getCurrentCycleRounds(bid: IBid): IApprovalRound[] {
  const revisions = bid.revisions || [];
  const last = revisions.length > 0 ? revisions[revisions.length - 1] : null;
  const since = last && last.openedDate ? new Date(last.openedDate).getTime() : 0;
  return (bid.approvalRounds || []).filter((r) => {
    const t = new Date(r.startedDate).getTime();
    return isNaN(t) || t >= since;
  });
}

/** The secondary approval can be created/removed only before any round of the current cycle. */
export function canChangeSecondaryApproval(bid: IBid): boolean {
  if (!canHaveSecondaryApproval(bid)) return false;
  if (bid.currentStatus === "Completed") return false;
  if (hasPendingApprovalRound(bid)) return false;
  return getCurrentCycleRounds(bid).length === 0;
}

/** Track states with each status taken from the rounds (what the flow reads). */
export function syncTrackStatuses(
  bid: IBid,
): Partial<Record<BusinessLine, IApprovalTrackState>> {
  const out: Partial<Record<BusinessLine, IApprovalTrackState>> = {};
  getApprovalTracks(bid).forEach((t) => {
    out[t] = {
      ...((bid.approvalTracks || {})[t] || {}),
      status: getTrackStatus(bid, t),
    };
  });
  return out;
}

/**
 * Approval fields after a track round was added or replaced: rounds, the
 * current approvals of every track, per-track statuses and the BID status.
 */
export function buildTrackRoundPatch(
  bid: IBid,
  round: IApprovalRound,
  trackState?: IApprovalTrackState,
): Pick<
  IBid,
  "approvalRounds" | "approvals" | "approvalTracks" | "approvalStatus"
> {
  const rounds = bid.approvalRounds || [];
  const exists = rounds.some((r) => r.round === round.round);
  const approvalRounds = exists
    ? rounds.map((r) => (r.round === round.round ? round : r))
    : [...rounds, round];
  const track = round.track as BusinessLine;
  const next: IBid = {
    ...bid,
    approvalRounds,
    approvalTracks: {
      ...(bid.approvalTracks || {}),
      [track]: { ...((bid.approvalTracks || {})[track] || {}), ...trackState },
    },
  };
  const approvalTracks = syncTrackStatuses(next);
  return {
    approvalRounds,
    approvals: getCurrentTrackApprovals(next),
    approvalTracks,
    approvalStatus: getSplitApprovalStatus(next),
  };
}

/** Project / Operation candidates of a track (OPG also accepts untagged members). */
export function memberMatchesTrack(
  member: Pick<ITeamMember, "businessLines">,
  track: BusinessLine,
): boolean {
  return memberMatchesBusinessLines(member, [track]);
}

/** BID Project Managers of a track: their saved team, else their Members tags. */
export function projectManagersForTrack(
  bid: IBid,
  track: BusinessLine,
  members: ITeamMember[],
): IPersonRef[] {
  const primary = getPrimaryTrack(bid);
  return (bid.projectManager || []).filter((pm) => {
    if (pm.businessLine) return pm.businessLine === track;
    const member = members.find(
      (m) => (m.email || "").toLowerCase() === (pm.email || "").toLowerCase(),
    );
    return member ? memberMatchesTrack(member, track) : track === primary;
  });
}
