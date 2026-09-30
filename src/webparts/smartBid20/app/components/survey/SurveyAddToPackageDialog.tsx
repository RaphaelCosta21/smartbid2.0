import * as React from "react";
import { X, Minus, Plus } from "lucide-react";
import { ISurveyEquipment } from "../../models";
import styles from "./SurveyAddToPackageDialog.module.scss";

interface SurveyAddToPackageDialogProps {
  equipment: ISurveyEquipment;
  currentQty: number;
  onConfirm: (qty: number) => void;
  onClose: () => void;
}

export const SurveyAddToPackageDialog: React.FC<
  SurveyAddToPackageDialogProps
> = ({ equipment, currentQty, onConfirm, onClose }) => {
  const [qty, setQty] = React.useState(1);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`Add ${equipment.title} to bid package`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.head}>
          <div>
            <span className={styles.eyebrow}>ADD TO BID PACKAGE</span>
            <h3 className={styles.title}>{equipment.title}</h3>
            <p className={styles.desc}>
              Configure the quantity for the active bid before adding it to the
              package.
            </p>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            <X size={14} />
          </button>
        </div>

        <div className={styles.inPackage}>
          <span className={styles.dot} />
          <span>{currentQty > 0 ? `IN PACKAGE · ${currentQty}` : "NEW ITEM"}</span>
          {equipment.aliases[0] && (
            <span className={styles.alias}>{equipment.aliases[0]}</span>
          )}
          {equipment.partNumber && (
            <span className={styles.pn}>PN {equipment.partNumber}</span>
          )}
        </div>

        <div className={styles.qtyRow}>
          <div>
            <span className={styles.qtyLabel}>QUANTITY</span>
            <span className={styles.qtyHint}>Units for the package</span>
          </div>
          <div className={styles.stepper}>
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease"
              disabled={qty <= 1}
            >
              <Minus size={12} />
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">
              <Plus size={12} />
            </button>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>
            CANCEL
          </button>
          <button className={styles.confirm} onClick={() => onConfirm(qty)}>
            ADD TO PACKAGE
          </button>
        </div>
      </div>
    </div>
  );
};
