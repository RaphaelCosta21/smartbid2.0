# Node Description Batch 28 of 102

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

- "hooks_useanalyticsfilters_presetrange": "presetRange()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L62 | neighbors=[useAnalyticsFilters.ts, isoDaysAgo(), todayStr(), useDashboardFilters.ts]
- "hooks_useapproothost": "useAppRootHost.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAppRootHost.ts:L1 | neighbors=[9582626 feat: add Access Log component …, GuidedTour.tsx, useAppRootHost(), HowItWorksDrawer.tsx]
- "hooks_usecolortheme_getactivecolortheme": "getActiveColorTheme()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useColorTheme.ts:L10 | neighbors=[excelStyles.ts, useChartTheme.ts, useColorTheme.ts, resolveSemanticColor()]
- "hooks_useconfigphases_useconfigphases": "useConfigPhases()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useConfigPhases.ts:L17 | neighbors=[BidPhaseProgress.tsx, OverviewTab.tsx, useConfigPhases.ts, BidDetailPage.tsx]
- "hooks_usekpis_usekpis": "useKPIs()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useKPIs.ts:L37 | neighbors=[useKPIs.ts, AnalyticsPage.tsx, DashboardPage.tsx, ReportsPage.tsx]
- "hooks_useresultstatus_useresultstatus": "useResultStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useResultStatus.ts:L33 | neighbors=[EngHoursOutlook.tsx, EngHoursRanking.tsx, useResultStatus.ts, DashboardPage.tsx]
- "knowledge_pastbidbadges_pastbidchips": "PastBidChips()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidBadges.tsx:L19 | neighbors=[PastBidBadges.tsx, PastBidCard.tsx, FavoritesPage.tsx, PastBidsPage.tsx]
- "knowledge_pastbidbadges_pastbidkbbadge": "PastBidKbBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidBadges.tsx:L81 | neighbors=[PastBidBadges.tsx, PastBidCard.tsx, FavoritesPage.tsx, PastBidsPage.tsx]
- "knowledge_pastbidbadges_pastbidoutcome": "PastBidOutcome()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidBadges.tsx:L64 | neighbors=[PastBidBadges.tsx, PastBidCard.tsx, FavoritesPage.tsx, PastBidsPage.tsx]
- "layout_livepulse_describedatechange": "describeDateChange()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L131 | neighbors=[LivePulse.tsx, fmtDay(), describeDeadline(), describeErn()]
- "layout_livepulse_fmtday": "fmtDay()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L127 | neighbors=[LivePulse.tsx, describeDateChange(), describeDeadline(), describeErn()]
- "models_iaccesslog": "IAccessLog.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAccessLog.ts:L1 | neighbors=[9582626 feat: add Access Log component …, AccessLogArea, IAccessLogEntry, index.ts]
- "models_iactivitylog_iactivitylogentry": "IActivityLogEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IActivityLog.ts:L4 | neighbors=[AddQuotationModal.tsx, IActivityLog.ts, index.ts, ActivityLogService.ts]
- "models_iaianalysis_iaianalysiscontext": "IAIAnalysisContext" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L72 | neighbors=[IAIAnalysis.ts, index.ts, AIAnalysisService.ts, aiContext.ts]
- "models_iaianalysis_iaianalysisresult": "IAIAnalysisResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L134 | neighbors=[AIDocumentAnalyzer.tsx, IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_iaigroupoption": "IAIGroupOption" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L28 | neighbors=[ai.prompts.ts, IAIAnalysis.ts, index.ts, AIAnalysisService.ts]
- "models_iaianalysis_iextracteddocumentmetadata": "IExtractedDocumentMetadata" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L268 | neighbors=[DocLibraryCatalog.tsx, IAIAnalysis.ts, AIAnalysisService.ts, TechnicalProposalKnowledgeService.ts]
- "models_iaianalysis_ipastbidprofilesuggestion": "IPastBidProfileSuggestion" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L322 | neighbors=[PastBidProfileModal.tsx, IAIAnalysis.ts, AIAnalysisService.ts, PastBidKnowledgeService.ts]
- "models_ibid_ibidattachment": "IBidAttachment" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L761 | neighbors=[IBid.ts, IBidTemplate.ts, index.ts, AttachmentService.ts]
- "models_ibid_iqualificationtable": "IQualificationTable" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L438 | neighbors=[QualificationSuggestionsModal.tsx, IBid.ts, index.ts, qualificationHelpers.ts]
- "models_ibidapproval_ibidapprovalstate": "IBidApprovalState" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidApproval.ts:L37 | neighbors=[ApprovalRequestCard.tsx, IBidApproval.ts, index.ts, ApprovalService.ts]
- "models_ibidequipment": "IBidEquipment.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidEquipment.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidEquipmentItem, IEquipmentSummary, index.ts]
- "models_ibidexport_iexportoptions": "IExportOptions" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidExport.ts:L17 | neighbors=[useExport.ts, IBidExport.ts, index.ts, ExportService.ts]
- "models_ibidexport_iexportresult": "IExportResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidExport.ts:L30 | neighbors=[useExport.ts, IBidExport.ts, index.ts, ExportService.ts]
- "models_ibidstatus_bidresultoutcome": "BidResultOutcome" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L103 | neighbors=[IBid.ts, IBidResult.ts, IBidStatus.ts, index.ts]
- "models_ibidstatus_bidtype": "BidType" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L83 | neighbors=[IBid.ts, IBidRequest.ts, IBidStatus.ts, index.ts]
- "models_ibidstatus_division": "Division" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L86 | neighbors=[IBid.ts, IBidRequest.ts, IBidStatus.ts, index.ts]
- "models_ibomcostanalysis_ibomcostanalysis": "IBomCostAnalysis" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBomCostAnalysis.ts:L63 | neighbors=[BomAnalysisCard.tsx, IBomCostAnalysis.ts, index.ts, bomExcelExport.ts]
- "models_ibomcostanalysis_ibomcostitem": "IBomCostItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBomCostAnalysis.ts:L17 | neighbors=[IBomCostAnalysis.ts, index.ts, bomCostHelpers.ts, bomExcelExport.ts]
- "models_idashboard_idivisionworkload": "IDivisionWorkload" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDashboard.ts:L23 | neighbors=[DivisionWorkload.tsx, IDashboard.ts, index.ts, DashboardService.ts]
- "models_idashboard_imonthlyvolume": "IMonthlyVolume" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDashboard.ts:L15 | neighbors=[MonthlyVolumeChart.tsx, IDashboard.ts, index.ts, DashboardService.ts]
- "models_idoclibraryitem_doccatalogtype": "DocCatalogType" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDocLibraryItem.ts:L6 | neighbors=[DocLibraryCatalog.tsx, IDocLibraryItem.ts, index.ts, DocLibraryCatalogService.ts]
- "models_idoclibraryitem_idoclibraryitem": "IDocLibraryItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDocLibraryItem.ts:L14 | neighbors=[DocLibraryCatalog.tsx, IDocLibraryItem.ts, index.ts, DocLibraryCatalogService.ts]
- "models_ilinksrecommendations_ibidlink": "IBidLink" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ILinksRecommendations.ts:L5 | neighbors=[ILinksRecommendations.ts, index.ts, LinksRecommendationsPage.tsx, LinksRecommendationsService.ts]
- "models_ilinksrecommendations_ibidrecommendation": "IBidRecommendation" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ILinksRecommendations.ts:L15 | neighbors=[ILinksRecommendations.ts, index.ts, LinksRecommendationsPage.tsx, LinksRecommendationsService.ts]
- "models_isystemconfig_bidtabgroupkey": "BidTabGroupKey" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L58 | neighbors=[accessControl.config.ts, bidTabs.config.ts, index.ts, ISystemConfig.ts]
- "models_isystemconfig_ikpitargets": "IKPITargets" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L18 | neighbors=[kpi.config.ts, index.ts, ISystemConfig.ts, DashboardService.ts]
- "models_isystemconfig_ipriorityrules": "IPriorityRules" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L31 | neighbors=[kpi.config.ts, index.ts, ISystemConfig.ts, businessDays.ts]
- "models_iuser_userrole": "UserRole" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L21 | neighbors=[accessControl.config.ts, index.ts, ISystemConfig.ts, IUser.ts]
- "pages_assetscatalogpage_assetscatalogpage": "AssetsCatalogPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L45 | neighbors=[AppLayout.tsx, AssetsCatalogPage.tsx, dash(), getStatusClass()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-027.json

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
