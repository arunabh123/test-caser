import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const StatusPanel = ({ configStatus, loading }) => {
  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="h6">Loading Configuration...</Typography>
        </Box>
      </Paper>
    );
  }

  if (!configStatus) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Alert severity="error">
          Unable to load configuration. Please check if the API server is running.
        </Alert>
      </Paper>
    );
  }

  const getStatusIcon = (status) => {
    if (status) {
      return <CheckCircleIcon color="success" />;
    }
    return <ErrorIcon color="error" />;
  };

  const getStatusText = (status) => {
    return status ? 'Configured' : 'Not Configured';
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        System Status
      </Typography>
      
      <Grid container spacing={2}>
        {/* Authentication Status */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Authentication
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusIcon(configStatus.auth_token_configured)}
                  <Typography variant="body2">
                    API Token: {getStatusText(configStatus.auth_token_configured)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusIcon(configStatus.jira_email_configured)}
                  <Typography variant="body2">
                    Jira Email: {getStatusText(configStatus.jira_email_configured)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusIcon(configStatus.authentication_ready)}
                  <Typography variant="body2">
                    Authentication Ready: {getStatusText(configStatus.authentication_ready)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Configuration Status */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                AI Configuration
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusIcon(configStatus.gemini_api_configured)}
                  <Typography variant="body2">
                    Gemini API: {getStatusText(configStatus.gemini_api_configured)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon color="info" />
                  <Typography variant="body2">
                    Model: Gemini 1.5 Flash
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Configuration Details */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Configuration Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Jira Base URL
                  </Typography>
                  <Typography variant="body2">
                    {configStatus.jira_base_url || 'Not configured'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Default Project Key
                  </Typography>
                  <Typography variant="body2">
                    {configStatus.default_project_key || 'Not configured'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Auth Token Length
                  </Typography>
                  <Typography variant="body2">
                    {configStatus.auth_token_length || 'N/A'} characters
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={configStatus.authentication_ready && configStatus.gemini_api_configured ? 'Ready' : 'Not Ready'}
                    color={configStatus.authentication_ready && configStatus.gemini_api_configured ? 'success' : 'warning'}
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Warnings */}
      {(!configStatus.authentication_ready || !configStatus.gemini_api_configured) && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            {!configStatus.authentication_ready && !configStatus.gemini_api_configured
              ? 'Both authentication and AI configuration are not ready. Please check your .env file.'
              : !configStatus.authentication_ready
              ? 'Authentication is not configured. Please check your Jira credentials in the .env file.'
              : 'AI configuration is not ready. Please check your Gemini API key in the .env file.'
            }
          </Typography>
        </Alert>
      )}
    </Paper>
  );
};

export default StatusPanel;
