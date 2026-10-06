import * as React from "react";
import { ArrowLeftRight, TriangleAlert } from "lucide-react";
import { IBidFx, toUSDWithBidRates } from "../../utils/costCalculations";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { HeaderChip } from "./BidTabHeader";
import styles from "./BidFxNote.module.scss";

interface BidFxNoteProps {
  fx: IBidFx;
  /** Currencies used by the items on screen */
  currencies: string[];
  /** Show the USD→BRL rate even when no item is priced in BRL */
  requireBrl?: boolean;
}

interface UsdAmountCellProps {
  amount: number;
  currency: string;
  fx: IBidFx;
  className?: string;
}

/** Table cell with a line amount converted to USD using the BID rates. */
export const UsdAmountCell: React.FC<UsdAmountCellProps> = ({
  amount,
  currency,
  fx,
  className,
}) => {
  const usd = toUSDWithBidRates(amount, currency, fx);
  return (
    <td
      className={className}
      title={
        usd === null
          ? `No exchange rate registered on this BID for ${currency}`
          : undefined
      }
    >
      {usd === null ? "-" : formatCurrency(usd)}
    </td>
  );
};

export const BidFxNote: React.FC<BidFxNoteProps> = ({
  fx,
  currencies,
  requireBrl = false,
}) => {
  const used: string[] = [];
  (requireBrl ? ["BRL"] : []).concat(currencies || []).forEach((c) => {
    const cur = (c || "").toUpperCase().trim();
    if (cur && cur !== "USD" && used.indexOf(cur) < 0) used.push(cur);
  });
  if (used.length === 0) return null;

  const missing = used.filter((c) => toUSDWithBidRates(1, c, fx) === null);
  const withRate = used
    .filter((c) => missing.indexOf(c) < 0)
    .map((c) => ({
      currency: c,
      // Inverse of the USD value of 1 unit gives units per USD
      rate: 1 / (toUSDWithBidRates(1, c, fx) as number),
    }));

  return (
    <div className={styles.fxNote}>
      {withRate.map((r) => (
        <HeaderChip
          key={r.currency}
          icon={<ArrowLeftRight size={13} />}
          title="Converted to USD with the rates registered on this BID (Overview > Exchange Rates)"
        >
          1 USD = {r.rate.toFixed(4)} {r.currency}
        </HeaderChip>
      ))}
      {withRate.length > 0 && fx.capturedDate && (
        <span className={styles.fxMuted}>
          Rates registered {formatDate(fx.capturedDate)}
        </span>
      )}
      {missing.length > 0 && (
        <HeaderChip
          tone="warning"
          icon={<TriangleAlert size={13} />}
          title="Update the rates on the Overview tab."
        >
          No exchange rate for {missing.join(", ")} - left out of the USD
          totals
        </HeaderChip>
      )}
    </div>
  );
};
