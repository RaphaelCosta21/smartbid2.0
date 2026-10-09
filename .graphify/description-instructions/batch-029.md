# Node Description Batch 30 of 86

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

- "models_iaichat_ipastbidchatcontext": "IPastBidChatContext" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAiChat.ts:L60 | neighbors=[IAiChat.ts, AIAnalysisService.ts, pastBidLedger.ts]
- "models_iapprovalflow_iapprovalflow": "IApprovalFlow" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IApprovalFlow.ts:L25 | neighbors=[mockApprovals.ts, IApprovalFlow.ts, index.ts]
- "models_ibid_iactivitylogentry": "IActivityLogEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L778 | neighbors=[ApprovalTab.tsx, IBid.ts, index.ts]
- "models_ibid_iapprovalround": "IApprovalRound" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L718 | neighbors=[ApprovalTab.tsx, IBid.ts, index.ts]
- "models_ibid_ibidapproval": "IBidApproval" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L662 | neighbors=[ApprovalTab.tsx, IBid.ts, index.ts]
- "models_ibid_iclarificationitem": "IClarificationItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L458 | neighbors=[IBid.ts, index.ts, aiClarificationMapper.ts]
- "models_ibid_ihourssummary": "IHoursSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L539 | neighbors=[IBid.ts, IBidTemplate.ts, index.ts]
- "models_ibid_iqualificationitem": "IQualificationItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L442 | neighbors=[IBid.ts, index.ts, qualificationHelpers.ts]
- "models_ibidapproval_iapprovalsectorgroup": "IApprovalSectorGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidApproval.ts:L7 | neighbors=[ApprovalTab.tsx, IBidApproval.ts, ApprovalService.ts]
- "models_ibidopportunityinfo": "IBidOpportunityInfo.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidOpportunityInfo.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidOpportunityInfo, index.ts]
- "models_ibidstatus_bidsize": "BidSize" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L84 | neighbors=[IBid.ts, IBidStatus.ts, index.ts]
- "models_ibidstatus_ibidstatusdef": "IBidStatusDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L31 | neighbors=[status.config.ts, IBidStatus.ts, index.ts]
- "models_ibidstatus_iphasedef": "IPhaseDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L41 | neighbors=[status.config.ts, IBidStatus.ts, index.ts]
- "models_ibidstatus_isubstatusdef": "ISubStatusDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L65 | neighbors=[status.config.ts, IBidStatus.ts, index.ts]
- "models_idashboard_idashboarddata": "IDashboardData" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDashboard.ts:L31 | neighbors=[IDashboard.ts, index.ts, DashboardService.ts]
- "models_idashboard_idashboardkpi": "IDashboardKPI" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDashboard.ts:L4 | neighbors=[IDashboard.ts, index.ts, DashboardService.ts]
- "models_ieditlock": "IEditLock.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IEditLock.ts:L1 | neighbors=[c58a13c new-implementations, IEditLock, index.ts]
- "models_ifavoriteitem_ifavoritegroup": "IFavoriteGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IFavoriteItem.ts:L7 | neighbors=[IFavoriteItem.ts, index.ts, ISystemConfig.ts]
- "models_ilinksrecommendations_ilinksrecommendationsdata": "ILinksRecommendationsData" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ILinksRecommendations.ts:L24 | neighbors=[ILinksRecommendations.ts, index.ts, LinksRecommendationsService.ts]
- "models_inotification": "INotification.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/INotification.ts:L1 | neighbors=[fe3728a smartbid2.0, index.ts, INotification]
- "models_iquerycatalog_ifinancialsactiveregisteredtab": "IFinancialsActiveRegisteredTab" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L125 | neighbors=[index.ts, IQueryCatalog.ts, IRawTabData]
- "models_iquerycatalog_irawtabdata": "IRawTabData" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L102 | neighbors=[index.ts, IQueryCatalog.ts, IFinancialsActiveRegisteredTab]
- "models_isupplier_isupplier": "ISupplier" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISupplier.ts:L13 | neighbors=[index.ts, ISupplier.ts, SupplierService.ts]
- "models_isupplier_isuppliercontact": "ISupplierContact" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISupplier.ts:L7 | neighbors=[index.ts, ISupplier.ts, SupplierService.ts]
- "models_isupplier_isupplierinput": "ISupplierInput" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISupplier.ts:L34 | neighbors=[index.ts, ISupplier.ts, SupplierService.ts]
- "models_isupplier_isupplierprofile": "ISupplierProfile" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISupplier.ts:L37 | neighbors=[index.ts, ISupplier.ts, SupplierService.ts]
- "models_isystemconfig_accessareakey": "AccessAreaKey" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L50 | neighbors=[accessControl.config.ts, index.ts, ISystemConfig.ts]
- "models_isystemconfig_accesspermission": "AccessPermission" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L48 | neighbors=[accessControl.config.ts, index.ts, ISystemConfig.ts]
- "models_isystemconfig_iaccessleveldef": "IAccessLevelDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L66 | neighbors=[accessControl.config.ts, index.ts, ISystemConfig.ts]
- "models_isystemconfig_ibidaccessleveldef": "IBidAccessLevelDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L71 | neighbors=[accessControl.config.ts, index.ts, ISystemConfig.ts]
- "models_iuser_businessline": "BusinessLine" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L10 | neighbors=[index.ts, ITeamMember.ts, IUser.ts]
- "pages_bomcostspage_bomcostspage": "BomCostsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L302 | neighbors=[AppLayout.tsx, BomCostsPage.tsx, formatDateDMY()]
- "pages_clarificationsdbpage_clarificationsdbpage": "ClarificationsDbPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ClarificationsDbPage.tsx:L64 | neighbors=[AppLayout.tsx, ClarificationsDbPage.tsx, toDateInput()]
- "pages_followuppage_followuppage": "FollowUpPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FollowUpPage.tsx:L56 | neighbors=[AppLayout.tsx, FollowUpPage.tsx, isUndecided()]
- "pages_performancetrendspage_performancetrendspage": "PerformanceTrendsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PerformanceTrendsPage.tsx:L63 | neighbors=[AppLayout.tsx, PerformanceTrendsPage.tsx, lastDelta()]
- "pages_queryconsultingpage_queryconsultingpage": "QueryConsultingPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L380 | neighbors=[AppLayout.tsx, QueryConsultingPage.tsx, emptyTabData()]
- "pages_suppliersregistry_emptycontact": "emptyContact()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L37 | neighbors=[SuppliersRegistry.tsx, emptyForm(), formFromSupplier()]
- "reports_biddetailsreport": "BidDetailsReport.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/BidDetailsReport.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, BidDetailsReport()]
- "reports_operationalsummaryreport": "OperationalSummaryReport.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/OperationalSummaryReport.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, OperationalSummaryReport()]
- "reports_periodperformancereport": "PeriodPerformanceReport.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/PeriodPerformanceReport.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PeriodPerformanceReport()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-029.json

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
