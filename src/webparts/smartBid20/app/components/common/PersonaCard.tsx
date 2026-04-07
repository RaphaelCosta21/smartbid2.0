import * as React from "react";

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
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", gap: 10 }}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: "50%",
            background: "var(--accent-color, #3B82F6)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: avatarSize * 0.4,
            fontWeight: 600,
          }}
        >
          {initials}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: size === "small" ? 12 : 14, fontWeight: 600 }}>
          {name}
        </span>
        {size !== "small" && (
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            {role || email}
          </span>
        )}
      </div>
    </div>
  );
};
