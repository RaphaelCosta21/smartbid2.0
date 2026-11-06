/**
 * PresentationEffort — labor behind the BID: disciplines on the inner ring, roles on the
 * outer ring (sunburst), with hours, labor cost and role count. Segments open their lines.
 */
import * as React from "react";
import { IPresentationModel } from "../../hooks/usePresentationModel";
import { EffortKind } from "../../utils/presentationView";
import { formatNumber } from "../../utils/formatters";
import { GlassCard } from "../common/GlassCard";
import { SunburstChart } from "../charts/SunburstChart";
import tile from "./PresentationTile.module.scss";
import styles from "./PresentationEffort.module.scss";

export interface PresentationEffortProps {
  model: IPresentationModel;
  onSelect: (effort: EffortKind, role: string | null) => void;
  chartRef?: React.Ref<HTMLDivElement>;
}

const hoursText = (h: number): string => `${formatNumber(Math.round(h))} h`;

export const PresentationEffort: React.FC<PresentationEffortProps> = ({
  model,
  onSelect,
  chartRef,
}) => {
  const { effort, colors, money, view } = model;
  const theme = colors.theme;
  const laborUSD = view.summary.totalHoursCostUSD;

  return (
    <GlassCard
      title="Effort"
      subtitle="Labor hours by discipline and role"
      className={`${tile.tile} ${tile.tileEffort}`}
    >
      <div className={tile.body}>
        {effort.totalHours <= 0 ? (
          <p className={tile.empty}>No labor hours registered for this BID.</p>
        ) : (
          <div className={styles.layout}>
            <div className={styles.side}>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={tile.eyebrow}>Hours</span>
                  <span className={styles.statValue}>
                    {formatNumber(Math.round(effort.totalHours))}
                  </span>
                </div>
                <div
                  className={styles.stat}
                  title={laborUSD > 0 ? money(laborUSD) : undefined}
                >
                  <span className={tile.eyebrow}>Labor cost</span>
                  <span className={styles.statValue}>
                    {laborUSD > 0 ? model.moneyCompact(laborUSD) : "-"}
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={tile.eyebrow}>Roles</span>
                  <span className={styles.statValue}>
                    {formatNumber(effort.roleCount)}
                  </span>
                </div>
              </div>
              <ul className={styles.groups}>
                {effort.groups.map((g) => (
                  <li key={g.kind}>
                    <button
                      type="button"
                      className={styles.group}
                      onClick={() => onSelect(g.kind, null)}
                    >
                      <i style={{ background: colors.effort[g.kind] }} />
                      <span className={styles.groupName}>{g.label}</span>
                      <span className={styles.groupHours}>{hoursText(g.hours)}</span>
                      <span className={styles.groupPct}>
                        {((g.hours / effort.totalHours) * 100).toFixed(0)}%
                      </span>
                      <span className={styles.groupRoles}>
                        {g.roles.length} {g.roles.length === 1 ? "role" : "roles"}
                        {g.roles[0] ? ` · top: ${g.roles[0].role}` : ""}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div ref={chartRef} className={styles.chart}>
              <SunburstChart
                groups={effort.groups.map((g) => ({
                  key: g.kind,
                  label: g.label,
                  value: g.hours,
                  color: colors.effort[g.kind],
                  children: g.roles.map((r) => ({
                    key: r.role,
                    label: r.role,
                    value: r.hours,
                  })),
                }))}
                formatValue={hoursText}
                centerValue={formatNumber(Math.round(effort.totalHours))}
                centerLabel="hours"
                height={248}
                borderColor={theme.cardBg}
                highlightColor={theme.textPrimary}
                onSelect={(group, child) => onSelect(group as EffortKind, child)}
              />
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
