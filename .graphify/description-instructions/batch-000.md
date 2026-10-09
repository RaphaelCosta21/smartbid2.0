# Node Description Batch 1 of 86

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

- "models_index": "index.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/index.ts:L1 | neighbors=[ApprovalBadge.tsx, AddQuotationModal.tsx, AITab.tsx, AssetsBreakdownTab.tsx, BidActivityLog.tsx, BidApprovalPanel.tsx] | lang=en
- "pages_biddetailpage": "BidDetailPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L1 | neighbors=[0e653cd more mods, 1665b01 more features, 24595c5 feat: Enhance Bid Export functi…, 2538d01 feat: Implement Access Matrix c…, 2b1ed14 feat: add useApprovalSync hook …, 3a3d0a5 new changes] | lang=en
- "layout_applayout": "AppLayout.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/AppLayout.tsx:L1 | neighbors=[0e653cd more mods, 165493f NEW-MODIFIC, 1665b01 more features, 2538d01 feat: Implement Access Matrix c…, 3f57ca9 merge: integrate EASI module pa…, 4c2e63a update smartbid 2.0] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@4c2e63a209bc74e09a269af9771d8fbba5c3fcd2": "4c2e63a update smartbid 2.0" | kind=Commit | source=git | neighbors=[ApprovalBadge.tsx, ApprovalDecisionPanel.tsx, ApprovalMatrix.tsx, ApprovalRequestCard.tsx, ApprovalTimeline.tsx, BidActivityLog.tsx] | lang=pt
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@583d03ec84b30af6e40c040b0b33dafa57a20eb2": "583d03e Refactor string concatenation in various files to replace \" — \" with \" …" | kind=Commit | source=git | neighbors=[ApprovalDecisionPanel.tsx, ApprovalMatrix.tsx, ApprovalOverrideBanner.tsx, ApprovalTimeline.tsx, AddQuotationModal.tsx, ApprovalTab.tsx] | lang=en
- "settings_systemconfiguration": "SystemConfiguration.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 0e653cd more mods, 165493f NEW-MODIFIC, 1c19dcd Update API diagnostics and AI c…, 2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes] | lang=en
- "models_ibid": "IBid.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L1 | neighbors=[ApprovalOverrideBanner.tsx, ApprovalTab.tsx, QualificationSuggestionsModal.tsx, 0e653cd more mods, 1111add Add initial configuration files…, 165493f NEW-MODIFIC] | lang=en
- "utils_formatters": "formatters.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L1 | neighbors=[ApprovalOverrideBanner.tsx, AddQuotationModal.tsx, ApprovalTab.tsx, AssetsBreakdownTab.tsx, BidActivityLog.tsx, BidApprovalPanel.tsx] | lang=en
- "bid_overviewtab": "OverviewTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L1 | neighbors=[ApprovalOverrideBanner.tsx, ApprovalOverrideBanner(), DueDateChangeModal.tsx, DueDateChangeModal(), EmptySection.tsx, EmptySection()] | lang=en
- "pages_dashboardpage": "DashboardPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/DashboardPage.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 0e653cd more mods, 3ae3801 refactor: improve code formatti…, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…] | lang=en
- "branch:repo:github.com/RaphaelCosta21/smartbid2.0#main": "main" | kind=Branch | source=git | neighbors=[00efd39 Refactor Excel export sheets fo…, 02c1391 feat: Add supplier management f…, 0546310 Add dashboard components and st…, 0a8206d feat(survey): 3D navigation - S…, 0deadb7 fix(survey): read catalog jsond…, 0df87c0 refactor: improve code formatti…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@3a3d0a5d06eaffd66b8e5360c85be9a7e9b711ef": "3a3d0a5 new changes" | kind=Commit | source=git | neighbors=[ApprovalBadge.tsx, ApprovalDecisionPanel.tsx, ApprovalMatrix.tsx, ApprovalRequestCard.tsx, ApprovalTimeline.tsx, BidActivityLog.tsx] | lang=pt
- "pages_favoritespage": "FavoritesPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 165493f NEW-MODIFIC, 2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…] | lang=en
- "utils_costcalculations": "costCalculations.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L1 | neighbors=[AddQuotationModal.tsx, ApprovalTab.tsx, AssetsBreakdownTab.tsx, BidExportTab.tsx, BidFxNote.tsx, BidHoursTable.tsx] | lang=en
- "bid_assetsbreakdowntab": "AssetsBreakdownTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L1 | neighbors=[AddQuotationModal.tsx, AddQuotationModal(), AssetsBreakdownTab(), AssetsBreakdownTabProps, blankAsset(), blankSubCost()] | lang=en
- "bid_scopeofsupplytab": "ScopeOfSupplyTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L1 | neighbors=[BidTabHeader.tsx, BidTabHeader(), IHeaderStat, IShareSegment, ShareBar(), EquipmentImportModal.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@bc10d67cc0eaadbf0c95541a3c0f59fa4dcc5a0f": "bc10d67 feat: add pastBidHelpers and pastBidLedger utilities for enhanced past …" | kind=Commit | source=git | neighbors=[3f57ca9 merge: integrate EASI module pa…, ApprovalOverrideBanner.tsx, ApprovalTab.tsx, AssetsBreakdownTab.tsx, BidActivityLog.tsx, BidCostSummary.tsx] | lang=en
- "stores_useconfigstore": "useConfigStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useConfigStore.ts:L1 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidHoursTable.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, CostSearchModal.tsx] | lang=en
- "pages_unassignedrequestspage": "UnassignedRequestsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 0e653cd more mods, 2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 54fea3b feat: Enhance Part Number Autoc…] | lang=en
- "pages_bidtrackerpage": "BidTrackerPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…] | lang=en
- "pages_createrequestpage": "CreateRequestPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/CreateRequestPage.tsx:L1 | neighbors=[0e653cd more mods, 1665b01 more features, 24595c5 feat: Enhance Bid Export functi…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 54fea3b feat: Enhance Part Number Autoc…] | lang=en
- "pages_operationalsummarypage": "OperationalSummaryPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/OperationalSummaryPage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 414e1a6 style: Improve code formatting …, 5577aab feat: Add Technical Proposal fu…, 8267c28 i18n: translate EASI, suppliers…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…] | lang=en
- "stores_useconfigstore_useconfigstore": "useConfigStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useConfigStore.ts:L22 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidHoursTable.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, CostSearchModal.tsx] | lang=en
- "utils_analyticshelpers": "analyticsHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L1 | neighbors=[5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…, 892c1fc feat: add PeoplePicker componen…, 953278b feat: add ApprovalDueImpactSect…, bec8260 feat: Enhance bid management wi…, c271ce8 Refactor code structure for imp…] | lang=en
- "pages_clarificationsdbpage": "ClarificationsDbPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ClarificationsDbPage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 1d028a0 style: Improve code formatting …, 2538d01 feat: Implement Access Matrix c…, 583d03e Refactor string concatenation i…, 5c35e8d feat: Implement Qualification L…, 75476a5 feat: add confidentiality manag…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@953278bc5a55b6338ae83ce40004d8576ee72044": "953278b feat: add ApprovalDueImpactSection component for reporting on bid appro…" | kind=Commit | source=git | neighbors=[414e1a6 style: Improve code formatting …, BidCostSummary.tsx, BidHoursTable.tsx, BidPhaseProgress.tsx, BidStatusPhasePanel.tsx, CertificationsBreakdownTab.tsx] | lang=en
- "bid_equipmentimportmodal": "EquipmentImportModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L1 | neighbors=[EMPTY_SEARCHES, EquipmentImportModal(), EquipmentImportModalProps, EquipmentImportTabId, escapeRegExp(), formatCount()] | lang=en
- "pages_periodperformancepage": "PeriodPerformancePage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PeriodPerformancePage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 8267c28 i18n: translate EASI, suppliers…, c271ce8 Refactor code structure for imp…, ddf6c96 Merge branch 'feat/survey-knowl…] | lang=en
- "pages_bottleneckanalysispage": "BottleneckAnalysisPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 414e1a6 style: Improve code formatting …, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 8267c28 i18n: translate EASI, suppliers…, c271ce8 Refactor code structure for imp…] | lang=en
- "bid_qualificationstab": "QualificationsTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationsTab.tsx:L1 | neighbors=[ClarificationSuggestionsModal.tsx, ClarificationSuggestionsModal(), EmptySection.tsx, EmptySection(), ExportClarificationModal.tsx, ExportClarificationModal()] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@c4e04de8478ec3952899ef072851104649baa184": "c4e04de lots-implementation" | kind=Commit | source=git | neighbors=[7d9108e createrequestpage correction, AssetsBreakdownTab.tsx, BidActivityLog.tsx, BidApprovalPanel.tsx, BidCard.tsx, BidComments.tsx] | lang=nl
- "knowledge_doclibrarycatalog": "DocLibraryCatalog.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L1 | neighbors=[2d4ecdb style: improve code formatting …, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…, 8e87d94 feat: Add Links and Recommendat…, adc0d38 Refactor TemplatesPage: Enhance…, de36cf5 feat: add SmartBid Docs indexer…] | lang=en
- "pages_surveysystempage": "SurveySystemPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SurveySystemPage.tsx:L1 | neighbors=[33536c2 feat(survey): 2.5D depth view o…, 50a29c7 feat(survey): Full Survey Sprea…, 512f7b1 feat(survey): full-bleed 3D sea…, 67bbf62 feat(survey): apply Figma look …, 86dba8c feat(survey): restore three.js …, 9b2fddd feat(survey): diagram rooms (ma…] | lang=en
- "bid_approvaltab": "ApprovalTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ApprovalTab.tsx:L1 | neighbors=[ApprovalOverrideBanner.tsx, ApprovalOverrideBanner(), ApprovalTab(), ApprovalTabProps, matchesDivision(), SECTOR_CONFIGS] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@fe3728a018509e50c238ca44fea9585365ec420b": "fe3728a smartbid2.0" | kind=Commit | source=git | neighbors=[BidCard.tsx, BidPhaseProgress.tsx, BidStatusDropdown.tsx, feat/easi-modules-pages, main, 4c2e63a update smartbid 2.0] | lang=pt
- "pages_followuppage": "FollowUpPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FollowUpPage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 2538d01 feat: Implement Access Matrix c…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 8267c28 i18n: translate EASI, suppliers…, 8e87d94 feat: Add Links and Recommendat…] | lang=en
- "pages_pastbidspage": "PastBidsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PastBidsPage.tsx:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, 02c1391 feat: Add supplier management f…, 2538d01 feat: Implement Access Matrix c…, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@ddf6c96011afa751b11ef3b4b000eb616ad95e74": "ddf6c96 Merge branch 'feat/survey-knowledge-portal' into main" | kind=Commit | source=git | neighbors=[2b1ed14 feat: add useApprovalSync hook …, 2b67088 commit final Survey Knowledge &…, main, HeatmapGrid.tsx, 583d03e Refactor string concatenation i…, navigation.config.ts] | lang=en
- "pages_suppliersregistry": "SuppliersRegistry.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 2538d01 feat: Implement Access Matrix c…, 3f57ca9 merge: integrate EASI module pa…, 414e1a6 style: Improve code formatting …, 583d03e Refactor string concatenation i…, 6d20432 feat: adiciona paginas EASI ao …] | lang=en
- "utils_pastbiddocument": "pastBidDocument.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, 02c1391 feat: Add supplier management f…, 0df87c0 refactor: improve code formatti…, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…, 5c35e8d feat: Implement Qualification L…] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-000.json

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
