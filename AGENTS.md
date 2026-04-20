# SmartBid 2.0 — Agent Instructions

## Overview

SPFx 1.20 web part for managing engineering BID requests at Oceaneering Brazil.  
React 17 + TypeScript + Zustand + SCSS Modules + PnPjs v3 + HashRouter.  
Target: SharePoint Online (`https://oceaneering.sharepoint.com/sites/G-OPGSSRBrazilEngineering`).

## Build & Serve

```bash
npm install --legacy-peer-deps   # Required due to SPFx peer dependency conflicts
gulp bundle                       # Build (dev)
gulp bundle --ship                # Build (production)
gulp package-solution --ship      # Create .sppkg
gulp serve                        # Local workbench
gulp clean                        # Clean lib/ and temp/
```

Node requirement: `>=18.17.1 <19.0.0`

## Project Structure

All application code lives under `src/webparts/smartBid20/app/`:

| Directory     | Purpose                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `components/` | React components organized by domain: `common/`, `layout/`, `bid/`, `dashboard/`, `approval/`, `template/`, `settings/`, `insights/`, `reports/` |
| `config/`     | Constants and configuration: routes, navigation, phases, statuses, KPIs, SharePoint list names (`sharepoint.config.ts`)                          |
| `data/`       | Mock data files (exports prefixed `MOCK_*` or `default*`)                                                                                        |
| `hooks/`      | 11 custom hooks (`useAccessLevel`, `useBids`, `useCurrentUser`, `useStatusColors`, etc.)                                                         |
| `models/`     | TypeScript interfaces (`I`-prefixed), barrel-exported from `index.ts`                                                                            |
| `pages/`      | 23 page components, each a triplet (`.tsx` + `.module.scss` + `.module.scss.ts`)                                                                 |
| `services/`   | 15 SharePoint service classes (static singletons using PnPjs)                                                                                    |
| `stores/`     | 7 Zustand stores (`useAuthStore`, `useBidStore`, `useConfigStore`, `useUIStore`, etc.)                                                           |
| `styles/`     | Global SCSS, animations, SP overrides, `themes/dark.module.scss` + `themes/light.module.scss`                                                    |
| `utils/`      | Pure helpers: `accessControl`, `formatters`, `validators`, `exportHelpers`, `phaseHelpers`, etc.                                                 |

Entry chain: `SmartBid20WebPart.ts` → `SmartBid20.tsx` (provides `SpfxContext`) → `AppLayout.tsx` (HashRouter + routes).

## Key Conventions

### Component Triplet Pattern

Every component/page MUST have three files:

1. `Name.tsx` — React component, imports styles from the `.module.scss`
2. `Name.module.scss` — Scoped styles using CSS custom properties (`var(--card-bg)`, etc.)
3. `Name.module.scss.ts` — SPFx-generated type declaration exporting class names with hash suffixes

When adding CSS classes, the `.module.scss.ts` shim must be updated to include the new class names.

### Services — Static Singleton

```typescript
export class XxxService {
  public static async getAll(): Promise<IXxx[]> {
    const items = await SPService.sp.web.lists
      .getByTitle(SP_CONFIG.lists.xxx)
      .items();
    return items.map(mapFn);
  }
}
```

- No instantiation — all methods are `public static`
- Access SharePoint via `SPService.sp` (PnPjs SPFI instance)
- List/library names come from `sharepoint.config.ts`
- Complex data stored as JSON blobs in SharePoint list columns

### Zustand Stores

```typescript
interface XxxState { /* state + actions */ }
export const useXxxStore = create<XxxState>((set, get) => ({ ... }));
```

No middleware (no persist, devtools, or immer).

### Routing

`routes.config.ts` exports a `ROUTES` const object mapping names → path strings.  
HashRouter used for SharePoint compatibility. 24 routes total.  
Landing page: `/` → `BidTrackerPage`.

### Theming

- Dark/light mode via `.smartBidDark` / `.smartBidLight` class on root
- All colors defined as CSS custom properties in `themes/*.module.scss`
- Everything scoped under `.smartBidRoot` to avoid SharePoint CSS conflicts

### TypeScript

- Target: ES5, Module: ESNext (`downlevelIteration: true`)
- `strict` is NOT enabled, `noImplicitAny: false`
- Use `flatMap` alternatives (forEach + push) for ES5 target compatibility
- Use optional chaining (`?.`) — supported via TypeScript downlevel

## SharePoint Lists

| List/Library              | Purpose                            |
| ------------------------- | ---------------------------------- |
| `smartbid-tracker`        | Main BID items (JSON blob per bid) |
| `smartbid-config`         | System configuration               |
| `smartbid-status-tracker` | Status change history              |
| `smartbid-approvals`      | Approval flow records              |
| `SmartBidAttachments`     | Document library for file uploads  |

## Critical Rules

### NO Mock Data

**Never use mock/hardcoded data.** All data MUST come from SharePoint lists via the service classes in `services/`.  
The `data/` folder with `MOCK_*` exports exists only as legacy reference — do NOT import from it in any component or page.  
Always use the corresponding service (`BidService`, `RequestService`, `MembersService`, etc.) and wire through Zustand stores.

### Reuse Existing Modules — No Duplication

Before declaring types, constants, helpers, or styles inline, check these directories first:

| Need                  | Look in          | Examples                                                                        |
| --------------------- | ---------------- | ------------------------------------------------------------------------------- |
| Type/Interface        | `models/`        | `IBid`, `IUser`, `ITeamMember`, `ISystemConfig`                                 |
| Constants/Enums       | `config/`        | `ROUTES`, `SP_CONFIG`, `PHASES`, `SUB_STATUSES`, `KPI_DEFINITIONS`              |
| Data fetching         | `services/`      | `BidService.getAll()`, `MembersService.getMembers()`                            |
| State/Actions         | `stores/`        | `useBidStore`, `useConfigStore`, `useAuthStore`                                 |
| Derived/reactive data | `hooks/`         | `useBids`, `useStatusColors`, `useAccessLevel`, `useCurrentUser`                |
| Formatting/validation | `utils/`         | `formatters`, `validators`, `phaseHelpers`, `statusHelpers`, `costCalculations` |
| Colors/theming        | `styles/themes/` | CSS variables in `dark.module.scss` / `light.module.scss`                       |

**Do not** re-declare interfaces that exist in `models/`, duplicate color values that exist as CSS variables, inline status/phase logic that exists in `utils/`, or create local state for data already in a Zustand store.

## Important Notes

- `SPService.init(context)` must be called in `SmartBid20WebPart.onInit()` before any service use
- `SpfxContext` (React context) propagates the SPFx `WebPartContext` to child components
- The [architecture doc](Inspiration/SMART-BID-2.0-ARCHITECTURE.md) mentions React 18/Vite/Tailwind — those are **aspirational**; the actual implementation uses React 17/Gulp/SCSS Modules
- Progress tracking and remaining work items are in the repo memory and [audit TODO](Inspiration/SMART-BID-2.0-AUDIT-TODO.md)
- Install with `--legacy-peer-deps` to avoid SPFx dependency resolution failures
