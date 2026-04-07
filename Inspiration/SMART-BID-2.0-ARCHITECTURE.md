# SMART BID 2.0 — Arquitetura Completa

> **Versão:** 2.0  
> **Data:** 02 de Abril de 2026  
> **Autor:** Raphael Costa  
> **Status:** Architecture Review  
> **Projeto Base:** SmartFlow Warehouse (mesmos padrões de serviço, JSON storage, SPFx deploy)  
> **SharePoint Site:** `https://oceaneering.sharepoint.com/sites/G-OPGSSRBrazilEngineering`

---

## 1. Visão Geral da Arquitetura

O **SMART BID 2.0** é a plataforma de gestão de propostas comerciais (BIDs) da **Oceaneering Brasil**, área de Engenharia. A Engenharia suporta o time Comercial com análise técnica e levantamento de custos para BIDs.

**Escopo do sistema:** O Smart BID foca no levantamento e compilação de custos (horas, assets, recursos). **NÃO** envolve preço final para o cliente — margem, markup e pricing são responsabilidade exclusiva do time Comercial, fora do sistema. Após a entrega dos custos compilados, o sistema provê uma página de **Follow-Up / BID Results** para rastrear o resultado comercial (ganhou, perdeu, cancelado, etc.).

**Fluxo principal:**

```
Comercial cria demanda → Engenharia analisa documentação → Levanta custos
(horas + assets) → Revisa → Aprovação dos stakeholders → Compila e devolve
ao Comercial → Follow-Up do resultado
```

### Decisões Arquiteturais

| Decisão           | Escolha                              | Justificativa                                  |
| ----------------- | ------------------------------------ | ---------------------------------------------- |
| **Storage**       | SharePoint Lists + JSON blobs        | Padrão SmartFlow comprovado, sem backend extra |
| **Frontend**      | React 18 + TypeScript + Vite         | Modern DX, HMR rápido, build otimizado         |
| **Deploy**        | SPFx Web Part wrapper                | Integração nativa SharePoint Online            |
| **State**         | Zustand                              | Leve, TypeScript-first, sem boilerplate        |
| **Data Fetching** | TanStack Query + PnPjs v3            | Cache, retry, invalidation automática          |
| **UI Library**    | Shadcn/UI + Radix UI + Tailwind      | Composable, acessível, customizável            |
| **Services**      | Static Singletons (padrão SmartFlow) | Consistência com projeto existente             |

### Componentes SmartFlow de Referência

Os seguintes componentes do SmartFlow Warehouse servem como **base estrutural e de padrões** para o Smart BID 2.0. Não são copiados diretamente — são adaptados para o contexto de BIDs:

