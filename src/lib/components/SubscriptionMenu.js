import { Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { AuthContext, FireactContext } from "@fireactjs/core";
import { checkPermission } from "./utilities";
import { SubscriptionContext } from "./SubscriptionContext";
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

export const SubscriptionMenu = ({customItems}) => {
    const { config } = useContext(FireactContext);
    const pathnames = config.pathnames;
    const { subscription } = useContext(SubscriptionContext);
    const { authInstance } = useContext(AuthContext);
    const defaultPermissions = [];
    const adminPermissions = [];

    for(let permission in config.saas.permissions){
        if(config.saas.permissions[permission].default){
            defaultPermissions.push(permission);
        }
        if(config.saas.permissions[permission].admin){
            adminPermissions.push(permission);
        }
    }

    return (
        <List component="nav">
            {checkPermission(subscription, authInstance.currentUser.uid, defaultPermissions) && 
            <NavLink to={pathnames.Subscription.replace(":subscriptionId", subscription.id)} style={{textDecoration:'none'}} key="dashboard">
                <ListItemButton>
                    <ListItemIcon><DashboardIcon /></ListItemIcon>
                    <ListItemText primary={<Typography color="textPrimary">Dashboard</Typography>} />
                </ListItemButton>
            </NavLink>
            }
            {customItems}
            {checkPermission(subscription, authInstance.currentUser.uid, adminPermissions) && 
                <>
                    <Divider key="settings-divider"/>
                    <NavLink to={pathnames.Settings.replace(":subscriptionId", subscription.id)} style={{textDecoration:'none'}} key="settings">
                        <ListItemButton>
                            <ListItemIcon><SettingsApplicationsIcon /></ListItemIcon>
                            <ListItemText primary={<Typography color="textPrimary">Settings</Typography>} />
                        </ListItemButton>
                    </NavLink>
                    <Divider key="user-divider"/>
                    <NavLink to={pathnames.ListUsers.replace(":subscriptionId", subscription.id)} style={{textDecoration:'none'}} key="users">
                        <ListItemButton>
                            <ListItemIcon><PeopleIcon /></ListItemIcon>
                            <ListItemText primary={<Typography color="textPrimary">Users</Typography>} />
                        </ListItemButton>
                    </NavLink>
                    <Divider key="billing-divider"/>
                    <NavLink to={pathnames.ListInvoices.replace(":subscriptionId", subscription.id)} style={{textDecoration:'none'}} key="billing">
                        <ListItemButton>
                            <ListItemIcon><MonetizationOnIcon /></ListItemIcon>
                            <ListItemText primary={<Typography color="textPrimary">Billing</Typography>} />
                        </ListItemButton>
                    </NavLink>
                </>
            }
        </List>
    )
}