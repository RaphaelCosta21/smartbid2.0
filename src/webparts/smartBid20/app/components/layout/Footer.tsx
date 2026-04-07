import * as React from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "../../config/app.config";
import styles from "./Footer.module.scss";

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", { hour12: false });

  return (
    <footer className={styles.footer}>
      <span>&copy; 2026 Oceaneering</span>
      <span className={styles.separator}>|</span>
      <span>
        Smart BID v{APP_CONFIG.appVersion}{" "}
        <span
          className={styles.patchLink}
          onClick={() => navigate("/settings/patch-notes")}
        >
          (Patch Notes)
        </span>
      </span>
      <span className={styles.separator}>|</span>
      <span className={styles.regionBadge}>
        <span className={styles.dot} />
        {APP_CONFIG.region}
      </span>
      <span className={styles.separator}>|</span>
      <span className={styles.clock}>{formattedTime}</span>
      <span className={styles.separator}>|</span>
      <a
        href="https://www.oceaneering.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        oceaneering.com
      </a>
    </footer>
  );
};
