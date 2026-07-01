import * as React from "react";
import { PageHeader } from "../common/PageHeader";
import { EmptyState } from "../common/EmptyState";
import { DocLibraryCatalogService } from "../../services/DocLibraryCatalogService";
import {
  IDocLibraryItem,
  IDocLibraryMetadata,
  DocCatalogType,
} from "../../models/IDocLibraryItem";
import { useDebounce } from "../../hooks/useDebounce";
import { formatFileSize } from "../../utils/formatters";
import styles from "./DocLibraryCatalog.module.scss";

export interface DocLibraryCatalogProps {
  title: string;
  icon: React.ReactNode;
  folderServerRelativeUrl: string;
  docTypeOptions: DocCatalogType[];
  defaultDocType: DocCatalogType;
  canManage: boolean;
}

type ViewMode = "grid" | "list";

const EMPTY_META = (docType: DocCatalogType): IDocLibraryMetadata => ({
  title: "",
  docType,
  category: "",
  manufacturer: "",
  model: "",
  keywords: "",
  description: "",
  revision: "",
});

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
  onChange: (patch: Partial<IDocLibraryMetadata>) => void;
}> = ({ meta, docTypeOptions, onChange }) => (
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
        <option value="">—</option>
        {docTypeOptions.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
    <div className={styles.formRow}>
      <label className={styles.formLabel}>Category</label>
      <input
        className={styles.formInput}
        value={meta.category}
        onChange={(e) => onChange({ category: e.target.value })}
      />
    </div>
    <div className={styles.formRow}>
      <label className={styles.formLabel}>Manufacturer / Brand</label>
      <input
        className={styles.formInput}
        value={meta.manufacturer}
        onChange={(e) => onChange({ manufacturer: e.target.value })}
      />
    </div>
    <div className={styles.formRow}>
      <label className={styles.formLabel}>Model / Equipment</label>
      <input
        className={styles.formInput}
        value={meta.model}
        onChange={(e) => onChange({ model: e.target.value })}
      />
    </div>
    <div className={styles.formRow}>
      <label className={styles.formLabel}>Keywords / Tags</label>
      <input
        className={styles.formInput}
        placeholder="comma-separated"
        value={meta.keywords}
        onChange={(e) => onChange({ keywords: e.target.value })}
      />
    </div>
    <div className={styles.formRow}>
      <label className={styles.formLabel}>Revision / Date</label>
      <input
        className={styles.formInput}
        value={meta.revision}
        onChange={(e) => onChange({ revision: e.target.value })}
      />
    </div>
    <div className={styles.formRow}>
      <label className={styles.formLabel}>Description</label>
      <textarea
        className={styles.formTextarea}
        value={meta.description}
        onChange={(e) => onChange({ description: e.target.value })}
      />
    </div>
  </>
);

export const DocLibraryCatalog: React.FC<DocLibraryCatalogProps> = ({
  title,
  icon,
  folderServerRelativeUrl,
  docTypeOptions,
  defaultDocType,
  canManage,
}) => {
  const [items, setItems] = React.useState<IDocLibraryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");
  const [filterCategory, setFilterCategory] = React.useState("all");
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

  const categories = React.useMemo(() => {
    const set: Record<string, boolean> = {};
    items.forEach((i) => {
      if (i.category) set[i.category] = true;
    });
    return Object.keys(set).sort();
  }, [items]);

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
    if (filterCategory !== "all") {
      result = result.filter((i) => i.category === filterCategory);
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
          i.category.toLowerCase().indexOf(q) >= 0 ||
          i.manufacturer.toLowerCase().indexOf(q) >= 0 ||
          i.model.toLowerCase().indexOf(q) >= 0 ||
          i.keywords.toLowerCase().indexOf(q) >= 0 ||
          i.description.toLowerCase().indexOf(q) >= 0,
      );
    }
    return result;
  }, [items, filterType, filterCategory, filterManufacturer, debouncedSearch]);

  const hasFilters =
    searchTerm !== "" ||
    filterType !== "all" ||
    filterCategory !== "all" ||
    filterManufacturer !== "all";

  const clearFilters = (): void => {
    setSearchTerm("");
    setFilterType("all");
    setFilterCategory("all");
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
      uploadMeta,
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
    setEditMeta({
      title: item.title,
      docType: item.docType,
      category: item.category,
      manufacturer: item.manufacturer,
      model: item.model,
      keywords: item.keywords,
      description: item.description,
      revision: item.revision,
    });
  };

  const submitEdit = (): void => {
    if (!editItem) return;
    setSaving(true);
    DocLibraryCatalogService.updateMetadata(editItem.id, editMeta)
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
            placeholder="Search by title, manufacturer, keyword..."
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
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className={styles.filterSelect}
            value={filterManufacturer}
            onChange={(e) => setFilterManufacturer(e.target.value)}
          >
            <option value="all">All Manufacturers</option>
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
                      <strong>Mfr:</strong> {item.manufacturer}
                    </span>
                  )}
                  {item.model && (
                    <span className={styles.cardMetaRow}>
                      <strong>Model:</strong> {item.model}
                    </span>
                  )}
                  {item.category && (
                    <span className={styles.cardMetaRow}>
                      <strong>Category:</strong> {item.category}
                    </span>
                  )}
                  {item.revision && (
                    <span className={styles.cardMetaRow}>
                      <strong>Rev:</strong> {item.revision}
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
        <div style={{ overflowX: "auto" }}>
          <table className={styles.listTable}>
            <thead>
              <tr>
                <th style={{ width: 60 }} />
                <th>Title</th>
                <th>Type</th>
                <th>Manufacturer</th>
                <th>Category</th>
                <th>Rev</th>
                <th>Size</th>
                <th style={{ width: 130 }} />
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <DocThumb item={item} className={styles.listThumb} />
                  </td>
                  <td>{item.title}</td>
                  <td>{item.docType || "—"}</td>
                  <td>{item.manufacturer || "—"}</td>
                  <td>{item.category || "—"}</td>
                  <td>{item.revision || "—"}</td>
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
              <MetadataFields
                meta={uploadMeta}
                docTypeOptions={docTypeOptions}
                onChange={(patch) => setUploadMeta((m) => ({ ...m, ...patch }))}
              />
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
              <MetadataFields
                meta={editMeta}
                docTypeOptions={docTypeOptions}
                onChange={(patch) => setEditMeta((m) => ({ ...m, ...patch }))}
              />
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
