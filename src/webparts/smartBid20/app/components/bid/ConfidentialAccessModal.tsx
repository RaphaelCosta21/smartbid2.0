import * as React from "react";
import { Info, Lock, LockOpen, Search, Users, X } from "lucide-react";
import { IBid, IPersonRef, ITeamMember } from "../../models";
import { SECTORS, getSectorColor } from "../../config/sectors.config";
import {
  KeyPeopleRole,
  getBidKeyPeople,
  getConfidentialManagers,
  isBidConfidential,
  uniquePeople,
} from "../../utils/bidConfidentiality";
import { PersonaCard } from "../common/PersonaCard";
import { ConfirmDialog } from "../common/ConfirmDialog";
import styles from "./ConfidentialAccessModal.module.scss";

interface ConfidentialAccessModalProps {
  bid: IBid;
  teamMembers: ITeamMember[];
  currentUserEmail: string;
  saving?: boolean;
  onSave: (people: IPersonRef[]) => void;
  onDisable: () => void;
  onClose: () => void;
}

interface IAccessRow {
  person: IPersonRef;
  subtitle: string;
  keyRoles: KeyPeopleRole[];
}

interface IAccessGroup {
  key: string;
  label: string;
  icon: string;
  color: string;
  rows: IAccessRow[];
}

const ROLE_TAGS: Record<KeyPeopleRole, string> = {
  "BID Responsible": "BID Responsible",
  Analyst: "Analyst",
  "Project Manager": "PM",
  "Commercial Requester": "Requester",
  Creator: "Creator",
};

const keyOf = (email: string): string => (email || "").trim().toLowerCase();

const toPersonRef = (p: IPersonRef): IPersonRef => ({
  name: p.name,
  email: p.email,
  ...(p.role ? { role: p.role } : {}),
  ...(p.photoUrl ? { photoUrl: p.photoUrl } : {}),
});

const toSelection = (people: IPersonRef[]): Record<string, IPersonRef> => {
  const map: Record<string, IPersonRef> = {};
  people.forEach((p) => {
    if (keyOf(p.email)) map[keyOf(p.email)] = p;
  });
  return map;
};

export const ConfidentialAccessModal: React.FC<
  ConfidentialAccessModalProps
