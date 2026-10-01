/**
 * pastBidDocument — Builds the Markdown knowledge document of a completed BID
 * (smartBidDocs/Past Bids) and the library metadata that AI Search indexes.
 *
 * Layout rules (they matter for retrieval — see azure-ai-backend/function-app/document_structure.py):
 *  - Only ATX headings (#, ##, ###) open sections; the H1 carries BID, client and year
 *    so it is repeated at the top of every chunk.
 *  - One self-contained "record line" per item (no Markdown tables): each line names
 *    what it is about, so it still makes sense when read alone.
 *  - One paragraph per scope item / cost line — chunk boundaries fall between them.
 */
import {
  IBid,
  IBidKnowledgeProfile,
  IHoursItem,
  IPersonRef,
  IScopeItem,
  IScopeSubItem,
  ISubItemCost,
} from "../models";
import { IDocLibraryMetadata } from "../models/IDocLibraryItem";
import {
  buildCostSummary,
  getAssetCostBreakdown,
  getBidFx,
} from "./costCalculations";
import { formatDate } from "./formatters";

export const PAST_BID_DOC_TYPE = "Past Bid";
export const PAST_BID_FILE_EXTENSION = ".md";

const MAX_DOC_CHARS = 350000;
const AI_DIGEST_MAX_CHARS = 60000;
const TEXT_COLUMN_MAX = 255;

type ProfileFields = Pick<
  IBidKnowledgeProfile,
  "scopeCategories" | "tags" | "summary"
>;

/* ───────────────────────────── primitives ───────────────────────────── */

