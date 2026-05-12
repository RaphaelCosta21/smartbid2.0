import * as React from "react";
import {
  IBid,
  IScopeItem,
  IHoursSummary,
  IEngineeringHoursItem,
  IResourceAllocation,
} from "../../models";
import { IBidTemplate } from "../../models/IBidTemplate";
import { useBidStore } from "../../stores/useBidStore";
import { useTemplateStore } from "../../stores/useTemplateStore";
import { isTerminalStatus } from "../../utils/statusHelpers";
import { ImportSourceList, IImportSource } from "./ImportSourceList";
import { ScopeImportPreview, IScopeImportResult } from "./ScopeImportPreview";
import { HoursImportPreview } from "./HoursImportPreview";
import styles from "./ImportSourceModal.module.scss";

export type ImportMode = "scope" | "hours";

interface ImportSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  importMode: ImportMode;
  currentDivision?: string;
  onImportScope?: (result: IScopeImportResult) => void;
  onImportHours?: (hours: Partial<IHoursSummary>) => void;
}

export const ImportSourceModal: React.FC<ImportSourceModalProps> = ({
  isOpen,
  onClose,
  importMode,
  currentDivision,
  onImportScope,
  onImportHours,
}) => {
  const [step, setStep] = React.useState<0 | 1>(0);
  const [selectedSource, setSelectedSource] =
    React.useState<IImportSource | null>(null);
  const [selectedBid, setSelectedBid] = React.useState<IBid | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<IBidTemplate | null>(null);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setSelectedSource(null);
      setSelectedBid(null);
      setSelectedTemplate(null);
    }
  }, [isOpen]);

  // Build sources from completed bids + templates
  const bids = useBidStore((s) => s.bids);
  const templates = useTemplateStore((s) => s.templates);
  const templatesLoading = useTemplateStore((s) => s.isLoading);
  const loadTemplates = useTemplateStore((s) => s.loadTemplates);

  // Ensure templates are loaded when modal opens
  React.useEffect(() => {
    if (isOpen && templates.length === 0 && !templatesLoading) {
      loadTemplates();
    }
  }, [isOpen]);

  const sources: IImportSource[] = React.useMemo(() => {
    const result: IImportSource[] = [];

    // Add completed BIDs
    bids.forEach((bid) => {
      if (isTerminalStatus(bid.currentStatus)) {
        const hasScopeContent =
          importMode === "scope" ? (bid.scopeItems || []).length > 0 : true;
        const hasHoursContent =
          importMode === "hours"
            ? bid.hoursSummary &&
              ((bid.hoursSummary.engineeringHours?.items?.length || 0) > 0 ||
                (bid.hoursSummary.onshoreHours?.items?.length || 0) > 0 ||
                (bid.hoursSummary.offshoreHours?.items?.length || 0) > 0)
            : true;

        if (hasScopeContent || hasHoursContent) {
          result.push({
            id: bid.bidNumber,
            type: "bid",
            title: bid.opportunityInfo?.projectName || bid.bidNumber,
            subtitle:
              bid.bidNumber + (bid.crmNumber ? ` · CRM: ${bid.crmNumber}` : ""),
            division: bid.division || "",
            serviceLine: bid.serviceLine || "",
            date: bid.createdDate || "",
            itemCount:
              importMode === "scope"
                ? (bid.scopeItems || []).filter((i) => !i.isSection).length
                : bid.hoursSummary?.grandTotalHours || 0,
            itemLabel: importMode === "scope" ? "items" : "hrs",
            tags: [],
            sourceData: bid,
          });
        }
      }
    });

    // Add active templates
    templates.forEach((tpl) => {
      if (tpl.isActive === false) return;
      const hasScopeContent =
        importMode === "scope" ? (tpl.scopeItems || []).length > 0 : true;
      const hasHoursContent =
        importMode === "hours"
          ? tpl.hoursSummary &&
            ((tpl.hoursSummary as any)?.engineeringHours?.items?.length > 0 ||
              (tpl.hoursSummary as any)?.onshoreHours?.items?.length > 0 ||
              (tpl.hoursSummary as any)?.offshoreHours?.items?.length > 0)
          : true;

      if (hasScopeContent || hasHoursContent) {
        result.push({
          id: tpl.id,
          type: "template",
          title: tpl.name,
          subtitle: tpl.description || tpl.category || "",
          division: tpl.division || "",
          serviceLine: tpl.serviceLine || "",
          date: tpl.lastModified || tpl.createdDate || "",
          itemCount:
            importMode === "scope"
              ? (tpl.scopeItems || []).filter((i: IScopeItem) => !i.isSection)
                  .length
              : (tpl.hoursSummary as any)?.grandTotalHours || 0,
          itemLabel: importMode === "scope" ? "items" : "hrs",
          tags: tpl.tags || [],
          sourceData: tpl,
        });
      }
    });

    return result;
  }, [bids, templates, importMode]);

  const handleSelectSource = (source: IImportSource): void => {
    setSelectedSource(source);
    if (source.type === "bid") {
      setSelectedBid(source.sourceData as IBid);
      setSelectedTemplate(null);
    } else {
      setSelectedTemplate(source.sourceData as IBidTemplate);
      setSelectedBid(null);
    }
    setStep(1);
  };

  const handleBack = (): void => {
    setStep(0);
    setSelectedSource(null);
    setSelectedBid(null);
    setSelectedTemplate(null);
  };

  const handleImportScope = (result: IScopeImportResult): void => {
    if (onImportScope) {
      onImportScope(result);
    }
    onClose();
  };

  const handleImportHours = (hours: Partial<IHoursSummary>): void => {
    if (onImportHours) {
      onImportHours(hours);
    }
    onClose();
  };

  // Get source data for preview
  const scopeItems: IScopeItem[] = React.useMemo(() => {
    if (selectedBid) return selectedBid.scopeItems || [];
    if (selectedTemplate) return selectedTemplate.scopeItems || [];
    return [];
  }, [selectedBid, selectedTemplate]);

  const hoursSummary: IHoursSummary | null = React.useMemo(() => {
    if (selectedBid) return selectedBid.hoursSummary || null;
    if (selectedTemplate)
      return (selectedTemplate.hoursSummary as IHoursSummary) || null;
    return null;
  }, [selectedBid, selectedTemplate]);

  // Engineering items from source for cross-import
  const sourceEngItems: IEngineeringHoursItem[] = React.useMemo(() => {
    const hs = hoursSummary;
    if (!hs) return [];
    return hs.engineeringHours?.engineeringItems || [];
  }, [hoursSummary]);

  const sourceResourceAllocations: IResourceAllocation[] = React.useMemo(() => {
    const hs = hoursSummary;
    if (!hs) return [];
    return hs.engineeringHours?.resourceAllocations || [];
  }, [hoursSummary]);

  if (!isOpen) return null;

  const modeLabel =
    importMode === "scope" ? "Scope of Supply" : "Hours & Personnel";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {step === 1 && (
              <button
                className={styles.backBtn}
                onClick={handleBack}
                title="Back to source list"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h2 className={styles.title}>
              {step === 0 ? `Import ${modeLabel}` : `Select ${modeLabel} Items`}
            </h2>
            {step === 1 && selectedSource && (
              <span className={styles.sourceBadge}>
                {selectedSource.type === "bid" ? "BID" : "Template"}:{" "}
                {selectedSource.title}
              </span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose} title="Close">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {step === 0 && (
            <ImportSourceList
              sources={sources}
              isLoading={templatesLoading}
              onSelect={handleSelectSource}
              currentDivision={currentDivision}
            />
          )}

          {step === 1 && importMode === "scope" && (
            <ScopeImportPreview
              scopeItems={scopeItems}
              onImport={handleImportScope}
              sourceName={selectedSource?.title || ""}
              sourceEngItems={sourceEngItems}
              sourceResourceAllocations={sourceResourceAllocations}
            />
          )}

          {step === 1 && importMode === "hours" && hoursSummary && (
            <HoursImportPreview
              hoursSummary={hoursSummary}
              onImport={handleImportHours}
              sourceName={selectedSource?.title || ""}
            />
          )}
        </div>
      </div>
    </div>
  );
};
