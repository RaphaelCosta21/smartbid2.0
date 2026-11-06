# Node Description Batch 62 of 102

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

- "utils_kpihelpers_getcyclebusinessdays": "getCycleBusinessDays()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L278 | neighbors=[kpiHelpers.ts, getFirstDeliveryDate()]
- "utils_kpihelpers_isfirstpassapproved": "isFirstPassApproved()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L187 | neighbors=[kpiHelpers.ts, getOtif()]
- "utils_kpihelpers_otifstat": "OtifStat" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L255 | neighbors=[kpiHelpers.ts, RateStat]
- "utils_nmeadecode_checksumof": "checksumOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L92 | neighbors=[nmeaDecode.ts, parseNmea()]
- "utils_nmeadecode_fail": "fail()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L310 | neighbors=[nmeaDecode.ts, parseNmea()]
- "utils_nmeadecode_formatcoord": "formatCoord()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L112 | neighbors=[nmeaDecode.ts, positionItem()]
- "utils_nmeadecode_parsecoord": "parseCoord()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L100 | neighbors=[nmeaDecode.ts, positionItem()]
- "utils_nmeadecode_tagged": "tagged()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L128 | neighbors=[nmeaDecode.ts, t()]
- "utils_notificationevents_fmtdate": "fmtDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L40 | neighbors=[notificationEvents.ts, deriveBidNotifications()]
- "utils_notificationevents_getclosingeventkey": "getClosingEventKey()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L61 | neighbors=[notificationEvents.ts, deriveBidNotifications()]
- "utils_notificationevents_getnewactivityentries": "getNewActivityEntries()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L68 | neighbors=[notificationEvents.ts, deriveBidNotifications()]
- "utils_notificationevents_inotificationevent": "INotificationEvent" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L26 | neighbors=[NotificationDispatchService.ts, notificationEvents.ts]
- "utils_notificationevents_inotificationfact": "INotificationFact" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L15 | neighbors=[NotificationDispatchService.ts, notificationEvents.ts]
- "utils_notificationevents_inotificationpresentation": "INotificationPresentation" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L20 | neighbors=[NotificationDispatchService.ts, notificationEvents.ts]
- "utils_notificationevents_iscanceledstatus": "isCanceledStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L54 | neighbors=[notificationEvents.ts, deriveBidNotifications()]
- "utils_notificationevents_meta": "meta()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L80 | neighbors=[notificationEvents.ts, deriveBidNotifications()]
- "utils_pastbiddocument_clarifications": "clarifications()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L793 | neighbors=[pastBidDocument.ts, heading()]
- "utils_pastbiddocument_inlibrary": "inLibrary()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L785 | neighbors=[pastBidDocument.ts, clean()]
- "utils_pastbiddocument_linelabel": "lineLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L169 | neighbors=[pastBidDocument.ts, clean()]
- "utils_pastbiddocument_names": "names()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L98 | neighbors=[pastBidDocument.ts, identification()]
- "utils_pastbidhelpers_lowerset": "lowerSet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L142 | neighbors=[pastBidHelpers.ts, findRelatedBids()]
- "utils_pastbidhelpers_subtypes": "subTypes()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L151 | neighbors=[pastBidHelpers.ts, findRelatedBids()]
- "utils_pastbidledger_clean": "clean()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L114 | neighbors=[pastBidLedger.ts, ledgerRow()]
- "utils_pastbidledger_countby": "countBy()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidLedger.ts:L143 | neighbors=[pastBidLedger.ts, buildPastBidChatContext()]
- "utils_phasehelpers_closelastopen": "closeLastOpen()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L97 | neighbors=[phaseHelpers.ts, buildHistoryTransition()]
- "utils_phasehelpers_getphaselabelforbid": "getPhaseLabelForBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/phaseHelpers.ts:L87 | neighbors=[OverviewTab.tsx, phaseHelpers.ts]
- "utils_pricehistory_buildaccessoryrows": "buildAccessoryRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/priceHistory.ts:L84 | neighbors=[BidRankingTab.tsx, priceHistory.ts]
- "utils_pricehistory_buildlaborrows": "buildLaborRows()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/priceHistory.ts:L281 | neighbors=[LaborTab.tsx, priceHistory.ts]
- "utils_pricehistory_divergencepct": "divergencePct()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/priceHistory.ts:L251 | neighbors=[HistoryItemCard.tsx, priceHistory.ts]
- "utils_pricehistory_iaccessoryrow": "IAccessoryRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/priceHistory.ts:L73 | neighbors=[BidRankingTab.tsx, priceHistory.ts]
- "utils_pricehistory_iitemgroup": "IItemGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/priceHistory.ts:L140 | neighbors=[ItemHistoryTab.tsx, priceHistory.ts]
- "utils_pricehistory_ilaborrow": "ILaborRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/priceHistory.ts:L264 | neighbors=[LaborTab.tsx, priceHistory.ts]
- "utils_pricehistory_irankrow": "IRankRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/priceHistory.ts:L25 | neighbors=[BidRankingTab.tsx, priceHistory.ts]
- "utils_pricehistory_mean": "mean()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/priceHistory.ts:L236 | neighbors=[priceHistory.ts, computeHistoryStats()]
- "utils_pricehistory_rankbybucket": "rankByBucket()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/priceHistory.ts:L34 | neighbors=[BidRankingTab.tsx, priceHistory.ts]
- "utils_pricehistory_rankbycategory": "rankByCategory()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/priceHistory.ts:L52 | neighbors=[BidRankingTab.tsx, priceHistory.ts]
- "utils_pricehistory_searchitemgroups": "searchItemGroups()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/priceHistory.ts:L161 | neighbors=[ItemHistoryTab.tsx, priceHistory.ts]
- "utils_qualificationhelpers_buildqualificationtablechanges": "buildQualificationTableChanges()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L280 | neighbors=[QualificationTableModal.tsx, qualificationHelpers.ts]
- "utils_qualificationhelpers_iqualificationtabledraftrow": "IQualificationTableDraftRow" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L246 | neighbors=[QualificationTableModal.tsx, qualificationHelpers.ts]
- "utils_qualificationhelpers_iqualificationusage": "IQualificationUsage" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L326 | neighbors=[QualificationEntryDrawer.tsx, qualificationHelpers.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-061.json

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
