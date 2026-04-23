import * as React from "react";
import { GlassCard } from "../common/GlassCard";
import { AIDocumentAnalyzer } from "../common/AIDocumentAnalyzer";
import { IBid, IScopeItem } from "../../models";

interface AITabProps {
  bid: IBid;
  onImportItems: (items: IScopeItem[], sourceDocument: string) => void;
}

export const AITab: React.FC<AITabProps> = ({ bid, onImportItems }) => {
  const handleImport = React.useCallback(
    (items: IScopeItem[]) => {
      // Extract source document name from the first item's importedFromTemplate or fallback
      const sourceDoc = "AI Analysis";
      onImportItems(items, sourceDoc);
    },
    [onImportItems],
  );

  return (
    <GlassCard title="AI Document Analysis">
      <AIDocumentAnalyzer
        division={bid.division}
        serviceLine={bid.serviceLine}
        onImport={handleImport}
        importLabel="Import to Scope of Supply"
      />
    </GlassCard>
  );
};
