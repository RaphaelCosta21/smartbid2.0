# Node Description Batch 66 of 86

Graphify is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the prompt below and write
your JSON answer to the answer file.

## Prompt

You are documenting nodes in a knowledge graph.
For each entry below, write ONE concise factual plain-language sentence
describing what it is or does. Use only the provided context.
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

- "function_app_document_structure_rationale_181": "Return (level, title) when the line opens a section, else None." | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L181 | neighbors=[_heading()]
- "function_app_document_structure_rationale_199": "Return (level, title) when the line opens a section, else None." | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L199 | neighbors=[_heading()]
- "function_app_document_structure_rationale_221": "Walk the document once, keeping a heading stack so every section carries\r     it" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L221 | neighbors=[split_sections()]
- "function_app_document_structure_rationale_246": "Walk the document once, keeping a heading stack so every section carries\r     it" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L246 | neighbors=[split_sections()]
- "function_app_document_structure_rationale_263": "Paragraphs are indivisible, so a specification table extracted as one\r     block" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L263 | neighbors=[_atomic_blocks()]
- "function_app_document_structure_rationale_290": "Paragraphs are indivisible, so a specification table extracted as one\r     block" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L290 | neighbors=[_atomic_blocks()]
- "function_app_document_structure_rationale_317": "`since` is the path already rendered earlier in the same chunk, so shared\r     a" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L317 | neighbors=[_render()]
- "function_app_document_structure_rationale_344": "`since` is the path already rendered earlier in the same chunk, so shared\r     a" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L344 | neighbors=[_render()]
- "function_app_document_structure_rationale_346": "Rendered once per chunk and fed to the embedding model. Without it the\r     vect" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L346 | neighbors=[metadata_header()]
- "function_app_document_structure_rationale_373": "Rendered once per chunk and fed to the embedding model. Without it the\r     vect" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L373 | neighbors=[metadata_header()]
- "function_app_document_structure_rationale_376": "Return one dict per chunk: `text` is what gets stored and shown to the\r     mode" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L376 | neighbors=[build_chunks()]
- "function_app_document_structure_rationale_405": "Return one dict per chunk: `text` is what gets stored and shown to the\r     mode" | kind=entity | source=azure-ai-backend/function-app/document_structure.py:L405 | neighbors=[build_chunks()]
- "function_app_function_app_rationale_1": "SmartBid AI backend — Azure Functions (Python v2 programming model).\r \r  Four HT" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L1 | neighbors=[function_app.py]
- "function_app_function_app_rationale_125": "Prefer extracted text (cheap). For scanned/image PDFs with no text,\r     return" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L125 | neighbors=[extract_text_or_images()]
- "function_app_function_app_rationale_152": "Guarantee plain text. If we only have page images (scanned document),\r     use g" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L152 | neighbors=[ensure_text()]
- "function_app_function_app_rationale_181": "Prefer extracted text (cheap). For scanned/image PDFs with no text,\r     return" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L181 | neighbors=[extract_text_or_images()]
- "function_app_function_app_rationale_220": "Guarantee plain text. If we only have page images (scanned document),\r     use g" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L220 | neighbors=[ensure_text()]
- "function_app_function_app_rationale_231": "Parse the model's JSON answer. A reasoning model can return an empty\r     messag" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L231 | neighbors=[_model_json()]
- "function_app_function_app_rationale_245": "Return (text, warnings), capping the length so a huge upload degrades\r     into" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L245 | neighbors=[_document_text()]
- "function_app_function_app_rationale_271": "Input vs output tokens — the two behave very differently: prefill is fast," | kind=entity | source=azure-ai-backend/function-app/function_app.py:L271 | neighbors=[_token_usage()]
- "function_app_function_app_rationale_283": "Return (body, file_name, file_bytes, system_prompt, document_text_override)." | kind=entity | source=azure-ai-backend/function-app/function_app.py:L283 | neighbors=[_parse_request()]
- "function_app_function_app_rationale_296": "BID metadata SmartBid sends with every request (see utils/aiContext.ts)." | kind=entity | source=azure-ai-backend/function-app/function_app.py:L296 | neighbors=[_context_lines()]
- "function_app_function_app_rationale_310": "Parse the model's JSON answer. A reasoning model can return an empty\r     messag" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L310 | neighbors=[_model_json()]
- "function_app_function_app_rationale_316": "Bias retrieval towards the BID's division/service line, so a datasheet from" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L316 | neighbors=[_retrieval_query()]
- "function_app_function_app_rationale_324": "Return (text, warnings), capping the length so a huge upload degrades\r     into" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L324 | neighbors=[_document_text()]
- "function_app_function_app_rationale_325": "Render one retrieved document with the catalogued metadata, followed by\r     eve" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L325 | neighbors=[_document_block()]
- "function_app_function_app_rationale_350": "Input vs output tokens — the two behave very differently: prefill is fast," | kind=entity | source=azure-ai-backend/function-app/function_app.py:L350 | neighbors=[_token_usage()]
- "function_app_function_app_rationale_361": "Hybrid (keyword + vector) retrieval. Retrieval is an enhancement, not a\r     har" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L361 | neighbors=[_reference_material()]
- "function_app_function_app_rationale_362": "Return (body, file_name, file_bytes, system_prompt, document_text_override)." | kind=entity | source=azure-ai-backend/function-app/function_app.py:L362 | neighbors=[_parse_request()]
- "function_app_function_app_rationale_375": "BID metadata SmartBid sends with every request (see utils/aiContext.ts)." | kind=entity | source=azure-ai-backend/function-app/function_app.py:L375 | neighbors=[_context_lines()]
- "function_app_function_app_rationale_395": "Bias retrieval towards the BID's division/service line, so a datasheet from" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L395 | neighbors=[_retrieval_query()]
- "function_app_function_app_rationale_404": "Render one retrieved document with the catalogued metadata, followed by\r     eve" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L404 | neighbors=[_document_block()]
- "function_app_function_app_rationale_417": "UPN of the authenticated caller, from the EasyAuth X-MS-CLIENT-PRINCIPAL\r     he" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L417 | neighbors=[_caller_upn()]
- "function_app_function_app_rationale_448": "A BID number safe to place inside an OData literal, or \"\"." | kind=entity | source=azure-ai-backend/function-app/function_app.py:L448 | neighbors=[_bid_ref()]
- "function_app_function_app_rationale_454": "Filter clause that keeps the BID being worked on out of its own precedents" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L454 | neighbors=[_not_this_bid()]
- "function_app_function_app_rationale_486": "Chunks grouped per source document, in ranking order, within the limits." | kind=entity | source=azure-ai-backend/function-app/function_app.py:L486 | neighbors=[_group_by_document()]
- "function_app_function_app_rationale_513": "Hybrid (keyword + vector) retrieval. Retrieval is an enhancement, not a\r     har" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L513 | neighbors=[_reference_material()]
- "function_app_function_app_rationale_554": "Completed BIDs whose scope resembles the client document. Unlike the\r     librar" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L554 | neighbors=[_past_bid_scope_material()]
- "function_app_function_app_rationale_581": "Clarif. & Qualif. library entries closest to the query. Every entry is its" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L581 | neighbors=[_clarification_library_material()]
- "function_app_function_app_rationale_593": "One hybrid search pass. Semantic ranking is billed per tier, so the caller" | kind=entity | source=azure-ai-backend/function-app/function_app.py:L593 | neighbors=[_chat_search()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-065.json

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
