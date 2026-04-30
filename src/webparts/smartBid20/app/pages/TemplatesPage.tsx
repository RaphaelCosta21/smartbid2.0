import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { TemplateCard } from "../components/template/TemplateCard";
import { TemplateEditor } from "../components/template/TemplateEditor";
import { TemplatePreview } from "../components/template/TemplatePreview";
import { AIDocumentAnalyzer } from "../components/common/AIDocumentAnalyzer";
import { useTemplates } from "../hooks/useTemplates";
import { useConfigStore } from "../stores/useConfigStore";
import { useUIStore } from "../stores/useUIStore";
import { IBidTemplate } from "../models/IBidTemplate";
import { IScopeItem } from "../models";
import { DIVISIONS, SERVICE_LINES } from "../utils/constants";
import { makeId } from "../utils/idGenerator";
import { TemplateService } from "../services/TemplateService";
import styles from "./TemplatesPage.module.scss";

type ViewMode = "grid" | "list";

export const TemplatesPage: React.FC = () => {
  const {
    templates,
    isLoading,
    addTemplate,
    updateTemplate,
    removeTemplate,
    loadTemplates,
  } = useTemplates();

  const config = useConfigStore((s) => s.config);

  const [search, setSearch] = React.useState("");
  const [filterDivision, setFilterDivision] = React.useState("");
  const [filterServiceLine, setFilterServiceLine] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<
    "" | "active" | "inactive"
  >("");
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const [showEditor, setShowEditor] = React.useState(false);
  const [editorViewOnly, setEditorViewOnly] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<
    IBidTemplate | undefined
  >(undefined);
  const [previewTemplate, setPreviewTemplate] =
    React.useState<IBidTemplate | null>(null);
  const [showAIAnalyzer, setShowAIAnalyzer] = React.useState(false);
  const [aiTemplateId, setAiTemplateId] = React.useState("");

  // Collapse sidebar when editor is open, restore on close
  const setSidebarExpanded = useUIStore((s) => s.setSidebarExpanded);
  React.useEffect(() => {
    if (showEditor) {
      const wasExpanded = useUIStore.getState().sidebarExpanded;
      setSidebarExpanded(false);
      return () => {
        setSidebarExpanded(wasExpanded);
      };
    }
  }, [showEditor]); // eslint-disable-line react-hooks/exhaustive-deps

  const divisionOptions = React.useMemo(() => {
    if (config?.divisions) {
      return config.divisions.filter((d) => d.isActive).map((d) => d.value);
    }
    return DIVISIONS as unknown as string[];
  }, [config]);

  const serviceLineOptions = React.useMemo(() => {
    if (config?.serviceLines) {
      return config.serviceLines
        .filter((sl) => sl.isActive)
        .map((sl) => sl.value);
    }
    return SERVICE_LINES as unknown as string[];
  }, [config]);

  const filtered = React.useMemo(() => {
    let result = templates;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().indexOf(q) >= 0 ||
          t.description.toLowerCase().indexOf(q) >= 0 ||
          t.category.toLowerCase().indexOf(q) >= 0 ||
          t.tags.some((tag) => tag.toLowerCase().indexOf(q) >= 0),
      );
    }

    if (filterDivision) {
      result = result.filter((t) => t.division === filterDivision);
    }

    if (filterServiceLine) {
      result = result.filter((t) => t.serviceLine === filterServiceLine);
    }

    if (filterStatus === "active") {
      result = result.filter((t) => t.isActive);
    } else if (filterStatus === "inactive") {
      result = result.filter((t) => !t.isActive);
    }

    return result;
  }, [templates, search, filterDivision, filterServiceLine, filterStatus]);

  const activeCount = templates.filter((t) => t.isActive).length;
  const totalScopeItems = templates.reduce(
    (acc, t) => acc + (t.scopeItems || []).filter((i) => !i.isSection).length,
    0,
  );

  const handleCreate = (): void => {
    setEditingTemplate(undefined);
    setEditorViewOnly(false);
    setShowEditor(true);
  };

  const handleAIImport = (items: IScopeItem[]): void => {
    // Delete the placeholder row (it was only used for AI polling)
    if (aiTemplateId) {
      TemplateService.deleteTemplate(aiTemplateId).catch(() => {});
    }
    // Create a new template pre-populated with AI-generated scope items
    const tpl: IBidTemplate = {
      id: makeId("tpl"),
      name: "",
      description: "Generated from AI document analysis",
      division: "",
      serviceLine: "",
      category: "",
      scopeItems: items,
      createdBy: "",
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      lastModifiedBy: "",
      version: 1,
      usageCount: 0,
      isActive: true,
      tags: ["ai-generated"],
    };
    setEditingTemplate(tpl);
    setShowAIAnalyzer(false);
    setAiTemplateId("");
    setEditorViewOnly(false);
    setShowEditor(true);
  };

  const handleEdit = (tpl: IBidTemplate): void => {
    setEditingTemplate(tpl);
    setEditorViewOnly(true);
    setShowEditor(true);
  };

  const handleDuplicate = (tpl: IBidTemplate): void => {
    const dup: IBidTemplate = {
      ...tpl,
      id: makeId("tpl"),
      name: `${tpl.name} (Copy)`,
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      usageCount: 0,
      version: 1,
    };
    setEditingTemplate(dup);
    setEditorViewOnly(false);
    setShowEditor(true);
  };

  const handleDelete = (tpl: IBidTemplate): void => {
    if (
      window.confirm(
        `Delete template "${tpl.name}"? This action cannot be undone.`,
      )
    ) {
      removeTemplate(tpl.id);
    }
  };

  const handleSave = async (tpl: IBidTemplate): Promise<void> => {
    if (editingTemplate && templates.some((t) => t.id === tpl.id)) {
      await updateTemplate(tpl);
    } else {
      await addTemplate(tpl);
    }
    setShowEditor(false);
    setEditingTemplate(undefined);
    setEditorViewOnly(false);
  };

  const handleCancelEditor = (): void => {
    setShowEditor(false);
    setEditingTemplate(undefined);
    setEditorViewOnly(false);
  };

  const clearFilters = (): void => {
    setSearch("");
    setFilterDivision("");
    setFilterServiceLine("");
    setFilterStatus("");
  };

  const hasFilters =
    search || filterDivision || filterServiceLine || filterStatus;

  // Full-screen editor mode
  if (showEditor) {
    const editorTitle = !editingTemplate
      ? "New Template"
      : editorViewOnly
        ? "View Template"
        : "Edit Template";
    return (
      <div className={styles.page}>
        <PageHeader
          title={editorTitle}
          subtitle={
            editorViewOnly
              ? "Click Edit on each section to make changes"
              : "Define template metadata and scope of supply items"
          }
          icon={
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          }
        />
        <TemplateEditor
          template={editingTemplate}
          onSave={handleSave}
          onCancel={handleCancelEditor}
          viewOnly={editorViewOnly}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Scope Templates"
        subtitle={`${templates.length} templates — ${activeCount} active — ${totalScopeItems} total scope items`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        }
      />

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />

          <select
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Divisions</option>
            {divisionOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={filterServiceLine}
            onChange={(e) => setFilterServiceLine(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Service Lines</option>
            {serviceLineOptions.map((sl) => (
              <option key={sl} value={sl}>
                {sl}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "" | "active" | "inactive")
            }
            className={styles.filterSelect}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {hasFilters && (
            <button onClick={clearFilters} className={styles.clearBtn}>
              ✕ Clear
            </button>
          )}
        </div>

        <div className={styles.toolbarRight}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewActive : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewActive : ""}`}
              onClick={() => setViewMode("list")}
              title="List view"
            >
              ☰
            </button>
          </div>

          <button onClick={() => loadTemplates()} className={styles.refreshBtn}>
            ↻ Refresh
          </button>

          <button onClick={handleCreate} className={styles.createBtn}>
            + New Template
          </button>

          <button
            onClick={async () => {
              const tempId = makeId("tpl");
              // Create placeholder row in smartbid-templates so the flow can write AIResponse
              await TemplateService.create({
                id: tempId,
                name: "AI Placeholder",
                description: "",
                division: "",
                serviceLine: "",
                category: "",
                scopeItems: [],
                createdBy: "",
                createdDate: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                lastModifiedBy: "",
                version: 0,
                usageCount: 0,
                isActive: false,
                tags: ["ai-pending"],
              }).catch(() => {});
              setAiTemplateId(tempId);
              setShowAIAnalyzer(true);
            }}
            className={styles.aiGenerateBtn}
            title="Generate a template from a client document using AI"
          >
            🤖 Generate from AI
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading templates...</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📦</div>
          <h3 className={styles.emptyTitle}>
            {hasFilters
              ? "No templates match your filters"
              : "No templates yet"}
          </h3>
          <p className={styles.emptyText}>
            {hasFilters
              ? "Try adjusting your search or filters."
              : "Create your first Scope of Supply template to speed up BID creation for repetitive operations."}
          </p>
          {!hasFilters && (
            <button onClick={handleCreate} className={styles.createBtn}>
              + Create First Template
            </button>
          )}
        </div>
      )}

      {/* Grid view */}
      {!isLoading && filtered.length > 0 && viewMode === "grid" && (
        <div className={styles.cardGrid}>
          {filtered.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onSelect={() => setPreviewTemplate(tpl)}
              onView={() => handleEdit(tpl)}
              onDelete={() => handleDelete(tpl)}
              onDuplicate={() => handleDuplicate(tpl)}
            />
          ))}
        </div>
      )}

      {/* List view */}
      {!isLoading && filtered.length > 0 && viewMode === "list" && (
        <div className={styles.listView}>
          <table className={styles.listTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Division</th>
                <th>Service Line</th>
                <th>Category</th>
                <th>Items</th>
                <th>Used</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tpl) => {
                const itemCount = (tpl.scopeItems || []).filter(
                  (i) => !i.isSection,
                ).length;
                return (
                  <tr key={tpl.id}>
                    <td>
                      <button
                        className={styles.linkBtn}
                        onClick={() => setPreviewTemplate(tpl)}
                      >
                        {tpl.name}
                      </button>
                    </td>
                    <td>{tpl.division || "—"}</td>
                    <td>{tpl.serviceLine || "—"}</td>
                    <td>{tpl.category || "—"}</td>
                    <td>{itemCount}</td>
                    <td>{tpl.usageCount}x</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${tpl.isActive ? styles.statusActive : styles.statusInactive}`}
                      >
                        {tpl.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          className={styles.rowActionBtn}
                          onClick={() => handleEdit(tpl)}
                          title="View"
                        >
                          👁️
                        </button>
                        <button
                          className={styles.rowActionBtn}
                          onClick={() => handleDuplicate(tpl)}
                          title="Duplicate"
                        >
                          📋
                        </button>
                        <button
                          className={`${styles.rowActionBtn} ${styles.rowDeleteBtn}`}
                          onClick={() => handleDelete(tpl)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview modal */}
      {previewTemplate && (
        <div
          className={styles.overlay}
          onClick={() => setPreviewTemplate(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <TemplatePreview
              template={previewTemplate}
              onClose={() => setPreviewTemplate(null)}
            />
            <div className={styles.modalActions}>
              <button
                className={styles.modalEditBtn}
                onClick={() => {
                  handleEdit(previewTemplate);
                  setPreviewTemplate(null);
                }}
              >
                👁️ View Template
              </button>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setPreviewTemplate(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* AI Analyzer modal */}
      {showAIAnalyzer && (
        <div className={styles.overlay}>
          <div
            className={`${styles.modal} ${styles.aiModal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.aiModalHeader}>
              <h3>🤖 Generate Template from Document</h3>
              <p>
                Upload a client document (PDF or Word) and AI will extract scope
                items to create a new template.
              </p>
            </div>
            <AIDocumentAnalyzer
              templateId={aiTemplateId}
              onImport={handleAIImport}
              importLabel="Create Template with These Items"
              compact
            />
            <div className={styles.modalActions}>
              <button
                className={styles.modalCloseBtn}
                onClick={() => {
                  if (aiTemplateId) {
                    TemplateService.deleteTemplate(aiTemplateId).catch(
                      () => {},
                    );
                  }
                  setShowAIAnalyzer(false);
                  setAiTemplateId("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
