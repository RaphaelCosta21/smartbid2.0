import * as React from "react";
import { ListPlus, Pencil, Search, Trash2, X } from "lucide-react";
import { DataTable } from "../common/DataTable";
import { DivisionBadge } from "../common/DivisionBadge";
import { EmptyState } from "../common/EmptyState";
import { SkeletonLoader } from "../common/SkeletonLoader";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { MultiSelectDropdown } from "../insights/MultiSelectDropdown";
import {
  ClarificationCategoryChip,
  ClarificationOriginChip,
} from "./ClarificationBadges";
import { QualificationEntryModal } from "./QualificationEntryModal";
import { QualificationEntryDrawer } from "./QualificationEntryDrawer";
import { QualificationTableModal } from "./QualificationTableModal";
import { QualificationDbService } from "../../services/QualificationDbService";
import {
  IQualificationDbItem,
  IQualificationTableChanges,
} from "../../models/IQualificationDb";
import {
  IQualificationLibraryRow,
  useQualificationLibraryFilter,
} from "../../hooks/useQualificationLibraryFilter";
import { useOpenBid } from "../../hooks/useOpenBid";
import { useUIStore } from "../../stores/useUIStore";
import { formatDate } from "../../utils/formatters";
import {
  findManualQualificationTableKey,
  newManualQualificationTableKey,
  nextLibraryItemOrder,
  qualificationLibraryTableKey,
  qualificationLibraryTableRows,
  qualificationTableKey,
} from "../../utils/qualificationHelpers";
import styles from "../../pages/ClarificationsDbPage.module.scss";

export interface QualificationLibraryViewHandle {
  /** Opens the table editor to add qualifications */
  add: () => void;
}

interface QualificationLibraryViewProps {
  canManage: boolean;
  /** Called after an entry is saved or deleted (republishes the AI files) */
  onChanged: () => void;
}

/** Qualifications Database tab of the Clarif. & Qualif. library page. */
export const QualificationLibraryView = React.forwardRef<
  QualificationLibraryViewHandle,
  QualificationLibraryViewProps
