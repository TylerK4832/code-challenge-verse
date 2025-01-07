import { TestCase } from '../types';

export function validateTestCases(testCases: TestCase[]) {
  if (!Array.isArray(testCases) || testCases.length === 0) {
    throw new Error('No test cases provided');
  }

  testCases.forEach((testCase, index) => {
    if (!testCase.code) {
      throw new Error(`Test case ${index + 1} is missing code`);
    }
  });
}

export function parseTestOutput(stdout: string | null): { passed: boolean; error?: string }[] {
  if (!stdout) {
    return [{ passed: false, error: 'No output received from program' }];
  }

  try {
    // Split by newline and filter out empty lines
    const lines = stdout.split('\n').filter(line => line.trim() !== '');
    
    return lines.map(line => {
      try {
        const result = JSON.parse(line);
        return {
          passed: result.passed === true,
          error: result.error || undefined
        };
      } catch (e) {
        return {
          passed: false,
          error: `Invalid test result format: ${line}`
        };
      }
    });
  } catch (e) {
    return [{
      passed: false,
      error: 'Failed to parse test results'
    }];
  }
}