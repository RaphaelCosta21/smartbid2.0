import * as React from "react";
import { IScopeItem } from "../../models";
import { AIAnalysisService } from "../../services/AIAnalysisService";
import { AssetCatalogService } from "../../services/AssetCatalogService";
import {
  IAIAnalysisResult,
  IAIAssetCatalogOption,
  IAIAssetSubItemOption,
  IAIImportMeta,
} from "../../models/IAIAnalysis";
import { useConfigStore } from "../../stores/useConfigStore";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import { ScopeOfSupplyTab } from "../bid/ScopeOfSupplyTab";
import { formatFileSize } from "../../utils/formatters";
import styles from "./AIDocumentAnalyzer.module.scss";

interface AIDocumentAnalyzerProps {
  /** BID number for file naming and polling (e.g. "REQ-2026-0007") */
  bidNumber?: string;
  /** Template ID for polling on smartbid-templates (alternative to bidNumber) */
  templateId?: string;
  /** BID division for context display */
  division?: string;
  /** BID service line for context display */
  serviceLine?: string;
  /** Richer context summary for RAG grounding (division, client, project…) */
  contextSummary?: string;
  /** Callback when user imports items (with metadata about AI vs user edits) */
  onImport: (items: IScopeItem[], meta: IAIImportMeta) => void;
  /** Label for the import button */
  importLabel?: string;
  /** Whether the component is in compact/modal mode */
  compact?: boolean;
}

type AnalyzerState = "upload" | "analyzing" | "results" | "error";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];
const ACCEPTED_EXTENSIONS = ".pdf,.docx,.doc";

