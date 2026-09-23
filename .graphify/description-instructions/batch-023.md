# Node Description Batch 24 of 43

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

- "pages_flowboardpage_flowboardpage": "FlowBoardPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FlowBoardPage.tsx:L12 | neighbors=[AppLayout.tsx, FlowBoardPage.tsx]
- "pages_followuppage_followuppage": "FollowUpPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FollowUpPage.tsx:L42 | neighbors=[AppLayout.tsx, FollowUpPage.tsx]
- "pages_linksrecommendationspage_linksrecommendationspage": "LinksRecommendationsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/LinksRecommendationsPage.tsx:L14 | neighbors=[AppLayout.tsx, LinksRecommendationsPage.tsx]
- "pages_manualscatalogspage_manualscatalogspage": "ManualsCatalogsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ManualsCatalogsPage.tsx:L9 | neighbors=[AppLayout.tsx, ManualsCatalogsPage.tsx]
- "pages_memberspage_memberspage": "MembersPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/MembersPage.tsx:L8 | neighbors=[AppLayout.tsx, MembersPage.tsx]
- "pages_notificationspage_notificationspage": "NotificationsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/NotificationsPage.tsx:L19 | neighbors=[AppLayout.tsx, NotificationsPage.tsx]
- "pages_operationalsummarypage_operationalsummarypage": "OperationalSummaryPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/OperationalSummaryPage.tsx:L40 | neighbors=[AppLayout.tsx, OperationalSummaryPage.tsx]
- "pages_patchnotespage_patchnotespage": "PatchNotesPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PatchNotesPage.tsx:L6 | neighbors=[AppLayout.tsx, PatchNotesPage.tsx]
- "pages_performancetrendspage_lastdelta": "lastDelta()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PerformanceTrendsPage.tsx:L57 | neighbors=[PerformanceTrendsPage.tsx, PerformanceTrendsPage()]
- "pages_periodperformancepage_periodperformancepage": "PeriodPerformancePage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PeriodPerformancePage.tsx:L65 | neighbors=[AppLayout.tsx, PeriodPerformancePage.tsx]
- "pages_queryconsultingpage_applyallfilters": "applyAllFilters()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L185 | neighbors=[QueryConsultingPage.tsx, matchTokens()]
- "pages_queryconsultingpage_applymultiplefilters": "applyMultipleFilters()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L210 | neighbors=[QueryConsultingPage.tsx, matchTokens()]
- "pages_queryconsultingpage_emptytabdata": "emptyTabData()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L56 | neighbors=[QueryConsultingPage.tsx, QueryConsultingPage()]
- "pages_quotationspage_blanklineitem": "blankLineItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QuotationsPage.tsx:L28 | neighbors=[QuotationsPage.tsx, genId()]
- "pages_quotationspage_genid": "genId()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QuotationsPage.tsx:L23 | neighbors=[QuotationsPage.tsx, blankLineItem()]
- "pages_quotationspage_quotationspage": "QuotationsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QuotationsPage.tsx:L205 | neighbors=[AppLayout.tsx, QuotationsPage.tsx]
- "pages_reportspage_reportspage": "ReportsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ReportsPage.tsx:L25 | neighbors=[AppLayout.tsx, ReportsPage.tsx]
- "pages_systemconfigpage_systemconfigpage": "SystemConfigPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SystemConfigPage.tsx:L8 | neighbors=[AppLayout.tsx, SystemConfigPage.tsx]
- "pages_teamanalyticspage_teamanalyticspage": "TeamAnalyticsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L61 | neighbors=[AppLayout.tsx, TeamAnalyticsPage.tsx]
- "pages_technicalproposalspage_technicalproposalspage": "TechnicalProposalsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TechnicalProposalsPage.tsx:L27 | neighbors=[AppLayout.tsx, TechnicalProposalsPage.tsx]
- "pages_templatespage_templatespage": "TemplatesPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L18 | neighbors=[AppLayout.tsx, TemplatesPage.tsx]
- "pages_timelinepage_timelinepage": "TimelinePage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L12 | neighbors=[AppLayout.tsx, TimelinePage.tsx]
- "pages_toolingreportpage_toolingreportpage": "ToolingReportPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ToolingReportPage.tsx:L19 | neighbors=[AppLayout.tsx, ToolingReportPage.tsx]
- "pages_unassignedrequestspage_unassignedrequestspage": "UnassignedRequestsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L62 | neighbors=[AppLayout.tsx, UnassignedRequestsPage.tsx]
- "services_activitylogservice_activitylogservice_addentry": ".addEntry()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ActivityLogService.ts:L31 | neighbors=[ActivityLogService, .getAll()]
- "services_activitylogservice_activitylogservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ActivityLogService.ts:L16 | neighbors=[ActivityLogService, .addEntry()]
- "services_aianalysisservice_aianalysisservice_describehttperror": ".describeHttpError()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L382 | neighbors=[AIAnalysisService, .postJson()]
- "services_aianalysisservice_aianalysisservice_filetobase64": ".fileToBase64()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L214 | neighbors=[AIAnalysisService, .buildRequest()]
- "services_aianalysisservice_aianalysisservice_parsechatcitations": ".parseChatCitations()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L475 | neighbors=[AIAnalysisService, .parseChatAnswer()]
- "services_aianalysisservice_aianalysisservice_parsechatfollowups": ".parseChatFollowUps()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L494 | neighbors=[AIAnalysisService, .parseChatAnswer()]
- "services_aianalysisservice_aianalysisservice_parsechatretrieved": ".parseChatRetrieved()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L505 | neighbors=[AIAnalysisService, .parseChatAnswer()]
- "services_aianalysisservice_aianalysisservice_parseclarifications": ".parseClarifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L590 | neighbors=[AIAnalysisService, .validateResponse()]
- "services_aianalysisservice_aianalysisservice_validatedocumentmetadataresult": ".validateDocumentMetadataResult()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L732 | neighbors=[AIAnalysisService, .extractDocumentMetadata()]
- "services_aianalysisservice_aianalysisservice_validatequotationresult": ".validateQuotationResult()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L615 | neighbors=[AIAnalysisService, .extractQuotation()]
- "services_aianalysisservice_aianalysisservice_withabort": ".withAbort()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L242 | neighbors=[AIAnalysisService, .postJson()]
- "services_aiauthservice_aiauthservice_getauthority": ".getAuthority()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L112 | neighbors=[AiAuthService, .getApp()]
- "services_aiauthservice_aiauthservice_getredirecturi": ".getRedirectUri()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L126 | neighbors=[AiAuthService, .getApp()]
- "services_approvalservice_approvalservice_ensureapprovalcolumns": ".ensureApprovalColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L26 | neighbors=[ApprovalService, .startApprovalRound()]
- "services_approvalservice_approvalservice_startapprovalround": ".startApprovalRound()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L195 | neighbors=[ApprovalService, .ensureApprovalColumns()]
- "services_assetcatalogservice_assetcatalogservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AssetCatalogService.ts:L10 | neighbors=[AssetCatalogService, .mapFromSP()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-023.json

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
