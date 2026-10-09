# Node Description Batch 27 of 86

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

- "utils_pastbidhelpers_findrelatedbids": "findRelatedBids()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L160 | neighbors=[PastBidDrawer.tsx, pastBidHelpers.ts, lowerSet(), subTypes()]
- "utils_pastbidhelpers_getpastbidkbstatus": "getPastBidKbStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L18 | neighbors=[PastBidDrawer.tsx, pastBidHelpers.ts, toPastBidRow(), pastBidLedger.ts]
- "utils_pastbidhelpers_getpastbidsearchtext": "getPastBidSearchText()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L84 | neighbors=[pastBidHelpers.ts, normalizeText(), toPastBidRow(), pastBidLedger.ts]
- "utils_pastbidhelpers_ipastbidrow": "IPastBidRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L25 | neighbors=[PastBidCard.tsx, FavoritesPage.tsx, PastBidsPage.tsx, pastBidHelpers.ts]
- "utils_pastbidhelpers_matchesanyof": "matchesAnyOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L61 | neighbors=[FavoritesPage.tsx, PastBidsPage.tsx, SuppliersRegistry.tsx, pastBidHelpers.ts]
- "utils_pastbidledger_tokens": "tokens()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L66 | neighbors=[pastBidLedger.ts, hasIntent(), questionTerms(), questionYears()]
- "utils_pdfexport_captureelementtopng": "captureElementToPng()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L34 | neighbors=[BidDetailsReportPage.tsx, PeriodPerformancePage.tsx, pdfExport.ts, OperationalSummaryPage.tsx]
- "utils_phasehelpers_buildhistorytransition": "buildHistoryTransition()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L108 | neighbors=[ApprovalTab.tsx, approvalHelpers.ts, phaseHelpers.ts, closeLastOpen()]
- "utils_qualificationhelpers_findqualificationtable": "findQualificationTable()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L28 | neighbors=[QualificationSuggestionsModal.tsx, qualificationHelpers.ts, qualificationTableKey(), upsertQualificationItem()]
- "utils_qualificationhelpers_qualificationcategoryvalue": "qualificationCategoryValue()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L145 | neighbors=[QualificationsTab.tsx, QualificationCategoryInput.tsx, QualificationTableModal.tsx, qualificationHelpers.ts]
- "utils_qualificationhelpers_qualificationlibrarytablerows": "qualificationLibraryTableRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L212 | neighbors=[QualificationEntryDrawer.tsx, QualificationLibraryView.tsx, QualificationTableModal.tsx, qualificationHelpers.ts]
- "utils_qualificationhelpers_upsertqualificationitem": "upsertQualificationItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L99 | neighbors=[BidDetailPage.tsx, qualificationHelpers.ts, findQualificationTable(), nextItemNumber()]
- "utils_statushelpers_getstatusdef": "getStatusDef()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L7 | neighbors=[statusHelpers.ts, getStatusColor(), getStatusOrder(), isTerminalStatus()]
- "utils_suppliermatching_canonicalsuppliername": "canonicalSupplierName()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L113 | neighbors=[AddQuotationModal.tsx, QuotationsPage.tsx, supplierMatching.ts, findSupplierMatch()]
- "utils_suppliermatching_findpossiblematch": "findPossibleMatch()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L125 | neighbors=[SupplierCombobox.tsx, SuppliersRegistry.tsx, supplierMatching.ts, supplierTokens()]
- "utils_suppliermatching_suppliertokens": "supplierTokens()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L50 | neighbors=[supplierMatching.ts, findPossibleMatch(), normalizeSupplierName(), looseText()]
- "utils_surveyspreadgraph_tracesignalpath": "traceSignalPath()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L215 | neighbors=[SurveySystemPage.tsx, surveySpreadGraph.ts, baseId(), shortestPath()]
- "utils_technicalproposalhelpers_gettechnicalproposalstate": "getTechnicalProposalState()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/technicalProposalHelpers.ts:L43 | neighbors=[DocumentsTab.tsx, OverviewTab.tsx, technicalProposalHelpers.ts, getTechnicalProposalAttachment()]
- "utils_winprobability_getwinprobability": "getWinProbability()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L114 | neighbors=[EngHoursOutlook.tsx, FollowUpPage.tsx, winProbability.ts, getHistoricalWinProbability()]
- "approval_approvaloverridebanner_approvaloverridebanner": "ApprovalOverrideBanner()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalOverrideBanner.tsx:L17 | neighbors=[ApprovalOverrideBanner.tsx, ApprovalTab.tsx, OverviewTab.tsx]
- "bid_addquotationmodal_blanklineitem": "blankLineItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L47 | neighbors=[AddQuotationModal.tsx, AddQuotationModal(), genId()]
- "bid_assetsbreakdowntab_assetsbreakdowntab": "AssetsBreakdownTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L271 | neighbors=[AssetsBreakdownTab.tsx, BidDetailPage.tsx, fmtCost()]
- "bid_bidcard_bidcard": "BidCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidCard.tsx:L25 | neighbors=[BidCard.tsx, BidTrackerPage.tsx, FavoritesPage.tsx]
- "bid_bidexporttab_bidexporttab": "BidExportTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidExportTab.tsx:L91 | neighbors=[BidExportTab.tsx, plural(), BidDetailPage.tsx]
- "bid_bidhourstable_bidhourstable": "BidHoursTable()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L84 | neighbors=[BidHoursTable.tsx, BidDetailPage.tsx, TemplateEditor.tsx]
- "bid_bidtabheader_isharesegment": "IShareSegment" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTabHeader.tsx:L181 | neighbors=[BidTabHeader.tsx, LogisticsBreakdownTab.tsx, ScopeOfSupplyTab.tsx]
- "bid_bidtimeline_bidtimeline": "BidTimeline()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTimeline.tsx:L70 | neighbors=[BidTimeline.tsx, useLiveElapsed(), BidDetailPage.tsx]
- "bid_clarificationsuggestionsmodal_clarificationsuggestionsmodal": "ClarificationSuggestionsModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ClarificationSuggestionsModal.tsx:L19 | neighbors=[ClarificationSuggestionsModal.tsx, QualificationsTab.tsx, BidDetailPage.tsx]
- "bid_confidentialaccessmodal_confidentialaccessmodal": "ConfidentialAccessModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ConfidentialAccessModal.tsx:L65 | neighbors=[BidConfidentialButton.tsx, ConfidentialAccessModal.tsx, keyOf()]
- "bid_documentstab_documentstab": "DocumentsTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/DocumentsTab.tsx:L34 | neighbors=[DocumentsTab.tsx, isLocalUrl(), BidDetailPage.tsx]
- "bid_duedatechangemodal_duedatechangemodal": "DueDateChangeModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/DueDateChangeModal.tsx:L31 | neighbors=[DueDateChangeModal.tsx, toInputDate(), OverviewTab.tsx]
- "bid_equipmentimportmodal_iimportpick": "IImportPick" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L38 | neighbors=[EquipmentImportModal.tsx, ScopeOfSupplyTab.tsx, AddFavoriteEquipmentModal.tsx]
- "bid_equipmentimportmodal_scansource": "scanSource()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L391 | neighbors=[EquipmentImportModal.tsx, matchesWords(), searchAllSources()]
- "bid_equipmentimportmodal_searchallsources": "searchAllSources()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L419 | neighbors=[EquipmentImportModal.tsx, scanSource(), searchQueryViews()]
- "bid_erncreatemodal_erncreatemodal": "ErnCreateModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnCreateModal.tsx:L45 | neighbors=[ErnCreateModal.tsx, OverviewTab.tsx, UnassignedRequestsPage.tsx]
- "bid_erndetailsmodal_erndetailsmodal": "ErnDetailsModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnDetailsModal.tsx:L25 | neighbors=[ErnDetailsModal.tsx, withDate(), OverviewTab.tsx]
- "bid_qualificationgrouplist_iqualificationpickgroup": "IQualificationPickGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationGroupList.tsx:L15 | neighbors=[ImportQualificationModal.tsx, QualificationGroupList.tsx, QualificationSuggestionsModal.tsx]
- "bid_qualificationgrouplist_qualificationgrouplist": "QualificationGroupList()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationGroupList.tsx:L30 | neighbors=[ImportQualificationModal.tsx, QualificationGroupList.tsx, QualificationSuggestionsModal.tsx]
- "bid_revisionstab_getactiverevision": "getActiveRevision()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L41 | neighbors=[DueDateChangeModal.tsx, RevisionsTab.tsx, RevisionsTab()]
- "bid_revisionstab_getrevisionletter": "getRevisionLetter()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L19 | neighbors=[BidStatusPhasePanel.tsx, RevisionsTab.tsx, RevisionsTab()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-026.json

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
