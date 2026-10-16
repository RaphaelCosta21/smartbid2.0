import { Sector, BusinessLine, BidRole } from "./IUser";

export interface ITeamMember {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  sector: Sector;
  businessLines: BusinessLine[];
  bidRole: BidRole;
  isActive: boolean;
  photoUrl?: string;
  phone?: string;
  joinedDate: string;
  themePreference?: "dark" | "light";
  /** Id from config/colorThemes.config (validated on load). */
  colorTheme?: string;
}

export interface IMembersData {
  members: ITeamMember[];
}
