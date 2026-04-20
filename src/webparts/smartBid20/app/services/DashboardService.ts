/**
 * DashboardService — Cálculo de KPIs e métricas.
 * Static singleton pattern.
 */
import { IBid } from "../models";
import {
  IDashboardKPI,
  IDashboardData,
  IMonthlyVolume,
  IDivisionWorkload,
} from "../models/IDashboard";
import { IKPITargets } from "../models/ISystemConfig";
import { KPI_DEFINITIONS } from "../config/kpi.config";

export class DashboardService {
  public static calculateKPIs(
    bids: IBid[],
    targets: IKPITargets,
  ): IDashboardKPI[] {
    const completedBids = bids.filter((b) => b.currentStatus === "Completed");
    const activeBids = bids.filter(
      (b) => !["Completed", "Canceled", "No Bid"].includes(b.currentStatus),
    );
    const overdueBids = activeBids.filter((b) => b.kpis?.isOverdue);

    const onTimeCount = completedBids.filter((b) => !b.kpis?.isOverdue).length;
    const onTimeRate =
      completedBids.length > 0
        ? Math.round((onTimeCount / completedBids.length) * 100)
        : 0;

    const avgDays =
      completedBids.length > 0
        ? Math.round(
            completedBids.reduce(
              (sum, b) => sum + (b.kpis?.totalDaysElapsed || 0),
              0,
            ) / completedBids.length,
          )
        : 0;

    const overdueRate =
      activeBids.length > 0
        ? Math.round((overdueBids.length / activeBids.length) * 100)
        : 0;

    return KPI_DEFINITIONS.map((def) => ({
      id: def.id,
      label: def.label,
      value: DashboardService._getKPIValue(
        def.id,
        onTimeRate,
        avgDays,
        overdueRate,
        bids,
      ),
      target:
        (targets as unknown as Record<string, number>)[def.targetKey] ?? 0,
      unit: def.unit,
      trend: "stable" as const,
      trendValue: 0,
      color: def.color,
    }));
  }

  private static _getKPIValue(
    id: string,
    onTimeRate: number,
    avgDays: number,
    overdueRate: number,
    _bids: IBid[],
  ): number {
    switch (id) {
      case "on-time-delivery":
        return onTimeRate;
      case "avg-completion-days":
        return avgDays;
      case "overdue-rate":
        return overdueRate;
      default:
        return 0;
    }
  }

  public static calculateMonthlyVolumes(bids: IBid[]): IMonthlyVolume[] {
    const months: Record<string, IMonthlyVolume> = {};
    for (const bid of bids) {
      const date = new Date(bid.createdDate);
      const m = date.getMonth() + 1;
      const key = `${date.getFullYear()}-${m < 10 ? "0" + m : String(m)}`;
      if (!months[key]) {
        months[key] = {
          month: key,
          year: date.getFullYear(),
          created: 0,
          completed: 0,
          cancelled: 0,
        };
      }
      months[key].created++;
      if (bid.currentStatus === "Completed") months[key].completed++;
      if (bid.currentStatus === "Canceled") months[key].cancelled++;
    }
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }

  public static calculateDivisionWorkloads(bids: IBid[]): IDivisionWorkload[] {
    const divisions: Record<string, IDivisionWorkload> = {};
    const activeBids = bids.filter(
      (b) => !["Completed", "Canceled", "No Bid"].includes(b.currentStatus),
    );

    for (const bid of activeBids) {
      const div = bid.division;
      if (!divisions[div]) {
        divisions[div] = {
          division: div,
          activeBids: 0,
          pendingApprovals: 0,
          overdueBids: 0,
          avgCompletionDays: 0,
        };
      }
      divisions[div].activeBids++;
      if (bid.currentStatus === "Pending Approval")
        divisions[div].pendingApprovals++;
      if (bid.kpis?.isOverdue) divisions[div].overdueBids++;
    }
    return Object.values(divisions);
  }

  public static buildDashboardData(
    bids: IBid[],
    targets: IKPITargets,
  ): IDashboardData {
    return {
      kpis: DashboardService.calculateKPIs(bids, targets),
      monthlyVolumes: DashboardService.calculateMonthlyVolumes(bids),
      divisionWorkloads: DashboardService.calculateDivisionWorkloads(bids),
      recentBidNumbers: bids
        .sort(
          (a, b) =>
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime(),
        )
        .slice(0, 10)
        .map((b) => b.bidNumber),
      upcomingDeadlines: bids
        .filter(
          (b) => !["Completed", "Canceled", "No Bid"].includes(b.currentStatus),
        )
        .map((b) => ({
          bidNumber: b.bidNumber,
          dueDate: b.dueDate,
          daysRemaining: Math.ceil(
            (new Date(b.dueDate).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24),
          ),
        }))
        .filter((d) => d.daysRemaining > 0)
        .sort((a, b) => a.daysRemaining - b.daysRemaining)
        .slice(0, 10),
    };
  }
}
