# Graph Report - .  (2026-10-09)

## Corpus Check
- Large corpus: 645 files · ~905,864 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 3418 nodes · 10629 edges · 127 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: imports: 2480 · contains: 2440 · imports_from: 2028 · MODIFIES: 2020 · calls: 783 · method: 353 · re_exports: 215 · ON_BRANCH: 137 · PARENT_OF: 104 · rationale_for: 57 · inherits: 10 · cites: 1 · implements: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 645 · Candidates: 1407
- Excluded: 58 untracked · 142245 ignored · 1 sensitive · 18 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `8f7062d`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `useConfigStore` - 71 edges
2. `formatDate()` - 47 edges
3. `useUIStore` - 41 edges
4. `EmptyState()` - 38 edges
5. `BidService` - 38 edges
6. `PageHeader()` - 37 edges
7. `useBidStore` - 37 edges
8. `AIAnalysisService` - 36 edges
9. `SPService` - 36 edges
10. `GlassCard()` - 35 edges

## Surprising Connections (you probably didn't know these)
- `00efd39 Refactor Excel export sheets for improved readability and consistency` --ON_BRANCH--> `main`  [EXTRACTED]
  git → git  _Bridges community 15 → community 31_
- `00efd39 Refactor Excel export sheets for improved readability and consistency` --PARENT_OF--> `24595c5 feat: Enhance Bid Export functionality with approval checks and logging`  [EXTRACTED]
  git → git  _Bridges community 15 → community 33_
- `02c1391 feat: Add supplier management features including service types, quotation registration, and clarification knowledge service` --ON_BRANCH--> `main`  [EXTRACTED]
  git → git  _Bridges community 10 → community 31_
- `0546310 Add dashboard components and styles for activity and engineering hours ranking` --PARENT_OF--> `892c1fc feat: add PeoplePicker component for AAD user selection`  [EXTRACTED]
  git → git  _Bridges community 31 → community 4_
- `0a8206d feat(survey): 3D navigation - Space+drag/right-drag pan, WASD/arrows glide, Q/E depth, Shift boost, R reset, bounded camera, controls hint` --ON_BRANCH--> `main`  [EXTRACTED]
  git → git  _Bridges community 21 → community 31_

## Communities

