import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, Trash2, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CSVProject {
  name: string;
  description: string;
  team_members: string;
  github_url?: string;
  demo_url?: string;
  video_url?: string;
}

const AdminProjectImport = () => {
  const [csvData, setCsvData] = useState("");
  const [sampleProject, setSampleProject] = useState({
    name: "",
    description: "",
    team_members: "",
    github_url: "",
    demo_url: "",
    video_url: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const clearDataMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("projects")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all projects
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Projects cleared",
        description: "All existing projects have been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const importCSVMutation = useMutation({
    mutationFn: async (projects: CSVProject[]) => {
      // First, get the active event
      const { data: events } = await supabase
        .from("events")
        .select("id")
        .eq("is_active", true)
        .limit(1);
      
      if (!events || events.length === 0) {
        throw new Error("No active event found");
      }

      const eventId = events[0].id;

      // Transform and insert projects
      const projectsToInsert = projects.map(project => ({
        event_id: eventId,
        name: project.name.trim(),
        description: project.description.trim(),
        team_members: project.team_members.split(',').map(member => member.trim()),
        github_url: project.github_url?.trim() || null,
        demo_url: project.demo_url?.trim() || null,
        video_url: project.video_url?.trim() || null,
      }));

      const { error } = await supabase
        .from("projects")
        .insert(projectsToInsert);

      if (error) throw error;
      return projectsToInsert.length;
    },
    onSuccess: (count) => {
      toast({
        title: "Import successful",
        description: `Imported ${count} projects successfully.`,
      });
      setCsvData("");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addSingleProjectMutation = useMutation({
    mutationFn: async (project: typeof sampleProject) => {
      const { data: events } = await supabase
        .from("events")
        .select("id")
        .eq("is_active", true)
        .limit(1);
      
      if (!events || events.length === 0) {
        throw new Error("No active event found");
      }

      const { error } = await supabase
        .from("projects")
        .insert({
          event_id: events[0].id,
          name: project.name.trim(),
          description: project.description.trim(),
          team_members: project.team_members.split(',').map(member => member.trim()),
          github_url: project.github_url?.trim() || null,
          demo_url: project.demo_url?.trim() || null,
          video_url: project.video_url?.trim() || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Project added",
        description: "Project added successfully.",
      });
      setSampleProject({
        name: "",
        description: "",
        team_members: "",
        github_url: "",
        demo_url: "",
        video_url: ""
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const parseCSV = (csv: string): CSVProject[] => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split('\t').map(h => h.trim()); // Use tab separator for Google Sheets
    
    return lines.slice(1).map(line => {
      const values = line.split('\t').map(v => v.trim().replace(/^"|"$/g, ''));
      const project: any = {};
      
      headers.forEach((header, index) => {
        project[header] = values[index] || '';
      });
      
      // Map Google Forms columns to our fields
      const teamName = project["What's the Name of your Project / Team?"] || '';
      const teamMembers = [
        project["What's your Name?"] || '',
        project["Who else is part of your Team?"] || ''
      ].filter(name => name.trim() !== '').join(', ');
      
      const description = [
        project["What problem(s) is your project adressing / solving?"] || '',
        project["What solution(s) do you propose?"] || '',
        project["Who is your target audience / users?"] || ''
      ].filter(desc => desc.trim() !== '').join(' | ');
      
      return {
        name: teamName,
        description: description,
        team_members: teamMembers,
        github_url: '',
        demo_url: '',
        video_url: '',
      };
    }).filter(project => project.name.trim() !== '');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvData(text);
      };
      reader.readAsText(file);
    }
  };

  const handleImportCSV = () => {
    if (!csvData.trim()) {
      toast({
        title: "No data",
        description: "Please paste CSV data or upload a file.",
        variant: "destructive",
      });
      return;
    }

    try {
      const projects = parseCSV(csvData);
      if (projects.length === 0) {
        throw new Error("No valid projects found in CSV");
      }
      importCSVMutation.mutate(projects);
    } catch (error: any) {
      toast({
        title: "CSV Parse Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Clear existing data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <span>Clear Existing Data</span>
          </CardTitle>
          <CardDescription>
            Remove all current projects before importing new ones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={() => clearDataMutation.mutate()}
            disabled={clearDataMutation.isPending}
          >
            {clearDataMutation.isPending ? "Clearing..." : "Clear All Projects"}
          </Button>
        </CardContent>
      </Card>

      {/* CSV Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Import from CSV</span>
          </CardTitle>
          <CardDescription>
            Upload a CSV file or paste CSV data. Expected columns: name, description, team_members, github_url, demo_url, video_url
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="csv-file">Upload CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </div>
          
          <div>
            <Label htmlFor="csv-data">Or Paste CSV Data</Label>
            <Textarea
              id="csv-data"
              placeholder="name,description,team_members,github_url,demo_url,video_url
EcoTrack,A mobile app for sustainable living,Sarah Chen,Marcus Rodriguez,Aisha Patel,https://github.com/example/ecotrack,https://ecotrack-demo.vercel.app,https://youtube.com/watch?v=demo1"
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          
          <Button 
            onClick={handleImportCSV}
            disabled={importCSVMutation.isPending}
            className="w-full"
          >
            {importCSVMutation.isPending ? "Importing..." : "Import Projects"}
          </Button>
        </CardContent>
      </Card>

      {/* Single project entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Single Project</span>
          </CardTitle>
          <CardDescription>
            Manually add one project at a time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={sampleProject.name}
                onChange={(e) => setSampleProject({...sampleProject, name: e.target.value})}
                placeholder="EcoTrack"
              />
            </div>
            <div>
              <Label htmlFor="team">Team Members * (comma-separated)</Label>
              <Input
                id="team"
                value={sampleProject.team_members}
                onChange={(e) => setSampleProject({...sampleProject, team_members: e.target.value})}
                placeholder="Sarah Chen, Marcus Rodriguez, Aisha Patel"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={sampleProject.description}
              onChange={(e) => setSampleProject({...sampleProject, description: e.target.value})}
              placeholder="A mobile app that gamifies sustainable living..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                value={sampleProject.github_url}
                onChange={(e) => setSampleProject({...sampleProject, github_url: e.target.value})}
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div>
              <Label htmlFor="demo">Demo URL</Label>
              <Input
                id="demo"
                value={sampleProject.demo_url}
                onChange={(e) => setSampleProject({...sampleProject, demo_url: e.target.value})}
                placeholder="https://demo.example.com"
              />
            </div>
            <div>
              <Label htmlFor="video">Video URL</Label>
              <Input
                id="video"
                value={sampleProject.video_url}
                onChange={(e) => setSampleProject({...sampleProject, video_url: e.target.value})}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
          
          <Button 
            onClick={() => addSingleProjectMutation.mutate(sampleProject)}
            disabled={addSingleProjectMutation.isPending || !sampleProject.name || !sampleProject.description || !sampleProject.team_members}
            className="w-full"
          >
            {addSingleProjectMutation.isPending ? "Adding..." : "Add Project"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProjectImport;