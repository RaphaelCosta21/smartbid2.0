# Node Description Batch 20 of 102

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

- "services_favoritesservice_favoritesservice_save": ".save()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L48 | neighbors=[FavoritesService, .addBidFavorite(), .addEquipment(), .removeBidFavorite(), .removeEquipment(), .updateEquipment()]
- "services_linksrecommendationsservice_linksrecommendationsservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L25 | neighbors=[LinksRecommendationsService, .addLink(), .addRecommendation(), .removeLink(), .removeRecommendation(), .updateLink()]
- "services_linksrecommendationsservice_linksrecommendationsservice_save": ".save()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L46 | neighbors=[LinksRecommendationsService, .addLink(), .addRecommendation(), .removeLink(), .removeRecommendation(), .updateLink()]
- "services_notificationdispatchservice_notificationdispatchservice": "NotificationDispatchService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationDispatchService.ts:L55 | neighbors=[BidDetailPage.tsx, CreateRequestPage.tsx, UnassignedRequestsPage.tsx, NotificationDispatchService.ts, .emit(), .sendTest()]
- "services_notificationservice_notificationservice": "NotificationService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L16 | neighbors=[NotificationService.ts, ._emit(), .error(), .info(), .subscribe(), .success()]
- "services_supplierservice_supplierservice_columns": ".columns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L172 | neighbors=[SupplierService, ._provisionColumns(), .create(), .getAll(), .update(), .updateAliases()]
- "services_supplierservice_supplierservice_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L239 | neighbors=[SupplierService, ._clearLogo(), .columns(), ._setLogo(), toFields(), .updateAliases()]
- "stores_userequeststore": "useRequestStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useRequestStore.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, useRequests.ts, CreateRequestPage.tsx, IBidRequest.ts, IBidRequest, RequestState]
- "survey_glossarycontext": "GlossaryContext.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/GlossaryContext.ts:L1 | neighbors=[3d59093 Merge feat/survey-data-journey …, d614a0b feat(survey): bilingual survey …, SurveySystemPage.tsx, index.ts, GlossaryContext, IGlossaryContextValue]
- "survey_surveyaddtopackagedialog": "SurveyAddToPackageDialog.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyAddToPackageDialog.tsx:L1 | neighbors=[67bbf62 feat(survey): apply Figma look …, ddf6c96 Merge branch 'feat/survey-knowl…, f06225e feat(survey): Survey Knowledge …, SurveySystemPage.tsx, index.ts, SurveyAddToPackageDialog()]
- "survey_surveyassets": "surveyAssets.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/surveyAssets.ts:L1 | neighbors=[67bbf62 feat(survey): apply Figma look …, 86dba8c feat(survey): restore three.js …, d227784 feat(survey): Figma 2D system v…, ddf6c96 Merge branch 'feat/survey-knowl…, SURVEY_FIT_ICONS, SURVEY_OCEAN_BG]
- "utils_activityloghelpers_createactivitylogentry": "createActivityLogEntry()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/activityLogHelpers.ts:L219 | neighbors=[ApprovalTab.tsx, BidConfidentialButton.tsx, BidExportTab.tsx, DocumentsTab.tsx, OverviewTab.tsx, activityLogHelpers.ts]
- "utils_approvaltracks_getlatesttrackround": "getLatestTrackRound()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L120 | neighbors=[ApprovalTab.tsx, OverviewTab.tsx, approvalHelpers.ts, approvalTracks.ts, getTrackRounds(), getTrackStatus()]
- "utils_bidconfidentiality_isbidconfidential": "isBidConfidential()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L37 | neighbors=[BidConfidentialButton.tsx, ConfidentialAccessModal.tsx, ConfidentialLock.tsx, CommandPalette.tsx, BidDetailsReportPage.tsx, bidConfidentiality.ts]
- "utils_bomparser_parsebomcsv": "parseBomCSV()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L139 | neighbors=[BomCostsPage.tsx, bomParser.ts, assignParentIds(), cleanCsvValue(), emptyItem(), findColumns()]
- "utils_costcalculations_calculatemulticurrencytotals": "calculateMultiCurrencyTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L699 | neighbors=[CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx, PreparationMobilizationTab.tsx, ScopeOfSupplyTab.tsx, costCalculations.ts, buildCostSummary()]
- "utils_costcalculations_getassetscostcompleteness": "getAssetsCostCompleteness()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L468 | neighbors=[ApprovalTab.tsx, AssetsBreakdownTab.tsx, BidExportTab.tsx, BidStatusPhasePanel.tsx, assetsSheet.ts, costSummarySheet.ts]
- "utils_costcalculations_getbidfx": "getBidFx()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L674 | neighbors=[ScopeOfSupplyTab.tsx, BidDetailPage.tsx, costCalculations.ts, buildCostSummary(), calculateHoursTotals(), costSummaryView.ts]
- "utils_costcalculations_geteffectivecategory": "getEffectiveCategory()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L204 | neighbors=[rows.ts, costCalculations.ts, getAssetCostBreakdown(), isRentalAcq(), isWorkshopAcq(), getSplitNode()]
- "utils_currencyhelpers": "currencyHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/currencyHelpers.ts:L1 | neighbors=[CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx, PreparationMobilizationTab.tsx, c58a13c new-implementations, useConfigStore.ts, useConfigStore]
- "utils_divisionhelpers_getbusinesslinelabel": "getBusinessLineLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L85 | neighbors=[ApprovalTab.tsx, ErnCreateModal.tsx, OverviewTab.tsx, CreateRequestPage.tsx, divisionHelpers.ts, getTrackLabel()]
- "utils_divisionhelpers_gettracklabel": "getTrackLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L103 | neighbors=[ApprovalTab.tsx, OverviewTab.tsx, approvalTracks.ts, divisionHelpers.ts, businessLineDivision(), getBusinessLineLabel()]
- "utils_formatters_formatnumber": "formatNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L34 | neighbors=[CertificationsBreakdownTab.tsx, ScopeOfSupplyTab.tsx, PastBidCard.tsx, BidDetailsReportPage.tsx, LaborTab.tsx, exportHelpers.ts]
- "utils_pastbiddocument_identification": "identification()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L176 | neighbors=[pastBidDocument.ts, currentRevisionLetter(), day(), heading(), lines(), names()]
- "utils_pastbiddocument_pricing": "pricing()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L407 | neighbors=[pastBidDocument.ts, amount(), day(), heading(), hours(), lines()]
- "utils_pastbidhelpers_matchespastbidsearch": "matchesPastBidSearch()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L128 | neighbors=[ExportClarificationModal.tsx, useClarificationLibraryFilter.ts, useQualificationLibraryFilter.ts, FavoritesPage.tsx, PastBidsPage.tsx, pastBidHelpers.ts]
- "utils_pastbidledger_buildpastbidchatcontext": "buildPastBidChatContext()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L165 | neighbors=[useChatStore.ts, pastBidLedger.ts, countBy(), day(), hasIntent(), questionTerms()]
- "utils_suppliermatching_findsuppliermatch": "findSupplierMatch()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L99 | neighbors=[SupplierCombobox.tsx, SuppliersRegistry.tsx, useSupplierStore.ts, aiQuotationMapper.ts, supplierMatching.ts, canonicalSupplierName()]
- "utils_surveydatajourney_builddatajourney": "buildDataJourney()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L176 | neighbors=[SurveySystemPage.tsx, surveyDataJourney.ts, compose(), overrideOf(), same(), toFormat()]
- "approval_approvaldecisionpanel": "ApprovalDecisionPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalDecisionPanel.tsx:L1 | neighbors=[ApprovalDecisionPanel(), ApprovalDecisionPanelProps, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…]
- "approval_approvalrequestcard": "ApprovalRequestCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalRequestCard.tsx:L1 | neighbors=[ApprovalRequestCard(), ApprovalRequestCardProps, IBidApproval.ts, IBidApprovalState, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0]
- "bid_addquotationmodal_addquotationmodal": "AddQuotationModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L99 | neighbors=[AddQuotationModal.tsx, blankLineItem(), AssetsBreakdownTab.tsx, CostSearchModal.tsx, BomCostsPage.tsx, QuotationsPage.tsx]
- "bid_bidfavoritebutton_bidfavoritebutton": "BidFavoriteButton()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidFavoriteButton.tsx:L18 | neighbors=[BidFavoriteButton.tsx, PastBidCard.tsx, PastBidDrawer.tsx, BidDetailPage.tsx, FavoritesPage.tsx, PastBidsPage.tsx]
- "bid_bidfxnote_bidfxnote": "BidFxNote()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidFxNote.tsx:L45 | neighbors=[BidCostSummary.tsx, BidFxNote.tsx, BidHoursTable.tsx, CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx, PreparationMobilizationTab.tsx]
- "bid_bidtabheader_sharebar": "ShareBar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L209 | neighbors=[AssetsBreakdownTab.tsx, BidHoursTable.tsx, BidTabHeader.tsx, LogisticsBreakdownTab.tsx, PreparationMobilizationTab.tsx, ScopeOfSupplyTab.tsx]
- "bid_emptysection": "EmptySection.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EmptySection.tsx:L1 | neighbors=[DocumentsTab.tsx, EmptySection(), NotesTab.tsx, OverviewTab.tsx, QualificationsTab.tsx, c58a13c new-implementations]
- "bid_revisionstab_revisionstab": "RevisionsTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L62 | neighbors=[RevisionsTab.tsx, canStartRevision(), getActiveRevision(), getCurrentRevisionLetter(), getRevisionLetter(), BidDetailPage.tsx]
- "bidexcelexport_excelstyles_ixlrange": "IXlRange" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L218 | neighbors=[excelStyles.ts, IXlColumn, assetsSheet.ts, hoursSheet.ts, suppliersSheet.ts, bomExcelExport.ts]
- "bidexcelexport_excelstyles_xlsheet_note": ".note()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L711 | neighbors=[XlSheet, .estimateHeight(), .fillRange(), .font(), .setValue(), .spanWidth()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@27f41ab7ab8dcb78412a547c5d9f5d50fd4ef3bf": "27f41ab refactor: improve code formatting and readability in OverviewTab and ov…" | kind=Commit | source=git | neighbors=[OverviewTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, 8f7062d Remove outdated UI/UX design gu…, 9759c3b Refactor DivisionBadge and Memb…]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-019.json

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
