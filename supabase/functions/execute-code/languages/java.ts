import { LanguageWrapper } from '../types/languageWrappers.ts';

function indentCode(code: string, spaces: number): string {
  return code.split('\n')
    .map(line => ' '.repeat(spaces) + line)
    .join('\n');
}

function formatTestCodeList(testCodeList: string[]): string {
  return testCodeList.map((testCode, index) => {
    return `        try {
            currentTestIndex = ${index};
            ${indentCode(testCode, 12)}
            Map<String, Object> result = new HashMap<>();
            result.put("passed", true);
            results.add(result);
        } catch (AssertionError | Exception error) {
            Map<String, Object> result = new HashMap<>();
            result.put("error", error.getMessage());
            results.add(result);
        }
`;
  }).join('\n');
}

export const javaWrapper: LanguageWrapper = {
  wrapCode: (userCode: string, testCodeList: string[]) => {
    return `
import java.util.*;

class Solution {
${indentCode(userCode, 4)}
}

public class Main {
    public static void main(String[] args) {
        // Store test results
        List<Map<String, Object>> results = new ArrayList<>();
        List<Map<String, Object>> logs = new ArrayList<>();
        int currentTestIndex = -1;

        // Run test cases
${formatTestCodeList(testCodeList)}

        // Reset currentTestIndex
        currentTestIndex = -1;

        // Print final test results
        System.out.println("WRAPPER_RESULTS " + results.toString());
        
        // Print logs
        System.out.println("WRAPPER_LOGS " + logs.toString());
    }
}`;
  }
};