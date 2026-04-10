import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { useTemplates } from "../hooks/useTemplates";
import { DIVISION_COLORS } from "../utils/constants";
import { format } from "date-fns";
import styles from "./TemplatesPage.module.scss";

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
    <div className={styles.page}>
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
        className={styles.searchInput}
      />

      {/* Template Grid */}
      <div className={styles.cardGrid}>
        {filtered.map((tpl) => (
          <GlassCard key={tpl.id}>
            <div className={styles.tplHeader}>
              <div>
                <div className={styles.tplName}>{tpl.name}</div>
                <div className={styles.tplBadges}>
                  <StatusBadge
                    status={tpl.division}
                    color={DIVISION_COLORS[tpl.division]}
                  />
                  <StatusBadge status={tpl.serviceLine} />
                </div>
              </div>
              <span
                className={`${styles.tplStatusBadge} ${tpl.isActive ? styles.tplActive : styles.tplInactive}`}
              >
                {tpl.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <p className={styles.tplDescription}>{tpl.description}</p>

            <div className={styles.tplTags}>
              {tpl.tags.map((tag) => (
                <span key={tag} className={styles.tplTag}>
                  {tag}
                </span>
              ))}
            </div>

            <div className={styles.tplMeta}>
              <span>{tpl.equipmentItems.length} items</span>
              <span>Used {tpl.usageCount}x</span>
              <span>By {tpl.createdBy}</span>
            </div>
            {tpl.lastModified && (
              <div className={styles.tplDate}>
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
