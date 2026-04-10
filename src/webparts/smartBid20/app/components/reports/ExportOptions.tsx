import * as React from "react";
import styles from "./ExportOptions.module.scss";

interface ExportOptionsProps {
  onExport: (format: "xlsx" | "pdf" | "print") => void;
  className?: string;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  onExport,
  className,
}) => {
  return (
    <div className={`${styles.row} ${className || ""}`}>
      <button onClick={() => onExport("xlsx")} className={styles.btn}>
        Export Excel
      </button>
      <button onClick={() => onExport("pdf")} className={styles.btn}>
        Export PDF
      </button>
      <button onClick={() => onExport("print")} className={styles.btn}>
        Print
      </button>
    </div>
  );
};
