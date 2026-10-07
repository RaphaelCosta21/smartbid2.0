import * as React from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ClipboardPaste,
  FileStack,
  Info,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  IQualificationDbItem,
  IQualificationTableChanges,
} from "../../models/IQualificationDb";
import { IConfigOption } from "../../models/ISystemConfig";
import { useConfigStore } from "../../stores/useConfigStore";
import {
  activeConfigOptions,
  serviceLinesForDivision,
  withCurrentOption,
} from "../../utils/clarificationHelpers";
import {
  buildQualificationTableChanges,
  findManualQualificationTableKey,
  IQualificationTableDraftRow,
  isManualQualificationTableKey,
  newManualQualificationTableKey,
  nextLibraryItemOrder,
  qualificationCategoryValue,
  qualificationLibraryTableRows,
} from "../../utils/qualificationHelpers";
import { makeId } from "../../utils/idGenerator";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { SuggestionInput } from "../common/SuggestionInput";
import { QualificationCategoryInput } from "./QualificationCategoryInput";
import shell from "./ClarificationEntryModal.module.scss";
import styles from "./QualificationTableModal.module.scss";

interface QualificationTableModalProps {
  /** Whole library, to load the table and detect existing titles */
  items: IQualificationDbItem[];
  /** Library table to edit; omitted to add qualifications to a new or existing table */
  tableKey?: string;
  /** Table titles already in the library, suggested in the Table field */
  tableTitles: string[];
  saving: boolean;
  onCancel: () => void;
  onSave: (changes: IQualificationTableChanges) => void;
}

interface ITableMeta {
  title: string;
  client: string;
  division: string;
  serviceLine: string;
}

const newRow = (
  category = "",
  qualification = "",
): IQualificationTableDraftRow => ({
  uid: makeId("qr"),
  category,
  qualification,
});

const toDraftRows = (
  rows: IQualificationDbItem[],
): IQualificationTableDraftRow[] =>
  rows.map((r) => ({
    uid: `row-${r.id}`,
    original: r,
    category: r.category,
    qualification: r.qualification,
  }));

/** Table-level values; a BID row wins because those follow the BID. */
const metaOf = (rows: IQualificationDbItem[]): ITableMeta => {
  const base = rows.find((r) => !!r.sourceBidNumber) || rows[0];
  return base
    ? {
        title: base.tableTitle,
        client: base.client,
        division: base.division,
        serviceLine: base.serviceLine,
      }
    : { title: "", client: "", division: "", serviceLine: "" };
};

const sameMeta = (a: ITableMeta, b: ITableMeta): boolean =>
  a.title.trim() === b.title.trim() &&
  a.client === b.client &&
  a.division === b.division &&
  a.serviceLine === b.serviceLine;

const isBlank = (r: IQualificationTableDraftRow): boolean =>
  !r.original && !r.category.trim() && !r.qualification.trim();

const LIST_MARKER =
  /^\s*(?:[-*\u2022\u25aa\u25cf\u2013]|\(?\d{1,3}[.)]|\(?[a-zA-Z][.)])\s+/;

/** One row per line; Excel rows (tab separated) read as Category + Qualification. */
function parsePastedRows(
  text: string,
  categories: IConfigOption[],
  defaultCategory: string,
): IQualificationTableDraftRow[] {
  const rows: IQualificationTableDraftRow[] = [];
  text.split(/\r?\n/).forEach((line) => {
    const cells = line
      .split("\t")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cells.length > 1 && /^\d+[.)]?$/.test(cells[0])) cells.shift();
    if (cells.length === 0) return;
    const multi = cells.length > 1;
    const qualification = (multi ? cells.slice(1).join(" ") : cells[0])
      .replace(LIST_MARKER, "")
      .trim();
    if (!qualification) return;
    rows.push(
      newRow(
        multi
          ? qualificationCategoryValue(categories, cells[0])
          : defaultCategory,
        qualification,
      ),
    );
  });
  return rows;
}

const autoGrow = (el: HTMLTextAreaElement): void => {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
};

const plural = (n: number, word: string): string =>
  `${n} ${word}${n === 1 ? "" : "s"}`;

/** Multi-row editor of one Qualifications Database table (new, appended or existing). */
export const QualificationTableModal: React.FC<
  QualificationTableModalProps
