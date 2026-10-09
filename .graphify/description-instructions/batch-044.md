# Node Description Batch 45 of 86

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

- "pages_favoritespage_ifavoritebidrow": "IFavoriteBidRow" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L47 | neighbors=[FavoritesPage.tsx, IPastBidRow]
- "pages_flowboardpage_flowboardpage": "FlowBoardPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FlowBoardPage.tsx:L14 | neighbors=[AppLayout.tsx, FlowBoardPage.tsx]
- "pages_followuppage_isundecided": "isUndecided()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FollowUpPage.tsx:L50 | neighbors=[FollowUpPage.tsx, FollowUpPage()]
- "pages_linksrecommendationspage_linksrecommendationspage": "LinksRecommendationsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/LinksRecommendationsPage.tsx:L14 | neighbors=[AppLayout.tsx, LinksRecommendationsPage.tsx]
- "pages_manualscatalogspage_manualscatalogspage": "ManualsCatalogsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ManualsCatalogsPage.tsx:L8 | neighbors=[AppLayout.tsx, ManualsCatalogsPage.tsx]
- "pages_memberspage_memberspage": "MembersPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/MembersPage.tsx:L8 | neighbors=[AppLayout.tsx, MembersPage.tsx]
- "pages_notificationspage_notificationspage": "NotificationsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/NotificationsPage.tsx:L19 | neighbors=[AppLayout.tsx, NotificationsPage.tsx]
- "pages_operationalsummarypage_operationalsummarypage": "OperationalSummaryPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/OperationalSummaryPage.tsx:L49 | neighbors=[AppLayout.tsx, OperationalSummaryPage.tsx]
- "pages_pastbidspage_pastbidspage": "PastBidsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PastBidsPage.tsx:L81 | neighbors=[AppLayout.tsx, PastBidsPage.tsx]
- "pages_patchnotespage_patchnotespage": "PatchNotesPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PatchNotesPage.tsx:L6 | neighbors=[AppLayout.tsx, PatchNotesPage.tsx]
- "pages_performancetrendspage_lastdelta": "lastDelta()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PerformanceTrendsPage.tsx:L58 | neighbors=[PerformanceTrendsPage.tsx, PerformanceTrendsPage()]
- "pages_periodperformancepage_periodperformancepage": "PeriodPerformancePage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PeriodPerformancePage.tsx:L66 | neighbors=[AppLayout.tsx, PeriodPerformancePage.tsx]
- "pages_queryconsultingpage_applyallfilters": "applyAllFilters()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L185 | neighbors=[QueryConsultingPage.tsx, matchTokens()]
- "pages_queryconsultingpage_applymultiplefilters": "applyMultipleFilters()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L210 | neighbors=[QueryConsultingPage.tsx, matchTokens()]
- "pages_queryconsultingpage_emptytabdata": "emptyTabData()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L90 | neighbors=[QueryConsultingPage.tsx, QueryConsultingPage()]
- "pages_queryconsultingpage_filterviewrows": "filterViewRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L227 | neighbors=[QueryConsultingPage.tsx, matchTokens()]
- "pages_quotationspage_blanklineitem": "blankLineItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QuotationsPage.tsx:L39 | neighbors=[QuotationsPage.tsx, genId()]
- "pages_quotationspage_genid": "genId()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QuotationsPage.tsx:L34 | neighbors=[QuotationsPage.tsx, blankLineItem()]
- "pages_quotationspage_quotationspage": "QuotationsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QuotationsPage.tsx:L216 | neighbors=[AppLayout.tsx, QuotationsPage.tsx]
- "pages_reportspage_reportspage": "ReportsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ReportsPage.tsx:L25 | neighbors=[AppLayout.tsx, ReportsPage.tsx]
- "pages_suppliersregistry_emptyform": "emptyForm()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L56 | neighbors=[SuppliersRegistry.tsx, emptyContact()]
- "pages_suppliersregistry_formfromsupplier": "formFromSupplier()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L69 | neighbors=[SuppliersRegistry.tsx, emptyContact()]
- "pages_suppliersregistry_initials": "initials()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L161 | neighbors=[SuppliersRegistry.tsx, SupplierLogo()]
- "pages_suppliersregistry_supplierlogo": "SupplierLogo()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L169 | neighbors=[SuppliersRegistry.tsx, initials()]
- "pages_suppliersregistry_suppliersregistry": "SuppliersRegistry()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L183 | neighbors=[EasiSuppliersPage.tsx, SuppliersRegistry.tsx]
- "pages_surveyequipmentpage_surveyequipmentpage": "SurveyEquipmentPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SurveyEquipmentPage.tsx:L20 | neighbors=[AppLayout.tsx, SurveyEquipmentPage.tsx]
- "pages_surveysystempage_surveysystempage": "SurveySystemPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SurveySystemPage.tsx:L87 | neighbors=[AppLayout.tsx, SurveySystemPage.tsx]
- "pages_systemconfigpage_systemconfigpage": "SystemConfigPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SystemConfigPage.tsx:L8 | neighbors=[AppLayout.tsx, SystemConfigPage.tsx]
- "pages_teamanalyticspage_teamanalyticspage": "TeamAnalyticsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L61 | neighbors=[AppLayout.tsx, TeamAnalyticsPage.tsx]
- "pages_technicalproposalspage_technicalproposalspage": "TechnicalProposalsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TechnicalProposalsPage.tsx:L23 | neighbors=[AppLayout.tsx, TechnicalProposalsPage.tsx]
- "pages_templatespage_templatespage": "TemplatesPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L44 | neighbors=[AppLayout.tsx, TemplatesPage.tsx]
- "pages_timelinepage_timelinepage": "TimelinePage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L166 | neighbors=[AppLayout.tsx, TimelinePage.tsx]
- "pages_toolingreportpage_toolingreportpage": "ToolingReportPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ToolingReportPage.tsx:L19 | neighbors=[AppLayout.tsx, ToolingReportPage.tsx]
- "pages_unassignedrequestspage_unassignedrequestspage": "UnassignedRequestsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L99 | neighbors=[AppLayout.tsx, UnassignedRequestsPage.tsx]
- "peoplesoft_howitworksdrawer_howitworksdrawer": "HowItWorksDrawer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/peoplesoft/HowItWorksDrawer.tsx:L97 | neighbors=[QueryConsultingPage.tsx, HowItWorksDrawer.tsx]
- "peoplesoft_howitworksdrawer_languageswitch": "LanguageSwitch()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/peoplesoft/HowItWorksDrawer.tsx:L60 | neighbors=[QueryConsultingPage.tsx, HowItWorksDrawer.tsx]
- "reports_approvaldueimpactsection_approvaldueimpactsection": "ApprovalDueImpactSection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ApprovalDueImpactSection.tsx:L55 | neighbors=[OperationalSummaryPage.tsx, ApprovalDueImpactSection.tsx]
- "services_accesslogservice_accesslogservice_ensurelist": ".ensureList()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AccessLogService.ts:L26 | neighbors=[AccessLogService, isNotFound()]
- "services_accesslogservice_isnotfound": "isNotFound()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AccessLogService.ts:L17 | neighbors=[AccessLogService.ts, .ensureList()]
- "services_activitylogservice_activitylogservice_addentry": ".addEntry()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ActivityLogService.ts:L31 | neighbors=[ActivityLogService, .getAll()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-044.json

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
