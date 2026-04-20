---
description: "Scaffold a new SPFx component with the triplet pattern (.tsx + .module.scss + .module.scss.ts)"
mode: agent
---

# Scaffold SPFx Component

You are creating a new component for the SmartBid 2.0 SPFx project.

## Input

The user will provide:

- **Component name** (PascalCase, e.g., `BidTimeline`)
- **Target folder** under `src/webparts/smartBid20/app/` (e.g., `components/bid/`, `pages/`)

## Rules

1. **Always create the triplet** — three files per component:
   - `{Name}.tsx` — React component
   - `{Name}.module.scss` — Scoped SCSS styles
   - `{Name}.module.scss.ts` — TypeScript shim for the CSS module

2. **SCSS Module shim** must follow this exact pattern:

   ```typescript
   /* tslint:disable */
   require("./{Name}.module.css");
   const styles: { [key: string]: string } = {
     container: "container_{hash}",
     // ... one entry per class name
   };
   export default styles;
   ```

   Use a random 8-char hex hash suffix (e.g., `a3f1b2c4`). All class names in `.module.scss` must appear in the shim.

3. **TSX file conventions:**
   - Import styles: `import styles from './{Name}.module.scss';`
   - Import types from `models/` (never declare inline interfaces that exist there)
   - Import hooks from `hooks/` (useStatusColors, useAccessLevel, useCurrentUser, useBids, etc.)
   - Import utils from `utils/` (formatters, validators, phaseHelpers, statusHelpers, costCalculations)
   - Import config from `config/` (ROUTES, SP_CONFIG, PHASES, SUB_STATUSES)
   - Use stores from `stores/` (useBidStore, useConfigStore, useAuthStore, useUIStore)
   - **NEVER** import from `data/` — all data comes from services via stores
   - Use `React.FC<Props>` or plain function components
   - Export as default

4. **SCSS file conventions:**
   - Use CSS custom properties for ALL colors: `var(--card-bg)`, `var(--text-primary)`, `var(--primary-accent)`, etc.
   - Never hardcode hex colors — use theme variables from `themes/dark.module.scss` / `themes/light.module.scss`
   - Scope everything under a root class matching the component name

5. **Before creating**, check `models/index.ts` for existing interfaces, `config/` for existing constants, `utils/` for existing helpers. Do not duplicate.

## Output

Create all 3 files with appropriate boilerplate and explain what was created.
