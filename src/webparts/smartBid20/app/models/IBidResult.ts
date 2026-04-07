/**
 * IBidResult — Follow-up / resultado do BID.
 */
import { BidResultOutcome } from "./IBidStatus";

export interface IBidResultDef {
  outcome: BidResultOutcome | null;
  outcomeDate: string | null;
  contractValue: number | null;
  contractCurrency: string | null;
  lostReason: string | null;
  competitorName: string | null;
  feedbackNotes: string | null;
  followUpDate: string | null;
  lastUpdatedBy: string | null;
  lastUpdatedDate: string | null;
}
