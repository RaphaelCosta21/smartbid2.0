# Node Description Batch 1 of 43

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

- "models_index": "index.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/index.ts:L1 | neighbors=[ApprovalBadge.tsx, AddQuotationModal.tsx, AITab.tsx, AssetsBreakdownTab.tsx, BidActivityLog.tsx, BidApprovalPanel.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@4c2e63a209bc74e09a269af9771d8fbba5c3fcd2": "4c2e63a update smartbid 2.0" | kind=Commit | source=git | neighbors=[ApprovalBadge.tsx, ApprovalDecisionPanel.tsx, ApprovalMatrix.tsx, ApprovalRequestCard.tsx, ApprovalTimeline.tsx, BidActivityLog.tsx] | lang=pt
- "layout_applayout": "AppLayout.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/AppLayout.tsx:L1 | neighbors=[0e653cd more mods, 165493f NEW-MODIFIC, 1665b01 more features, 4c2e63a update smartbid 2.0, 7d9108e createrequestpage correction, 8e87d94 feat: Add Links and Recommendat…] | lang=en
- "pages_biddetailpage": "BidDetailPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L1 | neighbors=[0e653cd more mods, 1665b01 more features, 3a3d0a5 new changes, 3c5c37b more-mods, 4b576db AI-Integration, 4c2e63a update smartbid 2.0] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@3a3d0a5d06eaffd66b8e5360c85be9a7e9b711ef": "3a3d0a5 new changes" | kind=Commit | source=git | neighbors=[ApprovalBadge.tsx, ApprovalDecisionPanel.tsx, ApprovalMatrix.tsx, ApprovalRequestCard.tsx, ApprovalTimeline.tsx, BidActivityLog.tsx] | lang=pt
- "models_ibid": "IBid.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L1 | neighbors=[ApprovalTab.tsx, 0e653cd more mods, 165493f NEW-MODIFIC, 1665b01 more features, 3c5c37b more-mods, 7ccad33 Refactor code structure and rem…] | lang=en
- "bid_overviewtab": "OverviewTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L1 | neighbors=[EmptySection.tsx, EmptySection(), ErnCreateModal.tsx, ErnCreateModal(), ErnDetailsModal.tsx, ErnDetailsModal()] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@c4e04de8478ec3952899ef072851104649baa184": "c4e04de lots-implementation" | kind=Commit | source=git | neighbors=[7d9108e createrequestpage correction, AssetsBreakdownTab.tsx, BidActivityLog.tsx, BidApprovalPanel.tsx, BidCard.tsx, BidComments.tsx] | lang=nl
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@fe3728a018509e50c238ca44fea9585365ec420b": "fe3728a smartbid2.0" | kind=Commit | source=git | neighbors=[BidCard.tsx, BidPhaseProgress.tsx, BidStatusDropdown.tsx, main, 4c2e63a update smartbid 2.0, GlassCard.tsx] | lang=pt
- "pages_periodperformancepage": "PeriodPerformancePage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PeriodPerformancePage.tsx:L1 | neighbors=[c271ce8 Refactor code structure for imp…, AppLayout.tsx, ChartTooltip.tsx, ChartTooltip(), Sparkline.tsx, Sparkline()] | lang=en
- "utils_analyticshelpers": "analyticsHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L1 | neighbors=[892c1fc feat: add PeoplePicker componen…, c271ce8 Refactor code structure for imp…, AnalyticsPage.tsx, BottleneckAnalysisPage.tsx, FollowUpPage.tsx, OperationalSummaryPage.tsx] | lang=en
- "pages_bottleneckanalysispage": "BottleneckAnalysisPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L1 | neighbors=[c271ce8 Refactor code structure for imp…, AppLayout.tsx, ChartTooltip.tsx, ChartTooltip(), HeatmapGrid.tsx, HeatmapGrid()] | lang=en
- "pages_createrequestpage": "CreateRequestPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/CreateRequestPage.tsx:L1 | neighbors=[0e653cd more mods, 1665b01 more features, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 7d9108e createrequestpage correction, c4e04de lots-implementation] | lang=en
- "stores_useconfigstore": "useConfigStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useConfigStore.ts:L1 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidHoursTable.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, CostSearchModal.tsx] | lang=en
- "pages_dashboardpage": "DashboardPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/DashboardPage.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 0e653cd more mods, 4c2e63a update smartbid 2.0, 892c1fc feat: add PeoplePicker componen…, c4e04de lots-implementation, fe3728a smartbid2.0] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@0e653cd1112bcfa71621ebd9aa14b7d571667c54": "0e653cd more mods" | kind=Commit | source=git | neighbors=[BidCard.tsx, BidPhaseProgress.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx] | lang=en
- "knowledge_doclibrarycatalog": "DocLibraryCatalog.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L1 | neighbors=[8e87d94 feat: Add Links and Recommendat…, de36cf5 feat: add SmartBid Docs indexer…, EmptyState.tsx, EmptyState(), PageHeader.tsx, PageHeader()] | lang=en
- "settings_systemconfiguration": "SystemConfiguration.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L1 | neighbors=[0e653cd more mods, 165493f NEW-MODIFIC, 1c19dcd Update API diagnostics and AI c…, 3a3d0a5 new changes, 3c5c37b more-mods, 401be0c Add EntraTokenTest component fo…] | lang=en
- "utils_formatters": "formatters.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L1 | neighbors=[AddQuotationModal.tsx, ApprovalTab.tsx, BidActivityLog.tsx, BidApprovalPanel.tsx, BidComments.tsx, BidCostSummary.tsx] | lang=en
- "stores_useconfigstore_useconfigstore": "useConfigStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useConfigStore.ts:L19 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidHoursTable.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, CostSearchModal.tsx] | lang=en
- "pages_bomcostspage": "BomCostsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L1 | neighbors=[165493f NEW-MODIFIC, e2285cf cont-implementing, AppLayout.tsx, PageHeader.tsx, PageHeader(), useCurrentUser.ts] | lang=en
- "pages_performancetrendspage": "PerformanceTrendsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PerformanceTrendsPage.tsx:L1 | neighbors=[892c1fc feat: add PeoplePicker componen…, c271ce8 Refactor code structure for imp…, AppLayout.tsx, ChartTooltip.tsx, ChartTooltip(), Sparkline.tsx] | lang=en
- "pages_teamanalyticspage": "TeamAnalyticsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L1 | neighbors=[892c1fc feat: add PeoplePicker componen…, c271ce8 Refactor code structure for imp…, AppLayout.tsx, ChartTooltip.tsx, ChartTooltip(), EmptyState.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@c58a13c5a45bb31d2f0775d0d9fe0fb925ca73c8": "c58a13c new-implementations" | kind=Commit | source=git | neighbors=[0e653cd more mods, AITab.tsx, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, BidPhaseProgress.tsx] | lang=pt
- "pages_bidtrackerpage": "BidTrackerPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 892c1fc feat: add PeoplePicker componen…, c4e04de lots-implementation, fe3728a smartbid2.0] | lang=en
- "pages_unassignedrequestspage": "UnassignedRequestsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 892c1fc feat: add PeoplePicker componen…, bee3eb5 feat: Enhance bid model with av…, c4e04de lots-implementation] | lang=en
- "bid_scopeofsupplytab": "ScopeOfSupplyTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L1 | neighbors=[EquipmentImportModal.tsx, EquipmentImportModal(), IImportPick, blankItem(), blankSection(), blankSubItem()] | lang=en
- "pages_biddetailsreportpage": "BidDetailsReportPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailsReportPage.tsx:L1 | neighbors=[c271ce8 Refactor code structure for imp…, AppLayout.tsx, ChartTooltip.tsx, ChartTooltip(), DataTable.tsx, DataTable()] | lang=en
- "pages_operationalsummarypage": "OperationalSummaryPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/OperationalSummaryPage.tsx:L1 | neighbors=[c271ce8 Refactor code structure for imp…, AppLayout.tsx, ChartTooltip.tsx, ChartTooltip(), EmptyState.tsx, EmptyState()] | lang=en
- "pages_favoritespage": "FavoritesPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L1 | neighbors=[165493f NEW-MODIFIC, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, b6d954d feat: Enhance AIAnalysisService…, e2285cf cont-implementing, AppLayout.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@e2285cf0f6b38404d3c8e0a7d9540ca75ce87eef": "e2285cf cont-implementing" | kind=Commit | source=git | neighbors=[c58a13c new-implementations, AITab.tsx, AssetsBreakdownTab.tsx, CostSearchModal.tsx, ScopeOfSupplyTab.tsx, main] | lang=en
- "pages_followuppage": "FollowUpPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FollowUpPage.tsx:L1 | neighbors=[8e87d94 feat: Add Links and Recommendat…, c271ce8 Refactor code structure for imp…, AppLayout.tsx, ChartTooltip.tsx, ChartTooltip(), Sparkline.tsx] | lang=en
- "pages_quotationspage": "QuotationsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QuotationsPage.tsx:L1 | neighbors=[165493f NEW-MODIFIC, 3a3d0a5 new changes, 4b576db AI-Integration, 4c2e63a update smartbid 2.0, 9e27edd feat: Update AI integration and…, b6d954d feat: Enhance AIAnalysisService…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@1665b013e0762d44a00ade781a237f7294b2a04d": "1665b01 more features" | kind=Commit | source=git | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx] | lang=en
- "pages_analyticspage": "AnalyticsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AnalyticsPage.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, c271ce8 Refactor code structure for imp…, AppLayout.tsx, ChartTooltip.tsx] | lang=en
- "bid_addquotationmodal": "AddQuotationModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L1 | neighbors=[AddQuotationModal(), AddQuotationModalProps, blankLineItem(), genId(), ILineItem, useCurrentUser.ts] | lang=en
- "bid_assetsbreakdowntab": "AssetsBreakdownTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L1 | neighbors=[AddQuotationModal.tsx, AddQuotationModal(), applyContingency(), AssetsBreakdownTab(), AssetsBreakdownTabProps, blankAsset()] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@c271ce8a5e2e16b7fde8479bb93b9b565042e7f6": "c271ce8 Refactor code structure for improved readability and maintainability" | kind=Commit | source=git | neighbors=[7ccad33 Refactor code structure and rem…, ApprovalTab.tsx, main, ChartTooltip.tsx, HeatmapGrid.tsx, Sparkline.tsx] | lang=en
- "services_aianalysisservice": "AIAnalysisService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L1 | neighbors=[AddQuotationModal.tsx, QualificationsTab.tsx, 401be0c Add EntraTokenTest component fo…, 4b576db AI-Integration, 961eb93 feat: Update AI integration and…, 9e27edd feat: Update AI integration and…] | lang=en
- "bid_qualificationstab": "QualificationsTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationsTab.tsx:L1 | neighbors=[ClarificationSuggestionsModal.tsx, ClarificationSuggestionsModal(), EmptySection.tsx, EmptySection(), ExportClarificationModal.tsx, ExportClarificationModal()] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-000.json

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
