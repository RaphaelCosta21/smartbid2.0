/**
 * ComparisonTables — the detailed views of a comparison: price changes of matched items,
 * what scope was added or dropped, and everything in one list.
 */
import * as React from "react";
import {
  hasModelChange,
  IComparisonResult,
  IMatchedLine,
  priceImpactUSD,
} from "../../utils/bidComparator";
import {
  formatCurrency,
  formatSignedCurrency,
  formatSignedPercent,
} from "../../utils/formatters";
import { DataTable } from "../common/DataTable";
import { EmptyState } from "../common/EmptyState";
import { GlassCard } from "../common/GlassCard";
import { SegmentedTabs } from "../common/SegmentedTabs";
import styles from "./ComparisonTables.module.scss";

type DisplayCurrency = { currency: "USD" | "BRL"; rate: number };

interface ComparisonTableProps {
  result: IComparisonResult;
  displayCurrency: DisplayCurrency;
}

/** Red when it costs more, green when it costs less */
function deltaClass(value: number): string {
  if (value > 0) return styles.worse;
  if (value < 0) return styles.better;
  return styles.neutral;
}

const ItemCell: React.FC<{
  description: string;
  partNumber: string;
  note?: string;
}> = ({ description, partNumber, note }) => (
  <div className={styles.item} title={description}>
    <div className={styles.itemName}>{description || "(no description)"}</div>
    <div className={styles.itemMeta}>
      {partNumber ? `PN ${partNumber}` : "PN TBD"}
      {note ? ` · ${note}` : ""}
    </div>
  </div>
);

/** Shows how a fuzzy match was made, so the reader can judge it */
function matchNote(m: IMatchedLine): string | undefined {
  if (m.matchMethod === "pn") return undefined;
  return `≈ ${m.historicalDescription.slice(0, 50)} (${Math.round(m.similarity * 100)}%)`;
}

// ─── Price changes ───

type ChangeFilter = "all" | "inc" | "dec" | "model";

export const PriceChangesTable: React.FC<ComparisonTableProps> = ({
  result,
  displayCurrency,
}) => {
  const { currency, rate } = displayCurrency;
  const fmt = (usd: number): string => formatCurrency(usd * rate, currency);
  const [filter, setFilter] = React.useState<ChangeFilter>("all");

  const rows = React.useMemo(() => {
    const sorted = result.matched
      .slice()
      .sort(
        (a, b) => Math.abs(priceImpactUSD(b)) - Math.abs(priceImpactUSD(a)),
      );
    if (filter === "inc") return sorted.filter((m) => m.deltaUSD > 0);
    if (filter === "dec") return sorted.filter((m) => m.deltaUSD < 0);
    if (filter === "model") return sorted.filter(hasModelChange);
    return sorted;
  }, [result, filter]);

  if (result.matched.length === 0) {
    return (
      <EmptyState
        title="No matched items"
        description="Nothing in this BID could be paired with the earlier BID(s). Try lowering the description match."
      />
    );
  }

  return (
    <div className={styles.stack}>
      <SegmentedTabs<ChangeFilter>
        variant="chips"
        value={filter}
        onChange={setFilter}
        ariaLabel="Filter price changes"
        tabs={[
          { key: "all", label: "All", count: result.matched.length },
          { key: "inc", label: "Increases" },
          { key: "dec", label: "Decreases" },
          { key: "model", label: "Supply mode changes" },
        ]}
      />
      <GlassCard noBodyPadding>
        <DataTable<IMatchedLine>
          data={rows}
          emptyMessage="No items for this filter."
          columns={[
            {
              key: "description",
              header: "Item",
              sortable: true,
              render: (m) => (
                <ItemCell
                  description={m.description}
                  partNumber={m.partNumber}
                  note={matchNote(m)}
                />
              ),
            },
            { key: "category", header: "Category", sortable: true },
            {
              key: "unitHistUSD",
              header: "Historical / unit",
              sortable: true,
              render: (m) => (
                <span className={styles.num}>{fmt(m.unitHistUSD)}</span>
              ),
            },
            {
              key: "unitNewUSD",
              header: "New / unit",
              sortable: true,
              render: (m) => (
                <span className={styles.num}>{fmt(m.unitNewUSD)}</span>
              ),
            },
            {
              key: "deltaUSD",
              header: "Change",
              sortable: true,
              render: (m) => (
                <span className={`${styles.num} ${deltaClass(m.deltaUSD)}`}>
                  {formatSignedCurrency(m.deltaUSD * rate, currency)}
                </span>
              ),
            },
            {
              key: "deltaPct",
              header: "Change %",
              sortable: true,
              render: (m) =>
                m.comparable ? (
                  <span className={`${styles.num} ${deltaClass(m.deltaPct)}`}>
                    {formatSignedPercent(m.deltaPct)}
                  </span>
                ) : (
                  <span className={styles.muted}>no price</span>
                ),
            },
            {
              key: "acquisitionNew",
              header: "Supply mode",
              render: (m) =>
                hasModelChange(m) ? (
                  <span>
                    {m.acquisitionHist} → <strong>{m.acquisitionNew}</strong>
                  </span>
                ) : (
                  <span className={styles.muted}>{m.acquisitionNew}</span>
                ),
            },
          ]}
        />
      </GlassCard>
    </div>
  );
};

