// React Imports
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// Material UI Imports
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
// Component Imports
import HMIS_FORM_LIST from './FormList';

/**
 * FormLayout - Component that contains the Civic Profile forms
 *
 * @memberof CivicProfileForms
 * @name FormLayout
 * @param {object} props - The props for the FormLayout component
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the main content area
 * @returns {React.ReactNode} The layout for Civic Profile forms
 */
const FormLayout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname.split('/').pop();

  localStorage.setItem('restorePath', location.pathname);
  const pageIdx = HMIS_FORM_LIST.findIndex((form) => form.path === path);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        my: 1
      }}
    >
      <Box
        sx={{
          width: '100%',
          mb: 1
        }}
      >
        <Card>{children}</Card>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          my: 1
        }}
      >
        {pageIdx > 0 ? (
          <Button
            variant="outlined"
            component={RouterLink}
            to={`../${HMIS_FORM_LIST[pageIdx - 1].path}`}
            startIcon={<ArrowBackIcon />}
            size="large"
          >
            Prev
          </Button>
        ) : (
          <Box />
        )}
        {pageIdx < HMIS_FORM_LIST.length - 1 ? (
          <Button
            variant="outlined"
            component={RouterLink}
            to={`../${HMIS_FORM_LIST[pageIdx + 1].path}`}
            endIcon={<ArrowForwardIcon />}
            size="large"
            // Disabled for incomplete Financial Information form
            disabled={pageIdx === 1}
          >
            Next
          </Button>
        ) : (
          <Box />
        )}
      </Box>
    </Box>
  );
};

export default FormLayout;
