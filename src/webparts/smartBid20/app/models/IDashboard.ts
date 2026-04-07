/**
 * IDashboard — KPIs e métricas do dashboard.
 */
export interface IDashboardKPI {
  id: string;
  label: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
  color: string;
}

export interface IMonthlyVolume {
  month: string;
  year: number;
  created: number;
  completed: number;
  cancelled: number;
}

export interface IDivisionWorkload {
  division: string;
  activeBids: number;
  pendingApprovals: number;
  overdueBids: number;
  avgCompletionDays: number;
}

export interface IDashboardData {
  kpis: IDashboardKPI[];
  monthlyVolumes: IMonthlyVolume[];
  divisionWorkloads: IDivisionWorkload[];
  recentBidNumbers: string[];
  upcomingDeadlines: {
    bidNumber: string;
    dueDate: string;
    daysRemaining: number;
  }[];
}
