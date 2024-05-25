import React, { useEffect, useState } from 'react';

import { Alert, Divider, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, Snackbar } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';
import DataGridPost from '../ui-component/DataGridPost';
import { getAllPost, getAllPostsByCategory, deletePost } from 'constant/constURL/URLPost';
import { fetchCategory, createCategory } from 'constant/constURL/URLCategory';
import FormDialog from 'ui-component/FormDialog';

function SingleSelect({ label, options, onChange, name, onSave, open }) {
  const [selectedOption, setSelectedOption] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    if (value === 'add_new') {
      // Open the dialog
      setIsDialogOpen(true);
    } else if (value === 'none') {
      setSelectedOption(''); // Reset the local state
      onChange(name, '');
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


// ==============================|| CONTACT ||============================== //

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // Could be 'error', 'info', 'success', 'warning'

  // ==============================|| API ||============================== //
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let res;
        if (selectedCategoryId) {
          res = await getAllPostsByCategory(selectedCategoryId);
        } else {
          res = await getAllPost();
        }
        setPosts(res.data.content);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setRefreshTrigger(!refreshTrigger);
      }
    };
    fetchPosts();
  }, [selectedCategoryId]);

  const refreshPosts = async () => {
    try {
      let res;
      if (selectedCategoryId) {
        res = await getAllPostsByCategory(selectedCategoryId);
      } else {
        res = await getAllPost();
      }
      setPosts(res.data.content);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } 
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  // Delete post handler
  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setSnackbarMessage('Post successfully deleted!');
      setSnackbarSeverity('success');
      refreshPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
      setSnackbarMessage('Failed to delete post. Please try again.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true); // Show the Snackbar after attempting to delete
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


  const handleSaveNewCategory = async (newCategoryData) => {
    try {
      const response = await createCategory(newCategoryData);
      console.log('New category created:', response.data);
      setIsDialogOpen(false);
      setSnackbarMessage('Category successfully created!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error creating category:', error);
      setSnackbarMessage('Failed to create category. Please try again.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleCategoryChange = (name, value) => {
    console.log(value);
    setSelectedCategoryId(value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <MainCard title="POST LIST">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <SubCard>
            <Grid container spacing={2}>
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
            <DataGridPost options={posts} handleDelete={handleDelete} />
          </SubCard>
        </Grid>
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  )

};

export default PostList;
