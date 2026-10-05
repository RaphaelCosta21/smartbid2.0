/**
 * Faceted counts for filter dropdowns: each facet counts the items that pass the
 * search and every OTHER active filter (the facet's own selection is ignored).
 */

type FacetValue = string | undefined | null;

// Blocks inference from `passes` so K comes from the pickers' keys only (TS 4.7)
type NoInfer<X> = [X][X extends unknown ? 0 : never];

/** Per-facet value counts; each distinct value is counted once per item. */
export function countFacets<T, K extends string>(
  items: T[],
  pickers: Record<K, (item: T) => FacetValue | FacetValue[]>,
  passes: (item: T, skip: NoInfer<K>) => boolean,
): Record<K, Record<string, number>> {
  const out = {} as Record<K, Record<string, number>>;
  (Object.keys(pickers) as K[]).forEach((key) => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      if (!passes(item, key)) return;
      const picked = pickers[key](item);
      const values = Array.isArray(picked) ? picked : [picked];
      const seen: Record<string, true> = {};
      values.forEach((v) => {
        if (!v || seen[v]) return;
        seen[v] = true;
        counts[v] = (counts[v] || 0) + 1;
      });
    });
    out[key] = counts;
  });
  return out;
}

/** Attaches `count` (0 when absent) to each dropdown option. */
export function withCounts<O extends { value: string }>(
  options: O[],
  counts: Record<string, number>,
): (O & { count: number })[] {
  return options.map((o) => ({ ...o, count: counts[o.value] || 0 }));
}
