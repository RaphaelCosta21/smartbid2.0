import * as React from "react";
import { FileStack, X } from "lucide-react";
import {
  ClarificationBaseType,
  IClarificationDbItem,
} from "../../models/IClarificationDb";
import { IConfigOption } from "../../models/ISystemConfig";
import { useConfigStore } from "../../stores/useConfigStore";
import { SegmentedControl } from "../insights/SegmentedControl";
import {
  activeConfigOptions,
  serviceLinesForDivision,
} from "../../utils/clarificationHelpers";
import styles from "./ClarificationEntryModal.module.scss";

interface ClarificationEntryModalProps {
  item: IClarificationDbItem;
  saving: boolean;
  onCancel: () => void;
  onSave: (item: IClarificationDbItem) => void;
}

const toDateInput = (iso: string): string => (iso ? iso.substring(0, 10) : "");

/** Keeps a stored value selectable when it is no longer in the configuration. */
function withCurrent(
  options: IConfigOption[],
  value: string,
): { value: string; label: string }[] {
  const list = options.map((o) => ({ value: o.value, label: o.label }));
  if (value && !options.some((o) => o.value === value || o.label === value)) {
    list.push({ value, label: `${value} (not in configuration)` });
  }
  return list;
}

export const ClarificationEntryModal: React.FC<
  ClarificationEntryModalProps
> = ({ item, saving, onCancel, onSave }) => {
  const config = useConfigStore((s) => s.config);
  const [form, setForm] = React.useState<IClarificationDbItem>(item);
  const [touched, setTouched] = React.useState(false);
  const fromBid = !!item.sourceBidNumber;
  const isNew = item.id === 0;

  const patch = (p: Partial<IClarificationDbItem>): void =>
    setForm((prev) => ({ ...prev, ...p }));

  const categories = withCurrent(
    activeConfigOptions(config?.clarificationCategories),
    form.category,
  );
  const clients = withCurrent(
    activeConfigOptions(config?.clientList).sort((a, b) =>
      a.label.localeCompare(b.label),
    ),
    form.client,
  );
  const divisions = withCurrent(
    activeConfigOptions(config?.divisions),
    form.division,
  );
  const serviceLines = withCurrent(
    serviceLinesForDivision(config, form.division),
    form.serviceLine,
  );

  const textMissing = !form.clarification.trim();

  const submit = (): void => {
    setTouched(true);
    if (textMissing) return;
    onSave(form);
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
        aria-labelledby="clar-entry-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <h2 id="clar-entry-title" className={styles.title}>
              {isNew ? "Add Entry" : "Edit Entry"}
            </h2>
            <p className={styles.subtitle}>
              Clarifications & Qualifications library, reused when preparing
              new BIDs.
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
                Division and Service Line follow the BID, and the text fields
                are overwritten if the BID is completed again.
              </span>
            </div>
          )}

          <div className={styles.grid}>
            <div className={styles.field}>
              <span className={styles.label}>Type</span>
              <SegmentedControl<ClarificationBaseType>
                size="sm"
                className={styles.typeToggle}
                value={form.baseType}
                segments={[
                  { value: "Clarification", label: "Clarification" },
                  { value: "Qualification", label: "Qualification" },
                ]}
                onChange={(v) => patch({ baseType: v })}
                ariaLabel="Entry type"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="clar-category">
                Category
              </label>
              <select
                id="clar-category"
                className={styles.input}
                value={form.category}
                onChange={(e) => patch({ category: e.target.value })}
              >
                <option value="">Not set</option>
                {categories.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <span className={styles.hint}>
                  Add categories in System Configuration - Clarif. Categories.
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="clar-client">
                Client
              </label>
              <select
                id="clar-client"
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
              <label className={styles.label} htmlFor="clar-ref">
                Client Doc Ref
              </label>
              <input
                id="clar-ref"
                className={styles.input}
                value={form.clientDocRef}
                placeholder="e.g. ET-3010-001 rev B, item 4.2"
                onChange={(e) => patch({ clientDocRef: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="clar-division">
                Division
              </label>
              <select
                id="clar-division"
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
              <label className={styles.label} htmlFor="clar-sl">
                Service Line
              </label>
              <select
                id="clar-sl"
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
            <label className={styles.label} htmlFor="clar-topic">
              ET&apos;s Topic
            </label>
            <textarea
              id="clar-topic"
              className={styles.textarea}
              rows={2}
              value={form.etTopic}
              placeholder="Requirement or topic from the client technical specification"
              onChange={(e) => patch({ etTopic: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="clar-text">
              {form.baseType} text <span className={styles.required}>*</span>
            </label>
            <textarea
              id="clar-text"
              className={`${styles.textarea} ${touched && textMissing ? styles.invalid : ""}`}
              rows={4}
              value={form.clarification}
              onChange={(e) => patch({ clarification: e.target.value })}
            />
            {touched && textMissing && (
              <span className={styles.error}>
                Enter the {form.baseType.toLowerCase()} text.
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="clar-reply">
              Client Reply
            </label>
            <textarea
              id="clar-reply"
              className={styles.textarea}
              rows={3}
              value={form.clientReply}
              onChange={(e) => patch({ clientReply: e.target.value })}
            />
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="clar-keyword">
                Keyword
              </label>
              <input
                id="clar-keyword"
                className={styles.input}
                value={form.keyword}
                onChange={(e) => patch({ keyword: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="clar-date">
                Reply date
              </label>
              <input
                id="clar-date"
                type="date"
                className={styles.input}
                value={toDateInput(form.date)}
                onChange={(e) =>
                  patch({
                    date: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : "",
                  })
                }
              />
            </div>
          </div>

          <label className={styles.checkRow}>
            <input
              type="checkbox"
              checked={form.approved}
              onChange={(e) => patch({ approved: e.target.checked })}
            />
            Approved / accepted by the client
          </label>
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
            {saving ? "Saving…" : isNew ? "Add Entry" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};
