import * as React from "react";
import { DocLibraryCatalog } from "../components/knowledge/DocLibraryCatalog";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { canAccessKnowledge } from "../utils/accessControl";

const FOLDER = `${SHAREPOINT_CONFIG.docLibrary.serverRelativeUrl}/${SHAREPOINT_CONFIG.docLibrary.folders.datasheets}`;

export const DatasheetsPage: React.FC = () => {
  const currentUser = useCurrentUser();
  const canManage = canAccessKnowledge(currentUser);

  return (
    <DocLibraryCatalog
      title="Datasheets"
      folderServerRelativeUrl={FOLDER}
      docTypeOptions={["Datasheet"]}
      defaultDocType="Datasheet"
      canManage={canManage}
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
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      }
    />
  );
};
