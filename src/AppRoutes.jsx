// React Imports
import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
// Inrupt Imports
import { useSession } from '@hooks';
// Component Imports
import { CIVIC_FORM_LIST, FormLayout } from '@components/CivicProfileForms';
import { MESSAGE_PAGES_LIST, MessagesLayout } from '@components/Messages';
// Page Imports
import { CivicProfile, Documents, Home, Contacts, Profile, Signup } from './pages';

const ProtectedRoute = ({ isLoggedIn, children }) =>
  isLoggedIn ? children ?? <Outlet /> : <Navigate to="/" replace />;

/**
 * The main application routing for PASS
 *
 * @name AppRoutes
 * @returns {React.JSX.Element} The main routing component for PASS
 */
const AppRoutes = () => {
  const { session } = useSession();
  const restorePath = localStorage.getItem('restorePath');
  const loggedIn = session.info.isLoggedIn;
  const path = loggedIn ? restorePath || '/contacts' : '/';
  const location = useLocation();

  if (location.pathname === '/civic-profile') {
    return <Navigate to="/civic-profile/basic-info" replace />;
  }

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={session.info.isLoggedIn ? <Navigate to={path} replace /> : <Home />}
      />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute isLoggedIn={session.info.isLoggedIn} />}>
        <Route path="/contacts">
          <Route index element={<Contacts />} />
          <Route path=":webId" element={<Profile />} />
        </Route>
        <Route path="/messages">
          {MESSAGE_PAGES_LIST.map(({ path: routePath, element }) => (
            <Route
              path={routePath}
              key={routePath}
              element={
                routePath === '/messages' ? (
                  <Navigate to="/messages/inbox" replace />
                ) : (
                  <MessagesLayout path={routePath}>{element}</MessagesLayout>
                )
              }
            />
          ))}
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/documents" element={<Documents />} />
        {/* TODO: Remove blank Civic Profile page, ensure it directs Basic Information instead */}
        <Route path="/civic-profile" element={<CivicProfile />}>
          {CIVIC_FORM_LIST.map((formProps) => (
            <Route
              key={formProps.path}
              {...formProps}
              element={
                <FormLayout>
                  <formProps.element />
                </FormLayout>
              }
            />
          ))}
        </Route>
        <Route path="*" element={<Navigate to={restorePath} replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
