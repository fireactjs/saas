import React from "react";
import { List, ListItem, ListItemText, ListItemIcon, Divider } from "@material-ui/core";
import AppIcon from '@material-ui/icons/Apps';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ListAltIcon from '@material-ui/icons/ListAlt';

const AppMenu = () => {

    return (
        <List>
                <ListItem button key="Application">
                    <ListItemIcon><AppIcon /></ListItemIcon>
                    <ListItemText primary="Application" />
                </ListItem>
                <Divider />
                <ListItem button key="Profile">
                    <ListItemIcon><AccountBoxIcon /></ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button key="Activity Logs">
                    <ListItemIcon><ListAltIcon /></ListItemIcon>
                    <ListItemText primary="Activity Logs" />
                </ListItem>
            </List>
    )
}

export default AppMenu;