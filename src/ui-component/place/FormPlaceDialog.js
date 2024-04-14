import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    TextField, Button, DialogActions,
    Grid, FormControl, InputLabel, Select,
    OutlinedInput, FormHelperText, MenuItem,
    Box, ImageList, ImageListItem, Snackbar, Alert
}
    from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import FormDialog from 'ui-component/FormDialog'
import { fetchCategory, createCategory } from 'constant/constURL/URLCategory';
import { fetchDistrict, fetchWard } from 'constant/constURL/URLLocationRegion';

const createTimeOptions = (start, end, step) => {
    const options = [];
    for (let i = start; i <= end; i += step) {
        options.push(<MenuItem key={i} value={i < 10 ? `0${i}` : `${i}`}>{i < 10 ? `0${i}` : i}</MenuItem>);
    }
    return options;
};

const TimeSelect = ({ onTimeChange }) => {
    const [timeSetting, setTimeSetting] = useState('');
    const [openHour, setOpenHour] = useState('');
    const [openMinute, setOpenMinute] = useState('');
    const [closeHour, setCloseHour] = useState('');
    const [closeMinute, setCloseMinute] = useState('');

    const handleTimeSettingChange = (event) => {
        const setting = event.target.value;
        setTimeSetting(setting);

        if (setting === 'all_day') {
            onTimeChange('openTime', '00:00');
            onTimeChange('closeTime', '23:59');
        } else {
            // If the user switches back to specific time, reset to the initial state
            setOpenHour('');
            setOpenMinute('');
            setCloseHour('');
            setCloseMinute('');
        }
    };

    const handleOpenHourChange = (event) => {
        const newHour = event.target.value;
        setOpenHour(newHour);
        // Automatically adjust close time if it's before the new open time
        if (newHour > closeHour || (newHour === closeHour && (openMinute >= closeMinute || closeMinute === ''))) {
            setCloseHour(newHour);
            setCloseMinute('');
        }
    };

    const handleOpenMinuteChange = (event) => {
        const newMinute = event.target.value;
        setOpenMinute(newMinute);
        // Adjust close time minutes if the hours are the same and new minutes are later than close minutes
        if (openHour === closeHour && newMinute >= closeMinute) {
            setCloseMinute('');
        }
    };

    const handleTimeChange = (field, value) => {
        if (field === 'openTime') {
            const [hour, minute] = value.split(':');
            setOpenHour(hour);
            setOpenMinute(minute);
            if (parseInt(hour) > parseInt(closeHour) || (hour === closeHour && parseInt(minute) > parseInt(closeMinute))) {
                setCloseHour(hour);
                setCloseMinute(minute);
            }
        } else if (field === 'closeTime') {
            setCloseHour(value.split(':')[0]);
            setCloseMinute(value.split(':')[1]);
        }
    };

    const closingHoursOptions = openHour ? createTimeOptions(parseInt(openHour), 23, 1) : createTimeOptions(0, 23, 1);

    // For closing minutes, only filter them if the closing hour is the same as the opening hour
    const closingMinutesOptions = createTimeOptions(0, 59, 5).filter(minute => {
        const minuteValue = parseInt(minute.props.value);
        return openHour !== closeHour || minuteValue > parseInt(openMinute);
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
                            <Select value={openHour} onChange={handleOpenHourChange}>
                                {createTimeOptions(0, 23, 1)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Phút mở cửa</InputLabel>
                            <Select value={openMinute} onChange={handleOpenMinuteChange}>
                                {createTimeOptions(0, 59, 5)}
                            </Select>
                        </FormControl>
                    </Grid>
                    {openHour && (
                        <>
                            <Grid item xs={6}>
                                <FormControl fullWidth style={{ marginTop: '7px' }}>
                                    <InputLabel>Giờ đóng cửa</InputLabel>
                                    <Select value={closeHour} onChange={(e) => handleTimeChange('closeTime', e.target.value + ':' + closeMinute)}>
                                        {closingHoursOptions}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth style={{ marginTop: '7px' }}>
                                    <InputLabel>Phút đóng cửa</InputLabel>
                                    <Select value={closeMinute} onChange={(e) => handleTimeChange('closeTime', closeHour + ':' + e.target.value)}>
                                        {closingMinutesOptions}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </>
                    )}
                </Grid>
            )}
        </FormControl>
    );
};


// ==============================|| UPLOAD IMAGE ||============================== //

