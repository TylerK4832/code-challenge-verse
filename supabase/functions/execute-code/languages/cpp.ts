import { LanguageWrapper } from '../types/languageWrappers.ts';

function formatTestCodeList(testCodeList: string[]) {
  return testCodeList.map((code, index) => 
    `
    try {
        currentTestIndex = ${index};
        logStream.str(""); // Clear the log stream before each test
        // Create a new Solution instance for each test
        // Solution solution;
        coutRedirector; // Ensure cout is redirected to logStream
${code}
        // Store the log for this test if any output was generated
        if (!logStream.str().empty()) {
            testLogs.push_back({${index}, logStream.str()});
        }
        Printer::compareAndPrint(output, expected);
        std::map<std::string, std::string> result;
        result["passed"] = "true";
        results.push_back(result);
    } catch (const std::exception& error) {
        // Store the log for this test if any output was generated
        if (!logStream.str().empty()) {
            testLogs.push_back({${index}, logStream.str()});
        }
        std::map<std::string, std::string> result;
        result["passed"] = "false";
        result["error"] = error.what();
        results.push_back(result);
    } catch (...) {
        // Store the log for this test if any output was generated
        if (!logStream.str().empty()) {
            testLogs.push_back({${index}, logStream.str()});
        }
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
#include <iostream>        // Standard I/O stream
#include <vector>          // Dynamic arrays
#include <string>          // String manipulation
#include <sstream>         // String stream
#include <map>             // Associative containers (maps)
#include <set>             // Set containers
#include <unordered_map>   // Unordered associative containers
#include <unordered_set>   // Unordered set containers
#include <algorithm>       // Standard algorithms (sort, find, etc.)
#include <functional>      // Function objects, bind, etc.
#include <iterator>        // Iterators
#include <thread>          // Threading support
#include <mutex>           // Mutex for thread synchronization
#include <condition_variable> // Condition variables for synchronization
#include <chrono>          // Time utilities
#include <cmath>           // Mathematical functions (sin, cos, pow, etc.)
#include <cstdlib>         // Standard library functions (exit, random, etc.)
#include <ctime>           // Date and time utilities
#include <fstream>         // File stream
#include <iomanip>         // Input/output manipulation (e.g., setprecision)
#include <cassert>         // Assertion macros for debugging
#include <type_traits>     // Type utilities (std::is_same, std::enable_if, etc.)
#include <memory>          // Smart pointers (unique_ptr, shared_ptr, weak_ptr)
#include <utility>         // Utility functions (e.g., std::move, std::pair)
#include <tuple>           // Tuple
#include <bitset>          // Bitset operations
#include <array>           // Fixed-size arrays
#include <list>            // Doubly-linked list
#include <deque>           // Double-ended queue
#include <forward_list>    // Singly-linked list
#include <atomic>          // Atomic operations
#include <exception>       // Exception handling (std::exception)
#include <new>             // Memory management (placement new, bad_alloc)
#include <valarray>        // Array-like containers
#include <regex>           // Regular expressions
#include <complex>         // Complex numbers
#include <bit>             // Bit operations (e.g., std::popcount, std::bitset)
#include <numeric>         // Numeric algorithms (e.g., accumulate)
#include <random>          // Random number generation
#include <stdexcept>       // Standard exceptions (e.g., runtime_error)
#include <climits>         // Limits of integral types
#include <cfloat>          // Limits of floating point types
#include <cctype>          // Character classification and manipulation
#include <cstring>         // C-style string manipulation
#include <cstdio>          // C-style I/O
#include <typeinfo>        // Type identification
#include <initializer_list> // Support for initializer lists
#include <sys/types.h>     // System-specific types (e.g., size_t, ssize_t)
#include <unistd.h>        // POSIX API (for Linux/Unix systems)
using namespace std;

// Store test results
vector<map<string, string>> results;
// Track current test
int currentTestIndex = -1;

// Structure to store test logs with their indices
struct TestLog {
    int testIndex;
    string message;
    TestLog(int idx, string msg) : testIndex(idx), message(msg) {}
};
vector<TestLog> testLogs;

// Wrapper to redirect cout to logStream
struct CoutRedirector {
    std::stringstream& stream;
    std::streambuf* original;

    CoutRedirector(std::stringstream& s) : stream(s), original(std::cout.rdbuf()) {
        std::cout.rdbuf(stream.rdbuf());
    }

    ~CoutRedirector() {
        std::cout.rdbuf(original); // Restore original cout
    }
};

// Override cout to capture logs with test index
stringstream logStream;
#define coutRedirector CoutRedirector redirector(logStream)

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

    // Print final test results in JSON format directly
    std::cout << "{\\n";
    std::cout << "  \\"test_results\\": [\\n";
    for (size_t i = 0; i < results.size(); ++i) {
        if (i > 0) std::cout << ",\\n";
        std::cout << "    {";
        bool first = true;
        for (const auto& pair : results[i]) {
            if (!first) std::cout << ",";
            std::cout << "\\"" << pair.first << "\\":\\"" << pair.second << "\\"";
            first = false;
        }
        std::cout << "}";
    }
    std::cout << "\\n  ],\\n";
    
    // Add logs section with proper test indices
    std::cout << "  \\"logs\\": [\\n";
    for (size_t i = 0; i < testLogs.size(); ++i) {
        if (i > 0) std::cout << ",\\n";
        std::cout << "    {";
        std::cout << "\\"testIndex\\":" << testLogs[i].testIndex << ",";
        std::cout << "\\"message\\":\\"" << testLogs[i].message << "\\"";
        std::cout << "}";
    }
    std::cout << "\\n  ]\\n";
    std::cout << "}\\n";

    return 0;
}
`
};