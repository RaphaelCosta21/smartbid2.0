import * as React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, LayoutList, Search, X } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { DivisionBadge } from "../components/common/DivisionBadge";
import { EmptyState } from "../components/common/EmptyState";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { PhotoLightbox } from "../components/common/PhotoLightbox";
import { CollapsibleSidebar } from "../components/common/CollapsibleSidebar";
import { AddFavoriteEquipmentModal } from "../components/favorites/AddFavoriteEquipmentModal";
import {
  MultiSelectDropdown,
  MultiSelectOption,
} from "../components/insights/MultiSelectDropdown";
import { BidFavoriteButton } from "../components/bid/BidFavoriteButton";
import { PastBidCard } from "../components/knowledge/PastBidCard";
import {
  PastBidChips,
  PastBidKbBadge,
  PastBidOutcome,
} from "../components/knowledge/PastBidBadges";
import { useBids } from "../hooks/useBids";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import { useConfigStore } from "../stores/useConfigStore";
import { useSlidingIndicator } from "../hooks/useSlidingIndicator";
import { usePageAccess } from "../hooks/usePageAccess";
import { IBid, IFavoriteBid, IFavoriteEquipment } from "../models";
import { getPartPhotoUrl as getPhotoUrl } from "../utils/partPhoto";
import { formatDate } from "../utils/formatters";
import { countFacets, withCounts } from "../utils/facetHelpers";
import {
  IPastBidRow,
  matchesAnyOf,
  matchesPastBidSearch,
  toFilterOptions,
  toPastBidRow,
} from "../utils/pastBidHelpers";
import { ROUTES } from "../config/routes.config";
import styles from "./FavoritesPage.module.scss";

type TabKey = "bids" | "equipment";
type ViewMode = "grid" | "list";

interface IFavoriteBidRow extends IPastBidRow {
  addedBy: string;
  addedDate: string;
}

type BidFilterKey =
  | "categories"
  | "tags"
  | "divisions"
  | "serviceLines"
  | "clients"
  | "outcomes"
  | "years";

const BID_FILTERS: {
  key: BidFilterKey;
  label: string;
  pick: (r: IPastBidRow) => string[];
  descending?: boolean;
}[] = [
  { key: "categories", label: "Scope", pick: (r) => r.categories },
  { key: "tags", label: "Tags", pick: (r) => r.tags },
  { key: "divisions", label: "Division", pick: (r) => [r.division] },
  { key: "serviceLines", label: "Service Line", pick: (r) => [r.serviceLine] },
  { key: "clients", label: "Client", pick: (r) => [r.client] },
  { key: "outcomes", label: "Outcome", pick: (r) => [r.outcome] },
  { key: "years", label: "Year", pick: (r) => [r.year], descending: true },
];

const BID_FACET_VALUES = {} as Record<
  BidFilterKey,
  (r: IPastBidRow) => string[]
>;
BID_FILTERS.forEach((f) => {
  BID_FACET_VALUES[f.key] = f.pick;
});

const EMPTY_BID_FILTERS: Record<BidFilterKey, string[]> = {
  categories: [],
  tags: [],
  divisions: [],
  serviceLines: [],
  clients: [],
  outcomes: [],
  years: [],
};

const BID_VIEW_OPTIONS: {
  mode: ViewMode;
  label: string;
  icon: React.ReactNode;
}[] = [
  { mode: "grid", label: "Cards", icon: <LayoutGrid size={14} /> },
  { mode: "list", label: "List", icon: <LayoutList size={14} /> },
];

const MAX_LIST_TAGS = 3;

