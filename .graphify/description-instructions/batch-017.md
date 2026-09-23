# Node Description Batch 18 of 43

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

- "utils_costcalculations_calculateassetsbyresourcetype": "calculateAssetsByResourceType()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L342 | neighbors=[BidCostSummary.tsx, OverviewTab.tsx, costCalculations.ts]
- "utils_costcalculations_calculatecertificationstotals": "calculateCertificationsTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L478 | neighbors=[BidCostSummary.tsx, costCalculations.ts, buildCostSummary()]
- "utils_costcalculations_calculateconsumablestotals": "calculateConsumablesTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L543 | neighbors=[BidCostSummary.tsx, costCalculations.ts, buildCostSummary()]
- "utils_costcalculations_calculatehourstotals": "calculateHoursTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L420 | neighbors=[BidCostSummary.tsx, costCalculations.ts, buildCostSummary()]
- "utils_costcalculations_calculatelogisticstotals": "calculateLogisticsTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L454 | neighbors=[BidCostSummary.tsx, costCalculations.ts, buildCostSummary()]
- "utils_costcalculations_calculatemobilizationtotals": "calculateMobilizationTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L522 | neighbors=[BidCostSummary.tsx, costCalculations.ts, buildCostSummary()]
- "utils_costcalculations_calculatertstotals": "calculateRTSTotals()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L501 | neighbors=[BidCostSummary.tsx, costCalculations.ts, buildCostSummary()]
- "utils_durationhelpers_calcdurationhours": "calcDurationHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/durationHelpers.ts:L67 | neighbors=[BidStatusPhasePanel.tsx, RevisionsTab.tsx, durationHelpers.ts]
- "utils_durationhelpers_calcelapseddays": "calcElapsedDays()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/durationHelpers.ts:L75 | neighbors=[BidStatusPhasePanel.tsx, OverviewTab.tsx, durationHelpers.ts]
- "utils_ernhelpers_geternslots": "getErnSlots()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L43 | neighbors=[OverviewTab.tsx, ernHelpers.ts, isIntegratedBid()]
- "utils_ernhelpers_getlinkederntitles": "getLinkedErnTitles()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L82 | neighbors=[OverviewTab.tsx, ernHelpers.ts, getErnLinks()]
- "utils_ernhelpers_isernclosed": "isErnClosed()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L106 | neighbors=[ErnSearchModal.tsx, ernHelpers.ts, getErnDeadlineState()]
- "utils_ernhelpers_isintegratedbid": "isIntegratedBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L35 | neighbors=[UnassignedRequestsPage.tsx, ernHelpers.ts, getErnSlots()]
- "utils_ernlink_linkerntobid": "linkErnToBid()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernLink.ts:L26 | neighbors=[ErnCreateModal.tsx, ErnSearchModal.tsx, ernLink.ts]
- "utils_formatters_formatcurrencycompact": "formatCurrencyCompact()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L13 | neighbors=[AnalyticsPage.tsx, BidDetailsReportPage.tsx, formatters.ts]
- "utils_formatters_formathours": "formatHours()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L64 | neighbors=[BidHoursTable.tsx, EngineeringHoursSection.tsx, formatters.ts]
- "utils_formatters_formatnumber": "formatNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L23 | neighbors=[BidDetailsReportPage.tsx, exportHelpers.ts, formatters.ts]
- "utils_statushelpers_getdivisioncolor": "getDivisionColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L130 | neighbors=[BidBoardPage.tsx, FlowBoardPage.tsx, statusHelpers.ts]
- "bid_addquotationmodal_genid": "genId()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L29 | neighbors=[AddQuotationModal.tsx, blankLineItem()]
- "bid_addquotationmodal_ilineitem": "ILineItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L33 | neighbors=[AddQuotationModal.tsx, IQuotationLineDraft]
- "bid_aitab_aitab": "AITab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AITab.tsx:L12 | neighbors=[AITab.tsx, BidDetailPage.tsx]
- "bid_approvaltab_approvaltab": "ApprovalTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ApprovalTab.tsx:L209 | neighbors=[ApprovalTab.tsx, BidDetailPage.tsx]
- "bid_assetsbreakdowntab_applycontingency": "applyContingency()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L155 | neighbors=[AssetsBreakdownTab.tsx, calcContingencyPct()]
- "bid_assetsbreakdowntab_calccontingencypct": "calcContingencyPct()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L141 | neighbors=[AssetsBreakdownTab.tsx, applyContingency()]
- "bid_assetsbreakdowntab_fmtcost": "fmtCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L96 | neighbors=[AssetsBreakdownTab.tsx, AssetsBreakdownTab()]
- "bid_bidactivitylog_bidactivitylog": "BidActivityLog()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L12 | neighbors=[BidActivityLog.tsx, BidDetailPage.tsx]
- "bid_bidcomments_bidcomments": "BidComments()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidComments.tsx:L13 | neighbors=[BidComments.tsx, NotesTab.tsx]
- "bid_bidcostsummary_bidcostsummary": "BidCostSummary()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidCostSummary.tsx:L21 | neighbors=[BidCostSummary.tsx, BidDetailPage.tsx]
- "bid_bidexportbutton_bidexportbutton": "BidExportButton()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidExportButton.tsx:L12 | neighbors=[BidExportButton.tsx, BidDetailPage.tsx]
- "bid_bidstatusphasepanel_bidstatusphasepanel": "BidStatusPhasePanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusPhasePanel.tsx:L39 | neighbors=[BidStatusPhasePanel.tsx, BidDetailPage.tsx]
- "bid_bidtaskchecklist_bidtaskchecklist": "BidTaskChecklist()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTaskChecklist.tsx:L12 | neighbors=[BidStatusPhasePanel.tsx, BidTaskChecklist.tsx]
- "bid_bidtimeline_useliveelapsed": "useLiveElapsed()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTimeline.tsx:L45 | neighbors=[BidTimeline.tsx, BidTimeline()]
- "bid_certificationsbreakdowntab_certificationsbreakdowntab": "CertificationsBreakdownTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CertificationsBreakdownTab.tsx:L66 | neighbors=[CertificationsBreakdownTab.tsx, BidDetailPage.tsx]
- "bid_costsearchmodal_costsearchimportitem": "CostSearchImportItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CostSearchModal.tsx:L28 | neighbors=[AssetsBreakdownTab.tsx, CostSearchModal.tsx]
- "bid_costsearchmodal_costsearchmodal": "CostSearchModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CostSearchModal.tsx:L81 | neighbors=[AssetsBreakdownTab.tsx, CostSearchModal.tsx]
- "bid_documentstab_documentstab": "DocumentsTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/DocumentsTab.tsx:L19 | neighbors=[DocumentsTab.tsx, BidDetailPage.tsx]
- "bid_engineeringhourssection_engineeringhourssection": "EngineeringHoursSection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EngineeringHoursSection.tsx:L58 | neighbors=[BidHoursTable.tsx, EngineeringHoursSection.tsx]
- "bid_equipmentimportmodal_equipmentimportmodal": "EquipmentImportModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L180 | neighbors=[EquipmentImportModal.tsx, ScopeOfSupplyTab.tsx]
- "bid_equipmentimportmodal_iimportpick": "IImportPick" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L31 | neighbors=[EquipmentImportModal.tsx, ScopeOfSupplyTab.tsx]
- "bid_erndetailsmodal_erndetailsmodal": "ErnDetailsModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnDetailsModal.tsx:L25 | neighbors=[ErnDetailsModal.tsx, OverviewTab.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-017.json

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
