# Node Description Batch 75 of 86

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

- "services_approvalservice_approvalservice_requestapproval": ".requestApproval()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L156 | neighbors=[ApprovalService]
- "services_attachmentservice_attachmentservice_deletefile": ".deleteFile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L57 | neighbors=[AttachmentService]
- "services_attachmentservice_attachmentservice_getfilesinfolder": ".getFilesInFolder()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L61 | neighbors=[AttachmentService]
- "services_attachmentservice_attachmentservice_gettemplatefiles": ".getTemplateFiles()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L179 | neighbors=[AttachmentService]
- "services_attachmentservice_attachmentservice_safefoldername": ".safeFolderName()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L11 | neighbors=[AttachmentService]
- "services_attachmentservice_attachmentservice_uploadfile": ".uploadFile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L20 | neighbors=[AttachmentService]
- "services_attachmentservice_attachmentservice_uploadrequestfiles": ".uploadRequestFiles()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L93 | neighbors=[AttachmentService]
- "services_attachmentservice_attachmentservice_uploadtemplatefile": ".uploadTemplateFile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L140 | neighbors=[AttachmentService]
- "services_bidservice_bidservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L95 | neighbors=[BidService]
- "services_bidservice_bidservice_getbystatus": ".getByStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L178 | neighbors=[BidService]
- "services_bidservice_bidservice_getoverdue": ".getOverdue()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L188 | neighbors=[BidService]
- "services_bidservice_bidservice_gettotalpatchversion": ".getTotalPatchVersion()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L241 | neighbors=[BidService]
- "services_bidservice_bidservice_hasanypendingpatch": ".hasAnyPendingPatch()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L236 | neighbors=[BidService]
- "services_bidservice_bidservice_haspendingpatch": ".hasPendingPatch()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L228 | neighbors=[BidService]
- "services_bidservice_bidservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L25 | neighbors=[BidService]
- "services_clarificationdbservice_clarificationdbservice_delete": ".delete()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L204 | neighbors=[ClarificationDbService]
- "services_clarificationdbservice_clarificationdbservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L32 | neighbors=[ClarificationDbService]
- "services_clarificationdbservice_clarificationdbservice_mapfromsp": "._mapFromSP()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L96 | neighbors=[ClarificationDbService]
- "services_clarificationdbservice_provisioned_fields": "PROVISIONED_FIELDS" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L14 | neighbors=[ClarificationDbService.ts]
- "services_clarificationdbservice_rationale_3": "NOTE: This list uses real SharePoint columns (not a JSON blob)." | kind=entity | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L3 | neighbors=[ClarificationDbService.ts]
- "services_clarificationknowledgeservice_clarificationknowledgeservice_folderserverrelativeurl": ".folderServerRelativeUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationKnowledgeService.ts:L34 | neighbors=[ClarificationKnowledgeService]
- "services_clarificationknowledgeservice_iclarificationknowledgeresult": "IClarificationKnowledgeResult" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationKnowledgeService.ts:L20 | neighbors=[ClarificationKnowledgeService.ts]
- "services_clarificationknowledgeservice_types": "TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationKnowledgeService.ts:L27 | neighbors=[ClarificationKnowledgeService.ts]
- "services_currencyservice_bcb_currency_types": "BCB_CURRENCY_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L17 | neighbors=[CurrencyService.ts]
- "services_currencyservice_ibcbcurrencyresponse": "IBCBCurrencyResponse" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L37 | neighbors=[CurrencyService.ts]
- "services_currencyservice_ibcbdollarresponse": "IBCBDollarResponse" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L29 | neighbors=[CurrencyService.ts]
- "services_currencyservice_icurrencyrate": "ICurrencyRate" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L48 | neighbors=[CurrencyService.ts]
- "services_dashboardservice_dashboardservice_getkpivalue": "._getKPIValue()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L73 | neighbors=[DashboardService]
- "services_doclibrarycatalogservice_doc_type_choices": "DOC_TYPE_CHOICES" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L19 | neighbors=[DocLibraryCatalogService.ts]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_deletefile": ".deleteFile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L322 | neighbors=[DocLibraryCatalogService]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_downloadfileasfile": ".downloadFileAsFile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L329 | neighbors=[DocLibraryCatalogService]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_ensurecolumns": ".ensureColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L153 | neighbors=[DocLibraryCatalogService]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L31 | neighbors=[DocLibraryCatalogService]
- "services_easimodulesadapter_assetitem": "AssetItem" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L20 | neighbors=[EasiModulesAdapter.ts]
- "services_easimodulesadapter_easimodulesadapter_getsupplyindex": ".getSupplyIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L156 | neighbors=[EasiModulesAdapter]
- "services_easimodulesadapter_hoursitem": "HoursItem" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L21 | neighbors=[EasiModulesAdapter.ts]
- "services_easimodulesadapter_rawrow": "RawRow" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L25 | neighbors=[EasiModulesAdapter.ts]
- "services_easimodulesadapter_scopeitem": "ScopeItem" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L19 | neighbors=[EasiModulesAdapter.ts]
- "services_easimodulesadapter_smartbiddataadapter": "SmartBidDataAdapter" | kind=code-symbol | neighbors=[EasiModulesAdapter]
- "services_editcontrolservice_editcontrolservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L12 | neighbors=[EditControlService]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-074.json

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
