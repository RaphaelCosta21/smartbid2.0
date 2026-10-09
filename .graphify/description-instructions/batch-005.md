# Node Description Batch 6 of 86

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

- "dashboard_dashboardkpirow": "DashboardKPIRow.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardKPIRow.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 3a3d0a5 new changes, aaa091c Add hooks for KPI targets and l…, bd70cf6 style: improve code formatting …, fe3728a smartbid2.0, KPICard.tsx] | lang=en
- "function_app_document_structure": "document_structure.py" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L1 | neighbors=[02c1391 feat: Add supplier management f…, b6d954d feat: Enhance AIAnalysisService…, bc10d67 feat: add pastBidHelpers and pa…, _atomic_blocks(), _atx_heading(), breadcrumb()] | lang=en
- "hooks_useliveoverview": "useLiveOverview.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useLiveOverview.ts:L1 | neighbors=[921bf0d feat: enhance SupplierDrawer wi…, aaa091c Add hooks for KPI targets and l…, ErnDashboardSection.tsx, ErnLiveKpis, ILiveUpdate, LiveOverview] | lang=en
- "insights_segmentedcontrol": "SegmentedControl.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/SegmentedControl.tsx:L1 | neighbors=[ExportClarificationModal.tsx, 77f55d4 feat: Add Clarification Entry M…, c271ce8 Refactor code structure for imp…, DashboardActivity.tsx, DashboardPeriodBar.tsx, EngHoursOutlook.tsx] | lang=en
- "pages_approvalspage": "ApprovalsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ApprovalsPage.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, c4e04de lots-implementation, AppLayout.tsx] | lang=en
- "settings_accesslog": "AccessLog.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessLog.tsx:L1 | neighbors=[3ae3801 refactor: improve code formatti…, 9582626 feat: add Access Log component …, DataTable.tsx, DataTable(), EmptyState.tsx, EmptyState()] | lang=en
- "utils_activityloghelpers": "activityLogHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/activityLogHelpers.ts:L1 | neighbors=[ApprovalTab.tsx, BidActivityLog.tsx, BidConfidentialButton.tsx, BidExportTab.tsx, DocumentsTab.tsx, OverviewTab.tsx] | lang=en
- "utils_suppliermatching": "supplierMatching.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L1 | neighbors=[AddQuotationModal.tsx, 02c1391 feat: Add supplier management f…, 414e1a6 style: Improve code formatting …, SupplierCombobox.tsx, QuotationsPage.tsx, SuppliersRegistry.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@f3095f250b5c5b4a885d7e1ed222b1ba484f2a67": "f3095f2 feat: add ApprovalTab component with styling and functionality for mana…" | kind=Commit | source=git | neighbors=[66dbcee feat: Implement contingency cal…, ApprovalTab.tsx, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, CostSearchModal.tsx] | lang=en
- "common_partnumberautocomplete": "PartNumberAutocomplete.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PartNumberAutocomplete.tsx:L1 | neighbors=[AssetsBreakdownTab.tsx, CostSearchModal.tsx, ScopeOfSupplyTab.tsx, 0546310 Add dashboard components and st…, 165493f NEW-MODIFIC, 54fea3b feat: Enhance Part Number Autoc…] | lang=en
- "config_ai_prompts": "ai.prompts.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 4b576db AI-Integration, 5c35e8d feat: Implement Qualification L…, 961eb93 feat: Update AI integration and…, b6d954d feat: Enhance AIAnalysisService…, bc10d67 feat: add pastBidHelpers and pa…] | lang=en
- "config_notifications_config": "notifications.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L1 | neighbors=[dbc974b Refactor email template HTML fo…, e61a9d3 feat: add notification system f…, BID_ROLE_KEYS, buildDefaultNotificationRules(), buildDefaultRule(), clampDeadlineWarningDays()] | lang=en
- "hooks_useanalyticsfilters": "useAnalyticsFilters.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, c271ce8 Refactor code structure for imp…, DashboardPeriodBar.tsx, AnalyticsFacetCounts, AnalyticsFacetKey, AnalyticsFilters] | lang=en
- "hooks_usedashboardfilters": "useDashboardFilters.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDashboardFilters.ts:L1 | neighbors=[953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, bda0c32 style: Improve code formatting …, DashboardFilterBar.tsx, DashboardPeriodBar.tsx, useAnalyticsFilters.ts] | lang=en
- "hooks_usepageaccess": "usePageAccess.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/usePageAccess.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, RequirePageAccess.tsx, IPageAccess, PageAccessContext, usePageAccess(), index.ts] | lang=en
- "knowledge_clarificationentrydrawer": "ClarificationEntryDrawer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationEntryDrawer.tsx:L1 | neighbors=[1d028a0 style: Improve code formatting …, 75476a5 feat: add confidentiality manag…, 77f55d4 feat: Add Clarification Entry M…, ConfidentialLock.tsx, ConfidentialLock(), DivisionBadge.tsx] | lang=en
- "knowledge_pastbidcard": "PastBidCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidCard.tsx:L1 | neighbors=[583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, bec8260 feat: Enhance bid management wi…, BidFavoriteButton.tsx, BidFavoriteButton(), ConfidentialLock.tsx] | lang=en
- "knowledge_pastbiddrawer": "PastBidDrawer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidDrawer.tsx:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, bc10d67 feat: add pastBidHelpers and pa…, BidFavoriteButton.tsx] | lang=en
- "sheets_prepmobsheet": "prepMobSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/prepMobSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 583d03e Refactor string concatenation i…, bc10d67 feat: add pastBidHelpers and pa…, context.ts, IBidExcelContext] | lang=en
- "survey3d_focuscontroller": "focusController.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L1 | neighbors=[512f7b1 feat(survey): full-bleed 3D sea…, 9b2fddd feat(survey): diagram rooms (ma…, b07a797 feat(survey): toggle to hide co…, d9e6783 feat(survey): clean 3D overview…, ddf6c96 Merge branch 'feat/survey-knowl…, f510343 feat(survey): interactive sprea…] | lang=en
- "utils_bidconfidentiality": "bidConfidentiality.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L1 | neighbors=[ApprovalTab.tsx, BidConfidentialButton.tsx, ConfidentialAccessModal.tsx, ConfidentialLock.tsx, 75476a5 feat: add confidentiality manag…, cce41cc refactor: clean up code formatt…] | lang=en
- "bid_bidtimeline": "BidTimeline.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTimeline.tsx:L1 | neighbors=[BidTimeline(), BidTimelineProps, getPhaseTotalHours(), useLiveElapsed(), GlassCard.tsx, GlassCard()] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@bd70cf6a6bd283ebb6003f61ea7cf25feff27832": "bd70cf6 style: improve code formatting and readability across multiple componen…" | kind=Commit | source=git | neighbors=[aaa091c Add hooks for KPI targets and l…, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidFxNote.tsx, BidHoursTable.tsx, BidTabHeader.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@dbdc03a61d6c1cc96aee4fef6f9ffb43fc540b5a": "dbdc03a systemconfig online" | kind=Commit | source=git | neighbors=[3a3d0a5 new changes, feat/easi-modules-pages, main, 7d9108e createrequestpage correction, defaultSystemConfig.ts, gulpfile.js] | lang=pt
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@f03d3f60c408c58793207269f44e87f89ce05113": "f03d3f6 feat: Enhance ImportSourceModal with favorites integration and keyboard…" | kind=Commit | source=git | neighbors=[bec8260 feat: Enhance bid management wi…, AssetsBreakdownTab.tsx, ClarificationSuggestionsModal.tsx, EquipmentImportModal.tsx, ScopeOfSupplyTab.tsx, main] | lang=en
- "common_divisionbadge": "DivisionBadge.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DivisionBadge.tsx:L1 | neighbors=[ImportClarificationModal.tsx, ImportQualificationModal.tsx, 0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 9759c3b Refactor DivisionBadge and Memb…] | lang=en
- "common_guidedtour": "GuidedTour.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L1 | neighbors=[3ae3801 refactor: improve code formatti…, 9582626 feat: add Access Log component …, computePlacement(), findTarget(), getScrollParent(), GuidedTour()] | lang=en
- "common_statusbadge_statusbadge": "StatusBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/StatusBadge.tsx:L12 | neighbors=[BidActivityLog.tsx, BidCard.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, DocumentsTab.tsx, OverviewTab.tsx] | lang=en
- "hooks_usebids": "useBids.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useBids.ts:L1 | neighbors=[c4e04de lots-implementation, fe3728a smartbid2.0, useBids(), index.ts, useBidStore.ts, useBidStore] | lang=en
- "hooks_usekpis": "useKPIs.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useKPIs.ts:L1 | neighbors=[0e653cd more mods, 5577aab feat: Add Technical Proposal fu…, 8e87d94 feat: Add Links and Recommendat…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, bec8260 feat: Enhance bid management wi…] | lang=en
- "knowledge_clarificationbadges": "ClarificationBadges.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationBadges.tsx:L1 | neighbors=[ExportClarificationModal.tsx, ImportClarificationModal.tsx, ImportQualificationModal.tsx, QualificationGroupList.tsx, QualificationsTab.tsx, 1d028a0 style: Improve code formatting …] | lang=en
- "layout_commandpalette": "CommandPalette.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/CommandPalette.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 8e87d94 feat: Add Links and Recommendat…, ea5c8e6 Refactor UI components for cons…, fe3728a smartbid2.0] | lang=en
- "pages_linksrecommendationspage": "LinksRecommendationsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/LinksRecommendationsPage.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 8e87d94 feat: Add Links and Recommendat…, AppLayout.tsx, PageHeader.tsx, PageHeader(), useCurrentUser.ts] | lang=en
- "stores_usesurveystore": "useSurveyStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSurveyStore.ts:L1 | neighbors=[50a29c7 feat(survey): Full Survey Sprea…, 512f7b1 feat(survey): full-bleed 3D sea…, ddf6c96 Merge branch 'feat/survey-knowl…, ee6b009 feat(survey): upload equipment …, f06225e feat(survey): Survey Knowledge …, f510343 feat(survey): interactive sprea…] | lang=en
- "utils_constants": "constants.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L1 | neighbors=[OverviewTab.tsx, 3a3d0a5 new changes, fe3728a smartbid2.0, PriorityBadge.tsx, useStatusColors.ts, BidDetailPage.tsx] | lang=en
- "utils_exporthelpers": "exportHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L1 | neighbors=[index.ts, 4c2e63a update smartbid 2.0, bc10d67 feat: add pastBidHelpers and pa…, c4e04de lots-implementation, BidDetailsReportPage.tsx, PeriodPerformancePage.tsx] | lang=en
- "utils_notificationevents": "notificationEvents.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L1 | neighbors=[dbc974b Refactor email template HTML fo…, e61a9d3 feat: add notification system f…, BidDetailPage.tsx, CreateRequestPage.tsx, UnassignedRequestsPage.tsx, NotificationDispatchService.ts] | lang=en
- "utils_surveyspreadgraph": "surveySpreadGraph.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L1 | neighbors=[9b2fddd feat(survey): diagram rooms (ma…, d9e6783 feat(survey): clean 3D overview…, ddf6c96 Merge branch 'feat/survey-knowl…, f510343 feat(survey): interactive sprea…, SurveySystemPage.tsx, index.ts] | lang=en
- "bid_confidentialaccessmodal": "ConfidentialAccessModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ConfidentialAccessModal.tsx:L1 | neighbors=[BidConfidentialButton.tsx, ConfidentialAccessModal(), ConfidentialAccessModalProps, IAccessGroup, IAccessRow, keyOf()] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@3f57ca90a738dad6c546b44b4ff147af468ef309": "3f57ca9 merge: integrate EASI module pages into main" | kind=Commit | source=git | neighbors=[main, bc10d67 feat: add pastBidHelpers and pa…, f06225e feat(survey): Survey Knowledge …, navigation.config.ts, routes.config.ts, sharepoint.config.ts] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-005.json

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
