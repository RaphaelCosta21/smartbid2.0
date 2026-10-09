/**
 * LinkedQuotationsPanel — top of the Quotations drawer of an Assets Breakdown item.
 * Lists every quotation requested/received for the item, lets the user adopt one price,
 * track request/response dates and unlink (the quotation itself stays in the catalog).
 */
import * as React from "react";
import { Check, Paperclip, Pencil, Trash2 } from "lucide-react";
import { IQuotationItem, IQuotationLink } from "../../models";
import { QuotationService } from "../../services/QuotationService";
import { QUOTATION_DEFAULT_SLA_DAYS } from "../../config/quotation.config";
import {
  formatAmount,
  formatCurrency,
  formatDate,
} from "../../utils/formatters";
import {
  addDaysIso,
  buildSupplierQuoteBars,
  getAdoptBlockReason,
  getQuoteUnitUSD,
  getResponseDays,
  getWaitingDays,
  IResolvedQuotationLink,
  resolveLinks,
  todayIso,
} from "../../utils/quotationLinks";
import { SupplierQuoteBars } from "../charts/SupplierQuoteBars";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { QuotationStatusChip } from "./QuotationStatusChip";
import styles from "./LinkedQuotationsPanel.module.scss";

export type QuotationLinkPatch = Partial<
  Pick<
    IQuotationLink,
    "requestedDate" | "dueDate" | "responseDate" | "notes" | "status"
  >
>;

export interface IQuotationRequestInput {
  supplier: string;
  requestedDate: string;
  dueDate: string;
  notes: string;
}

export interface LinkedQuotationsPanelProps {
  links: IQuotationLink[];
  index: Map<string, IQuotationItem>;
  catalog: IQuotationItem[];
  partNumber: string;
  qty: number;
  rentalDays: number;
  itemIsRental: boolean;
  /** Set when the item's cost can't take a quotation price (splits, roll-up) */
  priceLockReason: string | null;
  /** Price currently on the item in USD: unit cost, or day rate for a rental */
  itemRateUSD: number;
  displayCurrency: { currency: "USD" | "BRL"; rate: number };
  readOnly: boolean;
  /** True until the quotation catalog has been loaded (links can't be resolved yet) */
  loading: boolean;
  /** Reference imported before links existed that couldn't be matched to the catalog */
  legacyReference?: { reference: string; fileUrl?: string | null } | null;
  onSelect: (linkId: string) => void;
  onRemove: (linkId: string) => void;
  onLinkExisting: (quote: IQuotationItem) => void;
  onRegisterRequest: (input: IQuotationRequestInput) => void;
  onUpdateLink: (linkId: string, patch: QuotationLinkPatch) => void;
  onRespond: (link: IQuotationLink) => void;
}

const MAX_CATALOG_RESULTS = 8;

/** Shown above the form while it answers a pending request */
export const QuotationRespondBanner: React.FC<{
  supplier: string;
  onCancel: () => void;
}> = ({ supplier, onCancel }) => (
  <div className={styles.respondBanner}>
    <span>
      Registering the response from <strong>{supplier}</strong>. The first item
      saved answers the request.
    </span>
    <button type="button" className={styles.linkBtn} onClick={onCancel}>
      Cancel
    </button>
  </div>
);

const isRealPn = (pn: string): boolean => {
  const v = (pn || "").trim().toUpperCase();
  return !!v && v !== "TBD" && v !== "TBC";
};

export const LinkedQuotationsPanel: React.FC<LinkedQuotationsPanelProps> = ({
  links,
  index,
  catalog,
  partNumber,
  qty,
  rentalDays,
  itemIsRental,
  priceLockReason,
  itemRateUSD,
  displayCurrency,
  readOnly,
  loading,
  legacyReference,
  onSelect,
  onRemove,
  onLinkExisting,
  onRegisterRequest,
  onUpdateLink,
  onRespond,
}) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [removeId, setRemoveId] = React.useState<string | null>(null);

  const [linkQuery, setLinkQuery] = React.useState(
    isRealPn(partNumber) ? partNumber.trim() : "",
  );
  const [reqSupplier, setReqSupplier] = React.useState("");
  const [reqSent, setReqSent] = React.useState(todayIso());
  const [reqDue, setReqDue] = React.useState(
    addDaysIso(todayIso(), QUOTATION_DEFAULT_SLA_DAYS),
  );
  const [reqDueTouched, setReqDueTouched] = React.useState(false);
  const [reqNotes, setReqNotes] = React.useState("");

  const resolved = React.useMemo(
    () => resolveLinks(links, index),
    [links, index],
  );

  const ordered = React.useMemo(() => {
    const rank = (r: IResolvedQuotationLink): number =>
      r.link.status === "received" ? 0 : r.link.status === "requested" ? 1 : 2;
    const price = (r: IResolvedQuotationLink): number =>
      r.quote ? getQuoteUnitUSD(r.quote) : Number.MAX_VALUE;
    return resolved.slice().sort((a, b) => {
      const byRank = rank(a) - rank(b);
      if (byRank !== 0) return byRank;
      if (rank(a) === 0) {
        const pa = price(a);
        const pb = price(b);
        return pa === pb ? 0 : pa < pb ? -1 : 1;
      }
      return (a.link.dueDate || "").localeCompare(b.link.dueDate || "");
    });
  }, [resolved]);

  const bars = React.useMemo(
    () =>
      buildSupplierQuoteBars(resolved, qty, rentalDays, displayCurrency.rate),
    [resolved, qty, rentalDays, displayCurrency.rate],
  );

  const supplierOptions = React.useMemo(() => {
    const seen: Record<string, boolean> = {};
    const out: string[] = [];
    catalog.forEach((q) => {
      const name = (q.supplier || "").trim();
      if (name && !seen[name.toLowerCase()]) {
        seen[name.toLowerCase()] = true;
        out.push(name);
      }
    });
    return out.sort();
  }, [catalog]);

  const linkedQuotationIds = React.useMemo(() => {
    const ids: Record<string, boolean> = {};
    links.forEach((l) => {
      if (l.quotationId) ids[l.quotationId] = true;
    });
    return ids;
  }, [links]);

  const catalogMatches = React.useMemo(() => {
    const q = linkQuery.trim().toLowerCase();
    if (!q) return [];
    return catalog
      .filter(
        (c) =>
          !linkedQuotationIds[c.id] &&
          [c.partNumber, c.description, c.supplier, c.reference].some(
            (f) => (f || "").toLowerCase().indexOf(q) >= 0,
          ),
      )
      .sort((a, b) =>
        (b.quotationDate || "").localeCompare(a.quotationDate || ""),
      );
  }, [catalog, linkQuery, linkedQuotationIds]);

  const [requestOpen, setRequestOpen] = React.useState(false);
  const [linkOpen, setLinkOpen] = React.useState(
    () => links.length === 0 && isRealPn(partNumber),
  );

  /** Why a quotation's price can't drive this item (null = it can) */
  const adoptBlockReason = (quote: IQuotationItem | null): string | null =>
    priceLockReason || getAdoptBlockReason(quote, itemIsRental);

  const submitRequest = (): void => {
    if (!reqSupplier.trim()) return;
    onRegisterRequest({
      supplier: reqSupplier.trim(),
      requestedDate: reqSent,
      dueDate: reqDue,
      notes: reqNotes.trim(),
    });
    setReqSupplier("");
    setReqNotes("");
    setReqSent(todayIso());
    setReqDue(addDaysIso(todayIso(), QUOTATION_DEFAULT_SLA_DAYS));
    setReqDueTouched(false);
    setRequestOpen(false);
  };

  const removeTarget = resolved.find((r) => r.link.id === removeId) || null;

  const renderCard = (r: IResolvedQuotationLink): React.ReactNode => {
    const { link, quote } = r;
    const unitUSD = quote ? getQuoteUnitUSD(quote) : 0;
    const blockReason = adoptBlockReason(quote);
    const priceDiffers =
      !priceLockReason &&
      link.isSelected &&
      !!quote &&
      Math.abs(unitUSD - itemRateUSD) > 0.005;
    const responseDays = getResponseDays(link);
    const waitingDays = getWaitingDays(link);
    const isEditing = editingId === link.id && !readOnly;
    const cardClass = link.isSelected
      ? `${styles.card} ${styles.cardSelected}`
      : styles.card;

    return (
      <div key={link.id} className={cardClass}>
        <div className={styles.cardTop}>
          <span className={styles.supplier}>
            {quote?.supplier || link.supplier}
          </span>
          <QuotationStatusChip link={link} />
          {link.isSelected && (
            <span className={styles.inUse}>
              <Check size={12} /> In use
            </span>
          )}
          {!readOnly && (
            <span className={styles.cardTools}>
              <button
                type="button"
                className={styles.iconBtn}
                title="Edit dates and notes"
                onClick={() => setEditingId(isEditing ? null : link.id)}
              >
                <Pencil size={13} />
              </button>
              <button
                type="button"
                className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                title="Remove from this item"
                onClick={() => setRemoveId(link.id)}
              >
                <Trash2 size={13} />
              </button>
            </span>
          )}
        </div>

        {quote ? (
          <div className={styles.cardMeta}>
            <span className={styles.price}>
              {formatAmount(quote.cost, quote.currency)}
              {quote.type === "rental" ? " / day" : ""}
            </span>
            {quote.currency !== displayCurrency.currency && unitUSD > 0 && (
              <span className={styles.approx}>
                ≈{" "}
                {formatCurrency(
                  unitUSD * displayCurrency.rate,
                  displayCurrency.currency,
                )}
              </span>
            )}
            <span className={styles.typeTag}>
              {quote.type === "rental" ? "Rental" : "Acquisition"}
            </span>
            {quote.reference && <span>Ref {quote.reference}</span>}
            {quote.leadTimeDays > 0 && (
              <span>{quote.leadTimeDays}d lead time</span>
            )}
            {quote.fileUrl && (
              <a
                className={styles.fileLink}
                href={QuotationService.getFileOpenUrl(quote.fileUrl)}
                target="_blank"
                rel="noopener noreferrer"
                title={quote.fileName || "Open quotation file"}
              >
                <Paperclip size={12} /> File
              </a>
            )}
          </div>
        ) : link.status === "received" ? (
          <div className={styles.cardMeta}>
            <span className={styles.warnText}>
              This quotation was removed from the catalog.
            </span>
          </div>
        ) : null}

        <div className={styles.cardDates}>
          {link.requestedDate && (
            <span>Sent {formatDate(link.requestedDate)}</span>
          )}
          {link.status === "requested" && link.dueDate && (
            <span>Due {formatDate(link.dueDate)}</span>
          )}
          {link.status === "requested" && waitingDays !== null && (
            <span>Waiting {waitingDays}d</span>
          )}
          {link.status !== "requested" && link.responseDate && (
            <span>
              {link.status === "declined" ? "Declined" : "Answered"}{" "}
              {formatDate(link.responseDate)}
            </span>
          )}
          {responseDays !== null && <span>Response time {responseDays}d</span>}
        </div>

        {link.notes && !isEditing && (
          <p className={styles.notes}>{link.notes}</p>
        )}

        {priceDiffers && (
          <div className={styles.diffRow}>
            <span>Item price differs from this quotation.</span>
            {!readOnly && !blockReason && (
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => onSelect(link.id)}
              >
                Re-apply price
              </button>
            )}
          </div>
        )}

        {isEditing && (
          <div className={styles.editGrid}>
            <label>
              Sent
              <input
                type="date"
                value={(link.requestedDate || "").slice(0, 10)}
                onChange={(e) =>
                  onUpdateLink(link.id, { requestedDate: e.target.value })
                }
              />
            </label>
            {link.status === "requested" ? (
              <label>
                Due
                <input
                  type="date"
                  value={(link.dueDate || "").slice(0, 10)}
                  onChange={(e) =>
                    onUpdateLink(link.id, { dueDate: e.target.value })
                  }
                />
              </label>
            ) : (
              <label>
                {link.status === "declined" ? "Declined on" : "Answered on"}
                <input
                  type="date"
                  value={(link.responseDate || "").slice(0, 10)}
                  onChange={(e) =>
                    onUpdateLink(link.id, { responseDate: e.target.value })
                  }
                />
              </label>
            )}
            <label className={styles.editFull}>
              Notes
              <textarea
                rows={2}
                value={link.notes || ""}
                onChange={(e) =>
                  onUpdateLink(link.id, { notes: e.target.value })
                }
                placeholder="Follow-up notes…"
              />
            </label>
          </div>
        )}

        {!readOnly && (
          <div className={styles.cardActions}>
            {link.status === "received" && quote && !link.isSelected && (
              <button
                type="button"
                className={styles.primaryBtn}
                disabled={!!blockReason}
                title={blockReason || "Use this quotation's price on the item"}
                onClick={() => onSelect(link.id)}
              >
                Use this price
              </button>
            )}
            {link.status === "requested" && (
              <>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => onRespond(link)}
                >
                  Register response
                </button>
                <button
                  type="button"
                  className={styles.ghostBtn}
                  onClick={() =>
                    onUpdateLink(link.id, {
                      status: "declined",
                      responseDate: todayIso(),
                    })
                  }
                >
                  Supplier declined
                </button>
              </>
            )}
            {link.status === "declined" && (
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() =>
                  onUpdateLink(link.id, {
                    status: "requested",
                    responseDate: "",
                  })
                }
              >
                Reopen request
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.headRow}>
        <h3>Quotations for this item</h3>
        <span className={styles.count}>{links.length}</span>
      </div>

      {!loading && bars.length >= 2 && (
        <div className={styles.chart}>
          <SupplierQuoteBars
            bars={bars}
            currency={displayCurrency.currency}
            title="Price comparison"
          />
        </div>
      )}

      {loading && links.length > 0 ? (
        <p className={styles.empty}>Loading quotations…</p>
      ) : ordered.length === 0 ? (
        <p className={styles.empty}>
          {readOnly
            ? "No quotations linked to this item."
            : "No quotations yet. Add one below, link an existing one, or register a request sent to a supplier."}
        </p>
      ) : (
        <div className={styles.list}>{ordered.map(renderCard)}</div>
      )}

      {ordered.length === 0 && legacyReference && (
        <p className={styles.legacy}>
          Price imported from “{legacyReference.reference}”, which isn’t in the
          catalog anymore.
          {legacyReference.fileUrl && (
            <>
              {" "}
              <a
                className={styles.fileLink}
                href={QuotationService.getFileOpenUrl(legacyReference.fileUrl)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Paperclip size={12} /> File
              </a>
            </>
          )}
        </p>
      )}

      {!readOnly && (
        <>
          <div className={styles.section}>
            <button
              type="button"
              className={styles.sectionToggle}
              onClick={() => setRequestOpen((v) => !v)}
              aria-expanded={requestOpen}
            >
              <span aria-hidden>{requestOpen ? "▼" : "▶"}</span> Request a
              quotation
            </button>
            {requestOpen && (
              <div className={styles.sectionBody}>
                <p className={styles.sectionHint}>
                  Register a request already sent to a supplier. It stays
                  Awaiting until you register the response.
                </p>
                <div className={styles.editGrid}>
                  <label className={styles.editFull}>
                    Supplier *
                    <input
                      type="text"
                      list="quotation-supplier-options"
                      value={reqSupplier}
                      onChange={(e) => setReqSupplier(e.target.value)}
                      placeholder="Vendor name..."
                    />
                    <datalist id="quotation-supplier-options">
                      {supplierOptions.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </label>
                  <label>
                    Sent on
                    <input
                      type="date"
                      value={reqSent}
                      onChange={(e) => {
                        setReqSent(e.target.value);
                        if (!reqDueTouched && e.target.value) {
                          setReqDue(
                            addDaysIso(
                              e.target.value,
                              QUOTATION_DEFAULT_SLA_DAYS,
                            ),
                          );
                        }
                      }}
                    />
                  </label>
                  <label>
                    Response due
                    <input
                      type="date"
                      value={reqDue}
                      onChange={(e) => {
                        setReqDue(e.target.value);
                        setReqDueTouched(true);
                      }}
                    />
                  </label>
                  <label className={styles.editFull}>
                    Notes
                    <textarea
                      rows={2}
                      value={reqNotes}
                      onChange={(e) => setReqNotes(e.target.value)}
                      placeholder="Contact, scope sent, …"
                    />
                  </label>
                </div>
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.primaryBtn}
                    disabled={!reqSupplier.trim() || !reqSent}
                    onClick={submitRequest}
                  >
                    Register request
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.section}>
            <button
              type="button"
              className={styles.sectionToggle}
              onClick={() => setLinkOpen((v) => !v)}
              aria-expanded={linkOpen}
            >
              <span aria-hidden>{linkOpen ? "▼" : "▶"}</span> Link an existing
              quotation
            </button>
            {linkOpen && (
              <div className={styles.sectionBody}>
                <input
                  type="text"
                  className={styles.searchInput}
                  value={linkQuery}
                  onChange={(e) => setLinkQuery(e.target.value)}
                  placeholder="Search part number, description, supplier or ref…"
                />
                {catalogMatches.length === 0 ? (
                  <p className={styles.sectionHint}>
                    {linkQuery.trim()
                      ? "No matching quotations in the catalog."
                      : "Type a part number, description or supplier to search the catalog."}
                  </p>
                ) : (
                  <div className={styles.pickList}>
                    {catalogMatches.slice(0, MAX_CATALOG_RESULTS).map((q) => (
                      <div key={q.id} className={styles.pickRow}>
                        <div className={styles.pickMain}>
                          <span className={styles.pickPn}>{q.partNumber}</span>
                          <span className={styles.pickDesc}>
                            {q.description}
                          </span>
                          <span className={styles.pickMeta}>
                            {q.supplier} · {formatAmount(q.cost, q.currency)}
                            {q.type === "rental" ? " / day" : ""}
                            {q.quotationDate
                              ? ` · ${formatDate(q.quotationDate)}`
                              : ""}
                          </span>
                        </div>
                        <button
                          type="button"
                          className={styles.ghostBtn}
                          onClick={() => onLinkExisting(q)}
                        >
                          Link
                        </button>
                      </div>
                    ))}
                    {catalogMatches.length > MAX_CATALOG_RESULTS && (
                      <p className={styles.sectionHint}>
                        {catalogMatches.length - MAX_CATALOG_RESULTS} more —
                        refine the search.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={!!removeTarget}
        title="Remove from this item?"
        message={
          removeTarget && removeTarget.quote
            ? `The ${removeTarget.quote.supplier} quotation will no longer be linked to this item. It stays in the Quotations catalog.`
            : "This request will be removed from the item."
        }
        confirmLabel="Remove"
        variant="danger"
        onConfirm={() => {
          if (removeId) onRemove(removeId);
          setRemoveId(null);
        }}
        onCancel={() => setRemoveId(null)}
      />
    </div>
  );
};
