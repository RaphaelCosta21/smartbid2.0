import * as React from "react";
import { useNavigate } from "react-router-dom";
import { X, Minus, Plus, Trash2, FilePlus2, FolderInput } from "lucide-react";
import { ROUTES } from "../../config/routes.config";
import { useSurveyStore } from "../../stores/useSurveyStore";
import { useBidStore } from "../../stores/useBidStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useUIStore } from "../../stores/useUIStore";
import { BidService } from "../../services/BidService";
import { buildScopeItemsFromPackage } from "../../utils/surveyPackage";
import { EmptyState } from "../common/EmptyState";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { IBid } from "../../models";
import { SurveyEquipmentPhoto } from "./SurveyEquipmentCard";
import styles from "./SurveyPackageDrawer.module.scss";

interface SurveyPackageDrawerProps {
  onClose: () => void;
}

const CLOSED_STATUSES = ["Completed", "Canceled", "Cancelled"];

export const SurveyPackageDrawer: React.FC<SurveyPackageDrawerProps> = ({
  onClose,
}) => {
  const navigate = useNavigate();
  const catalog = useSurveyStore((s) => s.catalog);
  const lines = useSurveyStore((s) => s.packageLines);
  const setQty = useSurveyStore((s) => s.setPackageQty);
  const remove = useSurveyStore((s) => s.removeFromPackage);
  const clearPackage = useSurveyStore((s) => s.clearPackage);
  const startRequest = useSurveyStore((s) => s.startRequestFromPackage);
  const bidNumber = useSurveyStore((s) => s.bidNumber);
  const bids = useBidStore((s) => s.bids);
  const refreshBids = useBidStore((s) => s.refreshBids);
  const hasAccess = useAuthStore((s) => s.hasAccess);
  const addToast = useUIStore((s) => s.addToast);

  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [target, setTarget] = React.useState<IBid | null>(null);
  const [saving, setSaving] = React.useState(false);

  const canEditBids = hasAccess("workspace", "edit");
  // The BID compared in the portal header is the package's default destination.
  const linkedBid = bidNumber ? bids.find((b) => b.bidNumber === bidNumber) : undefined;
  const linkedOpen = !!linkedBid && CLOSED_STATUSES.indexOf(linkedBid.currentStatus) < 0;

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && !target) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, target]);

  const openBids = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return bids
      .filter((b) => CLOSED_STATUSES.indexOf(b.currentStatus) < 0)
      .filter(
        (b) =>
          !q ||
          (b.bidNumber || "").toLowerCase().includes(q) ||
          (b.crmNumber || "").toLowerCase().includes(q) ||
          (b.opportunityInfo?.client || "").toLowerCase().includes(q) ||
          (b.opportunityInfo?.projectName || "").toLowerCase().includes(q),
      )
      .slice(0, 30);
  }, [bids, query]);

  const handleNewRequest = (): void => {
    startRequest();
    onClose();
    navigate(ROUTES.createRequest);
  };

  const handleAddToBid = async (): Promise<void> => {
    if (!target || !catalog || saving) return;
    setSaving(true);
    try {
      const fresh = await BidService.getByBidNumber(target.bidNumber);
      const existing = (fresh || target).scopeItems || [];
      const maxLine = existing.reduce(
        (m, s) => (s.isSection ? m : Math.max(m, s.lineNumber || 0)),
        0,
      );
      const added = buildScopeItemsFromPackage(lines, catalog, maxLine + 1);
      await BidService.patchByBidNumber(target.bidNumber, {
        scopeItems: [...existing, ...added],
        lastModified: new Date().toISOString(),
      });
      await refreshBids();
      addToast({
        type: "success",
        title: "Package added to BID",
        message: `${added.filter((s) => !s.isSection).length} scope items appended to ${target.bidNumber}.`,
      });
      clearPackage();
      onClose();
      navigate(`/bid/${target.bidNumber}`);
    } catch (err) {
      console.error("Failed to add survey package to BID:", err);
      addToast({
        type: "error",
        title: "Could not update the BID",
        message: "Please try again.",
      });
    } finally {
      setSaving(false);
      setTarget(null);
    }
  };

  return (
    <>
    <div className={styles.overlay} onClick={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Bid package"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.head}>
          <div>
            <span className={styles.eyebrow}>
              SURVEY PORTAL{linkedBid ? ` · ${linkedBid.bidNumber}` : ""}
            </span>
            <h3 className={styles.title}>Bid package</h3>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            <X size={14} />
          </button>
        </div>

        <div className={styles.body}>
          {lines.length === 0 || !catalog ? (
            <EmptyState
              title="Your package is empty"
              description="Use the + button on any equipment to add it here."
            />
          ) : (
            lines.map((line) => {
              const eq = catalog.equipment.find((e) => e.id === line.equipmentId);
              if (!eq) return null;
              return (
                <div key={line.equipmentId} className={styles.line}>
                  <SurveyEquipmentPhoto equipment={eq} size={40} />
                  <div className={styles.lineCopy}>
                    <span className={styles.lineTitle}>{eq.title}</span>
                    <span className={styles.lineMeta}>
                      {line.vesselSupplied
                        ? "VESSEL SUPPLIED — NOT PRICED"
                        : eq.partNumber
                          ? `PN ${eq.partNumber}`
                          : eq.technology}
                      {line.qtyLabel ? ` · ${line.qtyLabel}` : ""}
                    </span>
                  </div>
                  <div className={styles.stepper}>
                    <button
                      onClick={() => setQty(eq.id, line.qty - 1)}
                      disabled={line.qty <= 1}
                      aria-label="Decrease"
                    >
                      <Minus size={11} />
                    </button>
                    <span>{line.qty}</span>
                    <button
                      onClick={() => setQty(eq.id, line.qty + 1)}
                      aria-label="Increase"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                  <button
                    className={styles.remove}
                    onClick={() => remove(eq.id)}
                    aria-label={`Remove ${eq.title}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
          )}

          {pickerOpen && lines.length > 0 && (
            <div className={styles.picker}>
              <input
                className={styles.pickerSearch}
                placeholder="Search BID number, CRM, client or project…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <div className={styles.pickerList}>
                {openBids.length === 0 ? (
                  <span className={styles.pickerEmpty}>No open BIDs found.</span>
                ) : (
                  openBids.map((b) => (
                    <button
                      key={b.bidNumber}
                      className={styles.pickerItem}
                      onClick={() => setTarget(b)}
                    >
                      <span className={styles.pickerNumber}>{b.bidNumber}</span>
                      <span className={styles.pickerText}>
                        {b.opportunityInfo?.client || "—"} ·{" "}
                        {b.opportunityInfo?.projectName || ""}
                      </span>
                      <span className={styles.pickerStatus}>{b.currentStatus}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className={styles.actions}>
            {canEditBids && linkedBid && (
              <button
                className={styles.primary}
                onClick={() => setTarget(linkedBid)}
                disabled={!linkedOpen}
                title={linkedOpen ? undefined : `${linkedBid.bidNumber} is ${linkedBid.currentStatus}`}
              >
                <FolderInput size={14} /> Add to {linkedBid.bidNumber}
              </button>
            )}
            <button
              className={linkedBid && canEditBids ? styles.secondary : styles.primary}
              onClick={handleNewRequest}
            >
              <FilePlus2 size={14} /> Create new request
            </button>
            {canEditBids && (
              <button
                className={styles.secondary}
                onClick={() => setPickerOpen((o) => !o)}
              >
                <FolderInput size={14} /> {linkedBid ? "Add to another BID" : "Add to existing BID"}
              </button>
            )}
            <button className={styles.link} onClick={clearPackage}>
              Clear package
            </button>
          </div>
        )}
      </aside>
    </div>

      {target && (
        <ConfirmDialog
          isOpen={!!target}
          title={`Add package to ${target.bidNumber}?`}
          message="The package items are appended to the end of the BID's Scope of Supply. Anyone editing this BID right now should reload before saving."
          confirmLabel={saving ? "Adding…" : "Add to BID"}
          onConfirm={handleAddToBid}
          onCancel={() => setTarget(null)}
        />
      )}
    </>
  );
};
