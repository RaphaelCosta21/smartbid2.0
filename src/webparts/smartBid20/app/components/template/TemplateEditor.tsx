import * as React from "react";
import { IBidTemplate } from "../../models/IBidTemplate";
import { IEquipmentItem } from "../../models";

interface TemplateEditorProps {
  template?: IBidTemplate;
  onSave: (template: IBidTemplate) => void;
  onCancel: () => void;
  className?: string;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
  className,
}) => {
  const [name, setName] = React.useState(template?.name || "");
  const [description, setDescription] = React.useState(
    template?.description || "",
  );
  const [division, setDivision] = React.useState(template?.division || "");
  const [tags, setTags] = React.useState(template?.tags.join(", ") || "");

  const handleSave = (): void => {
    const saved: IBidTemplate = {
      id: template?.id || crypto.randomUUID(),
      name,
      description,
      division,
      serviceLine: template?.serviceLine || "",
      category: template?.category || "",
      equipmentItems: template?.equipmentItems || ([] as IEquipmentItem[]),
      createdBy: template?.createdBy || "",
      createdDate: template?.createdDate || new Date().toISOString(),
      lastModified: new Date().toISOString(),
      lastModifiedBy: template?.lastModifiedBy || "",
      version: template?.version || 1,
      usageCount: template?.usageCount || 0,
      isActive: true,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    onSave(saved);
  };

  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div>
        <label
          style={{
            fontSize: 13,
            fontWeight: 600,
            display: "block",
            marginBottom: 4,
          }}
        >
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            fontSize: 14,
          }}
        />
      </div>
      <div>
        <label
          style={{
            fontSize: 13,
            fontWeight: 600,
            display: "block",
            marginBottom: 4,
          }}
        >
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            fontSize: 14,
            minHeight: 60,
            resize: "vertical",
          }}
        />
      </div>
      <div>
        <label
          style={{
            fontSize: 13,
            fontWeight: 600,
            display: "block",
            marginBottom: 4,
          }}
        >
          Division
        </label>
        <input
          type="text"
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            fontSize: 14,
          }}
        />
      </div>
      <div>
        <label
          style={{
            fontSize: 13,
            fontWeight: 600,
            display: "block",
            marginBottom: 4,
          }}
        >
          Tags (comma separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            fontSize: 14,
          }}
        />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "8px 20px",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!name}
          style={{
            padding: "8px 20px",
            background: "var(--accent-color, #3B82F6)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};
