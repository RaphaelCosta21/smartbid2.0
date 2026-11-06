# Node Description Batch 4 of 102

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

- "pricehistory_bidrankingtab": "BidRankingTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/pricehistory/BidRankingTab.tsx:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, PriceHistoryPage.tsx, ParetoChart.tsx, ParetoChart(), BidSelect.tsx]
- "survey_surveypackagedrawer": "SurveyPackageDrawer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPackageDrawer.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 4fd375f feat(survey): free 3D compositi…, 50a29c7 feat(survey): Full Survey Sprea…, 512f7b1 feat(survey): full-bleed 3D sea…, 583d03e Refactor string concatenation i…, 7342177 Merge feat/survey-surface-spare…]
- "template_templateeditor": "TemplateEditor.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateEditor.tsx:L1 | neighbors=[165493f NEW-MODIFIC, 1665b01 more features, 2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 3c5c37b more-mods, 4c2e63a update smartbid 2.0]
- "services_spservice": "SPService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SPService.ts:L1 | neighbors=[AddQuotationModal.tsx, 0e653cd more mods, 4b576db AI-Integration, 4c2e63a update smartbid 2.0, 79354cb Merge remote-tracking branch 'o…, 7d9108e createrequestpage correction]
- "survey_surveyportalheader": "SurveyPortalHeader.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPortalHeader.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 4fd375f feat(survey): free 3D compositi…, 512f7b1 feat(survey): full-bleed 3D sea…, 583d03e Refactor string concatenation i…, 67bbf62 feat(survey): apply Figma look …, 7342177 Merge feat/survey-surface-spare…]
- "bid_erncreatemodal": "ErnCreateModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnCreateModal.tsx:L1 | neighbors=[ErnCreateModal(), ErnCreateModalProps, personToPicked(), toInputDate(), PeoplePicker.tsx, IPickedPerson]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@3c5c37ba0522eeb4e09fd69ebad830cebb4a5d9f": "3c5c37b more-mods" | kind=Commit | source=git | neighbors=[165493f NEW-MODIFIC, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, CertificationsBreakdownTab.tsx, CostSearchModal.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@8e87d9402fc8756f48036ab14508de0546bd916a": "8e87d94 feat: Add Links and Recommendations page with CRUD functionality" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, BidStatusPhasePanel.tsx, ImportClarificationModal.tsx, QualificationsTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@b6d954d3fb2bcd28a6d0d42e32c5105e73f92798": "b6d954d feat: Enhance AIAnalysisService to include section data and handle zero…" | kind=Commit | source=git | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, EngineeringHoursSection.tsx, EquipmentImportModal.tsx]
- "common_pageheader_pageheader": "PageHeader()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PageHeader.tsx:L11 | neighbors=[PageHeader.tsx, DocLibraryCatalog.tsx, AnalyticsPage.tsx, ApprovalsPage.tsx, AssetsCatalogPage.tsx, BidBoardPage.tsx]
- "dashboard_erndashboardsection": "ErnDashboardSection.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnDashboardSection.tsx:L1 | neighbors=[583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, 892c1fc feat: add PeoplePicker componen…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, ChartTooltip.tsx]
- "services_bidservice": "BidService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L1 | neighbors=[2b1ed14 feat: add useApprovalSync hook …, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, 7d9108e createrequestpage correction, 8152d02 feat: implement split approval …]
- "services_bidservice_bidservice": "BidService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L26 | neighbors=[useApprovalSync.ts, useClarificationLibrarySync.ts, useDashboardSync.ts, AppLayout.tsx, BidDetailPage.tsx, BidTrackerPage.tsx]
- "bid_confidentiallock": "ConfidentialLock.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ConfidentialLock.tsx:L1 | neighbors=[BidCard.tsx, ConfidentialLock(), ConfidentialLockProps, useCurrentUser.ts, useCurrentUser(), index.ts]
- "favorites_addfavoriteequipmentmodal": "AddFavoriteEquipmentModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 79354cb Merge remote-tracking branch 'o…, ea5c8e6 Refactor UI components for cons…, EquipmentImportModal.tsx, EquipmentImportModal(), IImportPick]
- "services_spservice_spservice": "SPService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SPService.ts:L15 | neighbors=[AddQuotationModal.tsx, BomCostsPage.tsx, QuotationsPage.tsx, AccessLogService.ts, ActivityLogService.ts, AiAuthService.ts]
- "stores_usebidstore_usebidstore": "useBidStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L98 | neighbors=[BidConfidentialButton.tsx, BidExportTab.tsx, ConfidentialLock.tsx, DocumentsTab.tsx, ScopeOfSupplyTab.tsx, ChatAssistant.tsx]
- "utils_bomexcelexport": "bomExcelExport.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomExcelExport.ts:L1 | neighbors=[4b5d467 feat: add BomQuotationPicker co…, 93ca809 refactor: improve code formatti…, BomCostsPage.tsx, excelStyles.ts, activeColumns(), colOf()]
- "utils_quotationlinks": "quotationLinks.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L1 | neighbors=[AssetsBreakdownTab.tsx, LinkedQuotationsPanel.tsx, QuotationControlPanel.tsx, QuotationStatusChip.tsx, BomQuotationPicker.tsx, SupplierQuoteBars.tsx]
- "bid_costsearchmodal": "CostSearchModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CostSearchModal.tsx:L1 | neighbors=[AssetsBreakdownTab.tsx, AddQuotationModal.tsx, AddQuotationModal(), CostSearchImportItem, CostSearchModal(), CostSearchModalProps]
- "bid_preparationmobilizationtab": "PreparationMobilizationTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L1 | neighbors=[BidFxNote.tsx, BidFxNote(), UsdAmountCell(), BidTabHeader.tsx, BidTabHeader(), HeaderChip()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@892c1fc3f5724f61043e10959011b9d07c91842f": "892c1fc feat: add PeoplePicker component for AAD user selection" | kind=Commit | source=git | neighbors=[0546310 Add dashboard components and st…, BidCard.tsx, ErnCreateModal.tsx, ErnDetailsModal.tsx, ErnSearchModal.tsx, OverviewTab.tsx]
- "config_surveydataformats": "surveyDataFormats.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyDataFormats.ts:L1 | neighbors=[3d59093 Merge feat/survey-data-journey …, 568e582 Merge feat/survey-journey-accur…, 61c46c8 fix(survey): offshore Brazil GG…, 90a8e89 fix(survey): correct data journ…, acf62bf refactor(survey): data journey …, be5fb82 feat(survey): data journey from…]
- "reports_approvaldueimpactsection": "ApprovalDueImpactSection.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ApprovalDueImpactSection.tsx:L1 | neighbors=[75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, OperationalSummaryPage.tsx, ConfidentialLock.tsx]
- "services_aianalysisservice_aianalysisservice": "AIAnalysisService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L75 | neighbors=[AddQuotationModal.tsx, QualificationsTab.tsx, AIDocumentAnalyzer.tsx, DocLibraryCatalog.tsx, AIAnalysisService.ts, .analyzeDocument()]
- "bid_certificationsbreakdowntab": "CertificationsBreakdownTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CertificationsBreakdownTab.tsx:L1 | neighbors=[BidFxNote.tsx, BidFxNote(), UsdAmountCell(), BidTabHeader.tsx, BidTabHeader(), HeaderChip()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@0546310f05223277e0960f6d542baf27930ac3b7": "0546310 Add dashboard components and styles for activity and engineering hours …" | kind=Commit | source=git | neighbors=[ApprovalBadge.tsx, ApprovalMatrix.tsx, ApprovalTab.tsx, AssetsBreakdownTab.tsx, BidApprovalPanel.tsx, BidCard.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@77f55d41660cf7ff7f04f400e266c695d459ecd7": "77f55d4 feat: Add Clarification Entry Modal and related hooks for library manag…" | kind=Commit | source=git | neighbors=[2d4ecdb style: improve code formatting …, BidStatusPhasePanel.tsx, ExportClarificationModal.tsx, ImportClarificationModal.tsx, QualificationsTab.tsx, excelStyles.ts]
- "config_accesscontrol_config": "accessControl.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 79354cb Merge remote-tracking branch 'o…, ea5c8e6 Refactor UI components for cons…, ACCESS_AREA_KEYS, ACCESS_AREAS, ACCESS_PERMISSIONS]
- "dashboard_enghoursoutlook": "EngHoursOutlook.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursOutlook.tsx:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, bda0c32 style: Improve code formatting …, ChartTooltip.tsx, ChartTooltip(), EmptyState.tsx]
- "dashboard_enghoursranking": "EngHoursRanking.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursRanking.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, EngHoursOutlook.tsx]
- "dashboard_ernwatchlist": "ErnWatchlist.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnWatchlist.tsx:L1 | neighbors=[75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, aaa091c Add hooks for KPI targets and l…, bd70cf6 style: improve code formatting …, ErnDashboardSection.tsx, ConfidentialLock.tsx]
- "hooks_usecurrentuser_usecurrentuser": "useCurrentUser()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useCurrentUser.ts:L8 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidCard.tsx, BidConfidentialButton.tsx, BidFavoriteButton.tsx, BidStatusPhasePanel.tsx]
- "models_isurveycatalog": "ISurveyCatalog.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L1 | neighbors=[2a932fc feat(survey): failure cascade, …, 4fd375f feat(survey): free 3D compositi…, 50a29c7 feat(survey): Full Survey Sprea…, 5d664ea Merge feat/survey-knowledge-por…, 6062346 feat(survey): failure cascade, …, 7342177 Merge feat/survey-surface-spare…]
- "pages_flowboardpage": "FlowBoardPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FlowBoardPage.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…]
- "utils_bidcomparator": "bidComparator.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, ComparisonExecutive.tsx, ComparisonSummary.tsx, ComparisonTables.tsx, BidComparatorPage.tsx]
- "utils_formatters_formatcurrency": "formatCurrency()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L7 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidEquipmentTable.tsx, BidExportTab.tsx, BidFxNote.tsx]
- "branch:repo:github.com/RaphaelCosta21/smartbid2.0#feat/easi-modules-pages": "feat/easi-modules-pages" | kind=Branch | source=git | neighbors=[0546310 Add dashboard components and st…, 0e653cd more mods, 1111add Add initial configuration files…, 165493f NEW-MODIFIC, 1665b01 more features, 1a40896 feat: add SmartBid 2.0 Executiv…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@5c35e8d135ee047fc377c5047fb9d2415cd3e4b6": "5c35e8d feat: Implement Qualification Library Filter and Database Service" | kind=Commit | source=git | neighbors=[ImportQualificationModal.tsx, QualificationGroupList.tsx, QualificationsTab.tsx, QualificationSuggestionsModal.tsx, ScopeOfSupplyTab.tsx, backup/survey-merge-20261018-113028-jou…]
- "common_kpicard": "KPICard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/KPICard.tsx:L1 | neighbors=[BidActivityLog.tsx, QuotationControlPanel.tsx, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-003.json

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
