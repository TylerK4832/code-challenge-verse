
import { LanguageConfig } from './types/languageWrappers.ts';
import { javascriptWrapper } from './languages/javascript.ts';
import { pythonWrapper } from './languages/python.ts';
import { javaWrapper } from './languages/java.ts';
import { cppWrapper } from './languages/cpp.ts';

const languageRegistry: LanguageConfig[] = [
  {
    id: 63,
    name: 'javascript',
    wrapper: javascriptWrapper,
    base64: false,
  },
  {
    id: 71,
    name: 'python',
    wrapper: pythonWrapper,
    base64: false,
  },
  {
    id: 62,
    name: 'java',
    wrapper: javaWrapper,
    base64: false,
  },
  {
    id: 54,
    name: 'cpp',
    wrapper: cppWrapper,
    base64: true,
  }
];

export const getLanguageWrapper = (languageId: number): LanguageConfig | undefined => {
  return languageRegistry.find(lang => lang.id === languageId);
};
