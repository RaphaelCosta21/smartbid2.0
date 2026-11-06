# Node Description Batch 10 of 102

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
LANGUAGE: each entry has a `lang=` marker giving the language of its source.
Write that entry's description in EXACTLY that language. Do not translate to
a single common language — match each node's source language individually.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "models_iquerycatalog": "IQueryCatalog.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, 9cc3475 feat: Integrate Financials Acti…, bc10d67 feat: add pastBidHelpers and pa…, e2285cf cont-implementing, index.ts, CatalogSearchBucket] | lang=en
- "models_iteammember": "ITeamMember.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ITeamMember.ts:L1 | neighbors=[ApprovalTab.tsx, 1665b01 more features, 3a3d0a5 new changes, 747fd66 feat(survey): Oceaneering theme…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…] | lang=en
- "services_clarificationdbservice_clarificationdbservice": "ClarificationDbService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L31 | neighbors=[ImportClarificationModal.tsx, useClarificationLibrarySync.ts, ClarificationsDbPage.tsx, ClarificationDbService.ts, ._columns(), .create()] | lang=en
- "services_membersservice": "MembersService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L1 | neighbors=[OverviewTab.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, dbdc03a systemconfig online] | lang=en
- "services_notificationdispatchservice": "NotificationDispatchService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationDispatchService.ts:L1 | neighbors=[dbc974b Refactor email template HTML fo…, e61a9d3 feat: add notification system f…, BidDetailPage.tsx, CreateRequestPage.tsx, UnassignedRequestsPage.tsx, index.ts] | lang=en
- "services_systemconfigservice": "SystemConfigService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SystemConfigService.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 4c2e63a update smartbid 2.0, 79354cb Merge remote-tracking branch 'o…, 8152d02 feat: implement split approval …, dbdc03a systemconfig online, e61a9d3 feat: add notification system f…] | lang=en
- "sheets_logisticssheet": "logisticsSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/logisticsSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, context.ts, IBidExcelContext] | lang=en
- "survey3d_equipmentmodels": "equipmentModels.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L1 | neighbors=[2a932fc feat(survey): failure cascade, …, 4fd375f feat(survey): free 3D compositi…, 5d664ea Merge feat/survey-knowledge-por…, 6062346 feat(survey): failure cascade, …, 9b2fddd feat(survey): diagram rooms (ma…, ddf6c96 Merge branch 'feat/survey-knowl…] | lang=en
- "utils_facethelpers": "facetHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/facetHelpers.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 79354cb Merge remote-tracking branch 'o…, DashboardBidTable.tsx, DashboardFilterBar.tsx, useAnalyticsFilters.ts, useDashboardFilters.ts] | lang=en
- "utils_scopehelpers": "scopeHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/scopeHelpers.ts:L1 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, CostSearchModal.tsx, LinkedQuotationsPanel.tsx, ScopeOfSupplyTab.tsx, rows.ts] | lang=en
- "utils_supplierprofile": "supplierProfile.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierProfile.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 414e1a6 style: Improve code formatting …, 79354cb Merge remote-tracking branch 'o…, useSupplierServiceTypes.ts, SuppliersRegistry.tsx, useSupplierStore.ts] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@24595c5b3f79fb81dd9606a6b35a9e24363e2ddc": "24595c5 feat: Enhance Bid Export functionality with approval checks and logging" | kind=Commit | source=git | neighbors=[00efd39 Refactor Excel export sheets fo…, BidActivityLog.tsx, BidExportTab.tsx, BidStatusPhasePanel.tsx, context.ts, excelStyles.ts] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@4fd375f94ed7cac49f9c883afa5e3241b73ba178": "4fd375f feat(survey): free 3D composition, software catalog, 3-sat GNSS" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-kno…, feat/survey-knowledge-portal, main, a0cd8e2 feat: native quotations, BID pr…, navigation.config.ts, routes.config.ts] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@50a29c7cb7bdbc57d5ed9ea8ba7b54f453ae5650": "50a29c7 feat(survey): Full Survey Spread template (DWG 803038098 rev A) - catal…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, 8e88523 build: skip lint on gulp serve …] | lang=pt
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@921bf0d7da96c285c456d7d234f36622d794f68f": "921bf0d feat: enhance SupplierDrawer with grouped quotations and expandable sec…" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, AssetsBreakdownTab.tsx, BidStatusPhasePanel.tsx, rows.ts, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@961eb9349ef06a42f117b4dd82bb85b29783b500": "961eb93 feat: Update AI integration and enhance quotation extraction process" | kind=Commit | source=git | neighbors=[1c19dcd Update API diagnostics and AI c…, AddQuotationModal.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@9e27edd626169c57fbad25021446adff88f78983": "9e27edd feat: Update AI integration and authentication flow" | kind=Commit | source=git | neighbors=[401be0c Add EntraTokenTest component fo…, AddQuotationModal.tsx, QualificationsTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@be5fb82c1574de5e69da9acdc8b818e8e3d6ba9f": "be5fb82 feat(survey): data journey from origin to client deliverables" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, main, 3d59093 Merge feat/survey-data-journey …, surveyDataFormats.ts, SurveySystemPage.tsx, cableFlow.ts] | lang=en
- "comparator_comparisonsummary": "ComparisonSummary.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonSummary.tsx:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, GlassCard.tsx, GlassCard(), KPICard.tsx, KPICard()] | lang=en
- "config_kpi_config": "kpi.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/kpi.config.ts:L1 | neighbors=[1665b01 more features, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, aaa091c Add hooks for KPI targets and l…, BID_PRIORITIES] | lang=en
- "function_app_function_app_generate_scope": "generate_scope()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L664 | neighbors=[function_app.py, _bad_request(), _caller_upn(), _clarification_library_block(), _clarification_library_material(), _context_lines()] | lang=en
- "hooks_usedashboardsync": "useDashboardSync.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDashboardSync.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, bda0c32 style: Improve code formatting …, DashboardSync, DashboardSyncOptions] | lang=en
- "hooks_useresultstatus": "useResultStatus.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useResultStatus.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, bda0c32 style: Improve code formatting …, EngHoursOutlook.tsx, EngHoursRanking.tsx, useChartTheme.ts] | lang=en
- "insights_multiselectdropdown_multiselectoption": "MultiSelectOption" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/MultiSelectDropdown.tsx:L4 | neighbors=[BomQuotationPicker.tsx, ColumnFilter.tsx, DashboardBidTable.tsx, DashboardFilterBar.tsx, DashboardPeriodBar.tsx, useClarificationLibraryFilter.ts] | lang=en
- "models_ibidapproval": "IBidApproval.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidApproval.ts:L1 | neighbors=[ApprovalMatrix.tsx, ApprovalRequestCard.tsx, ApprovalTimeline.tsx, ApprovalTab.tsx, 4c2e63a update smartbid 2.0, f3095f2 feat: add ApprovalTab component…] | lang=en
- "models_iclarificationdb": "IClarificationDb.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IClarificationDb.ts:L1 | neighbors=[ImportClarificationModal.tsx, 77f55d4 feat: Add Clarification Entry M…, 79354cb Merge remote-tracking branch 'o…, 8e87d94 feat: Add Links and Recommendat…, useClarificationLibraryFilter.ts, ClarificationBadges.tsx] | lang=en
- "services_clarificationdbservice": "ClarificationDbService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L1 | neighbors=[ImportClarificationModal.tsx, 77f55d4 feat: Add Clarification Entry M…, 79354cb Merge remote-tracking branch 'o…, 8e87d94 feat: Add Links and Recommendat…, useClarificationLibrarySync.ts, ClarificationsDbPage.tsx] | lang=en
- "services_membersservice_membersservice": "MembersService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L9 | neighbors=[OverviewTab.tsx, useTeamMembers.ts, AppLayout.tsx, Header.tsx, BidDetailPage.tsx, CreateRequestPage.tsx] | lang=en
- "services_qualificationdbservice": "QualificationDbService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L1 | neighbors=[ImportQualificationModal.tsx, 5c35e8d feat: Implement Qualification L…, aa081f9 refactor: Improve code formatti…, useClarificationLibrarySync.ts, QualificationLibraryView.tsx, ClarificationsDbPage.tsx] | lang=en
- "services_qualificationdbservice_qualificationdbservice": "QualificationDbService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L24 | neighbors=[ImportQualificationModal.tsx, useClarificationLibrarySync.ts, QualificationLibraryView.tsx, ClarificationsDbPage.tsx, ClarificationKnowledgeService.ts, QualificationDbService.ts] | lang=en
- "settings_accessmatrix": "AccessMatrix.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 79354cb Merge remote-tracking branch 'o…, ea5c8e6 Refactor UI components for cons…, index.ts, AccessLegend(), AccessMatrix()] | lang=en
- "smartbid20_smartbid20webpart": "SmartBid20WebPart.ts" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L1 | neighbors=[3939503 refactor: improve code formatti…, 3a3d0a5 new changes, 3f57ca9 merge: integrate EASI module pa…, 4657c82 Add smartbid-logo-teal.png asse…, 6d20432 feat: adiciona paginas EASI ao …, dbdc03a systemconfig online] | lang=en
- "utils_costcalculations_buildcostsummary": "buildCostSummary()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L720 | neighbors=[OverviewTab.tsx, costCalculations.ts, calculateAssetsTotals(), calculateHoursTotals(), calculateMultiCurrencyTotals(), getBidContingency()] | lang=en
- "utils_formatters_formatdatetime": "formatDateTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L82 | neighbors=[ApprovalOverrideBanner.tsx, BidActivityLog.tsx, BidComments.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, DocumentsTab.tsx] | lang=en
- "charts_charttooltip_charttooltip": "ChartTooltip()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/ChartTooltip.tsx:L31 | neighbors=[ChartTooltip.tsx, ParetoChart.tsx, BidsByDivisionChart.tsx, BidsByStatusChart.tsx, BidsByUrgencyChart.tsx, EngHoursOutlook.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@2a932fc765e4d348321ff50d2bfbf1b4d9d6b31c": "2a932fc feat(survey): failure cascade, gap analysis, missions, NL ask, subsea-i…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-kno…, main, 79354cb Merge remote-tracking branch 'o…, ISurveyCatalog.ts, SurveySystemPage.tsx, equipmentModels.ts] | lang=pt
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@2b1ed14bc5c378db13bde794d0b05cce43088854": "2b1ed14 feat: add useApprovalSync hook to synchronize BID approval state with S…" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, BidActivityLog.tsx, OverviewTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@5d664ead30adf7a85529cb535e84720cc4836c8a": "5d664ea Merge feat/survey-knowledge-portal-main-sync into main" | kind=Commit | source=git | neighbors=[3939503 refactor: improve code formatti…, main, 3d59093 Merge feat/survey-data-journey …, ISurveyCatalog.ts, SurveySystemPage.tsx, equipmentModels.ts] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@6062346613d7a555ca0b0107c976f3eafc9795b3": "6062346 feat(survey): failure cascade, gap analysis, missions, NL ask, subsea-i…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, main, d614a0b feat(survey): bilingual survey …, ISurveyCatalog.ts, SurveySystemPage.tsx, equipmentModels.ts] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@d614a0b9fc53cf41860799e7ff8635d629d7e213": "d614a0b feat(survey): bilingual survey glossary, hover terms, NMEA decode lab, …" | kind=Commit | source=git | neighbors=[6062346 feat(survey): failure cascade, …, backup/survey-merge-20261018-113028-jou…, main, be5fb82 feat(survey): data journey from…, surveyGlossary.ts, index.ts] | lang=pt

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-009.json

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
