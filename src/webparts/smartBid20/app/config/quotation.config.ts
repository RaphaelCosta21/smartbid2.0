/**
 * Quotation request tracking — status labels and defaults shared by the Assets Breakdown
 * drawer, the Quotation Control view and the Bid Presentation.
 */
import { QuotationLinkStatus } from "../models";

/** Days a supplier is given to answer when the user doesn't set a due date */
export const QUOTATION_DEFAULT_SLA_DAYS = 7;

export const QUOTATION_LINK_STATUS_LABELS: Record<QuotationLinkStatus, string> =
  {
    requested: "Awaiting",
    received: "Received",
    declined: "Declined",
  };

export const QUOTATION_LINK_STATUS_ORDER: QuotationLinkStatus[] = [
  "requested",
  "received",
  "declined",
];
