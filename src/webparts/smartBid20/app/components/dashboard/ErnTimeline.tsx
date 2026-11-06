/**
 * ErnTimeline — Gantt-like view of the watchlist ERNs. Each ERN is one track
 * split into its three stages (Responsible → Checker → Lead), from the ERN's
 * creation to the Lead Date, with today marked across all rows. Clicking a
 * row shows the same details as the list view.
 */
import * as React from "react";
import {
  addDays,
  differenceInCalendarDays,
  format,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { ChevronDown } from "lucide-react";
import { ErnStage } from "../../models";
import {
  ERN_STAGES,
  ERN_STAGE_DATE_LABELS,
  ERN_STAGE_ROLES,
  ErnWatchScope,
  getErnCountdownLabel,
  getErnPeople,
  getErnRowTags,
  getErnScopedDeadline,
  getErnStageOwner,
  IErnLinkRow,
  IErnPerson,
  isErnHandedOver,
} from "../../utils/ernHelpers";
import { parseDate } from "../../utils/formatters";
import { SegmentedControl, SegmentOption } from "../insights/SegmentedControl";
import { UserAvatar } from "../common/UserAvatar";
import { ConfidentialLock } from "../bid/ConfidentialLock";
import { ErnRowDetails } from "./ErnRowDetails";
import styles from "./ErnTimeline.module.scss";

type ZoomWeeks = 4 | 8 | 12;

const ZOOM_SEGMENTS: SegmentOption<ZoomWeeks>[] = [
  { value: 4, label: "4 weeks" },
  { value: 8, label: "8 weeks" },
  { value: 12, label: "12 weeks" },
];

/** Days of history shown before today. */
const LEAD_IN_DAYS = 7;
/** Engineering stage length assumed when the ERN creation date is unknown. */
const DEFAULT_ENG_DAYS = 7;
/** Same-day stages still get a visible sliver. */
const MIN_SEGMENT_DAYS = 0.6;
/** Segment width (% of the window) needed to show the role name / avatar. */
const LABEL_MIN_PCT = 10;
const AVATAR_MIN_PCT = 3.5;

type SegState = "done" | "active" | "upcoming" | "held";

interface Segment {
  stage: ErnStage;
  state: SegState;
  toneClass: string;
  left: number;
  width: number;
  clipStart: boolean;
  clipEnd: boolean;
  title: string;
  person?: IErnPerson;
}

interface Track {
  segments: Segment[];
  tail: { left: number; width: number } | null;
  edge: { side: "before" | "after"; text: string } | null;
  empty: boolean;
}

interface ErnTimelineProps {
  /** Rows already scoped, filtered and sorted by the watchlist */
  rows: IErnLinkRow[];
  scope: ErnWatchScope;
  /** Focus overlay: no inner scroll limit */
  expanded?: boolean;
  onBidClick: (bidNumber: string) => void;
}

function rowToneClass(r: IErnLinkRow, scope: ErnWatchScope): string {
  if (r.onHold) return styles.toneHold;
  if (isErnHandedOver(r, scope)) return styles.toneInfo;
  const d = getErnScopedDeadline(r, scope);
  if (d === "overdue") return styles.toneDanger;
  if (d === "due-soon") return styles.toneWarning;
  if (d === "none") return styles.toneNone;
  return styles.toneOk;
}

function buildTrack(
  r: IErnLinkRow,
  scope: ErnWatchScope,
  windowStart: Date,
  totalDays: number,
  today: Date,
): Track {
  const dayOf = (d: Date): number => differenceInCalendarDays(d, windowStart);
  const pct = (days: number): number => (days / totalDays) * 100;
  const clamp = (days: number): number =>
    Math.min(Math.max(days, 0), totalDays);
  const people = getErnPeople(r.ern);
  const dates: Record<ErnStage, Date | null> = {
    engineering: parseDate(r.dueDate),
    checker: parseDate(r.checkerDueDate),
    lead: parseDate(r.leadDate),
  };
  const created = parseDate(r.ern?.created);
  const engDue = dates.engineering;
  let cursor: number | null = created
    ? dayOf(created)
    : engDue
      ? dayOf(engDue) + 1 - DEFAULT_ENG_DAYS
      : null;

  const stageIdx = ERN_STAGES.indexOf(r.stage);
  const handedOver = isErnHandedOver(r, scope);
  const scoped = getErnScopedDeadline(r, scope);
  const activeTone = handedOver
    ? styles.segInfo
    : scoped === "overdue"
      ? styles.segDanger
      : scoped === "due-soon"
        ? styles.segWarning
        : styles.segAccent;

  const segments: Segment[] = [];
  // Mutated inside forEach; an object keeps TS from narrowing them to null
  const span: {
    first: number | null;
    last: number | null;
    activeEnd: number | null;
  } = { first: null, last: null, activeEnd: null };

  ERN_STAGES.forEach((stage, i) => {
    const d = dates[stage];
    if (!d) return;
    const end = dayOf(d) + 1;
    let start = cursor === null ? end - 1 : cursor;
    if (end - start < MIN_SEGMENT_DAYS) start = end - MIN_SEGMENT_DAYS;
    cursor = end;
    if (span.first === null) span.first = start;
    span.last = end;

    let state: SegState;
    if (r.closed || i < stageIdx) state = "done";
    else if (r.onHold) state = "held";
    else if (i === stageIdx) state = "active";
    else state = "upcoming";
    if (state === "active") span.activeEnd = end;

    const visStart = clamp(start);
    const visEnd = clamp(end);
    if (visEnd <= visStart) return;
    const person = people.find((p) => p.stage === stage);
    segments.push({
      stage,
      state,
      toneClass:
        state === "done"
          ? styles.segDone
          : state === "active"
            ? activeTone
            : state === "held"
              ? styles.segHeld
              : styles.segUpcoming,
      left: pct(visStart),
      width: pct(visEnd - visStart),
      clipStart: start < 0,
      clipEnd: end > totalDays,
      title: `${ERN_STAGE_ROLES[stage]}${person?.name ? ` · ${person.name}` : ""} · ${ERN_STAGE_DATE_LABELS[stage]} ${format(d, "MMM d")}`,
      person,
    });
  });

  let tail: Track["tail"] = null;
  if (span.activeEnd !== null && r.deadline === "overdue" && !handedOver) {
    const tailEnd = clamp(dayOf(today) + 0.5);
    const tailStart = clamp(span.activeEnd);
    if (tailEnd > tailStart) {
      tail = { left: pct(tailStart), width: pct(tailEnd - tailStart) };
    }
  }

  let edge: Track["edge"] = null;
  if (
    segments.length === 0 &&
    !tail &&
    span.first !== null &&
    span.last !== null
  ) {
    edge =
      span.first >= totalDays
        ? {
            side: "after",
            text: `Starts ${format(addDays(windowStart, Math.floor(span.first)), "MMM d")} →`,
          }
        : {
            side: "before",
            text: `← Ended ${format(addDays(windowStart, Math.ceil(span.last) - 1), "MMM d")}`,
          };
  }

  return { segments, tail, edge, empty: span.first === null };
}

export const ErnTimeline: React.FC<ErnTimelineProps> = ({
  rows,
  scope,
  expanded = false,
  onBidClick,
}) => {
  const [zoom, setZoom] = React.useState<ZoomWeeks>(4);
  const [openKey, setOpenKey] = React.useState<string | null>(null);

  const today = startOfDay(new Date());
  const windowStart = addDays(today, -LEAD_IN_DAYS);
  const totalDays = zoom * 7;
  const pct = (days: number): number => (days / totalDays) * 100;
  const todayAt = pct(LEAD_IN_DAYS + 0.5);

  const ticks = React.useMemo(() => {
    const out: { left: number; label: string; key: string }[] = [];
    let d = startOfWeek(windowStart, { weekStartsOn: 1 });
    if (d < windowStart) d = addDays(d, 7);
    while (differenceInCalendarDays(d, windowStart) < totalDays) {
      out.push({
        left: pct(differenceInCalendarDays(d, windowStart)),
        label: format(d, "MMM d"),
        key: d.toISOString(),
      });
      d = addDays(d, 7);
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, windowStart.getTime()]);

  const tracks = React.useMemo(
    () => rows.map((r) => buildTrack(r, scope, windowStart, totalDays, today)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, scope, totalDays, today.getTime()],
  );

  const gridLines = (
    <>
      {ticks.map((t) => (
        <span
          key={t.key}
          className={styles.weekLine}
          style={{ left: `${t.left}%` }}
        />
      ))}
      <span className={styles.todayLine} style={{ left: `${todayAt}%` }} />
    </>
  );

  return (
    <div className={styles.timeline}>
      <div className={styles.toolbar}>
        <SegmentedControl<ZoomWeeks>
          value={zoom}
          segments={ZOOM_SEGMENTS}
          onChange={setZoom}
          size="sm"
          ariaLabel="Timeline zoom"
        />
        <div className={styles.legend} aria-hidden="true">
          <span className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchDone}`} />
            Done
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchActive}`} />
            Current stage
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchSoon}`} />
            Due soon
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchLate}`} />
            Overdue
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchUpcoming}`} />
            Next stages
          </span>
          <span className={styles.legendItem}>
            <span className={styles.swatchToday} />
            Today
          </span>
        </div>
      </div>

      <div className={styles.grid}>
        <div
          className={`${styles.scroll} ${expanded ? styles.scrollExpanded : ""}`}
        >
          <div className={styles.header}>
            <div className={styles.labelHead}>
              ERN · Responsible → Checker → Lead
            </div>
            <div className={styles.trackHead}>
              {ticks.map((t) => (
                <span
                  key={t.key}
                  className={styles.tick}
                  style={{ left: `${t.left}%` }}
                >
                  {t.label}
                </span>
              ))}
              <span className={styles.todayPill} style={{ left: `${todayAt}%` }}>
                Today
              </span>
            </div>
          </div>

          {rows.map((r, i) => {
            const track = tracks[i];
            const isOpen = openKey === r.ernNumber;
            const owner = getErnStageOwner(r);
            const project =
              r.ern?.projectTitle ||
              r.bid?.opportunityInfo?.projectName ||
              r.bid?.bidNumber ||
              r.ernNumber;
            const toggle = (): void => setOpenKey(isOpen ? null : r.ernNumber);
            return (
              <div
                key={r.ernNumber}
                className={`${styles.row} ${rowToneClass(r, scope)} ${isOpen ? styles.rowOpen : ""}`}
              >
                <div
                  className={styles.rowMain}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onClick={toggle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle();
                    }
                  }}
                >
                  <div className={styles.labelCell}>
                    {owner ? (
                      <UserAvatar
                        name={owner.name || owner.email}
                        email={owner.email}
                        size={28}
                        title={`${owner.role}: ${owner.name}`}
                      />
                    ) : (
                      <span className={styles.avatarGap} />
                    )}
                    <span className={styles.labelText}>
                      <span className={styles.labelTop}>
                        <span className={styles.ernNumber}>{r.ernNumber}</span>
                        {getErnRowTags(r).map((t) => (
                          <span key={t} className={styles.tag}>
                            {t}
                          </span>
                        ))}
                      </span>
                      <span className={styles.project} title={project}>
                        {project}
                      </span>
                      <span className={styles.meta}>
                        {r.bid ? (
                          <span className={styles.bidNumber}>
                            {r.bid.bidNumber}
                            <ConfidentialLock bid={r.bid} />
                          </span>
                        ) : null}
                        <span className={styles.countdown}>
                          {getErnCountdownLabel(r, scope)}
                        </span>
                      </span>
                    </span>
                    <ChevronDown
                      size={14}
                      className={styles.chevron}
                      aria-hidden="true"
                    />
                  </div>

                  <div className={styles.track}>
                    {gridLines}
                    {track.segments.map((s) => (
                      <span
                        key={s.stage}
                        className={`${styles.segment} ${s.toneClass} ${
                          s.clipStart ? styles.clipStart : ""
                        } ${s.clipEnd ? styles.clipEnd : ""}`}
                        style={{
                          left: `calc(${s.left}% + 1px)`,
                          width: `calc(${s.width}% - 2px)`,
                        }}
                        title={s.title}
                      >
                        {s.person && s.width >= AVATAR_MIN_PCT && (
                          <UserAvatar
                            name={s.person.name || s.person.email}
                            email={s.person.email}
                            size={16}
                            title=""
                          />
                        )}
                        {s.width >= LABEL_MIN_PCT && (
                          <span className={styles.segLabel}>
                            {ERN_STAGE_ROLES[s.stage]}
                          </span>
                        )}
                      </span>
                    ))}
                    {track.tail && (
                      <span
                        className={styles.tail}
                        style={{
                          left: `${track.tail.left}%`,
                          width: `${track.tail.width}%`,
                        }}
                        title="Overdue"
                      />
                    )}
                    {track.edge && (
                      <span
                        className={`${styles.edge} ${
                          track.edge.side === "after"
                            ? styles.edgeAfter
                            : styles.edgeBefore
                        }`}
                      >
                        {track.edge.text}
                      </span>
                    )}
                    {track.empty && (
                      <span className={`${styles.edge} ${styles.edgeBefore}`}>
                        No dates in the ERN
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.details} aria-hidden={!isOpen}>
                  <div className={styles.detailsInner}>
                    {isOpen && (
                      <ErnRowDetails row={r} onBidClick={onBidClick} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
