# Node Description Batch 34 of 43

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

- "function_app_function_app_rationale_325": "Render one retrieved document with the catalogued metadata, followed by\r     eve" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L325 | neighbors=[_document_block()]
- "function_app_function_app_rationale_361": "Hybrid (keyword + vector) retrieval. Retrieval is an enhancement, not a\r     har" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L361 | neighbors=[_reference_material()]
- "function_app_function_app_rationale_417": "UPN of the authenticated caller, from the EasyAuth X-MS-CLIENT-PRINCIPAL\r     he" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L417 | neighbors=[_caller_upn()]
- "function_app_function_app_rationale_593": "One hybrid search pass. Semantic ranking is billed per tier, so the caller" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L593 | neighbors=[_chat_search()]
- "function_app_function_app_rationale_616": "Hybrid retrieval for chat, deduplicated per document.\r \r     `top` counts CHUNKS" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L616 | neighbors=[_chat_reference_material()]
- "function_app_function_app_rationale_676": "Normalize the conversation, keeping only the most recent turns." | kind=entity | source=azure-ai-backend/function-app/function_app.py:L676 | neighbors=[_chat_messages()]
- "function_app_function_app_skill_chunk": "skill_chunk()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L784 | neighbors=[function_app.py]
- "gulpfile_build": "build" | kind=code-symbol | source=gulpfile.js:L3 | neighbors=[gulpfile.js]
- "hooks_useanalyticsfilters_default": "DEFAULT" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L26 | neighbors=[useAnalyticsFilters.ts]
- "hooks_useapprovals_approvalsummary": "ApprovalSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useApprovals.ts:L8 | neighbors=[useApprovals.ts]
- "hooks_usecharttheme_categorical": "CATEGORICAL" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L40 | neighbors=[useChartTheme.ts]
- "hooks_usecharttheme_charttheme": "ChartTheme" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L17 | neighbors=[useChartTheme.ts]
- "hooks_usecharttheme_dark": "DARK" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L53 | neighbors=[useChartTheme.ts]
- "hooks_usecharttheme_light": "LIGHT" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L74 | neighbors=[useChartTheme.ts]
- "hooks_useconfigphases_iconfigphase": "IConfigPhase" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useConfigPhases.ts:L5 | neighbors=[useConfigPhases.ts]
- "hooks_useern_useern": "useErn()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useErn.ts:L17 | neighbors=[useErn.ts]
- "hooks_useern_useernresult": "UseErnResult" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useErn.ts:L9 | neighbors=[useErn.ts]
- "hooks_useexport_useexport": "useExport()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useExport.ts:L9 | neighbors=[useExport.ts]
- "hooks_usekpis_bidkpis": "BidKPIs" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useKPIs.ts:L9 | neighbors=[useKPIs.ts]
- "hooks_usequerysearch_empty_results": "EMPTY_RESULTS" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L11 | neighbors=[useQuerySearch.ts]
- "hooks_usequerysearch_usequerysearchoptions": "UseQuerySearchOptions" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L17 | neighbors=[useQuerySearch.ts]
- "hooks_usequerysearch_usequerysearchreturn": "UseQuerySearchReturn" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L30 | neighbors=[useQuerySearch.ts]
- "hooks_userequests_userequests": "useRequests()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useRequests.ts:L8 | neighbors=[useRequests.ts]
- "hooks_useresponsive_breakpoints": "Breakpoints" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useResponsive.ts:L7 | neighbors=[useResponsive.ts]
- "hooks_usestatuscolors_statuscolorlookup": "StatusColorLookup" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useStatusColors.ts:L13 | neighbors=[useStatusColors.ts]
- "insights_aiinsightspanel_aiinsightspanelprops": "AIInsightsPanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AIInsightsPanel.tsx:L4 | neighbors=[AIInsightsPanel.tsx]
- "insights_analyticsfilterbar_analyticsfilterbarprops": "AnalyticsFilterBarProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AnalyticsFilterBar.tsx:L7 | neighbors=[AnalyticsFilterBar.tsx]
- "insights_analyticsfilterbar_presets": "PRESETS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AnalyticsFilterBar.tsx:L20 | neighbors=[AnalyticsFilterBar.tsx]
- "insights_multiselectdropdown_multiselectdropdownprops": "MultiSelectDropdownProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/MultiSelectDropdown.tsx:L10 | neighbors=[MultiSelectDropdown.tsx]
- "insights_segmentedcontrol_segmentedcontrolprops": "SegmentedControlProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/SegmentedControl.tsx:L11 | neighbors=[SegmentedControl.tsx]
- "knowledge_doclibrarycatalog_bulkaistatus": "BulkAiStatus" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L112 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_default_field_labels": "DEFAULT_FIELD_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L38 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_doclibrarycatalogprops": "DocLibraryCatalogProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L54 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_docthumb": "DocThumb()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L283 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_groupsuggestionbanner": "GroupSuggestionBanner()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L434 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_ibulkairow": "IBulkAiRow" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L120 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_idoclibraryfieldlabels": "IDocLibraryFieldLabels" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L21 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_igroupsuggestion": "IGroupSuggestion" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L115 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_metadatafields": "MetadataFields()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L317 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_runwithconcurrency": "runWithConcurrency()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L259 | neighbors=[DocLibraryCatalog.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-033.json

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
