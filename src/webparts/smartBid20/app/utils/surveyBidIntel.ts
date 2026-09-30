/**
 * Bid Intel for a survey equipment part number — aggregates the quotation
 * catalog and past BID asset breakdowns (no stored aggregates exist).
 */
import { IBid, IQuotationItem, ISurveyBidIntel } from "../models";

const norm = (pn: string): string => (pn || "").trim().toUpperCase();

const median = (values: number[]): number | null => {
  if (values.length === 0) return null;
  const s = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

const percentile = (sorted: number[], p: number): number =>
  sorted[Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)))];

export function computeSurveyBidIntel(
  partNumber: string,
  quotations: IQuotationItem[],
  bids: IBid[],
): ISurveyBidIntel {
  const pn = norm(partNumber);
  const purchaseCosts: number[] = [];
  const leadDays: number[] = [];
  const frequency = { inHouse: 0, purchase: 0, rent: 0 };

  if (pn) {
    quotations.forEach((q) => {
      if (norm(q.partNumber) !== pn) return;
      if (q.type === "rental") frequency.rent++;
      else {
        frequency.purchase++;
        if (q.costUSD > 0) purchaseCosts.push(q.costUSD);
      }
      if (q.leadTimeDays > 0) leadDays.push(q.leadTimeDays);
    });

    bids.forEach((bid) => {
      const pnByScope: Record<string, string> = {};
      (bid.scopeItems || []).forEach((s) => {
        if (!s.isSection) pnByScope[s.id] = norm(s.partNumber);
      });
      (bid.assetBreakdown || []).forEach((a) => {
        if (pnByScope[a.scopeItemId] !== pn) return;
        const status = a.availabilityStatus;
        const acq = (a.acquisitionType || "").toLowerCase();
        if (status === "In House" || status === "Onboard" || acq === "on hand") {
          frequency.inHouse++;
        } else if (status === "Rental" || acq === "rent") {
          frequency.rent++;
        } else if (status === "Purchase" || acq === "buy") {
          frequency.purchase++;
          if (a.unitCostUSD > 0) purchaseCosts.push(a.unitCostUSD);
        }
        if (a.leadTimeDays > 0) leadDays.push(a.leadTimeDays);
      });
    });
  }

  let leadMin: number | null = null;
  let leadMax: number | null = null;
  if (leadDays.length > 0) {
    const sorted = leadDays.slice().sort((a, b) => a - b);
    const useIqr = sorted.length >= 4;
    leadMin = Math.round((useIqr ? percentile(sorted, 0.25) : sorted[0]) / 7);
    leadMax = Math.round(
      (useIqr ? percentile(sorted, 0.75) : sorted[sorted.length - 1]) / 7,
    );
  }

  return {
    sampleCount: frequency.inHouse + frequency.purchase + frequency.rent,
    medianCostUSD: median(purchaseCosts),
    leadTimeWeeksMin: leadMin,
    leadTimeWeeksMax: leadMax,
    frequency,
  };
}
