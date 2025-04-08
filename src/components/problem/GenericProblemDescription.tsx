
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReactNode, useState, useEffect } from 'react';

interface ProblemDescriptionProps {
  problemId: string;
}

const GenericProblemDescription = ({ problemId }: ProblemDescriptionProps) => {
  const { data: problem, isLoading } = useQuery({
    queryKey: ['problem', problemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems')
        .select('title, difficulty')
        .eq('id', problemId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const [ContentComponent, setContentComponent] = useState<React.ComponentType | null>(null);
  const [isContentLoading, setIsContentLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setIsContentLoading(true);
      try {
        // Dynamic import based on problem ID
        const formattedProblemId = problemId.toLowerCase().replace(/[^\w-]+/g, '');
        const ContentModule = await import(`../problem-content/${formattedProblemId}-content`).catch(() => 
          import('../problem-content/fallback-content')
        );
        setContentComponent(() => ContentModule.default);
      } catch (err) {
        console.error(`Error loading content for ${problemId}:`, err);
        const FallbackModule = await import('../problem-content/fallback-content');
        setContentComponent(() => FallbackModule.default);
      } finally {
        setIsContentLoading(false);
      }
    };

    loadContent();
  }, [problemId]);

  if (isLoading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48 mb-4"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{problem?.title}</h1>
        <Badge className={`${
          problem?.difficulty === 'Easy' ? 'bg-green-500' :
          problem?.difficulty === 'Medium' ? 'bg-[#ffc01e] text-black' :
          'bg-red-500'
        }`}>
          {problem?.difficulty}
        </Badge>
      </div>

      {isContentLoading ? (
        <div className="p-6 animate-pulse">Loading problem content...</div>
      ) : ContentComponent ? (
        <ContentComponent />
      ) : (
        <div className="p-6 text-red-500">
          Failed to load problem content. Please try refreshing the page.
        </div>
      )}
    </div>
  );
};

export default GenericProblemDescription;
