import * as React from "react";
import { PageHeader } from "../common/PageHeader";
import { EmptyState } from "../common/EmptyState";
import { DocLibraryCatalogService } from "../../services/DocLibraryCatalogService";
import { AIAnalysisService } from "../../services/AIAnalysisService";
import { SystemConfigService } from "../../services/SystemConfigService";
import { useConfigStore } from "../../stores/useConfigStore";
import { IExtractedDocumentMetadata } from "../../models/IAIAnalysis";
import { IFavoriteGroup } from "../../models";
import {
  IDocLibraryItem,
  IDocLibraryMetadata,
  DocCatalogType,
} from "../../models/IDocLibraryItem";
import { useDebounce } from "../../hooks/useDebounce";
import { formatFileSize } from "../../utils/formatters";
import { makeId } from "../../utils/idGenerator";
import {
  findGroupByName,
  findSubGroupByName,
  withCategory,
} from "../../utils/docCatalogHelpers";
import styles from "./DocLibraryCatalog.module.scss";

/** UI labels for the shared catalog columns, overridable per document family */
export interface IDocLibraryFieldLabels {
  group: string;
  manufacturer: string;
  model: string;
  keywords: string;
  revision: string;
  description: string;
  /** Short forms used in the card meta rows and list-view headers */
  groupShort: string;
  manufacturerShort: string;
  manufacturerColumn: string;
  modelShort: string;
  revisionShort: string;
  searchPlaceholder: string;
  allManufacturers: string;
}

const DEFAULT_FIELD_LABELS: IDocLibraryFieldLabels = {
  group: "Group / Sub-Group",
  manufacturer: "Manufacturer / Brand",
  model: "Model / Equipment",
  keywords: "Keywords / Tags",
  revision: "Revision / Date",
  description: "Description",
  groupShort: "Group",
  manufacturerShort: "Mfr",
  manufacturerColumn: "Manufacturer",
  modelShort: "Model",
  revisionShort: "Rev",
  searchPlaceholder: "Search by title, manufacturer, keyword...",
  allManufacturers: "All Manufacturers",
};

export interface DocLibraryCatalogProps {
  title: string;
  icon: React.ReactNode;
  folderServerRelativeUrl: string;
  docTypeOptions: DocCatalogType[];
  defaultDocType: DocCatalogType;
  canManage: boolean;
  fieldLabels?: Partial<IDocLibraryFieldLabels>;
  /** Pins every document to this Group; the sub-group stays free for the AI to fill. */
  lockedGroupName?: string;
}

type ViewMode = "grid" | "list";

/** Name used for the catch-all Group/Sub-Group when nothing configured fits */
const OTHER_GROUP_NAME = "Other";

const EMPTY_META = (docType: DocCatalogType): IDocLibraryMetadata => ({
  title: "",
  docType,
  groupId: "",
  subGroupId: "",
  manufacturer: "",
  model: "",
  keywords: "",
  description: "",
  revision: "",
});

/** Maximum number of documents that can be selected for a bulk AI fill at once */
const MAX_BULK_AI_SELECTION = 10;

/** How many AI extraction/save calls run at the same time during a bulk fill */
const BULK_AI_CONCURRENCY = 3;

/** Status of one row inside the bulk AI review panel */
type BulkAiStatus = "pending" | "extracting" | "extracted" | "error";

/** A new Group/Sub-Group the AI proposed instead of falling back to "Other" */
interface IGroupSuggestion {
  groupName: string;
  subGroupName: string;
}

interface IBulkAiRow {
  item: IDocLibraryItem;
  meta: IDocLibraryMetadata;
  status: BulkAiStatus;
  error?: string;
  include: boolean;
  saved?: boolean;
  saveError?: string;
  suggestion?: IGroupSuggestion;
}

/**
 * Merge AI-extracted fields into existing metadata. Group/SubGroup are resolved
 * against the configured taxonomy (falling back to "Other"); when the AI thinks
 * a brand-new Group/Sub-Group would fit better, that is returned separately as
 * a suggestion instead of being applied automatically.
 */
const mergeExtractedMetadata = (
  current: IDocLibraryMetadata,
  extracted: IExtractedDocumentMetadata,
  docTypeOptions: DocCatalogType[],
  groups: IFavoriteGroup[],
): { meta: IDocLibraryMetadata; suggestion?: IGroupSuggestion } => {
  const matchedType =
    docTypeOptions.indexOf(extracted.docType as DocCatalogType) >= 0
      ? (extracted.docType as DocCatalogType)
      : current.docType;

  const matchedGroup = findGroupByName(groups, extracted.groupName || "");
  const matchedSubGroup = findSubGroupByName(
    matchedGroup,
    extracted.subGroupName || "",
  );
  const otherGroup = findGroupByName(groups, OTHER_GROUP_NAME);
  const otherSubGroup = findSubGroupByName(otherGroup, OTHER_GROUP_NAME);

  const groupId = matchedGroup
    ? matchedGroup.id
    : otherGroup
      ? otherGroup.id
      : current.groupId;
  const subGroupId = matchedSubGroup
    ? matchedSubGroup.id
    : otherSubGroup
      ? otherSubGroup.id
      : current.subGroupId;

  const suggestion =
    !matchedGroup &&
    extracted.suggestedNewGroupName &&
    extracted.suggestedNewGroupName.trim()
      ? {
          groupName: extracted.suggestedNewGroupName.trim(),
          subGroupName:
            (extracted.suggestedNewSubGroupName || "").trim() ||
            OTHER_GROUP_NAME,
        }
      : undefined;

  return {
    meta: {
      title: extracted.title || current.title,
      docType: matchedType,
      groupId,
      subGroupId,
      manufacturer: extracted.manufacturer || current.manufacturer,
      model: extracted.model || current.model,
      keywords: extracted.keywords || current.keywords,
      description: extracted.description || current.description,
      revision: extracted.revision || current.revision,
    },
    suggestion,
  };
};

