# Node Description Batch 10 of 86

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

- "config_routes_config": "routes.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/routes.config.ts:L1 | neighbors=[0e653cd more mods, 3f57ca9 merge: integrate EASI module pa…, 6d20432 feat: adiciona paginas EASI ao …, 8e87d94 feat: Add Links and Recommendat…, 9582626 feat: add Access Log component …, bc10d67 feat: add pastBidHelpers and pa…] | lang=en
- "config_sectors_config": "sectors.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L1 | neighbors=[953278b feat: add ApprovalDueImpactSect…, c271ce8 Refactor code structure for imp…, BY_LABEL, BY_VALUE, getSectorColor(), getSectorDef()] | lang=en
- "hooks_usekpitargets": "useKpiTargets.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useKpiTargets.ts:L1 | neighbors=[aaa091c Add hooks for KPI targets and l…, DashboardKPIRow.tsx, ErnDashboardSection.tsx, useKpiTargets(), index.ts, useConfigStore.ts] | lang=en
- "hooks_usetechnicalproposalpublisher": "useTechnicalProposalPublisher.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useTechnicalProposalPublisher.ts:L1 | neighbors=[DocumentsTab.tsx, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…, useCurrentUser.ts, useCurrentUser(), useTechnicalProposalPublisher()] | lang=en
- "models_iaichat": "IAiChat.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAiChat.ts:L1 | neighbors=[b6d954d feat: Enhance AIAnalysisService…, bc10d67 feat: add pastBidHelpers and pa…, de36cf5 feat: add SmartBid Docs indexer…, ChatAssistant.tsx, ChatRole, IChatAnswer] | lang=en
- "models_idoclibraryitem": "IDocLibraryItem.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDocLibraryItem.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 8e87d94 feat: Add Links and Recommendat…, bc10d67 feat: add pastBidHelpers and pa…, de36cf5 feat: add SmartBid Docs indexer…, DocLibraryCatalog.tsx, DocCatalogType] | lang=en
- "models_iqualificationdb": "IQualificationDb.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQualificationDb.ts:L1 | neighbors=[ImportQualificationModal.tsx, 5c35e8d feat: Implement Qualification L…, useQualificationLibraryFilter.ts, QualificationEntryDrawer.tsx, QualificationEntryModal.tsx, QualificationLibraryView.tsx] | lang=en
- "pages_technicalproposalspage": "TechnicalProposalsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TechnicalProposalsPage.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 5577aab feat: Add Technical Proposal fu…, de36cf5 feat: add SmartBid Docs indexer…, AppLayout.tsx, usePageAccess.ts, usePageAccess()] | lang=en
- "services_attachmentservice": "AttachmentService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L1 | neighbors=[CertificationsBreakdownTab.tsx, DocumentsTab.tsx, ScopeOfSupplyTab.tsx, 165493f NEW-MODIFIC, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…] | lang=en
- "services_ernservice_ernservice": "ErnService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L14 | neighbors=[ErnCreateModal.tsx, ErnDetailsModal.tsx, ErnSearchModal.tsx, useErn.ts, ErnService.ts, .create()] | lang=en
- "services_supplierservice_supplierservice": "SupplierService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L163 | neighbors=[SuppliersRegistry.tsx, SupplierService.ts, ._clearLogo(), .columns(), .create(), .getAll()] | lang=en
- "services_systemconfigservice": "SystemConfigService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SystemConfigService.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 4c2e63a update smartbid 2.0, dbdc03a systemconfig online, e61a9d3 feat: add notification system f…, DocLibraryCatalog.tsx, AppLayout.tsx] | lang=en
- "survey3d_cableflow": "cableFlow.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L1 | neighbors=[9b2fddd feat(survey): diagram rooms (ma…, b07a797 feat(survey): toggle to hide co…, ddf6c96 Merge branch 'feat/survey-knowl…, f510343 feat(survey): interactive sprea…, index.ts, Cable] | lang=en
- "utils_aiquotationmapper": "aiQuotationMapper.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiQuotationMapper.ts:L1 | neighbors=[AddQuotationModal.tsx, 02c1391 feat: Add supplier management f…, 4b576db AI-Integration, 961eb93 feat: Update AI integration and…, b6d954d feat: Enhance AIAnalysisService…, f393a09 feat: add validation for quotat…] | lang=en
- "utils_bomparser": "bomParser.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L1 | neighbors=[9cc3475 feat: Integrate Financials Acti…, e2285cf cont-implementing, BomCostsPage.tsx, index.ts, assignParentIds(), cleanCsvValue()] | lang=en
- "utils_costcalculations_getassetcostbreakdown": "getAssetCostBreakdown()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L333 | neighbors=[AssetsBreakdownTab.tsx, ScopeOfSupplyTab.tsx, rows.ts, costCalculations.ts, accumulateNode(), applyContingencyToCost()] | lang=en
- "utils_pastbiddocument_heading": "heading()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L73 | neighbors=[clarificationLibraryDocument.ts, pastBidDocument.ts, buildPastBidDocument(), clarifications(), classification(), description()] | lang=en
- "bid_aitab": "AITab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AITab.tsx:L1 | neighbors=[AITab(), AITabProps, AIDocumentAnalyzer.tsx, AIDocumentAnalyzer(), GlassCard.tsx, GlassCard()] | lang=en
- "bid_qualificationsuggestionsmodal": "QualificationSuggestionsModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationSuggestionsModal.tsx:L1 | neighbors=[QualificationsTab.tsx, QualificationGroupList.tsx, IQualificationPickGroup, QualificationGroupList(), QualificationSuggestionsModal(), QualificationSuggestionsModalProps] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@2b1ed14bc5c378db13bde794d0b05cce43088854": "2b1ed14 feat: add useApprovalSync hook to synchronize BID approval state with S…" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, BidActivityLog.tsx, OverviewTab.tsx, main, ddf6c96 Merge branch 'feat/survey-knowl…, sharepoint.config.ts] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@50a29c7cb7bdbc57d5ed9ea8ba7b54f453ae5650": "50a29c7 feat(survey): Full Survey Spread template (DWG 803038098 rev A) - catal…" | kind=Commit | source=git | neighbors=[main, 8e88523 build: skip lint on gulp serve …, index.ts, ISurveyCatalog.ts, SurveySystemPage.tsx, SurveyCatalogService.ts] | lang=pt
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@961eb9349ef06a42f117b4dd82bb85b29783b500": "961eb93 feat: Update AI integration and enhance quotation extraction process" | kind=Commit | source=git | neighbors=[1c19dcd Update API diagnostics and AI c…, AddQuotationModal.tsx, feat/easi-modules-pages, main, de36cf5 feat: add SmartBid Docs indexer…, ai.config.ts] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@9e27edd626169c57fbad25021446adff88f78983": "9e27edd feat: Update AI integration and authentication flow" | kind=Commit | source=git | neighbors=[401be0c Add EntraTokenTest component fo…, AddQuotationModal.tsx, QualificationsTab.tsx, feat/easi-modules-pages, main, 1c19dcd Update API diagnostics and AI c…] | lang=en
- "common_confirmdialog_confirmdialog": "ConfirmDialog()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ConfirmDialog.tsx:L15 | neighbors=[AssetsBreakdownTab.tsx, BidExportTab.tsx, ConfidentialAccessModal.tsx, DocumentsTab.tsx, ScopeOfSupplyTab.tsx, AIAnalyzerModal.tsx] | lang=en
- "components_smartbid20": "SmartBid20.tsx" | kind=code-symbol | source=src/webparts/smartBid20/components/SmartBid20.tsx:L1 | neighbors=[3a3d0a5 new changes, 9e27edd feat: Update AI integration and…, fe3728a smartbid2.0, ISmartBid20Props.ts, ISmartBid20Props, SmartBid20] | lang=en
- "insights_segmentedcontrol_segmentoption": "SegmentOption" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/SegmentedControl.tsx:L5 | neighbors=[DashboardActivity.tsx, DashboardPeriodBar.tsx, EngHoursOutlook.tsx, EngHoursRanking.tsx, ErnWatchlist.tsx, AnalyticsFilterBar.tsx] | lang=en
- "services_attachmentservice_attachmentservice": "AttachmentService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L9 | neighbors=[CertificationsBreakdownTab.tsx, DocumentsTab.tsx, ScopeOfSupplyTab.tsx, CreateRequestPage.tsx, AttachmentService.ts, .deleteFile()] | lang=en
- "survey_surveyequipmentcard": "SurveyEquipmentCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentCard.tsx:L1 | neighbors=[512f7b1 feat(survey): full-bleed 3D sea…, 583d03e Refactor string concatenation i…, 67bbf62 feat(survey): apply Figma look …, ddf6c96 Merge branch 'feat/survey-knowl…, ee6b009 feat(survey): upload equipment …, f06225e feat(survey): Survey Knowledge …] | lang=en
- "survey_surveyspreadpanel": "SurveySpreadPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySpreadPanel.tsx:L1 | neighbors=[4c720fd style(survey): IMR-style proced…, 512f7b1 feat(survey): full-bleed 3D sea…, 583d03e Refactor string concatenation i…, 9b2fddd feat(survey): diagram rooms (ma…, d574851 style(survey): calmer overview …, d9e6783 feat(survey): clean 3D overview…] | lang=en
- "utils_pdfexport": "pdfExport.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L1 | neighbors=[8267c28 i18n: translate EASI, suppliers…, c271ce8 Refactor code structure for imp…, ddf6c96 Merge branch 'feat/survey-knowl…, BidDetailsReportPage.tsx, PeriodPerformancePage.tsx, ExportService.ts] | lang=en
- "bidexcelexport_excelstyles_num": "NUM" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L63 | neighbors=[excelStyles.ts, assetsSheet.ts, certificationsSheet.ts, costSummarySheet.ts, currencyTable.ts, hoursSheet.ts] | lang=en
- "charts_sparkline": "Sparkline.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/Sparkline.tsx:L1 | neighbors=[Sparkline(), SparklineProps, useColorTheme.ts, useColorTheme(), 953278b feat: add ApprovalDueImpactSect…, c271ce8 Refactor code structure for imp…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@67bbf62796964b19bb9096b006746ec3f5fa5565": "67bbf62 feat(survey): apply Figma look - ocean background, glass cards/panels, …" | kind=Commit | source=git | neighbors=[0deadb7 fix(survey): read catalog jsond…, main, d227784 feat(survey): Figma 2D system v…, SurveyEquipmentPage.tsx, SurveySystemPage.tsx, SurveyCatalogService.ts] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@d9e6783d846b616775b13b478b877dc3edb632a0": "d9e6783 feat(survey): clean 3D overview - text-only zone blocks, catalog items …" | kind=Commit | source=git | neighbors=[main, 0a8206d feat(survey): 3D navigation - S…, SurveySystemPage.tsx, SurveyCatalogService.ts, createSurveyScene.ts, explodeLayout.ts] | lang=en
- "common_scopeimportpreview": "ScopeImportPreview.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ScopeImportPreview.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 3c5c37b more-mods, b6d954d feat: Enhance AIAnalysisService…, f03d3f6 feat: Enhance ImportSourceModal…, ImportSourceModal.tsx, IScopeImportResult] | lang=en
- "common_suppliercombobox": "SupplierCombobox.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SupplierCombobox.tsx:L1 | neighbors=[AddQuotationModal.tsx, 02c1391 feat: Add supplier management f…, 414e1a6 style: Improve code formatting …, SupplierCombobox(), SupplierComboboxProps, useSupplierStore.ts] | lang=en
- "common_toastcontainer": "ToastContainer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ToastContainer.tsx:L1 | neighbors=[24595c5 feat: Enhance Bid Export functi…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, b6d954d feat: Enhance AIAnalysisService…, ICONS, ToastContainer()] | lang=en
- "dashboard_bidsbydivisionchart": "BidsByDivisionChart.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByDivisionChart.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ChartTooltip.tsx, ChartTooltip(), GlassCard.tsx] | lang=en
- "dashboard_bidsbystatuschart": "BidsByStatusChart.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByStatusChart.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ChartTooltip.tsx, ChartTooltip(), GlassCard.tsx] | lang=en
- "dashboard_bidsbyurgencychart": "BidsByUrgencyChart.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByUrgencyChart.tsx:L1 | neighbors=[aaa091c Add hooks for KPI targets and l…, bd70cf6 style: improve code formatting …, ChartTooltip.tsx, ChartTooltip(), GlassCard.tsx, GlassCard()] | lang=en

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
