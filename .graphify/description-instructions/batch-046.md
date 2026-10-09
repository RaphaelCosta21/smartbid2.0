# Node Description Batch 47 of 86

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
- "services_supplierservice_parsecontacts": "parseContacts()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L100 | neighbors=[SupplierService.ts, toModel()]
- "services_supplierservice_splitlines": "splitLines()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L78 | neighbors=[SupplierService.ts, toModel()]
- "services_supplierservice_splitlist": "splitList()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L69 | neighbors=[SupplierService.ts, toModel()]
- "services_supplierservice_supplierservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L211 | neighbors=[SupplierService, .columns()]
- "services_supplierservice_supplierservice_provisioncolumns": "._provisionColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L182 | neighbors=[SupplierService, .columns()]
- "services_surveycatalogservice_surveycatalogservice_importcatalog": ".importCatalog()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L303 | neighbors=[SurveyCatalogService, .ensureList()]
- "services_surveycatalogservice_surveycatalogservice_provision": "._provision()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L53 | neighbors=[SurveyCatalogService, .ensureList()]
- "services_technicalproposalknowledgeservice_cut": "cut()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L34 | neighbors=[TechnicalProposalKnowledgeService.ts, ._buildMetadata()]
- "services_technicalproposalknowledgeservice_technicalproposalknowledgeservice_createfolderifmissing": "._createFolderIfMissing()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L232 | neighbors=[TechnicalProposalKnowledgeService, ._ensureFolder()]
- "services_technicalproposalknowledgeservice_technicalproposalknowledgeservice_ensurecolumns": "._ensureColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L245 | neighbors=[TechnicalProposalKnowledgeService, .publish()]
- "services_technicalproposalknowledgeservice_technicalproposalknowledgeservice_filename": ".fileName()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L48 | neighbors=[TechnicalProposalKnowledgeService, .publish()]
- "services_templateservice_templateservice_create": ".create()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L102 | neighbors=[TemplateService, .update()]
- "services_templateservice_templateservice_deletetemplate": ".deleteTemplate()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L131 | neighbors=[TemplateService, .getById()]
- "settings_accesslog_accesslog": "AccessLog()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessLog.tsx:L51 | neighbors=[AccessLog.tsx, SystemConfiguration.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-046.json

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
