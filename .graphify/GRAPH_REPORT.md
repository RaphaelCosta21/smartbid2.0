# Graph Report - .  (2026-11-05)

## Corpus Check
- Large corpus: 751 files · ~1,085,168 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 4067 nodes · 13186 edges · 148 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: imports: 2982 · contains: 2971 · MODIFIES: 2637 · imports_from: 2273 · calls: 939 · ON_BRANCH: 560 · method: 377 · re_exports: 231 · PARENT_OF: 145 · rationale_for: 57 · inherits: 12 · cites: 1 · implements: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 751 · Candidates: 1540
- Excluded: 0 untracked · 142830 ignored · 1 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `7342177`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `useConfigStore` - 71 edges
2. `formatDate()` - 50 edges
3. `EmptyState()` - 46 edges
4. `useUIStore` - 43 edges
5. `GlassCard()` - 40 edges
6. `PageHeader()` - 38 edges
7. `BidService` - 38 edges
8. `SPService` - 37 edges
9. `useBidStore` - 37 edges
10. `AIAnalysisService` - 36 edges

## Surprising Connections (you probably didn't know these)
- `RevisionsTab()` --calls--> `getCurrentRevisionLetter()`  [EXTRACTED]
  src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx → src/webparts/smartBid20/app/components/bid/RevisionsTab.tsx  _Bridges community 25 → community 38_
- `IXlColumnDef` --inherits--> `IXlColumn`  [EXTRACTED]
  src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts → src/webparts/smartBid20/app/utils/bidExcelExport/excelStyles.ts  _Bridges community 65 → community 77_
- `00efd39 Refactor Excel export sheets for improved readability and consistency` --ON_BRANCH--> `backup/survey-merge-20261018-113028-journey`  [EXTRACTED]
  git → git  _Bridges community 65 → community 8_
- `00efd39 Refactor Excel export sheets for improved readability and consistency` --PARENT_OF--> `24595c5 feat: Enhance Bid Export functionality with approval checks and logging`  [EXTRACTED]
  git → git  _Bridges community 65 → community 38_
- `02c1391 feat: Add supplier management features including service types, quotation registration, and clarification knowledge service` --ON_BRANCH--> `backup/survey-merge-20261018-113028-journey`  [EXTRACTED]
  git → git  _Bridges community 14 → community 8_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.03
