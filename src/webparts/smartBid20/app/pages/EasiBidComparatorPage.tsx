import * as React from "react";
import { BidComparator } from "@easi/smartbid-modules";
import { EasiModuleFrame } from "./EasiModuleFrame";

/** Página do módulo EASI "Bid Comparator" (comparação lado a lado de BIDs). */
export const EasiBidComparatorPage: React.FC = () => {
  return (
    <EasiModuleFrame
      title="Bid Comparator"
      subtitle="Side-by-side comparison of BIDs from live data"
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
    >
      <BidComparator />
    </EasiModuleFrame>
  );
};
