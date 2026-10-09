# Node Description Batch 21 of 86

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

- "services_clarificationdbservice_clarificationdbservice_maptosp": "._mapToSP()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L127 | neighbors=[ClarificationDbService, .create(), .syncFromBid(), .update(), .addMany()]
- "services_easimodulesadapter_easimodulesadapter_getbenchmarkdataset": ".getBenchmarkDataset()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L137 | neighbors=[EasiModulesAdapter, ._bids(), ._costRows(), ._laborRows(), ._opportunityRows()]
- "services_editcontrolservice_editcontrolservice_getlocks": ".getLocks()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L19 | neighbors=[EditControlService, .acquireLock(), .saveLocks(), .releaseAllForBid(), .releaseLock()]
- "services_editcontrolservice_editcontrolservice_savelocks": ".saveLocks()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L111 | neighbors=[EditControlService, .acquireLock(), .getLocks(), .releaseAllForBid(), .releaseLock()]
- "services_membersservice_membersservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L16 | neighbors=[MembersService, .addMember(), .removeMember(), .savePreferences(), .updateMember()]
- "services_membersservice_membersservice_save": ".save()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L49 | neighbors=[MembersService, .addMember(), .removeMember(), .savePreferences(), .updateMember()]
- "services_notificationservice": "NotificationService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, NotificationService, ToastCallback, ToastOptions, ToastType]
- "services_notificationservice_notificationservice_emit": "._emit()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L28 | neighbors=[NotificationService, .error(), .info(), .success(), .warning()]
- "services_pricingservice": "PricingService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PricingService.ts:L1 | neighbors=[c4e04de lots-implementation, IPriceEntry, PricingService, SPService.ts, SPService]
- "services_qualificationdbservice_qualificationdbservice_ensurelist": ".ensureList()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L30 | neighbors=[QualificationDbService, .create(), ._provision(), .saveTable(), .syncFromBid()]
- "services_qualificationdbservice_qualificationdbservice_maptosp": "._mapToSP()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L123 | neighbors=[QualificationDbService, .create(), .saveTable(), .syncFromBid(), .update()]
- "services_qualificationdbservice_qualificationdbservice_savetable": ".saveTable()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L179 | neighbors=[QualificationDbService, .delete(), .ensureList(), ._mapToSP(), .update()]
- "services_qualificationdbservice_qualificationdbservice_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L165 | neighbors=[QualificationDbService, ._provision(), .saveTable(), .syncFromBid(), ._mapToSP()]
- "services_querycatalogservice_querycatalogservice_parsebomsheet": ".parseBomSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L230 | neighbors=[QueryCatalogService, .loadCatalog(), .dateDiffDays(), .toISODate(), .toNumber()]
- "services_quotationservice_quotationservice_ensurecolumns": ".ensureColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L34 | neighbors=[QuotationService, .addItems(), ._provisionColumns(), ._migrateLegacyBlob(), .updateItem()]
- "services_supplierservice_supplierservice_setlogo": "._setLogo()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L293 | neighbors=[SupplierService, .create(), ._clearLogo(), validateLogo(), .update()]
- "services_supplierservice_supplierservice_updateprofile": ".updateProfile()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L266 | neighbors=[SupplierService, joinKeywords(), joinLines(), .columns(), .update()]
- "services_supplierservice_tofields": "toFields()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L141 | neighbors=[SupplierService.ts, .create(), .update(), joinKeywords(), joinLines()]
- "services_technicalproposalknowledgeservice_technicalproposalknowledgeservice_publish": ".publish()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L57 | neighbors=[TechnicalProposalKnowledgeService, ._buildMetadata(), ._ensureColumns(), ._ensureFolder(), .fileName()]
- "services_userservice_userservice": "UserService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/UserService.ts:L8 | neighbors=[AppLayout.tsx, UserService.ts, .getCurrentUser(), .getUserPhoto(), .searchUsers()]
- "settings_patchnotes": "PatchNotes.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/PatchNotes.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PatchNotesPage.tsx, PatchNote, PatchNotes()]
- "sheets_currencytable_moneycell": "moneyCell()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/currencyTable.ts:L43 | neighbors=[certificationsSheet.ts, currencyTable.ts, curCode(), logisticsSheet.ts, prepMobSheet.ts]
- "sheets_currencytable_writecurrencyfooter": "writeCurrencyFooter()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/currencyTable.ts:L140 | neighbors=[certificationsSheet.ts, currencyTable.ts, fxNotes(), logisticsSheet.ts, prepMobSheet.ts]
- "survey_surveyequipmentdetail_surveyequipmentdetail": "SurveyEquipmentDetail()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentDetail.tsx:L48 | neighbors=[SurveyEquipmentPage.tsx, SurveySystemPage.tsx, SurveyEquipmentDetail.tsx, formatUSD(), safeUrl()]
- "survey3d_createsurveyscene_box": "box()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L100 | neighbors=[createSurveyScene.ts, buildManifold(), buildProceduralVessel(), buildRov(), buildSatellite()]
- "survey3d_createsurveyscene_buildproceduralvessel": "buildProceduralVessel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L129 | neighbors=[createSurveyScene.ts, box(), hullSlab(), std(), createSurveyScene()]
- "survey3d_createsurveyscene_buildrov": "buildRov()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L240 | neighbors=[createSurveyScene.ts, box(), glow(), std(), createSurveyScene()]
- "survey3d_scenetypes_scenefocus": "SceneFocus" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L45 | neighbors=[SurveySystemPage.tsx, createSurveyScene.ts, focusController.ts, sceneTypes.ts, SurveySystemScene.tsx]
- "survey3d_scenetypes_scenenodestates": "SceneNodeStates" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L61 | neighbors=[SurveySystemPage.tsx, createSurveyScene.ts, focusController.ts, sceneTypes.ts, SurveySystemScene.tsx]
- "survey3d_scenetypes_scenetrunk": "SceneTrunk" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L54 | neighbors=[SurveySystemPage.tsx, createSurveyScene.ts, sceneTypes.ts, trunkFlow.ts, SurveySystemScene.tsx]
- "utils_accesscontrol_geteffectivebidtablevel": "getEffectiveBidTabLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L110 | neighbors=[useAccessLevel.ts, BidDetailPage.tsx, accessControl.ts, resolveBidTabLevel(), roleOf()]
- "utils_accesscontrol_geteffectivepagelevel": "getEffectivePageLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L98 | neighbors=[useAccessLevel.ts, accessControl.ts, isSuperAdminUser(), resolvePageLevel(), roleOf()]
- "utils_approvalhelpers_computeapprovalcycletime": "computeApprovalCycleTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L379 | neighbors=[ApprovalTab.tsx, BidDetailsReportPage.tsx, BottleneckAnalysisPage.tsx, approvalHelpers.ts, computeBidSectorDurations()]
- "utils_approvalhelpers_ipendingapprovalrow": "IPendingApprovalRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L531 | neighbors=[ApprovalsPending.tsx, useLiveOverview.ts, LivePulse.tsx, LivePulsePanel.tsx, approvalHelpers.ts]
- "utils_bidhelpers_getengineeringhours": "getEngineeringHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L122 | neighbors=[DashboardBidTable.tsx, DashboardPage.tsx, bidHelpers.ts, engHoursHelpers.ts, EngHoursRanking.tsx]
- "utils_bidhelpers_iupcomingdeadline": "IUpcomingDeadline" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L83 | neighbors=[UpcomingDeadlines.tsx, useLiveOverview.ts, LivePulse.tsx, LivePulsePanel.tsx, bidHelpers.ts]
- "utils_bomparser_emptyitem": "emptyItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L108 | neighbors=[BomCostsPage.tsx, bomParser.ts, uid(), parseBomCSV(), parseBomExcel()]
- "utils_clarificationchatintent": "clarificationChatIntent.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationChatIntent.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, useChatStore.ts, asksAboutClarifications(), pastBidHelpers.ts, normalizeText()]
- "utils_clarificationhelpers_servicelinesfordivision": "serviceLinesForDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L78 | neighbors=[ClarificationEntryModal.tsx, QualificationEntryModal.tsx, QualificationTableModal.tsx, clarificationHelpers.ts, activeConfigOptions()]
- "utils_clarificationhelpers_withcurrentoption": "withCurrentOption()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L66 | neighbors=[OverviewTab.tsx, ClarificationEntryModal.tsx, QualificationEntryModal.tsx, QualificationTableModal.tsx, clarificationHelpers.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-020.json

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
