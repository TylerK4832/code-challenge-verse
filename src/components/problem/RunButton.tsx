import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface RunButtonProps {
  onClick: () => void;
  isRunning: boolean;
}

export const RunButton = ({ onClick, isRunning }: RunButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      className="bg-[#00b8a3] hover:bg-[#00a092]"
      disabled={isRunning}
    >
      {isRunning ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Running...
        </>
      ) : (
        "Run Code"
      )}
    </Button>
  );
};