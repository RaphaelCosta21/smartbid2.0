/**
 * Generates a unique ID with an optional prefix.
 * Used across bid components for scope items, assets, hours, logistics, etc.
 */
export function makeId(prefix: string = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
