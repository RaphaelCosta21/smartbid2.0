import * as React from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { mockKnowledgeBase } from "../data/mockKnowledgeBase";
import { KnowledgeBaseService } from "../services/KnowledgeBaseService";
import { SPService } from "../services/SPService";
import { formatFileSize, formatRelativeTime } from "../utils/formatters";
import { useDebounce } from "../hooks/useDebounce";

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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "1px solid var(--border-subtle)",
          background: "var(--card-bg)",
          color: "var(--text-primary)",
          fontSize: 14,
          outline: "none",
        }}
      />

      {/* Categories */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border:
                activeCategory === cat
                  ? "none"
                  : "1px solid var(--border-subtle)",
              background:
                activeCategory === cat
                  ? "var(--accent-color, #3B82F6)"
                  : "transparent",
              color: activeCategory === cat ? "#fff" : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeCategory === cat ? 600 : 400,
            }}
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 16,
          }}
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                padding: 20,
                borderRadius: 12,
                border: "1px solid var(--border-subtle)",
                background: "var(--card-bg)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: 24 }}>
                  {CATEGORY_LABELS[item.category]?.icon || "📄"}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                  {item.viewCount} views
                </span>
              </div>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
                {item.title}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 1.4,
                }}
              >
                {item.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "2px 8px",
                      borderRadius: 4,
                      background: "var(--border-subtle)",
                      fontSize: 11,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  marginTop: 4,
                }}
              >
                <span>By {item.createdBy}</span>
                <span>{formatRelativeTime(item.lastModified)}</span>
              </div>
              {item.fileName && (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--accent-color, #3B82F6)",
                  }}
                >
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
