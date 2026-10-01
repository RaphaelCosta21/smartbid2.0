import * as React from "react";
import { Star } from "lucide-react";
import { IBid } from "../../models";
import { StatusBadge } from "../common/StatusBadge";
import { BidFavoriteButton } from "../bid/BidFavoriteButton";
import { useStatusColors } from "../../hooks/useStatusColors";
import { formatDate, formatNumber } from "../../utils/formatters";
import { IPastBidRow } from "../../utils/pastBidHelpers";
import { PastBidChips, PastBidKbBadge, PastBidOutcome } from "./PastBidBadges";
import styles from "./PastBidCard.module.scss";

interface PastBidCardProps {
  row: IPastBidRow;
  onOpen: (bid: IBid) => void;
  /** Footer line, e.g. who favorited the BID */
  note?: string;
}

const MAX_CARD_TAGS = 5;

/** Card view of a closed-out BID with its Past Bids classification. */
export const PastBidCard: React.FC<PastBidCardProps> = ({
  row,
  onOpen,
  note,
}) => {
  const { getDivisionColor, getServiceLineColor } = useStatusColors();
  const { bid } = row;
  const summary =
    bid.knowledgeProfile?.summary ||
    bid.opportunityInfo?.projectDescription ||
    "";
  const engineers = (bid.engineerResponsible || [])
    .map((e) => e.name)
    .filter(Boolean);
  const result = bid.bidResult;
  const contract =
    result && result.contractValue
      ? `${result.contractCurrency || "USD"} ${formatNumber(result.contractValue)}`
      : "";
  const accent = row.division
    ? getDivisionColor(row.division)
    : "var(--primary-accent)";

  return (
    <div
      className={styles.card}
      style={{ "--card-accent": accent } as React.CSSProperties}
      role="button"
      tabIndex={0}
      aria-label={`Open ${row.bidNumber}`}
      onClick={() => onOpen(bid)}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(bid);
        }
      }}
    >
      <div className={styles.header}>
        <span className={styles.bidNumber}>{row.bidNumber}</span>
        {bid.crmNumber && (
          <span className={styles.crm}>CRM {bid.crmNumber}</span>
        )}
        <span className={styles.headerAction}>
          <BidFavoriteButton bid={bid} />
        </span>
      </div>

      <div>
        <div className={styles.client}>{row.client || "—"}</div>
        {row.project && <div className={styles.project}>{row.project}</div>}
      </div>

      {(row.division || row.serviceLine) && (
        <div className={styles.badgeRow}>
          {row.division && (
            <StatusBadge
              status={row.division}
              color={getDivisionColor(row.division)}
            />
          )}
          {row.serviceLine && (
            <StatusBadge
              status={row.serviceLine}
              color={getServiceLineColor(row.serviceLine)}
            />
          )}
        </div>
      )}

      {summary && (
        <p className={styles.summary} title={summary}>
          {summary}
        </p>
      )}

      <div className={styles.section}>
        <span className={styles.label}>Scope</span>
        <PastBidChips
          values={row.categories}
          accent
          emptyLabel="Not classified yet"
        />
      </div>

      <div className={styles.section}>
        <span className={styles.label}>Tags</span>
        <PastBidChips
          values={row.tags}
          max={MAX_CARD_TAGS}
          emptyLabel="No tags yet"
        />
      </div>

      <div className={styles.meta}>
        <span className={styles.label}>Creator</span>
        <span className={styles.metaValue}>{bid.creator?.name || "—"}</span>
        <span className={styles.label}>
          {engineers.length > 1 ? "Engineers" : "Engineer"}
        </span>
        <span className={styles.metaValue}>
          {engineers.length ? engineers.join(", ") : "—"}
        </span>
        <span className={styles.label}>Completed</span>
        <span className={styles.metaValue}>
          {row.completedDate ? formatDate(row.completedDate) : "—"}
        </span>
        {contract && (
          <>
            <span className={styles.label}>Contract</span>
            <span className={styles.metaValue}>{contract}</span>
          </>
        )}
        <span className={styles.label}>Knowledge Base</span>
        <span className={styles.metaBadge}>
          <PastBidKbBadge status={row.kbStatus} />
        </span>
      </div>

      <div className={styles.footer}>
        <PastBidOutcome outcome={row.outcome} pill />
        {note && (
          <span className={styles.note} title={note}>
            <Star size={11} />
            <span>{note}</span>
          </span>
        )}
      </div>
    </div>
  );
};
