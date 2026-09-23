# Node Description Batch 28 of 43

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

- "bid_addquotationmodal_addquotationmodalprops": "AddQuotationModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L55 | neighbors=[AddQuotationModal.tsx]
- "bid_addquotationmodal_iquotationlinedraft": "IQuotationLineDraft" | kind=code-symbol | neighbors=[ILineItem]
- "bid_aitab_aitabprops": "AITabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AITab.tsx:L7 | neighbors=[AITab.tsx]
- "bid_approvaltab_approvaltabprops": "ApprovalTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ApprovalTab.tsx:L18 | neighbors=[ApprovalTab.tsx]
- "bid_approvaltab_matchesdivision": "matchesDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ApprovalTab.tsx:L45 | neighbors=[ApprovalTab.tsx]
- "bid_approvaltab_sector_configs": "SECTOR_CONFIGS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ApprovalTab.tsx:L70 | neighbors=[ApprovalTab.tsx]
- "bid_approvaltab_sectorconfig": "SectorConfig" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ApprovalTab.tsx:L31 | neighbors=[ApprovalTab.tsx]
- "bid_approvaltab_status_display": "STATUS_DISPLAY" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ApprovalTab.tsx:L178 | neighbors=[ApprovalTab.tsx]
- "bid_assetsbreakdowntab_assetsbreakdowntabprops": "AssetsBreakdownTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L19 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_blankasset": "blankAsset()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L34 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_blanksubcost": "blankSubCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L59 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_blanksubitemcost": "blankSubItemCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L81 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_blanktransitsubcost": "blankTransitSubCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L68 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_costrefbadgeclass": "costRefBadgeClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L173 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_dateageclass": "dateAgeClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L125 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_formatdateref": "formatDateRef()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L103 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_isquerysource": "isQuerySource()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L164 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_query_sources": "QUERY_SOURCES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L138 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_bidactivitylog_bidactivitylogprops": "BidActivityLogProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L7 | neighbors=[BidActivityLog.tsx]
- "bid_bidactivitylog_getactivitycolor": "getActivityColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L37 | neighbors=[BidActivityLog.tsx]
- "bid_bidapprovalpanel_bidapprovalpanel": "BidApprovalPanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidApprovalPanel.tsx:L13 | neighbors=[BidApprovalPanel.tsx]
- "bid_bidapprovalpanel_bidapprovalpanelprops": "BidApprovalPanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidApprovalPanel.tsx:L7 | neighbors=[BidApprovalPanel.tsx]
- "bid_bidcard_bidcardprops": "BidCardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidCard.tsx:L13 | neighbors=[BidCard.tsx]
- "bid_bidcomments_bidcommentsprops": "BidCommentsProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidComments.tsx:L7 | neighbors=[BidComments.tsx]
- "bid_bidcostsummary_bidcostsummaryprops": "BidCostSummaryProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidCostSummary.tsx:L16 | neighbors=[BidCostSummary.tsx]
- "bid_bidequipmenttable_bidequipmenttable": "BidEquipmentTable()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidEquipmentTable.tsx:L13 | neighbors=[BidEquipmentTable.tsx]
- "bid_bidequipmenttable_bidequipmenttableprops": "BidEquipmentTableProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidEquipmentTable.tsx:L6 | neighbors=[BidEquipmentTable.tsx]
- "bid_bidexportbutton_bidexportbuttonprops": "BidExportButtonProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidExportButton.tsx:L4 | neighbors=[BidExportButton.tsx]
- "bid_bidhourstable_bidhourstableprops": "BidHoursTableProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L18 | neighbors=[BidHoursTable.tsx]
- "bid_bidhourstable_blankhoursitem": "blankHoursItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L34 | neighbors=[BidHoursTable.tsx]
- "bid_bidhourstable_colorpickerinline": "ColorPickerInline()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L1584 | neighbors=[BidHoursTable.tsx]
- "bid_bidhourstable_hoursrow": "HoursRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L1209 | neighbors=[BidHoursTable.tsx]
- "bid_bidhourstable_hoursrowprops": "HoursRowProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L1179 | neighbors=[BidHoursTable.tsx]
- "bid_bidhourstable_sectionkey": "SectionKey" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L54 | neighbors=[BidHoursTable.tsx]
- "bid_bidphaseprogress_bidphaseprogress": "BidPhaseProgress()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidPhaseProgress.tsx:L9 | neighbors=[BidPhaseProgress.tsx]
- "bid_bidphaseprogress_bidphaseprogressprops": "BidPhaseProgressProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidPhaseProgress.tsx:L5 | neighbors=[BidPhaseProgress.tsx]
- "bid_bidstatusdropdown_bidstatusdropdown": "BidStatusDropdown()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusDropdown.tsx:L11 | neighbors=[BidStatusDropdown.tsx]
- "bid_bidstatusdropdown_bidstatusdropdownprops": "BidStatusDropdownProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusDropdown.tsx:L5 | neighbors=[BidStatusDropdown.tsx]
- "bid_bidstatusphasepanel_bidstatusphasepanelprops": "BidStatusPhasePanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusPhasePanel.tsx:L33 | neighbors=[BidStatusPhasePanel.tsx]
- "bid_bidstatusphasepanel_terminalstatussection": "TerminalStatusSection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusPhasePanel.tsx:L1634 | neighbors=[BidStatusPhasePanel.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-027.json

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
