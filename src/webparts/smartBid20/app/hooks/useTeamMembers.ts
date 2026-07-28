/**
 * useTeamMembers — Loads the team roster from SharePoint (MembersService).
 */
import * as React from "react";
import { MembersService } from "../services/MembersService";
import { ITeamMember } from "../models";

export function useTeamMembers(): {
  members: ITeamMember[];
  loading: boolean;
  error: string | null;
} {
  const [members, setMembers] = React.useState<ITeamMember[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    MembersService.getAll()
      .then((data) => {
        if (!alive) return;
        setMembers(data.members || []);
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : String(e));
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { members, loading, error };
}
