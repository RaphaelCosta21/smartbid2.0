export type UserRole =
  | "manager"
  | "engineer"
  | "bidder"
  | "projectTeam"
  | "viewer"
  | "guest";

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
  isActive: boolean;
  isSuperAdmin?: boolean;
}
