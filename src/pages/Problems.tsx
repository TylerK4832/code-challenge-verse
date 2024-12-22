import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  acceptance: string;
  completed?: boolean;
}

const fetchProblems = async () => {
  // Fetch problems
  const { data: problems, error: problemsError } = await supabase
    .from('problems')
    .select('*')
    .order('title');
    
  if (problemsError) throw problemsError;

  // Fetch user's successful submissions
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return problems;

  const { data: submissions } = await supabase
    .from('submissions')
    .select('problem_id')
    .eq('user_id', user.id)
    .eq('status', 'accepted');

  // Create a set of completed problem IDs
  const completedProblems = new Set(submissions?.map(s => s.problem_id) || []);

  // Mark problems as completed
  return problems.map(problem => ({
    ...problem,
    completed: completedProblems.has(problem.id)
  }));
};

const Problems = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: problems = [], isLoading } = useQuery({
    queryKey: ['problems'],
    queryFn: fetchProblems,
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'problems'
        },
        () => {
          // Invalidate and refetch problems when there's a change
          void fetchProblems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const categories = Array.from(new Set(problems.map(p => p.category)));

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || problem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/10 text-green-500';
      case 'Medium':
        return 'bg-[#ffc01e]/10 text-[#ffc01e]';
      case 'Hard':
        return 'bg-red-500/10 text-red-500';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading problems...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-3xl font-bold">Problems</h1>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[200px] sm:w-[300px]"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "secondary" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "secondary" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Acceptance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProblems.map((problem) => (
                <TableRow
                  key={problem.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/problem/${problem.id}`)}
                >
                  <TableCell className="w-[40px]">
                    {problem.completed && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{problem.title}</TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{problem.category}</TableCell>
                  <TableCell className="hidden sm:table-cell">{problem.acceptance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Problems;