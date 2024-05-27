import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    TextField, Button, DialogActions,
    Grid, FormControl, InputLabel, Select,
    OutlinedInput, FormHelperText, MenuItem,
    Snackbar, Alert, CircularProgress, Backdrop, Stack, Divider
}
    from '@mui/material';
    import { useNavigate } from 'react-router-dom';
import SubCard from 'ui-component/cards/SubCard';
import FormDialog from 'ui-component/FormDialog'
import { fetchUpdatePlaceById } from 'constant/constURL/URLPlace';
import { fetchCategory, createCategory } from 'constant/constURL/URLCategory';
import { fetchDistrict, fetchWard } from 'constant/constURL/URLLocationRegion';
import UploadImage from 'views/utilities/Place/ui-component/UploadImage';

import ProvinceSelect from '../ui-component/ProvinceSelect';
import LocationRegionSelect from '../ui-component/LocationRegionSelect';
import TimeSelect from '../ui-component/TimeSelect';


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
const FormPlaceDialog = ({ open, editData, onClose,refreshPlaces }) => {
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedDistrictId, setSelectedDistrictId] = useState('');
    const [selectedWardId, setSelectedWardId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();
    const storedUserId = localStorage.getItem('id');
    console.log("UserID: "+ storedUserId);
    // ==============================|| VALIDATION FIELD ||============================== //

    const validateField = (name, value) => {
        // Cập nhật regex để cho phép các ký tự tiếng Việt
        const specialCharRegex = /[^a-zA-Z0-9\s\u00C0-\u00FF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF]/;
    
        switch (name) {
          case 'placeTitle':
            if (!value.trim()) return "Place Title is required";
            if (specialCharRegex.test(value)) return "Place Title contains special characters";
            break;
          case 'content':
            if (!value.trim()) return "Content is required";
            if (specialCharRegex.test(value)) return "Content contains special characters";
            break;
          case 'latitude':
            if (!value.trim()) return "Latitude is required";
            else if (!/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(value)) return "Invalid latitude format";
            break;
          case 'longitude':
            if (!value.trim()) return "Longitude is required";
            else if (!/^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(value)) return "Invalid longitude format";
            break;
          case 'address':
            if (!value.trim()) return "Address is required";
            if (specialCharRegex.test(value)) return "Address contains special characters";
            break;
          case 'email':
            if (!value.trim()) return "Email is required";
            else if (!/\S+@\S+\.\S+/.test(value)) return "Email is not valid";
            break;
          case 'phone':
            if (!value.trim()) return "Phone is required";
            else if (!/^\d{1,11}$/.test(value)) return "Phone must be up to 11 digits";
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

    useEffect(() => {
        if (selectedDistrictId) {
            fetchWard(selectedDistrictId).then(response => {
                const wardsData = response.data.results.map(ward => ({
                    id: ward.ward_id,
                    title: ward.ward_name
                }));
                setWards(wardsData);
                if (!wardsData.some(ward => ward.id === selectedWardId)) {
                    // Nếu ward hiện tại không còn trong danh sách mới, cập nhật lại state
                    setSelectedWardId('');
                }
            }).catch(error => {
                console.error("Failed to fetch wards:", error);
                setWards([]); // Nên reset danh sách wards nếu có lỗi
            });
        } else {
            setWards([]);
        }
    }, [selectedDistrictId, selectedWardId]);


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
        id: '',
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
        userId: storedUserId || 1,
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
        setIsLoading(true);
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
            refreshPlaces();
        } catch (error) {
            console.error('Failed to update place:', error);
            console.log('Place ID:' + editData.id);
            openSnackbar('Failed to update place. Please try again.', 'error');
            console.log('Form Data:', Array.from(formDataToSend.entries()));
        } finally {
            setIsLoading(false);  // Dừng hiển thị trạng thái loading
            navigate("/place/place-list");
            
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle variant='h4'>Infomation Place</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>

                    {/* ----- Layout 1 -----*/}
                    <Grid item xs={12} md={6}>
                        <Divider textAlign="left" spacing={2}>Image</Divider>
                        <Stack spacing={1}>
                            <SubCard>
                                <UploadImage
                                    initialImages={imageUrls}
                                    onChange={handleFileChange}
                                />
                            </SubCard>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Divider textAlign="left">Infomation</Divider>
                        <TextField label="Place Title" name="placeTitle" fullWidth onChange={handleChange} value={formData.placeTitle} margin="normal" error={!!formErrors.placeTitle}/>
                        <TextField label="Content" name="content" fullWidth rows={6} onChange={handleChange} value={formData.content} margin="normal" multiline error={!!formErrors.content}/>
                    </Grid>
                </Grid>

                {/* ----- Layout 2 -----*/}
                <Divider textAlign="left">Contact</Divider>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField label="Phone" name="phone" fullWidth onChange={handleChange} value={formData.phone} margin="normal" error={!!formErrors.phone}/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField label="Email" name="email" fullWidth onChange={handleChange} value={formData.email} margin="normal" error={!!formErrors.email}/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField label="Website" name="website" fullWidth onChange={handleChange} value={formData.website} margin="normal" error={!!formErrors.website}/>
                    </Grid>
                </Grid>

                {/* ----- Layout 3 -----*/}
                <Divider textAlign="left">Category Place</Divider>
                <Grid container spacing={2} >
                    <Grid item xs={12} md={6}>
                        <SingleSelect label="Category" name="category" options={categories} onChange={(name, value) => handleSelectionChange(name, value)} selectedOption={selectedCategoryId} setFormData={setFormData} />
                    </Grid>
                </Grid>

                {/* ----- Layout 4 -----*/}
                <Divider textAlign="left">Location Region</Divider>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <TextField label="Longitude" name="longitude" fullWidth onChange={handleChange} value={formData.longitude} margin="normal" error={!!formErrors.longitude}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Latitude" name="latitude" fullWidth onChange={handleChange} value={formData.latitude} margin="normal" error={!!formErrors.latitude}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Address" name="address" fullWidth onChange={handleChange} value={formData.address} margin="normal" error={!!formErrors.address}/>
                    </Grid>
                    <Grid item xs={4}>
                        <ProvinceSelect />
                    </Grid>
                    <Grid item xs={4}>
                        <LocationRegionSelect
                            label="District"
                            options={districts}
                            onSelectionChange={(name, value) => handleSelectionChange(name, value)}
                            disabled={false}
                            name="districtId"
                            selectedOption={selectedDistrictId}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <LocationRegionSelect label="Ward"
                            options={wards}
                            onSelectionChange={(name, value) => handleSelectionChange(name, value)}
                            name="wardId"
                            selectedOption={selectedWardId}
                            disabled={!selectedDistrictId} // Disable nếu district chưa được chọn
                        />
                    </Grid>
                </Grid>

                {/* ----- Layout 5 -----*/}
                <Divider textAlign="left">Time Open/Close</Divider>
                <Grid item xs={12}>
                    <TimeSelect label="Set Time" onTimeChange={handleTimeChange}
                        initialOpenTime={formData.openTime}
                        initialCloseTime={formData.closeTime} />
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
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Dialog>
    );
};

export default FormPlaceDialog;