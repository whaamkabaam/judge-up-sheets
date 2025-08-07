import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Play, Video, Users, Heart, Check } from "lucide-react";
import { useVoteForProject } from "@/hooks/useProjects";
import type { Project } from "@/hooks/useProjects";
import { useVotingStats } from "@/hooks/useVotingStats";

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectDetailModal = ({ project, open, onOpenChange }: ProjectDetailModalProps) => {
  const voteForProject = useVoteForProject();
  const { data: ipStats } = useVotingStats();

  if (!project) return null;

  const alreadyVoted = !!ipStats?.projects?.includes(project.id);
  const remaining = ipStats?.remaining ?? 3;

  const handleVote = () => {
    if (alreadyVoted || remaining <= 0) return;
    voteForProject.mutate(project.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl flex items-center gap-3">
            {project.name}
            <Badge variant="outline" className="ml-auto">
              {project.votes || 0} votes
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Team Members */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Team:</span>
            <span className="text-sm">{project.team_members.join(", ")}</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {project.github_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub Repository
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
                  Demo Video
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Project Description</h3>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p className="whitespace-pre-wrap leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          {/* Vote Button */}
          <div className="flex flex-col items-center justify-center pt-4 border-t gap-2">
            <Button 
              onClick={handleVote} 
              disabled={voteForProject.isPending || alreadyVoted || remaining <= 0}
              size="lg"
              className="min-w-[220px]"
            >
              {alreadyVoted ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Already voted
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-5 w-5" />
                  {voteForProject.isPending ? "Voting..." : "Vote for this Project"}
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">Votes left: <span className="font-medium">{remaining}</span> / 3</p>
          </div>

          {/* Metadata */}
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            <p>Submitted on {new Date(project.created_at).toLocaleDateString()}</p>
            {project.updated_at !== project.created_at && (
              <p>Last updated on {new Date(project.updated_at).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};