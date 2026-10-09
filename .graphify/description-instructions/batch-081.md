# Node Description Batch 82 of 86

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

- "survey3d_focuscontroller_nodeentry": "NodeEntry" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L12 | neighbors=[focusController.ts]
- "survey3d_focuscontroller_plinth": "PLINTH" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L30 | neighbors=[focusController.ts]
- "survey3d_scenetypes_scenenoderole": "SceneNodeRole" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/sceneTypes.ts:L19 | neighbors=[sceneTypes.ts]
- "survey3d_trunkflow_dotmat": "dotMat()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/trunkFlow.ts:L30 | neighbors=[trunkFlow.ts]
- "survey3d_trunkflow_linemat": "lineMat()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/trunkFlow.ts:L28 | neighbors=[trunkFlow.ts]
- "survey3d_trunkflow_trunk": "Trunk" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/trunkFlow.ts:L11 | neighbors=[trunkFlow.ts]
- "survey3d_trunkflow_trunknetwork_constructor": ".constructor()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/trunkFlow.ts:L50 | neighbors=[TrunkNetwork]
- "survey3d_trunkflow_trunknetwork_setenabled": ".setEnabled()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/trunkFlow.ts:L91 | neighbors=[TrunkNetwork]
- "survey3d_trunkflow_trunknetwork_sethover": ".setHover()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/trunkFlow.ts:L95 | neighbors=[TrunkNetwork]
- "survey3d_trunkflow_trunknetwork_setvisible": ".setVisible()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/trunkFlow.ts:L87 | neighbors=[TrunkNetwork]
- "survey3d_trunkflow_trunknetwork_update": ".update()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/trunkFlow.ts:L99 | neighbors=[TrunkNetwork]
- "template_templatecard_templatecardprops": "TemplateCardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateCard.tsx:L5 | neighbors=[TemplateCard.tsx]
- "template_templateeditor_templateeditorprops": "TemplateEditorProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateEditor.tsx:L16 | neighbors=[TemplateEditor.tsx]
- "template_templateimportwizard_templateimportwizard": "TemplateImportWizard()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateImportWizard.tsx:L12 | neighbors=[TemplateImportWizard.tsx]
- "template_templateimportwizard_templateimportwizardprops": "TemplateImportWizardProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateImportWizard.tsx:L5 | neighbors=[TemplateImportWizard.tsx]
- "template_templatepreview_templatepreviewprops": "TemplatePreviewProps" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplatePreview.tsx:L5 | neighbors=[TemplatePreview.tsx]
- "typings_pnp_sp_d_pnp_sp": "@pnp/sp" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L1 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spattachmentfiles": "SPAttachmentFiles" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L38 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spcurrentuser": "SPCurrentUser" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L71 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spfi": "SPFI" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L4 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spfile": "SPFile" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L56 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spfiles": "SPFiles" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L47 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spfolder": "SPFolder" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L43 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spitem": "SPItem" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L31 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spitems": "SPItems" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L21 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_splist": "SPList" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L18 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_splists": "SPLists" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L15 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spsiteuser": "SPSiteUser" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L67 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spsiteusers": "SPSiteUsers" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L60 | neighbors=[pnp-sp.d.ts]
- "typings_pnp_sp_d_spweb": "SPWeb" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L8 | neighbors=[pnp-sp.d.ts]
- "typings_svg_d_svg": "*.svg" | kind=code-symbol | source=src/typings/svg.d.ts:L1 | neighbors=[svg.d.ts]
- "typings_xlsx_d_cellobject": "CellObject" | kind=code-symbol | source=src/typings/xlsx.d.ts:L16 | neighbors=[xlsx.d.ts]
- "typings_xlsx_d_workbook": "WorkBook" | kind=code-symbol | source=src/typings/xlsx.d.ts:L2 | neighbors=[xlsx.d.ts]
- "typings_xlsx_d_worksheet": "WorkSheet" | kind=code-symbol | source=src/typings/xlsx.d.ts:L6 | neighbors=[xlsx.d.ts]
- "typings_xlsx_d_xlsx": "xlsx" | kind=code-symbol | source=src/typings/xlsx.d.ts:L1 | neighbors=[xlsx.d.ts]
- "utils_accesscontrol_access_map": "ACCESS_MAP" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L13 | neighbors=[accessControl.ts]
- "utils_accesscontrol_accessrule": "AccessRule" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L4 | neighbors=[accessControl.ts]
- "utils_accesscontrol_maybeconfig": "MaybeConfig" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L20 | neighbors=[accessControl.ts]
- "utils_accesscontrol_maybeuser": "MaybeUser" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L21 | neighbors=[accessControl.ts]
- "utils_accesscontrol_super_admin_emails": "SUPER_ADMIN_EMAILS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L98 | neighbors=[accessControl.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-081.json

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
