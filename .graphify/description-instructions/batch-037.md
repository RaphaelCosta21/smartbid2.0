# Node Description Batch 38 of 102

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

- "settings_notificationmatrix_teamlabel": "teamLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L119 | neighbors=[NotificationMatrix.tsx, pillTitle(), TeamRuleEditor()]
- "settings_notificationmatrix_teamruleeditor": "TeamRuleEditor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L435 | neighbors=[NotificationMatrix.tsx, audienceParts(), teamLabel()]
- "sheets_assetssheet_buildassetssheet": "buildAssetsSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/assetsSheet.ts:L27 | neighbors=[index.ts, assetsSheet.ts, fmtBRL()]
- "sheets_infosheet_buildinfosheet": "buildInfoSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/infoSheet.ts:L21 | neighbors=[index.ts, infoSheet.ts, people()]
- "stores_usenotificationstore_usenotificationstore": "useNotificationStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useNotificationStore.ts:L16 | neighbors=[Header.tsx, NotificationsPage.tsx, useNotificationStore.ts]
- "stores_userequeststore_userequeststore": "useRequestStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useRequestStore.ts:L18 | neighbors=[useRequests.ts, CreateRequestPage.tsx, useRequestStore.ts]
- "stores_usetemplatestore_usetemplatestore": "useTemplateStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useTemplateStore.ts:L25 | neighbors=[ImportSourceModal.tsx, useTemplates.ts, useTemplateStore.ts]
- "stores_useuistore_thememode": "ThemeMode" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L7 | neighbors=[Header.tsx, SystemConfiguration.tsx, useUIStore.ts]
- "suppliers_supplierdrawer_supplierdrawer": "SupplierDrawer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/suppliers/SupplierDrawer.tsx:L88 | neighbors=[SuppliersRegistry.tsx, SupplierDrawer.tsx, initials()]
- "survey_glossarycontext_glossarycontext": "GlossaryContext" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/GlossaryContext.ts:L13 | neighbors=[SurveySystemPage.tsx, GlossaryContext.ts, GlossaryText.tsx]
- "survey_glossarytext_glossarytext": "GlossaryText()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/GlossaryText.tsx:L122 | neighbors=[GlossaryText.tsx, SurveyEquipmentDetail.tsx, SurveySystemScene.tsx]
- "survey_surveyequipmentcard_surveyequipmentphoto": "SurveyEquipmentPhoto()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentCard.tsx:L16 | neighbors=[SurveyEquipmentCard.tsx, SurveyEquipmentDetail.tsx, SurveyPackageDrawer.tsx]
- "survey_surveyportalheader_surveyportalheader": "SurveyPortalHeader()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPortalHeader.tsx:L70 | neighbors=[SurveySystemPage.tsx, SurveyPortalHeader.tsx, useDismiss()]
- "survey3d_cableflow_cablenetwork_applytrace": ".applyTrace()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L170 | neighbors=[CableNetwork, .build(), .setTrace()]
- "survey3d_cableflow_cablenetwork_build": ".build()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L55 | neighbors=[CableNetwork, .applyTrace(), .clear()]
- "survey3d_cableflow_cablenetwork_clear": ".clear()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L149 | neighbors=[CableNetwork, .build(), .dispose()]
- "survey3d_createsurveyscene_glow": "glow()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L98 | neighbors=[createSurveyScene.ts, buildRov(), createSurveyScene()]
- "survey3d_deliverablemodels_buildchart": "buildChart()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/deliverableModels.ts:L186 | neighbors=[deliverableModels.ts, canvasTexture(), makeCanvas()]
- "survey3d_deliverablemodels_builddeliverable": "buildDeliverable()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/deliverableModels.ts:L316 | neighbors=[deliverableModels.ts, buildCard(), journeyController.ts]
- "survey3d_deliverablemodels_buildreport": "buildReport()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/deliverableModels.ts:L118 | neighbors=[deliverableModels.ts, canvasTexture(), makeCanvas()]
- "survey3d_deliverablemodels_buildvideo": "buildVideo()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/deliverableModels.ts:L225 | neighbors=[deliverableModels.ts, canvasTexture(), makeCanvas()]
- "survey3d_equipmentmodels_equipmentmodelfactory_build": ".build()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L46 | neighbors=[EquipmentModelFactory, .buildShape(), normalize()]
- "survey3d_equipmentmodels_equipmentmodelfactory_buildshape": ".buildShape()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L94 | neighbors=[EquipmentModelFactory, .build(), .geo()]
- "survey3d_focuscontroller_focuscontroller_applystates": ".applyStates()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L272 | neighbors=[FocusController, .open(), .setStates()]
- "survey3d_focuscontroller_focuscontroller_open": ".open()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L91 | neighbors=[FocusController, .applyStates(), .retractAll()]
- "survey3d_focuscontroller_focuscontroller_retractall": ".retractAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L254 | neighbors=[FocusController, .close(), .open()]
- "survey3d_journeycontroller_journeycontroller_buildcards": ".buildCards()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/journeyController.ts:L255 | neighbors=[JourneyController, .clearCards(), .setStep()]
- "survey3d_journeycontroller_journeycontroller_clearcards": ".clearCards()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/journeyController.ts:L268 | neighbors=[JourneyController, .buildCards(), .dispose()]
- "survey3d_journeycontroller_journeycontroller_updatepacket": ".updatePacket()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/journeyController.ts:L213 | neighbors=[JourneyController, .update(), .pathPoint()]
- "survey3d_phenomenoncontroller_phenomenoncontroller_entry": ".entry()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/phenomenonController.ts:L83 | neighbors=[PhenomenonController, .focus(), .setEffect()]
- "survey3d_phenomenoncontroller_phenomenoncontroller_seteffect": ".setEffect()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/phenomenonController.ts:L37 | neighbors=[PhenomenonController, .emit(), .entry()]
- "survey3d_scenetypes_link_kinds": "LINK_KINDS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L128 | neighbors=[cableFlow.ts, sceneTypes.ts, SurveySystemScene.tsx]
- "survey3d_scenetypes_scenelink": "SceneLink" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L38 | neighbors=[SurveySystemPage.tsx, cableFlow.ts, sceneTypes.ts]
- "survey3d_scenetypes_sceneoverlay": "SceneOverlay" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L63 | neighbors=[SurveySystemPage.tsx, sceneTypes.ts, SurveySystemScene.tsx]
- "survey3d_scenetypes_scenepick": "ScenePick" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L83 | neighbors=[createSurveyScene.ts, sceneTypes.ts, SurveySystemScene.tsx]
- "survey3d_trunkflow_trunknetwork_clear": ".clear()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/trunkFlow.ts:L152 | neighbors=[TrunkNetwork, .build(), .dispose()]
- "utils_accesscontrol_caneditlevel": "canEditLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L122 | neighbors=[BidDetailPage.tsx, accessControl.ts, canViewLevel()]
- "utils_accesscontrol_canmanageern": "canManageErn()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L122 | neighbors=[OverviewTab.tsx, accessControl.ts, isSuperAdmin()]
- "utils_accesscontrol_resolvearealevel": "resolveAreaLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L57 | neighbors=[accessControl.ts, getEffectiveAreaLevel(), roleLevels()]
- "utils_accesscontrol_resolvebidtablevel": "resolveBidTabLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L78 | neighbors=[accessControl.ts, getEffectiveBidTabLevel(), roleBidLevels()]

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
