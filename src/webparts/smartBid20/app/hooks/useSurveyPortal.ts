import * as React from "react";
import { IBid, ISurveyBidIntel, ISurveyEquipment } from "../models";
import { useSurveyStore } from "../stores/useSurveyStore";
import { useBidStore } from "../stores/useBidStore";
import { computeSurveyBidIntel } from "../utils/surveyBidIntel";
import { matchBidEquipment } from "../utils/surveyBidMatch";

export interface ISurveyBidComparison {
  bid: IBid;
  /** Equipment ids the BID's Scope of Supply already considers. */
  considered: Record<string, boolean>;
}

/** The BID selected in the portal header, with the catalog equipment it considers. */
export function useSurveyBidComparison(): ISurveyBidComparison | null {
  const catalog = useSurveyStore((s) => s.catalog);
  const bidNumber = useSurveyStore((s) => s.bidNumber);
  const bids = useBidStore((s) => s.bids);
  return React.useMemo(() => {
    const bid = bidNumber ? bids.find((b) => b.bidNumber === bidNumber) : undefined;
    return bid && catalog ? { bid, considered: matchBidEquipment(bid, catalog) } : null;
  }, [catalog, bidNumber, bids]);
}

/** Loads the survey catalog and returns the equipment matching the search. */
export function useFilteredSurveyEquipment(): ISurveyEquipment[] {
  const catalog = useSurveyStore((s) => s.catalog);
  const filters = useSurveyStore((s) => s.filters);
  const load = useSurveyStore((s) => s.load);

  React.useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  return React.useMemo(() => {
    if (!catalog) return [];
    const q = filters.search.trim().toLowerCase();
    if (!q) return catalog.equipment;
    return catalog.equipment.filter((e) => {
      const haystack = [
        e.title,
        e.technology,
        e.partNumber,
        e.manufacturer,
        e.model,
        e.summary,
      ]
        .concat(e.aliases)
        .join(" ")
        .toLowerCase();
      return haystack.indexOf(q) >= 0;
    });
  }, [catalog, filters]);
}

export function useSurveyBidIntel(
  equipment: ISurveyEquipment | undefined,
): ISurveyBidIntel | null {
  const quotations = useSurveyStore((s) => s.quotations);
  const loadQuotations = useSurveyStore((s) => s.loadQuotations);
  const bids = useBidStore((s) => s.bids);

  React.useEffect(() => {
    loadQuotations().catch(() => undefined);
  }, [loadQuotations]);

  return React.useMemo(
    () =>
      equipment
        ? computeSurveyBidIntel(equipment.partNumber, quotations, bids)
        : null,
    [equipment, quotations, bids],
  );
}
