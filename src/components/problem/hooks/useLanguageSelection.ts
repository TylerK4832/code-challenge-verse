import { useState } from "react";
import { LANGUAGES, getDefaultCode } from "@/config/languages";

export const useLanguageSelection = (problemId: string | undefined, onCodeChange: (code: string) => void) => {
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);

  const handleLanguageChange = (languageId: string) => {
    const language = LANGUAGES.find(l => l.id === parseInt(languageId));
    if (language) {
      setSelectedLanguage(language);
      // Set default code for the new language
      onCodeChange(getDefaultCode(problemId || '', language.id));
    }
  };

  return {
    selectedLanguage,
    handleLanguageChange
  };
};