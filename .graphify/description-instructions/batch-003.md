# Node Description Batch 4 of 43

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

- "pages_flowboardpage": "FlowBoardPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FlowBoardPage.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, c4e04de lots-implementation, AppLayout.tsx, PageHeader.tsx]
- "pages_mydashboardpage": "MyDashboardPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/MyDashboardPage.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, c4e04de lots-implementation, GlassCard.tsx, GlassCard(), PageHeader.tsx]
- "pages_toolingreportpage": "ToolingReportPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ToolingReportPage.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, AppLayout.tsx, DataTable.tsx, DataTable(), DivisionBadge.tsx]
- "services_quotationservice_quotationservice": "QuotationService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L22 | neighbors=[AddQuotationModal.tsx, BomCostsPage.tsx, QuotationsPage.tsx, QuotationService.ts, .addItems(), .deleteItem()]
- "bid_certificationsbreakdowntab": "CertificationsBreakdownTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CertificationsBreakdownTab.tsx:L1 | neighbors=[blankItem(), blankSection(), CertificationsBreakdownTab(), CertificationsBreakdownTabProps, SECTION_COLORS, index.ts]
- "bid_preparationmobilizationtab": "PreparationMobilizationTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L1 | neighbors=[blankConsumable(), blankMob(), blankRTS(), MOB_TYPES, PreparationMobilizationTab(), PreparationMobilizationTabProps]
- "common_emptystate_emptystate": "EmptyState()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EmptyState.tsx:L14 | neighbors=[EmptyState.tsx, DashboardActivity.tsx, EngHoursRanking.tsx, ErnDashboardSection.tsx, DocLibraryCatalog.tsx, AnalyticsPage.tsx]
- "common_statusbadge_statusbadge": "StatusBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/StatusBadge.tsx:L12 | neighbors=[BidCard.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, DocumentsTab.tsx, OverviewTab.tsx, StatusBadge.tsx]
- "hooks_usebids_usebids": "useBids()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useBids.ts:L9 | neighbors=[useBids.ts, AnalyticsPage.tsx, BidBoardPage.tsx, BidDetailsReportPage.tsx, BidResultsPage.tsx, BidTrackerPage.tsx]
- "layout_header": "Header.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Header.tsx:L1 | neighbors=[1665b01 more features, 4c2e63a update smartbid 2.0, fe3728a smartbid2.0, AppLayout.tsx, SpfxContext.ts, useSpfxContext()]
- "services_bidservice": "BidService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, 7d9108e createrequestpage correction, c4e04de lots-implementation, de36cf5 feat: add SmartBid Docs indexer…, AppLayout.tsx, BidDetailPage.tsx]
- "utils_approvalhelpers": "approvalHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L1 | neighbors=[ApprovalTab.tsx, c271ce8 Refactor code structure for imp…, BidDetailsReportPage.tsx, BottleneckAnalysisPage.tsx, OperationalSummaryPage.tsx, index.ts]
- "bid_notestab": "NotesTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/NotesTab.tsx:L1 | neighbors=[BidComments.tsx, BidComments(), EmptySection.tsx, EmptySection(), NotesTab(), NotesTabProps]
- "models_ibidapproval": "IBidApproval.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidApproval.ts:L1 | neighbors=[ApprovalMatrix.tsx, ApprovalRequestCard.tsx, ApprovalTimeline.tsx, ApprovalTab.tsx, 4c2e63a update smartbid 2.0, f3095f2 feat: add ApprovalTab component…]
- "stores_useauthstore": "useAuthStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useAuthStore.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, dbdc03a systemconfig online, fe3728a smartbid2.0, useAccessLevel.ts, useCurrentUser.ts, AppLayout.tsx]
- "bid_engineeringhourssection": "EngineeringHoursSection.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EngineeringHoursSection.tsx:L1 | neighbors=[BidHoursTable.tsx, EditItemModalState, EngineeringHoursSection(), EngineeringHoursSectionProps, INITIAL_MODAL, index.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@7d9108e4a151adaca085cf599f56201ea3cd5565": "7d9108e createrequestpage correction" | kind=Commit | source=git | neighbors=[main, c4e04de lots-implementation, defaultSystemConfig.ts, mockRequests.ts, AppLayout.tsx, IBid.ts]
- "hooks_useanalyticsfilters": "useAnalyticsFilters.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L1 | neighbors=[c271ce8 Refactor code structure for imp…, AnalyticsFilters, DatePreset, DEFAULT, isoDaysAgo(), presetRange()]
- "pages_assetscatalogpage": "AssetsCatalogPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L1 | neighbors=[0e653cd more mods, AppLayout.tsx, EmptyState.tsx, EmptyState(), PageHeader.tsx, PageHeader()]
- "pages_bidboardpage": "BidBoardPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidBoardPage.tsx:L1 | neighbors=[0e653cd more mods, c4e04de lots-implementation, PageHeader.tsx, PageHeader(), StatusBadge.tsx, StatusBadge()]
- "services_aiauthservice_aiauthservice": "AiAuthService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L57 | neighbors=[SmartBid20.tsx, AIAnalysisService.ts, AiAuthService.ts, .acquireInteractive(), .clearTokenCache(), .getAccessToken()]
- "stores_usequotationstore": "useQuotationStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQuotationStore.ts:L1 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, CostSearchModal.tsx, EquipmentImportModal.tsx, 165493f NEW-MODIFIC, de36cf5 feat: add SmartBid Docs indexer…]
- "typings_pnp_sp_d": "pnp-sp.d.ts" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L1 | neighbors=[0e653cd more mods, 4c2e63a update smartbid 2.0, dbdc03a systemconfig online, @pnp/sp, SPCurrentUser, SPFI]
- "utils_ernlink": "ernLink.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernLink.ts:L1 | neighbors=[ErnCreateModal.tsx, ErnSearchModal.tsx, 892c1fc feat: add PeoplePicker componen…, d23a43b feat: enhance ERN management wi…, index.ts, BidService.ts]
- "utils_formatters_formatdate": "formatDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L27 | neighbors=[ApprovalTab.tsx, BidApprovalPanel.tsx, ErnDetailsModal.tsx, ErnSearchModal.tsx, OverviewTab.tsx, BidDetailPage.tsx]
- "charts_charttooltip": "ChartTooltip.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/ChartTooltip.tsx:L1 | neighbors=[ChartTooltip(), ChartTooltipEntry, ChartTooltipProps, c271ce8 Refactor code structure for imp…, BidsByDivisionChart.tsx, BidsByStatusChart.tsx]
- "common_kpicard": "KPICard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/KPICard.tsx:L1 | neighbors=[c271ce8 Refactor code structure for imp…, fe3728a smartbid2.0, KPICard(), KPICardProps, DashboardKPIRow.tsx, ErnDashboardSection.tsx]
- "hooks_usecharttheme_usecharttheme": "useChartTheme()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L95 | neighbors=[BidsByDivisionChart.tsx, BidsByStatusChart.tsx, DashboardKPIRow.tsx, EngHoursRanking.tsx, ErnDashboardSection.tsx, useChartTheme.ts]
- "hooks_useeditcontrol": "useEditControl.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useEditControl.ts:L1 | neighbors=[OverviewTab.tsx, QualificationsTab.tsx, c58a13c new-implementations, EditLockBanner.tsx, useCurrentUser.ts, useCurrentUser()]
- "models_iteammember": "ITeamMember.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ITeamMember.ts:L1 | neighbors=[ApprovalTab.tsx, 1665b01 more features, 3a3d0a5 new changes, dbdc03a systemconfig online, fe3728a smartbid2.0, index.ts]
- "services_exportservice": "ExportService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ExportService.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, c271ce8 Refactor code structure for imp…, useExport.ts, BidDetailsReportPage.tsx, OperationalSummaryPage.tsx, PeriodPerformancePage.tsx]
- "services_membersservice": "MembersService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L1 | neighbors=[OverviewTab.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, dbdc03a systemconfig online, useTeamMembers.ts, AppLayout.tsx]
- "services_membersservice_membersservice": "MembersService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L9 | neighbors=[OverviewTab.tsx, useTeamMembers.ts, AppLayout.tsx, Header.tsx, BidDetailPage.tsx, CreateRequestPage.tsx]
- "stores_usefavoritesstore": "useFavoritesStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useFavoritesStore.ts:L1 | neighbors=[EquipmentImportModal.tsx, ScopeOfSupplyTab.tsx, 165493f NEW-MODIFIC, e2285cf cont-implementing, AIDocumentAnalyzer.tsx, QueryCatalogLoadingBanner.tsx]
- "bid_importclarificationmodal": "ImportClarificationModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ImportClarificationModal.tsx:L1 | neighbors=[ImportClarificationModal(), ImportClarificationModalProps, toClarificationItem(), useDebounce.ts, useDebounce(), IClarificationDb.ts]
- "common_chatassistant": "ChatAssistant.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ChatAssistant.tsx:L1 | neighbors=[de36cf5 feat: add SmartBid Docs indexer…, ChatAssistant(), ChatBubble(), EXAMPLE_QUESTIONS, IBubbleProps, useCurrentUser.ts]
- "config_ai_config": "ai.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L1 | neighbors=[1c19dcd Update API diagnostics and AI c…, 4b576db AI-Integration, 961eb93 feat: Update AI integration and…, 9e27edd feat: Update AI integration and…, b6d954d feat: Enhance AIAnalysisService…, c6ce977 Add Azure AI Backend for SmartB…]
- "config_ai_prompts": "ai.prompts.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L1 | neighbors=[4b576db AI-Integration, 961eb93 feat: Update AI integration and…, b6d954d feat: Enhance AIAnalysisService…, c6ce977 Add Azure AI Backend for SmartB…, de36cf5 feat: add SmartBid Docs indexer…, buildClarificationSuggestionPrompt()]
- "services_approvalservice": "ApprovalService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L1 | neighbors=[ApprovalTab.tsx, 1a40896 feat: add SmartBid 2.0 Executiv…, 4c2e63a update smartbid 2.0, f3095f2 feat: add ApprovalTab component…, IBid.ts, IBid]
- "services_ernservice_ernservice": "ErnService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L14 | neighbors=[ErnCreateModal.tsx, ErnDetailsModal.tsx, ErnSearchModal.tsx, useErn.ts, ErnService.ts, .create()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-003.json

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
