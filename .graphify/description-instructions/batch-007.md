# Node Description Batch 8 of 86

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

- "bid_engineeringhourssection": "EngineeringHoursSection.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EngineeringHoursSection.tsx:L1 | neighbors=[BidHoursTable.tsx, EditItemModalState, EngineeringHoursSection(), EngineeringHoursSectionProps, INITIAL_MODAL, index.ts]
- "charts_charttooltip": "ChartTooltip.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/ChartTooltip.tsx:L1 | neighbors=[ChartTooltip(), ChartTooltipEntry, ChartTooltipProps, c271ce8 Refactor code structure for imp…, BidsByDivisionChart.tsx, BidsByStatusChart.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@414e1a6af2ef7d65e71340b57226241b4032238f": "414e1a6 style: Improve code formatting and readability across multiple componen…" | kind=Commit | source=git | neighbors=[02c1391 feat: Add supplier management f…, AddQuotationModal.tsx, main, 953278b feat: add ApprovalDueImpactSect…, SupplierCombobox.tsx, suppliers.config.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@e61a9d3f9a6c1d9ff9604eae1b8eaffa7925988b": "e61a9d3 feat: add notification system for SmartBID events" | kind=Commit | source=git | neighbors=[3ae3801 refactor: improve code formatti…, main, dbc974b Refactor email template HTML fo…, bidRoles.config.ts, notifications.config.ts, defaultSystemConfig.ts]
- "common_datatable": "DataTable.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DataTable.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, DataTable(), DataTableColumn, DataTableProps, QualificationLibraryView.tsx]
- "config_navigation_config": "navigation.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/navigation.config.ts:L1 | neighbors=[0e653cd more mods, 2538d01 feat: Implement Access Matrix c…, 3c5c37b more-mods, 3f57ca9 merge: integrate EASI module pa…, 6d20432 feat: adiciona paginas EASI ao …, 8e87d94 feat: Add Links and Recommendat…]
- "dashboard_dashboardperiodbar": "DashboardPeriodBar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardPeriodBar.tsx:L1 | neighbors=[953278b feat: add ApprovalDueImpactSect…, DashboardPeriodBar(), DashboardPeriodBarProps, DATE_FIELD_LABEL, DATE_FIELDS, PRESETS]
- "data_defaultsystemconfig": "defaultSystemConfig.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/data/defaultSystemConfig.ts:L1 | neighbors=[0e653cd more mods, 165493f NEW-MODIFIC, 2538d01 feat: Implement Access Matrix c…, 3c5c37b more-mods, 54fea3b feat: Enhance Part Number Autoc…, 5577aab feat: Add Technical Proposal fu…]
- "hooks_usebids_usebids": "useBids()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useBids.ts:L9 | neighbors=[useBids.ts, AnalyticsPage.tsx, BidBoardPage.tsx, BidDetailsReportPage.tsx, BidResultsPage.tsx, BidTrackerPage.tsx]
- "hooks_usestatuscolors_usestatuscolors": "useStatusColors()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useStatusColors.ts:L25 | neighbors=[BidCard.tsx, DivisionBadge.tsx, DashboardActivity.tsx, DashboardBidTable.tsx, DashboardFilterBar.tsx, DashboardKPIRow.tsx]
- "services_clarificationdbservice_clarificationdbservice": "ClarificationDbService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L31 | neighbors=[ImportClarificationModal.tsx, useClarificationLibrarySync.ts, ClarificationsDbPage.tsx, ClarificationDbService.ts, ._columns(), .create()]
- "services_notificationdispatchservice": "NotificationDispatchService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationDispatchService.ts:L1 | neighbors=[dbc974b Refactor email template HTML fo…, e61a9d3 feat: add notification system f…, BidDetailPage.tsx, CreateRequestPage.tsx, UnassignedRequestsPage.tsx, index.ts]
- "sheets_certificationssheet": "certificationsSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/certificationsSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, bc10d67 feat: add pastBidHelpers and pa…, context.ts, IBidExcelContext, newSheet()]
- "sheets_costsummarysheet": "costSummarySheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/costSummarySheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 54fea3b feat: Enhance Part Number Autoc…, 583d03e Refactor string concatenation i…, bc10d67 feat: add pastBidHelpers and pa…, context.ts]
- "stores_usechatstore": "useChatStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useChatStore.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, bc10d67 feat: add pastBidHelpers and pa…, de36cf5 feat: add SmartBid Docs indexer…, ChatAssistant.tsx, IAiChat.ts, IChatMessage]
- "suppliers_supplierdrawer": "SupplierDrawer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/suppliers/SupplierDrawer.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 0df87c0 refactor: improve code formatti…, 2538d01 feat: Implement Access Matrix c…, 414e1a6 style: Improve code formatting …, 921bf0d feat: enhance SupplierDrawer wi…, ea5c8e6 Refactor UI components for cons…]
- "utils_winprobability": "winProbability.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L1 | neighbors=[953278b feat: add ApprovalDueImpactSect…, bda0c32 style: Improve code formatting …, EngHoursOutlook.tsx, DashboardPage.tsx, FollowUpPage.tsx, index.ts]
- "bid_bidfavoritebutton": "BidFavoriteButton.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidFavoriteButton.tsx:L1 | neighbors=[BidFavoriteButton(), BidFavoriteButtonProps, useCurrentUser.ts, useCurrentUser(), index.ts, useFavoritesStore.ts]
- "bid_erndetailsmodal": "ErnDetailsModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnDetailsModal.tsx:L1 | neighbors=[ErnDetailsModal(), ErnDetailsModalProps, Row(), stateColor, withDate(), index.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@512f7b1940f82acbe73ce7403f658dfa6321acc2": "512f7b1 feat(survey): full-bleed 3D sea, compact header (search hits, BID compa…" | kind=Commit | source=git | neighbors=[main, fbe2c0e feat(survey): remove division/s…, useSurveyPortal.ts, AppLayout.tsx, SurveyEquipmentPage.tsx, SurveySystemPage.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@7d9108e4a151adaca085cf599f56201ea3cd5565": "7d9108e createrequestpage correction" | kind=Commit | source=git | neighbors=[feat/easi-modules-pages, main, c4e04de lots-implementation, defaultSystemConfig.ts, mockRequests.ts, AppLayout.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@9b2fdddd1f8512e4f47db4ffd1e0570997835e40": "9b2fddd feat(survey): diagram rooms (mast, survey online, bridge, ROV control, …" | kind=Commit | source=git | neighbors=[0a8206d feat(survey): 3D navigation - S…, main, 512f7b1 feat(survey): full-bleed 3D sea…, index.ts, ISurveyCatalog.ts, SurveySystemPage.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@adc0d383b3d1f138872fac30218fb4d06f96db6a": "adc0d38 Refactor TemplatesPage: Enhance filtering and sorting functionality" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, BidActivityLog.tsx, EquipmentImportModal.tsx, RevisionsTab.tsx, main, 2d4ecdb style: improve code formatting …]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@f51034392486ac09abe297185d8e7ad2a64e6412": "f510343 feat(survey): interactive spread zones - 3D orbs, exploded equipment, a…" | kind=Commit | source=git | neighbors=[8e88523 build: skip lint on gulp serve …, main, d9e6783 feat(survey): clean 3D overview…, index.ts, ISurveyCatalog.ts, SurveySystemPage.tsx]
- "common_confirmdialog": "ConfirmDialog.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ConfirmDialog.tsx:L1 | neighbors=[AssetsBreakdownTab.tsx, BidExportTab.tsx, ConfidentialAccessModal.tsx, DocumentsTab.tsx, ScopeOfSupplyTab.tsx, 3a3d0a5 new changes]
- "common_kpicard_kpicard": "KPICard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/KPICard.tsx:L47 | neighbors=[BidActivityLog.tsx, KPICard.tsx, DashboardKPIRow.tsx, EngHoursOutlook.tsx, ErnDashboardSection.tsx, AnalyticsPage.tsx]
- "common_requirepageaccess": "RequirePageAccess.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/RequirePageAccess.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, EmptyState.tsx, EmptyState(), NAV_PAGES, RequirePageAccess(), RequirePageAccessProps]
- "common_skeletonloader_skeletonloader": "SkeletonLoader()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SkeletonLoader.tsx:L12 | neighbors=[EquipmentImportModal.tsx, ImportClarificationModal.tsx, ImportQualificationModal.tsx, RequirePageAccess.tsx, SkeletonLoader.tsx, QualificationLibraryView.tsx]
- "config_ai_config": "ai.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L1 | neighbors=[1c19dcd Update API diagnostics and AI c…, 4b576db AI-Integration, 9582626 feat: add Access Log component …, 961eb93 feat: Update AI integration and…, 9e27edd feat: Update AI integration and…, b6d954d feat: Enhance AIAnalysisService…]
- "function_app_function_app_generate_scope": "generate_scope()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L664 | neighbors=[function_app.py, _bad_request(), _caller_upn(), _clarification_library_block(), _clarification_library_material(), _context_lines()]
- "insights_multiselectdropdown_multiselectdropdown": "MultiSelectDropdown()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/MultiSelectDropdown.tsx:L25 | neighbors=[ImportClarificationModal.tsx, ImportQualificationModal.tsx, DashboardFilterBar.tsx, DashboardPeriodBar.tsx, AnalyticsFilterBar.tsx, MultiSelectDropdown.tsx]
- "models_ibidapproval": "IBidApproval.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidApproval.ts:L1 | neighbors=[ApprovalMatrix.tsx, ApprovalRequestCard.tsx, ApprovalTimeline.tsx, ApprovalTab.tsx, 4c2e63a update smartbid 2.0, f3095f2 feat: add ApprovalTab component…]
- "models_iquerycatalog": "IQueryCatalog.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L1 | neighbors=[9cc3475 feat: Integrate Financials Acti…, bc10d67 feat: add pastBidHelpers and pa…, e2285cf cont-implementing, index.ts, CatalogSearchBucket, FinancialsActiveRegisteredColumn]
- "services_approvalservice": "ApprovalService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L1 | neighbors=[ApprovalTab.tsx, 1a40896 feat: add SmartBid 2.0 Executiv…, 2b1ed14 feat: add useApprovalSync hook …, 4c2e63a update smartbid 2.0, bc10d67 feat: add pastBidHelpers and pa…, f3095f2 feat: add ApprovalTab component…]
- "services_doclibrarycatalogservice": "DocLibraryCatalogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 8e87d94 feat: Add Links and Recommendat…, adc0d38 Refactor TemplatesPage: Enhance…, bc10d67 feat: add pastBidHelpers and pa…, de36cf5 feat: add SmartBid Docs indexer…, DocLibraryCatalog.tsx]
- "services_membersservice": "MembersService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L1 | neighbors=[OverviewTab.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 953278b feat: add ApprovalDueImpactSect…, dbdc03a systemconfig online, useTeamMembers.ts]
- "services_membersservice_membersservice": "MembersService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L9 | neighbors=[OverviewTab.tsx, useTeamMembers.ts, AppLayout.tsx, Header.tsx, BidDetailPage.tsx, CreateRequestPage.tsx]
- "services_qualificationdbservice": "QualificationDbService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L1 | neighbors=[ImportQualificationModal.tsx, 5c35e8d feat: Implement Qualification L…, aa081f9 refactor: Improve code formatti…, useClarificationLibrarySync.ts, QualificationLibraryView.tsx, ClarificationsDbPage.tsx]
- "services_qualificationdbservice_qualificationdbservice": "QualificationDbService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L24 | neighbors=[ImportQualificationModal.tsx, useClarificationLibrarySync.ts, QualificationLibraryView.tsx, ClarificationsDbPage.tsx, ClarificationKnowledgeService.ts, QualificationDbService.ts]
- "services_quotationservice": "QuotationService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L1 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, 165493f NEW-MODIFIC, b6d954d feat: Enhance AIAnalysisService…, c4e04de lots-implementation, de36cf5 feat: add SmartBid Docs indexer…]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-007.json

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
