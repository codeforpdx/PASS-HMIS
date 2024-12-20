// React Imports
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// Material UI Imports
import { Breadcrumbs as MUIBreadcrumbs } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Typography from '@mui/material/Typography';

/**
 * Breadcrumbs - Component that is part of the layout of PASS where it renders the
 * navigation links to previous sections of the website utilizing MUI's
 * Breadcrumbs and React Router's useLocation hook
 *
 * @name Breadcrumbs
 * @returns {React.JSX.Element} The Breadcrumbs Component
 */
const Breadcrumbs = () => {
  const location = useLocation();

  const crumbs = location?.pathname
    .split('/')
    .slice(1)
    .map((crumb) => {
      let string = crumb;
      string = decodeURIComponent(crumb.replace('-', ' '));
      if (!string.includes('http')) {
        string = string
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ');
      }
      return string;
    });

  return (
    <MUIBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{
        margin: { xs: '20px', sm: '20px 80px' },
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
      }}
    >
      {crumbs.map((crumb, index) =>
        index !== crumbs.length - 1 ? (
          <Link
            to={`/${crumbs
              .slice(0, index + 1)
              .join('/')
              .replaceAll(' ', '-')
              .toLowerCase()}`}
            key={crumb}
            style={{
              wordBreak: 'break-word'
            }}
          >
            {crumb}
          </Link>
        ) : (
          <Typography
            component="h2"
            key={crumb}
            sx={{
              wordBreak: 'break-word'
            }}
          >
            {crumb}
          </Typography>
        )
      )}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
