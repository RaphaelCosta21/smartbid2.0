# Node Description Batch 58 of 86

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

- "bid_preparationmobilizationtab_blankrts": "blankRTS()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L45 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_preparationmobilizationtab_mob_types": "MOB_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L39 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_preparationmobilizationtab_preparationmobilizationtabprops": "PreparationMobilizationTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L27 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_preparationmobilizationtab_rts_types": "RTS_TYPES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/PreparationMobilizationTab.tsx:L32 | neighbors=[PreparationMobilizationTab.tsx]
- "bid_qualificationgrouplist_iqualificationpickrow": "IQualificationPickRow" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationGroupList.tsx:L5 | neighbors=[QualificationGroupList.tsx]
- "bid_qualificationgrouplist_qualificationgrouplistprops": "QualificationGroupListProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationGroupList.tsx:L23 | neighbors=[QualificationGroupList.tsx]
- "bid_qualificationstab_qualificationstabprops": "QualificationsTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationsTab.tsx:L41 | neighbors=[QualificationsTab.tsx]
- "bid_qualificationsuggestionsmodal_qualificationsuggestionsmodalprops": "QualificationSuggestionsModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationSuggestionsModal.tsx:L21 | neighbors=[QualificationSuggestionsModal.tsx]
- "bid_revisionstab_revisionstabprops": "RevisionsTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L55 | neighbors=[RevisionsTab.tsx]
- "bid_scopeofsupplytab_blankitem": "blankItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L149 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_blanksection": "blankSection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L176 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_blanksubitem": "blankSubItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L199 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_editablecell": "EditableCell()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L4835 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_editablecellprops": "EditableCellProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L4825 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_favoritekey": "favoriteKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L142 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_scopeofsupplytab_scopeofsupplytabprops": "ScopeOfSupplyTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ScopeOfSupplyTab.tsx:L86 | neighbors=[ScopeOfSupplyTab.tsx]
- "bid_technicalproposalchip_state_class": "STATE_CLASS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/TechnicalProposalChip.tsx:L8 | neighbors=[TechnicalProposalChip.tsx]
- "bid_technicalproposalchip_technicalproposalchipprops": "TechnicalProposalChipProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/TechnicalProposalChip.tsx:L16 | neighbors=[TechnicalProposalChip.tsx]
- "bidexcelexport_context_ibidapprovalstate": "IBidApprovalState" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/context.ts:L70 | neighbors=[context.ts]
- "bidexcelexport_context_ibidexcelsheetdef": "IBidExcelSheetDef" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/context.ts:L7 | neighbors=[context.ts]
- "bidexcelexport_excelstyles_isxlcell": "isXlCell()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L240 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_ixlcell": "IXlCell" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L163 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_ixlkpi": "IXlKpi" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L220 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_ixlplacedvalue": "IXlPlacedValue" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L208 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_ixlrowopts": "IXlRowOpts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L196 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_ixlsheetinit": "IXlSheetInit" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L229 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_months": "MONTHS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L106 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_xlalign": "XlAlign" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L153 | neighbors=[excelStyles.ts]
- "bidexcelexport_excelstyles_xlsheet_constructor": ".constructor()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L261 | neighbors=[XlSheet]
- "bidexcelexport_excelstyles_xlsheet_freeze": ".freeze()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L801 | neighbors=[XlSheet]
- "bidexcelexport_excelstyles_xlsheet_kpis": ".kpis()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L745 | neighbors=[XlSheet]
- "bidexcelexport_excelstyles_xlsheet_printtitles": ".printTitles()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L805 | neighbors=[XlSheet]
- "bidexcelexport_index_builders": "BUILDERS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/index.ts:L27 | neighbors=[index.ts]
- "bidexcelexport_rows_categorylabel": "categoryLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L38 | neighbors=[rows.ts]
- "bidexcelexport_rows_costentry": "CostEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L146 | neighbors=[rows.ts]
- "bidexcelexport_rows_findchild": "findChild()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L96 | neighbors=[rows.ts]
- "bidexcelexport_rows_iassetsummarygroup": "IAssetSummaryGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L137 | neighbors=[rows.ts]
- "bidexcelexport_rows_iscopegroup": "IScopeGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L56 | neighbors=[rows.ts]
- "bidexcelexport_rows_isprocured": "isProcured()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L154 | neighbors=[rows.ts]
- "bidexcelexport_rows_isupplierrow": "ISupplierRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L356 | neighbors=[rows.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-057.json

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
