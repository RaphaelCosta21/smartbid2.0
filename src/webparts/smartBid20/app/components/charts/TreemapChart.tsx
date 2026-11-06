/**
 * TreemapChart — part-to-whole as area (squarified layout, HTML tiles). Small tail
 * values fold into one "Other" tile so the map stays readable. Click/Enter selects a tile.
 */
import * as React from "react";
import { useElementSize } from "../../hooks/useElementSize";
import styles from "./TreemapChart.module.scss";

export interface TreemapNode {
  key: string;
  label: string;
  value: number;
  /** Resolved color (hex) */
  color: string;
  /** Optional second line (e.g. count) */
  sub?: string;
}

export interface TreemapChartProps {
  nodes: TreemapNode[];
  formatValue: (value: number) => string;
  height?: number;
  /** Tiles beyond this count fold into "Other" */
  maxNodes?: number;
  /** Hex color of the "Other" tile */
  otherColor: string;
  selectedKey?: string | null;
  onSelect?: (key: string) => void;
}

/** Key of the folded tail tile */
export const TREEMAP_OTHER_KEY = "__other";

interface IRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const sum = (values: number[]): number => values.reduce((s, v) => s + v, 0);

function worst(row: number[], side: number): number {
  const s = sum(row);
  const max = Math.max(...row);
  const min = Math.min(...row);
  return Math.max((side * side * max) / (s * s), (s * s) / (side * side * min));
}

function layoutRow(row: number[], r: IRect, out: IRect[]): IRect {
  const s = sum(row);
  if (r.w >= r.h) {
    const colW = s / r.h;
    let y = r.y;
    row.forEach((v) => {
      const h = v / colW;
      out.push({ x: r.x, y, w: colW, h });
      y += h;
    });
    return { x: r.x + colW, y: r.y, w: r.w - colW, h: r.h };
  }
  const rowH = s / r.w;
  let x = r.x;
  row.forEach((v) => {
    const w = v / rowH;
    out.push({ x, y: r.y, w, h: rowH });
    x += w;
  });
  return { x: r.x, y: r.y + rowH, w: r.w, h: r.h - rowH };
}

/** Squarified treemap: `values` sorted descending, rects returned in the same order */
function squarify(values: number[], rect: IRect): IRect[] {
  const total = sum(values);
  if (total <= 0 || rect.w <= 0 || rect.h <= 0) return [];
  const scaled = values.map((v) => (v * rect.w * rect.h) / total);
  const out: IRect[] = [];
  let r = { ...rect };
  let row: number[] = [];
  let i = 0;
  while (i < scaled.length) {
    const side = Math.min(r.w, r.h);
    const v = scaled[i];
    if (row.length === 0 || worst(row.concat([v]), side) <= worst(row, side)) {
      row.push(v);
      i += 1;
    } else {
      r = layoutRow(row, r, out);
      row = [];
    }
  }
  if (row.length > 0) layoutRow(row, r, out);
  return out;
}

const GAP = 3;

/** "#rrggbb" + alpha; other color formats are returned as-is */
const withAlpha = (color: string, alpha: string): string =>
  /^#[0-9a-f]{6}$/i.test(color) ? `${color}${alpha}` : color;

export const TreemapChart: React.FC<TreemapChartProps> = ({
  nodes,
  formatValue,
  height = 260,
  maxNodes = 18,
  otherColor,
  selectedKey,
  onSelect,
}) => {
  const [ref, size] = useElementSize<HTMLDivElement>();

  const data = React.useMemo(() => {
    const sorted = nodes
      .filter((n) => n.value > 0)
      .sort((a, b) => b.value - a.value);
    if (sorted.length <= maxNodes) return sorted;
    const head = sorted.slice(0, maxNodes - 1);
    const tail = sorted.slice(maxNodes - 1);
    return head.concat([
      {
        key: TREEMAP_OTHER_KEY,
        label: `Other (${tail.length})`,
        value: sum(tail.map((t) => t.value)),
        color: otherColor,
      },
    ]);
  }, [nodes, maxNodes, otherColor]);

  const total = sum(data.map((d) => d.value));
  const rects = React.useMemo(
    () =>
      squarify(
        data.map((d) => d.value),
        { x: 0, y: 0, w: size.width, h: height },
      ),
    [data, size.width, height],
  );

  return (
    <div ref={ref} className={styles.root} style={{ height }}>
      {size.width > 0 &&
        data.map((d, i) => {
          const r = rects[i];
          if (!r) return null;
          const w = Math.max(0, r.w - GAP);
          const h = Math.max(0, r.h - GAP);
          const showLabel = w > 64 && h > 34;
          const showValue = w > 64 && h > 54;
          const pct = total > 0 ? (d.value / total) * 100 : 0;
          const clickable = !!onSelect;
          return (
            <div
              key={d.key}
              className={`${styles.tile} ${clickable ? styles.clickable : ""} ${
                selectedKey === d.key ? styles.selected : ""
              }`}
              style={{
                left: r.x,
                top: r.y,
                width: w,
                height: h,
                background: `linear-gradient(155deg, ${withAlpha(d.color, "f2")} 0%, ${withAlpha(d.color, "b8")} 100%)`,
              }}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
              title={`${d.label} · ${formatValue(d.value)} · ${pct.toFixed(1)}%`}
              onClick={() => onSelect && onSelect(d.key)}
              onKeyDown={(e) => {
                if (onSelect && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onSelect(d.key);
                }
              }}
            >
              {showLabel && (
                <>
                  <span className={styles.name}>{d.label}</span>
                  {showValue && (
                    <span className={styles.value}>
                      {formatValue(d.value)}
                      <span className={styles.pct}>{pct.toFixed(0)}%</span>
                    </span>
                  )}
                  {showValue && d.sub && h > 74 && (
                    <span className={styles.sub}>{d.sub}</span>
                  )}
                </>
              )}
            </div>
          );
        })}
    </div>
  );
};
