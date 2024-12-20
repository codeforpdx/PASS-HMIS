// React Imports
import React, { useEffect, useState } from 'react';
// Material UI Imports
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// Dependency Imports
import dayjs from 'dayjs';
// Custom Hooks Imports
import { useCivicProfile, useNotification } from '@hooks';
// Component Imports
import { FormSection } from '../Form';

/**
 * BasicInfo - A form to fill out basic user info
 *
 * @memberof CivicProfileForms
 * @name BasicInfo
 * @returns {React.JSX.Element} The BasicInfo Component
 */
const BasicInfo = () => {
  const { data, add, isSuccess, storedDataset, refetch } = useCivicProfile();
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    gender: 9
  });

  useEffect(() => {
    if (isSuccess) {
      setFormData((prevFormData) => ({ ...prevFormData, ...data }));
    }
  }, [isSuccess, data]);
  useEffect(() => {
    if (!storedDataset) {
      refetch();
    }
  }, [storedDataset]);
  const handleChange = (e) => {
    if (e.$isDayjsObject) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        dateOfBirth: e.toDate()
      }));
    } else if (e.target) {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSuccess || !storedDataset) {
      return;
    }
    add(formData);
    addNotification('success', `Form submitted!`);
  };

  const handleClear = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      firstName: '',
      lastName: '',
      dateOfBirth: null,
      gender: 9
    }));

    addNotification('success', `Form cleared!`);
  };

  return (
    <FormSection title="Basic Information">
      <form aria-labelledby="hmis-basic-info-form" onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={2} mt={0} mb={2}>
          <Grid item xs={12} md={6}>
            <TextField
              id="hmis-basic-info-first-name"
              name="firstName"
              label="Legal first name"
              onChange={handleChange}
              value={formData.firstName}
              fullWidth
              autoFocus
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="hmis-basic-info-last-name"
              name="lastName"
              label="Legal last name"
              onChange={handleChange}
              value={formData.lastName}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  id="hmis-basic-info-date-of-birth"
                  name="dateOfBirth"
                  label="Date of birth"
                  onChange={handleChange}
                  value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
                  format="YYYY-MM-DD"
                  type="date"
                  disableFuture
                  openTo="year"
                  views={['year', 'month', 'day']}
                />
              </LocalizationProvider>
              <FormHelperText>YYYY-MM-DD</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="hmis-basic-info-gender">Gender</InputLabel>
              <Select
                id="hmis-basic-info-gender-select"
                name="gender"
                label="Gender"
                onChange={handleChange}
                value={formData.gender}
                labelId="hmis-basic-info-gender"
                defaultValue={9}
              >
                <MenuItem value={0}>Female</MenuItem>
                <MenuItem value={1}>Male</MenuItem>
                <MenuItem value={2}>Transgender male to female</MenuItem>
                <MenuItem value={3}>Transgender female to male</MenuItem>
                <MenuItem value={4}>Don&apos;t identify as male, female or transgender</MenuItem>
                <MenuItem value={8}>Don&apos;t know</MenuItem>
                <MenuItem value={9}>Decline to answer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              type="button"
              label="Clear button"
              color="error"
              startIcon={<ClearIcon />}
              fullWidth
              onClick={handleClear}
              aria-label="Clear button"
            >
              Clear
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              type="submit"
              label="Submit button"
              color="primary"
              startIcon={<CheckIcon />}
              fullWidth
              disabled={!isSuccess}
              aria-label="Submit button"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormSection>
  );
};

export default BasicInfo;
