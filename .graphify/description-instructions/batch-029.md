# Node Description Batch 30 of 102

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

- "survey_surveyequipmentdetail_surveyequipmentdetail": "SurveyEquipmentDetail()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentDetail.tsx:L66 | neighbors=[SurveySystemPage.tsx, SurveyEquipmentDetail.tsx, formatUSD(), safeUrl()]
- "survey3d_createsurveyscene_buildmanifold": "buildManifold()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L267 | neighbors=[createSurveyScene.ts, box(), std(), createSurveyScene()]
- "survey3d_createsurveyscene_buildsatellite": "buildSatellite()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L233 | neighbors=[createSurveyScene.ts, box(), std(), createSurveyScene()]
- "survey3d_journeycontroller_journeycontroller_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/journeyController.ts:L134 | neighbors=[JourneyController, .isReady(), .measureTravel(), .updatePacket()]
- "survey3d_scenetypes_link_colors": "LINK_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L139 | neighbors=[SurveySystemPage.tsx, cableFlow.ts, sceneTypes.ts, SurveyGlossary.tsx]
- "survey3d_scenetypes_link_labels": "LINK_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L150 | neighbors=[SurveySystemPage.tsx, sceneTypes.ts, SurveyGlossary.tsx, SurveySystemScene.tsx]
- "survey3d_scenetypes_scenenode": "SceneNode" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L22 | neighbors=[SurveySystemPage.tsx, focusController.ts, sceneTypes.ts, surveyFreeScene.ts]
- "survey3d_scenetypes_sceneshape": "SceneShape" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L17 | neighbors=[equipmentModels.ts, sceneTypes.ts, SurveyEquipment3DThumb.tsx, SurveyEquipmentDetail.tsx]
- "utils_accesscontrol_geteffectivearealevel": "getEffectiveAreaLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L89 | neighbors=[useAccessLevel.ts, accessControl.ts, resolveAreaLevel(), roleOf()]
- "utils_accesscontrol_hasaccess": "hasAccess()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L80 | neighbors=[useAuthStore.ts, accessControl.ts, canEdit(), canView()]
- "utils_accesscontrol_issuperadminuser": "isSuperAdminUser()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L38 | neighbors=[useAccessLevel.ts, accessControl.ts, getEffectivePageLevel(), isSuperAdmin()]
- "utils_accesscontrol_roleof": "roleOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L42 | neighbors=[accessControl.ts, getEffectiveAreaLevel(), getEffectiveBidTabLevel(), getEffectivePageLevel()]
- "utils_aicontext_buildaicontext": "buildAiContext()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiContext.ts:L12 | neighbors=[AITab.tsx, QualificationsTab.tsx, ScopeOfSupplyTab.tsx, aiContext.ts]
- "utils_analyticshelpers_completiontimetrend": "completionTimeTrend()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L245 | neighbors=[AnalyticsPage.tsx, PerformanceTrendsPage.tsx, analyticsHelpers.ts, buildPeriodSequence()]
- "utils_analyticshelpers_winratetrend": "winRateTrend()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L279 | neighbors=[FollowUpPage.tsx, PerformanceTrendsPage.tsx, analyticsHelpers.ts, buildPeriodSequence()]
- "utils_approvalhelpers_completingtrackround": "completingTrackRound()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L584 | neighbors=[approvalHelpers.ts, finalTrackRounds(), getMissingApprovalActivityEntries(), getMissingApprovalHistoryPatch()]
- "utils_approvalhelpers_computeroundsectordurations": "computeRoundSectorDurations()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L62 | neighbors=[ApprovalTab.tsx, approvalHelpers.ts, approvedSectorDurations(), toTime()]
- "utils_approvalhelpers_finaltrackrounds": "finalTrackRounds()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L209 | neighbors=[approvalHelpers.ts, completingTrackRound(), getFinalApprovedRound(), getFinalApprovedRounds()]
- "utils_approvalhelpers_getapprovaldueimpact": "getApprovalDueImpact()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L336 | neighbors=[approvalHelpers.ts, approvedSectorDurations(), getFinalApprovedRound(), toTime()]
- "utils_approvalhelpers_getfinalapprovedround": "getFinalApprovedRound()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L224 | neighbors=[approvalHelpers.ts, getApprovalDueImpact(), finalTrackRounds(), getFinalApprovedRounds()]
- "utils_approvalhelpers_getmissingapprovalhistorypatch": "getMissingApprovalHistoryPatch()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L674 | neighbors=[DashboardActivity.tsx, BidDetailPage.tsx, approvalHelpers.ts, completingTrackRound()]
- "utils_approvaltracks_getapprovaltracklabel": "getApprovalTrackLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L65 | neighbors=[ApprovalTab.tsx, OverviewTab.tsx, approvalTracks.ts, getPrimaryTrack()]
- "utils_approvaltracks_getcurrenttrackapprovals": "getCurrentTrackApprovals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L159 | neighbors=[ApprovalTab.tsx, approvalTracks.ts, buildTrackRoundPatch(), getApprovalTracks()]
- "utils_approvaltracks_gettrackrounds": "getTrackRounds()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L103 | neighbors=[approvalTracks.ts, getLatestTrackRound(), lastSingleRoundIndex(), supersededBefore()]
- "utils_approvaltracks_issplitapprovalcomplete": "isSplitApprovalComplete()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L173 | neighbors=[ApprovalTab.tsx, approvalHelpers.ts, approvalTracks.ts, getApprovalTracks()]
- "utils_approvaltracks_needsnewapprovalround": "needsNewApprovalRound()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L206 | neighbors=[ApprovalTab.tsx, approvalTracks.ts, getCurrentCycleRounds(), getTrackStatus()]
- "utils_approvaltracks_synctrackstatuses": "syncTrackStatuses()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L235 | neighbors=[ApprovalTab.tsx, approvalTracks.ts, buildTrackRoundPatch(), getApprovalTracks()]
- "utils_bidcomparator_comparebids": "compareBids()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L190 | neighbors=[BidComparatorPage.tsx, bidComparator.ts, sumTotals(), toComparableLines()]
- "utils_bidconfidentiality_canmanagebidconfidentiality": "canManageBidConfidentiality()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L72 | neighbors=[BidConfidentialButton.tsx, bidConfidentiality.ts, getConfidentialManagers(), hasEmail()]
- "utils_bidconfidentiality_getconfidentialallowedpeople": "getConfidentialAllowedPeople()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L76 | neighbors=[bidConfidentiality.ts, canOpenBid(), getConfidentialManagers(), uniquePeople()]
- "utils_bidconfidentiality_hasemail": "hasEmail()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L17 | neighbors=[bidConfidentiality.ts, canManageBidConfidentiality(), canOpenBid(), normalizeEmail()]
- "utils_bidconfidentiality_uniquepeople": "uniquePeople()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L24 | neighbors=[ConfidentialAccessModal.tsx, bidConfidentiality.ts, getConfidentialAllowedPeople(), getConfidentialManagers()]
- "utils_bidhelpers_isunassignedbid": "isUnassignedBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L16 | neighbors=[Sidebar.tsx, BidTrackerPage.tsx, RequestService.ts, bidHelpers.ts]
- "utils_bidpresentation_acquisitiontoken": "acquisitionToken()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L49 | neighbors=[HistoryItemCard.tsx, ItemHistoryTab.tsx, bidPresentation.ts, normalizeText()]
- "utils_bidpresentation_getitemhistory": "getItemHistory()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L462 | neighbors=[ItemHistoryTab.tsx, bidPresentation.ts, getHistoryForQuery(), normalizeText()]
- "utils_bomcosthelpers_computesmarttotal": "computeSmartTotal()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L209 | neighbors=[BomCostsPage.tsx, bomCostHelpers.ts, getCoveredIds(), bomExcelExport.ts]
- "utils_bomcosthelpers_dateagebucket": "dateAgeBucket()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L293 | neighbors=[BomQuotationPicker.tsx, BomCostsPage.tsx, bomCostHelpers.ts, bomExcelExport.ts]
- "utils_bomcosthelpers_formatdatedmy": "formatDateDMY()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L23 | neighbors=[BomAnalysisCard.tsx, BomCostsPage.tsx, bomCostHelpers.ts, bomExcelExport.ts]
- "utils_bomcosthelpers_getbomcoverage": "getBomCoverage()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L244 | neighbors=[BomCostsPage.tsx, bomCostHelpers.ts, getCoveredIds(), bomExcelExport.ts]
- "utils_businessdays_countbusinessdays": "countBusinessDays()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/businessDays.ts:L10 | neighbors=[CreateRequestPage.tsx, businessDays.ts, calculatePriority(), kpiHelpers.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-029.json

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
