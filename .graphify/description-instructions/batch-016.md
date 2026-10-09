# Node Description Batch 17 of 86

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

- "services_accesslogservice_accesslogservice": "AccessLogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AccessLogService.ts:L20 | neighbors=[AppLayout.tsx, AccessLogService.ts, .ensureList(), .getRecent(), ._list(), .logAccess()]
- "services_assetcatalogservice_assetcatalogservice": "AssetCatalogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AssetCatalogService.ts:L9 | neighbors=[EquipmentImportModal.tsx, AIDocumentAnalyzer.tsx, AssetsCatalogPage.tsx, AssetCatalogService.ts, .getAll(), .mapFromSP()]
- "services_clarificationknowledgeservice_clarificationknowledgeservice": "ClarificationKnowledgeService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationKnowledgeService.ts:L29 | neighbors=[useClarificationLibrarySync.ts, ClarificationsDbPage.tsx, ClarificationKnowledgeService.ts, ._ensureColumns(), .folderServerRelativeUrl(), .publish()]
- "services_dashboardservice_dashboardservice": "DashboardService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L17 | neighbors=[DashboardPage.tsx, DashboardService.ts, .buildDashboardData(), .calculateDivisionWorkloads(), .calculateKPIs(), .calculateMonthlyVolumes()]
- "services_editcontrolservice": "EditControlService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L1 | neighbors=[c58a13c new-implementations, useEditControl.ts, BidDetailPage.tsx, index.ts, EditControlService, SPService.ts]
- "services_favoritesservice_favoritesservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L27 | neighbors=[FavoritesService, .addBidFavorite(), .addEquipment(), .removeBidFavorite(), .removeEquipment(), .updateEquipment()]
- "services_favoritesservice_favoritesservice_save": ".save()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L48 | neighbors=[FavoritesService, .addBidFavorite(), .addEquipment(), .removeBidFavorite(), .removeEquipment(), .updateEquipment()]
- "services_linksrecommendationsservice_linksrecommendationsservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L25 | neighbors=[LinksRecommendationsService, .addLink(), .addRecommendation(), .removeLink(), .removeRecommendation(), .updateLink()]
- "services_linksrecommendationsservice_linksrecommendationsservice_save": ".save()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L46 | neighbors=[LinksRecommendationsService, .addLink(), .addRecommendation(), .removeLink(), .removeRecommendation(), .updateLink()]
- "services_notificationdispatchservice_notificationdispatchservice": "NotificationDispatchService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationDispatchService.ts:L55 | neighbors=[BidDetailPage.tsx, CreateRequestPage.tsx, UnassignedRequestsPage.tsx, NotificationDispatchService.ts, .emit(), .sendTest()]
- "services_notificationservice_notificationservice": "NotificationService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L16 | neighbors=[NotificationService.ts, ._emit(), .error(), .info(), .subscribe(), .success()]
- "services_supplierservice_supplierservice_columns": ".columns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L172 | neighbors=[SupplierService, ._provisionColumns(), .create(), .getAll(), .update(), .updateAliases()]
- "services_supplierservice_supplierservice_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L239 | neighbors=[SupplierService, ._clearLogo(), .columns(), ._setLogo(), toFields(), .updateAliases()]
- "stores_usebomcostanalysisstore": "useBomCostAnalysisStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBomCostAnalysisStore.ts:L1 | neighbors=[bc10d67 feat: add pastBidHelpers and pa…, useQuerySearch.ts, index.ts, BomCostAnalysisService.ts, BomCostAnalysisService, BomCostAnalysisState]
- "stores_userequeststore": "useRequestStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useRequestStore.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, useRequests.ts, CreateRequestPage.tsx, IBidRequest.ts, IBidRequest, RequestState]
- "utils_activityloghelpers_createactivitylogentry": "createActivityLogEntry()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/activityLogHelpers.ts:L204 | neighbors=[ApprovalTab.tsx, BidConfidentialButton.tsx, BidExportTab.tsx, DocumentsTab.tsx, OverviewTab.tsx, activityLogHelpers.ts]
- "utils_bidconfidentiality_isbidconfidential": "isBidConfidential()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L37 | neighbors=[BidConfidentialButton.tsx, ConfidentialAccessModal.tsx, ConfidentialLock.tsx, CommandPalette.tsx, BidDetailsReportPage.tsx, bidConfidentiality.ts]
- "utils_bomparser_parsebomcsv": "parseBomCSV()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L139 | neighbors=[BomCostsPage.tsx, bomParser.ts, assignParentIds(), cleanCsvValue(), emptyItem(), findColumns()]
- "utils_costcalculations_calculatemulticurrencytotals": "calculateMultiCurrencyTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L699 | neighbors=[CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx, PreparationMobilizationTab.tsx, ScopeOfSupplyTab.tsx, costCalculations.ts, buildCostSummary()]
- "utils_costcalculations_getassetscostcompleteness": "getAssetsCostCompleteness()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L468 | neighbors=[ApprovalTab.tsx, AssetsBreakdownTab.tsx, BidExportTab.tsx, BidStatusPhasePanel.tsx, assetsSheet.ts, costSummarySheet.ts]
- "utils_costcalculations_getbidfx": "getBidFx()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L674 | neighbors=[ScopeOfSupplyTab.tsx, BidDetailPage.tsx, costCalculations.ts, buildCostSummary(), calculateHoursTotals(), costSummaryView.ts]
- "utils_costcalculations_geteffectivecategory": "getEffectiveCategory()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L204 | neighbors=[rows.ts, costCalculations.ts, getAssetCostBreakdown(), isRentalAcq(), isWorkshopAcq(), getSplitNode()]
- "utils_costcalculations_isnocostavailability": "isNoCostAvailability()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L100 | neighbors=[rows.ts, costCalculations.ts, getAssetCostBreakdown(), getSplitNode(), getSubItemNode(), norm()]
- "utils_costcalculations_isworkshopacq": "isWorkshopAcq()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L110 | neighbors=[AssetsBreakdownTab.tsx, rows.ts, costCalculations.ts, getAssetCostBreakdown(), getEffectiveCategory(), getSplitNode()]
- "utils_currencyhelpers": "currencyHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/currencyHelpers.ts:L1 | neighbors=[CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx, PreparationMobilizationTab.tsx, c58a13c new-implementations, useConfigStore.ts, useConfigStore]
- "utils_pastbiddocument_identification": "identification()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L175 | neighbors=[pastBidDocument.ts, currentRevisionLetter(), day(), heading(), lines(), names()]
- "utils_pastbiddocument_pricing": "pricing()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L406 | neighbors=[pastBidDocument.ts, amount(), day(), heading(), hours(), lines()]
- "utils_pastbidhelpers_matchespastbidsearch": "matchesPastBidSearch()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L128 | neighbors=[ExportClarificationModal.tsx, useClarificationLibraryFilter.ts, useQualificationLibraryFilter.ts, FavoritesPage.tsx, PastBidsPage.tsx, pastBidHelpers.ts]
- "utils_pastbidledger_buildpastbidchatcontext": "buildPastBidChatContext()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L165 | neighbors=[useChatStore.ts, pastBidLedger.ts, countBy(), day(), hasIntent(), questionTerms()]
- "utils_suppliermatching_findsuppliermatch": "findSupplierMatch()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L99 | neighbors=[SupplierCombobox.tsx, SuppliersRegistry.tsx, useSupplierStore.ts, aiQuotationMapper.ts, supplierMatching.ts, canonicalSupplierName()]
- "approval_approvalbadge": "ApprovalBadge.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalBadge.tsx:L1 | neighbors=[ApprovalBadge(), ApprovalBadgeProps, index.ts, 0546310 Add dashboard components and st…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0]
- "approval_approvalrequestcard": "ApprovalRequestCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalRequestCard.tsx:L1 | neighbors=[ApprovalRequestCard(), ApprovalRequestCardProps, IBidApproval.ts, IBidApprovalState, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0]
- "bid_bidfavoritebutton_bidfavoritebutton": "BidFavoriteButton()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidFavoriteButton.tsx:L18 | neighbors=[BidFavoriteButton.tsx, PastBidCard.tsx, PastBidDrawer.tsx, BidDetailPage.tsx, FavoritesPage.tsx, PastBidsPage.tsx]
- "bid_bidfxnote_bidfxnote": "BidFxNote()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidFxNote.tsx:L45 | neighbors=[BidCostSummary.tsx, BidFxNote.tsx, BidHoursTable.tsx, CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx, PreparationMobilizationTab.tsx]
- "bid_bidtabheader_sharebar": "ShareBar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L209 | neighbors=[AssetsBreakdownTab.tsx, BidHoursTable.tsx, BidTabHeader.tsx, LogisticsBreakdownTab.tsx, PreparationMobilizationTab.tsx, ScopeOfSupplyTab.tsx]
- "bid_emptysection": "EmptySection.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EmptySection.tsx:L1 | neighbors=[DocumentsTab.tsx, EmptySection(), NotesTab.tsx, OverviewTab.tsx, QualificationsTab.tsx, c58a13c new-implementations]
- "bid_revisionstab_revisionstab": "RevisionsTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L62 | neighbors=[RevisionsTab.tsx, canStartRevision(), getActiveRevision(), getCurrentRevisionLetter(), getRevisionLetter(), BidDetailPage.tsx]
- "bidexcelexport_excelstyles_xlsheet_note": ".note()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L708 | neighbors=[XlSheet, .estimateHeight(), .fillRange(), .font(), .setValue(), .spanWidth()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@db68d816d0fd8dae08b59812c2576d8ca5a79b16": "db68d81 feat: Enhance ErnCreateModal and ErnService with improved deliverable t…" | kind=Commit | source=git | neighbors=[aa081f9 refactor: Improve code formatti…, ErnCreateModal.tsx, main, 921bf0d feat: enhance SupplierDrawer wi…, ErnService.ts, ernHelpers.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@e2388c0cdabb3074b8456b1028070e56569155eb": "e2388c0 feat(survey): allow Knowledge editors (templates edit) to import the su…" | kind=Commit | source=git | neighbors=[main, 0deadb7 fix(survey): read catalog jsond…, SurveyEquipmentPage.tsx, SurveySystemPage.tsx, SurveyPortalHeader.tsx, f06225e feat(survey): Survey Knowledge …]

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
