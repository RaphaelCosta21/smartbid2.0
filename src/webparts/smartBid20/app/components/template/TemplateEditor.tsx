import * as React from "react";
import { IBidTemplate } from "../../models/IBidTemplate";
import { IScopeItem, IHoursSummary, IBidAttachment } from "../../models";
import { useConfigStore } from "../../stores/useConfigStore";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { ScopeOfSupplyTab } from "../bid/ScopeOfSupplyTab";
import { BidHoursTable } from "../bid/BidHoursTable";
import { EditToolbar } from "../common/EditLockBanner";
import { useEditControl } from "../../hooks/useEditControl";
import { useAccessLevel } from "../../hooks/useAccessLevel";
import { DIVISIONS, SERVICE_LINES } from "../../utils/constants";
import { makeId } from "../../utils/idGenerator";
import { AttachmentService } from "../../services/AttachmentService";
import styles from "./TemplateEditor.module.scss";

interface TemplateEditorProps {
  template?: IBidTemplate;
  onSave: (template: IBidTemplate) => void;
  onCancel: () => void;
  /** When true, opens in read-only mode with Edit buttons per section */
  viewOnly?: boolean;
  className?: string;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
  viewOnly = false,
  className,
}) => {
  const currentUser = useCurrentUser();
  const config = useConfigStore((s) => s.config);
  const { canEdit: canEditSection, isSuperAdmin } = useAccessLevel();
  const canEditTemplates = canEditSection("templates") || isSuperAdmin;

  // Stable ID for this template (existing or new)
  const [stableId] = React.useState(() => template?.id || makeId("tpl"));

  // Edit control per step (only used in viewOnly mode)
  const editControlInfo = useEditControl(stableId, "template-info");
  const editControlScope = useEditControl(stableId, "template-scope");
  const editControlHours = useEditControl(stableId, "template-hours");

  // In viewOnly mode, steps are read-only unless user acquires the lock
  const isInfoEditing = viewOnly ? editControlInfo.isEditing : true;
  const isScopeEditing = viewOnly ? editControlScope.isEditing : true;
  const isHoursEditing = viewOnly ? editControlHours.isEditing : true;

  const [name, setName] = React.useState(template?.name || "");
  const [description, setDescription] = React.useState(
    template?.description || "",
  );
  const [division, setDivision] = React.useState(template?.division || "");
  const [serviceLine, setServiceLine] = React.useState(
    template?.serviceLine || "",
  );
  const [category, setCategory] = React.useState(template?.category || "");
  const [tags, setTags] = React.useState(template?.tags.join(", ") || "");
  const [isActive, setIsActive] = React.useState(template?.isActive !== false);
  const [scopeItems, setScopeItems] = React.useState<IScopeItem[]>(
    template?.scopeItems || [],
  );

  const EMPTY_HOURS: IHoursSummary = {
    engineeringHours: { totalHours: 0, totalCostBRL: 0, items: [] },
    onshoreHours: { totalHours: 0, totalCostBRL: 0, items: [] },
    offshoreHours: { totalHours: 0, totalCostBRL: 0, items: [] },
    totalsByDivision: {},
    grandTotalHours: 0,
    grandTotalCostBRL: 0,
    grandTotalCostUSD: 0,
  };

  const [hoursSummary, setHoursSummary] = React.useState<IHoursSummary>(
    template?.hoursSummary || EMPTY_HOURS,
  );

  // Attachments state
  const [attachments, setAttachments] = React.useState<IBidAttachment[]>(
    template?.attachments || [],
  );
  const [isUploading, setIsUploading] = React.useState(false);
  const templateFileInputRef = React.useRef<HTMLInputElement>(null);

  // Step: 0 = metadata, 1 = scope items, 2 = hours & personnel
  const [step, setStep] = React.useState(0);

  const serviceLineOptions = React.useMemo(() => {
    const allLines = config?.serviceLines
      ? config.serviceLines.filter((sl) => sl.isActive)
      : (
          SERVICE_LINES as unknown as { value: string; category?: string }[]
        ).map((v) => (typeof v === "string" ? { value: v } : v));

    // Filter by selected division's category mapping
    if (division) {
      const divUpper = division.toUpperCase();
      return allLines
        .filter((sl) => {
          const cat =
            ((sl as Record<string, unknown>).category as string) || "";
          return cat.toUpperCase() === divUpper;
        })
        .map((sl) => sl.value);
    }
    return allLines.map((sl) => sl.value);
  }, [config, division]);

  const divisionOptions = React.useMemo(() => {
    if (config?.divisions) {
      return config.divisions.filter((d) => d.isActive).map((d) => d.value);
    }
    return DIVISIONS as unknown as string[];
  }, [config]);

  // Clear service line when division changes and current value is no longer valid
  React.useEffect(() => {
    if (
      serviceLine &&
      serviceLineOptions.length > 0 &&
      !serviceLineOptions.includes(serviceLine)
    ) {
      setServiceLine("");
    }
  }, [division, serviceLineOptions, serviceLine]);

  const handleSave = (): void => {
    const saved: IBidTemplate = {
      id: stableId,
      name,
      description,
      division,
      serviceLine,
      category,
      scopeItems,
      hoursSummary,
      createdBy: template?.createdBy || currentUser?.displayName || "",
      createdDate: template?.createdDate || new Date().toISOString(),
      lastModified: new Date().toISOString(),
      lastModifiedBy: currentUser?.displayName || "",
      version: (template?.version || 0) + 1,
      usageCount: template?.usageCount || 0,
      isActive,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      attachments,
    };
    onSave(saved);
  };

  const handleTemplateFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsUploading(true);
    try {
      const uploaded = await AttachmentService.uploadTemplateFile(
        stableId,
        file,
      );
      setAttachments((prev) => [...prev, uploaded]);
    } catch (err) {
      console.error("Failed to upload template attachment:", err);
      // Fallback: store as local reference
      const localAtt: IBidAttachment = {
        id: makeId("att"),
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size,
        fileType: file.type,
        uploadedBy: currentUser?.displayName || "",
        uploadedDate: new Date().toISOString(),
        category: "template",
      };
      setAttachments((prev) => [...prev, localAtt]);
    }
    setIsUploading(false);
  };

  const removeTemplateAttachment = (attId: string): void => {
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
  };

  const canProceed = name.trim().length > 0;

  return (
    <div className={`${styles.editor} ${className || ""}`}>
      {/* Step indicator */}
      <div className={styles.steps}>
        <button
          className={`${styles.stepBtn} ${step === 0 ? styles.stepActive : ""}`}
          onClick={() => setStep(0)}
        >
          <span className={styles.stepNum}>1</span>
          Template Info
        </button>
        <div className={styles.stepDivider} />
        <button
          className={`${styles.stepBtn} ${step === 1 ? styles.stepActive : ""}`}
          onClick={() => canProceed && setStep(1)}
          disabled={!canProceed}
        >
          <span className={styles.stepNum}>2</span>
          Scope of Supply
        </button>
        <div className={styles.stepDivider} />
        <button
          className={`${styles.stepBtn} ${step === 2 ? styles.stepActive : ""}`}
          onClick={() => canProceed && setStep(2)}
          disabled={!canProceed}
        >
          <span className={styles.stepNum}>3</span>
          Hours &amp; Personnel
        </button>
      </div>

      {step === 0 && (
        <div className={styles.form}>
          {viewOnly && (
            <EditToolbar
              editControl={editControlInfo}
              canEdit={canEditTemplates}
              label="Template Info"
            />
          )}
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Template Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                placeholder="e.g., Multibeam Survey Standard"
                disabled={!isInfoEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.input}
                placeholder="e.g., Survey, ROV Inspection"
                disabled={!isInfoEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Division</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className={styles.select}
                disabled={!isInfoEditing}
              >
                <option value="">Select division...</option>
                {divisionOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Service Line</label>
              <select
                value={serviceLine}
                onChange={(e) => setServiceLine(e.target.value)}
                className={styles.select}
                disabled={!isInfoEditing}
              >
                <option value="">Select service line...</option>
                {serviceLineOptions.map((sl) => (
                  <option key={sl} value={sl}>
                    {sl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              placeholder="Brief description of when to use this template..."
              rows={3}
              disabled={!isInfoEditing}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Tags <span className={styles.hint}>(comma separated)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={styles.input}
              placeholder="e.g., multibeam, survey, pipeline"
              disabled={!isInfoEditing}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className={styles.checkbox}
                disabled={!isInfoEditing}
              />
              Template is active and available for import
            </label>
          </div>

          {/* Template Attachments Section */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Attachments{" "}
              <span className={styles.hint}>
                (client specifications, PDFs, etc.)
              </span>
            </label>
            <input
              ref={templateFileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={handleTemplateFileUpload}
            />
            {attachments.length > 0 && (
              <div className={styles.attachList}>
                {attachments.map((att) => (
                  <div key={att.id} className={styles.attachItem}>
                    <span className={styles.attachIcon}>📄</span>
                    <a
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.attachName}
                      title={att.fileName}
                    >
                      {att.fileName}
                    </a>
                    <span className={styles.attachSize}>
                      {att.fileSize > 1024 * 1024
                        ? `${(att.fileSize / (1024 * 1024)).toFixed(1)} MB`
                        : `${Math.round(att.fileSize / 1024)} KB`}
                    </span>
                    {isInfoEditing && (
                      <button
                        className={styles.attachDelete}
                        onClick={() => removeTemplateAttachment(att.id)}
                        title="Remove attachment"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {isInfoEditing && (
              <button
                className={styles.attachBtn}
                onClick={() => templateFileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "📎 Attach File"}
              </button>
            )}
          </div>

          <div className={styles.actions}>
            <button onClick={onCancel} className={styles.cancelBtn}>
              {viewOnly ? "Close" : "Cancel"}
            </button>
            {isInfoEditing && (
              <button
                onClick={handleSave}
                disabled={!canProceed}
                className={styles.saveBtn}
              >
                Save
              </button>
            )}
            <button
              onClick={() => setStep(1)}
              disabled={!canProceed}
              className={styles.nextBtn}
            >
              Next: Scope of Supply →
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className={styles.scopeStep}>
          {viewOnly && (
            <EditToolbar
              editControl={editControlScope}
              canEdit={canEditTemplates}
              label="Scope of Supply"
            />
          )}
          <div className={styles.scopeHeader}>
            <div>
              <h3 className={styles.scopeTitle}>
                Scope of Supply — {name || "Template"}
              </h3>
              <p className={styles.scopeSubtitle}>
                {isScopeEditing
                  ? "Build the scope items for this template. These items will be imported directly into a BID's Scope of Supply."
                  : "Viewing scope items. Click Edit to make changes."}
              </p>
            </div>
          </div>

          <div className={styles.scopeContainer}>
            <ScopeOfSupplyTab
              scopeItems={scopeItems}
              onSave={setScopeItems}
              readOnly={!isScopeEditing}
              templateId={stableId}
            />
          </div>

          <div className={styles.actions}>
            <button onClick={() => setStep(0)} className={styles.cancelBtn}>
              ← Back
            </button>
            <button onClick={onCancel} className={styles.cancelBtn}>
              {viewOnly ? "Close" : "Cancel"}
            </button>
            {isScopeEditing && (
              <button
                onClick={handleSave}
                disabled={!canProceed}
                className={styles.saveBtn}
              >
                Save
              </button>
            )}
            <button
              onClick={() => setStep(2)}
              disabled={!canProceed}
              className={styles.nextBtn}
            >
              Next: Hours &amp; Personnel →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={styles.scopeStep}>
          {viewOnly && (
            <EditToolbar
              editControl={editControlHours}
              canEdit={canEditTemplates}
              label="Hours & Personnel"
            />
          )}
          <div className={styles.scopeHeader}>
            <div>
              <h3 className={styles.scopeTitle}>
                Hours &amp; Personnel — {name || "Template"}
              </h3>
              <p className={styles.scopeSubtitle}>
                {isHoursEditing
                  ? "Define the hours and personnel structure for this template. These will be imported directly into a BID's Hours & Personnel tab."
                  : "Viewing hours & personnel. Click Edit to make changes."}
              </p>
            </div>
          </div>

          <div className={styles.scopeContainer}>
            <BidHoursTable
              hoursSummary={hoursSummary}
              readOnly={!isHoursEditing}
              onSave={setHoursSummary}
            />
          </div>

          <div className={styles.actions}>
            <button onClick={() => setStep(1)} className={styles.cancelBtn}>
              ← Back
            </button>
            <button onClick={onCancel} className={styles.cancelBtn}>
              {viewOnly ? "Close" : "Cancel"}
            </button>
            {isHoursEditing && (
              <button
                onClick={handleSave}
                disabled={!canProceed}
                className={styles.saveBtn}
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
