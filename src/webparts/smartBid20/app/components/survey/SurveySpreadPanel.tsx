import * as React from "react";
import { Check, ChevronDown, PackagePlus } from "lucide-react";
import { ISurveyCatalog, ISurveySpread, ISurveySpreadZone } from "../../models";
import styles from "./SurveySpreadPanel.module.scss";

interface SurveySpreadPanelProps {
  spread: ISurveySpread;
  catalog: ISurveyCatalog;
  activeZoneId: string | null;
  selectedEquipmentId: string | null;
  packageEquipmentIds: string[];
  /** Catalog equipment outside the spread, by zone (reference only, never added to the package). */
  catalogByZone: Record<string, string[]>;
  /** Equipment the compared BID already considers; null when no BID is selected. */
  considered: Record<string, boolean> | null;
  bidNumber: string | null;
  onZoneToggle: (zoneId: string) => void;
  onSelectLine: (zoneId: string, equipmentId: string) => void;
  onHoverLine: (equipmentId: string | null) => void;
  onAddZone: (zoneId: string) => void;
  onAddSpread: () => void;
}

/** Most frequent category of a zone; lines in another category get a tag. */
const mainCategory = (zone: ISurveySpreadZone): string | undefined => {
  const counts: Record<string, number> = {};
  let best: string | undefined;
  zone.lines.forEach((l) => {
    if (!l.category) return;
    counts[l.category] = (counts[l.category] || 0) + 1;
    if (!best || counts[l.category] > counts[best]) best = l.category;
  });
  return best;
};

export const SurveySpreadPanel: React.FC<SurveySpreadPanelProps> = ({
  spread,
  catalog,
  activeZoneId,
  selectedEquipmentId,
  packageEquipmentIds,
  catalogByZone,
  considered,
  bidNumber,
  onZoneToggle,
  onSelectLine,
  onHoverLine,
  onAddZone,
  onAddSpread,
}) => {
  const titleOf = (id: string): string =>
    catalog.equipment.find((e) => e.id === id)?.title || id;
  const categoryTitle: Record<string, string> = {};
  (spread.categories || []).forEach((c) => (categoryTitle[c.id] = c.title));
  const rooms = spread.zones.filter((z) => !!z.sceneAnchor);
  const categoryTotals = (spread.categories || [])
    .map((c) => ({
      ...c,
      qty: spread.zones.reduce(
        (sum, z) => sum + z.lines.filter((l) => l.category === c.id).reduce((s, l) => s + l.qty, 0),
        0,
      ),
    }))
    .filter((c) => c.qty > 0);
  // Vessel-supplied lines are not priced, so they never count against the BID.
  const priced = (lines: ISurveySpreadZone["lines"]) => lines.filter((l) => !l.vesselSupplied);
  const inBid = (lines: ISurveySpreadZone["lines"]): number =>
    considered ? priced(lines).filter((l) => considered[l.equipmentId]).length : 0;
  const allLines: ISurveySpreadZone["lines"] = [];
  spread.zones.forEach((z) => z.lines.forEach((l) => allLines.push(l)));

  return (
    <div className={styles.panel}>
      <span className={styles.eyebrow}>
        SPREAD TEMPLATE{spread.drawingNo ? ` · DWG ${spread.drawingNo}` : ""}
        {spread.revision ? ` REV ${spread.revision}` : ""}
      </span>
      <h3 className={styles.title}>{spread.title}</h3>
      {considered && bidNumber && (
        <div className={styles.bidBanner}>
          <span>
            Compared with <strong>{bidNumber}</strong>
          </span>
          <span className={styles.bidScore}>
            {inBid(allLines)}/{priced(allLines).length} considered
          </span>
        </div>
      )}

      <ul className={styles.zones}>
        {spread.zones.map((zone) => {
          const open = zone.id === activeZoneId;
          const vessel = zone.lines.filter((l) => l.vesselSupplied).length;
          const room = rooms.indexOf(zone);
          const tone = room >= 0 ? styles.toneRoom : styles.toneNeutral;
          const main = mainCategory(zone);
          return (
            <li key={zone.id} className={`${tone} ${open ? styles.zoneOpen : ""}`}>
              <button
                className={styles.zoneRow}
                aria-expanded={open}
                onClick={() => onZoneToggle(zone.id)}
              >
                <span className={styles.zoneDot} />
                <span className={styles.zoneTitle}>{zone.title}</span>
                <span className={styles.zoneMeta}>
                  {considered
                    ? `${inBid(zone.lines)}/${priced(zone.lines).length} in BID`
                    : `${zone.lines.length} items`}
                  {vessel > 0 && <span className={styles.vesselTag}>{vessel} vessel</span>}
                  {room < 0 && <span className={styles.bidTag}>BID only</span>}
                </span>
                <ChevronDown size={12} className={styles.chevron} />
              </button>

              {open && (
                <div className={styles.zoneBody}>
                  {room < 0 && (
                    <span className={styles.zoneNote}>
                      Commercial systems that group the hardware above — not drawn in 3D.
                    </span>
                  )}
                  <ul className={styles.lines}>
                    {zone.lines.map((line) => {
                      const inPackage = packageEquipmentIds.indexOf(line.equipmentId) >= 0;
                      const offCategory =
                        line.category && line.category !== main ? categoryTitle[line.category] : "";
                      const bidIn = !!considered && !!considered[line.equipmentId];
                      const bidOut = !!considered && !bidIn && !line.vesselSupplied;
                      return (
                        <li key={line.equipmentId}>
                          <button
                            className={`${styles.line} ${
                              line.equipmentId === selectedEquipmentId ? styles.lineSelected : ""
                            } ${bidOut ? styles.lineOut : ""}`}
                            title={bidOut ? "Not considered in the BID" : undefined}
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
                            {offCategory && <span className={styles.categoryTag}>{offCategory}</span>}
                            {line.vesselSupplied && <span className={styles.vesselTag}>vessel</span>}
                            {bidIn && (
                              <Check size={12} className={styles.bidCheck} aria-label="In the BID" />
                            )}
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
                              {considered && considered[id] && (
                                <span className={styles.vesselTag}>in BID</span>
                              )}
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

      {categoryTotals.length > 0 && (
        <div className={styles.categories}>
          {categoryTotals.map((c) => (
            <span key={c.id} className={styles.categoryTotal}>
              {c.title} <strong>{c.qty}</strong>
            </span>
          ))}
        </div>
      )}

      <button className={styles.addSpread} onClick={onAddSpread}>
        <PackagePlus size={13} />{" "}
        {bidNumber ? `ADD FULL SPREAD TO ${bidNumber} PACKAGE` : "ADD FULL SPREAD TO PACKAGE"}
      </button>
    </div>
  );
};
