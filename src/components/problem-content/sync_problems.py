
#!/usr/bin/env python3

import os
import yaml
import json
import sys
import uuid
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

if __name__ == "__main__":
    print("Starting problem synchronization...")
    sync_problems()
    print("Synchronization complete!")
