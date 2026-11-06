/**
 * PresentationDrawer — the drill-down side panel of the BID Presentation. Renders the top
 * view of the stack: an item, the lines behind a cost category, a group of items, a labor
 * role, or the commercial lists.
 */
import * as React from "react";
import { ChevronRight } from "lucide-react";
import { IPresentationModel } from "../../hooks/usePresentationModel";
import { acquisitionToken, IPresentationItem } from "../../utils/bidPresentation";
import {
  approverName,
  buildStepLines,
  EFFORT_LABELS,
  IDetailLine,
  PRICE_STEP_LABELS,
} from "../../utils/presentationView";
import { formatDate, formatNumber } from "../../utils/formatters";
import { SideDrawer } from "../common/SideDrawer";
import { PersonaCard } from "../common/PersonaCard";
import { ApprovalBadge } from "../approval/ApprovalBadge";
import { PresentationItemDetail } from "./PresentationItemDetail";
import { PresentationDrawerView } from "./presentationTypes";
import styles from "./PresentationDrawer.module.scss";

export interface PresentationDrawerProps {
  model: IPresentationModel;
  stack: PresentationDrawerView[];
  onClose: () => void;
  onBack: () => void;
  /** Swap the top view (prev / next item) */
  onReplace: (view: PresentationDrawerView) => void;
  onPush: (view: PresentationDrawerView) => void;
}

interface IRow {
  key: string;
  label: string;
  sub?: React.ReactNode;
  value: string;
  /** 0–1 bar under the row */
  ratio?: number;
  color?: string;
  onClick?: () => void;
}

