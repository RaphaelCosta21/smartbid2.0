/**
 * usePresentationModel — everything the BID Presentation page, its drawers and its exports
 * read, computed once per BID / currency. Colors are resolved hex values (charts + captures).
 */
import * as React from "react";
import { IBid, IQuotationItem } from "../models";
import { buildCostSummaryView, ICostSummaryView } from "../utils/costSummaryView";
import {
  buildHistoryIndex,
  buildPresentationItems,
  groupByAcquisition,
  IAcquisitionGroup,
  IHistoryIndex,
  IPresentationItem,
  rankItems,
} from "../utils/bidPresentation";
import {
  buildCommercialView,
  buildEffortView,
  buildFacts,
  buildItemInsights,
  buildPriceSteps,
  EffortKind,
  groupAssetsByCategory,
  IAssetGroup,
  ICommercialView,
  IDisplayCurrency,
  IEffortView,
  IItemInsight,
  IPresentationFact,
  IPriceStep,
  PriceStepKey,
} from "../utils/presentationView";
import { indexQuotations } from "../utils/quotationLinks";
import { formatCurrency, formatCurrencyCompact } from "../utils/formatters";
import { useQuotationStore } from "../stores/useQuotationStore";
import { useBids } from "./useBids";
import { ChartTheme, useChartTheme } from "./useChartTheme";

export interface IPresentationColors {
  step: Record<PriceStepKey, string>;
  effort: Record<EffortKind, string>;
  /** Resource-type color, stable across the treemap, list and drawers */
  category: (category: string) => string;
  theme: ChartTheme;
}

export interface IPresentationModel {
  bid: IBid;
  view: ICostSummaryView;
  display: IDisplayCurrency;
  /** BRL can be shown (the BID has a BRL rate) */
  canShowBRL: boolean;
  totalUSD: number;
  assetsUSD: number;
  items: IPresentationItem[];
  /** Priced items, most expensive first */
  ranked: IPresentationItem[];
  itemByKey: Map<string, IPresentationItem>;
  /** 1-based rank among priced items */
  rankOf: Map<string, number>;
  insights: Map<string, IItemInsight>;
  historyIndex: IHistoryIndex;
  steps: IPriceStep[];
  effort: IEffortView;
  commercial: ICommercialView;
  facts: IPresentationFact[];
  assetGroups: IAssetGroup[];
  acquisitionGroups: IAcquisitionGroup[];
  quotationIndex: Map<string, IQuotationItem>;
  colors: IPresentationColors;
  /** Display-currency formatters for USD amounts */
  money: (usd: number) => string;
  moneyCompact: (usd: number) => string;
}

export function usePresentationModel(
  bid: IBid,
  currency: "USD" | "BRL",
): IPresentationModel {
  const { bids } = useBids();
  const quotationItems = useQuotationStore((s) => s.items);
  const loadQuotations = useQuotationStore((s) => s.loadQuotations);
  const theme = useChartTheme();

  // Supplier quotes in the item drawer are resolved against the catalog
  React.useEffect(() => {
    void loadQuotations();
  }, [loadQuotations]);

  const view = React.useMemo(() => buildCostSummaryView(bid), [bid]);
  const ptax = view.fx.brlRate;
  const canShowBRL = ptax > 0;
  const display = React.useMemo<IDisplayCurrency>(
    () =>
      currency === "BRL" && canShowBRL
        ? { currency: "BRL", rate: ptax }
        : { currency: "USD", rate: 1 },
    [currency, canShowBRL, ptax],
  );

  const items = React.useMemo(() => buildPresentationItems(bid), [bid]);
  const ranked = React.useMemo(() => rankItems(items), [items]);
  const historyIndex = React.useMemo(() => buildHistoryIndex(bids), [bids]);
  const insights = React.useMemo(
    () => buildItemInsights(ranked, historyIndex, bid.bidNumber),
    [ranked, historyIndex, bid.bidNumber],
  );
  const quotationIndex = React.useMemo(
    () => indexQuotations(quotationItems),
    [quotationItems],
  );
  const steps = React.useMemo(() => buildPriceSteps(view), [view]);
  const effort = React.useMemo(() => buildEffortView(bid, ptax), [bid, ptax]);
  const commercial = React.useMemo(() => buildCommercialView(bid), [bid]);
  const facts = React.useMemo(() => buildFacts(bid), [bid]);
  const assetGroups = React.useMemo(
    () => groupAssetsByCategory(ranked),
    [ranked],
  );
  const acquisitionGroups = React.useMemo(
    () => groupByAcquisition(items).sort((a, b) => b.valueUSD - a.valueUSD || b.count - a.count),
    [items],
  );

  const lookups = React.useMemo(() => {
    const itemByKey = new Map<string, IPresentationItem>();
    items.forEach((i) => itemByKey.set(i.key, i));
    const rankOf = new Map<string, number>();
    ranked.forEach((i, idx) => rankOf.set(i.key, idx + 1));
    return { itemByKey, rankOf };
  }, [items, ranked]);

  const colors = React.useMemo<IPresentationColors>(() => {
    const categoryColor: Record<string, string> = {};
    assetGroups.forEach((g, i) => {
      categoryColor[g.category] = theme.categorical[i % theme.categorical.length];
    });
    return {
      step: {
        assets: theme.accent,
        engineering: theme.accentTertiary,
        onshore: theme.info,
        offshore: theme.accentSecondary,
        logistics: theme.warning,
        certifications: theme.success,
        prepMob: theme.categorical[5 % theme.categorical.length],
      },
      effort: {
        engineering: theme.accentTertiary,
        onshore: theme.info,
        offshore: theme.accentSecondary,
      },
      category: (c: string) => categoryColor[c] || theme.textMuted,
      theme,
    };
  }, [assetGroups, theme]);

  const money = React.useCallback(
    (usd: number) => formatCurrency(usd * display.rate, display.currency),
    [display],
  );
  const moneyCompact = React.useCallback(
    (usd: number) => formatCurrencyCompact(usd * display.rate, display.currency),
    [display],
  );

  return {
    bid,
    view,
    display,
    canShowBRL,
    totalUSD: view.summary.totalCostUSD,
    assetsUSD: view.summary.assetsCostUSD,
    items,
    ranked,
    itemByKey: lookups.itemByKey,
    rankOf: lookups.rankOf,
    insights,
    historyIndex,
    steps,
    effort,
    commercial,
    facts,
    assetGroups,
    acquisitionGroups,
    quotationIndex,
    colors,
    money,
    moneyCompact,
  };
}
