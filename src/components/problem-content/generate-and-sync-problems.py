#!/usr/bin/env python3

import os
import yaml
import json
import sys
import uuid
import openai
from supabase import create_client, Client
from dotenv import load_dotenv

# Supabase configuration
load_dotenv()  # load variables from .env

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Initialize Supabase client
supabase: Client = create_client(supabase_url, supabase_key)

def load_yaml_file(file_path):
    """Load problems from YAML file"""
    with open(file_path, 'r') as file:
        return yaml.safe_load(file)

def get_existing_problem_ids():
    """Fetch all existing problem IDs from Supabase"""
    response = supabase.table('problems').select('id').execute()
    if hasattr(response, 'error') and response.error:
        print(f"Error fetching problems: {response.error}")
        sys.exit(1)
    
    return {problem['id'] for problem in response.data}

def sync_problems():
    """Sync problems from YAML to Supabase"""
    # Load problems from YAML
    yaml_path = os.path.join(os.path.dirname(__file__), 'new-problem.yaml')
    yaml_data = load_yaml_file(yaml_path)
    
    if 'problems' not in yaml_data:
        print("No problems found in YAML file")
        return
    
    # Get existing problem IDs from Supabase
    existing_problem_ids = get_existing_problem_ids()
    
    # Process each problem
    for problem in yaml_data['problems']:
        problem_id = problem['id']
        title = problem['title']
        
        # Check if problem ID already exists
        if problem_id in existing_problem_ids:
            print(f"Problem '{title}' with ID '{problem_id}' already exists. Updating...")
            
            # Update the existing problem
            problems_data = {
                'title': title,
                'difficulty': problem['difficulty'],
                'category': 'Data Structures',  # Default category, modify as needed
                'acceptance': '0%'  # Default acceptance rate
            }
            
            try:
                response = supabase.table('problems').update(problems_data).eq('id', problem_id).execute()
                if hasattr(response, 'error') and response.error:
                    print(f"Error updating problem: {response.error}")
                    continue
                print(f"Successfully updated problem '{title}' with ID: {problem_id}")
            except Exception as e:
                print(f"Exception updating problem: {e}")
                continue
            
            # Delete existing placeholder code for this problem
            try:
                supabase.table('placeholder_code').delete().eq('problem_id', problem_id).execute()
                print(f"Deleted existing placeholder code for problem ID: {problem_id}")
            except Exception as e:
                print(f"Exception deleting placeholder code: {e}")
            
            # Delete existing test cases for this problem
            try:
                supabase.table('test_cases').delete().eq('problem_id', problem_id).execute()
                print(f"Deleted existing test cases for problem ID: {problem_id}")
            except Exception as e:
                print(f"Exception deleting test cases: {e}")
        else:
            print(f"Adding new problem: {title} with ID: {problem_id}")
            
            # Insert into problems table
            problems_data = {
                'id': problem_id,
                'title': title,
                'difficulty': problem['difficulty'],
                'category': 'Data Structures',  # Default category, modify as needed
                'acceptance': '0%'  # Default acceptance rate
            }
            
            try:
                response = supabase.table('problems').insert(problems_data).execute()
                if hasattr(response, 'error') and response.error:
                    print(f"Error inserting problem: {response.error}")
                    continue
                print(f"Successfully added problem '{title}' with ID: {problem_id}")
            except Exception as e:
                print(f"Exception inserting problem: {e}")
                continue
        
        # Insert placeholder code for each language
        if 'placeholder-code' in problem:
            for lang_data in problem['placeholder-code']:
                placeholder_data = {
                    'problem_id': problem_id,
                    'language': lang_data['language'].lower(),  # Use lowercase language names
                    'code': lang_data['code']
                }
                
                try:
                    response = supabase.table('placeholder_code').insert(placeholder_data).execute()
                    if hasattr(response, 'error') and response.error:
                        print(f"Error inserting placeholder code: {response.error}")
                    else:
                        print(f"Added placeholder code for {lang_data['language']}")
                except Exception as e:
                    print(f"Exception inserting placeholder code: {e}")
        
        # Insert test cases for each language
        if 'test-cases' in problem:
            for test_case in problem['test-cases']:
                test_case_data = {
                    'problem_id': problem_id,
                    'language': test_case['language'].lower(),  # Use lowercase language names
                    'number': test_case['number'],
                    'code': test_case['code'],
                    'is_hidden': False
                }
                
                try:
                    response = supabase.table('test_cases').insert(test_case_data).execute()
                    if hasattr(response, 'error') and response.error:
                        print(f"Error inserting test case: {response.error}")
                    else:
                        print(f"Added test case {test_case['number']} for {test_case['language']}")
                except Exception as e:
                    print(f"Exception inserting test case: {e}")

