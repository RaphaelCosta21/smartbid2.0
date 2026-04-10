import * as React from "react";
import styles from "./PatchNotes.module.scss";

interface PatchNote {
  version: string;
  date: string;
  changes: string[];
}

export const PatchNotes: React.FC = () => {
  const notes: PatchNote[] = [
    {
      version: "2.0.0",
      date: "2026-04-07",
      changes: [
        "Initial release of SMART BID 2.0",
        "Full BID lifecycle management",
        "Multi-chain approval system",
        "Equipment templates library",
        "Dashboard with KPIs",
        "Export to Excel/PDF",
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Patch Notes</h3>
      {notes.map((note) => (
        <div key={note.version} className={styles.noteCard}>
          <div className={styles.noteHeader}>
            <span className={styles.noteVersion}>v{note.version}</span>
            <span className={styles.noteDate}>{note.date}</span>
          </div>
          <ul className={styles.noteList}>
            {note.changes.map((change, i) => (
              <li key={i} className={styles.noteItem}>
                {change}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
