/**
 * colorThemes.config — Registry of user-selectable color themes.
 * Each theme works in both Light and Dark mode. CSS tokens live in
 * styles/themes/{dark,light}.module.scss (`&[data-color-theme="<id>"]` blocks);
 * the hex values here mirror them for JS consumers (charts, Excel, alpha math).
 */

export type ColorThemeId = "teal";

export interface IColorThemeAccents {
  /** --accent-brand */
  brand: string;
  /** --accent-500 */
  a500: string;
  /** --accent-600 */
  a600: string;
  /** --accent-700 */
  a700: string;
}

export interface IColorThemeDef {
  id: ColorThemeId;
  label: string;
  description: string;
  accents: IColorThemeAccents;
  /** Mirror of --primary-accent per mode. */
  primaryAccent: { dark: string; light: string };
  /** ARGB colors used by the Excel exports. */
  excel: { accent: string; accentDark: string; accentTint: string };
  /** Per-value overrides for semantic colors (phases, sub-statuses, sectors). */
  semanticColors?: {
    phases?: Record<string, string>;
    statuses?: Record<string, string>;
    sectors?: Record<string, string>;
  };
}

export interface IUpcomingColorTheme {
  label: string;
  description: string;
}

export const DEFAULT_COLOR_THEME: ColorThemeId = "teal";

export const COLOR_THEMES: IColorThemeDef[] = [
  {
    id: "teal",
    label: "Teal Theme",
    description: "SmartBid 2.0 with teal accents.",
    accents: {
      brand: "#00c9a7",
      a500: "#14b8a6",
      a600: "#0d9488",
      a700: "#0f766e",
    },
    primaryAccent: { dark: "#00c9a7", light: "#0d9488" },
    excel: {
      accent: "FF0D9488",
      accentDark: "FF0F766E",
      accentTint: "FFE6F6F4",
    },
  },
];

export const UPCOMING_COLOR_THEMES: IUpcomingColorTheme[] = [
  {
    label: "Oceaneering Theme",
    description: "Oceaneering Branding Colors.",
  },
];

export function isColorThemeId(value: unknown): value is ColorThemeId {
  return COLOR_THEMES.some((t) => t.id === value);
}

export function getColorTheme(id?: string): IColorThemeDef {
  return (
    COLOR_THEMES.find((t) => t.id === id) ||
    COLOR_THEMES.find((t) => t.id === DEFAULT_COLOR_THEME) ||
    COLOR_THEMES[0]
  );
}
