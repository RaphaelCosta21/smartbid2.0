# Node Description Batch 15 of 43

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

- "function_app_function_app_context_lines": "_context_lines()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L295 | neighbors=[function_app.py, generate_scope(), BID metadata SmartBid sends with every …]
- "function_app_function_app_ensure_text": "ensure_text()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L151 | neighbors=[function_app.py, _document_text(), Guarantee plain text. If we only have p…]
- "function_app_function_app_retrieval_query": "_retrieval_query()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L315 | neighbors=[function_app.py, generate_scope(), Bias retrieval towards the BID's divisi…]
- "function_app_function_app_token_usage": "_token_usage()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L270 | neighbors=[function_app.py, generate_scope(), Input vs output tokens — the two behave…]
- "function_app_function_app_unreadable": "_unreadable()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L180 | neighbors=[function_app.py, extract_quotation(), generate_scope()]
- "gulpfile": "gulpfile.js" | kind=code-symbol | source=gulpfile.js:L1 | neighbors=[dbdc03a systemconfig online, fe3728a smartbid2.0, build]
- "hooks_useanalyticsfilters_presetrange": "presetRange()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L46 | neighbors=[useAnalyticsFilters.ts, isoDaysAgo(), todayStr()]
- "hooks_usecharttheme_categoricalcolor": "categoricalColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L101 | neighbors=[ErnDashboardSection.tsx, useChartTheme.ts, PeriodPerformancePage.tsx]
- "hooks_useresponsive_useresponsive": "useResponsive()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useResponsive.ts:L14 | neighbors=[ChatAssistant.tsx, useResponsive.ts, Header.tsx]
- "insights_aiinsightspanel_aiinsightspanel": "AIInsightsPanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AIInsightsPanel.tsx:L18 | neighbors=[AIInsightsPanel.tsx, BottleneckAnalysisPage.tsx, PerformanceTrendsPage.tsx]
- "knowledge_doclibrarycatalog_findgroupbyname": "findGroupByName()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L132 | neighbors=[DocLibraryCatalog.tsx, createFavoriteGroupAndSave(), mergeExtractedMetadata()]
- "knowledge_doclibrarycatalog_mergeextractedmetadata": "mergeExtractedMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L154 | neighbors=[DocLibraryCatalog.tsx, findGroupByName(), findSubGroupByName()]
- "layout_guestmodebanner": "GuestModeBanner.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/GuestModeBanner.tsx:L1 | neighbors=[fe3728a smartbid2.0, AppLayout.tsx, GuestModeBanner()]
- "loc_mystrings_d": "mystrings.d.ts" | kind=code-symbol | source=src/webparts/smartBid20/loc/mystrings.d.ts:L1 | neighbors=[fe3728a smartbid2.0, ISmartBid20WebPartStrings, SmartBid20WebPartStrings]
- "models_iaianalysis_aiusecase": "AIUseCase" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L9 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_iaianalysisrequest": "IAIAnalysisRequest" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L79 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_iaiassetcatalogoption": "IAIAssetCatalogOption" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L37 | neighbors=[AIDocumentAnalyzer.tsx, ai.prompts.ts, IAIAnalysis.ts]
- "models_iaianalysis_iaiimportmeta": "IAIImportMeta" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L137 | neighbors=[AIDocumentAnalyzer.tsx, IAIAnalysis.ts, index.ts]
- "models_iaianalysis_iextracteddocumentmetadata": "IExtractedDocumentMetadata" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L219 | neighbors=[DocLibraryCatalog.tsx, IAIAnalysis.ts, AIAnalysisService.ts]
- "models_iaianalysis_iextractedquotationline": "IExtractedQuotationLine" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L175 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_iquotationextractionresult": "IQuotationExtractionResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L207 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaichat_ichatanswer": "IChatAnswer" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAiChat.ts:L51 | neighbors=[IAiChat.ts, index.ts, AIAnalysisService.ts]
- "models_iaichat_ichatcitation": "IChatCitation" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAiChat.ts:L9 | neighbors=[IAiChat.ts, index.ts, AIAnalysisService.ts]
- "models_iaichat_ichatretrieveddoc": "IChatRetrievedDoc" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAiChat.ts:L27 | neighbors=[IAiChat.ts, index.ts, AIAnalysisService.ts]
- "models_iapprovalflow_iapprovalflow": "IApprovalFlow" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IApprovalFlow.ts:L25 | neighbors=[mockApprovals.ts, IApprovalFlow.ts, index.ts]
- "models_ibid_iapprovalround": "IApprovalRound" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L644 | neighbors=[ApprovalTab.tsx, IBid.ts, index.ts]
- "models_ibid_ibidapproval": "IBidApproval" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L617 | neighbors=[ApprovalTab.tsx, IBid.ts, index.ts]
- "models_ibid_iclarificationitem": "IClarificationItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L427 | neighbors=[IBid.ts, index.ts, aiClarificationMapper.ts]
- "models_ibid_ihourssummary": "IHoursSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L496 | neighbors=[IBid.ts, IBidTemplate.ts, index.ts]
- "models_ibidapproval_iapprovalsectorgroup": "IApprovalSectorGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidApproval.ts:L7 | neighbors=[ApprovalTab.tsx, IBidApproval.ts, ApprovalService.ts]
- "models_ibidopportunityinfo": "IBidOpportunityInfo.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidOpportunityInfo.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidOpportunityInfo, index.ts]
- "models_ibidstatus_bidsize": "BidSize" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L83 | neighbors=[IBid.ts, IBidStatus.ts, index.ts]
- "models_ibidstatus_ibidstatusdef": "IBidStatusDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L31 | neighbors=[status.config.ts, IBidStatus.ts, index.ts]
- "models_ibidstatus_iphasedef": "IPhaseDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L41 | neighbors=[status.config.ts, IBidStatus.ts, index.ts]
- "models_ibidstatus_isubstatusdef": "ISubStatusDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L64 | neighbors=[status.config.ts, IBidStatus.ts, index.ts]
- "models_iclarificationdb_clarificationbasetype": "ClarificationBaseType" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IClarificationDb.ts:L5 | neighbors=[IClarificationDb.ts, index.ts, ClarificationsDbPage.tsx]
- "models_idashboard_idashboarddata": "IDashboardData" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDashboard.ts:L31 | neighbors=[IDashboard.ts, index.ts, DashboardService.ts]
- "models_idashboard_idashboardkpi": "IDashboardKPI" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDashboard.ts:L4 | neighbors=[IDashboard.ts, index.ts, DashboardService.ts]
- "models_ieditlock": "IEditLock.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IEditLock.ts:L1 | neighbors=[c58a13c new-implementations, IEditLock, index.ts]
- "models_ifavoriteitem_ifavoritegroup": "IFavoriteGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IFavoriteItem.ts:L7 | neighbors=[IFavoriteItem.ts, index.ts, ISystemConfig.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-014.json

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
