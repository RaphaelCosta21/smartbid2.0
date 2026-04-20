import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { DivisionBadge } from "../components/common/DivisionBadge";
import { useDebounce } from "../hooks/useDebounce";
import { formatCurrency, formatDate } from "../utils/formatters";
import { PricingService, IPriceEntry } from "../services/PricingService";
import styles from "./PriceConsultingPage.module.scss";

export const PriceConsultingPage: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [prices, setPrices] = React.useState<IPriceEntry[]>([]);
  const debouncedSearch = useDebounce(search, 300);
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");

  React.useEffect(() => {
    PricingService.getAll()
      .then((data) => setPrices(data))
      .catch((err) => console.error("Failed to load pricing data:", err));
  }, []);

  const categories = React.useMemo(
    () => ["all", ...Array.from(new Set(prices.map((p) => p.category)))],
    [prices],
  );

  const filtered = React.useMemo(() => {
    let items = prices;
    if (categoryFilter !== "all")
      items = items.filter((p) => p.category === categoryFilter);
    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      items = items.filter(
        (p) =>
          p.item.toLowerCase().indexOf(lower) >= 0 ||
          p.source.toLowerCase().indexOf(lower) >= 0,
      );
    }
    return items;
  }, [debouncedSearch, categoryFilter, prices]);

  const columns = [
    {
      key: "category",
      header: "Category",
      render: (p: IPriceEntry) => (
        <span className={styles.bold}>{p.category}</span>
      ),
    },
    {
      key: "item",
      header: "Item",
      render: (p: IPriceEntry) => <span className={styles.bold}>{p.item}</span>,
    },
    {
      key: "division",
      header: "Division",
      render: (p: IPriceEntry) => <DivisionBadge division={p.division} />,
    },
    {
      key: "rate",
      header: "Unit Rate",
      render: (p: IPriceEntry) =>
        `${formatCurrency(p.unitRate, p.currency)} ${p.unit}`,
    },
    { key: "source", header: "Source", render: (p: IPriceEntry) => p.source },
    {
      key: "updated",
      header: "Last Updated",
      render: (p: IPriceEntry) => formatDate(p.lastUpdated),
    },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Price Consulting"
        subtitle={`${filtered.length} pricing references`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        }
      />
      <div className={styles.filterRow}>
        <input
          type="text"
          placeholder="Search prices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`${styles.tabBtn} ${categoryFilter === c ? styles.tabBtnActive : ""}`}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>
      <DataTable columns={columns} data={filtered} />
    </div>
  );
};
