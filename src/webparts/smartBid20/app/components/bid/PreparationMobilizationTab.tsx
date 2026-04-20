import * as React from "react";
import {
  IScopeItem,
  IRTSItem,
  IMobilizationItem,
  IConsumableItem,
  IHoursSectionGroup,
  RTSCostType,
  MobilizationCostType,
} from "../../models";
import { useConfigStore } from "../../stores/useConfigStore";
import styles from "./PreparationMobilizationTab.module.scss";

interface PreparationMobilizationTabProps {
  scopeItems: IScopeItem[];
  rtsItems: IRTSItem[];
  mobilizationItems: IMobilizationItem[];
  consumableItems: IConsumableItem[];
  rtsSections: IHoursSectionGroup[];
  mobSections: IHoursSectionGroup[];
  consSections: IHoursSectionGroup[];
  onSaveRTS: (items: IRTSItem[]) => void;
  onSaveMob: (items: IMobilizationItem[]) => void;
  onSaveConsumables: (items: IConsumableItem[]) => void;
  onSaveRTSSections: (sections: IHoursSectionGroup[]) => void;
  onSaveMobSections: (sections: IHoursSectionGroup[]) => void;
  onSaveConsSections: (sections: IHoursSectionGroup[]) => void;
  readOnly?: boolean;
}

const makeId = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const CURRENCIES = ["USD", "BRL", "EUR", "GBP", "NOK"];

const RTS_TYPES: { value: RTSCostType; label: string }[] = [
  { value: "maintenance", label: "Maintenance" },
  { value: "refurbishment", label: "Refurbishment" },
  { value: "upgrade", label: "Upgrade" },
  { value: "rts-inspection", label: "RTS Inspection" },
];

const MOB_TYPES: { value: MobilizationCostType; label: string }[] = [
  { value: "mobilization", label: "Mobilization" },
  { value: "demobilization", label: "Demobilization" },
  { value: "transit", label: "Transit" },
];

const blankRTS = (n: number, sectionId?: string | null): IRTSItem => ({
  id: makeId("rts"),
  lineNumber: n,
  sectionId: sectionId || null,
  scopeItemId: null,
  description: "",
  costType: "",
  originalCurrency: "USD",
  unitCost: 0,
  qty: 1,
  totalCost: 0,
  costReference: "",
  notes: "",
});

const blankMob = (n: number, sectionId?: string | null): IMobilizationItem => ({
  id: makeId("mob"),
  lineNumber: n,
  sectionId: sectionId || null,
  description: "",
  costType: "",
  originalCurrency: "USD",
  unitCost: 0,
  qty: 1,
  totalCost: 0,
  notes: "",
});

const blankConsumable = (
  n: number,
  sectionId?: string | null,
): IConsumableItem => ({
  id: makeId("con"),
  lineNumber: n,
  sectionId: sectionId || null,
  item: "",
  description: "",
  originalCurrency: "USD",
  qty: 1,
  unitCost: 0,
  totalCost: 0,
  notes: "",
});

export const PreparationMobilizationTab: React.FC<
  PreparationMobilizationTabProps
