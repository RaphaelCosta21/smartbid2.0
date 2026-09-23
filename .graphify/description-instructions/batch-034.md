# Node Description Batch 35 of 43

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

- "knowledge_doclibrarycatalog_stripext": "stripExt()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L277 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L66 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_withcategory": "withCategory()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L87 | neighbors=[DocLibraryCatalog.tsx]
- "layout_applayout_applayoutinner": "AppLayoutInner()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/AppLayout.tsx:L155 | neighbors=[AppLayout.tsx]
- "layout_applayout_requireengineering": "RequireEngineering()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/AppLayout.tsx:L70 | neighbors=[AppLayout.tsx]
- "layout_commandpalette_icommanditem": "ICommandItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/CommandPalette.tsx:L15 | neighbors=[CommandPalette.tsx]
- "layout_footer_oiibluelogo": "oiiBlueLogo" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L7 | neighbors=[Footer.tsx]
- "layout_footer_oiiwhitelogo": "oiiWhiteLogo" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L8 | neighbors=[Footer.tsx]
- "layout_footer_smartbidicon": "smartBidIcon" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L9 | neighbors=[Footer.tsx]
- "layout_footer_smartbidicondark": "smartBidIconDark" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L10 | neighbors=[Footer.tsx]
- "layout_sidebar_icon": "Icon()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L22 | neighbors=[Sidebar.tsx]
- "layout_sidebar_oiiwhitelogo": "oiiWhiteLogo" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L19 | neighbors=[Sidebar.tsx]
- "layout_sidebar_smartbidiconwhite": "smartBidIconWhite" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L18 | neighbors=[Sidebar.tsx]
- "layout_sidebar_smartbidlogocompact": "smartBidLogoCompact" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Sidebar.tsx:L17 | neighbors=[Sidebar.tsx]
- "layout_sidebaritem_sidebaritemprops": "SidebarItemProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarItem.tsx:L4 | neighbors=[SidebarItem.tsx]
- "layout_sidebarsubmenu_sidebarsubmenuprops": "SidebarSubmenuProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarSubmenu.tsx:L4 | neighbors=[SidebarSubmenu.tsx]
- "loc_en_us": "en-us.js" | kind=code-symbol | source=src/webparts/smartBid20/loc/en-us.js:L1 | neighbors=[fe3728a smartbid2.0]
- "loc_mystrings_d_ismartbid20webpartstrings": "ISmartBid20WebPartStrings" | kind=code-symbol | source=src/webparts/smartBid20/loc/mystrings.d.ts:L1 | neighbors=[mystrings.d.ts]
- "loc_mystrings_d_smartbid20webpartstrings": "SmartBid20WebPartStrings" | kind=code-symbol | source=src/webparts/smartBid20/loc/mystrings.d.ts:L16 | neighbors=[mystrings.d.ts]
- "models_ibid_idivisioncost": "IDivisionCost" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L574 | neighbors=[IBid.ts]
- "models_ibid_idivisionhourstotals": "IDivisionHoursTotals" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L490 | neighbors=[IBid.ts]
- "pages_analyticspage_previewdef": "PreviewDef" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AnalyticsPage.tsx:L35 | neighbors=[AnalyticsPage.tsx]
- "pages_approvalspage_approvaltab": "ApprovalTab" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ApprovalsPage.tsx:L12 | neighbors=[ApprovalsPage.tsx]
- "pages_assetscatalogpage_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L9 | neighbors=[AssetsCatalogPage.tsx]
- "pages_bidboardpage_bidboardpage": "BidBoardPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidBoardPage.tsx:L15 | neighbors=[BidBoardPage.tsx]
- "pages_biddetailpage_bidtab": "BidTab" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L73 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_divisioneditwrap": "DivisionEditWrap()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L180 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_empty_hours_summary": "EMPTY_HOURS_SUMMARY" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L166 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_inavgroup": "INavGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L101 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_inavitem": "INavItem" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L93 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_nav_groups": "NAV_GROUPS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L106 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailsreportpage_chart_sections": "CHART_SECTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailsReportPage.tsx:L45 | neighbors=[BidDetailsReportPage.tsx]
- "pages_bidresultspage_bidresultspage": "BidResultsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidResultsPage.tsx:L14 | neighbors=[BidResultsPage.tsx]
- "pages_bidtrackerpage_getavatarcolor": "getAvatarColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L32 | neighbors=[BidTrackerPage.tsx]
- "pages_bidtrackerpage_getinitials": "getInitials()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L23 | neighbors=[BidTrackerPage.tsx]
- "pages_bomcostspage_calccontingency": "calcContingency()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L118 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_computesmarttotal": "computeSmartTotal()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L237 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_dateagebucket": "dateAgeBucket()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L289 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_dateageclass": "dateAgeClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L276 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_getvisibleitems": "getVisibleItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L89 | neighbors=[BomCostsPage.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-034.json

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
