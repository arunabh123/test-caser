import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Alert,
  Snackbar,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import { apiService } from './services/api';
import Header from './components/Header';
import StatusPanel from './components/StatusPanel';
import JiraUrlInput from './components/JiraUrlInput';
import JiraIssueDetails from './components/JiraIssueDetails';
import TestCasesDisplay from './components/TestCasesDisplay';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [apiStatus, setApiStatus] = useState(false);
  const [configStatus, setConfigStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [issueData, setIssueData] = useState(null);
  const [testCasesData, setTestCasesData] = useState(null);

  // Check API health and configuration on component mount
  useEffect(() => {
    checkApiHealth();
    loadConfiguration();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await apiService.healthCheck();
      setApiStatus(response.status === 200);
    } catch (error) {
      setApiStatus(false);
      console.error('API Health Check Failed:', error);
    }
  };

  const loadConfiguration = async () => {
    try {
      const response = await apiService.getConfig();
      setConfigStatus(response.data);
    } catch (error) {
      console.error('Failed to load configuration:', error);
      setError('Failed to load API configuration');
    }
  };

  const handleParseUrl = async (url, customAuthToken = null) => {
    setLoading(true);
    setError(null);
    setIssueData(null);
    setTestCasesData(null);

    try {
      let response;
      if (customAuthToken) {
        response = await apiService.parseJiraUrlWithAuth(url, customAuthToken);
      } else {
        response = await apiService.parseJiraUrl(url);
      }

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setIssueData(response.data);
        setSuccess('Jira issue parsed successfully!');
      }
    } catch (error) {
      setError(error.response?.data?.detail || error.message || 'Failed to parse Jira URL');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTestCases = async (url) => {
    setLoading(true);
    setError(null);
    setTestCasesData(null);

    try {
      const response = await apiService.generateTestCases(url);

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setIssueData(response.data);
        setTestCasesData(response.data);
        setSuccess('Test cases generated successfully!');
      }
    } catch (error) {
      setError(error.response?.data?.detail || error.message || 'Failed to generate test cases');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'grey.50' }}>
        <Header apiStatus={apiStatus} configStatus={configStatus} />
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <StatusPanel configStatus={configStatus} loading={loading} />
          
          <JiraUrlInput
            onParse={handleParseUrl}
            onGenerateTestCases={handleGenerateTestCases}
            loading={loading}
            error={error}
          />

          {issueData && !testCasesData && (
            <JiraIssueDetails issueData={issueData} />
          )}

          {testCasesData && (
            <TestCasesDisplay testCasesData={testCasesData} />
          )}
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
