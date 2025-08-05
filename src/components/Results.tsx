import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trophy, Users, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectScore {
  project_id: string;
  project_name: string;
  team_members: string[];
  weighted_score: number;
  total_votes: number;
  criteria_scores: { [key: string]: number };
}

interface CommunityVote {
  project_name: string;
  votes: number;
}

export const Results = () => {
  const { toast } = useToast();

  const { data: criteria } = useQuery({
    queryKey: ["criteria"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("criteria")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: juryResults, isLoading: juryLoading } = useQuery({
    queryKey: ["jury-results"],
    queryFn: async () => {
      // Get all projects with their scores
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("id, name, team_members");
      
      if (projectsError) throw projectsError;

      // Get all scores
      const { data: scores, error: scoresError } = await supabase
        .from("scores")
        .select(`
          project_id,
          criterion_id,
          score_value,
          criteria:criterion_id (name, weight, max_score)
        `);
      
      if (scoresError) throw scoresError;

      // Get community votes count
      const { data: votes, error: votesError } = await supabase
        .from("community_votes")
        .select("project_id");
      
      if (votesError) throw votesError;

      // Calculate results
      const results: ProjectScore[] = projects.map(project => {
        const projectScores = scores.filter(s => s.project_id === project.id);
        const projectVotes = votes.filter(v => v.project_id === project.id).length;
        
        // Group scores by criterion
        const criteriaScores: { [key: string]: number[] } = {};
        projectScores.forEach(score => {
          const criterionName = (score.criteria as any)?.name || 'Unknown';
          if (!criteriaScores[criterionName]) {
            criteriaScores[criterionName] = [];
          }
          criteriaScores[criterionName].push(score.score_value);
        });

        // Calculate average scores per criterion
        const avgCriteriaScores: { [key: string]: number } = {};
        let weightedScore = 0;
        
        Object.entries(criteriaScores).forEach(([criterionName, scores]) => {
          const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
          avgCriteriaScores[criterionName] = avg;
          
          // Find criterion details for weighting
          const criterion = criteria?.find(c => c.name === criterionName);
          if (criterion) {
            const normalizedScore = (avg / criterion.max_score) * (criterion.weight / 100);
            weightedScore += normalizedScore;
          }
        });

        return {
          project_id: project.id,
          project_name: project.name,
          team_members: Array.isArray(project.team_members) ? project.team_members.map(member => String(member)) : [],
          weighted_score: weightedScore * 100, // Convert to percentage
          total_votes: projectVotes,
          criteria_scores: avgCriteriaScores,
        };
      });

      return results.sort((a, b) => b.weighted_score - a.weighted_score);
    },
    enabled: !!criteria,
  });

  const { data: communityResults, isLoading: communityLoading } = useQuery({
    queryKey: ["community-results"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_votes")
        .select(`
          project_id,
          projects:project_id (name)
        `);
      
      if (error) throw error;

      // Count votes per project
      const voteCounts: { [key: string]: number } = {};
      const projectNames: { [key: string]: string } = {};
      
      data.forEach(vote => {
        const projectName = (vote.projects as any)?.name || 'Unknown';
        projectNames[vote.project_id] = projectName;
        voteCounts[vote.project_id] = (voteCounts[vote.project_id] || 0) + 1;
      });

      const results: CommunityVote[] = Object.entries(voteCounts)
        .map(([projectId, votes]) => ({
          project_name: projectNames[projectId],
          votes,
        }))
        .sort((a, b) => b.votes - a.votes);

      return results;
    },
  });

  const exportJuryResults = () => {
    if (!juryResults || !criteria) return;

    const headers = ["Rank", "Project", "Team", "Weighted Score"];
    criteria.forEach(criterion => headers.push(criterion.name));

    const rows = juryResults.map((result, index) => {
      const row = [
        index + 1,
        result.project_name,
        result.team_members.join("; "),
        result.weighted_score.toFixed(2) + "%"
      ];
      criteria.forEach(criterion => {
        const score = result.criteria_scores[criterion.name] || 0;
        row.push(score.toFixed(2));
      });
      return row;
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jury-results.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Jury results have been exported to CSV.",
    });
  };

  const exportCommunityResults = () => {
    if (!communityResults) return;

    const headers = ["Rank", "Project", "Votes"];
    const rows = communityResults.map((result, index) => [
      index + 1,
      result.project_name,
      result.votes
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "community-vote-results.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Community vote results have been exported to CSV.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Jury Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Jury Results
          </CardTitle>
          <CardDescription>
            Final scores based on judge evaluations with weighted criteria.
          </CardDescription>
          <div className="flex justify-end">
            <Button onClick={exportJuryResults} disabled={!juryResults}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {juryLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : juryResults && juryResults.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Weighted Score</TableHead>
                  {criteria?.map(criterion => (
                    <TableHead key={criterion.id}>{criterion.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {juryResults.map((result, index) => (
                  <TableRow key={result.project_id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                        <span className="font-medium">#{index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{result.project_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {result.team_members.join(", ")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={index < 3 ? "default" : "secondary"}>
                        {result.weighted_score.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    {criteria?.map(criterion => (
                      <TableCell key={criterion.id}>
                        {(result.criteria_scores[criterion.name] || 0).toFixed(1)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No jury results available yet.</p>
              <p className="text-sm">Results will appear once judges start scoring projects.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Community Vote Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Vote Results
          </CardTitle>
          <CardDescription>
            Results from public community voting.
          </CardDescription>
          <div className="flex justify-end">
            <Button onClick={exportCommunityResults} disabled={!communityResults}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {communityLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : communityResults && communityResults.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Votes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communityResults.map((result, index) => (
                  <TableRow key={result.project_name}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                        <span className="font-medium">#{index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{result.project_name}</TableCell>
                    <TableCell>
                      <Badge variant={index < 3 ? "default" : "secondary"}>
                        {result.votes} votes
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No community votes yet.</p>
              <p className="text-sm">Votes will appear once the community starts voting.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};