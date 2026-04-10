import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { StatusBadge } from "../components/common/StatusBadge";
import { GlassCard } from "../components/common/GlassCard";
import { useRequests } from "../hooks/useRequests";
import { IBidRequest } from "../models/IBidRequest";
import { format } from "date-fns";
import styles from "./UnassignedRequestsPage.module.scss";

export const UnassignedRequestsPage: React.FC = () => {
  const { requests } = useRequests();
  const [tab, setTab] = React.useState<"submitted" | "assigned" | "all">(
    "submitted",
  );

  const filtered = React.useMemo(() => {
    if (tab === "all") return requests;
    return requests.filter((r) => r.status === tab);
  }, [tab, requests]);

  const columns = [
    {
      key: "requestNumber",
      header: "Request #",
      sortable: true,
      width: 140,
      render: (r: IBidRequest) => (
        <span className={styles.mono}>{r.requestNumber}</span>
      ),
    },
    {
      key: "client",
      header: "Client",
      sortable: true,
      render: (r: IBidRequest) => r.client,
    },
    {
      key: "projectName",
      header: "Project",
      sortable: true,
      render: (r: IBidRequest) => (
        <span className={styles.textTruncate}>{r.projectName}</span>
      ),
    },
    {
      key: "division",
      header: "Division",
      sortable: true,
      render: (r: IBidRequest) => <StatusBadge status={r.division} />,
    },
    {
      key: "priority",
      header: "Priority",
      sortable: true,
      render: (r: IBidRequest) => <StatusBadge status={r.priority} />,
    },
    {
      key: "requestedBy",
      header: "Requested By",
      render: (r: IBidRequest) => r.requestedBy.name,
    },
    {
      key: "requestDate",
      header: "Date",
      sortable: true,
      render: (r: IBidRequest) =>
        format(new Date(r.requestDate), "MMM d, yyyy"),
    },
    {
      key: "status",
      header: "Status",
      render: (r: IBidRequest) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Unassigned Requests"
        subtitle={`${requests.filter((r) => r.status === "submitted").length} requests awaiting assignment`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        }
      />

      {/* Tab Bar */}
      <div className={styles.tabBar}>
        {(["submitted", "assigned", "all"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`${styles.tabBtn} ${tab === t ? styles.tabBtnActive : ""}`}
          >
            {t} (
            {
              requests.filter((r) => (t === "all" ? true : r.status === t))
                .length
            }
            )
          </button>
        ))}
      </div>

      <GlassCard>
        <DataTable<IBidRequest>
          data={filtered as any}
          columns={columns as any}
          emptyMessage="No requests in this category."
        />
      </GlassCard>
    </div>
  );
};
