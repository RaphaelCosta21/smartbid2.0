# Node Description Batch 5 of 43

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

- "stores_usebidstore_usebidstore": "useBidStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L45 | neighbors=[ImportSourceModal.tsx, useApprovals.ts, useBids.ts, useKPIs.ts, AppLayout.tsx, CommandPalette.tsx]
- "stores_useuistore_useuistore": "useUIStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L31 | neighbors=[AddQuotationModal.tsx, ErnCreateModal.tsx, ErnSearchModal.tsx, QualificationsTab.tsx, useChartTheme.ts, AppLayout.tsx]
- "bid_aitab": "AITab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AITab.tsx:L1 | neighbors=[AITab(), AITabProps, AIDocumentAnalyzer.tsx, AIDocumentAnalyzer(), GlassCard.tsx, GlassCard()]
- "bid_bidactivitylog": "BidActivityLog.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L1 | neighbors=[BidActivityLog(), BidActivityLogProps, getActivityColor(), Timeline.tsx, Timeline(), index.ts]
- "bid_erndetailsmodal": "ErnDetailsModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnDetailsModal.tsx:L1 | neighbors=[ErnDetailsModal(), ErnDetailsModalProps, Row(), stateColor, index.ts, ErnService.ts]
- "bid_logisticsbreakdowntab": "LogisticsBreakdownTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/LogisticsBreakdownTab.tsx:L1 | neighbors=[blankItem(), LogisticsBreakdownTab(), LogisticsBreakdownTabProps, index.ts, currencyHelpers.ts, getCurrencies()]
- "common_advancedcatalogsearch": "AdvancedCatalogSearch.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AdvancedCatalogSearch.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, e2285cf cont-implementing, AdvancedCatalogSearch(), AdvancedCatalogSearchProps, getPhotoUrl(), PhotoThumb()]
- "common_partnumberautocomplete": "PartNumberAutocomplete.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PartNumberAutocomplete.tsx:L1 | neighbors=[ScopeOfSupplyTab.tsx, 0546310 Add dashboard components and st…, 165493f NEW-MODIFIC, e2285cf cont-implementing, PartNumberAutocomplete(), PartNumberAutocompleteProps]
- "components_smartbid20": "SmartBid20.tsx" | kind=code-symbol | source=src/webparts/smartBid20/components/SmartBid20.tsx:L1 | neighbors=[3a3d0a5 new changes, 9e27edd feat: Update AI integration and…, fe3728a smartbid2.0, ISmartBid20Props.ts, ISmartBid20Props, SmartBid20]
- "data_defaultsystemconfig": "defaultSystemConfig.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/data/defaultSystemConfig.ts:L1 | neighbors=[0e653cd more mods, 165493f NEW-MODIFIC, 3c5c37b more-mods, 7d9108e createrequestpage correction, 892c1fc feat: add PeoplePicker componen…, 8e87d94 feat: Add Links and Recommendat…]
- "function_app_function_app_generate_scope": "generate_scope()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L439 | neighbors=[function_app.py, _bad_request(), _caller_upn(), _context_lines(), _document_text(), _model_json()]
- "hooks_usequerysearch": "useQuerySearch.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L1 | neighbors=[165493f NEW-MODIFIC, 1665b01 more features, e2285cf cont-implementing, PartNumberAutocomplete.tsx, EMPTY_RESULTS, useQuerySearch()]
- "layout_commandpalette": "CommandPalette.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/CommandPalette.tsx:L1 | neighbors=[8e87d94 feat: Add Links and Recommendat…, fe3728a smartbid2.0, AppLayout.tsx, CommandPalette(), ICommandItem, useAuthStore.ts]
- "services_quotationservice": "QuotationService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L1 | neighbors=[AddQuotationModal.tsx, 165493f NEW-MODIFIC, b6d954d feat: Enhance AIAnalysisService…, c4e04de lots-implementation, de36cf5 feat: add SmartBid Docs indexer…, BomCostsPage.tsx]
- "utils_formatters_formatcurrency": "formatCurrency()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L3 | neighbors=[AddQuotationModal.tsx, BidCostSummary.tsx, BidEquipmentTable.tsx, BidHoursTable.tsx, OverviewTab.tsx, BidDetailsReportPage.tsx]
- "utils_validators": "validators.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 7d9108e createrequestpage correction, CreateRequestPage.tsx, IValidationResult, sanitizeText()]
- "charts_charttooltip_charttooltip": "ChartTooltip()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/ChartTooltip.tsx:L31 | neighbors=[ChartTooltip.tsx, BidsByDivisionChart.tsx, BidsByStatusChart.tsx, ErnDashboardSection.tsx, AnalyticsPage.tsx, BidDetailsReportPage.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@961eb9349ef06a42f117b4dd82bb85b29783b500": "961eb93 feat: Update AI integration and enhance quotation extraction process" | kind=Commit | source=git | neighbors=[1c19dcd Update API diagnostics and AI c…, AddQuotationModal.tsx, main, de36cf5 feat: add SmartBid Docs indexer…, ai.config.ts, ai.prompts.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@9e27edd626169c57fbad25021446adff88f78983": "9e27edd feat: Update AI integration and authentication flow" | kind=Commit | source=git | neighbors=[401be0c Add EntraTokenTest component fo…, AddQuotationModal.tsx, QualificationsTab.tsx, main, 1c19dcd Update API diagnostics and AI c…, SmartBid20.tsx]
- "common_datatable": "DataTable.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DataTable.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, DataTable(), DataTableColumn, DataTableProps, BidDetailsReportPage.tsx]
- "common_editlockbanner": "EditLockBanner.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EditLockBanner.tsx:L1 | neighbors=[OverviewTab.tsx, QualificationsTab.tsx, 0546310 Add dashboard components and st…, 3c5c37b more-mods, c58a13c new-implementations, EditableTabContent()]
- "common_kpicard_kpicard": "KPICard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/KPICard.tsx:L18 | neighbors=[KPICard.tsx, DashboardKPIRow.tsx, ErnDashboardSection.tsx, AnalyticsPage.tsx, BidDetailsReportPage.tsx, BottleneckAnalysisPage.tsx]
- "config_phases_config": "phases.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L1 | neighbors=[1665b01 more features, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, c4e04de lots-implementation, getAllTasks(), getPhaseConfig()]
- "config_sharepoint_config": "sharepoint.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sharepoint.config.ts:L1 | neighbors=[0e653cd more mods, 165493f NEW-MODIFIC, 1a40896 feat: add SmartBid 2.0 Executiv…, 4b576db AI-Integration, 4c2e63a update smartbid 2.0, 892c1fc feat: add PeoplePicker componen…]
- "dashboard_bidsbydivisionchart": "BidsByDivisionChart.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByDivisionChart.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ChartTooltip.tsx, ChartTooltip(), GlassCard.tsx]
- "dashboard_bidsbystatuschart": "BidsByStatusChart.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByStatusChart.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ChartTooltip.tsx, ChartTooltip(), GlassCard.tsx]
- "hooks_usekpis": "useKPIs.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useKPIs.ts:L1 | neighbors=[0e653cd more mods, 8e87d94 feat: Add Links and Recommendat…, fe3728a smartbid2.0, BidKPIs, useKPIs(), useBidStore.ts]
- "hooks_usestatuscolors_usestatuscolors": "useStatusColors()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useStatusColors.ts:L20 | neighbors=[BidCard.tsx, DashboardActivity.tsx, EngHoursRanking.tsx, ErnDashboardSection.tsx, useStatusColors.ts, AnalyticsPage.tsx]
- "models_ibidtemplate_ibidtemplate": "IBidTemplate" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidTemplate.ts:L8 | neighbors=[BidTemplateImport.tsx, ImportSourceModal.tsx, useTemplates.ts, IBidTemplate.ts, index.ts, TemplatesPage.tsx]
- "services_attachmentservice": "AttachmentService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L1 | neighbors=[CertificationsBreakdownTab.tsx, ScopeOfSupplyTab.tsx, 165493f NEW-MODIFIC, 4c2e63a update smartbid 2.0, 7d9108e createrequestpage correction, CreateRequestPage.tsx]
- "services_clarificationdbservice_clarificationdbservice": "ClarificationDbService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L12 | neighbors=[BidStatusPhasePanel.tsx, ImportClarificationModal.tsx, ClarificationsDbPage.tsx, ClarificationDbService.ts, .addMany(), .create()]
- "services_dashboardservice": "DashboardService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, c4e04de lots-implementation, DashboardPage.tsx, IDashboard.ts, IDashboardData, IDashboardKPI]
- "services_doclibrarycatalogservice_doclibrarycatalogservice": "DocLibraryCatalogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L26 | neighbors=[DocLibraryCatalog.tsx, DocLibraryCatalogService.ts, .buildPreviewUrl(), .deleteFile(), .downloadFileAsFile(), .ensureColumns()]
- "services_favoritesservice_favoritesservice": "FavoritesService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L21 | neighbors=[FavoritesService.ts, .addBidFavorite(), .addEquipment(), .getAll(), ._list(), .removeBidFavorite()]
- "utils_formatters_formatdatetime": "formatDateTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L36 | neighbors=[BidActivityLog.tsx, BidComments.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, DocumentsTab.tsx, NotesTab.tsx]
- "bid_bidcomments": "BidComments.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidComments.tsx:L1 | neighbors=[BidComments(), BidCommentsProps, PersonaCard.tsx, PersonaCard(), index.ts, formatters.ts]
- "common_divisionbadge": "DivisionBadge.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DivisionBadge.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, DivisionBadge(), DivisionBadgeProps, useConfigStore.ts]
- "common_hoursimportpreview": "HoursImportPreview.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/HoursImportPreview.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 3c5c37b more-mods, 66dbcee feat: Implement contingency cal…, HoursCategory, HoursImportPreview(), HoursImportPreviewProps]
- "common_integrateddivisiontabs": "IntegratedDivisionTabs.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L1 | neighbors=[b6d954d feat: Enhance AIAnalysisService…, c4e04de lots-implementation, c58a13c new-implementations, IntegratedDivision, IntegratedDivisionTabs(), IntegratedDivisionTabsProps]
- "common_scopeimportpreview": "ScopeImportPreview.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ScopeImportPreview.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 3c5c37b more-mods, b6d954d feat: Enhance AIAnalysisService…, ImportSourceModal.tsx, IScopeImportResult, ScopeImportPreview()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-004.json

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
