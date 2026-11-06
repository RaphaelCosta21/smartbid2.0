# Node Description Batch 5 of 102

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

- "insights_multiselectdropdown": "MultiSelectDropdown.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/MultiSelectDropdown.tsx:L1 | neighbors=[ImportClarificationModal.tsx, ImportQualificationModal.tsx, BomQuotationPicker.tsx, 02c1391 feat: Add supplier management f…, 79354cb Merge remote-tracking branch 'o…, 8267c28 i18n: translate EASI, suppliers…]
- "utils_clarificationlibrarydocument": "clarificationLibraryDocument.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationLibraryDocument.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 5c35e8d feat: Implement Qualification L…, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, ClarificationKnowledgeService.ts, IClarificationDb.ts]
- "utils_pastbidhelpers": "pastBidHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L1 | neighbors=[ExportClarificationModal.tsx, 00efd39 Refactor Excel export sheets fo…, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, bec8260 feat: Enhance bid management wi…, useClarificationLibraryFilter.ts]
- "bid_linkedquotationspanel": "LinkedQuotationsPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/LinkedQuotationsPanel.tsx:L1 | neighbors=[AssetsBreakdownTab.tsx, IQuotationRequestInput, LinkedQuotationsPanel(), LinkedQuotationsPanelProps, QuotationLinkPatch, QuotationRespondBanner()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@165493fb8d1055a2ff598eee19844e74d28e0347": "165493f NEW-MODIFIC" | kind=Commit | source=git | neighbors=[EquipmentImportModal.tsx, ScopeOfSupplyTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal]
- "hooks_useclarificationlibraryfilter": "useClarificationLibraryFilter.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useClarificationLibraryFilter.ts:L1 | neighbors=[ImportClarificationModal.tsx, 1d028a0 style: Improve code formatting …, 75476a5 feat: add confidentiality manag…, 77f55d4 feat: Add Clarification Entry M…, 79354cb Merge remote-tracking branch 'o…, ALL_KEYS]
- "hooks_useopenbid": "useOpenBid.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useOpenBid.ts:L1 | neighbors=[75476a5 feat: add confidentiality manag…, ChatAssistant.tsx, IOpenBidApi, useOpenBid(), index.ts, useAuthStore.ts]
- "hooks_usestatuscolors": "useStatusColors.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useStatusColors.ts:L1 | neighbors=[BidCard.tsx, 0e653cd more mods, 5577aab feat: Add Technical Proposal fu…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, 9759c3b Refactor DivisionBadge and Memb…]
- "pricehistory_itemhistorytab": "ItemHistoryTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/pricehistory/ItemHistoryTab.tsx:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, PriceHistoryPage.tsx, BidSelect.tsx, BidSelect(), buildBidOptions()]
- "services_requestservice": "RequestService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 3c5c37b more-mods, 4c2e63a update smartbid 2.0, 54fea3b feat: Enhance Part Number Autoc…, 5577aab feat: Add Technical Proposal fu…]
- "utils_idgenerator": "idGenerator.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/idGenerator.ts:L1 | neighbors=[AssetsBreakdownTab.tsx, BidHoursTable.tsx, CertificationsBreakdownTab.tsx, DocumentsTab.tsx, EngineeringHoursSection.tsx, ImportClarificationModal.tsx]
- "bid_bidcard": "BidCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidCard.tsx:L1 | neighbors=[BidCard(), BidCardProps, ConfidentialLock.tsx, ConfidentialLock(), StatusBadge.tsx, StatusBadge()]
- "bid_exportclarificationmodal": "ExportClarificationModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ExportClarificationModal.tsx:L1 | neighbors=[ExportClarificationModal(), ExportClarificationModalProps, TypeFilter, useCurrentUser.ts, useCurrentUser(), SegmentedControl.tsx]
- "bid_importclarificationmodal": "ImportClarificationModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ImportClarificationModal.tsx:L1 | neighbors=[ImportClarificationModal(), ImportClarificationModalProps, toClarificationItem(), DivisionBadge.tsx, DivisionBadge(), EmptyState.tsx]
- "bid_logisticsbreakdowntab": "LogisticsBreakdownTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/LogisticsBreakdownTab.tsx:L1 | neighbors=[BidFxNote.tsx, BidFxNote(), UsdAmountCell(), BidTabHeader.tsx, BidTabHeader(), HeaderChip()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@00efd3935565c2ac94ccb54e4d73ff8c6435a89f": "00efd39 Refactor Excel export sheets for improved readability and consistency" | kind=Commit | source=git | neighbors=[BidExportTab.tsx, context.ts, excelStyles.ts, index.ts, rows.ts, backup/survey-merge-20261018-113028-jou…]
- "stores_usequerycatalogstore": "useQueryCatalogStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L1 | neighbors=[CostSearchModal.tsx, EquipmentImportModal.tsx, 3c5c37b more-mods, 79354cb Merge remote-tracking branch 'o…, 9cc3475 feat: Integrate Financials Acti…, b6d954d feat: Enhance AIAnalysisService…]
- "utils_idgenerator_makeid": "makeId()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/idGenerator.ts:L5 | neighbors=[AssetsBreakdownTab.tsx, BidHoursTable.tsx, CertificationsBreakdownTab.tsx, DocumentsTab.tsx, EngineeringHoursSection.tsx, ImportClarificationModal.tsx]
- "utils_pricehistory": "priceHistory.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/priceHistory.ts:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, BidRankingTab.tsx, HistoryItemCard.tsx, ItemHistoryTab.tsx, LaborTab.tsx]
- "bid_quotationcontrolpanel": "QuotationControlPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QuotationControlPanel.tsx:L1 | neighbors=[AssetsBreakdownTab.tsx, FILTER_LABELS, IControlRow, needsQuotation(), QuotationControlPanel(), QuotationControlPanelProps]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@de36cf557398ab15a11ece0b82622bb9f4f93937": "de36cf5 feat: add SmartBid Docs indexer and skillset for AI search integration" | kind=Commit | source=git | neighbors=[961eb93 feat: Update AI integration and…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main]
- "comparator_comparisontables": "ComparisonTables.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonTables.tsx:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, DataTable.tsx, DataTable(), EmptyState.tsx, EmptyState()]
- "knowledge_qualificationentrydrawer": "QualificationEntryDrawer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationEntryDrawer.tsx:L1 | neighbors=[5c35e8d feat: Implement Qualification L…, aa081f9 refactor: Improve code formatti…, ConfidentialLock.tsx, ConfidentialLock(), DivisionBadge.tsx, DivisionBadge()]
- "pages_mydashboardpage": "MyDashboardPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/MyDashboardPage.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…]
- "stores_usesupplierstore": "useSupplierStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSupplierStore.ts:L1 | neighbors=[AddQuotationModal.tsx, 02c1391 feat: Add supplier management f…, 414e1a6 style: Improve code formatting …, 79354cb Merge remote-tracking branch 'o…, SupplierCombobox.tsx, useRegisterQuotationSuppliers.ts]
- "utils_clarificationexcelexport": "clarificationExcelExport.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationExcelExport.ts:L1 | neighbors=[ExportClarificationModal.tsx, 75476a5 feat: add confidentiality manag…, 77f55d4 feat: Add Clarification Entry M…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, RevisionsTab.tsx]
- "utils_costsummaryview": "costSummaryView.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costSummaryView.ts:L1 | neighbors=[BidCostSummary.tsx, BidExportTab.tsx, context.ts, index.ts, 00efd39 Refactor Excel export sheets fo…, 54fea3b feat: Enhance Part Number Autoc…]
- "utils_pastbidledger": "pastBidLedger.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, useChatStore.ts, IAiChat.ts]
- "utils_reporthelpers": "reportHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L1 | neighbors=[583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, c271ce8 Refactor code structure for imp…, EngHoursOutlook.tsx, useResultStatus.ts, PeriodPerformancePage.tsx]
- "utils_statushelpers": "statusHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L1 | neighbors=[ApprovalTab.tsx, BidFavoriteButton.tsx, BidTimeline.tsx, OverviewTab.tsx, RevisionsTab.tsx, 0e653cd more mods]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@f06225e075f835ec895a8906bc0d320554f2b4e3": "f06225e feat(survey): Survey Knowledge & BID Portal - equipment explorer, 3D sy…" | kind=Commit | source=git | neighbors=[3f57ca9 merge: integrate EASI module pa…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main]
- "common_statusbadge": "StatusBadge.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/StatusBadge.tsx:L1 | neighbors=[BidActivityLog.tsx, BidCard.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, DocumentsTab.tsx, OverviewTab.tsx]
- "config_sharepoint_config": "sharepoint.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sharepoint.config.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 0e653cd more mods, 14b96c8 feat: implement approval round …, 165493f NEW-MODIFIC, 1a40896 feat: add SmartBid 2.0 Executiv…, 2b1ed14 feat: add useApprovalSync hook …]
- "hooks_usequalificationlibraryfilter": "useQualificationLibraryFilter.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQualificationLibraryFilter.ts:L1 | neighbors=[ImportQualificationModal.tsx, 5c35e8d feat: Implement Qualification L…, aa081f9 refactor: Improve code formatti…, useClarificationLibraryFilter.ts, ALL_KEYS, EMPTY_FILTERS]
- "hooks_usequerysearch": "useQuerySearch.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L1 | neighbors=[165493f NEW-MODIFIC, 1665b01 more features, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, e2285cf cont-implementing, f03d3f6 feat: Enhance ImportSourceModal…]
- "models_ibidrequest": "IBidRequest.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidRequest.ts:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 54fea3b feat: Enhance Part Number Autoc…, 5577aab feat: Add Technical Proposal fu…, 79354cb Merge remote-tracking branch 'o…]
- "services_supplierservice": "SupplierService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 3f57ca9 merge: integrate EASI module pa…, 414e1a6 style: Improve code formatting …, 6d20432 feat: adiciona paginas EASI ao …, 79354cb Merge remote-tracking branch 'o…, 8267c28 i18n: translate EASI, suppliers…]
- "services_technicalproposalknowledgeservice": "TechnicalProposalKnowledgeService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L1 | neighbors=[5577aab feat: Add Technical Proposal fu…, 79354cb Merge remote-tracking branch 'o…, useTechnicalProposalPublisher.ts, IAIAnalysis.ts, IExtractedDocumentMetadata, IDocLibraryItem.ts]
- "settings_notificationmatrix": "NotificationMatrix.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L1 | neighbors=[14b96c8 feat: implement approval round …, 437d8e1 feat: implement notification lo…, dbc974b Refactor email template HTML fo…, e05a523 feat: Enhance notification card…, e61a9d3 feat: add notification system f…, index.ts]
- "bid_bidtabheader": "BidTabHeader.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L1 | neighbors=[AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidFxNote.tsx, BidHoursTable.tsx, BidTabHeader(), BidTabHeaderProps]

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
