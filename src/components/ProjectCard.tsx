import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ExternalLink, Github, Play, Users, Eye } from "lucide-react";
import { useState } from "react";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    team_members: string[];
    github_url?: string;
    demo_url?: string;
    video_url?: string;
    votes?: number;
  };
  onVote?: (projectId: string) => Promise<void>;
  onViewDetails?: (project: any) => void;
  showVoting?: boolean;
}

const ProjectCard = ({ project, onVote, onViewDetails, showVoting = true }: ProjectCardProps) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    if (hasVoted || !onVote) return;
    try {
      setIsVoting(true);
      await onVote(project.id);
      setHasVoted(true);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:scale-105 bg-gradient-card border-0">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {project.name}
          </CardTitle>
          {showVoting && (
            <Button
              variant={hasVoted ? "secondary" : "vote"}
              size="sm"
              onClick={handleVote}
              disabled={hasVoted || isVoting}
              className="flex items-center space-x-1"
            >
              <Heart className={`h-4 w-4 ${hasVoted ? 'fill-current' : ''}`} />
              <span>{project.votes ?? 0}</span>
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{project.team_members.length} members</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {project.team_members.map((member, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {member}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          {project.github_url && (
            <Button variant="ghost" size="sm" asChild>
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.demo_url && (
            <Button variant="ghost" size="sm" asChild>
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.video_url && (
            <Button variant="ghost" size="sm" asChild>
              <a href={project.video_url} target="_blank" rel="noopener noreferrer">
                <Play className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onViewDetails?.(project)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;