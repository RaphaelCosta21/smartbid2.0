import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { useTemplates } from "../hooks/useTemplates";
import { DIVISION_COLORS } from "../utils/constants";
import { format } from "date-fns";

export const TemplatesPage: React.FC = () => {
  const { templates } = useTemplates();
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!search) return templates;
    const q = search.toLowerCase();
    return templates.filter(
      (t: any) =>
        t.name.toLowerCase().includes(q) ||
        t.division.toLowerCase().includes(q) ||
        t.tags.some((tag: string) => tag.toLowerCase().includes(q)),
    );
  }, [search, templates]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader
        title="Templates"
        subtitle={`${templates.length} equipment templates available`}
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

      {/* Search */}
      <input
        type="text"
        placeholder="Search templates by name, division, or tag..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px 16px",
          borderRadius: 10,
          border: "1px solid var(--border-subtle)",
          background: "var(--card-bg)",
          color: "var(--text-primary)",
          fontSize: 14,
          maxWidth: 400,
        }}
      />

      {/* Template Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {filtered.map((tpl) => (
          <GlassCard key={tpl.id}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 4,
                  }}
                >
                  {tpl.name}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <StatusBadge
                    status={tpl.division}
                    color={DIVISION_COLORS[tpl.division]}
                  />
                  <StatusBadge status={tpl.serviceLine} />
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: tpl.isActive ? "#10b98120" : "#ef444420",
                  color: tpl.isActive ? "#10b981" : "#ef4444",
                  fontWeight: 600,
                }}
              >
                {tpl.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <p
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                lineHeight: 1.5,
                margin: "0 0 12px",
              }}
            >
              {tpl.description}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 12,
              }}
            >
              {tpl.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    background: "var(--card-bg-elevated)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-subtle)",
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
                fontSize: 11,
                color: "var(--text-muted)",
              }}
            >
              <span>{tpl.equipmentItems.length} items</span>
              <span>Used {tpl.usageCount}x</span>
              <span>By {tpl.createdBy}</span>
            </div>
            {tpl.lastModified && (
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  marginTop: 4,
                }}
              >
                Last modified:{" "}
                {format(new Date(tpl.lastModified), "MMM d, yyyy")}
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
