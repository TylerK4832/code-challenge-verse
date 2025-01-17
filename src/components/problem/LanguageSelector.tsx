import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const LANGUAGES = [
  { 
    id: 63, 
    name: 'JavaScript',
    defaultCode: (problemId: string) => {
      switch (problemId) {
        case 'two-sum':
          return `function twoSum(nums, target) {
  // Write your solution here
}`;
        default:
          return '// Write your solution here';
      }
    }
  },
  { 
    id: 71, 
    name: 'Python',
    defaultCode: (problemId: string) => {
      switch (problemId) {
        case 'two-sum':
          return `def twoSum(nums, target):
    # Write your solution here
    pass`;
        default:
          return '# Write your solution here';
      }
    }
  },
  {
    id: 62,
    name: 'Java',
    defaultCode: (problemId: string) => {
      switch (problemId) {
        case 'two-sum':
          return `class Solution {
  public int[] twoSum(int[] nums, int target) {
    // Write your solution here
    return new int[]{};
  }
}`;
        default:
          return `class Solution {
    // Write your solution here
}`;
      }
    }
  },
  {
    id: 54, // Changed back to 54 which is C++17 in Judge0
    name: 'C++',
    defaultCode: (problemId: string) => {
      switch (problemId) {
        case 'two-sum':
          return `vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    return {};
}`;
        default:
          return '// Write your solution here';
      }
    }
  }
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