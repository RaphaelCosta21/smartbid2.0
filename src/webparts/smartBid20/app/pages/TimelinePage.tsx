import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { PhaseBadge } from "../components/common/PhaseBadge";
import { CountdownTimer } from "../components/common/CountdownTimer";
import { useBids } from "../hooks/useBids";
import { formatDate } from "../utils/formatters";
import { DIVISION_COLORS } from "../utils/constants";
import { isActiveBid } from "../utils/bidHelpers";

export const TimelinePage: React.FC = () => {
  const { filteredBids } = useBids();
  const activeBids = React.useMemo(
    () => filteredBids.filter(isActiveBid).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    [filteredBids]
  );

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() - 7);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 60);
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

  const getBarStyle = (createdDate: string, dueDate: string): { left: string; width: string } => {
    const start = Math.max(0, Math.ceil((new Date(createdDate).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)));
    const end = Math.min(totalDays, Math.ceil((new Date(dueDate).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)));
    const barWidth = Math.max(end - start, 2);
    return {
      left: `${(start / totalDays) * 100}%`,
      width: `${(barWidth / totalDays) * 100}%`,
    };
  };

  const todayPosition = `${(Math.ceil((today.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays) * 100}%`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader
        title="Timeline"
        subtitle={`Gantt view of ${activeBids.length} active BIDs`}
        icon={
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        }
      />

      <div style={{ background: "var(--card-bg)", borderRadius: 16, border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
        {/* Header row with month markers */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ width: 280, flexShrink: 0, padding: "12px 16px", fontWeight: 600, fontSize: 13, color: "var(--text-secondary)" }}>
            BID
          </div>
          <div style={{ flex: 1, position: "relative", height: 40 }}>
            <div style={{ position: "absolute", left: todayPosition, top: 0, bottom: 0, width: 2, background: "#EF4444", zIndex: 2 }} />
          </div>
        </div>

        {activeBids.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-secondary)" }}>No active BIDs to display.</div>
        ) : (
          activeBids.map((bid) => {
            const barStyle = getBarStyle(bid.createdDate, bid.dueDate);
            const divColor = DIVISION_COLORS[bid.division] || "#94a3b8";
            return (
              <div key={bid.bidNumber} style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", minHeight: 52 }}>
                <div style={{ width: 280, flexShrink: 0, padding: "8px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{bid.bidNumber}</span>
                    <StatusBadge status={bid.currentStatus} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
                    <span>{bid.opportunityInfo.client}</span>
                    <PhaseBadge phase={bid.currentPhase} />
                    <CountdownTimer targetDate={bid.dueDate} />
                  </div>
                </div>
                <div style={{ flex: 1, position: "relative", height: 32, padding: "0 8px" }}>
                  <div style={{ position: "absolute", left: todayPosition, top: 0, bottom: 0, width: 1, background: "#EF444440" }} />
                  <div
                    style={{
                      position: "absolute",
                      ...barStyle,
                      top: 6,
                      height: 20,
                      background: `${divColor}30`,
                      border: `1px solid ${divColor}`,
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: 6,
                      fontSize: 11,
                      color: divColor,
                      fontWeight: 600,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(bid.createdDate, "MMM d")} — {formatDate(bid.dueDate, "MMM d")}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
