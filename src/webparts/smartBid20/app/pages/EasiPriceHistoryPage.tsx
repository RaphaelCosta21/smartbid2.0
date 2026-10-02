import * as React from "react";
import { PriceHistory } from "@easi/smartbid-modules";
import { EasiModuleFrame } from "./EasiModuleFrame";

/** Página do módulo EASI "Price History" (Consulta Histórica de Preços & Modalidades). */
export const EasiPriceHistoryPage: React.FC = () => {
  return (
    <EasiModuleFrame
      title="Price History"
      subtitle="Historical prices and pricing modes from live BIDs"
      icon={
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      }
    >
      <PriceHistory />
    </EasiModuleFrame>
  );
};
