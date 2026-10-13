/**
 * QuotationControlPanel — request/response tracking for every quotation linked to the
 * Assets Breakdown items: who was asked, when, who answered, how fast and what is overdue.
 */
import * as React from "react";
import { Paperclip } from "lucide-react";
import {
  IAssetBreakdownItem,
  IQuotationItem,
  IQuotationLink,
  IScopeItem,
} from "../../models";
import { QuotationService } from "../../services/QuotationService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import {
  getEffectiveLinks,
  getQuoteComparableUSD,
  getResponseDays,
  getWaitingDays,
  isLinkOverdue,
} from "../../utils/quotationLinks";
import { DataTable } from "../common/DataTable";
import { KPICard } from "../common/KPICard";
import { SkeletonLoader } from "../common/SkeletonLoader";
import { QuotationStatusChip } from "./QuotationStatusChip";
import styles from "./QuotationControlPanel.module.scss";

type StatusKey = "overdue" | "requested" | "none" | "received" | "declined";
type StatusFilter = "all" | StatusKey;

interface IControlRow {
  assetId: string;
  lineNumber: number;
  description: string;
  partNumber: string;
  link: IQuotationLink | null;
  quote: IQuotationItem | null;
  supplier: string;
  statusKey: StatusKey;
  requestedDate: string;
  dueDate: string;
  responseDate: string;
  responseDays: number | undefined;
  waitingDays: number | undefined;
  reference: string;
  value: number | undefined;
  leadTimeDays: number | undefined;
  isSelected: boolean;
}

const STATUS_RANK: Record<StatusKey, number> = {
  overdue: 0,
  requested: 1,
  none: 2,
  received: 3,
  declined: 4,
};

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: "All statuses",
  overdue: "Overdue",
  requested: "Awaiting",
  received: "Received",
  declined: "Declined",
  none: "Without quotation",
};

/** Items that will be bought or rented are expected to have a quotation */
const needsQuotation = (a: IAssetBreakdownItem): boolean => {
  const s = (a.availabilityStatus || "").toLowerCase();
  return s === "purchase" || s === "rental";
};

export interface QuotationControlPanelProps {
  assets: IAssetBreakdownItem[];
  scopeItems: IScopeItem[];
  index: Map<string, IQuotationItem>;
  /** True until the quotation catalog has been loaded */
  loading: boolean;
  displayCurrency: { currency: "USD" | "BRL"; rate: number };
  onOpenItem: (assetId: string) => void;
}

