# SMART BID 2.0 — Audit & TODO Tracker

> **Data:** 07 de Abril de 2026  
> **Status:** Post-Architecture File Creation Audit  
> **Última Atualização:** 09/04/2026

---

## Resumo do Audit

Todos os arquivos listados na **Seção 3** do SMART-BID-2.0-ARCHITECTURE.md foram criados e **conectados**. Mock data mantido como fonte de dados provisória.

### Números

| Categoria          | Total | Usados | NÃO Usados | % Usado |
| ------------------ | ----- | ------ | ---------- | ------- |
| Services           | 16    | 5      | 11         | 31%     |
| Stores             | 7     | 7      | 0          | 100%    |
| Hooks              | 10    | 10     | **0**      | 100%    |
| Components (total) | 57    | 42     | **15**     | 74%     |
| Pages              | 24    | 24     | **0**      | 100%    |
| Data (mock)        | 8     | 8      | 0          | 100%    |
| Utils              | 8     | 8      | **0**      | 100%    |
| Config             | 7     | 7      | 0          | 100%    |

---

## 🔴 PRIORIDADE 1 — AppLayout.tsx (Router)

**Problema:** `AppLayout.tsx` é o roteador principal. Ele usa `PlaceholderPage` para 17 rotas em vez dos componentes de página reais que já existem.

**Status:** ✅ CORRIGIDO

**Ação:** Atualizar `AppLayout.tsx` para importar e usar as páginas reais:

| Rota                    | Antes             | Depois                   |
| ----------------------- | ----------------- | ------------------------ |
| `/requests`             | `PlaceholderPage` | `UnassignedRequestsPage` |
| `/requests/new`         | `PlaceholderPage` | `CreateRequestPage`      |
| `/my-dashboard`         | `PlaceholderPage` | `MyDashboardPage`        |
| `/flowboard`            | `PlaceholderPage` | `FlowBoardPage`          |
| `/timeline`             | `PlaceholderPage` | `TimelinePage`           |
| `/faq`                  | `PlaceholderPage` | `FaqPage`                |
| `/knowledge/:category`  | `PlaceholderPage` | `KnowledgeBasePage`      |
| `/analytics/:view`      | `PlaceholderPage` | `AnalyticsPage`          |
| `/reports/:type`        | `PlaceholderPage` | `ReportsPage`            |
| `/results`              | `PlaceholderPage` | `BidResultsPage`         |
| `/templates`            | `PlaceholderPage` | `TemplatesPage`          |
| `/approvals`            | `PlaceholderPage` | `ApprovalsPage`          |
| `/settings/patch-notes` | `PlaceholderPage` | `PatchNotesPage`         |
| `/tools/favorites`      | `PlaceholderPage` | `FavoritesPage`          |
| `/tools/quotations`     | `PlaceholderPage` | `QuotationsPage`         |
| `/tools/tooling`        | `PlaceholderPage` | `ToolingReportPage`      |
| `/tools/pricing`        | `PlaceholderPage` | `PriceConsultingPage`    |

**Nota adicional sobre rotas Tools:** A rota antiga `/tools/:tool` (wildcard) precisa ser substituída por 4 rotas individuais.

---

## 🟡 PRIORIDADE 2 — DashboardPage Refactor

**Problema:** `DashboardPage.tsx` (~330 linhas) renderiza KPIs, gráficos, atividades e deadlines **inline**, em vez de usar os sub-componentes que já existem.

**Status:** ✅ CORRIGIDO

**Ação realizada:** DashboardPage refatorado para usar sub-componentes. Agora importa e usa:

- `DashboardKPIRow` — KPI cards
- `RecentActivity` — feed de atividades recentes
- `UpcomingDeadlines` — deadlines próximos
- `BidsByStatusChart` — gráfico por status
- `BidsByDivisionChart` — gráfico por divisão
- `ApprovalsPending` — aprovações pendentes
- `useKPIs` hook — cálculos de KPI
- `useCurrentUser` hook — dados do usuário
- `isActiveBid`, `formatCurrencyCompact`, `DIVISION_COLORS` — utils

---

## 🟡 PRIORIDADE 2 — BidDetailPage Decomposition

**Problema:** `BidDetailPage.tsx` (~1200 linhas) era **monolítico** — renderizava todas as 14 tabs inline.

**Status:** ✅ CORRIGIDO

**Ação realizada:** Tab switch agora usa sub-componentes. Inline tabs removidos:

- ✅ `BidEquipmentTable` — substitui ScopeTab
- ✅ `BidHoursTable` — substitui HoursTab
- ✅ `BidCostSummary` — substitui CostTab
- ✅ `BidTaskChecklist` — substitui TasksTab
- ✅ `BidApprovalPanel` — substitui ApprovalTab
- ✅ `BidComments` — substitui CommentsTab
- ✅ `BidActivityLog` — substitui ActivityTab
- ✅ `BidExportButton` — substitui ExportTab

