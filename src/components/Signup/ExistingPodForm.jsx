// React Imports
import React, { useState } from 'react';
// Custom Hooks Imports
import { useSession } from '@hooks';
// Material UI Imports
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

/* Styles */
const formRowStyle = {
  m: 1
};

const textFieldStyle = {
  margin: '8px',
  width: '27ch'
};

// TODO: Add JSDocs
const ExistingPodForm = () => {
  const { login } = useSession();

  const [oidcIssuer, setOidcIssuer] = useState('https://inrupt.net/');

  const loginHandler = async (event) => {
    event.preventDefault();

    let redirectUrl = new URL(window.location.href);
    redirectUrl = redirectUrl.toString();

    localStorage.setItem('oidcIssuer', oidcIssuer);
    await login({
      oidcIssuer,
      redirectUrl
    });
  };

  return (
    <Box component="form" onSubmit={loginHandler} sx={formRowStyle} textAlign="center">
      {/* TODO: Consider changing this to Autocomplete like the NavBar and SignInModal have */}
      <TextField
        sx={textFieldStyle}
        id="existing-pod-provider"
        label="Pod Provider"
        variant="outlined"
        onChange={(e) => setOidcIssuer(e.target.value)}
        fullWidth
        required
      />
      <br />
      <Button
        variant="contained"
        color="primary"
        size="large"
        aria-label="Login to Pod Provider"
        type="submit"
      >
        Login to Pod Provider
      </Button>
    </Box>
  );
};

export default ExistingPodForm;