| Componente SmartFlow      | Linhas | Serve de base para                                    | Padrões a reutilizar                                                                                                                                                                   |
| ------------------------- | ------ | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MembersManagement.tsx`   | 1334   | Members Management page, BID Detail (People sections) | Gradient header, stat cards por categoria, People Picker + Graph photo, add/edit dialogs, access level checks, super admin bypass, duplicate detection, role badge bucket/pool UI      |
| `OrderDetailsModal.tsx`   | 625    | BID Detail → tabs Timeline & Activity Log             | Timeline horizontal com step circles + status icons, SVG connectors, duration calculations, tabelas de histórico, seções condicionais (On Hold, Complaints → Approvals, BID Notes)     |
| `SystemConfiguration.tsx` | 2584   | System Configuration page (22+ tabs)                  | Tab button navigation (não Pivot), Panel edit CRUD, temp state pattern, notification matrix por role, access level grid (roles × pages), IConfigOption CRUD, manager-only guards       |
| `FlowBoard.tsx`           | 756    | FlowBoard page                                        | Kanban colunas drag-drop, auto-refresh 30s, smart sorting (overdue → priority → date), dark/light toggle, mobile responsive com column selector, photo map, sessionStorage persistence |
| `DashboardRouter.tsx`     | 227    | Dashboard routing por role                            | Switch por `teamCategory`, Guest mode com dashboard selector, Spinner while loading user                                                                                               |

---

## 2. Tech Stack

```
Framework:          React 18+ com TypeScript (strict mode)
Build:              Vite 5+
State Management:   Zustand
Routing:            React Router v6 (lazy loading por rota)
Styling:            Tailwind CSS 3+ com CSS Modules (escopo local quando necessário)
UI Components:      Shadcn/UI + Radix UI primitives
Charts:             Recharts
Tables:             TanStack Table v8
Forms:              React Hook Form + Zod
Data Fetching:      TanStack Query (React Query v5)
Drag & Drop:        @dnd-kit/core + @dnd-kit/sortable
Excel:              SheetJS (xlsx)
PDF:                jsPDF + jspdf-autotable
Icons:              Lucide React
Dates:              date-fns
Animations:         Framer Motion
Linting:            ESLint + Prettier
Testing:            Vitest + Testing Library
SharePoint:         PnPjs v3 (@pnp/sp, @pnp/graph)
SPFx:               SPFx 1.20+ (production wrapper only)
```

---

## 3. Estrutura de Pastas do Projeto

```
smart-bid-2.0/
├── .github/
│   └── instructions/
│       └── copilot-instructions.md          # Instruções para AI assistants
│
├── .vscode/
│   └── settings.json                        # Config do editor
│
├── public/
│   ├── favicon.ico
│   └── oceaneering-logo.svg
│
├── src/
│   ├── index.tsx                            # Entry point React
│   ├── App.tsx                              # Root: providers, router, layout
│   ├── vite-env.d.ts                        # Vite type declarations
│   │
│   ├── assets/                              # Imagens, SVGs, fontes
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── config/                              # Constantes e configuração
│   │   ├── app.config.ts                    # App settings, URLs, feature flags
│   │   ├── routes.config.ts                 # Route definitions
│   │   ├── sharepoint.config.ts             # List names, site URLs, library names
│   │   ├── navigation.config.ts             # Sidebar menu items
│   │   ├── status.config.ts                 # BID status definitions, cores, ícones
│   │   ├── phases.config.ts                 # BID phases + RACI tasks mapping
│   │   └── kpi.config.ts                    # KPI definitions e targets default
│   │
│   ├── models/                              # TypeScript interfaces e tipos
│   │   ├── IBid.ts                          # Interface central do BID (completa)
│   │   ├── IBidRequest.ts                   # Solicitação do comercial
│   │   ├── IBidStatus.ts                    # Enums de status e fase
│   │   ├── IBidTask.ts                      # Tasks da RACI
│   │   ├── IBidApproval.ts                  # Sistema de aprovação
│   │   ├── IBidEquipment.ts                 # Equipamentos/assets (CAPEX/OPEX, quantities)
│   │   ├── IBidHours.ts                     # Horas: Engineering, Onshore, Offshore + phases
│   │   ├── IBidCost.ts                      # Cost summary compilado
│   │   ├── IBidOpportunityInfo.ts           # Info da oportunidade (Region, Vessel, PTAX...)
│   │   ├── IBidComment.ts                   # Comentários com timestamp, autor, seção
│   │   ├── IBidResult.ts                    # Follow-up / resultado do BID
│   │   ├── IBidTemplate.ts                  # Templates de equipamento
│   │   ├── IBidExport.ts                    # Tipos para exportação multi-tab
│   │   ├── IBidNotes.ts                     # Notas de análise freeform (Gap Analysis, Qualifications, etc.)
│   │   ├── ISystemConfig.ts                 # Config do sistema (expandido)
│   │   ├── ITeamMember.ts                   # Membros da equipe
│   │   ├── IActivityLog.ts                  # Log de atividades
│   │   ├── INotification.ts                 # Notificações
│   │   ├── IDashboard.ts                    # KPIs e métricas
│   │   ├── IApprovalFlow.ts                 # Fluxo de aprovação
│   │   ├── IKnowledgeBase.ts                # Knowledge base items
│   │   ├── IUser.ts                         # Usuário logado e perfil
│   │   └── index.ts                         # Barrel export
│   │
│   ├── services/                            # Static singleton services (padrão SmartFlow)
│   │   ├── SPService.ts                     # Base: PnPjs v3 wrapper, init com context
│   │   ├── BidService.ts                    # CRUD principal de BIDs (JSON ↔ SharePoint)
│   │   ├── RequestService.ts                # Operações em solicitações (create, assign, reject)
│   │   ├── ApprovalService.ts               # Criar, enviar, processar aprovações
│   │   ├── TemplateService.ts               # CRUD de templates de equipamento
│   │   ├── SystemConfigService.ts           # Config do sistema (cache 5min, padrão SF)
│   │   ├── MembersService.ts                # CRUD de membros (padrão SmartFlow)
│   │   ├── ActivityLogService.ts            # Log de atividades in-app (padrão SF)
│   │   ├── StatusTrackerService.ts          # Notificações Power Automate (padrão SF)
│   │   ├── ExportService.ts                 # Export Excel/PDF/Print (padrão SF melhorado)
│   │   ├── AttachmentService.ts             # Upload/download arquivos (padrão SF)
│   │   ├── UserService.ts                   # Graph API: foto, perfil, presença
│   │   ├── NotificationService.ts           # Toasts in-app (padrão SF)
│   │   ├── KnowledgeBaseService.ts          # Datasheets, Past Bids, Manuals
│   │   ├── DashboardService.ts              # Cálculo de KPIs e métricas
│   │   └── MockDataService.ts               # Mock data para dev e Guest Mode
│   │
│   ├── stores/                              # Zustand stores
│   │   ├── useBidStore.ts                   # BIDs state (list, filters, selected)
│   │   ├── useRequestStore.ts               # Requests state
│   │   ├── useAuthStore.ts                  # User auth, role, permissions
│   │   ├── useUIStore.ts                    # Sidebar, theme, modals, command palette
│   │   ├── useNotificationStore.ts          # Notificações e toasts
│   │   ├── useConfigStore.ts                # System config cache
│   │   └── useTemplateStore.ts              # Templates de equipamento
│   │
│   ├── hooks/                               # Custom React hooks
│   │   ├── useBids.ts                       # TanStack Query wrapper para BIDs
│   │   ├── useRequests.ts                   # TanStack Query wrapper para Requests
│   │   ├── useApprovals.ts                  # Hook de aprovações
│   │   ├── useCurrentUser.ts                # Usuário logado + role
│   │   ├── useAccessLevel.ts                # RBAC check hook
│   │   ├── useResponsive.ts                 # Breakpoint detection
│   │   ├── useDebounce.ts                   # Debounce para search
│   │   ├── useKPIs.ts                       # Cálculo de KPIs
│   │   ├── useExport.ts                     # Hook de exportação
│   │   └── useTemplates.ts                  # Hook de templates
│   │
│   ├── components/                          # Componentes React
│   │   │
│   │   ├── layout/                          # Layout global
│   │   │   ├── AppLayout.tsx                # Shell: sidebar + header + content + footer
│   │   │   ├── Header.tsx                   # Search bar, notif bell, user avatar
│   │   │   ├── Sidebar.tsx                  # Navegação principal (expandir/colapsar)
│   │   │   ├── SidebarItem.tsx              # Item individual com badge/tooltip
│   │   │   ├── SidebarSubmenu.tsx           # Submenu colapsável
│   │   │   ├── Footer.tsx                   # Copyright, versão, região
│   │   │   ├── CommandPalette.tsx           # Ctrl+K busca global fuzzy
│   │   │   └── GuestModeBanner.tsx          # Banner modo demo
│   │   │
│   │   ├── common/                          # Componentes reutilizáveis
│   │   │   ├── KPICard.tsx                  # Card KPI com animated counter + sparkline
│   │   │   ├── StatusBadge.tsx              # Badge colorido por status
│   │   │   ├── PhaseBadge.tsx               # Badge de fase do BID
│   │   │   ├── PriorityBadge.tsx            # Badge de prioridade (pulsante se urgent)
│   │   │   ├── DivisionBadge.tsx            # Badge da divisão (OPG, SSR-*)
│   │   │   ├── ProgressBar.tsx              # Barra de progresso por fase
│   │   │   ├── CountdownTimer.tsx           # Contagem regressiva para deadline
│   │   │   ├── PersonaCard.tsx              # Avatar + nome + cargo (Graph photo)
│   │   │   ├── DataTable.tsx                # Wrapper TanStack Table com sorting/filter
│   │   │   ├── FilterPanel.tsx              # Painel de filtros expansível (padrão SF)
│   │   │   ├── PageHeader.tsx               # Gradient header com ícone e título
│   │   │   ├── EmptyState.tsx               # Ilustração + CTA para estados vazios
│   │   │   ├── SkeletonLoader.tsx           # Shimmer loading states
│   │   │   ├── ConfirmDialog.tsx            # Modal de confirmação
│   │   │   ├── FileUpload.tsx               # Drag & drop upload (padrão SF)
│   │   │   ├── RichTextEditor.tsx           # Editor de texto para descrições
│   │   │   ├── Timeline.tsx                 # Timeline vertical de atividades
│   │   │   ├── GlassCard.tsx                # Card com glass morphism
│   │   │   └── ToastContainer.tsx           # Container para toasts
│   │   │
│   │   ├── bid/                             # Componentes específicos de BID
│   │   │   ├── BidCard.tsx                  # Card do BID (kanban/list)
│   │   │   ├── BidStatusDropdown.tsx        # Dropdown de status com cores
│   │   │   ├── BidPhaseProgress.tsx         # Progresso visual das 5 fases
│   │   │   ├── BidEquipmentTable.tsx        # Tabela de equipamentos/assets
│   │   │   ├── BidHoursTable.tsx            # Tabela de horas estimadas
│   │   │   ├── BidCostSummary.tsx           # Resumo de custos
│   │   │   ├── BidApprovalPanel.tsx         # Painel de aprovações com status
│   │   │   ├── BidComments.tsx              # Seção de comentários
│   │   │   ├── BidActivityLog.tsx           # Timeline de atividades do BID
│   │   │   ├── BidTaskChecklist.tsx         # Checklist de tasks RACI
│   │   │   ├── BidExportButton.tsx          # Botão exportar (Excel, PDF)
│   │   │   └── BidTemplateImport.tsx        # Modal para importar template
│   │   │
│   │   ├── approval/                        # Componentes do sistema de aprovação
│   │   │   ├── ApprovalRequestCard.tsx      # Card de solicitação de aprovação
│   │   │   ├── ApprovalDecisionPanel.tsx    # Painel approve/reject/revision
│   │   │   ├── ApprovalTimeline.tsx         # Timeline de aprovações
│   │   │   ├── ApprovalMatrix.tsx           # Matriz stakeholders × decisões
│   │   │   └── ApprovalBadge.tsx            # Badge status da aprovação
│   │   │
│   │   ├── template/                        # Componentes de templates
│   │   │   ├── TemplateCard.tsx             # Card de template
│   │   │   ├── TemplateEditor.tsx           # Editor de template (equipamentos)
│   │   │   ├── TemplatePreview.tsx          # Preview antes de importar
│   │   │   └── TemplateImportWizard.tsx     # Wizard de importação para BID
│   │   │
│   │   ├── dashboard/                       # Componentes de dashboard
│   │   │   ├── DashboardKPIRow.tsx          # Linha de KPI cards
│   │   │   ├── RecentActivity.tsx           # Timeline recente
│   │   │   ├── BidsByStatusChart.tsx        # Gráfico barras por status
│   │   │   ├── BidsByDivisionChart.tsx      # Gráfico donut por divisão
│   │   │   ├── MonthlyVolumeChart.tsx       # Gráfico linhas volume mensal
│   │   │   ├── UpcomingDeadlines.tsx        # Lista de deadlines
│   │   │   ├── DivisionWorkload.tsx         # Cards de carga por divisão
│   │   │   └── ApprovalsPending.tsx         # Aprovações pendentes no dash
│   │   │
│   │   ├── reports/                         # Componentes de relatórios
│   │   │   ├── ReportsDashboard.tsx         # Hub de relatórios
│   │   │   ├── PeriodPerformanceReport.tsx  # Relatório por período
│   │   │   ├── BidDetailsReport.tsx         # Relatório detalhado de BID
│   │   │   ├── OperationalSummaryReport.tsx # Resumo operacional
│   │   │   └── ExportOptions.tsx            # Opções de exportação
│   │   │
│   │   ├── insights/                        # Analytics avançado
│   │   │   ├── PerformanceTrends.tsx        # Tendências de performance
│   │   │   ├── BottleneckAnalysis.tsx       # Análise de gargalos
│   │   │   └── TeamAnalytics.tsx            # Analytics por equipe
│   │   │
│   │   └── settings/                        # Configurações
│   │       ├── SystemConfiguration.tsx      # Config tabs (padrão SF expandido)
│   │       ├── MembersManagement.tsx        # Gestão de membros (padrão SF)
│   │       ├── ApprovalRulesConfig.tsx      # Config de regras de aprovação
│   │       └── PatchNotes.tsx               # Histórico de versões
│   │
│   ├── pages/                               # Page components (lazy loaded)
│   │   ├── DashboardPage.tsx                # / — Dashboard principal com KPIs
│   │   ├── BidTrackerPage.tsx               # /tracker — Kanban/List/Table
│   │   ├── BidDetailPage.tsx                # /bid/:id — Detalhe completo do BID
│   │   ├── UnassignedRequestsPage.tsx       # /requests — Solicitações pendentes
│   │   ├── CreateRequestPage.tsx            # /requests/new — Wizard nova solicitação
│   │   ├── MyDashboardPage.tsx              # /my-dashboard — Dashboard pessoal
│   │   ├── FlowBoardPage.tsx                # /flowboard — Kanban panorâmico (do SmartFlow)
│   │   ├── TimelinePage.tsx                 # /timeline — Visão Gantt/Timeline
│   │   ├── ApprovalsPage.tsx                # /approvals — Central de aprovações
│   │   ├── BidResultsPage.tsx               # /results — Follow-up / outcomes dos BIDs
│   │   ├── TemplatesPage.tsx                # /templates — Biblioteca de templates
│   │   ├── NotificationsPage.tsx            # /notifications — Central de notificações
│   │   ├── KnowledgeBasePage.tsx            # /knowledge/:category — Base de conhecimento
│   │   ├── AnalyticsPage.tsx                # /analytics/:view — Analytics expandido
│   │   ├── ReportsPage.tsx                  # /reports/:type — Relatórios e export
│   │   ├── FavoritesPage.tsx                # /tools/favorites — BIDs favoritos
│   │   ├── QuotationsPage.tsx               # /tools/quotations — Cotações
│   │   ├── ToolingReportPage.tsx            # /tools/tooling — Relatório de tooling
│   │   ├── PriceConsultingPage.tsx          # /tools/pricing — Consulta de preços
│   │   ├── SystemConfigPage.tsx             # /settings/config — Configuração
│   │   ├── MembersPage.tsx                  # /settings/members — Membros
│   │   ├── PatchNotesPage.tsx               # /settings/patch-notes — Versões
│   │   └── FaqPage.tsx                      # /faq — FAQ & Instruções
│   │
│   ├── styles/                              # Estilos globais
│   │   ├── globals.css                      # Reset, variáveis CSS, tipografia
│   │   ├── animations.css                   # Keyframes Framer Motion + CSS
│   │   ├── themes/
│   │   │   ├── dark.css                     # Variáveis dark mode
│   │   │   └── light.css                    # Variáveis light mode
│   │   └── sharepoint-overrides.css         # Override Chrome SP, full-width
│   │
│   ├── utils/                               # Funções utilitárias
│   │   ├── formatters.ts                    # Data, moeda, números
│   │   ├── validators.ts                    # Validações Zod schemas
│   │   ├── bidHelpers.ts                    # Helpers específicos de BID
│   │   ├── statusHelpers.ts                 # Cores, ícones por status
│   │   ├── phaseHelpers.ts                  # Helpers de fases RACI
│   │   ├── accessControl.ts                 # RBAC utility functions
│   │   ├── exportHelpers.ts                 # Formatação para export
│   │   └── constants.ts                     # Constantes globais
│   │
│   └── data/                                # Mock data (dev + Guest Mode)
│       ├── mockBids.ts                      # 15+ BIDs realistas
│       ├── mockRequests.ts                  # 5+ requests pendentes
│       ├── mockMembers.ts                   # 20+ membros por categoria
│       ├── mockTemplates.ts                 # 5+ templates de equipamento
│       ├── mockApprovals.ts                 # Aprovações exemplo
│       ├── mockNotifications.ts             # Notificações exemplo
│       ├── mockKnowledgeBase.ts             # Items da KB
│       └── mockSystemConfig.ts              # Config padrão
│
├── spfx-wrapper/                            # SPFx project para deploy em produção
│   ├── config/
│   ├── src/
│   │   └── webparts/
│   │       └── smartBid/
│   │           ├── SmartBidWebPart.ts       # Entry point SPFx
│   │           └── SmartBidWebPart.manifest.json
│   ├── gulpfile.js
│   ├── tsconfig.json
│   └── package.json
│
├── tailwind.config.ts                       # Tailwind com tema custom
├── vite.config.ts                           # Vite config + aliases
├── tsconfig.json                            # TypeScript strict
├── package.json
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```

---

## 4. Arquitetura de Listas SharePoint (JSON Data Store)

Seguindo o padrão SmartFlow, toda a informação é armazenada como **JSON blobs** em colunas de texto multilinha. Isso dá flexibilidade total de schema sem depender de colunas SharePoint.

### 4.1 Lista: `smartbid-tracker`

**Propósito:** Armazena todos os BIDs (requests + bids ativos + completos).

| Coluna     | Tipo SP                                   | Descrição                                      |
| ---------- | ----------------------------------------- | ---------------------------------------------- |
| `Title`    | Single line of text                       | BID Number: `BID-2026-0001`                    |
| `jsondata` | Multiple lines of text (Plain, Unlimited) | JSON completo do `IBid`                        |
| `Status`   | Single line of text                       | Status atual (redundante, para OData filter)   |
| `Division` | Single line of text                       | Divisão (redundante, para OData filter)        |
| `DueDate`  | DateTime                                  | Data limite (redundante, para sort/filter)     |
| `Owner`    | Single line of text                       | Email do owner (redundante, para OData filter) |
| `Phase`    | Single line of text                       | Fase atual (redundante, para OData filter)     |

> **Nota:** As colunas redundantes (`Status`, `Division`, `DueDate`, `Owner`, `Phase`) são indexadas no SharePoint para permitir queries OData eficientes sem carregar todos os BIDs. O JSON em `jsondata` é a source-of-truth.

**Exemplo de `jsondata`:**

```json
{
  "bidNumber": "BID-2026-0042",
  "crmNumber": "CRM-2026-0125",
  "division": "SSR-ROV",
  "serviceLine": "IMR",
  "bidType": "Firm",
  "bidSize": "Standard",
  "priority": "High",

  // ─── OPPORTUNITY INFO (Seção de informações gerais) ───
  "opportunityInfo": {
    "client": "Petrobras",
    "clientContact": "João Silva",
    "projectName": "ROV Inspection - Marlim Field",
    "projectDescription": "ROV inspection campaign for 12 risers...",
    "region": "Brazil",
    "vessel": "Normand Maximus",
    "field": "Marlim Field",
    "waterDepth": 1200,
    "waterDepthUnit": "m",
    "operationStartDate": "2026-05-15T00:00:00Z",
    "totalDuration": 45,
    "totalDurationUnit": "days",
    "currency": "USD",
    "ptax": 5.65,
    "ptaxDate": "2026-03-01T00:00:00Z",
    "qualifications": [
      "HSE Qualification for Petrobras",
      "ANVISA Medical Certification",
      "ISO 9001 Compliance"
    ]
  },

  "bidder": {
    "name": "Marcos Santos",
    "email": "msantos@oceaneering.com",
    "role": "Commercial Coordinator",
    "photoUrl": "base64..."
  },
  "owner": {
    "name": "João Silva",
    "email": "jsilva@oceaneering.com",
    "role": "Engineering Lead",
    "photoUrl": "base64..."
  },
  "reviewers": [],
  "createdDate": "2026-03-15T10:00:00Z",
  "dueDate": "2026-03-25T18:00:00Z",
  "startDate": "2026-03-16T08:00:00Z",
  "completedDate": null,
  "lastModified": "2026-03-20T14:30:00Z",
  "currentStatus": "Cost Gathering",
  "currentPhase": "PHASE_3",
  "steps": [
    {
      "idStep": 1,
      "status": "Request Submitted",
      "phase": "PHASE_0",
      "start": "2026-03-15T10:00:00Z",
      "end": "2026-03-15T14:00:00Z",
      "duration": 14400000,
      "durationFormatted": "4h",
      "actor": "msantos@oceaneering.com",
      "comments": "New request from Petrobras"
    }
  ],
  "tasks": [
    {
      "taskId": "1.1",
      "phase": "PHASE_1",
      "name": "Send E-mail with Client Request",
      "status": "completed",
      "assignedTo": "msantos@oceaneering.com",
      "completedDate": "2026-03-15T11:00:00Z",
      "comments": "Sent to eng team"
    },
    {
      "taskId": "2.1",
      "phase": "PHASE_2",
      "name": "Client Documentation Analysis",
      "status": "completed",
      "assignedTo": "jsilva@oceaneering.com",
      "completedDate": "2026-03-17T16:00:00Z",
      "comments": ""
    }
  ],
  // ─── ASSETS / TOOLING (Equipamentos com CAPEX/OPEX) ───
  "assetsCostSummary": {
    "capexTotal": 74373.07,
    "capexTotalBRL": 468550.34,
    "opexTotal": 0.0,
    "opexTotalBRL": 0.0,
    "grandTotal": 74373.07,
    "grandTotalBRL": 468550.34,
    "byDivision": {
      "OPG": { "capex": 0, "opex": 0, "total": 0 },
      "SSR-ROV": { "capex": 74373.07, "opex": 0, "total": 74373.07 },
      "SSR-Survey": { "capex": 0, "opex": 0, "total": 0 }
    }
  },
  "equipmentList": [
    {
      "id": "eq-001",
      "lineNumber": 1,
      "requirementGroup": 9,
      "requirementName": "Ferramentas de limpeza - Dynaset e Brush cleaning",
      "engStudy": "",
      "partNumber": "990695686",
      "toolDescription": "WATER BLASTER",
      "qtyOperational": 1,
      "qtySpare": 0,
      "qtyOnHand": 0,
      "qtyToBuy": 1,
      "acquisitionType": "In House",
      "leadTimeDays": 0,
      "unitCostUSD": 22391.91,
      "totalCostUSD": 22391.91,
      "costReference": "BUMBL",
      "isFavorite": false,
      "costCategory": "CAPEX",
      "costCalcMethod": "auto",
      "originalCost": 122035.9,
      "originalCurrency": "BRL",
      "costDate": "2/2025",
      "quoteUrl": null,
      "quoteLabel": null,
      "statusIndicator": null,
      "equipmentSubCategory": "ROV_Tooling",
      "importedFromTemplate": "template-rov-inspection",
      "notes": ""
    },
    {
      "id": "eq-002",
      "lineNumber": 2,
      "requirementGroup": 9,
      "requirementName": "Ferramentas de limpeza - Dynaset e Brush cleaning",
      "engStudy": "",
      "partNumber": "990701800",
      "toolDescription": "BRUSH ASSY 5IN TO 4IN",
      "qtyOperational": 1,
      "qtySpare": 0,
      "qtyOnHand": 0,
      "qtyToBuy": 1,
      "acquisitionType": "Purchase (cap)",
      "leadTimeDays": 51,
      "unitCostUSD": 266.59,
      "totalCostUSD": 266.59,
      "costReference": "BUMBL",
      "isFavorite": false,
      "costCategory": "CAPEX",
      "costCalcMethod": "auto",
      "originalCost": 1452.92,
      "originalCurrency": "BRL",
      "costDate": "6/2024",
      "quoteUrl": null,
      "quoteLabel": null,
      "statusIndicator": "yellow",
      "equipmentSubCategory": "ROV_Tooling",
      "importedFromTemplate": null,
      "notes": ""
    }
  ],

  // ─── HOURS SUMMARY (Horas por Divisão → Onshore/Offshore → Recursos) ───
  "hoursSummary": {
    "engineeringHours": {
      "totalHours": 280,
      "totalCostBRL": 0,
      "items": [
        {
          "id": "eng-001",
          "lineNumber": 43,
          "requirementName": "Scope of Supply",
          "engStudy": "",
          "function": "Engineer",
          "phase": "Drawings",
          "hoursPerDay": 8,
          "pplQty": 1,
          "workDays": 5,
          "utilizationPercent": 100,
          "totalHours": 40.0,
          "costBRL": 0
        },
        {
          "id": "eng-002",
          "lineNumber": 54,
          "requirementName": "Melhoria - 3 IN AX/VX RING INSTALLER TOOL",
          "engStudy": "",
          "function": "Engineer",
          "phase": "Drawings",
          "hoursPerDay": 8,
          "pplQty": 1,
          "workDays": 30,
          "utilizationPercent": 100,
          "totalHours": 240.0,
          "costBRL": 0
        }
      ]
    },
    "onshoreHours": {
      "totalHours": 11600,
      "totalCostBRL": 0,
      "items": [
        {
          "id": "on-001",
          "lineNumber": 41,
          "resourceGroup": 40,
          "requirementName": "Recursos Onshore",
          "function": "Project Manager",
          "phase": "Manag (Oper)",
          "hoursPerDay": 8,
          "pplQty": 1,
          "workDays": 366,
          "utilizationPercent": 30,
          "totalHours": 878.4,
          "costBRL": 0
        },
        {
          "id": "on-002",
          "lineNumber": 41,
          "resourceGroup": 40,
          "requirementName": "Recursos Onshore",
          "function": "Operations Manager",
          "phase": "Manag (Oper)",
          "hoursPerDay": 8,
          "pplQty": 1,
          "workDays": 366,
          "utilizationPercent": 30,
          "totalHours": 878.4,
          "costBRL": 0
        }
      ]
    },
    "offshoreHours": {
      "totalHours": 17172,
      "totalCostBRL": 0,
      "items": [
        {
          "id": "off-001",
          "lineNumber": 42,
          "resourceGroup": 40,
          "requirementName": "Recursos Offshore",
          "function": "Party Chief",
          "phase": "Mob",
          "hoursPerDay": 12,
          "pplQty": 1,
          "workDays": 7,
          "utilizationPercent": 100,
          "totalHours": 84.0,
          "costBRL": 0
        }
      ]
    },
    "totalsByDivision": {
      "OPG": { "engineering": 0, "onshore": 0, "offshore": 0 },
      "SSR-ROV": { "engineering": 280, "onshore": 11600, "offshore": 17172 },
      "SSR-Survey": { "engineering": 0, "onshore": 4305.6, "offshore": 9816 }
    },
    "grandTotalHours": 29052,
    "grandTotalCostBRL": 0,
    "grandTotalCostUSD": 0
  },

  // ─── COST SUMMARY (Compilação final de custos) ───
  "costSummary": {
    "assetsCostUSD": 74373.07,
    "assetsCostBRL": 468550.34,
    "onshoreHoursCostBRL": 0,
    "offshoreHoursCostBRL": 75000.0,
    "engineeringHoursCostBRL": 0,
    "totalHoursCostBRL": 75000.0,
    "totalHoursCostUSD": 13274.34,
    "totalCostUSD": 87647.41,
    "totalCostBRL": 543550.34,
    "currency": "USD",
    "ptaxUsed": 5.65,
    "notes": "Costs based on Q1 2026 rates"
  },

  // ─── BID RESULT / FOLLOW-UP (preenchido após entrega ao Comercial) ───
  "bidResult": {
    "outcome": null,
    "outcomeDate": null,
    "contractValue": null,
    "contractCurrency": null,
    "lostReason": null,
    "competitorName": null,
    "feedbackNotes": null,
    "followUpDate": null,
    "lastUpdatedBy": null,
    "lastUpdatedDate": null
  },
  "approvals": [
    {
      "id": "apr-001",
      "stakeholderRole": "Engineering Manager",
      "stakeholder": {
        "name": "Carlos Mendes",
        "email": "cmendes@oceaneering.com"
      },
      "status": "approved",
      "requestedDate": "2026-03-19T09:00:00Z",
      "respondedDate": "2026-03-19T11:30:00Z",
      "decision": "Approved",
      "comments": "Costs are within budget. Proceed.",
      "approvedVia": "SmartBid",
      "notificationSent": true,
      "reminderCount": 0
    },
    {
      "id": "apr-002",
      "stakeholderRole": "Commercial Manager",
      "stakeholder": {
        "name": "Ana Oliveira",
        "email": "aoliveira@oceaneering.com"
      },
      "status": "pending",
      "requestedDate": "2026-03-19T09:00:00Z",
      "respondedDate": null,
      "decision": null,
      "comments": null,
      "approvedVia": null,
      "notificationSent": true,
      "reminderCount": 1
    }
  ],
  "approvalStatus": "pending",
  "attachments": [
    {
      "id": "att-001",
      "fileName": "Petrobras-Scope-of-Work.pdf",
      "fileUrl": "/sites/smartbid/SmartBidAttachments/BID-2026-0042/Petrobras-Scope-of-Work.pdf",
      "fileSize": 2450000,
      "fileType": "application/pdf",
      "uploadedBy": "msantos@oceaneering.com",
      "uploadedDate": "2026-03-15T10:05:00Z",
      "category": "Client Documentation"
    }
  ],
  // ─── COMMENTS (salvam data, hora, nome, tag de fase) ───
  "comments": [
    {
      "id": "cmt-001",
      "author": {
        "name": "João Silva",
        "email": "jsilva@oceaneering.com",
        "role": "Engineering Lead",
        "photoUrl": "base64..."
      },
      "text": "Documentation review completed. Moving to cost gathering.",
      "timestamp": "2026-03-17T16:30:00Z",
      "phase": "PHASE_2",
      "section": "general",
      "isEdited": false,
      "editedAt": null,
      "mentions": [],
      "attachments": []
    },
    {
      "id": "cmt-002",
      "author": {
        "name": "Carlos Mendes",
        "email": "cmendes@oceaneering.com",
        "role": "Engineering Manager",
        "photoUrl": "base64..."
      },
      "text": "Please double-check the ROV life extension costs before submitting for approval.",
      "timestamp": "2026-03-18T09:15:00Z",
      "phase": "PHASE_3",
      "section": "costs",
      "isEdited": false,
      "editedAt": null,
      "mentions": ["jsilva@oceaneering.com"],
      "attachments": []
    }
  ],
  "activityLog": [
    {
      "id": "log-001",
      "type": "BID_CREATED",
      "timestamp": "2026-03-15T10:00:00Z",
      "actor": "msantos@oceaneering.com",
      "actorName": "Marcos Santos",
      "description": "BID request created from commercial",
      "metadata": {}
    }
  ],
  "templateUsed": "template-rov-inspection",
  "bidFolderUrl": "/sites/smartbid/SmartBidAttachments/BID-2026-0042",
  "commercialFolderUrl": null,

  // ─── BID NOTES (Notas de análise freeform, ex: Gap Analysis, Qualifications to Vessel) ───
  "bidNotes": {
    "Gap Analysis": "Realizado juntamente com equipe técnica utilizando Risk Plan...",
    "Qualifications to Vessel Owner": "Vessel owner is responsible for USBL system functionality and calibration...",
    "Principais Diferenças ET": "SURVEY: Disponibilização de recursos para Modelo 3D com prazo de 90 dias...",
    "Atualizações (Esclarecimentos)": "Modificações baseadas nos esclarecimentos recebidos..."
  },

  "metadata": {
    "version": "2.0",
    "createdBy": "msantos@oceaneering.com",
    "lastModifiedBy": "jsilva@oceaneering.com",
    "source": "web",
    "schemaVersion": 1
  },
  "kpis": {
    "daysInCurrentPhase": 3,
    "totalDaysElapsed": 5,
    "estimatedDaysRemaining": 5,
    "isOverdue": false,
    "overdueBy": 0,
    "approvalCycleTime": null,
    "phaseCompletionPercentage": 60,
    "templateMatchScore": 85
  }
}
```

---

### 4.2 Lista: `smartbid-config`

**Propósito:** Toda a configuração do sistema, membros, logs, e templates.

| Coluna        | Tipo SP                                   | Descrição                        |
| ------------- | ----------------------------------------- | -------------------------------- |
| `Title`       | Single line of text                       | Config Key (identificador único) |
| `ConfigValue` | Multiple lines of text (Plain, Unlimited) | JSON string do valor             |

**Config Keys:**

| Key                  | Conteúdo               | Descrição                                         |
| -------------------- | ---------------------- | ------------------------------------------------- |
| `SYSTEM_CONFIG`      | `ISystemConfig` JSON   | KPI targets, tipos, divisões, service lines, etc. |
| `TEAM_MEMBERS`       | `IMembersData` JSON    | Todos os membros organizados por categoria        |
| `ACTIVITY_LOG`       | `IActivityLog[]` JSON  | Últimas 200 atividades do sistema                 |
| `BID_TEMPLATES`      | `IBidTemplate[]` JSON  | Templates de equipamento salvos                   |
| `APPROVAL_RULES`     | `IApprovalRule[]` JSON | Regras de aprovação por tipo/divisão              |
| `QUOTATION_DATABASE` | `IQuotation[]` JSON    | Base de cotações históricas                       |
| `PATCH_NOTES`        | `IPatchNote[]` JSON    | Histórico de versões                              |

**Exemplo `SYSTEM_CONFIG`:**

```json
{
  "kpiTargets": {
    "targetOnTimeDelivery": 90,
    "targetOTIF": 85,
    "targetAvgCompletionDays": 15,
    "targetFirstPassApproval": 80,
    "targetApprovalCycleDays": 3,
    "targetCancellationRate": 5,
    "targetTemplateUsage": 60,
    "targetOverdueRate": 10,
    "targetWinRate": 40
  },

  "regions": [
    {
      "id": "brazil",
      "label": "Brazil",
      "value": "Brazil",
      "isActive": true,
      "order": 1,
      "timezone": "America/Sao_Paulo"
    },
    {
      "id": "us-gulf",
      "label": "US Gulf",
      "value": "US Gulf",
      "isActive": false,
      "order": 2,
      "timezone": "America/Chicago"
    }
  ],

  "bidTypes": [
    {
      "id": "firm",
      "label": "Firm",
      "value": "Firm",
      "isActive": true,
      "order": 1
    },
    {
      "id": "budgetary",
      "label": "Budgetary",
      "value": "Budgetary",
      "isActive": true,
      "order": 2
    },
    {
      "id": "rfi",
      "label": "RFI (Request for Information)",
      "value": "RFI",
      "isActive": true,
      "order": 3
    },
    {
      "id": "extension",
      "label": "Contract Extension",
      "value": "Extension",
      "isActive": true,
      "order": 4
    },
    {
      "id": "amendment",
      "label": "Amendment",
      "value": "Amendment",
      "isActive": true,
      "order": 5
    }
  ],

  "divisions": [
    {
      "id": "opg",
      "label": "OPG",
      "value": "OPG",
      "isActive": true,
      "order": 1,
      "color": "#3B82F6"
    },
    {
      "id": "ssr-survey",
      "label": "SSR - Survey",
      "value": "SSR-Survey",
      "isActive": true,
      "order": 2,
      "color": "#10B981"
    },
    {
      "id": "ssr-rov",
      "label": "SSR - ROV",
      "value": "SSR-ROV",
      "isActive": true,
      "order": 3,
      "color": "#F59E0B"
    },
    {
      "id": "ssr-integrated",
      "label": "SSR - Integrated",
      "value": "SSR-Integrated",
      "isActive": true,
      "order": 4,
      "color": "#8B5CF6"
    }
  ],

  "serviceLines": [
    {
      "id": "imr",
      "label": "IMR (Inspection, Maintenance & Repair)",
      "value": "IMR",
      "isActive": true,
      "division": ["SSR-ROV", "SSR-Integrated"]
    },
    {
      "id": "uwild",
      "label": "UWILD (Underwater Inspection in Lieu of Drydocking)",
      "value": "UWILD",
      "isActive": true,
      "division": ["SSR-ROV"]
    },
    {
      "id": "survey",
      "label": "Survey / Positioning",
      "value": "Survey",
      "isActive": true,
      "division": ["SSR-Survey"]
    },
    {
      "id": "multibeam",
      "label": "Multibeam",
      "value": "Multibeam",
      "isActive": true,
      "division": ["SSR-Survey"]
    },
    {
      "id": "controls",
      "label": "Controls",
      "value": "Controls",
      "isActive": true,
      "division": ["SSR-ROV", "SSR-Integrated"]
    },
    {
      "id": "tooling",
      "label": "Subsea Tooling",
      "value": "Tooling",
      "isActive": true,
      "division": ["SSR-ROV", "OPG"]
    },
    {
      "id": "installation",
      "label": "Installation",
      "value": "Installation",
      "isActive": true,
      "division": ["OPG", "SSR-Integrated"]
    },
    {
      "id": "decommissioning",
      "label": "Decommissioning",
      "value": "Decommissioning",
      "isActive": true,
      "division": ["OPG"]
    },
    {
      "id": "construction",
      "label": "Subsea Construction",
      "value": "Construction",
      "isActive": true,
      "division": ["OPG"]
    }
  ],

  "bidSizes": [
    {
      "id": "small",
      "label": "Small (< 5 days)",
      "value": "Small",
      "isActive": true,
      "maxDays": 5
    },
    {
      "id": "standard",
      "label": "Standard (5-15 days)",
      "value": "Standard",
      "isActive": true,
      "maxDays": 15
    },
    {
      "id": "epic",
      "label": "Epic (> 15 days)",
      "value": "Epic",
      "isActive": true,
      "maxDays": null
    }
  ],

  "priorities": [
    {
      "id": "urgent",
      "label": "Urgent",
      "value": "Urgent",
      "color": "#EF4444",
      "pulsing": true,
      "maxResponseHours": 24
    },
    {
      "id": "high",
      "label": "High",
      "value": "High",
      "color": "#F59E0B",
      "pulsing": false,
      "maxResponseHours": 48
    },
    {
      "id": "normal",
      "label": "Normal",
      "value": "Normal",
      "color": "#3B82F6",
      "pulsing": false,
      "maxResponseHours": 72
    },
    {
      "id": "low",
      "label": "Low",
      "value": "Low",
      "color": "#64748B",
      "pulsing": false,
      "maxResponseHours": 120
    }
  ],

  "clientList": [
    {
      "id": "petrobras",
      "label": "Petrobras",
      "value": "Petrobras",
      "isActive": true
    },
    {
      "id": "shell",
      "label": "Shell Brasil",
      "value": "Shell",
      "isActive": true
    },
    {
      "id": "equinor",
      "label": "Equinor Brasil",
      "value": "Equinor",
      "isActive": true
    },
    {
      "id": "totalenergies",
      "label": "TotalEnergies",
      "value": "TotalEnergies",
      "isActive": true
    },
    { "id": "enauta", "label": "Enauta", "value": "Enauta", "isActive": true },
    { "id": "prio", "label": "PRIO", "value": "PRIO", "isActive": true },
    { "id": "modec", "label": "MODEC", "value": "MODEC", "isActive": true },
    { "id": "saipem", "label": "Saipem", "value": "Saipem", "isActive": true },
    {
      "id": "subsea7",
      "label": "Subsea 7",
      "value": "Subsea7",
      "isActive": true
    }
  ],

  "jobFunctions": [
    {
      "id": "project-manager",
      "label": "Project Manager",
      "value": "Project Manager",
      "isActive": true,
      "category": "management",
      "order": 1
    },
    {
      "id": "project-coordinator",
      "label": "Project Coordinator",
      "value": "Project Coordinator",
      "isActive": true,
      "category": "management",
      "order": 2
    },
    {
      "id": "engineer",
      "label": "Engineer",
      "value": "Engineer",
      "isActive": true,
      "category": "engineering",
      "order": 3
    },
    {
      "id": "operations-manager",
      "label": "Operations Manager",
      "value": "Operations Manager",
      "isActive": true,
      "category": "operations",
      "order": 4
    },
    {
      "id": "operations-coordinator",
      "label": "Operations Coordinator",
      "value": "Operations Coordinator",
      "isActive": true,
      "category": "operations",
      "order": 5
    },
    {
      "id": "services-supervisor",
      "label": "Services Supervisor",
      "value": "Services Supervisor",
      "isActive": true,
      "category": "operations",
      "order": 6
    },
    {
      "id": "services-technician",
      "label": "Services Technician",
      "value": "Services Technician",
      "isActive": true,
      "category": "operations",
      "order": 7
    },
    {
      "id": "specialist-technician",
      "label": "Specialist Technician",
      "value": "Specialist Technician",
      "isActive": true,
      "category": "operations",
      "order": 8
    },
    {
      "id": "sto",
      "label": "STO",
      "value": "STO",
      "isActive": true,
      "category": "operations",
      "order": 9
    },
    {
      "id": "rov-supervisor",
      "label": "ROV Supervisor",
      "value": "ROV Supervisor",
      "isActive": true,
      "category": "rov",
      "order": 10
    },
    {
      "id": "rov-technician",
      "label": "ROV Technician",
      "value": "ROV Technician",
      "isActive": true,
      "category": "rov",
      "order": 11
    },
    {
      "id": "rov-superintendent",
      "label": "ROV Superintendent",
      "value": "ROV Superintendent",
      "isActive": true,
      "category": "rov",
      "order": 12
    },
    {
      "id": "offshore-ops-manager",
      "label": "Offshore Operations Manager",
      "value": "Offshore Operations Manager",
      "isActive": true,
      "category": "offshore",
      "order": 13
    },
    {
      "id": "sr-party-chief",
      "label": "Sr. Party Chief",
      "value": "Sr. Party Chief",
      "isActive": true,
      "category": "survey",
      "order": 14
    },
    {
      "id": "party-chief",
      "label": "Party Chief",
      "value": "Party Chief",
      "isActive": true,
      "category": "survey",
      "order": 15
    },
    {
      "id": "online-surveyor",
      "label": "Online Surveyor",
      "value": "Online Surveyor",
      "isActive": true,
      "category": "survey",
      "order": 16
    },
    {
      "id": "tech-surveyor",
      "label": "Tech Surveyor",
      "value": "Tech Surveyor",
      "isActive": true,
      "category": "survey",
      "order": 17
    },
    {
      "id": "land-surveyor",
      "label": "Land Surveyor",
      "value": "Land Surveyor",
      "isActive": true,
      "category": "survey",
      "order": 18
    },
    {
      "id": "data-analyst",
      "label": "Data Analyst",
      "value": "Data Analyst",
      "isActive": true,
      "category": "survey",
      "order": 19
    },
    {
      "id": "sr-data-analyst",
      "label": "Sr. Data Analyst",
      "value": "Sr. Data Analyst",
      "isActive": true,
      "category": "survey",
      "order": 20
    },
    {
      "id": "data-analyst-dimcon",
      "label": "Data Analyst-DimCon",
      "value": "Data Analyst-DimCon",
      "isActive": true,
      "category": "survey",
      "order": 21
    },
    {
      "id": "data-processor",
      "label": "Data Processor",
      "value": "Data Processor",
      "isActive": true,
      "category": "survey",
      "order": 22
    },
    {
      "id": "equipment-coordinator",
      "label": "Equipment Coordinator",
      "value": "Equipment Coordinator",
      "isActive": true,
      "category": "support",
      "order": 23
    },
    {
      "id": "quality-inspector",
      "label": "Quality Inspector",
      "value": "Quality Inspector",
      "isActive": true,
      "category": "support",
      "order": 24
    }
  ],

  "hoursPhases": [
    {
      "id": "drawings",
      "label": "Drawings",
      "value": "Drawings",
      "isActive": true,
      "category": "engineering",
      "order": 1
    },
    {
      "id": "eng-study",
      "label": "Eng. Study",
      "value": "Eng. Study",
      "isActive": true,
      "category": "engineering",
      "order": 2
    },
    {
      "id": "fmea",
      "label": "FMEA",
      "value": "FMEA",
      "isActive": true,
      "category": "engineering",
      "order": 3
    },
    {
      "id": "fea",
      "label": "FEA",
      "value": "FEA",
      "isActive": true,
      "category": "engineering",
      "order": 4
    },
    {
      "id": "omm",
      "label": "OMM",
      "value": "OMM",
      "isActive": true,
      "category": "engineering",
      "order": 5
    },
    {
      "id": "fat",
      "label": "FAT",
      "value": "FAT",
      "isActive": true,
      "category": "engineering",
      "order": 6
    },
    {
      "id": "maint-plan",
      "label": "Maint. Plan",
      "value": "Maint. Plan",
      "isActive": true,
      "category": "engineering",
      "order": 7
    },
    {
      "id": "feed-study",
      "label": "FEED Study",
      "value": "FEED Study",
      "isActive": true,
      "category": "engineering",
      "order": 8
    },
    {
      "id": "ops-support",
      "label": "Ops Support",
      "value": "Ops Support",
      "isActive": true,
      "category": "engineering",
      "order": 9
    },
    {
      "id": "manag-oper",
      "label": "Manag (Oper)",
      "value": "Manag (Oper)",
      "isActive": true,
      "category": "management",
      "order": 10
    },
    {
      "id": "manag-shop",
      "label": "Manag (Shop)",
      "value": "Manag (Shop)",
      "isActive": true,
      "category": "management",
      "order": 11
    },
    {
      "id": "premob",
      "label": "Premob",
      "value": "Premob",
      "isActive": true,
      "category": "mobilization",
      "order": 12
    },
    {
      "id": "mob",
      "label": "Mob",
      "value": "Mob",
      "isActive": true,
      "category": "mobilization",
      "order": 13
    },
    {
      "id": "subcon-shop",
      "label": "Subcon (Shop)",
      "value": "Subcon (Shop)",
      "isActive": true,
      "category": "subcontract",
      "order": 14
    },
    {
      "id": "subcon-oper",
      "label": "Subcon (Oper)",
      "value": "Subcon (Oper)",
      "isActive": true,
      "category": "subcontract",
      "order": 15
    },
    {
      "id": "operation",
      "label": "Operation",
      "value": "Operation",
      "isActive": true,
      "category": "execution",
      "order": 16
    },
    {
      "id": "demob",
      "label": "Demob",
      "value": "Demob",
      "isActive": true,
      "category": "mobilization",
      "order": 17
    },
    {
      "id": "ser-excel",
      "label": "Ser. Excel.",
      "value": "Ser. Excel.",
      "isActive": true,
      "category": "execution",
      "order": 18
    },
    {
      "id": "data-manag",
      "label": "Data Manag.",
      "value": "Data Manag.",
      "isActive": true,
      "category": "data",
      "order": 19
    },
    {
      "id": "other",
      "label": "Other",
      "value": "Other",
      "isActive": true,
      "category": "other",
      "order": 20
    }
  ],

  "acquisitionTypes": [
    {
      "id": "in-house",
      "label": "In House",
      "value": "In House",
      "isActive": true,
      "costCategory": "CAPEX",
      "order": 1
    },
    {
      "id": "afe-global",
      "label": "AFE Global",
      "value": "AFE Global",
      "isActive": true,
      "costCategory": "CAPEX",
      "order": 2
    },
    {
      "id": "purchase-cap",
      "label": "Purchase (cap)",
      "value": "Purchase (cap)",
      "isActive": true,
      "costCategory": "CAPEX",
      "order": 3
    },
    {
      "id": "mobiliz-ope",
      "label": "Mobiliz. (ope)",
      "value": "Mobiliz. (ope)",
      "isActive": true,
      "costCategory": "OPEX",
      "order": 4
    },
    {
      "id": "rental-ope",
      "label": "Rental (ope)",
      "value": "Rental (ope)",
      "isActive": true,
      "costCategory": "OPEX",
      "order": 5
    },
    {
      "id": "transit-ope",
      "label": "Transit (ope)",
      "value": "Transit (ope)",
      "isActive": true,
      "costCategory": "OPEX",
      "order": 6
    },
    {
      "id": "onboard",
      "label": "Onboard",
      "value": "Onboard",
      "isActive": true,
      "costCategory": "CAPEX",
      "order": 7
    },
    {
      "id": "not-offered",
      "label": "Not Offered",
      "value": "Not Offered",
      "isActive": true,
      "costCategory": null,
      "order": 8
    },
    {
      "id": "call-out",
      "label": "Call Out",
      "value": "Call Out",
      "isActive": true,
      "costCategory": "OPEX",
      "order": 9
    },
    {
      "id": "day-rate-ope",
      "label": "Day Rate (ope)",
      "value": "Day Rate (ope)",
      "isActive": true,
      "costCategory": "OPEX",
      "order": 10
    },
    {
      "id": "logistics-ope",
      "label": "Logistics (ope)",
      "value": "Logistics (ope)",
      "isActive": true,
      "costCategory": "OPEX",
      "order": 11
    },
    {
      "id": "consum-ope",
      "label": "Consum. (ope)",
      "value": "Consum. (ope)",
      "isActive": true,
      "costCategory": "OPEX",
      "order": 12
    },
    {
      "id": "maint-cap",
      "label": "Maint. (cap)",
      "value": "Maint. (cap)",
      "isActive": true,
      "costCategory": "CAPEX",
      "order": 13
    },
    {
      "id": "maint-ope",
      "label": "Maint. (ope)",
      "value": "Maint. (ope)",
      "isActive": true,
      "costCategory": "OPEX",
      "order": 14
    },
    {
      "id": "update-cap",
      "label": "Update (cap)",
      "value": "Update (cap)",
      "isActive": true,
      "costCategory": "CAPEX",
      "order": 15
    },
    {
      "id": "update-ope",
      "label": "Update (ope)",
      "value": "Update (ope)",
      "isActive": true,
      "costCategory": "OPEX",
      "order": 16
    },
    {
      "id": "certif-cap",
      "label": "Certif. (cap)",
      "value": "Certif. (cap)",
      "isActive": true,
      "costCategory": "CAPEX",
      "order": 17
    },
    {
      "id": "certif-ope",
      "label": "Certif. (ope)",
      "value": "Certif. (ope)",
      "isActive": true,
      "costCategory": "OPEX",
      "order": 18
    }
  ],

  "deliverableTypes": [
    {
      "id": "scope-of-supply",
      "label": "Scope of Supply",
      "value": "Scope of Supply",
      "isActive": true
    },
    {
      "id": "eng-study",
      "label": "Engineering Study",
      "value": "Engineering Study",
      "isActive": true
    },
    {
      "id": "drawings",
      "label": "Drawings / Technical Documents",
      "value": "Drawings",
      "isActive": true
    },
    { "id": "fmea", "label": "FMEA Report", "value": "FMEA", "isActive": true },
    { "id": "fea", "label": "FEA Report", "value": "FEA", "isActive": true },
    {
      "id": "omm",
      "label": "OMM (Operations & Maintenance Manual)",
      "value": "OMM",
      "isActive": true
    },
    {
      "id": "fat",
      "label": "FAT (Factory Acceptance Test)",
      "value": "FAT",
      "isActive": true
    },
    {
      "id": "maint-plan",
      "label": "Maintenance Plan",
      "value": "Maintenance Plan",
      "isActive": true
    },
    {
      "id": "tech-proposal",
      "label": "Technical Proposal",
      "value": "Technical Proposal",
      "isActive": true
    },
    {
      "id": "cost-sheet",
      "label": "Cost Sheet / BID Summary",
      "value": "Cost Sheet",
      "isActive": true
    },
    {
      "id": "resource-plan",
      "label": "Resource Plan",
      "value": "Resource Plan",
      "isActive": true
    },
    {
      "id": "responsibility-matrix",
      "label": "Responsibility Matrix (RACI)",
      "value": "RACI",
      "isActive": true
    }
  ],

  "equipmentCategories": [
    { "id": "rov", "label": "ROV Systems", "value": "ROV Systems" },
    {
      "id": "survey-eq",
      "label": "Survey Equipment",
      "value": "Survey Equipment"
    },
    { "id": "tooling", "label": "Subsea Tooling", "value": "Subsea Tooling" },
    {
      "id": "controls",
      "label": "Control Systems",
      "value": "Control Systems"
    },
    {
      "id": "umbilicals",
      "label": "Umbilicals & Cables",
      "value": "Umbilicals & Cables"
    },
    {
      "id": "vessels",
      "label": "Vessel Equipment",
      "value": "Vessel Equipment"
    },
    {
      "id": "safety",
      "label": "Safety Equipment",
      "value": "Safety Equipment"
    },
    { "id": "consumables", "label": "Consumables", "value": "Consumables" },
    { "id": "third-party", "label": "Third Party", "value": "Third Party" },
    {
      "id": "cleaning-tools",
      "label": "Cleaning Tools",
      "value": "Cleaning Tools"
    }
  ],

  "bidResultOptions": [
    { "id": "won", "label": "Won", "value": "Won", "color": "#10B981" },
    { "id": "lost", "label": "Lost", "value": "Lost", "color": "#EF4444" },
    {
      "id": "client-canceled",
      "label": "Client Canceled",
      "value": "Client Canceled",
      "color": "#64748B"
    },
    {
      "id": "no-bid",
      "label": "No Bid (decided not to bid)",
      "value": "No Bid",
      "color": "#94A3B8"
    },
    {
      "id": "pending",
      "label": "Awaiting Client Decision",
      "value": "Pending",
      "color": "#F59E0B"
    },
    {
      "id": "renegotiation",
      "label": "Renegotiation",
      "value": "Renegotiation",
      "color": "#8B5CF6"
    }
  ],

  "currencySettings": {
    "defaultCurrency": "USD",
    "ptax": 5.65,
    "ptaxLastUpdate": "2026-04-01T00:00:00Z",
    "ptaxUpdateFrequency": "monthly"
  },
  "notifications": {
    "enabled": true,
    "manager": [
      "BID_CREATED",
      "BID_ASSIGNED",
      "APPROVAL_REQUESTED",
      "BID_COMPLETED",
      "BID_OVERDUE",
      "HIGH_PRIORITY"
    ],
    "engineer": [
      "BID_ASSIGNED",
      "APPROVAL_RESPONSE",
      "BID_RETURNED",
      "DEADLINE_WARNING"
    ],
    "bidder": [
      "BID_STATUS_CHANGED",
      "BID_COMPLETED",
      "APPROVAL_REQUESTED",
      "INFO_REQUESTED"
    ],
    "projectTeam": ["APPROVAL_REQUESTED", "BID_COMPLETED"],
    "guest": []
  },
  "accessLevels": {
    "manager": {
      "workspace": "edit",
      "insights": "edit",
      "reports": "edit",
      "settings": "edit",
      "approvals": "edit",
      "templates": "edit"
    },
    "engineer": {
      "workspace": "edit",
      "insights": "view",
      "reports": "view",
      "settings": "none",
      "approvals": "view",
      "templates": "edit"
    },
    "bidder": {
      "workspace": "edit",
      "insights": "view",
      "reports": "view",
      "settings": "none",
      "approvals": "view",
      "templates": "view"
    },
    "projectTeam": {
      "workspace": "view",
      "insights": "view",
      "reports": "view",
      "settings": "none",
      "approvals": "edit",
      "templates": "none"
    },
    "viewer": {
      "workspace": "view",
      "insights": "view",
      "reports": "view",
      "settings": "none",
      "approvals": "none",
      "templates": "none"
    },
    "guest": {
      "workspace": "view",
      "insights": "none",
      "reports": "none",
      "settings": "none",
      "approvals": "none",
      "templates": "none"
    }
  },
  "approvalRules": {
    "defaultApprovers": [
      { "role": "Engineering Manager", "required": true, "order": 1 },
      { "role": "Commercial Manager", "required": true, "order": 2 },
      { "role": "Project Manager", "required": false, "order": 3 }
    ],
    "divisionOverrides": {
      "OPG": [
        { "role": "OPG Manager", "required": true, "order": 1 },
        { "role": "Engineering Manager", "required": true, "order": 2 },
        { "role": "Commercial Manager", "required": true, "order": 3 }
      ]
    },
    "thresholds": {
      "highValueThreshold": 500000,
      "highValueAdditionalApprovers": [
        { "role": "Director", "required": true, "order": 4 }
      ]
    },
    "reminderIntervalHours": 24,
    "maxReminders": 3,
    "autoEscalateAfterHours": 72
  },

  "bidStatuses": [
    {
      "id": "request-submitted",
      "label": "Request Submitted",
      "value": "Request Submitted",
      "phase": "PHASE_0",
      "color": "#94A3B8",
      "order": 1,
      "isTerminal": false
    },
    {
      "id": "pending-assignment",
      "label": "Pending Assignment",
      "value": "Pending Assignment",
      "phase": "PHASE_0",
      "color": "#F59E0B",
      "order": 2,
      "isTerminal": false
    },
    {
      "id": "kick-off",
      "label": "Kick Off",
      "value": "Kick Off",
      "phase": "PHASE_1",
      "color": "#3B82F6",
      "order": 3,
      "isTerminal": false
    },
    {
      "id": "technical-analysis",
      "label": "Technical Analysis",
      "value": "Technical Analysis",
      "phase": "PHASE_2",
      "color": "#06B6D4",
      "order": 4,
      "isTerminal": false
    },
    {
      "id": "awaiting-clarification",
      "label": "Awaiting Clarification",
      "value": "Awaiting Clarification",
      "phase": "PHASE_2",
      "color": "#F97316",
      "order": 5,
      "isTerminal": false
    },
    {
      "id": "cost-gathering",
      "label": "Cost Gathering",
      "value": "Cost Gathering",
      "phase": "PHASE_3",
      "color": "#8B5CF6",
      "order": 6,
      "isTerminal": false
    },
    {
      "id": "bid-elaboration",
      "label": "BID Elaboration",
      "value": "BID Elaboration",
      "phase": "PHASE_3",
      "color": "#A855F7",
      "order": 7,
      "isTerminal": false
    },
    {
      "id": "under-review",
      "label": "Under Review",
      "value": "Under Review",
      "phase": "PHASE_3",
      "color": "#EC4899",
      "order": 8,
      "isTerminal": false
    },
    {
      "id": "pending-approval",
      "label": "Pending Approval",
      "value": "Pending Approval",
      "phase": "PHASE_3",
      "color": "#F59E0B",
      "order": 9,
      "isTerminal": false
    },
    {
      "id": "technical-proposal",
      "label": "Technical Proposal",
      "value": "Technical Proposal",
      "phase": "PHASE_4",
      "color": "#14B8A6",
      "order": 10,
      "isTerminal": false
    },
    {
      "id": "proposal-review",
      "label": "Proposal Review",
      "value": "Proposal Review",
      "phase": "PHASE_4",
      "color": "#0EA5E9",
      "order": 11,
      "isTerminal": false
    },
    {
      "id": "proposal-approval",
      "label": "Proposal Approval",
      "value": "Proposal Approval",
      "phase": "PHASE_4",
      "color": "#F59E0B",
      "order": 12,
      "isTerminal": false
    },
    {
      "id": "completed",
      "label": "Completed",
      "value": "Completed",
      "phase": "PHASE_5",
      "color": "#10B981",
      "order": 13,
      "isTerminal": true
    },
    {
      "id": "returned-commercial",
      "label": "Returned to Commercial",
      "value": "Returned to Commercial",
      "phase": "PHASE_5",
      "color": "#10B981",
      "order": 14,
      "isTerminal": true
    },
    {
      "id": "on-hold",
      "label": "On Hold",
      "value": "On Hold",
      "phase": null,
      "color": "#64748B",
      "order": 15,
      "isTerminal": false
    },
    {
      "id": "canceled",
      "label": "Canceled",
      "value": "Canceled",
      "phase": null,
      "color": "#EF4444",
      "order": 16,
      "isTerminal": true
    },
    {
      "id": "no-bid",
      "label": "No Bid",
      "value": "No Bid",
      "phase": null,
      "color": "#94A3B8",
      "order": 17,
      "isTerminal": true
    },
    {
      "id": "returned-revision",
      "label": "Returned for Revision",
      "value": "Returned for Revision",
      "phase": null,
      "color": "#F97316",
      "order": 18,
      "isTerminal": false
    }
  ],

  "phases": [
    {
      "id": "phase-0",
      "label": "Request",
      "value": "PHASE_0",
      "order": 0,
      "color": "#94A3B8"
    },
    {
      "id": "phase-1",
      "label": "Bid Kick Off",
      "value": "PHASE_1",
      "order": 1,
      "color": "#3B82F6"
    },
    {
      "id": "phase-2",
      "label": "Technical Analysis",
      "value": "PHASE_2",
      "order": 2,
      "color": "#06B6D4"
    },
    {
      "id": "phase-3",
      "label": "Cost & Resources",
      "value": "PHASE_3",
      "order": 3,
      "color": "#8B5CF6"
    },
    {
      "id": "phase-4",
      "label": "Technical Proposal",
      "value": "PHASE_4",
      "order": 4,
      "color": "#14B8A6"
    },
    {
      "id": "phase-5",
      "label": "Close Out",
      "value": "PHASE_5",
      "order": 5,
      "color": "#10B981"
    }
  ],

  "costReferences": [
    {
      "id": "bumbl",
      "label": "BUMBL (Brazil)",
      "value": "BUMBL",
      "isActive": true,
      "region": "Brazil"
    },
    {
      "id": "buabo",
      "label": "BUABO (Aberdeen)",
      "value": "BUABO",
      "isActive": true,
      "region": "UK"
    },
    {
      "id": "bumco",
      "label": "BUMCO (Morgan City)",
      "value": "BUMCO",
      "isActive": true,
      "region": "US"
    },
    {
      "id": "busto",
      "label": "BUSTO (Stavanger)",
      "value": "BUSTO",
      "isActive": true,
      "region": "Norway"
    },
    {
      "id": "bumbr",
      "label": "BUMBR (Brazil Remote)",
      "value": "BUMBR",
      "isActive": true,
      "region": "Brazil"
    },
    {
      "id": "quote",
      "label": "Quote (Manual)",
      "value": "Quote",
      "isActive": true,
      "region": null
    },
    {
      "id": "artig",
      "label": "ARTIG (Local Supplier)",
      "value": "artig",
      "isActive": true,
      "region": "Brazil"
    }
  ],

  "equipmentSubCategories": [
    {
      "id": "rov-tooling",
      "label": "ROV Tooling",
      "value": "ROV_Tooling",
      "division": "SSR-ROV"
    },
    {
      "id": "rov-assets",
      "label": "ROV Assets",
      "value": "ROV_Assets",
      "division": "SSR-ROV"
    },
    {
      "id": "survey-assets",
      "label": "Survey Assets",
      "value": "SURVEY_Assets",
      "division": "SSR-Survey"
    },
    {
      "id": "opg-equipment",
      "label": "OPG Equipment",
      "value": "OPG_Equipment",
      "division": "OPG"
    },
    {
      "id": "controls-equipment",
      "label": "Controls Equipment",
      "value": "Controls_Equipment",
      "division": "SSR-ROV"
    },
    {
      "id": "third-party",
      "label": "Third Party",
      "value": "Third_Party",
      "division": null
    }
  ],

  "lossReasons": [
    { "id": "price", "label": "Price", "value": "Price", "isActive": true },
    {
      "id": "technical",
      "label": "Technical Capability",
      "value": "Technical",
      "isActive": true
    },
    {
      "id": "schedule",
      "label": "Schedule / Timeline",
      "value": "Schedule",
      "isActive": true
    },
    {
      "id": "competitor",
      "label": "Competitor Advantage",
      "value": "Competitor",
      "isActive": true
    },
    {
      "id": "relationship",
      "label": "Client Relationship",
      "value": "Relationship",
      "isActive": true
    },
    {
      "id": "scope-change",
      "label": "Scope Changed",
      "value": "Scope Change",
      "isActive": true
    },
    { "id": "other", "label": "Other", "value": "Other", "isActive": true }
  ],

  "commentSections": [
    { "id": "general", "label": "General", "value": "general" },
    { "id": "costs", "label": "Costs", "value": "costs" },
    { "id": "hours", "label": "Hours / Resources", "value": "hours" },
    { "id": "assets", "label": "Assets / Equipment", "value": "assets" },
    { "id": "approval", "label": "Approval", "value": "approval" },
    { "id": "technical", "label": "Technical Analysis", "value": "technical" },
    {
      "id": "clarification",
      "label": "Clarification",
      "value": "clarification"
    }
  ],

  "attachmentCategories": [
    {
      "id": "client-docs",
      "label": "Client Documents",
      "value": "Client-Documents",
      "folderName": "Client-Documents"
    },
    {
      "id": "technical",
      "label": "Technical Analysis",
      "value": "Technical-Analysis",
      "folderName": "Technical-Analysis"
    },
    {
      "id": "cost-sheets",
      "label": "Cost Sheets",
      "value": "Cost-Sheets",
      "folderName": "Cost-Sheets"
    },
    {
      "id": "proposals",
      "label": "Proposals",
      "value": "Proposals",
      "folderName": "Proposals"
    },
    {
      "id": "approvals-docs",
      "label": "Approval Documents",
      "value": "Approvals",
      "folderName": "Approvals"
    },
    {
      "id": "exports",
      "label": "Exports",
      "value": "Exports",
      "folderName": "Exports"
    },
    {
      "id": "quotations",
      "label": "Quotations",
      "value": "Quotations",
      "folderName": "Quotations"
    }
  ],

  "statusIndicators": [
    {
      "id": "red",
      "label": "Critical / Overdue",
      "value": "red",
      "color": "#EF4444"
    },
    {
      "id": "yellow",
      "label": "Attention / Aging",
      "value": "yellow",
      "color": "#F59E0B"
    },
    {
      "id": "green",
      "label": "OK / Resolved",
      "value": "green",
      "color": "#10B981"
    },
    {
      "id": "blue",
      "label": "Info / Reference",
      "value": "blue",
      "color": "#3B82F6"
    }
  ],

  "waterDepthUnits": [
    { "id": "m", "label": "Meters", "value": "m" },
    { "id": "ft", "label": "Feet", "value": "ft" }
  ],

  "durationUnits": [
    { "id": "days", "label": "Days", "value": "days" },
    { "id": "weeks", "label": "Weeks", "value": "weeks" },
    { "id": "months", "label": "Months", "value": "months" }
  ],

  "bidNotesSections": [
    { "id": "gap-analysis", "label": "Gap Analysis", "value": "Gap Analysis" },
    {
      "id": "qualifications-vessel",
      "label": "Qualifications to Vessel Owner",
      "value": "Qualifications to Vessel Owner"
    },
    {
      "id": "contract-differences",
      "label": "Contract Differences (ET)",
      "value": "Principais Diferenças ET"
    },
    {
      "id": "duplicated-tools",
      "label": "Duplicated Tools / Services",
      "value": "Ferramentas Duplicadas"
    },
    {
      "id": "current-contract-gaps",
      "label": "Current Contract Gaps",
      "value": "Gaps do Contrato Atual"
    },
    {
      "id": "clarification-updates",
      "label": "Clarification Updates",
      "value": "Atualizações (Esclarecimentos)"
    },
    { "id": "custom", "label": "Custom Note", "value": "Custom" }
  ]
}
```

---

### 4.3 Lista: `smartbid-status-tracker`

**Propósito:** Registro de notificações para Power Automate → Microsoft Teams Adaptive Cards.

| Coluna        | Tipo SP                                   | Descrição                                     |
| ------------- | ----------------------------------------- | --------------------------------------------- |
| `Title`       | Single line of text                       | BID Number                                    |
| `jsondata`    | Multiple lines of text (Plain, Unlimited) | `IStatusTrackerEntry` JSON                    |
| `ChangeType`  | Single line of text                       | Tipo da mudança (para Power Automate trigger) |
| `IsProcessed` | Yes/No                                    | Power Automate já processou?                  |

**Change Types para trigger:**

- `BID_CREATED` — Novo BID criado
- `BID_ASSIGNED` — Owner atribuído
- `STATUS_CHANGED` — Status alterado
- `PHASE_CHANGED` — Fase alterada
- `APPROVAL_REQUESTED` — Aprovação solicitada (critical: envia card no Teams)
- `APPROVAL_RESPONSE` — Aprovação respondida
- `BID_COMPLETED` — BID finalizado
- `BID_OVERDUE` — BID passou do prazo
- `BID_CANCELLED` — BID cancelado
- `BID_RETURNED` — BID devolvido para revisão
- `COMMENT_ADDED` — Novo comentário
- `DEADLINE_WARNING` — Prazo se aproximando (48h, 24h)
- `HIGH_PRIORITY` — BID urgente criado
- `TEMPLATE_IMPORTED` — Template importado
- `EQUIPMENT_UPDATED` — Equipamento atualizado
- `COST_UPDATED` — Custos atualizados

---

### 4.4 Lista: `smartbid-approvals`

**Propósito:** Registro individual de aprovações. Cada solicitação de aprovação é um item separado para facilitar integração com Power Automate (cada item = 1 card no Teams).

| Coluna          | Tipo SP                                   | Descrição                                        |
| --------------- | ----------------------------------------- | ------------------------------------------------ |
| `Title`         | Single line of text                       | BID Number                                       |
| `ApprovalId`    | Single line of text                       | ID único da aprovação                            |
| `jsondata`      | Multiple lines of text (Plain, Unlimited) | `IApprovalRecord` JSON                           |
| `ApproverEmail` | Single line of text                       | Email do aprovador (para Power Automate filter)  |
| `Status`        | Single line of text                       | "pending" / "approved" / "rejected" / "revision" |
| `IsProcessed`   | Yes/No                                    | Power Automate já enviou o card?                 |

**Exemplo `jsondata`:**

```json
{
  "approvalId": "apr-2026-0042-001",
  "bidNumber": "BID-2026-0042",
  "bidTitle": "ROV Inspection - Marlim Field",
  "client": "Petrobras",
  "division": "SSR-ROV",
  "requestedBy": {
    "name": "João Silva",
    "email": "jsilva@oceaneering.com"
  },
  "approver": {
    "name": "Carlos Mendes",
    "email": "cmendes@oceaneering.com",
    "role": "Engineering Manager"
  },
  "approvalType": "BID Approval",
  "phase": "PHASE_3",
  "status": "pending",
  "requestedDate": "2026-03-19T09:00:00Z",
  "respondedDate": null,
  "decision": null,
  "comments": null,
  "approvedVia": null,
  "costSummary": {
    "grandTotal": 278740.0,
    "currency": "USD"
  },
  "dueDate": "2026-03-25T18:00:00Z",
  "remindersSent": 0,
  "lastReminderDate": null,
  "deepLink": "https://oceaneering.sharepoint.com/sites/smartbid?bid=BID-2026-0042&tab=approval"
}
```

**Fluxo Power Automate:**

1. Trigger: "When an item is created or modified" em `smartbid-approvals` onde `Status eq 'pending'` e `IsProcessed eq false`
2. Action: Send Adaptive Card no Teams para `ApproverEmail`
3. Card tem botões: ✅ Approve, ❌ Reject, 🔄 Request Revision
4. Quando aprovador clica → Power Automate atualiza o item (`Status`, `respondedDate`, `decision`, `comments`, `approvedVia: "Teams"`)
5. Smart BID 2.0 poll/webhook detecta a mudança e atualiza o BID principal

---

### 4.5 Document Library: `SmartBidAttachments`

**Propósito:** Armazenar documentos dos BIDs.

**Estrutura de pastas:**

```
SmartBidAttachments/
├── BID-2026-0001/
│   ├── Client-Documents/          # PDFs, specs do cliente
│   ├── Technical-Analysis/        # Documentos de análise
│   ├── Cost-Sheets/               # Planilhas de custo
│   ├── Proposals/                 # Propostas técnicas
│   ├── Approvals/                 # Documentos de aprovação assinados
│   └── Exports/                   # Exports gerados (Excel, PDF)
├── BID-2026-0002/
│   └── ...
└── Templates/                     # Arquivos base de templates
```

---

### 4.6 Resumo de Todas as Listas

| Lista                     | Propósito                        | Items Estimados | Padrão SF                  |
| ------------------------- | -------------------------------- | --------------- | -------------------------- |
| `smartbid-tracker`        | BIDs completos (JSON)            | ~200-500/ano    | `smartflow-flow-tracker`   |
| `smartbid-config`         | Config, membros, templates, logs | ~10 items fixos | `smartflow-config`         |
| `smartbid-status-tracker` | Notificações para Power Automate | ~1000+/ano      | `smartflow-status-tracker` |
| `smartbid-approvals`      | Aprovações individuais           | ~500+/ano       | **Novo**                   |
| `SmartBidAttachments`     | Document Library                 | Arquivos        | `SmartFlowAttachments`     |

---

## 5. Fluxo de Status e Fases do BID

### 5.1 Fases do BID (baseado na RACI)

O processo de BID é dividido em **5 fases principais** + **2 estados especiais**, mapeando diretamente a RACI da SSR:

| Fase      | Nome                   | Descrição                                    | Tasks RACI |
| --------- | ---------------------- | -------------------------------------------- | ---------- |
| `PHASE_0` | **Request**            | Comercial cria a solicitação                 | —          |
| `PHASE_1` | **Bid Kick Off**       | Reunião inicial, documentação, clarificações | 1.1 – 1.4  |
| `PHASE_2` | **Technical Analysis** | Análise de documentação, escopo, horas, GAP  | 2.1 – 2.8  |
| `PHASE_3` | **Cost & Resources**   | Levantamento de custos, recursos, Smart BID  | 3.1 – 3.11 |
| `PHASE_4` | **Technical Proposal** | Elaboração, revisão e aprovação da proposta  | 4.1 – 4.3  |
| `PHASE_5` | **Close Out**          | Fechamento técnico, entrega ao comercial     | 5.1        |

### 5.2 Status do BID

```typescript
enum BidStatus {
  // Phase 0: Request
  RequestSubmitted = "Request Submitted", // Comercial submeteu
  PendingAssignment = "Pending Assignment", // Aguardando owner da engenharia

