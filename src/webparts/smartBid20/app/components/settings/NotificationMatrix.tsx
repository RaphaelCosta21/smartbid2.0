import * as React from "react";
import {
  AlarmClock,
  BellOff,
  CalendarClock,
  CalendarX,
  Check,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  CircleCheck,
  CirclePause,
  CircleX,
  Clock,
  FilePlus,
  FileText,
  GitBranch,
  Layers,
  Link2,
  LoaderCircle,
  Mail,
  MessageSquare,
  MessageSquareReply,
  RefreshCw,
  Rocket,
  RotateCcw,
  Send,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  UserCheck,
  UserPlus,
  Users,
  Workflow,
  X,
} from "lucide-react";
import {
  BidRole,
  INotificationEventRule,
  INotificationSettings,
  INotificationTeamRule,
  NotificationAudienceMode,
  NotificationEventKey,
  Sector,
} from "../../models";
import {
  clampDeadlineWarningDays,
  INotificationEventDef,
  isValidFlowUrl,
  MAX_DEADLINE_WARNING_DAYS,
  NOTIFICATION_EVENTS,
  NOTIFICATION_GROUPS,
  NOTIFICATION_TEAMS,
  NotificationChannel,
  NotificationGroupKey,
  NotificationTone,
} from "../../config/notifications.config";
import {
  getBidRoleLabel,
  getBidRolesForSector,
} from "../../config/bidRoles.config";
import { getSectorColor } from "../../config/sectors.config";
import accessStyles from "./AccessMatrix.module.scss";
import styles from "./NotificationMatrix.module.scss";

type NotificationRules = Record<NotificationEventKey, INotificationEventRule>;

const EVENT_ICONS: Record<NotificationEventKey, React.ReactNode> = {
  BID_CREATED: <FilePlus size={14} />,
  BID_ASSIGNED: <UserPlus size={14} />,
  PHASE_CHANGED: <GitBranch size={14} />,
  STATUS_CHANGED: <RefreshCw size={14} />,
  BID_ON_HOLD: <CirclePause size={14} />,
  REVISION_STARTED: <RotateCcw size={14} />,
  BID_COMPLETED: <CircleCheck size={14} />,
  BID_CANCELED: <CircleX size={14} />,
  APPROVAL_STARTED: <Rocket size={14} />,
  APPROVAL_RESPONSE: <MessageSquareReply size={14} />,
  APPROVAL_OVERRIDE: <ShieldAlert size={14} />,
  DUE_DATE_CHANGED: <CalendarClock size={14} />,
  DEADLINE_WARNING: <AlarmClock size={14} />,
  BID_OVERDUE: <CalendarX size={14} />,
  TECHNICAL_PROPOSAL_UPLOADED: <FileText size={14} />,
};

const GROUP_ICONS: Record<NotificationGroupKey, React.ReactNode> = {
  lifecycle: <Layers size={14} />,
  approvals: <ShieldCheck size={14} />,
  deadlines: <Clock size={14} />,
  documents: <FileText size={14} />,
};

const TONE_COLOR: Record<NotificationTone, string> = {
  brand: "var(--primary-accent)",
  info: "var(--info)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
};

const MODES: NotificationAudienceMode[] = ["off", "all", "custom"];

const MODE_LABEL: Record<NotificationAudienceMode, string> = {
  off: "Off",
  all: "Whole team",
  custom: "Custom",
};

const ModeIcon: React.FC<{ mode: NotificationAudienceMode }> = ({ mode }) =>
  mode === "all" ? (
    <Users size={11} />
  ) : mode === "custom" ? (
    <UserCheck size={11} />
  ) : (
    <BellOff size={11} />
  );

const teamLabel = (team: Sector): string =>
  (NOTIFICATION_TEAMS.filter((t) => t.value === team)[0] || { label: team })
    .label;

const audienceParts = (rule: INotificationTeamRule): string[] => {
  const parts = (rule.bidRoles || []).map((r) => getBidRoleLabel(r));
  if (rule.keyPeople) parts.push("Key People");
  return parts;
};

/** True when at least one member of the team can receive the event. */
const reachesTeam = (rule: INotificationTeamRule): boolean =>
  rule.mode === "all" ||
  (rule.mode === "custom" && audienceParts(rule).length > 0);

