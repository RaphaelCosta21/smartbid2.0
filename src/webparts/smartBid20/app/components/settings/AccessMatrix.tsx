import * as React from "react";
import {
  Ban,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Eye,
  Pencil,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { AccessPermission, UserRole } from "../../models";
import { IAccessRoleDef } from "../../config/accessControl.config";
import { getSectorColor } from "../../config/sectors.config";
import styles from "./AccessMatrix.module.scss";

export interface IAccessMatrixItem {
  key: string;
  label: string;
}

export interface IAccessMatrixGroup {
  key: string;
  label: string;
  icon?: React.ReactNode;
  allowEditNoDelete?: boolean;
  items: IAccessMatrixItem[];
}

interface AccessMatrixProps {
  title: string;
  subtitle: string;
  /** Header of the first column, e.g. "Area" or "Group". */
  groupHeader: string;
  /** Plural noun for the rows inside a group, e.g. "pages" or "tabs". */
  itemNoun: string;
  groups: IAccessMatrixGroup[];
  roles: IAccessRoleDef[];
  readOnly: boolean;
  getGroupLevel: (role: UserRole, groupKey: string) => AccessPermission;
  getOverride: (
    role: UserRole,
    itemKey: string,
  ) => AccessPermission | undefined;
  getSavedGroupLevel?: (
    role: UserRole,
    groupKey: string,
  ) => AccessPermission | undefined;
  getSavedOverride?: (
    role: UserRole,
    itemKey: string,
  ) => AccessPermission | undefined;
  onSetGroup: (
    role: UserRole,
    groupKey: string,
    level: AccessPermission,
  ) => void;
  /** `undefined` clears the override so the item inherits its group again. */
  onSetItem: (
    role: UserRole,
    itemKey: string,
    level: AccessPermission | undefined,
  ) => void;
  onClearGroupOverrides: (groupKey: string) => void;
}

const CYCLE: AccessPermission[] = ["none", "view", "edit"];
const nextLevel = (
  level: AccessPermission,
  allowEditNoDelete?: boolean,
): AccessPermission => {
  const cycle: AccessPermission[] = allowEditNoDelete
    ? ["none", "view", "editNoDelete", "edit"]
    : CYCLE;
  return cycle[(cycle.indexOf(level) + 1) % cycle.length];
};

const LEVEL_LABEL: Record<AccessPermission, string> = {
  edit: "Edit",
  editNoDelete: "Edit*",
  view: "View",
  none: "None",
};

const LevelIcon: React.FC<{ level: AccessPermission }> = ({ level }) =>
  level === "edit" || level === "editNoDelete" ? (
    <Pencil size={11} />
  ) : level === "view" ? (
    <Eye size={11} />
  ) : (
    <Ban size={11} />
  );

const roleColor = (role: UserRole): string =>
  role === "guest" ? "var(--text-muted)" : getSectorColor(role);

const LegendPill: React.FC<{
  level: AccessPermission;
  inherited?: boolean;
  custom?: boolean;
}> = ({ level, inherited, custom }) => (
  <span
    className={`${styles.pill} ${styles[level === "editNoDelete" ? "edit" : level]} ${inherited ? styles.inherited : ""}`}
  >
    <LevelIcon level={level} />
    <span>{LEVEL_LABEL[level]}</span>
    {custom && <span className={styles.customDot} />}
  </span>
);

export const AccessLegend: React.FC = () => (
  <div className={styles.legend}>
    <span className={styles.legendItem}>
      <LegendPill level="edit" /> Full access
    </span>
    <span className={styles.legendItem}>
      <LegendPill level="editNoDelete" /> Add/edit, no delete (Collaboration)
    </span>
    <span className={styles.legendItem}>
      <LegendPill level="view" /> Read only, no add/edit/delete
    </span>
    <span className={styles.legendItem}>
      <LegendPill level="none" /> Disabled in the sidebar
    </span>
    <span className={styles.legendDivider} />
    <span className={styles.legendItem}>
      <LegendPill level="view" inherited /> Inherited from area
    </span>
    <span className={styles.legendItem}>
      <LegendPill level="view" custom /> Custom (hover to reset)
    </span>
  </div>
);

export const SuperAdminsCard: React.FC<{ emails: readonly string[] }> = ({
  emails,
}) => (
  <div className={styles.adminCard}>
    <span className={styles.adminIcon}>
      <ShieldCheck size={18} />
    </span>
    <div className={styles.adminBody}>
      <h4>Super Admins</h4>
      <p>
        Always have Edit on System Configuration and Members Management. Every
        other page follows the permissions of their team below.
      </p>
      <div className={styles.adminList}>
        {emails.map((e) => (
          <span key={e} className={styles.adminChip}>
            {e}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export const AccessMatrix: React.FC<AccessMatrixProps> = ({
  title,
  subtitle,
  groupHeader,
  itemNoun,
  groups,
  roles,
  readOnly,
  getGroupLevel,
  getOverride,
  getSavedGroupLevel,
  getSavedOverride,
  onSetGroup,
  onSetItem,
  onClearGroupOverrides,
}) => {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [hoverRole, setHoverRole] = React.useState<UserRole | null>(null);

  const allExpanded = groups.every((g) => expanded[g.key]);
  const toggleAll = (): void => {
    const next: Record<string, boolean> = {};
    groups.forEach((g) => {
      next[g.key] = !allExpanded;
    });
    setExpanded(next);
  };

  const colClass = (role: UserRole): string =>
    hoverRole === role ? styles.colHover : "";

  const renderRoleCells = (
    group: IAccessMatrixGroup,
    item?: IAccessMatrixItem,
  ): React.ReactNode =>
    roles.map((r) => {
      const groupLevel = getGroupLevel(r.value, group.key);
      const override = item ? getOverride(r.value, item.key) : undefined;
      const inherited = !!item && override === undefined;
      const level = item ? override || groupLevel : groupLevel;
      const changed = item
        ? !!getSavedOverride && getSavedOverride(r.value, item.key) !== override
        : !!getSavedGroupLevel &&
          getSavedGroupLevel(r.value, group.key) !== groupLevel;
      const rowLabel = item ? item.label : group.label;
      const hint = inherited
        ? `Inherited from ${group.label}: ${LEVEL_LABEL[level]}`
        : item
          ? `Custom: ${LEVEL_LABEL[level]} (${group.label} is ${LEVEL_LABEL[groupLevel]})`
          : LEVEL_LABEL[level];

      return (
        <td
          key={r.value}
          className={`${styles.cell} ${colClass(r.value)}`}
          onMouseEnter={() => setHoverRole(r.value)}
        >
          <div className={styles.cellInner}>
            <button
              type="button"
              className={`${styles.pill} ${styles[level === "editNoDelete" ? "edit" : level]} ${inherited ? styles.inherited : ""} ${changed ? styles.changed : ""}`}
              disabled={readOnly}
              title={`${hint}${level === "editNoDelete" ? ". Add and edit only; deletion is disabled" : ""}${readOnly ? "" : ". Click to change."}`}
              aria-label={`${rowLabel}, ${r.label}: ${LEVEL_LABEL[level]}${inherited ? " (inherited)" : ""}`}
              onClick={() =>
                item
                  ? onSetItem(
                      r.value,
                      item.key,
                      nextLevel(level, group.allowEditNoDelete),
                    )
                  : onSetGroup(
                      r.value,
                      group.key,
                      nextLevel(level, group.allowEditNoDelete),
                    )
              }
            >
              <LevelIcon level={level} />
              <span>{LEVEL_LABEL[level]}</span>
              {item && !inherited && <span className={styles.customDot} />}
            </button>
            {item && !inherited && !readOnly && (
              <button
                type="button"
                className={styles.resetBtn}
                title={`Reset to inherit from ${group.label} (${LEVEL_LABEL[groupLevel]})`}
                aria-label={`Reset ${item.label} for ${r.label} to inherit`}
                onClick={() => onSetItem(r.value, item.key, undefined)}
              >
                <RotateCcw size={11} />
              </button>
            )}
          </div>
        </td>
      );
    });

  return (
    <section className={styles.matrix}>
      <div className={styles.toolbar}>
        <div className={styles.heading}>
          <h4>{title}</h4>
          <p>{subtitle}</p>
        </div>
        <button type="button" className={styles.toolBtn} onClick={toggleAll}>
          {allExpanded ? (
            <ChevronsDownUp size={14} />
          ) : (
            <ChevronsUpDown size={14} />
          )}
          {allExpanded ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <div className={styles.scroller} onMouseLeave={() => setHoverRole(null)}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.cornerHead} scope="col">
                {groupHeader}
              </th>
              {roles.map((r) => (
                <th
                  key={r.value}
                  scope="col"
                  className={`${styles.roleHead} ${colClass(r.value)}`}
                  style={
                    {
                      "--role-color": roleColor(r.value),
                    } as React.CSSProperties
                  }
                  onMouseEnter={() => setHoverRole(r.value)}
                >
                  <span className={styles.roleDot} />
                  {r.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => {
              const isOpen = !!expanded[g.key];
              let customCount = 0;
              g.items.forEach((item) =>
                roles.forEach((r) => {
                  if (getOverride(r.value, item.key) !== undefined) {
                    customCount++;
                  }
                }),
              );
              return (
                <React.Fragment key={g.key}>
                  <tr
                    className={`${styles.groupRow} ${isOpen ? styles.open : ""}`}
                  >
                    <th scope="row" className={styles.rowHead}>
                      <div className={styles.rowHeadInner}>
                        <button
                          type="button"
                          className={styles.expandBtn}
                          aria-expanded={isOpen}
                          disabled={g.items.length === 0}
                          onClick={() =>
                            setExpanded({ ...expanded, [g.key]: !isOpen })
                          }
                        >
                          <ChevronRight size={14} className={styles.chevron} />
                          {g.icon && (
                            <span className={styles.groupIcon}>{g.icon}</span>
                          )}
                          <span className={styles.groupLabel}>{g.label}</span>
                          <span
                            className={styles.countChip}
                            title={`${g.items.length} ${itemNoun}`}
                          >
                            {g.items.length}
                          </span>
                        </button>
                        {customCount > 0 && (
                          <span
                            className={styles.customChip}
                            title={`${customCount} custom ${itemNoun} permission(s)`}
                          >
                            {customCount} custom
                            {!readOnly && (
                              <button
                                type="button"
                                className={styles.chipReset}
                                title={`Reset all custom ${itemNoun} in ${g.label}`}
                                aria-label={`Reset all custom ${itemNoun} in ${g.label}`}
                                onClick={() => onClearGroupOverrides(g.key)}
                              >
                                <RotateCcw size={10} />
                              </button>
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    {renderRoleCells(g)}
                  </tr>
                  {isOpen &&
                    g.items.map((item, idx) => (
                      <tr
                        key={item.key}
                        className={`${styles.itemRow} ${idx === g.items.length - 1 ? styles.lastItem : ""}`}
                      >
                        <th scope="row" className={styles.rowHead}>
                          <span className={styles.itemLabel}>{item.label}</span>
                        </th>
                        {renderRoleCells(g, item)}
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
