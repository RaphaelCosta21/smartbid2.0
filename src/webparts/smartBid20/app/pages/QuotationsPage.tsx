import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { useDebounce } from "../hooks/useDebounce";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useConfigStore } from "../stores/useConfigStore";
import { useQuotationStore } from "../stores/useQuotationStore";
import { useUIStore } from "../stores/useUIStore";
import { QuotationService } from "../services/QuotationService";
import { formatCurrency, formatDate } from "../utils/formatters";
import { convertToUSD } from "../utils/costCalculations";
import {
  IQuotationItem,
  QuotationType,
  IFavoriteGroup,
  IExchangeRate,
} from "../models";
import styles from "./QuotationsPage.module.scss";

// ─── Helpers ───
function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

/** Blank line item for the add modal */
function blankLineItem(): ILineItem {
  return {
    _key: genId(),
    groupId: "",
    subGroupId: "",
    partNumber: "",
    description: "",
    supplier: "",
    leadTimeDays: 0,
    quotationDate: new Date().toISOString().slice(0, 10),
    type: "acquisition" as QuotationType,
    cost: 0,
    currency: "USD",
    notes: "",
  };
}

interface ILineItem {
  _key: string;
  groupId: string;
  subGroupId: string;
  partNumber: string;
  description: string;
  supplier: string;
  leadTimeDays: number;
  quotationDate: string;
  type: QuotationType;
  cost: number;
  currency: string;
  notes: string;
}

// ─── SVG icons ───
const FileTextIcon = (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const PlusIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const StarIcon: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "var(--warning)" : "none"}
    stroke={filled ? "var(--warning)" : "currentColor"}
    strokeWidth="2"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const EditIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ExternalLinkIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const GridIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const ListIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const UploadIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// ═══════════════════════════════════════════════════════
