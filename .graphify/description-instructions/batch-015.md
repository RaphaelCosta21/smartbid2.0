# Node Description Batch 16 of 43

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

- "models_ilinksrecommendations_ilinksrecommendationsdata": "ILinksRecommendationsData" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ILinksRecommendations.ts:L24 | neighbors=[ILinksRecommendations.ts, index.ts, LinksRecommendationsService.ts]
- "models_inotification": "INotification.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/INotification.ts:L1 | neighbors=[fe3728a smartbid2.0, index.ts, INotification]
- "models_isystemconfig_ikpitargets": "IKPITargets" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L17 | neighbors=[index.ts, ISystemConfig.ts, DashboardService.ts]
- "models_iuser_bidrole": "BidRole" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L12 | neighbors=[index.ts, ITeamMember.ts, IUser.ts]
- "models_iuser_businessline": "BusinessLine" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L10 | neighbors=[index.ts, ITeamMember.ts, IUser.ts]
- "models_iuser_userrole": "UserRole" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L21 | neighbors=[index.ts, ISystemConfig.ts, IUser.ts]
- "pages_bomcostspage_bomcostspage": "BomCostsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L301 | neighbors=[AppLayout.tsx, BomCostsPage.tsx, formatDateDMY()]
- "pages_clarificationsdbpage_clarificationsdbpage": "ClarificationsDbPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ClarificationsDbPage.tsx:L30 | neighbors=[AppLayout.tsx, ClarificationsDbPage.tsx, toDateInput()]
- "pages_performancetrendspage_performancetrendspage": "PerformanceTrendsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PerformanceTrendsPage.tsx:L62 | neighbors=[AppLayout.tsx, PerformanceTrendsPage.tsx, lastDelta()]
- "pages_queryconsultingpage_matchtokens": "matchTokens()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L172 | neighbors=[QueryConsultingPage.tsx, applyAllFilters(), applyMultipleFilters()]
- "pages_queryconsultingpage_queryconsultingpage": "QueryConsultingPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L244 | neighbors=[AppLayout.tsx, QueryConsultingPage.tsx, emptyTabData()]
- "reports_biddetailsreport": "BidDetailsReport.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/BidDetailsReport.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, BidDetailsReport()]
- "reports_operationalsummaryreport": "OperationalSummaryReport.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/OperationalSummaryReport.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, OperationalSummaryReport()]
- "reports_periodperformancereport": "PeriodPerformanceReport.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/PeriodPerformanceReport.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PeriodPerformanceReport()]
- "services_aiauthservice_aiauthservice_acquireinteractive": ".acquireInteractive()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L277 | neighbors=[AiAuthService, .log(), .getAccessToken()]
- "services_aiauthservice_aiauthservice_cleartokencache": ".clearTokenCache()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L331 | neighbors=[AiAuthService, .getApp(), .log()]
- "services_aiauthservice_aiauthservice_isconfigured": ".isConfigured()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L95 | neighbors=[AiAuthService, .getApp(), .warmUp()]
- "services_bidservice_bidservice_create": ".create()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L112 | neighbors=[BidService, .ensureColumns(), ._searchColumns()]
- "services_bomcostanalysisservice_bomcostanalysisservice_deleteone": ".deleteOne()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BomCostAnalysisService.ts:L76 | neighbors=[BomCostAnalysisService, .getAll(), .save()]
- "services_bomcostanalysisservice_bomcostanalysisservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BomCostAnalysisService.ts:L17 | neighbors=[BomCostAnalysisService, .deleteOne(), .saveOne()]
- "services_bomcostanalysisservice_bomcostanalysisservice_save": ".save()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BomCostAnalysisService.ts:L39 | neighbors=[BomCostAnalysisService, .deleteOne(), .saveOne()]
- "services_bomcostanalysisservice_bomcostanalysisservice_saveone": ".saveOne()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BomCostAnalysisService.ts:L62 | neighbors=[BomCostAnalysisService, .getAll(), .save()]
- "services_currencyservice_currencyservice_formatdateforbcb": ".formatDateForBCB()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L61 | neighbors=[CurrencyService, .getCurrencyRate(), .getUsdBrl()]
- "services_currencyservice_currencyservice_getrates": ".getRates()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L143 | neighbors=[CurrencyService, .getCurrencyRate(), .getRatesWithFallback()]
- "services_currencyservice_currencyservice_getusdbrl": ".getUsdBrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L73 | neighbors=[CurrencyService, .getCurrencyRate(), .formatDateForBCB()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_getitems": ".getItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L116 | neighbors=[DocLibraryCatalogService, .buildPreviewUrl(), ._origin()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_mapmetadata": "._mapMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L165 | neighbors=[DocLibraryCatalogService, .updateMetadata(), .uploadFile()]
- "services_editcontrolservice_editcontrolservice_acquirelock": ".acquireLock()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L48 | neighbors=[EditControlService, .getLocks(), .saveLocks()]
- "services_editcontrolservice_editcontrolservice_releaseallforbid": ".releaseAllForBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L93 | neighbors=[EditControlService, .getLocks(), .saveLocks()]
- "services_editcontrolservice_editcontrolservice_releaselock": ".releaseLock()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L73 | neighbors=[EditControlService, .getLocks(), .saveLocks()]
- "services_ernservice_ernservice_create": ".create()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L102 | neighbors=[ErnService, .getByTitle(), .getNextErnNumber()]
- "services_ernservice_ernservice_getbytitle": ".getByTitle()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L53 | neighbors=[ErnService, .create(), .mapFromSP()]
- "services_favoritesservice_favoritesservice_addbidfavorite": ".addBidFavorite()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L88 | neighbors=[FavoritesService, .getAll(), .save()]
- "services_favoritesservice_favoritesservice_addequipment": ".addEquipment()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L66 | neighbors=[FavoritesService, .getAll(), .save()]
- "services_favoritesservice_favoritesservice_removebidfavorite": ".removeBidFavorite()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L98 | neighbors=[FavoritesService, .getAll(), .save()]
- "services_favoritesservice_favoritesservice_removeequipment": ".removeEquipment()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L73 | neighbors=[FavoritesService, .getAll(), .save()]
- "services_favoritesservice_favoritesservice_updateequipment": ".updateEquipment()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L80 | neighbors=[FavoritesService, .getAll(), .save()]
- "services_favoritesservice_favoritesservice_updategroups": ".updateGroups()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L105 | neighbors=[FavoritesService, .getAll(), .save()]
- "services_linksrecommendationsservice_linksrecommendationsservice_addlink": ".addLink()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L64 | neighbors=[LinksRecommendationsService, .getAll(), .save()]
- "services_linksrecommendationsservice_linksrecommendationsservice_addrecommendation": ".addRecommendation()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L84 | neighbors=[LinksRecommendationsService, .getAll(), .save()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-015.json

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