def generate_problem_files():
    """
    Generates new-problem.yaml and a TSX file by invoking the OpenAI o3-mini API.
    
    Expected output from OpenAI:
    [YAML content...]
    ### Problem TSX File
    [TSX file content...]
    """
    spec_path = os.path.join(os.path.dirname(__file__), 'prompt.txt')
    try:
        with open(spec_path, 'r') as f:
            prompt_text = f.read()
    except FileNotFoundError:
        print("prompt.txt not found in the current directory.")
        sys.exit(1)
    
    # Set up your OpenAI API key (ensure OPENAI_API_KEY is set in your .env file)
    openai.api_key = os.getenv("OPENAI_API_KEY")
    if not openai.api_key:
        print("OPENAI_API_KEY not set in environment.")
        sys.exit(1)
    
    try:
        response = openai.responses.create(
            model="gpt-4o",
            input=prompt_text,
            max_output_tokens=2048,
        )
    except Exception as e:
        print(f"Error invoking OpenAI API: {e}")
        sys.exit(1)
    
    # Get the text output from the response
    output_text = response.output[0].content[0].text.strip()
    
    # Split the output into two sections using a delimiter.
    # Here we assume the delimiter "### Problem TSX File" separates the YAML and TSX parts.
    delimiter = "### Problem TSX File"
    if delimiter not in output_text:
        print(f"Delimiter '{delimiter}' not found in OpenAI output.")
        sys.exit(1)
    
    raw_yaml_content, tsx_content = output_text.split(delimiter, 1)

    # Remove problematic lines (like markdown code fences and header lines) from the YAML content.
    def remove_problematic_lines(content):
        lines = content.splitlines()
        filtered_lines = []
        for line in lines:
            stripped = line.strip()
            # Skip lines that exactly match problematic markers.
            if stripped in ("# YAML Content", "```yaml", "```"):
                continue
            filtered_lines.append(line)
        return "\n".join(filtered_lines)

    yaml_content = remove_problematic_lines(raw_yaml_content)
    
    # Save the YAML content to new-problem.yaml
    yaml_file_path = os.path.join(os.path.dirname(__file__), 'new-problem.yaml')
    try:
        with open(yaml_file_path, 'w') as f:
            f.write(yaml_content.strip())
        print(f"Generated YAML file at {yaml_file_path}")
    except Exception as e:
        print(f"Error writing YAML file: {e}")
        sys.exit(1)
    
    # Load the YAML content to extract the new problem's id.
    try:
        yaml_data = yaml.safe_load(yaml_content)
    except Exception as e:
        print(f"Error parsing YAML content: {e}")
        sys.exit(1)
    
    if 'problems' not in yaml_data or not yaml_data['problems']:
        print("No problems found in generated YAML content.")
        sys.exit(1)
    
    # Use the id from the first problem in the YAML
    new_problem_id = yaml_data['problems'][0]['id']
    
    # Save the TSX content to a file named "[new-problem-id]-content.tsx"
    tsx_filename = f"{new_problem_id}-content.tsx"
    tsx_file_path = os.path.join(os.path.dirname(__file__), tsx_filename)
    try:
        with open(tsx_file_path, 'w') as f:
            f.write(tsx_content.strip())
        print(f"Generated TSX file at {tsx_file_path}")
    except Exception as e:
        print(f"Error writing TSX file: {e}")
        sys.exit(1)

def export_all_problems():
    """
    Export all problems along with their placeholder code and test cases from Supabase
    to an all-problems.yaml file, using the same format as new-problem.yaml.
    """
    print("Exporting all problems to all-problems.yaml...")
    
    # Fetch all problems
    problems_resp = supabase.table('problems').select('*').execute()
    if hasattr(problems_resp, 'error') and problems_resp.error:
        print(f"Error fetching problems: {problems_resp.error}")
        sys.exit(1)
    problems_list = problems_resp.data

    # Fetch all placeholder code entries
    placeholders_resp = supabase.table('placeholder_code').select('*').execute()
    if hasattr(placeholders_resp, 'error') and placeholders_resp.error:
        print(f"Error fetching placeholder code: {placeholders_resp.error}")
        sys.exit(1)
    placeholders_list = placeholders_resp.data

    # Fetch all test cases
    testcases_resp = supabase.table('test_cases').select('*').execute()
    if hasattr(testcases_resp, 'error') and testcases_resp.error:
        print(f"Error fetching test cases: {testcases_resp.error}")
        sys.exit(1)
    testcases_list = testcases_resp.data

    # Group placeholder code by problem_id
    placeholders_by_id = {}
    for entry in placeholders_list:
        pid = entry.get('problem_id')
        if pid not in placeholders_by_id:
            placeholders_by_id[pid] = []
        placeholders_by_id[pid].append({
            'language': entry.get('language'),
            'code': entry.get('code')
        })

    # Group test cases by problem_id
    testcases_by_id = {}
    for entry in testcases_list:
        pid = entry.get('problem_id')
        if pid not in testcases_by_id:
            testcases_by_id[pid] = []
        testcases_by_id[pid].append({
            'language': entry.get('language'),
            'number': entry.get('number'),
            'code': entry.get('code'),
            'is_hidden': entry.get('is_hidden')
        })

    # Reassemble each problem with its related entries
    output_problems = []
    for problem in problems_list:
        pid = problem.get('id')
        # Create a dictionary matching the expected YAML output.
        out_problem = {
            'title': problem.get('title'),
            'id': pid,
            'difficulty': problem.get('difficulty'),
            'problem-content': f"./{pid}-content.tsx"
        }
        # Add placeholder code if available
        if pid in placeholders_by_id:
            out_problem['placeholder-code'] = placeholders_by_id[pid]
        # Add test cases if available
        if pid in testcases_by_id:
            out_problem['test-cases'] = testcases_by_id[pid]

        output_problems.append(out_problem)
    
    # Create final dictionary with problems list
    export_data = {'problems': output_problems}
    
    # Write the output to all-problems.yaml
    export_file = os.path.join(os.path.dirname(__file__), 'all-problems.yaml')
    try:
        with open(export_file, 'w') as f:
            yaml.safe_dump(export_data, f, sort_keys=False, default_flow_style=False)
        print(f"Exported all problems to {export_file}")
    except Exception as e:
        print(f"Error writing all-problems.yaml: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("Starting problem generation step...")
    generate_problem_files()  # Generate new-problem.yaml and TSX file first
    print("Problem generation complete!")
    
    print("Starting problem synchronization...")
    sync_problems()
    print("Synchronization complete!")
    
    print("Starting problems export...")
    export_all_problems()
    print("Export complete!")
