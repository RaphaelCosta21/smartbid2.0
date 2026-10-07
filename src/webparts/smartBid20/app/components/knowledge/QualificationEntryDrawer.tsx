import * as React from "react";
import { ExternalLink, ListPlus, Pencil, Trash2, X } from "lucide-react";
import { IBid } from "../../models";
import { IQualificationDbItem } from "../../models/IQualificationDb";
import { useBidStore } from "../../stores/useBidStore";
import { useConfigStore } from "../../stores/useConfigStore";
import { DivisionBadge } from "../common/DivisionBadge";
import { ConfidentialLock } from "../bid/ConfidentialLock";
import {
  ClarificationCategoryChip,
  ClarificationOriginChip,
} from "./ClarificationBadges";
import { configOptionLabel } from "../../utils/clarificationHelpers";
import {
  IQualificationUsage,
  qualificationLibraryTableKey,
  qualificationLibraryTableRows,
  qualificationLibraryUsage,
} from "../../utils/qualificationHelpers";
import { formatDate } from "../../utils/formatters";
import shell from "./ClarificationEntryDrawer.module.scss";
import styles from "./QualificationEntryDrawer.module.scss";

interface QualificationEntryDrawerProps {
  item: IQualificationDbItem;
  /** Whole library, for the other rows of the item's table */
  items: IQualificationDbItem[];
  canManage: boolean;
  onClose: () => void;
  onEdit: () => void;
  onEditTable: () => void;
  onDelete: () => void;
  onOpenBid: (bidNumber: string) => void;
}

const isCompleted = (bid: IBid): boolean => bid.currentStatus === "Completed";

const byCompletedDesc = (
  a: IQualificationUsage,
  b: IQualificationUsage,
): number =>
  (b.bid.completedDate || "").localeCompare(a.bid.completedDate || "");

const UsageList: React.FC<{
  usage: IQualificationUsage[];
  /** Rows in the table, to show how many of them each BID used */
  tableSize?: number;
  onOpenBid: (bidNumber: string) => void;
}> = ({ usage, tableSize, onOpenBid }) => (
  <ul className={styles.usageList}>
    {usage.map(({ bid, libraryIds }) => {
      const opp = bid.opportunityInfo;
      return (
        <li key={bid.bidNumber} className={styles.usageItem}>
          <div className={styles.usageMain}>
            <span className={styles.usageId}>
              {bid.crmNumber || bid.bidNumber}
              <ConfidentialLock bid={bid} />
            </span>
            <span className={styles.usageMeta}>
              {[opp && opp.client, opp && opp.projectName]
                .filter(Boolean)
                .join(" - ") || "-"}
            </span>
          </div>
          <div className={styles.usageSide}>
            {tableSize !== undefined && (
              <span className={styles.usagePill}>
                {libraryIds.length} of {tableSize}
              </span>
            )}
            {bid.completedDate && (
              <span className={styles.usageDate}>
                {formatDate(bid.completedDate)}
              </span>
            )}
            <button
              type="button"
              className={styles.openBtn}
              title="Open BID"
              aria-label={`Open BID ${bid.bidNumber}`}
              onClick={() => onOpenBid(bid.bidNumber)}
            >
              <ExternalLink size={13} />
            </button>
          </div>
        </li>
      );
    })}
  </ul>
);

/** Details of one Qualifications Database row: source, table and the completed BIDs that used it. */
export const QualificationEntryDrawer: React.FC<
  QualificationEntryDrawerProps
