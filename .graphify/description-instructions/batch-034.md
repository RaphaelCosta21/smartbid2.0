# Node Description Batch 35 of 86

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

- "utils_kpihelpers_computeontimedelivery": "computeOnTimeDelivery()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L165 | neighbors=[DashboardPage.tsx, kpiHelpers.ts, toRate()]
- "utils_kpihelpers_computeotif": "computeOtif()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L259 | neighbors=[OperationalSummaryPage.tsx, kpiHelpers.ts, toRate()]
- "utils_kpihelpers_cycletargettone": "cycleTargetTone()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L344 | neighbors=[DashboardKPIRow.tsx, OperationalSummaryPage.tsx, kpiHelpers.ts]
- "utils_kpihelpers_formattarget": "formatTarget()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L118 | neighbors=[DashboardKPIRow.tsx, OperationalSummaryPage.tsx, kpiHelpers.ts]
- "utils_kpihelpers_getpriorityrangelabels": "getPriorityRangeLabels()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L88 | neighbors=[DashboardPage.tsx, SystemConfiguration.tsx, kpiHelpers.ts]
- "utils_kpihelpers_isdeliveredontime": "isDeliveredOnTime()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L157 | neighbors=[kpiHelpers.ts, getOtif(), getFirstDeliveryDate()]
- "utils_kpihelpers_num": "num()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L18 | neighbors=[kpiHelpers.ts, resolveKpiTargets(), resolvePriorityRules()]
- "utils_kpihelpers_ratestat": "RateStat" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L126 | neighbors=[DashboardKPIRow.tsx, kpiHelpers.ts, OtifStat]
- "utils_kpihelpers_validatepriorityrules": "validatePriorityRules()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L54 | neighbors=[SystemConfiguration.tsx, kpiHelpers.ts, resolvePriorityRules()]
- "utils_partphoto_getpartphotourl": "getPartPhotoUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/partPhoto.ts:L4 | neighbors=[AddFavoriteEquipmentModal.tsx, FavoritesPage.tsx, partPhoto.ts]
- "utils_pastbiddocument_buildpastbidaidigest": "buildPastBidAiDigest()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L1036 | neighbors=[PastBidKnowledgeService.ts, pastBidDocument.ts, buildPastBidDocument()]
- "utils_pastbiddocument_buildpastbidfilename": "buildPastBidFileName()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L161 | neighbors=[PastBidKnowledgeService.ts, pastBidDocument.ts, clean()]
- "utils_pastbiddocument_description": "description()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L277 | neighbors=[pastBidDocument.ts, heading(), richText()]
- "utils_pastbiddocument_libraryreference": "libraryReference()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L872 | neighbors=[pastBidDocument.ts, heading(), lines()]
- "utils_pastbiddocument_money": "money()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L84 | neighbors=[pastBidDocument.ts, amount(), outcome()]
- "utils_pastbiddocument_qualifications": "qualifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L821 | neighbors=[pastBidDocument.ts, heading(), lines()]
- "utils_pastbiddocument_richtext": "richText()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L52 | neighbors=[pastBidDocument.ts, buildPastBidDocument(), description()]
- "utils_pastbiddocument_scopelines": "scopeLines()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L150 | neighbors=[pastBidDocument.ts, classification(), derivePastBidTags()]
- "utils_pastbiddocument_scopeofsupply": "scopeOfSupply()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L363 | neighbors=[pastBidDocument.ts, heading(), record()]
- "utils_pastbiddocument_subitemline": "subItemLine()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L294 | neighbors=[pastBidDocument.ts, clean(), record()]
- "utils_pastbidhelpers_past_bid_kb_status_labels": "PAST_BID_KB_STATUS_LABELS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L12 | neighbors=[PastBidBadges.tsx, PastBidsPage.tsx, pastBidHelpers.ts]
- "utils_pastbidhelpers_pastbidkbstatus": "PastBidKbStatus" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L8 | neighbors=[PastBidBadges.tsx, PastBidsPage.tsx, pastBidHelpers.ts]
- "utils_pastbidhelpers_tofilteroptions": "toFilterOptions()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L66 | neighbors=[FavoritesPage.tsx, PastBidsPage.tsx, pastBidHelpers.ts]
- "utils_pastbidledger_day": "day()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L109 | neighbors=[pastBidLedger.ts, buildPastBidChatContext(), ledgerRow()]
- "utils_pastbidledger_hasintent": "hasIntent()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L102 | neighbors=[pastBidLedger.ts, buildPastBidChatContext(), tokens()]
- "utils_pastbidledger_ledgerrow": "ledgerRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L118 | neighbors=[pastBidLedger.ts, clean(), day()]
- "utils_pastbidledger_questionterms": "questionTerms()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L74 | neighbors=[pastBidLedger.ts, buildPastBidChatContext(), tokens()]
- "utils_pastbidledger_questionyears": "questionYears()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L87 | neighbors=[pastBidLedger.ts, buildPastBidChatContext(), tokens()]
- "utils_qualificationhelpers_buildqualificationlibraryrowsfrombid": "buildQualificationLibraryRowsFromBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L162 | neighbors=[useClarificationLibrarySync.ts, qualificationHelpers.ts, normalizeQualificationTables()]
- "utils_qualificationhelpers_findscopequalification": "findScopeQualification()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L133 | neighbors=[ScopeOfSupplyTab.tsx, BidDetailPage.tsx, qualificationHelpers.ts]
- "utils_qualificationhelpers_iqualificationdraft": "IQualificationDraft" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L16 | neighbors=[ImportQualificationModal.tsx, QualificationsTab.tsx, qualificationHelpers.ts]
- "utils_qualificationhelpers_ismanualqualificationtablekey": "isManualQualificationTableKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L207 | neighbors=[QualificationTableModal.tsx, qualificationHelpers.ts, findManualQualificationTableKey()]
- "utils_qualificationhelpers_newmanualqualificationtablekey": "newManualQualificationTableKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L203 | neighbors=[QualificationLibraryView.tsx, QualificationTableModal.tsx, qualificationHelpers.ts]
- "utils_qualificationhelpers_nextlibraryitemorder": "nextLibraryItemOrder()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L222 | neighbors=[QualificationLibraryView.tsx, QualificationTableModal.tsx, qualificationHelpers.ts]
- "utils_reporthelpers_statusoption": "StatusOption" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L9 | neighbors=[useResultStatus.ts, PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_revisionhelpers_appendrevisionchanges": "appendRevisionChanges()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L565 | neighbors=[BidDetailPage.tsx, revisionHelpers.ts, buildDueDateChangePatch()]
- "utils_revisionhelpers_buildduedatechangepatch": "buildDueDateChangePatch()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L582 | neighbors=[OverviewTab.tsx, revisionHelpers.ts, appendRevisionChanges()]
- "utils_scopehelpers_ispartnumbermarker": "isPartNumberMarker()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/scopeHelpers.ts:L19 | neighbors=[CostSearchModal.tsx, PartNumberAutocomplete.tsx, scopeHelpers.ts]
- "utils_statushelpers_getdivisioncolor": "getDivisionColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L139 | neighbors=[BidBoardPage.tsx, FlowBoardPage.tsx, statusHelpers.ts]
- "utils_suppliermatching_buildsupplierkeyindex": "buildSupplierKeyIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L195 | neighbors=[SuppliersRegistry.tsx, supplierMatching.ts, supplierProfile.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-034.json

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
