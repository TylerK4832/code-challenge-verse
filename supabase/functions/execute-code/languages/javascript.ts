import { LanguageWrapper } from '../types/languageWrappers.ts';

export const javascriptWrapper: LanguageWrapper = {
  wrapCode: (userCode: string, testCodeList: string[]): string => {
    const wrappedCode = `
const assert = require('assert');

${userCode}

// Test cases
try {
  ${testCodeList.map((test, index) => `
  try {
    ${test}
  } catch (error) {
    console.log(JSON.stringify({
      testIndex: ${index},
      passed: false,
      error: error.message
    }));
    continue;
  }
  console.log(JSON.stringify({
    testIndex: ${index},
    passed: true
  }));`).join('\n')}
} catch (error) {
  console.error('Test execution error:', error);
}`;

    return wrappedCode;
  }
};