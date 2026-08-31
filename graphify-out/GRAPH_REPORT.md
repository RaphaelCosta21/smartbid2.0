# Graph Report - smartbid2.0  (2026-08-24)

## Corpus Check
- 331 files · ~492,604 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1837 nodes · 5324 edges · 106 communities (81 shown, 25 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cce6a163`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- models/index.ts
- BidDetailsReportPage.tsx
- useConfigStore
- analyticsHelpers.ts
- BidTrackerPage.tsx
- BidDetailPage.tsx
- TemplatesPage.tsx
- useStatusColors
- pnp-sp.d.ts
- QualificationsTab.tsx
- compilerOptions
- approvalHelpers.ts
- TeamAnalyticsPage.tsx
- SystemConfiguration.tsx
- CreateRequestPage.tsx
- IPersonRef
- BidStatusPhasePanel.tsx
- devDependencies
- .eslintrc.js
- solution
- IScopeItem
- AppLayout.tsx
- dependencies
- BidHoursTable.tsx
- formatDateTime
- makeId
- sharepoint.config.ts
- FavoritesPage.tsx
- costCalculations.ts
- ImportClarificationModal.tsx
- DashboardService.ts
- DocLibraryCatalog.tsx
- RequestService.ts
- IBid
- PreparationMobilizationTab.tsx
- DashboardPage.tsx
- PeriodPerformancePage.tsx
- BottleneckAnalysisPage.tsx
- OverviewTab.tsx
- BidTimeline.tsx
- useEditControl.ts
- FollowUpPage.tsx
- useUIStore
- MembersManagement.tsx
- LinksRecommendationsPage.tsx
- TemplateEditor.tsx
- BomCostsPage.tsx
- IErn
- EquipmentImportModal.tsx
- ErnCreateModal.tsx
- useCurrentUser
- Sidebar.tsx
- SmartBid20WebPart.manifest.json
- BidActivityLog.tsx
- useSpfxContext
- phaseHelpers.ts
- extract_quotation
- ImportSourceModal.tsx
- xlsx.d.ts
- useBidStore.ts
- package.json
- BidEquipmentTable.tsx
- ExportService.ts
- NotificationService
- useConfigPhases.ts
- RecentActivity.tsx
- config.json
- copilot-instructions.md
- SmartBid20WebPart
- IntegratedDivisionTabs.tsx
- deploy-azure-storage.json
- 01-welcome.json
- 03-approver.json
- 04-final.json
- HeatmapGrid.tsx
- serve.json
- 02-status.json
- PricingService
- StatusTrackerService
- write-manifests.json
- ApprovalDecisionPanel.tsx
- ExportOptions.tsx
- mockTemplates.ts
- mystrings.d.ts
- sass.json
- gulpfile.js
- @microsoft/sp-component-base
- @microsoft/sp-office-ui-fabric-core
- @microsoft/sp-property-pane
- jspdf
- jspdf-autotable
- @pnp/core
- @pnp/logging
- @pnp/sp
- react
- tslib
- use-sync-external-store
- xlsx
- zustand
- svg.d.ts

## God Nodes (most connected - your core abstractions)
1. `IBid` - 101 edges
2. `useConfigStore` - 86 edges
3. `makeId()` - 59 edges
4. `useCurrentUser()` - 46 edges
5. `IScopeItem` - 36 edges
6. `useBids()` - 36 edges
7. `IPersonRef` - 34 edges
8. `formatDate()` - 33 edges
9. `PageHeader()` - 33 edges
10. `BomCostsPage()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `ISectorDef` --references--> `Sector`  [EXTRACTED]
  src/webparts/smartBid20/app/config/sectors.config.ts → src/webparts/smartBid20/app/models/IUser.ts
- `Sector` --references--> `SectorApprovalStat`  [EXTRACTED]
  src/webparts/smartBid20/app/models/IUser.ts → src/webparts/smartBid20/app/utils/approvalHelpers.ts
- `FormData` --references--> `IPersonRef`  [EXTRACTED]
  src/webparts/smartBid20/app/pages/CreateRequestPage.tsx → src/webparts/smartBid20/app/models/IUser.ts
- `BidStatusPhasePanelProps` --references--> `IBid`  [EXTRACTED]
  src/webparts/smartBid20/app/components/bid/BidStatusPhasePanel.tsx → src/webparts/smartBid20/app/models/IBid.ts
- `BidTaskChecklistProps` --references--> `IBidTask`  [EXTRACTED]
  src/webparts/smartBid20/app/components/bid/BidTaskChecklist.tsx → src/webparts/smartBid20/app/models/IBid.ts

## Import Cycles
- None detected.

## Communities (106 total, 25 thin omitted)

### Community 0 - "models/index.ts"
Cohesion: 0.06
Nodes (57): AIAnalysisReviewStatus, IAssetsCostSummary, IAssetSubCost, IAvailabilitySplit, IBidAIAnalysis, IBidComment, IBidErnLink, IBidKPIs (+49 more)

### Community 1 - "BidDetailsReportPage.tsx"
Cohesion: 0.18
Nodes (19): ChartTooltip(), ExportBar(), ExportBarProps, getSectorColor(), BidDetailsReportPage(), CHART_SECTIONS, CHART_SECTIONS, OperationalSummaryPage() (+11 more)

### Community 2 - "useConfigStore"
Cohesion: 0.11
Nodes (30): CountdownTimer(), CountdownTimerProps, DataTable(), DataTableColumn, DataTableProps, DivisionBadge(), DivisionBadgeProps, PhaseBadge() (+22 more)

### Community 3 - "analyticsHelpers.ts"
Cohesion: 0.10
Nodes (40): Sparkline(), SparklineProps, GRAN_SEGMENTS, lastDelta(), PerformanceTrendsPage(), addPeriod(), bidHasRole(), buildPeriodSequence() (+32 more)

### Community 4 - "BidTrackerPage.tsx"
Cohesion: 0.17
Nodes (21): BidCard(), BidStatusDropdown(), BidStatusDropdownProps, FilterPanel(), FilterPanelProps, StatusBadge(), StatusBadgeProps, BID_STATUSES (+13 more)

### Community 5 - "BidDetailPage.tsx"
Cohesion: 0.16
Nodes (15): BidExportButton(), BidExportButtonProps, BidDetailPage(), BidTab, DivisionEditWrap(), EMPTY_HOURS_SUMMARY, INavGroup, INavItem (+7 more)

### Community 6 - "TemplatesPage.tsx"
Cohesion: 0.14
Nodes (13): BidTemplateImportProps, TemplateCard(), TemplateCardProps, TemplateImportWizardProps, TemplatePreview(), TemplatePreviewProps, useTemplates(), IBidTemplate (+5 more)

### Community 7 - "useStatusColors"
Cohesion: 0.21
Nodes (10): DashboardActivity(), DashboardActivityProps, FeedRow, Mode, MODE_SEGMENTS, useAccessLevel(), StatusColorLookup, useStatusColors() (+2 more)

### Community 8 - "pnp-sp.d.ts"
Cohesion: 0.05
Nodes (13): @pnp/sp, SPCurrentUser, SPFI, SPFile, SPFiles, SPFolder, SPItem, SPItems (+5 more)

### Community 9 - "QualificationsTab.tsx"
Cohesion: 0.06
Nodes (45): AITab(), AITabProps, ClarificationSuggestionsModal(), ClarificationSuggestionsModalProps, ExportClarificationModal(), ExportClarificationModalProps, ExportMode, ImportClarificationModalProps (+37 more)

### Community 10 - "compilerOptions"
Cohesion: 0.05
Nodes (36): dom, es2015.collection, es2015.core, es2015.iterable, es2015.promise, es2016.array.include, es2017.object, es2017.string (+28 more)

### Community 11 - "approvalHelpers.ts"
Cohesion: 0.19
Nodes (13): BY_LABEL, BY_VALUE, getSectorLabel(), ISectorDef, sectorFromLabel(), SECTORS, ApprovalFilter, computeRoundSectorDurations() (+5 more)

### Community 12 - "TeamAnalyticsPage.tsx"
Cohesion: 0.09
Nodes (32): ChartTooltipEntry, ChartTooltipProps, EmptyState(), EmptyStateProps, GlassCard(), GlassCardProps, KPICard(), KPICardProps (+24 more)

### Community 13 - "SystemConfiguration.tsx"
Cohesion: 0.06
Nodes (36): ACCESS_AREAS, ALL_NAV_ITEMS, INavGroup, INavItem, KPI_META, NAV_GROUPS, NOTIFICATION_LABELS, PERM_CYCLE (+28 more)

### Community 14 - "CreateRequestPage.tsx"
Cohesion: 0.10
Nodes (20): ConfirmDialog(), ConfirmDialogProps, FileUpload(), FileUploadProps, PersonaCard(), PersonaCardProps, RichTextEditor(), RichTextEditorProps (+12 more)

### Community 15 - "IPersonRef"
Cohesion: 0.09
Nodes (23): ApprovalBadgeProps, ApprovalMatrixProps, ApprovalRequestCardProps, ApprovalTimelineProps, ApprovalTab(), ApprovalTabProps, SECTOR_CONFIGS, STATUS_DISPLAY (+15 more)

### Community 16 - "BidStatusPhasePanel.tsx"
Cohesion: 0.22
Nodes (13): BidStatusPhasePanel(), BidStatusPhasePanelProps, BidTaskChecklist(), BidTaskChecklistProps, canStartRevision(), getActiveRevision(), getCurrentRevisionLetter(), getRevisionLetter() (+5 more)

### Community 17 - "devDependencies"
Cohesion: 0.07
Nodes (29): ajv, eslint, eslint-plugin-react-hooks, gulp, @microsoft/eslint-config-spfx, @microsoft/eslint-plugin-spfx, @microsoft/rush-stack-compiler-4.7, @microsoft/sp-build-web (+21 more)

### Community 18 - ".eslintrc.js"
Cohesion: 0.07
Nodes (27): RATIONALE: The "module" keyword is deprecated except when describing legacy…, RATIONALE: This rule warns if setters are defined without getters, which is…, RATIONALE: In TypeScript, if you write x["y"] instead of x.y, it disables type…, RATIONALE: Catches code that is likely to be incorrect, RATIONALE: If you have more than 2,000 lines in a single source file, it's…, RATIONALE: Deprecated language feature., RATIONALE: Eval is a security concern and a performance concern., RATIONALE: System types are global and should not be tampered with in a… (+19 more)

### Community 19 - "solution"
Cohesion: 0.07
Nodes (26): mpnId, name, privacyUrl, termsOfUseUrl, websiteUrl, default, categories, longDescription (+18 more)

### Community 20 - "IScopeItem"
Cohesion: 0.17
Nodes (23): applyContingency(), AssetsBreakdownTab(), AssetsBreakdownTabProps, blankAsset(), blankSubCost(), blankSubItemCost(), blankTransitSubCost(), calcContingencyPct() (+15 more)

### Community 21 - "AppLayout.tsx"
Cohesion: 0.09
Nodes (24): PageHeader(), PageHeaderProps, Toast, ToastContainer(), ToastContainerProps, GuestModeBanner(), PatchNote, PatchNotes() (+16 more)

### Community 22 - "dependencies"
Cohesion: 0.08
Nodes (25): date-fns, @fluentui/react, lucide-react, @microsoft/sp-core-library, @microsoft/sp-lodash-subset, @microsoft/sp-webpart-base, dependencies, date-fns (+17 more)

### Community 23 - "BidHoursTable.tsx"
Cohesion: 0.14
Nodes (19): BidHoursTable(), BidHoursTableProps, blankHoursItem(), HoursRow(), HoursRowProps, SectionKey, EditItemModalState, EngineeringHoursSection() (+11 more)

### Community 24 - "formatDateTime"
Cohesion: 0.21
Nodes (11): BidComments(), BidCommentsProps, DocumentsTab(), DocumentsTabProps, EmptySection(), NotesTab(), NotesTabProps, AnalysisNotesCard() (+3 more)

### Community 25 - "makeId"
Cohesion: 0.17
Nodes (17): blankItem(), blankSection(), CertificationsBreakdownTab(), CertificationsBreakdownTabProps, SECTION_COLORS, blankItem(), LogisticsBreakdownTab(), LogisticsBreakdownTabProps (+9 more)

### Community 26 - "sharepoint.config.ts"
Cohesion: 0.23
Nodes (6): SHAREPOINT_CONFIG, NOTE: This list uses real SharePoint columns (not a JSON blob)., IPriceEntry, SPService, ChangeType, IStatusTrackerEntry

### Community 27 - "FavoritesPage.tsx"
Cohesion: 0.05
Nodes (55): AdvancedCatalogSearch(), AdvancedCatalogSearchProps, getPhotoUrl(), TabKey, PartNumberAutocomplete(), PartNumberAutocompleteProps, SectionDef, SECTIONS (+47 more)

### Community 28 - "costCalculations.ts"
Cohesion: 0.26
Nodes (21): BidCostSummary(), BidCostSummaryProps, CapexOpexVerticalChart(), applyContingencySplit(), applyContingencyToCost(), buildCostSummary(), calculateAssetsByResourceType(), calculateAssetsTotals() (+13 more)

### Community 29 - "ImportClarificationModal.tsx"
Cohesion: 0.20
Nodes (9): ImportClarificationModal(), toClarificationItem(), useDebounce(), ClarificationBaseType, IClarificationDbItem, ClarificationsDbPage(), emptyItem(), toDateInput() (+1 more)

### Community 30 - "DashboardService.ts"
Cohesion: 0.16
Nodes (11): DivisionWorkloadProps, MonthlyVolumeChartProps, DEFAULT_KPI_TARGETS, IKPIDef, KPI_DEFINITIONS, IDashboardData, IDashboardKPI, IDivisionWorkload (+3 more)

### Community 31 - "DocLibraryCatalog.tsx"
Cohesion: 0.18
Nodes (9): DocLibraryCatalog(), DocLibraryCatalogProps, EMPTY_META(), stripExt(), ViewMode, DocCatalogType, IDocLibraryItem, IDocLibraryMetadata (+1 more)

### Community 32 - "RequestService.ts"
Cohesion: 0.23
Nodes (11): mockRequests, useRequests(), IBidRequest, IRequestAttachment, IRequestPhase, BidPriority, BidType, Division (+3 more)

### Community 33 - "IBid"
Cohesion: 0.15
Nodes (11): OverviewTabProps, EngHoursRankingProps, ErnDashboardSectionProps, IBid, getAvatarColor(), getInitials(), UnassignedRequestsPage(), ViewMode (+3 more)

### Community 34 - "PreparationMobilizationTab.tsx"
Cohesion: 0.23
Nodes (13): blankConsumable(), blankMob(), blankRTS(), MOB_TYPES, PreparationMobilizationTab(), buildOrdered(), moveItemInList(), PreparationMobilizationTabProps (+5 more)

### Community 35 - "DashboardPage.tsx"
Cohesion: 0.11
Nodes (9): SkeletonLoader(), SkeletonLoaderProps, ApprovalsPending(), ApprovalsPendingProps, EngHoursRanking(), ErnDashboardSection(), UpcomingDeadlines(), UpcomingDeadlinesProps (+1 more)

### Community 36 - "PeriodPerformancePage.tsx"
Cohesion: 0.13
Nodes (28): categoricalColor(), CHART_SECTIONS, PeriodPerformancePage(), BidTableRow, bidTableRows(), byCommercialRequester(), ClientPerformance, clientPerformanceByDivision() (+20 more)

### Community 37 - "BottleneckAnalysisPage.tsx"
Cohesion: 0.15
Nodes (19): ProgressBar(), ProgressBarProps, AIInsightsPanel(), AIInsightsPanelProps, BottleneckAnalysisPage(), DIM_SEGMENTS, Dimension, Scope (+11 more)

### Community 38 - "OverviewTab.tsx"
Cohesion: 0.16
Nodes (14): ErnDetailsModal(), ErnDetailsModalProps, stateColor, APPROVAL_STATUS_DISPLAY, ExchangeRatesCard(), OverviewTab(), hasActiveRevision(), canManageErn() (+6 more)

### Community 39 - "BidTimeline.tsx"
Cohesion: 0.18
Nodes (12): BidTimeline(), BidTimelineProps, getPhaseTotalHours(), useLiveElapsed(), PriorityBadgeProps, PRIORITY_COLORS, formatDurationFromHours(), formatLiveElapsed() (+4 more)

### Community 40 - "useEditControl.ts"
Cohesion: 0.24
Nodes (7): EditableTabContent(), EditLockBanner(), EditToolbar(), EditControlState, useEditControl(), IEditLock, EditControlService

### Community 41 - "FollowUpPage.tsx"
Cohesion: 0.20
Nodes (14): AnalyticsFilterBar(), AnalyticsFilterBarProps, PRESETS, MultiSelectDropdown(), MultiSelectDropdownProps, MultiSelectOption, AnalyticsFilters, DatePreset (+6 more)

### Community 42 - "useUIStore"
Cohesion: 0.18
Nodes (12): Footer(), oiiBlueLogo, oiiWhiteLogo, smartBidIcon, smartBidIconDark, Header(), Breakpoints, useResponsive() (+4 more)

### Community 43 - "MembersManagement.tsx"
Cohesion: 0.14
Nodes (19): SectorConfig, BID_ROLE_META, BL_COLORS, BUSINESS_LINES, getAvatarColor(), getInitials(), IBidRoleMeta, IPeopleResult (+11 more)

### Community 44 - "LinksRecommendationsPage.tsx"
Cohesion: 0.27
Nodes (8): IBidLink, IBidRecommendation, ILinksRecommendationsData, LinkModal, LinksRecommendationsPage(), RecModal, EMPTY_DATA, LinksRecommendationsService

### Community 45 - "TemplateEditor.tsx"
Cohesion: 0.16
Nodes (11): TemplateEditor(), TemplateEditorProps, IBidAttachment, AttachmentService, ACQUISITION_TYPES, BID_SIZE_COLORS, BID_SIZES, BID_TYPES (+3 more)

### Community 46 - "BomCostsPage.tsx"
Cohesion: 0.06
Nodes (56): AddQuotationModal(), AddQuotationModalProps, blankLineItem(), genId(), ILineItem, CostSearchModal(), isAiConfigured(), IActivityLog (+48 more)

### Community 47 - "IErn"
Cohesion: 0.22
Nodes (9): useErn(), UseErnResult, ErnDeadlineState, IErn, IErnCreateData, IErnCreateResult, ErnService, ErnState (+1 more)

### Community 48 - "EquipmentImportModal.tsx"
Cohesion: 0.20
Nodes (12): EquipmentImportModal(), EquipmentImportModalProps, IImportSubItem, TabDef, TabId, TABS, IAssetCatalogItem, AssetsCatalogPage() (+4 more)

### Community 49 - "ErnCreateModal.tsx"
Cohesion: 0.23
Nodes (12): ErnCreateModal(), ErnCreateModalProps, personToPicked(), toInputDate(), ernNum(), ErnSearchModal(), ErnSearchModalProps, ERN_REVISION_REASONS (+4 more)

### Community 50 - "useCurrentUser"
Cohesion: 0.12
Nodes (22): AppLayout(), RequireEngineering(), CommandPalette(), ICommandItem, Sidebar(), useCurrentUser(), useIsGuest(), IUser (+14 more)

### Community 51 - "Sidebar.tsx"
Cohesion: 0.17
Nodes (11): oiiWhiteLogo, smartBidIconWhite, smartBidLogoCompact, SidebarItem(), SidebarItemProps, SidebarSubmenu(), SidebarSubmenuProps, INavItem (+3 more)

### Community 52 - "SmartBid20WebPart.manifest.json"
Cohesion: 0.13
Nodes (14): SharePointFullPage, SharePointWebPart, TeamsPersonalApp, TeamsTab, alias, componentType, id, manifestVersion (+6 more)

### Community 53 - "BidActivityLog.tsx"
Cohesion: 0.31
Nodes (7): BidActivityLog(), BidActivityLogProps, getActivityColor(), Timeline(), TimelineItem, TimelineProps, IActivityLogEntry

### Community 54 - "useSpfxContext"
Cohesion: 0.22
Nodes (9): IGraphResult, IPickedPerson, PeoplePicker(), PeoplePickerProps, SpfxContext, useSpfxContext(), ISmartBid20Props, SmartBid20 (+1 more)

### Community 55 - "phaseHelpers.ts"
Cohesion: 0.19
Nodes (11): getAllTasks(), getPhaseConfig(), getPhaseLabel(), getPhaseTasks(), IPhaseTask, PHASE_CONFIGS, PHASES_CONFIG, getOverallProgress() (+3 more)

### Community 56 - "extract_quotation"
Cohesion: 0.31
Nodes (12): ensure_text(), extract_quotation(), extract_text_or_images(), generate_scope(), _now_iso(), SmartBid AI backend — Azure Functions (Python v2 programming model). Two HTTP…, Prefer extracted text (cheap). For scanned/image PDFs with no text, return page…, Guarantee plain text. If we only have page images (scanned document), use… (+4 more)

### Community 57 - "ImportSourceModal.tsx"
Cohesion: 0.24
Nodes (12): IImportSource, ImportSourceList(), ImportSourceListProps, ImportMode, ImportSourceModal(), ImportSourceModalProps, IScopeImportResult, ScopeImportPreview() (+4 more)

### Community 58 - "xlsx.d.ts"
Cohesion: 0.17
Nodes (4): CellObject, WorkBook, WorkSheet, xlsx

### Community 59 - "useBidStore.ts"
Cohesion: 0.21
Nodes (10): BidCardProps, ApprovalSummary, useApprovals(), IQuickNote, BidState, DEFAULT_FILTERS, useBidStore, ViewMode (+2 more)

### Community 60 - "package.json"
Cohesion: 0.18
Nodes (10): engines, node, main, name, private, scripts, build, clean (+2 more)

### Community 61 - "BidEquipmentTable.tsx"
Cohesion: 0.67
Nodes (3): BidEquipmentTable(), BidEquipmentTableProps, IEquipmentItem

### Community 62 - "ExportService.ts"
Cohesion: 0.36
Nodes (6): useExport(), IExportColumn, IExportOptions, IExportResult, IExportTab, ExportService

### Community 63 - "NotificationService"
Cohesion: 0.25
Nodes (4): NotificationService, ToastCallback, ToastOptions, ToastType

### Community 64 - "useConfigPhases.ts"
Cohesion: 0.38
Nodes (5): BidPhaseProgress(), BidPhaseProgressProps, BID_PHASES, IConfigPhase, useConfigPhases()

### Community 65 - "RecentActivity.tsx"
Cohesion: 0.19
Nodes (8): RecentActivityProps, TYPE_COLORS, MOCK_NOTIFICATIONS, INotification, ICON_MAP, NotificationsPage(), NotificationState, useNotificationStore

### Community 66 - "config.json"
Cohesion: 0.22
Nodes (8): bundles, smart-bid-20-web-part, externals, localizedResources, SmartBid20WebPartStrings, $schema, components, version

### Community 70 - "IntegratedDivisionTabs.tsx"
Cohesion: 0.32
Nodes (7): IntegratedDivision, IntegratedDivisionTabs(), IntegratedDivisionTabsProps, OPG_SERVICE_LINES, resolveTabs(), tabBarStyle, tabStyle()

### Community 72 - "deploy-azure-storage.json"
Cohesion: 0.33
Nodes (5): accessKey, account, container, $schema, workingDir

### Community 73 - "01-welcome.json"
Cohesion: 0.33
Nodes (5): actions, body, $schema, type, version

### Community 74 - "03-approver.json"
Cohesion: 0.33
Nodes (5): actions, body, $schema, type, version

### Community 75 - "04-final.json"
Cohesion: 0.33
Nodes (5): actions, body, $schema, type, version

### Community 77 - "HeatmapGrid.tsx"
Cohesion: 0.47
Nodes (5): heatColor(), HeatmapColumn, HeatmapGrid(), HeatmapGridProps, hexToRgb()

### Community 78 - "serve.json"
Cohesion: 0.40
Nodes (4): https, initialPage, port, $schema

### Community 79 - "02-status.json"
Cohesion: 0.40
Nodes (4): body, $schema, type, version

## Knowledge Gaps
- **403 isolated node(s):** `graphify`, `IDivisionCost`, `IDivisionHoursTotals`, `EmptyStateProps`, `ExportBarProps` (+398 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `IBid` connect `IBid` to `models/index.ts`, `BidDetailsReportPage.tsx`, `useConfigStore`, `analyticsHelpers.ts`, `BidTrackerPage.tsx`, `BidDetailPage.tsx`, `useStatusColors`, `QualificationsTab.tsx`, `approvalHelpers.ts`, `TeamAnalyticsPage.tsx`, `IPersonRef`, `BidStatusPhasePanel.tsx`, `formatDateTime`, `sharepoint.config.ts`, `FavoritesPage.tsx`, `costCalculations.ts`, `DashboardService.ts`, `RequestService.ts`, `DashboardPage.tsx`, `PeriodPerformancePage.tsx`, `OverviewTab.tsx`, `BidTimeline.tsx`, `FollowUpPage.tsx`, `MembersManagement.tsx`, `ErnCreateModal.tsx`, `phaseHelpers.ts`, `ImportSourceModal.tsx`, `useBidStore.ts`, `ExportService.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `useConfigStore` connect `useConfigStore` to `BidDetailsReportPage.tsx`, `analyticsHelpers.ts`, `BidTrackerPage.tsx`, `BidDetailPage.tsx`, `TemplatesPage.tsx`, `useStatusColors`, `QualificationsTab.tsx`, `TeamAnalyticsPage.tsx`, `SystemConfiguration.tsx`, `CreateRequestPage.tsx`, `BidStatusPhasePanel.tsx`, `IScopeItem`, `AppLayout.tsx`, `BidHoursTable.tsx`, `makeId`, `FavoritesPage.tsx`, `IBid`, `DashboardPage.tsx`, `PeriodPerformancePage.tsx`, `BottleneckAnalysisPage.tsx`, `OverviewTab.tsx`, `BidTimeline.tsx`, `FollowUpPage.tsx`, `TemplateEditor.tsx`, `BomCostsPage.tsx`, `ErnCreateModal.tsx`, `useCurrentUser`, `ImportSourceModal.tsx`, `useConfigPhases.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `makeId()` connect `makeId` to `RequestService.ts`, `PreparationMobilizationTab.tsx`, `BidDetailPage.tsx`, `TemplatesPage.tsx`, `QualificationsTab.tsx`, `LinksRecommendationsPage.tsx`, `TemplateEditor.tsx`, `SystemConfiguration.tsx`, `IScopeItem`, `AppLayout.tsx`, `BidHoursTable.tsx`, `formatDateTime`, `ImportSourceModal.tsx`, `FavoritesPage.tsx`, `ImportClarificationModal.tsx`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `graphify`, `IDivisionCost`, `IDivisionHoursTotals` to the rest of the system?**
  _403 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `models/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06010230179028133 - nodes in this community are weakly interconnected._
- **Should `useConfigStore` be split into smaller, more focused modules?**
  _Cohesion score 0.11212121212121212 - nodes in this community are weakly interconnected._
- **Should `analyticsHelpers.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._