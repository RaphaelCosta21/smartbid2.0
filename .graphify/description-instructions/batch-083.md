# Node Description Batch 84 of 102

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

- "pages_bomcostspage_srcclass": "srcClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L115 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_srclabel": "srcLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L132 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_status_options": "STATUS_OPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L98 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_uid": "uid()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L106 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_viewerrow": "ViewerRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L165 | neighbors=[BomCostsPage.tsx]
- "pages_bottleneckanalysispage_dim_segments": "DIM_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L64 | neighbors=[BottleneckAnalysisPage.tsx]
- "pages_bottleneckanalysispage_dimension": "Dimension" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L56 | neighbors=[BottleneckAnalysisPage.tsx]
- "pages_bottleneckanalysispage_scope": "Scope" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L55 | neighbors=[BottleneckAnalysisPage.tsx]
- "pages_bottleneckanalysispage_scope_segments": "SCOPE_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L58 | neighbors=[BottleneckAnalysisPage.tsx]
- "pages_bottleneckanalysispage_stat_segments": "STAT_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L69 | neighbors=[BottleneckAnalysisPage.tsx]
- "pages_clarificationsdbpage_emptyitem": "emptyItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ClarificationsDbPage.tsx:L46 | neighbors=[ClarificationsDbPage.tsx]
- "pages_createrequestpage_formdata": "FormData" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/CreateRequestPage.tsx:L44 | neighbors=[CreateRequestPage.tsx]
- "pages_createrequestpage_initial_form": "INITIAL_FORM" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/CreateRequestPage.tsx:L72 | neighbors=[CreateRequestPage.tsx]
- "pages_createrequestpage_isactiveprojectmanager": "isActiveProjectManager()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/CreateRequestPage.tsx:L115 | neighbors=[CreateRequestPage.tsx]
- "pages_createrequestpage_pmgroup": "PmGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/CreateRequestPage.tsx:L107 | neighbors=[CreateRequestPage.tsx]
- "pages_createrequestpage_steps": "STEPS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/CreateRequestPage.tsx:L99 | neighbors=[CreateRequestPage.tsx]
- "pages_dashboardpage_no_bids": "NO_BIDS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/DashboardPage.tsx:L66 | neighbors=[DashboardPage.tsx]
- "pages_dashboardpage_view_options": "VIEW_OPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/DashboardPage.tsx:L53 | neighbors=[DashboardPage.tsx]
- "pages_datasheetspage_move_target": "MOVE_TARGET" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/DatasheetsPage.tsx:L7 | neighbors=[DatasheetsPage.tsx]
- "pages_faqpage_faq_items": "FAQ_ITEMS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FaqPage.tsx:L11 | neighbors=[FaqPage.tsx]
- "pages_faqpage_ifaqitem": "IFaqItem" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FaqPage.tsx:L5 | neighbors=[FaqPage.tsx]
- "pages_favoritespage_bid_facet_values": "BID_FACET_VALUES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L76 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_bid_filters": "BID_FILTERS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L61 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_bid_view_options": "BID_VIEW_OPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L94 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_bidfilterkey": "BidFilterKey" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L52 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_editequipmentmodal": "EditEquipmentModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L1143 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_editequipmentmodalprops": "EditEquipmentModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L1132 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_empty_bid_filters": "EMPTY_BID_FILTERS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L84 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_favoritenote": "favoriteNote()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L105 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_getphotourl": "getPhotoUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L24 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_ipastbidrow": "IPastBidRow" | kind=code-symbol | neighbors=[IFavoriteBidRow]
- "pages_favoritespage_staricon": "StarIcon()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L1118 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_tabkey": "TabKey" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L44 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L45 | neighbors=[FavoritesPage.tsx]
- "pages_linksrecommendationspage_linkmodal": "LinkModal" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/LinksRecommendationsPage.tsx:L11 | neighbors=[LinksRecommendationsPage.tsx]
- "pages_linksrecommendationspage_recmodal": "RecModal" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/LinksRecommendationsPage.tsx:L12 | neighbors=[LinksRecommendationsPage.tsx]
- "pages_manualscatalogspage_move_target": "MOVE_TARGET" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ManualsCatalogsPage.tsx:L7 | neighbors=[ManualsCatalogsPage.tsx]
- "pages_mydashboardpage_mydashboardpage": "MyDashboardPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/MyDashboardPage.tsx:L18 | neighbors=[MyDashboardPage.tsx]
- "pages_notificationspage_icon_map": "ICON_MAP" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/NotificationsPage.tsx:L9 | neighbors=[NotificationsPage.tsx]
- "pages_operationalsummarypage_chart_sections": "CHART_SECTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/OperationalSummaryPage.tsx:L33 | neighbors=[OperationalSummaryPage.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-083.json

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
