import * as React from "react";
import { IApprovalChain } from "../../models/IBidApproval";
import styles from "./ApprovalMatrix.module.scss";

interface ApprovalMatrixProps {
  chains: IApprovalChain[];
  className?: string;
}

export const ApprovalMatrix: React.FC<ApprovalMatrixProps> = ({
  chains,
  className,
}) => {
  return (
    <div className={`${styles.wrapper} ${className || ""}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Chain</th>
            <th>Approver</th>
            <th>Role</th>
            <th className={styles.thCenter}>Decision</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {([] as React.ReactNode[]).concat(
            ...chains.map((chain: IApprovalChain) =>
              chain.steps.map(
                (step: IApprovalChain["steps"][0], idx: number) => (
                  <tr key={`${chain.chainId}-${step.stepOrder}`}>
                    {idx === 0 ? (
                      <td
                        rowSpan={chain.steps.length}
                        className={styles.cellChain}
                      >
                        {chain.chainName}
                      </td>
                    ) : null}
                    <td>{step.approver.name}</td>
                    <td className={styles.cellRole}>{step.role}</td>
                    <td className={styles.cellCenter}>
                      {step.decision === "approved" && "✅"}
                      {step.decision === "rejected" && "❌"}
                      {step.decision === "revision-requested" && "🔄"}
                      {!step.decision &&
                        step.stepOrder === chain.currentStep &&
                        "⏳"}
                      {!step.decision &&
                        step.stepOrder !== chain.currentStep &&
                        "⚪"}
                    </td>
                    <td className={styles.cellDate}>
                      {step.decisionDate
                        ? new Date(step.decisionDate).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ),
              ),
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};
