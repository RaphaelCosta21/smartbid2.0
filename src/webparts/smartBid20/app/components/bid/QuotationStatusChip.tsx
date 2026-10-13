/**
 * QuotationStatusChip — Awaiting / Received / Declined, plus a danger "Overdue" when a
 * pending request has outlived its due date.
 */
import * as React from "react";
import { IQuotationLink } from "../../models";
import { QUOTATION_LINK_STATUS_LABELS } from "../../config/quotation.config";
import { isLinkOverdue } from "../../utils/quotationLinks";
import styles from "./QuotationStatusChip.module.scss";

export interface QuotationStatusChipProps {
  link: IQuotationLink;
}

export const QuotationStatusChip: React.FC<QuotationStatusChipProps> = ({
  link,
}) => {
  const overdue = isLinkOverdue(link);
  const cls = overdue
    ? styles.overdue
    : link.status === "received"
      ? styles.received
      : link.status === "declined"
        ? styles.declined
        : styles.requested;
  return (
    <span className={`${styles.chip} ${cls}`}>
      {overdue ? "Overdue" : QUOTATION_LINK_STATUS_LABELS[link.status]}
    </span>
  );
};
