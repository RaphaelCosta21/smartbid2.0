export type Sector =
  | "commercial"
  | "engineering"
  | "project"
  | "operation"
  | "dataCenter"
  | "equipmentInstallation"
  | "supplyChain";

export type BusinessLine = "ROV" | "OPG" | "SURVEY";

export type BidRole = "contributor" | "manager" | "coordinator";

/** @deprecated Use Sector instead */
export type UserRole = Sector | "guest";

/** @deprecated Use Sector instead */
export type MemberDivision = string;

export interface IPersonRef {
  name: string;
  email: string;
  role?: string;
  photoUrl?: string;
}

export interface IUser {
  id: string;
  displayName: string;
  email: string;
  jobTitle: string;
  department: string;
  photoUrl?: string;
  role: UserRole;
  teamCategory: string;
  division?: string;
  sector?: Sector;
  businessLines?: BusinessLine[];
  bidRole?: BidRole;
  isActive: boolean;
  isSuperAdmin?: boolean;
}
