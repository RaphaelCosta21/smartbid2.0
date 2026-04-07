import * as React from "react";

interface BidExportButtonProps {
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  onPrint?: () => void;
  isExporting?: boolean;
  className?: string;
}

export const BidExportButton: React.FC<BidExportButtonProps> = ({
  onExportExcel,
  onExportPDF,
  onPrint,
  isExporting = false,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={className} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          border: "1px solid var(--border-subtle)",
          borderRadius: 8,
          background: "var(--card-bg)",
          cursor: isExporting ? "not-allowed" : "pointer",
          fontSize: 14,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {isExporting ? "Exporting..." : "Export"}
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 4,
            background: "var(--card-bg)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            minWidth: 160,
            zIndex: 100,
          }}
        >
          {onExportExcel && (
            <button
              onClick={() => {
                onExportExcel();
                setIsOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 16px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 14,
              }}
            >
              Export to Excel
            </button>
          )}
          {onExportPDF && (
            <button
              onClick={() => {
                onExportPDF();
                setIsOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 16px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 14,
              }}
            >
              Export to PDF
            </button>
          )}
          {onPrint && (
            <button
              onClick={() => {
                onPrint();
                setIsOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 16px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 14,
              }}
            >
              Print
            </button>
          )}
        </div>
      )}
    </div>
  );
};
