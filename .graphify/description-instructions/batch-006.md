# Node Description Batch 7 of 86

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

- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@ea5c8e6e48312587ae3fbdb94e87d99535ae6ab8": "ea5c8e6 Refactor UI components for consistency and readability" | kind=Commit | source=git | neighbors=[2538d01 feat: Implement Access Matrix c…, NotesTab.tsx, QualificationsTab.tsx, main, 54fea3b feat: Enhance Part Number Autoc…, accessControl.config.ts]
- "hooks_useaccesslevel": "useAccessLevel.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAccessLevel.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, fe3728a smartbid2.0, RequirePageAccess.tsx, IAccessLevelApi, useAccessLevel(), index.ts]
- "layout_header": "Header.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Header.tsx:L1 | neighbors=[1665b01 more features, 4c2e63a update smartbid 2.0, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, fe3728a smartbid2.0, AppLayout.tsx]
- "services_clarificationknowledgeservice": "ClarificationKnowledgeService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationKnowledgeService.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 5c35e8d feat: Implement Qualification L…, useClarificationLibrarySync.ts, ClarificationsDbPage.tsx, IClarificationDb.ts, ClarificationBaseType]
- "services_quotationservice_quotationservice": "QuotationService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L24 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BomCostsPage.tsx, QuotationsPage.tsx, QuotationService.ts, .addItems()]
- "sheets_hourssheet": "hoursSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/hoursSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 583d03e Refactor string concatenation i…, 953278b feat: add ApprovalDueImpactSect…, bc10d67 feat: add pastBidHelpers and pa…, context.ts]
- "bid_bidfxnote": "BidFxNote.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidFxNote.tsx:L1 | neighbors=[BidCostSummary.tsx, BidFxNote(), BidFxNoteProps, UsdAmountCell(), UsdAmountCellProps, BidTabHeader.tsx]
- "bid_ernsearchmodal": "ErnSearchModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnSearchModal.tsx:L1 | neighbors=[ernNum(), ErnSearchModal(), ErnSearchModalProps, useCurrentUser.ts, useCurrentUser(), index.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@6d204328bf54ffc7608b5902f81f81616bcf0e6c": "6d20432 feat: adiciona paginas EASI ao SMART BID 2.0" | kind=Commit | source=git | neighbors=[1111add Add initial configuration files…, feat/easi-modules-pages, main, 3f57ca9 merge: integrate EASI module pa…, navigation.config.ts, routes.config.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@bee3eb5990dff7fbca97757f0147b1748e40c102": "bee3eb5 feat: Enhance bid model with availability splits and engineering details" | kind=Commit | source=git | neighbors=[1665b01 more features, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, BidStatusPhasePanel.tsx, EngineeringHoursSection.tsx]
- "hooks_usecharttheme_usecharttheme": "useChartTheme()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L97 | neighbors=[BidActivityLog.tsx, BidsByDivisionChart.tsx, BidsByStatusChart.tsx, BidsByUrgencyChart.tsx, DashboardKPIRow.tsx, EngHoursOutlook.tsx]
- "hooks_usecolortheme": "useColorTheme.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useColorTheme.ts:L1 | neighbors=[BidCostSummary.tsx, BidStatusPhasePanel.tsx, OverviewTab.tsx, excelStyles.ts, Sparkline.tsx, 953278b feat: add ApprovalDueImpactSect…]
- "models_ibidtemplate": "IBidTemplate.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidTemplate.ts:L1 | neighbors=[BidTemplateImport.tsx, 165493f NEW-MODIFIC, 1665b01 more features, 4c2e63a update smartbid 2.0, c4e04de lots-implementation, c58a13c new-implementations]
- "models_isurveycatalog": "ISurveyCatalog.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L1 | neighbors=[50a29c7 feat(survey): Full Survey Sprea…, 9b2fddd feat(survey): diagram rooms (ma…, ddf6c96 Merge branch 'feat/survey-knowl…, f06225e feat(survey): Survey Knowledge …, f510343 feat(survey): interactive sprea…, index.ts]
- "stores_useauthstore": "useAuthStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useAuthStore.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 4c2e63a update smartbid 2.0, dbdc03a systemconfig online, fe3728a smartbid2.0, useAccessLevel.ts, useCurrentUser.ts]
- "stores_usefavoritesstore": "useFavoritesStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useFavoritesStore.ts:L1 | neighbors=[BidFavoriteButton.tsx, EquipmentImportModal.tsx, ScopeOfSupplyTab.tsx, 165493f NEW-MODIFIC, 2538d01 feat: Implement Access Matrix c…, 5577aab feat: Add Technical Proposal fu…]
- "utils_enghourshelpers": "engHoursHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/engHoursHelpers.ts:L1 | neighbors=[953278b feat: add ApprovalDueImpactSect…, DashboardBidTable.tsx, EngHoursOutlook.tsx, EngHoursRanking.tsx, index.ts, bidHelpers.ts]
- "utils_formatters_formatcurrency": "formatCurrency()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L7 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidEquipmentTable.tsx, BidExportTab.tsx, BidFxNote.tsx]
- "bid_bidconfidentialbutton": "BidConfidentialButton.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidConfidentialButton.tsx:L1 | neighbors=[BidConfidentialButton(), BidConfidentialButtonProps, names(), ConfidentialAccessModal.tsx, ConfidentialAccessModal(), useCurrentUser.ts]
- "bid_notestab": "NotesTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/NotesTab.tsx:L1 | neighbors=[BidComments.tsx, BidComments(), EmptySection.tsx, EmptySection(), NotesTab(), NotesTabProps]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@bda0c32eefe41f98fa35aef14d9ae38e9e7fbfea": "bda0c32 style: Improve code formatting and readability across multiple componen…" | kind=Commit | source=git | neighbors=[953278b feat: add ApprovalDueImpactSect…, BidStatusPhasePanel.tsx, DocumentsTab.tsx, QualificationsTab.tsx, excelStyles.ts, main]
- "common_skeletonloader": "SkeletonLoader.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SkeletonLoader.tsx:L1 | neighbors=[EquipmentImportModal.tsx, ImportClarificationModal.tsx, ImportQualificationModal.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, RequirePageAccess.tsx]
- "dashboard_dashboardfilterbar": "DashboardFilterBar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardFilterBar.tsx:L1 | neighbors=[953278b feat: add ApprovalDueImpactSect…, byLabel(), DashboardFilterBar(), DashboardFilterBarProps, useChartTheme.ts, categoricalColor()]
- "hooks_useopenbid_useopenbid": "useOpenBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useOpenBid.ts:L16 | neighbors=[ChatAssistant.tsx, useOpenBid.ts, QualificationLibraryView.tsx, CommandPalette.tsx, LivePulse.tsx, BidBoardPage.tsx]
- "hooks_usepastbidpublisher": "usePastBidPublisher.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/usePastBidPublisher.ts:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, bc10d67 feat: add pastBidHelpers and pa…, useCurrentUser.ts, useCurrentUser(), IPastBidPublishRequest, usePastBidPublisher()]
- "knowledge_clarificationentrymodal": "ClarificationEntryModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationEntryModal.tsx:L1 | neighbors=[1d028a0 style: Improve code formatting …, 5c35e8d feat: Implement Qualification L…, 75476a5 feat: add confidentiality manag…, 77f55d4 feat: Add Clarification Entry M…, SegmentedControl.tsx, SegmentedControl()]
- "services_dashboardservice": "DashboardService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, bec8260 feat: Enhance bid management wi…, c4e04de lots-implementation, DashboardPage.tsx, IDashboard.ts]
- "services_doclibrarycatalogservice_doclibrarycatalogservice": "DocLibraryCatalogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L28 | neighbors=[DocLibraryCatalog.tsx, ClarificationKnowledgeService.ts, DocLibraryCatalogService.ts, .buildPreviewUrl(), ._createFolderIfMissing(), .deleteFile()]
- "sheets_scopesheet": "scopeSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/scopeSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 583d03e Refactor string concatenation i…, 953278b feat: add ApprovalDueImpactSect…, bc10d67 feat: add pastBidHelpers and pa…, context.ts]
- "sheets_supplierssheet": "suppliersSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/suppliersSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 583d03e Refactor string concatenation i…, bc10d67 feat: add pastBidHelpers and pa…, context.ts, IBidExcelContext]
- "typings_pnp_sp_d": "pnp-sp.d.ts" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L1 | neighbors=[0e653cd more mods, 2b1ed14 feat: add useApprovalSync hook …, 3f57ca9 merge: integrate EASI module pa…, 4c2e63a update smartbid 2.0, 6d20432 feat: adiciona paginas EASI ao …, dbdc03a systemconfig online]
- "common_editlockbanner": "EditLockBanner.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EditLockBanner.tsx:L1 | neighbors=[BidTabHeader.tsx, OverviewTab.tsx, QualificationsTab.tsx, 0546310 Add dashboard components and st…, 3c5c37b more-mods, aaa091c Add hooks for KPI targets and l…]
- "hooks_usepageaccess_usepageaccess": "usePageAccess()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/usePageAccess.ts:L22 | neighbors=[usePageAccess.ts, BomCostsPage.tsx, ClarificationsDbPage.tsx, DatasheetsPage.tsx, FavoritesPage.tsx, FollowUpPage.tsx]
- "hooks_usesurveyportal": "useSurveyPortal.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useSurveyPortal.ts:L1 | neighbors=[512f7b1 feat(survey): full-bleed 3D sea…, ddf6c96 Merge branch 'feat/survey-knowl…, f06225e feat(survey): Survey Knowledge …, fbe2c0e feat(survey): remove division/s…, ISurveyBidComparison, useFilteredSurveyEquipment()]
- "insights_segmentedcontrol_segmentedcontrol": "SegmentedControl()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/SegmentedControl.tsx:L25 | neighbors=[ExportClarificationModal.tsx, DashboardActivity.tsx, DashboardPeriodBar.tsx, EngHoursOutlook.tsx, EngHoursRanking.tsx, ErnWatchlist.tsx]
- "pages_toolingreportpage": "ToolingReportPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ToolingReportPage.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, AppLayout.tsx, DataTable.tsx, DataTable(), DivisionBadge.tsx]
- "services_surveycatalogservice": "SurveyCatalogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L1 | neighbors=[0deadb7 fix(survey): read catalog jsond…, 50a29c7 feat(survey): Full Survey Sprea…, 67bbf62 feat(survey): apply Figma look …, 9b2fddd feat(survey): diagram rooms (ma…, d9e6783 feat(survey): clean 3D overview…, ddf6c96 Merge branch 'feat/survey-knowl…]
- "sheets_infosheet": "infoSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/infoSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 24595c5 feat: Enhance Bid Export functi…, 583d03e Refactor string concatenation i…, bc10d67 feat: add pastBidHelpers and pa…, context.ts]
- "stores_usequotationstore": "useQuotationStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQuotationStore.ts:L1 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, CostSearchModal.tsx, EquipmentImportModal.tsx, 165493f NEW-MODIFIC, de36cf5 feat: add SmartBid Docs indexer…]
- "utils_revisionhelpers": "revisionHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L1 | neighbors=[OverviewTab.tsx, 1665b01 more features, 583d03e Refactor string concatenation i…, bc10d67 feat: add pastBidHelpers and pa…, BidDetailPage.tsx, bidHelpers.ts]

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
