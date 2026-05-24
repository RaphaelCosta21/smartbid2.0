import * as React from "react";
import { IBid, IClarificationItem } from "../../models";
import { exportClarificationsToExcel } from "../../utils/clarificationExport";
import styles from "./ExportClarificationModal.module.scss";

export interface ExportClarificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bid: IBid;
  clarifications: IClarificationItem[];
}

type ExportMode = "all" | "selected";

export const ExportClarificationModal: React.FC<
  ExportClarificationModalProps
> = ({ isOpen, onClose, bid, clarifications }) => {
  const [mode, setMode] = React.useState<ExportMode>("all");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = React.useState(false);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setMode("all");
      setSelectedIds(new Set());
      setIsExporting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleItem = (id: string): void => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = (): void => {
    if (selectedIds.size === clarifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(clarifications.map((c) => c.id)));
    }
  };

  const handleExport = async (): Promise<void> => {
    setIsExporting(true);
    try {
      const items =
        mode === "all"
          ? clarifications
          : clarifications.filter((c) => selectedIds.has(c.id));
      await exportClarificationsToExcel({ bid, items });
      onClose();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const canExport =
    mode === "all" ? clarifications.length > 0 : selectedIds.size > 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>📋 Export Clarifications</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Mode Selection */}
          <div className={styles.modeSelector}>
            <button
              className={`${styles.modeBtn} ${mode === "all" ? styles.modeBtnActive : ""}`}
              onClick={() => setMode("all")}
            >
              <span className={styles.modeIcon}>📄</span>
              Export All ({clarifications.length})
            </button>
            <button
              className={`${styles.modeBtn} ${mode === "selected" ? styles.modeBtnActive : ""}`}
              onClick={() => setMode("selected")}
            >
              <span className={styles.modeIcon}>☑️</span>
              Select Specific
            </button>
          </div>

          {/* Selection List */}
          {mode === "selected" && (
            <div className={styles.selectionList}>
              <div className={styles.selectAll}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={
                    selectedIds.size === clarifications.length &&
                    clarifications.length > 0
                  }
                  onChange={toggleAll}
                />
                <span>Select All</span>
              </div>
              {clarifications.map((c, idx) => (
                <div key={c.id} className={styles.selectionItem}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedIds.has(c.id)}
                    onChange={() => toggleItem(c.id)}
                  />
                  <span className={styles.itemNumber}>{idx + 1}</span>
                  <span className={styles.itemText}>
                    {c.item || c.description || "(No description)"}
                    {c.clarification && ` — ${c.clarification}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.selectedCount}>
            {mode === "all"
              ? `${clarifications.length} item(s) will be exported`
              : `${selectedIds.size} of ${clarifications.length} selected`}
          </span>
          <div className={styles.footerActions}>
            <button className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.exportBtn}
              onClick={handleExport}
              disabled={!canExport || isExporting}
            >
              {isExporting ? "Exporting..." : "Export Excel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
