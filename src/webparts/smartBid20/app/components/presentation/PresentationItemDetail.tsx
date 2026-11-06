/**
 * PresentationItemDetail — drawer body for one cost item: value and share, what makes up
 * the price, item facts, supplier quotes and where the price sits among past BIDs.
 */
import * as React from "react";
import { IPresentationModel } from "../../hooks/usePresentationModel";
import { acquisitionToken, IPresentationItem } from "../../utils/bidPresentation";
import { buildItemInsights } from "../../utils/presentationView";
import {
  buildSupplierQuoteBars,
  getEffectiveLinks,
  resolveLinks,
} from "../../utils/quotationLinks";
import { formatNumber, formatSignedPercent } from "../../utils/formatters";
import { DotStripPlot, DotStripPoint } from "../charts/DotStripPlot";
import { SupplierQuoteBars } from "../charts/SupplierQuoteBars";
import styles from "./PresentationItemDetail.module.scss";

export interface PresentationItemDetailProps {
  model: IPresentationModel;
  item: IPresentationItem;
}

const MAX_PRIOR = 6;

export const PresentationItemDetail: React.FC<PresentationItemDetailProps> = ({
  model,
  item,
}) => {
  const { money, display, totalUSD, quotationIndex, colors } = model;

  const insight = React.useMemo(
    () =>
      model.insights.get(item.key) ||
      buildItemInsights([item], model.historyIndex, model.bid.bidNumber).get(
        item.key,
      ),
    [model.insights, model.historyIndex, model.bid.bidNumber, item],
  );
  const records = insight ? insight.records : [];
  const priced = records.filter((r) => r.totalUSD > 0);
  const med = insight ? insight.medianUSD : null;
  const delta = insight ? insight.deltaPct : null;

  const bars = React.useMemo(() => {
    const links = getEffectiveLinks(item.asset, item.partNumber, quotationIndex);
    const qty =
      (item.scopeItem.qtyOperational || 0) + (item.scopeItem.qtySpare || 0) || 1;
    return buildSupplierQuoteBars(
      resolveLinks(links, quotationIndex),
      qty,
      item.asset.rentalDays || 0,
      display.rate,
    );
  }, [item, quotationIndex, display.rate]);

  const parts = [
    { key: "own", label: "Equipment", value: item.ownUSD, color: "var(--primary-accent)" },
    { key: "fees", label: "Services & fees", value: item.feesUSD, color: "var(--warning)" },
    { key: "sub", label: "Sub-items", value: item.subItemsUSD, color: "var(--secondary-accent)" },
    { key: "pcf", label: "PCF", value: item.pcfUSD, color: "var(--tertiary-accent)" },
  ].filter((p) => p.value > 0);
  const partsTotal = parts.reduce((s, p) => s + p.value, 0);
  const extrasOnly = item.ownUSD <= 0 && partsTotal > 0;

  const qty = (item.scopeItem.qtyOperational || 0) + (item.scopeItem.qtySpare || 0);
  const facts: { label: string; value: string }[] = [
    { label: "Part number", value: item.hasPn ? item.partNumber : "TBD" },
    {
      label: "Quantity",
      value: qty
        ? `${formatNumber(qty)}${item.scopeItem.qtySpare ? ` (${item.scopeItem.qtySpare} spare)` : ""}`
        : "",
    },
    { label: "Supplier", value: item.asset.supplier || "" },
    {
      label: "Lead time",
      value: item.asset.leadTimeDays > 0 ? `${item.asset.leadTimeDays} days` : "",
    },
    {
      label: "Rental",
      value:
        item.asset.rentalDays && item.asset.rentalDays > 0
          ? `${item.asset.rentalDays} days`
          : "",
    },
    { label: "Cost category", value: item.asset.costCategory || "" },
    { label: "Cost reference", value: item.asset.costReference || "" },
  ].filter((f) => !!f.value);

  const prior = (() => {
    const seen: Record<string, boolean> = {};
    return records
      .filter((r) => {
        if (seen[r.bidNumber]) return false;
        seen[r.bidNumber] = true;
        return true;
      })
      .slice(0, MAX_PRIOR);
  })();

  return (
    <div className={styles.root}>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>Item value</span>
          <span className={styles.statValue}>
            {item.totalUSD > 0 ? money(item.totalUSD) : "No cost"}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Share of BID</span>
          <span className={styles.statValue}>
            {totalUSD > 0 ? `${((item.totalUSD / totalUSD) * 100).toFixed(1)}%` : "-"}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>vs. past BIDs</span>
          <span
            className={`${styles.statValue} ${
              delta === null
                ? styles.muted
                : delta > 5
                  ? styles.up
                  : delta < -5
                    ? styles.down
                    : ""
            }`}
          >
            {delta === null ? "No history" : formatSignedPercent(delta, 0)}
          </span>
        </div>
      </div>

      {parts.length > 0 && (
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>What makes up the price</h4>
          <div className={styles.stack}>
            {parts.map((p) => (
              <span
                key={p.key}
                style={{ width: `${(p.value / partsTotal) * 100}%`, background: p.color }}
                title={`${p.label}: ${money(p.value)}`}
              />
            ))}
          </div>
          <div className={styles.legend}>
            {parts.map((p) => (
              <span key={p.key} className={styles.legendItem}>
                <i style={{ background: p.color }} />
                {p.label}
                <b>{money(p.value)}</b>
              </span>
            ))}
          </div>
          {extrasOnly && (
            <p className={styles.note}>
              The value covers services or sub-items; the equipment itself is{" "}
              <strong style={{ color: acquisitionToken(item.acquisition) }}>
                {item.acquisition}
              </strong>
              .
            </p>
          )}
        </section>
      )}

      {(facts.length > 0 || item.scopeItem.clientRequirement) && (
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>Item</h4>
          <dl className={styles.facts}>
            {facts.map((f) => (
              <div key={f.label} className={styles.fact}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          {item.scopeItem.clientRequirement && (
            <div className={styles.quote}>
              <span className={styles.label}>Client requirement</span>
              <p>{item.scopeItem.clientRequirement}</p>
            </div>
          )}
        </section>
      )}

      {bars.length > 0 && (
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>Supplier quotes</h4>
          <SupplierQuoteBars bars={bars} currency={display.currency} />
        </section>
      )}

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Price in past BIDs</h4>
        {priced.length === 0 ? (
          <p className={styles.muted}>This item was not priced in other BIDs.</p>
        ) : (
          <>
            <DotStripPlot
              points={priced
                .map(
                  (r, i): DotStripPoint => ({
                    key: `${r.bidNumber}-${i}`,
                    label: `${r.bidNumber}${r.project ? ` · ${r.project}` : ""}`,
                    value: r.totalUSD * display.rate,
                  }),
                )
                .concat(
                  item.totalUSD > 0
                    ? [
                        {
                          key: "this",
                          label: `This BID · ${model.bid.bidNumber}`,
                          value: item.totalUSD * display.rate,
                          highlight: true,
                        },
                      ]
                    : [],
                )}
              median={med !== null ? med * display.rate : null}
              format={(v) => model.moneyCompact(v / display.rate)}
              highlightColor={colors.category(item.category)}
            />
            <ul className={styles.prior}>
              {prior.map((r) => (
                <li key={r.bidNumber} className={styles.priorRow}>
                  <span className={styles.priorBid}>{r.bidNumber}</span>
                  <span className={styles.priorProject} title={r.project}>
                    {r.project || "-"}
                    <em style={{ color: acquisitionToken(r.acquisition) }}>
                      {r.acquisition}
                    </em>
                  </span>
                  <span className={styles.priorValue}>
                    {r.totalUSD > 0 ? money(r.totalUSD) : "-"}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {item.asset.notes && (
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>Rationale</h4>
          <p className={styles.notes}>{item.asset.notes}</p>
        </section>
      )}
    </div>
  );
};
