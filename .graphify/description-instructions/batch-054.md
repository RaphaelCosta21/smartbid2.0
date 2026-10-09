# Node Description Batch 55 of 86

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

- "bid_bidactivitylog_getactivitycolor": "getActivityColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L37 | neighbors=[BidActivityLog.tsx]
- "bid_bidactivitylog_getinitials": "getInitials()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L96 | neighbors=[BidActivityLog.tsx]
- "bid_bidactivitylog_transition": "Transition()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L104 | neighbors=[BidActivityLog.tsx]
- "bid_bidapprovalpanel_bidapprovalpanel": "BidApprovalPanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidApprovalPanel.tsx:L13 | neighbors=[BidApprovalPanel.tsx]
- "bid_bidapprovalpanel_bidapprovalpanelprops": "BidApprovalPanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidApprovalPanel.tsx:L7 | neighbors=[BidApprovalPanel.tsx]
- "bid_bidcard_bidcardprops": "BidCardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidCard.tsx:L16 | neighbors=[BidCard.tsx]
- "bid_bidcomments_bidcommentsprops": "BidCommentsProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidComments.tsx:L7 | neighbors=[BidComments.tsx]
- "bid_bidconfidentialbutton_bidconfidentialbuttonprops": "BidConfidentialButtonProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidConfidentialButton.tsx:L20 | neighbors=[BidConfidentialButton.tsx]
- "bid_bidconfidentialbutton_names": "names()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidConfidentialButton.tsx:L27 | neighbors=[BidConfidentialButton.tsx]
- "bid_bidcostsummary_bidcostsummaryprops": "BidCostSummaryProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidCostSummary.tsx:L14 | neighbors=[BidCostSummary.tsx]
- "bid_bidequipmenttable_bidequipmenttable": "BidEquipmentTable()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidEquipmentTable.tsx:L13 | neighbors=[BidEquipmentTable.tsx]
- "bid_bidequipmenttable_bidequipmenttableprops": "BidEquipmentTableProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidEquipmentTable.tsx:L6 | neighbors=[BidEquipmentTable.tsx]
- "bid_bidexporttab_bidexporttabprops": "BidExportTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidExportTab.tsx:L53 | neighbors=[BidExportTab.tsx]
- "bid_bidexporttab_icheck": "ICheck" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidExportTab.tsx:L83 | neighbors=[BidExportTab.tsx]
- "bid_bidexporttab_sheet_accents": "SHEET_ACCENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidExportTab.tsx:L71 | neighbors=[BidExportTab.tsx]
- "bid_bidexporttab_sheet_icons": "SHEET_ICONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidExportTab.tsx:L59 | neighbors=[BidExportTab.tsx]
- "bid_bidfavoritebutton_bidfavoritebuttonprops": "BidFavoriteButtonProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidFavoriteButton.tsx:L10 | neighbors=[BidFavoriteButton.tsx]
- "bid_bidfxnote_bidfxnoteprops": "BidFxNoteProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidFxNote.tsx:L8 | neighbors=[BidFxNote.tsx]
- "bid_bidfxnote_usdamountcellprops": "UsdAmountCellProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidFxNote.tsx:L16 | neighbors=[BidFxNote.tsx]
- "bid_bidhourstable_bidhourstableprops": "BidHoursTableProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L27 | neighbors=[BidHoursTable.tsx]
- "bid_bidhourstable_blankhoursitem": "blankHoursItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L47 | neighbors=[BidHoursTable.tsx]
- "bid_bidhourstable_colorpickerinline": "ColorPickerInline()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L1681 | neighbors=[BidHoursTable.tsx]
- "bid_bidhourstable_hours_columns": "HOURS_COLUMNS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L69 | neighbors=[BidHoursTable.tsx]
- "bid_bidhourstable_hoursrow": "HoursRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L1304 | neighbors=[BidHoursTable.tsx]
- "bid_bidhourstable_hoursrowprops": "HoursRowProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L1274 | neighbors=[BidHoursTable.tsx]
- "bid_bidhourstable_sectionkey": "SectionKey" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L67 | neighbors=[BidHoursTable.tsx]
- "bid_bidphaseprogress_bidphaseprogress": "BidPhaseProgress()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidPhaseProgress.tsx:L9 | neighbors=[BidPhaseProgress.tsx]
- "bid_bidphaseprogress_bidphaseprogressprops": "BidPhaseProgressProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidPhaseProgress.tsx:L5 | neighbors=[BidPhaseProgress.tsx]
- "bid_bidstatusdropdown_bidstatusdropdown": "BidStatusDropdown()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusDropdown.tsx:L11 | neighbors=[BidStatusDropdown.tsx]
- "bid_bidstatusdropdown_bidstatusdropdownprops": "BidStatusDropdownProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusDropdown.tsx:L5 | neighbors=[BidStatusDropdown.tsx]
- "bid_bidstatusphasepanel_assetcostsblockdialogprops": "AssetCostsBlockDialogProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusPhasePanel.tsx:L35 | neighbors=[BidStatusPhasePanel.tsx]
- "bid_bidstatusphasepanel_bidstatusphasepanelprops": "BidStatusPhasePanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusPhasePanel.tsx:L81 | neighbors=[BidStatusPhasePanel.tsx]
- "bid_bidstatusphasepanel_terminalstatussection": "TerminalStatusSection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusPhasePanel.tsx:L1723 | neighbors=[BidStatusPhasePanel.tsx]
- "bid_bidtabheader_bidtabheaderprops": "BidTabHeaderProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L21 | neighbors=[BidTabHeader.tsx]
- "bid_bidtabheader_chip_tones": "CHIP_TONES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L292 | neighbors=[BidTabHeader.tsx]
- "bid_bidtabheader_collapsedheaders": "collapsedHeaders" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L38 | neighbors=[BidTabHeader.tsx]
- "bid_bidtabheader_formatpct": "formatPct()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L206 | neighbors=[BidTabHeader.tsx]
- "bid_bidtabheader_headerchipprops": "HeaderChipProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L281 | neighbors=[BidTabHeader.tsx]
- "bid_bidtabheader_iheaderhero": "IHeaderHero" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L15 | neighbors=[BidTabHeader.tsx]
- "bid_bidtabheader_seg_classes": "SEG_CLASSES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L198 | neighbors=[BidTabHeader.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-054.json

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
