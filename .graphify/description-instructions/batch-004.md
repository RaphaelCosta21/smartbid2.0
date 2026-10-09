# Node Description Batch 5 of 86

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

- "hooks_usequerysearch": "useQuerySearch.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L1 | neighbors=[165493f NEW-MODIFIC, 1665b01 more features, bc10d67 feat: add pastBidHelpers and pa…, e2285cf cont-implementing, f03d3f6 feat: Enhance ImportSourceModal…, AIDocumentAnalyzer.tsx]
- "services_supplierservice": "SupplierService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 3f57ca9 merge: integrate EASI module pa…, 414e1a6 style: Improve code formatting …, 6d20432 feat: adiciona paginas EASI ao …, 8267c28 i18n: translate EASI, suppliers…, ddf6c96 Merge branch 'feat/survey-knowl…]
- "services_technicalproposalknowledgeservice": "TechnicalProposalKnowledgeService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L1 | neighbors=[5577aab feat: Add Technical Proposal fu…, useTechnicalProposalPublisher.ts, IAIAnalysis.ts, IExtractedDocumentMetadata, IDocLibraryItem.ts, IDocLibraryMetadata]
- "survey_surveyequipmentdetail": "SurveyEquipmentDetail.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentDetail.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 50a29c7 feat(survey): Full Survey Sprea…, 583d03e Refactor string concatenation i…, 67bbf62 feat(survey): apply Figma look …, d227784 feat(survey): Figma 2D system v…, ddf6c96 Merge branch 'feat/survey-knowl…]
- "utils_statushelpers": "statusHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L1 | neighbors=[ApprovalTab.tsx, BidFavoriteButton.tsx, BidTimeline.tsx, OverviewTab.tsx, RevisionsTab.tsx, 0e653cd more mods]
- "bid_bidtabheader": "BidTabHeader.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L1 | neighbors=[AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidFxNote.tsx, BidHoursTable.tsx, BidTabHeader(), BidTabHeaderProps]
- "bid_importqualificationmodal": "ImportQualificationModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ImportQualificationModal.tsx:L1 | neighbors=[ImportQualificationModal(), ImportQualificationModalProps, QualificationGroupList.tsx, IQualificationPickGroup, QualificationGroupList(), DivisionBadge.tsx]
- "bidexcelexport_context": "context.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/context.ts:L1 | neighbors=[BidExportTab.tsx, BID_EXCEL_SHEETS, getBidApprovalState(), IBidApprovalState, IBidExcelContext, IBidExcelSheetDef]
- "common_chatassistant": "ChatAssistant.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ChatAssistant.tsx:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 9582626 feat: add Access Log component …, bc10d67 feat: add pastBidHelpers and pa…, de36cf5 feat: add SmartBid Docs indexer…]
- "pages_bidboardpage": "BidBoardPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidBoardPage.tsx:L1 | neighbors=[0e653cd more mods, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, bec8260 feat: Enhance bid management wi…, c4e04de lots-implementation]
- "settings_notificationmatrix": "NotificationMatrix.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L1 | neighbors=[437d8e1 feat: implement notification lo…, dbc974b Refactor email template HTML fo…, e61a9d3 feat: add notification system f…, index.ts, audienceParts(), ChannelChips()]
- "sheets_assetssheet": "assetsSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/assetsSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 54fea3b feat: Enhance Part Number Autoc…, 583d03e Refactor string concatenation i…, 953278b feat: add ApprovalDueImpactSect…, bc10d67 feat: add pastBidHelpers and pa…]
- "sheets_currencytable": "currencyTable.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/currencyTable.ts:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, 583d03e Refactor string concatenation i…, bc10d67 feat: add pastBidHelpers and pa…, certificationsSheet.ts, excelStyles.ts, colOf()]
- "utils_phasehelpers": "phaseHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L1 | neighbors=[ApprovalTab.tsx, BidCard.tsx, OverviewTab.tsx, 0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0]
- "bidexcelexport_excelstyles_xlsheet": "XlSheet" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L254 | neighbors=[context.ts, excelStyles.ts, .band(), .banner(), .constructor(), .dataRow()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@de36cf557398ab15a11ece0b82622bb9f4f93937": "de36cf5 feat: add SmartBid Docs indexer and skillset for AI search integration" | kind=Commit | source=git | neighbors=[961eb93 feat: Update AI integration and…, feat/easi-modules-pages, main, b6d954d feat: Enhance AIAnalysisService…, AIDocumentAnalyzer.tsx, ChatAssistant.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@f06225e075f835ec895a8906bc0d320554f2b4e3": "f06225e feat(survey): Survey Knowledge & BID Portal - equipment explorer, 3D sy…" | kind=Commit | source=git | neighbors=[3f57ca9 merge: integrate EASI module pa…, main, e2388c0 feat(survey): allow Knowledge e…, navigation.config.ts, routes.config.ts, sharepoint.config.ts]
- "config_sharepoint_config": "sharepoint.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sharepoint.config.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 0e653cd more mods, 165493f NEW-MODIFIC, 1a40896 feat: add SmartBid 2.0 Executiv…, 2b1ed14 feat: add useApprovalSync hook …, 3f57ca9 merge: integrate EASI module pa…]
- "dashboard_upcomingdeadlines": "UpcomingDeadlines.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/UpcomingDeadlines.tsx:L1 | neighbors=[3a3d0a5 new changes, 5577aab feat: Add Technical Proposal fu…, 75476a5 feat: add confidentiality manag…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, bd70cf6 style: improve code formatting …]
- "hooks_useclarificationlibrarysync": "useClarificationLibrarySync.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useClarificationLibrarySync.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 5c35e8d feat: Implement Qualification L…, 77f55d4 feat: Add Clarification Entry M…, inFlight, needsClarificationLibrarySync(), useClarificationLibrarySync()]
- "insights_analyticsfilterbar": "AnalyticsFilterBar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AnalyticsFilterBar.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 583d03e Refactor string concatenation i…, 8267c28 i18n: translate EASI, suppliers…, 953278b feat: add ApprovalDueImpactSect…, c271ce8 Refactor code structure for imp…, ddf6c96 Merge branch 'feat/survey-knowl…]
- "survey_surveyportalheader": "SurveyPortalHeader.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPortalHeader.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 512f7b1 feat(survey): full-bleed 3D sea…, 583d03e Refactor string concatenation i…, 67bbf62 feat(survey): apply Figma look …, d227784 feat(survey): Figma 2D system v…, ddf6c96 Merge branch 'feat/survey-knowl…]
- "survey3d_scenetypes": "sceneTypes.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L1 | neighbors=[512f7b1 feat(survey): full-bleed 3D sea…, 54594e6 style(survey): neutral silver f…, 9b2fddd feat(survey): diagram rooms (ma…, d574851 style(survey): calmer overview …, d9e6783 feat(survey): clean 3D overview…, ddf6c96 Merge branch 'feat/survey-knowl…]
- "utils_costsummaryview": "costSummaryView.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costSummaryView.ts:L1 | neighbors=[BidCostSummary.tsx, BidExportTab.tsx, context.ts, index.ts, 00efd39 Refactor Excel export sheets fo…, 54fea3b feat: Enhance Part Number Autoc…]
- "bid_confidentiallock_confidentiallock": "ConfidentialLock()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ConfidentialLock.tsx:L19 | neighbors=[BidCard.tsx, ConfidentialLock.tsx, ChatAssistant.tsx, ApprovalsPending.tsx, DashboardActivity.tsx, DashboardBidTable.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@8267c283690bc5da7eee314c420f50b0317046d5": "8267c28 i18n: translate EASI, suppliers, analytics and reports UI strings to En…" | kind=Commit | source=git | neighbors=[4c720fd style(survey): IMR-style proced…, main, HeatmapGrid.tsx, 2b67088 commit final Survey Knowledge &…, phases.config.ts, AIInsightsPanel.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@95826263854506e8a48879c78ed2d0a20e8134b6": "9582626 feat: add Access Log component and related services for tracking user a…" | kind=Commit | source=git | neighbors=[EquipmentImportModal.tsx, main, 3ae3801 refactor: improve code formatti…, ChatAssistant.tsx, GuidedTour.tsx, ai.config.ts]
- "common_importsourcemodal": "ImportSourceModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceModal.tsx:L1 | neighbors=[BidHoursTable.tsx, ScopeOfSupplyTab.tsx, 3c5c37b more-mods, f03d3f6 feat: Enhance ImportSourceModal…, HoursImportPreview.tsx, HoursImportPreview()]
- "models_ibidrequest": "IBidRequest.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidRequest.ts:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 54fea3b feat: Enhance Part Number Autoc…, 5577aab feat: Add Technical Proposal fu…, 7d9108e createrequestpage correction]
- "models_iuser": "IUser.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L1 | neighbors=[ApprovalTab.tsx, 3a3d0a5 new changes, c4e04de lots-implementation, dbdc03a systemconfig online, f3095f2 feat: add ApprovalTab component…, fe3728a smartbid2.0]
- "pages_assetscatalogpage": "AssetsCatalogPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L1 | neighbors=[0e653cd more mods, 2d4ecdb style: improve code formatting …, 583d03e Refactor string concatenation i…, adc0d38 Refactor TemplatesPage: Enhance…, AppLayout.tsx, EmptyState.tsx]
- "pages_bidresultspage": "BidResultsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidResultsPage.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, 8e87d94 feat: Add Links and Recommendat…, DataTable.tsx]
- "pages_reportspage": "ReportsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ReportsPage.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 8267c28 i18n: translate EASI, suppliers…, c271ce8 Refactor code structure for imp…, ddf6c96 Merge branch 'feat/survey-knowl…, AppLayout.tsx]
- "services_pastbidknowledgeservice": "PastBidKnowledgeService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PastBidKnowledgeService.ts:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, 02c1391 feat: Add supplier management f…, bc10d67 feat: add pastBidHelpers and pa…, usePastBidPublisher.ts, PastBidDrawer.tsx, PastBidProfileModal.tsx]
- "bid_revisionstab": "RevisionsTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L1 | neighbors=[BidExportTab.tsx, BidStatusPhasePanel.tsx, DueDateChangeModal.tsx, OverviewTab.tsx, canStartRevision(), getActiveRevision()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@4b576dbe191b692b6422f46dbf867026bcb873eb": "4b576db AI-Integration" | kind=Commit | source=git | neighbors=[AddQuotationModal.tsx, AITab.tsx, ClarificationSuggestionsModal.tsx, QualificationsTab.tsx, ScopeOfSupplyTab.tsx, feat/easi-modules-pages]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@54fea3b622f23f2b9fa0d76a9da04fb6534e15b9": "54fea3b feat: Enhance Part Number Autocomplete with placeholder handling and ur…" | kind=Commit | source=git | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, CostSearchModal.tsx, EngineeringHoursSection.tsx, EquipmentImportModal.tsx, OverviewTab.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@bec82608ca6b281b6710ab3bbf831b7d74e2ccfc": "bec8260 feat: Enhance bid management with due freeze date logic" | kind=Commit | source=git | neighbors=[7112c8a fix: Improve text formatting in…, BidCard.tsx, OverviewTab.tsx, main, f03d3f6 feat: Enhance ImportSourceModal…, CountdownTimer.tsx]
- "config_status_config": "status.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L1 | neighbors=[0e653cd more mods, 1665b01 more features, 5577aab feat: Add Technical Proposal fu…, 953278b feat: add ApprovalDueImpactSect…, c4e04de lots-implementation, fe3728a smartbid2.0]
- "dashboard_approvalspending": "ApprovalsPending.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ApprovalsPending.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 75476a5 feat: add confidentiality manag…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, bd70cf6 style: improve code formatting …]

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
