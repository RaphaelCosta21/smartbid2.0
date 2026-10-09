/**
 * textSimilarity — fuzzy text matching for pairing equivalent items across BIDs when
 * part numbers don't settle it. Token-sort ratio: word order is ignored.
 */

/** Lowercased, punctuation stripped, words sorted — the form that gets compared */
export function tokenSortKey(text?: string | null): string {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(" ");
}

/**
 * Levenshtein distance, banded to `maxEdits`: returns `maxEdits + 1` as soon as the strings
 * are known to differ by more. Most pairs are dissimilar, so this keeps large BIDs fast.
 */
function boundedLevenshtein(a: string, b: string, maxEdits: number): number {
  const m = a.length;
  const n = b.length;
  const big = maxEdits + 1;
  if (Math.abs(m - n) > maxEdits) return big;
  if (m === 0) return Math.min(n, big);
  if (n === 0) return Math.min(m, big);

  let prev: number[] = [];
  let curr: number[] = [];
  for (let j = 0; j <= n; j++) prev[j] = j <= maxEdits ? j : big;

  for (let i = 1; i <= m; i++) {
    const lo = Math.max(1, i - maxEdits);
    const hi = Math.min(n, i + maxEdits);
    curr[lo - 1] = lo === 1 ? Math.min(i, big) : big;
    if (hi < n) curr[hi + 1] = big;
    let rowMin = curr[lo - 1];
    for (let j = lo; j <= hi; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      const v = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost, big);
      curr[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin >= big) return big;
    const tmp = prev;
    prev = curr;
    curr = tmp;
  }
  return Math.min(prev[n], big);
}

/**
 * Similarity 0–1 of two token-sort keys, or 0 when it is under `threshold`
 * (rejecting early is what makes it cheap).
 */
export function similarityAtLeast(
  a: string,
  b: string,
  threshold: number,
): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  const maxEdits = Math.floor((1 - threshold) * maxLen + 1e-9);
  const edits = boundedLevenshtein(a, b, maxEdits);
  return edits > maxEdits ? 0 : 1 - edits / maxLen;
}
