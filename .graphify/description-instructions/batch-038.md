# Node Description Batch 39 of 102

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

- "utils_accesscontrol_resolvepagelevel": "resolvePageLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L66 | neighbors=[accessControl.ts, getEffectivePageLevel(), roleLevels()]
- "utils_accesscontrol_rolelevels": "roleLevels()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L44 | neighbors=[accessControl.ts, resolveAreaLevel(), resolvePageLevel()]
- "utils_aiclarificationmapper_mapsuggestedclarification": "mapSuggestedClarification()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiClarificationMapper.ts:L10 | neighbors=[QualificationsTab.tsx, BidDetailPage.tsx, aiClarificationMapper.ts]
- "utils_aiquotationmapper_resolvequotationgroup": "resolveQuotationGroup()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiQuotationMapper.ts:L46 | neighbors=[aiQuotationMapper.ts, mapExtractedQuotationLine(), normalizeName()]
- "utils_analyticshelpers_approvalimpacttrend": "approvalImpactTrend()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L354 | neighbors=[ApprovalDueImpactSection.tsx, analyticsHelpers.ts, buildPeriodSequence()]
- "utils_analyticshelpers_divisionload": "divisionLoad()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L555 | neighbors=[AnalyticsPage.tsx, BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_erntrend": "ernTrend()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L218 | neighbors=[PerformanceTrendsPage.tsx, analyticsHelpers.ts, buildPeriodSequence()]
- "utils_analyticshelpers_otdtrend": "otdTrend()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L315 | neighbors=[PerformanceTrendsPage.tsx, analyticsHelpers.ts, buildPeriodSequence()]
- "utils_analyticshelpers_perioddelta": "periodDelta()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L667 | neighbors=[AnalyticsPage.tsx, PerformanceTrendsPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_periodkey": "periodKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L98 | neighbors=[analyticsHelpers.ts, buildPeriodSequence(), isoWeek()]
- "utils_approvalhelpers_approvedsectordurations": "approvedSectorDurations()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L268 | neighbors=[approvalHelpers.ts, computeRoundSectorDurations(), getApprovalDueImpact()]
- "utils_approvalhelpers_avgapprovaldaysbysector": "avgApprovalDaysBySector()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L162 | neighbors=[BottleneckAnalysisPage.tsx, approvalHelpers.ts, OperationalSummaryPage.tsx]
- "utils_approvalhelpers_buildcancelledroundspatch": "buildCancelledRoundsPatch()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L479 | neighbors=[ApprovalTab.tsx, approvalHelpers.ts, getCancellableRounds()]
- "utils_approvalhelpers_computebidsectordurations": "computeBidSectorDurations()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L108 | neighbors=[BidDetailsReportPage.tsx, approvalHelpers.ts, computeApprovalCycleTime()]
- "utils_approvalhelpers_getactiveapprovaloverride": "getActiveApprovalOverride()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L431 | neighbors=[ApprovalTab.tsx, OverviewTab.tsx, approvalHelpers.ts]
- "utils_approvalhelpers_getcancellablerounds": "getCancellableRounds()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L439 | neighbors=[ApprovalTab.tsx, approvalHelpers.ts, buildCancelledRoundsPatch()]
- "utils_approvalhelpers_getfinalapprovedrounds": "getFinalApprovedRounds()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L217 | neighbors=[approvalHelpers.ts, finalTrackRounds(), getFinalApprovedRound()]
- "utils_approvalhelpers_summarizeapprovaldueimpact": "summarizeApprovalDueImpact()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L391 | neighbors=[OperationalSummaryPage.tsx, ApprovalDueImpactSection.tsx, approvalHelpers.ts]
- "utils_approvalhelpers_totime": "toTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L47 | neighbors=[approvalHelpers.ts, computeRoundSectorDurations(), getApprovalDueImpact()]
- "utils_approvaltracks_getcurrentcyclerounds": "getCurrentCycleRounds()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L190 | neighbors=[approvalTracks.ts, canChangeSecondaryApproval(), needsNewApprovalRound()]
- "utils_approvaltracks_issplitapproval": "isSplitApproval()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L56 | neighbors=[approvalHelpers.ts, approvalTracks.ts, getApprovalTracks()]
- "utils_approvaltracks_projectmanagersfortrack": "projectManagersForTrack()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L292 | neighbors=[ApprovalTab.tsx, approvalTracks.ts, getPrimaryTrack()]
- "utils_approvaltracks_supersededbefore": "supersededBefore()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L88 | neighbors=[approvalTracks.ts, getTrackRounds(), toTime()]
- "utils_bidcomparator_imatchedline": "IMatchedLine" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L34 | neighbors=[ComparisonExecutive.tsx, ComparisonTables.tsx, bidComparator.ts]
- "utils_bidcomparator_priceimpactusd": "priceImpactUSD()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L326 | neighbors=[ComparisonExecutive.tsx, ComparisonTables.tsx, bidComparator.ts]
- "utils_bidconfidentiality_normalizeemail": "normalizeEmail()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L14 | neighbors=[bidConfidentiality.ts, hasEmail(), isSamePerson()]
- "utils_bidhelpers_getduedateat": "getDueDateAt()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L35 | neighbors=[approvalHelpers.ts, bidHelpers.ts, kpiHelpers.ts]
- "utils_bidpresentation_getbidcontingency": "getBidContingency()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L77 | neighbors=[bidPresentation.ts, buildPresentationItems(), priceHistory.ts]
- "utils_bidpresentation_ihistoryindex": "IHistoryIndex" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L326 | neighbors=[ItemHistoryTab.tsx, bidPresentation.ts, priceHistory.ts]
- "utils_bidpresentation_ipresentationitem": "IPresentationItem" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L82 | neighbors=[ItemHistoryTab.tsx, bidPresentation.ts, priceHistory.ts]
- "utils_bidpresentation_median": "median()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L31 | neighbors=[bidComparator.ts, bidPresentation.ts, priceHistory.ts]
- "utils_bomcosthelpers_getcoveredids": "getCoveredIds()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L198 | neighbors=[bomCostHelpers.ts, computeSmartTotal(), getBomCoverage()]
- "utils_bomcosthelpers_getmaxleadtimeitem": "getMaxLeadTimeItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L281 | neighbors=[BomCostsPage.tsx, bomCostHelpers.ts, bomExcelExport.ts]
- "utils_bomexcelexport_exportbomcoststoexcel": "exportBomCostsToExcel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomExcelExport.ts:L77 | neighbors=[BomCostsPage.tsx, bomExcelExport.ts, getBomExcelFilename()]
- "utils_bomparser_assignparentids": "assignParentIds()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L79 | neighbors=[bomParser.ts, parseBomCSV(), parseBomExcel()]
- "utils_bomparser_cleancsvvalue": "cleanCsvValue()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L23 | neighbors=[bomParser.ts, parseBomCSV(), parseBomExcel()]
- "utils_bomparser_findcolumns": "findColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L47 | neighbors=[bomParser.ts, parseBomCSV(), parseBomExcel()]
- "utils_businessdays_calculatepriority": "calculatePriority()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/businessDays.ts:L29 | neighbors=[CreateRequestPage.tsx, businessDays.ts, countBusinessDays()]
- "utils_businessdays_gettodayiso": "getTodayISO()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/businessDays.ts:L49 | neighbors=[CreateRequestPage.tsx, businessDays.ts, isToday()]
- "utils_businessdays_istoday": "isToday()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/businessDays.ts:L62 | neighbors=[CreateRequestPage.tsx, businessDays.ts, getTodayISO()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-038.json

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
