import React, { useEffect, useState } from 'react';

import { Grid, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';


const columns = [
  { field: 'id', headerName: 'ID', width: 70 },

  {
    field: 'fullName',
    headerName: 'Full Name',
    width: 100,
    editable: true,
  },
  {
    field: 'sex',
    headerName: 'Sex',
    width: 450,
    editable: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    sortable: false,
    width: 150,
  },
  {
    field: 'phone',
    headerName: 'Phone',
    sortable: false,
    width: 150,
  }
];


export function DataGridDemo() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data } = await fetchPost();
        setPosts(data.content);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    };

    getPosts();
  }, []);

  const rows = posts.map((post) => ({
    id: post.id,
    fullName: post.fullName,
    sex: post.sex,
    email: post.user.email,
    phone: post.user.phone
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

const UserBan = () => (
    <MainCard title="User Banned List">
    <Grid container spacing={gridSpacing}>

    </Grid>
    <SubCard>
      <DataGridDemo />
    </SubCard>
  </MainCard>
);

export default UserBan;