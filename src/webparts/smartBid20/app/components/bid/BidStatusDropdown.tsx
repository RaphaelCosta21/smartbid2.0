import * as React from "react";
import { BID_STATUSES, getStatusColor } from "../../config/status.config";

interface BidStatusDropdownProps {
  value: string;
  onChange: (status: string) => void;
  disabled?: boolean;
}

export const BidStatusDropdown: React.FC<BidStatusDropdownProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const color = getStatusColor(value);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        padding: "4px 8px",
        borderRadius: 6,
        border: `1px solid ${color}40`,
        background: `${color}14`,
        color,
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        outline: "none",
      }}
    >
      {BID_STATUSES.map((s) => (
        <option key={s.id} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
};
