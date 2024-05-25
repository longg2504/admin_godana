import React, {
  useEffect,
  useState
} from 'react';

import {
  Grid, TextField, Button, ImageList, ImageListItem, Stack, Divider,
  InputLabel, MenuItem, Select, FormControl, IconButton, ImageListItemBar,
  OutlinedInput, Snackbar, Alert, Box, FormHelperText, Dialog, DialogTitle, DialogContent,
  Backdrop,
  CircularProgress, DialogActions, DialogContentText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
// import VisibilityIcon from '@mui/icons-material/Visibility';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { fetchCategory, createCategory } from 'constant/constURL/URLCategory';
import { createPlace } from 'constant/constURL/URLPlace';
import { fetchDistrict, fetchWard } from 'constant/constURL/URLLocationRegion';
import SubCard from 'ui-component/cards/SubCard';
import FormDialog from 'ui-component/FormDialog'
import ProvinceSelect from '../ui-component/ProvinceSelect';
import TimeSelect from '../ui-component/TimeSelect';

// ==============================|| SINGLE SELECT ||============================== //
function SingleSelect({ label, options, onChange, name, error, onSave, open, reset }) {
  const [selectedOption, setSelectedOption] = useState('');
  useEffect(() => {
    if (reset) {
      setSelectedOption(''); // Reset the selected option
    }
  }, [reset]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    if (value === 'add_new') {
      // Open the dialog
      setIsDialogOpen(true);
    } else {
      // Notify parent component about the change
      onChange(name, value);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    // Optionally reset the selected option or handle other cleanup
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
        onSave={onSave}
        fields={[{ name: 'title', label: 'Category Title', type: 'text' }]}
      />
    </FormControl>
  );
}




function LocationRegionSelect({ label, options, onSelectionChange, name, disabled = false, error, reset }) {

  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    if (reset) {
      setSelectedOption(''); // Reset the selected option
    }
  }, [reset]);

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

// ==============================|| UPLOAD IMAGE ||============================== //
const UploadImage = ({ onChange, reset }) => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (reset) {
      setImagePreviews([]); // Reset the previews
    }
  }, [reset]);

  const handleFileChange = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files).map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      setImagePreviews(prev => [...prev, ...filesArray]);
      onChange(event);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteImage = (index) => {
    const filteredImages = imagePreviews.filter((_, idx) => idx !== index);
    setImagePreviews(filteredImages);
  };

  const handleOpenImage = (url, event) => {
    event.stopPropagation(); // This will prevent the event from bubbling up to the form submit
    setSelectedImage(url);
    setOpen(true);
  };

  return (
    <Box>
      <input
        accept="image/*"
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="raised-button-file"
      />

      <ImageList cols={5} gap={8} sx={{ width: 'auto', height: 135 }}>
        {imagePreviews.map((item, index) => (
          <ImageListItem key={index}>
            <button
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
              }}
              onClick={(event) => handleOpenImage(item.url, event)} // Pass the event to the handler
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  handleOpenImage(item.url, event); // Also stop propagation here if needed
                }
              }}
            >
              <img
                src={item.url}
                alt={`preview ${index}`}
                loading="lazy"
                style={{ width: '100%', height: '100%' }}
              />
            </button>
            <ImageListItemBar
              position="top"
              actionIcon={
                <IconButton onClick={() => handleDeleteImage(index)} sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                  <CloseIcon />
                </IconButton>
              }
              actionPosition="right"
            />
          </ImageListItem>
        ))}
      </ImageList>
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span">
          Upload Images
        </Button>
      </label>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Preview"}</DialogTitle>
        <DialogContent>
          <img src={selectedImage} alt="Enlarged preview" style={{ width: '100%' }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const ConfirmationDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogContent>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <ErrorIcon color="error" style={{ fontSize: 60 }} />
        <DialogContentText style={{ marginTop: 16, textAlign: 'center', fontSize: '1.2rem'}}>
          Some information is incorrect. Are you sure you want to create it anyway?
        </DialogContentText>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} autoFocus>
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

