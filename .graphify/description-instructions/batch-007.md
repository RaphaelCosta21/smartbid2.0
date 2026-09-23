# Node Description Batch 8 of 43

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

- "insights_segmentedcontrol_segmentedcontrol": "SegmentedControl()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/SegmentedControl.tsx:L24 | neighbors=[DashboardActivity.tsx, EngHoursRanking.tsx, AnalyticsFilterBar.tsx, SegmentedControl.tsx, BottleneckAnalysisPage.tsx, PerformanceTrendsPage.tsx]
- "insights_segmentedcontrol_segmentoption": "SegmentOption" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/SegmentedControl.tsx:L4 | neighbors=[DashboardActivity.tsx, EngHoursRanking.tsx, AnalyticsFilterBar.tsx, SegmentedControl.tsx, BottleneckAnalysisPage.tsx, PerformanceTrendsPage.tsx]
- "models_ibidexport": "IBidExport.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidExport.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, useExport.ts, IExportColumn, IExportOptions, IExportResult, IExportTab]
- "models_iclarificationdb": "IClarificationDb.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IClarificationDb.ts:L1 | neighbors=[BidStatusPhasePanel.tsx, ImportClarificationModal.tsx, 8e87d94 feat: Add Links and Recommendat…, ClarificationBaseType, IClarificationDbItem, index.ts]
- "models_idoclibraryitem": "IDocLibraryItem.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDocLibraryItem.ts:L1 | neighbors=[8e87d94 feat: Add Links and Recommendat…, de36cf5 feat: add SmartBid Docs indexer…, DocLibraryCatalog.tsx, DocCatalogType, IDocLibraryItem, IDocLibraryMetadata]
- "models_iuser_sector": "Sector" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L1 | neighbors=[ApprovalTab.tsx, sectors.config.ts, IBid.ts, IBidApproval.ts, index.ts, ITeamMember.ts]
- "pages_patchnotespage": "PatchNotesPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PatchNotesPage.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, AppLayout.tsx, PageHeader.tsx, PageHeader(), PatchNotesPage()]
- "services_activitylogservice": "ActivityLogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ActivityLogService.ts:L1 | neighbors=[AddQuotationModal.tsx, 4c2e63a update smartbid 2.0, dbdc03a systemconfig online, IActivityLog.ts, IActivityLogEntry, ActivityLogService]
- "services_aianalysisservice_aianalysisservice_postjson": ".postJson()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L342 | neighbors=[AIAnalysisService, .analyzeDocument(), .analyzeDocumentForTemplate(), .chat(), .extractDocumentMetadata(), .extractQuotation()]
- "services_bomcostanalysisservice": "BomCostAnalysisService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BomCostAnalysisService.ts:L1 | neighbors=[CostSearchModal.tsx, EquipmentImportModal.tsx, e2285cf cont-implementing, BomCostsPage.tsx, index.ts, BomCostAnalysisService]
- "services_bomcostanalysisservice_bomcostanalysisservice": "BomCostAnalysisService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BomCostAnalysisService.ts:L13 | neighbors=[CostSearchModal.tsx, EquipmentImportModal.tsx, BomCostsPage.tsx, BomCostAnalysisService.ts, .deleteOne(), .getAll()]
- "services_currencyservice": "CurrencyService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L1 | neighbors=[OverviewTab.tsx, bee3eb5 feat: Enhance bid model with av…, BCB_CURRENCY_TYPES, CurrencyService, IBCBCurrencyResponse, IBCBDollarResponse]
- "services_currencyservice_currencyservice": "CurrencyService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L56 | neighbors=[OverviewTab.tsx, CurrencyService.ts, .formatDateForBCB(), .getCurrencyRate(), .getRates(), .getRatesWithFallback()]
- "services_exportservice_exportservice": "ExportService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ExportService.ts:L10 | neighbors=[useExport.ts, BidDetailsReportPage.tsx, OperationalSummaryPage.tsx, PeriodPerformancePage.tsx, ExportService.ts, .exportToExcel()]
- "services_favoritesservice": "FavoritesService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L1 | neighbors=[e2285cf cont-implementing, index.ts, EMPTY_DATA, FavoritesService, SPService.ts, SPService]
- "services_userservice": "UserService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/UserService.ts:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, dbdc03a systemconfig online, AppLayout.tsx, index.ts, SPService.ts]
- "stores_useauthstore_useauthstore": "useAuthStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useAuthStore.ts:L34 | neighbors=[useAccessLevel.ts, useCurrentUser.ts, AppLayout.tsx, CommandPalette.tsx, Header.tsx, Sidebar.tsx]
- "stores_usefavoritesstore_usefavoritesstore": "useFavoritesStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useFavoritesStore.ts:L67 | neighbors=[EquipmentImportModal.tsx, ScopeOfSupplyTab.tsx, AIDocumentAnalyzer.tsx, QueryCatalogLoadingBanner.tsx, useQuerySearch.ts, FavoritesPage.tsx]
- "template_templatepreview": "TemplatePreview.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplatePreview.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, c4e04de lots-implementation, TemplatesPage.tsx, IBidTemplate.ts, IBidTemplate]
- "utils_businessdays": "businessDays.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/businessDays.ts:L1 | neighbors=[3a3d0a5 new changes, CreateRequestPage.tsx, IBidStatus.ts, BidPriority, calculatePriority(), countBusinessDays()]
- "utils_constants_priority_colors": "PRIORITY_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L8 | neighbors=[OverviewTab.tsx, PriorityBadge.tsx, useStatusColors.ts, BidDetailPage.tsx, CreateRequestPage.tsx, UnassignedRequestsPage.tsx]
- "approval_approvalmatrix": "ApprovalMatrix.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalMatrix.tsx:L1 | neighbors=[ApprovalMatrix(), ApprovalMatrixProps, IBidApproval.ts, IApprovalChain, 0546310 Add dashboard components and st…, 3a3d0a5 new changes]
- "bid_bidtaskchecklist": "BidTaskChecklist.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTaskChecklist.tsx:L1 | neighbors=[BidStatusPhasePanel.tsx, BidTaskChecklist(), BidTaskChecklistProps, index.ts, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0]
- "bid_bidtemplateimport": "BidTemplateImport.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTemplateImport.tsx:L1 | neighbors=[BidTemplateImport(), BidTemplateImportProps, IBidTemplate.ts, IBidTemplate, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0]
- "charts_heatmapgrid": "HeatmapGrid.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/HeatmapGrid.tsx:L1 | neighbors=[heatColor(), HeatmapColumn, HeatmapGrid(), HeatmapGridProps, hexToRgb(), c271ce8 Refactor code structure for imp…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@401be0c3f22475e7c4c87b2bad5ff6affb4b176e": "401be0c Add EntraTokenTest component for Azure API diagnostics" | kind=Commit | source=git | neighbors=[main, 9e27edd feat: Update AI integration and…, function_app.py, TemplatesPage.tsx, AIAnalysisService.ts, SystemConfiguration.tsx]
- "common_collapsiblesidebar": "CollapsibleSidebar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/CollapsibleSidebar.tsx:L1 | neighbors=[b6d954d feat: Enhance AIAnalysisService…, CollapsibleSidebar(), ICollapsibleSidebarProps, BidDetailPage.tsx, FavoritesPage.tsx, QuotationsPage.tsx]
- "common_importsourcelist": "ImportSourceList.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceList.tsx:L1 | neighbors=[3c5c37b more-mods, IImportSource, ImportSourceList(), ImportSourceListProps, useConfigStore.ts, useConfigStore]
- "common_photolightbox": "PhotoLightbox.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PhotoLightbox.tsx:L1 | neighbors=[EquipmentImportModal.tsx, e2285cf cont-implementing, AdvancedCatalogSearch.tsx, PhotoLightbox(), PhotoLightboxProps, FavoritesPage.tsx]
- "common_prioritybadge": "PriorityBadge.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PriorityBadge.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PriorityBadge(), PriorityBadgeProps, constants.ts]
- "common_progressbar": "ProgressBar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ProgressBar.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ProgressBar(), ProgressBarProps, BottleneckAnalysisPage.tsx, TeamAnalyticsPage.tsx]
- "common_querycatalogloadingbanner": "QueryCatalogLoadingBanner.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/QueryCatalogLoadingBanner.tsx:L1 | neighbors=[b6d954d feat: Enhance AIAnalysisService…, QueryCatalogLoadingBanner(), useFavoritesStore.ts, useFavoritesStore, useQueryCatalogStore.ts, useQueryCatalogStore]
- "common_toastcontainer": "ToastContainer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ToastContainer.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, b6d954d feat: Enhance AIAnalysisService…, Toast, ToastContainer(), ToastContainerProps]
- "dashboard_approvalspending": "ApprovalsPending.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ApprovalsPending.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, GlassCard.tsx, GlassCard(), ApprovalsPending(), ApprovalsPendingProps]
- "hooks_useaccesslevel": "useAccessLevel.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAccessLevel.ts:L1 | neighbors=[fe3728a smartbid2.0, useAccessLevel(), useAuthStore.ts, useAuthStore, ApprovalsPage.tsx, BidDetailPage.tsx]
- "hooks_useanalyticsfilters_useanalyticsfilters": "UseAnalyticsFilters" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L64 | neighbors=[useAnalyticsFilters.ts, BottleneckAnalysisPage.tsx, FollowUpPage.tsx, OperationalSummaryPage.tsx, PerformanceTrendsPage.tsx, PeriodPerformancePage.tsx]
- "hooks_useapprovals": "useApprovals.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useApprovals.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, ApprovalSummary, useApprovals(), index.ts, useBidStore.ts, useBidStore]
- "hooks_usedebounce_usedebounce": "useDebounce()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDebounce.ts:L7 | neighbors=[ImportClarificationModal.tsx, useDebounce.ts, DocLibraryCatalog.tsx, AssetsCatalogPage.tsx, BidTrackerPage.tsx, ClarificationsDbPage.tsx]
- "insights_analyticsfilterbar_analyticsfilterbar": "AnalyticsFilterBar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AnalyticsFilterBar.tsx:L51 | neighbors=[AnalyticsFilterBar.tsx, BottleneckAnalysisPage.tsx, FollowUpPage.tsx, OperationalSummaryPage.tsx, PerformanceTrendsPage.tsx, PeriodPerformancePage.tsx]
- "models_ibidcomment": "IBidComment.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidComment.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidCommentDef, IBidStatus.ts, BidPhase, IUser.ts, IPersonRef]

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
