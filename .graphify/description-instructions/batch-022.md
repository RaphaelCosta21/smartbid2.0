# Node Description Batch 23 of 86

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

- "bidexcelexport_excelstyles_xlsheet_spanwidth": ".spanWidth()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L809 | neighbors=[XlSheet, .keyValue(), .note(), .noticeStrip()]
- "bidexcelexport_excelstyles_xlvalue": "XlValue" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L173 | neighbors=[excelStyles.ts, assetsSheet.ts, currencyTable.ts, prepMobSheet.ts]
- "bidexcelexport_rows_buildassetsummary": "buildAssetSummary()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L313 | neighbors=[rows.ts, groupBySection(), scopeMapOf(), assetsSheet.ts]
- "bidexcelexport_rows_buildsupplierrows": "buildSupplierRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L385 | neighbors=[BidExportTab.tsx, rows.ts, scopeMapOf(), suppliersSheet.ts]
- "bidexcelexport_rows_fmtusd": "fmtUSD()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L28 | neighbors=[rows.ts, summarizeAsset(), assetsSheet.ts, currencyTable.ts]
- "bidexcelexport_rows_summarizeasset": "summarizeAsset()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L161 | neighbors=[rows.ts, fmtUSD(), maxLead(), unique()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@0deadb72618f3dd960b429c4b26d2f1c03ef2413": "0deadb7 fix(survey): read catalog jsondata saved as rich text; provision column…" | kind=Commit | source=git | neighbors=[main, 67bbf62 feat(survey): apply Figma look …, SurveyCatalogService.ts, e2388c0 feat(survey): allow Knowledge e…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@27f41ab7ab8dcb78412a547c5d9f5d50fd4ef3bf": "27f41ab refactor: improve code formatting and readability in OverviewTab and ov…" | kind=Commit | source=git | neighbors=[OverviewTab.tsx, main, 8f7062d Remove outdated UI/UX design gu…, 9759c3b Refactor DivisionBadge and Memb…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@33536c2574cf85ebc1aff70dd461a9c4dfcc3fb8": "33536c2 feat(survey): 2.5D depth view of the Figma system scene (parallax camer…" | kind=Commit | source=git | neighbors=[main, 86dba8c feat(survey): restore three.js …, SurveySystemPage.tsx, d227784 feat(survey): Figma 2D system v…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@54594e6eb76688bf1169a053fc924d7868a5eaa3": "54594e6 style(survey): neutral silver for acoustic links instead of red" | kind=Commit | source=git | neighbors=[main, b07a797 feat(survey): toggle to hide co…, sceneTypes.ts, ee6b009 feat(survey): upload equipment …]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@8878a6bdb9cc8c4e99076b53d4d163373d93dca0": "8878a6b fix: Improve formatting in AIDocumentAnalyzer and ImportSourceList styl…" | kind=Commit | source=git | neighbors=[main, 2b1ed14 feat: add useApprovalSync hook …, AIDocumentAnalyzer.tsx, f03d3f6 feat: Enhance ImportSourceModal…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@8e88523d1d0b7b30489df22b312161d6f1fcbf1f": "8e88523 build: skip lint on gulp serve (bundle/package still lint)" | kind=Commit | source=git | neighbors=[50a29c7 feat(survey): Full Survey Sprea…, main, f510343 feat(survey): interactive sprea…, gulpfile.js]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@cce6a163d9e9331dbf118af8f2a09c08cd8f5ea5": "cce6a16 Refactor code structure for improved readability and maintainability" | kind=Commit | source=git | neighbors=[c6ce977 Add Azure AI Backend for SmartB…, feat/easi-modules-pages, main, fb4fa77 Refactor code structure for imp…]
- "common_partnumberautocomplete_partnumberautocomplete": "PartNumberAutocomplete()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PartNumberAutocomplete.tsx:L96 | neighbors=[ScopeOfSupplyTab.tsx, PartNumberAutocomplete.tsx, AddFavoriteEquipmentModal.tsx, FavoritesPage.tsx]
- "common_partnumberautocomplete_partnumberdisplay": "PartNumberDisplay()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PartNumberAutocomplete.tsx:L48 | neighbors=[AssetsBreakdownTab.tsx, CostSearchModal.tsx, ScopeOfSupplyTab.tsx, PartNumberAutocomplete.tsx]
- "common_phasebadge_phasebadge": "PhaseBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PhaseBadge.tsx:L12 | neighbors=[BidActivityLog.tsx, PhaseBadge.tsx, BottleneckAnalysisPage.tsx, TimelinePage.tsx]
- "common_progressbar_progressbar": "ProgressBar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ProgressBar.tsx:L13 | neighbors=[ProgressBar.tsx, BottleneckAnalysisPage.tsx, TeamAnalyticsPage.tsx, ToolingReportPage.tsx]
- "common_suggestioninput_suggestioninput": "SuggestionInput()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SuggestionInput.tsx:L22 | neighbors=[SuggestionInput.tsx, QualificationCategoryInput.tsx, QualificationEntryModal.tsx, QualificationTableModal.tsx]
- "common_timeline_timeline": "Timeline()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/Timeline.tsx:L18 | neighbors=[ApprovalTimeline.tsx, Timeline.tsx, BidDetailsReportPage.tsx, BidActivityLog.tsx]
- "config_prepmobilization_config": "prepMobilization.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/prepMobilization.config.ts:L1 | neighbors=[bc10d67 feat: add pastBidHelpers and pa…, MOB_TYPES, RTS_TYPES, index.ts]
- "data_mockapprovals": "mockApprovals.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockApprovals.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, mockApprovals, IApprovalFlow.ts, IApprovalFlow]
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
- "hooks_useanalyticsfilters_datepreset": "DatePreset" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L8 | neighbors=[DashboardPeriodBar.tsx, useAnalyticsFilters.ts, useDashboardFilters.ts, AnalyticsFilterBar.tsx]
- "hooks_useanalyticsfilters_presetrange": "presetRange()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L60 | neighbors=[useAnalyticsFilters.ts, isoDaysAgo(), todayStr(), useDashboardFilters.ts]
- "hooks_useapproothost": "useAppRootHost.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAppRootHost.ts:L1 | neighbors=[9582626 feat: add Access Log component …, GuidedTour.tsx, useAppRootHost(), HowItWorksDrawer.tsx]
- "hooks_usecolortheme_getactivecolortheme": "getActiveColorTheme()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useColorTheme.ts:L10 | neighbors=[excelStyles.ts, useChartTheme.ts, useColorTheme.ts, resolveSemanticColor()]
- "hooks_useconfigphases_useconfigphases": "useConfigPhases()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useConfigPhases.ts:L17 | neighbors=[BidPhaseProgress.tsx, OverviewTab.tsx, useConfigPhases.ts, BidDetailPage.tsx]
- "hooks_usekpis_usekpis": "useKPIs()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useKPIs.ts:L37 | neighbors=[useKPIs.ts, AnalyticsPage.tsx, DashboardPage.tsx, ReportsPage.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-022.json

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
