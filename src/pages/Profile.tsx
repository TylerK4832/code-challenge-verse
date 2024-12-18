import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

interface ProfileStats {
  totalSolved: number;
  byDifficulty: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
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
        .select('username')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['profile-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get all successful submissions
      const { data: submissions, error } = await supabase
        .from('submissions')
        .select(`
          problem_id,
          problems (
            difficulty
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'success');

      if (error) throw error;

      // Count unique problems solved
      const uniqueProblemsSolved = new Set(submissions.map(s => s.problem_id));
      
      // Count by difficulty
      const byDifficulty = {
        Easy: 0,
        Medium: 0,
        Hard: 0
      };

      submissions.forEach(submission => {
        const difficulty = submission.problems?.difficulty;
        if (difficulty) {
          byDifficulty[difficulty as keyof typeof byDifficulty]++;
        }
      });

      return {
        totalSolved: uniqueProblemsSolved.size,
        byDifficulty
      };
    }
  });

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

  const difficultyData = stats ? [
    { name: 'Easy', value: stats.byDifficulty.Easy },
    { name: 'Medium', value: stats.byDifficulty.Medium },
    { name: 'Hard', value: stats.byDifficulty.Hard }
  ] : [];

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button variant="outline" onClick={() => navigate('/problems')}>
          Back to Problems
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="p-6 rounded-lg border bg-card">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="space-y-4">
              {isEditingUsername ? (
                <div className="space-y-2">
                  <Input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateUsername}>Save</Button>
                    <Button variant="outline" onClick={() => setIsEditingUsername(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Username</p>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">{profile?.username}</p>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingUsername(true)}>
                      Edit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h2 className="text-xl font-semibold mb-4">Problem Statistics</h2>
            <p className="text-4xl font-bold mb-2">{stats?.totalSolved || 0}</p>
            <p className="text-muted-foreground">Problems Solved</p>
          </div>
        </div>

        <div className="p-6 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold mb-4">Problems by Difficulty</h2>
          <ChartContainer className="w-full aspect-square" config={{}}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {difficultyData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartLegend
                content={
                  <ChartLegendContent
                    className="flex flex-col items-start gap-2"
                    payload={difficultyData.map((entry, index) => ({
                      value: `${entry.name} (${entry.value})`,
                      color: COLORS[index % COLORS.length],
                      type: 'circle',
                    }))}
                  />
                }
              />
            </PieChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default Profile;