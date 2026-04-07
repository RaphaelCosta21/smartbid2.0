import * as React from "react";
import { IBidTemplate } from "../../models/IBidTemplate";

interface BidTemplateImportProps {
  isOpen: boolean;
  templates: IBidTemplate[];
  onImport: (template: IBidTemplate) => void;
  onClose: () => void;
}

export const BidTemplateImport: React.FC<BidTemplateImportProps> = ({
  isOpen,
  templates,
  onImport,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--card-bg, #fff)",
          borderRadius: 16,
          padding: 24,
          maxWidth: 600,
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 600 }}>
          Import Template
        </h3>
        {templates.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 32,
              color: "var(--text-secondary)",
            }}
          >
            No templates available
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onImport(template)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                  borderRadius: 8,
                  border: "1px solid var(--border-subtle)",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {template.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {template.division} · {template.equipmentItems.length} items
                  </div>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        )}
        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            width: "100%",
            padding: "10px",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            background: "transparent",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
