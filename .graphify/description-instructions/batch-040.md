# Node Description Batch 41 of 43

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

- "stores_usequerycatalogstore_pspnindex": "_psPnIndex" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L60 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_querycatalogstate": "QueryCatalogState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L18 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_searchbysubstring": "searchBySubstring()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L103 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequerycatalogstore_searchinprefixindex": "searchInPrefixIndex()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQueryCatalogStore.ts:L84 | neighbors=[useQueryCatalogStore.ts]
- "stores_usequotationstore_generateid": "generateId()" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQuotationStore.ts:L34 | neighbors=[useQuotationStore.ts]
- "stores_usequotationstore_quotationstate": "QuotationState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQuotationStore.ts:L10 | neighbors=[useQuotationStore.ts]
- "stores_userequeststore_requeststate": "RequestState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useRequestStore.ts:L7 | neighbors=[useRequestStore.ts]
- "stores_usetemplatestore_templatestate": "TemplateState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useTemplateStore.ts:L8 | neighbors=[useTemplateStore.ts]
- "stores_useuistore_toast": "Toast" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L5 | neighbors=[useUIStore.ts]
- "stores_useuistore_uistate": "UIState" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L12 | neighbors=[useUIStore.ts]
- "template_templatecard_templatecardprops": "TemplateCardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateCard.tsx:L5 | neighbors=[TemplateCard.tsx]
- "template_templateeditor_templateeditorprops": "TemplateEditorProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateEditor.tsx:L16 | neighbors=[TemplateEditor.tsx]
- "template_templateimportwizard_templateimportwizard": "TemplateImportWizard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateImportWizard.tsx:L12 | neighbors=[TemplateImportWizard.tsx]
- "template_templateimportwizard_templateimportwizardprops": "TemplateImportWizardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateImportWizard.tsx:L5 | neighbors=[TemplateImportWizard.tsx]
- "template_templatepreview_templatepreviewprops": "TemplatePreviewProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplatePreview.tsx:L5 | neighbors=[TemplatePreview.tsx]
- "typings_pnp_sp_d_pnp_sp": "@pnp/sp" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L1 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spcurrentuser": "SPCurrentUser" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L68 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spfi": "SPFI" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L4 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spfile": "SPFile" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L53 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spfiles": "SPFiles" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L44 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spfolder": "SPFolder" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L40 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spitem": "SPItem" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L31 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spitems": "SPItems" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L21 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_splist": "SPList" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L18 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_splists": "SPLists" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L15 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spsiteuser": "SPSiteUser" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L64 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spsiteusers": "SPSiteUsers" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L57 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spweb": "SPWeb" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L8 | neighbors=[pnp-sp.d.ts]
- "typings_svg_d_svg": "*.svg" | kind=code-symbol | source=src/typings/svg.d.ts:L1 | neighbors=[svg.d.ts]
- "typings_xlsx_d_cellobject": "CellObject" | kind=code-symbol | source=src/typings/xlsx.d.ts:L16 | neighbors=[xlsx.d.ts]
- "typings_xlsx_d_workbook": "WorkBook" | kind=code-symbol | source=src/typings/xlsx.d.ts:L2 | neighbors=[xlsx.d.ts]
- "typings_xlsx_d_worksheet": "WorkSheet" | kind=code-symbol | source=src/typings/xlsx.d.ts:L6 | neighbors=[xlsx.d.ts]
- "typings_xlsx_d_xlsx": "xlsx" | kind=code-symbol | source=src/typings/xlsx.d.ts:L1 | neighbors=[xlsx.d.ts]
- "utils_accesscontrol_access_map": "ACCESS_MAP" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L13 | neighbors=[accessControl.ts]
- "utils_accesscontrol_accessrule": "AccessRule" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L4 | neighbors=[accessControl.ts]
- "utils_accesscontrol_super_admin_emails": "SUPER_ADMIN_EMAILS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L98 | neighbors=[accessControl.ts]
- "utils_analyticshelpers_aggregate": "aggregate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L139 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_completionpoint": "CompletionPoint" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L237 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_daysbetween": "daysBetween()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L61 | neighbors=[analyticsHelpers.ts]
- "utils_analyticshelpers_default_terminal_statuses": "DEFAULT_TERMINAL_STATUSES" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/analyticsHelpers.ts:L26 | neighbors=[analyticsHelpers.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-040.json

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
