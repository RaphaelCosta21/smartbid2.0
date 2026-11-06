# Node Description Batch 57 of 102

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

- "sheets_supplierssheet_buildsupplierssheet": "buildSuppliersSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/suppliersSheet.ts:L18 | neighbors=[index.ts, suppliersSheet.ts]
- "smartbid20_smartbid20webpart_smartbid20webpart_getenvironmentmessage": "._getEnvironmentMessage()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L78 | neighbors=[SmartBid20WebPart, .onInit()]
- "smartbid20_smartbid20webpart_smartbid20webpart_oninit": ".onInit()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L43 | neighbors=[SmartBid20WebPart, ._getEnvironmentMessage()]
- "stores_useassetcatalogstore_useassetcatalogstore": "useAssetCatalogStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useAssetCatalogStore.ts:L18 | neighbors=[useQuerySearch.ts, useAssetCatalogStore.ts]
- "stores_usebidstore_bid_facet_values": "BID_FACET_VALUES" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L42 | neighbors=[BidTrackerPage.tsx, useBidStore.ts]
- "stores_usebidstore_bidmatchesfilters": "bidMatchesFilters()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L56 | neighbors=[BidTrackerPage.tsx, useBidStore.ts]
- "stores_usebidstore_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L6 | neighbors=[BidTrackerPage.tsx, useBidStore.ts]
- "stores_usebomcostanalysisstore_usebomcostanalysisstore": "useBomCostAnalysisStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBomCostAnalysisStore.ts:L18 | neighbors=[useQuerySearch.ts, useBomCostAnalysisStore.ts]
- "stores_usechatstore_usechatstore": "useChatStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useChatStore.ts:L38 | neighbors=[ChatAssistant.tsx, useChatStore.ts]
- "stores_usesupplierstore_isupplierentry": "ISupplierEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSupplierStore.ts:L29 | neighbors=[useRegisterQuotationSuppliers.ts, useSupplierStore.ts]
- "stores_useuistore_dashboardview": "DashboardView" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L10 | neighbors=[DashboardPage.tsx, useUIStore.ts]
- "stores_useuistore_toast": "Toast" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L12 | neighbors=[ToastContainer.tsx, useUIStore.ts]
- "suppliers_supplierdrawer_initials": "initials()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/suppliers/SupplierDrawer.tsx:L80 | neighbors=[SupplierDrawer.tsx, SupplierDrawer()]
- "survey_glossarycontext_iglossarycontextvalue": "IGlossaryContextValue" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/GlossaryContext.ts:L4 | neighbors=[SurveySystemPage.tsx, GlossaryContext.ts]
- "survey_surveyaddtopackagedialog_surveyaddtopackagedialog": "SurveyAddToPackageDialog()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyAddToPackageDialog.tsx:L14 | neighbors=[SurveySystemPage.tsx, SurveyAddToPackageDialog.tsx]
- "survey_surveyassets_survey_fit_icons": "SURVEY_FIT_ICONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/surveyAssets.ts:L5 | neighbors=[surveyAssets.ts, SurveyEquipmentDetail.tsx]
- "survey_surveycomposition3d_surveycomposition3d": "SurveyComposition3D()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyComposition3D.tsx:L76 | neighbors=[SurveyComposition3D.tsx, SurveyPackageDrawer.tsx]
- "survey_surveyequipment3dthumb_surveyequipment3dthumb": "SurveyEquipment3DThumb()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipment3DThumb.tsx:L13 | neighbors=[SurveyEquipment3DThumb.tsx, SurveyEquipmentDetail.tsx]
- "survey_surveyequipmentdetail_formatusd": "formatUSD()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentDetail.tsx:L49 | neighbors=[SurveyEquipmentDetail.tsx, SurveyEquipmentDetail()]
- "survey_surveyequipmentdetail_safeurl": "safeUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentDetail.tsx:L46 | neighbors=[SurveyEquipmentDetail.tsx, SurveyEquipmentDetail()]
- "survey_surveyfailurepanel_surveyfailurepanel": "SurveyFailurePanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyFailurePanel.tsx:L13 | neighbors=[SurveySystemPage.tsx, SurveyFailurePanel.tsx]
- "survey_surveygappanel_surveygappanel": "SurveyGapPanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyGapPanel.tsx:L17 | neighbors=[SurveySystemPage.tsx, SurveyGapPanel.tsx]
- "survey_surveyglossary_surveyglossary": "SurveyGlossary()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyGlossary.tsx:L101 | neighbors=[SurveySystemPage.tsx, SurveyGlossary.tsx]
- "survey_surveyjourneydeliverables_surveyjourneydeliverables": "SurveyJourneyDeliverables()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyJourneyDeliverables.tsx:L28 | neighbors=[SurveySystemPage.tsx, SurveyJourneyDeliverables.tsx]
- "survey_surveynmealab_surveynmealab": "SurveyNmeaLab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyNmeaLab.tsx:L15 | neighbors=[SurveyGlossary.tsx, SurveyNmeaLab.tsx]
- "survey_surveypackagedrawer_surveypackagedrawer": "SurveyPackageDrawer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPackageDrawer.tsx:L33 | neighbors=[SurveySystemPage.tsx, SurveyPackageDrawer.tsx]
- "survey_surveyportalheader_surveysearchhit": "SurveySearchHit" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPortalHeader.tsx:L26 | neighbors=[SurveySystemPage.tsx, SurveyPortalHeader.tsx]
- "survey_surveyportalheader_usedismiss": "useDismiss()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPortalHeader.tsx:L48 | neighbors=[SurveyPortalHeader.tsx, SurveyPortalHeader()]
- "survey_surveyspreadpanel_surveyspreadpanel": "SurveySpreadPanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySpreadPanel.tsx:L40 | neighbors=[SurveySystemPage.tsx, SurveySpreadPanel.tsx]
- "survey_surveysystemscene_surveycableinfo": "SurveyCableInfo" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L49 | neighbors=[SurveySystemPage.tsx, SurveySystemScene.tsx]
- "survey_surveysystemscene_surveyjourneyview": "SurveyJourneyView" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L67 | neighbors=[SurveySystemPage.tsx, SurveySystemScene.tsx]
- "survey_surveysystemscene_surveyscenetour": "SurveySceneTour" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L42 | neighbors=[SurveySystemPage.tsx, SurveySystemScene.tsx]
- "survey_surveysystemscene_surveytracestep": "SurveyTraceStep" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L57 | neighbors=[SurveySystemPage.tsx, SurveySystemScene.tsx]
- "survey3d_cableflow_cablenetwork_dispose": ".dispose()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L161 | neighbors=[CableNetwork, .clear()]
- "survey3d_cableflow_cablenetwork_settrace": ".setTrace()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L117 | neighbors=[CableNetwork, .applyTrace()]
- "survey3d_createsurveyscene_hullslab": "hullSlab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L123 | neighbors=[createSurveyScene.ts, buildProceduralVessel()]
- "survey3d_createsurveyscene_iswebglavailable": "isWebGLAvailable()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L83 | neighbors=[createSurveyScene.ts, SurveySystemScene.tsx]
- "survey3d_createsurveyscene_seabedheight": "seabedHeight()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L283 | neighbors=[createSurveyScene.ts, createSurveyScene()]
- "survey3d_createsurveyscene_surveysceneapi": "SurveySceneApi" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L54 | neighbors=[createSurveyScene.ts, SurveySystemScene.tsx]
- "survey3d_deliverablemodels_disposetree": "disposeTree()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/deliverableModels.ts:L326 | neighbors=[deliverableModels.ts, journeyController.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-056.json

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
