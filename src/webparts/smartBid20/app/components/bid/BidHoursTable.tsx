import * as React from "react";
import { IHoursSummary } from "../../models";
import styles from "./BidHoursTable.module.scss";

interface BidHoursTableProps {
  hoursSummary: IHoursSummary;
  readOnly?: boolean;
}

export const BidHoursTable: React.FC<BidHoursTableProps> = ({
  hoursSummary,
  readOnly = false,
}) => {
  const sections = [
    { label: "Engineering Hours", data: hoursSummary.engineeringHours },
    { label: "Onshore Hours", data: hoursSummary.onshoreHours },
    { label: "Offshore Hours", data: hoursSummary.offshoreHours },
  ];

  return (
    <div className={styles.container}>
      {sections.map((section) => (
        <div key={section.label}>
          <h4 className={styles.sectionTitle}>{section.label}</h4>
          {section.data.items.length === 0 ? (
            <div className={styles.empty}>No items</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  {[
                    "Function",
                    "Phase",
                    "Hrs/Day",
                    "People",
                    "Work Days",
                    "Util %",
                    "Total Hrs",
                    "Cost (BRL)",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.data.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.function}</td>
                    <td>{item.phase}</td>
                    <td className={styles.cellCenter}>{item.hoursPerDay}</td>
                    <td className={styles.cellCenter}>{item.pplQty}</td>
                    <td className={styles.cellCenter}>{item.workDays}</td>
                    <td className={styles.cellCenter}>
                      {item.utilizationPercent}%
                    </td>
                    <td className={`${styles.cellRight} ${styles.cellBold}`}>
                      {item.totalHours.toLocaleString()}
                    </td>
                    <td className={styles.cellRight}>
                      R$ {item.costBRL.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className={styles.cellRight}>
                    Subtotal:
                  </td>
                  <td className={styles.cellRight}>
                    {section.data.totalHours.toLocaleString()}
                  </td>
                  <td className={styles.cellRight}>
                    R$ {section.data.totalCostBRL.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      ))}
      <div className={styles.grandTotal}>
        <div className={styles.grandTotalRow}>
          <span>Grand Total</span>
          <span>
            {hoursSummary.grandTotalHours.toLocaleString()} hrs — R${" "}
            {hoursSummary.grandTotalCostBRL.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