  // Phase 1: Kick Off
  KickOff = "Kick Off", // Reunião inicial em andamento

  // Phase 2: Technical Analysis
  TechnicalAnalysis = "Technical Analysis", // Análise técnica ativa
  AwaitingClarification = "Awaiting Clarification", // Aguardando info do cliente

  // Phase 3: Cost & Resources
  CostGathering = "Cost Gathering", // Levantando custos e recursos
  BidElaboration = "BID Elaboration", // Elaborando o Smart BID
  UnderReview = "Under Review", // Em revisão técnica
  PendingApproval = "Pending Approval", // Aguardando aprovação stakeholders

  // Phase 4: Technical Proposal
  TechnicalProposal = "Technical Proposal", // Elaborando proposta técnica
  ProposalReview = "Proposal Review", // Proposta em revisão
  ProposalApproval = "Proposal Approval", // Proposta esperando aprovação

  // Phase 5: Close Out
  Completed = "Completed", // BID finalizado
  ReturnedToCommercial = "Returned to Commercial", // Entregue ao comercial

  // Special States
  OnHold = "On Hold", // Pausado (qualquer fase)
  Canceled = "Canceled", // Cancelado
  NoBid = "No Bid", // Decidido não fazer BID
  ReturnedForRevision = "Returned for Revision", // Devolvido para ajustes
}
```

### 5.3 Diagrama de Fluxo

```
                    ┌─────────────────────┐
                    │  COMERCIAL cria     │
                    │  Request            │
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
   PHASE 0         │  Request Submitted   │
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
                    │ Pending Assignment   │──────────┐
                    └─────────┬───────────┘          │
                              │ (Owner atribuído)    │ Reject → [No Bid]
                              │                      │
                    ┌─────────▼───────────┐          │
   PHASE 1         │     Kick Off         │          │
                    │  (Tasks 1.1 - 1.4)  │──────────┤
                    └─────────┬───────────┘          │
                              │                      │
                    ┌─────────▼───────────┐          │
   PHASE 2         │ Technical Analysis   │◄────┐    │
                    │  (Tasks 2.1 - 2.8)  │     │    │
                    └─────────┬───────────┘     │    ├──→ [On Hold]
                              │                 │    │     (qualquer fase)
                    ┌─────────▼───────────┐     │    │
                    │ Awaiting Clarif.     │─────┘    │
                    └─────────┬───────────┘          │
                              │                      │
                    ┌─────────▼───────────┐          │
   PHASE 3         │   Cost Gathering     │          │
                    │  (Tasks 3.1 - 3.8)  │          │
                    └─────────┬───────────┘          │
                              │                      │
                    ┌─────────▼───────────┐          │
                    │  BID Elaboration     │          │
                    │    (Task 3.9)        │          │
                    └─────────┬───────────┘          │
                              │                      │
                    ┌─────────▼───────────┐          │
                    │   Under Review       │          │
                    │    (Task 3.10)       │          │
                    └─────────┬───────────┘          │
                              │                      │
                    ┌─────────▼───────────┐          │
                    │  Pending Approval    │◄─────────┤
                    │    (Task 3.11)       │          │
                    └─────────┬───────────┘          │
                              │                      │
                    ┌─────────▼───────────┐          │
                    │  ✅ Approved ──────────────────┤
                    │  ❌ Rejected → [Returned]      │
                    │  🔄 Revision → [Under Review]  │
                    └─────────┬───────────┘          │
                              │                      │
                    ┌─────────▼───────────┐          │
   PHASE 4         │ Technical Proposal   │          │
                    │  (Tasks 4.1 - 4.3)  │          │
                    └─────────┬───────────┘          │
                              │                      │
                    ┌─────────▼───────────┐          │
                    │ Proposal Approval    │          │
                    └─────────┬───────────┘          │
                              │                      │
                    ┌─────────▼───────────┐          │
   PHASE 5         │    Completed         │          │
                    │    (Task 5.1)        │──────────┘
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
                    │ Returned to         │
                    │ Commercial          │ ← ENTREGA FINAL
                    └─────────────────────┘
