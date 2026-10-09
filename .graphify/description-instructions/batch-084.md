# Node Description Batch 85 of 86

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

- "utils_pastbidledger_stopwords": "STOPWORDS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L45 | neighbors=[pastBidLedger.ts]
- "utils_pastbidledger_wordset": "wordSet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L26 | neighbors=[pastBidLedger.ts]
- "utils_pdfexport_buildpdfargs": "BuildPdfArgs" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L23 | neighbors=[pdfExport.ts]
- "utils_pdfexport_pdfchartimage": "PdfChartImage" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L7 | neighbors=[pdfExport.ts]
- "utils_pdfexport_pdfkpi": "PdfKpi" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L18 | neighbors=[pdfExport.ts]
- "utils_pdfexport_pdftable": "PdfTable" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L12 | neighbors=[pdfExport.ts]
- "utils_phasehelpers_getnextphase": "getNextPhase()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L75 | neighbors=[phaseHelpers.ts]
- "utils_phasehelpers_getoverallprogress": "getOverallProgress()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L29 | neighbors=[phaseHelpers.ts]
- "utils_phasehelpers_getpendingtasks": "getPendingTasks()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L91 | neighbors=[phaseHelpers.ts]
- "utils_phasehelpers_getphaseindex": "getPhaseIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L61 | neighbors=[phaseHelpers.ts]
- "utils_phasehelpers_getphaseprogress": "getPhaseProgress()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L18 | neighbors=[phaseHelpers.ts]
- "utils_phasehelpers_getpreviousphase": "getPreviousPhase()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L81 | neighbors=[phaseHelpers.ts]
- "utils_phasehelpers_isphasecompleted": "isPhaseCompleted()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L66 | neighbors=[phaseHelpers.ts]
- "utils_qualificationhelpers_iqualificationtabledraft": "IQualificationTableDraft" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L254 | neighbors=[qualificationHelpers.ts]
- "utils_qualificationhelpers_normalizeitem": "normalizeItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L42 | neighbors=[qualificationHelpers.ts]
- "utils_qualificationhelpers_samerow": "sameRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L266 | neighbors=[qualificationHelpers.ts]
- "utils_reporthelpers_clientperformance": "ClientPerformance" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L269 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_clientstatusrow": "ClientStatusRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L160 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_clientwinrate": "ClientWinRate" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L195 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_dimensioncount": "DimensionCount" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L78 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_monthkey": "monthKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L41 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_monthlabel": "monthLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L48 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_monthlystatusrow": "MonthlyStatusRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L121 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_months": "MONTHS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L18 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_requesterrow": "RequesterRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L242 | neighbors=[reportHelpers.ts]
- "utils_reporthelpers_statuscount": "StatusCount" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L53 | neighbors=[reportHelpers.ts]
- "utils_revisionhelpers_section_labels": "SECTION_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L20 | neighbors=[revisionHelpers.ts]
- "utils_revisionhelpers_trackablesection": "TrackableSection" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L11 | neighbors=[revisionHelpers.ts]
- "utils_scopehelpers_eng_solutions_subtypes": "ENG_SOLUTIONS_SUBTYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/scopeHelpers.ts:L6 | neighbors=[scopeHelpers.ts]
- "utils_scopehelpers_pn_placeholder_prefixes": "PN_PLACEHOLDER_PREFIXES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/scopeHelpers.ts:L49 | neighbors=[scopeHelpers.ts]
- "utils_scopehelpers_pn_placeholder_words": "PN_PLACEHOLDER_WORDS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/scopeHelpers.ts:L25 | neighbors=[scopeHelpers.ts]
- "utils_statushelpers_getprioritycolor": "getPriorityColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L135 | neighbors=[statusHelpers.ts]
- "utils_statushelpers_getstatusesbyphase": "getStatusesByPhase()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L67 | neighbors=[statusHelpers.ts]
- "utils_suppliermatching_connectors": "CONNECTORS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L39 | neighbors=[supplierMatching.ts]
- "utils_suppliermatching_isuppliersuggestion": "ISupplierSuggestion" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L150 | neighbors=[supplierMatching.ts]
- "utils_suppliermatching_legal_suffixes": "LEGAL_SUFFIXES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L9 | neighbors=[supplierMatching.ts]
- "utils_suppliermatching_supplierkeys": "supplierKeys()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L91 | neighbors=[supplierMatching.ts]
- "utils_supplierprofile_generic_email_domains": "GENERIC_EMAIL_DOMAINS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierProfile.ts:L19 | neighbors=[supplierProfile.ts]
- "utils_surveybidmatch_isdistinctive": "isDistinctive()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidMatch.ts:L17 | neighbors=[surveyBidMatch.ts]
- "utils_surveybidmatch_pnkey": "pnKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidMatch.ts:L10 | neighbors=[surveyBidMatch.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-084.json

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
