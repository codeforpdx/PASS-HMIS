// React Imports
import React, {useState} from 'react';
// React Router Imports
import { Link } from 'react-router-dom';
// Material UI Imports
import { styled, useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';

const StyledTableCell = styled(TableCell)(() => {
  const theme = useTheme();
  return {
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14
    }
  };
});

const StyledTableRow = styled(TableRow)(() => {
  const theme = useTheme();
  return {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.primary.slight
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0
    }
  };
});

/**
 * ClientListTable Component - Component that generates table of clients from data within ClientList
 *
 * @memberof Clients
 * @name ClientListTable
 */

const ClientListTable = ({ userList, loadingActive, handleDeleteClient }) => {
  const theme = useTheme();
  const [pinned, setPinned] = useState(false);

  const determineDateModifiedCell = (client) => {
    let displayed;

    if (loadingActive) {
      displayed = 'Loading...';
    } else if (client.dateModified) {
      displayed = client.dateModified.toLocaleDateString();
    } else {
      displayed = 'Not available';
    }

    return displayed;
  };

  const handlePinClick = () => {
    setPinned(!pinned);
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="client list table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Client Name</StyledTableCell>
            <StyledTableCell align="center">Pod URL</StyledTableCell>
            <StyledTableCell align="center">Last Active Date</StyledTableCell>
            <StyledTableCell align="center">Pin To Top</StyledTableCell>
            <StyledTableCell align="center">Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userList.map((client) => (
            <StyledTableRow key={client.podUrl}>
              <StyledTableCell align="center">{client.person}</StyledTableCell>
              <StyledTableCell align="center">
                <Link
                  href={client.podUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none', color: theme.palette.primary.dark }}
                >
                  {client.podUrl}
                </Link>
              </StyledTableCell>
              <StyledTableCell align="center">{determineDateModifiedCell(client)}</StyledTableCell>
              <StyledTableCell align="center">
                <IconButton
                  size="large"
                  edge="end"
                  // aria-label="account of current user"
                  // aria-controls={menuId}
                  // aria-haspopup="true"
                  onClick={handlePinClick}
                  // color="inherit"
                >
                  {pinned ? <PushPinIcon color="secondary" /> : <PushPinOutlinedIcon />}
                </IconButton>
              </StyledTableCell>
              <StyledTableCell align="center">
                <IconButton
                  size="large"
                  edge="end"
                  // aria-label="account of current user"
                  // aria-controls={menuId}
                  // aria-haspopup="true"
                  onClick={() => handleDeleteClient(client.person, client.givenName, client.podUrl)}
                  // color="inherit"
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClientListTable;