function favoriteNote(r: IFavoriteBidRow): string {
  const date = r.addedDate ? formatDate(r.addedDate) : "";
  if (!r.addedBy) return date ? `Added ${date}` : "";
  return date ? `Added by ${r.addedBy} · ${date}` : `Added by ${r.addedBy}`;
}

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { bids, isLoading: bidsLoading } = useBids();
  const { canEdit } = usePageAccess();

  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
  const favData = useFavoritesStore((s) => s.data);
  const isLoading = useFavoritesStore((s) => s.isLoading);
  const isLoaded = useFavoritesStore((s) => s.isLoaded);
  const updateEquipment = useFavoritesStore((s) => s.updateEquipment);
  const removeEquipment = useFavoritesStore((s) => s.removeEquipment);

  // Groups now come from System Configuration (read-only here)
  // Fall back to favorites data groups during migration
  const sysConfig = useConfigStore((s) => s.config);
  const configGroups = sysConfig?.favoriteGroups || [];
  const favGroups = favData?.groups || [];

  const [activeTab, setActiveTab] = React.useState<TabKey>("equipment");
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const [bidViewMode, setBidViewMode] = React.useState<ViewMode>("grid");
  const [bidSearch, setBidSearch] = React.useState("");
  const [bidFilters, setBidFilters] =
    React.useState<Record<BidFilterKey, string[]>>(EMPTY_BID_FILTERS);
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);
  const [selectedSubGroup, setSelectedSubGroup] = React.useState<string | null>(
    null,
  );
  const [catalogSidebarCollapsed, setCatalogSidebarCollapsed] =
    React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [addingParentId, setAddingParentId] = React.useState<string | null>(
    null,
  );
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

  const equipment = favData?.equipment || [];
  const favBids = favData?.bids || [];

  // Groups come from System Configuration; fall back to favorites data during migration
  const groups = React.useMemo(() => {
    const source = configGroups.length > 0 ? configGroups : favGroups;
    return source
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((g) => ({
        ...g,
        subGroups: g.subGroups
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [configGroups, favGroups]);

  // Resolve BID favorites to full IBid objects
  const favBidNumbers = React.useMemo(
    () => new Set(favBids.map((f) => f.bidNumber)),
    [favBids],
  );
  const favoriteBidList = React.useMemo(
    () => bids.filter((b) => favBidNumbers.has(b.bidNumber)),
    [bids, favBidNumbers],
  );

  // Most recently favorited first
  const favRows = React.useMemo<IFavoriteBidRow[]>(() => {
    const byNumber: Record<string, IFavoriteBid> = {};
    favBids.forEach((f) => {
      byNumber[f.bidNumber] = f;
    });
    return favoriteBidList
      .map((b) => ({
        ...toPastBidRow(b),
        addedBy: byNumber[b.bidNumber]?.addedBy || "",
        addedDate: byNumber[b.bidNumber]?.addedDate || "",
      }))
      .sort((a, b) => b.addedDate.localeCompare(a.addedDate));
  }, [favoriteBidList, favBids]);

  // `skip` lets a dropdown count against the other filters
  const passesBidFilters = React.useCallback(
    (r: IPastBidRow, skip?: BidFilterKey): boolean =>
      BID_FILTERS.every(
        (f) => f.key === skip || matchesAnyOf(bidFilters[f.key], f.pick(r)),
      ) &&
      (!bidSearch.trim() || matchesPastBidSearch(r.searchText, bidSearch)),
    [bidFilters, bidSearch],
  );

  const bidFilterOptions = React.useMemo(() => {
    const counts = countFacets(favRows, BID_FACET_VALUES, passesBidFilters);
    const out = {} as Record<BidFilterKey, MultiSelectOption[]>;
    BID_FILTERS.forEach((f) => {
      const values: string[] = [];
      favRows.forEach((r) => f.pick(r).forEach((v) => v && values.push(v)));
      out[f.key] = withCounts(
        toFilterOptions(values, f.descending),
        counts[f.key],
      );
    });
    return out;
  }, [favRows, passesBidFilters]);

  const filteredFavRows = React.useMemo(
    () => favRows.filter((r) => passesBidFilters(r)),
    [favRows, passesBidFilters],
  );

  const hasBidFilters =
    !!bidSearch.trim() || BID_FILTERS.some((f) => bidFilters[f.key].length > 0);

  // Toggle only mounts on the BID tab with rows; key change re-measures on mount
  const bidViewIndicator = useSlidingIndicator(
    `${activeTab === "bids" && favRows.length > 0}:${bidViewMode}`,
  );

  const clearBidFilters = (): void => {
    setBidSearch("");
    setBidFilters(EMPTY_BID_FILTERS);
  };

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

  const openBid = (bid: IBid): void => {
    navigate(`/bid/${encodeURIComponent(bid.bidNumber)}`);
  };

  const bidColumns = [
    {
      key: "favorite",
      header: "",
      width: 40,
      render: (r: IFavoriteBidRow) => <BidFavoriteButton bid={r.bid} />,
    },
    {
      key: "bidNumber",
      header: "BID",
      sortable: true,
      render: (r: IFavoriteBidRow) => (
        <span className={styles.bidMono}>{r.bidNumber}</span>
      ),
    },
    {
      key: "client",
      header: "Client / Project",
      sortable: true,
      render: (r: IFavoriteBidRow) => (
        <div className={styles.cellStack}>
          <span className={styles.cellPrimary}>{r.client || "-"}</span>
          {r.project && <span className={styles.cellMuted}>{r.project}</span>}
        </div>
      ),
    },
    {
      key: "division",
      header: "Division / Line",
      sortable: true,
      render: (r: IFavoriteBidRow) => (
        <div className={styles.cellStack}>
          {r.division ? <DivisionBadge division={r.division} /> : "-"}
          {r.serviceLine && (
            <span className={styles.cellMuted}>{r.serviceLine}</span>
          )}
        </div>
      ),
    },
    {
      key: "categories",
      header: "Scope",
      render: (r: IFavoriteBidRow) => (
        <PastBidChips
          values={r.categories}
          accent
          className={styles.chipsCell}
        />
      ),
    },
    {
      key: "tags",
      header: "Tags",
      render: (r: IFavoriteBidRow) => (
        <PastBidChips
          values={r.tags}
          max={MAX_LIST_TAGS}
          className={styles.chipsCell}
        />
      ),
    },
    {
      key: "completedDate",
      header: "Completed",
      sortable: true,
      render: (r: IFavoriteBidRow) => (
        <span className={styles.cellDate}>
          {r.completedDate ? formatDate(r.completedDate) : "-"}
        </span>
      ),
    },
    {
      key: "outcome",
      header: "Outcome",
      sortable: true,
      render: (r: IFavoriteBidRow) => <PastBidOutcome outcome={r.outcome} />,
    },
    {
      key: "kbStatus",
      header: "Knowledge Base",
      sortable: true,
      render: (r: IFavoriteBidRow) => <PastBidKbBadge status={r.kbStatus} />,
    },
    {
      key: "addedDate",
      header: "Added",
      sortable: true,
      render: (r: IFavoriteBidRow) => (
        <div className={styles.cellStack}>
          <span className={styles.cellDate}>
            {r.addedDate ? formatDate(r.addedDate) : "-"}
          </span>
          {r.addedBy && <span className={styles.cellMuted}>{r.addedBy}</span>}
        </div>
      ),
    },
  ];

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
    const label = eq ? `${eq.partNumber} - ${eq.description}` : id;
    if (!confirm(`Remove "${label}" from favorites?`)) return;
    removeEquipment(id);
  };

  const sourceLabel = (src: string): { text: string; cls: string } => {
    switch (src) {
      case "bid":
        return { text: "BID", cls: styles.srcBid };
      case "query":
        return { text: "Query", cls: styles.srcQuery };
      case "quotation":
        return { text: "Quotation", cls: styles.srcQuotation };
      default:
        return { text: "Manual", cls: styles.srcManual };
    }
  };

  const closeAddModal = (): void => {
    setShowAddModal(false);
    setAddingParentId(null);
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
          {favRows.length === 0 && favBids.length > 0 && bidsLoading ? (
            <SkeletonLoader height={44} count={4} />
          ) : favRows.length === 0 ? (
            <EmptyState
              variant="glass"
              icon={
                <span className={styles.emptyIcon}>
                  <StarIcon size={48} />
                </span>
              }
              title="No BIDs bookmarked yet"
              description="Open a closed-out BID (Completed, Canceled, No Bid…) or go to Past Bids and click the star icon to add it here."
              actionLabel="Browse Past Bids"
              onAction={() => navigate(ROUTES.pastBids)}
            />
          ) : (
            <>
              <div className={styles.filterBar}>
                <div className={styles.filterSearch}>
                  <Search size={15} className={styles.filterSearchIcon} />
                  <input
                    type="text"
                    className={styles.filterSearchInput}
                    placeholder="Search BID, client, project, equipment, PN, tag…"
                    value={bidSearch}
                    onChange={(e) => setBidSearch(e.currentTarget.value)}
                    aria-label="Search favorite BIDs"
                  />
                </div>
                {BID_FILTERS.map((f) => (
                  <MultiSelectDropdown
                    key={f.key}
                    label={f.label}
                    options={bidFilterOptions[f.key]}
                    selected={bidFilters[f.key]}
                    onChange={(values) =>
                      setBidFilters((prev) => ({ ...prev, [f.key]: values }))
                    }
                  />
                ))}
                {hasBidFilters && (
                  <button
                    type="button"
                    className={styles.clearBtn}
                    onClick={clearBidFilters}
                  >
                    <X size={14} /> Clear
                  </button>
                )}
                <span className={styles.resultCount}>
                  <strong>{filteredFavRows.length}</strong>{" "}
                  {hasBidFilters ? `of ${favRows.length} ` : ""}
                  {favRows.length === 1 ? "BID" : "BIDs"}
                </span>
                <div
                  ref={bidViewIndicator.containerRef}
                  className={styles.segmented}
                  role="tablist"
                  aria-label="View"
                >
                  {bidViewIndicator.style && (
                    <span
                      aria-hidden="true"
                      className={`${styles.segmentIndicator} ${bidViewIndicator.animated ? styles.segmentIndicatorAnimated : ""}`}
                      style={bidViewIndicator.style}
                    />
                  )}
                  {BID_VIEW_OPTIONS.map((opt) => {
                    const active = bidViewMode === opt.mode;
                    return (
                      <button
                        key={opt.mode}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        className={`${styles.segmentBtn} ${active ? styles.segmentBtnActive : ""}`}
                        onClick={() => setBidViewMode(opt.mode)}
                      >
                        {opt.icon}
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {filteredFavRows.length === 0 ? (
                <EmptyState
                  variant="glass"
                  title="No favorites match these filters"
                  description="Try fewer filters or another search term."
                  actionLabel="Clear filters"
                  onAction={clearBidFilters}
                />
              ) : bidViewMode === "grid" ? (
                <div className={styles.bidGrid}>
                  {filteredFavRows.map((r) => (
                    <PastBidCard
                      key={r.bidNumber}
                      row={r}
                      onOpen={openBid}
                      note={favoriteNote(r)}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.tableSection}>
                  <DataTable<IFavoriteBidRow>
                    data={filteredFavRows}
                    columns={bidColumns}
                    onRowClick={(r) => openBid(r.bid)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Equipment Catalog Tab */}
      {activeTab === "equipment" && (
        <div className={styles.equipContent}>
          {/* Sidebar — Group tree */}
          <CollapsibleSidebar
            label="Equipment catalog groups"
            collapsed={catalogSidebarCollapsed}
            onToggle={() =>
              setCatalogSidebarCollapsed((collapsed) => !collapsed)
            }
          >
            <div className={styles.groupSidebar}>
              <div className={styles.sidebarHeader}>
                <span className={styles.sidebarTitle}>Groups</span>
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
          </CollapsibleSidebar>

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
              {canEdit && (
                <button
                  className={styles.toolBtn}
                  onClick={() => setShowAddModal(true)}
                >
                  ➕ Add Item
                </button>
              )}
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
                {canEdit && (
                  <button
                    className={styles.toolBtn}
                    onClick={() => setShowAddModal(true)}
                  >
                    ➕ Add First Item
                  </button>
                )}
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
                                {canEdit && (
                                  <>
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
                                  </>
                                )}
                              </div>
                            ))}
                        </div>
                      )}

                      {canEdit && (
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
                      )}
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
                          {eq.notes || "-"}
                        </span>
                        <span className={styles.listColSrc}>
                          <span className={`${styles.srcBadge} ${src.cls}`}>
                            {src.text}
                          </span>
                        </span>
                        <span className={styles.listColAct}>
                          {canEdit && (
                            <>
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
                            </>
                          )}
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
                                {child.notes || "-"}
                              </span>
                              <span className={styles.listColSrc}>
                                <span
                                  className={`${styles.srcBadge} ${cSrc.cls}`}
                                >
                                  {cSrc.text}
                                </span>
                              </span>
                              <span className={styles.listColAct}>
                                {canEdit && (
                                  <>
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
                                  </>
                                )}
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

      {showAddModal && (
        <AddFavoriteEquipmentModal
          groups={groups}
          equipment={equipment}
          parentItem={
            addingParentId
              ? equipment.find((e) => e.id === addingParentId)
              : null
          }
          initialGroupId={selectedGroup}
          initialSubGroupId={selectedSubGroup}
          onClose={closeAddModal}
        />
      )}
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
              <option value="">- Select Group -</option>
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
                <option value="">- None -</option>
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
