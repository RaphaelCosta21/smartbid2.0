# Node Description Batch 23 of 102

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

- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@61c46c8f3042a75d60d085cd88fa90dc1dadb2a0": "61c46c8 fix(survey): offshore Brazil GGA sample with recomputed checksum" | kind=Commit | source=git | neighbors=[main, da217d4 feat(survey): physical-signal e…, surveyDataFormats.ts, surveyGlossary.ts, 90a8e89 fix(survey): correct data journ…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@c6da0c6132a2b4fdcf92f3c71991a4894726b9fa": "c6da0c6 Add node description batches 81 to 85 and create studio HTML file" | kind=Commit | source=git | neighbors=[8f7062d Remove outdated UI/UX design gu…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, e05a523 feat: Enhance notification card…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@e78354c06af22e3a9f944e13a10f1dc397fddc36": "e78354c feat: Update daily reminder flow to run only on weekdays at 9 AM Brasíl…" | kind=Commit | source=git | neighbors=[e05a523 feat: Enhance notification card…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, 9c0bb6f Add CSV file for indexer warnin…]
- "common_bidselect_bidselect": "BidSelect()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/BidSelect.tsx:L62 | neighbors=[BidSelect.tsx, useOutsideClose(), ComparatorSetup.tsx, BidRankingTab.tsx, ItemHistoryTab.tsx]
- "common_collapsiblesidebar_collapsiblesidebar": "CollapsibleSidebar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/CollapsibleSidebar.tsx:L23 | neighbors=[CollapsibleSidebar.tsx, BidDetailPage.tsx, FavoritesPage.tsx, QuotationsPage.tsx, SystemConfiguration.tsx]
- "common_photolightbox_photolightbox": "PhotoLightbox()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PhotoLightbox.tsx:L14 | neighbors=[EquipmentImportModal.tsx, PhotoLightbox.tsx, AddFavoriteEquipmentModal.tsx, FavoritesPage.tsx, QueryConsultingPage.tsx]
- "common_progressbar_progressbar": "ProgressBar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ProgressBar.tsx:L13 | neighbors=[ProgressBar.tsx, BottleneckAnalysisPage.tsx, TeamAnalyticsPage.tsx, ToolingReportPage.tsx, BidRankingTab.tsx]
- "common_richtexteditor": "RichTextEditor.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/RichTextEditor.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, RichTextEditor(), RichTextEditorProps, CreateRequestPage.tsx]
- "components_ismartbid20props": "ISmartBid20Props.ts" | kind=code-symbol | source=src/webparts/smartBid20/components/ISmartBid20Props.ts:L1 | neighbors=[3a3d0a5 new changes, fe3728a smartbid2.0, ISmartBid20Props, SmartBid20.tsx, SmartBid20WebPart.ts]
- "config_prepmobilization_config": "prepMobilization.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/prepMobilization.config.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, MOB_TYPES, RTS_TYPES, index.ts]
- "config_quotation_config": "quotation.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/quotation.config.ts:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, QUOTATION_LINK_STATUS_LABELS, QUOTATION_LINK_STATUS_ORDER, index.ts]
- "config_surveydataformats_deliverablevisual": "DeliverableVisual" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyDataFormats.ts:L49 | neighbors=[surveyDataFormats.ts, deliverableModels.ts, sceneTypes.ts, SurveyJourneyDeliverables.tsx, surveyDataJourney.ts]
- "config_surveyglossary_glossary_ui": "GLOSSARY_UI" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyGlossary.ts:L34 | neighbors=[surveyGlossary.ts, SurveySystemPage.tsx, GlossaryText.tsx, SurveyGlossary.tsx, SurveyNmeaLab.tsx]
- "dashboard_livefocusoverlay_focusbutton": "FocusButton()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/LiveFocusOverlay.tsx:L39 | neighbors=[ApprovalsPending.tsx, DashboardActivity.tsx, ErnWatchlist.tsx, LiveFocusOverlay.tsx, UpcomingDeadlines.tsx]
- "dashboard_livefocusoverlay_livefocusoverlay": "LiveFocusOverlay()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/LiveFocusOverlay.tsx:L81 | neighbors=[ApprovalsPending.tsx, DashboardActivity.tsx, ErnWatchlist.tsx, LiveFocusOverlay.tsx, UpcomingDeadlines.tsx]
- "dashboard_livefocusoverlay_usefocusmode": "useFocusMode()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/LiveFocusOverlay.tsx:L24 | neighbors=[ApprovalsPending.tsx, DashboardActivity.tsx, ErnWatchlist.tsx, LiveFocusOverlay.tsx, UpcomingDeadlines.tsx]
- "effects_effectutils_colors": "COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectUtils.ts:L3 | neighbors=[effectUtils.ts, rovEffects.ts, seabedEffects.ts, signalEffects.ts, vesselEffects.ts]
- "function_app_document_structure_has_word": "_has_word()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L111 | neighbors=[document_structure.py, _letter_count(), _heading(), Guards against all-caps noise such as t…, Guards against all-caps noise such as t…]
- "function_app_document_structure_normalize": "_normalize()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L137 | neighbors=[document_structure.py, _is_boilerplate(), Collapse whitespace and mask digits so …, strip_boilerplate(), Collapse whitespace and mask digits so …]
- "function_app_document_structure_numbered_title": "_numbered_title()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L125 | neighbors=[document_structure.py, _heading(), _is_upper(), A single-level number is indistinguisha…, A single-level number is indistinguisha…]
- "function_app_function_app_clarification_material": "_clarification_material()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L1132 | neighbors=[function_app.py, _group_by_document(), _hybrid_search(), _render_groups(), suggest_clarifications()]
- "function_app_function_app_context_lines": "_context_lines()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L374 | neighbors=[function_app.py, generate_scope(), BID metadata SmartBid sends with every …, suggest_clarifications(), BID metadata SmartBid sends with every …]
- "function_app_function_app_hybrid_search": "_hybrid_search()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L460 | neighbors=[function_app.py, _chat_past_bid_material(), _clarification_library_material(), _clarification_material(), _past_bid_scope_material()]
- "function_app_function_app_now_iso": "_now_iso()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L245 | neighbors=[function_app.py, chat(), extract_quotation(), generate_scope(), suggest_clarifications()]
- "function_app_function_app_parse_request": "_parse_request()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L359 | neighbors=[function_app.py, extract_quotation(), generate_scope(), Return (body, file_name, file_bytes, sy…, Return (body, file_name, file_bytes, sy…]
- "function_app_function_app_reference_material": "_reference_material()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L512 | neighbors=[function_app.py, generate_scope(), Hybrid (keyword + vector) retrieval. Re…, _document_block(), Hybrid (keyword + vector) retrieval. Re…]
- "function_app_function_app_retrieval_query": "_retrieval_query()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L394 | neighbors=[function_app.py, generate_scope(), Bias retrieval towards the BID's divisi…, suggest_clarifications(), Bias retrieval towards the BID's divisi…]
- "function_app_function_app_server_error": "_server_error()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L291 | neighbors=[function_app.py, chat(), extract_quotation(), generate_scope(), suggest_clarifications()]
- "gulpfile": "gulpfile.js" | kind=code-symbol | source=gulpfile.js:L1 | neighbors=[8e88523 build: skip lint on gulp serve …, dbdc03a systemconfig online, ddf6c96 Merge branch 'feat/survey-knowl…, fe3728a smartbid2.0, build]
- "hooks_usecharttheme_categoricalcolor": "categoricalColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useChartTheme.ts:L113 | neighbors=[DashboardFilterBar.tsx, ErnDashboardSection.tsx, useChartTheme.ts, buildCategorical(), PeriodPerformancePage.tsx]
- "hooks_useeditcontrol_useeditcontrol": "useEditControl()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useEditControl.ts:L29 | neighbors=[OverviewTab.tsx, QualificationsTab.tsx, useEditControl.ts, BidDetailPage.tsx, TemplateEditor.tsx]
- "hooks_usepastbidpublisher_usepastbidpublisher": "usePastBidPublisher()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/usePastBidPublisher.ts:L36 | neighbors=[usePastBidPublisher.ts, usePastBidScopeCategories(), BidDetailPage.tsx, FollowUpPage.tsx, PastBidsPage.tsx]
- "hooks_useresponsive": "useResponsive.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useResponsive.ts:L1 | neighbors=[fe3728a smartbid2.0, ChatAssistant.tsx, Breakpoints, useResponsive(), Header.tsx]
- "knowledge_clarificationbadges_clarificationtypebadge": "ClarificationTypeBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationBadges.tsx:L11 | neighbors=[ExportClarificationModal.tsx, ImportClarificationModal.tsx, ClarificationBadges.tsx, ClarificationEntryDrawer.tsx, ClarificationsDbPage.tsx]
- "knowledge_doclibrarycatalog_doclibrarycatalog": "DocLibraryCatalog()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L465 | neighbors=[DocLibraryCatalog.tsx, EMPTY_META(), DatasheetsPage.tsx, ManualsCatalogsPage.tsx, TechnicalProposalsPage.tsx]
- "knowledge_qualificationcategoryinput_qualificationcategoryinput": "QualificationCategoryInput()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationCategoryInput.tsx:L20 | neighbors=[QualificationsTab.tsx, ScopeOfSupplyTab.tsx, QualificationCategoryInput.tsx, QualificationEntryModal.tsx, QualificationTableModal.tsx]
- "knowledge_qualificationtablemodal_qualificationtablemodal": "QualificationTableModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L144 | neighbors=[QualificationLibraryView.tsx, QualificationTableModal.tsx, metaOf(), plural(), sameMeta()]
- "models_iaianalysis_iaisuggestedclarification": "IAISuggestedClarification" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L188 | neighbors=[AIDocumentAnalyzer.tsx, IAIAnalysis.ts, index.ts, AIAnalysisService.ts, aiClarificationMapper.ts]
- "models_iaichat_ichatmessage": "IChatMessage" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAiChat.ts:L36 | neighbors=[ChatAssistant.tsx, IAiChat.ts, index.ts, AIAnalysisService.ts, useChatStore.ts]
- "models_ibid_iapprovaloverride": "IApprovalOverride" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L703 | neighbors=[ApprovalOverrideBanner.tsx, ApprovalTab.tsx, IBid.ts, index.ts, ApprovalService.ts]

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
