import * as React from "react";
import { Radar, PackagePlus } from "lucide-react";
import { SurveyPortalHeader } from "../components/survey/SurveyPortalHeader";
import { SurveyEquipmentDetail } from "../components/survey/SurveyEquipmentDetail";
import { SurveyAddToPackageDialog } from "../components/survey/SurveyAddToPackageDialog";
import { SurveyPackageDrawer } from "../components/survey/SurveyPackageDrawer";
import type { SurveySceneLabel } from "../components/survey/SurveySystemScene";
import { EmptyState } from "../components/common/EmptyState";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { useSurveyStore } from "../stores/useSurveyStore";
import { useUIStore } from "../stores/useUIStore";
import {
  useFilteredSurveyEquipment,
  useSurveyBidIntel,
} from "../hooks/useSurveyPortal";
import { SurveySceneAnchor } from "../models";
import styles from "./SurveySystemPage.module.scss";

const SurveySystemScene = React.lazy(
  () =>
    import(
      /* webpackChunkName: "survey-3d" */ "../components/survey/SurveySystemScene"
    ),
);

export const SurveySystemPage: React.FC = () => {
  const catalog = useSurveyStore((s) => s.catalog);
  const isLoading = useSurveyStore((s) => s.isLoading);
  const listMissing = useSurveyStore((s) => s.listMissing);
  const filters = useSurveyStore((s) => s.filters);
  const selectedId = useSurveyStore((s) => s.selectedEquipmentId);
  const selectEquipment = useSurveyStore((s) => s.selectEquipment);
  const packageLines = useSurveyStore((s) => s.packageLines);
  const addToPackage = useSurveyStore((s) => s.addToPackage);
  const setFilters = useSurveyStore((s) => s.setFilters);
  const addToast = useUIStore((s) => s.addToast);
  const equipment = useFilteredSurveyEquipment();

  const [detailOpen, setDetailOpen] = React.useState(false);
  const [addingId, setAddingId] = React.useState<string | null>(null);
  const [packageOpen, setPackageOpen] = React.useState(false);
  const [systemId, setSystemId] = React.useState<string | null>(null);
  const [hoverAnchor, setHoverAnchor] = React.useState<SurveySceneAnchor | "">("");

  const systems = React.useMemo(
    () =>
      (catalog?.systems || []).filter(
        (s) => !filters.familyId || s.familyId === filters.familyId,
      ),
    [catalog, filters.familyId],
  );
  const system = systems.find((s) => s.id === systemId) || systems[0];

  const labels = React.useMemo<SurveySceneLabel[]>(() => {
    const byAnchor: Record<string, SurveySceneLabel> = {};
    const order: string[] = [];
    equipment.forEach((e) => {
      if (!e.sceneAnchor) return;
      if (!byAnchor[e.sceneAnchor]) {
        byAnchor[e.sceneAnchor] = { anchor: e.sceneAnchor, items: [] };
        order.push(e.sceneAnchor);
      }
      byAnchor[e.sceneAnchor].items.push({
        id: e.id,
        text: e.aliases[0] || e.title,
      });
    });
    return order.map((k) => byAnchor[k]);
  }, [equipment]);

  const selected = catalog?.equipment.find((e) => e.id === selectedId);
  const intel = useSurveyBidIntel(detailOpen ? selected : undefined);
  const adding = catalog?.equipment.find((e) => e.id === addingId);
  const qtyOf = (id: string): number =>
    packageLines.find((l) => l.equipmentId === id)?.qty || 0;

  const highlight: SurveySceneAnchor | "" =
    hoverAnchor || selected?.sceneAnchor || system?.sceneAnchor || "";

  const handleSelect = (id: string): void => {
    selectEquipment(id);
    setDetailOpen(true);
  };

  const handleSelectLinked = (id: string): void => {
    const eq = catalog?.equipment.find((e) => e.id === id);
    if (eq) setFilters({ familyId: eq.familyId, search: "" });
    handleSelect(id);
  };

  const handleAddSystem = (): void => {
    if (!system || !catalog) return;
    const ids = system.equipmentIds.filter((id) =>
      catalog.equipment.some((e) => e.id === id),
    );
    ids.forEach((id) => addToPackage(id, 1));
    addToast({
      type: "success",
      title: "System added to bid package",
      message: `${ids.length} equipment from ${system.title}`,
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

  const renderStage = (): React.ReactNode => {
    if (isLoading && !catalog) {
      return <SkeletonLoader height={620} borderRadius={16} />;
    }
    if (listMissing || !catalog || catalog.equipment.length === 0) {
      return (
        <EmptyState
          variant="glass"
          icon={<Radar size={32} />}
          title="The survey catalog is empty"
          description="An administrator can load it with “Import catalog” from the header."
        />
      );
    }
    return (
      <div className={styles.stage}>
        <React.Suspense fallback={<SkeletonLoader height="100%" borderRadius={16} />}>
          <SurveySystemScene
            labels={labels}
            highlight={highlight}
            selectedId={detailOpen ? selectedId : null}
            onSelect={handleSelect}
          />
        </React.Suspense>

        {system && (
          <div className={styles.systemPanel}>
            {systems.length > 1 && (
              <div className={styles.systemTabs}>
                {systems.map((s) => (
                  <button
                    key={s.id}
                    className={s.id === system.id ? styles.systemTabActive : ""}
                    onClick={() => setSystemId(s.id)}
                    onMouseEnter={() => setHoverAnchor(s.sceneAnchor)}
                    onMouseLeave={() => setHoverAnchor("")}
                  >
                    {s.title.replace(/^Survey\s*-\s*/i, "")}
                  </button>
                ))}
              </div>
            )}
            <span className={styles.systemEyebrow}>SURVEY SYSTEM</span>
            <h3 className={styles.systemTitle}>{system.title}</h3>
            {system.description && (
              <p className={styles.systemDesc}>{system.description}</p>
            )}
            <ul className={styles.systemList}>
              {system.components.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {system.equipmentIds.length > 0 && (
              <button className={styles.systemAdd} onClick={handleAddSystem}>
                <PackagePlus size={13} /> Add system to package
              </button>
            )}
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
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <SurveyPortalHeader
        view="system"
        resultCount={equipment.length}
        onOpenPackage={() => setPackageOpen(true)}
      />
      {renderStage()}
      {adding && (
        <SurveyAddToPackageDialog
          equipment={adding}
          currentQty={qtyOf(adding.id)}
          onConfirm={handleConfirmAdd}
          onClose={() => setAddingId(null)}
        />
      )}
      {packageOpen && <SurveyPackageDrawer onClose={() => setPackageOpen(false)} />}
    </div>
  );
};
