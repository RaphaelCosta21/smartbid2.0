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

/** Figma "Add to bid popup": anchored to the top-right of its positioned container. */
export const SurveyAddToPackageDialog: React.FC<
  SurveyAddToPackageDialogProps
> = ({ equipment, currentQty, onConfirm, onClose }) => {
  const [qty, setQty] = React.useState(1);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    const onDown = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    // Deferred so the click that opened the popup doesn't close it.
    const t = window.setTimeout(() => document.addEventListener("mousedown", onDown), 0);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={styles.dialog}
      role="dialog"
      aria-label={`Add ${equipment.title} to bid package`}
    >
      <div className={styles.head}>
        <div className={styles.headCopy}>
          <span className={styles.eyebrow}>ADD TO BID PACKAGE</span>
          <h3 className={styles.title}>{equipment.title}</h3>
          <p className={styles.desc}>
            Configure the quantity for the active bid before adding it to the
            package.
          </p>
        </div>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          <X size={12} />
        </button>
      </div>

      <div className={styles.context}>
        <span className={styles.dot} />
        <span className={styles.contextLabel}>
          {currentQty > 0 ? `IN PACKAGE · ${currentQty}` : "NEW ITEM"}
        </span>
        {(equipment.aliases[0] || equipment.partNumber) && (
          <span className={styles.alias}>
            {equipment.aliases[0] || `PN ${equipment.partNumber}`}
          </span>
        )}
      </div>

      <div className={styles.qtyRow}>
        <div className={styles.qtyCopy}>
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
          <span key={qty} className={styles.qtyValue}>
            {qty}
          </span>
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
  );
};
