# Node Description Batch 29 of 102

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

- "pages_memberspage": "MembersPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/MembersPage.tsx:L1 | neighbors=[fe3728a smartbid2.0, AppLayout.tsx, MembersPage(), MembersManagement.tsx]
- "pages_queryconsultingpage_matchtokens": "matchTokens()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L215 | neighbors=[QueryConsultingPage.tsx, filterViewRows(), applyAllFilters(), applyMultipleFilters()]
- "pages_systemconfigpage": "SystemConfigPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SystemConfigPage.tsx:L1 | neighbors=[fe3728a smartbid2.0, AppLayout.tsx, SystemConfigPage(), SystemConfiguration.tsx]
- "pricehistory_historyitemcard_historyitemcard": "HistoryItemCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/pricehistory/HistoryItemCard.tsx:L134 | neighbors=[HistoryItemCard.tsx, divergenceToken(), usd(), ItemHistoryTab.tsx]
- "reports_exportoptions": "ExportOptions.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ExportOptions.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ExportOptions(), ExportOptionsProps]
- "services_aianalysisservice_aianalysisservice_chat": ".chat()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L598 | neighbors=[AIAnalysisService, .ensureConfigured(), .parseChatAnswer(), .postJson()]
- "services_aianalysisservice_aianalysisservice_suggestpastbidprofile": ".suggestPastBidProfile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L914 | neighbors=[AIAnalysisService, .buildRequest(), .ensureConfigured(), .postJson()]
- "services_aianalysisservice_aianalysisservice_suggestsupplierprofile": ".suggestSupplierProfile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L986 | neighbors=[AIAnalysisService, .buildRequest(), .ensureConfigured(), .postJson()]
- "services_aianalysisservice_aianalysisservice_validateresponse": ".validateResponse()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L101 | neighbors=[AIAnalysisService, .analyzeDocument(), .analyzeDocumentForTemplate(), .parseClarifications()]
- "services_aiauthservice_aiauthservice_pickaccount": ".pickAccount()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L197 | neighbors=[AiAuthService, .getAccessToken(), .getLoginHint(), .warmUp()]
- "services_aiauthservice_aiauthservice_probescope": ".probeScope()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L348 | neighbors=[AiAuthService, .getApp(), .getLoginHint(), .log()]
- "services_approvalservice_approvalservice_ensureapprovalcolumns": ".ensureApprovalColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L37 | neighbors=[ApprovalService, .markRoundOverridden(), .markRoundsCancelled(), .startApprovalRound()]
- "services_bidservice_bidservice_create": ".create()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L133 | neighbors=[BidService, .ensureColumns(), ._searchColumns(), prepareForSave()]
- "services_bidservice_bidservice_ensurecolumns": ".ensureColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L43 | neighbors=[BidService, .create(), ._provisionColumns(), .update()]
- "services_bidservice_bidservice_updateaftercreate": ".updateAfterCreate()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L159 | neighbors=[BidService, .getById(), ._searchColumns(), .update()]
- "services_bidservice_prepareforsave": "prepareForSave()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L15 | neighbors=[BidService.ts, .create(), .patchByBidNumber(), .update()]
- "services_clarificationdbservice_clarificationdbservice_ensurecolumns": ".ensureColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L43 | neighbors=[ClarificationDbService, ._columns(), ._provisionColumns(), .syncFromBid()]
- "services_clarificationdbservice_clarificationdbservice_syncfrombid": ".syncFromBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L213 | neighbors=[ClarificationDbService, .ensureColumns(), ._mapToSP(), .update()]
- "services_clarificationdbservice_clarificationdbservice_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L193 | neighbors=[ClarificationDbService, .syncFromBid(), ._columns(), ._mapToSP()]
- "services_currencyservice_currencyservice_getcurrencyrate": ".getCurrencyRate()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L98 | neighbors=[CurrencyService, .formatDateForBCB(), .getUsdBrl(), .getRates()]
- "services_dashboardservice_dashboardservice_builddashboarddata": ".buildDashboardData()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L140 | neighbors=[DashboardService, .calculateDivisionWorkloads(), .calculateKPIs(), .calculateMonthlyVolumes()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_mapmetadata": "._mapMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L273 | neighbors=[DocLibraryCatalogService, .moveToFolder(), .updateMetadata(), .uploadFile()]
- "services_easimodulesadapter_easimodulesadapter_bids": "._bids()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L45 | neighbors=[EasiModulesAdapter, .getBenchmarkDataset(), .getCostElementsRaw(), .getOpportunitiesRaw()]
- "services_easimodulesadapter_easimodulesadapter_costrows": "._costRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L61 | neighbors=[EasiModulesAdapter, deriveTypeRaw(), .getBenchmarkDataset(), .getCostElementsRaw()]
- "services_notificationlogservice_notificationlogservice": "NotificationLogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationLogService.ts:L12 | neighbors=[NotificationLogService.ts, .ensureList(), ._provision(), SystemConfiguration.tsx]
- "services_pastbidknowledgeservice_pastbidprofilefields": "PastBidProfileFields" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PastBidKnowledgeService.ts:L22 | neighbors=[usePastBidPublisher.ts, PastBidProfileModal.tsx, PastBidsPage.tsx, PastBidKnowledgeService.ts]
- "services_pricingservice_pricingservice": "PricingService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PricingService.ts:L20 | neighbors=[PricingService.ts, .getAll(), ._list(), .save()]
- "services_qualificationdbservice_qualificationdbservice_provision": "._provision()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L40 | neighbors=[QualificationDbService, .ensureList(), isNotFound(), .update()]
- "services_qualificationdbservice_qualificationdbservice_syncfrombid": ".syncFromBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L229 | neighbors=[QualificationDbService, .ensureList(), ._mapToSP(), .update()]
- "services_quotationservice_quotationservice_migratelegacyblob": "._migrateLegacyBlob()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L169 | neighbors=[QuotationService, .getAll(), .ensureColumns(), ._toRow()]
- "services_quotationservice_quotationservice_torow": "._toRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L129 | neighbors=[QuotationService, .addItems(), ._migrateLegacyBlob(), .updateItem()]
- "services_quotationservice_quotationservice_updateitem": ".updateItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L251 | neighbors=[QuotationService, .ensureColumns(), ._findRowId(), ._toRow()]
- "services_statustrackerservice_statustrackerservice": "StatusTrackerService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/StatusTrackerService.ts:L36 | neighbors=[StatusTrackerService.ts, ._list(), .notify(), .notifyMultiple()]
- "services_supplierservice_joinlines": "joinLines()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L86 | neighbors=[SupplierService.ts, .updateAliases(), .updateProfile(), toFields()]
- "services_supplierservice_supplierservice_create": ".create()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L225 | neighbors=[SupplierService, .columns(), ._setLogo(), toFields()]
- "services_supplierservice_supplierservice_updatealiases": ".updateAliases()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L254 | neighbors=[SupplierService, joinLines(), .columns(), .update()]
- "services_supplierservice_tomodel": "toModel()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L120 | neighbors=[SupplierService.ts, parseContacts(), splitLines(), splitList()]
- "sheets_currencytable_usdcell": "usdCell()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/currencyTable.ts:L31 | neighbors=[certificationsSheet.ts, currencyTable.ts, logisticsSheet.ts, prepMobSheet.ts]
- "sheets_currencytable_writecurrencytable": "writeCurrencyTable()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/currencyTable.ts:L78 | neighbors=[certificationsSheet.ts, currencyTable.ts, logisticsSheet.ts, prepMobSheet.ts]
- "sheets_hourssheet_buildhourssheet": "buildHoursSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/hoursSheet.ts:L20 | neighbors=[index.ts, hoursSheet.ts, writeEngineeringItems(), writeHoursTable()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-028.json

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
