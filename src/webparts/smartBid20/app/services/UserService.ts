/**
 * UserService — Graph API: foto, perfil, presença.
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { IUser } from "../models";

export class UserService {
  public static async getCurrentUser(): Promise<IUser> {
    const user = await SPService.sp.web.currentUser();
    return {
      id: String((user as { Id: number }).Id),
      displayName: (user as { Title: string }).Title,
      email: (user as { Email: string }).Email,
      jobTitle: "",
      department: "",
      role: "viewer",
      teamCategory: "",
      isActive: true,
    };
  }

  public static async getUserPhoto(email: string): Promise<string | null> {
    try {
      await SPService.sp.web.siteUsers.getByEmail(email).select("Id")();
      // Return a Graph API photo URL
      return `/_layouts/15/userphoto.aspx?size=S&username=${encodeURIComponent(email)}`;
    } catch {
      return null;
    }
  }

  public static async searchUsers(
    query: string,
  ): Promise<{ email: string; name: string }[]> {
    if (!query || query.length < 2) return [];
    const results = await SPService.sp.web.siteUsers
      .filter(
        `substringof('${query}', Title) or substringof('${query}', Email)`,
      )
      .select("Title", "Email")
      .top(10)();
    return results.map((u: { Title: string; Email: string }) => ({
      email: u.Email,
      name: u.Title,
    }));
  }
}
