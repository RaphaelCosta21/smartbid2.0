import type {
  Border,
  CellValue,
  Font,
  Row,
  Workbook,
  Worksheet,
} from "exceljs";
import { getActiveColorTheme } from "../../hooks/useColorTheme";

/**
 * Excel palette — ARGB mirror of the SmartBid light-theme tokens (CSS variables can't reach
 * a workbook, so this is the single place where the export's colors live). Accent colors
 * follow the user's color theme at export time.
 */
export const XL_COLORS = {
  navy: "FF0F1B2D",
  navySoft: "FF1A2D4A",
  get accent(): string {
    return getActiveColorTheme().excel.accent;
  },
  get accentDark(): string {
    return getActiveColorTheme().excel.accentDark;
  },
  get accentTint(): string {
    return getActiveColorTheme().excel.accentTint;
  },
  white: "FFFFFFFF",
  text: "FF1E293B",
  textSecondary: "FF475569",
  textMuted: "FF64748B",
  bannerSub: "FFCBD5E1",
  border: "FFE2E8F0",
  borderStrong: "FFCBD5E1",
  zebra: "FFF8FAFC",
  band: "FFF1F5F9",
  warningFill: "FFFEF3C7",
  warningText: "FF92400E",
  infoFill: "FFECFEFF",
  infoText: "FF155E75",
  danger: "FFB91C1C",
  link: "FF2563EB",
  purple: "FF7C3AED",
};

export const XL_TAB_COLORS = {
  info: "FF0F1B2D",
  get costSummary(): string {
    return getActiveColorTheme().excel.accent;
  },
  scope: "FF2563EB",
  assets: "FF7C3AED",
  hours: "FF0891B2",
  prepMob: "FFD97706",
  logistics: "FF059669",
  certifications: "FFDB2777",
  suppliers: "FF475569",
};

const FONT = "Calibri";
const ZERO = '"-"';

export const NUM = {
  usd: `"US$ "#,##0.00;[Red]-"US$ "#,##0.00;${ZERO}`,
  brl: `"R$ "#,##0.00;[Red]-"R$ "#,##0.00;${ZERO}`,
  usdPerDay: `"US$ "#,##0.00"/day"`,
  money: `#,##0.00;[Red]-#,##0.00;${ZERO}`,
  int: `#,##0;[Red]-#,##0;${ZERO}`,
  dec: `#,##0.00;[Red]-#,##0.00;${ZERO}`,
  hours: `#,##0.0;[Red]-#,##0.0;${ZERO}`,
  pct: "0.0%",
  pctWhole: '0"%"',
  date: "dd-mmm-yyyy",
  dateTime: "dd-mmm-yyyy hh:mm",
  rate: "#,##0.0000",
};

/** Number format showing the amount with its own currency code (USD/BRL use their symbol). */
export function currencyFmt(code: string): string {
  const cur = (code || "USD").toUpperCase().replace(/[^A-Z]/g, "");
  if (cur === "USD" || !cur) return NUM.usd;
  if (cur === "BRL") return NUM.brl;
  return `"${cur} "#,##0.00;[Red]-"${cur} "#,##0.00;${ZERO}`;
}

export function qtyFmt(v: number): string {
  return Number.isInteger(v || 0) ? NUM.int : NUM.dec;
}

