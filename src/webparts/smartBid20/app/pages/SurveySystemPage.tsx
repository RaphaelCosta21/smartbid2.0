import * as React from "react";
import { Radar } from "lucide-react";
import {
  SurveyPortalHeader,
  SurveySearchHit,
} from "../components/survey/SurveyPortalHeader";
import { SurveyEquipmentDetail } from "../components/survey/SurveyEquipmentDetail";
import { SurveyAddToPackageDialog } from "../components/survey/SurveyAddToPackageDialog";
import { SurveyPackageDrawer } from "../components/survey/SurveyPackageDrawer";
import { SurveySpreadPanel } from "../components/survey/SurveySpreadPanel";
import type {
  SurveyCableInfo,
  SurveySceneTour,
  SurveyTraceStep,
} from "../components/survey/SurveySystemScene";
import {
  CATALOG_CLUSTER,
  LINK_LABELS,
  PORTAL_CLUSTER,
  PORTAL_PREFIX,
  TRUNK_PREFIX,
  SceneFocus,
  SceneLink,
  SceneNode,
  SceneNodeStates,
  SceneTrunk,
  SceneZone,
} from "../components/survey/survey3d/sceneTypes";
import { EmptyState } from "../components/common/EmptyState";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { useSurveyStore } from "../stores/useSurveyStore";
import { useUIStore } from "../stores/useUIStore";
import {
  useSurveyBidComparison,
  useSurveyBidIntel,
} from "../hooks/useSurveyPortal";
import { ISurveySpreadZone, SurveyLinkKind, SurveySceneAnchor } from "../models";
import {
  ISpreadLinkRef,
  ISpreadNode,
  catalogNodes,
  directLinks,
  expandSpreadNodes,
  resolveSceneShape,
  resolveSpreadLinks,
  traceSignalPath,
} from "../utils/surveySpreadGraph";
import styles from "./SurveySystemPage.module.scss";

const SurveySystemScene = React.lazy(
  () =>
    import(
      /* webpackChunkName: "survey-3d" */ "../components/survey/SurveySystemScene"
    ),
);

const TOUR_STEP_MS = 8000;
/** Tour reads topside → hull → umbilical → subsea, whatever the zone order in the data. */
const TOUR_DEPTH: Partial<Record<SurveySceneAnchor, number>> = {
  "vessel-hull": 1,
  umbilical: 1,
  rov: 2,
  beacons: 2,
  seabed: 2,
  "subsea-target": 2,
};

interface ITrunkDetail {
  from: ISurveySpreadZone;
  to: ISurveySpreadZone;
  links: ISpreadLinkRef[];
}

/** Most frequent cable kind of a trunk (ties keep the first seen). */
const dominantKind = (links: ISpreadLinkRef[]): SurveyLinkKind => {
  const counts: Partial<Record<SurveyLinkKind, number>> = {};
  let best = links[0].kind;
  links.forEach((l) => {
    counts[l.kind] = (counts[l.kind] || 0) + 1;
    if ((counts[l.kind] || 0) > (counts[best] || 0)) best = l.kind;
  });
  return best;
};

const SEARCH_HITS_MAX = 8;

