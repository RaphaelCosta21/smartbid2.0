# Node Description Batch 12 of 86

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

- "survey3d_cableflow_cablenetwork": "CableNetwork" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L39 | neighbors=[cableFlow.ts, .applyTrace(), .build(), .clear(), .dispose(), .setEnabled()]
- "utils_aicontext": "aiContext.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiContext.ts:L1 | neighbors=[AITab.tsx, QualificationsTab.tsx, ScopeOfSupplyTab.tsx, 4b576db AI-Integration, 583d03e Refactor string concatenation i…, IAIAnalysis.ts]
- "utils_clarificationhelpers_activeconfigoptions": "activeConfigOptions()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L28 | neighbors=[QualificationsTab.tsx, ScopeOfSupplyTab.tsx, useClarificationLibraryFilter.ts, useQualificationLibraryFilter.ts, ClarificationEntryModal.tsx, QualificationCategoryInput.tsx]
- "utils_costcalculations_getsplitnode": "getSplitNode()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L239 | neighbors=[AssetsBreakdownTab.tsx, rows.ts, costCalculations.ts, getSplitCost(), applyContingencyToCost(), getEffectiveCategory()]
- "utils_doccataloghelpers": "docCatalogHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/docCatalogHelpers.ts:L1 | neighbors=[5577aab feat: Add Technical Proposal fu…, DocLibraryCatalog.tsx, TechnicalProposalKnowledgeService.ts, IDocLibraryItem.ts, IDocLibraryMetadata, index.ts]
- "utils_ernhelpers_geternlinks": "getErnLinks()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L101 | neighbors=[BidCard.tsx, DashboardBidTable.tsx, BidDetailPage.tsx, BidTrackerPage.tsx, analyticsHelpers.ts, ernHelpers.ts]
- "utils_pastbiddocument_clean": "clean()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L46 | neighbors=[clarificationLibraryDocument.ts, pastBidDocument.ts, buildPastBidDocument(), buildPastBidFileName(), buildPastBidMetadata(), heading()]
- "bidexcelexport_excelstyles_colof": "colOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L192 | neighbors=[excelStyles.ts, assetsSheet.ts, certificationsSheet.ts, currencyTable.ts, hoursSheet.ts, logisticsSheet.ts]
- "charts_heatmapgrid": "HeatmapGrid.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/HeatmapGrid.tsx:L1 | neighbors=[heatColor(), HeatmapColumn, HeatmapGrid(), HeatmapGridProps, hexToRgb(), 583d03e Refactor string concatenation i…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@1111add67f3a6ff8391e29fbf84abf5b32662001": "1111add Add initial configuration files for Graphify" | kind=Commit | source=git | neighbors=[AssetsBreakdownTab.tsx, CostSearchModal.tsx, ScopeOfSupplyTab.tsx, feat/easi-modules-pages, main, 6d20432 feat: adiciona paginas EASI ao …]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@c6ce977318ef683b49401625111868d10c5f4938": "c6ce977 Add Azure AI Backend for SmartBid 2.0 integration" | kind=Commit | source=git | neighbors=[4b576db AI-Integration, feat/easi-modules-pages, main, cce6a16 Refactor code structure for imp…, AIDocumentAnalyzer.tsx, ai.config.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@d227784702b243c9dc77c10d143b06699b80ecad": "d227784 feat(survey): Figma 2D system view with animated information flow; OII …" | kind=Commit | source=git | neighbors=[67bbf62 feat(survey): apply Figma look …, main, 33536c2 feat(survey): 2.5D depth view o…, sharepoint.config.ts, SurveySystemPage.tsx, createSurveyScene.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@d23a43b476fc1f3a0fbdacea17d96bda374e96c2": "d23a43b feat: enhance ERN management with new access control and activity loggi…" | kind=Commit | source=git | neighbors=[892c1fc feat: add PeoplePicker componen…, BidActivityLog.tsx, ErnCreateModal.tsx, OverviewTab.tsx, feat/easi-modules-pages, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@e04601409c9056d8ed877bedb43d2e590bb1181e": "e046014 Refactor code structure for improved readability and maintainability" | kind=Commit | source=git | neighbors=[0df87c0 refactor: improve code formatti…, QualificationsTab.tsx, main, 9582626 feat: add Access Log component …, AIDocumentAnalyzer.tsx, ai.prompts.ts]
- "common_phasebadge": "PhaseBadge.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PhaseBadge.tsx:L1 | neighbors=[BidActivityLog.tsx, 0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PhaseBadge(), PhaseBadgeProps]
- "hooks_useapprovalsync": "useApprovalSync.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useApprovalSync.ts:L1 | neighbors=[2b1ed14 feat: add useApprovalSync hook …, FLOW_FIELDS, pickFlowChanges(), useApprovalSync(), index.ts, BidService.ts]
- "hooks_usedebounce": "useDebounce.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDebounce.ts:L1 | neighbors=[EquipmentImportModal.tsx, fe3728a smartbid2.0, useDebounce(), DocLibraryCatalog.tsx, AssetsCatalogPage.tsx, BidTrackerPage.tsx]
- "hooks_useregisterquotationsuppliers": "useRegisterQuotationSuppliers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useRegisterQuotationSuppliers.ts:L1 | neighbors=[AddQuotationModal.tsx, 02c1391 feat: Add supplier management f…, 414e1a6 style: Improve code formatting …, useRegisterQuotationSuppliers(), useSupplierStore.ts, ISupplierEntry]
- "hooks_useslidingindicator": "useSlidingIndicator.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useSlidingIndicator.ts:L1 | neighbors=[1d028a0 style: Improve code formatting …, 77f55d4 feat: Add Clarification Entry M…, IIndicatorRect, ISlidingIndicator, useSlidingIndicator(), SegmentedControl.tsx]
- "layout_footer": "Footer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L1 | neighbors=[1665b01 more features, fe3728a smartbid2.0, AppLayout.tsx, Footer(), oiiBlueLogo, oiiWhiteLogo]
- "models_iapprovalflow": "IApprovalFlow.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IApprovalFlow.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, mockApprovals.ts, IApprovalFlow, IApprovalFlowChain, IApprovalFlowStep, IBidStatus.ts]
- "models_ibidstatus_bidpriority": "BidPriority" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L82 | neighbors=[kpi.config.ts, IBid.ts, IBidRequest.ts, IBidStatus.ts, index.ts, ISystemConfig.ts]
- "models_ifavoriteitem": "IFavoriteItem.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IFavoriteItem.ts:L1 | neighbors=[165493f NEW-MODIFIC, e2285cf cont-implementing, FavoriteDataSource, IFavoriteBid, IFavoriteEquipment, IFavoriteGroup]
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
- "template_templatecard": "TemplateCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateCard.tsx:L1 | neighbors=[165493f NEW-MODIFIC, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, c4e04de lots-implementation, TemplatesPage.tsx]
- "utils_accesscontrol_canaccessknowledge": "canAccessKnowledge()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L112 | neighbors=[AppLayout.tsx, CommandPalette.tsx, Sidebar.tsx, ClarificationsDbPage.tsx, DatasheetsPage.tsx, LinksRecommendationsPage.tsx]
- "utils_aiclarificationmapper": "aiClarificationMapper.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiClarificationMapper.ts:L1 | neighbors=[QualificationsTab.tsx, 4b576db AI-Integration, BidDetailPage.tsx, IAIAnalysis.ts, IAISuggestedClarification, IBid.ts]
- "utils_analyticshelpers_buildperiodsequence": "buildPeriodSequence()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L120 | neighbors=[analyticsHelpers.ts, approvalImpactTrend(), addPeriod(), periodKey(), periodStart(), completionTimeTrend()]
- "utils_bidhelpers_isactivebid": "isActiveBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L5 | neighbors=[DashboardBidTable.tsx, BidBoardPage.tsx, BidTrackerPage.tsx, DashboardPage.tsx, FlowBoardPage.tsx, MyDashboardPage.tsx]
- "utils_costcalculations_applycontingencytocost": "applyContingencyToCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L127 | neighbors=[AssetsBreakdownTab.tsx, rows.ts, costCalculations.ts, getAgeContingencyPct(), getAssetCostBreakdown(), getSplitNode()]
- "utils_costcalculations_getsubitemnode": "getSubItemNode()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L288 | neighbors=[AssetsBreakdownTab.tsx, costCalculations.ts, getSubItemCostTotal(), applyContingencyToCost(), getEffectiveCategory(), getFeesTotal()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-011.json

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
