# Node Description Batch 18 of 86

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

- "common_aidocumentanalyzer_aidocumentanalyzer": "AIDocumentAnalyzer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIDocumentAnalyzer.tsx:L109 | neighbors=[AITab.tsx, AIAnalyzerModal.tsx, AIDocumentAnalyzer.tsx, formatElapsed(), ScopeOfSupplyTab.tsx, TemplatesPage.tsx]
- "common_fileupload": "FileUpload.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/FileUpload.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, FileUpload(), FileUploadProps, CreateRequestPage.tsx]
- "common_filterpanel": "FilterPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/FilterPanel.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, FilterPanel(), FilterPanelProps, BidTrackerPage.tsx]
- "common_personacard_personacard": "PersonaCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PersonaCard.tsx:L13 | neighbors=[ApprovalTab.tsx, BidComments.tsx, ConfidentialAccessModal.tsx, PersonaCard.tsx, CreateRequestPage.tsx, TeamAnalyticsPage.tsx]
- "config_app_config": "app.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/app.config.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 4b576db AI-Integration, 9582626 feat: add Access Log component …, c58a13c new-implementations, fe3728a smartbid2.0, APP_CONFIG]
- "config_defaultfavoritegroups": "defaultFavoriteGroups.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/defaultFavoriteGroups.ts:L1 | neighbors=[e2285cf cont-implementing, getDefaultFavoriteGroups(), makeGroup(), nextId(), index.ts, defaultSystemConfig.ts]
- "config_spfxcontext_usespfxcontext": "useSpfxContext()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/SpfxContext.ts:L9 | neighbors=[OverviewTab.tsx, PeoplePicker.tsx, SpfxContext.ts, Header.tsx, CreateRequestPage.tsx, MembersManagement.tsx]
- "function_app_document_structure_split_sections": "split_sections()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L245 | neighbors=[document_structure.py, build_chunks(), Walk the document once, keeping a headi…, _atx_heading(), _heading(), Walk the document once, keeping a headi…]
- "function_app_function_app_chat_reference_material": "_chat_reference_material()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L870 | neighbors=[function_app.py, chat(), _chat_search(), _document_block(), Hybrid retrieval for chat, deduplicated…, Hybrid retrieval for chat, deduplicated…]
- "function_app_function_app_document_block": "_document_block()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L403 | neighbors=[function_app.py, _chat_reference_material(), Render one retrieved document with the …, _reference_material(), _render_groups(), Render one retrieved document with the …]
- "function_app_function_app_extract_text_or_images": "extract_text_or_images()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L178 | neighbors=[function_app.py, _document_text(), _image_to_png(), _page_to_png(), Prefer extracted text (cheap). For scan…, Prefer extracted text (cheap). For scan…]
- "function_app_function_app_not_this_bid": "_not_this_bid()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L453 | neighbors=[function_app.py, generate_scope(), _bid_ref(), _odata_literal(), Filter clause that keeps the BID being …, suggest_clarifications()]
- "function_app_function_app_past_bid_scope_material": "_past_bid_scope_material()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L553 | neighbors=[function_app.py, generate_scope(), _group_by_document(), _hybrid_search(), _render_groups(), Completed BIDs whose scope resembles th…]
- "function_app_function_app_render_groups": "_render_groups()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L508 | neighbors=[function_app.py, _chat_past_bid_material(), _clarification_library_material(), _clarification_material(), _past_bid_scope_material(), _document_block()]
- "hooks_usecolortheme_usecolortheme": "useColorTheme()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useColorTheme.ts:L4 | neighbors=[BidCostSummary.tsx, OverviewTab.tsx, Sparkline.tsx, KPICard.tsx, useChartTheme.ts, useColorTheme.ts]
- "hooks_userequests": "useRequests.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useRequests.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, useRequests(), IBidRequest.ts, IBidRequest, useRequestStore.ts, useRequestStore]
- "hooks_useslidingindicator_useslidingindicator": "useSlidingIndicator()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useSlidingIndicator.ts:L22 | neighbors=[useSlidingIndicator.ts, SegmentedControl.tsx, BidTrackerPage.tsx, DashboardPage.tsx, FavoritesPage.tsx, UnassignedRequestsPage.tsx]
- "models_iactivitylog": "IActivityLog.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IActivityLog.ts:L1 | neighbors=[AddQuotationModal.tsx, 4c2e63a update smartbid 2.0, IActivityLog, IActivityLogEntry, index.ts, ActivityLogService.ts]
- "models_iassetcatalog_iassetcatalogitem": "IAssetCatalogItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAssetCatalog.ts:L4 | neighbors=[EquipmentImportModal.tsx, IAssetCatalog.ts, index.ts, AssetsCatalogPage.tsx, AssetCatalogService.ts, useAssetCatalogStore.ts]
- "models_ibidstatus_approvalstatus": "ApprovalStatus" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L86 | neighbors=[ApprovalTab.tsx, IApprovalFlow.ts, IBid.ts, IBidApproval.ts, IBidStatus.ts, index.ts]
- "models_ibidtask": "IBidTask.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidTask.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidStatus.ts, BidPhase, IBidTaskDef, TaskStatusType, index.ts]
- "models_ibomcostanalysis": "IBomCostAnalysis.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBomCostAnalysis.ts:L1 | neighbors=[165493f NEW-MODIFIC, e2285cf cont-implementing, BomCostSource, IBomCostAnalysis, IBomCostItem, index.ts]
- "models_iteammember_iteammember": "ITeamMember" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ITeamMember.ts:L3 | neighbors=[ApprovalTab.tsx, index.ts, ITeamMember.ts, BidDetailPage.tsx, CreateRequestPage.tsx, UnassignedRequestsPage.tsx]
- "pages_placeholderpage": "PlaceholderPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PlaceholderPage.tsx:L1 | neighbors=[3a3d0a5 new changes, fe3728a smartbid2.0, PageHeader.tsx, PageHeader(), PlaceholderPage(), PlaceholderPageProps]
- "services_aianalysisservice_aianalysisservice_extractquotation": ".extractQuotation()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L792 | neighbors=[AIAnalysisService, .buildRequest(), .ensureConfigured(), .postJson(), .spreadsheetToText(), .validateQuotationResult()]
- "services_aiauthservice_aiauthservice_getaccesstoken": ".getAccessToken()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L215 | neighbors=[AiAuthService, .acquireInteractive(), .getApp(), .getLoginHint(), .log(), .pickAccount()]
- "services_aiauthservice_aiauthservice_log": ".log()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L68 | neighbors=[AiAuthService, .acquireInteractive(), .clearTokenCache(), .getAccessToken(), .getApp(), .probeScope()]
- "services_bidservice_bidservice_getbyid": ".getById()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L110 | neighbors=[BidService, .delete(), ._parse(), .patchByBidNumber(), .update(), .updateAfterCreate()]
- "services_bidservice_bidservice_patchbybidnumber": ".patchByBidNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L205 | neighbors=[BidService, .getById(), .getPatchVersion(), ._searchColumns(), .update(), .recalculateCostSummaries()]
- "services_bidservice_bidservice_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L138 | neighbors=[BidService, .patchByBidNumber(), .ensureColumns(), .getById(), ._searchColumns(), .updateAfterCreate()]
- "services_notificationlogservice": "NotificationLogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationLogService.ts:L1 | neighbors=[437d8e1 feat: implement notification lo…, DELIVERY_STATUSES, NotificationLogService, SPService.ts, SPService, SystemConfiguration.tsx]
- "services_querycatalogservice_querycatalogservice_loadcatalog": ".loadCatalog()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L27 | neighbors=[QueryCatalogService, .loadFinancialsActiveRegistered(), .parseActiveRegistered(), .parseBomSheet(), .parsePeopleSoftFinancials(), .parseRawSheet()]
- "services_statustrackerservice": "StatusTrackerService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/StatusTrackerService.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, SPService.ts, SPService, ChangeType, IStatusTrackerEntry, StatusTrackerService]
- "settings_notificationmatrix_audienceparts": "audienceParts()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L122 | neighbors=[NotificationMatrix.tsx, pillClass(), pillText(), pillTitle(), reachesTeam(), TeamRuleEditor()]
- "stores_usenotificationstore": "useNotificationStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useNotificationStore.ts:L1 | neighbors=[fe3728a smartbid2.0, Header.tsx, NotificationsPage.tsx, index.ts, NotificationState, useNotificationStore]
- "stores_usesupplierstore_usesupplierstore": "useSupplierStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSupplierStore.ts:L92 | neighbors=[AddQuotationModal.tsx, SupplierCombobox.tsx, useRegisterQuotationSuppliers.ts, QuotationsPage.tsx, SuppliersRegistry.tsx, useSupplierStore.ts]
- "survey3d_createsurveyscene_std": "std()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L87 | neighbors=[createSurveyScene.ts, buildManifold(), buildProceduralVessel(), buildRov(), buildSatellite(), createSurveyScene()]
- "utils_accesscontrol_issuperadmin": "isSuperAdmin()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L23 | neighbors=[AppLayout.tsx, accessControl.ts, isSuperAdminUser(), useAuthStore.ts, canAccessKnowledge(), canManageErn()]
- "utils_analyticshelpers_volumetrend": "volumeTrend()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L177 | neighbors=[AnalyticsPage.tsx, OperationalSummaryPage.tsx, PerformanceTrendsPage.tsx, ReportsPage.tsx, analyticsHelpers.ts, buildPeriodSequence()]
- "utils_bidconfidentiality_getconfidentialmanagers": "getConfidentialManagers()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L42 | neighbors=[ConfidentialAccessModal.tsx, BidDetailPage.tsx, bidConfidentiality.ts, canManageBidConfidentiality(), getConfidentialAllowedPeople(), uniquePeople()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-017.json

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
