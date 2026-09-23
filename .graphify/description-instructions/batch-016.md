# Node Description Batch 17 of 43

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

- "services_linksrecommendationsservice_linksrecommendationsservice_removelink": ".removeLink()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L77 | neighbors=[LinksRecommendationsService, .getAll(), .save()]
- "services_linksrecommendationsservice_linksrecommendationsservice_removerecommendation": ".removeRecommendation()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L101 | neighbors=[LinksRecommendationsService, .getAll(), .save()]
- "services_linksrecommendationsservice_linksrecommendationsservice_updatelink": ".updateLink()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L70 | neighbors=[LinksRecommendationsService, .getAll(), .save()]
- "services_linksrecommendationsservice_linksrecommendationsservice_updaterecommendation": ".updateRecommendation()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L92 | neighbors=[LinksRecommendationsService, .getAll(), .save()]
- "services_membersservice_membersservice_addmember": ".addMember()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L66 | neighbors=[MembersService, .getAll(), .save()]
- "services_membersservice_membersservice_removemember": ".removeMember()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L81 | neighbors=[MembersService, .getAll(), .save()]
- "services_membersservice_membersservice_updatemember": ".updateMember()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L72 | neighbors=[MembersService, .getAll(), .save()]
- "services_quotationservice_quotationservice_additems": ".addItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L241 | neighbors=[QuotationService, .ensureColumns(), ._toRow()]
- "services_quotationservice_quotationservice_findrowid": "._findRowId()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L155 | neighbors=[QuotationService, .deleteItem(), .updateItem()]
- "services_templateservice_templateservice_getbyid": ".getById()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L81 | neighbors=[TemplateService, .deleteTemplate(), .update()]
- "services_templateservice_templateservice_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L112 | neighbors=[TemplateService, .create(), .getById()]
- "settings_approvalrulesconfig": "ApprovalRulesConfig.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/ApprovalRulesConfig.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ApprovalRulesConfig()]
- "stores_usenotificationstore_usenotificationstore": "useNotificationStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useNotificationStore.ts:L16 | neighbors=[Header.tsx, NotificationsPage.tsx, useNotificationStore.ts]
- "stores_userequeststore_userequeststore": "useRequestStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useRequestStore.ts:L18 | neighbors=[useRequests.ts, CreateRequestPage.tsx, useRequestStore.ts]
- "stores_usetemplatestore_usetemplatestore": "useTemplateStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useTemplateStore.ts:L25 | neighbors=[ImportSourceModal.tsx, useTemplates.ts, useTemplateStore.ts]
- "utils_accesscontrol_canmanageern": "canManageErn()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L122 | neighbors=[OverviewTab.tsx, accessControl.ts, isSuperAdmin()]
- "utils_activityloghelpers_createactivitylogentry": "createActivityLogEntry()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/activityLogHelpers.ts:L7 | neighbors=[DocumentsTab.tsx, OverviewTab.tsx, activityLogHelpers.ts]
- "utils_aiclarificationmapper_mapsuggestedclarification": "mapSuggestedClarification()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiClarificationMapper.ts:L10 | neighbors=[QualificationsTab.tsx, BidDetailPage.tsx, aiClarificationMapper.ts]
- "utils_aicontext_buildaicontext": "buildAiContext()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiContext.ts:L11 | neighbors=[AITab.tsx, QualificationsTab.tsx, aiContext.ts]
- "utils_aiquotationmapper_resolvequotationgroup": "resolveQuotationGroup()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiQuotationMapper.ts:L42 | neighbors=[aiQuotationMapper.ts, mapExtractedQuotationLine(), normalizeName()]
- "utils_analyticshelpers_divisionload": "divisionLoad()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L514 | neighbors=[AnalyticsPage.tsx, BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_erntrend": "ernTrend()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L217 | neighbors=[PerformanceTrendsPage.tsx, analyticsHelpers.ts, buildPeriodSequence()]
- "utils_analyticshelpers_otdtrend": "otdTrend()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L314 | neighbors=[PerformanceTrendsPage.tsx, analyticsHelpers.ts, buildPeriodSequence()]
- "utils_analyticshelpers_perioddelta": "periodDelta()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L626 | neighbors=[AnalyticsPage.tsx, PerformanceTrendsPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_periodkey": "periodKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L97 | neighbors=[analyticsHelpers.ts, buildPeriodSequence(), isoWeek()]
- "utils_approvalhelpers_avgapprovaldaysbysector": "avgApprovalDaysBySector()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L137 | neighbors=[BottleneckAnalysisPage.tsx, OperationalSummaryPage.tsx, approvalHelpers.ts]
- "utils_approvalhelpers_computebidsectordurations": "computeBidSectorDurations()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L83 | neighbors=[BidDetailsReportPage.tsx, approvalHelpers.ts, computeApprovalCycleTime()]
- "utils_bidhelpers_getengineeringhours": "getEngineeringHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L39 | neighbors=[EngHoursRanking.tsx, DashboardPage.tsx, bidHelpers.ts]
- "utils_bidhelpers_isoverduebid": "isOverdueBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L14 | neighbors=[MyDashboardPage.tsx, bidHelpers.ts, isActiveBid()]
- "utils_bomparser_assignparentids": "assignParentIds()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L131 | neighbors=[bomParser.ts, parseBomCSV(), parseBomExcel()]
- "utils_bomparser_cleancsvvalue": "cleanCsvValue()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L22 | neighbors=[bomParser.ts, parseBomCSV(), parseBomExcel()]
- "utils_bomparser_findcolumns": "findColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L99 | neighbors=[bomParser.ts, parseBomCSV(), parseBomExcel()]
- "utils_businessdays_calculatepriority": "calculatePriority()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/businessDays.ts:L28 | neighbors=[CreateRequestPage.tsx, businessDays.ts, countBusinessDays()]
- "utils_businessdays_countbusinessdays": "countBusinessDays()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/businessDays.ts:L7 | neighbors=[CreateRequestPage.tsx, businessDays.ts, calculatePriority()]
- "utils_businessdays_gettodayiso": "getTodayISO()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/businessDays.ts:L45 | neighbors=[CreateRequestPage.tsx, businessDays.ts, isToday()]
- "utils_businessdays_istoday": "isToday()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/businessDays.ts:L58 | neighbors=[CreateRequestPage.tsx, businessDays.ts, getTodayISO()]
- "utils_clarificationexport_formatdatetime": "formatDateTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationExport.ts:L13 | neighbors=[clarificationExport.ts, exportClarificationsToExcel(), zeroPad()]
- "utils_clarificationexport_zeropad": "zeroPad()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationExport.ts:L9 | neighbors=[clarificationExport.ts, formatDateOnly(), formatDateTime()]
- "utils_constants_divisions": "DIVISIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L20 | neighbors=[TemplatesPage.tsx, TemplateEditor.tsx, constants.ts]
- "utils_constants_service_lines": "SERVICE_LINES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L27 | neighbors=[TemplatesPage.tsx, TemplateEditor.tsx, constants.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-016.json

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
