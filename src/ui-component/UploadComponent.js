import React from 'react';
import { Button, IconButton, Grid, Typography } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

const UploadComponent = ({ name, onChange }) => {
    const [fileNames, setFileNames] = React.useState([]);

    const handleUploadChange = (e) => {
        const files = e.target.files;
        const fileArray = Array.from(files).map((file) => file.name);
        setFileNames(fileArray);
        onChange(e.target.files);
    };

    return (
        <Grid container alignItems="center" spacing={2}>
            <Grid item>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={handleUploadChange}
                />
                <label htmlFor="raised-button-file">
                    <Button variant="contained" component="span">
                        Upload
                    </Button>
                </label>
            </Grid>
            <Grid item xs>
                {fileNames.length > 0 ? (
                    <Typography variant="body2">{fileNames.join(', ')}</Typography>
                ) : (
                    <Typography variant="body2">No file chosen</Typography>
                )}
            </Grid>
        </Grid>
    );
};

// Replace the placeholder with this UploadComponent in your form
/*
<UploadComponent name="placeAvatar" onChange={(files) => {
    // Handle the files, maybe prepare for upload or update state
    console.log(files);
}} />
*/

// Remember to adjust your form or state management to handle the files accordingly.
