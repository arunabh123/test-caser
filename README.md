# Jira Test Case Generator

A full-stack application that takes a Jira URL as input and returns extracted parameters like title, description, status, and other issue details. Additionally, it can generate comprehensive test cases using Google's Gemini 1.5 Flash AI model.

## 🏗️ Project Structure

```
test-caser/
├── backend/          # Python FastAPI backend
│   ├── main.py      # Main API server
│   ├── requirements.txt
│   ├── .env.example
│   └── ...
├── frontend/         # React frontend
│   ├── src/         # React source code
│   ├── package.json
│   └── ...
└── README.md        # This file
```

## ✨ Features

### Backend (FastAPI)
- Parse Jira URLs and extract issue keys
- Fetch detailed issue information from Jira REST API
- Extract parameters like title, description, status, assignee, reporter, priority, etc.
- Generate comprehensive test cases using Google Gemini 1.5 Flash AI
- Customizable test case generation prompts
- Robust error handling and validation
- RESTful API with automatic documentation

### Frontend (React)
- Modern Material-UI interface
- Real-time API status monitoring
- Interactive Jira URL parsing
- AI-powered test case generation
- Responsive design for all devices
- Export functionality for test cases
- Comprehensive error handling

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- Jira API token
- Google Gemini API key

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   JIRA_API_TOKEN=your_jira_api_token_here
   JIRA_EMAIL=your_email@company.com
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Start backend server:**
   ```bash
   python main.py
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start frontend server:**
   ```bash
   npm start
   ```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📋 API Endpoints

### Health & Configuration
- `GET /health` - Health check
- `GET /config` - Configuration status
- `GET /test-jira` - Test Jira connection

### Jira URL Parsing
- `POST /parse` - Parse Jira URL (basic)
- `POST /parse-with-auth` - Parse with custom auth

### Test Case Generation
- `POST /generate-test-cases` - Generate AI test cases

### Documentation
- `GET /docs` - Swagger UI
- `GET /redoc` - ReDoc documentation

## 🎯 Usage Examples

### Parse Jira URL
```bash
curl -X POST "http://localhost:8000/parse" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://yourcompany.atlassian.net/browse/PROJECT-123"}'
```

### Generate Test Cases
```bash
curl -X POST "http://localhost:8000/generate-test-cases" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://yourcompany.atlassian.net/browse/PROJECT-123"}'
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Jira API Configuration
JIRA_API_TOKEN=your_jira_api_token_here
JIRA_EMAIL=your_email@company.com
JIRA_BASE_URL=https://yourcompany.atlassian.net
DEFAULT_PROJECT_KEY=PROJECT

# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
```

## 🎨 Frontend Features

### System Status Panel
- Real-time API connectivity monitoring
- Authentication status indicators
- AI service configuration status

### Jira URL Input
- URL validation and formatting
- Custom authentication support
- Parse and Generate buttons with loading states

### Issue Details Display
- Comprehensive issue information
- Status and priority indicators
- People and dates information
- Formatted description display

### Test Cases Display
- Expandable test case cards
- Priority and type indicators
- Step-by-step test instructions
- JSON export functionality

## 🧪 Test Case Generation

The API uses Google's Gemini 1.5 Flash model to generate comprehensive test cases based on Jira issue descriptions. The test case generation includes:

- **Happy path scenarios**: Normal user workflows
- **Edge cases**: Boundary conditions and unusual inputs
- **Error conditions**: Invalid inputs and error handling
- **Negative test cases**: What should not happen
- **Integration scenarios**: Cross-system interactions

### Customizing Test Case Prompts

You can customize the test case generation by editing the `backend/test_case_prompt.txt` file. The prompt uses a placeholder `{description}` that gets replaced with the actual Jira issue description.

## 📦 Dependencies

### Backend
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `requests` - HTTP client
- `pydantic` - Data validation
- `python-dotenv` - Environment variables
- `google-generativeai` - Gemini AI integration

### Frontend
- `react` - UI library
- `@mui/material` - Component library
- `axios` - HTTP client
- `react-router-dom` - Routing

## 🚀 Development

### Backend Development
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm start
```

### Building for Production

#### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

#### Frontend
```bash
cd frontend
npm run build
```

## 📁 Project Files

### Backend Files
- `main.py` - Main FastAPI application
- `requirements.txt` - Python dependencies
- `env.example` - Environment variables template
- `test_case_prompt.txt` - AI prompt template
- `Jira_Test_Case_Generator.postman_collection.json` - Postman collection

### Frontend Files
- `src/App.js` - Main React component
- `src/services/api.js` - API service layer
- `src/components/` - React components
- `package.json` - Node.js dependencies

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend server is running on port 8000
   - Check CORS configuration
   - Verify environment variables

2. **Authentication Errors**
   - Verify Jira API token and email
   - Check token permissions
   - Ensure token is not expired

3. **AI Generation Errors**
   - Verify Gemini API key
   - Check API quotas and limits
   - Monitor response size limits

4. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation at `/docs`
3. Check the backend and frontend README files
4. Create an issue in the repository