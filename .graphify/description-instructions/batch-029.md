# Node Description Batch 30 of 43

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

- "bid_overviewtab_exchangeratescard": "ExchangeRatesCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L1997 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_inforow": "InfoRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L52 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_overviewtabprops": "OverviewTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L353 | neighbors=[OverviewTab.tsx]
- "bid_preparationmobilizationtab_blankconsumable": "blankConsumable()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L74 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_preparationmobilizationtab_blankmob": "blankMob()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L60 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_preparationmobilizationtab_blankrts": "blankRTS()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L45 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_preparationmobilizationtab_mob_types": "MOB_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L39 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_preparationmobilizationtab_preparationmobilizationtabprops": "PreparationMobilizationTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L15 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_preparationmobilizationtab_rts_types": "RTS_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L32 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_qualificationstab_qualificationstabprops": "QualificationsTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationsTab.tsx:L24 | neighbors=[QualificationsTab.tsx]
- "bid_revisionstab_revisionstabprops": "RevisionsTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L54 | neighbors=[RevisionsTab.tsx]
- "bid_scopeofsupplytab_blankitem": "blankItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L69 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_blanksection": "blankSection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L96 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_blanksubitem": "blankSubItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L119 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_editablecell": "EditableCell()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L4136 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_editablecellprops": "EditableCellProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L4126 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_scopeofsupplytabprops": "ScopeOfSupplyTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L25 | neighbors=[ScopeOfSupplyTab.tsx]
- "charts_charttooltip_charttooltipentry": "ChartTooltipEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/ChartTooltip.tsx:L4 | neighbors=[ChartTooltip.tsx]
- "charts_charttooltip_charttooltipprops": "ChartTooltipProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/ChartTooltip.tsx:L12 | neighbors=[ChartTooltip.tsx]
- "charts_heatmapgrid_heatmapcolumn": "HeatmapColumn" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/HeatmapGrid.tsx:L4 | neighbors=[HeatmapGrid.tsx]
- "charts_heatmapgrid_heatmapgridprops": "HeatmapGridProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/HeatmapGrid.tsx:L9 | neighbors=[HeatmapGrid.tsx]
- "charts_sparkline_sparklineprops": "SparklineProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/Sparkline.tsx:L4 | neighbors=[Sparkline.tsx]
- "common_advancedcatalogsearch_advancedcatalogsearchprops": "AdvancedCatalogSearchProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AdvancedCatalogSearch.tsx:L15 | neighbors=[AdvancedCatalogSearch.tsx]
- "common_advancedcatalogsearch_getphotourl": "getPhotoUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AdvancedCatalogSearch.tsx:L22 | neighbors=[AdvancedCatalogSearch.tsx]
- "common_advancedcatalogsearch_photothumb": "PhotoThumb()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AdvancedCatalogSearch.tsx:L442 | neighbors=[AdvancedCatalogSearch.tsx]
- "common_advancedcatalogsearch_tabkey": "TabKey" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AdvancedCatalogSearch.tsx:L20 | neighbors=[AdvancedCatalogSearch.tsx]
- "common_aidocumentanalyzer_accepted_types": "ACCEPTED_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIDocumentAnalyzer.tsx:L38 | neighbors=[AIDocumentAnalyzer.tsx]
- "common_aidocumentanalyzer_aidocumentanalyzerprops": "AIDocumentAnalyzerProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIDocumentAnalyzer.tsx:L17 | neighbors=[AIDocumentAnalyzer.tsx]
- "common_aidocumentanalyzer_analyzerstate": "AnalyzerState" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIDocumentAnalyzer.tsx:L36 | neighbors=[AIDocumentAnalyzer.tsx]
- "common_chatassistant_chatbubble": "ChatBubble()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ChatAssistant.tsx:L29 | neighbors=[ChatAssistant.tsx]
- "common_chatassistant_example_questions": "EXAMPLE_QUESTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ChatAssistant.tsx:L18 | neighbors=[ChatAssistant.tsx]
- "common_chatassistant_ibubbleprops": "IBubbleProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ChatAssistant.tsx:L24 | neighbors=[ChatAssistant.tsx]
- "common_collapsiblesidebar_icollapsiblesidebarprops": "ICollapsibleSidebarProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/CollapsibleSidebar.tsx:L4 | neighbors=[CollapsibleSidebar.tsx]
- "common_confirmdialog_confirmdialogprops": "ConfirmDialogProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ConfirmDialog.tsx:L4 | neighbors=[ConfirmDialog.tsx]
- "common_countdowntimer_countdowntimerprops": "CountdownTimerProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/CountdownTimer.tsx:L4 | neighbors=[CountdownTimer.tsx]
- "common_datatable_datatablecolumn": "DataTableColumn" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DataTable.tsx:L4 | neighbors=[DataTable.tsx]
- "common_datatable_datatableprops": "DataTableProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DataTable.tsx:L12 | neighbors=[DataTable.tsx]
- "common_divisionbadge_divisionbadgeprops": "DivisionBadgeProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DivisionBadge.tsx:L5 | neighbors=[DivisionBadge.tsx]
- "common_emptystate_emptystateprops": "EmptyStateProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EmptyState.tsx:L4 | neighbors=[EmptyState.tsx]
- "common_fileupload_fileuploadprops": "FileUploadProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/FileUpload.tsx:L4 | neighbors=[FileUpload.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-029.json

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
