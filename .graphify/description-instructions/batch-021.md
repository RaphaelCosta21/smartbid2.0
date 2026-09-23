# Node Description Batch 22 of 43

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

- "models_ibid_iscopesubitem": "IScopeSubItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L151 | neighbors=[IBid.ts, index.ts]
- "models_ibid_isectorapprovalduration": "ISectorApprovalDuration" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L635 | neighbors=[IBid.ts, index.ts]
- "models_ibid_istatushistoryentry": "IStatusHistoryEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L51 | neighbors=[IBid.ts, index.ts]
- "models_ibid_isubitemcost": "ISubItemCost" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L350 | neighbors=[IBid.ts, index.ts]
- "models_ibid_mobilizationcosttype": "MobilizationCostType" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L311 | neighbors=[IBid.ts, index.ts]
- "models_ibid_rtscosttype": "RTSCostType" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L286 | neighbors=[IBid.ts, index.ts]
- "models_ibidapproval_iapprovalchainstep": "IApprovalChainStep" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidApproval.ts:L15 | neighbors=[IBidApproval.ts, index.ts]
- "models_ibidcomment_ibidcommentdef": "IBidCommentDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidComment.ts:L7 | neighbors=[IBidComment.ts, index.ts]
- "models_ibidcost_ibidcostbreakdown": "IBidCostBreakdown" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidCost.ts:L4 | neighbors=[IBidCost.ts, index.ts]
- "models_ibidcost_ibidcostreport": "IBidCostReport" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidCost.ts:L27 | neighbors=[IBidCost.ts, index.ts]
- "models_ibidcost_idivisioncostbreakdown": "IDivisionCostBreakdown" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidCost.ts:L19 | neighbors=[IBidCost.ts, index.ts]
- "models_ibidequipment_ibidequipmentitem": "IBidEquipmentItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidEquipment.ts:L4 | neighbors=[IBidEquipment.ts, index.ts]
- "models_ibidequipment_iequipmentsummary": "IEquipmentSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidEquipment.ts:L35 | neighbors=[IBidEquipment.ts, index.ts]
- "models_ibidexport_iexportcolumn": "IExportColumn" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidExport.ts:L10 | neighbors=[IBidExport.ts, index.ts]
- "models_ibidexport_iexporttab": "IExportTab" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidExport.ts:L4 | neighbors=[IBidExport.ts, index.ts]
- "models_ibidhours_ibidhoursitem": "IBidHoursItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidHours.ts:L4 | neighbors=[IBidHours.ts, index.ts]
- "models_ibidhours_ibidhourssection": "IBidHoursSection" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidHours.ts:L20 | neighbors=[IBidHours.ts, index.ts]
- "models_ibidhours_ibidhourssummary": "IBidHoursSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidHours.ts:L27 | neighbors=[IBidHours.ts, index.ts]
- "models_ibidnotes_bidnotesection": "BidNoteSection" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidNotes.ts:L15 | neighbors=[IBidNotes.ts, index.ts]
- "models_ibidnotes_ibidnote": "IBidNote" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidNotes.ts:L4 | neighbors=[IBidNotes.ts, index.ts]
- "models_ibidnotes_ibidnotesmap": "IBidNotesMap" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidNotes.ts:L24 | neighbors=[IBidNotes.ts, index.ts]
- "models_ibidopportunityinfo_ibidopportunityinfo": "IBidOpportunityInfo" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidOpportunityInfo.ts:L4 | neighbors=[IBidOpportunityInfo.ts, index.ts]
- "models_ibidrequest_irequestattachment": "IRequestAttachment" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidRequest.ts:L7 | neighbors=[IBidRequest.ts, index.ts]
- "models_ibidrequest_irequestphase": "IRequestPhase" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidRequest.ts:L16 | neighbors=[IBidRequest.ts, index.ts]
- "models_ibidresult_ibidresultdef": "IBidResultDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidResult.ts:L6 | neighbors=[IBidResult.ts, index.ts]
- "models_ibidstatus_bidstatusid": "BidStatusId" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L10 | neighbors=[IBidStatus.ts, index.ts]
- "models_ibidstatus_substatusid": "SubStatusId" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L53 | neighbors=[IBidStatus.ts, index.ts]
- "models_ibidtask_ibidtaskdef": "IBidTaskDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidTask.ts:L6 | neighbors=[IBidTask.ts, index.ts]
- "models_ibidtask_taskstatustype": "TaskStatusType" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidTask.ts:L23 | neighbors=[IBidTask.ts, index.ts]
- "models_ibomcostanalysis_bomcostsource": "BomCostSource" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBomCostAnalysis.ts:L8 | neighbors=[IBomCostAnalysis.ts, index.ts]
- "models_ibomcostanalysis_ibomcostanalysis": "IBomCostAnalysis" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBomCostAnalysis.ts:L63 | neighbors=[IBomCostAnalysis.ts, index.ts]
- "models_ibomcostanalysis_ibomcostitem": "IBomCostItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBomCostAnalysis.ts:L17 | neighbors=[IBomCostAnalysis.ts, index.ts]
- "models_ieditlock_ieditlock": "IEditLock" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IEditLock.ts:L5 | neighbors=[IEditLock.ts, index.ts]
- "models_iern_erndeadlinestate": "ErnDeadlineState" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IErn.ts:L81 | neighbors=[IErn.ts, index.ts]
- "models_iern_iern": "IErn" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IErn.ts:L8 | neighbors=[IErn.ts, index.ts]
- "models_iern_ierncreatedata": "IErnCreateData" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IErn.ts:L30 | neighbors=[IErn.ts, index.ts]
- "models_iern_ierncreateresult": "IErnCreateResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IErn.ts:L73 | neighbors=[IErn.ts, index.ts]
- "models_ifavoriteitem_favoritedatasource": "FavoriteDataSource" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IFavoriteItem.ts:L21 | neighbors=[IFavoriteItem.ts, index.ts]
- "models_ifavoriteitem_ifavoritebid": "IFavoriteBid" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IFavoriteItem.ts:L57 | neighbors=[IFavoriteItem.ts, index.ts]
- "models_ifavoriteitem_ifavoriteequipment": "IFavoriteEquipment" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IFavoriteItem.ts:L24 | neighbors=[IFavoriteItem.ts, index.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-021.json

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
