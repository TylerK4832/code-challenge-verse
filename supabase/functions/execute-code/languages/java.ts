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

class SimpleJsonUtil {
    /**
     * Converts a List of Map<String, Object> to a minimal JSON-like string.
     * Assumes flat structures and string or primitive-like values.
     */
    public static String toJson(List<Map<String, Object>> data) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < data.size(); i++) {
            Map<String, Object> map = data.get(i);
            sb.append("{");

            int entryIndex = 0;
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                sb.append("\\"");
                sb.append(escapeJson(entry.getKey()));
                sb.append("\\\": ");
                
                Object value = entry.getValue();
                if (value instanceof String) {
                    sb.append("\\"");
                    sb.append(escapeJson((String) value));
                    sb.append("\\"");
                } else {
                    // For simplicity, directly append other types (numbers, booleans, etc.)
                    sb.append(value);
                }

                if (entryIndex < map.size() - 1) {
                    sb.append(", ");
                }
                entryIndex++;
            }

            sb.append("}");
            if (i < data.size() - 1) {
                sb.append(", ");
            }
        }
        sb.append("]");
        return sb.toString();
    }

    /**
     * Minimal escaping for quotes and backslashes in strings.
     */
    private static String escapeJson(String str) {
        return str.replace("\\", "\\\\")
                  .replace("\\"", "\\\"");
    }
}

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

        // Print final test results as JSON
        System.out.println("WRAPPER_RESULTS " + SimpleJsonUtil.toJson(results));
        
        // Print logs as JSON
        System.out.println("WRAPPER_LOGS " + SimpleJsonUtil.toJson(logs));
    }
}`;
  }
};
