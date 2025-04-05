
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { ReactNode } from 'react';

// Import all problem content components
import TwoSumContent from '@/components/problem-content/TwoSumContent';
import AddTwoNumbersContent from '@/components/problem-content/AddTwoNumbersContent';
import LongestSubstringContent from '@/components/problem-content/LongestSubstringContent';
import MedianSortedArraysContent from '@/components/problem-content/MedianSortedArraysContent';
import ParkingLotContent from '@/components/problem-content/ParkingLotContent';

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

  const getProblemContent = (): ReactNode => {
    switch (problemId) {
      case 'two-sum':
        return <TwoSumContent />;
      case 'add-two-numbers':
        return <AddTwoNumbersContent />;
      case 'longest-substring':
        return <LongestSubstringContent />;
      case 'median-sorted-arrays':
        return <MedianSortedArraysContent />;
      case 'parking-lot':
        return <ParkingLotContent />;
      default:
        return <div>Problem content not found</div>;
    }
  };

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

      {getProblemContent()}
    </div>
  );
};

export default GenericProblemDescription;
