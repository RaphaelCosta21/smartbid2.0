import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LayoutGrid,
  Box,
  Package,
  Upload,
  ChevronDown,
} from "lucide-react";
import { ROUTES } from "../../config/routes.config";
import { useSurveyStore } from "../../stores/useSurveyStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useUIStore } from "../../stores/useUIStore";
import { isSuperAdmin } from "../../utils/accessControl";
import { SurveyCatalogService } from "../../services/SurveyCatalogService";
import { ISurveyCatalog } from "../../models";
import styles from "./SurveyPortalHeader.module.scss";

interface SurveyPortalHeaderProps {
  view: "equipment" | "system";
  resultCount: number;
  onOpenPackage: () => void;
}

const uniq = (values: string[]): string[] =>
  values
    .filter((v, i) => !!v && values.indexOf(v) === i)
    .sort((a, b) => a.localeCompare(b));

export const SurveyPortalHeader: React.FC<SurveyPortalHeaderProps> = ({
  view,
  resultCount,
  onOpenPackage,
}) => {
  const navigate = useNavigate();
  const catalog = useSurveyStore((s) => s.catalog);
  const filters = useSurveyStore((s) => s.filters);
  const setFilters = useSurveyStore((s) => s.setFilters);
  const packageLines = useSurveyStore((s) => s.packageLines);
  const load = useSurveyStore((s) => s.load);
  const currentUser = useAuthStore((s) => s.currentUser);
  const addToast = useUIStore((s) => s.addToast);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [importing, setImporting] = React.useState(false);

  const canImport =
    !!currentUser.isSuperAdmin || isSuperAdmin(currentUser.email || "");
  const equipment = catalog?.equipment || [];
  const families = catalog?.families || [];
  const family = families.find((f) => f.id === filters.familyId);
  const packageQty = packageLines.reduce((sum, l) => sum + l.qty, 0);

  const divisions = React.useMemo(() => {
    const all: string[] = [];
    equipment.forEach((e) => e.divisions.forEach((d) => all.push(d)));
    return uniq(all);
  }, [equipment]);
  const serviceLines = React.useMemo(() => {
    const all: string[] = [];
    equipment.forEach((e) => e.serviceLines.forEach((d) => all.push(d)));
    return uniq(all);
  }, [equipment]);
  const statuses = React.useMemo(
    () => uniq(equipment.map((e) => e.status)),
    [equipment],
  );

  const handleImport = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
      const parsed = JSON.parse(await file.text()) as ISurveyCatalog;
      if (
        !Array.isArray(parsed.families) ||
        !Array.isArray(parsed.equipment) ||
        !Array.isArray(parsed.systems)
      ) {
        throw new Error("Expected { families, equipment, systems } arrays");
      }
      const count = await SurveyCatalogService.importCatalog(parsed);
      addToast({
        type: "success",
        title: "Survey catalog imported",
        message: `${count} entries written to SharePoint.`,
      });
      await load(true);
    } catch (err) {
      console.error("Survey catalog import failed:", err);
      addToast({
        type: "error",
        title: "Import failed",
        message: (err as Error).message,
      });
    } finally {
      setImporting(false);
    }
  };

  const renderSelect = (
    value: string,
    placeholder: string,
    options: string[],
    onChange: (v: string) => void,
  ): React.ReactNode => (
    <label className={styles.filterChip}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown size={10} />
    </label>
  );

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <div className={styles.breadcrumb}>
          <span>SURVEY BID INTELLIGENCE</span>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbActive}>
            {view === "equipment" ? "EQUIPMENT EXPLORER" : "SYSTEM VIEW"}
          </span>
        </div>
        <div className={styles.topActions}>
          {canImport && (
            <>
              <button
                className={styles.ghostBtn}
                onClick={() => fileRef.current?.click()}
                disabled={importing}
                title="Import catalog JSON into SharePoint"
              >
                <Upload size={12} />
                {importing ? "Importing…" : "Import catalog"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={handleImport}
              />
            </>
          )}
          <button className={styles.packageBtn} onClick={onOpenPackage}>
            <Package size={13} />
            Bid package
            <span className={styles.packageCount}>{packageQty}</span>
          </button>
        </div>
      </div>

      <div className={styles.hero}>
        <div className={styles.sonar} aria-hidden />
        <div className={styles.heroRow}>
          <div className={styles.titleGroup}>
            <span className={styles.eyebrow}>EQUIPMENT EXPLORER</span>
            <h1 className={styles.title}>
              {view === "equipment" ? "Survey Equipments" : "Survey System"}
            </h1>
            <p className={styles.subtitle}>
              Explore the systems, equipment and technologies behind our Survey
              capabilities.
            </p>
          </div>

          <div className={styles.searchArea}>
            <div className={styles.searchInput}>
              <Search size={16} />
              <input
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                placeholder="Search equipment, alias or technology..."
              />
              <span className={styles.aliasHint}>ALIASES SUPPORTED</span>
            </div>
            <div className={styles.filterRow}>
              {renderSelect(filters.division, "All Divisions", divisions, (v) =>
                setFilters({ division: v }),
              )}
              {renderSelect(
                filters.serviceLine,
                "All Service Lines",
                serviceLines,
                (v) => setFilters({ serviceLine: v }),
              )}
              {renderSelect(filters.status, "All Statuses", statuses, (v) =>
                setFilters({ status: v }),
              )}
              <span className={styles.spacer} />
              <div className={styles.viewToggle} role="tablist">
                <button
                  role="tab"
                  aria-selected={view === "equipment"}
                  className={view === "equipment" ? styles.viewActive : ""}
                  onClick={() => navigate(ROUTES.surveyEquipment)}
                  title="Equipment explorer"
                >
                  <LayoutGrid size={12} />
                </button>
                <button
                  role="tab"
                  aria-selected={view === "system"}
                  className={view === "system" ? styles.viewActive : ""}
                  onClick={() => navigate(ROUTES.surveySystem)}
                  title="3D system view"
                >
                  <Box size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {families.length > 0 && (
        <div className={styles.familyBar}>
          <div className={styles.familyCopy}>
            <span className={styles.familyEyebrow}>
              {String(
                Math.max(1, families.findIndex((f) => f.id === filters.familyId) + 1),
              ).padStart(2, "0")}{" "}
              / SELECTED FAMILY
            </span>
            <h2 className={styles.familyTitle}>{family?.title || "All families"}</h2>
            {family?.description && (
              <p className={styles.familyDesc}>{family.description}</p>
            )}
          </div>
          <div className={styles.familyRight}>
            <div className={styles.familyTabs}>
              {families.map((f) => (
                <button
                  key={f.id}
                  className={`${styles.familyTab} ${f.id === filters.familyId ? styles.familyTabActive : ""}`}
                  onClick={() => setFilters({ familyId: f.id })}
                >
                  {f.title}
                </button>
              ))}
            </div>
            <span className={styles.resultCount}>
              {resultCount} EQUIPMENT RESULTS
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
