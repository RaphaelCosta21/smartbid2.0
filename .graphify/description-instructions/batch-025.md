# Node Description Batch 26 of 43

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

- "stores_useuistore_thememode": "ThemeMode" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L3 | neighbors=[Header.tsx, useUIStore.ts]
- "template_templatecard_templatecard": "TemplateCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateCard.tsx:L14 | neighbors=[TemplatesPage.tsx, TemplateCard.tsx]
- "template_templateeditor_templateeditor": "TemplateEditor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateEditor.tsx:L25 | neighbors=[TemplatesPage.tsx, TemplateEditor.tsx]
- "template_templatepreview_templatepreview": "TemplatePreview()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplatePreview.tsx:L11 | neighbors=[TemplatesPage.tsx, TemplatePreview.tsx]
- "typings_svg_d": "svg.d.ts" | kind=code-symbol | source=src/typings/svg.d.ts:L1 | neighbors=[1665b01 more features, *.svg]
- "utils_accesscontrol_canedit": "canEdit()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L90 | neighbors=[accessControl.ts, hasAccess()]
- "utils_accesscontrol_canview": "canView()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L94 | neighbors=[accessControl.ts, hasAccess()]
- "utils_aicontext_buildrequirementstext": "buildRequirementsText()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiContext.ts:L38 | neighbors=[QualificationsTab.tsx, aiContext.ts]
- "utils_aiquotationmapper_iquotationlinedraft": "IQuotationLineDraft" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiQuotationMapper.ts:L14 | neighbors=[AddQuotationModal.tsx, aiQuotationMapper.ts]
- "utils_aiquotationmapper_mapextractedquotationline": "mapExtractedQuotationLine()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiQuotationMapper.ts:L93 | neighbors=[aiQuotationMapper.ts, resolveQuotationGroup()]
- "utils_aiquotationmapper_mapextractedquotationlines": "mapExtractedQuotationLines()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiQuotationMapper.ts:L126 | neighbors=[AddQuotationModal.tsx, aiQuotationMapper.ts]
- "utils_aiquotationmapper_normalizename": "normalizeName()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiQuotationMapper.ts:L30 | neighbors=[aiQuotationMapper.ts, resolveQuotationGroup()]
- "utils_analyticshelpers_addperiod": "addPeriod()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L89 | neighbors=[analyticsHelpers.ts, buildPeriodSequence()]
- "utils_analyticshelpers_bidhasrole": "bidHasRole()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L551 | neighbors=[analyticsHelpers.ts, personMatches()]
- "utils_analyticshelpers_delta": "Delta" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L620 | neighbors=[PerformanceTrendsPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_divisionphasematrix": "divisionPhaseMatrix()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L414 | neighbors=[BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_durationbyphase": "durationByPhase()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L354 | neighbors=[BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_durationbystatus": "durationByStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L381 | neighbors=[BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_durationstat": "DurationStat" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L12 | neighbors=[BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_granularity": "Granularity" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L11 | neighbors=[PerformanceTrendsPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_isbidactive": "isBidActive()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L158 | neighbors=[BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_isoweek": "isoWeek()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L65 | neighbors=[analyticsHelpers.ts, periodKey()]
- "utils_analyticshelpers_lasttwosum": "lastTwoSum()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L635 | neighbors=[AnalyticsPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_periodstart": "periodStart()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L78 | neighbors=[analyticsHelpers.ts, buildPeriodSequence()]
- "utils_analyticshelpers_personmatches": "personMatches()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L152 | neighbors=[analyticsHelpers.ts, bidHasRole()]
- "utils_analyticshelpers_phase_order": "PHASE_ORDER" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L16 | neighbors=[OperationalSummaryPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_phasefunnel": "phaseFunnel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L457 | neighbors=[BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_slowestbids": "slowestBids()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L484 | neighbors=[BottleneckAnalysisPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_teammemberstats": "TeamMemberStats" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L541 | neighbors=[TeamAnalyticsPage.tsx, analyticsHelpers.ts]
- "utils_analyticshelpers_teamworkload": "teamWorkload()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L562 | neighbors=[TeamAnalyticsPage.tsx, analyticsHelpers.ts]
- "utils_approvalhelpers_computeroundsectordurations": "computeRoundSectorDurations()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L41 | neighbors=[ApprovalTab.tsx, approvalHelpers.ts]
- "utils_bomparser_parsecsvrows": "parseCSVRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L47 | neighbors=[bomParser.ts, parseBomCSV()]
- "utils_bomparser_uid": "uid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L9 | neighbors=[bomParser.ts, emptyItem()]
- "utils_clarificationexport_escapehtml": "escapeHtml()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationExport.ts:L27 | neighbors=[clarificationExport.ts, exportClarificationsToExcel()]
- "utils_clarificationexport_formatdateonly": "formatDateOnly()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationExport.ts:L20 | neighbors=[clarificationExport.ts, zeroPad()]
- "utils_costcalculations_applycontingencysplit": "applyContingencySplit()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L39 | neighbors=[costCalculations.ts, applyContingencyToCost()]
- "utils_costcalculations_calculateassetstotals": "calculateAssetsTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L174 | neighbors=[costCalculations.ts, buildCostSummary()]
- "utils_costcalculations_getassetmaincostadj": "getAssetMainCostAdj()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L269 | neighbors=[costCalculations.ts, applyContingencyToCost()]
- "utils_costcalculations_getsubitemcosttotaladj": "getSubItemCostTotalAdj()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L311 | neighbors=[costCalculations.ts, applyContingencyToCost()]
- "utils_durationhelpers_formatdurationfromhours": "formatDurationFromHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/durationHelpers.ts:L30 | neighbors=[BidTimeline.tsx, durationHelpers.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-025.json

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
