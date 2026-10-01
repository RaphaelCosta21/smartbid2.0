import * as React from "react";
import { Radar } from "lucide-react";
import { SurveyPortalHeader } from "../components/survey/SurveyPortalHeader";
import { SurveyEquipmentDetail } from "../components/survey/SurveyEquipmentDetail";
import { SurveyAddToPackageDialog } from "../components/survey/SurveyAddToPackageDialog";
import { SurveyPackageDrawer } from "../components/survey/SurveyPackageDrawer";
import { SurveySpreadPanel } from "../components/survey/SurveySpreadPanel";
import type { SurveySceneTour } from "../components/survey/SurveySystemScene";
import type {
  SceneFocus,
  SceneNodeStates,
  SceneZone,
} from "../components/survey/survey3d/sceneTypes";
import { EmptyState } from "../components/common/EmptyState";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { useSurveyStore } from "../stores/useSurveyStore";
import { useUIStore } from "../stores/useUIStore";
import {
  useFilteredSurveyEquipment,
  useSurveyBidIntel,
} from "../hooks/useSurveyPortal";
import { SurveySceneAnchor } from "../models";
import {
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
/** Tour reads topside → umbilical → subsea, whatever the zone order in the data. */
const TOUR_DEPTH: Partial<Record<SurveySceneAnchor, number>> = {
  umbilical: 1,
  rov: 2,
  beacons: 2,
  seabed: 2,
  "subsea-target": 2,
};

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
  const addToast = useUIStore((s) => s.addToast);
  const equipment = useFilteredSurveyEquipment();

  const [detailOpen, setDetailOpen] = React.useState(false);
  const [addingId, setAddingId] = React.useState<string | null>(null);
  const [packageOpen, setPackageOpen] = React.useState(false);
  const [spreadId, setSpreadId] = React.useState<string | null>(null);
  const [activeZoneId, setActiveZoneId] = React.useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [hoverNodeId, setHoverNodeId] = React.useState<string | null>(null);
  const [tourStep, setTourStep] = React.useState<number | null>(null);
  const reducedMotion = React.useMemo(
    () =>
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

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
  const sceneZones = React.useMemo<SceneZone[]>(
    () =>
      (spread?.zones || []).map((z, i) => ({
        id: z.id,
        title: z.title,
        anchor: z.sceneAnchor,
        colorIndex: i,
        count: z.lines.length,
      })),
    [spread],
  );
  const focus = React.useMemo<SceneFocus | null>(() => {
    const zone = spread?.zones.find((z) => z.id === activeZoneId);
    if (!zone || !catalog) return null;
    const inZone: Record<string, boolean> = {};
    const sceneNodes = nodes
      .filter((n) => n.zoneId === zone.id)
      .map((n) => {
        inZone[n.id] = true;
        const eq = catalog.equipment.find((e) => e.id === n.equipmentId)!;
        return {
          id: n.id,
          equipmentId: n.equipmentId,
          label: n.label,
          shape: resolveSceneShape(eq),
          modelUrl: eq.modelUrl || null,
          anchor: n.anchor,
          vesselSupplied: n.vesselSupplied,
          catalog: n.source === "catalog",
        };
      });
    return {
      zoneId: zone.id,
      anchor: zone.sceneAnchor,
      nodes: sceneNodes,
      links: links
        .filter((l) => inZone[l.from] && inZone[l.to])
        .map((l) => ({ key: l.key, from: l.from, to: l.to, kind: l.kind })),
    };
  }, [spread, activeZoneId, catalog, nodes, links]);

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
  const nodeStates = React.useMemo<SceneNodeStates>(
    () => ({
      selectedNodeId,
      hoverNodeId,
      packageEquipmentIds,
      traceNodeIds: trace ? trace.nodeIds : [],
      traceLinkKeys: trace ? trace.linkKeys : [],
    }),
    [selectedNodeId, hoverNodeId, packageEquipmentIds, trace],
  );
  const tracePath = React.useMemo(
    () =>
      trace
        ? trace.nodeIds.map((id) => ({
            id,
            label: nodes.find((n) => n.id === id)?.label || id,
          }))
        : null,
    [trace, nodes],
  );

  const tourSteps = React.useMemo(() => {
    if (!spread) return [];
    const depth = (a: SurveySceneAnchor): number => TOUR_DEPTH[a] || 0;
    const ordered = spread.zones
      .slice()
      .sort((a, b) => depth(a.sceneAnchor) - depth(b.sceneAnchor));
    return [
      { zoneId: null as string | null, title: spread.title, caption: spread.description },
      ...ordered.map((z) => ({ zoneId: z.id as string | null, title: z.title, caption: z.description })),
    ];
  }, [spread]);
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
    const node = nodes.find((n) => n.id === nodeId);
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
    const eq = catalog?.equipment.find((e) => e.id === id);
    if (eq) setFilters({ familyId: eq.familyId, search: "" });
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

  const handleAddSpread = (): void => {
    if (!spread) return;
    const count = addSpreadToPackage(spread);
    addToast({
      type: "success",
      title: "Spread added to bid package",
      message: `${count} lines from ${spread.title}`,
    });
  };

  const handleAddZone = (zoneId: string): void => {
    const zone = spread?.zones.find((z) => z.id === zoneId);
    if (!spread || !zone) return;
    const count = addSpreadToPackage(spread, zoneId);
    addToast({
      type: "success",
      title: `${zone.title} added to bid package`,
      message: `${count} lines from ${spread.title}`,
    });
  };

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
              spreads={spreads}
              spread={spread}
              catalog={catalog}
              activeZoneId={activeZoneId}
              selectedEquipmentId={detailOpen ? selectedId : null}
              packageEquipmentIds={packageEquipmentIds}
              catalogByZone={catalogByZone}
              onSpreadChange={setSpreadId}
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
              focus={focus}
              spreadTitle={spread ? spread.title : ""}
              nodeStates={nodeStates}
              tracePath={tracePath}
              tour={tour}
              onZoneSelect={handleZoneSelect}
              onNodeSelect={handleNodeSelect}
              onNodeHover={setHoverNodeId}
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
            resultCount={equipment.length}
            onOpenPackage={() => setPackageOpen(true)}
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
