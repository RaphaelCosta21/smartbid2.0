/**
 * AddFavoriteEquipmentModal — builds a list of equipment across several
 * Group / Sub-Group destinations (or sub-items of one parent) and saves it
 * to Favorites in a single write. Duplicate part numbers are blocked.
 */
import * as React from "react";
import {
  Check,
  Database,
  FolderTree,
  ImageOff,
  Link2,
  ListPlus,
  LoaderCircle,
  Lock,
  PenLine,
  Plus,
  Search,
  Star,
  StickyNote,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import styles from "./AddFavoriteEquipmentModal.module.scss";
import { EquipmentImportModal, IImportPick } from "../bid/EquipmentImportModal";
import { PartNumberAutocomplete } from "../common/PartNumberAutocomplete";
import { PhotoLightbox } from "../common/PhotoLightbox";
import { EmptyState } from "../common/EmptyState";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import { useQueryCatalogStore } from "../../stores/useQueryCatalogStore";
import { useUIStore } from "../../stores/useUIStore";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  FavoriteDataSource,
  IFavoriteEquipment,
  IFavoriteGroup,
} from "../../models";
import { makeId } from "../../utils/idGenerator";
import { getPartPhotoUrl } from "../../utils/partPhoto";

export interface AddFavoriteEquipmentModalProps {
  /** Favorite groups, already sorted */
  groups: IFavoriteGroup[];
  /** Current favorites (duplicate checks) */
  equipment: IFavoriteEquipment[];
  /** When set, every item is added as a spare / accessory of this one */
  parentItem?: IFavoriteEquipment | null;
  initialGroupId?: string | null;
  initialSubGroupId?: string | null;
  onClose: () => void;
}

type AddMode = "catalog" | "manual";

interface IStagedItem {
  key: string;
  groupId: string;
  subGroupId: string;
  partNumber: string;
  description: string;
  mfgId: string;
  mfgItmId: string;
  notes: string;
  dataSource: FavoriteDataSource;
}

interface ICandidate {
  pn: string;
  desc: string;
  source: FavoriteDataSource;
}

interface ISection {
  key: string;
  groupId: string;
  subGroupId: string;
  items: IStagedItem[];
}

const NOTE_MAX = 500;

const normPn = (pn: string): string => (pn || "").trim().toUpperCase();
const normDesc = (desc: string): string => (desc || "").trim().toLowerCase();
const destKey = (groupId: string, subGroupId: string): string =>
  `${groupId}|${subGroupId}`;
const plural = (n: number, word: string): string =>
  `${n} ${word}${n === 1 ? "" : "s"}`;

const PartThumb: React.FC<{
  partNumber: string;
  onOpen: (url: string) => void;
}> = ({ partNumber, onOpen }) => {
  const [failed, setFailed] = React.useState(false);
  const url = getPartPhotoUrl(partNumber);
  if (!url || failed) {
    return (
      <span className={styles.thumbPlaceholder} aria-hidden="true">
        <ImageOff size={14} />
      </span>
    );
  }
  return (
    <img
      className={styles.thumb}
      src={url}
      alt=""
      title="Click to enlarge"
      onClick={() => onOpen(url)}
      onError={() => setFailed(true)}
    />
  );
};

export const AddFavoriteEquipmentModal: React.FC<
  AddFavoriteEquipmentModalProps
