import * as React from "react";
import { IClarificationItem } from "../../models";
import { IClarificationDbItem } from "../../models/IClarificationDb";
import { ClarificationDbService } from "../../services/ClarificationDbService";
import { makeId } from "../../utils/idGenerator";
import { useDebounce } from "../../hooks/useDebounce";
import styles from "./ImportClarificationModal.module.scss";

export interface ImportClarificationModalProps {
  onClose: () => void;
  onImport: (items: IClarificationItem[]) => void;
}

/** Map a database row to a BID clarification item (already-in-DB, so flagged) */
const toClarificationItem = (db: IClarificationDbItem): IClarificationItem => ({
  id: makeId("q"),
  scopeItemId: null,
  item: db.clientDocRef,
  description: db.etTopic,
  clarification: db.clarification,
  clientResponse: db.clientReply,
  isAutoImported: false,
  baseType: db.baseType,
  createdDate: db.created || new Date().toISOString(),
  responseDate: db.date || undefined,
  exportedToDatabase: true,
});

export const ImportClarificationModal: React.FC<
  ImportClarificationModalProps
> = ({ onClose, onImport }) => {
  const [items, setItems] = React.useState<IClarificationDbItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [selected, setSelected] = React.useState<Record<number, boolean>>({});

  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");
  const [filterClient, setFilterClient] = React.useState("all");
  const debouncedSearch = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    setIsLoading(true);
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
  }, [items, filterType, filterClient, debouncedSearch]);

  const selectedCount = Object.keys(selected).filter(
    (k) => selected[Number(k)],
  ).length;

  const toggle = (id: number): void =>
    setSelected((s) => ({ ...s, [id]: !s[id] }));

  const handleImport = (): void => {
    const chosen = items.filter((i) => selected[i.id]).map(toClarificationItem);
    if (chosen.length > 0) onImport(chosen);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>Import from Clarifications Database</h3>
          <button className={styles.close} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <input
              className={styles.searchInput}
              placeholder="Search clarifications, topics, replies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
        </div>

        <div className={styles.body}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
            </div>
          ) : error ? (
            <div className={styles.empty}>{error}</div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>No entries match your filters.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkboxCell} />
                  <th>Type</th>
                  <th>Client Doc Ref</th>
                  <th>Description</th>
                  <th>Clarification</th>
                  <th>Client Reply</th>
                  <th>Client</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it) => (
                  <tr
                    key={it.id}
                    className={styles.row}
                    onClick={() => toggle(it.id)}
                  >
                    <td className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        checked={!!selected[it.id]}
                        onChange={() => toggle(it.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
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
                    <td>{it.client || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.count}>{selectedCount} selected</span>
          <div className={styles.footerActions}>
            <button className={styles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.btnPrimary}
              onClick={handleImport}
              disabled={selectedCount === 0}
            >
              Import {selectedCount > 0 ? `(${selectedCount})` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
