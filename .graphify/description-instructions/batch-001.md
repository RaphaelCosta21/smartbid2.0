# Node Description Batch 2 of 86

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

- "utils_approvalhelpers": "approvalHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/approvalHelpers.ts:L1 | neighbors=[ApprovalTab.tsx, OverviewTab.tsx, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, adc0d38 Refactor TemplatesPage: Enhance…, bc10d67 feat: add pastBidHelpers and pa…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@aaa091c8347b9df3be7a39ff26ff870480b701d2": "aaa091c Add hooks for KPI targets and live overview, along with utility functio…" | kind=Commit | source=git | neighbors=[AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidFxNote.tsx, BidHoursTable.tsx, BidTabHeader.tsx, CertificationsBreakdownTab.tsx]
- "pages_queryconsultingpage": "QueryConsultingPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QueryConsultingPage.tsx:L1 | neighbors=[2d4ecdb style: improve code formatting …, 3ae3801 refactor: improve code formatti…, 583d03e Refactor string concatenation i…, 9582626 feat: add Access Log component …, 9cc3475 feat: Integrate Financials Acti…, adc0d38 Refactor TemplatesPage: Enhance…]
- "utils_bidhelpers": "bidHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidHelpers.ts:L1 | neighbors=[BidCard.tsx, OverviewTab.tsx, 0546310 Add dashboard components and st…, 0e653cd more mods, 3a3d0a5 new changes, 5577aab feat: Add Technical Proposal fu…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@5577aabf1f9439b5493f6f97119132a9389c7bd2": "5577aab feat: Add Technical Proposal functionality and enhance date handling" | kind=Commit | source=git | neighbors=[BidCard.tsx, BidFavoriteButton.tsx, DocumentsTab.tsx, DueDateChangeModal.tsx, OverviewTab.tsx, TechnicalProposalChip.tsx]
- "pages_quotationspage": "QuotationsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/QuotationsPage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 165493f NEW-MODIFIC, 2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 4b576db AI-Integration, 4c2e63a update smartbid 2.0]
- "bid_addquotationmodal": "AddQuotationModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/AddQuotationModal.tsx:L1 | neighbors=[AddQuotationModal(), AddQuotationModalProps, blankLineItem(), genId(), ILineItem, SupplierCombobox.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@75476a5724f12a95dd5057ba6ead9f411e7622e8": "75476a5 feat: add confidentiality management for bids" | kind=Commit | source=git | neighbors=[20d52ed feat: Add urgency reason stylin…, ApprovalTab.tsx, BidActivityLog.tsx, BidCard.tsx, BidConfidentialButton.tsx, BidCostSummary.tsx]
- "layout_livepulse": "LivePulse.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulse.tsx:L1 | neighbors=[0df87c0 refactor: improve code formatti…, 2538d01 feat: Implement Access Matrix c…, 75476a5 feat: add confidentiality manag…, 921bf0d feat: enhance SupplierDrawer wi…, 9582626 feat: add Access Log component …, aaa091c Add hooks for KPI targets and l…]
- "services_aianalysisservice": "AIAnalysisService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/AIAnalysisService.ts:L1 | neighbors=[AddQuotationModal.tsx, QualificationsTab.tsx, 00efd39 Refactor Excel export sheets fo…, 02c1391 feat: Add supplier management f…, 401be0c Add EntraTokenTest component fo…, 414e1a6 style: Improve code formatting …]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@2538d01302da56d388c088c6a404dede8561dc62": "2538d01 feat: Implement Access Matrix component and related access control conf…" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, EquipmentImportModal.tsx, NotesTab.tsx, OverviewTab.tsx, QualificationsTab.tsx, main]
- "models_isystemconfig": "ISystemConfig.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 165493f NEW-MODIFIC, 2538d01 feat: Implement Access Matrix c…, 3c5c37b more-mods, 75476a5 feat: add confidentiality manag…, 77f55d4 feat: Add Clarification Entry M…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@02c1391daa4012ed9631b3b59e28efe88ad75ce6": "02c1391 feat: Add supplier management features including service types, quotati…" | kind=Commit | source=git | neighbors=[AddQuotationModal.tsx, main, 414e1a6 style: Improve code formatting …, SupplierCombobox.tsx, ai.prompts.ts, sharepoint.config.ts]
- "pages_templatespage": "TemplatesPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TemplatesPage.tsx:L1 | neighbors=[165493f NEW-MODIFIC, 2538d01 feat: Implement Access Matrix c…, 2d4ecdb style: improve code formatting …, 3a3d0a5 new changes, 401be0c Add EntraTokenTest component fo…, 4b576db AI-Integration]
- "pages_performancetrendspage": "PerformanceTrendsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PerformanceTrendsPage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 5577aab feat: Add Technical Proposal fu…, 8267c28 i18n: translate EASI, suppliers…, 892c1fc feat: add PeoplePicker componen…, aaa091c Add hooks for KPI targets and l…, c271ce8 Refactor code structure for imp…]
- "stores_usebidstore": "useBidStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useBidStore.ts:L1 | neighbors=[BidConfidentialButton.tsx, BidExportTab.tsx, ConfidentialLock.tsx, DocumentsTab.tsx, ScopeOfSupplyTab.tsx, 02c1391 feat: Add supplier management f…]
- "stores_useuistore": "useUIStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useUIStore.ts:L1 | neighbors=[AddQuotationModal.tsx, ApprovalTab.tsx, BidConfidentialButton.tsx, BidExportTab.tsx, BidFavoriteButton.tsx, DocumentsTab.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@0e653cd1112bcfa71621ebd9aa14b7d571667c54": "0e653cd more mods" | kind=Commit | source=git | neighbors=[BidCard.tsx, BidPhaseProgress.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx]
- "function_app_function_app": "function_app.py" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L1 | neighbors=[02c1391 feat: Add supplier management f…, 401be0c Add EntraTokenTest component fo…, 961eb93 feat: Update AI integration and…, 9e27edd feat: Update AI integration and…, b6d954d feat: Enhance AIAnalysisService…, bc10d67 feat: add pastBidHelpers and pa…]
- "pages_timelinepage": "TimelinePage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TimelinePage.tsx:L1 | neighbors=[1665b01 more features, 1d028a0 style: Improve code formatting …, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…]
- "utils_ernhelpers": "ernHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L1 | neighbors=[BidCard.tsx, ErnCreateModal.tsx, ErnDetailsModal.tsx, ErnSearchModal.tsx, OverviewTab.tsx, 5577aab feat: Add Technical Proposal fu…]
- "bid_bidstatusphasepanel": "BidStatusPhasePanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidStatusPhasePanel.tsx:L1 | neighbors=[ApprovalTab.tsx, AssetCostsBlockDialog(), AssetCostsBlockDialogProps, BidStatusPhasePanel(), BidStatusPhasePanelProps, TerminalStatusSection()]
- "pages_biddetailsreportpage": "BidDetailsReportPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BidDetailsReportPage.tsx:L1 | neighbors=[583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 8267c28 i18n: translate EASI, suppliers…, c271ce8 Refactor code structure for imp…, cce41cc refactor: clean up code formatt…, ddf6c96 Merge branch 'feat/survey-knowl…]
- "pages_bomcostspage": "BomCostsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/BomCostsPage.tsx:L1 | neighbors=[165493f NEW-MODIFIC, 2538d01 feat: Implement Access Matrix c…, 583d03e Refactor string concatenation i…, e2285cf cont-implementing, ea5c8e6 Refactor UI components for cons…, AppLayout.tsx]
- "bidexcelexport_excelstyles": "excelStyles.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L1 | neighbors=[context.ts, activeColumns(), clean(), colOf(), currencyFmt(), displayDate()]
- "utils_accesscontrol": "accessControl.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/accessControl.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 8e87d94 feat: Add Links and Recommendat…, 9582626 feat: add Access Log component …, bc10d67 feat: add pastBidHelpers and pa…, d23a43b feat: enhance ERN management wi…]
- "layout_livepulsepanel": "LivePulsePanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/LivePulsePanel.tsx:L1 | neighbors=[0df87c0 refactor: improve code formatti…, 75476a5 feat: add confidentiality manag…, 921bf0d feat: enhance SupplierDrawer wi…, aaa091c Add hooks for KPI targets and l…, bd70cf6 style: improve code formatting …, LivePulse.tsx]
- "pages_teamanalyticspage": "TeamAnalyticsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/TeamAnalyticsPage.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 583d03e Refactor string concatenation i…, 8267c28 i18n: translate EASI, suppliers…, 892c1fc feat: add PeoplePicker componen…, c271ce8 Refactor code structure for imp…, ddf6c96 Merge branch 'feat/survey-knowl…]
- "utils_qualificationhelpers": "qualificationHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/qualificationHelpers.ts:L1 | neighbors=[ImportQualificationModal.tsx, QualificationsTab.tsx, QualificationSuggestionsModal.tsx, ScopeOfSupplyTab.tsx, 5c35e8d feat: Implement Qualification L…, aa081f9 refactor: Improve code formatti…]
- "bidexcelexport_rows": "rows.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/rows.ts:L1 | neighbors=[BidExportTab.tsx, ScopeOfSupplyTab.tsx, buildAssetSummary(), buildSupplierRows(), categoryLabel(), CostEntry]
- "dashboard_dashboardbidtable": "DashboardBidTable.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardBidTable.tsx:L1 | neighbors=[75476a5 feat: add confidentiality manag…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…, ConfidentialLock.tsx, ConfidentialLock(), ColumnFilter.tsx]
- "knowledge_qualificationlibraryview": "QualificationLibraryView.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/QualificationLibraryView.tsx:L1 | neighbors=[5c35e8d feat: Implement Qualification L…, ConfirmDialog.tsx, ConfirmDialog(), DataTable.tsx, DataTable(), DivisionBadge.tsx]
- "settings_membersmanagement": "MembersManagement.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/MembersManagement.tsx:L1 | neighbors=[02c1391 feat: Add supplier management f…, 2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 414e1a6 style: Improve code formatting …, 8f7062d Remove outdated UI/UX design gu…, 953278b feat: add ApprovalDueImpactSect…]
- "utils_formatters_formatdate": "formatDate()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/formatters.ts:L67 | neighbors=[ApprovalTab.tsx, BidActivityLog.tsx, BidApprovalPanel.tsx, BidCard.tsx, BidExportTab.tsx, BidFxNote.tsx]
- "bid_bidactivitylog": "BidActivityLog.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidActivityLog.tsx:L1 | neighbors=[ACTIVITY_ICONS, BidActivityLog(), BidActivityLogProps, CategoryFilter, getInitials(), metaString()]
- "models_iaianalysis": "IAIAnalysis.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAIAnalysis.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 4b576db AI-Integration, 5c35e8d feat: Implement Qualification L…, 961eb93 feat: Update AI integration and…, b6d954d feat: Enhance AIAnalysisService…, bc10d67 feat: add pastBidHelpers and pa…]
- "survey3d_createsurveyscene": "createSurveyScene.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/createSurveyScene.ts:L1 | neighbors=[0a8206d feat(survey): 3D navigation - S…, 4c720fd style(survey): IMR-style proced…, 50a29c7 feat(survey): Full Survey Sprea…, 512f7b1 feat(survey): full-bleed 3D sea…, 67bbf62 feat(survey): apply Figma look …, 86dba8c feat(survey): restore three.js …]
- "utils_kpihelpers": "kpiHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/kpiHelpers.ts:L1 | neighbors=[aaa091c Add hooks for KPI targets and l…, bd70cf6 style: improve code formatting …, KPICard.tsx, DashboardKPIRow.tsx, ErnDashboardSection.tsx, useKpiTargets.ts]
- "common_aidocumentanalyzer": "AIDocumentAnalyzer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/AIDocumentAnalyzer.tsx:L1 | neighbors=[AITab.tsx, 4b576db AI-Integration, 583d03e Refactor string concatenation i…, 8878a6b fix: Improve formatting in AIDo…, aaa091c Add hooks for KPI targets and l…, c58a13c new-implementations]
- "bid_bidhourstable": "BidHoursTable.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidHoursTable.tsx:L1 | neighbors=[BidFxNote.tsx, BidFxNote(), BidHoursTable(), BidHoursTableProps, blankHoursItem(), ColorPickerInline()]

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
