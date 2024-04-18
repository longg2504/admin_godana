import React, {
  useEffect,
  useState
} from 'react';


import {
  Grid, TextField, Button, ImageList, ImageListItem,
  InputLabel, MenuItem, Select, FormControl, IconButton, ImageListItemBar,
  OutlinedInput, Snackbar, Alert, Box, FormHelperText, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// import VisibilityIcon from '@mui/icons-material/Visibility';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { fetchCategory, createCategory } from 'constant/constURL/URLCategory';
import { createPlace } from 'constant/constURL/URLPlace';
import { fetchDistrict, fetchWard } from 'constant/constURL/URLLocationRegion';
import SubCard from 'ui-component/cards/SubCard';
import FormDialog from 'ui-component/FormDialog'

// ==============================|| SINGLE SELECT ||============================== //
function SingleSelect({ label, options, onChange, name, error, onSave, open }) {
  const [selectedOption, setSelectedOption] = useState('');

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

// ==============================|| UPLOAD IMAGE ||============================== //
const UploadImage = ({ onChange }) => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

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

  const handleOpenImage = (url) => {
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
    </Box>
  );
};


// ==============================|| TIME SELECT ||============================== //



const createTimeOptions = (start, end, step) => {
  const options = [];
  for (let i = start; i <= end; i += step) {
    options.push(<MenuItem key={i} value={i < 10 ? `0${i}` : `${i}`}>{i < 10 ? `0${i}` : i}</MenuItem>);
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
    // Check if the initial times are for all day
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

  const handleTimeSettingChange = (event) => {
    const setting = event.target.value;
    setTimeSetting(setting);

    if (setting === 'all_day') {
      setOpenHour('00');
      setOpenMinute('00');
      setCloseHour('23');
      setCloseMinute('59');
      onTimeChange('openTime', '00:00');
      onTimeChange('closeTime', '23:59');
    } else {
      setOpenHour('');
      setOpenMinute('');
      setCloseHour('');
      setCloseMinute('');
      onTimeChange('openTime', '');
      onTimeChange('closeTime', '');
    }
  };

  const handleOpenHourChange = (event) => {
    const newHour = event.target.value;
    setOpenHour(newHour);
    onTimeChange('openTime', `${newHour}:${openMinute}`);
  };

  const handleOpenMinuteChange = (event) => {
    const newMinute = event.target.value;
    setOpenMinute(newMinute);
    onTimeChange('openTime', `${openHour}:${newMinute}`);
  };

  const handleCloseHourChange = (event) => {
    const newHour = event.target.value;
    setCloseHour(newHour);
    onTimeChange('closeTime', `${newHour}:${closeMinute}`);
  };

  const handleCloseMinuteChange = (event) => {
    const newMinute = event.target.value;
    setCloseMinute(newMinute);
    onTimeChange('closeTime', `${closeHour}:${newMinute}`);
  };

  // const closingHoursOptions = openHour ? createTimeOptions(parseInt(openHour), 23, 1) : createTimeOptions(0, 23, 1);

  // // For closing minutes, only filter them if the closing hour is the same as the opening hour
  // const closingMinutesOptions = createTimeOptions(0, 59, 5).filter(minute => {
  //     const minuteValue = parseInt(minute.props.value);
  //     return openHour !== closeHour || minuteValue > parseInt(openMinute);
  // });

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
                {createTimeOptions(0, 59, 1)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Giờ đóng cửa</InputLabel>
              <Select value={closeHour} onChange={handleCloseHourChange}>
                {createTimeOptions(parseInt(openHour), 23, 1)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Phút đóng cửa</InputLabel>
              <Select value={closeMinute} onChange={handleCloseMinuteChange}>
                {createTimeOptions(0, 59, 1)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}
    </FormControl>
  );
};


// ==============================|| CREATE PLACE ||============================== //

const PlaceCreate = () => {
  // ==============================|| FORM ERRORS ||============================== //

  const [formErrors, setFormErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'placeTitle':
        if (!value.trim()) return "Place Title is required";
        break;
      case 'content':
        if (!value.trim()) return "Content is required";
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
  const [categories, setCategories] = useState([]);
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
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');



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
    userId: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const errorMessage = validateField(name, value);
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: errorMessage }));
  };


  // const handleFileChange = (event) => {
  //   if (event.target.files.length) {
  //     const files = Array.from(event.target.files);
  //     setFormData(formData => ({
  //       ...formData,
  //       placeAvatar: [...formData.placeAvatar, ...files]
  //     }));
  //   }
  // };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData(formData => ({
      ...formData,
      placeAvatar: [...formData.placeAvatar, ...files]
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateField()) {
    //   console.error("Validation failed");
    //   return;
    // }

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

    for (let [key, value] of submitData.entries()) {
      console.log(`${key}: ${value}`);
    }


    try {
      const response = await createPlace(submitData);
      setSnackbarMessage('Place successfully created!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      console.log('Place created:', response.data);

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
        userId: 1,
      });
      // Đặt lại preview ảnh
      document.getElementById("raised-button-file").value = "";
    } catch (error) {
      setSnackbarMessage('Failed to create place.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      console.error('Failed to create place:', error);
      console.log('Data:', submitData);
    }


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
    // Optional: validate the new time values here
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
  return (

    <MainCard title="Create New Place">
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Place Title"
              margin="normal"
              name="placeTitle"
              onChange={handleChange}
              required
              value={formData.placeTitle}
              variant="outlined"
              error={!!formErrors.placeTitle} // Chuyển trạng thái lỗi sang boolean
              helperText={formErrors.placeTitle}
            />
            <TextField
              fullWidth
              label="Content"
              margin="normal"
              name="content"
              onChange={handleChange}
              required
              value={formData.content}
              variant="outlined"
              error={!!formErrors.content} // Chuyển trạng thái lỗi sang boolean
              helperText={formErrors.content}
            />
            <TextField
              fullWidth
              label="Longitude"
              margin="normal"
              name="longitude"
              onChange={handleChangeNumericInput}
              required
              value={formData.longitude}
              variant="outlined"
              error={!!formErrors.longitude} // Chuyển trạng thái lỗi sang boolean
              helperText={formErrors.longitude}
            />
            <TextField
              fullWidth
              label="Latitude"
              margin="normal"
              name="latitude"
              onChange={handleChangeNumericInput}
              required
              value={formData.latitude}
              variant="outlined"
              error={!!formErrors.latitude} // Chuyển trạng thái lỗi sang boolean
              helperText={formErrors.latitude}
            />
            <SingleSelect label="Category"
              open={isDialogOpen}
              options={categories}
              onChange={(name, value) => handleSelectionChange(name, value)}
              name="categoryId"
              error={formErrors.categoryId}
              onSave={handleSaveNewCategory} />
            <TextField
              fullWidth
              label="Website"
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

          <Grid item xs={12} md={4}>

            <TextField
              fullWidth
              label="Address"
              margin="normal"
              name="address"
              onChange={handleChange}
              required
              value={formData.address}
              variant="outlined"
              error={!!formErrors.address} // Chuyển trạng thái lỗi sang boolean
              helperText={formErrors.address}
            />
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              name="email"
              onChange={handleChange}
              required
              value={formData.email}
              variant="outlined"
              error={!!formErrors.email} // Chuyển trạng thái lỗi sang boolean
              helperText={formErrors.email}
            />
            <TextField
              fullWidth
              label="Phone"
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
            <LocationRegionSelect label="Ward" options={wards} onSelectionChange={(name, value) => handleSelectionChange(name, value)} name="wardId"
              disabled={!formData.districtId} // Disable nếu district chưa được chọn
              error={formErrors.wardId} />
            <SubCard>
              <UploadImage onChange={handleFileChange} />
            </SubCard>


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
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </MainCard>
  );
};

export default PlaceCreate;
