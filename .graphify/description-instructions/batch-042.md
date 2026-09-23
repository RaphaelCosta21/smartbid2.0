# Node Description Batch 43 of 43

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

- "utils_ernhelpers_iernslot": "IErnSlot" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L25 | neighbors=[ernHelpers.ts]
- "utils_ernlink_ernlinksource": "ErnLinkSource" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernLink.ts:L19 | neighbors=[ernLink.ts]
- "utils_ernlink_iernlinkinput": "IErnLinkInput" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernLink.ts:L10 | neighbors=[ernLink.ts]
- "utils_exporthelpers_formatexportvalue": "formatExportValue()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L40 | neighbors=[exportHelpers.ts]
- "utils_exporthelpers_iexportrow": "IExportRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L11 | neighbors=[exportHelpers.ts]
- "utils_formatters_formatrelativetime": "formatRelativeTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L42 | neighbors=[formatters.ts]
- "utils_pdfexport_buildpdfargs": "BuildPdfArgs" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L23 | neighbors=[pdfExport.ts]
- "utils_pdfexport_pdfchartimage": "PdfChartImage" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L7 | neighbors=[pdfExport.ts]
- "utils_pdfexport_pdfkpi": "PdfKpi" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L18 | neighbors=[pdfExport.ts]
- "utils_pdfexport_pdftable": "PdfTable" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L12 | neighbors=[pdfExport.ts]
- "utils_phasehelpers_getnextphase": "getNextPhase()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L69 | neighbors=[phaseHelpers.ts]
- "utils_phasehelpers_getoverallprogress": "getOverallProgress()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L23 | neighbors=[phaseHelpers.ts]
- "utils_phasehelpers_getpendingtasks": "getPendingTasks()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L85 | neighbors=[phaseHelpers.ts]
- "utils_phasehelpers_getphaseindex": "getPhaseIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L55 | neighbors=[phaseHelpers.ts]
- "utils_phasehelpers_getphaseprogress": "getPhaseProgress()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L12 | neighbors=[phaseHelpers.ts]
- "utils_phasehelpers_getpreviousphase": "getPreviousPhase()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L75 | neighbors=[phaseHelpers.ts]
- "utils_phasehelpers_isphasecompleted": "isPhaseCompleted()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L60 | neighbors=[phaseHelpers.ts]
- "utils_reporthelpers_clientperformance": "ClientPerformance" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L269 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_clientstatusrow": "ClientStatusRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L160 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_clientwinrate": "ClientWinRate" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L195 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_dimensioncount": "DimensionCount" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L78 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_getresultstatus": "getResultStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L34 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_monthkey": "monthKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L41 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_monthlabel": "monthLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L48 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_monthlystatusrow": "MonthlyStatusRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L121 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_months": "MONTHS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L18 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_requesterrow": "RequesterRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L242 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_statuscount": "StatusCount" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L53 | neighbors=[reportHelpers.ts]
- "utils_revisionhelpers_section_labels": "SECTION_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L18 | neighbors=[revisionHelpers.ts]
- "utils_revisionhelpers_trackablesection": "TrackableSection" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L9 | neighbors=[revisionHelpers.ts]
- "utils_statushelpers_getprioritycolor": "getPriorityColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L126 | neighbors=[statusHelpers.ts]
- "utils_statushelpers_getstatusesbyphase": "getStatusesByPhase()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L62 | neighbors=[statusHelpers.ts]
- "utils_validators_ivalidationresult": "IValidationResult" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L6 | neighbors=[validators.ts]
- "utils_validators_validatebidnumber": "validateBidNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L26 | neighbors=[validators.ts]
- "utils_validators_validatedaterange": "validateDateRange()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L34 | neighbors=[validators.ts]
- "utils_validators_validateemail": "validateEmail()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L19 | neighbors=[validators.ts]
- "utils_validators_validatemaxlength": "validateMaxLength()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L52 | neighbors=[validators.ts]
- "utils_validators_validatepositivenumber": "validatePositiveNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L44 | neighbors=[validators.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-042.json

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
