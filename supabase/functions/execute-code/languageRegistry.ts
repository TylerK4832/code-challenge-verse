import { LanguageConfig } from './types/languageWrappers.ts';
import { javascriptWrapper } from './languages/javascript.ts';
import { pythonWrapper } from './languages/python.ts';
import { javaWrapper } from './languages/java.ts';

const languageRegistry: LanguageConfig[] = [
  {
    id: 63,
    name: 'javascript',
    wrapper: javascriptWrapper,
  },
  {
    id: 71,
    name: 'python',
    wrapper: pythonWrapper,
  },
  {
    id: 62,
    name: 'java',
    wrapper: javaWrapper,
  }
];

export const getLanguageWrapper = (languageId: number): LanguageConfig | undefined => {
  return languageRegistry.find(lang => lang.id === languageId);
};