Tabs mantidos inline (sem sub-componente dedicado): OverviewTab, TimelineTab, DocumentsTab, NotesTab, QualificationsTab, AITab.

---

## 🟡 PRIORIDADE 2 — BidTrackerPage Integration

**Problema:** `BidTrackerPage.tsx` renderizava tabela/kanban inline.

**Status:** ✅ CORRIGIDO

**Ação realizada:** BidTrackerPage agora usa:

- ✅ `DataTable` — tabela com sorting
- ✅ `FilterPanel` — painel de filtros com search/division/priority
- ✅ `BidCard` — cards no kanban view
- ✅ `useBids` hook — filteredBids
- ✅ `useDebounce` hook — search debouncing
- ✅ `isActiveBid`, `DIVISION_COLORS`, `DIVISIONS`, `PRIORITIES` — utils/constants

---

## 🟡 PRIORIDADE 2 — Sidebar Decomposition

**Problema:** `Sidebar.tsx` (~560 linhas) renderiza items e submenus inline.

| Componente       | Uso esperado       | Usado? |
| ---------------- | ------------------ | ------ |
| `SidebarItem`    | Item individual    | ✅     |
| `SidebarSubmenu` | Submenu colapsável | ✅     |

**Status:** ✅ CORRIGIDO — Sidebar refatorado para usar SidebarItem + SidebarSubmenu.

---

## 🟢 PRIORIDADE 3 — Hooks não usados

Hooks conectados:

- [x] `useBids` — usado em BidTrackerPage, FlowBoardPage, FavoritesPage, MyDashboardPage + 7 pages
- [x] `useCurrentUser` — usado em DashboardPage, MyDashboardPage, CreateRequestPage
- [x] `useKPIs` — usado em DashboardPage, AnalyticsPage
- [x] `useDebounce` — usado em BidTrackerPage, KnowledgeBasePage, QuotationsPage, PriceConsultingPage
- [x] `useAccessLevel` — usado em ApprovalsPage
- [x] `useResponsive` — usado em Header
- [x] `useRequests` — usado em UnassignedRequestsPage
- [x] `useApprovals` — usado em ApprovalsPage
- [x] `useExport` — usado em ReportsPage
- [x] `useTemplates` — usado em TemplatesPage

**Status:** ✅ TODOS CONECTADOS

---

## 🟢 PRIORIDADE 3 — Services não usados pela UI

3 de 16 services agora conectados, 2 adicionais conectados nesta sessão:

- [x] `MockDataService` — centraliza toda mock data, usado em AppLayout
- [x] `DashboardService` — cálculo de KPIs/workloads, usado em DashboardPage
- [x] `KnowledgeBaseService` — usado em KnowledgeBasePage (com fallback para mock)
- [x] `ExportService` — usado via useExport hook → ReportsPage
- [x] `SPService` — base service, usado por KnowledgeBaseService
- [ ] `ApprovalService` — precisa ser usado por `useApprovals` / `ApprovalsPage`
- [ ] `TemplateService` — precisa ser usado por `useTemplates` / `TemplatesPage`
- [ ] `SystemConfigService` — precisa ser usado por `useConfigStore`
- [ ] `MembersService` — precisa ser usado por `MembersManagement`
- [ ] `ActivityLogService` — precisa ser usado por `BidActivityLog`
- [ ] `StatusTrackerService` — precisa ser usado internamente por outros services
- [ ] `AttachmentService` — precisa ser usado por `FileUpload` e `BidDetailPage`
- [ ] `UserService` — precisa ser usado por `useCurrentUser` / `Header`
- [ ] `NotificationService` — precisa ser usado por `ToastContainer`
- [ ] `RequestService` — precisa ser usado por `useRequests`
- [ ] `BidService` — precisa ser usado por `useBids`

**Ação futura:** Conectar services restantes quando migrar de mock para SharePoint real.

---

## 🟢 PRIORIDADE 3 — Utils não usados

Utils conectados:

- [x] `bidHelpers.ts` — usado por DashboardPage, BidTrackerPage, FlowBoardPage, MyDashboardPage
- [x] `constants.ts` — usado por DashboardPage, BidTrackerPage, FlowBoardPage, TemplatesPage, MyDashboardPage + 5 pages
- [x] `formatters.ts` — usado por 8+ pages (Dashboard, BidResults, Analytics, KnowledgeBase, etc.)
- [x] `statusHelpers.ts` — usado por BidResultsPage
- [x] `accessControl.ts` — usado por useAuthStore (RBAC access map)
- [x] `validators.ts` — usado por CreateRequestPage
- [x] `phaseHelpers.ts` — usado por BidDetailPage
- [x] `exportHelpers.ts` — usado por BidDetailPage, ReportsPage

