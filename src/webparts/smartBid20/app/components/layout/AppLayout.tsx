import * as React from "react";
import {
  HashRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useUIStore } from "../../stores/useUIStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useBidStore } from "../../stores/useBidStore";
import { useConfigStore } from "../../stores/useConfigStore";
import { BidService } from "../../services/BidService";
import { SystemConfigService } from "../../services/SystemConfigService";
import { MembersService } from "../../services/MembersService";
import { UserService } from "../../services/UserService";
import { canAccessKnowledge, isSuperAdmin } from "../../utils/accessControl";
import { IUser, UserRole } from "../../models";
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

import { FlowBoardPage } from "../../pages/FlowBoardPage";
import { TimelinePage } from "../../pages/TimelinePage";
import { ApprovalsPage } from "../../pages/ApprovalsPage";
import { FollowUpPage } from "../../pages/FollowUpPage";
import { TemplatesPage } from "../../pages/TemplatesPage";
import { AssetsCatalogPage } from "../../pages/AssetsCatalogPage";
import { DatasheetsPage } from "../../pages/DatasheetsPage";
import { ManualsCatalogsPage } from "../../pages/ManualsCatalogsPage";
import { ClarificationsDbPage } from "../../pages/ClarificationsDbPage";
import { LinksRecommendationsPage } from "../../pages/LinksRecommendationsPage";
import { AnalyticsPage } from "../../pages/AnalyticsPage";
import { ReportsPage } from "../../pages/ReportsPage";
import { FavoritesPage } from "../../pages/FavoritesPage";
import { BomCostsPage } from "../../pages/BomCostsPage";
import { QuotationsPage } from "../../pages/QuotationsPage";
import { ToolingReportPage } from "../../pages/ToolingReportPage";
import { QueryConsultingPage } from "../../pages/QueryConsultingPage";
import { PatchNotesPage } from "../../pages/PatchNotesPage";
import { FaqPage } from "../../pages/FaqPage";
import { CommandPalette } from "./CommandPalette";
import { ToastContainer } from "../common/ToastContainer";

/** Route guard — only the Engineering team may access Knowledge Base pages */
const RequireEngineering: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const currentUser = useAuthStore((s) => s.currentUser);
  if (!canAccessKnowledge(currentUser)) {
    return <Navigate to={ROUTES.tracker} replace />;
  }
  return children;
};

export const AppLayout: React.FC = () => {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const sidebarExpanded = useUIStore((s) => s.sidebarExpanded);
  const isGuestUser = useAuthStore((s) => s.isGuestUser);
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);
  const setBids = useBidStore((s) => s.setBids);
  const toasts = useUIStore((s) => s.toasts);
  const dismissToast = useUIStore((s) => s.dismissToast);
  const setConfig = useConfigStore((s) => s.setConfig);

  React.useEffect(() => {
    BidService.getAll()
      .then((bids) => setBids(bids))
      .catch((err) => console.error("Failed to load bids:", err));

    // Load system config from SharePoint into global store
    SystemConfigService.get()
      .then((cfg) => setConfig(cfg))
      .catch((err) => console.error("Failed to load system config:", err));

    // Resolve the signed-in user and merge their Members Management record,
    // so access (e.g. the Engineering-only Knowledge Base) reflects reality.
    Promise.all([UserService.getCurrentUser(), MembersService.getAll()])
      .then(([spUser, data]) => {
        const email = (spUser.email || "").toLowerCase();
        const member = data.members.find(
          (m) => m.email.toLowerCase() === email,
        );
        const admin = isSuperAdmin(email);
        const resolved: IUser = {
          ...spUser,
          displayName: member
            ? member.name || spUser.displayName
            : spUser.displayName,
          photoUrl: member ? member.photoUrl : undefined,
          jobTitle: member ? member.jobTitle : spUser.jobTitle,
          department: member ? member.department : spUser.department,
          sector: member ? member.sector : undefined,
          role: member
            ? (member.sector as UserRole)
            : admin
              ? "engineering"
              : "guest",
          teamCategory: member ? member.sector : spUser.teamCategory,
          bidRole: member ? member.bidRole : undefined,
          businessLines: member ? member.businessLines : undefined,
          isActive: member ? member.isActive : true,
          isSuperAdmin: admin,
        };
        setCurrentUser(resolved);
        if (member && member.themePreference) {
          setTheme(member.themePreference);
        }
      })
      .catch((err) => console.warn("Failed to resolve current user:", err));
  }, []);

  const themeClass =
    theme === "dark" ? darkTheme.smartBidDark : lightTheme.smartBidLight;

  return (
    <HashRouter>
      <AppLayoutInner
        themeClass={themeClass}
        sidebarExpanded={sidebarExpanded}
        isGuestUser={isGuestUser}
        toasts={toasts}
        dismissToast={dismissToast}
      />
    </HashRouter>
  );
};

