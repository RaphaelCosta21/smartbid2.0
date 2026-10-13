/**
 * Bid Comparator settings: how loose the description matching may be and what counts as a
 * meaningful price change.
 */
export const COMPARATOR_CONFIG = {
  /** Minimum description similarity (%) to pair items that share no part number */
  defaultThresholdPct: 75,
  minThresholdPct: 50,
  maxThresholdPct: 95,
  thresholdStepPct: 5,
  /** A unit-price change beyond this (%) is reported as an increase / saving */
  significantChangePct: 5,
  /** Rows listed per section of the executive view */
  insightRows: 5,
  newScopeRows: 6,
};
