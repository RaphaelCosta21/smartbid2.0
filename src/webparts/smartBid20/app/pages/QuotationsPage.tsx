import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { EmptyState } from "../components/common/EmptyState";
import { DivisionBadge } from "../components/common/DivisionBadge";
import { useDebounce } from "../hooks/useDebounce";
import { useStatusColors } from "../hooks/useStatusColors";
import { formatCurrency, formatDate } from "../utils/formatters";
import { QuotationService, IQuotation } from "../services/QuotationService";
import styles from "./QuotationsPage.module.scss";

export const QuotationsPage: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [quotations, setQuotations] = React.useState<IQuotation[]>([]);
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const { getStatusColor } = useStatusColors();

  React.useEffect(() => {
    QuotationService.getAll()
      .then((data) => setQuotations(data))
      .catch((err) => console.error("Failed to load quotations:", err));
  }, []);

  const filtered = React.useMemo(() => {
    let items = quotations;
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
  }, [debouncedSearch, statusFilter, quotations]);

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
          style={{ color: getStatusColor(q.status) }}
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
