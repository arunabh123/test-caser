# Postman Collection Setup Guide

This guide will help you set up and use the Postman collection for the Jira Test Case Generator API.

## 📁 Files Included

- `Jira_Test_Case_Generator.postman_collection.json` - Complete API collection
- `Jira_Test_Case_Generator.postman_environment.json` - Environment variables
- `POSTMAN_SETUP.md` - This setup guide

## 🚀 Quick Setup

### 1. Import Collection and Environment

1. **Open Postman**
2. **Import Collection:**
   - Click "Import" button
   - Select `Jira_Test_Case_Generator.postman_collection.json`
   - Click "Import"

3. **Import Environment:**
   - Click "Import" button
   - Select `Jira_Test_Case_Generator.postman_environment.json`
   - Click "Import"

4. **Select Environment:**
   - Click the environment dropdown (top right)
   - Select "Jira Test Case Generator Environment"

### 2. Start Your API Server

Make sure your API server is running:

```bash
cd /path/to/your/project
source venv/bin/activate
python main.py
```

The server should be running on `http://localhost:8000`

## 📋 Collection Overview

### **Health & Configuration**
- **Health Check** - Verify API is running
- **Get Configuration** - Check authentication status
- **Test Jira Connection** - Test Jira API connectivity

### **Jira URL Parsing**
- **Parse Jira URL (Basic)** - Parse with environment auth
- **Parse Jira URL (With Auth)** - Parse with custom auth token

### **Test Case Generation**
- **Generate Test Cases** - AI-powered test case generation

### **API Documentation**
- **Swagger UI** - Interactive documentation
- **ReDoc Documentation** - Alternative documentation
- **API Root** - API information

## 🔧 Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost:8000` | API base URL |
| `jira_url_example` | `https://infoedge.atlassian.net/browse/ABEMP-3728` | Example Jira URL |
| `jira_url_custom` | `https://yourcompany.atlassian.net/browse/PROJECT-123` | Custom Jira URL |

## 🧪 Testing Workflow

### 1. **Health Check**
Start by testing if the API is running:
- Run "Health Check" request
- Should return: `{"status": "healthy", "service": "jira-url-parser"}`

### 2. **Check Configuration**
Verify your setup:
- Run "Get Configuration" request
- Check that `authentication_ready` and `gemini_api_configured` are `true`

### 3. **Test Jira Connection**
Verify Jira authentication:
- Run "Test Jira Connection" request
- Should return success status

### 4. **Parse Jira URL**
Test basic parsing:
- Run "Parse Jira URL (Basic)" request
- Should return issue details

### 5. **Generate Test Cases**
Test AI generation:
- Run "Generate Test Cases" request
- Should return comprehensive test cases

## 🔄 Customizing Requests

### **Change Jira URL**
1. Edit the request body in any parsing/generation request
2. Replace the URL with your actual Jira issue URL
3. Or use the `jira_url_custom` environment variable

### **Add Custom Auth Token**
1. Use "Parse Jira URL (With Auth)" request
2. Add your custom token in the request body:
   ```json
   {
     "url": "your-jira-url",
     "auth_token": "your-custom-token"
   }
   ```

### **Change Base URL**
1. Update the `base_url` environment variable
2. Or modify individual requests

## 📊 Expected Responses

### **Health Check Response:**
```json
{
  "status": "healthy",
  "service": "jira-url-parser"
}
```

### **Configuration Response:**
```json
{
  "jira_base_url": null,
  "default_project_key": null,
  "auth_token_configured": true,
  "auth_token_length": 192,
  "jira_email_configured": true,
  "authentication_ready": true,
  "gemini_api_configured": true
}
```

### **Test Case Generation Response:**
```json
{
  "issue_key": "ABEMP-3728",
  "title": "Issue Title",
  "description": "Issue description",
  "test_cases": {
    "test_suite": {
      "suite_name": "Test Suite Name",
      "suite_description": "Test suite description",
      "total_test_cases": 10,
      "test_cases": [
        {
          "test_case_id": "TC_001",
          "title": "Test case title",
          "description": "Test case description",
          "preconditions": ["Precondition 1"],
          "test_steps": [
            {
              "step_number": 1,
              "step_description": "Step description",
              "expected_result": "Expected result"
            }
          ],
          "test_data": {
            "input_data": "Sample input",
            "expected_output": "Expected output"
          },
          "priority": "High",
          "test_type": "Functional",
          "estimated_duration": "5 minutes"
        }
      ]
    }
  }
}
```

## 🐛 Troubleshooting

### **Connection Refused**
- Ensure your API server is running on `http://localhost:8000`
- Check if the port is correct

### **Authentication Errors**
- Verify your `.env` file has correct Jira credentials
- Check the configuration endpoint for auth status

### **Gemini API Errors**
- Ensure your Gemini API key is configured
- Check the configuration endpoint for Gemini status

### **JSON Parsing Errors**
- The API now handles large responses better
- If issues persist, check server logs

## 📝 Notes

- All requests use JSON format
- The collection includes example URLs for testing
- Environment variables make it easy to switch between different setups
- The collection is organized by functionality for easy navigation

## 🔗 Related Files

- `main.py` - Main API server
- `requirements.txt` - Python dependencies
- `README.md` - Main project documentation
- `.env` - Environment configuration (not included in collection)
