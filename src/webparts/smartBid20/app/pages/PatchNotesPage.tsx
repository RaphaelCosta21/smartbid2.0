import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { PatchNotes } from "../components/settings/PatchNotes";

export const PatchNotesPage: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader
        title="Patch Notes"
        subtitle="Version history and changelog"
        icon={
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        }
      />
      <PatchNotes />
    </div>
  );
};
