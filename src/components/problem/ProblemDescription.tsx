import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import TwoSumDescription from "@/components/TwoSumDescription";
import AddTwoNumbersDescription from "@/components/AddTwoNumbersDescription";
import LongestSubstringDescription from "@/components/LongestSubstringDescription";
import MedianSortedArraysDescription from "@/components/MedianSortedArraysDescription";

interface ProblemDescriptionProps {
  problemId: string;
}

const ProblemDescription = ({ problemId }: ProblemDescriptionProps) => {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const checkCompletion = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: submissions } = await supabase
        .from('submissions')
        .select('*')
        .eq('problem_id', problemId)
        .eq('user_id', user.id)
        .eq('status', 'accepted')
        .maybeSingle();

      setIsCompleted(!!submissions);
    };

    checkCompletion();
  }, [problemId]);

  const getProblemDescription = () => {
    switch (problemId) {
      case 'two-sum':
        return <TwoSumDescription />;
      case 'add-two-numbers':
        return <AddTwoNumbersDescription />;
      case 'longest-substring':
        return <LongestSubstringDescription />;
      case 'median-sorted-arrays':
        return <MedianSortedArraysDescription />;
      default:
        return <div>Problem not found</div>;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          {isCompleted && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </div>
        {getProblemDescription()}
      </div>
    </ScrollArea>
  );
};

export default ProblemDescription;