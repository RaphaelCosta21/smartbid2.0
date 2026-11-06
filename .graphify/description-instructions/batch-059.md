# Node Description Batch 60 of 102

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

- "utils_bidcomparator_sumtotals": "sumTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L186 | neighbors=[bidComparator.ts, compareBids()]
- "utils_bidcomparator_tocomparablelines": "toComparableLines()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidComparator.ts:L102 | neighbors=[bidComparator.ts, compareBids()]
- "utils_bidconfidentiality_diffpeople": "diffPeople()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L93 | neighbors=[BidConfidentialButton.tsx, bidConfidentiality.ts]
- "utils_bidconfidentiality_getbidkeypeople": "getBidKeyPeople()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L50 | neighbors=[ConfidentialAccessModal.tsx, bidConfidentiality.ts]
- "utils_bidconfidentiality_ikeyperson": "IKeyPerson" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L10 | neighbors=[bidConfidentiality.ts, IPersonRef]
- "utils_bidconfidentiality_issameperson": "isSamePerson()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L88 | neighbors=[bidConfidentiality.ts, normalizeEmail()]
- "utils_bidconfidentiality_keypeoplerole": "KeyPeopleRole" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L3 | neighbors=[ConfidentialAccessModal.tsx, bidConfidentiality.ts]
- "utils_bidhelpers_buildupcomingdeadlines": "buildUpcomingDeadlines()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L91 | neighbors=[useLiveOverview.ts, bidHelpers.ts]
- "utils_bidhelpers_getlastduedatechange": "getLastDueDateChange()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L24 | neighbors=[bidHelpers.ts, getDueFreezeDate()]
- "utils_bidpresentation_bigramsof": "bigramsOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L367 | neighbors=[bidPresentation.ts, getHistoryForQuery()]
- "utils_bidpresentation_buildhistoryindex": "buildHistoryIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L387 | neighbors=[ItemHistoryTab.tsx, bidPresentation.ts]
- "utils_bidpresentation_buildparetorows": "buildParetoRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L211 | neighbors=[BidRankingTab.tsx, bidPresentation.ts]
- "utils_bidpresentation_computestats": "computeStats()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L168 | neighbors=[BidRankingTab.tsx, bidPresentation.ts]
- "utils_bidpresentation_ihistoryentry": "IHistoryEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L306 | neighbors=[bidPresentation.ts, priceHistory.ts]
- "utils_bidpresentation_ihistoryquery": "IHistoryQuery" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L343 | neighbors=[bidPresentation.ts, priceHistory.ts]
- "utils_bidpresentation_ihistoryrecord": "IHistoryRecord" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L332 | neighbors=[HistoryItemCard.tsx, bidPresentation.ts]
- "utils_bidpresentation_iitemhistory": "IItemHistory" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L358 | neighbors=[HistoryItemCard.tsx, bidPresentation.ts]
- "utils_bidpresentation_iparetorow": "IParetoRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L200 | neighbors=[ParetoChart.tsx, bidPresentation.ts]
- "utils_bidpresentation_iscostexempt": "isCostExempt()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L65 | neighbors=[bidPresentation.ts, normalizeText()]
- "utils_bidpresentation_isvalidpn": "isValidPn()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L24 | neighbors=[bidPresentation.ts, normalizeText()]
- "utils_bidpresentation_rankitems": "rankItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidPresentation.ts:L149 | neighbors=[BidRankingTab.tsx, bidPresentation.ts]
- "utils_bomcosthelpers_bomitemstatus": "BomItemStatus" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L221 | neighbors=[bomCostHelpers.ts, bomExcelExport.ts]
- "utils_bomcosthelpers_calccontingency": "calcContingency()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L85 | neighbors=[BomCostsPage.tsx, bomCostHelpers.ts]
- "utils_bomcosthelpers_getancestorids": "getAncestorIds()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L185 | neighbors=[BomCostsPage.tsx, bomCostHelpers.ts]
- "utils_bomcosthelpers_getdescendantids": "getDescendantIds()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L167 | neighbors=[BomCostsPage.tsx, bomCostHelpers.ts]
- "utils_bomcosthelpers_getdirectchildren": "getDirectChildren()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L38 | neighbors=[bomCostHelpers.ts, isRolledUpPartial()]
- "utils_bomcosthelpers_getvisibleitems": "getVisibleItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L56 | neighbors=[BomCostsPage.tsx, bomCostHelpers.ts]
- "utils_bomcosthelpers_haschildren": "hasChildren()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L31 | neighbors=[BomCostsPage.tsx, bomCostHelpers.ts]
- "utils_bomcosthelpers_isrolleduppartial": "isRolledUpPartial()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L111 | neighbors=[bomCostHelpers.ts, getDirectChildren()]
- "utils_bomcosthelpers_reassignfindnumbers": "reassignFindNumbers()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L46 | neighbors=[BomCostsPage.tsx, bomCostHelpers.ts]
- "utils_bomcosthelpers_recalctotal": "recalcTotal()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L98 | neighbors=[BomCostsPage.tsx, bomCostHelpers.ts]
- "utils_bomcosthelpers_rollupparentcosts": "rollUpParentCosts()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomCostHelpers.ts:L128 | neighbors=[BomCostsPage.tsx, bomCostHelpers.ts]
- "utils_bomexcelexport_getbomexcelfilename": "getBomExcelFilename()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomExcelExport.ts:L68 | neighbors=[bomExcelExport.ts, exportBomCostsToExcel()]
- "utils_bomparser_parsecsvrows": "parseCSVRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L47 | neighbors=[bomParser.ts, parseBomCSV()]
- "utils_bomparser_uid": "uid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L10 | neighbors=[bomParser.ts, emptyItem()]
- "utils_clarificationchatintent_asksaboutclarifications": "asksAboutClarifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationChatIntent.ts:L12 | neighbors=[useChatStore.ts, clarificationChatIntent.ts]
- "utils_clarificationexcelexport_getclarificationexcelfilename": "getClarificationExcelFilename()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationExcelExport.ts:L39 | neighbors=[clarificationExcelExport.ts, exportClarificationsToExcel()]
- "utils_clarificationhelpers_buildlibraryrowsfrombid": "buildLibraryRowsFromBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L98 | neighbors=[useClarificationLibrarySync.ts, clarificationHelpers.ts]
- "utils_clarificationlibrarydocument_buildclarificationlibrarydocument": "buildClarificationLibraryDocument()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationLibraryDocument.ts:L103 | neighbors=[ClarificationKnowledgeService.ts, clarificationLibraryDocument.ts]
- "utils_clarificationlibrarydocument_buildclarificationlibrarymetadata": "buildClarificationLibraryMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationLibraryDocument.ts:L179 | neighbors=[ClarificationKnowledgeService.ts, clarificationLibraryDocument.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-059.json

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
