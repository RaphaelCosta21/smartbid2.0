# Node Description Batch 29 of 43

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

- "bid_bidtaskchecklist_bidtaskchecklistprops": "BidTaskChecklistProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTaskChecklist.tsx:L5 | neighbors=[BidTaskChecklist.tsx]
- "bid_bidtemplateimport_bidtemplateimport": "BidTemplateImport()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTemplateImport.tsx:L12 | neighbors=[BidTemplateImport.tsx]
- "bid_bidtemplateimport_bidtemplateimportprops": "BidTemplateImportProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTemplateImport.tsx:L5 | neighbors=[BidTemplateImport.tsx]
- "bid_bidtimeline_bidtimelineprops": "BidTimelineProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTimeline.tsx:L65 | neighbors=[BidTimeline.tsx]
- "bid_bidtimeline_getphasetotalhours": "getPhaseTotalHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTimeline.tsx:L24 | neighbors=[BidTimeline.tsx]
- "bid_certificationsbreakdowntab_blankitem": "blankItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CertificationsBreakdownTab.tsx:L17 | neighbors=[CertificationsBreakdownTab.tsx]
- "bid_certificationsbreakdowntab_blanksection": "blankSection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CertificationsBreakdownTab.tsx:L36 | neighbors=[CertificationsBreakdownTab.tsx]
- "bid_certificationsbreakdowntab_certificationsbreakdowntabprops": "CertificationsBreakdownTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CertificationsBreakdownTab.tsx:L9 | neighbors=[CertificationsBreakdownTab.tsx]
- "bid_certificationsbreakdowntab_section_colors": "SECTION_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CertificationsBreakdownTab.tsx:L53 | neighbors=[CertificationsBreakdownTab.tsx]
- "bid_clarificationsuggestionsmodal_clarificationsuggestionsmodalprops": "ClarificationSuggestionsModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ClarificationSuggestionsModal.tsx:L13 | neighbors=[ClarificationSuggestionsModal.tsx]
- "bid_costsearchmodal_costsearchmodalprops": "CostSearchModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CostSearchModal.tsx:L42 | neighbors=[CostSearchModal.tsx]
- "bid_costsearchmodal_searchrow": "SearchRow" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CostSearchModal.tsx:L51 | neighbors=[CostSearchModal.tsx]
- "bid_documentstab_documentstabprops": "DocumentsTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/DocumentsTab.tsx:L12 | neighbors=[DocumentsTab.tsx]
- "bid_engineeringhourssection_edititemmodalstate": "EditItemModalState" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EngineeringHoursSection.tsx:L24 | neighbors=[EngineeringHoursSection.tsx]
- "bid_engineeringhourssection_engineeringhourssectionprops": "EngineeringHoursSectionProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EngineeringHoursSection.tsx:L15 | neighbors=[EngineeringHoursSection.tsx]
- "bid_engineeringhourssection_initial_modal": "INITIAL_MODAL" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EngineeringHoursSection.tsx:L43 | neighbors=[EngineeringHoursSection.tsx]
- "bid_equipmentimportmodal_equipmentimportmodalprops": "EquipmentImportModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L37 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_iimportsubitem": "IImportSubItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L25 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_tabdef": "TabDef" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L55 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_tabid": "TabId" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L53 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_tabs": "TABS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L170 | neighbors=[EquipmentImportModal.tsx]
- "bid_erncreatemodal_erncreatemodalprops": "ErnCreateModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnCreateModal.tsx:L22 | neighbors=[ErnCreateModal.tsx]
- "bid_erncreatemodal_persontopicked": "personToPicked()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnCreateModal.tsx:L38 | neighbors=[ErnCreateModal.tsx]
- "bid_erncreatemodal_toinputdate": "toInputDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnCreateModal.tsx:L31 | neighbors=[ErnCreateModal.tsx]
- "bid_erndetailsmodal_erndetailsmodalprops": "ErnDetailsModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnDetailsModal.tsx:L12 | neighbors=[ErnDetailsModal.tsx]
- "bid_erndetailsmodal_row": "Row()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnDetailsModal.tsx:L117 | neighbors=[ErnDetailsModal.tsx]
- "bid_erndetailsmodal_statecolor": "stateColor" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnDetailsModal.tsx:L18 | neighbors=[ErnDetailsModal.tsx]
- "bid_ernsearchmodal_ernnum": "ernNum()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnSearchModal.tsx:L27 | neighbors=[ErnSearchModal.tsx]
- "bid_ernsearchmodal_ernsearchmodalprops": "ErnSearchModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnSearchModal.tsx:L16 | neighbors=[ErnSearchModal.tsx]
- "bid_exportclarificationmodal_exportclarificationmodalprops": "ExportClarificationModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ExportClarificationModal.tsx:L6 | neighbors=[ExportClarificationModal.tsx]
- "bid_exportclarificationmodal_exportmode": "ExportMode" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ExportClarificationModal.tsx:L13 | neighbors=[ExportClarificationModal.tsx]
- "bid_importclarificationmodal_importclarificationmodalprops": "ImportClarificationModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ImportClarificationModal.tsx:L9 | neighbors=[ImportClarificationModal.tsx]
- "bid_importclarificationmodal_toclarificationitem": "toClarificationItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ImportClarificationModal.tsx:L15 | neighbors=[ImportClarificationModal.tsx]
- "bid_logisticsbreakdowntab_blankitem": "blankItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/LogisticsBreakdownTab.tsx:L13 | neighbors=[LogisticsBreakdownTab.tsx]
- "bid_logisticsbreakdowntab_logisticsbreakdowntabprops": "LogisticsBreakdownTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/LogisticsBreakdownTab.tsx:L7 | neighbors=[LogisticsBreakdownTab.tsx]
- "bid_notestab_notestabprops": "NotesTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/NotesTab.tsx:L10 | neighbors=[NotesTab.tsx]
- "bid_overviewtab_analysisnotescard": "AnalysisNotesCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L2237 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_approval_status_display": "APPROVAL_STATUS_DISPLAY" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L64 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_approvalstatuscard": "ApprovalStatusCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L95 | neighbors=[OverviewTab.tsx]
- "bid_overviewtab_capexopexverticalchart": "CapexOpexVerticalChart()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/OverviewTab.tsx:L2531 | neighbors=[OverviewTab.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-028.json

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
