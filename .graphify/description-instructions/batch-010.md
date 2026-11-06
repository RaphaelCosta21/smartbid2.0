# Node Description Batch 11 of 102

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

- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@d9e6783d846b616775b13b478b877dc3edb632a0": "d9e6783 feat(survey): clean 3D overview - text-only zone blocks, catalog items …" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, 0a8206d feat(survey): 3D navigation - S…]
- "common_confirmdialog_confirmdialog": "ConfirmDialog()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ConfirmDialog.tsx:L15 | neighbors=[AssetsBreakdownTab.tsx, BidExportTab.tsx, ConfidentialAccessModal.tsx, DocumentsTab.tsx, LinkedQuotationsPanel.tsx, OverviewTab.tsx]
- "dashboard_livefocusoverlay": "LiveFocusOverlay.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/LiveFocusOverlay.tsx:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, aaa091c Add hooks for KPI targets and l…, ApprovalsPending.tsx, DashboardActivity.tsx, ErnWatchlist.tsx, FocusButton()]
- "knowledge_pastbidbadges": "PastBidBadges.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidBadges.tsx:L1 | neighbors=[583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, bec8260 feat: Enhance bid management wi…, KB_CLASS, OUTCOME_CLASS, PastBidChips()]
- "knowledge_qualificationcategoryinput": "QualificationCategoryInput.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationCategoryInput.tsx:L1 | neighbors=[QualificationsTab.tsx, ScopeOfSupplyTab.tsx, 5c35e8d feat: Implement Qualification L…, SuggestionInput.tsx, SuggestionInput(), QualificationCategoryInput()]
- "knowledge_qualificationentrymodal": "QualificationEntryModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationEntryModal.tsx:L1 | neighbors=[5c35e8d feat: Implement Qualification L…, SuggestionInput.tsx, SuggestionInput(), QualificationCategoryInput.tsx, QualificationCategoryInput(), QualificationEntryModal()]
- "pages_manualscatalogspage": "ManualsCatalogsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ManualsCatalogsPage.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 79354cb Merge remote-tracking branch 'o…, 8152d02 feat: implement split approval …, 87bda2e feat(docs): add move functional…, 8e87d94 feat: Add Links and Recommendat…, AppLayout.tsx]
- "services_aiauthservice_aiauthservice": "AiAuthService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AiAuthService.ts:L57 | neighbors=[SmartBid20.tsx, AIAnalysisService.ts, AiAuthService.ts, .acquireInteractive(), .clearTokenCache(), .getAccessToken()]
- "stores_useernstore": "useErnStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useErnStore.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, 892c1fc feat: add PeoplePicker componen…, aaa091c Add hooks for KPI targets and l…, DashboardBidTable.tsx, ErnDashboardSection.tsx, useDashboardSync.ts]
- "survey_glossarytext": "GlossaryText.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/GlossaryText.tsx:L1 | neighbors=[3d59093 Merge feat/survey-data-journey …, d614a0b feat(survey): bilingual survey …, surveyGlossary.ts, GLOSSARY_UI, GlossaryContext.ts, GlossaryContext]
- "survey3d_cableflow": "cableFlow.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/cableFlow.ts:L1 | neighbors=[3d59093 Merge feat/survey-data-journey …, 9b2fddd feat(survey): diagram rooms (ma…, b07a797 feat(survey): toggle to hide co…, be5fb82 feat(survey): data journey from…, ddf6c96 Merge branch 'feat/survey-knowl…, f510343 feat(survey): interactive sprea…]
- "survey3d_focuscontroller_focuscontroller": "FocusController" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/focusController.ts:L69 | neighbors=[createSurveyScene.ts, focusController.ts, .applyStates(), .close(), .constructor(), .dispose()]
- "utils_aicontext": "aiContext.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiContext.ts:L1 | neighbors=[AITab.tsx, QualificationsTab.tsx, ScopeOfSupplyTab.tsx, 4b576db AI-Integration, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…]
- "utils_bidhelpers_getduefreezedate": "getDueFreezeDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L58 | neighbors=[BidCard.tsx, OverviewTab.tsx, DashboardBidTable.tsx, useKPIs.ts, BidBoardPage.tsx, BidDetailPage.tsx]
- "utils_businessdays": "businessDays.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/businessDays.ts:L1 | neighbors=[3a3d0a5 new changes, 5577aab feat: Add Technical Proposal fu…, 79354cb Merge remote-tracking branch 'o…, aaa091c Add hooks for KPI targets and l…, CreateRequestPage.tsx, IBidStatus.ts]
- "utils_divisionhelpers_isintegrateddivision": "isIntegratedDivision()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L25 | neighbors=[ApprovalTab.tsx, OverviewTab.tsx, BidDetailPage.tsx, CreateRequestPage.tsx, SystemConfiguration.tsx, infoSheet.ts]
- "utils_ernlink": "ernLink.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernLink.ts:L1 | neighbors=[ErnCreateModal.tsx, ErnSearchModal.tsx, 892c1fc feat: add PeoplePicker componen…, d23a43b feat: enhance ERN management wi…, index.ts, BidService.ts]
- "utils_formatters_parsedate": "parseDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L44 | neighbors=[DueDateChangeModal.tsx, DashboardActivity.tsx, useDashboardFilters.ts, CreateRequestPage.tsx, TimelinePage.tsx, DashboardService.ts]
- "bid_duedatechangemodal": "DueDateChangeModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/DueDateChangeModal.tsx:L1 | neighbors=[DueDateChangeModal(), DueDateChangeModalProps, inputDateToIso(), toInputDate(), RevisionsTab.tsx, getActiveRevision()]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@67bbf62796964b19bb9096b006746ec3f5fa5565": "67bbf62 feat(survey): apply Figma look - ocean background, glass cards/panels, …" | kind=Commit | source=git | neighbors=[0deadb7 fix(survey): read catalog jsond…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main]
- "common_bidselect": "BidSelect.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/BidSelect.tsx:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, BidSelect(), BidSelectProps, buildBidOptions(), filterOptions()]
- "config_peoplesoftconsulting_i18n": "peoplesoftConsulting.i18n.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/peoplesoftConsulting.i18n.ts:L1 | neighbors=[3ae3801 refactor: improve code formatti…, 9582626 feat: add Access Log component …, EN, IPeoplesoftColumnHeaders, IPeoplesoftConsultingText, IPeoplesoftHelpSection]
- "config_sectors_config": "sectors.config.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/sectors.config.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, c271ce8 Refactor code structure for imp…, BY_LABEL, BY_VALUE, getSectorColor()]
- "hooks_useeditcontrol": "useEditControl.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useEditControl.ts:L1 | neighbors=[OverviewTab.tsx, QualificationsTab.tsx, c58a13c new-implementations, EditLockBanner.tsx, useCurrentUser.ts, useCurrentUser()]
- "hooks_usekpitargets": "useKpiTargets.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useKpiTargets.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, aaa091c Add hooks for KPI targets and l…, DashboardKPIRow.tsx, ErnDashboardSection.tsx, useKpiTargets(), index.ts]
- "hooks_usetechnicalproposalpublisher": "useTechnicalProposalPublisher.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useTechnicalProposalPublisher.ts:L1 | neighbors=[DocumentsTab.tsx, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, useCurrentUser.ts, useCurrentUser()]
- "models_iaichat": "IAiChat.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAiChat.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, b6d954d feat: Enhance AIAnalysisService…, bc10d67 feat: add pastBidHelpers and pa…, de36cf5 feat: add SmartBid Docs indexer…, ChatAssistant.tsx, ChatRole]
- "models_idoclibraryitem": "IDocLibraryItem.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IDocLibraryItem.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 79354cb Merge remote-tracking branch 'o…, 8e87d94 feat: Add Links and Recommendat…, bc10d67 feat: add pastBidHelpers and pa…, de36cf5 feat: add SmartBid Docs indexer…, DocLibraryCatalog.tsx]
- "pages_datasheetspage": "DatasheetsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/DatasheetsPage.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 79354cb Merge remote-tracking branch 'o…, 87bda2e feat(docs): add move functional…, 8e87d94 feat: Add Links and Recommendat…, AppLayout.tsx, usePageAccess.ts]
- "pages_technicalproposalspage": "TechnicalProposalsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TechnicalProposalsPage.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 5577aab feat: Add Technical Proposal fu…, 79354cb Merge remote-tracking branch 'o…, de36cf5 feat: add SmartBid Docs indexer…, AppLayout.tsx, usePageAccess.ts]
- "services_attachmentservice": "AttachmentService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AttachmentService.ts:L1 | neighbors=[CertificationsBreakdownTab.tsx, DocumentsTab.tsx, ScopeOfSupplyTab.tsx, 165493f NEW-MODIFIC, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…]
- "services_exportservice": "ExportService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ExportService.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, c271ce8 Refactor code structure for imp…, useExport.ts, BidDetailsReportPage.tsx, PeriodPerformancePage.tsx, IBidExport.ts]
- "services_surveycatalogservice_surveycatalogservice": "SurveyCatalogService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SurveyCatalogService.ts:L33 | neighbors=[SurveyCatalogService.ts, .ensureList(), .getAll(), ._guessZoneAnchor(), .importCatalog(), ._list()]
- "survey3d_journeycontroller_journeycontroller": "JourneyController" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/journeyController.ts:L35 | neighbors=[createSurveyScene.ts, journeyController.ts, .buildCards(), .cardCount(), .clearCards(), .constructor()]
- "survey3d_phenomenoncontroller": "phenomenonController.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/phenomenonController.ts:L1 | neighbors=[568e582 Merge feat/survey-journey-accur…, da217d4 feat(survey): physical-signal e…, createSurveyScene.ts, surveyDataFormats.ts, JourneyEffectKind, effectTypes.ts]
- "utils_aiquotationmapper": "aiQuotationMapper.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/aiQuotationMapper.ts:L1 | neighbors=[AddQuotationModal.tsx, 02c1391 feat: Add supplier management f…, 4b576db AI-Integration, 79354cb Merge remote-tracking branch 'o…, 961eb93 feat: Update AI integration and…, b6d954d feat: Enhance AIAnalysisService…]
- "utils_costcalculations_getassetcostbreakdown": "getAssetCostBreakdown()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L333 | neighbors=[AssetsBreakdownTab.tsx, ScopeOfSupplyTab.tsx, rows.ts, bidPresentation.ts, costCalculations.ts, accumulateNode()]
- "utils_divisionhelpers_getbidbusinesslines": "getBidBusinessLines()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/divisionHelpers.ts:L57 | neighbors=[ApprovalTab.tsx, OverviewTab.tsx, IntegratedDivisionTabs.tsx, BidService.ts, SurveyPortalHeader.tsx, approvalTracks.ts]
- "utils_surveyfailure": "surveyFailure.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyFailure.ts:L1 | neighbors=[2a932fc feat(survey): failure cascade, …, 5d664ea Merge feat/survey-knowledge-por…, 6062346 feat(survey): failure cascade, …, SurveySystemPage.tsx, SurveyFailurePanel.tsx, index.ts]
- "utils_validators": "validators.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/validators.ts:L1 | neighbors=[AddQuotationModal.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 7d9108e createrequestpage correction, CreateRequestPage.tsx, QuotationsPage.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-010.json

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
