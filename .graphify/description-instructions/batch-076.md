# Node Description Batch 77 of 86

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

- "services_spservice_spservice_sp": ".sp()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SPService.ts:L26 | neighbors=[SPService]
- "services_statustrackerservice_changetype": "ChangeType" | kind=code-symbol | source=src/webparts/smartBid20/app/services/StatusTrackerService.ts:L9 | neighbors=[StatusTrackerService.ts]
- "services_statustrackerservice_istatustrackerentry": "IStatusTrackerEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/services/StatusTrackerService.ts:L24 | neighbors=[StatusTrackerService.ts]
- "services_statustrackerservice_statustrackerservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/StatusTrackerService.ts:L37 | neighbors=[StatusTrackerService]
- "services_supplierservice_columnmap": "ColumnMap" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L35 | neighbors=[SupplierService.ts]
- "services_supplierservice_logo_types": "LOGO_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L39 | neighbors=[SupplierService.ts]
- "services_supplierservice_optional_fields": "OPTIONAL_FIELDS" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L34 | neighbors=[SupplierService.ts]
- "services_supplierservice_select_fields": "SELECT_FIELDS" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L56 | neighbors=[SupplierService.ts]
- "services_supplierservice_supplierlistitem": "SupplierListItem" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L18 | neighbors=[SupplierService.ts]
- "services_supplierservice_supplierservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L164 | neighbors=[SupplierService]
- "services_supplierservice_supplierservice_remove": ".remove()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L280 | neighbors=[SupplierService]
- "services_surveycatalogservice_anyentry": "AnyEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L29 | neighbors=[SurveyCatalogService.ts]
- "services_surveycatalogservice_itemtype": "ItemType" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L28 | neighbors=[SurveyCatalogService.ts]
- "services_surveycatalogservice_photo_ext": "PHOTO_EXT" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L21 | neighbors=[SurveyCatalogService.ts]
- "services_surveycatalogservice_surveycatalogservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L109 | neighbors=[SurveyCatalogService]
- "services_surveycatalogservice_surveycatalogservice_guesszoneanchor": "._guessZoneAnchor()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L195 | neighbors=[SurveyCatalogService]
- "services_surveycatalogservice_surveycatalogservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L34 | neighbors=[SurveyCatalogService]
- "services_surveycatalogservice_surveycatalogservice_normalizeequipment": "._normalizeEquipment()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L220 | neighbors=[SurveyCatalogService]
- "services_surveycatalogservice_surveycatalogservice_normalizesystem": "._normalizeSystem()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L207 | neighbors=[SurveyCatalogService]
- "services_surveycatalogservice_surveycatalogservice_origin": "._origin()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L38 | neighbors=[SurveyCatalogService]
- "services_surveycatalogservice_surveycatalogservice_parsejson": "._parseJson()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L98 | neighbors=[SurveyCatalogService]
- "services_surveycatalogservice_surveycatalogservice_uploadequipmentphoto": ".uploadEquipmentPhoto()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L267 | neighbors=[SurveyCatalogService]
- "services_systemconfigservice_systemconfigservice_clearcache": ".clearCache()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SystemConfigService.ts:L73 | neighbors=[SystemConfigService]
- "services_systemconfigservice_systemconfigservice_get": ".get()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SystemConfigService.ts:L20 | neighbors=[SystemConfigService]
- "services_systemconfigservice_systemconfigservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SystemConfigService.ts:L16 | neighbors=[SystemConfigService]
- "services_systemconfigservice_systemconfigservice_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SystemConfigService.ts:L54 | neighbors=[SystemConfigService]
- "services_technicalproposalknowledgeservice_technicalproposalknowledgeservice_folderserverrelativeurl": ".folderServerRelativeUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L42 | neighbors=[TechnicalProposalKnowledgeService]
- "services_templateservice_templateservice_configlist": "._configList()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L18 | neighbors=[TemplateService]
- "services_templateservice_templateservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L25 | neighbors=[TemplateService]
- "services_templateservice_templateservice_getspitemid": ".getSpItemId()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L147 | neighbors=[TemplateService]
- "services_templateservice_templateservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L14 | neighbors=[TemplateService]
- "services_userservice_userservice_getcurrentuser": ".getCurrentUser()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/UserService.ts:L9 | neighbors=[UserService]
- "services_userservice_userservice_getuserphoto": ".getUserPhoto()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/UserService.ts:L23 | neighbors=[UserService]
- "services_userservice_userservice_searchusers": ".searchUsers()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/UserService.ts:L33 | neighbors=[UserService]
- "settings_accesslog_area_labels": "AREA_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessLog.tsx:L19 | neighbors=[AccessLog.tsx]
- "settings_accesslog_areabadge": "AreaBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessLog.tsx:L41 | neighbors=[AccessLog.tsx]
- "settings_accesslog_areafilter": "AreaFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessLog.tsx:L15 | neighbors=[AccessLog.tsx]
- "settings_accesslog_iusersummary": "IUserSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessLog.tsx:L24 | neighbors=[AccessLog.tsx]
- "settings_accesslog_periodfilter": "PeriodFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessLog.tsx:L16 | neighbors=[AccessLog.tsx]
- "settings_accesslog_periodstart": "periodStart()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessLog.tsx:L33 | neighbors=[AccessLog.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-076.json

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
