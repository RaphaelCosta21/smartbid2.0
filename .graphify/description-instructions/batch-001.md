# Node Description Batch 2 of 102

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

- "pages_bottleneckanalysispage": "BottleneckAnalysisPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BottleneckAnalysisPage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 414e1a6 style: Improve code formatting …, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, 8267c28 i18n: translate EASI, suppliers…]
- "bid_qualificationstab": "QualificationsTab.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/QualificationsTab.tsx:L1 | neighbors=[ClarificationSuggestionsModal.tsx, ClarificationSuggestionsModal(), EmptySection.tsx, EmptySection(), ExportClarificationModal.tsx, ExportClarificationModal()]
- "pages_followuppage": "FollowUpPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/FollowUpPage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 2538d01 feat: Implement Access Matrix c…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, 8267c28 i18n: translate EASI, suppliers…]
- "pages_pastbidspage": "PastBidsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PastBidsPage.tsx:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, 02c1391 feat: Add supplier management f…, 2538d01 feat: Implement Access Matrix c…, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…]
- "branch:repo:github.com/RaphaelCosta21/smartbid2.0#feat/survey-knowledge-portal": "feat/survey-knowledge-portal" | kind=Branch | source=git | neighbors=[0546310 Add dashboard components and st…, 0a8206d feat(survey): 3D navigation - S…, 0deadb7 fix(survey): read catalog jsond…, 0e653cd more mods, 1111add Add initial configuration files…, 165493f NEW-MODIFIC]
- "pages_suppliersregistry": "SuppliersRegistry.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/SuppliersRegistry.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 2538d01 feat: Implement Access Matrix c…, 3f57ca9 merge: integrate EASI module pa…, 414e1a6 style: Improve code formatting …, 583d03e Refactor string concatenation i…, 6d20432 feat: adiciona paginas EASI ao …]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@aaa091c8347b9df3be7a39ff26ff870480b701d2": "aaa091c Add hooks for KPI targets and live overview, along with utility functio…" | kind=Commit | source=git | neighbors=[AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidFxNote.tsx, BidHoursTable.tsx, BidTabHeader.tsx, CertificationsBreakdownTab.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@5577aabf1f9439b5493f6f97119132a9389c7bd2": "5577aab feat: Add Technical Proposal functionality and enhance date handling" | kind=Commit | source=git | neighbors=[BidCard.tsx, BidFavoriteButton.tsx, DocumentsTab.tsx, DueDateChangeModal.tsx, OverviewTab.tsx, TechnicalProposalChip.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@ddf6c96011afa751b11ef3b4b000eb616ad95e74": "ddf6c96 Merge branch 'feat/survey-knowledge-portal' into main" | kind=Commit | source=git | neighbors=[2b1ed14 feat: add useApprovalSync hook …, 2b67088 commit final Survey Knowledge &…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, main]
- "bid_addquotationmodal": "AddQuotationModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L1 | neighbors=[AddQuotationModal(), AddQuotationModalProps, blankLineItem(), genId(), ILineItem, SupplierCombobox.tsx]
- "pages_queryconsultingpage": "QueryConsultingPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L1 | neighbors=[2d4ecdb style: improve code formatting …, 3ae3801 refactor: improve code formatti…, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, 9582626 feat: add Access Log component …, 9cc3475 feat: Integrate Financials Acti…]
- "pages_quotationspage": "QuotationsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QuotationsPage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 165493f NEW-MODIFIC, 2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 4b576db AI-Integration, 4b5d467 feat: add BomQuotationPicker co…]
- "survey3d_createsurveyscene": "createSurveyScene.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L1 | neighbors=[0a8206d feat(survey): 3D navigation - S…, 3d59093 Merge feat/survey-data-journey …, 4c720fd style(survey): IMR-style proced…, 4fd375f feat(survey): free 3D compositi…, 50a29c7 feat(survey): Full Survey Sprea…, 512f7b1 feat(survey): full-bleed 3D sea…]
- "utils_bidhelpers": "bidHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L1 | neighbors=[BidCard.tsx, OverviewTab.tsx, 0546310 Add dashboard components and st…, 0e653cd more mods, 3a3d0a5 new changes, 5577aab feat: Add Technical Proposal fu…]
- "utils_ernhelpers": "ernHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L1 | neighbors=[BidCard.tsx, ErnCreateModal.tsx, ErnDetailsModal.tsx, ErnSearchModal.tsx, OverviewTab.tsx, 5577aab feat: Add Technical Proposal fu…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@75476a5724f12a95dd5057ba6ead9f411e7622e8": "75476a5 feat: add confidentiality management for bids" | kind=Commit | source=git | neighbors=[20d52ed feat: Add urgency reason stylin…, ApprovalTab.tsx, BidActivityLog.tsx, BidCard.tsx, BidConfidentialButton.tsx, BidCostSummary.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@2538d01302da56d388c088c6a404dede8561dc62": "2538d01 feat: Implement Access Matrix component and related access control conf…" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, EquipmentImportModal.tsx, NotesTab.tsx, OverviewTab.tsx, QualificationsTab.tsx, backup/survey-merge-20261018-113028-jou…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@f672a54d4c70a5d7240a78f9db65fa6cef98ed49": "f672a54 Refactor code structure for improved readability and maintainability" | kind=Commit | source=git | neighbors=[9c0bb6f Add CSV file for indexer warnin…, AddQuotationModal.tsx, AssetsBreakdownTab.tsx, LinkedQuotationsPanel.tsx, QuotationControlPanel.tsx, QuotationStatusChip.tsx]
- "models_isystemconfig": "ISystemConfig.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 14b96c8 feat: implement approval round …, 165493f NEW-MODIFIC, 2538d01 feat: Implement Access Matrix c…, 3c5c37b more-mods, 75476a5 feat: add confidentiality manag…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@02c1391daa4012ed9631b3b59e28efe88ad75ce6": "02c1391 feat: Add supplier management features including service types, quotati…" | kind=Commit | source=git | neighbors=[AddQuotationModal.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, main, 414e1a6 style: Improve code formatting …]
- "layout_livepulse": "LivePulse.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L1 | neighbors=[0df87c0 refactor: improve code formatti…, 2538d01 feat: Implement Access Matrix c…, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, 921bf0d feat: enhance SupplierDrawer wi…, 9582626 feat: add Access Log component …]
- "services_aianalysisservice": "AIAnalysisService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L1 | neighbors=[AddQuotationModal.tsx, QualificationsTab.tsx, 00efd39 Refactor Excel export sheets fo…, 02c1391 feat: Add supplier management f…, 401be0c Add EntraTokenTest component fo…, 414e1a6 style: Improve code formatting …]
- "stores_usebidstore": "useBidStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L1 | neighbors=[BidConfidentialButton.tsx, BidExportTab.tsx, ConfidentialLock.tsx, DocumentsTab.tsx, ScopeOfSupplyTab.tsx, 02c1391 feat: Add supplier management f…]
- "stores_useuistore": "useUIStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L1 | neighbors=[AddQuotationModal.tsx, ApprovalTab.tsx, AssetsBreakdownTab.tsx, BidConfidentialButton.tsx, BidExportTab.tsx, BidFavoriteButton.tsx]
- "survey_surveysystemscene": "SurveySystemScene.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/SurveySystemScene.tsx:L1 | neighbors=[0a8206d feat(survey): 3D navigation - S…, 0b9cb22 refactor(survey): remove Missio…, 2a932fc feat(survey): failure cascade, …, 3d59093 Merge feat/survey-data-journey …, 50a29c7 feat(survey): Full Survey Sprea…, 512f7b1 feat(survey): full-bleed 3D sea…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@0e653cd1112bcfa71621ebd9aa14b7d571667c54": "0e653cd more mods" | kind=Commit | source=git | neighbors=[BidCard.tsx, BidPhaseProgress.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx]
- "pages_templatespage": "TemplatesPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L1 | neighbors=[165493f NEW-MODIFIC, 2538d01 feat: Implement Access Matrix c…, 2d4ecdb style: improve code formatting …, 3a3d0a5 new changes, 401be0c Add EntraTokenTest component fo…, 4b576db AI-Integration]
- "function_app_function_app": "function_app.py" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L1 | neighbors=[02c1391 feat: Add supplier management f…, 401be0c Add EntraTokenTest component fo…, 79354cb Merge remote-tracking branch 'o…, 961eb93 feat: Update AI integration and…, 9c0bb6f Add CSV file for indexer warnin…, 9e27edd feat: Update AI integration and…]
- "pages_performancetrendspage": "PerformanceTrendsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PerformanceTrendsPage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 5577aab feat: Add Technical Proposal fu…, 79354cb Merge remote-tracking branch 'o…, 8267c28 i18n: translate EASI, suppliers…, 892c1fc feat: add PeoplePicker componen…, aaa091c Add hooks for KPI targets and l…]
- "utils_surveyspreadgraph": "surveySpreadGraph.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveySpreadGraph.ts:L1 | neighbors=[2a932fc feat(survey): failure cascade, …, 3d59093 Merge feat/survey-data-journey …, 4fd375f feat(survey): free 3D compositi…, 568e582 Merge feat/survey-journey-accur…, 5d664ea Merge feat/survey-knowledge-por…, 6062346 feat(survey): failure cascade, …]
- "bidexcelexport_excelstyles": "excelStyles.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L1 | neighbors=[context.ts, activeColumns(), clean(), colOf(), currencyFmt(), displayDate()]
- "pages_timelinepage": "TimelinePage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L1 | neighbors=[1665b01 more features, 1d028a0 style: Improve code formatting …, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…]
- "bid_bidstatusphasepanel": "BidStatusPhasePanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusPhasePanel.tsx:L1 | neighbors=[ApprovalTab.tsx, AssetCostsBlockDialog(), AssetCostsBlockDialogProps, BidStatusPhasePanel(), BidStatusPhasePanelProps, TerminalStatusSection()]
- "pages_biddetailsreportpage": "BidDetailsReportPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailsReportPage.tsx:L1 | neighbors=[583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, 8267c28 i18n: translate EASI, suppliers…, c271ce8 Refactor code structure for imp…, cce41cc refactor: clean up code formatt…]
- "common_emptystate": "EmptyState.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/EmptyState.tsx:L1 | neighbors=[BidActivityLog.tsx, EquipmentImportModal.tsx, ImportClarificationModal.tsx, ImportQualificationModal.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0]
- "utils_accesscontrol": "accessControl.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 79354cb Merge remote-tracking branch 'o…, 8e87d94 feat: Add Links and Recommendat…, 9582626 feat: add Access Log component …, bc10d67 feat: add pastBidHelpers and pa…]
- "utils_formatters_formatdate": "formatDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L74 | neighbors=[ApprovalTab.tsx, BidActivityLog.tsx, BidApprovalPanel.tsx, BidCard.tsx, BidExportTab.tsx, BidFxNote.tsx]
- "utils_surveydatajourney": "surveyDataJourney.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/surveyDataJourney.ts:L1 | neighbors=[3d59093 Merge feat/survey-data-journey …, 568e582 Merge feat/survey-journey-accur…, 90a8e89 fix(survey): correct data journ…, be5fb82 feat(survey): data journey from…, da217d4 feat(survey): physical-signal e…, SurveySystemPage.tsx]
- "layout_livepulsepanel": "LivePulsePanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L1 | neighbors=[0df87c0 refactor: improve code formatti…, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, 921bf0d feat: enhance SupplierDrawer wi…, aaa091c Add hooks for KPI targets and l…, bd70cf6 style: improve code formatting …]
- "pages_teamanalyticspage": "TeamAnalyticsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, 8267c28 i18n: translate EASI, suppliers…, 892c1fc feat: add PeoplePicker componen…, c271ce8 Refactor code structure for imp…]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-001.json

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
