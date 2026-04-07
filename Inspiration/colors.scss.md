/**
 * Oceaneering Brand Colors
 * Smart Flow Warehouse - Color Palette
 * Based on Official Oceaneering Brand Guidelines
 */

// ========================================
// PRIMARY COLORS - Official Brand Identity
// ========================================

// PMS 302 C - Logo Blue (Used when text should appear blue)
$oceaneering-logo-blue: #003b5c;
$oceaneering-logo-blue-rgb: rgb(0, 59, 92);

// PMS 2965 C - Main Dark Blue (Main color for equipment/assets)
$oceaneering-dark-blue: #00263e;
$oceaneering-dark-blue-rgb: rgb(0, 38, 62);

// PMS 123 C - Yellow Accent (Use sparingly, illustrations/infographics)
$oceaneering-yellow: #ffc72c;
$oceaneering-yellow-rgb: rgb(255, 196, 37);

// Primary Palette
$primary-color: $oceaneering-logo-blue;
$primary-dark: $oceaneering-dark-blue;
$accent-color: $oceaneering-yellow;

// Aliases for backward compatibility
$primary-blue: $oceaneering-logo-blue;
$primary-blue-dark: $oceaneering-dark-blue;
$accent-yellow: $oceaneering-yellow;

// ========================================
// SECONDARY COLORS - Supporting Palette
// ========================================

// PMS 5415 C - Slate Blue
$oceaneering-slate-blue: #5b7f95;
$oceaneering-slate-blue-rgb: rgb(91, 127, 149);

// PMS 5425 C - Light Slate
$oceaneering-light-slate: #7a99ac;
$oceaneering-light-slate-rgb: rgb(122, 153, 172);

// PMS 7711 C - Teal
$oceaneering-teal: #0097a9;
$oceaneering-teal-rgb: rgb(0, 151, 169);

// Secondary Palette
$secondary-blue: $oceaneering-slate-blue;
$secondary-light: $oceaneering-light-slate;
$secondary-teal: $oceaneering-teal;

// Secondary Aliases
$teal: $oceaneering-teal;
$slate-blue: $oceaneering-slate-blue;
$color-slate: $oceaneering-slate-blue; // Alias for slate color

// ========================================
// TERTIARY COLORS - Complementary
// Use sparingly (less than 10% of palette)
// ========================================

// PMS 3278 C - Emerald Green
$oceaneering-emerald: #009b77;
$oceaneering-emerald-rgb: rgb(0, 155, 119);

// PMS 1665 C - Orange
$oceaneering-orange: #dc4405;
$oceaneering-orange-rgb: rgb(220, 68, 5);

// PMS 186 C - Magenta
$oceaneering-magenta: #c8102e;
$oceaneering-magenta-rgb: rgb(200, 16, 46);

// Tertiary Palette
$tertiary-green: $oceaneering-emerald;
$tertiary-orange: $oceaneering-orange;
$tertiary-red: $oceaneering-magenta;

// Tertiary Aliases
$emerald-green: $oceaneering-emerald;

// ========================================
// GREY SCALE & NEUTRAL COLORS
// ========================================

// Official Grey for Body Text
$grey-body-print: #4d4d4f; // For printed materials
$grey-body-digital: #666666; // For digital materials
$grey-medium: #808080;
$grey-light: #d1d3d4;
$grey-lighter: #e8e8e8;
$grey-lightest: #f5f5f5;

// Black & White
$black: #000000;
$white: #ffffff;

// Text Colors
$text-primary: $grey-body-digital;
$text-secondary: $grey-medium;
$text-light: $white;
$text-dark: $grey-body-print;
$text-muted: #999999;

// Neutral aliases
$neutral-light: $grey-light;
$neutral-lighter: $grey-lighter;
$neutral-lightest: $grey-lightest;
$neutral-dark: $grey-body-digital;

// ========================================
// FUNCTIONAL COLORS - Status & Actions
// ========================================

// Success States
$success: $oceaneering-emerald;
$success-light: lighten($success, 45%);
$success-dark: darken($success, 10%);

// Warning States
$warning: $oceaneering-yellow;
$warning-light: lighten($warning, 35%);
$warning-dark: darken($warning, 15%);

// Error/Danger States
$danger: $oceaneering-magenta;
$danger-light: lighten($danger, 45%);
$danger-dark: darken($danger, 10%);

