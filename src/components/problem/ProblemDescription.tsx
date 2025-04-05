
import { ScrollArea } from "@/components/ui/scroll-area";
import GenericProblemDescription from "@/components/problem/GenericProblemDescription";

interface ProblemDescriptionProps {
  problemId: string;
}

const ProblemDescription = ({ problemId }: ProblemDescriptionProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <GenericProblemDescription problemId={problemId} />
      </div>
    </ScrollArea>
  );
};

export default ProblemDescription;
