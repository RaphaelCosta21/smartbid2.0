# Node Description Batch 31 of 86

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

- "services_aianalysisservice_aianalysisservice_parseclarifications": ".parseClarifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L637 | neighbors=[AIAnalysisService, .suggestClarifications(), .validateResponse()]
- "services_aianalysisservice_aianalysisservice_parsewarnings": ".parseWarnings()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L1164 | neighbors=[AIAnalysisService, .suggestClarifications(), .suggestQualifications()]
- "services_aiauthservice_aiauthservice_acquireinteractive": ".acquireInteractive()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L277 | neighbors=[AiAuthService, .log(), .getAccessToken()]
- "services_aiauthservice_aiauthservice_cleartokencache": ".clearTokenCache()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L331 | neighbors=[AiAuthService, .getApp(), .log()]
- "services_aiauthservice_aiauthservice_isconfigured": ".isConfigured()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L95 | neighbors=[AiAuthService, .getApp(), .warmUp()]
- "services_approvalservice_approvalservice_ensureapprovalcolumns": ".ensureApprovalColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L27 | neighbors=[ApprovalService, .markRoundOverridden(), .startApprovalRound()]
- "services_bidservice_bidservice_create": ".create()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L126 | neighbors=[BidService, .ensureColumns(), ._searchColumns()]
- "services_bidservice_bidservice_parse": "._parse()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L106 | neighbors=[BidService, .getByBidNumber(), .getById()]
- "services_bomcostanalysisservice_bomcostanalysisservice_deleteone": ".deleteOne()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BomCostAnalysisService.ts:L76 | neighbors=[BomCostAnalysisService, .getAll(), .save()]
- "services_bomcostanalysisservice_bomcostanalysisservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BomCostAnalysisService.ts:L17 | neighbors=[BomCostAnalysisService, .deleteOne(), .saveOne()]
- "services_bomcostanalysisservice_bomcostanalysisservice_save": ".save()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BomCostAnalysisService.ts:L39 | neighbors=[BomCostAnalysisService, .deleteOne(), .saveOne()]
- "services_bomcostanalysisservice_bomcostanalysisservice_saveone": ".saveOne()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BomCostAnalysisService.ts:L62 | neighbors=[BomCostAnalysisService, .getAll(), .save()]
- "services_clarificationdbservice_clarificationdbservice_create": ".create()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L184 | neighbors=[ClarificationDbService, ._columns(), ._mapToSP()]
- "services_clarificationknowledgeservice_clarificationknowledgeservice_publish": ".publish()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationKnowledgeService.ts:L43 | neighbors=[ClarificationKnowledgeService, ._ensureColumns(), ._start()]
- "services_currencyservice_currencyservice_formatdateforbcb": ".formatDateForBCB()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L61 | neighbors=[CurrencyService, .getCurrencyRate(), .getUsdBrl()]
- "services_currencyservice_currencyservice_getrates": ".getRates()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L143 | neighbors=[CurrencyService, .getCurrencyRate(), .getRatesWithFallback()]
- "services_currencyservice_currencyservice_getusdbrl": ".getUsdBrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L73 | neighbors=[CurrencyService, .getCurrencyRate(), .formatDateForBCB()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_getdriveid": "._getDriveId()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L80 | neighbors=[DocLibraryCatalogService, ._vroomGet(), .getThumbnailUrls()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_getitems": ".getItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L224 | neighbors=[DocLibraryCatalogService, .buildPreviewUrl(), ._origin()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_getthumbnailurls": ".getThumbnailUrls()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L112 | neighbors=[DocLibraryCatalogService, ._getDriveId(), ._vroomGet()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_mapmetadata": "._mapMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L273 | neighbors=[DocLibraryCatalogService, .updateMetadata(), .uploadFile()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_vroomget": "._vroomGet()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L70 | neighbors=[DocLibraryCatalogService, ._getDriveId(), .getThumbnailUrls()]
- "services_easimodulesadapter_easimodulesadapter_getcostelementsraw": ".getCostElementsRaw()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L146 | neighbors=[EasiModulesAdapter, ._bids(), ._costRows()]
- "services_easimodulesadapter_easimodulesadapter_getopportunitiesraw": ".getOpportunitiesRaw()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L150 | neighbors=[EasiModulesAdapter, ._bids(), ._opportunityRows()]
- "services_easimodulesadapter_easimodulesadapter_opportunityrows": "._opportunityRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L90 | neighbors=[EasiModulesAdapter, .getBenchmarkDataset(), .getOpportunitiesRaw()]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-030.json

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
