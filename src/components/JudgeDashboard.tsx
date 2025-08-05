import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectScoring } from "@/components/ProjectScoring";
import { LogOut, ExternalLink } from "lucide-react";

interface Judge {
  id: string;
  name: string;
  email: string;
}

interface JudgeDashboardProps {
  judge: Judge;
}

export const JudgeDashboard = ({ judge }: JudgeDashboardProps) => {
  const { data: projects, isLoading } = useProjects();
  const { signOut } = useAuth();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const handleSignOut = () => {
    signOut();
  };

  if (selectedProject) {
    const project = projects?.find(p => p.id === selectedProject);
    if (project) {
      return (
        <ProjectScoring
          project={project}
          judge={judge}
          onBack={() => setSelectedProject(null)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Judge Portal</h1>
            <p className="text-muted-foreground">Welcome, {judge.name}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Projects to Review</h2>
          <p className="text-muted-foreground">
            Click on any project to view details and submit your scores.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects?.map((project) => (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedProject(project.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {project.name}
                    <ExternalLink className="h-4 w-4" />
                  </CardTitle>
                  <CardDescription>
                    Team: {project.team_members.join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                  <div className="mt-4 flex gap-2">
                    {project.github_url && (
                      <span className="text-xs bg-secondary px-2 py-1 rounded">GitHub</span>
                    )}
                    {project.demo_url && (
                      <span className="text-xs bg-secondary px-2 py-1 rounded">Demo</span>
                    )}
                    {project.video_url && (
                      <span className="text-xs bg-secondary px-2 py-1 rounded">Video</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};