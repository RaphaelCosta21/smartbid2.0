# Node Description Batch 99 of 102

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

- "utils_constants_bid_size_colors": "BID_SIZE_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L16 | neighbors=[constants.ts]
- "utils_constants_bid_sizes": "BID_SIZES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L49 | neighbors=[constants.ts]
- "utils_constants_bid_types": "BID_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L41 | neighbors=[constants.ts]
- "utils_constants_priorities": "PRIORITIES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L51 | neighbors=[constants.ts]
- "utils_costcalculations_getassetmaincost": "getAssetMainCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L91 | neighbors=[costCalculations.ts]
- "utils_costcalculations_ifeelinks": "IFeeLinks" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L172 | neighbors=[costCalculations.ts]
- "utils_costcalculations_imulticurrencytotals": "IMultiCurrencyTotals" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L667 | neighbors=[costCalculations.ts]
- "utils_costcalculations_no_cost_availability": "NO_COST_AVAILABILITY" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L95 | neighbors=[costCalculations.ts]
- "utils_costsummaryview_icostbreakdownrow": "ICostBreakdownRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costSummaryView.ts:L16 | neighbors=[costSummaryView.ts]
- "utils_costsummaryview_icostbucket": "ICostBucket" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costSummaryView.ts:L33 | neighbors=[costSummaryView.ts]
- "utils_costsummaryview_idivisionhours": "IDivisionHours" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costSummaryView.ts:L62 | neighbors=[costSummaryView.ts]
- "utils_costsummaryview_integrated_divisions": "INTEGRATED_DIVISIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costSummaryView.ts:L61 | neighbors=[costSummaryView.ts]
- "utils_divisionhelpers_base_divisions": "BASE_DIVISIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L20 | neighbors=[divisionHelpers.ts]
- "utils_divisionhelpers_isssrintegratedline": "isSsrIntegratedLine()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L210 | neighbors=[divisionHelpers.ts]
- "utils_divisionhelpers_taggeditem": "TaggedItem" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L217 | neighbors=[divisionHelpers.ts]
- "utils_enghourshelpers_demandbucket": "DemandBucket" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/engHoursHelpers.ts:L11 | neighbors=[engHoursHelpers.ts]
- "utils_enghourshelpers_getdemandbucket": "getDemandBucket()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/engHoursHelpers.ts:L16 | neighbors=[engHoursHelpers.ts]
- "utils_enghourshelpers_ienghoursmonthrow": "IEngHoursMonthRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/engHoursHelpers.ts:L34 | neighbors=[engHoursHelpers.ts]
- "utils_enghourshelpers_monthkey": "monthKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/engHoursHelpers.ts:L69 | neighbors=[engHoursHelpers.ts]
- "utils_enghourshelpers_monthlabel": "monthLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/engHoursHelpers.ts:L74 | neighbors=[engHoursHelpers.ts]
- "utils_enghourshelpers_pipeline_results": "PIPELINE_RESULTS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/engHoursHelpers.ts:L14 | neighbors=[engHoursHelpers.ts]
- "utils_ernhelpers_deadline_rank": "DEADLINE_RANK" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L272 | neighbors=[ernHelpers.ts]
- "utils_ernhelpers_ern_closed_statuses": "ERN_CLOSED_STATUSES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L163 | neighbors=[ernHelpers.ts]
- "utils_ernhelpers_ern_service_line_map": "ERN_SERVICE_LINE_MAP" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L40 | neighbors=[ernHelpers.ts]
- "utils_ernhelpers_geterndaysleft": "getErnDaysLeft()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L206 | neighbors=[ernHelpers.ts]
- "utils_ernhelpers_iernslot": "IErnSlot" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L77 | neighbors=[ernHelpers.ts]
- "utils_ernlink_ernlinksource": "ErnLinkSource" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernLink.ts:L19 | neighbors=[ernLink.ts]
- "utils_ernlink_iernlinkinput": "IErnLinkInput" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernLink.ts:L10 | neighbors=[ernLink.ts]
- "utils_exporthelpers_formatexportvalue": "formatExportValue()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L40 | neighbors=[exportHelpers.ts]
- "utils_exporthelpers_iexportrow": "IExportRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L11 | neighbors=[exportHelpers.ts]
- "utils_facethelpers_facetvalue": "FacetValue" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/facetHelpers.ts:L6 | neighbors=[facetHelpers.ts]
- "utils_facethelpers_noinfer": "NoInfer" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/facetHelpers.ts:L9 | neighbors=[facetHelpers.ts]
- "utils_kpihelpers_failed_approval": "FAILED_APPROVAL" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L181 | neighbors=[kpiHelpers.ts]
- "utils_kpihelpers_otifresult": "OtifResult" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L230 | neighbors=[kpiHelpers.ts]
- "utils_kpihelpers_prioritycyclestat": "PriorityCycleStat" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L285 | neighbors=[kpiHelpers.ts]
- "utils_nmeadecode_fix_quality": "FIX_QUALITY" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L63 | neighbors=[nmeaDecode.ts]
- "utils_nmeadecode_formatdate": "formatDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L118 | neighbors=[nmeaDecode.ts]
- "utils_nmeadecode_formattime": "formatTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L115 | neighbors=[nmeaDecode.ts]
- "utils_nmeadecode_inmeachecksum": "INmeaChecksum" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L25 | neighbors=[nmeaDecode.ts]
- "utils_nmeadecode_inmeafield": "INmeaField" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L12 | neighbors=[nmeaDecode.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-098.json

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
