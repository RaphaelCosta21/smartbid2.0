# Node Description Batch 37 of 43

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

- "pages_queryconsultingpage_ibusinessunitfilter": "IBusinessUnitFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L26 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_isearchfilter": "ISearchFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L31 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_isubtabdata": "ISubTabData" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L48 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_itabdata": "ITabData" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L37 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_month_names": "MONTH_NAMES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L70 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_photothumbnail": "PhotoThumbnail()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L1282 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_subtabkey": "SubTabKey" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L24 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_tabkey": "TabKey" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L23 | neighbors=[QueryConsultingPage.tsx]
- "pages_quotationspage_ilineitem": "ILineItem" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QuotationsPage.tsx:L46 | neighbors=[QuotationsPage.tsx]
- "pages_quotationspage_staricon": "StarIcon()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QuotationsPage.tsx:L111 | neighbors=[QuotationsPage.tsx]
- "pages_reportspage_previewdef": "PreviewDef" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ReportsPage.tsx:L15 | neighbors=[ReportsPage.tsx]
- "pages_teamanalyticspage_bidrolefilter": "BidRoleFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L40 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_teamanalyticspage_metric": "Metric" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L38 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_teamanalyticspage_metric_segments": "METRIC_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L48 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_teamanalyticspage_role_segments": "ROLE_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L42 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_teamanalyticspage_view_segments": "VIEW_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L56 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_teamanalyticspage_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L39 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_technicalproposalspage_field_labels": "FIELD_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TechnicalProposalsPage.tsx:L13 | neighbors=[TechnicalProposalsPage.tsx]
- "pages_templatespage_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L16 | neighbors=[TemplatesPage.tsx]
- "pages_toolingreportpage_itoolingstat": "IToolingStat" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ToolingReportPage.tsx:L11 | neighbors=[ToolingReportPage.tsx]
- "pages_unassignedrequestspage_getavatarcolor": "getAvatarColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L40 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_getinitials": "getInitials()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L31 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L56 | neighbors=[UnassignedRequestsPage.tsx]
- "reports_biddetailsreport_biddetailsreport": "BidDetailsReport()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/BidDetailsReport.tsx:L4 | neighbors=[BidDetailsReport.tsx]
- "reports_exportbar_exportbarprops": "ExportBarProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ExportBar.tsx:L4 | neighbors=[ExportBar.tsx]
- "reports_exportoptions_exportoptions": "ExportOptions()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ExportOptions.tsx:L9 | neighbors=[ExportOptions.tsx]
- "reports_exportoptions_exportoptionsprops": "ExportOptionsProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ExportOptions.tsx:L4 | neighbors=[ExportOptions.tsx]
- "reports_operationalsummaryreport_operationalsummaryreport": "OperationalSummaryReport()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/OperationalSummaryReport.tsx:L4 | neighbors=[OperationalSummaryReport.tsx]
- "reports_periodperformancereport_periodperformancereport": "PeriodPerformanceReport()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/PeriodPerformanceReport.tsx:L4 | neighbors=[PeriodPerformanceReport.tsx]
- "reports_reportsdashboard_reportsdashboard": "ReportsDashboard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ReportsDashboard.tsx:L5 | neighbors=[ReportsDashboard.tsx]
- "services_activitylogservice_activitylogservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ActivityLogService.ts:L12 | neighbors=[ActivityLogService]
- "services_aianalysisservice_aianalysisservice_normalizesubitems": ".normalizeSubItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L58 | neighbors=[AIAnalysisService]
- "services_aianalysisservice_aianalysisservice_suggestclarifications": ".suggestClarifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L826 | neighbors=[AIAnalysisService]
- "services_aiauthservice_aiauthservice_resettrace": ".resetTrace()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L64 | neighbors=[AiAuthService]
- "services_aiauthservice_iaiauthtraceentry": "IAiAuthTraceEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L30 | neighbors=[AiAuthService.ts]
- "services_aiauthservice_iscopeproberesult": "IScopeProbeResult" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L51 | neighbors=[AiAuthService.ts]
- "services_aiauthservice_scopeprobeverdict": "ScopeProbeVerdict" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L44 | neighbors=[AiAuthService.ts]
- "services_approvalservice_approvalservice_approvalslist": "._approvalsList()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L17 | neighbors=[ApprovalService]
- "services_approvalservice_approvalservice_processdecision": ".processDecision()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L124 | neighbors=[ApprovalService]
- "services_approvalservice_approvalservice_requestapproval": ".requestApproval()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L95 | neighbors=[ApprovalService]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-036.json

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