```

---

## 6. Tasks RACI Integradas

Cada BID carrega um checklist de tasks baseado na RACI. O sistema pré-popula as tasks ao iniciar o BID, e os responsáveis vão marcando como completas.

### 6.1 Tasks por Fase

#### PHASE 1: BID KICK OFF

| Task | Descrição                       | Responsável Principal                               |
| ---- | ------------------------------- | --------------------------------------------------- |
| 1.1  | Send E-mail with Client Request | Commercial Coordinator (R), Tender Manager (A)      |
| 1.2  | Schedule a Kick Off Meeting     | Commercial Coordinator (R), Tender Manager (A)      |
| 1.3  | Consult Lessons Learned Portal  | Commercial Coordinator (R), Engineering Analyst (R) |
| 1.4  | Send Initial Clarification      | Commercial Coordinator (R), Tender Manager (A)      |

#### PHASE 2: TECHNICAL BID ANALYSIS

| Task | Descrição                                         | Responsável Principal                                 |
| ---- | ------------------------------------------------- | ----------------------------------------------------- |
| 2.1  | Client Documentation Analysis                     | Engineering team (C), ROV team (C), Survey team (R/C) |
| 2.2  | Elaboration of Clarifications on Client's Request | Engineering team (I/C), ROV team (C)                  |
| 2.3  | Elaboration ROV BID Checklist \*                  | Engineering (I/A), ROV team                           |
| 2.4  | Send Current Contract Inventory                   | Engineering (I), ROV team (A/R)                       |
| 2.5  | Scope of Supply Elaboration                       | Engineering (A/C/R), Survey team (A/R)                |
| 2.6  | Engineering Hours Estimation                      | Engineering (A/C/R), Survey team (A/R)                |
| 2.7  | Send Scope of Supply List                         | Engineering (A/I/R), Survey team (A/R)                |
| 2.8  | New Contract GAP Analysis Elaboration \*\*        | Engineering (I/A/R), ROV team (C)                     |

> \* Task 2.3 only if system not yet defined for the opportunity  
> \*\* Task 2.8 only for new contracts based on technical specification

#### PHASE 3: GATHERING COST, TIME AND RESOURCES

| Task | Descrição                                         | Responsável Principal                                           |
| ---- | ------------------------------------------------- | --------------------------------------------------------------- |
| 3.1  | Send In-House Asset based on Scope of Supply List | Equipment Coordinator (A/R/C)                                   |
| 3.2  | General PeopleSoft Asset Cost Verification        | Commercial Coordinator (A), Tender Supervisor (R)               |
| 3.3  | Request Costs for New Product (not in PSFT)       | Commercial Coordinator (A), Tender Supervisor (R), Supply Chain |
| 3.4  | Request SSR New System Costs                      | Engineering (I/A/R), Supply Chain                               |
| 3.5  | Request ROV Life Extension Costs / RTS            | Engineering (I/A/R)                                             |
| 3.6  | Request System Installation/Mob/Demob Costs       | Engineering (I/A/R)                                             |
| 3.7  | Responsibility Matrix Elaboration                 | ROV team (R/C), Engineering (I/A)                               |
| 3.8  | Onshore/Offshore Resource Planning                | ROV team (A/R/I), Engineering (I)                               |
| 3.9  | Smart BID Elaboration                             | Engineering (I), ROV team (A/R)                                 |
| 3.10 | Smart BID Review                                  | Engineering (I/C/A/R), ROV team (C)                             |
| 3.11 | Smart BID Approval                                | Engineering (A), multiple stakeholders (R)                      |

#### PHASE 4: TECHNICAL PROPOSAL

| Task | Descrição                      | Responsável Principal                |
| ---- | ------------------------------ | ------------------------------------ |
| 4.1  | Technical Proposal Elaboration | Engineering (A/R), Survey team (C/R) |
| 4.2  | Technical Proposal Review      | Engineering (A/R), ROV team (C)      |
| 4.3  | Technical Proposal Approval    | Engineering (A/R), Survey team (A/R) |

#### PHASE 5: TECHNICAL CLOSE OUT

| Task | Descrição                       | Responsável Principal                          |
| ---- | ------------------------------- | ---------------------------------------------- |
| 5.1  | Send Technical Close Out e-mail | Commercial Coordinator (R), Tender Manager (A) |

### 6.2 Modelo de Task no BID

```typescript
interface IBidTask {
  taskId: string; // "1.1", "2.3", "3.11"
  phase: BidPhase; // PHASE_1, PHASE_2, etc.
  name: string; // "Send E-mail with Client Request"
  description?: string; // Detalhe adicional
  status: "not-started" | "in-progress" | "completed" | "skipped" | "blocked";
  isRequired: boolean; // Obrigatória ou condicional
  condition?: string; // Ex: "Only if system not defined"

