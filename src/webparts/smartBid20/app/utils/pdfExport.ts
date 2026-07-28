/**
 * pdfExport — Rich PDF builder (jsPDF + autotable) with embedded chart images
 * (rasterized from DOM via html2canvas). Libraries are dynamically imported
 * (same pattern as xlsx) to keep them out of the main SPFx chunk.
 */

export interface PdfChartImage {
  title?: string;
  dataUrl: string;
}

export interface PdfTable {
  title?: string;
  head: string[];
  body: (string | number)[][];
}

export interface PdfKpi {
  label: string;
  value: string;
}

export interface BuildPdfArgs {
  title: string;
  subtitle?: string;
  kpis?: PdfKpi[];
  charts?: PdfChartImage[];
  tables?: PdfTable[];
  fileName: string;
  orientation?: "p" | "l";
}

/** Capture a DOM node to a PNG data URL via html2canvas. */
export async function captureElementToPng(
  el: HTMLElement,
  background?: string,
): Promise<string> {
  const mod = await import("html2canvas");
  const html2canvas = (
    mod as { default: (...a: unknown[]) => Promise<HTMLCanvasElement> }
  ).default;
  const canvas = await html2canvas(el, {
    backgroundColor: background || null,
    scale: 2,
    useCORS: true,
    logging: false,
  });
  return canvas.toDataURL("image/png");
}

/** Build and download a PDF report with KPIs, chart images and tables. */
export async function buildReportPdf(args: BuildPdfArgs): Promise<void> {
  const jsPDFmod = await import("jspdf");
  const JsPDFCtor =
    (jsPDFmod as { jsPDF?: unknown; default?: unknown }).jsPDF ||
    (jsPDFmod as { default?: unknown }).default;
  const autoTableMod = await import("jspdf-autotable");
  const autoTable = (autoTableMod as { default: (...a: unknown[]) => void })
    .default;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = new (JsPDFCtor as any)({
    orientation: args.orientation || "p",
    unit: "pt",
    format: "a4",
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = margin;

  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(args.title, margin, y);
  y += 22;

  if (args.subtitle) {
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(args.subtitle, margin, y);
    y += 18;
  }

  if (args.kpis && args.kpis.length > 0) {
    autoTable(doc, {
      startY: y + 6,
      head: [["Indicador", "Valor"]],
      body: args.kpis.map((k) => [k.label, k.value]),
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [30, 41, 59] },
      margin: { left: margin, right: margin },
    });
    y = doc.lastAutoTable.finalY + 18;
  }

  for (const chart of args.charts || []) {
    const imgW = pageW - margin * 2;
    const props = doc.getImageProperties(chart.dataUrl);
    const imgH = (props.height / props.width) * imgW;
    const titleH = chart.title ? 16 : 0;
    if (y + imgH + titleH + 20 > pageH - margin) {
      doc.addPage();
      y = margin;
    }
    if (chart.title) {
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(chart.title, margin, y);
      y += 10;
    }
    doc.addImage(chart.dataUrl, "PNG", margin, y, imgW, imgH);
    y += imgH + 20;
  }

  for (const table of args.tables || []) {
    if (table.title) {
      if (y + 40 > pageH - margin) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(table.title, margin, y);
      y += 6;
    }
    autoTable(doc, {
      startY: y + 4,
      head: [table.head],
      body: table.body,
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [30, 41, 59] },
      margin: { left: margin, right: margin },
    });
    y = doc.lastAutoTable.finalY + 16;
  }

  doc.save(args.fileName);
}
