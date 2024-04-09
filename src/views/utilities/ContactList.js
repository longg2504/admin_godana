import React, { useEffect, useState } from 'react';

import { Grid, Box, } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'email',
    headerName: 'Email',
    width: 100,
    editable: true,
  },
  {
    field: 'phone',
    headerName: 'Phone',
    width: 450,
    editable: true,
  },
  {
    field: 'wedsite',
    headerName: 'Website',
    width: 150,
    editable: true,
  },
  {
    field: 'opentime',
    headerName: 'Open Time',
    sortable: false,
    width: 150,
  },
  {
    field: 'closetime',
    headerName: 'Close Time',
    sortable: false,
    width: 150,
  }
];


export function DataGridDemo() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const { data } = await fetchContact();
        setContacts(data.content);
      } catch (error) {
        console.error("Failed to fetch contact:", error);
      }
    };
    getContacts();
  }, []);

  const rows = contacts.map((contact) => ({
    id: contact.id,
    email: contact.email,
    phone: contact.phone,
    website: contact.website,
    openTime: contact.openTime,
    closeTime: contact.closeTime,
  }));

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

// ==============================|| CONTACT ||============================== //

const ContactList = () => (
  <MainCard title="TIÊU ĐỀ">
    <Grid container spacing={gridSpacing}>

    </Grid>
    <SubCard>
      <DataGridDemo />
    </SubCard>
  </MainCard>
);

export default ContactList;
