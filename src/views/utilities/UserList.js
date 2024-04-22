import React, { useEffect, useState } from 'react';

import { Grid, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


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

export function RegistrationForm () {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Xử lý dữ liệu đăng ký ở đây
    console.log('Submit:', username, email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Register
      </Button>
    </form>
  );
}


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
    postTitle: post.postTitle,
    content: post.content,
    category: post.category.title,
    email: post.user.email,
    phone: post.user.phone,
    image: post.postAvatar[0].fileUrl,
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

const UserList = () => (
  <MainCard title="Users List">   
    <Grid container spacing={gridSpacing}>

      
    </Grid>
    <SubCard>
      <DataGridDemo />
    </SubCard>
  </MainCard>
);

export default UserList;
