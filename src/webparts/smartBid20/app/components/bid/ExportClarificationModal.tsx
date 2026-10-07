import * as React from "react";
import { Check, Download, FileSpreadsheet, Search, X } from "lucide-react";
import { IBid, IClarificationItem } from "../../models";
import { useConfigStore } from "../../stores/useConfigStore";
import { useUIStore } from "../../stores/useUIStore";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { exportClarificationsToExcel } from "../../utils/clarificationExcelExport";
import {
  allCategoryOptions,
  cleanClientDocRef,
  configOptionLabel,
} from "../../utils/clarificationHelpers";
import { matchesPastBidSearch, normalizeText } from "../../utils/pastBidHelpers";
import { SegmentedControl } from "../insights/SegmentedControl";
import {
  ClarificationCategoryChip,
  ClarificationTypeBadge,
} from "../knowledge/ClarificationBadges";
import styles from "./ExportClarificationModal.module.scss";

export interface ExportClarificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bid: IBid;
  clarifications: IClarificationItem[];
}

type TypeFilter = "all" | "Clarification" | "Qualification";

export const ExportClarificationModal: React.FC<
  ExportClarificationModalProps
> = ({ isOpen, onClose, bid, clarifications }) => {
  const config = useConfigStore((s) => s.config);
  const addToast = useUIStore((s) => s.addToast);
  const currentUser = useCurrentUser();
  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [isExporting, setIsExporting] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const all: Record<string, boolean> = {};
    clarifications.forEach((c) => {
      all[c.id] = true;
    });
    setSelected(all);
    setTypeFilter("all");
    setSearch("");
    setIsExporting(false);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && !isExporting) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, isExporting, onClose]);

  const rows = React.useMemo(
    () =>
      clarifications.map((c, idx) => ({
        item: c,
        number: idx + 1,
        isQual: c.baseType === "Qualification",
        ref: cleanClientDocRef(c.item),
        answered: !!(c.clientResponse || "").trim(),
        searchText: normalizeText(
          [
            c.item,
            c.description,
            c.clarification,
            c.clientResponse,
            configOptionLabel(allCategoryOptions(config), c.category || ""),
          ]
            .filter(Boolean)
            .join(" \u2022 "),
        ),
      })),
    [clarifications, config],
  );

  if (!isOpen) return null;

  const qualCount = rows.filter((r) => r.isQual).length;
  const visible = rows.filter(
    (r) =>
      (typeFilter === "all" ||
        (typeFilter === "Qualification") === r.isQual) &&
      (!search.trim() || matchesPastBidSearch(r.searchText, search)),
  );
  const selectedCount = rows.filter((r) => selected[r.item.id]).length;
  const allVisibleSelected =
    visible.length > 0 && visible.every((r) => selected[r.item.id]);

  const toggle = (id: string): void =>
    setSelected((s) => ({ ...s, [id]: !s[id] }));

  const toggleVisible = (): void =>
    setSelected((s) => {
      const next = { ...s };
      visible.forEach((r) => {
        next[r.item.id] = !allVisibleSelected;
      });
      return next;
    });

  const canExport = !isExporting && selectedCount > 0;

  const handleExport = async (): Promise<void> => {
    setIsExporting(true);
    try {
      const fileName = await exportClarificationsToExcel({
        bid,
        items: clarifications.filter((c) => selected[c.id]),
        config,
        exportedBy: currentUser.displayName || currentUser.email,
      });
      addToast({ type: "success", title: "Excel exported", message: fileName });
      onClose();
    } catch (err) {
      console.error("Clarification export failed:", err);
      addToast({
        type: "error",
        title: "Export failed",
        message: err instanceof Error ? err.message : String(err),
      });
      setIsExporting(false);
    }
  };

  const opp = bid.opportunityInfo;
  const headerMeta = [
    bid.crmNumber || bid.bidNumber,
    opp && opp.client,
    opp && opp.projectName,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className={styles.overlay}
      onClick={() => !isExporting && onClose()}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-clar-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.iconTile}>
              <FileSpreadsheet size={18} />
            </span>
            <div>
              <h2 id="export-clar-title" className={styles.title}>
                Export Clarification Form
              </h2>
              <p className={styles.subtitle}>
                {headerMeta ? `${headerMeta}. ` : ""}Excel file with the
                Oceaneering layout; the client fills in the Client Response
                column.
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isExporting}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.toolbar}>
          <SegmentedControl<TypeFilter>
            size="sm"
            value={typeFilter}
            segments={[
              { value: "all", label: `All (${rows.length})` },
              {
                value: "Clarification",
                label: `Clarifications (${rows.length - qualCount})`,
              },
              {
                value: "Qualification",
                label: `Qualifications (${qualCount})`,
              },
            ]}
            onChange={setTypeFilter}
            ariaLabel="Filter by type"
          />
          <div className={styles.search}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              aria-label="Search clarifications"
            />
          </div>
        </div>

        <div className={styles.listHead}>
          <label className={styles.selectAll}>
            <input
              type="checkbox"
              checked={allVisibleSelected}
              disabled={visible.length === 0}
              onChange={toggleVisible}
            />
            Select all shown ({visible.length})
          </label>
          <span className={styles.headHint}>
            Rows are numbered as in the BID; the Excel renumbers the selection.
          </span>
        </div>

        <div className={styles.list}>
          {visible.length === 0 ? (
            <div className={styles.empty}>No items match this filter.</div>
          ) : (
            visible.map((r) => {
              const c = r.item;
              const isSelected = !!selected[c.id];
              return (
                <div
                  key={c.id}
                  className={`${styles.row} ${isSelected ? styles.rowSelected : ""}`}
                  onClick={() => toggle(c.id)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      toggle(c.id);
                    }
                  }}
                >
                  <span
                    className={`${styles.check} ${isSelected ? styles.checkOn : ""}`}
                    aria-hidden="true"
                  >
                    {isSelected && <Check size={12} />}
                  </span>
                  <span className={styles.number}>{r.number}</span>
                  <div className={styles.rowBody}>
                    <div className={styles.rowMeta}>
                      <ClarificationTypeBadge type={c.baseType} />
                      {c.category && (
                        <ClarificationCategoryChip category={c.category} />
                      )}
                      {r.ref && (
                        <span className={styles.refChip} title="Client Doc Ref">
                          {r.ref}
                        </span>
                      )}
                      <span
                        className={`${styles.statusPill} ${r.answered ? styles.statusAnswered : styles.statusPending}`}
                      >
                        {r.answered ? "Answered" : "Pending reply"}
                      </span>
                    </div>
                    {c.description && (
                      <div className={styles.topic}>{c.description}</div>
                    )}
                    <p className={styles.text}>
                      {c.clarification || (
                        <span className={styles.muted}>
                          No clarification text yet
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.footerInfo}>
            <strong>{selectedCount}</strong> of {rows.length} selected
          </span>
          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={isExporting}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => {
                handleExport().catch(() => undefined);
              }}
              disabled={!canExport}
            >
              <Download size={14} />
              {isExporting ? "Exporting…" : "Export Excel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
