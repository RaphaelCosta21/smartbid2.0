import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNotificationStore } from "../../stores/useNotificationStore";
import { useUIStore, ThemeMode } from "../../stores/useUIStore";
import { useResponsive } from "../../hooks/useResponsive";
import { useSpfxContext } from "../../config/SpfxContext";
import { MembersService } from "../../services/MembersService";
import styles from "./Header.module.scss";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const spfxContext = useSpfxContext();
  const currentUser = useAuthStore((s) => s.currentUser);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const { isMobile } = useResponsive();

  const [photoUrl, setPhotoUrl] = React.useState<string>("");
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  const initials = currentUser.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // Load current user photo from Graph API
  React.useEffect(() => {
    const loadPhoto = async (): Promise<void> => {
      try {
        const graphClient =
          await spfxContext.msGraphClientFactory.getClient("3");
        const photoBlob: Blob = await graphClient.api("/me/photo/$value").get();
        if (photoBlob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64 = base64String.split(",")[1];
            setPhotoUrl(`data:image/jpeg;base64,${base64}`);
          };
          reader.readAsDataURL(photoBlob);
        }
      } catch {
        // No photo available — will show initials
      }
    };
    loadPhoto().catch(() => undefined);
  }, [spfxContext]);

  // Close user menu on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setCommandPaletteOpen]);

  const handleThemeChange = async (newTheme: ThemeMode): Promise<void> => {
    setTheme(newTheme);
    setShowUserMenu(false);
    // Save preference to TEAM_MEMBERS in SharePoint
    try {
      const data = await MembersService.getAll();
      const userEmail = currentUser.email.toLowerCase();
      const memberIdx = data.members.findIndex(
        (m) => m.email.toLowerCase() === userEmail,
      );
      if (memberIdx >= 0) {
        (data.members[memberIdx] as any).themePreference = newTheme;
        await MembersService.save(data);
      }
    } catch (err) {
      console.warn("Could not save theme preference:", err);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.searchBar}>
        <svg
          className={styles.searchIcon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search BIDs, clients, CRM..."
          onClick={() => setCommandPaletteOpen(true)}
          readOnly
        />
        <span className={styles.shortcut}>{isMobile ? "" : "Ctrl+K"}</span>
      </div>

      <div className={styles.headerActions}>
        <button
          className={styles.iconBtn}
          onClick={() => navigate("/notifications")}
          title="Notifications"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 003.4 0" />
          </svg>
          {unreadCount > 0 && (
            <span className={styles.notifBadge}>{unreadCount}</span>
          )}
        </button>

        <button
          className={styles.iconBtn}
          onClick={() => navigate("/settings/config")}
          title="Settings"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>

        <div
          className={styles.userArea}
          ref={userMenuRef}
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className={styles.avatar}>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={currentUser.displayName}
                className={styles.avatarImg}
              />
            ) : (
              initials
            )}
          </div>
          {!isMobile && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>{currentUser.displayName}</span>
              <span className={styles.userRole}>{currentUser.jobTitle}</span>
            </div>
          )}

          {showUserMenu && (
            <div className={styles.userMenu}>
              <div className={styles.userMenuHeader}>
                <div className={styles.userMenuAvatar}>
                  {photoUrl ? (
                    <img src={photoUrl} alt={currentUser.displayName} />
                  ) : (
                    initials
                  )}
                </div>
                <div className={styles.userMenuInfo}>
                  <span className={styles.userMenuName}>
                    {currentUser.displayName}
                  </span>
                  <span className={styles.userMenuEmail}>
                    {currentUser.email}
                  </span>
                </div>
              </div>
              <div className={styles.userMenuDivider} />
              <div className={styles.userMenuSection}>
                <span className={styles.userMenuLabel}>Theme Preference</span>
                <div className={styles.themeOptions}>
                  <button
                    className={`${styles.themeOption} ${theme === "light" ? styles.themeActive : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThemeChange("light");
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                    Light
                  </button>
                  <button
                    className={`${styles.themeOption} ${theme === "dark" ? styles.themeActive : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThemeChange("dark");
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                    Dark
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
