import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemIcon, Divider, Typography } from "@mui/material";
import { AuthContext } from '../../FirebaseAuth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';

const AccountMenu = () => {

    const { accountId } = useParams();

    const { userData } = useContext(AuthContext);

    useEffect(() => {
        document.querySelectorAll('.c-sidebar').forEach(element => {
            window.coreui.Sidebar._sidebarInterface(element)
        });
    })

    return (
        <List>
            <Link to={'/account/'+accountId+'/'} style={{textDecoration:'none'}}>
                <ListItem button key="Overview">
                    <ListItemIcon><DashboardIcon /></ListItemIcon>
                    <ListItemText primary={<Typography color="textPrimary">Overview</Typography>} />
                </ListItem>
            </Link>
            {userData.currentAccount.role === 'admin' && 
            <>
                <Divider />
                <Link to={'/account/'+accountId+'/users'} style={{textDecoration:'none'}}>
                    <ListItem button key="Users">
                        <ListItemIcon><PeopleIcon /></ListItemIcon>
                        <ListItemText primary={<Typography color="textPrimary">Users</Typography>} />
                    </ListItem>
                </Link>
                <Link to={'/account/'+accountId+'/billing'} style={{textDecoration:'none'}}>
                    <ListItem button key="Billing">
                        <ListItemIcon><PaymentIcon /></ListItemIcon>
                        <ListItemText primary={<Typography color="textPrimary">Billing</Typography>} />
                    </ListItem>
                </Link>
            </>
            }
        </List>
    )
}

export default AccountMenu;