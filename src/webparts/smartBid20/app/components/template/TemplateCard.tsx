import * as React from "react";
import { IBidTemplate } from "../../models/IBidTemplate";
import styles from "./TemplateCard.module.scss";

interface TemplateCardProps {
  template: IBidTemplate;
  onSelect?: () => void;
  onView?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  className?: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  onView,
  onDelete,
  onDuplicate,
  className,
}) => {
  const scopeDataItems = (template.scopeItems || []).filter(
    (i) => !i.isSection,
  );
  const sectionCount = (template.scopeItems || []).filter(
    (i) => i.isSection,
  ).length;

  return (
    <div
      className={`${styles.card} ${className || ""}`}
      style={{ cursor: onSelect ? "pointer" : "default" }}
      onClick={onSelect}
    >
      <div className={styles.header}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 className={styles.title}>{template.name}</h4>
          <div className={styles.badges}>
            {template.division && (
              <span className={styles.divBadge}>{template.division}</span>
            )}
            {template.serviceLine && (
              <span className={styles.slBadge}>{template.serviceLine}</span>
            )}
            {template.category && (
              <span className={styles.catBadge}>{template.category}</span>
            )}
          </div>
        </div>
        <span
          className={`${styles.statusBadge} ${template.isActive ? styles.active : styles.inactive}`}
        >
          {template.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {template.description && (
        <p className={styles.description}>{template.description}</p>
      )}

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{scopeDataItems.length}</span>
          <span className={styles.statLabel}>Items</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{sectionCount}</span>
          <span className={styles.statLabel}>Sections</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{template.usageCount}</span>
          <span className={styles.statLabel}>Used</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>v{template.version}</span>
          <span className={styles.statLabel}>Version</span>
        </div>
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

      <div className={styles.footer}>
        <span className={styles.creator}>By {template.createdBy || "—"}</span>
        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          {onDuplicate && (
            <button
              className={styles.actionBtn}
              onClick={onDuplicate}
              title="Duplicate"
            >
              📋
            </button>
          )}
          {onView && (
            <button className={styles.actionBtn} onClick={onView} title="View">
              👁️
            </button>
          )}
          {onDelete && (
            <button
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              onClick={onDelete}
              title="Delete"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
