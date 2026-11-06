# Node Description Batch 74 of 102

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

- "config_colorthemes_config_upcoming_color_themes": "UPCOMING_COLOR_THEMES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/colorThemes.config.ts:L155 | neighbors=[colorThemes.config.ts]
- "config_comparator_config_comparator_config": "COMPARATOR_CONFIG" | kind=code-symbol | source=src/webparts/smartBid20/app/config/comparator.config.ts:L5 | neighbors=[comparator.config.ts]
- "config_kpi_config_bid_priorities": "BID_PRIORITIES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/kpi.config.ts:L113 | neighbors=[kpi.config.ts]
- "config_kpi_config_default_kpi_targets": "DEFAULT_KPI_TARGETS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/kpi.config.ts:L115 | neighbors=[kpi.config.ts]
- "config_kpi_config_default_priority_rules": "DEFAULT_PRIORITY_RULES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/kpi.config.ts:L125 | neighbors=[kpi.config.ts]
- "config_kpi_config_ikpidef": "IKPIDef" | kind=code-symbol | source=src/webparts/smartBid20/app/config/kpi.config.ts:L9 | neighbors=[kpi.config.ts]
- "config_kpi_config_kpi_definitions": "KPI_DEFINITIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/kpi.config.ts:L28 | neighbors=[kpi.config.ts]
- "config_kpi_config_kpi_groups": "KPI_GROUPS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/kpi.config.ts:L21 | neighbors=[kpi.config.ts]
- "config_kpi_config_kpigroup": "KPIGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/config/kpi.config.ts:L7 | neighbors=[kpi.config.ts]
- "config_navigation_config_inavitem": "INavItem" | kind=code-symbol | source=src/webparts/smartBid20/app/config/navigation.config.ts:L1 | neighbors=[navigation.config.ts]
- "config_navigation_config_navigation_items": "NAVIGATION_ITEMS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/navigation.config.ts:L24 | neighbors=[navigation.config.ts]
- "config_navigation_config_navigation_sections": "NAVIGATION_SECTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/navigation.config.ts:L14 | neighbors=[navigation.config.ts]
- "config_navigation_config_section_labels": "SECTION_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/navigation.config.ts:L299 | neighbors=[navigation.config.ts]
- "config_notifications_config_bid_role_keys": "BID_ROLE_KEYS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L247 | neighbors=[notifications.config.ts]
- "config_notifications_config_builddefaultnotificationrules": "buildDefaultNotificationRules()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L271 | neighbors=[notifications.config.ts]
- "config_notifications_config_default_notification_settings": "DEFAULT_NOTIFICATION_SETTINGS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L282 | neighbors=[notifications.config.ts]
- "config_notifications_config_engineering_leads": "ENGINEERING_LEADS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L249 | neighbors=[notifications.config.ts]
- "config_notifications_config_getnotificationeventdef": "getNotificationEventDef()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L230 | neighbors=[notifications.config.ts]
- "config_notifications_config_inotificationeventdef": "INotificationEventDef" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L27 | neighbors=[notifications.config.ts]
- "config_notifications_config_isvalidflowurl": "isValidFlowUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L355 | neighbors=[notifications.config.ts]
- "config_notifications_config_key_people_teams": "KEY_PEOPLE_TEAMS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L248 | neighbors=[notifications.config.ts]
- "config_notifications_config_modes": "MODES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L246 | neighbors=[notifications.config.ts]
- "config_notifications_config_notification_events": "NOTIFICATION_EVENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L51 | neighbors=[notifications.config.ts]
- "config_notifications_config_notification_groups": "NOTIFICATION_GROUPS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L41 | neighbors=[notifications.config.ts]
- "config_notifications_config_notification_teams": "NOTIFICATION_TEAMS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L237 | neighbors=[notifications.config.ts]
- "config_notifications_config_notificationchannel": "NotificationChannel" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L13 | neighbors=[notifications.config.ts]
- "config_notifications_config_notificationgroupkey": "NotificationGroupKey" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L21 | neighbors=[notifications.config.ts]
- "config_notifications_config_notificationsource": "NotificationSource" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L20 | neighbors=[notifications.config.ts]
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
