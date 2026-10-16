import * as React from "react";
import {
  ArrowDownAZ,
  ArrowDownZA,
  LayoutGrid,
  LayoutList,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import {
  MultiSelectDropdown,
  MultiSelectOption,
} from "../components/insights/MultiSelectDropdown";
import { SegmentedControl } from "../components/insights/SegmentedControl";
import { TemplateCard } from "../components/template/TemplateCard";
import { TemplateEditor } from "../components/template/TemplateEditor";
import { TemplatePreview } from "../components/template/TemplatePreview";
import { AIAnalyzerModal } from "../components/common/AIAnalyzerModal";
import { useTemplates } from "../hooks/useTemplates";
import { usePageAccess } from "../hooks/usePageAccess";
import { useConfigStore } from "../stores/useConfigStore";
import { useUIStore } from "../stores/useUIStore";
import { IBidTemplate } from "../models/IBidTemplate";
import { IScopeItem } from "../models";
import { DIVISIONS, SERVICE_LINES } from "../utils/constants";
import { makeId } from "../utils/idGenerator";
import styles from "./TemplatesPage.module.scss";

type ViewMode = "grid" | "list";
type SortOrder = "az" | "za";
type FacetKey = "division" | "serviceLine" | "status";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const statusKey = (t: IBidTemplate): string =>
  t.isActive ? "active" : "inactive";

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
  const { canEdit } = usePageAccess();

  const [search, setSearch] = React.useState("");
  const [filterDivisions, setFilterDivisions] = React.useState<string[]>([]);
  const [filterServiceLines, setFilterServiceLines] = React.useState<string[]>(
    [],
  );
  const [filterStatuses, setFilterStatuses] = React.useState<string[]>([]);
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("az");
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

  const matchesSearch = (t: IBidTemplate): boolean => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().indexOf(q) >= 0 ||
      t.description.toLowerCase().indexOf(q) >= 0 ||
      t.category.toLowerCase().indexOf(q) >= 0 ||
      t.tags.some((tag) => tag.toLowerCase().indexOf(q) >= 0)
    );
  };

  /** Search + every filter except `skip`, so each dropdown counts against the others */
  const passesFilters = (t: IBidTemplate, skip?: FacetKey): boolean =>
    (skip === "division" ||
      !filterDivisions.length ||
      filterDivisions.indexOf(t.division) >= 0) &&
    (skip === "serviceLine" ||
      !filterServiceLines.length ||
      filterServiceLines.indexOf(t.serviceLine) >= 0) &&
    (skip === "status" ||
      !filterStatuses.length ||
      filterStatuses.indexOf(statusKey(t)) >= 0) &&
    matchesSearch(t);

  const facetCounts = React.useMemo(() => {
    const counts: Record<FacetKey, Record<string, number>> = {
      division: {},
      serviceLine: {},
      status: {},
    };
    const bump = (key: FacetKey, value: string): void => {
      counts[key][value] = (counts[key][value] || 0) + 1;
    };
    templates.forEach((t) => {
      if (passesFilters(t, "division")) bump("division", t.division);
      if (passesFilters(t, "serviceLine")) bump("serviceLine", t.serviceLine);
      if (passesFilters(t, "status")) bump("status", statusKey(t));
    });
    return counts;
  }, [templates, search, filterDivisions, filterServiceLines, filterStatuses]);

  const toFacetOptions = (
    values: { value: string; label: string }[],
    key: FacetKey,
  ): MultiSelectOption[] =>
    values.map((v) => ({ ...v, count: facetCounts[key][v.value] || 0 }));

  const filtered = React.useMemo(() => {
    const dir = sortOrder === "za" ? -1 : 1;
    return templates
      .filter((t) => passesFilters(t))
      .sort(
        (a, b) =>
          dir *
          a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: "base",
          }),
      );
  }, [
    templates,
    search,
    filterDivisions,
    filterServiceLines,
    filterStatuses,
    sortOrder,
  ]);

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
    setFilterDivisions([]);
    setFilterServiceLines([]);
    setFilterStatuses([]);
  };

  const hasFilters =
    search !== "" ||
    filterDivisions.length > 0 ||
    filterServiceLines.length > 0 ||
    filterStatuses.length > 0;

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
        subtitle={`${templates.length} templates - ${activeCount} active - ${totalScopeItems} total scope items`}
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
        actions={
          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={() => loadTemplates()}
              className={styles.headerBtn}
              title="Reload templates from SharePoint"
            >
              <RefreshCw size={15} /> Refresh
            </button>
            {canEdit && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    // Traceability id for the request; no SharePoint row needed anymore
                    setAiTemplateId(makeId("tpl"));
                    setShowAIAnalyzer(true);
                  }}
                  className={styles.aiBtn}
                  title="Generate a template from a client document using AI"
                >
                  <Sparkles size={15} /> Generate from AI
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  className={styles.createBtn}
                >
                  + New Template
                </button>
              </>
            )}
          </div>
        }
      />

      <div className={styles.filterBar}>
        <div className={styles.filterSearch}>
          <Search size={15} className={styles.filterSearchIcon} />
          <input
            type="text"
            className={styles.filterSearchInput}
            placeholder="Search by name, description, category, tag..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            aria-label="Search templates"
          />
          {search && (
            <button
              type="button"
              className={styles.searchClearBtn}
              onClick={() => setSearch("")}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <MultiSelectDropdown
          label="Division"
          options={toFacetOptions(
            divisionOptions.map((d) => ({ value: d, label: d })),
            "division",
          )}
          selected={filterDivisions}
          onChange={setFilterDivisions}
        />
        <MultiSelectDropdown
          label="Service Line"
          options={toFacetOptions(
            serviceLineOptions.map((sl) => ({ value: sl, label: sl })),
            "serviceLine",
          )}
          selected={filterServiceLines}
          onChange={setFilterServiceLines}
        />
        <MultiSelectDropdown
          label="Status"
          options={toFacetOptions(STATUS_OPTIONS, "status")}
          selected={filterStatuses}
          onChange={setFilterStatuses}
        />
        {hasFilters && (
          <button
            type="button"
            className={styles.clearFiltersBtn}
            onClick={clearFilters}
          >
            <X size={14} /> Clear
          </button>
        )}
        <span className={styles.resultCount}>
          <strong>{filtered.length}</strong>{" "}
          {hasFilters ? `of ${templates.length} ` : ""}
          {templates.length === 1 ? "template" : "templates"}
        </span>
        <SegmentedControl<SortOrder>
          value={sortOrder}
          segments={[
            {
              value: "az",
              label: "A-Z",
              icon: <ArrowDownAZ size={14} />,
              title: "Sort by name, A to Z",
            },
            {
              value: "za",
              label: "Z-A",
              icon: <ArrowDownZA size={14} />,
              title: "Sort by name, Z to A",
            },
          ]}
          onChange={setSortOrder}
          ariaLabel="Sort order"
        />
        <SegmentedControl<ViewMode>
          value={viewMode}
          segments={[
            { value: "grid", label: "Cards", icon: <LayoutGrid size={14} /> },
            { value: "list", label: "List", icon: <LayoutList size={14} /> },
          ]}
          onChange={setViewMode}
          ariaLabel="View"
        />
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
          {!hasFilters && canEdit && (
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
              onDelete={canEdit ? () => handleDelete(tpl) : undefined}
              onDuplicate={canEdit ? () => handleDuplicate(tpl) : undefined}
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
                    <td>{tpl.division || "-"}</td>
                    <td>{tpl.serviceLine || "-"}</td>
                    <td>{tpl.category || "-"}</td>
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
                        {canEdit && (
                          <>
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
                          </>
                        )}
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
        <AIAnalyzerModal
          title="Generate Template from Document"
          subtitle="Upload a client document (PDF or Word) and the AI will extract scope items to create a new template."
          onClose={() => {
            setShowAIAnalyzer(false);
            setAiTemplateId("");
          }}
          templateId={aiTemplateId}
          onImport={handleAIImport}
          importLabel="Create Template with These Items"
        />
      )}
    </div>
  );
};
