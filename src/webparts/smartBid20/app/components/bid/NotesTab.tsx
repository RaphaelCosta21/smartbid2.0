import * as React from "react";
import { IBid, IQuickNote } from "../../models";
import { GlassCard } from "../common/GlassCard";
import { EmptySection } from "./EmptySection";
import { makeId } from "../../utils/idGenerator";
import { formatDateTime } from "../../utils/formatters";
import styles from "../../pages/BidDetailPage.module.scss";

export interface NotesTabProps {
  bid: IBid;
  canEdit?: boolean;
  onSave?: (patch: Partial<IBid>) => void;
  currentUser?: { displayName: string; email: string };
}

export const NotesTab: React.FC<NotesTabProps> = ({
  bid,
  canEdit,
  onSave,
  currentUser,
}) => {
  const notes = (bid.bidNotes || {}) as Record<string, string>;
  const entries = Object.entries(notes);
  const quickNotes: IQuickNote[] = bid.quickNotes || [];
  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");
  const [newKey, setNewKey] = React.useState("");
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newQuickNote, setNewQuickNote] = React.useState("");

  const handleSave = (key: string, value: string): void => {
    if (!onSave) return;
    onSave({ bidNotes: { ...notes, [key]: value } });
    setEditingKey(null);
  };

  const handleAddNote = (): void => {
    if (!onSave || !newKey.trim()) return;
    onSave({ bidNotes: { ...notes, [newKey.trim()]: editValue } });
    setNewKey("");
    setEditValue("");
    setShowAddForm(false);
  };

  const handleDelete = (key: string): void => {
    if (!onSave) return;
    const updated = { ...notes };
    delete updated[key];
    onSave({ bidNotes: updated });
  };

  const addQuickNote = (): void => {
    if (!onSave || !newQuickNote.trim()) return;
    const qn: IQuickNote = {
      id: makeId("note"),
      text: newQuickNote.trim(),
      author: {
        name: currentUser?.displayName || "",
        email: currentUser?.email || "",
      },
      createdAt: new Date().toISOString(),
    };
    onSave({ quickNotes: [...quickNotes, qn] });
    setNewQuickNote("");
  };

  const deleteQuickNote = (noteId: string): void => {
    if (!onSave) return;
    onSave({ quickNotes: quickNotes.filter((n) => n.id !== noteId) });
  };

  return (
    <div className={styles.flexColumn}>
      {/* Request Notes (bidNotes.general) */}
      {notes.general && (
        <GlassCard title="Request Notes (from Commercial)">
          <p className={styles.scopeDescription}>{notes.general}</p>
        </GlassCard>
      )}

      {/* Quick Notes */}
      <GlassCard title="Quick Notes">
        {quickNotes.length === 0 && !canEdit && (
          <EmptySection message="No quick notes yet." />
        )}
        <div className={styles.flexColumn}>
          {quickNotes.map((qn) => (
            <div
              key={qn.id}
              className={styles.infoSection}
              style={{
                padding: "10px 14px",
                borderLeft: "3px solid var(--primary-accent)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "var(--text-primary)",
                  }}
                >
                  {qn.text}
                </p>
                {canEdit && (
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--error-color, #EF4444)",
                      cursor: "pointer",
                      fontSize: 13,
                      marginLeft: 8,
                      flexShrink: 0,
                    }}
                    onClick={() => deleteQuickNote(qn.id)}
                  >
                    ✕
                  </button>
                )}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-tertiary)",
                  marginTop: 4,
                }}
              >
                {qn.author?.name || "Unknown"} ·{" "}
                {qn.createdAt ? formatDateTime(qn.createdAt) : ""}
              </div>
            </div>
          ))}
        </div>
        {canEdit && (
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input
              value={newQuickNote}
              onChange={(e) => setNewQuickNote(e.target.value)}
              placeholder="Write a quick note..."
              onKeyDown={(e) => {
                if (e.key === "Enter") addQuickNote();
              }}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--card-bg-elevated)",
                color: "var(--text-primary)",
                fontSize: 13,
              }}
            />
            <button
              className={styles.backBtn}
              style={{
                background: "var(--primary-accent)",
                color: "#fff",
                border: "none",
              }}
              onClick={addQuickNote}
              disabled={!newQuickNote.trim()}
            >
              + Add
            </button>
          </div>
        )}
      </GlassCard>

      {/* Analysis Notes (bidNotes) */}
      <GlassCard title="BID Analysis Notes">
        {entries.filter(([k]) => k !== "general").length === 0 &&
        !showAddForm ? (
          <EmptySection message="No analysis notes added yet." />
        ) : (
          <div className={styles.flexColumn}>
            {entries
              .filter(([k]) => k !== "general")
              .map(([section, content]) => (
                <div key={section} className={styles.infoSection}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4
                      className={styles.infoTitle}
                      style={{
                        marginBottom: 0,
                        borderBottom: "none",
                        paddingBottom: 0,
                        flex: 1,
                      }}
                    >
                      {section}
                    </h4>
                    {canEdit && editingKey !== section && (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          className={styles.backBtn}
                          onClick={() => {
                            setEditingKey(section);
                            setEditValue(content);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.backBtn}
                          style={{ color: "var(--error-color, #EF4444)" }}
                          onClick={() => handleDelete(section)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  {editingKey === section ? (
                    <div style={{ marginTop: "12px" }}>
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        style={{
                          width: "100%",
                          minHeight: "100px",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                          background: "var(--card-bg-elevated)",
                          color: "var(--text-primary)",
                          fontSize: "13px",
                          resize: "vertical",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginTop: "8px",
                        }}
                      >
                        <button
                          className={styles.backBtn}
                          style={{
                            background: "var(--primary-accent)",
                            color: "white",
                            border: "none",
                          }}
                          onClick={() => handleSave(section, editValue)}
                        >
                          Save
                        </button>
                        <button
                          className={styles.backBtn}
                          onClick={() => setEditingKey(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p
                      className={styles.noteContent}
                      style={{ marginTop: "12px" }}
                    >
                      {content}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
        {canEdit && !showAddForm && (
          <button
            className={styles.backBtn}
            style={{
              marginTop: "16px",
              background: "var(--primary-accent)",
              color: "white",
              border: "none",
            }}
            onClick={() => setShowAddForm(true)}
          >
            + Add Note
          </button>
        )}
        {canEdit && showAddForm && (
          <div className={styles.infoSection} style={{ marginTop: "16px" }}>
            <input
              placeholder="Section title (e.g., Gap Analysis, Technical Notes...)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--card-bg-elevated)",
                color: "var(--text-primary)",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            />
            <textarea
              placeholder="Note content..."
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--card-bg-elevated)",
                color: "var(--text-primary)",
                fontSize: "13px",
                resize: "vertical",
              }}
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button
                className={styles.backBtn}
                style={{
                  background: "var(--primary-accent)",
                  color: "white",
                  border: "none",
                }}
                onClick={handleAddNote}
                disabled={!newKey.trim()}
              >
                Save Note
              </button>
              <button
                className={styles.backBtn}
                onClick={() => {
                  setShowAddForm(false);
                  setNewKey("");
                  setEditValue("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
