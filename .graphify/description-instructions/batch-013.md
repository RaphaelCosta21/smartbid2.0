# Node Description Batch 14 of 86

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

- "services_bomcostanalysisservice_bomcostanalysisservice": "BomCostAnalysisService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BomCostAnalysisService.ts:L13 | neighbors=[CostSearchModal.tsx, EquipmentImportModal.tsx, BomCostsPage.tsx, BomCostAnalysisService.ts, .deleteOne(), .getAll()]
- "services_editcontrolservice_editcontrolservice": "EditControlService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L11 | neighbors=[useEditControl.ts, BidDetailPage.tsx, EditControlService.ts, .acquireLock(), .getLocks(), ._list()]
- "services_pastbidknowledgeservice_pastbidknowledgeservice": "PastBidKnowledgeService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PastBidKnowledgeService.ts:L36 | neighbors=[usePastBidPublisher.ts, PastBidDrawer.tsx, PastBidsPage.tsx, PastBidKnowledgeService.ts, ._ensureColumns(), .fileUrl()]
- "services_querycatalogservice": "QueryCatalogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L1 | neighbors=[9cc3475 feat: Integrate Financials Acti…, e2285cf cont-implementing, index.ts, QueryCatalogService, SPService.ts, SPService]
- "services_requestservice_requestservice": "RequestService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L12 | neighbors=[CreateRequestPage.tsx, UnassignedRequestsPage.tsx, RequestService.ts, .assignRequest(), .bidToRequest(), .createRequest()]
- "services_technicalproposalknowledgeservice_technicalproposalknowledgeservice": "TechnicalProposalKnowledgeService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L37 | neighbors=[useTechnicalProposalPublisher.ts, TechnicalProposalKnowledgeService.ts, ._buildMetadata(), ._createFolderIfMissing(), ._ensureColumns(), ._ensureFolder()]
- "smartbid20_smartbid20webpart_smartbid20webpart": "SmartBid20WebPart" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L23 | neighbors=[SmartBid20WebPart.ts, BaseClientSideWebPart, .dataVersion(), ._getEnvironmentMessage(), .getPropertyPaneConfiguration(), .onDispose()]
- "stores_useernstore_useernstore": "useErnStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useErnStore.ts:L18 | neighbors=[DashboardBidTable.tsx, ErnDashboardSection.tsx, useDashboardSync.ts, useErn.ts, useLiveOverview.ts, LivePulse.tsx]
- "survey3d_createsurveyscene_createsurveyscene": "createSurveyScene()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L283 | neighbors=[createSurveyScene.ts, buildManifold(), buildProceduralVessel(), buildRov(), buildSatellite(), glow()]
- "template_templatepreview": "TemplatePreview.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplatePreview.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, c4e04de lots-implementation, TemplatesPage.tsx, IBidTemplate.ts]
- "utils_formatters_getdaysuntil": "getDaysUntil()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L50 | neighbors=[OverviewTab.tsx, DashboardBidTable.tsx, DashboardService.ts, approvalHelpers.ts, ernHelpers.ts, formatters.ts]
- "utils_notificationevents_derivebidnotifications": "deriveBidNotifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L127 | neighbors=[BidDetailPage.tsx, notificationEvents.ts, fmtDate(), getClosingEventKey(), getNewActivityEntries(), isCanceledStatus()]
- "utils_pastbiddocument_lines": "lines()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L117 | neighbors=[pastBidDocument.ts, classification(), hours(), identification(), libraryReference(), pricing()]
- "utils_statushelpers_isterminalstatus": "isTerminalStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L52 | neighbors=[ApprovalTab.tsx, BidFavoriteButton.tsx, BidTimeline.tsx, OverviewTab.tsx, RevisionsTab.tsx, ImportSourceModal.tsx]
- "approval_approvalmatrix": "ApprovalMatrix.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalMatrix.tsx:L1 | neighbors=[ApprovalMatrix(), ApprovalMatrixProps, IBidApproval.ts, IApprovalChain, 0546310 Add dashboard components and st…, 3a3d0a5 new changes]
- "bid_bidequipmenttable": "BidEquipmentTable.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidEquipmentTable.tsx:L1 | neighbors=[BidEquipmentTable(), BidEquipmentTableProps, index.ts, formatters.ts, formatCurrency(), 3a3d0a5 new changes]
- "bid_bidtabheader_bidtabheader": "BidTabHeader()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L40 | neighbors=[AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, BidTabHeader.tsx, CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx]
- "bid_bidtaskchecklist": "BidTaskChecklist.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTaskChecklist.tsx:L1 | neighbors=[BidStatusPhasePanel.tsx, BidTaskChecklist(), BidTaskChecklistProps, index.ts, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0]
- "bid_clarificationsuggestionsmodal": "ClarificationSuggestionsModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ClarificationSuggestionsModal.tsx:L1 | neighbors=[ClarificationSuggestionsModal(), ClarificationSuggestionsModalProps, index.ts, QualificationsTab.tsx, 4b576db AI-Integration, 953278b feat: add ApprovalDueImpactSect…]
- "bidexcelexport_excelstyles_qtyfmt": "qtyFmt()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L86 | neighbors=[excelStyles.ts, assetsSheet.ts, certificationsSheet.ts, hoursSheet.ts, logisticsSheet.ts, prepMobSheet.ts]
- "bidexcelexport_excelstyles_xlsheet_font": ".font()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L291 | neighbors=[XlSheet, .band(), .banner(), .keyValue(), .note(), .noticeStrip()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@401be0c3f22475e7c4c87b2bad5ff6affb4b176e": "401be0c Add EntraTokenTest component for Azure API diagnostics" | kind=Commit | source=git | neighbors=[feat/easi-modules-pages, main, 9e27edd feat: Update AI integration and…, function_app.py, TemplatesPage.tsx, AIAnalysisService.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@86dba8c04252b71c5fc99fa8d13adcb7b937d20b": "86dba8c feat(survey): restore three.js 3D diorama for the System view with OII …" | kind=Commit | source=git | neighbors=[33536c2 feat(survey): 2.5D depth view o…, main, 50a29c7 feat(survey): Full Survey Sprea…, sharepoint.config.ts, SurveySystemPage.tsx, createSurveyScene.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@b07a797de86313cec5042b878c70e541bac55cf8": "b07a797 feat(survey): toggle to hide connection lines and show only equipment" | kind=Commit | source=git | neighbors=[54594e6 style(survey): neutral silver f…, main, 4c720fd style(survey): IMR-style proced…, cableFlow.ts, createSurveyScene.ts, focusController.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@dbc974b8371d53e5f0e855d3b62dcdf3692211c6": "dbc974b Refactor email template HTML for improved readability and maintainabili…" | kind=Commit | source=git | neighbors=[main, 437d8e1 feat: implement notification lo…, notifications.config.ts, NotificationDispatchService.ts, NotificationMatrix.tsx, SystemConfiguration.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@f393a0974756e0a44713b55b5e48e258f3ad2074": "f393a09 feat: add validation for quotation line item fields and improve error h…" | kind=Commit | source=git | neighbors=[bda0c32 style: Improve code formatting …, AddQuotationModal.tsx, main, aaa091c Add hooks for KPI targets and l…, QuotationsPage.tsx, QuotationService.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@fbe2c0e98471289519e55e3f9cb9917e9fb2ceae": "fbe2c0e feat(survey): remove division/service line/status filters and family ta…" | kind=Commit | source=git | neighbors=[512f7b1 feat(survey): full-bleed 3D sea…, main, 5ba1094 style(survey): spread card pure…, useSurveyPortal.ts, SurveyEquipmentPage.tsx, SurveySystemPage.tsx]
- "common_columnfilter": "ColumnFilter.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ColumnFilter.tsx:L1 | neighbors=[953278b feat: add ApprovalDueImpactSect…, ColumnFilter(), ColumnFilterProps, PANEL_STYLE, MultiSelectDropdown.tsx, MultiSelectOption]
- "common_peoplepicker": "PeoplePicker.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PeoplePicker.tsx:L1 | neighbors=[ErnCreateModal.tsx, 892c1fc feat: add PeoplePicker componen…, IGraphResult, IPickedPerson, PeoplePicker(), PeoplePickerProps]
- "common_prioritybadge": "PriorityBadge.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PriorityBadge.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PriorityBadge(), PriorityBadgeProps, constants.ts]
- "common_querycatalogloadingbanner": "QueryCatalogLoadingBanner.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/QueryCatalogLoadingBanner.tsx:L1 | neighbors=[9cc3475 feat: Integrate Financials Acti…, b6d954d feat: Enhance AIAnalysisService…, QueryCatalogLoadingBanner(), useFavoritesStore.ts, useFavoritesStore, useQueryCatalogStore.ts]
- "common_suggestioninput": "SuggestionInput.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SuggestionInput.tsx:L1 | neighbors=[5c35e8d feat: Implement Qualification L…, SuggestionInput(), SuggestionInputProps, idGenerator.ts, makeId(), QualificationCategoryInput.tsx]
- "config_bidroles_config": "bidRoles.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/bidRoles.config.ts:L1 | neighbors=[e61a9d3 feat: add notification system f…, BID_ROLE_META, getBidRoleLabel(), getBidRolesForSector(), IBidRoleMeta, IUser.ts]
- "config_bidtabs_config": "bidTabs.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/bidTabs.config.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, BID_TAB_GROUP, BID_TAB_GROUPS, BidTab, IBidTabDef, IBidTabGroupDef]
- "dashboard_divisionworkload": "DivisionWorkload.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DivisionWorkload.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, GlassCard.tsx, GlassCard(), DivisionWorkload(), DivisionWorkloadProps]
- "dashboard_monthlyvolumechart": "MonthlyVolumeChart.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/MonthlyVolumeChart.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, GlassCard.tsx, GlassCard(), MonthlyVolumeChart(), MonthlyVolumeChartProps]
- "data_mockrequests": "mockRequests.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockRequests.ts:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 7d9108e createrequestpage correction, f3095f2 feat: add ApprovalTab component…, mockRequests]
- "function_app_function_app_chat_past_bid_material": "_chat_past_bid_material()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L948 | neighbors=[function_app.py, chat(), _group_by_document(), _hybrid_search(), _odata_literal(), _parent_key()]
- "function_app_function_app_clarification_library_material": "_clarification_library_material()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L578 | neighbors=[function_app.py, chat(), _group_by_document(), _hybrid_search(), _render_groups(), generate_scope()]
- "hooks_useconfigphases": "useConfigPhases.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useConfigPhases.ts:L1 | neighbors=[BidPhaseProgress.tsx, OverviewTab.tsx, c58a13c new-implementations, IConfigPhase, useConfigPhases(), useConfigStore.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-013.json

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
