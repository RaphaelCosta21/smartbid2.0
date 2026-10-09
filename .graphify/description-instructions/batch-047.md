# Node Description Batch 48 of 86

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

- "settings_accessmatrix_accesslegend": "AccessLegend()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L111 | neighbors=[AccessMatrix.tsx, SystemConfiguration.tsx]
- "settings_accessmatrix_accessmatrix": "AccessMatrix()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L159 | neighbors=[AccessMatrix.tsx, SystemConfiguration.tsx]
- "settings_accessmatrix_iaccessmatrixgroup": "IAccessMatrixGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L22 | neighbors=[AccessMatrix.tsx, SystemConfiguration.tsx]
- "settings_accessmatrix_superadminscard": "SuperAdminsCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L135 | neighbors=[AccessMatrix.tsx, SystemConfiguration.tsx]
- "settings_notificationmatrix_notificationdeliverycard": "NotificationDeliveryCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L269 | neighbors=[NotificationMatrix.tsx, SystemConfiguration.tsx]
- "settings_notificationmatrix_notificationlegend": "NotificationLegend()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L217 | neighbors=[NotificationMatrix.tsx, SystemConfiguration.tsx]
- "settings_notificationmatrix_notificationmatrix": "NotificationMatrix()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L575 | neighbors=[NotificationMatrix.tsx, SystemConfiguration.tsx]
- "settings_notificationmatrix_pillclass": "pillClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L150 | neighbors=[NotificationMatrix.tsx, audienceParts()]
- "settings_notificationmatrix_pilltext": "pillText()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L133 | neighbors=[NotificationMatrix.tsx, audienceParts()]
- "settings_notificationmatrix_reachesteam": "reachesTeam()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L129 | neighbors=[NotificationMatrix.tsx, audienceParts()]
- "settings_patchnotes_patchnotes": "PatchNotes()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/PatchNotes.tsx:L10 | neighbors=[PatchNotesPage.tsx, PatchNotes.tsx]
- "settings_systemconfiguration_geteditablepriorityrules": "getEditablePriorityRules()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L275 | neighbors=[SystemConfiguration.tsx, SystemConfiguration()]
- "settings_systemconfiguration_systemconfiguration": "SystemConfiguration()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L432 | neighbors=[SystemConfiguration.tsx, getEditablePriorityRules()]
- "sheets_assetssheet_fmtbrl": "fmtBRL()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/assetsSheet.ts:L300 | neighbors=[assetsSheet.ts, buildAssetsSheet()]
- "sheets_certificationssheet_buildcertificationssheet": "buildCertificationsSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/certificationsSheet.ts:L10 | neighbors=[index.ts, certificationsSheet.ts]
- "sheets_costsummarysheet_buildcostsummarysheet": "buildCostSummarySheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/costSummarySheet.ts:L12 | neighbors=[index.ts, costSummarySheet.ts]
- "sheets_currencytable_curcode": "curCode()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/currencyTable.ts:L26 | neighbors=[currencyTable.ts, moneyCell()]
- "sheets_currencytable_fxnotes": "fxNotes()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/currencyTable.ts:L48 | neighbors=[currencyTable.ts, writeCurrencyFooter()]
- "sheets_currencytable_icurrencyline": "ICurrencyLine" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/currencyTable.ts:L14 | neighbors=[currencyTable.ts, prepMobSheet.ts]
- "sheets_hourssheet_writeengineeringitems": "writeEngineeringItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/hoursSheet.ts:L285 | neighbors=[hoursSheet.ts, buildHoursSheet()]
- "sheets_hourssheet_writehourstable": "writeHoursTable()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/hoursSheet.ts:L226 | neighbors=[hoursSheet.ts, buildHoursSheet()]
- "sheets_infosheet_people": "people()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/infoSheet.ts:L13 | neighbors=[infoSheet.ts, buildInfoSheet()]
- "sheets_logisticssheet_buildlogisticssheet": "buildLogisticsSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/logisticsSheet.ts:L10 | neighbors=[index.ts, logisticsSheet.ts]
- "sheets_prepmobsheet_buildprepmobsheet": "buildPrepMobSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/prepMobSheet.ts:L31 | neighbors=[index.ts, prepMobSheet.ts]
- "sheets_prepmobsheet_iprepline": "IPrepLine" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/prepMobSheet.ts:L21 | neighbors=[prepMobSheet.ts, ICurrencyLine]
- "sheets_scopesheet_buildscopesheet": "buildScopeSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/scopeSheet.ts:L15 | neighbors=[index.ts, scopeSheet.ts]
- "sheets_supplierssheet_buildsupplierssheet": "buildSuppliersSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/suppliersSheet.ts:L18 | neighbors=[index.ts, suppliersSheet.ts]
- "smartbid20_smartbid20webpart_smartbid20webpart_getenvironmentmessage": "._getEnvironmentMessage()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L76 | neighbors=[SmartBid20WebPart, .onInit()]
- "smartbid20_smartbid20webpart_smartbid20webpart_oninit": ".onInit()" | kind=code-symbol | source=src/webparts/smartBid20/SmartBid20WebPart.ts:L43 | neighbors=[SmartBid20WebPart, ._getEnvironmentMessage()]
- "stores_useassetcatalogstore_useassetcatalogstore": "useAssetCatalogStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useAssetCatalogStore.ts:L18 | neighbors=[useQuerySearch.ts, useAssetCatalogStore.ts]
- "stores_usebidstore_bid_facet_values": "BID_FACET_VALUES" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L41 | neighbors=[BidTrackerPage.tsx, useBidStore.ts]
- "stores_usebidstore_bidmatchesfilters": "bidMatchesFilters()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L52 | neighbors=[BidTrackerPage.tsx, useBidStore.ts]
- "stores_usebidstore_viewmode": "ViewMode" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L5 | neighbors=[BidTrackerPage.tsx, useBidStore.ts]
- "stores_usebomcostanalysisstore_usebomcostanalysisstore": "useBomCostAnalysisStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBomCostAnalysisStore.ts:L18 | neighbors=[useQuerySearch.ts, useBomCostAnalysisStore.ts]
- "stores_usechatstore_usechatstore": "useChatStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useChatStore.ts:L38 | neighbors=[ChatAssistant.tsx, useChatStore.ts]
- "stores_usesupplierstore_isupplierentry": "ISupplierEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSupplierStore.ts:L29 | neighbors=[useRegisterQuotationSuppliers.ts, useSupplierStore.ts]
- "stores_useuistore_dashboardview": "DashboardView" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L10 | neighbors=[DashboardPage.tsx, useUIStore.ts]
- "stores_useuistore_toast": "Toast" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L12 | neighbors=[ToastContainer.tsx, useUIStore.ts]
- "suppliers_supplierdrawer_initials": "initials()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/suppliers/SupplierDrawer.tsx:L80 | neighbors=[SupplierDrawer.tsx, SupplierDrawer()]
- "survey_surveyassets_survey_fit_icons": "SURVEY_FIT_ICONS" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/surveyAssets.ts:L5 | neighbors=[surveyAssets.ts, SurveyEquipmentDetail.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-047.json

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
