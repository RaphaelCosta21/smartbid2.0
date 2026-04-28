/**
 * SystemConfiguration Component — SMART BID 2.0
 * Real SharePoint data with DEFAULT_SYSTEM_CONFIG as seed.
 * Editable only by engineering sector (or superAdmin).
 * Sidebar navigation with grouped menus.
 */

import * as React from "react";
import styles from "./SystemConfiguration.module.scss";
import {
  ISystemConfig,
  IConfigOption,
  IKPITargets,
  IExchangeRate,
  AccessPermission,
} from "../../models";
import { SystemConfigService } from "../../services/SystemConfigService";
import { DEFAULT_SYSTEM_CONFIG } from "../../data/defaultSystemConfig";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useConfigStore } from "../../stores/useConfigStore";
import { APP_CONFIG } from "../../config/app.config";

/* ------------------------------------------------------------------ */
/* NAV STRUCTURE                                                      */
/* ------------------------------------------------------------------ */

interface INavItem {
  key: string;
  label: string;
  icon: string;
  configKey?: keyof ISystemConfig;
}

interface INavGroup {
  group: string;
  items: INavItem[];
}

const NAV_GROUPS: INavGroup[] = [
  {
    group: "Performance",
    items: [{ key: "kpi", label: "KPI Targets", icon: "📊" }],
  },
  {
    group: "BID Structure",
    items: [
      {
        key: "divisionsAndServiceLines",
        label: "Divisions & Lines",
        icon: "🏢",
      },
      {
        key: "bidTypes",
        label: "Bid Types",
        icon: "📋",
        configKey: "bidTypes",
      },
      {
        key: "phases",
        label: "Phases & Status",
        icon: "📐",
        configKey: "phases",
      },
      { key: "regions", label: "Regions", icon: "🌎", configKey: "regions" },
    ],
  },
  {
    group: "People & Resources",
    items: [
      {
        key: "clientList",
        label: "Clients",
        icon: "🤝",
        configKey: "clientList",
      },
      {
        key: "jobFunctions",
        label: "Job Functions",
        icon: "👷",
        configKey: "jobFunctions",
      },
      {
        key: "hoursPhases",
        label: "Hours Phases",
        icon: "⏱️",
        configKey: "hoursPhases",
      },
      {
        key: "availabilityAcquisition",
        label: "Avail. & Acq. Type",
        icon: "📥",
        configKey: "acquisitionTypes",
      },
      {
        key: "costReferences",
        label: "Cost References",
        icon: "💰",
        configKey: "costReferences",
      },
      {
        key: "resourceTypes",
        label: "Resource Types",
        icon: "🏷️",
        configKey: "resourceTypes",
      },
    ],
  },
  {
    group: "Deliverables",
    items: [
      {
        key: "deliverableTypes",
        label: "BID Deliverables",
        icon: "📦",
        configKey: "deliverableTypes",
      },
      {
        key: "engineerDeliverables",
        label: "Eng. Deliverables",
        icon: "🛠️",
        configKey: "engineerDeliverables",
      },
    ],
  },
  {
    group: "Results",
    items: [
      { key: "resultsAndLoss", label: "Results & Loss Reasons", icon: "🏆" },
    ],
  },
  {
    group: "Financial",
    items: [{ key: "currency", label: "Currency", icon: "💱" }],
  },
  {
    group: "System",
    items: [
      { key: "access", label: "Access Levels", icon: "🔐" },
      { key: "notifications", label: "Notifications", icon: "🔔" },
    ],
  },
];

const ALL_NAV_ITEMS: INavItem[] = ([] as INavItem[]).concat(
  ...NAV_GROUPS.map((g) => g.items),
);

/* ------------------------------------------------------------------ */
/* KPI HELPERS                                                        */
/* ------------------------------------------------------------------ */

const KPI_META: Record<keyof IKPITargets, { label: string; unit: string }> = {
  targetOnTimeDelivery: { label: "On-Time Delivery", unit: "%" },
  targetOTIF: { label: "OTIF (On-Time In-Full)", unit: "%" },
  targetAvgCompletionDays: { label: "Avg Completion", unit: "days" },
  targetFirstPassApproval: { label: "First-Pass Approval", unit: "%" },
  targetApprovalCycleDays: { label: "Approval Cycle", unit: "days" },
  targetCancellationRate: { label: "Cancellation Rate", unit: "%" },
  targetTemplateUsage: { label: "Template Usage", unit: "%" },
  targetOverdueRate: { label: "Overdue Rate", unit: "%" },
  targetWinRate: { label: "Win Rate", unit: "%" },
};

/* ------------------------------------------------------------------ */
/* ACCESS / NOTIFICATION CONSTANTS                                    */
/* ------------------------------------------------------------------ */

const ROLES = [
  "commercial",
  "engineering",
  "project",
  "operation",
  "dataCenter",
  "equipmentInstallation",
  "supplyChain",
  "guest",
] as const;

const ROLE_LABELS: Record<string, string> = {
  commercial: "Commercial",
  engineering: "Engineering",
  project: "Project",
  operation: "Operation",
  dataCenter: "Data Center",
  equipmentInstallation: "Equip. Install.",
  supplyChain: "Supply Chain",
  guest: "Guest",
};

const ACCESS_AREAS: Array<{ key: string; label: string }> = [
  { key: "workspace", label: "Workspace" },
  { key: "insights", label: "Insights" },
  { key: "reports", label: "Reports" },
  { key: "settings", label: "Settings" },
  { key: "approvals", label: "Approvals" },
  { key: "templates", label: "Templates" },
];

const PERM_CYCLE: AccessPermission[] = ["none", "view", "edit"];

const NOTIFICATION_LABELS: Record<string, string> = {
  BID_CREATED: "BID Created",
  BID_ASSIGNED: "BID Assigned",
  STATUS_CHANGED: "Status Changed",
  APPROVAL_REQUESTED: "Approval Requested",
  APPROVAL_RESPONSE: "Approval Response",
  BID_COMPLETED: "BID Completed",
  BID_OVERDUE: "BID Overdue",
  DEADLINE_WARNING: "Deadline Warning",
};

/* Job function team categories */
const JOB_CATEGORIES = ["ROV", "Survey", "Engineer", "General"] as const;

/* ------------------------------------------------------------------ */
/* SUB-COMPONENTS for Phases & Status (need useState per row)          */
/* ------------------------------------------------------------------ */

