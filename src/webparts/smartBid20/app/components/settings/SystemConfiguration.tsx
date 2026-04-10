/**
 * SystemConfiguration Component — SMART BID 2.0
 * Adapted from SmartFlow SystemConfiguration reference
 * Manages all system configuration: KPI targets, lists, access levels, etc.
 */

import * as React from "react";
import styles from "./SystemConfiguration.module.scss";
import { ISystemConfig, IConfigOption, IKPITargets } from "../../models";
import { MOCK_SYSTEM_CONFIG } from "../../data/mockSystemConfig";

/* ------------------------------------------------------------------ */
/* TAB DEFINITIONS                                                    */
/* ------------------------------------------------------------------ */

interface ITabDef {
  key: string;
  label: string;
  icon: string;
  configKey?: keyof ISystemConfig;
}

const TABS: ITabDef[] = [
  { key: "kpi", label: "KPI Targets", icon: "📊" },
  { key: "divisions", label: "Divisions", icon: "🏢", configKey: "divisions" },
  {
    key: "serviceLines",
    label: "Service Lines",
    icon: "🔧",
    configKey: "serviceLines",
  },
  { key: "bidTypes", label: "Bid Types", icon: "📋", configKey: "bidTypes" },
  {
    key: "bidStatuses",
    label: "Statuses",
    icon: "🏷️",
    configKey: "bidStatuses",
  },
  { key: "phases", label: "Phases", icon: "📐", configKey: "phases" },
  { key: "regions", label: "Regions", icon: "🌎", configKey: "regions" },
  { key: "clientList", label: "Clients", icon: "🤝", configKey: "clientList" },
  {
    key: "hoursPhases",
    label: "Hours Phases",
    icon: "⏱️",
    configKey: "hoursPhases",
  },
  {
    key: "equipmentCategories",
    label: "Equipment",
    icon: "⚙️",
    configKey: "equipmentCategories",
  },
  {
    key: "costReferences",
    label: "Cost Refs",
    icon: "💰",
    configKey: "costReferences",
  },
  {
    key: "jobFunctions",
    label: "Job Functions",
    icon: "👷",
    configKey: "jobFunctions",
  },
  {
    key: "acquisitionTypes",
    label: "Acquisition",
    icon: "📥",
    configKey: "acquisitionTypes",
  },
  {
    key: "deliverableTypes",
    label: "Deliverables",
    icon: "📦",
    configKey: "deliverableTypes",
  },
  {
    key: "bidResultOptions",
    label: "Results",
    icon: "🏆",
    configKey: "bidResultOptions",
  },
  {
    key: "lossReasons",
    label: "Loss Reasons",
    icon: "❌",
    configKey: "lossReasons",
  },
  { key: "currency", label: "Currency", icon: "💱" },
  { key: "access", label: "Access Levels", icon: "🔐" },
  { key: "notifications", label: "Notifications", icon: "🔔" },
  { key: "approvalRules", label: "Approval Rules", icon: "✅" },
];

/* ------------------------------------------------------------------ */
/* KPI LABEL HELPERS                                                  */
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

const ROLES = [
  "manager",
  "project",
  "operations",
  "equipment",
  "dataCenter",
  "engineering",
  "guest",
] as const;

const ACCESS_AREAS: Array<{ key: string; label: string }> = [
  { key: "workspace", label: "Workspace" },
  { key: "insights", label: "Insights" },
  { key: "reports", label: "Reports" },
  { key: "settings", label: "Settings" },
  { key: "approvals", label: "Approvals" },
  { key: "templates", label: "Templates" },
];

