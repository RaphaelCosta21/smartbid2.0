# Node Description Batch 6 of 43

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

- "config_navigation_config": "navigation.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/navigation.config.ts:L1 | neighbors=[0e653cd more mods, 3c5c37b more-mods, 8e87d94 feat: Add Links and Recommendat…, c4e04de lots-implementation, de36cf5 feat: add SmartBid Docs indexer…, e2285cf cont-implementing]
- "config_sectors_config": "sectors.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L1 | neighbors=[c271ce8 Refactor code structure for imp…, BY_LABEL, BY_VALUE, getSectorColor(), getSectorDef(), getSectorLabel()]
- "insights_segmentedcontrol": "SegmentedControl.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/SegmentedControl.tsx:L1 | neighbors=[c271ce8 Refactor code structure for imp…, DashboardActivity.tsx, EngHoursRanking.tsx, AnalyticsFilterBar.tsx, SegmentedControl(), SegmentedControlProps]
- "models_iaichat": "IAiChat.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAiChat.ts:L1 | neighbors=[b6d954d feat: Enhance AIAnalysisService…, de36cf5 feat: add SmartBid Docs indexer…, ChatAssistant.tsx, ChatRole, IChatAnswer, IChatCitation]
- "services_attachmentservice_attachmentservice": "AttachmentService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L9 | neighbors=[CertificationsBreakdownTab.tsx, ScopeOfSupplyTab.tsx, CreateRequestPage.tsx, AttachmentService.ts, .deleteFile(), .getFilesInFolder()]
- "services_doclibrarycatalogservice": "DocLibraryCatalogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L1 | neighbors=[8e87d94 feat: Add Links and Recommendat…, de36cf5 feat: add SmartBid Docs indexer…, DocLibraryCatalog.tsx, IDocLibraryItem.ts, DocCatalogType, IDocLibraryItem]
- "services_linksrecommendationsservice_linksrecommendationsservice": "LinksRecommendationsService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L19 | neighbors=[LinksRecommendationsPage.tsx, LinksRecommendationsService.ts, .addLink(), .addRecommendation(), .getAll(), ._list()]
- "services_systemconfigservice": "SystemConfigService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SystemConfigService.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, dbdc03a systemconfig online, DocLibraryCatalog.tsx, AppLayout.tsx, RequestService.ts, index.ts]
- "services_templateservice": "TemplateService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L1 | neighbors=[3c5c37b more-mods, 4b576db AI-Integration, 4c2e63a update smartbid 2.0, dbdc03a systemconfig online, e2285cf cont-implementing, IBidTemplate.ts]
- "utils_bomparser": "bomParser.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L1 | neighbors=[e2285cf cont-implementing, BomCostsPage.tsx, index.ts, assignParentIds(), cleanCsvValue(), emptyItem()]
- "utils_clarificationexport": "clarificationExport.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationExport.ts:L1 | neighbors=[ExportClarificationModal.tsx, 1665b01 more features, index.ts, escapeHtml(), exportClarificationsToExcel(), formatDateOnly()]
- "utils_pdfexport": "pdfExport.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L1 | neighbors=[c271ce8 Refactor code structure for imp…, BidDetailsReportPage.tsx, OperationalSummaryPage.tsx, PeriodPerformancePage.tsx, ExportService.ts, BuildPdfArgs]
- "dashboard_dashboardkpirow": "DashboardKPIRow.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardKPIRow.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 3a3d0a5 new changes, fe3728a smartbid2.0, KPICard.tsx, KPICard(), DashboardKPIRow()]
- "layout_footer": "Footer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L1 | neighbors=[1665b01 more features, fe3728a smartbid2.0, AppLayout.tsx, Footer(), oiiBlueLogo, oiiWhiteLogo]
- "models_iapprovalflow": "IApprovalFlow.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IApprovalFlow.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, mockApprovals.ts, IApprovalFlow, IApprovalFlowChain, IApprovalFlowStep, IBidStatus.ts]
- "models_ifavoriteitem": "IFavoriteItem.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IFavoriteItem.ts:L1 | neighbors=[165493f NEW-MODIFIC, e2285cf cont-implementing, FavoriteDataSource, IFavoriteBid, IFavoriteEquipment, IFavoriteGroup]
- "models_iquerycatalog": "IQueryCatalog.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L1 | neighbors=[e2285cf cont-implementing, index.ts, IActiveRegisteredItem, IBomCostResult, IBomSheetItem, IMultiSourceResults]
- "pages_technicalproposalspage": "TechnicalProposalsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TechnicalProposalsPage.tsx:L1 | neighbors=[de36cf5 feat: add SmartBid Docs indexer…, AppLayout.tsx, useCurrentUser.ts, useCurrentUser(), DocLibraryCatalog.tsx, DocLibraryCatalog()]
- "services_aiauthservice": "AiAuthService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L1 | neighbors=[1c19dcd Update API diagnostics and AI c…, 9e27edd feat: Update AI integration and…, SmartBid20.tsx, AIAnalysisService.ts, AiAuthService, IAiAuthTraceEntry]
- "services_clarificationdbservice": "ClarificationDbService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L1 | neighbors=[BidStatusPhasePanel.tsx, ImportClarificationModal.tsx, 8e87d94 feat: Add Links and Recommendat…, ClarificationsDbPage.tsx, IClarificationDb.ts, IClarificationDbItem]
- "services_ernservice": "ErnService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L1 | neighbors=[ErnCreateModal.tsx, ErnDetailsModal.tsx, ErnSearchModal.tsx, 892c1fc feat: add PeoplePicker componen…, useErn.ts, index.ts]
- "services_linksrecommendationsservice": "LinksRecommendationsService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L1 | neighbors=[8e87d94 feat: Add Links and Recommendat…, LinksRecommendationsPage.tsx, ILinksRecommendations.ts, IBidLink, IBidRecommendation, ILinksRecommendationsData]
- "services_querycatalogservice_querycatalogservice": "QueryCatalogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L16 | neighbors=[QueryCatalogService.ts, .dateDiffDays(), .loadCatalog(), .parseActiveRegistered(), .parseBomSheet(), .parsePeopleSoftFinancials()]
- "services_systemconfigservice_systemconfigservice": "SystemConfigService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SystemConfigService.ts:L9 | neighbors=[DocLibraryCatalog.tsx, AppLayout.tsx, RequestService.ts, SystemConfigService.ts, .clearCache(), .get()]
- "services_templateservice_templateservice": "TemplateService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L13 | neighbors=[TemplateService.ts, ._configList(), .create(), .deleteTemplate(), .getAll(), .getById()]
- "smartbid20_smartbid20webpart": "SmartBid20WebPart.ts" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L1 | neighbors=[3a3d0a5 new changes, dbdc03a systemconfig online, fe3728a smartbid2.0, ISmartBid20Props.ts, ISmartBid20Props, SmartBid20.tsx]
- "stores_usechatstore": "useChatStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useChatStore.ts:L1 | neighbors=[de36cf5 feat: add SmartBid Docs indexer…, ChatAssistant.tsx, IAiChat.ts, IChatMessage, AIAnalysisService.ts, AIAnalysisService]
- "stores_usetemplatestore": "useTemplateStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useTemplateStore.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, c4e04de lots-implementation, ImportSourceModal.tsx, useTemplates.ts, IBidTemplate.ts, IBidTemplate]
- "utils_accesscontrol_canaccessknowledge": "canAccessKnowledge()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L112 | neighbors=[AppLayout.tsx, CommandPalette.tsx, Sidebar.tsx, ClarificationsDbPage.tsx, DatasheetsPage.tsx, LinksRecommendationsPage.tsx]
- "utils_aiclarificationmapper": "aiClarificationMapper.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiClarificationMapper.ts:L1 | neighbors=[QualificationsTab.tsx, 4b576db AI-Integration, BidDetailPage.tsx, IAIAnalysis.ts, IAISuggestedClarification, IBid.ts]
- "utils_aiquotationmapper": "aiQuotationMapper.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiQuotationMapper.ts:L1 | neighbors=[AddQuotationModal.tsx, 4b576db AI-Integration, 961eb93 feat: Update AI integration and…, b6d954d feat: Enhance AIAnalysisService…, index.ts, IQuotationLineDraft]
- "utils_costcalculations_buildcostsummary": "buildCostSummary()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L564 | neighbors=[BidCostSummary.tsx, OverviewTab.tsx, costCalculations.ts, calculateAssetsTotals(), calculateCertificationsTotals(), calculateConsumablesTotals()]
- "utils_durationhelpers": "durationHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/durationHelpers.ts:L1 | neighbors=[BidStatusPhasePanel.tsx, BidTimeline.tsx, OverviewTab.tsx, RevisionsTab.tsx, c58a13c new-implementations, calcDurationHours()]
- "utils_ernhelpers_geternlinks": "getErnLinks()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L54 | neighbors=[BidCard.tsx, ErnDashboardSection.tsx, BidDetailPage.tsx, BidTrackerPage.tsx, DashboardPage.tsx, analyticsHelpers.ts]
- "utils_revisionhelpers": "revisionHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L1 | neighbors=[1665b01 more features, BidDetailPage.tsx, index.ts, idGenerator.ts, makeId(), appendRevisionChanges()]
- "bid_bidapprovalpanel": "BidApprovalPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidApprovalPanel.tsx:L1 | neighbors=[BidApprovalPanel(), BidApprovalPanelProps, index.ts, formatters.ts, formatDate(), 0546310 Add dashboard components and st…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@c6ce977318ef683b49401625111868d10c5f4938": "c6ce977 Add Azure AI Backend for SmartBid 2.0 integration" | kind=Commit | source=git | neighbors=[4b576db AI-Integration, main, cce6a16 Refactor code structure for imp…, AIDocumentAnalyzer.tsx, ai.config.ts, ai.prompts.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@d23a43b476fc1f3a0fbdacea17d96bda374e96c2": "d23a43b feat: enhance ERN management with new access control and activity loggi…" | kind=Commit | source=git | neighbors=[892c1fc feat: add PeoplePicker componen…, BidActivityLog.tsx, ErnCreateModal.tsx, OverviewTab.tsx, main, 4b576db AI-Integration]
- "common_phasebadge": "PhaseBadge.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PhaseBadge.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PhaseBadge(), PhaseBadgeProps, useConfigStore.ts]
- "config_spfxcontext": "SpfxContext.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/SpfxContext.ts:L1 | neighbors=[OverviewTab.tsx, 3a3d0a5 new changes, PeoplePicker.tsx, SmartBid20.tsx, SpfxContext, useSpfxContext()]

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
