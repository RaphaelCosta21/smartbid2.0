import * as React from "react";
import { IBidTemplate } from "../../models/IBidTemplate";
import styles from "./TemplateCard.module.scss";

interface TemplateCardProps {
  template: IBidTemplate;
  onSelect?: () => void;
  onEdit?: () => void;
  className?: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  onEdit,
  className,
}) => {
  return (
    <div
      className={`${styles.card} ${className || ""}`}
      style={{ cursor: onSelect ? "pointer" : "default" }}
      onClick={onSelect}
    >
      <div className={styles.header}>
        <div>
          <h4 className={styles.title}>{template.name}</h4>
          <p className={styles.description}>{template.description}</p>
        </div>
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className={styles.editBtn}
          >
            Edit
          </button>
        )}
      </div>
      <div className={styles.meta}>
        <span>{template.division}</span>
        <span>{template.equipmentItems.length} items</span>
        <span>Used {template.usageCount}x</span>
      </div>
      {template.tags.length > 0 && (
        <div className={styles.tags}>
          {template.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
