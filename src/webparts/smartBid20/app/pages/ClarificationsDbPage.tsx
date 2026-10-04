import * as React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { DivisionBadge } from "../components/common/DivisionBadge";
import { EmptyState } from "../components/common/EmptyState";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { MultiSelectDropdown } from "../components/insights/MultiSelectDropdown";
import {
  ClarificationCategoryChip,
  ClarificationOriginChip,
  ClarificationTypeBadge,
} from "../components/knowledge/ClarificationBadges";
import { ClarificationEntryDrawer } from "../components/knowledge/ClarificationEntryDrawer";
import { ClarificationEntryModal } from "../components/knowledge/ClarificationEntryModal";
import { ClarificationDbService } from "../services/ClarificationDbService";
import { IClarificationDbItem } from "../models/IClarificationDb";
import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  ILibraryRow,
  useClarificationLibraryFilter,
} from "../hooks/useClarificationLibraryFilter";
import { useUIStore } from "../stores/useUIStore";
import { canAccessKnowledge } from "../utils/accessControl";
import { formatDate } from "../utils/formatters";
import { cleanClientDocRef } from "../utils/clarificationHelpers";
import styles from "./ClarificationsDbPage.module.scss";

const emptyItem = (): IClarificationDbItem => ({
  id: 0,
  baseType: "Clarification",
  clientDocRef: "",
  etTopic: "",
  clarification: "",
  clientReply: "",
  approved: false,
  date: "",
  keyword: "",
  client: "",
  category: "",
  division: "",
  serviceLine: "",
  sourceBidNumber: "",
  sourceItemId: "",
});

