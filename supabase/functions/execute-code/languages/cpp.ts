import { LanguageWrapper } from '../types/languageWrappers.ts';

function formatTestCodeList(testCodeList: string[]) {
  return testCodeList.map((code, index) => 
    `
    try {
        currentTestIndex = ${index};
        // Create a new Solution instance for each test
        // Solution solution;
${code}
        Printer::compareAndPrint(output, expected);
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

// Detect if a type is iterable
template <typename T, typename = void>
struct is_iterable : false_type {};

template <typename T>
struct is_iterable<T, void_t<decltype(begin(declval<T>())), decltype(end(declval<T>()))>> : true_type {};

// Specialization to exclude std::string from being iterable
template <>
struct is_iterable<std::string> : false_type {};

class Printer {
public:
    template <typename T>
    static void compareAndPrint(const T& output, const T& expected) {
        if (output != expected) {
            throw runtime_error("Expected " + stringify(expected) + " but got " + stringify(output));
        }
    }

    template <typename T>
    static string stringify(const T& value) {
        return stringifyImpl(value);
    }

private:
    template <typename T>
    static string stringifyImpl(const T& value) {
        if constexpr (is_iterable<T>::value) {
            ostringstream oss;
            oss << "[";
            for (auto it = begin(value); it != end(value); ++it) {
                if (it != begin(value)) oss << ", ";
                oss << stringifyImpl(*it);
            }
            oss << "]";
            return oss.str();
        } else if constexpr (std::is_same<T, std::string>::value) {
            return "\\"" + value + "\\"";
        } else if constexpr (is_arithmetic<T>::value) {
            return std::to_string(value);
        } else if constexpr (std::is_same<T, char>::value) {
            return string(1, value);
        } else {
            ostringstream oss;
            oss << value;
            return oss.str();
        }
    }
};

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

    // Flush logStream to std::cout
    std::cout << logStream.str();

    return 0;
}

`
};