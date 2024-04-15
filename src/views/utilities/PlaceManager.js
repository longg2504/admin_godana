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
import { fetchPlaces } from 'constant/constURL/URLPlace';
import { fetchCategory, createCategory } from 'constant/constURL/URLCategory';


function SingleSelect({ label, options, onChange }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');

  const handleChange = (event) => {
    const { value } = event.target;

    if (value === "add_new") {
      setIsAddingNew(true);
      setSelectedOption('');
    } else {
      setIsAddingNew(false);
      setSelectedOption(value);
      if (onChange) {
        onChange(value);
      }
    }
  };

  const handleCreateCategory = async () => {
    if (newCategoryTitle.trim() === '') return;
    
    try {
      const response = await createCategory({ title: newCategoryTitle });
      console.log('Category created:', response.data);
      setIsAddingNew(false); // Hide form after successful addition
      setNewCategoryTitle(''); // Reset input field
      // Add the new category to the options state here
      setCategories([...categories, response.data]);
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
            <MenuItem
              key={option.id}
              value={option.id}
            >
              {option.title}
            </MenuItem>
          ))}
          {/* <MenuItem value="add_new">Add New Category</MenuItem> */}
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


export function DataGridDemo() {
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
      />
    </Box>
  );
}

// ===============================|| UI PLACE MANAGER ||=============================== //
const PlaceManager = () => {
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

  return (
    <MainCard title="PLACE MANAGEMENT">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <SubCard>
            <Grid item xs={12} md={6}>
              <SearchSection style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} md={2}>
              <SingleSelect label="Category" options={categories} />
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
      <Divider component="" />
      <SubCard>
        <DataGridDemo />
      </SubCard>
    </MainCard>
  );
};

export default PlaceManager;
