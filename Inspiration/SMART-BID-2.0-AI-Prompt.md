# PROMPT COMPLETO — Criação do SMART BID 2.0

> **Use este prompt em uma IA de codificação (Claude, GPT-4, Cursor, etc.) para gerar o projeto completo.**
>
> **⚠ REFERÊNCIA OBRIGATÓRIA:** Este prompt é complementado pelo arquivo **`SMART-BID-2.0-ARCHITECTURE.md`** que contém: estrutura de pastas, modelos de dados (IBid JSON completo), listas SharePoint com colunas, interfaces TypeScript, tasks RACI, fluxo de aprovação, templates, SharePoint Chrome Cleanup, e mapa Mock→SP. **Consulte o ARCHITECTURE.md para qualquer detalhe de data model, SP lists, ou interfaces.**
>
> **📎 ANEXOS para enviar junto com este prompt:**
>
> 1. `SMART-BID-2.0-ARCHITECTURE.md` — Arquitetura completa (fonte de verdade)
> 2. `sharepoint-overrides.scss` — Referência funcional do SmartFlow para SharePoint Chrome Cleanup
> 3. `MembersManagement.tsx` — Referência SmartFlow: CRUD members, People Picker, stat cards, access control
> 4. `OrderDetailsModal.tsx` — Referência SmartFlow: timeline horizontal, step circles, detail tables

---

## CONTEXTO DO PROJETO

Você é um engenheiro de software sênior especializado em React, TypeScript e aplicações enterprise. Você vai criar do zero o **SMART BID 2.0** — uma plataforma de gestão de propostas comerciais (BIDs) para a **Oceaneering Brasil** (empresa de engenharia submarina de Oil & Gas).

A aplicação substitui uma Web Part SPFx monolítica legada. Ela será deployada como SPFx Web Part que renderiza um app React moderno. Os dados vêm de listas SharePoint Online via PnPjs.

**SharePoint Site:** `https://oceaneering.sharepoint.com/sites/G-OPGSSRBrazilEngineering`

**Escopo do sistema:** O Smart BID foca no levantamento e compilação de custos (horas, assets, recursos) pela Engenharia para suportar o time Comercial. **NÃO** envolve preço final para o cliente — margem, markup e pricing são responsabilidade exclusiva do Comercial, fora do sistema. Após a entrega dos custos, o sistema provê Follow-Up / BID Results para rastrear resultados.

**Importante:** Nesta fase inicial, use dados mock realistas para toda a aplicação. A integração real com SharePoint será adicionada depois. O foco é na estrutura, UI/UX e funcionalidades completas.

**Referência de design:** O projeto **SmartFlow Warehouse** (mesmo autor) serve de base para layout, padrões de componente e arquitetura de serviço. O SMART BID 2.0 evolui esses padrões com inovações visuais adicionais (glass morphism, animated counters, command palette, Framer Motion).

---

## STACK TECNOLÓGICO OBRIGATÓRIO

```
Framework:        React 18+ com TypeScript (strict mode)
Build:            Vite
State Management: Zustand
Routing:          React Router v6 (lazy loading por rota)
Styling:          Tailwind CSS + CSS Modules (quando escopo necessário)
Components:       Shadcn/UI + Radix UI
Charts:           Recharts
Tables:           TanStack Table v8 (React Table)
Forms:            React Hook Form + Zod (validação)
Data Fetching:    TanStack Query (React Query)
Drag & Drop:      @dnd-kit/core + @dnd-kit/sortable
Excel:            SheetJS (xlsx)
PDF:              jsPDF + jspdf-autotable
Icons:            Lucide React
Date:             date-fns
Animations:       Framer Motion
Linting:          ESLint + Prettier
Testing:          Vitest + Testing Library
```

---

## IDENTIDADE VISUAL (DESIGN SYSTEM)

A aplicação tem **Dark Mode (padrão)** e **Light Mode**, inspirada no SmartFlow Warehouse com inovações visuais.

### Dark Mode (Padrão)

