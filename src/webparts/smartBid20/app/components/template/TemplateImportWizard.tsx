import * as React from "react";
import { IBidTemplate } from "../../models/IBidTemplate";
import styles from "./TemplateImportWizard.module.scss";

interface TemplateImportWizardProps {
  isOpen: boolean;
  templates: IBidTemplate[];
  onImport: (template: IBidTemplate) => void;
  onClose: () => void;
}

export const TemplateImportWizard: React.FC<TemplateImportWizardProps> = ({
  isOpen,
  templates,
  onImport,
  onClose,
}) => {
  const [step, setStep] = React.useState(0);
  const [selected, setSelected] = React.useState<IBidTemplate | null>(null);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            Import Template — Step {step + 1}/2
          </h3>
          <button onClick={onClose} className={styles.closeBtn}>
            ×
          </button>
        </div>

        {step === 0 && (
          <div className={styles.stepList}>
            <p className={styles.stepHint}>Select a template to import:</p>
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelected(t);
                  setStep(1);
                }}
                className={styles.templateBtn}
                style={{
                  borderColor:
                    selected?.id === t.id
                      ? "var(--accent-color)"
                      : "var(--border-subtle)",
                }}
              >
                <div className={styles.templateBtnName}>{t.name}</div>
                <div className={styles.templateBtnMeta}>
                  {t.division} · {t.equipmentItems.length} items
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 1 && selected && (
          <div>
            <p className={styles.confirmText}>
              Import <strong>{selected.name}</strong> with{" "}
              {selected.equipmentItems.length} equipment items?
            </p>
            <div className={styles.confirmActions}>
              <button onClick={() => setStep(0)} className={styles.backBtn}>
                Back
              </button>
              <button
                onClick={() => {
                  onImport(selected);
                  onClose();
                }}
                className={styles.importBtn}
              >
                Import
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
