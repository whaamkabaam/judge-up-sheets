import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useJudge = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["judge", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      
      const { data, error } = await supabase
        .from("judges")
        .select("*")
        .eq("email", user.email)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.email,
  });
};