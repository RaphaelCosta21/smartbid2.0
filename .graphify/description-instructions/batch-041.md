# Node Description Batch 42 of 43

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

- "utils_analyticshelpers_divisionloadrow": "DivisionLoadRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L508 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_erntrendpoint": "ErnTrendPoint" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L207 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_funnelrow": "FunnelRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L452 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_heatmapmatrix": "HeatmapMatrix" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L404 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_months": "MONTHS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L34 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_otdpoint": "OtdPoint" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L306 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_periodlabel": "periodLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L109 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_phasedurationrow": "PhaseDurationRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L348 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_slowbidrow": "SlowBidRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L478 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_statusdurationrow": "StatusDurationRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L375 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_teamrole": "TeamRole" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L13 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_todate": "toDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L55 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_volumepoint": "VolumePoint" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L169 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_winratepoint": "WinRatePoint" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L270 | neighbors=[analyticsHelpers.ts]
- "utils_approvalhelpers_approvalfilter": "ApprovalFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L129 | neighbors=[approvalHelpers.ts]
- "utils_approvalhelpers_getapprovalsector": "getApprovalSector()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L25 | neighbors=[approvalHelpers.ts]
- "utils_approvalhelpers_roundisclosed": "roundIsClosed()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L76 | neighbors=[approvalHelpers.ts]
- "utils_approvalhelpers_sectorapprovalstat": "SectorApprovalStat" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L121 | neighbors=[approvalHelpers.ts]
- "utils_approvalhelpers_sectorclosed": "sectorClosed()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L36 | neighbors=[approvalHelpers.ts]
- "utils_approvalhelpers_totime": "toTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L29 | neighbors=[approvalHelpers.ts]
- "utils_bidhelpers_generatebidnumber": "generateBidNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L83 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_getbidsbydivision": "getBidsByDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L19 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_getbidsbyphase": "getBidsByPhase()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L27 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_getbidsbystatus": "getBidsByStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L23 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_gettotalcostusd": "getTotalCostUSD()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L43 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_gettotalhours": "getTotalHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L31 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_getuniqueclients": "getUniqueClients()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L47 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_getuniquecreators": "getUniqueCreators()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L59 | neighbors=[bidHelpers.ts]
- "utils_clarificationexport_iclarificationexportoptions": "IClarificationExportOptions" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationExport.ts:L35 | neighbors=[clarificationExport.ts]
- "utils_constants_acquisition_types": "ACQUISITION_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L51 | neighbors=[constants.ts]
- "utils_constants_bid_size_colors": "BID_SIZE_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L14 | neighbors=[constants.ts]
- "utils_constants_bid_sizes": "BID_SIZES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L47 | neighbors=[constants.ts]
- "utils_constants_bid_types": "BID_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L39 | neighbors=[constants.ts]
- "utils_constants_priorities": "PRIORITIES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L49 | neighbors=[constants.ts]
- "utils_costcalculations_getassetmaincost": "getAssetMainCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L91 | neighbors=[costCalculations.ts]
- "utils_costcalculations_geteffectivecategory": "getEffectiveCategory()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L164 | neighbors=[costCalculations.ts]
- "utils_costcalculations_getsplitcost": "getSplitCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L66 | neighbors=[costCalculations.ts]
- "utils_costcalculations_getsubitemcosttotal": "getSubItemCostTotal()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L135 | neighbors=[costCalculations.ts]
- "utils_costcalculations_iassetresourcetypecost": "IAssetResourceTypeCost" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L17 | neighbors=[costCalculations.ts]
- "utils_ernhelpers_geterndaysleft": "getErnDaysLeft()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L133 | neighbors=[ernHelpers.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-041.json

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
