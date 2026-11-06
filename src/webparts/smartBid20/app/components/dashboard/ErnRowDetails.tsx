/**
 * ErnRowDetails — full details of a watchlist ERN (people with photos, the
 * stage dates, description and actions). Shared by the List and Timeline views.
 */
import * as React from "react";
import { ExternalLink } from "lucide-react";
import {
  ERN_GENERAL_SUPPORT_TITLE,
  ERN_STAGE_DATE_LABELS,
  getErnPeople,
  IErnLinkRow,
} from "../../utils/ernHelpers";
import { formatDate } from "../../utils/formatters";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import { UserAvatar } from "../common/UserAvatar";
import styles from "./ErnRowDetails.module.scss";

interface ErnRowDetailsProps {
  row: IErnLinkRow;
  onBidClick: (bidNumber: string) => void;
  /** false while collapsed so hidden buttons stay out of the tab order */
  tabbable?: boolean;
}

export const ErnRowDetails: React.FC<ErnRowDetailsProps> = ({
  row: r,
  onBidClick,
  tabbable = true,
}) => {
  const ern = r.ern;
  const open = !r.closed && !r.onHold;
  const people = getErnPeople(ern);
  const tabIndex = tabbable ? 0 : -1;

  return (
    <>
      <div className={styles.people}>
        {people.length === 0 && (
          <span className={styles.muted}>ERN details not loaded yet.</span>
        )}
        {people.map((p) => {
          const current = open && p.stage === r.stage;
          return (
            <div
              key={p.stage}
              className={`${styles.person} ${current ? styles.personCurrent : ""}`}
            >
              <UserAvatar
                name={p.name || p.email}
                email={p.email}
                size={34}
                ring={current}
              />
              <span className={styles.personText}>
                <span className={styles.personRole}>
                  {p.role}
                  {current && <span className={styles.nowTag}>Now</span>}
                </span>
                <span className={styles.personName}>{p.name || "-"}</span>
                <span className={styles.personDate}>
                  {p.dueDate
                    ? `${ERN_STAGE_DATE_LABELS[p.stage]} ${formatDate(p.dueDate, "MMM d, yyyy")}`
                    : `No ${ERN_STAGE_DATE_LABELS[p.stage].toLowerCase()}`}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.grid}>
        <Detail label="Status" value={r.status} />
        <Detail
          label="BID"
          value={r.bid ? r.bid.bidNumber : ERN_GENERAL_SUPPORT_TITLE}
        />
        <Detail label="Project number" value={ern?.projectNumber} />
        <Detail
          label="Service line"
          value={ern?.serviceLine || r.bid?.serviceLine}
        />
        <Detail label="Deliverable" value={ern?.deliverableType} />
        {r.finishDate && (
          <Detail label="Released" value={formatDate(r.finishDate)} />
        )}
      </div>

      {ern?.description && (
        <p className={styles.description}>{ern.description}</p>
      )}

      <div className={styles.actions}>
        {r.bid && (
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => r.bid && onBidClick(r.bid.bidNumber)}
            tabIndex={tabIndex}
          >
            Open {r.bid.bidNumber}
          </button>
        )}
        <a
          className={styles.linkBtn}
          href={SHAREPOINT_CONFIG.ern.appUrl}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={tabIndex}
        >
          Open in ERN app <ExternalLink size={12} />
        </a>
      </div>
    </>
  );
};

const Detail: React.FC<{ label: string; value?: string }> = ({
  label,
  value,
}) => (
  <div className={styles.detail}>
    <span className={styles.detailLabel}>{label}</span>
    <span className={styles.detailValue}>{value || "-"}</span>
  </div>
);
