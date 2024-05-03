import React, { useEffect, useState } from 'react';

import { Grid, Box, Avatar, } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';


function ImageField({ value }) {
  return (
    <Avatar src={value} alt="text" sx={{ display: 'flex', alignItems: 'center' }} style={{ width: 50, height: 50, marginRight: 5 }} />
  )
}
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },

  {
    field: 'postTitle',
    headerName: 'Post Title',
    width: 100,
    editable: true,
  },
  {
    field: 'content',
    headerName: 'Content',
    width: 450,
    editable: true,
  },

  {
    field: 'category',
    headerName: 'Category',
    width: 150,
    editable: true,
    type: 'select',
  },
  {
    field: 'image',
    headerName: 'Image',
    renderCell: ImageField,
    width: 100,
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
  },
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

const PostList = () => (
  <MainCard title="TIÊU ĐỀ">
    <Grid container spacing={gridSpacing}>

    </Grid>
    <SubCard>
      <DataGridDemo />
    </SubCard>
  </MainCard>
);

export default PostList;
