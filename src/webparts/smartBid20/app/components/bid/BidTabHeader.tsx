/** Unified glass header for the BID Details scope & costing tabs. */
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { EditControls, TabEditContext } from "../common/EditLockBanner";
import { DivisionContext } from "../common/IntegratedDivisionTabs";
import styles from "./BidTabHeader.module.scss";

export interface IHeaderStat {
  label: string;
  value: React.ReactNode;
  sub?: string;
  tone?: "default" | "warning" | "success";
}

export interface IHeaderHero {
  label: string;
  value: string;
  sub?: React.ReactNode;
}

interface BidTabHeaderProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  /** Extra chips next to the title (e.g. service line) */
  meta?: React.ReactNode;
  hero?: IHeaderHero;
  stats?: IHeaderStat[];
  /** Composition bars rendered above the stats */
  children?: React.ReactNode;
  /** Status / FX chips */
  footer?: React.ReactNode;
  /** Metrics only, no title row (tab embedded outside BID Details) */
  compact?: boolean;
}

/** Headers the user collapsed during this page session (keyed by title) */
const collapsedHeaders = new Set<string>();

export const BidTabHeader: React.FC<BidTabHeaderProps> = ({
  title,
  subtitle,
  icon,
  meta,
  hero,
  stats,
  children,
  footer,
  compact,
}) => {
  const edit = React.useContext(TabEditContext);
  const division = React.useContext(DivisionContext);
  const [expanded, setExpanded] = React.useState(
    () => !collapsedHeaders.has(title),
  );
  const hasStats = !!stats && stats.length > 0;
  const hasDetail = !!children || hasStats;
  const isOpen = compact || expanded;

  const toggleExpanded = (): void => {
    if (expanded) collapsedHeaders.add(title);
    else collapsedHeaders.delete(title);
    setExpanded(!expanded);
  };

  return (
    <section
      className={`${styles.panel} ${compact ? styles.compact : ""}`}
      aria-label={title}
    >
      {!compact && (
        <div className={styles.titleRow}>
          <span className={styles.iconChip} aria-hidden="true">
            {icon}
          </span>
          <div className={styles.titleBlock}>
            <h3 className={styles.title}>{title}</h3>
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </div>
          {division && division.divisions.length > 1 && (
            <div
              className={styles.segmented}
              role="tablist"
              aria-label="Division"
            >
              {division.divisions.map((d) => (
                <button
                  key={d}
                  type="button"
                  role="tab"
                  aria-selected={division.active === d}
                  className={`${styles.segment} ${division.active === d ? styles.segmentActive : ""}`}
                  onClick={() => division.setActive(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
          {division && division.divisions.length === 1 && division.active && (
            <span className={styles.divisionChip}>{division.active}</span>
          )}
          {meta && <div className={styles.meta}>{meta}</div>}
          <div className={styles.actions}>
            {edit && (
              <EditControls
                editControl={edit.editControl}
                canEdit={edit.canEdit}
              />
            )}
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={toggleExpanded}
              aria-expanded={expanded}
              aria-label={expanded ? "Collapse summary" : "Expand summary"}
              title={expanded ? "Collapse summary" : "Expand summary"}
            >
              <ChevronDown
                size={16}
                className={`${styles.toggleIcon} ${expanded ? styles.toggleIconOpen : ""}`}
              />
            </button>
          </div>
        </div>
      )}

      <div
        className={`${styles.collapsible} ${isOpen ? "" : styles.collapsed}`}
        aria-hidden={!isOpen}
      >
        <div className={styles.collapsibleInner}>
          {(hero || hasDetail) && (
            <div
              className={`${styles.body} ${hero && hasDetail ? "" : styles.bodySingle}`}
            >
              {hero && (
                <div className={styles.hero}>
                  <span className={styles.heroLabel}>{hero.label}</span>
                  <span className={styles.heroValue}>{hero.value}</span>
                  {hero.sub && (
                    <span className={styles.heroSub}>{hero.sub}</span>
                  )}
                </div>
              )}
              {hasDetail && (
                <div className={styles.detail}>
                  {children}
                  {hasStats && (
                    <div className={styles.statsClip}>
                      <div className={styles.stats}>
                        {(stats || []).map((s) => (
                          <div
                            key={s.label}
                            className={`${styles.stat} ${s.tone === "warning" ? styles.statWarning : s.tone === "success" ? styles.statSuccess : ""}`}
                          >
                            <span className={styles.statLabel}>{s.label}</span>
                            <span className={styles.statValue}>{s.value}</span>
                            {s.sub && (
                              <span className={styles.statSub}>{s.sub}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </div>
    </section>
  );
};

/* ─── Composition bar ─── */

export interface IShareSegment {
  label: string;
  value: number;
  /** Extra legend text, e.g. "12 items" */
  detail?: string;
  /** Grey segment (uncategorized / other) */
  neutral?: boolean;
}

interface ShareBarProps {
  title?: string;
  segments: IShareSegment[];
  format: (value: number) => string;
  emptyLabel?: string;
  maxSegments?: number;
}

const SEG_CLASSES = [
  styles.seg0,
  styles.seg1,
  styles.seg2,
  styles.seg3,
  styles.seg4,
];

const formatPct = (pct: number): string =>
  pct > 0 && pct < 1 ? "<1%" : `${Math.round(pct)}%`;

export const ShareBar: React.FC<ShareBarProps> = ({
  title,
  segments,
  format,
  emptyLabel = "Nothing to show yet",
  maxSegments = 5,
}) => {
  const visible = segments.filter((s) => s.value > 0);
  let shown = visible;
  if (visible.length > maxSegments) {
    const rest = visible.slice(maxSegments - 1);
    shown = visible.slice(0, maxSegments - 1).concat({
      label: "Other",
      value: rest.reduce((sum, s) => sum + s.value, 0),
      detail: `${rest.length} more`,
      neutral: true,
    });
  }
  const total = shown.reduce((sum, s) => sum + s.value, 0);

  let colorIdx = 0;
  const colored = shown.map((s) => {
    const cls = s.neutral
      ? styles.segNeutral
      : SEG_CLASSES[Math.min(colorIdx++, SEG_CLASSES.length - 1)];
    return { ...s, cls, pct: total > 0 ? (s.value / total) * 100 : 0 };
  });

  const ariaLabel = `${title ? `${title}: ` : ""}${colored
    .map((s) => `${s.label} ${formatPct(s.pct)}`)
    .join(", ")}`;

  return (
    <div className={styles.share}>
      {title && <span className={styles.shareTitle}>{title}</span>}
      <div
        className={styles.track}
        role="img"
        aria-label={total > 0 ? ariaLabel : emptyLabel}
      >
        {colored.map((s) => (
          <span
            key={s.label}
            className={`${styles.seg} ${s.cls}`}
            style={{ flexGrow: s.value }}
            title={`${s.label}: ${format(s.value)} (${formatPct(s.pct)})`}
          />
        ))}
      </div>
      {total > 0 ? (
        <ul className={styles.legend}>
          {colored.map((s) => (
            <li key={s.label} className={styles.legendItem}>
              <span className={`${styles.dot} ${s.cls}`} aria-hidden="true" />
              <span className={styles.legendLabel}>{s.label}</span>
              <span className={styles.legendValue}>{format(s.value)}</span>
              <span className={styles.legendMuted}>
                {formatPct(s.pct)}
                {s.detail ? ` · ${s.detail}` : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <span className={styles.shareEmpty}>{emptyLabel}</span>
      )}
    </div>
  );
};

/* ─── Status chip ─── */

interface HeaderChipProps {
  tone?: "neutral" | "success" | "warning" | "danger" | "accent";
  icon?: React.ReactNode;
  title?: string;
  /** 0..1, renders a small meter inside the chip */
  progress?: number;
  onClick?: () => void;
  expanded?: boolean;
  children: React.ReactNode;
}

const CHIP_TONES: Record<NonNullable<HeaderChipProps["tone"]>, string> = {
  neutral: styles.chipNeutral,
  success: styles.chipSuccess,
  warning: styles.chipWarning,
  danger: styles.chipDanger,
  accent: styles.chipAccent,
};

export const HeaderChip: React.FC<HeaderChipProps> = ({
  tone = "neutral",
  icon,
  title,
  progress,
  onClick,
  expanded,
  children,
}) => {
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {progress !== undefined && (
        <span className={styles.chipMeter} aria-hidden="true">
          <span
            className={styles.chipMeterFill}
            style={{
              width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
            }}
          />
        </span>
      )}
      {onClick && (
        <ChevronDown
          size={14}
          className={`${styles.chipChevron} ${expanded ? styles.chipChevronOpen : ""}`}
        />
      )}
    </>
  );
  const cls = `${styles.chip} ${CHIP_TONES[tone]}`;
  return onClick ? (
    <button
      type="button"
      className={`${cls} ${styles.chipButton}`}
      title={title}
      onClick={onClick}
      aria-expanded={expanded}
    >
      {content}
    </button>
  ) : (
    <span className={cls} title={title}>
      {content}
    </span>
  );
};

export default BidTabHeader;
