import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from '../../FirebaseAuth';
import { userSignOut } from '../../../libs/user';
import UserAvatar from '../../UserAvatar';
import { IconButton, Menu, MenuItem, Avatar, Divider, Typography } from "@material-ui/core";
import { mergeClasses } from "@material-ui/styles";

const UserMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
                    <Link to="/user/profile" style={{textDecoration:'none'}}>
                        <MenuItem>
                            <Typography color="textPrimary">Profile</Typography>
                        </MenuItem>
                    </Link>
                    <Link to="/user/log" style={{textDecoration:'none'}}>
                        <MenuItem>
                            <Typography color="textPrimary">Activity Logs</Typography>
                        </MenuItem>
                    </Link>
                    <Divider />
                    <MenuItem onClick={() => userSignOut()}>Sign Out</MenuItem>
                </Menu>
                </>
            )}
        </AuthContext.Consumer>
        </>
    )
}

export default UserMenu;