# Node Description Batch 63 of 86

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

- "config_notifications_config_notificationtone": "NotificationTone" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L14 | neighbors=[notifications.config.ts]
- "config_peoplesoftconsulting_i18n_en": "EN" | kind=code-symbol | source=src/webparts/smartBid20/app/config/peoplesoftConsulting.i18n.ts:L152 | neighbors=[peoplesoftConsulting.i18n.ts]
- "config_peoplesoftconsulting_i18n_ipeoplesoftcolumnheaders": "IPeoplesoftColumnHeaders" | kind=code-symbol | source=src/webparts/smartBid20/app/config/peoplesoftConsulting.i18n.ts:L49 | neighbors=[peoplesoftConsulting.i18n.ts]
- "config_peoplesoftconsulting_i18n_ipeoplesoftconsultingtext": "IPeoplesoftConsultingText" | kind=code-symbol | source=src/webparts/smartBid20/app/config/peoplesoftConsulting.i18n.ts:L70 | neighbors=[peoplesoftConsulting.i18n.ts]
- "config_peoplesoftconsulting_i18n_ipeoplesofthelpsection": "IPeoplesoftHelpSection" | kind=code-symbol | source=src/webparts/smartBid20/app/config/peoplesoftConsulting.i18n.ts:L64 | neighbors=[peoplesoftConsulting.i18n.ts]
- "config_peoplesoftconsulting_i18n_peoplesoft_text": "PEOPLESOFT_TEXT" | kind=code-symbol | source=src/webparts/smartBid20/app/config/peoplesoftConsulting.i18n.ts:L616 | neighbors=[peoplesoftConsulting.i18n.ts]
- "config_peoplesoftconsulting_i18n_peoplesoft_tour_order": "PEOPLESOFT_TOUR_ORDER" | kind=code-symbol | source=src/webparts/smartBid20/app/config/peoplesoftConsulting.i18n.ts:L31 | neighbors=[peoplesoftConsulting.i18n.ts]
- "config_peoplesoftconsulting_i18n_peoplesoftlang": "PeoplesoftLang" | kind=code-symbol | source=src/webparts/smartBid20/app/config/peoplesoftConsulting.i18n.ts:L7 | neighbors=[peoplesoftConsulting.i18n.ts]
- "config_peoplesoftconsulting_i18n_peoplesoftsourcekey": "PeoplesoftSourceKey" | kind=code-symbol | source=src/webparts/smartBid20/app/config/peoplesoftConsulting.i18n.ts:L8 | neighbors=[peoplesoftConsulting.i18n.ts]
- "config_peoplesoftconsulting_i18n_peoplesofttourstepid": "PeoplesoftTourStepId" | kind=code-symbol | source=src/webparts/smartBid20/app/config/peoplesoftConsulting.i18n.ts:L10 | neighbors=[peoplesoftConsulting.i18n.ts]
- "config_peoplesoftconsulting_i18n_peoplesoftviewkey": "PeoplesoftViewKey" | kind=code-symbol | source=src/webparts/smartBid20/app/config/peoplesoftConsulting.i18n.ts:L9 | neighbors=[peoplesoftConsulting.i18n.ts]
- "config_peoplesoftconsulting_i18n_pt": "PT" | kind=code-symbol | source=src/webparts/smartBid20/app/config/peoplesoftConsulting.i18n.ts:L383 | neighbors=[peoplesoftConsulting.i18n.ts]
- "config_peoplesoftconsulting_i18n_readpeoplesoftlang": "readPeoplesoftLang()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/peoplesoftConsulting.i18n.ts:L622 | neighbors=[peoplesoftConsulting.i18n.ts]
- "config_peoplesoftconsulting_i18n_savepeoplesoftlang": "savePeoplesoftLang()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/peoplesoftConsulting.i18n.ts:L632 | neighbors=[peoplesoftConsulting.i18n.ts]
- "config_phases_config_getalltasks": "getAllTasks()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L289 | neighbors=[phases.config.ts]
- "config_phases_config_iphasetask": "IPhaseTask" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L6 | neighbors=[phases.config.ts]
- "config_phases_config_phases_config": "PHASES_CONFIG" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L15 | neighbors=[phases.config.ts]
- "config_prepmobilization_config_mob_types": "MOB_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/prepMobilization.config.ts:L10 | neighbors=[prepMobilization.config.ts]
- "config_prepmobilization_config_rts_types": "RTS_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/prepMobilization.config.ts:L3 | neighbors=[prepMobilization.config.ts]
- "config_routes_config_routes": "ROUTES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/routes.config.ts:L1 | neighbors=[routes.config.ts]
- "config_sectors_config_by_label": "BY_LABEL" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L32 | neighbors=[sectors.config.ts]
- "config_sectors_config_by_value": "BY_VALUE" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L31 | neighbors=[sectors.config.ts]
- "config_sectors_config_getsectorcolor": "getSectorColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L46 | neighbors=[sectors.config.ts]
- "config_sectors_config_getsectordef": "getSectorDef()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L38 | neighbors=[sectors.config.ts]
- "config_sectors_config_getsectorlabel": "getSectorLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L42 | neighbors=[sectors.config.ts]
- "config_sectors_config_isectordef": "ISectorDef" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L9 | neighbors=[sectors.config.ts]
- "config_sectors_config_sectorfromlabel": "sectorFromLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L55 | neighbors=[sectors.config.ts]
- "config_sectors_config_sectors": "SECTORS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L16 | neighbors=[sectors.config.ts]
- "config_sharepoint_config_sharepoint_config": "SHAREPOINT_CONFIG" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sharepoint.config.ts:L4 | neighbors=[sharepoint.config.ts]
- "config_status_config_bid_phases": "BID_PHASES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L175 | neighbors=[status.config.ts]
- "config_status_config_bid_statuses": "BID_STATUSES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L10 | neighbors=[status.config.ts]
- "config_status_config_getsubstatusesforphase": "getSubStatusesForPhase()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L424 | neighbors=[status.config.ts]
- "config_status_config_sub_statuses": "SUB_STATUSES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L297 | neighbors=[status.config.ts]
- "config_suppliers_config_builddefaultsupplierservicetypes": "buildDefaultSupplierServiceTypes()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/suppliers.config.ts:L51 | neighbors=[suppliers.config.ts]
- "config_suppliers_config_service_type_seed": "SERVICE_TYPE_SEED" | kind=code-symbol | source=src/webparts/smartBid20/app/config/suppliers.config.ts:L8 | neighbors=[suppliers.config.ts]
- "dashboard_approvalspending_approvalspendingprops": "ApprovalsPendingProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ApprovalsPending.tsx:L18 | neighbors=[ApprovalsPending.tsx]
- "dashboard_approvalspending_initials": "initials()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ApprovalsPending.tsx:L26 | neighbors=[ApprovalsPending.tsx]
- "dashboard_approvalspending_sectorstyle": "sectorStyle()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ApprovalsPending.tsx:L36 | neighbors=[ApprovalsPending.tsx]
- "dashboard_bidsbydivisionchart_bidsbydivisionchartprops": "BidsByDivisionChartProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByDivisionChart.tsx:L15 | neighbors=[BidsByDivisionChart.tsx]
- "dashboard_bidsbystatuschart_bidsbystatuschartprops": "BidsByStatusChartProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByStatusChart.tsx:L17 | neighbors=[BidsByStatusChart.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-062.json

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
