// React Imports
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
// Material UI Imports
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

/**
 * NavbarLinks - Sub-component used in NavBar to render the
 * navigation for PASS
 *
 * @memberof NavBar
 * @name NavbarLinks
 * @returns {React.JSX.Element} The NavbarLinks for Routing
 */
const NavbarLinks = () => {
  // Tabs workaround to match route on login
  let location = useLocation().pathname.split('/')[1];
  if (location === '') {
    location = 'contacts';
  }

  // Array of current nav links for menus
  const routesArray = [
    { label: 'Contacts', path: '/contacts' },
    { label: 'Civic Profile', path: '/civic-profile/basic-info' },
    { label: 'Documents', path: '/documents' }
  ];

  return (
    <Tabs
      value={
        routesArray.map((route) => route.path.split('/')[1]).includes(location) ? location : false
      }
      textColor="inherit"
      indicatorColor="secondary"
      aria-label="navigation tabs"
    >
      {routesArray.map((item) => (
        <Tab
          key={`${item.label}Tab`}
          value={item.path.split('/')[1]}
          label={item.label}
          component={NavLink}
          to={item.path}
        />
      ))}
    </Tabs>
  );
};

export default NavbarLinks;
