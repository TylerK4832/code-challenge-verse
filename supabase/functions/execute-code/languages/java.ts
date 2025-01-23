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
            System.out.println("TEST_START " + currentTestIndex);
            ${indentCode(testCode, 12)}
            Map<String, Object> result = new HashMap<>();
            result.put("passed", true);
            results.add(result);
            System.out.println("TEST_END " + currentTestIndex);
        } catch (AssertionError | Exception error) {
            Map<String, Object> result = new HashMap<>();
            result.put("error", error.getMessage());
            results.add(result);
            System.out.println("TEST_END " + currentTestIndex);
        }
`;
  }).join('\n');
}

export const javaWrapper: LanguageWrapper = {
  wrapCode: (userCode: string, testCodeList: string[]) => {
    return `
import java.util.*;
import java.io.*;

class SimpleJsonUtil {
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
                sb.append("\\": ");
                
                Object value = entry.getValue();
                if (value instanceof String) {
                    sb.append("\\"");
                    sb.append(escapeJson(value.toString()));
                    sb.append("\\"");
                } else {
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

    private static String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\\\\", "\\\\\\\\")
                 .replace("\\"", "\\\\\\"")
                 .replace("\\n", "\\\\n")
                 .replace("\\r", "\\\\r")
                 .replace("\\t", "\\\\t")
                 .replace("\\b", "\\\\b")
                 .replace("\\f", "\\\\f");
    }
}

${userCode}

public class Main {
    public static void main(String[] args) {

        // Assertion utility
        public static void assertEquals(Object output, Object expected) {
            if (!java.util.Objects.equals(output, expected)) {
                throw new AssertionError("Expected " + expected + " but got " + output);
            }
        }

        List<Map<String, Object>> results = new ArrayList<>();
        List<Map<String, Object>> logs = new ArrayList<>();
        int currentTestIndex = -1;

        // Create a custom PrintStream to capture System.out
        PrintStream originalOut = System.out;
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PrintStream customOut = new PrintStream(outputStream);
        System.setOut(customOut);

        // Run test cases
${formatTestCodeList(testCodeList)}

        // Process captured output
        System.setOut(originalOut);
        String capturedOutput = outputStream.toString();
        String[] lines = capturedOutput.split("\\n");
        int currentCapturingTest = -1;
        StringBuilder currentOutput = new StringBuilder();

        for (String line : lines) {
            if (line.startsWith("TEST_START ")) {
                currentCapturingTest = Integer.parseInt(line.substring(11).trim());
                currentOutput = new StringBuilder();
            } else if (line.startsWith("TEST_END ")) {
                if (currentCapturingTest >= 0 && currentOutput.length() > 0) {
                    Map<String, Object> log = new HashMap<>();
                    log.put("testIndex", currentCapturingTest);
                    log.put("message", currentOutput.toString().trim());
                    logs.add(log);
                }
                currentCapturingTest = -1;
            } else if (currentCapturingTest >= 0) {
                currentOutput.append(line).append("\\n");
            }
        }

        // Print results and logs with proper JSON escaping
        System.out.println("WRAPPER_RESULTS " + SimpleJsonUtil.toJson(results));
        System.out.println("WRAPPER_LOGS " + SimpleJsonUtil.toJson(logs));
    }
}`;
  }
};