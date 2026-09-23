# Node Description Batch 21 of 43

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

- "models_iaianalysis_idocumentmetadataextractionresult": "IDocumentMetadataExtractionResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L245 | neighbors=[IAIAnalysis.ts, AIAnalysisService.ts]
- "models_iaichat_chatrole": "ChatRole" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAiChat.ts:L6 | neighbors=[IAiChat.ts, index.ts]
- "models_iapprovalflow_iapprovalflowchain": "IApprovalFlowChain" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IApprovalFlow.ts:L16 | neighbors=[IApprovalFlow.ts, index.ts]
- "models_iapprovalflow_iapprovalflowstep": "IApprovalFlowStep" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IApprovalFlow.ts:L7 | neighbors=[IApprovalFlow.ts, index.ts]
- "models_ibid_aianalysisreviewstatus": "AIAnalysisReviewStatus" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L772 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iactivitylogentry": "IActivityLogEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L699 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iassetbreakdownitem": "IAssetBreakdownItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L186 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iassetscostsummary": "IAssetsCostSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L580 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iassetsubcost": "IAssetSubCost" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L374 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iavailabilitysplit": "IAvailabilitySplit" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L165 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidaianalysis": "IBidAIAnalysis" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L779 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidcomment": "IBidComment" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L673 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidernlink": "IBidErnLink" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L896 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidkpis": "IBidKPIs" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L709 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidmetadata": "IBidMetadata" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L763 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidresult": "IBidResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L686 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidrevision": "IBidRevision" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L741 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ibidtask": "IBidTask" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L61 | neighbors=[IBid.ts, index.ts]
- "models_ibid_icertificationitem": "ICertificationItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L254 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iconsumableitem": "IConsumableItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L333 | neighbors=[IBid.ts, index.ts]
- "models_ibid_icostsummary": "ICostSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L590 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iengineeringdeliverable": "IEngineeringDeliverable" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L509 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iengineeringhoursitem": "IEngineeringHoursItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L522 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iengineeringhourssection": "IEngineeringHoursSection" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L562 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iequipmentitem": "IEquipmentItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L71 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iexchangeratesnapshot": "IExchangeRateSnapshot" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L34 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ihoursitem": "IHoursItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L445 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ihourssection": "IHoursSection" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L483 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ihourssectiongroup": "IHoursSectionGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L470 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ilogisticsitem": "ILogisticsItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L238 | neighbors=[IBid.ts, index.ts]
- "models_ibid_imobilizationitem": "IMobilizationItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L317 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iopportunityinfo": "IOpportunityInfo" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L12 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ipcfitem": "IPCFItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L389 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iphasehistoryentry": "IPhaseHistoryEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L41 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iqualificationitem": "IQualificationItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L420 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iqualificationtable": "IQualificationTable" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L414 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iquicknote": "IQuickNote" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L666 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iresourceallocation": "IResourceAllocation" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L547 | neighbors=[IBid.ts, index.ts]
- "models_ibid_irevisionchange": "IRevisionChange" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L721 | neighbors=[IBid.ts, index.ts]
- "models_ibid_irtsitem": "IRTSItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L293 | neighbors=[IBid.ts, index.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-020.json

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
