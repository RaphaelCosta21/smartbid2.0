import * as React from "react";
import { GlassCard } from "../common/GlassCard";
import { AIDocumentAnalyzer } from "../common/AIDocumentAnalyzer";
import { IBid, IScopeItem, IAIImportMeta } from "../../models";
import { buildAiContext } from "../../utils/aiContext";

interface AITabProps {
  bid: IBid;
  onImportItems: (items: IScopeItem[], meta: IAIImportMeta) => void;
}

export const AITab: React.FC<AITabProps> = ({ bid, onImportItems }) => {
  const handleImport = React.useCallback(
    (items: IScopeItem[], meta: IAIImportMeta) => {
      onImportItems(items, meta);
    },
    [onImportItems],
  );

  return (
    <GlassCard title="AI Document Analysis">
      <AIDocumentAnalyzer
        bidNumber={bid.bidNumber}
        division={bid.division}
        serviceLine={bid.serviceLine}
        contextSummary={buildAiContext(bid).contextSummary}
        onImport={handleImport}
        importLabel="Import to Scope of Supply"
      />
    </GlassCard>
  );
};
