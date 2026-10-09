# Node Description Batch 69 of 86

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

- "knowledge_doclibrarycatalog_docthumb": "DocThumb()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L266 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_facetkey": "FacetKey" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L88 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_groupsuggestionbanner": "GroupSuggestionBanner()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L423 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_ibulkairow": "IBulkAiRow" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L120 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_idoclibraryfieldlabels": "IDocLibraryFieldLabels" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L41 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_igroupsuggestion": "IGroupSuggestion" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L115 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_metadatafields": "MetadataFields()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L306 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_runwithconcurrency": "runWithConcurrency()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L242 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_sortorder": "SortOrder" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L87 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_stripext": "stripExt()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L260 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L86 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_doclibrarycatalog_withcategory": "withCategory()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/DocLibraryCatalog.tsx:L87 | neighbors=[DocLibraryCatalog.tsx]
- "knowledge_pastbidbadges_kb_class": "KB_CLASS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidBadges.tsx:L75 | neighbors=[PastBidBadges.tsx]
- "knowledge_pastbidbadges_outcome_class": "OUTCOME_CLASS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidBadges.tsx:L51 | neighbors=[PastBidBadges.tsx]
- "knowledge_pastbidbadges_pastbidchipsprops": "PastBidChipsProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidBadges.tsx:L9 | neighbors=[PastBidBadges.tsx]
- "knowledge_pastbidbadges_pastbidoutcomeprops": "PastBidOutcomeProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidBadges.tsx:L58 | neighbors=[PastBidBadges.tsx]
- "knowledge_pastbidcard_pastbidcardprops": "PastBidCardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidCard.tsx:L13 | neighbors=[PastBidCard.tsx]
- "knowledge_pastbiddrawer_pastbiddrawerprops": "PastBidDrawerProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidDrawer.tsx:L16 | neighbors=[PastBidDrawer.tsx]
- "knowledge_pastbidprofilemodal_pastbidprofilemodalprops": "PastBidProfileModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidProfileModal.tsx:L9 | neighbors=[PastBidProfileModal.tsx]
- "knowledge_qualificationcategoryinput_qualificationcategoryinputprops": "QualificationCategoryInputProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationCategoryInput.tsx:L10 | neighbors=[QualificationCategoryInput.tsx]
- "knowledge_qualificationentrydrawer_bycompleteddesc": "byCompletedDesc()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationEntryDrawer.tsx:L38 | neighbors=[QualificationEntryDrawer.tsx]
- "knowledge_qualificationentrydrawer_iscompleted": "isCompleted()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationEntryDrawer.tsx:L36 | neighbors=[QualificationEntryDrawer.tsx]
- "knowledge_qualificationentrydrawer_qualificationentrydrawerprops": "QualificationEntryDrawerProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationEntryDrawer.tsx:L24 | neighbors=[QualificationEntryDrawer.tsx]
- "knowledge_qualificationentrydrawer_usagelist": "UsageList()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationEntryDrawer.tsx:L44 | neighbors=[QualificationEntryDrawer.tsx]
- "knowledge_qualificationentrymodal_qualificationentrymodalprops": "QualificationEntryModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationEntryModal.tsx:L14 | neighbors=[QualificationEntryModal.tsx]
- "knowledge_qualificationlibraryview_qualificationlibraryviewprops": "QualificationLibraryViewProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationLibraryView.tsx:L43 | neighbors=[QualificationLibraryView.tsx]
- "knowledge_qualificationtablemodal_autogrow": "autoGrow()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L135 | neighbors=[QualificationTableModal.tsx]
- "knowledge_qualificationtablemodal_isblank": "isBlank()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L98 | neighbors=[QualificationTableModal.tsx]
- "knowledge_qualificationtablemodal_itablemeta": "ITableMeta" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L53 | neighbors=[QualificationTableModal.tsx]
- "knowledge_qualificationtablemodal_newrow": "newRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L60 | neighbors=[QualificationTableModal.tsx]
- "knowledge_qualificationtablemodal_parsepastedrows": "parsePastedRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L105 | neighbors=[QualificationTableModal.tsx]
- "knowledge_qualificationtablemodal_qualificationtablemodalprops": "QualificationTableModalProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L41 | neighbors=[QualificationTableModal.tsx]
- "knowledge_qualificationtablemodal_todraftrows": "toDraftRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationTableModal.tsx:L69 | neighbors=[QualificationTableModal.tsx]
- "layout_applayout_requireengineering": "RequireEngineering()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/AppLayout.tsx:L70 | neighbors=[AppLayout.tsx]
- "layout_commandpalette_icommanditem": "ICommandItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/CommandPalette.tsx:L16 | neighbors=[CommandPalette.tsx]
- "layout_footer_oiibluelogo": "oiiBlueLogo" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L7 | neighbors=[Footer.tsx]
- "layout_footer_oiiwhitelogo": "oiiWhiteLogo" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L8 | neighbors=[Footer.tsx]
- "layout_footer_smartbidicon": "smartBidIcon" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L9 | neighbors=[Footer.tsx]
- "layout_footer_smartbidicondark": "smartBidIconDark" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L10 | neighbors=[Footer.tsx]
- "layout_livepulse_anchor": "Anchor" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L37 | neighbors=[LivePulse.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-068.json

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
