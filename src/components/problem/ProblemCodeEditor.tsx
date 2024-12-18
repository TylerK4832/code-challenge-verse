import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/CodeEditor";
import { useToast } from "@/components/ui/use-toast";

interface ProblemCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

const ProblemCodeEditor = ({ code, onChange }: ProblemCodeEditorProps) => {
  const { toast } = useToast();

  const handleRunCode = () => {
    toast({
      title: "Running test cases...",
      description: "All test cases passed!",
      className: "bg-[#00b8a3] text-white",
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 p-4 border-b border-border flex justify-between items-center">
        <div className="flex gap-4">
          <Button variant="secondary">JavaScript</Button>
        </div>
        <Button onClick={handleRunCode} className="bg-[#00b8a3] hover:bg-[#00a092]">
          Run Code
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <CodeEditor code={code} onChange={onChange} />
      </div>
    </div>
  );
};

export default ProblemCodeEditor;