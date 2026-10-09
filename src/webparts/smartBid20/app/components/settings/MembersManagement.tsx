/**
 * MembersManagement Component — SMART BID 2.0
 * Manages team members with real SharePoint data and Graph API people picker.
 * Model: Sector + Business Lines[] + Bid Role
 */

import * as React from "react";
import {
  Briefcase,
  Building2,
  ClipboardList,
  Cog,
  DraftingCompass,
  HardHat,
  Layers,
  RefreshCw,
  Search,
  Server,
  Truck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import styles from "./MembersManagement.module.scss";
import {
  ITeamMember,
  IMembersData,
  Sector,
  BusinessLine,
  BidRole,
} from "../../models";
import { MembersService } from "../../services/MembersService";
import { useSpfxContext } from "../../config/SpfxContext";
import { usePageAccess } from "../../hooks/usePageAccess";
import { PageHeader } from "../common/PageHeader";
import { EmptyState } from "../common/EmptyState";
import { SkeletonLoader } from "../common/SkeletonLoader";
import {
  MultiSelectDropdown,
  MultiSelectOption,
} from "../insights/MultiSelectDropdown";
import { countFacets } from "../../utils/facetHelpers";
import { BID_ROLE_META } from "../../config/bidRoles.config";

/* ------------------------------------------------------------------ */
/* CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

interface ISectorMeta {
  key: Sector;
  label: string;
  color: string;
  icon: React.ReactNode;
}

const SECTOR_META: ISectorMeta[] = [
  {
    key: "commercial",
    label: "Commercial",
    color: "#3b82f6",
    icon: <Briefcase />,
  },
  {
    key: "engineering",
    label: "Engineering",
    color: "#ec4899",
    icon: <DraftingCompass />,
  },
  {
    key: "project",
    label: "Project",
    color: "#f59e0b",
    icon: <ClipboardList />,
  },
  {
    key: "operation",
    label: "Operation",
    color: "#10b981",
    icon: <Cog />,
  },
  {
    key: "dataCenter",
    label: "Data Center",
    color: "#06b6d4",
    icon: <Server />,
  },
  {
    key: "equipmentInstallation",
    label: "Equipment & Installation",
    color: "#8b5cf6",
    icon: <HardHat />,
  },
  {
    key: "supplyChain",
    label: "Supply Chain",
    color: "#f97316",
    icon: <Truck />,
  },
];

const sectorStyle = (color: string): React.CSSProperties =>
  ({ "--sector-color": color }) as React.CSSProperties;

const BUSINESS_LINES: BusinessLine[] = ["ROV", "OPG", "SURVEY"];

const BL_COLORS: Record<BusinessLine, { color: string; bg: string }> = {
  ROV: { color: "#0369a1", bg: "rgba(3,105,161,0.14)" },
  OPG: { color: "#b45309", bg: "rgba(180,83,9,0.14)" },
  SURVEY: { color: "#047857", bg: "rgba(4,120,87,0.14)" },
};

type MemberFacetKey = "sector" | "businessLine";

const MEMBER_FACET_VALUES: Record<
  MemberFacetKey,
  (m: ITeamMember) => string[]
> = {
  sector: (m) => [m.sector],
  businessLine: (m) => m.businessLines,
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
  photoUrl: string;
}

/* ------------------------------------------------------------------ */
/* COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const MembersManagement: React.FC = () => {
  const spfxContext = useSpfxContext();
  const { canEdit } = usePageAccess();

  const [membersData, setMembersData] = React.useState<IMembersData>({
    members: [],
  });
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [sectorFilter, setSectorFilter] = React.useState<string[]>([]);
  const [blFilter, setBlFilter] = React.useState<string[]>([]);
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
    sector: "engineering" as Sector,
    businessLines: [] as BusinessLine[],
    bidRole: "contributor" as BidRole,
    photoUrl: "",
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

  const allMembers = membersData.members || [];

  // `skip` lets a dropdown count against the other filters
  const passesFilters = React.useCallback(
    (m: ITeamMember, skip?: MemberFacetKey): boolean => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const hit =
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.jobTitle.toLowerCase().includes(q) ||
          m.sector.toLowerCase().includes(q) ||
          m.businessLines.some((bl) => bl.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return (
        (skip === "sector" ||
          sectorFilter.length === 0 ||
          sectorFilter.indexOf(m.sector) >= 0) &&
        (skip === "businessLine" ||
          blFilter.length === 0 ||
          m.businessLines.some((bl) => blFilter.indexOf(bl) >= 0))
      );
    },
    [search, sectorFilter, blFilter],
  );

  const filteredMembers = React.useMemo(
    () => allMembers.filter((m) => passesFilters(m)),
    [allMembers, passesFilters],
  );

  const facetCounts = React.useMemo(
    () => countFacets(allMembers, MEMBER_FACET_VALUES, passesFilters),
    [allMembers, passesFilters],
  );

  const membersBySector = React.useMemo(() => {
    const grouped: Record<string, ITeamMember[]> = {};
    SECTOR_META.forEach((s) => {
      grouped[s.key] = filteredMembers.filter((m) => m.sector === s.key);
    });
    return grouped;
  }, [filteredMembers]);

  const sectorCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    SECTOR_META.forEach((s) => {
      counts[s.key] = allMembers.filter((m) => m.sector === s.key).length;
    });
    return counts;
  }, [allMembers]);

  const sectorOptions: MultiSelectOption[] = SECTOR_META.map((s) => ({
    value: s.key,
    label: s.label,
    color: s.color,
    count: facetCounts.sector[s.key] || 0,
  }));

  const blOptions: MultiSelectOption[] = BUSINESS_LINES.map((bl) => ({
    value: bl,
    label: bl,
    color: BL_COLORS[bl].color,
    count: facetCounts.businessLine[bl] || 0,
  }));

  const activeCount = allMembers.filter((m) => m.isActive).length;
  const sectorsInUse = SECTOR_META.filter(
    (s) => sectorCounts[s.key] > 0,
  ).length;
  const hasFilters =
    !!search.trim() || sectorFilter.length > 0 || blFilter.length > 0;

  const clearFilters = (): void => {
    setSearch("");
    setSectorFilter([]);
    setBlFilter([]);
  };

  const toggleSector = (key: Sector): void =>
    setSectorFilter((prev) =>
      prev.indexOf(key) >= 0 ? prev.filter((k) => k !== key) : [...prev, key],
    );

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
            photoUrl: "",
          }),
        );

        setPeopleResults(results);
        setShowPeopleDropdown(results.length > 0);

        // Fetch photos in background for each result
        results.forEach((person, idx) => {
          graphClient
            .api(`/users/${person.id}/photo/$value`)
            .get()
            .then(async (photoBlob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64String = reader.result as string;
                const base64 = base64String.split(",")[1];
                const url = `data:image/jpeg;base64,${base64}`;
                setPeopleResults((prev) => {
                  const updated = [...prev];
                  if (updated[idx] && updated[idx].id === person.id) {
                    updated[idx] = { ...updated[idx], photoUrl: url };
                  }
                  return updated;
                });
              };
              reader.readAsDataURL(photoBlob);
            })
            .catch(() => {
              /* no photo available */
            });
        });
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

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64 = base64String.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const selectPerson = React.useCallback(
    async (person: IPeopleResult) => {
      setPanelForm((prev) => ({
        ...prev,
        name: person.displayName,
        email: person.email,
        jobTitle: person.jobTitle,
        department: person.department,
        photoUrl: person.photoUrl || "",
      }));
      setPeopleQuery(person.displayName);
      setShowPeopleDropdown(false);
      setPeopleResults([]);

      // If photo was not loaded in the dropdown, fetch it now
      if (!person.photoUrl) {
        try {
          const graphClient =
            await spfxContext.msGraphClientFactory.getClient("3");
          const photoBlob = await graphClient
            .api(`/users/${person.id}/photo/$value`)
            .get();
          if (photoBlob) {
            const base64Photo = await blobToBase64(photoBlob);
            const photoUrl = `data:image/jpeg;base64,${base64Photo}`;
            if (photoUrl.startsWith("data:image")) {
              setPanelForm((prev) => ({ ...prev, photoUrl }));
            }
          }
        } catch (photoError) {
          console.warn("Could not fetch user photo:", photoError);
        }
      }
    },
    [spfxContext],
  );

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
      sector: "engineering",
      businessLines: [],
      bidRole: "contributor",
      photoUrl: "",
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
      sector: m.sector,
      businessLines: m.businessLines || [],
      bidRole: m.bidRole,
      photoUrl: m.photoUrl || "",
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
        const updated: ITeamMember = {
          ...editMember,
          sector: panelForm.sector,
          businessLines: panelForm.businessLines,
          bidRole: panelForm.bidRole,
        };
        await MembersService.updateMember(updated);
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
          sector: panelForm.sector,
          businessLines: panelForm.businessLines,
          bidRole: panelForm.bidRole,
          isActive: true,
          joinedDate: new Date().toISOString().split("T")[0],
          photoUrl: panelForm.photoUrl || "",
        };
        await MembersService.addMember(newMember);
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

  const header = (
    <PageHeader
      title="Members Management"
      subtitle={
        loading
          ? "Loading team members..."
          : `${allMembers.length} team members across ${sectorsInUse} sectors, ${activeCount} active`
      }
      icon={<Users size={28} />}
      actions={
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.headerBtn}
            onClick={() => loadMembers().catch(console.error)}
            disabled={loading}
            title="Reload members from SharePoint"
          >
            <RefreshCw size={15} /> Refresh
          </button>
          {canEdit && (
            <button
              type="button"
              className={styles.createBtn}
              onClick={openAddPanel}
            >
              <UserPlus size={15} /> Add Member
            </button>
          )}
        </div>
      }
    />
  );

  if (loading) {
    return (
      <div className={styles.container}>
        {header}
        <SkeletonLoader height={72} borderRadius={12} count={4} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {header}

      {/* Message */}
      {message && (
        <div
          className={`${styles.messageBar} ${message.type === "success" ? styles.success : styles.error}`}
        >
          {message.text}
        </div>
      )}

      {/* Sector tiles (quick filter) */}
      <div className={styles.sectorRow}>
        {SECTOR_META.map((s) => {
          const selected = sectorFilter.indexOf(s.key) >= 0;
          return (
            <button
              key={s.key}
              type="button"
              className={`${styles.sectorTile} ${selected ? styles.sectorTileActive : ""}`}
              style={sectorStyle(s.color)}
              onClick={() => toggleSector(s.key)}
              aria-pressed={selected}
              title={
                selected ? `Remove ${s.label} filter` : `Filter by ${s.label}`
              }
            >
              <span className={styles.sectorIcon}>{s.icon}</span>
              <span className={styles.sectorInfo}>
                <span className={styles.sectorValue}>
                  {sectorCounts[s.key] || 0}
                </span>
                <span className={styles.sectorLabel}>{s.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterSearch}>
          <Search size={15} className={styles.filterSearchIcon} />
          <input
            type="text"
            className={styles.filterSearchInput}
            placeholder="Search by name, email, job title, sector or business line..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            aria-label="Search members"
          />
          {search && (
            <button
              type="button"
              className={styles.searchClearBtn}
              onClick={() => setSearch("")}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <MultiSelectDropdown
          label="Sector"
          icon={<Building2 />}
          options={sectorOptions}
          selected={sectorFilter}
          onChange={setSectorFilter}
        />
        <MultiSelectDropdown
          label="Business Line"
          icon={<Layers />}
          options={blOptions}
          selected={blFilter}
          onChange={setBlFilter}
        />
        {hasFilters && (
          <button
            type="button"
            className={styles.clearFiltersBtn}
            onClick={clearFilters}
          >
            <X size={14} /> Clear
          </button>
        )}
        <span className={styles.resultCount}>
          <strong>{filteredMembers.length}</strong>{" "}
          {hasFilters ? `of ${allMembers.length} ` : ""}
          {allMembers.length === 1 ? "member" : "members"}
        </span>
      </div>

      {/* Members grouped by sector */}
      {SECTOR_META.filter((s) => membersBySector[s.key]?.length > 0).map(
        (s) => (
          <div key={s.key} className={styles.roleSection}>
            <div className={styles.roleSectionHeader}>
              <span className={styles.roleBadge} style={sectorStyle(s.color)}>
                {s.icon} {s.label}
              </span>
              <span className={styles.roleCount}>
                {membersBySector[s.key].length} members
              </span>
            </div>
            <div className={styles.membersGrid}>
              {membersBySector[s.key].map((m) => {
                const bidRoleMeta = BID_ROLE_META.find(
                  (br) => br.key === m.bidRole,
                );
                return (
                  <div
                    key={m.id}
                    className={styles.memberCard}
                    style={{ opacity: m.isActive ? 1 : 0.5 }}
                  >
                    {m.photoUrl ? (
                      <img
                        className={styles.avatar}
                        src={m.photoUrl}
                        alt={m.name}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className={styles.avatar}
                        style={{ background: getAvatarColor(m.name) }}
                      >
                        {getInitials(m.name)}
                      </div>
                    )}
                    <div className={styles.memberInfo}>
                      <span className={styles.memberName}>{m.name}</span>
                      <span className={styles.memberEmail}>{m.email}</span>
                      <div className={styles.memberMeta}>
                        {/* Business Lines */}
                        {m.businessLines.map((bl) => {
                          const blColor = BL_COLORS[bl];
                          return (
                            <span
                              key={bl}
                              className={`${styles.tag} ${styles.divisionTag}`}
                              style={{
                                background: blColor.bg,
                                color: blColor.color,
                              }}
                            >
                              {bl}
                            </span>
                          );
                        })}
                        {/* Bid Role */}
                        {bidRoleMeta && (
                          <span
                            className={`${styles.tag} ${styles.roleTag}`}
                            style={{
                              background: bidRoleMeta.bg,
                              color: bidRoleMeta.color,
                            }}
                          >
                            {bidRoleMeta.label}
                          </span>
                        )}
                        {/* Job Title — plain text, no badge */}
                        {m.jobTitle && (
                          <span className={styles.memberJobTitle}>
                            {m.jobTitle}
                          </span>
                        )}
                      </div>
                    </div>
                    {canEdit && (
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
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ),
      )}

      {filteredMembers.length === 0 &&
        (allMembers.length === 0 ? (
          <EmptyState
            variant="glass"
            title="No team members yet"
            description="Add the first member to start building the team."
            actionLabel={canEdit ? "Add Member" : undefined}
            onAction={canEdit ? openAddPanel : undefined}
          />
        ) : (
          <EmptyState
            variant="glass"
            title="No members match these filters"
            description="Try fewer filters or another search term."
            actionLabel="Clear filters"
            onAction={clearFilters}
          />
        ))}

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
                          {p.photoUrl ? (
                            <img
                              className={styles.peopleItemAvatar}
                              src={p.photoUrl}
                              alt={p.displayName}
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              className={styles.peopleItemAvatar}
                              style={{
                                background: getAvatarColor(p.displayName),
                              }}
                            >
                              {getInitials(p.displayName)}
                            </div>
                          )}
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
                placeholder="Selected from Search Person"
                readOnly
                style={{ opacity: 0.7, cursor: "not-allowed" }}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Email</label>
              <input
                type="email"
                value={panelForm.email}
                placeholder="Selected from Search Person"
                readOnly
                style={{ opacity: 0.7, cursor: "not-allowed" }}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Job Title</label>
              <input
                value={panelForm.jobTitle}
                placeholder="Selected from Search Person"
                readOnly
                style={{ opacity: 0.7, cursor: "not-allowed" }}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Department</label>
              <input
                value={panelForm.department}
                placeholder="Selected from Search Person"
                readOnly
                style={{ opacity: 0.7, cursor: "not-allowed" }}
              />
            </div>
            {/* Sector */}
            <div className={styles.fieldGroup}>
              <label>Sector</label>
              <select
                value={panelForm.sector}
                onChange={(e) => {
                  const newSector = e.currentTarget.value as Sector;
                  setPanelForm({
                    ...panelForm,
                    sector: newSector,
                    bidRole:
                      panelForm.bidRole === "analyst" &&
                      newSector !== "engineering"
                        ? "contributor"
                        : panelForm.bidRole,
                  });
                }}
              >
                {SECTOR_META.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Business Lines — badge bucket */}
            <div className={styles.fieldGroup}>
              <label>Business Lines</label>
              <div className={styles.divisionBadgesSection}>
                {/* Assigned business lines */}
                {panelForm.businessLines.length > 0 && (
                  <div className={styles.assignedDivisionsArea}>
                    <span className={styles.divisionSectionLabel}>
                      Assigned Business Lines
                    </span>
                    <div className={styles.divisionBadgesRow}>
                      {panelForm.businessLines.map((bl) => {
                        const blColor = BL_COLORS[bl];
                        return (
                          <button
                            key={bl}
                            type="button"
                            className={styles.divisionBadgeClickable}
                            style={{
                              background: blColor.bg,
                              color: blColor.color,
                            }}
                            onClick={() =>
                              setPanelForm((prev) => ({
                                ...prev,
                                businessLines: prev.businessLines.filter(
                                  (b) => b !== bl,
                                ),
                              }))
                            }
                            title="Click to remove"
                          >
                            {bl} ✕
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Available business lines */}
                {BUSINESS_LINES.filter(
                  (bl) => !panelForm.businessLines.includes(bl),
                ).length > 0 && (
                  <div className={styles.availableDivisionsArea}>
                    <span className={styles.divisionSectionLabel}>
                      Available Business Lines
                    </span>
                    <div className={styles.divisionBadgesRow}>
                      {BUSINESS_LINES.filter(
                        (bl) => !panelForm.businessLines.includes(bl),
                      ).map((bl) => {
                        const blColor = BL_COLORS[bl];
                        return (
                          <button
                            key={bl}
                            type="button"
                            className={`${styles.divisionBadgeClickable} ${styles.divisionBadgeFaded}`}
                            style={{
                              background: blColor.bg,
                              color: blColor.color,
                            }}
                            onClick={() =>
                              setPanelForm((prev) => ({
                                ...prev,
                                businessLines: [...prev.businessLines, bl],
                              }))
                            }
                            title="Click to assign"
                          >
                            + {bl}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bid Role */}
            <div className={styles.fieldGroup}>
              <label>Bid Role</label>
              <select
                value={panelForm.bidRole}
                onChange={(e) =>
                  setPanelForm({
                    ...panelForm,
                    bidRole: e.currentTarget.value as BidRole,
                  })
                }
              >
                {BID_ROLE_META.filter(
                  (br) =>
                    br.key !== "analyst" || panelForm.sector === "engineering",
                ).map((br) => (
                  <option key={br.key} value={br.key}>
                    {br.label}
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
