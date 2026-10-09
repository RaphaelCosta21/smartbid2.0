# Node Description Batch 81 of 86

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

- "survey_surveyspreadpanel_surveyspreadpanelprops": "SurveySpreadPanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySpreadPanel.tsx:L6 | neighbors=[SurveySpreadPanel.tsx]
- "survey_surveysystemscene_anchor_fallback": "ANCHOR_FALLBACK" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L86 | neighbors=[SurveySystemScene.tsx]
- "survey_surveysystemscene_stem_tiers": "STEM_TIERS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L77 | neighbors=[SurveySystemScene.tsx]
- "survey_surveysystemscene_surveysystemscene": "SurveySystemScene()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L105 | neighbors=[SurveySystemScene.tsx]
- "survey_surveysystemscene_surveysystemsceneprops": "SurveySystemSceneProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L51 | neighbors=[SurveySystemScene.tsx]
- "survey_surveysystemscene_swatches": "SWATCHES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L90 | neighbors=[SurveySystemScene.tsx]
- "survey_surveysystemscene_zoneforanchor": "zoneForAnchor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L101 | neighbors=[SurveySystemScene.tsx]
- "survey3d_cableflow_cable": "Cable" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L9 | neighbors=[cableFlow.ts]
- "survey3d_cableflow_cablenetwork_setenabled": ".setEnabled()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L105 | neighbors=[CableNetwork]
- "survey3d_cableflow_cablenetwork_sethover": ".setHover()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L92 | neighbors=[CableNetwork]
- "survey3d_cableflow_cablenetwork_setvisible": ".setVisible()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L100 | neighbors=[CableNetwork]
- "survey3d_cableflow_cablenetwork_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L119 | neighbors=[CableNetwork]
- "survey3d_cableflow_kindmaterials": "KindMaterials" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L19 | neighbors=[cableFlow.ts]
- "survey3d_cableflow_makematerials": "makeMaterials()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L21 | neighbors=[cableFlow.ts]
- "survey3d_createsurveyscene_disposeobject": "disposeObject()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L1096 | neighbors=[createSurveyScene.ts]
- "survey3d_createsurveyscene_palette": "PALETTE" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L23 | neighbors=[createSurveyScene.ts]
- "survey3d_createsurveyscene_surveysceneoptions": "SurveySceneOptions" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L65 | neighbors=[createSurveyScene.ts]
- "survey3d_createsurveyscene_vessel_rooms": "VESSEL_ROOMS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L48 | neighbors=[createSurveyScene.ts]
- "survey3d_createsurveyscene_vessel_scale": "VESSEL_SCALE" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L46 | neighbors=[createSurveyScene.ts]
- "survey3d_equipmentmodels_equipmentmodelfactory_dispose": ".dispose()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L65 | neighbors=[EquipmentModelFactory]
- "survey3d_equipmentmodels_equipmentmodelfactory_loadglb": ".loadGlb()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L55 | neighbors=[EquipmentModelFactory]
- "survey3d_equipmentmodels_equipmentmodelfactory_mat": ".mat()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L73 | neighbors=[EquipmentModelFactory]
- "survey3d_equipmentmodels_glowing": "GLOWING" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L36 | neighbors=[equipmentModels.ts]
- "survey3d_equipmentmodels_oii": "OII" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L9 | neighbors=[equipmentModels.ts]
- "survey3d_equipmentmodels_tone": "Tone" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L22 | neighbors=[equipmentModels.ts]
- "survey3d_equipmentmodels_tones": "TONES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L24 | neighbors=[equipmentModels.ts]
- "survey3d_explodelayout_layoutcluster": "LayoutCluster" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/explodeLayout.ts:L14 | neighbors=[explodeLayout.ts]
- "survey3d_explodelayout_layoutitem": "LayoutItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/explodeLayout.ts:L8 | neighbors=[explodeLayout.ts]
- "survey3d_explodelayout_layoutoptions": "LayoutOptions" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/explodeLayout.ts:L30 | neighbors=[explodeLayout.ts]
- "survey3d_explodelayout_world_up": "WORLD_UP" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/explodeLayout.ts:L46 | neighbors=[explodeLayout.ts]
- "survey3d_focuscontroller_easeoutback": "easeOutBack()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L46 | neighbors=[focusController.ts]
- "survey3d_focuscontroller_easeoutcubic": "easeOutCubic()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L45 | neighbors=[focusController.ts]
- "survey3d_focuscontroller_empty_states": "EMPTY_STATES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L51 | neighbors=[focusController.ts]
- "survey3d_focuscontroller_focuscontroller_constructor": ".constructor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L74 | neighbors=[FocusController]
- "survey3d_focuscontroller_focuscontroller_getlabeltarget": ".getLabelTarget()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L172 | neighbors=[FocusController]
- "survey3d_focuscontroller_focuscontroller_isopen": ".isOpen()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L78 | neighbors=[FocusController]
- "survey3d_focuscontroller_focuscontroller_setcablehover": ".setCableHover()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L163 | neighbors=[FocusController]
- "survey3d_focuscontroller_focuscontroller_setcablesenabled": ".setCablesEnabled()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L167 | neighbors=[FocusController]
- "survey3d_focuscontroller_focuscontroller_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L183 | neighbors=[FocusController]
- "survey3d_focuscontroller_leavingentry": "LeavingEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L24 | neighbors=[focusController.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-080.json

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
