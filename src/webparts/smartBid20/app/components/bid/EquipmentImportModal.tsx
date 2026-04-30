/**
 * EquipmentImportModal — Multi-source equipment browser for importing PN + Description
 * into Scope of Supply rows. Navigable tabs: Favorites, BOM Costs, Quotations, Query Consulting.
 */
import * as React from "react";
import styles from "./EquipmentImportModal.module.scss";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import { useQueryCatalogStore } from "../../stores/useQueryCatalogStore";
import { useQuotationStore } from "../../stores/useQuotationStore";
import { AssetCatalogService } from "../../services/AssetCatalogService";
import { BomCostAnalysisService } from "../../services/BomCostAnalysisService";
import { IAssetCatalogItem } from "../../models/IAssetCatalog";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import { PhotoLightbox } from "../common/PhotoLightbox";
import {
  IBomCostAnalysis,
  IFavoriteEquipment,
  IFavoriteGroup,
  IQuotationItem,
} from "../../models";

/* ────────── props ────────── */

/** Sub-item payload for equipment that has children (spares/accessories) */
export interface IImportSubItem {
  partNumber: string;
  description: string;
}

export interface EquipmentImportModalProps {
  /** Called when user picks an item — fills equipmentOffer (desc) + partNumber (pn), optionally with sub-items */
  onSelect: (
    partNumber: string,
    description: string,
    subItems?: IImportSubItem[],
  ) => void;
  /** Close the modal without selection */
  onClose: () => void;
}

/* ────────── tab definition ────────── */

type TabId = "favorites" | "bom" | "quotations" | "query" | "assets";

interface TabDef {
  id: TabId;
  label: string;
  icon: JSX.Element;
}

/* ────────── SVG icons ────────── */

