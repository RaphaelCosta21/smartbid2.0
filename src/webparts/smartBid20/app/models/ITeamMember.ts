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
}

export interface IMembersData {
  members: ITeamMember[];
}
