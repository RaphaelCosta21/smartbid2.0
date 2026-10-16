import * as React from "react";
import { Sparkles, X } from "lucide-react";
import { IBid } from "../../models";
import { IPastBidProfileSuggestion } from "../../models/IAIAnalysis";
import { PastBidProfileFields } from "../../services/PastBidKnowledgeService";
import { mergeUnique } from "../../utils/pastBidDocument";
import styles from "./PastBidProfileModal.module.scss";

interface PastBidProfileModalProps {
  bid: IBid;
  /** Active scope categories from System Config */
  scopeCategoryOptions: string[];
  /** Tags already used by other Past Bids — keeps spelling consistent */
  tagSuggestions: string[];
  saving: boolean;
  onCancel: () => void;
  onSave: (fields: PastBidProfileFields) => void;
  onSuggest: () => Promise<IPastBidProfileSuggestion>;
}

const SUMMARY_MAX = 600;
const TAG_MAX = 40;

export const PastBidProfileModal: React.FC<PastBidProfileModalProps> = ({
  bid,
  scopeCategoryOptions,
  tagSuggestions,
  saving,
  onCancel,
  onSave,
  onSuggest,
}) => {
  const profile = bid.knowledgeProfile;
  const [categories, setCategories] = React.useState<string[]>(
    profile ? profile.scopeCategories : [],
  );
  const [tags, setTags] = React.useState<string[]>(profile ? profile.tags : []);
  const [summary, setSummary] = React.useState(profile ? profile.summary : "");
  const [tagInput, setTagInput] = React.useState("");
  const [suggesting, setSuggesting] = React.useState(false);
  const [aiMessage, setAiMessage] = React.useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);

  // Keep categories saved before an option was removed from System Config.
  const categoryOptions = React.useMemo(
    () => mergeUnique(scopeCategoryOptions, categories),
    [scopeCategoryOptions, categories],
  );
  const datalistId = `past-bid-tags-${bid.bidNumber.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const toggleCategory = (value: string): void => {
    setCategories((prev) =>
      prev.indexOf(value) >= 0
        ? prev.filter((c) => c !== value)
        : prev.concat(value),
    );
  };

  const addTag = (raw: string): void => {
    const value = raw.replace(/\s+/g, " ").trim().substring(0, TAG_MAX);
    if (value) setTags((prev) => mergeUnique(prev, [value]));
    setTagInput("");
  };

  const onTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const handleSuggest = async (): Promise<void> => {
    setSuggesting(true);
    setAiMessage(null);
    try {
      const s = await onSuggest();
      if (s.scopeCategories.length) setCategories(s.scopeCategories);
      setTags((prev) => mergeUnique(prev, s.tags));
      if (s.summary) setSummary(s.summary);
      setAiMessage({
        type: "ok",
        text: "AI suggestions applied. Review them before saving.",
      });
    } catch (err) {
      setAiMessage({
        type: "error",
        text:
          (err instanceof Error ? err.message : String(err)) ||
          "The AI could not suggest a classification.",
      });
    } finally {
      setSuggesting(false);
    }
  };

  const handleSave = (): void => {
    const pending = tagInput.trim();
    onSave({
      scopeCategories: categories,
      tags: pending ? mergeUnique(tags, [pending]) : tags,
      summary: summary.trim(),
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
        aria-labelledby="past-bid-profile-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <h2 id="past-bid-profile-title" className={styles.title}>
              Classify {bid.bidNumber}
            </h2>
            <p className={styles.subtitle}>
              Scope categories and tags drive the Past Bids filters and the AI
              Search. Saving republishes the knowledge document.
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
          <div className={styles.aiRow}>
            <button
              type="button"
              className={styles.aiBtn}
              onClick={handleSuggest}
              disabled={suggesting || saving}
            >
              <Sparkles size={14} />
              {suggesting ? "Asking AI…" : "Suggest with AI"}
            </button>
            {aiMessage && (
              <span
                className={
                  aiMessage.type === "ok" ? styles.aiOk : styles.aiError
                }
              >
                {aiMessage.text}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Scope categories</span>
            {categoryOptions.length === 0 ? (
              <span className={styles.hint}>
                No scope categories configured. Add them in System Configuration
                → Scope Categories.
              </span>
            ) : (
              <div className={styles.categoryGrid}>
                {categoryOptions.map((c) => {
                  const active = categories.indexOf(c) >= 0;
                  return (
                    <button
                      type="button"
                      key={c}
                      className={`${styles.categoryChip} ${active ? styles.categoryChipActive : ""}`}
                      aria-pressed={active}
                      onClick={() => toggleCategory(c)}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${datalistId}-input`}>
              Tags
            </label>
            <div className={styles.tagBox}>
              {tags.map((t) => (
                <span key={t} className={styles.tag}>
                  {t}
                  <button
                    type="button"
                    className={styles.tagRemove}
                    onClick={() =>
                      setTags((prev) => prev.filter((x) => x !== t))
                    }
                    aria-label={`Remove ${t}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                id={`${datalistId}-input`}
                className={styles.tagInput}
                value={tagInput}
                list={datalistId}
                placeholder={tags.length ? "" : "e.g. Defender, Multibeam…"}
                maxLength={TAG_MAX}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={onTagKeyDown}
                onBlur={() => tagInput.trim() && addTag(tagInput)}
              />
              <datalist id={datalistId}>
                {tagSuggestions
                  .filter((s) => tags.indexOf(s) < 0)
                  .map((s) => (
                    <option key={s} value={s} />
                  ))}
              </datalist>
            </div>
            <span className={styles.hint}>
              Press Enter or comma to add. Use equipment, systems and operations
              (not client names).
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="past-bid-summary">
              Summary
            </label>
            <textarea
              id="past-bid-summary"
              className={styles.textarea}
              value={summary}
              maxLength={SUMMARY_MAX}
              rows={3}
              onChange={(e) => setSummary(e.target.value)}
            />
            <span className={styles.hint}>
              {summary.length}/{SUMMARY_MAX}
            </span>
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
            onClick={handleSave}
            disabled={saving || suggesting}
          >
            {saving ? "Publishing…" : "Save & publish"}
          </button>
        </div>
      </div>
    </div>
  );
};
