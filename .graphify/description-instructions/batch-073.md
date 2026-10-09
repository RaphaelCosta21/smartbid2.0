# Node Description Batch 74 of 86

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

- "pages_timelinepage_labelmode": "LabelMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L32 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_layoutbar": "layoutBar()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L96 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_timelinerow": "TimelineRow" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L81 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_zoom_segments": "ZOOM_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L39 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_zoomweeks": "ZoomWeeks" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L30 | neighbors=[TimelinePage.tsx]
- "pages_toolingreportpage_itoolingstat": "IToolingStat" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ToolingReportPage.tsx:L11 | neighbors=[ToolingReportPage.tsx]
- "pages_unassignedrequestspage_getavatarcolor": "getAvatarColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L53 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_getcreatorkey": "getCreatorKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L79 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_getinitials": "getInitials()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L44 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_priorities": "PRIORITIES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L77 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_request_facet_values": "REQUEST_FACET_VALUES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L85 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_requestfacetkey": "RequestFacetKey" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L83 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_view_options": "VIEW_OPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L71 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L69 | neighbors=[UnassignedRequestsPage.tsx]
- "peoplesoft_howitworksdrawer_howitworksdrawerprops": "HowItWorksDrawerProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/peoplesoft/HowItWorksDrawer.tsx:L88 | neighbors=[HowItWorksDrawer.tsx]
- "peoplesoft_howitworksdrawer_sectionid": "SectionId" | kind=code-symbol | source=src/webparts/smartBid20/app/components/peoplesoft/HowItWorksDrawer.tsx:L32 | neighbors=[HowItWorksDrawer.tsx]
- "peoplesoft_howitworksdrawer_sections": "SECTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/peoplesoft/HowItWorksDrawer.tsx:L41 | neighbors=[HowItWorksDrawer.tsx]
- "peoplesoft_howitworksdrawer_source_names": "SOURCE_NAMES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/peoplesoft/HowItWorksDrawer.tsx:L51 | neighbors=[HowItWorksDrawer.tsx]
- "peoplesoft_howitworksdrawer_view_keys": "VIEW_KEYS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/peoplesoft/HowItWorksDrawer.tsx:L55 | neighbors=[HowItWorksDrawer.tsx]
- "reports_approvaldueimpactsection_approvaldueimpactsectionprops": "ApprovalDueImpactSectionProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ApprovalDueImpactSection.tsx:L40 | neighbors=[ApprovalDueImpactSection.tsx]
- "reports_approvaldueimpactsection_laterow": "LateRow" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ApprovalDueImpactSection.tsx:L44 | neighbors=[ApprovalDueImpactSection.tsx]
- "reports_biddetailsreport_biddetailsreport": "BidDetailsReport()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/BidDetailsReport.tsx:L4 | neighbors=[BidDetailsReport.tsx]
- "reports_exportbar_exportbarprops": "ExportBarProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ExportBar.tsx:L4 | neighbors=[ExportBar.tsx]
- "reports_exportoptions_exportoptions": "ExportOptions()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ExportOptions.tsx:L9 | neighbors=[ExportOptions.tsx]
- "reports_exportoptions_exportoptionsprops": "ExportOptionsProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ExportOptions.tsx:L4 | neighbors=[ExportOptions.tsx]
- "reports_operationalsummaryreport_operationalsummaryreport": "OperationalSummaryReport()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/OperationalSummaryReport.tsx:L4 | neighbors=[OperationalSummaryReport.tsx]
- "reports_periodperformancereport_periodperformancereport": "PeriodPerformanceReport()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/PeriodPerformanceReport.tsx:L4 | neighbors=[PeriodPerformanceReport.tsx]
- "reports_reportsdashboard_reportsdashboard": "ReportsDashboard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ReportsDashboard.tsx:L5 | neighbors=[ReportsDashboard.tsx]
- "services_accesslogservice_accesslogservice_getrecent": ".getRecent()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AccessLogService.ts:L86 | neighbors=[AccessLogService]
- "services_accesslogservice_accesslogservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AccessLogService.ts:L21 | neighbors=[AccessLogService]
- "services_accesslogservice_accesslogservice_logaccess": ".logAccess()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AccessLogService.ts:L56 | neighbors=[AccessLogService]
- "services_activitylogservice_activitylogservice_list": "._list()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ActivityLogService.ts:L12 | neighbors=[ActivityLogService]
- "services_aianalysisservice_aianalysisservice_normalizesubitems": ".normalizeSubItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L77 | neighbors=[AIAnalysisService]
- "services_aianalysisservice_supplier_profile_bases": "SUPPLIER_PROFILE_BASES" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L61 | neighbors=[AIAnalysisService.ts]
- "services_aiauthservice_aiauthservice_resettrace": ".resetTrace()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L64 | neighbors=[AiAuthService]
- "services_aiauthservice_iaiauthtraceentry": "IAiAuthTraceEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L30 | neighbors=[AiAuthService.ts]
- "services_aiauthservice_iscopeproberesult": "IScopeProbeResult" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L51 | neighbors=[AiAuthService.ts]
- "services_aiauthservice_scopeprobeverdict": "ScopeProbeVerdict" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L44 | neighbors=[AiAuthService.ts]
- "services_approvalservice_approvalservice_approvalslist": "._approvalsList()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L18 | neighbors=[ApprovalService]
- "services_approvalservice_approvalservice_processdecision": ".processDecision()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L185 | neighbors=[ApprovalService]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-073.json

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
