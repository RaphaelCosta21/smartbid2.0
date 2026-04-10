import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { DivisionBadge } from "../components/common/DivisionBadge";
import { ProgressBar } from "../components/common/ProgressBar";
import { useBids } from "../hooks/useBids";
import { formatCurrency } from "../utils/formatters";
import { DIVISION_COLORS } from "../utils/constants";
import styles from "./ToolingReportPage.module.scss";

interface IToolingStat {
  name: string;
  division: string;
  totalQty: number;
  avgCost: number;
  bidCount: number;
}

export const ToolingReportPage: React.FC = () => {
  const { filteredBids } = useBids();

  const toolingStats = React.useMemo(() => {
    const map = new Map<string, IToolingStat>();
    filteredBids.forEach((bid) => {
      (bid.equipmentList || []).forEach((eq) => {
        const key = eq.toolDescription || eq.requirementName || "Unknown";
        const existing = map.get(key);
        if (existing) {
          existing.totalQty += (eq.qtyOperational || 0) + (eq.qtySpare || 0);
          existing.avgCost += eq.totalCostUSD || 0;
          existing.bidCount += 1;
        } else {
          map.set(key, {
            name: key,
            division: bid.division,
            totalQty: (eq.qtyOperational || 0) + (eq.qtySpare || 0),
            avgCost: eq.totalCostUSD || 0,
            bidCount: 1,
          });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => b.bidCount - a.bidCount);
  }, [filteredBids]);

  const maxBidCount = Math.max(...toolingStats.map((t) => t.bidCount), 1);

  const columns = [
    {
      key: "name",
      header: "Equipment",
      render: (t: IToolingStat) => (
        <span className={styles.bold}>{t.name}</span>
      ),
    },
    {
      key: "division",
      header: "Division",
      render: (t: IToolingStat) => <DivisionBadge division={t.division} />,
    },
    {
      key: "qty",
      header: "Total Qty",
      render: (t: IToolingStat) => t.totalQty,
    },
    {
      key: "cost",
      header: "Total Cost",
      render: (t: IToolingStat) => formatCurrency(t.avgCost),
    },
    {
      key: "bids",
      header: "Used in BIDs",
      render: (t: IToolingStat) => (
        <div className={styles.bidUsageCell}>
          <ProgressBar
            value={t.bidCount}
            max={maxBidCount}
            color={DIVISION_COLORS[t.division] || "#3B82F6"}
          />
          <span className={styles.bidUsageCount}>{t.bidCount}</span>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Tooling Report"
        subtitle={`${toolingStats.length} equipment types across ${filteredBids.length} BIDs`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
          </svg>
        }
      />

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Unique Equipment Types</div>
          <div className={styles.statValue}>{toolingStats.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Quantity</div>
          <div className={styles.statValue}>
            {toolingStats.reduce((sum, t) => sum + t.totalQty, 0)}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Value</div>
          <div className={styles.statValue}>
            {formatCurrency(
              toolingStats.reduce((sum, t) => sum + t.avgCost, 0),
            )}
          </div>
        </div>
      </div>

      {toolingStats.length > 0 ? (
        <DataTable columns={columns} data={toolingStats} />
      ) : (
        <div className={styles.emptyState}>
          No equipment data found in current BIDs.
        </div>
      )}
    </div>
  );
};
