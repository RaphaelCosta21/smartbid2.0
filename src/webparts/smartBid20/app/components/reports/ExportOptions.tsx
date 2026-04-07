import * as React from "react";

interface ExportOptionsProps {
  onExport: (format: "xlsx" | "pdf" | "print") => void;
  className?: string;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  onExport,
  className,
}) => {
  return (
    <div className={className} style={{ display: "flex", gap: 8 }}>
      <button
        onClick={() => onExport("xlsx")}
        style={{
          padding: "8px 16px",
          border: "1px solid var(--border-subtle)",
          borderRadius: 8,
          background: "transparent",
          cursor: "pointer",
        }}
      >
        Export Excel
      </button>
      <button
        onClick={() => onExport("pdf")}
        style={{
          padding: "8px 16px",
          border: "1px solid var(--border-subtle)",
          borderRadius: 8,
          background: "transparent",
          cursor: "pointer",
        }}
      >
        Export PDF
      </button>
      <button
        onClick={() => onExport("print")}
        style={{
          padding: "8px 16px",
          border: "1px solid var(--border-subtle)",
          borderRadius: 8,
          background: "transparent",
          cursor: "pointer",
        }}
      >
        Print
      </button>
    </div>
  );
};
