import * as React from "react";
import { IBidTemplate } from "../../models/IBidTemplate";

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
      className={className}
      style={{
        padding: 16,
        borderRadius: 12,
        border: "1px solid var(--border-subtle)",
        background: "var(--card-bg)",
        cursor: onSelect ? "pointer" : "default",
      }}
      onClick={onSelect}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            {template.name}
          </h4>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            {template.description}
          </p>
        </div>
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--accent-color)",
            }}
          >
            Edit
          </button>
        )}
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 12,
          fontSize: 12,
          color: "var(--text-secondary)",
        }}
      >
        <span>{template.division}</span>
        <span>{template.equipmentItems.length} items</span>
        <span>Used {template.usageCount}x</span>
      </div>
      {template.tags.length > 0 && (
        <div
          style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}
        >
          {template.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "2px 8px",
                borderRadius: 8,
                fontSize: 11,
                background: "var(--border-subtle)",
                color: "var(--text-secondary)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
