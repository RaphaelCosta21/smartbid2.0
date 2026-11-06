# Node Description Batch 14 of 102

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

- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@3ae3801d6d77f9da72645213c5d3dbf0651776e2": "3ae3801 refactor: improve code formatting and readability across multiple compo…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, e61a9d3 feat: add notification system f…, GuidedTour.tsx, peoplesoftConsulting.i18n.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@4b5d46786b2109c3374e930da3bb104c02487afe": "4b5d467 feat: add BomQuotationPicker component and related utilities for BOM co…" | kind=Commit | source=git | neighbors=[excelStyles.ts, BomAnalysisCard.tsx, BomQuotationPicker.tsx, backup/survey-merge-20261018-113028-main, main, 93ca809 refactor: improve code formatti…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@66dbcee4d7bd13a06d483a5ba32ae0855cedd94c": "66dbcee feat: Implement contingency calculations and UI in AssetsBreakdownTab" | kind=Commit | source=git | neighbors=[AssetsBreakdownTab.tsx, ScopeOfSupplyTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@7ccad33a2eb80a023ab670cc42c05281ee48b185": "7ccad33 Refactor code structure and remove redundant code blocks for improved r…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main, c271ce8 Refactor code structure for imp…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@9759c3bd4b17e4f2ffcd2d8604b7a00e6b27ca16": "9759c3b Refactor DivisionBadge and MembersManagement components to use useStatu…" | kind=Commit | source=git | neighbors=[437d8e1 feat: implement notification lo…, ErnCreateModal.tsx, OverviewTab.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@aa081f98e098aab23c6317450d6d51404b1090fd": "aa081f9 refactor: Improve code formatting and readability across multiple compo…" | kind=Commit | source=git | neighbors=[5c35e8d feat: Implement Qualification L…, ImportQualificationModal.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, db68d81 feat: Enhance ErnCreateModal an…]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@ee6b009abc0d3123f341ad71e266a9d2e7835ccc": "ee6b009 feat(survey): upload equipment photos from the detail panel; readable t…" | kind=Commit | source=git | neighbors=[d574851 style(survey): calmer overview …, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@f393a0974756e0a44713b55b5e48e258f3ad2074": "f393a09 feat: add validation for quotation line item fields and improve error h…" | kind=Commit | source=git | neighbors=[bda0c32 style: Improve code formatting …, AddQuotationModal.tsx, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@fb4fa770760c34f03f37e99a3ccbc1894f5f89bc": "fb4fa77 Refactor code structure for improved readability and maintainability" | kind=Commit | source=git | neighbors=[cce6a16 Refactor code structure for imp…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@fbe2c0e98471289519e55e3f9cb9917e9fb2ceae": "fbe2c0e feat(survey): remove division/service line/status filters and family ta…" | kind=Commit | source=git | neighbors=[512f7b1 feat(survey): full-bleed 3D sea…, backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-kno…, backup/survey-merge-20261018-113028-main, feat/survey-knowledge-portal, main]
- "common_hoursimportpreview": "HoursImportPreview.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/HoursImportPreview.tsx:L1 | neighbors=[0546310 Add dashboard components and st…, 3c5c37b more-mods, 66dbcee feat: Implement contingency cal…, HoursCategory, HoursImportPreview(), HoursImportPreviewProps]
- "comparator_comparatorsetup": "ComparatorSetup.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/comparator/ComparatorSetup.tsx:L1 | neighbors=[a0cd8e2 feat: native quotations, BID pr…, f672a54 Refactor code structure for imp…, BidSelect.tsx, BidSelect(), IBidOption, MultiBidSelect()]
- "effects_effecttypes": "effectTypes.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/components/survey/survey3d/effects/effectTypes.ts:L1 | neighbors=[568e582 Merge feat/survey-journey-accur…, da217d4 feat(survey): physical-signal e…, EffectBuilder, EffectContext, SceneEffect, index.ts]
- "function_app_function_app_chat": "chat()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L1011 | neighbors=[function_app.py, _caller_upn(), _chat_bad_request(), _chat_messages(), _chat_past_bid_material(), _chat_reference_material()]
- "hooks_useregisterquotationsuppliers": "useRegisterQuotationSuppliers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useRegisterQuotationSuppliers.ts:L1 | neighbors=[AddQuotationModal.tsx, 02c1391 feat: Add supplier management f…, 414e1a6 style: Improve code formatting …, 79354cb Merge remote-tracking branch 'o…, useRegisterQuotationSuppliers(), useSupplierStore.ts]
- "hooks_useslidingindicator": "useSlidingIndicator.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useSlidingIndicator.ts:L1 | neighbors=[1d028a0 style: Improve code formatting …, 77f55d4 feat: Add Clarification Entry M…, 79354cb Merge remote-tracking branch 'o…, IIndicatorRect, ISlidingIndicator, useSlidingIndicator()]
- "layout_footer": "Footer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/Footer.tsx:L1 | neighbors=[1665b01 more features, 4657c82 Add smartbid-logo-teal.png asse…, fe3728a smartbid2.0, AppLayout.tsx, Footer(), oiiBlueLogo]
- "models_iclarificationdb_iclarificationdbitem": "IClarificationDbItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IClarificationDb.ts:L7 | neighbors=[ImportClarificationModal.tsx, useClarificationLibraryFilter.ts, ClarificationEntryDrawer.tsx, ClarificationEntryModal.tsx, IClarificationDb.ts, index.ts]
- "models_iqualificationdb_iqualificationdbitem": "IQualificationDbItem" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IQualificationDb.ts:L5 | neighbors=[ImportQualificationModal.tsx, useQualificationLibraryFilter.ts, QualificationEntryDrawer.tsx, QualificationEntryModal.tsx, QualificationLibraryView.tsx, QualificationTableModal.tsx]
- "models_isurveyglossary": "ISurveyGlossary.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISurveyGlossary.ts:L1 | neighbors=[3d59093 Merge feat/survey-data-journey …, d614a0b feat(survey): bilingual survey …, index.ts, ISurveyCatalog.ts, SurveyLinkKind, IGlossaryAnatomy]
- "services_easimodulesadapter_easimodulesadapter": "EasiModulesAdapter" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EasiModulesAdapter.ts:L42 | neighbors=[EasiModulesAdapter.ts, ._bids(), ._costRows(), .getBenchmarkDataset(), .getCostElementsRaw(), .getOpportunitiesRaw()]
- "services_linksrecommendationsservice_linksrecommendationsservice": "LinksRecommendationsService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L19 | neighbors=[LinksRecommendationsPage.tsx, LinksRecommendationsService.ts, .addLink(), .addRecommendation(), .getAll(), ._list()]
- "services_systemconfigservice_systemconfigservice": "SystemConfigService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/SystemConfigService.ts:L12 | neighbors=[DocLibraryCatalog.tsx, AppLayout.tsx, NotificationDispatchService.ts, RequestService.ts, SystemConfigService.ts, .clearCache()]
- "services_templateservice": "TemplateService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/TemplateService.ts:L1 | neighbors=[3c5c37b more-mods, 4b576db AI-Integration, 4c2e63a update smartbid 2.0, dbdc03a systemconfig online, e2285cf cont-implementing, IBidTemplate.ts]
- "stores_useauthstore_useauthstore": "useAuthStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useAuthStore.ts:L29 | neighbors=[useAccessLevel.ts, useCurrentUser.ts, useOpenBid.ts, AppLayout.tsx, Header.tsx, LivePulse.tsx]
- "stores_usefavoritesstore_usefavoritesstore": "useFavoritesStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useFavoritesStore.ts:L69 | neighbors=[BidFavoriteButton.tsx, EquipmentImportModal.tsx, ScopeOfSupplyTab.tsx, AIDocumentAnalyzer.tsx, ImportSourceModal.tsx, QueryCatalogLoadingBanner.tsx]
- "template_templatecard": "TemplateCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateCard.tsx:L1 | neighbors=[165493f NEW-MODIFIC, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 583d03e Refactor string concatenation i…, 79354cb Merge remote-tracking branch 'o…, c4e04de lots-implementation]
- "utils_clarificationhelpers_activeconfigoptions": "activeConfigOptions()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/clarificationHelpers.ts:L32 | neighbors=[QualificationsTab.tsx, ScopeOfSupplyTab.tsx, useClarificationLibraryFilter.ts, useQualificationLibraryFilter.ts, ClarificationEntryModal.tsx, QualificationCategoryInput.tsx]
- "utils_costcalculations_getsplitnode": "getSplitNode()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L239 | neighbors=[AssetsBreakdownTab.tsx, rows.ts, costCalculations.ts, getSplitCost(), applyContingencyToCost(), getEffectiveCategory()]
- "utils_costcalculations_getsubitemnode": "getSubItemNode()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/costCalculations.ts:L288 | neighbors=[AssetsBreakdownTab.tsx, costCalculations.ts, getSubItemCostTotal(), applyContingencyToCost(), getEffectiveCategory(), getFeesTotal()]
- "utils_ernhelpers_geternlinks": "getErnLinks()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/ernHelpers.ts:L107 | neighbors=[BidCard.tsx, DashboardBidTable.tsx, BidDetailPage.tsx, BidTrackerPage.tsx, analyticsHelpers.ts, ernHelpers.ts]
- "utils_pastbiddocument_clean": "clean()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/pastBidDocument.ts:L47 | neighbors=[clarificationLibraryDocument.ts, pastBidDocument.ts, buildPastBidDocument(), buildPastBidFileName(), buildPastBidMetadata(), heading()]
- "approval_approvaltimeline": "ApprovalTimeline.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalTimeline.tsx:L1 | neighbors=[ApprovalTimeline(), ApprovalTimelineProps, Timeline.tsx, Timeline(), IBidApproval.ts, IApprovalChain]
- "bid_bidphaseprogress": "BidPhaseProgress.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/BidPhaseProgress.tsx:L1 | neighbors=[BidPhaseProgress(), BidPhaseProgressProps, useConfigPhases.ts, useConfigPhases(), 0e653cd more mods, 3a3d0a5 new changes]
- "bid_technicalproposalchip": "TechnicalProposalChip.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/TechnicalProposalChip.tsx:L1 | neighbors=[DocumentsTab.tsx, OverviewTab.tsx, STATE_CLASS, TechnicalProposalChip(), TechnicalProposalChipProps, technicalProposalHelpers.ts]
- "bidexcelexport_excelstyles_activecolumns": "activeColumns()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L184 | neighbors=[excelStyles.ts, assetsSheet.ts, certificationsSheet.ts, hoursSheet.ts, logisticsSheet.ts, prepMobSheet.ts]
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@dbc974b8371d53e5f0e855d3b62dcdf3692211c6": "dbc974b Refactor email template HTML for improved readability and maintainabili…" | kind=Commit | source=git | neighbors=[backup/survey-merge-20261018-113028-jou…, backup/survey-merge-20261018-113028-main, main, 437d8e1 feat: implement notification lo…, notifications.config.ts, NotificationDispatchService.ts]
- "common_countdowntimer": "CountdownTimer.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/CountdownTimer.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, 5577aab feat: Add Technical Proposal fu…, 79354cb Merge remote-tracking branch 'o…, bec8260 feat: Enhance bid management wi…, CountdownTimer()]
- "common_importsourcelist": "ImportSourceList.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ImportSourceList.tsx:L1 | neighbors=[3c5c37b more-mods, 79354cb Merge remote-tracking branch 'o…, f03d3f6 feat: Enhance ImportSourceModal…, IImportSource, ImportSourceList(), ImportSourceListProps]
- "common_phasebadge": "PhaseBadge.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PhaseBadge.tsx:L1 | neighbors=[BidActivityLog.tsx, 0e653cd more mods, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, PhaseBadge(), PhaseBadgeProps]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-013.json

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
