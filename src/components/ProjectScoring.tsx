import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ExternalLink, Github, Play, Video } from "lucide-react";
import type { Project } from "@/hooks/useProjects";

interface Judge {
  id: string;
  name: string;
  email: string;
}

interface Criterion {
  id: string;
  name: string;
  description: string;
  max_score: number;
  weight: number;
}

interface Score {
  criterion_id: string;
  score_value: number;
  comments: string;
}

interface ProjectScoringProps {
  project: Project;
  judge: Judge;
  onBack: () => void;
}

export const ProjectScoring = ({ project, judge, onBack }: ProjectScoringProps) => {
  const [scores, setScores] = useState<Score[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: criteria, isLoading: criteriaLoading } = useQuery({
    queryKey: ["criteria"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("criteria")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Criterion[];
    },
  });

  const { data: existingScores, isLoading: scoresLoading } = useQuery({
    queryKey: ["scores", project.id, judge.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .eq("project_id", project.id)
        .eq("judge_id", judge.id);
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (criteria && existingScores) {
      const initialScores = criteria.map(criterion => {
        const existing = existingScores.find(s => s.criterion_id === criterion.id);
        return {
          criterion_id: criterion.id,
          score_value: existing?.score_value || 1,
          comments: existing?.comments || "",
        };
      });
      setScores(initialScores);
    }
  }, [criteria, existingScores]);

  const submitScoresMutation = useMutation({
    mutationFn: async (scoresToSubmit: Score[]) => {
      // Delete existing scores for this project and judge
      await supabase
        .from("scores")
        .delete()
        .eq("project_id", project.id)
        .eq("judge_id", judge.id);

      // Insert new scores
      const scoresData = scoresToSubmit.map(score => ({
        project_id: project.id,
        judge_id: judge.id,
        criterion_id: score.criterion_id,
        score_value: score.score_value,
        comments: score.comments || null,
      }));

      const { error } = await supabase
        .from("scores")
        .insert(scoresData);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Scores submitted!",
        description: "Your scores have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["scores"] });
      onBack();
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting scores",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleScoreChange = (criterionId: string, value: number) => {
    setScores(prev => prev.map(score => 
      score.criterion_id === criterionId 
        ? { ...score, score_value: value }
        : score
    ));
  };

  const handleCommentsChange = (criterionId: string, comments: string) => {
    setScores(prev => prev.map(score => 
      score.criterion_id === criterionId 
        ? { ...score, comments }
        : score
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitScoresMutation.mutate(scores);
  };

  if (criteriaLoading || scoresLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-8">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">Scoring Interface</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Project Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Team Members</Label>
              <p className="text-sm text-muted-foreground">
                {project.team_members.join(", ")}
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {project.github_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
              {project.demo_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    <Play className="mr-2 h-4 w-4" />
                    Live Demo
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
              {project.video_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.video_url} target="_blank" rel="noopener noreferrer">
                    <Video className="mr-2 h-4 w-4" />
                    Video
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scoring Form */}
        <Card>
          <CardHeader>
            <CardTitle>Scoring Rubric</CardTitle>
            <CardDescription>
              Rate this project based on the criteria below. Your scores and comments will be saved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {criteria?.map((criterion) => {
                const score = scores.find(s => s.criterion_id === criterion.id);
                return (
                  <div key={criterion.id} className="space-y-4 p-6 border rounded-lg">
                    <div>
                      <h3 className="text-lg font-semibold">{criterion.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {criterion.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Weight: {criterion.weight}% | Max Score: {criterion.max_score}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Score: {score?.score_value || 1} / {criterion.max_score}</Label>
                      <Slider
                        value={[score?.score_value || 1]}
                        onValueChange={([value]) => handleScoreChange(criterion.id, value)}
                        max={criterion.max_score}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`comments-${criterion.id}`}>Comments (Optional)</Label>
                      <Textarea
                        id={`comments-${criterion.id}`}
                        value={score?.comments || ""}
                        onChange={(e) => handleCommentsChange(criterion.id, e.target.value)}
                        placeholder="Add your comments about this criterion..."
                        rows={3}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onBack}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitScoresMutation.isPending}
                >
                  {submitScoresMutation.isPending ? "Submitting..." : "Submit Scores"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};