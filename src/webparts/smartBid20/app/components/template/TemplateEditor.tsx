import * as React from "react";
import { IBidTemplate } from "../../models/IBidTemplate";
import { IScopeItem, IHoursSummary } from "../../models";
import { useConfigStore } from "../../stores/useConfigStore";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { ScopeOfSupplyTab } from "../bid/ScopeOfSupplyTab";
import { BidHoursTable } from "../bid/BidHoursTable";
import { DIVISIONS, SERVICE_LINES } from "../../utils/constants";
import { makeId } from "../../utils/idGenerator";
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
  const currentUser = useCurrentUser();
  const config = useConfigStore((s) => s.config);

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
      id: template?.id || makeId("tpl"),
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
    };
    onSave(saved);
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
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Division</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className={styles.select}
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
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className={styles.checkbox}
              />
              Template is active and available for import
            </label>
          </div>

          <div className={styles.actions}>
            <button onClick={onCancel} className={styles.cancelBtn}>
              Cancel
            </button>
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
          <div className={styles.scopeHeader}>
            <div>
              <h3 className={styles.scopeTitle}>
                Scope of Supply — {name || "Template"}
              </h3>
              <p className={styles.scopeSubtitle}>
                Build the scope items for this template. These items will be
                imported directly into a BID&apos;s Scope of Supply.
              </p>
            </div>
          </div>

          <div className={styles.scopeContainer}>
            <ScopeOfSupplyTab
              scopeItems={scopeItems}
              onSave={setScopeItems}
              readOnly={false}
            />
          </div>

          <div className={styles.actions}>
            <button onClick={() => setStep(0)} className={styles.cancelBtn}>
              ← Back
            </button>
            <button onClick={onCancel} className={styles.cancelBtn}>
              Cancel
            </button>
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
          <div className={styles.scopeHeader}>
            <div>
              <h3 className={styles.scopeTitle}>
                Hours &amp; Personnel — {name || "Template"}
              </h3>
              <p className={styles.scopeSubtitle}>
                Define the hours and personnel structure for this template.
                These will be imported directly into a BID&apos;s Hours &amp;
                Personnel tab.
              </p>
            </div>
          </div>

          <div className={styles.scopeContainer}>
            <BidHoursTable
              hoursSummary={hoursSummary}
              readOnly={false}
              onSave={setHoursSummary}
            />
          </div>

          <div className={styles.actions}>
            <button onClick={() => setStep(1)} className={styles.cancelBtn}>
              ← Back
            </button>
            <button onClick={onCancel} className={styles.cancelBtn}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canProceed}
              className={styles.saveBtn}
            >
              {template ? "Update Template" : "Create Template"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
