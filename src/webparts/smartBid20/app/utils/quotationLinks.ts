/**
 * quotationLinks — helpers for the item <-> quotation links stored inside a BID.
 * A link is kept by quotation id and resolved against the catalog at read time, so
 * editing a catalog quotation is reflected everywhere and unlinking never deletes it.
 */
import { differenceInCalendarDays } from "date-fns";
import { IBid, IQuotationItem, IQuotationLink } from "../models";
import { QUOTATION_DEFAULT_SLA_DAYS } from "../config/quotation.config";
import { makeId } from "./idGenerator";

/** Anything that can carry quotation links (asset row, sub-item cost, PCF cost) */
export interface IQuotationLinkHost {
  id: string;
  quotationLinks?: IQuotationLink[];
  quotationReference?: string | null;
  quotationFileUrl?: string | null;
}

export interface IResolvedQuotationLink {
  link: IQuotationLink;
  /** Null while pending, or when the quotation was deleted from the catalog */
  quote: IQuotationItem | null;
}

/** One supplier bar of the comparison chart */
export interface ISupplierQuoteBar {
  id: string;
  supplier: string;
  /** Amount in the BID display currency */
  value: number;
  leadTimeDays: number;
  isLowest: boolean;
  isSelected: boolean;
  isRental: boolean;
}

// ─── Dates ───

