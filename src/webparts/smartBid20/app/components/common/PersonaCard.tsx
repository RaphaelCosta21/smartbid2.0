import * as React from "react";
import styles from "./PersonaCard.module.scss";

interface PersonaCardProps {
  name: string;
  email: string;
  role?: string;
  photoUrl?: string;
  size?: "small" | "medium" | "large";
  className?: string;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({
  name,
  email,
  role,
  photoUrl,
  size = "medium",
  className,
}) => {
  const sizeMap = { small: 28, medium: 36, large: 48 };
  const avatarSize = sizeMap[size];
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`${styles.card} ${className || ""}`}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className={styles.avatar}
          style={{ width: avatarSize, height: avatarSize }}
        />
      ) : (
        <div
          className={styles.avatarInitials}
          style={{
            width: avatarSize,
            height: avatarSize,
            fontSize: avatarSize * 0.4,
          }}
        >
          {initials}
        </div>
      )}
      <div className={styles.info}>
        <span
          className={styles.name}
          style={{ fontSize: size === "small" ? 12 : 14 }}
        >
          {name}
        </span>
        {size !== "small" && (
          <span className={styles.sub}>{role || email}</span>
        )}
      </div>
    </div>
  );
};
