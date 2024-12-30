import { LanguageWrapper } from '../types/languageWrappers.ts';

function formatTestCodeList(testCodeList: string[]) {
  return testCodeList.map((code, index) => 
    `
    try:
        current_test_index = ${index}
        ${code}
        results.append({
            "passed": True
        })
    except Exception as error:
        results.append({
            "error": str(error)
        })
    `
  ).join('\n');
}

export const pythonWrapper: LanguageWrapper = {
  wrapCode: (userCode: string, testCodeList: string[]) => `
import json

def run_tests():
    # Store original print function
    original_print = print
    
    # We'll keep a single global array of all logs,
    # but with metadata (test_index) so we know which test they came from
    logs = []
    # We'll keep track of which test is currently running
    current_test_index = -1
    
    # Override print to capture logs with their test index
    def custom_print(*args):
        stringified = [str(arg) if not isinstance(arg, (dict, list)) else json.dumps(arg) for arg in args]
        logs.append({
            "testIndex": current_test_index,
            "message": " ".join(stringified)
        })
    
    # Replace built-in print with our custom version
    globals()['print'] = custom_print

    # Inject user code
    ${userCode}

    # Initialize results list
    results = []

    ${formatTestCodeList(testCodeList)}

    # Reset current_test_index
    current_test_index = -1

    # Restore original print function
    globals()['print'] = original_print

    # Print final test results
    print("WRAPPER_RESULTS " + json.dumps(results))
    
    # Print logs with info about which test produced them
    print("WRAPPER_LOGS " + json.dumps(logs))

run_tests()
`
};