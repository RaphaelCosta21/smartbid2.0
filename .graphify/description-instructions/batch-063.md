# Node Description Batch 64 of 86

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

- "dashboard_bidsbyurgencychart_bidsbyurgencychartprops": "BidsByUrgencyChartProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByUrgencyChart.tsx:L24 | neighbors=[BidsByUrgencyChart.tsx]
- "dashboard_dashboardactivity_actorname": "actorName()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L54 | neighbors=[DashboardActivity.tsx]
- "dashboard_dashboardactivity_buildfeed": "buildFeed()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L66 | neighbors=[DashboardActivity.tsx]
- "dashboard_dashboardactivity_dashboardactivityprops": "DashboardActivityProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L45 | neighbors=[DashboardActivity.tsx]
- "dashboard_dashboardactivity_daylabel": "dayLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L58 | neighbors=[DashboardActivity.tsx]
- "dashboard_dashboardactivity_feedrow": "FeedRow" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L36 | neighbors=[DashboardActivity.tsx]
- "dashboard_dashboardactivity_mode": "Mode" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L20 | neighbors=[DashboardActivity.tsx]
- "dashboard_dashboardactivity_mode_segments": "MODE_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L22 | neighbors=[DashboardActivity.tsx]
- "dashboard_dashboardactivity_phaselabel": "phaseLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L50 | neighbors=[DashboardActivity.tsx]
- "dashboard_dashboardactivity_transition": "Transition" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L31 | neighbors=[DashboardActivity.tsx]
- "dashboard_dashboardbidtable_column": "Column" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardBidTable.tsx:L58 | neighbors=[DashboardBidTable.tsx]
- "dashboard_dashboardbidtable_columns": "COLUMNS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardBidTable.tsx:L65 | neighbors=[DashboardBidTable.tsx]
- "dashboard_dashboardbidtable_dashboardbidtableprops": "DashboardBidTableProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardBidTable.tsx:L27 | neighbors=[DashboardBidTable.tsx]
- "dashboard_dashboardbidtable_due_options": "DUE_OPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardBidTable.tsx:L81 | neighbors=[DashboardBidTable.tsx]
- "dashboard_dashboardbidtable_duebucket": "dueBucket()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardBidTable.tsx:L121 | neighbors=[DashboardBidTable.tsx]
- "dashboard_dashboardbidtable_empty_filters": "EMPTY_FILTERS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardBidTable.tsx:L101 | neighbors=[DashboardBidTable.tsx]
- "dashboard_dashboardbidtable_eng_hours_options": "ENG_HOURS_OPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardBidTable.tsx:L96 | neighbors=[DashboardBidTable.tsx]
- "dashboard_dashboardbidtable_ern_options": "ERN_OPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardBidTable.tsx:L89 | neighbors=[DashboardBidTable.tsx]
- "dashboard_dashboardbidtable_filterkey": "FilterKey" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardBidTable.tsx:L32 | neighbors=[DashboardBidTable.tsx]
- "dashboard_dashboardbidtable_priority_rank": "PRIORITY_RANK" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardBidTable.tsx:L113 | neighbors=[DashboardBidTable.tsx]
- "dashboard_dashboardbidtable_sortkey": "SortKey" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardBidTable.tsx:L43 | neighbors=[DashboardBidTable.tsx]
- "dashboard_dashboardfilterbar_bylabel": "byLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardFilterBar.tsx:L35 | neighbors=[DashboardFilterBar.tsx]
- "dashboard_dashboardfilterbar_dashboardfilterbarprops": "DashboardFilterBarProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardFilterBar.tsx:L22 | neighbors=[DashboardFilterBar.tsx]
- "dashboard_dashboardkpirow_dashboardkpirowprops": "DashboardKPIRowProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardKPIRow.tsx:L19 | neighbors=[DashboardKPIRow.tsx]
- "dashboard_dashboardperiodbar_dashboardperiodbarprops": "DashboardPeriodBarProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardPeriodBar.tsx:L19 | neighbors=[DashboardPeriodBar.tsx]
- "dashboard_dashboardperiodbar_date_field_label": "DATE_FIELD_LABEL" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardPeriodBar.tsx:L30 | neighbors=[DashboardPeriodBar.tsx]
- "dashboard_dashboardperiodbar_date_fields": "DATE_FIELDS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardPeriodBar.tsx:L36 | neighbors=[DashboardPeriodBar.tsx]
- "dashboard_dashboardperiodbar_presets": "PRESETS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardPeriodBar.tsx:L46 | neighbors=[DashboardPeriodBar.tsx]
- "dashboard_divisionworkload_divisionworkload": "DivisionWorkload()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DivisionWorkload.tsx:L11 | neighbors=[DivisionWorkload.tsx]
- "dashboard_divisionworkload_divisionworkloadprops": "DivisionWorkloadProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DivisionWorkload.tsx:L6 | neighbors=[DivisionWorkload.tsx]
- "dashboard_enghoursoutlook_enghoursoutlookprops": "EngHoursOutlookProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursOutlook.tsx:L42 | neighbors=[EngHoursOutlook.tsx]
- "dashboard_enghoursoutlook_hoursformatter": "hoursFormatter()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursOutlook.tsx:L53 | neighbors=[EngHoursOutlook.tsx]
- "dashboard_enghoursoutlook_mode_segments": "MODE_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursOutlook.tsx:L48 | neighbors=[EngHoursOutlook.tsx]
- "dashboard_enghoursranking_enghoursrankingprops": "EngHoursRankingProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursRanking.tsx:L26 | neighbors=[EngHoursRanking.tsx]
- "dashboard_enghoursranking_scope": "Scope" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursRanking.tsx:L12 | neighbors=[EngHoursRanking.tsx]
- "dashboard_enghoursranking_scope_segments": "SCOPE_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursRanking.tsx:L14 | neighbors=[EngHoursRanking.tsx]
- "dashboard_enghoursranking_scope_subtitle": "SCOPE_SUBTITLE" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursRanking.tsx:L20 | neighbors=[EngHoursRanking.tsx]
- "dashboard_erndashboardsection_erndashboardsectionprops": "ErnDashboardSectionProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnDashboardSection.tsx:L35 | neighbors=[ErnDashboardSection.tsx]
- "dashboard_erndashboardsection_no_bids": "NO_BIDS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnDashboardSection.tsx:L44 | neighbors=[ErnDashboardSection.tsx]
- "dashboard_ernwatchlist_detail": "Detail()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnWatchlist.tsx:L340 | neighbors=[ErnWatchlist.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-063.json

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
