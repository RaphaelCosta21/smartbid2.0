# Node Description Batch 56 of 102

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

- "services_supplierservice_parsecontacts": "parseContacts()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L100 | neighbors=[SupplierService.ts, toModel()]
- "services_supplierservice_splitlines": "splitLines()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L78 | neighbors=[SupplierService.ts, toModel()]
- "services_supplierservice_splitlist": "splitList()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L69 | neighbors=[SupplierService.ts, toModel()]
- "services_supplierservice_supplierservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L211 | neighbors=[SupplierService, .columns()]
- "services_supplierservice_supplierservice_provisioncolumns": "._provisionColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L182 | neighbors=[SupplierService, .columns()]
- "services_surveycatalogservice_surveycatalogservice_importcatalog": ".importCatalog()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L307 | neighbors=[SurveyCatalogService, .ensureList()]
- "services_surveycatalogservice_surveycatalogservice_provision": "._provision()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L53 | neighbors=[SurveyCatalogService, .ensureList()]
- "services_technicalproposalknowledgeservice_cut": "cut()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L34 | neighbors=[TechnicalProposalKnowledgeService.ts, ._buildMetadata()]
- "services_technicalproposalknowledgeservice_technicalproposalknowledgeservice_createfolderifmissing": "._createFolderIfMissing()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L232 | neighbors=[TechnicalProposalKnowledgeService, ._ensureFolder()]
- "services_technicalproposalknowledgeservice_technicalproposalknowledgeservice_ensurecolumns": "._ensureColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L245 | neighbors=[TechnicalProposalKnowledgeService, .publish()]
- "services_technicalproposalknowledgeservice_technicalproposalknowledgeservice_filename": ".fileName()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L48 | neighbors=[TechnicalProposalKnowledgeService, .publish()]
- "services_templateservice_templateservice_create": ".create()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L102 | neighbors=[TemplateService, .update()]
- "services_templateservice_templateservice_deletetemplate": ".deleteTemplate()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L131 | neighbors=[TemplateService, .getById()]
- "settings_accesslog_accesslog": "AccessLog()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessLog.tsx:L51 | neighbors=[AccessLog.tsx, SystemConfiguration.tsx]
- "settings_accessmatrix_accesslegend": "AccessLegend()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L111 | neighbors=[AccessMatrix.tsx, SystemConfiguration.tsx]
- "settings_accessmatrix_accessmatrix": "AccessMatrix()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L159 | neighbors=[AccessMatrix.tsx, SystemConfiguration.tsx]
- "settings_accessmatrix_iaccessmatrixgroup": "IAccessMatrixGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L22 | neighbors=[AccessMatrix.tsx, SystemConfiguration.tsx]
- "settings_accessmatrix_superadminscard": "SuperAdminsCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessMatrix.tsx:L135 | neighbors=[AccessMatrix.tsx, SystemConfiguration.tsx]
- "settings_notificationmatrix_notificationdeliverycard": "NotificationDeliveryCard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L271 | neighbors=[NotificationMatrix.tsx, SystemConfiguration.tsx]
- "settings_notificationmatrix_notificationlegend": "NotificationLegend()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L218 | neighbors=[NotificationMatrix.tsx, SystemConfiguration.tsx]
- "settings_notificationmatrix_notificationmatrix": "NotificationMatrix()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L599 | neighbors=[NotificationMatrix.tsx, SystemConfiguration.tsx]
- "settings_notificationmatrix_pillclass": "pillClass()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L151 | neighbors=[NotificationMatrix.tsx, audienceParts()]
- "settings_notificationmatrix_pilltext": "pillText()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L134 | neighbors=[NotificationMatrix.tsx, audienceParts()]
- "settings_notificationmatrix_reachesteam": "reachesTeam()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L130 | neighbors=[NotificationMatrix.tsx, audienceParts()]
- "settings_patchnotes_patchnotes": "PatchNotes()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/PatchNotes.tsx:L10 | neighbors=[PatchNotesPage.tsx, PatchNotes.tsx]
- "settings_systemconfiguration_geteditablepriorityrules": "getEditablePriorityRules()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L276 | neighbors=[SystemConfiguration.tsx, SystemConfiguration()]
- "settings_systemconfiguration_systemconfiguration": "SystemConfiguration()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/SystemConfiguration.tsx:L433 | neighbors=[SystemConfiguration.tsx, getEditablePriorityRules()]
- "sheets_assetssheet_fmtbrl": "fmtBRL()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/assetsSheet.ts:L300 | neighbors=[assetsSheet.ts, buildAssetsSheet()]
- "sheets_certificationssheet_buildcertificationssheet": "buildCertificationsSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/certificationsSheet.ts:L10 | neighbors=[index.ts, certificationsSheet.ts]
- "sheets_costsummarysheet_buildcostsummarysheet": "buildCostSummarySheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/costSummarySheet.ts:L12 | neighbors=[index.ts, costSummarySheet.ts]
- "sheets_currencytable_curcode": "curCode()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/currencyTable.ts:L26 | neighbors=[currencyTable.ts, moneyCell()]
- "sheets_currencytable_fxnotes": "fxNotes()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/currencyTable.ts:L48 | neighbors=[currencyTable.ts, writeCurrencyFooter()]
- "sheets_currencytable_icurrencyline": "ICurrencyLine" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/currencyTable.ts:L14 | neighbors=[currencyTable.ts, prepMobSheet.ts]
- "sheets_hourssheet_writeengineeringitems": "writeEngineeringItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/hoursSheet.ts:L285 | neighbors=[hoursSheet.ts, buildHoursSheet()]
- "sheets_hourssheet_writehourstable": "writeHoursTable()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/hoursSheet.ts:L226 | neighbors=[hoursSheet.ts, buildHoursSheet()]
- "sheets_infosheet_people": "people()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/infoSheet.ts:L14 | neighbors=[infoSheet.ts, buildInfoSheet()]
- "sheets_logisticssheet_buildlogisticssheet": "buildLogisticsSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/logisticsSheet.ts:L10 | neighbors=[index.ts, logisticsSheet.ts]
- "sheets_prepmobsheet_buildprepmobsheet": "buildPrepMobSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/prepMobSheet.ts:L31 | neighbors=[index.ts, prepMobSheet.ts]
- "sheets_prepmobsheet_iprepline": "IPrepLine" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/prepMobSheet.ts:L21 | neighbors=[prepMobSheet.ts, ICurrencyLine]
- "sheets_scopesheet_buildscopesheet": "buildScopeSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/scopeSheet.ts:L15 | neighbors=[index.ts, scopeSheet.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-055.json

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
