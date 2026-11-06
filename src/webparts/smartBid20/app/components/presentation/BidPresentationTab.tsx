/**
 * BidPresentationTab — the BID told for management and the approving sectors in one
 * fixed-height bento page: what it is and what it's worth (hero), how the price is built,
 * how it's supplied, where the asset value sits, the top items, the effort and the
 * commercial context. Every chart and card drills down into a side drawer.
 */
import * as React from "react";
import { IBid } from "../../models";
import { usePresentationModel } from "../../hooks/usePresentationModel";
import { useUIStore } from "../../stores/useUIStore";
import { buildBidTabRoute } from "../../config/bidTabs.config";
import { buildAppHashUrl, copyTextToClipboard } from "../../utils/clipboard";
import { getBidDisplayCurrency } from "../../utils/quotationLinks";
import {
  exportPresentationPdf,
  exportPresentationPptx,
} from "../../utils/presentationExport";
import { EmptyState } from "../common/EmptyState";
import { PresentationAssetValue } from "./PresentationAssetValue";
import { PresentationCommercial } from "./PresentationCommercial";
import { PresentationDrawer } from "./PresentationDrawer";
import { PresentationEffort } from "./PresentationEffort";
import { PresentationHero } from "./PresentationHero";
import { PresentationPriceBuildUp } from "./PresentationPriceBuildUp";
import { PresentationSupplyCards } from "./PresentationSupplyCards";
import { PresentationToolbar, ShareState } from "./PresentationToolbar";
import { PresentationTopItems } from "./PresentationTopItems";
import { ExportKind, PresentationDrawerView } from "./presentationTypes";
import styles from "./BidPresentationTab.module.scss";

export interface BidPresentationTabProps {
  bid: IBid;
}

const SHARE_FEEDBACK_MS = 2400;

