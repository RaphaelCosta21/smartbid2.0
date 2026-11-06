# Node Description Batch 63 of 102

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

- "utils_qualificationhelpers_mergequalificationsintotables": "mergeQualificationsIntoTables()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L73 | neighbors=[QualificationsTab.tsx, qualificationHelpers.ts]
- "utils_qualificationhelpers_nextitemnumber": "nextItemNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L38 | neighbors=[qualificationHelpers.ts, upsertQualificationItem()]
- "utils_qualificationhelpers_qualificationlibraryusage": "qualificationLibraryUsage()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L333 | neighbors=[QualificationEntryDrawer.tsx, qualificationHelpers.ts]
- "utils_qualificationhelpers_removescopequalifications": "removeScopeQualifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L123 | neighbors=[BidDetailPage.tsx, qualificationHelpers.ts]
- "utils_quotationlinks_findlowestlinkid": "findLowestLinkId()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L301 | neighbors=[quotationLinks.ts, buildSupplierQuoteBars()]
- "utils_quotationlinks_getpricelockreason": "getPriceLockReason()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L218 | neighbors=[AssetsBreakdownTab.tsx, quotationLinks.ts]
- "utils_quotationlinks_indexquotations": "indexQuotations()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L127 | neighbors=[AssetsBreakdownTab.tsx, quotationLinks.ts]
- "utils_quotationlinks_iresolvedquotationlink": "IResolvedQuotationLink" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L19 | neighbors=[LinkedQuotationsPanel.tsx, quotationLinks.ts]
- "utils_quotationlinks_isupplierquotebar": "ISupplierQuoteBar" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L26 | neighbors=[SupplierQuoteBars.tsx, quotationLinks.ts]
- "utils_quotationlinks_norm": "norm()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L135 | neighbors=[quotationLinks.ts, buildLegacyLink()]
- "utils_quotationlinks_removelink": "removeLink()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L319 | neighbors=[AssetsBreakdownTab.tsx, quotationLinks.ts]
- "utils_quotationlinks_resolvelinks": "resolveLinks()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L184 | neighbors=[LinkedQuotationsPanel.tsx, quotationLinks.ts]
- "utils_quotationlinks_selectlink": "selectLink()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L312 | neighbors=[AssetsBreakdownTab.tsx, quotationLinks.ts]
- "utils_reporthelpers_bidtablerow": "BidTableRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L344 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_bidtablerows": "bidTableRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L358 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_bycommercialrequester": "byCommercialRequester()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L248 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_clientperformancebydivision": "clientPerformanceByDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L276 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_clientperfrow": "ClientPerfRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L261 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_divisioncounts": "divisionCounts()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L85 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_getresultstatus": "getResultStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L34 | neighbors=[useResultStatus.ts, reportHelpers.ts]
- "utils_reporthelpers_monthlystatusstacked": "monthlyStatusStacked()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L128 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_servicelinecounts": "serviceLineCounts()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L103 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_statusbyclient": "statusByClient()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L166 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_statuscounts": "statusCounts()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L60 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_winratebyclient": "winRateByClient()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L203 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_revisionhelpers_detectrevisionchanges": "detectRevisionChanges()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L33 | neighbors=[BidDetailPage.tsx, revisionHelpers.ts]
- "utils_revisionhelpers_getsectionfrompatch": "getSectionFromPatch()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L552 | neighbors=[BidDetailPage.tsx, revisionHelpers.ts]
- "utils_statushelpers_getactivestatuses": "getActiveStatuses()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L90 | neighbors=[FlowBoardPage.tsx, statusHelpers.ts]
- "utils_statushelpers_getstatuscolor": "getStatusColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L44 | neighbors=[statusHelpers.ts, getStatusDef()]
- "utils_statushelpers_getstatusorder": "getStatusOrder()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L63 | neighbors=[statusHelpers.ts, getStatusDef()]
- "utils_statushelpers_getterminalstatuses": "getTerminalStatuses()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L109 | neighbors=[BidResultsPage.tsx, statusHelpers.ts]
- "utils_suppliermatching_totradename": "toTradeName()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L74 | neighbors=[SuppliersRegistry.tsx, supplierMatching.ts]
- "utils_supplierprofile_getsupplycategories": "getSupplyCategories()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierProfile.ts:L63 | neighbors=[SuppliersRegistry.tsx, supplierProfile.ts]
- "utils_supplierprofile_websitedomains": "websiteDomains()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierProfile.ts:L79 | neighbors=[supplierProfile.ts, buildSupplierProfileText()]
- "utils_surveybidintel_median": "median()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidIntel.ts:L9 | neighbors=[surveyBidIntel.ts, computeSurveyBidIntel()]
- "utils_surveybidintel_norm": "norm()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidIntel.ts:L7 | neighbors=[surveyBidIntel.ts, computeSurveyBidIntel()]
- "utils_surveybidintel_percentile": "percentile()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidIntel.ts:L16 | neighbors=[surveyBidIntel.ts, computeSurveyBidIntel()]
- "utils_surveybidmatch_matchbidequipment": "matchBidEquipment()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyBidMatch.ts:L22 | neighbors=[useSurveyPortal.ts, surveyBidMatch.ts]
- "utils_surveydatajourney_compose": "compose()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L118 | neighbors=[surveyDataJourney.ts, buildDataJourney()]
- "utils_surveydatajourney_ijourneycontext": "IJourneyContext" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L98 | neighbors=[SurveySystemPage.tsx, surveyDataJourney.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-062.json

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
