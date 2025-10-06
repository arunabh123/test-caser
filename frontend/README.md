# Jira Test Case Generator - Frontend

A modern React frontend for the Jira Test Case Generator API, built with Material-UI for a beautiful and responsive user interface.

## 🚀 Features

- **Modern UI**: Built with Material-UI components for a professional look
- **Real-time Status**: Live API health and configuration monitoring
- **Jira Integration**: Parse Jira URLs and extract issue details
- **AI Test Generation**: Generate comprehensive test cases using Gemini AI
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Export Functionality**: Download generated test cases as JSON

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks
- **Material-UI (MUI)**: Component library for beautiful UI
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing (ready for future expansion)

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running (see backend README)

### Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file if needed:
   ```env
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## 🎯 Usage

### 1. **System Status**
- Check API connectivity and configuration status
- Monitor authentication and AI service readiness

### 2. **Parse Jira URL**
- Enter a Jira issue URL
- Click "Parse URL" to extract issue details
- View issue information, assignee, status, etc.

### 3. **Generate Test Cases**
- Enter a Jira issue URL
- Click "Generate Test Cases" to create AI-powered test cases
- View comprehensive test cases with steps, preconditions, and expected results
- Download test cases as JSON

### 4. **Custom Authentication**
- Use custom auth tokens for different Jira instances
- Toggle "Show Custom Auth Token" for advanced usage

## 🎨 UI Components

### **Header**
- Application title and branding
- Real-time API status indicators
- Configuration status chips

### **Status Panel**
- API health monitoring
- Authentication status
- AI service configuration
- Configuration details

### **Jira URL Input**
- URL validation and formatting
- Parse and Generate buttons
- Custom authentication support
- Loading states and error handling

### **Issue Details**
- Comprehensive issue information display
- Status and priority indicators
- People and dates information
- Formatted description display

### **Test Cases Display**
- Expandable test case cards
- Priority and type indicators
- Step-by-step test instructions
- JSON export functionality

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:8000` | Backend API URL |
| `GENERATE_SOURCEMAP` | `false` | Source map generation |

### API Integration

The frontend communicates with the backend through these endpoints:

- `GET /health` - Health check
- `GET /config` - Configuration status
- `GET /test-jira` - Jira connection test
- `POST /parse` - Parse Jira URL
- `POST /parse-with-auth` - Parse with custom auth
- `POST /generate-test-cases` - Generate test cases

## 🚀 Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Project Structure

```
src/
├── components/          # React components
│   ├── Header.js       # Application header
│   ├── StatusPanel.js  # System status display
│   ├── JiraUrlInput.js # URL input form
│   ├── JiraIssueDetails.js # Issue details display
│   └── TestCasesDisplay.js # Test cases display
├── services/           # API services
│   └── api.js         # Axios configuration and API calls
├── App.js             # Main application component
└── index.js           # Application entry point
```

### Adding New Features

1. **New Components**: Add to `src/components/`
2. **API Endpoints**: Extend `src/services/api.js`
3. **Styling**: Use Material-UI theme system
4. **State Management**: Use React hooks (useState, useEffect)

## 🎨 Customization

### Theme Customization

Edit the theme in `src/App.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Change primary color
    },
    secondary: {
      main: '#dc004e', // Change secondary color
    },
  },
});
```

### Component Styling

Use Material-UI's `sx` prop for styling:

```javascript
<Box sx={{ 
  display: 'flex', 
  gap: 2, 
  p: 3,
  backgroundColor: 'grey.50' 
}}>
```

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend server is running on `http://localhost:8000`
   - Check `REACT_APP_API_URL` in `.env` file

2. **CORS Errors**
   - Backend should allow requests from `http://localhost:3000`
   - Check backend CORS configuration

3. **Authentication Errors**
   - Verify backend `.env` file has correct Jira credentials
   - Check API configuration status in the UI

4. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

### Development Tips

- Use browser developer tools for debugging
- Check network tab for API request/response details
- Monitor console for error messages
- Use React Developer Tools extension

## 📱 Responsive Design

The application is fully responsive and works on:

- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adapted layout with touch-friendly controls
- **Mobile**: Compact layout with essential features

## 🔒 Security

- No sensitive data stored in frontend
- API keys and tokens handled by backend
- HTTPS recommended for production
- Input validation and sanitization

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
```

### Environment Configuration

Set production environment variables:

```env
REACT_APP_API_URL=https://your-api-domain.com
GENERATE_SOURCEMAP=false
```

### Deployment Options

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFront, Cloudflare
- **Container**: Docker with nginx
- **Server**: Apache, nginx static hosting

## 📄 License

This project is part of the Jira Test Case Generator suite.