> = ({
  item,
  items,
  canManage,
  onClose,
  onEdit,
  onEditTable,
  onDelete,
  onOpenBid,
}) => {
  const config = useConfigStore((s) => s.config);
  const bids = useBidStore((s) => s.bids);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const tableKey = qualificationLibraryTableKey(item);
  const tableRows = React.useMemo(
    () => qualificationLibraryTableRows(items, tableKey),
    [items, tableKey],
  );
  const position = tableRows.findIndex((r) => r.id === item.id) + 1;

  const itemUsage = React.useMemo(
    () => qualificationLibraryUsage(bids, [item.id]),
    [bids, item.id],
  );
  const tableUsage = React.useMemo(
    () =>
      qualificationLibraryUsage(
        bids,
        tableRows.map((r) => r.id),
      )
        .filter((u) => isCompleted(u.bid))
        .sort(byCompletedDesc),
    [bids, tableRows],
  );
  const itemCompleted = itemUsage
    .filter((u) => isCompleted(u.bid))
    .sort(byCompletedDesc);
  const itemInProgress = itemUsage.length - itemCompleted.length;

  const sourceBid = item.sourceBidNumber
    ? bids.find((b) => b.bidNumber === item.sourceBidNumber)
    : undefined;
  const tableBidNumber =
    !item.sourceBidNumber && tableKey.indexOf("bid:") === 0
      ? tableKey.split(":")[1] || ""
      : "";
  const opp = sourceBid ? sourceBid.opportunityInfo : undefined;

  const details: [string, React.ReactNode][] = [
    ["Table", item.tableTitle || "-"],
    ["Item", position > 0 ? `${position} of ${tableRows.length}` : "-"],
    ["Client", configOptionLabel(config?.clientList, item.client) || "-"],
    [
      "Division",
      item.division ? <DivisionBadge division={item.division} /> : "-",
    ],
    [
      "Service Line",
      configOptionLabel(config?.serviceLines, item.serviceLine) || "-",
    ],
    [
      "Created",
      item.created
        ? `${formatDate(item.created)}${item.createdBy ? ` by ${item.createdBy}` : ""}`
        : "-",
    ],
    [
      "Modified",
      item.modified
        ? `${formatDate(item.modified)}${item.modifiedBy ? ` by ${item.modifiedBy}` : ""}`
        : "-",
    ],
  ];

  return (
    <>
      <div className={shell.overlay} onClick={onClose} />
      <aside
        className={shell.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Qualification details"
      >
        <div className={shell.header}>
          <div className={shell.headerInfo}>
            <div className={shell.badges}>
              <ClarificationCategoryChip
                category={item.category}
                emptyLabel="No category"
              />
              <ClarificationOriginChip sourceBidNumber={item.sourceBidNumber} />
            </div>
            <h2 className={shell.topic}>
              {item.tableTitle || `Qualification #${item.id}`}
            </h2>
          </div>
          <button
            type="button"
            className={shell.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className={shell.body}>
          <section className={shell.section}>
            <div className={shell.sectionTitle}>Qualification</div>
            {item.qualification ? (
              <p className={shell.text}>{item.qualification}</p>
            ) : (
              <span className={shell.emptyText}>No text</span>
            )}
          </section>

          <section className={shell.section}>
            <div className={shell.sectionTitle}>Details</div>
            <dl className={shell.details}>
              {details.map(([label, value]) => (
                <React.Fragment key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </React.Fragment>
              ))}
            </dl>
          </section>

          <section className={shell.section}>
            <div className={shell.sectionTitle}>Source</div>
            {item.sourceBidNumber ? (
              <div className={shell.sourceCard}>
                <div className={shell.sourceTop}>
                  <span className={shell.sourceBid}>
                    {(sourceBid && sourceBid.crmNumber) || item.sourceBidNumber}
                    <ConfidentialLock bidNumber={item.sourceBidNumber} />
                  </span>
                  {sourceBid && sourceBid.completedDate && (
                    <span className={shell.muted}>
                      Completed {formatDate(sourceBid.completedDate)}
                    </span>
                  )}
                </div>
                {sourceBid ? (
                  <>
                    <span className={shell.sourceClient}>
                      {(opp && opp.client) || "-"}
                    </span>
                    {opp && opp.projectName && (
                      <span className={shell.muted}>{opp.projectName}</span>
                    )}
                  </>
                ) : (
                  <span className={shell.muted}>
                    BID details are not loaded. Open the BID to see them.
                  </span>
                )}
                <button
                  type="button"
                  className={shell.linkBtn}
                  onClick={() => onOpenBid(item.sourceBidNumber)}
                >
                  <ExternalLink size={13} /> Open BID
                </button>
              </div>
            ) : tableBidNumber ? (
              <span className={shell.emptyText}>
                Added manually to the table synced from BID {tableBidNumber}.
              </span>
            ) : (
              <span className={shell.emptyText}>
                Created manually in the library, not linked to a BID.
              </span>
            )}
          </section>

          <section className={shell.section}>
            <div className={styles.sectionHead}>
              <span className={shell.sectionTitle}>Used in completed BIDs</span>
              <span className={styles.countBadge}>{itemCompleted.length}</span>
            </div>
            {itemCompleted.length > 0 ? (
              <UsageList usage={itemCompleted} onOpenBid={onOpenBid} />
            ) : (
              <span className={shell.emptyText}>
                Not imported into a completed BID yet.
              </span>
            )}
            {itemInProgress > 0 && (
              <span className={shell.muted}>
                Also imported into {itemInProgress} BID
                {itemInProgress === 1 ? "" : "s"} not completed yet.
              </span>
            )}
          </section>

          <section className={shell.section}>
            <div className={styles.sectionHead}>
              <span className={shell.sectionTitle}>Table usage</span>
              <span className={styles.countBadge}>{tableUsage.length}</span>
            </div>
            {tableUsage.length > 0 ? (
              <UsageList
                usage={tableUsage}
                tableSize={tableRows.length}
                onOpenBid={onOpenBid}
              />
            ) : (
              <span className={shell.emptyText}>
                No completed BID imported qualifications from this table yet.
              </span>
            )}
          </section>

          <section className={shell.section}>
            <div className={styles.sectionHead}>
              <span className={shell.sectionTitle}>Table contents</span>
              <span className={styles.countBadge}>{tableRows.length}</span>
            </div>
            <ol className={styles.tableList}>
              {tableRows.map((r, i) => (
                <li
                  key={r.id}
                  className={`${styles.tableRow} ${r.id === item.id ? styles.tableRowCurrent : ""}`}
                  aria-current={r.id === item.id ? "true" : undefined}
                >
                  <span className={styles.tableRowNo}>{i + 1}</span>
                  <div className={styles.tableRowBody}>
                    {r.category && (
                      <ClarificationCategoryChip category={r.category} />
                    )}
                    <span className={styles.tableRowText}>
                      {r.qualification || "-"}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {canManage && (
          <div className={shell.footer}>
            <button
              type="button"
              className={shell.primaryBtn}
              onClick={onEditTable}
            >
              <ListPlus size={14} /> Edit table
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onEdit}
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              type="button"
              className={shell.dangerBtn}
              onClick={onDelete}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
