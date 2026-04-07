import * as React from "react";
import { IBidComment } from "../../models";
import { PersonaCard } from "../common/PersonaCard";

interface BidCommentsProps {
  comments: IBidComment[];
  onAdd?: (text: string) => void;
  className?: string;
}

export const BidComments: React.FC<BidCommentsProps> = ({
  comments,
  onAdd,
  className,
}) => {
  const [newComment, setNewComment] = React.useState("");

  const handleAdd = (): void => {
    if (newComment.trim() && onAdd) {
      onAdd(newComment.trim());
      setNewComment("");
    }
  };

  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
        Comments ({comments.length})
      </h4>
      {onAdd && (
        <div style={{ display: "flex", gap: 8 }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            style={{
              flex: 1,
              padding: 12,
              border: "1px solid var(--border-subtle)",
              borderRadius: 8,
              resize: "vertical",
              minHeight: 60,
              fontSize: 14,
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={handleAdd}
            disabled={!newComment.trim()}
            style={{
              padding: "8px 20px",
              background: "var(--accent-color, #3B82F6)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: newComment.trim() ? "pointer" : "not-allowed",
              opacity: newComment.trim() ? 1 : 0.5,
              fontSize: 14,
              fontWeight: 600,
              alignSelf: "flex-end",
            }}
          >
            Post
          </button>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              padding: 16,
              borderRadius: 8,
              border: "1px solid var(--border-subtle)",
              background: "var(--card-bg)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <PersonaCard
                name={comment.author.name}
                email={comment.author.email}
                size="small"
              />
              <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                {new Date(comment.timestamp).toLocaleString()}
              </span>
            </div>
            <p
              style={{ margin: 0, fontSize: 14, color: "var(--text-primary)" }}
            >
              {comment.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
