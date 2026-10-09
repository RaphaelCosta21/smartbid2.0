# Node Description Batch 40 of 86

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

- "hooks_useliveoverview_liveupdatekind": "LiveUpdateKind" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useLiveOverview.ts:L41 | neighbors=[useLiveOverview.ts, LivePulse.tsx]
- "hooks_usepageaccess_ipageaccess": "IPageAccess" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/usePageAccess.ts:L8 | neighbors=[RequirePageAccess.tsx, usePageAccess.ts]
- "hooks_usepageaccess_pageaccesscontext": "PageAccessContext" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/usePageAccess.ts:L16 | neighbors=[RequirePageAccess.tsx, usePageAccess.ts]
- "hooks_usequalificationlibraryfilter_iqualificationlibraryrow": "IQualificationLibraryRow" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQualificationLibraryFilter.ts:L52 | neighbors=[useQualificationLibraryFilter.ts, QualificationLibraryView.tsx]
- "hooks_usequerysearch_deferquerycatalogcontext": "DeferQueryCatalogContext" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L28 | neighbors=[AIDocumentAnalyzer.tsx, useQuerySearch.ts]
- "hooks_usequerysearch_searchbyfield": "searchByField()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L56 | neighbors=[useQuerySearch.ts, searchBucket()]
- "hooks_usequerysearch_searchlist": "searchList()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L80 | neighbors=[useQuerySearch.ts, searchBucket()]
- "hooks_usequerysearch_usequerysearch": "useQuerySearch()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useQuerySearch.ts:L170 | neighbors=[PartNumberAutocomplete.tsx, useQuerySearch.ts]
- "hooks_usesupplierservicetypes_usesupplierservicetypes": "useSupplierServiceTypes()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useSupplierServiceTypes.ts:L18 | neighbors=[useSupplierServiceTypes.ts, SuppliersRegistry.tsx]
- "hooks_usesurveyportal_usefilteredsurveyequipment": "useFilteredSurveyEquipment()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useSurveyPortal.ts:L26 | neighbors=[useSurveyPortal.ts, SurveyEquipmentPage.tsx]
- "hooks_usetemplates_usetemplates": "useTemplates()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useTemplates.ts:L8 | neighbors=[useTemplates.ts, TemplatesPage.tsx]
- "insights_multiselectdropdown_multiselectpanel": "MultiSelectPanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/MultiSelectDropdown.tsx:L98 | neighbors=[ColumnFilter.tsx, MultiSelectDropdown.tsx]
- "knowledge_clarificationentrydrawer_clarificationentrydrawer": "ClarificationEntryDrawer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationEntryDrawer.tsx:L31 | neighbors=[ClarificationEntryDrawer.tsx, ClarificationsDbPage.tsx]
- "knowledge_clarificationentrymodal_todateinput": "toDateInput()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationEntryModal.tsx:L24 | neighbors=[ClarificationEntryModal.tsx, ClarificationEntryModal()]
- "knowledge_doclibrarycatalog_createfavoritegroupandsave": "createFavoriteGroupAndSave()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L195 | neighbors=[DocLibraryCatalog.tsx, findGroupByName()]
- "knowledge_doclibrarycatalog_empty_meta": "EMPTY_META()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L93 | neighbors=[DocLibraryCatalog.tsx, DocLibraryCatalog()]
- "knowledge_doclibrarycatalog_findsubgroupbyname": "findSubGroupByName()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L138 | neighbors=[DocLibraryCatalog.tsx, mergeExtractedMetadata()]
- "knowledge_pastbidcard_pastbidcard": "PastBidCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidCard.tsx:L23 | neighbors=[PastBidCard.tsx, FavoritesPage.tsx]
- "knowledge_pastbiddrawer_pastbiddrawer": "PastBidDrawer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidDrawer.tsx:L31 | neighbors=[PastBidDrawer.tsx, PastBidsPage.tsx]
- "knowledge_pastbidprofilemodal_pastbidprofilemodal": "PastBidProfileModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidProfileModal.tsx:L24 | neighbors=[PastBidProfileModal.tsx, PastBidsPage.tsx]
- "knowledge_qualificationentrydrawer_qualificationentrydrawer": "QualificationEntryDrawer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationEntryDrawer.tsx:L94 | neighbors=[QualificationEntryDrawer.tsx, QualificationLibraryView.tsx]
- "knowledge_qualificationentrymodal_qualificationentrymodal": "QualificationEntryModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationEntryModal.tsx:L23 | neighbors=[QualificationEntryModal.tsx, QualificationLibraryView.tsx]
- "knowledge_qualificationlibraryview_qualificationlibraryview": "QualificationLibraryView" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationLibraryView.tsx:L50 | neighbors=[QualificationLibraryView.tsx, ClarificationsDbPage.tsx]
- "knowledge_qualificationlibraryview_qualificationlibraryviewhandle": "QualificationLibraryViewHandle" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationLibraryView.tsx:L38 | neighbors=[QualificationLibraryView.tsx, ClarificationsDbPage.tsx]
- "knowledge_qualificationtablemodal_metaof": "metaOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L80 | neighbors=[QualificationTableModal.tsx, QualificationTableModal()]
- "knowledge_qualificationtablemodal_plural": "plural()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L140 | neighbors=[QualificationTableModal.tsx, QualificationTableModal()]
- "knowledge_qualificationtablemodal_samemeta": "sameMeta()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L92 | neighbors=[QualificationTableModal.tsx, QualificationTableModal()]
- "layout_applayout_applayout": "AppLayout()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/AppLayout.tsx:L86 | neighbors=[SmartBid20.tsx, AppLayout.tsx]
- "layout_applayout_applayoutinner": "AppLayoutInner()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/AppLayout.tsx:L199 | neighbors=[AppLayout.tsx, guard()]
- "layout_applayout_guard": "guard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/AppLayout.tsx:L79 | neighbors=[AppLayout.tsx, AppLayoutInner()]
- "layout_commandpalette_commandpalette": "CommandPalette()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/CommandPalette.tsx:L25 | neighbors=[AppLayout.tsx, CommandPalette.tsx]
- "layout_footer_footer": "Footer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L12 | neighbors=[AppLayout.tsx, Footer.tsx]
- "layout_guestmodebanner_guestmodebanner": "GuestModeBanner()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/GuestModeBanner.tsx:L4 | neighbors=[AppLayout.tsx, GuestModeBanner.tsx]
- "layout_header_header": "Header()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Header.tsx:L12 | neighbors=[AppLayout.tsx, Header.tsx]
- "layout_livepulse_describeapproval": "describeApproval()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L174 | neighbors=[LivePulse.tsx, personKeys()]
- "layout_livepulse_livepulse": "LivePulse()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L290 | neighbors=[Header.tsx, LivePulse.tsx]
- "layout_livepulse_personkeys": "personKeys()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L170 | neighbors=[LivePulse.tsx, describeApproval()]
- "layout_livepulsepanel_itemstyle": "itemStyle()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L142 | neighbors=[LivePulsePanel.tsx, LivePulsePanel()]
- "layout_livepulsepanel_tile": "Tile()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L146 | neighbors=[LivePulsePanel.tsx, useCountUp()]
- "layout_livepulsepanel_usecountup": "useCountUp()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L85 | neighbors=[LivePulsePanel.tsx, Tile()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-039.json

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
