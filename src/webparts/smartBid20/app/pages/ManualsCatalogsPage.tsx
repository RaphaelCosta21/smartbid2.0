import * as React from "react";
import { DocLibraryCatalog } from "../components/knowledge/DocLibraryCatalog";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { usePageAccess } from "../hooks/usePageAccess";

const FOLDER = `${SHAREPOINT_CONFIG.docLibrary.serverRelativeUrl}/${SHAREPOINT_CONFIG.docLibrary.folders.manualsCatalogs}`;

export const ManualsCatalogsPage: React.FC = () => {
  const { canEdit: canManage } = usePageAccess();

  return (
    <DocLibraryCatalog
      title="Manuals & Catalogs"
      folderServerRelativeUrl={FOLDER}
      docTypeOptions={["Manual", "Catalog"]}
      defaultDocType="Manual"
      canManage={canManage}
      documentNotice="Documents and OMMs available in this library may not be the latest revision. Before use, consult the Engineering system or the supplier to confirm and obtain the most up-to-date version."
      icon={
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
      }
    />
  );
};
