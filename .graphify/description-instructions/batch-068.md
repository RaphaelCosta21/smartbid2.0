# Node Description Batch 69 of 102

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

- "bid_qualificationgrouplist_qualificationgrouplistprops": "QualificationGroupListProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationGroupList.tsx:L23 | neighbors=[QualificationGroupList.tsx]
- "bid_qualificationstab_qualificationstabprops": "QualificationsTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationsTab.tsx:L41 | neighbors=[QualificationsTab.tsx]
- "bid_qualificationsuggestionsmodal_qualificationsuggestionsmodalprops": "QualificationSuggestionsModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationSuggestionsModal.tsx:L21 | neighbors=[QualificationSuggestionsModal.tsx]
- "bid_quotationcontrolpanel_filter_labels": "FILTER_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QuotationControlPanel.tsx:L59 | neighbors=[QuotationControlPanel.tsx]
- "bid_quotationcontrolpanel_icontrolrow": "IControlRow" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QuotationControlPanel.tsx:L31 | neighbors=[QuotationControlPanel.tsx]
- "bid_quotationcontrolpanel_needsquotation": "needsQuotation()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QuotationControlPanel.tsx:L69 | neighbors=[QuotationControlPanel.tsx]
- "bid_quotationcontrolpanel_quotationcontrolpanelprops": "QuotationControlPanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QuotationControlPanel.tsx:L74 | neighbors=[QuotationControlPanel.tsx]
- "bid_quotationcontrolpanel_status_rank": "STATUS_RANK" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QuotationControlPanel.tsx:L51 | neighbors=[QuotationControlPanel.tsx]
- "bid_quotationcontrolpanel_statusfilter": "StatusFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QuotationControlPanel.tsx:L29 | neighbors=[QuotationControlPanel.tsx]
- "bid_quotationcontrolpanel_statuskey": "StatusKey" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QuotationControlPanel.tsx:L28 | neighbors=[QuotationControlPanel.tsx]
- "bid_quotationstatuschip_quotationstatuschipprops": "QuotationStatusChipProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QuotationStatusChip.tsx:L11 | neighbors=[QuotationStatusChip.tsx]
- "bid_revisionstab_revisionstabprops": "RevisionsTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L55 | neighbors=[RevisionsTab.tsx]
- "bid_scopeofsupplytab_blankitem": "blankItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L150 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_blanksection": "blankSection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L177 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_blanksubitem": "blankSubItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L200 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_editablecell": "EditableCell()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L4841 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_editablecellprops": "EditableCellProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L4831 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_favoritekey": "favoriteKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L143 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_scopeofsupplytabprops": "ScopeOfSupplyTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L87 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_technicalproposalchip_state_class": "STATE_CLASS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/TechnicalProposalChip.tsx:L8 | neighbors=[TechnicalProposalChip.tsx]
- "bid_technicalproposalchip_technicalproposalchipprops": "TechnicalProposalChipProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/TechnicalProposalChip.tsx:L16 | neighbors=[TechnicalProposalChip.tsx]
- "bidexcelexport_context_ibidapprovalstate": "IBidApprovalState" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/context.ts:L70 | neighbors=[context.ts]
- "bidexcelexport_context_ibidexcelsheetdef": "IBidExcelSheetDef" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/context.ts:L7 | neighbors=[context.ts]
- "bidexcelexport_excelstyles_isxlcell": "isXlCell()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L243 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_ixlcell": "IXlCell" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L166 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_ixlkpi": "IXlKpi" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L223 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_ixlplacedvalue": "IXlPlacedValue" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L211 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_ixlrowopts": "IXlRowOpts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L199 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_ixlsheetinit": "IXlSheetInit" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L232 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_months": "MONTHS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L109 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_xlalign": "XlAlign" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L156 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_xlsheet_constructor": ".constructor()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L264 | neighbors=[XlSheet]
- "bidexcelexport_excelstyles_xlsheet_freeze": ".freeze()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L804 | neighbors=[XlSheet]
- "bidexcelexport_excelstyles_xlsheet_kpis": ".kpis()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L748 | neighbors=[XlSheet]
- "bidexcelexport_excelstyles_xlsheet_printtitles": ".printTitles()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L808 | neighbors=[XlSheet]
- "bidexcelexport_index_builders": "BUILDERS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/index.ts:L27 | neighbors=[index.ts]
- "bidexcelexport_rows_categorylabel": "categoryLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L38 | neighbors=[rows.ts]
- "bidexcelexport_rows_costentry": "CostEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L146 | neighbors=[rows.ts]
- "bidexcelexport_rows_findchild": "findChild()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L96 | neighbors=[rows.ts]
- "bidexcelexport_rows_iassetsummarygroup": "IAssetSummaryGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L137 | neighbors=[rows.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-068.json

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
