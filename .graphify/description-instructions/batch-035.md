# Node Description Batch 36 of 43

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

- "pages_bomcostspage_haschildren": "hasChildren()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L61 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_month_names": "MONTH_NAMES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L25 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_pagemode": "PageMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L49 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_reassignfindnumbers": "reassignFindNumbers()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L77 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_recalctotal": "recalcTotal()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L132 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_rollupparentcosts": "rollUpParentCosts()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L189 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_srcclass": "srcClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L137 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_srclabel": "srcLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L155 | neighbors=[BomCostsPage.tsx]
- "pages_bomcostspage_uid": "uid()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L51 | neighbors=[BomCostsPage.tsx]
- "pages_bottleneckanalysispage_dim_segments": "DIM_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L63 | neighbors=[BottleneckAnalysisPage.tsx]
- "pages_bottleneckanalysispage_dimension": "Dimension" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L55 | neighbors=[BottleneckAnalysisPage.tsx]
- "pages_bottleneckanalysispage_scope": "Scope" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L54 | neighbors=[BottleneckAnalysisPage.tsx]
- "pages_bottleneckanalysispage_scope_segments": "SCOPE_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L57 | neighbors=[BottleneckAnalysisPage.tsx]
- "pages_bottleneckanalysispage_stat_segments": "STAT_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L68 | neighbors=[BottleneckAnalysisPage.tsx]
- "pages_clarificationsdbpage_emptyitem": "emptyItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ClarificationsDbPage.tsx:L15 | neighbors=[ClarificationsDbPage.tsx]
- "pages_createrequestpage_formdata": "FormData" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/CreateRequestPage.tsx:L29 | neighbors=[CreateRequestPage.tsx]
- "pages_createrequestpage_initial_form": "INITIAL_FORM" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/CreateRequestPage.tsx:L52 | neighbors=[CreateRequestPage.tsx]
- "pages_createrequestpage_steps": "STEPS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/CreateRequestPage.tsx:L75 | neighbors=[CreateRequestPage.tsx]
- "pages_faqpage_faq_items": "FAQ_ITEMS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FaqPage.tsx:L11 | neighbors=[FaqPage.tsx]
- "pages_faqpage_ifaqitem": "IFaqItem" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FaqPage.tsx:L5 | neighbors=[FaqPage.tsx]
- "pages_favoritespage_editequipmentmodal": "EditEquipmentModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L1123 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_editequipmentmodalprops": "EditEquipmentModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L1112 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_getphotourl": "getPhotoUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L24 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_staricon": "StarIcon()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L1098 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_tabkey": "TabKey" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L20 | neighbors=[FavoritesPage.tsx]
- "pages_favoritespage_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L21 | neighbors=[FavoritesPage.tsx]
- "pages_linksrecommendationspage_linkmodal": "LinkModal" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/LinksRecommendationsPage.tsx:L11 | neighbors=[LinksRecommendationsPage.tsx]
- "pages_linksrecommendationspage_recmodal": "RecModal" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/LinksRecommendationsPage.tsx:L12 | neighbors=[LinksRecommendationsPage.tsx]
- "pages_mydashboardpage_mydashboardpage": "MyDashboardPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/MyDashboardPage.tsx:L13 | neighbors=[MyDashboardPage.tsx]
- "pages_notificationspage_icon_map": "ICON_MAP" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/NotificationsPage.tsx:L9 | neighbors=[NotificationsPage.tsx]
- "pages_operationalsummarypage_chart_sections": "CHART_SECTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/OperationalSummaryPage.tsx:L33 | neighbors=[OperationalSummaryPage.tsx]
- "pages_performancetrendspage_gran_segments": "GRAN_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PerformanceTrendsPage.tsx:L49 | neighbors=[PerformanceTrendsPage.tsx]
- "pages_periodperformancepage_chart_sections": "CHART_SECTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PeriodPerformancePage.tsx:L55 | neighbors=[PeriodPerformancePage.tsx]
- "pages_placeholderpage_placeholderpage": "PlaceholderPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PlaceholderPage.tsx:L9 | neighbors=[PlaceholderPage.tsx]
- "pages_placeholderpage_placeholderpageprops": "PlaceholderPageProps" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PlaceholderPage.tsx:L5 | neighbors=[PlaceholderPage.tsx]
- "pages_queryconsultingpage_calcleadtimedays": "calcLeadTimeDays()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L133 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_convertexceldate": "convertExcelDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L86 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_extractbus": "extractBUs()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L156 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_formatasusd": "formatAsUSD()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L120 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_getphotourl": "getPhotoUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L150 | neighbors=[QueryConsultingPage.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-035.json

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