const PhaseColorRow: React.FC<{
  item: IConfigOption;
  canEdit: boolean;
  onEdit: (item: IConfigOption) => void;
}> = ({ item, canEdit, onEdit }) => {
  return (
    <div className={styles.optionCard}>
      <span
        className={styles.optionColor}
        style={{ background: item.color || "#94a3b8" }}
      />
      <div className={styles.optionInfo}>
        <span className={styles.optionLabel}>{item.label}</span>
      </div>
      {canEdit && (
        <div className={styles.optionActions}>
          <button className={styles.actionBtn} onClick={() => onEdit(item)}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

const SubStatusColorRow: React.FC<{
  item: IConfigOption;
  canEdit: boolean;
  phasesList: IConfigOption[];
  isPhaseChecked: (ss: IConfigOption, phaseValue: string) => boolean;
  onEdit: (item: IConfigOption) => void;
}> = ({ item, canEdit, phasesList, isPhaseChecked, onEdit }) => {
  const cat = (item.category as string) || "all";
  const isAll = cat === "all";
  return (
    <div
      className={styles.optionCard}
      style={{ flexDirection: "column", alignItems: "stretch" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          className={styles.optionColor}
          style={{ background: item.color || "#94a3b8" }}
        />
        <div className={styles.optionInfo}>
          <span className={styles.optionLabel}>{item.label}</span>
          {isAll && (
            <span
              style={{
                fontSize: 10,
                color: "var(--primary-accent)",
                marginLeft: 6,
                fontWeight: 600,
              }}
            >
              ALL PHASES
            </span>
          )}
        </div>
        {canEdit && (
          <div className={styles.optionActions}>
            <button className={styles.actionBtn} onClick={() => onEdit(item)}>
              Edit
            </button>
          </div>
        )}
      </div>
      {/* Phase applicability chips (read-only) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginTop: 8,
          paddingLeft: 38,
        }}
      >
        {phasesList
          .filter((p) => p.isActive)
          .map((phase) => {
            const checked = isPhaseChecked(item, phase.value);
            return (
              <span
                key={phase.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 10px",
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 500,
                  border: checked
                    ? `1.5px solid ${phase.color || "var(--border)"}`
                    : "1.5px solid var(--border-subtle)",
                  background: checked
                    ? `${phase.color || "#3b82f6"}18`
                    : "transparent",
                  color: checked
                    ? phase.color || "var(--text-primary)"
                    : "var(--text-muted)",
                  opacity: checked ? 1 : 0.35,
                }}
              >
                <span style={{ fontSize: 10 }}>{checked ? "✓" : "○"}</span>
                {phase.label}
              </span>
            );
          })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const SystemConfiguration: React.FC = () => {
  const currentUser = useCurrentUser();
  const canEdit =
    currentUser.sector === "engineering" ||
    currentUser.isSuperAdmin === true ||
    (APP_CONFIG.superAdminEmails as readonly string[]).includes(
      currentUser.email,
    );

  const [activeTab, setActiveTab] = React.useState<string>("kpi");
  const [config, setConfig] = React.useState<ISystemConfig | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [showPanel, setShowPanel] = React.useState(false);
  const [editItem, setEditItem] = React.useState<IConfigOption | null>(null);
  const [panelConfigKey, setPanelConfigKey] = React.useState<
    keyof ISystemConfig | null
  >(null);
  const [panelForm, setPanelForm] = React.useState({
    label: "",
    color: "#3b82f6",
    category: "",
  });
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [dirty, setDirty] = React.useState(false);
  const [fetchingRates, setFetchingRates] = React.useState(false);
  const [showAddCurrency, setShowAddCurrency] = React.useState(false);
  const [availableCurrencies, setAvailableCurrencies] = React.useState<
    Array<{ code: string; rate: number }>
  >([]);
  const [addCurrencyLoading, setAddCurrencyLoading] = React.useState(false);
  const [addCurrencySearch, setAddCurrencySearch] = React.useState("");

  const currentNavItem = ALL_NAV_ITEMS.find((n) => n.key === activeTab);

  /* ---- helpers --------------------------------------------------- */

  const showMsg = React.useCallback(
    (type: "success" | "error", text: string): void => {
      setMessage({ type, text });
      setTimeout(() => setMessage(null), 3000);
    },
    [],
  );

  /* ---- load config from SharePoint (or seed default) ------------- */

  const loadConfig = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await SystemConfigService.get();
      // Merge subStatuses from defaults if not present in SP data
      if (!data.subStatuses || data.subStatuses.length === 0) {
        data.subStatuses = [...DEFAULT_SYSTEM_CONFIG.subStatuses];
      }
      // Merge terminalStatuses from defaults if not present
      if (!data.terminalStatuses || data.terminalStatuses.length === 0) {
        data.terminalStatuses = [...DEFAULT_SYSTEM_CONFIG.terminalStatuses];
      }
      setConfig(data);
    } catch {
      // No config in SP yet — seed with defaults
      setConfig({ ...DEFAULT_SYSTEM_CONFIG });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadConfig().catch(() => undefined);
  }, [loadConfig]);

  /* ---- persist to SharePoint ------------------------------------ */

  const saveConfig = React.useCallback(
    async (updatedConfig: ISystemConfig) => {
      setSaving(true);
      try {
        await SystemConfigService.update(updatedConfig);
        SystemConfigService.clearCache();
        setConfig(updatedConfig);
        // Update global store so other pages see the new config immediately
        useConfigStore.getState().setConfig(updatedConfig);
        setDirty(false);
        showMsg("success", "Configuration saved to SharePoint");
      } catch (err) {
        console.error("Failed to save config:", err);
        showMsg("error", "Failed to save — check console for details");
      } finally {
        setSaving(false);
      }
    },
    [showMsg],
  );

  const updateConfig = (patch: Partial<ISystemConfig>): void => {
    if (!config) return;
    setConfig({ ...config, ...patch });
    setDirty(true);
  };

  /* ---- generic list CRUD ---------------------------------------- */

  const handleOptionToggle = (
    configKey: keyof ISystemConfig,
    optionId: string,
  ): void => {
    if (!config || !canEdit) return;
    const list = (config[configKey] as IConfigOption[] | undefined) || [];
    const updated = list.map((o) =>
      o.id === optionId ? { ...o, isActive: !o.isActive } : o,
    );
    updateConfig({ [configKey]: updated });
  };

  const handleDeleteOption = (
    configKey: keyof ISystemConfig,
    optionId: string,
  ): void => {
    if (!config || !canEdit) return;
    const list = (config[configKey] as IConfigOption[] | undefined) || [];
    updateConfig({ [configKey]: list.filter((o) => o.id !== optionId) });
  };

  const openAddPanel = (
    configKey: keyof ISystemConfig,
    category?: string,
  ): void => {
    setEditItem(null);
    setPanelConfigKey(configKey);
    setPanelForm({ label: "", color: "#3b82f6", category: category || "" });
    setShowPanel(true);
  };

  const openEditPanel = (
    configKey: keyof ISystemConfig,
    item: IConfigOption,
  ): void => {
    setEditItem(item);
    setPanelConfigKey(configKey);
    setPanelForm({
      label: item.label,
      color: item.color || "#3b82f6",
      category: (item.category as string) || "",
    });
    setShowPanel(true);
  };

  const handlePanelSave = (): void => {
    if (!config || !panelConfigKey) return;
    const key = panelConfigKey;
    const list = (config[key] as IConfigOption[] | undefined) || [];
    const isColorOnly =
      key === "phases" || key === "subStatuses" || key === "terminalStatuses";

    // For phases we only allow color edits; for subStatuses allow color + phase applicability
    if (isColorOnly && editItem) {
      const patch: Partial<IConfigOption> = { color: panelForm.color };
      if (key === "subStatuses") {
        patch.category = panelForm.category || "all";
      }
      const updated = list.map((o) =>
        o.id === editItem.id ? { ...o, ...patch } : o,
      );
      updateConfig({ [key]: updated });
      showMsg("success", `Updated "${editItem.label}"`);
      setShowPanel(false);
      return;
    }

    if (!panelForm.label.trim()) return;

    if (editItem) {
      const updated = list.map((o) =>
        o.id === editItem.id
          ? {
              ...o,
              label: panelForm.label,
              value: panelForm.label,
              color: panelForm.color,
              category: panelForm.category || undefined,
            }
          : o,
      );
      updateConfig({ [key]: updated });
      showMsg("success", `"${panelForm.label}" updated`);
    } else {
      const newItem: IConfigOption = {
        id: `${String(key)}-${Date.now()}`,
        label: panelForm.label,
        value: panelForm.label,
        isActive: true,
        order: list.length + 1,
        color: panelForm.color,
        category: panelForm.category || undefined,
      };
      updateConfig({ [key]: [...list, newItem] });
      showMsg("success", `"${panelForm.label}" added`);
    }
    setShowPanel(false);
  };

  /* ---- force-update exchange rates ------------------------------- */

  const forceUpdateRates = React.useCallback(async () => {
    if (!config || !canEdit) return;
    setFetchingRates(true);
    try {
      const cs = config.currencySettings;
      const codes = cs.exchangeRates.map((er) => er.currency);
      const resp = await fetch(
        `https://open.er-api.com/v6/latest/${cs.defaultCurrency}`,
      );
      if (!resp.ok) throw new Error(`API returned ${resp.status}`);
      const data = (await resp.json()) as {
        result: string;
        rates: Record<string, number>;
      };
      if (data.result !== "success") throw new Error("API error");

      const now = new Date().toISOString();
      const updatedRates = cs.exchangeRates.map((er) => {
        const newRate = data.rates[er.currency];
        if (newRate !== null && newRate !== undefined) {
          return {
            ...er,
            rate: Math.round(newRate * 100) / 100,
            lastUpdate: now,
          };
        }
        return er;
      });
      const notFound = cs.exchangeRates.filter(
        (er) =>
          data.rates[er.currency] === null ||
          data.rates[er.currency] === undefined,
      );
      updateConfig({
        currencySettings: { ...cs, exchangeRates: updatedRates },
      });
      // Clear cached available currencies so list refreshes
      setAvailableCurrencies([]);
      if (notFound.length > 0) {
        showMsg(
          "error",
          `Updated ${codes.length - notFound.length}/${codes.length}. Not found in API: ${notFound.map((e) => e.currency).join(", ")}`,
        );
      } else {
        showMsg(
          "success",
          `Rates updated from Open Exchange Rates API (${codes.join(", ")})`,
        );
      }
    } catch (err) {
      console.error("Failed to fetch rates:", err);
      showMsg("error", "Failed to fetch exchange rates — check console");
    } finally {
      setFetchingRates(false);
    }
  }, [config, canEdit, showMsg]);

  /* ---- KPI changes ---------------------------------------------- */

  const handleKPIChange = (
    kpiKey: keyof IKPITargets,
    valueStr: string,
  ): void => {
    if (!config || !canEdit) return;
    const num = Number(valueStr);
    if (isNaN(num)) return;
    updateConfig({ kpiTargets: { ...config.kpiTargets, [kpiKey]: num } });
  };

  /* ================================================================ */
  /* RENDER HELPERS                                                   */
  /* ================================================================ */

  /* ---- generic options list ------------------------------------- */

  const renderOptionsList = (
    configKey: keyof ISystemConfig,
    label?: string,
  ): React.ReactElement => {
    if (!config) return <></>;
    const list = (config[configKey] as IConfigOption[] | undefined) || [];
    const displayLabel = label || currentNavItem?.label || "";
    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>{displayLabel}</h3>
          <p>
            Manage the list of {displayLabel.toLowerCase()}. Toggle to
            activate/deactivate.
          </p>
        </div>
        {canEdit && (
          <div className={styles.addBtnRow}>
            <button
              className={`${styles.actionBtn} ${styles.primary}`}
              onClick={() => openAddPanel(configKey)}
            >
              + Add
            </button>
          </div>
        )}
        <div className={styles.optionsList}>
          {list.map((opt) => (
            <div
              key={opt.id}
              className={`${styles.optionCard} ${!opt.isActive ? styles.inactive : ""}`}
            >
              {opt.color && (
                <span
                  className={styles.optionColor}
                  style={{ background: opt.color }}
                />
              )}
              <div className={styles.optionInfo}>
                <span className={styles.optionLabel}>{opt.label}</span>
                {!opt.isActive && (
                  <span className={styles.inactiveTag}>Inactive</span>
                )}
              </div>
              {canEdit && (
                <div className={styles.optionActions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => openEditPanel(configKey, opt)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleOptionToggle(configKey, opt.id)}
                  >
                    {opt.isActive ? "Disable" : "Enable"}
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.danger}`}
                    onClick={() => handleDeleteOption(configKey, opt.id)}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ---- job functions (grouped by team) -------------------------- */

  const renderJobFunctions = (): React.ReactElement => {
    if (!config) return <></>;
    const all = config.jobFunctions;

    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>Job Functions</h3>
          <p>
            Organized by team. &quot;General&quot; functions apply to all teams.
          </p>
        </div>
        {JOB_CATEGORIES.map((cat) => {
          const items = all.filter((j) => (j.category || "General") === cat);
          if (items.length === 0 && !canEdit) return null;
          return (
            <div key={cat} className={styles.groupedSection}>
              <div className={styles.groupLabel}>{cat}</div>
              {canEdit && (
                <div className={styles.addBtnRow}>
                  <button
                    className={`${styles.actionBtn} ${styles.primary}`}
                    onClick={() => openAddPanel("jobFunctions", cat)}
                  >
                    + Add to {cat}
                  </button>
                </div>
              )}
              <div className={styles.optionsList}>
                {items.map((opt) => (
                  <div
                    key={opt.id}
                    className={`${styles.optionCard} ${!opt.isActive ? styles.inactive : ""}`}
                  >
                    <div className={styles.optionInfo}>
                      <span className={styles.optionLabel}>{opt.label}</span>
                      {!opt.isActive && (
                        <span className={styles.inactiveTag}>Inactive</span>
                      )}
                    </div>
                    {canEdit && (
                      <div className={styles.optionActions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => openEditPanel("jobFunctions", opt)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.actionBtn}
                          onClick={() =>
                            handleOptionToggle("jobFunctions", opt.id)
                          }
                        >
                          {opt.isActive ? "Disable" : "Enable"}
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.danger}`}
                          onClick={() =>
                            handleDeleteOption("jobFunctions", opt.id)
                          }
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  /* ---- Divisions & Service Lines (merged) ----------------------- */

  const renderDivisionsAndServiceLines = (): React.ReactElement => {
    if (!config) return <></>;
    const divisions = config.divisions;
    const allLines = config.serviceLines;

    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>Divisions &amp; Service Lines</h3>
          <p>
            Each division contains its own set of service lines. Manage
            divisions and their sub-lines below.
          </p>
        </div>

        {/* Division management */}
        {canEdit && (
          <div className={styles.addBtnRow}>
            <button
              className={`${styles.actionBtn} ${styles.primary}`}
              onClick={() => openAddPanel("divisions")}
            >
              + Add Division
            </button>
          </div>
        )}

        {divisions.map((div) => {
          const lines = allLines.filter((sl) => sl.category === div.value);
          return (
            <div key={div.id} className={styles.groupedSection}>
              <div className={styles.divisionHeader}>
                <div className={styles.divisionTitleRow}>
                  {div.color && (
                    <span
                      className={styles.optionColor}
                      style={{ background: div.color }}
                    />
                  )}
                  <span className={styles.divisionName}>{div.label}</span>
                  {!div.isActive && (
                    <span className={styles.inactiveTag}>Inactive</span>
                  )}
                </div>
                {canEdit && (
                  <div className={styles.optionActions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => openEditPanel("divisions", div)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleOptionToggle("divisions", div.id)}
                    >
                      {div.isActive ? "Disable" : "Enable"}
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.danger}`}
                      onClick={() => handleDeleteOption("divisions", div.id)}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {canEdit && (
                <div className={styles.addBtnRow}>
                  <button
                    className={`${styles.actionBtn} ${styles.primary}`}
                    onClick={() => openAddPanel("serviceLines", div.value)}
                  >
                    + Add Service Line to {div.label}
                  </button>
                </div>
              )}

              <div className={styles.optionsList}>
                {lines.length === 0 && (
                  <div className={styles.emptyHint}>
                    No service lines for this division yet.
                  </div>
                )}
                {lines.map((opt) => (
                  <div
                    key={opt.id}
                    className={`${styles.optionCard} ${!opt.isActive ? styles.inactive : ""}`}
                  >
                    <div className={styles.optionInfo}>
                      {opt.color && (
                        <span
                          className={styles.optionColor}
                          style={{ background: opt.color }}
                        />
                      )}
                      <span className={styles.optionLabel}>{opt.label}</span>
                      {!opt.isActive && (
                        <span className={styles.inactiveTag}>Inactive</span>
                      )}
                    </div>
                    {canEdit && (
                      <div className={styles.optionActions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => openEditPanel("serviceLines", opt)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.actionBtn}
                          onClick={() =>
                            handleOptionToggle("serviceLines", opt.id)
                          }
                        >
                          {opt.isActive ? "Disable" : "Enable"}
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.danger}`}
                          onClick={() =>
                            handleDeleteOption("serviceLines", opt.id)
                          }
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  /* ---- KPI targets ---------------------------------------------- */

  const renderKPITargets = (): React.ReactElement => {
    if (!config) return <></>;
    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>KPI Targets</h3>
          <p>
            Define target thresholds for key performance indicators displayed on
            dashboards.
          </p>
        </div>
        <div className={styles.kpiGrid}>
          {(Object.keys(KPI_META) as Array<keyof IKPITargets>).map((k) => (
            <div key={k} className={styles.kpiCard}>
              <div className={styles.kpiLabel}>{KPI_META[k].label}</div>
              <div className={styles.kpiInputRow}>
                <input
                  type="number"
                  className={styles.kpiInput}
                  value={config.kpiTargets[k]}
                  onChange={(e) => handleKPIChange(k, e.currentTarget.value)}
                  readOnly={!canEdit}
                />
                <span className={styles.kpiUnit}>{KPI_META[k].unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ---- Results + Loss Reasons (merged) -------------------------- */

  const renderResultsAndLoss = (): React.ReactElement => {
    if (!config) return <></>;
    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>BID Results & Loss Reasons</h3>
          <p>
            Manage result outcomes. Loss reasons are shown when a BID is marked
            as lost.
          </p>
        </div>

        <div className={styles.groupedSection}>
          <div className={styles.groupLabel}>Result Options</div>
          {canEdit && (
            <div className={styles.addBtnRow}>
              <button
                className={`${styles.actionBtn} ${styles.primary}`}
                onClick={() => openAddPanel("bidResultOptions")}
              >
                + Add Result
              </button>
            </div>
          )}
          <div className={styles.optionsList}>
            {config.bidResultOptions.map((opt) => (
              <div
                key={opt.id}
                className={`${styles.optionCard} ${!opt.isActive ? styles.inactive : ""}`}
              >
                {opt.color && (
                  <span
                    className={styles.optionColor}
                    style={{ background: opt.color }}
                  />
                )}
                <div className={styles.optionInfo}>
                  <span className={styles.optionLabel}>{opt.label}</span>
                  {!opt.isActive && (
                    <span className={styles.inactiveTag}>Inactive</span>
                  )}
                </div>
                {canEdit && (
                  <div className={styles.optionActions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => openEditPanel("bidResultOptions", opt)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() =>
                        handleOptionToggle("bidResultOptions", opt.id)
                      }
                    >
                      {opt.isActive ? "Disable" : "Enable"}
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.danger}`}
                      onClick={() =>
                        handleDeleteOption("bidResultOptions", opt.id)
                      }
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.groupedSection}>
          <div className={styles.groupLabel}>Loss Reasons</div>
          {canEdit && (
            <div className={styles.addBtnRow}>
              <button
                className={`${styles.actionBtn} ${styles.primary}`}
                onClick={() => openAddPanel("lossReasons")}
              >
                + Add Loss Reason
              </button>
            </div>
          )}
          <div className={styles.optionsList}>
            {config.lossReasons.map((opt) => (
              <div
                key={opt.id}
                className={`${styles.optionCard} ${!opt.isActive ? styles.inactive : ""}`}
              >
                <div className={styles.optionInfo}>
                  <span className={styles.optionLabel}>{opt.label}</span>
                  {!opt.isActive && (
                    <span className={styles.inactiveTag}>Inactive</span>
                  )}
                </div>
                {canEdit && (
                  <div className={styles.optionActions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => openEditPanel("lossReasons", opt)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleOptionToggle("lossReasons", opt.id)}
                    >
                      {opt.isActive ? "Disable" : "Enable"}
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.danger}`}
                      onClick={() => handleDeleteOption("lossReasons", opt.id)}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ---- Currency ------------------------------------------------- */

  const renderCurrency = (): React.ReactElement => {
    if (!config) return <></>;
    const cs = config.currencySettings;

    const updateRate = (idx: number, newRate: string): void => {
      if (!canEdit) return;
      const num = Number(newRate);
      if (isNaN(num)) return;
      const rates = [...cs.exchangeRates];
      rates[idx] = {
        ...rates[idx],
        rate: num,
        lastUpdate: new Date().toISOString(),
      };
      updateConfig({ currencySettings: { ...cs, exchangeRates: rates } });
    };

    const removeRate = (idx: number): void => {
      if (!canEdit) return;
      const rates = cs.exchangeRates.filter((_, i) => i !== idx);
      updateConfig({ currencySettings: { ...cs, exchangeRates: rates } });
    };

    const addRate = (): void => {
      if (!canEdit) return;
      // Fetch available currencies from the API
      setShowAddCurrency(true);
      setAddCurrencySearch("");
      if (availableCurrencies.length === 0) {
        setAddCurrencyLoading(true);
        fetch(`https://open.er-api.com/v6/latest/${cs.defaultCurrency}`)
          .then((resp) => {
            if (!resp.ok) throw new Error("API error");
            return resp.json();
          })
          .then((data: { result: string; rates: Record<string, number> }) => {
            if (data.result !== "success") throw new Error("API error");
            const existing = new Set(cs.exchangeRates.map((r) => r.currency));
            existing.add(cs.defaultCurrency);
            const list: Array<{ code: string; rate: number }> = [];
            Object.keys(data.rates).forEach((code) => {
              if (!existing.has(code)) {
                list.push({ code, rate: data.rates[code] });
              }
            });
            list.sort((a, b) => a.code.localeCompare(b.code));
            setAvailableCurrencies(list);
            setAddCurrencyLoading(false);
          })
          .catch(() => {
            showMsg("error", "Failed to load currencies from API");
            setShowAddCurrency(false);
            setAddCurrencyLoading(false);
          });
      }
    };

    const handleSelectCurrency = (code: string, rate: number): void => {
      const newEntry: IExchangeRate = {
        currency: code,
        rate: Math.round(rate * 100) / 100,
        lastUpdate: new Date().toISOString(),
      };
      updateConfig({
        currencySettings: {
          ...cs,
          exchangeRates: [...cs.exchangeRates, newEntry],
        },
      });
      // Remove from available list
      setAvailableCurrencies((prev) => prev.filter((c) => c.code !== code));
      setShowAddCurrency(false);
      showMsg(
        "success",
        `${code} added with rate ${Math.round(rate * 100) / 100}`,
      );
    };

    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>Currency Settings</h3>
          <p>
            Default currency: <strong>{cs.defaultCurrency}</strong>. Exchange
            rates update <strong>{cs.updateFrequency}</strong> (beginning of
            each month). Source:{" "}
            <a
              href="https://open.er-api.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--primary-accent)" }}
            >
              Open Exchange Rates API
            </a>
            .
          </p>
        </div>
        {canEdit && (
          <div className={styles.addBtnRow}>
            <button
              className={`${styles.actionBtn} ${styles.primary}`}
              onClick={forceUpdateRates}
              disabled={fetchingRates}
            >
              {fetchingRates ? "Updating…" : "⟳ Force Update Rates"}
            </button>
          </div>
        )}
        <div className={styles.currencyGrid}>
          {cs.exchangeRates.map((er, idx) => {
            const lastDate = new Date(er.lastUpdate);
            const formatted = `${lastDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
            return (
              <div key={er.currency} className={styles.currencyCard}>
                <div className={styles.currencyHeader}>
                  <span className={styles.currencyCode}>{er.currency}</span>
                  <span className={styles.currencyLabel}>
                    1 {cs.defaultCurrency} =
                  </span>
                </div>
                <div className={styles.currencyRate}>
                  <input
                    type="number"
                    step="0.01"
                    value={er.rate}
                    onChange={(e) => updateRate(idx, e.currentTarget.value)}
                    readOnly={!canEdit}
                  />
                  <span>{er.currency}</span>
                </div>
                <div className={styles.currencyMeta}>
                  Last update: {formatted}
                  {canEdit && (
                    <button
                      className={`${styles.actionBtn} ${styles.danger}`}
                      onClick={() => removeRate(idx)}
                      style={{ marginLeft: 8 }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {canEdit && (
          <div className={styles.addBtnRow} style={{ marginTop: 16 }}>
            <button
              className={`${styles.actionBtn} ${styles.primary}`}
              onClick={addRate}
              disabled={showAddCurrency && addCurrencyLoading}
            >
              + Add Currency
            </button>
          </div>
        )}
        {showAddCurrency && (
          <div className={styles.addCurrencyPanel}>
            <div className={styles.addCurrencyHeader}>
              <span>Select currency to add</span>
              <button
                className={styles.actionBtn}
                onClick={() => setShowAddCurrency(false)}
              >
                ✕
              </button>
            </div>
            {addCurrencyLoading ? (
              <div className={styles.addCurrencyLoading}>
                Loading currencies from API…
              </div>
            ) : (
              <>
                <input
                  className={styles.addCurrencySearch}
                  type="text"
                  placeholder="Search currency code (e.g. AUD, JPY, CHF)…"
                  value={addCurrencySearch}
                  onChange={(e) =>
                    setAddCurrencySearch(e.target.value.toUpperCase())
                  }
                  autoFocus
                />
                <div className={styles.addCurrencyList}>
                  {availableCurrencies
                    .filter((c) =>
                      addCurrencySearch
                        ? c.code.indexOf(addCurrencySearch) >= 0
                        : true,
                    )
                    .slice(0, 50)
                    .map((c) => (
                      <button
                        key={c.code}
                        className={styles.addCurrencyItem}
                        onClick={() => handleSelectCurrency(c.code, c.rate)}
                      >
                        <span className={styles.addCurrencyCode}>{c.code}</span>
                        <span className={styles.addCurrencyRate}>
                          1 {cs.defaultCurrency} ={" "}
                          {Math.round(c.rate * 100) / 100}
                        </span>
                      </button>
                    ))}
                  {availableCurrencies.filter((c) =>
                    addCurrencySearch
                      ? c.code.indexOf(addCurrencySearch) >= 0
                      : true,
                  ).length === 0 && (
                    <div className={styles.addCurrencyEmpty}>
                      No currencies match &quot;{addCurrencySearch}&quot;
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  /* ---- Access Levels (clickable badges to cycle) ---------------- */

  const renderAccessLevels = (): React.ReactElement => {
    if (!config) return <></>;

    const cyclePerm = (role: string, area: string): void => {
      if (!canEdit) return;
      const current =
        config.accessLevels[role as keyof typeof config.accessLevels]?.[
          area as keyof typeof config.accessLevels.commercial
        ] || "none";
      const nextIdx = (PERM_CYCLE.indexOf(current) + 1) % PERM_CYCLE.length;
      const next = PERM_CYCLE[nextIdx];
      updateConfig({
        accessLevels: {
          ...config.accessLevels,
          [role]: {
            ...config.accessLevels[role as keyof typeof config.accessLevels],
            [area]: next,
          },
        },
      });
    };

    const roleCount = ROLES.length;

    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>Access Levels</h3>
          <p>
            {canEdit
              ? "Click on a badge to cycle between None → View → Edit."
              : "View permissions per role. Only engineering can edit."}
          </p>
        </div>
        <div
          className={styles.accessGrid}
          style={{ "--role-count": roleCount } as React.CSSProperties}
        >
          <div className={styles.accessGridHeader}>
            <div>Area</div>
            {ROLES.map((r) => (
              <div key={r}>{ROLE_LABELS[r]}</div>
            ))}
          </div>
          {ACCESS_AREAS.map((area) => (
            <div key={area.key} className={styles.accessGridRow}>
              <div>{area.label}</div>
              {ROLES.map((role) => {
                const perm =
                  config.accessLevels[role]?.[
                    area.key as keyof typeof config.accessLevels.commercial
                  ] || "none";
                return (
                  <div key={role}>
                    <span
                      className={`${styles.accessBadge} ${perm === "edit" ? styles.edit : perm === "view" ? styles.view : styles.none} ${!canEdit ? styles.readonly : ""}`}
                      onClick={() => cyclePerm(role, area.key)}
                      title={canEdit ? "Click to change" : perm}
                    >
                      {perm}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ---- Notifications (toggle matrix) ---------------------------- */

  const renderNotifications = (): React.ReactElement => {
    if (!config) return <></>;
    const notifs = config.notifications;
    const events = Object.keys(notifs);

    const toggleNotif = (event: string, role: string): void => {
      if (!canEdit) return;
      const current = notifs[event] || [];
      const updated = current.includes(role)
        ? current.filter((r) => r !== role)
        : [...current, role];
      updateConfig({ notifications: { ...notifs, [event]: updated } });
    };

    const roleCount = ROLES.length;

    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>Notification Rules</h3>
          <p>
            {canEdit
              ? "Toggle which roles receive notifications for each event."
              : "View notification settings. Only engineering can edit."}
          </p>
        </div>
        <div
          className={styles.notifGrid}
          style={{ "--role-count": roleCount } as React.CSSProperties}
        >
          <div className={styles.notifGridHeader}>
            <div>Event</div>
            {ROLES.map((r) => (
              <div key={r}>{ROLE_LABELS[r]}</div>
            ))}
          </div>
          {events.map((event) => (
            <div key={event} className={styles.notifGridRow}>
              <div>
                {NOTIFICATION_LABELS[event] || event.replace(/_/g, " ")}
              </div>
              {ROLES.map((role) => {
                const isOn = (notifs[event] || []).includes(role);
                return (
                  <div key={role}>
                    <button
                      className={`${styles.notifToggle} ${isOn ? styles.on : styles.off} ${!canEdit ? styles.readonly : ""}`}
                      onClick={() => toggleNotif(event, role)}
                      disabled={!canEdit}
                      title={isOn ? "Enabled" : "Disabled"}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ---- Phases & Sub-Statuses ------------------------------------ */

  const renderPhasesAndSubStatuses = (): React.ReactElement => {
    if (!config) return <></>;
    const phasesList = config.phases;
    const subStatusList = config.subStatuses || [];

    const isPhaseChecked = (ss: IConfigOption, phaseValue: string): boolean => {
      const cat = (ss.category as string) || "all";
      if (cat === "all") return true;
      return cat
        .split(",")
        .map((s) => s.trim())
        .includes(phaseValue);
    };

    return (
      <div>
        {/* Phases section */}
        <div className={styles.sectionHeader}>
          <h3>Phases</h3>
          <p>
            Main workflow phases of a BID. You can customize the color used
            across all badges, charts, and tables.
          </p>
        </div>
        <div className={styles.optionsList}>
          {phasesList.map((opt) => (
            <PhaseColorRow
              key={opt.id}
              item={opt}
              canEdit={canEdit}
              onEdit={(item) => openEditPanel("phases", item)}
            />
          ))}
        </div>

        {/* Sub-Statuses section */}
        <div className={styles.sectionHeader} style={{ marginTop: 32 }}>
          <h3>Status</h3>
          <p>
            Workflow statuses that can appear within multiple phases. You can
            customize the color. The phase applicability is shown as read-only
            chips below each status.
          </p>
        </div>
        <div className={styles.optionsList}>
          {subStatusList.map((ss) => (
            <SubStatusColorRow
              key={ss.id}
              item={ss}
              canEdit={canEdit}
              phasesList={phasesList}
              isPhaseChecked={isPhaseChecked}
              onEdit={(item) => openEditPanel("subStatuses", item)}
            />
          ))}
        </div>

        {/* Terminal Statuses section */}
        <div className={styles.sectionHeader} style={{ marginTop: 32 }}>
          <h3>Terminal Statuses</h3>
          <p>
            Final statuses that close a BID. Only available when the phase is
            &quot;Close Out&quot;. These are pre-configured and cannot be added
            or removed.
          </p>
        </div>
        <div className={styles.optionsList}>
          {(config.terminalStatuses || []).map((ts) => (
            <div key={ts.id} className={styles.optionCard}>
              <span
                className={styles.optionColor}
                style={{ background: ts.color || "#94a3b8" }}
              />
              <div className={styles.optionInfo}>
                <span className={styles.optionLabel}>{ts.label}</span>
                <span
                  style={{
                    fontSize: 10,
                    color: "var(--text-muted)",
                    marginLeft: 6,
                  }}
                >
                  Close Out only
                </span>
              </div>
              {canEdit && (
                <div className={styles.optionActions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => openEditPanel("terminalStatuses", ts)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ================================================================ */
  /* RESOURCE TYPES (grouped with sub-types)                          */
  /* ================================================================ */

  const renderResourceTypes = (): React.ReactElement => {
    const resourceTypes = config?.resourceTypes || [];

    const addResourceType = (): void => {
      const newType = {
        id: `rt-${Date.now()}`,
        label: "New Resource Type",
        isActive: true,
        order: resourceTypes.length,
        subTypes: [],
      };
      updateConfig({ resourceTypes: [...resourceTypes, newType] });
    };

    const updateResourceType = (
      id: string,
      patch: Record<string, unknown>,
    ): void => {
      updateConfig({
        resourceTypes: resourceTypes.map((rt) =>
          rt.id === id ? { ...rt, ...patch } : rt,
        ),
      });
    };

    const deleteResourceType = (id: string): void => {
      updateConfig({
        resourceTypes: resourceTypes.filter((rt) => rt.id !== id),
      });
    };

    const addSubType = (parentId: string): void => {
      updateConfig({
        resourceTypes: resourceTypes.map((rt) =>
          rt.id === parentId
            ? {
                ...rt,
                subTypes: [
                  ...rt.subTypes,
                  {
                    id: `st-${Date.now()}`,
                    value: `subtype-${Date.now()}`,
                    label: "New Sub-Type",
                    isActive: true,
                  },
                ],
              }
            : rt,
        ),
      });
    };

    const updateSubType = (
      parentId: string,
      subId: string,
      patch: Record<string, unknown>,
    ): void => {
      updateConfig({
        resourceTypes: resourceTypes.map((rt) =>
          rt.id === parentId
            ? {
                ...rt,
                subTypes: rt.subTypes.map((st) =>
                  st.id === subId ? { ...st, ...patch } : st,
                ),
              }
            : rt,
        ),
      });
    };

    const deleteSubType = (parentId: string, subId: string): void => {
      updateConfig({
        resourceTypes: resourceTypes.map((rt) =>
          rt.id === parentId
            ? { ...rt, subTypes: rt.subTypes.filter((st) => st.id !== subId) }
            : rt,
        ),
      });
    };

    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h3 style={{ margin: 0 }}>Resource Types</h3>
          <button
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid var(--border-subtle)",
              background: "var(--accent-color)",
              color: "#fff",
              fontSize: 13,
              cursor: "pointer",
            }}
            onClick={addResourceType}
          >
            + Add Resource Type
          </button>
        </div>
        {resourceTypes.length === 0 && (
          <p style={{ color: "var(--text-secondary)" }}>
            No resource types configured.
          </p>
        )}
        {resourceTypes.map((rt) => (
          <div
            key={rt.id}
            style={{
              marginBottom: 16,
              padding: 16,
              borderRadius: 10,
              border: "1px solid var(--border-subtle)",
              background: "var(--glass-bg, rgba(255,255,255,0.04))",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <input
                style={{
                  flex: 1,
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "6px 10px",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 6,
                  background: "var(--input-bg, rgba(255,255,255,0.08))",
                  color: "var(--text-primary)",
                }}
                value={rt.label}
                onChange={(e) =>
                  updateResourceType(rt.id, { label: e.target.value })
                }
              />
              <label
                style={{
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <input
                  type="checkbox"
                  checked={rt.isActive}
                  onChange={(e) =>
                    updateResourceType(rt.id, { isActive: e.target.checked })
                  }
                />
                Active
              </label>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#ef4444",
                  fontSize: 16,
                  padding: "2px 6px",
                }}
                onClick={() => deleteResourceType(rt.id)}
              >
                ✕
              </button>
            </div>
            <div style={{ paddingLeft: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  Sub-Types ({rt.subTypes.length})
                </span>
                <button
                  style={{
                    fontSize: 11,
                    background: "transparent",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 4,
                    padding: "2px 8px",
                    cursor: "pointer",
                    color: "var(--accent-color)",
                  }}
                  onClick={() => addSubType(rt.id)}
                >
                  + Sub-Type
                </button>
              </div>
              {rt.subTypes.map((st) => (
                <div
                  key={st.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <input
                    style={{
                      flex: 1,
                      fontSize: 13,
                      padding: "4px 8px",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: 4,
                      background: "var(--input-bg, rgba(255,255,255,0.08))",
                      color: "var(--text-primary)",
                    }}
                    value={st.label}
                    onChange={(e) => {
                      updateSubType(rt.id, st.id, {
                        label: e.target.value,
                        value: e.target.value,
                      });
                    }}
                  />
                  <label
                    style={{
                      fontSize: 11,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={st.isActive !== false}
                      onChange={(e) =>
                        updateSubType(rt.id, st.id, {
                          isActive: e.target.checked,
                        })
                      }
                    />
                    Active
                  </label>
                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#ef4444",
                      fontSize: 14,
                    }}
                    onClick={() => deleteSubType(rt.id, st.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  /* ---- Availability & Acquisition Type (combined) --------------- */

  const renderAvailabilityAndAcquisition = (): React.ReactElement => {
    if (!config) return <></>;
    const availList = config.availabilityStatuses || [];
    const acqList = config.acquisitionTypes || [];

    const sectionHeaderStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
      paddingBottom: 8,
      borderBottom: "1px solid var(--border-subtle)",
    };
    const sectionTitleStyle: React.CSSProperties = {
      fontSize: 15,
      fontWeight: 600,
      color: "var(--text-primary)",
      margin: 0,
    };
    const sectionDescStyle: React.CSSProperties = {
      fontSize: 12,
      color: "var(--text-muted)",
      margin: "0 0 16px",
    };
    const catBadgeStyle = (cat: string): React.CSSProperties => ({
      fontSize: 10,
      padding: "2px 8px",
      borderRadius: 4,
      fontWeight: 600,
      marginLeft: 8,
      background:
        cat === "CAPEX"
          ? "rgba(0,201,167,0.15)"
          : cat === "OPEX"
            ? "rgba(99,102,241,0.15)"
            : "rgba(150,150,150,0.15)",
      color:
        cat === "CAPEX"
          ? "var(--success, #00c9a7)"
          : cat === "OPEX"
            ? "var(--primary-accent, #6366f1)"
            : "var(--text-muted)",
    });

    return (
      <div>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>
            📦 Availability &amp; Acquisition Types
          </h3>
        </div>
        <p style={sectionDescStyle}>
          Each Availability Status has its own set of applicable Acquisition
          Types. Manage availability statuses and their acquisition sub-types
          below.
        </p>

        {/* Add Availability Status */}
        {canEdit && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 12,
            }}
          >
            <button
              className={`${styles.actionBtn} ${styles.primary}`}
              onClick={() =>
                openAddPanel("availabilityStatuses" as keyof ISystemConfig)
              }
            >
              + Add Availability Status
            </button>
          </div>
        )}

        {availList.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            No availability statuses configured.
          </p>
        )}

        {availList.map((avail) => {
          const childAcqs = acqList.filter(
            (at) =>
              at.category === avail.value ||
              at.category === `${avail.value}|CAPEX` ||
              at.category === `${avail.value}|OPEX`,
          );
          // Parse cost type from category: "AvailValue" or "AvailValue|CAPEX"
          const getCostType = (at: IConfigOption): string => {
            const cat = at.category || "";
            const parts = cat.split("|");
            return parts.length > 1 ? parts[1] : "";
          };

          return (
            <div key={avail.id} className={styles.groupedSection}>
              <div className={styles.divisionHeader}>
                <div className={styles.divisionTitleRow}>
                  <span className={styles.divisionName}>{avail.label}</span>
                  {avail.isActive === false && (
                    <span className={styles.inactiveTag}>Inactive</span>
                  )}
                </div>
                {canEdit && (
                  <div className={styles.optionActions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() =>
                        openEditPanel(
                          "availabilityStatuses" as keyof ISystemConfig,
                          avail,
                        )
                      }
                    >
                      Edit
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() =>
                        handleOptionToggle(
                          "availabilityStatuses" as keyof ISystemConfig,
                          avail.id,
                        )
                      }
                    >
                      {avail.isActive !== false ? "Disable" : "Enable"}
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.danger}`}
                      onClick={() =>
                        handleDeleteOption(
                          "availabilityStatuses" as keyof ISystemConfig,
                          avail.id,
                        )
                      }
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {canEdit && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 8,
                  }}
                >
                  <button
                    className={`${styles.actionBtn} ${styles.primary}`}
                    onClick={() =>
                      openAddPanel("acquisitionTypes", avail.value)
                    }
                  >
                    + Add Acq. Type to {avail.label}
                  </button>
                </div>
              )}

              <div className={styles.optionsList}>
                {childAcqs.length === 0 && (
                  <div className={styles.emptyHint}>
                    No acquisition types for this availability status yet.
                  </div>
                )}
                {childAcqs.map((opt) => (
                  <div
                    key={opt.id}
                    className={`${styles.optionCard} ${opt.isActive === false ? styles.inactive : ""}`}
                  >
                    <div className={styles.optionInfo}>
                      <span className={styles.optionLabel}>{opt.label}</span>
                      {getCostType(opt) && (
                        <span style={catBadgeStyle(getCostType(opt))}>
                          {getCostType(opt)}
                        </span>
                      )}
                      {opt.isActive === false && (
                        <span className={styles.inactiveTag}>Inactive</span>
                      )}
                    </div>
                    {canEdit && (
                      <div className={styles.optionActions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => openEditPanel("acquisitionTypes", opt)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.actionBtn}
                          onClick={() =>
                            handleOptionToggle("acquisitionTypes", opt.id)
                          }
                        >
                          {opt.isActive !== false ? "Disable" : "Enable"}
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.danger}`}
                          onClick={() =>
                            handleDeleteOption("acquisitionTypes", opt.id)
                          }
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Uncategorized acquisition types */}
        {(() => {
          const availValues = new Set(availList.map((a) => a.value));
          const uncategorized = acqList.filter((at) => {
            const parentVal = (at.category || "").split("|")[0];
            return !parentVal || !availValues.has(parentVal);
          });
          if (uncategorized.length === 0) return null;
          return (
            <div className={styles.groupedSection}>
              <div className={styles.groupLabel}>
                Uncategorized Acquisition Types
              </div>
              <div className={styles.optionsList}>
                {uncategorized.map((opt) => (
                  <div
                    key={opt.id}
                    className={`${styles.optionCard} ${opt.isActive === false ? styles.inactive : ""}`}
                  >
                    <div className={styles.optionInfo}>
                      <span className={styles.optionLabel}>{opt.label}</span>
                      {opt.category && (
                        <span style={catBadgeStyle(opt.category)}>
                          {opt.category}
                        </span>
                      )}
                    </div>
                    {canEdit && (
                      <div className={styles.optionActions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => openEditPanel("acquisitionTypes", opt)}
                        >
                          Edit
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.danger}`}
                          onClick={() =>
                            handleDeleteOption("acquisitionTypes", opt.id)
                          }
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  /* ================================================================ */
  /* TAB ROUTER                                                       */
  /* ================================================================ */

  const renderTabContent = (): React.ReactElement | null => {
    if (!config) return null;
    switch (activeTab) {
      case "kpi":
        return renderKPITargets();
      case "divisionsAndServiceLines":
        return renderDivisionsAndServiceLines();
      case "jobFunctions":
        return renderJobFunctions();
      case "resultsAndLoss":
        return renderResultsAndLoss();
      case "currency":
        return renderCurrency();
      case "access":
        return renderAccessLevels();
      case "notifications":
        return renderNotifications();
      case "phases":
        return renderPhasesAndSubStatuses();
      case "resourceTypes":
        return renderResourceTypes();
      case "availabilityAcquisition":
        return renderAvailabilityAndAcquisition();
      default: {
        if (currentNavItem?.configKey) {
          return renderOptionsList(currentNavItem.configKey);
        }
        return null;
      }
    }
  };

  /* ================================================================ */
  /* MAIN RENDER                                                      */
  /* ================================================================ */

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.headerIcon}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
          <div className={styles.headerText}>
            <h2 className={styles.title}>System Configuration</h2>
            <p className={styles.subtitle}>
              Manage BID system settings, KPIs, access levels, and workflows
            </p>
          </div>
        </div>
      </div>

      {/* Read-only banner */}
      {!canEdit && (
        <div className={styles.readOnlyBanner}>
          🔒 You have read-only access. Only the Engineering team can edit
          system configuration.
        </div>
      )}

      {/* Message bar */}
      {message && (
        <div
          className={`${styles.messageBar} ${message.type === "success" ? styles.success : styles.error}`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          Loading configuration...
        </div>
      ) : (
        <div className={styles.body}>
          {/* Sidebar */}
          <nav className={styles.sidebar}>
            {NAV_GROUPS.map((group) => (
              <div key={group.group} className={styles.navGroup}>
                <div className={styles.navGroupLabel}>{group.group}</div>
                {group.items.map((item) => (
                  <button
                    key={item.key}
                    className={`${styles.navItem} ${activeTab === item.key ? styles.active : ""}`}
                    onClick={() => setActiveTab(item.key)}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* Content */}
          <div className={styles.content}>
            <div className={styles.tabContent}>{renderTabContent()}</div>

            {/* Save bar */}
            {dirty && canEdit && (
              <div className={styles.saveBar}>
                <button
                  className={styles.actionBtn}
                  onClick={() => {
                    setConfig(null);
                    setDirty(false);
                    loadConfig().catch(() => undefined);
                  }}
                >
                  Discard
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.primary}`}
                  onClick={() => config && saveConfig(config)}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-over panel (Add / Edit) */}
      {showPanel && (
        <>
          <div
            className={styles.panelBackdrop}
            onClick={() => setShowPanel(false)}
          />
          <div className={styles.panelOverlay}>
            <div className={styles.panelHeader}>
              <h3>{editItem ? "Edit" : "Add"}</h3>
              <button
                className={styles.actionBtn}
                onClick={() => setShowPanel(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.panelBody}>
              {panelConfigKey !== "phases" &&
                panelConfigKey !== "subStatuses" &&
                panelConfigKey !== "terminalStatuses" && (
                  <div className={styles.fieldGroup}>
                    <label>Label</label>
                    <input
                      value={panelForm.label}
                      onChange={(e) =>
                        setPanelForm({
                          ...panelForm,
                          label: e.currentTarget.value,
                        })
                      }
                      placeholder="Display label"
                      autoFocus
                    />
                  </div>
                )}
              {(panelConfigKey === "phases" ||
                panelConfigKey === "subStatuses" ||
                panelConfigKey === "terminalStatuses") &&
                editItem && (
                  <div className={styles.fieldGroup}>
                    <label>Item</label>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {editItem.label}
                    </span>
                  </div>
                )}
              <div className={styles.fieldGroup}>
                <label>Color</label>
                <input
                  type="color"
                  value={panelForm.color}
                  onChange={(e) =>
                    setPanelForm({ ...panelForm, color: e.currentTarget.value })
                  }
                />
              </div>
              {panelConfigKey === "jobFunctions" && (
                <div className={styles.fieldGroup}>
                  <label>Team</label>
                  <select
                    value={panelForm.category}
                    onChange={(e) =>
                      setPanelForm({
                        ...panelForm,
                        category: e.currentTarget.value,
                      })
                    }
                  >
                    {JOB_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {panelConfigKey === "serviceLines" && config && (
                <div className={styles.fieldGroup}>
                  <label>Division</label>
                  <select
                    value={panelForm.category}
                    onChange={(e) =>
                      setPanelForm({
                        ...panelForm,
                        category: e.currentTarget.value,
                      })
                    }
                  >
                    <option value="">— Select —</option>
                    {config.divisions
                      .filter((d) => d.isActive)
                      .map((d) => (
                        <option key={d.id} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              {panelConfigKey === "subStatuses" && editItem && config && (
                <div className={styles.fieldGroup}>
                  <label>Applicable Phases</label>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      margin: "0 0 8px",
                    }}
                  >
                    Select which phases this status applies to. Leave all
                    unchecked for &quot;All Phases&quot;.
                  </p>
                  {(() => {
                    const cat =
                      panelForm.category === undefined ||
                      panelForm.category === null
                        ? "all"
                        : panelForm.category;
                    const selectedPhases =
                      cat === "all"
                        ? []
                        : cat === ""
                          ? []
                          : cat
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean);
                    const allChecked = cat === "all";
                    return (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 13,
                            fontWeight: allChecked ? 600 : 400,
                            color: allChecked
                              ? "var(--primary-accent)"
                              : "var(--text-primary)",
                            padding: "4px 0",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={allChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPanelForm({ ...panelForm, category: "all" });
                              } else {
                                setPanelForm({ ...panelForm, category: "" });
                              }
                            }}
                          />
                          All Phases
                        </label>
                        <div
                          style={{
                            borderTop: "1px solid var(--border-subtle)",
                            margin: "4px 0",
                          }}
                        />
                        {config.phases
                          .filter((p) => p.isActive)
                          .map((phase) => {
                            return (
                              <label
                                key={phase.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  fontSize: 13,
                                  color: "var(--text-primary)",
                                  padding: "4px 0",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    allChecked ||
                                    selectedPhases.includes(phase.value)
                                  }
                                  disabled={allChecked}
                                  onChange={(e) => {
                                    let newPhases: string[];
                                    if (e.target.checked) {
                                      newPhases = [
                                        ...selectedPhases,
                                        phase.value,
                                      ];
                                    } else {
                                      newPhases = selectedPhases.filter(
                                        (p) => p !== phase.value,
                                      );
                                    }
                                    setPanelForm({
                                      ...panelForm,
                                      category:
                                        newPhases.length > 0
                                          ? newPhases.join(",")
                                          : "",
                                    });
                                  }}
                                />
                                <span
                                  style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    background: phase.color || "#94a3b8",
                                    flexShrink: 0,
                                  }}
                                />
                                {phase.label}
                              </label>
                            );
                          })}
                      </div>
                    );
                  })()}
                </div>
              )}
              {panelConfigKey === "acquisitionTypes" && config && (
                <>
                  {editItem && (
                    <div className={styles.fieldGroup}>
                      <label>Availability Status (Parent)</label>
                      <select
                        value={(panelForm.category || "").split("|")[0]}
                        onChange={(e) => {
                          const availVal = e.currentTarget.value;
                          setPanelForm({
                            ...panelForm,
                            category: availVal,
                          });
                        }}
                      >
                        <option value="">— Select —</option>
                        {(config.availabilityStatuses || [])
                          .filter((a) => a.isActive !== false)
                          .map((a) => (
                            <option key={a.id} value={a.value}>
                              {a.label}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                  {!editItem && panelForm.category && (
                    <div className={styles.fieldGroup}>
                      <label>Parent Availability</label>
                      <span
                        style={{
                          fontSize: 13,
                          color: "var(--text-primary)",
                          fontWeight: 600,
                        }}
                      >
                        {(config.availabilityStatuses || []).find(
                          (a) => a.value === panelForm.category,
                        )?.label || panelForm.category}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className={styles.panelFooter}>
              <button
                className={styles.actionBtn}
                onClick={() => setShowPanel(false)}
              >
                Cancel
              </button>
              <button
                className={`${styles.actionBtn} ${styles.primary}`}
                onClick={handlePanelSave}
              >
                {editItem ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SystemConfiguration;
