# Node Description Batch 86 of 102

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

- "pages_suppliersregistry_splitlinesonly": "splitLinesOnly()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L96 | neighbors=[SuppliersRegistry.tsx]
- "pages_suppliersregistry_syncrow": "SyncRow" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L144 | neighbors=[SuppliersRegistry.tsx]
- "pages_surveysystempage_csshex": "cssHex()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SurveySystemPage.tsx:L102 | neighbors=[SurveySystemPage.tsx]
- "pages_surveysystempage_dominantkind": "dominantKind()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SurveySystemPage.tsx:L120 | neighbors=[SurveySystemPage.tsx]
- "pages_surveysystempage_ijourneyrun": "IJourneyRun" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SurveySystemPage.tsx:L96 | neighbors=[SurveySystemPage.tsx]
- "pages_surveysystempage_itrunkdetail": "ITrunkDetail" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SurveySystemPage.tsx:L113 | neighbors=[SurveySystemPage.tsx]
- "pages_surveysystempage_surveysystemscene": "SurveySystemScene" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SurveySystemPage.tsx:L86 | neighbors=[SurveySystemPage.tsx]
- "pages_surveysystempage_tour_depth": "TOUR_DEPTH" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SurveySystemPage.tsx:L104 | neighbors=[SurveySystemPage.tsx]
- "pages_surveysystempage_trace_logical_stages": "TRACE_LOGICAL_STAGES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SurveySystemPage.tsx:L133 | neighbors=[SurveySystemPage.tsx]
- "pages_teamanalyticspage_bidrolefilter": "BidRoleFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L40 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_teamanalyticspage_metric": "Metric" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L38 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_teamanalyticspage_metric_segments": "METRIC_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L48 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_teamanalyticspage_role_segments": "ROLE_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L42 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_teamanalyticspage_view_segments": "VIEW_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L56 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_teamanalyticspage_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L39 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_technicalproposalspage_field_labels": "FIELD_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TechnicalProposalsPage.tsx:L9 | neighbors=[TechnicalProposalsPage.tsx]
- "pages_templatespage_facetkey": "FacetKey" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L34 | neighbors=[TemplatesPage.tsx]
- "pages_templatespage_sortorder": "SortOrder" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L33 | neighbors=[TemplatesPage.tsx]
- "pages_templatespage_status_options": "STATUS_OPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L36 | neighbors=[TemplatesPage.tsx]
- "pages_templatespage_statuskey": "statusKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L41 | neighbors=[TemplatesPage.tsx]
- "pages_templatespage_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L32 | neighbors=[TemplatesPage.tsx]
- "pages_timelinepage_barlayout": "BarLayout" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L66 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_duehealth": "DueHealth" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L31 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_getduehealth": "getDueHealth()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L88 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_health_class": "HEALTH_CLASS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L59 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_health_legend": "HEALTH_LEGEND" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L45 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_labelmode": "LabelMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L32 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_layoutbar": "layoutBar()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L96 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_timelinerow": "TimelineRow" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L81 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_zoom_segments": "ZOOM_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L39 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_zoomweeks": "ZoomWeeks" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L30 | neighbors=[TimelinePage.tsx]
- "pages_toolingreportpage_itoolingstat": "IToolingStat" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ToolingReportPage.tsx:L11 | neighbors=[ToolingReportPage.tsx]
- "pages_unassignedrequestspage_getavatarcolor": "getAvatarColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L57 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_getcreatorkey": "getCreatorKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L83 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_getinitials": "getInitials()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L48 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_priorities": "PRIORITIES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L81 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_request_facet_values": "REQUEST_FACET_VALUES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L89 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_requestfacetkey": "RequestFacetKey" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L87 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_view_options": "VIEW_OPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L75 | neighbors=[UnassignedRequestsPage.tsx]
- "pages_unassignedrequestspage_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/UnassignedRequestsPage.tsx:L73 | neighbors=[UnassignedRequestsPage.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-085.json

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
