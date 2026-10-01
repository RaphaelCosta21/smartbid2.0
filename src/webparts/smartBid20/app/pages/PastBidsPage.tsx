import * as React from "react";
import { useNavigate } from "react-router-dom";
import { History, Search, X } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { DivisionBadge } from "../components/common/DivisionBadge";
import { EmptyState } from "../components/common/EmptyState";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { MultiSelectDropdown } from "../components/insights/MultiSelectDropdown";
import {
  PastBidChips,
  PastBidKbBadge,
  PastBidOutcome,
} from "../components/knowledge/PastBidBadges";
import { PastBidDrawer } from "../components/knowledge/PastBidDrawer";
import { PastBidProfileModal } from "../components/knowledge/PastBidProfileModal";
import { BidFavoriteButton } from "../components/bid/BidFavoriteButton";
import { useBidStore } from "../stores/useBidStore";
import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  usePastBidPublisher,
  usePastBidScopeCategories,
} from "../hooks/usePastBidPublisher";
import {
  PastBidKnowledgeService,
  PastBidProfileFields,
} from "../services/PastBidKnowledgeService";
import { canAccessKnowledge } from "../utils/accessControl";
import { formatDate } from "../utils/formatters";
import {
  IPastBidRow,
  matchesAnyOf,
  matchesPastBidSearch,
  PAST_BID_KB_STATUS_LABELS,
  PastBidKbStatus,
  toFilterOptions,
  toPastBidRow,
} from "../utils/pastBidHelpers";
import { IBid } from "../models";
import styles from "./PastBidsPage.module.scss";

interface IPastBidFilters {
  categories: string[];
  tags: string[];
  divisions: string[];
  serviceLines: string[];
  clients: string[];
  outcomes: string[];
  years: string[];
  kbStatuses: string[];
}

const EMPTY_FILTERS: IPastBidFilters = {
  categories: [],
  tags: [],
  divisions: [],
  serviceLines: [],
  clients: [],
  outcomes: [],
  years: [],
  kbStatuses: [],
};

const MAX_TABLE_TAGS = 3;