>(({ canManage, onChanged }, ref) => {
  const addToast = useUIStore((s) => s.addToast);
  const { openBid } = useOpenBid();
  const [items, setItems] = React.useState<IQualificationDbItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState("");
  const [editItem, setEditItem] = React.useState<IQualificationDbItem | null>(
    null,
  );
  /** Table editor: `key` edits that library table, no key adds qualifications */
  const [tableEdit, setTableEdit] = React.useState<{ key?: string } | null>(
    null,
  );
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [deleteItem, setDeleteItem] =
    React.useState<IQualificationDbItem | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    add: () => setTableEdit({}),
  }));

  const load = React.useCallback(() => {
    setIsLoading(true);
    setLoadError("");
    QualificationDbService.getAll()
      .then((data) => {
        setItems(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load the qualifications database:", err);
        setLoadError("Could not load the Qualifications Database.");
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const {
    filtered,
    options,
    search,
    setSearch,
    filters,
    setFilter,
    hasFilters,
    clear: clearFilters,
  } = useQualificationLibraryFilter(items);

  const stats = React.useMemo(() => {
    const tables: Record<string, boolean> = {};
    let fromBids = 0;
    items.forEach((i) => {
      tables[qualificationLibraryTableKey(i)] = true;
      if (i.sourceBidNumber) fromBids++;
    });
    return { tables: Object.keys(tables).length, fromBids };
  }, [items]);

  const selectedItem =
    selectedId !== null ? items.find((i) => i.id === selectedId) : undefined;

  const tableTitles = React.useMemo(() => {
    const seen: Record<string, string> = {};
    items.forEach((i) => {
      const key = qualificationTableKey(i.tableTitle);
      if (key && !seen[key]) seen[key] = i.tableTitle.trim();
    });
    return Object.keys(seen)
      .map((k) => seen[k])
      .sort((a, b) => a.localeCompare(b));
  }, [items]);

  /** A manual row whose title changed moves to the manual table with that title, or a new one. */
  const withTableKey = (item: IQualificationDbItem): IQualificationDbItem => {
    const before = items.find((i) => i.id === item.id);
    if (
      !before ||
      item.sourceBidNumber ||
      qualificationTableKey(before.tableTitle) ===
        qualificationTableKey(item.tableTitle)
    )
      return item;
    const others = items.filter((i) => i.id !== item.id);
    const key =
      findManualQualificationTableKey(others, item.tableTitle) ||
      newManualQualificationTableKey();
    return {
      ...item,
      tableKey: key,
      itemOrder: nextLibraryItemOrder(
        qualificationLibraryTableRows(others, key),
      ),
    };
  };

  const handleSave = (input: IQualificationDbItem): void => {
    const item = withTableKey(input);
    setSaving(true);
    const op: Promise<void> =
      item.id > 0
        ? QualificationDbService.update(item.id, item)
        : QualificationDbService.create(item).then(() => undefined);
    op.then(() => {
      setSaving(false);
      setEditItem(null);
      addToast({
        type: "success",
        title: item.id > 0 ? "Qualification updated" : "Qualification added",
      });
      load();
      onChanged();
    }).catch((err) => {
      console.error("Save failed:", err);
      setSaving(false);
      addToast({
        type: "error",
        title: "Could not save the qualification",
        message: err instanceof Error ? err.message : String(err),
      });
    });
  };

  const handleSaveTable = (changes: IQualificationTableChanges): void => {
    setSaving(true);
    QualificationDbService.saveTable(changes)
      .then((res) => {
        setSaving(false);
        setTableEdit(null);
        const saved = [
          res.created > 0 ? `${res.created} added` : "",
          res.updated > 0 ? `${res.updated} updated` : "",
          res.deleted > 0 ? `${res.deleted} removed` : "",
        ]
          .filter(Boolean)
          .join(", ");
        addToast(
          res.failed > 0
            ? {
                type: "warning",
                title: `${res.failed} change${res.failed === 1 ? "" : "s"} could not be saved`,
                message: saved
                  ? `Saved: ${saved}. Open the table again to retry.`
                  : "Open the table again to retry.",
              }
            : {
                type: "success",
                title: "Qualification table saved",
                message: saved || undefined,
              },
        );
        load();
        onChanged();
      })
      .catch((err) => {
        console.error("Table save failed:", err);
        setSaving(false);
        addToast({
          type: "error",
          title: "Could not save the qualification table",
          message: err instanceof Error ? err.message : String(err),
        });
      });
  };

  const confirmDelete = (): void => {
    if (!deleteItem) return;
    const target = deleteItem;
    setDeleteItem(null);
    if (selectedId === target.id) setSelectedId(null);
    QualificationDbService.delete(target.id)
      .then(() => {
        addToast({ type: "success", title: "Qualification deleted" });
        load();
        onChanged();
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        addToast({
          type: "error",
          title: "Could not delete the qualification",
          message: err instanceof Error ? err.message : String(err),
        });
      });
  };

  const columns: {
    key: string;
    header: string;
    sortable?: boolean;
    render: (r: IQualificationLibraryRow) => React.ReactNode;
  }[] = [
    {
      key: "tableTitle",
      header: "Table",
      sortable: true,
      render: (r) => (
        <div className={`${styles.stack} ${styles.topicCell}`}>
          <span className={`${styles.clamp2} ${styles.primaryText}`}>
            {r.tableTitle || "-"}
          </span>
          <ClarificationOriginChip sourceBidNumber={r.item.sourceBidNumber} />
        </div>
      ),
    },
    {
      key: "categoryLabel",
      header: "Category",
      sortable: true,
      render: (r) => <ClarificationCategoryChip category={r.item.category} />,
    },
    {
      key: "qualification",
      header: "Qualification",
      render: (r) => (
        <span
          className={`${styles.clamp3} ${styles.textCell}`}
          title={r.item.qualification}
        >
          {r.item.qualification || "-"}
        </span>
      ),
    },
    {
      key: "clientLabel",
      header: "Client",
      sortable: true,
      render: (r) => (
        <span className={styles.primaryText}>{r.clientLabel || "-"}</span>
      ),
    },
    {
      key: "divisionLabel",
      header: "Division / Line",
      sortable: true,
      render: (r) => (
        <div className={styles.stack}>
          {r.item.division ? <DivisionBadge division={r.item.division} /> : "-"}
          {r.item.serviceLine && (
            <span className={styles.muted}>{r.serviceLineLabel}</span>
          )}
        </div>
      ),
    },
    {
      key: "sortDate",
      header: "Added",
      sortable: true,
      render: (r) => (
        <div className={styles.stack}>
          <span className={styles.dateText}>
            {r.sortDate ? formatDate(r.sortDate) : "-"}
          </span>
          {r.item.createdBy && (
            <span className={styles.muted}>{r.item.createdBy}</span>
          )}
        </div>
      ),
    },
  ];

  if (canManage) {
    columns.push({
      key: "actions",
      header: "",
      render: (r) => (
        <div className={styles.rowActions}>
          <button
            type="button"
            className={styles.iconBtn}
            title="Edit table / add qualifications"
            aria-label="Edit the qualification table"
            onClick={(e) => {
              e.stopPropagation();
              setTableEdit({ key: qualificationLibraryTableKey(r.item) });
            }}
          >
            <ListPlus size={14} />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            title="Edit"
            aria-label="Edit qualification"
            onClick={(e) => {
              e.stopPropagation();
              setEditItem({ ...r.item });
            }}
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
            title="Delete"
            aria-label="Delete qualification"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteItem(r.item);
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    });
  }

  return (
    <>
      <div className={styles.stats}>
        <span className={styles.statChip}>
          <strong>{items.length}</strong> qualifications
        </span>
        <span className={styles.statChip}>
          <strong>{stats.tables}</strong> tables
        </span>
        <span className={styles.statChip}>
          <strong>{stats.fromBids}</strong> from completed BIDs
        </span>
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
            aria-label="Search qualifications"
          />
          {search && (
            <button
              type="button"
              className={styles.searchClearBtn}
              onClick={() => setSearch("")}
              title="Clear search"
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
        <MultiSelectDropdown
          label="Origin"
          options={options.origin}
          selected={filters.origin}
          onChange={setFilter("origin")}
        />
        {hasFilters && (
          <button
            type="button"
            className={styles.clearFiltersBtn}
            onClick={clearFilters}
          >
            <X size={14} /> Clear
          </button>
        )}
        <span className={styles.resultCount}>
          <strong>{filtered.length}</strong>{" "}
          {hasFilters ? `of ${items.length} ` : ""}
          {items.length === 1 ? "qualification" : "qualifications"}
        </span>
      </div>

      <div className={styles.tableSection}>
        {isLoading ? (
          <SkeletonLoader height={52} count={6} />
        ) : loadError ? (
          <EmptyState
            variant="glass"
            title="Could not load the library"
            description={loadError}
            actionLabel="Retry"
            onAction={load}
          />
        ) : items.length === 0 ? (
          <EmptyState
            variant="glass"
            title="No qualifications yet"
            description="Qualification tables are added when a BID is completed, or manually with Add Qualifications."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            variant="glass"
            title="No qualifications match these filters"
            description="Try fewer filters or another search term."
            actionLabel="Clear filters"
            onAction={clearFilters}
          />
        ) : (
          <DataTable<IQualificationLibraryRow>
            className={styles.libraryTable}
            data={filtered}
            columns={columns}
            onRowClick={(r) => setSelectedId(r.item.id)}
          />
        )}
      </div>

      {selectedItem && (
        <QualificationEntryDrawer
          item={selectedItem}
          items={items}
          canManage={canManage}
          onClose={() => setSelectedId(null)}
          onEdit={() => {
            setSelectedId(null);
            setEditItem({ ...selectedItem });
          }}
          onEditTable={() => {
            setSelectedId(null);
            setTableEdit({ key: qualificationLibraryTableKey(selectedItem) });
          }}
          onDelete={() => setDeleteItem(selectedItem)}
          onOpenBid={openBid}
        />
      )}

      {tableEdit && (
        <QualificationTableModal
          items={items}
          tableKey={tableEdit.key}
          tableTitles={tableTitles}
          saving={saving}
          onCancel={() => setTableEdit(null)}
          onSave={handleSaveTable}
        />
      )}

      {editItem && (
        <QualificationEntryModal
          item={editItem}
          saving={saving}
          tableTitles={tableTitles}
          onCancel={() => setEditItem(null)}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteItem}
        title="Delete qualification"
        message={
          deleteItem
            ? `Delete this qualification from "${deleteItem.tableTitle || "-"}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </>
  );
});
QualificationLibraryView.displayName = "QualificationLibraryView";
