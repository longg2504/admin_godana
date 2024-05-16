import React from 'react';
import {
    Box,
    Avatar,
    // CircularProgress,
    // Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function ImageField({ value }) {
    return (
        <Avatar src={value} alt="text" sx={{ display: 'flex', alignItems: 'center' }} style={{ width: 50, height: 50, marginRight: 5 }} />
    )
}
const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Post Title', width: 100, editable: true },
    { field: 'content', headerName: 'Content', width: 450, editable: true },
    { field: 'category', headerName: 'Category', width: 150, editable: true },
    { field: 'image', headerName: 'Image', renderCell: ImageField, width: 100, editable: false },
    { field: 'username', headerName: 'Username', width: 150, sortable: false },
];

const DataGridPost = ({options}) => {

    const rows = options && options.length > 0
        ? options.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            category: post.category.title,
            username: post.user.username,
            image: post.postAvatar?.fileUrl || 'defaultImageUrl',
        })) : [];

    // if (loading) return <CircularProgress />;
    // if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <>
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
        </>
    );
}
export default DataGridPost;