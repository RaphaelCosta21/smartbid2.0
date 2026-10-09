# Node Description Batch 3 of 86

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

- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@c58a13c5a45bb31d2f0775d0d9fe0fb925ca73c8": "c58a13c new-implementations" | kind=Commit | source=git | neighbors=[0e653cd more mods, AITab.tsx, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, BidPhaseProgress.tsx] | lang=pt
- "bidexcelexport_index": "index.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/index.ts:L1 | neighbors=[BidExportTab.tsx, RevisionsTab.tsx, getCurrentRevisionLetter(), context.ts, BID_EXCEL_SHEETS, getBidApprovalState()] | lang=en
- "common_emptystate": "EmptyState.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EmptyState.tsx:L1 | neighbors=[BidActivityLog.tsx, EquipmentImportModal.tsx, ImportClarificationModal.tsx, ImportQualificationModal.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0] | lang=en
- "knowledge_qualificationtablemodal": "QualificationTableModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L1 | neighbors=[5c35e8d feat: Implement Qualification L…, aa081f9 refactor: Improve code formatti…, QualificationLibraryView.tsx, ConfirmDialog.tsx, ConfirmDialog(), SuggestionInput.tsx] | lang=en
- "bid_bidcostsummary": "BidCostSummary.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidCostSummary.tsx:L1 | neighbors=[BidCostSummary(), BidCostSummaryProps, BidFxNote.tsx, BidFxNote(), BidTabHeader.tsx, BidTabHeader()] | lang=en
- "bid_bidexporttab": "BidExportTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidExportTab.tsx:L1 | neighbors=[BidExportTab(), BidExportTabProps, ICheck, plural(), SHEET_ACCENTS, SHEET_ICONS] | lang=en
- "layout_sidebar": "Sidebar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L1 | neighbors=[0e653cd more mods, 1665b01 more features, 2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 3c5c37b more-mods, 4c2e63a update smartbid 2.0] | lang=en
- "stores_useuistore_useuistore": "useUIStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L42 | neighbors=[AddQuotationModal.tsx, ApprovalTab.tsx, BidConfidentialButton.tsx, BidExportTab.tsx, BidFavoriteButton.tsx, DocumentsTab.tsx] | lang=en
- "utils_clarificationhelpers": "clarificationHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L1 | neighbors=[ExportClarificationModal.tsx, OverviewTab.tsx, QualificationsTab.tsx, ScopeOfSupplyTab.tsx, 02c1391 feat: Add supplier management f…, 5c35e8d feat: Implement Qualification L…] | lang=en
- "hooks_usecurrentuser": "useCurrentUser.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useCurrentUser.ts:L1 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidCard.tsx, BidConfidentialButton.tsx, BidFavoriteButton.tsx, BidStatusPhasePanel.tsx] | lang=en
- "pages_analyticspage": "AnalyticsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AnalyticsPage.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 8267c28 i18n: translate EASI, suppliers…, c271ce8 Refactor code structure for imp…, ddf6c96 Merge branch 'feat/survey-knowl…] | lang=en
- "bid_documentstab": "DocumentsTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/DocumentsTab.tsx:L1 | neighbors=[DocumentsTab(), DocumentsTabProps, isLocalUrl(), EmptySection.tsx, EmptySection(), TechnicalProposalChip.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@e2285cf0f6b38404d3c8e0a7d9540ca75ce87eef": "e2285cf cont-implementing" | kind=Commit | source=git | neighbors=[c58a13c new-implementations, AITab.tsx, AssetsBreakdownTab.tsx, CostSearchModal.tsx, ScopeOfSupplyTab.tsx, feat/easi-modules-pages] | lang=en
- "common_pageheader": "PageHeader.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PageHeader.tsx:L1 | neighbors=[fe3728a smartbid2.0, PageHeader(), PageHeaderProps, DocLibraryCatalog.tsx, AnalyticsPage.tsx, ApprovalsPage.tsx] | lang=en
- "dashboard_dashboardactivity": "DashboardActivity.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 75476a5 feat: add confidentiality manag…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, bd70cf6 style: improve code formatting …, bda0c32 style: Improve code formatting …] | lang=en
- "template_templateeditor": "TemplateEditor.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateEditor.tsx:L1 | neighbors=[165493f NEW-MODIFIC, 1665b01 more features, 2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 3c5c37b more-mods, 4c2e63a update smartbid 2.0] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@1665b013e0762d44a00ade781a237f7294b2a04d": "1665b01 more features" | kind=Commit | source=git | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@c271ce8a5e2e16b7fde8479bb93b9b565042e7f6": "c271ce8 Refactor code structure for improved readability and maintainability" | kind=Commit | source=git | neighbors=[7ccad33 Refactor code structure and rem…, ApprovalTab.tsx, feat/easi-modules-pages, main, ChartTooltip.tsx, HeatmapGrid.tsx] | lang=en
- "common_emptystate_emptystate": "EmptyState()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EmptyState.tsx:L14 | neighbors=[BidActivityLog.tsx, EquipmentImportModal.tsx, ImportClarificationModal.tsx, ImportQualificationModal.tsx, EmptyState.tsx, RequirePageAccess.tsx] | lang=en
- "common_glasscard": "GlassCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GlassCard.tsx:L1 | neighbors=[AITab.tsx, BidActivityLog.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, DocumentsTab.tsx, NotesTab.tsx] | lang=en
- "hooks_usecharttheme": "useChartTheme.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L1 | neighbors=[BidActivityLog.tsx, 953278b feat: add ApprovalDueImpactSect…, c271ce8 Refactor code structure for imp…, BidsByDivisionChart.tsx, BidsByStatusChart.tsx, BidsByUrgencyChart.tsx] | lang=en
- "services_bidservice_bidservice": "BidService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L19 | neighbors=[useApprovalSync.ts, useClarificationLibrarySync.ts, useDashboardSync.ts, AppLayout.tsx, BidDetailPage.tsx, BidTrackerPage.tsx] | lang=en
- "bid_confidentiallock": "ConfidentialLock.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ConfidentialLock.tsx:L1 | neighbors=[BidCard.tsx, ConfidentialLock(), ConfidentialLockProps, useCurrentUser.ts, useCurrentUser(), index.ts] | lang=en
- "common_pageheader_pageheader": "PageHeader()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PageHeader.tsx:L11 | neighbors=[PageHeader.tsx, DocLibraryCatalog.tsx, AnalyticsPage.tsx, ApprovalsPage.tsx, AssetsCatalogPage.tsx, BidBoardPage.tsx] | lang=en
- "dashboard_erndashboardsection": "ErnDashboardSection.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnDashboardSection.tsx:L1 | neighbors=[583d03e Refactor string concatenation i…, 892c1fc feat: add PeoplePicker componen…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, ChartTooltip.tsx, ChartTooltip()] | lang=en
- "services_spservice": "SPService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SPService.ts:L1 | neighbors=[AddQuotationModal.tsx, 0e653cd more mods, 4b576db AI-Integration, 4c2e63a update smartbid 2.0, 7d9108e createrequestpage correction, dbdc03a systemconfig online] | lang=en
- "stores_usebidstore_usebidstore": "useBidStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L95 | neighbors=[BidConfidentialButton.tsx, BidExportTab.tsx, ConfidentialLock.tsx, DocumentsTab.tsx, ScopeOfSupplyTab.tsx, ChatAssistant.tsx] | lang=en
- "favorites_addfavoriteequipmentmodal": "AddFavoriteEquipmentModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, ea5c8e6 Refactor UI components for cons…, EquipmentImportModal.tsx, EquipmentImportModal(), IImportPick, EmptyState.tsx] | lang=en
- "models_ibidstatus": "IBidStatus.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L1 | neighbors=[ApprovalTab.tsx, 0e653cd more mods, 1665b01 more features, 3a3d0a5 new changes, 5577aab feat: Add Technical Proposal fu…, 8e87d94 feat: Add Links and Recommendat…] | lang=en
- "services_aianalysisservice_aianalysisservice": "AIAnalysisService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L75 | neighbors=[AddQuotationModal.tsx, QualificationsTab.tsx, AIDocumentAnalyzer.tsx, DocLibraryCatalog.tsx, AIAnalysisService.ts, .analyzeDocument()] | lang=en
- "services_spservice_spservice": "SPService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SPService.ts:L15 | neighbors=[AddQuotationModal.tsx, QuotationsPage.tsx, AccessLogService.ts, ActivityLogService.ts, AiAuthService.ts, ApprovalService.ts] | lang=en
- "survey_surveysystemscene": "SurveySystemScene.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L1 | neighbors=[0a8206d feat(survey): 3D navigation - S…, 50a29c7 feat(survey): Full Survey Sprea…, 512f7b1 feat(survey): full-bleed 3D sea…, 583d03e Refactor string concatenation i…, 86dba8c feat(survey): restore three.js …, 9b2fddd feat(survey): diagram rooms (ma…] | lang=en
- "bid_costsearchmodal": "CostSearchModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CostSearchModal.tsx:L1 | neighbors=[AssetsBreakdownTab.tsx, AddQuotationModal.tsx, AddQuotationModal(), CostSearchImportItem, CostSearchModal(), CostSearchModalProps] | lang=en
- "bid_preparationmobilizationtab": "PreparationMobilizationTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L1 | neighbors=[BidFxNote.tsx, BidFxNote(), UsdAmountCell(), BidTabHeader.tsx, BidTabHeader(), HeaderChip()] | lang=en
- "common_glasscard_glasscard": "GlassCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GlassCard.tsx:L20 | neighbors=[AITab.tsx, BidActivityLog.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, DocumentsTab.tsx, NotesTab.tsx] | lang=en
- "hooks_usecurrentuser_usecurrentuser": "useCurrentUser()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useCurrentUser.ts:L8 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidCard.tsx, BidConfidentialButton.tsx, BidFavoriteButton.tsx, BidStatusPhasePanel.tsx] | lang=en
- "reports_approvaldueimpactsection": "ApprovalDueImpactSection.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ApprovalDueImpactSection.tsx:L1 | neighbors=[75476a5 feat: add confidentiality manag…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, OperationalSummaryPage.tsx, ConfidentialLock.tsx, ConfidentialLock()] | lang=en
- "bid_certificationsbreakdowntab": "CertificationsBreakdownTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CertificationsBreakdownTab.tsx:L1 | neighbors=[BidFxNote.tsx, BidFxNote(), UsdAmountCell(), BidTabHeader.tsx, BidTabHeader(), HeaderChip()] | lang=en
- "branch:repo:github.com/RaphaelCosta21/smartbid2.0#feat/easi-modules-pages": "feat/easi-modules-pages" | kind=Branch | source=git | neighbors=[0546310 Add dashboard components and st…, 0e653cd more mods, 1111add Add initial configuration files…, 165493f NEW-MODIFIC, 1665b01 more features, 1a40896 feat: add SmartBid 2.0 Executiv…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@3c5c37ba0522eeb4e09fd69ebad830cebb4a5d9f": "3c5c37b more-mods" | kind=Commit | source=git | neighbors=[165493f NEW-MODIFIC, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, CertificationsBreakdownTab.tsx, CostSearchModal.tsx] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-002.json

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