// Info States
$info: $oceaneering-teal;
$info-light: lighten($info, 45%);
$info-dark: darken($info, 10%);

// Pending/In Progress
$pending: $oceaneering-orange;
$pending-light: lighten($pending, 40%);
$pending-dark: darken($pending, 10%);

// Status Aliases
$status-warning: $warning;
$status-info: $info;

// ========================================
// BACKGROUND COLORS
// ========================================

$background-color: $white; // Default background color
$bg-primary: $white;
$bg-secondary: $grey-lightest;
$bg-tertiary: $grey-lighter;
$bg-dark: $oceaneering-dark-blue;
$bg-card: $white;
$bg-hover: rgba($oceaneering-logo-blue, 0.05);
$bg-selected: rgba($oceaneering-logo-blue, 0.1);

// ========================================
// BORDER COLORS
// ========================================

$border-color: $grey-light; // Default border color
$border-light: $grey-lighter;
$border-medium: $grey-light;
$border-dark: $grey-medium;
$border-primary: $oceaneering-logo-blue;

// ========================================
// GRADIENT COLORS
// ========================================

$gradient-primary: linear-gradient(
  135deg,
  $oceaneering-dark-blue 0%,
  $oceaneering-logo-blue 100%
);
$gradient-secondary: linear-gradient(
  135deg,
  $oceaneering-slate-blue 0%,
  $oceaneering-teal 100%
);
$gradient-accent: linear-gradient(
  135deg,
  $oceaneering-yellow 0%,
  darken($oceaneering-yellow, 15%) 100%
);

// Header Gradient (Dark Blue Background)
$gradient-header: linear-gradient(
  180deg,
  $oceaneering-dark-blue 0%,
  darken($oceaneering-dark-blue, 5%) 100%
);

// ========================================
// SHADOW COLORS
// ========================================

$shadow-sm: rgba($black, 0.05);
$shadow-md: rgba($black, 0.1);
$shadow-lg: rgba($black, 0.15);
$shadow-xl: rgba($black, 0.2);

// Card shadows
$card-shadow: 0 2px 8px $shadow-md;
$card-shadow-hover: 0 4px 16px $shadow-lg;

// ========================================
// OPACITY VARIANTS
// ========================================

$opacity-10: 0.1;
$opacity-20: 0.2;
$opacity-30: 0.3;
$opacity-40: 0.4;
$opacity-50: 0.5;
$opacity-60: 0.6;
$opacity-70: 0.7;
$opacity-80: 0.8;
$opacity-90: 0.9;

// ========================================
// ORDER STATUS COLORS
// ========================================

$status-new: $info;
$status-in-separation: $pending;
$status-ready: $oceaneering-teal;
$status-in-transit: $oceaneering-slate-blue;
$status-delivered: $success;
$status-cancelled: $grey-medium;
$status-failed: $danger;

// Status aliases
$status-orders-in-separation: $status-in-separation;
$status-success: $success;
$status-error: $danger;

