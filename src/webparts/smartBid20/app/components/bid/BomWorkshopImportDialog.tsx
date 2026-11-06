/**
 * BomWorkshopImportDialog - Shown before a BOM with workshop (assembly & test) is brought
 * into a BID, so the user sees exactly where the hours and the cost will land.
 */
import * as React from "react";
import {
  CircleDollarSign,
  Clock,
  Info,
  TriangleAlert,
  Wrench,
  X,
} from "lucide-react";
import { formatCurrency, formatHours } from "../../utils/formatters";
import {
  IBomWorkshopImport,
  describeWorkshopCost,
} from "../../utils/bomWorkshop";
import styles from "./BomWorkshopImportDialog.module.scss";

export interface BomWorkshopImportDialogProps {
  imports: IBomWorkshopImport[];
  /** Scope item ids that already hold workshop rows (they will be replaced) */
  replacingIds?: string[];
  /** Short context line under the title */
  intro?: string;
  /** Extra explanation shown at the bottom of the list */
  footnote?: string;
  itemOnlyLabel?: string;
  onImportWithWorkshop: () => void;
  onImportItemOnly: () => void;
  onCancel: () => void;
}

const units = (n: number): string => `${n} unit${n === 1 ? "" : "s"}`;

export const BomWorkshopImportDialog: React.FC<
  BomWorkshopImportDialogProps
> = ({
  imports,
  replacingIds = [],
  intro,
  footnote,
  itemOnlyLabel = "Item only",
  onImportWithWorkshop,
  onImportItemOnly,
  onCancel,
}) => {
  const totalHours = imports.reduce((s, i) => s + i.totalHours, 0);
  const totalUSD = imports.reduce((s, i) => s + i.totalCostUSD, 0);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        // May be nested in another modal's overlay: don't close that one too
        e.stopPropagation();
        onCancel();
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bom-workshop-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <span className={styles.headerIcon}>
            <Wrench size={18} />
          </span>
          <div className={styles.headerText}>
            <h3 id="bom-workshop-dialog-title" className={styles.title}>
              Import workshop from BOM Costs?
            </h3>
            <p className={styles.intro}>
              {intro ||
                "This BOM has workshop hours / cost for assembly and test. They do not appear in Scope of Supply - they are added to the BID pages below."}
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className={styles.body}>
          {imports.map((imp) => (
            <div key={imp.scopeItemId} className={styles.item}>
              <div className={styles.itemHead}>
                <span className={styles.pn}>{imp.partNumber || "-"}</span>
                <span className={styles.desc} title={imp.description}>
                  {imp.description}
                </span>
                <span
                  className={styles.qty}
                  title="Scope quantity (Oper + Spare)"
                >
                  × {units(imp.qty)}
                </span>
              </div>

              <div className={styles.dest}>
                <span className={styles.destIcon}>
                  <Clock size={14} />
                </span>
                <span className={styles.destWhere}>
                  <strong>Hours &amp; Personnel › Onshore Hours</strong>
                  <span className={styles.destDetail}>
                    {imp.totalHours > 0
                      ? `${formatHours(imp.hoursPerUnit)} per unit × ${units(imp.qty)}` +
                        (imp.jobFunction || imp.phase
                          ? ` · ${[imp.jobFunction, imp.phase].filter(Boolean).join(" · ")}`
                          : "") +
                        " · Cost (BRL) stays 0"
                      : "No workshop hours on this BOM"}
                  </span>
                </span>
                <span className={styles.destValue}>
                  {imp.totalHours > 0 ? formatHours(imp.totalHours) : "-"}
                </span>
              </div>

              <div className={styles.dest}>
                <span className={styles.destIcon}>
                  <CircleDollarSign size={14} />
                </span>
                <span className={styles.destWhere}>
                  <strong>Assets Breakdown › Services &amp; Fees</strong>
                  <span className={styles.destDetail}>
                    {imp.totalCostUSD > 0
                      ? `${describeWorkshopCost(imp)} × ${units(imp.qty)}`
                      : "No workshop cost on this BOM"}
                  </span>
                </span>
                <span className={styles.destValue}>
                  {imp.totalCostUSD > 0
                    ? formatCurrency(imp.totalCostUSD)
                    : "-"}
                </span>
              </div>

              {replacingIds.indexOf(imp.scopeItemId) >= 0 && (
                <span className={styles.replace}>
                  <TriangleAlert size={13} /> Replaces the workshop lines
                  already imported for this item
                </span>
              )}
            </div>
          ))}

          <p className={styles.note}>
            <Info size={14} className={styles.noteIcon} />
            <span>
              {footnote ||
                "Quantities are taken now. If the item quantity changes later, import again or adjust the hours and the fee by hand."}
            </span>
          </p>
        </div>

        <div className={styles.footer}>
          <span className={styles.totals}>
            <strong>{formatHours(totalHours)}</strong> ·{" "}
            <strong>{formatCurrency(totalUSD)}</strong>
          </span>
          <button type="button" className={styles.btn} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={onImportItemOnly}
          >
            {itemOnlyLabel}
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onImportWithWorkshop}
            autoFocus
          >
            Import with workshop
          </button>
        </div>
      </div>
    </div>
  );
};
