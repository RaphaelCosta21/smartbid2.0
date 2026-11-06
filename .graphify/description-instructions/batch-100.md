# Node Description Batch 101 of 102

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
- "utils_surveybidmatch_words": "words()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidMatch.ts:L7 | neighbors=[surveyBidMatch.ts]
- "utils_surveydatajourney_data_type_order": "DATA_TYPE_ORDER" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L114 | neighbors=[surveyDataJourney.ts]
- "utils_surveydatajourney_deliverableof": "deliverableOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L150 | neighbors=[surveyDataJourney.ts]
- "utils_surveydatajourney_idatajourney": "IDataJourney" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L89 | neighbors=[surveyDataJourney.ts]
- "utils_surveydatajourney_ijourneydeliverable": "IJourneyDeliverable" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L57 | neighbors=[surveyDataJourney.ts]
- "utils_surveydatajourney_ijourneyformat": "IJourneyFormat" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L47 | neighbors=[surveyDataJourney.ts]
- "utils_surveydatajourney_ijourneyoption": "IJourneyOption" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L105 | neighbors=[surveyDataJourney.ts]
- "utils_surveydatajourney_ijourneystep": "IJourneyStep" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L64 | neighbors=[surveyDataJourney.ts]
- "utils_surveydatajourney_journeystepkind": "JourneyStepKind" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L37 | neighbors=[surveyDataJourney.ts]
- "utils_surveydatajourney_linkformat": "linkFormat()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L161 | neighbors=[surveyDataJourney.ts]
- "utils_surveydatajourney_stage_order": "STAGE_ORDER" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L113 | neighbors=[surveyDataJourney.ts]
- "utils_surveydatajourney_termnames": "termNames()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L123 | neighbors=[surveyDataJourney.ts]
- "utils_surveyfailure_data_type_label": "DATA_TYPE_LABEL" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyFailure.ts:L25 | neighbors=[surveyFailure.ts]
- "utils_surveyfailure_overlaps": "overlaps()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyFailure.ts:L41 | neighbors=[surveyFailure.ts]
- "utils_surveyfreescene_empty": "EMPTY" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyFreeScene.ts:L29 | neighbors=[surveyFreeScene.ts]
- "utils_surveyfreescene_ifreescene": "IFreeScene" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyFreeScene.ts:L24 | neighbors=[surveyFreeScene.ts]
- "utils_surveyglossary_endpointclass": "EndpointClass" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L176 | neighbors=[surveyGlossary.ts]
- "utils_surveyglossary_escapere": "escapeRe()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L64 | neighbors=[surveyGlossary.ts]
- "utils_surveyglossary_ethernet_only_ids": "ETHERNET_ONLY_IDS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L183 | neighbors=[surveyGlossary.ts]
- "utils_surveyglossary_fold_re": "FOLD_RE" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L56 | neighbors=[surveyGlossary.ts]
- "utils_surveyglossary_iglossarymention": "IGlossaryMention" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L99 | neighbors=[surveyGlossary.ts]
- "utils_surveyglossary_iglossarysegment": "IGlossarySegment" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L137 | neighbors=[surveyGlossary.ts]
- "utils_surveyglossary_imatcher": "IMatcher" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L73 | neighbors=[surveyGlossary.ts]
- "utils_surveyglossary_ineedle": "INeedle" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L66 | neighbors=[surveyGlossary.ts]
- "utils_surveyglossary_network_shapes": "NETWORK_SHAPES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L178 | neighbors=[surveyGlossary.ts]
- "utils_surveyglossary_nmea_sensor_shapes": "NMEA_SENSOR_SHAPES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L179 | neighbors=[surveyGlossary.ts]
- "utils_surveyglossary_serial_only_ids": "SERIAL_ONLY_IDS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L181 | neighbors=[surveyGlossary.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-100.json

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