  // Responsáveis (RACI)
  responsible?: IPerson[]; // R — Quem executa
  accountable?: IPerson; // A — Quem aprova/responde
  consulted?: IPerson[]; // C — Consultados
  informed?: IPerson[]; // I — Informados

  // Tracking
  assignedTo?: string; // Email do responsável principal
  startDate?: string;
  completedDate?: string;
  dueDate?: string;
  comments?: string;
  attachments?: string[];
}
```

---

## 7. Sistema de Aprovação

### 7.1 Visão Geral

O sistema de aprovação suporta múltiplos stakeholders com notificação via **Microsoft Teams** (Adaptive Cards) e aprovação direta no **Smart BID 2.0**.

### 7.2 Tipos de Aprovação

| Tipo                            | Fase                | Descrição                             |
| ------------------------------- | ------------------- | ------------------------------------- |
| **BID Approval**                | Phase 3 (Task 3.11) | Aprovação do Smart BID compilado      |
| **Technical Proposal Approval** | Phase 4 (Task 4.3)  | Aprovação da proposta técnica         |
| **High Value Override**         | Qualquer            | Aprovação extra para BIDs > threshold |

### 7.3 Stakeholders Padrão

| Papel                            | Obrigatório | Quando                                |
| -------------------------------- | ----------- | ------------------------------------- |
| **Engineering Manager**          | Sim         | Sempre                                |
| **Commercial Manager**           | Sim         | Sempre                                |
| **Project Manager (ROV/Survey)** | Condicional | Quando divisão envolve ROV ou Survey  |
| **OPG Manager**                  | Condicional | Quando divisão = OPG                  |
| **Director**                     | Condicional | Quando valor > threshold configurável |

### 7.4 Fluxo de Aprovação

```
┌──────────────────────────────────────────────────────┐
│                   Owner clica                        │
│               "Request Approval"                     │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│  Sistema identifica stakeholders obrigatórios        │
│  baseado em: divisão, valor, regras de config        │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│  Para cada stakeholder:                              │
│  1. Cria item em smartbid-approvals (Status=pending) │
│  2. Power Automate envia Adaptive Card no Teams      │
│  3. Card mostra: BID info, custos, botões de ação    │
└────────────────────┬─────────────────────────────────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
     ┌─────────┐ ┌─────────┐ ┌──────────┐
     │ Via      │ │ Via      │ │ Via      │
     │ Teams    │ │ SmartBid │ │ Email    │
     │ Card     │ │ 2.0 Web  │ │ Link    │
     └────┬────┘ └────┬────┘ └────┬─────┘
          │           │           │
          └───────────┼───────────┘
                      ▼
┌──────────────────────────────────────────────────────┐
│  Decisão gravada:                                    │
│  - Quem aprovou (nome, email, foto)                  │
│  - Quando (timestamp)                                │
│  - Decisão (Approved / Rejected / Request Revision)  │
│  - Comentários                                       │
│  - Canal (Teams / SmartBid / Email)                  │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│  Todos obrigatórios aprovaram?                       │
│  ✅ SIM → Status: Approved → Próxima fase           │
│  ❌ Algum rejeitou → Returned for Revision          │
│  ⏳ Pendente → Reminder em 24h (configurável)       │
│     → Escalar após 72h para manager acima            │
└──────────────────────────────────────────────────────┘
```

### 7.5 Adaptive Card do Teams (exemplo)

```json
{
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    {
      "type": "Container",
      "style": "emphasis",
      "items": [
        {
          "type": "TextBlock",
          "text": "🔔 SMART BID — Approval Required",
          "size": "Medium",
          "weight": "Bolder"
        }
      ]
    },
    {
      "type": "FactSet",
      "facts": [
        { "title": "BID", "value": "BID-2026-0042" },
        { "title": "Client", "value": "Petrobras" },
        { "title": "Project", "value": "ROV Inspection - Marlim Field" },
        { "title": "Division", "value": "SSR-ROV" },
        { "title": "Total Cost", "value": "USD 278,740.00" },
        { "title": "Due Date", "value": "March 25, 2026" },
        { "title": "Requested By", "value": "João Silva" }
      ]
    },
    {
      "type": "TextBlock",
      "text": "Please review and approve this BID.",
      "wrap": true
    },
    {
      "type": "Input.Text",
      "id": "comments",
      "placeholder": "Comments (optional)...",
      "isMultiline": true
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "✅ Approve",
      "data": { "action": "approve" },
      "style": "positive"
    },
    {
      "type": "Action.Submit",
      "title": "❌ Reject",
      "data": { "action": "reject" },
      "style": "destructive"
    },
    {
      "type": "Action.Submit",
      "title": "🔄 Request Revision",
      "data": { "action": "revision" }
    },
    {
      "type": "Action.OpenUrl",
      "title": "📂 Open in SmartBid",
      "url": "https://..."
    }
  ]
}
```

---

## 8. Sistema de Templates de Equipamento

### 8.1 Conceito

Templates são **listas pré-configuradas de equipamentos, horas e custos** para operações recorrentes. Quando um BID similar chega, o usuário importa o template e ajusta conforme necessário.

### 8.2 Modelo do Template

```typescript
interface IBidTemplate {
  id: string; // "template-multibeam-standard"
  name: string; // "Multibeam Survey - Standard Package"
  description: string; // "Standard equipment for multibeam..."
  division: string; // "SSR-Survey"
  serviceLine: string; // "Multibeam"
  category: string; // "Survey Operations"

  // Equipment list
  equipmentList: ITemplateEquipment[];

  // Hours template (optional)
  hoursTemplate?: IHoursEstimate;

  // Estimated cost range
  estimatedCostRange?: {
    min: number;
    max: number;
    currency: string;
  };

  // Metadata
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  version: number;
  usageCount: number; // Quantas vezes foi usado
  lastUsedDate?: string;
  tags: string[]; // ["multibeam", "survey", "standard"]
  isActive: boolean;
}

interface ITemplateEquipment {
  partNumber: string; // "MB-SYS-001"
  description: string; // "Multibeam Echosounder System"
  category: string; // "Survey Equipment"
  defaultQuantity: number; // 1
  unit: string; // "pcs", "set", "lot"
  estimatedUnitCost: number; // 45000.00
  source: "In-House" | "Rental" | "Purchase" | "Third Party";
  isRequired: boolean; // Obrigatório no template?
  notes?: string; // "Available at Macaé base"
  alternatives?: string[]; // Part numbers alternativos
}
```

### 8.3 Templates Pré-configurados (Exemplos)

| Template                    | Divisão        | Service Line | Items     |
| --------------------------- | -------------- | ------------ | --------- |
| Multibeam Survey - Standard | SSR-Survey     | Multibeam    | ~15 items |
| ROV Inspection Campaign     | SSR-ROV        | IMR          | ~20 items |
| UWILD Package               | SSR-ROV        | UWILD        | ~12 items |
| Subsea Tooling - Basic      | SSR-ROV        | Tooling      | ~18 items |
| Survey Positioning - DP     | SSR-Survey     | Survey       | ~10 items |
| OPG Installation Support    | OPG            | Installation | ~25 items |
| Integrated ROV + Survey     | SSR-Integrated | IMR + Survey | ~30 items |

### 8.4 Fluxo de Uso

```
   Usuário editando BID → Tab "Assets & Tooling"
                          │
                          ▼
              [📦 Import from Template]
                          │
                          ▼
             ┌────────────────────────┐
             │  Template Browser      │
             │  - Search/Filter       │
             │  - By Division         │
             │  - By Service Line     │
             │  - By Usage Count      │
             └────────────┬───────────┘
                          │ Seleciona template
                          ▼
             ┌────────────────────────┐
             │  Template Preview      │
             │  - Lista de items      │
             │  - Checkboxes          │
             │  - Ajustar quantities  │
             │  - Remover desnecessá. │
             └────────────┬───────────┘
                          │ Confirma
                          ▼
             ┌────────────────────────┐
             │  Import realizado!     │
             │  Items adicionados ao  │
             │  equipmentList do BID  │
             │  (merge se já existir) │
             └────────────────────────┘
```

### 8.5 Página de Templates (Sidebar: "Templates Library")

```
┌──────────────────────────────────────────────────────────────┐
│  Templates Library                     [+ Create Template]    │
│  Manage pre-configured equipment packages for common BIDs    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [🔍 Search...]   [Division ▼]   [Service Line ▼]           │
│                                                              │
│  ┌─────────────────────────────────┐  ┌──────────────────┐  │
│  │ 📦 Multibeam Survey - Standard  │  │ 📦 ROV Inspection│  │
│  │ SSR-Survey · Multibeam          │  │ SSR-ROV · IMR    │  │
│  │ 15 items · Est. $120-180k       │  │ 20 items         │  │
│  │ Used 23 times · Last: 2 days ago│  │ Used 45 times    │  │
│  │ Created by: J. Silva            │  │ By: R. Costa     │  │
│  │                                 │  │                  │  │
│  │ [✏ Edit] [📋 Clone] [📊 Stats] │  │ [✏ Edit] [📋]   │  │
│  └─────────────────────────────────┘  └──────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 9. KPIs Otimizados para BID

> **Dashboard UX/UI Best Practices Aplicadas (2025-2026):**
>
> - **Bento Grid Layout:** KPI cards em grid responsivo com tamanhos variados (2-col wide para Pipeline Value, 1-col para contadores)
> - **Progressive Disclosure:** Dashboard mostra overview → click para drill-down (BID Detail, Analytics)
> - **Animated Counters:** Framer Motion `useCountUp` para números rolando ao carregar (padrão SmartFlow KPICard)
> - **Sparklines:** Micro-gráficos SVG inline em cada KPI card mostrando tendência dos últimos 30 dias
> - **Target Progress Bars:** Barra visual mostrando progresso em relação ao target configurável
> - **Contextual Color Coding:** Verde/Amarelo/Vermelho baseado em thresholds (ex: On-Time > 90% = verde)
> - **Comparison Arrows:** ▲ +12% ou ▼ -5% comparando com período anterior (mês, trimestre)
> - **Relative Timestamps:** "3m ago", "2h ago" na atividade recente (padrão SmartFlow)
> - **Skeleton Loading:** Shimmer placeholders durante data fetch (TanStack Query loading states)
> - **Empty States:** Ilustrações SVG + CTA quando não há dados
> - **Responsive Breakpoints:** 3-col KPIs em desktop (1920px+), 2-col em laptop (1024px), 1-col em tablet (768px)
> - **Keyboard Navigation:** Tab focus traversal entre KPI cards e seções
> - **Print/Export Ready:** Layout adapta para impressão sem sidebar/header
> - **Real-time Indicators:** Dot pulsante para BIDs com atividade recente, countdown timer para deadlines

### 9.1 KPIs do Dashboard Principal

| #   | KPI                          | Fórmula                                                                      | Target Padrão | Cor              |
| --- | ---------------------------- | ---------------------------------------------------------------------------- | ------------- | ---------------- |
| 1   | **Total Active BIDs**        | Count where status not in [Completed, Canceled, NoBid, ReturnedToCommercial] | —             | Teal             |
| 2   | **Avg. Completion Time**     | Avg(completedDate - createdDate) em dias úteis                               | ≤ 15 days     | Blue             |
| 3   | **On-Time Delivery Rate**    | (BIDs completed ≤ dueDate) / (Total completed) × 100                         | ≥ 90%         | Green/Yellow/Red |
| 4   | **OTIF**                     | (BIDs on-time AND all tasks completed) / Total × 100                         | ≥ 85%         | Green/Yellow/Red |
| 5   | **First-Pass Approval Rate** | (BIDs approved without revision) / (Total submitted for approval) × 100      | ≥ 80%         | Green            |
| 6   | **Pending Requests**         | Count where status = RequestSubmitted or PendingAssignment                   | ≤ 3           | Orange           |
| 7   | **Avg. Approval Cycle**      | Avg(all approvals respondedDate - requestedDate) em dias                     | ≤ 3 days      | Blue             |
| 8   | **Overdue BIDs**             | Count where dueDate < now AND status not terminal                            | 0             | Red              |
| 9   | **Template Usage Rate**      | (BIDs with templateUsed) / (Total BIDs) × 100                                | ≥ 60%         | Purple           |
| 10  | **Pipeline Value**           | Sum(costSummary.totalCostUSD) of active BIDs                                 | —             | Teal             |
| 11  | **Win Rate**                 | (BIDs with outcome=Won) / (Total with result ≠ Pending) × 100                | ≥ 40%         | Green            |
| 12  | **Avg. PTAX**                | Current PTAX rate (updated monthly)                                          | Informativo   | Blue             |

### 9.2 KPIs por Divisão

| KPI                   | Descrição                                                          |
| --------------------- | ------------------------------------------------------------------ |
| **Division Load**     | BIDs ativos por divisão (OPG, SSR-Survey, SSR-ROV, SSR-Integrated) |
| **Division On-Time**  | On-time rate por divisão                                           |
| **Division Avg Time** | Tempo médio por divisão                                            |
| **Division Backlog**  | Requests pendentes por divisão                                     |

### 9.3 KPIs Pessoais (My Dashboard)

| KPI                       | Descrição                                |
| ------------------------- | ---------------------------------------- |
| **My Active BIDs**        | BIDs onde sou owner                      |
| **My Completion Rate**    | % completados no prazo                   |
| **My Pending Approvals**  | Aprovações aguardando minha resposta     |
| **My Avg Phase Duration** | Tempo médio que gasto em cada fase       |
| **My Tasks Today**        | Tasks da RACI atribuídas a mim para hoje |

### 9.4 KPIs de Analytics (Insights)

| KPI                     | Página              | Descrição                                                         |
| ----------------------- | ------------------- | ----------------------------------------------------------------- |
| **Phase Bottleneck**    | Bottleneck Analysis | Qual fase demora mais em média                                    |
| **Approval Bottleneck** | Bottleneck Analysis | Qual stakeholder demora mais para aprovar                         |
| **Win Rate**            | Performance Trends  | % de BIDs que resultaram em contrato (precisa feedback comercial) |
| **Cost Accuracy**       | Performance Trends  | Desvio entre estimado e real (quando disponível)                  |
| **Team Utilization**    | Team Analytics      | Carga de trabalho por membro da equipe                            |
| **BID Velocity**        | Performance Trends  | BIDs completados por mês (tendência)                              |
| **Revision Rate**       | Performance Trends  | % de BIDs devolvidos para revisão                                 |
| **Client Distribution** | Performance Trends  | Volume por cliente                                                |

---

## 10. Exportação para o Comercial

### 10.1 Formatos de Export

| Formato             | Conteúdo                                                        | Uso Principal                               |
| ------------------- | --------------------------------------------------------------- | ------------------------------------------- |
| **Excel Detalhado** | Multi-tab: Assets, Hours (Eng/Onshore/Offshore), Costs, Summary | Para o comercial importar na planilha deles |
| **Excel Resumo**    | KPIs, valores totais, timeline                                  | Report gerencial                            |
| **PDF Proposta**    | Documento formatado com branding                                | Proposta técnica para cliente               |
| **PDF BID Report**  | Relatório interno completo                                      | Arquivo interno                             |
| **CSV**             | Dados tabulares puros                                           | Importação em outros sistemas               |

> **Nota importante:** O Smart BID **não lida com preço final ao cliente**. O export de custos serve para o Comercial inputar na planilha deles e aplicar margem/markup fora do sistema.

### 10.2 Export Excel para Comercial (Estrutura Multi-Tab)

O export principal gera um Excel com múltiplas abas **espelhando a estrutura real do SmartBid 1.0**:

| Aba                     | Colunas Principais                                                                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Summary**             | BID#, CRM#, Client, Project, Division, Service Line, Type, Region, Vessel, Field, Water Depth, Op. Start Date, Duration, Status, Due Date, Total Cost USD/BRL, PTAX                                                                   |
| **Assets - Tooling**    | #, Requirement, Eng Study, PN, Tool, Sub-Category, Qty Oper, Qty Spare, Qty Hand, Qty Buy, Acq. Type, Lead Time, Unit Cost USD, Total Cost USD, Cost Ref, Cost Method, Orig. Cost, Orig. Currency, Cost Date, CAPEX/OPEX, Status Flag |
| **Hours - Engineering** | #, Requirement, Function, Phase, Hours/Day, Ppl Qty, Work Days, Util%, Total Hours, Cost R$, Notes                                                                                                                                    |
| **Hours - Onshore**     | #, Requirement, Function, Phase, Hours/Day, Ppl Qty, Work Days, Util%, Total Hours, Cost R$, Notes                                                                                                                                    |
| **Hours - Offshore**    | #, Requirement, Function, Phase, Hours/Day, Ppl Qty, Work Days, Util%, Total Hours, Cost R$, Notes                                                                                                                                    |
| **Cost Summary**        | Category, USD, BRL (Assets CAPEX, Assets OPEX, Eng Hours, Onshore Hours, Offshore Hours)                                                                                                                                              |
| **BID Notes**           | Section Title, Content (Gap Analysis, Qualifications, Contract Differences, etc.)                                                                                                                                                     |
| **Approval History**    | Approver, Role, Decision, Date, Comments, Channel                                                                                                                                                                                     |
| **Activity Log**        | Date, Action, Actor, Details                                                                                                                                                                                                          |

### 10.3 Bulk Export

- Export de múltiplos BIDs em um único Excel (1 BID por aba, + aba resumo)
- Filtro por período, divisão, status
- Disponível na página Reports

---

## 11. FlowBoard (Adaptado do SmartFlow)

### 11.1 Reuso

O componente **FlowBoard** do SmartFlow é adaptado para o Smart BID como **BID Board** — um panorama em tempo real de todos os BIDs por divisão e status.

### 11.2 Colunas do Board

**Modo por Divisão (default):**

```
┌────────────┬────────────┬────────────┬────────────────┬──────────┐
│    OPG     │ SSR-Survey │  SSR-ROV   │ SSR-Integrated │ On Hold  │
│  (5 BIDs)  │  (3 BIDs)  │  (8 BIDs)  │   (2 BIDs)     │ (1 BID)  │
├────────────┼────────────┼────────────┼────────────────┼──────────┤
│  BID Cards │  BID Cards │  BID Cards │   BID Cards    │ BID Cards│
│  sorted by │  sorted by │  sorted by │   sorted by    │          │
│  priority  │  priority  │  priority  │   priority     │          │
└────────────┴────────────┴────────────┴────────────────┴──────────┘
```

**Modo por Status (Kanban):**

```
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ Kick Off │ Tech.    │ Cost     │ Review/  │ Proposal │ Completed│
│          │ Analysis │ Gathering│ Approval │          │          │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Cards    │ Cards    │ Cards    │ Cards    │ Cards    │ Cards    │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

### 11.3 Features Preservadas do SmartFlow

- Auto-refresh 30s
- Smart sorting (overdue → priority → due date)
- Color coding por status/prioridade
- Click to open BID detail panel
- Relative time display ("3m ago", "2h ago")
- Responsive com scroll horizontal

---

## 12. Divisões e Structure Organizacional

### 12.1 Divisões de BID

| Divisão              | Código           | Cor                | Service Lines Associadas                             |
| -------------------- | ---------------- | ------------------ | ---------------------------------------------------- |
| **OPG**              | `OPG`            | `#3B82F6` (Blue)   | Installation, Decommissioning, Construction, Tooling |
| **SSR - Survey**     | `SSR-Survey`     | `#10B981` (Green)  | Survey, Multibeam, Positioning                       |
| **SSR - ROV**        | `SSR-ROV`        | `#F59E0B` (Amber)  | IMR, UWILD, Controls, Tooling                        |
| **SSR - Integrated** | `SSR-Integrated` | `#8B5CF6` (Purple) | IMR + Survey, Installation (combined)                |

### 12.2 Roles do Sistema

