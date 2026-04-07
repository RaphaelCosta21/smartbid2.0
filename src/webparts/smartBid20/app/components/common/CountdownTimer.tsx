import * as React from "react";

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  className,
}) => {
  const [remaining, setRemaining] = React.useState("");
  const [isOverdue, setIsOverdue] = React.useState(false);

  React.useEffect(() => {
    const update = (): void => {
      const now = Date.now();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsOverdue(true);
        const absDiff = Math.abs(diff);
        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        setRemaining(`${days}d overdue`);
      } else {
        setIsOverdue(false);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        setRemaining(days > 0 ? `${days}d ${hours}h` : `${hours}h`);
      }
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 12,
        fontWeight: 600,
        color: isOverdue
          ? "#EF4444"
          : remaining.startsWith("0")
            ? "#F59E0B"
            : "var(--text-secondary)",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      {remaining}
    </span>
  );
};
