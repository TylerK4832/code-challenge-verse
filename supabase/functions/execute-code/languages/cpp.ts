import { LanguageWrapper } from '../types/languageWrappers.ts';

function formatTestCodeList(testCodeList: string[]) {
  return testCodeList.map((code, index) => 
    `
    try {
        currentTestIndex = ${index};
        // Create a new Solution instance for each test
        // Solution solution;
${code}
        std::map<std::string, std::string> result;
        result["passed"] = "true";
        results.push_back(result);
    } catch (const std::exception& error) {
        std::map<std::string, std::string> result;
        result["passed"] = "false";
        result["error"] = error.what();
        results.push_back(result);
    } catch (...) {
        std::map<std::string, std::string> result;
        result["passed"] = "false";
        result["error"] = "Unknown error occurred";
        results.push_back(result);
    }
    `
  ).join('\n');
}

export const cppWrapper: LanguageWrapper = {
  wrapCode: (userCode: string, testCodeList: string[]) => `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <map>
#include <stdexcept>
using namespace std;

// Store test results
vector<map<string, string>> results;
// Track current test
int currentTestIndex = -1;

// Override cout to capture logs with test index
stringstream logStream;
#define cout logStream

class Solution {
public:
    ${userCode}
};

int main() {
    // Initialize results vector with expected size
    results.reserve(${testCodeList.length});

    ${formatTestCodeList(testCodeList)}

    // Reset currentTestIndex
    currentTestIndex = -1;

    // Print final test results as JSON
    cout << "WRAPPER_RESULTS [";
    for (size_t i = 0; i < results.size(); ++i) {
        if (i > 0) cout << ",";
        cout << "{";
        bool first = true;
        for (const auto& pair : results[i]) {
            if (!first) cout << ",";
            cout << "\\"" << pair.first << "\\":\\"" << pair.second << "\\"";
            first = false;
        }
        cout << "}";
    }
    cout << "]\\n";

    // Print logs
    cout << "WRAPPER_LOGS []\\n";

    return 0;
}
`
};