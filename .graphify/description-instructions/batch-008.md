# Node Description Batch 9 of 86

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
For an entity node (any other kind — e.g. a person, place, event, object),
describe what the entity is and its role, grounded in its type, its
relations (neighbors) and the provided citations/evidence — e.g.
"Lady Carfax, a wealthy heiress who disappears en route to Lausanne.".
Ground entity descriptions in the citations/evidence when present; do not
speculate beyond the context, so a node with no supporting context may be
left out of the reply.
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "sheets_logisticssheet": "logisticsSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/logisticsSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, bc10d67 feat: add pastBidHelpers and pa…, context.ts, IBidExcelContext, newSheet()]
- "utils_costcalculations_buildcostsummary": "buildCostSummary()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L720 | neighbors=[OverviewTab.tsx, costCalculations.ts, calculateAssetsTotals(), calculateHoursTotals(), calculateMultiCurrencyTotals(), getBidContingency()]
- "utils_facethelpers": "facetHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/facetHelpers.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, DashboardBidTable.tsx, DashboardFilterBar.tsx, useAnalyticsFilters.ts, useDashboardFilters.ts, AnalyticsFilterBar.tsx]
- "utils_formatters_formatdatetime": "formatDateTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L75 | neighbors=[ApprovalOverrideBanner.tsx, BidActivityLog.tsx, BidComments.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, DocumentsTab.tsx]
- "utils_supplierprofile": "supplierProfile.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierProfile.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 414e1a6 style: Improve code formatting …, useSupplierServiceTypes.ts, SuppliersRegistry.tsx, useSupplierStore.ts, index.ts]
- "config_kpi_config": "kpi.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/kpi.config.ts:L1 | neighbors=[1665b01 more features, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, aaa091c Add hooks for KPI targets and l…, BID_PRIORITIES, DEFAULT_KPI_TARGETS]
- "hooks_usedashboardsync": "useDashboardSync.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDashboardSync.ts:L1 | neighbors=[953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, bda0c32 style: Improve code formatting …, DashboardSync, DashboardSyncOptions, syncBids()]
- "hooks_useresultstatus": "useResultStatus.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useResultStatus.ts:L1 | neighbors=[953278b feat: add ApprovalDueImpactSect…, bda0c32 style: Improve code formatting …, EngHoursOutlook.tsx, EngHoursRanking.tsx, useChartTheme.ts, useChartTheme()]
- "knowledge_qualificationcategoryinput": "QualificationCategoryInput.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationCategoryInput.tsx:L1 | neighbors=[QualificationsTab.tsx, ScopeOfSupplyTab.tsx, 5c35e8d feat: Implement Qualification L…, SuggestionInput.tsx, SuggestionInput(), QualificationCategoryInput()]
- "knowledge_qualificationentrymodal": "QualificationEntryModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationEntryModal.tsx:L1 | neighbors=[5c35e8d feat: Implement Qualification L…, SuggestionInput.tsx, SuggestionInput(), QualificationCategoryInput.tsx, QualificationCategoryInput(), QualificationEntryModal()]
- "models_iclarificationdb": "IClarificationDb.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IClarificationDb.ts:L1 | neighbors=[ImportClarificationModal.tsx, 77f55d4 feat: Add Clarification Entry M…, 8e87d94 feat: Add Links and Recommendat…, useClarificationLibraryFilter.ts, ClarificationBadges.tsx, ClarificationEntryDrawer.tsx]
- "models_iteammember": "ITeamMember.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ITeamMember.ts:L1 | neighbors=[ApprovalTab.tsx, 1665b01 more features, 3a3d0a5 new changes, 953278b feat: add ApprovalDueImpactSect…, dbdc03a systemconfig online, fe3728a smartbid2.0]
- "services_aiauthservice_aiauthservice": "AiAuthService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L57 | neighbors=[SmartBid20.tsx, AIAnalysisService.ts, AiAuthService.ts, .acquireInteractive(), .clearTokenCache(), .getAccessToken()]
- "services_clarificationdbservice": "ClarificationDbService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L1 | neighbors=[ImportClarificationModal.tsx, 77f55d4 feat: Add Clarification Entry M…, 8e87d94 feat: Add Links and Recommendat…, useClarificationLibrarySync.ts, ClarificationsDbPage.tsx, IClarificationDb.ts]
- "settings_accessmatrix": "AccessMatrix.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, ea5c8e6 Refactor UI components for cons…, index.ts, AccessLegend(), AccessMatrix(), AccessMatrixProps]
- "utils_bidhelpers_getduefreezedate": "getDueFreezeDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L58 | neighbors=[BidCard.tsx, OverviewTab.tsx, DashboardBidTable.tsx, useKPIs.ts, BidBoardPage.tsx, BidDetailPage.tsx]
- "utils_ernlink": "ernLink.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernLink.ts:L1 | neighbors=[ErnCreateModal.tsx, ErnSearchModal.tsx, 892c1fc feat: add PeoplePicker componen…, d23a43b feat: enhance ERN management wi…, index.ts, BidService.ts]
- "utils_formatters_parsedate": "parseDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L37 | neighbors=[DueDateChangeModal.tsx, DashboardActivity.tsx, useDashboardFilters.ts, CreateRequestPage.tsx, TimelinePage.tsx, DashboardService.ts]
- "charts_charttooltip_charttooltip": "ChartTooltip()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/ChartTooltip.tsx:L31 | neighbors=[ChartTooltip.tsx, BidsByDivisionChart.tsx, BidsByStatusChart.tsx, BidsByUrgencyChart.tsx, EngHoursOutlook.tsx, ErnDashboardSection.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@921bf0d7da96c285c456d7d234f36622d794f68f": "921bf0d feat: enhance SupplierDrawer with grouped quotations and expandable sec…" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, AssetsBreakdownTab.tsx, BidStatusPhasePanel.tsx, rows.ts, main, 0df87c0 refactor: improve code formatti…]
- "common_integrateddivisiontabs": "IntegratedDivisionTabs.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L1 | neighbors=[BidTabHeader.tsx, aaa091c Add hooks for KPI targets and l…, b6d954d feat: Enhance AIAnalysisService…, c4e04de lots-implementation, c58a13c new-implementations, DivisionContext]
- "config_peoplesoftconsulting_i18n": "peoplesoftConsulting.i18n.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/peoplesoftConsulting.i18n.ts:L1 | neighbors=[3ae3801 refactor: improve code formatti…, 9582626 feat: add Access Log component …, EN, IPeoplesoftColumnHeaders, IPeoplesoftConsultingText, IPeoplesoftHelpSection]
- "dashboard_livefocusoverlay": "LiveFocusOverlay.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/LiveFocusOverlay.tsx:L1 | neighbors=[aaa091c Add hooks for KPI targets and l…, ApprovalsPending.tsx, DashboardActivity.tsx, ErnWatchlist.tsx, FocusButton(), FocusMode]
- "hooks_useeditcontrol": "useEditControl.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useEditControl.ts:L1 | neighbors=[OverviewTab.tsx, QualificationsTab.tsx, c58a13c new-implementations, EditLockBanner.tsx, useCurrentUser.ts, useCurrentUser()]
- "insights_multiselectdropdown_multiselectoption": "MultiSelectOption" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/MultiSelectDropdown.tsx:L4 | neighbors=[ColumnFilter.tsx, DashboardBidTable.tsx, DashboardFilterBar.tsx, DashboardPeriodBar.tsx, useClarificationLibraryFilter.ts, useQualificationLibraryFilter.ts]
- "knowledge_pastbidbadges": "PastBidBadges.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidBadges.tsx:L1 | neighbors=[583d03e Refactor string concatenation i…, bec8260 feat: Enhance bid management wi…, KB_CLASS, OUTCOME_CLASS, PastBidChips(), PastBidChipsProps]
- "services_exportservice": "ExportService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ExportService.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, c271ce8 Refactor code structure for imp…, useExport.ts, BidDetailsReportPage.tsx, PeriodPerformancePage.tsx, IBidExport.ts]
- "services_surveycatalogservice_surveycatalogservice": "SurveyCatalogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L33 | neighbors=[SurveyCatalogService.ts, .ensureList(), .getAll(), ._guessZoneAnchor(), .importCatalog(), ._list()]
- "smartbid20_smartbid20webpart": "SmartBid20WebPart.ts" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L1 | neighbors=[3a3d0a5 new changes, 3f57ca9 merge: integrate EASI module pa…, 6d20432 feat: adiciona paginas EASI ao …, dbdc03a systemconfig online, fe3728a smartbid2.0, ISmartBid20Props.ts]
- "stores_useernstore": "useErnStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useErnStore.ts:L1 | neighbors=[892c1fc feat: add PeoplePicker componen…, aaa091c Add hooks for KPI targets and l…, DashboardBidTable.tsx, ErnDashboardSection.tsx, useDashboardSync.ts, useErn.ts]
- "survey3d_focuscontroller_focuscontroller": "FocusController" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L60 | neighbors=[createSurveyScene.ts, focusController.ts, .applyStates(), .close(), .constructor(), .dispose()]
- "utils_businessdays": "businessDays.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/businessDays.ts:L1 | neighbors=[3a3d0a5 new changes, 5577aab feat: Add Technical Proposal fu…, aaa091c Add hooks for KPI targets and l…, CreateRequestPage.tsx, IBidStatus.ts, BidPriority]
- "utils_scopehelpers": "scopeHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/scopeHelpers.ts:L1 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, CostSearchModal.tsx, ScopeOfSupplyTab.tsx, rows.ts, 54fea3b feat: Enhance Part Number Autoc…]
- "utils_validators": "validators.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L1 | neighbors=[AddQuotationModal.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 7d9108e createrequestpage correction, CreateRequestPage.tsx, QuotationsPage.tsx]
- "bid_duedatechangemodal": "DueDateChangeModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/DueDateChangeModal.tsx:L1 | neighbors=[DueDateChangeModal(), DueDateChangeModalProps, inputDateToIso(), toInputDate(), RevisionsTab.tsx, getActiveRevision()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@24595c5b3f79fb81dd9606a6b35a9e24363e2ddc": "24595c5 feat: Enhance Bid Export functionality with approval checks and logging" | kind=Commit | source=git | neighbors=[00efd39 Refactor Excel export sheets fo…, BidActivityLog.tsx, BidExportTab.tsx, BidStatusPhasePanel.tsx, context.ts, excelStyles.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@9cc347531a2e4d3da3ce9ca3bdd58281b37face7": "9cc3475 feat: Integrate Financials Active Registered CSV support and enhance qu…" | kind=Commit | source=git | neighbors=[1111add Add initial configuration files…, EquipmentImportModal.tsx, main, 3f57ca9 merge: integrate EASI module pa…, PartNumberAutocomplete.tsx, QueryCatalogLoadingBanner.tsx]
- "common_datatable_datatable": "DataTable()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DataTable.tsx:L20 | neighbors=[DataTable.tsx, QualificationLibraryView.tsx, BidDetailsReportPage.tsx, BidResultsPage.tsx, BidTrackerPage.tsx, ClarificationsDbPage.tsx]
- "common_divisionbadge_divisionbadge": "DivisionBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DivisionBadge.tsx:L10 | neighbors=[ImportClarificationModal.tsx, ImportQualificationModal.tsx, DivisionBadge.tsx, ClarificationEntryDrawer.tsx, PastBidDrawer.tsx, QualificationEntryDrawer.tsx]
- "config_phases_config": "phases.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L1 | neighbors=[1665b01 more features, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 8267c28 i18n: translate EASI, suppliers…, c4e04de lots-implementation, ddf6c96 Merge branch 'feat/survey-knowl…]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-008.json

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