> = ({
  groups,
  equipment,
  parentItem,
  initialGroupId,
  initialSubGroupId,
  onClose,
}) => {
  const addEquipmentMany = useFavoritesStore((s) => s.addEquipmentMany);
  const searchCatalogByPN = useQueryCatalogStore((s) => s.searchByPN);
  const catalogLoading = useQueryCatalogStore((s) => s.isLoading);
  const addToast = useUIStore((s) => s.addToast);
  const currentUser = useCurrentUser();

  const [groupId, setGroupId] = React.useState<string>(() => {
    if (parentItem) return parentItem.groupId;
    if (initialGroupId) return initialGroupId;
    return groups.length === 1 ? groups[0].id : "";
  });
  const [subGroupId, setSubGroupId] = React.useState<string>(() =>
    parentItem ? parentItem.subGroupId : initialSubGroupId || "",
  );
  const [mode, setMode] = React.useState<AddMode>("catalog");
  const [search, setSearch] = React.useState("");
  const [manualPn, setManualPn] = React.useState("");
  const [manualDesc, setManualDesc] = React.useState("");
  const [addError, setAddError] = React.useState<string | null>(null);
  const [staged, setStaged] = React.useState<IStagedItem[]>([]);
  const [openNotes, setOpenNotes] = React.useState<Record<string, boolean>>(
    {},
  );
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const manualPnRef = React.useRef<HTMLInputElement>(null);
  const overlayPressRef = React.useRef(false);

  const groupById = React.useMemo(() => {
    const map = new Map<string, IFavoriteGroup>();
    groups.forEach((g) => map.set(g.id, g));
    return map;
  }, [groups]);

  const destLabel = (gId: string, sgId: string): string => {
    const g = groupById.get(gId);
    if (!g) return "-";
    const sg = g.subGroups.filter((s) => s.id === sgId)[0];
    return sg ? `${g.name} › ${sg.name}` : g.name;
  };

  const currentGroup = groupById.get(groupId);
  const needsSubGroup = !!currentGroup && currentGroup.subGroups.length > 0;
  const destReady =
    !!parentItem || (!!currentGroup && (!needsSubGroup || !!subGroupId));
  const currentKey = destKey(groupId, subGroupId);
  const parentLabel = parentItem
    ? parentItem.partNumber || parentItem.description
    : "";

  const existingByPn = React.useMemo(() => {
    const map = new Map<string, IFavoriteEquipment>();
    equipment.forEach((e) => {
      const k = normPn(e.partNumber);
      if (k && !map.has(k)) map.set(k, e);
    });
    return map;
  }, [equipment]);

  const siblings = React.useMemo(
    () =>
      parentItem ? equipment.filter((e) => e.parentId === parentItem.id) : [],
    [equipment, parentItem],
  );

  const destExistingCount = parentItem
    ? siblings.length
    : equipment.filter(
        (e) =>
          !e.parentId &&
          e.groupId === groupId &&
          (!needsSubGroup || e.subGroupId === subGroupId),
      ).length;

  /** Why a PN / description can't be added (duplicates are blocked) */
  const findBlock = (
    pn: string,
    desc: string,
    gId: string,
    sgId: string,
    pending: IStagedItem[],
  ): string | undefined => {
    const pnKey = normPn(pn);
    if (pnKey) {
      const inList = pending.filter((s) => normPn(s.partNumber) === pnKey)[0];
      if (inList) {
        return parentItem
          ? "Already in the list"
          : `Already in the list: ${destLabel(inList.groupId, inList.subGroupId)}`;
      }
      if (parentItem) {
        if (normPn(parentItem.partNumber) === pnKey)
          return "This is the parent item itself";
        return siblings.some((e) => normPn(e.partNumber) === pnKey)
          ? `Already a sub-item of ${parentLabel}`
          : undefined;
      }
      const existing = existingByPn.get(pnKey);
      if (!existing) return undefined;
      return `Already in Favorites: ${destLabel(existing.groupId, existing.subGroupId)}${existing.parentId ? " (as sub-item)" : ""}`;
    }

    const descKey = normDesc(desc);
    if (!descKey) return "Enter a part number or a description";
    const sameDesc = (e: { partNumber: string; description: string }): boolean =>
      !normPn(e.partNumber) && normDesc(e.description) === descKey;
    const sameDest = (e: { groupId: string; subGroupId: string }): boolean =>
      e.groupId === gId && e.subGroupId === sgId;
    if (pending.some((s) => sameDest(s) && sameDesc(s)))
      return "Already in the list";
    const pool = parentItem
      ? siblings
      : equipment.filter((e) => !e.parentId && sameDest(e));
    return pool.some(sameDesc) ? "Already in Favorites" : undefined;
  };

  const lookupMfg = (pn: string): { mfgId: string; mfgItmId: string } => {
    const hit = pn ? searchCatalogByPN(pn, 1)[0] : undefined;
    return hit && normPn(hit.pn) === normPn(pn)
      ? { mfgId: hit.mfgId || "", mfgItmId: hit.mfgItmId || "" }
      : { mfgId: "", mfgItmId: "" };
  };

  /** Adds candidates to the current destination; returns the reasons of the blocked ones */
  const stage = (candidates: ICandidate[]): string[] => {
    if (!destReady) return ["Choose a destination first"];
    const added: IStagedItem[] = [];
    const blocked: string[] = [];
    candidates.forEach((c) => {
      const pn = c.pn.trim();
      const desc = c.desc.trim();
      const reason = findBlock(
        pn,
        desc,
        groupId,
        subGroupId,
        staged.concat(added),
      );
      if (reason) {
        blocked.push(reason);
        return;
      }
      const mfg =
        c.source === "query" ? lookupMfg(pn) : { mfgId: "", mfgItmId: "" };
      added.push({
        key: makeId("stg"),
        groupId,
        subGroupId,
        partNumber: pn,
        description: desc,
        mfgId: mfg.mfgId,
        mfgItmId: mfg.mfgItmId,
        notes: "",
        dataSource: c.source,
      });
    });
    if (added.length > 0) setStaged((prev) => prev.concat(added));
    return blocked;
  };

  const handleCatalogSelect = (pn: string, desc: string): void => {
    const blocked = stage([{ pn, desc, source: "query" }]);
    if (blocked.length > 0) {
      setSearch(pn);
      setAddError(`${pn || desc}: ${blocked[0]}`);
      return;
    }
    setSearch("");
    setAddError(null);
  };

  const canAddManual =
    destReady && (!!manualPn.trim() || !!manualDesc.trim());

  const handleManualAdd = (): void => {
    if (!canAddManual) return;
    const blocked = stage([
      { pn: manualPn, desc: manualDesc, source: "manual" },
    ]);
    if (blocked.length > 0) {
      setAddError(blocked[0]);
      return;
    }
    setManualPn("");
    setManualDesc("");
    setAddError(null);
    if (manualPnRef.current) manualPnRef.current.focus();
  };

  const handleManualKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    handleManualAdd();
  };

  const handleAdvancedConfirm = (picks: IImportPick[]): void => {
    const blocked = stage(
      picks.map(
        (p): ICandidate => ({
          pn: p.partNumber,
          desc: p.description,
          source: "query",
        }),
      ),
    );
    setShowAdvanced(false);
    setAddError(null);
    if (blocked.length > 0) {
      addToast({
        type: "warning",
        title: `${plural(blocked.length, "item")} skipped`,
        message: "They are already in Favorites or in the list.",
      });
    }
  };

  const switchMode = (next: AddMode): void => {
    setMode(next);
    setAddError(null);
  };

  const changeDestination = (gId: string, sgId: string): void => {
    setGroupId(gId);
    setSubGroupId(sgId);
    setAddError(null);
  };

  const sections = React.useMemo<ISection[]>(() => {
    const list: ISection[] = [];
    const byKey = new Map<string, ISection>();
    staged.forEach((s) => {
      const k = destKey(s.groupId, s.subGroupId);
      let sec = byKey.get(k);
      if (!sec) {
        sec = { key: k, groupId: s.groupId, subGroupId: s.subGroupId, items: [] };
        byKey.set(k, sec);
        list.push(sec);
      }
      sec.items.push(s);
    });
    return list;
  }, [staged]);

  const removeItem = (key: string): void =>
    setStaged((prev) => prev.filter((s) => s.key !== key));
  const removeSection = (secKey: string): void =>
    setStaged((prev) =>
      prev.filter((s) => destKey(s.groupId, s.subGroupId) !== secKey),
    );
  const setNote = (key: string, notes: string): void =>
    setStaged((prev) => prev.map((s) => (s.key === key ? { ...s, notes } : s)));
  const toggleNote = (key: string): void =>
    setOpenNotes((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async (): Promise<void> => {
    if (staged.length === 0 || saving) return;
    const now = new Date().toISOString();
    const items: IFavoriteEquipment[] = staged.map((s) => ({
      id: makeId("fav"),
      groupId: s.groupId,
      subGroupId: s.subGroupId,
      partNumber: s.partNumber,
      description: s.description,
      pictureUrl: getPartPhotoUrl(s.partNumber),
      notes: s.notes.trim(),
      dataSource: s.dataSource,
      mfgId: s.mfgId || undefined,
      mfgItmId: s.mfgItmId || undefined,
      parentId: parentItem ? parentItem.id : undefined,
      createdBy: currentUser?.displayName || "",
      createdDate: now,
      lastModified: now,
    }));
    setSaving(true);
    try {
      await addEquipmentMany(items);
      addToast({
        type: "success",
        title: `${plural(items.length, parentItem ? "sub-item" : "item")} added to Favorites`,
      });
      onClose();
    } catch (err) {
      console.error("Failed to add favorites:", err);
      addToast({
        type: "error",
        title: "Could not save Favorites",
        message: "Nothing was added. Please try again.",
      });
      setSaving(false);
    }
  };

  const requestClose = (): void => {
    if (saving) return;
    if (
      staged.length > 0 &&
      !window.confirm(
        `Discard ${plural(staged.length, "item")} not added to Favorites yet?`,
      )
    )
      return;
    onClose();
  };

  // Mount-once listener so it runs before Advanced Search's own Escape handler
  const requestCloseRef = React.useRef(requestClose);
  requestCloseRef.current = requestClose;
  const searchRef = React.useRef("");
  searchRef.current = mode === "catalog" ? search : "";
  const layerOpenRef = React.useRef(false);
  layerOpenRef.current = showAdvanced || !!previewUrl;
  React.useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key !== "Escape" || layerOpenRef.current) return;
      if (searchRef.current) {
        setSearch("");
        return;
      }
      requestCloseRef.current();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const total = staged.length;
  const itemWord = parentItem ? "sub-item" : "item";

  return (
    <>
      <div
        className={styles.overlay}
        onMouseDown={(e) => {
          overlayPressRef.current = e.target === e.currentTarget;
        }}
        onClick={(e) => {
          if (overlayPressRef.current && e.target === e.currentTarget)
            requestClose();
        }}
      >
        <div
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-fav-equipment-title"
        >
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerMain}>
              <span className={styles.headerIcon}>
                {parentItem ? <Link2 /> : <Star />}
              </span>
              <div className={styles.headerText}>
                <div className={styles.titleRow}>
                  <h2 id="add-fav-equipment-title" className={styles.title}>
                    {parentItem
                      ? "Add Sub-Items (Spares / Accessories)"
                      : "Add Equipment to Favorites"}
                  </h2>
                  <span className={styles.headerBadge}>Multi-select</span>
                </div>
                <p className={styles.subtitle}>
                  {parentItem
                    ? `Everything in the list becomes a spare or accessory of ${parentLabel}.`
                    : "Build a list across groups and sub-groups, then add everything to Favorites at once."}
                </p>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={requestClose}
              title="Close"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className={styles.body}>
            {/* Left: destination + finder */}
            <div className={styles.composer}>
              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <span className={styles.stepBadge}>1</span>
                  <span className={styles.panelTitle}>
                    {parentItem ? "Parent item" : "Destination"}
                  </span>
                  {destReady && (
                    <span className={styles.panelMeta}>
                      {parentItem
                        ? plural(destExistingCount, "sub-item")
                        : `${destExistingCount} in Favorites`}
                    </span>
                  )}
                </div>

                {parentItem ? (
                  <div className={styles.parentCard}>
                    <PartThumb
                      partNumber={parentItem.partNumber}
                      onOpen={setPreviewUrl}
                    />
                    <div className={styles.parentInfo}>
                      <span className={styles.itemPn}>
                        {parentItem.partNumber || "-"}
                      </span>
                      <span className={styles.parentDesc}>
                        {parentItem.description || "-"}
                      </span>
                      <span className={styles.parentPath}>
                        <Lock size={11} />
                        {destLabel(parentItem.groupId, parentItem.subGroupId)}
                      </span>
                    </div>
                  </div>
                ) : groups.length === 0 ? (
                  <p className={styles.helper}>
                    No favorite groups yet. Groups are managed in System
                    Configuration.
                  </p>
                ) : (
                  <>
                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>Group</span>
                      <select
                        className={styles.select}
                        value={groupId}
                        disabled={saving}
                        onChange={(e) => changeDestination(e.target.value, "")}
                      >
                        <option value="">Select a group...</option>
                        {groups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    {currentGroup && needsSubGroup && (
                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>Sub-Group</span>
                        <select
                          className={styles.select}
                          value={subGroupId}
                          disabled={saving}
                          onChange={(e) =>
                            changeDestination(groupId, e.target.value)
                          }
                        >
                          <option value="">Select a sub-group...</option>
                          {currentGroup.subGroups.map((sg) => (
                            <option key={sg.id} value={sg.id}>
                              {sg.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </>
                )}
              </section>

              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <span className={styles.stepBadge}>2</span>
                  <span className={styles.panelTitle}>Find items</span>
                </div>

                <div
                  className={styles.segmented}
                  role="tablist"
                  aria-label="How to add items"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "catalog"}
                    className={`${styles.segBtn}${mode === "catalog" ? ` ${styles.segBtnActive}` : ""}`}
                    onClick={() => switchMode("catalog")}
                  >
                    <Search size={13} />
                    Catalog
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "manual"}
                    className={`${styles.segBtn}${mode === "manual" ? ` ${styles.segBtnActive}` : ""}`}
                    onClick={() => switchMode("manual")}
                  >
                    <PenLine size={13} />
                    Manual
                  </button>
                </div>

                <fieldset
                  className={styles.fieldset}
                  disabled={!destReady || saving}
                >
                  {mode === "catalog" ? (
                    <>
                      <div className={styles.searchBox}>
                        <Search size={14} className={styles.searchIcon} />
                        <PartNumberAutocomplete
                          value={search}
                          searchField="both"
                          mono
                          autoFocus={destReady}
                          placeholder="Part number or description..."
                          sourcesFilter={["query"]}
                          onChange={(v) => {
                            setSearch(v);
                            setAddError(null);
                          }}
                          onSelect={handleCatalogSelect}
                        />
                      </div>
                      <p className={styles.helper}>
                        Pick a result to add it to the list, then keep
                        searching to add more.
                      </p>
                      <button
                        type="button"
                        className={styles.advancedBtn}
                        onClick={() => setShowAdvanced(true)}
                      >
                        <Database size={14} />
                        Advanced Search
                        <span className={styles.advancedTag}>
                          Multi-select
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>Part Number</span>
                        <input
                          ref={manualPnRef}
                          className={`${styles.input} ${styles.monoInput}`}
                          value={manualPn}
                          autoFocus
                          placeholder="Enter part number..."
                          onChange={(e) => {
                            setManualPn(e.target.value);
                            setAddError(null);
                          }}
                          onKeyDown={handleManualKeyDown}
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>Description</span>
                        <input
                          className={styles.input}
                          value={manualDesc}
                          placeholder="Enter description..."
                          onChange={(e) => {
                            setManualDesc(e.target.value);
                            setAddError(null);
                          }}
                          onKeyDown={handleManualKeyDown}
                        />
                      </label>
                      <button
                        type="button"
                        className={styles.addBtn}
                        disabled={!canAddManual}
                        onClick={handleManualAdd}
                      >
                        <Plus size={14} />
                        Add to list
                      </button>
                    </>
                  )}
                </fieldset>

                {!destReady && groups.length > 0 && (
                  <p className={styles.lockedHint}>
                    <Lock size={12} />
                    Choose a group{needsSubGroup ? " and sub-group" : ""} first.
                  </p>
                )}
                {addError && (
                  <div className={styles.addError} role="alert">
                    <TriangleAlert size={14} />
                    <span>{addError}</span>
                  </div>
                )}
                {mode === "catalog" && catalogLoading && (
                  <div className={styles.loadingNote}>
                    <LoaderCircle size={13} className={styles.spin} />
                    Loading Query catalog...
                  </div>
                )}
              </section>
            </div>

            {/* Right: list to add */}
            <section className={styles.listPane} aria-label="Items to add">
              <div className={styles.listHead}>
                <span className={styles.stepBadge}>3</span>
                <span className={styles.panelTitle}>Items to add</span>
                <span className={styles.countPill}>{total}</span>
                <span className={styles.grow} />
                {total > 0 && (
                  <button
                    type="button"
                    className={`${styles.linkBtn} ${styles.linkBtnDanger}`}
                    onClick={() => setStaged([])}
                    disabled={saving}
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className={styles.listBody}>
                {total === 0 ? (
                  <EmptyState
                    className={styles.emptyState}
                    icon={
                      <span className={styles.emptyIcon}>
                        <ListPlus />
                      </span>
                    }
                    title="No items yet"
                    description={
                      parentItem
                        ? "Search the catalog or type a part number to add spares and accessories."
                        : "Pick a destination, then search the catalog or type a part number. You can mix several groups and sub-groups before saving."
                    }
                  />
                ) : (
                  sections.map((sec) => {
                    const isCurrent = !parentItem && sec.key === currentKey;
                    return (
                      <div
                        key={sec.key}
                        className={`${styles.section}${isCurrent ? ` ${styles.sectionCurrent}` : ""}`}
                      >
                        <div className={styles.sectionHead}>
                          <FolderTree size={14} className={styles.sectionIcon} />
                          <span className={styles.sectionPath}>
                            {parentItem
                              ? `Sub-items of ${parentLabel}`
                              : destLabel(sec.groupId, sec.subGroupId)}
                          </span>
                          <span className={styles.sectionCount}>
                            {sec.items.length}
                          </span>
                          {isCurrent ? (
                            <span className={styles.currentTag}>
                              Adding here
                            </span>
                          ) : (
                            !parentItem && (
                              <button
                                type="button"
                                className={styles.linkBtn}
                                onClick={() =>
                                  changeDestination(sec.groupId, sec.subGroupId)
                                }
                                disabled={saving}
                              >
                                Add more here
                              </button>
                            )
                          )}
                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                            onClick={() => removeSection(sec.key)}
                            disabled={saving}
                            title="Remove these items from the list"
                            aria-label="Remove these items from the list"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <ul className={styles.itemList}>
                          {sec.items.map((item) => {
                            const noteOpen = !!openNotes[item.key];
                            return (
                              <li key={item.key} className={styles.item}>
                                <div className={styles.itemMain}>
                                  <PartThumb
                                    partNumber={item.partNumber}
                                    onOpen={setPreviewUrl}
                                  />
                                  <div className={styles.itemText}>
                                    <div className={styles.itemTop}>
                                      <span
                                        className={`${styles.itemPn}${item.partNumber ? "" : ` ${styles.itemPnEmpty}`}`}
                                      >
                                        {item.partNumber || "No part number"}
                                      </span>
                                      <span
                                        className={`${styles.srcBadge} ${item.dataSource === "query" ? styles.srcQuery : styles.srcManual}`}
                                      >
                                        {item.dataSource === "query"
                                          ? "Query"
                                          : "Manual"}
                                      </span>
                                    </div>
                                    <div
                                      className={styles.itemDesc}
                                      title={item.description}
                                    >
                                      {item.description || "-"}
                                    </div>
                                    {(item.mfgId || item.mfgItmId) && (
                                      <div className={styles.itemMeta}>
                                        {item.mfgId && (
                                          <span className={styles.metaChip}>
                                            Mfg {item.mfgId}
                                          </span>
                                        )}
                                        {item.mfgItmId && (
                                          <span className={styles.metaChip}>
                                            Ref {item.mfgItmId}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className={styles.itemActions}>
                                    <button
                                      type="button"
                                      className={`${styles.iconBtn}${item.notes ? ` ${styles.iconBtnActive}` : ""}`}
                                      onClick={() => toggleNote(item.key)}
                                      disabled={saving}
                                      title={
                                        noteOpen
                                          ? "Hide note"
                                          : item.notes
                                            ? "Edit note"
                                            : "Add note"
                                      }
                                      aria-label={
                                        item.notes ? "Edit note" : "Add note"
                                      }
                                      aria-expanded={noteOpen}
                                    >
                                      <StickyNote size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                                      onClick={() => removeItem(item.key)}
                                      disabled={saving}
                                      title="Remove from list"
                                      aria-label={`Remove ${item.partNumber || item.description}`}
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </div>
                                {noteOpen ? (
                                  <input
                                    className={styles.noteInput}
                                    value={item.notes}
                                    maxLength={NOTE_MAX}
                                    placeholder="Note (optional)"
                                    autoFocus
                                    disabled={saving}
                                    onChange={(e) =>
                                      setNote(item.key, e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        toggleNote(item.key);
                                    }}
                                    aria-label={`Note for ${item.partNumber || item.description}`}
                                  />
                                ) : (
                                  item.notes && (
                                    <button
                                      type="button"
                                      className={styles.notePreview}
                                      onClick={() => toggleNote(item.key)}
                                      title="Edit note"
                                    >
                                      {item.notes}
                                    </button>
                                  )
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.footerInfo}>
              {total > 0 ? (
                <>
                  <span className={styles.footerCount}>
                    {plural(total, itemWord)}
                  </span>
                  {!parentItem && (
                    <span className={styles.footerMuted}>
                      in {plural(sections.length, "destination")}
                    </span>
                  )}
                </>
              ) : (
                <span className={styles.footerMuted}>
                  Everything in the list is saved together when you confirm.
                </span>
              )}
            </div>
            <div className={styles.footerBtns}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={requestClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmBtn}
                onClick={handleSave}
                disabled={total === 0 || saving}
              >
                {saving ? (
                  <LoaderCircle size={14} className={styles.spin} />
                ) : (
                  <Check size={14} />
                )}
                <span>
                  {saving
                    ? "Saving..."
                    : total > 0
                      ? `Add ${plural(total, itemWord)}`
                      : "Add to Favorites"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAdvanced && (
        <EquipmentImportModal
          multiSelect
          tabs={["query"]}
          title="Advanced Catalog Search"
          subtitle={`Tick the items to add to ${parentItem ? `the sub-items of ${parentLabel}` : destLabel(groupId, subGroupId)}. Items already in Favorites or in the list are locked.`}
          getPickBlockReason={(pn, desc) =>
            findBlock(pn, desc, groupId, subGroupId, staged)
          }
          onSelectMany={handleAdvancedConfirm}
          onClose={() => setShowAdvanced(false)}
        />
      )}
      {previewUrl && (
        <PhotoLightbox url={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}
    </>
  );
};
