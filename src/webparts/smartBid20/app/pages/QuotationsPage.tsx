import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { EmptyState } from "../components/common/EmptyState";
import { DivisionBadge } from "../components/common/DivisionBadge";
import { useDebounce } from "../hooks/useDebounce";
import { formatCurrency, formatDate } from "../utils/formatters";
import styles from "./QuotationsPage.module.scss";

interface IQuotation {
  id: string;
  vendor: string;
  description: string;
  division: string;
  amount: number;
  currency: string;
  validUntil: string;
  status: "active" | "expired" | "used";
  relatedBid: string | null;
}

const MOCK_QUOTATIONS: IQuotation[] = [
  {
    id: "QT-001",
    vendor: "SubC Imaging",
    description: "ROV Camera System x2",
    division: "SSR-ROV",
    amount: 185000,
    currency: "USD",
    validUntil: "2026-06-30T00:00:00Z",
    status: "active",
    relatedBid: "BID-2026-042",
  },
  {
    id: "QT-002",
    vendor: "Sonardyne",
    description: "USBL Positioning System",
    division: "SSR-Survey",
    amount: 320000,
    currency: "USD",
    validUntil: "2026-05-15T00:00:00Z",
    status: "active",
    relatedBid: null,
  },
  {
    id: "QT-003",
    vendor: "Oceaneering DTS",
    description: "Tooling Rental — 30 days",
    division: "OPG",
    amount: 95000,
    currency: "USD",
    validUntil: "2026-04-01T00:00:00Z",
    status: "expired",
    relatedBid: "BID-2026-015",
  },
  {
    id: "QT-004",
    vendor: "DOF Subsea",
    description: "Vessel Charter — 45 days",
    division: "SSR-ROV",
    amount: 2700000,
    currency: "USD",
    validUntil: "2026-07-31T00:00:00Z",
    status: "active",
    relatedBid: null,
  },
  {
    id: "QT-005",
    vendor: "Forum Energy",
    description: "Intervention Tooling Package",
    division: "SSR-Integrated",
    amount: 540000,
    currency: "USD",
    validUntil: "2026-03-15T00:00:00Z",
    status: "used",
    relatedBid: "BID-2026-005",
  },
];

const STATUS_COLORS: Record<string, string> = {
  active: "#10B981",
  expired: "#94A3B8",
  used: "#3B82F6",
};

export const QuotationsPage: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    let items = MOCK_QUOTATIONS;
    if (statusFilter !== "all")
      items = items.filter((q) => q.status === statusFilter);
    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      items = items.filter(
        (q) =>
          q.vendor.toLowerCase().indexOf(lower) >= 0 ||
          q.description.toLowerCase().indexOf(lower) >= 0,
      );
    }
    return items;
  }, [debouncedSearch, statusFilter]);

  const columns = [
    {
      key: "id",
      header: "ID",
      render: (q: IQuotation) => <span className={styles.bold}>{q.id}</span>,
    },
    { key: "vendor", header: "Vendor", render: (q: IQuotation) => q.vendor },
    {
      key: "description",
      header: "Description",
      render: (q: IQuotation) => q.description,
    },
    {
      key: "division",
      header: "Division",
      render: (q: IQuotation) => <DivisionBadge division={q.division} />,
    },
    {
      key: "amount",
      header: "Amount",
      render: (q: IQuotation) => formatCurrency(q.amount, q.currency),
    },
    {
      key: "validUntil",
      header: "Valid Until",
      render: (q: IQuotation) => formatDate(q.validUntil),
    },
    {
      key: "status",
      header: "Status",
      render: (q: IQuotation) => (
        <span
          className={styles.statusText}
          style={{ color: STATUS_COLORS[q.status] }}
        >
          {q.status}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Quotations"
        subtitle={`${filtered.length} quotations`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        }
      />
      <div className={styles.filterRow}>
        <input
          type="text"
          placeholder="Search quotations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        {["all", "active", "expired", "used"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`${styles.tabBtn} ${statusFilter === s ? styles.tabBtnActive : ""}`}
          >
            {s}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          title="No quotations found"
          description="Try adjusting your search or filter."
        />
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}
    </div>
  );
};
