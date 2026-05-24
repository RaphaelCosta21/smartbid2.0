/**
 * Revision change tracking utilities.
 * Compares BID state before and after edits to record what changed during a revision.
 */
import { IBid, IBidRevision, IRevisionChange } from "../models";
import { makeId } from "./idGenerator";

/** Sections that are tracked during revisions */
export type TrackableSection =
  | "scope"
  | "hours"
  | "assets"
  | "preparation"
  | "logistics"
  | "certifications";

/** Section labels for display */
const SECTION_LABELS: Record<TrackableSection, string> = {
  scope: "Scope of Supply",
  hours: "Hours & Personnel",
  assets: "Assets Breakdown",
  preparation: "Prep & Mobilization",
  logistics: "Logistics",
  certifications: "Certifications",
};

/**
 * Detect changes between old and new BID patches for a given section.
 * Returns an array of IRevisionChange entries to be appended to the active revision.
 */
export function detectRevisionChanges(
  section: TrackableSection,
  oldBid: IBid,
  patch: Partial<IBid>,
  changedBy: { name: string; email: string },
): IRevisionChange[] {
  const changes: IRevisionChange[] = [];
  const now = new Date().toISOString();

  switch (section) {
    case "scope": {
      if (!patch.scopeItems) break;
      const oldItems = oldBid.scopeItems || [];
      const newItems = patch.scopeItems || [];
      const oldIds = new Set(oldItems.map((i) => i.id));
      const newIds = new Set(newItems.map((i) => i.id));

      // Added items
      newItems.forEach((item) => {
        if (!oldIds.has(item.id) && !item.isSection) {
          changes.push({
            id: makeId("chg"),
            section: SECTION_LABELS[section],
            changeType: "added",
            description: `Added scope item: "${item.description || item.equipmentOffer || "New item"}"`,
            fieldPath: `scopeItems[${item.id}]`,
            previousValue: null,
            newValue: item.description || item.equipmentOffer || "",
            changedBy,
            changedAt: now,
          });
        }
      });

      // Removed items
      oldItems.forEach((item) => {
        if (!newIds.has(item.id) && !item.isSection) {
          changes.push({
            id: makeId("chg"),
            section: SECTION_LABELS[section],
            changeType: "removed",
            description: `Removed scope item: "${item.description || item.equipmentOffer || "Item"}"`,
            fieldPath: `scopeItems[${item.id}]`,
            previousValue: item.description || item.equipmentOffer || "",
            newValue: null,
            changedBy,
            changedAt: now,
          });
        }
      });

      // Modified items
      newItems.forEach((newItem) => {
        if (oldIds.has(newItem.id)) {
          const oldItem = oldItems.find((i) => i.id === newItem.id);
          if (oldItem && JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
            changes.push({
              id: makeId("chg"),
              section: SECTION_LABELS[section],
              changeType: "modified",
              description: `Modified scope item: "${newItem.description || newItem.equipmentOffer || "Item"}"`,
              fieldPath: `scopeItems[${newItem.id}]`,
              previousValue:
                oldItem.description || oldItem.equipmentOffer || "",
              newValue: newItem.description || newItem.equipmentOffer || "",
              changedBy,
              changedAt: now,
            });
          }
        }
      });
      break;
    }

    case "hours": {
      if (!patch.hoursSummary) break;
      const oldHours = oldBid.hoursSummary;
      const newHours = patch.hoursSummary;
      if (JSON.stringify(oldHours) !== JSON.stringify(newHours)) {
        changes.push({
          id: makeId("chg"),
          section: SECTION_LABELS[section],
          changeType: "modified",
          description: "Hours & Personnel data updated",
          fieldPath: "hoursSummary",
          previousValue: oldHours
            ? `Total: ${oldHours.grandTotalHours}h`
            : null,
          newValue: newHours ? `Total: ${newHours.grandTotalHours}h` : null,
          changedBy,
          changedAt: now,
        });
      }
      break;
    }

    case "assets": {
      if (!patch.assetBreakdown) break;
      const oldItems = oldBid.assetBreakdown || [];
      const newItems = patch.assetBreakdown || [];
      const oldIds = new Set(oldItems.map((i) => i.id));
      const newIds = new Set(newItems.map((i) => i.id));
      const scopeItems = oldBid.scopeItems || [];

      /** Resolve a human-readable name for an asset item */
      const getAssetLabel = (item: {
        scopeItemId: string;
        supplier?: string;
        costReference?: string;
      }): string => {
        const scopeItem = scopeItems.find((s) => s.id === item.scopeItemId);
        if (scopeItem) {
          return (
            scopeItem.description ||
            scopeItem.equipmentOffer ||
            scopeItem.partNumber ||
            item.scopeItemId
          );
        }
        return item.supplier || item.costReference || item.scopeItemId;
      };

      newItems.forEach((item) => {
        if (!oldIds.has(item.id)) {
          changes.push({
            id: makeId("chg"),
            section: SECTION_LABELS[section],
            changeType: "added",
            description: `Added: "${getAssetLabel(item)}" — $${item.totalCostUSD.toLocaleString()} (${item.acquisitionType || "N/A"})`,
            fieldPath: `assetBreakdown[${item.id}]`,
            previousValue: null,
            newValue: `$${item.totalCostUSD}`,
            changedBy,
            changedAt: now,
          });
        }
      });

      oldItems.forEach((item) => {
        if (!newIds.has(item.id)) {
          changes.push({
            id: makeId("chg"),
            section: SECTION_LABELS[section],
            changeType: "removed",
            description: `Removed: "${getAssetLabel(item)}" — was $${item.totalCostUSD.toLocaleString()}`,
            fieldPath: `assetBreakdown[${item.id}]`,
            previousValue: `$${item.totalCostUSD}`,
            newValue: null,
            changedBy,
            changedAt: now,
          });
        }
      });

      newItems.forEach((newItem) => {
        if (oldIds.has(newItem.id)) {
          const oldItem = oldItems.find((i) => i.id === newItem.id);
          if (oldItem && JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
            // Detect which fields changed
            const fieldChanges: string[] = [];
            if (oldItem.totalCostUSD !== newItem.totalCostUSD) {
              fieldChanges.push(
                `cost: $${oldItem.totalCostUSD.toLocaleString()} → $${newItem.totalCostUSD.toLocaleString()}`,
              );
            }
            if (oldItem.unitCostUSD !== newItem.unitCostUSD) {
              fieldChanges.push(
                `unit cost: $${oldItem.unitCostUSD} → $${newItem.unitCostUSD}`,
              );
            }
            if (oldItem.acquisitionType !== newItem.acquisitionType) {
              fieldChanges.push(
                `type: ${oldItem.acquisitionType || "—"} → ${newItem.acquisitionType || "—"}`,
              );
            }
            if (oldItem.supplier !== newItem.supplier) {
              fieldChanges.push(
                `supplier: ${oldItem.supplier || "—"} → ${newItem.supplier || "—"}`,
              );
            }
            if (oldItem.leadTimeDays !== newItem.leadTimeDays) {
              fieldChanges.push(
                `lead time: ${oldItem.leadTimeDays}d → ${newItem.leadTimeDays}d`,
              );
            }
            if (oldItem.availabilityStatus !== newItem.availabilityStatus) {
              fieldChanges.push(
                `availability: ${oldItem.availabilityStatus || "—"} → ${newItem.availabilityStatus || "—"}`,
              );
            }
            const detail =
              fieldChanges.length > 0 ? ` (${fieldChanges.join(", ")})` : "";
            changes.push({
              id: makeId("chg"),
              section: SECTION_LABELS[section],
              changeType: "modified",
              description: `Modified: "${getAssetLabel(newItem)}"${detail}`,
              fieldPath: `assetBreakdown[${newItem.id}]`,
              previousValue: `$${oldItem.totalCostUSD}`,
              newValue: `$${newItem.totalCostUSD}`,
              changedBy,
              changedAt: now,
            });
          }
        }
      });
      break;
    }

    case "preparation": {
      /** Track individual items with descriptions for any prep array */
      const trackPrepItems = (
        fieldName: string,
        label: string,
        oldArr: any[],
        newArr: any[],
      ): void => {
        const oldIds = new Set(oldArr.map((i: any) => i.id));
        const newIds = new Set(newArr.map((i: any) => i.id));

        // Added
        newArr.forEach((item: any) => {
          if (!oldIds.has(item.id)) {
            const desc =
              item.description || item.item || `Line ${item.lineNumber || "?"}`;
            changes.push({
              id: makeId("chg"),
              section: SECTION_LABELS[section],
              changeType: "added",
              description: `Added ${label}: "${desc}" — $${(item.totalCost || 0).toLocaleString()}`,
              fieldPath: `${fieldName}[${item.id}]`,
              previousValue: null,
              newValue: `$${item.totalCost || 0}`,
              changedBy,
              changedAt: now,
            });
          }
        });

        // Removed
        oldArr.forEach((item: any) => {
          if (!newIds.has(item.id)) {
            const desc =
              item.description || item.item || `Line ${item.lineNumber || "?"}`;
            changes.push({
              id: makeId("chg"),
              section: SECTION_LABELS[section],
              changeType: "removed",
              description: `Removed ${label}: "${desc}" — was $${(item.totalCost || 0).toLocaleString()}`,
              fieldPath: `${fieldName}[${item.id}]`,
              previousValue: `$${item.totalCost || 0}`,
              newValue: null,
              changedBy,
              changedAt: now,
            });
          }
        });

        // Modified
        newArr.forEach((newItem: any) => {
          if (oldIds.has(newItem.id)) {
            const oldItem = oldArr.find((o: any) => o.id === newItem.id);
            if (
              oldItem &&
              JSON.stringify(oldItem) !== JSON.stringify(newItem)
            ) {
              const desc =
                newItem.description ||
                newItem.item ||
                `Line ${newItem.lineNumber || "?"}`;
              const fieldChanges: string[] = [];
              if (oldItem.totalCost !== newItem.totalCost) {
                fieldChanges.push(
                  `total: $${(oldItem.totalCost || 0).toLocaleString()} → $${(newItem.totalCost || 0).toLocaleString()}`,
                );
              }
              if (oldItem.unitCost !== newItem.unitCost) {
                fieldChanges.push(
                  `unit cost: $${oldItem.unitCost || 0} → $${newItem.unitCost || 0}`,
                );
              }
              if (oldItem.qty !== newItem.qty) {
                fieldChanges.push(`qty: ${oldItem.qty} → ${newItem.qty}`);
              }
              if ((oldItem.description || "") !== (newItem.description || "")) {
                fieldChanges.push(`description changed`);
              }
              const detail =
                fieldChanges.length > 0 ? ` (${fieldChanges.join(", ")})` : "";
              changes.push({
                id: makeId("chg"),
                section: SECTION_LABELS[section],
                changeType: "modified",
                description: `Modified ${label}: "${desc}"${detail}`,
                fieldPath: `${fieldName}[${newItem.id}]`,
                previousValue: `$${oldItem.totalCost || 0}`,
                newValue: `$${newItem.totalCost || 0}`,
                changedBy,
                changedAt: now,
              });
            }
          }
        });
      };

      if (patch.rtsItems) {
        trackPrepItems(
          "rtsItems",
          "RTS",
          oldBid.rtsItems || [],
          patch.rtsItems,
        );
      }
      if (patch.mobilizationItems) {
        trackPrepItems(
          "mobilizationItems",
          "Mobilization",
          oldBid.mobilizationItems || [],
          patch.mobilizationItems,
        );
      }
      if (patch.consumableItems) {
        trackPrepItems(
          "consumableItems",
          "Consumable",
          oldBid.consumableItems || [],
          patch.consumableItems,
        );
      }
      break;
    }

    case "logistics": {
      if (!patch.logisticsBreakdown) break;
      const oldItems = oldBid.logisticsBreakdown || [];
      const newItems = patch.logisticsBreakdown || [];
      const oldIds = new Set(oldItems.map((i) => i.id));
      const newIds = new Set(newItems.map((i) => i.id));

      newItems.forEach((item) => {
        if (!oldIds.has(item.id)) {
          const label =
            item.description || item.item || `Line ${item.lineNumber}`;
          changes.push({
            id: makeId("chg"),
            section: SECTION_LABELS[section],
            changeType: "added",
            description: `Added: "${label}" — ${item.qty}x $${item.unitCost} = $${item.totalCost.toLocaleString()}`,
            fieldPath: `logisticsBreakdown[${item.id}]`,
            previousValue: null,
            newValue: `$${item.totalCost}`,
            changedBy,
            changedAt: now,
          });
        }
      });

      oldItems.forEach((item) => {
        if (!newIds.has(item.id)) {
          const label =
            item.description || item.item || `Line ${item.lineNumber}`;
          changes.push({
            id: makeId("chg"),
            section: SECTION_LABELS[section],
            changeType: "removed",
            description: `Removed: "${label}" — was $${item.totalCost.toLocaleString()}`,
            fieldPath: `logisticsBreakdown[${item.id}]`,
            previousValue: `$${item.totalCost}`,
            newValue: null,
            changedBy,
            changedAt: now,
          });
        }
      });

      newItems.forEach((newItem) => {
        if (oldIds.has(newItem.id)) {
          const oldItem = oldItems.find((o) => o.id === newItem.id);
          if (oldItem && JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
            const label =
              newItem.description ||
              newItem.item ||
              `Line ${newItem.lineNumber}`;
            const fieldChanges: string[] = [];
            if (oldItem.unitCost !== newItem.unitCost) {
              fieldChanges.push(
                `unit cost: $${oldItem.unitCost} → $${newItem.unitCost}`,
              );
            }
            if (oldItem.qty !== newItem.qty) {
              fieldChanges.push(`qty: ${oldItem.qty} → ${newItem.qty}`);
            }
            if (oldItem.totalCost !== newItem.totalCost) {
              fieldChanges.push(
                `total: $${oldItem.totalCost.toLocaleString()} → $${newItem.totalCost.toLocaleString()}`,
              );
            }
            if (oldItem.description !== newItem.description) {
              fieldChanges.push(`description changed`);
            }
            const detail =
              fieldChanges.length > 0 ? ` (${fieldChanges.join(", ")})` : "";
            changes.push({
              id: makeId("chg"),
              section: SECTION_LABELS[section],
              changeType: "modified",
              description: `Modified: "${label}"${detail}`,
              fieldPath: `logisticsBreakdown[${newItem.id}]`,
              previousValue: `$${oldItem.totalCost}`,
              newValue: `$${newItem.totalCost}`,
              changedBy,
              changedAt: now,
            });
          }
        }
      });
      break;
    }

    case "certifications": {
      if (!patch.certificationsBreakdown) break;
      const oldItems = oldBid.certificationsBreakdown || [];
      const newItems = patch.certificationsBreakdown || [];
      const oldIds = new Set(oldItems.map((i) => i.id));
      const newIds = new Set(newItems.map((i) => i.id));

      newItems.forEach((item) => {
        if (!oldIds.has(item.id) && !item.isSection) {
          const label = item.itemRef || `Line ${item.lineNumber}`;
          changes.push({
            id: makeId("chg"),
            section: SECTION_LABELS[section],
            changeType: "added",
            description: `Added: "${label}" — ${item.qty}x $${item.unitCost} = $${item.totalCost.toLocaleString()}`,
            fieldPath: `certificationsBreakdown[${item.id}]`,
            previousValue: null,
            newValue: `$${item.totalCost}`,
            changedBy,
            changedAt: now,
          });
        }
      });

      oldItems.forEach((item) => {
        if (!newIds.has(item.id) && !item.isSection) {
          const label = item.itemRef || `Line ${item.lineNumber}`;
          changes.push({
            id: makeId("chg"),
            section: SECTION_LABELS[section],
            changeType: "removed",
            description: `Removed: "${label}" — was $${item.totalCost.toLocaleString()}`,
            fieldPath: `certificationsBreakdown[${item.id}]`,
            previousValue: `$${item.totalCost}`,
            newValue: null,
            changedBy,
            changedAt: now,
          });
        }
      });

      newItems.forEach((newItem) => {
        if (oldIds.has(newItem.id) && !newItem.isSection) {
          const oldItem = oldItems.find((o) => o.id === newItem.id);
          if (oldItem && JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
            const label = newItem.itemRef || `Line ${newItem.lineNumber}`;
            const fieldChanges: string[] = [];
            if (oldItem.unitCost !== newItem.unitCost) {
              fieldChanges.push(
                `unit cost: $${oldItem.unitCost} → $${newItem.unitCost}`,
              );
            }
            if (oldItem.qty !== newItem.qty) {
              fieldChanges.push(`qty: ${oldItem.qty} → ${newItem.qty}`);
            }
            if (oldItem.totalCost !== newItem.totalCost) {
              fieldChanges.push(
                `total: $${oldItem.totalCost.toLocaleString()} → $${newItem.totalCost.toLocaleString()}`,
              );
            }
            if (oldItem.expiryPeriod !== newItem.expiryPeriod) {
              fieldChanges.push(
                `expiry: ${oldItem.expiryPeriod || "—"} → ${newItem.expiryPeriod || "—"}`,
              );
            }
            const detail =
              fieldChanges.length > 0 ? ` (${fieldChanges.join(", ")})` : "";
            changes.push({
              id: makeId("chg"),
              section: SECTION_LABELS[section],
              changeType: "modified",
              description: `Modified: "${label}"${detail}`,
              fieldPath: `certificationsBreakdown[${newItem.id}]`,
              previousValue: `$${oldItem.totalCost}`,
              newValue: `$${newItem.totalCost}`,
              changedBy,
              changedAt: now,
            });
          }
        }
      });
      break;
    }
  }

  return changes;
}

/**
 * Determines which section a patch belongs to based on its keys.
 */
export function getSectionFromPatch(
  patch: Partial<IBid>,
): TrackableSection | null {
  if (patch.scopeItems !== undefined) return "scope";
  if (patch.hoursSummary !== undefined) return "hours";
  if (patch.assetBreakdown !== undefined) return "assets";
  if (
    patch.rtsItems !== undefined ||
    patch.mobilizationItems !== undefined ||
    patch.consumableItems !== undefined
  ) {
    return "preparation";
  }
  if (patch.logisticsBreakdown !== undefined) return "logistics";
  if (patch.certificationsBreakdown !== undefined) return "certifications";
  return null;
}

/**
 * Appends revision changes to the active revision in the BID's revisions array.
 * Returns the updated revisions array, or the original if no active revision.
 */
export function appendRevisionChanges(
  revisions: IBidRevision[],
  newChanges: IRevisionChange[],
): IBidRevision[] {
  if (newChanges.length === 0) return revisions;
  return revisions.map((r) =>
    r.status === "open" ? { ...r, changes: [...r.changes, ...newChanges] } : r,
  );
}
