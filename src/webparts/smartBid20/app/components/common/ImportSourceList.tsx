import * as React from "react";
import { useConfigStore } from "../../stores/useConfigStore";
import styles from "./ImportSourceList.module.scss";

export interface IImportSource {
  id: string;
  type: "bid" | "template";
  title: string;
  subtitle: string;
  division: string;
  serviceLine: string;
  date: string;
  itemCount: number;
  itemLabel: string;
  tags: string[];
  sourceData: any;
}

interface ImportSourceListProps {
  sources: IImportSource[];
  isLoading: boolean;
  onSelect: (source: IImportSource) => void;
  currentDivision?: string;
}

export const ImportSourceList: React.FC<ImportSourceListProps> = ({
  sources,
  isLoading,
  onSelect,
  currentDivision,
}) => {
  const config = useConfigStore((s) => s.config);
  const [search, setSearch] = React.useState("");
  const [filterDivision, setFilterDivision] = React.useState<string>(
    currentDivision || "",
  );
  const [filterServiceLine, setFilterServiceLine] = React.useState<string>("");
  const [filterType, setFilterType] = React.useState<
    "all" | "bid" | "template"
  >("all");

  // Get unique divisions and service lines from config
  const divisions: string[] = React.useMemo(() => {
    if (config && config.divisions) {
      return config.divisions
        .filter((d) => d.isActive !== false)
        .map((d) => d.value);
    }
    return [];
  }, [config]);

  const serviceLines: string[] = React.useMemo(() => {
    if (config && config.serviceLines) {
      return config.serviceLines
        .filter((s) => s.isActive !== false)
        .map((s) => s.value);
    }
    return [];
  }, [config]);

  // Filter and search sources
  const filteredSources = React.useMemo(() => {
    let result = sources;

    // Filter by type
    if (filterType !== "all") {
      result = result.filter((s) => s.type === filterType);
    }

    // Filter by division
    if (filterDivision) {
      result = result.filter((s) => s.division === filterDivision);
    }

    // Filter by service line
    if (filterServiceLine) {
      result = result.filter((s) => s.serviceLine === filterServiceLine);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((s) => {
        return (
          s.title.toLowerCase().indexOf(q) >= 0 ||
          s.subtitle.toLowerCase().indexOf(q) >= 0 ||
          s.division.toLowerCase().indexOf(q) >= 0 ||
          s.serviceLine.toLowerCase().indexOf(q) >= 0 ||
          s.tags.some((tag) => tag.toLowerCase().indexOf(q) >= 0)
        );
      });
    }

    // Sort: templates first, then by date descending
    result = result.slice().sort((a, b) => {
      if (a.type !== b.type) return a.type === "template" ? -1 : 1;
      return (b.date || "").localeCompare(a.date || "");
    });

    return result;
  }, [sources, search, filterDivision, filterServiceLine, filterType]);

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading sources...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Search & Filters */}
      <div className={styles.filtersBar}>
        <div className={styles.searchWrapper}>
          <svg
            className={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by title, BID number, CRM, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch("")}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className={styles.filterGroup}>
          {/* Type filter pills */}
          <div className={styles.typePills}>
            <button
              className={`${styles.pill} ${filterType === "all" ? styles.pillActive : ""}`}
              onClick={() => setFilterType("all")}
            >
              All
            </button>
            <button
              className={`${styles.pill} ${filterType === "bid" ? styles.pillActive : ""}`}
              onClick={() => setFilterType("bid")}
            >
              BIDs
            </button>
            <button
              className={`${styles.pill} ${filterType === "template" ? styles.pillActive : ""}`}
              onClick={() => setFilterType("template")}
            >
              Templates
            </button>
          </div>

          {/* Division filter */}
          <select
            className={styles.filterSelect}
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
          >
            <option value="">All Divisions</option>
            {divisions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Service Line filter */}
          <select
            className={styles.filterSelect}
            value={filterServiceLine}
            onChange={(e) => setFilterServiceLine(e.target.value)}
          >
            <option value="">All Service Lines</option>
            {serviceLines.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className={styles.resultsInfo}>
        <span className={styles.resultsCount}>
          {filteredSources.length} source
          {filteredSources.length !== 1 ? "s" : ""} found
        </span>
        {(filterDivision ||
          filterServiceLine ||
          filterType !== "all" ||
          search) && (
          <button
            className={styles.clearFiltersBtn}
            onClick={() => {
              setSearch("");
              setFilterDivision("");
              setFilterServiceLine("");
              setFilterType("all");
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Source List */}
      <div className={styles.list}>
        {filteredSources.length === 0 ? (
          <div className={styles.empty}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.4"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p>No sources match your filters</p>
            <span>Try adjusting the search or filter criteria</span>
          </div>
        ) : (
          filteredSources.map((source) => (
            <button
              key={source.id}
              className={styles.sourceCard}
              onClick={() => onSelect(source)}
            >
              <div className={styles.cardLeft}>
                <div className={styles.cardHeader}>
                  <span
                    className={`${styles.typeBadge} ${source.type === "bid" ? styles.bidBadge : styles.templateBadge}`}
                  >
                    {source.type === "bid" ? "BID" : "TPL"}
                  </span>
                  <span className={styles.cardTitle}>{source.title}</span>
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.cardSubtitle}>{source.subtitle}</span>
                  {source.division && (
                    <span className={styles.divisionTag}>
                      {source.division}
                    </span>
                  )}
                  {source.serviceLine && (
                    <span className={styles.serviceLineTag}>
                      {source.serviceLine}
                    </span>
                  )}
                </div>
                {source.tags.length > 0 && (
                  <div className={styles.tagsRow}>
                    {source.tags.slice(0, 4).map((tag, idx) => (
                      <span key={idx} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                    {source.tags.length > 4 && (
                      <span className={styles.tagMore}>
                        +{source.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.cardRight}>
                <div className={styles.itemBadge}>
                  <span className={styles.itemCount}>
                    {Math.round(source.itemCount)}
                  </span>
                  <span className={styles.itemLbl}>{source.itemLabel}</span>
                </div>
                {source.date && (
                  <span className={styles.cardDate}>
                    {formatDate(source.date)}
                  </span>
                )}
                <svg
                  className={styles.chevron}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
