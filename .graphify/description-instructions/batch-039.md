# Node Description Batch 40 of 102

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

- "utils_clarificationexcelexport_exportclarificationstoexcel": "exportClarificationsToExcel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationExcelExport.ts:L52 | neighbors=[ExportClarificationModal.tsx, clarificationExcelExport.ts, getClarificationExcelFilename()]
- "utils_clarificationhelpers_categorylistfor": "categoryListFor()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L42 | neighbors=[ScopeOfSupplyTab.tsx, ClarificationEntryModal.tsx, clarificationHelpers.ts]
- "utils_clarificationhelpers_isclarificationlibraryeligible": "isClarificationLibraryEligible()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L20 | neighbors=[useClarificationLibrarySync.ts, clarificationHelpers.ts, pastBidDocument.ts]
- "utils_clarificationlibrarydocument_entry": "entry()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationLibraryDocument.ts:L64 | neighbors=[clarificationLibraryDocument.ts, safe(), topicOf()]
- "utils_clarificationlibrarydocument_qualificationentry": "qualificationEntry()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationLibraryDocument.ts:L123 | neighbors=[clarificationLibraryDocument.ts, safe(), truncateTopic()]
- "utils_clarificationlibrarydocument_truncatetopic": "truncateTopic()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationLibraryDocument.ts:L58 | neighbors=[clarificationLibraryDocument.ts, qualificationEntry(), topicOf()]
- "utils_constants_divisions": "DIVISIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L22 | neighbors=[TemplatesPage.tsx, TemplateEditor.tsx, constants.ts]
- "utils_constants_service_lines": "SERVICE_LINES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L29 | neighbors=[TemplatesPage.tsx, TemplateEditor.tsx, constants.ts]
- "utils_costcalculations_calculatecertificationstotals": "calculateCertificationsTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L478 | neighbors=[BidCostSummary.tsx, costCalculations.ts, buildCostSummary()]
- "utils_costcalculations_calculateconsumablestotals": "calculateConsumablesTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L543 | neighbors=[BidCostSummary.tsx, costCalculations.ts, buildCostSummary()]
- "utils_costcalculations_calculatelogisticstotals": "calculateLogisticsTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L454 | neighbors=[BidCostSummary.tsx, costCalculations.ts, buildCostSummary()]
- "utils_costcalculations_calculatemobilizationtotals": "calculateMobilizationTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L522 | neighbors=[BidCostSummary.tsx, costCalculations.ts, buildCostSummary()]
- "utils_costcalculations_calculatertstotals": "calculateRTSTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L501 | neighbors=[BidCostSummary.tsx, costCalculations.ts, buildCostSummary()]
- "utils_costcalculations_getsubcostamount": "getSubCostAmount()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L143 | neighbors=[AssetsBreakdownTab.tsx, costCalculations.ts, priceHistory.ts]
- "utils_costcalculations_icostnode": "ICostNode" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L31 | neighbors=[AssetsBreakdownTab.tsx, rows.ts, costCalculations.ts]
- "utils_costcalculations_resolvefeelinks": "resolveFeeLinks()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L180 | neighbors=[AssetsBreakdownTab.tsx, costCalculations.ts, getAssetCostBreakdown()]
- "utils_costsummaryview_sumby": "sumBy()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costSummaryView.ts:L71 | neighbors=[costSummaryView.ts, buildCostSummaryView(), hoursByDivision()]
- "utils_csvparser_parsecsvrows": "parseCSVRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/csvParser.ts:L11 | neighbors=[QueryCatalogService.ts, bomParser.ts, csvParser.ts]
- "utils_divisionhelpers_composeintegratedserviceline": "composeIntegratedServiceLine()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L125 | neighbors=[divisionHelpers.ts, buildDivisionFields(), otherBaseDivision()]
- "utils_divisionhelpers_divisionbusinesslines": "divisionBusinessLines()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L49 | neighbors=[CreateRequestPage.tsx, divisionHelpers.ts, ssrLines()]
- "utils_divisionhelpers_hasmultiplebusinesslines": "hasMultipleBusinessLines()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L77 | neighbors=[divisionHelpers.ts, getBidBusinessLines(), ernHelpers.ts]
- "utils_divisionhelpers_integratedlineoptions": "integratedLineOptions()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L198 | neighbors=[OverviewTab.tsx, CreateRequestPage.tsx, divisionHelpers.ts]
- "utils_divisionhelpers_retaglist": "retagList()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L219 | neighbors=[divisionHelpers.ts, retagBusinessLineItems(), retagSection()]
- "utils_divisionhelpers_retagsection": "retagSection()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L238 | neighbors=[divisionHelpers.ts, retagBusinessLineItems(), retagList()]
- "utils_divisionhelpers_ssrlines": "ssrLines()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L39 | neighbors=[divisionHelpers.ts, divisionBusinessLines(), getBidBusinessLines()]
- "utils_doccataloghelpers_findgroupbyname": "findGroupByName()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/docCatalogHelpers.ts:L10 | neighbors=[DocLibraryCatalog.tsx, TechnicalProposalKnowledgeService.ts, docCatalogHelpers.ts]
- "utils_doccataloghelpers_findsubgroupbyname": "findSubGroupByName()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/docCatalogHelpers.ts:L16 | neighbors=[DocLibraryCatalog.tsx, TechnicalProposalKnowledgeService.ts, docCatalogHelpers.ts]
- "utils_doccataloghelpers_withcategory": "withCategory()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/docCatalogHelpers.ts:L30 | neighbors=[DocLibraryCatalog.tsx, TechnicalProposalKnowledgeService.ts, docCatalogHelpers.ts]
- "utils_domvisibility_getvisiblerect": "getVisibleRect()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/domVisibility.ts:L9 | neighbors=[GuidedTour.tsx, QueryConsultingPage.tsx, domVisibility.ts]
- "utils_durationhelpers_calcelapseddays": "calcElapsedDays()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/durationHelpers.ts:L75 | neighbors=[BidStatusPhasePanel.tsx, OverviewTab.tsx, durationHelpers.ts]
- "utils_enghourshelpers_formathours": "formatHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/engHoursHelpers.ts:L144 | neighbors=[DashboardBidTable.tsx, EngHoursOutlook.tsx, engHoursHelpers.ts]
- "utils_ernhelpers_geterncountdownlabel": "getErnCountdownLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L304 | neighbors=[ErnWatchlist.tsx, LivePulsePanel.tsx, ernHelpers.ts]
- "utils_ernhelpers_getlinkederntitles": "getLinkedErnTitles()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L135 | neighbors=[OverviewTab.tsx, ernHelpers.ts, getErnLinks()]
- "utils_ernhelpers_isernassignedto": "isErnAssignedTo()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L261 | neighbors=[ErnWatchlist.tsx, LivePulsePanel.tsx, ernHelpers.ts]
- "utils_ernhelpers_isernclosed": "isErnClosed()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L172 | neighbors=[ErnSearchModal.tsx, ernHelpers.ts, getErnDeadlineState()]
- "utils_ernhelpers_isintegratedbid": "isIntegratedBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L87 | neighbors=[ernHelpers.ts, getErnSlots(), UnassignedRequestsPage.tsx]
- "utils_ernhelpers_matchesernwatchfilter": "matchesErnWatchFilter()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L293 | neighbors=[ErnWatchlist.tsx, LivePulsePanel.tsx, ernHelpers.ts]
- "utils_ernhelpers_normalizechoice": "normalizeChoice()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L51 | neighbors=[ernHelpers.ts, findErnChoice(), resolveErnServiceLineChoice()]
- "utils_ernlink_linkerntobid": "linkErnToBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernLink.ts:L26 | neighbors=[ErnCreateModal.tsx, ErnSearchModal.tsx, ernLink.ts]
- "utils_formatters_formatelapsedhours": "formatElapsedHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L137 | neighbors=[OperationalSummaryPage.tsx, ApprovalDueImpactSection.tsx, formatters.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-039.json

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
