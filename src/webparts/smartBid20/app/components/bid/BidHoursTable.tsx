import * as React from "react";
import { IHoursSummary } from "../../models";

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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {sections.map((section) => (
        <div key={section.label}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
            {section.label}
          </h4>
          {section.data.items.length === 0 ? (
            <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
              No items
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
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
                    <th
                      key={h}
                      style={{
                        padding: "8px 12px",
                        textAlign: "left",
                        borderBottom: "1px solid var(--border-subtle)",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.data.items.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  >
                    <td style={{ padding: "8px 12px" }}>{item.function}</td>
                    <td style={{ padding: "8px 12px" }}>{item.phase}</td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>
                      {item.hoursPerDay}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>
                      {item.pplQty}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>
                      {item.workDays}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>
                      {item.utilizationPercent}%
                    </td>
                    <td
                      style={{
                        padding: "8px 12px",
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      {item.totalHours.toLocaleString()}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right" }}>
                      R$ {item.costBRL.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ fontWeight: 600 }}>
                  <td
                    colSpan={6}
                    style={{ padding: "10px 12px", textAlign: "right" }}
                  >
                    Subtotal:
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                    {section.data.totalHours.toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                    R$ {section.data.totalCostBRL.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      ))}
      <div
        style={{
          padding: 16,
          background: "var(--card-bg)",
          borderRadius: 12,
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
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
