# Node Description Batch 9 of 102

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

- "sheets_supplierssheet": "suppliersSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/suppliersSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, context.ts]
- "typings_pnp_sp_d": "pnp-sp.d.ts" | kind=code-symbol | source=src/typings/pnp-sp.d.ts:L1 | neighbors=[0e653cd more mods, 2b1ed14 feat: add useApprovalSync hook …, 3f57ca9 merge: integrate EASI module pa…, 4c2e63a update smartbid 2.0, 6d20432 feat: adiciona paginas EASI ao …, 79354cb Merge remote-tracking branch 'o…]
- "bid_bidconfidentialbutton": "BidConfidentialButton.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidConfidentialButton.tsx:L1 | neighbors=[BidConfidentialButton(), BidConfidentialButtonProps, names(), ConfidentialAccessModal.tsx, ConfidentialAccessModal(), useCurrentUser.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@512f7b1940f82acbe73ce7403f658dfa6321acc2": "512f7b1 feat(survey): full-bleed 3D sea, compact header (search hits, BID compa…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, fbe2c0e feat(survey): remove division/s…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@adc0d383b3d1f138872fac30218fb4d06f96db6a": "adc0d38 Refactor TemplatesPage: Enhance filtering and sorting functionality" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, BidActivityLog.tsx, EquipmentImportModal.tsx, RevisionsTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@e61a9d3f9a6c1d9ff9604eae1b8eaffa7925988b": "e61a9d3 feat: add notification system for SmartBID events" | kind=Commit | source=git | neighbors=[3ae3801 refactor: improve code formatti…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, dbc974b Refactor email template HTML fo…, bidRoles.config.ts]
- "common_editlockbanner": "EditLockBanner.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EditLockBanner.tsx:L1 | neighbors=[BidTabHeader.tsx, OverviewTab.tsx, QualificationsTab.tsx, 0546310 Add dashboard components and st…, 3c5c37b more-mods, 79354cb Merge remote-tracking branch 'o…]
- "common_skeletonloader_skeletonloader": "SkeletonLoader()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SkeletonLoader.tsx:L12 | neighbors=[EquipmentImportModal.tsx, ImportClarificationModal.tsx, ImportQualificationModal.tsx, QuotationControlPanel.tsx, RequirePageAccess.tsx, SkeletonLoader.tsx]
- "data_defaultsystemconfig": "defaultSystemConfig.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/data/defaultSystemConfig.ts:L1 | neighbors=[0e653cd more mods, 165493f NEW-MODIFIC, 2538d01 feat: Implement Access Matrix c…, 3c5c37b more-mods, 54fea3b feat: Enhance Part Number Autoc…, 5577aab feat: Add Technical Proposal fu…]
- "effects_effectutils": "effectUtils.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectUtils.ts:L1 | neighbors=[568e582 Merge feat/survey-journey-accur…, da217d4 feat(survey): physical-signal e…, applyFade(), arcGizmo(), arrowGeometry(), COLORS]
- "effects_vesseleffects": "vesselEffects.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/vesselEffects.ts:L1 | neighbors=[568e582 Merge feat/survey-journey-accur…, da217d4 feat(survey): physical-signal e…, index.ts, effectTypes.ts, EffectBuilder, EffectContext]
- "hooks_usebids_usebids": "useBids()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useBids.ts:L9 | neighbors=[useBids.ts, AnalyticsPage.tsx, BidBoardPage.tsx, BidComparatorPage.tsx, BidDetailsReportPage.tsx, BidResultsPage.tsx]
- "utils_surveyfreescene": "surveyFreeScene.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyFreeScene.ts:L1 | neighbors=[4fd375f feat(survey): free 3D compositi…, f672a54 Refactor code structure for imp…, SurveySystemPage.tsx, SurveyComposition3D.tsx, SurveyPortalHeader.tsx, index.ts]
- "bid_engineeringhourssection": "EngineeringHoursSection.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EngineeringHoursSection.tsx:L1 | neighbors=[BidHoursTable.tsx, EditItemModalState, EngineeringHoursSection(), EngineeringHoursSectionProps, INITIAL_MODAL, index.ts]
- "charts_charttooltip": "ChartTooltip.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/ChartTooltip.tsx:L1 | neighbors=[ChartTooltip(), ChartTooltipEntry, ChartTooltipProps, ParetoChart.tsx, c271ce8 Refactor code structure for imp…, BidsByDivisionChart.tsx]
- "config_surveyglossary": "surveyGlossary.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/surveyGlossary.ts:L1 | neighbors=[0b9cb22 refactor(survey): remove Missio…, 3d59093 Merge feat/survey-data-journey …, 568e582 Merge feat/survey-journey-accur…, 61c46c8 fix(survey): offshore Brazil GG…, 90a8e89 fix(survey): correct data journ…, d614a0b feat(survey): bilingual survey …]
- "dashboard_dashboardperiodbar": "DashboardPeriodBar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardPeriodBar.tsx:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, DashboardPeriodBar(), DashboardPeriodBarProps, DATE_FIELD_LABEL, DATE_FIELDS]
- "hooks_usepageaccess_usepageaccess": "usePageAccess()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/usePageAccess.ts:L22 | neighbors=[usePageAccess.ts, BomCostsPage.tsx, ClarificationsDbPage.tsx, DatasheetsPage.tsx, FavoritesPage.tsx, FollowUpPage.tsx]
- "insights_multiselectdropdown_multiselectdropdown": "MultiSelectDropdown()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/MultiSelectDropdown.tsx:L25 | neighbors=[ImportClarificationModal.tsx, ImportQualificationModal.tsx, BomQuotationPicker.tsx, DashboardFilterBar.tsx, DashboardPeriodBar.tsx, AnalyticsFilterBar.tsx]
- "pages_toolingreportpage": "ToolingReportPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ToolingReportPage.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, AppLayout.tsx, DataTable.tsx, DataTable(), DivisionBadge.tsx]
- "services_doclibrarycatalogservice": "DocLibraryCatalogService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DocLibraryCatalogService.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 79354cb Merge remote-tracking branch 'o…, 87bda2e feat(docs): add move functional…, 8e87d94 feat: Add Links and Recommendat…, adc0d38 Refactor TemplatesPage: Enhance…, bc10d67 feat: add pastBidHelpers and pa…]
- "sheets_certificationssheet": "certificationsSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/certificationsSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, context.ts, IBidExcelContext]
- "sheets_costsummarysheet": "costSummarySheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/costSummarySheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 54fea3b feat: Enhance Part Number Autoc…, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…]
- "stores_usechatstore": "useChatStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useChatStore.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, de36cf5 feat: add SmartBid Docs indexer…, ChatAssistant.tsx, IAiChat.ts]
- "stores_usequotationstore": "useQuotationStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQuotationStore.ts:L1 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, CostSearchModal.tsx, EquipmentImportModal.tsx, 165493f NEW-MODIFIC, de36cf5 feat: add SmartBid Docs indexer…]
- "suppliers_supplierdrawer": "SupplierDrawer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/suppliers/SupplierDrawer.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 0df87c0 refactor: improve code formatti…, 2538d01 feat: Implement Access Matrix c…, 414e1a6 style: Improve code formatting …, 79354cb Merge remote-tracking branch 'o…, 921bf0d feat: enhance SupplierDrawer wi…]
- "survey_surveyspreadpanel": "SurveySpreadPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySpreadPanel.tsx:L1 | neighbors=[2a932fc feat(survey): failure cascade, …, 4c720fd style(survey): IMR-style proced…, 512f7b1 feat(survey): full-bleed 3D sea…, 583d03e Refactor string concatenation i…, 5d664ea Merge feat/survey-knowledge-por…, 6062346 feat(survey): failure cascade, …]
- "utils_winprobability": "winProbability.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/winProbability.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, bda0c32 style: Improve code formatting …, EngHoursOutlook.tsx, DashboardPage.tsx, FollowUpPage.tsx]
- "bid_bidfavoritebutton": "BidFavoriteButton.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidFavoriteButton.tsx:L1 | neighbors=[BidFavoriteButton(), BidFavoriteButtonProps, useCurrentUser.ts, useCurrentUser(), index.ts, useFavoritesStore.ts]
- "bid_erndetailsmodal": "ErnDetailsModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ErnDetailsModal.tsx:L1 | neighbors=[ErnDetailsModal(), ErnDetailsModalProps, Row(), stateColor, withDate(), index.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@9cc347531a2e4d3da3ce9ca3bdd58281b37face7": "9cc3475 feat: Integrate Financials Active Registered CSV support and enhance qu…" | kind=Commit | source=git | neighbors=[1111add Add initial configuration files…, EquipmentImportModal.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@da217d49b1c87bd396230b0f755f4edbfc4c091c": "da217d4 feat(survey): physical-signal effects on the data journey (motion, head…" | kind=Commit | source=git | neighbors=[61c46c8 fix(survey): offshore Brazil GG…, main, b80f76b style(survey): solid panel back…, surveyDataFormats.ts, effectTypes.ts, effectUtils.ts]
- "common_datatable_datatable": "DataTable()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DataTable.tsx:L20 | neighbors=[QuotationControlPanel.tsx, DataTable.tsx, ComparisonTables.tsx, QualificationLibraryView.tsx, BidDetailsReportPage.tsx, BidResultsPage.tsx]
- "common_requirepageaccess": "RequirePageAccess.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/RequirePageAccess.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 79354cb Merge remote-tracking branch 'o…, EmptyState.tsx, EmptyState(), NAV_PAGES, RequirePageAccess()]
- "comparator_comparisonexecutive": "ComparisonExecutive.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparisonExecutive.tsx:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, EmptyState.tsx, EmptyState(), ComparisonExecutive(), ComparisonExecutiveProps]
- "config_ai_config": "ai.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.config.ts:L1 | neighbors=[1c19dcd Update API diagnostics and AI c…, 4b576db AI-Integration, 79354cb Merge remote-tracking branch 'o…, 9582626 feat: add Access Log component …, 961eb93 feat: Update AI integration and…, 9e27edd feat: Update AI integration and…]
- "config_routes_config": "routes.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/routes.config.ts:L1 | neighbors=[0e653cd more mods, 3f57ca9 merge: integrate EASI module pa…, 4fd375f feat(survey): free 3D compositi…, 6d20432 feat: adiciona paginas EASI ao …, 79354cb Merge remote-tracking branch 'o…, 8e87d94 feat: Add Links and Recommendat…]
- "effects_seabedeffects": "seabedEffects.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/seabedEffects.ts:L1 | neighbors=[568e582 Merge feat/survey-journey-accur…, da217d4 feat(survey): physical-signal e…, index.ts, effectTypes.ts, EffectBuilder, effectUtils.ts]
- "hooks_usestatuscolors_usestatuscolors": "useStatusColors()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useStatusColors.ts:L25 | neighbors=[BidCard.tsx, DivisionBadge.tsx, DashboardActivity.tsx, DashboardBidTable.tsx, DashboardFilterBar.tsx, DashboardKPIRow.tsx]
- "hooks_usesurveyportal": "useSurveyPortal.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useSurveyPortal.ts:L1 | neighbors=[512f7b1 feat(survey): full-bleed 3D sea…, ddf6c96 Merge branch 'feat/survey-knowl…, f06225e feat(survey): Survey Knowledge …, fbe2c0e feat(survey): remove division/s…, ISurveyBidComparison, useFilteredSurveyEquipment()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-008.json

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
