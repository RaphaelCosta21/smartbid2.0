# Graph Report - smartbid2.0  (2026-08-24)

## Corpus Check
- 415 files · ~492,604 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1839 nodes · 5323 edges · 110 communities (85 shown, 25 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Data Models (Interfaces)
- PDF Export & Report Pages
- Bids Hook & Common UI
- Analytics & Charts
- Config Store & Bid Tracker
- BID Detail Page & Tabs
- BID Templates
- Team Analytics
- SharePoint Typings (PnP)
- AI Analysis Service
- TypeScript Config
- Approvals & Sectors
- Dashboard UI (Cards/Charts)
- System Configuration
- Create Request
- Approval Flow
- BID Status & Phases
- Dev Dependencies
- ESLint Rules & Rationale
- Package Solution Config
- Assets Breakdown & Costs
- Access Control & Auth
- Runtime Dependencies
- Scope & Engineering Hours
- Scope of Supply & Documents
- Certifications & Logistics Breakdown
- SharePoint Services Core
- Query Catalog & Exchange Rates
- Cost Calculations
- Clarifications DB
- BID Core Model & Dashboard
- Document Library Catalog
- Bid Store & Requests
- Favorites & Catalog Search
- Preparation & Mobilization
- AI Quotation Mapping & Activity Log
- Report Helpers
- Bottleneck Analysis
- Favorites Service
- BOM Costs
- BID Detail Tabs (Overview/Notes)
- Analytics Filters & Follow-up
- Layout & UI Store
- Members Management
- Links Recommendations
- Query Consulting
- Quotations
- ERN Service & Store
- Equipment & Assets Catalog
- ERN Integration
- Current User Hook
- Sidebar Navigation
- Web Part Manifest
- Bid Activity Log
- SPFx Context & People Picker
- Validators
- Azure AI Backend (Functions)
- Web Part Root Component
- XLSX Typings
- Part Number Autocomplete
- Package Metadata
- Bid Equipment Table
- Notification Service
- Approval Models
- Recent Activity & Notifications
- Web Part Bundle Config
- BOM Cost Analysis Service
- Web Part Init
- BOM Parser
- Integrated Division Tabs
- Azure Storage Deploy Config
- Power Automate Card: Welcome
- Power Automate Card: Approver
- Power Automate Card: Final
- Heatmap Chart
- Serve Config
- Power Automate Card: Status
- Pricing Service
- Status Tracker Service
- Write Manifests Config
- Approval Decision Panel
- Report Export Options
- Mock Templates (legacy)
- Web Part Localized Strings
- Sass Config
- Gulp Build
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
- SVG Typings

## God Nodes (most connected - your core abstractions)
1. `IBid` - 101 edges
2. `useConfigStore` - 86 edges
3. `makeId()` - 59 edges
4. `useCurrentUser()` - 46 edges
5. `IScopeItem` - 36 edges
6. `useBids()` - 36 edges
7. `IPersonRef` - 34 edges
8. `PageHeader()` - 33 edges
9. `formatDate()` - 33 edges
10. `BomCostsPage()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `ISectorMeta` --references--> `Sector`  [EXTRACTED]
  src/webparts/smartBid20/app/components/settings/MembersManagement.tsx → src/webparts/smartBid20/app/models/IUser.ts
- `FormData` --references--> `IPersonRef`  [EXTRACTED]
  src/webparts/smartBid20/app/pages/CreateRequestPage.tsx → src/webparts/smartBid20/app/models/IUser.ts
- `BidStatusPhasePanelProps` --references--> `IBid`  [EXTRACTED]
  src/webparts/smartBid20/app/components/bid/BidStatusPhasePanel.tsx → src/webparts/smartBid20/app/models/IBid.ts
- `BidTimelineProps` --references--> `IBid`  [EXTRACTED]
  src/webparts/smartBid20/app/components/bid/BidTimeline.tsx → src/webparts/smartBid20/app/models/IBid.ts
- `RevisionsTabProps` --references--> `IBid`  [EXTRACTED]
  src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx → src/webparts/smartBid20/app/models/IBid.ts

## Import Cycles
- None detected.

## Communities (110 total, 25 thin omitted)

### Community 0 - "Data Models (Interfaces)"
Cohesion: 0.07
Nodes (43): AIAnalysisReviewStatus, IAssetsCostSummary, IBidAIAnalysis, IBidKPIs, IBidMetadata, IBidResult, ICostSummary, IDivisionCost (+35 more)

### Community 1 - "PDF Export & Report Pages"
Cohesion: 0.13
Nodes (30): ApprovalTab(), EmptyState(), EmptyStateProps, AnalyticsFilterBar(), ExportBar(), ExportBarProps, getSectorColor(), BidDetailsReportPage() (+22 more)

### Community 2 - "Bids Hook & Common UI"
Cohesion: 0.12
Nodes (19): CountdownTimer(), CountdownTimerProps, DataTable(), DataTableColumn, DataTableProps, DivisionBadge(), DivisionBadgeProps, PageHeader() (+11 more)

### Community 3 - "Analytics & Charts"
Cohesion: 0.09
Nodes (47): Sparkline(), SparklineProps, KPICard(), KPICardProps, DashboardKPIRow(), DashboardKPIRowProps, ROUTES, useChartTheme() (+39 more)

### Community 4 - "Config Store & Bid Tracker"
Cohesion: 0.10
Nodes (36): BidCard(), FilterPanel(), FilterPanelProps, StatusBadge(), StatusBadgeProps, DashboardActivity(), EngHoursRanking(), Scope (+28 more)

### Community 5 - "BID Detail Page & Tabs"
Cohesion: 0.10
Nodes (28): AITab(), BidExportButton(), BidExportButtonProps, ClarificationSuggestionsModal(), ClarificationSuggestionsModalProps, QualificationsTab(), useAccessLevel(), ApprovalSummary (+20 more)

### Community 6 - "BID Templates"
Cohesion: 0.09
Nodes (24): BidTemplateImportProps, ImportSourceModal(), PriorityBadgeProps, TemplateCard(), TemplateCardProps, TemplateEditor(), TemplateEditorProps, TemplateImportWizardProps (+16 more)

### Community 7 - "Team Analytics"
Cohesion: 0.11
Nodes (18): ProgressBar(), ProgressBarProps, SkeletonLoader(), SkeletonLoaderProps, FeedRow, Mode, MODE_SEGMENTS, SegmentedControl() (+10 more)

### Community 8 - "SharePoint Typings (PnP)"
Cohesion: 0.05
Nodes (13): @pnp/sp, SPCurrentUser, SPFI, SPFile, SPFiles, SPFolder, SPItem, SPItems (+5 more)

### Community 9 - "AI Analysis Service"
Cohesion: 0.12
Nodes (18): AI_CONFIG, buildAiUrl(), IAiConfig, BID_CHAT_PROMPT_VERSION, buildQuotationExtractionPrompt(), buildScopeOfSupplyPrompt(), CLARIFICATION_SUGGESTION_PROMPT_VERSION, QUOTATION_EXTRACTION_PROMPT_VERSION (+10 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.05
Nodes (36): dom, es2015.collection, es2015.core, es2015.iterable, es2015.promise, es2016.array.include, es2017.object, es2017.string (+28 more)

### Community 11 - "Approvals & Sectors"
Cohesion: 0.13
Nodes (23): SECTOR_CONFIGS, SectorConfig, STATUS_DISPLAY, IBidRoleMeta, BY_LABEL, BY_VALUE, getSectorLabel(), ISectorDef (+15 more)

### Community 12 - "Dashboard UI (Cards/Charts)"
Cohesion: 0.13
Nodes (15): ChartTooltip(), ChartTooltipEntry, ChartTooltipProps, GlassCard(), GlassCardProps, ApprovalsPending(), ApprovalsPendingProps, BidsByDivisionChart() (+7 more)

### Community 13 - "System Configuration"
Cohesion: 0.07
Nodes (24): ACCESS_AREAS, ALL_NAV_ITEMS, INavGroup, INavItem, KPI_META, NAV_GROUPS, NOTIFICATION_LABELS, PERM_CYCLE (+16 more)

### Community 14 - "Create Request"
Cohesion: 0.15
Nodes (17): ConfirmDialog(), ConfirmDialogProps, FileUpload(), FileUploadProps, PersonaCard(), PersonaCardProps, RichTextEditor(), RichTextEditorProps (+9 more)

### Community 15 - "Approval Flow"
Cohesion: 0.16
Nodes (8): ApprovalMatrixProps, ApprovalRequestCardProps, ApprovalTimelineProps, IApprovalChain, IApprovalChainStep, IApprovalSectorGroup, IBidApprovalState, ApprovalService

### Community 16 - "BID Status & Phases"
Cohesion: 0.06
Nodes (45): BidStatusDropdown(), BidStatusDropdownProps, BidStatusPhasePanel(), BidStatusPhasePanelProps, BidTaskChecklist(), BidTaskChecklistProps, BidTimeline(), BidTimelineProps (+37 more)

### Community 17 - "Dev Dependencies"
Cohesion: 0.07
Nodes (29): ajv, eslint, eslint-plugin-react-hooks, gulp, @microsoft/eslint-config-spfx, @microsoft/eslint-plugin-spfx, @microsoft/rush-stack-compiler-4.7, @microsoft/sp-build-web (+21 more)

### Community 18 - "ESLint Rules & Rationale"
Cohesion: 0.07
Nodes (27): RATIONALE: The "module" keyword is deprecated except when describing legacy…, RATIONALE: This rule warns if setters are defined without getters, which is…, RATIONALE: In TypeScript, if you write x["y"] instead of x.y, it disables type…, RATIONALE: Catches code that is likely to be incorrect, RATIONALE: If you have more than 2,000 lines in a single source file, it's…, RATIONALE: Deprecated language feature., RATIONALE: Eval is a security concern and a performance concern., RATIONALE: System types are global and should not be tampered with in a… (+19 more)

### Community 19 - "Package Solution Config"
Cohesion: 0.07
Nodes (26): mpnId, name, privacyUrl, termsOfUseUrl, websiteUrl, default, categories, longDescription (+18 more)

### Community 20 - "Assets Breakdown & Costs"
Cohesion: 0.15
Nodes (23): applyContingency(), AssetsBreakdownTab(), AssetsBreakdownTabProps, blankAsset(), blankSubCost(), blankSubItemCost(), blankTransitSubCost(), calcContingencyPct() (+15 more)

### Community 21 - "Access Control & Auth"
Cohesion: 0.09
Nodes (23): Toast, ToastContainer(), ToastContainerProps, AppLayout(), GuestModeBanner(), PatchNote, PatchNotes(), IUser (+15 more)

### Community 22 - "Runtime Dependencies"
Cohesion: 0.08
Nodes (25): date-fns, @fluentui/react, lucide-react, @microsoft/sp-core-library, @microsoft/sp-lodash-subset, @microsoft/sp-webpart-base, dependencies, date-fns (+17 more)

### Community 23 - "Scope & Engineering Hours"
Cohesion: 0.09
Nodes (37): AITabProps, BidHoursTable(), BidHoursTableProps, blankHoursItem(), HoursRow(), HoursRowProps, SectionKey, EditItemModalState (+29 more)

### Community 24 - "Scope of Supply & Documents"
Cohesion: 0.22
Nodes (13): DocumentsTab(), DocumentsTabProps, blankItem(), blankSection(), blankSubItem(), EditableCellProps, ScopeOfSupplyTab(), ACCEPTED_TYPES (+5 more)

### Community 25 - "Certifications & Logistics Breakdown"
Cohesion: 0.15
Nodes (13): blankItem(), blankSection(), CertificationsBreakdownTab(), CertificationsBreakdownTabProps, SECTION_COLORS, blankItem(), LogisticsBreakdownTab(), LogisticsBreakdownTabProps (+5 more)

### Community 26 - "SharePoint Services Core"
Cohesion: 0.21
Nodes (6): SHAREPOINT_CONFIG, NOTE: This list uses real SharePoint columns (not a JSON blob)., IPriceEntry, SPService, ChangeType, IStatusTrackerEntry

### Community 27 - "Query Catalog & Exchange Rates"
Cohesion: 0.18
Nodes (13): IActiveRegisteredItem, IBomSheetItem, IPeopleSoftFinancialsItem, IQueryCatalogData, IRawTabData, ISearchResultItem, IExchangeRate, QueryCatalogService (+5 more)

### Community 28 - "Cost Calculations"
Cohesion: 0.26
Nodes (21): BidCostSummary(), BidCostSummaryProps, CapexOpexVerticalChart(), applyContingencySplit(), applyContingencyToCost(), buildCostSummary(), calculateAssetsByResourceType(), calculateAssetsTotals() (+13 more)

### Community 29 - "Clarifications DB"
Cohesion: 0.22
Nodes (9): ImportClarificationModal(), toClarificationItem(), useDebounce(), ClarificationBaseType, IClarificationDbItem, ClarificationsDbPage(), emptyItem(), toDateInput() (+1 more)

### Community 30 - "BID Core Model & Dashboard"
Cohesion: 0.05
Nodes (40): ExportClarificationModal(), ExportClarificationModalProps, ExportMode, ImportClarificationModalProps, QualificationsTabProps, DashboardActivityProps, DivisionWorkloadProps, EngHoursRankingProps (+32 more)

### Community 31 - "Document Library Catalog"
Cohesion: 0.18
Nodes (9): DocLibraryCatalog(), DocLibraryCatalogProps, EMPTY_META(), stripExt(), ViewMode, DocCatalogType, IDocLibraryItem, IDocLibraryMetadata (+1 more)

### Community 32 - "Bid Store & Requests"
Cohesion: 0.16
Nodes (16): BidCardProps, mockRequests, useRequests(), IQuickNote, IBidRequest, IRequestAttachment, IRequestPhase, BidPriority (+8 more)

### Community 33 - "Favorites & Catalog Search"
Cohesion: 0.14
Nodes (16): AdvancedCatalogSearch(), AdvancedCatalogSearchProps, getPhotoUrl(), TabKey, PhotoLightbox(), PhotoLightboxProps, EditEquipmentModal(), EditEquipmentModalProps (+8 more)

### Community 34 - "Preparation & Mobilization"
Cohesion: 0.20
Nodes (14): blankConsumable(), blankMob(), blankRTS(), MOB_TYPES, PreparationMobilizationTab(), buildOrdered(), moveItemInList(), PreparationMobilizationTabProps (+6 more)

### Community 35 - "AI Quotation Mapping & Activity Log"
Cohesion: 0.18
Nodes (11): AddQuotationModalProps, ILineItem, IActivityLog, IActivityLogEntry, QuotationType, ILineItem, ActivityLogService, IQuotationLineDraft (+3 more)

### Community 36 - "Report Helpers"
Cohesion: 0.11
Nodes (26): PeriodPerformancePage(), BidTableRow, bidTableRows(), byCommercialRequester(), ClientPerformance, clientPerformanceByDivision(), ClientPerfRow, ClientStatusRow (+18 more)

### Community 37 - "Bottleneck Analysis"
Cohesion: 0.14
Nodes (20): PhaseBadge(), PhaseBadgeProps, AIInsightsPanel(), AIInsightsPanelProps, BottleneckAnalysisPage(), DIM_SEGMENTS, Dimension, Scope (+12 more)

### Community 38 - "Favorites Service"
Cohesion: 0.24
Nodes (9): FavoriteDataSource, IFavoriteBid, IFavoriteEquipment, IFavoriteGroup, IFavoritesData, IFavoriteSubGroup, EMPTY_DATA, FavoritesService (+1 more)

### Community 39 - "BOM Costs"
Cohesion: 0.16
Nodes (20): BomCostSource, IBomCostItem, BomCostsPage(), calcContingency(), computeSmartTotal(), dateAgeBucket(), dateAgeClass(), formatDateDMY() (+12 more)

### Community 40 - "BID Detail Tabs (Overview/Notes)"
Cohesion: 0.08
Nodes (29): BidComments(), BidCommentsProps, BidPhaseProgress(), BidPhaseProgressProps, EmptySection(), NotesTab(), NotesTabProps, AnalysisNotesCard() (+21 more)

### Community 41 - "Analytics Filters & Follow-up"
Cohesion: 0.21
Nodes (13): AnalyticsFilterBarProps, PRESETS, MultiSelectDropdown(), MultiSelectDropdownProps, MultiSelectOption, AnalyticsFilters, DatePreset, DEFAULT (+5 more)

### Community 42 - "Layout & UI Store"
Cohesion: 0.11
Nodes (19): CommandPalette(), ICommandItem, Footer(), oiiBlueLogo, oiiWhiteLogo, smartBidIcon, smartBidIconDark, Header() (+11 more)

### Community 43 - "Members Management"
Cohesion: 0.18
Nodes (12): BID_ROLE_META, BL_COLORS, BUSINESS_LINES, getAvatarColor(), getInitials(), IPeopleResult, ISectorMeta, MembersManagement() (+4 more)

### Community 44 - "Links Recommendations"
Cohesion: 0.32
Nodes (6): IBidLink, IBidRecommendation, ILinksRecommendationsData, LinksRecommendationsPage(), EMPTY_DATA, LinksRecommendationsService

### Community 45 - "Query Consulting"
Cohesion: 0.16
Nodes (17): applyAllFilters(), applyMultipleFilters(), calcLeadTimeDays(), convertExcelDate(), emptyTabData(), extractBUs(), formatAsUSD(), getPhotoUrl() (+9 more)

### Community 46 - "Quotations"
Cohesion: 0.19
Nodes (14): AddQuotationModal(), blankLineItem(), genId(), CostSearchModal(), isAiConfigured(), IQuotationItem, blankLineItem(), genId() (+6 more)

### Community 47 - "ERN Service & Store"
Cohesion: 0.14
Nodes (12): ErnDetailsModal(), ErnDetailsModalProps, stateColor, useErn(), UseErnResult, ErnDeadlineState, IErn, IErnCreateData (+4 more)

### Community 48 - "Equipment & Assets Catalog"
Cohesion: 0.17
Nodes (14): EquipmentImportModal(), EquipmentImportModalProps, IImportSubItem, TabDef, TabId, TABS, IAssetCatalogItem, AssetsCatalogPage() (+6 more)

### Community 49 - "ERN Integration"
Cohesion: 0.14
Nodes (22): ErnCreateModal(), ErnCreateModalProps, personToPicked(), toInputDate(), ernNum(), ErnSearchModal(), ErnSearchModalProps, IBidErnLink (+14 more)

### Community 50 - "Current User Hook"
Cohesion: 0.29
Nodes (10): RequireEngineering(), Sidebar(), useCurrentUser(), useIsGuest(), DatasheetsPage(), LinkModal, RecModal, ManualsCatalogsPage() (+2 more)

### Community 51 - "Sidebar Navigation"
Cohesion: 0.17
Nodes (11): oiiWhiteLogo, smartBidIconWhite, smartBidLogoCompact, SidebarItem(), SidebarItemProps, SidebarSubmenu(), SidebarSubmenuProps, INavItem (+3 more)

### Community 52 - "Web Part Manifest"
Cohesion: 0.13
Nodes (14): SharePointFullPage, SharePointWebPart, TeamsPersonalApp, TeamsTab, alias, componentType, id, manifestVersion (+6 more)

### Community 53 - "Bid Activity Log"
Cohesion: 0.31
Nodes (7): BidActivityLog(), BidActivityLogProps, getActivityColor(), Timeline(), TimelineItem, TimelineProps, IActivityLogEntry

### Community 54 - "SPFx Context & People Picker"
Cohesion: 0.36
Nodes (6): IGraphResult, IPickedPerson, PeoplePicker(), PeoplePickerProps, SpfxContext, useSpfxContext()

### Community 55 - "Validators"
Cohesion: 0.25
Nodes (3): IValidationResult, validateBidRequest(), validateRequired()

### Community 56 - "Azure AI Backend (Functions)"
Cohesion: 0.31
Nodes (12): ensure_text(), extract_quotation(), extract_text_or_images(), generate_scope(), _now_iso(), SmartBid AI backend — Azure Functions (Python v2 programming model). Two HTTP…, Prefer extracted text (cheap). For scanned/image PDFs with no text, return page…, Guarantee plain text. If we only have page images (scanned document), use… (+4 more)

### Community 57 - "Web Part Root Component"
Cohesion: 0.52
Nodes (3): ISmartBid20Props, SmartBid20, ISmartBid20WebPartProps

### Community 58 - "XLSX Typings"
Cohesion: 0.17
Nodes (4): CellObject, WorkBook, WorkSheet, xlsx

### Community 59 - "Part Number Autocomplete"
Cohesion: 0.26
Nodes (10): PartNumberAutocomplete(), PartNumberAutocompleteProps, SectionDef, SECTIONS, SOURCE_LABELS, EMPTY_RESULTS, useQuerySearch(), UseQuerySearchOptions (+2 more)

### Community 60 - "Package Metadata"
Cohesion: 0.18
Nodes (10): engines, node, main, name, private, scripts, build, clean (+2 more)

### Community 61 - "Bid Equipment Table"
Cohesion: 0.67
Nodes (3): BidEquipmentTable(), BidEquipmentTableProps, IEquipmentItem

### Community 63 - "Notification Service"
Cohesion: 0.25
Nodes (4): NotificationService, ToastCallback, ToastOptions, ToastType

### Community 64 - "Approval Models"
Cohesion: 0.18
Nodes (13): ApprovalBadgeProps, ApprovalTabProps, BidApprovalPanel(), BidApprovalPanelProps, mockApprovals, IApprovalFlow, IApprovalFlowChain, IApprovalFlowStep (+5 more)

### Community 65 - "Recent Activity & Notifications"
Cohesion: 0.24
Nodes (5): RecentActivityProps, TYPE_COLORS, MOCK_NOTIFICATIONS, INotification, NotificationState

### Community 66 - "Web Part Bundle Config"
Cohesion: 0.22
Nodes (8): bundles, smart-bid-20-web-part, externals, localizedResources, SmartBid20WebPartStrings, $schema, components, version

### Community 69 - "BOM Parser"
Cohesion: 0.53
Nodes (8): assignParentIds(), cleanCsvValue(), emptyItem(), findColumns(), parseBomCSV(), parseBomExcel(), parseCSVRows(), uid()

### Community 70 - "Integrated Division Tabs"
Cohesion: 0.32
Nodes (7): IntegratedDivision, IntegratedDivisionTabs(), IntegratedDivisionTabsProps, OPG_SERVICE_LINES, resolveTabs(), tabBarStyle, tabStyle()

### Community 72 - "Azure Storage Deploy Config"
Cohesion: 0.33
Nodes (5): accessKey, account, container, $schema, workingDir

### Community 73 - "Power Automate Card: Welcome"
Cohesion: 0.33
Nodes (5): actions, body, $schema, type, version

### Community 74 - "Power Automate Card: Approver"
Cohesion: 0.33
Nodes (5): actions, body, $schema, type, version

### Community 75 - "Power Automate Card: Final"
Cohesion: 0.33
Nodes (5): actions, body, $schema, type, version

### Community 77 - "Heatmap Chart"
Cohesion: 0.47
Nodes (5): heatColor(), HeatmapColumn, HeatmapGrid(), HeatmapGridProps, hexToRgb()

### Community 78 - "Serve Config"
Cohesion: 0.40
Nodes (4): https, initialPage, port, $schema

### Community 79 - "Power Automate Card: Status"
Cohesion: 0.40
Nodes (4): body, $schema, type, version

## Knowledge Gaps
- **402 isolated node(s):** `IDivisionCost`, `IDivisionHoursTotals`, `EmptyStateProps`, `ExportBarProps`, `IExportRow` (+397 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `IBid` connect `BID Core Model & Dashboard` to `Data Models (Interfaces)`, `PDF Export & Report Pages`, `Bids Hook & Common UI`, `Analytics & Charts`, `Config Store & Bid Tracker`, `BID Detail Page & Tabs`, `Team Analytics`, `Approvals & Sectors`, `Approval Flow`, `BID Status & Phases`, `Scope & Engineering Hours`, `Scope of Supply & Documents`, `SharePoint Services Core`, `Cost Calculations`, `Bid Store & Requests`, `Favorites & Catalog Search`, `Report Helpers`, `BID Detail Tabs (Overview/Notes)`, `Analytics Filters & Follow-up`, `ERN Integration`, `Approval Models`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `useConfigStore` connect `Config Store & Bid Tracker` to `PDF Export & Report Pages`, `Bids Hook & Common UI`, `Analytics & Charts`, `BID Detail Page & Tabs`, `BID Templates`, `Team Analytics`, `System Configuration`, `Create Request`, `BID Status & Phases`, `Assets Breakdown & Costs`, `Access Control & Auth`, `Scope & Engineering Hours`, `Scope of Supply & Documents`, `Certifications & Logistics Breakdown`, `Favorites & Catalog Search`, `AI Quotation Mapping & Activity Log`, `Report Helpers`, `Bottleneck Analysis`, `BOM Costs`, `BID Detail Tabs (Overview/Notes)`, `Analytics Filters & Follow-up`, `Layout & UI Store`, `Query Consulting`, `Quotations`, `ERN Integration`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `IScopeItem` connect `Scope & Engineering Hours` to `Data Models (Interfaces)`, `PDF Export & Report Pages`, `Preparation & Mobilization`, `BID Detail Page & Tabs`, `BID Templates`, `AI Analysis Service`, `Assets Breakdown & Costs`, `Scope of Supply & Documents`, `Certifications & Logistics Breakdown`, `Cost Calculations`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `IDivisionCost`, `IDivisionHoursTotals`, `EmptyStateProps` to the rest of the system?**
  _402 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Data Models (Interfaces)` be split into smaller, more focused modules?**
  _Cohesion score 0.07127882599580712 - nodes in this community are weakly interconnected._
- **Should `PDF Export & Report Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.13076923076923078 - nodes in this community are weakly interconnected._
- **Should `Bids Hook & Common UI` be split into smaller, more focused modules?**
  _Cohesion score 0.11895161290322581 - nodes in this community are weakly interconnected._