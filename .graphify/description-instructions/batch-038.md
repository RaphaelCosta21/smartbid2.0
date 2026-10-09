# Node Description Batch 39 of 86

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
For an entity node (any other kind — e.g. a person, place, event, object),
describe what the entity is and its role, grounded in its type, its
relations (neighbors) and the provided citations/evidence — e.g.
"Lady Carfax, a wealthy heiress who disappears en route to Lausanne.".
Ground entity descriptions in the citations/evidence when present; do not
speculate beyond the context, so a node with no supporting context may be
left out of the reply.
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "dashboard_bidsbyurgencychart_urgencychartrow": "UrgencyChartRow" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByUrgencyChart.tsx:L17 | neighbors=[BidsByUrgencyChart.tsx, DashboardPage.tsx]
- "dashboard_dashboardactivity_dashboardactivity": "DashboardActivity()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L107 | neighbors=[DashboardActivity.tsx, DashboardPage.tsx]
- "dashboard_dashboardbidtable_dashboardbidtable": "DashboardBidTable()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardBidTable.tsx:L131 | neighbors=[DashboardBidTable.tsx, DashboardPage.tsx]
- "dashboard_dashboardfilterbar_dashboardfilterbar": "DashboardFilterBar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardFilterBar.tsx:L39 | neighbors=[DashboardFilterBar.tsx, DashboardPage.tsx]
- "dashboard_dashboardkpirow_dashboardkpirow": "DashboardKPIRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardKPIRow.tsx:L34 | neighbors=[DashboardKPIRow.tsx, DashboardPage.tsx]
- "dashboard_dashboardperiodbar_dashboardperiodbar": "DashboardPeriodBar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardPeriodBar.tsx:L55 | neighbors=[DashboardPeriodBar.tsx, DashboardPage.tsx]
- "dashboard_enghoursoutlook_enghoursoutlook": "EngHoursOutlook()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursOutlook.tsx:L56 | neighbors=[EngHoursOutlook.tsx, DashboardPage.tsx]
- "dashboard_erndashboardsection_erndashboardsection": "ErnDashboardSection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnDashboardSection.tsx:L46 | neighbors=[ErnDashboardSection.tsx, DashboardPage.tsx]
- "dashboard_ernwatchlist_ernwatchlist": "ErnWatchlist()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnWatchlist.tsx:L67 | neighbors=[ErnDashboardSection.tsx, ErnWatchlist.tsx]
- "dashboard_livefocusoverlay_prefersreducedmotion": "prefersReducedMotion()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/LiveFocusOverlay.tsx:L67 | neighbors=[LiveFocusOverlay.tsx, LivePulsePanel.tsx]
- "dashboard_upcomingdeadlines_upcomingdeadlines": "UpcomingDeadlines()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/UpcomingDeadlines.tsx:L30 | neighbors=[UpcomingDeadlines.tsx, DashboardPage.tsx]
- "favorites_addfavoriteequipmentmodal_destkey": "destKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L85 | neighbors=[AddFavoriteEquipmentModal.tsx, AddFavoriteEquipmentModal()]
- "favorites_addfavoriteequipmentmodal_plural": "plural()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L87 | neighbors=[AddFavoriteEquipmentModal.tsx, AddFavoriteEquipmentModal()]
- "function_app_document_structure_atx_heading": "_atx_heading()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L238 | neighbors=[document_structure.py, split_sections()]
- "function_app_document_structure_outline": "outline()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L361 | neighbors=[document_structure.py, build_chunks()]
- "function_app_document_structure_overlap_tail": "_overlap_tail()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L319 | neighbors=[document_structure.py, _split_body()]
- "function_app_document_structure_rationale_138": "Collapse whitespace and mask digits so \"Page 3 of 19\" and \"Page 4 of 19\"\r     co" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L138 | neighbors=[_normalize(), _is_boilerplate()]
- "function_app_document_structure_recurs_per_page": "_recurs_per_page()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L143 | neighbors=[document_structure.py, _is_boilerplate()]
- "function_app_function_app_chat_bad_request": "_chat_bad_request()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L271 | neighbors=[function_app.py, chat()]
- "function_app_function_app_clarifications_bad_request": "_clarifications_bad_request()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L281 | neighbors=[function_app.py, suggest_clarifications()]
- "function_app_function_app_image_to_png": "_image_to_png()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L168 | neighbors=[function_app.py, extract_text_or_images()]
- "function_app_function_app_page_to_png": "_page_to_png()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L161 | neighbors=[function_app.py, extract_text_or_images()]
- "hooks_useanalyticsfilters_analyticsfacetcounts": "AnalyticsFacetCounts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L39 | neighbors=[useAnalyticsFilters.ts, AnalyticsFilterBar.tsx]
- "hooks_useanalyticsfilters_analyticsfilters": "AnalyticsFilters" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L17 | neighbors=[useAnalyticsFilters.ts, AnalyticsFilterBar.tsx]
- "hooks_useanalyticsfilters_isodaysago": "isoDaysAgo()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L50 | neighbors=[useAnalyticsFilters.ts, presetRange()]
- "hooks_useanalyticsfilters_todaystr": "todayStr()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L56 | neighbors=[useAnalyticsFilters.ts, presetRange()]
- "hooks_useapprovals_useapprovals": "useApprovals()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useApprovals.ts:L15 | neighbors=[useApprovals.ts, ApprovalsPage.tsx]
- "hooks_useapprovalsync_useapprovalsync": "useApprovalSync()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useApprovalSync.ts:L35 | neighbors=[useApprovalSync.ts, BidDetailPage.tsx]
- "hooks_usecharttheme_buildcategorical": "buildCategorical()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L53 | neighbors=[useChartTheme.ts, categoricalColor()]
- "hooks_useclarificationlibraryfilter_ilibraryrow": "ILibraryRow" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useClarificationLibraryFilter.ts:L53 | neighbors=[useClarificationLibraryFilter.ts, ClarificationsDbPage.tsx]
- "hooks_useclarificationlibrarysync_needsclarificationlibrarysync": "needsClarificationLibrarySync()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useClarificationLibrarySync.ts:L25 | neighbors=[useClarificationLibrarySync.ts, BidDetailPage.tsx]
- "hooks_useclarificationlibrarysync_useclarificationlibrarysync": "useClarificationLibrarySync()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useClarificationLibrarySync.ts:L31 | neighbors=[useClarificationLibrarySync.ts, BidDetailPage.tsx]
- "hooks_usecurrentuser_useisguest": "useIsGuest()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useCurrentUser.ts:L12 | neighbors=[ChatAssistant.tsx, useCurrentUser.ts]
- "hooks_usedashboardfilters_dashboarddatefield": "DashboardDateField" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDashboardFilters.ts:L13 | neighbors=[DashboardPeriodBar.tsx, useDashboardFilters.ts]
- "hooks_usedashboardfilters_dashboardperiodfilters": "DashboardPeriodFilters" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDashboardFilters.ts:L28 | neighbors=[DashboardPeriodBar.tsx, useDashboardFilters.ts]
- "hooks_usedashboardfilters_dashboardscopefacetkey": "DashboardScopeFacetKey" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDashboardFilters.ts:L36 | neighbors=[DashboardFilterBar.tsx, useDashboardFilters.ts]
- "hooks_usedashboardfilters_dashboardscopefilters": "DashboardScopeFilters" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDashboardFilters.ts:L18 | neighbors=[DashboardFilterBar.tsx, useDashboardFilters.ts]
- "hooks_usedashboardfilters_usedashboardfilters": "UseDashboardFilters" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDashboardFilters.ts:L98 | neighbors=[useDashboardFilters.ts, DashboardPage.tsx]
- "hooks_usedashboardsync_dashboardsync": "DashboardSync" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDashboardSync.ts:L15 | neighbors=[useDashboardSync.ts, LivePulsePanel.tsx]
- "hooks_useeditcontrol_editcontrolstate": "EditControlState" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useEditControl.ts:L12 | neighbors=[EditLockBanner.tsx, useEditControl.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-038.json

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
