import * as React from "react";
import { FileStack, X } from "lucide-react";
import { IQualificationDbItem } from "../../models/IQualificationDb";
import { useConfigStore } from "../../stores/useConfigStore";
import {
  activeConfigOptions,
  serviceLinesForDivision,
  withCurrentOption,
} from "../../utils/clarificationHelpers";
import { QualificationCategoryInput } from "./QualificationCategoryInput";
import { SuggestionInput } from "../common/SuggestionInput";
import styles from "./ClarificationEntryModal.module.scss";

interface QualificationEntryModalProps {
  item: IQualificationDbItem;
  saving: boolean;
  /** Table titles already in the library, suggested in the Table field */
  tableTitles: string[];
  onCancel: () => void;
  onSave: (item: IQualificationDbItem) => void;
}

export const QualificationEntryModal: React.FC<
  QualificationEntryModalProps
> = ({ item, saving, tableTitles, onCancel, onSave }) => {
  const config = useConfigStore((s) => s.config);
  const [form, setForm] = React.useState<IQualificationDbItem>(item);
  const [touched, setTouched] = React.useState(false);
  const fromBid = !!item.sourceBidNumber;
  const isNew = item.id === 0;

  const patch = (p: Partial<IQualificationDbItem>): void =>
    setForm((prev) => ({ ...prev, ...p }));

  const clients = withCurrentOption(
    activeConfigOptions(config?.clientList).sort((a, b) =>
      a.label.localeCompare(b.label),
    ),
    form.client,
  );
  const divisions = withCurrentOption(
    activeConfigOptions(config?.divisions),
    form.division,
  );
  const serviceLines = withCurrentOption(
    serviceLinesForDivision(config, form.division),
    form.serviceLine,
  );

  const tableMissing = !form.tableTitle.trim();
  const textMissing = !form.qualification.trim();

  const submit = (): void => {
    setTouched(true);
    if (tableMissing || textMissing) return;
    onSave({
      ...form,
      tableTitle: form.tableTitle.trim(),
      category: form.category.trim(),
      qualification: form.qualification.trim(),
    });
  };

  return (
    <div
      className={styles.overlay}
      onClick={() => !saving && onCancel()}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qual-entry-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <h2 id="qual-entry-title" className={styles.title}>
              {isNew ? "Add Qualification" : "Edit Qualification"}
            </h2>
            <p className={styles.subtitle}>
              Qualifications library, reused as qualification tables when
              preparing new BIDs.
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onCancel}
            disabled={saving}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {fromBid && (
            <div className={styles.sourceNote}>
              <FileStack size={15} />
              <span>
                Synced from BID <strong>{item.sourceBidNumber}</strong>. Client,
                Division and Service Line follow the BID, and the other fields
                are overwritten if the BID is completed again.
              </span>
            </div>
          )}

          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="qual-table">
                Table <span className={styles.required}>*</span>
              </label>
              <SuggestionInput
                id="qual-table"
                className={`${styles.input} ${touched && tableMissing ? styles.invalid : ""}`}
                value={form.tableTitle}
                suggestions={tableTitles}
                customHint="New table"
                placeholder="e.g. Qualifications to CLIENT"
                onChange={(v) => patch({ tableTitle: v })}
              />
              {touched && tableMissing && (
                <span className={styles.error}>Enter the table title.</span>
              )}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="qual-category">
                Category
              </label>
              <QualificationCategoryInput
                id="qual-category"
                className={styles.input}
                value={form.category}
                onChange={(v) => patch({ category: v })}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="qual-client">
                Client
              </label>
              <select
                id="qual-client"
                className={styles.input}
                value={form.client}
                disabled={fromBid}
                onChange={(e) => patch({ client: e.target.value })}
              >
                <option value="">Not set</option>
                {clients.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="qual-division">
                Division
              </label>
              <select
                id="qual-division"
                className={styles.input}
                value={form.division}
                disabled={fromBid}
                onChange={(e) =>
                  patch({ division: e.target.value, serviceLine: "" })
                }
              >
                <option value="">Not set</option>
                {divisions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="qual-sl">
                Service Line
              </label>
              <select
                id="qual-sl"
                className={styles.input}
                value={form.serviceLine}
                disabled={fromBid || !form.division}
                onChange={(e) => patch({ serviceLine: e.target.value })}
              >
                <option value="">
                  {form.division ? "Not set" : "Select a division first"}
                </option>
                {serviceLines.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="qual-text">
              Qualification <span className={styles.required}>*</span>
            </label>
            <textarea
              id="qual-text"
              className={`${styles.textarea} ${touched && textMissing ? styles.invalid : ""}`}
              rows={5}
              value={form.qualification}
              placeholder="Statement for the proposal (assumption, exclusion, responsibility...)"
              onChange={(e) => patch({ qualification: e.target.value })}
            />
            {touched && textMissing && (
              <span className={styles.error}>Enter the qualification.</span>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={submit}
            disabled={saving}
          >
            {saving ? "Saving…" : isNew ? "Add Qualification" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};
