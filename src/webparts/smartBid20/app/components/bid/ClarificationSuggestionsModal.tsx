/**
 * ClarificationSuggestionsModal — Review panel for AI-suggested clarifications /
 * qualifications. The user selects which suggestions to accept; accepted ones
 * are mapped to IClarificationItem rows by the caller.
 *
 * Used by QualificationsTab (on-demand "Suggest with AI" button).
 */
import * as React from "react";
import { IAISuggestedClarification } from "../../models";

export interface ClarificationSuggestionsModalProps {
  suggestions: IAISuggestedClarification[];
  /** When true, shows a loading state (request in flight). */
  loading?: boolean;
  onAccept: (accepted: IAISuggestedClarification[]) => void;
  onClose: () => void;
}

export const ClarificationSuggestionsModal: React.FC<
  ClarificationSuggestionsModalProps
> = ({ suggestions, loading, onAccept, onClose }) => {
  const [selected, setSelected] = React.useState<Record<number, boolean>>({});

  React.useEffect(() => {
    const init: Record<number, boolean> = {};
    suggestions.forEach((_, i) => {
      init[i] = true;
    });
    setSelected(init);
  }, [suggestions]);

  const toggle = (i: number): void =>
    setSelected((prev) => ({ ...prev, [i]: !prev[i] }));

  const acceptedList = suggestions.filter((_, i) => selected[i]);

  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  };
  const modal: React.CSSProperties = {
    width: "100%",
    maxWidth: 720,
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
    overflow: "hidden",
  };
  const header: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid var(--border)",
  };
  const body: React.CSSProperties = {
    padding: 20,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };
  const footer: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    padding: "14px 20px",
    borderTop: "1px solid var(--border)",
  };

  const badgeStyle = (
    baseType: IAISuggestedClarification["baseType"],
  ): React.CSSProperties => ({
    display: "inline-block",
    padding: "1px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    color: "#fff",
    background:
      baseType === "Qualification"
        ? "var(--warning-color, #F59E0B)"
        : "var(--primary-accent, #3B82F6)",
  });

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={header}>
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            AI Clarification Suggestions
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 22,
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        <div style={body}>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "var(--text-secondary)",
                fontSize: 14,
              }}
            >
              Analyzing requirements and past clarifications…
            </div>
          ) : suggestions.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "var(--text-secondary)",
                fontSize: 14,
              }}
            >
              No clarification suggestions were returned.
            </div>
          ) : (
            suggestions.map((s, i) => (
              <label
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: 14,
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: selected[i]
                    ? "var(--card-bg-elevated)"
                    : "transparent",
                  cursor: "pointer",
                  transition: "background 150ms",
                }}
              >
                <input
                  type="checkbox"
                  checked={!!selected[i]}
                  onChange={() => toggle(i)}
                  style={{ marginTop: 3, flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={badgeStyle(s.baseType)}>{s.baseType}</span>
                    <strong
                      style={{ fontSize: 13, color: "var(--text-primary)" }}
                    >
                      {s.description || "(no title)"}
                    </strong>
                    {typeof s.confidence === "number" && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted, var(--text-secondary))",
                        }}
                      >
                        {Math.round(s.confidence * 100)}%
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-primary)",
                      marginBottom: s.rationale || s.relatedRef ? 6 : 0,
                    }}
                  >
                    {s.clarification}
                  </div>
                  {s.rationale && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        fontStyle: "italic",
                      }}
                    >
                      Why: {s.rationale}
                    </div>
                  )}
                  {s.relatedRef && (
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 11,
                        color: "var(--text-secondary)",
                      }}
                    >
                      Ref: {s.relatedRef}
                    </div>
                  )}
                </div>
              </label>
            ))
          )}
        </div>

        <div style={footer}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onAccept(acceptedList)}
            disabled={loading || acceptedList.length === 0}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: "var(--primary-accent)",
              color: "#fff",
              cursor:
                loading || acceptedList.length === 0
                  ? "not-allowed"
                  : "pointer",
              opacity: loading || acceptedList.length === 0 ? 0.5 : 1,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Add {acceptedList.length} selected
          </button>
        </div>
      </div>
    </div>
  );
};
