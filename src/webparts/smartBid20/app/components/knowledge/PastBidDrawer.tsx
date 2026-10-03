import * as React from "react";
import { CloudUpload, ExternalLink, Pencil, RefreshCw, X } from "lucide-react";
import { IBid } from "../../models";
import { DivisionBadge } from "../common/DivisionBadge";
import { BidFavoriteButton } from "../bid/BidFavoriteButton";
import { formatDate } from "../../utils/formatters";
import {
  findRelatedBids,
  getPastBidKbStatus,
} from "../../utils/pastBidHelpers";
import { getPastBidYear } from "../../utils/pastBidDocument";
import { PastBidKnowledgeService } from "../../services/PastBidKnowledgeService";
import styles from "./PastBidDrawer.module.scss";

interface PastBidDrawerProps {
  bid: IBid;
  /** Completed BIDs used to compute related BIDs */
  candidates: IBid[];
  canManage: boolean;
  busy: boolean;
  onClose: () => void;
  onOpenBid: (bidNumber: string) => void;
  onSelectBid: (bidNumber: string) => void;
  onEdit: () => void;
  onPublish: () => void;
}

const MAX_REASONS = 4;

export const PastBidDrawer: React.FC<PastBidDrawerProps> = ({
  bid,
  candidates,
  canManage,
  busy,
  onClose,
  onOpenBid,
  onSelectBid,
  onEdit,
  onPublish,
}) => {
  const profile = bid.knowledgeProfile;
  const status = getPastBidKbStatus(bid);
  const opp = bid.opportunityInfo;
  const related = React.useMemo(
    () => findRelatedBids(bid, candidates),
    [bid, candidates],
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const summary =
    (profile && profile.summary) || (opp && opp.projectDescription) || "";

  const renderChips = (values: string[], accent?: boolean): React.ReactNode =>
    values.length ? (
      <div className={styles.chips}>
        {values.map((v) => (
          <span
            key={v}
            className={`${styles.chip} ${accent ? styles.chipAccent : ""}`}
          >
            {v}
          </span>
        ))}
      </div>
    ) : (
      <span className={styles.emptyText}>Not classified yet</span>
    );

  const publishLabel =
    status === "published"
      ? "Republish"
      : status === "failed"
        ? "Retry publish"
        : "Publish";

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={`Past BID ${bid.bidNumber}`}
      >
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <span className={styles.bidNumber}>{bid.bidNumber}</span>
            <span className={styles.client}>{opp?.client || "-"}</span>
            {opp?.projectName && (
              <span className={styles.project}>{opp.projectName}</span>
            )}
            <div className={styles.meta}>
              {bid.division && <DivisionBadge division={bid.division} />}
              {bid.serviceLine && <span>{bid.serviceLine}</span>}
              <span>
                Completed{" "}
                {bid.completedDate ? formatDate(bid.completedDate) : "-"}
              </span>
            </div>
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
            <div className={styles.sectionTitle}>Summary</div>
            {summary ? (
              <p className={styles.text}>{summary}</p>
            ) : (
              <span className={styles.emptyText}>No summary yet</span>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionTitle}>Scope categories</div>
            {renderChips(profile ? profile.scopeCategories : [], true)}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionTitle}>Tags</div>
            {renderChips(profile ? profile.tags : [])}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionTitle}>Outcome</div>
            <span className={styles.text}>
              {bid.bidResult?.outcome || "Not recorded yet"}
              {bid.bidResult?.outcomeDate
                ? ` · ${formatDate(bid.bidResult.outcomeDate)}`
                : ""}
            </span>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionTitle}>Knowledge Base</div>
            {status === "published" && profile && (
              <div className={styles.kbRow}>
                <span className={`${styles.kbBadge} ${styles.kbPublished}`}>
                  In Knowledge Base
                </span>
                <span className={styles.muted}>
                  {profile.doc.publishedDate
                    ? `Published ${formatDate(profile.doc.publishedDate)}`
                    : ""}
                  {profile.doc.publishedBy
                    ? ` by ${profile.doc.publishedBy.name}`
                    : ""}
                </span>
                <a
                  className={styles.docLink}
                  href={PastBidKnowledgeService.fileUrl(
                    profile.doc.serverRelativeUrl,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={13} /> Open knowledge document
                </a>
              </div>
            )}
            {status === "failed" && profile && (
              <div className={styles.kbRow}>
                <span className={`${styles.kbBadge} ${styles.kbFailed}`}>
                  Publish failed
                </span>
                {profile.doc.error && (
                  <span className={styles.errorText}>{profile.doc.error}</span>
                )}
              </div>
            )}
            {status === "not-published" && (
              <span className={styles.emptyText}>
                This BID was completed before Past Bids existed and is not in
                the Knowledge Base yet.
              </span>
            )}
            {profile && profile.aiStatus === "failed" && (
              <span className={styles.muted}>
                AI classification failed - tags come from the scope only. Use
                Edit to add them or suggest them again.
              </span>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionTitle}>Related BIDs</div>
            {related.length === 0 ? (
              <span className={styles.emptyText}>
                No related BIDs yet. BIDs are related when they share tags,
                scope categories, client or equipment.
              </span>
            ) : (
              <div className={styles.relatedList}>
                {related.map((r) => (
                  <button
                    type="button"
                    key={r.bid.bidNumber}
                    className={styles.relatedItem}
                    onClick={() => onSelectBid(r.bid.bidNumber)}
                  >
                    <div className={styles.relatedTop}>
                      <span className={styles.relatedBid}>
                        {r.bid.bidNumber}
                      </span>
                      <span className={styles.relatedYear}>
                        {getPastBidYear(r.bid)}
                      </span>
                    </div>
                    <span className={styles.relatedClient}>
                      {r.bid.opportunityInfo?.client || "-"}
                      {r.bid.opportunityInfo?.projectName
                        ? ` · ${r.bid.opportunityInfo.projectName}`
                        : ""}
                    </span>
                    {r.reasons.length > 0 && (
                      <div className={styles.chips}>
                        {r.reasons.slice(0, MAX_REASONS).map((reason) => (
                          <span key={reason} className={styles.chip}>
                            {reason}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => onOpenBid(bid.bidNumber)}
          >
            Open BID Details
          </button>
          <BidFavoriteButton
            bid={bid}
            showLabel
            className={styles.secondaryBtn}
          />
          {canManage && (
            <>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={onEdit}
                disabled={busy}
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={onPublish}
                disabled={busy}
              >
                {busy ? (
                  <RefreshCw size={14} className={styles.spin} />
                ) : (
                  <CloudUpload size={14} />
                )}
                {busy ? "Publishing…" : publishLabel}
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
};
