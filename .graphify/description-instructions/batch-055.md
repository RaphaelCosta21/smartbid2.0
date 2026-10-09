# Node Description Batch 56 of 86

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

- "bid_bidtabheader_sharebarprops": "ShareBarProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L190 | neighbors=[BidTabHeader.tsx]
- "bid_bidtaskchecklist_bidtaskchecklistprops": "BidTaskChecklistProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTaskChecklist.tsx:L5 | neighbors=[BidTaskChecklist.tsx]
- "bid_bidtemplateimport_bidtemplateimport": "BidTemplateImport()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTemplateImport.tsx:L12 | neighbors=[BidTemplateImport.tsx]
- "bid_bidtemplateimport_bidtemplateimportprops": "BidTemplateImportProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTemplateImport.tsx:L5 | neighbors=[BidTemplateImport.tsx]
- "bid_bidtimeline_bidtimelineprops": "BidTimelineProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTimeline.tsx:L65 | neighbors=[BidTimeline.tsx]
- "bid_bidtimeline_getphasetotalhours": "getPhaseTotalHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTimeline.tsx:L24 | neighbors=[BidTimeline.tsx]
- "bid_certificationsbreakdowntab_blankitem": "blankItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CertificationsBreakdownTab.tsx:L25 | neighbors=[CertificationsBreakdownTab.tsx]
- "bid_certificationsbreakdowntab_blanksection": "blankSection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CertificationsBreakdownTab.tsx:L44 | neighbors=[CertificationsBreakdownTab.tsx]
- "bid_certificationsbreakdowntab_certificationsbreakdowntabprops": "CertificationsBreakdownTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CertificationsBreakdownTab.tsx:L16 | neighbors=[CertificationsBreakdownTab.tsx]
- "bid_certificationsbreakdowntab_section_colors": "SECTION_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CertificationsBreakdownTab.tsx:L61 | neighbors=[CertificationsBreakdownTab.tsx]
- "bid_clarificationsuggestionsmodal_clarificationsuggestionsmodalprops": "ClarificationSuggestionsModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ClarificationSuggestionsModal.tsx:L11 | neighbors=[ClarificationSuggestionsModal.tsx]
- "bid_confidentialaccessmodal_confidentialaccessmodalprops": "ConfidentialAccessModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ConfidentialAccessModal.tsx:L16 | neighbors=[ConfidentialAccessModal.tsx]
- "bid_confidentialaccessmodal_iaccessgroup": "IAccessGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ConfidentialAccessModal.tsx:L32 | neighbors=[ConfidentialAccessModal.tsx]
- "bid_confidentialaccessmodal_iaccessrow": "IAccessRow" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ConfidentialAccessModal.tsx:L26 | neighbors=[ConfidentialAccessModal.tsx]
- "bid_confidentialaccessmodal_role_tags": "ROLE_TAGS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ConfidentialAccessModal.tsx:L40 | neighbors=[ConfidentialAccessModal.tsx]
- "bid_confidentialaccessmodal_topersonref": "toPersonRef()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ConfidentialAccessModal.tsx:L50 | neighbors=[ConfidentialAccessModal.tsx]
- "bid_confidentialaccessmodal_toselection": "toSelection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ConfidentialAccessModal.tsx:L57 | neighbors=[ConfidentialAccessModal.tsx]
- "bid_confidentiallock_confidentiallockprops": "ConfidentialLockProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ConfidentialLock.tsx:L9 | neighbors=[ConfidentialLock.tsx]
- "bid_costsearchmodal_costsearchmodalprops": "CostSearchModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CostSearchModal.tsx:L54 | neighbors=[CostSearchModal.tsx]
- "bid_costsearchmodal_datems": "dateMs()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CostSearchModal.tsx:L99 | neighbors=[CostSearchModal.tsx]
- "bid_costsearchmodal_isnocostentry": "isNoCostEntry()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CostSearchModal.tsx:L105 | neighbors=[CostSearchModal.tsx]
- "bid_costsearchmodal_rowpnkey": "rowPnKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CostSearchModal.tsx:L120 | neighbors=[CostSearchModal.tsx]
- "bid_costsearchmodal_searchrow": "SearchRow" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CostSearchModal.tsx:L63 | neighbors=[CostSearchModal.tsx]
- "bid_costsearchmodal_toquoteresult": "toQuoteResult()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CostSearchModal.tsx:L128 | neighbors=[CostSearchModal.tsx]
- "bid_documentstab_documentstabprops": "DocumentsTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/DocumentsTab.tsx:L27 | neighbors=[DocumentsTab.tsx]
- "bid_duedatechangemodal_duedatechangemodalprops": "DueDateChangeModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/DueDateChangeModal.tsx:L12 | neighbors=[DueDateChangeModal.tsx]
- "bid_duedatechangemodal_inputdatetoiso": "inputDateToIso()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/DueDateChangeModal.tsx:L26 | neighbors=[DueDateChangeModal.tsx]
- "bid_engineeringhourssection_edititemmodalstate": "EditItemModalState" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EngineeringHoursSection.tsx:L24 | neighbors=[EngineeringHoursSection.tsx]
- "bid_engineeringhourssection_engineeringhourssectionprops": "EngineeringHoursSectionProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EngineeringHoursSection.tsx:L15 | neighbors=[EngineeringHoursSection.tsx]
- "bid_engineeringhourssection_initial_modal": "INITIAL_MODAL" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EngineeringHoursSection.tsx:L43 | neighbors=[EngineeringHoursSection.tsx]
- "bid_equipmentimportmodal_empty_searches": "EMPTY_SEARCHES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L293 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_equipmentimportmodalprops": "EquipmentImportModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L44 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_equipmentimporttabid": "EquipmentImportTabId" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L69 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_escaperegexp": "escapeRegExp()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L326 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_formatcount": "formatCount()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L349 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_highlight": "highlight()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L330 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_iglobalhit": "IGlobalHit" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L355 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_iglobalsearchinput": "IGlobalSearchInput" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L374 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_iglobalsection": "IGlobalSection" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L361 | neighbors=[EquipmentImportModal.tsx]
- "bid_equipmentimportmodal_iimportsubitem": "IImportSubItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L32 | neighbors=[EquipmentImportModal.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-055.json

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
