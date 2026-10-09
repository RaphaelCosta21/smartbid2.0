# Node Description Batch 50 of 86

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

- "utils_activityloghelpers_getactivitymeta": "getActivityMeta()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/activityLogHelpers.ts:L158 | neighbors=[BidActivityLog.tsx, activityLogHelpers.ts]
- "utils_activityloghelpers_groupactivitybyday": "groupActivityByDay()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/activityLogHelpers.ts:L175 | neighbors=[BidActivityLog.tsx, activityLogHelpers.ts]
- "utils_aicontext_buildrequirementstext": "buildRequirementsText()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiContext.ts:L38 | neighbors=[QualificationsTab.tsx, aiContext.ts]
- "utils_aiquotationmapper_iquotationlinedraft": "IQuotationLineDraft" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiQuotationMapper.ts:L16 | neighbors=[AddQuotationModal.tsx, aiQuotationMapper.ts]
- "utils_aiquotationmapper_mapextractedquotationline": "mapExtractedQuotationLine()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiQuotationMapper.ts:L97 | neighbors=[aiQuotationMapper.ts, resolveQuotationGroup()]
- "utils_aiquotationmapper_mapextractedquotationlines": "mapExtractedQuotationLines()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiQuotationMapper.ts:L140 | neighbors=[AddQuotationModal.tsx, aiQuotationMapper.ts]
- "utils_aiquotationmapper_normalizename": "normalizeName()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiQuotationMapper.ts:L34 | neighbors=[aiQuotationMapper.ts, resolveQuotationGroup()]
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
- "utils_approvalhelpers_approvalduecategory": "ApprovalDueCategory" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L266 | neighbors=[ApprovalDueImpactSection.tsx, approvalHelpers.ts]
- "utils_approvalhelpers_approvaldueimpact": "ApprovalDueImpact" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L271 | neighbors=[analyticsHelpers.ts, approvalHelpers.ts]
- "utils_approvalhelpers_avgapprovalhoursbysector": "avgApprovalHoursBySector()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L239 | neighbors=[OperationalSummaryPage.tsx, approvalHelpers.ts]
- "utils_approvalhelpers_buildpendingapprovalrows": "buildPendingApprovalRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L613 | neighbors=[useLiveOverview.ts, approvalHelpers.ts]
- "utils_approvalhelpers_completionentry": "completionEntry()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L396 | neighbors=[approvalHelpers.ts, getMissingApprovalActivityEntries()]
- "utils_approvalhelpers_getfinalapprovedround": "getFinalApprovedRound()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L197 | neighbors=[approvalHelpers.ts, getApprovalDueImpact()]
- "utils_approvalhelpers_getpendingapprovalduerisk": "getPendingApprovalDueRisk()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L353 | neighbors=[ApprovalDueImpactSection.tsx, approvalHelpers.ts]
- "utils_approvalhelpers_iapprovalperson": "IApprovalPerson" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L521 | neighbors=[ApprovalsPending.tsx, approvalHelpers.ts]
- "utils_approvalhelpers_pendingapprovalduerisk": "PendingApprovalDueRisk" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L328 | neighbors=[ApprovalDueImpactSection.tsx, approvalHelpers.ts]
- "utils_bidconfidentiality_diffpeople": "diffPeople()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L93 | neighbors=[BidConfidentialButton.tsx, bidConfidentiality.ts]
- "utils_bidconfidentiality_getbidkeypeople": "getBidKeyPeople()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L50 | neighbors=[ConfidentialAccessModal.tsx, bidConfidentiality.ts]
- "utils_bidconfidentiality_ikeyperson": "IKeyPerson" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L10 | neighbors=[bidConfidentiality.ts, IPersonRef]
- "utils_bidconfidentiality_issameperson": "isSamePerson()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L88 | neighbors=[bidConfidentiality.ts, normalizeEmail()]
- "utils_bidconfidentiality_keypeoplerole": "KeyPeopleRole" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L3 | neighbors=[ConfidentialAccessModal.tsx, bidConfidentiality.ts]
- "utils_bidhelpers_buildupcomingdeadlines": "buildUpcomingDeadlines()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L91 | neighbors=[useLiveOverview.ts, bidHelpers.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-049.json

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