// ─── Scope changes ───

export const ScopeChangesTables: React.FC<ComparisonTableProps> = ({
  result,
  displayCurrency,
}) => {
  const { currency, rate } = displayCurrency;
  const fmt = (usd: number): string => formatCurrency(usd * rate, currency);

  return (
    <div className={styles.twoCols}>
      <GlassCard
        title={`New items (${result.newItems.length})`}
        subtitle="In this BID, not in the earlier BID(s)"
        accentColor="var(--info)"
        noBodyPadding
      >
        {result.newItems.length === 0 ? (
          <p className={styles.good}>No new items - the scope is identical.</p>
        ) : (
          <DataTable
            data={result.newItems}
            columns={[
              {
                key: "description",
                header: "Item",
                sortable: true,
                render: (n) => (
                  <ItemCell
                    description={n.description}
                    partNumber={n.partNumber}
                  />
                ),
              },
              {
                key: "qty",
                header: "Qty",
                sortable: true,
                render: (n) => <span className={styles.num}>{n.qty}</span>,
              },
              {
                key: "totalUSD",
                header: "Total",
                sortable: true,
                render: (n) => (
                  <span className={styles.num}>{fmt(n.totalUSD)}</span>
                ),
              },
              { key: "acquisition", header: "Supply mode" },
            ]}
          />
        )}
      </GlassCard>

      <GlassCard
        title={`Removed items (${result.missing.length})`}
        subtitle="In the earlier BID(s), not in this one"
        accentColor="var(--warning)"
        noBodyPadding
      >
        {result.missing.length === 0 ? (
          <p className={styles.good}>
            Nothing removed - the scope is identical.
          </p>
        ) : (
          <DataTable
            data={result.missing}
            columns={[
              {
                key: "description",
                header: "Item",
                sortable: true,
                render: (m) => (
                  <ItemCell
                    description={m.description}
                    partNumber={m.partNumber}
                    note={m.histBids.join(", ")}
                  />
                ),
              },
              {
                key: "qty",
                header: "Qty",
                sortable: true,
                render: (m) => <span className={styles.num}>{m.qty}</span>,
              },
              {
                key: "totalUSD",
                header: "Historical total",
                sortable: true,
                render: (m) => (
                  <span className={styles.num}>{fmt(m.totalUSD)}</span>
                ),
              },
              { key: "acquisition", header: "Supply mode" },
            ]}
          />
        )}
      </GlassCard>
    </div>
  );
};

// ─── Full comparison ───

