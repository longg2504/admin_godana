import React, { useState, useEffect } from 'react';
import { Box, ImageList, ImageListItem, ImageListItemBar, IconButton, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const UploadImage = ({ imagePreviews, onChange }) => {
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        setPreviews(imagePreviews || []);
    }, [imagePreviews]);

    useEffect(() => {
        return () => {
            // Revoke the data uris to avoid memory leaks
            previews.forEach(preview => URL.revokeObjectURL(preview.url));
        };
    }, [previews]);

    const handleRemoveImage = (index) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
        onChange(updatedPreviews); // Cập nhật state của FormPlaceDialog
        URL.revokeObjectURL(previews[index].url);
    };

    const openSnackbar = (message) => {
        setSnackbar({ open: true, message });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ open: false });
    };

    const handleFileChange = (event) => {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const filesArray = Array.from(event.target.files).filter(file =>
            validImageTypes.includes(file.type)
        ).map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));

        if (filesArray.length !== event.target.files.length) {
            openSnackbar('Some files were ignored because they are not valid images.');
        }

        setPreviews(prev => [...prev, ...filesArray]);
        onChange(filesArray.map(f => f.file));
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenImage = (url) => {
        setSelectedImage(url);
        setOpen(true);
    };

    return (
        <Box>
            <input
                accept="image/jpeg, image/png, image/gif"
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="raised-button-file"
            />
            <label htmlFor="raised-button-file">
                <Button variant="contained" component="span">
                    Upload Images
                </Button>
            </label>
            <ImageList cols={3} gap={8}>
                {previews.map((item, index) => (
                    <ImageListItem key={item.url}>
                        <Button
                            onClick={() => handleOpenImage(item.url)}
                            style={{ padding: 0, width: '100%', height: '100%' }}
                            component="span"
                        >
                            <img
                                src={item.url}
                                alt={`preview ${index}`}
                                loading="lazy"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </Button>
                        <ImageListItemBar
                            actionIcon={
                                <IconButton onClick={() => handleRemoveImage(index)}>
                                    <CloseIcon color="error" />
                                </IconButton>
                            }
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Preview</DialogTitle>
                <DialogContent>
                    <img src={selectedImage} alt="Enlarged preview" style={{ width: '100%' }} />
                </DialogContent>
            </Dialog>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UploadImage;
