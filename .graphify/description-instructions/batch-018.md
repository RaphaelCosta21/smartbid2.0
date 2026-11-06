# Node Description Batch 19 of 102

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

- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@4657c82c8ed0cb1a59c3ca3a0345ce1f93e9dfe7": "4657c82 Add smartbid-logo-teal.png asset to smartBid20 web part" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-main, main, 3939503 refactor: improve code formatti…, Footer.tsx, Sidebar.tsx, SmartBid20WebPart.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@5ba1094dd8eb0c59c51552c23d5fb4bc2c2c1cea": "5ba1094 style(survey): spread card pure glass, readable drawing eyebrow" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, d574851 style(survey): calmer overview …]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@87bda2ebbd19b19c830e7a0e4eb8f6919c7d0ae6": "87bda2e feat(docs): add move functionality for documents between catalog folders" | kind=Commit | source=git | neighbors=[568e582 Merge feat/survey-journey-accur…, main, 540b3b9 style(DocLibraryCatalog): impro…, DocLibraryCatalog.tsx, DatasheetsPage.tsx, ManualsCatalogsPage.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@8878a6bdb9cc8c4e99076b53d4d163373d93dca0": "8878a6b fix: Improve formatting in AIDocumentAnalyzer and ImportSourceList styl…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, main, 2b1ed14 feat: add useApprovalSync hook …, AIDocumentAnalyzer.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@bf0c76b80990bba20ddc2b1cefe6eb9ff940dbf8": "bf0c76b refactor: improve formatting in approval-related files for consistency" | kind=Commit | source=git | neighbors=[14b96c8 feat: implement approval round …, ApprovalTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, 4b5d467 feat: add BomQuotationPicker co…]
- "common_collapsiblesidebar": "CollapsibleSidebar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/CollapsibleSidebar.tsx:L1 | neighbors=[b6d954d feat: Enhance AIAnalysisService…, CollapsibleSidebar(), ICollapsibleSidebarProps, BidDetailPage.tsx, FavoritesPage.tsx, QuotationsPage.tsx]
- "common_fileupload": "FileUpload.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/FileUpload.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, 79354cb Merge remote-tracking branch 'o…, FileUpload(), FileUploadProps]
- "common_filterpanel": "FilterPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/FilterPanel.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, 79354cb Merge remote-tracking branch 'o…, FilterPanel(), FilterPanelProps]
- "common_photolightbox": "PhotoLightbox.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PhotoLightbox.tsx:L1 | neighbors=[EquipmentImportModal.tsx, e2285cf cont-implementing, PhotoLightbox(), PhotoLightboxProps, AddFavoriteEquipmentModal.tsx, FavoritesPage.tsx]
- "config_app_config": "app.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/app.config.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 4b576db AI-Integration, 79354cb Merge remote-tracking branch 'o…, 9582626 feat: add Access Log component …, c58a13c new-implementations, fe3728a smartbid2.0]
- "effects_effectutils_glowmat": "glowMat()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectUtils.ts:L24 | neighbors=[effectUtils.ts, arcGizmo(), flatRing(), rovEffects.ts, seabedEffects.ts, signalEffects.ts]
- "function_app_document_structure_is_boilerplate": "_is_boilerplate()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L150 | neighbors=[document_structure.py, _has_letters(), _normalize(), _recurs_per_page(), Digit masking is what catches a running…, strip_boilerplate()]
- "function_app_function_app_caller_upn": "_caller_upn()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L641 | neighbors=[function_app.py, chat(), extract_quotation(), generate_scope(), UPN of the authenticated caller, from t…, suggest_clarifications()]
- "function_app_function_app_document_text": "_document_text()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L321 | neighbors=[function_app.py, ensure_text(), extract_text_or_images(), extract_quotation(), generate_scope(), Return (text, warnings), capping the le…]
- "function_app_function_app_group_by_document": "_group_by_document()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L480 | neighbors=[function_app.py, _chat_past_bid_material(), _clarification_library_material(), _clarification_material(), _parent_key(), _past_bid_scope_material()]
- "function_app_function_app_model_json": "_model_json()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L309 | neighbors=[function_app.py, chat(), extract_quotation(), generate_scope(), Parse the model's JSON answer. A reason…, suggest_clarifications()]
- "hooks_useanalyticsfilters_useanalyticsfilters": "UseAnalyticsFilters" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L80 | neighbors=[useAnalyticsFilters.ts, BottleneckAnalysisPage.tsx, FollowUpPage.tsx, OperationalSummaryPage.tsx, PerformanceTrendsPage.tsx, PeriodPerformancePage.tsx]
- "hooks_useapprovals": "useApprovals.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useApprovals.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, ApprovalSummary, useApprovals(), index.ts, useBidStore.ts, useBidStore]
- "hooks_usekpitargets_usekpitargets": "useKpiTargets()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useKpiTargets.ts:L7 | neighbors=[DashboardKPIRow.tsx, ErnDashboardSection.tsx, useKpiTargets.ts, CreateRequestPage.tsx, DashboardPage.tsx, OperationalSummaryPage.tsx]
- "hooks_useteammembers": "useTeamMembers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useTeamMembers.ts:L1 | neighbors=[ErnCreateModal.tsx, c271ce8 Refactor code structure for imp…, useTeamMembers(), index.ts, MembersService.ts, MembersService]
- "insights_aiinsightspanel": "AIInsightsPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AIInsightsPanel.tsx:L1 | neighbors=[8267c28 i18n: translate EASI, suppliers…, c271ce8 Refactor code structure for imp…, ddf6c96 Merge branch 'feat/survey-knowl…, AIInsightsPanel(), AIInsightsPanelProps, BottleneckAnalysisPage.tsx]
- "insights_analyticsfilterbar_analyticsfilterbar": "AnalyticsFilterBar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AnalyticsFilterBar.tsx:L59 | neighbors=[AnalyticsFilterBar.tsx, BottleneckAnalysisPage.tsx, FollowUpPage.tsx, OperationalSummaryPage.tsx, PerformanceTrendsPage.tsx, PeriodPerformancePage.tsx]
- "knowledge_clarificationbadges_clarificationoriginchip": "ClarificationOriginChip()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationBadges.tsx:L47 | neighbors=[ImportClarificationModal.tsx, ImportQualificationModal.tsx, ClarificationBadges.tsx, ClarificationEntryDrawer.tsx, QualificationEntryDrawer.tsx, QualificationLibraryView.tsx]
- "models_iassetcatalog": "IAssetCatalog.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAssetCatalog.ts:L1 | neighbors=[EquipmentImportModal.tsx, 0e653cd more mods, IAssetCatalogItem, index.ts, AssetsCatalogPage.tsx, AssetCatalogService.ts]
- "models_ibid_ibid": "IBid" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L950 | neighbors=[ApprovalTab.tsx, IBid.ts, index.ts, ApprovalService.ts, aiContext.ts, clarificationHelpers.ts]
- "models_ibidcomment": "IBidComment.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidComment.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidCommentDef, IBidStatus.ts, BidPhase, IUser.ts, IPersonRef]
- "models_ibidrequest_ibidrequest": "IBidRequest" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidRequest.ts:L25 | neighbors=[mockRequests.ts, useRequests.ts, IBidRequest.ts, index.ts, UnassignedRequestsPage.tsx, RequestService.ts]
- "models_ibidstatus_bidphase": "BidPhase" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L1 | neighbors=[phases.config.ts, status.config.ts, IBid.ts, IBidComment.ts, IBidStatus.ts, IBidTask.ts]
- "models_iclarificationdb_clarificationbasetype": "ClarificationBaseType" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IClarificationDb.ts:L5 | neighbors=[ClarificationBadges.tsx, ClarificationEntryModal.tsx, IClarificationDb.ts, index.ts, ClarificationKnowledgeService.ts, clarificationLibraryDocument.ts]
- "models_ilinksrecommendations": "ILinksRecommendations.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ILinksRecommendations.ts:L1 | neighbors=[8e87d94 feat: Add Links and Recommendat…, IBidLink, IBidRecommendation, ILinksRecommendationsData, index.ts, LinksRecommendationsPage.tsx]
- "models_isystemconfig_isystemconfig": "ISystemConfig" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L125 | neighbors=[accessControl.config.ts, index.ts, ISystemConfig.ts, ClarificationKnowledgeService.ts, clarificationExcelExport.ts, clarificationHelpers.ts]
- "pages_notificationspage": "NotificationsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/NotificationsPage.tsx:L1 | neighbors=[3a3d0a5 new changes, fe3728a smartbid2.0, AppLayout.tsx, ICON_MAP, NotificationsPage(), useNotificationStore.ts]
- "services_accesslogservice_accesslogservice": "AccessLogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AccessLogService.ts:L20 | neighbors=[AppLayout.tsx, AccessLogService.ts, .ensureList(), .getRecent(), ._list(), .logAccess()]
- "services_assetcatalogservice_assetcatalogservice": "AssetCatalogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AssetCatalogService.ts:L9 | neighbors=[EquipmentImportModal.tsx, AIDocumentAnalyzer.tsx, AssetsCatalogPage.tsx, AssetCatalogService.ts, .getAll(), .mapFromSP()]
- "services_bidservice_bidservice_patchbybidnumber": ".patchByBidNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L212 | neighbors=[BidService, .getById(), .getPatchVersion(), ._searchColumns(), .update(), prepareForSave()]
- "services_bidservice_bidservice_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L145 | neighbors=[BidService, .patchByBidNumber(), .ensureColumns(), .getById(), ._searchColumns(), prepareForSave()]
- "services_clarificationknowledgeservice_clarificationknowledgeservice": "ClarificationKnowledgeService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationKnowledgeService.ts:L29 | neighbors=[useClarificationLibrarySync.ts, ClarificationsDbPage.tsx, ClarificationKnowledgeService.ts, ._ensureColumns(), .folderServerRelativeUrl(), .publish()]
- "services_dashboardservice_dashboardservice": "DashboardService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L17 | neighbors=[DashboardPage.tsx, DashboardService.ts, .buildDashboardData(), .calculateDivisionWorkloads(), .calculateKPIs(), .calculateMonthlyVolumes()]
- "services_editcontrolservice": "EditControlService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L1 | neighbors=[c58a13c new-implementations, useEditControl.ts, BidDetailPage.tsx, index.ts, EditControlService, SPService.ts]
- "services_favoritesservice_favoritesservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L27 | neighbors=[FavoritesService, .addBidFavorite(), .addEquipment(), .removeBidFavorite(), .removeEquipment(), .updateEquipment()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-018.json

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
