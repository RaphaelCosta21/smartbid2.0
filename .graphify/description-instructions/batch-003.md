# Node Description Batch 4 of 86

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

- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@8e87d9402fc8756f48036ab14508de0546bd916a": "8e87d94 feat: Add Links and Recommendations page with CRUD functionality" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, BidStatusPhasePanel.tsx, ImportClarificationModal.tsx, QualificationsTab.tsx, feat/easi-modules-pages, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@b6d954d3fb2bcd28a6d0d42e32c5105e73f92798": "b6d954d feat: Enhance AIAnalysisService to include section data and handle zero…" | kind=Commit | source=git | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, EngineeringHoursSection.tsx, EquipmentImportModal.tsx]
- "config_accesscontrol_config": "accessControl.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, ea5c8e6 Refactor UI components for cons…, ACCESS_AREA_KEYS, ACCESS_AREAS, ACCESS_PERMISSIONS, ACCESS_ROLES]
- "dashboard_enghoursoutlook": "EngHoursOutlook.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursOutlook.tsx:L1 | neighbors=[953278b feat: add ApprovalDueImpactSect…, bda0c32 style: Improve code formatting …, ChartTooltip.tsx, ChartTooltip(), EmptyState.tsx, EmptyState()]
- "dashboard_enghoursranking": "EngHoursRanking.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursRanking.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 953278b feat: add ApprovalDueImpactSect…, EngHoursOutlook.tsx, ConfidentialLock.tsx]
- "dashboard_ernwatchlist": "ErnWatchlist.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnWatchlist.tsx:L1 | neighbors=[75476a5 feat: add confidentiality manag…, aaa091c Add hooks for KPI targets and l…, bd70cf6 style: improve code formatting …, ErnDashboardSection.tsx, ConfidentialLock.tsx, ConfidentialLock()]
- "pages_flowboardpage": "FlowBoardPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FlowBoardPage.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…]
- "survey_surveypackagedrawer": "SurveyPackageDrawer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPackageDrawer.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 50a29c7 feat(survey): Full Survey Sprea…, 512f7b1 feat(survey): full-bleed 3D sea…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, ddf6c96 Merge branch 'feat/survey-knowl…]
- "bid_erncreatemodal": "ErnCreateModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnCreateModal.tsx:L1 | neighbors=[ErnCreateModal(), ErnCreateModalProps, personToPicked(), toInputDate(), PeoplePicker.tsx, IPickedPerson]
- "services_bidservice": "BidService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L1 | neighbors=[2b1ed14 feat: add useApprovalSync hook …, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, 7d9108e createrequestpage correction, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…]
- "utils_clarificationlibrarydocument": "clarificationLibraryDocument.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationLibraryDocument.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 5c35e8d feat: Implement Qualification L…, 75476a5 feat: add confidentiality manag…, ClarificationKnowledgeService.ts, IClarificationDb.ts, ClarificationBaseType]
- "utils_pastbidhelpers": "pastBidHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L1 | neighbors=[ExportClarificationModal.tsx, 00efd39 Refactor Excel export sheets fo…, bc10d67 feat: add pastBidHelpers and pa…, bec8260 feat: Enhance bid management wi…, useClarificationLibraryFilter.ts, useQualificationLibraryFilter.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@5c35e8d135ee047fc377c5047fb9d2415cd3e4b6": "5c35e8d feat: Implement Qualification Library Filter and Database Service" | kind=Commit | source=git | neighbors=[ImportQualificationModal.tsx, QualificationGroupList.tsx, QualificationsTab.tsx, QualificationSuggestionsModal.tsx, ScopeOfSupplyTab.tsx, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@77f55d41660cf7ff7f04f400e266c695d459ecd7": "77f55d4 feat: Add Clarification Entry Modal and related hooks for library manag…" | kind=Commit | source=git | neighbors=[2d4ecdb style: improve code formatting …, BidStatusPhasePanel.tsx, ExportClarificationModal.tsx, ImportClarificationModal.tsx, QualificationsTab.tsx, excelStyles.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@892c1fc3f5724f61043e10959011b9d07c91842f": "892c1fc feat: add PeoplePicker component for AAD user selection" | kind=Commit | source=git | neighbors=[0546310 Add dashboard components and st…, BidCard.tsx, ErnCreateModal.tsx, ErnDetailsModal.tsx, ErnSearchModal.tsx, OverviewTab.tsx]
- "hooks_useclarificationlibraryfilter": "useClarificationLibraryFilter.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useClarificationLibraryFilter.ts:L1 | neighbors=[ImportClarificationModal.tsx, 1d028a0 style: Improve code formatting …, 75476a5 feat: add confidentiality manag…, 77f55d4 feat: Add Clarification Entry M…, ALL_KEYS, EMPTY_FILTERS]
- "hooks_usestatuscolors": "useStatusColors.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useStatusColors.ts:L1 | neighbors=[BidCard.tsx, 0e653cd more mods, 5577aab feat: Add Technical Proposal fu…, 953278b feat: add ApprovalDueImpactSect…, 9759c3b Refactor DivisionBadge and Memb…, c4e04de lots-implementation]
- "pages_surveyequipmentpage": "SurveyEquipmentPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SurveyEquipmentPage.tsx:L1 | neighbors=[512f7b1 feat(survey): full-bleed 3D sea…, 67bbf62 feat(survey): apply Figma look …, ddf6c96 Merge branch 'feat/survey-knowl…, e2388c0 feat(survey): allow Knowledge e…, f06225e feat(survey): Survey Knowledge …, fbe2c0e feat(survey): remove division/s…]
- "utils_idgenerator": "idGenerator.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/idGenerator.ts:L1 | neighbors=[AssetsBreakdownTab.tsx, BidHoursTable.tsx, CertificationsBreakdownTab.tsx, DocumentsTab.tsx, EngineeringHoursSection.tsx, ImportClarificationModal.tsx]
- "bid_bidcard": "BidCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidCard.tsx:L1 | neighbors=[BidCard(), BidCardProps, ConfidentialLock.tsx, ConfidentialLock(), StatusBadge.tsx, StatusBadge()]
- "bid_exportclarificationmodal": "ExportClarificationModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ExportClarificationModal.tsx:L1 | neighbors=[ExportClarificationModal(), ExportClarificationModalProps, TypeFilter, useCurrentUser.ts, useCurrentUser(), SegmentedControl.tsx]
- "bid_importclarificationmodal": "ImportClarificationModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ImportClarificationModal.tsx:L1 | neighbors=[ImportClarificationModal(), ImportClarificationModalProps, toClarificationItem(), DivisionBadge.tsx, DivisionBadge(), EmptyState.tsx]
- "bid_logisticsbreakdowntab": "LogisticsBreakdownTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/LogisticsBreakdownTab.tsx:L1 | neighbors=[BidFxNote.tsx, BidFxNote(), UsdAmountCell(), BidTabHeader.tsx, BidTabHeader(), HeaderChip()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@0546310f05223277e0960f6d542baf27930ac3b7": "0546310 Add dashboard components and styles for activity and engineering hours …" | kind=Commit | source=git | neighbors=[ApprovalBadge.tsx, ApprovalMatrix.tsx, ApprovalTab.tsx, AssetsBreakdownTab.tsx, BidApprovalPanel.tsx, BidCard.tsx]
- "hooks_useopenbid": "useOpenBid.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useOpenBid.ts:L1 | neighbors=[75476a5 feat: add confidentiality manag…, ChatAssistant.tsx, IOpenBidApi, useOpenBid(), index.ts, useAuthStore.ts]
- "insights_multiselectdropdown": "MultiSelectDropdown.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/MultiSelectDropdown.tsx:L1 | neighbors=[ImportClarificationModal.tsx, ImportQualificationModal.tsx, 02c1391 feat: Add supplier management f…, 8267c28 i18n: translate EASI, suppliers…, 953278b feat: add ApprovalDueImpactSect…, adc0d38 Refactor TemplatesPage: Enhance…]
- "knowledge_qualificationentrydrawer": "QualificationEntryDrawer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationEntryDrawer.tsx:L1 | neighbors=[5c35e8d feat: Implement Qualification L…, aa081f9 refactor: Improve code formatti…, ConfidentialLock.tsx, ConfidentialLock(), DivisionBadge.tsx, DivisionBadge()]
- "services_requestservice": "RequestService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 3c5c37b more-mods, 4c2e63a update smartbid 2.0, 54fea3b feat: Enhance Part Number Autoc…, 5577aab feat: Add Technical Proposal fu…]
- "stores_usequerycatalogstore": "useQueryCatalogStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L1 | neighbors=[CostSearchModal.tsx, EquipmentImportModal.tsx, 3c5c37b more-mods, 9cc3475 feat: Integrate Financials Acti…, b6d954d feat: Enhance AIAnalysisService…, bc10d67 feat: add pastBidHelpers and pa…]
- "utils_idgenerator_makeid": "makeId()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/idGenerator.ts:L5 | neighbors=[AssetsBreakdownTab.tsx, BidHoursTable.tsx, CertificationsBreakdownTab.tsx, DocumentsTab.tsx, EngineeringHoursSection.tsx, ImportClarificationModal.tsx]
- "hooks_usequalificationlibraryfilter": "useQualificationLibraryFilter.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQualificationLibraryFilter.ts:L1 | neighbors=[ImportQualificationModal.tsx, 5c35e8d feat: Implement Qualification L…, aa081f9 refactor: Improve code formatti…, useClarificationLibraryFilter.ts, ALL_KEYS, EMPTY_FILTERS]
- "pages_mydashboardpage": "MyDashboardPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/MyDashboardPage.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, bec8260 feat: Enhance bid management wi…]
- "stores_usesupplierstore": "useSupplierStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSupplierStore.ts:L1 | neighbors=[AddQuotationModal.tsx, 02c1391 feat: Add supplier management f…, 414e1a6 style: Improve code formatting …, SupplierCombobox.tsx, useRegisterQuotationSuppliers.ts, QuotationsPage.tsx]
- "utils_clarificationexcelexport": "clarificationExcelExport.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationExcelExport.ts:L1 | neighbors=[ExportClarificationModal.tsx, 75476a5 feat: add confidentiality manag…, 77f55d4 feat: Add Clarification Entry M…, 953278b feat: add ApprovalDueImpactSect…, RevisionsTab.tsx, getCurrentRevisionLetter()]
- "utils_pastbidledger": "pastBidLedger.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, 583d03e Refactor string concatenation i…, bc10d67 feat: add pastBidHelpers and pa…, useChatStore.ts, IAiChat.ts, IPastBidChatContext]
- "utils_reporthelpers": "reportHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L1 | neighbors=[583d03e Refactor string concatenation i…, c271ce8 Refactor code structure for imp…, EngHoursOutlook.tsx, useResultStatus.ts, PeriodPerformancePage.tsx, engHoursHelpers.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@00efd3935565c2ac94ccb54e4d73ff8c6435a89f": "00efd39 Refactor Excel export sheets for improved readability and consistency" | kind=Commit | source=git | neighbors=[BidExportTab.tsx, context.ts, excelStyles.ts, index.ts, rows.ts, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@165493fb8d1055a2ff598eee19844e74d28e0347": "165493f NEW-MODIFIC" | kind=Commit | source=git | neighbors=[EquipmentImportModal.tsx, ScopeOfSupplyTab.tsx, feat/easi-modules-pages, main, 3c5c37b more-mods, PartNumberAutocomplete.tsx]
- "common_kpicard": "KPICard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/KPICard.tsx:L1 | neighbors=[BidActivityLog.tsx, 583d03e Refactor string concatenation i…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, c271ce8 Refactor code structure for imp…, fe3728a smartbid2.0]
- "common_statusbadge": "StatusBadge.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/StatusBadge.tsx:L1 | neighbors=[BidActivityLog.tsx, BidCard.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, DocumentsTab.tsx, OverviewTab.tsx]

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