> = ({ items, tableKey, tableTitles, saving, onCancel, onSave }) => {
  const config = useConfigStore((s) => s.config);
  const categoryOptions = React.useMemo(
    () => activeConfigOptions(config?.qualificationCategories),
    [config],
  );

  const [editKey, setEditKey] = React.useState(tableKey || "");
  const existing = React.useMemo(
    () => (editKey ? qualificationLibraryTableRows(items, editKey) : []),
    [items, editKey],
  );
  const initialMeta = React.useMemo(() => metaOf(existing), [existing]);

  const [meta, setMeta] = React.useState<ITableMeta>(initialMeta);
  const [rows, setRows] = React.useState<IQualificationTableDraftRow[]>(() =>
    existing.length > 0 ? toDraftRows(existing) : [newRow()],
  );
  const [deletedIds, setDeletedIds] = React.useState<number[]>([]);
  const [touched, setTouched] = React.useState(false);
  const [pasteOpen, setPasteOpen] = React.useState(false);
  const [pasteText, setPasteText] = React.useState("");
  const [pasteCategory, setPasteCategory] = React.useState("");
  const [confirmDiscard, setConfirmDiscard] = React.useState(false);
  const newKey = React.useRef(newManualQualificationTableKey()).current;
  const focusUid = React.useRef("");
  const textRefs = React.useRef<Record<string, HTMLTextAreaElement | null>>({});

  const isEdit = !!editKey;
  const isBidTable = isEdit && !isManualQualificationTableKey(editKey);
  const bidRow = existing.find((r) => !!r.sourceBidNumber);
  const bidNumber = isBidTable
    ? bidRow
      ? bidRow.sourceBidNumber
      : editKey.split(":")[1] || ""
    : "";

  // Adding with the title of a manual table appends to it.
  const appendKey = isEdit
    ? ""
    : findManualQualificationTableKey(items, meta.title);
  const appendRows = React.useMemo(
    () => (appendKey ? qualificationLibraryTableRows(items, appendKey) : []),
    [items, appendKey],
  );
  const appendMeta = appendRows.length > 0 ? metaOf(appendRows) : null;
  const tableMeta = appendMeta || meta;
  const metaLocked = isBidTable || !!appendMeta;

  const titleClash =
    isEdit &&
    !isBidTable &&
    (() => {
      const key = findManualQualificationTableKey(items, meta.title);
      return !!key && key !== editKey;
    })();
  const mixedMeta =
    isEdit &&
    existing.some(
      (r) =>
        !r.sourceBidNumber &&
        (r.client !== initialMeta.client ||
          r.division !== initialMeta.division ||
          r.serviceLine !== initialMeta.serviceLine),
    );

  const clients = withCurrentOption(
    activeConfigOptions(config?.clientList).sort((a, b) =>
      a.label.localeCompare(b.label),
    ),
    tableMeta.client,
  );
  const divisions = withCurrentOption(
    activeConfigOptions(config?.divisions),
    tableMeta.division,
  );
  const serviceLines = withCurrentOption(
    serviceLinesForDivision(config, tableMeta.division),
    tableMeta.serviceLine,
  );

  const firstNumber =
    !isEdit && appendRows.length > 0 ? nextLibraryItemOrder(appendRows) : 1;
  const changes = buildQualificationTableChanges({
    tableKey: isEdit ? editKey : appendKey || newKey,
    title: tableMeta.title,
    client: tableMeta.client,
    division: tableMeta.division,
    serviceLine: tableMeta.serviceLine,
    rows,
    deletedIds,
    firstOrder: firstNumber,
  });

  const added = changes.create.length;
  const edited = rows.filter(
    (r) =>
      r.original &&
      (r.category.trim() !== r.original.category ||
        r.qualification.trim() !== r.original.qualification),
  ).length;
  const keptIds = rows
    .filter((r) => r.original)
    .map((r) => (r.original ? r.original.id : 0));
  const reordered =
    keptIds.join(",") !==
    existing
      .map((r) => r.id)
      .filter((id) => deletedIds.indexOf(id) < 0)
      .join(",");
  const metaChanged = isEdit && !isBidTable && !sameMeta(meta, initialMeta);
  const dirty = isEdit
    ? added > 0 ||
      edited > 0 ||
      deletedIds.length > 0 ||
      reordered ||
      metaChanged
    : added > 0 || !!meta.title.trim();

  const titleMissing = !tableMeta.title.trim();
  const emptyExisting = rows.filter(
    (r) => r.original && !r.qualification.trim(),
  );
  const noRows = !isEdit && added === 0;

  React.useEffect(() => {
    const uid = focusUid.current;
    if (!uid) return;
    focusUid.current = "";
    const el = textRefs.current[uid];
    if (el) el.focus();
  }, [rows]);

  const requestClose = (): void => {
    if (saving) return;
    if (dirty) setConfirmDiscard(true);
    else onCancel();
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && !confirmDiscard) requestClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const insertRow = (index: number): void => {
    const row = newRow();
    focusUid.current = row.uid;
    setRows((prev) => prev.slice(0, index).concat([row], prev.slice(index)));
  };

  const patchRow = (
    uid: string,
    p: Partial<IQualificationTableDraftRow>,
  ): void =>
    setRows((prev) => prev.map((r) => (r.uid === uid ? { ...r, ...p } : r)));

  const removeRow = (row: IQualificationTableDraftRow): void => {
    if (row.original) {
      const id = row.original.id;
      setDeletedIds((prev) => prev.concat([id]));
    }
    setRows((prev) => prev.filter((r) => r.uid !== row.uid));
  };

  const moveRow = (index: number, delta: number): void =>
    setRows((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const next = prev.slice();
      const moved = next.splice(index, 1)[0];
      next.splice(target, 0, moved);
      return next;
    });

  const pasted = React.useMemo(
    () => parsePastedRows(pasteText, categoryOptions, pasteCategory),
    [pasteText, categoryOptions, pasteCategory],
  );

  const addPasted = (): void => {
    if (pasted.length === 0) return;
    setRows((prev) => {
      const next = prev.slice();
      while (next.length > 0 && isBlank(next[next.length - 1])) next.pop();
      return next.concat(pasted);
    });
    setPasteText("");
    setPasteOpen(false);
  };

  const editExisting = (): void => {
    if (!appendKey) return;
    setEditKey(appendKey);
    setMeta(metaOf(appendRows));
    setRows(toDraftRows(appendRows).concat(rows.filter((r) => !isBlank(r))));
  };

  const submit = (): void => {
    setTouched(true);
    if (titleMissing || emptyExisting.length > 0 || noRows) return;
    if (!dirty) {
      onCancel();
      return;
    }
    onSave(changes);
  };

  const summary = isEdit
    ? [
        added > 0 ? `${added} new` : "",
        edited > 0 ? `${edited} edited` : "",
        deletedIds.length > 0 ? `${deletedIds.length} removed` : "",
        reordered ? "order changed" : "",
        metaChanged ? "table details changed" : "",
      ]
        .filter(Boolean)
        .join(", ") || "No changes yet"
    : added > 0
      ? `${plural(added, "qualification")} to add`
      : "";

  return (
    <>
      <div className={shell.overlay} onClick={requestClose} role="presentation">
        <div
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="qual-table-title"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={shell.header}>
            <div>
              <h2 id="qual-table-title" className={shell.title}>
                {isEdit ? "Edit Qualification Table" : "Add Qualifications"}
              </h2>
              <p className={shell.subtitle}>
                {isEdit
                  ? `${plural(existing.length, "qualification")} in this table. Edit, reorder, remove or add rows.`
                  : "Add several qualifications at once to a new table, or to an existing table of the library."}
              </p>
            </div>
            <button
              type="button"
              className={shell.closeBtn}
              onClick={requestClose}
              disabled={saving}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className={shell.body}>
            {isBidTable && (
              <div className={shell.sourceNote}>
                <FileStack size={15} />
                <span>
                  Table synced from BID <strong>{bidNumber}</strong>. Title,
                  Client, Division and Service Line follow the BID, and rows
                  synced from it are overwritten if the BID is completed again.
                  Rows added here are saved as manual entries of this table.
                </span>
              </div>
            )}
            {appendMeta && (
              <div className={shell.sourceNote}>
                <Info size={15} />
                <span className={styles.noteBody}>
                  <strong>{appendMeta.title}</strong> already has{" "}
                  {plural(appendRows.length, "qualification")}. The rows below
                  are added after them, with the table&apos;s Client, Division
                  and Service Line.
                </span>
                <button
                  type="button"
                  className={styles.noteAction}
                  onClick={editExisting}
                >
                  Edit existing rows
                </button>
              </div>
            )}
            {mixedMeta && (
              <div className={styles.warnNote}>
                <AlertTriangle size={15} />
                <span>
                  Rows of this table have different Client, Division or Service
                  Line values. Saving applies the values below to all manual
                  rows.
                </span>
              </div>
            )}

            <div className={styles.metaGrid}>
              <div className={shell.field}>
                <label className={shell.label} htmlFor="qual-table-name">
                  Table <span className={shell.required}>*</span>
                </label>
                {isBidTable ? (
                  <input
                    id="qual-table-name"
                    className={shell.input}
                    value={meta.title}
                    disabled
                  />
                ) : (
                  <SuggestionInput
                    id="qual-table-name"
                    className={`${shell.input} ${touched && titleMissing ? shell.invalid : ""}`}
                    value={meta.title}
                    suggestions={tableTitles}
                    customHint="New table"
                    placeholder="e.g. Qualifications to CLIENT"
                    autoFocus={!isEdit}
                    onChange={(v) => setMeta((m) => ({ ...m, title: v }))}
                  />
                )}
                {touched && titleMissing && (
                  <span className={shell.error}>Enter the table title.</span>
                )}
                {titleClash && (
                  <span className={shell.hint}>
                    Another library table already uses this title.
                  </span>
                )}
              </div>
              <div className={shell.field}>
                <label className={shell.label} htmlFor="qual-table-client">
                  Client
                </label>
                <select
                  id="qual-table-client"
                  className={shell.input}
                  value={tableMeta.client}
                  disabled={metaLocked}
                  onChange={(e) => {
                    const client = e.target.value;
                    setMeta((m) => ({ ...m, client }));
                  }}
                >
                  <option value="">Not set</option>
                  {clients.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={shell.field}>
                <label className={shell.label} htmlFor="qual-table-division">
                  Division
                </label>
                <select
                  id="qual-table-division"
                  className={shell.input}
                  value={tableMeta.division}
                  disabled={metaLocked}
                  onChange={(e) => {
                    const division = e.target.value;
                    setMeta((m) => ({ ...m, division, serviceLine: "" }));
                  }}
                >
                  <option value="">Not set</option>
                  {divisions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={shell.field}>
                <label className={shell.label} htmlFor="qual-table-sl">
                  Service Line
                </label>
                <select
                  id="qual-table-sl"
                  className={shell.input}
                  value={tableMeta.serviceLine}
                  disabled={metaLocked || !tableMeta.division}
                  onChange={(e) => {
                    const serviceLine = e.target.value;
                    setMeta((m) => ({ ...m, serviceLine }));
                  }}
                >
                  <option value="">
                    {tableMeta.division ? "Not set" : "Select a division first"}
                  </option>
                  {serviceLines.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.rowsHeader}>
              <span className={styles.rowsTitle}>
                Qualifications
                <span className={styles.countBadge}>{rows.length}</span>
              </span>
              <div className={styles.rowsTools}>
                <button
                  type="button"
                  className={`${styles.toolBtn} ${pasteOpen ? styles.toolBtnActive : ""}`}
                  onClick={() => setPasteOpen((o) => !o)}
                  aria-expanded={pasteOpen}
                >
                  <ClipboardPaste size={14} /> Paste list
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => insertRow(rows.length)}
                >
                  <Plus size={14} /> Add qualification
                </button>
              </div>
            </div>

            {pasteOpen && (
              <div className={styles.pastePanel}>
                <textarea
                  className={shell.textarea}
                  rows={5}
                  autoFocus
                  value={pasteText}
                  placeholder="Paste one qualification per line. Numbering and bullets are removed."
                  aria-label="Qualifications to paste, one per line"
                  onChange={(e) => setPasteText(e.target.value)}
                />
                <div className={styles.pasteFooter}>
                  <select
                    className={`${shell.input} ${styles.pasteSelect}`}
                    value={pasteCategory}
                    aria-label="Category for the pasted rows"
                    onChange={(e) => setPasteCategory(e.target.value)}
                  >
                    <option value="">No category</option>
                    {categoryOptions.map((o) => (
                      <option key={o.id} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <span className={styles.pasteHint}>
                    Copied from Excel? Two columns (Category, Qualification)
                    fill both fields.
                  </span>
                  <button
                    type="button"
                    className={styles.pasteBtn}
                    disabled={pasted.length === 0}
                    onClick={addPasted}
                  >
                    {pasted.length > 0
                      ? `Add ${plural(pasted.length, "row")}`
                      : "Add rows"}
                  </button>
                </div>
              </div>
            )}

            <div className={styles.rows}>
              <div className={styles.rowsHead} aria-hidden="true">
                <span>#</span>
                <span>Category</span>
                <span>Qualification</span>
                <span />
              </div>
              {rows.length === 0 && (
                <div className={styles.emptyRows}>
                  No qualifications in this table. Add a row or paste a list.
                </div>
              )}
              {rows.map((r, i) => {
                const invalid =
                  touched && !!r.original && !r.qualification.trim();
                const manualInBid =
                  isBidTable && !!r.original && !r.original.sourceBidNumber;
                return (
                  <div
                    key={r.uid}
                    className={`${styles.row} ${isEdit && !r.original ? styles.rowNew : ""} ${invalid ? styles.rowInvalid : ""}`}
                  >
                    <div className={styles.itemNo}>
                      <span>{firstNumber + i}</span>
                      {isEdit && !r.original && (
                        <span className={`${styles.tag} ${styles.tagNew}`}>
                          New
                        </span>
                      )}
                      {manualInBid && (
                        <span
                          className={`${styles.tag} ${styles.tagManual}`}
                          title="Added manually, not synced from the BID"
                        >
                          Manual
                        </span>
                      )}
                    </div>
                    <div>
                      <QualificationCategoryInput
                        className={styles.cellInput}
                        value={r.category}
                        placeholder="Category"
                        onChange={(v) => patchRow(r.uid, { category: v })}
                      />
                    </div>
                    <div>
                      <textarea
                        ref={(el) => {
                          textRefs.current[r.uid] = el;
                          if (el) autoGrow(el);
                        }}
                        className={`${styles.cellTextarea} ${invalid ? styles.cellInvalid : ""}`}
                        rows={1}
                        value={r.qualification}
                        placeholder="Statement for the proposal (assumption, exclusion, responsibility...)"
                        aria-label={`Qualification ${firstNumber + i}`}
                        onChange={(e) => {
                          autoGrow(e.target);
                          patchRow(r.uid, { qualification: e.target.value });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault();
                            insertRow(i + 1);
                          }
                        }}
                      />
                      {invalid && (
                        <div className={styles.cellError}>
                          Enter the qualification or remove the row.
                        </div>
                      )}
                    </div>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        title="Move up"
                        aria-label="Move up"
                        disabled={i === 0}
                        onClick={() => moveRow(i, -1)}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        title="Move down"
                        aria-label="Move down"
                        disabled={i === rows.length - 1}
                        onClick={() => moveRow(i, 1)}
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                        title="Remove row"
                        aria-label="Remove row"
                        onClick={() => removeRow(r)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
              <button
                type="button"
                className={styles.addRowBtn}
                onClick={() => insertRow(rows.length)}
              >
                <Plus size={14} /> Add qualification
              </button>
            </div>

            <div className={styles.kbdHint}>
              <kbd>Ctrl</kbd> + <kbd>Enter</kbd> in a qualification adds a row
              below it.
            </div>
            {touched && noRows && (
              <span className={shell.error}>
                Add at least one qualification.
              </span>
            )}
          </div>

          <div className={shell.footer}>
            <span className={styles.footerSummary}>{summary}</span>
            <button
              type="button"
              className={shell.cancelBtn}
              onClick={requestClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className={shell.saveBtn}
              onClick={submit}
              disabled={saving}
            >
              {saving
                ? "Saving…"
                : isEdit
                  ? "Save table"
                  : added > 0
                    ? `Add ${plural(added, "qualification")}`
                    : "Add qualifications"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDiscard}
        title="Discard changes?"
        message="The changes made to this table will be lost."
        confirmLabel="Discard"
        variant="danger"
        onConfirm={() => {
          setConfirmDiscard(false);
          onCancel();
        }}
        onCancel={() => setConfirmDiscard(false)}
      />
    </>
  );
};
