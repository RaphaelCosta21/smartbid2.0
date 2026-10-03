import { IBidFx, toUSDWithBidRates } from "../../costCalculations";
import {
  IXlColumnDef,
  NUM,
  XL_COLORS,
  XlSheet,
  XlValue,
  colOf,
  currencyFmt,
  pickRow,
} from "../excelStyles";
import { fmtUSD } from "../rows";

export interface ICurrencyLine {
  originalCurrency: string;
  totalCost: number;
  sectionId?: string | null;
}

export interface ITableGroup {
  id: string;
  title: string;
  color?: string;
}

export function curCode(c?: string): string {
  return (c || "USD").toUpperCase().trim() || "USD";
}

/** USD value of a line, or a red "No rate" marker (left out of the totals, like the tabs). */
export function usdCell(amount: number, currency: string, fx: IBidFx): XlValue {
  const usd = toUSDWithBidRates(amount || 0, currency, fx);
  return usd === null
    ? {
        value: "No rate",
        color: XL_COLORS.danger,
        italic: true,
        align: "right",
      }
    : usd;
}

export function moneyCell(amount: number, currency: string): XlValue {
  return { value: amount || 0, numFmt: currencyFmt(curCode(currency)) };
}

/** Same wording as BidFxNote. */
export function fxNotes(
  fx: IBidFx,
  currencies: string[],
): { rates: string; missing: string } {
  const used: string[] = [];
  currencies.forEach((c) => {
    const cur = curCode(c);
    if (cur !== "USD" && used.indexOf(cur) < 0) used.push(cur);
  });
  const missing = used.filter((c) => toUSDWithBidRates(1, c, fx) === null);
  const withRate = used
    .filter((c) => missing.indexOf(c) < 0)
    .map(
      (c) =>
        `1 USD = ${(1 / (toUSDWithBidRates(1, c, fx) as number)).toFixed(4)} ${c}`,
    );
  return {
    rates: withRate.length
      ? `Converted to USD with the rates registered on this BID: ${withRate.join(" · ")}.`
      : "",
    missing: missing.length
      ? `No exchange rate registered on this BID for ${missing.join(", ")} - these values are left out of the USD totals. Update the rates on the Overview tab.`
      : "",
  };
}

/**
 * Header + rows (unsectioned first, then each group with a subtotal band) + per-currency
 * subtotals. Returns the USD total of the lines that have a rate.
 */
export function writeCurrencyTable<T extends ICurrencyLine>(
  x: XlSheet,
  cols: IXlColumnDef[],
  items: T[],
  groups: ITableGroup[],
  fx: IBidFx,
  toRecord: (item: T) => Record<string, XlValue>,
): number {
  const span = x.lastCol;
  const totalCol = colOf(cols, "total");
  const usdCol = colOf(cols, "usd");
  const usdOf = (list: T[]): number =>
    list.reduce((s, i) => {
      const v = toUSDWithBidRates(i.totalCost || 0, i.originalCurrency, fx);
      return s + (v === null ? 0 : v);
    }, 0);

  x.header(cols);
  const write = (list: T[]): void =>
    list.forEach((i, idx) =>
      x.dataRow(cols, pickRow(cols, toRecord(i)), { zebra: idx % 2 === 1 }),
    );
  const ids = new Set(groups.map((g) => g.id));
  write(items.filter((i) => !i.sectionId || !ids.has(i.sectionId)));
  groups.forEach((g) => {
    const gi = items.filter((i) => i.sectionId === g.id);
    x.band(`${g.title || "Untitled Section"}   ·   ${gi.length} items`, span, {
      color: g.color,
      values: usdCol
        ? [{ col: usdCol, value: usdOf(gi), numFmt: NUM.usd }]
        : [],
    });
    write(gi);
  });

  const byCur: Record<string, number> = {};
  items.forEach((i) => {
    const c = curCode(i.originalCurrency);
    byCur[c] = (byCur[c] || 0) + (i.totalCost || 0);
  });
  const curs = Object.keys(byCur);
  if (curs.length > 1 || (curs.length === 1 && curs[0] !== "USD")) {
    curs.forEach((c) => {
      const lines = items.filter((i) => curCode(i.originalCurrency) === c);
      const usd = toUSDWithBidRates(byCur[c], c, fx);
      x.total(
        `Subtotal in ${c}`,
        span,
        [
          { col: totalCol, value: byCur[c], numFmt: currencyFmt(c) },
          usd === null
            ? { col: usdCol, value: "No rate" }
            : { col: usdCol, value: usdOf(lines), numFmt: NUM.usd },
        ],
        "sub",
      );
    });
  }
  return usdOf(items);
}

/** Grand total row + BRL equivalent + FX notes for a priced block. */
export function writeCurrencyFooter(
  x: XlSheet,
  label: string,
  usdCol: number,
  totalUSD: number,
  ptax: number,
  fx: IBidFx,
  currencies: string[],
): void {
  const span = x.lastCol;
  x.total(
    label,
    span,
    [{ col: usdCol, value: totalUSD, numFmt: NUM.usd }],
    "grand",
  );
  x.gap(6);
  x.note(
    `Total in BRL: R$ ${(totalUSD * ptax).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${fmtUSD(totalUSD)} × PTAX ${ptax > 0 ? ptax.toFixed(4) : "-"}).`,
    span,
    "muted",
  );
  const n = fxNotes(fx, currencies);
  if (n.rates) x.note(n.rates, span, "info");
  if (n.missing) x.note(n.missing, span, "warning");
}
