# Node Description Batch 65 of 102

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

- "approval_approvalrequestcard_approvalrequestcardprops": "ApprovalRequestCardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalRequestCard.tsx:L5 | neighbors=[ApprovalRequestCard.tsx]
- "approval_approvaltimeline_approvaltimeline": "ApprovalTimeline()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalTimeline.tsx:L11 | neighbors=[ApprovalTimeline.tsx]
- "approval_approvaltimeline_approvaltimelineprops": "ApprovalTimelineProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalTimeline.tsx:L6 | neighbors=[ApprovalTimeline.tsx]
- "bid_addquotationmodal_addquotationmodalprops": "AddQuotationModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L69 | neighbors=[AddQuotationModal.tsx]
- "bid_addquotationmodal_iquotationlinedraft": "IQuotationLineDraft" | kind=code-symbol | neighbors=[ILineItem]
- "bid_aitab_aitabprops": "AITabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AITab.tsx:L7 | neighbors=[AITab.tsx]
- "bid_approvaltab_approvaltrackpanel": "ApprovalTrackPanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ApprovalTab.tsx:L291 | neighbors=[ApprovalTab.tsx]
- "bid_approvaltab_matchesdivision": "matchesDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ApprovalTab.tsx:L114 | neighbors=[ApprovalTab.tsx]
- "bid_approvaltab_sector_configs": "SECTOR_CONFIGS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ApprovalTab.tsx:L130 | neighbors=[ApprovalTab.tsx]
- "bid_approvaltab_sectorconfig": "SectorConfig" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ApprovalTab.tsx:L91 | neighbors=[ApprovalTab.tsx]
- "bid_approvaltab_status_display": "STATUS_DISPLAY" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ApprovalTab.tsx:L245 | neighbors=[ApprovalTab.tsx]
- "bid_assetsbreakdowntab_assetsbreakdowntabprops": "AssetsBreakdownTabProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L71 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_blankasset": "blankAsset()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L91 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_blanksubcost": "blankSubCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L116 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_blanksubitemcost": "blankSubItemCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L138 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_blanktransitsubcost": "blankTransitSubCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L125 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_cleared_pricing": "CLEARED_PRICING" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L153 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_costrefbadgeclass": "costRefBadgeClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L296 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_dateageclass": "dateAgeClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L261 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_drawertab": "DrawerTab" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L218 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_fmtpct": "fmtPct()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L279 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_formatdateref": "formatDateRef()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L239 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_getquotelinkhref": "getQuoteLinkHref()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L290 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_haspricing": "hasPricing()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L167 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_isquerysource": "isQuerySource()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L281 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_istransitfilled": "isTransitFilled()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L199 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_leavesrental": "leavesRental()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L213 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_query_sources": "QUERY_SOURCES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L274 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_releasequotationprice": "releaseQuotationPrice()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L221 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_synctransitfees": "syncTransitFees()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L185 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_assetsbreakdowntab_withouttransit": "withoutTransit()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L208 | neighbors=[AssetsBreakdownTab.tsx]
- "bid_bidactivitylog_activity_icons": "ACTIVITY_ICONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L61 | neighbors=[BidActivityLog.tsx]
- "bid_bidactivitylog_bidactivitylogprops": "BidActivityLogProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L54 | neighbors=[BidActivityLog.tsx]
- "bid_bidactivitylog_categoryfilter": "CategoryFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L92 | neighbors=[BidActivityLog.tsx]
- "bid_bidactivitylog_getactivitycolor": "getActivityColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L37 | neighbors=[BidActivityLog.tsx]
- "bid_bidactivitylog_getinitials": "getInitials()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L99 | neighbors=[BidActivityLog.tsx]
- "bid_bidactivitylog_transition": "Transition()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L107 | neighbors=[BidActivityLog.tsx]
- "bid_bidapprovalpanel_bidapprovalpanel": "BidApprovalPanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidApprovalPanel.tsx:L13 | neighbors=[BidApprovalPanel.tsx]
- "bid_bidapprovalpanel_bidapprovalpanelprops": "BidApprovalPanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidApprovalPanel.tsx:L7 | neighbors=[BidApprovalPanel.tsx]
- "bid_bidcard_bidcardprops": "BidCardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidCard.tsx:L16 | neighbors=[BidCard.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-064.json

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
