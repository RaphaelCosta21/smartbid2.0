import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { X, ExternalLink } from "lucide-react";
import {
  ISurveyBidIntel,
  ISurveyCatalog,
  ISurveyEquipment,
  ISurveyFitNode,
} from "../../models";
import { useChartTheme } from "../../hooks/useChartTheme";
import { ChartTooltip } from "../charts/ChartTooltip";
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

export const SurveyEquipmentDetail: React.FC<SurveyEquipmentDetailProps> = ({
  equipment,
  catalog,
  intel,
  packageQty,
  onAdd,
  onSelectEquipment,
  onClose,
}) => {
  const chart = useChartTheme();
  const datasheet = safeUrl(equipment.datasheetUrl);

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

  const freqData = [
    { name: "In-house", value: intel.frequency.inHouse, color: chart.accentSecondary },
    { name: "Purchase", value: intel.frequency.purchase, color: chart.warning },
    { name: "Rent", value: intel.frequency.rent, color: chart.accent },
  ];

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
      <div className={styles.panelHead}>
        <span className={styles.eyebrow}>{equipment.title.toUpperCase()}</span>
        <div className={styles.headRight}>
          <span className={styles.status}>
            {(equipment.status || "Active").toUpperCase()} • SELECTED
          </span>
          {onClose && (
            <button className={styles.close} onClick={onClose} aria-label="Close">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className={styles.hero}>
        <div className={styles.photoBox}>
          <SurveyEquipmentPhoto equipment={equipment} size={130} />
          <span className={styles.photoLabel}>
            {equipment.manufacturer || "PHOTO"}
          </span>
        </div>
        <div className={styles.heroCopy}>
          <span className={styles.tech}>{equipment.technology}</span>
          <h3 className={styles.title}>{equipment.title}</h3>
          {equipment.aliases.length > 0 && (
            <div className={styles.aliasRow}>
              <span className={styles.label}>ALSO KNOWN AS</span>
              {equipment.aliases.map((a) => (
                <span key={a} className={styles.alias}>
                  {a}
                </span>
              ))}
            </div>
          )}
          {equipment.whatIsIt && (
            <p className={styles.copy}>
              <strong>What is it?</strong> {equipment.whatIsIt}
            </p>
          )}
          {equipment.whatDoesItDo && (
            <p className={styles.copy}>
              <strong>What does it do?</strong> {equipment.whatDoesItDo}
            </p>
          )}
          <button className={styles.addBtn} onClick={onAdd}>
            {packageQty > 0
              ? `IN PACKAGE (${packageQty}) — ADD MORE`
              : "ADD TO PACKAGE"}
          </button>
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
          <span className={`${styles.label} ${styles.labelWarn}`}>
            ● BID CONSIDERATIONS
          </span>
          <div className={styles.chips}>
            {equipment.bidConsiderations.map((c) => (
              <span key={c} className={styles.chipWarn}>
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {datasheet && (
        <a
          className={styles.viewLink}
          href={datasheet}
          target="_blank"
          rel="noopener noreferrer"
        >
          VIEW EQUIPMENT <ExternalLink size={11} />
        </a>
      )}

      <div className={styles.intel}>
        <div className={styles.intelHead}>
          <div>
            <span className={styles.intelTitle}>COMMERCIAL INTEL</span>
            <span className={styles.intelSub}>
              {intel.sampleCount > 0
                ? `Based on ${intel.sampleCount} records (quotations + past BIDs)`
                : "No history yet for this part number"}
            </span>
          </div>
          {equipment.partNumber && (
            <span className={styles.pnTag}>PN {equipment.partNumber}</span>
          )}
        </div>
        <div className={styles.kpis}>
          <div className={styles.kpi}>
            <span className={styles.kpiLabel}>MEDIAN HISTORICAL COST</span>
            <span className={styles.kpiValue}>
              {intel.medianCostUSD !== null ? formatUSD(intel.medianCostUSD) : "—"}
            </span>
            <span className={styles.kpiHint}>PURCHASE · USD</span>
          </div>
          <div className={styles.kpi}>
            <span className={styles.kpiLabel}>TYPICAL LEAD TIME</span>
            <span className={styles.kpiValue}>
              {intel.leadTimeWeeksMin !== null
                ? intel.leadTimeWeeksMin === intel.leadTimeWeeksMax
                  ? `~${intel.leadTimeWeeksMin} wks`
                  : `~${intel.leadTimeWeeksMin}–${intel.leadTimeWeeksMax} wks`
                : "—"}
            </span>
            <span className={styles.kpiHint}>QUOTATIONS + BIDS</span>
          </div>
        </div>
        <div className={styles.freq}>
          <span className={styles.kpiLabel}>HISTORICAL QUOTATION FREQUENCY</span>
          <div className={styles.chartBox}>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={freqData} margin={{ top: 18, right: 8, left: 8, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: chart.tick, fontSize: 10 }}
                  axisLine={{ stroke: chart.axis }}
                  tickLine={false}
                />
                <YAxis hide allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: chart.referenceFill }}
                  content={<ChartTooltip />}
                />
                <Bar dataKey="value" name="Records" radius={[6, 6, 0, 0]} maxBarSize={36}>
                  {freqData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
                    fill={chart.textSecondary}
                    fontSize={10}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