```css
--sidebar-bg: #0a1628;
--sidebar-hover: rgba(0, 201, 167, 0.08);
--main-bg: #0f1b2d;
--card-bg: #152238;
--card-bg-elevated: #1a2d4a;
--primary-accent: #00c9a7; /* Teal — botões, indicadores, progresso */
--secondary-accent: #3b82f6; /* Azul — links, ícones ativos */
--tertiary-accent: #8b5cf6; /* Roxo — badges especiais, IA */
--success: #10b981;
--warning: #f59e0b;
--danger: #ef4444;
--info: #06b6d4;
--text-primary: #f1f5f9;
--text-secondary: #94a3b8;
--text-muted: #64748b;
--border: #1e3a5f;
--border-subtle: #162d50;
--glass-bg: rgba(21, 34, 56, 0.7);
--glass-border: rgba(255, 255, 255, 0.08);
--gradient-header: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
--gradient-primary: linear-gradient(135deg, #00c9a7 0%, #0d9488 100%);
--gradient-accent: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
--shadow-glow: 0 0 20px rgba(0, 201, 167, 0.15);
```

### Light Mode

```css
--sidebar-bg: #1a2332; /* Sidebar permanece escura */
--sidebar-hover: rgba(0, 201, 167, 0.12);
--main-bg: #f8fafc;
--card-bg: #ffffff;
--card-bg-elevated: #f1f5f9;
--primary-accent: #0d9488;
--secondary-accent: #2563eb;
--tertiary-accent: #7c3aed;
--text-primary: #1e293b;
--text-secondary: #64748b;
--border: #e2e8f0;
--border-subtle: #f1f5f9;
--glass-bg: rgba(255, 255, 255, 0.8);
--glass-border: rgba(0, 0, 0, 0.05);
--gradient-header: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
```

### Tipografia

```
Font Family: Inter (Google Fonts)
H1:          28px / 700       (Page headers, gradient headers)
H2:          22px / 600       (Section titles)
H3:          18px / 600       (Card titles)
Body:        14px / 400       (General text)
Caption:     12px / 400       (Labels, metadata)
KPI Numbers: 36px / 700       (Dashboard numbers, animated counters)
Table Data:  13px / 400       (Table cells)
Monospace:   JetBrains Mono / 13px  (BID #, CRM codes, Part Numbers)
```

### Regras de Componentes

