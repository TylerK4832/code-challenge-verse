import { ScrollArea } from "@/components/ui/scroll-area";
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
        {getProblemDescription()}
      </div>
    </ScrollArea>
  );
};

export default ProblemDescription;