import * as React from "react";
import { IApprovalChain } from "../../models/IBidApproval";

interface ApprovalMatrixProps {
  chains: IApprovalChain[];
  className?: string;
}

export const ApprovalMatrix: React.FC<ApprovalMatrixProps> = ({
  chains,
  className,
}) => {
  return (
    <div className={className} style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                padding: "10px 12px",
                textAlign: "left",
                borderBottom: "1px solid var(--border-subtle)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              Chain
            </th>
            <th
              style={{
                padding: "10px 12px",
                textAlign: "left",
                borderBottom: "1px solid var(--border-subtle)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              Approver
            </th>
            <th
              style={{
                padding: "10px 12px",
                textAlign: "left",
                borderBottom: "1px solid var(--border-subtle)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              Role
            </th>
            <th
              style={{
                padding: "10px 12px",
                textAlign: "center",
                borderBottom: "1px solid var(--border-subtle)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              Decision
            </th>
            <th
              style={{
                padding: "10px 12px",
                textAlign: "left",
                borderBottom: "1px solid var(--border-subtle)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {([] as React.ReactNode[]).concat(
            ...chains.map((chain: IApprovalChain) =>
              chain.steps.map((step: IApprovalChain["steps"][0], idx: number) => (
              <tr
                key={`${chain.chainId}-${step.stepOrder}`}
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                {idx === 0 ? (
                  <td
                    rowSpan={chain.steps.length}
                    style={{
                      padding: "10px 12px",
                      fontWeight: 600,
                      fontSize: 14,
                      verticalAlign: "top",
                    }}
                  >
                    {chain.chainName}
                  </td>
                ) : null}
                <td style={{ padding: "10px 12px", fontSize: 14 }}>
                  {step.approver.name}
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                  }}
                >
                  {step.role}
                </td>
                <td style={{ padding: "10px 12px", textAlign: "center" }}>
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
                <td
                  style={{
                    padding: "10px 12px",
                    fontSize: 12,
                    color: "var(--text-secondary)",
                  }}
                >
                  {step.decisionDate
                    ? new Date(step.decisionDate).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))
          )
          )}
        </tbody>
      </table>
    </div>
  );
};
