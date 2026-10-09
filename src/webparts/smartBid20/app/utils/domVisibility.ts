export interface IVisibleRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** Part of the element (viewport coords) not clipped by overflow ancestors or the viewport; null when hidden */
export function getVisibleRect(el: HTMLElement): IVisibleRect | null {
  const r = el.getBoundingClientRect();
  let top = r.top;
  let left = r.left;
  let right = r.right;
  let bottom = r.bottom;
  let parent = el.parentElement;
  while (parent && parent !== document.body) {
    const cs = window.getComputedStyle(parent);
    if (cs.overflowX !== "visible" || cs.overflowY !== "visible") {
      const p = parent.getBoundingClientRect();
      top = Math.max(top, p.top);
      left = Math.max(left, p.left);
      right = Math.min(right, p.right);
      bottom = Math.min(bottom, p.bottom);
    }
    parent = parent.parentElement;
  }
  top = Math.max(top, 0);
  left = Math.max(left, 0);
  right = Math.min(right, window.innerWidth);
  bottom = Math.min(bottom, window.innerHeight);
  if (right - left < 2 || bottom - top < 2) return null;
  return { top, left, width: right - left, height: bottom - top };
}
