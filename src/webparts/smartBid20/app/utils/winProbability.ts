/**
 * winProbability — chance of winning an undecided BID: the commercial's manual
 * value (Follow Up), else the historical win rate of the same client, service
 * line, division, or overall (Won / (Won + Loss)).
 */
import { IBid } from "../models";

export type WinProbabilitySource =
  | "manual"
  | "client"
  | "serviceLine"
  | "division"
  | "global";

export interface IWinProbability {
  /** 0-100 */
  value: number;
  source: WinProbabilitySource;
  /** Decided BIDs behind a historical rate (0 for manual). */
  sample: number;
}

interface ITally {
  won: number;
  decided: number;
}

export interface IWinRateIndex {
  client: Record<string, ITally>;
  serviceLine: Record<string, ITally>;
  division: Record<string, ITally>;
  global: ITally;
}

/** Minimum decided BIDs before a segment's rate is trusted. */
const MIN_SAMPLE = 3;

export const WIN_PROBABILITY_SOURCE_LABEL: Record<WinProbabilitySource, string> =
  {
    manual: "Manual",
    client: "Client history",
    serviceLine: "Service line history",
    division: "Division history",
    global: "Overall win rate",
  };

/** Quick-pick values offered in the Follow Up drawer. */
export const WIN_PROBABILITY_LEVELS: number[] = [10, 25, 50, 75, 90];

function clientKey(bid: IBid): string {
  return (bid.opportunityInfo?.client || "").trim().toLowerCase();
}

function addTo(map: Record<string, ITally>, key: string, won: boolean): void {
  if (!key) return;
  const t = map[key] || (map[key] = { won: 0, decided: 0 });
  t.decided++;
  if (won) t.won++;
}

export function buildWinRateIndex(bids: IBid[]): IWinRateIndex {
  const index: IWinRateIndex = {
    client: {},
    serviceLine: {},
    division: {},
    global: { won: 0, decided: 0 },
  };
  bids.forEach((b) => {
    const outcome = b.bidResult?.outcome;
    if (outcome !== "Won" && outcome !== "Loss") return;
    const won = outcome === "Won";
    addTo(index.client, clientKey(b), won);
    addTo(index.serviceLine, b.serviceLine || "", won);
    addTo(index.division, b.division || "", won);
    index.global.decided++;
    if (won) index.global.won++;
  });
  return index;
}

function fromTally(
  tally: ITally | undefined,
  source: WinProbabilitySource,
  minSample: number,
): IWinProbability | null {
  if (!tally || tally.decided < minSample) return null;
  return {
    value: Math.round((tally.won / tally.decided) * 100),
    source,
    sample: tally.decided,
  };
}

/** Historical estimate only (ignores the manual value). */
export function getHistoricalWinProbability(
  bid: IBid,
  index: IWinRateIndex,
): IWinProbability | null {
  return (
    fromTally(index.client[clientKey(bid)], "client", MIN_SAMPLE) ||
    fromTally(index.serviceLine[bid.serviceLine || ""], "serviceLine", MIN_SAMPLE) ||
    fromTally(index.division[bid.division || ""], "division", MIN_SAMPLE) ||
    fromTally(index.global, "global", 1)
  );
}

/** Manual value when set, else the historical estimate; null without any history. */
export function getWinProbability(
  bid: IBid,
  index: IWinRateIndex,
): IWinProbability | null {
  const manual = bid.bidResult?.winProbability;
  if (typeof manual === "number") {
    return { value: manual, source: "manual", sample: 0 };
  }
  return getHistoricalWinProbability(bid, index);
}
