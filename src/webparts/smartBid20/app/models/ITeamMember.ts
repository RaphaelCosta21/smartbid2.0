import { UserRole, MemberDivision } from "./IUser";

export interface ITeamMember {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  division: MemberDivision;
  role: UserRole;
  isActive: boolean;
  photoUrl?: string;
  phone?: string;
  joinedDate: string;
}

export interface IMembersData {
  manager: ITeamMember[];
  project: ITeamMember[];
  operations: ITeamMember[];
  equipment: ITeamMember[];
  dataCenter: ITeamMember[];
  engineering: ITeamMember[];
}
