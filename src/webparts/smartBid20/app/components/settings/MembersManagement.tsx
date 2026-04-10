/**
 * MembersManagement Component — SMART BID 2.0
 * Manages team members with real SharePoint data and Graph API people picker.
 * Roles: Manager, Project, Operations, Equipment, Data Center, Engineering
 * Divisions: ROV, SURVEY, OPG, ENGINEERING, COMMERCIAL
 */

import * as React from "react";
import styles from "./MembersManagement.module.scss";
import {
  ITeamMember,
  IMembersData,
  MemberDivision,
  UserRole,
} from "../../models";
import { MembersService } from "../../services/MembersService";
import { useSpfxContext } from "../../config/SpfxContext";

/* ------------------------------------------------------------------ */
/* CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

interface IRoleMeta {
  key: UserRole;
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
    key: "project",
    label: "Project",
    plural: "Project",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    icon: "📋",
  },
  {
    key: "operations",
    label: "Operations",
    plural: "Operations",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    icon: "⚙️",
  },
  {
    key: "equipment",
    label: "Equipment",
    plural: "Equipment",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    icon: "🔧",
  },
  {
    key: "dataCenter",
    label: "Data Center",
    plural: "Data Center",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.12)",
    icon: "📡",
  },
  {
    key: "engineering",
    label: "Engineering",
    plural: "Engineering",
    color: "#ec4899",
    bg: "rgba(236,72,153,0.12)",
    icon: "🛠️",
  },
];

const DIVISIONS: MemberDivision[] = [
  "ROV",
  "SURVEY",
  "OPG",
  "ENGINEERING",
  "COMMERCIAL",
];

const DIVISION_COLORS: Record<MemberDivision, { color: string; bg: string }> = {
  ROV: { color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  SURVEY: { color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  OPG: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  ENGINEERING: { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  COMMERCIAL: { color: "#ec4899", bg: "rgba(236,72,153,0.12)" },
};

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
/* People Picker Search Result                                        */
/* ------------------------------------------------------------------ */

interface IPeopleResult {
  displayName: string;
  email: string;
  jobTitle: string;
  department: string;
  id: string;
}

