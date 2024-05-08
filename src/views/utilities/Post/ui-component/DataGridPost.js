import React, { useEffect, useState } from 'react';
import {
    Box,
    Avatar,
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

const DataGridPost = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetch data from the API
                const response = await findAllPost();

                // Verify the data structure
                if (Array.isArray(response.data)) {
                    setPosts(response.data);
                } else {
                    console.error("Unexpected data format:", response.data);
                    setError("Unexpected data format received from the API.");
                }
            } catch (err) {
                // Handle API errors
                console.error("Failed to fetch posts:", err);
                setError("Failed to fetch posts. Please try again later.");
            }
        };

        // Call the function to fetch posts
        fetchPosts();
    }, []);

    const rows = posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category.title,
        username: post.user.username,
        image: post.postAvatar?.[0]?.fileUrl || 'defaultImageUrl',
    }));

    return (
        <>
            {error && <div style={{ color: 'red' }}>{error}</div>}
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