interface IFullRow {
  key: string;
  status: "Matched" | "New" | "Removed";
  description: string;
  partNumber: string;
  qty: string;
  unitHistUSD: number;
  unitNewUSD: number;
  deltaPct: number;
  comparable: boolean;
  mode: string;
}

const STATUS_CLASS: Record<IFullRow["status"], string> = {
  Matched: styles.statusMatched,
  New: styles.statusNew,
  Removed: styles.statusRemoved,
};

export const FullComparisonTable: React.FC<ComparisonTableProps> = ({
  result,
  displayCurrency,
}) => {
  const { currency, rate } = displayCurrency;
  const fmt = (usd: number): string => formatCurrency(usd * rate, currency);

  const rows = React.useMemo(() => {
    const out: IFullRow[] = [];
    result.matched.forEach((m) =>
      out.push({
        key: `m${m.key}`,
        status: "Matched",
        description: m.description,
        partNumber: m.partNumber,
        qty:
          m.qtyHist !== m.qtyNew ? `${m.qtyHist} → ${m.qtyNew}` : `${m.qtyNew}`,
        unitHistUSD: m.unitHistUSD,
        unitNewUSD: m.unitNewUSD,
        deltaPct: m.deltaPct,
        comparable: m.comparable,
        mode: hasModelChange(m)
          ? `${m.acquisitionHist} → ${m.acquisitionNew}`
          : m.acquisitionNew,
      }),
    );
    result.newItems.forEach((n) =>
      out.push({
        key: `n${n.key}`,
        status: "New",
        description: n.description,
        partNumber: n.partNumber,
        qty: `${n.qty}`,
        unitHistUSD: 0,
        unitNewUSD: n.unitUSD,
        deltaPct: 0,
        comparable: false,
        mode: n.acquisition,
      }),
    );
    result.missing.forEach((m) =>
      out.push({
        key: `x${m.key}`,
        status: "Removed",
        description: m.description,
        partNumber: m.partNumber,
        qty: `${m.qty}`,
        unitHistUSD: m.unitUSD,
        unitNewUSD: 0,
        deltaPct: 0,
        comparable: false,
        mode: m.acquisition,
      }),
    );
    return out;
  }, [result]);

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No items to display"
        description="Neither BID has any items."
      />
    );
  }

  return (
    <GlassCard noBodyPadding>
      <DataTable<IFullRow>
        data={rows}
        columns={[
          {
            key: "status",
            header: "Status",
            sortable: true,
            render: (r) => (
              <span className={`${styles.status} ${STATUS_CLASS[r.status]}`}>
                {r.status}
              </span>
            ),
          },
          {
            key: "description",
            header: "Item",
            sortable: true,
            render: (r) => (
              <ItemCell description={r.description} partNumber={r.partNumber} />
            ),
          },
          {
            key: "qty",
            header: "Qty",
            render: (r) => <span className={styles.num}>{r.qty}</span>,
          },
          {
            key: "unitHistUSD",
            header: "Historical / unit",
            sortable: true,
            render: (r) =>
              r.status === "New" ? (
                <span className={styles.muted}>-</span>
              ) : (
                <span className={styles.num}>{fmt(r.unitHistUSD)}</span>
              ),
          },
          {
            key: "unitNewUSD",
            header: "New / unit",
            sortable: true,
            render: (r) =>
              r.status === "Removed" ? (
                <span className={styles.muted}>-</span>
              ) : (
                <span className={styles.num}>{fmt(r.unitNewUSD)}</span>
              ),
          },
          {
            key: "deltaPct",
            header: "Change",
            sortable: true,
            render: (r) =>
              r.status === "Matched" && r.comparable ? (
                <span className={`${styles.num} ${deltaClass(r.deltaPct)}`}>
                  {formatSignedPercent(r.deltaPct)}
                </span>
              ) : (
                <span className={styles.muted}>-</span>
              ),
          },
          { key: "mode", header: "Supply mode" },
        ]}
      />
    </GlassCard>
  );
};
