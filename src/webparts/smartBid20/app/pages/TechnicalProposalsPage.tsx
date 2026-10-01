import * as React from "react";
import { DocLibraryCatalog } from "../components/knowledge/DocLibraryCatalog";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { canAccessKnowledge } from "../utils/accessControl";

const FOLDER = `${SHAREPOINT_CONFIG.docLibrary.serverRelativeUrl}/${SHAREPOINT_CONFIG.docLibrary.folders.technicalProposals}`;

// The shared catalog columns are reused with proposal-oriented wording.
const FIELD_LABELS = {
  group: "Discipline / Scope",
  manufacturer: "Client",
  model: "Proposal / BID No.",
  revision: "Revision / Date",
  description: "Scope Summary",
  manufacturerShort: "Client",
  manufacturerColumn: "Client",
  modelShort: "Proposal",
  groupShort: "Discipline",
  searchPlaceholder: "Search by title, client, BID number, keyword...",
  allManufacturers: "All Clients",
};

export const TechnicalProposalsPage: React.FC = () => {
  const currentUser = useCurrentUser();
  const canManage = canAccessKnowledge(currentUser);

  return (
    <DocLibraryCatalog
      title="Technical Proposals"
      folderServerRelativeUrl={FOLDER}
      docTypeOptions={["Technical Proposal"]}
      defaultDocType="Technical Proposal"
      canManage={canManage}
      fieldLabels={FIELD_LABELS}
      lockedGroupName={SHAREPOINT_CONFIG.technicalProposal.knowledgeGroupName}
      icon={
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 17c1.5-3 3-3 4.5 0S16.5 17 18 15" />
          <line x1="8" y1="9" x2="12" y2="9" />
        </svg>
      }
    />
  );
};
