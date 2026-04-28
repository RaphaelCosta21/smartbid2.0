/**
 * PhotoLightbox — Modal overlay that shows a photo at large size.
 * Click outside or press Esc to close.
 */
import * as React from "react";
import styles from "./PhotoLightbox.module.scss";

export interface PhotoLightboxProps {
  url: string;
  onClose: () => void;
  alt?: string;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  url,
  onClose,
  alt,
}) => {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <button className={styles.closeBtn} onClick={onClose} title="Close (Esc)">
        ✕
      </button>
      <img
        src={url}
        alt={alt || ""}
        className={styles.image}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default PhotoLightbox;