**Status:** ✅ TODOS CONECTADOS

---

## 🟢 PRIORIDADE 3 — Componentes comuns não usados

| Componente       | Onde é usado                            | Status   |
| ---------------- | --------------------------------------- | -------- |
| `DataTable`      | BidTrackerPage, BidResultsPage, etc.    | ✅ Usado |
| `FilterPanel`    | BidTrackerPage, KnowledgeBasePage       | ✅ Usado |
| `ToastContainer` | AppLayout (global)                      | ✅ Usado |
| `BidCard`        | BidTrackerPage kanban, FavoritesPage    | ✅ Usado |
| `PhaseBadge`     | TimelinePage                            | ✅ Usado |
| `PriorityBadge`  | BidTrackerPage                          | ✅ Usado |
| `DivisionBadge`  | AnalyticsPage, BidResultsPage, etc.     | ✅ Usado |
| `ProgressBar`    | ToolingReportPage, AnalyticsPage        | ✅ Usado |
| `CountdownTimer` | TimelinePage                            | ✅ Usado |
| `EmptyState`     | BidResultsPage, KnowledgeBasePage, etc. | ✅ Usado |
| `SkeletonLoader` | DashboardPage (loading state)           | ✅ Usado |
| `ConfirmDialog`  | CreateRequestPage                       | ✅ Usado |
| `FileUpload`     | CreateRequestPage (attachments)         | ✅ Usado |
| `RichTextEditor` | CreateRequestPage (description)         | ✅ Usado |
| `PersonaCard`    | BidComments                             | ✅ Usado |
| `GlassCard`      | UpcomingDeadlines, RecentActivity, etc. | ✅ Usado |
| `Timeline`       | ApprovalTimeline, BidActivityLog        | ✅ Usado |

---

## 🟢 PRIORIDADE 3 — Config não usados

| Config                 | Onde é usado                             | Status   |
| ---------------------- | ---------------------------------------- | -------- |
| `phases.config.ts`     | phaseHelpers → BidDetailPage             | ✅ Usado |
| `routes.config.ts`     | AppLayout routes                         | ✅ Usado |
| `kpi.config.ts`        | AnalyticsPage overview, DashboardService | ✅ Usado |
| `status.config.ts`     | DashboardPage, FlowBoardPage             | ✅ Usado |
| `navigation.config.ts` | Sidebar                                  | ✅ Usado |
| `app.config.ts`        | AppLayout                                | ✅ Usado |
| `sharepoint.config.ts` | KnowledgeBaseService                     | ✅ Usado |

---

## 🟢 PRIORIDADE 3 — Mock data não usados

Mock data conectados:

- [x] `mockBids.ts` — usado via MockDataService → AppLayout → useBidStore
- [x] `mockNotifications.ts` — usado via MockDataService → AppLayout → useNotificationStore
- [x] `mockRequests.ts` — usado via MockDataService → AppLayout → useRequestStore
- [x] `mockApprovals.ts` — usado em ApprovalsPage via useApprovals
- [x] `mockTemplates.ts` — usado via MockDataService → AppLayout → useTemplateStore
- [x] `mockMembers.ts` — usado em MembersPage, MockDataService
- [x] `mockSystemConfig.ts` — usado em SystemConfigPage
- [x] `mockKnowledgeBase.ts` — usado em KnowledgeBasePage, MockDataService

**Status:** ✅ TODOS CONECTADOS

---

## Arquivos que estão COMPLETOS e OK ✅

### Pre-existing (sem mudanças necessárias):

