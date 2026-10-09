# Node Description Batch 44 of 86

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

- "models_isurveycatalog_isurveyspreadcategory": "ISurveySpreadCategory" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L132 | neighbors=[index.ts, ISurveyCatalog.ts]
- "models_isurveycatalog_isurveyspreadline": "ISurveySpreadLine" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L109 | neighbors=[index.ts, ISurveyCatalog.ts]
- "models_isurveycatalog_isurveyspreadlink": "ISurveySpreadLink" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L148 | neighbors=[index.ts, ISurveyCatalog.ts]
- "models_isurveycatalog_isurveyspreadzone": "ISurveySpreadZone" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L122 | neighbors=[index.ts, ISurveyCatalog.ts]
- "models_isurveycatalog_isurveysystem": "ISurveySystem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L90 | neighbors=[index.ts, ISurveyCatalog.ts]
- "models_isurveycatalog_surveylinkkind": "SurveyLinkKind" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L138 | neighbors=[index.ts, ISurveyCatalog.ts]
- "models_isurveycatalog_surveysceneanchor": "SurveySceneAnchor" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L7 | neighbors=[index.ts, ISurveyCatalog.ts]
- "models_isurveycatalog_surveysceneshape": "SurveySceneShape" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyCatalog.ts:L22 | neighbors=[index.ts, ISurveyCatalog.ts]
- "models_isystemconfig_icurrencysettings": "ICurrencySettings" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L42 | neighbors=[index.ts, ISystemConfig.ts]
- "models_isystemconfig_iexchangerate": "IExchangeRate" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L36 | neighbors=[index.ts, ISystemConfig.ts]
- "models_isystemconfig_inotificationeventrule": "INotificationEventRule" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L101 | neighbors=[index.ts, ISystemConfig.ts]
- "models_isystemconfig_inotificationsettings": "INotificationSettings" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L107 | neighbors=[index.ts, ISystemConfig.ts]
- "models_isystemconfig_inotificationteamrule": "INotificationTeamRule" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L95 | neighbors=[index.ts, ISystemConfig.ts]
- "models_isystemconfig_iresourcetypeconfig": "IResourceTypeConfig" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L114 | neighbors=[index.ts, ISystemConfig.ts]
- "models_isystemconfig_notificationaudiencemode": "NotificationAudienceMode" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L92 | neighbors=[index.ts, ISystemConfig.ts]
- "models_isystemconfig_notificationeventkey": "NotificationEventKey" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L75 | neighbors=[index.ts, ISystemConfig.ts]
- "models_iteammember_imembersdata": "IMembersData" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ITeamMember.ts:L21 | neighbors=[index.ts, ITeamMember.ts]
- "models_iuser_iuser": "IUser" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L33 | neighbors=[index.ts, IUser.ts]
- "models_iuser_memberdivision": "MemberDivision" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L24 | neighbors=[index.ts, IUser.ts]
- "pages_analyticspage_analyticspage": "AnalyticsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AnalyticsPage.tsx:L45 | neighbors=[AppLayout.tsx, AnalyticsPage.tsx]
- "pages_approvalspage_approvalspage": "ApprovalsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ApprovalsPage.tsx:L14 | neighbors=[AppLayout.tsx, ApprovalsPage.tsx]
- "pages_assetscatalogpage_dash": "dash()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L26 | neighbors=[AssetsCatalogPage.tsx, AssetsCatalogPage()]
- "pages_assetscatalogpage_getstatusclass": "getStatusClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/AssetsCatalogPage.tsx:L29 | neighbors=[AssetsCatalogPage.tsx, AssetsCatalogPage()]
- "pages_biddetailpage_biddetailpage": "BidDetailPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailPage.tsx:L170 | neighbors=[AppLayout.tsx, BidDetailPage.tsx]
- "pages_biddetailsreportpage_biddetailsreportpage": "BidDetailsReportPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailsReportPage.tsx:L51 | neighbors=[AppLayout.tsx, BidDetailsReportPage.tsx]
- "pages_bidtrackerpage_bidtrackerpage": "BidTrackerPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidTrackerPage.tsx:L86 | neighbors=[AppLayout.tsx, BidTrackerPage.tsx]
- "pages_bomcostspage_formatdatedmy": "formatDateDMY()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L42 | neighbors=[BomCostsPage.tsx, BomCostsPage()]
- "pages_bomcostspage_getdirectchildren": "getDirectChildren()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L67 | neighbors=[BomCostsPage.tsx, isRolledUpPartial()]
- "pages_bomcostspage_isrolleduppartial": "isRolledUpPartial()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L171 | neighbors=[BomCostsPage.tsx, getDirectChildren()]
- "pages_bottleneckanalysispage_bottleneckanalysispage": "BottleneckAnalysisPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L77 | neighbors=[AppLayout.tsx, BottleneckAnalysisPage.tsx]
- "pages_clarificationsdbpage_todateinput": "toDateInput()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ClarificationsDbPage.tsx:L28 | neighbors=[ClarificationsDbPage.tsx, ClarificationsDbPage()]
- "pages_createrequestpage_createrequestpage": "CreateRequestPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/CreateRequestPage.tsx:L92 | neighbors=[AppLayout.tsx, CreateRequestPage.tsx]
- "pages_dashboardpage_dashboardpage": "DashboardPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/DashboardPage.tsx:L68 | neighbors=[AppLayout.tsx, DashboardPage.tsx]
- "pages_datasheetspage_datasheetspage": "DatasheetsPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/DatasheetsPage.tsx:L8 | neighbors=[AppLayout.tsx, DatasheetsPage.tsx]
- "pages_easibidcomparatorpage_easibidcomparatorpage": "EasiBidComparatorPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/EasiBidComparatorPage.tsx:L6 | neighbors=[AppLayout.tsx, EasiBidComparatorPage.tsx]
- "pages_easibidpresentationpage_easibidpresentationpage": "EasiBidPresentationPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/EasiBidPresentationPage.tsx:L6 | neighbors=[AppLayout.tsx, EasiBidPresentationPage.tsx]
- "pages_easipricehistorypage_easipricehistorypage": "EasiPriceHistoryPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/EasiPriceHistoryPage.tsx:L6 | neighbors=[AppLayout.tsx, EasiPriceHistoryPage.tsx]
- "pages_easisupplierspage_easisupplierspage": "EasiSuppliersPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/EasiSuppliersPage.tsx:L11 | neighbors=[AppLayout.tsx, EasiSuppliersPage.tsx]
- "pages_faqpage_faqpage": "FaqPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FaqPage.tsx:L62 | neighbors=[AppLayout.tsx, FaqPage.tsx]
- "pages_favoritespage_favoritespage": "FavoritesPage()" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FavoritesPage.tsx:L111 | neighbors=[AppLayout.tsx, FavoritesPage.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-043.json

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
