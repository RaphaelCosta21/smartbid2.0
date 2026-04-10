import * as React from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { mockKnowledgeBase } from "../data/mockKnowledgeBase";
import { KnowledgeBaseService } from "../services/KnowledgeBaseService";
import { SPService } from "../services/SPService";
import { formatFileSize, formatRelativeTime } from "../utils/formatters";
import { useDebounce } from "../hooks/useDebounce";
import styles from "./KnowledgeBasePage.module.scss";

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  datasheets: { label: "Datasheets", icon: "📄" },
  "past-bids": { label: "Past Bids", icon: "📋" },
  manuals: { label: "Manuals", icon: "📘" },
  "lessons-learned": { label: "Lessons Learned", icon: "💡" },
  templates: { label: "Templates", icon: "📦" },
  procedures: { label: "Procedures", icon: "📝" },
};

export const KnowledgeBasePage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [activeCategory, setActiveCategory] = React.useState<string>(
    category || "all",
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const [items, setItems] = React.useState(mockKnowledgeBase);
  const debouncedSearch = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    if (SPService.isInitialized) {
      KnowledgeBaseService.getAll()
        .then((data) => {
          if (data.length > 0) setItems(data);
        })
        .catch(() => {
          /* fall back to mock data */
        });
    }
  }, []);

  const categories = ["all", ...Object.keys(CATEGORY_LABELS)];

  const filteredItems = React.useMemo(() => {
    let result = items;
    if (activeCategory !== "all") {
      result = result.filter((item) => item.category === activeCategory);
    }
    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().indexOf(lower) >= 0 ||
          item.description.toLowerCase().indexOf(lower) >= 0 ||
          item.tags.some((t) => t.toLowerCase().indexOf(lower) >= 0),
      );
    }
    return result;
  }, [activeCategory, debouncedSearch, items]);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Knowledge Base"
        subtitle={`${filteredItems.length} items available`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          </svg>
        }
      />

      {/* Search */}
      <input
        type="text"
        placeholder="Search knowledge base..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {/* Categories */}
      <div className={styles.tabBar}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`${styles.tabBtn} ${activeCategory === cat ? styles.tabBtnActive : ""}`}
          >
            {cat === "all"
              ? "All"
              : `${CATEGORY_LABELS[cat]?.icon} ${CATEGORY_LABELS[cat]?.label}`}
          </button>
        ))}
      </div>

      {/* Items */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="No items found"
          description="Try adjusting your search or category filter."
        />
      ) : (
        <div className={styles.cardGrid}>
          {filteredItems.map((item) => (
            <div key={item.id} className={styles.kbCard}>
              <div className={styles.kbCardHeader}>
                <span className={styles.kbIcon}>
                  {CATEGORY_LABELS[item.category]?.icon || "📄"}
                </span>
                <span className={styles.kbViews}>{item.viewCount} views</span>
              </div>
              <h4 className={styles.kbTitle}>{item.title}</h4>
              <p className={styles.kbDescription}>{item.description}</p>
              <div className={styles.kbTags}>
                {item.tags.map((tag) => (
                  <span key={tag} className={styles.kbTag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className={styles.kbMeta}>
                <span>By {item.createdBy}</span>
                <span>{formatRelativeTime(item.lastModified)}</span>
              </div>
              {item.fileName && (
                <div className={styles.kbFile}>
                  📎 {item.fileName}{" "}
                  {item.fileSize ? `(${formatFileSize(item.fileSize)})` : ""}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
