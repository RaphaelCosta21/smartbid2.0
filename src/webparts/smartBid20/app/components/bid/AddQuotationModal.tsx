/**
 * AddQuotationModal — Reusable modal for adding a quotation item.
 * Extracted from QuotationsPage so it can be used in AssetsBreakdownTab
 * and CostSearchModal contexts.
 */
import * as React from "react";
import { useConfigStore } from "../../stores/useConfigStore";
import { useQuotationStore } from "../../stores/useQuotationStore";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useUIStore } from "../../stores/useUIStore";
import { QuotationService } from "../../services/QuotationService";
import { convertToUSD } from "../../utils/costCalculations";
import { formatCurrency } from "../../utils/formatters";
import {
  IQuotationItem,
  QuotationType,
  IFavoriteGroup,
  IExchangeRate,
} from "../../models";
import styles from "./AddQuotationModal.module.scss";

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
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

function blankLineItem(partNumber?: string, description?: string): ILineItem {
  return {
    _key: genId(),
    groupId: "",
    subGroupId: "",
    partNumber: partNumber || "",
    description: description || "",
    supplier: "",
    leadTimeDays: 0,
    quotationDate: new Date().toISOString().slice(0, 10),
    type: "acquisition" as QuotationType,
    cost: 0,
    currency: "USD",
    notes: "",
  };
}

export interface AddQuotationModalProps {
  onClose: () => void;
  /** Called after successful save with the new items */
  onSaved?: (items: IQuotationItem[]) => void;
  /** Pre-fill part number */
  defaultPartNumber?: string;
  /** Pre-fill description */
  defaultDescription?: string;
}

export const AddQuotationModal: React.FC<AddQuotationModalProps> = ({
  onClose,
  onSaved,
  defaultPartNumber,
  defaultDescription,
}) => {
  const config = useConfigStore((s) => s.config);
  const currentUser = useCurrentUser();
  const { addItems } = useQuotationStore();
  const addToast = useUIStore((s) => s.addToast);

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

  const [file, setFile] = React.useState<File | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [lines, setLines] = React.useState<ILineItem[]>([
    blankLineItem(defaultPartNumber, defaultDescription),
  ]);

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
      let fileUrl: string | undefined;
      let fileName: string | undefined;
      if (file) {
        fileUrl = await QuotationService.uploadFile(file);
        fileName = file.name;
      }

      const now = new Date().toISOString();
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

      if (onSaved) onSaved(newItems);
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
          <h2>Add Quotation</h2>
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
            </div>
          </div>

          {/* Line Items */}
          <div className={styles.linesSection}>
            <div className={styles.linesSectionHeader}>
              <h3>Items</h3>
              <button className={styles.addLineBtn} onClick={addLine}>
                + Add Item
              </button>
            </div>

            {lines.map((line, idx) => (
              <div key={line._key} className={styles.lineItem}>
                <div className={styles.lineHeader}>
                  <span className={styles.lineNumber}>Item {idx + 1}</span>
                  {lines.length > 1 && (
                    <button
                      className={styles.removeLineBtn}
                      onClick={() => removeLine(line._key)}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className={styles.formGrid}>
                  {/* Group + SubGroup */}
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

                  {/* PN + Description */}
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

                  {/* Supplier + Lead Time + Date */}
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

                  {/* Type toggle */}
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
                        onClick={() => updateLine(line._key, "type", "rental")}
                      >
                        Rental (Day Rate)
                      </button>
                    </div>
                  </div>

                  {/* Cost + Currency */}
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
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};