export const PastBidsPage: React.FC = () => {
  const navigate = useNavigate();
  const bids = useBidStore((s) => s.bids);
  const currentUser = useCurrentUser();
  const canManage = canAccessKnowledge(currentUser);
  const publish = usePastBidPublisher();
  const scopeCategories = usePastBidScopeCategories();

  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<IPastBidFilters>(EMPTY_FILTERS);
  const [selectedNumber, setSelectedNumber] = React.useState<string | null>(
    null,
  );
  const [editingNumber, setEditingNumber] = React.useState<string | null>(null);
  const [busyNumber, setBusyNumber] = React.useState<string | null>(null);

  const completed = React.useMemo(
    () => bids.filter((b) => b.currentStatus === "Completed"),
    [bids],
  );

  const rows = React.useMemo(
    () =>
      completed
        .map(toPastBidRow)
        .sort((a, b) => b.completedDate.localeCompare(a.completedDate)),
    [completed],
  );

  const filtered = React.useMemo(
    () =>
      rows.filter(
        (r) =>
          matchesAnyOf(filters.categories, r.categories) &&
          matchesAnyOf(filters.tags, r.tags) &&
          matchesAnyOf(filters.divisions, [r.division]) &&
          matchesAnyOf(filters.serviceLines, [r.serviceLine]) &&
          matchesAnyOf(filters.clients, [r.client]) &&
          matchesAnyOf(filters.outcomes, [r.outcome]) &&
          matchesAnyOf(filters.years, [r.year]) &&
          matchesAnyOf(filters.kbStatuses, [r.kbStatus]) &&
          (!search.trim() || matchesPastBidSearch(r.searchText, search)),
      ),
    [rows, filters, search],
  );

  const options = React.useMemo(() => {
    const collect = (pick: (r: IPastBidRow) => string[]): string[] => {
      const out: string[] = [];
      rows.forEach((r) => pick(r).forEach((v) => v && out.push(v)));
      return out;
    };
    return {
      categories: toFilterOptions(
        scopeCategories.concat(collect((r) => r.categories)),
      ),
      tags: toFilterOptions(collect((r) => r.tags)),
      divisions: toFilterOptions(collect((r) => [r.division])),
      serviceLines: toFilterOptions(collect((r) => [r.serviceLine])),
      clients: toFilterOptions(collect((r) => [r.client])),
      outcomes: toFilterOptions(collect((r) => [r.outcome])),
      years: toFilterOptions(
        collect((r) => [r.year]),
        true,
      ),
      kbStatuses: (
        Object.keys(PAST_BID_KB_STATUS_LABELS) as PastBidKbStatus[]
      ).map((k) => ({ value: k, label: PAST_BID_KB_STATUS_LABELS[k] })),
    };
  }, [rows, scopeCategories]);

  const publishedCount = React.useMemo(
    () => rows.filter((r) => r.kbStatus === "published").length,
    [rows],
  );

  const hasFilters =
    !!search.trim() ||
    (Object.keys(filters) as (keyof IPastBidFilters)[]).some(
      (k) => filters[k].length > 0,
    );

  const setFilter =
    (key: keyof IPastBidFilters): ((values: string[]) => void) =>
    (values: string[]): void =>
      setFilters((prev) => ({ ...prev, [key]: values }));

  const selectedBid = selectedNumber
    ? completed.find((b) => b.bidNumber === selectedNumber)
    : undefined;
  const editingBid = editingNumber
    ? completed.find((b) => b.bidNumber === editingNumber)
    : undefined;

  const openBid = React.useCallback(
    (bidNumber: string) => navigate(`/bid/${encodeURIComponent(bidNumber)}`),
    [navigate],
  );

  const handlePublish = async (bid: IBid): Promise<void> => {
    setBusyNumber(bid.bidNumber);
    await publish(bid, {
      runAi:
        !bid.knowledgeProfile || bid.knowledgeProfile.aiStatus === "failed",
    });
    setBusyNumber(null);
  };

  const handleSaveProfile = async (
    bid: IBid,
    fields: PastBidProfileFields,
  ): Promise<void> => {
    setBusyNumber(bid.bidNumber);
    const saved = await publish(bid, { runAi: false, profile: fields });
    setBusyNumber(null);
    if (saved) setEditingNumber(null);
  };

  const columns = [
    {
      key: "favorite",
      header: "",
      width: 40,
      render: (r: IPastBidRow) => <BidFavoriteButton bid={r.bid} />,
    },
    {
      key: "bidNumber",
      header: "BID",
      sortable: true,
      render: (r: IPastBidRow) => (
        <button
          type="button"
          className={styles.bidLink}
          onClick={(e) => {
            e.stopPropagation();
            openBid(r.bidNumber);
          }}
          title="Open BID Details"
        >
          {r.bidNumber}
        </button>
      ),
    },
    {
      key: "client",
      header: "Client / Project",
      sortable: true,
      render: (r: IPastBidRow) => (
        <div className={styles.stack}>
          <span className={styles.primaryText}>{r.client || "—"}</span>
          {r.project && <span className={styles.muted}>{r.project}</span>}
        </div>
      ),
    },
    {
      key: "division",
      header: "Division / Line",
      sortable: true,
      render: (r: IPastBidRow) => (
        <div className={styles.stack}>
          {r.division ? <DivisionBadge division={r.division} /> : "—"}
          {r.serviceLine && (
            <span className={styles.muted}>{r.serviceLine}</span>
          )}
        </div>
      ),
    },
    {
      key: "categories",
      header: "Scope",
      render: (r: IPastBidRow) => (
        <PastBidChips
          values={r.categories}
          accent
          className={styles.chipsCell}
        />
      ),
    },
    {
      key: "tags",
      header: "Tags",
      render: (r: IPastBidRow) => (
        <PastBidChips
          values={r.tags}
          max={MAX_TABLE_TAGS}
          className={styles.chipsCell}
        />
      ),
    },
    {
      key: "completedDate",
      header: "Completed",
      sortable: true,
      render: (r: IPastBidRow) => (
        <span className={styles.dateText}>
          {r.completedDate ? formatDate(r.completedDate) : "—"}
        </span>
      ),
    },
    {
      key: "outcome",
      header: "Outcome",
      sortable: true,
      render: (r: IPastBidRow) => <PastBidOutcome outcome={r.outcome} />,
    },
    {
      key: "kbStatus",
      header: "Knowledge Base",
      sortable: true,
      render: (r: IPastBidRow) => <PastBidKbBadge status={r.kbStatus} />,
    },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Past Bids"
        subtitle="Completed BIDs, classified for the Knowledge Base and the AI Search"
        icon={<History size={28} />}
      />

      <div className={styles.stats}>
        <span className={styles.statChip}>
          <strong>{rows.length}</strong> completed BIDs
        </span>
        <span className={styles.statChip}>
          <strong>{publishedCount}</strong> in the Knowledge Base
        </span>
        {hasFilters && (
          <span className={styles.statChip}>
            <strong>{filtered.length}</strong> matching
          </span>
        )}
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search BID, client, project, equipment, PN, tag…"
            aria-label="Search past BIDs"
          />
        </div>
        <MultiSelectDropdown
          label="Scope"
          options={options.categories}
          selected={filters.categories}
          onChange={setFilter("categories")}
        />
        <MultiSelectDropdown
          label="Tags"
          options={options.tags}
          selected={filters.tags}
          onChange={setFilter("tags")}
        />
        <MultiSelectDropdown
          label="Division"
          options={options.divisions}
          selected={filters.divisions}
          onChange={setFilter("divisions")}
        />
        <MultiSelectDropdown
          label="Service Line"
          options={options.serviceLines}
          selected={filters.serviceLines}
          onChange={setFilter("serviceLines")}
        />
        <MultiSelectDropdown
          label="Client"
          options={options.clients}
          selected={filters.clients}
          onChange={setFilter("clients")}
        />
        <MultiSelectDropdown
          label="Outcome"
          options={options.outcomes}
          selected={filters.outcomes}
          onChange={setFilter("outcomes")}
        />
        <MultiSelectDropdown
          label="Year"
          options={options.years}
          selected={filters.years}
          onChange={setFilter("years")}
        />
        <MultiSelectDropdown
          label="Knowledge Base"
          options={options.kbStatuses}
          selected={filters.kbStatuses}
          onChange={setFilter("kbStatuses")}
        />
        {hasFilters && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              setSearch("");
              setFilters(EMPTY_FILTERS);
            }}
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      <div className={styles.tableSection}>
        {bids.length === 0 ? (
          <SkeletonLoader height={44} count={6} />
        ) : rows.length === 0 ? (
          <EmptyState
            variant="glass"
            title="No completed BIDs yet"
            description="BIDs appear here automatically once their approval is completed."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            variant="glass"
            title="No BIDs match these filters"
            description="Try fewer filters or another search term."
            actionLabel="Clear filters"
            onAction={() => {
              setSearch("");
              setFilters(EMPTY_FILTERS);
            }}
          />
        ) : (
          <DataTable<IPastBidRow>
            data={filtered}
            columns={columns}
            onRowClick={(r) => setSelectedNumber(r.bidNumber)}
          />
        )}
      </div>

      {selectedBid && (
        <PastBidDrawer
          bid={selectedBid}
          candidates={completed}
          canManage={canManage}
          busy={busyNumber === selectedBid.bidNumber}
          onClose={() => {
            if (!editingNumber) setSelectedNumber(null);
          }}
          onOpenBid={openBid}
          onSelectBid={setSelectedNumber}
          onEdit={() => setEditingNumber(selectedBid.bidNumber)}
          onPublish={() => {
            handlePublish(selectedBid).catch(() => undefined);
          }}
        />
      )}

      {editingBid && (
        <PastBidProfileModal
          bid={editingBid}
          scopeCategoryOptions={scopeCategories}
          tagSuggestions={options.tags.map((o) => o.value)}
          saving={busyNumber === editingBid.bidNumber}
          onCancel={() => setEditingNumber(null)}
          onSave={(fields) => {
            handleSaveProfile(editingBid, fields).catch(() => undefined);
          }}
          onSuggest={() =>
            PastBidKnowledgeService.suggestProfile(editingBid, scopeCategories)
          }
        />
      )}
    </div>
  );
};