export const AIDocumentAnalyzer: React.FC<AIDocumentAnalyzerProps> = ({
  bidNumber,
  templateId,
  division,
  serviceLine,
  contextSummary,
  onImport,
  importLabel = "Import All to Scope",
  compact = false,
}) => {
  const [state, setState] = React.useState<AnalyzerState>("upload");
  const [file, setFile] = React.useState<File | null>(null);
  const [result, setResult] = React.useState<IAIAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [previewItems, setPreviewItems] = React.useState<IScopeItem[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const abortRef = React.useRef<AbortController | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const config = useConfigStore((s) => s.config);
  const resourceTypes = React.useMemo(
    () =>
      (config?.resourceTypes || [])
        .filter((r) => r.isActive)
        .map((r) => r.label),
    [config],
  );
  const resourceTypeOptions = React.useMemo(
    () =>
      (config?.resourceTypes || [])
        .filter((r) => r.isActive)
        .map((r) => ({
          label: r.label,
          subTypes: (r.subTypes || [])
            .filter((s) => s.isActive !== false)
            .map((s) => s.value),
        })),
    [config],
  );

  // The Assets Catalog list is not in the AI Search index, so it travels in the
  // prompt — it is the only source the model may use for part numbers.
  const favoritesData = useFavoritesStore((s) => s.data);
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
  const assetCatalogRef = React.useRef<IAIAssetCatalogOption[] | undefined>(
    undefined,
  );

  /** Sub-items live in Favorites (equipment rows with a parentId), keyed by parent PN. */
  const subItemsByParentPn = (): Record<string, IAIAssetSubItemOption[]> => {
    const equipment = favoritesData?.equipment || [];
    const byId: Record<string, string> = {};
    equipment.forEach((e) => {
      if (e.partNumber) byId[e.id] = e.partNumber.toUpperCase();
    });
    const map: Record<string, IAIAssetSubItemOption[]> = {};
    equipment.forEach((e) => {
      if (!e.parentId || !e.partNumber) return;
      const parentPn = byId[e.parentId];
      if (!parentPn) return;
      if (!map[parentPn]) map[parentPn] = [];
      map[parentPn].push({
        name: e.description || e.partNumber,
        partNumber: e.partNumber,
      });
    });
    return map;
  };

  const loadAssetCatalog = async (): Promise<IAIAssetCatalogOption[]> => {
    if (assetCatalogRef.current) return assetCatalogRef.current;
    try {
      await loadFavorites();
      const subsByPn = subItemsByParentPn();
      const assets = await AssetCatalogService.getAll();
      const options: IAIAssetCatalogOption[] = [];
      for (let i = 0; i < assets.length; i++) {
        const a = assets[i];
        if (!a.pn || !a.title) continue;
        const aka = [a.keyword, a.commonlyUsedNames].filter(Boolean).join(", ");
        const specs = [a.subtitle, a.description, a.features1]
          .filter(Boolean)
          .join(" — ");
        options.push({
          name: a.title,
          partNumber: a.pn,
          keywords: aka.substring(0, 200),
          description: specs.substring(0, 300),
          subItems: subsByPn[a.pn.toUpperCase()],
        });
      }
      assetCatalogRef.current = options;
      return options;
    } catch {
      return []; // the catalog is an enhancement — never block the analysis
    }
  };

  const isValidFile = (f: File): boolean => {
    if (ACCEPTED_TYPES.indexOf(f.type) >= 0) return true;
    const ext = f.name.split(".").pop();
    if (ext && ["pdf", "docx", "doc"].indexOf(ext.toLowerCase()) >= 0)
      return true;
    return false;
  };

  const handleFileSelect = (f: File): void => {
    if (!isValidFile(f)) {
      setErrorMsg("Please select a PDF or Word document (.pdf, .docx, .doc)");
      setState("error");
      return;
    }
    setFile(f);
    setErrorMsg("");
    setState("upload");
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleAnalyze = async (): Promise<void> => {
    if (!file) return;
    if (!bidNumber && !templateId) {
      setErrorMsg("A BID number or Template is required for AI analysis.");
      setState("error");
      return;
    }

    setState("analyzing");
    setErrorMsg("");
    abortRef.current = new AbortController();

    try {
      let analysisResult: IAIAnalysisResult;
      const analysisContext = {
        division,
        serviceLine,
        resourceTypes,
        resourceTypeOptions,
        assetCatalogOptions: await loadAssetCatalog(),
        contextSummary,
      };
      if (templateId) {
        analysisResult = await AIAnalysisService.analyzeDocumentForTemplate(
          file,
          templateId,
          analysisContext,
          abortRef.current.signal,
        );
      } else {
        analysisResult = await AIAnalysisService.analyzeDocument(
          file,
          bidNumber || "",
          analysisContext,
          abortRef.current.signal,
        );
      }

      setResult(analysisResult);
      setPreviewItems(analysisResult.scopeItems);
      setState("results");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during analysis.";
      setErrorMsg(msg);
      setState("error");
    } finally {
      abortRef.current = null;
    }
  };

  const handleCancel = (): void => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setState("upload");
  };

  /** Whether the user changed any key field of an AI item during review. */
  const scopeItemChanged = (a: IScopeItem, b: IScopeItem): boolean => {
    const norm = (v: unknown): string =>
      v === undefined || v === null ? "" : String(v);
    const fields: (keyof IScopeItem)[] = [
      "description",
      "clientDocRef",
      "compliance",
      "resourceType",
      "resourceSubType",
      "equipmentOffer",
      "partNumber",
      "qtyOperational",
      "qtySpare",
      "clientRequirement",
      "comments",
    ];
    if (fields.some((f) => norm(a[f]) !== norm(b[f]))) return true;
    return (a.clientSpecs || []).join("|") !== (b.clientSpecs || []).join("|");
  };

  /** Compare the AI's original output against the (possibly edited) preview. */
  const computeImportMeta = (): IAIImportMeta => {
    const original = (result?.scopeItems || []).filter((i) => !i.isSection);
    const finalItems = previewItems.filter((i) => !i.isSection);
    const originalById: Record<string, IScopeItem> = {};
    original.forEach((i) => {
      originalById[i.id] = i;
    });
    const finalIds: Record<string, true> = {};
    let edited = 0;
    let added = 0;
    finalItems.forEach((fi) => {
      finalIds[fi.id] = true;
      const orig = originalById[fi.id];
      if (!orig) {
        added++;
      } else if (scopeItemChanged(orig, fi)) {
        edited++;
      }
    });
    let removed = 0;
    original.forEach((oi) => {
      if (!finalIds[oi.id]) removed++;
    });
    return {
      sourceDocument: result?.sourceDocument || (file ? file.name : ""),
      promptVersion: result?.promptVersion,
      aiItemCount: original.length,
      finalItemCount: finalItems.length,
      editedCount: edited,
      addedCount: added,
      removedCount: removed,
      warnings: result?.warnings || [],
      suggestedClarifications: result?.suggestedClarifications || [],
    };
  };

  const handleImport = (): void => {
    if (previewItems.length > 0) {
      onImport(previewItems, computeImportMeta());
    }
  };

  const handleReset = (): void => {
    setFile(null);
    setResult(null);
    setPreviewItems([]);
    setErrorMsg("");
    setState("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sectionCount = previewItems.filter((i) => i.isSection).length;
  const itemCount = previewItems.filter((i) => !i.isSection).length;

  /* ─── Upload State ─── */
  if (state === "upload" || state === "error") {
    return (
      <div className={`${styles.analyzer} ${compact ? styles.compact : ""}`}>
        {/* Drop zone */}
        <div
          className={`${styles.dropZone} ${isDragOver ? styles.dropZoneActive : ""} ${file ? styles.dropZoneHasFile : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={handleInputChange}
            className={styles.hiddenInput}
          />

          {!file ? (
            <>
              <svg
                className={styles.uploadIcon}
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <h3 className={styles.dropTitle}>
                Drop your client document here
              </h3>
              <p className={styles.dropSubtitle}>
                or click to browse — PDF, Word (.docx, .doc)
              </p>
            </>
          ) : (
            <div className={styles.fileInfo}>
              <svg
                className={styles.fileIcon}
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <div className={styles.fileDetails}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>
                  {formatFileSize(file.size)}
                </span>
              </div>
              <button
                className={styles.removeFileBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                title="Remove file"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Error message */}
        {state === "error" && errorMsg && (
          <div className={styles.errorBanner}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Context info */}
        {(division || serviceLine) && (
          <div className={styles.contextInfo}>
            <span className={styles.contextLabel}>AI Context:</span>
            {division && <span className={styles.contextTag}>{division}</span>}
            {serviceLine && (
              <span className={styles.contextTag}>{serviceLine}</span>
            )}
          </div>
        )}

        {/* Analyze button */}
        <button
          className={styles.analyzeBtn}
          disabled={!file}
          onClick={handleAnalyze}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
          </svg>
          Analyze Document
        </button>
      </div>
    );
  }

  /* ─── Analyzing State ─── */
  if (state === "analyzing") {
    return (
      <div className={`${styles.analyzer} ${compact ? styles.compact : ""}`}>
        <div className={styles.analyzingState}>
          <div className={styles.spinner} />
          <h3 className={styles.analyzingTitle}>Analyzing Document...</h3>
          <p className={styles.analyzingFile}>{file?.name}</p>
          <p className={styles.analyzingHint}>
            The document is being sent securely to the Azure AI service, which
            reads it and extracts the scope items. This may take a little while
            for large documents.
          </p>
          <button className={styles.cancelBtn} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  /* ─── Results State ─── */
  return (
    <div
      className={`${styles.analyzer} ${styles.resultsMode} ${compact ? styles.compact : ""}`}
    >
      {/* Summary header */}
      <div className={styles.resultsSummary}>
        <div className={styles.summaryStats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{sectionCount}</span>
            <span className={styles.statLabel}>Sections</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{itemCount}</span>
            <span className={styles.statLabel}>Items</span>
          </div>
          {result && result.chunksProcessed > 1 && (
            <div className={styles.statCard}>
              <span className={styles.statValue}>{result.chunksProcessed}</span>
              <span className={styles.statLabel}>Chunks</span>
            </div>
          )}
        </div>

        <div className={styles.summaryMeta}>
          <span className={styles.summaryFile}>
            📄 {result?.sourceDocument}
          </span>
        </div>
      </div>

      {/* Warnings */}
      {result && result.warnings.length > 0 && (
        <div className={styles.warningsBanner}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div className={styles.warningsList}>
            {result.warnings.map((w, idx) => (
              <p key={idx}>{w}</p>
            ))}
          </div>
        </div>
      )}

      {/* Incomplete analysis banner */}
      {result && !result.isComplete && (
        <div className={styles.incompleteBanner}>
          Analysis may be incomplete. Large documents may require multiple
          analysis passes. Review the items below and run analysis again if
          needed.
        </div>
      )}

      {/* Scope preview using existing ScopeOfSupplyTab */}
      <div className={styles.previewContainer}>
        <ScopeOfSupplyTab
          scopeItems={previewItems}
          onSave={(items) => setPreviewItems(items)}
          readOnly={false}
        />
      </div>

      {/* Action buttons */}
      <div className={styles.resultActions}>
        <button
          className={styles.importBtn}
          onClick={handleImport}
          disabled={previewItems.length === 0}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {importLabel} ({itemCount} items)
        </button>

        <button className={styles.resetBtn} onClick={handleReset}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
          </svg>
          Analyze Again
        </button>
      </div>
    </div>
  );
};
