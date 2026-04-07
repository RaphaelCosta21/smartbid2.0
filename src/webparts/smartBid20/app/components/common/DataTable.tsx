import * as React from "react";

interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: number | string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends object>({
  data,
  columns,
  onRowClick,
  emptyMessage = "No data available",
  className,
}: DataTableProps<T>): React.ReactElement {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  const sorted = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as any)[sortKey];
      const bVal = (b as any)[sortKey];
      if (aVal === bVal) return 0;
      const cmp =
        aVal !== undefined && bVal !== undefined && aVal < bVal ? -1 : 1;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const handleSort = (key: string): void => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  if (data.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 40,
          color: "var(--text-secondary)",
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={className} style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  borderBottom: "1px solid var(--border-subtle)",
                  cursor: col.sortable ? "pointer" : "default",
                  width: col.width,
                  whiteSpace: "nowrap",
                }}
              >
                {col.header}
                {col.sortable &&
                  sortKey === col.key &&
                  (sortDir === "asc" ? " ↑" : " ↓")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((item, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(item)}
              style={{
                cursor: onRowClick ? "pointer" : "default",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{ padding: "12px 16px", fontSize: 14 }}
                >
                  {col.render ? col.render(item) : String((item as any)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
