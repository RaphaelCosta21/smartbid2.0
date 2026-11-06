# Node Description Batch 15 of 102

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

- "common_segmentedtabs": "SegmentedTabs.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SegmentedTabs.tsx:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, SegmentedTabItem, SegmentedTabs(), SegmentedTabsProps, ComparisonTables.tsx]
- "common_timeline": "Timeline.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/Timeline.tsx:L1 | neighbors=[ApprovalTimeline.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, 79354cb Merge remote-tracking branch 'o…, Timeline()]
- "config_bidtabs_config": "bidTabs.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/bidTabs.config.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 79354cb Merge remote-tracking branch 'o…, f672a54 Refactor code structure for imp…, BID_TAB_GROUP, BID_TAB_GROUPS, BidTab]
- "dashboard_recentactivity": "RecentActivity.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/RecentActivity.tsx:L1 | neighbors=[3a3d0a5 new changes, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, fe3728a smartbid2.0, GlassCard.tsx, GlassCard()]
- "hooks_useaccesslevel_useaccesslevel": "useAccessLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAccessLevel.ts:L27 | neighbors=[RequirePageAccess.tsx, useAccessLevel.ts, CommandPalette.tsx, LivePulse.tsx, Sidebar.tsx, BidDetailPage.tsx]
- "hooks_usedebounce": "useDebounce.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDebounce.ts:L1 | neighbors=[EquipmentImportModal.tsx, fe3728a smartbid2.0, useDebounce(), DocLibraryCatalog.tsx, AssetsCatalogPage.tsx, BidTrackerPage.tsx]
- "hooks_usesupplierservicetypes": "useSupplierServiceTypes.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useSupplierServiceTypes.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 79354cb Merge remote-tracking branch 'o…, ISupplierServiceTypes, useSupplierServiceTypes(), index.ts, useConfigStore.ts]
- "models_iapprovalflow": "IApprovalFlow.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IApprovalFlow.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, mockApprovals.ts, IApprovalFlow, IApprovalFlowChain, IApprovalFlowStep, IBidStatus.ts]
- "models_ibidstatus_bidpriority": "BidPriority" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L82 | neighbors=[kpi.config.ts, IBid.ts, IBidRequest.ts, IBidStatus.ts, index.ts, ISystemConfig.ts]
- "models_ifavoriteitem": "IFavoriteItem.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IFavoriteItem.ts:L1 | neighbors=[165493f NEW-MODIFIC, e2285cf cont-implementing, FavoriteDataSource, IFavoriteBid, IFavoriteEquipment, IFavoriteGroup]
- "models_isupplier": "ISupplier.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISupplier.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 3f57ca9 merge: integrate EASI module pa…, 6d20432 feat: adiciona paginas EASI ao …, 79354cb Merge remote-tracking branch 'o…, index.ts, ISupplier]
- "models_iuser_sector": "Sector" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L1 | neighbors=[ApprovalTab.tsx, bidRoles.config.ts, sectors.config.ts, IBid.ts, IBidApproval.ts, index.ts]
- "pages_easisupplierspage": "EasiSuppliersPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/EasiSuppliersPage.tsx:L1 | neighbors=[3f57ca9 merge: integrate EASI module pa…, 6d20432 feat: adiciona paginas EASI ao …, 8267c28 i18n: translate EASI, suppliers…, ddf6c96 Merge branch 'feat/survey-knowl…, AppLayout.tsx, PageHeader.tsx]
- "services_aianalysisservice_aianalysisservice_ensureconfigured": ".ensureConfigured()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L249 | neighbors=[AIAnalysisService, .analyzeDocument(), .analyzeDocumentForTemplate(), .chat(), .extractDocumentMetadata(), .extractQuotation()]
- "services_assetcatalogservice": "AssetCatalogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AssetCatalogService.ts:L1 | neighbors=[EquipmentImportModal.tsx, 0e653cd more mods, AIDocumentAnalyzer.tsx, AssetsCatalogPage.tsx, IAssetCatalog.ts, IAssetCatalogItem]
- "services_linksrecommendationsservice": "LinksRecommendationsService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L1 | neighbors=[8e87d94 feat: Add Links and Recommendat…, LinksRecommendationsPage.tsx, ILinksRecommendations.ts, IBidLink, IBidRecommendation, ILinksRecommendationsData]
- "services_templateservice_templateservice": "TemplateService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L13 | neighbors=[TemplateService.ts, ._configList(), .create(), .deleteTemplate(), .getAll(), .getById()]
- "stores_usequerycatalogstore_usequerycatalogstore": "useQueryCatalogStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L204 | neighbors=[CostSearchModal.tsx, EquipmentImportModal.tsx, AIDocumentAnalyzer.tsx, QueryCatalogLoadingBanner.tsx, AddFavoriteEquipmentModal.tsx, useQuerySearch.ts]
- "stores_usequotationstore_usequotationstore": "useQuotationStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQuotationStore.ts:L38 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, CostSearchModal.tsx, EquipmentImportModal.tsx, useQuerySearch.ts, BomCostsPage.tsx]
- "stores_usetemplatestore": "useTemplateStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useTemplateStore.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, c4e04de lots-implementation, ImportSourceModal.tsx, useTemplates.ts, IBidTemplate.ts, IBidTemplate]
- "survey3d_trunkflow_trunknetwork": "TrunkNetwork" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/trunkFlow.ts:L33 | neighbors=[createSurveyScene.ts, trunkFlow.ts, .build(), .clear(), .constructor(), .dispose()]
- "template_templatepreview": "TemplatePreview.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplatePreview.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, c4e04de lots-implementation, TemplatesPage.tsx]
- "utils_accesscontrol_canaccessknowledge": "canAccessKnowledge()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L112 | neighbors=[AppLayout.tsx, CommandPalette.tsx, Sidebar.tsx, ClarificationsDbPage.tsx, DatasheetsPage.tsx, LinksRecommendationsPage.tsx]
- "utils_aiclarificationmapper": "aiClarificationMapper.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiClarificationMapper.ts:L1 | neighbors=[QualificationsTab.tsx, 4b576db AI-Integration, BidDetailPage.tsx, IAIAnalysis.ts, IAISuggestedClarification, IBid.ts]
- "utils_analyticshelpers_buildperiodsequence": "buildPeriodSequence()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L120 | neighbors=[analyticsHelpers.ts, approvalImpactTrend(), addPeriod(), periodKey(), periodStart(), completionTimeTrend()]
- "utils_bidhelpers_isactivebid": "isActiveBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L5 | neighbors=[DashboardBidTable.tsx, BidBoardPage.tsx, BidTrackerPage.tsx, DashboardPage.tsx, FlowBoardPage.tsx, MyDashboardPage.tsx]
- "utils_costcalculations_applycontingencytocost": "applyContingencyToCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L127 | neighbors=[AssetsBreakdownTab.tsx, rows.ts, costCalculations.ts, getAgeContingencyPct(), getAssetCostBreakdown(), getSplitNode()]
- "utils_divisionhelpers_getbidservicelines": "getBidServiceLines()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L114 | neighbors=[OverviewTab.tsx, useAnalyticsFilters.ts, useDashboardFilters.ts, BidDetailPage.tsx, UnassignedRequestsPage.tsx, useBidStore.ts]
- "utils_facethelpers_countfacets": "countFacets()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/facetHelpers.ts:L12 | neighbors=[DashboardBidTable.tsx, useAnalyticsFilters.ts, useDashboardFilters.ts, BidTrackerPage.tsx, FavoritesPage.tsx, PastBidsPage.tsx]
- "utils_facethelpers_withcounts": "withCounts()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/facetHelpers.ts:L37 | neighbors=[DashboardBidTable.tsx, DashboardFilterBar.tsx, AnalyticsFilterBar.tsx, BidTrackerPage.tsx, DashboardPage.tsx, FavoritesPage.tsx]
- "utils_formatters_formatdaysleft": "formatDaysLeft()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L94 | neighbors=[BidCard.tsx, CountdownTimer.tsx, BidBoardPage.tsx, BidDetailPage.tsx, FlowBoardPage.tsx, MyDashboardPage.tsx]
- "utils_pastbidhelpers_normalizetext": "normalizeText()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L76 | neighbors=[ExportClarificationModal.tsx, useClarificationLibraryFilter.ts, useQualificationLibraryFilter.ts, SuppliersRegistry.tsx, clarificationChatIntent.ts, pastBidHelpers.ts]
- "approval_approvalmatrix": "ApprovalMatrix.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalMatrix.tsx:L1 | neighbors=[ApprovalMatrix(), ApprovalMatrixProps, IBidApproval.ts, IApprovalChain, 0546310 Add dashboard components and st…, 3a3d0a5 new changes]
- "bid_bidapprovalpanel": "BidApprovalPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidApprovalPanel.tsx:L1 | neighbors=[BidApprovalPanel(), BidApprovalPanelProps, index.ts, formatters.ts, formatDate(), 0546310 Add dashboard components and st…]
- "bid_bidtaskchecklist": "BidTaskChecklist.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTaskChecklist.tsx:L1 | neighbors=[BidStatusPhasePanel.tsx, BidTaskChecklist(), BidTaskChecklistProps, index.ts, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0]
- "bid_clarificationsuggestionsmodal": "ClarificationSuggestionsModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ClarificationSuggestionsModal.tsx:L1 | neighbors=[ClarificationSuggestionsModal(), ClarificationSuggestionsModalProps, index.ts, QualificationsTab.tsx, 4b576db AI-Integration, 79354cb Merge remote-tracking branch 'o…]
- "bid_qualificationgrouplist": "QualificationGroupList.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationGroupList.tsx:L1 | neighbors=[ImportQualificationModal.tsx, IQualificationPickGroup, IQualificationPickRow, QualificationGroupList(), QualificationGroupListProps, ClarificationBadges.tsx]
- "bid_quotationstatuschip": "QuotationStatusChip.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QuotationStatusChip.tsx:L1 | neighbors=[LinkedQuotationsPanel.tsx, QuotationControlPanel.tsx, QuotationStatusChip(), QuotationStatusChipProps, index.ts, quotationLinks.ts]
- "bidexcelexport_excelstyles_xlsheet_noticestrip": ".noticeStrip()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L379 | neighbors=[XlSheet, .banner(), thin(), .estimateHeight(), .fillRange(), .font()]
- "bidexcelexport_excelstyles_xlsheet_setvalue": ".setValue()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L319 | neighbors=[XlSheet, .band(), .banner(), .keyValue(), .note(), .noticeStrip()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-014.json

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
