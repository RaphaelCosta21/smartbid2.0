import * as React from "react";
import { Star } from "lucide-react";
import { useStatusColors } from "../../hooks/useStatusColors";
import {
  BidDivisionFields,
  getBidTeams,
  INTEGRATED_DIVISION_LABEL,
} from "../../utils/divisionHelpers";
import { StatusBadge } from "./StatusBadge";
import styles from "./BidDivisionTag.module.scss";

export type BidDivisionTagPart = "both" | "division" | "serviceLine";

interface BidDivisionTagProps {
  bid: BidDivisionFields;
  /** "full" adds the Integrated label and spells out LEAD (headers, overview). */
  variant?: "compact" | "full";
  /** Which information to render (tables split division / service line). */
  part?: BidDivisionTagPart;
  /** Hide the division of single-division BIDs (Kanban column already conveys it). */
  hideDivision?: boolean;
  className?: string;
}

/**
 * Division + service line of a BID. INTEGRATED BIDs render one segment per
 * team (lead first, marked), each tinted with its division color.
 */
export const BidDivisionTag: React.FC<BidDivisionTagProps> = ({
  bid,
  variant = "compact",
  part = "both",
  hideDivision,
  className,
}) => {
  const { getDivisionColor, getServiceLineColor } = useStatusColors();
  const teams = getBidTeams(bid);
  const rootClass = `${styles.root} ${className || ""}`;

  if (teams.length === 0) {
    const showDivision = part !== "serviceLine" && !hideDivision;
    const showServiceLine = part !== "division" && !!bid.serviceLine;
    if (!showDivision && !showServiceLine) {
      return part === "both" ? null : <span>-</span>;
    }
    return (
      <span className={rootClass}>
        {showDivision && bid.division && (
          <StatusBadge
            status={bid.division}
            color={getDivisionColor(bid.division)}
          />
        )}
        {showServiceLine && (
          <StatusBadge
            status={bid.serviceLine}
            color={getServiceLineColor(bid.serviceLine)}
          />
        )}
      </span>
    );
  }

  if (part === "serviceLine") {
    return (
      <span className={rootClass}>
        {teams.map((t) =>
          t.serviceLine ? (
            <StatusBadge
              key={t.division}
              status={t.serviceLine}
              color={getServiceLineColor(t.serviceLine)}
            />
          ) : null,
        )}
      </span>
    );
  }

  const full = variant === "full";
  const title = teams
    .map(
      (t) =>
        `${t.division}${t.serviceLine ? ` · ${t.serviceLine}` : ""}${t.isLead ? " (Lead)" : ""}`,
    )
    .join(" + ");

  return (
    <span className={rootClass}>
      {full && (
        <span className={styles.integratedLabel}>
          {INTEGRATED_DIVISION_LABEL}
        </span>
      )}
      <span
        className={styles.teamTag}
        title={`${INTEGRATED_DIVISION_LABEL}: ${title}`}
      >
        {teams.map((t) => (
          <span
            key={t.division}
            className={`${styles.segment} ${t.isLead ? styles.segmentLead : ""}`}
            style={
              { "--team-color": getDivisionColor(t.division) } as React.CSSProperties
            }
          >
            {t.isLead &&
              (full ? (
                <span className={styles.leadLabel}>Lead</span>
              ) : (
                <Star size={9} className={styles.leadStar} aria-label="Lead" />
              ))}
            <span className={styles.segmentDivision}>{t.division}</span>
            {part === "both" && t.serviceLine && (
              <span className={styles.segmentLine}>{t.serviceLine}</span>
            )}
          </span>
        ))}
      </span>
    </span>
  );
};
