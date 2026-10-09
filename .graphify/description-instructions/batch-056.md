# Node Description Batch 57 of 86

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

- "bid_equipmentimportmodal_query_sources": "QUERY_SOURCES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L263 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_query_views": "QUERY_VIEWS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L267 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_querysubtabkey": "QuerySubTabKey" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L79 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_querytabkey": "QueryTabKey" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L78 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_quotetime": "quoteTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L345 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_search_placeholders": "SEARCH_PLACEHOLDERS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L302 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_sectionbase": "SectionBase" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L385 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_sourcetabid": "SourceTabId" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L77 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_tab_by_id": "TAB_BY_ID" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L282 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_tabdef": "TabDef" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L81 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_tabid": "TabId" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L76 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_tabs": "TABS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L273 | neighbors=[EquipmentImportModal.tsx]
- "bid_erncreatemodal_erncreatemodalprops": "ErnCreateModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnCreateModal.tsx:L26 | neighbors=[ErnCreateModal.tsx]
- "bid_erncreatemodal_persontopicked": "personToPicked()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnCreateModal.tsx:L42 | neighbors=[ErnCreateModal.tsx]
- "bid_erncreatemodal_toinputdate": "toInputDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnCreateModal.tsx:L35 | neighbors=[ErnCreateModal.tsx]
- "bid_erndetailsmodal_erndetailsmodalprops": "ErnDetailsModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnDetailsModal.tsx:L12 | neighbors=[ErnDetailsModal.tsx]
- "bid_erndetailsmodal_row": "Row()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnDetailsModal.tsx:L126 | neighbors=[ErnDetailsModal.tsx]
- "bid_erndetailsmodal_statecolor": "stateColor" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnDetailsModal.tsx:L18 | neighbors=[ErnDetailsModal.tsx]
- "bid_ernsearchmodal_ernnum": "ernNum()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnSearchModal.tsx:L27 | neighbors=[ErnSearchModal.tsx]
- "bid_ernsearchmodal_ernsearchmodalprops": "ErnSearchModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnSearchModal.tsx:L16 | neighbors=[ErnSearchModal.tsx]
- "bid_exportclarificationmodal_exportclarificationmodalprops": "ExportClarificationModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ExportClarificationModal.tsx:L24 | neighbors=[ExportClarificationModal.tsx]
- "bid_exportclarificationmodal_exportmode": "ExportMode" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ExportClarificationModal.tsx:L13 | neighbors=[ExportClarificationModal.tsx]
- "bid_exportclarificationmodal_typefilter": "TypeFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ExportClarificationModal.tsx:L31 | neighbors=[ExportClarificationModal.tsx]
- "bid_importclarificationmodal_importclarificationmodalprops": "ImportClarificationModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ImportClarificationModal.tsx:L19 | neighbors=[ImportClarificationModal.tsx]
- "bid_importclarificationmodal_toclarificationitem": "toClarificationItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ImportClarificationModal.tsx:L31 | neighbors=[ImportClarificationModal.tsx]
- "bid_importqualificationmodal_importqualificationmodalprops": "ImportQualificationModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ImportQualificationModal.tsx:L23 | neighbors=[ImportQualificationModal.tsx]
- "bid_logisticsbreakdowntab_blankitem": "blankItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/LogisticsBreakdownTab.tsx:L29 | neighbors=[LogisticsBreakdownTab.tsx]
- "bid_logisticsbreakdowntab_logisticsbreakdowntabprops": "LogisticsBreakdownTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/LogisticsBreakdownTab.tsx:L22 | neighbors=[LogisticsBreakdownTab.tsx]
- "bid_notestab_notestabprops": "NotesTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/NotesTab.tsx:L10 | neighbors=[NotesTab.tsx]
- "bid_overviewtab_analysisnotescard": "AnalysisNotesCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L2253 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_approval_status_display": "APPROVAL_STATUS_DISPLAY" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L116 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_approvalstatuscard": "ApprovalStatusCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L162 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_capexopexverticalchart": "CapexOpexVerticalChart()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L2547 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_editinput": "EditInput()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L91 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_exchangeratescard": "ExchangeRatesCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L2009 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_inforow": "InfoRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L80 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_overviewtabprops": "OverviewTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L474 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_pm_business_lines": "PM_BUSINESS_LINES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L78 | neighbors=[OverviewTab.tsx]
- "bid_preparationmobilizationtab_blankconsumable": "blankConsumable()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L74 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_preparationmobilizationtab_blankmob": "blankMob()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L60 | neighbors=[PreparationMobilizationTab.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-056.json

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
