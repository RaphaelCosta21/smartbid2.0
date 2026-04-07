import * as React from "react";
import { IEquipmentItem } from "../../models";

interface BidEquipmentTableProps {
  items: IEquipmentItem[];
  onEdit?: (item: IEquipmentItem) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

export const BidEquipmentTable: React.FC<BidEquipmentTableProps> = ({
  items,
  onEdit,
  onDelete,
  readOnly = false,
}) => {
  if (items.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 32,
          color: "var(--text-secondary)",
        }}
      >
        No equipment items added yet
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
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
              <th
                key={h}
                style={{
                  padding: "10px 12px",
                  textAlign: "left",
                  borderBottom: "1px solid var(--border-subtle)",
                  fontWeight: 600,
                  fontSize: 12,
                  color: "var(--text-secondary)",
                }}
              >
                {h}
              </th>
            ))}
            {!readOnly && (
              <th
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              />
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <td style={{ padding: "10px 12px" }}>{item.lineNumber}</td>
              <td style={{ padding: "10px 12px", fontFamily: "monospace" }}>
                {item.partNumber}
              </td>
              <td style={{ padding: "10px 12px" }}>{item.toolDescription}</td>
              <td style={{ padding: "10px 12px", textAlign: "center" }}>
                {item.qtyOperational}
              </td>
              <td style={{ padding: "10px 12px", textAlign: "center" }}>
                {item.qtySpare}
              </td>
              <td style={{ padding: "10px 12px", textAlign: "center" }}>
                {item.qtyToBuy}
              </td>
              <td style={{ padding: "10px 12px", textAlign: "right" }}>
                ${item.unitCostUSD.toLocaleString()}
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  textAlign: "right",
                  fontWeight: 600,
                }}
              >
                ${item.totalCostUSD.toLocaleString()}
              </td>
              <td style={{ padding: "10px 12px" }}>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    background:
                      item.costCategory === "CAPEX" ? "#3B82F620" : "#10B98120",
                    color:
                      item.costCategory === "CAPEX" ? "#3B82F6" : "#10B981",
                  }}
                >
                  {item.costCategory}
                </span>
              </td>
              {!readOnly && (
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          color: "var(--accent-color)",
                        }}
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          color: "#EF4444",
                        }}
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
