import { UserRole } from "./IUser";

export interface ITeamMember {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  division: string;
  role: UserRole;
  isActive: boolean;
  photoUrl?: string;
  phone?: string;
  joinedDate: string;
}

export interface IMembersData {
  manager: ITeamMember[];
  engineer: ITeamMember[];
  bidder: ITeamMember[];
  projectTeam: ITeamMember[];
  viewer: ITeamMember[];
}
