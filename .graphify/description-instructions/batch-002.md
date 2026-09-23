# Node Description Batch 3 of 43

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

- "models_iuser": "IUser.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L1 | neighbors=[ApprovalTab.tsx, 3a3d0a5 new changes, c4e04de lots-implementation, dbdc03a systemconfig online, f3095f2 feat: add ApprovalTab component…, fe3728a smartbid2.0] | lang=en
- "pages_reportspage": "ReportsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ReportsPage.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, c271ce8 Refactor code structure for imp…, AppLayout.tsx, Sparkline.tsx, Sparkline()] | lang=en
- "stores_usebidstore": "useBidStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L1 | neighbors=[0e653cd more mods, c4e04de lots-implementation, fe3728a smartbid2.0, ImportSourceModal.tsx, useApprovals.ts, useBids.ts] | lang=en
- "utils_bidhelpers": "bidHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L1 | neighbors=[0546310 Add dashboard components and st…, 0e653cd more mods, 3a3d0a5 new changes, c4e04de lots-implementation, fe3728a smartbid2.0, EngHoursRanking.tsx] | lang=en
- "utils_statushelpers": "statusHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L1 | neighbors=[BidTimeline.tsx, OverviewTab.tsx, RevisionsTab.tsx, 0e653cd more mods, fe3728a smartbid2.0, ImportSourceModal.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@f3095f250b5c5b4a885d7e1ed222b1ba484f2a67": "f3095f2 feat: add ApprovalTab component with styling and functionality for mana…" | kind=Commit | source=git | neighbors=[66dbcee feat: Implement contingency cal…, ApprovalTab.tsx, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, CostSearchModal.tsx] | lang=en
- "common_importsourcemodal": "ImportSourceModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceModal.tsx:L1 | neighbors=[BidHoursTable.tsx, ScopeOfSupplyTab.tsx, 3c5c37b more-mods, HoursImportPreview.tsx, HoursImportPreview(), ImportSourceList.tsx] | lang=en
- "common_statusbadge": "StatusBadge.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/StatusBadge.tsx:L1 | neighbors=[BidCard.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, DocumentsTab.tsx, OverviewTab.tsx, 0e653cd more mods] | lang=en
- "dashboard_enghoursranking": "EngHoursRanking.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursRanking.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, EmptyState.tsx, EmptyState(), GlassCard.tsx, GlassCard(), StatusBadge.tsx] | lang=en
- "dashboard_erndashboardsection": "ErnDashboardSection.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnDashboardSection.tsx:L1 | neighbors=[892c1fc feat: add PeoplePicker componen…, ChartTooltip.tsx, ChartTooltip(), EmptyState.tsx, EmptyState(), GlassCard.tsx] | lang=en
- "hooks_usebids": "useBids.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useBids.ts:L1 | neighbors=[c4e04de lots-implementation, fe3728a smartbid2.0, useBids(), index.ts, useBidStore.ts, useBidStore] | lang=en
- "hooks_usecharttheme": "useChartTheme.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L1 | neighbors=[c271ce8 Refactor code structure for imp…, BidsByDivisionChart.tsx, BidsByStatusChart.tsx, DashboardKPIRow.tsx, EngHoursRanking.tsx, ErnDashboardSection.tsx] | lang=en
- "services_requestservice": "RequestService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 3c5c37b more-mods, 4c2e63a update smartbid 2.0, 7d9108e createrequestpage correction, 892c1fc feat: add PeoplePicker componen…] | lang=en
- "stores_usequerycatalogstore": "useQueryCatalogStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L1 | neighbors=[CostSearchModal.tsx, EquipmentImportModal.tsx, 3c5c37b more-mods, b6d954d feat: Enhance AIAnalysisService…, e2285cf cont-implementing, AdvancedCatalogSearch.tsx] | lang=en
- "utils_constants": "constants.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L1 | neighbors=[OverviewTab.tsx, 3a3d0a5 new changes, fe3728a smartbid2.0, PriorityBadge.tsx, useStatusColors.ts, BidDetailPage.tsx] | lang=en
- "bid_bidtimeline": "BidTimeline.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTimeline.tsx:L1 | neighbors=[BidTimeline(), BidTimelineProps, getPhaseTotalHours(), useLiveElapsed(), GlassCard.tsx, GlassCard()] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@dbdc03a61d6c1cc96aee4fef6f9ffb43fc540b5a": "dbdc03a systemconfig online" | kind=Commit | source=git | neighbors=[3a3d0a5 new changes, main, 7d9108e createrequestpage correction, defaultSystemConfig.ts, gulpfile.js, index.ts] | lang=pt
- "common_emptystate": "EmptyState.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EmptyState.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, c271ce8 Refactor code structure for imp…, EmptyState(), EmptyStateProps, DashboardActivity.tsx] | lang=en
- "pages_clarificationsdbpage": "ClarificationsDbPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ClarificationsDbPage.tsx:L1 | neighbors=[8e87d94 feat: Add Links and Recommendat…, AppLayout.tsx, EmptyState.tsx, EmptyState(), PageHeader.tsx, PageHeader()] | lang=en
- "bid_costsearchmodal": "CostSearchModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CostSearchModal.tsx:L1 | neighbors=[AssetsBreakdownTab.tsx, AddQuotationModal.tsx, AddQuotationModal(), CostSearchImportItem, CostSearchModal(), CostSearchModalProps] | lang=en
- "config_status_config": "status.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L1 | neighbors=[0e653cd more mods, 1665b01 more features, c4e04de lots-implementation, fe3728a smartbid2.0, BID_PHASES, BID_STATUSES] | lang=en
- "function_app_document_structure": "document_structure.py" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L1 | neighbors=[b6d954d feat: Enhance AIAnalysisService…, _atomic_blocks(), breadcrumb(), build_chunks(), _has_letters(), _has_word()] | lang=en
- "models_ibidtemplate": "IBidTemplate.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidTemplate.ts:L1 | neighbors=[BidTemplateImport.tsx, 165493f NEW-MODIFIC, 1665b01 more features, 4c2e63a update smartbid 2.0, c4e04de lots-implementation, c58a13c new-implementations] | lang=en
- "models_isystemconfig": "ISystemConfig.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L1 | neighbors=[165493f NEW-MODIFIC, 3c5c37b more-mods, 892c1fc feat: add PeoplePicker componen…, bee3eb5 feat: Enhance bid model with av…, c4e04de lots-implementation, dbdc03a systemconfig online] | lang=en
- "pages_approvalspage": "ApprovalsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ApprovalsPage.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, c4e04de lots-implementation, AppLayout.tsx, GlassCard.tsx, GlassCard()] | lang=en
- "pages_timelinepage": "TimelinePage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L1 | neighbors=[1665b01 more features, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, AppLayout.tsx, CountdownTimer.tsx, CountdownTimer()] | lang=en
- "settings_membersmanagement": "MembersManagement.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L1 | neighbors=[3a3d0a5 new changes, c4e04de lots-implementation, dbdc03a systemconfig online, f3095f2 feat: add ApprovalTab component…, fe3728a smartbid2.0, MembersPage.tsx] | lang=en
- "bid_bidcard": "BidCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidCard.tsx:L1 | neighbors=[BidCard(), BidCardProps, StatusBadge.tsx, StatusBadge(), useCurrentUser.ts, useCurrentUser()] | lang=en
- "bid_revisionstab": "RevisionsTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L1 | neighbors=[BidStatusPhasePanel.tsx, OverviewTab.tsx, canStartRevision(), getActiveRevision(), getCurrentRevisionLetter(), getRevisionLetter()] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@bee3eb5990dff7fbca97757f0147b1748e40c102": "bee3eb5 feat: Enhance bid model with availability splits and engineering details" | kind=Commit | source=git | neighbors=[1665b01 more features, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, BidStatusPhasePanel.tsx, EngineeringHoursSection.tsx] | lang=en
- "models_ibidrequest": "IBidRequest.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidRequest.ts:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 7d9108e createrequestpage correction, f3095f2 feat: add ApprovalTab component…, mockRequests.ts] | lang=en
- "pages_linksrecommendationspage": "LinksRecommendationsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/LinksRecommendationsPage.tsx:L1 | neighbors=[8e87d94 feat: Add Links and Recommendat…, AppLayout.tsx, PageHeader.tsx, PageHeader(), useCurrentUser.ts, useCurrentUser()] | lang=en
- "stores_useuistore": "useUIStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L1 | neighbors=[AddQuotationModal.tsx, ErnCreateModal.tsx, ErnSearchModal.tsx, QualificationsTab.tsx, 1665b01 more features, 4c2e63a update smartbid 2.0] | lang=en
- "utils_exporthelpers": "exportHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, c4e04de lots-implementation, BidDetailPage.tsx, BidDetailsReportPage.tsx, OperationalSummaryPage.tsx, PeriodPerformancePage.tsx] | lang=en
- "utils_phasehelpers": "phaseHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L1 | neighbors=[BidCard.tsx, OverviewTab.tsx, 0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 892c1fc feat: add PeoplePicker componen…] | lang=en
- "bid_documentstab": "DocumentsTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/DocumentsTab.tsx:L1 | neighbors=[DocumentsTab(), DocumentsTabProps, EmptySection.tsx, EmptySection(), GlassCard.tsx, GlassCard()] | lang=en
- "bid_ernsearchmodal": "ErnSearchModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnSearchModal.tsx:L1 | neighbors=[ernNum(), ErnSearchModal(), ErnSearchModalProps, useCurrentUser.ts, useCurrentUser(), index.ts] | lang=en
- "dashboard_dashboardactivity": "DashboardActivity.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, EmptyState.tsx, EmptyState(), GlassCard.tsx, GlassCard(), StatusBadge.tsx] | lang=en
- "hooks_usestatuscolors": "useStatusColors.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useStatusColors.ts:L1 | neighbors=[BidCard.tsx, 0e653cd more mods, c4e04de lots-implementation, DashboardActivity.tsx, EngHoursRanking.tsx, ErnDashboardSection.tsx] | lang=en
- "insights_analyticsfilterbar": "AnalyticsFilterBar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AnalyticsFilterBar.tsx:L1 | neighbors=[c271ce8 Refactor code structure for imp…, useAnalyticsFilters.ts, AnalyticsFilters, DatePreset, AnalyticsFilterBar(), AnalyticsFilterBarProps] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-002.json

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
