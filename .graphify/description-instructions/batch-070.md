# Node Description Batch 71 of 86

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

- "pages_biddetailpage_empty_hours_summary": "EMPTY_HOURS_SUMMARY" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L124 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_inavgroup": "INavGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L101 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_inavitem": "INavItem" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L93 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_nav_groups": "NAV_GROUPS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L106 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailsreportpage_chart_sections": "CHART_SECTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailsReportPage.tsx:L45 | neighbors=[BidDetailsReportPage.tsx]
- "pages_bidresultspage_bidresultspage": "BidResultsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidResultsPage.tsx:L14 | neighbors=[BidResultsPage.tsx]
- "pages_bidtrackerpage_getavatarcolor": "getAvatarColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L70 | neighbors=[BidTrackerPage.tsx]
- "pages_bidtrackerpage_getinitials": "getInitials()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L61 | neighbors=[BidTrackerPage.tsx]
- "pages_bidtrackerpage_istrackedbid": "isTrackedBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L50 | neighbors=[BidTrackerPage.tsx]
- "pages_bidtrackerpage_priorities": "PRIORITIES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L47 | neighbors=[BidTrackerPage.tsx]
- "pages_bidtrackerpage_uniquesorted": "uniqueSorted()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L53 | neighbors=[BidTrackerPage.tsx]
- "pages_bidtrackerpage_view_options": "VIEW_OPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L40 | neighbors=[BidTrackerPage.tsx]
- "pages_bomcostspage_calccontingency": "calcContingency()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L119 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_computesmarttotal": "computeSmartTotal()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L238 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_dateagebucket": "dateAgeBucket()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L290 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_dateageclass": "dateAgeClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L277 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_getvisibleitems": "getVisibleItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L90 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_haschildren": "hasChildren()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L62 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_month_names": "MONTH_NAMES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L26 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_pagemode": "PageMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L50 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_reassignfindnumbers": "reassignFindNumbers()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L78 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_recalctotal": "recalcTotal()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L133 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_rollupparentcosts": "rollUpParentCosts()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L190 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_srcclass": "srcClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L138 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_srclabel": "srcLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L156 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_uid": "uid()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L52 | neighbors=[BomCostsPage.tsx]
- "pages_bottleneckanalysispage_dim_segments": "DIM_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L64 | neighbors=[BottleneckAnalysisPage.tsx]
- "pages_bottleneckanalysispage_dimension": "Dimension" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L56 | neighbors=[BottleneckAnalysisPage.tsx]
- "pages_bottleneckanalysispage_scope": "Scope" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L55 | neighbors=[BottleneckAnalysisPage.tsx]
- "pages_bottleneckanalysispage_scope_segments": "SCOPE_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L58 | neighbors=[BottleneckAnalysisPage.tsx]
- "pages_bottleneckanalysispage_stat_segments": "STAT_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L69 | neighbors=[BottleneckAnalysisPage.tsx]
- "pages_clarificationsdbpage_emptyitem": "emptyItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ClarificationsDbPage.tsx:L46 | neighbors=[ClarificationsDbPage.tsx]
- "pages_createrequestpage_formdata": "FormData" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/CreateRequestPage.tsx:L35 | neighbors=[CreateRequestPage.tsx]
- "pages_createrequestpage_initial_form": "INITIAL_FORM" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/CreateRequestPage.tsx:L60 | neighbors=[CreateRequestPage.tsx]
- "pages_createrequestpage_steps": "STEPS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/CreateRequestPage.tsx:L85 | neighbors=[CreateRequestPage.tsx]
- "pages_dashboardpage_no_bids": "NO_BIDS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/DashboardPage.tsx:L66 | neighbors=[DashboardPage.tsx]
- "pages_dashboardpage_view_options": "VIEW_OPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/DashboardPage.tsx:L53 | neighbors=[DashboardPage.tsx]
- "pages_easimoduleframe_easimoduleframeprops": "EasiModuleFrameProps" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/EasiModuleFrame.tsx:L8 | neighbors=[EasiModuleFrame.tsx]
- "pages_easimoduleframe_loadstate": "LoadState" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/EasiModuleFrame.tsx:L6 | neighbors=[EasiModuleFrame.tsx]
- "pages_faqpage_faq_items": "FAQ_ITEMS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FaqPage.tsx:L11 | neighbors=[FaqPage.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-070.json

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
