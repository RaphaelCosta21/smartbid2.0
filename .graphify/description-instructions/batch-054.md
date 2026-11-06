# Node Description Batch 55 of 102

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

- "services_clarificationknowledgeservice_clarificationknowledgeservice_start": "._start()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationKnowledgeService.ts:L57 | neighbors=[ClarificationKnowledgeService, .publish()]
- "services_currencyservice_currencyservice_getrateswithfallback": ".getRatesWithFallback()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L161 | neighbors=[CurrencyService, .getRates()]
- "services_dashboardservice_dashboardservice_calculatedivisionworkloads": ".calculateDivisionWorkloads()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L114 | neighbors=[DashboardService, .buildDashboardData()]
- "services_dashboardservice_dashboardservice_calculatekpis": ".calculateKPIs()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L18 | neighbors=[DashboardService, .buildDashboardData()]
- "services_dashboardservice_dashboardservice_calculatemonthlyvolumes": ".calculateMonthlyVolumes()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L92 | neighbors=[DashboardService, .buildDashboardData()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_buildpreviewurl": ".buildPreviewUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L143 | neighbors=[DocLibraryCatalogService, .getItems()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_createfolderifmissing": "._createFolderIfMissing()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L51 | neighbors=[DocLibraryCatalogService, .ensureFolder()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_ensurefolder": ".ensureFolder()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L36 | neighbors=[DocLibraryCatalogService, ._createFolderIfMissing()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_movetofolder": ".moveToFolder()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L325 | neighbors=[DocLibraryCatalogService, ._mapMetadata()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_origin": "._origin()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L63 | neighbors=[DocLibraryCatalogService, .getItems()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_updatemetadata": ".updateMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L291 | neighbors=[DocLibraryCatalogService, ._mapMetadata()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_uploadfile": ".uploadFile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L301 | neighbors=[DocLibraryCatalogService, ._mapMetadata()]
- "services_easimodulesadapter_derivetyperaw": "deriveTypeRaw()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L28 | neighbors=[EasiModulesAdapter.ts, ._costRows()]
- "services_easimodulesadapter_easimodulesadapter_laborrows": "._laborRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L108 | neighbors=[EasiModulesAdapter, .getBenchmarkDataset()]
- "services_ernservice_ernservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L44 | neighbors=[ErnService, .search()]
- "services_ernservice_ernservice_getnexternnumber": ".getNextErnNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L97 | neighbors=[ErnService, .create()]
- "services_ernservice_ernservice_mapfromsp": ".mapFromSP()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L202 | neighbors=[ErnService, .getByTitle()]
- "services_ernservice_ernservice_search": ".search()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L83 | neighbors=[ErnService, .getAll()]
- "services_notificationlogservice_notificationlogservice_ensurelist": ".ensureList()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationLogService.ts:L14 | neighbors=[NotificationLogService, ._provision()]
- "services_notificationlogservice_notificationlogservice_provision": "._provision()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationLogService.ts:L29 | neighbors=[NotificationLogService, .ensureList()]
- "services_notificationservice_notificationservice_error": ".error()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L37 | neighbors=[NotificationService, ._emit()]
- "services_notificationservice_notificationservice_info": ".info()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L45 | neighbors=[NotificationService, ._emit()]
- "services_notificationservice_notificationservice_success": ".success()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L33 | neighbors=[NotificationService, ._emit()]
- "services_notificationservice_notificationservice_warning": ".warning()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L41 | neighbors=[NotificationService, ._emit()]
- "services_pastbidknowledgeservice_pastbidknowledgeservice_ensurecolumns": "._ensureColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PastBidKnowledgeService.ts:L200 | neighbors=[PastBidKnowledgeService, .publish()]
- "services_pastbidknowledgeservice_pastbidknowledgeservice_publish": ".publish()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PastBidKnowledgeService.ts:L73 | neighbors=[PastBidKnowledgeService, ._ensureColumns()]
- "services_qualificationdbservice_qualificationdbservice_delete": ".delete()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L174 | neighbors=[QualificationDbService, .saveTable()]
- "services_qualificationdbservice_qualificationdbservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L142 | neighbors=[QualificationDbService, isNotFound()]
- "services_querycatalogservice_querycatalogservice_datediffdays": ".dateDiffDays()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L297 | neighbors=[QueryCatalogService, .parseBomSheet()]
- "services_querycatalogservice_querycatalogservice_parseactiveregistered": ".parseActiveRegistered()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L155 | neighbors=[QueryCatalogService, .loadCatalog()]
- "services_querycatalogservice_querycatalogservice_parsefinancialsactiveregistered": ".parseFinancialsActiveRegistered()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L125 | neighbors=[QueryCatalogService, .loadFinancialsActiveRegistered()]
- "services_querycatalogservice_querycatalogservice_parsepeoplesoftfinancials": ".parsePeopleSoftFinancials()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L187 | neighbors=[QueryCatalogService, .loadCatalog()]
- "services_querycatalogservice_querycatalogservice_parserawsheet": ".parseRawSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L315 | neighbors=[QueryCatalogService, .loadCatalog()]
- "services_querycatalogservice_querycatalogservice_toisodate": ".toISODate()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L284 | neighbors=[QueryCatalogService, .parseBomSheet()]
- "services_querycatalogservice_querycatalogservice_tonumber": ".toNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L277 | neighbors=[QueryCatalogService, .parseBomSheet()]
- "services_quotationservice_quotationservice_deleteitem": ".deleteItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L264 | neighbors=[QuotationService, ._findRowId()]
- "services_quotationservice_quotationservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L201 | neighbors=[QuotationService, ._migrateLegacyBlob()]
- "services_quotationservice_quotationservice_provisioncolumns": "._provisionColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L46 | neighbors=[QuotationService, .ensureColumns()]
- "services_statustrackerservice_statustrackerservice_notify": ".notify()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/StatusTrackerService.ts:L43 | neighbors=[StatusTrackerService, .notifyMultiple()]
- "services_statustrackerservice_statustrackerservice_notifymultiple": ".notifyMultiple()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/StatusTrackerService.ts:L51 | neighbors=[StatusTrackerService, .notify()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-054.json

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
