# Node Description Batch 32 of 43

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

- "config_ai_config_iaichatconfig": "IAiChatConfig" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L53 | neighbors=[ai.config.ts]
- "config_ai_config_iaiconfig": "IAiConfig" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L72 | neighbors=[ai.config.ts]
- "config_ai_config_isaiconfigured": "isAiConfigured()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L142 | neighbors=[ai.config.ts]
- "config_ai_prompts_buildclarificationsuggestionprompt": "buildClarificationSuggestionPrompt()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L362 | neighbors=[ai.prompts.ts]
- "config_ai_prompts_builddocumentmetadataextractionprompt": "buildDocumentMetadataExtractionPrompt()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L309 | neighbors=[ai.prompts.ts]
- "config_ai_prompts_buildknowledgechatprompt": "buildKnowledgeChatPrompt()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L161 | neighbors=[ai.prompts.ts]
- "config_ai_prompts_buildquotationextractionprompt": "buildQuotationExtractionPrompt()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L244 | neighbors=[ai.prompts.ts]
- "config_ai_prompts_buildscopeofsupplyprompt": "buildScopeOfSupplyPrompt()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L45 | neighbors=[ai.prompts.ts]
- "config_app_config_app_config": "APP_CONFIG" | kind=code-symbol | source=src/webparts/smartBid20/app/config/app.config.ts:L1 | neighbors=[app.config.ts]
- "config_kpi_config_default_kpi_targets": "DEFAULT_KPI_TARGETS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/kpi.config.ts:L118 | neighbors=[kpi.config.ts]
- "config_kpi_config_ikpidef": "IKPIDef" | kind=code-symbol | source=src/webparts/smartBid20/app/config/kpi.config.ts:L4 | neighbors=[kpi.config.ts]
- "config_kpi_config_kpi_definitions": "KPI_DEFINITIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/kpi.config.ts:L15 | neighbors=[kpi.config.ts]
- "config_navigation_config_inavitem": "INavItem" | kind=code-symbol | source=src/webparts/smartBid20/app/config/navigation.config.ts:L1 | neighbors=[navigation.config.ts]
- "config_navigation_config_navigation_items": "NAVIGATION_ITEMS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/navigation.config.ts:L25 | neighbors=[navigation.config.ts]
- "config_navigation_config_navigation_sections": "NAVIGATION_SECTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/navigation.config.ts:L15 | neighbors=[navigation.config.ts]
- "config_navigation_config_section_labels": "SECTION_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/navigation.config.ts:L275 | neighbors=[navigation.config.ts]
- "config_phases_config_getalltasks": "getAllTasks()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L289 | neighbors=[phases.config.ts]
- "config_phases_config_iphasetask": "IPhaseTask" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L6 | neighbors=[phases.config.ts]
- "config_phases_config_phases_config": "PHASES_CONFIG" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L15 | neighbors=[phases.config.ts]
- "config_routes_config_routes": "ROUTES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/routes.config.ts:L1 | neighbors=[routes.config.ts]
- "config_sectors_config_by_label": "BY_LABEL" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L31 | neighbors=[sectors.config.ts]
- "config_sectors_config_by_value": "BY_VALUE" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L30 | neighbors=[sectors.config.ts]
- "config_sectors_config_getsectorcolor": "getSectorColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L45 | neighbors=[sectors.config.ts]
- "config_sectors_config_getsectordef": "getSectorDef()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L37 | neighbors=[sectors.config.ts]
- "config_sectors_config_getsectorlabel": "getSectorLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L41 | neighbors=[sectors.config.ts]
- "config_sectors_config_isectordef": "ISectorDef" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L8 | neighbors=[sectors.config.ts]
- "config_sectors_config_sectorfromlabel": "sectorFromLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L50 | neighbors=[sectors.config.ts]
- "config_sectors_config_sectors": "SECTORS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L15 | neighbors=[sectors.config.ts]
- "config_sharepoint_config_sharepoint_config": "SHAREPOINT_CONFIG" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sharepoint.config.ts:L4 | neighbors=[sharepoint.config.ts]
- "config_status_config_bid_phases": "BID_PHASES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L174 | neighbors=[status.config.ts]
- "config_status_config_bid_statuses": "BID_STATUSES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L9 | neighbors=[status.config.ts]
- "config_status_config_getsubstatusesforphase": "getSubStatusesForPhase()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L402 | neighbors=[status.config.ts]
- "config_status_config_sub_statuses": "SUB_STATUSES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L288 | neighbors=[status.config.ts]
- "dashboard_approvalspending_approvalspendingprops": "ApprovalsPendingProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ApprovalsPending.tsx:L5 | neighbors=[ApprovalsPending.tsx]
- "dashboard_bidsbydivisionchart_bidsbydivisionchartprops": "BidsByDivisionChartProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByDivisionChart.tsx:L15 | neighbors=[BidsByDivisionChart.tsx]
- "dashboard_bidsbystatuschart_bidsbystatuschartprops": "BidsByStatusChartProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByStatusChart.tsx:L17 | neighbors=[BidsByStatusChart.tsx]
- "dashboard_dashboardactivity_dashboardactivityprops": "DashboardActivityProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L27 | neighbors=[DashboardActivity.tsx]
- "dashboard_dashboardactivity_feedrow": "FeedRow" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L18 | neighbors=[DashboardActivity.tsx]
- "dashboard_dashboardactivity_mode": "Mode" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L11 | neighbors=[DashboardActivity.tsx]
- "dashboard_dashboardactivity_mode_segments": "MODE_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardActivity.tsx:L13 | neighbors=[DashboardActivity.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-031.json

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
