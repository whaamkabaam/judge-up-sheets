import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Project {
  id: string;
  name: string;
  description: string;
  team_members: string[];
  github_url?: string;
  demo_url?: string;
  video_url?: string;
  event_id: string;
  created_at: string;
  updated_at: string;
  votes?: number;
}

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          votes:community_votes(count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to include vote count
      return data.map(project => ({
        ...project,
        votes: project.votes?.[0]?.count || 0
      })) as Project[];
    },
  });
};

export const useVoteForProject = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      // Basic fraud prevention - check if already voted (simple cookie check)
      const hasVoted = localStorage.getItem(`voted_${projectId}`);
      if (hasVoted) {
        throw new Error("You have already voted for this project");
      }

      const { error } = await supabase
        .from("community_votes")
        .insert({
          project_id: projectId,
          user_agent: navigator.userAgent
        });

      if (error) throw error;

      // Mark as voted locally
      localStorage.setItem(`voted_${projectId}`, "true");
      
      return projectId;
    },
    onSuccess: () => {
      toast({
        title: "Vote submitted!",
        description: "Thank you for participating in the community vote.",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["ipVoteStats"] });
    },
    onError: (error: any) => {
      const code = error?.code || error?.details?.code;
      const message = (error?.message || "").toString();

      if (
        code === "P0001" ||
        message.toLowerCase().includes("vote limit") ||
        message.toLowerCase().includes("used all available votes")
      ) {
        toast({
          title: "Vote limit reached",
          description: "This IP has used all 3 votes.",
          variant: "destructive",
        });
      } else if (
        code === "23505" ||
        message.toLowerCase().includes("duplicate") ||
        message.includes("uniq_community_votes_project_ip")
      ) {
        toast({
          title: "Already voted",
          description: "This IP has already voted for this project.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Vote failed",
          description: message || "Failed to submit vote. Please try again.",
          variant: "destructive",
        });
      }
    },
  });
};