# Node Description Batch 28 of 86

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
For an entity node (any other kind — e.g. a person, place, event, object),
describe what the entity is and its role, grounded in its type, its
relations (neighbors) and the provided citations/evidence — e.g.
"Lady Carfax, a wealthy heiress who disappears en route to Lausanne.".
Ground entity descriptions in the citations/evidence when present; do not
speculate beyond the context, so a node with no supporting context may be
left out of the reply.
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "bid_revisionstab_hasactiverevision": "hasActiveRevision()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L36 | neighbors=[OverviewTab.tsx, RevisionsTab.tsx, BidDetailPage.tsx]
- "bid_technicalproposalchip_technicalproposalchip": "TechnicalProposalChip()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/TechnicalProposalChip.tsx:L23 | neighbors=[DocumentsTab.tsx, OverviewTab.tsx, TechnicalProposalChip.tsx]
- "bidexcelexport_context_getbidapprovalstate": "getBidApprovalState()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/context.ts:L77 | neighbors=[BidExportTab.tsx, context.ts, index.ts]
- "bidexcelexport_index_exportbidtoexcel": "exportBidToExcel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/index.ts:L54 | neighbors=[BidExportTab.tsx, index.ts, getBidExcelFilename()]
- "bidexcelexport_index_getbidexcelfilename": "getBidExcelFilename()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/index.ts:L39 | neighbors=[BidExportTab.tsx, index.ts, exportBidToExcel()]
- "bidexcelexport_rows_groupbysection": "groupBySection()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L65 | neighbors=[rows.ts, buildAssetSummary(), scopeSheet.ts]
- "bidexcelexport_rows_scopemapof": "scopeMapOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L90 | neighbors=[rows.ts, buildAssetSummary(), buildSupplierRows()]
- "bidexcelexport_rows_summarizesuppliers": "summarizeSuppliers()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L551 | neighbors=[BidExportTab.tsx, rows.ts, suppliersSheet.ts]
- "bidexcelexport_runtime_loadexceljs": "loadExcelJS()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/runtime.ts:L13 | neighbors=[index.ts, runtime.ts, clarificationExcelExport.ts]
- "bidexcelexport_runtime_loadlogodataurl": "loadLogoDataUrl()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/runtime.ts:L23 | neighbors=[index.ts, runtime.ts, clarificationExcelExport.ts]
- "bidexcelexport_runtime_sanitizefilepart": "sanitizeFilePart()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/runtime.ts:L41 | neighbors=[index.ts, runtime.ts, clarificationExcelExport.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@2b67088eeeb1d6db427afb67b8e3ce9a4cde6917": "2b67088 commit final Survey Knowledge & traduçao EN EASI" | kind=Commit | source=git | neighbors=[main, ddf6c96 Merge branch 'feat/survey-knowl…, 8267c28 i18n: translate EASI, suppliers…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@5ba1094dd8eb0c59c51552c23d5fb4bc2c2c1cea": "5ba1094 style(survey): spread card pure glass, readable drawing eyebrow" | kind=Commit | source=git | neighbors=[main, d574851 style(survey): calmer overview …, fbe2c0e feat(survey): remove division/s…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@8f7062d7348739499b9429de72405558366ce398": "8f7062d Remove outdated UI/UX design guide and related configurations; add new …" | kind=Commit | source=git | neighbors=[27f41ab refactor: improve code formatti…, main, MembersManagement.tsx]
- "common_aianalyzermodal_aianalyzermodal": "AIAnalyzerModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIAnalyzerModal.tsx:L23 | neighbors=[ScopeOfSupplyTab.tsx, AIAnalyzerModal.tsx, TemplatesPage.tsx]
- "common_editlockbanner_edittoolbar": "EditToolbar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EditLockBanner.tsx:L65 | neighbors=[QualificationsTab.tsx, EditLockBanner.tsx, TemplateEditor.tsx]
- "common_guidedtour_revealtarget": "revealTarget()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L103 | neighbors=[GuidedTour.tsx, getScrollParent(), prefersReducedMotion()]
- "common_importsourcemodal_importsourcemodal": "ImportSourceModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceModal.tsx:L30 | neighbors=[BidHoursTable.tsx, ScopeOfSupplyTab.tsx, ImportSourceModal.tsx]
- "common_integrateddivisiontabs_integrateddivisiontabs": "IntegratedDivisionTabs()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L52 | neighbors=[IntegratedDivisionTabs.tsx, resolveDivisions(), BidDetailPage.tsx]
- "common_integrateddivisiontabs_resolvedivisions": "resolveDivisions()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L44 | neighbors=[IntegratedDivisionTabs.tsx, IntegratedDivisionTabs(), BidDetailPage.tsx]
- "common_peoplepicker_ipickedperson": "IPickedPerson" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PeoplePicker.tsx:L10 | neighbors=[ErnCreateModal.tsx, PeoplePicker.tsx, IGraphResult]
- "common_suppliercombobox_suppliercombobox": "SupplierCombobox()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SupplierCombobox.tsx:L25 | neighbors=[AddQuotationModal.tsx, SupplierCombobox.tsx, QuotationsPage.tsx]
- "components_ismartbid20props_ismartbid20props": "ISmartBid20Props" | kind=code-symbol | source=src/webparts/smartBid20/components/ISmartBid20Props.ts:L3 | neighbors=[ISmartBid20Props.ts, SmartBid20.tsx, SmartBid20WebPart.ts]
- "components_smartbid20_smartbid20": "SmartBid20" | kind=code-symbol | source=src/webparts/smartBid20/components/SmartBid20.tsx:L8 | neighbors=[SmartBid20.tsx, .componentDidMount(), .render()]
- "config_accesscontrol_config_normalizeaccessconfig": "normalizeAccessConfig()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L279 | neighbors=[accessControl.config.ts, normalizeAccessLevels(), normalizeBidAccessLevels()]
- "config_defaultfavoritegroups_getdefaultfavoritegroups": "getDefaultFavoriteGroups()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/defaultFavoriteGroups.ts:L26 | neighbors=[defaultFavoriteGroups.ts, makeGroup(), defaultSystemConfig.ts]
- "config_defaultfavoritegroups_makegroup": "makeGroup()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/defaultFavoriteGroups.ts:L13 | neighbors=[defaultFavoriteGroups.ts, getDefaultFavoriteGroups(), nextId()]
- "config_notifications_config_teamrule": "teamRule()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L240 | neighbors=[notifications.config.ts, buildDefaultRule(), normalizeTeamRule()]
- "config_phases_config_getphaseconfig": "getPhaseConfig()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L277 | neighbors=[phases.config.ts, getPhaseLabel(), getPhaseTasks()]
- "dashboard_enghoursranking_enghoursranking": "EngHoursRanking()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursRanking.tsx:L32 | neighbors=[EngHoursOutlook.tsx, EngHoursRanking.tsx, DashboardPage.tsx]
- "data_mocknotifications": "mockNotifications.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockNotifications.ts:L1 | neighbors=[fe3728a smartbid2.0, MOCK_NOTIFICATIONS, index.ts]
- "data_mocktemplates": "mockTemplates.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockTemplates.ts:L1 | neighbors=[fe3728a smartbid2.0, IBidTemplate, MOCK_TEMPLATES]
- "function_app_document_structure_is_title_case": "_is_title_case()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L117 | neighbors=[document_structure.py, _heading(), _has_letters()]
- "function_app_document_structure_letter_count": "_letter_count()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L107 | neighbors=[document_structure.py, _has_word(), _heading()]
- "function_app_function_app_bad_request": "_bad_request()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L261 | neighbors=[function_app.py, extract_quotation(), generate_scope()]
- "function_app_function_app_clarification_library_block": "_clarification_library_block()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L617 | neighbors=[function_app.py, generate_scope(), suggest_clarifications()]
- "function_app_function_app_odata_literal": "_odata_literal()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L443 | neighbors=[function_app.py, _chat_past_bid_material(), _not_this_bid()]
- "function_app_function_app_parent_key": "_parent_key()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L439 | neighbors=[function_app.py, _chat_past_bid_material(), _group_by_document()]
- "function_app_function_app_past_bid_refs": "_past_bid_refs()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L937 | neighbors=[function_app.py, chat(), _bid_ref()]
- "function_app_function_app_unreadable": "_unreadable()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L249 | neighbors=[function_app.py, extract_quotation(), generate_scope()]

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
