import * as React from "react";
import styles from "./ExportBar.module.scss";

interface ExportBarProps {
  onExcel?: () => void;
  onCsv?: () => void;
  onPdf?: () => void;
  onPrint?: () => void;
  busy?: boolean;
}

const ExcelIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M9 13l6 5M15 13l-6 5" />
  </svg>
);

const PdfIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 15h1.5a1.5 1.5 0 000-3H8v5M17 12h-2v5M15 15h1.5" />
  </svg>
);

const CsvIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </svg>
);

const PrintIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

/**
 * ExportBar — glass export actions (Excel / CSV / PDF / Print).
 * Only renders the buttons whose handlers are provided.
 */
export const ExportBar: React.FC<ExportBarProps> = ({
  onExcel,
  onCsv,
  onPdf,
  onPrint,
  busy,
}) => {
  return (
    <div className={styles.bar}>
      {onExcel && (
        <button
          type="button"
          className={styles.btn}
          onClick={onExcel}
          disabled={busy}
          title="Exportar Excel"
        >
          {ExcelIcon}
          <span>Excel</span>
        </button>
      )}
      {onPdf && (
        <button
          type="button"
          className={`${styles.btn} ${styles.pdf}`}
          onClick={onPdf}
          disabled={busy}
          title="Exportar PDF"
        >
          {PdfIcon}
          <span>PDF</span>
        </button>
      )}
      {onCsv && (
        <button
          type="button"
          className={styles.btn}
          onClick={onCsv}
          disabled={busy}
          title="Exportar CSV"
        >
          {CsvIcon}
          <span>CSV</span>
        </button>
      )}
      {onPrint && (
        <button
          type="button"
          className={styles.btn}
          onClick={onPrint}
          disabled={busy}
          title="Imprimir"
        >
          {PrintIcon}
          <span>Imprimir</span>
        </button>
      )}
    </div>
  );
};
