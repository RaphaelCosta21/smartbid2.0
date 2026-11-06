# Node Description Batch 77 of 102

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

- "dashboard_ernwatchlist_toneclass": "toneClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnWatchlist.tsx:L49 | neighbors=[ErnWatchlist.tsx]
- "dashboard_livefocusoverlay_focusmode": "FocusMode" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/LiveFocusOverlay.tsx:L17 | neighbors=[LiveFocusOverlay.tsx]
- "dashboard_livefocusoverlay_focusorigin": "FocusOrigin" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/LiveFocusOverlay.tsx:L12 | neighbors=[LiveFocusOverlay.tsx]
- "dashboard_livefocusoverlay_invert": "invert()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/LiveFocusOverlay.tsx:L75 | neighbors=[LiveFocusOverlay.tsx]
- "dashboard_livefocusoverlay_livefocusoverlayprops": "LiveFocusOverlayProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/LiveFocusOverlay.tsx:L54 | neighbors=[LiveFocusOverlay.tsx]
- "dashboard_livefocusoverlay_phase": "Phase" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/LiveFocusOverlay.tsx:L63 | neighbors=[LiveFocusOverlay.tsx]
- "dashboard_monthlyvolumechart_monthlyvolumechart": "MonthlyVolumeChart()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/MonthlyVolumeChart.tsx:L11 | neighbors=[MonthlyVolumeChart.tsx]
- "dashboard_monthlyvolumechart_monthlyvolumechartprops": "MonthlyVolumeChartProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/MonthlyVolumeChart.tsx:L6 | neighbors=[MonthlyVolumeChart.tsx]
- "dashboard_recentactivity_recentactivity": "RecentActivity()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/RecentActivity.tsx:L24 | neighbors=[RecentActivity.tsx]
- "dashboard_recentactivity_recentactivityprops": "RecentActivityProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/RecentActivity.tsx:L7 | neighbors=[RecentActivity.tsx]
- "dashboard_recentactivity_type_colors": "TYPE_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/RecentActivity.tsx:L12 | neighbors=[RecentActivity.tsx]
- "dashboard_upcomingdeadlines_focus_groups": "FOCUS_GROUPS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/UpcomingDeadlines.tsx:L20 | neighbors=[UpcomingDeadlines.tsx]
- "dashboard_upcomingdeadlines_upcomingdeadlinesprops": "UpcomingDeadlinesProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/UpcomingDeadlines.tsx:L14 | neighbors=[UpcomingDeadlines.tsx]
- "data_defaultsystemconfig_default_system_config": "DEFAULT_SYSTEM_CONFIG" | kind=code-symbol | source=src/webparts/smartBid20/app/data/defaultSystemConfig.ts:L13 | neighbors=[defaultSystemConfig.ts]
- "data_mockapprovals_mockapprovals": "mockApprovals" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockApprovals.ts:L3 | neighbors=[mockApprovals.ts]
- "data_mocknotifications_mock_notifications": "MOCK_NOTIFICATIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockNotifications.ts:L3 | neighbors=[mockNotifications.ts]
- "data_mockrequests_mockrequests": "mockRequests" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockRequests.ts:L3 | neighbors=[mockRequests.ts]
- "data_mocktemplates_ibidtemplate": "IBidTemplate" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockTemplates.ts:L1 | neighbors=[mockTemplates.ts]
- "data_mocktemplates_mock_templates": "MOCK_TEMPLATES" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockTemplates.ts:L16 | neighbors=[mockTemplates.ts]
- "docref_rfc_4180": "RFC-4180" | kind=entity | source=src/webparts/smartBid20/app/utils/csvParser.ts:L2 | neighbors=[csvParser.ts]
- "effects_roveffects_tmp": "tmp" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/rovEffects.ts:L17 | neighbors=[rovEffects.ts]
- "effects_roveffects_tmpb": "tmpB" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/rovEffects.ts:L18 | neighbors=[rovEffects.ts]
- "effects_seabedeffects_sound_colors": "SOUND_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/seabedEffects.ts:L174 | neighbors=[seabedEffects.ts]
- "effects_seabedeffects_sound_speeds": "SOUND_SPEEDS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/seabedEffects.ts:L173 | neighbors=[seabedEffects.ts]
- "effects_seabedeffects_tmp": "tmp" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/seabedEffects.ts:L5 | neighbors=[seabedEffects.ts]
- "effects_seabedeffects_tmpb": "tmpB" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/seabedEffects.ts:L6 | neighbors=[seabedEffects.ts]
- "effects_signaleffects_pad2": "pad2()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/signalEffects.ts:L8 | neighbors=[signalEffects.ts]
- "effects_signaleffects_tmp": "tmp" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/signalEffects.ts:L5 | neighbors=[signalEffects.ts]
- "effects_signaleffects_tmpb": "tmpB" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/signalEffects.ts:L6 | neighbors=[signalEffects.ts]
- "effects_vesseleffects_northdir": "northDir" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/vesselEffects.ts:L65 | neighbors=[vesselEffects.ts]
- "effects_vesseleffects_tmp": "tmp" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/vesselEffects.ts:L16 | neighbors=[vesselEffects.ts]
- "favorites_addfavoriteequipmentmodal_addfavoriteequipmentmodalprops": "AddFavoriteEquipmentModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L42 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "favorites_addfavoriteequipmentmodal_addmode": "AddMode" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L54 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "favorites_addfavoriteequipmentmodal_icandidate": "ICandidate" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L68 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "favorites_addfavoriteequipmentmodal_isection": "ISection" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L74 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "favorites_addfavoriteequipmentmodal_istageditem": "IStagedItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L56 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "favorites_addfavoriteequipmentmodal_normdesc": "normDesc()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L84 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "favorites_addfavoriteequipmentmodal_normpn": "normPn()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L83 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "favorites_addfavoriteequipmentmodal_partthumb": "PartThumb()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L90 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "function_app_document_structure_breadcrumb": "breadcrumb()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L357 | neighbors=[document_structure.py]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-076.json

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
