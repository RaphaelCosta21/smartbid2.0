# Node Description Batch 83 of 86

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

- "utils_activityloghelpers_activity_meta": "ACTIVITY_META" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/activityLogHelpers.ts:L29 | neighbors=[activityLogHelpers.ts]
- "utils_activityloghelpers_iactivitydaygroup": "IActivityDayGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/activityLogHelpers.ts:L168 | neighbors=[activityLogHelpers.ts]
- "utils_activityloghelpers_iactivitymeta": "IActivityMeta" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/activityLogHelpers.ts:L23 | neighbors=[activityLogHelpers.ts]
- "utils_analyticshelpers_aggregate": "aggregate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L140 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_approvalimpactpoint": "ApprovalImpactPoint" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L345 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_completionpoint": "CompletionPoint" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L238 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_daysbetween": "daysBetween()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L62 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_default_terminal_statuses": "DEFAULT_TERMINAL_STATUSES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L29 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_divisionloadrow": "DivisionLoadRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L549 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_erntrendpoint": "ErnTrendPoint" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L208 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_funnelrow": "FunnelRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L493 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_heatmapmatrix": "HeatmapMatrix" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L445 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_months": "MONTHS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L37 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_otdpoint": "OtdPoint" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L307 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_periodlabel": "periodLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L110 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_phasedurationrow": "PhaseDurationRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L389 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_slowbidrow": "SlowBidRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L519 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_statusdurationrow": "StatusDurationRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L416 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_teamrole": "TeamRole" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L16 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_todate": "toDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L58 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_volumepoint": "VolumePoint" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L170 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_winratepoint": "WinRatePoint" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L271 | neighbors=[analyticsHelpers.ts]
- "utils_approvalhelpers_approvalduesummary": "ApprovalDueSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L334 | neighbors=[approvalHelpers.ts]
- "utils_approvalhelpers_approvalfilter": "ApprovalFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L142 | neighbors=[approvalHelpers.ts]
- "utils_approvalhelpers_buildpendingapprovalrow": "buildPendingApprovalRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L551 | neighbors=[approvalHelpers.ts]
- "utils_approvalhelpers_getapprovalsector": "getApprovalSector()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L32 | neighbors=[approvalHelpers.ts]
- "utils_approvalhelpers_person_status_rank": "PERSON_STATUS_RANK" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L545 | neighbors=[approvalHelpers.ts]
- "utils_approvalhelpers_roundisclosed": "roundIsClosed()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L89 | neighbors=[approvalHelpers.ts]
- "utils_approvalhelpers_sectorapprovalhoursstat": "SectorApprovalHoursStat" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L230 | neighbors=[approvalHelpers.ts]
- "utils_approvalhelpers_sectorapprovalstat": "SectorApprovalStat" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L134 | neighbors=[approvalHelpers.ts]
- "utils_approvalhelpers_sectorclosed": "sectorClosed()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L43 | neighbors=[approvalHelpers.ts]
- "utils_bidconfidentiality_ipersonref": "IPersonRef" | kind=code-symbol | neighbors=[IKeyPerson]
- "utils_bidhelpers_generatebidnumber": "generateBidNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L166 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_getbidsbydivision": "getBidsByDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L102 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_getbidsbyphase": "getBidsByPhase()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L110 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_getbidsbystatus": "getBidsByStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L106 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_gettotalcostusd": "getTotalCostUSD()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L126 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_gettotalhours": "getTotalHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L114 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_getuniqueclients": "getUniqueClients()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L130 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_getuniquecreators": "getUniqueCreators()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L142 | neighbors=[bidHelpers.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-082.json

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