/* ------------------------------------------------------------------ */
/* COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const MembersManagement: React.FC = () => {
  const spfxContext = useSpfxContext();

  const [membersData, setMembersData] = React.useState<IMembersData>({
    manager: [],
    project: [],
    operations: [],
    equipment: [],
    dataCenter: [],
    engineering: [],
  });
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [showPanel, setShowPanel] = React.useState(false);
  const [editMember, setEditMember] = React.useState<ITeamMember | null>(null);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [saving, setSaving] = React.useState(false);

  // Panel form state
  const [panelForm, setPanelForm] = React.useState({
    name: "",
    email: "",
    jobTitle: "",
    department: "",
    division: "ROV" as MemberDivision,
    role: "engineering" as UserRole,
  });

  // People picker state
  const [peopleQuery, setPeopleQuery] = React.useState("");
  const [peopleResults, setPeopleResults] = React.useState<IPeopleResult[]>([]);
  const [showPeopleDropdown, setShowPeopleDropdown] = React.useState(false);
  const [searchingPeople, setSearchingPeople] = React.useState(false);
  const peoplePickerRef = React.useRef<HTMLDivElement>(null);

  /* ---- helpers --------------------------------------------------- */

  const showMsg = (type: "success" | "error", text: string): void => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  /* ---- load members from SharePoint ----------------------------- */

  const loadMembers = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await MembersService.getAll();
      setMembersData(data);
    } catch (error) {
      console.error("Error loading members:", error);
      showMsg("error", "Failed to load team members");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadMembers().catch(console.error);
  }, [loadMembers]);

  const allMembers = React.useMemo(() => {
    const all: ITeamMember[] = [];
    for (const key of Object.keys(membersData) as (keyof IMembersData)[]) {
      all.push(...membersData[key]);
    }
    return all;
  }, [membersData]);

  const filteredMembers = React.useMemo(() => {
    let list = allMembers;
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
  }, [allMembers, search, roleFilter]);

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
      counts[r.key] = allMembers.filter((m) => m.role === r.key).length;
    });
    return counts;
  }, [allMembers]);

  /* ---- People Picker (Graph API) -------------------------------- */

  const searchPeople = React.useCallback(
    async (query: string) => {
      if (!query || query.length < 2) {
        setPeopleResults([]);
        setShowPeopleDropdown(false);
        return;
      }

      setSearchingPeople(true);
      try {
        const graphClient =
          await spfxContext.msGraphClientFactory.getClient("3");
        const response = await graphClient
          .api("/users")
          .filter(
            `startswith(displayName,'${query}') or startswith(mail,'${query}')`,
          )
          .select("id,displayName,mail,userPrincipalName,jobTitle,department")
          .top(8)
          .get();

        const results: IPeopleResult[] = (response.value || []).map(
          (u: {
            id: string;
            displayName: string;
            mail: string;
            userPrincipalName: string;
            jobTitle: string;
            department: string;
          }) => ({
            id: u.id,
            displayName: u.displayName || "",
            email: u.mail || u.userPrincipalName || "",
            jobTitle: u.jobTitle || "",
            department: u.department || "",
          }),
        );

        setPeopleResults(results);
        setShowPeopleDropdown(results.length > 0);
      } catch (error) {
        console.error("Error searching people:", error);
        setPeopleResults([]);
        setShowPeopleDropdown(false);
      } finally {
        setSearchingPeople(false);
      }
    },
    [spfxContext],
  );

  // Debounce people search
  const searchTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handlePeopleQueryChange = React.useCallback(
    (query: string) => {
      setPeopleQuery(query);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => searchPeople(query), 300);
    },
    [searchPeople],
  );

  const selectPerson = React.useCallback((person: IPeopleResult) => {
    setPanelForm((prev) => ({
      ...prev,
      name: person.displayName,
      email: person.email,
      jobTitle: person.jobTitle,
      department: person.department,
    }));
    setPeopleQuery(person.displayName);
    setShowPeopleDropdown(false);
    setPeopleResults([]);
  }, []);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (
        peoplePickerRef.current &&
        !peoplePickerRef.current.contains(e.target as Node)
      ) {
        setShowPeopleDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---- CRUD ------------------------------------------------------ */

  const openAddPanel = (): void => {
    setEditMember(null);
    setPanelForm({
      name: "",
      email: "",
      jobTitle: "",
      department: "",
      division: "ROV",
      role: "engineering",
    });
    setPeopleQuery("");
    setPeopleResults([]);
    setShowPeopleDropdown(false);
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
    setPeopleQuery(m.name);
    setShowPanel(true);
  };

  const handleSave = async (): Promise<void> => {
    if (!panelForm.name.trim() || !panelForm.email.trim()) {
      showMsg("error", "Name and email are required");
      return;
    }

    setSaving(true);
    try {
      if (editMember) {
        // Update existing member
        const updated: ITeamMember = {
          ...editMember,
          name: panelForm.name,
          email: panelForm.email,
          jobTitle: panelForm.jobTitle,
          department: panelForm.department,
          division: panelForm.division,
          role: panelForm.role,
        };

        // If role changed, we need to move member to new category
        if (editMember.role !== panelForm.role) {
          await MembersService.removeMember(editMember.id);
          await MembersService.addMember(
            updated,
            panelForm.role as keyof IMembersData,
          );
        } else {
          await MembersService.updateMember(updated);
        }
        showMsg("success", `${panelForm.name} updated`);
      } else {
        // Check for duplicate
        const emailLower = panelForm.email.toLowerCase();
        const isDuplicate = allMembers.some(
          (m) => m.email.toLowerCase() === emailLower,
        );
        if (isDuplicate) {
          showMsg("error", "This person is already a team member");
          setSaving(false);
          return;
        }

        const newMember: ITeamMember = {
          id: `mem-${Date.now()}`,
          name: panelForm.name,
          email: panelForm.email,
          jobTitle: panelForm.jobTitle,
          department: panelForm.department,
          division: panelForm.division,
          role: panelForm.role,
          isActive: true,
          joinedDate: new Date().toISOString().split("T")[0],
        };
        await MembersService.addMember(
          newMember,
          panelForm.role as keyof IMembersData,
        );
        showMsg("success", `${panelForm.name} added`);
      }
      setShowPanel(false);
      await loadMembers();
    } catch (error) {
      console.error("Error saving member:", error);
      showMsg("error", "Failed to save member");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member: ITeamMember): Promise<void> => {
    if (!confirm(`Remove ${member.name} from the team?`)) return;

    try {
      await MembersService.removeMember(member.id);
      showMsg("success", "Member removed");
      await loadMembers();
    } catch (error) {
      console.error("Error removing member:", error);
      showMsg("error", "Failed to remove member");
    }
  };

  const toggleActive = async (member: ITeamMember): Promise<void> => {
    try {
      await MembersService.updateMember({
        ...member,
        isActive: !member.isActive,
      });
      await loadMembers();
    } catch (error) {
      console.error("Error toggling member:", error);
      showMsg("error", "Failed to update member status");
    }
  };

  /* ---- render ---------------------------------------------------- */

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>Loading team members...</div>
      </div>
    );
  }

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
              {allMembers.length} team members across{" "}
              {Object.keys(roleCounts).filter((k) => roleCounts[k] > 0).length}{" "}
              roles
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
              {allMembers.filter((m) => m.isActive).length}
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
            {membersByRole[r.key].map((m) => {
              const divColor = DIVISION_COLORS[m.division] || {
                color: "#64748b",
                bg: "rgba(100,116,139,0.12)",
              };
              return (
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
                      <span
                        className={`${styles.tag} ${styles.divisionTag}`}
                        style={{
                          background: divColor.bg,
                          color: divColor.color,
                        }}
                      >
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
                      onClick={() => toggleActive(m)}
                    >
                      {m.isActive ? "⏸" : "▶"}
                    </button>
                    <button
                      className={`${styles.iconBtn} ${styles.danger}`}
                      title="Remove"
                      onClick={() => handleDelete(m)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filteredMembers.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <div className={styles.emptyText}>
            {allMembers.length === 0
              ? "No team members yet. Click '+ Add Member' to get started."
              : "No members found matching your search."}
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
            {/* People Picker — only for Add mode */}
            {!editMember && (
              <div className={styles.fieldGroup} ref={peoplePickerRef}>
                <label>Search Person</label>
                <div className={styles.peoplePickerWrapper}>
                  <input
                    value={peopleQuery}
                    onChange={(e) =>
                      handlePeopleQueryChange(e.currentTarget.value)
                    }
                    placeholder="Start typing a name or email..."
                    autoComplete="off"
                  />
                  {searchingPeople && (
                    <span className={styles.pickerSpinner}>Searching...</span>
                  )}
                  {showPeopleDropdown && peopleResults.length > 0 && (
                    <div className={styles.peopleDropdown}>
                      {peopleResults.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className={styles.peopleItem}
                          onClick={() => selectPerson(p)}
                        >
                          <div
                            className={styles.peopleItemAvatar}
                            style={{
                              background: getAvatarColor(p.displayName),
                            }}
                          >
                            {getInitials(p.displayName)}
                          </div>
                          <div className={styles.peopleItemInfo}>
                            <span className={styles.peopleItemName}>
                              {p.displayName}
                            </span>
                            <span className={styles.peopleItemDetail}>
                              {p.email}
                            </span>
                            {p.jobTitle && (
                              <span className={styles.peopleItemDetail}>
                                {p.jobTitle}
                                {p.department ? ` · ${p.department}` : ""}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label>Full Name</label>
              <input
                value={panelForm.name}
                onChange={(e) =>
                  setPanelForm({ ...panelForm, name: e.currentTarget.value })
                }
                placeholder="e.g. John Silva"
                readOnly={!editMember && !!panelForm.email}
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
                readOnly={!editMember && !!panelForm.email}
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
                placeholder="e.g. Engineering"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Division</label>
              <select
                value={panelForm.division}
                onChange={(e) =>
                  setPanelForm({
                    ...panelForm,
                    division: e.currentTarget.value as MemberDivision,
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
                  setPanelForm({
                    ...panelForm,
                    role: e.currentTarget.value as UserRole,
                  })
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
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className={`${styles.actionBtn} ${styles.primary}`}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : editMember ? "Update" : "Add Member"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersManagement;