// Component to upload images
const UploadImage = ({ onChange }) => {
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleFileChange = (event) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files).map(file => URL.createObjectURL(file));
            setImagePreviews(filesArray);
            onChange(event);
            return () => filesArray.forEach(file => URL.revokeObjectURL(file));
        }
    };

    return (
        <Box>
            <input accept="image/*" type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} id="raised-button-file" />
            <label htmlFor="raised-button-file">
                <Button variant="contained" component="span">
                    Upload Images
                </Button>
            </label>
            <ImageList cols={3} gap={8}>
                {imagePreviews.map((item, index) => (
                    <ImageListItem key={index}>
                        <img src={item} alt={`preview ${index}`} loading="lazy" style={{ width: '100%', height: '100%' }} />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    );
};

// ==============================|| UPLOAD IMAGE ||============================== //


// ==============================|| LOCATION REGION SELECT ||============================== //

function LocationRegionSelect({ label, options, onSelectionChange, name, disabled = false, error }) {
    // const theme = useTheme();
    const [selectedOption, setSelectedOption] = useState('');

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
                value={selectedOption}
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
function SingleSelect({open, label, options, onChange, name, error }) {
    const [selectedOption, setSelectedOption] = useState('');

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


    const handleSaveNewCategory = async (newCategoryData) => {
        try {
            const response = await createCategory(newCategoryData);
            console.log('New category created:', response.data);
            setIsDialogOpen(false);
            onChange(name, response.data.id);
            setSnackbarMessage('Category successfully created!');
            setSnackbarSeverity('success');
            console.log(isDialogOpen);
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error creating category:', error);
            setSnackbarMessage('Failed to create category. Please try again.');
            setSnackbarSeverity('error');
            setIsDialogOpen(false);
            console.log(isDialogOpen);
            setOpenSnackbar(true);
        }
    };
    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedOption(value);
        if (value === 'add_new') {
            setIsDialogOpen(true);
        } else {
            onChange(name, value);
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        console.log(isDialogOpen);
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
                value={selectedOption}
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
                open={open || isDialogOpen}
                onClose={handleDialogClose}
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
const FormPlaceDialog = ({ open, editData }) => {

    const [formErrors, setFormErrors] = useState({});
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        if (name === "districtId") {
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
        if (name === "wardId") {
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
        if (editData) {
            setFormData({
                ...formData, ...editData
            });
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

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle variant='h4'>Infomation Place</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {/* Input fields setup */}
                    <Grid item xs={12} md={4}>
                        <TextField label="Place Title" name="placeTitle" fullWidth onChange={handleChange} value={formData.placeTitle} margin="normal" />
                        <TextField label="Content" name="content" fullWidth onChange={handleChange} value={formData.content} margin="normal" multiline />
                        <TextField label="Longitude" name="longitude" fullWidth onChange={handleChange} value={formData.longitude} margin="normal" />
                        <TextField label="Latitude" name="latitude" fullWidth onChange={handleChange} value={formData.latitude} margin="normal" />
                        <SingleSelect label="Category" name="category" options={categories} open={isDialogOpen} onChange={(name, value) => handleSelectionChange(name, value)}/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField label="Website" name="website" fullWidth onChange={handleChange} value={formData.website} margin="normal" />
                        <TextField label="Email" name="email" fullWidth onChange={handleChange} value={formData.email} margin="normal" />
                        <TextField label="Phone" name="phone" fullWidth onChange={handleChange} value={formData.phone} margin="normal" />
                        <TextField label="Address" name="address" fullWidth onChange={handleChange} value={formData.address} margin="normal" />
                        <TimeSelect label="Set Time" onTimeChange={handleTimeChange} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <ProvinceSelect />
                        <LocationRegionSelect
                            label="District"
                            options={districts}
                            onSelectionChange={(name, value) => handleSelectionChange(name, value)}
                            disabled={false}
                            name="districtId"
                            error={formErrors.districtId}
                        />
                        <LocationRegionSelect label="Ward"
                            options={wards}
                            onSelectionChange={(name, value) => handleSelectionChange(name, value)}
                            name="wardId"
                            disabled={!formData.districtId} // Disable nếu district chưa được chọn
                            error={formErrors.wardId} />
                        <SubCard>
                            <UploadImage onChange={handleFileChange} />
                        </SubCard>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Update</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FormPlaceDialog;