/** Local calendar day as yyyy-mm-dd (avoids the UTC day shift of toISOString) */
export function todayIso(): string {
  const d = new Date();
  const mm = `${d.getMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  d.setDate(d.getDate() + days);
  const mm = `${d.getMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** A pending request past its due date */
export function isLinkOverdue(link: IQuotationLink): boolean {
  return (
    link.status === "requested" &&
    !!link.dueDate &&
    link.dueDate.slice(0, 10) < todayIso()
  );
}

/** Days the supplier took to answer; null until both dates exist */
export function getResponseDays(link: IQuotationLink): number | null {
  if (!link.requestedDate || !link.responseDate) return null;
  const days = differenceInCalendarDays(
    new Date(link.responseDate.slice(0, 10)),
    new Date(link.requestedDate.slice(0, 10)),
  );
  return isNaN(days) ? null : Math.max(0, days);
}

/** Days a pending request has been waiting; null without a sent date */
export function getWaitingDays(link: IQuotationLink): number | null {
  if (link.status !== "requested" || !link.requestedDate) return null;
  const days = differenceInCalendarDays(
    new Date(todayIso()),
    new Date(link.requestedDate.slice(0, 10)),
  );
  return isNaN(days) ? null : Math.max(0, days);
}

// ─── Link factories ───

export function buildRequestLink(input: {
  supplier: string;
  requestedDate: string;
  dueDate?: string;
  notes?: string;
  createdBy?: string;
}): IQuotationLink {
  return {
    id: makeId("qlink"),
    quotationId: null,
    supplier: input.supplier.trim(),
    status: "requested",
    requestedDate: input.requestedDate,
    dueDate:
      input.dueDate ||
      addDaysIso(input.requestedDate, QUOTATION_DEFAULT_SLA_DAYS),
    notes: input.notes || "",
    isSelected: false,
    createdBy: input.createdBy,
    createdDate: new Date().toISOString(),
  };
}

export function buildReceivedLink(
  quote: IQuotationItem,
  createdBy?: string,
): IQuotationLink {
  return {
    id: makeId("qlink"),
    quotationId: quote.id,
    supplier: quote.supplier,
    status: "received",
    responseDate: quote.quotationDate || todayIso(),
    isSelected: false,
    createdBy,
    createdDate: new Date().toISOString(),
  };
}

// ─── Catalog resolution ───

export function indexQuotations(
  items: IQuotationItem[],
): Map<string, IQuotationItem> {
  const index = new Map<string, IQuotationItem>();
  (items || []).forEach((q) => index.set(q.id, q));
  return index;
}

const norm = (v?: string | null): string => (v || "").trim().toLowerCase();

/**
 * Items imported before links existed only carry the quotation's reference label.
 * Match it back to the catalog (reference + part number, file URL as tie-break) so
 * they show up as a linked quotation without rewriting the BID.
 */
function buildLegacyLink(
  host: IQuotationLinkHost,
  partNumber: string,
  index: Map<string, IQuotationItem>,
): IQuotationLink | null {
  if (!host.quotationReference) return null;
  const ref = norm(host.quotationReference);
  const pn = norm(partNumber);
  let candidates: IQuotationItem[] = [];
  index.forEach((q) => {
    if (norm(q.reference || "Quote") !== ref) return;
    if (pn && norm(q.partNumber) !== pn) return;
    candidates.push(q);
  });
  if (candidates.length > 1 && host.quotationFileUrl) {
    candidates = candidates.filter((q) => q.fileUrl === host.quotationFileUrl);
  }
  if (candidates.length !== 1) return null;
  const q = candidates[0];
  return {
    id: `legacy-${q.id}`,
    quotationId: q.id,
    supplier: q.supplier,
    status: "received",
    responseDate: q.quotationDate || undefined,
    isSelected: true,
  };
}

/** Stored links, or the one inferred from a pre-links import */
export function getEffectiveLinks(
  host: IQuotationLinkHost,
  partNumber: string,
  index: Map<string, IQuotationItem>,
): IQuotationLink[] {
  if (host.quotationLinks && host.quotationLinks.length > 0) {
    return host.quotationLinks;
  }
  const legacy = buildLegacyLink(host, partNumber, index);
  return legacy ? [legacy] : [];
}

export function resolveLinks(
  links: IQuotationLink[],
  index: Map<string, IQuotationItem>,
): IResolvedQuotationLink[] {
  return links.map((link) => ({
    link,
    quote: link.quotationId ? index.get(link.quotationId) || null : null,
  }));
}

// ─── Pricing ───

/** Per-unit price (acquisition) or day rate (rental) in USD */
export function getQuoteUnitUSD(quote: IQuotationItem): number {
  return quote.costUSD || quote.cost || 0;
}

/**
 * Value of a quotation for a line: unit price x qty, or day rate x days x qty for rentals —
 * the same basis the Assets Breakdown uses, so bars compare like for like.
 */
export function getQuoteComparableUSD(
  quote: IQuotationItem,
  qty: number,
  rentalDays: number,
): number {
  const unit = getQuoteUnitUSD(quote);
  const q = qty > 0 ? qty : 1;
  return quote.type === "rental"
    ? unit * (rentalDays > 0 ? rentalDays : 1) * q
    : unit * q;
}

/** Items whose cost isn't the plain unit price: the quotation can be tracked but not applied */
export function getPriceLockReason(a: {
  availabilitySplits?: unknown[];
  costFromSubItems?: boolean;
  costFromPCF?: boolean;
}): string | null {
  if (a.availabilitySplits && a.availabilitySplits.length > 0) {
    return "The item's cost is set per availability split";
  }
  if (a.costFromSubItems || a.costFromPCF) {
    return "The item's cost is rolled up from its sub-items";
  }
  return null;
}

/**
 * Why a quotation's price can't drive an item (null = it can). A day rate can't be used as a
 * purchase price, and an acquisition price can't feed a rental's day rate.
 */
export function getAdoptBlockReason(
  quote: IQuotationItem | null,
  itemIsRental: boolean,
): string | null {
  if (!quote) return "Quotation not available";
  if (getQuoteUnitUSD(quote) <= 0) return "This quotation has no price";
  const quoteIsRental = quote.type === "rental";
  if (itemIsRental && !quoteIsRental) {
    return "The item is Rental - this is an acquisition quotation";
  }
  if (!itemIsRental && quoteIsRental) {
    return "Set the item's Acq. Type to Rental to use a day rate";
  }
  return null;
}

/**
 * Currency the BID is presented in. formatCurrency only renders BRL and USD, so any other
 * BID currency (or a missing PTAX) falls back to USD instead of showing a wrong symbol.
 */
export function getBidDisplayCurrency(bid: Pick<IBid, "opportunityInfo">): {
  currency: "USD" | "BRL";
  rate: number;
} {
  const info = bid.opportunityInfo;
  const currency = ((info && info.currency) || "USD").toUpperCase();
  if (currency === "BRL" && info && info.ptax > 0) {
    return { currency: "BRL", rate: info.ptax };
  }
  return { currency: "USD", rate: 1 };
}

/** Priced, answered quotations as chart bars — cheapest first */
export function buildSupplierQuoteBars(
  resolved: IResolvedQuotationLink[],
  qty: number,
  rentalDays: number,
  rate: number,
): ISupplierQuoteBar[] {
  const bars: ISupplierQuoteBar[] = [];
  resolved.forEach(({ link, quote }) => {
    if (link.status !== "received" || !quote) return;
    const usd = getQuoteComparableUSD(quote, qty, rentalDays);
    if (usd <= 0) return;
    bars.push({
      id: link.id,
      supplier: quote.supplier || link.supplier,
      value: usd * rate,
      leadTimeDays: quote.leadTimeDays || 0,
      isLowest: false,
      isSelected: link.isSelected,
      isRental: quote.type === "rental",
    });
  });
  bars.sort((a, b) => a.value - b.value);
  if (bars.length > 1) {
    const min = bars[0].value;
    bars.forEach((b) => {
      b.isLowest = b.value === min;
    });
  }
  return bars;
}

/** Id of the cheapest priced link, to suggest it when nothing is adopted yet */
export function findLowestLinkId(
  resolved: IResolvedQuotationLink[],
  qty: number,
  rentalDays: number,
): string | null {
  const bars = buildSupplierQuoteBars(resolved, qty, rentalDays, 1);
  return bars.length > 1 ? bars[0].id : null;
}

// ─── Link list mutations (pure) ───

export function selectLink(
  links: IQuotationLink[],
  linkId: string | null,
): IQuotationLink[] {
  return links.map((l) => ({ ...l, isSelected: l.id === linkId }));
}

export function removeLink(
  links: IQuotationLink[],
  linkId: string,
): IQuotationLink[] {
  return links.filter((l) => l.id !== linkId);
}
