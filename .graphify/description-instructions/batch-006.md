# Node Description Batch 7 of 102

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

- "dashboard_approvalspending": "ApprovalsPending.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/ApprovalsPending.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…]
- "dashboard_dashboardkpirow": "DashboardKPIRow.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/dashboard/DashboardKPIRow.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 3a3d0a5 new changes, 79354cb Merge remote-tracking branch 'o…, aaa091c Add hooks for KPI targets and l…, bd70cf6 style: improve code formatting …, fe3728a smartbid2.0]
- "effects_index": "index.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/index.ts:L1 | neighbors=[568e582 Merge feat/survey-journey-accur…, da217d4 feat(survey): physical-signal e…, surveyDataFormats.ts, JourneyEffectKind, effectTypes.ts, EffectBuilder]
- "function_app_document_structure": "document_structure.py" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L1 | neighbors=[02c1391 feat: Add supplier management f…, 79354cb Merge remote-tracking branch 'o…, b6d954d feat: Enhance AIAnalysisService…, bc10d67 feat: add pastBidHelpers and pa…, _atomic_blocks(), _atx_heading()]
- "hooks_useliveoverview": "useLiveOverview.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useLiveOverview.ts:L1 | neighbors=[79354cb Merge remote-tracking branch 'o…, 921bf0d feat: enhance SupplierDrawer wi…, aaa091c Add hooks for KPI targets and l…, ErnDashboardSection.tsx, ErnLiveKpis, ILiveUpdate]
- "pages_approvalspage": "ApprovalsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ApprovalsPage.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, c4e04de lots-implementation]
- "pages_reportspage": "ReportsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/ReportsPage.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 8267c28 i18n: translate EASI, suppliers…, c271ce8 Refactor code structure for imp…, ddf6c96 Merge branch 'feat/survey-knowl…, AppLayout.tsx]
- "stores_usesurveystore": "useSurveyStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useSurveyStore.ts:L1 | neighbors=[50a29c7 feat(survey): Full Survey Sprea…, 512f7b1 feat(survey): full-bleed 3D sea…, 7342177 Merge feat/survey-surface-spare…, ca73461 feat(survey): spare quantities,…, ddf6c96 Merge branch 'feat/survey-knowl…, ee6b009 feat(survey): upload equipment …]
- "utils_nmeadecode": "nmeaDecode.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/nmeaDecode.ts:L1 | neighbors=[3d59093 Merge feat/survey-data-journey …, d614a0b feat(survey): bilingual survey …, SurveyNmeaLab.tsx, index.ts, checksumOf(), fail()]
- "utils_suppliermatching": "supplierMatching.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/supplierMatching.ts:L1 | neighbors=[AddQuotationModal.tsx, 02c1391 feat: Add supplier management f…, 414e1a6 style: Improve code formatting …, 79354cb Merge remote-tracking branch 'o…, SupplierCombobox.tsx, QuotationsPage.tsx]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@bee3eb5990dff7fbca97757f0147b1748e40c102": "bee3eb5 feat: Enhance bid model with availability splits and engineering details" | kind=Commit | source=git | neighbors=[1665b01 more features, AssetsBreakdownTab.tsx, BidCostSummary.tsx, BidHoursTable.tsx, BidStatusPhasePanel.tsx, EngineeringHoursSection.tsx]
- "common_partnumberautocomplete": "PartNumberAutocomplete.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PartNumberAutocomplete.tsx:L1 | neighbors=[AssetsBreakdownTab.tsx, CostSearchModal.tsx, ScopeOfSupplyTab.tsx, 0546310 Add dashboard components and st…, 165493f NEW-MODIFIC, 54fea3b feat: Enhance Part Number Autoc…]
- "config_ai_prompts": "ai.prompts.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/ai.prompts.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 4b576db AI-Integration, 5c35e8d feat: Implement Qualification L…, 79354cb Merge remote-tracking branch 'o…, 961eb93 feat: Update AI integration and…, b6d954d feat: Enhance AIAnalysisService…]
- "hooks_usebids": "useBids.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useBids.ts:L1 | neighbors=[c4e04de lots-implementation, fe3728a smartbid2.0, useBids(), index.ts, useBidStore.ts, useBidStore]
- "hooks_usepageaccess": "usePageAccess.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/usePageAccess.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 79354cb Merge remote-tracking branch 'o…, RequirePageAccess.tsx, IPageAccess, PageAccessContext, usePageAccess()]
- "knowledge_clarificationentrydrawer": "ClarificationEntryDrawer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationEntryDrawer.tsx:L1 | neighbors=[1d028a0 style: Improve code formatting …, 75476a5 feat: add confidentiality manag…, 77f55d4 feat: Add Clarification Entry M…, 79354cb Merge remote-tracking branch 'o…, ConfidentialLock.tsx, ConfidentialLock()]
- "knowledge_pastbidcard": "PastBidCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidCard.tsx:L1 | neighbors=[583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, bec8260 feat: Enhance bid management wi…, BidFavoriteButton.tsx, BidFavoriteButton()]
- "knowledge_pastbiddrawer": "PastBidDrawer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/PastBidDrawer.tsx:L1 | neighbors=[00efd39 Refactor Excel export sheets fo…, 5577aab feat: Add Technical Proposal fu…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…]
- "services_quotationservice_quotationservice": "QuotationService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/QuotationService.ts:L24 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, LinkedQuotationsPanel.tsx, QuotationControlPanel.tsx, BomQuotationPicker.tsx, BomCostsPage.tsx]
- "settings_accesslog": "AccessLog.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/settings/AccessLog.tsx:L1 | neighbors=[3ae3801 refactor: improve code formatti…, 9582626 feat: add Access Log component …, DataTable.tsx, DataTable(), EmptyState.tsx, EmptyState()]
- "sheets_prepmobsheet": "prepMobSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/prepMobSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, bc10d67 feat: add pastBidHelpers and pa…, context.ts]
- "utils_notificationevents": "notificationEvents.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/notificationEvents.ts:L1 | neighbors=[14b96c8 feat: implement approval round …, 8152d02 feat: implement split approval …, dbc974b Refactor email template HTML fo…, e61a9d3 feat: add notification system f…, BidDetailPage.tsx, CreateRequestPage.tsx]
- "bid_bidtimeline": "BidTimeline.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidTimeline.tsx:L1 | neighbors=[BidTimeline(), BidTimelineProps, getPhaseTotalHours(), useLiveElapsed(), GlassCard.tsx, GlassCard()]
- "bom_bomquotationpicker": "BomQuotationPicker.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bom/BomQuotationPicker.tsx:L1 | neighbors=[BomQuotationPicker(), IBomQuotationPickerProps, TypeFilter, MultiSelectDropdown.tsx, MultiSelectDropdown(), MultiSelectOption]
- "hooks_useaccesslevel": "useAccessLevel.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAccessLevel.ts:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 79354cb Merge remote-tracking branch 'o…, fe3728a smartbid2.0, RequirePageAccess.tsx, IAccessLevelApi, useAccessLevel()]
- "hooks_usekpis": "useKPIs.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useKPIs.ts:L1 | neighbors=[0e653cd more mods, 5577aab feat: Add Technical Proposal fu…, 79354cb Merge remote-tracking branch 'o…, 8e87d94 feat: Add Links and Recommendat…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…]
- "knowledge_clarificationbadges": "ClarificationBadges.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationBadges.tsx:L1 | neighbors=[ExportClarificationModal.tsx, ImportClarificationModal.tsx, ImportQualificationModal.tsx, QualificationGroupList.tsx, QualificationsTab.tsx, 1d028a0 style: Improve code formatting …]
- "layout_commandpalette": "CommandPalette.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/CommandPalette.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 583d03e Refactor string concatenation i…, 75476a5 feat: add confidentiality manag…, 79354cb Merge remote-tracking branch 'o…, 8e87d94 feat: Add Links and Recommendat…, ea5c8e6 Refactor UI components for cons…]
- "layout_header": "Header.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Header.tsx:L1 | neighbors=[1665b01 more features, 4c2e63a update smartbid 2.0, 747fd66 feat(survey): Oceaneering theme…, 79354cb Merge remote-tracking branch 'o…, 953278b feat: add ApprovalDueImpactSect…, aaa091c Add hooks for KPI targets and l…]
- "pages_linksrecommendationspage": "LinksRecommendationsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/LinksRecommendationsPage.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 79354cb Merge remote-tracking branch 'o…, 8e87d94 feat: Add Links and Recommendat…, AppLayout.tsx, PageHeader.tsx, PageHeader()]
- "pages_pricehistorypage": "PriceHistoryPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/PriceHistoryPage.tsx:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, AppLayout.tsx, EmptyState.tsx, EmptyState(), PageHeader.tsx]
- "sheets_infosheet": "infoSheet.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/sheets/infoSheet.ts:L1 | neighbors=[index.ts, 00efd39 Refactor Excel export sheets fo…, 24595c5 feat: Enhance Bid Export functi…, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, 8152d02 feat: implement split approval …]
- "utils_bidconfidentiality": "bidConfidentiality.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidConfidentiality.ts:L1 | neighbors=[ApprovalTab.tsx, BidConfidentialButton.tsx, ConfidentialAccessModal.tsx, ConfidentialLock.tsx, 75476a5 feat: add confidentiality manag…, cce41cc refactor: clean up code formatt…]
- "utils_constants": "constants.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/constants.ts:L1 | neighbors=[OverviewTab.tsx, 3a3d0a5 new changes, 8152d02 feat: implement split approval …, fe3728a smartbid2.0, PriorityBadge.tsx, useStatusColors.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@bda0c32eefe41f98fa35aef14d9ae38e9e7fbfea": "bda0c32 style: Improve code formatting and readability across multiple componen…" | kind=Commit | source=git | neighbors=[953278b feat: add ApprovalDueImpactSect…, BidStatusPhasePanel.tsx, DocumentsTab.tsx, QualificationsTab.tsx, excelStyles.ts, backup/survey-merge-20261018-113028-jou…]
- "common_divisionbadge": "DivisionBadge.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/DivisionBadge.tsx:L1 | neighbors=[ImportClarificationModal.tsx, ImportQualificationModal.tsx, 0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 9759c3b Refactor DivisionBadge and Memb…]
- "common_guidedtour": "GuidedTour.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/GuidedTour.tsx:L1 | neighbors=[3ae3801 refactor: improve code formatti…, 9582626 feat: add Access Log component …, computePlacement(), findTarget(), getScrollParent(), GuidedTour()]
- "common_skeletonloader": "SkeletonLoader.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SkeletonLoader.tsx:L1 | neighbors=[EquipmentImportModal.tsx, ImportClarificationModal.tsx, ImportQualificationModal.tsx, QuotationControlPanel.tsx, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0]
- "common_statusbadge_statusbadge": "StatusBadge()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/StatusBadge.tsx:L12 | neighbors=[BidActivityLog.tsx, BidCard.tsx, BidStatusPhasePanel.tsx, BidTimeline.tsx, DocumentsTab.tsx, OverviewTab.tsx]
- "services_clarificationknowledgeservice": "ClarificationKnowledgeService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ClarificationKnowledgeService.ts:L1 | neighbors=[02c1391 feat: Add supplier management f…, 5c35e8d feat: Implement Qualification L…, 79354cb Merge remote-tracking branch 'o…, useClarificationLibrarySync.ts, ClarificationsDbPage.tsx, IClarificationDb.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-006.json

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
