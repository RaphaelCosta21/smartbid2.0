# Node Description Batch 83 of 102

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

- "models_ibid_idivisionhourstotals": "IDivisionHoursTotals" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L537 | neighbors=[IBid.ts]
- "pages_analyticspage_previewdef": "PreviewDef" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AnalyticsPage.tsx:L35 | neighbors=[AnalyticsPage.tsx]
- "pages_approvalspage_approvaltab": "ApprovalTab" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ApprovalsPage.tsx:L12 | neighbors=[ApprovalsPage.tsx]
- "pages_assetscatalogpage_facetkey": "FacetKey" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L24 | neighbors=[AssetsCatalogPage.tsx]
- "pages_assetscatalogpage_sortorder": "SortOrder" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L23 | neighbors=[AssetsCatalogPage.tsx]
- "pages_assetscatalogpage_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L22 | neighbors=[AssetsCatalogPage.tsx]
- "pages_bidboardpage_bidboardpage": "BidBoardPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidBoardPage.tsx:L16 | neighbors=[BidBoardPage.tsx]
- "pages_bidcomparatorpage_result_tabs": "RESULT_TABS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidComparatorPage.tsx:L35 | neighbors=[BidComparatorPage.tsx]
- "pages_bidcomparatorpage_resulttab": "ResultTab" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidComparatorPage.tsx:L33 | neighbors=[BidComparatorPage.tsx]
- "pages_biddetailpage_bidtab": "BidTab" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L73 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_divisioneditwrap": "DivisionEditWrap()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L146 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_editable_tabs": "EDITABLE_TABS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L116 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_empty_hours_summary": "EMPTY_HOURS_SUMMARY" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L132 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_inavgroup": "INavGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L101 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_inavitem": "INavItem" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L93 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailpage_nav_groups": "NAV_GROUPS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L106 | neighbors=[BidDetailPage.tsx]
- "pages_biddetailsreportpage_chart_sections": "CHART_SECTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailsReportPage.tsx:L45 | neighbors=[BidDetailsReportPage.tsx]
- "pages_bidresultspage_bidresultspage": "BidResultsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidResultsPage.tsx:L14 | neighbors=[BidResultsPage.tsx]
- "pages_bidtrackerpage_getavatarcolor": "getAvatarColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L77 | neighbors=[BidTrackerPage.tsx]
- "pages_bidtrackerpage_getinitials": "getInitials()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L68 | neighbors=[BidTrackerPage.tsx]
- "pages_bidtrackerpage_istrackedbid": "isTrackedBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L57 | neighbors=[BidTrackerPage.tsx]
- "pages_bidtrackerpage_priorities": "PRIORITIES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L54 | neighbors=[BidTrackerPage.tsx]
- "pages_bidtrackerpage_uniquesorted": "uniqueSorted()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L60 | neighbors=[BidTrackerPage.tsx]
- "pages_bidtrackerpage_view_options": "VIEW_OPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L47 | neighbors=[BidTrackerPage.tsx]
- "pages_bomcostspage_calccontingency": "calcContingency()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L119 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_computesmarttotal": "computeSmartTotal()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L238 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_dateagebucket": "dateAgeBucket()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L290 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_dateageclass": "dateAgeClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L141 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_getvisibleitems": "getVisibleItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L90 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_haschildren": "hasChildren()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L62 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_headericon": "HeaderIcon()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L149 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_ilistrow": "IListRow" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L91 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_listfacet": "ListFacet" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L89 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_listsort": "ListSort" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L87 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_listview": "ListView" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L88 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_month_names": "MONTH_NAMES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L26 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_pagemode": "PageMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L86 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_reassignfindnumbers": "reassignFindNumbers()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L78 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_recalctotal": "recalcTotal()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L133 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_rollupparentcosts": "rollUpParentCosts()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L190 | neighbors=[BomCostsPage.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-082.json

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
