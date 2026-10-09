# Node Description Batch 16 of 86

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

- "bidexcelexport_excelstyles_xlsheet_banner": ".banner()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L332 | neighbors=[XlSheet, .fillRange(), .font(), .gap(), .noticeStrip(), .placeLogo()] | lang=en
- "bidexcelexport_excelstyles_xlsheet_fillrange": ".fillRange()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L306 | neighbors=[XlSheet, .band(), .banner(), .keyValue(), .note(), .noticeStrip()] | lang=en
- "bidexcelexport_excelstyles_xlsheet_keyvalue": ".keyValue()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts:L651 | neighbors=[XlSheet, thin(), .estimateHeight(), .fillRange(), .font(), .setValue()] | lang=en
- "bidexcelexport_runtime": "runtime.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bidExcelExport/runtime.ts:L1 | neighbors=[index.ts, loadExcelJS(), loadLogoDataUrl(), logoUrl, sanitizeFilePart(), 77f55d4 feat: Add Clarification Entry M…] | lang=en
- "charts_sparkline_sparkline": "Sparkline()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/Sparkline.tsx:L16 | neighbors=[Sparkline.tsx, AnalyticsPage.tsx, FollowUpPage.tsx, OperationalSummaryPage.tsx, PerformanceTrendsPage.tsx, PeriodPerformancePage.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@1a408964e22f1b844317d2fc1998c984b68bf2da": "1a40896 feat: add SmartBid 2.0 Executive Summary Slides generator script" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, feat/easi-modules-pages, main, 0546310 Add dashboard components and st…, sharepoint.config.ts, ApprovalService.ts] | lang=pt
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@1c19dcd6cdc642389f57af4a30dc6ca485449cd0": "1c19dcd Update API diagnostics and AI configuration; enhance AiAuthService logg…" | kind=Commit | source=git | neighbors=[feat/easi-modules-pages, main, 961eb93 feat: Update AI integration and…, ai.config.ts, AiAuthService.ts, SystemConfiguration.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@20d52eda78a815d7bf708d2f471fb68d7afdf050": "20d52ed feat: Add urgency reason styling and enhance related components for bet…" | kind=Commit | source=git | neighbors=[AssetsBreakdownTab.tsx, EquipmentImportModal.tsx, OverviewTab.tsx, ScopeOfSupplyTab.tsx, main, 75476a5 feat: add confidentiality manag…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@437d8e12e6a30c09f46fe6035dcb551427e44ae2": "437d8e1 feat: implement notification log service and provisioning; enhance noti…" | kind=Commit | source=git | neighbors=[main, 9759c3b Refactor DivisionBadge and Memb…, sharepoint.config.ts, NotificationLogService.ts, NotificationMatrix.tsx, SystemConfiguration.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@66dbcee4d7bd13a06d483a5ba32ae0855cedd94c": "66dbcee feat: Implement contingency calculations and UI in AssetsBreakdownTab" | kind=Commit | source=git | neighbors=[AssetsBreakdownTab.tsx, ScopeOfSupplyTab.tsx, feat/easi-modules-pages, main, f3095f2 feat: add ApprovalTab component…, HoursImportPreview.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@7ccad33a2eb80a023ab670cc42c05281ee48b185": "7ccad33 Refactor code structure and remove redundant code blocks for improved r…" | kind=Commit | source=git | neighbors=[feat/easi-modules-pages, main, c271ce8 Refactor code structure for imp…, IBid.ts, index.ts, BidDetailPage.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@ee6b009abc0d3123f341ad71e266a9d2e7835ccc": "ee6b009 feat(survey): upload equipment photos from the detail panel; readable t…" | kind=Commit | source=git | neighbors=[d574851 style(survey): calmer overview …, main, 54594e6 style(survey): neutral silver f…, SurveyCatalogService.ts, useSurveyStore.ts, SurveyEquipmentCard.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@fb4fa770760c34f03f37e99a3ccbc1894f5f89bc": "fb4fa77 Refactor code structure for improved readability and maintainability" | kind=Commit | source=git | neighbors=[cce6a16 Refactor code structure for imp…, feat/easi-modules-pages, main, 401be0c Add EntraTokenTest component fo…, ai.config.ts, function_app.py] | lang=en
- "common_collapsiblesidebar": "CollapsibleSidebar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/CollapsibleSidebar.tsx:L1 | neighbors=[b6d954d feat: Enhance AIAnalysisService…, CollapsibleSidebar(), ICollapsibleSidebarProps, BidDetailPage.tsx, FavoritesPage.tsx, QuotationsPage.tsx] | lang=en
- "common_photolightbox": "PhotoLightbox.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/PhotoLightbox.tsx:L1 | neighbors=[EquipmentImportModal.tsx, e2285cf cont-implementing, PhotoLightbox(), PhotoLightboxProps, AddFavoriteEquipmentModal.tsx, FavoritesPage.tsx] | lang=en
- "common_progressbar": "ProgressBar.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/ProgressBar.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ProgressBar(), ProgressBarProps, BottleneckAnalysisPage.tsx, TeamAnalyticsPage.tsx] | lang=en
- "function_app_document_structure_is_boilerplate": "_is_boilerplate()" | kind=code-symbol | source=azure-ai-backend/function-app/document_structure.py:L150 | neighbors=[document_structure.py, _has_letters(), _normalize(), _recurs_per_page(), Digit masking is what catches a running…, strip_boilerplate()] | lang=en
- "function_app_function_app_caller_upn": "_caller_upn()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L641 | neighbors=[function_app.py, chat(), extract_quotation(), generate_scope(), UPN of the authenticated caller, from t…, suggest_clarifications()] | lang=en
- "function_app_function_app_document_text": "_document_text()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L321 | neighbors=[function_app.py, ensure_text(), extract_text_or_images(), extract_quotation(), generate_scope(), Return (text, warnings), capping the le…] | lang=en
- "function_app_function_app_group_by_document": "_group_by_document()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L480 | neighbors=[function_app.py, _chat_past_bid_material(), _clarification_library_material(), _clarification_material(), _parent_key(), _past_bid_scope_material()] | lang=en
- "function_app_function_app_model_json": "_model_json()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L309 | neighbors=[function_app.py, chat(), extract_quotation(), generate_scope(), Parse the model's JSON answer. A reason…, suggest_clarifications()] | lang=en
- "hooks_useanalyticsfilters_useanalyticsfilters": "UseAnalyticsFilters" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useAnalyticsFilters.ts:L78 | neighbors=[useAnalyticsFilters.ts, BottleneckAnalysisPage.tsx, FollowUpPage.tsx, OperationalSummaryPage.tsx, PerformanceTrendsPage.tsx, PeriodPerformancePage.tsx] | lang=en
- "hooks_useapprovals": "useApprovals.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useApprovals.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, ApprovalSummary, useApprovals(), index.ts, useBidStore.ts, useBidStore] | lang=en
- "hooks_usekpitargets_usekpitargets": "useKpiTargets()" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useKpiTargets.ts:L7 | neighbors=[DashboardKPIRow.tsx, ErnDashboardSection.tsx, useKpiTargets.ts, CreateRequestPage.tsx, DashboardPage.tsx, OperationalSummaryPage.tsx] | lang=en
- "hooks_useteammembers": "useTeamMembers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useTeamMembers.ts:L1 | neighbors=[ErnCreateModal.tsx, c271ce8 Refactor code structure for imp…, useTeamMembers(), index.ts, MembersService.ts, MembersService] | lang=en
- "insights_aiinsightspanel": "AIInsightsPanel.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AIInsightsPanel.tsx:L1 | neighbors=[8267c28 i18n: translate EASI, suppliers…, c271ce8 Refactor code structure for imp…, ddf6c96 Merge branch 'feat/survey-knowl…, AIInsightsPanel(), AIInsightsPanelProps, BottleneckAnalysisPage.tsx] | lang=en
- "insights_analyticsfilterbar_analyticsfilterbar": "AnalyticsFilterBar()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/insights/AnalyticsFilterBar.tsx:L59 | neighbors=[AnalyticsFilterBar.tsx, BottleneckAnalysisPage.tsx, FollowUpPage.tsx, OperationalSummaryPage.tsx, PerformanceTrendsPage.tsx, PeriodPerformancePage.tsx] | lang=en
- "knowledge_clarificationbadges_clarificationoriginchip": "ClarificationOriginChip()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/knowledge/ClarificationBadges.tsx:L47 | neighbors=[ImportClarificationModal.tsx, ImportQualificationModal.tsx, ClarificationBadges.tsx, ClarificationEntryDrawer.tsx, QualificationEntryDrawer.tsx, QualificationLibraryView.tsx] | lang=en
- "layout_sidebaritem": "SidebarItem.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarItem.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 3c5c37b more-mods, 4c2e63a update smartbid 2.0, Sidebar.tsx, SidebarItem()] | lang=en
- "layout_sidebarsubmenu": "SidebarSubmenu.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarSubmenu.tsx:L1 | neighbors=[2538d01 feat: Implement Access Matrix c…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0, ea5c8e6 Refactor UI components for cons…, Sidebar.tsx, SidebarSubmenu()] | lang=en
- "models_iassetcatalog": "IAssetCatalog.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAssetCatalog.ts:L1 | neighbors=[EquipmentImportModal.tsx, 0e653cd more mods, IAssetCatalogItem, index.ts, AssetsCatalogPage.tsx, AssetCatalogService.ts] | lang=en
- "models_ibid_ibid": "IBid" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBid.ts:L921 | neighbors=[ApprovalTab.tsx, IBid.ts, index.ts, ApprovalService.ts, aiContext.ts, clarificationHelpers.ts] | lang=en
- "models_ibidcomment": "IBidComment.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidComment.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, IBidCommentDef, IBidStatus.ts, BidPhase, IUser.ts, IPersonRef] | lang=en
- "models_ibidrequest_ibidrequest": "IBidRequest" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidRequest.ts:L25 | neighbors=[mockRequests.ts, useRequests.ts, IBidRequest.ts, index.ts, UnassignedRequestsPage.tsx, RequestService.ts] | lang=en
- "models_ibidstatus_bidphase": "BidPhase" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L1 | neighbors=[phases.config.ts, status.config.ts, IBid.ts, IBidComment.ts, IBidStatus.ts, IBidTask.ts] | lang=en
- "models_iclarificationdb_clarificationbasetype": "ClarificationBaseType" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IClarificationDb.ts:L5 | neighbors=[ClarificationBadges.tsx, ClarificationEntryModal.tsx, IClarificationDb.ts, index.ts, ClarificationKnowledgeService.ts, clarificationLibraryDocument.ts] | lang=en
- "models_iern": "IErn.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IErn.ts:L1 | neighbors=[892c1fc feat: add PeoplePicker componen…, aaa091c Add hooks for KPI targets and l…, ErnDeadlineState, IErn, IErnCreateData, IErnCreateResult] | lang=en
- "models_ilinksrecommendations": "ILinksRecommendations.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ILinksRecommendations.ts:L1 | neighbors=[8e87d94 feat: Add Links and Recommendat…, IBidLink, IBidRecommendation, ILinksRecommendationsData, index.ts, LinksRecommendationsPage.tsx] | lang=en
- "models_isystemconfig_isystemconfig": "ISystemConfig" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ISystemConfig.ts:L122 | neighbors=[accessControl.config.ts, index.ts, ISystemConfig.ts, ClarificationKnowledgeService.ts, clarificationExcelExport.ts, clarificationHelpers.ts] | lang=en
- "pages_notificationspage": "NotificationsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/NotificationsPage.tsx:L1 | neighbors=[3a3d0a5 new changes, fe3728a smartbid2.0, AppLayout.tsx, ICON_MAP, NotificationsPage(), useNotificationStore.ts] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\RCosta1\OneDrive - Oceaneering\Pasta Principal\Coding Projects\smartbid2.0\.graphify\description-instructions\batch-015.json

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
