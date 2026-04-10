import * as React from "react";
import { IBidTemplate } from "../../models/IBidTemplate";
import styles from "./TemplatePreview.module.scss";

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
    <div className={`${styles.container} ${className || ""}`}>
      <div className={styles.header}>
        <h4 className={styles.title}>{template.name}</h4>
        <button onClick={onClose} className={styles.closeBtn}>
          ×
        </button>
      </div>
      <p className={styles.description}>{template.description}</p>
      <div className={styles.info}>
        <strong>Division:</strong> {template.division} · <strong>Items:</strong>{" "}
        {template.equipmentItems.length}
      </div>
      {template.equipmentItems.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Part #</th>
              <th>Description</th>
              <th className={styles.thRight}>Qty</th>
              <th className={styles.thRight}>Cost</th>
            </tr>
          </thead>
          <tbody>
            {template.equipmentItems.slice(0, 10).map((item) => (
              <tr key={item.id}>
                <td className={styles.cellMono}>{item.partNumber}</td>
                <td>{item.toolDescription}</td>
                <td className={styles.cellRight}>{item.qtyOperational}</td>
                <td className={styles.cellRight}>
                  ${item.unitCostUSD.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {template.equipmentItems.length > 10 && (
        <div className={styles.moreItems}>
          ...and {template.equipmentItems.length - 10} more items
        </div>
      )}
    </div>
  );
};
