# Node Description Batch 3 of 102

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

- "utils_divisionhelpers": "divisionHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L1 | neighbors=[ApprovalTab.tsx, ErnCreateModal.tsx, OverviewTab.tsx, 3bfc25a Refactor notification events, i…, 8152d02 feat: implement split approval …, IntegratedDivisionTabs.tsx] | lang=en
- "bid_bidactivitylog": "BidActivityLog.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L1 | neighbors=[ACTIVITY_ICONS, BidActivityLog(), BidActivityLogProps, CategoryFilter, getInitials(), metaString()] | lang=en
- "bidexcelexport_rows": "rows.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L1 | neighbors=[BidExportTab.tsx, ScopeOfSupplyTab.tsx, buildAssetSummary(), buildSupplierRows(), categoryLabel(), CostEntry] | lang=en
- "dashboard_dashboardbidtable": "DashboardBidTable.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardBidTable.tsx:L1 | neighbors=[75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, ConfidentialLock.tsx, ConfidentialLock()] | lang=en
- "settings_membersmanagement": "MembersManagement.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 414e1a6 style: Improve code formatting …, 79354cb Merge remote-tracking branch 'o…, 8f7062d Remove outdated UI/UX design gu…] | lang=en
- "survey3d_scenetypes": "sceneTypes.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L1 | neighbors=[2a932fc feat(survey): failure cascade, …, 3d59093 Merge feat/survey-data-journey …, 512f7b1 feat(survey): full-bleed 3D sea…, 54594e6 style(survey): neutral silver f…, 568e582 Merge feat/survey-journey-accur…, 5d664ea Merge feat/survey-knowledge-por…] | lang=en
- "utils_qualificationhelpers": "qualificationHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L1 | neighbors=[ImportQualificationModal.tsx, QualificationsTab.tsx, QualificationSuggestionsModal.tsx, ScopeOfSupplyTab.tsx, 5c35e8d feat: Implement Qualification L…, aa081f9 refactor: Improve code formatti…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@8152d02a7275605a5305475a138693cdc63c6a74": "8152d02 feat: implement split approval tracks for integrated bids" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, BidActivityLog.tsx, ErnCreateModal.tsx, OverviewTab.tsx, ScopeOfSupplyTab.tsx, backup/survey-merge-20261018-113028-jou…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@c58a13c5a45bb31d2f0775d0d9fe0fb925ca73c8": "c58a13c new-implementations" | kind=Commit | source=git | neighbors=[0e653cd more mods, AITab.tsx, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, BidPhaseProgress.tsx] | lang=pt
- "knowledge_qualificationlibraryview": "QualificationLibraryView.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationLibraryView.tsx:L1 | neighbors=[5c35e8d feat: Implement Qualification L…, ConfirmDialog.tsx, ConfirmDialog(), DataTable.tsx, DataTable(), DivisionBadge.tsx] | lang=en
- "utils_bidpresentation": "bidPresentation.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L1 | neighbors=[ParetoChart.tsx, a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, BidRankingTab.tsx, HistoryItemCard.tsx, ItemHistoryTab.tsx] | lang=en
- "utils_kpihelpers": "kpiHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L1 | neighbors=[14b96c8 feat: implement approval round …, 79354cb Merge remote-tracking branch 'o…, aaa091c Add hooks for KPI targets and l…, bd70cf6 style: improve code formatting …, KPICard.tsx, DashboardKPIRow.tsx] | lang=en
- "common_emptystate_emptystate": "EmptyState()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EmptyState.tsx:L14 | neighbors=[BidActivityLog.tsx, EquipmentImportModal.tsx, ImportClarificationModal.tsx, ImportQualificationModal.tsx, EmptyState.tsx, RequirePageAccess.tsx] | lang=en
- "models_iaianalysis": "IAIAnalysis.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 4b576db AI-Integration, 5c35e8d feat: Implement Qualification L…, 79354cb Merge remote-tracking branch 'o…, 961eb93 feat: Update AI integration and…, b6d954d feat: Enhance AIAnalysisService…] | lang=en
- "utils_clarificationhelpers": "clarificationHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L1 | neighbors=[ExportClarificationModal.tsx, OverviewTab.tsx, QualificationsTab.tsx, ScopeOfSupplyTab.tsx, 02c1391 feat: Add supplier management f…, 5c35e8d feat: Implement Qualification L…] | lang=en
- "common_aidocumentanalyzer": "AIDocumentAnalyzer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIDocumentAnalyzer.tsx:L1 | neighbors=[AITab.tsx, 4b576db AI-Integration, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, 8878a6b fix: Improve formatting in AIDo…, aaa091c Add hooks for KPI targets and l…] | lang=en
- "layout_sidebar": "Sidebar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L1 | neighbors=[0e653cd more mods, 1665b01 more features, 2538d01 feat: Implement Access Matrix c…, 3939503 refactor: improve code formatti…, 3a3d0a5 new changes, 3c5c37b more-mods] | lang=en
- "survey_surveyequipmentdetail": "SurveyEquipmentDetail.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentDetail.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 3d59093 Merge feat/survey-data-journey …, 50a29c7 feat(survey): Full Survey Sprea…, 583d03e Refactor string concatenation i…, 67bbf62 feat(survey): apply Figma look …, 747fd66 feat(survey): Oceaneering theme…] | lang=en
- "bid_bidhourstable": "BidHoursTable.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L1 | neighbors=[BidFxNote.tsx, BidFxNote(), BidHoursTable(), BidHoursTableProps, blankHoursItem(), ColorPickerInline()] | lang=en
- "pages_bidcomparatorpage": "BidComparatorPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidComparatorPage.tsx:L1 | neighbors=[9153d04 refactor: Simplify component re…, a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, AppLayout.tsx, BidSelect.tsx, buildBidOptions()] | lang=en
- "bidexcelexport_index": "index.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/index.ts:L1 | neighbors=[BidExportTab.tsx, RevisionsTab.tsx, getCurrentRevisionLetter(), context.ts, BID_EXCEL_SHEETS, getBidApprovalState()] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@e2285cf0f6b38404d3c8e0a7d9540ca75ce87eef": "e2285cf cont-implementing" | kind=Commit | source=git | neighbors=[c58a13c new-implementations, AITab.tsx, AssetsBreakdownTab.tsx, CostSearchModal.tsx, ScopeOfSupplyTab.tsx, backup/survey-merge-20261018-113028-jou…] | lang=en
- "common_glasscard": "GlassCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GlassCard.tsx:L1 | neighbors=[AITab.tsx, BidActivityLog.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, DocumentsTab.tsx, NotesTab.tsx] | lang=en
- "stores_useuistore_useuistore": "useUIStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L42 | neighbors=[AddQuotationModal.tsx, ApprovalTab.tsx, AssetsBreakdownTab.tsx, BidConfidentialButton.tsx, BidExportTab.tsx, BidFavoriteButton.tsx] | lang=en
- "utils_surveyglossary": "surveyGlossary.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L1 | neighbors=[0b9cb22 refactor(survey): remove Missio…, 3d59093 Merge feat/survey-data-journey …, 568e582 Merge feat/survey-journey-accur…, 90a8e89 fix(survey): correct data journ…, d614a0b feat(survey): bilingual survey …, SurveySystemPage.tsx] | lang=en
- "bid_bidcostsummary": "BidCostSummary.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidCostSummary.tsx:L1 | neighbors=[BidCostSummary(), BidCostSummaryProps, BidFxNote.tsx, BidFxNote(), BidTabHeader.tsx, BidTabHeader()] | lang=en
- "bid_bidexporttab": "BidExportTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidExportTab.tsx:L1 | neighbors=[BidExportTab(), BidExportTabProps, ICheck, plural(), SHEET_ACCENTS, SHEET_ICONS] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@1665b013e0762d44a00ade781a237f7294b2a04d": "1665b01 more features" | kind=Commit | source=git | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@c271ce8a5e2e16b7fde8479bb93b9b565042e7f6": "c271ce8 Refactor code structure for improved readability and maintainability" | kind=Commit | source=git | neighbors=[7ccad33 Refactor code structure and rem…, ApprovalTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal] | lang=en
- "hooks_usecharttheme": "useChartTheme.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L1 | neighbors=[BidActivityLog.tsx, ParetoChart.tsx, 747fd66 feat(survey): Oceaneering theme…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, c271ce8 Refactor code structure for imp…] | lang=en
- "knowledge_qualificationtablemodal": "QualificationTableModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L1 | neighbors=[5c35e8d feat: Implement Qualification L…, aa081f9 refactor: Improve code formatti…, QualificationLibraryView.tsx, ConfirmDialog.tsx, ConfirmDialog(), SuggestionInput.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@a0cd8e2e16586283bb1c9f8767d760957127cd29": "a0cd8e2 feat: native quotations, BID presentation tab, bid comparator and price…" | kind=Commit | source=git | neighbors=[4fd375f feat(survey): free 3D compositi…, AddQuotationModal.tsx, AssetsBreakdownTab.tsx, LinkedQuotationsPanel.tsx, QuotationControlPanel.tsx, QuotationStatusChip.tsx] | lang=en
- "utils_approvaltracks": "approvalTracks.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L1 | neighbors=[ApprovalTab.tsx, OverviewTab.tsx, 14b96c8 feat: implement approval round …, 3bfc25a Refactor notification events, i…, 8152d02 feat: implement split approval …, BidDetailPage.tsx] | lang=en
- "bid_documentstab": "DocumentsTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/DocumentsTab.tsx:L1 | neighbors=[DocumentsTab(), DocumentsTabProps, isLocalUrl(), EmptySection.tsx, EmptySection(), TechnicalProposalChip.tsx] | lang=en
- "common_glasscard_glasscard": "GlassCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GlassCard.tsx:L20 | neighbors=[AITab.tsx, BidActivityLog.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, DocumentsTab.tsx, NotesTab.tsx] | lang=en
- "common_pageheader": "PageHeader.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PageHeader.tsx:L1 | neighbors=[fe3728a smartbid2.0, PageHeader(), PageHeaderProps, DocLibraryCatalog.tsx, AnalyticsPage.tsx, ApprovalsPage.tsx] | lang=en
- "dashboard_dashboardactivity": "DashboardActivity.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, bd70cf6 style: improve code formatting …] | lang=en
- "hooks_usecurrentuser": "useCurrentUser.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useCurrentUser.ts:L1 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidCard.tsx, BidConfidentialButton.tsx, BidFavoriteButton.tsx, BidStatusPhasePanel.tsx] | lang=en
- "models_ibidstatus": "IBidStatus.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L1 | neighbors=[ApprovalTab.tsx, 0e653cd more mods, 14b96c8 feat: implement approval round …, 1665b01 more features, 3a3d0a5 new changes, 5577aab feat: Add Technical Proposal fu…] | lang=en
- "pages_analyticspage": "AnalyticsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AnalyticsPage.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 8267c28 i18n: translate EASI, suppliers…, c271ce8 Refactor code structure for imp…, ddf6c96 Merge branch 'feat/survey-knowl…] | lang=en

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
