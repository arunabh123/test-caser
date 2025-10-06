import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  BugReport as BugReportIcon,
  Schedule as ScheduleIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

const TestCasesDisplay = ({ testCasesData }) => {
  const [expandedTestCase, setExpandedTestCase] = useState(false);

  if (!testCasesData || !testCasesData.test_cases) {
    return null;
  }

  const { test_suite } = testCasesData.test_cases;

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getTestTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'functional':
        return 'primary';
      case 'performance':
        return 'secondary';
      case 'security':
        return 'error';
      case 'usability':
        return 'info';
      case 'integration':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(testCasesData.test_cases, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `test_cases_${test_suite?.suite_name?.replace(/[^a-zA-Z0-9]/g, '_') || 'export'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          <BugReportIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Generated Test Cases
        </Typography>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          size="small"
        >
          Download JSON
        </Button>
      </Box>

      {test_suite && (
        <>
          {/* Test Suite Overview */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {test_suite.suite_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {test_suite.suite_description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`${test_suite.total_test_cases} Test Cases`}
                  color="primary"
                  size="small"
                />
                <Chip
                  label="AI Generated"
                  color="secondary"
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Test Cases */}
          {test_suite.test_cases && test_suite.test_cases.length > 0 ? (
            test_suite.test_cases.map((testCase, index) => (
              <Accordion
                key={testCase.test_case_id || index}
                expanded={expandedTestCase === index}
                onChange={() => setExpandedTestCase(expandedTestCase === index ? false : index)}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      {testCase.test_case_id}: {testCase.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={testCase.priority}
                        color={getPriorityColor(testCase.priority)}
                        size="small"
                      />
                      <Chip
                        label={testCase.test_type}
                        color={getTestTypeColor(testCase.test_type)}
                        size="small"
                        variant="outlined"
                      />
                      {testCase.estimated_duration && (
                        <Chip
                          icon={<ScheduleIcon />}
                          label={testCase.estimated_duration}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {/* Description */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Description
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {testCase.description}
                      </Typography>
                    </Grid>

                    {/* Preconditions */}
                    {testCase.preconditions && testCase.preconditions.length > 0 && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Preconditions
                        </Typography>
                        <List dense>
                          {testCase.preconditions.map((precondition, idx) => (
                            <ListItem key={idx} sx={{ py: 0 }}>
                              <ListItemText
                                primary={precondition}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                    )}

                    {/* Test Steps */}
                    {testCase.test_steps && testCase.test_steps.length > 0 && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Test Steps
                        </Typography>
                        <List dense>
                          {testCase.test_steps.map((step, idx) => (
                            <ListItem key={idx} sx={{ py: 0 }}>
                              <ListItemText
                                primary={`${step.step_number}. ${step.step_description}`}
                                secondary={step.expected_result}
                                primaryTypographyProps={{ variant: 'body2' }}
                                secondaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                    )}

                    {/* Test Data */}
                    {testCase.test_data && (
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          Test Data
                        </Typography>
                        <Grid container spacing={2}>
                          {testCase.test_data.input_data && (
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" color="text.secondary">
                                Input Data:
                              </Typography>
                              <Typography variant="body2">
                                {testCase.test_data.input_data}
                              </Typography>
                            </Grid>
                          )}
                          {testCase.test_data.expected_output && (
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" color="text.secondary">
                                Expected Output:
                              </Typography>
                              <Typography variant="body2">
                                {testCase.test_data.expected_output}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Alert severity="info">
              No test cases were generated. Please check the Jira issue description.
            </Alert>
          )}
        </>
      )}
    </Paper>
  );
};

export default TestCasesDisplay;
