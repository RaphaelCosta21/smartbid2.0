import { useUIStore } from "../stores/useUIStore";
import {
  IColorThemeDef,
  getColorTheme,
} from "../config/colorThemes.config";

export function useColorTheme(): IColorThemeDef {
  const id = useUIStore((s) => s.colorTheme);
  return getColorTheme(id);
}

/** Non-reactive read for utils (Excel export, static config helpers). */
export function getActiveColorTheme(): IColorThemeDef {
  return getColorTheme(useUIStore.getState().colorTheme);
}

export type SemanticColorKind = "phases" | "statuses" | "sectors";

/** Returns the active theme's override for a semantic color, or `base`. */
export function resolveSemanticColor(
  kind: SemanticColorKind,
  value: string,
  base: string,
): string {
  const map = getActiveColorTheme().semanticColors?.[kind];
  return (map && value && map[value]) || base;
}
