import * as React from "react";
import { X, Plus } from "lucide-react";
import {
  ISurveyBidIntel,
  ISurveyCatalog,
  ISurveyEquipment,
  ISurveyFitNode,
} from "../../models";
import { SurveyEquipmentPhoto } from "./SurveyEquipmentCard";
import styles from "./SurveyEquipmentDetail.module.scss";

interface SurveyEquipmentDetailProps {
  equipment: ISurveyEquipment;
  catalog: ISurveyCatalog;
  intel: ISurveyBidIntel;
  packageQty: number;
  onAdd: () => void;
  onSelectEquipment: (id: string) => void;
  onClose?: () => void;
}

/** Only http(s) or site-relative links from catalog JSON are rendered. */
const safeUrl = (url: string | null): string | null =>
  url && /^(https:\/\/|http:\/\/|\/)/i.test(url) ? url : null;

const formatUSD = (v: number): string =>
  v >= 1000 ? `~$${Math.round(v / 1000)}k` : `~$${Math.round(v)}`;

const BAR_MAX_PX = 44;

export const SurveyEquipmentDetail: React.FC<SurveyEquipmentDetailProps> = ({
  equipment,
  catalog,
  intel,
  packageQty,
  onAdd,
  onSelectEquipment,
  onClose,
}) => {
  const datasheet = safeUrl(equipment.datasheetUrl);
  const status = (equipment.status || "Active").toUpperCase();

  const findEquipment = (label: string): ISurveyEquipment | undefined => {
    const l = label.toLowerCase();
    return catalog.equipment.find(
      (e) =>
        e.id === label ||
        e.title.toLowerCase() === l ||
        e.aliases.some((a) => a.toLowerCase() === l),
    );
  };

  const isCurrent = (node: ISurveyFitNode): boolean =>
    node.equipmentId === equipment.id ||
    node.label.toLowerCase() === equipment.title.toLowerCase();

  const bars = [
    { key: "inHouse", label: "In-house", value: intel.frequency.inHouse, cls: styles.barNavy },
    { key: "purchase", label: "Purchase", value: intel.frequency.purchase, cls: styles.barYellow },
    { key: "rent", label: "Rent", value: intel.frequency.rent, cls: styles.barTeal },
  ];
  const maxBar = Math.max(1, bars[0].value, bars[1].value, bars[2].value);
  const top = bars.slice().sort((a, b) => b.value - a.value)[0];

  const renderChip = (label: string): React.ReactNode => {
    const linked = findEquipment(label);
    return linked && linked.id !== equipment.id ? (
      <button
        key={label}
        className={`${styles.chip} ${styles.chipLink}`}
        onClick={() => onSelectEquipment(linked.id)}
      >
        {label}
      </button>
    ) : (
      <span key={label} className={styles.chip}>
        {label}
      </span>
    );
  };

  return (
    <div className={styles.panel} key={equipment.id}>
      <div className={styles.topbar}>
        <span className={styles.topTitle}>{equipment.title.toUpperCase()}</span>
        <div className={styles.topRight}>
          <span className={styles.topStatus}>{status} • SELECTED</span>
          <span className={styles.statusDot} />
          {onClose && (
            <button className={styles.close} onClick={onClose} aria-label="Close">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.identity}>
          <div className={styles.photoLarge}>
            <SurveyEquipmentPhoto equipment={equipment} size={140} />
            <span className={styles.photoLabel}>
              {(equipment.manufacturer || "PHOTO").toUpperCase()}
            </span>
          </div>
          <div className={styles.info}>
            <span className={styles.tech}>{equipment.technology}</span>
            <h3 className={styles.title}>{equipment.title}</h3>
            <span className={styles.tech}>{status} EQUIPMENT • SELECTED</span>
            {equipment.aliases.length > 0 && (
              <div className={styles.aliasRow}>
                <span className={styles.aliasLabel}>ALSO KNOWN AS</span>
                <span className={styles.aliasLine} />
                {equipment.aliases.map((a) => (
                  <span key={a} className={styles.alias}>
                    {a}
                  </span>
                ))}
              </div>
            )}
            {equipment.whatIsIt && (
              <p className={styles.copy}>
                <strong>WHAT IS IT?</strong> {equipment.whatIsIt}
              </p>
            )}
            {equipment.whatDoesItDo && (
              <p className={styles.copy}>
                <strong>WHAT DOES IT DO?</strong> {equipment.whatDoesItDo}
              </p>
            )}
          </div>
        </div>

        {equipment.usedIn.length > 0 && (
          <div className={styles.block}>
            <span className={styles.label}>USED IN</span>
            <div className={styles.chips}>
              {equipment.usedIn.map((u) => (
                <span key={u} className={styles.chip}>
                  {u}
                </span>
              ))}
            </div>
          </div>
        )}

        {equipment.connectsTo.length > 0 && (
          <div className={styles.block}>
            <span className={styles.label}>CONNECTS TO</span>
            <div className={styles.chips}>{equipment.connectsTo.map(renderChip)}</div>
          </div>
        )}

        {equipment.whereItFits.length > 0 && (
          <div className={styles.fitBox}>
            <div className={styles.fitHead}>
              <span className={styles.fitTitle}>WHERE DOES IT FIT?</span>
              <span className={styles.fitLive}>
                <span className={styles.liveDot} /> LIVE RELATIONSHIP MAP
              </span>
            </div>
            <div className={styles.fitChain}>
              {equipment.whereItFits.map((node, i) => (
                <React.Fragment key={`${node.label}-${i}`}>
                  {i > 0 && <span className={styles.connector} />}
                  {node.stack && node.stack.length > 0 ? (
                    <span className={styles.stack}>
                      {node.stack.map((s, j) => (
                        <span key={j} className={styles.node}>
                          {s}
                        </span>
                      ))}
                    </span>
                  ) : isCurrent(node) ? (
                    <span className={styles.nodeCurrent}>{node.label}</span>
                  ) : (
                    <span
                      className={`${styles.node} ${i === 0 || i === equipment.whereItFits.length - 1 ? styles.nodeEnd : ""}`}
                    >
                      {node.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {equipment.bidConsiderations.length > 0 && (
          <div className={styles.block}>
            <span className={styles.alertLabel}>
              <span className={styles.alertDot} /> BID CONSIDERATIONS
            </span>
            <div className={styles.chips}>
              {equipment.bidConsiderations.map((c) => (
                <span key={c} className={styles.chipAlert}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.actionRow}>
          {datasheet ? (
            <a
              className={styles.viewLink}
              href={datasheet}
              target="_blank"
              rel="noopener noreferrer"
            >
              VIEW EQUIPMENT →
            </a>
          ) : (
            <span className={styles.viewLinkMuted}>NO DATASHEET LINKED</span>
          )}
          <button className={styles.addBtn} onClick={onAdd}>
            <Plus size={12} />
            {packageQty > 0 ? `IN PACKAGE (${packageQty})` : "ADD TO PACKAGE"}
          </button>
        </div>

        <div className={styles.intel}>
          <div className={styles.intelHead}>
            <div>
              <span className={styles.intelTitle}>COMMERCIAL INTEL</span>
              <span className={styles.intelSub}>
                {intel.sampleCount > 0
                  ? `${intel.sampleCount} RECORDS · QUOTATIONS + PAST BIDS`
                  : "NO HISTORY YET FOR THIS PART NUMBER"}
              </span>
            </div>
            <span className={styles.pnTag}>
              {equipment.partNumber ? `PN ${equipment.partNumber}` : "PN PENDING"}
            </span>
          </div>
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>MEDIAN HISTORICAL COST</span>
              <span className={styles.metricValue}>
                {intel.medianCostUSD !== null ? formatUSD(intel.medianCostUSD) : "—"}
              </span>
              <span className={styles.metricHint}>PURCHASE · USD</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>TYPICAL LEAD TIME</span>
              <span className={styles.metricValue}>
                {intel.leadTimeWeeksMin !== null
                  ? intel.leadTimeWeeksMin === intel.leadTimeWeeksMax
                    ? `~${intel.leadTimeWeeksMin} wks`
                    : `~${intel.leadTimeWeeksMin}–${intel.leadTimeWeeksMax} wks`
                  : "—"}
              </span>
              <span className={styles.metricHint}>QUOTATIONS + BIDS</span>
            </div>
          </div>
          <div className={styles.freq}>
            <div className={styles.freqHead}>
              <span className={styles.freqTitle}>HISTORICAL QUOTATION FREQUENCY</span>
              <span className={styles.metricLabel}>BY ACQUISITION TYPE</span>
            </div>
            <div className={styles.bars}>
              {bars.map((b) => (
                <div key={b.key} className={styles.barCol}>
                  <span className={styles.barValue}>{b.value}</span>
                  <span
                    className={`${styles.bar} ${b.cls}`}
                    style={{ height: Math.max(4, Math.round((b.value / maxBar) * BAR_MAX_PX)) }}
                  />
                  <span className={styles.barLabel}>{b.label}</span>
                </div>
              ))}
            </div>
            <span className={styles.metricLabel}>
              {intel.sampleCount > 0
                ? `${top.label} is the most frequent acquisition type for this equipment.`
                : "Add quotations with this part number to build the history."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
