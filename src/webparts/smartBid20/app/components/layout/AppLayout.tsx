import * as React from "react";
import {
  HashRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useUIStore } from "../../stores/useUIStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useBidStore } from "../../stores/useBidStore";
import { useConfigStore } from "../../stores/useConfigStore";
import { BidService } from "../../services/BidService";
import { SystemConfigService } from "../../services/SystemConfigService";
import { MembersService } from "../../services/MembersService";
import { UserService } from "../../services/UserService";
import { isSuperAdmin } from "../../utils/accessControl";
import { IUser, UserRole } from "../../models";
import { ROUTES } from "../../config/routes.config";
import { ColorThemeId, isColorThemeId } from "../../config/colorThemes.config";
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
import { TechnicalProposalsPage } from "../../pages/TechnicalProposalsPage";
import { PastBidsPage } from "../../pages/PastBidsPage";
import { ClarificationsDbPage } from "../../pages/ClarificationsDbPage";
import { LinksRecommendationsPage } from "../../pages/LinksRecommendationsPage";
import { SurveyEquipmentPage } from "../../pages/SurveyEquipmentPage";
import { SurveySystemPage } from "../../pages/SurveySystemPage";
import { AnalyticsPage } from "../../pages/AnalyticsPage";
import { PerformanceTrendsPage } from "../../pages/PerformanceTrendsPage";
import { BottleneckAnalysisPage } from "../../pages/BottleneckAnalysisPage";
import { TeamAnalyticsPage } from "../../pages/TeamAnalyticsPage";
import { ReportsPage } from "../../pages/ReportsPage";
import { PeriodPerformancePage } from "../../pages/PeriodPerformancePage";
import { OperationalSummaryPage } from "../../pages/OperationalSummaryPage";
import { BidDetailsReportPage } from "../../pages/BidDetailsReportPage";
import { FavoritesPage } from "../../pages/FavoritesPage";
import { BomCostsPage } from "../../pages/BomCostsPage";
import { QuotationsPage } from "../../pages/QuotationsPage";
import { ToolingReportPage } from "../../pages/ToolingReportPage";
import { QueryConsultingPage } from "../../pages/QueryConsultingPage";
import { PatchNotesPage } from "../../pages/PatchNotesPage";
import { FaqPage } from "../../pages/FaqPage";
import { EasiPriceHistoryPage } from "../../pages/EasiPriceHistoryPage";
import { EasiBidPresentationPage } from "../../pages/EasiBidPresentationPage";
import { EasiBidComparatorPage } from "../../pages/EasiBidComparatorPage";
import { EasiSuppliersPage } from "../../pages/EasiSuppliersPage";
import { CommandPalette } from "./CommandPalette";
import { ToastContainer } from "../common/ToastContainer";
import { QueryCatalogLoadingBanner } from "../common/QueryCatalogLoadingBanner";
import { ChatAssistant } from "../common/ChatAssistant";
import { RequirePageAccess } from "../common/RequirePageAccess";

const guard = (pageKey: string, page: React.ReactElement): React.ReactElement => (
  <RequirePageAccess pageKey={pageKey}>{page}</RequirePageAccess>
);

