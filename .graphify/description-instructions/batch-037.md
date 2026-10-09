# Node Description Batch 38 of 86

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

- "common_guidedtour_getscrollparent": "getScrollParent()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L85 | neighbors=[GuidedTour.tsx, revealTarget()]
- "common_guidedtour_guidedtour": "GuidedTour()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L202 | neighbors=[GuidedTour.tsx, QueryConsultingPage.tsx]
- "common_guidedtour_guidedtourplacement": "GuidedTourPlacement" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L16 | neighbors=[GuidedTour.tsx, QueryConsultingPage.tsx]
- "common_guidedtour_iguidedtourstep": "IGuidedTourStep" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L18 | neighbors=[GuidedTour.tsx, QueryConsultingPage.tsx]
- "common_guidedtour_isrendered": "isRendered()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L73 | neighbors=[GuidedTour.tsx, findTarget()]
- "common_guidedtour_prefersreducedmotion": "prefersReducedMotion()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L78 | neighbors=[GuidedTour.tsx, revealTarget()]
- "common_hoursimportpreview_hoursimportpreview": "HoursImportPreview()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/HoursImportPreview.tsx:L21 | neighbors=[HoursImportPreview.tsx, ImportSourceModal.tsx]
- "common_importsourcelist_iimportsource": "IImportSource" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceList.tsx:L6 | neighbors=[ImportSourceList.tsx, ImportSourceModal.tsx]
- "common_importsourcelist_importsourcelist": "ImportSourceList()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceList.tsx:L30 | neighbors=[ImportSourceList.tsx, ImportSourceModal.tsx]
- "common_integrateddivisiontabs_divisioncontext": "DivisionContext" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L39 | neighbors=[BidTabHeader.tsx, IntegratedDivisionTabs.tsx]
- "common_peoplepicker_igraphresult": "IGraphResult" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PeoplePicker.tsx:L17 | neighbors=[PeoplePicker.tsx, IPickedPerson]
- "common_peoplepicker_peoplepicker": "PeoplePicker()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PeoplePicker.tsx:L29 | neighbors=[ErnCreateModal.tsx, PeoplePicker.tsx]
- "common_prioritybadge_prioritybadge": "PriorityBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PriorityBadge.tsx:L10 | neighbors=[PriorityBadge.tsx, SystemConfiguration.tsx]
- "common_querycatalogloadingbanner_querycatalogloadingbanner": "QueryCatalogLoadingBanner()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/QueryCatalogLoadingBanner.tsx:L12 | neighbors=[QueryCatalogLoadingBanner.tsx, AppLayout.tsx]
- "common_requirepageaccess_requirepageaccess": "RequirePageAccess()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/RequirePageAccess.tsx:L37 | neighbors=[RequirePageAccess.tsx, AppLayout.tsx]
- "common_requirepageaccess_viewonlybanner": "ViewOnlyBanner()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/RequirePageAccess.tsx:L27 | neighbors=[RequirePageAccess.tsx, BidDetailPage.tsx]
- "common_richtexteditor_richtexteditor": "RichTextEditor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/RichTextEditor.tsx:L12 | neighbors=[RichTextEditor.tsx, CreateRequestPage.tsx]
- "common_scopeimportpreview_iscopeimportresult": "IScopeImportResult" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ScopeImportPreview.tsx:L12 | neighbors=[ImportSourceModal.tsx, ScopeImportPreview.tsx]
- "common_scopeimportpreview_scopeimportpreview": "ScopeImportPreview()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ScopeImportPreview.tsx:L35 | neighbors=[ImportSourceModal.tsx, ScopeImportPreview.tsx]
- "common_toastcontainer_toastcontainer": "ToastContainer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ToastContainer.tsx:L84 | neighbors=[ToastContainer.tsx, AppLayout.tsx]
- "config_accesscontrol_config_normalizeaccesslevels": "normalizeAccessLevels()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L224 | neighbors=[accessControl.config.ts, normalizeAccessConfig()]
- "config_accesscontrol_config_normalizebidaccesslevels": "normalizeBidAccessLevels()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L252 | neighbors=[accessControl.config.ts, normalizeAccessConfig()]
- "config_defaultfavoritegroups_nextid": "nextId()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/defaultFavoriteGroups.ts:L8 | neighbors=[defaultFavoriteGroups.ts, makeGroup()]
- "config_notifications_config_builddefaultrule": "buildDefaultRule()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L246 | neighbors=[notifications.config.ts, teamRule()]
- "config_notifications_config_clampdeadlinewarningdays": "clampDeadlineWarningDays()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L291 | neighbors=[notifications.config.ts, normalizeNotificationSettings()]
- "config_notifications_config_normalizenotificationsettings": "normalizeNotificationSettings()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L298 | neighbors=[notifications.config.ts, clampDeadlineWarningDays()]
- "config_notifications_config_normalizeteamrule": "normalizeTeamRule()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L279 | neighbors=[notifications.config.ts, teamRule()]
- "config_phases_config_getphaselabel": "getPhaseLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L281 | neighbors=[phases.config.ts, getPhaseConfig()]
- "config_phases_config_getphasetasks": "getPhaseTasks()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L285 | neighbors=[phases.config.ts, getPhaseConfig()]
- "config_spfxcontext_spfxcontext": "SpfxContext" | kind=code-symbol | source=src/webparts/smartBid20/app/config/SpfxContext.ts:L7 | neighbors=[SmartBid20.tsx, SpfxContext.ts]
- "config_status_config_getphasecolor": "getPhaseColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L285 | neighbors=[status.config.ts, getPhaseDef()]
- "config_status_config_getphasedef": "getPhaseDef()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L260 | neighbors=[status.config.ts, getPhaseColor()]
- "config_status_config_getstatuscolor": "getStatusColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L277 | neighbors=[status.config.ts, getStatusDef()]
- "config_status_config_getstatusdef": "getStatusDef()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L227 | neighbors=[status.config.ts, getStatusColor()]
- "config_status_config_getsubstatuscolor": "getSubStatusColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L416 | neighbors=[status.config.ts, getSubStatusDef()]
- "config_status_config_getsubstatusdef": "getSubStatusDef()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/status.config.ts:L395 | neighbors=[status.config.ts, getSubStatusColor()]
- "dashboard_approvalspending_approvalspending": "ApprovalsPending()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ApprovalsPending.tsx:L42 | neighbors=[ApprovalsPending.tsx, DashboardPage.tsx]
- "dashboard_bidsbydivisionchart_bidsbydivisionchart": "BidsByDivisionChart()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByDivisionChart.tsx:L20 | neighbors=[BidsByDivisionChart.tsx, DashboardPage.tsx]
- "dashboard_bidsbystatuschart_bidsbystatuschart": "BidsByStatusChart()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByStatusChart.tsx:L22 | neighbors=[BidsByStatusChart.tsx, DashboardPage.tsx]
- "dashboard_bidsbyurgencychart_bidsbyurgencychart": "BidsByUrgencyChart()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByUrgencyChart.tsx:L31 | neighbors=[BidsByUrgencyChart.tsx, DashboardPage.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-037.json

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
