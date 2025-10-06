from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import requests
import re
from urllib.parse import urlparse, parse_qs
from typing import Optional, Dict, Any
import logging
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get environment variables
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")
JIRA_EMAIL = os.getenv("JIRA_EMAIL")  # Your Jira account email
JIRA_BASE_URL = os.getenv("JIRA_BASE_URL")
DEFAULT_PROJECT_KEY = os.getenv("DEFAULT_PROJECT_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini AI
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(
    title="Jira URL Parser API",
    description="API to extract parameters from Jira URLs",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Explicitly allow methods
    allow_headers=["*"],  # Allow all headers
)

class JiraUrlRequest(BaseModel):
    url: HttpUrl

class JiraUrlRequestWithAuth(BaseModel):
    url: HttpUrl
    auth_token: Optional[str] = None

class JiraIssueResponse(BaseModel):
    issue_key: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    assignee: Optional[str] = None
    reporter: Optional[str] = None
    priority: Optional[str] = None
    issue_type: Optional[str] = None
    project_key: Optional[str] = None
    created_date: Optional[str] = None
    updated_date: Optional[str] = None
    url: str
    error: Optional[str] = None

class TestCaseGenerationRequest(BaseModel):
    url: HttpUrl

class TestCaseGenerationResponse(BaseModel):
    issue_key: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    test_cases: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

def extract_issue_key_from_url(url: str) -> Optional[str]:
    """Extract Jira issue key from URL"""
    # Common Jira URL patterns
    patterns = [
        r'/browse/([A-Z]+-\d+)',  # /browse/PROJECT-123
        r'/issues/([A-Z]+-\d+)',  # /issues/PROJECT-123
        r'/issue/([A-Z]+-\d+)',   # /issue/PROJECT-123
        r'([A-Z]+-\d+)',          # Just the issue key
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def extract_project_key_from_issue_key(issue_key: str) -> Optional[str]:
    """Extract project key from issue key"""
    if '-' in issue_key:
        return issue_key.split('-')[0]
    return None

def parse_jira_url_params(url: str) -> Dict[str, Any]:
    """Parse URL parameters and extract basic info"""
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)
    
    # Extract issue key
    issue_key = extract_issue_key_from_url(url)
    project_key = extract_project_key_from_issue_key(issue_key) if issue_key else None
    
    return {
        'issue_key': issue_key,
        'project_key': project_key,
        'domain': parsed_url.netloc,
        'path': parsed_url.path,
        'query_params': query_params
    }

def fetch_jira_issue_details(issue_key: str, base_url: str) -> Dict[str, Any]:
    """Fetch detailed issue information from Jira REST API"""
    try:
        # Construct the REST API URL
        api_url = f"{base_url}/rest/api/2/issue/{issue_key}"
        # Make request to Jira REST API
        response = requests.get(api_url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            fields = data.get('fields', {})
            
            return {
                'title': fields.get('summary', ''),
                'description': fields.get('description', ''),
                'status': fields.get('status', {}).get('name', ''),
                'assignee': fields.get('assignee', {}).get('displayName', '') if fields.get('assignee') else '',
                'reporter': fields.get('reporter', {}).get('displayName', '') if fields.get('reporter') else '',
                'priority': fields.get('priority', {}).get('name', '') if fields.get('priority') else '',
                'issue_type': fields.get('issuetype', {}).get('name', ''),
                'created_date': fields.get('created', ''),
                'updated_date': fields.get('updated', '')
            }
        elif response.status_code == 401:
            logger.warning("Authentication required for Jira API access")
            return {'error': 'Authentication required - Jira instance requires login'}
        elif response.status_code == 403:
            logger.warning("Access forbidden - insufficient permissions")
            return {'error': 'Access forbidden - check if your email and API token are correct, and you have permission to view this issue'}
        elif response.status_code == 404:
            logger.warning(f"Issue not found or API endpoint not accessible: {response.status_code}")
            return {'error': 'Issue not found or Jira API not accessible (private instance)'}
        else:
            logger.warning(f"Failed to fetch issue details: {response.status_code}")
            return {'error': f'Jira API returned status {response.status_code}'}
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching Jira issue: {e}")
        return {'error': f'Network error: {str(e)}'}
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return {'error': f'Unexpected error: {str(e)}'}

def fetch_jira_issue_details_with_auth(issue_key: str, base_url: str, auth_token: str = None) -> Dict[str, Any]:
    """Fetch detailed issue information from Jira REST API with authentication"""
    try:
        # Construct the REST API URL
        api_url = f"{base_url}/rest/api/2/issue/{issue_key}"
        
        # Prepare headers
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        
        # Add authentication if provided (Jira uses Basic Auth with email + token)
        if auth_token and JIRA_EMAIL:
            import base64
            credentials = f"{JIRA_EMAIL}:{auth_token}"
            encoded_credentials = base64.b64encode(credentials.encode()).decode()
            headers['Authorization'] = f'Basic {encoded_credentials}'
        
        # Make request to Jira REST API
        logger.info(f"Making request to: {api_url}")
        logger.info(f"Headers: {headers}")
        response = requests.get(api_url, headers=headers, timeout=10)
        logger.info(f"Response status: {response.status_code}")
        logger.info(f"Response headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            fields = data.get('fields', {})
            
            return {
                'title': fields.get('summary', ''),
                'description': fields.get('description', ''),
                'status': fields.get('status', {}).get('name', ''),
                'assignee': fields.get('assignee', {}).get('displayName', '') if fields.get('assignee') else '',
                'reporter': fields.get('reporter', {}).get('displayName', '') if fields.get('reporter') else '',
                'priority': fields.get('priority', {}).get('name', '') if fields.get('priority') else '',
                'issue_type': fields.get('issuetype', {}).get('name', ''),
                'created_date': fields.get('created', ''),
                'updated_date': fields.get('updated', '')
            }
        elif response.status_code == 401:
            logger.warning("Authentication required for Jira API access")
            return {'error': 'Authentication required - Jira instance requires login'}
        elif response.status_code == 403:
            logger.warning("Access forbidden - insufficient permissions")
            return {'error': 'Access forbidden - check if your email and API token are correct, and you have permission to view this issue'}
        elif response.status_code == 404:
            logger.warning(f"Issue not found or API endpoint not accessible: {response.status_code}")
            return {'error': 'Issue not found or Jira API not accessible (private instance)'}
        else:
            logger.warning(f"Failed to fetch issue details: {response.status_code}")
            return {'error': f'Jira API returned status {response.status_code}'}
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching Jira issue: {e}")
        return {'error': f'Network error: {str(e)}'}
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return {'error': f'Unexpected error: {str(e)}'}

def load_test_case_prompt() -> str:
    """Load the test case generation prompt from file"""
    try:
        with open('test_case_prompt.txt', 'r', encoding='utf-8') as file:
            return file.read()
    except FileNotFoundError:
        logger.error("test_case_prompt.txt file not found")
        return ""
    except Exception as e:
        logger.error(f"Error loading prompt file: {e}")
        return ""

def generate_test_cases_with_gemini(description: str) -> Dict[str, Any]:
    """Generate test cases using Gemini 2.5 Flash model"""
    try:
        if not GEMINI_API_KEY:
            return {'error': 'Gemini API key not configured'}
        
        # Load the prompt template
        prompt_template = load_test_case_prompt()
        if not prompt_template:
            return {'error': 'Could not load test case prompt template'}
        
        # Replace the placeholder with the actual description
        prompt = prompt_template.replace('{description}', description)
        
        # Initialize the Gemini model
        model = genai.GenerativeModel('gemini-2.0-flash-lite')
        
        # Generate test cases
        logger.info("Generating test cases with Gemini...")
        response = model.generate_content(prompt)
        
        if not response.text:
            return {'error': 'No response from Gemini model'}
        
        # Try to parse the JSON response
        try:
            # Extract JSON from the response (in case there's extra text)
            response_text = response.text.strip()
            
            # Find JSON content between ```json and ``` or just parse the whole response
            if '```json' in response_text:
                json_start = response_text.find('```json') + 7
                json_end = response_text.find('```', json_start)
                if json_end == -1:
                    # If no closing ``` found, try to find the end of JSON
                    json_content = response_text[json_start:].strip()
                else:
                    json_content = response_text[json_start:json_end].strip()
            else:
                json_content = response_text
            
            # Try to fix incomplete JSON by finding the last complete object
            if json_content.count('{') > json_content.count('}'):
                # JSON is incomplete, try to find the last complete test case
                last_complete_brace = json_content.rfind('}')
                if last_complete_brace != -1:
                    json_content = json_content[:last_complete_brace + 1]
                    # Add missing closing braces
                    missing_braces = json_content.count('{') - json_content.count('}')
                    json_content += '}' * missing_braces
            
            test_cases = json.loads(json_content)
            logger.info("Successfully generated test cases")
            return test_cases
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Response length: {len(response.text)}")
            logger.error(f"Response preview: {response.text[:1000]}...")
            
            # Try to extract partial JSON as fallback
            try:
                # Look for the test_suite structure
                if '"test_suite"' in response_text:
                    suite_start = response_text.find('"test_suite"')
                    # Find the opening brace for test_suite
                    brace_start = response_text.find('{', suite_start)
                    if brace_start != -1:
                        # Try to find a reasonable end point
                        brace_count = 0
                        end_pos = brace_start
                        for i, char in enumerate(response_text[brace_start:], brace_start):
                            if char == '{':
                                brace_count += 1
                            elif char == '}':
                                brace_count -= 1
                                if brace_count == 0:
                                    end_pos = i + 1
                                    break
                        
                        partial_json = response_text[brace_start:end_pos]
                        test_cases = json.loads(partial_json)
                        logger.info("Successfully parsed partial JSON response")
                        return test_cases
            except:
                pass
            
            return {'error': f'Invalid JSON response from Gemini: {str(e)}'}
            
    except Exception as e:
        logger.error(f"Error generating test cases: {e}")
        return {'error': f'Error generating test cases: {str(e)}'}

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Jira URL Parser API",
        "version": "1.0.0",
        "endpoints": {
            "/parse": "POST - Parse Jira URL and extract parameters (uses env auth)",
            "/parse-with-auth": "POST - Parse Jira URL with optional authentication",
            "/generate-test-cases": "POST - Generate test cases from Jira URL using Gemini AI",
            "/health": "GET - Health check",
            "/config": "GET - Show current configuration"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "jira-url-parser"}

@app.get("/config")
async def get_config():
    """Get current configuration (without sensitive data)"""
    return {
        "jira_base_url": JIRA_BASE_URL,
        "default_project_key": DEFAULT_PROJECT_KEY,
        "auth_token_configured": bool(JIRA_API_TOKEN),
        "auth_token_length": len(JIRA_API_TOKEN) if JIRA_API_TOKEN else 0,
        "jira_email_configured": bool(JIRA_EMAIL),
        "authentication_ready": bool(JIRA_API_TOKEN and JIRA_EMAIL),
        "gemini_api_configured": bool(GEMINI_API_KEY)
    }

@app.get("/test-jira")
async def test_jira_connection():
    """Test Jira API connection"""
    if not JIRA_API_TOKEN or not JIRA_EMAIL:
        return {"error": "JIRA_API_TOKEN and JIRA_EMAIL must be configured"}
    
    try:
        # Test with a simple API call to get server info
        test_url = "https://infoedge.atlassian.net/rest/api/2/myself"
        
        import base64
        credentials = f"{JIRA_EMAIL}:{JIRA_API_TOKEN}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        
        headers = {
            'Accept': 'application/json',
            'Authorization': f'Basic {encoded_credentials}'
        }
        
        response = requests.get(test_url, headers=headers, timeout=10)
        
        return {
            "status_code": response.status_code,
            "success": response.status_code == 200,
            "response_preview": response.text[:200] if response.text else "No response body"
        }
        
    except Exception as e:
        return {"error": str(e)}

@app.post("/parse", response_model=JiraIssueResponse)
async def parse_jira_url(request: JiraUrlRequest):
    """
    Parse a Jira URL and extract issue parameters
    
    Args:
        request: JiraUrlRequest containing the Jira URL
        
    Returns:
        JiraIssueResponse with extracted parameters
    """
    try:
        url = str(request.url)
        logger.info(f"Parsing Jira URL: {url}")
        
        # Parse URL to extract basic information
        url_info = parse_jira_url_params(url)
        
        if not url_info['issue_key']:
            return JiraIssueResponse(
                url=url,
                error="Could not extract issue key from URL. Please provide a valid Jira issue URL."
            )
        
        # Extract base URL for API calls
        parsed_url = urlparse(url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
        
        # Try to fetch detailed information from Jira REST API
        # Use environment auth token if available
        auth_token = JIRA_API_TOKEN
        issue_details = fetch_jira_issue_details_with_auth(url_info['issue_key'], base_url, auth_token)
        
        # Combine URL parsing results with API results
        response_data = {
            'issue_key': url_info['issue_key'],
            'project_key': url_info['project_key'],
            'url': url,
            **issue_details
        }
        
        return JiraIssueResponse(**response_data)
        
    except Exception as e:
        logger.error(f"Error parsing Jira URL: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )

@app.post("/parse-with-auth", response_model=JiraIssueResponse)
async def parse_jira_url_with_auth(request: JiraUrlRequestWithAuth):
    """
    Parse a Jira URL with optional authentication token
    
    Args:
        request: JiraUrlRequestWithAuth containing the Jira URL and optional auth token
        
    Returns:
        JiraIssueResponse with extracted parameters
    """
    try:
        url = str(request.url)
        # Use provided auth token or fall back to environment variable
        auth_token = request.auth_token or JIRA_API_TOKEN
        logger.info(f"Parsing Jira URL with auth: {url}")
        
        # Parse URL to extract basic information
        url_info = parse_jira_url_params(url)
        
        if not url_info['issue_key']:
            return JiraIssueResponse(
                url=url,
                error="Could not extract issue key from URL. Please provide a valid Jira issue URL."
            )
        
        # Extract base URL for API calls
        parsed_url = urlparse(url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
        
        # Try to fetch detailed information from Jira REST API with auth
        issue_details = fetch_jira_issue_details_with_auth(url_info['issue_key'], base_url, auth_token)
        
        # Combine URL parsing results with API results
        response_data = {
            'issue_key': url_info['issue_key'],
            'project_key': url_info['project_key'],
            'url': url,
            **issue_details
        }
        
        return JiraIssueResponse(**response_data)
        
    except Exception as e:
        logger.error(f"Error parsing Jira URL: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )

@app.post("/generate-test-cases", response_model=TestCaseGenerationResponse)
async def generate_test_cases(request: TestCaseGenerationRequest):
    """
    Generate test cases from a Jira URL using Gemini AI
    
    Args:
        request: TestCaseGenerationRequest containing the Jira URL
        
    Returns:
        TestCaseGenerationResponse with generated test cases
    """
    try:
        url = str(request.url)
        logger.info(f"Generating test cases for Jira URL: {url}")
        
        # First, parse the Jira URL to get issue details
        url_info = parse_jira_url_params(url)
        
        if not url_info['issue_key']:
            return TestCaseGenerationResponse(
                error="Could not extract issue key from URL. Please provide a valid Jira issue URL."
            )
        
        # Extract base URL for API calls
        parsed_url = urlparse(url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
        
        # Try to fetch detailed information from Jira REST API
        auth_token = JIRA_API_TOKEN
        issue_details = fetch_jira_issue_details_with_auth(url_info['issue_key'], base_url, auth_token)
        
        # Check if we got the issue details
        if 'error' in issue_details:
            return TestCaseGenerationResponse(
                issue_key=url_info['issue_key'],
                error=f"Could not fetch Jira issue details: {issue_details['error']}"
            )
        
        # Get the description for test case generation
        description = issue_details.get('description', '')
        title = issue_details.get('title', '')
        
        if not description:
            return TestCaseGenerationResponse(
                issue_key=url_info['issue_key'],
                title=title,
                description=description,
                error="No description found in the Jira issue. Cannot generate test cases without requirements."
            )
        
        # Generate test cases using Gemini
        test_cases = generate_test_cases_with_gemini(description)
        
        if 'error' in test_cases:
            return TestCaseGenerationResponse(
                issue_key=url_info['issue_key'],
                title=title,
                description=description,
                error=f"Failed to generate test cases: {test_cases['error']}"
            )
        
        return TestCaseGenerationResponse(
            issue_key=url_info['issue_key'],
            title=title,
            description=description,
            test_cases=test_cases
        )
        
    except Exception as e:
        logger.error(f"Error generating test cases: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
