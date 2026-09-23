# Node Description Batch 7 of 43

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

- "function_app_function_app_extract_quotation": "extract_quotation()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L535 | neighbors=[function_app.py, _bad_request(), _caller_upn(), _document_text(), _model_json(), _now_iso()]
- "models_idashboard": "IDashboard.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDashboard.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, DivisionWorkload.tsx, MonthlyVolumeChart.tsx, IDashboardData, IDashboardKPI, IDivisionWorkload]
- "models_iuser_ipersonref": "IPersonRef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L26 | neighbors=[ApprovalTab.tsx, IApprovalFlow.ts, IBid.ts, IBidApproval.ts, IBidComment.ts, IBidRequest.ts]
- "pages_datasheetspage": "DatasheetsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/DatasheetsPage.tsx:L1 | neighbors=[8e87d94 feat: Add Links and Recommendat…, AppLayout.tsx, useCurrentUser.ts, useCurrentUser(), DocLibraryCatalog.tsx, DocLibraryCatalog()]
- "pages_faqpage": "FaqPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FaqPage.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, AppLayout.tsx, PageHeader.tsx, PageHeader()]
- "pages_manualscatalogspage": "ManualsCatalogsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ManualsCatalogsPage.tsx:L1 | neighbors=[8e87d94 feat: Add Links and Recommendat…, AppLayout.tsx, useCurrentUser.ts, useCurrentUser(), DocLibraryCatalog.tsx, DocLibraryCatalog()]
- "services_aiauthservice_aiauthservice_getapp": ".getApp()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L134 | neighbors=[AiAuthService, .clearTokenCache(), .getAccessToken(), .getAuthority(), .getRedirectUri(), .isConfigured()]
- "services_assetcatalogservice": "AssetCatalogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AssetCatalogService.ts:L1 | neighbors=[EquipmentImportModal.tsx, 0e653cd more mods, AIDocumentAnalyzer.tsx, AssetsCatalogPage.tsx, IAssetCatalog.ts, IAssetCatalogItem]
- "services_editcontrolservice_editcontrolservice": "EditControlService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L11 | neighbors=[useEditControl.ts, BidDetailPage.tsx, EditControlService.ts, .acquireLock(), .getLocks(), ._list()]
- "services_requestservice_requestservice": "RequestService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L11 | neighbors=[Sidebar.tsx, CreateRequestPage.tsx, UnassignedRequestsPage.tsx, RequestService.ts, .assignRequest(), .bidToRequest()]
- "smartbid20_smartbid20webpart_smartbid20webpart": "SmartBid20WebPart" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L20 | neighbors=[SmartBid20WebPart.ts, BaseClientSideWebPart, .dataVersion(), ._getEnvironmentMessage(), .getPropertyPaneConfiguration(), .onDispose()]
- "stores_useernstore": "useErnStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useErnStore.ts:L1 | neighbors=[892c1fc feat: add PeoplePicker componen…, ErnDashboardSection.tsx, useErn.ts, BidTrackerPage.tsx, index.ts, ErnService.ts]
- "stores_usequerycatalogstore_usequerycatalogstore": "useQueryCatalogStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L130 | neighbors=[CostSearchModal.tsx, EquipmentImportModal.tsx, AdvancedCatalogSearch.tsx, QueryCatalogLoadingBanner.tsx, useQuerySearch.ts, BomCostsPage.tsx]
- "template_templatecard": "TemplateCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateCard.tsx:L1 | neighbors=[165493f NEW-MODIFIC, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, c4e04de lots-implementation, TemplatesPage.tsx, IBidTemplate.ts]
- "utils_aicontext": "aiContext.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiContext.ts:L1 | neighbors=[AITab.tsx, QualificationsTab.tsx, 4b576db AI-Integration, IAIAnalysis.ts, IAIAnalysisContext, IBid.ts]
- "utils_analyticshelpers_buildperiodsequence": "buildPeriodSequence()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L119 | neighbors=[analyticsHelpers.ts, addPeriod(), periodKey(), periodStart(), completionTimeTrend(), ernTrend()]
- "utils_bidhelpers_isactivebid": "isActiveBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L4 | neighbors=[EngHoursRanking.tsx, BidBoardPage.tsx, BidTrackerPage.tsx, DashboardPage.tsx, FlowBoardPage.tsx, MyDashboardPage.tsx]
- "approval_approvaltimeline": "ApprovalTimeline.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalTimeline.tsx:L1 | neighbors=[ApprovalTimeline(), ApprovalTimelineProps, Timeline.tsx, Timeline(), IBidApproval.ts, IApprovalChain]
- "bid_bidequipmenttable": "BidEquipmentTable.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidEquipmentTable.tsx:L1 | neighbors=[BidEquipmentTable(), BidEquipmentTableProps, index.ts, formatters.ts, formatCurrency(), 3a3d0a5 new changes]
- "bid_bidphaseprogress": "BidPhaseProgress.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidPhaseProgress.tsx:L1 | neighbors=[BidPhaseProgress(), BidPhaseProgressProps, useConfigPhases.ts, useConfigPhases(), 0e653cd more mods, 3a3d0a5 new changes]
- "bid_exportclarificationmodal": "ExportClarificationModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ExportClarificationModal.tsx:L1 | neighbors=[ExportClarificationModal(), ExportClarificationModalProps, ExportMode, index.ts, clarificationExport.ts, exportClarificationsToExcel()]
- "charts_sparkline": "Sparkline.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/Sparkline.tsx:L1 | neighbors=[Sparkline(), SparklineProps, c271ce8 Refactor code structure for imp…, AnalyticsPage.tsx, FollowUpPage.tsx, PerformanceTrendsPage.tsx]
- "common_datatable_datatable": "DataTable()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DataTable.tsx:L20 | neighbors=[DataTable.tsx, BidDetailsReportPage.tsx, BidResultsPage.tsx, BidTrackerPage.tsx, FollowUpPage.tsx, PeriodPerformancePage.tsx]
- "common_peoplepicker": "PeoplePicker.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PeoplePicker.tsx:L1 | neighbors=[ErnCreateModal.tsx, 892c1fc feat: add PeoplePicker componen…, IGraphResult, IPickedPerson, PeoplePicker(), PeoplePickerProps]
- "common_personacard": "PersonaCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PersonaCard.tsx:L1 | neighbors=[ApprovalTab.tsx, BidComments.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PersonaCard(), PersonaCardProps]
- "common_timeline": "Timeline.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/Timeline.tsx:L1 | neighbors=[ApprovalTimeline.tsx, BidActivityLog.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, Timeline(), TimelineItem]
- "config_routes_config": "routes.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/routes.config.ts:L1 | neighbors=[0e653cd more mods, 8e87d94 feat: Add Links and Recommendat…, c271ce8 Refactor code structure for imp…, c4e04de lots-implementation, de36cf5 feat: add SmartBid Docs indexer…, e2285cf cont-implementing]
- "dashboard_divisionworkload": "DivisionWorkload.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DivisionWorkload.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, GlassCard.tsx, GlassCard(), DivisionWorkload(), DivisionWorkloadProps]
- "dashboard_monthlyvolumechart": "MonthlyVolumeChart.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/MonthlyVolumeChart.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, GlassCard.tsx, GlassCard(), MonthlyVolumeChart(), MonthlyVolumeChartProps]
- "dashboard_recentactivity": "RecentActivity.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/RecentActivity.tsx:L1 | neighbors=[3a3d0a5 new changes, fe3728a smartbid2.0, GlassCard.tsx, GlassCard(), RecentActivity(), RecentActivityProps]
- "dashboard_upcomingdeadlines": "UpcomingDeadlines.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/UpcomingDeadlines.tsx:L1 | neighbors=[3a3d0a5 new changes, fe3728a smartbid2.0, GlassCard.tsx, GlassCard(), UpcomingDeadlines(), UpcomingDeadlinesProps]
- "data_mockrequests": "mockRequests.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockRequests.ts:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 7d9108e createrequestpage correction, f3095f2 feat: add ApprovalTab component…, mockRequests]
- "function_app_document_structure_build_chunks": "build_chunks()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L368 | neighbors=[document_structure.py, metadata_header(), outline(), _render(), _split_body(), split_sections()]
- "function_app_document_structure_heading": "_heading()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L180 | neighbors=[document_structure.py, _has_word(), _is_title_case(), _is_upper(), _letter_count(), _numbered_title()]
- "function_app_function_app_chat": "chat()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L692 | neighbors=[function_app.py, _caller_upn(), _chat_bad_request(), _chat_messages(), _chat_reference_material(), _model_json()]
- "hooks_useconfigphases": "useConfigPhases.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useConfigPhases.ts:L1 | neighbors=[BidPhaseProgress.tsx, OverviewTab.tsx, c58a13c new-implementations, IConfigPhase, useConfigPhases(), useConfigStore.ts]
- "hooks_usedebounce": "useDebounce.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDebounce.ts:L1 | neighbors=[ImportClarificationModal.tsx, fe3728a smartbid2.0, useDebounce(), DocLibraryCatalog.tsx, AssetsCatalogPage.tsx, BidTrackerPage.tsx]
- "hooks_useern": "useErn.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useErn.ts:L1 | neighbors=[892c1fc feat: add PeoplePicker componen…, useErn(), UseErnResult, index.ts, ErnService.ts, ErnService]
- "hooks_useexport": "useExport.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useExport.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, useExport(), IBidExport.ts, IExportOptions, IExportResult, index.ts]
- "hooks_usetemplates": "useTemplates.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useTemplates.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, c4e04de lots-implementation, useTemplates(), IBidTemplate.ts, IBidTemplate, useTemplateStore.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-006.json

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
