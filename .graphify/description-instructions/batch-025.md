# Node Description Batch 26 of 86

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

- "utils_approvalhelpers_computeroundsectordurations": "computeRoundSectorDurations()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L51 | neighbors=[ApprovalTab.tsx, approvalHelpers.ts, approvedSectorDurations(), toTime()]
- "utils_approvalhelpers_getapprovaldueimpact": "getApprovalDueImpact()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L285 | neighbors=[approvalHelpers.ts, approvedSectorDurations(), getFinalApprovedRound(), toTime()]
- "utils_approvalhelpers_getmissingapprovalactivityentries": "getMissingApprovalActivityEntries()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L418 | neighbors=[ApprovalTab.tsx, BidDetailPage.tsx, approvalHelpers.ts, completionEntry()]
- "utils_bidconfidentiality_canmanagebidconfidentiality": "canManageBidConfidentiality()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L72 | neighbors=[BidConfidentialButton.tsx, bidConfidentiality.ts, getConfidentialManagers(), hasEmail()]
- "utils_bidconfidentiality_getconfidentialallowedpeople": "getConfidentialAllowedPeople()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L76 | neighbors=[bidConfidentiality.ts, canOpenBid(), getConfidentialManagers(), uniquePeople()]
- "utils_bidconfidentiality_hasemail": "hasEmail()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L17 | neighbors=[bidConfidentiality.ts, canManageBidConfidentiality(), canOpenBid(), normalizeEmail()]
- "utils_bidconfidentiality_uniquepeople": "uniquePeople()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L24 | neighbors=[ConfidentialAccessModal.tsx, bidConfidentiality.ts, getConfidentialAllowedPeople(), getConfidentialManagers()]
- "utils_bidhelpers_isunassignedbid": "isUnassignedBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L16 | neighbors=[Sidebar.tsx, BidTrackerPage.tsx, RequestService.ts, bidHelpers.ts]
- "utils_businessdays_countbusinessdays": "countBusinessDays()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/businessDays.ts:L10 | neighbors=[CreateRequestPage.tsx, businessDays.ts, calculatePriority(), kpiHelpers.ts]
- "utils_clarificationlibrarydocument_safe": "safe()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationLibraryDocument.ts:L44 | neighbors=[clarificationLibraryDocument.ts, entry(), qualificationEntry(), topicOf()]
- "utils_clarificationlibrarydocument_topicof": "topicOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationLibraryDocument.ts:L48 | neighbors=[clarificationLibraryDocument.ts, entry(), safe(), truncateTopic()]
- "utils_constants_division_colors": "DIVISION_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L1 | neighbors=[MyDashboardPage.tsx, ToolingReportPage.tsx, constants.ts, TimelinePage.tsx]
- "utils_costcalculations_calculateassetsbyresourcetype": "calculateAssetsByResourceType()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L576 | neighbors=[OverviewTab.tsx, costCalculations.ts, costSummaryView.ts, BidCostSummary.tsx]
- "utils_costcalculations_getagecontingencypct": "getAgeContingencyPct()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L115 | neighbors=[AssetsBreakdownTab.tsx, rows.ts, costCalculations.ts, applyContingencyToCost()]
- "utils_costcalculations_getfeestotal": "getFeesTotal()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L158 | neighbors=[costCalculations.ts, getAssetCostBreakdown(), getSplitNode(), getSubItemNode()]
- "utils_costcalculations_makenode": "makeNode()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L216 | neighbors=[costCalculations.ts, getAssetCostBreakdown(), getSplitNode(), getSubItemNode()]
- "utils_costcalculations_norm": "norm()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L97 | neighbors=[costCalculations.ts, isNoCostAvailability(), isRentalAcq(), isWorkshopAcq()]
- "utils_costcalculations_tousdwithbidrates": "toUSDWithBidRates()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L686 | neighbors=[BidFxNote.tsx, LogisticsBreakdownTab.tsx, currencyTable.ts, costCalculations.ts]
- "utils_currencyhelpers_getcurrencies": "getCurrencies()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/currencyHelpers.ts:L7 | neighbors=[CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx, PreparationMobilizationTab.tsx, currencyHelpers.ts]
- "utils_durationhelpers_calcdurationhours": "calcDurationHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/durationHelpers.ts:L67 | neighbors=[BidStatusPhasePanel.tsx, RevisionsTab.tsx, durationHelpers.ts, phaseHelpers.ts]
- "utils_ernhelpers_ernwatchfilter": "ErnWatchFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L280 | neighbors=[ErnDashboardSection.tsx, ErnWatchlist.tsx, LivePulsePanel.tsx, ernHelpers.ts]
- "utils_ernhelpers_findernchoice": "findErnChoice()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L47 | neighbors=[ErnCreateModal.tsx, ernHelpers.ts, normalizeChoice(), resolveErnServiceLineChoice()]
- "utils_ernhelpers_geternlinkforslot": "getErnLinkForSlot()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L121 | neighbors=[OverviewTab.tsx, ernHelpers.ts, getErnLinks(), ernLink.ts]
- "utils_ernhelpers_resolveernservicelinechoice": "resolveErnServiceLineChoice()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L57 | neighbors=[ErnCreateModal.tsx, ernHelpers.ts, findErnChoice(), normalizeChoice()]
- "utils_exporthelpers_downloadblob": "downloadBlob()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L66 | neighbors=[index.ts, clarificationExcelExport.ts, exportHelpers.ts, downloadCSV()]
- "utils_formatters_formatfilesize": "formatFileSize()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L124 | neighbors=[DocumentsTab.tsx, AIDocumentAnalyzer.tsx, DocLibraryCatalog.tsx, formatters.ts]
- "utils_formatters_formathours": "formatHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L108 | neighbors=[BidExportTab.tsx, BidHoursTable.tsx, EngineeringHoursSection.tsx, formatters.ts]
- "utils_formatters_formatpercentage": "formatPercentage()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L104 | neighbors=[AnalyticsPage.tsx, PerformanceTrendsPage.tsx, ReportsPage.tsx, formatters.ts]
- "utils_kpihelpers_computecyclebypriority": "computeCycleByPriority()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L305 | neighbors=[DashboardPage.tsx, OperationalSummaryPage.tsx, kpiHelpers.ts, average()]
- "utils_kpihelpers_getfirstdeliverydate": "getFirstDeliveryDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L146 | neighbors=[kpiHelpers.ts, getCycleBusinessDays(), getOtif(), isDeliveredOnTime()]
- "utils_kpihelpers_getotif": "getOtif()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L237 | neighbors=[kpiHelpers.ts, getFirstDeliveryDate(), isDeliveredOnTime(), isFirstPassApproved()]
- "utils_kpihelpers_resolvekpitargets": "resolveKpiTargets()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L22 | neighbors=[useKpiTargets.ts, SystemConfiguration.tsx, kpiHelpers.ts, num()]
- "utils_kpihelpers_torate": "toRate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L133 | neighbors=[kpiHelpers.ts, computeFirstPassApproval(), computeOnTimeDelivery(), computeOtif()]
- "utils_notificationevents_joinnames": "joinNames()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L46 | neighbors=[notificationEvents.ts, buildAssignedNotification(), buildCreatedNotification(), orDash()]
- "utils_notificationevents_uniquekey": "uniqueKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L57 | neighbors=[notificationEvents.ts, buildAssignedNotification(), buildCreatedNotification(), deriveBidNotifications()]
- "utils_partphoto": "partPhoto.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/partPhoto.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, AddFavoriteEquipmentModal.tsx, FavoritesPage.tsx, getPartPhotoUrl()]
- "utils_pastbiddocument_amount": "amount()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L93 | neighbors=[pastBidDocument.ts, money(), hours(), pricing()]
- "utils_pastbiddocument_currentrevisionletter": "currentRevisionLetter()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L145 | neighbors=[TechnicalProposalKnowledgeService.ts, pastBidDocument.ts, buildPastBidMetadata(), identification()]
- "utils_pastbiddocument_derivepastbidtags": "derivePastBidTags()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L157 | neighbors=[PastBidKnowledgeService.ts, pastBidDocument.ts, mergeUnique(), scopeLines()]
- "utils_pastbiddocument_scopeitemblock": "scopeItemBlock()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L311 | neighbors=[pastBidDocument.ts, clean(), lines(), record()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-025.json

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
