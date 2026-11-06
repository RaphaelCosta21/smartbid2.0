# Node Description Batch 25 of 102

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

- "services_supplierservice_tofields": "toFields()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L141 | neighbors=[SupplierService.ts, .create(), .update(), joinKeywords(), joinLines()]
- "services_technicalproposalknowledgeservice_technicalproposalknowledgeservice_publish": ".publish()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L57 | neighbors=[TechnicalProposalKnowledgeService, ._buildMetadata(), ._ensureColumns(), ._ensureFolder(), .fileName()]
- "services_userservice_userservice": "UserService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/UserService.ts:L8 | neighbors=[AppLayout.tsx, UserService.ts, .getCurrentUser(), .getUserPhoto(), .searchUsers()]
- "settings_patchnotes": "PatchNotes.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/PatchNotes.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PatchNotesPage.tsx, PatchNote, PatchNotes()]
- "sheets_currencytable_moneycell": "moneyCell()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/currencyTable.ts:L43 | neighbors=[certificationsSheet.ts, currencyTable.ts, curCode(), logisticsSheet.ts, prepMobSheet.ts]
- "sheets_currencytable_writecurrencyfooter": "writeCurrencyFooter()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/currencyTable.ts:L140 | neighbors=[certificationsSheet.ts, currencyTable.ts, fxNotes(), logisticsSheet.ts, prepMobSheet.ts]
- "survey3d_createsurveyscene_box": "box()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L108 | neighbors=[createSurveyScene.ts, buildManifold(), buildProceduralVessel(), buildRov(), buildSatellite()]
- "survey3d_createsurveyscene_buildproceduralvessel": "buildProceduralVessel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L137 | neighbors=[createSurveyScene.ts, box(), hullSlab(), std(), createSurveyScene()]
- "survey3d_createsurveyscene_buildrov": "buildRov()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L248 | neighbors=[createSurveyScene.ts, box(), glow(), std(), createSurveyScene()]
- "survey3d_deliverablemodels_canvastexture": "canvasTexture()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/deliverableModels.ts:L36 | neighbors=[deliverableModels.ts, buildCard(), buildChart(), buildReport(), buildVideo()]
- "survey3d_deliverablemodels_makecanvas": "makeCanvas()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/deliverableModels.ts:L43 | neighbors=[deliverableModels.ts, buildCard(), buildChart(), buildReport(), buildVideo()]
- "survey3d_scenetypes_scenejourneystep": "SceneJourneyStep" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L110 | neighbors=[SurveySystemPage.tsx, createSurveyScene.ts, journeyController.ts, sceneTypes.ts, SurveySystemScene.tsx]
- "survey3d_scenetypes_scenetrunk": "SceneTrunk" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L55 | neighbors=[SurveySystemPage.tsx, createSurveyScene.ts, sceneTypes.ts, trunkFlow.ts, SurveySystemScene.tsx]
- "survey3d_scenetypes_scenezone": "SceneZone" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L8 | neighbors=[SurveySystemPage.tsx, createSurveyScene.ts, sceneTypes.ts, SurveySystemScene.tsx, surveyFreeScene.ts]
- "utils_accesscontrol_geteffectivebidtablevel": "getEffectiveBidTabLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L110 | neighbors=[useAccessLevel.ts, BidDetailPage.tsx, accessControl.ts, resolveBidTabLevel(), roleOf()]
- "utils_accesscontrol_geteffectivepagelevel": "getEffectivePageLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L98 | neighbors=[useAccessLevel.ts, accessControl.ts, isSuperAdminUser(), resolvePageLevel(), roleOf()]
- "utils_approvalhelpers_computeapprovalcycletime": "computeApprovalCycleTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L533 | neighbors=[ApprovalTab.tsx, BidDetailsReportPage.tsx, BottleneckAnalysisPage.tsx, approvalHelpers.ts, computeBidSectorDurations()]
- "utils_approvalhelpers_getmissingapprovalactivityentries": "getMissingApprovalActivityEntries()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L597 | neighbors=[ApprovalTab.tsx, BidDetailPage.tsx, approvalHelpers.ts, completingTrackRound(), completionEntry()]
- "utils_approvalhelpers_ipendingapprovalrow": "IPendingApprovalRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L722 | neighbors=[ApprovalsPending.tsx, useLiveOverview.ts, LivePulse.tsx, LivePulsePanel.tsx, approvalHelpers.ts]
- "utils_approvaltracks_canchangesecondaryapproval": "canChangeSecondaryApproval()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L227 | neighbors=[ApprovalTab.tsx, approvalTracks.ts, canHaveSecondaryApproval(), getCurrentCycleRounds(), hasPendingApprovalRound()]
- "utils_approvaltracks_getprimarytrack": "getPrimaryTrack()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L60 | neighbors=[ApprovalTab.tsx, approvalTracks.ts, getApprovalTrackLabel(), getApprovalTracks(), projectManagersForTrack()]
- "utils_approvaltracks_getsplitapprovalstatus": "getSplitApprovalStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L152 | neighbors=[ApprovalTab.tsx, approvalTracks.ts, buildTrackRoundPatch(), aggregateTrackStatus(), getApprovalTracks()]
- "utils_approvaltracks_gettrackstatus": "getTrackStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L129 | neighbors=[ApprovalTab.tsx, OverviewTab.tsx, approvalTracks.ts, getLatestTrackRound(), needsNewApprovalRound()]
- "utils_approvaltracks_haspendingapprovalround": "hasPendingApprovalRound()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L182 | neighbors=[BidDetailPage.tsx, approvalHelpers.ts, approvalTracks.ts, canChangeSecondaryApproval(), getApprovalTracks()]
- "utils_bidcomparator_icomparisonresult": "IComparisonResult" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L78 | neighbors=[ComparisonExecutive.tsx, ComparisonSummary.tsx, ComparisonTables.tsx, BidComparatorPage.tsx, bidComparator.ts]
- "utils_bidhelpers_getengineeringhours": "getEngineeringHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L122 | neighbors=[DashboardBidTable.tsx, DashboardPage.tsx, bidHelpers.ts, engHoursHelpers.ts, EngHoursRanking.tsx]
- "utils_bidhelpers_iupcomingdeadline": "IUpcomingDeadline" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L83 | neighbors=[UpcomingDeadlines.tsx, useLiveOverview.ts, LivePulse.tsx, LivePulsePanel.tsx, bidHelpers.ts]
- "utils_bidpresentation_buildpresentationitems": "buildPresentationItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L107 | neighbors=[BidRankingTab.tsx, ItemHistoryTab.tsx, bidComparator.ts, bidPresentation.ts, getBidContingency()]
- "utils_bidpresentation_gethistoryforquery": "getHistoryForQuery()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L479 | neighbors=[ItemHistoryTab.tsx, bidPresentation.ts, bigramsOf(), normalizeText(), getItemHistory()]
- "utils_bomparser_emptyitem": "emptyItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L108 | neighbors=[BomCostsPage.tsx, bomParser.ts, uid(), parseBomCSV(), parseBomExcel()]
- "utils_clarificationhelpers_servicelinesfordivision": "serviceLinesForDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L82 | neighbors=[ClarificationEntryModal.tsx, QualificationEntryModal.tsx, QualificationTableModal.tsx, clarificationHelpers.ts, activeConfigOptions()]
- "utils_clarificationhelpers_withcurrentoption": "withCurrentOption()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L70 | neighbors=[OverviewTab.tsx, ClarificationEntryModal.tsx, QualificationEntryModal.tsx, QualificationTableModal.tsx, clarificationHelpers.ts]
- "utils_costcalculations_calculatehourstotals": "calculateHoursTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L619 | neighbors=[costCalculations.ts, buildCostSummary(), getBidFx(), costSummaryView.ts, BidCostSummary.tsx]
- "utils_costcalculations_getbidcontingency": "getBidContingency()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L83 | neighbors=[OverviewTab.tsx, rows.ts, costCalculations.ts, buildCostSummary(), costSummaryView.ts]
- "utils_costcalculations_withcostsummary": "withCostSummary()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L868 | neighbors=[BidDetailPage.tsx, BidService.ts, costCalculations.ts, buildCostSummary(), pruneOrphanCosts()]
- "utils_costsummaryview_buildcostsummaryview": "buildCostSummaryView()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costSummaryView.ts:L113 | neighbors=[BidCostSummary.tsx, BidExportTab.tsx, index.ts, costSummaryView.ts, sumBy()]
- "utils_csvparser": "csvParser.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/csvParser.ts:L1 | neighbors=[9cc3475 feat: Integrate Financials Acti…, QueryCatalogService.ts, bomParser.ts, RFC-4180, parseCSVRows()]
- "utils_divisionhelpers_businesslinedivision": "businessLineDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L81 | neighbors=[ApprovalTab.tsx, approvalTracks.ts, divisionHelpers.ts, getTrackLabel(), ernHelpers.ts]
- "utils_divisionhelpers_getbusinesslineserviceline": "getBusinessLineServiceLine()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L90 | neighbors=[ApprovalTab.tsx, ErnCreateModal.tsx, divisionHelpers.ts, isIntegratedDivision(), ernHelpers.ts]
- "utils_divisionhelpers_otherbasedivision": "otherBaseDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L31 | neighbors=[CreateRequestPage.tsx, divisionHelpers.ts, composeIntegratedServiceLine(), getBidBusinessLines(), getBidServiceLines()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-024.json

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
