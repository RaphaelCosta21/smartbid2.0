# Node Description Batch 17 of 102

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

- "survey3d_phenomenoncontroller_phenomenoncontroller": "PhenomenonController" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/phenomenonController.ts:L24 | neighbors=[createSurveyScene.ts, phenomenonController.ts, .constructor(), .dispose(), .emit(), .entry()]
- "template_templateimportwizard": "TemplateImportWizard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateImportWizard.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, c4e04de lots-implementation, IBidTemplate.ts]
- "typings_xlsx_d": "xlsx.d.ts" | kind=code-symbol | source=src/typings/xlsx.d.ts:L1 | neighbors=[1665b01 more features, 4c2e63a update smartbid 2.0, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, e2285cf cont-implementing, CellObject]
- "utils_bidpresentation_normalizetext": "normalizeText()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L19 | neighbors=[ItemHistoryTab.tsx, bidComparator.ts, bidPresentation.ts, acquisitionToken(), getHistoryForQuery(), getItemHistory()]
- "utils_costcalculations_isnocostavailability": "isNoCostAvailability()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L100 | neighbors=[AssetsBreakdownTab.tsx, rows.ts, bidPresentation.ts, costCalculations.ts, getAssetCostBreakdown(), getSplitNode()]
- "utils_divisionhelpers_getleaddivision": "getLeadDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L35 | neighbors=[ApprovalTab.tsx, OverviewTab.tsx, BidDetailPage.tsx, infoSheet.ts, aiContext.ts, approvalTracks.ts]
- "utils_formatters_getdaysuntil": "getDaysUntil()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L57 | neighbors=[OverviewTab.tsx, DashboardBidTable.tsx, DashboardService.ts, approvalHelpers.ts, ernHelpers.ts, formatters.ts]
- "utils_notificationevents_derivebidnotifications": "deriveBidNotifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L127 | neighbors=[BidDetailPage.tsx, notificationEvents.ts, fmtDate(), getClosingEventKey(), getNewActivityEntries(), isCanceledStatus()]
- "utils_pastbiddocument_lines": "lines()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L118 | neighbors=[pastBidDocument.ts, classification(), hours(), identification(), libraryReference(), pricing()]
- "utils_statushelpers_isterminalstatus": "isTerminalStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L52 | neighbors=[ApprovalTab.tsx, BidFavoriteButton.tsx, BidTimeline.tsx, OverviewTab.tsx, RevisionsTab.tsx, ImportSourceModal.tsx]
- "bid_bidequipmenttable": "BidEquipmentTable.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidEquipmentTable.tsx:L1 | neighbors=[BidEquipmentTable(), BidEquipmentTableProps, index.ts, formatters.ts, formatCurrency(), 3a3d0a5 new changes]
- "bid_bidtabheader_bidtabheader": "BidTabHeader()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L40 | neighbors=[AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, BidTabHeader.tsx, CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx]
- "bidexcelexport_excelstyles_pickrow": "pickRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L188 | neighbors=[excelStyles.ts, assetsSheet.ts, currencyTable.ts, hoursSheet.ts, scopeSheet.ts, suppliersSheet.ts]
- "bidexcelexport_excelstyles_qtyfmt": "qtyFmt()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L89 | neighbors=[excelStyles.ts, assetsSheet.ts, certificationsSheet.ts, hoursSheet.ts, logisticsSheet.ts, prepMobSheet.ts]
- "bidexcelexport_excelstyles_toexceldate": "toExcelDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L94 | neighbors=[excelStyles.ts, displayDate(), assetsSheet.ts, costSummarySheet.ts, infoSheet.ts, suppliersSheet.ts]
- "bidexcelexport_excelstyles_xlsheet_font": ".font()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L294 | neighbors=[XlSheet, .band(), .banner(), .keyValue(), .note(), .noticeStrip()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@0deadb72618f3dd960b429c4b26d2f1c03ef2413": "0deadb7 fix(survey): read catalog jsondata saved as rich text; provision column…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, 67bbf62 feat(survey): apply Figma look …]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@2b67088eeeb1d6db427afb67b8e3ce9a4cde6917": "2b67088 commit final Survey Knowledge & traduçao EN EASI" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, 7d29862 feat(survey): end-to-end data l…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@33536c2574cf85ebc1aff70dd461a9c4dfcc3fb8": "33536c2 feat(survey): 2.5D depth view of the Figma system scene (parallax camer…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, 86dba8c feat(survey): restore three.js …]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@54594e6eb76688bf1169a053fc924d7868a5eaa3": "54594e6 style(survey): neutral silver for acoustic links instead of red" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, b07a797 feat(survey): toggle to hide co…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@7112c8a2a743192108a691f4fcd6e22f8bbd62b5": "7112c8a fix: Improve text formatting in FavoritesPage and UnassignedRequestsPag…" | kind=Commit | source=git | neighbors=[5577aab feat: Add Technical Proposal fu…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, main, bec8260 feat: Enhance bid management wi…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@8e88523d1d0b7b30489df22b312161d6f1fcbf1f": "8e88523 build: skip lint on gulp serve (bundle/package still lint)" | kind=Commit | source=git | neighbors=[50a29c7 feat(survey): Full Survey Sprea…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@90a8e89eece187bf1ca074d7e86c33a663ed4438": "90a8e89 fix(survey): correct data journey physics and wiring, per-equipment ove…" | kind=Commit | source=git | neighbors=[main, 61c46c8 fix(survey): offshore Brazil GG…, surveyDataFormats.ts, surveyGlossary.ts, surveyDataJourney.ts, surveyGlossary.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@acf62bf6c7c1ff0419d0619d5c8b281b1dd7e856": "acf62bf refactor(survey): data journey advances only on click (no autoplay or s…" | kind=Commit | source=git | neighbors=[0b9cb22 refactor(survey): remove Missio…, main, 90a8e89 fix(survey): correct data journ…, surveyDataFormats.ts, SurveySystemPage.tsx, createSurveyScene.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@b5184abfa6889dd20cb5cf6f96252f65bb602ee1": "b5184ab fix: Improve formatting and readability in BidExportTab and BidStatusPh…" | kind=Commit | source=git | neighbors=[24595c5 feat: Enhance Bid Export functi…, BidExportTab.tsx, BidStatusPhasePanel.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@cce6a163d9e9331dbf118af8f2a09c08cd8f5ea5": "cce6a16 Refactor code structure for improved readability and maintainability" | kind=Commit | source=git | neighbors=[c6ce977 Add Azure AI Backend for SmartB…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@d3810c7a555d2076ffb52f3de6dfe13484dd6344": "d3810c7 style: format SCSS and TS code for improved readability" | kind=Commit | source=git | neighbors=[583d03e Refactor string concatenation i…, BidActivityLog.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@db68d816d0fd8dae08b59812c2576d8ca5a79b16": "db68d81 feat: Enhance ErnCreateModal and ErnService with improved deliverable t…" | kind=Commit | source=git | neighbors=[aa081f9 refactor: Improve code formatti…, ErnCreateModal.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, 921bf0d feat: enhance SupplierDrawer wi…]
- "common_peoplepicker": "PeoplePicker.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PeoplePicker.tsx:L1 | neighbors=[ErnCreateModal.tsx, 892c1fc feat: add PeoplePicker componen…, IGraphResult, IPickedPerson, PeoplePicker(), PeoplePickerProps]
- "common_prioritybadge": "PriorityBadge.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PriorityBadge.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PriorityBadge(), PriorityBadgeProps, constants.ts]
- "common_progressbar": "ProgressBar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ProgressBar.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ProgressBar(), ProgressBarProps, BottleneckAnalysisPage.tsx, TeamAnalyticsPage.tsx]
- "common_querycatalogloadingbanner": "QueryCatalogLoadingBanner.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/QueryCatalogLoadingBanner.tsx:L1 | neighbors=[9cc3475 feat: Integrate Financials Acti…, b6d954d feat: Enhance AIAnalysisService…, QueryCatalogLoadingBanner(), useFavoritesStore.ts, useFavoritesStore, useQueryCatalogStore.ts]
- "common_suggestioninput": "SuggestionInput.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SuggestionInput.tsx:L1 | neighbors=[5c35e8d feat: Implement Qualification L…, SuggestionInput(), SuggestionInputProps, idGenerator.ts, makeId(), QualificationCategoryInput.tsx]
- "config_bidroles_config": "bidRoles.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/bidRoles.config.ts:L1 | neighbors=[e61a9d3 feat: add notification system f…, BID_ROLE_META, getBidRoleLabel(), getBidRolesForSector(), IBidRoleMeta, IUser.ts]
- "dashboard_divisionworkload": "DivisionWorkload.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DivisionWorkload.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, GlassCard.tsx, GlassCard(), DivisionWorkload(), DivisionWorkloadProps]
- "dashboard_monthlyvolumechart": "MonthlyVolumeChart.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/MonthlyVolumeChart.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, GlassCard.tsx, GlassCard(), MonthlyVolumeChart(), MonthlyVolumeChartProps]
- "data_mockrequests": "mockRequests.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockRequests.ts:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 7d9108e createrequestpage correction, f3095f2 feat: add ApprovalTab component…, mockRequests]
- "function_app_function_app_chat_past_bid_material": "_chat_past_bid_material()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L948 | neighbors=[function_app.py, chat(), _group_by_document(), _hybrid_search(), _odata_literal(), _parent_key()]
- "function_app_function_app_clarification_library_material": "_clarification_library_material()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L578 | neighbors=[function_app.py, chat(), _group_by_document(), _hybrid_search(), _render_groups(), generate_scope()]
- "hooks_useconfigphases": "useConfigPhases.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useConfigPhases.ts:L1 | neighbors=[BidPhaseProgress.tsx, OverviewTab.tsx, c58a13c new-implementations, IConfigPhase, useConfigPhases(), useConfigStore.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-016.json

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
