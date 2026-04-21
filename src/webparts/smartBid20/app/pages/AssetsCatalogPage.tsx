import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { AssetCatalogService } from "../services/AssetCatalogService";
import { IAssetCatalogItem } from "../models/IAssetCatalog";
import { useDebounce } from "../hooks/useDebounce";
import styles from "./AssetsCatalogPage.module.scss";

type ViewMode = "grid" | "list";

const dash = (val: string): string => (val ? val : "—");

/** Return a CSS class for a status value based on common keywords */
const getStatusClass = (status: string): string => {
  const s = status.toLowerCase();
  if (s === "approved" || s === "active" || s === "in stock")
    return styles.statusActive;
  if (s === "inactive" || s === "pending" || s === "on hold" || s === "draft")
    return styles.statusInactive;
  if (
    s === "deprecated" ||
    s === "rejected" ||
    s === "retired" ||
    s === "discontinued"
  )
    return styles.statusDeprecated;
  return styles.statusActive;
};

export const AssetsCatalogPage: React.FC = () => {
  const [items, setItems] = React.useState<IAssetCatalogItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedKeyword, setSelectedKeyword] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const [selectedAsset, setSelectedAsset] =
    React.useState<IAssetCatalogItem | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    setIsLoading(true);
    AssetCatalogService.getAll()
      .then((data) => {
        setItems(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load assets catalog:", err);
        setIsLoading(false);
      });
  }, []);

  // Extract unique keywords (categories)
  const keywords = React.useMemo(() => {
    const set: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.keyword) {
        set[item.keyword] = true;
      }
    });
    const sorted = Object.keys(set);
    sorted.sort();
    return sorted;
  }, [items]);

  // Extract unique statuses from data
  const statuses = React.useMemo(() => {
    const set: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.status) {
        set[item.status] = true;
      }
    });
    const sorted = Object.keys(set);
    sorted.sort();
    return sorted;
  }, [items]);

  // Filtered items
  const filteredItems = React.useMemo(() => {
    let result = items;

    if (selectedKeyword !== "all") {
      result = result.filter((item) => item.keyword === selectedKeyword);
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      result = result.filter(
        (item) =>
          (item.title && item.title.toLowerCase().indexOf(lower) >= 0) ||
          (item.pn && item.pn.toLowerCase().indexOf(lower) >= 0) ||
          (item.description &&
            item.description.toLowerCase().indexOf(lower) >= 0) ||
          (item.commonlyUsedNames &&
            item.commonlyUsedNames.toLowerCase().indexOf(lower) >= 0) ||
          (item.keyword && item.keyword.toLowerCase().indexOf(lower) >= 0) ||
          (item.subtitle && item.subtitle.toLowerCase().indexOf(lower) >= 0),
      );
    }

    return result;
  }, [items, selectedKeyword, statusFilter, debouncedSearch]);

  const clearFilters = (): void => {
    setSearchTerm("");
    setSelectedKeyword("all");
    setStatusFilter("all");
  };

  const hasActiveFilters =
    searchTerm !== "" || selectedKeyword !== "all" || statusFilter !== "all";

  return (
    <div className={styles.page}>
      <PageHeader
        title="Assets Catalog"
        subtitle={`${filteredItems.length} of ${items.length} assets`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0022 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        }
      />

      {/* Toolbar: Search + Filters + View Toggle */}
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
            type="text"
            placeholder="Search by title, PN, description, keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              className={styles.clearBtn}
              onClick={() => setSearchTerm("")}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.filterGroup}>
          <select
            value={selectedKeyword}
            onChange={(e) => setSelectedKeyword(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Categories</option>
            {keywords.map((kw) => (
              <option key={kw} value={kw}>
                {kw}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button className={styles.clearFiltersBtn} onClick={clearFilters}>
              Clear Filters
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
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
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

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className={styles.filterPills}>
          {selectedKeyword !== "all" && (
            <span className={styles.pill}>
              Category: {selectedKeyword}
              <button
                className={styles.pillClose}
                onClick={() => setSelectedKeyword("all")}
              >
                ✕
              </button>
            </span>
          )}
          {statusFilter !== "all" && (
            <span className={styles.pill}>
              Status: {statusFilter}
              <button
                className={styles.pillClose}
                onClick={() => setStatusFilter("all")}
              >
                ✕
              </button>
            </span>
          )}
          {debouncedSearch && (
            <span className={styles.pill}>
              Search: &quot;{debouncedSearch}&quot;
              <button
                className={styles.pillClose}
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            </span>
          )}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Loading assets...</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredItems.length === 0 && (
        <EmptyState
          title="No assets found"
          description={
            hasActiveFilters
              ? "Try adjusting your search or filters."
              : "The Assets Catalog list appears to be empty."
          }
        />
      )}

      {/* Grid view */}
      {!isLoading && filteredItems.length > 0 && viewMode === "grid" && (
        <div className={styles.cardGrid}>
          {filteredItems.map((asset) => (
            <div
              key={asset.id}
              className={styles.assetCard}
              onClick={() => setSelectedAsset(asset)}
            >
              <div className={styles.cardImageWrapper}>
                {asset.imageUrl ? (
                  <img
                    src={asset.imageUrl}
                    alt={asset.title}
                    className={styles.cardImage}
                  />
                ) : (
                  <div className={styles.cardImagePlaceholder}>
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
                {asset.status && (
                  <span
                    className={`${styles.statusBadge} ${getStatusClass(asset.status)}`}
                  >
                    {asset.status}
                  </span>
                )}
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardCategory}>{dash(asset.keyword)}</div>
                <h4 className={styles.cardTitle}>{dash(asset.title)}</h4>
                {asset.subtitle && (
                  <p className={styles.cardSubtitle}>{asset.subtitle}</p>
                )}
                <p className={styles.cardPn}>PN: {dash(asset.pn)}</p>
                <p className={styles.cardDescription}>
                  {asset.description
                    ? asset.description.length > 120
                      ? asset.description.substring(0, 120) + "..."
                      : asset.description
                    : "—"}
                </p>

                {(asset.features1 || asset.features2 || asset.features3) && (
                  <div className={styles.cardFeatures}>
                    {asset.features1 && (
                      <span className={styles.featureChip}>
                        {asset.features1}
                      </span>
                    )}
                    {asset.features2 && (
                      <span className={styles.featureChip}>
                        {asset.features2}
                      </span>
                    )}
                    {asset.features3 && (
                      <span className={styles.featureChip}>
                        {asset.features3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.cardFooter}>
                {asset.emailForSupport && (
                  <span
                    className={styles.cardEmail}
                    title={asset.emailForSupport}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    {asset.emailForSupport}
                  </span>
                )}
                {asset.attachmentUrl && (
                  <a
                    href={asset.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cardAttachment}
                    onClick={(e) => e.stopPropagation()}
                    title={asset.attachmentFileName || "Download PDF"}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    PDF
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {!isLoading && filteredItems.length > 0 && viewMode === "list" && (
        <div className={styles.listTable}>
          <div className={styles.listHeader}>
            <div className={styles.colImage}>Image</div>
            <div className={styles.colTitle}>Title / PN</div>
            <div className={styles.colCategory}>Category</div>
            <div className={styles.colDescription}>Description</div>
            <div className={styles.colStatus}>Status</div>
            <div className={styles.colFeatures}>Features</div>
            <div className={styles.colActions}>Actions</div>
          </div>
          {filteredItems.map((asset) => (
            <div
              key={asset.id}
              className={styles.listRow}
              onClick={() => setSelectedAsset(asset)}
            >
              <div className={styles.colImage}>
                {asset.imageUrl ? (
                  <img
                    src={asset.imageUrl}
                    alt={asset.title}
                    className={styles.listThumb}
                  />
                ) : (
                  <div className={styles.listThumbPlaceholder}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
              </div>
              <div className={styles.colTitle}>
                <span className={styles.listTitle}>{dash(asset.title)}</span>
                <span className={styles.listPn}>PN: {dash(asset.pn)}</span>
              </div>
              <div className={styles.colCategory}>
                <span className={styles.categoryTag}>
                  {dash(asset.keyword)}
                </span>
              </div>
              <div className={styles.colDescription}>
                <span className={styles.listDesc}>
                  {asset.description
                    ? asset.description.length > 100
                      ? asset.description.substring(0, 100) + "..."
                      : asset.description
                    : "—"}
                </span>
              </div>
              <div className={styles.colStatus}>
                <span
                  className={`${styles.statusBadgeSmall} ${getStatusClass(asset.status)}`}
                >
                  {dash(asset.status)}
                </span>
              </div>
              <div className={styles.colFeatures}>
                {asset.features1 && (
                  <span className={styles.featureChipSmall}>
                    {asset.features1}
                  </span>
                )}
                {asset.features2 && (
                  <span className={styles.featureChipSmall}>
                    {asset.features2}
                  </span>
                )}
              </div>
              <div className={styles.colActions}>
                {asset.attachmentUrl && (
                  <a
                    href={asset.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.listAttachBtn}
                    onClick={(e) => e.stopPropagation()}
                    title="Download PDF"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedAsset && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedAsset(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => setSelectedAsset(null)}
            >
              ✕
            </button>

            <div className={styles.modalLayout}>
              {/* Left: Image */}
              <div className={styles.modalImageSection}>
                {selectedAsset.imageUrl ? (
                  <img
                    src={selectedAsset.imageUrl}
                    alt={selectedAsset.title}
                    className={styles.modalImage}
                  />
                ) : (
                  <div className={styles.modalImagePlaceholder}>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>No image available</span>
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className={styles.modalDetails}>
                <div className={styles.modalHeader}>
                  <div className={styles.modalCategoryBadge}>
                    {dash(selectedAsset.keyword)}
                  </div>
                  {selectedAsset.status && (
                    <span
                      className={`${styles.statusBadge} ${getStatusClass(selectedAsset.status)}`}
                    >
                      {selectedAsset.status}
                    </span>
                  )}
                </div>
                <h2 className={styles.modalTitle}>
                  {dash(selectedAsset.title)}
                </h2>
                {selectedAsset.subtitle && (
                  <p className={styles.modalSubtitle}>
                    {selectedAsset.subtitle}
                  </p>
                )}

                <div className={styles.modalInfoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Part Number</span>
                    <span className={styles.infoValue}>
                      {dash(selectedAsset.pn)}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Category</span>
                    <span className={styles.infoValue}>
                      {dash(selectedAsset.keyword)}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email for Support</span>
                    <span className={styles.infoValue}>
                      {selectedAsset.emailForSupport ? (
                        <a
                          href={`mailto:${selectedAsset.emailForSupport}`}
                          className={styles.emailLink}
                        >
                          {selectedAsset.emailForSupport}
                        </a>
                      ) : (
                        "—"
                      )}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      Commonly Used Names
                    </span>
                    <span className={styles.infoValue}>
                      {dash(selectedAsset.commonlyUsedNames)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className={styles.modalSection}>
                  <h3 className={styles.sectionTitle}>Description</h3>
                  <p className={styles.sectionText}>
                    {dash(selectedAsset.description)}
                  </p>
                </div>

                {/* Features */}
                {(selectedAsset.features1 ||
                  selectedAsset.features2 ||
                  selectedAsset.features3) && (
                  <div className={styles.modalSection}>
                    <h3 className={styles.sectionTitle}>Features</h3>
                    <div className={styles.featuresList}>
                      {selectedAsset.features1 && (
                        <div className={styles.featureItem}>
                          <span className={styles.featureDot} />
                          {selectedAsset.features1}
                        </div>
                      )}
                      {selectedAsset.features2 && (
                        <div className={styles.featureItem}>
                          <span className={styles.featureDot} />
                          {selectedAsset.features2}
                        </div>
                      )}
                      {selectedAsset.features3 && (
                        <div className={styles.featureItem}>
                          <span className={styles.featureDot} />
                          {selectedAsset.features3}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Comments */}
                {selectedAsset.comments && (
                  <div className={styles.modalSection}>
                    <h3 className={styles.sectionTitle}>Comments</h3>
                    <p className={styles.sectionText}>
                      {selectedAsset.comments}
                    </p>
                  </div>
                )}

                {/* Attachment */}
                {selectedAsset.attachmentUrl && (
                  <div className={styles.modalSection}>
                    <h3 className={styles.sectionTitle}>Attachment</h3>
                    <a
                      href={selectedAsset.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.attachmentLink}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                      {selectedAsset.attachmentFileName || "Download PDF"}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
