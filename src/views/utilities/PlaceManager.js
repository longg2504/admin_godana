import React, { useEffect, useState } from 'react';
// material-ui
import {
  Box,
  Divider, FormControl, Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  TextField,
  Button,
  Select,
  Avatar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';
import SearchSection from 'layout/MainLayout/Header/SearchSection';
import { fetchPlaces, fetchPlaceById } from 'constant/constURL/URLPlace';
import { fetchCategory, createCategory } from 'constant/constURL/URLCategory';
import FormPlaceDialog from 'ui-component/place/FormPlaceDialog';


function SingleSelect({ label, options, onChange, setCategories }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    if (event.target.value !== "add_new") {
      setIsAddingNew(false);
      onChange(event.target.value);
    } else {
      setIsAddingNew(true);
    }
  };

  const handleCreateCategory = async () => {
    if (newCategoryTitle.trim() === '') return;

    try {
      const response = await createCategory({ title: newCategoryTitle });
      setIsAddingNew(false);
      setNewCategoryTitle('');
      // Cập nhật danh sách categories ở cấp độ ứng dụng
      setCategories(prevCategories => [...prevCategories, response.data]);
      // Tự động chọn category mới được tạo
      onChange(response.data.id);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <div>
      <FormControl fullWidth margin="normal">
        <InputLabel id={`${label}-label`}>{label}</InputLabel>
        <Select
          labelId={`${label}-label`}
          id={`${label}`}
          value={selectedOption}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.title}
            </MenuItem>
          ))}
          <MenuItem value="add_new">Add New Category</MenuItem>
        </Select>
      </FormControl>
      {isAddingNew && (
        <div style={{ marginTop: '10px' }}>
          <TextField
            fullWidth
            label="New Category Title"
            margin="normal"
            value={newCategoryTitle}
            onChange={(e) => setNewCategoryTitle(e.target.value)}
            variant="outlined"
          />
          <Button variant="contained" onClick={handleCreateCategory}>Create Category</Button>
        </div>
      )}
    </div>
  );
}


// ===============================|| DATAGRID ||=============================== //


function ImageField({ value }) {
  return (
    <Avatar src={value} alt="text" sx={{ display: 'flex', alignItems: 'center' }} style={{ width: 50, height: 50, marginRight: 5 }} />
  )
}

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'image',
    headerName: 'Image',
    renderCell: ImageField,
    width: 100,
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
    width: 300,
    editable: false,
  },
  {
    field: 'longitude',
    headerName: 'Longitude',
    width: 100,
    editable: false,
  },
  {
    field: 'latitude',
    headerName: 'Latitude',
    width: 100,
    editable: false,
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 150,
    editable: false,
    type: 'select',
  },
  {
    field: 'email',
    headerName: 'Email',
    sortable: false,
    width: 150,
  },
  {
    field: 'phone',
    headerName: 'Phone',
    sortable: false,
    width: 150,
  },
  {
    field: 'website',
    headerName: 'Webite',
    sortable: false,
    width: 150,
  },
  {
    field: 'opentime',
    headerName: 'Open Time',
    sortable: false,
    width: 150,
  },
  {
    field: 'closetime',
    headerName: 'Close Time',
    sortable: false,
    width: 150,
  },
];


export function DataGridDemo({ onRowClick }) {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const { data } = await fetchPlaces();
        setPlaces(data.content);
      } catch (error) {
        console.error("Failed to fetch places:", error);
      }
    };

    getPlaces();
  }, []);

  const getAddress = (locationRegion) => {
    const parts = [locationRegion?.address, locationRegion?.districtName, locationRegion?.wardName];
    return parts.filter(Boolean).join(', '); // Only join non-falsy values
  };

  // Map places to rows here
  const rows = places.map((place) => ({
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

  }));

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowClick={onRowClick}
      />
    </Box>
  );
}

// ===============================|| UI PLACE MANAGER ||=============================== //
const PlaceManager = () => {

  const [editData, setEditData] = useState(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);

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



  // ===============================|| DATAGRID ||=============================== //

  const handleRowClick = async (params) => {
    try {
      const response = await fetchPlaceById(params.row.id);
      console.log(params.row.id);

      // Check if response.data and response.data.placeAvatar are defined and have the right structure
      // if (!response.data || !Array.isArray(response.data.placeAvatar[0].fileUrl) || response.data.placeAvatar.length === 0) {
      //   throw new Error('placeAvatar is not an array or is empty');
      // }

      setEditData({
        // ...response.data,
        placeTitle: response.data.placeTitle,
        content: response.data.content,
        longitude: response.data.longitude,
        latitude: response.data.latitude,
        placeAvatar: response.data.place.placeAvatar[0].fileUrl,
        website: response.data.contact.website,
        email: response.data.contact.email,
        phone: response.data.contact.phone,
        address: response.data.locationRegion.address,
        categoryId: response.data.category.id,  // Lưu ID thay vì title để dễ xử lý
        categoryName: response.data.category.title,
        openTime: response.data.contact.openTime,
        closeTime: response.data.contact.closeTime,
        districtId: response.data.locationRegion.districtId,
        districtName: response.data.locationRegion.districtName,
        wardId: response.data.locationRegion.wardId,
        wardName: response.data.locationRegion.wardName,
      });

      console.log('placeTitle:', response.data.placeTitle);
      console.log('content:', response.data.content);
      console.log('longitude:', response.data.longitude);
      console.log('latitude:', response.data.latitude);
      console.log('placeAvatar:', response.data.place.placeAvatar[0].fileUrl);
      console.log('website:', response.data.contact.website);
      console.log('email:', response.data.contact.email);
      console.log('phone:', response.data.contact.phone);
      console.log('address:', response.data.locationRegion.address);
      console.log('categoryId:', response.data.category.id);
      console.log('categoryName:', response.data.category.title);
      console.log('openTime:', response.data.contact.openTime);
      console.log('closeTime:', response.data.contact.closeTime);
      console.log('districtId:', response.data.locationRegion.districtId);
      console.log('districtName:', response.data.locationRegion.districtName);
      console.log('wardId:', response.data.locationRegion.wardId);
      console.log('wardId:', response.data.locationRegion.wardName);

      setIsFormDialogOpen(true);
    } catch (error) {
      console.log(params.row.id);
      console.error('Failed to fetch place details:', error);
    }
  };

  const handleFormDialogClose = () => {
    setIsFormDialogOpen(!isFormDialogOpen);
    console.log("Form status: " + isFormDialogOpen);
  };


  return (
    <MainCard title="PLACE MANAGEMENT">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <SubCard>
            <Grid item xs={12} md={6}>
              <SearchSection style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} md={2}>
              <SingleSelect
                label="Category"
                options={categories.map(cat => ({ id: cat.id, title: cat.name }))}
                onChange={(selectedId) => setFormData({ ...formData, category: selectedId })}
                setCategories={setCategories}
              />
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
      <Divider component="" />
      <SubCard>
        <DataGridDemo onRowClick={handleRowClick} />

        <FormPlaceDialog editData={editData} open={isFormDialogOpen} onClose={handleFormDialogClose} />

      </SubCard>
    </MainCard>
  );
};

export default PlaceManager;
