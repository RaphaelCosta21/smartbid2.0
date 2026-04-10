import * as React from "react";
import { IApprovalChain } from "../../models/IBidApproval";
import { Timeline } from "../common/Timeline";
import styles from "./ApprovalTimeline.module.scss";

interface ApprovalTimelineProps {
  chains: IApprovalChain[];
  className?: string;
}

export const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({
  chains,
  className,
}) => {
  return (
    <div className={`${styles.container} ${className || ""}`}>
      {chains.map((chain) => (
        <div key={chain.chainId}>
          <h5 className={styles.chainTitle}>
            {chain.chainName} ({chain.division})
          </h5>
          <Timeline
            items={chain.steps.map((step) => ({
              id: `${chain.chainId}-${step.stepOrder}`,
              title: `${step.approver.name} (${step.role})`,
              description: step.decision
                ? `${step.decision}${step.comments ? ` — ${step.comments}` : ""}`
                : step.stepOrder === chain.currentStep
                  ? "Awaiting decision..."
                  : "Pending",
              timestamp: step.decisionDate
                ? new Date(step.decisionDate).toLocaleString()
                : "",
              color:
                step.decision === "approved"
                  ? "#10B981"
                  : step.decision === "rejected"
                    ? "#EF4444"
                    : step.stepOrder === chain.currentStep
                      ? "#F59E0B"
                      : "#94A3B8",
            }))}
          />
        </div>
      ))}
    </div>
  );
};