const StarIcon = (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="currentColor"
    stroke="none"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
  </svg>
);
const CubeIcon = (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const FileTextIcon = (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const SearchIcon = (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const CheckIcon = (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const CloseIcon = (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const FolderIcon = (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const PackageIcon = (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const TABS: TabDef[] = [
  { id: "favorites", label: "Favorites", icon: StarIcon },
  { id: "assets", label: "Assets Catalog", icon: PackageIcon },
  { id: "bom", label: "BOM Costs", icon: CubeIcon },
  { id: "quotations", label: "Quotations", icon: FileTextIcon },
  { id: "query", label: "Query Consulting", icon: SearchIcon },
];

/* ────────── main component ────────── */

export const EquipmentImportModal: React.FC<EquipmentImportModalProps> = ({
  onSelect,
  onClose,
}) => {
  const [activeTab, setActiveTab] = React.useState<TabId>("favorites");
  const [search, setSearch] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<{
    pn: string;
    desc: string;
    subs?: IImportSubItem[];
  } | null>(null);

  // ── Favorites store ──
  const favData = useFavoritesStore((s) => s.data);
  const favIsLoaded = useFavoritesStore((s) => s.isLoaded);
  const favIsLoading = useFavoritesStore((s) => s.isLoading);
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
  const getEquipmentByGroup = useFavoritesStore((s) => s.getEquipmentByGroup);
  const getGroupItemCount = useFavoritesStore((s) => s.getGroupItemCount);
  const getSubGroupItemCount = useFavoritesStore((s) => s.getSubGroupItemCount);
  const favAllEquipment: IFavoriteEquipment[] = favData?.equipment || [];

  // ── Query Catalog store ──
  const catalogData = useQueryCatalogStore((s) => s.data);
  const catalogLoaded = useQueryCatalogStore((s) => s.isLoaded);
  const catalogLoading = useQueryCatalogStore((s) => s.isLoading);
  const loadCatalog = useQueryCatalogStore((s) => s.loadCatalog);

  // ── Quotation store ──
  const quotations = useQuotationStore((s) => s.items);
  const quotationsLoaded = useQuotationStore((s) => s.isLoaded);
  const quotationsLoading = useQuotationStore((s) => s.isLoading);
  const loadQuotations = useQuotationStore((s) => s.loadQuotations);

  // ── Assets Catalog state ──
  const [assetItems, setAssetItems] = React.useState<IAssetCatalogItem[]>([]);
  const [assetsLoading, setAssetsLoading] = React.useState(false);
  const [assetsLoaded, setAssetsLoaded] = React.useState(false);
  const [assetCategory, setAssetCategory] = React.useState<string | null>(null);

  // ── BOM Costs state (saved analyses) ──
  const [bomAnalyses, setBomAnalyses] = React.useState<IBomCostAnalysis[]>([]);
  const [bomLoading, setBomLoading] = React.useState(false);
  const [bomLoaded, setBomLoaded] = React.useState(false);

  // ── Lazy-load all sources on mount ──
  React.useEffect(() => {
    if (!favIsLoaded && !favIsLoading) loadFavorites();
    if (!catalogLoaded && !catalogLoading) loadCatalog();
    if (!quotationsLoaded && !quotationsLoading) loadQuotations();
    if (!assetsLoaded && !assetsLoading) {
      setAssetsLoading(true);
      AssetCatalogService.getAll()
        .then((data) => {
          setAssetItems(data);
          setAssetsLoaded(true);
          setAssetsLoading(false);
        })
        .catch(() => setAssetsLoading(false));
    }
    if (!bomLoaded && !bomLoading) {
      setBomLoading(true);
      BomCostAnalysisService.getAll()
        .then((data) => {
          setBomAnalyses(data);
          setBomLoaded(true);
          setBomLoading(false);
        })
        .catch(() => setBomLoading(false));
    }
  }, []);

  /** Build photo URL for a favorite equipment item */
  const getFavPhotoUrl = (eq: IFavoriteEquipment): string | null => {
    if (eq.pictureUrl) return eq.pictureUrl;
    if (eq.partNumber) {
      return (
        SHAREPOINT_CONFIG.siteUrl +
        SHAREPOINT_CONFIG.photosBaseUrl +
        "/" +
        eq.partNumber +
        ".jpg"
      );
    }
    return null;
  };

  // ── Favorites state ──
  const [favActiveGroup, setFavActiveGroup] = React.useState<string | null>(
    null,
  );
  const [favActiveSubGroup, setFavActiveSubGroup] = React.useState<
    string | null
  >(null);
  const [expandedFavItems, setExpandedFavItems] = React.useState<Set<string>>(
    new Set(),
  );
  const [includeSubItems, setIncludeSubItems] = React.useState<Set<string>>(
    new Set(),
  );

  const [previewPhotoUrl, setPreviewPhotoUrl] = React.useState<string | null>(
    null,
  );

  const groups: IFavoriteGroup[] = React.useMemo(() => {
    const raw = favData?.groups || [];
    return raw.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [favData]);

  /** Unique asset categories sorted alphabetically */
  const assetCategories: string[] = React.useMemo(() => {
    const set = new Set<string>();
    assetItems.forEach((item) => {
      if (item.keyword) set.add(item.keyword);
    });
    const arr: string[] = [];
    set.forEach((k) => arr.push(k));
    return arr.sort((a, b) => a.localeCompare(b));
  }, [assetItems]);

  // ── Query Consulting tab state ──
  type QueryTabKey = "financials" | "brazil";
  type QuerySubTabKey = "priceConsulting" | "activeRegistered";
  const [queryTab, setQueryTab] = React.useState<QueryTabKey>("financials");
  const [querySubTab, setQuerySubTab] =
    React.useState<QuerySubTabKey>("priceConsulting");
  const [querySearchCol, setQuerySearchCol] = React.useState<string>("");
  const [queryPage, setQueryPage] = React.useState(0);
  const [queryFilters, setQueryFilters] = React.useState<
    { id: string; column: string; value: string }[]
  >([{ id: "f1", column: "", value: "" }]);
  const QUERY_PAGE_SIZE = 50;

  // Reset sub-group when group changes
  React.useEffect(() => {
    setFavActiveSubGroup(null);
  }, [favActiveGroup]);

  // Clear selection and search when changing tabs
  React.useEffect(() => {
    setSearch("");
    setSelectedItem(null);
    setFavActiveGroup(null);
    setFavActiveSubGroup(null);
    setExpandedFavItems(new Set());
    setIncludeSubItems(new Set());
    setAssetCategory(null);
    setQueryTab("financials");
    setQuerySubTab("priceConsulting");
    setQuerySearchCol("");
    setQueryPage(0);
    setQueryFilters([{ id: "f1", column: "", value: "" }]);
  }, [activeTab]);

  // ── Keyboard: Escape to close ──
  React.useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  /* ──────── Helpers ──────── */

  const lowerSearch = search.toLowerCase().trim();
  const searchWords = lowerSearch.split(/\s+/).filter(Boolean);

  const matchesSearch = (text: string): boolean => {
    if (!lowerSearch) return true;
    const lower = text.toLowerCase();
    return searchWords.every((w) => lower.indexOf(w) >= 0);
  };

  const handleConfirm = (): void => {
    if (selectedItem) {
      onSelect(selectedItem.pn, selectedItem.desc, selectedItem.subs);
    }
  };

  const handleItemClick = (
    pn: string,
    desc: string,
    subs?: IImportSubItem[],
  ): void => {
    setSelectedItem({ pn, desc, subs });
  };

  const handleItemDoubleClick = (
    pn: string,
    desc: string,
    subs?: IImportSubItem[],
  ): void => {
    onSelect(pn, desc, subs);
  };

  /** Get child equipment items for a parent favorite */
  const getChildEquipment = (parentId: string): IFavoriteEquipment[] => {
    return favAllEquipment.filter((e) => e.parentId === parentId);
  };

  /** Build sub-item payloads for a parent favorite */
  const buildSubItems = (parentId: string): IImportSubItem[] => {
    return getChildEquipment(parentId).map((c) => ({
      partNumber: c.partNumber,
      description: c.description,
    }));
  };

  /** Toggle expand/collapse for a favorite item's sub-items */
  const toggleExpandFavItem = (id: string): void => {
    setExpandedFavItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /** Toggle whether sub-items should be included in the import */
  const toggleIncludeSubItems = (id: string): void => {
    setIncludeSubItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /* ──────── Tab: Favorites ──────── */

  const renderFavorites = (): JSX.Element => {
    if (favIsLoading)
      return <div className={styles.loadingState}>Loading favorites...</div>;
    if (!favData || groups.length === 0)
      return <div className={styles.emptyState}>No favorite groups found.</div>;

    const activeGroupObj = groups.find((g) => g.id === favActiveGroup);
    const subGroups = (activeGroupObj?.subGroups || [])
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));

    // Get parent-only equipment (no parentId)
    let equipment: IFavoriteEquipment[] = [];
    if (favActiveGroup) {
      equipment = getEquipmentByGroup(
        favActiveGroup,
        favActiveSubGroup || undefined,
      ).filter((e) => !e.parentId);
    }

    // Filter by search
    if (lowerSearch) {
      equipment = equipment.filter(
        (e) => matchesSearch(e.partNumber) || matchesSearch(e.description),
      );
    }

    return (
      <div className={styles.favLayout}>
        {/* Group sidebar */}
        <div className={styles.favSidebar}>
          <div className={styles.favSidebarTitle}>Groups</div>
          <div className={styles.favGroupList}>
            {groups.map((g) => {
              const count = getGroupItemCount(g.id);
              return (
                <div
                  key={g.id}
                  className={`${styles.favGroupItem}${favActiveGroup === g.id ? ` ${styles.favGroupActive}` : ""}`}
                  onClick={() =>
                    setFavActiveGroup(favActiveGroup === g.id ? null : g.id)
                  }
                >
                  <span className={styles.favGroupIcon}>{FolderIcon}</span>
                  <span className={styles.favGroupName}>{g.name}</span>
                  <span className={styles.favCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className={styles.favContent}>
          {!favActiveGroup ? (
            <div className={styles.emptyState}>
              Select a group to browse equipment.
            </div>
          ) : (
            <>
              {/* Sub-group chips */}
              {subGroups.length > 0 && (
                <div className={styles.subGroupChips}>
                  <button
                    className={`${styles.chip}${!favActiveSubGroup ? ` ${styles.chipActive}` : ""}`}
                    onClick={() => setFavActiveSubGroup(null)}
                  >
                    All
                  </button>
                  {subGroups.map((sg) => {
                    const sgCount = getSubGroupItemCount(sg.id);
                    return (
                      <button
                        key={sg.id}
                        className={`${styles.chip}${favActiveSubGroup === sg.id ? ` ${styles.chipActive}` : ""}`}
                        onClick={() => setFavActiveSubGroup(sg.id)}
                      >
                        {sg.name}
                        <span className={styles.chipCount}>{sgCount}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Equipment list */}
              {equipment.length === 0 ? (
                <div className={styles.emptyState}>
                  {lowerSearch
                    ? "No matches found."
                    : "No equipment in this group."}
                </div>
              ) : (
                <div className={styles.resultTable}>
                  <div className={styles.resultHeader}>
                    <div className={styles.colExpand}></div>
                    <div className={styles.colPhoto}></div>
                    <div className={styles.colPn}>Part Number</div>
                    <div className={styles.colDesc}>Description</div>
                    <div className={styles.colAction}></div>
                  </div>
                  {equipment.map((eq) => {
                    const children = getChildEquipment(eq.id);
                    const hasChildren = children.length > 0;
                    const isExpanded = expandedFavItems.has(eq.id);
                    const subsIncluded = includeSubItems.has(eq.id);
                    const isSelected =
                      selectedItem?.pn === eq.partNumber &&
                      selectedItem?.desc === eq.description;

                    const subsPayload = subsIncluded
                      ? buildSubItems(eq.id)
                      : undefined;

                    return (
                      <React.Fragment key={eq.id}>
                        <div
                          className={`${styles.resultRow}${isSelected ? ` ${styles.resultRowSelected}` : ""}${hasChildren ? ` ${styles.resultRowHasChildren}` : ""}`}
                          onClick={() =>
                            handleItemClick(
                              eq.partNumber,
                              eq.description,
                              subsPayload,
                            )
                          }
                          onDoubleClick={() =>
                            handleItemDoubleClick(
                              eq.partNumber,
                              eq.description,
                              subsPayload,
                            )
                          }
                        >
                          <div className={styles.colExpand}>
                            {hasChildren && (
                              <button
                                className={`${styles.expandBtn}${isExpanded ? ` ${styles.expandBtnOpen}` : ""}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpandFavItem(eq.id);
                                }}
                                title={
                                  isExpanded
                                    ? "Collapse sub-items"
                                    : "Show sub-items"
                                }
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  width="12"
                                  height="12"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className={styles.colPhoto}>
                            {(() => {
                              const photoUrl = getFavPhotoUrl(eq);
                              return photoUrl ? (
                                <img
                                  className={styles.favThumb}
                                  src={photoUrl}
                                  alt=""
                                  style={{ cursor: "zoom-in" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewPhotoUrl(photoUrl);
                                  }}
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                  }}
                                />
                              ) : null;
                            })()}
                          </div>
                          <div className={`${styles.colPn} ${styles.mono}`}>
                            {eq.partNumber || "—"}
                          </div>
                          <div className={styles.colDesc}>
                            {eq.description || "—"}
                            {hasChildren && (
                              <span className={styles.childBadge}>
                                {children.length} sub-item
                                {children.length > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                          <div className={styles.colAction}>
                            <button
                              className={styles.selectBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelect(
                                  eq.partNumber,
                                  eq.description,
                                  subsPayload,
                                );
                              }}
                              title="Select"
                            >
                              {CheckIcon}
                            </button>
                          </div>
                        </div>

                        {/* Sub-items expansion */}
                        {hasChildren && isExpanded && (
                          <div className={styles.subItemsBlock}>
                            <div className={styles.subItemsHeader}>
                              <label className={styles.subItemsCheck}>
                                <input
                                  type="checkbox"
                                  checked={subsIncluded}
                                  onChange={() => {
                                    toggleIncludeSubItems(eq.id);
                                    // Update selection if this item is selected
                                    if (isSelected) {
                                      const nextInclude = !subsIncluded;
                                      setSelectedItem({
                                        pn: eq.partNumber,
                                        desc: eq.description,
                                        subs: nextInclude
                                          ? buildSubItems(eq.id)
                                          : undefined,
                                      });
                                    }
                                  }}
                                />
                                <span>Include sub-items in import</span>
                              </label>
                            </div>
                            {children.map((child) => (
                              <div key={child.id} className={styles.subItemRow}>
                                <div className={styles.subItemIndent}>↳</div>
                                <div
                                  className={`${styles.colPn} ${styles.mono}`}
                                >
                                  {child.partNumber || "—"}
                                </div>
                                <div className={styles.colDesc}>
                                  {child.description || "—"}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  /* ──────── Tab: BOM Costs ──────── */

  const renderBomCosts = (): JSX.Element => {
    if (bomLoading)
      return <div className={styles.loadingState}>Loading BOM analyses...</div>;

    if (bomAnalyses.length === 0)
      return (
        <div className={styles.emptyState}>No saved BOM analyses found.</div>
      );

    // Filter by search
    let filtered = bomAnalyses;
    if (lowerSearch) {
      filtered = bomAnalyses.filter(
        (a) =>
          a.mainPartNumber.toLowerCase().indexOf(lowerSearch) >= 0 ||
          a.mainDescription.toLowerCase().indexOf(lowerSearch) >= 0,
      );
    }

    if (filtered.length === 0)
      return (
        <div className={styles.tabBody}>
          <div className={styles.emptyState}>
            No BOM analyses match your search.
          </div>
        </div>
      );

    return (
      <div className={styles.tabBody}>
        <div className={styles.resultTable}>
          <div className={styles.resultHeader}>
            <div className={styles.colPn}>Part Number</div>
            <div className={styles.colDesc}>Description</div>
            <div className={styles.colAction}></div>
          </div>
          {filtered.map((a) => {
            const isSelected =
              selectedItem?.pn === a.mainPartNumber &&
              selectedItem?.desc === a.mainDescription;
            return (
              <div
                key={a.id}
                className={`${styles.resultRow}${isSelected ? ` ${styles.resultRowSelected}` : ""}`}
                onClick={() =>
                  handleItemClick(a.mainPartNumber, a.mainDescription)
                }
                onDoubleClick={() =>
                  handleItemDoubleClick(a.mainPartNumber, a.mainDescription)
                }
              >
                <div className={`${styles.colPn} ${styles.mono}`}>
                  {a.mainPartNumber || "—"}
                </div>
                <div className={styles.colDesc}>{a.mainDescription || "—"}</div>
                <div className={styles.colAction}>
                  <button
                    className={styles.selectBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(a.mainPartNumber, a.mainDescription);
                    }}
                    title="Select"
                  >
                    {CheckIcon}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ──────── Tab: Quotations ──────── */

  const renderQuotations = (): JSX.Element => {
    if (quotationsLoading)
      return <div className={styles.loadingState}>Loading quotations...</div>;

    let filtered: IQuotationItem[] = quotations || [];
    if (lowerSearch) {
      filtered = filtered.filter(
        (q) =>
          matchesSearch(q.partNumber) ||
          matchesSearch(q.description) ||
          matchesSearch(q.supplier || ""),
      );
    }

    if (filtered.length === 0)
      return (
        <div className={styles.tabBody}>
          <div className={styles.emptyState}>
            {lowerSearch
              ? "No quotations match your search."
              : "No quotations available."}
          </div>
        </div>
      );

    return (
      <div className={styles.tabBody}>
        <div className={styles.resultTable}>
          <div className={styles.resultHeader}>
            <div className={styles.colPn}>Part Number</div>
            <div className={styles.colDesc}>Description</div>
            <div className={styles.colSupplier}>Supplier</div>
            <div className={styles.colAction}></div>
          </div>
          {filtered.slice(0, 50).map((q) => {
            const isSelected =
              selectedItem?.pn === q.partNumber &&
              selectedItem?.desc === q.description;
            return (
              <div
                key={q.id}
                className={`${styles.resultRow}${isSelected ? ` ${styles.resultRowSelected}` : ""}`}
                onClick={() => handleItemClick(q.partNumber, q.description)}
                onDoubleClick={() =>
                  handleItemDoubleClick(q.partNumber, q.description)
                }
              >
                <div className={`${styles.colPn} ${styles.mono}`}>
                  {q.partNumber || "—"}
                </div>
                <div className={styles.colDesc}>{q.description || "—"}</div>
                <div className={styles.colSupplier}>{q.supplier || "—"}</div>
                <div className={styles.colAction}>
                  <button
                    className={styles.selectBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(q.partNumber, q.description);
                    }}
                    title="Select"
                  >
                    {CheckIcon}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ──────── Tab: Query Consulting ──────── */

  /** Build photo URL for a part number */
  const getPhotoUrl = (pn: string): string => {
    if (!pn) return "";
    return `${SHAREPOINT_CONFIG.siteUrl}${SHAREPOINT_CONFIG.photosBaseUrl}/${encodeURIComponent(pn.trim())}.jpg`;
  };

  const renderQueryConsulting = (): JSX.Element => {
    if (catalogLoading)
      return <div className={styles.loadingState}>Loading catalog...</div>;

    // Raw data sources
    const rawFin = catalogData?.rawFinancials;
    const rawBumbl = catalogData?.rawBrazilBumbl;
    const rawBumbr = catalogData?.rawBrazilBumbr;
    const rawAR = catalogData?.rawActiveRegistered;

    // Determine active dataset based on tab + subtab
    let activeHeaders: string[] = [];
    let activeRows: Record<string, any>[] = [];
    const isMultiFilter =
      queryTab === "brazil" && querySubTab === "activeRegistered";

    if (queryTab === "financials") {
      activeHeaders = rawFin?.headers || [];
      activeRows = rawFin?.rows || [];
    } else {
      if (querySubTab === "priceConsulting") {
        activeHeaders = rawBumbl?.headers || [];
        const bumblRows = rawBumbl?.rows || [];
        const bumbrRows = rawBumbr?.rows || [];
        activeRows = bumblRows.concat(bumbrRows);
      } else {
        // Active Registered
        activeHeaders = rawAR?.headers || [];
        activeRows = rawAR?.rows || [];
      }
    }

    // Column keys
    const buColKey = activeHeaders[0] || "";
    const pnColKey = activeHeaders[1] || "";
    const descColKey = activeHeaders[2] || "";

    // Search column options for single-filter mode
    const searchColOptions: { key: string; label: string }[] = [];
    if (queryTab === "financials") {
      if (activeHeaders[1])
        searchColOptions.push({ key: activeHeaders[1], label: "PART NUMBER" });
      if (activeHeaders[2])
        searchColOptions.push({ key: activeHeaders[2], label: "DESCRIPTION" });
    } else if (querySubTab === "priceConsulting") {
      if (activeHeaders[1])
        searchColOptions.push({ key: activeHeaders[1], label: "PART NUMBER" });
      if (activeHeaders[2])
        searchColOptions.push({ key: activeHeaders[2], label: "DESCRIPTION" });
      if (activeHeaders[17])
        searchColOptions.push({ key: activeHeaders[17], label: "VENDOR" });
    }

    // Multi-filter column options (Active Registered Brazil)
    const multiColOptions: { key: string; label: string }[] = [];
    if (isMultiFilter) {
      if (activeHeaders[0])
        multiColOptions.push({ key: activeHeaders[0], label: "BUSINESS UNIT" });
      if (activeHeaders[1])
        multiColOptions.push({ key: activeHeaders[1], label: "PART NUMBER" });
      if (activeHeaders[2])
        multiColOptions.push({ key: activeHeaders[2], label: "DESCRIPTION" });
      if (activeHeaders[13])
        multiColOptions.push({ key: activeHeaders[13], label: "MFG NAME" });
      if (activeHeaders[14])
        multiColOptions.push({ key: activeHeaders[14], label: "MFG REF." });
      if (activeHeaders[17])
        multiColOptions.push({ key: activeHeaders[17], label: "VENDOR" });
    }

    // Initialize search column if not set
    const effectiveSearchCol =
      querySearchCol ||
      (searchColOptions.length > 0 ? searchColOptions[0].key : pnColKey);

    // Filter rows
    let filtered = activeRows;
    if (isMultiFilter) {
      // Multi-filter: all active filters must match (AND logic)
      const activeFilters = queryFilters.filter((f) => f.value.trim() !== "");
      if (activeFilters.length > 0) {
        filtered = activeRows.filter((row) => {
          for (let j = 0; j < activeFilters.length; j++) {
            const cell = String(
              row[activeFilters[j].column] || "",
            ).toLowerCase();
            const tokens = activeFilters[j].value
              .toLowerCase()
              .split(" ")
              .filter((t) => t.trim());
            for (let t = 0; t < tokens.length; t++) {
              if (cell.indexOf(tokens[t]) < 0) return false;
            }
          }
          return true;
        });
      }
    } else {
      // Single filter using the modal's main search input
      if (lowerSearch.length >= 2) {
        filtered = activeRows.filter((row) => {
          const cell = String(row[effectiveSearchCol] || "").toLowerCase();
          return searchWords.every((w) => cell.indexOf(w) >= 0);
        });
      } else if (lowerSearch.length > 0) {
        filtered = [];
      }
    }

    const totalFiltered = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / QUERY_PAGE_SIZE));
    const safePage = Math.min(queryPage, totalPages - 1);
    const pageStart = safePage * QUERY_PAGE_SIZE;
    const pageEnd = Math.min(pageStart + QUERY_PAGE_SIZE, totalFiltered);
    const pageRows = filtered.slice(pageStart, pageEnd);

    // Column definitions matching QueryConsultingPage
    type ColDef = { key: string; header: string; idx: number };
    let columnDefs: ColDef[] = [];
    if (queryTab === "financials") {
      columnDefs = [
        { key: buColKey, header: "BU", idx: 0 },
        { key: pnColKey, header: "PART NUMBER", idx: 1 },
        { key: descColKey, header: "DESCRIPTION", idx: 2 },
        { key: activeHeaders[3] || "", header: "LAST ORDER DATE", idx: 3 },
        { key: activeHeaders[4] || "", header: "COST", idx: 4 },
        { key: activeHeaders[6] || "", header: "LEAD TIME", idx: 6 },
      ].filter((c) => c.key);
    } else if (querySubTab === "priceConsulting") {
      columnDefs = [
        { key: buColKey, header: "BU", idx: 0 },
        { key: pnColKey, header: "PART NUMBER", idx: 1 },
        { key: descColKey, header: "DESCRIPTION", idx: 2 },
        { key: activeHeaders[17] || "", header: "VENDOR", idx: 17 },
        { key: activeHeaders[25] || "", header: "LAST ORDER DATE", idx: 25 },
        { key: activeHeaders[27] || "", header: "LAST PRICE", idx: 27 },
      ].filter((c) => c.key);
    } else {
      // Active Registered Brazil
      columnDefs = [
        { key: buColKey, header: "BU", idx: 0 },
        { key: pnColKey, header: "PART NUMBER", idx: 1 },
        { key: descColKey, header: "DESCRIPTION", idx: 2 },
        { key: activeHeaders[3] || "", header: "QTY AVAIL", idx: 3 },
        { key: activeHeaders[4] || "", header: "QTY ON HAND", idx: 4 },
        { key: activeHeaders[7] || "", header: "LAST ORDER DATE", idx: 7 },
        { key: activeHeaders[13] || "", header: "MFG NAME", idx: 13 },
        { key: activeHeaders[14] || "", header: "MFG REF.", idx: 14 },
        { key: activeHeaders[17] || "", header: "VENDOR", idx: 17 },
      ].filter((c) => c.key);
    }

    // Multi-filter handlers
    const handleAddFilter = (): void => {
      if (queryFilters.length >= 3) return;
      const newF = {
        id: "f" + Date.now(),
        column: multiColOptions[0]?.key || "",
        value: "",
      };
      setQueryFilters([...queryFilters, newF]);
    };
    const handleRemoveFilter = (id: string): void => {
      const next = queryFilters.filter((f) => f.id !== id);
      setQueryFilters(next);
      setQueryPage(0);
    };
    const handleUpdateFilter = (
      id: string,
      col?: string,
      val?: string,
    ): void => {
      setQueryFilters(
        queryFilters.map((f) =>
          f.id === id
            ? {
                ...f,
                ...(col !== undefined && { column: col }),
                ...(val !== undefined && { value: val }),
              }
            : f,
        ),
      );
      setQueryPage(0);
    };

    return (
      <div className={styles.queryLayout}>
        {/* Main tabs: Financials / Brazil */}
        <div className={styles.querySubTabs}>
          <button
            className={`${styles.querySubTab}${queryTab === "financials" ? ` ${styles.querySubTabActive}` : ""}`}
            onClick={() => {
              setQueryTab("financials");
              setQuerySubTab("priceConsulting");
              setQueryPage(0);
              setQueryFilters([{ id: "f1", column: "", value: "" }]);
            }}
          >
            Peoplesoft Financials
          </button>
          <button
            className={`${styles.querySubTab}${queryTab === "brazil" ? ` ${styles.querySubTabActive}` : ""}`}
            onClick={() => {
              setQueryTab("brazil");
              setQuerySubTab("priceConsulting");
              setQueryPage(0);
              setQueryFilters([{ id: "f1", column: "", value: "" }]);
            }}
          >
            Peoplesoft Brazil
          </button>
        </div>

        {/* Sub-tabs: Price Consulting / Active Registered */}
        <div className={styles.querySubTabs}>
          <button
            className={`${styles.querySubTab}${querySubTab === "priceConsulting" ? ` ${styles.querySubTabActive}` : ""}`}
            onClick={() => {
              setQuerySubTab("priceConsulting");
              setQueryPage(0);
              setQueryFilters([{ id: "f1", column: "", value: "" }]);
            }}
          >
            Price Consulting
          </button>
          <button
            className={`${styles.querySubTab}${querySubTab === "activeRegistered" ? ` ${styles.querySubTabActive}` : ""}`}
            onClick={() => {
              setQuerySubTab("activeRegistered");
              setQueryPage(0);
              setQueryFilters([
                { id: "f1", column: multiColOptions[0]?.key || "", value: "" },
              ]);
            }}
          >
            Active Registered with Manuf.
          </button>
        </div>

        {/* Filter area */}
        <div className={styles.queryFilterBar}>
          {isMultiFilter ? (
            /* Multiple search filters */
            <div className={styles.queryMultiFilterWrap}>
              {queryFilters.map((filter) => (
                <div key={filter.id} className={styles.queryMultiFilterRow}>
                  <select
                    className={styles.querySelect}
                    value={filter.column}
                    onChange={(e) =>
                      handleUpdateFilter(filter.id, e.target.value)
                    }
                  >
                    {multiColOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className={styles.queryInput}
                    placeholder={`Search...`}
                    value={filter.value}
                    onChange={(e) =>
                      handleUpdateFilter(filter.id, undefined, e.target.value)
                    }
                  />
                  <button
                    className={styles.queryRemoveBtn}
                    onClick={() => handleRemoveFilter(filter.id)}
                    disabled={queryFilters.length <= 1}
                    title="Remove filter"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {queryFilters.length < 3 && (
                <button
                  className={styles.queryAddFilterBtn}
                  onClick={handleAddFilter}
                >
                  + Add Filter
                </button>
              )}
            </div>
          ) : (
            /* Single search with column select */
            <div className={styles.querySingleFilterRow}>
              <span className={styles.queryFilterLabel}>Search by:</span>
              <select
                className={styles.querySelect}
                value={effectiveSearchCol}
                onChange={(e) => {
                  setQuerySearchCol(e.target.value);
                  setQueryPage(0);
                }}
              >
                {searchColOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <span className={styles.queryResultCount}>
            {totalFiltered.toLocaleString()} result
            {totalFiltered !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Data table */}
        {!isMultiFilter && !lowerSearch ? (
          <div className={styles.emptyState}>
            Type in the search bar above to query data.
          </div>
        ) : !isMultiFilter && lowerSearch.length < 2 ? (
          <div className={styles.emptyState}>Type at least 2 characters.</div>
        ) : totalFiltered === 0 ? (
          <div className={styles.emptyState}>No results found.</div>
        ) : (
          <div className={styles.queryTableWrap}>
            <div className={styles.queryTable}>
              <div className={styles.queryTableHeader}>
                <div className={styles.queryColPhoto}></div>
                {columnDefs.map((col) => (
                  <div
                    key={col.key}
                    className={
                      col.idx === 2 ? styles.queryColDesc : styles.queryColCell
                    }
                  >
                    {col.header}
                  </div>
                ))}
                <div className={styles.colAction}></div>
              </div>
              {pageRows.map((row, i) => {
                const pn = String(row[pnColKey] || "").trim();
                const desc = String(row[descColKey] || "").trim();
                const photoUrl = pn ? getPhotoUrl(pn) : "";
                const isSelected =
                  selectedItem?.pn === pn && selectedItem?.desc === desc;
                return (
                  <div
                    key={`q-${pageStart + i}`}
                    className={`${styles.queryTableRow}${isSelected ? ` ${styles.resultRowSelected}` : ""}`}
                    onClick={() => handleItemClick(pn, desc)}
                    onDoubleClick={() => handleItemDoubleClick(pn, desc)}
                  >
                    <div className={styles.queryColPhoto}>
                      {photoUrl && (
                        <img
                          className={styles.queryThumb}
                          src={photoUrl}
                          alt=""
                          style={{ cursor: "zoom-in" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewPhotoUrl(photoUrl);
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                    </div>
                    {columnDefs.map((col) => (
                      <div
                        key={col.key}
                        className={
                          col.idx === 2
                            ? styles.queryColDesc
                            : col.idx === 1
                              ? `${styles.queryColCell} ${styles.mono}`
                              : styles.queryColCell
                        }
                      >
                        {String(row[col.key] ?? "")}
                      </div>
                    ))}
                    <div className={styles.colAction}>
                      <button
                        className={styles.selectBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(pn, desc);
                        }}
                        title="Select"
                      >
                        {CheckIcon}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalFiltered > QUERY_PAGE_SIZE && (
          <div className={styles.queryPagination}>
            <button
              className={styles.queryPageBtn}
              disabled={safePage === 0}
              onClick={() => setQueryPage(0)}
            >
              ««
            </button>
            <button
              className={styles.queryPageBtn}
              disabled={safePage === 0}
              onClick={() => setQueryPage(safePage - 1)}
            >
              «
            </button>
            <span className={styles.queryPageInfo}>
              Page {safePage + 1} of {totalPages}
            </span>
            <button
              className={styles.queryPageBtn}
              disabled={safePage >= totalPages - 1}
              onClick={() => setQueryPage(safePage + 1)}
            >
              »
            </button>
            <button
              className={styles.queryPageBtn}
              disabled={safePage >= totalPages - 1}
              onClick={() => setQueryPage(totalPages - 1)}
            >
              »»
            </button>
          </div>
        )}
      </div>
    );
  };

  /* ──────── Tab: Assets Catalog ──────── */

  const renderAssetsCatalog = (): JSX.Element => {
    if (assetsLoading)
      return (
        <div className={styles.loadingState}>Loading assets catalog...</div>
      );
    if (assetItems.length === 0)
      return <div className={styles.emptyState}>No assets found.</div>;

    // Filter items by selected category and search
    let filtered = assetItems;
    if (assetCategory) {
      filtered = filtered.filter((item) => item.keyword === assetCategory);
    }
    if (lowerSearch) {
      filtered = filtered.filter(
        (item) =>
          matchesSearch(item.pn || "") ||
          matchesSearch(item.description || "") ||
          matchesSearch(item.title || ""),
      );
    }

    return (
      <div className={styles.favLayout}>
        {/* Category sidebar */}
        <div className={styles.favSidebar}>
          <div className={styles.favSidebarTitle}>Categories</div>
          <div className={styles.favGroupList}>
            <div
              className={`${styles.favGroupItem}${!assetCategory ? ` ${styles.favGroupActive}` : ""}`}
              onClick={() => setAssetCategory(null)}
            >
              <span className={styles.favGroupIcon}>{FolderIcon}</span>
              <span className={styles.favGroupName}>All</span>
              <span className={styles.favCount}>{assetItems.length}</span>
            </div>
            {assetCategories.map((cat) => {
              const count = assetItems.filter((i) => i.keyword === cat).length;
              return (
                <div
                  key={cat}
                  className={`${styles.favGroupItem}${assetCategory === cat ? ` ${styles.favGroupActive}` : ""}`}
                  onClick={() => setAssetCategory(cat)}
                >
                  <span className={styles.favGroupIcon}>{FolderIcon}</span>
                  <span className={styles.favGroupName}>{cat}</span>
                  <span className={styles.favCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className={styles.favContent}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              {lowerSearch
                ? "No matches found."
                : "No assets in this category."}
            </div>
          ) : (
            <div className={styles.resultTable}>
              <div className={styles.resultHeader}>
                <div className={styles.colPhoto}></div>
                <div className={styles.colPn}>Part Number</div>
                <div className={styles.colDesc}>Description</div>
                <div className={styles.colDatasheet}>Datasheet</div>
                <div className={styles.colAction}></div>
              </div>
              {filtered.slice(0, 80).map((item) => {
                const isSelected =
                  selectedItem?.pn === item.pn &&
                  selectedItem?.desc === (item.title || item.description);
                return (
                  <div
                    key={item.id}
                    className={`${styles.resultRow}${isSelected ? ` ${styles.resultRowSelected}` : ""}`}
                    onClick={() =>
                      handleItemClick(
                        item.pn || "",
                        item.title || item.description || "",
                      )
                    }
                    onDoubleClick={() =>
                      handleItemDoubleClick(
                        item.pn || "",
                        item.title || item.description || "",
                      )
                    }
                  >
                    <div className={styles.colPhoto}>
                      {item.imageUrl && (
                        <img
                          className={styles.favThumb}
                          src={item.imageUrl}
                          alt=""
                          style={{ cursor: "zoom-in" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewPhotoUrl(item.imageUrl);
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                    </div>
                    <div className={`${styles.colPn} ${styles.mono}`}>
                      {item.pn || "—"}
                    </div>
                    <div className={styles.colDesc}>
                      {item.title || item.description || "—"}
                      {item.keyword && (
                        <span className={styles.childBadge}>
                          {item.keyword}
                        </span>
                      )}
                    </div>
                    <div className={styles.colDatasheet}>
                      {item.attachmentUrl && (
                        <a
                          className={styles.datasheetLink}
                          href={item.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title={item.attachmentFileName || "View datasheet"}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                          <span>PDF</span>
                        </a>
                      )}
                    </div>
                    <div className={styles.colAction}>
                      <button
                        className={styles.selectBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(
                            item.pn || "",
                            item.title || item.description || "",
                          );
                        }}
                        title="Select"
                      >
                        {CheckIcon}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ──────── Tab content renderer ──────── */

  const renderTabContent = (): JSX.Element => {
    switch (activeTab) {
      case "favorites":
        return renderFavorites();
      case "assets":
        return renderAssetsCatalog();
      case "bom":
        return renderBomCosts();
      case "quotations":
        return renderQuotations();
      case "query":
        return renderQueryConsulting();
      default:
        return <div />;
    }
  };

  /* ──────── Render ──────── */

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <span>Import Equipment</span>
            </div>
            <button className={styles.closeBtn} onClick={onClose} title="Close">
              {CloseIcon}
            </button>
          </div>

          {/* Tab bar */}
          <div className={styles.tabBar}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab}${activeTab === tab.id ? ` ${styles.tabActive}` : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>{SearchIcon}</span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder={
                activeTab === "favorites"
                  ? "Filter by PN or description…"
                  : "Search by PN or description…"
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <button
                className={styles.searchClear}
                onClick={() => setSearch("")}
                title="Clear"
              >
                {CloseIcon}
              </button>
            )}
          </div>

          {/* Tab content */}
          <div className={styles.body}>{renderTabContent()}</div>

          {/* Footer */}
          <div className={styles.footer}>
            {selectedItem && (
              <div className={styles.selectedPreview}>
                <span className={styles.selectedLabel}>Selected:</span>
                <span className={`${styles.selectedPn} ${styles.mono}`}>
                  {selectedItem.pn || "—"}
                </span>
                <span className={styles.selectedSep}>—</span>
                <span className={styles.selectedDesc}>
                  {selectedItem.desc || "—"}
                </span>
                {selectedItem.subs && selectedItem.subs.length > 0 && (
                  <span className={styles.selectedSubsBadge}>
                    +{selectedItem.subs.length} sub-item
                    {selectedItem.subs.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}
            <div className={styles.footerBtns}>
              <button className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                disabled={!selectedItem}
                onClick={handleConfirm}
              >
                {CheckIcon}
                <span>Confirm</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {previewPhotoUrl && (
        <PhotoLightbox
          url={previewPhotoUrl}
          onClose={() => setPreviewPhotoUrl(null)}
        />
      )}
    </>
  );
};
