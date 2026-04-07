# SMART BID 2.0 — Especificação Completa

> ⚠ **DOCUMENTO SUPERSEDED** — Este é o Draft v1.0 original (17 Mar 2026). A versão atualizada e fonte de verdade é o **`SMART-BID-2.0-ARCHITECTURE.md`** (v2.0, 02 Abr 2026).
> Diferenças principais: divisões atualizadas (NPD → SSR-Integrated), 18 status (vs 11), 12 tabs BID Detail (vs 7), 17 tabs System Config (vs 9), 6 roles (vs 4), 12 KPIs (vs 7), escopo clarificado (sem pricing/margins), modelo de dados com CAPEX/OPEX, horas Eng/Onshore/Offshore, BID Results page, templates de equipamento, sistema de aprovação Teams.

> **Versão:** 1.0  
> **Data:** 17 de Março de 2026  
> **Autor:** Raphael Costa  
> **Status:** Draft

---

## 1. Visão Geral

O **SMART BID 2.0** é a reformulação completa da plataforma de gestão de propostas comerciais (BIDs) da **Oceaneering Brasil**. O objetivo é transformar a atual Web Part SPFx monolítica em uma aplicação moderna **React** com arquitetura modular, design profissional inspirado no SmartFlow Warehouse, e integração com **Inteligência Artificial** para assistir na análise de BIDs.

### 1.1 Objetivos Estratégicos

| Objetivo                   | Descrição                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Redesign Completo**      | Nova identidade visual com UI/UX profissional, dark/light mode, responsividade                           |
| **Arquitetura Moderna**    | React com TypeScript, estrutura de pastas escalável, componentes reutilizáveis                           |
| **Fluxo Otimizado**        | Separação clara entre Requests (solicitações) e BIDs (propostas em andamento)                            |
| **IA Integrada**           | Assistente de IA para análise de especificações técnicas, sugestão de equipamentos e estimativa de horas |
| **Performance**            | Lazy loading, code splitting, state management eficiente, caching de dados                               |
| **Experiência de Usuário** | Navegação intuitiva, barra lateral colapsável, dashboard com KPIs em tempo real                          |

### 1.2 Público-Alvo

- **Comercial (Bidders):** Criam solicitações de BID e acompanham o status
- **Engenharia (Owners):** Trabalham nos BIDs, estimam horas, selecionam ferramental
- **Liderança (Managers):** Aprovam BIDs, acompanham KPIs e dashboards
- **Administradores:** Configuram o sistema, gerenciam usuários, definem parâmetros

---

## 2. Identidade Visual e Design System

### 2.1 Tema e Paleta de Cores

Inspirado no **SmartFlow Warehouse**, a aplicação terá dois modos:

#### Dark Mode (Padrão)

| Elemento               | Cor                       | Uso                                             |
| ---------------------- | ------------------------- | ----------------------------------------------- |
| **Sidebar Background** | `#0A1628`                 | Fundo da barra lateral                          |
| **Main Background**    | `#0F1B2D`                 | Fundo da área principal                         |
| **Card Background**    | `#152238`                 | Fundo de cards e painéis                        |
| **Primary Accent**     | `#00C9A7` (Teal/Turquesa) | Botões primários, indicadores ativos, progresso |
| **Secondary Accent**   | `#3B82F6` (Azul)          | Links, ícones ativos                            |
| **Success**            | `#10B981`                 | Status positivo, aprovações                     |
| **Warning**            | `#F59E0B`                 | Alertas, prazos próximos                        |
| **Danger**             | `#EF4444`                 | Erros, prazos vencidos, rejeições               |
| **Text Primary**       | `#F1F5F9`                 | Texto principal                                 |
| **Text Secondary**     | `#94A3B8`                 | Texto secundário, labels                        |
| **Border/Divider**     | `#1E3A5F`                 | Bordas e separadores                            |

#### Light Mode

| Elemento               | Cor              | Uso                                 |
| ---------------------- | ---------------- | ----------------------------------- |
| **Sidebar Background** | `#1A2332`        | Mantém sidebar escura por contraste |
| **Main Background**    | `#F8FAFC`        | Fundo claro principal               |
| **Card Background**    | `#FFFFFF`        | Cards brancos com sombra sutil      |
| **Primary Accent**     | `#0D9488` (Teal) | Mantém identidade                   |
| **Text Primary**       | `#1E293B`        | Texto escuro                        |

### 2.2 Tipografia

| Uso               | Font  | Tamanho | Weight |
| ----------------- | ----- | ------- | ------ |
| **Headings H1**   | Inter | 28px    | 700    |
| **Headings H2**   | Inter | 22px    | 600    |
| **Headings H3**   | Inter | 18px    | 600    |
| **Body**          | Inter | 14px    | 400    |
| **Small/Caption** | Inter | 12px    | 400    |
| **KPI Numbers**   | Inter | 36px    | 700    |
| **Table Data**    | Inter | 13px    | 400    |

### 2.3 Componentes do Design System

| Componente        | Especificação                                                                           |
| ----------------- | --------------------------------------------------------------------------------------- |
| **Cards**         | Border-radius: 12px, padding: 24px, sombra sutil, hover com elevação                    |
| **Buttons**       | Primary (teal preenchido), Secondary (outline), Danger (vermelho), Ghost (transparente) |
| **Inputs**        | Background transparente, borda inferior, focus com cor primária                         |
| **Badges/Tags**   | Pill shape, cores por status, font 12px bold                                            |
| **Tables**        | Header sticky, linhas zebradas, hover highlight, paginação                              |
| **Charts**        | Recharts com paleta consistente, tooltips customizados                                  |
| **Modals**        | Overlay blur, max-width 600px, animação fade+slide                                      |
| **Toasts**        | Canto inferior direito, auto-dismiss 5s, ícone + mensagem                               |
| **Sidebar Items** | Ícone + label, tooltip quando colapsado, badge de contagem                              |

---

