// React Imports
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
// Component Imports
import { CIVIC_FORM_LIST } from '@components/CivicProfileForms';

/**
 * CivicProfile - Component that generates the Civic Profile for PASS
 *
 * @memberof Pages
 * @name CivicProfile
 * @returns {React.ReactNode} The Civic Profile
 */
const CivicProfile = () => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);
  const currentForm = location.pathname.split('/').pop();

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <nav>
          <Tabs value={currentForm} aria-label="civic profile tabs">
            {CIVIC_FORM_LIST.map((form) => (
              <Tab
                key={form.path}
                component={Link}
                to={form.path}
                label={form.label}
                value={form.path}
              />
            ))}
          </Tabs>
        </nav>
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Container>
  );
};

export default CivicProfile;
