import { useAuth } from "@/hooks/useAuth";
import { useJudge } from "@/hooks/useJudge";
import { AuthForm } from "@/components/AuthForm";
import { JudgeDashboard } from "@/components/JudgeDashboard";
import { Loader2 } from "lucide-react";

const JudgePortal = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: judge, isLoading: judgeLoading } = useJudge();

  if (authLoading || judgeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  if (!judge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You are not authorized to access the judge portal.
          </p>
        </div>
      </div>
    );
  }

  return <JudgeDashboard judge={judge} />;
};

export default JudgePortal;