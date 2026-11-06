# Node Description Batch 79 of 102

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
For an entity node (any other kind — e.g. a person, place, event, object),
describe what the entity is and its role, grounded in its type, its
relations (neighbors) and the provided citations/evidence — e.g.
"Lady Carfax, a wealthy heiress who disappears en route to Lausanne.".
Ground entity descriptions in the citations/evidence when present; do not
speculate beyond the context, so a node with no supporting context may be
left out of the reply.
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "function_app_function_app_rationale_448": "A BID number safe to place inside an OData literal, or \"\"." | kind=entity | source=azure-ai-backend/function-app/function_app.py:L448 | neighbors=[_bid_ref()]
- "function_app_function_app_rationale_454": "Filter clause that keeps the BID being worked on out of its own precedents" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L454 | neighbors=[_not_this_bid()]
- "function_app_function_app_rationale_486": "Chunks grouped per source document, in ranking order, within the limits." | kind=entity | source=azure-ai-backend/function-app/function_app.py:L486 | neighbors=[_group_by_document()]
- "function_app_function_app_rationale_513": "Hybrid (keyword + vector) retrieval. Retrieval is an enhancement, not a\r     har" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L513 | neighbors=[_reference_material()]
- "function_app_function_app_rationale_554": "Completed BIDs whose scope resembles the client document. Unlike the\r     librar" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L554 | neighbors=[_past_bid_scope_material()]
- "function_app_function_app_rationale_581": "Clarif. & Qualif. library entries closest to the query. Every entry is its" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L581 | neighbors=[_clarification_library_material()]
- "function_app_function_app_rationale_593": "One hybrid search pass. Semantic ranking is billed per tier, so the caller" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L593 | neighbors=[_chat_search()]
- "function_app_function_app_rationale_616": "Hybrid retrieval for chat, deduplicated per document.\r \r     `top` counts CHUNKS" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L616 | neighbors=[_chat_reference_material()]
- "function_app_function_app_rationale_642": "UPN of the authenticated caller, from the EasyAuth X-MS-CLIENT-PRINCIPAL\r     he" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L642 | neighbors=[_caller_upn()]
- "function_app_function_app_rationale_676": "Normalize the conversation, keeping only the most recent turns." | kind=entity | source=azure-ai-backend/function-app/function_app.py:L676 | neighbors=[_chat_messages()]
- "function_app_function_app_rationale_847": "One hybrid search pass. Semantic ranking is billed per tier, so the caller" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L847 | neighbors=[_chat_search()]
- "function_app_function_app_rationale_876": "Hybrid retrieval for chat, deduplicated per document.\r \r     `top` counts CHUNKS" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L876 | neighbors=[_chat_reference_material()]
- "function_app_function_app_rationale_951": "Read the Past Bid documents SmartBid matched to the question, in depth.\r     Gen" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L951 | neighbors=[_chat_past_bid_material()]
- "function_app_function_app_rationale_995": "Normalize the conversation, keeping only the most recent turns." | kind=entity | source=azure-ai-backend/function-app/function_app.py:L995 | neighbors=[_chat_messages()]
- "function_app_function_app_skill_chunk": "skill_chunk()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L1269 | neighbors=[function_app.py]
- "gulpfile_build": "build" | kind=code-symbol | source=gulpfile.js:L3 | neighbors=[gulpfile.js]
- "hooks_useaccesslevel_iaccesslevelapi": "IAccessLevelApi" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAccessLevel.ts:L16 | neighbors=[useAccessLevel.ts]
- "hooks_useanalyticsfilters_analyticsfacetkey": "AnalyticsFacetKey" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L38 | neighbors=[useAnalyticsFilters.ts]
- "hooks_useanalyticsfilters_default": "DEFAULT" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L28 | neighbors=[useAnalyticsFilters.ts]
- "hooks_useanalyticsfilters_facet_values": "FACET_VALUES" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L45 | neighbors=[useAnalyticsFilters.ts]
- "hooks_useapprovals_approvalsummary": "ApprovalSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useApprovals.ts:L8 | neighbors=[useApprovals.ts]
- "hooks_useapprovalsync_flow_fields": "FLOW_FIELDS" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useApprovalSync.ts:L14 | neighbors=[useApprovalSync.ts]
- "hooks_useapprovalsync_pickflowchanges": "pickFlowChanges()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useApprovalSync.ts:L24 | neighbors=[useApprovalSync.ts]
- "hooks_usecharttheme_categorical": "CATEGORICAL" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L40 | neighbors=[useChartTheme.ts]
- "hooks_usecharttheme_categorical_rest": "CATEGORICAL_REST" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L42 | neighbors=[useChartTheme.ts]
- "hooks_usecharttheme_charttheme": "ChartTheme" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L19 | neighbors=[useChartTheme.ts]
- "hooks_usecharttheme_dark": "DARK" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L53 | neighbors=[useChartTheme.ts]
- "hooks_usecharttheme_dark_base": "DARK_BASE" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L60 | neighbors=[useChartTheme.ts]
- "hooks_usecharttheme_light": "LIGHT" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L74 | neighbors=[useChartTheme.ts]
- "hooks_usecharttheme_light_base": "LIGHT_BASE" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L79 | neighbors=[useChartTheme.ts]
- "hooks_useclarificationlibraryfilter_all_keys": "ALL_KEYS" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useClarificationLibraryFilter.ts:L33 | neighbors=[useClarificationLibraryFilter.ts]
- "hooks_useclarificationlibraryfilter_empty_filters": "EMPTY_FILTERS" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useClarificationLibraryFilter.ts:L43 | neighbors=[useClarificationLibraryFilter.ts]
- "hooks_useclarificationlibraryfilter_fixed_options": "FIXED_OPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useClarificationLibraryFilter.ts:L82 | neighbors=[useClarificationLibraryFilter.ts]
- "hooks_useclarificationlibraryfilter_ilibraryfilterstate": "ILibraryFilterState" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useClarificationLibraryFilter.ts:L70 | neighbors=[useClarificationLibraryFilter.ts]
- "hooks_useclarificationlibraryfilter_libraryfacetkey": "LibraryFacetKey" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useClarificationLibraryFilter.ts:L19 | neighbors=[useClarificationLibraryFilter.ts]
- "hooks_useclarificationlibraryfilter_libraryfilters": "LibraryFilters" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useClarificationLibraryFilter.ts:L28 | neighbors=[useClarificationLibraryFilter.ts]
- "hooks_useclarificationlibrarysync_inflight": "inFlight" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useClarificationLibrarySync.ts:L22 | neighbors=[useClarificationLibrarySync.ts]
- "hooks_usecolortheme_semanticcolorkind": "SemanticColorKind" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useColorTheme.ts:L14 | neighbors=[useColorTheme.ts]
- "hooks_useconfigphases_iconfigphase": "IConfigPhase" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useConfigPhases.ts:L5 | neighbors=[useConfigPhases.ts]
- "hooks_usedashboardfilters_default_period": "DEFAULT_PERIOD" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDashboardFilters.ts:L65 | neighbors=[useDashboardFilters.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-078.json

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
