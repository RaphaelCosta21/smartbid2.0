# Node Description Batch 49 of 86

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

- "survey_surveyassets_survey_ocean_bg": "SURVEY_OCEAN_BG" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/surveyAssets.ts:L2 | neighbors=[SurveyEquipmentPage.tsx, surveyAssets.ts]
- "survey_surveyequipmentcard_surveyequipmentcard": "SurveyEquipmentCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentCard.tsx:L40 | neighbors=[SurveyEquipmentPage.tsx, SurveyEquipmentCard.tsx]
- "survey_surveyequipmentdetail_formatusd": "formatUSD()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentDetail.tsx:L31 | neighbors=[SurveyEquipmentDetail.tsx, SurveyEquipmentDetail()]
- "survey_surveyequipmentdetail_safeurl": "safeUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentDetail.tsx:L28 | neighbors=[SurveyEquipmentDetail.tsx, SurveyEquipmentDetail()]
- "survey_surveyportalheader_surveysearchhit": "SurveySearchHit" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPortalHeader.tsx:L22 | neighbors=[SurveySystemPage.tsx, SurveyPortalHeader.tsx]
- "survey_surveyspreadpanel_surveyspreadpanel": "SurveySpreadPanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySpreadPanel.tsx:L36 | neighbors=[SurveySystemPage.tsx, SurveySpreadPanel.tsx]
- "survey_surveysystemscene_surveycableinfo": "SurveyCableInfo" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L38 | neighbors=[SurveySystemPage.tsx, SurveySystemScene.tsx]
- "survey_surveysystemscene_surveyscenetour": "SurveySceneTour" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L31 | neighbors=[SurveySystemPage.tsx, SurveySystemScene.tsx]
- "survey_surveysystemscene_surveytracestep": "SurveyTraceStep" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L44 | neighbors=[SurveySystemPage.tsx, SurveySystemScene.tsx]
- "survey3d_cableflow_cablenetwork_dispose": ".dispose()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L152 | neighbors=[CableNetwork, .clear()]
- "survey3d_cableflow_cablenetwork_settrace": ".setTrace()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L109 | neighbors=[CableNetwork, .applyTrace()]
- "survey3d_createsurveyscene_hullslab": "hullSlab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L115 | neighbors=[createSurveyScene.ts, buildProceduralVessel()]
- "survey3d_createsurveyscene_iswebglavailable": "isWebGLAvailable()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L75 | neighbors=[createSurveyScene.ts, SurveySystemScene.tsx]
- "survey3d_createsurveyscene_seabedheight": "seabedHeight()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L275 | neighbors=[createSurveyScene.ts, createSurveyScene()]
- "survey3d_createsurveyscene_surveysceneapi": "SurveySceneApi" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L50 | neighbors=[createSurveyScene.ts, SurveySystemScene.tsx]
- "survey3d_equipmentmodels_equipmentmodelfactory_geo": ".geo()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L89 | neighbors=[EquipmentModelFactory, .buildShape()]
- "survey3d_equipmentmodels_normalize": "normalize()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L327 | neighbors=[equipmentModels.ts, .build()]
- "survey3d_explodelayout_explodelayout": "ExplodeLayout" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/explodeLayout.ts:L20 | neighbors=[explodeLayout.ts, focusController.ts]
- "survey3d_explodelayout_layoutexplode": "layoutExplode()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/explodeLayout.ts:L48 | neighbors=[createSurveyScene.ts, explodeLayout.ts]
- "survey3d_focuscontroller_focuscontroller_close": ".close()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L152 | neighbors=[FocusController, .retractAll()]
- "survey3d_focuscontroller_focuscontroller_dispose": ".dispose()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L227 | neighbors=[FocusController, .disposeEntry()]
- "survey3d_focuscontroller_focuscontroller_disposeentry": ".disposeEntry()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L250 | neighbors=[FocusController, .dispose()]
- "survey3d_focuscontroller_focuscontroller_setstates": ".setStates()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L158 | neighbors=[FocusController, .applyStates()]
- "survey3d_scenetypes_link_colors": "LINK_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L89 | neighbors=[cableFlow.ts, sceneTypes.ts]
- "survey3d_scenetypes_sceneshape": "SceneShape" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L16 | neighbors=[equipmentModels.ts, sceneTypes.ts]
- "survey3d_trunkflow_trunknetwork_build": ".build()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/trunkFlow.ts:L52 | neighbors=[TrunkNetwork, .clear()]
- "survey3d_trunkflow_trunknetwork_dispose": ".dispose()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/trunkFlow.ts:L162 | neighbors=[TrunkNetwork, .clear()]
- "template_templatecard_templatecard": "TemplateCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateCard.tsx:L14 | neighbors=[TemplatesPage.tsx, TemplateCard.tsx]
- "template_templateeditor_templateeditor": "TemplateEditor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateEditor.tsx:L25 | neighbors=[TemplatesPage.tsx, TemplateEditor.tsx]
- "template_templatepreview_templatepreview": "TemplatePreview()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplatePreview.tsx:L11 | neighbors=[TemplatesPage.tsx, TemplatePreview.tsx]
- "typings_svg_d": "svg.d.ts" | kind=code-symbol | source=src/typings/svg.d.ts:L1 | neighbors=[1665b01 more features, *.svg]
- "utils_accesscontrol_candeletelevel": "canDeleteLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L125 | neighbors=[BidDetailPage.tsx, accessControl.ts]
- "utils_accesscontrol_canedit": "canEdit()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L90 | neighbors=[accessControl.ts, hasAccess()]
- "utils_accesscontrol_canview": "canView()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L94 | neighbors=[accessControl.ts, hasAccess()]
- "utils_accesscontrol_canviewlevel": "canViewLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L119 | neighbors=[accessControl.ts, canEditLevel()]
- "utils_accesscontrol_issuperadminmaster": "isSuperAdminMaster()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L31 | neighbors=[SystemConfiguration.tsx, accessControl.ts]
- "utils_accesscontrol_removescollaborationcontent": "removesCollaborationContent()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L128 | neighbors=[BidDetailPage.tsx, accessControl.ts]
- "utils_accesscontrol_rolebidlevels": "roleBidLevels()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L49 | neighbors=[accessControl.ts, resolveBidTabLevel()]
- "utils_activityloghelpers_activity_categories": "ACTIVITY_CATEGORIES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/activityLogHelpers.ts:L14 | neighbors=[BidActivityLog.tsx, activityLogHelpers.ts]
- "utils_activityloghelpers_activitycategory": "ActivityCategory" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/activityLogHelpers.ts:L6 | neighbors=[BidActivityLog.tsx, activityLogHelpers.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-048.json

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
