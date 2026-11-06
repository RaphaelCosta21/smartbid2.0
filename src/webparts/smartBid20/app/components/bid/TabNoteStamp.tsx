import * as React from "react";
import { Pin } from "lucide-react";
import { IBidNote } from "../../models";
import { formatDateTime } from "../../utils/formatters";
import { UserAvatar } from "../common/UserAvatar";
import styles from "./TabNoteStamp.module.scss";

/** "Last edited by" line under the Scope / Hours "Notes / Comments" field. */
export const TabNoteStamp: React.FC<{ note?: IBidNote }> = ({ note }) => {
  if (!note) return null;
  const person = note.updatedBy || note.author;
  const at = note.updatedAt || note.createdAt;
  const edited = !!note.updatedBy;
  return (
    <div className={styles.stamp}>
      <UserAvatar
        name={person.name}
        email={person.email}
        photoUrl={person.photoUrl}
        size={18}
      />
      <span>
        {edited ? "Last edited by" : "Added by"} <strong>{person.name}</strong>
        {at ? ` · ${formatDateTime(at)}` : ""}
      </span>
      {note.pinned && (
        <span className={styles.pinned} title="Shown on the Overview">
          <Pin size={10} /> Overview
        </span>
      )}
    </div>
  );
};
