# Node Description Batch 59 of 102

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

- "utils_analyticshelpers_addperiod": "addPeriod()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L90 | neighbors=[analyticsHelpers.ts, buildPeriodSequence()]
- "utils_analyticshelpers_bidhasrole": "bidHasRole()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L592 | neighbors=[analyticsHelpers.ts, personMatches()]
- "utils_analyticshelpers_delta": "Delta" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L661 | neighbors=[PerformanceTrendsPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_divisionphasematrix": "divisionPhaseMatrix()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L455 | neighbors=[BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_durationbyphase": "durationByPhase()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L395 | neighbors=[BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_durationbystatus": "durationByStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L422 | neighbors=[BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_durationstat": "DurationStat" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L15 | neighbors=[BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_granularity": "Granularity" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L14 | neighbors=[PerformanceTrendsPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_isbidactive": "isBidActive()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L159 | neighbors=[BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_isoweek": "isoWeek()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L66 | neighbors=[analyticsHelpers.ts, periodKey()]
- "utils_analyticshelpers_lasttwosum": "lastTwoSum()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L676 | neighbors=[AnalyticsPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_periodstart": "periodStart()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L79 | neighbors=[analyticsHelpers.ts, buildPeriodSequence()]
- "utils_analyticshelpers_personmatches": "personMatches()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L153 | neighbors=[analyticsHelpers.ts, bidHasRole()]
- "utils_analyticshelpers_phase_order": "PHASE_ORDER" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L19 | neighbors=[OperationalSummaryPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_phasefunnel": "phaseFunnel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L498 | neighbors=[BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_slowestbids": "slowestBids()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L525 | neighbors=[BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_teammemberstats": "TeamMemberStats" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L582 | neighbors=[TeamAnalyticsPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_teamworkload": "teamWorkload()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L603 | neighbors=[TeamAnalyticsPage.tsx, analyticsHelpers.ts]
- "utils_approvalhelpers_approvalduecategory": "ApprovalDueCategory" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L317 | neighbors=[ApprovalDueImpactSection.tsx, approvalHelpers.ts]
- "utils_approvalhelpers_approvaldueimpact": "ApprovalDueImpact" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L322 | neighbors=[analyticsHelpers.ts, approvalHelpers.ts]
- "utils_approvalhelpers_avgapprovalhoursbysector": "avgApprovalHoursBySector()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L290 | neighbors=[OperationalSummaryPage.tsx, approvalHelpers.ts]
- "utils_approvalhelpers_buildapprovalcancellation": "buildApprovalCancellation()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L448 | neighbors=[ApprovalTab.tsx, approvalHelpers.ts]
- "utils_approvalhelpers_buildpendingapprovalrows": "buildPendingApprovalRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L813 | neighbors=[useLiveOverview.ts, approvalHelpers.ts]
- "utils_approvalhelpers_completionentry": "completionEntry()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L550 | neighbors=[approvalHelpers.ts, getMissingApprovalActivityEntries()]
- "utils_approvalhelpers_getpendingapprovalduerisk": "getPendingApprovalDueRisk()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L404 | neighbors=[ApprovalDueImpactSection.tsx, approvalHelpers.ts]
- "utils_approvalhelpers_iapprovalperson": "IApprovalPerson" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L712 | neighbors=[ApprovalsPending.tsx, approvalHelpers.ts]
- "utils_approvalhelpers_pendingapprovalduerisk": "PendingApprovalDueRisk" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L379 | neighbors=[ApprovalDueImpactSection.tsx, approvalHelpers.ts]
- "utils_approvaltracks_aggregatetrackstatus": "aggregateTrackStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L141 | neighbors=[approvalTracks.ts, getSplitApprovalStatus()]
- "utils_approvaltracks_canhavesecondaryapproval": "canHaveSecondaryApproval()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L30 | neighbors=[approvalTracks.ts, canChangeSecondaryApproval()]
- "utils_approvaltracks_getsecondarycandidates": "getSecondaryCandidates()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L35 | neighbors=[ApprovalTab.tsx, approvalTracks.ts]
- "utils_approvaltracks_lastsingleroundindex": "lastSingleRoundIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L71 | neighbors=[approvalTracks.ts, getTrackRounds()]
- "utils_approvaltracks_membermatchestrack": "memberMatchesTrack()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L284 | neighbors=[ApprovalTab.tsx, approvalTracks.ts]
- "utils_approvaltracks_totime": "toTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L78 | neighbors=[approvalTracks.ts, supersededBefore()]
- "utils_bidcomparator_buildcomparisonexportrows": "buildComparisonExportRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L358 | neighbors=[BidComparatorPage.tsx, bidComparator.ts]
- "utils_bidcomparator_buildinsights": "buildInsights()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L338 | neighbors=[ComparisonExecutive.tsx, bidComparator.ts]
- "utils_bidcomparator_hasmodelchange": "hasModelChange()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L319 | neighbors=[ComparisonTables.tsx, bidComparator.ts]
- "utils_bidcomparator_imissingline": "IMissingLine" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L68 | neighbors=[bidComparator.ts, INewLine]
- "utils_bidcomparator_inewline": "INewLine" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L57 | neighbors=[bidComparator.ts, IMissingLine]
- "utils_bidcomparator_isdecrease": "isDecrease()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L334 | neighbors=[ComparisonSummary.tsx, bidComparator.ts]
- "utils_bidcomparator_isincrease": "isIncrease()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L330 | neighbors=[ComparisonSummary.tsx, bidComparator.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-058.json

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
