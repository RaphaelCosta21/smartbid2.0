import { MobilizationCostType, RTSCostType } from "../models";

export const RTS_TYPES: { value: RTSCostType; label: string }[] = [
  { value: "maintenance", label: "Maintenance" },
  { value: "refurbishment", label: "Refurbishment" },
  { value: "upgrade", label: "Upgrade" },
  { value: "rts-inspection", label: "RTS Inspection" },
];

export const MOB_TYPES: { value: MobilizationCostType; label: string }[] = [
  { value: "mobilization", label: "Mobilization" },
  { value: "demobilization", label: "Demobilization" },
  { value: "transit", label: "Transit" },
];