/** Date-only ISO strings stay on their calendar day; timestamps use the local day. */
export function toExcelDate(v?: string | null): Date | null {
  if (!v) return null;
  const s = String(v).trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

/** Excel stores dates as UTC serials; shift so the local wall-clock time is kept. */
export function toExcelDateTime(d: Date): Date {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000);
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "15-Sep-2026", for dates embedded in text cells. */
export function displayDate(v?: string | null): string {
  const d = toExcelDate(v);
  if (!d) return v || "";
  const day = d.getUTCDate();
  return `${day < 10 ? "0" : ""}${day}-${MONTHS[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
}

/** Mix a "#RRGGBB" section color with white. */
export function tint(hex: string | undefined, amount: number): string | null {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  const mix = (c: number): string => {
    const v = Math.round(255 - (255 - c) * amount);
    return (v < 16 ? "0" : "") + v.toString(16).toUpperCase();
  };
  return "FF" + mix((n >> 16) & 255) + mix((n >> 8) & 255) + mix(n & 255);
}

export function solid(hex: string | undefined): string | null {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || "").trim());
  return m ? "FF" + m[1].toUpperCase() : null;
}

// Control chars corrupt the sheet XML; Excel caps a cell at 32,767 chars.
function clean(s: string): string {
  // eslint-disable-next-line no-control-regex
  const out = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  return out.length > 32000 ? out.slice(0, 32000) + "…" : out;
}

export type XlAlign = "left" | "center" | "right";

export interface IXlColumn {
  header: string;
  width: number;
  align?: XlAlign;
  numFmt?: string;
  wrap?: boolean;
}

export interface IXlCell {
  value: CellValue;
  numFmt?: string;
  bold?: boolean;
  italic?: boolean;
  color?: string;
  align?: XlAlign;
  indent?: number;
}

export type XlValue = CellValue | IXlCell | undefined;

/** Keyed column, so rows can be written from a record and optional columns dropped. */
export interface IXlColumnDef extends IXlColumn {
  key: string;
  when?: boolean;
}

export function activeColumns(defs: IXlColumnDef[]): IXlColumnDef[] {
  return defs.filter((d) => d.when !== false);
}

export function pickRow(
  defs: IXlColumnDef[],
  rec: Record<string, XlValue>,
): XlValue[] {
  return defs.map((d) => rec[d.key]);
}

export function colOf(defs: IXlColumnDef[], key: string): number {
  return defs.findIndex((d) => d.key === key) + 1;
}

export interface IXlRowOpts {
  zebra?: boolean;
  bold?: boolean;
  muted?: boolean;
  italic?: boolean;
  fill?: string;
  fontColor?: string;
  /** 1-based column (within the table) that receives `indent` */
  indentCol?: number;
  indent?: number;
}

export interface IXlPlacedValue {
  col: number;
  value: CellValue;
  numFmt?: string;
}

/** A column made of merged sheet columns, for summary tables laid over a wider grid. */
export interface IXlRange extends IXlColumn {
  from: number;
  to: number;
}

export interface IXlKpi {
  label: string;
  value: CellValue;
  numFmt?: string;
  sub?: string;
  from: number;
  to: number;
}

export interface IXlSheetInit {
  name: string;
  tabColor: string;
  widths: number[];
  footerLabel: string;
  notice?: string;
  logoId?: number;
  logoAspect?: number;
  portrait?: boolean;
}

function isXlCell(v: XlValue): v is IXlCell {
  return (
    v !== null &&
    typeof v === "object" &&
    !(v instanceof Date) &&
    Object.prototype.hasOwnProperty.call(v, "value")
  );
}

function thin(argb: string): Partial<Border> {
  return { style: "thin", color: { argb } };
}

/** Cursor-based writer that applies the SmartBid workbook look to one worksheet. */
export class XlSheet {
  public readonly ws: Worksheet;
  public row = 1;
  public readonly lastCol: number;
  private readonly widths: number[];
  private readonly init: IXlSheetInit;

  constructor(wb: Workbook, init: IXlSheetInit) {
    this.init = init;
    this.widths = init.widths;
    this.lastCol = init.widths.length;
    this.ws = wb.addWorksheet(init.name, {
      properties: { tabColor: { argb: init.tabColor } },
      views: [{ showGridLines: false }],
      pageSetup: {
        paperSize: 9,
        orientation: init.portrait ? "portrait" : "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        horizontalCentered: true,
        margins: {
          left: 0.4,
          right: 0.4,
          top: 0.55,
          bottom: 0.6,
          header: 0.3,
          footer: 0.3,
        },
      },
    });
    this.ws.headerFooter.oddFooter = `&L&8${init.footerLabel.replace(/&/g, "&&")}&C&8&A&R&8Page &P of &N`;
    init.widths.forEach((w, i) => {
      this.ws.getColumn(i + 1).width = w;
    });
  }

  private font(opts: {
    size?: number;
    bold?: boolean;
    italic?: boolean;
    color?: string;
  }): Partial<Font> {
    return {
      name: FONT,
      size: opts.size || 10,
      bold: !!opts.bold,
      italic: !!opts.italic,
      color: { argb: opts.color || XL_COLORS.text },
    };
  }

  private fillRange(r: Row, from: number, to: number, argb: string): void {
    for (let c = from; c <= to; c++) {
      r.getCell(c).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb },
      };
    }
  }

  private setValue(r: Row, col: number, value: CellValue | undefined): void {
    const cell = r.getCell(col);
    cell.value =
      typeof value === "string"
        ? clean(value)
        : value === undefined
          ? null
          : value;
  }

  gap(height = 10): void {
    this.ws.getRow(this.row).height = height;
    this.row++;
  }

  /** Navy title banner (rows 1–3) with the OII logo on the right. */
  banner(title: string, subtitle: string): void {
    const last = this.lastCol;
    const r1 = this.ws.getRow(this.row);
    this.fillRange(r1, 1, last, XL_COLORS.navy);
    this.ws.mergeCells(this.row, 1, this.row, last);
    this.setValue(r1, 1, title);
    r1.getCell(1).font = this.font({
      size: 16,
      bold: true,
      color: XL_COLORS.white,
    });
    r1.getCell(1).alignment = {
      vertical: "bottom",
      horizontal: "left",
      indent: 1,
    };
    r1.height = 30;
    this.row++;

    const r2 = this.ws.getRow(this.row);
    this.fillRange(r2, 1, last, XL_COLORS.navy);
    this.ws.mergeCells(this.row, 1, this.row, last);
    this.setValue(r2, 1, subtitle);
    r2.getCell(1).font = this.font({ size: 10, color: XL_COLORS.bannerSub });
    r2.getCell(1).alignment = {
      vertical: "top",
      horizontal: "left",
      indent: 1,
    };
    r2.height = 22;
    this.row++;

    const r3 = this.ws.getRow(this.row);
    this.fillRange(r3, 1, last, XL_COLORS.accent);
    r3.height = 4;
    this.row++;
    this.gap(10);

    if (this.init.notice) this.noticeStrip(this.init.notice);

    if (this.init.logoId !== undefined) this.placeLogo();
  }

  /** Bold red-on-amber strip across the sheet, e.g. the NOT APPROVED stamp. */
  private noticeStrip(text: string): void {
    const last = this.lastCol;
    const r = this.ws.getRow(this.row);
    this.fillRange(r, 1, last, XL_COLORS.warningFill);
    for (let c = 1; c <= last; c++) {
      r.getCell(c).border = {
        top: thin(XL_COLORS.danger),
        bottom: thin(XL_COLORS.danger),
        ...(c === 1 ? { left: thin(XL_COLORS.danger) } : {}),
        ...(c === last ? { right: thin(XL_COLORS.danger) } : {}),
      };
    }
    this.ws.mergeCells(this.row, 1, this.row, last);
    this.setValue(r, 1, text);
    r.getCell(1).font = this.font({
      size: 11,
      bold: true,
      color: XL_COLORS.danger,
    });
    r.getCell(1).alignment = {
      vertical: "middle",
      horizontal: "left",
      wrapText: true,
      indent: 1,
    };
    r.height = Math.max(
      26,
      this.estimateHeight(text, this.spanWidth(1, last), 11) + 6,
    );
    this.row++;
    this.gap(10);
  }

  private placeLogo(): void {
    const heightPx = 34;
    const widthPx = Math.round(heightPx * (this.init.logoAspect || 3.4));
    const pxPerChar = 7;
    const emu = 9525;
    let remaining = widthPx + 16;
    let nativeCol = 0;
    let offPx = 0;
    for (let c = this.lastCol; c >= 1; c--) {
      const px = Math.round(this.widths[c - 1] * pxPerChar);
      if (remaining <= px) {
        nativeCol = c - 1;
        offPx = px - remaining;
        break;
      }
      remaining -= px;
    }
    // Native anchors: ExcelJS' fractional col/row offsets are not pixel-accurate
    this.ws.addImage(
      this.init.logoId as number,
      {
        tl: {
          nativeCol,
          nativeColOff: offPx * emu,
          nativeRow: 0,
          nativeRowOff: 12 * emu,
        },
        ext: { width: widthPx, height: heightPx },
        editAs: "oneCell",
      } as never,
    );
  }

  /** Block title with an accent underline across `span` columns. */
  sectionTitle(text: string, span = this.lastCol, hint?: string): void {
    const r = this.ws.getRow(this.row);
    this.setValue(r, 1, text);
    r.getCell(1).font = this.font({
      size: 12,
      bold: true,
      color: XL_COLORS.navy,
    });
    r.getCell(1).alignment = { vertical: "bottom", horizontal: "left" };
    if (hint) {
      const hc = Math.min(span, Math.max(2, span - 3));
      this.setValue(r, hc, hint);
      r.getCell(hc).font = this.font({
        size: 9,
        italic: true,
        color: XL_COLORS.textMuted,
      });
      r.getCell(hc).alignment = { vertical: "bottom", horizontal: "right" };
      if (hc < span) this.ws.mergeCells(this.row, hc, this.row, span);
    }
    for (let c = 1; c <= span; c++) {
      r.getCell(c).border = {
        bottom: { style: "medium", color: { argb: XL_COLORS.accent } },
      };
    }
    r.height = 22;
    this.row++;
    this.gap(4);
  }

  header(cols: IXlColumn[], startCol = 1, positions?: number[]): number {
    const r = this.ws.getRow(this.row);
    cols.forEach((col, i) => {
      const colNo = positions ? positions[i] : startCol + i;
      const c = r.getCell(colNo);
      this.setValue(r, colNo, col.header);
      c.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: XL_COLORS.navySoft },
      };
      c.font = this.font({ bold: true, color: XL_COLORS.white });
      c.alignment = {
        vertical: "middle",
        horizontal: col.align || "left",
        wrapText: true,
      };
      c.border = {
        bottom: { style: "medium", color: { argb: XL_COLORS.accent } },
      };
    });
    r.height = 28;
    return this.row++;
  }

  dataRow(
    cols: IXlColumn[],
    values: XlValue[],
    opts: IXlRowOpts = {},
    startCol = 1,
    positions?: number[],
  ): Row {
    const r = this.ws.getRow(this.row);
    cols.forEach((col, i) => {
      const raw = values[i];
      const o: Partial<IXlCell> = isXlCell(raw) ? raw : {};
      const value = isXlCell(raw) ? raw.value : raw;
      const colNo = positions ? positions[i] : startCol + i;
      this.setValue(r, colNo, value);
      const cell = r.getCell(colNo);
      const numFmt = o.numFmt || col.numFmt;
      if (numFmt && value !== null && value !== undefined) cell.numFmt = numFmt;
      cell.font = this.font({
        bold: o.bold || opts.bold,
        italic: o.italic || opts.italic,
        color:
          o.color ||
          opts.fontColor ||
          (opts.muted ? XL_COLORS.textMuted : XL_COLORS.text),
      });
      const indent = o.indent || (opts.indentCol === i + 1 ? opts.indent : 0);
      cell.alignment = {
        vertical: "top",
        horizontal:
          o.align ||
          col.align ||
          (typeof value === "number" ? "right" : "left"),
        wrapText: !!col.wrap,
        indent: indent || undefined,
      };
      const fill = opts.fill || (opts.zebra ? XL_COLORS.zebra : "");
      if (fill) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: fill },
        };
      }
      cell.border = { bottom: thin(XL_COLORS.border) };
    });
    this.row++;
    return r;
  }

  /** Header of a summary table whose columns are merged ranges. */
  rangeHeader(ranges: IXlRange[]): number {
    const n = this.header(
      ranges,
      1,
      ranges.map((r) => r.from),
    );
    const row = this.ws.getRow(n);
    ranges.forEach((r) => {
      for (let c = r.from + 1; c <= r.to; c++) {
        row.getCell(c).style = { ...row.getCell(r.from).style };
      }
      if (r.to > r.from) this.ws.mergeCells(n, r.from, n, r.to);
    });
    return n;
  }

  rangeRow(ranges: IXlRange[], values: XlValue[], opts: IXlRowOpts = {}): Row {
    const n = this.row;
    const r = this.dataRow(
      ranges,
      values,
      opts,
      1,
      ranges.map((x) => x.from),
    );
    ranges.forEach((x) => {
      for (let c = x.from + 1; c <= x.to; c++) {
        const cell = r.getCell(c);
        cell.style = { ...r.getCell(x.from).style };
      }
      if (x.to > x.from) this.ws.mergeCells(n, x.from, n, x.to);
    });
    return r;
  }

  /** Group header row inside a table (section, block). */
  band(
    text: string,
    span: number,
    opts: { color?: string; values?: IXlPlacedValue[] } = {},
  ): void {
    const r = this.ws.getRow(this.row);
    const fill = tint(opts.color, 0.14) || XL_COLORS.band;
    const edge = solid(opts.color) || XL_COLORS.accent;
    this.fillRange(r, 1, span, fill);
    for (let c = 1; c <= span; c++) {
      r.getCell(c).border = {
        top: thin(XL_COLORS.borderStrong),
        bottom: thin(XL_COLORS.borderStrong),
        left: c === 1 ? { style: "thick", color: { argb: edge } } : undefined,
      };
    }
    this.setValue(r, 1, text);
    r.getCell(1).font = this.font({ bold: true, color: XL_COLORS.navy });
    r.getCell(1).alignment = { vertical: "middle", horizontal: "left" };
    (opts.values || []).forEach((v) => {
      this.setValue(r, v.col, v.value);
      const c = r.getCell(v.col);
      if (v.numFmt) c.numFmt = v.numFmt;
      c.font = this.font({ bold: true, color: XL_COLORS.navy });
      c.alignment = {
        vertical: "middle",
        horizontal: typeof v.value === "number" ? "right" : "left",
      };
    });
    r.height = 20;
    this.row++;
  }

  total(
    label: string,
    span: number,
    values: IXlPlacedValue[],
    variant: "sub" | "grand" = "sub",
    labelCol = 1,
  ): void {
    const r = this.ws.getRow(this.row);
    const grand = variant === "grand";
    this.fillRange(r, 1, span, grand ? XL_COLORS.accent : XL_COLORS.accentTint);
    const color = grand ? XL_COLORS.white : XL_COLORS.navy;
    for (let c = 1; c <= span; c++) {
      r.getCell(c).border = grand
        ? {}
        : { top: thin(XL_COLORS.accent), bottom: thin(XL_COLORS.accent) };
    }
    this.setValue(r, labelCol, label);
    r.getCell(labelCol).font = this.font({ bold: true, color });
    r.getCell(labelCol).alignment = { vertical: "middle", horizontal: "left" };
    values.forEach((v) => {
      this.setValue(r, v.col, v.value);
      const c = r.getCell(v.col);
      if (v.numFmt) c.numFmt = v.numFmt;
      c.font = this.font({ bold: true, color });
      c.alignment = {
        vertical: "middle",
        horizontal: typeof v.value === "number" ? "right" : "left",
      };
    });
    r.height = grand ? 22 : 19;
    this.row++;
  }

  /** Label / value pair; the value merges across valueCol..valueEnd. */
  keyValue(
    label: string,
    value: CellValue,
    opts: {
      labelCol?: number;
      valueCol?: number;
      valueEnd?: number;
      numFmt?: string;
      bold?: boolean;
      color?: string;
      wrap?: boolean;
    } = {},
  ): void {
    const labelCol = opts.labelCol || 1;
    const valueCol = opts.valueCol || labelCol + 1;
    const valueEnd = opts.valueEnd || valueCol;
    const r = this.ws.getRow(this.row);
    for (let c = labelCol; c <= valueEnd; c++) {
      r.getCell(c).border = { bottom: thin(XL_COLORS.border) };
    }
    this.fillRange(r, labelCol, valueCol - 1, XL_COLORS.band);
    this.setValue(r, labelCol, label);
    r.getCell(labelCol).font = this.font({
      bold: true,
      color: XL_COLORS.textSecondary,
    });
    r.getCell(labelCol).alignment = {
      vertical: "top",
      horizontal: "left",
      indent: 1,
    };
    if (valueEnd > valueCol) {
      this.ws.mergeCells(this.row, valueCol, this.row, valueEnd);
    }
    const isEmpty = value === null || value === undefined || value === "";
    this.setValue(r, valueCol, isEmpty ? "-" : value);
    const vc = r.getCell(valueCol);
    if (opts.numFmt && !isEmpty) vc.numFmt = opts.numFmt;
    vc.font = this.font({
      bold: opts.bold,
      color: isEmpty ? XL_COLORS.textMuted : opts.color || XL_COLORS.text,
    });
    vc.alignment = {
      vertical: "top",
      horizontal: "left",
      wrapText: !!opts.wrap,
      indent: 1,
    };
    if (opts.wrap && typeof value === "string") {
      r.height = this.estimateHeight(value, this.spanWidth(valueCol, valueEnd));
    } else {
      r.height = 18;
    }
    this.row++;
  }

  /** Full-width wrapped note. */
  note(
    text: string,
    span = this.lastCol,
    variant: "info" | "warning" | "muted" = "muted",
  ): void {
    const r = this.ws.getRow(this.row);
    const fill =
      variant === "warning"
        ? XL_COLORS.warningFill
        : variant === "info"
          ? XL_COLORS.infoFill
          : "";
    const color =
      variant === "warning"
        ? XL_COLORS.warningText
        : variant === "info"
          ? XL_COLORS.infoText
          : XL_COLORS.textMuted;
    if (fill) this.fillRange(r, 1, span, fill);
    if (span > 1) this.ws.mergeCells(this.row, 1, this.row, span);
    this.setValue(r, 1, text);
    r.getCell(1).font = this.font({
      size: 9,
      italic: variant === "muted",
      color,
    });
    r.getCell(1).alignment = {
      vertical: "middle",
      horizontal: "left",
      wrapText: true,
      indent: 1,
    };
    r.height = this.estimateHeight(text, this.spanWidth(1, span), 9);
    this.row++;
  }

  /** Two-row KPI tiles (label above, big value below). */
  kpis(items: IXlKpi[]): void {
    const r1 = this.ws.getRow(this.row);
    const r2 = this.ws.getRow(this.row + 1);
    const r3 = this.ws.getRow(this.row + 2);
    const hasSub = items.some((k) => !!k.sub);
    items.forEach((k) => {
      [r1, r2, r3].forEach((r, idx) => {
        if (idx === 2 && !hasSub) return;
        this.fillRange(r, k.from, k.to, XL_COLORS.band);
        r.getCell(k.from).border = {
          left: { style: "thick", color: { argb: XL_COLORS.accent } },
        };
        if (k.to > k.from) this.ws.mergeCells(r.number, k.from, r.number, k.to);
      });
      this.setValue(r1, k.from, k.label.toUpperCase());
      r1.getCell(k.from).font = this.font({
        size: 8,
        bold: true,
        color: XL_COLORS.textMuted,
      });
      r1.getCell(k.from).alignment = {
        vertical: "bottom",
        horizontal: "left",
        indent: 1,
      };
      this.setValue(r2, k.from, k.value);
      if (k.numFmt) r2.getCell(k.from).numFmt = k.numFmt;
      r2.getCell(k.from).font = this.font({
        size: 15,
        bold: true,
        color: XL_COLORS.accentDark,
      });
      r2.getCell(k.from).alignment = {
        vertical: "middle",
        horizontal: "left",
        indent: 1,
      };
      if (hasSub) {
        this.setValue(r3, k.from, k.sub || "");
        r3.getCell(k.from).font = this.font({
          size: 8,
          color: XL_COLORS.textMuted,
        });
        r3.getCell(k.from).alignment = {
          vertical: "top",
          horizontal: "left",
          indent: 1,
        };
      }
    });
    r1.height = 16;
    r2.height = 26;
    if (hasSub) r3.height = 15;
    this.row += hasSub ? 3 : 2;
  }

  freeze(ySplit: number, xSplit = 0): void {
    this.ws.views = [{ state: "frozen", xSplit, ySplit, showGridLines: false }];
  }

  printTitles(headerRow: number): void {
    this.ws.pageSetup.printTitlesRow = `${headerRow}:${headerRow}`;
  }

  private spanWidth(from: number, to: number): number {
    let w = 0;
    for (let c = from; c <= to; c++) w += this.widths[c - 1] || 10;
    return w;
  }

  private estimateHeight(text: string, widthChars: number, size = 10): number {
    const perLine = Math.max(10, widthChars * (size <= 9 ? 1.3 : 1.15));
    let lines = 0;
    String(text || "")
      .split(/\r?\n/)
      .forEach((p) => {
        lines += Math.max(1, Math.ceil(p.length / perLine));
      });
    const lineHeight = size <= 9 ? 12 : 13.5;
    return Math.min(400, Math.max(18, lines * lineHeight + 6));
  }
}
