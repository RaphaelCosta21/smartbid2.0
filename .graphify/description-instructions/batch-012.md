# Node Description Batch 13 of 43

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

- "models_ibidstatus_bidresultoutcome": "BidResultOutcome" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L91 | neighbors=[IBid.ts, IBidResult.ts, IBidStatus.ts, index.ts]
- "models_ibidstatus_bidtype": "BidType" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L82 | neighbors=[IBid.ts, IBidRequest.ts, IBidStatus.ts, index.ts]
- "models_ibidstatus_division": "Division" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L84 | neighbors=[IBid.ts, IBidRequest.ts, IBidStatus.ts, index.ts]
- "models_idashboard_idivisionworkload": "IDivisionWorkload" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDashboard.ts:L23 | neighbors=[DivisionWorkload.tsx, IDashboard.ts, index.ts, DashboardService.ts]
- "models_idashboard_imonthlyvolume": "IMonthlyVolume" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDashboard.ts:L15 | neighbors=[MonthlyVolumeChart.tsx, IDashboard.ts, index.ts, DashboardService.ts]
- "models_idoclibraryitem_doccatalogtype": "DocCatalogType" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDocLibraryItem.ts:L6 | neighbors=[DocLibraryCatalog.tsx, IDocLibraryItem.ts, index.ts, DocLibraryCatalogService.ts]
- "models_idoclibraryitem_idoclibraryitem": "IDocLibraryItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDocLibraryItem.ts:L12 | neighbors=[DocLibraryCatalog.tsx, IDocLibraryItem.ts, index.ts, DocLibraryCatalogService.ts]
- "models_idoclibraryitem_idoclibrarymetadata": "IDocLibraryMetadata" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDocLibraryItem.ts:L44 | neighbors=[DocLibraryCatalog.tsx, IDocLibraryItem.ts, index.ts, DocLibraryCatalogService.ts]
- "models_ilinksrecommendations_ibidlink": "IBidLink" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ILinksRecommendations.ts:L5 | neighbors=[ILinksRecommendations.ts, index.ts, LinksRecommendationsPage.tsx, LinksRecommendationsService.ts]
- "models_ilinksrecommendations_ibidrecommendation": "IBidRecommendation" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ILinksRecommendations.ts:L15 | neighbors=[ILinksRecommendations.ts, index.ts, LinksRecommendationsPage.tsx, LinksRecommendationsService.ts]
- "pages_assetscatalogpage_assetscatalogpage": "AssetsCatalogPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L30 | neighbors=[AppLayout.tsx, AssetsCatalogPage.tsx, dash(), getStatusClass()]
- "pages_memberspage": "MembersPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/MembersPage.tsx:L1 | neighbors=[fe3728a smartbid2.0, AppLayout.tsx, MembersPage(), MembersManagement.tsx]
- "pages_systemconfigpage": "SystemConfigPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SystemConfigPage.tsx:L1 | neighbors=[fe3728a smartbid2.0, AppLayout.tsx, SystemConfigPage(), SystemConfiguration.tsx]
- "reports_exportbar_exportbar": "ExportBar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ExportBar.tsx:L49 | neighbors=[BidDetailsReportPage.tsx, OperationalSummaryPage.tsx, PeriodPerformancePage.tsx, ExportBar.tsx]
- "reports_exportoptions": "ExportOptions.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/reports/ExportOptions.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ExportOptions(), ExportOptionsProps]
- "services_aianalysisservice_aianalysisservice_chat": ".chat()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L557 | neighbors=[AIAnalysisService, .ensureConfigured(), .parseChatAnswer(), .postJson()]
- "services_aianalysisservice_aianalysisservice_validateresponse": ".validateResponse()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L82 | neighbors=[AIAnalysisService, .analyzeDocument(), .analyzeDocumentForTemplate(), .parseClarifications()]
- "services_aiauthservice_aiauthservice_pickaccount": ".pickAccount()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L197 | neighbors=[AiAuthService, .getAccessToken(), .getLoginHint(), .warmUp()]
- "services_aiauthservice_aiauthservice_probescope": ".probeScope()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L348 | neighbors=[AiAuthService, .getApp(), .getLoginHint(), .log()]
- "services_bidservice_bidservice_ensurecolumns": ".ensureColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L27 | neighbors=[BidService, .create(), ._provisionColumns(), .update()]
- "services_bidservice_bidservice_patchbybidnumber": ".patchByBidNumber()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L191 | neighbors=[BidService, .getById(), ._searchColumns(), .update()]
- "services_bidservice_bidservice_updateaftercreate": ".updateAfterCreate()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BidService.ts:L138 | neighbors=[BidService, .getById(), ._searchColumns(), .update()]
- "services_clarificationdbservice_clarificationdbservice_maptosp": "._mapToSP()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationDbService.ts:L41 | neighbors=[ClarificationDbService, .addMany(), .create(), .update()]
- "services_currencyservice_currencyservice_getcurrencyrate": ".getCurrencyRate()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/CurrencyService.ts:L98 | neighbors=[CurrencyService, .formatDateForBCB(), .getUsdBrl(), .getRates()]
- "services_dashboardservice_dashboardservice_builddashboarddata": ".buildDashboardData()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L132 | neighbors=[DashboardService, .calculateDivisionWorkloads(), .calculateKPIs(), .calculateMonthlyVolumes()]
- "services_membersservice_membersservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L16 | neighbors=[MembersService, .addMember(), .removeMember(), .updateMember()]
- "services_membersservice_membersservice_save": ".save()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L49 | neighbors=[MembersService, .addMember(), .removeMember(), .updateMember()]
- "services_pricingservice_pricingservice": "PricingService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/PricingService.ts:L20 | neighbors=[PricingService.ts, .getAll(), ._list(), .save()]
- "services_quotationservice_quotationservice_migratelegacyblob": "._migrateLegacyBlob()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L167 | neighbors=[QuotationService, .getAll(), .ensureColumns(), ._toRow()]
- "services_quotationservice_quotationservice_torow": "._toRow()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L127 | neighbors=[QuotationService, .addItems(), ._migrateLegacyBlob(), .updateItem()]
- "services_quotationservice_quotationservice_updateitem": ".updateItem()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L249 | neighbors=[QuotationService, .ensureColumns(), ._findRowId(), ._toRow()]
- "services_statustrackerservice_statustrackerservice": "StatusTrackerService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/StatusTrackerService.ts:L36 | neighbors=[StatusTrackerService.ts, ._list(), .notify(), .notifyMultiple()]
- "stores_useernstore_useernstore": "useErnStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useErnStore.ts:L16 | neighbors=[ErnDashboardSection.tsx, useErn.ts, BidTrackerPage.tsx, useErnStore.ts]
- "utils_accesscontrol_hasaccess": "hasAccess()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L80 | neighbors=[useAuthStore.ts, accessControl.ts, canEdit(), canView()]
- "utils_analyticshelpers_completiontimetrend": "completionTimeTrend()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L244 | neighbors=[AnalyticsPage.tsx, PerformanceTrendsPage.tsx, analyticsHelpers.ts, buildPeriodSequence()]
- "utils_analyticshelpers_winratetrend": "winRateTrend()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L278 | neighbors=[FollowUpPage.tsx, PerformanceTrendsPage.tsx, analyticsHelpers.ts, buildPeriodSequence()]
- "utils_clarificationexport_exportclarificationstoexcel": "exportClarificationsToExcel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationExport.ts:L44 | neighbors=[ExportClarificationModal.tsx, clarificationExport.ts, escapeHtml(), formatDateTime()]
- "utils_constants_division_colors": "DIVISION_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L1 | neighbors=[MyDashboardPage.tsx, TimelinePage.tsx, ToolingReportPage.tsx, constants.ts]
- "utils_costcalculations_applycontingencytocost": "applyContingencyToCost()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L25 | neighbors=[costCalculations.ts, applyContingencySplit(), getAssetMainCostAdj(), getSubItemCostTotalAdj()]
- "utils_currencyhelpers_getcurrencies": "getCurrencies()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/currencyHelpers.ts:L7 | neighbors=[CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx, PreparationMobilizationTab.tsx, currencyHelpers.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-012.json

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
