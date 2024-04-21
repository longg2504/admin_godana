import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    TextField, Button, DialogActions,
    Grid, FormControl, InputLabel, Select,
    OutlinedInput, FormHelperText, MenuItem,
    Box, ImageList, ImageListItem, Snackbar, Alert,
    ImageListItemBar, IconButton
}
    from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import SubCard from 'ui-component/cards/SubCard';
import FormDialog from 'ui-component/FormDialog'
import { fetchUpdatePlaceById } from 'constant/constURL/URLPlace';
import { fetchCategory, createCategory } from 'constant/constURL/URLCategory';
import { fetchDistrict, fetchWard } from 'constant/constURL/URLLocationRegion';

const createTimeOptions = (start, end, step) => {
    const options = [];
    for (let i = start; i <= end; i += step) {
        options.push(<MenuItem key={i} value={`${i < 10 ? `0${i}` : i}`}>{`${i < 10 ? `0${i}` : i}`}</MenuItem>);
    }
    return options;
};

const TimeSelect = ({ onTimeChange, initialOpenTime = '', initialCloseTime = '' }) => {
    const [timeSetting, setTimeSetting] = useState('');
    const [openHour, setOpenHour] = useState('');
    const [openMinute, setOpenMinute] = useState('');
    const [closeHour, setCloseHour] = useState('');
    const [closeMinute, setCloseMinute] = useState('');

    useEffect(() => {
        if (initialOpenTime === '00:00' && initialCloseTime === '23:59') {
            setTimeSetting('all_day');
        } else if (initialOpenTime && initialCloseTime) {
            setTimeSetting('specific_time');
            const [openH, openM] = initialOpenTime.split(':');
            const [closeH, closeM] = initialCloseTime.split(':');
            setOpenHour(openH);
            setOpenMinute(openM);
            setCloseHour(closeH);
            setCloseMinute(closeM);
        }
    }, [initialOpenTime, initialCloseTime]);

    const handleTimeChange = (field, value) => {
        if (field === 'openTime') {
            const [hour, minute] = value.split(':');
            setOpenHour(hour);
            setOpenMinute(minute);
            if (parseInt(hour) > parseInt(closeHour) || (hour === closeHour && parseInt(minute) >= parseInt(closeMinute))) {
                setCloseHour(hour);
                setCloseMinute(minute);
            }
            onTimeChange('openTime', `${hour}:${minute}`);
        } else if (field === 'closeTime') {
            const [hour, minute] = value.split(':');
            setCloseHour(hour);
            setCloseMinute(minute);
            onTimeChange('closeTime', `${hour}:${minute}`);
        }
    };

    const handleTimeSettingChange = (event) => {
        const setting = event.target.value;
        setTimeSetting(setting);

        if (setting === 'all_day') {
            handleTimeChange('openTime', '00:00');
            handleTimeChange('closeTime', '23:59');
        } else {
            setOpenHour('');
            setOpenMinute('');
            setCloseHour('');
            setCloseMinute('');
            onTimeChange('openTime', '');
            onTimeChange('closeTime', '');
        }
    };

    // Only filter closing minutes if the closing hour is the same as the opening hour
    const closingMinutesOptions = createTimeOptions(0, 59, 1).filter(minute => {
        const minuteValue = parseInt(minute.props.value);
        return openHour !== closeHour || minuteValue >= parseInt(openMinute);
    });

    return (
        <FormControl fullWidth style={{ marginTop: '16px' }}>
            <InputLabel id="time-setting-label">Chọn Thời Gian</InputLabel>
            <Select
                labelId="time-setting-label"
                id="time-setting"
                value={timeSetting}
                onChange={handleTimeSettingChange}
                fullWidth
            >
                <MenuItem value="all_day">Mở cả ngày</MenuItem>
                <MenuItem value="specific_time">Mốc thời gian</MenuItem>
            </Select>
            {timeSetting === 'specific_time' && (
                <Grid container spacing={2} style={{ marginTop: 8 }}>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Giờ mở cửa</InputLabel>
                            <Select value={openHour} onChange={(e) => handleTimeChange('openTime', `${e.target.value}:${openMinute}`)}>
                                {createTimeOptions(0, 23, 1)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Phút mở cửa</InputLabel>
                            <Select value={openMinute} onChange={(e) => handleTimeChange('openTime', `${openHour}:${e.target.value}`)}>
                                {createTimeOptions(0, 59, 1)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Giờ đóng cửa</InputLabel>
                            <Select value={closeHour} onChange={(e) => handleTimeChange('closeTime', `${e.target.value}:${closeMinute}`)}>
                                {createTimeOptions(parseInt(openHour), 23, 1)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Phút đóng cửa</InputLabel>
                            <Select value={closeMinute} onChange={(e) => handleTimeChange('closeTime', `${closeHour}:${e.target.value}`)}>
                                {closingMinutesOptions}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            )}
        </FormControl>
    );
};

// ==============================|| UPLOAD IMAGE ||============================== //

// Component to upload images
const UploadImage = ({ onChange }) => {
    const [imagePreviews, setImagePreviews] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });

    // Function to open the snackbar
    const openSnackbar = (message) => {
        setSnackbar({ open: true, message });
    };

    // Function to close the snackbar
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handleFileChange = (event) => {
        if (event.target.files) {
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

            setImagePreviews(prev => [...prev, ...filesArray]);
            onChange(filesArray);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteImage = (index) => {
        const filteredImages = imagePreviews.filter((_, idx) => idx !== index);
        setImagePreviews(filteredImages);
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
                {imagePreviews.map((item, index) => (
                    <ImageListItem key={index}>
                        <Button
                            onClick={() => handleOpenImage(item.url)}
                            style={{ padding: 0, width: '100%', height: '100%' }}
                            component="span"
                        >
                            <img
                                src={item.url}
                                alt={`preview ${index}`}
                                loading="lazy"
                                style={{ width: '100%', height: '100%' }}
                            />
                        </Button>
                        <ImageListItemBar
                            actionIcon={
                                <IconButton onClick={() => handleDeleteImage(index)}>
                                    <CloseIcon color="error" />
                                </IconButton>
                            }
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{"Preview"}</DialogTitle>
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

// ==============================|| UPLOAD IMAGE ||============================== //


// ==============================|| LOCATION REGION SELECT ||============================== //

function LocationRegionSelect({ label, options, onSelectionChange, name, disabled = false, error, selectedOption }) {
    const [currentSelection, setCurrentSelection] = useState('');
    useEffect(() => {
        if (selectedOption) {
            setCurrentSelection(selectedOption);
        }
    }, [selectedOption]);

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
        if (onSelectionChange) {
            onSelectionChange(name, event.target.value); // Pass both the field name and value
        }
    };

    return (
        <FormControl fullWidth margin="normal" error={!!error}>
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Select
                labelId={`${label}-label`}
                id={`${label}`}
                value={currentSelection}
                onChange={handleChange}
                input={<OutlinedInput label={label} />}
                disabled={disabled}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.id}
                        value={option.id}
                    >
                        {option.title}
                    </MenuItem>
                ))}
            </Select>
            {!!error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
}

function ProvinceSelect() {
    // Giả sử ID và tên của "Thành Phố Đà Nẵng"
    const daNangProvince = { id: '48', title: 'Thành Phố Đà Nẵng' };

    return (
        <FormControl fullWidth margin="normal">
            <InputLabel id="province-label">Province</InputLabel>
            <Select
                labelId="province-label"
                id="province-select"
                value={daNangProvince.id} // Trực tiếp sử dụng giá trị cố định
                input={<OutlinedInput label="Province" />}
                disabled={true} // Disable Select để người dùng không thể tương tác
            >
                <MenuItem value={daNangProvince.id}>{daNangProvince.title}</MenuItem>
            </Select>
        </FormControl>
    );
}

// ==============================|| LOCATION REGION SELECT ||============================== //
// ==============================|| SINGLE SELECT ||============================== //
function SingleSelect({ label, options, onChange, name, error, selectedOption }) {
    useEffect(() => {
        if (selectedOption) {
            setCurrentSelection(selectedOption);
        }
    }, [selectedOption]);

    const [currentSelection, setCurrentSelection] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

    const handleSaveNewCategory = async (newCategoryData) => {
        try {
            const response = await createCategory(newCategoryData);
            console.log('New category created:', response.data);
            setCategoryDialogOpen(false);
            onChange(name, response.data.id);
            setSnackbarMessage('Category successfully created!');
            setSnackbarSeverity('success');
            console.log(isDialogOpen);
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error creating category:', error);
            setSnackbarMessage('Failed to create category. Please try again.');
            setSnackbarSeverity('error');
            setCategoryDialogOpen(false);
            console.log(isDialogOpen);
            setOpenSnackbar(true);
        }
    };
    const handleChange = (event) => {
        const value = event.target.value;
        setCurrentSelection(value);
        if (value === 'add_new') {
            setCategoryDialogOpen(true);
        } else {
            onChange(name, value);
        }
    };

    const handleCategoryDialogToggle = () => {
        setCategoryDialogOpen(!categoryDialogOpen);
        console.log("Category form: " + categoryDialogOpen);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };


    return (
        <FormControl fullWidth margin="normal" error={!!error}>
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Select
                labelId={`${label}-label`}
                id={`${label}`}
                value={currentSelection}
                onChange={handleChange}
                input={<OutlinedInput label={label} />}
            >
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>{option.title}</MenuItem>
                ))}
                <MenuItem value="add_new">Add New {label}</MenuItem>
            </Select>
            {!!error && <FormHelperText>{error}</FormHelperText>}

            <FormDialog
                open={categoryDialogOpen}
                onClose={handleCategoryDialogToggle}
                onSave={handleSaveNewCategory}
                fields={[{ name: 'title', label: 'Category Title', type: 'text' }]}
            />
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Điều chỉnh vị trí hiển thị ở đây
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </FormControl>

    );
}

// ==============================|| SINGLE SELECT ||============================== //


// Main dialog component
const FormPlaceDialog = ({ open, editData, onClose }) => {
    console.log("Form status: " + open);

    const [formErrors, setFormErrors] = useState({});
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [categories, setCategories] = useState([]);
    // const [isDialogOpen, setIsDialogOpen] = useState(open);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedDistrictId, setSelectedDistrictId] = useState('');
    const [selectedWardId, setSelectedWardId] = useState('');
    // ==============================|| VALIDATION FIELD ||============================== //

    const validateField = (name, value) => {
        switch (name) {
            case 'placeTitle':
                if (!value.trim()) return "Place Title is required";
                break;
            case 'content':
                if (!value.trim()) return "Content is required";
                break;
            case 'longitude':
                if (!value.trim()) return "Longitude is required";
                else if (!/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(value)) return "Invalid longitude format";
                break;
            case 'latitude':
                if (!value.trim()) return "Latitude is required";
                else if (!/^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(value)) return "Invalid latitude format"; break;
            case 'address':
                if (!value.trim()) return "Address is required";
                break;
            case 'email':
                if (!value.trim()) return "Email is required";
                else if (!/\S+@\S+\.\S+/.test(value)) return "Email is not valid";
                break;
            case 'phone':
                if (!value.trim()) return "Phone is required";
                else if (!/^\d{1,10}$/.test(value)) return "Phone must be up to 10 digits";
                break;
            case 'website':
                if (!value.trim()) return "Website is required";
                // else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z]{2,6})([\w .-]*)*\/?$/.test(value)) return "Invalid website format";
                break;
            case 'openTime':
            case 'closeTime':
                if (!value.trim()) return `${name} is required`;
                else if (!/^([1-9]|1[012]):[0-5][0-9]\s?(AM|PM)$/i.test(value)) return "Invalid time format, expected h:mm AM/PM";
                break;
            case 'categoryId':
            case 'districtId':
            case 'wardId':
                if (!value) return `${name.replace('Id', '')} is required`;
                break;
            default:
                return "";
        }
        return "";
    };
    // ==============================|| CATEGORY API ||============================== //

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetchCategory();
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, []);


    // ==============================|| TIMESELECT ||============================== //
    const handleTimeChange = (field, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: value,
        }));
        // Optional: validate the new time values here
    };

    // ==============================|| UPLOAD IMAGE ||============================== //
    const handleFileChange = (event) => {
        if (event.target.files.length) {
            const files = Array.from(event.target.files);
            setFormData(formData => ({
                ...formData,
                placeAvatar: [...formData.placeAvatar, ...files]
            }));
        }
    };


    // ==============================|| LOCATION REGION ||============================== //
    useEffect(() => {
        fetchDistrict().then(response => {
            const districtsData = response.data.results.map(district => ({
                id: district.district_id,
                title: district.district_name
            }));
            setDistricts(districtsData);
        }).catch(error => console.error("Failed to fetch districts:", error));
    }, []);

    const handleSelectionChange = (name, value) => {
        // Cập nhật giá trị cho districtId hoặc wardId
        let updatedValues = { [name]: value };

        // Tìm và cập nhật districtName nếu districtId được thay đổi
        if (name === "district") {
            const selectedDistrict = districts.find(district => district.id === value);
            if (selectedDistrict) {
                updatedValues.districtName = selectedDistrict.title;
                // Khi chọn district mới, cần reset ward
                setWards([]);
                updatedValues.wardId = '';
                updatedValues.wardName = '';
            }

            fetchWard(value).then(response => {
                const wardsData = response.data.results.map(ward => ({
                    id: ward.ward_id,
                    title: ward.ward_name
                }));
                setWards(wardsData);
            }).catch(error => {
                console.error("Failed to fetch wards:", error);
            });
        }

        // Tìm và cập nhật wardName nếu wardId được thay đổi
        if (name === "ward") {
            const selectedWard = wards.find(ward => ward.id === value);
            if (selectedWard) {
                updatedValues.wardName = selectedWard.title;
            }
        }

        // Cập nhật formData với giá trị mới
        setFormData(prevState => ({
            ...prevState,
            ...updatedValues
        }));

        const errorMessage = validateField(name, value);
        setFormErrors(prevErrors => ({ ...prevErrors, [name]: errorMessage }));
    };

    useEffect(() => {
        if (selectedDistrictId) {
            fetchWard(selectedDistrictId).then(response => {
                const wardsData = response.data.results.map(ward => ({
                    id: ward.ward_id,
                    title: ward.ward_name
                }));
                setWards(wardsData);
            }).catch(error => console.error("Failed to fetch wards:", error));
        } else {
            setWards([]);  // Clear wards if no district is selected
        }
    }, [selectedDistrictId]);  // Dependency should be on selectedDistrictId to refetch when it changes



    useEffect(() => {
        if (editData) {
            setFormData({
                ...formData, ...editData
            });
            setSelectedCategoryId(editData.categoryId);
            setSelectedDistrictId(editData.districtId);
            setSelectedWardId(editData.wardId);
        }

    }, [editData]);


    const [formData, setFormData] = useState({
        placeTitle: '',
        content: '',
        longitude: '',
        latitude: '',
        placeAvatar: [],
        categoryId: '',
        categoryName: '',
        provinceId: '48',
        provinceName: 'Thành Phố Đà Nẵng',
        districtId: '',
        districtName: '',
        wardId: '',
        wardName: '',
        address: '',
        email: '',
        phone: '',
        website: '',
        openTime: '',
        closeTime: '',
        userId: 1,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'info',
        message: ''
    });

    // Open the snackbar with a message and severity
    const openSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    // Close the snackbar
    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate all fields in formData
        let hasError = false;
        let newFormErrors = {};
        for (const field in formData) {
            const errorMessage = validateField(field, formData[field]);
            if (errorMessage) {
                newFormErrors[field] = errorMessage;
                hasError = true;
            }
        }

        // If there are validation errors, set them and stop the submission
        if (hasError) {
            setFormErrors(newFormErrors);
            return;
        }

        // If no validation errors, proceed with form submission
        const formDataToSend = new FormData();

        console.log("Form Data To Send 1: " + formDataToSend);
        // Append non-file fields to formDataToSend
        Object.keys(formData).forEach(key => {
            if (key !== 'placeAvatar') { // Exclude file fields for now
                formDataToSend.append(key, formData[key]);
            }
        });

        // Append file fields to formDataToSend, if they exist
        if (formData.placeAvatar && formData.placeAvatar.length) {
            formData.placeAvatar.forEach((file, index) => {
                // Append each file under the name 'placeAvatar[]' to allow for array-like processing on the server side
                formDataToSend.append(`placeAvatar[${index}]`, file.file);
            });
        }

        // Check if any invalid files were attempted to be uploaded
        if (invalidFiles.length > 0) {
            openSnackbar('Some files were not valid images and have not been uploaded.', 'error');
            return;
        }

        // API call to update the place
        try {
            const response = await fetchUpdatePlaceById(editData.id, formDataToSend);
            console.log('Update successful:', response.data);

            openSnackbar('Update successful!', 'success');
            onClose();

        } catch (error) {
            console.error('Failed to update place:', error);
            openSnackbar('Failed to update place. Please try again.', 'error');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle variant='h4'>Infomation Place</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {/* Input fields setup */}
                    <Grid item xs={12} md={4}>
                        <TextField label="Place Title" name="placeTitle" fullWidth onChange={handleChange} value={formData.placeTitle} margin="normal" />
                        <TextField label="Content" name="content" fullWidth onChange={handleChange} value={formData.content} margin="normal" multiline />
                        <TextField label="Longitude" name="longitude" fullWidth onChange={handleChange} value={formData.longitude} margin="normal" />
                        <TextField label="Latitude" name="latitude" fullWidth onChange={handleChange} value={formData.latitude} margin="normal" />
                        <SingleSelect label="Category" name="category" options={categories} onChange={(name, value) => handleSelectionChange(name, value)} selectedOption={selectedCategoryId} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField label="Website" name="website" fullWidth onChange={handleChange} value={formData.website} margin="normal" />
                        <TextField label="Email" name="email" fullWidth onChange={handleChange} value={formData.email} margin="normal" />
                        <TextField label="Phone" name="phone" fullWidth onChange={handleChange} value={formData.phone} margin="normal" />
                        <TextField label="Address" name="address" fullWidth onChange={handleChange} value={formData.address} margin="normal" />
                        <TimeSelect label="Set Time" onTimeChange={handleTimeChange}
                            initialOpenTime={formData.openTime}
                            initialCloseTime={formData.closeTime} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <ProvinceSelect />
                        <LocationRegionSelect
                            label="District"
                            options={districts}
                            onSelectionChange={(name, value) => handleSelectionChange(name, value)}
                            disabled={false}
                            name="district"
                            selectedOption={selectedDistrictId}
                            error={formErrors.districtId}
                        />
                        <LocationRegionSelect label="Ward"
                            options={wards}
                            onSelectionChange={(name, value) => handleSelectionChange(name, value)}
                            name="ward"
                            selectedOption={selectedWardId}
                            disabled={!selectedDistrictId} // Disable nếu district chưa được chọn
                            error={formErrors.wardId} />
                        <SubCard>
                            <UploadImage onChange={handleFileChange} />
                        </SubCard>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Update</Button>
            </DialogActions>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default FormPlaceDialog;
