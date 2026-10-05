/**
 * useResultStatus — config-driven follow-up result of a BID (Won / Loss / Pending
 * / ... plus the synthetic "Open" bucket for BIDs still in engineering).
 */
import * as React from "react";
import { IBid } from "../models";
import { useConfigStore } from "../stores/useConfigStore";
import { useChartTheme } from "./useChartTheme";
import {
  getResultStatus,
  OPEN_STATUS,
  PENDING_STATUS,
  StatusOption,
} from "../utils/reportHelpers";

const DEFAULT_TERMINAL_STATUSES = [
  "Completed",
  "Canceled",
  "No Bid",
  "Returned to Commercial",
  "Client Canceled",
];

export interface ResultStatusApi {
  terminalStatuses: string[];
  /** Configured outcomes + Pending + Open, each with a hex color. */
  options: StatusOption[];
  getResult: (bid: IBid) => string;
  getColor: (value: string) => string;
  getLabel: (value: string) => string;
}

export function useResultStatus(): ResultStatusApi {
  const config = useConfigStore((s) => s.config);
  const t = useChartTheme();

  return React.useMemo(() => {
    const terms = (config?.terminalStatuses || [])
      .filter((x) => x.isActive !== false)
      .map((x) => x.value)
      .filter(Boolean);
    const terminalStatuses = terms.length ? terms : DEFAULT_TERMINAL_STATUSES;

    const configured: StatusOption[] = (config?.bidResultOptions || [])
      .filter((x) => x.isActive !== false)
      .map((x) => ({
        value: x.value,
        label: x.label || x.value,
        color: x.color || t.textMuted,
      }));
    const base: StatusOption[] = configured.length
      ? configured
      : [
          { value: "Won", label: "Won", color: t.success },
          { value: "Loss", label: "Lost", color: t.danger },
          { value: "Client Canceled", label: "Canceled", color: t.textMuted },
          { value: "No Bid", label: "No Bid", color: t.textMuted },
          { value: "Renegotiation", label: "Renegotiation", color: t.accentTertiary },
        ];
    const options = base.slice();
    if (!options.some((o) => o.value === PENDING_STATUS)) {
      options.push({ value: PENDING_STATUS, label: "Pending", color: t.warning });
    }
    options.push({ value: OPEN_STATUS, label: "Open", color: t.accentSecondary });

    const byValue: Record<string, StatusOption> = {};
    options.forEach((o) => {
      byValue[o.value] = o;
    });

    return {
      terminalStatuses,
      options,
      getResult: (bid: IBid) => getResultStatus(bid, terminalStatuses),
      getColor: (value: string) => byValue[value]?.color || t.textMuted,
      getLabel: (value: string) => byValue[value]?.label || value,
    };
  }, [config, t]);
}
