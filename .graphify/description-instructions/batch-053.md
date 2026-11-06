# Node Description Batch 54 of 102

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

- "pages_unassignedrequestspage_unassignedrequestspage": "UnassignedRequestsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L103 | neighbors=[AppLayout.tsx, UnassignedRequestsPage.tsx]
- "peoplesoft_howitworksdrawer_howitworksdrawer": "HowItWorksDrawer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/peoplesoft/HowItWorksDrawer.tsx:L97 | neighbors=[QueryConsultingPage.tsx, HowItWorksDrawer.tsx]
- "peoplesoft_howitworksdrawer_languageswitch": "LanguageSwitch()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/peoplesoft/HowItWorksDrawer.tsx:L60 | neighbors=[QueryConsultingPage.tsx, HowItWorksDrawer.tsx]
- "pricehistory_bidrankingtab_usd": "usd()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/pricehistory/BidRankingTab.tsx:L36 | neighbors=[BidRankingTab.tsx, BidRankingTab()]
- "pricehistory_historyitemcard_costbar": "CostBar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/pricehistory/HistoryItemCard.tsx:L76 | neighbors=[HistoryItemCard.tsx, usd()]
- "pricehistory_historyitemcard_divergencetoken": "divergenceToken()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/pricehistory/HistoryItemCard.tsx:L58 | neighbors=[HistoryItemCard.tsx, HistoryItemCard()]
- "pricehistory_itemhistorytab_itemhistorytab": "ItemHistoryTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/pricehistory/ItemHistoryTab.tsx:L269 | neighbors=[PriceHistoryPage.tsx, ItemHistoryTab.tsx]
- "pricehistory_labortab_average": "average()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/pricehistory/LaborTab.tsx:L30 | neighbors=[LaborTab.tsx, LaborTab()]
- "reports_approvaldueimpactsection_approvaldueimpactsection": "ApprovalDueImpactSection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ApprovalDueImpactSection.tsx:L55 | neighbors=[OperationalSummaryPage.tsx, ApprovalDueImpactSection.tsx]
- "services_accesslogservice_accesslogservice_ensurelist": ".ensureList()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AccessLogService.ts:L26 | neighbors=[AccessLogService, isNotFound()]
- "services_accesslogservice_isnotfound": "isNotFound()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AccessLogService.ts:L17 | neighbors=[AccessLogService.ts, .ensureList()]
- "services_activitylogservice_activitylogservice_addentry": ".addEntry()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ActivityLogService.ts:L31 | neighbors=[ActivityLogService, .getAll()]
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
- "services_approvalservice_approvalservice_markroundoverridden": ".markRoundOverridden()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L341 | neighbors=[ApprovalService, .ensureApprovalColumns()]
- "services_approvalservice_approvalservice_markroundscancelled": ".markRoundsCancelled()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L370 | neighbors=[ApprovalService, .ensureApprovalColumns()]
- "services_approvalservice_approvalservice_startapprovalround": ".startApprovalRound()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L272 | neighbors=[ApprovalService, .ensureApprovalColumns()]
- "services_assetcatalogservice_assetcatalogservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AssetCatalogService.ts:L10 | neighbors=[AssetCatalogService, .mapFromSP()]
- "services_assetcatalogservice_assetcatalogservice_mapfromsp": ".mapFromSP()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AssetCatalogService.ts:L59 | neighbors=[AssetCatalogService, .getAll()]
- "services_bidservice_bidservice_delete": ".delete()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L181 | neighbors=[BidService, .getById()]
- "services_bidservice_bidservice_getbybidnumber": ".getByBidNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L124 | neighbors=[BidService, ._parse()]
- "services_bidservice_bidservice_getpatchversion": ".getPatchVersion()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L239 | neighbors=[BidService, .patchByBidNumber()]
- "services_bidservice_bidservice_provisioncolumns": "._provisionColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L54 | neighbors=[BidService, .ensureColumns()]
- "services_bidservice_bidservice_recalculatecostsummaries": ".recalculateCostSummaries()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L256 | neighbors=[BidService, .patchByBidNumber()]
- "services_clarificationdbservice_clarificationdbservice_addmany": ".addMany()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L104 | neighbors=[ClarificationDbService, ._mapToSP()]
- "services_clarificationdbservice_clarificationdbservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L157 | neighbors=[ClarificationDbService, ._columns()]
- "services_clarificationdbservice_clarificationdbservice_provisioncolumns": "._provisionColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L55 | neighbors=[ClarificationDbService, .ensureColumns()]
- "services_clarificationdbservice_iclarificationsyncresult": "IClarificationSyncResult" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L25 | neighbors=[ClarificationDbService.ts, QualificationDbService.ts]
- "services_clarificationknowledgeservice_clarificationknowledgeservice_ensurecolumns": "._ensureColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationKnowledgeService.ts:L114 | neighbors=[ClarificationKnowledgeService, .publish()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-053.json

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
