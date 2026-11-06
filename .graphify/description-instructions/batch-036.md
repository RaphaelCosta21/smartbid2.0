# Node Description Batch 37 of 102

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

- "services_editcontrolservice_editcontrolservice_acquirelock": ".acquireLock()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L48 | neighbors=[EditControlService, .getLocks(), .saveLocks()]
- "services_editcontrolservice_editcontrolservice_releaseallforbid": ".releaseAllForBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L93 | neighbors=[EditControlService, .getLocks(), .saveLocks()]
- "services_editcontrolservice_editcontrolservice_releaselock": ".releaseLock()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L73 | neighbors=[EditControlService, .getLocks(), .saveLocks()]
- "services_ernservice_ernservice_create": ".create()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L111 | neighbors=[ErnService, .getByTitle(), .getNextErnNumber()]
- "services_ernservice_ernservice_getbytitle": ".getByTitle()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L62 | neighbors=[ErnService, .create(), .mapFromSP()]
- "services_favoritesservice_favoritesservice_addbidfavorite": ".addBidFavorite()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L88 | neighbors=[FavoritesService, .getAll(), .save()]
- "services_favoritesservice_favoritesservice_addequipment": ".addEquipment()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L66 | neighbors=[FavoritesService, .getAll(), .save()]
- "services_favoritesservice_favoritesservice_removebidfavorite": ".removeBidFavorite()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L98 | neighbors=[FavoritesService, .getAll(), .save()]
- "services_favoritesservice_favoritesservice_removeequipment": ".removeEquipment()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L73 | neighbors=[FavoritesService, .getAll(), .save()]
- "services_favoritesservice_favoritesservice_updateequipment": ".updateEquipment()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L80 | neighbors=[FavoritesService, .getAll(), .save()]
- "services_favoritesservice_favoritesservice_updategroups": ".updateGroups()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L105 | neighbors=[FavoritesService, .getAll(), .save()]
- "services_linksrecommendationsservice_linksrecommendationsservice_addlink": ".addLink()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L64 | neighbors=[LinksRecommendationsService, .getAll(), .save()]
- "services_linksrecommendationsservice_linksrecommendationsservice_addrecommendation": ".addRecommendation()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L84 | neighbors=[LinksRecommendationsService, .getAll(), .save()]
- "services_linksrecommendationsservice_linksrecommendationsservice_removelink": ".removeLink()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L77 | neighbors=[LinksRecommendationsService, .getAll(), .save()]
- "services_linksrecommendationsservice_linksrecommendationsservice_removerecommendation": ".removeRecommendation()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L101 | neighbors=[LinksRecommendationsService, .getAll(), .save()]
- "services_linksrecommendationsservice_linksrecommendationsservice_updatelink": ".updateLink()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L70 | neighbors=[LinksRecommendationsService, .getAll(), .save()]
- "services_linksrecommendationsservice_linksrecommendationsservice_updaterecommendation": ".updateRecommendation()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L92 | neighbors=[LinksRecommendationsService, .getAll(), .save()]
- "services_membersservice_membersservice_addmember": ".addMember()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L66 | neighbors=[MembersService, .getAll(), .save()]
- "services_membersservice_membersservice_removemember": ".removeMember()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L81 | neighbors=[MembersService, .getAll(), .save()]
- "services_membersservice_membersservice_savepreferences": ".savePreferences()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L88 | neighbors=[MembersService, .getAll(), .save()]
- "services_membersservice_membersservice_updatemember": ".updateMember()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L72 | neighbors=[MembersService, .getAll(), .save()]
- "services_notificationdispatchservice_appurl": "appUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationDispatchService.ts:L39 | neighbors=[NotificationDispatchService.ts, .emit(), .sendTest()]
- "services_notificationdispatchservice_notificationdispatchservice_emit": ".emit()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationDispatchService.ts:L57 | neighbors=[NotificationDispatchService, appUrl(), post()]
- "services_notificationdispatchservice_notificationdispatchservice_sendtest": ".sendTest()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationDispatchService.ts:L109 | neighbors=[NotificationDispatchService, appUrl(), post()]
- "services_notificationdispatchservice_post": "post()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationDispatchService.ts:L42 | neighbors=[NotificationDispatchService.ts, .emit(), .sendTest()]
- "services_qualificationdbservice_isnotfound": "isNotFound()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L21 | neighbors=[QualificationDbService.ts, .getAll(), ._provision()]
- "services_qualificationdbservice_qualificationdbservice_create": ".create()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L157 | neighbors=[QualificationDbService, .ensureList(), ._mapToSP()]
- "services_querycatalogservice_querycatalogservice_loadfinancialsactiveregistered": ".loadFinancialsActiveRegistered()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L104 | neighbors=[QueryCatalogService, .loadCatalog(), .parseFinancialsActiveRegistered()]
- "services_quotationservice_quotationservice_additems": ".addItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L243 | neighbors=[QuotationService, .ensureColumns(), ._toRow()]
- "services_quotationservice_quotationservice_findrowid": "._findRowId()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L157 | neighbors=[QuotationService, .deleteItem(), .updateItem()]
- "services_supplierservice_joinkeywords": "joinKeywords()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L93 | neighbors=[SupplierService.ts, .updateProfile(), toFields()]
- "services_supplierservice_supplierservice_clearlogo": "._clearLogo()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L284 | neighbors=[SupplierService, ._setLogo(), .update()]
- "services_supplierservice_validatelogo": "validateLogo()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L49 | neighbors=[SuppliersRegistry.tsx, SupplierService.ts, ._setLogo()]
- "services_surveycatalogservice_surveycatalogservice_ensurelist": ".ensureList()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L43 | neighbors=[SurveyCatalogService, ._provision(), .importCatalog()]
- "services_technicalproposalknowledgeservice_technicalproposalknowledgeservice_buildmetadata": "._buildMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L171 | neighbors=[TechnicalProposalKnowledgeService, cut(), .publish()]
- "services_technicalproposalknowledgeservice_technicalproposalknowledgeservice_ensurefolder": "._ensureFolder()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L218 | neighbors=[TechnicalProposalKnowledgeService, ._createFolderIfMissing(), .publish()]
- "services_templateservice_templateservice_getbyid": ".getById()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L81 | neighbors=[TemplateService, .deleteTemplate(), .update()]
- "services_templateservice_templateservice_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L112 | neighbors=[TemplateService, .create(), .getById()]
- "settings_approvalrulesconfig": "ApprovalRulesConfig.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/ApprovalRulesConfig.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ApprovalRulesConfig()]
- "settings_notificationmatrix_pilltitle": "pillTitle()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L141 | neighbors=[NotificationMatrix.tsx, audienceParts(), teamLabel()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-036.json

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
