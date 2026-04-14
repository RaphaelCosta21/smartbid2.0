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
      { key: "phases", label: "Phases", icon: "📐", configKey: "phases" },
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
        key: "acquisitionTypes",
        label: "Acquisition",
        icon: "📥",
        configKey: "acquisitionTypes",
      },
      {
        key: "costReferences",
        label: "Cost References",
        icon: "💰",
        configKey: "costReferences",
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
        setConfig(updatedConfig);
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
    const list = config[configKey] as IConfigOption[];
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
    const list = config[configKey] as IConfigOption[];
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
    if (!config || !panelConfigKey || !panelForm.label.trim()) return;
    const key = panelConfigKey;
    const list = config[key] as IConfigOption[];

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
        return newRate !== null && newRate !== undefined
          ? { ...er, rate: Math.round(newRate * 100) / 100, lastUpdate: now }
          : er;
      });
      updateConfig({
        currencySettings: { ...cs, exchangeRates: updatedRates },
      });
      showMsg(
        "success",
        `Rates updated from Open Exchange Rates API (${codes.join(", ")})`,
      );
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
    const list = config[configKey] as IConfigOption[];
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
      const code = prompt("Currency code (e.g. GBP, EUR):");
      if (!code) return;
      const rateStr = prompt(
        `Exchange rate (1 ${cs.defaultCurrency} = ? ${code.toUpperCase()}):`,
      );
      if (!rateStr) return;
      const rate = Number(rateStr);
      if (isNaN(rate)) return;
      const newEntry: IExchangeRate = {
        currency: code.toUpperCase(),
        rate,
        lastUpdate: new Date().toISOString(),
      };
      updateConfig({
        currencySettings: {
          ...cs,
          exchangeRates: [...cs.exchangeRates, newEntry],
        },
      });
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
            >
              + Add Currency
            </button>
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
              <div className={styles.fieldGroup}>
                <label>Label</label>
                <input
                  value={panelForm.label}
                  onChange={(e) =>
                    setPanelForm({ ...panelForm, label: e.currentTarget.value })
                  }
                  placeholder="Display label"
                  autoFocus
                />
              </div>
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
