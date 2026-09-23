# Node Description Batch 9 of 43

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

- "models_ibidrequest_ibidrequest": "IBidRequest" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidRequest.ts:L24 | neighbors=[mockRequests.ts, useRequests.ts, IBidRequest.ts, index.ts, UnassignedRequestsPage.tsx, RequestService.ts] | lang=en
- "models_ibidstatus_bidphase": "BidPhase" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IBidStatus.ts:L1 | neighbors=[phases.config.ts, status.config.ts, IBid.ts, IBidComment.ts, IBidStatus.ts, IBidTask.ts] | lang=en
- "models_ilinksrecommendations": "ILinksRecommendations.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/ILinksRecommendations.ts:L1 | neighbors=[8e87d94 feat: Add Links and Recommendat…, IBidLink, IBidRecommendation, ILinksRecommendationsData, index.ts, LinksRecommendationsPage.tsx] | lang=en
- "pages_notificationspage": "NotificationsPage.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/pages/NotificationsPage.tsx:L1 | neighbors=[3a3d0a5 new changes, fe3728a smartbid2.0, AppLayout.tsx, ICON_MAP, NotificationsPage(), useNotificationStore.ts] | lang=en
- "services_approvalservice_approvalservice": "ApprovalService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/ApprovalService.ts:L16 | neighbors=[ApprovalTab.tsx, ApprovalService.ts, ._approvalsList(), .ensureApprovalColumns(), .processDecision(), .requestApproval()] | lang=en
- "services_dashboardservice_dashboardservice": "DashboardService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/DashboardService.ts:L15 | neighbors=[DashboardPage.tsx, DashboardService.ts, .buildDashboardData(), .calculateDivisionWorkloads(), .calculateKPIs(), .calculateMonthlyVolumes()] | lang=en
- "services_editcontrolservice": "EditControlService.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/services/EditControlService.ts:L1 | neighbors=[c58a13c new-implementations, useEditControl.ts, BidDetailPage.tsx, index.ts, EditControlService, SPService.ts] | lang=en
- "services_favoritesservice_favoritesservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L27 | neighbors=[FavoritesService, .addBidFavorite(), .addEquipment(), .removeBidFavorite(), .removeEquipment(), .updateEquipment()] | lang=en
- "services_favoritesservice_favoritesservice_save": ".save()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/FavoritesService.ts:L48 | neighbors=[FavoritesService, .addBidFavorite(), .addEquipment(), .removeBidFavorite(), .removeEquipment(), .updateEquipment()] | lang=en
- "services_linksrecommendationsservice_linksrecommendationsservice_getall": ".getAll()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L25 | neighbors=[LinksRecommendationsService, .addLink(), .addRecommendation(), .removeLink(), .removeRecommendation(), .updateLink()] | lang=en
- "services_linksrecommendationsservice_linksrecommendationsservice_save": ".save()" | kind=code-symbol | source=src/webparts/smartBid20/app/services/LinksRecommendationsService.ts:L46 | neighbors=[LinksRecommendationsService, .addLink(), .addRecommendation(), .removeLink(), .removeRecommendation(), .updateLink()] | lang=en
- "services_notificationservice_notificationservice": "NotificationService" | kind=code-symbol | source=src/webparts/smartBid20/app/services/NotificationService.ts:L16 | neighbors=[NotificationService.ts, ._emit(), .error(), .info(), .subscribe(), .success()] | lang=en
- "stores_usequotationstore_usequotationstore": "useQuotationStore" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useQuotationStore.ts:L38 | neighbors=[AddQuotationModal.tsx, AssetsBreakdownTab.tsx, CostSearchModal.tsx, EquipmentImportModal.tsx, BomCostsPage.tsx, QuotationsPage.tsx] | lang=en
- "stores_userequeststore": "useRequestStore.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/stores/useRequestStore.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, useRequests.ts, CreateRequestPage.tsx, IBidRequest.ts, IBidRequest, RequestState] | lang=en
- "template_templateimportwizard": "TemplateImportWizard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/template/TemplateImportWizard.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, c4e04de lots-implementation, IBidTemplate.ts, IBidTemplate, TemplateImportWizard()] | lang=en
- "typings_xlsx_d": "xlsx.d.ts" | kind=code-symbol | source=src/typings/xlsx.d.ts:L1 | neighbors=[1665b01 more features, 4c2e63a update smartbid 2.0, e2285cf cont-implementing, CellObject, WorkBook, WorkSheet] | lang=en
- "utils_activityloghelpers": "activityLogHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/activityLogHelpers.ts:L1 | neighbors=[DocumentsTab.tsx, OverviewTab.tsx, c58a13c new-implementations, index.ts, createActivityLogEntry(), idGenerator.ts] | lang=en
- "utils_bomparser_parsebomcsv": "parseBomCSV()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/bomParser.ts:L191 | neighbors=[BomCostsPage.tsx, bomParser.ts, assignParentIds(), cleanCsvValue(), emptyItem(), findColumns()] | lang=en
- "utils_currencyhelpers": "currencyHelpers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/currencyHelpers.ts:L1 | neighbors=[CertificationsBreakdownTab.tsx, LogisticsBreakdownTab.tsx, PreparationMobilizationTab.tsx, c58a13c new-implementations, useConfigStore.ts, useConfigStore] | lang=en
- "utils_statushelpers_isterminalstatus": "isTerminalStatus()" | kind=code-symbol | source=src/webparts/smartBid20/app/utils/statusHelpers.ts:L47 | neighbors=[BidTimeline.tsx, OverviewTab.tsx, RevisionsTab.tsx, ImportSourceModal.tsx, BidDetailPage.tsx, statusHelpers.ts] | lang=en
- "approval_approvalbadge": "ApprovalBadge.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalBadge.tsx:L1 | neighbors=[ApprovalBadge(), ApprovalBadgeProps, index.ts, 0546310 Add dashboard components and st…, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0] | lang=en
- "approval_approvalrequestcard": "ApprovalRequestCard.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/approval/ApprovalRequestCard.tsx:L1 | neighbors=[ApprovalRequestCard(), ApprovalRequestCardProps, IBidApproval.ts, IBidApprovalState, 3a3d0a5 new changes, 4c2e63a update smartbid 2.0] | lang=en
- "bid_clarificationsuggestionsmodal": "ClarificationSuggestionsModal.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/ClarificationSuggestionsModal.tsx:L1 | neighbors=[ClarificationSuggestionsModal(), ClarificationSuggestionsModalProps, index.ts, QualificationsTab.tsx, 4b576db AI-Integration, BidDetailPage.tsx] | lang=en
- "bid_emptysection": "EmptySection.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/EmptySection.tsx:L1 | neighbors=[DocumentsTab.tsx, EmptySection(), NotesTab.tsx, OverviewTab.tsx, QualificationsTab.tsx, c58a13c new-implementations] | lang=en
- "bid_revisionstab_revisionstab": "RevisionsTab()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx:L61 | neighbors=[RevisionsTab.tsx, canStartRevision(), getActiveRevision(), getCurrentRevisionLetter(), getRevisionLetter(), BidDetailPage.tsx] | lang=en
- "charts_sparkline_sparkline": "Sparkline()" | kind=code-symbol | source=src/webparts/smartBid20/app/components/charts/Sparkline.tsx:L15 | neighbors=[Sparkline.tsx, AnalyticsPage.tsx, FollowUpPage.tsx, PerformanceTrendsPage.tsx, PeriodPerformancePage.tsx, ReportsPage.tsx] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@1a408964e22f1b844317d2fc1998c984b68bf2da": "1a40896 feat: add SmartBid 2.0 Executive Summary Slides generator script" | kind=Commit | source=git | neighbors=[ApprovalTab.tsx, main, 0546310 Add dashboard components and st…, sharepoint.config.ts, ApprovalService.ts, c271ce8 Refactor code structure for imp…] | lang=pt
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@1c19dcd6cdc642389f57af4a30dc6ca485449cd0": "1c19dcd Update API diagnostics and AI configuration; enhance AiAuthService logg…" | kind=Commit | source=git | neighbors=[main, 961eb93 feat: Update AI integration and…, ai.config.ts, AiAuthService.ts, SystemConfiguration.tsx, 9e27edd feat: Update AI integration and…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@66dbcee4d7bd13a06d483a5ba32ae0855cedd94c": "66dbcee feat: Implement contingency calculations and UI in AssetsBreakdownTab" | kind=Commit | source=git | neighbors=[AssetsBreakdownTab.tsx, ScopeOfSupplyTab.tsx, main, f3095f2 feat: add ApprovalTab component…, HoursImportPreview.tsx, bee3eb5 feat: Enhance bid model with av…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@7ccad33a2eb80a023ab670cc42c05281ee48b185": "7ccad33 Refactor code structure and remove redundant code blocks for improved r…" | kind=Commit | source=git | neighbors=[main, c271ce8 Refactor code structure for imp…, IBid.ts, index.ts, BidDetailPage.tsx, 8e87d94 feat: Add Links and Recommendat…] | lang=en
- "commit:repo:github.com/RaphaelCosta21/smartbid2.0@fb4fa770760c34f03f37e99a3ccbc1894f5f89bc": "fb4fa77 Refactor code structure for improved readability and maintainability" | kind=Commit | source=git | neighbors=[cce6a16 Refactor code structure for imp…, main, 401be0c Add EntraTokenTest component fo…, ai.config.ts, function_app.py, AIAnalysisService.ts] | lang=en
- "common_skeletonloader": "SkeletonLoader.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/common/SkeletonLoader.tsx:L1 | neighbors=[3a3d0a5 new changes, 4c2e63a update smartbid 2.0, SkeletonLoader(), SkeletonLoaderProps, DashboardPage.tsx, TeamAnalyticsPage.tsx] | lang=en
- "config_defaultfavoritegroups": "defaultFavoriteGroups.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/config/defaultFavoriteGroups.ts:L1 | neighbors=[e2285cf cont-implementing, getDefaultFavoriteGroups(), makeGroup(), nextId(), index.ts, defaultSystemConfig.ts] | lang=en
- "config_spfxcontext_usespfxcontext": "useSpfxContext()" | kind=code-symbol | source=src/webparts/smartBid20/app/config/SpfxContext.ts:L9 | neighbors=[OverviewTab.tsx, PeoplePicker.tsx, SpfxContext.ts, Header.tsx, CreateRequestPage.tsx, MembersManagement.tsx] | lang=en
- "function_app_function_app_document_text": "_document_text()" | kind=code-symbol | source=azure-ai-backend/function-app/function_app.py:L242 | neighbors=[function_app.py, ensure_text(), extract_text_or_images(), extract_quotation(), generate_scope(), Return (text, warnings), capping the le…] | lang=en
- "hooks_userequests": "useRequests.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useRequests.ts:L1 | neighbors=[4c2e63a update smartbid 2.0, useRequests(), IBidRequest.ts, IBidRequest, useRequestStore.ts, useRequestStore] | lang=en
- "hooks_useteammembers": "useTeamMembers.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/hooks/useTeamMembers.ts:L1 | neighbors=[c271ce8 Refactor code structure for imp…, useTeamMembers(), index.ts, MembersService.ts, MembersService, TeamAnalyticsPage.tsx] | lang=en
- "layout_sidebaritem": "SidebarItem.tsx" | kind=code-symbol | source=src/webparts/smartBid20/app/components/layout/SidebarItem.tsx:L1 | neighbors=[3a3d0a5 new changes, 3c5c37b more-mods, 4c2e63a update smartbid 2.0, Sidebar.tsx, SidebarItem(), SidebarItemProps] | lang=en
- "models_iactivitylog": "IActivityLog.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IActivityLog.ts:L1 | neighbors=[AddQuotationModal.tsx, 4c2e63a update smartbid 2.0, IActivityLog, IActivityLogEntry, index.ts, ActivityLogService.ts] | lang=en
- "models_iassetcatalog": "IAssetCatalog.ts" | kind=code-symbol | source=src/webparts/smartBid20/app/models/IAssetCatalog.ts:L1 | neighbors=[EquipmentImportModal.tsx, 0e653cd more mods, IAssetCatalogItem, index.ts, AssetsCatalogPage.tsx, AssetCatalogService.ts] | lang=en

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
