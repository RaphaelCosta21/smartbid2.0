# Node Description Batch 73 of 86

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
- "pages_suppliersregistry_splitlinesonly": "splitLinesOnly()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L96 | neighbors=[SuppliersRegistry.tsx]
- "pages_suppliersregistry_syncrow": "SyncRow" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L144 | neighbors=[SuppliersRegistry.tsx]
- "pages_surveysystempage_dominantkind": "dominantKind()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SurveySystemPage.tsx:L75 | neighbors=[SurveySystemPage.tsx]
- "pages_surveysystempage_itrunkdetail": "ITrunkDetail" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SurveySystemPage.tsx:L68 | neighbors=[SurveySystemPage.tsx]
- "pages_surveysystempage_surveysystemscene": "SurveySystemScene" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SurveySystemPage.tsx:L50 | neighbors=[SurveySystemPage.tsx]
- "pages_surveysystempage_tour_depth": "TOUR_DEPTH" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SurveySystemPage.tsx:L59 | neighbors=[SurveySystemPage.tsx]
- "pages_teamanalyticspage_bidrolefilter": "BidRoleFilter" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L40 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_teamanalyticspage_metric": "Metric" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L38 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_teamanalyticspage_metric_segments": "METRIC_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L48 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_teamanalyticspage_role_segments": "ROLE_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L42 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_teamanalyticspage_view_segments": "VIEW_SEGMENTS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L56 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_teamanalyticspage_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L39 | neighbors=[TeamAnalyticsPage.tsx]
- "pages_technicalproposalspage_field_labels": "FIELD_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TechnicalProposalsPage.tsx:L9 | neighbors=[TechnicalProposalsPage.tsx]
- "pages_templatespage_facetkey": "FacetKey" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L34 | neighbors=[TemplatesPage.tsx]
- "pages_templatespage_sortorder": "SortOrder" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L33 | neighbors=[TemplatesPage.tsx]
- "pages_templatespage_status_options": "STATUS_OPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L36 | neighbors=[TemplatesPage.tsx]
- "pages_templatespage_statuskey": "statusKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L41 | neighbors=[TemplatesPage.tsx]
- "pages_templatespage_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L32 | neighbors=[TemplatesPage.tsx]
- "pages_timelinepage_barlayout": "BarLayout" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L66 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_duehealth": "DueHealth" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L31 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_getduehealth": "getDueHealth()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L88 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_health_class": "HEALTH_CLASS" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L59 | neighbors=[TimelinePage.tsx]
- "pages_timelinepage_health_legend": "HEALTH_LEGEND" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L45 | neighbors=[TimelinePage.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-072.json

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