const RowList: React.FC<{ rows: IRow[]; empty: string }> = ({ rows, empty }) =>
  rows.length === 0 ? (
    <p className={styles.empty}>{empty}</p>
  ) : (
    <ul className={styles.list}>
      {rows.map((r) => {
        const content = (
          <>
            <span className={styles.rowMain}>
              <span className={styles.rowLabel} title={r.label}>
                {r.label}
              </span>
              {r.sub && <span className={styles.rowSub}>{r.sub}</span>}
            </span>
            <span className={styles.rowValue}>{r.value}</span>
            {r.onClick && <ChevronRight size={14} className={styles.chevron} />}
            {r.ratio !== undefined && (
              <span className={styles.rowBar}>
                <span
                  style={{
                    width: `${Math.max(1.5, Math.min(100, r.ratio * 100))}%`,
                    background: r.color || "var(--primary-accent)",
                  }}
                />
              </span>
            )}
          </>
        );
        return (
          <li key={r.key}>
            {r.onClick ? (
              <button type="button" className={styles.row} onClick={r.onClick}>
                {content}
              </button>
            ) : (
              <div className={styles.row}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );

const Summary: React.FC<{ items: { label: string; value: string }[] }> = ({
  items,
}) => (
  <div className={styles.summary}>
    {items.map((s) => (
      <div key={s.label} className={styles.summaryItem}>
        <span className={styles.summaryLabel}>{s.label}</span>
        <span className={styles.summaryValue}>{s.value}</span>
      </div>
    ))}
  </div>
);

const hoursText = (h: number): string => `${formatNumber(Math.round(h))} h`;

export const PresentationDrawer: React.FC<PresentationDrawerProps> = ({
  model,
  stack,
  onClose,
  onBack,
  onReplace,
  onPush,
}) => {
  const view = stack.length > 0 ? stack[stack.length - 1] : null;
  const { money, totalUSD, colors, rankOf } = model;

  const itemRows = (items: IPresentationItem[]): IRow[] => {
    const keys = items.map((i) => i.key);
    const max = items.reduce((m, i) => Math.max(m, i.totalUSD), 0) || 1;
    return items.map((i) => ({
      key: i.key,
      label: i.description || i.partNumber || "(no description)",
      sub: (
        <>
          {rankOf.get(i.key) ? `#${rankOf.get(i.key)} · ` : ""}
          {i.category} ·{" "}
          <span style={{ color: acquisitionToken(i.acquisition) }}>
            {i.acquisition}
          </span>
        </>
      ),
      value: i.totalUSD > 0 ? money(i.totalUSD) : "No cost",
      ratio: i.totalUSD / max,
      color: colors.category(i.category),
      onClick: () => onPush({ kind: "item", key: i.key, list: keys }),
    }));
  };

  const lineRows = (lines: IDetailLine[], color: string): IRow[] => {
    const max =
      lines.reduce((m, l) => Math.max(m, l.usd !== null ? l.usd : l.hours || 0), 0) ||
      1;
    return lines.map((l) => ({
      key: l.key,
      label: l.label,
      sub: [l.sub, l.hours ? hoursText(l.hours) : ""].filter(Boolean).join(" · "),
      value: l.usd !== null ? money(l.usd) : hoursText(l.hours || 0),
      ratio: (l.usd !== null ? l.usd : l.hours || 0) / max,
      color,
    }));
  };

  let eyebrow: React.ReactNode = null;
  let title: React.ReactNode = "";
  let subtitle: React.ReactNode = null;
  let body: React.ReactNode = null;
  let nav: { onPrev?: () => void; onNext?: () => void; position?: string } = {};
  let width = 520;

  if (view) {
    switch (view.kind) {
      case "item": {
        const item = model.itemByKey.get(view.key);
        const idx = view.list.indexOf(view.key);
        const rank = rankOf.get(view.key);
        width = 560;
        eyebrow = `${rank ? `#${rank} · ` : ""}${item ? item.category : ""}`;
        title = item ? item.description || item.partNumber || "(no description)" : "Item";
        subtitle = item ? (
          <span style={{ color: acquisitionToken(item.acquisition) }}>
            {item.acquisition}
          </span>
        ) : null;
        body = item ? (
          <PresentationItemDetail model={model} item={item} />
        ) : (
          <p className={styles.empty}>This item is no longer in the BID.</p>
        );
        if (view.list.length > 1 && idx >= 0) {
          nav = {
            position: `${idx + 1} / ${view.list.length}`,
            onPrev:
              idx > 0
                ? () => onReplace({ ...view, key: view.list[idx - 1] })
                : undefined,
            onNext:
              idx < view.list.length - 1
                ? () => onReplace({ ...view, key: view.list[idx + 1] })
                : undefined,
          };
        }
        break;
      }
      case "step": {
        const step = model.steps.find((s) => s.key === view.step);
        eyebrow = "How the price is built";
        title = PRICE_STEP_LABELS[view.step];
        if (view.step === "assets") {
          body = (
            <>
              <Summary
                items={[
                  { label: "Value", value: money(model.assetsUSD) },
                  {
                    label: "Share of BID",
                    value: step ? `${step.pct.toFixed(1)}%` : "-",
                  },
                  { label: "Priced items", value: formatNumber(model.ranked.length) },
                ]}
              />
              <RowList rows={itemRows(model.ranked)} empty="No priced items." />
            </>
          );
        } else {
          const lines = buildStepLines(model.bid, view.step, model.view.fx);
          body = (
            <>
              <Summary
                items={[
                  { label: "Value", value: step ? money(step.usd) : "-" },
                  {
                    label: "Share of BID",
                    value: step ? `${step.pct.toFixed(1)}%` : "-",
                  },
                  { label: "Lines", value: formatNumber(lines.length) },
                ]}
              />
              <RowList
                rows={lineRows(lines, colors.step[view.step])}
                empty="No lines in this category."
              />
            </>
          );
        }
        break;
      }
      case "acquisition": {
        const group = model.acquisitionGroups.find((g) => g.label === view.label);
        const items = group
          ? group.items.slice().sort((a, b) => b.totalUSD - a.totalUSD)
          : [];
        eyebrow = "How it's supplied";
        title = (
          <span style={{ color: acquisitionToken(view.label) }}>{view.label}</span>
        );
        body = (
          <>
            <Summary
              items={[
                { label: "Value", value: money(group ? group.valueUSD : 0) },
                { label: "Items", value: formatNumber(items.length) },
                {
                  label: "Share of BID",
                  value:
                    group && totalUSD > 0
                      ? `${((group.valueUSD / totalUSD) * 100).toFixed(1)}%`
                      : "-",
                },
              ]}
            />
            <RowList rows={itemRows(items)} empty="No items." />
          </>
        );
        break;
      }
      case "assets": {
        const items = view.category
          ? model.ranked.filter((i) => i.category === view.category)
          : model.ranked;
        const value = items.reduce((s, i) => s + i.totalUSD, 0);
        eyebrow = "Asset value";
        title = view.category || "All priced items";
        body = (
          <>
            <Summary
              items={[
                { label: "Value", value: money(value) },
                { label: "Items", value: formatNumber(items.length) },
                {
                  label: "Share of BID",
                  value: totalUSD > 0 ? `${((value / totalUSD) * 100).toFixed(1)}%` : "-",
                },
              ]}
            />
            <RowList rows={itemRows(items)} empty="No priced items." />
          </>
        );
        break;
      }
      case "effort": {
        const group = model.effort.groups.find((g) => g.kind === view.effort);
        const color = colors.effort[view.effort];
        eyebrow = "Effort";
        if (!group) {
          title = EFFORT_LABELS[view.effort];
          body = <p className={styles.empty}>No hours in this discipline.</p>;
          break;
        }
        if (view.role) {
          const role = group.roles.find((r) => r.role === view.role);
          title = view.role;
          subtitle = group.label;
          body = role ? (
            <>
              <Summary
                items={[
                  { label: "Hours", value: hoursText(role.hours) },
                  {
                    label: `Share of ${group.label}`,
                    value: `${((role.hours / group.hours) * 100).toFixed(0)}%`,
                  },
                  { label: "Lines", value: formatNumber(role.lines.length) },
                ]}
              />
              <RowList rows={lineRows(role.lines, color)} empty="No lines." />
            </>
          ) : (
            <p className={styles.empty}>No hours for this role.</p>
          );
        } else {
          title = group.label;
          const maxH = group.roles[0] ? group.roles[0].hours : 1;
          body = (
            <>
              <Summary
                items={[
                  { label: "Hours", value: hoursText(group.hours) },
                  {
                    label: "Share of effort",
                    value: `${((group.hours / model.effort.totalHours) * 100).toFixed(0)}%`,
                  },
                  { label: "Roles", value: formatNumber(group.roles.length) },
                ]}
              />
              <RowList
                rows={group.roles.map((r) => ({
                  key: r.role,
                  label: r.role,
                  sub: `${r.lines.length} ${r.lines.length === 1 ? "line" : "lines"}`,
                  value: hoursText(r.hours),
                  ratio: r.hours / maxH,
                  color,
                  onClick: () =>
                    onPush({ kind: "effort", effort: view.effort, role: r.role }),
                }))}
                empty="No roles."
              />
            </>
          );
        }
        break;
      }
      case "team": {
        eyebrow = "Commercial context";
        title = "BID team";
        body =
          model.commercial.team.length === 0 ? (
            <p className={styles.empty}>No one assigned yet.</p>
          ) : (
            <div className={styles.groups}>
              {model.commercial.team.map((t) => (
                <section key={t.role} className={styles.group}>
                  <h4 className={styles.groupTitle}>{t.role}</h4>
                  {t.people.map((p) => (
                    <PersonaCard
                      key={p.email || p.name}
                      name={p.name || p.email}
                      email={p.email}
                      role={p.role}
                      photoUrl={p.photoUrl}
                      size="small"
                    />
                  ))}
                </section>
              ))}
            </div>
          );
        break;
      }
      case "clarifications": {
        const list = model.commercial.clarifications;
        eyebrow = "Commercial context";
        title = "Clarifications";
        subtitle = `${model.commercial.answeredClarifications} of ${list.length} answered by the client`;
        body =
          list.length === 0 ? (
            <p className={styles.empty}>No clarifications raised.</p>
          ) : (
            <ul className={styles.cards}>
              {list.map((c) => {
                const answered = !!(c.clientResponse || "").trim();
                return (
                  <li key={c.id} className={styles.card}>
                    <div className={styles.cardHead}>
                      <span className={styles.cardRef}>
                        {[c.item, c.description].filter(Boolean).join(" · ") ||
                          "Clarification"}
                      </span>
                      <span
                        className={`${styles.pill} ${answered ? styles.pillOk : styles.pillWait}`}
                      >
                        {answered ? "Answered" : "Awaiting client"}
                      </span>
                    </div>
                    {c.clarification && (
                      <p className={styles.cardText}>{c.clarification}</p>
                    )}
                    {answered && (
                      <p className={styles.cardReply}>
                        <span>Client</span>
                        {c.clientResponse}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          );
        break;
      }
      case "qualifications": {
        const list = model.commercial.qualifications;
        eyebrow = "Commercial context";
        title = "Qualifications";
        subtitle = `${list.length} taken in this BID`;
        body =
          list.length === 0 ? (
            <p className={styles.empty}>No qualifications taken.</p>
          ) : (
            <div className={styles.groups}>
              {model.commercial.qualificationCategories.map((cat) => (
                <section key={cat.label} className={styles.group}>
                  <h4 className={styles.groupTitle}>
                    {cat.label}
                    <span>{cat.count}</span>
                  </h4>
                  <ul className={styles.bullets}>
                    {list
                      .filter((q) => q.category === cat.label)
                      .map((q) => (
                        <li key={q.id}>{q.text}</li>
                      ))}
                  </ul>
                </section>
              ))}
            </div>
          );
        break;
      }
      case "approval": {
        const approval = model.commercial.approval;
        eyebrow = "Commercial context";
        title = "Approval";
        subtitle = (
          <span className={styles.inline}>
            <ApprovalBadge status={approval.status} />
            {approval.round ? `Round ${approval.round}` : ""}
          </span>
        );
        body =
          approval.sectors.length === 0 ? (
            <p className={styles.empty}>No approval round started yet.</p>
          ) : (
            <div className={styles.groups}>
              {approval.sectors.map((s) => (
                <section key={s.sector} className={styles.group}>
                  <h4 className={styles.groupTitle}>
                    <i style={{ background: s.color }} />
                    {s.label}
                    <ApprovalBadge status={s.status} />
                  </h4>
                  {s.approvals.map((a) => (
                    <div key={a.id} className={styles.approver}>
                      <span className={styles.approverName}>
                        {approverName(a)}
                      </span>
                      <span className={styles.approverMeta}>
                        <ApprovalBadge status={a.status} />
                        {a.respondedDate ? formatDate(a.respondedDate) : ""}
                      </span>
                      {a.comments && (
                        <p className={styles.approverComment}>{a.comments}</p>
                      )}
                    </div>
                  ))}
                </section>
              ))}
            </div>
          );
        break;
      }
      default:
        break;
    }
  }

  // Item views carry their whole navigation list; the key alone identifies the content
  const contentKey = !view
    ? ""
    : view.kind === "item"
      ? `${stack.length}:item:${view.key}`
      : `${stack.length}:${JSON.stringify(view)}`;

  return (
    <SideDrawer
      open={!!view}
      onClose={onClose}
      onBack={stack.length > 1 ? onBack : undefined}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      width={width}
      contentKey={contentKey}
      {...nav}
    >
      <div className={styles.body}>{body}</div>
    </SideDrawer>
  );
};
