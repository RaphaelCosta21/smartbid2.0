# Node Description Batch 8 of 102

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

- "services_surveycatalogservice": "SurveyCatalogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L1 | neighbors=[0deadb7 fix(survey): read catalog jsond…, 50a29c7 feat(survey): Full Survey Sprea…, 67bbf62 feat(survey): apply Figma look …, 7342177 Merge feat/survey-surface-spare…, 7d29862 feat(survey): end-to-end data l…, 9b2fddd feat(survey): diagram rooms (ma…]
- "sheets_hourssheet": "hoursSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/hoursSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, bc10d67 feat: add pastBidHelpers and pa…]
- "survey3d_deliverablemodels": "deliverableModels.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/deliverableModels.ts:L1 | neighbors=[3d59093 Merge feat/survey-data-journey …, be5fb82 feat(survey): data journey from…, surveyDataFormats.ts, DeliverableVisual, ACCENT, buildCalibration()]
- "bid_bidfxnote": "BidFxNote.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidFxNote.tsx:L1 | neighbors=[BidCostSummary.tsx, BidFxNote(), BidFxNoteProps, UsdAmountCell(), UsdAmountCellProps, BidTabHeader.tsx]
- "bid_confidentialaccessmodal": "ConfidentialAccessModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ConfidentialAccessModal.tsx:L1 | neighbors=[BidConfidentialButton.tsx, ConfidentialAccessModal(), ConfidentialAccessModalProps, IAccessGroup, IAccessRow, keyOf()]
- "bid_ernsearchmodal": "ErnSearchModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnSearchModal.tsx:L1 | neighbors=[ernNum(), ErnSearchModal(), ErnSearchModalProps, useCurrentUser.ts, useCurrentUser(), index.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@3f57ca90a738dad6c546b44b4ff147af468ef309": "3f57ca9 merge: integrate EASI module pages into main" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, bc10d67 feat: add pastBidHelpers and pa…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@568e5827e0a80a78cfbe9dc4f5cafb4829f91b9a": "568e582 Merge feat/survey-journey-accuracy into main" | kind=Commit | source=git | neighbors=[3d59093 Merge feat/survey-data-journey …, main, 87bda2e feat(docs): add move functional…, surveyDataFormats.ts, surveyGlossary.ts, effectTypes.ts]
- "common_datatable": "DataTable.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DataTable.tsx:L1 | neighbors=[QuotationControlPanel.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, DataTable(), DataTableColumn, DataTableProps]
- "config_navigation_config": "navigation.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/navigation.config.ts:L1 | neighbors=[0e653cd more mods, 2538d01 feat: Implement Access Matrix c…, 3c5c37b more-mods, 3f57ca9 merge: integrate EASI module pa…, 4fd375f feat(survey): free 3D compositi…, 6d20432 feat: adiciona paginas EASI ao …]
- "hooks_usecharttheme_usecharttheme": "useChartTheme()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L98 | neighbors=[BidActivityLog.tsx, ParetoChart.tsx, BidsByDivisionChart.tsx, BidsByStatusChart.tsx, BidsByUrgencyChart.tsx, DashboardKPIRow.tsx]
- "hooks_usecolortheme": "useColorTheme.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useColorTheme.ts:L1 | neighbors=[BidCostSummary.tsx, BidStatusPhasePanel.tsx, OverviewTab.tsx, excelStyles.ts, Sparkline.tsx, 79354cb Merge remote-tracking branch 'o…]
- "hooks_useopenbid_useopenbid": "useOpenBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useOpenBid.ts:L16 | neighbors=[ChatAssistant.tsx, useOpenBid.ts, QualificationLibraryView.tsx, CommandPalette.tsx, LivePulse.tsx, BidBoardPage.tsx]
- "pricehistory_historyitemcard": "HistoryItemCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/pricehistory/HistoryItemCard.tsx:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, CostBar(), divergenceToken(), HistoryItemCard(), HistoryItemCardProps]
- "pricehistory_labortab": "LaborTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/pricehistory/LaborTab.tsx:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, PriceHistoryPage.tsx, DataTable.tsx, DataTable(), EmptyState.tsx]
- "services_approvalservice": "ApprovalService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L1 | neighbors=[ApprovalTab.tsx, 14b96c8 feat: implement approval round …, 1a40896 feat: add SmartBid 2.0 Executiv…, 2b1ed14 feat: add useApprovalSync hook …, 4c2e63a update smartbid 2.0, 79354cb Merge remote-tracking branch 'o…]
- "stores_useauthstore": "useAuthStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useAuthStore.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 4c2e63a update smartbid 2.0, 79354cb Merge remote-tracking branch 'o…, dbdc03a systemconfig online, fe3728a smartbid2.0, useAccessLevel.ts]
- "stores_usefavoritesstore": "useFavoritesStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useFavoritesStore.ts:L1 | neighbors=[BidFavoriteButton.tsx, EquipmentImportModal.tsx, ScopeOfSupplyTab.tsx, 165493f NEW-MODIFIC, 2538d01 feat: Implement Access Matrix c…, 5577aab feat: Add Technical Proposal fu…]
- "utils_enghourshelpers": "engHoursHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/engHoursHelpers.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, DashboardBidTable.tsx, EngHoursOutlook.tsx, EngHoursRanking.tsx, index.ts]
- "utils_revisionhelpers": "revisionHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L1 | neighbors=[OverviewTab.tsx, 1665b01 more features, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, a0cd8e2 feat: native quotations, BID pr…, bc10d67 feat: add pastBidHelpers and pa…]
- "bid_notestab": "NotesTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/NotesTab.tsx:L1 | neighbors=[BidComments.tsx, BidComments(), EmptySection.tsx, EmptySection(), NotesTab(), NotesTabProps]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@14b96c8e4655891353d4a7b4a06d6f77dd4839dd": "14b96c8 feat: implement approval round cancellation feature" | kind=Commit | source=git | neighbors=[ApprovalBadge.tsx, ApprovalTab.tsx, BidActivityLog.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@414e1a6af2ef7d65e71340b57226241b4032238f": "414e1a6 style: Improve code formatting and readability across multiple componen…" | kind=Commit | source=git | neighbors=[02c1391 feat: Add supplier management f…, AddQuotationModal.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@6d204328bf54ffc7608b5902f81f81616bcf0e6c": "6d20432 feat: adiciona paginas EASI ao SMART BID 2.0" | kind=Commit | source=git | neighbors=[1111add Add initial configuration files…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@7d9108e4a151adaca085cf599f56201ea3cd5565": "7d9108e createrequestpage correction" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, c4e04de lots-implementation]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@9b2fdddd1f8512e4f47db4ffd1e0570997835e40": "9b2fddd feat(survey): diagram rooms (mast, survey online, bridge, ROV control, …" | kind=Commit | source=git | neighbors=[0a8206d feat(survey): 3D navigation - S…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@f51034392486ac09abe297185d8e7ad2a64e6412": "f510343 feat(survey): interactive spread zones - 3D orbs, exploded equipment, a…" | kind=Commit | source=git | neighbors=[8e88523 build: skip lint on gulp serve …, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main]
- "common_confirmdialog": "ConfirmDialog.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ConfirmDialog.tsx:L1 | neighbors=[AssetsBreakdownTab.tsx, BidExportTab.tsx, ConfidentialAccessModal.tsx, DocumentsTab.tsx, LinkedQuotationsPanel.tsx, OverviewTab.tsx]
- "common_integrateddivisiontabs": "IntegratedDivisionTabs.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L1 | neighbors=[BidTabHeader.tsx, ScopeOfSupplyTab.tsx, 79354cb Merge remote-tracking branch 'o…, 8152d02 feat: implement split approval …, aaa091c Add hooks for KPI targets and l…, b6d954d feat: Enhance AIAnalysisService…]
- "common_kpicard_kpicard": "KPICard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/KPICard.tsx:L47 | neighbors=[BidActivityLog.tsx, QuotationControlPanel.tsx, KPICard.tsx, ComparisonSummary.tsx, DashboardKPIRow.tsx, EngHoursOutlook.tsx]
- "dashboard_dashboardfilterbar": "DashboardFilterBar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardFilterBar.tsx:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, byLabel(), DashboardFilterBar(), DashboardFilterBarProps, useChartTheme.ts]
- "effects_roveffects": "rovEffects.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/rovEffects.ts:L1 | neighbors=[568e582 Merge feat/survey-journey-accur…, da217d4 feat(survey): physical-signal e…, index.ts, effectTypes.ts, EffectBuilder, effectUtils.ts]
- "hooks_usepastbidpublisher": "usePastBidPublisher.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/usePastBidPublisher.ts:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, useCurrentUser.ts, useCurrentUser(), IPastBidPublishRequest]
- "insights_segmentedcontrol_segmentedcontrol": "SegmentedControl()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/SegmentedControl.tsx:L25 | neighbors=[ExportClarificationModal.tsx, BomQuotationPicker.tsx, DashboardActivity.tsx, DashboardPeriodBar.tsx, EngHoursOutlook.tsx, EngHoursRanking.tsx]
- "knowledge_clarificationentrymodal": "ClarificationEntryModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationEntryModal.tsx:L1 | neighbors=[1d028a0 style: Improve code formatting …, 5c35e8d feat: Implement Qualification L…, 75476a5 feat: add confidentiality manag…, 77f55d4 feat: Add Clarification Entry M…, 79354cb Merge remote-tracking branch 'o…, SegmentedControl.tsx]
- "models_ibidtemplate": "IBidTemplate.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidTemplate.ts:L1 | neighbors=[BidTemplateImport.tsx, 165493f NEW-MODIFIC, 1665b01 more features, 4c2e63a update smartbid 2.0, c4e04de lots-implementation, c58a13c new-implementations]
- "services_dashboardservice": "DashboardService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, 79354cb Merge remote-tracking branch 'o…, bec8260 feat: Enhance bid management wi…, c4e04de lots-implementation, DashboardPage.tsx]
- "services_doclibrarycatalogservice_doclibrarycatalogservice": "DocLibraryCatalogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L28 | neighbors=[DocLibraryCatalog.tsx, ClarificationKnowledgeService.ts, DocLibraryCatalogService.ts, .buildPreviewUrl(), ._createFolderIfMissing(), .deleteFile()]
- "services_quotationservice": "QuotationService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L1 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, LinkedQuotationsPanel.tsx, QuotationControlPanel.tsx, BomQuotationPicker.tsx, 165493f NEW-MODIFIC]
- "sheets_scopesheet": "scopeSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/scopeSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, bc10d67 feat: add pastBidHelpers and pa…]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-007.json

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
