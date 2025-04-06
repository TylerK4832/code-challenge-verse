
#!/usr/bin/env python3

import os
import yaml
import json
import sys
import uuid
from supabase import create_client, Client

# Supabase configuration
supabase_url = "https://iiutqsyiuvpnqytzswlg.supabase.co"
supabase_key = input("Enter your Supabase service role key: ")

# Initialize Supabase client
supabase: Client = create_client(supabase_url, supabase_key)

def load_yaml_file(file_path):
    """Load problems from YAML file"""
    with open(file_path, 'r') as file:
        return yaml.safe_load(file)

def get_existing_problems():
    """Fetch all existing problems from Supabase"""
    response = supabase.table('problems').select('title').execute()
    if hasattr(response, 'error') and response.error:
        print(f"Error fetching problems: {response.error}")
        sys.exit(1)
    
    return {problem['title'] for problem in response.data}

def sync_problems():
    """Sync problems from YAML to Supabase"""
    # Load problems from YAML
    yaml_path = os.path.join(os.path.dirname(__file__), 'problems.yaml')
    yaml_data = load_yaml_file(yaml_path)
    
    if 'problems' not in yaml_data:
        print("No problems found in YAML file")
        return
    
    # Get existing problems from Supabase
    existing_problems = get_existing_problems()
    
    # Process each problem
    for problem in yaml_data['problems']:
        title = problem['title']
        
        # Skip if problem already exists
        if title in existing_problems:
            print(f"Problem '{title}' already exists. Skipping.")
            continue
        
        print(f"Adding new problem: {title}")
        
        # Generate a problem ID
        problem_id = str(uuid.uuid4())
        
        # 1. Insert into problems table
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
        
        # 2. Insert placeholder code for each language
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
        
        # 3. Insert test cases for each language
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

if __name__ == "__main__":
    print("Starting problem synchronization...")
    sync_problems()
    print("Synchronization complete!")
