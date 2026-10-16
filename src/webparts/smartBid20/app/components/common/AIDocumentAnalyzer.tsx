import * as React from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Clock,
  CloudUpload,
  Database,
  FileSearch,
  FileText,
  Import,
  Info,
  Layers,
  Lightbulb,
  ListTree,
  LoaderCircle,
  MessageSquareQuote,
  MessageSquareText,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react";
import { IScopeItem } from "../../models";
import { AIAnalysisService } from "../../services/AIAnalysisService";
import { AssetCatalogService } from "../../services/AssetCatalogService";
import {
  IAIAnalysisResult,
  IAIAssetCatalogOption,
  IAIAssetSubItemOption,
  IAIImportMeta,
  IAISuggestedClarification,
} from "../../models/IAIAnalysis";
import { useConfigStore } from "../../stores/useConfigStore";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import { useQueryCatalogStore } from "../../stores/useQueryCatalogStore";
import { DeferQueryCatalogContext } from "../../hooks/useQuerySearch";
import { ScopeOfSupplyTab } from "../bid/ScopeOfSupplyTab";
import { formatFileSize } from "../../utils/formatters";
import { SCOPE_USER_INSTRUCTIONS_MAX_CHARS } from "../../config/ai.prompts";
import styles from "./AIDocumentAnalyzer.module.scss";

export type AnalyzerStage = "upload" | "analyzing" | "results" | "error";

export interface AIDocumentAnalyzerProps {
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
  /** Notified whenever the analyzer moves between stages (lets a modal resize). */
  onStageChange?: (stage: AnalyzerStage) => void;
  /** When set, a Cancel action is shown in the footer. */
  onCancel?: () => void;
}

const STEPS = ["Document & instructions", "AI analysis", "Review & import"];

/** Starter sentences; "___" is selected after insert so the user types over it. */
const INSTRUCTION_PRESETS: { label: string; text: string }[] = [
  {
    label: "Ignore a scope",
    text: "Ignore scope ___ - do not extract anything from it.",
  },
  {
    label: "Only one scope",
    text: "Only analyze scope ___ and skip every other scope.",
  },
  {
    label: "Skip spares & consumables",
    text: "Do not list spare parts or consumables as sub-items.",
  },
  {
    label: "Focus on equipment",
    text: "Focus only on ___ equipment and skip the rest.",
  },
];

const SLOW_ANALYSIS_SEC = 180;

