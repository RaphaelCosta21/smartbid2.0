import * as React from "react";
import { ExternalLink, Pencil, Trash2, X } from "lucide-react";
import { IBid } from "../../models";
import { IClarificationDbItem } from "../../models/IClarificationDb";
import { useConfigStore } from "../../stores/useConfigStore";
import { DivisionBadge } from "../common/DivisionBadge";
import { ConfidentialLock } from "../bid/ConfidentialLock";
import {
  ClarificationCategoryChip,
  ClarificationOriginChip,
  ClarificationTypeBadge,
} from "./ClarificationBadges";
import {
  cleanClientDocRef,
  configOptionLabel,
} from "../../utils/clarificationHelpers";
import { formatDate } from "../../utils/formatters";
import styles from "./ClarificationEntryDrawer.module.scss";

interface ClarificationEntryDrawerProps {
  item: IClarificationDbItem;
  /** Source BID when it is loaded in the BID store */
  sourceBid?: IBid;
  canManage: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenBid: (bidNumber: string) => void;
}

export const ClarificationEntryDrawer: React.FC<
  ClarificationEntryDrawerProps
> = ({ item, sourceBid, canManage, onClose, onEdit, onDelete, onOpenBid }) => {
  const config = useConfigStore((s) => s.config);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const ref = cleanClientDocRef(item.clientDocRef);
  const opp = sourceBid ? sourceBid.opportunityInfo : undefined;
  const details: [string, React.ReactNode][] = [
    ["Client Doc Ref", ref || "-"],
    ["Client", configOptionLabel(config?.clientList, item.client) || "-"],
    [
      "Division",
      item.division ? <DivisionBadge division={item.division} /> : "-",
    ],
    [
      "Service Line",
      configOptionLabel(config?.serviceLines, item.serviceLine) || "-",
    ],
    ["Keyword", item.keyword || "-"],
    ["Approved", item.approved ? "Yes" : "No"],
    ["Reply date", item.date ? formatDate(item.date) : "-"],
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
      <div className={styles.overlay} onClick={onClose} />
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.baseType} details`}
      >
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.badges}>
              <ClarificationTypeBadge type={item.baseType} />
              <ClarificationCategoryChip
                category={item.category}
                emptyLabel="No category"
              />
              <ClarificationOriginChip sourceBidNumber={item.sourceBidNumber} />
            </div>
            <h2 className={styles.topic}>
              {item.etTopic || `${item.baseType} #${item.id}`}
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <div className={styles.sectionTitle}>{item.baseType}</div>
            {item.clarification ? (
              <p className={styles.text}>{item.clarification}</p>
            ) : (
              <span className={styles.emptyText}>No text</span>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionTitle}>Client reply</div>
            {item.clientReply ? (
              <p className={`${styles.text} ${styles.replyText}`}>
                {item.clientReply}
              </p>
            ) : (
              <span className={styles.emptyText}>No reply recorded</span>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionTitle}>Details</div>
            <dl className={styles.details}>
              {details.map(([label, value]) => (
                <React.Fragment key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </React.Fragment>
              ))}
            </dl>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionTitle}>Source</div>
            {item.sourceBidNumber ? (
              <div className={styles.sourceCard}>
                <div className={styles.sourceTop}>
                  <span className={styles.sourceBid}>
                    {(sourceBid && sourceBid.crmNumber) || item.sourceBidNumber}
                    <ConfidentialLock bidNumber={item.sourceBidNumber} />
                  </span>
                  {sourceBid && sourceBid.completedDate && (
                    <span className={styles.muted}>
                      Completed {formatDate(sourceBid.completedDate)}
                    </span>
                  )}
                </div>
                {sourceBid ? (
                  <>
                    <span className={styles.sourceClient}>
                      {(opp && opp.client) || "-"}
                    </span>
                    {opp && opp.projectName && (
                      <span className={styles.muted}>{opp.projectName}</span>
                    )}
                    {sourceBid.crmNumber && (
                      <span className={styles.muted}>
                        Ref: {sourceBid.bidNumber}
                      </span>
                    )}
                  </>
                ) : (
                  <span className={styles.muted}>
                    BID details are not loaded. Open the BID to see them.
                  </span>
                )}
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => onOpenBid(item.sourceBidNumber)}
                >
                  <ExternalLink size={13} /> Open BID
                </button>
              </div>
            ) : (
              <span className={styles.emptyText}>
                Created manually in the library, not linked to a BID.
              </span>
            )}
          </section>
        </div>

        {canManage && (
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={onEdit}
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              type="button"
              className={styles.dangerBtn}
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
