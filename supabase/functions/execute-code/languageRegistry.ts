import { LanguageConfig } from './types/languageWrappers.ts';
import { javascriptWrapper } from './languages/javascript.ts';

const languageRegistry: LanguageConfig[] = [
  {
    id: 63,
    name: 'javascript',
    wrapper: javascriptWrapper,
  },
  // Add more languages here as they become available
];

export const getLanguageWrapper = (languageId: number): LanguageConfig | undefined => {
  return languageRegistry.find(lang => lang.id === languageId);
};