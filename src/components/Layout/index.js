import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { AppBar as MuiAppBar, Drawer as MuiDrawer, Toolbar, CssBaseline, Divider, IconButton, Box, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Logo from '../Logo';
import {BreadcrumbContext, Breadcrumb} from '../Breadcrumb';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Layout = ({drawerMenu, toolbarChildren, toolBarMenu, children}) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [breadcrumb, setBreadcrumb] = useState([]);

  return (
    <Box sx={{ display: 'flex'}}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
            <Toolbar>
              <div style={{paddingRight: '20px', display: open?"none":"inline-flex"}}><Logo /></div>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}
              >
                
                <MenuIcon />
              </IconButton>
                {toolbarChildren}
                <div style={{
                    marginLeft: "auto",
                    marginRight: "0px",
                }}>{toolBarMenu}</div>
            </Toolbar>
        </AppBar>
        <Drawer
            variant="permanent"
            open={open}
        >
          <DrawerHeader>
            {open && <div style={{marginLeft:'0px', marginRight:'auto', display:'inline-flex',alignItems: 'center', flexWrap: 'wrap',}}>
                <div style={{display: 'inline-flex', paddingRight: '20px'}}>
                    <Logo />
                </div>
                <h2>FIREACT</h2>
            </div>}
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
        <Divider />
            {drawerMenu}
        <Divider />
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, overflow:'hidden'}}>
            <DrawerHeader />
            <Box width={1} style={{position:"fixed", zIndex: '1200'}}>
                <Paper square>
                    <Box p={2}>
                    <Breadcrumb links={breadcrumb} />
                    </Box>
                </Paper>
            </Box>
            <div style={{position: 'relative'}}>
            <Box mt={10} ml={3} mr={3} mb={3}>
              <BreadcrumbContext.Provider value={{setBreadcrumb}}>
                  {children}
              </BreadcrumbContext.Provider>
            </Box>
            </div>
        </Box>
    </Box>
  );
}

export default Layout;