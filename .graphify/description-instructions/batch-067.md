# Node Description Batch 68 of 102

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

- "bid_equipmentimportmodal_sectionbase": "SectionBase" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L385 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_sourcetabid": "SourceTabId" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L77 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_tab_by_id": "TAB_BY_ID" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L282 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_tabdef": "TabDef" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L81 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_tabid": "TabId" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L76 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_tabs": "TABS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L273 | neighbors=[EquipmentImportModal.tsx]
- "bid_erncreatemodal_erncreatemodalprops": "ErnCreateModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnCreateModal.tsx:L30 | neighbors=[ErnCreateModal.tsx]
- "bid_erncreatemodal_persontopicked": "personToPicked()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnCreateModal.tsx:L46 | neighbors=[ErnCreateModal.tsx]
- "bid_erncreatemodal_toinputdate": "toInputDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnCreateModal.tsx:L39 | neighbors=[ErnCreateModal.tsx]
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
- "bid_linkedquotationspanel_linkedquotationspanelprops": "LinkedQuotationsPanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/LinkedQuotationsPanel.tsx:L47 | neighbors=[LinkedQuotationsPanel.tsx]
- "bid_logisticsbreakdowntab_blankitem": "blankItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/LogisticsBreakdownTab.tsx:L29 | neighbors=[LogisticsBreakdownTab.tsx]
- "bid_logisticsbreakdowntab_logisticsbreakdowntabprops": "LogisticsBreakdownTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/LogisticsBreakdownTab.tsx:L22 | neighbors=[LogisticsBreakdownTab.tsx]
- "bid_notestab_notestabprops": "NotesTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/NotesTab.tsx:L10 | neighbors=[NotesTab.tsx]
- "bid_overviewtab_analysisnotescard": "AnalysisNotesCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L2539 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_approval_status_display": "APPROVAL_STATUS_DISPLAY" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L138 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_approvalstatuscard": "ApprovalStatusCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L184 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_capexopexverticalchart": "CapexOpexVerticalChart()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L2833 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_editinput": "EditInput()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L113 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_exchangeratescard": "ExchangeRatesCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L2295 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_inforow": "InfoRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L102 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_overviewtabprops": "OverviewTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L569 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_pm_business_lines": "PM_BUSINESS_LINES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L100 | neighbors=[OverviewTab.tsx]
- "bid_preparationmobilizationtab_blankconsumable": "blankConsumable()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L74 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_preparationmobilizationtab_blankmob": "blankMob()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L60 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_preparationmobilizationtab_blankrts": "blankRTS()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L45 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_preparationmobilizationtab_mob_types": "MOB_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L39 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_preparationmobilizationtab_preparationmobilizationtabprops": "PreparationMobilizationTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L27 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_preparationmobilizationtab_rts_types": "RTS_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L32 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_qualificationgrouplist_iqualificationpickrow": "IQualificationPickRow" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationGroupList.tsx:L5 | neighbors=[QualificationGroupList.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-067.json

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