export const AppLayout: React.FC = () => {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const colorTheme = useUIStore((s) => s.colorTheme);
  const setColorTheme = useUIStore((s) => s.setColorTheme);
  const sidebarExpanded = useUIStore((s) => s.sidebarExpanded);
  const isGuestUser = useAuthStore((s) => s.isGuestUser);
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);
  const setBids = useBidStore((s) => s.setBids);
  const toasts = useUIStore((s) => s.toasts);
  const dismissToast = useUIStore((s) => s.dismissToast);
  const setConfig = useConfigStore((s) => s.setConfig);

  // Every link to a file/URL opens in a new tab. data-interception="off" stops
  // SharePoint's page router from hijacking the click into the current tab.
  React.useEffect(() => {
    const onClick = (e: MouseEvent): void => {
      const target = e.target as Element | null;
      const anchor = target?.closest ? target.closest("a[href]") : null;
      if (!anchor || !anchor.closest(`.${globalStyles.smartBidRoot}`)) return;
      const href = (anchor.getAttribute("href") || "").trim();
      if (!href || /^(#|mailto:|tel:|javascript:)/i.test(href)) return;
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
      anchor.setAttribute("data-interception", "off");
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);

  React.useEffect(() => {
    BidService.getAll()
      .then((bids) => setBids(bids))
      .catch((err) => console.error("Failed to load bids:", err));

    // Load system config from SharePoint into global store
    SystemConfigService.get()
      .then((cfg) => setConfig(cfg))
      .catch((err) => {
        console.error("Failed to load system config:", err);
        useConfigStore.getState().setLoadFailed();
      });

    // Resolve the signed-in user and merge their Members Management record:
    // their team drives every permission (no team = guest, super admins included).
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
          role: member ? (member.sector as UserRole) : "guest",
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
        if (member && isColorThemeId(member.colorTheme)) {
          setColorTheme(member.colorTheme);
        }
      })
      .catch((err) => {
        console.warn("Failed to resolve current user:", err);
        setCurrentUser({
          ...useAuthStore.getState().currentUser,
          role: "guest",
          isSuperAdmin: false,
        });
      });
  }, []);

  const themeClass =
    theme === "dark" ? darkTheme.smartBidDark : lightTheme.smartBidLight;

  return (
    <HashRouter>
      <AppLayoutInner
        themeClass={themeClass}
        colorTheme={colorTheme}
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
  colorTheme: ColorThemeId;
  sidebarExpanded: boolean;
  isGuestUser: boolean;
  toasts: any[];
  dismissToast: (id: string) => void;
}> = ({
  themeClass,
  colorTheme,
  sidebarExpanded,
  isGuestUser,
  toasts,
  dismissToast,
}) => {
  const location = useLocation();
  const isExternal = location.pathname === ROUTES.queryConsultingExternal;

  if (isExternal) {
    return (
      <div
        className={`${themeClass} ${globalStyles.smartBidRoot}`}
        data-color-theme={colorTheme}
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
            element={guard("query-consulting", <QueryConsultingPage />)}
          />
        </Routes>
      </div>
    );
  }

  return (
    <div
      className={`${themeClass} ${globalStyles.smartBidRoot} ${styles.appLayout}`}
      data-color-theme={colorTheme}
    >
      <CommandPalette />
      <div
        className={`${styles.sidebarArea} ${!sidebarExpanded ? styles.collapsed : ""}`}
      >
        <Sidebar />
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <QueryCatalogLoadingBanner />
      <ChatAssistant />

      <div className={styles.mainArea}>
        <div className={styles.headerArea}>
          <Header />
        </div>

        {isGuestUser && <GuestModeBanner />}

        <div
          className={`${styles.contentArea} ${
            location.pathname === ROUTES.surveySystem ? styles.contentFlush : ""
          }`}
        >
          <Routes>
            <Route
              path={ROUTES.tracker}
              element={guard("tracker", <BidTrackerPage />)}
            />
            <Route
              path={ROUTES.dashboard}
              element={guard("dashboard", <DashboardPage />)}
            />
            <Route path={ROUTES.bidDetail} element={<BidDetailPage />} />
            <Route
              path={ROUTES.requests}
              element={guard("unassigned", <UnassignedRequestsPage />)}
            />
            <Route
              path={ROUTES.createRequest}
              element={<CreateRequestPage />}
            />
            <Route
              path={ROUTES.flowboard}
              element={
                <RequirePageAccess area="workspace">
                  <FlowBoardPage />
                </RequirePageAccess>
              }
            />
            <Route
              path={ROUTES.timeline}
              element={guard("timeline", <TimelinePage />)}
            />
            <Route
              path={ROUTES.notifications}
              element={guard("notifications", <NotificationsPage />)}
            />
            <Route path={ROUTES.faq} element={guard("faq", <FaqPage />)} />
            <Route
              path={ROUTES.assetsCatalog}
              element={guard("assets-catalog", <AssetsCatalogPage />)}
            />
            <Route
              path={ROUTES.datasheets}
              element={guard("datasheets", <DatasheetsPage />)}
            />
            <Route
              path={ROUTES.manualsCatalogs}
              element={guard("manuals-catalogs", <ManualsCatalogsPage />)}
            />
            <Route
              path={ROUTES.technicalProposals}
              element={guard("technical-proposals", <TechnicalProposalsPage />)}
            />
            <Route
              path={ROUTES.pastBids}
              element={guard("past-bids", <PastBidsPage />)}
            />
            <Route
              path={ROUTES.clarificationsDb}
              element={guard("clarifications-db", <ClarificationsDbPage />)}
            />
            <Route
              path={ROUTES.linksRecommendations}
              element={guard(
                "links-recommendations",
                <LinksRecommendationsPage />,
              )}
            />
            <Route
              path={ROUTES.surveyEquipment}
              element={guard("survey-portal", <SurveyEquipmentPage />)}
            />
            <Route
              path={ROUTES.surveySystem}
              element={guard("survey-portal", <SurveySystemPage />)}
            />
            <Route
              path={ROUTES.analytics}
              element={guard("analytics", <AnalyticsPage />)}
            />
            <Route
              path={ROUTES.performanceTrends}
              element={guard("performance-trends", <PerformanceTrendsPage />)}
            />
            <Route
              path={ROUTES.bottleneckAnalysis}
              element={guard("bottleneck-analysis", <BottleneckAnalysisPage />)}
            />
            <Route
              path={ROUTES.teamAnalytics}
              element={guard("team-analytics", <TeamAnalyticsPage />)}
            />
            <Route
              path={ROUTES.reports}
              element={guard("reports", <ReportsPage />)}
            />
            <Route
              path={ROUTES.periodPerformance}
              element={guard("period-performance", <PeriodPerformancePage />)}
            />
            <Route
              path={ROUTES.bidDetailsReport}
              element={guard("bid-details-report", <BidDetailsReportPage />)}
            />
            <Route
              path={ROUTES.operationalSummary}
              element={guard(
                "operational-summary",
                <OperationalSummaryPage />,
              )}
            />
            <Route
              path={ROUTES.approvals}
              element={
                <RequirePageAccess area="workspace">
                  <ApprovalsPage />
                </RequirePageAccess>
              }
            />
            <Route
              path={ROUTES.followUp}
              element={guard("follow-up", <FollowUpPage />)}
            />
            <Route
              path={ROUTES.templates}
              element={guard("templates", <TemplatesPage />)}
            />
            <Route
              path={ROUTES.favorites}
              element={guard("favorites", <FavoritesPage />)}
            />
            <Route
              path={ROUTES.bomCosts}
              element={guard("bom-costs", <BomCostsPage />)}
            />
            <Route
              path={ROUTES.quotations}
              element={guard("quotations", <QuotationsPage />)}
            />
            <Route
              path={ROUTES.tooling}
              element={guard("tooling-report", <ToolingReportPage />)}
            />
            <Route
              path={ROUTES.queryConsulting}
              element={guard("query-consulting", <QueryConsultingPage />)}
            />
            <Route
              path={ROUTES.easiPriceHistory}
              element={guard("easi-price-history", <EasiPriceHistoryPage />)}
            />
            <Route
              path={ROUTES.easiBidPresentation}
              element={guard(
                "easi-bid-presentation",
                <EasiBidPresentationPage />,
              )}
            />
            <Route
              path={ROUTES.easiBidComparator}
              element={guard("easi-bid-comparator", <EasiBidComparatorPage />)}
            />
            <Route
              path={ROUTES.easiSuppliers}
              element={guard("easi-suppliers", <EasiSuppliersPage />)}
            />
            <Route
              path={ROUTES.systemConfig}
              element={guard("system-config", <SystemConfigPage />)}
            />
            <Route
              path={ROUTES.members}
              element={guard("members", <MembersPage />)}
            />
            <Route
              path={ROUTES.patchNotes}
              element={guard("patch-notes", <PatchNotesPage />)}
            />
          </Routes>
        </div>

        <div className={styles.footerArea}>
          <Footer />
        </div>
      </div>
    </div>
  );
};
