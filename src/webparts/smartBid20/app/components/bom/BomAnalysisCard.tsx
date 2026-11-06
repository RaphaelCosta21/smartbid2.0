import * as React from "react";
import { Trash2 } from "lucide-react";
import { IBomCostAnalysis } from "../../models/IBomCostAnalysis";
import { formatCurrency, formatHours } from "../../utils/formatters";
import { formatDateDMY } from "../../utils/bomCostHelpers";
import styles from "./BomAnalysisCard.module.scss";

export interface IBomAnalysisCardProps {
  analysis: IBomCostAnalysis;
  /** Live coverage of the saved items (Costed counter) */
  costed: number;
  eligible: number;
  isComplete: boolean;
  /** Import tax included in the total (USD) */
  importTax?: number;
  /** Workshop hours (assembly & test) per unit */
  workshopHours?: number;
  onOpen: () => void;
  onDelete?: () => void;
}

export const BomAnalysisCard: React.FC<IBomAnalysisCardProps> = ({
  analysis,
  costed,
  eligible,
  isComplete,
  importTax = 0,
  workshopHours = 0,
  onOpen,
  onDelete,
}) => {
  const pct = eligible > 0 ? Math.round((costed / eligible) * 100) : 0;
  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div className={styles.header}>
        <span className={styles.pn} title={analysis.mainPartNumber}>
          {analysis.mainPartNumber}
        </span>
        {analysis.revision && (
          <span className={styles.chip}>Rev {analysis.revision}</span>
        )}
        <span
          className={`${styles.status} ${isComplete ? styles.statusOk : styles.statusWarn}`}
        >
          {isComplete ? "Complete" : "Incomplete"}
        </span>
      </div>

      <div className={styles.desc}>{analysis.mainDescription || "-"}</div>

      <div className={styles.progress}>
        <div className={styles.progressHead}>
          <span>Costed</span>
          <strong>
            {costed} / {eligible}
          </strong>
        </div>
        <div className={styles.track}>
          <div
            className={`${styles.fill} ${isComplete ? styles.fillOk : ""}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Items</span>
          <span className={styles.statValue}>{analysis.items.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total</span>
          <span className={styles.statValue}>
            {formatCurrency(analysis.totalCostUSD || 0, "USD")}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Max LT</span>
          <span className={styles.statValue}>
            {analysis.maxLeadTimeDays > 0
              ? `${analysis.maxLeadTimeDays}d`
              : "-"}
          </span>
        </div>
      </div>

      {(importTax > 0 || workshopHours > 0) && (
        <div className={styles.extras}>
          {importTax > 0 && (
            <span
              className={styles.extraChip}
              title="Import tax on Global BU prices, included in the Total"
            >
              Import tax {analysis.importTaxPercent || 0}% ·{" "}
              {formatCurrency(importTax, "USD")}
            </span>
          )}
          {workshopHours > 0 && (
            <span
              className={styles.extraChip}
              title="Workshop assembly & test per unit, included in the Total"
            >
              Workshop {formatHours(workshopHours)}
            </span>
          )}
        </div>
      )}

      <div className={styles.footer}>
        <span className={styles.by}>
          {analysis.createdBy || "-"} · {formatDateDMY(analysis.lastModified)}
        </span>
        {onDelete && (
          <button
            type="button"
            className={styles.deleteBtn}
            title="Delete analysis"
            aria-label="Delete analysis"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
