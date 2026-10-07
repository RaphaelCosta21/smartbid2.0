import * as React from "react";
import { Lock } from "lucide-react";
import { IBid } from "../../models";
import { useBidStore } from "../../stores/useBidStore";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { canOpenBid, isBidConfidential } from "../../utils/bidConfidentiality";
import styles from "./ConfidentialLock.module.scss";

interface ConfidentialLockProps {
  bid?: IBid;
  /** Looked up in the BID store when the host only knows the number. */
  bidNumber?: string;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

/** Renders nothing unless the BID is confidential. */
export const ConfidentialLock: React.FC<ConfidentialLockProps> = ({
  bid,
  bidNumber,
  size = 12,
  showLabel,
  className,
}) => {
  const storeBid = useBidStore((s) =>
    bid || !bidNumber
      ? undefined
      : s.bids.find((b) => b.bidNumber === bidNumber),
  );
  const email = useCurrentUser().email;
  const target = bid || storeBid;
  if (!target || !isBidConfidential(target)) return null;

  const allowed = canOpenBid(target, email);
  const title = allowed
    ? "Confidential BID - you have access"
    : "Confidential BID - restricted access";
  const classes = [
    styles.lock,
    allowed ? "" : styles.restricted,
    showLabel ? styles.withLabel : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} title={title} aria-label={title} role="img">
      <Lock size={size} aria-hidden="true" />
      {showLabel && <span>Confidential</span>}
    </span>
  );
};
