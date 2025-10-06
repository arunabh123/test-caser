import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Link as LinkIcon,
  Send as SendIcon,
} from '@mui/icons-material';

const JiraUrlInput = ({ onParse, onGenerateTestCases, loading, error }) => {
  const [url, setUrl] = useState('');
  const [customAuthToken, setCustomAuthToken] = useState('');
  const [useCustomAuth, setUseCustomAuth] = useState(false);

  const handleSubmit = (action) => {
    if (!url.trim()) {
      return;
    }
    
    if (action === 'parse') {
      if (useCustomAuth && customAuthToken) {
        onParse(url, customAuthToken);
      } else {
        onParse(url);
      }
    } else if (action === 'generate') {
      onGenerateTestCases(url);
    }
  };

  const isValidJiraUrl = (url) => {
    const jiraUrlPattern = /^https?:\/\/[^/]+\/browse\/[A-Z]+-\d+$/;
    return jiraUrlPattern.test(url);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        <LinkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Jira URL Input
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label="Jira URL"
          placeholder="https://yourcompany.atlassian.net/browse/PROJECT-123"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={url && !isValidJiraUrl(url)}
          helperText={
            url && !isValidJiraUrl(url)
              ? 'Please enter a valid Jira URL (e.g., https://company.atlassian.net/browse/PROJECT-123)'
              : 'Enter the Jira issue URL you want to parse or generate test cases for'
          }
          disabled={loading}
        />
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            onClick={() => handleSubmit('parse')}
            disabled={!url.trim() || !isValidJiraUrl(url) || loading}
            sx={{ minWidth: 120 }}
          >
            Parse URL
          </Button>
          
          <Button
            variant="contained"
            color="secondary"
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            onClick={() => handleSubmit('generate')}
            disabled={!url.trim() || !isValidJiraUrl(url) || loading}
            sx={{ minWidth: 150 }}
          >
            Generate Test Cases
          </Button>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Button
            size="small"
            onClick={() => setUseCustomAuth(!useCustomAuth)}
            sx={{ mb: 1 }}
          >
            {useCustomAuth ? 'Hide' : 'Show'} Custom Auth Token
          </Button>
          
          {useCustomAuth && (
            <TextField
              fullWidth
              label="Custom Auth Token (Optional)"
              type="password"
              value={customAuthToken}
              onChange={(e) => setCustomAuthToken(e.target.value)}
              helperText="Leave empty to use environment authentication"
              disabled={loading}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default JiraUrlInput;
