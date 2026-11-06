# Node Description Batch 18 of 102

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

- "hooks_useern": "useErn.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useErn.ts:L1 | neighbors=[892c1fc feat: add PeoplePicker componen…, useErn(), UseErnResult, index.ts, ErnService.ts, ErnService]
- "hooks_useexport": "useExport.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useExport.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, useExport(), IBidExport.ts, IExportOptions, IExportResult, index.ts]
- "hooks_usetemplates": "useTemplates.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useTemplates.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, c4e04de lots-implementation, useTemplates(), IBidTemplate.ts, IBidTemplate, useTemplateStore.ts]
- "layout_sidebaritem": "SidebarItem.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarItem.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 3c5c37b more-mods, 4c2e63a update smartbid 2.0, 79354cb Merge remote-tracking branch 'o…, Sidebar.tsx]
- "layout_sidebarsubmenu": "SidebarSubmenu.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarSubmenu.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 79354cb Merge remote-tracking branch 'o…, ea5c8e6 Refactor UI components for cons…, Sidebar.tsx]
- "models_idoclibraryitem_idoclibrarymetadata": "IDocLibraryMetadata" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDocLibraryItem.ts:L46 | neighbors=[DocLibraryCatalog.tsx, IDocLibraryItem.ts, index.ts, DocLibraryCatalogService.ts, TechnicalProposalKnowledgeService.ts, clarificationLibraryDocument.ts]
- "models_iern": "IErn.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IErn.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, 892c1fc feat: add PeoplePicker componen…, aaa091c Add hooks for KPI targets and l…, ErnDeadlineState, IErn, IErnCreateData]
- "models_isystemconfig_iconfigoption": "IConfigOption" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L5 | neighbors=[useClarificationLibraryFilter.ts, useQualificationLibraryFilter.ts, QualificationTableModal.tsx, index.ts, ISystemConfig.ts, clarificationHelpers.ts]
- "pages_patchnotespage": "PatchNotesPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PatchNotesPage.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, AppLayout.tsx, PageHeader.tsx, PageHeader(), PatchNotesPage()]
- "services_accesslogservice": "AccessLogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AccessLogService.ts:L1 | neighbors=[9582626 feat: add Access Log component …, AppLayout.tsx, index.ts, AccessLogService, isNotFound(), SPService.ts]
- "services_activitylogservice": "ActivityLogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ActivityLogService.ts:L1 | neighbors=[AddQuotationModal.tsx, 4c2e63a update smartbid 2.0, dbdc03a systemconfig online, IActivityLog.ts, IActivityLogEntry, ActivityLogService]
- "services_aianalysisservice_aianalysisservice_buildrequest": ".buildRequest()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L309 | neighbors=[AIAnalysisService, .analyzeDocument(), .analyzeDocumentForTemplate(), .fileToBase64(), .extractDocumentMetadata(), .extractQuotation()]
- "services_currencyservice": "CurrencyService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L1 | neighbors=[OverviewTab.tsx, bee3eb5 feat: Enhance bid model with av…, BCB_CURRENCY_TYPES, CurrencyService, IBCBCurrencyResponse, IBCBDollarResponse]
- "services_currencyservice_currencyservice": "CurrencyService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L56 | neighbors=[OverviewTab.tsx, CurrencyService.ts, .formatDateForBCB(), .getCurrencyRate(), .getRates(), .getRatesWithFallback()]
- "services_exportservice_exportservice": "ExportService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ExportService.ts:L10 | neighbors=[useExport.ts, BidDetailsReportPage.tsx, PeriodPerformancePage.tsx, ExportService.ts, .exportToExcel(), .exportToPDF()]
- "services_favoritesservice": "FavoritesService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L1 | neighbors=[e2285cf cont-implementing, index.ts, EMPTY_DATA, FavoritesService, SPService.ts, SPService]
- "services_userservice": "UserService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/UserService.ts:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, dbdc03a systemconfig online, AppLayout.tsx, index.ts, SPService.ts]
- "stores_usebomcostanalysisstore": "useBomCostAnalysisStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBomCostAnalysisStore.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, useQuerySearch.ts, index.ts, BomCostAnalysisService.ts, BomCostAnalysisService]
- "stores_usesurveystore_usesurveystore": "useSurveyStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSurveyStore.ts:L67 | neighbors=[useSurveyPortal.ts, CreateRequestPage.tsx, SurveySystemPage.tsx, useSurveyStore.ts, SurveyComposition3D.tsx, SurveyEquipmentDetail.tsx]
- "survey_surveyfailurepanel": "SurveyFailurePanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyFailurePanel.tsx:L1 | neighbors=[2a932fc feat(survey): failure cascade, …, 5d664ea Merge feat/survey-knowledge-por…, 6062346 feat(survey): failure cascade, …, SurveySystemPage.tsx, SurveyFailurePanel(), SurveyFailurePanelProps]
- "utils_bidconfidentiality_canopenbid": "canOpenBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L83 | neighbors=[ApprovalTab.tsx, ConfidentialLock.tsx, useOpenBid.ts, BidDetailPage.tsx, bidConfidentiality.ts, getConfidentialAllowedPeople()]
- "utils_constants_priority_colors": "PRIORITY_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L10 | neighbors=[OverviewTab.tsx, PriorityBadge.tsx, useStatusColors.ts, BidDetailPage.tsx, CreateRequestPage.tsx, UnassignedRequestsPage.tsx]
- "utils_costcalculations_ibidfx": "IBidFx" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L653 | neighbors=[BidFxNote.tsx, BidHoursTable.tsx, CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx, PreparationMobilizationTab.tsx, currencyTable.ts]
- "utils_costcalculations_isrentalacq": "isRentalAcq()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L105 | neighbors=[AssetsBreakdownTab.tsx, rows.ts, costCalculations.ts, getAssetCostBreakdown(), getEffectiveCategory(), getSplitNode()]
- "utils_costcalculations_isworkshopacq": "isWorkshopAcq()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L110 | neighbors=[AssetsBreakdownTab.tsx, rows.ts, bidPresentation.ts, costCalculations.ts, getAssetCostBreakdown(), getEffectiveCategory()]
- "utils_pastbiddocument_buildpastbiddocument": "buildPastBidDocument()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L991 | neighbors=[PastBidKnowledgeService.ts, pastBidDocument.ts, buildPastBidAiDigest(), clean(), day(), getPastBidYear()]
- "utils_pastbiddocument_day": "day()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L79 | neighbors=[clarificationLibraryDocument.ts, pastBidDocument.ts, buildPastBidDocument(), buildPastBidMetadata(), identification(), outcome()]
- "utils_scopehelpers_searchablepartnumber": "searchablePartNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/scopeHelpers.ts:L71 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, CostSearchModal.tsx, LinkedQuotationsPanel.tsx, BomCostsPage.tsx, bidPresentation.ts]
- "utils_surveybidintel": "surveyBidIntel.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidIntel.ts:L1 | neighbors=[ddf6c96 Merge branch 'feat/survey-knowl…, f06225e feat(survey): Survey Knowledge …, useSurveyPortal.ts, index.ts, computeSurveyBidIntel(), median()]
- "utils_surveybidmatch": "surveyBidMatch.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidMatch.ts:L1 | neighbors=[512f7b1 feat(survey): full-bleed 3D sea…, ddf6c96 Merge branch 'feat/survey-knowl…, useSurveyPortal.ts, index.ts, isDistinctive(), matchBidEquipment()]
- "approval_approvalbadge": "ApprovalBadge.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalBadge.tsx:L1 | neighbors=[ApprovalBadge(), ApprovalBadgeProps, index.ts, 0546310 Add dashboard components and st…, 14b96c8 feat: implement approval round …, 3a3d0a5 new changes]
- "bid_bidtabheader_headerchip": "HeaderChip()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L300 | neighbors=[AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidFxNote.tsx, BidTabHeader.tsx, CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx]
- "bid_bidtemplateimport": "BidTemplateImport.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTemplateImport.tsx:L1 | neighbors=[BidTemplateImport(), BidTemplateImportProps, IBidTemplate.ts, IBidTemplate, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0]
- "bid_revisionstab_getcurrentrevisionletter": "getCurrentRevisionLetter()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L46 | neighbors=[BidExportTab.tsx, OverviewTab.tsx, RevisionsTab.tsx, RevisionsTab(), index.ts, BidDetailPage.tsx]
- "bidexcelexport_excelstyles_xlsheet_band": ".band()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L587 | neighbors=[XlSheet, solid(), thin(), tint(), .fillRange(), .font()]
- "bidexcelexport_excelstyles_xlsheet_banner": ".banner()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L335 | neighbors=[XlSheet, .fillRange(), .font(), .gap(), .noticeStrip(), .placeLogo()]
- "bidexcelexport_excelstyles_xlsheet_fillrange": ".fillRange()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L309 | neighbors=[XlSheet, .band(), .banner(), .keyValue(), .note(), .noticeStrip()]
- "bidexcelexport_excelstyles_xlsheet_keyvalue": ".keyValue()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L654 | neighbors=[XlSheet, thin(), .estimateHeight(), .fillRange(), .font(), .setValue()]
- "charts_sparkline_sparkline": "Sparkline()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/Sparkline.tsx:L16 | neighbors=[Sparkline.tsx, AnalyticsPage.tsx, FollowUpPage.tsx, OperationalSummaryPage.tsx, PerformanceTrendsPage.tsx, PeriodPerformancePage.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@0b9cb2245ea5063a72181a75717d2263348ea6b9": "0b9cb22 refactor(survey): remove Missions and Ask for now" | kind=Commit | source=git | neighbors=[main, acf62bf refactor(survey): data journey …, surveyGlossary.ts, SurveySystemPage.tsx, SurveySystemScene.tsx, surveyGlossary.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-017.json

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
