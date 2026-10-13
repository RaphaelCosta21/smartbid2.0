/**
 * Builds a 3D scene from a free equipment selection (the bid package) instead of a
 * spread's one-line diagram. Each selected item keeps its real location: the full
 * spread + catalog expansion already tells us which room (anchor) every equipment lives in.
 */
import { ISurveyCatalog, ISurveySpread, SurveySceneAnchor } from "../models";
import {
  CATALOG_CLUSTER,
  PORTAL_CLUSTER,
  SceneFocus,
  SceneNode,
  SceneZone,
} from "../components/survey/survey3d/sceneTypes";
import {
  ISpreadNode,
  catalogNodes,
  expandSpreadNodes,
  resolveSceneShape,
} from "./surveySpreadGraph";

/** Sentinel spread id for the "Free composition" mode (blank vessel, built from the package). */
export const FREE_SPREAD_ID = "__free__";

export interface IFreeScene {
  zones: SceneZone[];
  focus: SceneFocus | null;
}

const EMPTY: IFreeScene = { zones: [], focus: null };

/** One location node per equipment id, drawn from the full spread + catalog placement. */
function locationByEquipment(
  spread: ISurveySpread,
  catalog: ISurveyCatalog,
): Record<string, ISpreadNode> {
  const base = expandSpreadNodes(spread, catalog);
  const all = base.concat(catalogNodes(spread, catalog, base));
  const map: Record<string, ISpreadNode> = {};
  all.forEach((n) => {
    if (!map[n.equipmentId]) map[n.equipmentId] = n;
  });
  return map;
}

export function buildFreeScene(
  spread: ISurveySpread | undefined,
  catalog: ISurveyCatalog | null | undefined,
  selectedIds: string[],
  activeZoneId: string | null,
): IFreeScene {
  if (!spread || !catalog || selectedIds.length === 0) return EMPTY;

  const rooms = spread.zones.filter((z) => !!z.sceneAnchor);
  if (rooms.length === 0) return EMPTY;
  const roomById: Record<string, (typeof rooms)[number]> = {};
  rooms.forEach((z) => (roomById[z.id] = z));

  const location = locationByEquipment(spread, catalog);
  const equipmentById = catalog.equipment.reduce<Record<string, (typeof catalog.equipment)[number]>>(
    (acc, e) => {
      acc[e.id] = e;
      return acc;
    },
    {},
  );

  // Group the selected equipment by the room their location resolves to.
  const byZone: Record<string, string[]> = {};
  selectedIds.forEach((id) => {
    const node = location[id];
    if (!node || !roomById[node.zoneId]) return;
    (byZone[node.zoneId] || (byZone[node.zoneId] = [])).push(id);
  });

  const zones: SceneZone[] = rooms
    .filter((z) => (byZone[z.id] || []).length > 0)
    .map((z) => {
      const count = byZone[z.id].length;
      return {
        id: z.id,
        title: z.title,
        anchor: z.sceneAnchor as SurveySceneAnchor,
        countLabel: `${count} selected`,
      };
    });

  const focus = buildFocus(activeZoneId, zones, byZone, location, equipmentById, catalog);
  return { zones, focus };
}

function buildFocus(
  activeZoneId: string | null,
  zones: SceneZone[],
  byZone: Record<string, string[]>,
  location: Record<string, ISpreadNode>,
  equipmentById: Record<string, ISurveyCatalog["equipment"][number]>,
  catalog: ISurveyCatalog,
): SceneFocus | null {
  const zone = zones.find((z) => z.id === activeZoneId);
  if (!zone) return null;

  const familyOrder: Record<string, number> = {};
  const clusterTitles: Record<string, string> = {
    [CATALOG_CLUSTER]: "Also in catalog",
    [PORTAL_CLUSTER]: "Connected rooms",
  };
  catalog.families.forEach((f) => {
    familyOrder[f.id] = f.order;
    clusterTitles[f.id] = f.title;
  });

  const nodes: SceneNode[] = (byZone[zone.id] || []).map((id) => {
    const eq = equipmentById[id];
    const loc = location[id];
    return {
      id,
      equipmentId: id,
      label: eq.title,
      shape: resolveSceneShape(eq),
      modelUrl: eq.modelUrl || null,
      anchor: loc.anchor || zone.anchor,
      vesselSupplied: false,
      role: "spread" as const,
      cluster: eq.familyId,
      // Free composition is not compared against a BID, so no in/out state.
      bidState: null,
    };
  });
  const rank = (n: SceneNode): number =>
    familyOrder[n.cluster] !== undefined ? familyOrder[n.cluster] : 998;
  nodes.sort((a, b) => rank(a) - rank(b));

  return {
    zoneId: zone.id,
    anchor: zone.anchor,
    nodes,
    links: [],
    clusterTitles,
  };
}
