# Node Description Batch 36 of 86

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

- "utils_suppliermatching_loosetext": "looseText()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L42 | neighbors=[supplierMatching.ts, rankSupplierSuggestions(), supplierTokens()]
- "utils_suppliermatching_ranksuppliersuggestions": "rankSupplierSuggestions()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L157 | neighbors=[SupplierCombobox.tsx, supplierMatching.ts, looseText()]
- "utils_supplierprofile_buildsupplierprofiletext": "buildSupplierProfileText()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierProfile.ts:L99 | neighbors=[useSupplierStore.ts, supplierProfile.ts, websiteDomains()]
- "utils_supplierprofile_groupquotationsbysupplier": "groupQuotationsBySupplier()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierProfile.ts:L43 | neighbors=[SuppliersRegistry.tsx, useSupplierStore.ts, supplierProfile.ts]
- "utils_supplierprofile_resolveservicetypes": "resolveServiceTypes()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierProfile.ts:L34 | neighbors=[useSupplierServiceTypes.ts, useSupplierStore.ts, supplierProfile.ts]
- "utils_surveypackage_buildscopeitemsfrompackage": "buildScopeItemsFromPackage()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyPackage.ts:L9 | neighbors=[CreateRequestPage.tsx, SurveyPackageDrawer.tsx, surveyPackage.ts]
- "utils_validators_validatemaxlength": "validateMaxLength()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L52 | neighbors=[AddQuotationModal.tsx, QuotationsPage.tsx, validators.ts]
- "utils_winprobability_buildwinrateindex": "buildWinRateIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L63 | neighbors=[DashboardPage.tsx, FollowUpPage.tsx, winProbability.ts]
- "vendor_easimodulescss": "easiModulesCss.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/vendor/easiModulesCss.ts:L1 | neighbors=[3f57ca9 merge: integrate EASI module pa…, 6d20432 feat: adiciona paginas EASI ao …, SmartBid20WebPart.ts]
- "bid_addquotationmodal_genid": "genId()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L39 | neighbors=[AddQuotationModal.tsx, blankLineItem()]
- "bid_addquotationmodal_ilineitem": "ILineItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L43 | neighbors=[AddQuotationModal.tsx, IQuotationLineDraft]
- "bid_aitab_aitab": "AITab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AITab.tsx:L12 | neighbors=[AITab.tsx, BidDetailPage.tsx]
- "bid_approvaltab_approvaltab": "ApprovalTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ApprovalTab.tsx:L246 | neighbors=[ApprovalTab.tsx, BidDetailPage.tsx]
- "bid_assetsbreakdowntab_applycontingency": "applyContingency()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L155 | neighbors=[AssetsBreakdownTab.tsx, calcContingencyPct()]
- "bid_assetsbreakdowntab_calccontingencypct": "calcContingencyPct()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L141 | neighbors=[AssetsBreakdownTab.tsx, applyContingency()]
- "bid_assetsbreakdowntab_fmtcost": "fmtCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AssetsBreakdownTab.tsx:L197 | neighbors=[AssetsBreakdownTab.tsx, AssetsBreakdownTab()]
- "bid_bidactivitylog_bidactivitylog": "BidActivityLog()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L231 | neighbors=[BidActivityLog.tsx, BidDetailPage.tsx]
- "bid_bidactivitylog_metastring": "metaString()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L91 | neighbors=[BidActivityLog.tsx, renderDetail()]
- "bid_bidactivitylog_renderdetail": "renderDetail()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L115 | neighbors=[BidActivityLog.tsx, metaString()]
- "bid_bidcomments_bidcomments": "BidComments()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidComments.tsx:L13 | neighbors=[BidComments.tsx, NotesTab.tsx]
- "bid_bidconfidentialbutton_bidconfidentialbutton": "BidConfidentialButton()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidConfidentialButton.tsx:L31 | neighbors=[BidConfidentialButton.tsx, BidDetailPage.tsx]
- "bid_bidcostsummary_bidcostsummary": "BidCostSummary()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidCostSummary.tsx:L19 | neighbors=[BidCostSummary.tsx, BidDetailPage.tsx]
- "bid_bidexporttab_plural": "plural()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidExportTab.tsx:L88 | neighbors=[BidExportTab.tsx, BidExportTab()]
- "bid_bidstatusphasepanel_assetcostsblockdialog": "AssetCostsBlockDialog()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusPhasePanel.tsx:L42 | neighbors=[ApprovalTab.tsx, BidStatusPhasePanel.tsx]
- "bid_bidstatusphasepanel_bidstatusphasepanel": "BidStatusPhasePanel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusPhasePanel.tsx:L87 | neighbors=[BidStatusPhasePanel.tsx, BidDetailPage.tsx]
- "bid_bidtaskchecklist_bidtaskchecklist": "BidTaskChecklist()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTaskChecklist.tsx:L12 | neighbors=[BidStatusPhasePanel.tsx, BidTaskChecklist.tsx]
- "bid_bidtimeline_useliveelapsed": "useLiveElapsed()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTimeline.tsx:L45 | neighbors=[BidTimeline.tsx, BidTimeline()]
- "bid_certificationsbreakdowntab_certificationsbreakdowntab": "CertificationsBreakdownTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CertificationsBreakdownTab.tsx:L74 | neighbors=[CertificationsBreakdownTab.tsx, BidDetailPage.tsx]
- "bid_confidentialaccessmodal_keyof": "keyOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ConfidentialAccessModal.tsx:L48 | neighbors=[ConfidentialAccessModal.tsx, ConfidentialAccessModal()]
- "bid_costsearchmodal_costsearchimportitem": "CostSearchImportItem" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CostSearchModal.tsx:L36 | neighbors=[AssetsBreakdownTab.tsx, CostSearchModal.tsx]
- "bid_costsearchmodal_costsearchmodal": "CostSearchModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/CostSearchModal.tsx:L142 | neighbors=[AssetsBreakdownTab.tsx, CostSearchModal.tsx]
- "bid_documentstab_islocalurl": "isLocalUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/DocumentsTab.tsx:L25 | neighbors=[DocumentsTab.tsx, DocumentsTab()]
- "bid_duedatechangemodal_toinputdate": "toInputDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/DueDateChangeModal.tsx:L21 | neighbors=[DueDateChangeModal.tsx, DueDateChangeModal()]
- "bid_engineeringhourssection_engineeringhourssection": "EngineeringHoursSection()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EngineeringHoursSection.tsx:L58 | neighbors=[BidHoursTable.tsx, EngineeringHoursSection.tsx]
- "bid_equipmentimportmodal_matcheswords": "matchesWords()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L317 | neighbors=[EquipmentImportModal.tsx, scanSource()]
- "bid_equipmentimportmodal_searchqueryviews": "searchQueryViews()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L474 | neighbors=[EquipmentImportModal.tsx, searchAllSources()]
- "bid_equipmentimportmodal_towords": "toWords()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EquipmentImportModal.tsx:L312 | neighbors=[EquipmentImportModal.tsx, EquipmentImportModal()]
- "bid_erndetailsmodal_withdate": "withDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnDetailsModal.tsx:L137 | neighbors=[ErnDetailsModal.tsx, ErnDetailsModal()]
- "bid_ernsearchmodal_ernsearchmodal": "ErnSearchModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnSearchModal.tsx:L32 | neighbors=[ErnSearchModal.tsx, OverviewTab.tsx]
- "bid_exportclarificationmodal_exportclarificationmodal": "ExportClarificationModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ExportClarificationModal.tsx:L33 | neighbors=[ExportClarificationModal.tsx, QualificationsTab.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-035.json

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
