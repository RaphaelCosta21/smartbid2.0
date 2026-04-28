/**
 * defaultFavoriteGroups.ts — Default Group/SubGroup seed data for Favorites.
 * Used to populate groups on first load when no data exists in SharePoint.
 */
import { IFavoriteGroup } from "../models";

let _idCounter = 0;
function nextId(prefix: string): string {
  _idCounter++;
  return `${prefix}-${_idCounter}`;
}

function makeGroup(name: string, subGroupNames: string[]): IFavoriteGroup {
  const gId = nextId("grp");
  return {
    id: gId,
    name,
    subGroups: subGroupNames.map((sgName) => ({
      id: nextId("sg"),
      name: sgName,
      groupId: gId,
    })),
  };
}

export function getDefaultFavoriteGroups(): IFavoriteGroup[] {
  _idCounter = 0; // reset for deterministic IDs
  return [
    makeGroup("System Assets", [
      "Systems",
      "TMS",
      "Topside",
      "Manipulators",
      "Baskets",
      "SKIDs",
      "Other",
    ]),
    makeGroup("Sensors", [
      "Gyro",
      "DVL",
      "Sonar",
      "Profundimetro",
      "Altimetro",
      "INS",
      "MBES",
      "PipeTracker",
      "Beacons",
      "Sound Velocity",
      "Metrology",
      "Other",
    ]),
    makeGroup("Cameras", [
      "Color",
      "Mini Color",
      "Mini BW",
      "BW",
      "HD",
      "Other",
    ]),
    makeGroup("Stabs and FIS Kits", [
      "17D Stabs",
      "17H Stabs",
      "Other Stabs",
      "17D Receptacles",
      "17H Receptacles",
      "Other Receptacles",
      "Blind Stabs",
      "FIS Kits",
      "Other",
    ]),
    makeGroup("Valve Manipulation", [
      "FLOT",
      "Torque Tool",
      "Test Jig",
      "Soquetes TT",
      "TT Adapter",
      "Override Tools",
      "Clutch Tool",
      "Handle Tools",
      "SuperGrinder",
      "Other",
    ]),
    makeGroup("Cutting", ["Wire Saw", "Grinders", "Cable Cutters", "Other"]),
    makeGroup("Inspection", [
      "CP Probe",
      "Thickness Gauge",
      "Docking",
      "Caliper",
      "Leak Detection",
      "Other",
    ]),
    makeGroup("Dredge and Pump", ["Dredges", "Pumps", "Other"]),
    makeGroup("Handles", ["D-Handle", "Fishtail", "T-Handle", "Other"]),
    makeGroup("Cleaning", [
      "GR29",
      "Multipurpose Cleaning",
      "Hub Cleaners",
      "Water Jettings",
      "Other",
    ]),
    makeGroup("Hoses", [
      "JIC 4",
      "JIC 6",
      "JIC 8",
      "JIC 10",
      "JIC 12",
      "Other",
    ]),
    makeGroup("Compensators", ["Bladders"]),
    makeGroup("Gauges", ["Manometers"]),
    makeGroup("Operation KIT", ["UWILD", "Drillship Standard PB", "Decomm"]),
    makeGroup("Cases", ["Pelican Cases"]),
    makeGroup("Flange and Pipeline Intervention", [
      "Wrenches",
      "RSLs",
      "Screwdrivers",
      "Fluid Collection System",
      "Flange Connections",
      "Flange Disconnection",
      "Other",
    ]),
    makeGroup("Flange Cutting", ["NutSplitter", "Grinders", "Other"]),
    makeGroup("Decommissioning", ["Cable Grippers", "Cutting"]),
    makeGroup("Surface Navigation", [
      "GNSS",
      "MRU",
      "NAS",
      "Computers",
      "Other",
    ]),
    makeGroup("Licenses and Softwares", ["Licenses and Softwares"]),
    makeGroup("Intervention", ["Gasket Tools", "Fluids", "Other"]),
    makeGroup("Other", ["Other"]),
  ];
}
