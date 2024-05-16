import { useState } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Box, InputAdornment, OutlinedInput } from '@mui/material';
import { IconSearch } from '@tabler/icons-react';
import { shouldForwardProp } from '@mui/system';

// Style adjustments for the OutlinedInput
const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
  width: 434,
  marginLeft: 16,
  marginTop: 16,
  paddingLeft: 16,
  paddingRight: 16,
  '& input': {
    background: 'transparent !important',
    paddingLeft: '4px !important'
  },
  [theme.breakpoints.down('lg')]: {
    width: 250
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: 4,
    background: '#fff'
  }
}));

// The component now accepts an `onSearch` callback to handle the search input
const SearchSection = ({ onSearch }) => {
  const theme = useTheme();
  const [value, setValue] = useState('');

  // Handle the change in input and propagate upwards
  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);  // Propagate the change up to the parent component
  };

  return (
    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
      <OutlineInputStyle
        id="input-search-header"
        value={value}
        onChange={handleChange}
        placeholder="Search"
        startAdornment={
          <InputAdornment position="start">
            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
          </InputAdornment>
        }
        aria-describedby="search-helper-text"
        inputProps={{ 'aria-label': 'weight' }}
      />
    </Box>
  );
};

export default SearchSection;
