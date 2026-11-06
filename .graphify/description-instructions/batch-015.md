# Node Description Batch 16 of 102

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

- "bidexcelexport_runtime": "runtime.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/runtime.ts:L1 | neighbors=[index.ts, loadExcelJS(), loadLogoDataUrl(), logoUrl, sanitizeFilePart(), 77f55d4 feat: Add Clarification Entry M…] | lang=en
- "charts_supplierquotebars": "SupplierQuoteBars.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/SupplierQuoteBars.tsx:L1 | neighbors=[LinkedQuotationsPanel.tsx, SupplierQuoteBars(), SupplierQuoteBarsProps, formatters.ts, formatCurrency(), quotationLinks.ts] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@0a8206d84c6500c4d898d0add632f2a99c0cb6f1": "0a8206d feat(survey): 3D navigation - Space+drag/right-drag pan, WASD/arrows gl…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, 9b2fddd feat(survey): diagram rooms (ma…] | lang=pt
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@20d52eda78a815d7bf708d2f471fb68d7afdf050": "20d52ed feat: Add urgency reason styling and enhance related components for bet…" | kind=Commit | source=git | neighbors=[AssetsBreakdownTab.tsx, EquipmentImportModal.tsx, OverviewTab.tsx, ScopeOfSupplyTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@437d8e12e6a30c09f46fe6035dcb551427e44ae2": "437d8e1 feat: implement notification log service and provisioning; enhance noti…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, 9759c3b Refactor DivisionBadge and Memb…, sharepoint.config.ts, NotificationLogService.ts] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@4c720fd7c5486530129ee0985f9d15fd03e8a755": "4c720fd style(survey): IMR-style procedural vessel (forecastle, white accommoda…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, 8267c28 i18n: translate EASI, suppliers…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@9153d0417e4caf4b320b6fd576b484b2f8fc36fd": "9153d04 refactor: Simplify component rendering and improve code formatting for …" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, 8152d02 feat: implement split approval …, BidComparatorPage.tsx, BidDetailPage.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@93ca809bd5cfa1e4a7366e286a1b2d17a889a881": "93ca809 refactor: improve code formatting for consistency across BOM components…" | kind=Commit | source=git | neighbors=[4b5d467 feat: add BomQuotationPicker co…, BomAnalysisCard.tsx, BomQuotationPicker.tsx, backup/survey-merge-20261018-113028-main, main, 4657c82 Add smartbid-logo-teal.png asse…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@e05a523f6f847712bd31236fc488967006d28064": "e05a523 feat: Enhance notification cards and email templates" | kind=Commit | source=git | neighbors=[c6da0c6 Add node description batches 81…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, e78354c feat: Update daily reminder flo…, notifications.config.ts] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@e2388c0cdabb3074b8456b1028070e56569155eb": "e2388c0 feat(survey): allow Knowledge editors (templates edit) to import the su…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, 0deadb7 fix(survey): read catalog jsond…] | lang=en
- "common_columnfilter": "ColumnFilter.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ColumnFilter.tsx:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, ColumnFilter(), ColumnFilterProps, PANEL_STYLE, MultiSelectDropdown.tsx] | lang=en
- "common_personacard": "PersonaCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PersonaCard.tsx:L1 | neighbors=[ApprovalTab.tsx, BidComments.tsx, ConfidentialAccessModal.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PersonaCard()] | lang=en
- "config_spfxcontext": "SpfxContext.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/SpfxContext.ts:L1 | neighbors=[OverviewTab.tsx, 3a3d0a5 new changes, PeoplePicker.tsx, SmartBid20.tsx, SpfxContext, useSpfxContext()] | lang=en
- "function_app_document_structure_build_chunks": "build_chunks()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L395 | neighbors=[document_structure.py, metadata_header(), outline(), _render(), _split_body(), split_sections()] | lang=en
- "function_app_document_structure_heading": "_heading()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L198 | neighbors=[document_structure.py, _has_word(), _is_title_case(), _is_upper(), _letter_count(), _numbered_title()] | lang=en
- "function_app_function_app_extract_quotation": "extract_quotation()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L789 | neighbors=[function_app.py, _bad_request(), _caller_upn(), _document_text(), _model_json(), _now_iso()] | lang=en
- "hooks_usecolortheme_resolvesemanticcolor": "resolveSemanticColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useColorTheme.ts:L17 | neighbors=[BidStatusPhasePanel.tsx, sectors.config.ts, status.config.ts, useColorTheme.ts, getActiveColorTheme(), useStatusColors.ts] | lang=en
- "hooks_usedebounce_usedebounce": "useDebounce()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDebounce.ts:L7 | neighbors=[EquipmentImportModal.tsx, useDebounce.ts, DocLibraryCatalog.tsx, AssetsCatalogPage.tsx, BidTrackerPage.tsx, QueryConsultingPage.tsx] | lang=en
- "knowledge_clarificationbadges_clarificationcategorychip": "ClarificationCategoryChip()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationBadges.tsx:L25 | neighbors=[ExportClarificationModal.tsx, ImportClarificationModal.tsx, QualificationGroupList.tsx, QualificationsTab.tsx, ClarificationBadges.tsx, ClarificationEntryDrawer.tsx] | lang=en
- "models_ibomcostanalysis": "IBomCostAnalysis.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBomCostAnalysis.ts:L1 | neighbors=[BomAnalysisCard.tsx, 165493f NEW-MODIFIC, e2285cf cont-implementing, BomCostSource, IBomCostAnalysis, IBomCostItem] | lang=en
- "models_idashboard": "IDashboard.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDashboard.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, DivisionWorkload.tsx, MonthlyVolumeChart.tsx, IDashboardData, IDashboardKPI, IDivisionWorkload] | lang=en
- "models_iuser_ipersonref": "IPersonRef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L26 | neighbors=[ApprovalTab.tsx, IApprovalFlow.ts, IBid.ts, IBidApproval.ts, IBidComment.ts, IBidRequest.ts] | lang=en
- "pages_faqpage": "FaqPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FaqPage.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, AppLayout.tsx, PageHeader.tsx, PageHeader()] | lang=en
- "reports_exportbar": "ExportBar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ExportBar.tsx:L1 | neighbors=[8267c28 i18n: translate EASI, suppliers…, c271ce8 Refactor code structure for imp…, ddf6c96 Merge branch 'feat/survey-knowl…, BidComparatorPage.tsx, BidDetailsReportPage.tsx, PeriodPerformancePage.tsx] | lang=en
- "services_aiauthservice_aiauthservice_getapp": ".getApp()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L134 | neighbors=[AiAuthService, .clearTokenCache(), .getAccessToken(), .getAuthority(), .getRedirectUri(), .isConfigured()] | lang=en
- "services_approvalservice_approvalservice": "ApprovalService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L27 | neighbors=[ApprovalTab.tsx, ApprovalService.ts, ._approvalsList(), .ensureApprovalColumns(), .markRoundOverridden(), .markRoundsCancelled()] | lang=en
- "services_bomcostanalysisservice": "BomCostAnalysisService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BomCostAnalysisService.ts:L1 | neighbors=[CostSearchModal.tsx, EquipmentImportModal.tsx, e2285cf cont-implementing, BomCostsPage.tsx, index.ts, BomCostAnalysisService] | lang=en
- "services_bomcostanalysisservice_bomcostanalysisservice": "BomCostAnalysisService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BomCostAnalysisService.ts:L13 | neighbors=[CostSearchModal.tsx, EquipmentImportModal.tsx, BomCostsPage.tsx, BomCostAnalysisService.ts, .deleteOne(), .getAll()] | lang=en
- "services_editcontrolservice_editcontrolservice": "EditControlService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L11 | neighbors=[useEditControl.ts, BidDetailPage.tsx, EditControlService.ts, .acquireLock(), .getLocks(), ._list()] | lang=en
- "services_pastbidknowledgeservice_pastbidknowledgeservice": "PastBidKnowledgeService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PastBidKnowledgeService.ts:L36 | neighbors=[usePastBidPublisher.ts, PastBidDrawer.tsx, PastBidsPage.tsx, PastBidKnowledgeService.ts, ._ensureColumns(), .fileUrl()] | lang=en
- "services_querycatalogservice": "QueryCatalogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L1 | neighbors=[9cc3475 feat: Integrate Financials Acti…, e2285cf cont-implementing, index.ts, QueryCatalogService, SPService.ts, SPService] | lang=en
- "services_requestservice_requestservice": "RequestService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L12 | neighbors=[CreateRequestPage.tsx, UnassignedRequestsPage.tsx, RequestService.ts, .assignRequest(), .bidToRequest(), .createRequest()] | lang=en
- "services_technicalproposalknowledgeservice_technicalproposalknowledgeservice": "TechnicalProposalKnowledgeService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L37 | neighbors=[useTechnicalProposalPublisher.ts, TechnicalProposalKnowledgeService.ts, ._buildMetadata(), ._createFolderIfMissing(), ._ensureColumns(), ._ensureFolder()] | lang=en
- "smartbid20_smartbid20webpart_smartbid20webpart": "SmartBid20WebPart" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L23 | neighbors=[SmartBid20WebPart.ts, BaseClientSideWebPart, .dataVersion(), ._getEnvironmentMessage(), .getPropertyPaneConfiguration(), .onDispose()] | lang=en
- "stores_useassetcatalogstore": "useAssetCatalogStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useAssetCatalogStore.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, useQuerySearch.ts, IAssetCatalog.ts, IAssetCatalogItem, AssetCatalogService.ts] | lang=en
- "stores_useernstore_useernstore": "useErnStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useErnStore.ts:L18 | neighbors=[DashboardBidTable.tsx, ErnDashboardSection.tsx, useDashboardSync.ts, useErn.ts, useLiveOverview.ts, LivePulse.tsx] | lang=en
- "survey_surveyequipment3dthumb": "SurveyEquipment3DThumb.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipment3DThumb.tsx:L1 | neighbors=[747fd66 feat(survey): Oceaneering theme…, f672a54 Refactor code structure for imp…, equipmentModels.ts, EquipmentModelFactory, sceneTypes.ts, SceneShape] | lang=en
- "survey_surveyjourneydeliverables": "SurveyJourneyDeliverables.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyJourneyDeliverables.tsx:L1 | neighbors=[7342177 Merge feat/survey-surface-spare…, ca73461 feat(survey): spare quantities,…, SurveySystemPage.tsx, surveyDataFormats.ts, DeliverableVisual, ICONS] | lang=en
- "survey3d_createsurveyscene_createsurveyscene": "createSurveyScene()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L291 | neighbors=[createSurveyScene.ts, buildManifold(), buildProceduralVessel(), buildRov(), buildSatellite(), glow()] | lang=en
- "survey3d_equipmentmodels_equipmentmodelfactory": "EquipmentModelFactory" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L39 | neighbors=[equipmentModels.ts, .build(), .buildShape(), .dispose(), .geo(), .loadGlb()] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-015.json

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
