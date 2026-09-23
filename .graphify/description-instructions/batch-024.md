# Node Description Batch 25 of 43

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

- "services_assetcatalogservice_assetcatalogservice_mapfromsp": ".mapFromSP()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AssetCatalogService.ts:L59 | neighbors=[AssetCatalogService, .getAll()]
- "services_bidservice_bidservice_delete": ".delete()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L160 | neighbors=[BidService, .getById()]
- "services_bidservice_bidservice_provisioncolumns": "._provisionColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L38 | neighbors=[BidService, .ensureColumns()]
- "services_clarificationdbservice_clarificationdbservice_addmany": ".addMany()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L104 | neighbors=[ClarificationDbService, ._mapToSP()]
- "services_clarificationdbservice_clarificationdbservice_create": ".create()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L81 | neighbors=[ClarificationDbService, ._mapToSP()]
- "services_clarificationdbservice_clarificationdbservice_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L89 | neighbors=[ClarificationDbService, ._mapToSP()]
- "services_currencyservice_currencyservice_getrateswithfallback": ".getRatesWithFallback()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L161 | neighbors=[CurrencyService, .getRates()]
- "services_dashboardservice_dashboardservice_calculatedivisionworkloads": ".calculateDivisionWorkloads()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L107 | neighbors=[DashboardService, .buildDashboardData()]
- "services_dashboardservice_dashboardservice_calculatekpis": ".calculateKPIs()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L16 | neighbors=[DashboardService, .buildDashboardData()]
- "services_dashboardservice_dashboardservice_calculatemonthlyvolumes": ".calculateMonthlyVolumes()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L85 | neighbors=[DashboardService, .buildDashboardData()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_buildpreviewurl": ".buildPreviewUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L36 | neighbors=[DocLibraryCatalogService, .getItems()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_origin": "._origin()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L31 | neighbors=[DocLibraryCatalogService, .getItems()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_updatemetadata": ".updateMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L183 | neighbors=[DocLibraryCatalogService, ._mapMetadata()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_uploadfile": ".uploadFile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L193 | neighbors=[DocLibraryCatalogService, ._mapMetadata()]
- "services_ernservice_ernservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L35 | neighbors=[ErnService, .search()]
- "services_ernservice_ernservice_getnexternnumber": ".getNextErnNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L88 | neighbors=[ErnService, .create()]
- "services_ernservice_ernservice_mapfromsp": ".mapFromSP()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L193 | neighbors=[ErnService, .getByTitle()]
- "services_ernservice_ernservice_search": ".search()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L74 | neighbors=[ErnService, .getAll()]
- "services_notificationservice_notificationservice_error": ".error()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L37 | neighbors=[NotificationService, ._emit()]
- "services_notificationservice_notificationservice_info": ".info()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L45 | neighbors=[NotificationService, ._emit()]
- "services_notificationservice_notificationservice_success": ".success()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L33 | neighbors=[NotificationService, ._emit()]
- "services_notificationservice_notificationservice_warning": ".warning()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L41 | neighbors=[NotificationService, ._emit()]
- "services_querycatalogservice_querycatalogservice_datediffdays": ".dateDiffDays()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L238 | neighbors=[QueryCatalogService, .parseBomSheet()]
- "services_querycatalogservice_querycatalogservice_parseactiveregistered": ".parseActiveRegistered()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L96 | neighbors=[QueryCatalogService, .loadCatalog()]
- "services_querycatalogservice_querycatalogservice_parsepeoplesoftfinancials": ".parsePeopleSoftFinancials()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L128 | neighbors=[QueryCatalogService, .loadCatalog()]
- "services_querycatalogservice_querycatalogservice_parserawsheet": ".parseRawSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L256 | neighbors=[QueryCatalogService, .loadCatalog()]
- "services_querycatalogservice_querycatalogservice_toisodate": ".toISODate()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L225 | neighbors=[QueryCatalogService, .parseBomSheet()]
- "services_querycatalogservice_querycatalogservice_tonumber": ".toNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L218 | neighbors=[QueryCatalogService, .parseBomSheet()]
- "services_quotationservice_quotationservice_deleteitem": ".deleteItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L262 | neighbors=[QuotationService, ._findRowId()]
- "services_quotationservice_quotationservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L199 | neighbors=[QuotationService, ._migrateLegacyBlob()]
- "services_quotationservice_quotationservice_provisioncolumns": "._provisionColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L44 | neighbors=[QuotationService, .ensureColumns()]
- "services_statustrackerservice_statustrackerservice_notify": ".notify()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/StatusTrackerService.ts:L43 | neighbors=[StatusTrackerService, .notifyMultiple()]
- "services_statustrackerservice_statustrackerservice_notifymultiple": ".notifyMultiple()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/StatusTrackerService.ts:L51 | neighbors=[StatusTrackerService, .notify()]
- "services_templateservice_templateservice_create": ".create()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L102 | neighbors=[TemplateService, .update()]
- "services_templateservice_templateservice_deletetemplate": ".deleteTemplate()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L131 | neighbors=[TemplateService, .getById()]
- "settings_patchnotes_patchnotes": "PatchNotes()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/PatchNotes.tsx:L10 | neighbors=[PatchNotesPage.tsx, PatchNotes.tsx]
- "smartbid20_smartbid20webpart_smartbid20webpart_getenvironmentmessage": "._getEnvironmentMessage()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L59 | neighbors=[SmartBid20WebPart, .onInit()]
- "smartbid20_smartbid20webpart_smartbid20webpart_oninit": ".onInit()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L40 | neighbors=[SmartBid20WebPart, ._getEnvironmentMessage()]
- "stores_usebidstore_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L5 | neighbors=[BidTrackerPage.tsx, useBidStore.ts]
- "stores_usechatstore_usechatstore": "useChatStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useChatStore.ts:L35 | neighbors=[ChatAssistant.tsx, useChatStore.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-024.json

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
