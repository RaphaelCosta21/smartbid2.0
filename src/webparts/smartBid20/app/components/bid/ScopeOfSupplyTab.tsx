import * as React from "react";
import {
  IScopeItem,
  IScopeSubItem,
  IClarificationItem,
  IFavoriteEquipment,
  IBidAttachment,
} from "../../models";
import { useConfigStore } from "../../stores/useConfigStore";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { makeId } from "../../utils/idGenerator";
import { AIDocumentAnalyzer } from "../common/AIDocumentAnalyzer";
import { PartNumberAutocomplete } from "../common/PartNumberAutocomplete";
import { EquipmentImportModal } from "./EquipmentImportModal";
import { AttachmentService } from "../../services/AttachmentService";
import styles from "./ScopeOfSupplyTab.module.scss";

interface ScopeOfSupplyTabProps {
  scopeItems: IScopeItem[];
  onSave: (items: IScopeItem[]) => void;
  readOnly?: boolean;
  clarifications?: IClarificationItem[];
  /** BID number for AI analysis (enables the AI Generate button) */
  bidNumber?: string;
  /** Template ID — used for attachment uploads when inside a template */
  templateId?: string;
}

const blankItem = (
  sectionId: string | null,
  lineNumber: number,
): IScopeItem => ({
  id: makeId("scope"),
  lineNumber,
  isSection: false,
  sectionId,
  sectionTitle: "",
  clientDocRef: "",
  description: "",
  compliance: null,
  resourceType: "",
  resourceSubType: "",
  equipmentOffer: "",
  partNumber: "",
  qtyOperational: 0,
  qtySpare: 0,
  needsCertification: false,
  comments: "",
  importedFromTemplate: null,
  clientRequirement: "",
  clientSpecs: [],
  subItems: [],
});

const blankSection = (lineNumber: number): IScopeItem => ({
  id: makeId("scope"),
  lineNumber,
  isSection: true,
  sectionId: null,
  sectionTitle: "New Section",
  clientDocRef: "",
  description: "",
  compliance: null,
  resourceType: "",
  resourceSubType: "",
  equipmentOffer: "",
  partNumber: "",
  qtyOperational: 0,
  qtySpare: 0,
  needsCertification: false,
  comments: "",
  importedFromTemplate: null,
  clientRequirement: "",
  clientSpecs: [],
  subItems: [],
});

const blankSubItem = (): IScopeSubItem => ({
  id: makeId("sub"),
  description: "",
  subType: "Consumable",
  equipmentOffer: "",
  partNumber: "",
  qty: 1,
  comments: "",
});