export const QuotationControlPanel: React.FC<QuotationControlPanelProps> = ({
  assets,
  scopeItems,
  index,
  loading,
  displayCurrency,
  onOpenItem,
}) => {
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [supplierFilter, setSupplierFilter] = React.useState("");
  const [query, setQuery] = React.useState("");

  const rows = React.useMemo(() => {
    const scopeById = new Map<string, IScopeItem>();
    const lineByScopeId: Record<string, number> = {};
    scopeItems
      .filter((s) => !s.isSection)
      .forEach((s, i) => {
        scopeById.set(s.id, s);
        lineByScopeId[s.id] = i + 1;
      });

    const out: IControlRow[] = [];
    assets.forEach((a) => {
      const si = scopeById.get(a.scopeItemId);
      if (!si) return;
      const base = {
        assetId: a.id,
        lineNumber: lineByScopeId[si.id],
        description: si.equipmentOffer || si.description || "",
        partNumber: si.partNumber || "",
      };
      const links = getEffectiveLinks(a, si.partNumber || "", index);
      if (links.length === 0) {
        if (needsQuotation(a)) {
          out.push({
            ...base,
            link: null,
            quote: null,
            supplier: "",
            statusKey: "none",
            requestedDate: "",
            dueDate: "",
            responseDate: "",
            responseDays: undefined,
            waitingDays: undefined,
            reference: "",
            value: undefined,
            leadTimeDays: undefined,
            isSelected: false,
          });
        }
        return;
      }
      const qty = (si.qtyOperational || 0) + (si.qtySpare || 0) || 1;
      links.forEach((link) => {
        const quote = link.quotationId
          ? index.get(link.quotationId) || null
          : null;
        const priced = link.status === "received" && !!quote;
        const days = getResponseDays(link);
        const waiting = getWaitingDays(link);
        out.push({
          ...base,
          link,
          quote,
          supplier: (quote && quote.supplier) || link.supplier,
          statusKey: isLinkOverdue(link) ? "overdue" : link.status,
          requestedDate: link.requestedDate || "",
          dueDate: link.dueDate || "",
          responseDate: link.responseDate || "",
          responseDays: days === null ? undefined : days,
          waitingDays: waiting === null ? undefined : waiting,
          reference: (quote && quote.reference) || "",
          value: priced
            ? getQuoteComparableUSD(
                quote as IQuotationItem,
                qty,
                a.rentalDays || 0,
              ) * displayCurrency.rate
            : undefined,
          leadTimeDays:
            quote && quote.leadTimeDays > 0 ? quote.leadTimeDays : undefined,
          isSelected: link.isSelected,
        });
      });
    });

    return out.sort(
      (x, y) =>
        STATUS_RANK[x.statusKey] - STATUS_RANK[y.statusKey] ||
        x.lineNumber - y.lineNumber,
    );
  }, [assets, scopeItems, index, displayCurrency.rate]);

  const counts = React.useMemo(() => {
    const c: Record<StatusKey, number> = {
      overdue: 0,
      requested: 0,
      none: 0,
      received: 0,
      declined: 0,
    };
    let answeredDays = 0;
    let answered = 0;
    rows.forEach((r) => {
      c[r.statusKey] += 1;
      if (r.responseDays !== undefined && r.statusKey === "received") {
        answeredDays += r.responseDays;
        answered += 1;
      }
    });
    return {
      ...c,
      avgResponseDays: answered > 0 ? answeredDays / answered : null,
      answered,
    };
  }, [rows]);

  const suppliers = React.useMemo(() => {
    const seen: Record<string, boolean> = {};
    const out: string[] = [];
    rows.forEach((r) => {
      if (r.supplier && !seen[r.supplier.toLowerCase()]) {
        seen[r.supplier.toLowerCase()] = true;
        out.push(r.supplier);
      }
    });
    return out.sort();
  }, [rows]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.statusKey !== statusFilter) return false;
      if (supplierFilter && r.supplier !== supplierFilter) return false;
      if (!q) return true;
      return [r.description, r.partNumber, r.supplier, r.reference].some(
        (f) => (f || "").toLowerCase().indexOf(q) >= 0,
      );
    });
  }, [rows, statusFilter, supplierFilter, query]);

  if (loading) {
    return <SkeletonLoader count={4} height={36} />;
  }

  const dash = <span className={styles.muted}>-</span>;

  return (
    <div className={styles.root}>
      <div className={styles.kpiGrid}>
        <KPICard
          label="Awaiting"
          value={counts.requested}
          accentColor="var(--warning)"
          subtitle="Requests without an answer yet"
        />
        <KPICard
          label="Overdue"
          value={counts.overdue}
          accentColor="var(--danger)"
          subtitle="Past the expected response date"
        />
        <KPICard
          label="Received"
          value={counts.received}
          accentColor="var(--success)"
          subtitle="Quotations with a price"
        />
        <KPICard
          label="Avg response time"
          value={
            counts.avgResponseDays === null
              ? "-"
              : `${counts.avgResponseDays.toFixed(1)}d`
          }
          accentColor="var(--info)"
          subtitle={`${counts.answered} answered with both dates`}
        />
        <KPICard
          label="Without quotation"
          value={counts.none}
          accentColor="var(--secondary-accent)"
          subtitle="Purchase / Rental items"
        />
      </div>

      <div className={styles.filters}>
        <select
          className={styles.control}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          aria-label="Filter by status"
        >
          {(Object.keys(FILTER_LABELS) as StatusFilter[]).map((k) => (
            <option key={k} value={k}>
              {FILTER_LABELS[k]}
              {k !== "all" ? ` (${counts[k]})` : ""}
            </option>
          ))}
        </select>
        <select
          className={styles.control}
          value={supplierFilter}
          onChange={(e) => setSupplierFilter(e.target.value)}
          aria-label="Filter by supplier"
        >
          <option value="">All suppliers</option>
          {suppliers.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="text"
          className={`${styles.control} ${styles.search}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search item, part number, supplier or ref…"
        />
      </div>

      <div className={styles.tableCard}>
        <DataTable<IControlRow>
          data={filtered}
          emptyMessage={
            rows.length === 0
              ? "No quotations linked or requested yet. Use the 📝 button on an item to add one."
              : "No rows match the current filters."
          }
          onRowClick={(row) => onOpenItem(row.assetId)}
          columns={[
            {
              key: "lineNumber",
              header: "#",
              sortable: true,
              width: 44,
            },
            {
              key: "description",
              header: "Item",
              sortable: true,
              render: (r) => (
                <div className={styles.itemCell}>
                  <span className={styles.itemName}>
                    {r.description || "-"}
                  </span>
                  {r.partNumber && (
                    <span className={styles.itemPn}>{r.partNumber}</span>
                  )}
                </div>
              ),
            },
            {
              key: "supplier",
              header: "Supplier",
              sortable: true,
              render: (r) => r.supplier || dash,
            },
            {
              key: "statusKey",
              header: "Status",
              sortable: true,
              render: (r) =>
                r.link ? (
                  <QuotationStatusChip link={r.link} />
                ) : (
                  <span className={styles.muted}>No quotation</span>
                ),
            },
            {
              key: "requestedDate",
              header: "Sent",
              sortable: true,
              render: (r) =>
                r.requestedDate ? formatDate(r.requestedDate) : dash,
            },
            {
              key: "dueDate",
              header: "Due",
              sortable: true,
              render: (r) =>
                r.statusKey === "requested" || r.statusKey === "overdue"
                  ? r.dueDate
                    ? formatDate(r.dueDate)
                    : dash
                  : dash,
            },
            {
              key: "responseDate",
              header: "Answered",
              sortable: true,
              render: (r) =>
                r.responseDate ? formatDate(r.responseDate) : dash,
            },
            {
              key: "responseDays",
              header: "Response time",
              sortable: true,
              render: (r) =>
                r.responseDays !== undefined
                  ? `${r.responseDays}d`
                  : r.waitingDays !== undefined
                    ? `Waiting ${r.waitingDays}d`
                    : dash,
            },
            {
              key: "reference",
              header: "Ref",
              sortable: true,
              render: (r) => r.reference || dash,
            },
            {
              key: "value",
              header: `Value (${displayCurrency.currency})`,
              sortable: true,
              render: (r) =>
                r.value !== undefined ? (
                  <span className={styles.value}>
                    {formatCurrency(r.value, displayCurrency.currency)}
                    {r.isSelected && (
                      <span
                        className={styles.inUse}
                        title="Price in use on the item"
                      >
                        {" "}
                        ✓
                      </span>
                    )}
                  </span>
                ) : (
                  dash
                ),
            },
            {
              key: "leadTimeDays",
              header: "Lead time",
              sortable: true,
              render: (r) => (r.leadTimeDays ? `${r.leadTimeDays}d` : dash),
            },
            {
              key: "file",
              header: "",
              width: 36,
              render: (r) =>
                r.quote && r.quote.fileUrl ? (
                  <a
                    className={styles.fileLink}
                    href={QuotationService.getFileOpenUrl(r.quote.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={r.quote.fileName || "Open quotation file"}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Paperclip size={14} />
                  </a>
                ) : null,
            },
          ]}
        />
      </div>
    </div>
  );
};
