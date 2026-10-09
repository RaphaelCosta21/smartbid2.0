# Node Description Batch 70 of 86

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
- "layout_sidebar_icon": "Icon()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L23 | neighbors=[Sidebar.tsx]
- "layout_sidebar_oiiwhitelogo": "oiiWhiteLogo" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L20 | neighbors=[Sidebar.tsx]
- "layout_sidebar_smartbidiconwhite": "smartBidIconWhite" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L19 | neighbors=[Sidebar.tsx]
- "layout_sidebar_smartbidlogocompact": "smartBidLogoCompact" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L18 | neighbors=[Sidebar.tsx]
- "layout_sidebaritem_sidebaritemprops": "SidebarItemProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarItem.tsx:L5 | neighbors=[SidebarItem.tsx]
- "layout_sidebarsubmenu_sidebarsubmenuprops": "SidebarSubmenuProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarSubmenu.tsx:L4 | neighbors=[SidebarSubmenu.tsx]
- "loc_en_us": "en-us.js" | kind=code-symbol | source=src/webparts/smartBid20/loc/en-us.js:L1 | neighbors=[fe3728a smartbid2.0]
- "loc_mystrings_d_ismartbid20webpartstrings": "ISmartBid20WebPartStrings" | kind=code-symbol | source=src/webparts/smartBid20/loc/mystrings.d.ts:L1 | neighbors=[mystrings.d.ts]
- "loc_mystrings_d_smartbid20webpartstrings": "SmartBid20WebPartStrings" | kind=code-symbol | source=src/webparts/smartBid20/loc/mystrings.d.ts:L16 | neighbors=[mystrings.d.ts]
- "models_ibid_idivisioncost": "IDivisionCost" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L617 | neighbors=[IBid.ts]
- "models_ibid_idivisionhourstotals": "IDivisionHoursTotals" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L533 | neighbors=[IBid.ts]
- "pages_analyticspage_previewdef": "PreviewDef" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AnalyticsPage.tsx:L35 | neighbors=[AnalyticsPage.tsx]
- "pages_approvalspage_approvaltab": "ApprovalTab" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ApprovalsPage.tsx:L12 | neighbors=[ApprovalsPage.tsx]
- "pages_assetscatalogpage_facetkey": "FacetKey" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L24 | neighbors=[AssetsCatalogPage.tsx]
- "pages_assetscatalogpage_sortorder": "SortOrder" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L23 | neighbors=[AssetsCatalogPage.tsx]
- "pages_assetscatalogpage_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L22 | neighbors=[AssetsCatalogPage.tsx]
- "pages_bidboardpage_bidboardpage": "BidBoardPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidBoardPage.tsx:L16 | neighbors=[BidBoardPage.tsx]
- "pages_biddetailpage_bidtab": "BidTab" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L73 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_divisioneditwrap": "DivisionEditWrap()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L138 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_editable_tabs": "EDITABLE_TABS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L108 | neighbors=[BidDetailPage.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-069.json

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
