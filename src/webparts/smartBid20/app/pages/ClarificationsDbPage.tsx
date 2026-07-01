import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { ClarificationDbService } from "../services/ClarificationDbService";
import {
  IClarificationDbItem,
  ClarificationBaseType,
} from "../models/IClarificationDb";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { canAccessKnowledge } from "../utils/accessControl";
import { useDebounce } from "../hooks/useDebounce";
import { formatDate } from "../utils/formatters";
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
});

const toDateInput = (iso: string): string => (iso ? iso.substring(0, 10) : "");

export const ClarificationsDbPage: React.FC = () => {
  const currentUser = useCurrentUser();
  const canManage = canAccessKnowledge(currentUser);

  const [items, setItems] = React.useState<IClarificationDbItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");
  const [filterClient, setFilterClient] = React.useState("all");
  const [filterApproved, setFilterApproved] = React.useState("all");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [editItem, setEditItem] = React.useState<IClarificationDbItem | null>(
    null,
  );
  const [deleteItem, setDeleteItem] =
    React.useState<IClarificationDbItem | null>(null);
  const [saving, setSaving] = React.useState(false);

  const load = React.useCallback(() => {
    setIsLoading(true);
    setError("");
    ClarificationDbService.getAll()
      .then((data) => {
        setItems(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load clarifications database:", err);
        setError("Could not load the Clarifications Database.");
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const clients = React.useMemo(() => {
    const set: Record<string, boolean> = {};
    items.forEach((i) => {
      if (i.client) set[i.client] = true;
    });
    return Object.keys(set).sort();
  }, [items]);

  const filtered = React.useMemo(() => {
    let result = items;
    if (filterType !== "all") {
      result = result.filter((i) => i.baseType === filterType);
    }
    if (filterClient !== "all") {
      result = result.filter((i) => i.client === filterClient);
    }
    if (filterApproved !== "all") {
      const want = filterApproved === "yes";
      result = result.filter((i) => i.approved === want);
    }
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (i) =>
          i.clientDocRef.toLowerCase().indexOf(q) >= 0 ||
          i.etTopic.toLowerCase().indexOf(q) >= 0 ||
          i.clarification.toLowerCase().indexOf(q) >= 0 ||
          i.clientReply.toLowerCase().indexOf(q) >= 0 ||
          i.keyword.toLowerCase().indexOf(q) >= 0 ||
          i.client.toLowerCase().indexOf(q) >= 0,
      );
    }
    return result;
  }, [items, filterType, filterClient, filterApproved, debouncedSearch]);

  const hasFilters =
    searchTerm !== "" ||
    filterType !== "all" ||
    filterClient !== "all" ||
    filterApproved !== "all";

  const clearFilters = (): void => {
    setSearchTerm("");
    setFilterType("all");
    setFilterClient("all");
    setFilterApproved("all");
  };

  const patchEdit = (patch: Partial<IClarificationDbItem>): void => {
    setEditItem((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const submitEdit = (): void => {
    if (!editItem) return;
    setSaving(true);
    const op: Promise<void> =
      editItem.id > 0
        ? ClarificationDbService.update(editItem.id, editItem)
        : ClarificationDbService.create(editItem).then(() => undefined);
    op.then(() => {
      setSaving(false);
      setEditItem(null);
      load();
    }).catch((err) => {
      console.error("Save failed:", err);
      setSaving(false);
      setError("Could not save the item.");
    });
  };

  const confirmDelete = (): void => {
    if (!deleteItem) return;
    setSaving(true);
    ClarificationDbService.delete(deleteItem.id)
      .then(() => {
        setSaving(false);
        setDeleteItem(null);
        load();
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        setSaving(false);
        setError("Could not delete the item.");
      });
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Clarif. & Qualif."
        subtitle="Clarifications & Qualifications database"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        }
        actions={
          canManage ? (
            <button
              className={styles.addBtn}
              onClick={() => setEditItem(emptyItem())}
            >
              + Add Entry
            </button>
          ) : undefined
        }
      />

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <svg
            className={styles.searchIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Search clarifications, topics, replies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className={styles.clearBtn}
              onClick={() => setSearchTerm("")}
              title="Clear"
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.filterGroup}>
          <select
            className={styles.filterSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Clarification">Clarification</option>
            <option value="Qualification">Qualification</option>
          </select>
          <select
            className={styles.filterSelect}
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
          >
            <option value="all">All Clients</option>
            {clients.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className={styles.filterSelect}
            value={filterApproved}
            onChange={(e) => setFilterApproved(e.target.value)}
          >
            <option value="all">Any Approval</option>
            <option value="yes">Approved</option>
            <option value="no">Not Approved</option>
          </select>
          {hasFilters && (
            <button className={styles.clearFiltersBtn} onClick={clearFilters}>
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <p style={{ color: "var(--danger, #ef4444)", fontSize: 13 }}>{error}</p>
      )}

      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Loading database…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyWrap}>
          <EmptyState
            title="No entries found"
            description={
              hasFilters
                ? "Try adjusting your filters or search."
                : "The Clarifications Database is empty."
            }
          />
        </div>
      ) : (
        <>
          <p className={styles.countBar}>
            {filtered.length} of {items.length} entries
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Client Doc Ref</th>
                  <th>ET&apos;s Topic</th>
                  <th>Clarification</th>
                  <th>Client Reply</th>
                  <th>Approved</th>
                  <th>Date</th>
                  <th>Keyword</th>
                  <th>Client</th>
                  <th>Created By</th>
                  {canManage && <th />}
                </tr>
              </thead>
              <tbody>
                {filtered.map((it) => (
                  <tr key={it.id}>
                    <td>
                      <span
                        className={`${styles.baseTypeBadge} ${
                          it.baseType === "Qualification"
                            ? styles.typeQualification
                            : styles.typeClarification
                        }`}
                      >
                        {it.baseType}
                      </span>
                    </td>
                    <td>{it.clientDocRef || "—"}</td>
                    <td>
                      <div className={styles.cellText}>{it.etTopic || "—"}</div>
                    </td>
                    <td>
                      <div className={styles.cellText}>
                        {it.clarification || "—"}
                      </div>
                    </td>
                    <td>
                      <div className={styles.cellText}>
                        {it.clientReply || "—"}
                      </div>
                    </td>
                    <td>
                      <span
                        className={
                          it.approved ? styles.approvedYes : styles.approvedNo
                        }
                      >
                        {it.approved ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>{it.date ? formatDate(it.date) : "—"}</td>
                    <td>{it.keyword || "—"}</td>
                    <td>{it.client || "—"}</td>
                    <td>{it.createdBy || "—"}</td>
                    {canManage && (
                      <td>
                        <div className={styles.rowActions}>
                          <button
                            className={styles.actionBtn}
                            onClick={() => setEditItem({ ...it })}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => setDeleteItem(it)}
                            title="Delete"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add / Edit Modal */}
      {editItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editItem.id > 0 ? "Edit Entry" : "Add Entry"}
              </h3>
              <button
                className={styles.modalClose}
                onClick={() => setEditItem(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Type</label>
                <select
                  className={styles.formSelect}
                  value={editItem.baseType}
                  onChange={(e) =>
                    patchEdit({
                      baseType: e.target.value as ClarificationBaseType,
                    })
                  }
                >
                  <option value="Clarification">Clarification</option>
                  <option value="Qualification">Qualification</option>
                </select>
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Client Doc Ref</label>
                <input
                  className={styles.formInput}
                  value={editItem.clientDocRef}
                  onChange={(e) => patchEdit({ clientDocRef: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>ET&apos;s Topic</label>
                <textarea
                  className={styles.formTextarea}
                  value={editItem.etTopic}
                  onChange={(e) => patchEdit({ etTopic: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Clarification</label>
                <textarea
                  className={styles.formTextarea}
                  value={editItem.clarification}
                  onChange={(e) => patchEdit({ clarification: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Client Reply</label>
                <textarea
                  className={styles.formTextarea}
                  value={editItem.clientReply}
                  onChange={(e) => patchEdit({ clientReply: e.target.value })}
                />
              </div>
              <div className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={editItem.approved}
                  onChange={(e) => patchEdit({ approved: e.target.checked })}
                  id="approvedChk"
                />
                <label htmlFor="approvedChk">Approved / Accepted</label>
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Date</label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={toDateInput(editItem.date)}
                  onChange={(e) =>
                    patchEdit({
                      date: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : "",
                    })
                  }
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Keyword</label>
                <input
                  className={styles.formInput}
                  value={editItem.keyword}
                  onChange={(e) => patchEdit({ keyword: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Client</label>
                <input
                  className={styles.formInput}
                  value={editItem.client}
                  onChange={(e) => patchEdit({ client: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnSecondary}
                onClick={() => setEditItem(null)}
              >
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                onClick={submitEdit}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: 420 }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Delete Entry</h3>
              <button
                className={styles.modalClose}
                onClick={() => setDeleteItem(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.confirmText}>
                Delete this {deleteItem.baseType.toLowerCase()}
                {deleteItem.clientDocRef ? ` (${deleteItem.clientDocRef})` : ""}
                ? This cannot be undone.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnSecondary}
                onClick={() => setDeleteItem(null)}
              >
                Cancel
              </button>
              <button
                className={styles.btnDanger}
                onClick={confirmDelete}
                disabled={saving}
              >
                {saving ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
