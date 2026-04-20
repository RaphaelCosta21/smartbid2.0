---
description: "Implement a new BID-related feature following the SmartBid data flow pattern"
mode: agent
---

# Implement BID Feature

You are implementing a new feature in the SmartBid 2.0 SPFx project.

## Data Flow

All features MUST follow this pipeline:

```
SharePoint List → Service (static class) → Zustand Store → Hook (optional) → Page/Component
```

### Layer Responsibilities

| Layer         | Location      | Pattern                                                                                             |
| ------------- | ------------- | --------------------------------------------------------------------------------------------------- |
| **Service**   | `services/`   | Static class with `SPService.sp`. Maps SP fields ↔ TypeScript models                                |
| **Store**     | `stores/`     | `create<State>((set, get) => ({...}))`. Holds state + actions. Calls service methods                |
| **Hook**      | `hooks/`      | Wraps store selectors, adds derived/computed data, combines multiple stores                         |
| **Page**      | `pages/`      | Calls hooks/stores, passes data to components. Triplet: `.tsx` + `.module.scss` + `.module.scss.ts` |
| **Component** | `components/` | Presentational. Receives props, renders UI. Triplet pattern                                         |

## Before Writing Code — Check Existing Modules

| Need           | Directory                | Key Exports                                                                                                                            |
| -------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Types          | `models/`                | `IBid`, `IBidRequest`, `IBidCost`, `IBidHours`, `IBidEquipment`, `IBidStatus`, `IBidApproval`, `IUser`, `ITeamMember`, `ISystemConfig` |
| Constants      | `config/`                | `ROUTES`, `SP_CONFIG`, `PHASES`, `SUB_STATUSES`, `KPI_DEFINITIONS`, `NAV_ITEMS`                                                        |
| Services       | `services/`              | `BidService`, `RequestService`, `MembersService`, `ApprovalService`, `AttachmentService`                                               |
| Stores         | `stores/`                | `useBidStore`, `useConfigStore`, `useAuthStore`, `useUIStore`, `useRequestStore`, `useTemplateStore`                                   |
| Hooks          | `hooks/`                 | `useBids`, `useStatusColors`, `useAccessLevel`, `useCurrentUser`, `useKPIs`, `useApprovals`                                            |
| Formatting     | `utils/formatters`       | `formatDate`, `formatDateTime`, `formatCurrency`, `formatFileSize`, `formatDaysLeft`, `formatRelativeTime`, `formatPercentage`         |
| Validation     | `utils/validators`       | `validateBidNumber`, `validateEmail`, `validateRequired`                                                                               |
| Phase logic    | `utils/phaseHelpers`     | `getPhaseProgress`, `getOverallProgress`, `getPhaseLabelForBid`, `getPendingTasks`                                                     |
| Status logic   | `utils/statusHelpers`    | `isTerminalStatus`, `getTerminalStatuses`, `getStatusLabel`, `getStatusesByPhase`                                                      |
| Cost math      | `utils/costCalculations` | `buildCostSummary`, `calculateMargin`                                                                                                  |
| Access control | `utils/accessControl`    | `canUserEdit`, `canUserApprove`, `hasAccess`                                                                                           |
| Colors         | `hooks/useStatusColors`  | `getPhaseColor`, `getStatusColor`, `getPriorityColor` — config-aware lookups                                                           |

## Critical Rules

1. **NO mock data** — never import from `data/`. All data from SP services
2. **NO inline interfaces** that duplicate `models/` — always import from `models/index.ts`
3. **NO hardcoded colors** — use CSS variables (`var(--primary-accent)`, etc.) or `useStatusColors()`
4. **NO inline date formatting** — use `formatDate()`, `formatDateTime()` from `utils/formatters`
5. **NO inline status checks** — use `isTerminalStatus()`, `getStatusesByPhase()` from `utils/statusHelpers`
6. **Use `useAccessLevel()`** for permission checks, not inline sector/role comparisons
7. **ES5 target** — no `flatMap`, use `forEach` + `push` pattern. Optional chaining `?.` is OK
8. **SCSS module triplet** — every new component/page needs `.tsx` + `.module.scss` + `.module.scss.ts`
