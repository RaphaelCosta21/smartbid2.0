import * as React from "react";
import { BookOpen, Search, X } from "lucide-react";
import { IBid } from "../../models";
import { IQualificationDbItem } from "../../models/IQualificationDb";
import { QualificationDbService } from "../../services/QualificationDbService";
import { useQualificationLibraryFilter } from "../../hooks/useQualificationLibraryFilter";
import {
  DEFAULT_QUALIFICATION_TABLE,
  IQualificationDraft,
  qualificationLibraryTableKey,
} from "../../utils/qualificationHelpers";
import { DivisionBadge } from "../common/DivisionBadge";
import { EmptyState } from "../common/EmptyState";
import { SkeletonLoader } from "../common/SkeletonLoader";
import { MultiSelectDropdown } from "../insights/MultiSelectDropdown";
import { ClarificationOriginChip } from "../knowledge/ClarificationBadges";
import {
  IQualificationPickGroup,
  QualificationGroupList,
} from "./QualificationGroupList";
import styles from "./ImportClarificationModal.module.scss";

export interface ImportQualificationModalProps {
  bid: IBid;
  /** Library item ids already imported into this BID's tables */
  existingRefIds: number[];
  onClose: () => void;
  onImport: (drafts: IQualificationDraft[]) => void;
}

const PAGE_SIZE = 20;

/** One group per library table (a source BID table, or a manual table). */
const groupKeyOf = qualificationLibraryTableKey;

export const ImportQualificationModal: React.FC<
  ImportQualificationModalProps
> = ({ bid, existingRefIds, onClose, onImport }) => {
  const [items, setItems] = React.useState<IQualificationDbItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
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
  } = useQualificationLibraryFilter(items);

  React.useEffect(() => {
    QualificationDbService.getAll()
      .then((data) => {
        setItems(data);
        // Start on the BID's division only when the library already has entries for it
        if (bid.division && data.some((d) => d.division === bid.division)) {
          setFilter("division")([bid.division]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load the qualifications library:", err);
        setError("Could not load the Qualifications library.");
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
    existingRefIds.forEach((id) => {
      map[id] = true;
    });
    return map;
  }, [existingRefIds]);

  const groups = React.useMemo<IQualificationPickGroup[]>(() => {
    const byKey: Record<string, IQualificationPickGroup & { order: number[] }> =
      {};
    const list: (IQualificationPickGroup & { order: number[] })[] = [];
    filtered.forEach((r) => {
      const it = r.item;
      const key = groupKeyOf(it);
      let group = byKey[key];
      if (!group) {
        group = {
          key,
          title: r.tableTitle || DEFAULT_QUALIFICATION_TABLE,
          meta: (
            <>
              <ClarificationOriginChip sourceBidNumber={it.sourceBidNumber} />
              {it.division && <DivisionBadge division={it.division} />}
              {r.clientLabel && (
                <span className={styles.metaText}>{r.clientLabel}</span>
              )}
            </>
          ),
          rows: [],
          order: [],
        };
        byKey[key] = group;
        list.push(group);
      }
      group.rows.push({
        id: String(it.id),
        category: it.category,
        qualification: it.qualification,
        lockedLabel: alreadyIn[it.id] ? "Already in this BID" : undefined,
      });
      group.order.push(it.itemOrder || 0);
    });
    list.forEach((g) => {
      const order = g.order;
      const idx = g.rows.map((_, i) => i).sort((a, b) => order[a] - order[b]);
      g.rows = idx.map((i) => g.rows[i]);
    });
    return list;
  }, [filtered, alreadyIn]);

  const selectableIds = React.useMemo(
    () =>
      filtered
        .filter((r) => !alreadyIn[r.item.id])
        .map((r) => String(r.item.id)),
    [filtered, alreadyIn],
  );
  const selectedCount = items.filter(
    (i) => selected[String(i.id)] && !alreadyIn[i.id],
  ).length;
  const allSelected =
    selectableIds.length > 0 && selectableIds.every((id) => selected[id]);

  const toggleAll = (): void => {
    setSelected((s) => {
      const next = { ...s };
      selectableIds.forEach((id) => {
        next[id] = !allSelected;
      });
      return next;
    });
  };

  const handleImport = (): void => {
    const chosen = items
      .filter((i) => selected[String(i.id)] && !alreadyIn[i.id])
      .sort(
        (a, b) =>
          groupKeyOf(a).localeCompare(groupKeyOf(b)) ||
          (a.itemOrder || 0) - (b.itemOrder || 0),
      )
      .map((i): IQualificationDraft => ({
        tableTitle: i.tableTitle || DEFAULT_QUALIFICATION_TABLE,
        category: i.category,
        qualification: i.qualification,
        libraryRefId: i.id,
      }));
    if (chosen.length > 0) onImport(chosen);
    onClose();
  };

  const shown = groups.slice(0, visible);

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-qual-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.iconTile}>
              <BookOpen size={18} />
            </span>
            <div>
              <h2 id="import-qual-title" className={styles.title}>
                Import from Qualifications library
              </h2>
              <p className={styles.subtitle}>
                Reuse qualification tables from other BIDs. Select a whole table
                or single qualifications: they are added to the table with the
                same title, or a new table is created.
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
              placeholder="Search table, category, text, BID…"
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
            label="Table"
            options={options.table}
            selected={filters.table}
            onChange={setFilter("table")}
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
              disabled={selectableIds.length === 0}
              onChange={toggleAll}
            />
            Select all matching ({selectableIds.length})
          </label>
          <span className={styles.resultCount}>
            <strong>{filtered.length}</strong>{" "}
            {hasFilters ? `of ${items.length} ` : ""}
            {items.length === 1 ? "qualification" : "qualifications"} in{" "}
            {groups.length} {groups.length === 1 ? "table" : "tables"}
          </span>
        </div>

        <div className={styles.list}>
          {isLoading ? (
            <SkeletonLoader height={84} count={4} />
          ) : error ? (
            <EmptyState
              variant="glass"
              title="Library unavailable"
              description={error}
            />
          ) : items.length === 0 ? (
            <EmptyState
              variant="glass"
              title="The library is empty"
              description="Qualification tables are added when a BID is completed or from the Clarif. & Qualif. page."
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              variant="glass"
              title="No qualifications match these filters"
              description="Try fewer filters or another search term."
              actionLabel="Clear filters"
              onAction={clear}
            />
          ) : (
            <>
              <QualificationGroupList
                groups={shown}
                selected={selected}
                onChange={setSelected}
              />
              {groups.length > visible && (
                <button
                  type="button"
                  className={styles.loadMoreBtn}
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                >
                  Show {Math.min(PAGE_SIZE, groups.length - visible)} more of{" "}
                  {groups.length - visible} tables
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
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
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