const pillText = (rule: INotificationTeamRule): string => {
  if (rule.mode !== "custom") return MODE_LABEL[rule.mode];
  const parts = audienceParts(rule);
  if (parts.length === 0) return "Nobody";
  return parts.length === 1 ? parts[0] : `${parts[0]} +${parts.length - 1}`;
};

const pillTitle = (rule: INotificationTeamRule, team: Sector): string => {
  const label = teamLabel(team);
  if (rule.mode === "off") return `${label}: does not receive this event`;
  if (rule.mode === "all") return `${label}: every active member receives it`;
  const parts = audienceParts(rule);
  return parts.length > 0
    ? `${label}: only ${parts.join(", ")}`
    : `${label}: custom with nothing selected, nobody receives it`;
};

const pillClass = (rule: INotificationTeamRule): string =>
  rule.mode === "all"
    ? styles.modeAll
    : rule.mode === "off"
      ? styles.modeOff
      : audienceParts(rule).length > 0
        ? styles.modeCustom
        : styles.modeEmpty;

const sameTeamRule = (
  a: INotificationTeamRule | undefined,
  b: INotificationTeamRule | undefined,
): boolean => {
  if (!a || !b) return a === b;
  const roles = (r: INotificationTeamRule): string =>
    (r.bidRoles || []).slice().sort().join(",");
  return (
    a.mode === b.mode &&
    !!a.keyPeople === !!b.keyPeople &&
    roles(a) === roles(b)
  );
};

/* ------------------------------------------------------------------ */
/* Small building blocks                                              */
/* ------------------------------------------------------------------ */

