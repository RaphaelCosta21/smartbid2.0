import { IBid, IPersonRef } from "../models";

export type KeyPeopleRole =
  | "BID Responsible"
  | "Analyst"
  | "Project Manager"
  | "Commercial Requester"
  | "Creator";

export interface IKeyPerson extends IPersonRef {
  keyRoles: KeyPeopleRole[];
}

const normalizeEmail = (email: string | undefined): string =>
  (email || "").trim().toLowerCase();

const hasEmail = (people: IPersonRef[], email: string): boolean => {
  const target = normalizeEmail(email);
  return (
    !!target &&
    people.some((p) => !!p && normalizeEmail(p.email) === target)
  );
};

export function uniquePeople(people: IPersonRef[]): IPersonRef[] {
  const seen: Record<string, boolean> = {};
  const out: IPersonRef[] = [];
  people.forEach((p) => {
    // Persisted JSON may hold empty entries.
    const key = p ? normalizeEmail(p.email) : "";
    if (!key || seen[key]) return;
    seen[key] = true;
    out.push(p);
  });
  return out;
}

export function isBidConfidential(bid: IBid | undefined): boolean {
  return !!bid?.confidentiality?.enabled;
}

/** BID Responsible + Analyst: they manage confidentiality and can never lose access. */
export function getConfidentialManagers(bid: IBid): IPersonRef[] {
  return uniquePeople([
    ...(bid.engineerResponsible || []),
    ...(bid.analyst || []),
  ]);
}

/** Same people as the Overview "Key People" card. */
export function getBidKeyPeople(bid: IBid): IKeyPerson[] {
  const byEmail: Record<string, IKeyPerson> = {};
  const out: IKeyPerson[] = [];
  const add = (
    p: IPersonRef | null | undefined,
    role: KeyPeopleRole,
  ): void => {
    const key = normalizeEmail(p?.email);
    if (!p || !key) return;
    if (!byEmail[key]) {
      byEmail[key] = { ...p, keyRoles: [] };
      out.push(byEmail[key]);
    }
    if (byEmail[key].keyRoles.indexOf(role) === -1) {
      byEmail[key].keyRoles.push(role);
    }
  };
  (bid.engineerResponsible || []).forEach((p) => add(p, "BID Responsible"));
  (bid.analyst || []).forEach((p) => add(p, "Analyst"));
  (bid.projectManager || []).forEach((p) => add(p, "Project Manager"));
  add(bid.commercialRequester, "Commercial Requester");
  add(bid.creator, "Creator");
  return out;
}

export function canManageBidConfidentiality(
  bid: IBid,
  email: string,
): boolean {
  return hasEmail(getConfidentialManagers(bid), email);
}

export function getConfidentialAllowedPeople(bid: IBid): IPersonRef[] {
  return uniquePeople([
    ...getConfidentialManagers(bid),
    ...(bid.confidentiality?.allowedPeople || []),
  ]);
}

export function canOpenBid(bid: IBid, email: string): boolean {
  if (!isBidConfidential(bid)) return true;
  return hasEmail(getConfidentialAllowedPeople(bid), email);
}

export function isSamePerson(a: IPersonRef, email: string): boolean {
  const target = normalizeEmail(email);
  return !!target && normalizeEmail(a.email) === target;
}

export function diffPeople(
  before: IPersonRef[],
  after: IPersonRef[],
): { added: IPersonRef[]; removed: IPersonRef[] } {
  return {
    added: after.filter((p) => !hasEmail(before, p.email)),
    removed: before.filter((p) => !hasEmail(after, p.email)),
  };
}
