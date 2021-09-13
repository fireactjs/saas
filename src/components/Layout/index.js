import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Drawer, AppBar, Toolbar, CssBaseline, Divider, IconButton, Box, Paper } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Logo from '../Logo';
import {BreadcrumbContext, Breadcrumb} from '../Breadcrumb';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    //padding: theme.spacing(3),
  },
}));

const Layout = ({drawerMenu, toolbarChildren, toolBarMenu, children}) => {
  const classes = useStyles();
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
    <div className={classes.root}>
        <CssBaseline />
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
            })}
        >
            <Toolbar>
                <div
                    className={clsx(classes.menuButton, {
                        [classes.hide]: open,
                    })}
                >
                    <div style={{
                        display: 'inline-flex',
                        overflow: 'visible',
                        alignItems: 'center',
                        position: 'relative',
                    }}>
                        <div style={{display: 'inline-flex', paddingRight: '20px'}}><Logo /></div>
                        <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerOpen}
                        >
                            <MenuIcon  />
                        </IconButton>
                    </div> 
                </div>
                {toolbarChildren}
                <div style={{
                    marginLeft: "auto",
                    marginRight: "0px",
                }}>{toolBarMenu}</div>
            </Toolbar>
        </AppBar>
        <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            classes={{
            paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            }),
            }}
        >
        <div className={classes.toolbar}>
            {open && <div style={{marginLeft:'0px', marginRight:'auto', display:'inline-flex',alignItems: 'center', flexWrap: 'wrap',}}>
                <div style={{display: 'inline-flex', paddingRight: '20px'}}>
                    <Logo />
                </div>
                <h2>FIREACT</h2>
            </div>}
            <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
        </div>
        <Divider />
            {drawerMenu}
        <Divider />
        </Drawer>
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Box width={1} style={{position:'fixed'}}>
                <Paper square>
                    <Box p={2}>
                    <Breadcrumb links={breadcrumb} />
                    </Box>
                </Paper>
            </Box>
            <Box mt={10} ml={3} mr={3} mb={3}>
            <BreadcrumbContext.Provider value={{setBreadcrumb}}>
                {children}
            </BreadcrumbContext.Provider>
            </Box>
        </main>
    </div>
  );
}

export default Layout;