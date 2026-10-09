# Node Description Batch 33 of 86

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

- "survey3d_cableflow_cablenetwork_clear": ".clear()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L140 | neighbors=[CableNetwork, .build(), .dispose()]
- "survey3d_createsurveyscene_glow": "glow()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L90 | neighbors=[createSurveyScene.ts, buildRov(), createSurveyScene()]
- "survey3d_equipmentmodels_equipmentmodelfactory_build": ".build()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L46 | neighbors=[EquipmentModelFactory, .buildShape(), normalize()]
- "survey3d_equipmentmodels_equipmentmodelfactory_buildshape": ".buildShape()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/equipmentModels.ts:L94 | neighbors=[EquipmentModelFactory, .build(), .geo()]
- "survey3d_focuscontroller_focuscontroller_applystates": ".applyStates()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L255 | neighbors=[FocusController, .open(), .setStates()]
- "survey3d_focuscontroller_focuscontroller_open": ".open()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L82 | neighbors=[FocusController, .applyStates(), .retractAll()]
- "survey3d_focuscontroller_focuscontroller_retractall": ".retractAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L237 | neighbors=[FocusController, .close(), .open()]
- "survey3d_scenetypes_link_kinds": "LINK_KINDS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L78 | neighbors=[cableFlow.ts, sceneTypes.ts, SurveySystemScene.tsx]
- "survey3d_scenetypes_link_labels": "LINK_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L100 | neighbors=[SurveySystemPage.tsx, sceneTypes.ts, SurveySystemScene.tsx]
- "survey3d_scenetypes_scenelink": "SceneLink" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L37 | neighbors=[SurveySystemPage.tsx, cableFlow.ts, sceneTypes.ts]
- "survey3d_scenetypes_scenenode": "SceneNode" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L21 | neighbors=[SurveySystemPage.tsx, focusController.ts, sceneTypes.ts]
- "survey3d_scenetypes_scenepick": "ScenePick" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L71 | neighbors=[createSurveyScene.ts, sceneTypes.ts, SurveySystemScene.tsx]
- "survey3d_trunkflow_trunknetwork_clear": ".clear()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/trunkFlow.ts:L152 | neighbors=[TrunkNetwork, .build(), .dispose()]
- "utils_accesscontrol_caneditlevel": "canEditLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L122 | neighbors=[BidDetailPage.tsx, accessControl.ts, canViewLevel()]
- "utils_accesscontrol_canmanageern": "canManageErn()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L122 | neighbors=[OverviewTab.tsx, accessControl.ts, isSuperAdmin()]
- "utils_accesscontrol_resolvearealevel": "resolveAreaLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L57 | neighbors=[accessControl.ts, getEffectiveAreaLevel(), roleLevels()]
- "utils_accesscontrol_resolvebidtablevel": "resolveBidTabLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L78 | neighbors=[accessControl.ts, getEffectiveBidTabLevel(), roleBidLevels()]
- "utils_accesscontrol_resolvepagelevel": "resolvePageLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L66 | neighbors=[accessControl.ts, getEffectivePageLevel(), roleLevels()]
- "utils_accesscontrol_rolelevels": "roleLevels()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L44 | neighbors=[accessControl.ts, resolveAreaLevel(), resolvePageLevel()]
- "utils_aiclarificationmapper_mapsuggestedclarification": "mapSuggestedClarification()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiClarificationMapper.ts:L10 | neighbors=[QualificationsTab.tsx, BidDetailPage.tsx, aiClarificationMapper.ts]
- "utils_aiquotationmapper_resolvequotationgroup": "resolveQuotationGroup()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiQuotationMapper.ts:L46 | neighbors=[aiQuotationMapper.ts, mapExtractedQuotationLine(), normalizeName()]
- "utils_analyticshelpers_approvalimpacttrend": "approvalImpactTrend()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L354 | neighbors=[ApprovalDueImpactSection.tsx, analyticsHelpers.ts, buildPeriodSequence()]
- "utils_analyticshelpers_divisionload": "divisionLoad()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L555 | neighbors=[AnalyticsPage.tsx, BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_erntrend": "ernTrend()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L218 | neighbors=[PerformanceTrendsPage.tsx, analyticsHelpers.ts, buildPeriodSequence()]
- "utils_analyticshelpers_otdtrend": "otdTrend()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L315 | neighbors=[PerformanceTrendsPage.tsx, analyticsHelpers.ts, buildPeriodSequence()]
- "utils_analyticshelpers_perioddelta": "periodDelta()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L667 | neighbors=[AnalyticsPage.tsx, PerformanceTrendsPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_periodkey": "periodKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L98 | neighbors=[analyticsHelpers.ts, buildPeriodSequence(), isoWeek()]
- "utils_approvalhelpers_approvedsectordurations": "approvedSectorDurations()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L217 | neighbors=[approvalHelpers.ts, computeRoundSectorDurations(), getApprovalDueImpact()]
- "utils_approvalhelpers_avgapprovaldaysbysector": "avgApprovalDaysBySector()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L150 | neighbors=[BottleneckAnalysisPage.tsx, approvalHelpers.ts, OperationalSummaryPage.tsx]
- "utils_approvalhelpers_computebidsectordurations": "computeBidSectorDurations()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L96 | neighbors=[BidDetailsReportPage.tsx, approvalHelpers.ts, computeApprovalCycleTime()]
- "utils_approvalhelpers_getactiveapprovaloverride": "getActiveApprovalOverride()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L371 | neighbors=[ApprovalTab.tsx, OverviewTab.tsx, approvalHelpers.ts]
- "utils_approvalhelpers_getmissingapprovalhistorypatch": "getMissingApprovalHistoryPatch()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L487 | neighbors=[DashboardActivity.tsx, BidDetailPage.tsx, approvalHelpers.ts]
- "utils_approvalhelpers_summarizeapprovaldueimpact": "summarizeApprovalDueImpact()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L340 | neighbors=[OperationalSummaryPage.tsx, ApprovalDueImpactSection.tsx, approvalHelpers.ts]
- "utils_approvalhelpers_totime": "toTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L36 | neighbors=[approvalHelpers.ts, computeRoundSectorDurations(), getApprovalDueImpact()]
- "utils_bidconfidentiality_normalizeemail": "normalizeEmail()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L14 | neighbors=[bidConfidentiality.ts, hasEmail(), isSamePerson()]
- "utils_bidhelpers_getduedateat": "getDueDateAt()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L35 | neighbors=[approvalHelpers.ts, bidHelpers.ts, kpiHelpers.ts]
- "utils_bomparser_assignparentids": "assignParentIds()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L79 | neighbors=[bomParser.ts, parseBomCSV(), parseBomExcel()]
- "utils_bomparser_cleancsvvalue": "cleanCsvValue()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L23 | neighbors=[bomParser.ts, parseBomCSV(), parseBomExcel()]
- "utils_bomparser_findcolumns": "findColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L47 | neighbors=[bomParser.ts, parseBomCSV(), parseBomExcel()]
- "utils_businessdays_calculatepriority": "calculatePriority()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/businessDays.ts:L29 | neighbors=[CreateRequestPage.tsx, businessDays.ts, countBusinessDays()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-032.json

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
