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
  const scopeItems = template.scopeItems || [];
  const dataItems = scopeItems.filter((i) => !i.isSection);
  const sections = scopeItems.filter((i) => i.isSection);

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
        <strong>Division:</strong> {template.division} ·{" "}
        <strong>Service Line:</strong> {template.serviceLine} ·{" "}
        <strong>Items:</strong> {dataItems.length} · <strong>Sections:</strong>{" "}
        {sections.length}
      </div>
      {dataItems.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Resource Type</th>
              <th>Sub-Type</th>
              <th className={styles.thRight}>Qty Op</th>
              <th className={styles.thRight}>Qty Spare</th>
              <th>Compliance</th>
            </tr>
          </thead>
          <tbody>
            {dataItems.slice(0, 15).map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{item.description || "—"}</td>
                <td>{item.resourceType || "—"}</td>
                <td>{item.resourceSubType || "—"}</td>
                <td className={styles.cellRight}>{item.qtyOperational}</td>
                <td className={styles.cellRight}>{item.qtySpare}</td>
                <td>{item.compliance || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {dataItems.length > 15 && (
        <div className={styles.moreItems}>
          ...and {dataItems.length - 15} more items
        </div>
      )}
    </div>
  );
};
