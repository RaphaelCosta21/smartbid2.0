/**
 * QualificationSuggestionsModal — Review panel for AI-suggested qualification
 * tables. Whole tables or single rows can be accepted; the caller merges them
 * into the BID tables by title.
 */
import * as React from "react";
import { Sparkles, X } from "lucide-react";
import { IAISuggestedQualification } from "../../models";
import {
  findQualificationTable,
  qualificationTableKey,
} from "../../utils/qualificationHelpers";
import { IQualificationTable } from "../../models/IBid";
import {
  IQualificationPickGroup,
  QualificationGroupList,
} from "./QualificationGroupList";
import shared from "./ImportClarificationModal.module.scss";
import styles from "./QualificationSuggestionsModal.module.scss";

export interface QualificationSuggestionsModalProps {
  suggestions: IAISuggestedQualification[];
  /** When true, shows a loading state (request in flight). */
  loading?: boolean;
  /** Current BID tables, to tell new tables from existing ones */
  tables: IQualificationTable[];
  onAccept: (accepted: IAISuggestedQualification[]) => void;
  onClose: () => void;
}

export const QualificationSuggestionsModal: React.FC<
  QualificationSuggestionsModalProps
> = ({ suggestions, loading, tables, onAccept, onClose }) => {
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const init: Record<string, boolean> = {};
    suggestions.forEach((_, i) => {
      init[String(i)] = true;
    });
    setSelected(init);
  }, [suggestions]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const groups = React.useMemo<IQualificationPickGroup[]>(() => {
    const byKey: Record<string, IQualificationPickGroup> = {};
    const list: IQualificationPickGroup[] = [];
    suggestions.forEach((s, i) => {
      const key = qualificationTableKey(s.tableTitle);
      let group = byKey[key];
      if (!group) {
        const existing = findQualificationTable(tables, s.tableTitle);
        group = {
          key,
          title: existing ? existing.title : s.tableTitle,
          meta: (
            <span
              className={`${styles.tableChip} ${existing ? "" : styles.tableChipNew}`}
            >
              {existing ? "Adds to existing table" : "New table"}
            </span>
          ),
          rows: [],
        };
        byKey[key] = group;
        list.push(group);
      }
      group.rows.push({
        id: String(i),
        category: s.category,
        qualification: s.qualification,
        note: s.rationale,
      });
    });
    return list;
  }, [suggestions, tables]);

  const accepted = suggestions.filter((_, i) => selected[String(i)]);

  return (
    <div className={shared.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.modal} ${styles.modal}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qual-ai-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={shared.header}>
          <div className={shared.headerMain}>
            <span className={shared.iconTile}>
              <Sparkles size={18} />
            </span>
            <div>
              <h2 id="qual-ai-title" className={shared.title}>
                AI Qualification Suggestions
              </h2>
              <p className={shared.subtitle}>
                Grounded in the Qualifications library, past BIDs and this
                BID&apos;s scope. Accept whole tables or single qualifications.
              </p>
            </div>
          </div>
          <button
            type="button"
            className={shared.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className={shared.list}>
          {loading ? (
            <div className={styles.status}>
              Analyzing requirements and past qualifications…
            </div>
          ) : suggestions.length === 0 ? (
            <div className={styles.status}>
              No qualification suggestions were returned.
            </div>
          ) : (
            <QualificationGroupList
              groups={groups}
              selected={selected}
              onChange={setSelected}
            />
          )}
        </div>

        <div className={shared.footer}>
          <span className={shared.footerInfo}>
            <strong>{accepted.length}</strong> of {suggestions.length} selected
          </span>
          <div className={shared.footerActions}>
            <button
              type="button"
              className={shared.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={shared.primaryBtn}
              onClick={() => onAccept(accepted)}
              disabled={loading || accepted.length === 0}
            >
              {`Add ${accepted.length} qualification${accepted.length === 1 ? "" : "s"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
