import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES } from "@/config/languages";

interface EditorToolbarProps {
  selectedLanguage: { id: number; name: string };
  onLanguageChange: (languageId: string) => void;
  onRunCode: () => void;
  isRunning: boolean;
}

const EditorToolbar = ({
  selectedLanguage,
  onLanguageChange,
  onRunCode,
  isRunning,
}: EditorToolbarProps) => {
  return (
    <div className="shrink-0 p-4 border-b border-border flex justify-between items-center">
      <Select
        value={selectedLanguage.id.toString()}
        onValueChange={onLanguageChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((language) => (
            <SelectItem key={language.id} value={language.id.toString()}>
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button 
        onClick={onRunCode} 
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
    </div>
  );
};

export default EditorToolbar;