| Role             | Código        | Descrição                             | Acesso                             |
| ---------------- | ------------- | ------------------------------------- | ---------------------------------- |
| **Manager**      | `manager`     | Eng. Manager, liderança               | Full access, config, approvals     |
| **Engineer**     | `engineer`    | Eng. Lead, Engineer                   | Edit BIDs, templates, equipments   |
| **Bidder**       | `bidder`      | Comercial, Tender Manager             | Create requests, view BIDs, export |
| **Project Team** | `projectTeam` | Project Mgr, Coordinator (ROV/Survey) | View BIDs, approve, comment        |
| **Viewer**       | `viewer`      | Stakeholders gerais                   | View only                          |
| **Guest**        | `guest`       | Não registrado                        | Demo mode, mock data               |

### 12.3 Teams Envolvidos (da RACI)

| Time                  | Membros                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Commercial Team**   | Tender Manager, Commercial Coordinator, Tender Supervisor                                                                |
| **Engineering Team**  | Engineering Manager, Engineering Lead, Engineer, Engineering Analyst                                                     |
| **ROV Team**          | Project Manager, Project Coordinator, Operation Manager, Operation Coordinator, Equipment Manager, Equipment Coordinator |
| **SSR Support Team**  | Workshop Manager, Technical Support Manager, Installation Manager, Fleet Manager                                         |
| **Survey Team**       | Project Manager, Project Surveyor, Operations Manager, Survey Data Supervisor                                            |
| **Supply Chain Team** | Supply Chain Manager, Procurement/Production Coordinator, Buyer/Material Planner                                         |

---

## 13. Notificações e Power Automate

### 13.1 Tipos de Notificação

| Tipo                 | Trigger                | Canal                           | Prioridade   |
| -------------------- | ---------------------- | ------------------------------- | ------------ |
| `BID_CREATED`        | Novo BID               | In-app + Teams                  | Normal       |
| `BID_ASSIGNED`       | Owner atribuído        | In-app + Teams                  | Normal       |
| `STATUS_CHANGED`     | Mudança de status      | In-app                          | Normal       |
| `PHASE_CHANGED`      | Mudança de fase        | In-app + Teams                  | Normal       |
| `APPROVAL_REQUESTED` | Aprovação solicitada   | In-app + **Teams Card** + Email | **High**     |
| `APPROVAL_RESPONSE`  | Aprovação respondida   | In-app + Teams                  | High         |
| `BID_COMPLETED`      | BID finalizado         | In-app + Teams                  | Normal       |
| `BID_OVERDUE`        | BID passou do prazo    | In-app + **Teams**              | **Critical** |
| `BID_CANCELLED`      | BID cancelado          | In-app + Teams                  | Normal       |
| `BID_RETURNED`       | Devolvido para revisão | In-app + Teams                  | High         |
| `DEADLINE_WARNING`   | 48h/24h antes do prazo | In-app + Teams                  | High         |
| `HIGH_PRIORITY`      | BID urgente criado     | In-app + Teams                  | Critical     |
| `COMMENT_ADDED`      | Novo comentário        | In-app                          | Low          |
| `EQUIPMENT_UPDATED`  | Equipamento alterado   | In-app                          | Low          |
| `COST_UPDATED`       | Custos atualizados     | In-app                          | Normal       |
| `TEMPLATE_IMPORTED`  | Template importado     | In-app                          | Low          |
| `REMINDER_SENT`      | Lembrete de aprovação  | Teams                           | Normal       |

### 13.2 Power Automate Flows Necessários

| Flow                    | Trigger                                                           | Ação                                              |
| ----------------------- | ----------------------------------------------------------------- | ------------------------------------------------- |
| **Approval Request**    | Item criado em `smartbid-approvals` (Status=pending)              | Envia Adaptive Card no Teams                      |
| **Approval Response**   | Item modificado em `smartbid-approvals` (via Teams)               | Atualiza BID principal, notifica owner            |
| **Deadline Warning**    | Scheduled (diário, 8h)                                            | Verifica BIDs com DueDate < 48h, cria notificação |
| **Overdue Alert**       | Scheduled (diário, 9h)                                            | Verifica BIDs overdue, notifica manager + owner   |
| **Approval Reminder**   | Scheduled (diário, 10h)                                           | Reenvia card para approvals pending > 24h         |
| **Status Notification** | Item criado em `smartbid-status-tracker`                          | Envia Teams message para stakeholders             |
| **New BID Alert**       | Item criado em `smartbid-status-tracker` (ChangeType=BID_CREATED) | Notifica managers                                 |

---

## 14. Páginas Detalhadas

### 14.1 Sidebar Navigation (Atualizada)

> **Princípio de navegação:** A sidebar contém apenas **páginas de nível superior** — panoramas, listas e configurações. Tudo que é **específico de um BID individual** (scope, horas, custos, aprovações, timeline) fica dentro das **tabs do BID Detail**, acessíveis ao clicar em um BID para abri-lo.

```
┌─────────────────────────────┐
│  ◆ SMART BID                │
│  Oceaneering · Engineering  │
├─────────────────────────────┤
│  + Create Request           │  ← Gradient teal (bidder/manager)
│                             │
│  WORKSPACE                  │
│  📋 BID Tracker             │  ← Kanban/List/Table (visão geral)
│  📊 FlowBoard               │  ← Board panorâmico (do SmartFlow)
│  📂 Unassigned Requests     │  (badge: 3)
│  📊 My Dashboard            │  ← Dashboard pessoal do usuário logado
│  🏆 BID Results             │  ← Follow-up / outcomes pós-entrega
│  🔔 Notifications           │
│  ❓ FAQ & Instructions      │
│                             │
│  TEMPLATES                  │
│  📦 Templates Library       │  ← Templates de equipamento
│                             │
│  KNOWLEDGE BASE             │
│  📑 Datasheets (86)         │
│  📁 Past Bids (200)         │
│  ❓ Qualifications (143)    │
│  🔧 Manuals (57)            │
│  ⚠ Op. Alerts (29)          │
│                             │
│  INSIGHTS                   │
│  📈 Analytics          ▼    │
│    ├ Performance Trends     │
│    ├ Bottleneck Analysis    │
│    ├ Team Analytics         │
│                             │
│  REPORTS                    │
│  📊 Reports & Export   ▼    │
│    ├ Period Performance     │
│    ├ BID Details            │
│    └ Operational Summary    │
│                             │
│  TOOLS                      │
│  ⭐ Favorites               │
│  💰 Quotations              │
│  🔧 Tooling Report          │
│  💲 Price Consulting         │
│                             │
│  SETTINGS                   │
│  ⚙ System Configuration     │
│  👥 Members Management       │
│  📋 Patch Notes              │
│                             │
│  [🌙/☀] Dark/Light          │
│  OCEANEERING                │
│  Created by R. Costa        │
└─────────────────────────────┘
```

**Mudanças em relação à versão anterior:**

- ❌ Removido **Timeline View** da sidebar → agora é a tab "Timeline & Milestones" dentro do BID Detail
- ❌ Removido **Approvals** da sidebar → agora é a tab "Approval" dentro do BID Detail + seção "Pending Approvals" no My Dashboard
- Total de páginas na sidebar: **16 páginas** (incluindo sub-menus Analytics e Reports)

### 14.2 BID Detail Page — Tabs (`/bid/:id`)

> **Referência de estrutura:** O `OrderDetailsModal.tsx` do SmartFlow (625 linhas) serve de base para o padrão visual: header com ícone + título, seções condicionais, timeline horizontal, tabela de detalhes, e seções de histórico. O `MembersManagement.tsx` (1334 linhas) serve de referência para padrões CRUD com stat cards, People Picker, dialogs de edição/adição, e access control.

O BID Detail é a **página central do sistema** — todas as seções de trabalho de um BID individual ficam aqui dentro, organizadas em tabs. Ao clicar em um BID no Tracker/FlowBoard, o usuário entra nesta página.

| #   | Tab                       | Conteúdo Detalhado                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Overview**              | Header gradient com BID#, Client, Project Name, status badge, priority badge. Cards: Opportunity Info (Region, Vessel, Field, Water Depth, Op. Start Date, Duration, Currency/PTAX), pessoas envolvidas (Owner, Bidder, Reviewers com avatar), KPIs rápidos (% completion, dias restantes, horas totais, custo total). Qualificações necessárias (HSE, ANVISA, ISO).                                                                                           |
| 2   | **Scope of Supply**       | **Tabela principal de equipamentos (Assets & Tooling)** — TanStack Table com colunas: #, Requirement, Eng Study, PN, Tool Name, Sub-Category, Qty Oper, Qty Spare, Qty Hand, Qty Buy, Acq. Type, Lead Time, Unit Cost USD, Total Cost USD, Cost Ref, Cost Method, Orig. Cost/Currency, CAPEX/OPEX, Status Flag. Ações: Add row, Import from Template, Bulk edit. Summary cards no topo: Total Assets, CAPEX Total, OPEX Total, Items by Category (donut mini). |
| 3   | **Hours & Resources**     | **3 sub-tabs:** Engineering, Onshore, Offshore. Cada sub-tab tem: TanStack Table com colunas: #, Requirement, Function (dropdown config), Phase (dropdown config), Hours/Day, Ppl Qty, Work Days, Util%, Total Hours (calculado), Cost R$ (calculado), Notes. Summary bar: Total Hours, Total Cost BRL, Avg Utilization. Filtro por divisão (All/OPG/ROV/Survey).                                                                                              |
| 4   | **Cost Summary**          | Compilação final em cards grandes: Assets CAPEX (USD), Assets OPEX (USD), Engineering Hours (BRL→USD), Onshore Hours (BRL→USD), Offshore Hours (BRL→USD) = **Grand Total USD + BRL**. PTAX info card. Tabela breakdown por categoria. Gráfico de pizza com distribuição de custos. Comparação visual CAPEX vs OPEX (stacked bar).                                                                                                                              |
| 5   | **Tasks & Phases**        | Checklist RACI por fase (5 fases). Cada fase: progress bar, responsible/accountable indicators, tasks individuais com checkbox + owner + due date. % completion geral. Visual tipo Kanban mini: colunas por fase com cards de task.                                                                                                                                                                                                                            |
| 6   | **Timeline & Milestones** | Gantt chart visual do BID: fases com duração, milestones (kick-off, mid-review, approval, delivery), datas planejadas vs reais, deadline marker. Timeline horizontal estilo `OrderDetailsModal.tsx`: step circles com status icons, connectors, duration per step, total elapsed time. Critical path highlight.                                                                                                                                                |
| 7   | **Approval**              | Status dos aprovadores (cards com avatar, nome, role, status: pending/approved/rejected/revision, date). Botão "Request Approval" (gera item em smartbid-approvals + trigger PA). Timeline de aprovação. Histórico de todas as rodadas. Badge "Approved" ou "Pending" geral.                                                                                                                                                                                   |
| 8   | **Documents**             | Upload/download categorizado em pastas (Client Documents, Technical Analysis, Cost Sheets, Proposals, Approvals, Exports). Drag-and-drop upload. Preview de PDF inline. Metadata: file name, size, uploaded by, date. Categorias configuráveis via SystemConfig.                                                                                                                                                                                               |
| 9   | **Comments**              | Thread de comentários com data, hora, avatar+nome+role de quem comentou. Tags de fase/seção (dropdown config). @mentions com autocomplete de membros. Rich text mínimo (bold, italic, links). Filtro por seção (General, Costs, Hours, Assets, Approval, Technical, Clarification).                                                                                                                                                                            |
| 10  | **BID Notes (Analysis)**  | Seções de notas de análise freeform configuráveis: Gap Analysis, Qualifications to Vessel Owner, Contract Differences, Technical Assumptions, Commercial Observations, Custom sections. Cada seção: título + editor de texto rico. Template de seções puxado do SystemConfig (`bidNotesSections`).                                                                                                                                                             |
| 11  | **Qualifications**        | Lista de qualificações necessárias para a oportunidade: HSE, ANVISA, ISO 9001, DNV, client-specific certifications. Checklist com status (met/not met/in progress). Linked documents.                                                                                                                                                                                                                                                                          |
| 12  | **AI Analysis**           | Painel de IA (placeholder para fase futura). Botão "Analyze Scope" → loading → resultado mock. Sugestões de equipamentos similares baseados em Past Bids. Estimativa de horas baseada em histórico.                                                                                                                                                                                                                                                            |
| 13  | **Activity Log**          | Timeline completa de todas as ações neste BID (padrão SmartFlow OrderTimeline): data, hora, ator (avatar+nome), ação, detalhes. Filtro por tipo de ação. Auto-gerado por cada operação (status change, comment, approval, equipment edit, etc.).                                                                                                                                                                                                               |
| 14  | **Export**                | Botões de exportação: Excel completo multi-tab (ver seção 10.2), PDF proposta, PDF report interno, CSV. Preview antes de exportar. Histórico de exports anteriores salvos na pasta `Exports/` do BID.                                                                                                                                                                                                                                                          |

### 14.3 Dashboard Principal — Wireframe Detalhado (`/`)

> **Referência:** BID Tracker Overview (exemplo do usuário), adaptado para o escopo de Engenharia (sem valores comerciais).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HEADER (64px)                                                              │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │                                                                  │
│ SIDEBAR  │  "Good Morning, Raphael"                                        │
│          │  BID Tracker · Overview                                          │
│          │  Last updated: Apr 2, 2026 09:30 [🔄]                            │
│          │                                                                  │
│          │  ┌─ FILTROS GLOBAIS ──────────────────────────────────────────┐  │
│          │  │ [Cliente ▼] [Divisão ▼] [Status ▼] [Período ▼] [🔍 Busca] │  │
│          │  │ [Novo BID Request] [Export Excel] [Export PDF]              │  │
│          │  └────────────────────────────────────────────────────────────┘  │
│          │                                                                  │
│          │  ┌─ LINHA 1: KPI CARDS (Bento Grid, 6 cards) ───────────────┐  │
│          │  │                                                           │  │
│          │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │  │
│          │  │  │BIDs Ativos│ │Horas Eng │ │On-Time % │ │BIDs em Risco │ │  │
│          │  │  │    23    │ │  1,240h  │ │   91%    │ │  ⚠ 3        │ │  │
│          │  │  │ ▲ +3 mês │ │ ▲ +15%   │ │ 🟢 ≥90% │ │  🔴 prazo   │ │  │
│          │  │  │ ~~spark~~│ │ ~~spark~~│ │ ~~spark~~│ │  countdown  │ │  │
│          │  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘ │  │
│          │  │  ┌──────────┐ ┌──────────────────────┐                   │  │
│          │  │  │Win Rate  │ │ Pipeline Value (2-col)│                   │  │
│          │  │  │   43%    │ │  $2.4M USD active     │                   │  │
│          │  │  │ 🟡 <40% │ │  12 BIDs em pipeline  │                   │  │
│          │  │  └──────────┘ └──────────────────────┘                   │  │
│          │  └───────────────────────────────────────────────────────────┘  │
│          │                                                                  │
│          │  ┌─ LINHA 2: PIPELINE + WORKLOAD (2 colunas) ───────────────┐  │
│          │  │                                                           │  │
│          │  │  ┌── Esquerda (60%) ────────┐  ┌── Direita (40%) ──────┐ │  │
│          │  │  │ Pipeline por Estágio     │  │ Horas por Divisão     │ │  │
│          │  │  │ (Bar chart horizontal)   │  │ (Donut chart)         │ │  │
│          │  │  │                          │  │                       │ │  │
│          │  │  │ Request    ███░░░  4     │  │    ┌─────────┐        │ │  │
│          │  │  │ Kick-Off   ██░░░░  2     │  │    │  OPG    │ 35%   │ │  │
│          │  │  │ Analysis   █████░  6     │  │    │ SSR-ROV │ 30%   │ │  │
│          │  │  │ Cost Gath. ███░░░  3     │  │    │ Survey  │ 25%   │ │  │
│          │  │  │ Elaboration████░░  5     │  │    │ Integr. │ 10%   │ │  │
│          │  │  │ Approval   ██░░░░  2     │  │    └─────────┘        │ │  │
│          │  │  │ Completed  ████████ 12   │  │                       │ │  │
│          │  │  │                          │  │ Toggle: 7/30/90 dias  │ │  │
│          │  │  │ Click barra → filtra tab │  │                       │ │  │
│          │  │  └──────────────────────────┘  └───────────────────────┘ │  │
│          │  └───────────────────────────────────────────────────────────┘  │
│          │                                                                  │
│          │  ┌─ LINHA 3: ATIVIDADE + DEADLINES (2 colunas) ─────────────┐  │
│          │  │                                                           │  │
│          │  │  ┌── Recent Activity (60%) ─┐  ┌── Upcoming DL (40%) ──┐ │  │
│          │  │  │ Timeline vertical:       │  │ Lista com countdown:  │ │  │
│          │  │  │                          │  │                       │ │  │
│          │  │  │ 🟢 2h ago               │  │ ⚠ BID-0050 Shell     │ │  │
│          │  │  │ BID-0042 → "Under Review"│  │   Due in 2 days      │ │  │
│          │  │  │ por J. Silva             │  │                       │ │  │
│          │  │  │                          │  │ 🔴 BID-0048 Petrobras│ │  │
│          │  │  │ 🔵 3h ago               │  │   OVERDUE by 1 day   │ │  │
│          │  │  │ BID-0039 → New approval │  │                       │ │  │
│          │  │  │ from OPG team            │  │ 🟢 BID-0047 Equinor  │ │  │
│          │  │  │                          │  │   Due in 7 days      │ │  │
│          │  │  │ 🟡 5h ago               │  │                       │ │  │
│          │  │  │ BID-0037 → Hours updated│  │ Click → abre BID Dtl │ │  │
│          │  │  └──────────────────────────┘  └───────────────────────┘ │  │
│          │  └───────────────────────────────────────────────────────────┘  │
│          │                                                                  │
│          │  ┌─ LINHA 4: TABELA BID TRACKER (full width) ───────────────┐  │
│          │  │ TanStack Table — colunas:                                  │  │
│          │  │                                                            │  │
│          │  │ BID# │ Client │ Project │ Div. │ Owner │ Horas │ Due Date │  │
│          │  │      │        │         │      │       │ Total │ Status   │  │
│          │  │ ─────┼────────┼─────────┼──────┼───────┼───────┼──────────│  │
│          │  │ 0042 │Petrobr.│ROV Insp.│SSR-R │J.Silva│  320h │🟢 On Track│ │
│          │  │ 0039 │Shell   │Multibeam│Survey│M.Costa│  180h │🟡 Review │  │
│          │  │ 0037 │Equinor │Install. │OPG   │R.Lima │  450h │🔴 Overdue│  │
│          │  │                                                            │  │
│          │  │ Tooltips com resumo de escopo, badge "Critical Asset",     │  │
│          │  │ indicador de Follow-Up. Click na linha → abre BID Detail.  │  │
│          │  │ Sorting, pagination 25/50/100, column visibility toggle.   │  │
│          │  └────────────────────────────────────────────────────────────┘  │
│          │                                                                  │
├──────────┼──────────────────────────────────────────────────────────────────┤
│          │ FOOTER                                                           │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

**Componentes do Dashboard Principal:**

| Zona      | Componente React     | Dados                                                            | Gráfico/UI                                                  |
| --------- | -------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| Filtros   | `GlobalFilterPanel`  | Clients, Divisions, Statuses, Date Range (todos de SystemConfig) | Dropdown chips + Search + Action buttons                    |
| KPI Cards | `KPICard` (×6)       | Calculados pelo `DashboardService`                               | Animated counter + sparkline SVG + target bar + trend arrow |
| Pipeline  | `PipelineChart`      | BIDs agrupados por status                                        | Recharts `BarChart` horizontal, clicável                    |
| Divisão   | `DivisionDonut`      | BIDs agrupados por division                                      | Recharts `PieChart` donut com toggle temporal               |
| Atividade | `RecentActivityFeed` | Últimos 10 eventos do ActivityLog                                | Timeline vertical com avatars + relative time               |
| Deadlines | `UpcomingDeadlines`  | BIDs com dueDate + countdown                                     | Lista ordenada, badges de urgência, click → BID Detail      |
| Tabela    | `BIDTrackerTable`    | Todos os BIDs (filtrados)                                        | TanStack Table com sorting/pagination/column toggle         |

### 14.4 My Dashboard — Wireframe Detalhado (`/my-dashboard`)

