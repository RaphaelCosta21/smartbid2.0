# Node Description Batch 42 of 102

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

- "utils_quotationlinks_adddaysiso": "addDaysIso()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L47 | neighbors=[LinkedQuotationsPanel.tsx, quotationLinks.ts, buildRequestLink()]
- "utils_quotationlinks_buildlegacylink": "buildLegacyLink()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L142 | neighbors=[quotationLinks.ts, norm(), getEffectiveLinks()]
- "utils_quotationlinks_buildreceivedlink": "buildReceivedLink()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L109 | neighbors=[AssetsBreakdownTab.tsx, quotationLinks.ts, todayIso()]
- "utils_quotationlinks_buildrequestlink": "buildRequestLink()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L86 | neighbors=[AssetsBreakdownTab.tsx, quotationLinks.ts, addDaysIso()]
- "utils_quotationlinks_buildsupplierquotebars": "buildSupplierQuoteBars()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L269 | neighbors=[LinkedQuotationsPanel.tsx, quotationLinks.ts, findLowestLinkId()]
- "utils_quotationlinks_getbiddisplaycurrency": "getBidDisplayCurrency()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L256 | neighbors=[BidComparatorPage.tsx, BidDetailPage.tsx, quotationLinks.ts]
- "utils_quotationlinks_getquotecomparableusd": "getQuoteComparableUSD()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L205 | neighbors=[QuotationControlPanel.tsx, quotationLinks.ts, getQuoteUnitUSD()]
- "utils_quotationlinks_getresponsedays": "getResponseDays()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/quotationLinks.ts:L65 | neighbors=[LinkedQuotationsPanel.tsx, QuotationControlPanel.tsx, quotationLinks.ts]
- "utils_reporthelpers_statusoption": "StatusOption" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L9 | neighbors=[useResultStatus.ts, PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_revisionhelpers_appendrevisionchanges": "appendRevisionChanges()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L574 | neighbors=[BidDetailPage.tsx, revisionHelpers.ts, buildDueDateChangePatch()]
- "utils_revisionhelpers_buildduedatechangepatch": "buildDueDateChangePatch()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/revisionHelpers.ts:L591 | neighbors=[OverviewTab.tsx, revisionHelpers.ts, appendRevisionChanges()]
- "utils_scopehelpers_ispartnumbermarker": "isPartNumberMarker()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/scopeHelpers.ts:L19 | neighbors=[CostSearchModal.tsx, PartNumberAutocomplete.tsx, scopeHelpers.ts]
- "utils_statushelpers_getdivisioncolor": "getDivisionColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L139 | neighbors=[BidBoardPage.tsx, FlowBoardPage.tsx, statusHelpers.ts]
- "utils_suppliermatching_buildsupplierkeyindex": "buildSupplierKeyIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L195 | neighbors=[SuppliersRegistry.tsx, supplierMatching.ts, supplierProfile.ts]
- "utils_suppliermatching_loosetext": "looseText()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L42 | neighbors=[supplierMatching.ts, rankSupplierSuggestions(), supplierTokens()]
- "utils_suppliermatching_ranksuppliersuggestions": "rankSupplierSuggestions()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L157 | neighbors=[SupplierCombobox.tsx, supplierMatching.ts, looseText()]
- "utils_supplierprofile_buildsupplierprofiletext": "buildSupplierProfileText()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierProfile.ts:L99 | neighbors=[useSupplierStore.ts, supplierProfile.ts, websiteDomains()]
- "utils_supplierprofile_groupquotationsbysupplier": "groupQuotationsBySupplier()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierProfile.ts:L43 | neighbors=[SuppliersRegistry.tsx, useSupplierStore.ts, supplierProfile.ts]
- "utils_supplierprofile_resolveservicetypes": "resolveServiceTypes()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierProfile.ts:L34 | neighbors=[useSupplierServiceTypes.ts, useSupplierStore.ts, supplierProfile.ts]
- "utils_surveydatajourney_listjourneys": "listJourneys()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L478 | neighbors=[SurveySystemPage.tsx, surveyDataJourney.ts, isSourceRole()]
- "utils_surveydatajourney_toformat": "toFormat()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L132 | neighbors=[surveyDataJourney.ts, buildDataJourney(), uniq()]
- "utils_surveydatajourney_uniq": "uniq()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L144 | neighbors=[surveyDataJourney.ts, buildDataJourney(), toFormat()]
- "utils_surveyfailure_computefailureimpact": "computeFailureImpact()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyFailure.ts:L48 | neighbors=[SurveySystemPage.tsx, surveyFailure.ts, pushUnique()]
- "utils_surveyfailure_ifailureimpact": "IFailureImpact" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyFailure.ts:L10 | neighbors=[SurveySystemPage.tsx, SurveyFailurePanel.tsx, surveyFailure.ts]
- "utils_surveyglossary_fold": "fold()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L59 | neighbors=[surveyGlossary.ts, scanGlossary(), searchGlossary()]
- "utils_surveyglossary_searchglossary": "searchGlossary()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L161 | neighbors=[SurveyGlossary.tsx, surveyGlossary.ts, fold()]
- "utils_surveyglossary_splitbyglossary": "splitByGlossary()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyGlossary.ts:L143 | neighbors=[GlossaryText.tsx, surveyGlossary.ts, scanGlossary()]
- "utils_surveypackage_buildscopeitemsfrompackage": "buildScopeItemsFromPackage()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyPackage.ts:L9 | neighbors=[CreateRequestPage.tsx, SurveyPackageDrawer.tsx, surveyPackage.ts]
- "utils_surveypackages_packagesof": "packagesOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyPackages.ts:L22 | neighbors=[SurveyPortalHeader.tsx, surveyPackages.ts, resolveActiveSpread()]
- "utils_surveyspreadgraph_catalognodes": "catalogNodes()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L166 | neighbors=[SurveySystemPage.tsx, surveyFreeScene.ts, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_expandspreadnodes": "expandSpreadNodes()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L56 | neighbors=[SurveySystemPage.tsx, surveyFreeScene.ts, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_idatalineage": "IDataLineage" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L375 | neighbors=[SurveySystemPage.tsx, SurveyEquipmentDetail.tsx, surveySpreadGraph.ts]
- "utils_surveyspreadgraph_reachabletohub": "reachableToHub()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L308 | neighbors=[surveyFailure.ts, surveySpreadGraph.ts, buildAdjacency()]
- "utils_surveyspreadgraph_tracedatalineage": "traceDataLineage()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L461 | neighbors=[SurveySystemPage.tsx, surveySpreadGraph.ts, baseId()]
- "utils_textsimilarity_similarityatleast": "similarityAtLeast()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/textSimilarity.ts:L57 | neighbors=[bidComparator.ts, textSimilarity.ts, boundedLevenshtein()]
- "utils_validators_validatemaxlength": "validateMaxLength()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L52 | neighbors=[AddQuotationModal.tsx, QuotationsPage.tsx, validators.ts]
- "utils_winprobability_buildwinrateindex": "buildWinRateIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L63 | neighbors=[DashboardPage.tsx, FollowUpPage.tsx, winProbability.ts]
- "vendor_easimodulescss": "easiModulesCss.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/vendor/easiModulesCss.ts:L1 | neighbors=[3f57ca9 merge: integrate EASI module pa…, 6d20432 feat: adiciona paginas EASI ao …, SmartBid20WebPart.ts]
- "bid_addquotationmodal_genid": "genId()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L39 | neighbors=[AddQuotationModal.tsx, blankLineItem()]
- "bid_addquotationmodal_ilineitem": "ILineItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L43 | neighbors=[AddQuotationModal.tsx, IQuotationLineDraft]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-041.json

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
