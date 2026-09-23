# Node Description Batch 14 of 43

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

- "utils_ernhelpers_geternlinkforslot": "getErnLinkForSlot()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L74 | neighbors=[OverviewTab.tsx, ernHelpers.ts, getErnLinks(), ernLink.ts]
- "utils_exporthelpers_getexportfilename": "getExportFilename()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L76 | neighbors=[BidDetailPage.tsx, clarificationExport.ts, exportHelpers.ts, zeroPad()]
- "utils_formatters_formatfilesize": "formatFileSize()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L68 | neighbors=[DocumentsTab.tsx, AIDocumentAnalyzer.tsx, DocLibraryCatalog.tsx, formatters.ts]
- "utils_formatters_formatpercentage": "formatPercentage()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L60 | neighbors=[AnalyticsPage.tsx, PerformanceTrendsPage.tsx, ReportsPage.tsx, formatters.ts]
- "utils_pdfexport_captureelementtopng": "captureElementToPng()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L34 | neighbors=[BidDetailsReportPage.tsx, OperationalSummaryPage.tsx, PeriodPerformancePage.tsx, pdfExport.ts]
- "utils_phasehelpers_getphaseprogressbyindex": "getPhaseProgressByIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L37 | neighbors=[BidCard.tsx, BidTrackerPage.tsx, DashboardPage.tsx, phaseHelpers.ts]
- "utils_statushelpers_getstatusdef": "getStatusDef()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L6 | neighbors=[statusHelpers.ts, getStatusColor(), getStatusOrder(), isTerminalStatus()]
- "bid_addquotationmodal_blanklineitem": "blankLineItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L37 | neighbors=[AddQuotationModal.tsx, AddQuotationModal(), genId()]
- "bid_assetsbreakdowntab_assetsbreakdowntab": "AssetsBreakdownTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L183 | neighbors=[AssetsBreakdownTab.tsx, fmtCost(), BidDetailPage.tsx]
- "bid_bidcard_bidcard": "BidCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidCard.tsx:L20 | neighbors=[BidCard.tsx, BidTrackerPage.tsx, FavoritesPage.tsx]
- "bid_bidhourstable_bidhourstable": "BidHoursTable()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L56 | neighbors=[BidHoursTable.tsx, BidDetailPage.tsx, TemplateEditor.tsx]
- "bid_bidtimeline_bidtimeline": "BidTimeline()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTimeline.tsx:L70 | neighbors=[BidTimeline.tsx, useLiveElapsed(), BidDetailPage.tsx]
- "bid_clarificationsuggestionsmodal_clarificationsuggestionsmodal": "ClarificationSuggestionsModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ClarificationSuggestionsModal.tsx:L21 | neighbors=[ClarificationSuggestionsModal.tsx, QualificationsTab.tsx, BidDetailPage.tsx]
- "bid_erncreatemodal_erncreatemodal": "ErnCreateModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnCreateModal.tsx:L41 | neighbors=[ErnCreateModal.tsx, OverviewTab.tsx, UnassignedRequestsPage.tsx]
- "bid_revisionstab_getrevisionletter": "getRevisionLetter()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L18 | neighbors=[BidStatusPhasePanel.tsx, RevisionsTab.tsx, RevisionsTab()]
- "bid_revisionstab_hasactiverevision": "hasActiveRevision()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L35 | neighbors=[OverviewTab.tsx, RevisionsTab.tsx, BidDetailPage.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@cce6a163d9e9331dbf118af8f2a09c08cd8f5ea5": "cce6a16 Refactor code structure for improved readability and maintainability" | kind=Commit | source=git | neighbors=[c6ce977 Add Azure AI Backend for SmartB…, main, fb4fa77 Refactor code structure for imp…]
- "common_editlockbanner_edittoolbar": "EditToolbar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EditLockBanner.tsx:L29 | neighbors=[QualificationsTab.tsx, EditLockBanner.tsx, TemplateEditor.tsx]
- "common_importsourcemodal_importsourcemodal": "ImportSourceModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceModal.tsx:L29 | neighbors=[BidHoursTable.tsx, ScopeOfSupplyTab.tsx, ImportSourceModal.tsx]
- "common_integrateddivisiontabs_integrateddivisiontabs": "IntegratedDivisionTabs()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L63 | neighbors=[IntegratedDivisionTabs.tsx, resolveDivisions(), BidDetailPage.tsx]
- "common_integrateddivisiontabs_resolvedivisions": "resolveDivisions()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L55 | neighbors=[IntegratedDivisionTabs.tsx, IntegratedDivisionTabs(), BidDetailPage.tsx]
- "common_partnumberautocomplete_partnumberautocomplete": "PartNumberAutocomplete()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PartNumberAutocomplete.tsx:L60 | neighbors=[ScopeOfSupplyTab.tsx, PartNumberAutocomplete.tsx, FavoritesPage.tsx]
- "common_peoplepicker_ipickedperson": "IPickedPerson" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PeoplePicker.tsx:L10 | neighbors=[ErnCreateModal.tsx, PeoplePicker.tsx, IGraphResult]
- "common_phasebadge_phasebadge": "PhaseBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PhaseBadge.tsx:L12 | neighbors=[PhaseBadge.tsx, BottleneckAnalysisPage.tsx, TimelinePage.tsx]
- "common_skeletonloader_skeletonloader": "SkeletonLoader()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SkeletonLoader.tsx:L12 | neighbors=[SkeletonLoader.tsx, DashboardPage.tsx, TeamAnalyticsPage.tsx]
- "components_ismartbid20props_ismartbid20props": "ISmartBid20Props" | kind=code-symbol | source=src/webparts/smartBid20/components/ISmartBid20Props.ts:L3 | neighbors=[ISmartBid20Props.ts, SmartBid20.tsx, SmartBid20WebPart.ts]
- "components_smartbid20_smartbid20": "SmartBid20" | kind=code-symbol | source=src/webparts/smartBid20/components/SmartBid20.tsx:L8 | neighbors=[SmartBid20.tsx, .componentDidMount(), .render()]
- "config_defaultfavoritegroups_getdefaultfavoritegroups": "getDefaultFavoriteGroups()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/defaultFavoriteGroups.ts:L26 | neighbors=[defaultFavoriteGroups.ts, makeGroup(), defaultSystemConfig.ts]
- "config_defaultfavoritegroups_makegroup": "makeGroup()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/defaultFavoriteGroups.ts:L13 | neighbors=[defaultFavoriteGroups.ts, getDefaultFavoriteGroups(), nextId()]
- "config_phases_config_getphaseconfig": "getPhaseConfig()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L277 | neighbors=[phases.config.ts, getPhaseLabel(), getPhaseTasks()]
- "data_mocknotifications": "mockNotifications.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockNotifications.ts:L1 | neighbors=[fe3728a smartbid2.0, MOCK_NOTIFICATIONS, index.ts]
- "data_mocktemplates": "mockTemplates.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockTemplates.ts:L1 | neighbors=[fe3728a smartbid2.0, IBidTemplate, MOCK_TEMPLATES]
- "function_app_document_structure_atomic_blocks": "_atomic_blocks()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L262 | neighbors=[document_structure.py, Paragraphs are indivisible, so a specif…, _split_body()]
- "function_app_document_structure_is_title_case": "_is_title_case()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L111 | neighbors=[document_structure.py, _heading(), _has_letters()]
- "function_app_document_structure_letter_count": "_letter_count()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L101 | neighbors=[document_structure.py, _has_word(), _heading()]
- "function_app_document_structure_metadata_header": "metadata_header()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L345 | neighbors=[document_structure.py, build_chunks(), Rendered once per chunk and fed to the …]
- "function_app_document_structure_render": "_render()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L316 | neighbors=[document_structure.py, build_chunks(), `since` is the path already rendered ea…]
- "function_app_function_app_bad_request": "_bad_request()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L192 | neighbors=[function_app.py, extract_quotation(), generate_scope()]
- "function_app_function_app_chat_messages": "_chat_messages()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L675 | neighbors=[function_app.py, chat(), Normalize the conversation, keeping onl…]
- "function_app_function_app_chat_search": "_chat_search()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L592 | neighbors=[function_app.py, _chat_reference_material(), One hybrid search pass. Semantic rankin…]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-013.json

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
