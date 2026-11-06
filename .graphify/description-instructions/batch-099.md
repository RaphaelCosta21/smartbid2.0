# Node Description Batch 100 of 102

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

- "utils_nmeadecode_inmearesult": "INmeaResult" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L32 | neighbors=[nmeaDecode.ts]
- "utils_nmeadecode_inmeasummaryitem": "INmeaSummaryItem" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L20 | neighbors=[nmeaDecode.ts]
- "utils_nmeadecode_isentencespec": "ISentenceSpec" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L151 | neighbors=[nmeaDecode.ts]
- "utils_nmeadecode_mode": "MODE" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L80 | neighbors=[nmeaDecode.ts]
- "utils_nmeadecode_sentences": "SENTENCES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L159 | neighbors=[nmeaDecode.ts]
- "utils_nmeadecode_status": "STATUS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L75 | neighbors=[nmeaDecode.ts]
- "utils_nmeadecode_talkers": "TALKERS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L48 | neighbors=[nmeaDecode.ts]
- "utils_pastbiddocument_profilefields": "ProfileFields" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L40 | neighbors=[pastBidDocument.ts]
- "utils_pastbidhelpers_irelatedbid": "IRelatedBid" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L136 | neighbors=[pastBidHelpers.ts]
- "utils_pastbidledger_intent_words": "INTENT_WORDS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L36 | neighbors=[pastBidLedger.ts]
- "utils_pastbidledger_isyear": "isYear()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L70 | neighbors=[pastBidLedger.ts]
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
- "utils_pricehistory_ihistorystats": "IHistoryStats" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/priceHistory.ts:L229 | neighbors=[priceHistory.ts]
- "utils_qualificationhelpers_iqualificationtabledraft": "IQualificationTableDraft" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L254 | neighbors=[qualificationHelpers.ts]
- "utils_qualificationhelpers_normalizeitem": "normalizeItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L42 | neighbors=[qualificationHelpers.ts]
- "utils_qualificationhelpers_samerow": "sameRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L266 | neighbors=[qualificationHelpers.ts]
- "utils_quotationlinks_iquotationlinkhost": "IQuotationLinkHost" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L12 | neighbors=[quotationLinks.ts]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-099.json

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
