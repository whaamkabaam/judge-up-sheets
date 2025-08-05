import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail } from "lucide-react";

interface Judge {
  id: string;
  name: string;
  email: string;
  invitation_status: string;
  created_at: string;
}

export const ManageJudges = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: judges, isLoading } = useQuery({
    queryKey: ["judges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("judges")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Judge[];
    },
  });

  const inviteJudgeMutation = useMutation({
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      // First check if judge already exists
      const { data: existing } = await supabase
        .from("judges")
        .select("id")
        .eq("email", email)
        .single();

      if (existing) {
        throw new Error("A judge with this email already exists");
      }

      // Insert new judge
      const { error } = await supabase
        .from("judges")
        .insert({
          name,
          email,
          invitation_status: "pending",
          auth_token: crypto.randomUUID(),
          token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Judge invited!",
        description: "The invitation has been sent successfully.",
      });
      setName("");
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["judges"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error inviting judge",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both name and email.",
        variant: "destructive",
      });
      return;
    }
    inviteJudgeMutation.mutate({ name: name.trim(), email: email.trim() });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "accepted":
        return <Badge variant="default">Active</Badge>;
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Invite New Judge */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite New Judge
          </CardTitle>
          <CardDescription>
            Add a new judge to the event. They'll receive an email invitation to join.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="judge-name">Name</Label>
                <Input
                  id="judge-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Judge's full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="judge-email">Email</Label>
                <Input
                  id="judge-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="judge@example.com"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={inviteJudgeMutation.isPending}
              className="w-full md:w-auto"
            >
              <Mail className="mr-2 h-4 w-4" />
              {inviteJudgeMutation.isPending ? "Sending Invitation..." : "Send Invitation"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Judges List */}
      <Card>
        <CardHeader>
          <CardTitle>Judges</CardTitle>
          <CardDescription>
            Manage all judges for this event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : judges && judges.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {judges.map((judge) => (
                  <TableRow key={judge.id}>
                    <TableCell className="font-medium">{judge.name}</TableCell>
                    <TableCell>{judge.email}</TableCell>
                    <TableCell>{getStatusBadge(judge.invitation_status)}</TableCell>
                    <TableCell>
                      {new Date(judge.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No judges invited yet.</p>
              <p className="text-sm">Start by inviting your first judge above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};