// ==============================|| CREATE PLACE ||============================== //

const PlaceCreate = () => {
  const storedUserId = localStorage.getItem('id');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [resetSingleSelect, setResetSingleSelect] = useState(false);
  const [resetLocationSelect, setResetLocationSelect] = useState(false);
  const [resetUploadImage, setResetUploadImage] = useState(false);
  const [resetTimeSetting, setResetTimeSetting] = useState(false);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);



  // ==============================|| FORM ERRORS ||============================== //
  const validateField = (name, value) => {
    const specialCharRegex = /[^a-zA-Z0-9\s]/;

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
        else if (!/^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(value)) return "Invalid longitude format"; break;
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
        else if (!/^\d{1,11}$/.test(value)) return "Phone must be up to 10 digits";
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

  // ==============================|| LOCATION PLACE ||============================== //




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



  const [formData, setFormData] = useState({
    placeTitle: '',
    content: '',
    longitude: '',
    latitude: '',
    placeAvatar: [],
    categoryId: '',
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
    userId: storedUserId,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const errorMessage = validateField(name, value);
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: errorMessage }));
  };


  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData(formData => ({
      ...formData,
      placeAvatar: [...formData.placeAvatar, ...files]
    }));
    console.log(formData.placeAvatar, "Form Avatar:")
  };

  const handleResetDone = () => {
    setResetUploadImage(false);
  };

  //--------------------------------------SUMMIT---------------------------------------------------//
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any errors
    const hasErrors = Object.values(formErrors).some(error => error);
    if (hasErrors) {
      setShowConfirmDialog(true);
      return; // Stop submission until confirmed
    }

    submitForm();
  };

  const submitForm = async () => {
    setIsLoading(true);

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'placeAvatar') {
        formData[key].forEach(file => {
          submitData.append(key, file);
        });
      } else {
        submitData.append(key, formData[key]);
      }
    });

    console.log(submitData);
    try {
      await createPlace(submitData);
      setSnackbarMessage('Place successfully created!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      resetForm();
    } catch (error) {
      processError(error);
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  const resetForm = () => {
    setFormData({
      placeTitle: '',
      content: '',
      longitude: '',
      latitude: '',
      placeAvatar: [],
      categoryId: '',
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
      userId: storedUserId,
    });

    setResetSingleSelect(true);
    setResetLocationSelect(true);
    setResetUploadImage(true);
    setResetTimeSetting(true);

    setTimeout(() => {
      setResetSingleSelect(false);
      setResetLocationSelect(false);
      setResetUploadImage(false);
      setResetTimeSetting(false);
    }, 0);
  };

  const processError = (error) => {
    // Handle errors based on your application's needs
    if (error.response && error.response.status === 400) {
      setSnackbarMessage('Data is invalid. Please check the fields.');
    } else {
      setSnackbarMessage('An error occurred. Please try again later.');
    }
    setSnackbarSeverity('error');
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleChangeNumericInput = (e) => {
    const { name, value } = e.target;
    // Regex chỉ cho phép số, dấu âm và dấu phẩy
    if (/^[-\d.,]*$/.test(value)) {
      setFormData({ ...formData, [name]: value });
      // Xóa lỗi khi nhập hợp lệ
      const errorMessage = validateField(name, value);
      setFormErrors(prevErrors => ({ ...prevErrors, [name]: errorMessage }));
    }
  };

  const handleTimeChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveNewCategory = async (newCategoryData) => {
    try {
      const response = await createCategory(newCategoryData);
      console.log('New category created:', response.data);
      setIsDialogOpen(false);
      onChange(name, response.data.id);
      setSnackbarMessage('Category successfully created!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error creating category:', error);
      setSnackbarMessage('Failed to create category. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  //===================================================================LOCATION MAP DEATIL=====================================================================//


  return (
    <MainCard title="Create New Place">
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Divider textAlign="left" spacing={2}>Image</Divider>
            <Stack spacing={1}>
              <SubCard>
                <UploadImage onChange={handleFileChange} reset={resetUploadImage} onResetDone={handleResetDone} initialImages={[]} />
              </SubCard>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Divider textAlign="left">Infomation</Divider>
            <TextField label="Place Title" fullWidth margin="normal" name="placeTitle"
              onChange={handleChange}
              required
              value={formData.placeTitle}
              variant="outlined"
              error={!!formErrors.placeTitle} // Chuyển trạng thái lỗi sang boolean
              helperText={formErrors.placeTitle}
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={6}
              margin="normal"
              name="content"
              onChange={handleChange}
              required
              value={formData.content}
              variant="outlined"
              error={!!formErrors.content} // Chuyển trạng thái lỗi sang boolean
              helperText={formErrors.content}
            />
          </Grid>
        </Grid>

        <Divider textAlign="left">Contact</Divider>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Phone"
              fullWidth
              margin="normal"
              name="phone"
              onChange={handleChange}
              required
              value={formData.phone}
              variant="outlined"
              error={!!formErrors.phone} // Chuyển trạng thái lỗi sang boolean
              helperText={formErrors.phone}
              type="phone"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              onChange={handleChange}
              required
              value={formData.email}
              variant="outlined"
              error={!!formErrors.email} // Chuyển trạng thái lỗi sang boolean
              helperText={formErrors.email}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Website"
              fullWidth
              margin="normal"
              name="website"
              onChange={handleChange}
              required
              value={formData.website}
              variant="outlined"
              error={!!formErrors.website} // Chuyển trạng thái lỗi sang boolean
              helperText={formErrors.website}
            />
          </Grid>
        </Grid>

        <Divider textAlign="left">Category Place</Divider>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <SingleSelect label="Category"
              open={isDialogOpen}
              options={categories}
              onChange={(name, value) => handleSelectionChange(name, value)}
              name="categoryId"
              error={formErrors.categoryId}
              onSave={handleSaveNewCategory}
              reset={resetSingleSelect} />
          </Grid>

        </Grid>

        <Divider textAlign="left">Location Region</Divider>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <TextField
              label="Longitude"
              fullWidth
              margin="normal"
              name="longitude"
              onChange={handleChangeNumericInput}
              required
              value={formData.longitude}
              variant="outlined"
              error={!!formErrors.longitude} // Chuyển trạng thái lỗi sang boolean
              helperText={formErrors.longitude}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              label="Latitude"
              fullWidth
              margin="normal"
              name="latitude"
              onChange={handleChangeNumericInput}
              required
              value={formData.latitude}
              variant="outlined"
              error={!!formErrors.latitude} // Chuyển trạng thái lỗi sang boolean
              helperText={formErrors.latitude}
            />
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
              error={formErrors.districtId}
              reset={resetLocationSelect}
            />
          </Grid>
          <Grid item xs={4}>
            <LocationRegionSelect
              label="Ward"
              options={wards}
              onSelectionChange={(name, value) => handleSelectionChange(name, value)}
              name="wardId"
              disabled={!formData.districtId} // Disable nếu district chưa được chọn
              error={formErrors.wardId}
              reset={resetLocationSelect} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              fullWidth
              margin="normal"
              name="address"
              onChange={handleChange}
              required
              value={formData.address}
              variant="outlined"
              error={!!formErrors.address} // Chuyển trạng thái lỗi sang boolean
              helperText={formErrors.address}
            />
          </Grid>
        </Grid>

        <Divider textAlign="left">Time Open/Close</Divider>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TimeSelect label="Set Time" onTimeChange={handleTimeChange} reset={resetTimeSetting} />
          </Grid>
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button color="primary" variant="contained" type="submit">
            Create
          </Button>
        </Grid>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Điều chỉnh vị trí hiển thị ở đây
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ConfirmationDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          setShowConfirmDialog(false);
          submitForm(); // Proceed with submission even if there are errors
        }}
      />

    </MainCard>
  );
};

export default PlaceCreate;