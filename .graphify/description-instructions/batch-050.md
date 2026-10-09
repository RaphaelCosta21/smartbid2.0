# Node Description Batch 51 of 86

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

- "utils_bidhelpers_getlastduedatechange": "getLastDueDateChange()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L24 | neighbors=[bidHelpers.ts, getDueFreezeDate()]
- "utils_bomparser_parsecsvrows": "parseCSVRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L47 | neighbors=[bomParser.ts, parseBomCSV()]
- "utils_bomparser_uid": "uid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L10 | neighbors=[bomParser.ts, emptyItem()]
- "utils_clarificationchatintent_asksaboutclarifications": "asksAboutClarifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationChatIntent.ts:L12 | neighbors=[useChatStore.ts, clarificationChatIntent.ts]
- "utils_clarificationexcelexport_getclarificationexcelfilename": "getClarificationExcelFilename()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationExcelExport.ts:L39 | neighbors=[clarificationExcelExport.ts, exportClarificationsToExcel()]
- "utils_clarificationhelpers_buildlibraryrowsfrombid": "buildLibraryRowsFromBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L93 | neighbors=[useClarificationLibrarySync.ts, clarificationHelpers.ts]
- "utils_clarificationlibrarydocument_buildclarificationlibrarydocument": "buildClarificationLibraryDocument()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationLibraryDocument.ts:L103 | neighbors=[ClarificationKnowledgeService.ts, clarificationLibraryDocument.ts]
- "utils_clarificationlibrarydocument_buildclarificationlibrarymetadata": "buildClarificationLibraryMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationLibraryDocument.ts:L179 | neighbors=[ClarificationKnowledgeService.ts, clarificationLibraryDocument.ts]
- "utils_clarificationlibrarydocument_buildqualificationlibrarydocument": "buildQualificationLibraryDocument()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationLibraryDocument.ts:L153 | neighbors=[ClarificationKnowledgeService.ts, clarificationLibraryDocument.ts]
- "utils_clarificationlibrarydocument_clarification_library_files": "CLARIFICATION_LIBRARY_FILES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationLibraryDocument.ts:L24 | neighbors=[ClarificationKnowledgeService.ts, clarificationLibraryDocument.ts]
- "utils_costcalculations_accumulatenode": "accumulateNode()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L226 | neighbors=[costCalculations.ts, getAssetCostBreakdown()]
- "utils_costcalculations_applycontingencysplit": "applyContingencySplit()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L39 | neighbors=[costCalculations.ts, applyContingencyToCost()]
- "utils_costcalculations_calculateassetstotals": "calculateAssetsTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L535 | neighbors=[costCalculations.ts, buildCostSummary()]
- "utils_costcalculations_costcategory": "CostCategory" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L28 | neighbors=[rows.ts, costCalculations.ts]
- "utils_costcalculations_feelinkkey": "feeLinkKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L168 | neighbors=[AssetsBreakdownTab.tsx, costCalculations.ts]
- "utils_costcalculations_getassetmaincostadj": "getAssetMainCostAdj()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L269 | neighbors=[costCalculations.ts, applyContingencyToCost()]
- "utils_costcalculations_getsplitcost": "getSplitCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L267 | neighbors=[costCalculations.ts, getSplitNode()]
- "utils_costcalculations_getsubcostamount": "getSubCostAmount()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L143 | neighbors=[AssetsBreakdownTab.tsx, costCalculations.ts]
- "utils_costcalculations_getsubitemcosttotal": "getSubItemCostTotal()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L320 | neighbors=[costCalculations.ts, getSubItemNode()]
- "utils_costcalculations_getsubitemcosttotaladj": "getSubItemCostTotalAdj()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L311 | neighbors=[costCalculations.ts, applyContingencyToCost()]
- "utils_costcalculations_iassetcostbreakdown": "IAssetCostBreakdown" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L43 | neighbors=[AssetsBreakdownTab.tsx, costCalculations.ts]
- "utils_costcalculations_iassetresourcetypecost": "IAssetResourceTypeCost" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L16 | neighbors=[costCalculations.ts, costSummaryView.ts]
- "utils_costcalculations_iassetscostcompleteness": "IAssetsCostCompleteness" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L440 | neighbors=[BidStatusPhasePanel.tsx, costCalculations.ts]
- "utils_costcalculations_imulticurrencyitem": "IMultiCurrencyItem" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L662 | neighbors=[costCalculations.ts, costSummaryView.ts]
- "utils_costcalculations_isnocostentry": "isNoCostEntry()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L452 | neighbors=[costCalculations.ts, isNoCostAvailability()]
- "utils_costcalculations_pruneorphancosts": "pruneOrphanCosts()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L801 | neighbors=[costCalculations.ts, withCostSummary()]
- "utils_costcalculations_resolvechildqty": "resolveChildQty()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L276 | neighbors=[costCalculations.ts, getSubItemNode()]
- "utils_costsummaryview_hoursbydivision": "hoursByDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costSummaryView.ts:L76 | neighbors=[costSummaryView.ts, sumBy()]
- "utils_costsummaryview_icostsegment": "ICostSegment" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costSummaryView.ts:L24 | neighbors=[BidCostSummary.tsx, costSummaryView.ts]
- "utils_costsummaryview_icostsummaryview": "ICostSummaryView" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costSummaryView.ts:L38 | neighbors=[context.ts, costSummaryView.ts]
- "utils_domvisibility_ivisiblerect": "IVisibleRect" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/domVisibility.ts:L1 | neighbors=[GuidedTour.tsx, domVisibility.ts]
- "utils_durationhelpers_formatdurationfromhours": "formatDurationFromHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/durationHelpers.ts:L30 | neighbors=[BidTimeline.tsx, durationHelpers.ts]
- "utils_durationhelpers_formatdurationhours": "formatDurationHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/durationHelpers.ts:L11 | neighbors=[BidStatusPhasePanel.tsx, durationHelpers.ts]
- "utils_durationhelpers_formatliveelapsed": "formatLiveElapsed()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/durationHelpers.ts:L50 | neighbors=[BidTimeline.tsx, durationHelpers.ts]
- "utils_enghourshelpers_buildenghoursitems": "buildEngHoursItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/engHoursHelpers.ts:L47 | neighbors=[EngHoursOutlook.tsx, engHoursHelpers.ts]
- "utils_enghourshelpers_buildenghourstimeline": "buildEngHoursTimeline()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/engHoursHelpers.ts:L80 | neighbors=[EngHoursOutlook.tsx, engHoursHelpers.ts]
- "utils_enghourshelpers_enghourstimelinemode": "EngHoursTimelineMode" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/engHoursHelpers.ts:L21 | neighbors=[EngHoursOutlook.tsx, engHoursHelpers.ts]
- "utils_enghourshelpers_ienghoursitem": "IEngHoursItem" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/engHoursHelpers.ts:L25 | neighbors=[EngHoursRanking.tsx, engHoursHelpers.ts]
- "utils_ernhelpers_compareernurgency": "compareErnUrgency()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L269 | neighbors=[useLiveOverview.ts, ernHelpers.ts]
- "utils_ernhelpers_ern_revision_reasons": "ERN_REVISION_REASONS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L15 | neighbors=[ErnCreateModal.tsx, ernHelpers.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-050.json

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
