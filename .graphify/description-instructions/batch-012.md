# Node Description Batch 13 of 86

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

- "utils_facethelpers_countfacets": "countFacets()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/facetHelpers.ts:L12 | neighbors=[DashboardBidTable.tsx, useAnalyticsFilters.ts, useDashboardFilters.ts, BidTrackerPage.tsx, FavoritesPage.tsx, PastBidsPage.tsx]
- "utils_facethelpers_withcounts": "withCounts()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/facetHelpers.ts:L37 | neighbors=[DashboardBidTable.tsx, DashboardFilterBar.tsx, AnalyticsFilterBar.tsx, BidTrackerPage.tsx, DashboardPage.tsx, FavoritesPage.tsx]
- "utils_formatters_formatdaysleft": "formatDaysLeft()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L87 | neighbors=[BidCard.tsx, CountdownTimer.tsx, BidBoardPage.tsx, BidDetailPage.tsx, FlowBoardPage.tsx, MyDashboardPage.tsx]
- "utils_pastbidhelpers_normalizetext": "normalizeText()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidHelpers.ts:L76 | neighbors=[ExportClarificationModal.tsx, useClarificationLibraryFilter.ts, useQualificationLibraryFilter.ts, SuppliersRegistry.tsx, clarificationChatIntent.ts, pastBidHelpers.ts]
- "utils_surveypackage": "surveyPackage.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyPackage.ts:L1 | neighbors=[50a29c7 feat(survey): Full Survey Sprea…, 583d03e Refactor string concatenation i…, ddf6c96 Merge branch 'feat/survey-knowl…, f06225e feat(survey): Survey Knowledge …, CreateRequestPage.tsx, SurveyPackageDrawer.tsx]
- "approval_approvaltimeline": "ApprovalTimeline.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalTimeline.tsx:L1 | neighbors=[ApprovalTimeline(), ApprovalTimelineProps, Timeline.tsx, Timeline(), IBidApproval.ts, IApprovalChain]
- "bid_bidapprovalpanel": "BidApprovalPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidApprovalPanel.tsx:L1 | neighbors=[BidApprovalPanel(), BidApprovalPanelProps, index.ts, formatters.ts, formatDate(), 0546310 Add dashboard components and st…]
- "bid_bidphaseprogress": "BidPhaseProgress.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidPhaseProgress.tsx:L1 | neighbors=[BidPhaseProgress(), BidPhaseProgressProps, useConfigPhases.ts, useConfigPhases(), 0e653cd more mods, 3a3d0a5 new changes]
- "bid_qualificationgrouplist": "QualificationGroupList.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationGroupList.tsx:L1 | neighbors=[ImportQualificationModal.tsx, IQualificationPickGroup, IQualificationPickRow, QualificationGroupList(), QualificationGroupListProps, ClarificationBadges.tsx]
- "bid_technicalproposalchip": "TechnicalProposalChip.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/TechnicalProposalChip.tsx:L1 | neighbors=[DocumentsTab.tsx, OverviewTab.tsx, STATE_CLASS, TechnicalProposalChip(), TechnicalProposalChipProps, technicalProposalHelpers.ts]
- "bidexcelexport_excelstyles_activecolumns": "activeColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L181 | neighbors=[excelStyles.ts, assetsSheet.ts, certificationsSheet.ts, hoursSheet.ts, logisticsSheet.ts, prepMobSheet.ts]
- "bidexcelexport_excelstyles_xlsheet_noticestrip": ".noticeStrip()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L376 | neighbors=[XlSheet, .banner(), thin(), .estimateHeight(), .fillRange(), .font()]
- "bidexcelexport_excelstyles_xlsheet_setvalue": ".setValue()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L316 | neighbors=[XlSheet, .band(), .banner(), .keyValue(), .note(), .noticeStrip()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@0df87c018bd3da9c53dfc1d46fea89618468134c": "0df87c0 refactor: improve code formatting and readability in multiple components" | kind=Commit | source=git | neighbors=[AssetsBreakdownTab.tsx, main, e046014 Refactor code structure for imp…, LivePulse.tsx, LivePulsePanel.tsx, SupplierDrawer.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@2d4ecdb004e4949a7d353d75cb2b1d7c98b07379": "2d4ecdb style: improve code formatting and readability across multiple componen…" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, EquipmentImportModal.tsx, main, 77f55d4 feat: Add Clarification Entry M…, DocLibraryCatalog.tsx, AssetsCatalogPage.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@3ae3801d6d77f9da72645213c5d3dbf0651776e2": "3ae3801 refactor: improve code formatting and readability across multiple compo…" | kind=Commit | source=git | neighbors=[main, e61a9d3 feat: add notification system f…, GuidedTour.tsx, peoplesoftConsulting.i18n.ts, DashboardPage.tsx, QueryConsultingPage.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@9759c3bd4b17e4f2ffcd2d8604b7a00e6b27ca16": "9759c3b Refactor DivisionBadge and MembersManagement components to use useStatu…" | kind=Commit | source=git | neighbors=[437d8e1 feat: implement notification lo…, ErnCreateModal.tsx, OverviewTab.tsx, main, 27f41ab refactor: improve code formatti…, DivisionBadge.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@aa081f98e098aab23c6317450d6d51404b1090fd": "aa081f9 refactor: Improve code formatting and readability across multiple compo…" | kind=Commit | source=git | neighbors=[5c35e8d feat: Implement Qualification L…, ImportQualificationModal.tsx, main, db68d81 feat: Enhance ErnCreateModal an…, useQualificationLibraryFilter.ts, QualificationEntryDrawer.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@d57485155d4c7094504f1257c6724fadad5940bd": "d574851 style(survey): calmer overview (monochrome room labels and trunks, lege…" | kind=Commit | source=git | neighbors=[5ba1094 style(survey): spread card pure…, main, ee6b009 feat(survey): upload equipment …, SurveySystemPage.tsx, createSurveyScene.ts, sceneTypes.ts]
- "common_countdowntimer": "CountdownTimer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/CountdownTimer.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, bec8260 feat: Enhance bid management wi…, CountdownTimer(), CountdownTimerProps]
- "common_importsourcelist": "ImportSourceList.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceList.tsx:L1 | neighbors=[3c5c37b more-mods, f03d3f6 feat: Enhance ImportSourceModal…, IImportSource, ImportSourceList(), ImportSourceListProps, SourceTypeFilter]
- "common_personacard": "PersonaCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PersonaCard.tsx:L1 | neighbors=[ApprovalTab.tsx, BidComments.tsx, ConfidentialAccessModal.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PersonaCard()]
- "common_timeline": "Timeline.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/Timeline.tsx:L1 | neighbors=[ApprovalTimeline.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, Timeline(), TimelineItem]
- "config_colorthemes_config": "colorThemes.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/colorThemes.config.ts:L1 | neighbors=[953278b feat: add ApprovalDueImpactSect…, COLOR_THEMES, ColorThemeId, getColorTheme(), IColorThemeAccents, IColorThemeDef]
- "config_spfxcontext": "SpfxContext.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/SpfxContext.ts:L1 | neighbors=[OverviewTab.tsx, 3a3d0a5 new changes, PeoplePicker.tsx, SmartBid20.tsx, SpfxContext, useSpfxContext()]
- "dashboard_recentactivity": "RecentActivity.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/RecentActivity.tsx:L1 | neighbors=[3a3d0a5 new changes, 953278b feat: add ApprovalDueImpactSect…, fe3728a smartbid2.0, GlassCard.tsx, GlassCard(), RecentActivity()]
- "function_app_document_structure_build_chunks": "build_chunks()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L395 | neighbors=[document_structure.py, metadata_header(), outline(), _render(), _split_body(), split_sections()]
- "function_app_document_structure_heading": "_heading()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L198 | neighbors=[document_structure.py, _has_word(), _is_title_case(), _is_upper(), _letter_count(), _numbered_title()]
- "function_app_function_app_extract_quotation": "extract_quotation()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L789 | neighbors=[function_app.py, _bad_request(), _caller_upn(), _document_text(), _model_json(), _now_iso()]
- "hooks_useaccesslevel_useaccesslevel": "useAccessLevel()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAccessLevel.ts:L27 | neighbors=[RequirePageAccess.tsx, useAccessLevel.ts, CommandPalette.tsx, LivePulse.tsx, Sidebar.tsx, BidDetailPage.tsx]
- "hooks_usecolortheme_resolvesemanticcolor": "resolveSemanticColor()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useColorTheme.ts:L17 | neighbors=[BidStatusPhasePanel.tsx, sectors.config.ts, status.config.ts, useColorTheme.ts, getActiveColorTheme(), useStatusColors.ts]
- "hooks_usedebounce_usedebounce": "useDebounce()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useDebounce.ts:L7 | neighbors=[EquipmentImportModal.tsx, useDebounce.ts, DocLibraryCatalog.tsx, AssetsCatalogPage.tsx, BidTrackerPage.tsx, QueryConsultingPage.tsx]
- "hooks_usesupplierservicetypes": "useSupplierServiceTypes.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useSupplierServiceTypes.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, ISupplierServiceTypes, useSupplierServiceTypes(), index.ts, useConfigStore.ts, useConfigStore]
- "knowledge_clarificationbadges_clarificationcategorychip": "ClarificationCategoryChip()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationBadges.tsx:L25 | neighbors=[ExportClarificationModal.tsx, ImportClarificationModal.tsx, QualificationGroupList.tsx, QualificationsTab.tsx, ClarificationBadges.tsx, ClarificationEntryDrawer.tsx]
- "models_idashboard": "IDashboard.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDashboard.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, DivisionWorkload.tsx, MonthlyVolumeChart.tsx, IDashboardData, IDashboardKPI, IDivisionWorkload]
- "models_isupplier": "ISupplier.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISupplier.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 3f57ca9 merge: integrate EASI module pa…, 6d20432 feat: adiciona paginas EASI ao …, index.ts, ISupplier, ISupplierContact]
- "models_iuser_ipersonref": "IPersonRef" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IUser.ts:L26 | neighbors=[ApprovalTab.tsx, IApprovalFlow.ts, IBid.ts, IBidApproval.ts, IBidComment.ts, IBidRequest.ts]
- "pages_faqpage": "FaqPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FaqPage.tsx:L1 | neighbors=[0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, AppLayout.tsx, PageHeader.tsx, PageHeader()]
- "services_aiauthservice_aiauthservice_getapp": ".getApp()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L134 | neighbors=[AiAuthService, .clearTokenCache(), .getAccessToken(), .getAuthority(), .getRedirectUri(), .isConfigured()]
- "services_bomcostanalysisservice": "BomCostAnalysisService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/BomCostAnalysisService.ts:L1 | neighbors=[CostSearchModal.tsx, EquipmentImportModal.tsx, e2285cf cont-implementing, BomCostsPage.tsx, index.ts, BomCostAnalysisService]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-012.json

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
