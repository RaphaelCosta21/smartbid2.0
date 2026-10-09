# Node Description Batch 80 of 86

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

- "stores_usefavoritesstore_generateid": "generateId()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useFavoritesStore.ts:L65 | neighbors=[useFavoritesStore.ts]
- "stores_usenotificationstore_notificationstate": "NotificationState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useNotificationStore.ts:L4 | neighbors=[useNotificationStore.ts]
- "stores_usequerycatalogstore_arpnindex": "_arPnIndex" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L67 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_buildprefixindex": "buildPrefixIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L138 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_bumblpnindex": "_bumblPnIndex" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L69 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_bumbrpnindex": "_bumbrPnIndex" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L70 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_farpnindex": "_farPnIndex" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L71 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_foreachpnref": "forEachPnRef()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L78 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_mfg_ref_placeholders": "MFG_REF_PLACEHOLDERS" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L73 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_pspnindex": "_psPnIndex" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L68 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_pushalias": "pushAlias()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L112 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_querycatalogstate": "QueryCatalogState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L20 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_searchbysubstring": "searchBySubstring()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L177 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_searchinprefixindex": "searchInPrefixIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L158 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_tofarresult": "toFarResult()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L127 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequotationstore_generateid": "generateId()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQuotationStore.ts:L34 | neighbors=[useQuotationStore.ts]
- "stores_usequotationstore_quotationstate": "QuotationState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQuotationStore.ts:L10 | neighbors=[useQuotationStore.ts]
- "stores_userequeststore_requeststate": "RequestState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useRequestStore.ts:L7 | neighbors=[useRequestStore.ts]
- "stores_usesupplierstore_blanksupplier": "blankSupplier()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSupplierStore.ts:L73 | neighbors=[useSupplierStore.ts]
- "stores_usesupplierstore_byname": "byName()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSupplierStore.ts:L70 | neighbors=[useSupplierStore.ts]
- "stores_usesupplierstore_hasprofile": "hasProfile()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSupplierStore.ts:L88 | neighbors=[useSupplierStore.ts]
- "stores_usesupplierstore_iensuresuppliersresult": "IEnsureSuppliersResult" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSupplierStore.ts:L37 | neighbors=[useSupplierStore.ts]
- "stores_usesupplierstore_supplierstate": "SupplierState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSupplierStore.ts:L43 | neighbors=[useSupplierStore.ts]
- "stores_usesurveystore_default_filters": "DEFAULT_FILTERS" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSurveyStore.ts:L15 | neighbors=[useSurveyStore.ts]
- "stores_usesurveystore_surveyfilters": "SurveyFilters" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSurveyStore.ts:L11 | neighbors=[useSurveyStore.ts]
- "stores_usesurveystore_surveystate": "SurveyState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSurveyStore.ts:L19 | neighbors=[useSurveyStore.ts]
- "stores_usetemplatestore_templatestate": "TemplateState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useTemplateStore.ts:L8 | neighbors=[useTemplateStore.ts]
- "stores_useuistore_uistate": "UIState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L19 | neighbors=[useUIStore.ts]
- "suppliers_supplierdrawer_groupquotations": "groupQuotations()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/suppliers/SupplierDrawer.tsx:L46 | neighbors=[SupplierDrawer.tsx]
- "suppliers_supplierdrawer_iquotationgroup": "IQuotationGroup" | kind=code-symbol | source=src/webparts/smartBid20/app/components/suppliers/SupplierDrawer.tsx:L34 | neighbors=[SupplierDrawer.tsx]
- "suppliers_supplierdrawer_supplierdrawerprops": "SupplierDrawerProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/suppliers/SupplierDrawer.tsx:L20 | neighbors=[SupplierDrawer.tsx]
- "survey_surveyaddtopackagedialog_surveyaddtopackagedialogprops": "SurveyAddToPackageDialogProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyAddToPackageDialog.tsx:L6 | neighbors=[SurveyAddToPackageDialog.tsx]
- "survey_surveyequipmentcard_surveyequipmentcardprops": "SurveyEquipmentCardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentCard.tsx:L6 | neighbors=[SurveyEquipmentCard.tsx]
- "survey_surveyequipmentdetail_fiticon": "FitIcon()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentDetail.tsx:L36 | neighbors=[SurveyEquipmentDetail.tsx]
- "survey_surveyequipmentdetail_surveyequipmentdetailprops": "SurveyEquipmentDetailProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentDetail.tsx:L17 | neighbors=[SurveyEquipmentDetail.tsx]
- "survey_surveypackagedrawer_closed_statuses": "CLOSED_STATUSES" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPackageDrawer.tsx:L22 | neighbors=[SurveyPackageDrawer.tsx]
- "survey_surveypackagedrawer_surveypackagedrawerprops": "SurveyPackageDrawerProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPackageDrawer.tsx:L18 | neighbors=[SurveyPackageDrawer.tsx]
- "survey_surveyportalheader_surveyportalheaderprops": "SurveyPortalHeaderProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPortalHeader.tsx:L28 | neighbors=[SurveyPortalHeader.tsx]
- "survey_surveyportalheader_surveyrank": "surveyRank()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyPortalHeader.tsx:L38 | neighbors=[SurveyPortalHeader.tsx]
- "survey_surveyspreadpanel_maincategory": "mainCategory()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySpreadPanel.tsx:L25 | neighbors=[SurveySpreadPanel.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-079.json

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
