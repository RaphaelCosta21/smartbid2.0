import * as React from "react";
import styles from "./BidExportButton.module.scss";

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
    <div className={`${styles.wrapper} ${className || ""}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className={styles.triggerBtn}
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
        <div className={styles.dropdown}>
          {onExportExcel && (
            <button
              onClick={() => {
                onExportExcel();
                setIsOpen(false);
              }}
              className={styles.dropdownItem}
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
              className={styles.dropdownItem}
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
              className={styles.dropdownItem}
            >
              Print
            </button>
          )}
        </div>
      )}
    </div>
  );
};
