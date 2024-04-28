import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { getAllUsers, banUser } from 'constant/constURL/URLUser';
import SubCard from 'ui-component/cards/SubCard';
import SearchSection from 'layout/MainLayout/Header/SearchSection';

function ActionButtons({ id, onBan }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirmBan = () => {
    onBan(id);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <DoDisturbOnIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Ban"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to ban this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmBan} autoFocus>
            Ban
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function ImageField({ value }) {
  return (
    <Avatar src={value} alt="User Avatar" sx={{ display: 'flex', alignItems: 'center' }} style={{ width: 50, height: 50, marginRight: 5 }} />
  );
}

const columns = (handleBan) => [
  { field: 'id', headerName: 'ID', width: 90, },
  { field: 'avatar', headerName: 'Avatar', renderCell: ImageField, width: 110 },
  { field: 'fullName', headerName: 'Full Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'username', headerName: 'Username', width: 150 },
  { field: 'role', headerName: 'Role', width: 120 },
  { field: 'status', headerName: 'Status', width: 150 },
  {
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    width: 60,
    renderCell: (params) => <ActionButtons id={params.row.id} onBan={handleBan} />,
    align: 'center'
  }
];

function DataGridDemo({ searchTerm, handleBan, refreshTrigger }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getAllUsers(searchTerm);
        setUsers(data.content || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [searchTerm, refreshTrigger]);

  const rows = users.map(user => ({
    id: user.id,
    avatar: user.avatar?.fileUrl || 'defaultImageUrl',
    fullName: user.fullName,
    email: user.email,
    username: user.username,
    role: user.role.code,
    status: user.status,
  }));

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns(handleBan)} // Pass handleBan function to columns
        pageSize={10}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

function UserList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleBan = async (id) => {
    try {
      await banUser(id);
      setSnackbarMessage('User successfully banned!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setRefreshTrigger(!refreshTrigger);
    } catch (error) {
      setSnackbarMessage('Failed to ban user.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      console.error('Failed to ban user:', error);
    }
  };

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  return (
    <MainCard title="USER LIST">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <SubCard>
            <Grid item xs={12} md={6}>
              <SearchSection onSearch={handleSearch} placeholder="Search users..." />
            </Grid>
            <Grid item xs={12} md={2}></Grid>
          </SubCard>
        </Grid>
      </Grid>
      <Divider component="" style={{ padding: '10px 0' }} />
      <SubCard>
        <DataGridDemo searchTerm={searchTerm} handleBan={handleBan} refreshTrigger={refreshTrigger}/>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </SubCard>
    </MainCard>
  );
}

export default UserList;
