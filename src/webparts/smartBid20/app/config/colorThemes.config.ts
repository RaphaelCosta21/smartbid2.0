/**
 * colorThemes.config — Registry of user-selectable color themes.
 * Each theme works in both Light and Dark mode. CSS tokens live in
 * styles/themes/{dark,light}.module.scss (`&[data-color-theme="<id>"]` blocks);
 * the hex values here mirror them for JS consumers (charts, Excel, alpha math).
 */

export type ColorThemeId = "teal" | "oceaneering";

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

/** Chart colors a theme replaces on top of the base Light/Dark chart theme. */
export interface IColorThemeChartColors {
  textPrimary?: string;
  textSecondary?: string;
  textMuted?: string;
  grid?: string;
  axis?: string;
  tick?: string;
  cardBg?: string;
  cardBgElevated?: string;
  accentSecondary?: string;
  accentTertiary?: string;
  success?: string;
  warning?: string;
  danger?: string;
  info?: string;
  referenceFill?: string;
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
  /** Chart palette overrides (mirror of the theme's CSS tokens). */
  chart?: {
    categorical?: string[];
    dark?: IColorThemeChartColors;
    light?: IColorThemeChartColors;
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
  {
    id: "oceaneering",
    label: "Oceaneering Theme",
    description: "Oceaneering Branding Colors.",
    accents: {
      brand: "#0097a9",
      a500: "#00a9bc",
      a600: "#007f8f",
      a700: "#006575",
    },
    primaryAccent: { dark: "#0097a9", light: "#007f8f" },
    excel: {
      accent: "FF007F8F",
      accentDark: "FF006575",
      accentTint: "FFE5F4F6",
    },
    chart: {
      categorical: [
        "#0097a9",
        "#ffc72c",
        "#009b77",
        "#dc4405",
        "#5b7f95",
        "#c8102e",
        "#7a99ac",
        "#00c2d1",
        "#f0a500",
        "#4d7d93",
      ],
      dark: {
        textPrimary: "#eaf2f8",
        textSecondary: "#9fb4c4",
        textMuted: "#6b8296",
        grid: "rgba(122, 153, 172, 0.14)",
        axis: "rgba(122, 153, 172, 0.28)",
        tick: "#9fb4c4",
        cardBg: "#002e49",
        cardBgElevated: "#003b5c",
        accentSecondary: "#5b7f95",
        accentTertiary: "#ffc72c",
        success: "#009b77",
        warning: "#dc4405",
        danger: "#c8102e",
        info: "#7a99ac",
        referenceFill: "rgba(122, 153, 172, 0.1)",
      },
      light: {
        textPrimary: "#00263e",
        textSecondary: "#335269",
        textMuted: "#7a99ac",
        grid: "rgba(0, 59, 92, 0.1)",
        axis: "rgba(0, 59, 92, 0.2)",
        tick: "#335269",
        cardBg: "#ffffff",
        cardBgElevated: "#f2f7fa",
        accentSecondary: "#5b7f95",
        accentTertiary: "#b57e00",
        success: "#009b77",
        warning: "#dc4405",
        danger: "#c8102e",
        info: "#5b7f95",
        referenceFill: "rgba(0, 59, 92, 0.06)",
      },
    },
  },
];

export const UPCOMING_COLOR_THEMES: IUpcomingColorTheme[] = [];

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
