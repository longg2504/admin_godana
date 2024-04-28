import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    TextField, Button, DialogActions,
    Grid, FormControl, InputLabel, Select,
    OutlinedInput, FormHelperText, MenuItem,
    Snackbar, Alert,
}
    from '@mui/material';

import SubCard from 'ui-component/cards/SubCard';
import FormDialog from 'ui-component/FormDialog'
import { fetchUpdatePlaceById } from 'constant/constURL/URLPlace';
import { fetchCategory, createCategory } from 'constant/constURL/URLCategory';
import { fetchDistrict, fetchWard } from 'constant/constURL/URLLocationRegion';
import UploadImage from 'views/utilities/Place/UploadImage';

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



// ==============================|| LOCATION REGION SELECT ||============================== //

function LocationRegionSelect({ label, options, onSelectionChange, name, disabled = false, selectedOption }) {
    const [currentSelection, setCurrentSelection] = useState(selectedOption);

    useEffect(() => {
        if (selectedOption) {
            setCurrentSelection(selectedOption);
        }
    }, [selectedOption]);

    const handleChange = (event) => {
        const newSelection = event.target.value;
        setCurrentSelection(newSelection); // Update the local state
        if (onSelectionChange) {
            onSelectionChange(name, newSelection); // Pass both the field name and value
        }
    };

    return (
        <FormControl fullWidth margin="normal" >
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
function SingleSelect({ label, options, onChange, name, error, selectedOption, setFormData }) {
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
            if (setFormData) {
                setFormData(prev => ({
                    ...prev,
                    categoryId: value,
                    categoryName: options.find(opt => opt.id === value).title
                }));
            }
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
const FormPlaceDialog = ({ open, editData, onClose, }) => {
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [categories, setCategories] = useState([]);
    // const [isDialogOpen, setIsDialogOpen] = useState(open);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedDistrictId, setSelectedDistrictId] = useState('');
    const [selectedWardId, setSelectedWardId] = useState('');

    // ==============================|| VALIDATION FIELD ||============================== //

    // const validateField = (name, value) => {
    //     switch (name) {
    //         case 'placeTitle':
    //             if (!value.trim()) return "Place Title is required";
    //             break;
    //         case 'content':
    //             if (!value.trim()) return "Content is required";
    //             break;
    //         case 'longitude':
    //             if (!value.trim()) return "Longitude is required";
    //             else if (!/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(value)) return "Invalid longitude format";
    //             break;
    //         case 'latitude':
    //             if (!value.trim()) return "Latitude is required";
    //             else if (!/^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(value)) return "Invalid latitude format"; break;
    //         case 'address':
    //             if (!value.trim()) return "Address is required";
    //             break;
    //         case 'email':
    //             if (!value.trim()) return "Email is required";
    //             else if (!/\S+@\S+\.\S+/.test(value)) return "Email is not valid";
    //             break;
    //         case 'phone':
    //             if (!value.trim()) return "Phone is required";
    //             else if (!/^\d{1,10}$/.test(value)) return "Phone must be up to 10 digits";
    //             break;
    //         case 'website':
    //             if (!value.trim()) return "Website is required";
    //             // else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z]{2,6})([\w .-]*)*\/?$/.test(value)) return "Invalid website format";
    //             break;
    //         case 'openTime':
    //         case 'closeTime':
    //             if (!value.trim()) return `${name} is required`;
    //             else if (!/^([1-9]|1[012]):[0-5][0-9]\s?(AM|PM)$/i.test(value)) return "Invalid time format, expected h:mm AM/PM";
    //             break;
    //         case 'categoryId':
    //         case 'districtId':
    //         case 'wardId':
    //             // if (!value) return `${name.replace('Id', '')} is required`;
    //             break;
    //         default:
    //             return "";
    //     }
    //     return "";
    // };
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

    // Sử dụng useMemo để giữ cho imageUrls không thay đổi trừ khi editData thực sự thay đổi
    const imageUrls = useMemo(() => {
        return editData ? editData.placeAvatar.map(img => img.fileUrl) : [];
    }, [editData]);

    // Xử lý việc thay đổi hình ảnh
    const handleFileChange = useCallback((files) => {
        // Cập nhật state để bao gồm những file mới
        setFormData(prev => ({
            ...prev,
            placeAvatar: files
        }));
    }, []);
    


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
        if (name === "districtId") {
            fetchWard(value).then(response => {
                const wardsData = response.data.results.map(ward => ({
                    id: ward.ward_id,
                    title: ward.ward_name
                }));
                setWards(wardsData);
                // After fetching new wards, reset the selectedWardId if it doesn't exist in the new ward list
                setFormData(prevState => ({
                    ...prevState,
                    districtId: value,
                    wardId: wardsData.find(ward => ward.id === prevState.wardId) ? prevState.wardId : ''
                }));
            }).catch(error => {
                console.error("Failed to fetch wards:", error);
                setWards([]);
                setFormData(prevState => ({
                    ...prevState,
                    districtId: value,
                    wardId: ''
                }));
            });
        } else if (name === "wardId") {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
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
            setWards([]); // Clear wards if no district is selected
        }
    }, [selectedDistrictId]);  // Dependency should be on selectedDistrictId to refetch when it changes



    useEffect(() => {
        if (editData) {
            setFormData({
                ...formData,
                ...editData, 
                placeAvatar: editData.placeAvatar || [],
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

    // Xử lý sự thay đổi trên form và cập nhật formData
    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

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

        const formDataToSend = new FormData();

        // Chỉ thêm các File hợp lệ vào formDataToSend
        formData.placeAvatar.forEach(file => {
            if (file instanceof File) {
                formDataToSend.append('placeAvatar', file);
            }
        });
    
        // Thêm các trường dữ liệu khác từ formData vào formDataToSend
        Object.keys(formData).forEach((key) => {
            if (key !== 'placeAvatar') {
                formDataToSend.append(key, formData[key]);
            }
        });
    
        // Log formDataToSend để kiểm tra trước khi gửi
        console.log('Submitting form data:', formDataToSend);

        // Log data for debugging
        for (let [key, value] of formDataToSend.entries()) {
            console.log(`${key}: ${value}`);
        }

        // API call to update the place
        try {
            const response = await fetchUpdatePlaceById(editData.id, formDataToSend);
            console.log('Place ID:' + editData.id);
            console.log('Update successful:', response.data);
            openSnackbar('Update successful!', 'success');
            onClose();
        } catch (error) {
            console.error('Failed to update place:', error);
            console.log('Place ID:' + editData.id);
            openSnackbar('Failed to update place. Please try again.', 'error');
            console.log('Form Data:', Array.from(formDataToSend.entries()));
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
                        <SingleSelect label="Category" name="category" options={categories} onChange={(name, value) => handleSelectionChange(name, value)} selectedOption={selectedCategoryId} setFormData={setFormData} />
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
                        />
                        <LocationRegionSelect label="Ward"
                            options={wards}
                            onSelectionChange={(name, value) => handleSelectionChange(name, value)}
                            name="ward"
                            selectedOption={selectedWardId}
                        // disabled={!selectedDistrictId} // Disable nếu district chưa được chọn
                        />
                        <SubCard>
                            <UploadImage
                                initialImages={imageUrls}
                                onChange={handleFileChange}
                            />
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