### Community 26 - "Community 26"
Cohesion: 0.08
Nodes (40): _has_letters(), _is_upper(), _letter_count(), _has_word(), _is_title_case(), _numbered_title(), _normalize(), _recurs_per_page() (+32 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (74): _page_to_png(), _image_to_png(), extract_text_or_images(), ensure_text(), _now_iso(), _unreadable(), _bad_request(), _chat_bad_request() (+66 more)

### Community 21 - "Community 21"
Cohesion: 0.07
Nodes (36): build, SurveySpreadPanelProps, SurveySpreadPanel(), SurveySystemSceneProps, STEM_TIERS, ANCHOR_FALLBACK, SWATCHES, Cable (+28 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (56): BidFavoriteButtonProps, ChatAssistant(), QueryCatalogLoadingBanner(), ToastContainer(), guard(), AppLayout(), AppLayoutInner(), oiiBlueLogo (+48 more)

### Community 78 - "Community 78"
Cohesion: 0.13
Nodes (14): @pnp/sp, SPFI, SPWeb, SPLists, SPList, SPItems, SPItem, SPAttachmentFiles (+6 more)

### Community 31 - "Community 31"
Cohesion: 0.12
Nodes (31): *.svg, IAiAuthConfig, IAiChatConfig, IAiConfig, AI_CONFIG, DEFAULT_ASSISTANT_TEAMS, SHAREPOINT_CONFIG, IAiAuthTraceEntry (+23 more)

### Community 117 - "Community 117"
Cohesion: 0.40
Nodes (4): xlsx, WorkBook, WorkSheet, CellObject

### Community 58 - "Community 58"
Cohesion: 0.14
Nodes (15): ISmartBid20WebPartProps, ROUTES, EasiBidComparatorPage(), EasiBidPresentationPage(), LoadState, EasiModuleFrameProps, EasiModuleFrame(), EasiPriceHistoryPage() (+7 more)

### Community 103 - "Community 103"
Cohesion: 0.25
Nodes (2): SmartBid20WebPart, BaseClientSideWebPart

### Community 18 - "Community 18"
Cohesion: 0.06
Nodes (19): ApprovalBadgeProps, ApprovalDecisionPanelProps, ApprovalMatrixProps, ApprovalRequestCardProps, BidApprovalPanelProps, BidCommentsProps, BidEquipmentTableProps, PersonaCardProps (+11 more)

### Community 49 - "Community 49"
Cohesion: 0.11
Nodes (16): ApprovalOverrideBannerProps, NON_PENDING_LABEL, ApprovalOverrideBanner(), ApprovalTabProps, SectorConfig, SECTOR_CONFIGS, STATUS_DISPLAY, ApprovalTab() (+8 more)

### Community 110 - "Community 110"
Cohesion: 0.33
Nodes (4): ApprovalTimelineProps, TimelineItem, TimelineProps, Timeline()

### Community 13 - "Community 13"
Cohesion: 0.05
Nodes (40): AITabProps, AITab(), AIAnalyzerModalProps, AIAnalyzerModal(), AnalyzerStage, AIDocumentAnalyzerProps, STEPS, INSTRUCTION_PRESETS (+32 more)

### Community 44 - "Community 44"
Cohesion: 0.12
Nodes (22): genId(), ILineItem, IQuotationLineDraft, blankLineItem(), AddQuotationModalProps, AddQuotationModal(), SupplierCombobox(), useRegisterQuotationSuppliers() (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.05
Nodes (34): AssetsBreakdownTabProps, CLEARED_PRICING, DrawerTab, fmtCost(), QUERY_SOURCES, AssetsBreakdownTab(), CostSearchImportItem, CostSearchModalProps (+26 more)

### Community 64 - "Community 64"
Cohesion: 0.13
Nodes (16): BidActivityLogProps, ACTIVITY_ICONS, CategoryFilter, metaString(), renderDetail(), BidActivityLog(), ActivityCategory, ACTIVITY_CATEGORIES (+8 more)

### Community 14 - "Community 14"
Cohesion: 0.07
Nodes (25): BidCardProps, BidCard(), ConfidentialLockProps, ConfidentialLock(), FilterPanel(), PageHeaderProps, PageHeader(), IOpenBidApi (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (47): BidComments(), BidCostSummary(), BidPhaseProgressProps, CertificationsBreakdownTab(), isLocalUrl(), DocumentsTabProps, DocumentsTab(), EmptySection() (+39 more)

### Community 23 - "Community 23"
Cohesion: 0.08
Nodes (31): BidConfidentialButtonProps, BidConfidentialButton(), RequirePageAccessProps, NAV_PAGES, ViewOnlyBanner(), RequirePageAccess(), DocLibraryCatalog(), ApprovalSummary (+23 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (48): BidCostSummaryProps, IAssetResourceTypeCost, getBidContingency(), NO_COST_AVAILABILITY, norm(), isNoCostAvailability(), isRentalAcq(), isWorkshopAcq() (+40 more)

### Community 33 - "Community 33"
Cohesion: 0.07
Nodes (32): BidExportTabProps, SHEET_ICONS, SHEET_ACCENTS, ICheck, plural(), BidExportTab(), BID_EXCEL_SHEETS, getBidApprovalState() (+24 more)

### Community 11 - "Community 11"
Cohesion: 0.06
Nodes (45): BidFavoriteButton(), PastBidChipsProps, PastBidChips(), OUTCOME_CLASS, PastBidOutcomeProps, PastBidOutcome(), KB_CLASS, PastBidKbBadge() (+37 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (43): BidFxNoteProps, UsdAmountCellProps, UsdAmountCell(), BidFxNote(), BidHoursTableProps, SectionKey, HOURS_COLUMNS, HoursRowProps (+35 more)

### Community 24 - "Community 24"
Cohesion: 0.09
Nodes (28): BidHoursTable(), BidTemplateImportProps, ScopeOfSupplyTab(), EditToolbar(), TemplateCardProps, TemplateCard(), TemplateEditorProps, TemplateEditor() (+20 more)

### Community 121 - "Community 121"
Cohesion: 0.67
Nodes (1): BidStatusDropdownProps

### Community 41 - "Community 41"
Cohesion: 0.10
Nodes (23): AssetCostsBlockDialogProps, AssetCostsBlockDialog(), BidStatusPhasePanelProps, BidStatusPhasePanel(), BidTaskChecklistProps, BidTaskChecklist(), useLiveElapsed(), BidTimelineProps (+15 more)

### Community 27 - "Community 27"
Cohesion: 0.08
Nodes (33): ClarificationSuggestionsModalProps, ClarificationSuggestionsModal(), ImportClarificationModal(), ImportQualificationModalProps, ImportQualificationModal(), IQualificationPickRow, IQualificationPickGroup, QualificationGroupListProps (+25 more)

### Community 57 - "Community 57"
Cohesion: 0.14
Nodes (20): ConfidentialAccessModalProps, IAccessRow, IAccessGroup, ROLE_TAGS, keyOf(), ConfidentialAccessModal(), KeyPeopleRole, IKeyPerson (+12 more)

### Community 50 - "Community 50"
Cohesion: 0.11
Nodes (19): DueDateChangeModalProps, toInputDate(), DueDateChangeModal(), CountdownTimerProps, CountdownTimer(), PhaseBadgeProps, PhaseBadge(), ZoomWeeks (+11 more)

### Community 45 - "Community 45"
Cohesion: 0.08
Nodes (24): IImportSubItem, EquipmentImportModalProps, EquipmentImportTabId, TabId, SourceTabId, QueryTabKey, QuerySubTabKey, TabDef (+16 more)

### Community 68 - "Community 68"
Cohesion: 0.14
Nodes (12): IImportPick, PhotoLightboxProps, PhotoLightbox(), AddFavoriteEquipmentModalProps, AddMode, IStagedItem, ICandidate, ISection (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (43): ErnCreateModalProps, ErnCreateModal(), ErnDetailsModalProps, stateColor, ErnDetailsModal(), withDate(), ErnSearchModalProps, ErnSearchModal() (+35 more)

### Community 65 - "Community 65"
Cohesion: 0.17
Nodes (14): ExportClarificationModalProps, TypeFilter, ExportClarificationModal(), DivisionBadge(), ClarificationTypeBadge(), ClarificationCategoryChip(), ClarificationOriginChip(), ClarificationEntryDrawerProps (+6 more)

### Community 38 - "Community 38"
Cohesion: 0.12
Nodes (24): ImportClarificationModalProps, MultiSelectDropdown(), ClarificationEntryModalProps, toDateInput(), ClarificationEntryModal(), LibraryFacetKey, LibraryFilters, ALL_KEYS (+16 more)

### Community 7 - "Community 7"
Cohesion: 0.05
Nodes (46): ChartTooltipEntry, ChartTooltipProps, ChartTooltip(), StatusBadgeProps, StatusBadge(), BidsByDivisionChartProps, BidsByDivisionChart(), BidsByStatusChartProps (+38 more)

### Community 0 - "Community 0"
Cohesion: 0.03
Nodes (82): HeatmapColumn, HeatmapGridProps, hexToRgb(), heatColor(), HeatmapGrid(), EmptyStateProps, GlassCardProps, AIInsightsPanelProps (+74 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (50): SparklineProps, Sparkline(), DivisionBadgeProps, KPIBreakdownItem, TONE_CLASS, KPICardProps, KPICard(), DashboardKPIRowProps (+42 more)

### Community 46 - "Community 46"
Cohesion: 0.12
Nodes (21): EXAMPLE_QUESTIONS, IBubbleProps, useIsGuest(), IChatMessage, IPastBidChatContext, ChatState, useChatStore, asksAboutClarifications() (+13 more)

### Community 47 - "Community 47"
Cohesion: 0.07
Nodes (23): ICollapsibleSidebarProps, CollapsibleSidebar(), PriorityBadge(), AccessLog(), INavItem, INavGroup, NAV_GROUPS, MASTER_ONLY_TABS (+15 more)

### Community 25 - "Community 25"
Cohesion: 0.07
Nodes (33): ColumnFilterProps, PANEL_STYLE, ColumnFilter(), DashboardBidTableProps, FilterKey, SortKey, Column, COLUMNS (+25 more)

### Community 67 - "Community 67"
Cohesion: 0.16
Nodes (14): ConfirmDialogProps, FileUploadProps, FileUpload(), FilterPanelProps, RichTextEditorProps, RichTextEditor(), FormData, INITIAL_FORM (+6 more)

### Community 20 - "Community 20"
Cohesion: 0.08
Nodes (37): ConfirmDialog(), SuggestionInputProps, SuggestionInput(), QualificationCategoryInputProps, QualificationCategoryInput(), QualificationEntryDrawer(), QualificationEntryModalProps, QualificationEntryModal() (+29 more)

### Community 74 - "Community 74"
Cohesion: 0.14
Nodes (10): DataTableColumn, DataTableProps, SkeletonLoaderProps, SkeletonLoader(), AreaFilter, PeriodFilter, ViewMode, AREA_LABELS (+2 more)

### Community 22 - "Community 22"
Cohesion: 0.07
Nodes (37): DataTable(), EmptyState(), ExportBarProps, ExportBar(), useBids(), CHART_SECTIONS, CHART_SECTIONS, bidsToCSV() (+29 more)

### Community 32 - "Community 32"
Cohesion: 0.07
Nodes (25): GlassCard(), ApprovalsPendingProps, ApprovalsPending(), ErnWatchlistProps, FILTERS, EMPTY_TEXT, ErnWatchlist(), FocusOrigin (+17 more)

### Community 53 - "Community 53"
Cohesion: 0.11
Nodes (20): IGuidedTourLabels, GuidedTourProps, IBalloonPos, OPPOSITE, PLACEMENT_CLASS, findTarget(), isRendered(), prefersReducedMotion() (+12 more)

### Community 43 - "Community 43"
Cohesion: 0.08
Nodes (21): GuidedTourPlacement, IGuidedTourStep, GuidedTour(), LanguageSwitch(), HowItWorksDrawer(), TabKey, SubTabKey, IBusinessUnitFilter (+13 more)

### Community 55 - "Community 55"
Cohesion: 0.11
Nodes (20): HoursImportPreviewProps, HoursCategory, SelectionState, HoursImportPreview(), IImportSource, SourceTypeFilter, ImportSourceListProps, ImportSourceList() (+12 more)

### Community 105 - "Community 105"
Cohesion: 0.25
Nodes (6): IntegratedDivision, OPG_SERVICE_LINES, IntegratedDivisionTabsProps, IDivisionContext, DivisionContext, tabBarStyle

### Community 54 - "Community 54"
Cohesion: 0.09
Nodes (18): IPickedPerson, IGraphResult, PeoplePickerProps, PeoplePicker(), ISectorMeta, SECTOR_META, BUSINESS_LINES, MemberFacetKey (+10 more)

### Community 75 - "Community 75"
Cohesion: 0.16
Nodes (11): PriorityBadgeProps, ProgressBarProps, ProgressBar(), IToolingStat, DIVISION_COLORS, PRIORITY_COLORS, BID_SIZE_COLORS, BID_TYPES (+3 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (43): SupplierComboboxProps, SupplierDrawerProps, IQuotationGroup, initials(), SupplierDrawer(), SERVICE_TYPE_SEED, ISupplierServiceTypes, useSupplierServiceTypes() (+35 more)

### Community 113 - "Community 113"
Cohesion: 0.33
Nodes (4): ICONS, ToastContainerProps, Toast, Toast

### Community 88 - "Community 88"
Cohesion: 0.26
Nodes (6): DivisionWorkloadProps, MonthlyVolumeChartProps, IDashboardKPI, IMonthlyVolume, IDivisionWorkload, IDashboardData

### Community 61 - "Community 61"
Cohesion: 0.10
Nodes (16): IDocLibraryFieldLabels, DEFAULT_FIELD_LABELS, DocLibraryCatalogProps, ViewMode, SortOrder, FacetKey, EMPTY_META(), BulkAiStatus (+8 more)

### Community 35 - "Community 35"
Cohesion: 0.10
Nodes (31): ICommandItem, CommandPalette(), IAccessLevelApi, useAccessLevel(), DEFAULT_USER, AuthState, useAuthStore, MaybeConfig (+23 more)

### Community 16 - "Community 16"
Cohesion: 0.06
Nodes (38): Phase, Anchor, NO_BIDS, SigEntry, Signature, fmtDay(), describeDateChange(), describeErn() (+30 more)

### Community 70 - "Community 70"
Cohesion: 0.13
Nodes (9): smartBidLogoCompact, smartBidIconWhite, oiiWhiteLogo, Sidebar(), SidebarItem(), SidebarSubmenuProps, SidebarSubmenu(), RequestService (+1 more)

### Community 36 - "Community 36"
Cohesion: 0.08
Nodes (29): ApprovalDueImpactSectionProps, LateRow, ApprovalDueImpactSection(), toTime(), computeRoundSectorDurations(), computeBidSectorDurations(), SectorApprovalStat, ApprovalFilter (+21 more)

### Community 87 - "Community 87"
Cohesion: 0.15
Nodes (8): IAccessMatrixItem, IAccessMatrixGroup, AccessMatrixProps, CYCLE, LEVEL_LABEL, AccessLegend(), SuperAdminsCard(), AccessMatrix()

### Community 56 - "Community 56"
Cohesion: 0.10
Nodes (20): NotificationRules, EVENT_ICONS, GROUP_ICONS, TONE_COLOR, MODES, MODE_LABEL, teamLabel(), audienceParts() (+12 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (41): SurveyAddToPackageDialogProps, SurveyAddToPackageDialog(), SurveyEquipmentCardProps, SurveyEquipmentPhoto(), SurveyEquipmentCard(), SurveyEquipmentDetailProps, safeUrl(), formatUSD() (+33 more)

### Community 42 - "Community 42"
Cohesion: 0.09
Nodes (25): SurveySearchHit, SurveySceneTour, SurveyCableInfo, SurveyTraceStep, SurveySystemScene, TOUR_DEPTH, ITrunkDetail, ISpreadNode (+17 more)

### Community 98 - "Community 98"
Cohesion: 0.29
Nodes (1): CableNetwork

### Community 37 - "Community 37"
Cohesion: 0.10
Nodes (21): PALETTE, VESSEL_SCALE, VESSEL_ROOMS, SurveySceneApi, SurveySceneOptions, isWebGLAvailable(), std(), glow() (+13 more)

### Community 83 - "Community 83"
Cohesion: 0.18
Nodes (7): OII, Tone, TONES, GLOWING, EquipmentModelFactory, normalize(), SceneShape

### Community 84 - "Community 84"
Cohesion: 0.20
Nodes (1): FocusController

### Community 17 - "Community 17"
Cohesion: 0.04
Nodes (44): IAccessRoleDef, SHORT_ROLE_LABELS, ACCESS_ROLES, ACCESS_PERMISSIONS, IAccessPageDef, IAccessAreaDef, ACCESS_AREA_KEYS, AREA_LABELS (+36 more)

### Community 30 - "Community 30"
Cohesion: 0.08
Nodes (28): AIUseCase, IAIResourceTypeOption, IAIGroupOption, IAISupplierOption, IAIServiceTypeOption, IAIAssetCatalogOption, IAIAssetSubItemOption, IAIAnalysisContext (+20 more)

### Community 60 - "Community 60"
Cohesion: 0.11
Nodes (14): IBidRoleMeta, BID_ROLE_META, ISectorDef, SECTORS, BY_VALUE, BY_LABEL, ITeamMember, IMembersData (+6 more)

### Community 100 - "Community 100"
Cohesion: 0.22
Nodes (6): ColorThemeId, IColorThemeAccents, IColorThemeDef, IUpcomingColorTheme, COLOR_THEMES, UPCOMING_COLOR_THEMES

### Community 106 - "Community 106"
Cohesion: 0.25
Nodes (7): KPIGroup, IKPIDef, KPI_GROUPS, KPI_DEFINITIONS, BID_PRIORITIES, DEFAULT_KPI_TARGETS, DEFAULT_PRIORITY_RULES

### Community 59 - "Community 59"
Cohesion: 0.10
Nodes (20): NotificationChannel, NotificationTone, NotificationSource, NotificationGroupKey, INotificationEventDef, NOTIFICATION_GROUPS, NOTIFICATION_EVENTS, NOTIFICATION_TEAMS (+12 more)

### Community 79 - "Community 79"
Cohesion: 0.14
Nodes (11): PeoplesoftLang, PeoplesoftSourceKey, PeoplesoftViewKey, PeoplesoftTourStepId, PEOPLESOFT_TOUR_ORDER, IPeoplesoftColumnHeaders, IPeoplesoftHelpSection, IPeoplesoftConsultingText (+3 more)

### Community 111 - "Community 111"
Cohesion: 0.38
Nodes (5): IPhaseTask, PHASES_CONFIG, getPhaseConfig(), getPhaseLabel(), getPhaseTasks()

### Community 122 - "Community 122"
Cohesion: 0.67
Nodes (2): RTS_TYPES, MOB_TYPES

### Community 29 - "Community 29"
Cohesion: 0.07
Nodes (32): BID_STATUSES, BID_PHASES, getStatusDef(), getPhaseDef(), getStatusColor(), getPhaseColor(), SUB_STATUSES, getSubStatusDef() (+24 more)

### Community 125 - "Community 125"
Cohesion: 1.00
Nodes (1): MOCK_NOTIFICATIONS

### Community 107 - "Community 107"
Cohesion: 0.32
Nodes (4): mockRequests, IBidRequest, RequestState, useRequestStore

### Community 52 - "Community 52"
Cohesion: 0.13
Nodes (23): inFlight, needsClarificationLibrarySync(), useClarificationLibrarySync(), IConfigOption, ISystemConfig, IClarificationKnowledgeResult, TYPES, REF_PLACEHOLDERS (+15 more)

### Community 76 - "Community 76"
Cohesion: 0.19
Nodes (8): IExportTab, IExportColumn, IExportOptions, IExportResult, BidExcelSheetKey, IBidExcelExportOptions, ExportService, bidToExportRow()

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (84): AccessLogArea, IAccessLogEntry, ChatRole, IOpportunityInfo, IExchangeRateSnapshot, IPhaseHistoryEntry, IStatusHistoryEntry, IBidTask (+76 more)

### Community 28 - "Community 28"
Cohesion: 0.07
Nodes (13): IActivityLogEntry, IActivityLog, isNotFound(), AccessLogService, EMPTY_DATA, DELIVERY_STATUSES, IPriceEntry, PricingService (+5 more)

### Community 77 - "Community 77"
Cohesion: 0.23
Nodes (9): IAssetCatalogItem, ViewMode, SortOrder, FacetKey, dash(), getStatusClass(), AssetsCatalogPage(), AssetCatalogService (+1 more)

### Community 91 - "Community 91"
Cohesion: 0.36
Nodes (7): DocCatalogType, IDocLibraryItem, IDocLibraryMetadata, DOC_TYPE_CHOICES, findGroupByName(), findSubGroupByName(), withCategory()

### Community 114 - "Community 114"
Cohesion: 0.53
Nodes (4): IBidLink, IBidRecommendation, ILinksRecommendationsData, EMPTY_DATA

### Community 80 - "Community 80"
Cohesion: 0.15
Nodes (13): IActiveRegisteredItem, IPeopleSoftFinancialsItem, IBomSheetItem, ISearchResultItem, IPnAlias, CatalogSearchBucket, IRawTabData, FinancialsActiveRegisteredColumn (+5 more)

### Community 40 - "Community 40"
Cohesion: 0.12
Nodes (18): ISupplierContact, ISupplier, ISupplierInput, ISupplierProfile, SupplierListItem, OPTIONAL_FIELDS, ColumnMap, LOGO_TYPES (+10 more)

### Community 71 - "Community 71"
Cohesion: 0.13
Nodes (15): SurveySceneAnchor, SurveySceneShape, ISurveyFamily, ISurveyFitNode, ISurveyEquipment, ISurveySystem, ISurveyCatalog, ISurveySpreadLine (+7 more)

### Community 34 - "Community 34"
Cohesion: 0.09
Nodes (17): MONTH_NAMES, formatDateDMY(), PageMode, getDirectChildren(), isRolledUpPartial(), BomCostsPage(), BomCostAnalysisService, BomCostAnalysisState (+9 more)

### Community 69 - "Community 69"
Cohesion: 0.19
Nodes (14): isUndecided(), FollowUpPage(), WinProbabilitySource, IWinProbability, ITally, IWinRateIndex, WIN_PROBABILITY_SOURCE_LABEL, WIN_PROBABILITY_LEVELS (+6 more)

### Community 123 - "Community 123"
Cohesion: 0.67
Nodes (1): PlaceholderPageProps

### Community 48 - "Community 48"
Cohesion: 0.18
Nodes (1): AIAnalysisService

### Community 119 - "Community 119"
Cohesion: 0.67
Nodes (1): ActivityLogService

### Community 81 - "Community 81"
Cohesion: 0.36
Nodes (1): AiAuthService

### Community 108 - "Community 108"
Cohesion: 0.25
Nodes (1): AttachmentService

### Community 66 - "Community 66"
Cohesion: 0.18
Nodes (1): BidService

### Community 85 - "Community 85"
Cohesion: 0.29
Nodes (1): ClarificationDbService

### Community 116 - "Community 116"
Cohesion: 0.60
Nodes (1): ClarificationKnowledgeService

### Community 92 - "Community 92"
Cohesion: 0.27
Nodes (5): BCB_CURRENCY_TYPES, IBCBDollarResponse, IBCBCurrencyResponse, ICurrencyRate, CurrencyService

### Community 115 - "Community 115"
Cohesion: 0.53
Nodes (1): DashboardService

### Community 72 - "Community 72"
Cohesion: 0.19
Nodes (1): DocLibraryCatalogService

### Community 93 - "Community 93"
Cohesion: 0.33
Nodes (3): deriveTypeRaw(), EasiModulesAdapter, SmartBidDataAdapter

### Community 112 - "Community 112"
Cohesion: 0.62
Nodes (1): EditControlService

### Community 96 - "Community 96"
Cohesion: 0.47
Nodes (1): FavoritesService

### Community 97 - "Community 97"
Cohesion: 0.47
Nodes (1): LinksRecommendationsService

### Community 109 - "Community 109"
Cohesion: 0.54
Nodes (1): MembersService

### Community 73 - "Community 73"
Cohesion: 0.16
Nodes (9): INotificationActor, INotificationPayload, appUrl(), post(), NotificationDispatchService, SystemConfigService, INotificationFact, INotificationPresentation (+1 more)

### Community 124 - "Community 124"
Cohesion: 1.00
Nodes (1): NotificationLogService

### Community 94 - "Community 94"
Cohesion: 0.25
Nodes (4): ToastType, ToastOptions, ToastCallback, NotificationService

### Community 86 - "Community 86"
Cohesion: 0.32
Nodes (2): isNotFound(), QualificationDbService

### Community 95 - "Community 95"
Cohesion: 0.35
Nodes (1): QueryCatalogService

### Community 82 - "Community 82"
Cohesion: 0.25
Nodes (1): QuotationService

### Community 120 - "Community 120"
Cohesion: 0.67
Nodes (1): StatusTrackerService

### Community 89 - "Community 89"
Cohesion: 0.20
Nodes (1): SurveyCatalogService

### Community 101 - "Community 101"
Cohesion: 0.36
Nodes (2): cut(), TechnicalProposalKnowledgeService

### Community 102 - "Community 102"
Cohesion: 0.31
Nodes (1): TemplateService

### Community 15 - "Community 15"
Cohesion: 0.14
Nodes (40): IBidExcelSheetDef, sheetName(), IBidApprovalState, IBidExcelContext, newSheet(), XL_COLORS, XL_TAB_COLORS, NUM (+32 more)

### Community 51 - "Community 51"
Cohesion: 0.18
Nodes (5): tint(), solid(), clean(), thin(), XlSheet

### Community 62 - "Community 62"
Cohesion: 0.12
Nodes (18): fmtUSD(), unique(), maxLead(), IScopeGroup, groupBySection(), scopeMapOf(), IAssetSummaryRow, IAssetSummaryGroup (+10 more)

### Community 99 - "Community 99"
Cohesion: 0.33
Nodes (7): logoUrl, loadExcelJS(), loadLogoDataUrl(), sanitizeFilePart(), IClarificationExcelOptions, getClarificationExcelFilename(), exportClarificationsToExcel()

### Community 126 - "Community 126"
Cohesion: 1.00
Nodes (2): IPrepLine, ICurrencyLine

### Community 63 - "Community 63"
Cohesion: 0.15
Nodes (21): num(), resolveKpiTargets(), validatePriorityRules(), resolvePriorityRules(), RateStat, toRate(), getFirstDeliveryDate(), isDeliveredOnTime() (+13 more)

### Community 90 - "Community 90"
Cohesion: 0.38
Nodes (11): fmtDate(), orDash(), joinNames(), isCanceledStatus(), uniqueKey(), getClosingEventKey(), getNewActivityEntries(), meta() (+3 more)

### Community 39 - "Community 39"
Cohesion: 0.17
Nodes (32): ProfileFields, clean(), richText(), heading(), day(), money(), amount(), names() (+24 more)

### Community 118 - "Community 118"
Cohesion: 0.70
Nodes (4): norm(), median(), percentile(), computeSurveyBidIntel()

### Community 104 - "Community 104"
Cohesion: 0.25
Nodes (4): IValidationResult, validateRequired(), validateBidRequest(), sanitizeText()

## Knowledge Gaps
- **864 isolated node(s):** `document_structure.py — section-aware Markdown chunking for the SmartBid docs in`, `Guards against all-caps noise such as the "X X X X" row of a maintenance     ma`, `A single-level number is indistinguishable from a quantity in a     specificati`, `Digit masking is what catches a running footer, but it also makes a     measure`, `Return (level, title) when the line opens a section, else None.` (+859 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 103`** (2 nodes): `SmartBid20WebPart`, `BaseClientSideWebPart`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 121`** (1 nodes): `BidStatusDropdownProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 98`** (1 nodes): `CableNetwork`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 84`** (1 nodes): `FocusController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 122`** (2 nodes): `RTS_TYPES`, `MOB_TYPES`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 125`** (1 nodes): `MOCK_NOTIFICATIONS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 123`** (1 nodes): `PlaceholderPageProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `AIAnalysisService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 119`** (1 nodes): `ActivityLogService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 81`** (1 nodes): `AiAuthService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 108`** (1 nodes): `AttachmentService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (1 nodes): `BidService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 85`** (1 nodes): `ClarificationDbService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 116`** (1 nodes): `ClarificationKnowledgeService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 115`** (1 nodes): `DashboardService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 72`** (1 nodes): `DocLibraryCatalogService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 112`** (1 nodes): `EditControlService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 96`** (1 nodes): `FavoritesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (1 nodes): `LinksRecommendationsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 109`** (1 nodes): `MembersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 124`** (1 nodes): `NotificationLogService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 86`** (2 nodes): `isNotFound()`, `QualificationDbService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 95`** (1 nodes): `QueryCatalogService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 82`** (1 nodes): `QuotationService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 120`** (1 nodes): `StatusTrackerService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (1 nodes): `SurveyCatalogService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 101`** (2 nodes): `cut()`, `TechnicalProposalKnowledgeService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 102`** (1 nodes): `TemplateService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 126`** (2 nodes): `IPrepLine`, `ICurrencyLine`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AIAnalysisService` connect `Community 48` to `Community 44`, `Community 27`, `Community 13`, `Community 61`, `Community 30`, `Community 11`, `Community 91`, `Community 46`, `Community 10`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `useConfigStore` connect `Community 5` to `Community 44`, `Community 9`, `Community 8`, `Community 41`, `Community 45`, `Community 4`, `Community 65`, `Community 6`, `Community 27`, `Community 13`, `Community 46`, `Community 55`, `Community 50`, `Community 7`, `Community 29`, `Community 25`, `Community 35`, `Community 38`, `Community 52`, `Community 23`, `Community 20`, `Community 10`, `Community 61`, `Community 2`, `Community 14`, `Community 22`, `Community 34`, `Community 0`, `Community 67`, `Community 11`, `Community 69`, `Community 43`, `Community 24`, `Community 91`, `Community 47`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `BidService` connect `Community 66` to `Community 6`, `Community 52`, `Community 16`, `Community 2`, `Community 14`, `Community 67`, `Community 69`, `Community 4`, `Community 24`, `Community 58`, `Community 11`, `Community 91`, `Community 47`, `Community 23`, `Community 12`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `document_structure.py — section-aware Markdown chunking for the SmartBid docs in`, `Guards against all-caps noise such as the "X X X X" row of a maintenance     ma`, `A single-level number is indistinguishable from a quantity in a     specificati` to the rest of the system?**
  _864 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 26` be split into smaller, more focused modules?**
  _Cohesion score 0.07665505226480836 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.051228070175438595 - nodes in this community are weakly interconnected._
- **Should `Community 21` be split into smaller, more focused modules?**
  _Cohesion score 0.06802721088435375 - nodes in this community are weakly interconnected._