/** Create (or reuse) a Group/Sub-Group by name in system config and persist it immediately */ const createFavoriteGroupAndSave =
  async (
    groupName: string,
    subGroupName: string,
  ): Promise<{ groupId: string; subGroupId: string }> => {
    const config = useConfigStore.getState().config;
    if (!config) throw new Error("System configuration is not loaded yet.");
    const groups = config.favoriteGroups || [];

    let groupId = "";
    let subGroupId = "";
    let nextGroups = groups;

    const existingGroup = findGroupByName(groups, groupName);
    if (existingGroup) {
      groupId = existingGroup.id;
    } else {
      groupId = makeId("grp");
      nextGroups = nextGroups.concat([
        { id: groupId, name: groupName, subGroups: [] },
      ]);
    }

    nextGroups = nextGroups.map((g) => {
      if (g.id !== groupId) return g;
      const existingSub = findSubGroupByName(g, subGroupName);
      if (existingSub) {
        subGroupId = existingSub.id;
        return g;
      }
      subGroupId = makeId("sgrp");
      return {
        ...g,
        subGroups: g.subGroups.concat([
          { id: subGroupId, name: subGroupName, groupId },
        ]),
      };
    });

    const updatedConfig = { ...config, favoriteGroups: nextGroups };
    await SystemConfigService.update(updatedConfig);
    SystemConfigService.clearCache();
    useConfigStore.getState().setConfig(updatedConfig);
    return { groupId, subGroupId };
  };

/** Run async work over a list with a bounded number of workers active at once */
const runWithConcurrency = async <T,>(
  list: T[],
  limit: number,
  worker: (entry: T, index: number) => Promise<void>,
): Promise<void> => {
  let cursor = 0;
  const runNext = async (): Promise<void> => {
    const i = cursor++;
    if (i >= list.length) return;
    await worker(list[i], i);
    return runNext();
  };
  const runners: Promise<void>[] = [];
  for (let k = 0; k < Math.min(limit, list.length); k++)
    runners.push(runNext());
  await Promise.all(runners);
};

const stripExt = (name: string): string => {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.substring(0, i) : name;
};

