import * as React from "react";
import { Check, FastForward, ShieldCheck } from "lucide-react";
import { IApprovalOverride } from "../../models/IBid";
import { formatDateTime } from "../../utils/formatters";
import styles from "./ApprovalOverrideBanner.module.scss";

interface ApprovalOverrideBannerProps {
  override: IApprovalOverride;
  compact?: boolean;
}

const NON_PENDING_LABEL: Record<string, string> = {
  rejected: "had rejected",
  "revision-requested": "had requested revision",
};

export const ApprovalOverrideBanner: React.FC<ApprovalOverrideBannerProps> = ({
  override,
  compact,
}) => {
  const participants = override.approvalsAtOverride || [];
  const approved = participants.filter((p) => p.status === "approved");
  const bypassed = participants.filter((p) => p.status !== "approved");

  return (
    <div className={`${styles.banner} ${compact ? styles.compact : ""}`}>
      <div className={styles.header}>
        <ShieldCheck size={compact ? 14 : 16} />
        <span className={styles.title}>Approval Overridden</span>
      </div>
      <div className={styles.meta}>
        by <strong>{override.overriddenBy.name}</strong> on{" "}
        {formatDateTime(override.overriddenDate)}
      </div>
      <div className={styles.reason}>{override.reason}</div>

      <div className={styles.summary}>
        {override.totalApprovers === 0 ? (
          "The approval flow had not been started - no approver responses were recorded."
        ) : (
          <>
            <strong>
              {override.approvedCount} of {override.totalApprovers}
            </strong>{" "}
            approvers had approved before the override.
          </>
        )}
      </div>

      {participants.length > 0 && (
        <div className={styles.groups}>
          {approved.length > 0 && (
            <div>
              <div className={styles.groupTitle}>Approved before override</div>
              <ul className={styles.list}>
                {approved.map((p) => (
                  <li
                    key={p.stakeholder.email}
                    className={`${styles.item} ${styles.itemApproved}`}
                  >
                    <Check size={12} className={styles.itemIcon} />
                    <span className={styles.itemName}>
                      {p.stakeholder.name}
                      <span className={styles.itemRole}>
                        {" "}
                        · {p.stakeholderRole}
                      </span>
                    </span>
                    {p.respondedDate && (
                      <span className={styles.itemMeta}>
                        {formatDateTime(p.respondedDate)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {bypassed.length > 0 && (
            <div>
              <div className={styles.groupTitle}>Bypassed by override</div>
              <ul className={styles.list}>
                {bypassed.map((p) => (
                  <li
                    key={p.stakeholder.email}
                    className={`${styles.item} ${styles.itemBypassed}`}
                  >
                    <FastForward size={12} className={styles.itemIcon} />
                    <span className={styles.itemName}>
                      {p.stakeholder.name}
                      <span className={styles.itemRole}>
                        {" "}
                        · {p.stakeholderRole}
                      </span>
                    </span>
                    {NON_PENDING_LABEL[p.status] && (
                      <span className={styles.itemMeta}>
                        {NON_PENDING_LABEL[p.status]}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
