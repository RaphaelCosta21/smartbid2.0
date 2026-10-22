/**
 * Standard packages: spreads with kind "package" (scope kits with no one-line drawing).
 * The user ticks several of them and they are merged into one in-memory spread for the vessel.
 */
import {
  ISurveyCatalog,
  ISurveyPipelineNode,
  ISurveySpread,
  ISurveySpreadCategory,
  ISurveySpreadLink,
  ISurveySpreadZone,
} from "../models";

/** Sentinel spread id while the scene shows the ticked standard packages. */
export const PACKAGES_SPREAD_ID = "__packages__";

export const isPackage = (spread: ISurveySpread): boolean => spread.kind === "package";

export const diagramsOf = (spreads: ISurveySpread[]): ISurveySpread[] =>
  spreads.filter((s) => !isPackage(s));

export const packagesOf = (spreads: ISurveySpread[]): ISurveySpread[] =>
  spreads.filter(isPackage);

const baseId = (ref: string): string => ref.split("#")[0];

const union = <T>(a: T[] | undefined, b: T[] | undefined): T[] | undefined => {
  if (!a && !b) return undefined;
  const out = (a || []).slice();
  (b || []).forEach((v) => {
    if (out.indexOf(v) < 0) out.push(v);
  });
  return out;
};

/**
 * Merges packages into one spread: zones with the same id join, the same equipment in a zone
 * sums qty and qtySpare (each package brings its own kit), and links only survive when both
 * ends are in the selection, so cross-package cabling appears only when both are ticked.
 */
export function composePackages(packages: ISurveySpread[]): ISurveySpread | undefined {
  if (packages.length === 0) return undefined;

  const zones: ISurveySpreadZone[] = [];
  const zoneById: Record<string, ISurveySpreadZone> = {};
  const categories: ISurveySpreadCategory[] = [];
  const categorySeen: Record<string, boolean> = {};
  const present: Record<string, boolean> = {};
  const pipeline: ISurveyPipelineNode[] = [];
  const pipeById: Record<string, ISurveyPipelineNode> = {};
  const hostCandidates: Record<string, string[]> = {};

  packages.forEach((pkg) => {
    (pkg.categories || []).forEach((c) => {
      if (categorySeen[c.id]) return;
      categorySeen[c.id] = true;
      categories.push(c);
    });

    pkg.zones.forEach((z) => {
      let zone = zoneById[z.id];
      if (!zone) {
        zone = zoneById[z.id] = { ...z, lines: [] };
        zones.push(zone);
      } else if (z.description && zone.description.indexOf(z.description) < 0) {
        zone.description = `${zone.description} ${z.description}`.trim();
      }
      z.lines.forEach((l) => {
        present[l.equipmentId] = true;
        const same = zone.lines.filter((x) => x.equipmentId === l.equipmentId)[0];
        if (!same) {
          zone.lines.push({ ...l });
          return;
        }
        same.qty += l.qty;
        same.qtySpare = (same.qtySpare || 0) + (l.qtySpare || 0);
        same.qtyLabel = union(
          same.qtyLabel ? [same.qtyLabel] : undefined,
          l.qtyLabel ? [l.qtyLabel] : undefined,
        )?.join(" + ");
        same.vesselSupplied = !!same.vesselSupplied && !!l.vesselSupplied;
      });
    });

    (pkg.pipeline || []).forEach((p) => {
      if (p.hostEquipmentId)
        (hostCandidates[p.id] || (hostCandidates[p.id] = [])).push(p.hostEquipmentId);
      const existing = pipeById[p.id];
      if (!existing) {
        pipeById[p.id] = { ...p };
        pipeline.push(pipeById[p.id]);
        return;
      }
      existing.consumes = union(existing.consumes, p.consumes);
      existing.feeds = union(existing.feeds, p.feeds);
      existing.displays = union(existing.displays, p.displays);
      existing.validated = !!existing.validated && !!p.validated;
    });
  });

  // A step hosted on equipment of another package moves to a host that is actually ticked.
  pipeline.forEach((p) => {
    const hosts = hostCandidates[p.id] || [];
    p.hostEquipmentId = hosts.filter((h) => present[h])[0] || hosts[0];
  });

  const links: ISurveySpreadLink[] = [];
  const linkSeen: Record<string, boolean> = {};
  packages.forEach((pkg) =>
    pkg.links.forEach((l) => {
      if (!present[baseId(l.from)] || !present[baseId(l.to)]) return;
      const key = `${l.from}>${l.to}>${l.kind}`;
      if (linkSeen[key]) return;
      linkSeen[key] = true;
      links.push(l);
    }),
  );

  const titles = packages.map((p) => p.title);
  return {
    id: packages.map((p) => p.id).join(" + "),
    title: titles.join(" + "),
    drawingNo: "",
    revision: "",
    description: `Standard packages assembled together on the vessel: ${titles.join(", ")}.`,
    zones,
    links,
    categories,
    pipeline,
    order: 0,
    kind: "package",
  };
}

/** Spread shown in the System view: the ticked packages merged, or the chosen diagram. */
export function resolveActiveSpread(
  catalog: ISurveyCatalog | null | undefined,
  spreadId: string | null,
  packageIds: string[],
): ISurveySpread | undefined {
  const spreads = (catalog && catalog.spreads) || [];
  if (spreadId === PACKAGES_SPREAD_ID) {
    const composed = composePackages(
      packagesOf(spreads).filter((p) => packageIds.indexOf(p.id) >= 0),
    );
    if (composed) return composed;
  }
  const diagrams = diagramsOf(spreads);
  return diagrams.filter((s) => s.id === spreadId)[0] || diagrams[0] || spreads[0];
}
