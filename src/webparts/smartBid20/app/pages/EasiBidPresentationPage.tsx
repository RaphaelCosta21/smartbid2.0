import * as React from "react";
import { BidPresentation } from "@easi/smartbid-modules";
import { EasiModuleFrame } from "./EasiModuleFrame";

/** Página do módulo EASI "BID Presentation" (apresentação consolidada de um BID). */
export const EasiBidPresentationPage: React.FC = () => {
  return (
    <EasiModuleFrame
      title="BID Presentation"
      subtitle="Consolidated BID presentation from live data"
      icon={
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2 3h20" />
          <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
          <path d="m7 21 5-5 5 5" />
        </svg>
      }
    >
      <BidPresentation />
    </EasiModuleFrame>
  );
};
