/**
 * Which catalog equipment a BID already considers, read from its Scope of Supply:
 * part number first, then the equipment title or a distinctive alias in the text.
 */
import { IBid, ISurveyCatalog } from "../models";

const words = (text: string): string =>
  ` ${(text || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `;

const pnKey = (pn: string): string => {
  const key = (pn || "").trim().toUpperCase();
  // Placeholders like "N/A" or "TBD" would match everything.
  return key.length >= 4 && /\d/.test(key) ? key : "";
};

/** Single short words ("USBL", "UPS") are too generic to prove a match. */
const isDistinctive = (alias: string): boolean => {
  const a = alias.trim();
  return /\d/.test(a) || /\s/.test(a) || a.length >= 6;
};

export function matchBidEquipment(bid: IBid, catalog: ISurveyCatalog): Record<string, boolean> {
  const texts: string[] = [];
  const pns: Record<string, boolean> = {};
  const collect = (description: string, offer: string, partNumber: string): void => {
    texts.push(words(`${description} ${offer}`));
    const key = pnKey(partNumber);
    if (key) pns[key] = true;
  };
  (bid.scopeItems || []).forEach((s) => {
    if (s.isSection) return;
    collect(s.description, s.equipmentOffer, s.partNumber);
    (s.subItems || []).forEach((sub) => collect(sub.description, sub.equipmentOffer, sub.partNumber));
  });

  const result: Record<string, boolean> = {};
  catalog.equipment.forEach((eq) => {
    const key = pnKey(eq.partNumber);
    if (key && pns[key]) {
      result[eq.id] = true;
      return;
    }
    const phrases = [eq.title]
      .concat(eq.aliases.filter(isDistinctive))
      .map(words)
      .filter((p) => p.trim().length > 0);
    if (texts.some((t) => phrases.some((p) => t.indexOf(p) >= 0))) result[eq.id] = true;
  });
  return result;
}
