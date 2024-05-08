import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Card, InputAdornment, OutlinedInput, Popper } from '@mui/material';
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';
import Transitions from 'ui-component/extended/Transitions';
import { IconSearch, IconX } from '@tabler/icons-react';

// styles
const PopperStyle = styled(Popper)(({ theme }) => ({
  zIndex: 1100,
  width: '99%',
  top: '-60px !important',
  padding: '0 18px',
  [theme.breakpoints.down('sm')]: {
    padding: '0 10px'
  }
}));

const OutlineInputStyle = styled(OutlinedInput)(() => ({
  width: '100%',
  paddingLeft: 16,
  paddingRight: 16,
  '& input': {
    background: 'transparent !important',
    paddingLeft: '4px !important'
  }
}));

const HeaderAvatarStyle = styled(Avatar)(({ theme }) => ({
  ...theme.typography.commonAvatar,
  ...theme.typography.mediumAvatar,
  background: theme.palette.secondary.light,
  color: theme.palette.secondary.dark,
  '&:hover': {
    background: theme.palette.secondary.dark,
    color: theme.palette.secondary.light
  }
}));

const SearchSection = ({ onSearch, placeholder = "Search" }) => {
  const theme = useTheme();
  const [value, setValue] = useState('');

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <>
              <ButtonBase sx={{ borderRadius: '12px' }}>
                <HeaderAvatarStyle variant="rounded" {...bindToggle(popupState)}>
                  <IconSearch stroke={1.5} size="1.2rem" />
                </HeaderAvatarStyle>
              </ButtonBase>
              <PopperStyle {...bindPopper(popupState)} transition>
                {({ TransitionProps }) => (
                  <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                    <Card sx={{ background: '#fff', boxShadow: 'none', border: 0 }}>
                      <Box sx={{ p: 2 }}>
                        <OutlineInputStyle
                          id="input-search-header-mobile"
                          value={value}
                          onChange={handleSearchChange}
                          placeholder={placeholder}
                          startAdornment={
                            <InputAdornment position="start">
                              <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                            </InputAdornment>
                          }
                          endAdornment={
                            <InputAdornment position="end">
                              <ButtonBase sx={{ borderRadius: '12px' }} onClick={() => setValue('')}>
                                <Avatar
                                  variant="rounded"
                                  sx={{
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.mediumAvatar,
                                    background: theme.palette.orange.light,
                                    color: theme.palette.orange.dark,
                                    '&:hover': {
                                      background: theme.palette.orange.dark,
                                      color: theme.palette.orange.light
                                    }
                                  }}
                                >
                                  <IconX stroke={1.5} size="1.3rem" />
                                </Avatar>
                              </ButtonBase>
                            </InputAdornment>
                          }
                          onKeyPress={handleKeyPress}
                          aria-label="search"
                        />
                      </Box>
                    </Card>
                  </Transitions>
                )}
              </PopperStyle>
            </>
          )}
        </PopupState>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <OutlineInputStyle
          id="input-search-header"
          value={value}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          startAdornment={
            <InputAdornment position="start">
              <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
            </InputAdornment>
          }
          endAdornment={
            value && (
              <InputAdornment position="end">
                <ButtonBase onClick={() => setValue('')}>
                  <IconX stroke={1.5} size="1.3rem" />
                </ButtonBase>
              </InputAdornment>
            )
          }
          aria-label="search"
        />
      </Box>
    </>
  );
};

SearchSection.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default SearchSection;
