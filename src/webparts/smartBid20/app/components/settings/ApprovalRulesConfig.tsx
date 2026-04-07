import * as React from "react";

export const ApprovalRulesConfig: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
        Approval Rules Configuration
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
        Configure approval chains, approvers, and escalation rules.
      </p>
      <div
        style={{
          padding: 32,
          background: "var(--card-bg)",
          borderRadius: 12,
          border: "1px solid var(--border-subtle)",
          textAlign: "center",
          color: "var(--text-secondary)",
        }}
      >
        Approval rules editor will be implemented here with chain management,
        approver assignment, and threshold configuration.
      </div>
    </div>
  );
};
