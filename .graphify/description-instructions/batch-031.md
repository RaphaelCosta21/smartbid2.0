# Node Description Batch 32 of 86

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

- "services_linksrecommendationsservice_linksrecommendationsservice_updatelink": ".updateLink()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L70 | neighbors=[LinksRecommendationsService, .getAll(), .save()]
- "services_linksrecommendationsservice_linksrecommendationsservice_updaterecommendation": ".updateRecommendation()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L92 | neighbors=[LinksRecommendationsService, .getAll(), .save()]
- "services_membersservice_membersservice_addmember": ".addMember()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L66 | neighbors=[MembersService, .getAll(), .save()]
- "services_membersservice_membersservice_removemember": ".removeMember()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L81 | neighbors=[MembersService, .getAll(), .save()]
- "services_membersservice_membersservice_savepreferences": ".savePreferences()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L88 | neighbors=[MembersService, .getAll(), .save()]
- "services_membersservice_membersservice_updatemember": ".updateMember()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/MembersService.ts:L72 | neighbors=[MembersService, .getAll(), .save()]
- "services_notificationdispatchservice_appurl": "appUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationDispatchService.ts:L39 | neighbors=[NotificationDispatchService.ts, .emit(), .sendTest()]
- "services_notificationdispatchservice_notificationdispatchservice_emit": ".emit()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationDispatchService.ts:L57 | neighbors=[NotificationDispatchService, appUrl(), post()]
- "services_notificationdispatchservice_notificationdispatchservice_sendtest": ".sendTest()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationDispatchService.ts:L109 | neighbors=[NotificationDispatchService, appUrl(), post()]
- "services_notificationdispatchservice_post": "post()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationDispatchService.ts:L42 | neighbors=[NotificationDispatchService.ts, .emit(), .sendTest()]
- "services_qualificationdbservice_isnotfound": "isNotFound()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L21 | neighbors=[QualificationDbService.ts, .getAll(), ._provision()]
- "services_qualificationdbservice_qualificationdbservice_create": ".create()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QualificationDbService.ts:L157 | neighbors=[QualificationDbService, .ensureList(), ._mapToSP()]
- "services_querycatalogservice_querycatalogservice_loadfinancialsactiveregistered": ".loadFinancialsActiveRegistered()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L104 | neighbors=[QueryCatalogService, .loadCatalog(), .parseFinancialsActiveRegistered()]
- "services_quotationservice_quotationservice_additems": ".addItems()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L243 | neighbors=[QuotationService, .ensureColumns(), ._toRow()]
- "services_quotationservice_quotationservice_findrowid": "._findRowId()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L157 | neighbors=[QuotationService, .deleteItem(), .updateItem()]
- "services_supplierservice_joinkeywords": "joinKeywords()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L93 | neighbors=[SupplierService.ts, .updateProfile(), toFields()]
- "services_supplierservice_supplierservice_clearlogo": "._clearLogo()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L284 | neighbors=[SupplierService, ._setLogo(), .update()]
- "services_supplierservice_validatelogo": "validateLogo()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L49 | neighbors=[SuppliersRegistry.tsx, SupplierService.ts, ._setLogo()]
- "services_surveycatalogservice_surveycatalogservice_ensurelist": ".ensureList()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L43 | neighbors=[SurveyCatalogService, ._provision(), .importCatalog()]
- "services_technicalproposalknowledgeservice_technicalproposalknowledgeservice_buildmetadata": "._buildMetadata()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L171 | neighbors=[TechnicalProposalKnowledgeService, cut(), .publish()]
- "services_technicalproposalknowledgeservice_technicalproposalknowledgeservice_ensurefolder": "._ensureFolder()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TechnicalProposalKnowledgeService.ts:L218 | neighbors=[TechnicalProposalKnowledgeService, ._createFolderIfMissing(), .publish()]
- "services_templateservice_templateservice_getbyid": ".getById()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L81 | neighbors=[TemplateService, .deleteTemplate(), .update()]
- "services_templateservice_templateservice_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L112 | neighbors=[TemplateService, .create(), .getById()]
- "settings_approvalrulesconfig": "ApprovalRulesConfig.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/ApprovalRulesConfig.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ApprovalRulesConfig()]
- "settings_notificationmatrix_pilltitle": "pillTitle()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L140 | neighbors=[NotificationMatrix.tsx, audienceParts(), teamLabel()]
- "settings_notificationmatrix_teamlabel": "teamLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L118 | neighbors=[NotificationMatrix.tsx, pillTitle(), TeamRuleEditor()]
- "settings_notificationmatrix_teamruleeditor": "TeamRuleEditor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/NotificationMatrix.tsx:L411 | neighbors=[NotificationMatrix.tsx, audienceParts(), teamLabel()]
- "sheets_assetssheet_buildassetssheet": "buildAssetsSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/assetsSheet.ts:L27 | neighbors=[index.ts, assetsSheet.ts, fmtBRL()]
- "sheets_infosheet_buildinfosheet": "buildInfoSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/infoSheet.ts:L20 | neighbors=[index.ts, infoSheet.ts, people()]
- "stores_usenotificationstore_usenotificationstore": "useNotificationStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useNotificationStore.ts:L16 | neighbors=[Header.tsx, NotificationsPage.tsx, useNotificationStore.ts]
- "stores_userequeststore_userequeststore": "useRequestStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useRequestStore.ts:L18 | neighbors=[useRequests.ts, CreateRequestPage.tsx, useRequestStore.ts]
- "stores_usetemplatestore_usetemplatestore": "useTemplateStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useTemplateStore.ts:L25 | neighbors=[ImportSourceModal.tsx, useTemplates.ts, useTemplateStore.ts]
- "stores_useuistore_thememode": "ThemeMode" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L7 | neighbors=[Header.tsx, SystemConfiguration.tsx, useUIStore.ts]
- "suppliers_supplierdrawer_supplierdrawer": "SupplierDrawer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/suppliers/SupplierDrawer.tsx:L88 | neighbors=[SuppliersRegistry.tsx, SupplierDrawer.tsx, initials()]
- "survey_surveyaddtopackagedialog_surveyaddtopackagedialog": "SurveyAddToPackageDialog()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyAddToPackageDialog.tsx:L14 | neighbors=[SurveyEquipmentPage.tsx, SurveySystemPage.tsx, SurveyAddToPackageDialog.tsx]
- "survey_surveyequipmentcard_surveyequipmentphoto": "SurveyEquipmentPhoto()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentCard.tsx:L16 | neighbors=[SurveyEquipmentCard.tsx, SurveyEquipmentDetail.tsx, SurveyPackageDrawer.tsx]
- "survey_surveypackagedrawer_surveypackagedrawer": "SurveyPackageDrawer()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPackageDrawer.tsx:L24 | neighbors=[SurveyEquipmentPage.tsx, SurveySystemPage.tsx, SurveyPackageDrawer.tsx]
- "survey_surveyportalheader_surveyportalheader": "SurveyPortalHeader()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPortalHeader.tsx:L41 | neighbors=[SurveyEquipmentPage.tsx, SurveySystemPage.tsx, SurveyPortalHeader.tsx]
- "survey3d_cableflow_cablenetwork_applytrace": ".applyTrace()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L161 | neighbors=[CableNetwork, .build(), .setTrace()]
- "survey3d_cableflow_cablenetwork_build": ".build()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L54 | neighbors=[CableNetwork, .applyTrace(), .clear()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-031.json

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
