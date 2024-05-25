import React, { useState } from 'react';
import {
    Box,
    Avatar,
    IconButton,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    // CircularProgress,
    // Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';

function ActionButtons({ id, onDelete }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleConfirmDelete = () => {
        onDelete(id);
        handleClose();
    };

    return (
        <>
            <IconButton onClick={handleOpen} style={{ color: 'red' }}>
                <DeleteIcon  />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <DeleteIcon color="error" style={{ fontSize: 100 }} />
                        <DialogContentText style={{ marginTop: 16, textAlign: 'center', fontSize: '1.2rem' }}>
                            Are you sure you want to detele this post?
                        </DialogContentText>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

function ImageField({ value }) {
    return (
        <Avatar src={value} alt="text" sx={{ display: 'flex', alignItems: 'center' }} style={{ width: 50, height: 50, marginRight: 5 }} />
    )
}
const columns = (handleDelete) => [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Post Title', width: 100, editable: true },
    { field: 'content', headerName: 'Content', width: 450, editable: true },
    { field: 'category', headerName: 'Category', width: 150, editable: true },
    { field: 'image', headerName: 'Image', renderCell: ImageField, width: 100, editable: false },
    { field: 'username', headerName: 'Username', width: 150, sortable: false },
    { field: 'like', headerName: 'Likes', width: 70, sortable: false },
    { field: 'comment', headerName: 'Comments', width: 100, sortable: false },
    // { field: 'createtime', headerName: 'Create Time', width: 100, sortable: false },
    {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        width: 60,
        renderCell: (params) => <ActionButtons id={params.row.id} onDelete={handleDelete} />,
        align: 'center'
    }

];

const DataGridPost = ({ options, handleDelete }) => {
    

    const rows = options && options.length > 0
        ? options.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            category: post.category.title,
            username: post.user.username,
            image: post.postAvatar?.fileUrl || 'defaultImageUrl',
            like: post.like,
            comment: post.comment,
            createtime: post.createtime
        })) : [];

    // if (loading) return <CircularProgress />;
    // if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <>
            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns(handleDelete)}
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