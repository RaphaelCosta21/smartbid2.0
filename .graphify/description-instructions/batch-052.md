# Node Description Batch 53 of 86

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

- "utils_reporthelpers_getresultstatus": "getResultStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L34 | neighbors=[useResultStatus.ts, reportHelpers.ts]
- "utils_reporthelpers_monthlystatusstacked": "monthlyStatusStacked()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L128 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_servicelinecounts": "serviceLineCounts()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L103 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_statusbyclient": "statusByClient()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L166 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_statuscounts": "statusCounts()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L60 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_winratebyclient": "winRateByClient()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L203 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_revisionhelpers_detectrevisionchanges": "detectRevisionChanges()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L33 | neighbors=[BidDetailPage.tsx, revisionHelpers.ts]
- "utils_revisionhelpers_getsectionfrompatch": "getSectionFromPatch()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L543 | neighbors=[BidDetailPage.tsx, revisionHelpers.ts]
- "utils_statushelpers_getactivestatuses": "getActiveStatuses()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L90 | neighbors=[FlowBoardPage.tsx, statusHelpers.ts]
- "utils_statushelpers_getstatuscolor": "getStatusColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L44 | neighbors=[statusHelpers.ts, getStatusDef()]
- "utils_statushelpers_getstatusorder": "getStatusOrder()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L63 | neighbors=[statusHelpers.ts, getStatusDef()]
- "utils_statushelpers_getterminalstatuses": "getTerminalStatuses()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L109 | neighbors=[BidResultsPage.tsx, statusHelpers.ts]
- "utils_suppliermatching_totradename": "toTradeName()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L74 | neighbors=[SuppliersRegistry.tsx, supplierMatching.ts]
- "utils_supplierprofile_getsupplycategories": "getSupplyCategories()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierProfile.ts:L63 | neighbors=[SuppliersRegistry.tsx, supplierProfile.ts]
- "utils_supplierprofile_websitedomains": "websiteDomains()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierProfile.ts:L79 | neighbors=[supplierProfile.ts, buildSupplierProfileText()]
- "utils_surveybidintel_median": "median()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidIntel.ts:L9 | neighbors=[surveyBidIntel.ts, computeSurveyBidIntel()]
- "utils_surveybidintel_norm": "norm()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidIntel.ts:L7 | neighbors=[surveyBidIntel.ts, computeSurveyBidIntel()]
- "utils_surveybidintel_percentile": "percentile()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidIntel.ts:L16 | neighbors=[surveyBidIntel.ts, computeSurveyBidIntel()]
- "utils_surveybidmatch_matchbidequipment": "matchBidEquipment()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidMatch.ts:L22 | neighbors=[useSurveyPortal.ts, surveyBidMatch.ts]
- "utils_surveyspreadgraph_baseid": "baseId()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L47 | neighbors=[surveySpreadGraph.ts, traceSignalPath()]
- "utils_surveyspreadgraph_catalognodes": "catalogNodes()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L163 | neighbors=[SurveySystemPage.tsx, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_directlinks": "directLinks()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L271 | neighbors=[SurveySystemPage.tsx, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_expandspreadnodes": "expandSpreadNodes()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L53 | neighbors=[SurveySystemPage.tsx, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_ispreadlinkref": "ISpreadLinkRef" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L30 | neighbors=[SurveySystemPage.tsx, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_ispreadnode": "ISpreadNode" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L14 | neighbors=[SurveySystemPage.tsx, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_resolvesceneshape": "resolveSceneShape()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L306 | neighbors=[SurveySystemPage.tsx, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_resolvespreadlinks": "resolveSpreadLinks()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L192 | neighbors=[SurveySystemPage.tsx, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_shortestpath": "shortestPath()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L239 | neighbors=[surveySpreadGraph.ts, traceSignalPath()]
- "utils_technicalproposalhelpers_technical_proposal_state_labels": "TECHNICAL_PROPOSAL_STATE_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/technicalProposalHelpers.ts:L11 | neighbors=[TechnicalProposalChip.tsx, technicalProposalHelpers.ts]
- "utils_technicalproposalhelpers_technicalproposalstate": "TechnicalProposalState" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/technicalProposalHelpers.ts:L4 | neighbors=[TechnicalProposalChip.tsx, technicalProposalHelpers.ts]
- "utils_validators_sanitizetext": "sanitizeText()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L89 | neighbors=[CreateRequestPage.tsx, validators.ts]
- "utils_validators_validatebidrequest": "validateBidRequest()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L62 | neighbors=[validators.ts, validateRequired()]
- "utils_validators_validaterequired": "validateRequired()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L11 | neighbors=[validators.ts, validateBidRequest()]
- "utils_winprobability_clientkey": "clientKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L52 | neighbors=[winProbability.ts, getHistoricalWinProbability()]
- "utils_winprobability_fromtally": "fromTally()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L83 | neighbors=[winProbability.ts, getHistoricalWinProbability()]
- "utils_winprobability_iwinrateindex": "IWinRateIndex" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L28 | neighbors=[EngHoursOutlook.tsx, winProbability.ts]
- "utils_winprobability_win_probability_levels": "WIN_PROBABILITY_LEVELS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L50 | neighbors=[FollowUpPage.tsx, winProbability.ts]
- "utils_winprobability_win_probability_source_label": "WIN_PROBABILITY_SOURCE_LABEL" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L38 | neighbors=[FollowUpPage.tsx, winProbability.ts]
- "approval_approvalbadge_approvalbadge": "ApprovalBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalBadge.tsx:L10 | neighbors=[ApprovalBadge.tsx]
- "approval_approvalbadge_approvalbadgeprops": "ApprovalBadgeProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalBadge.tsx:L5 | neighbors=[ApprovalBadge.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-052.json

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
