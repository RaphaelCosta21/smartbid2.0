import * as React from "react";
import { IEquipmentItem } from "../../models";
import { formatCurrency } from "../../utils/formatters";
import styles from "./BidEquipmentTable.module.scss";

interface BidEquipmentTableProps {
  items: IEquipmentItem[];
  onEdit?: (item: IEquipmentItem) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

export const BidEquipmentTable: React.FC<BidEquipmentTableProps> = ({
  items = [],
  onEdit,
  onDelete,
  readOnly = false,
}) => {
  if (!items || items.length === 0) {
    return <div className={styles.empty}>No equipment items added yet</div>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {[
              "#",
              "Part Number",
              "Description",
              "Qty Op.",
              "Qty Spare",
              "Qty Buy",
              "Unit Cost",
              "Total Cost",
              "Category",
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
            {!readOnly && <th />}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.lineNumber}</td>
              <td className={styles.cellMono}>{item.partNumber}</td>
              <td>{item.toolDescription}</td>
              <td className={styles.cellCenter}>{item.qtyOperational}</td>
              <td className={styles.cellCenter}>{item.qtySpare}</td>
              <td className={styles.cellCenter}>{item.qtyToBuy}</td>
              <td className={styles.cellRight}>
                {formatCurrency(item.unitCostUSD)}
              </td>
              <td className={`${styles.cellRight} ${styles.cellBold}`}>
                {formatCurrency(item.totalCostUSD)}
              </td>
              <td>
                <span
                  className={styles.categoryBadge}
                  style={{
                    background:
                      item.costCategory === "CAPEX"
                        ? "rgba(59, 130, 246, 0.12)"
                        : "rgba(16, 185, 129, 0.12)",
                    color:
                      item.costCategory === "CAPEX"
                        ? "var(--primary-accent, #3B82F6)"
                        : "var(--success-color, #10B981)",
                  }}
                >
                  {item.costCategory}
                </span>
              </td>
              {!readOnly && (
                <td>
                  <div className={styles.actionsCell}>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className={styles.editBtn}
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
