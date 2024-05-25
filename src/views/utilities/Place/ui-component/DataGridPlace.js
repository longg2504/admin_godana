import React, { useState } from 'react';
import {
    Box,
    Avatar,
    IconButton,
    Typography,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';


function NoRowsOverlay() {
    return (
        <GridOverlay>
            <div style={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" gutterBottom>
                    Không tìm thấy dữ liệu (No data found)
                </Typography>
            </div>
        </GridOverlay>
    );
}

function ActionButtons({ id, onDelete }) {
    const [open, setOpen] = useState(false);

    const handleOpen = (e) => {
        e.stopPropagation(); // Stop the event from propagating further
        setOpen(true);
    };

    const handleClose = (e) => {
        if (e) e.stopPropagation(); // Stop the event from propagating only if `e` is available
        setOpen(false);
    };
    const handleConfirmDelete = (e) => {
        e.stopPropagation(); // Stop the event from propagating further
        onDelete(id);
        handleClose();
    };


    return (
        <>
            <IconButton onClick={handleOpen} style={{ color: 'red' }}>
                <DeleteIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <DeleteIcon color="error" style={{ fontSize: 100 }} />
                        <DialogContentText style={{ marginTop: 16, textAlign: 'center', fontSize: '1.2rem' }}>
                            Are you sure you want to detele this place?
                        </DialogContentText>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(e) => handleClose(e)}>Cancel</Button>
                    <Button onClick={(e) => handleConfirmDelete(e)} autoFocus>Delete</Button>
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
    { field: 'id', headerName: 'ID', width: 30 },
    {
        field: 'image',
        headerName: 'Image',
        renderCell: ImageField,
        width: 70,
        editable: false,
    },
    {
        field: 'title',
        headerName: 'Title',
        width: 100,
        editable: false,
    },
    {
        field: 'address',
        headerName: 'Address',
        width: 200,
        editable: false,
    },
    {
        field: 'category',
        headerName: 'Category',
        width: 120,
        editable: false,
        type: 'select',
    },
    {
        field: 'opentime',
        headerName: 'Open Time',
        sortable: false,
        width: 120,
    },
    {
        field: 'closetime',
        headerName: 'Close Time',
        sortable: false,
        width: 120,
    },
    {
        field: 'phone',
        headerName: 'Phone',
        sortable: false,
        width: 110,
    },
    {
        field: 'email',
        headerName: 'Email',
        sortable: false,
        width: 150,
    },
    {
        field: 'website',
        headerName: 'Website',
        sortable: false,
        width: 150,
    },
    {
        field: 'rating',
        headerName: 'Rating',
        sortable: false,
        width: 70,
    },
    {
        field: 'numberrating',
        headerName: 'Number Rating',
        sortable: false,
        width: 150,
    },
    {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        width: 100,
        fixed: true,
        renderCell: (params) => (
            <ActionButtons
                id={params.row.id}
                onDelete={handleDelete}
            />
        ),
        align: 'center'
    }
];

const DataGridPlace = ({ onRowClick, options, handleDelete }) => {

    const getAddress = (locationRegion) => {
        const parts = [locationRegion?.address, locationRegion?.districtName, locationRegion?.wardName];
        return parts.filter(Boolean).join(', '); // Only join non-falsy values
    };

    // Map places to rows here
    const rows = options && options.length > 0
        ? options.map((place) => ({
            id: place.id,
            image: place.placeAvatar?.[0]?.fileUrl || 'defaultImageUrl',
            title: place.placeTitle,
            address: getAddress(place.locationRegion),
            longitude: place.longitude,
            latitude: place.latitude,
            category: place.category.title,
            email: place.contact.email,
            phone: place.contact.phone,
            website: place.contact.website,
            opentime: place.contact.openTime,
            closetime: place.contact.closeTime,
            rating: place.rating || 0,
            numberrating: place.numberrating || 0,
        }))
        : [];

    return (
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
                rows={rows ? rows : "Không có dữ liệu"}
                columns={columns(handleDelete)}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 15,
                        },
                    },
                }}
                pageSizeOptions={[15]}
                checkboxSelection
                disableRowSelectionOnClick
                onRowClick={onRowClick}
                noRowsOverlayComponent={NoRowsOverlay}
                pagination
            />
        </Box>
    );
}
export default DataGridPlace;
