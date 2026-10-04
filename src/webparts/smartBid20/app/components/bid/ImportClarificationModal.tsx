import * as React from "react";
import { BookOpen, Check, Search, X } from "lucide-react";
import { IBid, IClarificationItem } from "../../models";
import { IClarificationDbItem } from "../../models/IClarificationDb";
import { ClarificationDbService } from "../../services/ClarificationDbService";
import { useClarificationLibraryFilter } from "../../hooks/useClarificationLibraryFilter";
import { makeId } from "../../utils/idGenerator";
import { DivisionBadge } from "../common/DivisionBadge";
import { EmptyState } from "../common/EmptyState";
import { SkeletonLoader } from "../common/SkeletonLoader";
import { MultiSelectDropdown } from "../insights/MultiSelectDropdown";
import {
  ClarificationCategoryChip,
  ClarificationOriginChip,
  ClarificationTypeBadge,
} from "../knowledge/ClarificationBadges";
import styles from "./ImportClarificationModal.module.scss";

export interface ImportClarificationModalProps {
  bid: IBid;
  /** Rows already on the BID, to flag library entries imported before */
  existing: IClarificationItem[];
  onClose: () => void;
  onImport: (items: IClarificationItem[]) => void;
}

const PAGE_SIZE = 60;
const LONG_TEXT = 240;

/** Reply and document reference belong to the source BID, so they are not copied. */
const toClarificationItem = (db: IClarificationDbItem): IClarificationItem => ({
  id: makeId("q"),
  scopeItemId: null,
  item: "",
  description: db.etTopic,
  clarification: db.clarification,
  clientResponse: "",
  isAutoImported: false,
  baseType: db.baseType,
  createdDate: new Date().toISOString(),
  category: db.category || undefined,
  libraryRefId: db.id,
});

export const ImportClarificationModal: React.FC<
  ImportClarificationModalProps