export const ScopeOfSupplyTab: React.FC<ScopeOfSupplyTabProps> = ({
  scopeItems,
  onSave,
  readOnly = false,
  clarifications = [],
  bidNumber,
  templateId,
}) => {
  // Helper: append fieldEmpty class when value is empty/falsy
  const emptyIf = (base: string, value: unknown): string =>
    value ? base : `${base} ${styles.fieldEmpty}`;

  const config = useConfigStore((s) => s.config);
  const resourceTypes = config?.resourceTypes || [];

  const addFavEquipment = useFavoritesStore((s) => s.addEquipment);
  const favIsLoaded = useFavoritesStore((s) => s.isLoaded);
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
  const currentUser = useCurrentUser();

  React.useEffect(() => {
    if (!favIsLoaded) loadFavorites();
  }, []);

  const handleAddToFavorites = (item: IScopeItem): void => {
    if (!item.partNumber && !item.equipmentOffer) return;
    const fav: IFavoriteEquipment = {
      id: makeId("fav"),
      groupId: "",
      subGroupId: "",
      partNumber: item.partNumber || "",
      description: item.equipmentOffer || "",
      pictureUrl: "",
      notes: "",
      dataSource: "bid",
      createdBy: currentUser?.displayName || "",
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    addFavEquipment(fav);
  };

  const [items, setItems] = React.useState<IScopeItem[]>(scopeItems || []);
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(
    new Set(),
  );
  const [editingCell, setEditingCell] = React.useState<{
    id: string;
    field: string;
  } | null>(null);
  const [expandedCells, setExpandedCells] = React.useState<Set<string>>(
    new Set(),
  );
  const [clarPopup, setClarPopup] = React.useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const [expandedSpecs, setExpandedSpecs] = React.useState<Set<string>>(
    new Set(),
  );
  const [specsBulkText, setSpecsBulkText] = React.useState<string>("");

  // ─── Drawer state (combined sub-items + specs per item) ───
  const [openDrawers, setOpenDrawers] = React.useState<Set<string>>(new Set());
  const [drawerActiveTab, setDrawerActiveTab] = React.useState<
    Record<string, "subs" | "specs" | "attachments">
  >({});

  // ─── Drag-and-drop state ───
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);
  const [dragHandleActive, setDragHandleActive] = React.useState<string | null>(null);

  // ─── Sub-item drag state ───
  const [subDraggedId, setSubDraggedId] = React.useState<string | null>(null);
  const [subDragOverId, setSubDragOverId] = React.useState<string | null>(null);
  const [subDragHandleActive, setSubDragHandleActive] = React.useState<string | null>(null);

  // ─── AI Analyzer modal state ───
  const [showAIModal, setShowAIModal] = React.useState(false);

  // ─── Equipment Import modal state ───
  const [importTargetId, setImportTargetId] = React.useState<string | null>(
    null,
  );
  const [importSubTarget, setImportSubTarget] = React.useState<{
    itemId: string;
    subId: string;
  } | null>(null);

  // Debounced save to prevent input lag
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestItemsRef = React.useRef<IScopeItem[]>(items);
  latestItemsRef.current = items;

  const debouncedSave = React.useCallback(
    (updated: IScopeItem[]) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        onSave(updated);
      }, 400);
    },
    [onSave],
  );

  // Sync external changes only when NOT actively editing
  const isEditingRef = React.useRef(false);
  isEditingRef.current = editingCell !== null;

  React.useEffect(() => {
    if (!isEditingRef.current && saveTimerRef.current === null) {
      setItems(scopeItems || []);
    }
  }, [scopeItems]);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const persist = React.useCallback(
    (updated: IScopeItem[]) => {
      // Re-number lines
      let lineNum = 1;
      const renumbered = updated.map((item) => ({
        ...item,
        lineNumber: item.isSection ? 0 : lineNum++,
      }));
      setItems(renumbered);
      debouncedSave(renumbered);
    },
    [debouncedSave],
  );

  // ─── Computed ───
  const sections = items.filter((i) => i.isSection);
  const dataItems = items.filter((i) => !i.isSection);
  const itemsBySectionCount = React.useMemo(() => {
    const counts: Record<string, number> = { unsectioned: 0 };
    sections.forEach((s) => {
      counts[s.id] = 0;
    });
    dataItems.forEach((i) => {
      if (i.sectionId && counts[i.sectionId] !== undefined)
        counts[i.sectionId]++;
      else counts.unsectioned++;
    });
    return counts;
  }, [items, sections, dataItems]);

  const resourceTypeCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    dataItems.forEach((i) => {
      if (i.resourceType)
        counts[i.resourceType] = (counts[i.resourceType] || 0) + 1;
    });
    return counts;
  }, [dataItems]);

  // Resource type sub-tab filter (e.g. "All" / "ROV Asset" / "Tooling")
  const [resourceTypeFilter, setResourceTypeFilter] =
    React.useState<string>("all");
  const distinctResourceTypes = React.useMemo(() => {
    const types: string[] = [];
    dataItems.forEach((i) => {
      if (i.resourceType && types.indexOf(i.resourceType) === -1) {
        types.push(i.resourceType);
      }
    });
    return types;
  }, [dataItems]);
  const showResourceTypeFilter = distinctResourceTypes.length > 1;

  // ─── Handlers ───
  const addSection = (): void => {
    persist([...items, blankSection(items.length + 1)]);
    // Switch to "All" view so the new empty section is visible
    if (resourceTypeFilter !== "all") setResourceTypeFilter("all");
  };

  const addItem = (sectionId: string | null): void => {
    const newItem = blankItem(sectionId, items.length + 1);
    // Pre-fill resource type when adding from a filtered view
    if (resourceTypeFilter !== "all") {
      newItem.resourceType = resourceTypeFilter;
    }
    persist([...items, newItem]);
  };

  const deleteItem = (id: string): void => {
    const target = items.find((i) => i.id === id);
    if (target && target.isSection) {
      // Cascade: remove the section AND all items that belong to it
      persist(items.filter((i) => i.id !== id && i.sectionId !== id));
    } else {
      persist(items.filter((i) => i.id !== id));
    }
  };

  const updateField = (
    id: string,
    field: keyof IScopeItem,
    value: unknown,
  ): void => {
    const updated = items.map((i) => {
      if (i.id !== id) return i;
      const patched = { ...i, [field]: value };
      // Clear sub-type when resource type changes
      if (field === "resourceType") patched.resourceSubType = "";
      return patched;
    });
    persist(updated);
  };

  // Move an item to a different section (or to unsectioned with null)
  const moveItemToSection = (
    itemId: string,
    targetSectionId: string | null,
  ): void => {
    const updated = items.map((i) =>
      i.id === itemId ? { ...i, sectionId: targetSectionId } : i,
    );
    // Reorder: move item after the target section header (or to front if unsectioned)
    const movedItem = updated.find((i) => i.id === itemId);
    if (!movedItem) return;
    const without = updated.filter((i) => i.id !== itemId);
    if (targetSectionId) {
      const sectionIdx = without.findIndex((i) => i.id === targetSectionId);
      if (sectionIdx >= 0) {
        // Find last child of this section
        let insertIdx = sectionIdx + 1;
        while (
          insertIdx < without.length &&
          !without[insertIdx].isSection &&
          without[insertIdx].sectionId === targetSectionId
        ) {
          insertIdx++;
        }
        without.splice(insertIdx, 0, movedItem);
      } else {
        without.push(movedItem);
      }
    } else {
      // Move to front (unsectioned items go first)
      const firstSectionIdx = without.findIndex((i) => i.isSection);
      if (firstSectionIdx >= 0) {
        without.splice(firstSectionIdx, 0, movedItem);
      } else {
        without.push(movedItem);
      }
    }
    persist(without);
  };

  // Section color presets
  const SECTION_COLORS = [
    "", // default (accent-color)
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#ec4899", // pink
    "#6366f1", // indigo
    "#84cc16", // lime
  ];

  const toggleSection = (sectionId: string): void => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const allSectionsCollapsed =
    sections.length > 0 && sections.every((s) => collapsedSections.has(s.id));

  const toggleAllSections = (): void => {
    if (allSectionsCollapsed) {
      setCollapsedSections(new Set());
    } else {
      setCollapsedSections(new Set(sections.map((s) => s.id)));
    }
  };

  // ─── Get ordered items (sections with children grouped) ───
  const orderedItems = React.useMemo(() => {
    const result: IScopeItem[] = [];
    const unsectioned = dataItems.filter((i) => !i.sectionId);

    // Unsectioned items first
    unsectioned.forEach((i) => result.push(i));

    // Then each section + its children (always include children for ordering)
    sections.forEach((sec) => {
      result.push(sec);
      dataItems
        .filter((i) => i.sectionId === sec.id)
        .forEach((i) => result.push(i));
    });

    return result;
  }, [items, sections, dataItems]);

  // Visible ordered items (respects collapsed + resource type filter)
  const visibleOrderedItems = React.useMemo(() => {
    // Build set of section IDs that have at least one matching data item
    const sectionIdsWithMatch = new Set<string>();
    if (resourceTypeFilter !== "all") {
      dataItems.forEach((i) => {
        if (i.sectionId && i.resourceType === resourceTypeFilter) {
          sectionIdsWithMatch.add(i.sectionId);
        }
      });
    }

    return orderedItems.filter((item) => {
      // Respect collapsed sections
      if (
        !item.isSection &&
        item.sectionId &&
        collapsedSections.has(item.sectionId)
      )
        return false;
      // Resource type filter
      if (resourceTypeFilter !== "all") {
        if (item.isSection) {
          // Show section only if it has matching children
          return sectionIdsWithMatch.has(item.id);
        }
        if (!item.resourceType || item.resourceType !== resourceTypeFilter) {
          return false;
        }
      }
      return true;
    });
  }, [orderedItems, collapsedSections, resourceTypeFilter, dataItems]);

  // ─── Toggle expanded cells ───
  const toggleCellExpand = (cellKey: string): void => {
    setExpandedCells((prev) => {
      const next = new Set(prev);
      if (next.has(cellKey)) next.delete(cellKey);
      else next.add(cellKey);
      return next;
    });
  };

  // ─── Toggle specs panel ───
  const toggleSpecsExpand = (itemId: string): void => {
    setExpandedSpecs((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
        setSpecsBulkText("");
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const hasSpecs = (item: IScopeItem): boolean => {
    return !!(
      (item.clientRequirement && item.clientRequirement.trim()) ||
      (item.clientSpecs && item.clientSpecs.length > 0)
    );
  };

  const updateSpecs = (
    id: string,
    clientRequirement: string,
    clientSpecs: string[],
  ): void => {
    const updated = items.map((i) =>
      i.id === id ? { ...i, clientRequirement, clientSpecs } : i,
    );
    persist(updated);
  };

  const handleBulkImportSpecs = (id: string): void => {
    if (!specsBulkText.trim()) return;
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newLines = specsBulkText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    const merged = [...(item.clientSpecs || []), ...newLines];
    updateSpecs(id, item.clientRequirement || "", merged);
    setSpecsBulkText("");
  };

  // ─── Drawer toggle (combined sub-items + specs) ───
  const toggleDrawer = (itemId: string): void => {
    setOpenDrawers((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const setDrawerTab = (itemId: string, tab: "subs" | "specs" | "attachments"): void => {
    setDrawerActiveTab((prev) => ({ ...prev, [itemId]: tab }));
  };

  // ─── Drag-and-drop handlers ───
  const handleDragStart = (e: React.DragEvent, id: string): void => {
    if (dragHandleActive !== id) {
      e.preventDefault();
      return;
    }
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.4";
    }
  };

  const handleDragOver = (e: React.DragEvent, id: string): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== draggedId) {
      setDragOverId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string): void => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      setDragHandleActive(null);
      return;
    }
    const ordered = [...orderedItems];
    const fromIdx = ordered.findIndex((i) => i.id === draggedId);
    const toIdx = ordered.findIndex((i) => i.id === targetId);
    if (fromIdx < 0 || toIdx < 0) {
      setDraggedId(null);
      setDragOverId(null);
      setDragHandleActive(null);
      return;
    }
    const draggedItem = ordered[fromIdx];
    const targetItem = ordered[toIdx];

    // If dragging an item onto a section header, move it into that section
    if (targetItem.isSection && !draggedItem.isSection) {
      ordered.splice(fromIdx, 1);
      const updatedItem = { ...draggedItem, sectionId: targetItem.id };
      // Insert right after the section header
      const sectionIdx = ordered.findIndex((i) => i.id === targetItem.id);
      ordered.splice(sectionIdx + 1, 0, updatedItem);
      persist(ordered);
      setDraggedId(null);
      setDragOverId(null);
      setDragHandleActive(null);
      return;
    }

    // If dragging a non-section item to another non-section item in a different section,
    // update sectionId to match the target's section
    if (!draggedItem.isSection && !targetItem.isSection && draggedItem.sectionId !== targetItem.sectionId) {
      ordered.splice(fromIdx, 1);
      const updatedItem = { ...draggedItem, sectionId: targetItem.sectionId };
      const newToIdx = ordered.findIndex((i) => i.id === targetId);
      ordered.splice(newToIdx, 0, updatedItem);
      persist(ordered);
      setDraggedId(null);
      setDragOverId(null);
      setDragHandleActive(null);
      return;
    }

    // Same-section reorder or section reorder
    ordered.splice(fromIdx, 1);
    const newToIdx = ordered.findIndex((i) => i.id === targetId);
    ordered.splice(newToIdx, 0, draggedItem);
    persist(ordered);
    setDraggedId(null);
    setDragOverId(null);
    setDragHandleActive(null);
  };

  const handleDragEnd = (e: React.DragEvent): void => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setDraggedId(null);
    setDragOverId(null);
    setDragHandleActive(null);
  };

  const hasSubItems = (item: IScopeItem): boolean => {
    return !!(item.subItems && item.subItems.length > 0);
  };

  const addSubItem = (itemId: string): void => {
    const updated = items.map((i) =>
      i.id === itemId
        ? { ...i, subItems: [...(i.subItems || []), blankSubItem()] }
        : i,
    );
    persist(updated);
  };

  const updateSubItem = (
    itemId: string,
    subId: string,
    field: keyof IScopeSubItem,
    value: unknown,
  ): void => {
    const updated = items.map((i) => {
      if (i.id !== itemId) return i;
      const subs = (i.subItems || []).map((s) =>
        s.id === subId ? { ...s, [field]: value } : s,
      );
      return { ...i, subItems: subs };
    });
    persist(updated);
  };

  /** Batch-update multiple fields on a sub-item in a single persist */
  const updateSubItemBatch = (
    itemId: string,
    subId: string,
    fields: Partial<IScopeSubItem>,
  ): void => {
    const updated = items.map((i) => {
      if (i.id !== itemId) return i;
      const subs = (i.subItems || []).map((s) =>
        s.id === subId ? { ...s, ...fields } : s,
      );
      return { ...i, subItems: subs };
    });
    persist(updated);
  };

  const deleteSubItem = (itemId: string, subId: string): void => {
    const updated = items.map((i) => {
      if (i.id !== itemId) return i;
      return {
        ...i,
        subItems: (i.subItems || []).filter((s) => s.id !== subId),
      };
    });
    persist(updated);
  };

  // ─── Sub-item drag-and-drop handlers ───
  const handleSubDragStart = (e: React.DragEvent, subId: string): void => {
    if (subDragHandleActive !== subId) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    setSubDraggedId(subId);
    e.dataTransfer.effectAllowed = "move";
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.4";
    }
  };

  const handleSubDragOver = (e: React.DragEvent, subId: string): void => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (subId !== subDraggedId) {
      setSubDragOverId(subId);
    }
  };

  const handleSubDrop = (e: React.DragEvent, itemId: string, targetSubId: string): void => {
    e.preventDefault();
    e.stopPropagation();
    if (!subDraggedId || subDraggedId === targetSubId) {
      setSubDraggedId(null);
      setSubDragOverId(null);
      setSubDragHandleActive(null);
      return;
    }
    const updated = items.map((i) => {
      if (i.id !== itemId) return i;
      const subs = [...(i.subItems || [])];
      const fromIdx = subs.findIndex((s) => s.id === subDraggedId);
      const toIdx = subs.findIndex((s) => s.id === targetSubId);
      if (fromIdx < 0 || toIdx < 0) return i;
      const [moved] = subs.splice(fromIdx, 1);
      subs.splice(toIdx, 0, moved);
      return { ...i, subItems: subs };
    });
    persist(updated);
    setSubDraggedId(null);
    setSubDragOverId(null);
    setSubDragHandleActive(null);
  };

  const handleSubDragEnd = (e: React.DragEvent): void => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setSubDraggedId(null);
    setSubDragOverId(null);
    setSubDragHandleActive(null);
  };

  // ─── Copy/duplicate item (with sub-items and specs) ───
  const duplicateItem = (id: string): void => {
    const source = items.find((i) => i.id === id);
    if (!source) return;
    const newItem: IScopeItem = {
      ...source,
      id: makeId("scope"),
      lineNumber: 0,
      subItems: (source.subItems || []).map((s) => ({
        ...s,
        id: makeId("sub"),
      })),
      clientSpecs: [...(source.clientSpecs || [])],
    };
    // Insert right after the source item
    const idx = items.findIndex((i) => i.id === id);
    const updated = [...items];
    updated.splice(idx + 1, 0, newItem);
    persist(updated);
  };

  // ─── Attachment handlers ───
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [attachTargetId, setAttachTargetId] = React.useState<string | null>(null);

  const handleAttachClick = (itemId: string): void => {
    setAttachTargetId(itemId);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = e.target.files;
    if (!files || files.length === 0 || !attachTargetId) return;

    const file = files[0];
    const folderId = bidNumber || (templateId ? `Templates/${templateId}` : "unsaved");
    const category = `scope-attachments/${attachTargetId}`;

    try {
      const uploaded = await AttachmentService.uploadFile(folderId, category, file);
      const updated = items.map((i) => {
        if (i.id !== attachTargetId) return i;
        return { ...i, attachments: [...(i.attachments || []), uploaded] };
      });
      persist(updated);
    } catch (err) {
      console.error("Failed to upload attachment:", err);
      // Fallback: store as local reference if SP upload fails
      const localAttachment: IBidAttachment = {
        id: makeId("att"),
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size,
        fileType: file.type,
        uploadedBy: currentUser?.displayName || "",
        uploadedDate: new Date().toISOString(),
        category: templateId ? "template-scope" : "scope",
      };
      const updated = items.map((i) => {
        if (i.id !== attachTargetId) return i;
        return { ...i, attachments: [...(i.attachments || []), localAttachment] };
      });
      persist(updated);
    }
    setAttachTargetId(null);
  };

  const removeAttachment = (itemId: string, attachmentId: string): void => {
    if (!window.confirm("Are you sure you want to remove this attachment?")) return;
    const updated = items.map((i) => {
      if (i.id !== itemId) return i;
      return {
        ...i,
        attachments: (i.attachments || []).filter((a) => a.id !== attachmentId),
      };
    });
    persist(updated);
  };

  // Get sub-types for a given resource type
  const getSubTypes = (resType: string): { label: string; value: string }[] => {
    const rt = resourceTypes.find((r) => r.label === resType);
    if (!rt) return [];
    return (rt.subTypes || [])
      .filter((s) => s.isActive !== false)
      .map((s) => ({ label: s.label, value: s.value }));
  };

  // ─── Column headers ───
  const columns = [
    "",
    "",
    "#",
    "Client Doc Ref",
    "Item Description",
    "Compliance",
    "Resource Type",
    "Sub-Type",
    "Equipment Offer",
    "OII/MFG PN",
    "Qty Op",
    "Qty Spare",
    "Cert?",
    "Comments",
  ];

  return (
    <div className={styles.container}>
      {/* Hidden file input for attachments */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileSelected}
      />
      {/* Summary Cards */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total Items</span>
          <span className={styles.summaryValue}>{dataItems.length}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Sections</span>
          <span className={styles.summaryValue}>{sections.length}</span>
        </div>
        {Object.entries(resourceTypeCounts).map(([type, count]) => (
          <div key={type} className={styles.summaryCard}>
            <span className={styles.summaryLabel}>{type}</span>
            <span className={styles.summaryValue}>{count}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      {!readOnly && (
        <div className={styles.toolbar}>
          <button
            className={`${styles.toolbarBtn} ${styles.primary}`}
            onClick={() => addItem(null)}
          >
            + Add Item
          </button>
          <button className={styles.toolbarBtn} onClick={addSection}>
            + Add Section
          </button>
          {sections.length > 0 && (
            <button className={styles.toolbarBtn} onClick={toggleAllSections}>
              {allSectionsCollapsed ? "▶ Expand All" : "▼ Collapse All"}
            </button>
          )}
          {bidNumber && (
            <button
              className={`${styles.toolbarBtn} ${styles.aiBtn}`}
              onClick={() => setShowAIModal(true)}
              title="Generate scope items from a client document using AI"
            >
              🤖 Generate from AI
            </button>
          )}
        </div>
      )}
      {readOnly && sections.length > 0 && (
        <div className={styles.toolbar}>
          <button className={styles.toolbarBtn} onClick={toggleAllSections}>
            {allSectionsCollapsed ? "▶ Expand All" : "▼ Collapse All"}
          </button>
        </div>
      )}

      {/* Resource Type Sub-Tabs */}
      {showResourceTypeFilter && (
        <div className={styles.subTabBar}>
          <button
            className={`${styles.subTab} ${resourceTypeFilter === "all" ? styles.subTabActive : ""}`}
            onClick={() => setResourceTypeFilter("all")}
          >
            All ({dataItems.length})
          </button>
          {distinctResourceTypes.map((rt) => (
            <button
              key={rt}
              className={`${styles.subTab} ${resourceTypeFilter === rt ? styles.subTabActive : ""}`}
              onClick={() => setResourceTypeFilter(rt)}
            >
              {rt} ({resourceTypeCounts[rt] || 0})
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      {orderedItems.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📋</div>
          <div>No scope items yet</div>
          {!readOnly && (
            <p>
              Click &quot;+ Add Item&quot; or &quot;+ Add Section&quot; to start
              building the scope of supply.
            </p>
          )}
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((h) => (
                  <th key={h}>{h}</th>
                ))}
                {!readOnly && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {visibleOrderedItems.map((item) => {
                if (item.isSection) {
                  const isCollapsed = collapsedSections.has(item.id);
                  const sColor = item.sectionColor || "";
                  const sectionStyle: React.CSSProperties = sColor
                    ? {
                        background: `${sColor}15`,
                        borderBottomColor: sColor,
                      }
                    : {};
                  const titleStyle: React.CSSProperties = sColor
                    ? { color: sColor }
                    : {};
                  const isSectionSpecsOpen = expandedSpecs.has(item.id);
                  const sectionHasSpecs = hasSpecs(item);
                  const totalColsSection = columns.length + (!readOnly ? 1 : 0);
                  return (
                    <React.Fragment key={item.id}>
                      <tr className={styles.sectionRow} style={sectionStyle}>
                        <td
                          colSpan={columns.length + (!readOnly ? 1 : 0)}
                          style={
                            sColor
                              ? {
                                  background: `${sColor}15`,
                                  borderBottomColor: sColor,
                                  borderBottomWidth: 2,
                                  borderBottomStyle: "solid",
                                }
                              : undefined
                          }
                        >
                          <div
                            className={styles.sectionHeader}
                            onClick={() => toggleSection(item.id)}
                            style={titleStyle}
                            draggable={!readOnly && dragHandleActive === item.id}
                            onDragStart={(e) => {
                              e.stopPropagation();
                              handleDragStart(e, item.id);
                            }}
                            onDragOver={(e) => handleDragOver(e, item.id)}
                            onDrop={(e) => handleDrop(e, item.id)}
                            onDragEnd={handleDragEnd}
                          >
                            {!readOnly && (
                              <span
                                className={styles.dragHandle}
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={() => setDragHandleActive(item.id)}
                                onMouseUp={() => setDragHandleActive(null)}
                                title="Drag to reorder"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  width="12"
                                  height="12"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <circle cx="9" cy="5" r="1" />
                                  <circle cx="9" cy="12" r="1" />
                                  <circle cx="9" cy="19" r="1" />
                                  <circle cx="15" cy="5" r="1" />
                                  <circle cx="15" cy="12" r="1" />
                                  <circle cx="15" cy="19" r="1" />
                                </svg>
                              </span>
                            )}
                            <span
                              className={`${styles.chevron} ${isCollapsed ? styles.collapsed : ""}`}
                            >
                              ▼
                            </span>
                            {editingCell?.id === item.id &&
                            editingCell?.field === "sectionTitle" &&
                            !readOnly ? (
                              <input
                                className={styles.editInput}
                                value={item.sectionTitle}
                                autoFocus
                                onChange={(e) =>
                                  updateField(
                                    item.id,
                                    "sectionTitle",
                                    e.target.value,
                                  )
                                }
                                onBlur={() => setEditingCell(null)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") setEditingCell(null);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span
                                onDoubleClick={() =>
                                  !readOnly &&
                                  setEditingCell({
                                    id: item.id,
                                    field: "sectionTitle",
                                  })
                                }
                              >
                                {item.sectionTitle || "Untitled Section"}
                              </span>
                            )}
                            {!readOnly && editingCell?.id !== item.id && (
                              <button
                                className={styles.sectionEditBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingCell({
                                    id: item.id,
                                    field: "sectionTitle",
                                  });
                                }}
                                title="Edit section title"
                              >
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                            )}
                            <span
                              style={{
                                fontSize: 11,
                                color: "var(--text-secondary)",
                                fontWeight: 400,
                              }}
                            >
                              ({itemsBySectionCount[item.id] || 0} items
                              {(() => {
                                const sectionItems = dataItems.filter((di) => di.sectionId === item.id);
                                const totalSubs = sectionItems.reduce((acc, di) => acc + (di.subItems || []).length, 0);
                                return totalSubs > 0 ? `, ${totalSubs} sub-items` : "";
                              })()})
                            </span>
                            {!readOnly && (
                              <div
                                className={styles.sectionActions}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className={`${styles.actionBtn} ${styles.edit}`}
                                  onClick={() => addItem(item.id)}
                                >
                                  + Item
                                </button>
                                <div className={styles.colorPicker}>
                                  <button
                                    className={styles.colorPickerBtn}
                                    title="Section color"
                                    style={
                                      sColor
                                        ? { background: sColor }
                                        : undefined
                                    }
                                  >
                                    🎨
                                  </button>
                                  <div className={styles.colorPickerDropdown}>
                                    {SECTION_COLORS.map((c) => (
                                      <button
                                        key={c || "default"}
                                        className={`${styles.colorSwatch} ${(c || "") === (sColor || "") ? styles.colorSwatchActive : ""}`}
                                        style={
                                          c
                                            ? { background: c }
                                            : {
                                                background:
                                                  "var(--accent-color)",
                                              }
                                        }
                                        onClick={() =>
                                          updateField(
                                            item.id,
                                            "sectionColor",
                                            c,
                                          )
                                        }
                                        title={c || "Default"}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <button
                                  className={`${styles.actionBtn} ${styles.specsToggle} ${sectionHasSpecs ? styles.hasSpecs : ""}`}
                                  onClick={() => toggleSpecsExpand(item.id)}
                                  title={
                                    isSectionSpecsOpen
                                      ? "Collapse section specs"
                                      : "Section technical specs"
                                  }
                                >
                                  {isSectionSpecsOpen ? "▼" : "▶"} 📋
                                </button>
                                <button
                                  className={`${styles.actionBtn} ${styles.edit}`}
                                  onClick={() => handleAttachClick(item.id)}
                                  title={`Attach file to section${(item.attachments || []).length > 0 ? ` (${(item.attachments || []).length})` : ""}`}
                                >
                                  📎{(item.attachments || []).length > 0 && (
                                    <span className={styles.attachBadge}>{(item.attachments || []).length}</span>
                                  )}
                                </button>
                                <button
                                  className={`${styles.actionBtn} ${styles.delete}`}
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Delete section "${item.sectionTitle || "Untitled"}"? Items in this section will also be removed.`,
                                      )
                                    )
                                      deleteItem(item.id);
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Section-level specs detail row */}
                      {isSectionSpecsOpen && (
                        <tr className={styles.specsDetailRow}>
                          <td colSpan={totalColsSection}>
                            <div className={styles.specsPanel}>
                              <div className={styles.specsPanelHeader}>
                                <span className={styles.specsPanelIcon}>
                                  📎
                                </span>
                                <div className={styles.specsPanelTitleGroup}>
                                  <span className={styles.specsPanelTitle}>
                                    Client Technical Specifications
                                  </span>
                                  <span className={styles.specsPanelSubtitle}>
                                    Optional — fill in when the client provides
                                    detailed requirements in the ET for this
                                    section
                                  </span>
                                </div>
                                <button
                                  className={styles.specsPanelClose}
                                  onClick={() => toggleSpecsExpand(item.id)}
                                >
                                  ✕
                                </button>
                              </div>

                              {/* Client Requirement (main solicitation) */}
                              <div className={styles.specsSection}>
                                <label className={styles.specsLabel}>
                                  Client Requirement
                                </label>
                                {readOnly ? (
                                  <p className={styles.specsRequirementText}>
                                    {item.clientRequirement || (
                                      <span className={styles.specsEmpty}>
                                        No client requirement defined.
                                      </span>
                                    )}
                                  </p>
                                ) : (
                                  <textarea
                                    className={styles.specsTextarea}
                                    value={item.clientRequirement || ""}
                                    placeholder="Full text of the client's section-level requirement from the ET document."
                                    rows={3}
                                    onChange={(e) =>
                                      updateSpecs(
                                        item.id,
                                        e.target.value,
                                        item.clientSpecs || [],
                                      )
                                    }
                                  />
                                )}
                              </div>

                              {/* Technical Specifications List */}
                              <div className={styles.specsSection}>
                                <label className={styles.specsLabel}>
                                  Technical Specifications
                                  {(item.clientSpecs || []).length > 0 && (
                                    <span className={styles.specsBadge}>
                                      {(item.clientSpecs || []).length}
                                    </span>
                                  )}
                                </label>

                                {(item.clientSpecs || []).length > 0 ? (
                                  <div className={styles.specsList}>
                                    {(item.clientSpecs || []).map(
                                      (spec, idx) => (
                                        <div
                                          key={idx}
                                          className={styles.specsItem}
                                        >
                                          <span
                                            className={styles.specsItemNumber}
                                          >
                                            {idx + 1}
                                          </span>
                                          {readOnly ? (
                                            <span
                                              className={styles.specsItemText}
                                            >
                                              {spec}
                                            </span>
                                          ) : (
                                            <input
                                              className={styles.specsItemInput}
                                              value={spec}
                                              onChange={(e) => {
                                                const updated = [
                                                  ...(item.clientSpecs || []),
                                                ];
                                                updated[idx] = e.target.value;
                                                updateSpecs(
                                                  item.id,
                                                  item.clientRequirement || "",
                                                  updated,
                                                );
                                              }}
                                            />
                                          )}
                                          {!readOnly && (
                                            <button
                                              className={styles.specsItemDelete}
                                              onClick={() => {
                                                const updated = (
                                                  item.clientSpecs || []
                                                ).filter((_, i) => i !== idx);
                                                updateSpecs(
                                                  item.id,
                                                  item.clientRequirement || "",
                                                  updated,
                                                );
                                              }}
                                              title="Remove spec"
                                            >
                                              ✕
                                            </button>
                                          )}
                                        </div>
                                      ),
                                    )}
                                  </div>
                                ) : (
                                  <p className={styles.specsEmpty}>
                                    No technical specifications added yet.
                                  </p>
                                )}

                                {/* Add specs controls (edit mode only) */}
                                {!readOnly && (
                                  <div className={styles.specsAddControls}>
                                    <button
                                      className={styles.specsAddBtn}
                                      onClick={() => {
                                        const updated = [
                                          ...(item.clientSpecs || []),
                                          "",
                                        ];
                                        updateSpecs(
                                          item.id,
                                          item.clientRequirement || "",
                                          updated,
                                        );
                                      }}
                                    >
                                      + Add Specification
                                    </button>
                                    <div className={styles.specsBulkImport}>
                                      <label className={styles.specsBulkLabel}>
                                        Bulk Import (one spec per line):
                                      </label>
                                      <textarea
                                        className={styles.specsTextarea}
                                        value={specsBulkText}
                                        placeholder={
                                          "Paste specifications here, one per line..."
                                        }
                                        rows={4}
                                        onChange={(e) =>
                                          setSpecsBulkText(e.target.value)
                                        }
                                      />
                                      <button
                                        className={styles.specsBulkBtn}
                                        onClick={() =>
                                          handleBulkImportSpecs(item.id)
                                        }
                                        disabled={!specsBulkText.trim()}
                                      >
                                        Import Lines
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {/* Section attachments row */}
                      {(item.attachments || []).length > 0 && !isCollapsed && (
                        <tr className={styles.sectionAttachRow}>
                          <td colSpan={totalColsSection}>
                            <div className={styles.sectionAttachList}>
                              <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>📎 Attachments:</span>
                              {(item.attachments || []).map((att) => (
                                <div key={att.id} className={styles.sectionAttachItem}>
                                  <a
                                    href={att.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.sectionAttachLink}
                                    title={`Open ${att.fileName}`}
                                  >
                                    {att.fileName}
                                  </a>
                                  {!readOnly && (
                                    <button
                                      className={styles.sectionAttachDelete}
                                      onClick={() => removeAttachment(item.id, att.id)}
                                      title="Remove"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                }

                // Data row
                const subTypes = getSubTypes(item.resourceType);
                const commentsKey = `comments-${item.id}`;
                const clientDocKey = `clientDoc-${item.id}`;
                const isCommentsExpanded = expandedCells.has(commentsKey);
                const isClientDocExpanded = expandedCells.has(clientDocKey);
                const itemHasSpecs = hasSpecs(item);
                const itemHasSubItems = hasSubItems(item);
                const isDrawerOpen = openDrawers.has(item.id);
                const activeTab = drawerActiveTab[item.id] || "subs";
                const totalCols = columns.length + (!readOnly ? 1 : 0);
                const isDragged = draggedId === item.id;
                const isDragOver = dragOverId === item.id;
                return (
                  <React.Fragment key={item.id}>
                    <tr
                      className={`${styles.mainItemRow}${isDrawerOpen ? ` ${styles.drawerOpenRow}` : ""}${isDragOver ? ` ${styles.dragOverRow}` : ""}${isDragged ? ` ${styles.draggedRow}` : ""}`}
                      draggable={!readOnly && dragHandleActive === item.id}
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragOver={(e) => handleDragOver(e, item.id)}
                      onDrop={(e) => handleDrop(e, item.id)}
                      onDragEnd={handleDragEnd}
                    >
                      {/* Drag handle */}
                      <td
                        className={styles.cellCenter}
                        style={{ width: 32, padding: "0 2px" }}
                      >
                        {!readOnly && (
                          <div
                            className={styles.dragHandle}
                            title="Drag to reorder"
                            onMouseDown={() => setDragHandleActive(item.id)}
                            onMouseUp={() => setDragHandleActive(null)}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width="12"
                              height="12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="9" cy="5" r="1" />
                              <circle cx="9" cy="12" r="1" />
                              <circle cx="9" cy="19" r="1" />
                              <circle cx="15" cy="5" r="1" />
                              <circle cx="15" cy="12" r="1" />
                              <circle cx="15" cy="19" r="1" />
                            </svg>
                          </div>
                        )}
                      </td>
                      {/* Expand/collapse drawer */}
                      <td
                        className={styles.cellCenter}
                        style={{ width: 28, padding: "0 2px" }}
                      >
                        <div
                          className={`${styles.cellExpand}${isDrawerOpen ? ` ${styles.cellExpandOpen}` : ""}${itemHasSubItems || itemHasSpecs ? ` ${styles.cellExpandHasContent}` : ""}${itemHasSubItems ? ` ${styles.cellExpandHasSubs}` : ""}`}
                          onClick={() => toggleDrawer(item.id)}
                          title={itemHasSubItems ? `${(item.subItems || []).length} sub-item(s) — click to expand` : "Expand / Collapse details"}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="13"
                            height="13"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </td>
                      <td className={styles.cellCenter}>{item.lineNumber}</td>
                      {/* Client Doc Ref - collapsible */}
                      <td>
                        {editingCell?.id === item.id &&
                        editingCell?.field === "clientDocRef" &&
                        !readOnly ? (
                          <input
                            className={styles.editInput}
                            value={item.clientDocRef}
                            autoFocus
                            onChange={(e) =>
                              updateField(
                                item.id,
                                "clientDocRef",
                                e.target.value,
                              )
                            }
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setEditingCell(null);
                            }}
                          />
                        ) : (
                          <div
                            className={`${styles.truncatedCell} ${isClientDocExpanded ? styles.expanded : ""}`}
                            onClick={() =>
                              item.clientDocRef &&
                              item.clientDocRef.length > 20 &&
                              toggleCellExpand(clientDocKey)
                            }
                            onDoubleClick={() =>
                              !readOnly &&
                              setEditingCell({
                                id: item.id,
                                field: "clientDocRef",
                              })
                            }
                            title={item.clientDocRef || undefined}
                          >
                            {item.clientDocRef || "—"}
                          </div>
                        )}
                      </td>
                      <td>
                        <EditableCell
                          value={item.description}
                          readOnly={readOnly}
                          isEditing={
                            editingCell?.id === item.id &&
                            editingCell?.field === "description"
                          }
                          onStartEdit={() =>
                            setEditingCell({
                              id: item.id,
                              field: "description",
                            })
                          }
                          onEndEdit={() => setEditingCell(null)}
                          onChange={(v) =>
                            updateField(item.id, "description", v)
                          }
                        />
                      </td>
                      <td className={styles.cellCenter}>
                        {readOnly ? (
                          <span>
                            {item.compliance === "yes"
                              ? "Yes"
                              : item.compliance === "no"
                                ? "No"
                                : "—"}
                          </span>
                        ) : (
                          <div className={styles.complianceToggle}>
                            <button
                              className={`${styles.complianceBtn} ${styles.yes} ${item.compliance === "yes" ? styles.active : ""}`}
                              onClick={() =>
                                updateField(
                                  item.id,
                                  "compliance",
                                  item.compliance === "yes" ? null : "yes",
                                )
                              }
                            >
                              Yes
                            </button>
                            <button
                              className={`${styles.complianceBtn} ${styles.no} ${item.compliance === "no" ? styles.active : ""}`}
                              onClick={() =>
                                updateField(
                                  item.id,
                                  "compliance",
                                  item.compliance === "no" ? null : "no",
                                )
                              }
                            >
                              No
                            </button>
                            {item.compliance === "no" && (
                              <span
                                className={styles.clarIndicator}
                                title="Clarification/Qualification required — click to view"
                                onClick={(e) => {
                                  const rect = (
                                    e.target as HTMLElement
                                  ).getBoundingClientRect();
                                  setClarPopup({
                                    id: item.id,
                                    x: rect.left,
                                    y: rect.bottom + 4,
                                  });
                                }}
                              >
                                ⚠
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        {readOnly ? (
                          item.resourceType || "—"
                        ) : (
                          <select
                            className={emptyIf(
                              styles.editSelect,
                              item.resourceType,
                            )}
                            value={item.resourceType}
                            onChange={(e) =>
                              updateField(
                                item.id,
                                "resourceType",
                                e.target.value,
                              )
                            }
                          >
                            <option value="" disabled hidden>
                              Select...
                            </option>
                            {resourceTypes
                              .filter((r) => r.isActive)
                              .map((r) => (
                                <option key={r.id} value={r.label}>
                                  {r.label}
                                </option>
                              ))}
                          </select>
                        )}
                      </td>
                      <td>
                        {readOnly ? (
                          item.resourceSubType || "—"
                        ) : (
                          <select
                            className={emptyIf(
                              styles.editSelect,
                              item.resourceSubType,
                            )}
                            value={item.resourceSubType}
                            onChange={(e) =>
                              updateField(
                                item.id,
                                "resourceSubType",
                                e.target.value,
                              )
                            }
                            disabled={!item.resourceType}
                          >
                            <option value="" disabled hidden>
                              Select...
                            </option>
                            {subTypes.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className={styles.equipmentOfferCell}>
                        <PartNumberAutocomplete
                          value={item.equipmentOffer}
                          searchField="description"
                          readOnly={readOnly}
                          placeholder="Equipment offer…"
                          autoFocus={
                            editingCell?.id === item.id &&
                            editingCell?.field === "equipmentOffer"
                          }
                          onChange={(v) =>
                            updateField(item.id, "equipmentOffer", v)
                          }
                          onSelect={(pn, desc) => {
                            updateField(item.id, "equipmentOffer", desc);
                            updateField(item.id, "partNumber", pn);
                            setEditingCell(null);
                          }}
                          onBlur={() => setEditingCell(null)}
                        />
                      </td>
                      <td>
                        <PartNumberAutocomplete
                          value={item.partNumber}
                          searchField="pn"
                          readOnly={readOnly}
                          mono
                          placeholder="PN…"
                          autoFocus={
                            editingCell?.id === item.id &&
                            editingCell?.field === "partNumber"
                          }
                          onChange={(v) =>
                            updateField(item.id, "partNumber", v)
                          }
                          onSelect={(pn, desc) => {
                            updateField(item.id, "partNumber", pn);
                            updateField(item.id, "equipmentOffer", desc);
                            setEditingCell(null);
                          }}
                          onBlur={() => setEditingCell(null)}
                        />
                      </td>
                      <td className={styles.cellCenter}>
                        {readOnly ? (
                          item.qtyOperational
                        ) : (
                          <input
                            className={styles.editInputSmall}
                            type="number"
                            min={0}
                            value={item.qtyOperational}
                            onChange={(e) =>
                              updateField(
                                item.id,
                                "qtyOperational",
                                Number(e.target.value) || 0,
                              )
                            }
                          />
                        )}
                      </td>
                      <td className={styles.cellCenter}>
                        {readOnly ? (
                          item.qtySpare
                        ) : (
                          <input
                            className={styles.editInputSmall}
                            type="number"
                            min={0}
                            value={item.qtySpare}
                            onChange={(e) =>
                              updateField(
                                item.id,
                                "qtySpare",
                                Number(e.target.value) || 0,
                              )
                            }
                          />
                        )}
                      </td>
                      <td className={styles.cellCenter}>
                        <input
                          className={styles.checkbox}
                          type="checkbox"
                          checked={item.needsCertification}
                          disabled={readOnly}
                          onChange={(e) =>
                            updateField(
                              item.id,
                              "needsCertification",
                              e.target.checked,
                            )
                          }
                        />
                      </td>
                      {/* Comments - collapsible */}
                      <td>
                        {editingCell?.id === item.id &&
                        editingCell?.field === "comments" &&
                        !readOnly ? (
                          <input
                            className={styles.editInput}
                            value={item.comments}
                            autoFocus
                            onChange={(e) =>
                              updateField(item.id, "comments", e.target.value)
                            }
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setEditingCell(null);
                            }}
                          />
                        ) : (
                          <div
                            className={`${styles.truncatedCell} ${isCommentsExpanded ? styles.expanded : ""}`}
                            onClick={() =>
                              item.comments &&
                              item.comments.length > 25 &&
                              toggleCellExpand(commentsKey)
                            }
                            onDoubleClick={() =>
                              !readOnly &&
                              setEditingCell({ id: item.id, field: "comments" })
                            }
                            title={item.comments || undefined}
                          >
                            {item.comments || "—"}
                          </div>
                        )}
                      </td>
                      {!readOnly && (
                        <td>
                          <div className={styles.rowActions}>
                            <button
                              className={styles.rowActionBtn}
                              onClick={() => {
                                if (!openDrawers.has(item.id))
                                  toggleDrawer(item.id);
                                setDrawerTab(item.id, "subs");
                                addSubItem(item.id);
                              }}
                              title="Add sub-item"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                width="11"
                                height="11"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <polyline points="9 17 4 12 9 7" />
                                <path d="M20 18v-2a4 4 0 00-4-4H4" />
                              </svg>
                            </button>
                            {sections.length > 0 && (
                              <select
                                className={styles.moveSectionSelect}
                                value={item.sectionId || ""}
                                onChange={(e) =>
                                  moveItemToSection(
                                    item.id,
                                    e.target.value || null,
                                  )
                                }
                                title="Move to section"
                              >
                                <option value="">— No Section —</option>
                                {sections.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.sectionTitle || "Untitled"}
                                  </option>
                                ))}
                              </select>
                            )}
                            <button
                              className={styles.rowActionBtn}
                              onClick={() => setImportTargetId(item.id)}
                              title="Import Equipment"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                width="11"
                                height="11"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                            </button>
                            <button
                              className={styles.rowActionBtn}
                              onClick={() => handleAddToFavorites(item)}
                              title="Add to Favorites"
                            >
                              ⭐
                            </button>
                            <button
                              className={styles.rowActionBtn}
                              onClick={() => duplicateItem(item.id)}
                              title="Duplicate item (with sub-items and specs)"
                            >
                              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                              </svg>
                            </button>
                            <button
                              className={`${styles.rowActionBtn} ${styles.rowActionDanger}`}
                              onClick={() => deleteItem(item.id)}
                              title="Delete"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                width="11"
                                height="11"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                    {/* Combined drawer (sub-items + specs) */}
                    {isDrawerOpen && (
                      <tr className={styles.drawerRow}>
                        <td colSpan={totalCols}>
                          <div className={styles.drawerInner}>
                            {/* Drawer tabs */}
                            <div className={styles.drawerTabs}>
                              <div
                                className={`${styles.drawerTab}${activeTab === "subs" ? ` ${styles.drawerTabActive}` : ""}`}
                                onClick={() => setDrawerTab(item.id, "subs")}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  width="13"
                                  height="13"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <polyline points="9 17 4 12 9 7" />
                                  <path d="M20 18v-2a4 4 0 00-4-4H4" />
                                </svg>
                                Sub-Items
                                <span className={styles.drawerTabCount}>
                                  {(item.subItems || []).length}
                                </span>
                              </div>
                              <div
                                className={`${styles.drawerTab}${activeTab === "specs" ? ` ${styles.drawerTabActive}` : ""}`}
                                onClick={() => setDrawerTab(item.id, "specs")}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  width="13"
                                  height="13"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                  <line x1="16" y1="13" x2="8" y2="13" />
                                  <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                                Client Tech Specs
                                <span className={styles.drawerTabCount}>
                                  {(item.clientSpecs || []).length}
                                </span>
                              </div>
                              <div
                                className={`${styles.drawerTab}${activeTab === "attachments" ? ` ${styles.drawerTabActive}` : ""}`}
                                onClick={() => setDrawerTab(item.id, "attachments")}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  width="13"
                                  height="13"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                                </svg>
                                Attachments
                                <span className={styles.drawerTabCount}>
                                  {(item.attachments || []).length}
                                </span>
                              </div>
                            </div>

                            {/* Sub-Items panel */}
                            {activeTab === "subs" && (
                              <div className={styles.drawerTabPanel}>
                                {(item.subItems || []).length > 0 ? (
                                  <div className={styles.subTblWrap}>
                                    <div className={styles.subTblHead}>
                                      {!readOnly && <div className={styles.subTh}></div>}
                                      <div className={styles.subTh}>#</div>
                                      <div className={styles.subTh}>
                                        Description
                                      </div>
                                      <div className={styles.subTh}>
                                        Sub-Type
                                      </div>
                                      <div className={styles.subTh}>
                                        Equipment Offer
                                      </div>
                                      <div className={styles.subTh}>
                                        OII / MFG PN
                                      </div>
                                      <div className={styles.subTh}>Qty</div>
                                      <div className={styles.subTh}>
                                        Comments
                                      </div>
                                      {!readOnly && (
                                        <div className={styles.subTh}>
                                          &times;
                                        </div>
                                      )}
                                    </div>
                                    <div className={styles.subRows}>
                                      {(item.subItems || []).map((sub, idx) => (
                                        <div
                                          key={sub.id}
                                          className={`${styles.subRow}${subDragOverId === sub.id ? ` ${styles.subRowDragOver}` : ""}${subDraggedId === sub.id ? ` ${styles.subRowDragged}` : ""}`}
                                          draggable={!readOnly && subDragHandleActive === sub.id}
                                          onDragStart={(e) => handleSubDragStart(e, sub.id)}
                                          onDragOver={(e) => handleSubDragOver(e, sub.id)}
                                          onDrop={(e) => handleSubDrop(e, item.id, sub.id)}
                                          onDragEnd={handleSubDragEnd}
                                        >
                                          {!readOnly && (
                                            <div
                                              className={`${styles.subCell} ${styles.subDragHandle}`}
                                              onMouseDown={() => setSubDragHandleActive(sub.id)}
                                              onMouseUp={() => setSubDragHandleActive(null)}
                                            >
                                              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="9" cy="5" r="1" />
                                                <circle cx="9" cy="12" r="1" />
                                                <circle cx="9" cy="19" r="1" />
                                                <circle cx="15" cy="5" r="1" />
                                                <circle cx="15" cy="12" r="1" />
                                                <circle cx="15" cy="19" r="1" />
                                              </svg>
                                            </div>
                                          )}
                                          <div
                                            className={`${styles.subCell} ${styles.subNum}`}
                                          >
                                            {idx + 1}
                                          </div>
                                          <div className={styles.subCell}>
                                            {readOnly ? (
                                              sub.description || "—"
                                            ) : (
                                              <input
                                                className={styles.subInp}
                                                value={sub.description}
                                                placeholder="Description…"
                                                onChange={(e) =>
                                                  updateSubItem(
                                                    item.id,
                                                    sub.id,
                                                    "description",
                                                    e.target.value,
                                                  )
                                                }
                                              />
                                            )}
                                          </div>
                                          <div className={styles.subCell}>
                                            {readOnly ? (
                                              sub.subType || "—"
                                            ) : (
                                              <select
                                                className={styles.subSel}
                                                value={
                                                  sub.subType || "Consumable"
                                                }
                                                onChange={(e) =>
                                                  updateSubItem(
                                                    item.id,
                                                    sub.id,
                                                    "subType",
                                                    e.target.value,
                                                  )
                                                }
                                              >
                                                <option value="Consumable">
                                                  Consumable
                                                </option>
                                                <option value="Spare Part">
                                                  Spare Part
                                                </option>
                                                <option value="Accessory">
                                                  Accessory
                                                </option>
                                                <option value="Other">
                                                  Other
                                                </option>
                                              </select>
                                            )}
                                          </div>
                                          <div className={`${styles.subCell} ${styles.subEquipmentCell}`}>
                                            {readOnly ? (
                                              sub.equipmentOffer || "—"
                                            ) : (
                                              <PartNumberAutocomplete
                                                value={sub.equipmentOffer}
                                                searchField="description"
                                                placeholder="Offer…"
                                                onChange={(v) =>
                                                  updateSubItem(
                                                    item.id,
                                                    sub.id,
                                                    "equipmentOffer",
                                                    v,
                                                  )
                                                }
                                                onSelect={(pn, desc) => {
                                                  updateSubItemBatch(
                                                    item.id,
                                                    sub.id,
                                                    {
                                                      equipmentOffer: desc,
                                                      partNumber: pn,
                                                      description: desc,
                                                    },
                                                  );
                                                }}
                                              />
                                            )}
                                          </div>
                                          <div className={styles.subCell}>
                                            {readOnly ? (
                                              <span className={styles.cellMono}>
                                                {sub.partNumber || "—"}
                                              </span>
                                            ) : (
                                              <PartNumberAutocomplete
                                                value={sub.partNumber}
                                                searchField="pn"
                                                mono
                                                placeholder="PN…"
                                                onChange={(v) =>
                                                  updateSubItem(
                                                    item.id,
                                                    sub.id,
                                                    "partNumber",
                                                    v,
                                                  )
                                                }
                                                onSelect={(pn, desc) => {
                                                  updateSubItemBatch(
                                                    item.id,
                                                    sub.id,
                                                    {
                                                      partNumber: pn,
                                                      equipmentOffer: desc,
                                                      description: desc,
                                                    },
                                                  );
                                                }}
                                              />
                                            )}
                                          </div>
                                          <div className={styles.subCell}>
                                            {readOnly ? (
                                              sub.qty
                                            ) : (
                                              <input
                                                type="number"
                                                className={`${styles.subInp} ${styles.subInpCenter}`}
                                                value={sub.qty}
                                                min={0}
                                                onChange={(e) =>
                                                  updateSubItem(
                                                    item.id,
                                                    sub.id,
                                                    "qty",
                                                    Number(e.target.value) || 0,
                                                  )
                                                }
                                              />
                                            )}
                                          </div>
                                          <div className={styles.subCell}>
                                            {readOnly ? (
                                              sub.comments || "—"
                                            ) : (
                                              <input
                                                className={styles.subInp}
                                                value={sub.comments}
                                                placeholder="Notes…"
                                                onChange={(e) =>
                                                  updateSubItem(
                                                    item.id,
                                                    sub.id,
                                                    "comments",
                                                    e.target.value,
                                                  )
                                                }
                                              />
                                            )}
                                          </div>
                                          {!readOnly && (
                                            <div
                                              className={`${styles.subCell} ${styles.subActions}`}
                                            >
                                              <div
                                                className={styles.subActionBtn}
                                                onClick={() =>
                                                  setImportSubTarget({ itemId: item.id, subId: sub.id })
                                                }
                                                title="Import Equipment"
                                              >
                                                <svg
                                                  viewBox="0 0 24 24"
                                                  width="12"
                                                  height="12"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                >
                                                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                  <polyline points="7 10 12 15 17 10" />
                                                  <line x1="12" y1="15" x2="12" y2="3" />
                                                </svg>
                                              </div>
                                              <div
                                                className={`${styles.subActionBtn} ${styles.subActionDanger}`}
                                                onClick={() =>
                                                  deleteSubItem(item.id, sub.id)
                                                }
                                                title="Delete sub-item"
                                              >
                                                <svg
                                                  viewBox="0 0 24 24"
                                                  width="13"
                                                  height="13"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                >
                                                  <line
                                                    x1="18"
                                                    y1="6"
                                                    x2="6"
                                                    y2="18"
                                                  />
                                                  <line
                                                    x1="6"
                                                    y1="6"
                                                    x2="18"
                                                    y2="18"
                                                  />
                                                </svg>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                    {!readOnly && (
                                      <div className={styles.subFooter}>
                                        <button
                                          className={styles.addSubBtn}
                                          onClick={() => addSubItem(item.id)}
                                        >
                                          <svg
                                            viewBox="0 0 24 24"
                                            width="11"
                                            height="11"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                          >
                                            <line
                                              x1="12"
                                              y1="5"
                                              x2="12"
                                              y2="19"
                                            />
                                            <line
                                              x1="5"
                                              y1="12"
                                              x2="19"
                                              y2="12"
                                            />
                                          </svg>
                                          Add Sub-Item
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className={styles.drawerEmpty}>
                                    <p>
                                      No sub-items yet. Add consumables, spare
                                      parts, or accessories below.
                                    </p>
                                    {!readOnly && (
                                      <button
                                        className={styles.addSubBtn}
                                        onClick={() => addSubItem(item.id)}
                                      >
                                        <svg
                                          viewBox="0 0 24 24"
                                          width="11"
                                          height="11"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                        >
                                          <line
                                            x1="12"
                                            y1="5"
                                            x2="12"
                                            y2="19"
                                          />
                                          <line
                                            x1="5"
                                            y1="12"
                                            x2="19"
                                            y2="12"
                                          />
                                        </svg>
                                        Add Sub-Item
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Client Tech Specs panel */}
                            {activeTab === "specs" && (
                              <div className={styles.drawerTabPanel}>
                                <div className={styles.specsGrid}>
                                  {/* Left: Client Requirement */}
                                  <div className={styles.specSection}>
                                    <div className={styles.specSectionLabel}>
                                      Client Requirement
                                    </div>
                                    {readOnly ? (
                                      <p
                                        className={styles.specsRequirementText}
                                      >
                                        {item.clientRequirement || (
                                          <span className={styles.specsEmpty}>
                                            No client requirement defined.
                                          </span>
                                        )}
                                      </p>
                                    ) : (
                                      <textarea
                                        className={styles.reqTextarea}
                                        value={item.clientRequirement || ""}
                                        placeholder="Optional — fill in when the client provides detailed requirements in the ET…"
                                        rows={4}
                                        onChange={(e) =>
                                          updateSpecs(
                                            item.id,
                                            e.target.value,
                                            item.clientSpecs || [],
                                          )
                                        }
                                      />
                                    )}
                                  </div>
                                  {/* Right: Technical Specifications */}
                                  <div className={styles.specSection}>
                                    <div className={styles.specSectionLabel}>
                                      Technical Specifications
                                      {(item.clientSpecs || []).length > 0 && (
                                        <span className={styles.specBadge}>
                                          {(item.clientSpecs || []).length}
                                        </span>
                                      )}
                                    </div>
                                    {(item.clientSpecs || []).length > 0 ? (
                                      <div className={styles.specList}>
                                        {(item.clientSpecs || []).map(
                                          (spec, idx) => (
                                            <div
                                              key={idx}
                                              className={styles.specItem}
                                            >
                                              <div
                                                className={styles.specItemNum}
                                              >
                                                {idx + 1}
                                              </div>
                                              {readOnly ? (
                                                <span
                                                  className={
                                                    styles.specsItemText
                                                  }
                                                >
                                                  {spec}
                                                </span>
                                              ) : (
                                                <input
                                                  className={styles.specItemInp}
                                                  value={spec}
                                                  placeholder="Technical specification…"
                                                  onChange={(e) => {
                                                    const updated = [
                                                      ...(item.clientSpecs ||
                                                        []),
                                                    ];
                                                    updated[idx] =
                                                      e.target.value;
                                                    updateSpecs(
                                                      item.id,
                                                      item.clientRequirement ||
                                                        "",
                                                      updated,
                                                    );
                                                  }}
                                                />
                                              )}
                                              {!readOnly && (
                                                <button
                                                  className={styles.specItemDel}
                                                  onClick={() => {
                                                    const updated = (
                                                      item.clientSpecs || []
                                                    ).filter(
                                                      (_, i) => i !== idx,
                                                    );
                                                    updateSpecs(
                                                      item.id,
                                                      item.clientRequirement ||
                                                        "",
                                                      updated,
                                                    );
                                                  }}
                                                  title="Remove"
                                                >
                                                  <svg
                                                    viewBox="0 0 24 24"
                                                    width="11"
                                                    height="11"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                  >
                                                    <line
                                                      x1="18"
                                                      y1="6"
                                                      x2="6"
                                                      y2="18"
                                                    />
                                                    <line
                                                      x1="6"
                                                      y1="6"
                                                      x2="18"
                                                      y2="18"
                                                    />
                                                  </svg>
                                                </button>
                                              )}
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    ) : (
                                      <p className={styles.specsEmpty}>
                                        No technical specifications added yet.
                                      </p>
                                    )}
                                    {!readOnly && (
                                      <div className={styles.specActions}>
                                        <button
                                          className={styles.specAddBtn}
                                          onClick={() => {
                                            const updated = [
                                              ...(item.clientSpecs || []),
                                              "",
                                            ];
                                            updateSpecs(
                                              item.id,
                                              item.clientRequirement || "",
                                              updated,
                                            );
                                          }}
                                        >
                                          <svg
                                            viewBox="0 0 24 24"
                                            width="10"
                                            height="10"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                          >
                                            <line
                                              x1="12"
                                              y1="5"
                                              x2="12"
                                              y2="19"
                                            />
                                            <line
                                              x1="5"
                                              y1="12"
                                              x2="19"
                                              y2="12"
                                            />
                                          </svg>
                                          + Add Specification
                                        </button>
                                      </div>
                                    )}
                                    {!readOnly && (
                                      <div className={styles.bulkWrap}>
                                        <span className={styles.bulkLabel}>
                                          Bulk Import (one specification per
                                          line):
                                        </span>
                                        <textarea
                                          className={styles.bulkTextarea}
                                          value={specsBulkText}
                                          placeholder={
                                            "Paste specifications here, one per line…"
                                          }
                                          rows={3}
                                          onChange={(e) =>
                                            setSpecsBulkText(e.target.value)
                                          }
                                        />
                                        <button
                                          className={styles.bulkImportBtn}
                                          onClick={() =>
                                            handleBulkImportSpecs(item.id)
                                          }
                                          disabled={!specsBulkText.trim()}
                                        >
                                          <svg
                                            viewBox="0 0 24 24"
                                            width="11"
                                            height="11"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                          >
                                            <polyline points="16 16 12 12 8 16" />
                                            <line
                                              x1="12"
                                              y1="12"
                                              x2="12"
                                              y2="21"
                                            />
                                            <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
                                          </svg>
                                          Import Lines
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Attachments panel */}
                            {activeTab === "attachments" && (
                              <div className={styles.drawerTabPanel}>
                                <div className={styles.attachPanel}>
                                  {(item.attachments || []).length > 0 ? (
                                    <div className={styles.attachList}>
                                      {(item.attachments || []).map((att) => (
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
                                          {!readOnly && (
                                            <button
                                              className={styles.attachDelete}
                                              onClick={() => removeAttachment(item.id, att.id)}
                                              title="Remove attachment"
                                            >
                                              ✕
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className={styles.attachEmpty}>
                                      No attachments yet.
                                    </p>
                                  )}
                                  {!readOnly && (
                                    <button
                                      className={styles.addSubBtn}
                                      onClick={() => handleAttachClick(item.id)}
                                    >
                                      <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                                      </svg>
                                      Attach File
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Clarification Popup */}
      {clarPopup && (
        <div
          className={styles.clarPopupOverlay}
          onClick={() => setClarPopup(null)}
        >
          <div
            className={styles.clarPopup}
            style={{ left: clarPopup.x, top: clarPopup.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.clarPopupTitle}>
              Clarification / Qualification
            </div>
            {(() => {
              const clar = clarifications.find(
                (c) => c.scopeItemId === clarPopup.id,
              );
              if (clar) {
                return (
                  <>
                    {clar.clarification && (
                      <div style={{ marginBottom: 8 }}>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--text-secondary)",
                            marginBottom: 2,
                          }}
                        >
                          Clarification / Question:
                        </div>
                        <p
                          className={styles.clarPopupText}
                          style={{ margin: 0 }}
                        >
                          {clar.clarification}
                        </p>
                      </div>
                    )}
                    {clar.clientResponse && (
                      <div style={{ marginBottom: 8 }}>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--text-secondary)",
                            marginBottom: 2,
                          }}
                        >
                          Client Response:
                        </div>
                        <p
                          className={styles.clarPopupText}
                          style={{ margin: 0 }}
                        >
                          {clar.clientResponse}
                        </p>
                      </div>
                    )}
                    {!clar.clarification && !clar.clientResponse && (
                      <p className={styles.clarPopupText}>
                        Clarification entry exists but no question/response yet.
                        Fill in details on the Clarif. &amp; Qualif. tab.
                      </p>
                    )}
                  </>
                );
              }
              return (
                <p className={styles.clarPopupText}>
                  This item has compliance = &quot;No&quot;. A clarification
                  entry has been auto-created in the Clarif. &amp; Qualif. tab.
                </p>
              );
            })()}
            <button
              className={styles.clarPopupClose}
              onClick={() => setClarPopup(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* AI Analyzer Modal */}
      {showAIModal && bidNumber && (
        <div className={styles.aiOverlay}>
          <div className={styles.aiModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.aiModalHeader}>
              <h3>🤖 AI Document Analysis</h3>
              <button
                className={styles.aiModalClose}
                onClick={() => setShowAIModal(false)}
              >
                ✕
              </button>
            </div>
            <AIDocumentAnalyzer
              bidNumber={bidNumber}
              onImport={(aiItems: IScopeItem[]) => {
                const merged = [...items, ...aiItems];
                setItems(merged);
                persist(merged);
                setShowAIModal(false);
              }}
              importLabel="Import AI Items to Scope"
              compact
            />
          </div>
        </div>
      )}

      {/* Equipment Import Modal */}
      {importTargetId && (
        <EquipmentImportModal
          onSelect={(pn, desc, importSubs) => {
            // Set both fields in a single persist to avoid state race
            const updated = items.map((i) => {
              if (i.id !== importTargetId) return i;
              const patched = { ...i, equipmentOffer: desc, partNumber: pn };
              // Append imported sub-items if any
              if (importSubs && importSubs.length > 0) {
                const newSubs: IScopeSubItem[] = importSubs.map((s) => ({
                  id: makeId("sub"),
                  description: s.description,
                  subType: "Accessory",
                  equipmentOffer: s.description,
                  partNumber: s.partNumber,
                  qty: 1,
                  comments: "",
                }));
                patched.subItems = [...(i.subItems || []), ...newSubs];
              }
              return patched;
            });
            persist(updated);
            setImportTargetId(null);
          }}
          onClose={() => setImportTargetId(null)}
        />
      )}

      {/* Equipment Import Modal for Sub-Items */}
      {importSubTarget && (
        <EquipmentImportModal
          onSelect={(pn, desc) => {
            const updated = items.map((i) => {
              if (i.id !== importSubTarget.itemId) return i;
              const subs = (i.subItems || []).map((s) => {
                if (s.id !== importSubTarget.subId) return s;
                return {
                  ...s,
                  equipmentOffer: desc,
                  partNumber: pn,
                  description: s.description || desc,
                };
              });
              return { ...i, subItems: subs };
            });
            persist(updated);
            setImportSubTarget(null);
          }}
          onClose={() => setImportSubTarget(null)}
        />
      )}
    </div>
  );
};

/* ─── Editable Cell helper ─── */
interface EditableCellProps {
  value: string;
  readOnly: boolean;
  mono?: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onEndEdit: () => void;
  onChange: (v: string) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  readOnly,
  mono,
  isEditing,
  onStartEdit,
  onEndEdit,
  onChange,
}) => {
  if (readOnly)
    return (
      <span className={mono ? styles.cellMono : undefined}>{value || "—"}</span>
    );

  if (isEditing) {
    return (
      <input
        className={styles.editInput}
        value={value}
        autoFocus
        onChange={(e) => onChange(e.target.value)}
        onBlur={onEndEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter") onEndEdit();
        }}
      />
    );
  }

  return (
    <span
      className={mono ? styles.cellMono : undefined}
      onDoubleClick={onStartEdit}
      style={{ cursor: "text", minHeight: 20, display: "block" }}
    >
      {value || "—"}
    </span>
  );
};
