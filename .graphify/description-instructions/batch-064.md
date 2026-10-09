# Node Description Batch 65 of 86

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

- "dashboard_ernwatchlist_empty_text": "EMPTY_TEXT" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnWatchlist.tsx:L42 | neighbors=[ErnWatchlist.tsx]
- "dashboard_ernwatchlist_ernwatchlistprops": "ErnWatchlistProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnWatchlist.tsx:L28 | neighbors=[ErnWatchlist.tsx]
- "dashboard_ernwatchlist_filters": "FILTERS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnWatchlist.tsx:L35 | neighbors=[ErnWatchlist.tsx]
- "dashboard_ernwatchlist_initials": "initials()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnWatchlist.tsx:L57 | neighbors=[ErnWatchlist.tsx]
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
- "favorites_addfavoriteequipmentmodal_addfavoriteequipmentmodalprops": "AddFavoriteEquipmentModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L42 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "favorites_addfavoriteequipmentmodal_addmode": "AddMode" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L54 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "favorites_addfavoriteequipmentmodal_icandidate": "ICandidate" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L68 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "favorites_addfavoriteequipmentmodal_isection": "ISection" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L74 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "favorites_addfavoriteequipmentmodal_istageditem": "IStagedItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L56 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "favorites_addfavoriteequipmentmodal_normdesc": "normDesc()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L84 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "favorites_addfavoriteequipmentmodal_normpn": "normPn()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L83 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "favorites_addfavoriteequipmentmodal_partthumb": "PartThumb()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L90 | neighbors=[AddFavoriteEquipmentModal.tsx]
- "function_app_document_structure_breadcrumb": "breadcrumb()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L357 | neighbors=[document_structure.py]
- "function_app_document_structure_rationale_1": "document_structure.py — section-aware Markdown chunking for the SmartBid docs in" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L1 | neighbors=[document_structure.py]
- "function_app_document_structure_rationale_106": "Guards against all-caps noise such as the \"X X X X\" row of a maintenance\r     ma" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L106 | neighbors=[_has_word()]
- "function_app_document_structure_rationale_112": "Guards against all-caps noise such as the \"X X X X\" row of a maintenance\r     ma" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L112 | neighbors=[_has_word()]
- "function_app_document_structure_rationale_120": "A single-level number is indistinguishable from a quantity in a\r     specificati" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L120 | neighbors=[_numbered_title()]
- "function_app_document_structure_rationale_126": "A single-level number is indistinguishable from a quantity in a\r     specificati" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L126 | neighbors=[_numbered_title()]
- "function_app_document_structure_rationale_132": "Collapse whitespace and mask digits so \"Page 3 of 19\" and \"Page 4 of 19\"\r     co" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L132 | neighbors=[_normalize()]
- "function_app_document_structure_rationale_153": "Digit masking is what catches a running footer, but it also makes a\r     measure" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L153 | neighbors=[_is_boilerplate()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-064.json

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