export const BidPresentationTab: React.FC<BidPresentationTabProps> = ({
  bid,
}) => {
  const addToast = useUIStore((s) => s.addToast);
  const [currency, setCurrency] = React.useState<"USD" | "BRL">(
    () => getBidDisplayCurrency(bid).currency,
  );
  const model = usePresentationModel(bid, currency);

  const [category, setCategory] = React.useState<string | null>(null);
  const [stack, setStack] = React.useState<PresentationDrawerView[]>([]);
  const [presenting, setPresenting] = React.useState(false);
  const [shareState, setShareState] = React.useState<ShareState>("idle");
  const [exporting, setExporting] = React.useState<ExportKind | null>(null);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const buildChartRef = React.useRef<HTMLDivElement>(null);
  const assetChartRef = React.useRef<HTMLDivElement>(null);
  const effortChartRef = React.useRef<HTMLDivElement>(null);
  const shareTimer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    setCategory(null);
    setStack([]);
    setCurrency(getBidDisplayCurrency(bid).currency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bid.bidNumber]);

  // The drilled resource type disappears when its last priced item is removed
  React.useEffect(() => {
    if (category && !model.assetGroups.some((g) => g.category === category)) {
      setCategory(null);
    }
  }, [category, model.assetGroups]);

  React.useEffect(() => () => window.clearTimeout(shareTimer.current), []);

  // ─── Drawer stack ───
  const openDrawer = React.useCallback(
    (view: PresentationDrawerView) => setStack([view]),
    [],
  );
  const pushDrawer = React.useCallback(
    (view: PresentationDrawerView) => setStack((s) => s.concat([view])),
    [],
  );
  const replaceTop = React.useCallback(
    (view: PresentationDrawerView) =>
      setStack((s) => s.slice(0, -1).concat([view])),
    [],
  );
  const backDrawer = React.useCallback(
    () => setStack((s) => s.slice(0, -1)),
    [],
  );
  const closeDrawer = React.useCallback(() => setStack([]), []);

  // ─── Present mode: fixed full-viewport overlay + browser fullscreen when allowed ───
  const exitPresent = React.useCallback(() => {
    setPresenting(false);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => undefined);
    }
  }, []);

  const togglePresent = (): void => {
    if (presenting) {
      exitPresent();
      return;
    }
    setPresenting(true);
    const el = rootRef.current;
    if (el && el.requestFullscreen && document.fullscreenEnabled) {
      el.requestFullscreen().catch(() => undefined);
    }
  };

  React.useEffect(() => {
    if (!presenting) return undefined;
    // Esc in browser fullscreen is consumed by the browser: follow its exit
    const onFullscreen = (): void => {
      if (!document.fullscreenElement) setPresenting(false);
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && !e.defaultPrevented && stack.length === 0) {
        exitPresent();
      }
    };
    document.addEventListener("fullscreenchange", onFullscreen);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreen);
      document.removeEventListener("keydown", onKey);
    };
  }, [presenting, stack.length, exitPresent]);

  React.useEffect(
    () => () => {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => undefined);
      }
    },
    [],
  );

  // ─── Share ───
  const share = (): void => {
    const url = buildAppHashUrl(
      buildBidTabRoute(bid.bidNumber, "presentation", true),
    );
    copyTextToClipboard(url)
      .then((ok) => {
        setShareState(ok ? "copied" : "error");
        addToast(
          ok
            ? {
                type: "success",
                title: "Presentation link copied",
                message: "It opens this BID straight on the presentation.",
              }
            : { type: "error", title: "Could not copy the link", message: url },
        );
        window.clearTimeout(shareTimer.current);
        shareTimer.current = window.setTimeout(
          () => setShareState("idle"),
          SHARE_FEEDBACK_MS,
        );
      })
      .catch(() => undefined);
  };

  // ─── Export ───
  const runExport = (kind: ExportKind): void => {
    setExporting(kind);
    const task =
      kind === "pdf"
        ? exportPresentationPdf(
            model,
            [
              { title: "How the price is built", el: buildChartRef.current },
              { title: "Where the asset value is", el: assetChartRef.current },
              { title: "Effort", el: effortChartRef.current },
            ],
            model.colors.theme.cardBg,
          )
        : exportPresentationPptx(model);
    task
      .then(() =>
        addToast({
          type: "success",
          title: kind === "pdf" ? "PDF ready" : "PowerPoint ready",
          message: `BID ${bid.bidNumber} presentation downloaded.`,
        }),
      )
      .catch((err) => {
        console.error("Presentation export failed:", err);
        addToast({
          type: "error",
          title: "Export failed",
          message: "The presentation could not be generated. Try again.",
        });
      })
      .then(() => setExporting(null));
  };

  const nothingYet = model.items.length === 0 && model.totalUSD <= 0;
  const projectName =
    (bid.opportunityInfo && bid.opportunityInfo.projectName) || "";

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${presenting ? styles.presenting : ""}`}
    >
      <PresentationToolbar
        bidNumber={bid.bidNumber}
        projectName={projectName}
        currency={model.display.currency}
        onCurrency={setCurrency}
        canShowBRL={model.canShowBRL}
        shareState={shareState}
        onShare={share}
        exporting={exporting}
        onExport={runExport}
        presenting={presenting}
        onTogglePresent={togglePresent}
      />

      <PresentationHero model={model} />

      {nothingYet && (
        <EmptyState
          variant="glass"
          title="Nothing priced yet"
          description="Costs, hours and assets show up here as the BID is built."
        />
      )}

      <div className={styles.grid}>
        <div className={styles.span7}>
          <PresentationPriceBuildUp
            model={model}
            selectedStep={
              stack.length > 0 && stack[0].kind === "step" ? stack[0].step : null
            }
            onSelectStep={(step) => openDrawer({ kind: "step", step })}
            chartRef={buildChartRef}
          />
        </div>
        <div className={styles.span5}>
          <PresentationSupplyCards
            model={model}
            onSelect={(label) => openDrawer({ kind: "acquisition", label })}
          />
        </div>
        <div className={styles.span6}>
          <PresentationAssetValue
            model={model}
            category={category}
            onCategory={setCategory}
            onOpenItem={(key, list) => openDrawer({ kind: "item", key, list })}
            onOpenAssets={(cat) => openDrawer({ kind: "assets", category: cat })}
            chartRef={assetChartRef}
          />
        </div>
        <div className={styles.span6}>
          <PresentationTopItems
            model={model}
            category={category}
            onClearCategory={() => setCategory(null)}
            onOpenItem={(key, list) => openDrawer({ kind: "item", key, list })}
            onViewAll={() => openDrawer({ kind: "assets", category })}
          />
        </div>
        <div className={styles.span7}>
          <PresentationEffort
            model={model}
            onSelect={(effort, role) => openDrawer({ kind: "effort", effort, role })}
            chartRef={effortChartRef}
          />
        </div>
        <div className={styles.span5}>
          <PresentationCommercial model={model} onOpen={openDrawer} />
        </div>
      </div>

      <PresentationDrawer
        model={model}
        stack={stack}
        onClose={closeDrawer}
        onBack={backDrawer}
        onReplace={replaceTop}
        onPush={pushDrawer}
      />
    </div>
  );
};
