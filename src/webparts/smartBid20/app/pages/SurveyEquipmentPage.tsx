import * as React from "react";
import { Radar } from "lucide-react";
import { SurveyPortalHeader } from "../components/survey/SurveyPortalHeader";
import { SurveyEquipmentCard } from "../components/survey/SurveyEquipmentCard";
import { SurveyEquipmentDetail } from "../components/survey/SurveyEquipmentDetail";
import { SurveyAddToPackageDialog } from "../components/survey/SurveyAddToPackageDialog";
import { SurveyPackageDrawer } from "../components/survey/SurveyPackageDrawer";
import { SURVEY_OCEAN_BG } from "../components/survey/surveyAssets";
import { EmptyState } from "../components/common/EmptyState";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { useSurveyStore } from "../stores/useSurveyStore";
import { useUIStore } from "../stores/useUIStore";
import {
  useFilteredSurveyEquipment,
  useSurveyBidComparison,
  useSurveyBidIntel,
} from "../hooks/useSurveyPortal";
import styles from "./SurveyEquipmentPage.module.scss";

export const SurveyEquipmentPage: React.FC = () => {
  const catalog = useSurveyStore((s) => s.catalog);
  const isLoading = useSurveyStore((s) => s.isLoading);
  const listMissing = useSurveyStore((s) => s.listMissing);
  const error = useSurveyStore((s) => s.error);
  const selectedId = useSurveyStore((s) => s.selectedEquipmentId);
  const selectEquipment = useSurveyStore((s) => s.selectEquipment);
  const packageLines = useSurveyStore((s) => s.packageLines);
  const addToPackage = useSurveyStore((s) => s.addToPackage);
  const setFilters = useSurveyStore((s) => s.setFilters);
  const addToast = useUIStore((s) => s.addToast);
  const equipment = useFilteredSurveyEquipment();
  const comparison = useSurveyBidComparison();

  const [addingId, setAddingId] = React.useState<string | null>(null);
  const [packageOpen, setPackageOpen] = React.useState(false);

  const selected =
    equipment.find((e) => e.id === selectedId) || equipment[0];
  const intel = useSurveyBidIntel(selected);
  const adding = catalog?.equipment.find((e) => e.id === addingId);
  const qtyOf = (id: string): number =>
    packageLines.find((l) => l.equipmentId === id)?.qty || 0;
  const closeAdd = React.useCallback(() => setAddingId(null), []);

  // Keep the store in sync so the header shows the equipment on screen.
  React.useEffect(() => {
    if (selected && selected.id !== selectedId) selectEquipment(selected.id);
  }, [selected, selectedId, selectEquipment]);

  const handleSelectLinked = (id: string): void => {
    const eq = catalog?.equipment.find((e) => e.id === id);
    if (eq) setFilters({ familyId: eq.familyId, search: "" });
    selectEquipment(id);
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

  const renderBody = (): React.ReactNode => {
    if (isLoading && !catalog) {
      return (
        <div className={styles.grid}>
          <SkeletonLoader height={248} borderRadius={16} count={4} />
        </div>
      );
    }
    if (error) {
      return <EmptyState variant="glass" title="Survey catalog unavailable" description={error} />;
    }
    if (listMissing || !catalog || catalog.equipment.length === 0) {
      return (
        <EmptyState
          variant="glass"
          icon={<Radar size={32} />}
          title="The survey catalog is empty"
          description="Load it with “Import catalog” in the header (templates/survey-catalog/survey-catalog.seed.json) or by adding rows to the smartbid-survey-catalog list."
        />
      );
    }
    return (
      <div className={styles.content}>
        <div className={styles.grid}>
          {equipment.length === 0 ? (
            <EmptyState
              variant="glass"
              title="No equipment matches these filters"
              description="Try another family, division or search term."
            />
          ) : (
            equipment.map((e) => (
              <SurveyEquipmentCard
                key={e.id}
                equipment={e}
                selected={selected?.id === e.id}
                inPackage={qtyOf(e.id) > 0}
                outOfBid={!!comparison && !comparison.considered[e.id]}
                onSelect={() => selectEquipment(e.id)}
                onAdd={() => {
                  selectEquipment(e.id);
                  setAddingId(e.id);
                }}
              />
            ))
          )}
        </div>
        <div className={styles.detail}>
          {selected && intel && (
            <SurveyEquipmentDetail
              equipment={selected}
              catalog={catalog}
              intel={intel}
              packageQty={qtyOf(selected.id)}
              onAdd={() => setAddingId(selected.id)}
              onSelectEquipment={handleSelectLinked}
            />
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
        </div>
      </div>
    );
  };

  return (
    <div
      className={styles.page}
      style={{ backgroundImage: `url(${SURVEY_OCEAN_BG})` }}
    >
      <SurveyPortalHeader
        view="equipment"
        resultCount={equipment.length}
        onOpenPackage={() => setPackageOpen(true)}
      />
      <div className={styles.body}>{renderBody()}</div>
      {packageOpen && <SurveyPackageDrawer onClose={() => setPackageOpen(false)} />}
    </div>
  );
};
