# Node Description Batch 59 of 86

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

- "bidexcelexport_rows_isuppliersummary": "ISupplierSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L376 | neighbors=[rows.ts]
- "bidexcelexport_rows_supplierlevel": "SupplierLevel" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L354 | neighbors=[rows.ts]
- "bidexcelexport_runtime_logourl": "logoUrl" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/runtime.ts:L7 | neighbors=[runtime.ts]
- "charts_charttooltip_charttooltipentry": "ChartTooltipEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/ChartTooltip.tsx:L4 | neighbors=[ChartTooltip.tsx]
- "charts_charttooltip_charttooltipprops": "ChartTooltipProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/ChartTooltip.tsx:L12 | neighbors=[ChartTooltip.tsx]
- "charts_heatmapgrid_heatmapcolumn": "HeatmapColumn" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/HeatmapGrid.tsx:L4 | neighbors=[HeatmapGrid.tsx]
- "charts_heatmapgrid_heatmapgridprops": "HeatmapGridProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/HeatmapGrid.tsx:L9 | neighbors=[HeatmapGrid.tsx]
- "charts_sparkline_sparklineprops": "SparklineProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/Sparkline.tsx:L5 | neighbors=[Sparkline.tsx]
- "common_aianalyzermodal_aianalyzermodalprops": "AIAnalyzerModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIAnalyzerModal.tsx:L11 | neighbors=[AIAnalyzerModal.tsx]
- "common_aidocumentanalyzer_accepted_types": "ACCEPTED_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIDocumentAnalyzer.tsx:L102 | neighbors=[AIDocumentAnalyzer.tsx]
- "common_aidocumentanalyzer_analyzerstate": "AnalyzerState" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIDocumentAnalyzer.tsx:L36 | neighbors=[AIDocumentAnalyzer.tsx]
- "common_aidocumentanalyzer_instruction_presets": "INSTRUCTION_PRESETS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIDocumentAnalyzer.tsx:L75 | neighbors=[AIDocumentAnalyzer.tsx]
- "common_aidocumentanalyzer_steps": "STEPS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIDocumentAnalyzer.tsx:L72 | neighbors=[AIDocumentAnalyzer.tsx]
- "common_chatassistant_chatbubble": "ChatBubble()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ChatAssistant.tsx:L37 | neighbors=[ChatAssistant.tsx]
- "common_chatassistant_example_questions": "EXAMPLE_QUESTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ChatAssistant.tsx:L26 | neighbors=[ChatAssistant.tsx]
- "common_chatassistant_ibubbleprops": "IBubbleProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ChatAssistant.tsx:L32 | neighbors=[ChatAssistant.tsx]
- "common_collapsiblesidebar_icollapsiblesidebarprops": "ICollapsibleSidebarProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/CollapsibleSidebar.tsx:L4 | neighbors=[CollapsibleSidebar.tsx]
- "common_columnfilter_columnfilterprops": "ColumnFilterProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ColumnFilter.tsx:L16 | neighbors=[ColumnFilter.tsx]
- "common_columnfilter_panel_style": "PANEL_STYLE" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ColumnFilter.tsx:L25 | neighbors=[ColumnFilter.tsx]
- "common_confirmdialog_confirmdialogprops": "ConfirmDialogProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ConfirmDialog.tsx:L4 | neighbors=[ConfirmDialog.tsx]
- "common_countdowntimer_countdowntimerprops": "CountdownTimerProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/CountdownTimer.tsx:L5 | neighbors=[CountdownTimer.tsx]
- "common_datatable_datatablecolumn": "DataTableColumn" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DataTable.tsx:L4 | neighbors=[DataTable.tsx]
- "common_datatable_datatableprops": "DataTableProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DataTable.tsx:L12 | neighbors=[DataTable.tsx]
- "common_divisionbadge_divisionbadgeprops": "DivisionBadgeProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DivisionBadge.tsx:L5 | neighbors=[DivisionBadge.tsx]
- "common_editlockbanner_editactionbutton": "EditActionButton()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EditLockBanner.tsx:L35 | neighbors=[EditLockBanner.tsx]
- "common_editlockbanner_itabeditcontext": "ITabEditContext" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EditLockBanner.tsx:L101 | neighbors=[EditLockBanner.tsx]
- "common_emptystate_emptystateprops": "EmptyStateProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EmptyState.tsx:L4 | neighbors=[EmptyState.tsx]
- "common_fileupload_fileuploadprops": "FileUploadProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/FileUpload.tsx:L4 | neighbors=[FileUpload.tsx]
- "common_filterpanel_filterpanelprops": "FilterPanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/FilterPanel.tsx:L4 | neighbors=[FilterPanel.tsx]
- "common_glasscard_glasscardprops": "GlassCardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GlassCard.tsx:L4 | neighbors=[GlassCard.tsx]
- "common_guidedtour_computeplacement": "computePlacement()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L130 | neighbors=[GuidedTour.tsx]
- "common_guidedtour_guidedtourprops": "GuidedTourProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L35 | neighbors=[GuidedTour.tsx]
- "common_guidedtour_iballoonpos": "IBalloonPos" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L42 | neighbors=[GuidedTour.tsx]
- "common_guidedtour_iguidedtourlabels": "IGuidedTourLabels" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L26 | neighbors=[GuidedTour.tsx]
- "common_guidedtour_opposite": "OPPOSITE" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L54 | neighbors=[GuidedTour.tsx]
- "common_guidedtour_placement_class": "PLACEMENT_CLASS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L61 | neighbors=[GuidedTour.tsx]
- "common_guidedtour_samerect": "sameRect()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L120 | neighbors=[GuidedTour.tsx]
- "common_hoursimportpreview_hourscategory": "HoursCategory" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/HoursImportPreview.tsx:L13 | neighbors=[HoursImportPreview.tsx]
- "common_hoursimportpreview_hoursimportpreviewprops": "HoursImportPreviewProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/HoursImportPreview.tsx:L7 | neighbors=[HoursImportPreview.tsx]
- "common_hoursimportpreview_selectionstate": "SelectionState" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/HoursImportPreview.tsx:L15 | neighbors=[HoursImportPreview.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-058.json

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