const formatElapsed = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

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
  onStageChange,
  onCancel,
}) => {
  const [state, setState] = React.useState<AnalyzerStage>("upload");
  const [file, setFile] = React.useState<File | null>(null);
  const [result, setResult] = React.useState<IAIAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [previewItems, setPreviewItems] = React.useState<IScopeItem[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [instructions, setInstructions] = React.useState("");
  const [appliedInstructions, setAppliedInstructions] = React.useState("");
  const [showApplied, setShowApplied] = React.useState(false);
  const [resultsView, setResultsView] = React.useState<
    "items" | "clarifications"
  >("items");
  const [deselectedClar, setDeselectedClar] = React.useState<
    Record<number, boolean>
  >({});
  const [elapsedSec, setElapsedSec] = React.useState(0);

  const abortRef = React.useRef<AbortController | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const instructionsRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (onStageChange) onStageChange(state);
  }, [state, onStageChange]);

  React.useEffect(() => {
    if (state !== "analyzing") return undefined;
    const started = Date.now();
    setElapsedSec(0);
    const timer = window.setInterval(
      () => setElapsedSec(Math.floor((Date.now() - started) / 1000)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [state]);

  React.useEffect(
    () => () => {
      if (abortRef.current) abortRef.current.abort();
    },
    [],
  );

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
  const queryLoaded = useQueryCatalogStore((s) => s.isLoaded);
  const queryLoading = useQueryCatalogStore((s) => s.isLoading);
  const loadQueryCatalog = useQueryCatalogStore((s) => s.loadCatalog);
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
          .join(" - ");
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
    const controller = new AbortController();
    abortRef.current = controller;
    const userInstructions = instructions.trim();

    try {
      let analysisResult: IAIAnalysisResult;
      const analysisContext = {
        division,
        serviceLine,
        resourceTypes,
        resourceTypeOptions,
        assetCatalogOptions: await loadAssetCatalog(),
        contextSummary,
        userInstructions,
      };
      if (templateId) {
        analysisResult = await AIAnalysisService.analyzeDocumentForTemplate(
          file,
          templateId,
          analysisContext,
          controller.signal,
        );
      } else {
        analysisResult = await AIAnalysisService.analyzeDocument(
          file,
          bidNumber || "",
          analysisContext,
          controller.signal,
        );
      }

      setResult(analysisResult);
      setPreviewItems(analysisResult.scopeItems);
      setAppliedInstructions(userInstructions);
      setShowApplied(false);
      setResultsView("items");
      setDeselectedClar({});
      setState("results");
    } catch (err) {
      // A user cancel already moved the UI back to the upload step.
      if (controller.signal.aborted) return;
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
      suggestedClarifications: selectedClarifications(),
      userInstructions: appliedInstructions || undefined,
    };
  };

  // Templates don't store clarifications, so there is nothing to select there.
  const selectedClarifications = (): IAISuggestedClarification[] =>
    templateId
      ? []
      : (result?.suggestedClarifications || []).filter(
          (_, i) => !deselectedClar[i],
        );

  const handleImport = (): void => {
    if (previewItems.length > 0 || selectedClarifications().length > 0) {
      onImport(previewItems, computeImportMeta());
    }
  };

  const handleRemoveFile = (): void => {
    setFile(null);
    setErrorMsg("");
    setState("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /** Back to step 1 keeping the file and instructions, so the user can refine and re-run. */
  const handleRefine = (): void => {
    setResult(null);
    setPreviewItems([]);
    setErrorMsg("");
    setState("upload");
  };

  const handleReset = (): void => {
    handleRemoveFile();
    setResult(null);
    setPreviewItems([]);
    setInstructions("");
    setAppliedInstructions("");
  };

  const insertPreset = (text: string): void => {
    const current = instructions.replace(/\s+$/, "");
    const prefix = current ? current + "\n" : "";
    const next = (prefix + text).substring(
      0,
      SCOPE_USER_INSTRUCTIONS_MAX_CHARS,
    );
    setInstructions(next);
    const blank = next.lastIndexOf("___");
    window.setTimeout(() => {
      const el = instructionsRef.current;
      if (!el) return;
      el.focus();
      if (blank >= prefix.length) {
        el.setSelectionRange(blank, blank + 3);
      } else {
        el.setSelectionRange(next.length, next.length);
      }
    }, 0);
  };

  const sectionCount = previewItems.filter((i) => i.isSection).length;
  const itemCount = previewItems.filter((i) => !i.isSection).length;
  let subItemCount = 0;
  previewItems.forEach((i) => {
    if (!i.isSection) subItemCount += (i.subItems || []).length;
  });
  const clarifications = result?.suggestedClarifications || [];
  const clarificationCount = clarifications.length;
  const canSelectClar = !templateId;
  const selectedClarCount = selectedClarifications().length;
  const plural = (n: number, word: string): string =>
    `${n} ${word}${n === 1 ? "" : "s"}`;
  const warningCount = (result?.warnings || []).length;
  const contextChips = (
    contextSummary
      ? contextSummary.split(" | ")
      : [division || "", serviceLine || ""]
  ).filter((c) => c.trim() && c.indexOf("BID:") !== 0);
  const trimmedInstructions = instructions.trim();
  const stepIndex = state === "results" ? 2 : state === "analyzing" ? 1 : 0;
  const rootClass = `${styles.analyzer} ${compact ? styles.compact : ""} ${state === "results" ? styles.resultsMode : ""}`;

  const stepper = (
    <ol className={styles.stepper}>
      {STEPS.map((label, idx) => (
        <li
          key={label}
          className={`${styles.step} ${idx < stepIndex ? styles.stepDone : ""} ${idx === stepIndex ? styles.stepActive : ""}`}
          aria-current={idx === stepIndex ? "step" : undefined}
        >
          <span className={styles.stepDot}>
            {idx < stepIndex ? <Check size={12} /> : idx + 1}
          </span>
          <span className={styles.stepLabel}>{label}</span>
        </li>
      ))}
    </ol>
  );

  /* ─── Upload State ─── */
  if (state === "upload" || state === "error") {
    return (
      <div className={rootClass}>
        {stepper}
        <div className={styles.body}>
          <div className={styles.uploadGrid}>
            {/* Document */}
            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <span className={styles.panelStep}>1</span>
                <div>
                  <h4 className={styles.panelTitle}>Client document</h4>
                  <p className={styles.panelHint}>
                    Technical specification or tender - PDF or Word.
                  </p>
                </div>
              </div>

              <div
                className={`${styles.dropZone} ${isDragOver ? styles.dropZoneActive : ""} ${file ? styles.dropZoneHasFile : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
                onKeyDown={(e) => {
                  if (
                    e.target === e.currentTarget &&
                    (e.key === "Enter" || e.key === " ") &&
                    fileInputRef.current
                  ) {
                    e.preventDefault();
                    fileInputRef.current.click();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={file ? "Replace document" : "Select document"}
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
                    <span className={styles.dropIcon}>
                      <CloudUpload size={26} />
                    </span>
                    <span className={styles.dropTitle}>
                      Drop the client document here
                    </span>
                    <span className={styles.dropSubtitle}>
                      or{" "}
                      <span className={styles.dropLink}>browse your files</span>{" "}
                      · .pdf, .docx, .doc
                    </span>
                  </>
                ) : (
                  <div className={styles.fileCard}>
                    <span className={styles.fileIcon}>
                      <FileText size={20} />
                    </span>
                    <div className={styles.fileDetails}>
                      <span className={styles.fileName} title={file.name}>
                        {file.name}
                      </span>
                      <span className={styles.fileSize}>
                        {formatFileSize(file.size)} · click to replace
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.removeFileBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      title="Remove file"
                      aria-label="Remove file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {contextChips.length > 0 && (
                <div className={styles.contextBox}>
                  <span className={styles.contextLabel}>
                    <Info size={13} /> Already sent to the AI automatically
                  </span>
                  <div className={styles.contextChips}>
                    {contextChips.map((c) => (
                      <span key={c} className={styles.contextChip} title={c}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Instructions */}
            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <span className={styles.panelStep}>2</span>
                <div>
                  <h4 className={styles.panelTitle}>
                    Instructions for the AI
                    <span className={styles.optionalTag}>Optional</span>
                  </h4>
                  <p className={styles.panelHint}>
                    Tell the AI what to skip or focus on. Added to
                    SmartBid&apos;s standard prompt for this analysis only.
                  </p>
                </div>
              </div>

              <div className={styles.presetRow}>
                {INSTRUCTION_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    className={styles.presetChip}
                    onClick={() => insertPreset(p.text)}
                    disabled={
                      instructions.length >= SCOPE_USER_INSTRUCTIONS_MAX_CHARS
                    }
                    title={p.text}
                  >
                    <Plus size={12} /> {p.label}
                  </button>
                ))}
              </div>

              <textarea
                ref={instructionsRef}
                className={styles.instructionsInput}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                maxLength={SCOPE_USER_INSTRUCTIONS_MAX_CHARS}
                rows={7}
                placeholder="e.g. The specification has three scopes (A, B and C). Only consider Scope A - ignore Scopes B and C entirely."
                aria-label="Instructions for the AI"
              />

              <div className={styles.instructionsMeta}>
                <span className={styles.tip}>
                  <Lightbulb size={12} />
                  Short, specific instructions work best - name scopes, sections
                  or clauses as written in the document.
                </span>
                <span
                  className={`${styles.charCount} ${instructions.length > SCOPE_USER_INSTRUCTIONS_MAX_CHARS * 0.9 ? styles.charCountWarn : ""}`}
                >
                  {instructions.length} / {SCOPE_USER_INSTRUCTIONS_MAX_CHARS}
                </span>
              </div>
            </section>
          </div>

          {state === "error" && errorMsg && (
            <div className={styles.errorBanner} role="alert">
              <CircleAlert size={18} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.footerHint}>
            <Clock size={14} /> Large documents can take a few minutes to
            analyze.
          </span>
          <div className={styles.footerGroup}>
            {onCancel && (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              className={styles.primaryBtn}
              disabled={!file}
              onClick={handleAnalyze}
              title={file ? undefined : "Select a document first"}
            >
              <Sparkles size={16} />
              {trimmedInstructions
                ? "Analyze with instructions"
                : "Analyze document"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Analyzing State ─── */
  if (state === "analyzing") {
    return (
      <div className={rootClass}>
        {stepper}
        <div className={styles.body}>
          <div className={styles.analyzingState} aria-live="polite">
            <span className={styles.pulse}>
              <Sparkles size={28} />
            </span>
            <h3 className={styles.analyzingTitle}>Analyzing document…</h3>
            <span className={styles.analyzingFile} title={file?.name}>
              <FileText size={13} /> {file?.name}
            </span>
            <div className={styles.progressTrack}>
              <div className={styles.progressBar} />
            </div>
            <span className={styles.elapsed}>
              Elapsed {formatElapsed(elapsedSec)}
            </span>

            <ul className={styles.processList}>
              <li>
                <FileSearch size={14} /> Reading the client document
              </li>
              <li>
                <Layers size={14} /> Matching datasheets, catalog and past BIDs
              </li>
              <li>
                <ListTree size={14} /> Building sections, items and
                clarifications
              </li>
            </ul>

            {trimmedInstructions && (
              <div className={styles.instructionsEcho}>
                <span className={styles.echoLabel}>
                  <MessageSquareText size={13} /> Applying your instructions
                </span>
                <p className={styles.echoText}>{trimmedInstructions}</p>
              </div>
            )}

            {elapsedSec >= SLOW_ANALYSIS_SEC && (
              <p className={styles.slowNote}>
                Taking longer than usual - large documents can take up to 4
                minutes.
              </p>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.footerHint}>
            <Info size={14} /> Keep this window open - the result appears here.
          </span>
          <div className={styles.footerGroup}>
            <button
              type="button"
              className={`${styles.secondaryBtn} ${styles.cancelBtn}`}
              onClick={handleCancel}
            >
              Cancel analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Results State ─── */
  return (
    <div className={rootClass}>
      {stepper}
      <div className={styles.body}>
        <div className={styles.resultsHeader}>
          <div className={styles.statGrid}>
            <div className={styles.statTile}>
              <span className={styles.statValue}>{sectionCount}</span>
              <span className={styles.statLabel}>Sections</span>
            </div>
            <div className={`${styles.statTile} ${styles.statTileAccent}`}>
              <span className={styles.statValue}>{itemCount}</span>
              <span className={styles.statLabel}>Items</span>
            </div>
            <div className={styles.statTile}>
              <span className={styles.statValue}>{subItemCount}</span>
              <span className={styles.statLabel}>Sub-items</span>
            </div>
            {clarificationCount > 0 && (
              <button
                type="button"
                className={`${styles.statTile} ${styles.statTileButton} ${resultsView === "clarifications" ? styles.statTileSelected : ""}`}
                onClick={() => setResultsView("clarifications")}
                title="View suggested clarifications"
              >
                <span className={styles.statValue}>{clarificationCount}</span>
                <span className={styles.statLabel}>Clarifications</span>
              </button>
            )}
            {warningCount > 0 && (
              <div className={`${styles.statTile} ${styles.statTileWarning}`}>
                <span className={styles.statValue}>{warningCount}</span>
                <span className={styles.statLabel}>Warnings</span>
              </div>
            )}
          </div>

          <div className={styles.resultsMeta}>
            <span className={styles.metaChip} title={result?.sourceDocument}>
              <FileText size={13} />
              <span className={styles.metaChipText}>
                {result?.sourceDocument}
              </span>
            </span>
            {result?.promptVersion && (
              <span className={`${styles.metaChip} ${styles.metaChipMuted}`}>
                {result.promptVersion}
              </span>
            )}
            {appliedInstructions ? (
              <button
                type="button"
                className={`${styles.metaChip} ${styles.metaChipButton}`}
                onClick={() => setShowApplied(!showApplied)}
                aria-expanded={showApplied}
              >
                <MessageSquareText size={13} /> Instructions applied
                {showApplied ? (
                  <ChevronUp size={13} />
                ) : (
                  <ChevronDown size={13} />
                )}
              </button>
            ) : (
              <span className={`${styles.metaChip} ${styles.metaChipMuted}`}>
                No extra instructions
              </span>
            )}
          </div>
        </div>

        {showApplied && appliedInstructions && (
          <div className={styles.appliedBox}>{appliedInstructions}</div>
        )}

        {result && result.warnings.length > 0 && (
          <div className={styles.warningsBanner}>
            <TriangleAlert size={18} />
            <div className={styles.warningsList}>
              {result.warnings.map((w, idx) => (
                <p key={idx}>{w}</p>
              ))}
            </div>
          </div>
        )}

        {result && !result.isComplete && (
          <div className={styles.incompleteBanner}>
            <Info size={18} />
            <span>
              Analysis may be incomplete. Large documents may require multiple
              analysis passes. Review the items below and run analysis again if
              needed.
            </span>
          </div>
        )}

        <div className={styles.viewBar}>
          {clarificationCount > 0 && (
            <div className={styles.viewTabs} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={resultsView === "items"}
                className={`${styles.viewTab} ${resultsView === "items" ? styles.viewTabActive : ""}`}
                onClick={() => setResultsView("items")}
              >
                <ListTree size={14} /> Scope items
                <span className={styles.viewTabCount}>{itemCount}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={resultsView === "clarifications"}
                className={`${styles.viewTab} ${resultsView === "clarifications" ? styles.viewTabActive : ""}`}
                onClick={() => setResultsView("clarifications")}
              >
                <MessageSquareQuote size={14} /> Clarifications
                <span className={styles.viewTabCount}>
                  {canSelectClar
                    ? `${selectedClarCount}/${clarificationCount}`
                    : clarificationCount}
                </span>
              </button>
            </div>
          )}
          <p className={styles.reviewHint}>
            {resultsView === "items" ? (
              <>
                <Pencil size={13} /> Review and edit the items below - nothing
                is saved until you import.
              </>
            ) : (
              <>
                <Info size={13} />
                {canSelectClar
                  ? "Selected clarifications are added to the BID's Clarifications when you import."
                  : "Clarifications are not saved to templates - shown for reference only."}
              </>
            )}
          </p>
          {resultsView === "clarifications" && canSelectClar && (
            <div className={styles.selectActions}>
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => setDeselectedClar({})}
                disabled={selectedClarCount === clarificationCount}
              >
                Select all
              </button>
              <span className={styles.selectDivider} />
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => {
                  const none: Record<number, boolean> = {};
                  clarifications.forEach((_, i) => {
                    none[i] = true;
                  });
                  setDeselectedClar(none);
                }}
                disabled={selectedClarCount === 0}
              >
                Clear
              </button>
            </div>
          )}
          {resultsView === "items" && (
            <button
              type="button"
              className={`${styles.queryBtn} ${queryLoaded ? styles.queryBtnDone : ""}`}
              onClick={() => loadQueryCatalog()}
              disabled={queryLoaded || queryLoading}
              title="Loads the Query catalog (Peoplesoft) so the PN and Equipment Offer fields suggest part numbers from it. It can take a moment."
            >
              {queryLoading ? (
                <>
                  <LoaderCircle size={14} className={styles.spin} /> Loading
                  Query…
                </>
              ) : queryLoaded ? (
                <>
                  <Check size={14} /> Query loaded
                </>
              ) : (
                <>
                  <Database size={14} /> Load Query
                </>
              )}
            </button>
          )}
        </div>

        <div className={styles.previewContainer}>
          <div hidden={resultsView !== "items"}>
            <DeferQueryCatalogContext.Provider value={true}>
              <ScopeOfSupplyTab
                scopeItems={previewItems}
                onSave={(items) => setPreviewItems(items)}
                readOnly={false}
                embedded
              />
            </DeferQueryCatalogContext.Provider>
          </div>
          {resultsView === "clarifications" && (
            <ul className={styles.clarList}>
              {clarifications.map((c, idx) => {
                const isSelected = canSelectClar && !deselectedClar[idx];
                const body = (
                  <>
                    <div className={styles.clarHead}>
                      {canSelectClar && (
                        <input
                          type="checkbox"
                          className={styles.clarCheck}
                          checked={isSelected}
                          onChange={() =>
                            setDeselectedClar((prev) => ({
                              ...prev,
                              [idx]: !prev[idx],
                            }))
                          }
                          aria-label={`Import "${c.description}"`}
                        />
                      )}
                      <span
                        className={`${styles.clarType} ${c.baseType === "Qualification" ? styles.clarTypeQual : ""}`}
                      >
                        {c.baseType}
                      </span>
                      <span className={styles.clarTitle}>{c.description}</span>
                      {c.relatedRef && (
                        <span className={styles.clarRef} title={c.relatedRef}>
                          {c.relatedRef}
                        </span>
                      )}
                    </div>
                    <p className={styles.clarText}>{c.clarification}</p>
                    {c.rationale && (
                      <p className={styles.clarRationale}>
                        <Lightbulb size={12} />
                        <span>{c.rationale}</span>
                      </p>
                    )}
                  </>
                );
                return (
                  <li
                    key={idx}
                    className={`${styles.clarCard} ${c.baseType === "Qualification" ? styles.clarCardQual : ""} ${canSelectClar && !isSelected ? styles.clarCardOff : ""}`}
                  >
                    {canSelectClar ? (
                      <label className={styles.clarLabel}>{body}</label>
                    ) : (
                      body
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerGroup}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={handleRefine}
            title="Back to step 1 keeping the document and instructions"
          >
            <RefreshCw size={15} /> Refine &amp; re-run
          </button>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={handleReset}
          >
            <RotateCcw size={15} /> Start over
          </button>
        </div>
        <div className={styles.footerGroup}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleImport}
            disabled={previewItems.length === 0 && selectedClarCount === 0}
          >
            <Import size={16} /> {importLabel} ({plural(itemCount, "item")}
            {selectedClarCount > 0
              ? ` · ${plural(selectedClarCount, "clarification")}`
              : ""}
            )
          </button>
        </div>
      </div>
    </div>
  );
};
