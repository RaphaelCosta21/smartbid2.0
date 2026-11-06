# Node Description Batch 85 of 102

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

- "pages_operationalsummarypage_hidezero": "hideZero()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/OperationalSummaryPage.tsx:L47 | neighbors=[OperationalSummaryPage.tsx]
- "pages_pastbidspage_empty_filters": "EMPTY_FILTERS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PastBidsPage.tsx:L54 | neighbors=[PastBidsPage.tsx]
- "pages_pastbidspage_facet_values": "FACET_VALUES" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PastBidsPage.tsx:L65 | neighbors=[PastBidsPage.tsx]
- "pages_pastbidspage_ipastbidfilters": "IPastBidFilters" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PastBidsPage.tsx:L43 | neighbors=[PastBidsPage.tsx]
- "pages_performancetrendspage_gran_segments": "GRAN_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PerformanceTrendsPage.tsx:L50 | neighbors=[PerformanceTrendsPage.tsx]
- "pages_periodperformancepage_chart_sections": "CHART_SECTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PeriodPerformancePage.tsx:L56 | neighbors=[PeriodPerformancePage.tsx]
- "pages_placeholderpage_placeholderpage": "PlaceholderPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PlaceholderPage.tsx:L9 | neighbors=[PlaceholderPage.tsx]
- "pages_placeholderpage_placeholderpageprops": "PlaceholderPageProps" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PlaceholderPage.tsx:L5 | neighbors=[PlaceholderPage.tsx]
- "pages_pricehistorypage_historytab": "HistoryTab" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PriceHistoryPage.tsx:L17 | neighbors=[PriceHistoryPage.tsx]
- "pages_pricehistorypage_tabs": "TABS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PriceHistoryPage.tsx:L19 | neighbors=[PriceHistoryPage.tsx]
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
- "pages_queryconsultingpage_subtabkey": "SubTabKey" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L60 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_tabkey": "TabKey" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L59 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_totokens": "toTokens()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L207 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_tour_placement": "TOUR_PLACEMENT" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L299 | neighbors=[QueryConsultingPage.tsx]
- "pages_queryconsultingpage_view_keys": "VIEW_KEYS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L297 | neighbors=[QueryConsultingPage.tsx]
- "pages_quotationspage_ilineitem": "ILineItem" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QuotationsPage.tsx:L57 | neighbors=[QuotationsPage.tsx]
- "pages_quotationspage_staricon": "StarIcon()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QuotationsPage.tsx:L122 | neighbors=[QuotationsPage.tsx]
- "pages_reportspage_previewdef": "PreviewDef" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ReportsPage.tsx:L15 | neighbors=[ReportsPage.tsx]
- "pages_suppliersregistry_basis_labels": "BASIS_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L118 | neighbors=[SuppliersRegistry.tsx]
- "pages_suppliersregistry_empty_filters": "EMPTY_FILTERS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L136 | neighbors=[SuppliersRegistry.tsx]
- "pages_suppliersregistry_enrichrow": "EnrichRow" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L154 | neighbors=[SuppliersRegistry.tsx]
- "pages_suppliersregistry_filters": "Filters" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L128 | neighbors=[SuppliersRegistry.tsx]
- "pages_suppliersregistry_formstate": "FormState" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L43 | neighbors=[SuppliersRegistry.tsx]
- "pages_suppliersregistry_hassuggestion": "hasSuggestion()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L115 | neighbors=[SuppliersRegistry.tsx]
- "pages_suppliersregistry_mergeunique": "mergeUnique()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L103 | neighbors=[SuppliersRegistry.tsx]
- "pages_suppliersregistry_splitcommas": "splitCommas()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L84 | neighbors=[SuppliersRegistry.tsx]
- "pages_suppliersregistry_splitlines": "splitLines()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L90 | neighbors=[SuppliersRegistry.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-084.json

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
