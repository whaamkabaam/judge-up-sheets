import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Settings } from "lucide-react";

interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  max_score: number;
}

export const EventSettings = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<Criterion | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    weight: 1,
    max_score: 10,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: criteria, isLoading } = useQuery({
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

  const createCriterionMutation = useMutation({
    mutationFn: async (criterion: Omit<Criterion, "id">) => {
      const { error } = await supabase
        .from("criteria")
        .insert(criterion);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Criterion created!",
        description: "The new judging criterion has been added.",
      });
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Error creating criterion",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCriterionMutation = useMutation({
    mutationFn: async ({ id, ...criterion }: Criterion) => {
      const { error } = await supabase
        .from("criteria")
        .update(criterion)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Criterion updated!",
        description: "The judging criterion has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Error updating criterion",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCriterionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("criteria")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Criterion deleted!",
        description: "The judging criterion has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting criterion",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (criterion?: Criterion) => {
    if (criterion) {
      setEditingCriterion(criterion);
      setFormData({
        name: criterion.name,
        description: criterion.description,
        weight: criterion.weight,
        max_score: criterion.max_score,
      });
    } else {
      setEditingCriterion(null);
      setFormData({
        name: "",
        description: "",
        weight: 1,
        max_score: 10,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCriterion(null);
    setFormData({
      name: "",
      description: "",
      weight: 1,
      max_score: 10,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a criterion name.",
        variant: "destructive",
      });
      return;
    }

    if (editingCriterion) {
      updateCriterionMutation.mutate({
        ...editingCriterion,
        ...formData,
      });
    } else {
      createCriterionMutation.mutate(formData);
    }
  };

  const totalWeight = criteria?.reduce((sum, c) => sum + c.weight, 0) || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Judging Criteria
          </CardTitle>
          <CardDescription>
            Define the criteria that judges will use to evaluate projects. 
            The weights represent the relative importance of each criterion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              Total Weight: <span className="font-medium">{totalWeight}%</span>
              {totalWeight !== 100 && (
                <span className="text-amber-600 ml-2">
                  (Should total 100% for accurate scoring)
                </span>
              )}
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Criterion
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCriterion ? "Edit Criterion" : "Add New Criterion"}
                  </DialogTitle>
                  <DialogDescription>
                    Define a new judging criterion that judges will use to evaluate projects.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="criterion-name">Name</Label>
                      <Input
                        id="criterion-name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Technical Innovation"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="criterion-description">Description</Label>
                      <Textarea
                        id="criterion-description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what judges should look for..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="criterion-weight">Weight (%)</Label>
                        <Input
                          id="criterion-weight"
                          type="number"
                          min="1"
                          max="100"
                          value={formData.weight}
                          onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) || 1 }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="criterion-max-score">Max Score</Label>
                        <Input
                          id="criterion-max-score"
                          type="number"
                          min="1"
                          max="100"
                          value={formData.max_score}
                          onChange={(e) => setFormData(prev => ({ ...prev, max_score: parseInt(e.target.value) || 10 }))}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createCriterionMutation.isPending || updateCriterionMutation.isPending}
                    >
                      {editingCriterion ? "Update" : "Create"} Criterion
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : criteria && criteria.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Max Score</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criteria.map((criterion) => (
                  <TableRow key={criterion.id}>
                    <TableCell className="font-medium">{criterion.name}</TableCell>
                    <TableCell className="max-w-xs truncate" title={criterion.description}>
                      {criterion.description}
                    </TableCell>
                    <TableCell>{criterion.weight}%</TableCell>
                    <TableCell>{criterion.max_score}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(criterion)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Criterion</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{criterion.name}"? 
                                This will also remove all associated scores. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteCriterionMutation.mutate(criterion.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No judging criteria defined yet.</p>
              <p className="text-sm">Start by adding your first criterion above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};