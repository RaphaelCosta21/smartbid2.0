# Node Description Batch 76 of 86

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

- "services_ernservice_ernservice_getfieldchoices": ".getFieldChoices()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L148 | neighbors=[ErnService]
- "services_ernservice_ernservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L18 | neighbors=[ErnService]
- "services_exportservice_exportservice_exporttoexcel": ".exportToExcel()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ExportService.ts:L11 | neighbors=[ExportService]
- "services_exportservice_exportservice_exporttopdf": ".exportToPDF()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ExportService.ts:L58 | neighbors=[ExportService]
- "services_exportservice_exportservice_print": ".print()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ExportService.ts:L92 | neighbors=[ExportService]
- "services_favoritesservice_empty_data": "EMPTY_DATA" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L15 | neighbors=[FavoritesService.ts]
- "services_favoritesservice_favoritesservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L22 | neighbors=[FavoritesService]
- "services_linksrecommendationsservice_empty_data": "EMPTY_DATA" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L14 | neighbors=[LinksRecommendationsService.ts]
- "services_linksrecommendationsservice_linksrecommendationsservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L20 | neighbors=[LinksRecommendationsService]
- "services_membersservice_membersservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L10 | neighbors=[MembersService]
- "services_notificationdispatchservice_inotificationactor": "INotificationActor" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationDispatchService.ts:L19 | neighbors=[NotificationDispatchService.ts]
- "services_notificationdispatchservice_inotificationpayload": "INotificationPayload" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationDispatchService.ts:L24 | neighbors=[NotificationDispatchService.ts]
- "services_notificationlogservice_delivery_statuses": "DELIVERY_STATUSES" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationLogService.ts:L7 | neighbors=[NotificationLogService.ts]
- "services_notificationservice_notificationservice_subscribe": ".subscribe()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L19 | neighbors=[NotificationService]
- "services_notificationservice_toastcallback": "ToastCallback" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L14 | neighbors=[NotificationService.ts]
- "services_notificationservice_toastoptions": "ToastOptions" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L7 | neighbors=[NotificationService.ts]
- "services_notificationservice_toasttype": "ToastType" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L5 | neighbors=[NotificationService.ts]
- "services_pastbidknowledgeservice_ipastbidpublishoptions": "IPastBidPublishOptions" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PastBidKnowledgeService.ts:L27 | neighbors=[PastBidKnowledgeService.ts]
- "services_pastbidknowledgeservice_pastbidknowledgeservice_fileurl": ".fileUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PastBidKnowledgeService.ts:L46 | neighbors=[PastBidKnowledgeService]
- "services_pastbidknowledgeservice_pastbidknowledgeservice_folderserverrelativeurl": ".folderServerRelativeUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PastBidKnowledgeService.ts:L40 | neighbors=[PastBidKnowledgeService]
- "services_pastbidknowledgeservice_pastbidknowledgeservice_suggestprofile": ".suggestProfile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PastBidKnowledgeService.ts:L52 | neighbors=[PastBidKnowledgeService]
- "services_pricingservice_ipriceentry": "IPriceEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PricingService.ts:L8 | neighbors=[PricingService.ts]
- "services_pricingservice_pricingservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PricingService.ts:L27 | neighbors=[PricingService]
- "services_pricingservice_pricingservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PricingService.ts:L23 | neighbors=[PricingService]
- "services_pricingservice_pricingservice_save": ".save()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PricingService.ts:L42 | neighbors=[PricingService]
- "services_qualificationdbservice_qualificationdbservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L25 | neighbors=[QualificationDbService]
- "services_qualificationdbservice_qualificationdbservice_mapfromsp": "._mapFromSP()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L102 | neighbors=[QualificationDbService]
- "services_quotationservice_quotationservice_fromrow": "._fromRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L99 | neighbors=[QuotationService]
- "services_quotationservice_quotationservice_getfileopenurl": ".getFileOpenUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L297 | neighbors=[QuotationService]
- "services_quotationservice_quotationservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L25 | neighbors=[QuotationService]
- "services_quotationservice_quotationservice_uploadfile": ".uploadFile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L274 | neighbors=[QuotationService]
- "services_requestservice_requestservice_assignrequest": ".assignRequest()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L316 | neighbors=[RequestService]
- "services_requestservice_requestservice_bidtorequest": ".bidToRequest()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L27 | neighbors=[RequestService]
- "services_requestservice_requestservice_createrequest": ".createRequest()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L90 | neighbors=[RequestService]
- "services_requestservice_requestservice_getunassignedfromsp": ".getUnassignedFromSP()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L17 | neighbors=[RequestService]
- "services_requestservice_requestservice_rejectrequest": ".rejectRequest()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/RequestService.ts:L329 | neighbors=[RequestService]
- "services_spservice_spservice_context": ".context()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SPService.ts:L39 | neighbors=[SPService]
- "services_spservice_spservice_errormessage": ".errorMessage()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SPService.ts:L53 | neighbors=[SPService]
- "services_spservice_spservice_init": ".init()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SPService.ts:L20 | neighbors=[SPService]
- "services_spservice_spservice_isinitialized": ".isInitialized()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SPService.ts:L48 | neighbors=[SPService]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-075.json

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
