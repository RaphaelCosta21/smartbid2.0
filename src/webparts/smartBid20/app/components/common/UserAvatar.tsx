/**
 * UserAvatar — round profile photo with initials fallback. Photos come from
 * useUserPhoto (Members Management, then Microsoft Graph), cached per session.
 */
import * as React from "react";
import { useUserPhoto } from "../../hooks/useUserPhoto";
import styles from "./UserAvatar.module.scss";

interface UserAvatarProps {
  name: string;
  email?: string;
  /** Used when no photo is found for the email (e.g. a photo saved on the BID). */
  photoUrl?: string;
  /** Diameter in px (default 24). */
  size?: number;
  /** Accent ring, e.g. for whoever holds the item now. */
  ring?: boolean;
  title?: string;
  className?: string;
}

export function getInitials(name: string): string {
  return (name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  email,
  photoUrl,
  size = 24,
  ring = false,
  title,
  className,
}) => {
  const photo = useUserPhoto(email) || photoUrl || "";
  const [broken, setBroken] = React.useState(false);
  React.useEffect(() => setBroken(false), [photo]);

  const style = {
    width: size,
    height: size,
    fontSize: Math.max(8, Math.round(size * 0.4)),
  } as React.CSSProperties;
  const cls = `${styles.avatar} ${ring ? styles.ring : ""} ${className || ""}`;
  const tip = title === undefined ? name : title;

  if (photo && !broken) {
    return (
      <img
        src={photo}
        alt=""
        className={`${cls} ${styles.photo}`}
        style={style}
        title={tip || undefined}
        onError={() => setBroken(true)}
      />
    );
  }
  return (
    <span className={cls} style={style} title={tip || undefined} aria-hidden>
      {getInitials(name)}
    </span>
  );
};
