import * as React from "react";
import { IBidTemplate } from "../../models/IBidTemplate";
import styles from "./BidTemplateImport.module.scss";

interface BidTemplateImportProps {
  isOpen: boolean;
  templates: IBidTemplate[];
  onImport: (template: IBidTemplate) => void;
  onClose: () => void;
}

export const BidTemplateImport: React.FC<BidTemplateImportProps> = ({
  isOpen,
  templates,
  onImport,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Import Template</h3>
        {templates.length === 0 ? (
          <div className={styles.empty}>No templates available</div>
        ) : (
          <div className={styles.list}>
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onImport(template)}
                className={styles.templateBtn}
              >
                <div>
                  <div className={styles.templateName}>{template.name}</div>
                  <div className={styles.templateMeta}>
                    {template.division} ·{" "}
                    {
                      (template.scopeItems || []).filter((i) => !i.isSection)
                        .length
                    }{" "}
                    items
                  </div>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        )}
        <button onClick={onClose} className={styles.cancelBtn}>
          Cancel
        </button>
      </div>
    </div>
  );
};