export const SurveySystemPage: React.FC = () => {
  const catalog = useSurveyStore((s) => s.catalog);
  const isLoading = useSurveyStore((s) => s.isLoading);
  const listMissing = useSurveyStore((s) => s.listMissing);
  const selectedId = useSurveyStore((s) => s.selectedEquipmentId);
  const selectEquipment = useSurveyStore((s) => s.selectEquipment);
  const packageLines = useSurveyStore((s) => s.packageLines);
  const addToPackage = useSurveyStore((s) => s.addToPackage);
  const addSpreadToPackage = useSurveyStore((s) => s.addSpreadToPackage);
  const setFilters = useSurveyStore((s) => s.setFilters);
  const search = useSurveyStore((s) => s.filters.search);
  const spreadId = useSurveyStore((s) => s.spreadId);
  const load = useSurveyStore((s) => s.load);
  const addToast = useUIStore((s) => s.addToast);
  const comparison = useSurveyBidComparison();
  const considered = comparison ? comparison.considered : null;

  const [detailOpen, setDetailOpen] = React.useState(false);
  const [addingId, setAddingId] = React.useState<string | null>(null);
  const [packageOpen, setPackageOpen] = React.useState(false);
  const [activeZoneId, setActiveZoneId] = React.useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [hoverNodeId, setHoverNodeId] = React.useState<string | null>(null);
  const [hoverCableKey, setHoverCableKey] = React.useState<string | null>(null);
  const [tourStep, setTourStep] = React.useState<number | null>(null);
  const reducedMotion = React.useMemo(
    () =>
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  React.useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const headerRef = React.useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = React.useState(0);
  React.useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(() => setHeaderHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const spreads = catalog?.spreads || [];
  const spread = spreads.find((s) => s.id === spreadId) || spreads[0];

  const spreadNodes = React.useMemo(
    () => (spread && catalog ? expandSpreadNodes(spread, catalog) : []),
    [spread, catalog],
  );
  const nodes = React.useMemo(
    () =>
      spread && catalog
        ? spreadNodes.concat(catalogNodes(spread, catalog, spreadNodes))
        : spreadNodes,
    [spread, catalog, spreadNodes],
  );
  const links = React.useMemo(
    () => (spread ? resolveSpreadLinks(spread, spreadNodes) : []),
    [spread, spreadNodes],
  );
  const catalogByZone = React.useMemo(() => {
    const result: Record<string, string[]> = {};
    nodes.forEach((n) => {
      if (n.source === "catalog") (result[n.zoneId] || (result[n.zoneId] = [])).push(n.equipmentId);
    });
    return result;
  }, [nodes]);
  const nodeById = React.useMemo(() => {
    const result: Record<string, ISpreadNode> = {};
    nodes.forEach((n) => (result[n.id] = n));
    return result;
  }, [nodes]);
  const linkByKey = React.useMemo(() => {
    const result: Record<string, ISpreadLinkRef> = {};
    links.forEach((l) => (result[l.key] = l));
    return result;
  }, [links]);
  // Only physical rooms are drawn in 3D; BID-only groups (no anchor) live in the panel.
  const rooms = React.useMemo(
    () => (spread?.zones || []).filter((z) => !!z.sceneAnchor),
    [spread],
  );
  const sceneZones = React.useMemo<SceneZone[]>(
    () =>
      rooms.map((z) => {
        // Vessel-supplied lines are not priced, so they never count against the BID.
        const priced = z.lines.filter((l) => !l.vesselSupplied);
        const inBid = considered ? priced.filter((l) => considered[l.equipmentId]).length : 0;
        return {
          id: z.id,
          title: z.title,
          anchor: z.sceneAnchor as SurveySceneAnchor,
          countLabel: considered
            ? `${inBid}/${priced.length} in BID`
            : `${z.lines.length} items`,
        };
      }),
    [rooms, considered],
  );
  const bidStateOf = React.useCallback(
    (n: ISpreadNode): "in" | "out" | null => {
      if (!considered) return null;
      if (considered[n.equipmentId]) return "in";
      return n.source === "catalog" || n.vesselSupplied ? null : "out";
    },
    [considered],
  );

  const searchHits = React.useMemo<SurveySearchHit[]>(() => {
    const q = search.trim().toLowerCase();
    if (!q || !catalog) return [];
    const zoneTitle: Record<string, string> = {};
    (spread?.zones || []).forEach((z) => (zoneTitle[z.id] = z.title));
    const scored: { node: ISpreadNode; score: number }[] = [];
    nodes.forEach((n) => {
      const eq = catalog.equipment.find((e) => e.id === n.equipmentId);
      if (!eq) return;
      const title = n.label.toLowerCase();
      const haystack = [title, eq.technology, eq.partNumber, eq.manufacturer, eq.model]
        .concat(eq.aliases)
        .join(" ")
        .toLowerCase();
      if (haystack.indexOf(q) < 0) return;
      scored.push({ node: n, score: title.indexOf(q) === 0 ? 0 : title.indexOf(q) > 0 ? 1 : 2 });
    });
    return scored
      .sort((a, b) => a.score - b.score)
      .slice(0, SEARCH_HITS_MAX)
      .map(({ node }) => ({
        id: node.id,
        title: node.label,
        meta: zoneTitle[node.zoneId] || "",
      }));
  }, [search, catalog, spread, nodes]);

  // Cables between rooms, aggregated per room pair for the overview arcs.
  const trunkDetails = React.useMemo(() => {
    const result: Record<string, ITrunkDetail> = {};
    links.forEach((l) => {
      const a = rooms.find((z) => z.id === nodeById[l.from]?.zoneId);
      const b = rooms.find((z) => z.id === nodeById[l.to]?.zoneId);
      if (!a || !b || a === b || a.sceneAnchor === b.sceneAnchor) return;
      const [from, to] = rooms.indexOf(a) < rooms.indexOf(b) ? [a, b] : [b, a];
      const key = `${TRUNK_PREFIX}${from.id}|${to.id}`;
      (result[key] || (result[key] = { from, to, links: [] })).links.push(l);
    });
    return result;
  }, [links, rooms, nodeById]);
  const trunks = React.useMemo<SceneTrunk[]>(
    () =>
      Object.keys(trunkDetails).map((key) => ({
        key,
        from: trunkDetails[key].from.sceneAnchor as SurveySceneAnchor,
        to: trunkDetails[key].to.sceneAnchor as SurveySceneAnchor,
        kind: dominantKind(trunkDetails[key].links),
      })),
    [trunkDetails],
  );

  const focus = React.useMemo<SceneFocus | null>(() => {
    const zone = rooms.find((z) => z.id === activeZoneId);
    if (!zone || !catalog) return null;
    const familyOrder: Record<string, number> = {};
    const clusterTitles: Record<string, string> = {
      [CATALOG_CLUSTER]: "Also in catalog",
      [PORTAL_CLUSTER]: "Connected rooms",
    };
    catalog.families.forEach((f) => {
      familyOrder[f.id] = f.order;
      clusterTitles[f.id] = f.title;
    });

    const inZone: Record<string, boolean> = {};
    const sceneNodes: SceneNode[] = nodes
      .filter((n) => n.zoneId === zone.id)
      .map((n) => {
        inZone[n.id] = true;
        const eq = catalog.equipment.find((e) => e.id === n.equipmentId)!;
        const isCatalog = n.source === "catalog";
        return {
          id: n.id,
          equipmentId: n.equipmentId,
          label: n.label,
          shape: resolveSceneShape(eq),
          modelUrl: eq.modelUrl || null,
          anchor: n.anchor,
          vesselSupplied: n.vesselSupplied,
          role: isCatalog ? ("catalog" as const) : ("spread" as const),
          cluster: isCatalog ? CATALOG_CLUSTER : eq.familyId,
          bidState: bidStateOf(n),
        };
      });
    const rank = (n: SceneNode): number =>
      n.role === "catalog" ? 999 : familyOrder[n.cluster] !== undefined ? familyOrder[n.cluster] : 998;
    sceneNodes.sort((a, b) => rank(a) - rank(b));

    // Cables leaving the room end on a portal node that stands for the other room.
    const portals: SceneNode[] = [];
    const sceneLinks: SceneLink[] = [];
    links.forEach((l) => {
      const fromIn = !!inZone[l.from];
      const toIn = !!inZone[l.to];
      if (fromIn && toIn) {
        sceneLinks.push({ key: l.key, from: l.from, to: l.to, kind: l.kind, cable: l.cable });
        return;
      }
      if (!fromIn && !toIn) return;
      const other = rooms.find((z) => z.id === nodeById[fromIn ? l.to : l.from]?.zoneId);
      if (!other) return;
      const portalId = `${PORTAL_PREFIX}${other.id}`;
      if (!portals.some((p) => p.id === portalId)) {
        portals.push({
          id: portalId,
          equipmentId: "",
          label: other.title,
          shape: "portal",
          modelUrl: null,
          anchor: other.sceneAnchor,
          vesselSupplied: false,
          role: "portal",
          cluster: PORTAL_CLUSTER,
          bidState: null,
        });
      }
      sceneLinks.push({
        key: l.key,
        from: fromIn ? l.from : portalId,
        to: fromIn ? portalId : l.to,
        kind: l.kind,
        cable: l.cable,
      });
    });
    portals.sort(
      (a, b) =>
        rooms.findIndex((z) => PORTAL_PREFIX + z.id === a.id) -
        rooms.findIndex((z) => PORTAL_PREFIX + z.id === b.id),
    );

    return {
      zoneId: zone.id,
      anchor: zone.sceneAnchor as SurveySceneAnchor,
      nodes: sceneNodes.concat(portals),
      links: sceneLinks,
      clusterTitles,
    };
  }, [rooms, activeZoneId, catalog, nodes, links, nodeById, bidStateOf]);

  const trace = React.useMemo(
    () =>
      selectedNodeId
        ? traceSignalPath(links, selectedNodeId) || directLinks(links, selectedNodeId)
        : null,
    [links, selectedNodeId],
  );
  const packageEquipmentIds = React.useMemo(
    () => packageLines.map((l) => l.equipmentId),
    [packageLines],
  );
  const nodeStates = React.useMemo<SceneNodeStates>(() => {
    const traceNodeIds = trace ? trace.nodeIds.slice() : [];
    // Steps in other rooms light the portal that leads there.
    if (trace && activeZoneId) {
      trace.nodeIds.forEach((id) => {
        const zoneId = nodeById[id]?.zoneId;
        if (zoneId && zoneId !== activeZoneId) traceNodeIds.push(`${PORTAL_PREFIX}${zoneId}`);
      });
    }
    const hoverLinkKeys =
      !selectedNodeId && hoverNodeId && focus
        ? focus.links
            .filter((l) => l.from === hoverNodeId || l.to === hoverNodeId)
            .map((l) => l.key)
        : [];
    return {
      selectedNodeId,
      hoverNodeId,
      packageEquipmentIds,
      traceNodeIds,
      traceLinkKeys: trace ? trace.linkKeys : [],
      hoverLinkKeys,
    };
  }, [selectedNodeId, hoverNodeId, packageEquipmentIds, trace, activeZoneId, nodeById, focus]);
  const tracePath = React.useMemo<SurveyTraceStep[] | null>(
    () =>
      trace
        ? trace.nodeIds.map((id, i) => ({
            id,
            label: nodeById[id]?.label || id,
            cable: i > 0 ? linkByKey[trace.linkKeys[i - 1]]?.cable : undefined,
          }))
        : null,
    [trace, nodeById, linkByKey],
  );
  const cableInfo = React.useMemo<SurveyCableInfo | null>(() => {
    if (!hoverCableKey) return null;
    const trunk = trunkDetails[hoverCableKey];
    if (trunk) {
      const codes = trunk.links.filter((l) => !!l.cable).map((l) => l.cable);
      const count = `${trunk.links.length} ${trunk.links.length === 1 ? "cable" : "cables"}`;
      return {
        kind: dominantKind(trunk.links),
        title: `${trunk.from.title} ⇄ ${trunk.to.title}`,
        detail: codes.length ? `${count} · ${codes.join(" · ")}` : count,
      };
    }
    const link = linkByKey[hoverCableKey];
    if (!link) return null;
    const labelOf = (id: string): string => nodeById[id]?.label || id;
    return {
      kind: link.kind,
      title: link.cable || LINK_LABELS[link.kind],
      detail: `${labelOf(link.from)} → ${labelOf(link.to)} · ${LINK_LABELS[link.kind]}`,
    };
  }, [hoverCableKey, trunkDetails, linkByKey, nodeById]);

  const tourSteps = React.useMemo(() => {
    if (!spread) return [];
    const depth = (a: SurveySceneAnchor): number => TOUR_DEPTH[a] || 0;
    const ordered = rooms
      .slice()
      .sort(
        (a, b) =>
          depth(a.sceneAnchor as SurveySceneAnchor) - depth(b.sceneAnchor as SurveySceneAnchor),
      );
    return [
      { zoneId: null as string | null, title: spread.title, caption: spread.description },
      ...ordered.map((z) => ({ zoneId: z.id as string | null, title: z.title, caption: z.description })),
    ];
  }, [spread, rooms]);
  const tour: SurveySceneTour | null =
    tourStep !== null && tourSteps[tourStep]
      ? {
          step: tourStep,
          total: tourSteps.length,
          title: tourSteps[tourStep].title,
          caption: tourSteps[tourStep].caption,
        }
      : null;

  const selected = catalog?.equipment.find((e) => e.id === selectedId);
  const intel = useSurveyBidIntel(detailOpen ? selected : undefined);
  const adding = catalog?.equipment.find((e) => e.id === addingId);
  const closeAdd = React.useCallback(() => setAddingId(null), []);
  const qtyOf = (id: string): number =>
    packageLines.find((l) => l.equipmentId === id)?.qty || 0;

  const handleSelect = (id: string): void => {
    selectEquipment(id);
    setDetailOpen(true);
  };

  const firstNodeOf = (equipmentId: string): ISpreadNode | undefined =>
    nodes.find((n) => n.equipmentId === equipmentId);

  const stopTour = (): void => setTourStep(null);

  const openZone = (zoneId: string | null): void => {
    setActiveZoneId(zoneId);
    setSelectedNodeId(null);
    setHoverNodeId(null);
    setHoverCableKey(null);
  };

  const handleZoneSelect = (zoneId: string | null): void => {
    stopTour();
    if (zoneId !== null && zoneId === activeZoneId) return;
    openZone(zoneId);
  };

  const handleZoneToggle = (zoneId: string): void => {
    stopTour();
    openZone(activeZoneId === zoneId ? null : zoneId);
  };

  const handleNodeSelect = (nodeId: string): void => {
    if (nodeId.indexOf(PORTAL_PREFIX) === 0) {
      handleZoneSelect(nodeId.slice(PORTAL_PREFIX.length));
      return;
    }
    const node = nodeById[nodeId];
    if (!node) return;
    stopTour();
    if (node.zoneId !== activeZoneId) setActiveZoneId(node.zoneId);
    setSelectedNodeId(nodeId);
    handleSelect(node.equipmentId);
  };

  const handleSelectLine = (zoneId: string, equipmentId: string): void => {
    const node = nodes.find((n) => n.zoneId === zoneId && n.equipmentId === equipmentId);
    if (node) handleNodeSelect(node.id);
    else handleSelect(equipmentId);
  };

  const handleHoverLine = (equipmentId: string | null): void => {
    const node = equipmentId ? firstNodeOf(equipmentId) : undefined;
    setHoverNodeId(node && node.zoneId === activeZoneId ? node.id : null);
  };

  const handleSelectLinked = (id: string): void => {
    const node = activeZoneId ? firstNodeOf(id) : undefined;
    if (node) {
      handleNodeSelect(node.id);
      return;
    }
    setFilters({ search: "" });
    handleSelect(id);
  };

  const stepTour = React.useCallback(
    (delta: number): void => {
      if (tourStep === null) return;
      const next = tourStep + delta;
      if (next >= tourSteps.length) {
        setTourStep(null);
        openZone(null);
        return;
      }
      setTourStep(Math.max(0, next));
    },
    [tourStep, tourSteps.length],
  );

  React.useEffect(() => {
    if (tourStep === null || !tourSteps[tourStep]) return;
    openZone(tourSteps[tourStep].zoneId);
    setDetailOpen(false);
  }, [tourStep, tourSteps]);

  React.useEffect(() => {
    if (tourStep === null || reducedMotion) return undefined;
    const timer = window.setTimeout(() => stepTour(1), TOUR_STEP_MS);
    return () => window.clearTimeout(timer);
  }, [tourStep, reducedMotion, stepTour]);

  React.useEffect(() => {
    openZone(null);
    setTourStep(null);
  }, [spread?.id]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== "Escape") return;
      if (tourStep !== null) setTourStep(null);
      else if (detailOpen) setDetailOpen(false);
      else if (selectedNodeId) setSelectedNodeId(null);
      else if (activeZoneId) openZone(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tourStep, detailOpen, selectedNodeId, activeZoneId]);

  /** Adds the spread (or one zone) to the package, skipping what the compared BID already has. */
  const addLines = (zoneId?: string): void => {
    const zone = zoneId ? spread?.zones.find((z) => z.id === zoneId) : undefined;
    if (!spread || (zoneId && !zone)) return;
    const count = addSpreadToPackage(spread, zoneId, considered || undefined);
    const lines = (zone ? [zone] : spread.zones).reduce((n, z) => n + z.lines.length, 0);
    const target = comparison ? `${comparison.bid.bidNumber} package` : "bid package";
    addToast({
      type: "success",
      title: `${zone ? zone.title : spread.title} added to the ${target}`,
      message: comparison
        ? `${count} lines added · ${lines - count} already in ${comparison.bid.bidNumber}`
        : `${count} lines from ${spread.title}`,
    });
  };
  const handleAddSpread = (): void => addLines();
  const handleAddZone = (zoneId: string): void => addLines(zoneId);

  const handleConfirmAdd = (qty: number): void => {
    if (!adding) return;
    addToPackage(adding.id, qty);
    addToast({
      type: "success",
      title: "Added to bid package",
      message: `${qty} × ${adding.title}`,
    });
    setAddingId(null);
  };

  const ready = !!catalog && !listMissing && catalog.equipment.length > 0;

  const renderStage = (): React.ReactNode => {
    if (isLoading && !catalog) {
      return <SkeletonLoader height={620} borderRadius={16} />;
    }
    if (!ready || !catalog) {
      return (
        <EmptyState
          variant="glass"
          icon={<Radar size={32} />}
          title="The survey catalog is empty"
          description="Load it with “Import catalog” in the header."
        />
      );
    }
    return (
      <>
        {spread && (
          <div
            className={`${styles.spreadPanel} ${activeZoneId ? styles.spreadPanelOpen : ""}`}
            key={spread.id}
          >
            <SurveySpreadPanel
              spread={spread}
              catalog={catalog}
              activeZoneId={activeZoneId}
              selectedEquipmentId={detailOpen ? selectedId : null}
              packageEquipmentIds={packageEquipmentIds}
              catalogByZone={catalogByZone}
              considered={considered}
              bidNumber={comparison ? comparison.bid.bidNumber : null}
              onZoneToggle={handleZoneToggle}
              onSelectLine={handleSelectLine}
              onHoverLine={handleHoverLine}
              onAddZone={handleAddZone}
              onAddSpread={handleAddSpread}
            />
          </div>
        )}

        {detailOpen && selected && intel && (
          <div className={styles.detailDrawer}>
            <SurveyEquipmentDetail
              equipment={selected}
              catalog={catalog}
              intel={intel}
              packageQty={qtyOf(selected.id)}
              onAdd={() => setAddingId(selected.id)}
              onSelectEquipment={handleSelectLinked}
              onClose={() => setDetailOpen(false)}
            />
          </div>
        )}

        {adding && (
          <SurveyAddToPackageDialog
            key={adding.id}
            equipment={adding}
            currentQty={qtyOf(adding.id)}
            onConfirm={handleConfirmAdd}
            onClose={closeAdd}
          />
        )}
      </>
    );
  };

  return (
    <div className={styles.page}>
      {ready && (
        <div className={styles.sceneLayer}>
          <React.Suspense fallback={null}>
            <SurveySystemScene
              topInset={headerHeight}
              zones={sceneZones}
              trunks={trunks}
              focus={focus}
              spreadTitle={spread ? spread.title : ""}
              nodeStates={nodeStates}
              tracePath={tracePath}
              cableInfo={cableInfo}
              tour={tour}
              onZoneSelect={handleZoneSelect}
              onNodeSelect={handleNodeSelect}
              onNodeHover={setHoverNodeId}
              onCableHover={setHoverCableKey}
              onInteract={stopTour}
              onTourStart={() => setTourStep(0)}
              onTourStep={stepTour}
              onTourStop={stopTour}
            />
          </React.Suspense>
        </div>
      )}
      <div className={styles.overlay}>
        <div ref={headerRef} className={styles.headerLayer}>
          <SurveyPortalHeader
            view="system"
            onOpenPackage={() => setPackageOpen(true)}
            searchHits={searchHits}
            onSearchHit={handleNodeSelect}
          />
        </div>
        <div className={styles.body}>
          <div className={styles.stage}>{renderStage()}</div>
        </div>
      </div>
      {packageOpen && <SurveyPackageDrawer onClose={() => setPackageOpen(false)} />}
    </div>
  );
};
