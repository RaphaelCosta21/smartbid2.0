# Node Description Batch 98 of 102

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

- "utils_approvaltracks_approvaltrack": "ApprovalTrack" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L27 | neighbors=[approvalTracks.ts]
- "utils_bidcomparator_comparisonexportrow": "ComparisonExportRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L352 | neighbors=[bidComparator.ts]
- "utils_bidcomparator_ibidtotal": "IBidTotal" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L73 | neighbors=[bidComparator.ts]
- "utils_bidcomparator_icomparableline": "IComparableLine" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L19 | neighbors=[bidComparator.ts]
- "utils_bidcomparator_icomparisoninsights": "IComparisonInsights" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L92 | neighbors=[bidComparator.ts]
- "utils_bidcomparator_ihistmatch": "IHistMatch" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L180 | neighbors=[bidComparator.ts]
- "utils_bidcomparator_ipair": "IPair" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L123 | neighbors=[bidComparator.ts]
- "utils_bidcomparator_matchlines": "matchLines()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L131 | neighbors=[bidComparator.ts]
- "utils_bidcomparator_money": "money()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L354 | neighbors=[bidComparator.ts]
- "utils_bidconfidentiality_ipersonref": "IPersonRef" | kind=code-symbol | neighbors=[IKeyPerson]
- "utils_bidhelpers_generatebidnumber": "generateBidNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L166 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_getbidsbydivision": "getBidsByDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L102 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_getbidsbyphase": "getBidsByPhase()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L110 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_getbidsbystatus": "getBidsByStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L106 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_gettotalcostusd": "getTotalCostUSD()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L126 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_gettotalhours": "getTotalHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L114 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_getuniqueclients": "getUniqueClients()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L130 | neighbors=[bidHelpers.ts]
- "utils_bidhelpers_getuniquecreators": "getUniqueCreators()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L142 | neighbors=[bidHelpers.ts]
- "utils_bidpresentation_acquisitionlabel": "acquisitionLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L41 | neighbors=[bidPresentation.ts]
- "utils_bidpresentation_buildhoursbyphase": "buildHoursByPhase()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L272 | neighbors=[bidPresentation.ts]
- "utils_bidpresentation_describescore": "describeScore()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L429 | neighbors=[bidPresentation.ts]
- "utils_bidpresentation_groupbyacquisition": "groupByAcquisition()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L243 | neighbors=[bidPresentation.ts]
- "utils_bidpresentation_iacquisitiongroup": "IAcquisitionGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L234 | neighbors=[bidPresentation.ts]
- "utils_bidpresentation_iacquisitionstat": "IAcquisitionStat" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L351 | neighbors=[bidPresentation.ts]
- "utils_bidpresentation_ihoursbyphase": "IHoursByPhase" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L267 | neighbors=[bidPresentation.ts]
- "utils_bidpresentation_invalid_pns": "INVALID_PNS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L17 | neighbors=[bidPresentation.ts]
- "utils_bidpresentation_ipresentationstats": "IPresentationStats" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L155 | neighbors=[bidPresentation.ts]
- "utils_bidpresentation_pushto": "pushTo()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L376 | neighbors=[bidPresentation.ts]
- "utils_bomcosthelpers_bomdateage": "BomDateAge" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L291 | neighbors=[bomCostHelpers.ts]
- "utils_bomcosthelpers_hasowncost": "hasOwnCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L103 | neighbors=[bomCostHelpers.ts]
- "utils_bomcosthelpers_ibomcoverage": "IBomCoverage" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L228 | neighbors=[bomCostHelpers.ts]
- "utils_bomcosthelpers_month_names": "MONTH_NAMES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L7 | neighbors=[bomCostHelpers.ts]
- "utils_bomexcelexport_ibomexceloptions": "IBomExcelOptions" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomExcelExport.ts:L36 | neighbors=[bomExcelExport.ts]
- "utils_bomexcelexport_sourcelabel": "sourceLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomExcelExport.ts:L60 | neighbors=[bomExcelExport.ts]
- "utils_bomexcelexport_status_color": "STATUS_COLOR" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomExcelExport.ts:L52 | neighbors=[bomExcelExport.ts]
- "utils_bomexcelexport_status_label": "STATUS_LABEL" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomExcelExport.ts:L44 | neighbors=[bomExcelExport.ts]
- "utils_clarificationexcelexport_iclarificationexceloptions": "IClarificationExcelOptions" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationExcelExport.ts:L31 | neighbors=[clarificationExcelExport.ts]
- "utils_clarificationhelpers_ref_placeholders": "REF_PLACEHOLDERS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L14 | neighbors=[clarificationHelpers.ts]
- "utils_clarificationlibrarydocument_plural": "PLURAL" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationLibraryDocument.ts:L38 | neighbors=[clarificationLibraryDocument.ts]
- "utils_constants_acquisition_types": "ACQUISITION_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L53 | neighbors=[constants.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-097.json

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
