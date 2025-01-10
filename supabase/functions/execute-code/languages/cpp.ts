import { LanguageWrapper } from '../types/languageWrappers.ts';

function formatTestCodeList(testCodeList: string[]) {
  return testCodeList.map((code, index) => 
    `
    try {
        currentTestIndex = ${index};
        // Create a new Solution instance for each test
        // Solution solution;
        coutRedirector; // Ensure cout is redirected to logStream
${code}
        Printer::compareAndPrint(output, expected);
        std::map<std::string, std::string> result;
        result["passed"] = "true";
        results.push_back(result);
    } catch (const std::exception& error) {
        std::map<std::string, std::string> result;
        result["passed"] = "false"; // Optionally mark as failed
        result["error"] = error.what();
        results.push_back(result);
    } catch (...) {
        std::map<std::string, std::string> result;
        result["passed"] = "false"; // Optionally mark as failed
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

// Wrapper to redirect cout to logStream
struct CoutRedirector {
    std::stringstream& stream;
    std::streambuf* original;
    int testIndex;

    CoutRedirector(std::stringstream& s, int index) : stream(s), original(std::cout.rdbuf()), testIndex(index) {
        std::cout.rdbuf(stream.rdbuf());
    }

    ~CoutRedirector() {
        std::cout.rdbuf(original); // Restore original cout
    }
};

// Override cout to capture logs with test index
stringstream logStream;
#define coutRedirector CoutRedirector redirector(logStream, currentTestIndex)

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

    // Undefine macro to use std::cout explicitly
    #undef coutRedirector

    // Print final test results in JSON format directly
    std::cout << "WRAPPER_RESULTS [";
    for (size_t i = 0; i < results.size(); ++i) {
        if (i > 0) std::cout << ",";
        std::cout << "{";
        bool first = true;
        for (const auto& pair : results[i]) {
            if (!first) std::cout << ",";
            std::cout << "\\"" << pair.first << "\\":";
            
            // Check if pair.second is a boolean-like string
            if (pair.second == "true" || pair.second == "false") {
                std::cout << pair.second; // Print without quotes
            } else {
                std::cout << "\\"" << pair.second << "\\""; // Print with quotes
            }
            
            first = false;
        }
        std::cout << "}";
    }
    std::cout << "]\\n";

    // Print logs section
    std::cout << "WRAPPER_LOGS [";
    std::string logs = logStream.str();
    std::istringstream logsStream(logs);
    std::string line;
    bool firstLog = true;
    while (std::getline(logsStream, line)) {
        // Extract test index and message
        std::string message = line.substr(line.find(":") + 2); // Get the message part
        int testIndex = std::stoi(line.substr(line.find("(") + 1, line.find(")") - line.find("(") - 1)); // Get the test index
        if (!firstLog) std::cout << ",";
        std::cout << "{\\"testIndex\\":" << testIndex << ",\\"message\\":\\"" << message << "\\"}";
        firstLog = false;
    }
    std::cout << "]\\n";

    return 0;
}
`
};
