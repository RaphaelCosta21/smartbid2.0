import * as React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useUIStore } from "../../stores/useUIStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useBidStore } from "../../stores/useBidStore";
import { useNotificationStore } from "../../stores/useNotificationStore";
import { MOCK_BIDS } from "../../data/mockBids";
import { MOCK_NOTIFICATIONS } from "../../data/mockNotifications";
import darkTheme from "../../styles/themes/dark.module.scss";
import lightTheme from "../../styles/themes/light.module.scss";
import globalStyles from "../../styles/globals.module.scss";
import "../../styles/sharepoint-overrides.module.scss";
import styles from "./AppLayout.module.scss";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { GuestModeBanner } from "./GuestModeBanner";
import { DashboardPage } from "../../pages/DashboardPage";
import { BidTrackerPage } from "../../pages/BidTrackerPage";
import { BidDetailPage } from "../../pages/BidDetailPage";
import { PlaceholderPage } from "../../pages/PlaceholderPage";
import { SystemConfigPage } from "../../pages/SystemConfigPage";
import { MembersPage } from "../../pages/MembersPage";
import { NotificationsPage } from "../../pages/NotificationsPage";
import { CommandPalette } from "./CommandPalette";

export const AppLayout: React.FC = () => {
  const theme = useUIStore((s) => s.theme);
  const sidebarExpanded = useUIStore((s) => s.sidebarExpanded);
  const isGuestUser = useAuthStore((s) => s.isGuestUser);
  const setBids = useBidStore((s) => s.setBids);
  const setNotifications = useNotificationStore((s) => s.setNotifications);

  React.useEffect(() => {
    setBids(MOCK_BIDS);
    setNotifications(MOCK_NOTIFICATIONS);
  }, []);

  const themeClass =
    theme === "dark" ? darkTheme.smartBidDark : lightTheme.smartBidLight;

  return (
    <HashRouter>
      <div
        className={`${themeClass} ${globalStyles.smartBidRoot} ${styles.appLayout}`}
      >
        <CommandPalette />
        <div
          className={`${styles.sidebarArea} ${!sidebarExpanded ? styles.collapsed : ""}`}
        >
          <Sidebar />
        </div>

        <div className={styles.mainArea}>
          <div className={styles.headerArea}>
            <Header />
          </div>

          {isGuestUser && <GuestModeBanner />}

          <div className={styles.contentArea}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/tracker" element={<BidTrackerPage />} />
              <Route path="/bid/:id" element={<BidDetailPage />} />
              <Route
                path="/requests"
                element={<PlaceholderPage title="Unassigned Requests" />}
              />
              <Route
                path="/requests/new"
                element={<PlaceholderPage title="Create Request" />}
              />
              <Route
                path="/my-dashboard"
                element={<PlaceholderPage title="My Dashboard" />}
              />
              <Route
                path="/flowboard"
                element={<PlaceholderPage title="FlowBoard" />}
              />
              <Route
                path="/timeline"
                element={<PlaceholderPage title="Timeline View" />}
              />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route
                path="/faq"
                element={<PlaceholderPage title="FAQ & Instructions" />}
              />
              <Route
                path="/knowledge/:category"
                element={<PlaceholderPage title="Knowledge Base" />}
              />
              <Route
                path="/analytics/:view"
                element={<PlaceholderPage title="Analytics" />}
              />
              <Route
                path="/reports/:type"
                element={<PlaceholderPage title="Reports" />}
              />
              <Route
                path="/tools/:tool"
                element={<PlaceholderPage title="Tools" />}
              />
              <Route
                path="/results"
                element={<PlaceholderPage title="BID Results & Insights" />}
              />
              <Route
                path="/templates"
                element={<PlaceholderPage title="Templates Library" />}
              />
              <Route path="/settings/config" element={<SystemConfigPage />} />
              <Route path="/settings/members" element={<MembersPage />} />
              <Route
                path="/settings/patch-notes"
                element={<PlaceholderPage title="Patch Notes" />}
              />
            </Routes>
          </div>

          <div className={styles.footerArea}>
            <Footer />
          </div>
        </div>
      </div>
    </HashRouter>
  );
};
