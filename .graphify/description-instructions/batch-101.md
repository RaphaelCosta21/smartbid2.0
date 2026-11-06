# Node Description Batch 102 of 102

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

- "utils_surveyglossary_term_by_id": "TERM_BY_ID" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L18 | neighbors=[surveyGlossary.ts]
- "utils_surveypackages_baseid": "baseId()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyPackages.ts:L25 | neighbors=[surveyPackages.ts]
- "utils_surveypackages_ispackage": "isPackage()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyPackages.ts:L17 | neighbors=[surveyPackages.ts]
- "utils_surveypackages_union": "union()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyPackages.ts:L27 | neighbors=[surveyPackages.ts]
- "utils_surveyspreadgraph_adjacency": "Adjacency" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L244 | neighbors=[surveySpreadGraph.ts]
- "utils_surveyspreadgraph_anchorclass": "anchorClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L147 | neighbors=[surveySpreadGraph.ts]
- "utils_surveyspreadgraph_catalog_room": "CATALOG_ROOM" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L155 | neighbors=[surveySpreadGraph.ts]
- "utils_surveyspreadgraph_idataroute": "IDataRoute" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L403 | neighbors=[surveySpreadGraph.ts]
- "utils_surveyspreadgraph_instanceof": "instanceOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L51 | neighbors=[surveySpreadGraph.ts]
- "utils_surveyspreadgraph_isignalpath": "ISignalPath" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L41 | neighbors=[surveySpreadGraph.ts]
- "utils_surveyspreadgraph_logical_stages": "LOGICAL_STAGES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L392 | neighbors=[surveySpreadGraph.ts]
- "utils_surveyspreadgraph_overlaps": "overlaps()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L400 | neighbors=[surveySpreadGraph.ts]
- "utils_surveyspreadgraph_shape_rules": "SHAPE_RULES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L613 | neighbors=[surveySpreadGraph.ts]
- "utils_surveyspreadgraph_signal_fallback_ids": "SIGNAL_FALLBACK_IDS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L48 | neighbors=[surveySpreadGraph.ts]
- "utils_surveyspreadgraph_stage_key": "STAGE_KEY" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L393 | neighbors=[surveySpreadGraph.ts]
- "utils_surveyspreadgraph_stage_titles": "STAGE_TITLES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L381 | neighbors=[surveySpreadGraph.ts]
- "utils_surveyspreadgraph_subsea_anchors": "SUBSEA_ANCHORS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L146 | neighbors=[surveySpreadGraph.ts]
- "utils_technicalproposalhelpers_istechnicalproposalattachment": "isTechnicalProposalAttachment()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/technicalProposalHelpers.ts:L22 | neighbors=[technicalProposalHelpers.ts]
- "utils_validators_ivalidationresult": "IValidationResult" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L6 | neighbors=[validators.ts]
- "utils_validators_validatebidnumber": "validateBidNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L26 | neighbors=[validators.ts]
- "utils_validators_validatedaterange": "validateDateRange()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L34 | neighbors=[validators.ts]
- "utils_validators_validateemail": "validateEmail()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L19 | neighbors=[validators.ts]
- "utils_validators_validatepositivenumber": "validatePositiveNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L44 | neighbors=[validators.ts]
- "utils_winprobability_addto": "addTo()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L56 | neighbors=[winProbability.ts]
- "utils_winprobability_itally": "ITally" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L23 | neighbors=[winProbability.ts]
- "utils_winprobability_iwinprobability": "IWinProbability" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L15 | neighbors=[winProbability.ts]
- "utils_winprobability_winprobabilitysource": "WinProbabilitySource" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L8 | neighbors=[winProbability.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-101.json

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
