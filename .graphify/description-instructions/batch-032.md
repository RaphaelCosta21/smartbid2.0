# Node Description Batch 33 of 102

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

- "bid_quotationstatuschip_quotationstatuschip": "QuotationStatusChip()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QuotationStatusChip.tsx:L15 | neighbors=[LinkedQuotationsPanel.tsx, QuotationControlPanel.tsx, QuotationStatusChip.tsx]
- "bid_revisionstab_getactiverevision": "getActiveRevision()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L41 | neighbors=[DueDateChangeModal.tsx, RevisionsTab.tsx, RevisionsTab()]
- "bid_revisionstab_getrevisionletter": "getRevisionLetter()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L19 | neighbors=[BidStatusPhasePanel.tsx, RevisionsTab.tsx, RevisionsTab()]
- "bid_revisionstab_hasactiverevision": "hasActiveRevision()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L36 | neighbors=[OverviewTab.tsx, RevisionsTab.tsx, BidDetailPage.tsx]
- "bid_technicalproposalchip_technicalproposalchip": "TechnicalProposalChip()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/TechnicalProposalChip.tsx:L23 | neighbors=[DocumentsTab.tsx, OverviewTab.tsx, TechnicalProposalChip.tsx]
- "bidexcelexport_context_getbidapprovalstate": "getBidApprovalState()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/context.ts:L77 | neighbors=[BidExportTab.tsx, context.ts, index.ts]
- "bidexcelexport_excelstyles_currencyfmt": "currencyFmt()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L82 | neighbors=[excelStyles.ts, currencyTable.ts, bomExcelExport.ts]
- "bidexcelexport_excelstyles_xl_tab_colors": "XL_TAB_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L49 | neighbors=[context.ts, excelStyles.ts, bomExcelExport.ts]
- "bidexcelexport_index_exportbidtoexcel": "exportBidToExcel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/index.ts:L54 | neighbors=[BidExportTab.tsx, index.ts, getBidExcelFilename()]
- "bidexcelexport_index_getbidexcelfilename": "getBidExcelFilename()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/index.ts:L39 | neighbors=[BidExportTab.tsx, index.ts, exportBidToExcel()]
- "bidexcelexport_rows_groupbysection": "groupBySection()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L65 | neighbors=[rows.ts, buildAssetSummary(), scopeSheet.ts]
- "bidexcelexport_rows_scopemapof": "scopeMapOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L90 | neighbors=[rows.ts, buildAssetSummary(), buildSupplierRows()]
- "bidexcelexport_rows_summarizesuppliers": "summarizeSuppliers()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L551 | neighbors=[BidExportTab.tsx, rows.ts, suppliersSheet.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@b80f76bcabd21b47907a8f6688175c99dab640e6": "b80f76b style(survey): solid panel backgrounds and higher-contrast text (no tra…" | kind=Commit | source=git | neighbors=[main, 568e582 Merge feat/survey-journey-accur…, da217d4 feat(survey): physical-signal e…]
- "common_aianalyzermodal_aianalyzermodal": "AIAnalyzerModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIAnalyzerModal.tsx:L23 | neighbors=[ScopeOfSupplyTab.tsx, AIAnalyzerModal.tsx, TemplatesPage.tsx]
- "common_bidselect_multibidselect": "MultiBidSelect()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/BidSelect.tsx:L145 | neighbors=[BidSelect.tsx, useOutsideClose(), ComparatorSetup.tsx]
- "common_bidselect_useoutsideclose": "useOutsideClose()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/BidSelect.tsx:L33 | neighbors=[BidSelect.tsx, BidSelect(), MultiBidSelect()]
- "common_editlockbanner_edittoolbar": "EditToolbar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EditLockBanner.tsx:L65 | neighbors=[QualificationsTab.tsx, EditLockBanner.tsx, TemplateEditor.tsx]
- "common_guidedtour_revealtarget": "revealTarget()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L103 | neighbors=[GuidedTour.tsx, getScrollParent(), prefersReducedMotion()]
- "common_importsourcemodal_importsourcemodal": "ImportSourceModal()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceModal.tsx:L30 | neighbors=[BidHoursTable.tsx, ScopeOfSupplyTab.tsx, ImportSourceModal.tsx]
- "common_integrateddivisiontabs_divisioncontext": "DivisionContext" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L41 | neighbors=[BidTabHeader.tsx, ScopeOfSupplyTab.tsx, IntegratedDivisionTabs.tsx]
- "common_integrateddivisiontabs_integrateddivisiontabs": "IntegratedDivisionTabs()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L56 | neighbors=[IntegratedDivisionTabs.tsx, resolveDivisions(), BidDetailPage.tsx]
- "common_integrateddivisiontabs_resolvedivisions": "resolveDivisions()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/IntegratedDivisionTabs.tsx:L46 | neighbors=[IntegratedDivisionTabs.tsx, IntegratedDivisionTabs(), BidDetailPage.tsx]
- "common_peoplepicker_ipickedperson": "IPickedPerson" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PeoplePicker.tsx:L10 | neighbors=[ErnCreateModal.tsx, PeoplePicker.tsx, IGraphResult]
- "common_suppliercombobox_suppliercombobox": "SupplierCombobox()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SupplierCombobox.tsx:L25 | neighbors=[AddQuotationModal.tsx, SupplierCombobox.tsx, QuotationsPage.tsx]
- "comparator_comparisonsummary_comparisonsummary": "ComparisonSummary()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonSummary.tsx:L31 | neighbors=[ComparisonSummary.tsx, varianceToken(), BidComparatorPage.tsx]
- "components_ismartbid20props_ismartbid20props": "ISmartBid20Props" | kind=code-symbol | source=src/webparts/smartBid20/components/ISmartBid20Props.ts:L3 | neighbors=[ISmartBid20Props.ts, SmartBid20.tsx, SmartBid20WebPart.ts]
- "components_smartbid20_smartbid20": "SmartBid20" | kind=code-symbol | source=src/webparts/smartBid20/components/SmartBid20.tsx:L8 | neighbors=[SmartBid20.tsx, .componentDidMount(), .render()]
- "config_accesscontrol_config_normalizeaccessconfig": "normalizeAccessConfig()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/accessControl.config.ts:L279 | neighbors=[accessControl.config.ts, normalizeAccessLevels(), normalizeBidAccessLevels()]
- "config_comparator_config": "comparator.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/comparator.config.ts:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, COMPARATOR_CONFIG]
- "config_defaultfavoritegroups_getdefaultfavoritegroups": "getDefaultFavoriteGroups()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/defaultFavoriteGroups.ts:L26 | neighbors=[defaultFavoriteGroups.ts, makeGroup(), defaultSystemConfig.ts]
- "config_defaultfavoritegroups_makegroup": "makeGroup()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/defaultFavoriteGroups.ts:L13 | neighbors=[defaultFavoriteGroups.ts, getDefaultFavoriteGroups(), nextId()]
- "config_notifications_config_teamrule": "teamRule()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/notifications.config.ts:L251 | neighbors=[notifications.config.ts, buildDefaultRule(), normalizeTeamRule()]
- "config_phases_config_getphaseconfig": "getPhaseConfig()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L277 | neighbors=[phases.config.ts, getPhaseLabel(), getPhaseTasks()]
- "config_surveydataformats_journey_ui": "JOURNEY_UI" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyDataFormats.ts:L561 | neighbors=[surveyDataFormats.ts, SurveySystemPage.tsx, surveyDataJourney.ts]
- "config_surveyglossary_nmea_lab_samples": "NMEA_LAB_SAMPLES" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyGlossary.ts:L83 | neighbors=[surveyGlossary.ts, SurveyGlossary.tsx, SurveyNmeaLab.tsx]
- "config_surveyglossary_survey_glossary": "SURVEY_GLOSSARY" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyGlossary.ts:L117 | neighbors=[surveyGlossary.ts, SurveyGlossary.tsx, surveyGlossary.ts]
- "dashboard_enghoursranking_enghoursranking": "EngHoursRanking()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/EngHoursRanking.tsx:L32 | neighbors=[EngHoursOutlook.tsx, EngHoursRanking.tsx, DashboardPage.tsx]
- "data_mocknotifications": "mockNotifications.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockNotifications.ts:L1 | neighbors=[fe3728a smartbid2.0, MOCK_NOTIFICATIONS, index.ts]
- "data_mocktemplates": "mockTemplates.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/data/mockTemplates.ts:L1 | neighbors=[fe3728a smartbid2.0, IBidTemplate, MOCK_TEMPLATES]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-032.json

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
