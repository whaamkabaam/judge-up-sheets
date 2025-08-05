import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Upload, BarChart3, Users, ArrowLeft } from "lucide-react";
import AdminProjectImport from "@/components/AdminProjectImport";
import Header from "@/components/Header";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("import");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your hackathon event and projects</p>
              </div>
            </div>
            
            <Button variant="outline" asChild>
              <a href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Event
              </a>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="import" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Import Projects</span>
            </TabsTrigger>
            <TabsTrigger value="judges" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Manage Judges</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Results</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Event Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="import">
            <AdminProjectImport />
          </TabsContent>

          <TabsContent value="judges">
            <Card>
              <CardHeader>
                <CardTitle>Judge Management</CardTitle>
                <CardDescription>
                  Invite judges and manage their assignments (Coming Soon)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Judge invitation system will be available in the next update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Event Results</CardTitle>
                <CardDescription>
                  View judging progress and community voting results (Coming Soon)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Results dashboard will be available once judging is implemented.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Event Settings</CardTitle>
                <CardDescription>
                  Configure your hackathon event details (Coming Soon)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Event configuration interface will be available in the next update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;