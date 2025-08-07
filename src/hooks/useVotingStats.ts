import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface IpVoteStats {
  ip: string | null;
  total_votes: number;
  remaining: number;
  projects: string[];
}

export const useVotingStats = () => {
  return useQuery<IpVoteStats | null>({
    queryKey: ["ipVoteStats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_ip_vote_stats");
      if (error) throw error;
      // data is a jsonb object, ensure it conforms to our interface
      if (!data) return null;
      const parsed = data as unknown as IpVoteStats;
      // Normalize projects to string[]
      const projects = Array.isArray((parsed as any).projects)
        ? ((parsed as any).projects as any[]).map(String)
        : [];
      return {
        ip: parsed.ip ?? null,
        total_votes: Number(parsed.total_votes ?? 0),
        remaining: Number(parsed.remaining ?? 3),
        projects,
      };
    },
    staleTime: 30_000,
  });
};
