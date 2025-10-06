import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  BugReport as BugReportIcon,
  Api as ApiIcon,
} from '@mui/icons-material';

const Header = ({ apiStatus, configStatus }) => {
  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <BugReportIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Jira Test Case Generator
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip
            icon={<ApiIcon />}
            label={apiStatus ? 'API Connected' : 'API Disconnected'}
            color={apiStatus ? 'success' : 'error'}
            size="small"
            variant="outlined"
          />
          
          {configStatus && (
            <Chip
              label={configStatus.authentication_ready ? 'Auth Ready' : 'Auth Not Ready'}
              color={configStatus.authentication_ready ? 'success' : 'warning'}
              size="small"
              variant="outlined"
            />
          )}
          
          {configStatus && (
            <Chip
              label={configStatus.gemini_api_configured ? 'AI Ready' : 'AI Not Ready'}
              color={configStatus.gemini_api_configured ? 'success' : 'warning'}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