function clean(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

/** Rich-text fields (notes, overview) may hold HTML from the editor. */
function richText(value: string | null | undefined): string {
  if (!value) return "";
  let text = String(value);
  if (/<[a-z][\s\S]*>/i.test(text)) {
    const withBreaks = text
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n- ")
      .replace(/<\/(p|div|li|h[1-6]|tr|ul|ol|blockquote)>/gi, "\n");
    const doc = new DOMParser().parseFromString(withBreaks, "text/html");
    text = doc.body.textContent || "";
  }
  // A body line starting with "#" would be read as a heading by the chunker.
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^(\s*)#+\s*/, "$1").replace(/\s+$/, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** The chunker ignores headings that end with punctuation. */
function heading(level: number, text: string): string {
  const title = clean(text).replace(/[.,;:?!]+$/, "") || "Untitled";
  return `${"#".repeat(level)} ${title}`;
}

function day(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = formatDate(iso, "yyyy-MM-dd");
  return d === "—" ? "" : d;
}

function money(value: number | null | undefined, currency: string): string {
  if (value === null || value === undefined || isNaN(Number(value))) return "";
  const amount = Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${(currency || "USD").toUpperCase()} ${amount}`;
}

function amount(value: number | null | undefined, currency: string): string {
  return value ? money(value, currency) : "";
}

function names(list: IPersonRef[] | null | undefined): string {
  return (list || [])
    .map((p) => (p && (p.name || p.email)) || "")
    .filter(Boolean)
    .join(", ");
}

/** "- lead | Label: value | …" — empty values are dropped. */
function record(lead: string, fields: Array<[string, unknown]>): string {
  const parts = fields
    .map(([label, v]) => {
      const t = clean(v);
      return t ? `${label}: ${t}` : "";
    })
    .filter(Boolean);
  const head = clean(lead);
  const all = head ? [head].concat(parts) : parts;
  return all.length ? `- ${all.join(" | ")}` : "";
}

function lines(list: string[]): string {
  return list.filter(Boolean).join("\n");
}

/** Case-insensitive de-duplication that keeps the first spelling. */
export function mergeUnique(...lists: string[][]): string[] {
  const seen: Record<string, boolean> = {};
  const out: string[] = [];
  lists.forEach((list) =>
    (list || []).forEach((raw) => {
      const v = clean(raw);
      const key = v.toLowerCase();
      if (!v || seen[key]) return;
      seen[key] = true;
      out.push(v);
    }),
  );
  return out;
}

/* ───────────────────────────── BID helpers ───────────────────────────── */

export function getPastBidYear(bid: IBid): string {
  const iso = bid.completedDate || bid.createdDate;
  const d = iso ? new Date(iso) : null;
  return d && !isNaN(d.getTime()) ? String(d.getFullYear()) : "";
}

function currentRevisionLetter(bid: IBid): string {
  const revs = bid.revisions || [];
  return revs.length ? revs[revs.length - 1].revisionLetter || "" : "";
}

function scopeLines(bid: IBid): IScopeItem[] {
  return (bid.scopeItems || [])
    .filter((i) => !i.isSection)
    .sort((a, b) => (a.lineNumber || 0) - (b.lineNumber || 0));
}

/** Resource sub-types of the scope — the deterministic baseline of a BID's tags. */
export function derivePastBidTags(bid: IBid): string[] {
  return mergeUnique(scopeLines(bid).map((i) => i.resourceSubType || ""));
}

export function buildPastBidFileName(bidNumber: string): string {
  const safe = clean(bidNumber)
    .replace(/[\\/:*?"<>|#%~&{}]/g, "-")
    .replace(/^[.\s]+|[.\s]+$/g, "");
  return `${safe || "bid"}${PAST_BID_FILE_EXTENSION}`;
}

function lineLabel(item: IScopeItem | undefined): string {
  if (!item) return "";
  return `line ${item.lineNumber}: ${clean(item.description) || clean(item.equipmentOffer)}`;
}

/* ───────────────────────────── sections ───────────────────────────── */

function identification(bid: IBid, num: number): string[] {
  const opp = bid.opportunityInfo || ({} as IBid["opportunityInfo"]);
  const ernNumbers =
    bid.ernLinks && bid.ernLinks.length
      ? bid.ernLinks.map((l) => l.ernNumber).join(", ")
      : bid.ernNumber || "";
  return [
    heading(2, `${num} Identification`),
    lines([
      record("", [
        ["BID number", bid.bidNumber],
        ["CRM", bid.crmNumber],
        ["Revision", currentRevisionLetter(bid)],
      ]),
      record("", [
        ["Client", opp.client],
        ["Client contact", opp.clientContact],
      ]),
      record("", [["Project", opp.projectName]]),
      record("", [
        ["Division", bid.division],
        ["Service line", bid.serviceLine],
        ["BID type", bid.bidType],
        ["BID size", bid.bidSize],
        ["Priority", bid.priority],
      ]),
      record("", [
        ["Region", opp.region],
        ["Field", opp.field],
        ["Vessel", opp.vessel],
        [
          "Water depth",
          opp.waterDepth ? `${opp.waterDepth} ${opp.waterDepthUnit || ""}` : "",
        ],
      ]),
      record("", [
        ["Operation start", day(opp.operationStartDate)],
        [
          "Duration",
          opp.totalDuration
            ? `${opp.totalDuration} ${opp.totalDurationUnit || ""}`
            : "",
        ],
      ]),
      record("", [
        ["Created", day(bid.createdDate)],
        ["Started", day(bid.startDate)],
        ["Completed", day(bid.completedDate)],
        ["Due", day(bid.desiredDueDate || bid.dueDate)],
      ]),
      record("", [
        ["Engineer responsible", names(bid.engineerResponsible)],
        ["Analyst", names(bid.analyst)],
        ["Project manager", names(bid.projectManager)],
        [
          "Commercial requester",
          bid.commercialRequester ? bid.commercialRequester.name : "",
        ],
        ["Reviewers", names(bid.reviewers)],
      ]),
      record("", [
        ["Template used", bid.templateUsed],
        ["ERN", ernNumbers],
      ]),
    ]),
  ];
}

function classification(
  bid: IBid,
  profile: ProfileFields | null,
  num: number,
): string[] {
  const families: Record<string, string[]> = {};
  const order: string[] = [];
  scopeLines(bid).forEach((i) => {
    const type = clean(i.resourceType);
    if (!type) return;
    if (!families[type]) {
      families[type] = [];
      order.push(type);
    }
    const sub = clean(i.resourceSubType);
    if (sub && families[type].indexOf(sub) < 0) families[type].push(sub);
  });
  const familyText = order
    .map((t) => (families[t].length ? `${t} (${families[t].join(", ")})` : t))
    .join("; ");
  const divisions = mergeUnique(
    scopeLines(bid).map((i) => i.integratedDivision || ""),
  );
  const body = lines([
    profile
      ? record("", [["Scope categories", profile.scopeCategories.join(", ")]])
      : "",
    profile ? record("", [["Tags", profile.tags.join(", ")]]) : "",
    record("", [["Equipment families", familyText]]),
    record("", [["Integrated divisions", divisions.join(", ")]]),
  ]);
  return body ? [heading(2, `${num} Classification`), body] : [];
}

function description(bid: IBid, num: number): string[] {
  const blocks: string[] = [];
  let n = 0;
  const add = (title: string, text: string): void => {
    if (!text) return;
    n++;
    blocks.push(heading(3, `${num}.${n} ${title}`), text);
  };
  add("Project Description", richText(bid.opportunityInfo?.projectDescription));
  add("Engineer BID Overview", richText(bid.engineerBidOverview));
  const notes = bid.bidNotes || {};
  Object.keys(notes).forEach((key) =>
    add(`BID Notes ${key}`, richText(notes[key])),
  );
  return blocks.length ? [heading(2, `${num} Description`)].concat(blocks) : [];
}

function subItemLine(kind: string, owner: IScopeItem, s: IScopeSubItem): string {
  return record(
    `${kind} of line ${owner.lineNumber}: ${clean(s.description)}`,
    [
      ["Type", s.subType],
      ["Offer", s.equipmentOffer],
      ["PN", s.partNumber],
      ["Qty", s.qty || ""],
      ["Comments", s.comments],
    ],
  );
}

function scopeItemBlock(item: IScopeItem): string {
  const flags: string[] = [];
  if (item.needsCertification) flags.push("certification required");
  if (item.needsEngineering) flags.push("engineering required");
  return lines(
    [
      record(`Line ${item.lineNumber}: ${clean(item.description)}`, [
        ["Offer", item.equipmentOffer],
        ["PN", item.partNumber],
        [
          "Resource",
          [clean(item.resourceType), clean(item.resourceSubType)]
            .filter(Boolean)
            .join(" / "),
        ],
        [
          "Qty",
          `${item.qtyOperational || 0} operational + ${item.qtySpare || 0} spare`,
        ],
        [
          "Compliance",
          item.compliance === "yes"
            ? "compliant"
            : item.compliance === "no"
              ? "non-compliant"
              : "",
        ],
        ["Client ref", item.clientDocRef],
        ["Division", item.integratedDivision],
        ["Flags", flags.join(", ")],
        ["Comments", item.comments],
      ]),
      item.clientRequirement
        ? record(`Client requirement for line ${item.lineNumber}`, [
            ["Text", item.clientRequirement],
          ])
        : "",
    ]
      .concat(
        (item.clientSpecs || []).map((spec) =>
          record(`Client spec for line ${item.lineNumber}`, [["Text", spec]]),
        ),
      )
      .concat((item.subItems || []).map((s) => subItemLine("Sub-item", item, s)))
      .concat(
        (item.pcfItems || []).map((s) => subItemLine("PCF item", item, s)),
      ),
  );
}

function scopeOfSupply(bid: IBid, num: number): string[] {
  const all = (bid.scopeItems || [])
    .slice()
    .sort((a, b) => (a.lineNumber || 0) - (b.lineNumber || 0));
  const sections = all.filter((i) => i.isSection);
  const sectionIds: Record<string, boolean> = {};
  sections.forEach((s) => (sectionIds[s.id] = true));
  const bySection: Record<string, IScopeItem[]> = {};
  const unsectioned: IScopeItem[] = [];
  all
    .filter((i) => !i.isSection)
    .forEach((i) => {
      if (i.sectionId && sectionIds[i.sectionId]) {
        if (!bySection[i.sectionId]) bySection[i.sectionId] = [];
        bySection[i.sectionId].push(i);
      } else {
        unsectioned.push(i);
      }
    });
  const count = all.length - sections.length;
  if (count === 0) return [];

  const blocks: string[] = [
    heading(2, `${num} Scope of Supply`),
    record("", [
      ["Scope lines", count],
      ["Sections", sections.length],
    ]),
  ];
  let n = 0;
  const addGroup = (title: string, items: IScopeItem[]): void => {
    if (!items.length) return;
    n++;
    blocks.push(heading(3, `${num}.${n} ${title}`));
    items.forEach((i) => blocks.push(scopeItemBlock(i)));
  };
  addGroup("General scope", unsectioned);
  sections.forEach((s) => addGroup(s.sectionTitle || "Section", bySection[s.id] || []));
  return blocks;
}

function pricing(bid: IBid, num: number): string[] {
  const fx = getBidFx(bid);
  const scopeById: Record<string, IScopeItem> = {};
  (bid.scopeItems || []).forEach((i) => (scopeById[i.id] = i));
  const blocks: string[] = [
    heading(2, `${num} Pricing and Quotations`),
    record("", [
      ["BID currency", bid.opportunityInfo?.currency],
      ["BRL per USD", fx.brlRate ? fx.brlRate.toFixed(4) : ""],
      ["Rates captured", day(fx.capturedDate)],
      [
        "Contingency per year",
        bid.assetsContingencyPerYear ? `${bid.assetsContingencyPerYear}%` : "",
      ],
    ]),
  ];
  let n = 0;
  const section = (title: string, items: string[]): void => {
    const body = items.filter(Boolean);
    if (!body.length) return;
    n++;
    blocks.push(heading(3, `${num}.${n} ${title}`));
    body.forEach((b) => blocks.push(b));
  };

  section(
    "Assets",
    (bid.assetBreakdown || []).map((a) => {
      const scope = scopeById[a.scopeItemId];
      if (scope && scope.isSection) return "";
      const bd = getAssetCostBreakdown(a, scope);
      const qty = scope ? (scope.qtyOperational || 0) + (scope.qtySpare || 0) : 0;
      const owner = scope ? `line ${scope.lineNumber}` : "unlinked asset";
      const main = record(
        scope ? `Asset ${lineLabel(scope)}` : "Asset (not linked to a scope line)",
        [
          ["Offer", scope?.equipmentOffer],
          ["PN", scope?.partNumber],
          ["Qty", qty || ""],
          ["Availability", a.availabilityStatus],
          ["Acquisition", a.acquisitionType],
          ["Unit cost", amount(a.unitCostUSD, "USD")],
          [
            "Original price",
            a.originalCost ? money(a.originalCost, a.originalCurrency) : "",
          ],
          [
            "Rental",
            a.dailyRate
              ? `${money(a.dailyRate, "USD")}/day x ${a.rentalDays || 0} days`
              : "",
          ],
          ["Line total", amount(bd.total, "USD")],
          ["Category", a.costCategory],
          ["Cost source", a.costReference],
          ["Supplier", a.supplier],
          ["Quotation", a.quotationReference],
          ["Cost date", day(a.dateReference || a.costDate)],
          ["Lead time", a.leadTimeDays ? `${a.leadTimeDays} days` : ""],
          [
            "Cost from",
            a.costFromSubItems ? "sub-items" : a.costFromPCF ? "PCF items" : "",
          ],
          ["Notes", a.notes],
        ],
      );
      const children: string[] = [];
      (a.availabilitySplits || []).forEach((sp) =>
        children.push(
          record(`Split of ${owner}: ${sp.qty || 0} units`, [
            ["Availability", sp.availabilityStatus],
            ["Acquisition", sp.acquisitionType],
            ["Unit cost", amount(sp.unitCostUSD, "USD")],
            [
              "Rental",
              sp.dailyRate
                ? `${money(sp.dailyRate, "USD")}/day x ${sp.rentalDays || 0} days`
                : "",
            ],
            ["Cost source", sp.costReference],
            ["Supplier", sp.supplier],
            ["Cost date", day(sp.dateReference)],
            ["Lead time", sp.leadTimeDays ? `${sp.leadTimeDays} days` : ""],
            ["Notes", sp.notes],
          ]),
        ),
      );
      const childCosts = (
        kind: string,
        list: ISubItemCost[] | undefined,
        source: IScopeSubItem[] | undefined,
      ): void =>
        (list || []).forEach((sic) => {
          const sub = (source || []).find((s) => s.id === sic.subItemId);
          children.push(
            record(`${kind} of ${owner}: ${sub ? clean(sub.description) : "item"}`, [
              ["PN", sub?.partNumber],
              ["Qty", sub?.qty || ""],
              ["Availability", sic.availabilityStatus],
              ["Acquisition", sic.acquisitionType],
              ["Unit cost", amount(sic.unitCostUSD, "USD")],
              [
                "Rental",
                sic.dailyRate
                  ? `${money(sic.dailyRate, "USD")}/day x ${sic.rentalDays || 0} days`
                  : "",
              ],
              ["Cost source", sic.costReference],
              ["Supplier", sic.supplier],
              ["Quotation", sic.quotationReference],
              ["Cost date", day(sic.dateReference)],
              ["Lead time", sic.leadTimeDays ? `${sic.leadTimeDays} days` : ""],
              ["Notes", sic.notes],
            ]),
          );
        });
      childCosts("Sub-item cost", a.subItemCosts, scope?.subItems);
      childCosts("PCF item cost", a.pcfCosts, scope?.pcfItems);
      (a.subCosts || []).forEach((sc) =>
        children.push(
          record(`Additional cost of ${owner}: ${clean(sc.description)}`, [
            ["Amount", amount(sc.costUSD, "USD")],
            ["Cost source", sc.costReference],
            ["Notes", sc.notes],
          ]),
        ),
      );
      return lines([main].concat(children));
    }),
  );

  section(
    "Equipment List",
    (bid.equipmentList || []).map((e) =>
      record(`Equipment: ${clean(e.toolDescription) || clean(e.requirementName)}`, [
        ["PN", e.partNumber],
        ["Qty", `${e.qtyOperational || 0} operational + ${e.qtySpare || 0} spare`],
        ["Acquisition", e.acquisitionType],
        ["Unit cost", amount(e.unitCostUSD, "USD")],
        [
          "Original price",
          e.originalCost ? money(e.originalCost, e.originalCurrency) : "",
        ],
        ["Total", amount(e.totalCostUSD, "USD")],
        ["Category", e.costCategory],
        ["Cost source", e.costReference],
        ["Quotation", e.quoteLabel],
        ["Cost date", day(e.costDate)],
        ["Lead time", e.leadTimeDays ? `${e.leadTimeDays} days` : ""],
        ["Notes", e.notes],
      ]),
    ),
  );

  section(
    "Logistics",
    (bid.logisticsBreakdown || []).map((l) =>
      record(`Logistics: ${[clean(l.item), clean(l.description)].filter(Boolean).join(" - ")}`, [
        ["Qty", l.qty || ""],
        ["Unit cost", amount(l.unitCost, l.originalCurrency)],
        ["Total", amount(l.totalCost, l.originalCurrency)],
        ["Division", l.integratedDivision],
        ["Notes", l.notes],
      ]),
    ),
  );

  section(
    "Certifications",
    (bid.certificationsBreakdown || [])
      .filter((c) => !c.isSection)
      .map((c) =>
        record(`Certification: ${clean(c.itemRef)}`, [
          ["For", c.scopeItemId ? lineLabel(scopeById[c.scopeItemId]) : ""],
          ["Qty", c.qty || ""],
          ["Validity", c.expiryPeriod],
          ["Unit cost", amount(c.unitCost, c.originalCurrency)],
          ["Total", amount(c.totalCost, c.originalCurrency)],
          ["Cost source", c.costReference],
          ["Notes", c.notes],
        ]),
      ),
  );

  section(
    "Preparation (RTS)",
    (bid.rtsItems || []).map((r) =>
      record(`Preparation${r.costType ? ` (${r.costType})` : ""}: ${clean(r.description)}`, [
        ["For", r.scopeItemId ? lineLabel(scopeById[r.scopeItemId]) : ""],
        ["Qty", r.qty || ""],
        ["Unit cost", amount(r.unitCost, r.originalCurrency)],
        ["Total", amount(r.totalCost, r.originalCurrency)],
        ["Cost source", r.costReference],
        ["Notes", r.notes],
      ]),
    ),
  );

  section(
    "Mobilization",
    (bid.mobilizationItems || []).map((m) =>
      record(`${m.costType ? m.costType.charAt(0).toUpperCase() + m.costType.slice(1) : "Mobilization"}: ${clean(m.description)}`, [
        ["Qty", m.qty || ""],
        ["Unit cost", amount(m.unitCost, m.originalCurrency)],
        ["Total", amount(m.totalCost, m.originalCurrency)],
        ["Cost source", m.costReference],
        ["Notes", m.notes],
      ]),
    ),
  );

  section(
    "Consumables",
    (bid.consumableItems || []).map((c) =>
      record(`Consumable: ${[clean(c.item), clean(c.description)].filter(Boolean).join(" - ")}`, [
        ["Qty", c.qty || ""],
        ["Unit cost", amount(c.unitCost, c.originalCurrency)],
        ["Total", amount(c.totalCost, c.originalCurrency)],
        ["Cost source", c.costReference],
        ["Notes", c.notes],
      ]),
    ),
  );

  section("Hours and Personnel", hours(bid));

  const cs = buildCostSummary(bid);
  section("Cost Summary", [
    lines([
      record("Assets", [
        ["Total", amount(cs.assetsCostUSD, "USD")],
        ["CAPEX", amount(cs.assetsCapexUSD, "USD")],
        ["OPEX", amount(cs.assetsOpexUSD, "USD")],
      ]),
      record("Hours", [
        ["Total", amount(cs.totalHoursCostUSD, "USD")],
        ["In BRL", amount(cs.totalHoursCostBRL, "BRL")],
      ]),
      record("Logistics", [["Total", amount(cs.logisticsCostUSD, "USD")]]),
      record("Certifications", [
        ["Total", amount(cs.certificationsCostUSD, "USD")],
      ]),
      record("Preparation (RTS)", [["Total", amount(cs.rtsCostUSD, "USD")]]),
      record("Mobilization", [["Total", amount(cs.mobilizationCostUSD, "USD")]]),
      record("Consumables", [["Total", amount(cs.consumablesCostUSD, "USD")]]),
      record("Total BID cost", [
        ["USD", amount(cs.totalCostUSD, "USD")],
        ["BRL", amount(cs.totalCostBRL, "BRL")],
      ]),
      record("", [
        [
          "Currencies without a rate (left out of totals)",
          (cs.missingRateCurrencies || []).join(", "),
        ],
        ["Cost notes", cs.notes],
      ]),
    ]),
  ]);
  return blocks;
}

function hours(bid: IBid): string[] {
  const hs = bid.hoursSummary;
  if (!hs) return [];
  const out: string[] = [
    record("Hours totals", [
      ["Total", hs.grandTotalHours ? `${hs.grandTotalHours} h` : ""],
      [
        "Engineering",
        hs.engineeringHours?.totalHours ? `${hs.engineeringHours.totalHours} h` : "",
      ],
      ["Onshore", hs.onshoreHours?.totalHours ? `${hs.onshoreHours.totalHours} h` : ""],
      [
        "Offshore",
        hs.offshoreHours?.totalHours ? `${hs.offshoreHours.totalHours} h` : "",
      ],
      ["Cost", amount(hs.grandTotalCostBRL, "BRL")],
    ]),
  ];
  const crew = (kind: string, items: IHoursItem[]): void => {
    const rows = (items || [])
      .filter((h) => !h.isSeparator)
      .map((h) =>
        record(`${kind}: ${clean(h.function) || clean(h.requirementName)}`, [
          ["Phase", h.phase],
          ["People", h.pplQty || ""],
          ["Days", h.workDays || ""],
          ["Hours per day", h.hoursPerDay || ""],
          ["Utilization", h.utilizationPercent ? `${h.utilizationPercent}%` : ""],
          ["Total", h.totalHours ? `${h.totalHours} h` : ""],
          ["Cost", amount(h.costBRL, "BRL")],
          ["Division", h.integratedDivision],
          ["Notes", h.notes],
        ]),
      );
    if (rows.length) out.push(lines(rows));
  };
  crew("Onshore", hs.onshoreHours?.items || []);
  crew("Offshore", hs.offshoreHours?.items || []);
  const eng = (hs.engineeringHours?.engineeringItems || []).map((e) =>
    record(`Engineering: ${clean(e.description)}`, [
      ["Offer", e.equipmentOffer],
      [
        "Deliverables",
        (e.deliverables || [])
          .map((d) => `${clean(d.deliverableType)} ${d.hours || 0} h`)
          .join("; "),
      ],
      ["Total", e.totalHours ? `${e.totalHours} h` : ""],
      ["Notes", e.notes],
    ]),
  );
  if (eng.length) out.push(lines(eng));
  return out;
}

function clarifications(bid: IBid, num: number): string[] {
  const scopeById: Record<string, IScopeItem> = {};
  (bid.scopeItems || []).forEach((i) => (scopeById[i.id] = i));
  const rows = (bid.clarifications || [])
    .filter((c) => clean(c.clarification) || clean(c.description))
    .map((c) =>
      record(`${c.baseType || "Clarification"} on item ${clean(c.item) || "-"}: ${clean(c.description)}`, [
        ["Related scope", c.scopeItemId ? lineLabel(scopeById[c.scopeItemId]) : ""],
        ["Sent to client", c.clarification],
        ["Client response", clean(c.clientResponse) || "none recorded"],
        ["Response date", day(c.responseDate)],
        ["Created", day(c.createdDate)],
      ]),
    );
  return rows.length ? [heading(2, `${num} Clarifications`)].concat(rows) : [];
}

function qualifications(bid: IBid, num: number): string[] {
  const blocks: string[] = [];
  let n = 0;
  const general = (bid.opportunityInfo?.qualifications || []).filter((q) => clean(q));
  if (general.length) {
    n++;
    blocks.push(
      heading(3, `${num}.${n} General qualifications`),
      lines(general.map((q, i) => record(`General qualification ${i + 1}`, [["Text", q]]))),
    );
  }
  (bid.qualificationTables || []).forEach((t) => {
    const rows = (t.items || [])
      .filter((q) => clean(q.description) || clean(q.comments))
      .map((q) =>
        record(`Qualification ${q.item} (${clean(t.title) || "table"}): ${clean(q.description)}`, [
          ["Comments", q.comments],
        ]),
      );
    if (!rows.length) return;
    n++;
    blocks.push(heading(3, `${num}.${n} ${t.title || "Qualifications"}`), lines(rows));
  });
  return blocks.length ? [heading(2, `${num} Qualifications`)].concat(blocks) : [];
}

function revisionsAndApproval(bid: IBid, num: number): string[] {
  const rows: string[] = (bid.revisions || []).map((r) =>
    record(`Revision ${r.revisionLetter}`, [
      ["Opened", day(r.openedDate)],
      ["Opened by", r.openedBy?.name],
      ["Reason", r.reason],
      ["Closed", day(r.closedDate)],
      ["Tracked changes", (r.changes || []).length || ""],
    ]),
  );
  const rounds = bid.approvalRounds || [];
  const last = rounds[rounds.length - 1];
  if (last) {
    rows.push(
      record(`Approval round ${last.round}`, [
        ["Status", last.status],
        ["Started", day(last.startedDate)],
        ["Completed", day(last.completedDate)],
        [
          "Approvers",
          (last.approvals || [])
            .map((a) => `${a.stakeholder?.name || ""} (${a.stakeholderRole}, ${a.status})`)
            .join("; "),
        ],
      ]),
    );
    if (last.override) {
      rows.push(
        record("Approval override", [
          ["By", last.override.overriddenBy?.name],
          ["Date", day(last.override.overriddenDate)],
          ["Reason", last.override.reason],
        ]),
      );
    }
  }
  if (bid.kpis?.approvalCycleTime) {
    rows.push(record("", [["Approval cycle time", `${bid.kpis.approvalCycleTime} h`]]));
  }
  const body = lines(rows);
  return body ? [heading(2, `${num} Revisions and Approval`), body] : [];
}

function outcome(bid: IBid, num: number): string[] {
  const r = bid.bidResult;
  return [
    heading(2, `${num} Outcome`),
    record("", [
      ["Outcome", (r && r.outcome) || "not recorded yet"],
      ["Outcome date", day(r?.outcomeDate)],
      [
        "Contract value",
        r && r.contractValue ? money(r.contractValue, r.contractCurrency || "USD") : "",
      ],
      ["Lost reason", r?.lostReason],
      ["Competitor", r?.competitorName],
      ["Client feedback", r?.feedbackNotes],
      ["Follow-up date", day(r?.followUpDate)],
    ]),
  ];
}

/* ───────────────────────────── public API ───────────────────────────── */

export function buildPastBidDocument(
  bid: IBid,
  profile: ProfileFields | null,
  opts: { includePricing?: boolean } = {},
): string {
  const opp = bid.opportunityInfo || ({} as IBid["opportunityInfo"]);
  const client = clean(opp.client) || "Unknown client";
  const project = clean(opp.projectName);
  const year = getPastBidYear(bid);
  const title = `Past Bid ${bid.bidNumber} - ${client}${project ? ` - ${project}` : ""}${year ? ` (${year})` : ""}`;

  const intro = [
    `Approved Oceaneering BID ${bid.bidNumber} for ${client}${project ? `, project ${project}` : ""}.`,
    bid.completedDate ? `Completed on ${day(bid.completedDate)}.` : "",
    `Division ${bid.division || "-"}${bid.serviceLine ? `, service line ${bid.serviceLine}` : ""}.`,
    profile && profile.scopeCategories.length
      ? `Scope categories: ${profile.scopeCategories.join(", ")}.`
      : "",
    profile && profile.tags.length ? `Tags: ${profile.tags.join(", ")}.` : "",
    `Outcome: ${(bid.bidResult && bid.bidResult.outcome) || "not recorded yet"}.`,
  ]
    .filter(Boolean)
    .join(" ");

  const blocks: string[] = [heading(1, title), intro];
  if (profile && clean(profile.summary)) blocks.push(richText(profile.summary));
  // Top-level numbers stay consecutive when a section is empty, so the chunker's
  // numbered-heading fallback still works if the indexer strips the "#" markers.
  let num = 0;
  const push = (build: (next: number) => string[]): void => {
    const list = build(num + 1).filter(Boolean);
    if (!list.length) return;
    num++;
    list.forEach((b) => blocks.push(b));
  };
  push((k) => identification(bid, k));
  push((k) => classification(bid, profile, k));
  push((k) => description(bid, k));
  push((k) => scopeOfSupply(bid, k));
  if (opts.includePricing !== false) push((k) => pricing(bid, k));
  push((k) => clarifications(bid, k));
  push((k) => qualifications(bid, k));
  push((k) => revisionsAndApproval(bid, k));
  push((k) => outcome(bid, k));

  const text = blocks.join("\n\n") + "\n";
  return text.length > MAX_DOC_CHARS
    ? `${text.substring(0, MAX_DOC_CHARS)}\n\n(Document truncated: the BID is larger than the knowledge document limit.)\n`
    : text;
}

/** Compact text (no pricing) sent to the AI to suggest scope categories, tags and summary. */
export function buildPastBidAiDigest(bid: IBid): string {
  return buildPastBidDocument(bid, null, { includePricing: false }).substring(
    0,
    AI_DIGEST_MAX_CHARS,
  );
}

export function buildPastBidMetadata(
  bid: IBid,
  profile: ProfileFields,
): IDocLibraryMetadata {
  const opp = bid.opportunityInfo || ({} as IBid["opportunityInfo"]);
  const client = clean(opp.client);
  const rev = currentRevisionLetter(bid);
  const outcomeValue = bid.bidResult && bid.bidResult.outcome;
  const cut = (s: string): string => s.substring(0, TEXT_COLUMN_MAX);
  return {
    title: cut(`Past Bid ${bid.bidNumber}${client ? ` - ${client}` : ""}`),
    docType: PAST_BID_DOC_TYPE,
    groupId: "",
    subGroupId: "",
    category: cut(
      [profile.scopeCategories.join(", "), bid.division, bid.serviceLine]
        .filter((v) => clean(v))
        .join(" / "),
    ),
    manufacturer: cut(client),
    model: cut(bid.bidNumber),
    keywords: cut(profile.tags.join(", ")),
    description: [clean(opp.projectName), clean(profile.summary)]
      .filter(Boolean)
      .join(". ")
      .substring(0, 2000),
    revision: cut(
      [
        rev ? `Rev ${rev}` : "",
        bid.completedDate ? `Completed ${day(bid.completedDate)}` : "",
        outcomeValue ? `Outcome ${outcomeValue}` : "",
      ]
        .filter(Boolean)
        .join(" · "),
    ),
  };
}
