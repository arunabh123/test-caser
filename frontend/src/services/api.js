import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 120000, // 2 minutes timeout for AI generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Health check
  healthCheck: () => api.get('/health'),
  
  // Get configuration
  getConfig: () => api.get('/config'),
  
  // Test Jira connection
  testJiraConnection: () => api.get('/test-jira'),
  
  // Parse Jira URL (basic)
  parseJiraUrl: (url) => api.post('/parse', { url }),
  
  // Parse Jira URL with custom auth
  parseJiraUrlWithAuth: (url, authToken) => api.post('/parse-with-auth', { url, auth_token: authToken }),
  
  // Generate test cases
  generateTestCases: (url) => api.post('/generate-test-cases', { url }),
};

export default api;
