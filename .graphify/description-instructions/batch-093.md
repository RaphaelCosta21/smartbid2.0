# Node Description Batch 94 of 102

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

- "survey_surveycomposition3d_headstyle": "headStyle" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyComposition3D.tsx:L39 | neighbors=[SurveyComposition3D.tsx]
- "survey_surveycomposition3d_overlaystyle": "overlayStyle" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyComposition3D.tsx:L18 | neighbors=[SurveyComposition3D.tsx]
- "survey_surveycomposition3d_panelstyle": "panelStyle" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyComposition3D.tsx:L28 | neighbors=[SurveyComposition3D.tsx]
- "survey_surveycomposition3d_sceneareastyle": "sceneAreaStyle" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyComposition3D.tsx:L70 | neighbors=[SurveyComposition3D.tsx]
- "survey_surveycomposition3d_surveycomposition3dprops": "SurveyComposition3DProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyComposition3D.tsx:L14 | neighbors=[SurveyComposition3D.tsx]
- "survey_surveycomposition3d_surveysystemscene": "SurveySystemScene" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyComposition3D.tsx:L9 | neighbors=[SurveyComposition3D.tsx]
- "survey_surveycomposition3d_titlestyle": "titleStyle" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyComposition3D.tsx:L52 | neighbors=[SurveyComposition3D.tsx]
- "survey_surveyequipment3dthumb_props": "Props" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipment3DThumb.tsx:L6 | neighbors=[SurveyEquipment3DThumb.tsx]
- "survey_surveyequipmentcard_surveyequipmentcard": "SurveyEquipmentCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentCard.tsx:L40 | neighbors=[SurveyEquipmentCard.tsx]
- "survey_surveyequipmentcard_surveyequipmentcardprops": "SurveyEquipmentCardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentCard.tsx:L6 | neighbors=[SurveyEquipmentCard.tsx]
- "survey_surveyequipmentdetail_fiticon": "FitIcon()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentDetail.tsx:L54 | neighbors=[SurveyEquipmentDetail.tsx]
- "survey_surveyequipmentdetail_surveyequipmentdetailprops": "SurveyEquipmentDetailProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentDetail.tsx:L25 | neighbors=[SurveyEquipmentDetail.tsx]
- "survey_surveyfailurepanel_surveyfailurepanelprops": "SurveyFailurePanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyFailurePanel.tsx:L6 | neighbors=[SurveyFailurePanel.tsx]
- "survey_surveygappanel_surveygappanelprops": "SurveyGapPanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyGapPanel.tsx:L5 | neighbors=[SurveyGapPanel.tsx]
- "survey_surveyglossary_anatomy": "Anatomy()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyGlossary.tsx:L53 | neighbors=[SurveyGlossary.tsx]
- "survey_surveyglossary_category_order": "CATEGORY_ORDER" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyGlossary.tsx:L36 | neighbors=[SurveyGlossary.tsx]
- "survey_surveyglossary_decode_sample_for": "DECODE_SAMPLE_FOR" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyGlossary.tsx:L41 | neighbors=[SurveyGlossary.tsx]
- "survey_surveyglossary_hexof": "hexOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyGlossary.tsx:L51 | neighbors=[SurveyGlossary.tsx]
- "survey_surveyglossary_isurveyglossaryprops": "ISurveyGlossaryProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyGlossary.tsx:L23 | neighbors=[SurveyGlossary.tsx]
- "survey_surveyglossary_surveyglossarytab": "SurveyGlossaryTab" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyGlossary.tsx:L21 | neighbors=[SurveyGlossary.tsx]
- "survey_surveyglossary_tones": "TONES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyGlossary.tsx:L49 | neighbors=[SurveyGlossary.tsx]
- "survey_surveyjourneydeliverables_icons": "ICONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyJourneyDeliverables.tsx:L18 | neighbors=[SurveyJourneyDeliverables.tsx]
- "survey_surveyjourneydeliverables_isurveydeliverableitem": "ISurveyDeliverableItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyJourneyDeliverables.tsx:L6 | neighbors=[SurveyJourneyDeliverables.tsx]
- "survey_surveyjourneydeliverables_surveyjourneydeliverablesprops": "SurveyJourneyDeliverablesProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyJourneyDeliverables.tsx:L13 | neighbors=[SurveyJourneyDeliverables.tsx]
- "survey_surveynmealab_isurveynmealabprops": "ISurveyNmeaLabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyNmeaLab.tsx:L9 | neighbors=[SurveyNmeaLab.tsx]
- "survey_surveypackagedrawer_closed_statuses": "CLOSED_STATUSES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPackageDrawer.tsx:L31 | neighbors=[SurveyPackageDrawer.tsx]
- "survey_surveypackagedrawer_surveypackagedrawerprops": "SurveyPackageDrawerProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPackageDrawer.tsx:L27 | neighbors=[SurveyPackageDrawer.tsx]
- "survey_surveyportalheader_surveyportalheaderprops": "SurveyPortalHeaderProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPortalHeader.tsx:L32 | neighbors=[SurveyPortalHeader.tsx]
- "survey_surveyportalheader_surveyrank": "surveyRank()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPortalHeader.tsx:L41 | neighbors=[SurveyPortalHeader.tsx]
- "survey_surveyspreadpanel_maincategory": "mainCategory()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySpreadPanel.tsx:L29 | neighbors=[SurveySpreadPanel.tsx]
- "survey_surveyspreadpanel_surveyspreadpanelprops": "SurveySpreadPanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySpreadPanel.tsx:L6 | neighbors=[SurveySpreadPanel.tsx]
- "survey_surveysystemscene_anchor_fallback": "ANCHOR_FALLBACK" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L144 | neighbors=[SurveySystemScene.tsx]
- "survey_surveysystemscene_stem_tiers": "STEM_TIERS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L135 | neighbors=[SurveySystemScene.tsx]
- "survey_surveysystemscene_surveysystemscene": "SurveySystemScene()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L168 | neighbors=[SurveySystemScene.tsx]
- "survey_surveysystemscene_surveysystemsceneprops": "SurveySystemSceneProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L92 | neighbors=[SurveySystemScene.tsx]
- "survey_surveysystemscene_swatches": "SWATCHES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L148 | neighbors=[SurveySystemScene.tsx]
- "survey_surveysystemscene_zoneforanchor": "zoneForAnchor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L159 | neighbors=[SurveySystemScene.tsx]
- "survey3d_cableflow_cable": "Cable" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L9 | neighbors=[cableFlow.ts]
- "survey3d_cableflow_cablenetwork_getcurve": ".getCurve()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L101 | neighbors=[CableNetwork]
- "survey3d_cableflow_cablenetwork_setenabled": ".setEnabled()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L112 | neighbors=[CableNetwork]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-093.json

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
