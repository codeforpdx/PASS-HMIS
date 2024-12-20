// React Imports
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// Material UI Imports
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const formRowStyle = {
  m: 1
};

const textFieldStyle = {
  margin: '8px',
  width: '27ch'
};

/**
 * PodRegistrationForm - Component for user registration in a Solid Pod.
 *
 * @memberof Signup
 * @name PodRegistrationForm
 * @param {object} props - Component props
 * @param {Function} props.register - The function to handle user registration
 * @param {string} props.caseManagerName - The name of the case manager (optional)
 * @param {object} props.previousInfo - previous info in case an error occurs
 * @returns {React.Element} The rendered React component
 */
const PodRegistrationForm = ({ register, caseManagerName, previousInfo = null }) => {
  const [email, setEmail] = useState(previousInfo ? previousInfo.email : '');
  const [password, setPassword] = useState(previousInfo ? previousInfo.password : '');
  const [confirmPassword, setConfirmPassword] = useState(
    previousInfo ? previousInfo.confirmPassword : ''
  );
  const [showPassword, setShowPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const handleSubmit = async (event) => {
    event.preventDefault();
    register(email, password, confirmPassword);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      {searchParams.get('webId') && (
        <p>You will register with {caseManagerName ?? searchParams.get('webId')}</p>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={formRowStyle}
        autoComplete="off"
        textAlign="center"
      >
        <TextField
          sx={textFieldStyle}
          id="email-form"
          aria-label="Email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
          fullWidth
        />
        <br />
        <TextField
          sx={textFieldStyle}
          id="password-form"
          margin="normal"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            'aria-label': 'Password',
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          required
          fullWidth
          variant="outlined"
          minLength="8"
        />
        <br />
        <TextField
          sx={textFieldStyle}
          id="confirm-password-form"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          error={password !== confirmPassword}
          helperText={password !== confirmPassword && 'Password does not match'}
          InputProps={{
            'aria-label': 'Confirm Password',
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          variant="outlined"
          minLength="8"
          required
          fullWidth
        />
        <br />
        <Button
          variant="contained"
          color="primary"
          size="large"
          aria-label="Sign Up For a Pod"
          type="submit"
          disabled={password !== confirmPassword}
        >
          Set up your Pod
        </Button>
      </Box>
    </>
  );
};

export default PodRegistrationForm;
