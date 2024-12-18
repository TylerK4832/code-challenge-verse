import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  acceptance: string;
}

const problems: Problem[] = [
  {
    id: "two-sum",
    title: "1. Two Sum",
    difficulty: "Easy",
    category: "Array",
    acceptance: "49.2%"
  },
  {
    id: "add-two-numbers",
    title: "2. Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List",
    acceptance: "39.8%"
  },
  {
    id: "longest-substring",
    title: "3. Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String",
    acceptance: "33.5%"
  },
  {
    id: "median-sorted-arrays",
    title: "4. Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Array",
    acceptance: "35.1%"
  }
];

const Problems = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

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

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
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