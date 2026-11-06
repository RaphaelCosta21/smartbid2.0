# Node Description Batch 6 of 102

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

- "bidexcelexport_context": "context.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/context.ts:L1 | neighbors=[BidExportTab.tsx, BID_EXCEL_SHEETS, getBidApprovalState(), IBidApprovalState, IBidExcelContext, IBidExcelSheetDef] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@4b576dbe191b692b6422f46dbf867026bcb873eb": "4b576db AI-Integration" | kind=Commit | source=git | neighbors=[AddQuotationModal.tsx, AITab.tsx, ClarificationSuggestionsModal.tsx, QualificationsTab.tsx, ScopeOfSupplyTab.tsx, backup/survey-merge-20261018-113028-jou…] | lang=en
- "common_chatassistant": "ChatAssistant.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ChatAssistant.tsx:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, 9582626 feat: add Access Log component …, bc10d67 feat: add pastBidHelpers and pa…] | lang=en
- "pages_bidboardpage": "BidBoardPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidBoardPage.tsx:L1 | neighbors=[0e653cd more mods, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, bec8260 feat: Enhance bid management wi…] | lang=en
- "sheets_assetssheet": "assetsSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/assetsSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 54fea3b feat: Enhance Part Number Autoc…, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…] | lang=en
- "sheets_currencytable": "currencyTable.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/currencyTable.ts:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, certificationsSheet.ts, excelStyles.ts] | lang=en
- "survey_surveycomposition3d": "SurveyComposition3D.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyComposition3D.tsx:L1 | neighbors=[2a932fc feat(survey): failure cascade, …, 4fd375f feat(survey): free 3D compositi…, 5d664ea Merge feat/survey-knowledge-por…, 6062346 feat(survey): failure cascade, …, 7342177 Merge feat/survey-surface-spare…, ca73461 feat(survey): spare quantities,…] | lang=en
- "survey3d_focuscontroller": "focusController.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L1 | neighbors=[2a932fc feat(survey): failure cascade, …, 3d59093 Merge feat/survey-data-journey …, 512f7b1 feat(survey): full-bleed 3D sea…, 5d664ea Merge feat/survey-knowledge-por…, 6062346 feat(survey): failure cascade, …, 9b2fddd feat(survey): diagram rooms (ma…] | lang=en
- "utils_bomcosthelpers": "bomCostHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L1 | neighbors=[BomAnalysisCard.tsx, BomQuotationPicker.tsx, 4b5d467 feat: add BomQuotationPicker co…, 93ca809 refactor: improve code formatti…, BomCostsPage.tsx, IBomCostAnalysis.ts] | lang=en
- "utils_exporthelpers": "exportHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L1 | neighbors=[index.ts, 4c2e63a update smartbid 2.0, 79354cb Merge remote-tracking branch 'o…, a0cd8e2 feat: native quotations, BID pr…, bc10d67 feat: add pastBidHelpers and pa…, c4e04de lots-implementation] | lang=en
- "utils_phasehelpers": "phaseHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L1 | neighbors=[ApprovalTab.tsx, BidCard.tsx, OverviewTab.tsx, 0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0] | lang=en
- "bid_importqualificationmodal": "ImportQualificationModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ImportQualificationModal.tsx:L1 | neighbors=[ImportQualificationModal(), ImportQualificationModalProps, QualificationGroupList.tsx, IQualificationPickGroup, QualificationGroupList(), DivisionBadge.tsx] | lang=en
- "bidexcelexport_excelstyles_xlsheet": "XlSheet" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L257 | neighbors=[context.ts, excelStyles.ts, .band(), .banner(), .constructor(), .dataRow()] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@95826263854506e8a48879c78ed2d0a20e8134b6": "9582626 feat: add Access Log component and related services for tracking user a…" | kind=Commit | source=git | neighbors=[EquipmentImportModal.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, 3ae3801 refactor: improve code formatti…, ChatAssistant.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@bec82608ca6b281b6710ab3bbf831b7d74e2ccfc": "bec8260 feat: Enhance bid management with due freeze date logic" | kind=Commit | source=git | neighbors=[7112c8a fix: Improve text formatting in…, BidCard.tsx, OverviewTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@f3095f250b5c5b4a885d7e1ed222b1ba484f2a67": "f3095f2 feat: add ApprovalTab component with styling and functionality for mana…" | kind=Commit | source=git | neighbors=[66dbcee feat: Implement contingency cal…, ApprovalTab.tsx, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, CostSearchModal.tsx] | lang=en
- "dashboard_upcomingdeadlines": "UpcomingDeadlines.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/UpcomingDeadlines.tsx:L1 | neighbors=[3a3d0a5 new changes, 5577aab feat: Add Technical Proposal fu…, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…] | lang=en
- "hooks_useanalyticsfilters": "useAnalyticsFilters.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 79354cb Merge remote-tracking branch 'o…, 8152d02 feat: implement split approval …, c271ce8 Refactor code structure for imp…, DashboardPeriodBar.tsx, AnalyticsFacetCounts] | lang=en
- "hooks_useclarificationlibrarysync": "useClarificationLibrarySync.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useClarificationLibrarySync.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 5c35e8d feat: Implement Qualification L…, 77f55d4 feat: Add Clarification Entry M…, 79354cb Merge remote-tracking branch 'o…, inFlight, needsClarificationLibrarySync()] | lang=en
- "hooks_usedashboardfilters": "useDashboardFilters.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDashboardFilters.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, 8152d02 feat: implement split approval …, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, bda0c32 style: Improve code formatting …, DashboardFilterBar.tsx] | lang=en
- "insights_analyticsfilterbar": "AnalyticsFilterBar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AnalyticsFilterBar.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, 8267c28 i18n: translate EASI, suppliers…, 953278b feat: add ApprovalDueImpactSect…, c271ce8 Refactor code structure for imp…] | lang=en
- "insights_segmentedcontrol": "SegmentedControl.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/SegmentedControl.tsx:L1 | neighbors=[ExportClarificationModal.tsx, BomQuotationPicker.tsx, 77f55d4 feat: Add Clarification Entry M…, 79354cb Merge remote-tracking branch 'o…, c271ce8 Refactor code structure for imp…, DashboardActivity.tsx] | lang=en
- "utils_activityloghelpers": "activityLogHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/activityLogHelpers.ts:L1 | neighbors=[ApprovalTab.tsx, BidActivityLog.tsx, BidConfidentialButton.tsx, BidExportTab.tsx, DocumentsTab.tsx, OverviewTab.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@54fea3b622f23f2b9fa0d76a9da04fb6534e15b9": "54fea3b feat: Enhance Part Number Autocomplete with placeholder handling and ur…" | kind=Commit | source=git | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, CostSearchModal.tsx, EngineeringHoursSection.tsx, EquipmentImportModal.tsx, OverviewTab.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@dbdc03a61d6c1cc96aee4fef6f9ffb43fc540b5a": "dbdc03a systemconfig online" | kind=Commit | source=git | neighbors=[3a3d0a5 new changes, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main] | lang=pt
- "common_importsourcemodal": "ImportSourceModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceModal.tsx:L1 | neighbors=[BidHoursTable.tsx, ScopeOfSupplyTab.tsx, 3c5c37b more-mods, 79354cb Merge remote-tracking branch 'o…, f03d3f6 feat: Enhance ImportSourceModal…, HoursImportPreview.tsx] | lang=en
- "models_iuser": "IUser.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L1 | neighbors=[ApprovalTab.tsx, 3a3d0a5 new changes, 8152d02 feat: implement split approval …, c4e04de lots-implementation, dbdc03a systemconfig online, f3095f2 feat: add ApprovalTab component…] | lang=en
- "pages_assetscatalogpage": "AssetsCatalogPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L1 | neighbors=[0e653cd more mods, 2d4ecdb style: improve code formatting …, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, adc0d38 Refactor TemplatesPage: Enhance…, AppLayout.tsx] | lang=en
- "pages_bidresultspage": "BidResultsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidResultsPage.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, 8e87d94 feat: Add Links and Recommendat…] | lang=en
- "services_pastbidknowledgeservice": "PastBidKnowledgeService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PastBidKnowledgeService.ts:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, 02c1391 feat: Add supplier management f…, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, usePastBidPublisher.ts, PastBidDrawer.tsx] | lang=en
- "survey_surveyglossary": "SurveyGlossary.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyGlossary.tsx:L1 | neighbors=[3d59093 Merge feat/survey-data-journey …, be5fb82 feat(survey): data journey from…, d614a0b feat(survey): bilingual survey …, SurveySystemPage.tsx, surveyGlossary.ts, GLOSSARY_UI] | lang=en
- "bid_confidentiallock_confidentiallock": "ConfidentialLock()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ConfidentialLock.tsx:L19 | neighbors=[BidCard.tsx, ConfidentialLock.tsx, ChatAssistant.tsx, ApprovalsPending.tsx, DashboardActivity.tsx, DashboardBidTable.tsx] | lang=en
- "bid_revisionstab": "RevisionsTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L1 | neighbors=[BidExportTab.tsx, BidStatusPhasePanel.tsx, DueDateChangeModal.tsx, OverviewTab.tsx, canStartRevision(), getActiveRevision()] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@3d59093e9cab426ac2ceb011f4b4bf88244eed7b": "3d59093 Merge feat/survey-data-journey into main" | kind=Commit | source=git | neighbors=[main, 0b9cb22 refactor(survey): remove Missio…, 568e582 Merge feat/survey-journey-accur…, surveyDataFormats.ts, surveyGlossary.ts, index.ts] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@8267c283690bc5da7eee314c420f50b0317046d5": "8267c28 i18n: translate EASI, suppliers, analytics and reports UI strings to En…" | kind=Commit | source=git | neighbors=[4c720fd style(survey): IMR-style proced…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@bd70cf6a6bd283ebb6003f61ea7cf25feff27832": "bd70cf6 style: improve code formatting and readability across multiple componen…" | kind=Commit | source=git | neighbors=[aaa091c Add hooks for KPI targets and l…, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidFxNote.tsx, BidHoursTable.tsx, BidTabHeader.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@ea5c8e6e48312587ae3fbdb94e87d99535ae6ab8": "ea5c8e6 Refactor UI components for consistency and readability" | kind=Commit | source=git | neighbors=[2538d01 feat: Implement Access Matrix c…, NotesTab.tsx, QualificationsTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@f03d3f60c408c58793207269f44e87f89ce05113": "f03d3f6 feat: Enhance ImportSourceModal with favorites integration and keyboard…" | kind=Commit | source=git | neighbors=[bec8260 feat: Enhance bid management wi…, AssetsBreakdownTab.tsx, ClarificationSuggestionsModal.tsx, EquipmentImportModal.tsx, ScopeOfSupplyTab.tsx, backup/survey-merge-20261018-113028-jou…] | lang=en
- "config_notifications_config": "notifications.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L1 | neighbors=[14b96c8 feat: implement approval round …, dbc974b Refactor email template HTML fo…, e05a523 feat: Enhance notification card…, e61a9d3 feat: add notification system f…, BID_ROLE_KEYS, buildDefaultNotificationRules()] | lang=en
- "config_status_config": "status.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L1 | neighbors=[0e653cd more mods, 1665b01 more features, 5577aab feat: Add Technical Proposal fu…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, c4e04de lots-implementation] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-005.json

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
