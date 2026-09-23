# Node Description Batch 27 of 43

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

- "utils_durationhelpers_formatdurationhours": "formatDurationHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/durationHelpers.ts:L11 | neighbors=[BidStatusPhasePanel.tsx, durationHelpers.ts]
- "utils_durationhelpers_formatliveelapsed": "formatLiveElapsed()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/durationHelpers.ts:L50 | neighbors=[BidTimeline.tsx, durationHelpers.ts]
- "utils_ernhelpers_ern_revision_reasons": "ERN_REVISION_REASONS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L8 | neighbors=[ErnCreateModal.tsx, ernHelpers.ts]
- "utils_ernhelpers_resolveernprojectnumber": "resolveErnProjectNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L91 | neighbors=[ErnCreateModal.tsx, ernHelpers.ts]
- "utils_exporthelpers_bidtoexportrow": "bidToExportRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L15 | neighbors=[ExportService.ts, exportHelpers.ts]
- "utils_exporthelpers_zeropad": "zeroPad()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L7 | neighbors=[exportHelpers.ts, getExportFilename()]
- "utils_formatters_formatdaysleft": "formatDaysLeft()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L48 | neighbors=[BidDetailPage.tsx, formatters.ts]
- "utils_phasehelpers_getphaselabelforbid": "getPhaseLabelForBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L81 | neighbors=[OverviewTab.tsx, phaseHelpers.ts]
- "utils_reporthelpers_bidtablerow": "BidTableRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L344 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_bidtablerows": "bidTableRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L358 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_bycommercialrequester": "byCommercialRequester()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L248 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_clientperformancebydivision": "clientPerformanceByDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L276 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_clientperfrow": "ClientPerfRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L261 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_divisioncounts": "divisionCounts()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L85 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_monthlystatusstacked": "monthlyStatusStacked()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L128 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_servicelinecounts": "serviceLineCounts()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L103 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_statusbyclient": "statusByClient()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L166 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_statuscounts": "statusCounts()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L60 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_statusoption": "StatusOption" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L9 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_winratebyclient": "winRateByClient()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L203 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_revisionhelpers_appendrevisionchanges": "appendRevisionChanges()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L563 | neighbors=[BidDetailPage.tsx, revisionHelpers.ts]
- "utils_revisionhelpers_detectrevisionchanges": "detectRevisionChanges()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L31 | neighbors=[BidDetailPage.tsx, revisionHelpers.ts]
- "utils_revisionhelpers_getsectionfrompatch": "getSectionFromPatch()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L541 | neighbors=[BidDetailPage.tsx, revisionHelpers.ts]
- "utils_statushelpers_getactivestatuses": "getActiveStatuses()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L85 | neighbors=[FlowBoardPage.tsx, statusHelpers.ts]
- "utils_statushelpers_getstatuscolor": "getStatusColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L43 | neighbors=[statusHelpers.ts, getStatusDef()]
- "utils_statushelpers_getstatusorder": "getStatusOrder()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L58 | neighbors=[statusHelpers.ts, getStatusDef()]
- "utils_statushelpers_getterminalstatuses": "getTerminalStatuses()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L104 | neighbors=[BidResultsPage.tsx, statusHelpers.ts]
- "utils_validators_sanitizetext": "sanitizeText()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L89 | neighbors=[CreateRequestPage.tsx, validators.ts]
- "utils_validators_validatebidrequest": "validateBidRequest()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L62 | neighbors=[validators.ts, validateRequired()]
- "utils_validators_validaterequired": "validateRequired()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L11 | neighbors=[validators.ts, validateBidRequest()]
- "approval_approvalbadge_approvalbadge": "ApprovalBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalBadge.tsx:L10 | neighbors=[ApprovalBadge.tsx]
- "approval_approvalbadge_approvalbadgeprops": "ApprovalBadgeProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalBadge.tsx:L5 | neighbors=[ApprovalBadge.tsx]
- "approval_approvaldecisionpanel_approvaldecisionpanel": "ApprovalDecisionPanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalDecisionPanel.tsx:L13 | neighbors=[ApprovalDecisionPanel.tsx]
- "approval_approvaldecisionpanel_approvaldecisionpanelprops": "ApprovalDecisionPanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalDecisionPanel.tsx:L4 | neighbors=[ApprovalDecisionPanel.tsx]
- "approval_approvalmatrix_approvalmatrix": "ApprovalMatrix()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalMatrix.tsx:L11 | neighbors=[ApprovalMatrix.tsx]
- "approval_approvalmatrix_approvalmatrixprops": "ApprovalMatrixProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalMatrix.tsx:L6 | neighbors=[ApprovalMatrix.tsx]
- "approval_approvalrequestcard_approvalrequestcard": "ApprovalRequestCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalRequestCard.tsx:L11 | neighbors=[ApprovalRequestCard.tsx]
- "approval_approvalrequestcard_approvalrequestcardprops": "ApprovalRequestCardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalRequestCard.tsx:L5 | neighbors=[ApprovalRequestCard.tsx]
- "approval_approvaltimeline_approvaltimeline": "ApprovalTimeline()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalTimeline.tsx:L11 | neighbors=[ApprovalTimeline.tsx]
- "approval_approvaltimeline_approvaltimelineprops": "ApprovalTimelineProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalTimeline.tsx:L6 | neighbors=[ApprovalTimeline.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-026.json

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