| Componente    | Especificação                                                                                                                                              |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cards         | border-radius: 16px, padding: 24px, glass morphism sutil em dark mode, hover com glow + elevação (translateY -2px), transition 250ms                       |
| Buttons       | Primary (gradient teal), Secondary (outline + hover fill), Danger (vermelho), Ghost (transparente), Icon (circular 40px). Hover: translateY(-1px) + shadow |
| Inputs        | Background transparente, borda inferior 2px, focus: borda teal + glow sutil, label float animation                                                         |
| Badges        | Pill shape (border-radius: 999px), cores por status, font 11px semibold. Variante pulsing para urgentes                                                    |
| Tables        | Header sticky com backdrop-blur, linhas zebradas, hover highlight com borda esquerda colorida, paginação                                                   |
| Modals        | Overlay blur (backdrop-filter: blur(8px)), max-width 640px, animação scale+fade (Framer Motion)                                                            |
| Toasts        | Canto inferior direito, auto-dismiss 5s, ícone + mensagem, slide-in animation, stacking                                                                    |
| Sidebar Items | Ícone + label, tooltip quando colapsado, badge pulsing, selectedItem: borda esquerda teal                                                                  |
| Stat Cards    | Número com animated counter (Framer Motion), trend arrow colorido, sparkline SVG, borda lateral cor da categoria                                           |
| Page Headers  | Gradient background (#0f172a → #1e293b), ícone grande (48px, azul claro), título branco, subtítulo slate                                                   |
| Skeleton      | Shimmer animation para loading states                                                                                                                      |
| Empty States  | Ilustração SVG + título + subtítulo + CTA button                                                                                                           |

---

## LAYOUT GLOBAL

```
┌──────────────────────────────────────────────────────────┐
│ HEADER (64px altura)                                      │
│ [🔍 Ctrl+K Search]          [🔔 3] [⚙] [Avatar Raphael] │
├──────────┬───────────────────────────────────────────────┤
│          │                                               │
│ SIDEBAR  │  MAIN CONTENT AREA                            │
│ (260px   │                                               │
│  ou 64px │  "Good Morning, Raphael"                      │
│ collapsed│  BID Dashboard                            │
│          │  Last updated: Mar 17, 2026 09:30 [🔄]        │
│          │                                               │
│          │  [Conteúdo da página ativa]                    │
│          │                                               │
├──────────┼───────────────────────────────────────────────┤
│          │ FOOTER (40px)                                  │
│          │ © 2026 Oceaneering │ v2.0.0 │ 🟢 BRAZIL       │
└──────────┴───────────────────────────────────────────────┘
```

### Header (padrão SmartFlow)

- **Search Bar** (centro-esquerda): busca global por BID #, CRM, cliente, com autocomplete agrupado. Debounce 300ms. `Ctrl+K` abre o Command Palette.
- **Notification Bell** (direita): sino com badge pulsante. Dropdown com últimas 10 notificações. Hover automático marca como lida (3s delay, padrão SmartFlow). Filtro All/Unread. Click navega ao BID.
- **Settings Gear** (direita): link para System Configuration
- **User Avatar** (extrema direita): foto Microsoft Graph (base64, padrão SmartFlow) + nome + cargo. Dropdown: My Profile, Preferences, Dark/Light, Logout. Fallback: iniciais com gradient.

### Sidebar (padrão SmartFlow)

Expandível (260px) / colapsável (64px), animação 300ms ease.

```
┌─────────────────────────┐
│  ◆ SMART BID            │
│  Oceaneering · Bid Dept │
├─────────────────────────┤
│  + Create Request       │  ← Gradient teal, glow
│                         │
│  WORKSPACE              │
│  📋 BID Tracker         │
│  📂 Unassigned Requests │  (badge pulsante)
│  📊 My Dashboard        │
│  📅 Timeline View       │
│  🔔 Notifications       │
│  ❓ FAQ & Instructions  │
│                         │
│  KNOWLEDGE BASE         │
│  📑 Datasheets (86)     │
│  📁 Past Bids (200)     │
│  ❓ Qualifications (143)│
│  🔧 Manuals (57)        │
│  ⚠ Op. Alerts (29)      │
│                         │
│  INSIGHTS               │
│  📈 Analytics        ▼  │  ← Submenu colapsável
│    ├ Performance Trends  │
│    ├ Bottleneck Analysis │
│    ├ Team Analytics      │
│                         │
│  REPORTS                │
│  📊 Reports & Export  ▼  │  ← Submenu colapsável
│    ├ Period Performance  │
│    ├ BID Details         │
│    └ Operational Summary │
│                         │
│  TOOLS                  │
│  ⭐ Favorites           │
│  💰 Quotations          │
│  🔧 Tooling Report      │
│  💲 Price Consulting     │
│                         │
│  SETTINGS               │
│  ⚙ System Configuration │  ← Padrão SmartFlow
│  👥 Members Management   │  ← Padrão SmartFlow
│  📋 Patch Notes          │
│                         │
│  [🌙/☀] Dark/Light      │
│  OCEANEERING            │
│  Created by R. Costa    │
└─────────────────────────┘
```

Features da Sidebar conforme SmartFlow:

- Seções uppercase com linha separadora
- Submenus com slideDown + chevron rotation
- Item ativo: borda esquerda 3px teal + bg highlight
- Badge pulsante para urgentes
- Tooltips instantâneos quando colapsada
- Access level checking (disabled/oculto)

### Footer (padrão SmartFlow)

```
© 2026 Oceaneering  |  Smart BID v2.0.0 (→ Patch Notes)  |  🟢 BRAZIL  |  09:30:45 (live)  |  oceaneering.com
```

---

## GUEST MODE (padrão SmartFlow)

Usuário não registrado → Guest Mode:

- Banner fixo: "Demo Mode: viewing with mock data as a Guest."
- Navegação completa, dados mock
- Operações de escrita bloqueadas
- Dashboard selector para alternar visões

---

## COMMAND PALETTE (Inovação UI — atalho Ctrl+K)

Overlay com busca fuzzy em BIDs, Requests, Clients, Pages. Keyboard navigation. Scale+blur animation.

---

## PÁGINAS — RESUMO

> **Estrutura de pastas completa, rotas e componentes:** ver `SMART-BID-2.0-ARCHITECTURE.md` seções 3 e 14.

### Página 1: Dashboard — BID Tracker Overview (`/`)

> **Wireframe detalhado:** ver `ARCHITECTURE.md` seção 14.3

Layout em 4 zonas:

- **Header:** "BID Tracker · Overview", breadcrumb, Global Filter Panel (Cliente, Divisão, Status, Período), botões "Novo BID Request", "Export Excel", "Export PDF"
- **Linha 1 — KPI Cards (6 cards Bento Grid):** BIDs Ativos (contagem), Horas Eng. 30d (total + % vs anterior), On-Time Delivery % (verde/amarelo/vermelho), BIDs em Risco de Prazo (badge vermelho), Win Rate (resultado sem valor comercial), Pipeline Value (total USD ativo, 2-col wide). Cada card: animated counter + sparkline SVG + target bar + trend arrow
- **Linha 2 — Pipeline + Workload (2 colunas):** Esquerda: Recharts BarChart horizontal Pipeline por estágio (Request → Kick-Off → Analysis → Cost → Elaboration → Approval → Completed), clicável filtra tabela. Direita: Recharts PieChart donut Horas por Divisão (OPG/SSR-ROV/Survey/Integrated), toggle 7/30/90 dias
- **Linha 3 — Atividade + Deadlines (2 colunas):** Esquerda: Recent Activity timeline vertical (últimos 10 eventos, avatars, relative time). Direita: Upcoming Deadlines lista com countdown badges, click → BID Detail
- **Linha 4 — Tabela BID Tracker (full width):** TanStack Table — BID#, Client, Project, Division, Owner, Horas Total, Due Date, Status (chips de cor). Tooltips com resumo, badge "Critical Asset", indicador Follow-Up. Sorting, pagination 25/50/100

### Página 2: BID Tracker — Kanban/List/Table (`/tracker`)

- 3 modos: Kanban (drag&drop colunas por divisão), List (cards vertical), Table (TanStack completo)
- Filtros avançados expansíveis (padrão SmartFlow MoreFilters)
- 15+ BID cards com glass morphism hover
- Status flow visual com 18 status (ver ARCHITECTURE seção 5.2)

### Página 3: FlowBoard (`/flowboard`)

- Board panorâmico adaptado do SmartFlow FlowBoard.tsx (ver ARCHITECTURE seção 11)
- Colunas por divisão (default) ou por status (Kanban), drag-drop reorder
- Auto-refresh 30s, smart sorting (overdue → priority → date), color coding
- Dark/light toggle, mobile responsive com column selector

### Página 4: Unassigned Requests (`/requests`)

- Gradient header, sorting/filtering (padrão SmartFlow)
- Request cards com priority badges pulsantes
- Ações: Assign Owner, Start BID, Reject, Request Info

### Página 5: Create Request (`/requests/new`)

- Multi-step wizard (4 steps): Client Info → Scope/Division → Attachments/Priority → Review & Submit
- React Hook Form + Zod validation, progress indicator

### Página 6: BID Detail (`/bid/:id`) — **PÁGINA CENTRAL DO SISTEMA**

> **Wireframe detalhado de cada tab:** ver `ARCHITECTURE.md` seção 14.2

- **14 tabs:** Overview, Scope of Supply, Hours & Resources, Cost Summary, Tasks & Phases, Timeline & Milestones, Approval, Documents, Comments, BID Notes (Analysis), Qualifications, AI Analysis, Activity Log, Export
- **Scope of Supply** = tabela TanStack de equipamentos com CAPEX/OPEX, Import from Template, Add row, Bulk edit
- **Hours & Resources** = 3 sub-tabs (Engineering, Onshore, Offshore) com TanStack Table editável
- **Timeline & Milestones** = Gantt visual + step circles (padrão OrderDetailsModal.tsx)
- **Approval** = Cards de aprovadores com status + botão Request Approval (→ PA trigger)
- Accordion sections com Framer Motion, status dropdown com color transition
- Activity Log: timeline de todas as ações (padrão SmartFlow OrderTimeline)

### Página 7: My Dashboard (`/my-dashboard`)

> **Wireframe detalhado:** ver `ARCHITECTURE.md` seção 14.4

Layout em 4 zonas:

- **Linha 1 — Cards pessoais (3 cards):** Meus BIDs Ativos (contagem + breakdown on-track/overdue), Horas Comprometidas (capacity bar semanal), Deadlines Próximos (contagem ≤ 5 dias)
- **Linha 2 — Meus BIDs + Agenda (2 colunas):** Esquerda: TanStack Table compacto (BID, Client, Due, Status, Horas) com botões [Abrir] [Cost Breakdown] [Follow-Up]. Direita: Mini agenda/timeline (Hoje + Próximos 7 dias milestones)
- **Linha 3 — Pending Approvals + Follow-Ups (2 colunas):** Esquerda: Cards de aprovação com botões Approve/Reject/Revision. Direita: Últimos Follow-Ups registrados (resultado + motivo)
- **Linha 4 — Tarefas RACI (full width):** Checklist de tasks RACI atribuídas ao usuário logado

### Página 8: BID Results & Insights (`/results`)

> **Wireframe detalhado:** ver `ARCHITECTURE.md` seção 14.5

Layout em 3 blocos:

- **Bloco 1 — KPIs históricos (5 cards):** Total BIDs Analisados, Win Rate (sparkline), Tempo Médio Ciclo Eng, Follow-Up Documentado %, Top Motivo Perda
- **Bloco 2 — Gráficos (2×2 grid):** Win/Loss por Cliente (stacked bar), Motivos de Perda (donut), Horas Eng × Resultado (scatter), Tempo Resposta Comercial (histogram)
- **Bloco 3 — Tabela Follow-Ups (full width):** TanStack Table com BID#, Client, Resultado, Motivo, Data Retorno. Click → Modal com registro completo

### Página 9: Templates Library (`/templates`)

- Biblioteca de templates de equipamento pré-configurados
- CRUD, clone, preview, import wizard
- Ver ARCHITECTURE seção 8

### Página 10: Notifications (`/notifications`)

- Central de notificações com filtros (All/Unread)
- Hover-to-read (padrão SmartFlow)

### Página 11: Analytics (`/analytics/*`)

- 3 sub-páginas: Performance Trends, Bottleneck Analysis, Team Analytics

### Página 12: Knowledge Base (`/knowledge/*`)

- Grid de cards com gradient e hover animation
- Datasheets, Past Bids, Qualifications, Manuals, Op. Alerts

### Página 13: Reports & Export (`/reports/*`)

- Period Performance, BID Details Report, Operational Summary
- Export multi-tab Excel, PDF, CSV (ver ARCHITECTURE seção 10)

### Página 14: Tools (`/tools/*`)

- Favorites, Quotations, Tooling Report, Price Consulting

### Página 15: System Configuration (`/settings/config`)

**Baseado no SmartFlow SystemConfiguration.tsx (2584 linhas)**, expandido para 22+ tabs. Ver ARCHITECTURE seção 14.6 para lista completa.

> **Todos os dropdowns são campos editáveis** salvos como JSON na lista `smartbid-config`, padrão IConfigOption do SmartFlow. Nenhum dropdown é hardcoded.

### Página 16: Members Management (`/settings/members`)

**Baseado no SmartFlow MembersManagement.tsx (1334 linhas):**

- Gradient header, stat cards per role category (6 cards)
- Member cards com avatar (Graph base64), badges, active status
- Add Member dialog com People Picker (Azure AD) + Graph photo enrichment
- Edit Member dialog com role dropdown + active toggle
- Super Admin override (`SUPER_ADMIN_EMAILS`), access level checks
- Roles: Manager, Engineer, Bidder, Project Team, Viewer, Guest

### Página 17: Patch Notes (`/settings/patch-notes`)

**Padrão SmartFlow** — histórico de versões + Latest Update Popup

### Página 18: FAQ & Instructions (`/faq`)

- Guia de uso do sistema, perguntas frequentes

### Página 19: AI Chat Panel (Floating)

Botão flutuante com glow → painel lateral 380px com chat mock (placeholder)

---

## DADOS MOCK

- 15+ BIDs com owners/bidders como objetos (name, email, photoUrl) — JSON segue modelo IBid da ARCHITECTURE
- 5+ Requests com priority badges
- Notificações com tipos padronizados (padrão SmartFlow ActivityLog)
- System Config completo com 22+ seções (KPI targets, regions, divisions, service lines, job functions, hours phases, acquisition types, deliverable types, equipment categories, bid result options, currency/PTAX, approval rules, notification rules, access levels, clients, bid types, bid sizes, bid statuses, phases, cost references, loss reasons, equipment sub-categories) — ver ARCHITECTURE seção 4.2
- 20+ Members organizados por categoria (manager, engineer, bidder, projectTeam, viewer)
- 5+ Templates de equipamento
- Aprovações exemplo
- Usuário logado: Raphael Costa, Manager, com teamCategory
- Roles: Manager, Engineer, Bidder, Project Team, Viewer, Guest

---

## SHAREPOINT CHROME CLEANUP (Tela em Branco)

O Smart BID roda como SPFx Web Part dentro do SharePoint Online. Para que o app React ocupe 100% da tela, precisamos de um arquivo `sharepoint-overrides.css` (importado no `main.tsx`) que **esconde todo o Chrome do SharePoint** e remove limites de largura. Detalhes completos: ver `ARCHITECTURE.md` seção 17.

**Resumo do que esconder/ajustar:**

| Categoria                           | O que fazer                                                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Suite Nav Bar** (barra azul O365) | `#SuiteNavWrapper` → `display:none`, `height:0`, `position:absolute`, `top:-9999px`                                    |
| **App Bar** (barra lateral SP)      | `#sp-appBar`, `.sp-appBar:not([class*="parent"])` → esconder. **NÃO** usar `[class*="appBar"]` (quebra mobile)         |
| **Site Header**                     | `div[data-sp-feature-tag="Site header host"]`, `#spSiteHeader` → esconder                                              |
| **Hub Nav / Left Nav**              | `.ms-HubNav`, `#spLeftNav` → `display:none`                                                                            |
| **Command Bar** (Editar/Publicar)   | `.ms-CommandBar`, `[data-automation-id="pageCommandBar"]` → `display:none`                                             |
| **Search/Settings/Help**            | Scoped ao Chrome SP (NÃO ao nosso SearchBox) → esconder                                                                |
| **Comments**                        | `[data-sp-feature-tag="Comments"]`, `.CommentsWrapper` → esconder                                                      |
| **Canvas Zones**                    | `.CanvasZone`, `.CanvasSection`, `.ControlZone`, `#workbenchPageContent` → `max-width:none`, `width:100%`, `padding:0` |
| **Inline styles**                   | `div[style*="max-width"]`, `div[style*="width: 924px"]` → override (excluir popups)                                    |
| **Fluent UI**                       | `.ms-Button`, `.ms-TextField`, `.ms-Dropdown` etc. → override font/cores para nosso tema                               |
| **Print**                           | `@media print` → esconder Chrome + full-width                                                                          |
| **Mobile**                          | `@media (max-width:1024px)` → mesmo tratamento + `.sp-appBar-parent-mobile { padding-bottom:0 }`                       |
| **Accessibility**                   | `*:focus-visible` outline, `.skip-to-main`, `prefers-contrast:high`, `prefers-reduced-motion:reduce`                   |

**Container raiz:**

```css
:global {
  .smartBid {
    width: 100% !important;
    min-height: 100vh;
    background: var(--main-bg);
    display: flex !important;
    margin: 0 !important;
    padding: 0 !important;
    position: relative !important;
    z-index: 1 !important;
    overflow: hidden !important;
  }
}
```

> Referência funcional: `sharepoint-overrides.scss` do SmartFlow Warehouse (anexo).

---

## LISTAS SHAREPOINT — CRIAÇÃO MANUAL

**SharePoint Site:** `https://oceaneering.sharepoint.com/sites/G-OPGSSRBrazilEngineering`

Criar as seguintes listas/libraries no site acima. Detalhes completos com JSON examples: ver `ARCHITECTURE.md` seções 4 e 16.

### Resumo

| #   | Nome                      | Tipo             | Colunas (além de Title)                                                                                                                                                                 | Items Iniciais |
| --- | ------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| 1   | `smartbid-tracker`        | Custom List      | `jsondata` (multi-line, plain, unlimited), `Status` (text, indexed), `Division` (text, indexed), `DueDate` (DateTime, indexed), `Owner` (text, indexed), `Phase` (text, indexed)        | 0              |
| 2   | `smartbid-config`         | Custom List      | `ConfigValue` (multi-line, plain, unlimited)                                                                                                                                            | 7 items        |
| 3   | `smartbid-status-tracker` | Custom List      | `jsondata` (multi-line, plain, unlimited), `ChangeType` (text, indexed), `IsProcessed` (Yes/No, default No, indexed)                                                                    | 0              |
| 4   | `smartbid-approvals`      | Custom List      | `ApprovalId` (text, unique, indexed), `jsondata` (multi-line, plain, unlimited), `ApproverEmail` (text, indexed), `Status` (text, indexed), `IsProcessed` (Yes/No, default No, indexed) | 0              |
| 5   | `SmartBidAttachments`     | Document Library | nenhuma extra (organização por pasta auto-criada por BID)                                                                                                                               | 0              |

### Detalhes por lista

**1. `smartbid-tracker`** — Armazena todos os BIDs como JSON blob na coluna `jsondata`. Colunas redundantes (`Status`, `Division`, `DueDate`, `Owner`, `Phase`) são indexadas para queries OData rápidas sem carregar todos os BIDs. Title = BID Number (`BID-2026-0001`).

**2. `smartbid-config`** — Cada item é um par chave-valor. Title = Config Key, ConfigValue = JSON string. Items iniciais obrigatórios:

- `SYSTEM_CONFIG` → Default ISystemConfig JSON (KPI targets, divisions, service lines, job functions, hours phases, acquisition types, equipment categories, bid result options, currency, notifications, access levels, approval rules, bid statuses, phases, cost references, equipment sub-categories, loss reasons, comment sections, attachment categories, status indicators, units, bid notes sections)
- `TEAM_MEMBERS` → Empty IMembersData JSON
- `ACTIVITY_LOG` → Empty array JSON
- `BID_TEMPLATES` → Empty array JSON
- `APPROVAL_RULES` → Default rules JSON
- `QUOTATION_DATABASE` → Empty array JSON
- `PATCH_NOTES` → Initial version JSON

**3. `smartbid-status-tracker`** — Power Automate trigger list. Cada evento do BID gera um item com ChangeType (`BID_CREATED`, `BID_ASSIGNED`, `STATUS_CHANGED`, `APPROVAL_REQUESTED`, `BID_COMPLETED`, etc. — 16 tipos). PA lê items onde `IsProcessed=No` e envia Adaptive Card no Teams.

**4. `smartbid-approvals`** — Cada aprovação individual. PA envia card com botões Approve/Reject, resposta grava nesta lista.

**5. `SmartBidAttachments`** — Document Library com pastas auto-criadas por BID: `BID-2026-0001/Client-Documents/`, `Technical-Analysis/`, `Cost-Sheets/`, `Proposals/`, `Approvals/`, `Exports/`.

---

## MOCK DATA → INTEGRAÇÃO SHAREPOINT

Na fase inicial, **tudo usa dados mock**. O mapa abaixo mostra cada mock file e onde será trocado por dados reais na Fase 6 (Integration).

| Mock File                                  | Service                   | Lista SP Real                                          | Config Key       |
| ------------------------------------------ | ------------------------- | ------------------------------------------------------ | ---------------- |
| `src/data/mockBids.ts` (15+ BIDs)          | `BidService.ts`           | `smartbid-tracker` → `jsondata`                        | —                |
| `src/data/mockRequests.ts` (5+ requests)   | `RequestService.ts`       | `smartbid-tracker` (filtro `status=request-submitted`) | —                |
| `src/data/mockMembers.ts` (20+ members)    | `MembersService.ts`       | `smartbid-config`                                      | `TEAM_MEMBERS`   |
| `src/data/mockTemplates.ts` (5+ templates) | `TemplateService.ts`      | `smartbid-config`                                      | `BID_TEMPLATES`  |
| `src/data/mockApprovals.ts`                | `ApprovalService.ts`      | `smartbid-approvals` → `jsondata`                      | —                |
| `src/data/mockNotifications.ts`            | `NotificationService.ts`  | `smartbid-status-tracker` + in-memory                  | —                |
| `src/data/mockKnowledgeBase.ts`            | `KnowledgeBaseService.ts` | `smartbid-config`                                      | `KNOWLEDGE_BASE` |
| `src/data/mockSystemConfig.ts`             | `SystemConfigService.ts`  | `smartbid-config`                                      | `SYSTEM_CONFIG`  |

**Padrão de substituição:** Cada service usa `MockDataService` em dev/Guest Mode e `SPService.getListItems()` em produção. Guest Mode **sempre** usa mock.

> Ver `ARCHITECTURE.md` seção 18 para padrão completo de código e checklist de integração.

---

## REFERÊNCIAS DE CÓDIGO SMARTFLOW

Os seguintes componentes do SmartFlow Warehouse (anexos) servem como **base estrutural** para o Smart BID 2.0:

| Componente SmartFlow      | Linhas | Base para                                      | Padrões a reutilizar                                                                                       |
| ------------------------- | ------ | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `MembersManagement.tsx`   | 1334   | Members Management, BID Detail people sections | Gradient header, stat cards, People Picker + Graph photo, add/edit dialogs, super admin, role badge bucket |
| `OrderDetailsModal.tsx`   | 625    | BID Detail → Timeline & Activity Log tabs      | Timeline horizontal step circles, SVG connectors, duration calcs, conditional history sections             |
| `SystemConfiguration.tsx` | 2584   | System Configuration (22+ tabs)                | Tab button nav, Panel CRUD, temp state, notification matrix, access grid                                   |
| `FlowBoard.tsx`           | 756    | FlowBoard page                                 | Kanban drag-drop columns, auto-refresh 30s, smart sorting, dark/light toggle, mobile responsive            |
| `DashboardRouter.tsx`     | 227    | Dashboard routing por role                     | Switch por teamCategory, Guest dashboard selector                                                          |

---

## REGRAS DE IMPLEMENTAÇÃO

1. TypeScript strict com interfaces para tudo
2. Componentes ≤150 linhas, named exports
3. Zustand para estado global, useState para local
4. Lazy loading + Skeleton fallback
5. Framer Motion para animações (sidebar, modals, cards, KPIs, pages)
6. Responsive 768px–1920px+, sidebar overlay em tablet
7. ARIA labels, focus indicators, keyboard nav
8. Memoize pesados, virtualize tabelas >50 rows, debounce 300ms
9. Padrões SmartFlow: services singleton, access levels RBAC, notifications hover-to-read, member management (People Picker + Graph), system config (tabbed + IConfigOption)
10. Guest Mode com isGuestUser check e bloqueio de escrita

---

## ORDEM DE CRIAÇÃO

1. Setup (package.json, vite.config, tailwind.config, tsconfig)
2. Design System (theme, globals.css, animations.css, sharepoint-overrides.css, UI components)
3. Layout (AppLayout, Sidebar, Header, Footer, CommandPalette, GuestModeBanner)
4. Mock Data (completo e realista, baseado nos modelos JSON da ARCHITECTURE)
5. Pages (nesta ordem):
   - Dashboard (4 zonas: filtros, KPIs, charts, tabela) → BID Tracker (Kanban/List/Table) → FlowBoard
   - BID Detail (14 tabs: Overview, Scope of Supply, Hours, Cost Summary, Tasks, Timeline, Approval, Documents, Comments, BID Notes, Qualifications, AI Analysis, Activity Log, Export)
   - Unassigned Requests → Create Request Wizard
   - My Dashboard (cards pessoais, meus BIDs, agenda, pending approvals, tarefas RACI)
   - BID Results & Insights (KPIs históricos, 4 gráficos analíticos, tabela follow-ups)
   - Templates Library → Notifications
   - Analytics → Reports → Knowledge Base → Tools
   - System Configuration (22+ tabs, ref: SystemConfiguration.tsx) → Members Management (ref: MembersManagement.tsx) → Patch Notes → FAQ
6. AI Chat Panel (floating, placeholder)

**O projeto deve compilar e rodar sem erros com `npm run dev`.**
