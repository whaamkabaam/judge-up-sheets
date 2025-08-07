import { useState, useMemo } from "react";
import ProjectCard from "./ProjectCard";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { useProjects, useVoteForProject } from "@/hooks/useProjects";
import { Loader2, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProjectGallery = () => {
  const { data: projects, isLoading, error } = useProjects();
  const voteForProject = useVoteForProject();
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "votes" | "recent">("name");

  const handleVote = async (projectId: string) => {
    await voteForProject.mutateAsync(projectId);
  };

  const handleViewDetails = (project: any) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const filteredProjects = useMemo(() => {
    if (!projects) return [] as any[];
    const term = search.toLowerCase().trim();
    let list = projects.filter((p: any) => {
      const inName = p.name?.toLowerCase().includes(term);
      const inDesc = p.description?.toLowerCase().includes(term);
      const inTeam = Array.isArray(p.team_members) && p.team_members.join(" ").toLowerCase().includes(term);
      return !term || inName || inDesc || inTeam;
    });
    if (sortBy === "name") {
      list.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else if (sortBy === "votes") {
      list.sort((a: any, b: any) => (b.votes || 0) - (a.votes || 0));
    } else if (sortBy === "recent") {
      list.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return list;
  }, [projects, search, sortBy]);
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

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          <div className="w-full md:w-1/2">
            <Input
              placeholder="Search projects, descriptions, or team members"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="name">Name (A–Z)</SelectItem>
                <SelectItem value="votes">Most Votes</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="animate-fade-in">
              <ProjectCard
                project={project}
                onVote={handleVote}
                onViewDetails={handleViewDetails}
                showVoting={true}
              />
            </div>
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