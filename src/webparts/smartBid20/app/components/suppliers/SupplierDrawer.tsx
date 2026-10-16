/**
 * SupplierDrawer — Read-only side panel with a supplier's profile, contacts and
 * the quotations registered for it (same layout as the Past Bids drawer).
 */
import * as React from "react";
import { ExternalLink, Mail, Pencil, Phone, X } from "lucide-react";
import { IConfigOption, IQuotationItem, ISupplier } from "../../models";
import { QuotationService } from "../../services/QuotationService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import styles from "./SupplierDrawer.module.scss";

interface SupplierDrawerProps {
  supplier: ISupplier;
  /** This supplier's quotations, most recent first. */
  quotations: IQuotationItem[];
  supplyCategories: string[];
  serviceTypesById: Record<string, IConfigOption>;
  onClose: () => void;
  onEdit?: () => void;
  onViewQuotations: () => void;
}

const RECENT_QUOTATIONS = 5;
const MAX_PART_NUMBERS = 30;

const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

export const SupplierDrawer: React.FC<SupplierDrawerProps> = ({
  supplier,
  quotations,
  supplyCategories,
  serviceTypesById,
  onClose,
  onEdit,
  onViewQuotations,
}) => {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const serviceTypes = supplier.serviceTypes
    .map((id) => serviceTypesById[id])
    .filter((o): o is IConfigOption => !!o);
  const contacts = supplier.contacts.filter(
    (c) => c.name || c.email || c.phone,
  );
  const lastQuotation = quotations.length ? quotations[0] : undefined;

  const renderChips = (
    values: string[],
    empty: string,
    variant?: string,
  ): React.ReactNode =>
    values.length ? (
      <div className={styles.chips}>
        {values.map((v) => (
          <span key={v} className={`${styles.chip} ${variant || ""}`}>
            {v}
          </span>
        ))}
      </div>
    ) : (
      <span className={styles.emptyText}>{empty}</span>
    );

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={`Supplier ${supplier.name}`}
      >
        <div className={styles.header}>
          {supplier.logoUrl ? (
            <img
              className={styles.logo}
              src={supplier.logoUrl}
              alt={`Logo ${supplier.name}`}
            />
          ) : (
            <span className={styles.logoFallback}>
              {initials(supplier.name)}
            </span>
          )}
          <div className={styles.headerInfo}>
            <span className={styles.name}>{supplier.name || "-"}</span>
            <div className={styles.meta}>
              <span>{supplier.country || "Country not set"}</span>
              <span
                className={`${styles.statusBadge} ${supplier.active ? styles.statusActive : styles.statusInactive}`}
              >
                {supplier.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <div className={styles.sectionTitle}>About</div>
            {supplier.description ? (
              <p className={styles.text}>{supplier.description}</p>
            ) : (
              <span className={styles.emptyText}>
                No description yet. Use Edit to write one or generate it with
                AI.
              </span>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionTitle}>Service types</div>
            {serviceTypes.length ? (
              <div className={styles.chips}>
                {serviceTypes.map((o) => (
                  <span
                    key={o.id}
                    className={`${styles.chip} ${styles.chipAccent}`}
                    title={o.isActive === false ? "Inactive service type" : ""}
                  >
                    {o.label}
                    {o.isActive === false ? " (inactive)" : ""}
                  </span>
                ))}
              </div>
            ) : (
              <span className={styles.emptyText}>Not classified yet</span>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionTitle}>Keywords</div>
            {renderChips(supplier.keywords, "No keywords yet")}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionTitle}>Supply categories</div>
            {renderChips(
              supplyCategories,
              "No quotations registered yet",
              styles.chipInfo,
            )}
          </section>

          {supplier.aliases.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionTitle}>Also known as</div>
              <ul className={styles.aliasList}>
                {supplier.aliases.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </section>
          )}

          <section className={styles.section}>
            <div className={styles.sectionTitle}>Contacts</div>
            {contacts.length ? (
              <div className={styles.contactList}>
                {contacts.map((c, i) => (
                  <div key={i} className={styles.contact}>
                    <span className={styles.contactName}>{c.name || "-"}</span>
                    {c.email && (
                      <a
                        className={styles.contactLink}
                        href={`mailto:${c.email}`}
                      >
                        <Mail size={12} /> {c.email}
                      </a>
                    )}
                    {c.phone && (
                      <a className={styles.contactLink} href={`tel:${c.phone}`}>
                        <Phone size={12} /> {c.phone}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span className={styles.emptyText}>No contacts registered</span>
            )}
          </section>

          {supplier.partNumbers.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionTitle}>
                Part numbers ({supplier.partNumbers.length})
              </div>
              <div className={styles.chips}>
                {supplier.partNumbers.slice(0, MAX_PART_NUMBERS).map((pn) => (
                  <span key={pn} className={`${styles.chip} ${styles.mono}`}>
                    {pn}
                  </span>
                ))}
                {supplier.partNumbers.length > MAX_PART_NUMBERS && (
                  <span className={styles.muted}>
                    +{supplier.partNumbers.length - MAX_PART_NUMBERS} more
                  </span>
                )}
              </div>
            </section>
          )}

          {supplier.notes && (
            <section className={styles.section}>
              <div className={styles.sectionTitle}>Notes</div>
              <p className={styles.text}>{supplier.notes}</p>
            </section>
          )}

          <section className={styles.section}>
            <div className={styles.sectionTitle}>Quotations</div>
            {quotations.length === 0 ? (
              <span className={styles.emptyText}>
                No quotations registered for this supplier yet.
              </span>
            ) : (
              <>
                <span className={styles.muted}>
                  {quotations.length} quotation item
                  {quotations.length > 1 ? "s" : ""}
                  {lastQuotation && lastQuotation.quotationDate
                    ? `, last on ${formatDate(lastQuotation.quotationDate)}`
                    : ""}
                </span>
                <div className={styles.quoteList}>
                  {quotations.slice(0, RECENT_QUOTATIONS).map((q) => (
                    <div key={q.id} className={styles.quoteItem}>
                      <div className={styles.quoteTop}>
                        <span className={styles.quotePn}>
                          {q.partNumber || "-"}
                        </span>
                        <span className={styles.quoteCost}>
                          {formatCurrency(q.costUSD, "USD")}
                        </span>
                      </div>
                      <span className={styles.quoteDesc} title={q.description}>
                        {q.description || "-"}
                      </span>
                      <div className={styles.quoteMeta}>
                        <span>
                          {q.quotationDate ? formatDate(q.quotationDate) : "-"}
                        </span>
                        {q.reference && <span>REF {q.reference}</span>}
                        {q.fileUrl && (
                          <a
                            className={styles.contactLink}
                            href={QuotationService.getFileOpenUrl(q.fileUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink size={12} /> File
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>

        <div className={styles.footer}>
          {onEdit && (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={onEdit}
            >
              <Pencil size={14} /> Edit supplier
            </button>
          )}
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={onViewQuotations}
          >
            View in Quotations
          </button>
        </div>
      </aside>
    </>
  );
};