/** Thumbnail with graceful fallback to a file-type placeholder */
const DocThumb: React.FC<{ item: IDocLibraryItem; className: string }> = ({
  item,
  className,
}) => {
  const [failed, setFailed] = React.useState(false);
  if (failed || !item.previewUrl) {
    return (
      <div className={styles.cardThumbPlaceholder}>
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        {item.fileType || "file"}
      </div>
    );
  }
  return (
    <img
      src={item.previewUrl}
      alt={item.title}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

/** Reusable catalog metadata form fields */
const MetadataFields: React.FC<{
  meta: IDocLibraryMetadata;
  docTypeOptions: DocCatalogType[];
  labels: IDocLibraryFieldLabels;
  groups: IFavoriteGroup[];
  lockedGroupId?: string;
  onChange: (patch: Partial<IDocLibraryMetadata>) => void;
}> = ({ meta, docTypeOptions, labels, groups, lockedGroupId, onChange }) => {
  const effectiveGroupId = lockedGroupId || meta.groupId;
  const selectedGroup = groups.find((g) => g.id === effectiveGroupId);
  const subGroupOptions = selectedGroup ? selectedGroup.subGroups : [];
  return (
    <>
      <div className={styles.formRow}>
        <label className={styles.formLabel}>Title</label>
        <input
          className={styles.formInput}
          value={meta.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.formLabel}>Type</label>
        <select
          className={styles.formSelect}
          value={meta.docType}
          onChange={(e) =>
            onChange({ docType: e.target.value as DocCatalogType })
          }
        >
          <option value="">-</option>
          {docTypeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.formRow}>
        <label className={styles.formLabel}>{labels.group}</label>
        <div className={styles.formGroupRow}>
          <select
            className={styles.formSelect}
            value={effectiveGroupId}
            disabled={!!lockedGroupId}
            onChange={(e) =>
              onChange({ groupId: e.target.value, subGroupId: "" })
            }
          >
            <option value="">-</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <select
            className={styles.formSelect}
            value={meta.subGroupId}
            disabled={!effectiveGroupId}
            onChange={(e) => onChange({ subGroupId: e.target.value })}
          >
            <option value="">-</option>
            {subGroupOptions.map((sg) => (
              <option key={sg.id} value={sg.id}>
                {sg.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.formRow}>
        <label className={styles.formLabel}>{labels.manufacturer}</label>
        <input
          className={styles.formInput}
          value={meta.manufacturer}
          onChange={(e) => onChange({ manufacturer: e.target.value })}
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.formLabel}>{labels.model}</label>
        <input
          className={styles.formInput}
          value={meta.model}
          onChange={(e) => onChange({ model: e.target.value })}
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.formLabel}>{labels.keywords}</label>
        <input
          className={styles.formInput}
          placeholder="comma-separated"
          value={meta.keywords}
          onChange={(e) => onChange({ keywords: e.target.value })}
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.formLabel}>{labels.revision}</label>
        <input
          className={styles.formInput}
          value={meta.revision}
          onChange={(e) => onChange({ revision: e.target.value })}
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.formLabel}>{labels.description}</label>
        <textarea
          className={styles.formTextarea}
          value={meta.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>
    </>
  );
};

/** Inline banner offering to create the AI-suggested Group/Sub-Group, or fall back to "Other" */
const GroupSuggestionBanner: React.FC<{
  suggestion: IGroupSuggestion;
  busy: boolean;
  onAccept: () => void;
  onUseOther: () => void;
}> = ({ suggestion, busy, onAccept, onUseOther }) => (
  <div className={styles.replaceNote}>
    ✨ AI suggests creating a new group <strong>{suggestion.groupName}</strong>{" "}
    → <strong>{suggestion.subGroupName}</strong> for this document - no existing
    group fit well.
    <div className={styles.bulkActionButtons}>
      <button
        type="button"
        className={styles.btnPrimary}
        onClick={onAccept}
        disabled={busy}
      >
        Create &amp; use it
      </button>
      <button
        type="button"
        className={styles.btnSecondary}
        onClick={onUseOther}
        disabled={busy}
      >
        Use &quot;Other&quot; instead
      </button>
    </div>
  </div>
);

export const DocLibraryCatalog: React.FC<DocLibraryCatalogProps> = ({
  title,
  icon,
  folderServerRelativeUrl,
  docTypeOptions,
  defaultDocType,
  canManage,
  fieldLabels,
  lockedGroupName,
}) => {
  const labels = React.useMemo(
    () => ({ ...DEFAULT_FIELD_LABELS, ...(fieldLabels || {}) }),
    [fieldLabels],
  );
  const config = useConfigStore((s) => s.config);
  const groups: IFavoriteGroup[] = config?.favoriteGroups || [];
  const lockedGroupId = React.useMemo(() => {
    if (!lockedGroupName) return "";
    const g = findGroupByName(groups, lockedGroupName);
    return g ? g.id : "";
  }, [groups, lockedGroupName]);
  const otherEnsuredRef = React.useRef(false);
  React.useEffect(() => {
    if (!config || otherEnsuredRef.current) return;
    const other = findGroupByName(
      config.favoriteGroups || [],
      OTHER_GROUP_NAME,
    );
    if (other && findSubGroupByName(other, OTHER_GROUP_NAME)) {
      otherEnsuredRef.current = true;
      return;
    }
    otherEnsuredRef.current = true;
    createFavoriteGroupAndSave(OTHER_GROUP_NAME, OTHER_GROUP_NAME).catch(
      (err) => console.error("Failed to provision the 'Other' group:", err),
    );
  }, [config]);

  const [items, setItems] = React.useState<IDocLibraryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");
  const [filterGroup, setFilterGroup] = React.useState("all");
  const [filterManufacturer, setFilterManufacturer] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Modal state
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [uploadFile, setUploadFile] = React.useState<File | null>(null);
  const [uploadMeta, setUploadMeta] = React.useState<IDocLibraryMetadata>(
    EMPTY_META(defaultDocType),
  );
  const [editItem, setEditItem] = React.useState<IDocLibraryItem | null>(null);
  const [editMeta, setEditMeta] = React.useState<IDocLibraryMetadata>(
    EMPTY_META(defaultDocType),
  );
  const [deleteItem, setDeleteItem] = React.useState<IDocLibraryItem | null>(
    null,
  );
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const [isDragging, setIsDragging] = React.useState(false);
  const dragCounter = React.useRef(0);
  const [uploadError, setUploadError] = React.useState("");
  const [allowOverwrite, setAllowOverwrite] = React.useState(false);
  const [replaceConfirm, setReplaceConfirm] = React.useState<File | null>(null);

  // AI metadata extraction — single item (Add Document / Edit Metadata modals)
  const [uploadAiExtracting, setUploadAiExtracting] = React.useState(false);
  const [editAiExtracting, setEditAiExtracting] = React.useState(false);
  const [editAiError, setEditAiError] = React.useState("");
  const [uploadSuggestion, setUploadSuggestion] =
    React.useState<IGroupSuggestion | null>(null);
  const [editSuggestion, setEditSuggestion] =
    React.useState<IGroupSuggestion | null>(null);
  const [suggestionBusy, setSuggestionBusy] = React.useState(false);

  // AI metadata extraction — bulk (list view multi-select)
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());
  const [selectionWarning, setSelectionWarning] = React.useState("");
  const [bulkReviewOpen, setBulkReviewOpen] = React.useState(false);
  const [bulkRows, setBulkRows] = React.useState<IBulkAiRow[]>([]);
  const [bulkSaving, setBulkSaving] = React.useState(false);

  const loadItems = React.useCallback(() => {
    setIsLoading(true);
    setError("");
    DocLibraryCatalogService.ensureColumns()
      .catch(() => {
        /* column provisioning is best-effort */
      })
      .then(() => DocLibraryCatalogService.getItems(folderServerRelativeUrl))
      .then((data) => {
        setItems(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load documents:", err);
        setError("Could not load documents from SharePoint.");
        setIsLoading(false);
      });
  }, [folderServerRelativeUrl]);

  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

  const categories = React.useMemo(
    () => groups.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [groups],
  );

  const groupName = (item: IDocLibraryItem): string =>
    groups.find((g) => g.id === item.groupId)?.name || "";
  const subGroupName = (item: IDocLibraryItem): string =>
    groups
      .find((g) => g.id === item.groupId)
      ?.subGroups.find((sg) => sg.id === item.subGroupId)?.name || "";

  const manufacturers = React.useMemo(() => {
    const set: Record<string, boolean> = {};
    items.forEach((i) => {
      if (i.manufacturer) set[i.manufacturer] = true;
    });
    return Object.keys(set).sort();
  }, [items]);

  const filteredItems = React.useMemo(() => {
    let result = items;
    if (filterType !== "all") {
      result = result.filter((i) => i.docType === filterType);
    }
    if (filterGroup !== "all") {
      result = result.filter((i) => i.groupId === filterGroup);
    }
    if (filterManufacturer !== "all") {
      result = result.filter((i) => i.manufacturer === filterManufacturer);
    }
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().indexOf(q) >= 0 ||
          i.fileName.toLowerCase().indexOf(q) >= 0 ||
          groupName(i).toLowerCase().indexOf(q) >= 0 ||
          subGroupName(i).toLowerCase().indexOf(q) >= 0 ||
          i.manufacturer.toLowerCase().indexOf(q) >= 0 ||
          i.model.toLowerCase().indexOf(q) >= 0 ||
          i.keywords.toLowerCase().indexOf(q) >= 0 ||
          i.description.toLowerCase().indexOf(q) >= 0,
      );
    }
    return result;
  }, [
    items,
    filterType,
    filterGroup,
    filterManufacturer,
    debouncedSearch,
    groups,
  ]);

  const hasFilters =
    searchTerm !== "" ||
    filterType !== "all" ||
    filterGroup !== "all" ||
    filterManufacturer !== "all";

  const clearFilters = (): void => {
    setSearchTerm("");
    setFilterType("all");
    setFilterGroup("all");
    setFilterManufacturer("all");
  };

  // ─── Handlers ───
  const isDuplicateName = (name: string): boolean => {
    const lower = name.toLowerCase();
    return items.some((i) => i.fileName.toLowerCase() === lower);
  };

  const openUpload = (): void => {
    setUploadFile(null);
    setUploadMeta(EMPTY_META(defaultDocType));
    setAllowOverwrite(false);
    setUploadError("");
    setUploadOpen(true);
  };

  const openUploadWithFile = (file: File): void => {
    // Ask to replace first (before the Add modal) when the name already exists
    if (isDuplicateName(file.name)) {
      setReplaceConfirm(file);
      return;
    }
    setUploadFile(file);
    setUploadMeta({
      ...EMPTY_META(defaultDocType),
      title: stripExt(file.name),
    });
    setAllowOverwrite(false);
    setUploadError("");
    setUploadOpen(true);
  };

  const confirmReplace = (): void => {
    if (!replaceConfirm) return;
    const file = replaceConfirm;
    setUploadFile(file);
    setUploadMeta({
      ...EMPTY_META(defaultDocType),
      title: stripExt(file.name),
    });
    setAllowOverwrite(true);
    setUploadError("");
    setReplaceConfirm(null);
    setUploadOpen(true);
  };

  const cancelReplace = (): void => {
    setReplaceConfirm(null);
  };

  // ─── Drag & drop upload ───
  const dragHasFiles = (e: React.DragEvent): boolean => {
    const types = e.dataTransfer ? e.dataTransfer.types : null;
    if (!types) return false;
    for (let i = 0; i < types.length; i++) {
      if (types[i] === "Files") return true;
    }
    return false;
  };

  const handleDragEnter = (e: React.DragEvent): void => {
    if (!canManage || uploadOpen || !dragHasFiles(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent): void => {
    if (!canManage || uploadOpen || !dragHasFiles(e)) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeave = (e: React.DragEvent): void => {
    if (!canManage) return;
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent): void => {
    if (!canManage) return;
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    const files = e.dataTransfer ? e.dataTransfer.files : null;
    if (files && files.length > 0) {
      openUploadWithFile(files[0]);
    }
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setUploadFile(f);
      setUploadMeta((m) => ({ ...m, title: m.title || stripExt(f.name) }));
      setAllowOverwrite(false);
      setUploadError("");
    }
  };

  const runAiExtractForUpload = async (): Promise<void> => {
    if (!uploadFile || uploadAiExtracting) return;
    setUploadAiExtracting(true);
    setUploadError("");
    setUploadSuggestion(null);
    try {
      const result = await AIAnalysisService.extractDocumentMetadata(
        uploadFile,
        docTypeOptions,
        groups.map((g) => ({
          name: g.name,
          subGroups: g.subGroups.map((sg) => sg.name),
        })),
      );
      const extracted = result.items[0];
      if (extracted) {
        const { meta, suggestion } = mergeExtractedMetadata(
          uploadMeta,
          extracted,
          docTypeOptions,
          groups,
        );
        setUploadMeta(meta);
        setUploadSuggestion(suggestion || null);
      } else {
        setUploadError(
          result.warnings[0] ||
            "No metadata could be extracted from this file.",
        );
      }
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "AI extraction failed.",
      );
    } finally {
      setUploadAiExtracting(false);
    }
  };

  const submitUpload = (): void => {
    if (!uploadFile) return;
    if (isDuplicateName(uploadFile.name) && !allowOverwrite) {
      setUploadError(
        `A document named "${uploadFile.name}" already exists in this folder.`,
      );
      return;
    }
    setSaving(true);
    setUploadError("");
    DocLibraryCatalogService.uploadFile(
      folderServerRelativeUrl,
      uploadFile,
      withCategory(uploadMeta, lockedGroupId),
      allowOverwrite,
    )
      .then(() => {
        setSaving(false);
        setUploadOpen(false);
        setAllowOverwrite(false);
        loadItems();
      })
      .catch((err) => {
        console.error("Upload failed:", err);
        setSaving(false);
        const msg =
          err && (err.message || String(err)) ? err.message || String(err) : "";
        if (/exist/i.test(msg)) {
          setUploadError(
            `A document named "${uploadFile.name}" already exists in this folder.`,
          );
        } else {
          setUploadError("Upload failed. Please try again.");
        }
      });
  };

  const openEdit = (item: IDocLibraryItem): void => {
    setEditItem(item);
    setEditAiError("");
    setEditSuggestion(null);
    setEditMeta({
      title: item.title,
      docType: item.docType,
      groupId: item.groupId,
      subGroupId: item.subGroupId,
      manufacturer: item.manufacturer,
      model: item.model,
      keywords: item.keywords,
      description: item.description,
      revision: item.revision,
    });
  };

  const runAiExtractForEdit = async (): Promise<void> => {
    if (!editItem || editAiExtracting) return;
    setEditAiExtracting(true);
    setEditAiError("");
    setEditSuggestion(null);
    try {
      const file = await DocLibraryCatalogService.downloadFileAsFile(
        editItem.fileServerRelativeUrl,
        editItem.fileName,
      );
      const result = await AIAnalysisService.extractDocumentMetadata(
        file,
        docTypeOptions,
        groups.map((g) => ({
          name: g.name,
          subGroups: g.subGroups.map((sg) => sg.name),
        })),
      );
      const extracted = result.items[0];
      if (extracted) {
        const { meta, suggestion } = mergeExtractedMetadata(
          editMeta,
          extracted,
          docTypeOptions,
          groups,
        );
        setEditMeta(meta);
        setEditSuggestion(suggestion || null);
      } else {
        setEditAiError(
          result.warnings[0] ||
            "No metadata could be extracted from this file.",
        );
      }
    } catch (err) {
      setEditAiError(
        err instanceof Error ? err.message : "AI extraction failed.",
      );
    } finally {
      setEditAiExtracting(false);
    }
  };

  /** Resolve the ids of the catch-all "Other" Group/Sub-Group (provisioned on mount) */
  const otherGroupIds = (): { groupId: string; subGroupId: string } => {
    const g = findGroupByName(groups, OTHER_GROUP_NAME);
    const sg = findSubGroupByName(g, OTHER_GROUP_NAME);
    return { groupId: g ? g.id : "", subGroupId: sg ? sg.id : "" };
  };

  const acceptUploadSuggestion = async (): Promise<void> => {
    if (!uploadSuggestion) return;
    setSuggestionBusy(true);
    try {
      const { groupId, subGroupId } = await createFavoriteGroupAndSave(
        lockedGroupName || uploadSuggestion.groupName,
        uploadSuggestion.subGroupName,
      );
      setUploadMeta((m) => ({ ...m, groupId, subGroupId }));
      setUploadSuggestion(null);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Failed to create the group.",
      );
    } finally {
      setSuggestionBusy(false);
    }
  };

  const useOtherForUpload = (): void => {
    setUploadMeta((m) => ({ ...m, ...otherGroupIds() }));
    setUploadSuggestion(null);
  };

  const acceptEditSuggestion = async (): Promise<void> => {
    if (!editSuggestion) return;
    setSuggestionBusy(true);
    try {
      const { groupId, subGroupId } = await createFavoriteGroupAndSave(
        lockedGroupName || editSuggestion.groupName,
        editSuggestion.subGroupName,
      );
      setEditMeta((m) => ({ ...m, groupId, subGroupId }));
      setEditSuggestion(null);
    } catch (err) {
      setEditAiError(
        err instanceof Error ? err.message : "Failed to create the group.",
      );
    } finally {
      setSuggestionBusy(false);
    }
  };

  const useOtherForEdit = (): void => {
    setEditMeta((m) => ({ ...m, ...otherGroupIds() }));
    setEditSuggestion(null);
  };

  const submitEdit = (): void => {
    if (!editItem) return;
    setSaving(true);
    DocLibraryCatalogService.updateMetadata(
      editItem.id,
      withCategory(editMeta, lockedGroupId),
    )
      .then(() => {
        setSaving(false);
        setEditItem(null);
        loadItems();
      })
      .catch((err) => {
        console.error("Update failed:", err);
        setSaving(false);
        setError("Could not save changes.");
      });
  };

  const confirmDelete = (): void => {
    if (!deleteItem) return;
    setSaving(true);
    DocLibraryCatalogService.deleteFile(deleteItem.fileServerRelativeUrl)
      .then(() => {
        setSaving(false);
        setDeleteItem(null);
        loadItems();
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        setSaving(false);
        setError("Could not delete the file.");
      });
  };

  const keywordList = (kw: string): string[] =>
    kw
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k);

  // ─── Bulk selection (list view) ───
  const toggleSelect = (id: number): void => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setSelectionWarning("");
      } else {
        if (next.size >= MAX_BULK_AI_SELECTION) {
          setSelectionWarning(
            `You can select up to ${MAX_BULK_AI_SELECTION} documents at a time.`,
          );
          return prev;
        }
        next.add(id);
        setSelectionWarning("");
      }
      return next;
    });
  };

  const allVisibleSelected =
    filteredItems.length > 0 &&
    filteredItems.every((i) => selectedIds.has(i.id));

  const toggleSelectAllVisible = (): void => {
    if (allVisibleSelected) {
      setSelectedIds(new Set());
      setSelectionWarning("");
      return;
    }
    const capped = filteredItems.slice(0, MAX_BULK_AI_SELECTION);
    setSelectedIds(new Set(capped.map((i) => i.id)));
    setSelectionWarning(
      filteredItems.length > MAX_BULK_AI_SELECTION
        ? `Only the first ${MAX_BULK_AI_SELECTION} documents were selected (limit reached).`
        : "",
    );
  };

  const clearSelection = (): void => {
    setSelectedIds(new Set());
    setSelectionWarning("");
  };

  // ─── Bulk AI fill (list view) ───
  const extractBulkRow = async (
    row: IBulkAiRow,
    index: number,
  ): Promise<void> => {
    setBulkRows((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, status: "extracting", error: undefined } : r,
      ),
    );
    try {
      const file = await DocLibraryCatalogService.downloadFileAsFile(
        row.item.fileServerRelativeUrl,
        row.item.fileName,
      );
      const result = await AIAnalysisService.extractDocumentMetadata(
        file,
        docTypeOptions,
        groups.map((g) => ({
          name: g.name,
          subGroups: g.subGroups.map((sg) => sg.name),
        })),
      );
      const extracted = result.items[0];
      setBulkRows((prev) =>
        prev.map((r, i) => {
          if (i !== index) return r;
          if (!extracted) {
            return {
              ...r,
              status: "error",
              error:
                result.warnings[0] ||
                "No metadata could be extracted from this file.",
            };
          }
          const { meta, suggestion } = mergeExtractedMetadata(
            r.meta,
            extracted,
            docTypeOptions,
            groups,
          );
          return { ...r, status: "extracted", meta, suggestion };
        }),
      );
    } catch (err) {
      setBulkRows((prev) =>
        prev.map((r, i) =>
          i === index
            ? {
                ...r,
                status: "error",
                error:
                  err instanceof Error ? err.message : "AI extraction failed.",
              }
            : r,
        ),
      );
    }
  };

  const openBulkAi = (): void => {
    const rows: IBulkAiRow[] = items
      .filter((i) => selectedIds.has(i.id))
      .map((item) => ({
        item,
        meta: {
          title: item.title,
          docType: item.docType,
          groupId: item.groupId,
          subGroupId: item.subGroupId,
          manufacturer: item.manufacturer,
          model: item.model,
          keywords: item.keywords,
          description: item.description,
          revision: item.revision,
        },
        status: "pending" as BulkAiStatus,
        include: true,
      }));
    setBulkRows(rows);
    setBulkReviewOpen(true);
    void runWithConcurrency(rows, BULK_AI_CONCURRENCY, extractBulkRow);
  };

  const retryBulkRow = (index: number): void => {
    const row = bulkRows[index];
    if (!row) return;
    void extractBulkRow(row, index);
  };

  const toggleBulkRowInclude = (index: number): void => {
    setBulkRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, include: !r.include } : r)),
    );
  };

  const updateBulkRowMeta = (
    index: number,
    patch: Partial<IDocLibraryMetadata>,
  ): void => {
    setBulkRows((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, meta: { ...r.meta, ...patch } } : r,
      ),
    );
  };

  const acceptBulkRowSuggestion = async (index: number): Promise<void> => {
    const row = bulkRows[index];
    if (!row || !row.suggestion) return;
    setSuggestionBusy(true);
    try {
      const { groupId, subGroupId } = await createFavoriteGroupAndSave(
        lockedGroupName || row.suggestion.groupName,
        row.suggestion.subGroupName,
      );
      setBulkRows((prev) =>
        prev.map((r, i) =>
          i === index
            ? {
                ...r,
                meta: { ...r.meta, groupId, subGroupId },
                suggestion: undefined,
              }
            : r,
        ),
      );
    } catch (err) {
      setBulkRows((prev) =>
        prev.map((r, i) =>
          i === index
            ? {
                ...r,
                error:
                  err instanceof Error
                    ? err.message
                    : "Failed to create the group.",
              }
            : r,
        ),
      );
    } finally {
      setSuggestionBusy(false);
    }
  };

  const useOtherForBulkRow = (index: number): void => {
    setBulkRows((prev) =>
      prev.map((r, i) =>
        i === index
          ? {
              ...r,
              meta: { ...r.meta, ...otherGroupIds() },
              suggestion: undefined,
            }
          : r,
      ),
    );
  };

  const closeBulkAi = (): void => {
    setBulkReviewOpen(false);
    setBulkRows([]);
  };

  const saveBulkAi = async (): Promise<void> => {
    setBulkSaving(true);
    const rowsToSave = bulkRows.filter(
      (r) => r.include && r.status === "extracted",
    );
    await runWithConcurrency(rowsToSave, BULK_AI_CONCURRENCY, async (row) => {
      try {
        await DocLibraryCatalogService.updateMetadata(
          row.item.id,
          withCategory(row.meta, lockedGroupId),
        );
        setBulkRows((prev) =>
          prev.map((r) =>
            r.item.id === row.item.id
              ? { ...r, saved: true, saveError: undefined }
              : r,
          ),
        );
      } catch (err) {
        setBulkRows((prev) =>
          prev.map((r) =>
            r.item.id === row.item.id
              ? {
                  ...r,
                  saved: false,
                  saveError:
                    err instanceof Error ? err.message : "Save failed.",
                }
              : r,
          ),
        );
      }
    });
    setBulkSaving(false);
    loadItems();
    clearSelection();
  };

  return (
    <div
      className={styles.page}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className={styles.dropOverlay}>
          <div className={styles.dropOverlayInner}>
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 5 17 10" />
              <line x1="12" y1="5" x2="12" y2="17" />
            </svg>
            <span>Drop file to add a document</span>
          </div>
        </div>
      )}
      <PageHeader
        title={title}
        subtitle={`${filteredItems.length} of ${items.length} documents`}
        icon={icon}
        actions={
          canManage ? (
            <button className={styles.addBtn} onClick={openUpload}>
              + Add Document
            </button>
          ) : undefined
        }
      />

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <svg
            className={styles.searchIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className={styles.searchInput}
            placeholder={labels.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className={styles.clearBtn}
              onClick={() => setSearchTerm("")}
              title="Clear"
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.filterGroup}>
          {docTypeOptions.length > 1 && (
            <select
              className={styles.filterSelect}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              {docTypeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
          <select
            className={styles.filterSelect}
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
          >
            <option value="all">All Groups</option>
            {categories.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <select
            className={styles.filterSelect}
            value={filterManufacturer}
            onChange={(e) => setFilterManufacturer(e.target.value)}
          >
            <option value="all">{labels.allManufacturers}</option>
            {manufacturers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button className={styles.clearFiltersBtn} onClick={clearFilters}>
              Clear
            </button>
          )}
        </div>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewBtnActive : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
          <button
            className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewBtnActive : ""}`}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <p style={{ color: "var(--danger, #ef4444)", fontSize: 13 }}>{error}</p>
      )}

      {/* Content */}
      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Loading documents…</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className={styles.emptyWrap}>
          <EmptyState
            title="No documents found"
            description={
              hasFilters
                ? "Try adjusting your filters or search."
                : canManage
                  ? "Add a document to start cataloguing."
                  : "No documents catalogued yet."
            }
            actionLabel={canManage && !hasFilters ? "Add Document" : undefined}
            onAction={canManage && !hasFilters ? openUpload : undefined}
          />
        </div>
      ) : viewMode === "grid" ? (
        <div className={styles.cardGrid}>
          {filteredItems.map((item) => (
            <div key={item.id} className={styles.docCard}>
              <div className={styles.cardThumbWrapper}>
                <DocThumb item={item} className={styles.cardThumb} />
                {item.docType && (
                  <span className={styles.docTypeBadge}>{item.docType}</span>
                )}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <div className={styles.cardMeta}>
                  {item.manufacturer && (
                    <span className={styles.cardMetaRow}>
                      <strong>{labels.manufacturerShort}:</strong>{" "}
                      {item.manufacturer}
                    </span>
                  )}
                  {item.model && (
                    <span className={styles.cardMetaRow}>
                      <strong>{labels.modelShort}:</strong> {item.model}
                    </span>
                  )}
                  {groupName(item) && (
                    <span className={styles.cardMetaRow}>
                      <strong>{labels.groupShort}:</strong> {groupName(item)}
                      {subGroupName(item) ? ` / ${subGroupName(item)}` : ""}
                    </span>
                  )}
                  {item.revision && (
                    <span className={styles.cardMetaRow}>
                      <strong>{labels.revisionShort}:</strong> {item.revision}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className={styles.cardDescription}>{item.description}</p>
                )}
                {keywordList(item.keywords).length > 0 && (
                  <div className={styles.cardKeywords}>
                    {keywordList(item.keywords)
                      .slice(0, 4)
                      .map((k, idx) => (
                        <span key={idx} className={styles.keywordChip}>
                          {k}
                        </span>
                      ))}
                  </div>
                )}
              </div>
              <div className={styles.cardFooter}>
                <a
                  className={styles.openLink}
                  href={item.fileAbsoluteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open ({formatFileSize(item.size)})
                </a>
                {canManage && (
                  <div className={styles.cardActions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => openEdit(item)}
                      title="Edit metadata"
                    >
                      ✏️
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => setDeleteItem(item)}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {canManage && (selectedIds.size > 0 || selectionWarning) && (
            <div className={styles.bulkActionBar}>
              <span className={styles.bulkActionCount}>
                {selectedIds.size} selected
              </span>
              {selectionWarning && (
                <span className={styles.bulkActionWarning}>
                  {selectionWarning}
                </span>
              )}
              <div className={styles.bulkActionButtons}>
                <button
                  className={styles.aiExtractBtn}
                  onClick={openBulkAi}
                  disabled={selectedIds.size === 0}
                >
                  Run AI on {selectedIds.size} selected
                </button>
                <button
                  className={styles.btnSecondary}
                  onClick={clearSelection}
                >
                  Clear selection
                </button>
              </div>
            </div>
          )}
          <div style={{ overflowX: "auto" }}>
            <table className={styles.listTable}>
              <thead>
                <tr>
                  {canManage && (
                    <th style={{ width: 36 }}>
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAllVisible}
                        title={`Select up to ${MAX_BULK_AI_SELECTION} for bulk AI fill`}
                      />
                    </th>
                  )}
                  <th style={{ width: 60 }} />
                  <th>Title</th>
                  <th>Type</th>
                  <th>{labels.manufacturerColumn}</th>
                  <th>{labels.groupShort}</th>
                  <th>{labels.revisionShort}</th>
                  <th>Size</th>
                  <th style={{ width: 130 }} />
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    {canManage && (
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                        />
                      </td>
                    )}
                    <td>
                      <DocThumb item={item} className={styles.listThumb} />
                    </td>
                    <td>{item.title}</td>
                    <td>{item.docType || "-"}</td>
                    <td>{item.manufacturer || "-"}</td>
                    <td>
                      {groupName(item)
                        ? `${groupName(item)}${subGroupName(item) ? ` / ${subGroupName(item)}` : ""}`
                        : "-"}
                    </td>
                    <td>{item.revision || "-"}</td>
                    <td>{formatFileSize(item.size)}</td>
                    <td>
                      <div className={styles.cardActions}>
                        <a
                          className={styles.actionBtn}
                          href={item.fileAbsoluteUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Open"
                        >
                          ↗
                        </a>
                        {canManage && (
                          <>
                            <button
                              className={styles.actionBtn}
                              onClick={() => openEdit(item)}
                              title="Edit metadata"
                            >
                              ✏️
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.deleteBtn}`}
                              onClick={() => setDeleteItem(item)}
                              title="Delete"
                            >
                              🗑
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add Document</h3>
              <button
                className={styles.modalClose}
                onClick={() => setUploadOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>File</label>
                <div className={styles.fileDrop}>
                  <input type="file" onChange={onPickFile} />
                  {uploadFile && (
                    <div className={styles.fileName}>{uploadFile.name}</div>
                  )}
                </div>
                <button
                  type="button"
                  className={styles.aiExtractBtn}
                  onClick={runAiExtractForUpload}
                  disabled={!uploadFile || uploadAiExtracting}
                  title={
                    uploadFile
                      ? "Fill the fields below from this document with AI"
                      : "Choose a file first"
                  }
                >
                  {uploadAiExtracting ? "Extracting…" : "✨ Extract with AI"}
                </button>
              </div>
              {uploadFile &&
                isDuplicateName(uploadFile.name) &&
                (allowOverwrite ? (
                  <div className={styles.replaceNote}>
                    ↻ This will replace the existing file &quot;
                    {uploadFile.name}&quot;.
                  </div>
                ) : (
                  <div className={styles.dupWarning}>
                    ⚠️ A document named &quot;{uploadFile.name}&quot; already
                    exists in this folder.
                    <button
                      className={styles.replaceBtn}
                      onClick={() => setAllowOverwrite(true)}
                    >
                      Replace existing file
                    </button>
                  </div>
                ))}
              {uploadError && (
                <div className={styles.dupWarning}>{uploadError}</div>
              )}
              {uploadSuggestion && (
                <GroupSuggestionBanner
                  suggestion={uploadSuggestion}
                  busy={suggestionBusy}
                  onAccept={acceptUploadSuggestion}
                  onUseOther={useOtherForUpload}
                />
              )}
              <div
                className={`${styles.formFieldsWrapper} ${
                  uploadAiExtracting ? styles.formFieldsFading : ""
                }`}
              >
                <MetadataFields
                  meta={uploadMeta}
                  docTypeOptions={docTypeOptions}
                  labels={labels}
                  groups={groups}
                  lockedGroupId={lockedGroupId}
                  onChange={(patch) =>
                    setUploadMeta((m) => ({ ...m, ...patch }))
                  }
                />
                {uploadAiExtracting && (
                  <div className={styles.formFieldsOverlay}>
                    <div className={styles.overlaySpinner} />
                    <span>Extracting with AI…</span>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnSecondary}
                onClick={() => setUploadOpen(false)}
              >
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                onClick={submitUpload}
                disabled={
                  !uploadFile ||
                  saving ||
                  (!!uploadFile &&
                    isDuplicateName(uploadFile.name) &&
                    !allowOverwrite)
                }
              >
                {saving ? "Uploading…" : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replace confirmation — shown before the Add modal when a duplicate is dropped */}
      {replaceConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: 440 }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>File Already Exists</h3>
              <button className={styles.modalClose} onClick={cancelReplace}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.confirmText}>
                A document named <strong>{replaceConfirm.name}</strong> already
                exists in this folder. Do you want to replace it?
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={cancelReplace}>
                Cancel
              </button>
              <button className={styles.btnPrimary} onClick={confirmReplace}>
                Replace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Metadata</h3>
              <button
                className={styles.modalClose}
                onClick={() => setEditItem(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <button
                type="button"
                className={styles.aiExtractBtn}
                onClick={runAiExtractForEdit}
                disabled={editAiExtracting}
                title="Re-read this document with AI and fill the fields below"
              >
                {editAiExtracting ? "Extracting…" : "✨ Extract with AI"}
              </button>
              {editAiError && (
                <div className={styles.dupWarning}>{editAiError}</div>
              )}
              {editSuggestion && (
                <GroupSuggestionBanner
                  suggestion={editSuggestion}
                  busy={suggestionBusy}
                  onAccept={acceptEditSuggestion}
                  onUseOther={useOtherForEdit}
                />
              )}
              <div
                className={`${styles.formFieldsWrapper} ${
                  editAiExtracting ? styles.formFieldsFading : ""
                }`}
              >
                <MetadataFields
                  meta={editMeta}
                  docTypeOptions={docTypeOptions}
                  labels={labels}
                  groups={groups}
                  lockedGroupId={lockedGroupId}
                  onChange={(patch) => setEditMeta((m) => ({ ...m, ...patch }))}
                />
                {editAiExtracting && (
                  <div className={styles.formFieldsOverlay}>
                    <div className={styles.overlaySpinner} />
                    <span>Extracting with AI…</span>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnSecondary}
                onClick={() => setEditItem(null)}
              >
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                onClick={submitEdit}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk AI Review Modal (list view, multi-select) */}
      {bulkReviewOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.bulkReviewModal}`}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Run AI on {bulkRows.length} document
                {bulkRows.length > 1 ? "s" : ""}
              </h3>
              <button className={styles.modalClose} onClick={closeBulkAi}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              {bulkRows.map((row, index) => (
                <div key={row.item.id} className={styles.bulkRowCard}>
                  <div className={styles.bulkRowHeader}>
                    <label className={styles.bulkRowIncludeLabel}>
                      <input
                        type="checkbox"
                        checked={row.include}
                        onChange={() => toggleBulkRowInclude(index)}
                      />
                      <span>{row.item.fileName}</span>
                    </label>
                    <span
                      className={`${styles.bulkStatusBadge} ${styles[`bulkStatus_${row.status}`]}`}
                    >
                      {row.status === "pending" && "Waiting…"}
                      {row.status === "extracting" && "Extracting…"}
                      {row.status === "extracted" && "Ready"}
                      {row.status === "error" && "Failed"}
                    </span>
                    {row.saved && (
                      <span className={styles.bulkSavedBadge}>Saved ✓</span>
                    )}
                    {row.status === "error" && (
                      <button
                        type="button"
                        className={styles.btnSecondary}
                        onClick={() => retryBulkRow(index)}
                      >
                        Retry
                      </button>
                    )}
                  </div>
                  {row.error && (
                    <div className={styles.dupWarning}>{row.error}</div>
                  )}
                  {row.saveError && (
                    <div className={styles.dupWarning}>
                      Save failed: {row.saveError}
                    </div>
                  )}
                  {row.suggestion && (
                    <GroupSuggestionBanner
                      suggestion={row.suggestion}
                      busy={suggestionBusy}
                      onAccept={() => acceptBulkRowSuggestion(index)}
                      onUseOther={() => useOtherForBulkRow(index)}
                    />
                  )}
                  <div
                    className={`${styles.formFieldsWrapper} ${
                      row.status === "pending" || row.status === "extracting"
                        ? styles.formFieldsFading
                        : ""
                    }`}
                  >
                    <MetadataFields
                      meta={row.meta}
                      docTypeOptions={docTypeOptions}
                      labels={labels}
                      groups={groups}
                      lockedGroupId={lockedGroupId}
                      onChange={(patch) => updateBulkRowMeta(index, patch)}
                    />
                    {(row.status === "pending" ||
                      row.status === "extracting") && (
                      <div className={styles.formFieldsOverlay}>
                        <div className={styles.overlaySpinner} />
                        <span>
                          {row.status === "extracting"
                            ? "Extracting with AI…"
                            : "Waiting…"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.modalFooter}>
              <span className={styles.bulkActionCount}>
                {bulkRows.filter((r) => r.status === "extracted").length} ready
                · {bulkRows.filter((r) => r.status === "error").length} failed ·{" "}
                {bulkRows.filter((r) => r.saved).length} saved
              </span>
              <button className={styles.btnSecondary} onClick={closeBulkAi}>
                Close
              </button>
              <button
                className={styles.btnPrimary}
                onClick={saveBulkAi}
                disabled={
                  bulkSaving ||
                  bulkRows.filter((r) => r.include && r.status === "extracted")
                    .length === 0
                }
              >
                {bulkSaving ? "Saving…" : "Save All"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: 420 }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Delete Document</h3>
              <button
                className={styles.modalClose}
                onClick={() => setDeleteItem(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.confirmText}>
                Delete <strong>{deleteItem.fileName}</strong>? This removes the
                file from SharePoint and cannot be undone.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnSecondary}
                onClick={() => setDeleteItem(null)}
              >
                Cancel
              </button>
              <button
                className={styles.btnDanger}
                onClick={confirmDelete}
                disabled={saving}
              >
                {saving ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
