import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function formatJoinedDate(dateStr: string) {
  const date = new Date(dateStr);
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `Joined ${month} ${year}`;
}

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('username, created_at')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Placeholder values
  const totalSolved = 42;
  const recentProblems = [
    { id: 'two-sum', title: 'Two Sum' },
    { id: 'add-two-numbers', title: 'Add Two Numbers' },
    { id: 'longest-substring', title: 'Longest Substring Without Repeating Characters' },
    { id: 'median-sorted-arrays', title: 'Median of Two Sorted Arrays' },
  ];

  useEffect(() => {
    if (profile?.username) {
      setNewUsername(profile.username);
    }
  }, [profile]);

  const handleUpdateUsername = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ username: newUsername })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update username",
        variant: "destructive"
      });
    } else {
      setIsEditingUsername(false);
      toast({
        title: "Success",
        description: "Username updated successfully"
      });
    }
  };

  const joinedDate = profile?.created_at
    ? formatJoinedDate(profile.created_at)
    : "Joined January 2022";

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <h1 className="text-3xl font-bold">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Info Panel */}
        <Card>
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-16 w-16 mb-4 bg-muted flex items-center justify-center">
              <User className="h-10 w-10 text-muted-foreground" />
            </Avatar>
            {isEditingUsername ? (
              <>
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter new username"
                  className="my-2"
                />
                <div className="flex gap-2">
                  <Button onClick={handleUpdateUsername}>Save</Button>
                  <Button variant="outline" onClick={() => setIsEditingUsername(false)}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <CardTitle>{profile?.username || "No Username"}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingUsername(true)}>
                  Edit
                </Button>
              </div>
            )}
            <CardDescription className="mt-2">{joinedDate}</CardDescription>
          </CardHeader>
        </Card>

        {/* Problems Stats Panel */}
        <Card className="flex flex-col items-center justify-center">
          <CardHeader className="flex flex-col items-center text-center">
            <div className="text-6xl font-bold leading-none">{totalSolved}</div>
            <div className="text-sm text-muted-foreground">Problems Solved</div>
          </CardHeader>
          <CardContent className="w-full">
            <h3 className="text-lg font-semibold mb-2">Recently Solved Problems:</h3>
            <div className="grid grid-cols-1 gap-2">
              {recentProblems.map((problem) => (
                <Link
                  to={`/problem/${problem.id}`}
                  key={problem.id}
                  className="block rounded-md border p-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  {problem.title}
                </Link>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button variant="outline" onClick={() => navigate('/problems')}>
              View All Problems
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
