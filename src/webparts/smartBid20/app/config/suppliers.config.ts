/**
 * Supplier configuration defaults. The service type list is editable in
 * System Configuration (systemConfig.supplierServiceTypes); this list is only the
 * initial seed used until an admin saves it.
 */
import { IConfigOption } from "../models";

const SERVICE_TYPE_SEED: Array<[string, string, string]> = [
  ["sst-precision-machining", "Precision Machining (CNC)", "Manufacturing"],
  [
    "sst-heavy-fabrication",
    "Heavy Fabrication / Boilermaking",
    "Manufacturing",
  ],
  ["sst-welding", "Welding (TIG/MIG, Aluminum & Stainless)", "Manufacturing"],
  [
    "sst-cutting-engraving",
    "Cutting & Engraving (Plasma, Wire EDM, Laser)",
    "Manufacturing",
  ],
  [
    "sst-blasting-painting",
    "Sandblasting & Industrial Painting",
    "Manufacturing",
  ],
  ["sst-aluminum-structures", "Aluminum Structures & Skids", "Manufacturing"],
  ["sst-pressure-vessels", "Pressure Vessels", "Manufacturing"],
  ["sst-manifolds-piping", "Manifolds & Piping", "Manufacturing"],
  ["sst-rov-subsea-tooling", "ROV & Subsea Tooling", "Subsea & ROV"],
  ["sst-hot-stabs", "Hot Stabs & Hydraulic Connections", "Subsea & ROV"],
  ["sst-rov-spares", "ROV Spare Parts & Components", "Subsea & ROV"],
  [
    "sst-launch-recovery",
    "Launch & Recovery Structures (Gantries, A-Frames)",
    "Subsea & ROV",
  ],
  ["sst-subsea-structures", "Subsea Structures", "Subsea & ROV"],
  ["sst-ndt", "Non-Destructive Testing (NDT)", "Quality"],
  ["sst-inspection-calibration", "Inspection & Calibration", "Quality"],
  ["sst-manufacturer-oem", "Manufacturer / OEM", "Supply"],
  ["sst-distributor", "Distributor / Reseller", "Supply"],
  ["sst-consumables-spares", "Consumables & Spares", "Supply"],
  ["sst-hydraulics-pneumatics", "Hydraulics & Pneumatics", "Supply"],
  ["sst-electrical-electronics", "Electrical & Electronics", "Supply"],
  ["sst-repair-maintenance", "Repair & Maintenance", "Services"],
  ["sst-equipment-rental", "Equipment Rental", "Services"],
  ["sst-engineering-design", "Engineering & Design", "Services"],
  ["sst-logistics", "Logistics & Freight", "Services"],
];

export function buildDefaultSupplierServiceTypes(): IConfigOption[] {
  return SERVICE_TYPE_SEED.map(([id, label, category], index) => ({
    id,
    label,
    value: label,
    category,
    isActive: true,
    order: index + 1,
  }));
}
