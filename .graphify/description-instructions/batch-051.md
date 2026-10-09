# Node Description Batch 52 of 86

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

- "utils_ernhelpers_isernonhold": "isErnOnHold()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L171 | neighbors=[ernHelpers.ts, getErnDeadlineState()]
- "utils_ernhelpers_resolveernprojectnumber": "resolveErnProjectNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L138 | neighbors=[ErnCreateModal.tsx, ernHelpers.ts]
- "utils_exporthelpers_bidtoexportrow": "bidToExportRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L15 | neighbors=[ExportService.ts, exportHelpers.ts]
- "utils_exporthelpers_zeropad": "zeroPad()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/exportHelpers.ts:L7 | neighbors=[exportHelpers.ts, getExportFilename()]
- "utils_kpihelpers_average": "average()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L300 | neighbors=[kpiHelpers.ts, computeCycleByPriority()]
- "utils_kpihelpers_cyclesummary": "CycleSummary" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L292 | neighbors=[DashboardKPIRow.tsx, kpiHelpers.ts]
- "utils_kpihelpers_getcyclebusinessdays": "getCycleBusinessDays()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L278 | neighbors=[kpiHelpers.ts, getFirstDeliveryDate()]
- "utils_kpihelpers_isfirstpassapproved": "isFirstPassApproved()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L187 | neighbors=[kpiHelpers.ts, getOtif()]
- "utils_kpihelpers_otifstat": "OtifStat" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L255 | neighbors=[kpiHelpers.ts, RateStat]
- "utils_notificationevents_fmtdate": "fmtDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L40 | neighbors=[notificationEvents.ts, deriveBidNotifications()]
- "utils_notificationevents_getclosingeventkey": "getClosingEventKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L61 | neighbors=[notificationEvents.ts, deriveBidNotifications()]
- "utils_notificationevents_getnewactivityentries": "getNewActivityEntries()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L68 | neighbors=[notificationEvents.ts, deriveBidNotifications()]
- "utils_notificationevents_inotificationevent": "INotificationEvent" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L26 | neighbors=[NotificationDispatchService.ts, notificationEvents.ts]
- "utils_notificationevents_inotificationfact": "INotificationFact" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L15 | neighbors=[NotificationDispatchService.ts, notificationEvents.ts]
- "utils_notificationevents_inotificationpresentation": "INotificationPresentation" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L20 | neighbors=[NotificationDispatchService.ts, notificationEvents.ts]
- "utils_notificationevents_iscanceledstatus": "isCanceledStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L54 | neighbors=[notificationEvents.ts, deriveBidNotifications()]
- "utils_notificationevents_meta": "meta()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L80 | neighbors=[notificationEvents.ts, deriveBidNotifications()]
- "utils_pastbiddocument_clarifications": "clarifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L792 | neighbors=[pastBidDocument.ts, heading()]
- "utils_pastbiddocument_inlibrary": "inLibrary()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L784 | neighbors=[pastBidDocument.ts, clean()]
- "utils_pastbiddocument_linelabel": "lineLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L168 | neighbors=[pastBidDocument.ts, clean()]
- "utils_pastbiddocument_names": "names()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L97 | neighbors=[pastBidDocument.ts, identification()]
- "utils_pastbidhelpers_lowerset": "lowerSet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L142 | neighbors=[pastBidHelpers.ts, findRelatedBids()]
- "utils_pastbidhelpers_subtypes": "subTypes()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L151 | neighbors=[pastBidHelpers.ts, findRelatedBids()]
- "utils_pastbidledger_clean": "clean()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L114 | neighbors=[pastBidLedger.ts, ledgerRow()]
- "utils_pastbidledger_countby": "countBy()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L143 | neighbors=[pastBidLedger.ts, buildPastBidChatContext()]
- "utils_phasehelpers_closelastopen": "closeLastOpen()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L97 | neighbors=[phaseHelpers.ts, buildHistoryTransition()]
- "utils_phasehelpers_getphaselabelforbid": "getPhaseLabelForBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L87 | neighbors=[OverviewTab.tsx, phaseHelpers.ts]
- "utils_qualificationhelpers_buildqualificationtablechanges": "buildQualificationTableChanges()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L280 | neighbors=[QualificationTableModal.tsx, qualificationHelpers.ts]
- "utils_qualificationhelpers_iqualificationtabledraftrow": "IQualificationTableDraftRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L246 | neighbors=[QualificationTableModal.tsx, qualificationHelpers.ts]
- "utils_qualificationhelpers_iqualificationusage": "IQualificationUsage" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L326 | neighbors=[QualificationEntryDrawer.tsx, qualificationHelpers.ts]
- "utils_qualificationhelpers_mergequalificationsintotables": "mergeQualificationsIntoTables()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L73 | neighbors=[QualificationsTab.tsx, qualificationHelpers.ts]
- "utils_qualificationhelpers_nextitemnumber": "nextItemNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L38 | neighbors=[qualificationHelpers.ts, upsertQualificationItem()]
- "utils_qualificationhelpers_qualificationlibraryusage": "qualificationLibraryUsage()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L333 | neighbors=[QualificationEntryDrawer.tsx, qualificationHelpers.ts]
- "utils_qualificationhelpers_removescopequalifications": "removeScopeQualifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L123 | neighbors=[BidDetailPage.tsx, qualificationHelpers.ts]
- "utils_reporthelpers_bidtablerow": "BidTableRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L344 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_bidtablerows": "bidTableRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L358 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_bycommercialrequester": "byCommercialRequester()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L248 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_clientperformancebydivision": "clientPerformanceByDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L276 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_clientperfrow": "ClientPerfRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L261 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]
- "utils_reporthelpers_divisioncounts": "divisionCounts()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/reportHelpers.ts:L85 | neighbors=[PeriodPerformancePage.tsx, reportHelpers.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-051.json

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
