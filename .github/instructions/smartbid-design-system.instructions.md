---
description: "SmartBid 2.0 design system — tokens, components, charts and UX conventions to keep every new feature visually consistent. Pairs with the ui-ux-pro-max skill (design inspiration) but SmartBid tokens are always the source of truth."
applyTo: "src/webparts/smartBid20/app/**/*.tsx,src/webparts/smartBid20/app/**/*.scss"
---

# SmartBid 2.0 — Design System Guide

Follow these rules whenever you build or restyle UI in the SmartBid app. They keep new
features on-brand and prevent visual drift. This file is the **source of truth for the
look & feel**; the `ui-ux-pro-max` skill is only for _inspiration_ (layout ideas, chart-type
selection, UX heuristics) — never let it override the tokens, stack, or conventions below.

## Golden Rules

1. **Never hardcode a color.** Use the CSS custom properties (`var(--...)`) defined in
   `styles/themes/dark.module.scss` / `light.module.scss`. For charts, use the
   `useChartTheme()` hook.
2. **Status / phase / division / priority colors are config-driven.** Read them from
   `useStatusColors()` / `useConfigStore` — the SharePoint config can change them at runtime.
   Never inline hex for a status or phase.
3. **Every component/page is a triplet**: `Name.tsx` + `Name.module.scss` + `Name.module.scss.ts`.
   Add every new SCSS class to the `.module.scss.ts` shim.
4. **This is SPFx 1.20 + React 17 + TypeScript 4.7 + SCSS Modules + Fluent UI 8.** There is
   **no Tailwind and no shadcn** here. When the ui-ux-pro-max skill suggests Tailwind/shadcn
   utilities, translate the intent into SCSS + CSS variables instead.
5. **Scope styles** under the component root class so SharePoint's global CSS can't leak in.
6. **Dark mode is the default** and must always be tested; light mode must stay legible
   (sidebar/header keep a dark background even in light mode — use the `--sidebar-*` / `--header-*`
   tokens, not the global text tokens).

## Design Tokens (CSS custom properties)

Applied via `.smartBidDark` / `.smartBidLight` on the root. Use the variable, not the hex.

### Surfaces & Chrome

| Token                | Dark                    | Light                  | Use                              |
| -------------------- | ----------------------- | ---------------------- | -------------------------------- |
| `--main-bg`          | `#0f1b2d`               | `#f8fafc`              | Page background                  |
| `--card-bg`          | `#152238`               | `#ffffff`              | Card / panel background          |
| `--card-bg-elevated` | `#1a2d4a`               | `#f1f5f9`              | Raised surfaces, inputs-in-cards |
| `--sidebar-bg`       | `#0a1628`               | `#1a2332`              | Sidebar (dark in both themes)    |
| `--input-bg`         | `#1a2d4a`               | `#f1f5f9`              | Form inputs                      |
| `--hover-bg`         | `rgba(255,255,255,.04)` | `rgba(0,0,0,.04)`      | Row/item hover                   |
| `--glass-bg`         | `rgba(21,34,56,.7)`     | `rgba(255,255,255,.8)` | Glassmorphism fill               |
| `--glass-border`     | `rgba(255,255,255,.08)` | `rgba(0,0,0,.05)`      | Glass border                     |

### Brand & Accents

| Token                | Dark      | Light     | Meaning                                   |
| -------------------- | --------- | --------- | ----------------------------------------- |
| `--primary-accent`   | `#00c9a7` | `#0d9488` | Teal — primary actions, focus, active nav |
| `--secondary-accent` | `#3b82f6` | `#2563eb` | Blue — secondary emphasis                 |
| `--tertiary-accent`  | `#8b5cf6` | `#7c3aed` | Purple — tertiary/highlights              |

### Semantic (same in both themes)

| Token       | Hex       | Meaning                      |
| ----------- | --------- | ---------------------------- |
| `--success` | `#10b981` | Completion / OK              |
| `--warning` | `#f59e0b` | Caution / pending            |
| `--danger`  | `#ef4444` | Risk / overdue / destructive |
| `--info`    | `#06b6d4` | Neutral metrics / info       |

### Text & Borders

| Token              | Dark      | Light     |
| ------------------ | --------- | --------- |
| `--text-primary`   | `#f1f5f9` | `#1e293b` |
| `--text-secondary` | `#94a3b8` | `#475569` |
| `--text-muted`     | `#64748b` | `#94a3b8` |
| `--border`         | `#1e3a5f` | `#e2e8f0` |
| `--border-subtle`  | `#162d50` | `#f1f5f9` |

### Gradients, Shadows & Overlays

- `--gradient-primary`, `--gradient-accent`, `--gradient-header` — use for hero headers / CTAs.
- `--shadow-card`, `--shadow-card-hover`, `--shadow-glow` — never invent new shadows.
- `--overlay-bg` — modal/scrim background. `--scrollbar-thumb` / `--scrollbar-track` for custom scrollbars.

> When you add a new token, add it to **both** `dark.module.scss` and `light.module.scss`.

## Spacing, Radius & Motion