> = ({ bid, existing, onClose, onImport }) => {
  const [items, setItems] = React.useState<IClarificationDbItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [selected, setSelected] = React.useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});
  const [visible, setVisible] = React.useState(PAGE_SIZE);

  const {
    filtered,
    options,
    search,
    setSearch,
    filters,
    setFilter,
    hasFilters,
    clear,
  } = useClarificationLibraryFilter(items);

  React.useEffect(() => {
    ClarificationDbService.getAll()
      .then((data) => {
        setItems(data);
        // Start on the BID's division only when the library already has entries for it
        if (bid.division && data.some((d) => d.division === bid.division)) {
          setFilter("division")([bid.division]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load clarifications database:", err);
        setError("Could not load the Clarif. & Qualif. library.");
        setIsLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  React.useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [filtered]);

  const alreadyIn = React.useMemo(() => {
    const map: Record<number, boolean> = {};
    existing.forEach((c) => {
      if (c.libraryRefId) map[c.libraryRefId] = true;
    });
    return map;
  }, [existing]);

  const selectable = filtered.filter((r) => !alreadyIn[r.item.id]);
  const selectedCount = Object.keys(selected).filter(
    (k) => selected[Number(k)],
  ).length;
  const allSelected =
    selectable.length > 0 && selectable.every((r) => selected[r.item.id]);

  const toggle = (id: number): void => {
    if (alreadyIn[id]) return;
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  };

  const toggleAll = (): void => {
    setSelected((s) => {
      const next = { ...s };
      selectable.forEach((r) => {
        next[r.item.id] = !allSelected;
      });
      return next;
    });
  };

  const handleImport = (): void => {
    const chosen = items
      .filter((i) => selected[i.id] && !alreadyIn[i.id])
      .map(toClarificationItem);
    if (chosen.length > 0) onImport(chosen);
    onClose();
  };

  const shown = filtered.slice(0, visible);

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-clar-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.iconTile}>
              <BookOpen size={18} />
            </span>
            <div>
              <h2 id="import-clar-title" className={styles.title}>
                Import from Clarif. & Qualif. library
              </h2>
              <p className={styles.subtitle}>
                Reuse clarifications and qualifications raised in other BIDs.
                Type, topic, text and category are copied. Client replies and
                document references stay in the library.
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.filterBar}>
          <div className={styles.filterSearch}>
            <Search size={15} className={styles.filterSearchIcon} />
            <input
              type="text"
              className={styles.filterSearchInput}
              placeholder="Search text, topic, keyword, BID…"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              aria-label="Search the library"
              autoFocus
            />
            {search && (
              <button
                type="button"
                className={styles.searchClearBtn}
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <MultiSelectDropdown
            label="Type"
            options={options.type}
            selected={filters.type}
            onChange={setFilter("type")}
          />
          <MultiSelectDropdown
            label="Category"
            options={options.category}
            selected={filters.category}
            onChange={setFilter("category")}
          />
          <MultiSelectDropdown
            label="Client"
            options={options.client}
            selected={filters.client}
            onChange={setFilter("client")}
          />
          <MultiSelectDropdown
            label="Division"
            options={options.division}
            selected={filters.division}
            onChange={setFilter("division")}
          />
          <MultiSelectDropdown
            label="Service Line"
            options={options.serviceLine}
            selected={filters.serviceLine}
            onChange={setFilter("serviceLine")}
          />
          {hasFilters && (
            <button
              type="button"
              className={styles.clearFiltersBtn}
              onClick={clear}
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>

        <div className={styles.listHead}>
          <label className={styles.selectAll}>
            <input
              type="checkbox"
              checked={allSelected}
              disabled={selectable.length === 0}
              onChange={toggleAll}
            />
            Select all matching ({selectable.length})
          </label>
          <span className={styles.resultCount}>
            <strong>{filtered.length}</strong>{" "}
            {hasFilters ? `of ${items.length} ` : ""}
            {items.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        <div className={styles.list}>
          {isLoading ? (
            <SkeletonLoader height={84} count={4} />
          ) : error ? (
            <EmptyState variant="glass" title="Library unavailable" description={error} />
          ) : items.length === 0 ? (
            <EmptyState
              variant="glass"
              title="The library is empty"
              description="Entries are added when a BID is completed or from the Clarif. & Qualif. page."
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              variant="glass"
              title="No entries match these filters"
              description="Try fewer filters or another search term."
              actionLabel="Clear filters"
              onAction={clear}
            />
          ) : (
            <>
              {shown.map((r) => {
                const it = r.item;
                const imported = !!alreadyIn[it.id];
                const isSelected = !!selected[it.id];
                const isLong = it.clarification.length > LONG_TEXT;
                const isExpanded = !!expanded[it.id];
                return (
                  <div
                    key={it.id}
                    className={`${styles.row} ${isSelected ? styles.rowSelected : ""} ${imported ? styles.rowDisabled : ""}`}
                    onClick={() => toggle(it.id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    aria-disabled={imported}
                    tabIndex={imported ? -1 : 0}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        toggle(it.id);
                      }
                    }}
                  >
                    <span
                      className={`${styles.check} ${isSelected ? styles.checkOn : ""}`}
                      aria-hidden="true"
                    >
                      {(isSelected || imported) && <Check size={12} />}
                    </span>
                    <div className={styles.rowBody}>
                      <div className={styles.rowMeta}>
                        <ClarificationTypeBadge type={it.baseType} />
                        {it.category && (
                          <ClarificationCategoryChip category={it.category} />
                        )}
                        <ClarificationOriginChip
                          sourceBidNumber={it.sourceBidNumber}
                        />
                        {it.division && <DivisionBadge division={it.division} />}
                        {r.clientLabel && (
                          <span className={styles.metaText}>
                            {r.clientLabel}
                          </span>
                        )}
                        {imported && (
                          <span className={styles.importedPill}>
                            Already in this BID
                          </span>
                        )}
                      </div>
                      {it.etTopic && (
                        <div className={styles.topic}>{it.etTopic}</div>
                      )}
                      <p
                        className={`${styles.text} ${isLong && !isExpanded ? styles.clamp : ""}`}
                      >
                        {it.clarification || "-"}
                      </p>
                      {isLong && (
                        <button
                          type="button"
                          className={styles.moreBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpanded((x) => ({ ...x, [it.id]: !x[it.id] }));
                          }}
                        >
                          {isExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                      {it.clientReply && (
                        <p className={styles.reply}>
                          <span>Client reply:</span> {it.clientReply}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              {filtered.length > visible && (
                <button
                  type="button"
                  className={styles.loadMoreBtn}
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                >
                  Show {Math.min(PAGE_SIZE, filtered.length - visible)} more
                  of {filtered.length - visible}
                </button>
              )}
            </>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.footerInfo}>
            <strong>{selectedCount}</strong> selected
          </span>
          <div className={styles.footerActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleImport}
              disabled={selectedCount === 0}
            >
              Import{selectedCount > 0 ? ` ${selectedCount}` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
