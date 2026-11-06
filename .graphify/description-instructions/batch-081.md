# Node Description Batch 82 of 102

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

- "knowledge_qualificationtablemodal_qualificationtablemodalprops": "QualificationTableModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L41 | neighbors=[QualificationTableModal.tsx]
- "knowledge_qualificationtablemodal_todraftrows": "toDraftRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L69 | neighbors=[QualificationTableModal.tsx]
- "layout_applayout_requireengineering": "RequireEngineering()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/AppLayout.tsx:L70 | neighbors=[AppLayout.tsx]
- "layout_commandpalette_icommanditem": "ICommandItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/CommandPalette.tsx:L16 | neighbors=[CommandPalette.tsx]
- "layout_footer_oiibluelogo": "oiiBlueLogo" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L7 | neighbors=[Footer.tsx]
- "layout_footer_oiiwhitelogo": "oiiWhiteLogo" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L8 | neighbors=[Footer.tsx]
- "layout_footer_smartbidicon": "smartBidIcon" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L9 | neighbors=[Footer.tsx]
- "layout_footer_smartbidicondark": "smartBidIconDark" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L10 | neighbors=[Footer.tsx]
- "layout_livepulse_anchor": "Anchor" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L37 | neighbors=[LivePulse.tsx]
- "layout_livepulse_bidtitle": "bidTitle()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L62 | neighbors=[LivePulse.tsx]
- "layout_livepulse_buildsignature": "buildSignature()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L70 | neighbors=[LivePulse.tsx]
- "layout_livepulse_describegone": "describeGone()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L225 | neighbors=[LivePulse.tsx]
- "layout_livepulse_diffsignature": "diffSignature()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L242 | neighbors=[LivePulse.tsx]
- "layout_livepulse_no_bids": "NO_BIDS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L48 | neighbors=[LivePulse.tsx]
- "layout_livepulse_phase": "Phase" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L35 | neighbors=[LivePulse.tsx]
- "layout_livepulse_samefields": "sameFields()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L119 | neighbors=[LivePulse.tsx]
- "layout_livepulse_sigentry": "SigEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L53 | neighbors=[LivePulse.tsx]
- "layout_livepulse_signature": "Signature" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L60 | neighbors=[LivePulse.tsx]
- "layout_livepulsepanel_daytone": "dayTone()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L128 | neighbors=[LivePulsePanel.tsx]
- "layout_livepulsepanel_detailref": "DetailRef" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L58 | neighbors=[LivePulsePanel.tsx]
- "layout_livepulsepanel_ern_filters": "ERN_FILTERS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L79 | neighbors=[LivePulsePanel.tsx]
- "layout_livepulsepanel_erntone": "ernTone()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L120 | neighbors=[LivePulsePanel.tsx]
- "layout_livepulsepanel_field": "Field()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L167 | neighbors=[LivePulsePanel.tsx]
- "layout_livepulsepanel_initials": "initials()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L110 | neighbors=[LivePulsePanel.tsx]
- "layout_livepulsepanel_key_prefix": "KEY_PREFIX" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L67 | neighbors=[LivePulsePanel.tsx]
- "layout_livepulsepanel_kind_label": "KIND_LABEL" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L73 | neighbors=[LivePulsePanel.tsx]
- "layout_livepulsepanel_livepulsepanelprops": "LivePulsePanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L44 | neighbors=[LivePulsePanel.tsx]
- "layout_livepulsepanel_tab": "Tab" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L56 | neighbors=[LivePulsePanel.tsx]
- "layout_livepulsepanel_waittone": "waitTone()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L135 | neighbors=[LivePulsePanel.tsx]
- "layout_sidebar_icon": "Icon()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L22 | neighbors=[Sidebar.tsx]
- "layout_sidebar_oiiwhitelogo": "oiiWhiteLogo" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L19 | neighbors=[Sidebar.tsx]
- "layout_sidebar_smartbidicon": "smartBidIcon" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L18 | neighbors=[Sidebar.tsx]
- "layout_sidebar_smartbidiconwhite": "smartBidIconWhite" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L19 | neighbors=[Sidebar.tsx]
- "layout_sidebar_smartbidlogocompact": "smartBidLogoCompact" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L18 | neighbors=[Sidebar.tsx]
- "layout_sidebaritem_sidebaritemprops": "SidebarItemProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarItem.tsx:L5 | neighbors=[SidebarItem.tsx]
- "layout_sidebarsubmenu_sidebarsubmenuprops": "SidebarSubmenuProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarSubmenu.tsx:L4 | neighbors=[SidebarSubmenu.tsx]
- "loc_en_us": "en-us.js" | kind=code-symbol | source=src/webparts/smartBid20/loc/en-us.js:L1 | neighbors=[fe3728a smartbid2.0]
- "loc_mystrings_d_ismartbid20webpartstrings": "ISmartBid20WebPartStrings" | kind=code-symbol | source=src/webparts/smartBid20/loc/mystrings.d.ts:L1 | neighbors=[mystrings.d.ts]
- "loc_mystrings_d_smartbid20webpartstrings": "SmartBid20WebPartStrings" | kind=code-symbol | source=src/webparts/smartBid20/loc/mystrings.d.ts:L16 | neighbors=[mystrings.d.ts]
- "models_ibid_idivisioncost": "IDivisionCost" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L621 | neighbors=[IBid.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-081.json

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
