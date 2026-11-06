# Node Description Batch 27 of 102

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

- "bid_bidstatusdropdown": "BidStatusDropdown.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusDropdown.tsx:L1 | neighbors=[BidStatusDropdown(), BidStatusDropdownProps, 3a3d0a5 new changes, fe3728a smartbid2.0]
- "bid_bidtabheader_iheaderstat": "IHeaderStat" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L8 | neighbors=[BidCostSummary.tsx, BidTabHeader.tsx, LogisticsBreakdownTab.tsx, ScopeOfSupplyTab.tsx]
- "bid_equipmentimportmodal_equipmentimportmodal": "EquipmentImportModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L552 | neighbors=[EquipmentImportModal.tsx, toWords(), ScopeOfSupplyTab.tsx, AddFavoriteEquipmentModal.tsx]
- "bid_scopeofsupplytab_scopeofsupplytab": "ScopeOfSupplyTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L210 | neighbors=[ScopeOfSupplyTab.tsx, AIDocumentAnalyzer.tsx, BidDetailPage.tsx, TemplateEditor.tsx]
- "bidexcelexport_context_bid_excel_sheets": "BID_EXCEL_SHEETS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/context.ts:L15 | neighbors=[BidExportTab.tsx, context.ts, index.ts, infoSheet.ts]
- "bidexcelexport_excelstyles_displaydate": "displayDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L125 | neighbors=[excelStyles.ts, toExcelDate(), costSummarySheet.ts, infoSheet.ts]
- "bidexcelexport_excelstyles_xlsheet_estimateheight": ".estimateHeight()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L818 | neighbors=[XlSheet, .keyValue(), .note(), .noticeStrip()]
- "bidexcelexport_excelstyles_xlsheet_gap": ".gap()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L329 | neighbors=[XlSheet, .banner(), .noticeStrip(), .sectionTitle()]
- "bidexcelexport_excelstyles_xlsheet_sectiontitle": ".sectionTitle()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L446 | neighbors=[XlSheet, .font(), .gap(), .setValue()]
- "bidexcelexport_excelstyles_xlsheet_spanwidth": ".spanWidth()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L812 | neighbors=[XlSheet, .keyValue(), .note(), .noticeStrip()]
- "bidexcelexport_rows_buildassetsummary": "buildAssetSummary()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L313 | neighbors=[rows.ts, groupBySection(), scopeMapOf(), assetsSheet.ts]
- "bidexcelexport_rows_buildsupplierrows": "buildSupplierRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L385 | neighbors=[BidExportTab.tsx, rows.ts, scopeMapOf(), suppliersSheet.ts]
- "bidexcelexport_rows_fmtusd": "fmtUSD()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L28 | neighbors=[rows.ts, summarizeAsset(), assetsSheet.ts, currencyTable.ts]
- "bidexcelexport_rows_summarizeasset": "summarizeAsset()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L161 | neighbors=[rows.ts, fmtUSD(), maxLead(), unique()]
- "bidexcelexport_runtime_loadexceljs": "loadExcelJS()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/runtime.ts:L13 | neighbors=[index.ts, runtime.ts, bomExcelExport.ts, clarificationExcelExport.ts]
- "bidexcelexport_runtime_loadlogodataurl": "loadLogoDataUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/runtime.ts:L23 | neighbors=[index.ts, runtime.ts, bomExcelExport.ts, clarificationExcelExport.ts]
- "bidexcelexport_runtime_sanitizefilepart": "sanitizeFilePart()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/runtime.ts:L41 | neighbors=[index.ts, runtime.ts, bomExcelExport.ts, clarificationExcelExport.ts]
- "common_bidselect_buildbidoptions": "buildBidOptions()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/BidSelect.tsx:L17 | neighbors=[BidSelect.tsx, BidComparatorPage.tsx, BidRankingTab.tsx, ItemHistoryTab.tsx]
- "common_partnumberautocomplete_partnumberautocomplete": "PartNumberAutocomplete()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PartNumberAutocomplete.tsx:L96 | neighbors=[ScopeOfSupplyTab.tsx, PartNumberAutocomplete.tsx, AddFavoriteEquipmentModal.tsx, FavoritesPage.tsx]
- "common_partnumberautocomplete_partnumberdisplay": "PartNumberDisplay()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PartNumberAutocomplete.tsx:L48 | neighbors=[AssetsBreakdownTab.tsx, CostSearchModal.tsx, ScopeOfSupplyTab.tsx, PartNumberAutocomplete.tsx]
- "common_phasebadge_phasebadge": "PhaseBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PhaseBadge.tsx:L12 | neighbors=[BidActivityLog.tsx, PhaseBadge.tsx, BottleneckAnalysisPage.tsx, TimelinePage.tsx]
- "common_suggestioninput_suggestioninput": "SuggestionInput()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SuggestionInput.tsx:L22 | neighbors=[SuggestionInput.tsx, QualificationCategoryInput.tsx, QualificationEntryModal.tsx, QualificationTableModal.tsx]
- "common_timeline_timeline": "Timeline()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/Timeline.tsx:L18 | neighbors=[ApprovalTimeline.tsx, Timeline.tsx, BidDetailsReportPage.tsx, BidActivityLog.tsx]
- "data_mockapprovals": "mockApprovals.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockApprovals.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, mockApprovals, IApprovalFlow.ts, IApprovalFlow]
- "effects_effectutils_arcgizmo": "arcGizmo()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectUtils.ts:L130 | neighbors=[effectUtils.ts, glowMat(), rovEffects.ts, vesselEffects.ts]
- "effects_effectutils_linemat": "lineMat()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectUtils.ts:L38 | neighbors=[effectUtils.ts, rovEffects.ts, seabedEffects.ts, vesselEffects.ts]
- "favorites_addfavoriteequipmentmodal_addfavoriteequipmentmodal": "AddFavoriteEquipmentModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/favorites/AddFavoriteEquipmentModal.tsx:L115 | neighbors=[AddFavoriteEquipmentModal.tsx, destKey(), plural(), FavoritesPage.tsx]
- "function_app_document_structure_atomic_blocks": "_atomic_blocks()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L289 | neighbors=[document_structure.py, Paragraphs are indivisible, so a specif…, _split_body(), Paragraphs are indivisible, so a specif…]
- "function_app_document_structure_has_letters": "_has_letters()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L99 | neighbors=[document_structure.py, _is_boilerplate(), _is_title_case(), _is_upper()]
- "function_app_document_structure_is_upper": "_is_upper()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L103 | neighbors=[document_structure.py, _heading(), _has_letters(), _numbered_title()]
- "function_app_document_structure_metadata_header": "metadata_header()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L372 | neighbors=[document_structure.py, build_chunks(), Rendered once per chunk and fed to the …, Rendered once per chunk and fed to the …]
- "function_app_document_structure_render": "_render()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L343 | neighbors=[document_structure.py, build_chunks(), `since` is the path already rendered ea…, `since` is the path already rendered ea…]
- "function_app_document_structure_split_body": "_split_body()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L327 | neighbors=[document_structure.py, build_chunks(), _atomic_blocks(), _overlap_tail()]
- "function_app_document_structure_strip_boilerplate": "strip_boilerplate()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L166 | neighbors=[document_structure.py, build_chunks(), _is_boilerplate(), _normalize()]
- "function_app_function_app_bid_ref": "_bid_ref()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L447 | neighbors=[function_app.py, _not_this_bid(), _past_bid_refs(), A BID number safe to place inside an OD…]
- "function_app_function_app_chat_messages": "_chat_messages()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L994 | neighbors=[function_app.py, chat(), Normalize the conversation, keeping onl…, Normalize the conversation, keeping onl…]
- "function_app_function_app_chat_search": "_chat_search()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L846 | neighbors=[function_app.py, _chat_reference_material(), One hybrid search pass. Semantic rankin…, One hybrid search pass. Semantic rankin…]
- "function_app_function_app_ensure_text": "ensure_text()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L219 | neighbors=[function_app.py, _document_text(), Guarantee plain text. If we only have p…, Guarantee plain text. If we only have p…]
- "function_app_function_app_token_usage": "_token_usage()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L349 | neighbors=[function_app.py, generate_scope(), Input vs output tokens — the two behave…, Input vs output tokens — the two behave…]
- "hooks_useanalyticsfilters_datepreset": "DatePreset" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L9 | neighbors=[DashboardPeriodBar.tsx, useAnalyticsFilters.ts, useDashboardFilters.ts, AnalyticsFilterBar.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-026.json

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
