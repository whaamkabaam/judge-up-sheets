import { useState } from "react";
import ProjectCard from "./ProjectCard";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { useProjects, useVoteForProject } from "@/hooks/useProjects";
import { Loader2, Trophy } from "lucide-react";

const ProjectGallery = () => {
  const { data: projects, isLoading, error } = useProjects();
  const voteForProject = useVoteForProject();
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleVote = (projectId: string) => {
    voteForProject.mutate(projectId);
  };

  const handleViewDetails = (project: any) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-2">Loading amazing projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-destructive">Failed to load projects. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold text-foreground">SummerUp 2025 Projects</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover innovative sustainable technology solutions created by talented teams. 
            Vote for your favorite project to support the Community Choice Award!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onVote={handleVote}
              onViewDetails={handleViewDetails}
              showVoting={true}
            />
          ))}
        </div>

        <ProjectDetailModal
          project={selectedProject}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />

        {projects && projects.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground">
              Projects will appear here once they're imported by the event organizers.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectGallery;