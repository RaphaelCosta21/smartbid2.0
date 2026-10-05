/**
 * supplierProfile — Links suppliers to their quotations (Supply categories,
 * drawer history) and builds the text the AI reads to suggest a profile.
 */
import {
  IConfigOption,
  IFavoriteGroup,
  IQuotationItem,
  ISupplier,
} from "../models";
import { buildDefaultSupplierServiceTypes } from "../config/suppliers.config";
import { activeConfigOptions } from "./clarificationHelpers";
import {
  buildSupplierKeyIndex,
  normalizeSupplierName,
} from "./supplierMatching";

const MAX_PROFILE_QUOTATIONS = 60;
const GENERIC_EMAIL_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "yahoo.com",
  "yahoo.com.br",
  "icloud.com",
  "uol.com.br",
  "bol.com.br",
  "terra.com.br",
  "oceaneering.com",
];

/** Service types from config, or the built-in seed until an admin saves the list. */
export function resolveServiceTypes(list?: IConfigOption[]): {
  all: IConfigOption[];
  active: IConfigOption[];
} {
  const all = list || buildDefaultSupplierServiceTypes();
  return { all, active: activeConfigOptions(all) };
}

/** Quotations per supplier id, matched by normalized name or alias. */
export function groupQuotationsBySupplier(
  suppliers: ISupplier[],
  quotations: IQuotationItem[],
): Record<number, IQuotationItem[]> {
  const index = buildSupplierKeyIndex(suppliers);
  const result: Record<number, IQuotationItem[]> = {};
  quotations.forEach((q) => {
    const supplier = index[normalizeSupplierName(q.supplier || "")];
    if (!supplier) return;
    (result[supplier.id] = result[supplier.id] || []).push(q);
  });
  Object.keys(result).forEach((id) =>
    result[Number(id)].sort((a, b) =>
      (b.quotationDate || "").localeCompare(a.quotationDate || ""),
    ),
  );
  return result;
}

/** Group names of a supplier's quotations, most frequent first. */
export function getSupplyCategories(
  quotations: IQuotationItem[],
  groups: IFavoriteGroup[],
): string[] {
  const names: Record<string, string> = {};
  groups.forEach((g) => (names[g.id] = g.name));
  const counts: Record<string, number> = {};
  quotations.forEach((q) => {
    const name = names[q.groupId];
    if (name) counts[name] = (counts[name] || 0) + 1;
  });
  return Object.keys(counts).sort(
    (a, b) => counts[b] - counts[a] || a.localeCompare(b),
  );
}

function websiteDomains(supplier: ISupplier): string[] {
  const domains: string[] = [];
  supplier.contacts.forEach((c) => {
    const at = (c.email || "").lastIndexOf("@");
    if (at < 0) return;
    const domain = c.email
      .slice(at + 1)
      .trim()
      .toLowerCase();
    if (
      domain &&
      GENERIC_EMAIL_DOMAINS.indexOf(domain) < 0 &&
      domains.indexOf(domain) < 0
    )
      domains.push(domain);
  });
  return domains;
}

/** Plain-text dossier the profile prompt reads. No prices are sent. */
export function buildSupplierProfileText(
  supplier: ISupplier,
  quotations: IQuotationItem[],
  groups: IFavoriteGroup[],
  documentAbout?: string,
): string {
  const groupNames: Record<string, string> = {};
  const subGroupNames: Record<string, string> = {};
  groups.forEach((g) => {
    groupNames[g.id] = g.name;
    (g.subGroups || []).forEach((sg) => (subGroupNames[sg.id] = sg.name));
  });
  const lines: string[] = [`SUPPLIER: ${supplier.name}`];
  if (supplier.aliases.length)
    lines.push(`ALSO KNOWN AS: ${supplier.aliases.join(" | ")}`);
  if (supplier.country) lines.push(`COUNTRY: ${supplier.country}`);
  const domains = websiteDomains(supplier);
  if (domains.length)
    lines.push(`CONTACT E-MAIL DOMAINS: ${domains.join(", ")}`);
  if (supplier.keywords.length)
    lines.push(`CURRENT KEYWORDS: ${supplier.keywords.join(", ")}`);
  if (supplier.notes.trim()) lines.push(`INTERNAL NOTES: ${supplier.notes.trim()}`);
  if (documentAbout && documentAbout.trim())
    lines.push(
      `WHAT THE SUPPLIER'S QUOTATION DOCUMENT SAYS ABOUT THE COMPANY: ${documentAbout.trim()}`,
    );
  const recent = quotations.slice(0, MAX_PROFILE_QUOTATIONS);
  if (recent.length) {
    lines.push(
      `ITEMS THIS SUPPLIER QUOTED TO OCEANEERING (${quotations.length} total, most recent first):`,
    );
    recent.forEach((q) => {
      const category = [groupNames[q.groupId], subGroupNames[q.subGroupId]]
        .filter(Boolean)
        .join(" / ");
      const item = [q.partNumber, (q.description || "").slice(0, 160)]
        .filter(Boolean)
        .join(" - ");
      lines.push(
        `- ${category ? `[${category}] ` : ""}${item} (${q.type === "rental" ? "rental" : "purchase"})`,
      );
    });
  } else {
    lines.push("ITEMS THIS SUPPLIER QUOTED TO OCEANEERING: none registered yet.");
  }
  return lines.join("\n");
}
