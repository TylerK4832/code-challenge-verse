
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
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setIsContentLoading(true);
      setLoadError(null);
      
      try {
        // Format the problem ID for file path construction
        const formattedProblemId = problemId.toLowerCase().replace(/[^\w-]+/g, '');
        console.log(`Attempting to load content for problem: ${formattedProblemId}`);
        
        // Try to import the content component
        const ContentModule = await import(`../problem-content/${formattedProblemId}-content.tsx`)
          .catch(async (err) => {
            console.error(`Error importing ${formattedProblemId}-content.tsx:`, err);
            // Try fallback
            return import('../problem-content/fallback-content');
          });
          
        setContentComponent(() => ContentModule.default);
      } catch (err) {
        console.error(`Failed to load content for ${problemId}:`, err);
        setLoadError(`Could not load problem description for ${problemId}`);
        
        // Set fallback content
        try {
          const FallbackModule = await import('../problem-content/fallback-content');
          setContentComponent(() => FallbackModule.default);
        } catch (fallbackErr) {
          console.error("Failed to load even the fallback content:", fallbackErr);
        }
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
      ) : loadError ? (
        <div className="p-6 text-red-500">
          {loadError}
        </div>
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