## 3. Layout Global da Aplicação

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (64px)                                        [Perfil] ▼ │
│ [🔍 Search]                    [🔔 Notif] [⚙ Config] [Avatar]  │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│ SIDEBAR  │               MAIN CONTENT AREA                      │
│ (240px   │                                                      │
│  or 64px │                                                      │
│ collapsed│    ┌──────────────────────────────────────────┐      │
│          │    │         Page Content Here                │      │
│ [Logo]   │    │                                          │      │
│ [Nav     │    │                                          │      │
│  Items]  │    │                                          │      │
│          │    │                                          │      │
│          │    │                                          │      │
│          │    └──────────────────────────────────────────┘      │
│          │                                                      │
│ [Theme]  │                                                      │
│ [Brand]  │──────────────────────────────────────────────────────│
├──────────┤ FOOTER (40px)                                        │
│          │ © 2026 Oceaneering  │  Smart BID v2.0  │  🟢 BRAZIL  │
└──────────┴──────────────────────────────────────────────────────┘
```

### 3.1 Header

| Elemento               | Posição              | Descrição                                                                        |
| ---------------------- | -------------------- | -------------------------------------------------------------------------------- |
| **Search Bar**         | Centro-esquerda      | Busca global por BID, CRM, cliente (com sugestões autocomplete)                  |
| **Notifications Bell** | Direita              | Ícone de sino com badge de contagem. Dropdown com lista de notificações recentes |
| **Settings Gear**      | Direita              | Acesso rápido a configurações                                                    |
| **User Avatar + Name** | Extrema direita      | Foto do perfil + nome + cargo. Dropdown com: My Profile, Preferences, Logout     |
| **Greeting**           | Topo do main content | "Good Morning, {Nome}" + subtítulo contextual (ex: "Manager Dashboard")          |
| **Last Updated**       | Direita do greeting  | Timestamp da última atualização + botão Refresh                                  |

### 3.2 Sidebar (Barra de Navegação)

A sidebar é **expansível e colapsável** com animação suave. Quando colapsada, mostra apenas ícones com tooltips.

#### Estrutura de Navegação

```
┌─────────────────────────┐
│  [Logo] SMART BID       │
│  Oceaneering · Bid Dept │
├─────────────────────────┤
│                         │
│  + Create Request       │  ← Botão destacado (teal)
│                         │
│  WORKSPACE              │
│  ────────────────────── │
│  📋 BID Tracker         │  ← Kanban panorama (antiga tela inicial)
│  📂 Unassigned Requests │  ← Solicitações abertas (badge: 3)
│  📊 My Dashboard        │  ← Dashboard pessoal do usuário
│  📅 Timeline View       │  ← Visão gantt dos BIDs
│  🔔 Notifications       │  ← Central de notificações
│  ❓ FAQ & Instructions  │  ← Guia de uso
│                         │
│  KNOWLEDGE BASE         │
│  ────────────────────── │
│  📑 Datasheets          │  ← (badge: 86)
│  📁 Past Bids           │  ← (badge: 200)
│  ❓ Qualifications      │  ← (badge: 143)
│  🔧 Manuals             │  ← (badge: 57)
│  ⚠ Op. Alerts           │  ← (badge: 29)
│                         │
│  INSIGHTS               │
│  ────────────────────── │
│  📈 Analytics        ▼  │
│    ├─ Performance Trends │
│    ├─ Bottleneck Analysis│
│    ├─ Team Analytics     │
│                         │
│  REPORTS                │
│  ────────────────────── │
│  📊 Reports & Export  ▼  │
│    ├─ Period Performance │
│    ├─ BID Details        │
│    └─ Operational Summary│
│                         │
│  TOOLS                  │
│  ────────────────────── │
│  ⭐ Favorites           │
│  💰 Quotations          │
│  🔧 Tooling Report      │
│  💲 Price Consulting     │
│                         │
│  SETTINGS               │
│  ────────────────────── │
│  ⚙ System Configuration │
│  👥 Members Management   │
│  📋 Patch Notes          │
│                         │
│  ────────────────────── │
│  [🌙 Dark] toggle       │
│  [OCEANEERING logo]     │
│  Created by R. Costa    │
└─────────────────────────┘
```

### 3.3 Footer

| Elemento         | Descrição                                                   |
| ---------------- | ----------------------------------------------------------- |
| **Copyright**    | © 2026 Oceaneering International, Inc. All rights reserved. |
| **Version**      | Smart BID v2.0.0                                            |
| **Region Badge** | 🟢 BRAZIL (verde, pill shape)                               |
| **Timestamp**    | Data e hora atual com atualização automática                |
| **Link**         | oceaneering.com                                             |

---

## 4. Telas e Funcionalidades

### 4.1 Dashboard Principal (Home)

A primeira tela ao abrir o SMART BID 2.0. Mostra uma visão executiva do estado atual.

#### KPI Cards (Linha Superior)

| KPI                        | Ícone | Descrição                                | Cor do Card                                        |
| -------------------------- | ----- | ---------------------------------------- | -------------------------------------------------- |
| **Total Active BIDs**      | 📋    | Quantidade de BIDs ativos no momento     | Teal                                               |
| **Avg. Completion Time**   | ⏱     | Tempo médio para completar um BID (dias) | Azul                                               |
| **On-Time Delivery**       | 📦    | % de BIDs entregues no prazo             | Verde se >90%, Amarelo se 70-90%, Vermelho se <70% |
| **OTIF (On Time In Full)** | ✅    | % de BIDs entregues no prazo E completos | Verde/Amarelo/Vermelho                             |
| **Pending Requests**       | 📬    | Solicitações abertas não atribuídas      | Laranja                                            |
| **Approval Rate**          | 📊    | % de BIDs aprovados vs total             | Verde                                              |
| **Cancellation Rate**      | ❌    | % de BIDs cancelados/NoBID               | Vermelho                                           |

Cada card mostra:

- Valor principal (número grande)
- Comparação com período anterior (▲ +12% ou ▼ -5%)
- Mini sparkline de tendência
- Barra de progresso em relação ao target

#### Seção "Recent Activity" (Linha do Tempo)

Lista cronológica com as últimas atividades:

- "Petrobras BID #247 — Status changed to In Review" (2h ago)
- "Shell BID #245 — New approval received from OPG" (3h ago)
- "Equinor BID #243 — Hours table updated by J. Silva" (5h ago)

#### Seção "BIDs by Status" (Gráfico de Barras Horizontal)

Gráfico mostrando quantos BIDs estão em cada status (Not Started → Completed), com barras coloridas.

#### Seção "BIDs by Division" (Gráfico de Pizza/Donut)

Distribuição dos BIDs ativos por divisão (SSR, OPG, NPD).

#### Seção "Upcoming Deadlines" (Lista)

Os próximos 5 BIDs com prazo mais próximo:

- ⚠ BID #250 — Shell Brasil — Due in 2 days
- 🔴 BID #248 — Petrobras — OVERDUE by 3 days
- ✅ BID #247 — Equinor — Due in 7 days

#### Seção "Monthly BID Volume" (Gráfico de Linhas)

Gráfico de tendência mensal com volume de BIDs criados, completados e cancelados nos últimos 12 meses.

---

### 4.2 BID Tracker (Antiga Tela Inicial — Kanban)

Evolução da tela panorâmica de BIDs. Agora com visual melhorado e mais funcionalidades.

#### Layout

```
┌────────────────────────────────────────────────────────────────┐
│ BID Tracker                    [Filtros ▼] [Vista: Kanban|Lista|Tabela]  │
├────────────┬────────────┬────────────┬────────────────────────┤
│   SSR      │    OPG     │    NPD     │     On Hold            │
│  (12 BIDs) │  (8 BIDs)  │  (3 BIDs)  │    (2 BIDs)           │
├────────────┼────────────┼────────────┼────────────────────────┤
│ ┌────────┐ │ ┌────────┐ │ ┌────────┐ │ ┌────────┐            │
│ │BID Card│ │ │BID Card│ │ │BID Card│ │ │BID Card│            │
│ │  #250  │ │ │  #249  │ │ │  #248  │ │ │  #230  │            │
│ │ Shell  │ │ │Equinor │ │ │Petrobr.│ │ │ Total  │            │
│ │Status 4│ │ │Status 2│ │ │Status 5│ │ │On Hold │            │
│ └────────┘ │ └────────┘ │ └────────┘ │ └────────┘            │
│ ┌────────┐ │ ┌────────┐ │            │                        │
│ │BID Card│ │ │BID Card│ │            │                        │
│ │  #247  │ │ │  #245  │ │            │                        │
│ └────────┘ │ └────────┘ │            │                        │
└────────────┴────────────┴────────────┴────────────────────────┘
```

#### Modos de Visualização

| Modo       | Descrição                                                |
| ---------- | -------------------------------------------------------- |
| **Kanban** | Colunas por divisão, cards arrastáveis (drag & drop)     |
| **Lista**  | Lista vertical com todas as informações em linhas        |
| **Tabela** | Tabela completa com todas as colunas, ordenação e filtro |

#### BID Card (Redesenhado)

Cada card segue o visual do SmartFlow:

```
┌────────────────────────────┐
│ 🟢 #250 — Shell Brasil     │  ← Status dot + ID + Client
│ ROV Inspection - Marlim    │  ← Título do BID
│                            │
│ CRM: CRM-2026-0125        │
│ Owner: J. Silva            │
│ Bidder: M. Santos          │
│                            │
│ ┌──────────────────────┐   │
│ │ ████████░░░░ 65%     │   │  ← Barra de progresso do status
│ └──────────────────────┘   │
│                            │
│ Status: [Quotation    ▼]   │  ← Dropdown editável (admin)
│ Due: Mar 22, 2026  ⚡2d    │  ← Data + contagem regressiva
│                            │
│ 💬 3 comments  🔧 12 tools │  ← Métricas rápidas
│ [💤 Hold]    [📂 Open]     │  ← Ações rápidas
└────────────────────────────┘
```

#### Filtros Avançados

| Filtro           | Tipo          | Opções                     |
| ---------------- | ------------- | -------------------------- |
| **Division**     | Multi-select  | SSR, OPG, NPD              |
| **Status**       | Multi-select  | Todos os 11 status         |
| **Service Line** | Multi-select  | IMR, UWILD, Controls, etc. |
| **Client**       | Search/select | Lista de clientes          |
| **Owner**        | Search/select | Lista de owners            |
| **Due Date**     | Date range    | De — Até                   |
| **BID Size**     | Multi-select  | SMALL, STD, EPIC           |
| **Type**         | Multi-select  | Firm, Budgetary, RFI       |

---

### 4.3 Unassigned Requests (Solicitações Abertas)

Tela dedicada às solicitações de BID enviadas pelo comercial que ainda **não foram atribuídas** a um owner ou não foram iniciadas.

#### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Unassigned Requests                              [+ New Request]│
│  3 requests pending assignment                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 🔴 URGENT — Petrobras — ROV Inspection Campaign           │  │
│  │ CRM: CRM-2026-0130  │  Bidder: A. Oliveira               │  │
│  │ Service Line: IMR    │  Type: Firm                        │  │
│  │ Received: Mar 15, 2026 (2 days ago)                       │  │
│  │ Due Date: Mar 25, 2026                                    │  │
│  │ Description: ROV inspection campaign for 12 risers at...  │  │
│  │                                                           │  │
│  │ [📎 2 attachments]   [👤 Assign Owner]   [▶ Start BID]   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 🟡 NORMAL — Shell Brasil — Subsea Tooling                 │  │
│  │ ...                                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Campos de uma Solicitação (Request)

| Campo            | Descrição                                | Quem Preenche |
| ---------------- | ---------------------------------------- | ------------- |
| **Client**       | Nome do cliente                          | Comercial     |
| **CRM**          | Código de referência comercial           | Comercial     |
| **Title**        | Título/descrição breve do BID            | Comercial     |
| **Service Line** | Linha de serviço                         | Comercial     |
| **Type**         | Firm / Budgetary / RFI                   | Comercial     |
| **Due Date**     | Prazo de entrega da proposta             | Comercial     |
| **Priority**     | Urgent / High / Normal / Low             | Comercial     |
| **Description**  | Escopo resumido                          | Comercial     |
| **Attachments**  | Documentos do cliente (PDF, Word, Excel) | Comercial     |
| **Division**     | SSR / OPG / NPD (sugestão)               | Comercial     |

#### Ações do Admin na Solicitação

| Ação             | Descrição                                                         |
| ---------------- | ----------------------------------------------------------------- |
| **Assign Owner** | Selecionar o engenheiro responsável                               |
| **Set Division** | Confirmar ou alterar a divisão                                    |
| **Start BID**    | Converter a solicitação em BID ativo (cria o registro no sistema) |
| **Reject**       | Rejeitar a solicitação (obrigatório informar motivo)              |
| **Request Info** | Pedir mais informações ao comercial                               |

#### Formulário "Create Request" (Sidebar Button)

Modal ou tela lateral para criar nova solicitação:

- Campos obrigatórios: Client, CRM, Title, Service Line, Type, Due Date
- Campos opcionais: Priority, Description, Attachments, Division
- Drag & drop para upload de arquivos
- Preview de PDF/Word inline

---

### 4.4 BID Individual (Painel Detalhado)

Ao clicar em um BID, abre a tela completa. O layout é modernizado com tabs e seções colapsáveis.

#### Cabeçalho do BID

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Tracker                                              │
│                                                                  │
│  BID #250 — Shell Brasil — ROV Inspection - Marlim Field        │
│  CRM: CRM-2026-0125  │  Status: [Quotation ▼]  │  Due: Mar 22  │
│                                                                  │
│  [📥 Export Excel] [📂 BID Folder] [📂 Commercial Folder]       │
│  [🔗 Share Link ▼] [🔄 Update Tooling]  [🤖 AI Analysis]       │
└─────────────────────────────────────────────────────────────────┘
```

#### Tabs do BID

| Tab                  | Conteúdo                                                   |
| -------------------- | ---------------------------------------------------------- |
| **Overview**         | Informações gerais, escopo, classificação, timeline visual |
| **Hours**            | Tabelas de horas por divisão (Eng/Onshore/Offshore)        |
| **Assets & Tooling** | Tabelas de ferramental e custos                            |
| **Approval**         | Fluxo de aprovação por divisão                             |
| **Comments**         | Reviewer comments e histórico                              |
| **AI Analysis**      | Análise de IA do BID (nova funcionalidade)                 |

#### Tab: Overview

Seções colapsáveis:

1. **General Information** — Region, Currency, Service Line, Type, Status, Due Date
2. **Operational Summary** — Client, Vessel, Field, Water Depth, Oper. Start Date, Total Duration
3. **Scope of Work** — Descrição textual + imagem/sketch + Commercial Description
4. **Classification** — Project Category, Eng. Complexity, BID Size (calculado)
5. **Timeline** — Visualização Gantt com fases (Engineering → Procurement → Workshop → Operation)

#### Tab: Hours

Mantém toda a funcionalidade atual, mas com visual renovado:

- Resumo em cards com totais por divisão
- Tabelas com header sticky, linhas zebradas
- Inline editing com autosave
- Filtro por divisão (All / OPG / ROV / Survey)
- Bulk actions (copiar linhas, importar do Excel)

#### Tab: Assets & Tooling

Mantém toda a funcionalidade atual, com melhorias:

- Part Number lookup com autocomplete melhorado
- Visualização de status do Tooling Report com badges coloridos
- "Smart suggestions" da IA para Part Numbers similares
- Resumo CAPEX/OPEX em cards visuais

#### Tab: Approval

Redesenho do fluxo de aprovação:

- Visualização tipo "pipeline" com status visual
- Cada aprovador com foto, nome, status (✅/❌/⏳)
- Timeline de quando cada aprovação foi feita
- Botão "Start Approval Flow" mais destacado
- Notificação automática aos aprovadores

#### Tab: AI Analysis (NOVA)

Seção exclusiva para análise de IA — detalhada na seção 5.

---

### 4.5 My Dashboard

Dashboard personalizado do usuário logado.

| Seção                  | Descrição                                                           |
| ---------------------- | ------------------------------------------------------------------- |
| **My BIDs**            | Lista dos BIDs atribuídos ao usuário atual                          |
| **My Pending Actions** | Aprovações pendentes, revisões solicitadas                          |
| **My Performance**     | Métricas pessoais (tempo médio, BIDs completados, etc.)             |
| **Today's Tasks**      | Lista de tarefas do dia (prazos de hoje, pendências)                |
| **Quick Stats**        | Cards com: BIDs em andamento, horas estimadas hoje, itens pendentes |

---

### 4.6 Analytics (Insights)

Quatro sub-páginas de analytics avançado:

#### 4.6.1 Performance Trends

| Gráfico                    | Tipo               | Dados                                    |
| -------------------------- | ------------------ | ---------------------------------------- |
| **BID Volume Over Time**   | Line chart         | BIDs criados/completados por mês         |
| **Avg Completion Time**    | Line chart + trend | Tempo médio para completar BIDs          |
| **Status Distribution**    | Stacked bar        | Distribuição de status ao longo do tempo |
| **On-Time Delivery Trend** | Area chart         | % OTD por mês                            |

#### 4.6.2 Bottleneck Analysis

| Análise                  | Descrição                                            |
| ------------------------ | ---------------------------------------------------- |
| **Time per Status**      | Quanto tempo os BIDs ficam em cada status (box plot) |
| **Longest Running BIDs** | Lista dos BIDs com mais tempo em andamento           |
| **Status Transitions**   | Sankey diagram mostrando fluxo de status             |
| **Division Load**        | Carga de trabalho por divisão (heatmap)              |

#### 4.6.3 Team Analytics

| Métrica                    | Descrição                              |
| -------------------------- | -------------------------------------- |
| **BIDs per Owner**         | Gráfico de barras com carga por pessoa |
| **Owner Performance**      | Tempo médio de entrega por owner       |
| **Division Collaboration** | Matrix de colaboração inter-divisional |
| **Workload Balance**       | Indicador de equilíbrio de carga       |

#### 4.6.4 Anomaly Detection

| Alerta             | Trigger                                           |
| ------------------ | ------------------------------------------------- |
| **Overdue BIDs**   | BIDs com prazo vencido sem movimentação           |
| **Stale BIDs**     | BIDs sem atualização há mais de X dias            |
| **Unusual Costs**  | BIDs com custos significativamente fora do padrão |
| **Hours Outliers** | Estimativas de horas muito acima/abaixo da média  |

---

### 4.7 Reports & Export

#### 4.7.1 Period Performance

Relatório de performance por período selecionável:

- Filtros: Data início, Data fim, Divisão, Service Line
- Métricas: BIDs completados, tempo médio, valor total CAPEX/OPEX
- Exportação: PDF e Excel

#### 4.7.2 BID Details

Relatório detalhado de um BID específico:

- Exportação Excel completa (mantém funcionalidade atual)
- Novo: Exportação PDF formatada
- Novo: Relatório comparativo entre BIDs

#### 4.7.3 Operational Summary

Resumo operacional consolidado:

- Total de horas por divisão e período
- Custos acumulados (CAPEX/OPEX)
- Ferramental mais utilizado (Top Tools)
- Gráficos de participação por divisão

---

### 4.8 Knowledge Base (NOVA)

Repositório centralizado de conhecimento para suporte na elaboração de BIDs.

| Seção              | Descrição                                  | Badge                 |
| ------------------ | ------------------------------------------ | --------------------- |
| **Datasheets**     | Fichas técnicas de equipamentos            | Contador de itens     |
| **Past Bids**      | Histórico de BIDs anteriores (pesquisável) | Contador de registros |
| **Qualifications** | Lista de qualificações e certificações     | Contador              |
| **Manuals**        | Manuais técnicos e operacionais            | Contador              |
| **Op. Alerts**     | Alertas operacionais e lições aprendidas   | Contador              |

Cada seção possui:

- **Busca full-text** dentro dos documentos
- **Tags e categorias** para organização
- **Favoritos** por usuário
- **Upload de documentos** (PDF, Word, Excel)
- **Sincronização** com SharePoint (one-way ou two-way)

---

### 4.9 Tools (Ferramentas de Suporte)

Mantém as funcionalidades existentes com visual renovado:

#### 4.9.1 Favorites

- Visual em grid de cards (como catálogo)
- Filtros por Group/SubGroup
- Toggle Asset/Consumable
- Busca rápida
- Add/Remove diretamente

#### 4.9.2 Quotations

- Tabela interativa com inline editing
- Upload de PDF integrado
- Preview de cotações sem sair da tela
- Filtro inteligente com sugestões

#### 4.9.3 Tooling Report (SSR + OPG)

- Dashboard visual com métricas
- Tabs por categoria (Green Tag, Min Pool, In Progress, Red Tag, Reserved)
- Indicadores visuais de saúde do inventário
- Alerta automático quando pool mínimo está comprometido

#### 4.9.4 Price Consulting

- Interface de consulta modernizada
- Busca unificada Peoplesoft + Quotes
- Histórico de preços por PN (gráfico de evolução)
- Indicador de confiabilidade do preço (recente vs antigo)

---

### 4.10 System Configuration

| Configuração             | Descrição                                 |
| ------------------------ | ----------------------------------------- |
| **User Management**      | Definir admins, owners, aprovadores       |
| **Division Setup**       | Configurar divisões e suas regras         |
| **Status Workflow**      | Customizar o fluxo de status              |
| **Notification Rules**   | Configurar alertas e notificações         |
| **PTAX / Currency**      | Definir câmbio padrão                     |
| **Integration Settings** | Configurar conexões com SharePoint, APIs  |
| **AI Settings**          | Configurar modelo de IA, prompts, limites |
| **Audit Log**            | Visualizar log de ações do sistema        |

---

## 5. Inteligência Artificial (AI Assistant)

### 5.1 Visão Geral

O AI Assistant é um componente central do SMART BID 2.0, projetado para auxiliar engenheiros na análise de especificações técnicas e na construção de propostas.

### 5.2 Funcionalidades de IA

#### 5.2.1 Análise de Especificações Técnicas

| Feature                     | Descrição                                                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Upload & Parse**          | Upload de PDF/Word/Excel do cliente. A IA extrai automaticamente: escopo, requisitos, restrições, equipamentos mencionados |
| **Requirements Extraction** | Gera lista estruturada de BID Requirements a partir do documento                                                           |
| **Scope Summary**           | Resumo automático do escopo em linguagem padronizada                                                                       |
| **Risk Identification**     | Identifica riscos e pontos de atenção na especificação                                                                     |

#### 5.2.2 Sugestão de Equipamentos

| Feature                   | Descrição                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------- |
| **Equipment Matching**    | Baseado nos requisitos, sugere equipamentos do catálogo Oceaneering (Part Numbers) |
| **Past BID Lookup**       | Busca BIDs anteriores similares e mostra as ferramentas utilizadas                 |
| **Water Depth Filtering** | Filtra equipamentos compatíveis com a profundidade da operação                     |
| **Availability Check**    | Cruza com Tooling Report para verificar disponibilidade                            |

#### 5.2.3 Estimativa Inteligente

| Feature                 | Descrição                                                                |
| ----------------------- | ------------------------------------------------------------------------ |
| **Hours Suggestion**    | Baseado em BIDs similares, sugere estimativas de horas por função e fase |
| **Cost Estimation**     | Estimativa preliminar de custo baseada em histórico                      |
| **Duration Prediction** | Previsão de duração total do projeto                                     |
| **Benchmark**           | Compara estimativas com a média histórica                                |

#### 5.2.4 Chat Assistant (Painel Lateral)

Interface de chat similar ao mockup do "Bid AI Assistant":

```
┌────────────────────────────┐
│  🤖 AI Assistant           │
│  Always ready · GPT-4o     │
├────────────────────────────┤
│                            │
│  👋 Hi! I'm your Bid AI   │
│  Assistant. Upload a spec  │
│  or ask me anything about  │
│  Oceaneering equipment and │
│  past bids.                │
│                            │
│  ┌──────────────────────┐  │
│  │ What ROVs do we have │  │  ← User message (azul)
│  │ rated for 3,000m+?   │  │
│  └──────────────────────┘  │
│                            │
│  We have 3 ROV models      │  ← AI response
│  rated for 3,000m+:        │
│  • Magnum Plus (PN: ROV-   │
│    MGN-2500)               │
│  • Millennium Plus (PN:    │
│    ROV-MLP-3500)           │
│                            │
│  [Lead time?] [Similar     │
│   past bids?] [ABS cert?]  │  ← Suggested follow-ups
│                            │
├────────────────────────────┤
│  Ask about equipment,      │
│  specs, bids...     [▶]    │
└────────────────────────────┘
```

#### 5.2.5 Contexto da IA

A IA terá acesso contextual a:

- **Knowledge Base:** Datasheets, manuais, qualificações
- **Past Bids (JSON):** Histórico completo de BIDs anteriores
- **Equipment Database:** Catálogo de equipamentos com especificações
- **Tooling Report:** Status atual do inventário
- **Pricing Data:** Dados de preço do Peoplesoft e cotações
- **BID atual:** Todos os dados do BID em que o usuário está trabalhando

---

## 6. Notificações e Alertas

### 6.1 Tipos de Notificação

| Tipo                  | Trigger                        | Destinatário            |
| --------------------- | ------------------------------ | ----------------------- |
| **New Request**       | Nova solicitação de BID criada | Admins, Managers        |
| **BID Assigned**      | BID atribuído a um owner       | Owner                   |
| **Status Change**     | Mudança de status do BID       | Owner, Bidder, Managers |
| **Deadline Warning**  | 3 dias, 1 dia antes do prazo   | Owner                   |
| **Overdue**           | Prazo vencido                  | Owner, Managers         |
| **Approval Required** | Fluxo de aprovação iniciado    | Aprovadores             |
| **Approval Decision** | Aprovação ou rejeição recebida | Owner, Managers         |
| **Comment Added**     | Novo comentário em um BID      | Owner                   |
| **AI Analysis Ready** | Análise de IA concluída        | Solicitante             |

### 6.2 Canais de Notificação

| Canal      | Descrição                                             |
| ---------- | ----------------------------------------------------- |
| **In-App** | Badge no sino + lista dropdown + tela de notificações |
| **Email**  | Notificação por e-mail (configurável)                 |
| **Teams**  | Integração com Microsoft Teams (futuro)               |

---

## 7. Arquitetura Técnica

### 7.1 Stack Tecnológico

| Camada                | Tecnologia                      | Justificativa                                     |
| --------------------- | ------------------------------- | ------------------------------------------------- |
| **Framework**         | React 18+ com TypeScript        | Componentização, type-safety, ecossistema maduro  |
| **Build**             | Vite                            | Build rápido, HMR, ESM nativo                     |
| **State Management**  | Zustand                         | Leve, simples, sem boilerplate                    |
| **Routing**           | React Router v6                 | Roteamento declarativo, lazy loading              |
| **Styling**           | Tailwind CSS + CSS Modules      | Utility-first para agilidade, modules para escopo |
| **Component Library** | Shadcn/UI + Radix UI            | Componentes acessíveis, customizáveis             |
| **Charts**            | Recharts                        | React-nativo, declarativo, responsivo             |
| **Tables**            | TanStack Table (React Table v8) | Virtualização, sorting, filtering, pagination     |
| **Forms**             | React Hook Form + Zod           | Performance, validação type-safe                  |
| **Data Fetching**     | TanStack Query (React Query)    | Caching, refetch, optimistic updates              |
| **Drag & Drop**       | @dnd-kit/core                   | Acessível, performático                           |
| **Excel**             | SheetJS (xlsx)                  | Import/export de planilhas                        |
| **PDF**               | react-pdf                       | Visualização de PDFs                              |
| **Icons**             | Lucide React                    | Consistente, leve                                 |
| **Date**              | date-fns                        | Leve, tree-shakeable                              |
| **AI Integration**    | OpenAI API / Azure OpenAI       | GPT-4o para análise e chat                        |
| **SharePoint**        | PnPjs (@pnp/sp)                 | Integração com listas e bibliotecas               |
| **Testing**           | Vitest + Testing Library        | Unit tests e component tests                      |
| **Linting**           | ESLint + Prettier               | Padronização de código                            |

### 7.2 Estrutura de Pastas

```
smart-bid-2.0/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── assets/
│       └── images/
│
├── src/
│   ├── main.tsx                          # Entry point
│   ├── App.tsx                           # Root component + providers
│   ├── vite-env.d.ts                     # Vite type declarations
│   │
│   ├── assets/                           # Static assets (images, fonts)
│   │   ├── images/
│   │   └── fonts/
│   │
│   ├── config/                           # Configuration files
│   │   ├── constants.ts                  # App-wide constants
│   │   ├── routes.ts                     # Route definitions
│   │   ├── navigation.ts                 # Sidebar navigation structure
│   │   └── theme.ts                      # Theme configuration (colors, sizes)
│   │
│   ├── types/                            # Global TypeScript types
│   │   ├── bid.ts                        # BID-related types
│   │   ├── request.ts                    # Request types
│   │   ├── user.ts                       # User/auth types
│   │   ├── tooling.ts                    # Tooling/assets types
│   │   ├── analytics.ts                  # Dashboard/analytics types
│   │   ├── api.ts                        # API response types
│   │   └── index.ts                      # Re-exports
│   │
│   ├── hooks/                            # Custom React hooks
│   │   ├── useAuth.ts                    # Authentication hook
│   │   ├── useTheme.ts                   # Theme toggle hook
│   │   ├── useBids.ts                    # BID data operations
│   │   ├── useRequests.ts                # Request operations
│   │   ├── useSharePoint.ts              # SharePoint integration
│   │   ├── useNotifications.ts           # Notifications hook
│   │   ├── useDebounce.ts                # Debounce utility hook
│   │   ├── useLocalStorage.ts            # Persistent local storage
│   │   └── useMediaQuery.ts              # Responsive breakpoints
│   │
│   ├── stores/                           # Zustand stores
│   │   ├── authStore.ts                  # User/auth state
│   │   ├── bidStore.ts                   # BIDs state
│   │   ├── requestStore.ts               # Requests state
│   │   ├── uiStore.ts                    # UI state (sidebar, theme, modals)
│   │   ├── notificationStore.ts          # Notifications state
│   │   └── filterStore.ts               # Filter/search state
│   │
│   ├── services/                         # API/data services
│   │   ├── sharepoint/
│   │   │   ├── spClient.ts               # SharePoint client setup (PnPjs)
│   │   │   ├── bidService.ts             # BID CRUD operations
│   │   │   ├── requestService.ts         # Request operations
│   │   │   ├── quotationService.ts       # Quotation operations
│   │   │   ├── toolingReportService.ts   # Tooling report data
│   │   │   ├── favoriteService.ts        # Favorites operations
│   │   │   └── fileService.ts            # File upload/download
│   │   │
│   │   ├── ai/
│   │   │   ├── aiClient.ts              # AI API client (OpenAI/Azure)
│   │   │   ├── specAnalyzer.ts          # Spec analysis service
│   │   │   ├── equipmentMatcher.ts      # Equipment suggestion service
│   │   │   ├── hoursEstimator.ts        # Hours estimation service
│   │   │   └── chatService.ts           # Chat assistant service
│   │   │
│   │   ├── excel/
│   │   │   ├── excelParser.ts           # Excel file parsing
│   │   │   ├── excelExporter.ts         # Excel export generation
│   │   │   ├── queryProcessor.ts        # Queries.xlsx processing
│   │   │   └── bidRequirementsParser.ts # BID Requirements parsing
│   │   │
│   │   └── notifications/
│   │       ├── notificationService.ts   # Notification management
│   │       └── emailService.ts          # Email notification dispatch
│   │
│   ├── utils/                           # Utility functions
│   │   ├── formatters.ts                # Number, currency, date formatters
│   │   ├── calculators.ts              # Cost calculations, hour totals
│   │   ├── validators.ts               # Input validation
│   │   ├── priceAdjuster.ts            # Price correction (5% per 6 months)
│   │   ├── timelineCalculator.ts       # Timeline phase calculations
│   │   ├── statusHelpers.ts            # Status colors, labels, progression
│   │   └── cn.ts                       # Tailwind classname merge utility
│   │
│   ├── components/                      # Shared/reusable components
│   │   ├── ui/                          # Base UI primitives (Shadcn/UI)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Progress.tsx
│   │   │   ├── Switch.tsx
│   │   │   └── Spinner.tsx
│   │   │
│   │   ├── layout/                      # Layout components
│   │   │   ├── AppLayout.tsx            # Main layout wrapper
│   │   │   ├── Header.tsx              # Top header bar
│   │   │   ├── Sidebar.tsx             # Collapsible sidebar
│   │   │   ├── SidebarItem.tsx         # Individual nav item
│   │   │   ├── SidebarGroup.tsx        # Nav section group
│   │   │   ├── Footer.tsx             # Bottom footer
│   │   │   ├── PageContainer.tsx       # Page content wrapper
│   │   │   └── Breadcrumbs.tsx         # Breadcrumb navigation
│   │   │
│   │   ├── charts/                      # Chart components
│   │   │   ├── KPICard.tsx             # KPI metric card with sparkline
│   │   │   ├── BarChart.tsx
│   │   │   ├── LineChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   ├── DonutChart.tsx
│   │   │   ├── AreaChart.tsx
│   │   │   ├── GanttTimeline.tsx       # Project timeline
│   │   │   └── SankeyDiagram.tsx       # Status flow diagram
│   │   │
│   │   ├── data/                        # Data display components
│   │   │   ├── DataTable.tsx           # Reusable data table (TanStack)
│   │   │   ├── DataGrid.tsx            # Editable grid
│   │   │   ├── FilterBar.tsx           # Multi-filter component
│   │   │   ├── SearchInput.tsx         # Global search with autocomplete
│   │   │   ├── StatusBadge.tsx         # Color-coded status display
│   │   │   ├── PriorityBadge.tsx       # Priority indicator
│   │   │   ├── UserAvatar.tsx          # User avatar with name
│   │   │   ├── ActivityFeed.tsx        # Activity timeline list
│   │   │   └── EmptyState.tsx          # "No data" placeholder
│   │   │
│   │   ├── bid/                         # BID-specific components
│   │   │   ├── BidCard.tsx             # BID card for Kanban/Grid
│   │   │   ├── BidStatusDropdown.tsx   # Status selector
│   │   │   ├── BidHeader.tsx           # BID detail header
│   │   │   ├── BidTimeline.tsx         # Visual timeline component
│   │   │   ├── HoursTable.tsx          # Hours estimation table
│   │   │   ├── HoursSummary.tsx        # Hours summary cards
│   │   │   ├── ToolTable.tsx           # Tooling/assets table
│   │   │   ├── ToolSummary.tsx         # Tooling summary cards
│   │   │   ├── PartNumberLookup.tsx    # PN autocomplete search
│   │   │   ├── ApprovalFlow.tsx        # Approval pipeline
│   │   │   ├── ReviewerComments.tsx    # Comments table
│   │   │   ├── ScopeOfWork.tsx         # Scope editor + image
│   │   │   ├── ClassificationSelector.tsx # Category + Complexity
│   │   │   ├── GeneralInfo.tsx         # General info section
│   │   │   └── OperationalSummary.tsx  # Operational details
│   │   │
│   │   ├── request/                     # Request-specific components
│   │   │   ├── RequestCard.tsx         # Request card
│   │   │   ├── RequestForm.tsx         # Create/edit request form
│   │   │   └── RequestActions.tsx      # Assign, start, reject buttons
│   │   │
│   │   ├── ai/                          # AI-specific components
│   │   │   ├── AIChatPanel.tsx         # Chat sidebar
│   │   │   ├── AIAnalysisView.tsx      # Analysis results display
│   │   │   ├── SpecUploader.tsx        # Document upload + parse
│   │   │   ├── EquipmentSuggestions.tsx # Equipment recommendation
│   │   │   ├── HoursSuggestions.tsx    # Hours estimation suggestion
│   │   │   └── SuggestedActions.tsx    # Quick action buttons
│   │   │
│   │   ├── notifications/              # Notification components
│   │   │   ├── NotificationBell.tsx    # Header bell icon + dropdown
│   │   │   ├── NotificationList.tsx    # Notification items list
│   │   │   └── NotificationItem.tsx    # Single notification display
│   │   │
│   │   └── common/                     # Other shared components
│   │       ├── FileUpload.tsx          # Drag & drop file upload
│   │       ├── PDFViewer.tsx           # Inline PDF preview
│   │       ├── ConfirmDialog.tsx       # Confirmation modal
│   │       ├── ErrorBoundary.tsx       # Error boundary wrapper
│   │       └── ThemeToggle.tsx         # Dark/Light mode switch
│   │
│   ├── pages/                          # Page-level components (routes)
│   │   ├── Dashboard/
│   │   │   ├── DashboardPage.tsx       # Main dashboard
│   │   │   └── components/             # Dashboard-specific sub-components
│   │   │       ├── KPISection.tsx
│   │   │       ├── RecentActivity.tsx
│   │   │       ├── UpcomingDeadlines.tsx
│   │   │       └── MonthlyVolume.tsx
│   │   │
│   │   ├── BidTracker/
│   │   │   ├── BidTrackerPage.tsx      # Kanban/List/Table views
│   │   │   └── components/
│   │   │       ├── KanbanBoard.tsx
│   │   │       ├── KanbanColumn.tsx
│   │   │       ├── ListView.tsx
│   │   │       └── TableView.tsx
│   │   │
│   │   ├── BidDetail/
│   │   │   ├── BidDetailPage.tsx       # Full BID detail
│   │   │   └── components/
│   │   │       ├── OverviewTab.tsx
│   │   │       ├── HoursTab.tsx
│   │   │       ├── AssetsTab.tsx
│   │   │       ├── ApprovalTab.tsx
│   │   │       ├── CommentsTab.tsx
│   │   │       └── AIAnalysisTab.tsx
│   │   │
│   │   ├── Requests/
│   │   │   ├── RequestsPage.tsx        # Unassigned requests
│   │   │   └── components/
│   │   │       └── RequestsList.tsx
│   │   │
│   │   ├── MyDashboard/
│   │   │   ├── MyDashboardPage.tsx     # Personal dashboard
│   │   │   └── components/
│   │   │       ├── MyBids.tsx
│   │   │       ├── PendingActions.tsx
│   │   │       └── MyPerformance.tsx
│   │   │
│   │   ├── Analytics/
│   │   │   ├── AnalyticsLayout.tsx     # Analytics wrapper
│   │   │   ├── PerformanceTrends.tsx
│   │   │   ├── BottleneckAnalysis.tsx
│   │   │   ├── TeamAnalytics.tsx
│   │   │   └── AnomalyDetection.tsx
│   │   │
│   │   ├── Reports/
│   │   │   ├── ReportsLayout.tsx        # Reports wrapper
│   │   │   ├── PeriodPerformance.tsx
│   │   │   ├── BidDetailsReport.tsx
│   │   │   └── OperationalSummary.tsx
│   │   │
│   │   ├── KnowledgeBase/
│   │   │   ├── KnowledgeBasePage.tsx    # KB main page
│   │   │   └── components/
│   │   │       ├── DatasheetsSection.tsx
│   │   │       ├── PastBidsSection.tsx
│   │   │       ├── QualificationsSection.tsx
│   │   │       ├── ManualsSection.tsx
│   │   │       └── OpAlertsSection.tsx
│   │   │
│   │   ├── Tools/
│   │   │   ├── Favorites/
│   │   │   │   └── FavoritesPage.tsx
│   │   │   ├── Quotations/
│   │   │   │   └── QuotationsPage.tsx
│   │   │   ├── ToolingReport/
│   │   │   │   └── ToolingReportPage.tsx
│   │   │   └── PriceConsulting/
│   │   │       └── PriceConsultingPage.tsx
│   │   │
│   │   ├── Settings/
│   │   │   ├── SettingsPage.tsx
│   │   │   └── components/
│   │   │       ├── UserManagement.tsx
│   │   │       ├── SystemConfig.tsx
│   │   │       ├── NotificationRules.tsx
│   │   │       ├── AISettings.tsx
│   │   │       └── AuditLog.tsx
│   │   │
│   │   └── NotFound/
│   │       └── NotFoundPage.tsx        # 404 page
│   │
│   ├── workers/                        # Web Workers
│   │   ├── queryProcessor.worker.ts   # Process Queries.xlsx in background
│   │   └── excelParser.worker.ts      # Parse large Excel files
│   │
│   └── styles/                         # Global styles
│       ├── globals.css                 # Global CSS + Tailwind directives
│       ├── variables.css               # CSS custom properties
│       └── animations.css             # Keyframe animations
│
├── .env                                # Environment variables
├── .env.example                        # Env template
├── .eslintrc.cjs                       # ESLint config
├── .prettierrc                         # Prettier config
├── index.html                          # HTML entry
├── package.json                        # Dependencies
├── tailwind.config.ts                  # Tailwind configuration
├── tsconfig.json                       # TypeScript config
├── vite.config.ts                      # Vite config
└── README.md                           # Project documentation
```

### 7.3 Padrões de Código

| Padrão             | Regra                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------ |
| **Naming**         | PascalCase para componentes, camelCase para funções/variáveis, UPPER_SNAKE para constantes |
| **Components**     | Functional components com hooks, sem class components                                      |
| **Exports**        | Named exports (evitar default exports exceto pages)                                        |
| **State**          | Local state quando possível, Zustand para estado global                                    |
| **Props**          | Interfaces TypeScript para todas as props                                                  |
| **Side Effects**   | Encapsulados em hooks customizados                                                         |
| **API Calls**      | Sempre via serviços + React Query                                                          |
| **Error Handling** | Error boundaries + try/catch nos serviços                                                  |
| **Loading States** | Skeleton components enquanto carrega                                                       |

### 7.4 Roteamento

```typescript
// src/config/routes.ts
const ROUTES = {
  DASHBOARD: "/",
  BID_TRACKER: "/tracker",
  BID_DETAIL: "/bid/:id",
  REQUESTS: "/requests",
  CREATE_REQUEST: "/requests/new",
  MY_DASHBOARD: "/my-dashboard",
  TIMELINE: "/timeline",
  NOTIFICATIONS: "/notifications",
  FAQ: "/faq",
  // Knowledge Base
  DATASHEETS: "/knowledge/datasheets",
  PAST_BIDS: "/knowledge/past-bids",
  QUALIFICATIONS: "/knowledge/qualifications",
  MANUALS: "/knowledge/manuals",
  OP_ALERTS: "/knowledge/op-alerts",
  // Analytics
  PERFORMANCE_TRENDS: "/analytics/performance",
  BOTTLENECK: "/analytics/bottleneck",
  TEAM_ANALYTICS: "/analytics/team",
  ANOMALY_DETECTION: "/analytics/anomaly",
  // Reports
  PERIOD_PERFORMANCE: "/reports/period",
  BID_DETAILS_REPORT: "/reports/bid-details",
  OPERATIONAL_SUMMARY: "/reports/operational",
  // Tools
  FAVORITES: "/tools/favorites",
  QUOTATIONS: "/tools/quotations",
  TOOLING_REPORT: "/tools/tooling-report",
  PRICE_CONSULTING: "/tools/price-consulting",
  // Settings
  SETTINGS: "/settings",
  MEMBERS: "/settings/members",
  PATCH_NOTES: "/settings/patch-notes",
};
```

---

## 8. Integração com SharePoint

### 8.1 Modo de Deploy

O SMART BID 2.0 será deployado como uma **SPFx Web Part** que renderiza a aplicação React. Isso permite:

- Manter integração nativa com SharePoint e Microsoft Graph
- SSO com Azure AD
- Acesso direto a listas e bibliotecas de documentos
- Deploy via SharePoint App Catalog

### 8.2 Listas SharePoint (Mantidas/Evoluídas)

| Lista                              | Status  | Alterações                                                |
| ---------------------------------- | ------- | --------------------------------------------------------- |
| **Panorama-bid-demo**              | Mantida | Novo campo: `requestJson` (dados da solicitação original) |
| **panorama-bid-otd**               | Mantida | Sem alterações                                            |
| **Panorama-bid-quotes**            | Mantida | Novo campo: `aiIndexed` (se foi indexado pela IA)         |
| **favorite-bar**                   | Mantida | Sem alterações                                            |
| **favorite-groups**                | Mantida | Sem alterações                                            |
| **smart-bid-requests** (NOVA)      | Nova    | Armazena as solicitações de BID antes de se tornarem BIDs |
| **smart-bid-notifications** (NOVA) | Nova    | Registro de notificações do sistema                       |
| **smart-bid-kb-index** (NOVA)      | Nova    | Índice da Knowledge Base para busca da IA                 |
| **smart-bid-ai-analyses** (NOVA)   | Nova    | Armazena resultados de análises de IA                     |

### 8.3 Estrutura de Pastas (Mantida/Evoluída)

```
WEB BIDS/
├── {Cliente}/
│   └── {CRM}-{Título}/
│       ├── {Título}-req.xlsx
│       ├── {Sketch.jpg/png}
│       └── client-specs/           ← NOVA: Documentos do cliente para análise IA
│           ├── spec-original.pdf
│           └── ai-analysis.json    ← Resultado da análise
├── Queries/
│   ├── Queries.xlsx
│   └── queryHandler.js
├── Quotations/
│   └── {PDFs de cotações}
├── SSRToolingReports/
│   └── Tooling Report - Week XX.xlsx
└── KnowledgeBase/                  ← NOVA: Repositório de documentos
    ├── Datasheets/
    ├── Manuals/
    └── OpAlerts/
```

---

## 9. Fluxo de Trabalho Principal

### 9.1 Ciclo de Vida do BID (Novo)

```
 ┌─────────────┐     ┌──────────────┐     ┌────────────────┐
 │  COMMERCIAL  │────▶│   REQUEST    │────▶│  ASSIGNMENT    │
 │  Creates     │     │  Created in  │     │  Admin assigns │
 │  Request     │     │  Unassigned  │     │  Owner/Division│
 └─────────────┘     │  Queue       │     └───────┬────────┘
                      └──────────────┘             │
                                                   ▼
 ┌─────────────┐     ┌──────────────┐     ┌────────────────┐
 │  COMPLETED  │◀────│  APPROVAL    │◀────│  BID ACTIVE    │
 │  / CANCELED │     │  Review &    │     │  Eng. works on │
 │  / NoBID    │     │  Sign-off    │     │  hours, tools, │
 └─────────────┘     └──────────────┘     │  costs, scope  │
                                          └────────────────┘
```

### 9.2 Status Flow Detalhado

```
Request Created ──▶ Not Started ──▶ Lead Pre Review ──▶ Eng. Study
                                                           │
    ┌──────────────────────────────────────────────────────┘
    ▼
Clarifications ──▶ Quotation ──▶ In Review ──▶ In Approval
                                                    │
    ┌───────────────────────────────────────────────┘
    ▼
 Approved ──▶ Completed
    │
    └──▶ Rejected ──▶ (volta para Eng. Study ou Quotation)

Em qualquer ponto:
  ──▶ Canceled (com motivo obrigatório)
  ──▶ NoBID (com motivo obrigatório)
  ──▶ On Hold (pausa temporária)
```

---

## 10. Performance e Otimizações

| Técnica                | Aplicação                                                                  |
| ---------------------- | -------------------------------------------------------------------------- |
| **Code Splitting**     | Lazy loading por rota (React.lazy + Suspense)                              |
| **Data Caching**       | React Query com stale time e cache persistente                             |
| **Virtual Scrolling**  | Tabelas grandes usando TanStack Virtual                                    |
| **Web Workers**        | Processamento de Excel (Queries.xlsx, BID Requirements) em thread separada |
| **Debounced Search**   | Busca com debounce de 300ms para evitar chamadas excessivas                |
| **Memoization**        | useMemo e useCallback para cálculos pesados                                |
| **Image Optimization** | Lazy load de imagens, WebP quando possível                                 |
| **Bundle Analysis**    | Vite bundle analyzer para monitorar tamanho                                |

---

## 11. Responsividade

| Breakpoint        | Largura     | Layout                                                         |
| ----------------- | ----------- | -------------------------------------------------------------- |
| **Desktop Large** | ≥1440px     | Sidebar expandida + conteúdo full width                        |
| **Desktop**       | 1024-1439px | Sidebar colapsável + conteúdo adaptável                        |
| **Tablet**        | 768-1023px  | Sidebar colapsada (overlay ao abrir) + conteúdo full           |
| **Mobile**        | <768px      | Sidebar como drawer, layout single column, tabelas scrolláveis |

---

## 12. Segurança

| Aspecto             | Implementação                                                           |
| ------------------- | ----------------------------------------------------------------------- |
| **Autenticação**    | SSO via Azure AD (integrado ao SharePoint)                              |
| **Autorização**     | Roles: Admin, Manager, Engineer, Viewer                                 |
| **RBAC**            | Controle de acesso por funcionalidade e por BID/divisão                 |
| **Dados Sensíveis** | Sem armazenamento local de dados confidenciais                          |
| **Inputs**          | Sanitização de todos os inputs de usuário                               |
| **API Keys**        | Chaves de IA armazenadas em Azure Key Vault, jamais no frontend         |
| **Audit Trail**     | Log de todas as ações críticas (mudança de status, aprovações, edições) |

---

## 13. Acessibilidade (a11y)

| Requisito               | Implementação                                                |
| ----------------------- | ------------------------------------------------------------ |
| **WCAG 2.1 AA**         | Contraste mínimo de 4.5:1                                    |
| **Keyboard Navigation** | Todos os elementos interativos acessíveis via teclado        |
| **Screen Reader**       | ARIA labels em todos os elementos semânticos                 |
| **Focus Indicators**    | Indicadores visuais claros de foco                           |
| **Error Messages**      | Mensagens de erro associadas aos campos via aria-describedby |

---

## 14. Roadmap de Implementação

### Fase 1 — Fundação (Semanas 1-3)

- [ ] Setup do projeto (Vite + React + TypeScript + Tailwind)
- [ ] Design System: componentes base (Button, Input, Card, Table, Modal)
- [ ] Layout global: Sidebar, Header, Footer, AppLayout
- [ ] Roteamento e navegação
- [ ] Integração base com SharePoint (PnPjs)
- [ ] Stores Zustand (auth, ui, bid)
- [ ] Theme toggle (Dark/Light)

### Fase 2 — Core BID (Semanas 4-7)

- [ ] Dashboard principal com KPIs (dados mock → SharePoint)
- [ ] BID Tracker (Kanban, List, Table views)
- [ ] BID Detail: Overview tab
- [ ] BID Detail: Hours tab (tabelas editáveis)
- [ ] BID Detail: Assets/Tooling tab
- [ ] Part Number Lookup com autocomplete
- [ ] Excel import/export
- [ ] Timeline visual

### Fase 3 — Requests & Workflow (Semanas 8-9)

- [ ] Tela de Unassigned Requests
- [ ] Formulário Create Request
- [ ] Fluxo Request → BID
- [ ] Approval Flow redesenhado
- [ ] Sistema de notificações
- [ ] Reviewer Comments

### Fase 4 — Analytics & Reports (Semanas 10-11)

- [ ] Performance Trends
- [ ] Bottleneck Analysis
- [ ] Team Analytics
- [ ] Anomaly Detection
- [ ] Reports: Period Performance, BID Details, Operational Summary

### Fase 5 — Knowledge Base & Tools (Semanas 12-13)

- [ ] Knowledge Base (Datasheets, Past Bids, Qualifications, Manuals, Op. Alerts)
- [ ] Favorites (visual renovado)
- [ ] Quotations (visual renovado)
- [ ] Tooling Report (SSR + OPG)
- [ ] Price Consulting (visual renovado)

### Fase 6 — IA & Polish (Semanas 14-16)

- [ ] AI Chat Panel
- [ ] Spec Analyzer (upload + parse)
- [ ] Equipment Matcher
- [ ] Hours Estimator
- [ ] Knowledge Base indexing para IA
- [ ] Settings & Configuration
- [ ] Polish final: animações, micro-interactions, performance

### Fase 7 — Testes & Deploy (Semanas 17-18)

- [ ] Testes unitários e de integração
- [ ] User acceptance testing (UAT)
- [ ] Bug fixes e ajustes finais
- [ ] Deploy em produção (SharePoint App Catalog)
- [ ] Documentação final e treinamento

---

## 15. Migração de Dados

| Dado                | Estratégia                                                       |
| ------------------- | ---------------------------------------------------------------- |
| **BIDs existentes** | Leitura direta da lista Panorama-bid-demo (mesma estrutura JSON) |
| **Cotações**        | Leitura direta da lista Panorama-bid-quotes                      |
| **Favoritos**       | Leitura direta da lista favorite-bar                             |
| **Tooling Reports** | Mesma pasta SharePoint, mesmo parser Excel                       |
| **Queries.xlsx**    | Mesmo arquivo, mesmo worker de processamento                     |
| **OTD Data**        | Leitura direta da lista panorama-bid-otd                         |

> A migração é transparente — o SMART BID 2.0 lê os mesmos dados do SharePoint que o 1.0. Ambas as versões podem coexistir durante a transição.

---

## Resumo Executivo

O **SMART BID 2.0** transforma a ferramenta de gestão de propostas da Oceaneering Brasil de uma Web Part monolítica em uma aplicação React moderna, escalável e inteligente. Os principais ganhos são:

1. **UX/UI Profissional** — Design inspirado no SmartFlow, com dark mode, sidebar colapsável, KPIs visuais
2. **Fluxo Otimizado** — Separação clara entre solicitações (Requests) e propostas (BIDs) com workflow visual
3. **Inteligência Artificial** — Assistente de IA para análise de specs, sugestão de equipamentos e estimativas
4. **Knowledge Base** — Repositório centralizado indexado por IA para consulta rápida
5. **Analytics Avançado** — Dashboards executivos com detecção de anomalias e tendências
6. **Arquitetura Escalável** — React + TypeScript + pastas organizadas para manutenção e evolução
7. **Compatibilidade** — Coexiste com a versão 1.0 durante a transição, usando os mesmos dados SharePoint
