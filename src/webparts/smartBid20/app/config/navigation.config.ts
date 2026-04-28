export interface INavItem {
  key: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
  badgePulsing?: boolean;
  section: string;
  children?: INavItem[];
  requiredAccess?: string;
}

export const NAVIGATION_SECTIONS = [
  "action",
  "workspace",
  "knowledge",
  "insights",
  "reports",
  "tools",
  "settings",
] as const;

export const NAVIGATION_ITEMS: INavItem[] = [
  // ACTION
  {
    key: "create-request",
    label: "Create Request",
    icon: "Plus",
    route: "/requests/new",
    section: "action",
  },

  // WORKSPACE
  {
    key: "tracker",
    label: "BID Tracker",
    icon: "ClipboardList",
    route: "/",
    section: "workspace",
  },
  {
    key: "dashboard",
    label: "Engineering Dashboard",
    icon: "BarChart3",
    route: "/dashboard",
    section: "workspace",
    requiredAccess: "engineering",
  },
  {
    key: "unassigned",
    label: "Unassigned Requests",
    icon: "FolderOpen",
    route: "/requests",
    section: "workspace",
    badge: 3,
    badgePulsing: true,
  },
  {
    key: "timeline",
    label: "Timeline View",
    icon: "CalendarDays",
    route: "/timeline",
    section: "workspace",
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: "Bell",
    route: "/notifications",
    section: "workspace",
  },
  {
    key: "faq",
    label: "FAQ & Instructions",
    icon: "HelpCircle",
    route: "/faq",
    section: "workspace",
  },

  // KNOWLEDGE BASE
  {
    key: "knowledge-base",
    label: "Knowledge Base",
    icon: "BookOpen",
    route: "/knowledge",
    section: "knowledge",
  },
  {
    key: "assets-catalog",
    label: "Assets Catalog",
    icon: "Package",
    route: "/knowledge/assets-catalog",
    section: "knowledge",
  },
  {
    key: "templates",
    label: "Scope Templates",
    icon: "LayoutTemplate",
    route: "/templates",
    section: "knowledge",
  },

  // INSIGHTS
  {
    key: "analytics",
    label: "Analytics",
    icon: "TrendingUp",
    route: "/analytics",
    section: "insights",
    children: [
      {
        key: "performance-trends",
        label: "Performance Trends",
        icon: "TrendingUp",
        route: "/analytics/performance",
        section: "insights",
      },
      {
        key: "bottleneck-analysis",
        label: "Bottleneck Analysis",
        icon: "AlertCircle",
        route: "/analytics/bottleneck",
        section: "insights",
      },
      {
        key: "team-analytics",
        label: "Team Analytics",
        icon: "Users",
        route: "/analytics/team",
        section: "insights",
      },
    ],
  },

  // REPORTS
  {
    key: "reports",
    label: "Reports & Export",
    icon: "BarChart3",
    route: "/reports",
    section: "reports",
    children: [
      {
        key: "period-performance",
        label: "Period Performance",
        icon: "Calendar",
        route: "/reports/period",
        section: "reports",
      },
      {
        key: "bid-details-report",
        label: "BID Details",
        icon: "FileSpreadsheet",
        route: "/reports/bid-details",
        section: "reports",
      },
      {
        key: "operational-summary",
        label: "Operational Summary",
        icon: "PieChart",
        route: "/reports/operational",
        section: "reports",
      },
    ],
  },

  // TOOLS
  {
    key: "favorites",
    label: "Favorites",
    icon: "Star",
    route: "/tools/favorites",
    section: "tools",
  },
  {
    key: "bom-costs",
    label: "BOM Costs",
    icon: "Calculator",
    route: "/tools/bom-costs",
    section: "tools",
  },
  {
    key: "quotations",
    label: "Quotations",
    icon: "DollarSign",
    route: "/tools/quotations",
    section: "tools",
  },
  {
    key: "tooling-report",
    label: "Tooling Report",
    icon: "Wrench",
    route: "/tools/tooling",
    section: "tools",
  },
  {
    key: "query-consulting",
    label: "Query Consulting",
    icon: "CircleDollarSign",
    route: "/tools/query-consulting",
    section: "tools",
  },

  // SETTINGS
  {
    key: "system-config",
    label: "System Configuration",
    icon: "Settings",
    route: "/settings/config",
    section: "settings",
    requiredAccess: "settings",
  },
  {
    key: "members",
    label: "Members Management",
    icon: "Users",
    route: "/settings/members",
    section: "settings",
    requiredAccess: "settings",
  },
  {
    key: "patch-notes",
    label: "Patch Notes",
    icon: "ClipboardList",
    route: "/settings/patch-notes",
    section: "settings",
  },
];

export const SECTION_LABELS: Record<string, string> = {
  action: "",
  workspace: "WORKSPACE",
  knowledge: "KNOWLEDGE BASE",
  insights: "INSIGHTS",
  reports: "REPORTS",
  tools: "TOOLS",
  settings: "SETTINGS",
};
