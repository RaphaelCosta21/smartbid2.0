# Node Description Batch 72 of 86

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
- "pages_mydashboardpage_mydashboardpage": "MyDashboardPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/MyDashboardPage.tsx:L18 | neighbors=[MyDashboardPage.tsx]
- "pages_notificationspage_icon_map": "ICON_MAP" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/NotificationsPage.tsx:L9 | neighbors=[NotificationsPage.tsx]
- "pages_operationalsummarypage_chart_sections": "CHART_SECTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/OperationalSummaryPage.tsx:L33 | neighbors=[OperationalSummaryPage.tsx]
- "pages_operationalsummarypage_hidezero": "hideZero()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/OperationalSummaryPage.tsx:L47 | neighbors=[OperationalSummaryPage.tsx]
- "pages_pastbidspage_empty_filters": "EMPTY_FILTERS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PastBidsPage.tsx:L54 | neighbors=[PastBidsPage.tsx]
- "pages_pastbidspage_facet_values": "FACET_VALUES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PastBidsPage.tsx:L65 | neighbors=[PastBidsPage.tsx]
- "pages_pastbidspage_ipastbidfilters": "IPastBidFilters" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PastBidsPage.tsx:L43 | neighbors=[PastBidsPage.tsx]
- "pages_performancetrendspage_gran_segments": "GRAN_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PerformanceTrendsPage.tsx:L50 | neighbors=[PerformanceTrendsPage.tsx]
- "pages_periodperformancepage_chart_sections": "CHART_SECTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PeriodPerformancePage.tsx:L56 | neighbors=[PeriodPerformancePage.tsx]
- "pages_placeholderpage_placeholderpage": "PlaceholderPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PlaceholderPage.tsx:L9 | neighbors=[PlaceholderPage.tsx]
- "pages_placeholderpage_placeholderpageprops": "PlaceholderPageProps" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PlaceholderPage.tsx:L5 | neighbors=[PlaceholderPage.tsx]
- "pages_queryconsultingpage_calcleadtimedays": "calcLeadTimeDays()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L168 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_convertexceldate": "convertExcelDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L117 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_extractbus": "extractBUs()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L191 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_formatasusd": "formatAsUSD()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L155 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_getphotourl": "getPhotoUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L185 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_ibusinessunitfilter": "IBusinessUnitFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L62 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_isearchfilter": "ISearchFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L67 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_isubtabdata": "ISubTabData" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L82 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_itabdata": "ITabData" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L73 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_month_names": "MONTH_NAMES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L101 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_photothumbnail": "PhotoThumbnail()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L1817 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_sortrows": "sortRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L271 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_sources": "SOURCES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L293 | neighbors=[QueryConsultingPage.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-071.json

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
