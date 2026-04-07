/**
 * MembersManagement Component — SMART BID 2.0
 * Adapted from SmartFlow MembersManagement reference
 * Displays team members by role with search, filter, add/edit capabilities.
 */

import * as React from "react";
import styles from "./MembersManagement.module.scss";
import { ITeamMember } from "../../models";
import { MOCK_MEMBERS_FLAT } from "../../data/mockMembers";

/* ------------------------------------------------------------------ */
/* CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

interface IRoleMeta {
  key: string;
  label: string;
  plural: string;
  color: string;
  bg: string;
  icon: string;
}

const ROLE_META: IRoleMeta[] = [
  {
    key: "manager",
    label: "Manager",
    plural: "Managers",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    icon: "👔",
  },
  {
    key: "engineer",
    label: "Engineer",
    plural: "Engineers",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    icon: "🔧",
  },
  {
    key: "bidder",
    label: "Bidder",
    plural: "Bidders",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    icon: "📋",
  },
  {
    key: "projectTeam",
    label: "Project Team",
    plural: "Project Team",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    icon: "👷",
  },
  {
    key: "viewer",
    label: "Viewer",
    plural: "Viewers",
    color: "#64748b",
    bg: "rgba(100,116,139,0.12)",
    icon: "👁️",
  },
];

const DIVISIONS = ["SSR-ROV", "SSR-Survey", "SSR-Integrated", "OPG"];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

/* ------------------------------------------------------------------ */
/* COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const MembersManagement: React.FC = () => {
  const [members, setMembers] =
    React.useState<ITeamMember[]>(MOCK_MEMBERS_FLAT);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [showPanel, setShowPanel] = React.useState(false);
  const [editMember, setEditMember] = React.useState<ITeamMember | null>(null);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [panelForm, setPanelForm] = React.useState({
    name: "",
    email: "",
    jobTitle: "",
    department: "Engineering",
    division: DIVISIONS[0],
    role: "engineer" as string,
  });

  /* ---- helpers --------------------------------------------------- */

  const showMessage = (type: "success" | "error", text: string): void => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredMembers = React.useMemo(() => {
    let list = members;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.jobTitle.toLowerCase().includes(q) ||
          m.division.toLowerCase().includes(q),
      );
    }
    if (roleFilter !== "all") {
      list = list.filter((m) => m.role === roleFilter);
    }
    return list;
  }, [members, search, roleFilter]);

  const membersByRole = React.useMemo(() => {
    const grouped: Record<string, ITeamMember[]> = {};
    ROLE_META.forEach((r) => {
      grouped[r.key] = filteredMembers.filter((m) => m.role === r.key);
    });
    return grouped;
  }, [filteredMembers]);

  const roleCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    ROLE_META.forEach((r) => {
      counts[r.key] = members.filter((m) => m.role === r.key).length;
    });
    return counts;
  }, [members]);

  /* ---- CRUD ------------------------------------------------------ */

  const openAddPanel = (): void => {
    setEditMember(null);
    setPanelForm({
      name: "",
      email: "",
      jobTitle: "",
      department: "Engineering",
      division: DIVISIONS[0],
      role: "engineer",
    });
    setShowPanel(true);
  };

  const openEditPanel = (m: ITeamMember): void => {
    setEditMember(m);
    setPanelForm({
      name: m.name,
      email: m.email,
      jobTitle: m.jobTitle,
      department: m.department,
      division: m.division,
      role: m.role,
    });
    setShowPanel(true);
  };

  const handleSave = (): void => {
    if (!panelForm.name.trim() || !panelForm.email.trim()) return;

    if (editMember) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editMember.id
            ? {
                ...m,
                name: panelForm.name,
                email: panelForm.email,
                jobTitle: panelForm.jobTitle,
                department: panelForm.department,
                division: panelForm.division,
                role: panelForm.role as ITeamMember["role"],
              }
            : m,
        ),
      );
      showMessage("success", `${panelForm.name} updated`);
    } else {
      const newMember: ITeamMember = {
        id: `mem-${Date.now()}`,
        name: panelForm.name,
        email: panelForm.email,
        jobTitle: panelForm.jobTitle,
        department: panelForm.department,
        division: panelForm.division,
        role: panelForm.role as ITeamMember["role"],
        isActive: true,
        joinedDate: new Date().toISOString().split("T")[0],
      };
      setMembers((prev) => [...prev, newMember]);
      showMessage("success", `${panelForm.name} added`);
    }
    setShowPanel(false);
  };

  const handleDelete = (id: string): void => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showMessage("success", "Member removed");
  };

  const toggleActive = (id: string): void => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m)),
    );
  };

  /* ---- render ---------------------------------------------------- */

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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
          <div className={styles.headerText}>
            <h2 className={styles.title}>Members Management</h2>
            <p className={styles.subtitle}>
              {members.length} team members across{" "}
              {Object.keys(roleCounts).length} roles
            </p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`${styles.messageBar} ${message.type === "success" ? styles.success : styles.error}`}
        >
          {message.text}
        </div>
      )}

      {/* Stat Cards */}
      <div className={styles.statRow}>
        {ROLE_META.map((r) => (
          <div key={r.key} className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ background: r.bg, color: r.color }}
            >
              {r.icon}
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{roleCounts[r.key] || 0}</span>
              <span className={styles.statLabel}>{r.plural}</span>
            </div>
          </div>
        ))}
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{
              background: "rgba(0,201,167,0.12)",
              color: "var(--primary-accent)",
            }}
          >
            ✓
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {members.filter((m) => m.isActive).length}
            </span>
            <span className={styles.statLabel}>Active</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="Search members by name, email, title, or division..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <button
          className={`${styles.filterBtn} ${roleFilter === "all" ? styles.active : ""}`}
          onClick={() => setRoleFilter("all")}
        >
          All
        </button>
        {ROLE_META.map((r) => (
          <button
            key={r.key}
            className={`${styles.filterBtn} ${roleFilter === r.key ? styles.active : ""}`}
            onClick={() => setRoleFilter(r.key)}
          >
            {r.plural}
          </button>
        ))}
        <button className={styles.addBtn} onClick={openAddPanel}>
          + Add Member
        </button>
      </div>

      {/* Members grouped by role */}
      {ROLE_META.filter((r) => membersByRole[r.key]?.length > 0).map((r) => (
        <div key={r.key} className={styles.roleSection}>
          <div className={styles.roleSectionHeader}>
            <span
              className={styles.roleBadge}
              style={{ background: r.bg, color: r.color }}
            >
              {r.icon} {r.plural}
            </span>
            <span className={styles.roleCount}>
              {membersByRole[r.key].length} members
            </span>
          </div>
          <div className={styles.membersGrid}>
            {membersByRole[r.key].map((m) => (
              <div
                key={m.id}
                className={styles.memberCard}
                style={{ opacity: m.isActive ? 1 : 0.5 }}
              >
                <div
                  className={styles.avatar}
                  style={{ background: getAvatarColor(m.name) }}
                >
                  {getInitials(m.name)}
                </div>
                <div className={styles.memberInfo}>
                  <span className={styles.memberName}>{m.name}</span>
                  <span className={styles.memberEmail}>{m.email}</span>
                  <div className={styles.memberMeta}>
                    <span className={`${styles.tag} ${styles.divisionTag}`}>
                      {m.division}
                    </span>
                    <span className={`${styles.tag} ${styles.roleTag}`}>
                      {m.jobTitle}
                    </span>
                  </div>
                </div>
                <div className={styles.memberActions}>
                  <button
                    className={styles.iconBtn}
                    title="Edit"
                    onClick={() => openEditPanel(m)}
                  >
                    ✎
                  </button>
                  <button
                    className={styles.iconBtn}
                    title={m.isActive ? "Deactivate" : "Activate"}
                    onClick={() => toggleActive(m.id)}
                  >
                    {m.isActive ? "⏸" : "▶"}
                  </button>
                  <button
                    className={`${styles.iconBtn} ${styles.danger}`}
                    title="Remove"
                    onClick={() => handleDelete(m.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredMembers.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <div className={styles.emptyText}>
            No members found matching your search.
          </div>
        </div>
      )}

      {/* Add/Edit Panel */}
      {showPanel && (
        <div className={styles.panelOverlay}>
          <div className={styles.panelHeader}>
            <h3>{editMember ? "Edit Member" : "Add Member"}</h3>
            <button
              className={styles.actionBtn}
              onClick={() => setShowPanel(false)}
            >
              ✕
            </button>
          </div>
          <div className={styles.panelBody}>
            <div className={styles.fieldGroup}>
              <label>Full Name</label>
              <input
                value={panelForm.name}
                onChange={(e) =>
                  setPanelForm({ ...panelForm, name: e.currentTarget.value })
                }
                placeholder="e.g. John Silva"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Email</label>
              <input
                type="email"
                value={panelForm.email}
                onChange={(e) =>
                  setPanelForm({ ...panelForm, email: e.currentTarget.value })
                }
                placeholder="jsilva@oceaneering.com"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Job Title</label>
              <input
                value={panelForm.jobTitle}
                onChange={(e) =>
                  setPanelForm({
                    ...panelForm,
                    jobTitle: e.currentTarget.value,
                  })
                }
                placeholder="e.g. Senior Engineer"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Department</label>
              <input
                value={panelForm.department}
                onChange={(e) =>
                  setPanelForm({
                    ...panelForm,
                    department: e.currentTarget.value,
                  })
                }
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Division</label>
              <select
                value={panelForm.division}
                onChange={(e) =>
                  setPanelForm({
                    ...panelForm,
                    division: e.currentTarget.value,
                  })
                }
              >
                {DIVISIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label>Role</label>
              <select
                value={panelForm.role}
                onChange={(e) =>
                  setPanelForm({ ...panelForm, role: e.currentTarget.value })
                }
              >
                {ROLE_META.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))}
              </select>
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
              onClick={handleSave}
            >
              {editMember ? "Update" : "Add Member"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersManagement;