> **Foco:** Visão personalizada do engenheiro/PM logado — seus BIDs, tarefas pendentes e alertas.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Good Afternoon, Marina Costa"                                             │
│  My Dashboard                          Role: Engineer · Discipline: SURF    │
│  [Meus BIDs ▼] [Meu Time ▼] [Todos ▼]                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ LINHA 1: CARDS PESSOAIS (3 cards) ──────────────────────────────────┐  │
│  │                                                                       │  │
│  │  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐      │  │
│  │  │ Meus BIDs Ativos │ │ Horas Comprom.   │ │ Deadlines Próx.  │      │  │
│  │  │       5          │ │ ███████░░ 72%    │ │     ⚠ 2          │      │  │
│  │  │ 3 on-track       │ │ 28h/semana       │ │ ≤ 5 dias         │      │  │
│  │  │ 1 overdue        │ │ capacity bar     │ │ countdown badges │      │  │
│  │  │ 1 approval       │ │                  │ │                  │      │  │
│  │  └──────────────────┘ └──────────────────┘ └──────────────────┘      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─ LINHA 2: MEUS BIDs + AGENDA (2 colunas) ───────────────────────────┐  │
│  │                                                                       │  │
│  │  ┌── Meus BIDs (65%) ─────────────────┐ ┌── Agenda (35%) ─────────┐ │  │
│  │  │ Tabela compacta TanStack:          │ │ Mini timeline:          │ │  │
│  │  │                                    │ │                         │ │  │
│  │  │ BID   │Client │Due    │Status│Horas│ │ HOJE                    │ │  │
│  │  │ ──────┼───────┼───────┼──────┼─────│ │ ○ BID-0042 → Review    │ │  │
│  │  │ 0042  │Petro  │Apr 5  │🟢    │ 320h│ │ ○ BID-0039 → Cost DL   │ │  │
│  │  │ 0039  │Shell  │Apr 8  │🟡    │ 180h│ │                         │ │  │
│  │  │ 0037  │Equinor│Apr 2  │🔴    │ 450h│ │ PRÓXIMOS 7 DIAS        │ │  │
│  │  │                                    │ │ ○ Apr 4 — BID-0050 KO  │ │  │
│  │  │ Botões por linha:                  │ │ ○ Apr 5 — BID-0042 DL  │ │  │
│  │  │ [Abrir] [Cost Breakdown] [Follow-Up]│ │ ○ Apr 8 — BID-0039 DL  │ │  │
│  │  └────────────────────────────────────┘ │ 🔔 Notificações críticas│ │  │
│  │                                         └─────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─ LINHA 3: PAINÉIS AUXILIARES (2 colunas) ───────────────────────────┐  │
│  │                                                                       │  │
│  │  ┌── Pending Approvals (50%) ────────┐ ┌── Últimos Follow-Ups ────┐ │  │
│  │  │ Aprovações aguardando minha resp.  │ │ (50%)                    │ │  │
│  │  │                                    │ │ Resultados recentes:     │ │  │
│  │  │  BID-0045 · Petrobras             │ │                          │ │  │
│  │  │  Requested by: J. Silva            │ │ 🟢 BID-0030 · Shell     │ │  │
│  │  │  [✅ Approve] [❌ Reject] [↩ Rev]  │ │    WON — $180k          │ │  │
│  │  │                                    │ │                          │ │  │
│  │  │  BID-0043 · Shell                 │ │ 🔴 BID-0028 · Equinor   │ │  │
│  │  │  Requested by: M. Costa            │ │    LOST — Price          │ │  │
│  │  │  [✅ Approve] [❌ Reject] [↩ Rev]  │ │                          │ │  │
│  │  └────────────────────────────────────┘ └──────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─ LINHA 4: TAREFAS RACI (full width) ────────────────────────────────┐  │
│  │ Tasks atribuídas a mim (da fase RACI dos meus BIDs):                 │  │
│  │ ☑ Revisar horas ROV — BID-0042 · Phase: Cost Gathering              │  │
│  │ ☐ Confirmar disponibilidade navio X — BID-0039 · Phase: Tech Anal.  │  │
│  │ ☐ Upload proposta técnica — BID-0037 · Phase: Technical Proposal     │  │
│  │ ☐ Review cost sheet — BID-0050 · Phase: Elaboration                  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Componentes do My Dashboard:**

| Zona               | Componente React                  | Dados                                                     |
| ------------------ | --------------------------------- | --------------------------------------------------------- |
| Cards pessoais     | `PersonalKPICard` (×3)            | BIDs filtrados por owner=currentUser                      |
| Meus BIDs          | `MyBidsTable` (TanStack compacto) | BIDs do owner + action buttons                            |
| Agenda             | `AgendaTimeline`                  | Milestones dos meus BIDs nos próximos 7 dias              |
| Pending Approvals  | `PendingApprovalCards`            | From `smartbid-approvals` where approverEmail=currentUser |
| Últimos Follow-Ups | `RecentFollowUps`                 | BIDs com resultado registrado recentemente                |
| Tarefas RACI       | `MyTasksChecklist`                | Tasks RACI atribuídas ao currentUser                      |

### 14.5 BID Results & Insights — Wireframe Detalhado (`/results`)

> **Foco:** Resultados históricos, motivos de ganho/perda, produtividade da engenharia (SEM valores comerciais/proposta).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  BID Results & Insights                                                     │
│  Track outcomes and learn from history                                      │
│  [Período: 12 meses ▼] [Cliente ▼] [Divisão ▼] [Service Line ▼]           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ BLOCO 1: KPIs HISTÓRICOS (4-5 cards) ──────────────────────────────┐  │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌────────┐│  │
│  │  │Total BIDs │ │ Win Rate  │ │ Tempo Med.│ │Follow-Up  │ │Lost:   ││  │
│  │  │ Analisados│ │           │ │ Ciclo Eng │ │ Docum. %  │ │Top Motiv││  │
│  │  │    48     │ │   43%     │ │  12 dias  │ │   87%     │ │ Price  ││  │
│  │  │ ~~spark~~ │ │ ~~spark~~ │ │ ~~spark~~ │ │ meta:100% │ │  38%   ││  │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └────────┘│  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─ BLOCO 2: GRÁFICOS ANALÍTICOS (2×2 grid) ──────────────────────────┐  │
│  │                                                                       │  │
│  │  ┌── Win/Loss por Cliente ───────┐  ┌── Motivos de Perda ──────────┐ │  │
│  │  │ Stacked bar chart (sem preço) │  │ Donut chart:                  │ │  │
│  │  │                               │  │                               │ │  │
│  │  │ Petrobras  ██████ 🟢4 🔴2    │  │    Price        38%           │ │  │
│  │  │ Shell      ████   🟢2 🔴2    │  │    Schedule     22%           │ │  │
│  │  │ Equinor    ███    🟢2 🔴1    │  │    Technical    18%           │ │  │
│  │  │ Total      █████  🟢2 🟡3    │  │    Competitor   15%           │ │  │
│  │  │                               │  │    Other         7%           │ │  │
│  │  └───────────────────────────────┘  └───────────────────────────────┘ │  │
│  │                                                                       │  │
│  │  ┌── Horas Eng × Resultado ──────┐  ┌── Tempo Resposta Comercial ──┐ │  │
│  │  │ Scatter plot:                  │  │ Histogram:                    │ │  │
│  │  │ X = Horas eng estimadas       │  │ X = Dias entre entrega eng    │ │  │
│  │  │ Y = Resultado (won/lost)      │  │     e retorno do cliente      │ │  │
│  │  │ Size = BID size               │  │ Y = Contagem de BIDs          │ │  │
│  │  │ Color = Division              │  │                               │ │  │
│  │  │                               │  │ ├──┤ 0-7d: 12 BIDs            │ │  │
│  │  │  ● ●   Won cluster           │  │ ├───┤ 7-14d: 8 BIDs           │ │  │
│  │  │     ○ ○  Lost cluster         │  │ ├─┤ 14-30d: 5 BIDs            │ │  │
│  │  └───────────────────────────────┘  └───────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─ BLOCO 3: TABELA FOLLOW-UPS (full width) ──────────────────────────┐  │
│  │ TanStack Table:                                                       │  │
│  │                                                                       │  │
│  │ BID# │ Client │ Project   │ Div. │ Resultado │ Motivo  │ Data Retorno│  │
│  │ ─────┼────────┼───────────┼──────┼───────────┼─────────┼─────────────│  │
│  │ 0042 │Petrobr.│ROV Insp.  │SSR-R │ 🟢 Won   │ —       │ Mar 28      │  │
│  │ 0039 │Shell   │Multibeam  │Survey│ 🔴 Lost  │ Price   │ Mar 25      │  │
│  │ 0037 │Equinor │Install.   │OPG   │ ⏳ Pend. │ —       │ Awaiting    │  │
│  │ 0035 │Total   │Controls   │SSR-R │ 🟢 Won   │ —       │ Mar 15      │  │
│  │                                                                       │  │
│  │ Click → Modal com: resultado, data, motivo perda, concorrente,       │  │
│  │ notas engenharia, lessons learned, linked BID (navegação rápida)      │  │
│  │ Filtros rápidos por resultado + motivo. Export CSV/Excel.             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Componentes do BID Results:**

| Zona        | Componente React        | Dados                                     | Gráfico/UI                   |
| ----------- | ----------------------- | ----------------------------------------- | ---------------------------- |
| KPIs        | `ResultKPICard` (×5)    | Calculados de BIDs com outcome registrado | Animated counter + sparkline |
| Win/Loss    | `WinLossChart`          | BIDs agrupados por client × outcome       | Recharts `BarChart` stacked  |
| Motivos     | `LossReasonsChart`      | BIDs com outcome=Lost groupBy lossReason  | Recharts `PieChart` donut    |
| Scatter     | `EffortOutcomeScatter`  | Horas eng × resultado                     | Recharts `ScatterChart`      |
| Tempo Resp. | `ResponseTimeHistogram` | Dias (deliveryDate → resultDate)          | Recharts `BarChart` vertical |
| Tabela      | `FollowUpTable`         | Todos BIDs com outcome                    | TanStack Table + modal click |

### 14.6 System Configuration — Tabs (Expandido)

> **Princípio:** Nenhum dropdown é hardcoded. Todos os itens de configuração e opções de seleção são campos editáveis salvos como JSON na lista `smartbid-config` (key `SYSTEM_CONFIG`), seguindo o padrão `IConfigOption` do SmartFlow. O `SystemConfigService` carrega com cache de 5 min.

| Tab                                       | Conteúdo                                                                                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **KPI Targets**                           | Campos editáveis para cada KPI target (On-Time, OTIF, Avg Days, Win Rate, etc.)                                                       |
| **Regions**                               | CRUD de regiões onde a empresa opera                                                                                                  |
| **Bid Types**                             | CRUD: Firm, Budgetary, RFI, Extension, Amendment                                                                                      |
| **Service Lines**                         | CRUD com mapeamento para divisões                                                                                                     |
| **Divisions**                             | CRUD com cores e config                                                                                                               |
| **Client List**                           | CRUD de clientes                                                                                                                      |
| **Job Functions**                         | CRUD dos cargos/funções (24+) organizados por categoria (management, engineering, rov, survey, support)                               |
| **Hours Phases**                          | CRUD das fases de horas (20+) organizados por categoria (engineering, management, mobilization, execution, data)                      |
| **Acquisition Types**                     | CRUD dos tipos de aquisição (18) com mapeamento automático CAPEX/OPEX                                                                 |
| **Deliverable Types**                     | CRUD dos entregáveis (12+)                                                                                                            |
| **Equipment Categories & Sub-Categories** | CRUD de categorias (ROV Systems, Survey Equipment...) E sub-categorias (ROV_Tooling, ROV_Assets, SURVEY_Assets) vinculadas a divisões |
| **Cost References**                       | CRUD dos códigos de custo PeopleSoft (BUMBL, BUABO, BUMCO, BUSTO, Quote, etc.) com região associada                                   |
| **BID Statuses & Phases**                 | Visualização/edição de labels, cores, ordem dos status e fases — display attributes editáveis, lógica no código                       |
| **BID Result Options & Loss Reasons**     | CRUD dos resultados (Won, Lost, etc.) E motivos de perda (Price, Technical, Schedule, Competitor...)                                  |
| **Currency & PTAX**                       | Moeda padrão, PTAX mensal, data atualização, unidades (m/ft, days/weeks/months)                                                       |
| **Approval Rules**                        | Config: stakeholders, thresholds, reminders, escalation                                                                               |
| **Notification Rules**                    | Matriz roles × tipos com toggles                                                                                                      |
| **Access Levels**                         | Grid RBAC: roles × pages × none/view/edit                                                                                             |
| **Attachment Categories**                 | CRUD de categorias de anexo (Client Documents, Technical Analysis, Cost Sheets, Proposals, Quotations, etc.)                          |
| **Comment Sections**                      | CRUD das seções de comentário (General, Costs, Hours, Assets, Approval, Technical, Clarification)                                     |
| **BID Notes Templates**                   | CRUD das seções de notas de análise (Gap Analysis, Qualifications, Contract Differences, etc.)                                        |
| **Status Indicators**                     | Config dos flags visuais de equipamento (red=crítico, yellow=atenção, green=ok, blue=info) e seus significados                        |
| **Audit Log**                             | Tabela de ações no sistema                                                                                                            |

---

## 15. Ordem de Implementação

> **Referências de código SmartFlow:** Usar como base estrutural: `MembersManagement.tsx` (1334 linhas — padrão CRUD com stat cards, People Picker, dialogs, access control, super admin), `OrderDetailsModal.tsx` (625 linhas — modal com timeline horizontal, status steps, tabelas de detalhes, seções condicionais), `SystemConfiguration.tsx` (2584 linhas — tabs com CRUD, panels, temp state, notification matrix, access level grid), `FlowBoard.tsx` (756 linhas — Kanban com auto-refresh, drag-drop columns, dark mode toggle, mobile responsive).

### Fase 1: Foundation (Semana 1-2)

1. Setup do projeto (Vite, Tailwind, TypeScript, dependências)
2. Design System (theme, variáveis CSS, componentes base)
3. Layout global (AppLayout, Sidebar, Header, Footer)
4. SharePoint Chrome Cleanup (sharepoint-overrides.css)
5. Mock data completo e realista
6. Routing com lazy loading
7. Zustand stores base

### Fase 2: Core Pages (Semana 3-4)

8. Dashboard principal com KPIs, Pipeline chart, Activity feed, Deadlines, BID Table (ver wireframe 14.3)
9. BID Tracker (Kanban/List/Table)
10. BID Detail Page (todas as 14 tabs — ver 14.2)
11. Unassigned Requests page
12. Create Request wizard

### Fase 3: Workflows (Semana 5-6)

13. Sistema de aprovação (tab Approval no BID Detail + notifications)
14. Equipment templates (biblioteca + import wizard na tab Scope of Supply)
15. Export para comercial (Excel/PDF — tab Export no BID Detail)
16. FlowBoard (adaptado do SmartFlow)
17. My Dashboard com KPIs pessoais, agenda e tarefas (ver wireframe 14.4)

### Fase 4: Features (Semana 7-8)

18. Notifications page
19. BID Results & Insights com gráficos analíticos (ver wireframe 14.5)
20. Analytics / Insights (3 sub-páginas)
21. Reports & Export (3 sub-páginas)

### Fase 5: Settings & Polish (Semana 9-10)

22. System Configuration (todas as tabs — ref: SystemConfiguration.tsx do SmartFlow)
23. Members Management (ref: MembersManagement.tsx do SmartFlow)
24. Knowledge Base
25. Tools (Favorites, Quotations, Tooling, Price)
26. FAQ, Patch Notes, Command Palette

### Fase 6: Integration (Semana 11-12)

27. SharePoint Lists setup e provisioning
28. Services reais (PnPjs v3) substituindo mock
29. Power Automate flows
30. SPFx wrapper para deploy
31. Testes e QA

---

## 16. Checklist de Criação de Listas SharePoint

**SharePoint Site:** `https://oceaneering.sharepoint.com/sites/G-OPGSSRBrazilEngineering`

Ao fazer deploy, as seguintes listas e libraries devem ser criadas **manualmente** no site acima (ou via PnP Provisioning). Abaixo está o resumo e depois o detalhe de cada uma.

### Resumo Rápido

| #   | Nome da Lista/Library     | Tipo             | Colunas Extras (além de Title)                                              | Items Iniciais                |
| --- | ------------------------- | ---------------- | --------------------------------------------------------------------------- | ----------------------------- |
| 1   | `smartbid-tracker`        | Custom List      | `jsondata`, `Status`, `Division`, `DueDate`, `Owner`, `Phase` (6 cols)      | 0 (BIDs criados pelo app)     |
| 2   | `smartbid-config`         | Custom List      | `ConfigValue` (1 col)                                                       | 7 items (config keys)         |
| 3   | `smartbid-status-tracker` | Custom List      | `jsondata`, `ChangeType`, `IsProcessed` (3 cols)                            | 0 (gerados por eventos)       |
| 4   | `smartbid-approvals`      | Custom List      | `ApprovalId`, `jsondata`, `ApproverEmail`, `Status`, `IsProcessed` (5 cols) | 0 (gerados por fluxo)         |
| 5   | `SmartBidAttachments`     | Document Library | nenhuma (organização por pasta)                                             | 0 (pasta por BID auto-criada) |

---

### `smartbid-tracker`

```
Tipo: Custom List
Colunas:
  - Title (text, indexed) = BID Number
  - jsondata (multi-line text, plain, unlimited)
  - Status (text, indexed) = BID status for OData queries
  - Division (text, indexed) = Division for OData queries
  - DueDate (DateTime, indexed) = Due date for sorting
  - Owner (text, indexed) = Owner email for filtering
  - Phase (text, indexed) = Current phase for filtering
Views:
  - All Items (default)
  - Active BIDs (Status not in Completed,Canceled,NoBid)
  - By Division (grouped by Division)
  - Overdue (DueDate < Today AND Status not terminal)
```

### `smartbid-config`

```
Tipo: Custom List
Colunas:
  - Title (text, unique) = Config Key
  - ConfigValue (multi-line text, plain, unlimited)
Items Iniciais:
  - SYSTEM_CONFIG → Default ISystemConfig JSON
  - TEAM_MEMBERS → Empty IMembersData JSON
  - ACTIVITY_LOG → Empty array JSON
  - BID_TEMPLATES → Empty array JSON
  - APPROVAL_RULES → Default rules JSON
  - QUOTATION_DATABASE → Empty array JSON
  - PATCH_NOTES → Initial version JSON
```

### `smartbid-status-tracker`

```
Tipo: Custom List
Colunas:
  - Title (text) = BID Number
  - jsondata (multi-line text, plain, unlimited)
  - ChangeType (text, indexed) = Notification type
  - IsProcessed (Yes/No, default No, indexed)
```

### `smartbid-approvals`

```
Tipo: Custom List
Colunas:
  - Title (text) = BID Number
  - ApprovalId (text, unique, indexed)
  - jsondata (multi-line text, plain, unlimited)
  - ApproverEmail (text, indexed) = For Power Automate filter
  - Status (text, indexed) = pending/approved/rejected/revision
  - IsProcessed (Yes/No, default No, indexed) = PA tracking
```

### `SmartBidAttachments`

```
Tipo: Document Library
Permissões: Site Members = Contribute
Pastas Raiz: (criadas automaticamente por BID pelo AttachmentService)
Metadados adicionais: nenhum (organização por pasta)
```

---

## 17. SharePoint Chrome Cleanup (Tela em Branco)

Antes de renderizar o app React, é necessário **esconder toda a interface padrão do SharePoint** para que a web part ocupe 100% da viewport, sem barras, menus ou cromados visíveis. O arquivo `sharepoint-overrides.css` (gerado a partir do padrão SmartFlow `sharepoint-overrides.scss`) implementa todas essas regras dentro de um bloco `:global { }` para atingir o DOM do SharePoint fora do escopo CSS Modules.

### 17.1 Elementos que precisam ser removidos/escondidos

| #   | Elemento SharePoint                                      | Seletores Principais                                                                                                              | Técnica                                                                                                                                              |
| --- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Suite Nav Bar** (barra azul superior O365)             | `#SuiteNavWrapper`, `div[data-sp-feature-tag="Suite Navigation"]`, `.od-TopBar`                                                   | `display:none`, `visibility:hidden`, `height:0`, `position:absolute`, `top:-9999px`                                                                  |
| 2   | **App Bar** (barra lateral esquerda SP)                  | `#sp-appBar`, `.sp-appBar:not([class*="parent"])`, `.spDeThemeAppBar`, `.sp-appBar-mobile`                                        | Mesma técnica do Suite Nav. **CUIDADO:** NÃO usar `[class*="appBar"]` pois no mobile SP usa `.sp-appBar-parent-mobile` como wrapper de toda a página |
| 3   | **Site Header** (cabeçalho do site com título e nav)     | `div[data-sp-feature-tag="Site header host"]`, `div#spSiteHeader`, `div#spPageChromeAppHeader`, `.SPPageChrome-app-header`        | `display:none`, `visibility:hidden`, `height:0`                                                                                                      |
| 4   | **Hub Navigation** (nav horizontal do hub)               | `.ms-HubNav`, `div[class*="ms-HubNav"]`                                                                                           | `display:none`                                                                                                                                       |
| 5   | **Left Navigation Panel**                                | `#spLeftNav`                                                                                                                      | `display:none`                                                                                                                                       |
| 6   | **Command Bar** (barra Editar/Publicar página)           | `.ms-CommandBar`, `[data-automation-id="pageCommandBar"]`, `.commandBarWrapper`, `[class*="commandBar"]`, `[class*="CommandBar"]` | `display:none`. Excluir seletores do nosso app (`[class*="hse"]`)                                                                                    |
| 7   | **Search Box do Chrome**                                 | `#SuiteNavWrapper [data-automation-id="searchBox"]`, `.spPageChromeAppHeaderWrapper .ms-SearchBox`                                | `display:none` (scoped ao Chrome, NÃO ao nosso SearchBox)                                                                                            |
| 8   | **Settings Button** (engrenagem)                         | `[data-automation-id="SettingsButton"]`, `button[aria-label*="Configurações"]`                                                    | `visibility:hidden`, `width:0`                                                                                                                       |
| 9   | **Help Button**                                          | `[data-automation-id="HelpButton"]`, `button[aria-label*="Ajuda"]`, `button[aria-label*="Help"]`                                  | `display:none`                                                                                                                                       |
| 10  | **Comments Section** (seção de comentários da página SP) | `[data-sp-feature-tag="Comments"]`, `.CommentsWrapper`, `[class*="CommentsWrapper"]`, `.Page-commentsWrapper`                     | `display:none`                                                                                                                                       |
| 11  | **Composite Header**                                     | `.ms-compositeHeader`                                                                                                             | `display:none`                                                                                                                                       |