- ✅ `utils/accessControl.ts` — Completo
- ✅ `utils/bidHelpers.ts` — Completo
- ✅ `utils/constants.ts` — Completo
- ✅ `utils/formatters.ts` — Completo
- ✅ `utils/statusHelpers.ts` — Completo
- ✅ `stores/useAuthStore.ts` — Completo
- ✅ `stores/useBidStore.ts` — Completo
- ✅ `stores/useNotificationStore.ts` — Completo
- ✅ `stores/useUIStore.ts` — Completo
- ✅ `hooks/useAccessLevel.ts` — Completo
- ✅ `hooks/useCurrentUser.ts` — Completo
- ✅ `hooks/useDebounce.ts` — Completo
- ✅ `hooks/useKPIs.ts` — Completo
- ✅ `hooks/useResponsive.ts` — Completo
- ✅ `hooks/useBids.ts` — Parcial (falta TanStack Query, mas funcional)
- ✅ `models/IBid.ts` — Completo
- ✅ `models/IBidStatus.ts` — Completo
- ✅ `models/INotification.ts` — Completo
- ✅ `models/ISystemConfig.ts` — Completo
- ✅ `models/ITeamMember.ts` — Completo
- ✅ `models/IUser.ts` — Completo
- ✅ `models/index.ts` — Completo (exporta todos os 21+ modelos)
- ✅ `config/app.config.ts` — Completo
- ✅ `config/navigation.config.ts` — Completo
- ✅ `config/routes.config.ts` — Completo
- ✅ `config/status.config.ts` — Completo
- ✅ `data/mockBids.ts` — Completo (15+ BIDs)
- ✅ `data/mockMembers.ts` — Completo
- ✅ `data/mockNotifications.ts` — Completo
- ✅ `data/mockSystemConfig.ts` — Completo
- ✅ `data/mockTemplates.ts` — Completo
- ✅ Todos os components/layout — Completos
- ✅ Todos os components/common — Completos
- ✅ Todos os components/bid — Completos
- ✅ Todos os components/approval — Completos
- ✅ Todos os components/template — Completos
- ✅ Todos os components/dashboard — Completos
- ✅ Todos os components/reports — Completos
- ✅ Todos os components/insights — Completos
- ✅ Todos os components/settings — Completos
- ✅ `pages/BidDetailPage.tsx` — Completo (decomposição feita — 8 tabs usam sub-componentes)
- ✅ `pages/NotificationsPage.tsx` — Completo
- ✅ `pages/DashboardPage.tsx` — Refatorado (usa sub-componentes + hooks + utils)
- ✅ `pages/BidTrackerPage.tsx` — Refatorado (usa DataTable + FilterPanel + BidCard + hooks)
- ✅ `pages/UnassignedRequestsPage.tsx` — Implementado (usa DataTable + mockRequests)
- ✅ `pages/ApprovalsPage.tsx` — Implementado (usa mockApprovals com approval chains)
- ✅ `pages/TemplatesPage.tsx` — Implementado (usa MOCK_TEMPLATES + search)
- ✅ `pages/MyDashboardPage.tsx` — Implementado (usa useBids + useCurrentUser)
- ✅ `pages/FlowBoardPage.tsx` — Implementado (kanban por status com BID_STATUSES)
- ✅ `pages/FavoritesPage.tsx` — Implementado (usa BidCard + useBids)

---

## Próximos Passos Recomendados

1. ~~**[FEITO] Corrigir AppLayout.tsx** — Conectar 17 páginas reais às rotas~~
2. ~~**[FEITO] Refatorar DashboardPage** — Usar sub-componentes + useKPIs + useCurrentUser~~
3. ~~**[FEITO] Refatorar BidDetailPage** — Decompor 8 tabs em sub-componentes~~
4. ~~**[FEITO] Refatorar BidTrackerPage** — Integrar DataTable + FilterPanel + useBids + useDebounce~~
5. ~~**[FEITO] Conectar hooks** — Todos os 10 hooks conectados~~
6. ~~**[FEITO] Adicionar ToastContainer** ao AppLayout~~
7. ~~**[FEITO] Wire pages com mock data** — Todas as pages implementadas com dados reais~~
8. ~~**[FEITO] Wire utils** — Todos os 8 utils conectados (accessControl, validators, phaseHelpers, exportHelpers, statusHelpers, formatters, bidHelpers, constants)~~
9. ~~**[FEITO] Wire common components** — SkeletonLoader, PriorityBadge, FileUpload, RichTextEditor, ConfirmDialog, CountdownTimer, PhaseBadge, DivisionBadge, ProgressBar, EmptyState, PersonaCard, GlassCard, Timeline todos conectados~~
10. ~~**[FEITO] Wire Sidebar** — Refatorado com SidebarItem + SidebarSubmenu~~
11. ~~**[FEITO] Wire config files** — routes.config, phases.config, kpi.config todos conectados~~
12. ~~**[FEITO] Wire services** — MockDataService, DashboardService, KnowledgeBaseService, ExportService conectados~~
13. ~~**[FEITO] Wire stores** — useRequestStore, useTemplateStore seeded em AppLayout~~
14. **[PENDENTE] Conectar services SharePoint restantes** — 11 services aguardam integração real com SharePoint
15. **Conectar services** — Hooks devem chamar services para dados reais (PnPjs)
16. **Integrar utils restantes** — statusHelpers, validators, phaseHelpers, accessControl
17. **Implementar pages restantes** — 11 placeholder pages ainda: TimelinePage, AnalyticsPage, ReportsPage, BidResultsPage, KnowledgeBasePage, CreateRequestPage, QuotationsPage, ToolingReportPage, PriceConsultingPage, PatchNotesPage, FaqPage
18. **Refatorar Sidebar** — Usar SidebarItem + SidebarSubmenu sub-componentes
19. **Conectar hooks → stores → services** — useRequests, useApprovals, useTemplates devem usar stores/services em vez de mock data diretamente
