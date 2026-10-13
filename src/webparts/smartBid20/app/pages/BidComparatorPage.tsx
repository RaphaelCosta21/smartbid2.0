/**
 * BidComparatorPage — compares a BID against earlier BIDs: price changes per unit, scope
 * added or dropped, and the total variance. Built from the live BID data.
 */
import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { SegmentedTabs } from "../components/common/SegmentedTabs";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { buildBidOptions } from "../components/common/BidSelect";
import { ExportBar } from "../components/reports/ExportBar";
import { ComparatorSetup } from "../components/comparator/ComparatorSetup";
import { ComparisonSummary } from "../components/comparator/ComparisonSummary";
import { ComparisonExecutive } from "../components/comparator/ComparisonExecutive";
import {
  FullComparisonTable,
  PriceChangesTable,
  ScopeChangesTables,
} from "../components/comparator/ComparisonTables";
import { COMPARATOR_CONFIG } from "../config/comparator.config";
import { useBids } from "../hooks/useBids";
import { useOpenBid } from "../hooks/useOpenBid";
import { useUIStore } from "../stores/useUIStore";
import {
  buildComparisonExportRows,
  compareBids,
  IComparisonResult,
} from "../utils/bidComparator";
import { downloadXlsx, getExportFilename } from "../utils/exportHelpers";
import { getBidDisplayCurrency } from "../utils/quotationLinks";
import styles from "./BidComparatorPage.module.scss";

type ResultTab = "executive" | "changes" | "scope" | "full";

const RESULT_TABS: { key: ResultTab; label: string }[] = [
  { key: "executive", label: "Executive view" },
  { key: "changes", label: "Price changes" },
  { key: "scope", label: "Scope changes" },
  { key: "full", label: "Full comparison" },
];

export const BidComparatorPage: React.FC = () => {
  const { bids, isLoading } = useBids();
  const { canOpen } = useOpenBid();
  const addToast = useUIStore((s) => s.addToast);

  const [newBid, setNewBid] = React.useState("");
  const [histBids, setHistBids] = React.useState<string[]>([]);
  const [threshold, setThreshold] = React.useState<number>(
    COMPARATOR_CONFIG.defaultThresholdPct,
  );
  const [running, setRunning] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const [result, setResult] = React.useState<IComparisonResult | null>(null);
  const [tab, setTab] = React.useState<ResultTab>("executive");

  // A BID with no items has nothing to compare; confidential BIDs need access
  const candidates = React.useMemo(
    () =>
      bids.filter((b) => (b.assetBreakdown || []).length > 0 && canOpen(b)),
    [bids, canOpen],
  );
  const options = React.useMemo(
    () => buildBidOptions(candidates),
    [candidates],
  );
  const newBidData = React.useMemo(
    () => candidates.find((b) => b.bidNumber === newBid),
    [candidates, newBid],
  );
  const display = React.useMemo(
    () =>
      newBidData
        ? getBidDisplayCurrency(newBidData)
        : { currency: "USD" as const, rate: 1 },
    [newBidData],
  );

  const handleNewBid = (bidNumber: string): void => {
    setNewBid(bidNumber);
    setHistBids((prev) => prev.filter((id) => id !== bidNumber));
    setResult(null);
  };

  const handleToggleHist = (bidNumber: string): void =>
    setHistBids((prev) =>
      prev.indexOf(bidNumber) !== -1
        ? prev.filter((id) => id !== bidNumber)
        : [...prev, bidNumber],
    );

  const handleCompare = (): void => {
    if (!newBidData) return;
    const hist = candidates.filter((b) => histBids.indexOf(b.bidNumber) !== -1);
    if (hist.length === 0) return;
    setRunning(true);
    // Lets the "Comparing…" state paint before the synchronous work starts
    window.setTimeout(() => {
      try {
        setResult(compareBids(newBidData, hist, threshold));
        setTab("executive");
      } catch (err) {
        addToast({
          type: "error",
          title: "Comparison failed",
          message: err instanceof Error ? err.message : undefined,
        });
      } finally {
        setRunning(false);
      }
    }, 30);
  };

  const handleExport = async (): Promise<void> => {
    if (!result) return;
    setExporting(true);
    try {
      const safe = result.newBid.replace(/[\\/:*?"<>|]/g, "_");
      await downloadXlsx(
        buildComparisonExportRows(result, display.rate),
        "Comparison",
        getExportFilename(`Bid-Comparison-${safe}`, "xlsx"),
      );
    } catch (err) {
      addToast({
        type: "error",
        title: "Export failed",
        message: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Bid Comparator"
        subtitle="Side-by-side comparison of a BID against earlier BIDs"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 20h18" />
            <rect x="4" y="6" width="6" height="12" rx="1" />
            <rect x="14" y="10" width="6" height="8" rx="1" />
          </svg>
        }
        actions={
          result ? (
            <ExportBar
              onExcel={() => {
                void handleExport();
              }}
              busy={exporting}
            />
          ) : undefined
        }
      />

      {isLoading && bids.length === 0 ? (
        <SkeletonLoader height={160} borderRadius={16} />
      ) : options.length < 2 ? (
        <EmptyState
          variant="glass"
          title="Not enough BIDs to compare"
          description="Comparing needs at least two BIDs with an Assets Breakdown."
        />
      ) : (
        <>
          <ComparatorSetup
            options={options}
            newBid={newBid}
            histBids={histBids}
            threshold={threshold}
            newItemCount={
              newBidData ? (newBidData.assetBreakdown || []).length : 0
            }
            running={running}
            onNewBid={handleNewBid}
            onToggleHist={handleToggleHist}
            onClearHist={() => setHistBids([])}
            onThreshold={setThreshold}
            onCompare={handleCompare}
          />

          {result && (
            <>
              <ComparisonSummary result={result} displayCurrency={display} />
              <SegmentedTabs<ResultTab>
                tabs={RESULT_TABS}
                value={tab}
                onChange={setTab}
                ariaLabel="Comparison views"
              />
              {tab === "executive" && (
                <ComparisonExecutive
                  result={result}
                  displayCurrency={display}
                />
              )}
              {tab === "changes" && (
                <PriceChangesTable result={result} displayCurrency={display} />
              )}
              {tab === "scope" && (
                <ScopeChangesTables result={result} displayCurrency={display} />
              )}
              {tab === "full" && (
                <FullComparisonTable
                  result={result}
                  displayCurrency={display}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
