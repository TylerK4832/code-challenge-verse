import { LanguageWrapper } from '../types/languageWrappers.ts';

function formatTestCodeList(testCodeList: string[]) {
  return testCodeList.map((code, index) => 
    `
    try {
        currentTestIndex = ${index};
${code}
        results.push_back({{{"passed", "true"}}});
    } catch (const std::exception& error) {
        results.push_back({{{"error", error.what()}}});
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
    ${formatTestCodeList(testCodeList)}

    // Reset currentTestIndex
    currentTestIndex = -1;

    // Print final test results as JSON
    cout << "WRAPPER_RESULTS [";
    for (size_t i = 0; i < results.size(); ++i) {
        cout << "{";
        for (const auto& pair : results[i]) {
            cout << "\\"" << pair.first << "\\":\\"" << pair.second << "\\"";
        }
        cout << "}";
        if (i < results.size() - 1) cout << ",";
    }
    cout << "]\\n";

    // Print logs
    cout << "WRAPPER_LOGS []\\n";

    return 0;
}
`
};