# Node Description Batch 36 of 102

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

- "models_isupplier_isupplierprofile": "ISupplierProfile" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISupplier.ts:L37 | neighbors=[index.ts, ISupplier.ts, SupplierService.ts]
- "models_isurveycatalog_surveylinkkind": "SurveyLinkKind" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L170 | neighbors=[index.ts, ISurveyCatalog.ts, ISurveyGlossary.ts]
- "models_isystemconfig_accessareakey": "AccessAreaKey" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L50 | neighbors=[accessControl.config.ts, index.ts, ISystemConfig.ts]
- "models_isystemconfig_accesspermission": "AccessPermission" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L48 | neighbors=[accessControl.config.ts, index.ts, ISystemConfig.ts]
- "models_isystemconfig_iaccessleveldef": "IAccessLevelDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L66 | neighbors=[accessControl.config.ts, index.ts, ISystemConfig.ts]
- "models_isystemconfig_ibidaccessleveldef": "IBidAccessLevelDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L71 | neighbors=[accessControl.config.ts, index.ts, ISystemConfig.ts]
- "pages_bomcostspage_bomcostspage": "BomCostsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L178 | neighbors=[AppLayout.tsx, BomCostsPage.tsx, formatDateDMY()]
- "pages_clarificationsdbpage_clarificationsdbpage": "ClarificationsDbPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ClarificationsDbPage.tsx:L64 | neighbors=[AppLayout.tsx, ClarificationsDbPage.tsx, toDateInput()]
- "pages_followuppage_followuppage": "FollowUpPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FollowUpPage.tsx:L56 | neighbors=[AppLayout.tsx, FollowUpPage.tsx, isUndecided()]
- "pages_performancetrendspage_performancetrendspage": "PerformanceTrendsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PerformanceTrendsPage.tsx:L63 | neighbors=[AppLayout.tsx, PerformanceTrendsPage.tsx, lastDelta()]
- "pages_queryconsultingpage_queryconsultingpage": "QueryConsultingPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L380 | neighbors=[AppLayout.tsx, QueryConsultingPage.tsx, emptyTabData()]
- "pages_suppliersregistry_emptycontact": "emptyContact()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L37 | neighbors=[SuppliersRegistry.tsx, emptyForm(), formFromSupplier()]
- "pricehistory_bidrankingtab_bidrankingtab": "BidRankingTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/pricehistory/BidRankingTab.tsx:L67 | neighbors=[PriceHistoryPage.tsx, BidRankingTab.tsx, usd()]
- "pricehistory_historyitemcard_usd": "usd()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/pricehistory/HistoryItemCard.tsx:L53 | neighbors=[HistoryItemCard.tsx, CostBar(), HistoryItemCard()]
- "pricehistory_labortab_labortab": "LaborTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/pricehistory/LaborTab.tsx:L38 | neighbors=[PriceHistoryPage.tsx, LaborTab.tsx, average()]
- "reports_biddetailsreport": "BidDetailsReport.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/BidDetailsReport.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, BidDetailsReport()]
- "reports_operationalsummaryreport": "OperationalSummaryReport.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/OperationalSummaryReport.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, OperationalSummaryReport()]
- "reports_periodperformancereport": "PeriodPerformanceReport.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/PeriodPerformanceReport.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PeriodPerformanceReport()]
- "services_aianalysisservice_aianalysisservice_parseclarifications": ".parseClarifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L637 | neighbors=[AIAnalysisService, .suggestClarifications(), .validateResponse()]
- "services_aianalysisservice_aianalysisservice_parsewarnings": ".parseWarnings()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L1164 | neighbors=[AIAnalysisService, .suggestClarifications(), .suggestQualifications()]
- "services_aiauthservice_aiauthservice_acquireinteractive": ".acquireInteractive()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L277 | neighbors=[AiAuthService, .log(), .getAccessToken()]
- "services_aiauthservice_aiauthservice_cleartokencache": ".clearTokenCache()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L331 | neighbors=[AiAuthService, .getApp(), .log()]
- "services_aiauthservice_aiauthservice_isconfigured": ".isConfigured()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L95 | neighbors=[AiAuthService, .getApp(), .warmUp()]
- "services_bidservice_bidservice_parse": "._parse()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L113 | neighbors=[BidService, .getByBidNumber(), .getById()]
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
- "services_doclibrarycatalogservice_doclibrarycatalogservice_vroomget": "._vroomGet()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L70 | neighbors=[DocLibraryCatalogService, ._getDriveId(), .getThumbnailUrls()]
- "services_easimodulesadapter_easimodulesadapter_getcostelementsraw": ".getCostElementsRaw()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L146 | neighbors=[EasiModulesAdapter, ._bids(), ._costRows()]
- "services_easimodulesadapter_easimodulesadapter_getopportunitiesraw": ".getOpportunitiesRaw()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L150 | neighbors=[EasiModulesAdapter, ._bids(), ._opportunityRows()]
- "services_easimodulesadapter_easimodulesadapter_opportunityrows": "._opportunityRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L90 | neighbors=[EasiModulesAdapter, .getBenchmarkDataset(), .getOpportunitiesRaw()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-035.json

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
