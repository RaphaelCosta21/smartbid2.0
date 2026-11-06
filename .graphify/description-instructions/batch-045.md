# Node Description Batch 46 of 102

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

- "config_surveydataformats_data_origins": "DATA_ORIGINS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyDataFormats.ts:L82 | neighbors=[surveyDataFormats.ts, surveyDataJourney.ts]
- "config_surveydataformats_data_samples": "DATA_SAMPLES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyDataFormats.ts:L223 | neighbors=[surveyDataFormats.ts, surveyDataJourney.ts]
- "config_surveydataformats_data_type_names": "DATA_TYPE_NAMES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyDataFormats.ts:L66 | neighbors=[surveyDataFormats.ts, surveyDataJourney.ts]
- "config_surveydataformats_deliverable_rules": "DELIVERABLE_RULES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyDataFormats.ts:L532 | neighbors=[surveyDataFormats.ts, surveyDataJourney.ts]
- "config_surveydataformats_idataformat": "IDataFormat" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyDataFormats.ts:L11 | neighbors=[surveyDataFormats.ts, surveyDataJourney.ts]
- "config_surveydataformats_ijourneyoverride": "IJourneyOverride" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyDataFormats.ts:L318 | neighbors=[surveyDataFormats.ts, surveyDataJourney.ts]
- "config_surveydataformats_journey_kind_labels": "JOURNEY_KIND_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyDataFormats.ts:L52 | neighbors=[surveyDataFormats.ts, SurveySystemPage.tsx]
- "config_surveydataformats_journey_overrides": "JOURNEY_OVERRIDES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyDataFormats.ts:L333 | neighbors=[surveyDataFormats.ts, surveyDataJourney.ts]
- "config_surveydataformats_link_format_overrides": "LINK_FORMAT_OVERRIDES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyDataFormats.ts:L298 | neighbors=[surveyDataFormats.ts, surveyDataJourney.ts]
- "config_surveydataformats_link_formats": "LINK_FORMATS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyDataFormats.ts:L286 | neighbors=[surveyDataFormats.ts, surveyDataJourney.ts]
- "config_surveydataformats_role_captions": "ROLE_CAPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyDataFormats.ts:L494 | neighbors=[surveyDataFormats.ts, surveyDataJourney.ts]
- "config_surveydataformats_stage_formats": "STAGE_FORMATS" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyDataFormats.ts:L516 | neighbors=[surveyDataFormats.ts, surveyDataJourney.ts]
- "config_surveyglossary_seg": "seg()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyGlossary.ts:L17 | neighbors=[surveyGlossary.ts, t()]
- "config_surveyglossary_survey_glossary_categories": "SURVEY_GLOSSARY_CATEGORIES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyGlossary.ts:L22 | neighbors=[surveyGlossary.ts, SurveyGlossary.tsx]
- "config_surveyglossary_t": "t()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyGlossary.ts:L15 | neighbors=[surveyGlossary.ts, seg()]
- "dashboard_approvalspending_approvalspending": "ApprovalsPending()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ApprovalsPending.tsx:L42 | neighbors=[ApprovalsPending.tsx, DashboardPage.tsx]
- "dashboard_bidsbydivisionchart_bidsbydivisionchart": "BidsByDivisionChart()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByDivisionChart.tsx:L20 | neighbors=[BidsByDivisionChart.tsx, DashboardPage.tsx]
- "dashboard_bidsbystatuschart_bidsbystatuschart": "BidsByStatusChart()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByStatusChart.tsx:L22 | neighbors=[BidsByStatusChart.tsx, DashboardPage.tsx]
- "dashboard_bidsbyurgencychart_bidsbyurgencychart": "BidsByUrgencyChart()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByUrgencyChart.tsx:L31 | neighbors=[BidsByUrgencyChart.tsx, DashboardPage.tsx]
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
- "effects_effecttypes_sceneeffect": "SceneEffect" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectTypes.ts:L27 | neighbors=[effectTypes.ts, phenomenonController.ts]
- "effects_effectutils_applyfade": "applyFade()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectUtils.ts:L46 | neighbors=[effectUtils.ts, phenomenonController.ts]
- "effects_effectutils_disposegroup": "disposeGroup()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectUtils.ts:L56 | neighbors=[effectUtils.ts, phenomenonController.ts]
- "effects_effectutils_labelsprite": "labelSprite()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectUtils.ts:L71 | neighbors=[effectUtils.ts, vesselEffects.ts]
- "effects_effectutils_orient": "orient()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectUtils.ts:L101 | neighbors=[effectUtils.ts, rovEffects.ts]
- "effects_effectutils_up": "UP" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectUtils.ts:L14 | neighbors=[effectUtils.ts, vesselEffects.ts]
- "effects_index_effect_builders": "EFFECT_BUILDERS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/index.ts:L13 | neighbors=[index.ts, phenomenonController.ts]
- "effects_roveffects_buildaltimeterecho": "buildAltimeterEcho()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/rovEffects.ts:L48 | neighbors=[index.ts, rovEffects.ts]
- "effects_roveffects_buildcameraview": "buildCameraView()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/rovEffects.ts:L145 | neighbors=[index.ts, rovEffects.ts]
- "effects_roveffects_buildrovmotion": "buildRovMotion()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/rovEffects.ts:L21 | neighbors=[index.ts, rovEffects.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-045.json

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
