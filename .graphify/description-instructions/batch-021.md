# Node Description Batch 22 of 86

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

- "utils_costcalculations_calculatehourstotals": "calculateHoursTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L619 | neighbors=[costCalculations.ts, buildCostSummary(), getBidFx(), costSummaryView.ts, BidCostSummary.tsx]
- "utils_costcalculations_converttousd": "convertToUSD()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L883 | neighbors=[AddQuotationModal.tsx, BomCostsPage.tsx, QueryConsultingPage.tsx, QuotationsPage.tsx, costCalculations.ts]
- "utils_costcalculations_getbidcontingency": "getBidContingency()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L83 | neighbors=[OverviewTab.tsx, rows.ts, costCalculations.ts, buildCostSummary(), costSummaryView.ts]
- "utils_costcalculations_withcostsummary": "withCostSummary()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L868 | neighbors=[BidDetailPage.tsx, BidService.ts, costCalculations.ts, buildCostSummary(), pruneOrphanCosts()]
- "utils_costsummaryview_buildcostsummaryview": "buildCostSummaryView()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costSummaryView.ts:L114 | neighbors=[BidCostSummary.tsx, BidExportTab.tsx, index.ts, costSummaryView.ts, sumBy()]
- "utils_csvparser": "csvParser.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/csvParser.ts:L1 | neighbors=[9cc3475 feat: Integrate Financials Acti…, QueryCatalogService.ts, bomParser.ts, RFC-4180, parseCSVRows()]
- "utils_domvisibility": "domVisibility.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/domVisibility.ts:L1 | neighbors=[9582626 feat: add Access Log component …, GuidedTour.tsx, QueryConsultingPage.tsx, getVisibleRect(), IVisibleRect]
- "utils_ernhelpers_buildernlinkrows": "buildErnLinkRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L217 | neighbors=[DashboardBidTable.tsx, ErnDashboardSection.tsx, useLiveOverview.ts, DashboardPage.tsx, ernHelpers.ts]
- "utils_ernhelpers_erndivision": "ErnDivision" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L70 | neighbors=[ErnCreateModal.tsx, ErnSearchModal.tsx, OverviewTab.tsx, ernHelpers.ts, ernLink.ts]
- "utils_ernhelpers_iernlinkrow": "IErnLinkRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L200 | neighbors=[ErnWatchlist.tsx, useLiveOverview.ts, LivePulse.tsx, LivePulsePanel.tsx, ernHelpers.ts]
- "utils_exporthelpers_bidstocsv": "bidsToCSV()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L48 | neighbors=[BidDetailsReportPage.tsx, PeriodPerformancePage.tsx, exportHelpers.ts, BidDetailPage.tsx, OperationalSummaryPage.tsx]
- "utils_formatters_formatcurrencycompact": "formatCurrencyCompact()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L17 | neighbors=[BidExportTab.tsx, DashboardKPIRow.tsx, AnalyticsPage.tsx, BidDetailsReportPage.tsx, formatters.ts]
- "utils_kpihelpers_resolvepriorityrules": "resolvePriorityRules()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L70 | neighbors=[useKpiTargets.ts, SystemConfiguration.tsx, kpiHelpers.ts, num(), validatePriorityRules()]
- "utils_kpihelpers_targettone": "TargetTone" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L102 | neighbors=[KPICard.tsx, DashboardKPIRow.tsx, ErnDashboardSection.tsx, OperationalSummaryPage.tsx, kpiHelpers.ts]
- "utils_notificationevents_buildassignednotification": "buildAssignedNotification()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L107 | neighbors=[UnassignedRequestsPage.tsx, notificationEvents.ts, joinNames(), orDash(), uniqueKey()]
- "utils_notificationevents_buildcreatednotification": "buildCreatedNotification()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L88 | neighbors=[CreateRequestPage.tsx, notificationEvents.ts, joinNames(), orDash(), uniqueKey()]
- "utils_notificationevents_ordash": "orDash()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L43 | neighbors=[notificationEvents.ts, buildAssignedNotification(), buildCreatedNotification(), deriveBidNotifications(), joinNames()]
- "utils_pastbiddocument_buildpastbidmetadata": "buildPastBidMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L1043 | neighbors=[PastBidKnowledgeService.ts, pastBidDocument.ts, clean(), currentRevisionLetter(), day()]
- "utils_pastbiddocument_getpastbidyear": "getPastBidYear()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L139 | neighbors=[PastBidDrawer.tsx, pastBidDocument.ts, buildPastBidDocument(), pastBidHelpers.ts, pastBidLedger.ts]
- "utils_pastbiddocument_hours": "hours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L720 | neighbors=[pastBidDocument.ts, amount(), lines(), record(), pricing()]
- "utils_pastbiddocument_outcome": "outcome()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L959 | neighbors=[pastBidDocument.ts, day(), heading(), money(), record()]
- "utils_pastbiddocument_revisionsandapproval": "revisionsAndApproval()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L911 | neighbors=[pastBidDocument.ts, day(), heading(), lines(), record()]
- "utils_pastbidhelpers_topastbidrow": "toPastBidRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L41 | neighbors=[FavoritesPage.tsx, PastBidsPage.tsx, pastBidHelpers.ts, getPastBidKbStatus(), getPastBidSearchText()]
- "utils_pdfexport_buildreportpdf": "buildReportPdf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L52 | neighbors=[BidDetailsReportPage.tsx, PeriodPerformancePage.tsx, ExportService.ts, pdfExport.ts, OperationalSummaryPage.tsx]
- "utils_phasehelpers_getphaseprogressbyindex": "getPhaseProgressByIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L43 | neighbors=[BidCard.tsx, DashboardBidTable.tsx, BidTrackerPage.tsx, phaseHelpers.ts, DashboardPage.tsx]
- "utils_scopehelpers_isengsolutionssubtype": "isEngSolutionsSubType()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/scopeHelpers.ts:L9 | neighbors=[AssetsBreakdownTab.tsx, ScopeOfSupplyTab.tsx, rows.ts, costCalculations.ts, scopeHelpers.ts]
- "utils_scopehelpers_searchablepartnumber": "searchablePartNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/scopeHelpers.ts:L71 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, CostSearchModal.tsx, scopeHelpers.ts, isPlaceholderPartNumber()]
- "utils_surveybidintel_computesurveybidintel": "computeSurveyBidIntel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidIntel.ts:L19 | neighbors=[useSurveyPortal.ts, surveyBidIntel.ts, median(), norm(), percentile()]
- "utils_technicalproposalhelpers_gettechnicalproposalattachment": "getTechnicalProposalAttachment()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/technicalProposalHelpers.ts:L29 | neighbors=[DocumentsTab.tsx, BidDetailPage.tsx, TechnicalProposalKnowledgeService.ts, technicalProposalHelpers.ts, getTechnicalProposalState()]
- "utils_winprobability_gethistoricalwinprobability": "getHistoricalWinProbability()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L97 | neighbors=[FollowUpPage.tsx, winProbability.ts, clientKey(), fromTally(), getWinProbability()]
- "bid_bidfxnote_usdamountcell": "UsdAmountCell()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidFxNote.tsx:L24 | neighbors=[BidFxNote.tsx, CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx, PreparationMobilizationTab.tsx]
- "bid_bidstatusdropdown": "BidStatusDropdown.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusDropdown.tsx:L1 | neighbors=[BidStatusDropdown(), BidStatusDropdownProps, 3a3d0a5 new changes, fe3728a smartbid2.0]
- "bid_bidtabheader_iheaderstat": "IHeaderStat" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L8 | neighbors=[BidCostSummary.tsx, BidTabHeader.tsx, LogisticsBreakdownTab.tsx, ScopeOfSupplyTab.tsx]
- "bid_equipmentimportmodal_equipmentimportmodal": "EquipmentImportModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L552 | neighbors=[EquipmentImportModal.tsx, toWords(), ScopeOfSupplyTab.tsx, AddFavoriteEquipmentModal.tsx]
- "bid_scopeofsupplytab_scopeofsupplytab": "ScopeOfSupplyTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L209 | neighbors=[ScopeOfSupplyTab.tsx, AIDocumentAnalyzer.tsx, BidDetailPage.tsx, TemplateEditor.tsx]
- "bidexcelexport_context_bid_excel_sheets": "BID_EXCEL_SHEETS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/context.ts:L15 | neighbors=[BidExportTab.tsx, context.ts, index.ts, infoSheet.ts]
- "bidexcelexport_excelstyles_displaydate": "displayDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L122 | neighbors=[excelStyles.ts, toExcelDate(), costSummarySheet.ts, infoSheet.ts]
- "bidexcelexport_excelstyles_xlsheet_estimateheight": ".estimateHeight()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L815 | neighbors=[XlSheet, .keyValue(), .note(), .noticeStrip()]
- "bidexcelexport_excelstyles_xlsheet_gap": ".gap()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L326 | neighbors=[XlSheet, .banner(), .noticeStrip(), .sectionTitle()]
- "bidexcelexport_excelstyles_xlsheet_sectiontitle": ".sectionTitle()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L443 | neighbors=[XlSheet, .font(), .gap(), .setValue()]

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
