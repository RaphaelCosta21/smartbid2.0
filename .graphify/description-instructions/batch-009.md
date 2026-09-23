# Node Description Batch 10 of 43

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

- "models_ibidstatus_approvalstatus": "ApprovalStatus" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L85 | neighbors=[ApprovalTab.tsx, IApprovalFlow.ts, IBid.ts, IBidApproval.ts, IBidStatus.ts, index.ts]
- "models_ibidstatus_bidpriority": "BidPriority" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L81 | neighbors=[IBid.ts, IBidRequest.ts, IBidStatus.ts, index.ts, CreateRequestPage.tsx, businessDays.ts]
- "models_ibidtask": "IBidTask.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidTask.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidStatus.ts, BidPhase, IBidTaskDef, TaskStatusType, index.ts]
- "models_ibomcostanalysis": "IBomCostAnalysis.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBomCostAnalysis.ts:L1 | neighbors=[165493f NEW-MODIFIC, e2285cf cont-implementing, BomCostSource, IBomCostAnalysis, IBomCostItem, index.ts]
- "models_iclarificationdb_iclarificationdbitem": "IClarificationDbItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IClarificationDb.ts:L7 | neighbors=[BidStatusPhasePanel.tsx, ImportClarificationModal.tsx, IClarificationDb.ts, index.ts, ClarificationsDbPage.tsx, ClarificationDbService.ts]
- "models_iern": "IErn.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IErn.ts:L1 | neighbors=[892c1fc feat: add PeoplePicker componen…, ErnDeadlineState, IErn, IErnCreateData, IErnCreateResult, index.ts]
- "models_iteammember_iteammember": "ITeamMember" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ITeamMember.ts:L3 | neighbors=[ApprovalTab.tsx, index.ts, ITeamMember.ts, BidDetailPage.tsx, CreateRequestPage.tsx, UnassignedRequestsPage.tsx]
- "pages_placeholderpage": "PlaceholderPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PlaceholderPage.tsx:L1 | neighbors=[3a3d0a5 new changes, fe3728a smartbid2.0, PageHeader.tsx, PageHeader(), PlaceholderPage(), PlaceholderPageProps]
- "reports_exportbar": "ExportBar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ExportBar.tsx:L1 | neighbors=[c271ce8 Refactor code structure for imp…, BidDetailsReportPage.tsx, OperationalSummaryPage.tsx, PeriodPerformancePage.tsx, ExportBar(), ExportBarProps]
- "services_aianalysisservice_aianalysisservice_buildrequest": ".buildRequest()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L290 | neighbors=[AIAnalysisService, .analyzeDocument(), .analyzeDocumentForTemplate(), .fileToBase64(), .extractDocumentMetadata(), .extractQuotation()]
- "services_aianalysisservice_aianalysisservice_ensureconfigured": ".ensureConfigured()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L230 | neighbors=[AIAnalysisService, .analyzeDocument(), .analyzeDocumentForTemplate(), .chat(), .extractDocumentMetadata(), .extractQuotation()]
- "services_aiauthservice_aiauthservice_getaccesstoken": ".getAccessToken()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L215 | neighbors=[AiAuthService, .acquireInteractive(), .getApp(), .getLoginHint(), .log(), .pickAccount()]
- "services_aiauthservice_aiauthservice_log": ".log()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L68 | neighbors=[AiAuthService, .acquireInteractive(), .clearTokenCache(), .getAccessToken(), .getApp(), .probeScope()]
- "services_assetcatalogservice_assetcatalogservice": "AssetCatalogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AssetCatalogService.ts:L9 | neighbors=[EquipmentImportModal.tsx, AIDocumentAnalyzer.tsx, AssetsCatalogPage.tsx, AssetCatalogService.ts, .getAll(), .mapFromSP()]
- "services_bidservice_bidservice_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L124 | neighbors=[BidService, .patchByBidNumber(), .ensureColumns(), .getById(), ._searchColumns(), .updateAfterCreate()]
- "services_querycatalogservice": "QueryCatalogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L1 | neighbors=[e2285cf cont-implementing, index.ts, QueryCatalogService, SPService.ts, SPService, useQueryCatalogStore.ts]
- "services_statustrackerservice": "StatusTrackerService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/StatusTrackerService.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, SPService.ts, SPService, ChangeType, IStatusTrackerEntry, StatusTrackerService]
- "stores_usenotificationstore": "useNotificationStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useNotificationStore.ts:L1 | neighbors=[fe3728a smartbid2.0, Header.tsx, NotificationsPage.tsx, index.ts, NotificationState, useNotificationStore]
- "utils_analyticshelpers_volumetrend": "volumeTrend()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L176 | neighbors=[AnalyticsPage.tsx, OperationalSummaryPage.tsx, PerformanceTrendsPage.tsx, ReportsPage.tsx, analyticsHelpers.ts, buildPeriodSequence()]
- "utils_bomparser_parsebomexcel": "parseBomExcel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L263 | neighbors=[BomCostsPage.tsx, bomParser.ts, assignParentIds(), cleanCsvValue(), emptyItem(), findColumns()]
- "bid_addquotationmodal_addquotationmodal": "AddQuotationModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L69 | neighbors=[AddQuotationModal.tsx, blankLineItem(), AssetsBreakdownTab.tsx, CostSearchModal.tsx, QuotationsPage.tsx]
- "bid_bidexportbutton": "BidExportButton.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidExportButton.tsx:L1 | neighbors=[BidExportButton(), BidExportButtonProps, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, BidDetailPage.tsx]
- "bid_emptysection_emptysection": "EmptySection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EmptySection.tsx:L4 | neighbors=[DocumentsTab.tsx, EmptySection.tsx, NotesTab.tsx, OverviewTab.tsx, QualificationsTab.tsx]
- "common_collapsiblesidebar_collapsiblesidebar": "CollapsibleSidebar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/CollapsibleSidebar.tsx:L23 | neighbors=[CollapsibleSidebar.tsx, BidDetailPage.tsx, FavoritesPage.tsx, QuotationsPage.tsx, SystemConfiguration.tsx]
- "common_confirmdialog": "ConfirmDialog.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ConfirmDialog.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ConfirmDialog(), ConfirmDialogProps, CreateRequestPage.tsx]
- "common_countdowntimer": "CountdownTimer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/CountdownTimer.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, CountdownTimer(), CountdownTimerProps, TimelinePage.tsx]
- "common_divisionbadge_divisionbadge": "DivisionBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DivisionBadge.tsx:L10 | neighbors=[DivisionBadge.tsx, BidResultsPage.tsx, BottleneckAnalysisPage.tsx, FollowUpPage.tsx, ToolingReportPage.tsx]
- "common_fileupload": "FileUpload.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/FileUpload.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, FileUpload(), FileUploadProps, CreateRequestPage.tsx]
- "common_filterpanel": "FilterPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/FilterPanel.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, FilterPanel(), FilterPanelProps, BidTrackerPage.tsx]
- "common_personacard_personacard": "PersonaCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PersonaCard.tsx:L13 | neighbors=[ApprovalTab.tsx, BidComments.tsx, PersonaCard.tsx, CreateRequestPage.tsx, TeamAnalyticsPage.tsx]
- "common_photolightbox_photolightbox": "PhotoLightbox()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PhotoLightbox.tsx:L14 | neighbors=[EquipmentImportModal.tsx, AdvancedCatalogSearch.tsx, PhotoLightbox.tsx, FavoritesPage.tsx, QueryConsultingPage.tsx]
- "common_richtexteditor": "RichTextEditor.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/RichTextEditor.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, RichTextEditor(), RichTextEditorProps, CreateRequestPage.tsx]
- "components_ismartbid20props": "ISmartBid20Props.ts" | kind=code-symbol | source=src/webparts/smartBid20/components/ISmartBid20Props.ts:L1 | neighbors=[3a3d0a5 new changes, fe3728a smartbid2.0, ISmartBid20Props, SmartBid20.tsx, SmartBid20WebPart.ts]
- "config_kpi_config": "kpi.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/kpi.config.ts:L1 | neighbors=[1665b01 more features, 4c2e63a update smartbid 2.0, DEFAULT_KPI_TARGETS, IKPIDef, KPI_DEFINITIONS]
- "function_app_document_structure_is_boilerplate": "_is_boilerplate()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L137 | neighbors=[document_structure.py, _has_letters(), _normalize(), Digit masking is what catches a running…, strip_boilerplate()]
- "function_app_function_app_caller_upn": "_caller_upn()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L416 | neighbors=[function_app.py, chat(), extract_quotation(), generate_scope(), UPN of the authenticated caller, from t…]
- "function_app_function_app_chat_reference_material": "_chat_reference_material()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L613 | neighbors=[function_app.py, chat(), _chat_search(), _document_block(), Hybrid retrieval for chat, deduplicated…]
- "function_app_function_app_model_json": "_model_json()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L230 | neighbors=[function_app.py, chat(), extract_quotation(), generate_scope(), Parse the model's JSON answer. A reason…]
- "hooks_useeditcontrol_useeditcontrol": "useEditControl()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useEditControl.ts:L29 | neighbors=[OverviewTab.tsx, QualificationsTab.tsx, useEditControl.ts, BidDetailPage.tsx, TemplateEditor.tsx]
- "hooks_useresponsive": "useResponsive.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useResponsive.ts:L1 | neighbors=[fe3728a smartbid2.0, ChatAssistant.tsx, Breakpoints, useResponsive(), Header.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-009.json

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
