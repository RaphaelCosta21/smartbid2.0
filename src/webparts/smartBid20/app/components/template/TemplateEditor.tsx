import * as React from "react";
import { IBidTemplate } from "../../models/IBidTemplate";
import { IEquipmentItem } from "../../models";
import styles from "./TemplateEditor.module.scss";

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
    <div className={`${styles.form} ${className || ""}`}>
      <div>
        <label className={styles.label}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
      </div>
      <div>
        <label className={styles.label}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
        />
      </div>
      <div>
        <label className={styles.label}>Division</label>
        <input
          type="text"
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          className={styles.input}
        />
      </div>
      <div>
        <label className={styles.label}>Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.actions}>
        <button onClick={onCancel} className={styles.cancelBtn}>
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!name}
          className={styles.saveBtn}
        >
          Save
        </button>
      </div>
    </div>
  );
};
