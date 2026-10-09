# Node Description Batch 42 of 86

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

- "models_ibid_iexchangeratesnapshot": "IExchangeRateSnapshot" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L34 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ifeelink": "IFeeLink" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L403 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ihoursitem": "IHoursItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L488 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ihourssection": "IHoursSection" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L526 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ihourssectiongroup": "IHoursSectionGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L513 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ilogisticsitem": "ILogisticsItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L247 | neighbors=[IBid.ts, index.ts]
- "models_ibid_imobilizationitem": "IMobilizationItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L326 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iopportunityinfo": "IOpportunityInfo" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L12 | neighbors=[IBid.ts, index.ts]
- "models_ibid_ipcfitem": "IPCFItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L409 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iphasehistoryentry": "IPhaseHistoryEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L46 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iquicknote": "IQuickNote" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L743 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iresourceallocation": "IResourceAllocation" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L590 | neighbors=[IBid.ts, index.ts]
- "models_ibid_irevisionchange": "IRevisionChange" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L800 | neighbors=[IBid.ts, index.ts]
- "models_ibid_irtsitem": "IRTSItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L302 | neighbors=[IBid.ts, index.ts]
- "models_ibid_iscopesubitem": "IScopeSubItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L156 | neighbors=[IBid.ts, index.ts]
- "models_ibid_isectorapprovalduration": "ISectorApprovalDuration" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L680 | neighbors=[IBid.ts, index.ts]
- "models_ibid_istatushistoryentry": "IStatusHistoryEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L56 | neighbors=[IBid.ts, index.ts]
- "models_ibid_isubitemcost": "ISubItemCost" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L359 | neighbors=[IBid.ts, index.ts]
- "models_ibid_mobilizationcosttype": "MobilizationCostType" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L320 | neighbors=[IBid.ts, index.ts]
- "models_ibid_rtscosttype": "RTSCostType" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L295 | neighbors=[IBid.ts, index.ts]
- "models_ibidapproval_iapprovalchainstep": "IApprovalChainStep" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidApproval.ts:L15 | neighbors=[IBidApproval.ts, index.ts]
- "models_ibidcomment_ibidcommentdef": "IBidCommentDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidComment.ts:L7 | neighbors=[IBidComment.ts, index.ts]
- "models_ibidcost_ibidcostbreakdown": "IBidCostBreakdown" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidCost.ts:L4 | neighbors=[IBidCost.ts, index.ts]
- "models_ibidcost_ibidcostreport": "IBidCostReport" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidCost.ts:L27 | neighbors=[IBidCost.ts, index.ts]
- "models_ibidcost_idivisioncostbreakdown": "IDivisionCostBreakdown" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidCost.ts:L19 | neighbors=[IBidCost.ts, index.ts]
- "models_ibidequipment_ibidequipmentitem": "IBidEquipmentItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidEquipment.ts:L4 | neighbors=[IBidEquipment.ts, index.ts]
- "models_ibidequipment_iequipmentsummary": "IEquipmentSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidEquipment.ts:L35 | neighbors=[IBidEquipment.ts, index.ts]
- "models_ibidexport_bidexcelsheetkey": "BidExcelSheetKey" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidExport.ts:L38 | neighbors=[IBidExport.ts, index.ts]
- "models_ibidexport_ibidexcelexportoptions": "IBidExcelExportOptions" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidExport.ts:L49 | neighbors=[IBidExport.ts, index.ts]
- "models_ibidexport_iexportcolumn": "IExportColumn" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidExport.ts:L10 | neighbors=[IBidExport.ts, index.ts]
- "models_ibidexport_iexporttab": "IExportTab" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidExport.ts:L4 | neighbors=[IBidExport.ts, index.ts]
- "models_ibidhours_ibidhoursitem": "IBidHoursItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidHours.ts:L4 | neighbors=[IBidHours.ts, index.ts]
- "models_ibidhours_ibidhourssection": "IBidHoursSection" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidHours.ts:L20 | neighbors=[IBidHours.ts, index.ts]
- "models_ibidhours_ibidhourssummary": "IBidHoursSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidHours.ts:L27 | neighbors=[IBidHours.ts, index.ts]
- "models_ibidnotes_bidnotesection": "BidNoteSection" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidNotes.ts:L15 | neighbors=[IBidNotes.ts, index.ts]
- "models_ibidnotes_ibidnote": "IBidNote" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidNotes.ts:L4 | neighbors=[IBidNotes.ts, index.ts]
- "models_ibidnotes_ibidnotesmap": "IBidNotesMap" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidNotes.ts:L24 | neighbors=[IBidNotes.ts, index.ts]
- "models_ibidopportunityinfo_ibidopportunityinfo": "IBidOpportunityInfo" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidOpportunityInfo.ts:L4 | neighbors=[IBidOpportunityInfo.ts, index.ts]
- "models_ibidrequest_irequestattachment": "IRequestAttachment" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidRequest.ts:L8 | neighbors=[IBidRequest.ts, index.ts]
- "models_ibidrequest_irequestphase": "IRequestPhase" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidRequest.ts:L17 | neighbors=[IBidRequest.ts, index.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-041.json

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
