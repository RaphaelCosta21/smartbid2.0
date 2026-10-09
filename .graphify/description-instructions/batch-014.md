# Node Description Batch 15 of 86

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
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "hooks_useern": "useErn.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useErn.ts:L1 | neighbors=[892c1fc feat: add PeoplePicker componen…, useErn(), UseErnResult, index.ts, ErnService.ts, ErnService]
- "hooks_useexport": "useExport.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useExport.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, useExport(), IBidExport.ts, IExportOptions, IExportResult, index.ts]
- "hooks_usetemplates": "useTemplates.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useTemplates.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, c4e04de lots-implementation, useTemplates(), IBidTemplate.ts, IBidTemplate, useTemplateStore.ts]
- "models_idoclibraryitem_idoclibrarymetadata": "IDocLibraryMetadata" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDocLibraryItem.ts:L46 | neighbors=[DocLibraryCatalog.tsx, IDocLibraryItem.ts, index.ts, DocLibraryCatalogService.ts, TechnicalProposalKnowledgeService.ts, clarificationLibraryDocument.ts]
- "models_isystemconfig_iconfigoption": "IConfigOption" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L5 | neighbors=[useClarificationLibraryFilter.ts, useQualificationLibraryFilter.ts, QualificationTableModal.tsx, index.ts, ISystemConfig.ts, clarificationHelpers.ts]
- "pages_easibidcomparatorpage": "EasiBidComparatorPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/EasiBidComparatorPage.tsx:L1 | neighbors=[3f57ca9 merge: integrate EASI module pa…, 6d20432 feat: adiciona paginas EASI ao …, 8267c28 i18n: translate EASI, suppliers…, ddf6c96 Merge branch 'feat/survey-knowl…, AppLayout.tsx, EasiBidComparatorPage()]
- "pages_easibidpresentationpage": "EasiBidPresentationPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/EasiBidPresentationPage.tsx:L1 | neighbors=[3f57ca9 merge: integrate EASI module pa…, 6d20432 feat: adiciona paginas EASI ao …, 8267c28 i18n: translate EASI, suppliers…, ddf6c96 Merge branch 'feat/survey-knowl…, AppLayout.tsx, EasiBidPresentationPage()]
- "pages_easipricehistorypage": "EasiPriceHistoryPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/EasiPriceHistoryPage.tsx:L1 | neighbors=[3f57ca9 merge: integrate EASI module pa…, 6d20432 feat: adiciona paginas EASI ao …, 8267c28 i18n: translate EASI, suppliers…, ddf6c96 Merge branch 'feat/survey-knowl…, AppLayout.tsx, EasiModuleFrame.tsx]
- "pages_patchnotespage": "PatchNotesPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PatchNotesPage.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, AppLayout.tsx, PageHeader.tsx, PageHeader(), PatchNotesPage()]
- "reports_exportbar": "ExportBar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ExportBar.tsx:L1 | neighbors=[8267c28 i18n: translate EASI, suppliers…, c271ce8 Refactor code structure for imp…, ddf6c96 Merge branch 'feat/survey-knowl…, BidDetailsReportPage.tsx, PeriodPerformancePage.tsx, ExportBar()]
- "services_accesslogservice": "AccessLogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AccessLogService.ts:L1 | neighbors=[9582626 feat: add Access Log component …, AppLayout.tsx, index.ts, AccessLogService, isNotFound(), SPService.ts]
- "services_activitylogservice": "ActivityLogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ActivityLogService.ts:L1 | neighbors=[AddQuotationModal.tsx, 4c2e63a update smartbid 2.0, dbdc03a systemconfig online, IActivityLog.ts, IActivityLogEntry, ActivityLogService]
- "services_aianalysisservice_aianalysisservice_buildrequest": ".buildRequest()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L309 | neighbors=[AIAnalysisService, .analyzeDocument(), .analyzeDocumentForTemplate(), .fileToBase64(), .extractDocumentMetadata(), .extractQuotation()]
- "services_approvalservice_approvalservice": "ApprovalService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L17 | neighbors=[ApprovalTab.tsx, ApprovalService.ts, ._approvalsList(), .ensureApprovalColumns(), .markRoundOverridden(), .processDecision()]
- "services_currencyservice": "CurrencyService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L1 | neighbors=[OverviewTab.tsx, bee3eb5 feat: Enhance bid model with av…, BCB_CURRENCY_TYPES, CurrencyService, IBCBCurrencyResponse, IBCBDollarResponse]
- "services_currencyservice_currencyservice": "CurrencyService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L56 | neighbors=[OverviewTab.tsx, CurrencyService.ts, .formatDateForBCB(), .getCurrencyRate(), .getRates(), .getRatesWithFallback()]
- "services_exportservice_exportservice": "ExportService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ExportService.ts:L10 | neighbors=[useExport.ts, BidDetailsReportPage.tsx, PeriodPerformancePage.tsx, ExportService.ts, .exportToExcel(), .exportToPDF()]
- "services_favoritesservice": "FavoritesService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L1 | neighbors=[e2285cf cont-implementing, index.ts, EMPTY_DATA, FavoritesService, SPService.ts, SPService]
- "services_userservice": "UserService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/UserService.ts:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, dbdc03a systemconfig online, AppLayout.tsx, index.ts, SPService.ts]
- "stores_useassetcatalogstore": "useAssetCatalogStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useAssetCatalogStore.ts:L1 | neighbors=[bc10d67 feat: add pastBidHelpers and pa…, useQuerySearch.ts, IAssetCatalog.ts, IAssetCatalogItem, AssetCatalogService.ts, AssetCatalogService]
- "stores_usesurveystore_usesurveystore": "useSurveyStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSurveyStore.ts:L62 | neighbors=[useSurveyPortal.ts, CreateRequestPage.tsx, SurveyEquipmentPage.tsx, SurveySystemPage.tsx, useSurveyStore.ts, SurveyEquipmentDetail.tsx]
- "survey_surveyaddtopackagedialog": "SurveyAddToPackageDialog.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyAddToPackageDialog.tsx:L1 | neighbors=[67bbf62 feat(survey): apply Figma look …, ddf6c96 Merge branch 'feat/survey-knowl…, f06225e feat(survey): Survey Knowledge …, SurveyEquipmentPage.tsx, SurveySystemPage.tsx, index.ts]
- "survey_surveyassets": "surveyAssets.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/surveyAssets.ts:L1 | neighbors=[67bbf62 feat(survey): apply Figma look …, 86dba8c feat(survey): restore three.js …, d227784 feat(survey): Figma 2D system v…, ddf6c96 Merge branch 'feat/survey-knowl…, SurveyEquipmentPage.tsx, SURVEY_FIT_ICONS]
- "survey3d_equipmentmodels_equipmentmodelfactory": "EquipmentModelFactory" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L39 | neighbors=[equipmentModels.ts, .build(), .buildShape(), .dispose(), .geo(), .loadGlb()]
- "template_templateimportwizard": "TemplateImportWizard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateImportWizard.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, c4e04de lots-implementation, IBidTemplate.ts, IBidTemplate]
- "typings_xlsx_d": "xlsx.d.ts" | kind=code-symbol | source=src/typings/xlsx.d.ts:L1 | neighbors=[1665b01 more features, 4c2e63a update smartbid 2.0, bc10d67 feat: add pastBidHelpers and pa…, e2285cf cont-implementing, CellObject, WorkBook]
- "utils_bidconfidentiality_canopenbid": "canOpenBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L83 | neighbors=[ApprovalTab.tsx, ConfidentialLock.tsx, useOpenBid.ts, BidDetailPage.tsx, bidConfidentiality.ts, getConfidentialAllowedPeople()]
- "utils_constants_priority_colors": "PRIORITY_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L8 | neighbors=[OverviewTab.tsx, PriorityBadge.tsx, useStatusColors.ts, BidDetailPage.tsx, CreateRequestPage.tsx, UnassignedRequestsPage.tsx]
- "utils_costcalculations_ibidfx": "IBidFx" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L653 | neighbors=[BidFxNote.tsx, BidHoursTable.tsx, CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx, PreparationMobilizationTab.tsx, currencyTable.ts]
- "utils_costcalculations_isrentalacq": "isRentalAcq()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L105 | neighbors=[AssetsBreakdownTab.tsx, rows.ts, costCalculations.ts, getAssetCostBreakdown(), getEffectiveCategory(), getSplitNode()]
- "utils_pastbiddocument_buildpastbiddocument": "buildPastBidDocument()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L982 | neighbors=[PastBidKnowledgeService.ts, pastBidDocument.ts, buildPastBidAiDigest(), clean(), day(), getPastBidYear()]
- "utils_pastbiddocument_day": "day()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L78 | neighbors=[clarificationLibraryDocument.ts, pastBidDocument.ts, buildPastBidDocument(), buildPastBidMetadata(), identification(), outcome()]
- "utils_surveybidintel": "surveyBidIntel.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidIntel.ts:L1 | neighbors=[ddf6c96 Merge branch 'feat/survey-knowl…, f06225e feat(survey): Survey Knowledge …, useSurveyPortal.ts, index.ts, computeSurveyBidIntel(), median()]
- "utils_surveybidmatch": "surveyBidMatch.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidMatch.ts:L1 | neighbors=[512f7b1 feat(survey): full-bleed 3D sea…, ddf6c96 Merge branch 'feat/survey-knowl…, useSurveyPortal.ts, index.ts, isDistinctive(), matchBidEquipment()]
- "bid_bidtabheader_headerchip": "HeaderChip()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L300 | neighbors=[AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidFxNote.tsx, BidTabHeader.tsx, CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx]
- "bid_bidtemplateimport": "BidTemplateImport.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTemplateImport.tsx:L1 | neighbors=[BidTemplateImport(), BidTemplateImportProps, IBidTemplate.ts, IBidTemplate, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0]
- "bid_revisionstab_getcurrentrevisionletter": "getCurrentRevisionLetter()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L46 | neighbors=[BidExportTab.tsx, OverviewTab.tsx, RevisionsTab.tsx, RevisionsTab(), index.ts, BidDetailPage.tsx]
- "bidexcelexport_excelstyles_pickrow": "pickRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L185 | neighbors=[excelStyles.ts, assetsSheet.ts, currencyTable.ts, hoursSheet.ts, scopeSheet.ts, suppliersSheet.ts]
- "bidexcelexport_excelstyles_toexceldate": "toExcelDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L91 | neighbors=[excelStyles.ts, displayDate(), assetsSheet.ts, costSummarySheet.ts, infoSheet.ts, suppliersSheet.ts]
- "bidexcelexport_excelstyles_xlsheet_band": ".band()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L584 | neighbors=[XlSheet, solid(), thin(), tint(), .fillRange(), .font()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-014.json

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