> = ({
  bid,
  teamMembers,
  currentUserEmail,
  saving,
  onSave,
  onDisable,
  onClose,
}) => {
  const isEnabled = isBidConfidential(bid);
  const managers = React.useMemo(() => getConfidentialManagers(bid), [bid]);
  const keyPeople = React.useMemo(() => getBidKeyPeople(bid), [bid]);

  const initialPeople = React.useMemo(
    () =>
      uniquePeople([
        ...managers,
        ...(isEnabled ? bid.confidentiality?.allowedPeople || [] : keyPeople),
      ]),
    // Snapshot when the modal opens; later BID refreshes must not reset choices.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [selected, setSelected] = React.useState<Record<string, IPersonRef>>(
    () => toSelection(initialPeople),
  );
  const [search, setSearch] = React.useState("");
  const [confirmDisable, setConfirmDisable] = React.useState(false);

  const lockedKeys = React.useMemo(() => {
    const map: Record<string, boolean> = {};
    managers.forEach((p) => {
      map[keyOf(p.email)] = true;
    });
    return map;
  }, [managers]);

  const keyRolesByEmail = React.useMemo(() => {
    const map: Record<string, KeyPeopleRole[]> = {};
    keyPeople.forEach((p) => {
      map[keyOf(p.email)] = p.keyRoles;
    });
    return map;
  }, [keyPeople]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && !confirmDisable && !saving) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmDisable, saving, onClose]);

  const groups = React.useMemo<IAccessGroup[]>(() => {
    const memberKeys: Record<string, boolean> = {};
    const out: IAccessGroup[] = SECTORS.map((s) => ({
      key: s.value,
      label: s.label,
      icon: s.icon,
      color: getSectorColor(s.value),
      rows: [],
    }));
    const bySector: Record<string, IAccessGroup> = {};
    out.forEach((g) => {
      bySector[g.key] = g;
    });
    const other: IAccessGroup = {
      key: "other",
      label: "Other",
      icon: "👤",
      color: getSectorColor("other"),
      rows: [],
    };

    teamMembers.forEach((m) => {
      const k = keyOf(m.email);
      if (!k || memberKeys[k]) return;
      // Inactive members only appear if they already have access.
      if (!m.isActive && !initialPeople.some((p) => keyOf(p.email) === k)) {
        return;
      }
      memberKeys[k] = true;
      (bySector[m.sector] || other).rows.push({
        person: {
          name: m.name,
          email: m.email,
          role: m.jobTitle,
          photoUrl: m.photoUrl,
        },
        subtitle: m.jobTitle || m.email || "",
        keyRoles: keyRolesByEmail[k] || [],
      });
    });

    uniquePeople([...keyPeople, ...initialPeople]).forEach((p) => {
      const k = keyOf(p.email);
      if (memberKeys[k]) return;
      memberKeys[k] = true;
      other.rows.push({
        person: p,
        subtitle: p.email || "",
        keyRoles: keyRolesByEmail[k] || [],
      });
    });

    const byName = (a: IAccessRow, b: IAccessRow): number =>
      (a.person.name || "").localeCompare(b.person.name || "");
    return [...out, other]
      .map((g) => ({ ...g, rows: g.rows.sort(byName) }))
      .filter((g) => g.rows.length > 0);
  }, [teamMembers, keyPeople, initialPeople, keyRolesByEmail]);

  const query = search.trim().toLowerCase();
  const visibleGroups = React.useMemo(() => {
    if (!query) return groups;
    return groups
      .map((g) => ({
        ...g,
        rows: g.rows.filter(
          (r) =>
            (r.person.name || "").toLowerCase().indexOf(query) >= 0 ||
            (r.person.email || "").toLowerCase().indexOf(query) >= 0 ||
            r.subtitle.toLowerCase().indexOf(query) >= 0,
        ),
      }))
      .filter((g) => g.rows.length > 0);
  }, [groups, query]);

  const selectedPeople = React.useMemo(
    () => Object.keys(selected).map((k) => selected[k]),
    [selected],
  );

  const isDirty = React.useMemo(() => {
    if (!isEnabled) return true;
    const initial = toSelection(initialPeople);
    const keys = Object.keys(selected);
    return (
      keys.length !== Object.keys(initial).length ||
      keys.some((k) => !initial[k])
    );
  }, [isEnabled, initialPeople, selected]);

  const toggle = (person: IPersonRef): void => {
    const k = keyOf(person.email);
    if (lockedKeys[k]) return;
    setSelected((prev) => {
      const next = { ...prev };
      if (next[k]) delete next[k];
      else next[k] = person;
      return next;
    });
  };

  const setGroup = (group: IAccessGroup, checked: boolean): void => {
    setSelected((prev) => {
      const next = { ...prev };
      group.rows.forEach((r) => {
        const k = keyOf(r.person.email);
        if (lockedKeys[k]) return;
        if (checked) next[k] = r.person;
        else delete next[k];
      });
      return next;
    });
  };

  const resetToKeyPeople = (): void => {
    setSelected(toSelection(uniquePeople([...managers, ...keyPeople])));
  };

  const meKey = keyOf(currentUserEmail);
  const count = selectedPeople.length;

  return (
    <div className={styles.overlay} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confidential-access-title"
      >
        <div className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.headerIcon}>
              <Lock size={20} />
            </span>
            <div className={styles.headerText}>
              <div className={styles.titleRow}>
                <h3 id="confidential-access-title" className={styles.title}>
                  {isEnabled ? "Confidential access" : "Make BID confidential"}
                </h3>
                <span className={styles.badge}>{bid.bidNumber}</span>
              </div>
              <p className={styles.subtitle}>
                Only the people selected below will be able to open this BID.
                Everyone else will see it with a lock in the lists.
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.notice}>
            <Info size={16} className={styles.noticeIcon} />
            <span>
              This is an extra layer: selected people still follow their
              team&apos;s access levels from System Configuration (None, View,
              Edit* or Edit). BID Responsible and Analyst always keep access.
              You can change this list or turn confidentiality off at any time.
            </span>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <Search size={14} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search people by name, email or job title..."
              />
              {search && (
                <button
                  type="button"
                  className={styles.clearSearch}
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <button
              type="button"
              className={styles.toolbarBtn}
              onClick={resetToKeyPeople}
              title="Select only the Key People of this BID"
            >
              <Users size={14} /> Key People only
            </button>
          </div>

          {teamMembers.length === 0 && (
            <div className={styles.membersHint}>
              Members Management is not loaded yet. Only Key People are listed.
            </div>
          )}

          {visibleGroups.length === 0 ? (
            <div className={styles.empty}>No people match your search.</div>
          ) : (
            <div className={styles.grid}>
              {visibleGroups.map((g) => {
                const selectedInGroup = g.rows.filter(
                  (r) => !!selected[keyOf(r.person.email)],
                ).length;
                const allSelected = selectedInGroup === g.rows.length;
                return (
                  <div
                    key={g.key}
                    className={styles.groupCard}
                    style={{ "--sector-color": g.color } as React.CSSProperties}
                  >
                    <div className={styles.groupHeader}>
                      <span className={styles.groupIcon}>{g.icon}</span>
                      <span className={styles.groupName}>{g.label}</span>
                      <span className={styles.groupCount}>
                        {selectedInGroup}/{g.rows.length}
                      </span>
                      <button
                        type="button"
                        className={styles.groupToggle}
                        onClick={() => setGroup(g, !allSelected)}
                      >
                        {allSelected ? "Clear" : "Select all"}
                      </button>
                    </div>
                    <div className={styles.rows}>
                      {g.rows.map((r) => {
                        const k = keyOf(r.person.email);
                        const locked = !!lockedKeys[k];
                        const checked = !!selected[k];
                        return (
                          <label
                            key={k}
                            className={`${styles.row} ${checked ? styles.rowChecked : ""} ${locked ? styles.rowLocked : ""}`}
                            title={
                              locked
                                ? "BID Responsible and Analyst always keep access"
                                : r.subtitle
                            }
                          >
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              checked={checked}
                              disabled={locked}
                              onChange={() => toggle(r.person)}
                            />
                            <PersonaCard
                              name={r.person.name || r.person.email}
                              email={r.person.email}
                              photoUrl={r.person.photoUrl}
                              size="small"
                              className={styles.persona}
                            />
                            <span className={styles.tags}>
                              {k === meKey && (
                                <span
                                  className={`${styles.tag} ${styles.tagMe}`}
                                >
                                  You
                                </span>
                              )}
                              {r.keyRoles.map((role) => (
                                <span key={role} className={styles.tag}>
                                  {ROLE_TAGS[role]}
                                </span>
                              ))}
                              {locked && (
                                <Lock size={12} className={styles.rowLock} />
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.footerCount}>
            <Users size={15} />
            <strong>{count}</strong>
            {count === 1 ? " person" : " people"} will have access
          </span>
          <div className={styles.footerActions}>
            {isEnabled && (
              <button
                type="button"
                className={styles.disableBtn}
                onClick={() => setConfirmDisable(true)}
                disabled={saving}
              >
                <LockOpen size={14} /> Turn off confidentiality
              </button>
            )}
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => onSave(selectedPeople.map(toPersonRef))}
              disabled={saving || !isDirty}
            >
              <Lock size={14} />
              {saving
                ? "Saving..."
                : isEnabled
                  ? "Save access"
                  : "Make confidential"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDisable}
        title="Turn off confidentiality?"
        message={`BID ${bid.bidNumber} will open again for everyone, following the access levels in System Configuration.`}
        confirmLabel="Turn off"
        variant="warning"
        onCancel={() => setConfirmDisable(false)}
        onConfirm={() => {
          setConfirmDisable(false);
          onDisable();
        }}
      />
    </div>
  );
};
