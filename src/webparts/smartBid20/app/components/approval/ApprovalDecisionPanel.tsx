import * as React from "react";

interface ApprovalDecisionPanelProps {
  bidNumber: string;
  chainName: string;
  onApprove: (comments: string) => void;
  onReject: (comments: string) => void;
  onRequestRevision: (comments: string) => void;
  className?: string;
}

export const ApprovalDecisionPanel: React.FC<ApprovalDecisionPanelProps> = ({
  bidNumber,
  chainName,
  onApprove,
  onReject,
  onRequestRevision,
  className,
}) => {
  const [comments, setComments] = React.useState("");

  return (
    <div
      className={className}
      style={{
        padding: 20,
        borderRadius: 12,
        border: "1px solid var(--border-subtle)",
        background: "var(--card-bg)",
      }}
    >
      <h4 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600 }}>
        Decision Required
      </h4>
      <p
        style={{
          margin: "0 0 16px",
          fontSize: 13,
          color: "var(--text-secondary)",
        }}
      >
        {bidNumber} — {chainName}
      </p>
      <textarea
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Add comments (optional)"
        style={{
          width: "100%",
          minHeight: 80,
          padding: 12,
          border: "1px solid var(--border-subtle)",
          borderRadius: 8,
          fontSize: 14,
          fontFamily: "inherit",
          resize: "vertical",
          marginBottom: 16,
        }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onApprove(comments)}
          style={{
            flex: 1,
            padding: "10px 16px",
            background: "#10B981",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Approve
        </button>
        <button
          onClick={() => onRequestRevision(comments)}
          style={{
            flex: 1,
            padding: "10px 16px",
            background: "#F59E0B",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Request Revision
        </button>
        <button
          onClick={() => onReject(comments)}
          style={{
            flex: 1,
            padding: "10px 16px",
            background: "#EF4444",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
};
