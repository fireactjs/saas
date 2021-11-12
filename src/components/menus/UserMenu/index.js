import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from '../../FirebaseAuth';
import { userSignOut } from '../../../libs/user';
import { IconButton, Menu, MenuItem, Avatar, Divider } from "@mui/material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const UserMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
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
                        <AccountBoxIcon style={{marginRight: '10px'}} />
                        Profile
                    </MenuItem>
                    <MenuItem onClick={(e)=>{
                        e.preventDefault();
                        handleClose();
                        history.push("/user/log");
                        }}>
                        <ListAltIcon style={{marginRight: '10px'}} />
                        Activity Logs
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => userSignOut()}>
                        <ExitToAppIcon style={{marginRight: '10px'}} />
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