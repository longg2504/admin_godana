import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Avatar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { getAllBannedUsers, unbanUser } from 'constant/constURL/URLUser';
import SubCard from 'ui-component/cards/SubCard';
import SearchSection from 'layout/MainLayout/Header/SearchSection';

function ActionButtons({ id, onUnBan }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirmBan = () => {
    onUnBan(id);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <LockOpenIcon color="error"/>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <LockOpenIcon color="error" style={{ fontSize: 100 }} />
            <DialogContentText style={{ marginTop: 16, textAlign: 'center', fontSize: '1.2rem' }}>
              Are you sure you want to open block this user?
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmBan} autoFocus>
            Unban
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

const columns = (handleUnBan) => [
  { field: 'id', headerName: 'ID', width: 90 },
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
    renderCell: (params) => <ActionButtons id={params.row.id} onUnBan={handleUnBan} />,
    align: 'center'
  }
];

function DataGridDemo({ handleUnBan, refreshTrigger }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchBanUsers = async () => {
      try {
        const { data } = await getAllBannedUsers();
        setUsers(data.content || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchBanUsers();
  }, [refreshTrigger]);

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
        columns={columns(handleUnBan)} // Pass handleUnBan function to columns
        pageSize={10}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

function UserList() {
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

  const handleUnBan = async (id) => {
    try {
      await unbanUser(id);
      setSnackbarMessage('User successfully unbanned!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setRefreshTrigger(!refreshTrigger);
    } catch (error) {
      setSnackbarMessage('Failed to unban user.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      console.error('Failed to unban user:', error);
    }
  };


  return (
    <MainCard title="USER LIST">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <SubCard>
            <Grid item xs={12} md={6}>
              <SearchSection placeholder="Search users..." />
            </Grid>
            <Grid item xs={12} md={2}></Grid>
          </SubCard>
        </Grid>
      </Grid>
      <Divider component="" style={{ padding: '10px 0' }} />
      <SubCard>
        <DataGridDemo handleUnBan={handleUnBan} refreshTrigger={refreshTrigger} />
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }} variant="filled">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </SubCard>
    </MainCard>
  );
}

export default UserList;
