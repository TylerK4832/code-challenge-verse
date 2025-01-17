import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const LANGUAGES = [
  { id: 63, name: 'JavaScript' },
  { id: 71, name: 'Python' },
  { id: 62, name: 'Java' },
  { id: 54, name: 'C++' }
];

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
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};