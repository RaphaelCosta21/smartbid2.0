# Node Description Batch 49 of 102

Graphify is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the prompt below and write
your JSON answer to the answer file.

## Prompt

You are documenting nodes in a knowledge graph.
For each entry below, write ONE concise factual plain-language sentence
describing what it is or does. Use only the provided context.
For a code symbol (kind=code-symbol — a function, class, or constant),
describe what the function/symbol does based on its name, source location
and neighbors — e.g. "Resolves the configured ontology profile from graphify.yaml.".
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "layout_livepulsepanel_usecountup": "useCountUp()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L85 | neighbors=[LivePulsePanel.tsx, Tile()]
- "layout_sidebar_sidebar": "Sidebar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L576 | neighbors=[AppLayout.tsx, Sidebar.tsx]
- "layout_sidebaritem_sidebaritem": "SidebarItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarItem.tsx:L18 | neighbors=[Sidebar.tsx, SidebarItem.tsx]
- "layout_sidebarsubmenu_sidebarsubmenu": "SidebarSubmenu()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarSubmenu.tsx:L13 | neighbors=[Sidebar.tsx, SidebarSubmenu.tsx]
- "models_iaccesslog_accesslogarea": "AccessLogArea" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAccessLog.ts:L1 | neighbors=[IAccessLog.ts, index.ts]
- "models_iaccesslog_iaccesslogentry": "IAccessLogEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAccessLog.ts:L3 | neighbors=[IAccessLog.ts, index.ts]
- "models_iactivitylog_iactivitylog": "IActivityLog" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IActivityLog.ts:L15 | neighbors=[IActivityLog.ts, index.ts]
- "models_iaianalysis_iaianalysiserror": "IAIAnalysisError" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L154 | neighbors=[IAIAnalysis.ts, index.ts]
- "models_iaianalysis_iaiassetsubitemoption": "IAIAssetSubItemOption" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L66 | neighbors=[AIDocumentAnalyzer.tsx, IAIAnalysis.ts]
- "models_iaianalysis_iairesourcetypeoption": "IAIResourceTypeOption" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L20 | neighbors=[ai.prompts.ts, IAIAnalysis.ts]
- "models_iaianalysis_idocumentmetadataextractionresult": "IDocumentMetadataExtractionResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L294 | neighbors=[IAIAnalysis.ts, AIAnalysisService.ts]
- "models_iaichat_chatrole": "ChatRole" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAiChat.ts:L6 | neighbors=[IAiChat.ts, index.ts]
- "models_iapprovalflow_iapprovalflowchain": "IApprovalFlowChain" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IApprovalFlow.ts:L16 | neighbors=[IApprovalFlow.ts, index.ts]
- "models_iapprovalflow_iapprovalflowstep": "IApprovalFlowStep" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IApprovalFlow.ts:L7 | neighbors=[IApprovalFlow.ts, index.ts]
- "models_ibid_aianalysisreviewstatus": "AIAnalysisReviewStatus" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L880 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iapprovaloverrideparticipant": "IApprovalOverrideParticipant" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L694 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iapprovalsectorwaiver": "IApprovalSectorWaiver" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L724 | neighbors=[ApprovalTab.tsx, IBid.ts]
- "models_ibid_iassetbreakdownitem": "IAssetBreakdownItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L193 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iassetscostsummary": "IAssetsCostSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L627 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iassetsubcost": "IAssetSubCost" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L391 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iavailabilitysplit": "IAvailabilitySplit" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L172 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidaianalysis": "IBidAIAnalysis" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L887 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidcomment": "IBidComment" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L779 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidconfidentiality": "IBidConfidentiality" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L940 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidernlink": "IBidErnLink" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L1072 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidknowledgedoc": "IBidKnowledgeDoc" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L907 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidknowledgeprofile": "IBidKnowledgeProfile" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L917 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidkpis": "IBidKPIs" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L817 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidmetadata": "IBidMetadata" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L871 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidresult": "IBidResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L792 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidrevision": "IBidRevision" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L849 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidtask": "IBidTask" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L68 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidtechnicalproposal": "IBidTechnicalProposal" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L930 | neighbors=[IBid.ts, index.ts]
- "models_ibid_icertificationitem": "ICertificationItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L267 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iclarificationlibrarysync": "IClarificationLibrarySync" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L485 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iconsumableitem": "IConsumableItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L346 | neighbors=[IBid.ts, index.ts]
- "models_ibid_icostsummary": "ICostSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L637 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iengineeringdeliverable": "IEngineeringDeliverable" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L556 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iengineeringhoursitem": "IEngineeringHoursItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L569 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iengineeringhourssection": "IEngineeringHoursSection" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L609 | neighbors=[IBid.ts, index.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-048.json

Keep each description factual and concise (one sentence). No markdown, no prose
outside the JSON object. It is acceptable to omit a node if context is
insufficient — but include every node you can ground confidently.

Example answer format:
```json
{
  "node_id_1": "Resolves the configured ontology profile from graphify.yaml.",
  "node_id_2": "Colonel James Barclay, an antagonist in The Crooked Man."
}
```
