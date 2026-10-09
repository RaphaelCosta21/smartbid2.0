# Node Description Batch 11 of 86

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

- "function_app_function_app_suggest_clarifications": "suggest_clarifications()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L1160 | neighbors=[function_app.py, _caller_upn(), _clarification_library_block(), _clarification_library_material(), _clarification_material(), _clarifications_bad_request()]
- "knowledge_pastbidprofilemodal": "PastBidProfileModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidProfileModal.tsx:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, bc10d67 feat: add pastBidHelpers and pa…, PastBidProfileModal(), PastBidProfileModalProps, IAIAnalysis.ts, IPastBidProfileSuggestion]
- "models_ibidtemplate_ibidtemplate": "IBidTemplate" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidTemplate.ts:L8 | neighbors=[BidTemplateImport.tsx, ImportSourceModal.tsx, useTemplates.ts, IBidTemplate.ts, index.ts, TemplatesPage.tsx]
- "pages_datasheetspage": "DatasheetsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/DatasheetsPage.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 8e87d94 feat: Add Links and Recommendat…, AppLayout.tsx, usePageAccess.ts, usePageAccess(), DocLibraryCatalog.tsx]
- "pages_easimoduleframe": "EasiModuleFrame.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/EasiModuleFrame.tsx:L1 | neighbors=[3f57ca9 merge: integrate EASI module pa…, 6d20432 feat: adiciona paginas EASI ao …, 8267c28 i18n: translate EASI, suppliers…, ddf6c96 Merge branch 'feat/survey-knowl…, EasiBidComparatorPage.tsx, EasiBidPresentationPage.tsx]
- "pages_manualscatalogspage": "ManualsCatalogsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ManualsCatalogsPage.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 8e87d94 feat: Add Links and Recommendat…, AppLayout.tsx, usePageAccess.ts, usePageAccess(), DocLibraryCatalog.tsx]
- "peoplesoft_howitworksdrawer": "HowItWorksDrawer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/peoplesoft/HowItWorksDrawer.tsx:L1 | neighbors=[3ae3801 refactor: improve code formatti…, 9582626 feat: add Access Log component …, QueryConsultingPage.tsx, useAppRootHost.ts, useAppRootHost(), HowItWorksDrawer()]
- "services_aianalysisservice_aianalysisservice_postjson": ".postJson()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L378 | neighbors=[AIAnalysisService, .analyzeDocument(), .analyzeDocumentForTemplate(), .chat(), .extractDocumentMetadata(), .extractQuotation()]
- "services_easimodulesadapter": "EasiModulesAdapter.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L1 | neighbors=[3f57ca9 merge: integrate EASI module pa…, 6d20432 feat: adiciona paginas EASI ao …, index.ts, BidService.ts, BidService, AssetItem]
- "services_ernservice": "ErnService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L1 | neighbors=[ErnCreateModal.tsx, ErnDetailsModal.tsx, ErnSearchModal.tsx, 892c1fc feat: add PeoplePicker componen…, aaa091c Add hooks for KPI targets and l…, db68d81 feat: Enhance ErnCreateModal an…]
- "services_favoritesservice_favoritesservice": "FavoritesService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L21 | neighbors=[FavoritesService.ts, .addBidFavorite(), .addEquipment(), .getAll(), ._list(), .removeBidFavorite()]
- "services_querycatalogservice_querycatalogservice": "QueryCatalogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L21 | neighbors=[QueryCatalogService.ts, .dateDiffDays(), .loadCatalog(), .loadFinancialsActiveRegistered(), .parseActiveRegistered(), .parseBomSheet()]
- "survey3d_equipmentmodels": "equipmentModels.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L1 | neighbors=[9b2fddd feat(survey): diagram rooms (ma…, ddf6c96 Merge branch 'feat/survey-knowl…, f510343 feat(survey): interactive sprea…, EquipmentModelFactory, GLOWING, normalize()]
- "survey3d_explodelayout": "explodeLayout.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/explodeLayout.ts:L1 | neighbors=[9b2fddd feat(survey): diagram rooms (ma…, d9e6783 feat(survey): clean 3D overview…, ddf6c96 Merge branch 'feat/survey-knowl…, f510343 feat(survey): interactive sprea…, createSurveyScene.ts, ExplodeLayout]
- "survey3d_trunkflow": "trunkFlow.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/trunkFlow.ts:L1 | neighbors=[9b2fddd feat(survey): diagram rooms (ma…, b07a797 feat(survey): toggle to hide co…, d574851 style(survey): calmer overview …, ddf6c96 Merge branch 'feat/survey-knowl…, createSurveyScene.ts, index.ts]
- "utils_clarificationhelpers_configoptionlabel": "configOptionLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L56 | neighbors=[ExportClarificationModal.tsx, QualificationsTab.tsx, ScopeOfSupplyTab.tsx, useClarificationLibraryFilter.ts, useQualificationLibraryFilter.ts, ClarificationBadges.tsx]
- "utils_durationhelpers": "durationHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/durationHelpers.ts:L1 | neighbors=[BidStatusPhasePanel.tsx, BidTimeline.tsx, OverviewTab.tsx, RevisionsTab.tsx, 583d03e Refactor string concatenation i…, c58a13c new-implementations]
- "utils_formatters_ispastdue": "isPastDue()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L59 | neighbors=[DashboardBidTable.tsx, useKPIs.ts, BidTrackerPage.tsx, OperationalSummaryPage.tsx, PerformanceTrendsPage.tsx, DashboardService.ts]
- "utils_pastbiddocument_record": "record()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L105 | neighbors=[clarificationLibraryDocument.ts, pastBidDocument.ts, classification(), hours(), identification(), outcome()]
- "utils_technicalproposalhelpers": "technicalProposalHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/technicalProposalHelpers.ts:L1 | neighbors=[DocumentsTab.tsx, OverviewTab.tsx, TechnicalProposalChip.tsx, 5577aab feat: Add Technical Proposal fu…, BidDetailPage.tsx, TechnicalProposalKnowledgeService.ts]
- "approval_approvaloverridebanner": "ApprovalOverrideBanner.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalOverrideBanner.tsx:L1 | neighbors=[ApprovalOverrideBanner(), ApprovalOverrideBannerProps, NON_PENDING_LABEL, IBid.ts, IApprovalOverride, formatters.ts]
- "bid_bidcomments": "BidComments.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidComments.tsx:L1 | neighbors=[BidComments(), BidCommentsProps, PersonaCard.tsx, PersonaCard(), index.ts, formatters.ts]
- "bidexcelexport_context_ibidexcelcontext": "IBidExcelContext" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/context.ts:L88 | neighbors=[context.ts, index.ts, assetsSheet.ts, certificationsSheet.ts, costSummarySheet.ts, hoursSheet.ts]
- "bidexcelexport_context_newsheet": "newSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/context.ts:L104 | neighbors=[context.ts, sheetName(), assetsSheet.ts, certificationsSheet.ts, costSummarySheet.ts, hoursSheet.ts]
- "bidexcelexport_excelstyles_xl_colors": "XL_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L16 | neighbors=[excelStyles.ts, assetsSheet.ts, certificationsSheet.ts, costSummarySheet.ts, currencyTable.ts, hoursSheet.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@1d028a02e2b80ef23a1043a5f18e75320b778dd7": "1d028a0 style: Improve code formatting and readability across multiple componen…" | kind=Commit | source=git | neighbors=[ImportClarificationModal.tsx, main, 02c1391 feat: Add supplier management f…, useClarificationLibraryFilter.ts, useSlidingIndicator.ts, ClarificationBadges.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@cce41cca8d7f5e6a8ffea367dd8a9583001d9c77": "cce41cc refactor: clean up code formatting and improve readability across multi…" | kind=Commit | source=git | neighbors=[75476a5 feat: add confidentiality manag…, ConfidentialAccessModal.tsx, ConfidentialLock.tsx, ExportClarificationModal.tsx, main, 5c35e8d feat: Implement Qualification L…]
- "common_aianalyzermodal": "AIAnalyzerModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIAnalyzerModal.tsx:L1 | neighbors=[ScopeOfSupplyTab.tsx, f03d3f6 feat: Enhance ImportSourceModal…, AIAnalyzerModal(), AIAnalyzerModalProps, AIDocumentAnalyzer.tsx, AIDocumentAnalyzer()]
- "common_hoursimportpreview": "HoursImportPreview.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/HoursImportPreview.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 3c5c37b more-mods, 66dbcee feat: Implement contingency cal…, HoursCategory, HoursImportPreview(), HoursImportPreviewProps]
- "function_app_function_app_chat": "chat()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L1011 | neighbors=[function_app.py, _caller_upn(), _chat_bad_request(), _chat_messages(), _chat_past_bid_material(), _chat_reference_material()]
- "models_ibidexport": "IBidExport.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidExport.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, bc10d67 feat: add pastBidHelpers and pa…, useExport.ts, BidExcelSheetKey, IBidExcelExportOptions, IExportColumn]
- "models_iclarificationdb_iclarificationdbitem": "IClarificationDbItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IClarificationDb.ts:L7 | neighbors=[ImportClarificationModal.tsx, useClarificationLibraryFilter.ts, ClarificationEntryDrawer.tsx, ClarificationEntryModal.tsx, IClarificationDb.ts, index.ts]
- "models_iqualificationdb_iqualificationdbitem": "IQualificationDbItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQualificationDb.ts:L5 | neighbors=[ImportQualificationModal.tsx, useQualificationLibraryFilter.ts, QualificationEntryDrawer.tsx, QualificationEntryModal.tsx, QualificationLibraryView.tsx, QualificationTableModal.tsx]
- "services_aiauthservice": "AiAuthService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L1 | neighbors=[1c19dcd Update API diagnostics and AI c…, 583d03e Refactor string concatenation i…, 9e27edd feat: Update AI integration and…, SmartBid20.tsx, AIAnalysisService.ts, AiAuthService]
- "services_easimodulesadapter_easimodulesadapter": "EasiModulesAdapter" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L42 | neighbors=[EasiModulesAdapter.ts, ._bids(), ._costRows(), .getBenchmarkDataset(), .getCostElementsRaw(), .getOpportunitiesRaw()]
- "services_linksrecommendationsservice_linksrecommendationsservice": "LinksRecommendationsService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L19 | neighbors=[LinksRecommendationsPage.tsx, LinksRecommendationsService.ts, .addLink(), .addRecommendation(), .getAll(), ._list()]
- "services_systemconfigservice_systemconfigservice": "SystemConfigService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SystemConfigService.ts:L11 | neighbors=[DocLibraryCatalog.tsx, AppLayout.tsx, NotificationDispatchService.ts, RequestService.ts, SystemConfigService.ts, .clearCache()]
- "services_templateservice": "TemplateService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L1 | neighbors=[3c5c37b more-mods, 4b576db AI-Integration, 4c2e63a update smartbid 2.0, dbdc03a systemconfig online, e2285cf cont-implementing, IBidTemplate.ts]
- "stores_useauthstore_useauthstore": "useAuthStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useAuthStore.ts:L29 | neighbors=[useAccessLevel.ts, useCurrentUser.ts, useOpenBid.ts, AppLayout.tsx, Header.tsx, LivePulse.tsx]
- "stores_usefavoritesstore_usefavoritesstore": "useFavoritesStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useFavoritesStore.ts:L69 | neighbors=[BidFavoriteButton.tsx, EquipmentImportModal.tsx, ScopeOfSupplyTab.tsx, AIDocumentAnalyzer.tsx, ImportSourceModal.tsx, QueryCatalogLoadingBanner.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-010.json

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
