# Graph Report - smartbid2.0  (2026-08-31)

## Corpus Check
- 332 files · ~774,246 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1904 nodes · 5374 edges · 112 communities (85 shown, 27 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fb4fa770`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- models/index.ts
- BidDetailsReportPage.tsx
- useConfigStore
- analyticsHelpers.ts
- DashboardPage.tsx
- BidDetailPage.tsx
- TemplateEditor.tsx
- ProdFlow — CIDEQ Production Management System
- pnp-sp.d.ts
- QualificationsTab.tsx
- compilerOptions
- ApprovalTab.tsx
- GlassCard.tsx
- SystemConfiguration.tsx
- CreateRequestPage.tsx
- IPersonRef
- BidStatusPhasePanel.tsx
- devDependencies
- .eslintrc.js
- solution
- AssetsBreakdownTab.tsx
- PatchNotesPage.tsx
- dependencies
- formatters.ts
- makeId
- CertificationsBreakdownTab.tsx
- sharepoint.config.ts
- useQueryCatalogStore.ts
- costCalculations.ts
- ClarificationsDbPage.tsx
- IBid
- DocLibraryCatalog.tsx
- IBidStatus.ts
- useFavoritesStore.ts
- QueryConsultingPage.tsx
- FavoritesPage.tsx
- PeriodPerformancePage.tsx
- BottleneckAnalysisPage.tsx
- OverviewTab.tsx
- SmartBid 2.0 — Azure AI Backend
- CurrencyService
- TeamAnalyticsPage.tsx
- AppLayout.tsx
- ApprovalStatus
- LinksRecommendationsPage.tsx
- FavoritesService
- BomCostsPage.tsx
- IErn
- ScopeOfSupplyTab.tsx
- ernHelpers.ts
- useCurrentUser
- Sidebar.tsx
- SmartBid20WebPart.manifest.json
- BidActivityLog.tsx
- useSpfxContext
- phaseHelpers.ts
- extract_quotation
- IScopeItem
- xlsx.d.ts
- 21. Roadmap de Implementação (Fases 0–7)
- package.json
- 7. Fluxo Ponta a Ponta
- defaultFavoriteGroups.ts
- NotificationService
- 12. Modelo de Status
- RecentActivity.tsx
- config.json
- copilot-instructions.md
- SmartBid20WebPart
- 17. UI/UX (Design Premium — "UI/UX Pro Max")
- IntegratedDivisionTabs.tsx
- BidTaskChecklist.tsx
- deploy-azure-storage.json
- 01-welcome.json
- 03-approver.json
- 04-final.json
- FaqPage.tsx
- UserService
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
- 10. SLA & Prazos
- 11. Modelo de Dados
- 15. Arquitetura

## God Nodes (most connected - your core abstractions)
1. `IBid` - 101 edges
2. `useConfigStore` - 86 edges
3. `makeId()` - 59 edges
4. `useCurrentUser()` - 46 edges
5. `useBids()` - 36 edges
6. `IScopeItem` - 35 edges
7. `IPersonRef` - 34 edges
8. `formatDate()` - 33 edges
9. `PageHeader()` - 33 edges
10. `BomCostsPage()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `BidCommentsProps` --references--> `IBidComment`  [EXTRACTED]
  src/webparts/smartBid20/app/components/bid/BidComments.tsx → src/webparts/smartBid20/app/models/IBid.ts
- `IPhaseTask` --references--> `BidPhase`  [EXTRACTED]
  src/webparts/smartBid20/app/config/phases.config.ts → src/webparts/smartBid20/app/models/IBidStatus.ts
- `BidPhase` --references--> `FunnelRow`  [EXTRACTED]
  src/webparts/smartBid20/app/models/IBidStatus.ts → src/webparts/smartBid20/app/utils/analyticsHelpers.ts
- `BidPhase` --references--> `HeatmapMatrix`  [EXTRACTED]
  src/webparts/smartBid20/app/models/IBidStatus.ts → src/webparts/smartBid20/app/utils/analyticsHelpers.ts
- `BidPhase` --references--> `PhaseDurationRow`  [EXTRACTED]
  src/webparts/smartBid20/app/models/IBidStatus.ts → src/webparts/smartBid20/app/utils/analyticsHelpers.ts

## Import Cycles
- None detected.

## Communities (112 total, 27 thin omitted)

### Community 0 - "models/index.ts"
Cohesion: 0.06
Nodes (56): HoursRowProps, MOB_TYPES, PreparationMobilizationTabProps, RTS_TYPES, AIAnalysisReviewStatus, IAssetsCostSummary, IAssetSubCost, IAvailabilitySplit (+48 more)

### Community 1 - "BidDetailsReportPage.tsx"
Cohesion: 0.11
Nodes (29): ChartTooltip(), ChartTooltipEntry, ChartTooltipProps, ExportBar(), ExportBarProps, getSectorColor(), useExport(), IExportColumn (+21 more)

### Community 2 - "useConfigStore"
Cohesion: 0.07
Nodes (45): CountdownTimer(), CountdownTimerProps, DataTable(), DataTableColumn, DataTableProps, DivisionBadge(), DivisionBadgeProps, PageHeader() (+37 more)

### Community 3 - "analyticsHelpers.ts"
Cohesion: 0.08
Nodes (51): Sparkline(), SparklineProps, KPICard(), KPICardProps, DashboardKPIRow(), DashboardKPIRowProps, ROUTES, useChartTheme() (+43 more)

### Community 4 - "DashboardPage.tsx"
Cohesion: 0.07
Nodes (43): BidCard(), BidCardProps, BidStatusDropdown(), BidStatusDropdownProps, EmptyState(), EmptyStateProps, FilterPanel(), FilterPanelProps (+35 more)

### Community 5 - "BidDetailPage.tsx"
Cohesion: 0.14
Nodes (17): BidExportButton(), BidExportButtonProps, BidPhaseProgress(), BidPhaseProgressProps, useConfigPhases(), BidDetailPage(), BidTab, EMPTY_HOURS_SUMMARY (+9 more)

### Community 6 - "TemplateEditor.tsx"
Cohesion: 0.06
Nodes (34): BidTemplateImportProps, EditableTabContent(), EditLockBanner(), EditToolbar(), ImportSourceModal(), PriorityBadgeProps, TemplateCard(), TemplateCardProps (+26 more)

### Community 7 - "ProdFlow — CIDEQ Production Management System"
Cohesion: 0.09
Nodes (22): 13. Modelo Financeiro, 14. KPIs (Dashboard), 16. Listas SharePoint & Colunas, 18. Stack Tecnológica, 19. Requisitos Não-Funcionais, 1. Sumário Executivo, 20. Graphify (Grafo de Conhecimento), 22. Verificação / Aceite (+14 more)

### Community 8 - "pnp-sp.d.ts"
Cohesion: 0.05
Nodes (13): @pnp/sp, SPCurrentUser, SPFI, SPFile, SPFiles, SPFolder, SPItem, SPItems (+5 more)

### Community 9 - "QualificationsTab.tsx"
Cohesion: 0.07
Nodes (33): AITab(), AITabProps, ClarificationSuggestionsModal(), ClarificationSuggestionsModalProps, QualificationsTab(), QualificationsTabProps, ACCEPTED_TYPES, AIDocumentAnalyzer() (+25 more)

### Community 10 - "compilerOptions"
Cohesion: 0.05
Nodes (36): dom, es2015.collection, es2015.core, es2015.iterable, es2015.promise, es2016.array.include, es2017.object, es2017.string (+28 more)

### Community 11 - "ApprovalTab.tsx"
Cohesion: 0.11
Nodes (30): ApprovalTab(), ApprovalTabProps, SECTOR_CONFIGS, SectorConfig, STATUS_DISPLAY, BidApprovalPanel(), BidApprovalPanelProps, BY_LABEL (+22 more)

### Community 12 - "GlassCard.tsx"
Cohesion: 0.12
Nodes (18): BidTimeline(), getPhaseTotalHours(), useLiveElapsed(), GlassCard(), GlassCardProps, ApprovalsPending(), ApprovalsPendingProps, BidsByDivisionChart() (+10 more)

### Community 13 - "SystemConfiguration.tsx"
Cohesion: 0.11
Nodes (16): ACCESS_AREAS, ALL_NAV_ITEMS, INavGroup, INavItem, KPI_META, NAV_GROUPS, NOTIFICATION_LABELS, PERM_CYCLE (+8 more)

### Community 14 - "CreateRequestPage.tsx"
Cohesion: 0.06
Nodes (34): ConfirmDialog(), ConfirmDialogProps, FileUpload(), FileUploadProps, PersonaCard(), PersonaCardProps, RichTextEditor(), RichTextEditorProps (+26 more)

### Community 15 - "IPersonRef"
Cohesion: 0.16
Nodes (10): ApprovalMatrixProps, ApprovalRequestCardProps, ApprovalTimelineProps, IApprovalChain, IApprovalChainStep, IApprovalSectorGroup, IBidApprovalState, IBidCommentDef (+2 more)

### Community 16 - "BidStatusPhasePanel.tsx"
Cohesion: 0.18
Nodes (18): BidComments(), BidCommentsProps, BidStatusPhasePanel(), BidStatusPhasePanelProps, AnalysisNotesCard(), OverviewTab(), canStartRevision(), getActiveRevision() (+10 more)

### Community 17 - "devDependencies"
Cohesion: 0.07
Nodes (29): ajv, eslint, eslint-plugin-react-hooks, gulp, @microsoft/eslint-config-spfx, @microsoft/eslint-plugin-spfx, @microsoft/rush-stack-compiler-4.7, @microsoft/sp-build-web (+21 more)

### Community 18 - ".eslintrc.js"
Cohesion: 0.07
Nodes (27): RATIONALE: The "module" keyword is deprecated except when describing legacy…, RATIONALE: This rule warns if setters are defined without getters, which is…, RATIONALE: In TypeScript, if you write x["y"] instead of x.y, it disables type…, RATIONALE: Catches code that is likely to be incorrect, RATIONALE: If you have more than 2,000 lines in a single source file, it's…, RATIONALE: Deprecated language feature., RATIONALE: Eval is a security concern and a performance concern., RATIONALE: System types are global and should not be tampered with in a… (+19 more)

### Community 19 - "solution"
Cohesion: 0.07
Nodes (26): mpnId, name, privacyUrl, termsOfUseUrl, websiteUrl, default, categories, longDescription (+18 more)

### Community 20 - "AssetsBreakdownTab.tsx"
Cohesion: 0.18
Nodes (20): applyContingency(), AssetsBreakdownTab(), AssetsBreakdownTabProps, blankAsset(), blankSubCost(), blankSubItemCost(), blankTransitSubCost(), calcContingencyPct() (+12 more)

### Community 21 - "PatchNotesPage.tsx"
Cohesion: 0.50
Nodes (3): PatchNote, PatchNotes(), PatchNotesPage()

### Community 22 - "dependencies"
Cohesion: 0.08
Nodes (25): date-fns, @fluentui/react, lucide-react, @microsoft/sp-core-library, @microsoft/sp-lodash-subset, @microsoft/sp-webpart-base, dependencies, date-fns (+17 more)

### Community 23 - "formatters.ts"
Cohesion: 0.18
Nodes (15): BidEquipmentTable(), BidEquipmentTableProps, BidHoursTable(), blankHoursItem(), HoursRow(), SectionKey, EditItemModalState, EngineeringHoursSection() (+7 more)

### Community 24 - "makeId"
Cohesion: 0.20
Nodes (14): DocumentsTab(), DocumentsTabProps, EmptySection(), NotesTab(), NotesTabProps, blankConsumable(), blankMob(), blankRTS() (+6 more)

### Community 25 - "CertificationsBreakdownTab.tsx"
Cohesion: 0.24
Nodes (11): blankItem(), blankSection(), CertificationsBreakdownTab(), CertificationsBreakdownTabProps, SECTION_COLORS, blankItem(), LogisticsBreakdownTab(), LogisticsBreakdownTabProps (+3 more)

### Community 26 - "sharepoint.config.ts"
Cohesion: 0.20
Nodes (7): SHAREPOINT_CONFIG, NOTE: This list uses real SharePoint columns (not a JSON blob)., EMPTY_DATA, IPriceEntry, SPService, ChangeType, IStatusTrackerEntry

### Community 27 - "useQueryCatalogStore.ts"
Cohesion: 0.15
Nodes (18): CostSearchModal(), IActiveRegisteredItem, IBomCostResult, IBomSheetItem, IPeopleSoftFinancialsItem, IQueryCatalogData, IRawTabData, IExchangeRate (+10 more)

### Community 28 - "costCalculations.ts"
Cohesion: 0.26
Nodes (21): BidCostSummary(), BidCostSummaryProps, CapexOpexVerticalChart(), applyContingencySplit(), applyContingencyToCost(), buildCostSummary(), calculateAssetsByResourceType(), calculateAssetsTotals() (+13 more)

### Community 29 - "ClarificationsDbPage.tsx"
Cohesion: 0.28
Nodes (6): ClarificationBaseType, IClarificationDbItem, ClarificationsDbPage(), emptyItem(), toDateInput(), ClarificationDbService

### Community 30 - "IBid"
Cohesion: 0.06
Nodes (32): BidTimelineProps, ExportClarificationModal(), ExportClarificationModalProps, ExportMode, DashboardActivityProps, DivisionWorkloadProps, EngHoursRankingProps, ErnDashboardSectionProps (+24 more)

### Community 31 - "DocLibraryCatalog.tsx"
Cohesion: 0.10
Nodes (19): ImportClarificationModal(), ImportClarificationModalProps, toClarificationItem(), DocLibraryCatalog(), DocLibraryCatalogProps, EMPTY_META(), stripExt(), ViewMode (+11 more)

### Community 32 - "IBidStatus.ts"
Cohesion: 0.14
Nodes (18): mockRequests, useRequests(), IBidRequest, IRequestAttachment, IRequestPhase, IBidResultDef, BidPriority, BidResultOutcome (+10 more)

### Community 33 - "useFavoritesStore.ts"
Cohesion: 0.16
Nodes (17): PartNumberAutocomplete(), PartNumberAutocompleteProps, SectionDef, SECTIONS, SOURCE_LABELS, EMPTY_RESULTS, useQuerySearch(), UseQuerySearchOptions (+9 more)

### Community 34 - "QueryConsultingPage.tsx"
Cohesion: 0.16
Nodes (17): applyAllFilters(), applyMultipleFilters(), calcLeadTimeDays(), convertExcelDate(), emptyTabData(), extractBUs(), formatAsUSD(), getPhotoUrl() (+9 more)

### Community 35 - "FavoritesPage.tsx"
Cohesion: 0.17
Nodes (12): AdvancedCatalogSearch(), AdvancedCatalogSearchProps, getPhotoUrl(), TabKey, PhotoLightbox(), PhotoLightboxProps, IFavoriteEquipment, EditEquipmentModal() (+4 more)

### Community 36 - "PeriodPerformancePage.tsx"
Cohesion: 0.13
Nodes (28): categoricalColor(), CHART_SECTIONS, PeriodPerformancePage(), BidTableRow, bidTableRows(), byCommercialRequester(), ClientPerformance, clientPerformanceByDivision() (+20 more)

### Community 37 - "BottleneckAnalysisPage.tsx"
Cohesion: 0.12
Nodes (23): heatColor(), HeatmapColumn, HeatmapGrid(), HeatmapGridProps, hexToRgb(), AIInsightsPanel(), AIInsightsPanelProps, BottleneckAnalysisPage() (+15 more)

### Community 38 - "OverviewTab.tsx"
Cohesion: 0.21
Nodes (7): ErnDetailsModal(), ErnDetailsModalProps, stateColor, APPROVAL_STATUS_DISPLAY, ExchangeRatesCard(), OverviewTabProps, getErnDeadlineState()

### Community 39 - "SmartBid 2.0 — Azure AI Backend"
Cohesion: 0.17
Nodes (11): 1. Two Entra ID app registrations (they are different on purpose), 2. Azure AI Search — the reference index, 3. Function App — the two endpoints, 4. RBAC (replaces API keys / Key Vault), 5. Frontend wiring (after the backend is live), App settings (Configuration → Application settings), Contents, Endpoints (+3 more)

### Community 40 - "CurrencyService"
Cohesion: 0.27
Nodes (5): BCB_CURRENCY_TYPES, CurrencyService, IBCBCurrencyResponse, IBCBDollarResponse, ICurrencyRate

### Community 41 - "TeamAnalyticsPage.tsx"
Cohesion: 0.10
Nodes (24): ProgressBar(), ProgressBarProps, SkeletonLoader(), SkeletonLoaderProps, AnalyticsFilterBar(), AnalyticsFilterBarProps, PRESETS, MultiSelectDropdown() (+16 more)

### Community 42 - "AppLayout.tsx"
Cohesion: 0.11
Nodes (26): Toast, ToastContainer(), ToastContainerProps, AppLayout(), RequireEngineering(), CommandPalette(), ICommandItem, Footer() (+18 more)

### Community 43 - "ApprovalStatus"
Cohesion: 0.29
Nodes (6): ApprovalBadgeProps, mockApprovals, IApprovalFlow, IApprovalFlowChain, IApprovalFlowStep, ApprovalStatus

### Community 44 - "LinksRecommendationsPage.tsx"
Cohesion: 0.27
Nodes (8): IBidLink, IBidRecommendation, ILinksRecommendationsData, LinkModal, LinksRecommendationsPage(), RecModal, EMPTY_DATA, LinksRecommendationsService

### Community 46 - "BomCostsPage.tsx"
Cohesion: 0.06
Nodes (54): AddQuotationModal(), AddQuotationModalProps, blankLineItem(), genId(), ILineItem, isAiConfigured(), IActivityLog, IActivityLogEntry (+46 more)

### Community 47 - "IErn"
Cohesion: 0.21
Nodes (9): useErn(), UseErnResult, ErnDeadlineState, IErn, IErnCreateData, IErnCreateResult, ErnService, ErnState (+1 more)

### Community 48 - "ScopeOfSupplyTab.tsx"
Cohesion: 0.18
Nodes (13): EquipmentImportModal(), EquipmentImportModalProps, IImportSubItem, TabDef, TabId, TABS, blankItem(), blankSection() (+5 more)

### Community 49 - "ernHelpers.ts"
Cohesion: 0.17
Nodes (19): ErnCreateModal(), ErnCreateModalProps, personToPicked(), toInputDate(), ernNum(), ErnSearchModal(), ErnSearchModalProps, ERN_REVISION_REASONS (+11 more)

### Community 50 - "useCurrentUser"
Cohesion: 0.16
Nodes (18): useCurrentUser(), useIsGuest(), IUser, UserRole, DatasheetsPage(), FavoritesPage(), ManualsCatalogsPage(), AuthState (+10 more)

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

### Community 57 - "IScopeItem"
Cohesion: 0.17
Nodes (19): BidHoursTableProps, ScopeOfSupplyTabProps, HoursCategory, HoursImportPreview(), HoursImportPreviewProps, SelectionState, IImportSource, ImportSourceList() (+11 more)

### Community 58 - "xlsx.d.ts"
Cohesion: 0.17
Nodes (4): CellObject, WorkBook, WorkSheet, xlsx

### Community 59 - "21. Roadmap de Implementação (Fases 0–7)"
Cohesion: 0.22
Nodes (9): 21. Roadmap de Implementação (Fases 0–7), Fase 0 — Fundação & Scaffold, Fase 1 — Domínio & Camada de Dados, Fase 2 — FID & Orçamentação, Fase 3 — Fabricação & Montagem, Fase 4 — QR Code / Smart Labels, Fase 5 — Dashboards, Planner & Gantt, Fase 6 — Config, Members, Notificações & RBAC (+1 more)

### Community 60 - "package.json"
Cohesion: 0.18
Nodes (10): engines, node, main, name, private, scripts, build, clean (+2 more)

### Community 61 - "7. Fluxo Ponta a Ponta"
Cohesion: 0.33
Nodes (6): 7.1 Fase 1 — Orçamentação, 7.2 Fase 2 — Fabricação & Montagem (WO-cêntrica), 7.3 Kanban atual (referência — NÃO copiar), 7.4 Roteiro por sub-item (cada sub-item, um caminho — times diferentes), 7.5 Import & Mapeamento da BOM (PLM / Windchill), 7. Fluxo Ponta a Ponta

### Community 62 - "defaultFavoriteGroups.ts"
Cohesion: 0.53
Nodes (4): getDefaultFavoriteGroups(), makeGroup(), nextId(), DEFAULT_SYSTEM_CONFIG

### Community 63 - "NotificationService"
Cohesion: 0.25
Nodes (4): NotificationService, ToastCallback, ToastOptions, ToastType

### Community 64 - "12. Modelo de Status"
Cohesion: 0.50
Nodes (4): 12.1 FID (macro) — máquina de estados, 12.2 Sub-item — por fase e dependente do Make/Buy, 12.3 Checklists de micro-etapas (com data + autor), 12. Modelo de Status

### Community 65 - "RecentActivity.tsx"
Cohesion: 0.24
Nodes (5): RecentActivityProps, TYPE_COLORS, MOCK_NOTIFICATIONS, INotification, NotificationState

### Community 66 - "config.json"
Cohesion: 0.22
Nodes (8): bundles, smart-bid-20-web-part, externals, localizedResources, SmartBid20WebPartStrings, $schema, components, version

### Community 69 - "17. UI/UX (Design Premium — "UI/UX Pro Max")"
Cohesion: 0.50
Nodes (4): 17.1 QR Code / Smart Labels, 17.2 Dashboards & Gráficos, 17.3 Demo de conceito (aprovação), 17. UI/UX (Design Premium — "UI/UX Pro Max")

### Community 70 - "IntegratedDivisionTabs.tsx"
Cohesion: 0.32
Nodes (7): IntegratedDivision, IntegratedDivisionTabs(), IntegratedDivisionTabsProps, OPG_SERVICE_LINES, resolveTabs(), tabBarStyle, tabStyle()

### Community 71 - "BidTaskChecklist.tsx"
Cohesion: 0.67
Nodes (3): BidTaskChecklist(), BidTaskChecklistProps, IBidTask

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

### Community 76 - "FaqPage.tsx"
Cohesion: 0.50
Nodes (3): FAQ_ITEMS, FaqPage(), IFaqItem

### Community 78 - "serve.json"
Cohesion: 0.40
Nodes (4): https, initialPage, port, $schema

### Community 79 - "02-status.json"
Cohesion: 0.40
Nodes (4): body, $schema, type, version

### Community 107 - "10. SLA & Prazos"
Cohesion: 0.67
Nodes (3): 10.1 SLA de resposta do orçamento (meta interna — apresentar orçamento à Petrobras), 10.2 Prazo de entrega da fabricação (cotado no orçamento), 10. SLA & Prazos

### Community 108 - "11. Modelo de Dados"
Cohesion: 0.67
Nodes (3): 11.1 Interfaces TypeScript (esboço para bootstrap), 11.2 Mapeamento com a planilha de controle atual (~40 colunas), 11. Modelo de Dados

### Community 109 - "15. Arquitetura"
Cohesion: 0.67
Nodes (3): 15.1 Estrutura de Pastas & Organização do Código, 15.2 Customização do Agente (`.github`) — copilot-instructions, AGENTS & skill `ui-ux-pro-max`, 15. Arquitetura

## Knowledge Gaps
- **458 isolated node(s):** `Plano de Projeto & Especificação Técnica (documento autocontido para bootstrap)`, `1. Sumário Executivo`, `2. Contexto de Negócio`, `3. Identidade do Produto`, `4. Atores / Times / Papéis` (+453 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useConfigStore` connect `useConfigStore` to `BidDetailsReportPage.tsx`, `analyticsHelpers.ts`, `DashboardPage.tsx`, `BidDetailPage.tsx`, `TemplateEditor.tsx`, `QualificationsTab.tsx`, `GlassCard.tsx`, `SystemConfiguration.tsx`, `CreateRequestPage.tsx`, `BidStatusPhasePanel.tsx`, `AssetsBreakdownTab.tsx`, `formatters.ts`, `CertificationsBreakdownTab.tsx`, `useQueryCatalogStore.ts`, `QueryConsultingPage.tsx`, `FavoritesPage.tsx`, `PeriodPerformancePage.tsx`, `BottleneckAnalysisPage.tsx`, `OverviewTab.tsx`, `TeamAnalyticsPage.tsx`, `AppLayout.tsx`, `BomCostsPage.tsx`, `ScopeOfSupplyTab.tsx`, `ernHelpers.ts`, `useCurrentUser`, `IScopeItem`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `IBid` connect `IBid` to `models/index.ts`, `BidDetailsReportPage.tsx`, `useConfigStore`, `analyticsHelpers.ts`, `DashboardPage.tsx`, `BidDetailPage.tsx`, `QualificationsTab.tsx`, `ApprovalTab.tsx`, `GlassCard.tsx`, `IPersonRef`, `BidStatusPhasePanel.tsx`, `makeId`, `sharepoint.config.ts`, `costCalculations.ts`, `IBidStatus.ts`, `FavoritesPage.tsx`, `PeriodPerformancePage.tsx`, `OverviewTab.tsx`, `TeamAnalyticsPage.tsx`, `ApprovalStatus`, `ernHelpers.ts`, `phaseHelpers.ts`, `IScopeItem`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `makeId()` connect `makeId` to `models/index.ts`, `IBidStatus.ts`, `FavoritesPage.tsx`, `BidDetailPage.tsx`, `TemplateEditor.tsx`, `QualificationsTab.tsx`, `AppLayout.tsx`, `LinksRecommendationsPage.tsx`, `ScopeOfSupplyTab.tsx`, `useCurrentUser`, `AssetsBreakdownTab.tsx`, `IBid`, `formatters.ts`, `IScopeItem`, `CertificationsBreakdownTab.tsx`, `DocLibraryCatalog.tsx`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `Plano de Projeto & Especificação Técnica (documento autocontido para bootstrap)`, `1. Sumário Executivo`, `2. Contexto de Negócio` to the rest of the system?**
  _458 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `models/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.061072261072261075 - nodes in this community are weakly interconnected._
- **Should `BidDetailsReportPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11341463414634147 - nodes in this community are weakly interconnected._
- **Should `useConfigStore` be split into smaller, more focused modules?**
  _Cohesion score 0.06873706004140787 - nodes in this community are weakly interconnected._