export const ClarificationsDbPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const canManage = canAccessKnowledge(currentUser);
  const addToast = useUIStore((s) => s.addToast);

  const [items, setItems] = React.useState<IClarificationDbItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [editItem, setEditItem] = React.useState<IClarificationDbItem | null>(
    null,
  );
  const [deleteItem, setDeleteItem] =
    React.useState<IClarificationDbItem | null>(null);
  const [saving, setSaving] = React.useState(false);

  const load = React.useCallback(() => {
    setIsLoading(true);
    setLoadError("");
    ClarificationDbService.getAll()
      .then((data) => {
        setItems(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load clarifications database:", err);
        setLoadError("Could not load the Clarifications Database.");
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const {
    rows,
    filtered,
    options,
    search,
    setSearch,
    filters,
    setFilter,
    hasFilters,
    clear: clearFilters,
  } = useClarificationLibraryFilter(items);

  const stats = React.useMemo(() => {
    let qualifications = 0;
    let fromBids = 0;
    items.forEach((i) => {
      if (i.baseType === "Qualification") qualifications++;
      if (i.sourceBidNumber) fromBids++;
    });
    return {
      clarifications: items.length - qualifications,
      qualifications,
      fromBids,
    };
  }, [items]);

  const openBid = React.useCallback(
    (bidNumber: string) => navigate(`/bid/${encodeURIComponent(bidNumber)}`),
    [navigate],
  );

  const selectedRow =
    selectedId !== null
      ? rows.find((r) => r.item.id === selectedId)
      : undefined;

  const handleSave = (item: IClarificationDbItem): void => {
    setSaving(true);
    const op: Promise<void> =
      item.id > 0
        ? ClarificationDbService.update(item.id, item)
        : ClarificationDbService.create(item).then(() => undefined);
    op.then(() => {
      setSaving(false);
      setEditItem(null);
      addToast({
        type: "success",
        title: item.id > 0 ? "Entry updated" : "Entry added",
      });
      load();
    }).catch((err) => {
      console.error("Save failed:", err);
      setSaving(false);
      addToast({
        type: "error",
        title: "Could not save the entry",
        message: err instanceof Error ? err.message : String(err),
      });
    });
  };

  const confirmDelete = (): void => {
    if (!deleteItem) return;
    const target = deleteItem;
    setDeleteItem(null);
    ClarificationDbService.delete(target.id)
      .then(() => {
        if (selectedId === target.id) setSelectedId(null);
        addToast({ type: "success", title: "Entry deleted" });
        load();
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        addToast({
          type: "error",
          title: "Could not delete the entry",
          message: err instanceof Error ? err.message : String(err),
        });
      });
  };

  const columns: {
    key: string;
    header: string;
    sortable?: boolean;
    render: (r: ILibraryRow) => React.ReactNode;
  }[] = [
    {
      key: "baseType",
      header: "Type",
      sortable: true,
      render: (r: ILibraryRow) => (
        <div className={styles.stack}>
          <ClarificationTypeBadge type={r.item.baseType} />
          <ClarificationOriginChip sourceBidNumber={r.item.sourceBidNumber} />
        </div>
      ),
    },
    {
      key: "categoryLabel",
      header: "Category",
      sortable: true,
      render: (r: ILibraryRow) => (
        <ClarificationCategoryChip category={r.item.category} />
      ),
    },
    {
      key: "etTopic",
      header: "Topic",
      sortable: true,
      render: (r: ILibraryRow) => {
        const ref = cleanClientDocRef(r.item.clientDocRef);
        return (
          <div className={`${styles.stack} ${styles.topicCell}`}>
            <span className={`${styles.clamp2} ${styles.primaryText}`}>
              {r.item.etTopic || "-"}
            </span>
            {ref && <span className={styles.refText}>{ref}</span>}
            {r.item.keyword && (
              <span className={styles.keyword}>#{r.item.keyword}</span>
            )}
          </div>
        );
      },
    },
    {
      key: "clarification",
      header: "Clarification / Qualification",
      render: (r: ILibraryRow) => (
        <span className={`${styles.clamp3} ${styles.textCell}`}>
          {r.item.clarification || "-"}
        </span>
      ),
    },
    {
      key: "clientReply",
      header: "Client Reply",
      render: (r: ILibraryRow) =>
        r.item.clientReply ? (
          <span className={`${styles.clamp3} ${styles.textCell}`}>
            {r.item.clientReply}
          </span>
        ) : (
          <span className={styles.muted}>No reply</span>
        ),
    },
    {
      key: "clientLabel",
      header: "Client",
      sortable: true,
      render: (r: ILibraryRow) => (
        <span className={styles.primaryText}>{r.clientLabel || "-"}</span>
      ),
    },
    {
      key: "divisionLabel",
      header: "Division / Line",
      sortable: true,
      render: (r: ILibraryRow) => (
        <div className={styles.stack}>
          {r.item.division ? <DivisionBadge division={r.item.division} /> : "-"}
          {r.item.serviceLine && (
            <span className={styles.muted}>
              {r.serviceLineLabel}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "approvedLabel",
      header: "Approved",
      sortable: true,
      render: (r: ILibraryRow) => (
        <span
          className={`${styles.approvalPill} ${r.item.approved ? styles.approvalYes : ""}`}
        >
          {r.item.approved ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "sortDate",
      header: "Date",
      sortable: true,
      render: (r: ILibraryRow) => (
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
      render: (r: ILibraryRow) => (
        <div className={styles.rowActions}>
          <button
            type="button"
            className={styles.iconBtn}
            title="Edit"
            aria-label="Edit entry"
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
            aria-label="Delete entry"
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
    <div className={styles.page}>
      <PageHeader
        title="Clarif. & Qualif."
        subtitle="Clarifications & Qualifications library, fed by completed BIDs and manual entries"
        icon={<MessageSquare size={28} />}
        actions={
          canManage ? (
            <button
              type="button"
              className={styles.createBtn}
              onClick={() => setEditItem(emptyItem())}
            >
              <Plus size={15} /> Add Entry
            </button>
          ) : undefined
        }
      />

      <div className={styles.stats}>
        <span className={styles.statChip}>
          <strong>{items.length}</strong> entries
        </span>
        <span className={styles.statChip}>
          <strong>{stats.clarifications}</strong> clarifications
        </span>
        <span className={styles.statChip}>
          <strong>{stats.qualifications}</strong> qualifications
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
            placeholder="Search text, topic, reply, keyword, BID…"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            aria-label="Search clarifications and qualifications"
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
        <MultiSelectDropdown
          label="Origin"
          options={options.origin}
          selected={filters.origin}
          onChange={setFilter("origin")}
        />
        <MultiSelectDropdown
          label="Approval"
          options={options.approval}
          selected={filters.approval}
          onChange={setFilter("approval")}
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
          {items.length === 1 ? "entry" : "entries"}
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
            title="The library is empty"
            description="Entries are added when a BID is completed, or manually with Add Entry."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            variant="glass"
            title="No entries match these filters"
            description="Try fewer filters or another search term."
            actionLabel="Clear filters"
            onAction={clearFilters}
          />
        ) : (
          <DataTable<ILibraryRow>
            className={styles.libraryTable}
            data={filtered}
            columns={columns}
            onRowClick={(r) => setSelectedId(r.item.id)}
          />
        )}
      </div>

      {selectedRow && (
        <ClarificationEntryDrawer
          item={selectedRow.item}
          sourceBid={selectedRow.sourceBid}
          canManage={canManage}
          onClose={() => setSelectedId(null)}
          onEdit={() => setEditItem({ ...selectedRow.item })}
          onDelete={() => setDeleteItem(selectedRow.item)}
          onOpenBid={openBid}
        />
      )}

      {editItem && (
        <ClarificationEntryModal
          item={editItem}
          saving={saving}
          onCancel={() => setEditItem(null)}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteItem}
        title="Delete entry"
        message={
          deleteItem
            ? `Delete this ${deleteItem.baseType.toLowerCase()}${
                deleteItem.etTopic ? ` ("${deleteItem.etTopic}")` : ""
              }? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
};
