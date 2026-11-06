/** Unified glass header for the BID Details scope & costing tabs. */
import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { EditControls, TabEditContext } from "../common/EditLockBanner";
import { DivisionContext } from "../common/IntegratedDivisionTabs";
import { useStickyCollapse } from "../../hooks/useStickyCollapse";
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

/** Items still missing data, shown as a progress ring in the stuck bar */
export interface IHeaderPending {
  missing: number;
  total: number;
  /** e.g. "missing cost" */
  label: string;
  /** Shown when nothing is missing, e.g. "All costed" */
  doneLabel?: string;
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
  /** Pins to the top of the page on scroll and auto-collapses into a slim bar */
  sticky?: boolean;
  /** Key figures kept in the slim bar, next to the hero value */
  pinned?: IHeaderStat[];
  pending?: IHeaderPending;
}

/** Headers the user collapsed during this page session (keyed by title) */
const collapsedHeaders = new Set<string>();

interface StuckSummaryProps {
  visible: boolean;
  hero?: IHeaderHero;
  pinned?: IHeaderStat[];
  pending?: IHeaderPending;
  onOpen: () => void;
}

/** Key figures + missing ring shown in the slim stuck bar */
const StuckSummary: React.FC<StuckSummaryProps> = ({
  visible,
  hero,
  pinned,
  pending,
  onOpen,
}) => {
  const pins = pinned || [];
  const showRing = !!pending && pending.total > 0;
  if (!hero && pins.length === 0 && !showRing) return null;

  const order = (i: number): React.CSSProperties =>
    ({ "--i": i }) as React.CSSProperties;
  const done = showRing && pending.missing <= 0;
  const progress = showRing
    ? Math.max(
        0,
        Math.min(1, (pending.total - pending.missing) / pending.total),
      )
    : 0;
  const ringText = done ? pending.doneLabel || "All set" : pending?.label;
  const ringIndex = (hero ? 1 : 0) + pins.length;

  return (
    <div
      className={`${styles.summary} ${visible ? styles.summaryVisible : ""}`}
      aria-hidden={!visible}
    >
      <div className={styles.summaryInner}>
        {hero && (
          <span className={styles.sumPill} style={order(0)}>
            <span className={styles.sumLabel}>{hero.label}</span>
            <span className={styles.sumValue}>{hero.value}</span>
          </span>
        )}
        {pins.map((s, i) => (
          <span
            key={s.label}
            className={`${styles.sumPill} ${styles.sumPinned} ${s.tone === "warning" ? styles.sumWarning : s.tone === "success" ? styles.sumSuccess : ""}`}
            style={order((hero ? 1 : 0) + i)}
          >
            <span className={styles.sumLabel}>{s.label}</span>
            <span className={styles.sumValue}>{s.value}</span>
          </span>
        ))}
        {showRing && (
          <button
            type="button"
            className={`${styles.sumPill} ${styles.ringPill} ${done ? styles.ringDone : styles.ringWarn}`}
            style={
              {
                "--i": ringIndex,
                "--ring-progress": progress,
              } as React.CSSProperties
            }
            onClick={onOpen}
            tabIndex={visible ? 0 : -1}
            title={
              done
                ? ringText
                : `${pending.missing} of ${pending.total} ${pending.label} - show details`
            }
            aria-label={
              done
                ? ringText
                : `${pending.missing} of ${pending.total} ${pending.label}. Expand the summary`
            }
          >
            <span className={styles.ring} aria-hidden="true">
              <svg viewBox="0 0 24 24" className={styles.ringSvg}>
                <circle
                  className={styles.ringTrack}
                  cx="12"
                  cy="12"
                  r="10"
                  pathLength={100}
                />
                <circle
                  className={styles.ringValue}
                  cx="12"
                  cy="12"
                  r="10"
                  pathLength={100}
                />
              </svg>
              <span className={styles.ringCenter}>
                {done ? (
                  <Check size={11} strokeWidth={3} />
                ) : pending.missing > 99 ? (
                  "99+"
                ) : (
                  pending.missing
                )}
              </span>
              {visible && (
                <span key={pending.missing} className={styles.ringHalo} />
              )}
            </span>
            <span className={styles.ringText}>{ringText}</span>
          </button>
        )}
        <span className={styles.sumDivider} aria-hidden="true" />
      </div>
    </div>
  );
};

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
  sticky,
  pinned,
  pending,
}) => {
  const edit = React.useContext(TabEditContext);
  const division = React.useContext(DivisionContext);
  const panelRef = React.useRef<HTMLElement>(null);
  const [expanded, setExpanded] = React.useState(
    () => !collapsedHeaders.has(title),
  );
  const stickyOn = !!sticky && !compact;
  const { stuck, manualOpen, setManualOpen } = useStickyCollapse(
    panelRef,
    stickyOn,
  );
  const hasStats = !!stats && stats.length > 0;
  const hasDetail = !!children || hasStats;
  // Stuck: auto-collapsed unless opened on purpose; the saved state returns at the top
  const isOpen = compact || (stuck ? manualOpen : expanded);
  const slim = stuck && !isOpen;

  const toggleExpanded = (): void => {
    if (stuck) {
      setManualOpen(!manualOpen);
      return;
    }
    if (expanded) collapsedHeaders.add(title);
    else collapsedHeaders.delete(title);
    setExpanded(!expanded);
  };

  return (
    <section
      ref={panelRef}
      className={`${styles.panel} ${compact ? styles.compact : ""} ${stickyOn ? styles.sticky : ""} ${stuck ? styles.stuck : ""} ${slim ? styles.slim : ""}`}
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
            {stickyOn && (
              <StuckSummary
                visible={slim}
                hero={hero}
                pinned={pinned}
                pending={pending}
                onOpen={() => setManualOpen(true)}
              />
            )}
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
              aria-expanded={isOpen}
              aria-label={isOpen ? "Collapse summary" : "Expand summary"}
              title={isOpen ? "Collapse summary" : "Expand summary"}
            >
              <ChevronDown
                size={16}
                className={`${styles.toggleIcon} ${isOpen ? styles.toggleIconOpen : ""}`}
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
