import * as React from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "../../config/app.config";
import { useUIStore } from "../../stores/useUIStore";
import styles from "./Footer.module.scss";

const oiiBlueLogo = require("../../../assets/OII-blue-vetorizado.svg");
const oiiWhiteLogo = require("../../../assets/OII-white-transparent-vetorizado.svg");
const smartBidIcon = require("../../../assets/smartbid-icon.svg");
const smartBidIconDark = require("../../../assets/smartbid-icon-dark.svg");

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useUIStore();
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", { hour12: false });
  const isDark = theme === "dark";

  return (
    <footer className={styles.footer}>
      <span className={styles.brandGroup}>
        <img
          src={isDark ? smartBidIcon : smartBidIconDark}
          alt="SmartBid"
          className={styles.footerSmartBidIcon}
        />
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
        <img
          src={isDark ? oiiWhiteLogo : oiiBlueLogo}
          alt="Oceaneering"
          className={styles.footerOiiLogo}
        />
      </a>
    </footer>
  );
};
