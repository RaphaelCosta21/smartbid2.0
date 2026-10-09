# Node Description Batch 37 of 86

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

- "bid_importclarificationmodal_importclarificationmodal": "ImportClarificationModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ImportClarificationModal.tsx:L45 | neighbors=[ImportClarificationModal.tsx, QualificationsTab.tsx]
- "bid_importqualificationmodal_importqualificationmodal": "ImportQualificationModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ImportQualificationModal.tsx:L36 | neighbors=[ImportQualificationModal.tsx, QualificationsTab.tsx]
- "bid_logisticsbreakdowntab_logisticsbreakdowntab": "LogisticsBreakdownTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/LogisticsBreakdownTab.tsx:L41 | neighbors=[LogisticsBreakdownTab.tsx, BidDetailPage.tsx]
- "bid_notestab_notestab": "NotesTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/NotesTab.tsx:L19 | neighbors=[NotesTab.tsx, BidDetailPage.tsx]
- "bid_overviewtab_overviewtab": "OverviewTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L482 | neighbors=[OverviewTab.tsx, BidDetailPage.tsx]
- "bid_preparationmobilizationtab_preparationmobilizationtab": "PreparationMobilizationTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L91 | neighbors=[PreparationMobilizationTab.tsx, BidDetailPage.tsx]
- "bid_qualificationstab_qualificationstab": "QualificationsTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationsTab.tsx:L48 | neighbors=[QualificationsTab.tsx, BidDetailPage.tsx]
- "bid_qualificationsuggestionsmodal_qualificationsuggestionsmodal": "QualificationSuggestionsModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationSuggestionsModal.tsx:L31 | neighbors=[QualificationsTab.tsx, QualificationSuggestionsModal.tsx]
- "bid_revisionstab_canstartrevision": "canStartRevision()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L24 | neighbors=[RevisionsTab.tsx, RevisionsTab()]
- "bidexcelexport_context_sheetname": "sheetName()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/context.ts:L65 | neighbors=[context.ts, newSheet()]
- "bidexcelexport_excelstyles_clean": "clean()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L147 | neighbors=[excelStyles.ts, .setValue()]
- "bidexcelexport_excelstyles_currencyfmt": "currencyFmt()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L79 | neighbors=[excelStyles.ts, currencyTable.ts]
- "bidexcelexport_excelstyles_solid": "solid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L141 | neighbors=[excelStyles.ts, .band()]
- "bidexcelexport_excelstyles_tint": "tint()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L130 | neighbors=[excelStyles.ts, .band()]
- "bidexcelexport_excelstyles_toexceldatetime": "toExcelDateTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L102 | neighbors=[excelStyles.ts, infoSheet.ts]
- "bidexcelexport_excelstyles_xl_tab_colors": "XL_TAB_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L46 | neighbors=[context.ts, excelStyles.ts]
- "bidexcelexport_excelstyles_xlsheet_datarow": ".dataRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L498 | neighbors=[XlSheet, .rangeRow()]
- "bidexcelexport_excelstyles_xlsheet_header": ".header()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L473 | neighbors=[XlSheet, .rangeHeader()]
- "bidexcelexport_excelstyles_xlsheet_placelogo": ".placeLogo()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L409 | neighbors=[XlSheet, .banner()]
- "bidexcelexport_excelstyles_xlsheet_rangeheader": ".rangeHeader()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L548 | neighbors=[XlSheet, .header()]
- "bidexcelexport_excelstyles_xlsheet_rangerow": ".rangeRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L564 | neighbors=[XlSheet, .dataRow()]
- "bidexcelexport_rows_iassetsummaryrow": "IAssetSummaryRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L109 | neighbors=[rows.ts, assetsSheet.ts]
- "bidexcelexport_rows_maxlead": "maxLead()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L51 | neighbors=[rows.ts, summarizeAsset()]
- "bidexcelexport_rows_unique": "unique()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L42 | neighbors=[rows.ts, summarizeAsset()]
- "charts_heatmapgrid_heatcolor": "heatColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/HeatmapGrid.tsx:L36 | neighbors=[HeatmapGrid.tsx, hexToRgb()]
- "charts_heatmapgrid_heatmapgrid": "HeatmapGrid()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/HeatmapGrid.tsx:L49 | neighbors=[HeatmapGrid.tsx, BottleneckAnalysisPage.tsx]
- "charts_heatmapgrid_hextorgb": "hexToRgb()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/HeatmapGrid.tsx:L23 | neighbors=[HeatmapGrid.tsx, heatColor()]
- "common_aidocumentanalyzer_aidocumentanalyzerprops": "AIDocumentAnalyzerProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIDocumentAnalyzer.tsx:L49 | neighbors=[AIAnalyzerModal.tsx, AIDocumentAnalyzer.tsx]
- "common_aidocumentanalyzer_analyzerstage": "AnalyzerStage" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIDocumentAnalyzer.tsx:L47 | neighbors=[AIAnalyzerModal.tsx, AIDocumentAnalyzer.tsx]
- "common_aidocumentanalyzer_formatelapsed": "formatElapsed()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIDocumentAnalyzer.tsx:L96 | neighbors=[AIDocumentAnalyzer.tsx, AIDocumentAnalyzer()]
- "common_chatassistant_chatassistant": "ChatAssistant()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ChatAssistant.tsx:L162 | neighbors=[ChatAssistant.tsx, AppLayout.tsx]
- "common_columnfilter_columnfilter": "ColumnFilter()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ColumnFilter.tsx:L27 | neighbors=[ColumnFilter.tsx, DashboardBidTable.tsx]
- "common_countdowntimer_countdowntimer": "CountdownTimer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/CountdownTimer.tsx:L12 | neighbors=[CountdownTimer.tsx, TimelinePage.tsx]
- "common_editlockbanner_editabletabcontent": "EditableTabContent()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EditLockBanner.tsx:L138 | neighbors=[EditLockBanner.tsx, BidDetailPage.tsx]
- "common_editlockbanner_editcontrols": "EditControls()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EditLockBanner.tsx:L109 | neighbors=[BidTabHeader.tsx, EditLockBanner.tsx]
- "common_editlockbanner_editlockbanner": "EditLockBanner()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EditLockBanner.tsx:L12 | neighbors=[OverviewTab.tsx, EditLockBanner.tsx]
- "common_editlockbanner_tabeditcontext": "TabEditContext" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EditLockBanner.tsx:L107 | neighbors=[BidTabHeader.tsx, EditLockBanner.tsx]
- "common_fileupload_fileupload": "FileUpload()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/FileUpload.tsx:L12 | neighbors=[FileUpload.tsx, CreateRequestPage.tsx]
- "common_filterpanel_filterpanel": "FilterPanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/FilterPanel.tsx:L11 | neighbors=[FilterPanel.tsx, BidTrackerPage.tsx]
- "common_guidedtour_findtarget": "findTarget()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L69 | neighbors=[GuidedTour.tsx, isRendered()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-036.json

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
