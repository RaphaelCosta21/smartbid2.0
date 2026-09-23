# Node Description Batch 33 of 43

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

- "dashboard_dashboardkpirow_dashboardkpirowprops": "DashboardKPIRowProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardKPIRow.tsx:L6 | neighbors=[DashboardKPIRow.tsx]
- "dashboard_divisionworkload_divisionworkload": "DivisionWorkload()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DivisionWorkload.tsx:L11 | neighbors=[DivisionWorkload.tsx]
- "dashboard_divisionworkload_divisionworkloadprops": "DivisionWorkloadProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DivisionWorkload.tsx:L6 | neighbors=[DivisionWorkload.tsx]
- "dashboard_enghoursranking_enghoursrankingprops": "EngHoursRankingProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursRanking.tsx:L19 | neighbors=[EngHoursRanking.tsx]
- "dashboard_enghoursranking_scope": "Scope" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursRanking.tsx:L12 | neighbors=[EngHoursRanking.tsx]
- "dashboard_enghoursranking_scope_segments": "SCOPE_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursRanking.tsx:L14 | neighbors=[EngHoursRanking.tsx]
- "dashboard_erndashboardsection_erndashboardsectionprops": "ErnDashboardSectionProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ErnDashboardSection.tsx:L29 | neighbors=[ErnDashboardSection.tsx]
- "dashboard_monthlyvolumechart_monthlyvolumechart": "MonthlyVolumeChart()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/MonthlyVolumeChart.tsx:L11 | neighbors=[MonthlyVolumeChart.tsx]
- "dashboard_monthlyvolumechart_monthlyvolumechartprops": "MonthlyVolumeChartProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/MonthlyVolumeChart.tsx:L6 | neighbors=[MonthlyVolumeChart.tsx]
- "dashboard_recentactivity_recentactivity": "RecentActivity()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/RecentActivity.tsx:L24 | neighbors=[RecentActivity.tsx]
- "dashboard_recentactivity_recentactivityprops": "RecentActivityProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/RecentActivity.tsx:L7 | neighbors=[RecentActivity.tsx]
- "dashboard_recentactivity_type_colors": "TYPE_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/RecentActivity.tsx:L12 | neighbors=[RecentActivity.tsx]
- "dashboard_upcomingdeadlines_upcomingdeadlinesprops": "UpcomingDeadlinesProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/UpcomingDeadlines.tsx:L7 | neighbors=[UpcomingDeadlines.tsx]
- "data_defaultsystemconfig_default_system_config": "DEFAULT_SYSTEM_CONFIG" | kind=code-symbol | source=src/webparts/smartBid20/app/data/defaultSystemConfig.ts:L8 | neighbors=[defaultSystemConfig.ts]
- "data_mockapprovals_mockapprovals": "mockApprovals" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockApprovals.ts:L3 | neighbors=[mockApprovals.ts]
- "data_mocknotifications_mock_notifications": "MOCK_NOTIFICATIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockNotifications.ts:L3 | neighbors=[mockNotifications.ts]
- "data_mockrequests_mockrequests": "mockRequests" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockRequests.ts:L3 | neighbors=[mockRequests.ts]
- "data_mocktemplates_ibidtemplate": "IBidTemplate" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockTemplates.ts:L1 | neighbors=[mockTemplates.ts]
- "data_mocktemplates_mock_templates": "MOCK_TEMPLATES" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockTemplates.ts:L16 | neighbors=[mockTemplates.ts]
- "function_app_document_structure_breadcrumb": "breadcrumb()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L330 | neighbors=[document_structure.py]
- "function_app_document_structure_rationale_1": "document_structure.py — section-aware Markdown chunking for the SmartBid docs in" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L1 | neighbors=[document_structure.py]
- "function_app_document_structure_rationale_106": "Guards against all-caps noise such as the \"X X X X\" row of a maintenance\r     ma" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L106 | neighbors=[_has_word()]
- "function_app_document_structure_rationale_120": "A single-level number is indistinguishable from a quantity in a\r     specificati" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L120 | neighbors=[_numbered_title()]
- "function_app_document_structure_rationale_132": "Collapse whitespace and mask digits so \"Page 3 of 19\" and \"Page 4 of 19\"\r     co" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L132 | neighbors=[_normalize()]
- "function_app_document_structure_rationale_138": "Digit masking is what catches a running footer, but it also makes a\r     measure" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L138 | neighbors=[_is_boilerplate()]
- "function_app_document_structure_rationale_181": "Return (level, title) when the line opens a section, else None." | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L181 | neighbors=[_heading()]
- "function_app_document_structure_rationale_221": "Walk the document once, keeping a heading stack so every section carries\r     it" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L221 | neighbors=[split_sections()]
- "function_app_document_structure_rationale_263": "Paragraphs are indivisible, so a specification table extracted as one\r     block" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L263 | neighbors=[_atomic_blocks()]
- "function_app_document_structure_rationale_317": "`since` is the path already rendered earlier in the same chunk, so shared\r     a" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L317 | neighbors=[_render()]
- "function_app_document_structure_rationale_346": "Rendered once per chunk and fed to the embedding model. Without it the\r     vect" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L346 | neighbors=[metadata_header()]
- "function_app_document_structure_rationale_376": "Return one dict per chunk: `text` is what gets stored and shown to the\r     mode" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L376 | neighbors=[build_chunks()]
- "function_app_function_app_rationale_1": "SmartBid AI backend — Azure Functions (Python v2 programming model).\r \r  Three H" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L1 | neighbors=[function_app.py]
- "function_app_function_app_rationale_125": "Prefer extracted text (cheap). For scanned/image PDFs with no text,\r     return" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L125 | neighbors=[extract_text_or_images()]
- "function_app_function_app_rationale_152": "Guarantee plain text. If we only have page images (scanned document),\r     use g" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L152 | neighbors=[ensure_text()]
- "function_app_function_app_rationale_231": "Parse the model's JSON answer. A reasoning model can return an empty\r     messag" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L231 | neighbors=[_model_json()]
- "function_app_function_app_rationale_245": "Return (text, warnings), capping the length so a huge upload degrades\r     into" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L245 | neighbors=[_document_text()]
- "function_app_function_app_rationale_271": "Input vs output tokens — the two behave very differently: prefill is fast," | kind=entity | source=azure-ai-backend/function-app/function_app.py:L271 | neighbors=[_token_usage()]
- "function_app_function_app_rationale_283": "Return (body, file_name, file_bytes, system_prompt, document_text_override)." | kind=entity | source=azure-ai-backend/function-app/function_app.py:L283 | neighbors=[_parse_request()]
- "function_app_function_app_rationale_296": "BID metadata SmartBid sends with every request (see utils/aiContext.ts)." | kind=entity | source=azure-ai-backend/function-app/function_app.py:L296 | neighbors=[_context_lines()]
- "function_app_function_app_rationale_316": "Bias retrieval towards the BID's division/service line, so a datasheet from" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L316 | neighbors=[_retrieval_query()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-032.json

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
