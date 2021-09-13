import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from '../../FirebaseAuth';
import { userSignOut } from '../../../libs/user';
import { IconButton, Menu, MenuItem, Avatar, Divider, makeStyles } from "@material-ui/core";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const UserMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const useStyles = makeStyles((theme) => ({
        icon: {
            marginRight: theme.spacing(1),
        }
    }));
    const classes = useStyles();
    const history = useHistory();

    return (
        <>
        <AuthContext.Consumer>
            {(context) => (
                <>
                <IconButton 
                    ria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <Avatar alt={context.authUser.user.displayName} src={context.authUser.user.photoURL} />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={(e)=>{
                        e.preventDefault();
                        handleClose();
                        history.push("/user/profile");
                    }}>
                        <AccountBoxIcon className={classes.icon} />
                        Profile
                    </MenuItem>
                    <MenuItem onClick={(e)=>{
                        e.preventDefault();
                        handleClose();
                        history.push("/user/log");
                        }}>
                        <ListAltIcon className={classes.icon} />
                        Activity Logs
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => userSignOut()}>
                        <ExitToAppIcon className={classes.icon} />
                        Sign Out
                    </MenuItem>
                </Menu>
                </>
            )}
        </AuthContext.Consumer>
        </>
    )
}

export default UserMenu;