import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
import navigation from 'menu-items';
import { drawerWidth } from 'store/constant';

// assets
import { IconChevronRight } from '@tabler/icons-react';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  transition: theme.transitions.create('margin', {
    easing: open ? theme.transitions.easing.easeOut : theme.transitions.easing.sharp,
    duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen
  }),
  marginLeft: open ? `calc(${drawerWidth}px)` : 0,
  width: `calc(100% - ${drawerWidth}px)`,
  [theme.breakpoints.down('md')]: {
    marginLeft: '20px',
    padding: '16px'
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    padding: '16px',
    marginRight: '10px'
  }
}));

const MainLayout = () => {
  const theme = useTheme();
  const [leftDrawerOpened, setLeftDrawerOpened] = useState(false);
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  const handleLeftDrawerToggle = () => {
    setLeftDrawerOpened(!leftDrawerOpened);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: theme.transitions.create('width')
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>
      <Sidebar drawerOpen={!matchDownMd} drawerToggle={handleLeftDrawerToggle} />
      <Main theme={theme} open={leftDrawerOpened}>
        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
        <Outlet />
      </Main>
    </Box>
  );
};

export default MainLayout;
