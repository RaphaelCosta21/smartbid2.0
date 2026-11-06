# Node Description Batch 22 of 102

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

- "survey3d_createsurveyscene_std": "std()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L95 | neighbors=[createSurveyScene.ts, buildManifold(), buildProceduralVessel(), buildRov(), buildSatellite(), createSurveyScene()]
- "survey3d_deliverablemodels_buildcard": "buildCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/deliverableModels.ts:L95 | neighbors=[deliverableModels.ts, canvasTexture(), makeCanvas(), roundRect(), wrap(), buildDeliverable()]
- "survey3d_scenetypes_scenefocus": "SceneFocus" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L46 | neighbors=[SurveySystemPage.tsx, createSurveyScene.ts, focusController.ts, sceneTypes.ts, SurveySystemScene.tsx, surveyFreeScene.ts]
- "survey3d_scenetypes_scenenodestates": "SceneNodeStates" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L65 | neighbors=[SurveySystemPage.tsx, createSurveyScene.ts, focusController.ts, sceneTypes.ts, SurveyComposition3D.tsx, SurveySystemScene.tsx]
- "utils_accesscontrol_issuperadmin": "isSuperAdmin()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L23 | neighbors=[AppLayout.tsx, accessControl.ts, isSuperAdminUser(), useAuthStore.ts, canAccessKnowledge(), canManageErn()]
- "utils_analyticshelpers_volumetrend": "volumeTrend()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L177 | neighbors=[AnalyticsPage.tsx, OperationalSummaryPage.tsx, PerformanceTrendsPage.tsx, ReportsPage.tsx, analyticsHelpers.ts, buildPeriodSequence()]
- "utils_approvaltracks_buildtrackroundpatch": "buildTrackRoundPatch()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L252 | neighbors=[ApprovalTab.tsx, approvalHelpers.ts, approvalTracks.ts, getCurrentTrackApprovals(), getSplitApprovalStatus(), syncTrackStatuses()]
- "utils_bidconfidentiality_getconfidentialmanagers": "getConfidentialManagers()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L42 | neighbors=[ConfidentialAccessModal.tsx, BidDetailPage.tsx, bidConfidentiality.ts, canManageBidConfidentiality(), getConfidentialAllowedPeople(), uniquePeople()]
- "utils_bidhelpers_isoverduebid": "isOverdueBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L78 | neighbors=[BidTrackerPage.tsx, DashboardPage.tsx, MyDashboardPage.tsx, bidHelpers.ts, getDueFreezeDate(), isActiveBid()]
- "utils_bomparser_parsebomexcel": "parseBomExcel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L211 | neighbors=[BomCostsPage.tsx, bomParser.ts, assignParentIds(), cleanCsvValue(), emptyItem(), findColumns()]
- "utils_clarificationchatintent": "clarificationChatIntent.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationChatIntent.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 79354cb Merge remote-tracking branch 'o…, useChatStore.ts, asksAboutClarifications(), pastBidHelpers.ts, normalizeText()]
- "utils_clarificationhelpers_allcategoryoptions": "allCategoryOptions()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L52 | neighbors=[ExportClarificationModal.tsx, useClarificationLibraryFilter.ts, ClarificationBadges.tsx, clarificationExcelExport.ts, clarificationHelpers.ts, clarificationLibraryDocument.ts]
- "utils_clarificationhelpers_cleanclientdocref": "cleanClientDocRef()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L26 | neighbors=[ExportClarificationModal.tsx, ClarificationEntryDrawer.tsx, ClarificationsDbPage.tsx, clarificationExcelExport.ts, clarificationHelpers.ts, clarificationLibraryDocument.ts]
- "utils_costcalculations_converttousd": "convertToUSD()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L883 | neighbors=[AddQuotationModal.tsx, BomQuotationPicker.tsx, BomCostsPage.tsx, QueryConsultingPage.tsx, QuotationsPage.tsx, costCalculations.ts]
- "utils_divisionhelpers_builddivisionfields": "buildDivisionFields()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L135 | neighbors=[OverviewTab.tsx, CreateRequestPage.tsx, divisionHelpers.ts, composeIntegratedServiceLine(), getBidBusinessLines(), isIntegratedDivision()]
- "utils_divisionhelpers_servicelineoptionsfordivision": "serviceLineOptionsForDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L182 | neighbors=[OverviewTab.tsx, BidTrackerPage.tsx, UnassignedRequestsPage.tsx, clarificationHelpers.ts, divisionHelpers.ts, isIntegratedDivision()]
- "utils_ernhelpers_geterndeadlinestate": "getErnDeadlineState()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L191 | neighbors=[ErnDetailsModal.tsx, OverviewTab.tsx, ernHelpers.ts, isErnClosed(), isErnOnHold(), ErnDashboardSection.tsx]
- "utils_exporthelpers_downloadcsv": "downloadCSV()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L79 | neighbors=[BidDetailsReportPage.tsx, PeriodPerformancePage.tsx, exportHelpers.ts, downloadBlob(), BidDetailPage.tsx, OperationalSummaryPage.tsx]
- "utils_formatters_formatcurrencycompact": "formatCurrencyCompact()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L24 | neighbors=[BidExportTab.tsx, ParetoChart.tsx, DashboardKPIRow.tsx, AnalyticsPage.tsx, BidDetailsReportPage.tsx, formatters.ts]
- "utils_nmeadecode_t": "t()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L10 | neighbors=[nmeaDecode.ts, item(), parseNmea(), plain(), positionItem(), tagged()]
- "utils_pastbiddocument_classification": "classification()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L244 | neighbors=[pastBidDocument.ts, heading(), lines(), mergeUnique(), record(), scopeLines()]
- "utils_pastbiddocument_mergeunique": "mergeUnique()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L123 | neighbors=[PastBidProfileModal.tsx, PastBidKnowledgeService.ts, pastBidDocument.ts, classification(), derivePastBidTags(), pastBidHelpers.ts]
- "utils_qualificationhelpers_findmanualqualificationtablekey": "findManualQualificationTableKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L229 | neighbors=[QualificationLibraryView.tsx, QualificationTableModal.tsx, qualificationHelpers.ts, isManualQualificationTableKey(), qualificationLibraryTableKey(), qualificationTableKey()]
- "utils_qualificationhelpers_normalizequalificationtables": "normalizeQualificationTables()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L62 | neighbors=[QualificationsTab.tsx, ScopeOfSupplyTab.tsx, BidDetailPage.tsx, pastBidDocument.ts, qualificationHelpers.ts, buildQualificationLibraryRowsFromBid()]
- "utils_qualificationhelpers_qualificationlibrarytablekey": "qualificationLibraryTableKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L194 | neighbors=[ImportQualificationModal.tsx, QualificationEntryDrawer.tsx, QualificationLibraryView.tsx, qualificationHelpers.ts, findManualQualificationTableKey(), qualificationTableKey()]
- "utils_qualificationhelpers_qualificationtablekey": "qualificationTableKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L24 | neighbors=[QualificationSuggestionsModal.tsx, QualificationLibraryView.tsx, qualificationHelpers.ts, findManualQualificationTableKey(), findQualificationTable(), qualificationLibraryTableKey()]
- "utils_quotationlinks_todayiso": "todayIso()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L40 | neighbors=[AssetsBreakdownTab.tsx, LinkedQuotationsPanel.tsx, quotationLinks.ts, buildReceivedLink(), getWaitingDays(), isLinkOverdue()]
- "utils_scopehelpers_isplaceholderpartnumber": "isPlaceholderPartNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/scopeHelpers.ts:L55 | neighbors=[AssetsBreakdownTab.tsx, CostSearchModal.tsx, ScopeOfSupplyTab.tsx, PartNumberAutocomplete.tsx, scopeHelpers.ts, searchablePartNumber()]
- "utils_suppliermatching_normalizesuppliername": "normalizeSupplierName()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L69 | neighbors=[SuppliersRegistry.tsx, useSupplierStore.ts, supplierMatching.ts, findSupplierMatch(), supplierTokens(), supplierProfile.ts]
- "utils_surveypackages_resolveactivespread": "resolveActiveSpread()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyPackages.ts:L136 | neighbors=[SurveySystemPage.tsx, SurveyComposition3D.tsx, surveyPackages.ts, composePackages(), diagramsOf(), packagesOf()]
- "utils_surveyspreadgraph_ispreadnode": "ISpreadNode" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L17 | neighbors=[SurveySystemPage.tsx, surveyDataJourney.ts, surveyFailure.ts, surveyFreeScene.ts, surveyGlossary.ts, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_tracesignalpath": "traceSignalPath()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L218 | neighbors=[SurveySystemPage.tsx, surveySpreadGraph.ts, traceDataRoute(), baseId(), buildAdjacency(), shortestPath()]
- "utils_textsimilarity": "textSimilarity.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/textSimilarity.ts:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, bidComparator.ts, boundedLevenshtein(), similarityAtLeast(), tokenSortKey()]
- "bid_emptysection_emptysection": "EmptySection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EmptySection.tsx:L4 | neighbors=[DocumentsTab.tsx, EmptySection.tsx, NotesTab.tsx, OverviewTab.tsx, QualificationsTab.tsx]
- "bidexcelexport_excelstyles_ixlcolumn": "IXlColumn" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L158 | neighbors=[excelStyles.ts, IXlColumnDef, IXlRange, costSummarySheet.ts, infoSheet.ts]
- "bidexcelexport_excelstyles_ixlcolumndef": "IXlColumnDef" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L179 | neighbors=[excelStyles.ts, IXlColumn, currencyTable.ts, hoursSheet.ts, prepMobSheet.ts]
- "bidexcelexport_excelstyles_thin": "thin()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L252 | neighbors=[excelStyles.ts, .band(), .keyValue(), .noticeStrip(), .total()]
- "bidexcelexport_excelstyles_xlsheet_total": ".total()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L620 | neighbors=[XlSheet, thin(), .fillRange(), .font(), .setValue()]
- "bidexcelexport_excelstyles_xlvalue": "XlValue" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L176 | neighbors=[excelStyles.ts, assetsSheet.ts, currencyTable.ts, prepMobSheet.ts, bomExcelExport.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@540b3b9338c379ce2f335bc00cb29318a93b325e": "540b3b9 style(DocLibraryCatalog): improve formatting and readability of move co…" | kind=Commit | source=git | neighbors=[main, 7342177 Merge feat/survey-surface-spare…, ca73461 feat(survey): spare quantities,…, DocLibraryCatalog.tsx, 87bda2e feat(docs): add move functional…]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-021.json

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