Nodes (82): heatColor(), HeatmapColumn, HeatmapGrid(), HeatmapGridProps, hexToRgb(), c271ce8 Refactor code structure for improved readability and maintainability, EmptyState(), EmptyStateProps (+74 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (68): BidFxNote(), BidFxNoteProps, UsdAmountCell(), UsdAmountCellProps, BidHoursTable(), BidHoursTableProps, HOURS_COLUMNS, HoursRowProps (+60 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (80): AccessLogArea, IAccessLogEntry, AIAnalysisReviewStatus, IActivityLogEntry, IApprovalCancellation, IApprovalOverride, IApprovalOverrideParticipant, IApprovalRound (+72 more)

### Community 3 - "Community 3"
Cohesion: 0.04
Nodes (57): ApprovalsPending(), ApprovalsPendingProps, EMPTY_TEXT, ErnWatchlist(), ErnWatchlistProps, FILTERS, FocusButton(), FocusMode (+49 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (62): 5d664ea Merge feat/survey-knowledge-portal-main-sync into main, 6062346 feat(survey): failure cascade, gap analysis, missions, NL ask, subsea-ins 3D, ISurveyBidComparison, useSurveyBidComparison(), useSurveyBidIntel(), IJourneyRun, ITrunkDetail, SurveySystemPage() (+54 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (59): applyContingency(), AssetsBreakdownTab(), AssetsBreakdownTabProps, calcContingencyPct(), CLEARED_PRICING, DrawerTab, fmtCost(), QUERY_SOURCES (+51 more)

### Community 6 - "Community 6"
Cohesion: 0.04
Nodes (54): AITab(), AITabProps, CostSearchImportItem, CostSearchModal(), CostSearchModalProps, SearchRow, EditableCellProps, ScopeOfSupplyTab() (+46 more)

### Community 7 - "Community 7"
Cohesion: 0.05
Nodes (74): _bad_request(), _bid_ref(), _caller_upn(), chat(), _chat_bad_request(), _chat_messages(), _chat_past_bid_material(), _chat_reference_material() (+66 more)

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (71): backup/survey-merge-20261018-113028-journey, backup/survey-merge-20261018-113028-knowledge, backup/survey-merge-20261018-113028-main, feat/easi-modules-pages, feat/survey-knowledge-portal, main, 0a8206d feat(survey): 3D navigation - Space+drag/right-drag pan, WASD/arrows glide, Q/E depth, Shift boost, R reset, bounded camera, controls hint, 0deadb7 fix(survey): read catalog jsondata saved as rich text; provision column as plain text (+63 more)

### Community 9 - "Community 9"
Cohesion: 0.05
Nodes (51): be5fb82 feat(survey): data journey from origin to client deliverables, Cable, KindMaterials, box(), buildManifold(), buildProceduralVessel(), buildRov(), buildSatellite() (+43 more)

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (46): 5c35e8d feat: Implement Qualification Library Filter and Database Service, aa081f9 refactor: Improve code formatting and readability across multiple components, ConfirmDialog(), ConfirmDialogProps, SuggestionInput(), SuggestionInputProps, QualificationCategoryInput(), QualificationCategoryInputProps (+38 more)

### Community 11 - "Community 11"
Cohesion: 0.07
Nodes (47): 568e582 Merge feat/survey-journey-accuracy into main, b80f76b style(survey): solid panel backgrounds and higher-contrast text (no translucent glass, no grey secondary text), da217d4 feat(survey): physical-signal effects on the data journey (motion, heading, echoes, pressure, ...), JourneyEffectKind, EffectBuilder, EffectContext, SceneEffect, applyFade() (+39 more)

### Community 12 - "Community 12"
Cohesion: 0.09
Nodes (46): ExportClarificationModalProps, ExportMode, TypeFilter, ImportClarificationModalProps, 1d028a0 style: Improve code formatting and readability across multiple components, 75476a5 feat: add confidentiality management for bids, 77f55d4 feat: Add Clarification Entry Modal and related hooks for library management, cce41cc refactor: clean up code formatting and improve readability across multiple components (+38 more)

### Community 13 - "Community 13"
Cohesion: 0.05
Nodes (49): 87bda2e feat(docs): add move functionality for documents between catalog folders, QueryCatalogLoadingBanner(), NAV_PAGES, RequirePageAccess(), RequirePageAccessProps, ViewOnlyBanner(), ToastContainer(), useCurrentUser() (+41 more)

### Community 14 - "Community 14"
Cohesion: 0.06
Nodes (40): 02c1391 feat: Add supplier management features including service types, quotation registration, and clarification knowledge service, 414e1a6 style: Improve code formatting and readability across multiple components, SupplierComboboxProps, SERVICE_TYPE_SEED, ISupplierServiceTypes, useSupplierServiceTypes(), EasiSuppliersPage(), BASIS_LABELS (+32 more)

### Community 15 - "Community 15"
Cohesion: 0.06
Nodes (45): CostBar(), divergenceToken(), HistoryItemCard(), HistoryItemCardProps, IHistoryCurrent, NO_RECORDS, usd(), GROUP_MATCH_LABEL (+37 more)

### Community 16 - "Community 16"
Cohesion: 0.06
Nodes (42): ChartTooltip(), ChartTooltipEntry, ChartTooltipProps, BY_LABEL, BY_VALUE, ISectorDef, SECTORS, BidsByDivisionChart() (+34 more)

### Community 17 - "Community 17"
Cohesion: 0.05
Nodes (42): 2a932fc feat(survey): failure cascade, gap analysis, missions, NL ask, subsea-ins 3D, 747fd66 feat(survey): Oceaneering theme, 3D equipment thumb, one-line diagram filter, 7d29862 feat(survey): end-to-end data lineage from sensors to client deliverables, ISurveyBidIntel, ISurveyCatalog, ISurveyEquipment, ISurveyFamily, ISurveyFitNode (+34 more)

### Community 18 - "Community 18"
Cohesion: 0.07
Nodes (42): 0b9cb22 refactor(survey): remove Missions and Ask for now, 3d59093 Merge feat/survey-data-journey into main, d614a0b feat(survey): bilingual survey glossary, hover terms, NMEA decode lab, cable protocols, GLOSSARY_UI, NMEA_LAB_SAMPLES, seg(), SURVEY_GLOSSARY, SURVEY_GLOSSARY_CATEGORIES (+34 more)

### Community 19 - "Community 19"
Cohesion: 0.07
Nodes (39): 4fd375f feat(survey): free 3D composition, software catalog, 3-sat GNSS, 50a29c7 feat(survey): Full Survey Spread template (DWG 803038098 rev A) - catalog, links, 3D zones, 540b3b9 style(DocLibraryCatalog): improve formatting and readability of move confirmation message, 7342177 Merge feat/survey-surface-spares into main, ca73461 feat(survey): spare quantities, standard packages (Surface/MBES/Subsea) and simplified deliverables card, ddf6c96 Merge branch 'feat/survey-knowledge-portal' into main, AnyEntry, ItemType (+31 more)

### Community 20 - "Community 20"
Cohesion: 0.04
Nodes (44): ACCESS_AREA_KEYS, ACCESS_AREAS, ACCESS_PERMISSIONS, ACCESS_ROLES, AREA_LABELS, BID_TAB_GROUP_KEYS, DEFAULT_ACCESS_LEVELS, DEFAULT_BID_ACCESS_LEVELS (+36 more)

### Community 21 - "Community 21"
Cohesion: 0.07
Nodes (27): 0e653cd more mods, 3939503 refactor: improve code formatting for better readability in SmartBid20WebPart and Sidebar components, 4657c82 Add smartbid-logo-teal.png asset to smartBid20 web part, 54fea3b feat: Enhance Part Number Autocomplete with placeholder handling and urgency reason for bids, 7d9108e createrequestpage correction, 8152d02 feat: implement split approval tracks for integrated bids, c4e04de lots-implementation, e61a9d3 feat: add notification system for SmartBID events (+19 more)

### Community 22 - "Community 22"
Cohesion: 0.08
Nodes (25): BidCard(), BidCardProps, ConfidentialLock(), ConfidentialLockProps, FilterPanel(), PageHeader(), PageHeaderProps, IOpenBidApi (+17 more)

### Community 23 - "Community 23"
Cohesion: 0.07
Nodes (24): ErnCreateModal(), ErnCreateModalProps, ErnDetailsModal(), ErnDetailsModalProps, stateColor, withDate(), ErnSearchModal(), ErnSearchModalProps (+16 more)

### Community 24 - "Community 24"
Cohesion: 0.07
Nodes (40): IQuotationRequestInput, LinkedQuotationsPanel(), LinkedQuotationsPanelProps, QuotationLinkPatch, QuotationRespondBanner(), FILTER_LABELS, IControlRow, QuotationControlPanel() (+32 more)

### Community 25 - "Community 25"
Cohesion: 0.06
Nodes (28): AssetCostsBlockDialog(), AssetCostsBlockDialogProps, BidStatusPhasePanel(), BidStatusPhasePanelProps, BidTaskChecklist(), BidTaskChecklistProps, BidTimeline(), BidTimelineProps (+20 more)

### Community 26 - "Community 26"
Cohesion: 0.05
Nodes (18): ApprovalRequestCardProps, BidApprovalPanelProps, BidStatusDropdownProps, 3a3d0a5 new changes, FileUpload(), FileUploadProps, FilterPanelProps, RichTextEditor() (+10 more)

### Community 27 - "Community 27"
Cohesion: 0.07
Nodes (26): BidPhaseProgressProps, 165493f NEW-MODIFIC, 3f57ca9 merge: integrate EASI module pages into main, 6d20432 feat: adiciona paginas EASI ao SMART BID 2.0, e2285cf cont-implementing, f06225e feat(survey): Survey Knowledge & BID Portal - equipment explorer, 3D system view (three.js), bid package to request/BID, fe3728a smartbid2.0, ISmartBid20Props (+18 more)

### Community 28 - "Community 28"
Cohesion: 0.06
Nodes (34): 953278b feat: add ApprovalDueImpactSection component for reporting on bid approval impacts, ColumnFilter(), ColumnFilterProps, PANEL_STYLE, Column, COLUMNS, DashboardBidTableProps, DUE_OPTIONS (+26 more)

### Community 29 - "Community 29"
Cohesion: 0.07
Nodes (29): StatusBadge(), StatusBadgeProps, DashboardActivityProps, FeedRow, Mode, MODE_SEGMENTS, Transition, EngHoursOutlook() (+21 more)

### Community 30 - "Community 30"
Cohesion: 0.07
Nodes (37): 61c46c8 fix(survey): offshore Brazil GGA sample with recomputed checksum, 90a8e89 fix(survey): correct data journey physics and wiring, per-equipment overrides, TBD for unconfirmed formats, acf62bf refactor(survey): data journey advances only on click (no autoplay or speed), ACOUSTIC_TELEGRAM_TBD, DATA_ORIGINS, DATA_SAMPLES, DATA_TYPE_NAMES, DELIVERABLE_RULES (+29 more)

### Community 31 - "Community 31"
Cohesion: 0.07
Nodes (30): AIUseCase, IAIAnalysisContext, IAIAnalysisError, IAIAnalysisRequest, IAIAnalysisResult, IAIAssetCatalogOption, IAIAssetSubItemOption, IAIGroupOption (+22 more)

### Community 32 - "Community 32"
Cohesion: 0.10
Nodes (37): ApprovalOverrideBanner(), ApprovalOverrideBannerProps, NON_PENDING_LABEL, ApprovalTab(), ApprovalTabProps, ApprovalTrackPanelProps, SECTOR_CONFIGS, SectorConfig (+29 more)

### Community 33 - "Community 33"
Cohesion: 0.08
Nodes (40): _atomic_blocks(), _atx_heading(), build_chunks(), _has_letters(), _has_word(), _heading(), _is_boilerplate(), _is_title_case() (+32 more)

### Community 34 - "Community 34"
Cohesion: 0.07
Nodes (35): ApprovalDueImpactSection(), ApprovalDueImpactSectionProps, LateRow, ApprovalDueCategory, ApprovalDueImpact, ApprovalDueSummary, ApprovalFilter, approvedSectorDurations() (+27 more)

### Community 35 - "Community 35"
Cohesion: 0.08
Nodes (34): 8267c28 i18n: translate EASI, suppliers, analytics and reports UI strings to English, CHART_SECTIONS, CHART_SECTIONS, ExportBar(), ExportBarProps, bidsToCSV(), downloadCSV(), formatCurrencyCompact() (+26 more)

### Community 36 - "Community 36"
Cohesion: 0.09
Nodes (36): BASE_DIVISIONS, BidDivisionFields, buildDivisionFields(), businessLineDivision(), composeIntegratedServiceLine(), divisionBusinessLines(), getBidBusinessLines(), getBidServiceLines() (+28 more)

### Community 37 - "Community 37"
Cohesion: 0.10
Nodes (33): KPIBreakdownItem, KPICardProps, TONE_CLASS, DashboardKPIRowProps, useKpiTargets(), CHART_SECTIONS, PHASE_ORDER, isPastDue() (+25 more)

### Community 38 - "Community 38"
Cohesion: 0.11
Nodes (30): BidExportTab(), BidExportTabProps, ICheck, plural(), SHEET_ACCENTS, SHEET_ICONS, getCurrentRevisionLetter(), BID_EXCEL_SHEETS (+22 more)

### Community 39 - "Community 39"
Cohesion: 0.10
Nodes (32): IAccessLevelApi, useAccessLevel(), CommandPalette(), ICommandItem, AuthState, DEFAULT_USER, useAuthStore, ACCESS_MAP (+24 more)

### Community 40 - "Community 40"
Cohesion: 0.07
Nodes (11): AccessLogService, isNotFound(), EMPTY_DATA, DELIVERY_STATUSES, IPriceEntry, PricingService, SPService, ChangeType (+3 more)

### Community 41 - "Community 41"
Cohesion: 0.09
Nodes (24): 79354cb Merge remote-tracking branch 'origin/main' into feat/survey-knowledge-portal-main-sync, ChatAssistant(), EXAMPLE_QUESTIONS, IBubbleProps, ApprovalSummary, useApprovals(), FLOW_FIELDS, useApprovalSync() (+16 more)

### Community 42 - "Community 42"
Cohesion: 0.08
Nodes (27): ComparisonExecutive(), ComparisonExecutiveProps, ComparisonSummary(), ComparisonSummaryProps, varianceToken(), buildComparisonExportRows(), buildInsights(), compareBids() (+19 more)

### Community 43 - "Community 43"
Cohesion: 0.09
Nodes (26): BidFavoriteButton(), bec8260 feat: Enhance bid management with due freeze date logic, KB_CLASS, OUTCOME_CLASS, PastBidChips(), PastBidChipsProps, PastBidKbBadge(), PastBidOutcome() (+18 more)

### Community 44 - "Community 44"
Cohesion: 0.10
Nodes (20): DocumentsTab(), DocumentsTabProps, isLocalUrl(), EmptySection(), NotesTab(), NotesTabProps, APPROVAL_STATUS_DISPLAY, OverviewTabProps (+12 more)

### Community 45 - "Community 45"
Cohesion: 0.09
Nodes (24): a0cd8e2 feat: native quotations, BID presentation tab, bid comparator and price history, BidSelect(), BidSelectProps, buildBidOptions(), IBidOption, MultiBidSelect(), MultiBidSelectProps, useOutsideClose() (+16 more)

### Community 46 - "Community 46"
Cohesion: 0.10
Nodes (23): AddQuotationModal(), AddQuotationModalProps, blankLineItem(), genId(), ILineItem, IQuotationLineDraft, SupplierCombobox(), useRegisterQuotationSuppliers() (+15 more)

### Community 47 - "Community 47"
Cohesion: 0.11
Nodes (19): Sparkline(), SparklineProps, DivisionBadgeProps, KPICard(), useBids(), BidKPIs, UNDECIDED_RESULTS, useKPIs() (+11 more)

### Community 48 - "Community 48"
Cohesion: 0.17
Nodes (31): amount(), buildPastBidAiDigest(), buildPastBidDocument(), buildPastBidFileName(), buildPastBidMetadata(), clarifications(), classification(), clean() (+23 more)

### Community 49 - "Community 49"
Cohesion: 0.08
Nodes (25): BidConfidentialButton(), BidConfidentialButtonProps, BidCostSummary(), CertificationsBreakdownTab(), LogisticsBreakdownTab(), OverviewTab(), PreparationMobilizationTab(), EditableTabContent() (+17 more)

### Community 50 - "Community 50"
Cohesion: 0.07
Nodes (19): SpfxContext, useSpfxContext(), PRIORITIES, REQUEST_FACET_VALUES, RequestFacetKey, VIEW_OPTIONS, ViewMode, BID_ROLE_META (+11 more)

### Community 51 - "Community 51"
Cohesion: 0.09
Nodes (24): mockApprovals, IApprovalFlow, IApprovalFlowChain, IApprovalFlowStep, IScopeItem, IBidCommentDef, IRequestAttachment, IRequestPhase (+16 more)

### Community 52 - "Community 52"
Cohesion: 0.12
Nodes (18): ISupplier, ISupplierContact, ISupplierInput, ISupplierProfile, ColumnMap, joinKeywords(), joinLines(), LOGO_TYPES (+10 more)

### Community 53 - "Community 53"
Cohesion: 0.13
Nodes (17): BidTemplateImportProps, 4c2e63a update smartbid 2.0, useTemplates(), IBidTemplate, FacetKey, SortOrder, STATUS_OPTIONS, TemplatesPage() (+9 more)

### Community 54 - "Community 54"
Cohesion: 0.08
Nodes (24): EMPTY_SEARCHES, EquipmentImportModal(), EquipmentImportModalProps, EquipmentImportTabId, IGlobalHit, IGlobalSearchInput, IGlobalSection, IImportSubItem (+16 more)

### Community 55 - "Community 55"
Cohesion: 0.10
Nodes (22): 3ae3801 refactor: improve code formatting and readability across multiple components, 9582626 feat: add Access Log component and related services for tracking user access to SmartBid and PeopleSoft Consulting, findTarget(), getScrollParent(), GuidedTour(), GuidedTourProps, IBalloonPos, IGuidedTourLabels (+14 more)

### Community 56 - "Community 56"
Cohesion: 0.08
Nodes (22): CollapsibleSidebar(), ICollapsibleSidebarProps, PriorityBadge(), AccessLog(), ACCESS_AREAS, ALL_NAV_ITEMS, AREA_ICONS, BID_MATRIX_GROUPS (+14 more)

### Community 57 - "Community 57"
Cohesion: 0.08
Nodes (19): GuidedTourPlacement, IGuidedTourStep, applyAllFilters(), applyMultipleFilters(), emptyTabData(), filterViewRows(), IBusinessUnitFilter, ISearchFilter (+11 more)

### Community 58 - "Community 58"
Cohesion: 0.18
Nodes (1): AIAnalysisService

### Community 59 - "Community 59"
Cohesion: 0.10
Nodes (22): buildAssetSummary(), buildSupplierRows(), CostEntry, fmtUSD(), groupBySection(), IAssetSummaryGroup, IAssetSummaryRow, IScopeGroup (+14 more)

### Community 60 - "Community 60"
Cohesion: 0.08
Nodes (22): 1665b01 more features, BID_PRIORITIES, DEFAULT_KPI_TARGETS, DEFAULT_PRIORITY_RULES, IKPIDef, KPI_DEFINITIONS, KPI_GROUPS, KPIGroup (+14 more)

### Community 61 - "Community 61"
Cohesion: 0.10
Nodes (18): ApprovalTimelineProps, ACTIVITY_ICONS, BidActivityLog(), BidActivityLogProps, CategoryFilter, metaString(), renderDetail(), Timeline() (+10 more)

### Community 62 - "Community 62"
Cohesion: 0.11
Nodes (18): BidEquipmentTableProps, ParetoChart(), ParetoChartProps, BidRankingTab(), BidRankingTabProps, RankView, usd(), computeStats() (+10 more)

### Community 63 - "Community 63"
Cohesion: 0.10
Nodes (19): BidFavoriteButtonProps, Breakpoints, useResponsive(), Footer(), oiiBlueLogo, oiiWhiteLogo, smartBidIcon, smartBidIconDark (+11 more)

### Community 64 - "Community 64"
Cohesion: 0.08
Nodes (11): BomCostsPage(), formatDateDMY(), getDirectChildren(), IListRow, isRolledUpPartial(), ListFacet, ListSort, ListView (+3 more)

### Community 65 - "Community 65"
Cohesion: 0.21
Nodes (20): colOf(), IXlColumnDef, NUM, qtyFmt(), XlValue, 00efd39 Refactor Excel export sheets for improved readability and consistency, bc10d67 feat: add pastBidHelpers and pastBidLedger utilities for enhanced past bids functionality, curCode() (+12 more)

### Community 66 - "Community 66"
Cohesion: 0.09
Nodes (17): useDebounce(), BulkAiStatus, createFavoriteGroupAndSave(), DEFAULT_FIELD_LABELS, DocLibraryCatalogProps, EMPTY_META(), FacetKey, findGroupByName() (+9 more)

### Community 67 - "Community 67"
Cohesion: 0.14
Nodes (20): ConfidentialAccessModal(), ConfidentialAccessModalProps, IAccessGroup, IAccessRow, keyOf(), ROLE_TAGS, canManageBidConfidentiality(), canOpenBid() (+12 more)

### Community 68 - "Community 68"
Cohesion: 0.21
Nodes (2): thin(), XlSheet

### Community 69 - "Community 69"
Cohesion: 0.10
Nodes (21): BomCostSource, IBomCostAnalysis, IBomCostItem, BomDateAge, BomItemStatus, calcContingency(), computeSmartTotal(), getAncestorIds() (+13 more)

### Community 70 - "Community 70"
Cohesion: 0.13
Nodes (6): QuotationService, QuotationState, initials(), IQuotationGroup, SupplierDrawer(), SupplierDrawerProps

### Community 71 - "Community 71"
Cohesion: 0.11
Nodes (19): audienceParts(), DeliveryPatch, EVENT_ICONS, GROUP_ICONS, MODE_LABEL, MODES, NotificationDeliveryCard(), NotificationDeliveryCardProps (+11 more)

### Community 72 - "Community 72"
Cohesion: 0.10
Nodes (19): ClarificationSuggestionsModal(), ClarificationSuggestionsModalProps, ExportClarificationModal(), ImportClarificationModal(), ImportQualificationModal(), ImportQualificationModalProps, QualificationsTab(), QualificationsTabProps (+11 more)

### Community 73 - "Community 73"
Cohesion: 0.13
Nodes (20): checksumOf(), fail(), FIX_QUALITY, formatCoord(), INmeaChecksum, INmeaField, INmeaResult, INmeaSummaryItem (+12 more)

### Community 74 - "Community 74"
Cohesion: 0.10
Nodes (18): BID_ROLE_KEYS, buildDefaultRule(), clampDeadlineWarningDays(), DEFAULT_NOTIFICATION_SETTINGS, ENGINEERING_LEADS, INotificationEventDef, KEY_PEOPLE_TEAMS, MODES (+10 more)

### Community 75 - "Community 75"
Cohesion: 0.17
Nodes (2): BidService, prepareForSave()

### Community 76 - "Community 76"
Cohesion: 0.11
Nodes (14): DataTable(), DataTableColumn, DataTableProps, ProgressBar(), ProgressBarProps, SkeletonLoader(), SkeletonLoaderProps, IToolingStat (+6 more)

### Community 77 - "Community 77"
Cohesion: 0.13
Nodes (16): clean(), currencyFmt(), displayDate(), IXlCell, IXlColumn, IXlKpi, IXlPlacedValue, IXlRange (+8 more)

### Community 78 - "Community 78"
Cohesion: 0.15
Nodes (11): MultiSelectDropdown(), PastBidProfileModal(), PastBidProfileModalProps, EMPTY_FILTERS, FACET_VALUES, IPastBidFilters, IPastBidPublishOptions, PastBidKnowledgeService (+3 more)

### Community 79 - "Community 79"
Cohesion: 0.14
Nodes (12): IImportPick, PhotoLightbox(), PhotoLightboxProps, AddFavoriteEquipmentModal(), AddFavoriteEquipmentModalProps, AddMode, destKey(), ICandidate (+4 more)

### Community 80 - "Community 80"
Cohesion: 0.18
Nodes (14): activeColumns(), pickRow(), XL_COLORS, loadExcelJS(), loadLogoDataUrl(), logoUrl, sanitizeFilePart(), exportBomCostsToExcel() (+6 more)

### Community 81 - "Community 81"
Cohesion: 0.18
Nodes (14): DeliverableVisual, ACCENT, buildCard(), buildChart(), buildDeliverable(), buildReport(), buildVideo(), C (+6 more)

### Community 82 - "Community 82"
Cohesion: 0.17
Nodes (7): DivisionWorkloadProps, MonthlyVolumeChartProps, IDashboardData, IDashboardKPI, IDivisionWorkload, IMonthlyVolume, DashboardService

### Community 83 - "Community 83"
Cohesion: 0.19
Nodes (14): bda0c32 style: Improve code formatting and readability across multiple components, FollowUpPage(), isUndecided(), buildWinRateIndex(), clientKey(), fromTally(), getHistoricalWinProbability(), getWinProbability() (+6 more)

### Community 84 - "Community 84"
Cohesion: 0.13
Nodes (12): CountdownTimer(), CountdownTimerProps, PhaseBadge(), PhaseBadgeProps, BarLayout, DueHealth, HEALTH_CLASS, HEALTH_LEGEND (+4 more)

### Community 85 - "Community 85"
Cohesion: 0.18
Nodes (1): DocLibraryCatalogService

### Community 86 - "Community 86"
Cohesion: 0.20
Nodes (14): getPastBidSearchText(), matchesPastBidSearch(), normalizeText(), buildPastBidChatContext(), clean(), countBy(), day(), hasIntent() (+6 more)

### Community 87 - "Community 87"
Cohesion: 0.13
Nodes (11): f672a54 Refactor code structure for improved readability and maintainability, COLOR_THEMES, ColorThemeId, IColorThemeAccents, IColorThemeChartColors, IColorThemeDef, IUpcomingColorTheme, UPCOMING_COLOR_THEMES (+3 more)

### Community 88 - "Community 88"
Cohesion: 0.21
Nodes (10): IAssetCatalogItem, AssetsCatalogPage(), dash(), FacetKey, getStatusClass(), SortOrder, ViewMode, AssetCatalogService (+2 more)

### Community 89 - "Community 89"
Cohesion: 0.20
Nodes (7): AssetItem, deriveTypeRaw(), EasiModulesAdapter, HoursItem, RawRow, ScopeItem, SmartBidDataAdapter

### Community 90 - "Community 90"
Cohesion: 0.18
Nodes (10): BID_ROLE_META, IBidRoleMeta, IMembersData, ITeamMember, BidRole, BusinessLine, IUser, MemberDivision (+2 more)

### Community 91 - "Community 91"
Cohesion: 0.19
Nodes (8): BidExcelSheetKey, IBidExcelExportOptions, IExportColumn, IExportOptions, IExportResult, IExportTab, ExportService, bidToExportRow()

### Community 92 - "Community 92"
Cohesion: 0.18
Nodes (1): FocusController

### Community 93 - "Community 93"
Cohesion: 0.13
Nodes (14): @pnp/sp, SPAttachmentFiles, SPCurrentUser, SPFI, SPFile, SPFiles, SPFolder, SPItem (+6 more)

### Community 94 - "Community 94"
Cohesion: 0.21
Nodes (12): DivisionBadge(), PastBidDrawer(), PastBidDrawerProps, getPastBidYear(), findRelatedBids(), getPastBidKbStatus(), IRelatedBid, lowerSet() (+4 more)

### Community 95 - "Community 95"
Cohesion: 0.14
Nodes (11): EN, IPeoplesoftColumnHeaders, IPeoplesoftConsultingText, IPeoplesoftHelpSection, PEOPLESOFT_TEXT, PEOPLESOFT_TOUR_ORDER, PeoplesoftLang, PeoplesoftSourceKey (+3 more)

### Community 96 - "Community 96"
Cohesion: 0.15
Nodes (13): CatalogSearchBucket, FinancialsActiveRegisteredColumn, FinancialsActiveRegisteredRow, IActiveRegisteredItem, IBomCostResult, IBomSheetItem, IFinancialsActiveRegisteredTab, IMultiSourceResults (+5 more)

### Community 97 - "Community 97"
Cohesion: 0.36
Nodes (1): AiAuthService

### Community 98 - "Community 98"
Cohesion: 0.14
Nodes (7): _arPnIndex, _bumblPnIndex, _bumbrPnIndex, _farPnIndex, MFG_REF_PLACEHOLDERS, _psPnIndex, QueryCatalogState

### Community 99 - "Community 99"
Cohesion: 0.22
Nodes (1): JourneyController

### Community 100 - "Community 100"
Cohesion: 0.31
Nodes (10): RFC-4180, assignParentIds(), cleanCsvValue(), emptyItem(), findColumns(), parseBomCSV(), parseBomExcel(), parseCSVRows() (+2 more)

### Community 101 - "Community 101"
Cohesion: 0.18
Nodes (8): inFlight, needsClarificationLibrarySync(), useClarificationLibrarySync(), ClarificationKnowledgeService, buildLibraryRowsFromBid(), isClarificationLibraryEligible(), buildQualificationLibraryRowsFromBid(), normalizeQualificationTables()

### Community 102 - "Community 102"
Cohesion: 0.29
Nodes (1): ClarificationDbService

### Community 103 - "Community 103"
Cohesion: 0.32
Nodes (2): isNotFound(), QualificationDbService

### Community 104 - "Community 104"
Cohesion: 0.15
Nodes (8): AccessLegend(), AccessMatrix(), AccessMatrixProps, CYCLE, IAccessMatrixGroup, IAccessMatrixItem, LEVEL_LABEL, SuperAdminsCard()

### Community 105 - "Community 105"
Cohesion: 0.20
Nodes (1): SurveyCatalogService

### Community 106 - "Community 106"
Cohesion: 0.38
Nodes (11): buildAssignedNotification(), buildCreatedNotification(), deriveBidNotifications(), fmtDate(), getClosingEventKey(), getNewActivityEntries(), isCanceledStatus(), joinNames() (+3 more)

### Community 107 - "Community 107"
Cohesion: 0.22
Nodes (9): BomAnalysisCard(), IBomAnalysisCardProps, BomQuotationPicker(), IBomQuotationPickerProps, TypeFilter, 4b5d467 feat: add BomQuotationPicker component and related utilities for BOM cost analysis, 93ca809 refactor: improve code formatting for consistency across BOM components and utilities, dateAgeBucket() (+1 more)

### Community 108 - "Community 108"
Cohesion: 0.24
Nodes (8): 14b96c8 feat: implement approval round cancellation feature, IBid, IApprovalChain, IApprovalChainStep, IApprovalSectorGroup, IBidApprovalState, IApprovalRoundTrack, buildRequirementsText()

### Community 109 - "Community 109"
Cohesion: 0.20
Nodes (9): PriorityBadgeProps, ACQUISITION_TYPES, BID_SIZE_COLORS, BID_SIZES, BID_TYPES, DIVISIONS, PRIORITIES, PRIORITY_COLORS (+1 more)

### Community 110 - "Community 110"
Cohesion: 0.36
Nodes (7): DocCatalogType, IDocLibraryItem, IDocLibraryMetadata, DOC_TYPE_CHOICES, findGroupByName(), findSubGroupByName(), withCategory()

### Community 111 - "Community 111"
Cohesion: 0.22
Nodes (8): HistoryTab, TABS, ItemHistoryTab(), average(), LaborTab(), LaborTabProps, buildLaborRows(), ILaborRow

### Community 112 - "Community 112"
Cohesion: 0.27
Nodes (5): BCB_CURRENCY_TYPES, CurrencyService, IBCBCurrencyResponse, IBCBDollarResponse, ICurrencyRate

### Community 113 - "Community 113"
Cohesion: 0.25
Nodes (8): appUrl(), INotificationActor, INotificationPayload, NotificationDispatchService, post(), INotificationEvent, INotificationFact, INotificationPresentation

### Community 114 - "Community 114"
Cohesion: 0.25
Nodes (4): NotificationService, ToastCallback, ToastOptions, ToastType

### Community 115 - "Community 115"
Cohesion: 0.35
Nodes (1): QueryCatalogService

### Community 116 - "Community 116"
Cohesion: 0.25
Nodes (1): CableNetwork

### Community 117 - "Community 117"
Cohesion: 0.47
Nodes (1): FavoritesService

### Community 118 - "Community 118"
Cohesion: 0.47
Nodes (1): LinksRecommendationsService

### Community 119 - "Community 119"
Cohesion: 0.36
Nodes (2): cut(), TechnicalProposalKnowledgeService

### Community 120 - "Community 120"
Cohesion: 0.31
Nodes (1): TemplateService

### Community 121 - "Community 121"
Cohesion: 0.25
Nodes (2): BaseClientSideWebPart, SmartBid20WebPart

### Community 122 - "Community 122"
Cohesion: 0.28
Nodes (1): TrunkNetwork

### Community 123 - "Community 123"
Cohesion: 0.25
Nodes (4): IValidationResult, sanitizeText(), validateBidRequest(), validateRequired()

### Community 124 - "Community 124"
Cohesion: 0.32
Nodes (4): mockRequests, IBidRequest, RequestState, useRequestStore

### Community 125 - "Community 125"
Cohesion: 0.25
Nodes (7): SurveyLinkKind, IGlossaryAnatomy, IGlossaryAnatomySegment, ILocalizedText, ISurveyGlossaryTerm, SurveyGlossaryCategory, SurveyLang

### Community 126 - "Community 126"
Cohesion: 0.36
Nodes (1): ApprovalService

### Community 127 - "Community 127"
Cohesion: 0.39
Nodes (3): BomCostAnalysisService, BomCostAnalysisState, useBomCostAnalysisStore

### Community 128 - "Community 128"
Cohesion: 0.54
Nodes (1): MembersService

### Community 129 - "Community 129"
Cohesion: 0.38
Nodes (5): IQualificationPickGroup, IQualificationPickRow, QualificationGroupList(), QualificationGroupListProps, QualificationSuggestionsModalProps

### Community 130 - "Community 130"
Cohesion: 0.38
Nodes (5): getPhaseConfig(), getPhaseLabel(), getPhaseTasks(), IPhaseTask, PHASES_CONFIG

### Community 131 - "Community 131"
Cohesion: 0.62
Nodes (1): EditControlService

### Community 132 - "Community 132"
Cohesion: 0.40
Nodes (4): BidComments(), BidCommentsProps, PersonaCard(), PersonaCardProps

### Community 133 - "Community 133"
Cohesion: 0.53
Nodes (4): IBidLink, IBidRecommendation, ILinksRecommendationsData, EMPTY_DATA

### Community 134 - "Community 134"
Cohesion: 0.40
Nodes (3): ICONS, Toast, ToastContainerProps

### Community 135 - "Community 135"
Cohesion: 0.40
Nodes (4): ErnDeadlineState, IErn, IErnCreateData, IErnCreateResult

### Community 136 - "Community 136"
Cohesion: 0.40
Nodes (1): SystemConfigService

### Community 137 - "Community 137"
Cohesion: 0.60
Nodes (5): entry(), qualificationEntry(), safe(), topicOf(), truncateTopic()

### Community 138 - "Community 138"
Cohesion: 0.70
Nodes (4): computeSurveyBidIntel(), median(), norm(), percentile()

### Community 139 - "Community 139"
Cohesion: 0.67
Nodes (1): StatusTrackerService

### Community 140 - "Community 140"
Cohesion: 0.67
Nodes (1): ApprovalBadgeProps

### Community 141 - "Community 141"
Cohesion: 0.67
Nodes (1): ApprovalDecisionPanelProps

### Community 142 - "Community 142"
Cohesion: 0.67
Nodes (1): ApprovalMatrixProps

### Community 143 - "Community 143"
Cohesion: 0.67
Nodes (2): MOB_TYPES, RTS_TYPES

### Community 144 - "Community 144"
Cohesion: 0.67
Nodes (1): ExportOptionsProps

### Community 145 - "Community 145"
Cohesion: 1.00
Nodes (1): NotificationLogService

### Community 146 - "Community 146"
Cohesion: 1.00
Nodes (1): MOCK_NOTIFICATIONS

### Community 147 - "Community 147"
Cohesion: 1.00
Nodes (2): exportClarificationsToExcel(), getClarificationExcelFilename()

## Knowledge Gaps
- **1019 isolated node(s):** `document_structure.py — section-aware Markdown chunking for the SmartBid docs in`, `Guards against all-caps noise such as the "X X X X" row of a maintenance     ma`, `A single-level number is indistinguishable from a quantity in a     specificati`, `Digit masking is what catches a running footer, but it also makes a     measure`, `Return (level, title) when the line opens a section, else None.` (+1014 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 58`** (1 nodes): `AIAnalysisService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 68`** (2 nodes): `thin()`, `XlSheet`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 75`** (2 nodes): `BidService`, `prepareForSave()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 85`** (1 nodes): `DocLibraryCatalogService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 92`** (1 nodes): `FocusController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (1 nodes): `AiAuthService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 99`** (1 nodes): `JourneyController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 102`** (1 nodes): `ClarificationDbService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 103`** (2 nodes): `isNotFound()`, `QualificationDbService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 105`** (1 nodes): `SurveyCatalogService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 115`** (1 nodes): `QueryCatalogService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 116`** (1 nodes): `CableNetwork`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 117`** (1 nodes): `FavoritesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 118`** (1 nodes): `LinksRecommendationsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 119`** (2 nodes): `cut()`, `TechnicalProposalKnowledgeService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 120`** (1 nodes): `TemplateService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 121`** (2 nodes): `BaseClientSideWebPart`, `SmartBid20WebPart`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 122`** (1 nodes): `TrunkNetwork`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 126`** (1 nodes): `ApprovalService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 128`** (1 nodes): `MembersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 131`** (1 nodes): `EditControlService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 136`** (1 nodes): `SystemConfigService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 139`** (1 nodes): `StatusTrackerService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 140`** (1 nodes): `ApprovalBadgeProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 141`** (1 nodes): `ApprovalDecisionPanelProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 142`** (1 nodes): `ApprovalMatrixProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 143`** (2 nodes): `MOB_TYPES`, `RTS_TYPES`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 144`** (1 nodes): `ExportOptionsProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 145`** (1 nodes): `NotificationLogService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 146`** (1 nodes): `MOCK_NOTIFICATIONS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 147`** (2 nodes): `exportClarificationsToExcel()`, `getClarificationExcelFilename()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AIAnalysisService` connect `Community 58` to `Community 46`, `Community 72`, `Community 6`, `Community 66`, `Community 31`, `Community 78`, `Community 110`, `Community 41`, `Community 14`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `XlSheet` connect `Community 68` to `Community 38`, `Community 77`, `Community 65`, `Community 80`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `BidService` connect `Community 75` to `Community 41`, `Community 101`, `Community 3`, `Community 13`, `Community 49`, `Community 22`, `Community 21`, `Community 83`, `Community 50`, `Community 89`, `Community 78`, `Community 110`, `Community 56`, `Community 19`, `Community 23`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `document_structure.py — section-aware Markdown chunking for the SmartBid docs in`, `Guards against all-caps noise such as the "X X X X" row of a maintenance     ma`, `A single-level number is indistinguishable from a quantity in a     specificati` to the rest of the system?**
  _1019 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.03492531033031769 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.043201754385964915 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.04085045389393215 - nodes in this community are weakly interconnected._