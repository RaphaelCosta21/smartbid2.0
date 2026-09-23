# Node Description Batch 38 of 43

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

- "services_attachmentservice_attachmentservice_deletefile": ".deleteFile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L47 | neighbors=[AttachmentService]
- "services_attachmentservice_attachmentservice_getfilesinfolder": ".getFilesInFolder()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L51 | neighbors=[AttachmentService]
- "services_attachmentservice_attachmentservice_gettemplatefiles": ".getTemplateFiles()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L169 | neighbors=[AttachmentService]
- "services_attachmentservice_attachmentservice_uploadfile": ".uploadFile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L10 | neighbors=[AttachmentService]
- "services_attachmentservice_attachmentservice_uploadrequestfiles": ".uploadRequestFiles()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L83 | neighbors=[AttachmentService]
- "services_attachmentservice_attachmentservice_uploadtemplatefile": ".uploadTemplateFile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L130 | neighbors=[AttachmentService]
- "services_bidservice_bidservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L86 | neighbors=[BidService]
- "services_bidservice_bidservice_getbybidnumber": ".getByBidNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L103 | neighbors=[BidService]
- "services_bidservice_bidservice_getbystatus": ".getByStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L164 | neighbors=[BidService]
- "services_bidservice_bidservice_getoverdue": ".getOverdue()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L174 | neighbors=[BidService]
- "services_bidservice_bidservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L16 | neighbors=[BidService]
- "services_clarificationdbservice_clarificationdbservice_delete": ".delete()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L99 | neighbors=[ClarificationDbService]
- "services_clarificationdbservice_clarificationdbservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L56 | neighbors=[ClarificationDbService]
- "services_clarificationdbservice_clarificationdbservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L13 | neighbors=[ClarificationDbService]
- "services_clarificationdbservice_clarificationdbservice_mapfromsp": "._mapFromSP()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L19 | neighbors=[ClarificationDbService]
- "services_clarificationdbservice_rationale_3": "NOTE: This list uses real SharePoint columns (not a JSON blob)." | kind=entity | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L3 | neighbors=[ClarificationDbService.ts]
- "services_currencyservice_bcb_currency_types": "BCB_CURRENCY_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L17 | neighbors=[CurrencyService.ts]
- "services_currencyservice_ibcbcurrencyresponse": "IBCBCurrencyResponse" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L37 | neighbors=[CurrencyService.ts]
- "services_currencyservice_ibcbdollarresponse": "IBCBDollarResponse" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L29 | neighbors=[CurrencyService.ts]
- "services_currencyservice_icurrencyrate": "ICurrencyRate" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L48 | neighbors=[CurrencyService.ts]
- "services_dashboardservice_dashboardservice_getkpivalue": "._getKPIValue()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L66 | neighbors=[DashboardService]
- "services_doclibrarycatalogservice_doc_type_choices": "DOC_TYPE_CHOICES" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L19 | neighbors=[DocLibraryCatalogService.ts]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_deletefile": ".deleteFile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L214 | neighbors=[DocLibraryCatalogService]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_downloadfileasfile": ".downloadFileAsFile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L221 | neighbors=[DocLibraryCatalogService]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_ensurecolumns": ".ensureColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L46 | neighbors=[DocLibraryCatalogService]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L27 | neighbors=[DocLibraryCatalogService]
- "services_editcontrolservice_editcontrolservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L12 | neighbors=[EditControlService]
- "services_ernservice_ernservice_getfieldchoices": ".getFieldChoices()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L139 | neighbors=[ErnService]
- "services_ernservice_ernservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L18 | neighbors=[ErnService]
- "services_exportservice_exportservice_exporttoexcel": ".exportToExcel()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ExportService.ts:L11 | neighbors=[ExportService]
- "services_exportservice_exportservice_exporttopdf": ".exportToPDF()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ExportService.ts:L58 | neighbors=[ExportService]
- "services_exportservice_exportservice_print": ".print()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ExportService.ts:L92 | neighbors=[ExportService]
- "services_favoritesservice_empty_data": "EMPTY_DATA" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L15 | neighbors=[FavoritesService.ts]
- "services_favoritesservice_favoritesservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L22 | neighbors=[FavoritesService]
- "services_linksrecommendationsservice_empty_data": "EMPTY_DATA" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L14 | neighbors=[LinksRecommendationsService.ts]
- "services_linksrecommendationsservice_linksrecommendationsservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L20 | neighbors=[LinksRecommendationsService]
- "services_membersservice_membersservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L10 | neighbors=[MembersService]
- "services_notificationservice_notificationservice_subscribe": ".subscribe()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L19 | neighbors=[NotificationService]
- "services_notificationservice_toastcallback": "ToastCallback" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L14 | neighbors=[NotificationService.ts]
- "services_notificationservice_toastoptions": "ToastOptions" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L7 | neighbors=[NotificationService.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-037.json

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
