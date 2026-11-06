# Node Description Batch 13 of 102

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
LANGUAGE: each entry has a `lang=` marker giving the language of its source.
Write that entry's description in EXACTLY that language. Do not translate to
a single common language — match each node's source language individually.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "utils_technicalproposalhelpers": "technicalProposalHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/technicalProposalHelpers.ts:L1 | neighbors=[DocumentsTab.tsx, OverviewTab.tsx, TechnicalProposalChip.tsx, 5577aab feat: Add Technical Proposal fu…, 79354cb Merge remote-tracking branch 'o…, BidDetailPage.tsx] | lang=en
- "approval_approvaloverridebanner": "ApprovalOverrideBanner.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalOverrideBanner.tsx:L1 | neighbors=[ApprovalOverrideBanner(), ApprovalOverrideBannerProps, NON_PENDING_LABEL, IBid.ts, IApprovalOverride, formatters.ts] | lang=en
- "bidexcelexport_excelstyles_xl_colors": "XL_COLORS" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L16 | neighbors=[excelStyles.ts, assetsSheet.ts, certificationsSheet.ts, costSummarySheet.ts, currencyTable.ts, hoursSheet.ts] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@2d4ecdb004e4949a7d353d75cb2b1d7c98b07379": "2d4ecdb style: improve code formatting and readability across multiple componen…" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, EquipmentImportModal.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, main] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@401be0c3f22475e7c4c87b2bad5ff6affb4b176e": "401be0c Add EntraTokenTest component for Azure API diagnostics" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, 9e27edd feat: Update AI integration and…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@7d298620db0e84fde52a3681ca7951757b107420": "7d29862 feat(survey): end-to-end data lineage from sensors to client deliverabl…" | kind=Commit | source=git | neighbors=[2b67088 commit final Survey Knowledge &…, backup/survey-merge-20261018-113028-kno…, feat/survey-knowledge-portal, main, 747fd66 feat(survey): Oceaneering theme…, index.ts] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@86dba8c04252b71c5fc99fa8d13adcb7b937d20b": "86dba8c feat(survey): restore three.js 3D diorama for the System view with OII …" | kind=Commit | source=git | neighbors=[33536c2 feat(survey): 2.5D depth view o…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@b07a797de86313cec5042b878c70e541bac55cf8": "b07a797 feat(survey): toggle to hide connection lines and show only equipment" | kind=Commit | source=git | neighbors=[54594e6 style(survey): neutral silver f…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@e04601409c9056d8ed877bedb43d2e590bb1181e": "e046014 Refactor code structure for improved readability and maintainability" | kind=Commit | source=git | neighbors=[0df87c0 refactor: improve code formatti…, QualificationsTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, 9582626 feat: add Access Log component …] | lang=en
- "common_aianalyzermodal": "AIAnalyzerModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIAnalyzerModal.tsx:L1 | neighbors=[ScopeOfSupplyTab.tsx, 79354cb Merge remote-tracking branch 'o…, f03d3f6 feat: Enhance ImportSourceModal…, AIAnalyzerModal(), AIAnalyzerModalProps, AIDocumentAnalyzer.tsx] | lang=en
- "config_colorthemes_config": "colorThemes.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/colorThemes.config.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, f672a54 Refactor code structure for imp…, COLOR_THEMES, ColorThemeId, getColorTheme()] | lang=en
- "dashboard_bidsbydivisionchart": "BidsByDivisionChart.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByDivisionChart.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ChartTooltip.tsx, ChartTooltip(), GlassCard.tsx] | lang=en
- "dashboard_bidsbystatuschart": "BidsByStatusChart.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByStatusChart.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ChartTooltip.tsx, ChartTooltip(), GlassCard.tsx] | lang=en
- "function_app_function_app_suggest_clarifications": "suggest_clarifications()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L1160 | neighbors=[function_app.py, _caller_upn(), _clarification_library_block(), _clarification_library_material(), _clarification_material(), _clarifications_bad_request()] | lang=en
- "hooks_useapprovalsync": "useApprovalSync.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useApprovalSync.ts:L1 | neighbors=[2b1ed14 feat: add useApprovalSync hook …, 79354cb Merge remote-tracking branch 'o…, 8152d02 feat: implement split approval …, FLOW_FIELDS, pickFlowChanges(), useApprovalSync()] | lang=en
- "models_ibidexport": "IBidExport.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidExport.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, useExport.ts, BidExcelSheetKey, IBidExcelExportOptions] | lang=en
- "models_ibidtemplate_ibidtemplate": "IBidTemplate" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidTemplate.ts:L8 | neighbors=[BidTemplateImport.tsx, ImportSourceModal.tsx, useTemplates.ts, IBidTemplate.ts, index.ts, TemplatesPage.tsx] | lang=en
- "peoplesoft_howitworksdrawer": "HowItWorksDrawer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/peoplesoft/HowItWorksDrawer.tsx:L1 | neighbors=[3ae3801 refactor: improve code formatti…, 9582626 feat: add Access Log component …, QueryConsultingPage.tsx, useAppRootHost.ts, useAppRootHost(), HowItWorksDrawer()] | lang=en
- "services_aianalysisservice_aianalysisservice_postjson": ".postJson()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L378 | neighbors=[AIAnalysisService, .analyzeDocument(), .analyzeDocumentForTemplate(), .chat(), .extractDocumentMetadata(), .extractQuotation()] | lang=en
- "services_aiauthservice": "AiAuthService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L1 | neighbors=[1c19dcd Update API diagnostics and AI c…, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, 9e27edd feat: Update AI integration and…, SmartBid20.tsx, AIAnalysisService.ts] | lang=en
- "services_easimodulesadapter": "EasiModulesAdapter.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L1 | neighbors=[3f57ca9 merge: integrate EASI module pa…, 6d20432 feat: adiciona paginas EASI ao …, index.ts, BidService.ts, BidService, AssetItem] | lang=en
- "services_favoritesservice_favoritesservice": "FavoritesService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L21 | neighbors=[FavoritesService.ts, .addBidFavorite(), .addEquipment(), .getAll(), ._list(), .removeBidFavorite()] | lang=en
- "services_querycatalogservice_querycatalogservice": "QueryCatalogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QueryCatalogService.ts:L21 | neighbors=[QueryCatalogService.ts, .dateDiffDays(), .loadCatalog(), .loadFinancialsActiveRegistered(), .parseActiveRegistered(), .parseBomSheet()] | lang=en
- "survey3d_cableflow_cablenetwork": "CableNetwork" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L39 | neighbors=[cableFlow.ts, .applyTrace(), .build(), .clear(), .dispose(), .getCurve()] | lang=en
- "survey3d_explodelayout": "explodeLayout.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/explodeLayout.ts:L1 | neighbors=[9b2fddd feat(survey): diagram rooms (ma…, d9e6783 feat(survey): clean 3D overview…, ddf6c96 Merge branch 'feat/survey-knowl…, f510343 feat(survey): interactive sprea…, createSurveyScene.ts, ExplodeLayout] | lang=en
- "survey3d_trunkflow": "trunkFlow.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/trunkFlow.ts:L1 | neighbors=[9b2fddd feat(survey): diagram rooms (ma…, b07a797 feat(survey): toggle to hide co…, d574851 style(survey): calmer overview …, ddf6c96 Merge branch 'feat/survey-knowl…, createSurveyScene.ts, index.ts] | lang=en
- "utils_approvaltracks_getapprovaltracks": "getApprovalTracks()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalTracks.ts:L46 | neighbors=[ApprovalTab.tsx, OverviewTab.tsx, approvalHelpers.ts, approvalTracks.ts, getCurrentTrackApprovals(), getPrimaryTrack()] | lang=en
- "utils_clarificationhelpers_configoptionlabel": "configOptionLabel()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L60 | neighbors=[ExportClarificationModal.tsx, QualificationsTab.tsx, ScopeOfSupplyTab.tsx, useClarificationLibraryFilter.ts, useQualificationLibraryFilter.ts, ClarificationBadges.tsx] | lang=en
- "utils_doccataloghelpers": "docCatalogHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/docCatalogHelpers.ts:L1 | neighbors=[5577aab feat: Add Technical Proposal fu…, 79354cb Merge remote-tracking branch 'o…, DocLibraryCatalog.tsx, TechnicalProposalKnowledgeService.ts, IDocLibraryItem.ts, IDocLibraryMetadata] | lang=en
- "utils_formatters_ispastdue": "isPastDue()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L66 | neighbors=[DashboardBidTable.tsx, useKPIs.ts, BidTrackerPage.tsx, OperationalSummaryPage.tsx, PerformanceTrendsPage.tsx, DashboardService.ts] | lang=en
- "utils_pastbiddocument_record": "record()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L106 | neighbors=[clarificationLibraryDocument.ts, pastBidDocument.ts, classification(), hours(), identification(), outcome()] | lang=en
- "bid_bidcomments": "BidComments.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidComments.tsx:L1 | neighbors=[BidComments(), BidCommentsProps, PersonaCard.tsx, PersonaCard(), index.ts, formatters.ts] | lang=en
- "bidexcelexport_context_ibidexcelcontext": "IBidExcelContext" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/context.ts:L88 | neighbors=[context.ts, index.ts, assetsSheet.ts, certificationsSheet.ts, costSummarySheet.ts, hoursSheet.ts] | lang=en
- "bidexcelexport_context_newsheet": "newSheet()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/context.ts:L104 | neighbors=[context.ts, sheetName(), assetsSheet.ts, certificationsSheet.ts, costSummarySheet.ts, hoursSheet.ts] | lang=en
- "bidexcelexport_excelstyles_colof": "colOf()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L195 | neighbors=[excelStyles.ts, assetsSheet.ts, certificationsSheet.ts, currencyTable.ts, hoursSheet.ts, logisticsSheet.ts] | lang=en
- "bom_bomanalysiscard": "BomAnalysisCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bom/BomAnalysisCard.tsx:L1 | neighbors=[BomAnalysisCard(), IBomAnalysisCardProps, IBomCostAnalysis.ts, IBomCostAnalysis, bomCostHelpers.ts, formatDateDMY()] | lang=en
- "charts_heatmapgrid": "HeatmapGrid.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/HeatmapGrid.tsx:L1 | neighbors=[heatColor(), HeatmapColumn, HeatmapGrid(), HeatmapGridProps, hexToRgb(), 583d03e Refactor string concatenation i…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@0df87c018bd3da9c53dfc1d46fea89618468134c": "0df87c0 refactor: improve code formatting and readability in multiple components" | kind=Commit | source=git | neighbors=[AssetsBreakdownTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, e046014 Refactor code structure for imp…, LivePulse.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@1a408964e22f1b844317d2fc1998c984b68bf2da": "1a40896 feat: add SmartBid 2.0 Executive Summary Slides generator script" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main] | lang=pt
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@1c19dcd6cdc642389f57af4a30dc6ca485449cd0": "1c19dcd Update API diagnostics and AI configuration; enhance AiAuthService logg…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, 961eb93 feat: Update AI integration and…] | lang=en

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
