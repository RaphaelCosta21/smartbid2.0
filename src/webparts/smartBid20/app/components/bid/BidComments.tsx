import * as React from "react";
import { IBidComment } from "../../models";
import { PersonaCard } from "../common/PersonaCard";
import { formatDateTime } from "../../utils/formatters";
import styles from "./BidComments.module.scss";

interface BidCommentsProps {
  comments: IBidComment[];
  onAdd?: (text: string) => void;
  className?: string;
}

export const BidComments: React.FC<BidCommentsProps> = ({
  comments = [],
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
    <div className={`${styles.container} ${className || ""}`}>
      <h4 className={styles.title}>Comments ({comments.length})</h4>
      {onAdd && (
        <div className={styles.addRow}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className={styles.textarea}
          />
          <button
            onClick={handleAdd}
            disabled={!newComment.trim()}
            className={styles.postBtn}
          >
            Post
          </button>
        </div>
      )}
      <div className={styles.commentList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.commentHeader}>
              <PersonaCard
                name={comment.author.name}
                email={comment.author.email}
                size="small"
              />
              <span className={styles.commentTime}>
                {formatDateTime(comment.timestamp)}
              </span>
            </div>
            <p className={styles.commentText}>{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
