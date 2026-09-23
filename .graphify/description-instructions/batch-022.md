# Node Description Batch 23 of 43

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

- "models_ifavoriteitem_ifavoritesdata": "IFavoritesData" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IFavoriteItem.ts:L64 | neighbors=[IFavoriteItem.ts, index.ts]
- "models_ifavoriteitem_ifavoritesubgroup": "IFavoriteSubGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IFavoriteItem.ts:L14 | neighbors=[IFavoriteItem.ts, index.ts]
- "models_inotification_inotification": "INotification" | kind=code-symbol | source=src/webparts/smartBid20/app/models/INotification.ts:L1 | neighbors=[index.ts, INotification.ts]
- "models_iquerycatalog_iactiveregistereditem": "IActiveRegisteredItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L7 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_ibomcostresult": "IBomCostResult" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L116 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_ibomsheetitem": "IBomSheetItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L41 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_imultisourceresults": "IMultiSourceResults" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L73 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_ipeoplesoftfinancialsitem": "IPeopleSoftFinancialsItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L21 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_iquerycatalogdata": "IQueryCatalogData" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L91 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_irawtabdata": "IRawTabData" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L83 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquerycatalog_isearchresultitem": "ISearchResultItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQueryCatalog.ts:L57 | neighbors=[index.ts, IQueryCatalog.ts]
- "models_iquotationitem_iquotationitem": "IQuotationItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQuotationItem.ts:L11 | neighbors=[index.ts, IQuotationItem.ts]
- "models_iquotationitem_quotationtype": "QuotationType" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQuotationItem.ts:L8 | neighbors=[index.ts, IQuotationItem.ts]
- "models_isystemconfig_accesspermission": "AccessPermission" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L41 | neighbors=[index.ts, ISystemConfig.ts]
- "models_isystemconfig_iaccessleveldef": "IAccessLevelDef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L43 | neighbors=[index.ts, ISystemConfig.ts]
- "models_isystemconfig_iconfigoption": "IConfigOption" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L4 | neighbors=[index.ts, ISystemConfig.ts]
- "models_isystemconfig_icurrencysettings": "ICurrencySettings" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L35 | neighbors=[index.ts, ISystemConfig.ts]
- "models_isystemconfig_iexchangerate": "IExchangeRate" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L29 | neighbors=[index.ts, ISystemConfig.ts]
- "models_isystemconfig_iresourcetypeconfig": "IResourceTypeConfig" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L52 | neighbors=[index.ts, ISystemConfig.ts]
- "models_isystemconfig_isystemconfig": "ISystemConfig" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L60 | neighbors=[index.ts, ISystemConfig.ts]
- "models_iteammember_imembersdata": "IMembersData" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ITeamMember.ts:L19 | neighbors=[index.ts, ITeamMember.ts]
- "models_iuser_iuser": "IUser" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L33 | neighbors=[index.ts, IUser.ts]
- "models_iuser_memberdivision": "MemberDivision" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L24 | neighbors=[index.ts, IUser.ts]
- "pages_analyticspage_analyticspage": "AnalyticsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AnalyticsPage.tsx:L45 | neighbors=[AppLayout.tsx, AnalyticsPage.tsx]
- "pages_approvalspage_approvalspage": "ApprovalsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ApprovalsPage.tsx:L14 | neighbors=[AppLayout.tsx, ApprovalsPage.tsx]
- "pages_assetscatalogpage_dash": "dash()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L11 | neighbors=[AssetsCatalogPage.tsx, AssetsCatalogPage()]
- "pages_assetscatalogpage_getstatusclass": "getStatusClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L14 | neighbors=[AssetsCatalogPage.tsx, AssetsCatalogPage()]
- "pages_biddetailpage_biddetailpage": "BidDetailPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L211 | neighbors=[AppLayout.tsx, BidDetailPage.tsx]
- "pages_biddetailsreportpage_biddetailsreportpage": "BidDetailsReportPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailsReportPage.tsx:L51 | neighbors=[AppLayout.tsx, BidDetailsReportPage.tsx]
- "pages_bidtrackerpage_bidtrackerpage": "BidTrackerPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L48 | neighbors=[AppLayout.tsx, BidTrackerPage.tsx]
- "pages_bomcostspage_formatdatedmy": "formatDateDMY()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L41 | neighbors=[BomCostsPage.tsx, BomCostsPage()]
- "pages_bomcostspage_getdirectchildren": "getDirectChildren()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L66 | neighbors=[BomCostsPage.tsx, isRolledUpPartial()]
- "pages_bomcostspage_isrolleduppartial": "isRolledUpPartial()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L170 | neighbors=[BomCostsPage.tsx, getDirectChildren()]
- "pages_bottleneckanalysispage_bottleneckanalysispage": "BottleneckAnalysisPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L76 | neighbors=[AppLayout.tsx, BottleneckAnalysisPage.tsx]
- "pages_clarificationsdbpage_todateinput": "toDateInput()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ClarificationsDbPage.tsx:L28 | neighbors=[ClarificationsDbPage.tsx, ClarificationsDbPage()]
- "pages_createrequestpage_createrequestpage": "CreateRequestPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/CreateRequestPage.tsx:L82 | neighbors=[AppLayout.tsx, CreateRequestPage.tsx]
- "pages_dashboardpage_dashboardpage": "DashboardPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/DashboardPage.tsx:L28 | neighbors=[AppLayout.tsx, DashboardPage.tsx]
- "pages_datasheetspage_datasheetspage": "DatasheetsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/DatasheetsPage.tsx:L9 | neighbors=[AppLayout.tsx, DatasheetsPage.tsx]
- "pages_faqpage_faqpage": "FaqPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FaqPage.tsx:L62 | neighbors=[AppLayout.tsx, FaqPage.tsx]
- "pages_favoritespage_favoritespage": "FavoritesPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L31 | neighbors=[AppLayout.tsx, FavoritesPage.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-022.json

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