> = ({
  scopeItems,
  rtsItems,
  mobilizationItems,
  consumableItems,
  rtsSections,
  mobSections,
  consSections,
  onSaveRTS,
  onSaveMob,
  onSaveConsumables,
  onSaveRTSSections,
  onSaveMobSections,
  onSaveConsSections,
  readOnly = false,
}) => {
  const config = useConfigStore((s) => s.config);
  const costReferences = (config?.costReferences || []).filter(
    (c) => c.isActive !== false,
  );

  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});
  const toggle = (key: string): void =>
    setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(
    new Set(),
  );
  const [editingSectionId, setEditingSectionId] = React.useState<string | null>(
    null,
  );

  const toggleGroup = (id: string): void => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Scope items for linking
  const scopeDataItems = (scopeItems || []).filter((s) => !s.isSection);
  const getScopeName = (id: string | null): string => {
    if (!id) return "";
    const si = scopeDataItems.find((s) => s.id === id);
    return si
      ? si.equipmentOffer || si.description || si.oiiPartNumber || "Scope Item"
      : "";
  };

  // ─── Section helpers (generic) ───
  type PrepTarget = "rts" | "mob" | "cons";

  const getSections = (target: PrepTarget): IHoursSectionGroup[] => {
    if (target === "rts") return rtsSections || [];
    if (target === "mob") return mobSections || [];
    return consSections || [];
  };

  const saveSections = (
    target: PrepTarget,
    sections: IHoursSectionGroup[],
  ): void => {
    if (target === "rts") onSaveRTSSections(sections);
    else if (target === "mob") onSaveMobSections(sections);
    else onSaveConsSections(sections);
  };

  const addPrepSection = (target: PrepTarget): void => {
    saveSections(target, [
      ...getSections(target),
      { id: makeId("sec"), title: "New Section" },
    ]);
  };

  const renamePrepSection = (
    target: PrepTarget,
    id: string,
    title: string,
  ): void => {
    saveSections(
      target,
      getSections(target).map((s) => (s.id === id ? { ...s, title } : s)),
    );
  };

  const deletePrepSection = (target: PrepTarget, id: string): void => {
    if (
      !window.confirm(
        "Delete this section? Items will be moved to unsectioned.",
      )
    )
      return;
    saveSections(
      target,
      getSections(target).filter((s) => s.id !== id),
    );
    if (target === "rts")
      onSaveRTS(
        (rtsItems || []).map((i) =>
          i.sectionId === id ? { ...i, sectionId: null } : i,
        ),
      );
    else if (target === "mob")
      onSaveMob(
        (mobilizationItems || []).map((i) =>
          i.sectionId === id ? { ...i, sectionId: null } : i,
        ),
      );
    else
      onSaveConsumables(
        (consumableItems || []).map((i) =>
          i.sectionId === id ? { ...i, sectionId: null } : i,
        ),
      );
  };

  const movePrepSection = (
    target: PrepTarget,
    id: string,
    direction: "up" | "down",
  ): void => {
    const sections = [...getSections(target)];
    const sIdx = sections.findIndex((s) => s.id === id);
    if (sIdx < 0) return;
    const tIdx = direction === "up" ? sIdx - 1 : sIdx + 1;
    if (tIdx < 0 || tIdx >= sections.length) return;
    const temp = sections[sIdx];
    sections[sIdx] = sections[tIdx];
    sections[tIdx] = temp;
    saveSections(target, sections);
  };

  // ─── Generic ordered items builder ───
  function buildOrdered<T extends { sectionId?: string | null }>(
    items: T[],
    secs: IHoursSectionGroup[],
  ): T[] {
    const result: T[] = [];
    items.filter((i) => !i.sectionId).forEach((i) => result.push(i));
    secs.forEach((sec) => {
      items
        .filter((i) => i.sectionId === sec.id)
        .forEach((i) => result.push(i));
    });
    return result;
  }

  function moveItemInList<T extends { id: string; sectionId?: string | null }>(
    items: T[],
    secs: IHoursSectionGroup[],
    id: string,
    direction: "up" | "down",
  ): T[] | null {
    const ordered = buildOrdered(items, secs);
    const idx = ordered.findIndex((i) => i.id === id);
    if (idx < 0) return null;
    const tIdx = direction === "up" ? idx - 1 : idx + 1;
    if (tIdx < 0 || tIdx >= ordered.length) return null;
    if ((ordered[tIdx].sectionId || null) !== (ordered[idx].sectionId || null))
      return null;
    const temp = ordered[idx];
    ordered[idx] = ordered[tIdx];
    ordered[tIdx] = temp;
    return ordered;
  }

  // ─── RTS handlers ───
  const rts = rtsItems || [];
  const persistRTS = (items: IRTSItem[]): void => {
    onSaveRTS(items.map((i, idx) => ({ ...i, lineNumber: idx + 1 })));
  };
  const addRTS = (sectionId?: string | null): void =>
    persistRTS([...rts, blankRTS(rts.length + 1, sectionId)]);
  const deleteRTS = (id: string): void =>
    persistRTS(rts.filter((i) => i.id !== id));
  const updateRTS = (
    id: string,
    field: keyof IRTSItem,
    value: unknown,
  ): void => {
    persistRTS(
      rts.map((i) => {
        if (i.id !== id) return i;
        const p = { ...i, [field]: value };
        if (field === "unitCost" || field === "qty")
          p.totalCost = (p.unitCost || 0) * (p.qty || 0);
        return p;
      }),
    );
  };
  const moveRTS = (id: string, dir: "up" | "down"): void => {
    const r = moveItemInList(rts, rtsSections || [], id, dir);
    if (r) persistRTS(r as IRTSItem[]);
  };

  // ─── Mobilization handlers ───
  const mob = mobilizationItems || [];
  const persistMob = (items: IMobilizationItem[]): void => {
    onSaveMob(items.map((i, idx) => ({ ...i, lineNumber: idx + 1 })));
  };
  const addMob = (sectionId?: string | null): void =>
    persistMob([...mob, blankMob(mob.length + 1, sectionId)]);
  const deleteMob = (id: string): void =>
    persistMob(mob.filter((i) => i.id !== id));
  const updateMob = (
    id: string,
    field: keyof IMobilizationItem,
    value: unknown,
  ): void => {
    persistMob(
      mob.map((i) => {
        if (i.id !== id) return i;
        const p = { ...i, [field]: value };
        if (field === "unitCost" || field === "qty")
          p.totalCost = (p.unitCost || 0) * (p.qty || 0);
        return p;
      }),
    );
  };
  const moveMob = (id: string, dir: "up" | "down"): void => {
    const r = moveItemInList(mob, mobSections || [], id, dir);
    if (r) persistMob(r as IMobilizationItem[]);
  };

  // ─── Consumables handlers ───
  const cons = consumableItems || [];
  const persistCons = (items: IConsumableItem[]): void => {
    onSaveConsumables(items.map((i, idx) => ({ ...i, lineNumber: idx + 1 })));
  };
  const addCons = (sectionId?: string | null): void =>
    persistCons([...cons, blankConsumable(cons.length + 1, sectionId)]);
  const deleteCons = (id: string): void =>
    persistCons(cons.filter((i) => i.id !== id));
  const updateCons = (
    id: string,
    field: keyof IConsumableItem,
    value: unknown,
  ): void => {
    persistCons(
      cons.map((i) => {
        if (i.id !== id) return i;
        const p = { ...i, [field]: value };
        if (field === "unitCost" || field === "qty")
          p.totalCost = (p.unitCost || 0) * (p.qty || 0);
        return p;
      }),
    );
  };
  const moveCons = (id: string, dir: "up" | "down"): void => {
    const r = moveItemInList(cons, consSections || [], id, dir);
    if (r) persistCons(r as IConsumableItem[]);
  };

  // ─── Totals ───
  const rtsTotal = rts.reduce((s, i) => s + (i.totalCost || 0), 0);
  const mobTotal = mob.reduce((s, i) => s + (i.totalCost || 0), 0);
  const consTotal = cons.reduce((s, i) => s + (i.totalCost || 0), 0);

  // ─── Shared section group header renderer ───
  const renderSectionHeader = (
    target: PrepTarget,
    group: IHoursSectionGroup,
    itemCount: number,
    colSpan: number,
    onAddItem: () => void,
  ): React.ReactNode => {
    const isCollapsed = collapsedGroups.has(group.id);
    const isEditing = editingSectionId === group.id;
    return (
      <tr key={group.id} style={{ background: "var(--card-bg-elevated)" }}>
        <td colSpan={colSpan}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 4px",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
            onClick={() => toggleGroup(group.id)}
          >
            <span
              style={{
                transition: "transform 0.2s",
                transform: isCollapsed ? "rotate(-90deg)" : "none",
              }}
            >
              ▼
            </span>
            {isEditing && !readOnly ? (
              <input
                value={group.title}
                autoFocus
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  padding: "2px 6px",
                  background: "var(--card-bg-elevated)",
                  color: "var(--text-primary)",
                }}
                onChange={(e) =>
                  renamePrepSection(target, group.id, e.target.value)
                }
                onBlur={() => setEditingSectionId(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setEditingSectionId(null);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                onDoubleClick={() => !readOnly && setEditingSectionId(group.id)}
              >
                {group.title || "Untitled Section"}
              </span>
            )}
            <span
              style={{
                fontSize: 11,
                color: "var(--text-tertiary)",
                fontWeight: 400,
              }}
            >
              ({itemCount} items)
            </span>
            {!readOnly && (
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  style={{
                    background: "none",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    fontSize: 10,
                    padding: "2px 5px",
                  }}
                  onClick={() => movePrepSection(target, group.id, "up")}
                  title="Move section up"
                >
                  ▲
                </button>
                <button
                  style={{
                    background: "none",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    fontSize: 10,
                    padding: "2px 5px",
                  }}
                  onClick={() => movePrepSection(target, group.id, "down")}
                  title="Move section down"
                >
                  ▼
                </button>
                <button
                  style={{
                    background: "none",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    cursor: "pointer",
                    color: "var(--accent)",
                    fontSize: 12,
                    padding: "2px 8px",
                  }}
                  onClick={onAddItem}
                >
                  + Item
                </button>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#EF4444",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                  onClick={() => deletePrepSection(target, group.id)}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  };

  // ─── Reorder cell ───
  const reorderCell = (
    onUp: () => void,
    onDown: () => void,
  ): React.ReactNode => (
    <td style={{ width: 28, padding: "0 2px", textAlign: "center" as const }}>
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-secondary)",
          fontSize: 10,
          display: "block",
          lineHeight: 1,
          margin: "0 auto",
        }}
        onClick={onUp}
        title="Move up"
      >
        ▲
      </button>
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-secondary)",
          fontSize: 10,
          display: "block",
          lineHeight: 1,
          margin: "0 auto",
        }}
        onClick={onDown}
        title="Move down"
      >
        ▼
      </button>
    </td>
  );

  // ─── RTS row renderer ───
  const renderRTSRow = (item: IRTSItem): React.ReactNode => (
    <tr key={item.id}>
      {!readOnly &&
        reorderCell(
          () => moveRTS(item.id, "up"),
          () => moveRTS(item.id, "down"),
        )}
      <td className={styles.cellCenter}>{item.lineNumber}</td>
      <td>
        {readOnly ? (
          getScopeName(item.scopeItemId) || "—"
        ) : (
          <select
            className={styles.selectCell}
            value={item.scopeItemId || ""}
            onChange={(e) =>
              updateRTS(item.id, "scopeItemId", e.target.value || null)
            }
          >
            <option value="">None</option>
            {scopeDataItems.map((si) => (
              <option key={si.id} value={si.id}>
                {si.equipmentOffer ||
                  si.description ||
                  si.oiiPartNumber ||
                  `Item #${si.lineNumber}`}
              </option>
            ))}
          </select>
        )}
      </td>
      <td>
        {readOnly ? (
          item.description || "—"
        ) : (
          <input
            className={styles.editInput}
            value={item.description}
            onChange={(e) => updateRTS(item.id, "description", e.target.value)}
          />
        )}
      </td>
      <td>
        {readOnly ? (
          RTS_TYPES.find((t) => t.value === item.costType)?.label || "—"
        ) : (
          <select
            className={styles.selectCell}
            value={item.costType}
            onChange={(e) => updateRTS(item.id, "costType", e.target.value)}
          >
            <option value="" disabled hidden>
              Select...
            </option>
            {RTS_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        )}
      </td>
      <td>
        {readOnly ? (
          item.originalCurrency
        ) : (
          <select
            className={styles.selectCell}
            value={item.originalCurrency}
            onChange={(e) =>
              updateRTS(item.id, "originalCurrency", e.target.value)
            }
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </td>
      <td className={styles.cellCenter}>
        {readOnly ? (
          item.qty
        ) : (
          <input
            className={styles.numInput}
            type="number"
            min={0}
            value={item.qty}
            onChange={(e) =>
              updateRTS(item.id, "qty", Number(e.target.value) || 0)
            }
            style={{ width: 55 }}
          />
        )}
      </td>
      <td className={styles.cellRight}>
        {readOnly ? (
          item.unitCost.toLocaleString()
        ) : (
          <input
            className={styles.numInput}
            type="number"
            min={0}
            step={0.01}
            value={item.unitCost}
            onChange={(e) =>
              updateRTS(item.id, "unitCost", Number(e.target.value) || 0)
            }
          />
        )}
      </td>
      <td className={`${styles.cellRight} ${styles.cellBold}`}>
        {((item.qty || 0) * (item.unitCost || 0)).toLocaleString()}
      </td>
      <td>
        {readOnly ? (
          item.costReference || "—"
        ) : (
          <select
            className={styles.selectCell}
            value={item.costReference}
            onChange={(e) =>
              updateRTS(item.id, "costReference", e.target.value)
            }
          >
            <option value="" disabled hidden>
              Select...
            </option>
            {costReferences.map((cr) => (
              <option key={cr.id} value={cr.value}>
                {cr.label}
              </option>
            ))}
          </select>
        )}
      </td>
      <td>
        {readOnly ? (
          item.notes || "—"
        ) : (
          <input
            className={styles.editInput}
            value={item.notes}
            onChange={(e) => updateRTS(item.id, "notes", e.target.value)}
          />
        )}
      </td>
      {!readOnly && (
        <td>
          <button
            className={styles.deleteBtn}
            onClick={() => deleteRTS(item.id)}
          >
            ✕
          </button>
        </td>
      )}
    </tr>
  );

  // ─── Mob row renderer ───
  const renderMobRow = (item: IMobilizationItem): React.ReactNode => (
    <tr key={item.id}>
      {!readOnly &&
        reorderCell(
          () => moveMob(item.id, "up"),
          () => moveMob(item.id, "down"),
        )}
      <td className={styles.cellCenter}>{item.lineNumber}</td>
      <td>
        {readOnly ? (
          item.description || "—"
        ) : (
          <input
            className={styles.editInput}
            value={item.description}
            onChange={(e) => updateMob(item.id, "description", e.target.value)}
          />
        )}
      </td>
      <td>
        {readOnly ? (
          MOB_TYPES.find((t) => t.value === item.costType)?.label || "—"
        ) : (
          <select
            className={styles.selectCell}
            value={item.costType}
            onChange={(e) => updateMob(item.id, "costType", e.target.value)}
          >
            <option value="" disabled hidden>
              Select...
            </option>
            {MOB_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        )}
      </td>
      <td>
        {readOnly ? (
          item.originalCurrency
        ) : (
          <select
            className={styles.selectCell}
            value={item.originalCurrency}
            onChange={(e) =>
              updateMob(item.id, "originalCurrency", e.target.value)
            }
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </td>
      <td className={styles.cellCenter}>
        {readOnly ? (
          item.qty
        ) : (
          <input
            className={styles.numInput}
            type="number"
            min={0}
            value={item.qty}
            onChange={(e) =>
              updateMob(item.id, "qty", Number(e.target.value) || 0)
            }
            style={{ width: 55 }}
          />
        )}
      </td>
      <td className={styles.cellRight}>
        {readOnly ? (
          item.unitCost.toLocaleString()
        ) : (
          <input
            className={styles.numInput}
            type="number"
            min={0}
            step={0.01}
            value={item.unitCost}
            onChange={(e) =>
              updateMob(item.id, "unitCost", Number(e.target.value) || 0)
            }
          />
        )}
      </td>
      <td className={`${styles.cellRight} ${styles.cellBold}`}>
        {((item.qty || 0) * (item.unitCost || 0)).toLocaleString()}
      </td>
      <td>
        {readOnly ? (
          item.notes || "—"
        ) : (
          <input
            className={styles.editInput}
            value={item.notes}
            onChange={(e) => updateMob(item.id, "notes", e.target.value)}
          />
        )}
      </td>
      {!readOnly && (
        <td>
          <button
            className={styles.deleteBtn}
            onClick={() => deleteMob(item.id)}
          >
            ✕
          </button>
        </td>
      )}
    </tr>
  );

  // ─── Cons row renderer ───
  const renderConsRow = (item: IConsumableItem): React.ReactNode => (
    <tr key={item.id}>
      {!readOnly &&
        reorderCell(
          () => moveCons(item.id, "up"),
          () => moveCons(item.id, "down"),
        )}
      <td className={styles.cellCenter}>{item.lineNumber}</td>
      <td>
        {readOnly ? (
          item.item || "—"
        ) : (
          <input
            className={styles.editInput}
            value={item.item}
            onChange={(e) => updateCons(item.id, "item", e.target.value)}
          />
        )}
      </td>
      <td>
        {readOnly ? (
          item.description || "—"
        ) : (
          <input
            className={styles.editInput}
            value={item.description}
            onChange={(e) => updateCons(item.id, "description", e.target.value)}
          />
        )}
      </td>
      <td>
        {readOnly ? (
          item.originalCurrency
        ) : (
          <select
            className={styles.selectCell}
            value={item.originalCurrency}
            onChange={(e) =>
              updateCons(item.id, "originalCurrency", e.target.value)
            }
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </td>
      <td className={styles.cellCenter}>
        {readOnly ? (
          item.qty
        ) : (
          <input
            className={styles.numInput}
            type="number"
            min={0}
            value={item.qty}
            onChange={(e) =>
              updateCons(item.id, "qty", Number(e.target.value) || 0)
            }
            style={{ width: 55 }}
          />
        )}
      </td>
      <td className={styles.cellRight}>
        {readOnly ? (
          item.unitCost.toLocaleString()
        ) : (
          <input
            className={styles.numInput}
            type="number"
            min={0}
            step={0.01}
            value={item.unitCost}
            onChange={(e) =>
              updateCons(item.id, "unitCost", Number(e.target.value) || 0)
            }
          />
        )}
      </td>
      <td className={`${styles.cellRight} ${styles.cellBold}`}>
        {((item.qty || 0) * (item.unitCost || 0)).toLocaleString()}
      </td>
      <td>
        {readOnly ? (
          item.notes || "—"
        ) : (
          <input
            className={styles.editInput}
            value={item.notes}
            onChange={(e) => updateCons(item.id, "notes", e.target.value)}
          />
        )}
      </td>
      {!readOnly && (
        <td>
          <button
            className={styles.deleteBtn}
            onClick={() => deleteCons(item.id)}
          >
            ✕
          </button>
        </td>
      )}
    </tr>
  );

  return (
    <div className={styles.container}>
      {/* KPI Cards */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>RTS Total</span>
          <span className={styles.kpiValue}>{rtsTotal.toLocaleString()}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Mobilization Total</span>
          <span className={styles.kpiValue}>{mobTotal.toLocaleString()}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Consumables Total</span>
          <span className={styles.kpiValue}>{consTotal.toLocaleString()}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Grand Total</span>
          <span className={styles.kpiValue}>
            {(rtsTotal + mobTotal + consTotal).toLocaleString()}
          </span>
        </div>
      </div>

      {/* ─── RTS Section ─── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggle("rts")}>
          <div className={styles.sectionTitle}>
            <span
              className={`${styles.chevron} ${collapsed.rts ? styles.collapsed : ""}`}
            >
              ▼
            </span>
            🔧 RTS — Ready To Service
            <span className={styles.sectionBadge}>{rts.length} items</span>
          </div>
          <div
            className={styles.sectionActions}
            onClick={(e) => e.stopPropagation()}
          >
            {!readOnly && (
              <>
                <button
                  className={styles.addBtn}
                  onClick={() => addPrepSection("rts")}
                >
                  + Section
                </button>
                <button className={styles.addBtn} onClick={() => addRTS()}>
                  + Add Item
                </button>
              </>
            )}
          </div>
        </div>
        {!collapsed.rts && (
          <div className={styles.sectionBody}>
            {rts.length === 0 && (rtsSections || []).length === 0 ? (
              <div className={styles.emptySection}>
                No RTS items. Click &quot;+ Add Item&quot; or &quot;+
                Section&quot; to start.
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {!readOnly && <th style={{ width: 28 }} />}
                      <th>#</th>
                      <th>Linked Asset</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Currency</th>
                      <th>Qty</th>
                      <th>Unit Cost</th>
                      <th>Total</th>
                      <th>Cost Ref</th>
                      <th>Notes</th>
                      {!readOnly && <th />}
                    </tr>
                  </thead>
                  <tbody>
                    {rts
                      .filter((i) => !i.sectionId)
                      .map((item) => renderRTSRow(item))}
                    {(rtsSections || []).map((group) => {
                      const gi = rts.filter((i) => i.sectionId === group.id);
                      return (
                        <React.Fragment key={group.id}>
                          {renderSectionHeader(
                            "rts",
                            group,
                            gi.length,
                            readOnly ? 11 : 12,
                            () => addRTS(group.id),
                          )}
                          {!collapsedGroups.has(group.id) &&
                            gi.map((item) => renderRTSRow(item))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
                <div className={styles.subtotalBar}>
                  Subtotal: {rtsTotal.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Mobilization Section ─── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggle("mob")}>
          <div className={styles.sectionTitle}>
            <span
              className={`${styles.chevron} ${collapsed.mob ? styles.collapsed : ""}`}
            >
              ▼
            </span>
            🚢 Mobilization
            <span className={styles.sectionBadge}>{mob.length} items</span>
          </div>
          <div
            className={styles.sectionActions}
            onClick={(e) => e.stopPropagation()}
          >
            {!readOnly && (
              <>
                <button
                  className={styles.addBtn}
                  onClick={() => addPrepSection("mob")}
                >
                  + Section
                </button>
                <button className={styles.addBtn} onClick={() => addMob()}>
                  + Add Item
                </button>
              </>
            )}
          </div>
        </div>
        {!collapsed.mob && (
          <div className={styles.sectionBody}>
            {mob.length === 0 && (mobSections || []).length === 0 ? (
              <div className={styles.emptySection}>
                No mobilization costs yet.
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {!readOnly && <th style={{ width: 28 }} />}
                      <th>#</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Currency</th>
                      <th>Qty</th>
                      <th>Unit Cost</th>
                      <th>Total</th>
                      <th>Notes</th>
                      {!readOnly && <th />}
                    </tr>
                  </thead>
                  <tbody>
                    {mob
                      .filter((i) => !i.sectionId)
                      .map((item) => renderMobRow(item))}
                    {(mobSections || []).map((group) => {
                      const gi = mob.filter((i) => i.sectionId === group.id);
                      return (
                        <React.Fragment key={group.id}>
                          {renderSectionHeader(
                            "mob",
                            group,
                            gi.length,
                            readOnly ? 9 : 10,
                            () => addMob(group.id),
                          )}
                          {!collapsedGroups.has(group.id) &&
                            gi.map((item) => renderMobRow(item))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
                <div className={styles.subtotalBar}>
                  Subtotal: {mobTotal.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Consumables Section ─── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggle("cons")}>
          <div className={styles.sectionTitle}>
            <span
              className={`${styles.chevron} ${collapsed.cons ? styles.collapsed : ""}`}
            >
              ▼
            </span>
            🧪 Consumables
            <span className={styles.sectionBadge}>{cons.length} items</span>
          </div>
          <div
            className={styles.sectionActions}
            onClick={(e) => e.stopPropagation()}
          >
            {!readOnly && (
              <>
                <button
                  className={styles.addBtn}
                  onClick={() => addPrepSection("cons")}
                >
                  + Section
                </button>
                <button className={styles.addBtn} onClick={() => addCons()}>
                  + Add Item
                </button>
              </>
            )}
          </div>
        </div>
        {!collapsed.cons && (
          <div className={styles.sectionBody}>
            {cons.length === 0 && (consSections || []).length === 0 ? (
              <div className={styles.emptySection}>
                No consumable items yet.
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {!readOnly && <th style={{ width: 28 }} />}
                      <th>#</th>
                      <th>Item</th>
                      <th>Description</th>
                      <th>Currency</th>
                      <th>Qty</th>
                      <th>Unit Cost</th>
                      <th>Total</th>
                      <th>Notes</th>
                      {!readOnly && <th />}
                    </tr>
                  </thead>
                  <tbody>
                    {cons
                      .filter((i) => !i.sectionId)
                      .map((item) => renderConsRow(item))}
                    {(consSections || []).map((group) => {
                      const gi = cons.filter((i) => i.sectionId === group.id);
                      return (
                        <React.Fragment key={group.id}>
                          {renderSectionHeader(
                            "cons",
                            group,
                            gi.length,
                            readOnly ? 9 : 10,
                            () => addCons(group.id),
                          )}
                          {!collapsedGroups.has(group.id) &&
                            gi.map((item) => renderConsRow(item))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
                <div className={styles.subtotalBar}>
                  Subtotal: {consTotal.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
