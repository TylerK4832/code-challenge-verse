
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const LANGUAGES = [
  { id: 54, name: 'cpp', displayName: 'C++' },
  { id: 62, name: 'java', displayName: 'Java' },
  { id: 63, name: 'javascript', displayName: 'JavaScript' },
  { id: 71, name: 'python', displayName: 'Python' }
].sort((a, b) => a.displayName.localeCompare(b.displayName));

interface LanguageSelectorProps {
  selectedLanguage: typeof LANGUAGES[0];
  onLanguageChange: (languageId: string) => void;
}

export const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  return (
    <Select
      value={selectedLanguage.id.toString()}
      onValueChange={onLanguageChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map(lang => (
          <SelectItem key={lang.id} value={lang.id.toString()}>
            {lang.displayName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
