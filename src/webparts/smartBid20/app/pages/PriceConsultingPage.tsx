import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { DivisionBadge } from "../components/common/DivisionBadge";
import { useDebounce } from "../hooks/useDebounce";
import { formatCurrency, formatDate } from "../utils/formatters";
import styles from "./PriceConsultingPage.module.scss";

interface IPriceEntry {
  id: string;
  category: string;
  item: string;
  division: string;
  unitRate: number;
  currency: string;
  unit: string;
  source: string;
  lastUpdated: string;
}

const MOCK_PRICES: IPriceEntry[] = [
  {
    id: "PR-001",
    category: "Day Rates",
    item: "WROV System (Work Class)",
    division: "SSR-ROV",
    unitRate: 35000,
    currency: "USD",
    unit: "/day",
    source: "Petrobras Contract 2026",
    lastUpdated: "2026-01-15T00:00:00Z",
  },
  {
    id: "PR-002",
    category: "Day Rates",
    item: "Observation ROV",
    division: "SSR-ROV",
    unitRate: 12000,
    currency: "USD",
    unit: "/day",
    source: "Petrobras Contract 2026",
    lastUpdated: "2026-01-15T00:00:00Z",
  },
  {
    id: "PR-003",
    category: "Personnel",
    item: "ROV Pilot/Tech (12h shift)",
    division: "SSR-ROV",
    unitRate: 1800,
    currency: "USD",
    unit: "/day",
    source: "Internal Rate Card",
    lastUpdated: "2026-02-01T00:00:00Z",
  },
  {
    id: "PR-004",
    category: "Personnel",
    item: "Survey Engineer",
    division: "SSR-Survey",
    unitRate: 2200,
    currency: "USD",
    unit: "/day",
    source: "Internal Rate Card",
    lastUpdated: "2026-02-01T00:00:00Z",
  },
  {
    id: "PR-005",
    category: "Vessel",
    item: "DSV Charter (DP2)",
    division: "SSR-Integrated",
    unitRate: 85000,
    currency: "USD",
    unit: "/day",
    source: "DOF Subsea Quote",
    lastUpdated: "2026-03-10T00:00:00Z",
  },
  {
    id: "PR-006",
    category: "Vessel",
    item: "RSV Charter (Survey)",
    division: "SSR-Survey",
    unitRate: 45000,
    currency: "USD",
    unit: "/day",
    source: "Fugro Quote",
    lastUpdated: "2026-03-15T00:00:00Z",
  },
  {
    id: "PR-007",
    category: "Mob/Demob",
    item: "Standard Mobilization",
    division: "OPG",
    unitRate: 150000,
    currency: "USD",
    unit: "/event",
    source: "Historical Average",
    lastUpdated: "2025-12-01T00:00:00Z",
  },
  {
    id: "PR-008",
    category: "Tooling",
    item: "UT Inspection Tool Rental",
    division: "OPG",
    unitRate: 5500,
    currency: "USD",
    unit: "/day",
    source: "Oceaneering DTS",
    lastUpdated: "2026-01-20T00:00:00Z",
  },
];

export const PriceConsultingPage: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const categories = [
    "all",
    ...Array.from(new Set(MOCK_PRICES.map((p) => p.category))),
  ];

  const filtered = React.useMemo(() => {
    let items = MOCK_PRICES;
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
  }, [debouncedSearch, categoryFilter]);

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
