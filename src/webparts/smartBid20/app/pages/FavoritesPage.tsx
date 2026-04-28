import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { BidCard } from "../components/bid/BidCard";
import { PartNumberAutocomplete } from "../components/common/PartNumberAutocomplete";
import { AdvancedCatalogSearch } from "../components/common/AdvancedCatalogSearch";
import { PhotoLightbox } from "../components/common/PhotoLightbox";
import { useBids } from "../hooks/useBids";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import { useQueryCatalogStore } from "../stores/useQueryCatalogStore";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { IBid, IFavoriteEquipment } from "../models";
import { makeId } from "../utils/idGenerator";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import styles from "./FavoritesPage.module.scss";

type TabKey = "bids" | "equipment";
type ViewMode = "grid" | "list";

/** Build the photo URL for an equipment item from the photos library */
function getPhotoUrl(partNumber: string): string {
  if (!partNumber) return "";
  const pn = partNumber.trim();
  if (!pn) return "";
  return `${SHAREPOINT_CONFIG.siteUrl}${SHAREPOINT_CONFIG.photosBaseUrl}/${pn}.jpg`;
}

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { bids } = useBids();
  const currentUser = useCurrentUser();

  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
  const favData = useFavoritesStore((s) => s.data);
  const isLoading = useFavoritesStore((s) => s.isLoading);
  const isLoaded = useFavoritesStore((s) => s.isLoaded);
  const toggleBidFavorite = useFavoritesStore((s) => s.toggleBidFavorite);
  const addEquipment = useFavoritesStore((s) => s.addEquipment);
  const updateEquipment = useFavoritesStore((s) => s.updateEquipment);
  const removeEquipment = useFavoritesStore((s) => s.removeEquipment);
  const addGroup = useFavoritesStore((s) => s.addGroup);
  const addSubGroup = useFavoritesStore((s) => s.addSubGroup);
  const removeGroup = useFavoritesStore((s) => s.removeGroup);
  const removeSubGroup = useFavoritesStore((s) => s.removeSubGroup);
  const renameGroup = useFavoritesStore((s) => s.renameGroup);
  const renameSubGroup = useFavoritesStore((s) => s.renameSubGroup);

  const [activeTab, setActiveTab] = React.useState<TabKey>("equipment");
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);
  const [selectedSubGroup, setSelectedSubGroup] = React.useState<string | null>(
    null,
  );
  const [searchText, setSearchText] = React.useState("");
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [addingParentId, setAddingParentId] = React.useState<string | null>(
    null,
  );
  const [showManageGroups, setShowManageGroups] = React.useState(false);
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    new Set(),
  );
  const [expandedSubItems, setExpandedSubItems] = React.useState<Set<string>>(
    new Set(),
  );
  const [previewPhotoUrl, setPreviewPhotoUrl] = React.useState<string | null>(
    null,
  );
  const [editingItem, setEditingItem] =
    React.useState<IFavoriteEquipment | null>(null);

  // Load favorites on mount
  React.useEffect(() => {
    if (!isLoaded) loadFavorites();
  }, []);

  const rawGroups = favData?.groups || [];
  const equipment = favData?.equipment || [];
  const favBids = favData?.bids || [];

  // Sort groups and subGroups alphabetically
  const groups = React.useMemo(() => {
    return rawGroups
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((g) => ({
        ...g,
        subGroups: g.subGroups
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [rawGroups]);

  // Resolve BID favorites to full IBid objects
  const favBidNumbers = React.useMemo(
    () => new Set(favBids.map((f) => f.bidNumber)),
    [favBids],
  );
  const favoriteBidList = React.useMemo(
    () => bids.filter((b) => favBidNumbers.has(b.bidNumber)),
    [bids, favBidNumbers],
  );

  // Filter equipment by group/subgroup/search
  const filteredEquipment = React.useMemo(() => {
    let list = equipment;
    if (selectedGroup) {
      list = list.filter((e) => e.groupId === selectedGroup);
      if (selectedSubGroup) {
        list = list.filter((e) => e.subGroupId === selectedSubGroup);
      }
    }
    if (searchText.trim()) {
      const tokens = searchText
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => t.length > 0);
      list = list.filter((e) => {
        const haystack = [
          e.partNumber || "",
          e.description || "",
          e.notes || "",
        ]
          .join(" ")
          .toLowerCase();
        return tokens.every((token) => haystack.indexOf(token) >= 0);
      });
    }
    return list;
  }, [equipment, selectedGroup, selectedSubGroup, searchText]);

  // Build parent → children map for hierarchical display
  const parentItems = React.useMemo(
    () => filteredEquipment.filter((e) => !e.parentId),
    [filteredEquipment],
  );
  const childrenMap = React.useMemo(() => {
    const map = new Map<string, IFavoriteEquipment[]>();
    filteredEquipment.forEach((e) => {
      if (e.parentId) {
        const list = map.get(e.parentId);
        if (list) list.push(e);
        else map.set(e.parentId, [e]);
      }
    });
    return map;
  }, [filteredEquipment]);

  const handleBidClick = (bid: IBid): void => {
    navigate(`/bid/${bid.bidNumber}`);
  };

  const handleRemoveBidFav = (bidNumber: string): void => {
    toggleBidFavorite(bidNumber, currentUser?.displayName || "");
  };

  const handleToggleGroupExpand = (groupId: string): void => {
    const next = new Set(expandedGroups);
    if (next.has(groupId)) next.delete(groupId);
    else next.add(groupId);
    setExpandedGroups(next);
  };

  const handleToggleSubItems = (parentId: string): void => {
    const next = new Set(expandedSubItems);
    if (next.has(parentId)) next.delete(parentId);
    else next.add(parentId);
    setExpandedSubItems(next);
  };

  const handleSelectGroup = (
    groupId: string | null,
    subGroupId?: string | null,
  ): void => {
    setSelectedGroup(groupId);
    setSelectedSubGroup(subGroupId || null);
  };

  const getGroupCount = (groupId: string): number =>
    equipment.filter((e) => e.groupId === groupId).length;

  const getSubGroupCount = (subGroupId: string): number =>
    equipment.filter((e) => e.subGroupId === subGroupId).length;

  const handleRemoveEquipment = (id: string): void => {
    const eq = equipment.find((e) => e.id === id);
    const label = eq ? `${eq.partNumber} — ${eq.description}` : id;
    if (!confirm(`Remove "${label}" from favorites?`)) return;
    removeEquipment(id);
  };

  const handleAddGroupPrompt = (): void => {
    const name = prompt("New group name:");
    if (name && name.trim()) addGroup(name.trim());
  };

  const handleAddSubGroupPrompt = (groupId: string): void => {
    const name = prompt("New sub-group name:");
    if (name && name.trim()) addSubGroup(groupId, name.trim());
  };

  const handleRemoveGroup = async (groupId: string): Promise<void> => {
    const g = groups.find((gr) => gr.id === groupId);
    if (!g) return;
    try {
      await removeGroup(groupId);
    } catch (err: any) {
      alert(err.message || "Cannot delete group.");
    }
  };

  const sourceLabel = (src: string): { text: string; cls: string } => {
    switch (src) {
      case "bid":
        return { text: "BID", cls: styles.srcBid };
      case "query":
        return { text: "Query", cls: styles.srcQuery };
      default:
        return { text: "Manual", cls: styles.srcManual };
    }
  };

  // ─── Add Equipment Modal ───
  const AddEquipmentModal: React.FC = () => {
    const catalogLoading = useQueryCatalogStore((s) => s.isLoading);
    const searchCatalogByPN = useQueryCatalogStore((s) => s.searchByPN);
    const [mode, setMode] = React.useState<"manual" | "query">("query");
    const [pn, setPn] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [selectedPN, setSelectedPN] = React.useState("");
    const [mfgId, setMfgId] = React.useState("");
    const [mfgItmId, setMfgItmId] = React.useState("");
    const [notes, setNotes] = React.useState("");

    // If adding a sub-item, inherit parent's group/subgroup
    const parentItem = addingParentId
      ? equipment.find((e) => e.id === addingParentId)
      : null;
    const [groupId, setGroupId] = React.useState(
      parentItem?.groupId || selectedGroup || groups[0]?.id || "",
    );
    const [subGroupId, setSubGroupId] = React.useState(
      parentItem?.subGroupId || selectedSubGroup || "",
    );
    const [showAdvanced, setShowAdvanced] = React.useState(false);

    const selectedGroupObj = groups.find((g) => g.id === groupId);
    const needsSubGroup =
      selectedGroupObj && selectedGroupObj.subGroups.length > 0;
    const canSave =
      (pn.trim() || desc.trim()) && groupId && (!needsSubGroup || subGroupId);

    // Duplicate PN check
    const duplicateInfo = React.useMemo(() => {
      const trimmed = pn.trim().toUpperCase();
      if (!trimmed) return null;
      const existing = equipment.find(
        (e) => e.partNumber.toUpperCase().trim() === trimmed,
      );
      if (!existing) return null;
      const grp = groups.find((g) => g.id === existing.groupId);
      const sub = grp
        ? grp.subGroups.find((s) => s.id === existing.subGroupId)
        : undefined;
      return {
        groupName: grp?.name || "—",
        subGroupName: sub?.name || "",
        isChild: !!existing.parentId,
      };
    }, [pn, equipment, groups]);

    // Look up mfg data from catalog when PN is selected
    const lookupMfg = (partNumber: string): void => {
      const results = searchCatalogByPN(partNumber, 1);
      if (
        results.length > 0 &&
        results[0].pn.toUpperCase() === partNumber.toUpperCase()
      ) {
        setMfgId(results[0].mfgId || "");
        setMfgItmId(results[0].mfgItmId || "");
      } else {
        setMfgId("");
        setMfgItmId("");
      }
    };

    const handleSave = (): void => {
      if (!canSave) return;
      const item: IFavoriteEquipment = {
        id: makeId("fav"),
        groupId,
        subGroupId,
        partNumber: pn.trim(),
        description: desc.trim(),
        pictureUrl: getPhotoUrl(pn.trim()),
        notes: notes.trim(),
        dataSource: mode === "query" ? "query" : "manual",
        mfgId: mfgId || undefined,
        mfgItmId: mfgItmId || undefined,
        parentId: addingParentId || undefined,
        createdBy: currentUser?.displayName || "",
        createdDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };
      addEquipment(item);
      setShowAddModal(false);
      setAddingParentId(null);
    };

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h3>
              {parentItem
                ? "Add Sub-Item (Spare / Accessory)"
                : "Add Equipment to Favorites"}
            </h3>
            <button
              className={styles.closeBtn}
              onClick={() => {
                setShowAddModal(false);
                setAddingParentId(null);
              }}
            >
              ✕
            </button>
          </div>

          <div className={styles.modalBody}>
            {/* Parent item info banner */}
            {parentItem && (
              <div className={styles.parentBanner}>
                🔗 Adding sub-item for: <strong>{parentItem.partNumber}</strong>{" "}
                — {parentItem.description}
              </div>
            )}
            {/* Loading indicator while catalog loads */}
            {catalogLoading && (
              <div className={styles.catalogLoadingBanner}>
                <span className={styles.inlineSpinner} />
                Loading query catalog... this may take a moment.
              </div>
            )}

            {/* Mode toggle */}
            <div className={styles.modeToggle}>
              <button
                className={`${styles.modeBtn} ${mode === "query" ? styles.modeActive : ""}`}
                onClick={() => setMode("query")}
              >
                📋 From Query
              </button>
              <button
                className={`${styles.modeBtn} ${mode === "manual" ? styles.modeActive : ""}`}
                onClick={() => setMode("manual")}
              >
                ✏️ Manual
              </button>
            </div>

            {/* Group / SubGroup pickers */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Group *</label>
              <select
                className={styles.formSelect}
                value={groupId}
                disabled={!!parentItem}
                onChange={(e) => {
                  setGroupId(e.target.value);
                  setSubGroupId("");
                }}
              >
                <option value="">— Select Group —</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedGroupObj && selectedGroupObj.subGroups.length > 0 && (
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Sub-Group *</label>
                <select
                  className={styles.formSelect}
                  value={subGroupId}
                  disabled={!!parentItem}
                  onChange={(e) => setSubGroupId(e.target.value)}
                >
                  <option value="">— Select Sub-Group —</option>
                  {selectedGroupObj.subGroups.map((sg) => (
                    <option key={sg.id} value={sg.id}>
                      {sg.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* PN / Description */}
            {mode === "query" ? (
              <div className={styles.formRow}>
                <label className={styles.formLabel}>
                  Search Part Number or Description
                </label>
                <PartNumberAutocomplete
                  value={pn}
                  searchField="both"
                  mono
                  placeholder="Type PN or description to search..."
                  sourcesFilter={["query"]}
                  onChange={(v) => {
                    setPn(v);
                    // Clear selection when user continues typing
                    setSelectedPN("");
                    setDesc("");
                    setMfgId("");
                    setMfgItmId("");
                  }}
                  onSelect={(p, d) => {
                    setPn(p);
                    setDesc(d);
                    setSelectedPN(p);
                    lookupMfg(p);
                  }}
                />
                <button
                  type="button"
                  className={styles.advancedSearchBtn}
                  onClick={() => setShowAdvanced(true)}
                >
                  🔍 Advanced Search
                </button>
                {desc && (
                  <div className={styles.selectedDesc}>
                    <strong>Description:</strong> {desc}
                  </div>
                )}
                {selectedPN && (
                  <div
                    key={selectedPN}
                    className={styles.equipPhotoWrap}
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 6,
                      marginTop: 8,
                      cursor: "zoom-in",
                    }}
                    onClick={() => setPreviewPhotoUrl(getPhotoUrl(selectedPN))}
                    title="Click to enlarge"
                  >
                    <img
                      src={getPhotoUrl(selectedPN)}
                      alt={selectedPN}
                      className={styles.equipPhoto}
                      onError={(e) => {
                        const wrap = (e.target as HTMLImageElement)
                          .parentElement;
                        if (wrap) wrap.style.display = "none";
                      }}
                    />
                  </div>
                )}
                {showAdvanced && (
                  <AdvancedCatalogSearch
                    onSelect={(p, d) => {
                      setPn(p);
                      setDesc(d);
                      setSelectedPN(p);
                      lookupMfg(p);
                      setShowAdvanced(false);
                    }}
                    onClose={() => setShowAdvanced(false)}
                  />
                )}
              </div>
            ) : (
              <>
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Part Number</label>
                  <input
                    className={styles.formInput}
                    value={pn}
                    onChange={(e) => setPn(e.target.value)}
                    placeholder="Enter part number..."
                  />
                </div>
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Description</label>
                  <input
                    className={styles.formInput}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Enter description..."
                  />
                </div>
              </>
            )}

            <div className={styles.formRow}>
              <label className={styles.formLabel}>Notes</label>
              <textarea
                className={styles.formTextarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes..."
                rows={2}
              />
            </div>

            {/* Manufacturer info (read-only, from catalog lookup) */}
            {(mfgId || mfgItmId) && (
              <div className={styles.mfgInfoRow}>
                {mfgId && (
                  <span>
                    <strong>Mfg:</strong> {mfgId}
                  </span>
                )}
                {mfgItmId && (
                  <span>
                    <strong>Mfg Ref:</strong> {mfgItmId}
                  </span>
                )}
              </div>
            )}

            {/* Duplicate PN warning */}
            {duplicateInfo && (
              <div className={styles.duplicateWarning}>
                ⚠️ This Part Number already exists in favorites:{" "}
                <strong>{duplicateInfo.groupName}</strong>
                {duplicateInfo.subGroupName
                  ? ` › ${duplicateInfo.subGroupName}`
                  : ""}
                {duplicateInfo.isChild ? " (as sub-item)" : ""}
              </div>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button
              className={styles.cancelBtn}
              onClick={() => {
                setShowAddModal(false);
                setAddingParentId(null);
              }}
            >
              Cancel
            </button>
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={!canSave}
            >
              {parentItem ? "Add Sub-Item" : "Add to Favorites"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Manage Groups Modal ───
  const ManageGroupsModal: React.FC = () => {
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [editValue, setEditValue] = React.useState("");
    const [errorMsg, setErrorMsg] = React.useState("");
    const [newGroupName, setNewGroupName] = React.useState("");
    const [addingSubGroupTo, setAddingSubGroupTo] = React.useState<
      string | null
    >(null);
    const [newSubGroupName, setNewSubGroupName] = React.useState("");

    const handleStartEdit = (id: string, currentName: string): void => {
      setEditingId(id);
      setEditValue(currentName);
      setErrorMsg("");
    };

    const handleSaveGroupRename = async (groupId: string): Promise<void> => {
      if (!editValue.trim()) return;
      await renameGroup(groupId, editValue.trim());
      setEditingId(null);
    };

    const handleSaveSubGroupRename = async (
      groupId: string,
      subGroupId: string,
    ): Promise<void> => {
      if (!editValue.trim()) return;
      await renameSubGroup(groupId, subGroupId, editValue.trim());
      setEditingId(null);
    };

    const handleDeleteGroup = async (groupId: string): Promise<void> => {
      setErrorMsg("");
      const g = groups.find((gr) => gr.id === groupId);
      const label = g ? g.name : groupId;
      const itemCount = equipment.filter((e) => e.groupId === groupId).length;
      const subCount = g ? g.subGroups.length : 0;
      const msg =
        itemCount > 0
          ? `Cannot delete "${label}" — it still contains ${itemCount} equipment item(s). Move or remove them first.`
          : `Delete group "${label}"${subCount > 0 ? ` and its ${subCount} sub-group(s)` : ""}? This cannot be undone.`;
      if (itemCount > 0) {
        alert(msg);
        return;
      }
      if (!confirm(msg)) return;
      try {
        await removeGroup(groupId);
      } catch (err: any) {
        setErrorMsg(err.message || "Cannot delete group.");
      }
    };

    const handleDeleteSubGroup = async (
      groupId: string,
      subGroupId: string,
    ): Promise<void> => {
      setErrorMsg("");
      const g = groups.find((gr) => gr.id === groupId);
      const sg = g ? g.subGroups.find((s) => s.id === subGroupId) : null;
      const label = sg ? sg.name : subGroupId;
      const itemCount = equipment.filter(
        (e) => e.subGroupId === subGroupId,
      ).length;
      const msg =
        itemCount > 0
          ? `Cannot delete sub-group "${label}" — it still contains ${itemCount} equipment item(s). Move or remove them first.`
          : `Delete sub-group "${label}"? This cannot be undone.`;
      if (itemCount > 0) {
        alert(msg);
        return;
      }
      if (!confirm(msg)) return;
      try {
        await removeSubGroup(groupId, subGroupId);
      } catch (err: any) {
        setErrorMsg(err.message || "Cannot delete sub-group.");
      }
    };

    const handleAddGroup = (): void => {
      if (!newGroupName.trim()) return;
      addGroup(newGroupName.trim());
      setNewGroupName("");
    };

    const handleAddSubGroup = (groupId: string): void => {
      if (!newSubGroupName.trim()) return;
      addSubGroup(groupId, newSubGroupName.trim());
      setNewSubGroupName("");
      setAddingSubGroupTo(null);
    };

    return (
      <div
        className={styles.modalOverlay}
        onClick={() => setShowManageGroups(false)}
      >
        <div
          className={`${styles.modal} ${styles.manageModal}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.modalHeader}>
            <h3>Manage Groups & Sub-Groups</h3>
            <button
              className={styles.closeBtn}
              onClick={() => setShowManageGroups(false)}
            >
              ✕
            </button>
          </div>

          <div className={styles.manageBody}>
            {errorMsg && <div className={styles.manageError}>{errorMsg}</div>}

            {/* Add new group */}
            <div className={styles.manageAddRow}>
              <input
                className={styles.formInput}
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="New group name..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddGroup();
                }}
              />
              <button className={styles.saveBtn} onClick={handleAddGroup}>
                + Add Group
              </button>
            </div>

            <div className={styles.manageList}>
              {groups.map((g) => {
                const gCount = equipment.filter(
                  (e) => e.groupId === g.id,
                ).length;
                return (
                  <div key={g.id} className={styles.manageGroupBlock}>
                    <div className={styles.manageGroupRow}>
                      {editingId === g.id ? (
                        <input
                          className={styles.manageEditInput}
                          value={editValue}
                          autoFocus
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveGroupRename(g.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          onBlur={() => handleSaveGroupRename(g.id)}
                        />
                      ) : (
                        <span className={styles.manageGroupName}>
                          {g.name}
                          <span className={styles.manageCount}>({gCount})</span>
                        </span>
                      )}
                      <div className={styles.manageActions}>
                        <button
                          className={styles.manageActionBtn}
                          title="Rename"
                          onClick={() => handleStartEdit(g.id, g.name)}
                        >
                          ✏️
                        </button>
                        <button
                          className={styles.manageActionBtn}
                          title="Add sub-group"
                          onClick={() => {
                            setAddingSubGroupTo(g.id);
                            setNewSubGroupName("");
                          }}
                        >
                          +
                        </button>
                        <button
                          className={`${styles.manageActionBtn} ${styles.manageDeleteBtn}`}
                          title="Delete group"
                          onClick={() => handleDeleteGroup(g.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </div>

                    {/* Sub-groups */}
                    {g.subGroups.map((sg) => {
                      const sgCount = equipment.filter(
                        (e) => e.subGroupId === sg.id,
                      ).length;
                      return (
                        <div key={sg.id} className={styles.manageSubGroupRow}>
                          {editingId === sg.id ? (
                            <input
                              className={styles.manageEditInput}
                              value={editValue}
                              autoFocus
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleSaveSubGroupRename(g.id, sg.id);
                                if (e.key === "Escape") setEditingId(null);
                              }}
                              onBlur={() =>
                                handleSaveSubGroupRename(g.id, sg.id)
                              }
                            />
                          ) : (
                            <span className={styles.manageSubGroupName}>
                              {sg.name}
                              <span className={styles.manageCount}>
                                ({sgCount})
                              </span>
                            </span>
                          )}
                          <div className={styles.manageActions}>
                            <button
                              className={styles.manageActionBtn}
                              title="Rename"
                              onClick={() => handleStartEdit(sg.id, sg.name)}
                            >
                              ✏️
                            </button>
                            <button
                              className={`${styles.manageActionBtn} ${styles.manageDeleteBtn}`}
                              title="Delete sub-group"
                              onClick={() => handleDeleteSubGroup(g.id, sg.id)}
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add sub-group inline */}
                    {addingSubGroupTo === g.id && (
                      <div className={styles.manageSubGroupRow}>
                        <input
                          className={styles.manageEditInput}
                          value={newSubGroupName}
                          autoFocus
                          placeholder="Sub-group name..."
                          onChange={(e) => setNewSubGroupName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddSubGroup(g.id);
                            if (e.key === "Escape") setAddingSubGroupTo(null);
                          }}
                        />
                        <button
                          className={styles.manageActionBtn}
                          onClick={() => handleAddSubGroup(g.id)}
                        >
                          ✓
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              className={styles.cancelBtn}
              onClick={() => setShowManageGroups(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Favorites"
          subtitle="Loading..."
          icon={<StarIcon />}
        />
        <div className={styles.loadingState}>Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Favorites"
        subtitle={`${favoriteBidList.length} BIDs · ${equipment.length} equipment items`}
        icon={<StarIcon />}
      />

      {/* Tab bar */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === "bids" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("bids")}
        >
          ⭐ BID Favorites
          {favoriteBidList.length > 0 && (
            <span className={styles.tabCount}>{favoriteBidList.length}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "equipment" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("equipment")}
        >
          📦 Equipment Catalog
          {equipment.length > 0 && (
            <span className={styles.tabCount}>{equipment.length}</span>
          )}
        </button>
      </div>

      {/* BID Favorites Tab */}
      {activeTab === "bids" && (
        <div className={styles.bidContent}>
          {favoriteBidList.length === 0 ? (
            <GlassCard>
              <div className={styles.emptyState}>
                <StarIcon size={48} />
                <p>No BIDs bookmarked yet.</p>
                <p className={styles.emptyHint}>
                  Open a BID and click the star icon to add it here.
                </p>
              </div>
            </GlassCard>
          ) : (
            <div className={styles.cardGrid}>
              {favoriteBidList.map((bid) => (
                <div key={bid.bidNumber} className={styles.bidCardWrap}>
                  <BidCard bid={bid} onClick={handleBidClick} />
                  <button
                    className={styles.removeBidBtn}
                    title="Remove from favorites"
                    onClick={() => handleRemoveBidFav(bid.bidNumber)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Equipment Catalog Tab */}
      {activeTab === "equipment" && (
        <div className={styles.equipContent}>
          {/* Sidebar — Group tree */}
          <div className={styles.groupSidebar}>
            <div className={styles.sidebarHeader}>
              <span className={styles.sidebarTitle}>Groups</span>
              <button
                className={styles.manageGroupsBtn}
                title="Manage Groups & Sub-Groups"
                onClick={() => setShowManageGroups(true)}
              >
                ⚙
              </button>
              <button
                className={styles.addGroupBtn}
                title="Add group"
                onClick={handleAddGroupPrompt}
              >
                +
              </button>
            </div>
            <div
              className={`${styles.groupItem} ${!selectedGroup ? styles.groupActive : ""}`}
              onClick={() => handleSelectGroup(null)}
            >
              <span>📁 All Items</span>
              <span className={styles.groupCount}>{equipment.length}</span>
            </div>
            {groups.map((g) => (
              <div key={g.id}>
                <div
                  className={`${styles.groupItem} ${selectedGroup === g.id && !selectedSubGroup ? styles.groupActive : ""}`}
                  onClick={() => handleSelectGroup(g.id)}
                >
                  <span
                    className={styles.groupExpander}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleGroupExpand(g.id);
                    }}
                  >
                    {g.subGroups.length > 0
                      ? expandedGroups.has(g.id)
                        ? "▾"
                        : "▸"
                      : " "}
                  </span>
                  <span className={styles.groupName}>{g.name}</span>
                  <span className={styles.groupCount}>
                    {getGroupCount(g.id)}
                  </span>
                  <button
                    className={styles.groupAction}
                    title="Add sub-group"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddSubGroupPrompt(g.id);
                    }}
                  >
                    +
                  </button>
                  <button
                    className={styles.groupAction}
                    title="Remove group"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete group "${g.name}"?`))
                        handleRemoveGroup(g.id);
                    }}
                  >
                    ✕
                  </button>
                </div>
                {expandedGroups.has(g.id) &&
                  g.subGroups.map((sg) => (
                    <div
                      key={sg.id}
                      className={`${styles.subGroupItem} ${selectedSubGroup === sg.id ? styles.groupActive : ""}`}
                      onClick={() => handleSelectGroup(g.id, sg.id)}
                    >
                      <span>{sg.name}</span>
                      <span className={styles.groupCount}>
                        {getSubGroupCount(sg.id)}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* Main area */}
          <div className={styles.mainArea}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <input
                className={styles.searchInput}
                placeholder="Search equipment..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button
                className={styles.toolBtn}
                onClick={() => setShowAddModal(true)}
              >
                ➕ Add Item
              </button>
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewActive : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  ▦
                </button>
                <button
                  className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewActive : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List view"
                >
                  ☰
                </button>
              </div>
            </div>

            {filteredEquipment.length === 0 ? (
              <div className={styles.emptyEquip}>
                <p>No equipment items in this category.</p>
                <button
                  className={styles.toolBtn}
                  onClick={() => setShowAddModal(true)}
                >
                  ➕ Add First Item
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className={styles.equipGrid}>
                {parentItems.map((eq) => {
                  const src = sourceLabel(eq.dataSource);
                  const photoSrc = eq.pictureUrl || getPhotoUrl(eq.partNumber);
                  const grp = groups.find((g) => g.id === eq.groupId);
                  const sub = grp
                    ? grp.subGroups.find((s) => s.id === eq.subGroupId)
                    : undefined;
                  const children = childrenMap.get(eq.id) || [];
                  return (
                    <div key={eq.id} className={styles.equipCard}>
                      <div
                        key={photoSrc || eq.partNumber}
                        className={styles.equipPhotoWrap}
                        style={{ cursor: photoSrc ? "zoom-in" : "default" }}
                        onClick={() => photoSrc && setPreviewPhotoUrl(photoSrc)}
                        title={photoSrc ? "Click to enlarge" : ""}
                      >
                        {photoSrc ? (
                          <img
                            src={photoSrc}
                            alt={eq.partNumber}
                            className={styles.equipPhoto}
                            onError={(e) => {
                              const wrap = (e.target as HTMLImageElement)
                                .parentElement;
                              if (wrap) {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                                const ph = wrap.querySelector(
                                  `.${styles.photoPlaceholder}`,
                                );
                                if (ph)
                                  (ph as HTMLElement).style.display = "flex";
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className={styles.photoPlaceholder}
                          style={photoSrc ? { display: "none" } : undefined}
                        >
                          📷
                        </div>
                      </div>
                      <div className={styles.equipCardHeader}>
                        <span className={styles.equipPN}>{eq.partNumber}</span>
                        <span className={`${styles.srcBadge} ${src.cls}`}>
                          {src.text}
                        </span>
                      </div>
                      {grp && (
                        <div className={styles.equipGroupInfo}>
                          {grp.name}
                          {sub ? ` › ${sub.name}` : ""}
                        </div>
                      )}
                      <div className={styles.equipDesc}>{eq.description}</div>
                      {(eq.mfgId || eq.mfgItmId) && (
                        <div className={styles.equipMfg}>
                          {eq.mfgId && <span>Mfg: {eq.mfgId}</span>}
                          {eq.mfgId && eq.mfgItmId && <span> · </span>}
                          {eq.mfgItmId && <span>Ref: {eq.mfgItmId}</span>}
                        </div>
                      )}
                      {eq.notes && (
                        <div className={styles.equipNotes}>{eq.notes}</div>
                      )}
                      {eq.costUSD != null && eq.costUSD > 0 && (
                        <div className={styles.equipCost}>
                          ${eq.costUSD.toFixed(2)}
                          {eq.costReference && (
                            <span className={styles.costRef}>
                              {eq.costReference}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Sub-items */}
                      {children.length > 0 && (
                        <div className={styles.subItemsList}>
                          <div
                            className={styles.subItemsLabel}
                            onClick={() => handleToggleSubItems(eq.id)}
                            style={{ cursor: "pointer", userSelect: "none" }}
                          >
                            <span>
                              {expandedSubItems.has(eq.id) ? "▾" : "▸"}
                            </span>{" "}
                            Sub-items ({children.length})
                          </div>
                          {expandedSubItems.has(eq.id) &&
                            children.map((child) => (
                              <div key={child.id} className={styles.subItemRow}>
                                <span className={styles.subItemPN}>
                                  └ {child.partNumber}
                                </span>
                                <span className={styles.subItemDesc}>
                                  {child.description}
                                </span>
                                <button
                                  className={styles.removeBtn}
                                  onClick={() => setEditingItem(child)}
                                  title="Edit"
                                  style={{ marginRight: 4 }}
                                >
                                  ✏️
                                </button>
                                <button
                                  className={styles.removeBtn}
                                  onClick={() =>
                                    handleRemoveEquipment(child.id)
                                  }
                                  title="Remove"
                                >
                                  🗑
                                </button>
                              </div>
                            ))}
                        </div>
                      )}

                      <div className={styles.equipCardFooter}>
                        <button
                          className={styles.subItemBtn}
                          onClick={() => {
                            setAddingParentId(eq.id);
                            setShowAddModal(true);
                          }}
                          title="Add spare / accessory"
                        >
                          🔗+
                        </button>
                        <span style={{ flex: 1 }} />
                        <button
                          className={styles.removeBtn}
                          onClick={() => setEditingItem(eq)}
                          title="Edit group / sub-group"
                          style={{ marginRight: 6 }}
                        >
                          ✏️
                        </button>
                        <button
                          className={styles.removeBtn}
                          onClick={() => handleRemoveEquipment(eq.id)}
                          title="Remove"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.equipList}>
                <div className={styles.listHeader}>
                  <span className={styles.listColImg}></span>
                  <span className={styles.listColPN}>Part Number</span>
                  <span className={styles.listColDesc}>Description</span>
                  <span className={styles.listColNotes}>Notes</span>
                  <span className={styles.listColSrc}>Source</span>
                  <span className={styles.listColAct}>Actions</span>
                </div>
                {parentItems.map((eq) => {
                  const src = sourceLabel(eq.dataSource);
                  const photoSrc = eq.pictureUrl || getPhotoUrl(eq.partNumber);
                  const children = childrenMap.get(eq.id) || [];
                  return (
                    <React.Fragment key={eq.id}>
                      <div className={styles.listRow}>
                        <span className={styles.listColImg}>
                          {photoSrc ? (
                            <img
                              key={photoSrc}
                              src={photoSrc}
                              alt=""
                              className={styles.listThumb}
                              style={{ cursor: "zoom-in" }}
                              onClick={() => setPreviewPhotoUrl(photoSrc)}
                              title="Click to enlarge"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <span className={styles.listThumbPlaceholder}>
                              📷
                            </span>
                          )}
                        </span>
                        <span className={styles.listColPN}>
                          {eq.partNumber}
                          {(eq.mfgId || eq.mfgItmId) && (
                            <span className={styles.listMfg}>
                              {eq.mfgId || ""}
                              {eq.mfgId && eq.mfgItmId ? " · " : ""}
                              {eq.mfgItmId || ""}
                            </span>
                          )}
                        </span>
                        <span className={styles.listColDesc}>
                          {eq.description}
                        </span>
                        <span className={styles.listColNotes}>
                          {eq.notes || "—"}
                        </span>
                        <span className={styles.listColSrc}>
                          <span className={`${styles.srcBadge} ${src.cls}`}>
                            {src.text}
                          </span>
                        </span>
                        <span className={styles.listColAct}>
                          <button
                            className={styles.subItemBtn}
                            onClick={() => {
                              setAddingParentId(eq.id);
                              setShowAddModal(true);
                            }}
                            title="Add spare / accessory"
                            style={{ marginRight: 4 }}
                          >
                            🔗+
                          </button>
                          <button
                            className={styles.removeBtn}
                            onClick={() => setEditingItem(eq)}
                            title="Edit group / sub-group"
                            style={{ marginRight: 4 }}
                          >
                            ✏️
                          </button>
                          <button
                            className={styles.removeBtn}
                            onClick={() => handleRemoveEquipment(eq.id)}
                          >
                            🗑
                          </button>
                        </span>
                      </div>
                      {children.length > 0 && (
                        <div
                          className={`${styles.listRow} ${styles.listRowToggle}`}
                          onClick={() => handleToggleSubItems(eq.id)}
                          style={{ cursor: "pointer", userSelect: "none" }}
                        >
                          <span className={styles.listColImg}></span>
                          <span
                            className={styles.listColPN}
                            style={{ fontWeight: 600, fontSize: 11 }}
                          >
                            {expandedSubItems.has(eq.id) ? "▾" : "▸"} Sub-items
                            ({children.length})
                          </span>
                          <span className={styles.listColDesc}></span>
                          <span className={styles.listColNotes}></span>
                          <span className={styles.listColSrc}></span>
                          <span className={styles.listColAct}></span>
                        </div>
                      )}
                      {expandedSubItems.has(eq.id) &&
                        children.map((child) => {
                          const cSrc = sourceLabel(child.dataSource);
                          const cPhoto =
                            child.pictureUrl || getPhotoUrl(child.partNumber);
                          return (
                            <div
                              key={child.id}
                              className={`${styles.listRow} ${styles.listRowChild}`}
                            >
                              <span className={styles.listColImg}>
                                {cPhoto ? (
                                  <img
                                    key={cPhoto}
                                    src={cPhoto}
                                    alt=""
                                    className={styles.listThumb}
                                    style={{ cursor: "zoom-in" }}
                                    onClick={() => setPreviewPhotoUrl(cPhoto)}
                                    onError={(e) => {
                                      (
                                        e.target as HTMLImageElement
                                      ).style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <span className={styles.listThumbPlaceholder}>
                                    📷
                                  </span>
                                )}
                              </span>
                              <span className={styles.listColPN}>
                                └ {child.partNumber}
                              </span>
                              <span className={styles.listColDesc}>
                                {child.description}
                              </span>
                              <span className={styles.listColNotes}>
                                {child.notes || "—"}
                              </span>
                              <span className={styles.listColSrc}>
                                <span
                                  className={`${styles.srcBadge} ${cSrc.cls}`}
                                >
                                  {cSrc.text}
                                </span>
                              </span>
                              <span className={styles.listColAct}>
                                <button
                                  className={styles.removeBtn}
                                  onClick={() => setEditingItem(child)}
                                  title="Edit"
                                  style={{ marginRight: 4 }}
                                >
                                  ✏️
                                </button>
                                <button
                                  className={styles.removeBtn}
                                  onClick={() =>
                                    handleRemoveEquipment(child.id)
                                  }
                                >
                                  🗑
                                </button>
                              </span>
                            </div>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {showAddModal && <AddEquipmentModal />}
      {showManageGroups && <ManageGroupsModal />}
      {editingItem && (
        <EditEquipmentModal
          item={editingItem}
          groups={groups}
          onCancel={() => setEditingItem(null)}
          onSave={async (updated) => {
            await updateEquipment(updated);
            setEditingItem(null);
          }}
        />
      )}
      {previewPhotoUrl && (
        <PhotoLightbox
          url={previewPhotoUrl}
          onClose={() => setPreviewPhotoUrl(null)}
        />
      )}
    </div>
  );
};

/* ─── Star SVG helper ─── */
const StarIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/* ─── Edit Equipment Modal ─── */
interface EditEquipmentModalProps {
  item: IFavoriteEquipment;
  groups: {
    id: string;
    name: string;
    subGroups: { id: string; name: string }[];
  }[];
  onSave: (updated: IFavoriteEquipment) => Promise<void>;
  onCancel: () => void;
}

const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({
  item,
  groups,
  onSave,
  onCancel,
}) => {
  const [groupId, setGroupId] = React.useState(item.groupId);
  const [subGroupId, setSubGroupId] = React.useState(item.subGroupId);
  const [pn, setPn] = React.useState(item.partNumber);
  const [desc, setDesc] = React.useState(item.description);
  const [notes, setNotes] = React.useState(item.notes || "");
  const [saving, setSaving] = React.useState(false);

  const selectedGroupObj = groups.find((g) => g.id === groupId);

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    try {
      await onSave({
        ...item,
        groupId,
        subGroupId,
        partNumber: pn.trim(),
        description: desc.trim(),
        notes: notes.trim(),
        pictureUrl: getPhotoUrl(pn.trim()),
        lastModified: new Date().toISOString(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Edit Equipment</h3>
          <button className={styles.closeBtn} onClick={onCancel}>
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Group</label>
            <select
              className={styles.formSelect}
              value={groupId}
              onChange={(e) => {
                setGroupId(e.target.value);
                setSubGroupId("");
              }}
            >
              <option value="">— Select Group —</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {selectedGroupObj && selectedGroupObj.subGroups.length > 0 && (
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Sub-Group</label>
              <select
                className={styles.formSelect}
                value={subGroupId}
                onChange={(e) => setSubGroupId(e.target.value)}
              >
                <option value="">— None —</option>
                {selectedGroupObj.subGroups.map((sg) => (
                  <option key={sg.id} value={sg.id}>
                    {sg.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.formRow}>
            <label className={styles.formLabel}>Part Number</label>
            <input
              className={styles.formInput}
              value={pn}
              onChange={(e) => setPn(e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.formLabel}>Description</label>
            <input
              className={styles.formInput}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.formLabel}>Notes</label>
            <textarea
              className={styles.formTextarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving || !groupId}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
