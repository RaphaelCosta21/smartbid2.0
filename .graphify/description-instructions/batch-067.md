# Node Description Batch 68 of 86

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

- "hooks_useern_useernresult": "UseErnResult" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useErn.ts:L9 | neighbors=[useErn.ts]
- "hooks_useexport_useexport": "useExport()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useExport.ts:L9 | neighbors=[useExport.ts]
- "hooks_usekpis_bidkpis": "BidKPIs" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useKPIs.ts:L12 | neighbors=[useKPIs.ts]
- "hooks_usekpis_isawaitingresult": "isAwaitingResult()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useKPIs.ts:L28 | neighbors=[useKPIs.ts]
- "hooks_usekpis_undecided_results": "UNDECIDED_RESULTS" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useKPIs.ts:L26 | neighbors=[useKPIs.ts]
- "hooks_useliveoverview_ernlivekpis": "ErnLiveKpis" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useLiveOverview.ts:L20 | neighbors=[useLiveOverview.ts]
- "hooks_useopenbid_iopenbidapi": "IOpenBidApi" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useOpenBid.ts:L9 | neighbors=[useOpenBid.ts]
- "hooks_usepastbidpublisher_ipastbidpublishrequest": "IPastBidPublishRequest" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/usePastBidPublisher.ts:L17 | neighbors=[usePastBidPublisher.ts]
- "hooks_usequalificationlibraryfilter_all_keys": "ALL_KEYS" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQualificationLibraryFilter.ts:L29 | neighbors=[useQualificationLibraryFilter.ts]
- "hooks_usequalificationlibraryfilter_empty_filters": "EMPTY_FILTERS" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQualificationLibraryFilter.ts:L38 | neighbors=[useQualificationLibraryFilter.ts]
- "hooks_usequalificationlibraryfilter_iqualificationfilterstate": "IQualificationFilterState" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQualificationLibraryFilter.ts:L68 | neighbors=[useQualificationLibraryFilter.ts]
- "hooks_usequalificationlibraryfilter_origin_options": "ORIGIN_OPTIONS" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQualificationLibraryFilter.ts:L47 | neighbors=[useQualificationLibraryFilter.ts]
- "hooks_usequalificationlibraryfilter_qualificationfacetkey": "QualificationFacetKey" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQualificationLibraryFilter.ts:L19 | neighbors=[useQualificationLibraryFilter.ts]
- "hooks_usequalificationlibraryfilter_qualificationfilters": "QualificationFilters" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQualificationLibraryFilter.ts:L27 | neighbors=[useQualificationLibraryFilter.ts]
- "hooks_usequerysearch_bucket_order": "BUCKET_ORDER" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L17 | neighbors=[useQuerySearch.ts]
- "hooks_usequerysearch_empty_results": "EMPTY_RESULTS" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L25 | neighbors=[useQuerySearch.ts]
- "hooks_usequerysearch_searchfield": "SearchField" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L13 | neighbors=[useQuerySearch.ts]
- "hooks_usequerysearch_searchfn": "SearchFn" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L14 | neighbors=[useQuerySearch.ts]
- "hooks_usequerysearch_usequerysearchoptions": "UseQuerySearchOptions" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L30 | neighbors=[useQuerySearch.ts]
- "hooks_usequerysearch_usequerysearchreturn": "UseQuerySearchReturn" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L45 | neighbors=[useQuerySearch.ts]
- "hooks_userequests_userequests": "useRequests()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useRequests.ts:L8 | neighbors=[useRequests.ts]
- "hooks_useresponsive_breakpoints": "Breakpoints" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useResponsive.ts:L7 | neighbors=[useResponsive.ts]
- "hooks_useresultstatus_default_terminal_statuses": "DEFAULT_TERMINAL_STATUSES" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useResultStatus.ts:L16 | neighbors=[useResultStatus.ts]
- "hooks_useresultstatus_resultstatusapi": "ResultStatusApi" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useResultStatus.ts:L24 | neighbors=[useResultStatus.ts]
- "hooks_useslidingindicator_iindicatorrect": "IIndicatorRect" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useSlidingIndicator.ts:L3 | neighbors=[useSlidingIndicator.ts]
- "hooks_useslidingindicator_islidingindicator": "ISlidingIndicator" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useSlidingIndicator.ts:L10 | neighbors=[useSlidingIndicator.ts]
- "hooks_usestatuscolors_statuscolorlookup": "StatusColorLookup" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useStatusColors.ts:L15 | neighbors=[useStatusColors.ts]
- "hooks_usesupplierservicetypes_isupplierservicetypes": "ISupplierServiceTypes" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useSupplierServiceTypes.ts:L10 | neighbors=[useSupplierServiceTypes.ts]
- "hooks_usesurveyportal_isurveybidcomparison": "ISurveyBidComparison" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useSurveyPortal.ts:L8 | neighbors=[useSurveyPortal.ts]
- "insights_aiinsightspanel_aiinsightspanelprops": "AIInsightsPanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AIInsightsPanel.tsx:L4 | neighbors=[AIInsightsPanel.tsx]
- "insights_analyticsfilterbar_analyticsfilterbarprops": "AnalyticsFilterBarProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AnalyticsFilterBar.tsx:L12 | neighbors=[AnalyticsFilterBar.tsx]
- "insights_analyticsfilterbar_presets": "PRESETS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AnalyticsFilterBar.tsx:L28 | neighbors=[AnalyticsFilterBar.tsx]
- "insights_multiselectdropdown_multiselectdropdownprops": "MultiSelectDropdownProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/MultiSelectDropdown.tsx:L12 | neighbors=[MultiSelectDropdown.tsx]
- "insights_multiselectdropdown_multiselectpanelprops": "MultiSelectPanelProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/MultiSelectDropdown.tsx:L87 | neighbors=[MultiSelectDropdown.tsx]
- "insights_segmentedcontrol_segmentedcontrolprops": "SegmentedControlProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/SegmentedControl.tsx:L12 | neighbors=[SegmentedControl.tsx]
- "knowledge_clarificationentrydrawer_clarificationentrydrawerprops": "ClarificationEntryDrawerProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationEntryDrawer.tsx:L20 | neighbors=[ClarificationEntryDrawer.tsx]
- "knowledge_clarificationentrymodal_clarificationentrymodalprops": "ClarificationEntryModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationEntryModal.tsx:L17 | neighbors=[ClarificationEntryModal.tsx]
- "knowledge_doclibrarycatalog_bulkaistatus": "BulkAiStatus" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L112 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_default_field_labels": "DEFAULT_FIELD_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L58 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_doclibrarycatalogprops": "DocLibraryCatalogProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L74 | neighbors=[DocLibraryCatalog.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-067.json

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
