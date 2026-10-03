import { IScopeItem, IScopeSubItem } from "../../../models";
import { IBidExcelContext, newSheet } from "../context";
import {
  NUM,
  XL_COLORS,
  activeColumns,
  colOf,
  pickRow,
  qtyFmt,
} from "../excelStyles";
import { groupBySection } from "../rows";

const yesNo = (v: boolean | undefined): string => (v ? "Yes" : "");

export function buildScopeSheet(ctx: IBidExcelContext): void {
  const { bid, opts } = ctx;
  const scope = bid.scopeItems || [];
  const dataItems = scope.filter((i) => !i.isSection);
  const cols = activeColumns([
    { key: "no", header: "#", width: 6, align: "center" },
    {
      key: "div",
      header: "Division",
      width: 10,
      align: "center",
      when: ctx.view.isIntegrated,
    },
    { key: "docRef", header: "Client Doc Ref", width: 15, wrap: true },
    { key: "desc", header: "Item Description", width: 42, wrap: true },
    { key: "compliance", header: "Compliance", width: 11, align: "center" },
    { key: "resType", header: "Resource Type", width: 17, wrap: true },
    { key: "subType", header: "Sub-Type", width: 17, wrap: true },
    { key: "offer", header: "Equipment Offer", width: 34, wrap: true },
    { key: "pn", header: "OII/MFG PN", width: 18, wrap: true },
    {
      key: "qtyOp",
      header: "Qty Op",
      width: 8,
      align: "right",
      numFmt: NUM.int,
    },
    {
      key: "qtySp",
      header: "Qty Spare",
      width: 9,
      align: "right",
      numFmt: NUM.int,
    },
    { key: "cert", header: "Cert?", width: 7, align: "center" },
    { key: "eng", header: "Eng?", width: 7, align: "center" },
    {
      key: "comments",
      header: "Comments",
      width: 36,
      wrap: true,
      when: opts.includeNotes,
    },
  ]);
  const x = newSheet(
    ctx,
    "scope",
    cols.map((c) => c.width),
  );
  const span = x.lastCol;

  x.banner("SCOPE OF SUPPLY", ctx.subtitle);
  let subCount = 0;
  let pcfCount = 0;
  dataItems.forEach((i) => {
    subCount += (i.subItems || []).length;
    pcfCount += (i.pcfItems || []).length;
  });

  if (dataItems.length === 0) {
    x.note("No scope items registered on this BID.", span, "muted");
    return;
  }

  const headerRow = x.header(cols);
  x.freeze(headerRow);
  x.printTitles(headerRow);

  const writeChild = (
    parent: IScopeItem,
    child: IScopeSubItem,
    label: string,
    no: string,
  ): void => {
    x.dataRow(
      cols,
      pickRow(cols, {
        no,
        div: parent.integratedDivision || "",
        desc: child.description,
        resType: { value: label, italic: true, color: XL_COLORS.textMuted },
        subType: child.subType,
        offer: child.equipmentOffer,
        pn: child.partNumber,
        qtyOp: { value: child.qty || 0, numFmt: qtyFmt(child.qty) },
        eng: yesNo(child.needsEngineering),
        comments: child.comments,
      }),
      { muted: true, indentCol: colOf(cols, "desc"), indent: 2 },
    );
  };

  let zebra = false;
  groupBySection(scope, dataItems, (i) => i.sectionId).forEach((g) => {
    if (g.section) {
      x.band(
        `${g.section.sectionTitle || "Untitled Section"}   ·   ${g.items.length} items`,
        span,
        { color: g.section.sectionColor },
      );
      zebra = false;
    }
    g.items.forEach((item) => {
      x.dataRow(
        cols,
        pickRow(cols, {
          no: item.lineNumber || null,
          div: item.integratedDivision || "",
          docRef: item.clientDocRef,
          desc: item.description,
          compliance:
            item.compliance === "yes"
              ? { value: "Yes", color: XL_COLORS.tealDark, bold: true }
              : item.compliance === "no"
                ? { value: "No", color: XL_COLORS.danger, bold: true }
                : "-",
          resType: item.resourceType,
          subType: item.resourceSubType,
          offer: { value: item.equipmentOffer, bold: true },
          pn: item.partNumber,
          qtyOp: {
            value: item.qtyOperational || 0,
            numFmt: qtyFmt(item.qtyOperational),
          },
          qtySp: { value: item.qtySpare || 0, numFmt: qtyFmt(item.qtySpare) },
          cert: yesNo(item.needsCertification),
          eng: yesNo(item.needsEngineering),
          comments: item.comments,
        }),
        { zebra },
      );
      zebra = !zebra;
      (item.subItems || []).forEach((sub, k) =>
        writeChild(item, sub, "Sub-item", `${item.lineNumber}.${k + 1}`),
      );
      (item.pcfItems || []).forEach((pcf, k) =>
        writeChild(item, pcf, "PCF item", `${item.lineNumber}.P${k + 1}`),
      );
    });
  });
  x.total(
    `${dataItems.length} scope items · ${subCount} sub-items · ${pcfCount} PCF items`,
    span,
    [],
    "sub",
  );
  x.gap(6);
  x.note(
    "Sub-items and PCF items are listed right below their parent item (indented, numbered as item.n / item.Pn).",
    span,
    "muted",
  );
}
