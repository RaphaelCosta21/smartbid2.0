# Node Description Batch 12 of 102

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

- "charts_paretochart": "ParetoChart.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/ParetoChart.tsx:L1 | neighbors=[ChartTooltip.tsx, ChartTooltip(), ParetoChart(), ParetoChartProps, useChartTheme.ts, useChartTheme()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@1111add67f3a6ff8391e29fbf84abf5b32662001": "1111add Add initial configuration files for Graphify" | kind=Commit | source=git | neighbors=[AssetsBreakdownTab.tsx, CostSearchModal.tsx, ScopeOfSupplyTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@1d028a02e2b80ef23a1043a5f18e75320b778dd7": "1d028a0 style: Improve code formatting and readability across multiple componen…" | kind=Commit | source=git | neighbors=[ImportClarificationModal.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, main, 02c1391 feat: Add supplier management f…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@7342177087a32608098d336c321fd0b7c747bc0b": "7342177 Merge feat/survey-surface-spares into main" | kind=Commit | source=git | neighbors=[540b3b9 style(DocLibraryCatalog): impro…, main, ISurveyCatalog.ts, SurveySystemPage.tsx, SurveyCatalogService.ts, useSurveyStore.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@747fd66c1e7a2ec5fc605b500d3c81571143a5a9": "747fd66 feat(survey): Oceaneering theme, 3D equipment thumb, one-line diagram f…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-kno…, feat/survey-knowledge-portal, main, 4fd375f feat(survey): free 3D compositi…, useChartTheme.ts, AppLayout.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@c6ce977318ef683b49401625111868d10c5f4938": "c6ce977 Add Azure AI Backend for SmartBid 2.0 integration" | kind=Commit | source=git | neighbors=[4b576db AI-Integration, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@ca73461afdaf0fa759b7558b12c6d60a666bd128": "ca73461 feat(survey): spare quantities, standard packages (Surface/MBES/Subsea)…" | kind=Commit | source=git | neighbors=[540b3b9 style(DocLibraryCatalog): impro…, main, 7342177 Merge feat/survey-surface-spare…, ISurveyCatalog.ts, SurveySystemPage.tsx, SurveyCatalogService.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@d227784702b243c9dc77c10d143b06699b80ecad": "d227784 feat(survey): Figma 2D system view with animated information flow; OII …" | kind=Commit | source=git | neighbors=[67bbf62 feat(survey): apply Figma look …, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@d23a43b476fc1f3a0fbdacea17d96bda374e96c2": "d23a43b feat: enhance ERN management with new access control and activity loggi…" | kind=Commit | source=git | neighbors=[892c1fc feat: add PeoplePicker componen…, BidActivityLog.tsx, ErnCreateModal.tsx, OverviewTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…]
- "common_divisionbadge_divisionbadge": "DivisionBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DivisionBadge.tsx:L10 | neighbors=[ImportClarificationModal.tsx, ImportQualificationModal.tsx, DivisionBadge.tsx, ClarificationEntryDrawer.tsx, PastBidDrawer.tsx, QualificationEntryDrawer.tsx]
- "config_phases_config": "phases.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/phases.config.ts:L1 | neighbors=[1665b01 more features, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 8267c28 i18n: translate EASI, suppliers…, c4e04de lots-implementation, ddf6c96 Merge branch 'feat/survey-knowl…]
- "effects_signaleffects": "signalEffects.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/signalEffects.ts:L1 | neighbors=[568e582 Merge feat/survey-journey-accur…, da217d4 feat(survey): physical-signal e…, index.ts, effectTypes.ts, EffectBuilder, effectUtils.ts]
- "models_iqualificationdb": "IQualificationDb.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQualificationDb.ts:L1 | neighbors=[ImportQualificationModal.tsx, 5c35e8d feat: Implement Qualification L…, useQualificationLibraryFilter.ts, QualificationEntryDrawer.tsx, QualificationEntryModal.tsx, QualificationLibraryView.tsx]
- "services_ernservice_ernservice": "ErnService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L14 | neighbors=[ErnCreateModal.tsx, ErnDetailsModal.tsx, ErnSearchModal.tsx, useErn.ts, ErnService.ts, .create()]
- "services_supplierservice_supplierservice": "SupplierService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SupplierService.ts:L163 | neighbors=[SuppliersRegistry.tsx, SupplierService.ts, ._clearLogo(), .columns(), .create(), .getAll()]
- "utils_bomparser": "bomParser.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L1 | neighbors=[9cc3475 feat: Integrate Financials Acti…, e2285cf cont-implementing, BomCostsPage.tsx, index.ts, assignParentIds(), cleanCsvValue()]
- "utils_pastbiddocument_heading": "heading()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L74 | neighbors=[clarificationLibraryDocument.ts, pastBidDocument.ts, buildPastBidDocument(), clarifications(), classification(), description()]
- "utils_surveypackages": "surveyPackages.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyPackages.ts:L1 | neighbors=[7342177 Merge feat/survey-surface-spare…, ca73461 feat(survey): spare quantities,…, SurveySystemPage.tsx, useSurveyStore.ts, SurveyComposition3D.tsx, SurveyPortalHeader.tsx]
- "bid_aitab": "AITab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AITab.tsx:L1 | neighbors=[AITab(), AITabProps, AIDocumentAnalyzer.tsx, AIDocumentAnalyzer(), GlassCard.tsx, GlassCard()]
- "bid_qualificationsuggestionsmodal": "QualificationSuggestionsModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationSuggestionsModal.tsx:L1 | neighbors=[QualificationsTab.tsx, QualificationGroupList.tsx, IQualificationPickGroup, QualificationGroupList(), QualificationSuggestionsModal(), QualificationSuggestionsModalProps]
- "bidexcelexport_excelstyles_num": "NUM" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L66 | neighbors=[excelStyles.ts, assetsSheet.ts, certificationsSheet.ts, costSummarySheet.ts, currencyTable.ts, hoursSheet.ts]
- "charts_sparkline": "Sparkline.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/Sparkline.tsx:L1 | neighbors=[Sparkline(), SparklineProps, useColorTheme.ts, useColorTheme(), 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@3bfc25a381e89baaec0641e23de09315cc31c9cc": "3bfc25a Refactor notification events, improve code formatting, and enhance appr…" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, OverviewTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, 14b96c8 feat: implement approval round …]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@cce41cca8d7f5e6a8ffea367dd8a9583001d9c77": "cce41cc refactor: clean up code formatting and improve readability across multi…" | kind=Commit | source=git | neighbors=[75476a5 feat: add confidentiality manag…, ConfidentialAccessModal.tsx, ConfidentialLock.tsx, ExportClarificationModal.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@d57485155d4c7094504f1257c6724fadad5940bd": "d574851 style(survey): calmer overview (monochrome room labels and trunks, lege…" | kind=Commit | source=git | neighbors=[5ba1094 style(survey): spread card pure…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main]
- "common_scopeimportpreview": "ScopeImportPreview.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ScopeImportPreview.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 3c5c37b more-mods, 79354cb Merge remote-tracking branch 'o…, b6d954d feat: Enhance AIAnalysisService…, f03d3f6 feat: Enhance ImportSourceModal…, ImportSourceModal.tsx]
- "common_suppliercombobox": "SupplierCombobox.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SupplierCombobox.tsx:L1 | neighbors=[AddQuotationModal.tsx, 02c1391 feat: Add supplier management f…, 414e1a6 style: Improve code formatting …, 79354cb Merge remote-tracking branch 'o…, SupplierCombobox(), SupplierComboboxProps]
- "common_toastcontainer": "ToastContainer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ToastContainer.tsx:L1 | neighbors=[24595c5 feat: Enhance Bid Export functi…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 79354cb Merge remote-tracking branch 'o…, b6d954d feat: Enhance AIAnalysisService…, ICONS]
- "components_smartbid20": "SmartBid20.tsx" | kind=code-symbol | source=src/webparts/smartBid20/components/SmartBid20.tsx:L1 | neighbors=[3a3d0a5 new changes, 9e27edd feat: Update AI integration and…, fe3728a smartbid2.0, ISmartBid20Props.ts, ISmartBid20Props, SmartBid20]
- "dashboard_bidsbyurgencychart": "BidsByUrgencyChart.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/BidsByUrgencyChart.tsx:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, aaa091c Add hooks for KPI targets and l…, bd70cf6 style: improve code formatting …, ChartTooltip.tsx, ChartTooltip(), GlassCard.tsx]
- "insights_segmentedcontrol_segmentoption": "SegmentOption" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/SegmentedControl.tsx:L5 | neighbors=[DashboardActivity.tsx, DashboardPeriodBar.tsx, EngHoursOutlook.tsx, EngHoursRanking.tsx, ErnWatchlist.tsx, AnalyticsFilterBar.tsx]
- "knowledge_pastbidprofilemodal": "PastBidProfileModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidProfileModal.tsx:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, PastBidProfileModal(), PastBidProfileModalProps, IAIAnalysis.ts]
- "services_attachmentservice_attachmentservice": "AttachmentService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L9 | neighbors=[CertificationsBreakdownTab.tsx, DocumentsTab.tsx, ScopeOfSupplyTab.tsx, CreateRequestPage.tsx, AttachmentService.ts, .deleteFile()]
- "services_ernservice": "ErnService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ErnService.ts:L1 | neighbors=[ErnCreateModal.tsx, ErnDetailsModal.tsx, ErnSearchModal.tsx, 79354cb Merge remote-tracking branch 'o…, 892c1fc feat: add PeoplePicker componen…, aaa091c Add hooks for KPI targets and l…]
- "survey_surveyequipmentcard": "SurveyEquipmentCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyEquipmentCard.tsx:L1 | neighbors=[512f7b1 feat(survey): full-bleed 3D sea…, 583d03e Refactor string concatenation i…, 67bbf62 feat(survey): apply Figma look …, 79354cb Merge remote-tracking branch 'o…, ddf6c96 Merge branch 'feat/survey-knowl…, ee6b009 feat(survey): upload equipment …]
- "survey_surveynmealab": "SurveyNmeaLab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveyNmeaLab.tsx:L1 | neighbors=[3d59093 Merge feat/survey-data-journey …, d614a0b feat(survey): bilingual survey …, SurveyGlossary.tsx, surveyGlossary.ts, GLOSSARY_UI, NMEA_LAB_SAMPLES]
- "survey3d_journeycontroller": "journeyController.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/journeyController.ts:L1 | neighbors=[3d59093 Merge feat/survey-data-journey …, 568e582 Merge feat/survey-journey-accur…, acf62bf refactor(survey): data journey …, be5fb82 feat(survey): data journey from…, da217d4 feat(survey): physical-signal e…, createSurveyScene.ts]
- "utils_durationhelpers": "durationHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/durationHelpers.ts:L1 | neighbors=[BidStatusPhasePanel.tsx, BidTimeline.tsx, OverviewTab.tsx, RevisionsTab.tsx, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…]
- "utils_pdfexport": "pdfExport.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pdfExport.ts:L1 | neighbors=[8267c28 i18n: translate EASI, suppliers…, c271ce8 Refactor code structure for imp…, ddf6c96 Merge branch 'feat/survey-knowl…, BidDetailsReportPage.tsx, PeriodPerformancePage.tsx, ExportService.ts]
- "utils_surveypackage": "surveyPackage.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyPackage.ts:L1 | neighbors=[50a29c7 feat(survey): Full Survey Sprea…, 583d03e Refactor string concatenation i…, 7342177 Merge feat/survey-surface-spare…, 79354cb Merge remote-tracking branch 'o…, ca73461 feat(survey): spare quantities,…, ddf6c96 Merge branch 'feat/survey-knowl…]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-011.json

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
