# Graph Report - .  (2026-09-19)

## Corpus Check
- Large corpus: 426 files · ~798,851 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 1718 nodes · 4797 edges · 92 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: contains: 1152 · imports: 1031 · imports_from: 1010 · MODIFIES: 855 · calls: 290 · method: 203 · re_exports: 163 · ON_BRANCH: 32 · PARENT_OF: 31 · rationale_for: 27 · inherits: 3


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 426 · Candidates: 813
- Excluded: 0 untracked · 137051 ignored · 1 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `b6d954d`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `useConfigStore` - 46 edges
2. `PageHeader()` - 33 edges
3. `GlassCard()` - 30 edges
4. `AIAnalysisService` - 27 edges
5. `SPService` - 27 edges
6. `makeId()` - 26 edges
7. `BidService` - 25 edges
8. `useCurrentUser()` - 24 edges
9. `QuotationService` - 19 edges
10. `EmptyState()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `0546310 Add dashboard components and styles for activity and engineering hours ranking` --ON_BRANCH--> `main`  [EXTRACTED]
  git → git  _Bridges community 85 → community 36_
- `0546310 Add dashboard components and styles for activity and engineering hours ranking` --PARENT_OF--> `892c1fc feat: add PeoplePicker component for AAD user selection`  [EXTRACTED]
  git → git  _Bridges community 85 → community 7_
- `0e653cd more mods` --ON_BRANCH--> `main`  [EXTRACTED]
  git → git  _Bridges community 49 → community 36_
- `0e653cd more mods` --PARENT_OF--> `c58a13c new-implementations`  [EXTRACTED]
  git → git  _Bridges community 49 → community 13_
- `165493f NEW-MODIFIC` --ON_BRANCH--> `main`  [EXTRACTED]
  git → git  _Bridges community 5 → community 36_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (63): 7ccad33 Refactor code structure and remove redundant code blocks for improved readability and maintainability, AIAnalysisReviewStatus, IActivityLogEntry, IApprovalRound, IAssetBreakdownItem, IAssetsCostSummary, IAssetSubCost, IAvailabilitySplit (+55 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (27): 3a3d0a5 new changes, CountdownTimer(), CountdownTimerProps, DataTable(), DataTableColumn, DataTableProps, DivisionBadge(), DivisionBadgeProps (+19 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (27): ChatAssistant(), EXAMPLE_QUESTIONS, IBubbleProps, useIsGuest(), AIUseCase, IAIAnalysisContext, IAIAnalysisError, IAIAnalysisRequest (+19 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (44): AIInsightsPanel(), AIInsightsPanelProps, BottleneckAnalysisPage(), DIM_SEGMENTS, Dimension, Scope, SCOPE_SEGMENTS, STAT_SEGMENTS (+36 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (23): BidComments(), BidCommentsProps, ConfirmDialog(), ConfirmDialogProps, FileUpload(), FileUploadProps, PersonaCard(), PersonaCardProps (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (27): EquipmentImportModal(), EquipmentImportModalProps, IImportPick, IImportSubItem, TabDef, TabId, TABS, EditableCellProps (+19 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (15): BomCostsPage(), formatDateDMY(), getDirectChildren(), isRolledUpPartial(), MONTH_NAMES, PageMode, QuotationService, assignParentIds() (+7 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (25): ErnCreateModal(), ErnCreateModalProps, ErnDetailsModal(), ErnDetailsModalProps, stateColor, ErnSearchModal(), ErnSearchModalProps, APPROVAL_STATUS_DISPLAY (+17 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (38): _bad_request(), _caller_upn(), chat(), _chat_bad_request(), _chat_messages(), _chat_reference_material(), _chat_search(), _context_lines() (+30 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (18): BidTemplateImportProps, 4c2e63a update smartbid 2.0, c4e04de lots-implementation, useTemplates(), IBidTemplate, ViewMode, ExportOptionsProps, TemplateState (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (23): AdvancedCatalogSearch(), AdvancedCatalogSearchProps, TabKey, PhotoLightbox(), PhotoLightboxProps, applyAllFilters(), applyMultipleFilters(), emptyTabData() (+15 more)

### Community 11 - "Community 11"
Cohesion: 0.09
Nodes (29): c271ce8 Refactor code structure for improved readability and maintainability, KPICard(), KPICardProps, DashboardKPIRow(), DashboardKPIRowProps, AnalyticsFilters, DatePreset, DEFAULT (+21 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (27): BID_PHASES, BID_STATUSES, getPhaseColor(), getPhaseDef(), getStatusColor(), getStatusDef(), getSubStatusColor(), getSubStatusDef() (+19 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (18): CertificationsBreakdownTab(), CertificationsBreakdownTabProps, SECTION_COLORS, DocumentsTabProps, EmptySection(), LogisticsBreakdownTab(), LogisticsBreakdownTabProps, NotesTab() (+10 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (29): _atomic_blocks(), build_chunks(), _has_letters(), _has_word(), _heading(), _is_boilerplate(), _is_title_case(), _is_upper() (+21 more)

### Community 15 - "Community 15"
Cohesion: 0.10
Nodes (15): ApprovalMatrixProps, ApprovalRequestCardProps, ApprovalTabProps, SECTOR_CONFIGS, SectorConfig, STATUS_DISPLAY, 1a40896 feat: add SmartBid 2.0 Executive Summary Slides generator script, f3095f2 feat: add ApprovalTab component with styling and functionality for managing bid approvals (+7 more)

### Community 16 - "Community 16"
Cohesion: 0.12
Nodes (19): BidApprovalPanelProps, Sparkline(), SparklineProps, EmptyState(), EmptyStateProps, BidKPIs, useKPIs(), PreviewDef (+11 more)

### Community 17 - "Community 17"
Cohesion: 0.12
Nodes (21): useAccessLevel(), useCurrentUser(), DocLibraryCatalog(), CommandPalette(), ICommandItem, DatasheetsPage(), ManualsCatalogsPage(), FIELD_LABELS (+13 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): ApprovalTab(), BidExportButton(), BidExportButtonProps, DocumentsTab(), OverviewTab(), IntegratedDivision, IntegratedDivisionTabs(), IntegratedDivisionTabsProps (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.08
Nodes (19): QueryCatalogLoadingBanner(), Toast, ToastContainer(), ToastContainerProps, GuestModeBanner(), AnalyticsPage(), ApprovalsPage(), BidDetailPage() (+11 more)

### Community 20 - "Community 20"
Cohesion: 0.10
Nodes (20): ApprovalsPending(), BidsByDivisionChart(), BidsByStatusChart(), DashboardActivity(), EngHoursRanking(), ErnDashboardSection(), ErnDashboardSectionProps, ApprovalSummary (+12 more)

### Community 21 - "Community 21"
Cohesion: 0.12
Nodes (19): BidStatusPhasePanel(), BidStatusPhasePanelProps, BidTaskChecklist(), BidTaskChecklistProps, BidTimeline(), BidTimelineProps, useLiveElapsed(), canStartRevision() (+11 more)

### Community 22 - "Community 22"
Cohesion: 0.11
Nodes (14): ChartTooltip(), ChartTooltipEntry, ChartTooltipProps, GlassCard(), GlassCardProps, ApprovalsPendingProps, BidsByDivisionChartProps, BidsByStatusChartProps (+6 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (15): b6d954d feat: Enhance AIAnalysisService to include section data and handle zero-priced rows, de36cf5 feat: add SmartBid Docs indexer and skillset for AI search integration, CollapsibleSidebar(), ICollapsibleSidebarProps, ROUTES, SHAREPOINT_CONFIG, IQuotationItem, QuotationType (+7 more)

### Community 24 - "Community 24"
Cohesion: 0.11
Nodes (21): CHART_SECTIONS, BidTableRow, bidTableRows(), byCommercialRequester(), ClientPerformance, clientPerformanceByDivision(), ClientPerfRow, ClientStatusRow (+13 more)

### Community 25 - "Community 25"
Cohesion: 0.11
Nodes (12): applyContingency(), AssetsBreakdownTab(), AssetsBreakdownTabProps, calcContingencyPct(), fmtCost(), QUERY_SOURCES, CostSearchImportItem, CostSearchModal() (+4 more)

### Community 26 - "Community 26"
Cohesion: 0.11
Nodes (16): 3c5c37b more-mods, 7d9108e createrequestpage correction, getDefaultFavoriteGroups(), makeGroup(), nextId(), DEFAULT_SYSTEM_CONFIG, ACCESS_AREAS, ALL_NAV_ITEMS (+8 more)

### Community 27 - "Community 27"
Cohesion: 0.15
Nodes (9): ImportClarificationModal(), ImportClarificationModalProps, 8e87d94 feat: Add Links and Recommendations page with CRUD functionality, ClarificationBaseType, IClarificationDbItem, ClarificationsDbPage(), toDateInput(), ClarificationDbService (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.13
Nodes (16): AddQuotationModal(), AddQuotationModalProps, blankLineItem(), genId(), ILineItem, IQuotationLineDraft, 961eb93 feat: Update AI integration and enhance quotation extraction process, IActivityLog (+8 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (16): BidCostSummary(), BidCostSummaryProps, applyContingencySplit(), applyContingencyToCost(), buildCostSummary(), calculateAssetsByResourceType(), calculateAssetsTotals(), calculateCertificationsTotals() (+8 more)

### Community 30 - "Community 30"
Cohesion: 0.17
Nodes (7): dbdc03a systemconfig online, e2285cf cont-implementing, EMPTY_DATA, IPriceEntry, SPService, ChangeType, IStatusTrackerEntry

### Community 31 - "Community 31"
Cohesion: 0.11
Nodes (14): BY_LABEL, BY_VALUE, ISectorDef, SECTORS, IBidCommentDef, IMembersData, ITeamMember, BidRole (+6 more)

### Community 32 - "Community 32"
Cohesion: 0.11
Nodes (14): useDebounce(), BulkAiStatus, createFavoriteGroupAndSave(), DEFAULT_FIELD_LABELS, DocLibraryCatalogProps, EMPTY_META(), findGroupByName(), findSubGroupByName() (+6 more)

### Community 33 - "Community 33"
Cohesion: 0.14
Nodes (14): BidEquipmentTableProps, CHART_SECTIONS, bidsToCSV(), bidToExportRow(), downloadCSV(), IExportRow, formatCurrency(), formatNumber() (+6 more)

### Community 34 - "Community 34"
Cohesion: 0.13
Nodes (7): BidCard(), BidCardProps, FilterPanel(), FilterPanelProps, BidTrackerPage(), getPhaseLabelForBid(), getPhaseProgressByIndex()

### Community 35 - "Community 35"
Cohesion: 0.13
Nodes (16): ExportClarificationModal(), ExportClarificationModalProps, ExportMode, 1665b01 more features, DEFAULT_KPI_TARGETS, IKPIDef, KPI_DEFINITIONS, *.svg (+8 more)

### Community 36 - "Community 36"
Cohesion: 0.15
Nodes (16): main, 1c19dcd Update API diagnostics and AI configuration; enhance AiAuthService logging and scope probing, 401be0c Add EntraTokenTest component for Azure API diagnostics, 66dbcee feat: Implement contingency calculations and UI in AssetsBreakdownTab, 9e27edd feat: Update AI integration and authentication flow, bee3eb5 feat: Enhance bid model with availability splits and engineering details, c6ce977 Add Azure AI Backend for SmartBid 2.0 integration, cce6a16 Refactor code structure for improved readability and maintainability (+8 more)

### Community 37 - "Community 37"
Cohesion: 0.12
Nodes (9): oiiWhiteLogo, Sidebar(), smartBidIconWhite, smartBidLogoCompact, SidebarItem(), SidebarItemProps, SidebarSubmenu(), SidebarSubmenuProps (+1 more)

### Community 38 - "Community 38"
Cohesion: 0.18
Nodes (11): AITab(), AITabProps, ClarificationSuggestionsModal(), ClarificationSuggestionsModalProps, QualificationsTab(), QualificationsTabProps, 4b576db AI-Integration, APP_CONFIG (+3 more)

### Community 39 - "Community 39"
Cohesion: 0.14
Nodes (13): ProgressBar(), ProgressBarProps, SkeletonLoader(), SkeletonLoaderProps, useTeamMembers(), BidRoleFilter, Metric, METRIC_SEGMENTS (+5 more)

### Community 40 - "Community 40"
Cohesion: 0.13
Nodes (8): BidStatusDropdownProps, fe3728a smartbid2.0, MOCK_NOTIFICATIONS, IBidTemplate, MOCK_TEMPLATES, build, ISmartBid20WebPartStrings, SmartBid20WebPartStrings

### Community 41 - "Community 41"
Cohesion: 0.13
Nodes (10): SpfxContext, useSpfxContext(), MembersPage(), BID_ROLE_META, BL_COLORS, BUSINESS_LINES, IBidRoleMeta, IPeopleResult (+2 more)

### Community 42 - "Community 42"
Cohesion: 0.19
Nodes (4): UseErnResult, ErnService, ErnState, useErnStore

### Community 43 - "Community 43"
Cohesion: 0.22
Nodes (6): EditableTabContent(), EditLockBanner(), EditToolbar(), EditControlState, useEditControl(), EditControlService

### Community 44 - "Community 44"
Cohesion: 0.16
Nodes (9): BidHoursTable(), BidHoursTableProps, HoursRowProps, SectionKey, EditItemModalState, EngineeringHoursSection(), EngineeringHoursSectionProps, INITIAL_MODAL (+1 more)

### Community 45 - "Community 45"
Cohesion: 0.19
Nodes (11): DashboardActivityProps, FeedRow, Mode, MODE_SEGMENTS, EngHoursRankingProps, Scope, SCOPE_SEGMENTS, SegmentedControl() (+3 more)

### Community 46 - "Community 46"
Cohesion: 0.36
Nodes (1): AiAuthService

### Community 47 - "Community 47"
Cohesion: 0.14
Nodes (13): @pnp/sp, SPCurrentUser, SPFI, SPFile, SPFiles, SPFolder, SPItem, SPItems (+5 more)

### Community 48 - "Community 48"
Cohesion: 0.21
Nodes (10): IImportSource, ImportSourceList(), ImportSourceListProps, ImportMode, ImportSourceModal(), ImportSourceModalProps, IScopeImportResult, ScopeImportPreview() (+2 more)

### Community 49 - "Community 49"
Cohesion: 0.30
Nodes (7): 0e653cd more mods, IAssetCatalogItem, AssetsCatalogPage(), dash(), getStatusClass(), ViewMode, AssetCatalogService

### Community 50 - "Community 50"
Cohesion: 0.21
Nodes (8): Breakpoints, useResponsive(), Header(), ICON_MAP, NotificationsPage(), NotificationState, useNotificationStore, ThemeMode

### Community 51 - "Community 51"
Cohesion: 0.22
Nodes (6): ApprovalTimelineProps, BidActivityLog(), BidActivityLogProps, Timeline(), TimelineItem, TimelineProps

### Community 52 - "Community 52"
Cohesion: 0.22
Nodes (5): IExportColumn, IExportOptions, IExportResult, IExportTab, ExportService

### Community 53 - "Community 53"
Cohesion: 0.27
Nodes (5): BCB_CURRENCY_TYPES, CurrencyService, IBCBCurrencyResponse, IBCBDollarResponse, ICurrencyRate

### Community 54 - "Community 54"
Cohesion: 0.25
Nodes (1): DocLibraryCatalogService

### Community 55 - "Community 55"
Cohesion: 0.25
Nodes (4): NotificationService, ToastCallback, ToastOptions, ToastType

### Community 56 - "Community 56"
Cohesion: 0.22
Nodes (8): Footer(), oiiBlueLogo, oiiWhiteLogo, smartBidIcon, smartBidIconDark, Toast, UIState, useUIStore

### Community 57 - "Community 57"
Cohesion: 0.33
Nodes (7): IBidLink, IBidRecommendation, ILinksRecommendationsData, LinkModal, LinksRecommendationsPage(), RecModal, EMPTY_DATA

### Community 58 - "Community 58"
Cohesion: 0.47
Nodes (1): FavoritesService

### Community 59 - "Community 59"
Cohesion: 0.47
Nodes (1): LinksRecommendationsService

### Community 60 - "Community 60"
Cohesion: 0.22
Nodes (5): ApprovalFilter, computeApprovalCycleTime(), computeBidSectorDurations(), computeRoundSectorDurations(), SectorApprovalStat

### Community 61 - "Community 61"
Cohesion: 0.22
Nodes (6): PriorityBadgeProps, ACQUISITION_TYPES, BID_SIZE_COLORS, BID_SIZES, BID_TYPES, PRIORITIES

### Community 62 - "Community 62"
Cohesion: 0.31
Nodes (4): ISmartBid20Props, SmartBid20, AppLayout(), ISmartBid20WebPartProps

### Community 63 - "Community 63"
Cohesion: 0.22
Nodes (8): IActiveRegisteredItem, IBomCostResult, IBomSheetItem, IMultiSourceResults, IPeopleSoftFinancialsItem, IQueryCatalogData, IRawTabData, ISearchResultItem

### Community 64 - "Community 64"
Cohesion: 0.42
Nodes (1): QueryCatalogService

### Community 65 - "Community 65"
Cohesion: 0.31
Nodes (1): TemplateService

### Community 66 - "Community 66"
Cohesion: 0.25
Nodes (2): BaseClientSideWebPart, SmartBid20WebPart

### Community 67 - "Community 67"
Cohesion: 0.31
Nodes (6): getActiveStatuses(), getStatusColor(), getStatusDef(), getStatusOrder(), getTerminalStatuses(), isTerminalStatus()

### Community 68 - "Community 68"
Cohesion: 0.25
Nodes (7): AccessPermission, IAccessLevelDef, IConfigOption, ICurrencySettings, IExchangeRate, IResourceTypeConfig, ISystemConfig

### Community 69 - "Community 69"
Cohesion: 0.38
Nodes (5): getPhaseConfig(), getPhaseLabel(), getPhaseTasks(), IPhaseTask, PHASES_CONFIG

### Community 70 - "Community 70"
Cohesion: 0.33
Nodes (5): mockApprovals, IApprovalFlow, IApprovalFlowChain, IApprovalFlowStep, ApprovalStatus

### Community 71 - "Community 71"
Cohesion: 0.48
Nodes (5): IDashboardData, IDashboardKPI, IDivisionWorkload, IMonthlyVolume, IKPITargets

### Community 72 - "Community 72"
Cohesion: 0.29
Nodes (6): FavoriteDataSource, IFavoriteBid, IFavoriteEquipment, IFavoriteGroup, IFavoritesData, IFavoriteSubGroup

### Community 73 - "Community 73"
Cohesion: 0.57
Nodes (1): MembersService

### Community 74 - "Community 74"
Cohesion: 0.40
Nodes (3): BidPhaseProgressProps, IConfigPhase, useConfigPhases()

### Community 75 - "Community 75"
Cohesion: 0.40
Nodes (5): heatColor(), HeatmapColumn, HeatmapGrid(), HeatmapGridProps, hexToRgb()

### Community 76 - "Community 76"
Cohesion: 0.53
Nodes (4): DocCatalogType, IDocLibraryItem, IDocLibraryMetadata, DOC_TYPE_CHOICES

### Community 77 - "Community 77"
Cohesion: 0.53
Nodes (1): DashboardService

### Community 78 - "Community 78"
Cohesion: 0.40
Nodes (4): HoursCategory, HoursImportPreview(), HoursImportPreviewProps, SelectionState

### Community 79 - "Community 79"
Cohesion: 0.50
Nodes (4): IGraphResult, IPickedPerson, PeoplePicker(), PeoplePickerProps

### Community 80 - "Community 80"
Cohesion: 0.40
Nodes (4): INavItem, NAVIGATION_ITEMS, NAVIGATION_SECTIONS, SECTION_LABELS

### Community 81 - "Community 81"
Cohesion: 0.40
Nodes (4): ErnDeadlineState, IErn, IErnCreateData, IErnCreateResult

### Community 82 - "Community 82"
Cohesion: 0.80
Nodes (1): BomCostAnalysisService

### Community 83 - "Community 83"
Cohesion: 0.40
Nodes (1): SystemConfigService

### Community 84 - "Community 84"
Cohesion: 0.40
Nodes (4): CellObject, WorkBook, WorkSheet, xlsx

### Community 85 - "Community 85"
Cohesion: 0.50
Nodes (2): ApprovalBadgeProps, 0546310 Add dashboard components and styles for activity and engineering hours ranking

### Community 86 - "Community 86"
Cohesion: 0.50
Nodes (3): BidNoteSection, IBidNote, IBidNotesMap

### Community 87 - "Community 87"
Cohesion: 0.50
Nodes (3): BomCostSource, IBomCostAnalysis, IBomCostItem

### Community 88 - "Community 88"
Cohesion: 0.50
Nodes (3): FAQ_ITEMS, FaqPage(), IFaqItem

### Community 89 - "Community 89"
Cohesion: 0.50
Nodes (1): PricingService

### Community 90 - "Community 90"
Cohesion: 0.67
Nodes (1): StatusTrackerService

### Community 91 - "Community 91"
Cohesion: 0.67
Nodes (1): ApprovalDecisionPanelProps

## Knowledge Gaps
- **402 isolated node(s):** `document_structure.py — section-aware Markdown chunking for the SmartBid docs in`, `Guards against all-caps noise such as the "X X X X" row of a maintenance     ma`, `A single-level number is indistinguishable from a quantity in a     specificati`, `Collapse whitespace and mask digits so "Page 3 of 19" and "Page 4 of 19"     co`, `Digit masking is what catches a running footer, but it also makes a     measure` (+397 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 46`** (1 nodes): `AiAuthService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `DocLibraryCatalogService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `FavoritesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (1 nodes): `LinksRecommendationsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (1 nodes): `QueryCatalogService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (1 nodes): `TemplateService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (2 nodes): `BaseClientSideWebPart`, `SmartBid20WebPart`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 73`** (1 nodes): `MembersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 77`** (1 nodes): `DashboardService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 82`** (1 nodes): `BomCostAnalysisService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 83`** (1 nodes): `SystemConfigService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 85`** (2 nodes): `ApprovalBadgeProps`, `0546310 Add dashboard components and styles for activity and engineering hours ranking`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (1 nodes): `PricingService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (1 nodes): `StatusTrackerService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 91`** (1 nodes): `ApprovalDecisionPanelProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AIAnalysisService` connect `Community 2` to `Community 28`, `Community 38`, `Community 5`, `Community 32`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `useConfigStore` connect `Community 1` to `Community 28`, `Community 25`, `Community 44`, `Community 21`, `Community 7`, `Community 5`, `Community 48`, `Community 12`, `Community 74`, `Community 16`, `Community 20`, `Community 32`, `Community 19`, `Community 18`, `Community 34`, `Community 6`, `Community 3`, `Community 4`, `Community 23`, `Community 11`, `Community 24`, `Community 10`, `Community 39`, `Community 9`, `Community 26`, `Community 13`, `Community 67`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `BidService` connect `Community 4` to `Community 19`, `Community 18`, `Community 34`, `Community 11`, `Community 20`, `Community 26`, `Community 7`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `document_structure.py — section-aware Markdown chunking for the SmartBid docs in`, `Guards against all-caps noise such as the "X X X X" row of a maintenance     ma`, `A single-level number is indistinguishable from a quantity in a     specificati` to the rest of the system?**
  _402 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05271629778672032 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07740112994350283 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.061016949152542375 - nodes in this community are weakly interconnected._