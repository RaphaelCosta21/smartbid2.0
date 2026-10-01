import * as React from "react";
import { ChevronDown, PackagePlus } from "lucide-react";
import { ISurveyCatalog, ISurveySpread } from "../../models";
import styles from "./SurveySpreadPanel.module.scss";

interface SurveySpreadPanelProps {
  spreads: ISurveySpread[];
  spread: ISurveySpread;
  catalog: ISurveyCatalog;
  activeZoneId: string | null;
  selectedEquipmentId: string | null;
  packageEquipmentIds: string[];
  /** Catalog equipment outside the spread, by zone (reference only, never added to the package). */
  catalogByZone: Record<string, string[]>;
  onSpreadChange: (spreadId: string) => void;
  onZoneToggle: (zoneId: string) => void;
  onSelectLine: (zoneId: string, equipmentId: string) => void;
  onHoverLine: (equipmentId: string | null) => void;
  onAddZone: (zoneId: string) => void;
  onAddSpread: () => void;
}

const ZONE_TONES = [styles.tone0, styles.tone1, styles.tone2];

export const SurveySpreadPanel: React.FC<SurveySpreadPanelProps> = ({
  spreads,
  spread,
  catalog,
  activeZoneId,
  selectedEquipmentId,
  packageEquipmentIds,
  catalogByZone,
  onSpreadChange,
  onZoneToggle,
  onSelectLine,
  onHoverLine,
  onAddZone,
  onAddSpread,
}) => {
  const titleOf = (id: string): string =>
    catalog.equipment.find((e) => e.id === id)?.title || id;

  return (
    <div className={styles.panel}>
      {spreads.length > 1 && (
        <div className={styles.tabs}>
          {spreads.map((s) => (
            <button
              key={s.id}
              className={s.id === spread.id ? styles.tabActive : ""}
              onClick={() => onSpreadChange(s.id)}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}
      <span className={styles.eyebrow}>
        SPREAD TEMPLATE{spread.drawingNo ? ` · DWG ${spread.drawingNo}` : ""}
        {spread.revision ? ` REV ${spread.revision}` : ""}
      </span>
      <h3 className={styles.title}>{spread.title}</h3>

      <ul className={styles.zones}>
        {spread.zones.map((zone, i) => {
          const open = zone.id === activeZoneId;
          const vessel = zone.lines.filter((l) => l.vesselSupplied).length;
          return (
            <li key={zone.id} className={`${ZONE_TONES[i % ZONE_TONES.length]} ${open ? styles.zoneOpen : ""}`}>
              <button
                className={styles.zoneRow}
                aria-expanded={open}
                onClick={() => onZoneToggle(zone.id)}
              >
                <span className={styles.zoneDot} />
                <span className={styles.zoneTitle}>{zone.title}</span>
                <span className={styles.zoneMeta}>
                  {zone.lines.length} items
                  {vessel > 0 && <span className={styles.vesselTag}>{vessel} vessel</span>}
                </span>
                <ChevronDown size={12} className={styles.chevron} />
              </button>

              {open && (
                <div className={styles.zoneBody}>
                  <ul className={styles.lines}>
                    {zone.lines.map((line) => {
                      const inPackage = packageEquipmentIds.indexOf(line.equipmentId) >= 0;
                      return (
                        <li key={line.equipmentId}>
                          <button
                            className={`${styles.line} ${
                              line.equipmentId === selectedEquipmentId ? styles.lineSelected : ""
                            }`}
                            onClick={() => onSelectLine(zone.id, line.equipmentId)}
                            onMouseEnter={() => onHoverLine(line.equipmentId)}
                            onMouseLeave={() => onHoverLine(null)}
                          >
                            <span className={styles.lineQty}>×{line.qty}</span>
                            <span className={styles.lineCopy}>
                              <span className={styles.lineTitle}>{titleOf(line.equipmentId)}</span>
                              {line.qtyLabel && (
                                <span className={styles.lineNote}>{line.qtyLabel}</span>
                              )}
                            </span>
                            {line.vesselSupplied && <span className={styles.vesselTag}>vessel</span>}
                            {inPackage && (
                              <span className={styles.packageDot} title="Already in the bid package" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {(catalogByZone[zone.id] || []).length > 0 && (
                    <>
                      <span className={styles.subhead}>
                        ALSO IN THE CATALOG · {catalogByZone[zone.id].length}
                      </span>
                      <ul className={styles.lines}>
                        {catalogByZone[zone.id].map((id) => (
                          <li key={id}>
                            <button
                              className={`${styles.line} ${styles.lineCatalog} ${
                                id === selectedEquipmentId ? styles.lineSelected : ""
                              }`}
                              onClick={() => onSelectLine(zone.id, id)}
                              onMouseEnter={() => onHoverLine(id)}
                              onMouseLeave={() => onHoverLine(null)}
                            >
                              <span className={styles.lineCopy}>
                                <span className={styles.lineTitle}>{titleOf(id)}</span>
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <button className={styles.addZone} onClick={() => onAddZone(zone.id)}>
                    <PackagePlus size={12} /> ADD {zone.title.toUpperCase()} TO PACKAGE
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <button className={styles.addSpread} onClick={onAddSpread}>
        <PackagePlus size={13} /> ADD FULL SPREAD TO PACKAGE
      </button>
    </div>
  );
};