### 17.2 Full-Width: Remover limites de largura

| #   | Alvo                        | Seletores                                                                                                                  | Regras CSS                                                                                       |
| --- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1   | **Workbench Page Content**  | `#workbenchPageContent`                                                                                                    | `max-width:none`, `width:100%`, `margin:0`, `padding:0`                                          |
| 2   | **Canvas Zones**            | `.CanvasZone`, `.CanvasSection`, `.ControlZone`, `.CanvasComponent`, `.CanvasZoneContainer`, `.CanvasZoneSectionContainer` | `max-width:none`, `width:100%`, `margin:0`, `padding:0`, `border:none`                           |
| 3   | **Canvas Automation IDs**   | `div[data-automation-id*="Canvas"]`, `div[data-automation-id*="CanvasZone"]`, `div[data-automation-id*="CanvasSection"]`   | `max-width:none`, `width:100%`, `margin:0`, `padding:0`                                          |
| 4   | **Page Chrome**             | `div[data-sp-feature-tag="Page Chrome"]`, `#spPageChromeAppDiv`, `.SPCanvas-canvaschrome`, `.SPPageChrome-app`             | `max-width:none`, `width:100%`                                                                   |
| 5   | **Main Content**            | `div[role="main"]`, `div[role="article"]`, `main`, `#spPageCanvasContent`                                                  | `max-width:none`, `width:100%`, `padding:0`                                                      |
| 6   | **Inline Style Overrides**  | `div[style*="max-width"]`, `div[style*="width: 924px"]`, `div[style*="width: 1200px"]`                                     | `max-width:none!important`, `width:100%!important`. Excluir popups: `:not([data-popup-overlay])` |
| 7   | **Dynamic Class Overrides** | `div[class*="_"][class*="margin"]`, `div[class*="_"][class*="width"]` etc.                                                 | `max-width:none`                                                                                 |
| 8   | **Mobile App Bar padding**  | `.sp-appBar-parent-mobile`                                                                                                 | `padding-bottom:0` (remove espaço reservado para app bar)                                        |

### 17.3 Root Web Part Container

O container raiz da web part (classe `.smartBid` ou similar) deve receber:

```css
.smartBid {
  width: 100% !important;
  min-height: 100vh;
  background: var(--main-bg); /* Dark mode default */
  display: flex !important;
  margin: 0 !important;
  padding: 0 !important;
  position: relative !important;
  z-index: 1 !important;
  overflow: hidden !important;
}
```

### 17.4 Fluent UI Overrides

O SharePoint injeta estilos do Fluent UI que podem conflitar com Shadcn/Tailwind:

| Componente Fluent UI       | Override necessário                                |
| -------------------------- | -------------------------------------------------- |
| `.ms-Button`               | Override `font-family` para Inter                  |
| `.ms-TextField-fieldGroup` | Override `border-color` para nosso `--border`      |
| `.ms-Dropdown`             | Override `border-color` em hover/focus             |
| `.ms-Panel`                | Override `background-color` para nosso `--card-bg` |
| `.ms-Dialog-main`          | Override `border-radius` e `box-shadow`            |
| `.ms-Pivot`                | Override cores para nosso `--primary-accent`       |
| `.ms-DetailsList`          | Override header/row backgrounds e hover            |
| `.ms-MessageBar`           | Override `border-radius` e cores por tipo          |

> **Nota:** Estes overrides são necessários apenas se o SPFx injetar globalmente os estilos Fluent. No Vite dev mode, esses seletores não existem — só se aplicam em produção dentro do SharePoint.

### 17.5 Overrides Adicionais

| Categoria          | Detalhes                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **Print**          | Esconder Chrome SP + full-width ao imprimir (`@media print`)                                            |
| **Scrollbar**      | Custom scrollbar (8px, cores do tema) dentro do container `.smartBid`                                   |
| **Accessibility**  | `*:focus-visible` com outline + box-shadow, `.skip-to-main` link                                        |
| **High Contrast**  | `@media (prefers-contrast: high)` — border sólida                                                       |
| **Reduced Motion** | `@media (prefers-reduced-motion: reduce)` — `animation-duration: 0.01ms`, `transition-duration: 0.01ms` |
| **Mobile/Tablet**  | `@media (max-width: 1024px)` — esconder Chrome + forçar full-width                                      |
| **Debug outlines** | Remover `outline` e `border` de `div[style*="outline"]` em Canvas                                       |

### 17.6 Implementação

```
src/
  styles/
    sharepoint-overrides.css    ← Arquivo com todas as regras acima
```

Importar no `main.tsx` (ou no entry point do SPFx wrapper):

```typescript
import "./styles/sharepoint-overrides.css";
```

> **Referência funcional completa:** O SmartFlow Warehouse já implementa este padrão em `sharepoint-overrides.scss`. O Smart BID 2.0 reutiliza a mesma abordagem, ajustando a classe raiz para `.smartBid`.

---

## 18. Mock Data → SharePoint: Mapa de Integração

Na fase de desenvolvimento, **todos os dados são mock**. Esta seção mapeia exatamente onde está cada mock file, qual service usa, e qual lista SharePoint substituirá na integração real.

### 18.1 Mapa Completo

| #   | Mock File                       | Dados que contém               | Service que consome       | Lista SP Real                                                | Config Key (se config) | Fase de Integração    |
| --- | ------------------------------- | ------------------------------ | ------------------------- | ------------------------------------------------------------ | ---------------------- | --------------------- |
| 1   | `src/data/mockBids.ts`          | 15+ BIDs completos (IBid JSON) | `BidService.ts`           | `smartbid-tracker` (coluna `jsondata`)                       | —                      | Fase 6 (Semana 11-12) |
| 2   | `src/data/mockRequests.ts`      | 5+ requests pendentes          | `RequestService.ts`       | `smartbid-tracker` (filtrado por status `request-submitted`) | —                      | Fase 6                |
| 3   | `src/data/mockMembers.ts`       | 20+ membros por categoria      | `MembersService.ts`       | `smartbid-config`                                            | `TEAM_MEMBERS`         | Fase 6                |
| 4   | `src/data/mockTemplates.ts`     | 5+ templates de equipamento    | `TemplateService.ts`      | `smartbid-config`                                            | `BID_TEMPLATES`        | Fase 6                |
| 5   | `src/data/mockApprovals.ts`     | Aprovações exemplo             | `ApprovalService.ts`      | `smartbid-approvals`                                         | —                      | Fase 6                |
| 6   | `src/data/mockNotifications.ts` | Notificações in-app            | `NotificationService.ts`  | `smartbid-status-tracker` + in-memory                        | —                      | Fase 6                |
| 7   | `src/data/mockKnowledgeBase.ts` | Items da Knowledge Base        | `KnowledgeBaseService.ts` | `smartbid-config`                                            | `KNOWLEDGE_BASE`       | Fase 6                |
| 8   | `src/data/mockSystemConfig.ts`  | Config padrão (ISystemConfig)  | `SystemConfigService.ts`  | `smartbid-config`                                            | `SYSTEM_CONFIG`        | Fase 6                |

### 18.2 Padrão de Substituição (Service Layer)

Cada service segue o padrão SmartFlow com flag de ambiente:

```typescript
// BidService.ts — exemplo do padrão
export class BidService {
  private static _isInitialized = false;

  static async getAll(): Promise<IBid[]> {
    // Fase 1-5: Mock data
    if (!this._isInitialized || import.meta.env.DEV) {
      const { mockBids } = await import("../data/mockBids");
      return mockBids;
    }
    // Fase 6: SharePoint real
    const items = await SPService.getListItems("smartbid-tracker");
    return items.map((item) => JSON.parse(item.jsondata) as IBid);
  }
}
```

### 18.3 MockDataService.ts (Centralizador)

O `MockDataService.ts` é o ponto central que:

- Importa todos os mock files
- Expõe métodos para cada entidade (`getMockBids()`, `getMockMembers()`, etc.)
- É usado pelo **Guest Mode** permanentemente (nunca troca para SP)
- É usado pelo dev mode (`npm run dev` com Vite)

```typescript
// MockDataService.ts
import { mockBids } from "../data/mockBids";
import { mockMembers } from "../data/mockMembers";
import { mockSystemConfig } from "../data/mockSystemConfig";
// ... demais imports

export class MockDataService {
  static getBids(): IBid[] {
    return mockBids;
  }
  static getMembers(): IMembersData {
    return mockMembers;
  }
  static getSystemConfig(): ISystemConfig {
    return mockSystemConfig;
  }
  static getTemplates(): ITemplateEquipment[] {
    return mockTemplates;
  }
  static getApprovals(): IApprovalRecord[] {
    return mockApprovals;
  }
  static getNotifications(): INotification[] {
    return mockNotifications;
  }
  static getKnowledgeBase(): IKnowledgeBaseItem[] {
    return mockKnowledgeBase;
  }
  // Usuário logado mock
  static getCurrentUser(): IUser {
    return {
      name: "Raphael Costa",
      email: "rcosta@oceaneering.com",
      role: "Manager",
      teamCategory: "manager",
      photoUrl: "base64...",
      department: "Engineering",
      title: "Engineering Manager",
    };
  }
}
```

### 18.4 Checklist para Troca Mock → SP Real

Quando chegar a **Fase 6 (Integration)**, para cada service:

1. ✅ Inicializar `SPService.init(context)` no `SmartBidWebPart.onInit()`
2. ✅ Substituir import de mock pelo `SPService.getListItems(listName)`
3. ✅ Garantir que `JSON.parse(item.jsondata)` retorna o tipo correto
4. ✅ Manter fallback para `MockDataService` no Guest Mode
5. ✅ Adicionar `TanStack Query` wrappers com `staleTime` e `refetchInterval`
6. ✅ Testar filtragem OData via colunas redundantes (`Status`, `Division`, `Owner`)
7. ✅ Configurar `AttachmentService` com Library URL real
8. ✅ Validar Power Automate trigger no `smartbid-status-tracker`

---

## Apêndice A: Mapeamento SmartFlow → Smart BID

| Componente SmartFlow   | Equivalente Smart BID  | Mudanças                                         |
| ---------------------- | ---------------------- | ------------------------------------------------ |
| `SmartFlowService`     | `BidService`           | CRUD de BIDs em vez de Orders                    |
| `SystemConfigService`  | `SystemConfigService`  | Expandido com approval rules, templates          |
| `MembersService`       | `MembersService`       | Novas categorias (engineer, bidder, projectTeam) |
| `ActivityLogService`   | `ActivityLogService`   | Novos tipos de evento para BID                   |
| `StatusTrackerService` | `StatusTrackerService` | Novos change types, approval integration         |
| `ExportService`        | `ExportService`        | Multi-tab Excel, commercial export format        |
| `AttachmentService`    | `AttachmentService`    | Categorized folders por BID                      |
| `FlowBoard`            | `FlowBoard`            | Colunas por divisão/status                       |
| `AvailableRequests`    | `UnassignedRequests`   | Requests do comercial                            |
| `DashboardRouter`      | `DashboardPage`        | KPIs de BID, não warehouse                       |
| `SystemConfiguration`  | `SystemConfiguration`  | +5 tabs (approval, templates, costs, etc.)       |
| `MembersManagement`    | `MembersManagement`    | Novas roles                                      |
| `OrderDetail`          | `BidDetail`            | 12 tabs, RACI tasks, approvals, qualifications   |
| `PatchNotes`           | `PatchNotes`           | Mesmo padrão                                     |
| `Notifications`        | `Notifications`        | Mesmo padrão + approval notifications            |
| — (novo)               | `BidResults`           | Follow-up de resultados comerciais               |

---

## Apêndice B: Interfaces TypeScript Detalhadas

### B.1 IBidEquipment (Assets & Tooling)

Reflete exatamente a estrutura da tabela de Assets Cost Summary do SmartBid 1.0:

```typescript
interface IBidEquipment {
  id: string;
  lineNumber: number;

  // Agrupamento por requisito
  requirementGroup: number; // Número do grupo (ex: 8, 9...)
  requirementName: string; // "Ferramentas de limpeza - Dynaset..."
  engStudy: string; // Referência ao estudo de engenharia

  // Identificação do item
  partNumber: string; // PN do PeopleSoft: "990695686"
  toolDescription: string; // "WATER BLASTER"
  equipmentSubCategory: string; // "ROV_Tooling", "ROV_Assets", "SURVEY_Assets" — sub-categorização por tipo/divisão

  // Quantidades
  qtyOperational: number; // Qty Oper. (para operação)
  qtySpare: number; // Qty Spare (reserva)
  qtyOnHand: number; // Qty Hand (em estoque)
  qtyToBuy: number; // Qty Buy (a comprar)

  // Aquisição
  acquisitionType: string; // "In House", "Purchase (cap)", "Rental (ope)", etc.
  leadTimeDays: number; // Prazo de entrega em dias

  // Custos
  unitCostUSD: number; // Custo unitário em USD
  totalCostUSD: number; // Custo total = unitCost × (qtyToBuy || qtyOper)
  costReference: string; // Referência do custo: "BUMBL", "BUABO", "BUMCO", "BUSTO", "Quote"
  costCategory: "CAPEX" | "OPEX"; // Auto-calculado pelo acquisitionType
  costCalcMethod: "auto" | "manual"; // "auto" = PeopleSoft/database, "manual" = entrada manual
  originalCost: number | null; // Custo na moeda original (ex: 14343.51)
  originalCurrency: string | null; // Moeda original: "BRL", "GBP", "NOK", "USD"
  costDate: string | null; // Data da última referência de custo (ex: "2/2025")

  // Quotation reference
  quoteUrl: string | null; // URL do documento de cotação no SharePoint
  quoteLabel: string | null; // Label da cotação (ex: "Quote")

  // Visual flags
  statusIndicator: "red" | "yellow" | "green" | "blue" | null; // Flag visual do item (red=crítico, yellow=atenção, green=ok, blue=info)

  // Extras
  isFavorite: boolean; // Marcado com estrela
  importedFromTemplate: string | null; // ID do template de origem
  notes: string;
}

interface IAssetsCostSummary {
  capexTotal: number;
  capexTotalBRL: number;
  opexTotal: number;
  opexTotalBRL: number;
  grandTotal: number;
  grandTotalBRL: number;
  byDivision: Record<string, { capex: number; opex: number; total: number }>;
}
```

### B.2 IBidHoursItem (Hours & Resources)

Reflete a tabela de horas do SmartBid 1.0 com suporte a Engineering, Onshore e Offshore:

```typescript
interface IBidHoursItem {
  id: string;
  lineNumber: number;

  // Agrupamento
  resourceGroup: number; // Número do grupo de recurso (40, 41, 42...)
  requirementName: string; // "Recursos Onshore", "Recursos Offshore"
  engStudy: string; // Referência ao estudo de engenharia

  // Alocação
  function: string; // "Project Manager", "ROV Technician", "Engineer", etc.
  phase: string; // "Drawings", "Premob", "Mob", "Operation", "Demob", etc.

  // Cálculo de horas
  hoursPerDay: number; // 8 (onshore) ou 12 (offshore)
  pplQty: number; // Quantidade de pessoas
  workDays: number; // Dias de trabalho
  utilizationPercent: number; // 0-100 (porcentagem de utilização)
  totalHours: number; // = hoursPerDay × pplQty × workDays × (util/100)

  // Custos
  costBRL: number; // Custo em R$
  costUSD: number; // Custo em USD (= costBRL / PTAX)

  // Extras
  notes: string; // Observações (ex: "Para o cliente vai como Supervisor.")
}

interface IBidHoursSection {
  totalHours: number;
  totalCostBRL: number;
  totalCostUSD: number;
  items: IBidHoursItem[];
}

interface IBidHoursSummary {
  engineeringHours: IBidHoursSection; // Horas de engenharia (Drawings, FMEA, FEA, etc.)
  onshoreHours: IBidHoursSection; // Recursos Onshore (projetos, operações, gestão)
  offshoreHours: IBidHoursSection; // Recursos Offshore (mob, operação, demob)

  totalsByDivision: Record<
    string,
    {
      engineering: number;
      onshore: number;
      offshore: number;
      costBRL: number;
      costUSD: number;
    }
  >;

  grandTotalHours: number;
  grandTotalCostBRL: number;
  grandTotalCostUSD: number;
}
```

### B.3 IBidOpportunityInfo

```typescript
interface IBidOpportunityInfo {
  client: string;
  clientContact: string;
  projectName: string;
  projectDescription: string;
  region: string; // "Brazil", "US Gulf", etc.
  vessel: string; // "Normand Maximus"
  field: string; // "Marlim Field"
  waterDepth: number; // 1200
  waterDepthUnit: "m" | "ft";
  operationStartDate: string; // ISO date
  totalDuration: number; // 45
  totalDurationUnit: "days" | "weeks" | "months";
  currency: "USD" | "BRL";
  ptax: number; // 5.65
  ptaxDate: string; // ISO date da última atualização
  qualifications: string[]; // Lista de qualificações necessárias
}
```

### B.4 IBidComment

```typescript
interface IBidComment {
  id: string;
  author: {
    name: string;
    email: string;
    role: string; // "Engineering Lead", "Manager"
    photoUrl: string;
  };
  text: string;
  timestamp: string; // ISO date — data + hora exata do comentário
  phase: string; // PHASE_1, PHASE_2... — contexto da fase
  section: "general" | "costs" | "hours" | "assets" | "approval" | "technical";
  isEdited: boolean;
  editedAt: string | null;
  mentions: string[]; // Emails mencionados (@)
  attachments: string[]; // URLs de arquivos anexos ao comentário
}
```

### B.5 IBidResult (Follow-Up)

```typescript
interface IBidResult {
  outcome:
    | "Won"
    | "Lost"
    | "Client Canceled"
    | "No Bid"
    | "Pending"
    | "Renegotiation"
    | null;
  outcomeDate: string | null; // Data do resultado
  contractValue: number | null; // Valor do contrato (se ganhou)
  contractCurrency: string | null;
  lostReason: string | null; // "Price", "Technical", "Schedule", "Competitor", "Other"
  competitorName: string | null; // Nome do concorrente (se perdeu)
  feedbackNotes: string | null; // Notas do comercial
  followUpDate: string | null; // Próximo follow-up agendado
  lastUpdatedBy: string | null; // Email de quem atualizou
  lastUpdatedDate: string | null;
}
```

### B.6 ITemplateEquipment (Atualizado)

Templates agora espelham a mesma estrutura do IBidEquipment:

```typescript
interface ITemplateEquipment {
  partNumber: string;
  toolDescription: string;
  category: string;
  defaultQtyOperational: number;
  defaultQtySpare: number;
  unit: string;
  estimatedUnitCostUSD: number;
  acquisitionType: string; // "In House", "Purchase (cap)", etc.
  leadTimeDays: number;
  costCategory: "CAPEX" | "OPEX";
  isRequired: boolean;
  notes: string;
  alternatives: string[]; // PNs alternativos
}
```

---

## Apêndice C: Export Detalhado para o Comercial

O export Excel multi-tab reflete a estrutura real de dados do SmartBid:

| Aba                     | Colunas                                                                                                                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Summary**             | BID#, CRM#, Client, Project, Division, Service Line, Type, Region, Vessel, Field, Water Depth, Op. Start Date, Duration, Status, Due Date, Total Cost USD, Total Cost BRL, PTAX                                                       |
| **Assets - Tooling**    | #, Requirement, Eng Study, PN, Tool, Sub-Category, Qty Oper, Qty Spare, Qty Hand, Qty Buy, Acq. Type, Lead Time, Unit Cost USD, Total Cost USD, Cost Ref, Cost Method, Orig. Cost, Orig. Currency, Cost Date, CAPEX/OPEX, Status Flag |
| **Hours - Engineering** | #, Requirement, Function, Phase, Hours/Day, Ppl Qty, Work Days, Util%, Total Hours, Cost R$, Notes                                                                                                                                    |
| **Hours - Onshore**     | #, Requirement, Function, Phase, Hours/Day, Ppl Qty, Work Days, Util%, Total Hours, Cost R$, Notes                                                                                                                                    |
| **Hours - Offshore**    | #, Requirement, Function, Phase, Hours/Day, Ppl Qty, Work Days, Util%, Total Hours, Cost R$, Notes                                                                                                                                    |
| **Cost Summary**        | Category (Assets CAPEX, Assets OPEX, Engineering Hours, Onshore Hours, Offshore Hours), USD, BRL                                                                                                                                      |
| **BID Notes**           | Section Title, Content (Gap Analysis, Qualifications, Contract Differences, etc.)                                                                                                                                                     |
| **Approval History**    | Approver, Role, Decision, Date, Comments, Channel (Teams/SmartBid)                                                                                                                                                                    |
| **Activity Log**        | Date, Action, Actor, Details                                                                                                                                                                                                          |

**O formato espelha a planilha que o Comercial já usa**, facilitando o copy-paste ou importação direta.

---

_Documento mantido por Raphael Costa — Última atualização: 02/04/2026_
