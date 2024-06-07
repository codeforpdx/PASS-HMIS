// React Imports
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// Custom Hooks Imports
import { useSession, useNotification } from '@hooks';
// Inrupt Imports
import { getThing, getWebIdDataset, getStringNoLocale } from '@inrupt/solid-client';
import { FOAF } from '@inrupt/vocab-common-rdf';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import { Tab, Tabs, Typography } from '@mui/material';
// Constant Imports
import { ENV } from '@constants';
// Signup Form Imports
import {
  PodRegistrationForm,
  ShowNewPod,
  initializePod,
  registerPod,
  ExistingPodForm
} from '@components/Signup';

const PassRegistrationTab = ({ register, caseManagerName, previousInfo }) => {
  const [value, setValue] = useState('1');

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h3" component="h1">
          Register
        </Typography>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="New Pod" value="1" />
          <Tab label="Existing Pod" value="2" />
        </Tabs>
      </Box>
      <Box hidden={value !== '1'}>
        <PodRegistrationForm
          register={register}
          caseManagerName={caseManagerName}
          previousInfo={previousInfo}
        />
      </Box>
      <Box hidden={value !== '2'}>
        <ExistingPodForm />
      </Box>
    </Box>
  );
};
/**/
/**
 * Signup - First screen in the user registration flow.
 * Allows users to either create a pod, or sign into an existing pod
 *
 * @memberof Pages
 * @name Signup
 * @returns {React.Component} - A React Page
 */
const Signup = () => {
  const [oidcIssuer] = useState(ENV.VITE_SOLID_IDENTITY_PROVIDER);
  const [storredIssuer, setStorredIssuer] = useState(null);
  const [searchParams] = useSearchParams();
  const caseManagerWebId = decodeURIComponent(searchParams.get('webId'));
  const [caseManagerName, setCaseManagerName] = useState();
  const [step, setStep] = useState('begin');
  const [registrationInfo, setRegistrationInfo] = useState({});
  const { addNotification } = useNotification();
  const [previousInfo, setPreviousInfo] = useState(null);

  const { session } = useSession();

  const registerAndInitialize = async (email, password, confirmPassword) => {
    setStep('loading');
    setPreviousInfo({ email, password, confirmPassword });
    try {
      const registration = await registerPod(
        {
          email,
          password,
          confirmPassword
        },
        oidcIssuer
      );
      setRegistrationInfo(registration);
      const caseManagerNames = caseManagerName?.split(' ') || [];
      await initializePod(
        registration.webId,
        registration.podUrl,
        {
          caseManagerWebId,
          caseManagerFirstName: caseManagerNames[0],
          caseManagerLastName: caseManagerNames[caseManagerNames.length - 1]
        },
        registration.fetch
      );

      setStep('done');
    } catch (httpError) {
      addNotification('error', httpError.message);
      setStep('begin');
    }
  };

  const loadProfileInfo = async () => {
    if (caseManagerWebId === 'null') return;
    try {
      const profile = await getWebIdDataset(caseManagerWebId);
      const profileThing = getThing(profile, caseManagerWebId);
      setCaseManagerName(getStringNoLocale(profileThing, FOAF.name));
    } catch {
      setCaseManagerName(null);
    }
  };

  useEffect(() => {
    loadProfileInfo();

    if (session.info.isLoggedIn === true) {
      setStep('done');
    } else {
      setStep('begin');
    }

    const storedOidcIssuer = localStorage.getItem('oidcIssuer', oidcIssuer);
    setStorredIssuer(storedOidcIssuer);
  }, [session.info.isLoggedIn, window.location.href]);

  return (
    <Container id="andrew">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Paper
          elevation={2}
          sx={{
            display: 'inline-block',
            mx: '2px',
            padding: '20px',
            minWidth: '280px',
            margin: '24px',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
          }}
        >
          {step === 'begin' && (
            <PassRegistrationTab
              previousInfo={previousInfo}
              register={registerAndInitialize}
              caseManagerName={caseManagerName}
            />
          )}
          {step === 'loading' && <Typography>Creating Pod...</Typography>}
          {step === 'done' && (
            <ShowNewPod
              oidcIssuer={oidcIssuer}
              oidcExisting={storredIssuer}
              podUrl={registrationInfo.podUrl}
              webId={session.info.webId}
            />
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