- **Border radius**: `16px` cards · `12px` panels · `8px` buttons/inputs · `6px` bars/badges.
- **Gaps**: `24px` (section / chart↔content) · `16px` (major) · `12px` (moderate) · `8px` (minor).
- **Grid**: responsive card grids use `repeat(auto-fit, minmax(200px, 1fr))` with a `16px` gap.
- **Transitions**: `250ms ease` for hover transforms; `300–600ms` for interactive fills/progress.
- **Hover**: cards lift `translateY(-2px)` + upgrade to `--shadow-card-hover` + brighten border;
  bars go to `opacity: .9`.
- Prefer the shared keyframes in `styles/animations.module.scss` over ad-hoc `@keyframes`.
- Respect `prefers-reduced-motion` for non-essential motion.

## Core Components — reuse before building

| Need              | Component                                                     | Notes                                                                                                          |
| ----------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Container / panel | `common/GlassCard`                                            | Props: `title`, `subtitle`, `actions`, `accentColor`, `interactive`, `noBodyPadding`. Backdrop blur ~18px.     |
| Metric tile       | `common/KPICard`                                              | Props: `label`, `value`, `accentColor`, `trend`, `subtitle`, `progress`; `variant="glass"` + `sparkline` slot. |
| Empty state       | `common/EmptyState`                                           | Supports `variant="glass"`.                                                                                    |
| Loading           | `common/SkeletonLoader`                                       | Use skeletons, not spinners, for content areas.                                                                |
| Tables            | `common/DataTable`                                            | Generic `<T extends object>`; use for list views.                                                              |
| Filters           | `common/FilterPanel` / `insights/AnalyticsFilterBar`          | Use `AnalyticsFilterBar` (+ `useAnalyticsFilters`) on analytics pages.                                         |
| Badges            | `PriorityBadge`, `StatusBadge`, `PhaseBadge`, `DivisionBadge` | All config-color aware — do not restyle with inline hex.                                                       |
| Toasts            | `useUIStore.addToast` + `ToastContainer`                      | Don't build one-off notifications.                                                                             |

## Charts (Recharts)

- **Library is Recharts v2** (`recharts@^2.15.0`). Do **not** upgrade to v3 (needs TS5/ES6).
  A default-import type clash requires `allowSyntheticDefaultImports: true` in `tsconfig.json`
  (already set) — keep it, and always verify chart work with `gulp bundle` (the editor's TS
  server won't surface the error).
- **Theme the chart chrome with `useChartTheme()`** — it returns `grid`, `axis`, `tick`,
  `textPrimary/Secondary/Muted`, `cardBg`, accents, semantic colors, a 10-color `categorical`
  palette, and `referenceFill`. Never hardcode axis/grid colors.
- **Series colors:**
  - Status / phase / division series → `useStatusColors()` (config-driven).
  - Generic non-semantic series → `categoricalColor(index)` / `theme.categorical`.
- **Reuse the charts kit** in `components/charts/`: `ChartTooltip` (always pass as Recharts
  `content`), `Sparkline`, `HeatmapGrid`. Wrap every chart in a `GlassCard`.
- **Chart-type selection** (lean on the `ui-ux-pro-max` charts data for ideas, then implement in Recharts):
  - Trend over time → `LineChart` / `AreaChart` / `ComposedChart` (win-vs-loss, volume).
  - Part-to-whole → `PieChart` (donut) — prefer donut with a center total.
  - Category comparison → `BarChart` (horizontal for long labels).
  - Distribution / density → `HeatmapGrid` (e.g., division × phase).
  - KPI micro-trend → `Sparkline` inside a glass `KPICard`.
- Keep charts responsive (`ResponsiveContainer`), show empty/loading states, and label axes.

## Working with the `ui-ux-pro-max` skill

That skill (in `.github/prompts/ui-ux-pro-max/`) ships a large design database (styles, color
palettes, font pairings, UX guidelines, chart types). Python is **not installed**, so the CLI
search scripts won't run — that's fine: read the CSVs directly for reference, e.g.
`.github/prompts/ui-ux-pro-max/data/charts.csv`, `.../ux-guidelines.csv`, `.../motion.csv`,
`.../typography.csv`, and `.../stacks/react.csv`.

When you use it:

- Take **layout patterns, UX heuristics, chart-type ideas, and motion cues** from it.
- **Discard** its Tailwind/shadcn/token output — re-express everything with SmartBid's CSS
  variables, SCSS modules, Fluent UI 8, and the components above.
- SmartBid brand colors (teal/blue/purple + semantic) win over any palette it proposes.

## Pre-merge checklist

- [ ] No hardcoded hex — tokens (`var(--...)`) or `useChartTheme()` / `useStatusColors()` only.
- [ ] Looks correct in **both** dark and light mode.
- [ ] New SCSS classes mirrored in the `.module.scss.ts` shim.
- [ ] Reused existing components (GlassCard/KPICard/DataTable/badges) instead of re-building.
- [ ] Responsive down to ~900px; empty + loading states handled.
- [ ] `gulp bundle` passes clean (catches Recharts/TS4.7 issues the editor hides).
