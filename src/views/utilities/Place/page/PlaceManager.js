import React, { useEffect, useState } from 'react';
// material-ui
import {
  Divider, FormControl, Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Alert,
  Select,
  Snackbar,
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';
import SearchSection from 'layout/MainLayout/Header/SearchSection';
import { getAllPlace, getPlaceListByCategoryAndSearch, fetchPlaceById, deletePlace } from 'constant/constURL/URLPlace';
import { fetchCategory, createCategory } from 'constant/constURL/URLCategory';
import FormPlaceDialog from 'views/utilities/Place/page/FormPlaceDialog';
import DataGridPlace from '../ui-component/DataGridPlace';
import FormDialog from 'ui-component/FormDialog';

function SingleSelect({ label, options, onChange, name, onSave, open }) {
  const [selectedOption, setSelectedOption] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    if (value === 'add_new') {
      setIsDialogOpen(true);
    } else if (value === 'none') {
      setSelectedOption('');
      onChange(name, '');
    } else {
      onChange(name, value);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <FormControl fullWidth margin="normal" >
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-label`}
        id={`${label}`}
        value={selectedOption}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
      >
        <MenuItem value="none">None (Clear Selection)</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>{option.title}</MenuItem>
        ))}
        <MenuItem value="add_new">Add New {label}</MenuItem>
      </Select>
      <FormDialog
        open={open || isDialogOpen}
        onClose={handleDialogClose}
        onSave={onSave}
        fields={[{ name: 'title', label: 'Category Title', type: 'text' }]}
      />
    </FormControl>
  );
}


// ===============================|| UI PLACE MANAGER ||=============================== //
const PlaceManager = () => {

  const [editData, setEditData] = useState(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  // const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // Could be 'error', 'info', 'success', 'warning'

  // ==============================|| Place API ||============================== //
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        let res;
        if (selectedCategoryId || searchTerm) {
          res = await getPlaceListByCategoryAndSearch(selectedCategoryId, searchTerm);
        } else {
          res = await getAllPlace();
        }
        setPlaces(res.data.content);
      } catch (error) {
        console.error("Failed to fetch places:", error);
      }
    };

    fetchPlaces();
  }, [selectedCategoryId, searchTerm]);

  const refreshPlaces = async () => {
    try {
      let res;
      if (selectedCategoryId || searchTerm) {
        res = await getPlaceListByCategoryAndSearch(selectedCategoryId, searchTerm);
      } else {
        res = await getAllPlace();
      }
      setPlaces(res.data.content);
    } catch (error) {
      console.error("Failed to fetch places:", error);
    }
  };

  useEffect(() => {
    refreshPlaces();
  }, []);



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

  // Delete post handler
  const handleDelete = async (placeId) => {
    try {
      await deletePlace(placeId);
      setSnackbarMessage('Place successfully deleted!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Failed to delete Place:', error);
      setSnackbarMessage('Failed to delete post. Please try again.');
      setSnackbarSeverity('error');
    }
    finally {
      refreshPlaces();
    }
    setSnackbarOpen(true); // Show the Snackbar after attempting to delete
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  // ===============================|| FORM DATA TO SEND INTO FORMPLACEDIALOG ||=============================== //

  const handleRowClick = async (params) => {
    try {
      const response = await fetchPlaceById(params.row.id);
      setEditData({
        id: response.data.id,
        placeTitle: response.data.placeTitle,
        content: response.data.content,
        longitude: response.data.longitude,
        latitude: response.data.latitude,
        phone: response.data.contact.phone,
        email: response.data.contact.email,
        website: response.data.contact.website,
        categoryId: response.data.category.id,  // Lưu ID thay vì title để dễ xử lý
        categoryName: response.data.category.title,
        districtId: response.data.locationRegion.districtId,
        districtName: response.data.locationRegion.districtName,
        address: response.data.locationRegion.address,
        wardId: response.data.locationRegion.wardId,
        wardName: response.data.locationRegion.wardName,
        openTime: response.data.contact.openTime,
        closeTime: response.data.contact.closeTime,
        placeAvatar: response.data.placeAvatar
      });
      setIsFormDialogOpen(true);
    } catch (error) {
      console.error('Failed to fetch place details:', error);
    }
  };

  const handleFormDialogClose = () => {
    setIsFormDialogOpen(!isFormDialogOpen);
    console.log("Form status: " + isFormDialogOpen);
  };

  const handleSearch = (value) => {
    console.log(value);
    setSearchTerm(value);
  };

  const handleCategoryChange = (name, value) => {
    console.log(value);
    setSelectedCategoryId(value);
  };



  return (
    <MainCard title="PLACE MANAGEMENT">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <SubCard>
            <Grid container spacing={2}>
              <Grid item xs={5}><SearchSection onSearch={handleSearch} /></Grid>
              <Grid item xs={3}>
                <SingleSelect label="Category"
                  open={isDialogOpen}
                  options={categories}
                  onChange={handleCategoryChange}
                  name="categoryId"
                  onSave={handleSaveNewCategory} />
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
        <Grid item xs={12} spacing={1}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <SubCard>
            <DataGridPlace onRowClick={handleRowClick} options={places} handleDelete={handleDelete} />
            <FormPlaceDialog editData={editData} open={isFormDialogOpen} onClose={handleFormDialogClose} refreshPlaces={refreshPlaces} />
          </SubCard>
        </Grid>
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default PlaceManager;