// Specific status colors for Smart Flow workflow
$status-open: #8a8886;
$status-open-bg: rgba(#8a8886, 0.1);
$status-in-progress: $oceaneering-yellow;
$status-in-progress-bg: rgba($oceaneering-yellow, 0.1);
$status-released-for-delivery: $oceaneering-teal;
$status-released-bg: rgba($oceaneering-teal, 0.1);
$status-delivered-bg: rgba($tertiary-green, 0.1);
$status-on-hold: $tertiary-orange;
$status-on-hold-bg: rgba($tertiary-orange, 0.1);
$status-canceled: #605e5c;
$status-canceled-bg: rgba(#605e5c, 0.1);
$status-rework: $tertiary-red;
$status-rework-bg: rgba($tertiary-red, 0.1);

// ========================================
// PRIORITY COLORS
// ========================================

$priority-low: $secondary-blue;
$priority-low-bg: rgba($secondary-blue, 0.1);
$priority-low-border: rgba($secondary-blue, 0.3);

$priority-medium: $oceaneering-yellow;
$priority-medium-bg: rgba($oceaneering-yellow, 0.1);
$priority-medium-border: rgba($oceaneering-yellow, 0.3);
$priority-medium-text: darken($oceaneering-yellow, 20%);

$priority-high: $tertiary-red;
$priority-high-bg: rgba($tertiary-red, 0.1);
$priority-high-border: rgba($tertiary-red, 0.3);

$priority-normal: $info;
$priority-urgent: $danger;

// ========================================
// CHART COLORS
// ========================================

$chart-colors: (
  1: $oceaneering-logo-blue,
  2: $oceaneering-teal,
  3: $oceaneering-yellow,
  4: $oceaneering-slate-blue,
  5: $oceaneering-emerald,
  6: $oceaneering-light-slate,
  7: $oceaneering-orange,
  8: $oceaneering-magenta,
);

// ========================================
// DEPARTMENT COLORS (Examples)
// ========================================

$dept-logistics: $oceaneering-logo-blue;
$dept-maintenance: $oceaneering-teal;
$dept-operations: $oceaneering-slate-blue;
$dept-engineering: $oceaneering-emerald;
$dept-safety: $oceaneering-orange;
$dept-quality: $oceaneering-magenta;

// ========================================
// ACCESSIBILITY
// ========================================

// Focus states for keyboard navigation
$focus-outline: 2px solid $oceaneering-yellow;
$focus-shadow: 0 0 0 3px rgba($oceaneering-yellow, 0.3);

// Link colors
$link-color: $oceaneering-logo-blue;
$link-hover: $oceaneering-dark-blue;
$link-visited: darken($oceaneering-logo-blue, 15%);
$link-active: $oceaneering-teal;

// ========================================
// COLOR ALIASES (for consistency across components)
// ========================================

// Primary color aliases
$color-primary: $primary-color;
$color-primary-dark: $primary-dark;
$color-accent: $accent-color;

// Basic colors
$color-white: $white;
$color-black: $black;

// Status color aliases
$color-success: $success;
$color-error: $danger;
$color-danger: $danger;
$color-warning: $warning;
$color-info: $info;
$color-pending: $pending;

// Background aliases
$color-background: $bg-primary;
$color-background-secondary: $bg-secondary;
$color-background-dark: $bg-dark;

// Text aliases
$color-text-primary: $text-primary;
$color-text-secondary: $text-secondary;
$color-text-light: $text-light;

// Border aliases
$color-border: $border-medium;
$color-border-light: $border-light;
$color-border-dark: $border-dark;

// Common overlay colors with transparency
$color-overlay-dark: rgba($black, 0.5);
$color-overlay-light: rgba($white, 0.2);
$color-overlay-darker: rgba($black, 0.7);
$color-overlay-subtle: rgba($black, 0.1);

// Additional helper overlays for status colors
$color-success-bg: rgba($success, 0.1);
$color-error-bg: rgba($danger, 0.1);
$color-warning-bg: rgba($warning, 0.1);
$color-info-bg: rgba($info, 0.1);
$color-primary-bg: rgba($primary-color, 0.05);

// ========================================
// INTERACTIVE STATES (Hover, Disabled, etc.)
// ========================================

// Primary color interactive states
$color-primary-light: rgba(
  $primary-color,
  0.1
); // Light background for hover on primary
$color-primary-hover: darken(
  $primary-color,
  5%
); // Hover state for primary buttons
$color-primary-active: darken($primary-color, 10%); // Active/pressed state

// Text disabled state
$color-text-disabled: $grey-medium; // Disabled text color
$color-text-muted: $text-muted; // Muted/subtle text

// Success states
$color-success-light: $success-light;
$color-success-dark: $success-dark;

// Warning states
$color-warning-light: $warning-light;
$color-warning-dark: $warning-dark;

// Error states
$color-error-light: $danger-light;
$color-error-dark: $danger-dark;

// Info states
$color-info-light: $info-light;
$color-info-dark: $info-dark;

// Neutral states
$color-neutral-light: $neutral-light;
$color-neutral-lighter: $neutral-lighter;
$color-neutral-lightest: $neutral-lightest;
$color-neutral-dark: $neutral-dark;

// ========================================
// MICROSOFT FLUENT UI COLORS
// ========================================
// Colors from Microsoft Fluent UI Design System for SharePoint/Office consistency
// Reference: https://developer.microsoft.com/en-us/fluentui

// Fluent UI Primary Blues
$fluent-blue: #0078d4; // Fluent Primary Blue (themePrimary)
$fluent-blue-dark: #106ebe; // Fluent Blue Dark (themeDarker)
$fluent-blue-light: #00bcf2; // Fluent Blue Light/Cyan

// Fluent UI Neutrals (Grays) - Text & UI Elements
$fluent-neutral-primary: #323130; // neutralPrimary - Primary text
$fluent-neutral-secondary: #605e5c; // neutralSecondary - Secondary text
$fluent-neutral-tertiary: #8a8886; // neutralTertiary - Disabled text
$fluent-neutral-quaternary: #a19f9d; // neutralQuaternary - Disabled background
$fluent-neutral-quinary: #c8c6c4; // neutralLight - Border/divider
$fluent-neutral-senary: #d2d0ce; // neutralLighter - Subtle background

// Fluent UI Borders & Dividers
$fluent-border-light: #edebe9; // neutralLighterAlt - Light border
$fluent-border-lighter: #f3f2f1; // neutralQuaternaryAlt - Lighter border

// Fluent UI Backgrounds
$fluent-background-lighter: #f3f2f1; // Lighter background for panels/sections
$fluent-bg-hover: #f3f2f1; // neutralQuaternaryAlt - Hover state background
$fluent-bg-light: #faf9f8; // neutralLighter - Light background
$fluent-bg-white: #ffffff; // white - Card/panel background

// Fluent UI Semantic Colors
$fluent-error: #d13438; // Error red (errorText)
$fluent-error-bg: #fef6f6; // Error background light
$fluent-warning-bg: #fff4ce; // Warning background light
$fluent-success: #107c10; // Success green

// Fluent UI Aliases for consistency with existing code
$color-fluent-primary: $fluent-blue;
$color-fluent-blue: $fluent-blue;
$color-fluent-blue-dark: $fluent-blue-dark;
$color-fluent-blue-light: $fluent-blue-light;

$color-neutral-primary: $fluent-neutral-primary;
$color-neutral-secondary: $fluent-neutral-secondary;
$color-neutral-tertiary: $fluent-neutral-tertiary;
$color-neutral-quaternary: $fluent-neutral-quaternary;
$color-neutral-quinary: $fluent-neutral-quinary;
$color-neutral-senary: $fluent-neutral-senary;

$color-background-hover: $fluent-bg-hover;
$color-background-light: $fluent-bg-light;
$color-bg-fluent-white: $fluent-bg-white;

$color-border-fluent-light: $fluent-border-light;
$color-border-fluent-lighter: $fluent-border-lighter;

$color-fluent-error: $fluent-error;
$color-error-background: $fluent-error-bg;
$color-warning-background: $fluent-warning-bg;
$color-fluent-success: $fluent-success;

// ========================================
// EXPORT FOR TYPESCRIPT
// ========================================

:export {
  // Primary
  primaryColor: $primary-color;
  primaryDark: $primary-dark;
  accentColor: $accent-color;

  // Secondary
  secondaryBlue: $secondary-blue;
  secondaryLight: $secondary-light;
  secondaryTeal: $secondary-teal;

  // Tertiary
  tertiaryGreen: $tertiary-green;
  tertiaryOrange: $tertiary-orange;
  tertiaryRed: $tertiary-red;

  // Status
  success: $success;
  warning: $warning;
  danger: $danger;
  info: $info;
  pending: $pending;

  // Text
  textPrimary: $text-primary;
  textSecondary: $text-secondary;
  textLight: $text-light;

  // Background
  bgPrimary: $bg-primary;
  bgSecondary: $bg-secondary;
  bgDark: $bg-dark;

  // Microsoft Fluent UI Colors
  fluentBlue: $fluent-blue;
  fluentBlueDark: $fluent-blue-dark;
  fluentBlueLight: $fluent-blue-light;
  fluentNeutralPrimary: $fluent-neutral-primary;
  fluentNeutralSecondary: $fluent-neutral-secondary;
  fluentNeutralTertiary: $fluent-neutral-tertiary;
  fluentNeutralQuaternary: $fluent-neutral-quaternary;
  fluentBgHover: $fluent-bg-hover;
  fluentBgLight: $fluent-bg-light;
  fluentBorderLight: $fluent-border-light;
  fluentError: $fluent-error;
  fluentErrorBg: $fluent-error-bg;
  fluentWarningBg: $fluent-warning-bg;
  fluentSuccess: $fluent-success;
}
