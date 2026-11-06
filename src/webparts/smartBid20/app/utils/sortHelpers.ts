/** Alphabetical (case/accent-insensitive, numeric-aware) copy sorted by `name` — use for selector options */
export const sortByName = <T extends { name: string }>(
  items: T[] | undefined,
): T[] =>
  (items || [])
    .slice()
    .sort((a, b) =>
      (a.name || "").localeCompare(b.name || "", undefined, {
        sensitivity: "base",
        numeric: true,
      }),
    );