const Switch: React.FC<{
  checked: boolean;
  disabled?: boolean;
  changed?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}> = ({ checked, disabled, changed, label, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    title={label}
    className={`${styles.switch} ${checked ? styles.switchOn : ""} ${changed ? styles.switchChanged : ""}`}
    disabled={disabled}
    onClick={() => onChange(!checked)}
  >
    <span className={styles.switchThumb} />
  </button>
);

export const ChannelChips: React.FC<{ channels: NotificationChannel[] }> = ({
  channels,
}) => (
  <span className={styles.channels}>
    {channels.indexOf("email") >= 0 && (
      <span className={`${styles.channelChip} ${styles.email}`}>
        <Mail size={10} />
        Email
      </span>
    )}
    {channels.indexOf("teams") >= 0 && (
      <span className={`${styles.channelChip} ${styles.teams}`}>
        <MessageSquare size={10} />
        Teams
      </span>
    )}
  </span>
);

export const NotificationLegend: React.FC = () => (
  <div className={accessStyles.legend}>
    <span className={accessStyles.legendItem}>
      <span className={`${accessStyles.pill} ${styles.modeAll}`}>
        <ModeIcon mode="all" />
        Whole team
      </span>
      Every active member
    </span>
    <span className={accessStyles.legendItem}>
      <span className={`${accessStyles.pill} ${styles.modeCustom}`}>
        <ModeIcon mode="custom" />
        Custom
      </span>
      Selected BID roles and/or Key People
    </span>
    <span className={accessStyles.legendItem}>
      <span className={`${accessStyles.pill} ${styles.modeOff}`}>
        <ModeIcon mode="off" />
        Off
      </span>
      Team does not receive
    </span>
    <span className={accessStyles.legendDivider} />
    <span className={accessStyles.legendItem}>
      <ChannelChips channels={["email", "teams"]} />
      Channels, fixed per event
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/* Delivery settings card                                             */
/* ------------------------------------------------------------------ */

type DeliveryPatch = Partial<
  Pick<
    INotificationSettings,
    "flowUrl" | "filterByBusinessLine" | "deadlineWarningDays"
  >
>;

interface NotificationDeliveryCardProps {
  flowUrl: string;
  filterByBusinessLine: boolean;
  deadlineWarningDays: number;
  readOnly: boolean;
  testing: boolean;
  onChange: (patch: DeliveryPatch) => void;
  onSendTest: () => void;
}

export const NotificationDeliveryCard: React.FC<
  NotificationDeliveryCardProps
> = ({
  flowUrl,
  filterByBusinessLine,
  deadlineWarningDays,
  readOnly,
  testing,
  onChange,
  onSendTest,
}) => {
  const trimmed = (flowUrl || "").trim();
  const valid = isValidFlowUrl(trimmed);
  const invalid = !!trimmed && !valid;

  return (
    <section className={styles.delivery}>
      <div className={styles.deliveryHead}>
        <span className={styles.deliveryIcon}>
          <Workflow size={18} />
        </span>
        <div className={styles.deliveryHeading}>
          <h4>Delivery</h4>
          <p>
            Power Automate flow that sends the Teams cards and e-mails. Setup
            steps: power-automate/NOTIFICATIONS.md. First create the log in AI
            Assistant &amp; API, then configure all delivery actions in the
            flow.
          </p>
        </div>
        <span
          className={`${styles.statusChip} ${valid ? styles.statusOk : styles.statusWarn}`}
        >
          {valid ? <CircleCheck size={12} /> : <TriangleAlert size={12} />}
          {valid ? "Flow URL set" : "Not configured"}
        </span>
      </div>

      <div className={styles.deliveryGrid}>
        <div className={`${styles.field} ${styles.fieldWide}`}>
          <label htmlFor="sb-notif-flow-url" className={styles.fieldLabel}>
            <Link2 size={12} />
            Flow URL (HTTP POST)
          </label>
          <div className={styles.urlRow}>
            <input
              id="sb-notif-flow-url"
              type="url"
              className={`${styles.input} ${styles.urlInput} ${invalid ? styles.inputInvalid : ""}`}
              value={flowUrl}
              placeholder="https://...environment.api.powerplatform.com/powerautomate/automations/direct/workflows/..."
              spellCheck={false}
              autoComplete="off"
              disabled={readOnly}
              onChange={(e) => onChange({ flowUrl: e.currentTarget.value })}
            />
            <button
              type="button"
              className={styles.testBtn}
              disabled={!valid || testing}
              onClick={onSendTest}
              title="Send a test notification only to you"
            >
              {testing ? (
                <LoaderCircle size={14} className={styles.spin} />
              ) : (
                <Send size={14} />
              )}
              Send test
            </button>
          </div>
          <span className={invalid ? styles.fieldError : styles.fieldHint}>
            {invalid
              ? "Paste the HTTPS URL generated by the flow trigger (*.powerplatform.com or *.logic.azure.com)."
              : valid
                ? "Send test calls the URL above before saving. A fully configured flow delivers only to you. HTTP acceptance does not confirm delivery; check the run history and log."
                : "Notifications are not sent until a flow URL is saved."}
          </span>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>
            <Layers size={12} />
            Business Line filter
          </span>
          <div className={styles.switchRow}>
            <Switch
              checked={filterByBusinessLine}
              disabled={readOnly}
              label="Filter team members by the BID Business Line"
              onChange={(checked) =>
                onChange({ filterByBusinessLine: checked })
              }
            />
            <span>{filterByBusinessLine ? "On" : "Off"}</span>
          </div>
          <span className={styles.fieldHint}>
            Whole team and BID role audiences only include members of the BID
            Business Line (ROV, SURVEY, OPG). Members without a Business Line
            and Key People always receive.
          </span>
        </div>

        <div className={styles.field}>
          <label htmlFor="sb-notif-warning-days" className={styles.fieldLabel}>
            <AlarmClock size={12} />
            Deadline warning
          </label>
          <div className={styles.daysRow}>
            <input
              id="sb-notif-warning-days"
              type="number"
              min={0}
              max={MAX_DEADLINE_WARNING_DAYS}
              className={`${styles.input} ${styles.daysInput}`}
              value={deadlineWarningDays}
              disabled={readOnly}
              onChange={(e) =>
                onChange({
                  deadlineWarningDays: clampDeadlineWarningDays(
                    e.currentTarget.value,
                  ),
                })
              }
            />
            <span>days before the due date</span>
          </div>
          <span className={styles.fieldHint}>
            Checked Mon-Fri at 08:00 (Brasilia); on Fridays the window also
            covers the weekend. Overdue BIDs get a weekly reminder and On Hold
            BIDs are skipped.
          </span>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Team rule editor (inline row under the event)                      */
/* ------------------------------------------------------------------ */

const TeamRuleEditor: React.FC<{
  def: INotificationEventDef;
  team: Sector;
  rule: INotificationTeamRule;
  eventEnabled: boolean;
  filterByBusinessLine: boolean;
  onChange: (rule: INotificationTeamRule) => void;
  onClose: () => void;
}> = ({
  def,
  team,
  rule,
  eventEnabled,
  filterByBusinessLine,
  onChange,
  onClose,
}) => {
  const label = teamLabel(team);
  const selected = rule.bidRoles || [];
  const parts = audienceParts(rule);
  const blNote = filterByBusinessLine ? " of the BID Business Line" : "";

  const toggleRole = (role: BidRole): void => {
    const next =
      selected.indexOf(role) >= 0
        ? selected.filter((r) => r !== role)
        : [...selected, role];
    onChange({ ...rule, mode: "custom", bidRoles: next });
  };

  let hint: string;
  if (rule.mode === "off") {
    hint = `${label} does not receive "${def.label}".`;
  } else if (rule.mode === "all") {
    hint = `Every active ${label} member${blNote} receives "${def.label}".`;
  } else if (parts.length === 0) {
    hint = `Select at least one BID role or Key People, otherwise nobody in ${label} receives it.`;
  } else {
    const who: string[] = [];
    if (selected.length > 0) {
      who.push(
        `active ${label} members${blNote} with the role ${selected.map((r) => getBidRoleLabel(r)).join(", ")}`,
      );
    }
    if (rule.keyPeople) {
      who.push(`the Key People of the BID who belong to ${label}`);
    }
    hint = `Only ${who.join(" and ")} receive it.`;
  }

  return (
    <div
      className={styles.editor}
      style={{ "--role-color": getSectorColor(team) } as React.CSSProperties}
    >
      <div className={styles.editorHead}>
        <span className={accessStyles.roleDot} />
        <div className={styles.editorTitle}>
          <strong>{label}</strong>
          <span>{def.label}</span>
        </div>
        <button
          type="button"
          className={styles.editorClose}
          aria-label="Close editor"
          title="Close (Esc)"
          onClick={onClose}
        >
          <X size={14} />
        </button>
      </div>

      <div
        className={styles.segmented}
        role="radiogroup"
        aria-label={`Who in ${label} receives ${def.label}`}
      >
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={rule.mode === m}
            className={`${styles.segBtn} ${rule.mode === m ? styles.segActive : ""}`}
            onClick={() => onChange({ ...rule, mode: m })}
          >
            <ModeIcon mode={m} />
            {MODE_LABEL[m]}
          </button>
        ))}
      </div>

      {rule.mode === "custom" && (
        <div className={styles.customBody}>
          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>BID roles</span>
            <div className={styles.chipRow}>
              {getBidRolesForSector(team).map((r) => {
                const on = selected.indexOf(r.key) >= 0;
                return (
                  <button
                    key={r.key}
                    type="button"
                    aria-pressed={on}
                    className={`${styles.roleChip} ${on ? styles.roleChipOn : ""}`}
                    style={{ "--chip-color": r.color } as React.CSSProperties}
                    onClick={() => toggleRole(r.key)}
                  >
                    {on && <Check size={11} />}
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>BID participants</span>
            <div className={styles.chipRow}>
              <button
                type="button"
                aria-pressed={!!rule.keyPeople}
                className={`${styles.roleChip} ${styles.keyPeopleChip} ${rule.keyPeople ? styles.roleChipOn : ""}`}
                title="BID Responsible, Analyst, Project Manager, Commercial Requester and Creator"
                onClick={() =>
                  onChange({
                    ...rule,
                    mode: "custom",
                    keyPeople: !rule.keyPeople,
                  })
                }
              >
                {rule.keyPeople ? <Check size={11} /> : <UserCheck size={11} />}
                Key People of the BID
              </button>
            </div>
          </div>
        </div>
      )}

      <p className={styles.editorHint}>
        {hint}
        {!eventEnabled && " This event is turned off, so nothing is sent yet."}
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Matrix                                                             */
/* ------------------------------------------------------------------ */

interface NotificationMatrixProps {
  rules: NotificationRules;
  savedRules?: NotificationRules;
  filterByBusinessLine: boolean;
  readOnly: boolean;
  onToggleEvent: (event: NotificationEventKey, enabled: boolean) => void;
  onSetTeamRule: (
    event: NotificationEventKey,
    team: Sector,
    rule: INotificationTeamRule,
  ) => void;
}

export const NotificationMatrix: React.FC<NotificationMatrixProps> = ({
  rules,
  savedRules,
  filterByBusinessLine,
  readOnly,
  onToggleEvent,
  onSetTeamRule,
}) => {
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});
  const [hoverTeam, setHoverTeam] = React.useState<Sector | null>(null);
  const [editing, setEditing] = React.useState<{
    event: NotificationEventKey;
    team: Sector;
  } | null>(null);

  React.useEffect(() => {
    if (!editing) return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setEditing(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [editing]);

  React.useEffect(() => {
    if (readOnly) setEditing(null);
  }, [readOnly]);

  const allExpanded = NOTIFICATION_GROUPS.every((g) => !collapsed[g.key]);
  const toggleAll = (): void => {
    const next: Record<string, boolean> = {};
    NOTIFICATION_GROUPS.forEach((g) => {
      next[g.key] = allExpanded;
    });
    setCollapsed(next);
  };

  const colClass = (team: Sector): string =>
    hoverTeam === team ? accessStyles.colHover : "";

  const renderEventRows = (
    def: INotificationEventDef,
    isLast: boolean,
  ): React.ReactNode[] => {
    const rule = rules[def.key];
    const saved = savedRules ? savedRules[def.key] : undefined;
    const editingTeam =
      editing && editing.event === def.key ? editing.team : null;

    const rows: React.ReactNode[] = [
      <tr
        key={def.key}
        className={`${accessStyles.itemRow} ${isLast && !editingTeam ? accessStyles.lastItem : ""} ${rule.enabled ? "" : styles.disabledRow}`}
      >
        <th
          scope="row"
          className={`${accessStyles.rowHead} ${styles.eventHead}`}
        >
          <div className={styles.eventInner}>
            <span
              className={styles.eventIcon}
              style={
                { "--tone-color": TONE_COLOR[def.tone] } as React.CSSProperties
              }
            >
              {EVENT_ICONS[def.key]}
            </span>
            <span className={styles.eventText}>
              <span className={styles.eventLabel}>{def.label}</span>
              <span className={styles.eventTrigger}>{def.trigger}</span>
              <ChannelChips channels={def.channels} />
            </span>
            <Switch
              checked={rule.enabled}
              disabled={readOnly}
              changed={!!saved && saved.enabled !== rule.enabled}
              label={`${def.label}: ${rule.enabled ? "on" : "off"}`}
              onChange={(checked) => onToggleEvent(def.key, checked)}
            />
          </div>
        </th>
        {NOTIFICATION_TEAMS.map((t) => {
          const teamRule = rule.teams[t.value];
          const changed =
            !!saved && !sameTeamRule(saved.teams[t.value], teamRule);
          const isSelected = editingTeam === t.value;
          return (
            <td
              key={t.value}
              className={`${accessStyles.cell} ${colClass(t.value)} ${isSelected ? styles.cellSelected : ""}`}
              style={
                {
                  "--role-color": getSectorColor(t.value),
                } as React.CSSProperties
              }
              onMouseEnter={() => setHoverTeam(t.value)}
            >
              <div className={accessStyles.cellInner}>
                <button
                  type="button"
                  className={`${accessStyles.pill} ${styles.modePill} ${pillClass(teamRule)} ${changed ? accessStyles.changed : ""}`}
                  disabled={readOnly}
                  title={`${pillTitle(teamRule, t.value)}${readOnly ? "" : ". Click to change."}`}
                  aria-label={`${def.label}, ${t.label}: ${pillText(teamRule)}`}
                  aria-expanded={isSelected}
                  onClick={() =>
                    setEditing(
                      isSelected ? null : { event: def.key, team: t.value },
                    )
                  }
                >
                  <ModeIcon mode={teamRule.mode} />
                  <span className={styles.pillText}>{pillText(teamRule)}</span>
                </button>
              </div>
            </td>
          );
        })}
      </tr>,
    ];

    if (editingTeam) {
      rows.push(
        <tr key={`${def.key}-editor`} className={styles.editorRow}>
          <td colSpan={NOTIFICATION_TEAMS.length + 1}>
            <TeamRuleEditor
              def={def}
              team={editingTeam}
              rule={rule.teams[editingTeam]}
              eventEnabled={rule.enabled}
              filterByBusinessLine={filterByBusinessLine}
              onChange={(next) => onSetTeamRule(def.key, editingTeam, next)}
              onClose={() => setEditing(null)}
            />
          </td>
        </tr>,
      );
    }
    return rows;
  };

  return (
    <section className={accessStyles.matrix}>
      <div className={accessStyles.toolbar}>
        <div className={accessStyles.heading}>
          <h4>Event routing</h4>
          <p>
            Choose which teams receive each event. The person who triggered the
            event is never notified.
          </p>
        </div>
        <button
          type="button"
          className={accessStyles.toolBtn}
          onClick={toggleAll}
        >
          {allExpanded ? (
            <ChevronsDownUp size={14} />
          ) : (
            <ChevronsUpDown size={14} />
          )}
          {allExpanded ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <div
        className={accessStyles.scroller}
        onMouseLeave={() => setHoverTeam(null)}
      >
        <table className={`${accessStyles.table} ${styles.wideTable}`}>
          <thead>
            <tr>
              <th
                className={`${accessStyles.cornerHead} ${styles.eventCorner}`}
                scope="col"
              >
                Event
              </th>
              {NOTIFICATION_TEAMS.map((t) => (
                <th
                  key={t.value}
                  scope="col"
                  className={`${accessStyles.roleHead} ${colClass(t.value)}`}
                  style={
                    {
                      "--role-color": getSectorColor(t.value),
                    } as React.CSSProperties
                  }
                  onMouseEnter={() => setHoverTeam(t.value)}
                >
                  <span className={accessStyles.roleDot} />
                  {t.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NOTIFICATION_GROUPS.map((g) => {
              const events = NOTIFICATION_EVENTS.filter(
                (e) => e.group === g.key,
              );
              const isOpen = !collapsed[g.key];
              const enabledCount = events.filter(
                (e) => rules[e.key].enabled,
              ).length;
              return (
                <React.Fragment key={g.key}>
                  <tr
                    className={`${accessStyles.groupRow} ${isOpen ? accessStyles.open : ""}`}
                  >
                    <th scope="row" className={accessStyles.rowHead}>
                      <div className={accessStyles.rowHeadInner}>
                        <button
                          type="button"
                          className={accessStyles.expandBtn}
                          aria-expanded={isOpen}
                          onClick={() =>
                            setCollapsed({ ...collapsed, [g.key]: isOpen })
                          }
                        >
                          <ChevronRight
                            size={14}
                            className={accessStyles.chevron}
                          />
                          <span className={accessStyles.groupIcon}>
                            {GROUP_ICONS[g.key]}
                          </span>
                          <span className={accessStyles.groupLabel}>
                            {g.label}
                          </span>
                          <span
                            className={accessStyles.countChip}
                            title={`${events.length} events`}
                          >
                            {events.length}
                          </span>
                        </button>
                        <span
                          className={`${styles.enabledChip} ${enabledCount === 0 ? styles.enabledChipOff : ""}`}
                          title={`${enabledCount} of ${events.length} events turned on`}
                        >
                          {enabledCount}/{events.length} on
                        </span>
                      </div>
                    </th>
                    {NOTIFICATION_TEAMS.map((t) => {
                      const reached = events.filter(
                        (e) =>
                          rules[e.key].enabled &&
                          reachesTeam(rules[e.key].teams[t.value]),
                      ).length;
                      return (
                        <td
                          key={t.value}
                          className={`${accessStyles.cell} ${colClass(t.value)}`}
                          onMouseEnter={() => setHoverTeam(t.value)}
                        >
                          <span
                            className={`${styles.groupSummary} ${reached === 0 ? styles.groupSummaryEmpty : ""}`}
                            title={`${reached} of ${events.length} ${g.label} events reach ${t.label}`}
                          >
                            {reached}/{events.length}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  {isOpen &&
                    events.map((def, idx) =>
                      renderEventRows(def, idx === events.length - 1),
                    )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
