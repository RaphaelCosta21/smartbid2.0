# Node Description Batch 26 of 102

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

- "utils_domvisibility": "domVisibility.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/domVisibility.ts:L1 | neighbors=[9582626 feat: add Access Log component …, GuidedTour.tsx, QueryConsultingPage.tsx, getVisibleRect(), IVisibleRect]
- "utils_ernhelpers_buildernlinkrows": "buildErnLinkRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L228 | neighbors=[DashboardBidTable.tsx, ErnDashboardSection.tsx, useLiveOverview.ts, DashboardPage.tsx, ernHelpers.ts]
- "utils_ernhelpers_erndivision": "ErnDivision" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L75 | neighbors=[ErnCreateModal.tsx, ErnSearchModal.tsx, OverviewTab.tsx, ernHelpers.ts, ernLink.ts]
- "utils_ernhelpers_iernlinkrow": "IErnLinkRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L211 | neighbors=[ErnWatchlist.tsx, useLiveOverview.ts, LivePulse.tsx, LivePulsePanel.tsx, ernHelpers.ts]
- "utils_exporthelpers_bidstocsv": "bidsToCSV()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L48 | neighbors=[BidDetailsReportPage.tsx, PeriodPerformancePage.tsx, exportHelpers.ts, BidDetailPage.tsx, OperationalSummaryPage.tsx]
- "utils_exporthelpers_downloadblob": "downloadBlob()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L66 | neighbors=[index.ts, bomExcelExport.ts, clarificationExcelExport.ts, exportHelpers.ts, downloadCSV()]
- "utils_formatters_formatsignedcurrency": "formatSignedCurrency()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L124 | neighbors=[ComparisonExecutive.tsx, ComparisonTables.tsx, HistoryItemCard.tsx, formatters.ts, formatCurrency()]
- "utils_formatters_formatsignedpercent": "formatSignedPercent()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L116 | neighbors=[ComparisonExecutive.tsx, ComparisonSummary.tsx, ComparisonTables.tsx, HistoryItemCard.tsx, formatters.ts]
- "utils_kpihelpers_resolvepriorityrules": "resolvePriorityRules()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L70 | neighbors=[useKpiTargets.ts, SystemConfiguration.tsx, kpiHelpers.ts, num(), validatePriorityRules()]
- "utils_kpihelpers_targettone": "TargetTone" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L102 | neighbors=[KPICard.tsx, DashboardKPIRow.tsx, ErnDashboardSection.tsx, OperationalSummaryPage.tsx, kpiHelpers.ts]
- "utils_nmeadecode_parsenmea": "parseNmea()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L323 | neighbors=[SurveyNmeaLab.tsx, nmeaDecode.ts, checksumOf(), fail(), t()]
- "utils_nmeadecode_positionitem": "positionItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L131 | neighbors=[nmeaDecode.ts, formatCoord(), parseCoord(), plain(), t()]
- "utils_notificationevents_buildassignednotification": "buildAssignedNotification()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L107 | neighbors=[UnassignedRequestsPage.tsx, notificationEvents.ts, joinNames(), orDash(), uniqueKey()]
- "utils_notificationevents_buildcreatednotification": "buildCreatedNotification()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L88 | neighbors=[CreateRequestPage.tsx, notificationEvents.ts, joinNames(), orDash(), uniqueKey()]
- "utils_notificationevents_ordash": "orDash()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L43 | neighbors=[notificationEvents.ts, buildAssignedNotification(), buildCreatedNotification(), deriveBidNotifications(), joinNames()]
- "utils_partphoto": "partPhoto.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/partPhoto.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 79354cb Merge remote-tracking branch 'o…, AddFavoriteEquipmentModal.tsx, FavoritesPage.tsx, getPartPhotoUrl()]
- "utils_pastbiddocument_buildpastbidmetadata": "buildPastBidMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L1052 | neighbors=[PastBidKnowledgeService.ts, pastBidDocument.ts, clean(), currentRevisionLetter(), day()]
- "utils_pastbiddocument_getpastbidyear": "getPastBidYear()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L140 | neighbors=[PastBidDrawer.tsx, pastBidDocument.ts, buildPastBidDocument(), pastBidHelpers.ts, pastBidLedger.ts]
- "utils_pastbiddocument_hours": "hours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L721 | neighbors=[pastBidDocument.ts, amount(), lines(), record(), pricing()]
- "utils_pastbiddocument_outcome": "outcome()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L968 | neighbors=[pastBidDocument.ts, day(), heading(), money(), record()]
- "utils_pastbiddocument_revisionsandapproval": "revisionsAndApproval()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L912 | neighbors=[pastBidDocument.ts, heading(), lines(), record(), day()]
- "utils_pastbidhelpers_topastbidrow": "toPastBidRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L41 | neighbors=[FavoritesPage.tsx, PastBidsPage.tsx, pastBidHelpers.ts, getPastBidKbStatus(), getPastBidSearchText()]
- "utils_pdfexport_buildreportpdf": "buildReportPdf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L52 | neighbors=[BidDetailsReportPage.tsx, PeriodPerformancePage.tsx, ExportService.ts, pdfExport.ts, OperationalSummaryPage.tsx]
- "utils_phasehelpers_getphaseprogressbyindex": "getPhaseProgressByIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L43 | neighbors=[BidCard.tsx, DashboardBidTable.tsx, BidTrackerPage.tsx, phaseHelpers.ts, DashboardPage.tsx]
- "utils_quotationlinks_getadoptblockreason": "getAdoptBlockReason()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L236 | neighbors=[AssetsBreakdownTab.tsx, LinkedQuotationsPanel.tsx, BomQuotationPicker.tsx, quotationLinks.ts, getQuoteUnitUSD()]
- "utils_quotationlinks_getquoteunitusd": "getQuoteUnitUSD()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L197 | neighbors=[AssetsBreakdownTab.tsx, LinkedQuotationsPanel.tsx, quotationLinks.ts, getAdoptBlockReason(), getQuoteComparableUSD()]
- "utils_quotationlinks_islinkoverdue": "isLinkOverdue()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L56 | neighbors=[AssetsBreakdownTab.tsx, QuotationControlPanel.tsx, QuotationStatusChip.tsx, quotationLinks.ts, todayIso()]
- "utils_scopehelpers_isengsolutionssubtype": "isEngSolutionsSubType()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/scopeHelpers.ts:L9 | neighbors=[AssetsBreakdownTab.tsx, ScopeOfSupplyTab.tsx, rows.ts, costCalculations.ts, scopeHelpers.ts]
- "utils_surveybidintel_computesurveybidintel": "computeSurveyBidIntel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidIntel.ts:L19 | neighbors=[useSurveyPortal.ts, surveyBidIntel.ts, median(), norm(), percentile()]
- "utils_surveyfreescene_buildfreescene": "buildFreeScene()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyFreeScene.ts:L45 | neighbors=[SurveySystemPage.tsx, SurveyComposition3D.tsx, surveyFreeScene.ts, buildFocus(), locationByEquipment()]
- "utils_surveyglossary_getglossaryterm": "getGlossaryTerm()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L21 | neighbors=[SurveySystemPage.tsx, GlossaryText.tsx, SurveyGlossary.tsx, surveyDataJourney.ts, surveyGlossary.ts]
- "utils_surveyglossary_localize": "localize()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L25 | neighbors=[SurveySystemPage.tsx, GlossaryText.tsx, SurveyGlossary.tsx, SurveyNmeaLab.tsx, surveyGlossary.ts]
- "utils_surveyglossary_scanglossary": "scanGlossary()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L106 | neighbors=[surveyGlossary.ts, fold(), getMatcher(), isWordChar(), splitByGlossary()]
- "utils_surveyspreadgraph_buildadjacency": "buildAdjacency()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L246 | neighbors=[surveySpreadGraph.ts, reachableToHub(), traceDataRoute(), tracePathTo(), traceSignalPath()]
- "utils_surveyspreadgraph_ispreadlinkref": "ISpreadLinkRef" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L33 | neighbors=[SurveySystemPage.tsx, surveyDataJourney.ts, surveyFailure.ts, surveyGlossary.ts, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_tracedataroute": "traceDataRoute()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L414 | neighbors=[surveyDataJourney.ts, surveySpreadGraph.ts, buildAdjacency(), shortestPath(), traceSignalPath()]
- "utils_surveyspreadgraph_tracepathto": "tracePathTo()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L235 | neighbors=[surveyDataJourney.ts, surveySpreadGraph.ts, baseId(), buildAdjacency(), shortestPath()]
- "utils_technicalproposalhelpers_gettechnicalproposalattachment": "getTechnicalProposalAttachment()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/technicalProposalHelpers.ts:L29 | neighbors=[DocumentsTab.tsx, BidDetailPage.tsx, TechnicalProposalKnowledgeService.ts, technicalProposalHelpers.ts, getTechnicalProposalState()]
- "utils_winprobability_gethistoricalwinprobability": "getHistoricalWinProbability()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L97 | neighbors=[FollowUpPage.tsx, winProbability.ts, clientKey(), fromTally(), getWinProbability()]
- "bid_bidfxnote_usdamountcell": "UsdAmountCell()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidFxNote.tsx:L24 | neighbors=[BidFxNote.tsx, CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx, PreparationMobilizationTab.tsx]

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