/** Inner component that can use useLocation (inside HashRouter) */
const AppLayoutInner: React.FC<{
  themeClass: string;
  sidebarExpanded: boolean;
  isGuestUser: boolean;
  toasts: any[];
  dismissToast: (id: string) => void;
}> = ({ themeClass, sidebarExpanded, isGuestUser, toasts, dismissToast }) => {
  const location = useLocation();
  const isExternal = location.pathname === ROUTES.queryConsultingExternal;

  if (isExternal) {
    return (
      <div
        className={`${themeClass} ${globalStyles.smartBidRoot}`}
        style={{
          padding: "16px 24px",
          minHeight: "100vh",
          background: "var(--main-bg)",
          color: "var(--text-primary)",
        }}
      >
        <Routes>
          <Route
            path={ROUTES.queryConsultingExternal}
            element={<QueryConsultingPage />}
          />
        </Routes>
      </div>
    );
  }

  return (
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
            <Route path={ROUTES.tracker} element={<BidTrackerPage />} />
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={ROUTES.bidDetail} element={<BidDetailPage />} />
            <Route
              path={ROUTES.requests}
              element={<UnassignedRequestsPage />}
            />
            <Route
              path={ROUTES.createRequest}
              element={<CreateRequestPage />}
            />
            <Route path={ROUTES.flowboard} element={<FlowBoardPage />} />
            <Route path={ROUTES.timeline} element={<TimelinePage />} />
            <Route
              path={ROUTES.notifications}
              element={<NotificationsPage />}
            />
            <Route path={ROUTES.faq} element={<FaqPage />} />
            <Route
              path={ROUTES.assetsCatalog}
              element={
                <RequireEngineering>
                  <AssetsCatalogPage />
                </RequireEngineering>
              }
            />
            <Route
              path={ROUTES.datasheets}
              element={
                <RequireEngineering>
                  <DatasheetsPage />
                </RequireEngineering>
              }
            />
            <Route
              path={ROUTES.manualsCatalogs}
              element={
                <RequireEngineering>
                  <ManualsCatalogsPage />
                </RequireEngineering>
              }
            />
            <Route
              path={ROUTES.clarificationsDb}
              element={
                <RequireEngineering>
                  <ClarificationsDbPage />
                </RequireEngineering>
              }
            />
            <Route
              path={ROUTES.linksRecommendations}
              element={
                <RequireEngineering>
                  <LinksRecommendationsPage />
                </RequireEngineering>
              }
            />
            <Route path={ROUTES.analytics} element={<AnalyticsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path={ROUTES.reports} element={<ReportsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path={ROUTES.approvals} element={<ApprovalsPage />} />
            <Route path={ROUTES.followUp} element={<FollowUpPage />} />
            <Route
              path={ROUTES.templates}
              element={
                <RequireEngineering>
                  <TemplatesPage />
                </RequireEngineering>
              }
            />
            <Route path={ROUTES.favorites} element={<FavoritesPage />} />
            <Route path={ROUTES.bomCosts} element={<BomCostsPage />} />
            <Route path={ROUTES.quotations} element={<QuotationsPage />} />
            <Route path={ROUTES.tooling} element={<ToolingReportPage />} />
            <Route
              path={ROUTES.queryConsulting}
              element={<QueryConsultingPage />}
            />
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
  );
};
