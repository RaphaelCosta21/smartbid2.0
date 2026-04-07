import * as React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useUIStore } from "../../stores/useUIStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useBidStore } from "../../stores/useBidStore";
import { useNotificationStore } from "../../stores/useNotificationStore";
import { useRequestStore } from "../../stores/useRequestStore";
import { useTemplateStore } from "../../stores/useTemplateStore";
import { MockDataService } from "../../services/MockDataService";
import { ROUTES } from "../../config/routes.config";
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
import { SystemConfigPage } from "../../pages/SystemConfigPage";
import { MembersPage } from "../../pages/MembersPage";
import { NotificationsPage } from "../../pages/NotificationsPage";
import { UnassignedRequestsPage } from "../../pages/UnassignedRequestsPage";
import { CreateRequestPage } from "../../pages/CreateRequestPage";
import { MyDashboardPage } from "../../pages/MyDashboardPage";
import { FlowBoardPage } from "../../pages/FlowBoardPage";
import { TimelinePage } from "../../pages/TimelinePage";
import { ApprovalsPage } from "../../pages/ApprovalsPage";
import { BidResultsPage } from "../../pages/BidResultsPage";
import { TemplatesPage } from "../../pages/TemplatesPage";
import { KnowledgeBasePage } from "../../pages/KnowledgeBasePage";
import { AnalyticsPage } from "../../pages/AnalyticsPage";
import { ReportsPage } from "../../pages/ReportsPage";
import { FavoritesPage } from "../../pages/FavoritesPage";
import { QuotationsPage } from "../../pages/QuotationsPage";
import { ToolingReportPage } from "../../pages/ToolingReportPage";
import { PriceConsultingPage } from "../../pages/PriceConsultingPage";
import { PatchNotesPage } from "../../pages/PatchNotesPage";
import { FaqPage } from "../../pages/FaqPage";
import { CommandPalette } from "./CommandPalette";
import { ToastContainer } from "../common/ToastContainer";

export const AppLayout: React.FC = () => {
  const theme = useUIStore((s) => s.theme);
  const sidebarExpanded = useUIStore((s) => s.sidebarExpanded);
  const isGuestUser = useAuthStore((s) => s.isGuestUser);
  const setBids = useBidStore((s) => s.setBids);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const toasts = useUIStore((s) => s.toasts);
  const dismissToast = useUIStore((s) => s.dismissToast);
  const setRequests = useRequestStore((s) => s.setRequests);
  const setTemplates = useTemplateStore((s) => s.setTemplates);

  React.useEffect(() => {
    setBids(MockDataService.getBids());
    setNotifications(MockDataService.getNotifications());
    setRequests(MockDataService.getRequests());
    setTemplates(MockDataService.getTemplates() as any);
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

        <ToastContainer toasts={toasts} onDismiss={dismissToast} />

        <div className={styles.mainArea}>
          <div className={styles.headerArea}>
            <Header />
          </div>

          {isGuestUser && <GuestModeBanner />}

          <div className={styles.contentArea}>
            <Routes>
              <Route path={ROUTES.dashboard} element={<DashboardPage />} />
              <Route path={ROUTES.tracker} element={<BidTrackerPage />} />
              <Route path={ROUTES.bidDetail} element={<BidDetailPage />} />
              <Route path={ROUTES.requests} element={<UnassignedRequestsPage />} />
              <Route path={ROUTES.createRequest} element={<CreateRequestPage />} />
              <Route path={ROUTES.myDashboard} element={<MyDashboardPage />} />
              <Route path={ROUTES.flowboard} element={<FlowBoardPage />} />
              <Route path={ROUTES.timeline} element={<TimelinePage />} />
              <Route path={ROUTES.notifications} element={<NotificationsPage />} />
              <Route path={ROUTES.faq} element={<FaqPage />} />
              <Route path={ROUTES.knowledge} element={<KnowledgeBasePage />} />
              <Route path={ROUTES.analytics} element={<AnalyticsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path={ROUTES.reports} element={<ReportsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path={ROUTES.approvals} element={<ApprovalsPage />} />
              <Route path={ROUTES.results} element={<BidResultsPage />} />
              <Route path={ROUTES.templates} element={<TemplatesPage />} />
              <Route path={ROUTES.favorites} element={<FavoritesPage />} />
              <Route path={ROUTES.quotations} element={<QuotationsPage />} />
              <Route path={ROUTES.tooling} element={<ToolingReportPage />} />
              <Route path={ROUTES.pricing} element={<PriceConsultingPage />} />
              <Route path={ROUTES.systemConfig} element={<SystemConfigPage />} />
              <Route path={ROUTES.members} element={<MembersPage />} />
              <Route path={ROUTES.patchNotes} element={<PatchNotesPage />} />
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
