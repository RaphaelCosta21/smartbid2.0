import * as React from "react";
import { IBidTemplate } from "../../models/IBidTemplate";

interface TemplatePreviewProps {
  template: IBidTemplate;
  onClose: () => void;
  className?: string;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  onClose,
  className,
}) => {
  return (
    <div
      className={className}
      style={{
        padding: 20,
        borderRadius: 12,
        border: "1px solid var(--border-subtle)",
        background: "var(--card-bg)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h4 style={{ margin: 0 }}>{template.name}</h4>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          ×
        </button>
      </div>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          marginBottom: 16,
        }}
      >
        {template.description}
      </p>
      <div style={{ fontSize: 13, marginBottom: 16 }}>
        <strong>Division:</strong> {template.division} · <strong>Items:</strong>{" "}
        {template.equipmentItems.length}
      </div>
      {template.equipmentItems.length > 0 && (
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: 8,
                  textAlign: "left",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                Part #
              </th>
              <th
                style={{
                  padding: 8,
                  textAlign: "left",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                Description
              </th>
              <th
                style={{
                  padding: 8,
                  textAlign: "right",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                Qty
              </th>
              <th
                style={{
                  padding: 8,
                  textAlign: "right",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {template.equipmentItems.slice(0, 10).map((item) => (
              <tr
                key={item.id}
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <td style={{ padding: 8, fontFamily: "monospace" }}>
                  {item.partNumber}
                </td>
                <td style={{ padding: 8 }}>{item.toolDescription}</td>
                <td style={{ padding: 8, textAlign: "right" }}>
                  {item.qtyOperational}
                </td>
                <td style={{ padding: 8, textAlign: "right" }}>
                  ${item.unitCostUSD.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {template.equipmentItems.length > 10 && (
        <div
          style={{
            textAlign: "center",
            padding: 8,
            fontSize: 12,
            color: "var(--text-secondary)",
          }}
        >
          ...and {template.equipmentItems.length - 10} more items
        </div>
      )}
    </div>
  );
};
