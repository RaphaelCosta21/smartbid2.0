/**
 * PresentationCommercial — the context management asks about: who is on the BID,
 * how many clarifications the client already answered, the qualifications taken and
 * where the approval stands. Each card opens its full list.
 */
import * as React from "react";
import { ArrowUpRight, Check, Minus, X } from "lucide-react";
import { IPresentationModel } from "../../hooks/usePresentationModel";
import { ApprovalStatus, IPersonRef } from "../../models";
import { formatNumber } from "../../utils/formatters";
import { GlassCard } from "../common/GlassCard";
import { RingGauge } from "../charts/RingGauge";
import { APPROVAL_STATUS_STYLE, ApprovalBadge } from "../approval/ApprovalBadge";
import { PresentationDrawerView } from "./presentationTypes";
import tile from "./PresentationTile.module.scss";
import styles from "./PresentationCommercial.module.scss";

export interface PresentationCommercialProps {
  model: IPresentationModel;
  onOpen: (view: PresentationDrawerView) => void;
}

const MAX_AVATARS = 5;

const initialsOf = (p: IPersonRef): string =>
  (p.name || p.email || "?")
    .split(/[\s.@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const statusIcon = (status: ApprovalStatus): React.ReactNode =>
  status === "approved" ? (
    <Check size={11} />
  ) : status === "rejected" ? (
    <X size={11} />
  ) : (
    <Minus size={11} />
  );

export const PresentationCommercial: React.FC<PresentationCommercialProps> = ({
  model,
  onOpen,
}) => {
  const { commercial, colors } = model;
  const { team, clarifications, answeredClarifications, approval } = commercial;
  const people: IPersonRef[] = [];
  const seen: Record<string, boolean> = {};
  team.forEach((t) =>
    t.people.forEach((p) => {
      const k = (p.email || p.name || "").toLowerCase();
      if (!k || seen[k]) return;
      seen[k] = true;
      people.push(p);
    }),
  );
  const approvedSectors = approval.sectors.filter(
    (s) => s.status === "approved",
  ).length;

  return (
    <GlassCard
      title="Commercial context"
      subtitle="Team, client clarifications and approval"
      className={`${tile.tile} ${tile.tileCommercial}`}
    >
      <div className={`${tile.body} ${styles.grid}`}>
        <button
          type="button"
          className={styles.card}
          onClick={() => onOpen({ kind: "team" })}
        >
          <span className={styles.cardHead}>
            <span className={tile.eyebrow}>Team</span>
            <ArrowUpRight size={14} className={styles.open} />
          </span>
          {people.length === 0 ? (
            <span className={styles.muted}>Not assigned yet</span>
          ) : (
            <>
              <span className={styles.avatars}>
                {people.slice(0, MAX_AVATARS).map((p) => (
                  <span
                    key={p.email || p.name}
                    className={styles.avatar}
                    title={p.name || p.email}
                  >
                    {p.photoUrl ? <img src={p.photoUrl} alt="" /> : initialsOf(p)}
                  </span>
                ))}
                {people.length > MAX_AVATARS && (
                  <span className={`${styles.avatar} ${styles.avatarMore}`}>
                    +{people.length - MAX_AVATARS}
                  </span>
                )}
              </span>
              <span className={styles.roles}>
                {team.slice(0, 3).map((t) => (
                  <span key={t.role} className={styles.roleLine}>
                    <span className={styles.roleName}>{t.role}</span>
                    <span className={styles.rolePeople}>
                      {t.people.map((p) => p.name || p.email).join(", ")}
                    </span>
                  </span>
                ))}
              </span>
            </>
          )}
        </button>

        <button
          type="button"
          className={styles.card}
          onClick={() => onOpen({ kind: "clarifications" })}
        >
          <span className={styles.cardHead}>
            <span className={tile.eyebrow}>Clarifications</span>
            <ArrowUpRight size={14} className={styles.open} />
          </span>
          {clarifications.length === 0 ? (
            <span className={styles.muted}>None raised</span>
          ) : (
            <span className={styles.ringRow}>
              <RingGauge
                size={72}
                thickness={8}
                trackColor={colors.theme.grid}
                max={clarifications.length}
                segments={[
                  {
                    key: "answered",
                    value: answeredClarifications,
                    color: colors.theme.success,
                  },
                ]}
              >
                <span className={styles.ringValue}>
                  {answeredClarifications}/{clarifications.length}
                </span>
              </RingGauge>
              <span className={styles.ringText}>
                <strong>
                  {Math.round(
                    (answeredClarifications / clarifications.length) * 100,
                  )}
                  %
                </strong>
                answered by the client
              </span>
            </span>
          )}
        </button>

        <button
          type="button"
          className={styles.card}
          onClick={() => onOpen({ kind: "qualifications" })}
        >
          <span className={styles.cardHead}>
            <span className={tile.eyebrow}>Qualifications</span>
            <ArrowUpRight size={14} className={styles.open} />
          </span>
          <span className={styles.bigNumber}>
            {formatNumber(commercial.qualifications.length)}
          </span>
          <span className={styles.chips}>
            {commercial.qualificationCategories.slice(0, 3).map((c) => (
              <span key={c.label} className={styles.chip} title={c.label}>
                {c.label}
                <b>{c.count}</b>
              </span>
            ))}
            {commercial.qualifications.length === 0 && (
              <span className={styles.muted}>None taken</span>
            )}
          </span>
        </button>

        <button
          type="button"
          className={styles.card}
          onClick={() => onOpen({ kind: "approval" })}
        >
          <span className={styles.cardHead}>
            <span className={tile.eyebrow}>
              Approval{approval.round ? ` · round ${approval.round}` : ""}
            </span>
            <ArrowUpRight size={14} className={styles.open} />
          </span>
          <ApprovalBadge status={approval.status} />
          {approval.sectors.length > 0 ? (
            <>
              <span className={styles.stepper}>
                {approval.sectors.map((s) => (
                  <span
                    key={s.sector}
                    className={styles.step}
                    title={`${s.label}: ${(APPROVAL_STATUS_STYLE[s.status] || APPROVAL_STATUS_STYLE.pending).label}`}
                    style={{
                      color: (
                        APPROVAL_STATUS_STYLE[s.status] ||
                        APPROVAL_STATUS_STYLE.pending
                      ).color,
                    }}
                  >
                    {statusIcon(s.status)}
                  </span>
                ))}
              </span>
              <span className={styles.muted}>
                {approvedSectors} of {approval.sectors.length} sectors approved
              </span>
            </>
          ) : (
            <span className={styles.muted}>No approval round yet</span>
          )}
        </button>
      </div>
    </GlassCard>
  );
};
