import * as React from "react";

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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Patch Notes</h3>
      {notes.map((note) => (
        <div
          key={note.version}
          style={{
            padding: 20,
            borderRadius: 12,
            border: "1px solid var(--border-subtle)",
            background: "var(--card-bg)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700 }}>
              v{note.version}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {note.date}
            </span>
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {note.changes.map((change, i) => (
              <li
                key={i}
                style={{ fontSize: 14, color: "var(--text-secondary)" }}
              >
                {change}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
