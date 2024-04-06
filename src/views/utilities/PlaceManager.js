import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';

// material-ui
import {
  Box,
  Divider, FormControl, Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Avatar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';
import SearchSection from 'layout/MainLayout/Header/SearchSection';
import FormDialog from 'ui-component/FormDialog';
import { fetchPlaces } from 'constant/constURL/URLPlace';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
];

export function MultipleSelect({ label }) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  

  return (
    <div>
      <FormControl sx={{ m: 1, width: 150 }}>
        <InputLabel id={`${label}-multiple-name-label`}>{label}</InputLabel>
        <Select
          labelId={`${label}-multiple-name-label`}
          id={`${label}-multiple-name`}
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

// ===============================|| DATAGRID ||=============================== //


function ImageField({ value }) {
  return (
    <Avatar src={value} alt="text" sx={{ display: 'flex', alignItems: 'center' }} style={{ width: 50, height: 50, marginRight: 5 }}/>
  )
}

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'image',
    headerName: 'Image',
    renderCell: ImageField,
    width: 100,
    editable: true,
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 100,
    editable: true,
  },
  {
    field: 'address',
    headerName: 'Address',
    width: 300,
    editable: true,
  },
  {
    field: 'longitude',
    headerName: 'Longitude',
    width: 100,
    editable: true,
  },
  {
    field: 'latitude',
    headerName: 'Latitude',
    width: 100,
    editable: true,
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 150,
    editable: true,
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
    image:place.placeAvatar[0].fileUrl,
    title: place.placeTitle,
    address: getAddress(place.locationRegion),
    longitude: place.longitude,
    latitude: place.latitude,
    category: place.category.title, 
    email: place.contact.email,
    phone:place.contact.phone,
    website:place.contact.website,
    opentime:place.contact.openTime,
    closetime:place.contact.closeTime,

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

  // ===============================|| FORM DIALOG ||=============================== //

  // const [openFormDialog, setOpenFormDialog] = useState(false);
  // const [editData, setEditData] = useState(null);

  // const handleOpenFormDialog = (data = null) => {
  //   setEditData(data);
  //   setOpenFormDialog(true);
  // };
  // const handleSaveFormData = (formData) => {
  //   console.log(formData);
  //   setOpenFormDialog(false);
  // };

  const formFields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'category', label: 'Category', type: 'select', options: ['Category 1', 'Category 2', 'Category 3'] },
    // { name: 'rate', label: 'Rate', type: 'number' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'contact', label: 'Contact', type: 'tel' },
  ];

  return (
    <MainCard title="PLACE MANAGEMENT">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={10}>
          <SubCard>
            <Stack>
              {/* Make SearchSection full width */}
              <Grid container spacing={1} mt={0.5}>
                <SearchSection style={{ width: '100%' }} />
              </Grid>
              {/* Place MultipleSelects next to each other */}
              <Grid container spacing={1} xs={7} columns={{}} >
                <Grid item xs={3}>
                  <MultipleSelect label="Title" />
                </Grid>
                <Grid item xs={3}>
                  <MultipleSelect label="Address" />
                </Grid>
                <Grid item xs={3}>
                  <MultipleSelect label="Category" />
                </Grid>
                <Grid item xs={3}>
                  <MultipleSelect label="Rate" />
                </Grid>
              </Grid>
            </Stack>
          </SubCard>
        </Grid>
        {/* <Grid item xs={2} sm={2} md={2}>
          <SubCard>
            <Stack direction="column" spacing={1}>
              <Button variant="contained" onClick={() => handleOpenFormDialog()}>Add</Button>
              <Button variant="contained">Button ssss</Button>
              <Button variant="contained">Button</Button>
            </Stack>
          </SubCard>
        </Grid> */}
      </Grid>
      <Divider component="li" />
      <SubCard>
        <DataGridDemo />
      </SubCard>
      <FormDialog
        // open={openFormDialog}
        // onClose={() => setOpenFormDialog(false)}
        // onSave={handleSaveFormData}
        // editData={editData}
        fields={formFields}
      />
    </MainCard>
  );
};

export default PlaceManager;
