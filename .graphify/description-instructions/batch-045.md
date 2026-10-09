# Node Description Batch 46 of 86

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

- "services_activitylogservice_activitylogservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ActivityLogService.ts:L16 | neighbors=[ActivityLogService, .addEntry()]
- "services_aianalysisservice_aianalysisservice_describehttperror": ".describeHttpError()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L418 | neighbors=[AIAnalysisService, .postJson()]
- "services_aianalysisservice_aianalysisservice_filetobase64": ".fileToBase64()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L233 | neighbors=[AIAnalysisService, .buildRequest()]
- "services_aianalysisservice_aianalysisservice_parsechatcitations": ".parseChatCitations()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L514 | neighbors=[AIAnalysisService, .parseChatAnswer()]
- "services_aianalysisservice_aianalysisservice_parsechatfollowups": ".parseChatFollowUps()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L533 | neighbors=[AIAnalysisService, .parseChatAnswer()]
- "services_aianalysisservice_aianalysisservice_parsechatretrieved": ".parseChatRetrieved()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L544 | neighbors=[AIAnalysisService, .parseChatAnswer()]
- "services_aianalysisservice_aianalysisservice_parsequalifications": ".parseQualifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L1169 | neighbors=[AIAnalysisService, .suggestQualifications()]
- "services_aianalysisservice_aianalysisservice_spreadsheettotext": ".spreadsheetToText()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L772 | neighbors=[AIAnalysisService, .extractQuotation()]
- "services_aianalysisservice_aianalysisservice_validatedocumentmetadataresult": ".validateDocumentMetadataResult()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L819 | neighbors=[AIAnalysisService, .extractDocumentMetadata()]
- "services_aianalysisservice_aianalysisservice_validatequotationresult": ".validateQuotationResult()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L662 | neighbors=[AIAnalysisService, .extractQuotation()]
- "services_aianalysisservice_aianalysisservice_withabort": ".withAbort()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L261 | neighbors=[AIAnalysisService, .postJson()]
- "services_aiauthservice_aiauthservice_getauthority": ".getAuthority()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L112 | neighbors=[AiAuthService, .getApp()]
- "services_aiauthservice_aiauthservice_getredirecturi": ".getRedirectUri()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L126 | neighbors=[AiAuthService, .getApp()]
- "services_approvalservice_approvalservice_markroundoverridden": ".markRoundOverridden()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L317 | neighbors=[ApprovalService, .ensureApprovalColumns()]
- "services_approvalservice_approvalservice_startapprovalround": ".startApprovalRound()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L256 | neighbors=[ApprovalService, .ensureApprovalColumns()]
- "services_assetcatalogservice_assetcatalogservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AssetCatalogService.ts:L10 | neighbors=[AssetCatalogService, .mapFromSP()]
- "services_assetcatalogservice_assetcatalogservice_mapfromsp": ".mapFromSP()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AssetCatalogService.ts:L59 | neighbors=[AssetCatalogService, .getAll()]
- "services_bidservice_bidservice_delete": ".delete()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L174 | neighbors=[BidService, .getById()]
- "services_bidservice_bidservice_getbybidnumber": ".getByBidNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L117 | neighbors=[BidService, ._parse()]
- "services_bidservice_bidservice_getpatchversion": ".getPatchVersion()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L232 | neighbors=[BidService, .patchByBidNumber()]
- "services_bidservice_bidservice_provisioncolumns": "._provisionColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L47 | neighbors=[BidService, .ensureColumns()]
- "services_bidservice_bidservice_recalculatecostsummaries": ".recalculateCostSummaries()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L249 | neighbors=[BidService, .patchByBidNumber()]
- "services_clarificationdbservice_clarificationdbservice_addmany": ".addMany()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L104 | neighbors=[ClarificationDbService, ._mapToSP()]
- "services_clarificationdbservice_clarificationdbservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L157 | neighbors=[ClarificationDbService, ._columns()]
- "services_clarificationdbservice_clarificationdbservice_provisioncolumns": "._provisionColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L55 | neighbors=[ClarificationDbService, .ensureColumns()]
- "services_clarificationdbservice_iclarificationsyncresult": "IClarificationSyncResult" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L25 | neighbors=[ClarificationDbService.ts, QualificationDbService.ts]
- "services_clarificationknowledgeservice_clarificationknowledgeservice_ensurecolumns": "._ensureColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationKnowledgeService.ts:L114 | neighbors=[ClarificationKnowledgeService, .publish()]
- "services_clarificationknowledgeservice_clarificationknowledgeservice_start": "._start()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationKnowledgeService.ts:L57 | neighbors=[ClarificationKnowledgeService, .publish()]
- "services_currencyservice_currencyservice_getrateswithfallback": ".getRatesWithFallback()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L161 | neighbors=[CurrencyService, .getRates()]
- "services_dashboardservice_dashboardservice_calculatedivisionworkloads": ".calculateDivisionWorkloads()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L114 | neighbors=[DashboardService, .buildDashboardData()]
- "services_dashboardservice_dashboardservice_calculatekpis": ".calculateKPIs()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L18 | neighbors=[DashboardService, .buildDashboardData()]
- "services_dashboardservice_dashboardservice_calculatemonthlyvolumes": ".calculateMonthlyVolumes()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L92 | neighbors=[DashboardService, .buildDashboardData()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_buildpreviewurl": ".buildPreviewUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L143 | neighbors=[DocLibraryCatalogService, .getItems()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_createfolderifmissing": "._createFolderIfMissing()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L51 | neighbors=[DocLibraryCatalogService, .ensureFolder()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_ensurefolder": ".ensureFolder()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L36 | neighbors=[DocLibraryCatalogService, ._createFolderIfMissing()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_origin": "._origin()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L63 | neighbors=[DocLibraryCatalogService, .getItems()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_updatemetadata": ".updateMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L291 | neighbors=[DocLibraryCatalogService, ._mapMetadata()]
- "services_doclibrarycatalogservice_doclibrarycatalogservice_uploadfile": ".uploadFile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L301 | neighbors=[DocLibraryCatalogService, ._mapMetadata()]
- "services_easimodulesadapter_derivetyperaw": "deriveTypeRaw()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L28 | neighbors=[EasiModulesAdapter.ts, ._costRows()]
- "services_easimodulesadapter_easimodulesadapter_laborrows": "._laborRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L108 | neighbors=[EasiModulesAdapter, .getBenchmarkDataset()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-045.json

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
