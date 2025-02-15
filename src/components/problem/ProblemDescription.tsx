import { ScrollArea } from "@/components/ui/scroll-area";
import TwoSumDescription from "@/components/TwoSumDescription";
import AddTwoNumbersDescription from "@/components/AddTwoNumbersDescription";
import LongestSubstringDescription from "@/components/LongestSubstringDescription";
import MedianSortedArraysDescription from "@/components/MedianSortedArraysDescription";
import ParkingLotDescription from "@/components/ParkingLotDescription";

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
      case 'parking-lot':
        return <ParkingLotDescription />;
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