# Node Description Batch 19 of 86

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
LANGUAGE: each entry has a `lang=` marker giving the language of its source.
Write that entry's description in EXACTLY that language. Do not translate to
a single common language — match each node's source language individually.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "utils_bidhelpers_isoverduebid": "isOverdueBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L78 | neighbors=[BidTrackerPage.tsx, DashboardPage.tsx, MyDashboardPage.tsx, bidHelpers.ts, getDueFreezeDate(), isActiveBid()] | lang=en
- "utils_bomparser_parsebomexcel": "parseBomExcel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L211 | neighbors=[BomCostsPage.tsx, bomParser.ts, assignParentIds(), cleanCsvValue(), emptyItem(), findColumns()] | lang=en
- "utils_clarificationhelpers_allcategoryoptions": "allCategoryOptions()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L48 | neighbors=[ExportClarificationModal.tsx, useClarificationLibraryFilter.ts, ClarificationBadges.tsx, clarificationExcelExport.ts, clarificationHelpers.ts, clarificationLibraryDocument.ts] | lang=en
- "utils_clarificationhelpers_cleanclientdocref": "cleanClientDocRef()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L22 | neighbors=[ExportClarificationModal.tsx, ClarificationEntryDrawer.tsx, ClarificationsDbPage.tsx, clarificationExcelExport.ts, clarificationHelpers.ts, clarificationLibraryDocument.ts] | lang=en
- "utils_ernhelpers_geterndeadlinestate": "getErnDeadlineState()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L180 | neighbors=[ErnDetailsModal.tsx, OverviewTab.tsx, ernHelpers.ts, isErnClosed(), isErnOnHold(), ErnDashboardSection.tsx] | lang=en
- "utils_exporthelpers_downloadcsv": "downloadCSV()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L79 | neighbors=[BidDetailsReportPage.tsx, PeriodPerformancePage.tsx, exportHelpers.ts, downloadBlob(), BidDetailPage.tsx, OperationalSummaryPage.tsx] | lang=en
- "utils_formatters_formatnumber": "formatNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L27 | neighbors=[CertificationsBreakdownTab.tsx, ScopeOfSupplyTab.tsx, PastBidCard.tsx, BidDetailsReportPage.tsx, exportHelpers.ts, formatters.ts] | lang=en
- "utils_pastbiddocument_classification": "classification()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L243 | neighbors=[pastBidDocument.ts, heading(), lines(), mergeUnique(), record(), scopeLines()] | lang=en
- "utils_pastbiddocument_mergeunique": "mergeUnique()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L122 | neighbors=[PastBidProfileModal.tsx, PastBidKnowledgeService.ts, pastBidDocument.ts, classification(), derivePastBidTags(), pastBidHelpers.ts] | lang=en
- "utils_qualificationhelpers_findmanualqualificationtablekey": "findManualQualificationTableKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L229 | neighbors=[QualificationLibraryView.tsx, QualificationTableModal.tsx, qualificationHelpers.ts, isManualQualificationTableKey(), qualificationLibraryTableKey(), qualificationTableKey()] | lang=en
- "utils_qualificationhelpers_normalizequalificationtables": "normalizeQualificationTables()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L62 | neighbors=[QualificationsTab.tsx, ScopeOfSupplyTab.tsx, BidDetailPage.tsx, pastBidDocument.ts, qualificationHelpers.ts, buildQualificationLibraryRowsFromBid()] | lang=en
- "utils_qualificationhelpers_qualificationlibrarytablekey": "qualificationLibraryTableKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L194 | neighbors=[ImportQualificationModal.tsx, QualificationEntryDrawer.tsx, QualificationLibraryView.tsx, qualificationHelpers.ts, findManualQualificationTableKey(), qualificationTableKey()] | lang=en
- "utils_qualificationhelpers_qualificationtablekey": "qualificationTableKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L24 | neighbors=[QualificationSuggestionsModal.tsx, QualificationLibraryView.tsx, qualificationHelpers.ts, findManualQualificationTableKey(), findQualificationTable(), qualificationLibraryTableKey()] | lang=en
- "utils_scopehelpers_isplaceholderpartnumber": "isPlaceholderPartNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/scopeHelpers.ts:L55 | neighbors=[AssetsBreakdownTab.tsx, CostSearchModal.tsx, ScopeOfSupplyTab.tsx, PartNumberAutocomplete.tsx, scopeHelpers.ts, searchablePartNumber()] | lang=en
- "utils_suppliermatching_normalizesuppliername": "normalizeSupplierName()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L69 | neighbors=[SuppliersRegistry.tsx, useSupplierStore.ts, supplierMatching.ts, findSupplierMatch(), supplierTokens(), supplierProfile.ts] | lang=en
- "approval_approvaldecisionpanel": "ApprovalDecisionPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalDecisionPanel.tsx:L1 | neighbors=[ApprovalDecisionPanel(), ApprovalDecisionPanelProps, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…] | lang=en
- "bid_addquotationmodal_addquotationmodal": "AddQuotationModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L79 | neighbors=[AddQuotationModal.tsx, blankLineItem(), AssetsBreakdownTab.tsx, CostSearchModal.tsx, QuotationsPage.tsx] | lang=en
- "bid_emptysection_emptysection": "EmptySection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EmptySection.tsx:L4 | neighbors=[DocumentsTab.tsx, EmptySection.tsx, NotesTab.tsx, OverviewTab.tsx, QualificationsTab.tsx] | lang=en
- "bidexcelexport_excelstyles_ixlcolumn": "IXlColumn" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L155 | neighbors=[excelStyles.ts, IXlColumnDef, IXlRange, costSummarySheet.ts, infoSheet.ts] | lang=en
- "bidexcelexport_excelstyles_ixlcolumndef": "IXlColumnDef" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L176 | neighbors=[excelStyles.ts, IXlColumn, currencyTable.ts, hoursSheet.ts, prepMobSheet.ts] | lang=en
- "bidexcelexport_excelstyles_ixlrange": "IXlRange" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L215 | neighbors=[excelStyles.ts, IXlColumn, assetsSheet.ts, hoursSheet.ts, suppliersSheet.ts] | lang=en
- "bidexcelexport_excelstyles_thin": "thin()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L249 | neighbors=[excelStyles.ts, .band(), .keyValue(), .noticeStrip(), .total()] | lang=en
- "bidexcelexport_excelstyles_xlsheet_total": ".total()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L617 | neighbors=[XlSheet, thin(), .fillRange(), .font(), .setValue()] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@0a8206d84c6500c4d898d0add632f2a99c0cb6f1": "0a8206d feat(survey): 3D navigation - Space+drag/right-drag pan, WASD/arrows gl…" | kind=Commit | source=git | neighbors=[main, 9b2fddd feat(survey): diagram rooms (ma…, createSurveyScene.ts, SurveySystemScene.tsx, d9e6783 feat(survey): clean 3D overview…] | lang=pt
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@4c720fd7c5486530129ee0985f9d15fd03e8a755": "4c720fd style(survey): IMR-style procedural vessel (forecastle, white accommoda…" | kind=Commit | source=git | neighbors=[main, 8267c28 i18n: translate EASI, suppliers…, createSurveyScene.ts, SurveySpreadPanel.tsx, b07a797 feat(survey): toggle to hide co…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@7112c8a2a743192108a691f4fcd6e22f8bbd62b5": "7112c8a fix: Improve text formatting in FavoritesPage and UnassignedRequestsPag…" | kind=Commit | source=git | neighbors=[5577aab feat: Add Technical Proposal fu…, main, bec8260 feat: Enhance bid management wi…, FavoritesPage.tsx, UnassignedRequestsPage.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@b5184abfa6889dd20cb5cf6f96252f65bb602ee1": "b5184ab fix: Improve formatting and readability in BidExportTab and BidStatusPh…" | kind=Commit | source=git | neighbors=[24595c5 feat: Enhance Bid Export functi…, BidExportTab.tsx, BidStatusPhasePanel.tsx, main, 5577aab feat: Add Technical Proposal fu…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@d3810c7a555d2076ffb52f3de6dfe13484dd6344": "d3810c7 style: format SCSS and TS code for improved readability" | kind=Commit | source=git | neighbors=[583d03e Refactor string concatenation i…, BidActivityLog.tsx, main, adc0d38 Refactor TemplatesPage: Enhance…, activityLogHelpers.ts] | lang=en
- "common_collapsiblesidebar_collapsiblesidebar": "CollapsibleSidebar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/CollapsibleSidebar.tsx:L23 | neighbors=[CollapsibleSidebar.tsx, BidDetailPage.tsx, FavoritesPage.tsx, QuotationsPage.tsx, SystemConfiguration.tsx] | lang=en
- "common_photolightbox_photolightbox": "PhotoLightbox()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PhotoLightbox.tsx:L14 | neighbors=[EquipmentImportModal.tsx, PhotoLightbox.tsx, AddFavoriteEquipmentModal.tsx, FavoritesPage.tsx, QueryConsultingPage.tsx] | lang=en
- "common_richtexteditor": "RichTextEditor.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/RichTextEditor.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, RichTextEditor(), RichTextEditorProps, CreateRequestPage.tsx] | lang=en
- "components_ismartbid20props": "ISmartBid20Props.ts" | kind=code-symbol | source=src/webparts/smartBid20/components/ISmartBid20Props.ts:L1 | neighbors=[3a3d0a5 new changes, fe3728a smartbid2.0, ISmartBid20Props, SmartBid20.tsx, SmartBid20WebPart.ts] | lang=en
- "config_suppliers_config": "suppliers.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/suppliers.config.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 414e1a6 style: Improve code formatting …, buildDefaultSupplierServiceTypes(), SERVICE_TYPE_SEED, index.ts] | lang=en
- "dashboard_livefocusoverlay_focusbutton": "FocusButton()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/LiveFocusOverlay.tsx:L39 | neighbors=[ApprovalsPending.tsx, DashboardActivity.tsx, ErnWatchlist.tsx, LiveFocusOverlay.tsx, UpcomingDeadlines.tsx] | lang=en
- "dashboard_livefocusoverlay_livefocusoverlay": "LiveFocusOverlay()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/LiveFocusOverlay.tsx:L81 | neighbors=[ApprovalsPending.tsx, DashboardActivity.tsx, ErnWatchlist.tsx, LiveFocusOverlay.tsx, UpcomingDeadlines.tsx] | lang=en
- "dashboard_livefocusoverlay_usefocusmode": "useFocusMode()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/LiveFocusOverlay.tsx:L24 | neighbors=[ApprovalsPending.tsx, DashboardActivity.tsx, ErnWatchlist.tsx, LiveFocusOverlay.tsx, UpcomingDeadlines.tsx] | lang=en
- "function_app_document_structure_has_word": "_has_word()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L111 | neighbors=[document_structure.py, _letter_count(), _heading(), Guards against all-caps noise such as t…, Guards against all-caps noise such as t…] | lang=en
- "function_app_document_structure_normalize": "_normalize()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L137 | neighbors=[document_structure.py, _is_boilerplate(), Collapse whitespace and mask digits so …, strip_boilerplate(), Collapse whitespace and mask digits so …] | lang=en
- "function_app_document_structure_numbered_title": "_numbered_title()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L125 | neighbors=[document_structure.py, _heading(), _is_upper(), A single-level number is indistinguisha…, A single-level number is indistinguisha…] | lang=en
- "function_app_function_app_clarification_material": "_clarification_material()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L1132 | neighbors=[function_app.py, _group_by_document(), _hybrid_search(), _render_groups(), suggest_clarifications()] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-018.json

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