/* ------------------------------------------------------------------ */
/* COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const SystemConfiguration: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>("kpi");
  const [config, setConfig] = React.useState<ISystemConfig>(MOCK_SYSTEM_CONFIG);
  const [showPanel, setShowPanel] = React.useState(false);
  const [editItem, setEditItem] = React.useState<IConfigOption | null>(null);
  const [panelForm, setPanelForm] = React.useState({
    label: "",
    value: "",
    color: "#3b82f6",
  });
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const currentTabDef = TABS.find((t) => t.key === activeTab);

  /* ---- helpers --------------------------------------------------- */

  const showMessage = (type: "success" | "error", text: string): void => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleOptionToggle = (
    configKey: keyof ISystemConfig,
    optionId: string,
  ): void => {
    const list = config[configKey] as IConfigOption[];
    const updated = list.map((o) =>
      o.id === optionId ? { ...o, isActive: !o.isActive } : o,
    );
    setConfig({ ...config, [configKey]: updated });
    showMessage("success", "Option updated");
  };

  const handleDeleteOption = (
    configKey: keyof ISystemConfig,
    optionId: string,
  ): void => {
    const list = config[configKey] as IConfigOption[];
    setConfig({
      ...config,
      [configKey]: list.filter((o) => o.id !== optionId),
    });
    showMessage("success", "Option removed");
  };

  const openAddPanel = (): void => {
    setEditItem(null);
    setPanelForm({ label: "", value: "", color: "#3b82f6" });
    setShowPanel(true);
  };

  const openEditPanel = (item: IConfigOption): void => {
    setEditItem(item);
    setPanelForm({
      label: item.label,
      value: item.value,
      color: item.color || "#3b82f6",
    });
    setShowPanel(true);
  };

  const handlePanelSave = (): void => {
    if (!currentTabDef?.configKey || !panelForm.label.trim()) return;
    const key: keyof ISystemConfig = currentTabDef.configKey;
    const list = config[key] as IConfigOption[];

    if (editItem) {
      const updated = list.map((o) =>
        o.id === editItem.id
          ? {
              ...o,
              label: panelForm.label,
              value: panelForm.value || panelForm.label,
              color: panelForm.color,
            }
          : o,
      );
      setConfig({ ...config, [key]: updated });
      showMessage("success", `"${panelForm.label}" updated`);
    } else {
      const newItem: IConfigOption = {
        id: `${key}-${Date.now()}`,
        label: panelForm.label,
        value: panelForm.value || panelForm.label,
        isActive: true,
        order: list.length + 1,
        color: panelForm.color,
      };
      setConfig({ ...config, [key]: [...list, newItem] });
      showMessage("success", `"${panelForm.label}" added`);
    }
    setShowPanel(false);
  };

  const handleKPIChange = (
    kpiKey: keyof IKPITargets,
    valueStr: string,
  ): void => {
    const num = Number(valueStr);
    if (isNaN(num)) return;
    setConfig({
      ...config,
      kpiTargets: { ...config.kpiTargets, [kpiKey]: num },
    });
  };

  /* ---- render helpers -------------------------------------------- */

  const renderOptionsList = (
    configKey: keyof ISystemConfig,
  ): React.ReactElement => {
    const list = config[configKey] as IConfigOption[];
    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>{currentTabDef?.label}</h3>
          <p>
            Manage the list of {currentTabDef?.label?.toLowerCase()}. Toggle to
            activate/deactivate.
          </p>
        </div>
        <div className={styles.addBtnRow}>
          <button
            className={`${styles.actionBtn} ${styles.primary}`}
            onClick={openAddPanel}
          >
            + Add {currentTabDef?.label?.replace(/s$/, "")}
          </button>
        </div>
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
                {opt.value !== opt.label && (
                  <span className={styles.optionValue}>{opt.value}</span>
                )}
                {!opt.isActive && (
                  <span className={styles.inactiveTag}>Inactive</span>
                )}
              </div>
              <div className={styles.optionActions}>
                <button
                  className={styles.actionBtn}
                  onClick={() => openEditPanel(opt)}
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
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderKPITargets = (): React.ReactElement => {
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
                />
                <span className={styles.kpiUnit}>{KPI_META[k].unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCurrencySettings = (): React.ReactElement => {
    const cs = config.currencySettings;
    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>Currency Settings</h3>
          <p>
            Manage default currency and PTAX exchange rate used across BID cost
            calculations.
          </p>
        </div>
        <div className={styles.currencyRow}>
          {[
            { label: "Default Currency", value: cs.defaultCurrency },
            { label: "PTAX Rate (BRL/USD)", value: String(cs.ptax) },
            { label: "Last PTAX Update", value: cs.ptaxLastUpdate },
            { label: "Update Frequency", value: cs.ptaxUpdateFrequency },
          ].map((item) => (
            <div key={item.label} className={styles.kpiCard}>
              <div className={styles.kpiLabel}>{item.label}</div>
              <input className={styles.kpiInput} value={item.value} readOnly />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAccessLevels = (): React.ReactElement => {
    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>Access Levels</h3>
          <p>Define what each role can access. Values: Edit, View, or None.</p>
        </div>
        <div className={styles.accessGrid}>
          <div className={styles.accessGridHeader}>
            <div>Area</div>
            {ROLES.map((r) => (
              <div key={r}>{r}</div>
            ))}
          </div>
          {ACCESS_AREAS.map((area) => (
            <div key={area.key} className={styles.accessGridRow}>
              <div>{area.label}</div>
              {ROLES.map((role) => {
                const perm =
                  config.accessLevels[role]?.[
                    area.key as keyof typeof config.accessLevels.manager
                  ];
                return (
                  <div key={role}>
                    <span
                      className={`${styles.accessBadge} ${perm === "edit" ? styles.edit : perm === "view" ? styles.view : styles.none}`}
                    >
                      {perm || "none"}
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

  const renderNotifications = (): React.ReactElement => {
    const notifs = config.notifications;
    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>Notification Rules</h3>
          <p>Which roles receive notifications for each event type.</p>
        </div>
        <div className={styles.notificationsGrid}>
          {Object.keys(notifs).map((event: string) => (
            <div key={event} className={styles.notificationRow}>
              <span className={styles.notifLabel}>
                {event.replace(/_/g, " ")}
              </span>
              <div className={styles.notifRoles}>
                {(notifs as Record<string, string[]>)[event].map(
                  (role: string) => (
                    <span key={role} className={styles.rolePill}>
                      {role}
                    </span>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderApprovalRules = (): React.ReactElement => {
    const ar = config.approvalRules;
    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>Approval Rules</h3>
          <p>
            Configure the BID approval workflow, escalation, and thresholds.
          </p>
        </div>
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiLabel}>Reminder Interval</div>
            <div className={styles.kpiInputRow}>
              <input
                className={styles.kpiInput}
                value={ar.reminderIntervalHours}
                readOnly
              />
              <span className={styles.kpiUnit}>hours</span>
            </div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiLabel}>Max Reminders</div>
            <input
              className={styles.kpiInput}
              value={ar.maxReminders}
              readOnly
            />
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiLabel}>Auto-Escalate After</div>
            <div className={styles.kpiInputRow}>
              <input
                className={styles.kpiInput}
                value={ar.autoEscalateAfterHours}
                readOnly
              />
              <span className={styles.kpiUnit}>hours</span>
            </div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiLabel}>High-Value Threshold</div>
            <div className={styles.kpiInputRow}>
              <input
                className={styles.kpiInput}
                value={ar.thresholds.highValueThreshold.toLocaleString()}
                readOnly
              />
              <span className={styles.kpiUnit}>USD</span>
            </div>
          </div>
        </div>

        <div className={styles.approversSection}>
          <div className={styles.sectionHeader}>
            <h3>Default Approvers</h3>
          </div>
          <div className={styles.optionsList}>
            {ar.defaultApprovers.map((a, i) => (
              <div key={i} className={styles.optionCard}>
                <div className={styles.optionInfo}>
                  <span className={styles.optionLabel}>{a.role}</span>
                  <span className={styles.optionValue}>
                    Order: {a.order} · {a.required ? "Required" : "Optional"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ---- main render ----------------------------------------------- */

  const renderTabContent = (): React.ReactElement | null => {
    if (activeTab === "kpi") return renderKPITargets();
    if (activeTab === "currency") return renderCurrencySettings();
    if (activeTab === "access") return renderAccessLevels();
    if (activeTab === "notifications") return renderNotifications();
    if (activeTab === "approvalRules") return renderApprovalRules();

    if (currentTabDef?.configKey) {
      return renderOptionsList(currentTabDef.configKey);
    }

    return null;
  };

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
              Manage BID system settings, KPIs, access levels, and approval
              workflows
            </p>
          </div>
        </div>
      </div>

      {/* Message bar */}
      {message && (
        <div
          className={`${styles.messageBar} ${message.type === "success" ? styles.success : styles.error}`}
        >
          {message.text}
        </div>
      )}

      {/* Tab strip */}
      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`${styles.tab} ${activeTab === t.key ? styles.active : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab body */}
      <div className={styles.tabContent}>{renderTabContent()}</div>

      {/* Edit/Add slide-over panel */}
      {showPanel && (
        <div className={styles.panelOverlay}>
          <div className={styles.panelHeader}>
            <h3>{editItem ? "Edit Option" : "Add Option"}</h3>
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
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Value</label>
              <input
                value={panelForm.value}
                onChange={(e) =>
                  setPanelForm({ ...panelForm, value: e.currentTarget.value })
                }
                placeholder="Internal value (optional)"
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
      )}
    </div>
  );
};

export default SystemConfiguration;
