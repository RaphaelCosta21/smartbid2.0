import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { DivisionBadge } from "../components/common/DivisionBadge";
import { DataTable } from "../components/common/DataTable";
import { EmptyState } from "../components/common/EmptyState";
import { useBids } from "../hooks/useBids";
import { formatCurrency, formatDate } from "../utils/formatters";
import { getTerminalStatuses } from "../utils/statusHelpers";
import { IBid } from "../models";

const OUTCOME_COLORS: Record<string, string> = {
  Won: "#10B981",
  Lost: "#EF4444",
  "Client Canceled": "#F59E0B",
  Renegotiation: "#8B5CF6",
  "No Response": "#94A3B8",
};

export const BidResultsPage: React.FC = () => {
  const { filteredBids } = useBids();
  const [outcomeFilter, setOutcomeFilter] = React.useState<string>("all");

  const terminalBids = React.useMemo(() => {
    const terminalStatuses = getTerminalStatuses().map((s) => s.value || s.id);
    return filteredBids.filter(
      (b) => terminalStatuses.indexOf(b.currentStatus) >= 0 || b.bidResult?.outcome
    );
  }, [filteredBids]);

  const filtered = React.useMemo(() => {
    if (outcomeFilter === "all") return terminalBids;
    return terminalBids.filter((b) => b.bidResult?.outcome === outcomeFilter);
  }, [terminalBids, outcomeFilter]);

  const outcomes = ["all", "Won", "Lost", "Client Canceled", "Renegotiation", "No Response"];

  const stats = React.useMemo(() => {
    const won = terminalBids.filter((b) => b.bidResult?.outcome === "Won").length;
    const lost = terminalBids.filter((b) => b.bidResult?.outcome === "Lost").length;
    const total = terminalBids.length;
    return { won, lost, total, winRate: total > 0 ? Math.round((won / total) * 100) : 0 };
  }, [terminalBids]);

  const columns = [
    { key: "bidNumber", header: "BID", render: (bid: IBid) => <span style={{ fontWeight: 600 }}>{bid.bidNumber}</span> },
    { key: "client", header: "Client", render: (bid: IBid) => bid.opportunityInfo.client },
    { key: "division", header: "Division", render: (bid: IBid) => <DivisionBadge division={bid.division} /> },
    { key: "status", header: "Status", render: (bid: IBid) => <StatusBadge status={bid.currentStatus} /> },
    {
      key: "outcome", header: "Outcome", render: (bid: IBid) => {
        const outcome = bid.bidResult?.outcome || "N/A";
        const color = OUTCOME_COLORS[outcome] || "#94A3B8";
        return <span style={{ color, fontWeight: 600, fontSize: 13 }}>{outcome}</span>;
      },
    },
    {
      key: "value", header: "Contract Value", render: (bid: IBid) =>
        bid.bidResult?.contractValue ? formatCurrency(bid.bidResult.contractValue, bid.bidResult.contractCurrency || "USD") : "—",
    },
    { key: "date", header: "Outcome Date", render: (bid: IBid) => bid.bidResult?.outcomeDate ? formatDate(bid.bidResult.outcomeDate) : "—" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader
        title="BID Results"
        subtitle="Follow-up and outcomes tracking"
        icon={
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
          </svg>
        }
      />

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Total Results", value: stats.total, color: "#3B82F6" },
          { label: "Won", value: stats.won, color: "#10B981" },
          { label: "Lost", value: stats.lost, color: "#EF4444" },
          { label: "Win Rate", value: `${stats.winRate}%`, color: "#8B5CF6" },
        ].map((s) => (
          <div key={s.label} style={{ padding: 20, background: "var(--card-bg)", borderRadius: 12, border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8 }}>
        {outcomes.map((o) => (
          <button
            key={o}
            onClick={() => setOutcomeFilter(o)}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: outcomeFilter === o ? "none" : "1px solid var(--border-subtle)",
              background: outcomeFilter === o ? "var(--accent-color, #3B82F6)" : "transparent",
              color: outcomeFilter === o ? "#fff" : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: outcomeFilter === o ? 600 : 400,
            }}
          >
            {o === "all" ? "All" : o}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No results found" description="No BIDs match the selected outcome filter." />
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}
    </div>
  );
};