// Page Component
// ═══════════════════════════════════════════════════════
export const QuotationsPage: React.FC = () => {
  // ─── Stores & hooks ───
  const config = useConfigStore((s) => s.config);
  const currentUser = useCurrentUser();
  const {
    items: quotations,
    isLoading,
    loadQuotations,
    addItems,
    updateItem,
    deleteItem,
    toggleFavorite,
  } = useQuotationStore();
  const addToast = useUIStore((s) => s.addToast);

  // ─── Local state ───
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [groupFilter, setGroupFilter] = React.useState("all");
  const [subGroupFilter, setSubGroupFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState<"all" | QuotationType>(
    "all",
  );
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editItem, setEditItem] = React.useState<IQuotationItem | null>(null);

  // ─── Config-derived data ───
  const groups: IFavoriteGroup[] = config?.favoriteGroups || [];
  const exchangeRates: IExchangeRate[] =
    config?.currencySettings?.exchangeRates || [];
  const currencyOptions = React.useMemo(() => {
    const opts = ["USD"];
    (exchangeRates || []).forEach((r) => {
      if (opts.indexOf(r.currency) < 0) opts.push(r.currency);
    });
    return opts;
  }, [exchangeRates]);

  // Group/SubGroup name lookups
  const groupMap = React.useMemo(() => {
    const m: Record<string, string> = {};
    groups.forEach((g) => {
      m[g.id] = g.name;
    });
    return m;
  }, [groups]);

  const subGroupMap = React.useMemo(() => {
    const m: Record<string, string> = {};
    groups.forEach((g) => {
      (g.subGroups || []).forEach((sg) => {
        m[sg.id] = sg.name;
      });
    });
    return m;
  }, [groups]);

  // SubGroups for selected group filter
  const filteredSubGroups = React.useMemo(() => {
    if (groupFilter === "all") return [];
    const grp = groups.find((g) => g.id === groupFilter);
    return grp ? grp.subGroups : [];
  }, [groupFilter, groups]);

  // ─── Load on mount ───
  React.useEffect(() => {
    loadQuotations();
  }, []);

  // ─── Filtered data ───
  const filtered = React.useMemo(() => {
    let items = quotations;
    if (groupFilter !== "all")
      items = items.filter((q) => q.groupId === groupFilter);
    if (subGroupFilter !== "all")
      items = items.filter((q) => q.subGroupId === subGroupFilter);
    if (typeFilter !== "all")
      items = items.filter((q) => q.type === typeFilter);
    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      items = items.filter(
        (q) =>
          q.partNumber.toLowerCase().indexOf(lower) >= 0 ||
          q.description.toLowerCase().indexOf(lower) >= 0 ||
          q.supplier.toLowerCase().indexOf(lower) >= 0,
      );
    }
    return items;
  }, [quotations, groupFilter, subGroupFilter, typeFilter, debouncedSearch]);

  // ─── Handlers ───
  const handleToggleFavorite = async (id: string): Promise<void> => {
    try {
      await toggleFavorite(id, currentUser?.displayName || "Unknown");
      addToast({ type: "success", title: "Favorite updated" });
    } catch {
      addToast({ type: "error", title: "Failed to update favorite" });
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm("Delete this quotation item?")) return;
    try {
      await deleteItem(id);
      addToast({ type: "success", title: "Quotation deleted" });
    } catch {
      addToast({ type: "error", title: "Failed to delete quotation" });
    }
  };

  const openFile = (q: IQuotationItem): void => {
    if (q.fileUrl) {
      window.open(QuotationService.getFileOpenUrl(q.fileUrl), "_blank");
    }
  };

  // ═══════════════════════════════════════════════════════
  // Add / Edit Modal
  // ═══════════════════════════════════════════════════════
  const AddEditModal: React.FC<{
    editingItem?: IQuotationItem | null;
    onClose: () => void;
  }> = ({ editingItem, onClose }) => {
    const isEdit = !!editingItem;
    const [file, setFile] = React.useState<File | null>(null);
    const [saving, setSaving] = React.useState(false);
    const [lines, setLines] = React.useState<ILineItem[]>(() => {
      if (editingItem) {
        return [
          {
            _key: editingItem.id,
            groupId: editingItem.groupId,
            subGroupId: editingItem.subGroupId,
            partNumber: editingItem.partNumber,
            description: editingItem.description,
            supplier: editingItem.supplier,
            leadTimeDays: editingItem.leadTimeDays,
            quotationDate: editingItem.quotationDate
              ? editingItem.quotationDate.slice(0, 10)
              : "",
            type: editingItem.type,
            cost: editingItem.cost,
            currency: editingItem.currency,
            notes: editingItem.notes,
          },
        ];
      }
      return [blankLineItem()];
    });

    const addLine = (): void =>
      setLines((prev) => prev.concat([blankLineItem()]));

    const removeLine = (key: string): void => {
      if (lines.length <= 1) return;
      setLines((prev) => prev.filter((l) => l._key !== key));
    };

    const updateLine = (key: string, field: string, value: any): void => {
      setLines((prev) =>
        prev.map((l) => {
          if (l._key !== key) return l;
          const updated = { ...l, [field]: value };
          // Reset subGroupId when group changes
          if (field === "groupId") updated.subGroupId = "";
          return updated;
        }),
      );
    };

    const getSubGroupsForLine = (
      groupId: string,
    ): { id: string; name: string }[] => {
      const grp = groups.find((g) => g.id === groupId);
      return grp ? grp.subGroups : [];
    };

    const getConversion = (
      cost: number,
      currency: string,
    ): { costUSD: number; rate: number } => {
      if (currency === "USD") return { costUSD: cost, rate: 1 };
      const costUSD = convertToUSD(cost, currency, exchangeRates);
      const rateObj = exchangeRates.find(
        (r) => r.currency.toUpperCase() === currency.toUpperCase(),
      );
      return { costUSD, rate: rateObj ? rateObj.rate : 1 };
    };

    const handleSave = async (): Promise<void> => {
      // Validate
      for (const line of lines) {
        if (!line.groupId || !line.subGroupId) {
          addToast({
            type: "error",
            title: "Please select Group and SubGroup for all items",
          });
          return;
        }
        if (!line.partNumber.trim()) {
          addToast({
            type: "error",
            title: "Part Number is required for all items",
          });
          return;
        }
        if (!line.description.trim()) {
          addToast({
            type: "error",
            title: "Description is required for all items",
          });
          return;
        }
        if (!line.supplier.trim()) {
          addToast({
            type: "error",
            title: "Supplier is required for all items",
          });
          return;
        }
        if (line.cost <= 0) {
          addToast({
            type: "error",
            title: "Cost must be greater than zero for all items",
          });
          return;
        }
      }

      setSaving(true);
      try {
        // Upload file if provided (only for new, not edit)
        let fileUrl: string | undefined;
        let fileName: string | undefined;
        if (file) {
          fileUrl = await QuotationService.uploadFile(file);
          fileName = file.name;
        }

        const now = new Date().toISOString();

        if (isEdit && editingItem) {
          // Single item edit
          const line = lines[0];
          const { costUSD, rate } = getConversion(line.cost, line.currency);
          const updated: IQuotationItem = {
            ...editingItem,
            groupId: line.groupId,
            subGroupId: line.subGroupId,
            partNumber: line.partNumber.trim(),
            description: line.description.trim(),
            supplier: line.supplier.trim(),
            leadTimeDays: line.leadTimeDays,
            quotationDate: line.quotationDate,
            type: line.type,
            cost: line.cost,
            currency: line.currency,
            costUSD,
            exchangeRateUsed: rate,
            notes: line.notes,
            lastModified: now,
            ...(fileUrl ? { fileUrl, fileName } : {}),
          };
          await updateItem(updated);
          addToast({ type: "success", title: "Quotation updated" });
        } else {
          // Create new items
          const newItems: IQuotationItem[] = lines.map((line) => {
            const { costUSD, rate } = getConversion(line.cost, line.currency);
            return {
              id: genId(),
              groupId: line.groupId,
              subGroupId: line.subGroupId,
              partNumber: line.partNumber.trim(),
              description: line.description.trim(),
              quantity: 1,
              supplier: line.supplier.trim(),
              leadTimeDays: line.leadTimeDays,
              quotationDate: line.quotationDate,
              type: line.type,
              cost: line.cost,
              currency: line.currency,
              costUSD,
              exchangeRateUsed: rate,
              notes: line.notes,
              isFavorite: false,
              fileUrl: fileUrl,
              fileName: fileName,
              createdBy: currentUser?.displayName || "Unknown",
              createdDate: now,
              lastModified: now,
            };
          });
          await addItems(newItems);
          addToast({
            type: "success",
            title: `${newItems.length} quotation item${newItems.length > 1 ? "s" : ""} added`,
          });
        }
        onClose();
      } catch {
        addToast({ type: "error", title: "Failed to save quotation" });
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>{isEdit ? "Edit Quotation" : "Add Quotation"}</h2>
            <button className={styles.closeBtn} onClick={onClose}>
              &times;
            </button>
          </div>

          <div className={styles.modalBody}>
            {/* File Upload */}
            <div className={styles.fileSection}>
              <label className={styles.fieldLabel}>
                Quotation File (optional)
              </label>
              <div className={styles.fileUploadRow}>
                <label className={styles.fileBtn}>
                  {UploadIcon}
                  <span>{file ? file.name : "Choose file..."}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.msg,.eml"
                    onChange={(e) =>
                      setFile(e.target.files ? e.target.files[0] : null)
                    }
                    style={{ display: "none" }}
                  />
                </label>
                {editingItem?.fileUrl && !file && (
                  <span className={styles.existingFile}>
                    Current: {editingItem.fileName || "File attached"}
                  </span>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className={styles.linesSection}>
              <div className={styles.linesSectionHeader}>
                <h3>Items</h3>
                {!isEdit && (
                  <button className={styles.addLineBtn} onClick={addLine}>
                    {PlusIcon} Add Item
                  </button>
                )}
              </div>

              {lines.map((line, idx) => (
                <div key={line._key} className={styles.lineItem}>
                  <div className={styles.lineHeader}>
                    <span className={styles.lineNumber}>Item {idx + 1}</span>
                    {!isEdit && lines.length > 1 && (
                      <button
                        className={styles.removeLineBtn}
                        onClick={() => removeLine(line._key)}
                      >
                        {TrashIcon}
                      </button>
                    )}
                  </div>

                  <div className={styles.formGrid}>
                    {/* Row 1: Group + SubGroup */}
                    <div className={styles.formField}>
                      <label>Group *</label>
                      <select
                        value={line.groupId}
                        onChange={(e) =>
                          updateLine(line._key, "groupId", e.target.value)
                        }
                      >
                        <option value="">Select group...</option>
                        {groups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formField}>
                      <label>SubGroup *</label>
                      <select
                        value={line.subGroupId}
                        onChange={(e) =>
                          updateLine(line._key, "subGroupId", e.target.value)
                        }
                        disabled={!line.groupId}
                      >
                        <option value="">Select sub-group...</option>
                        {getSubGroupsForLine(line.groupId).map((sg) => (
                          <option key={sg.id} value={sg.id}>
                            {sg.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Row 2: PN + Description */}
                    <div className={styles.formField}>
                      <label>OII/MFG PN *</label>
                      <input
                        type="text"
                        value={line.partNumber}
                        onChange={(e) =>
                          updateLine(line._key, "partNumber", e.target.value)
                        }
                        placeholder="Part number..."
                      />
                    </div>
                    <div className={styles.formField}>
                      <label>Description *</label>
                      <input
                        type="text"
                        value={line.description}
                        onChange={(e) =>
                          updateLine(line._key, "description", e.target.value)
                        }
                        placeholder="Item description..."
                      />
                    </div>

                    {/* Row 3: Supplier + Lead Time + Date */}
                    <div className={styles.formField}>
                      <label>Supplier *</label>
                      <input
                        type="text"
                        value={line.supplier}
                        onChange={(e) =>
                          updateLine(line._key, "supplier", e.target.value)
                        }
                        placeholder="Vendor name..."
                      />
                    </div>
                    <div className={styles.formFieldSmall}>
                      <label>Lead Time (days)</label>
                      <input
                        type="number"
                        min={0}
                        value={line.leadTimeDays}
                        onChange={(e) =>
                          updateLine(
                            line._key,
                            "leadTimeDays",
                            parseInt(e.target.value, 10) || 0,
                          )
                        }
                      />
                    </div>
                    <div className={styles.formFieldSmall}>
                      <label>Quotation Date</label>
                      <input
                        type="date"
                        value={line.quotationDate}
                        onChange={(e) =>
                          updateLine(line._key, "quotationDate", e.target.value)
                        }
                      />
                    </div>

                    {/* Row 4: Type toggle */}
                    <div className={styles.formFieldFull}>
                      <label>Type</label>
                      <div className={styles.typeToggle}>
                        <button
                          className={`${styles.typeBtn} ${line.type === "acquisition" ? styles.typeBtnActive : ""}`}
                          onClick={() =>
                            updateLine(line._key, "type", "acquisition")
                          }
                        >
                          Acquisition
                        </button>
                        <button
                          className={`${styles.typeBtn} ${line.type === "rental" ? styles.typeBtnActive : ""}`}
                          onClick={() =>
                            updateLine(line._key, "type", "rental")
                          }
                        >
                          Rental (Day Rate)
                        </button>
                      </div>
                    </div>

                    {/* Row 5: Cost + Currency + Conversion */}
                    <div className={styles.formField}>
                      <label>
                        {line.type === "rental" ? "Day Rate *" : "Unit Cost *"}
                      </label>
                      <div className={styles.costInputRow}>
                        <select
                          className={styles.currencySelect}
                          value={line.currency}
                          onChange={(e) =>
                            updateLine(line._key, "currency", e.target.value)
                          }
                        >
                          {currencyOptions.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={line.cost || ""}
                          onChange={(e) =>
                            updateLine(
                              line._key,
                              "cost",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="0.00"
                          className={styles.costInput}
                        />
                      </div>
                      {line.cost > 0 && line.currency !== "USD" && (
                        <div className={styles.conversionHint}>
                          ≈{" "}
                          {formatCurrency(
                            getConversion(line.cost, line.currency).costUSD,
                            "USD",
                          )}{" "}
                          (rate:{" "}
                          {getConversion(line.cost, line.currency).rate.toFixed(
                            4,
                          )}
                          )
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div className={styles.formFieldFull}>
                      <label>Notes</label>
                      <textarea
                        value={line.notes}
                        onChange={(e) =>
                          updateLine(line._key, "notes", e.target.value)
                        }
                        placeholder="Additional notes..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : isEdit ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════
  // Card Renderer (Grid Mode)
  // ═══════════════════════════════════════════════════════
  const QuotationCard: React.FC<{ item: IQuotationItem }> = ({ item }) => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardBadges}>
          <span
            className={`${styles.typeBadge} ${item.type === "rental" ? styles.rentalBadge : styles.acquisitionBadge}`}
          >
            {item.type === "rental" ? "Rental" : "Acquisition"}
          </span>
        </div>
        <div className={styles.cardActions}>
          <button
            className={styles.iconBtn}
            onClick={() => handleToggleFavorite(item.id)}
            title={
              item.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <StarIcon filled={item.isFavorite} />
          </button>
          {item.fileUrl && (
            <button
              className={styles.iconBtn}
              onClick={() => openFile(item)}
              title="Open quotation file"
            >
              {ExternalLinkIcon}
            </button>
          )}
          <button
            className={styles.iconBtn}
            onClick={() => setEditItem(item)}
            title="Edit"
          >
            {EditIcon}
          </button>
          <button
            className={`${styles.iconBtn} ${styles.dangerBtn}`}
            onClick={() => handleDelete(item.id)}
            title="Delete"
          >
            {TrashIcon}
          </button>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardPN}>{item.partNumber}</div>
        <div className={styles.cardDesc}>{item.description}</div>
        <div className={styles.cardMeta}>
          <span>{groupMap[item.groupId] || "—"}</span>
          <span className={styles.sep}>›</span>
          <span>{subGroupMap[item.subGroupId] || "—"}</span>
        </div>
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.cardCost}>
          <span className={styles.costLabel}>
            {item.type === "rental" ? "Day Rate" : "Cost"}
          </span>
          <span className={styles.costValue}>
            {formatCurrency(item.costUSD, "USD")}
          </span>
          {item.currency !== "USD" && (
            <span className={styles.costOriginal}>
              {formatCurrency(item.cost, item.currency)}
            </span>
          )}
        </div>
        <div className={styles.cardInfo}>
          <span title="Supplier">{item.supplier}</span>
          <span title="Lead Time">{item.leadTimeDays}d</span>
          <span title="Date">{formatDate(item.quotationDate)}</span>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════
  return (
    <div className={styles.page}>
      <PageHeader
        title="Quotations"
        subtitle={`${filtered.length} quotation${filtered.length !== 1 ? "s" : ""}`}
        icon={FileTextIcon}
        actions={
          <button
            className={styles.addBtn}
            onClick={() => setShowAddModal(true)}
          >
            {PlusIcon} Add Quotation
          </button>
        }
      />

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by PN, description, supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className={styles.filterSelect}
          value={groupFilter}
          onChange={(e) => {
            setGroupFilter(e.target.value);
            setSubGroupFilter("all");
          }}
        >
          <option value="all">All Groups</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {filteredSubGroups.length > 0 && (
          <select
            className={styles.filterSelect}
            value={subGroupFilter}
            onChange={(e) => setSubGroupFilter(e.target.value)}
          >
            <option value="all">All SubGroups</option>
            {filteredSubGroups.map((sg) => (
              <option key={sg.id} value={sg.id}>
                {sg.name}
              </option>
            ))}
          </select>
        )}

        <div className={styles.typeFilterGroup}>
          {(["all", "acquisition", "rental"] as const).map((t) => (
            <button
              key={t}
              className={`${styles.typeFilterBtn} ${typeFilter === t ? styles.typeFilterBtnActive : ""}`}
              onClick={() => setTypeFilter(t)}
            >
              {t === "all"
                ? "All"
                : t === "acquisition"
                  ? "Acquisition"
                  : "Rental"}
            </button>
          ))}
        </div>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewBtnActive : ""}`}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            {ListIcon}
          </button>
          <button
            className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewBtnActive : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            {GridIcon}
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className={styles.loadingState}>Loading quotations...</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No quotations found"
          description={
            quotations.length === 0
              ? "Add your first quotation using the button above."
              : "Try adjusting your search or filters."
          }
        />
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className={styles.grid}>
          {filtered.map((q) => (
            <QuotationCard key={q.id} item={q} />
          ))}
        </div>
      ) : (
        /* List / Table View */
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Group</th>
                <th>SubGroup</th>
                <th>PN</th>
                <th>Description</th>
                <th>Supplier</th>
                <th>Lead Time</th>
                <th>Date</th>
                <th>Type</th>
                <th>Cost (USD)</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id}>
                  <td>{groupMap[q.groupId] || "—"}</td>
                  <td>{subGroupMap[q.subGroupId] || "—"}</td>
                  <td className={styles.bold}>{q.partNumber}</td>
                  <td className={styles.descCell}>{q.description}</td>
                  <td>{q.supplier}</td>
                  <td>{q.leadTimeDays}d</td>
                  <td>{formatDate(q.quotationDate)}</td>
                  <td>
                    <span
                      className={`${styles.typeBadge} ${q.type === "rental" ? styles.rentalBadge : styles.acquisitionBadge}`}
                    >
                      {q.type === "rental" ? "Rental" : "Acq."}
                    </span>
                  </td>
                  <td className={styles.costCell}>
                    {formatCurrency(q.costUSD, "USD")}
                    {q.currency !== "USD" && (
                      <span className={styles.costOriginal}>
                        {formatCurrency(q.cost, q.currency)}
                      </span>
                    )}
                  </td>
                  <td className={styles.notesCell} title={q.notes}>
                    {q.notes
                      ? q.notes.length > 30
                        ? q.notes.slice(0, 30) + "…"
                        : q.notes
                      : "—"}
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button
                        className={styles.iconBtn}
                        onClick={() => handleToggleFavorite(q.id)}
                        title={
                          q.isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <StarIcon filled={q.isFavorite} />
                      </button>
                      {q.fileUrl && (
                        <button
                          className={styles.iconBtn}
                          onClick={() => openFile(q)}
                          title="Open file"
                        >
                          {ExternalLinkIcon}
                        </button>
                      )}
                      <button
                        className={styles.iconBtn}
                        onClick={() => setEditItem(q)}
                        title="Edit"
                      >
                        {EditIcon}
                      </button>
                      <button
                        className={`${styles.iconBtn} ${styles.dangerBtn}`}
                        onClick={() => handleDelete(q.id)}
                        title="Delete"
                      >
                        {TrashIcon}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showAddModal && <AddEditModal onClose={() => setShowAddModal(false)} />}
      {editItem && (
        <AddEditModal
          editingItem={editItem}
          onClose={() => setEditItem(null)}
        />
      )}
    </div>
  );
};
